import { defineCollection, z } from 'astro:content';
import { locales } from '../i18n/config';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    lang: z.enum(locales),
    published: z.date()
  })
});

export const collections = { blog };
