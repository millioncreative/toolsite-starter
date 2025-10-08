import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://millioncreative.github.io',
  base: '/toolsite-starter/',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh', en: 'en' },
      },
    }),
  ],
});
