import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const siteUrl = 'https://www.webgrouth.com';
const staticPages = [
  '',
  'guest-posting',
  'link-insertion',
  'seo-services',
  'about',
  'contact',
  'order',
  'blog',
  'guarantee-policy',
  'privacy',
  'terms',
] as const;

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const urls = [
    ...staticPages.map((path) => ({
      loc: path ? `${siteUrl}/${path}` : `${siteUrl}/`,
      lastmod: '2026-09-02',
    })),
    ...posts.map((post) => ({
      loc: `${siteUrl}/blog/${post.id}`,
      lastmod: post.data.date.toISOString().slice(0, 10),
    })),
  ];

  const body = urls
    .map(({ loc, lastmod }) => `  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
