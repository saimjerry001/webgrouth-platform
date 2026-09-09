import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { parse } from 'parse5';

const root = resolve('dist');
const SITE = 'https://www.webgrouth.com';
const failures = [];
const warnings = [];
const pages = new Map();
const preview = process.env.VERCEL_ENV === 'preview';
const utilityPaths = new Set(['/404', '/order-success', '/contact-success']);
const textOf = n => n.nodeName === '#text' ? n.value : ['script', 'style'].includes(n.tagName) ? '' : (n.childNodes ?? []).map(textOf).join(' ');
const rawText = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(rawText).join('');
const attrs = n => Object.fromEntries((n.attrs ?? []).map(a => [a.name, a.value]));
const walk = function* (n) { yield n; for (const c of n.childNodes ?? []) yield* walk(c); };
const clean = s => s.replace(/\s+/g, ' ').trim();
const files = async dir => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(async x => x.isDirectory() ? files(join(dir, x.name)) : [join(dir, x.name)]))).flat();
const canonicalPath = file => '/' + relative(root, file).replaceAll('\\', '/').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
const exists = async file => { try { await access(file); return true; } catch { return false; } };
const fail = (path, message) => failures.push(`${path}: ${message}`);
for (const file of (await files(root)).filter(file => file.endsWith('.html'))) {
  const path = canonicalPath(file);
  const html = await readFile(file, 'utf8');
  const nodes = [...walk(parse(html))];
  const find = name => nodes.filter(n => n.tagName === name);
  const meta = name => attrs(find('meta').find(n => attrs(n).name === name || attrs(n).property === name) ?? {}).content;
  const h1 = find('h1');
  const title = clean(textOf(find('title')[0] ?? {}));
  const description = meta('description') ?? '';
  const canonical = find('link').filter(n => attrs(n).rel === 'canonical').map(n => attrs(n).href);
  const noindex = (meta('robots') ?? '').includes('noindex');
  const links = find('a').map(attrs);
  const ids = new Set(nodes.map(n => attrs(n).id).filter(Boolean));
  const shouldIndex = !utilityPaths.has(path);
  pages.set(path, { path, title, description, canonical: canonical[0], noindex, shouldIndex, ids, links, words: clean(textOf(find('main')[0] ?? {})).split(' ').filter(Boolean).length });
  if (h1.length !== 1) fail(path, `Expected one H1; found ${h1.length}`);
  if (!title) fail(path, 'Missing title');
  if (!description) fail(path, 'Missing meta description');
  if (canonical.length !== 1 || canonical[0] !== SITE + path) fail(path, 'Canonical does not match clean preferred URL');
  if ((preview || !shouldIndex) !== noindex) fail(path, 'Unexpected robots indexing directive');
  if (!find('html').some(n => attrs(n).lang === 'en')) fail(path, 'Missing document language');
  if (!meta('viewport')) fail(path, 'Missing mobile viewport');
  for (const name of ['og:title', 'og:description', 'og:image', 'twitter:image']) if (!meta(name)) fail(path, `Missing ${name}`);
  if (meta('og:url') !== canonical[0]) fail(path, 'Open Graph URL differs from canonical');
  const imageUrl = new URL(meta('og:image') ?? '/', SITE);
  if (imageUrl.origin === SITE && !(await exists(join(root, decodeURIComponent(imageUrl.pathname))))) fail(path, 'Social image is missing');
  const schemaNodes = find('script').filter(n => attrs(n).type === 'application/ld+json');
  if (!schemaNodes.length) fail(path, 'No structured data');
  const schemas = [];
  for (const n of schemaNodes) {
    try { schemas.push(JSON.parse(rawText(n))); } catch { fail(path, 'Structured data is invalid JSON'); }
  }
  const entities = schemas.flatMap(s => s['@graph'] ?? [s]);
  const article = entities.find(s => s['@type'] === 'BlogPosting');
  if (path.startsWith('/blog/')) {
    if (!article) fail(path, 'Missing BlogPosting');
    else {
      for (const key of ['headline', 'datePublished', 'dateModified', 'image', 'author']) if (!article[key]) fail(path, `Article missing ${key}`);
      if (!article.author?.name || !article.author?.url || !article.author?.['@type']) fail(path, 'Article author is incomplete');
      if (new Date(article.dateModified) < new Date(article.datePublished)) fail(path, 'Article modification date precedes publication');
    }
  }
  if (shouldIndex && path !== '/' && !entities.some(s => s['@type'] === 'BreadcrumbList')) fail(path, 'Missing breadcrumb structured data');
  for (const img of find('img')) {
    const a = attrs(img);
    if (!Object.hasOwn(a, 'alt')) fail(path, 'Image missing alt attribute');
    if (!a.width || !a.height) fail(path, 'Image missing reserved dimensions');
    if (a.src?.startsWith('/') && !(await exists(join(root, a.src)))) fail(path, `Missing image ${a.src}`);
    if (a.src?.endsWith('.png')) fail(path, 'Page still serves an unoptimized PNG');
    if (a.srcset && !a.sizes) fail(path, 'Responsive image has no sizes');
    for (const variant of (a.srcset ?? '').split(',').filter(Boolean)) {
      const src = variant.trim().split(/\s+/)[0];
      if (src.startsWith('/') && !(await exists(join(root, src)))) fail(path, `Missing srcset image ${src}`);
    }
  }
  if (/chatgpt\.com|generated by (?:ai|openai)|utm_source=chatgpt/i.test(html)) fail(path, 'Unwanted tool attribution or referral URL');
  if (title.length > 70) warnings.push(`${path}: title ${title.length} characters; display length is not a ranking threshold`);
}
for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const page of pages.values()) {
    if (seen.has(page[field])) fail(page.path, `Duplicate ${field} also used on ${seen.get(page[field])}`);
    seen.set(page[field], page.path);
  }
}
const inbound = new Set(['/']);
for (const page of pages.values()) {
  for (const link of page.links) {
    if (!link.href || /^(mailto:|tel:|javascript:|data:)/.test(link.href)) continue;
    let url; try { url = new URL(link.href, SITE + page.path); } catch { fail(page.path, `Invalid link ${link.href}`); continue; }
    if (url.origin !== SITE) continue;
    const targetPath = decodeURIComponent(url.pathname).replace(/\/$/, '') || '/';
    const target = pages.get(targetPath);
    if (target) {
      if (page.shouldIndex && page.path !== targetPath) inbound.add(targetPath);
      if (url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1)))) fail(page.path, `Broken anchor ${link.href}`);
    } else if (!(await exists(join(root, targetPath)))) fail(page.path, `Broken internal link ${link.href}`);
  }
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));
if (new Set(locations).size !== locations.length) fail('sitemap.xml', 'Duplicate URLs');
for (const url of locations) {
  if (!url.startsWith(SITE + '/')) fail('sitemap.xml', `Unexpected host ${url}`);
  if (!pages.get(new URL(url).pathname)?.shouldIndex) fail('sitemap.xml', `Unknown or excluded URL ${url}`);
}
for (const page of pages.values()) {
  if (!page.shouldIndex) continue;
  if (!locations.includes(SITE + page.path)) fail(page.path, 'Page absent from sitemap');
  if (!inbound.has(page.path)) fail(page.path, 'No internal incoming link');
}
const robots = await readFile(join(root, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`) || /^Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'Sitemap missing or site blocked');
const feed = await readFile(join(root, 'rss.xml'), 'utf8');
if ((feed.match(/<item>/g) ?? []).length !== [...pages.keys()].filter(p => p.startsWith('/blog/')).length) fail('rss.xml', 'Article count mismatch');
const imageManifest = JSON.parse(await readFile('src/generated/images.json', 'utf8'));
const imageSavings = Object.entries(imageManifest).map(([name, item]) => ({ name, originalBytes: item.original.bytes, servedBytes: item.fallback.bytes, width: item.fallback.width, reductionPercent: Math.round(100 * (1 - item.fallback.bytes / item.original.bytes)) }));
const result = { checkedAt: new Date().toISOString(), preview, htmlPages: pages.size, indexablePages: locations.length, failures, warnings, imageSavings, pages: [...pages.values()].map(({ path, title, words, shouldIndex }) => ({ path, title, words, shouldIndex })) };
await mkdir('reports', { recursive: true });
await writeFile('reports/build-seo.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
