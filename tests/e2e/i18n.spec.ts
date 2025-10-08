import { test, expect } from '@playwright/test';

const locales = ['en', 'zh'] as const;
const labels = {
  zh: { blog: '博客', tools: '工具' },
  en: { blog: 'Blog', tools: 'Tools' }
} as const;
const labelFor = (loc: 'en' | 'zh') => (loc === 'en' ? '简体中文' : 'English');
const otherOf = (loc: 'en' | 'zh') => (loc === 'en' ? 'zh' : 'en');

test.describe('localized routes', () => {
  for (const locale of locales) {
    test(`${locale} home renders`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      const nav = page.getByRole('navigation', { name: 'Primary' });
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(
        nav.getByRole('link', { name: labels[locale].blog, exact: true })
      ).toBeVisible();
    });

    test(`${locale} tools renders`, async ({ page }) => {
      await page.goto(`/${locale}/tools/`);
      const nav = page.getByRole('navigation', { name: 'Primary' });
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(
        nav.getByRole('link', { name: labels[locale].tools, exact: true })
      ).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`/${locale}/tools/`));
    });

    test(`${locale} header has single opposite-language toggle`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      const nav = page.getByRole('navigation');
      const toggle = nav.getByRole('link', { name: labelFor(locale), exact: true });
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveCount(1);

      const before = new URL(await page.url());
      await toggle.click();

      const after = new URL(await page.url());
      expect(after.pathname.replace(/^\/(en|zh)/, '')).toBe(
        before.pathname.replace(/^\/(en|zh)/, '')
      );
      expect(after.pathname.startsWith(`/${otherOf(locale)}/`)).toBeTruthy();
    });

    test(`${locale} tools page toggle works`, async ({ page }) => {
      await page.goto(`/${locale}/tools/`);
      const nav = page.getByRole('navigation');
      const toggle = nav.getByRole('link', { name: labelFor(locale), exact: true });
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveCount(1);

      const before = new URL(await page.url());
      await toggle.click();
      const after = new URL(await page.url());

      expect(after.pathname.replace(/^\/(en|zh)/, '')).toBe(
        before.pathname.replace(/^\/(en|zh)/, '')
      );
      expect(after.pathname.startsWith(`/${otherOf(locale)}/`)).toBeTruthy();
    });
  }
});
