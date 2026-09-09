import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { canonicalUrl, SITE_URL } from '../lib/seo';
import { escapeXml } from '../lib/xml';

export const prerender = true;
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const items = posts.map(post => {
    const url = escapeXml(canonicalUrl(`/blog/${post.id}`));
    return `<item><title>${escapeXml(post.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(post.data.description)}</description><category>${escapeXml(post.data.category)}</category><pubDate>${post.data.date.toUTCString()}</pubDate></item>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Web Grouth Journal</title><link>${SITE_URL}/blog</link><description>Practical guest posting and link building guides for agencies and businesses worldwide.</description><language>en</language><atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>${items.join('')}</channel></rss>\n`, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
