import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import sharp from 'sharp';

// Keep original public URLs working while serving appropriately sized WebP files.
const sources = ['webgrouth-hero', 'webgrouth-publishing', 'webgrouth-strategy'];
const output = resolve('public/images/responsive');
await mkdir(output, { recursive: true });
await mkdir(resolve('src/generated'), { recursive: true });
const manifest = {};
for (const name of sources) {
  const input = resolve(`public/images/${name}.png`);
  const source = await readFile(input);
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Missing dimensions: ${name}`);
  const widths = [...new Set([160, 320, 640, 960, 1280, 1600].map(w => Math.min(w, metadata.width)))].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const filename = `${name}-${width}.webp`;
    const file = resolve(output, filename);
    const info = await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 4 }).toFile(file);
    variants.push({ src: `/images/responsive/${filename}`, width: info.width, height: info.height, bytes: (await stat(file)).size });
  }
  const fallback = [...variants].reverse().find(v => v.width <= 1280) ?? variants[0];
  manifest[`/images/${name}.png`] = { original: { width: metadata.width, height: metadata.height, bytes: source.length }, variants, fallback };
  console.log(`${basename(input)}: ${source.length} bytes -> ${fallback.bytes} bytes at ${fallback.width}px`);
}
await writeFile(resolve('src/generated/images.json'), JSON.stringify(manifest, null, 2) + '\n');
