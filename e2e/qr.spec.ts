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
  test(`QR tool works for ${locale}`, async ({ page }) => {
    // 进入页面
    await page.goto(resolvePath(`/${locale}/tools/qr/`));

    // 页面加载基本要素（避免还没渲染完就操作）
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // 填入文本并点击生成
    await page.getByLabel(/(Text|URL|文本|链接)/).fill('hello world');
    await page.getByRole('button', { name: /Generate|生成/ }).click();

    // 直接验证“下载 PNG”是否成功（功能闭环）
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /^PNG$/ }).click(),
    ]);

    // 确认 Playwright 收到真实文件
    expect(await download.path()).toBeTruthy();
  });
}
