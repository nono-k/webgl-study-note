import { defineCollection, z } from 'astro:content';

const webgl = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      category: z.string(),
      order: z.number(),
    }),
});

const glsl = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      category: z.string(),
      order: z.number(),
    }),
});

export const collections = { webgl, glsl };
