import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'node:path';
import { basePath, site } from './project.config.js';

export default defineConfig({
  site,
  base: basePath,
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap()
  ],
  vite: {
    resolve: {
      alias: {
        qrcode: path.resolve('./src/vendor/qrcode.ts')
      }
    }
  }
});
