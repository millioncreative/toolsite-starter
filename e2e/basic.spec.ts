import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['zh', 'en'] as const;
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

const resolvePath = (path: string) => {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmed) {
    return normalizedBase === '/' ? '/' : normalizedBase;
  }
  if (normalizedBase === '/') {
    return `/${trimmed}`;
  }
  return `${normalizedBase}${trimmed}`;
};

test.describe('Toolsite Starter pages', () => {
  for (const locale of locales) {
    test(`home page renders primary content for ${locale}`, async ({ page }) => {
      await page.goto(resolvePath(`/${locale}/`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();
    });

    test(`tools page displays tool list for ${locale}`, async ({ page }) => {
      await page.goto(resolvePath(`/${locale}/tools/`));
      const main = page.locator('main');
      await expect(main).toBeVisible();
      await expect(main.locator('h1, h2').first()).toBeVisible();
    });
  }
});
