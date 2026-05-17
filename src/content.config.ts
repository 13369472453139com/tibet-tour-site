import { defineCollection, z } from 'astro:content';

const tours = defineCollection({
  type: 'content',
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
    date: z.string(),  // 改为字符串，兼容 "2026-05-17" 格式
    slug: z.string(),
    image: z.string().optional(),  // 可选字段
  }),
});

export const collections = { tours, blog };
