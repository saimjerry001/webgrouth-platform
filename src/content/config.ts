import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Web Grouth'),
    readTime: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  blog,
};
