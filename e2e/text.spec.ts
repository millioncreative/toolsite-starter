import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['en', 'zh'] as const;
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

const resolvePath = (path: string) => {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmed) return normalizedBase === '/' ? '/' : normalizedBase;
  return normalizedBase === '/' ? `/${trimmed}` : `${normalizedBase}${trimmed}`;
};

for (const locale of locales) {
  test(`Text formatter works for ${locale}`, async ({ page }) => {
    page.on('console', (msg) => {
      console.log(`[browser:${msg.type()}] ${msg.text()}`);
    });
    page.on('pageerror', (err) => {
      console.log(`[pageerror] ${err?.message || String(err)}`);
    });

    await page.goto(resolvePath(`/${locale}/tools/text/`));
    await page.waitForLoadState('domcontentloaded');

    const input = page.locator('#tf-input');
    await input.fill('hello   world\n\nApple\nbanana\napple\n');

    const toggles = ['#op-trim', '#op-collapse', '#op-rmblank', '#op-dedupe'];
    for (const selector of toggles) {
      await page.locator(selector).check();
    }

    await page.locator('#op-case').selectOption('upper');
    await page.locator('#op-sort').selectOption('asc');

    await page.locator('#btn-format').click();

    await page.waitForFunction(
      () => document.body.getAttribute('data-text-ready') === 'true',
      { timeout: 10_000 }
    );

    const preview = page.locator('#tf-preview pre');
    await expect(preview).toHaveText('APPLE\nBANANA\nHELLO WORLD');

    await expect(page.locator('#btn-copy')).not.toBeDisabled();
    await expect(page.locator('#btn-download')).not.toBeDisabled();
  });
}
