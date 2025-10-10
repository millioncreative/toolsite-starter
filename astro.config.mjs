import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'http://localhost:4321';
const base = process.env.CI
  ? '/'
  : process.env.GITHUB_PAGES === 'true'
    ? '/toolsite-starter/'
    : '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh', en: 'en' },
      },
    }),
  ],
});
