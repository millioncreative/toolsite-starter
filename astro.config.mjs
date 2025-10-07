import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://toolsite-starter.example.com',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh',
          en: 'en'
        }
      }
    })
  ]
});
