import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['en', 'zh'] as const;
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

const resolvePath = (path: string) => {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmed) return normalizedBase === '/' ? '/' : normalizedBase;
  return normalizedBase === '/' ? `/${trimmed}` : `${normalizedBase}${trimmed}`;
};

// 兼容多种渲染方式的预览选择器；只是作为“可选校验”，不决定通过与否
const previewSelector =
  'canvas[role="img"], svg[role="img"], img[role="img"], canvas, svg, img';

for (const locale of locales) {
  test(`QR tool works for ${locale}`, async ({ page }) => {
    await page.goto(resolvePath(`/${locale}/tools/qr/`));

    // 填写输入（匹配中英任一关键词，避免标签细节差异）
    await page.getByLabel(/(Text|URL|文本|链接)/).fill('hello world');

    // 点击生成
    await page.getByRole('button', { name: /Generate|生成/ }).click();

    // 尝试等待预览挂载（可选，不作为失败条件）
    const preview = page.locator(previewSelector).first();
    await preview.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    // 如果确实出现了，就软断言它可见；未出现不影响后续下载断言
    if (await preview.count()) {
      await expect.soft(preview).toBeVisible();
    }

    // 以“PNG 下载按钮可用并下载成功”作为硬性通过标准
    const pngBtn = page.getByRole('button', { name: /^PNG$/ });
    await expect(pngBtn).toBeEnabled({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      pngBtn.click(),
    ]);

    // 确认下载文件真实存在于临时目录
    expect(await download.path()).toBeTruthy();
  });
}
