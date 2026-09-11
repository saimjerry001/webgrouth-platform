# Publishing an article

The blog uses one shared article template. Each Markdown file in
`src/content/blog/` becomes its own `/blog/<filename>` page when the site builds.
The same content automatically appears in the blog listing, related articles,
RSS feed, and XML sitemap. Do not create a separate Astro page for each post.

1. Add the cover image to `public/images/blog/`, using a descriptive filename
   such as `article-topic.jpg`. JPEG, PNG, WebP, and AVIF are supported. Images
   are discovered automatically and resized for cards and article pages.
2. Add `src/content/blog/article-topic.md` with the metadata below, followed by
   the article body. The filename controls the public URL.
3. Use `##` for article sections and `###` for subsections. The template displays
   the title as the page's only H1 and creates the sidebar contents automatically.
4. Commit the article and image together. Vercel builds and publishes the page
   through the repository's existing deployment workflow. Changes are live after
   that deployment succeeds, rather than the moment a local file is saved.

```yaml
---
title: "Your article title"
description: "A short, accurate summary of the article."
category: "Link Building"
date: 2026-09-11
author: "Web Grouth"
readTime: "8 min read"
image: "/images/blog/article-topic.jpg"
imageAlt: "Describe the cover image."
---
```

Keep the article body after the closing `---`. Do not paste a second H1 or SEO
editorial notes into the body. Use the actual publication date; add
`updatedDate` only for a later substantive update. Estimate reading time from
the article's word count at approximately 200 words per minute.

If the search title should differ from the visible article heading, add the
optional `seoTitle` field to the metadata. Its exact text becomes the page's
search and social title; the article heading continues to use `title`.

The article sidebar, cover position, typography, offer, and mobile layout are
shared across posts. Related articles appear as more posts are published; with
one article, empty related sections and repeated listing carousels stay hidden.

Removing a Markdown file removes its page, listing entry, RSS item and sitemap
entry on the next deployment. Update any internal links pointing to that post.
An old URL without a direct replacement returns the site's normal 404 page.

The existing `npm run build` command also checks headings, metadata, internal
links, image files, article schema, sitemap entries, and RSS counts before a
release can pass.
