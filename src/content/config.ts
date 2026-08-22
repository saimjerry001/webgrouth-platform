import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Web Grouth Editorial'),
    category: z.enum(['SEO', 'Guest Posting', 'Link Building', 'Content Marketing', 'Digital PR']),
    tags: z.array(z.string()).default([]),
    image: z.string(),
    imageAlt: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
