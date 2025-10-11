// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// 允许 frontmatter 里的日期既可以写成字符串也可以是 Date
const asDate = z.preprocess(
  (val) => (typeof val === 'string' ? new Date(val) : val),
  z.date()
);

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: asDate.optional(),
    updatedDate: asDate.optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    // 如果你在文章里有语言字段，可以放开这一行：
    // lang: z.enum(['en', 'zh']).optional(),
  }),
});

// Astro v4 期望导出名为 "collections" 的常量
export const collections = { blog };
