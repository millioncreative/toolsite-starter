import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['en', 'zh'] as const;
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

for (const locale of locales) {
  test(`QR tool works for ${locale}`, async ({ page }) => {
    await page.goto(resolvePath(`/${locale}/tools/qr/`));
    await page.getByLabel(/(Text or URL|文本或链接)/).fill('hello world');
    await page.getByRole('button', { name: /Generate|生成/ }).click();
    const qrImage = page.getByRole('img', { name: /(QR code|二维码)/ });
    await expect(qrImage).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /^PNG$/ }).click()
    ]);
    expect(await download.path()).toBeTruthy();
  });
}
