import { test, expect } from '@playwright/test';

const locales = ['zh', 'en'] as const;

test.describe('localized routes', () => {
  for (const locale of locales) {
    test(`${locale} home renders`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('link', { name: /blog/i })).toBeVisible();
    });

    test(`${locale} tools renders`, async ({ page }) => {
      await page.goto(`/${locale}/tools/`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`/${locale}/tools/`));
    });
  }
});
