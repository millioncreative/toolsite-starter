import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://toolsite-starter.example.com',
  integrations: [
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
