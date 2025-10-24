import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['en', 'zh'] as const;
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

const resolvePath = (path: string) => {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmed) return normalizedBase === '/' ? '/' : normalizedBase;
  return normalizedBase === '/' ? `/${trimmed}` : `${normalizedBase}${trimmed}`;
};

// 统一的预览定位器：兼容 canvas/svg/img，并尽量依赖 role 但不强制名称
const previewSelector =
  'canvas[role="img"], svg[role="img"], img[role="img"], canvas, svg, img';

for (const locale of locales) {
  test(`QR tool works for ${locale}`, async ({ page }) => {
    await page.goto(resolvePath(`/${locale}/tools/qr/`));

    // 输入文本
    await page.getByLabel(/(Text|URL|文本|链接)/).fill('hello world');

    // 生成二维码
    await page.getByRole('button', { name: /Generate|生成/ }).click();

    // 等待预览元素出现并可见（不再限定 aria-label 的具体文案）
    const preview = page.locator(previewSelector).first();
    await expect(preview).toBeVisible();

    // 触发 PNG 下载并校验确实下载到了文件
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /^PNG$/ }).click(),
    ]);
    expect(await download.path()).toBeTruthy();
  });
}
