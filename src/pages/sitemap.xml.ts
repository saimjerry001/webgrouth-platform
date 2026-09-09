import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { seoPages } from '../data/seo-pages';
import { canonicalUrl, SITE_URL } from '../lib/seo';
import { escapeXml } from '../lib/xml';
import images from '../generated/images.json';

export const prerender = true;
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const staticUrls = seoPages.map(page => `<url><loc>${escapeXml(canonicalUrl(page.path))}</loc>${'lastmod' in page ? `<lastmod>${page.lastmod}</lastmod>` : ''}</url>`);
  const articleUrls = posts.map(post => {
    const image = images[post.data.image as keyof typeof images].fallback;
    const modified = (post.data.updatedDate ?? post.data.date).toISOString().slice(0, 10);
    return `<url><loc>${escapeXml(canonicalUrl(`/blog/${post.id}`))}</loc><lastmod>${modified}</lastmod><image:image><image:loc>${escapeXml(new URL(image.src, SITE_URL).toString())}</image:loc></image:image></url>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${[...staticUrls, ...articleUrls].join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
