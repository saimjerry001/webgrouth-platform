import { mkdir, readFile, writeFile, stat, readdir } from 'node:fs/promises';
import { resolve, basename, relative, dirname, extname, sep } from 'node:path';
import sharp from 'sharp';

// Keep original public URLs working while serving appropriately sized WebP files.
const imageRoot = resolve('public/images');
const output = resolve('public/images/responsive');
const findImages = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = resolve(directory, entry.name);
    if (path === output) continue;
    if (entry.isDirectory()) paths.push(...await findImages(path));
    else if (/\.(png|jpe?g|webp|avif)$/i.test(entry.name)) paths.push(path);
  }
  return paths;
};
// New article images are discovered at build time; no template edits are needed.
const sources = await findImages(imageRoot);
await mkdir(output, { recursive: true });
await mkdir(resolve('src/generated'), { recursive: true });
const manifest = {};
const outputNames = new Set();
for (const input of sources) {
  const sourcePath = relative(imageRoot, input).split(sep).join('/');
  const name = sourcePath.slice(0, -extname(sourcePath).length);
  if (outputNames.has(name)) throw new Error(`Images must have unique names within their folder: ${name}`);
  outputNames.add(name);
  const source = await readFile(input);
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Missing dimensions: ${name}`);
  const sourceWidth = metadata.autoOrient?.width ?? metadata.width;
  const widths = [...new Set([160, 320, 640, 960, 1280, 1600].map(w => Math.min(w, sourceWidth)))].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const filename = `${name}-${width}.webp`;
    const file = resolve(output, filename);
    await mkdir(dirname(file), { recursive: true });
    const info = await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 4 }).toFile(file);
    variants.push({ src: `/images/responsive/${filename}`, width: info.width, height: info.height, bytes: (await stat(file)).size });
  }
  const fallback = [...variants].reverse().find(v => v.width <= 1280) ?? variants[0];
  manifest[`/images/${sourcePath}`] = { original: { width: metadata.width, height: metadata.height, bytes: source.length }, variants, fallback };
  console.log(`${basename(input)}: ${source.length} bytes -> ${fallback.bytes} bytes at ${fallback.width}px`);
}
await writeFile(resolve('src/generated/images.json'), JSON.stringify(manifest, null, 2) + '\n');
