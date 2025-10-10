import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = process.env.PUBLIC_SITE || 'http://localhost:4321';
const BASE = process.env.PUBLIC_BASE || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
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
