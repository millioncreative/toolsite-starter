import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
      cover: image().optional(),
      lang: z.enum(['zh', 'en'])
    }),
  slug: ({ id }) => id.replace(/^blog\//, '')
});

export const collections = { blog };
