import { defineCollection, z } from 'astro:content';

const tours = defineCollection({
  type: 'content', // 加载 .md 和 .mdx 文件
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    duration: z.string(),
    image: z.string(),
    slug: z.string(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    slug: z.string(),
  }),
});

export const collections = { tours, blog };
