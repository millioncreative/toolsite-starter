import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['en', 'zh'] as const;
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

const resolvePath = (path: string) => {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmed) return normalizedBase === '/' ? '/' : normalizedBase;
  return normalizedBase === '/' ? `/${trimmed}` : `${normalizedBase}${trimmed}`;
};

// 兼容多种渲染方式的预览选择器；只是“可选校验”
const previewSelector =
  'canvas[role="img"], svg[role="img"], img[role="img"], canvas, svg, img';

// 匹配“可点击的下载按钮”，优先抓 id，如不存在再用文案
const enabledDownloadBtnSelector = [
  // 有 id 的情况
  '#btn-png:not([disabled])',
  '#btn-svg:not([disabled])',
  // 退化到 button 文案（中英文）
  'button:has-text("PNG"):not([disabled])',
  'button:has-text("SVG"):not([disabled])',
].join(', ');

for (const locale of locales) {
  test(`QR tool works for ${locale}`, async ({ page }) => {
    await page.goto(resolvePath(`/${locale}/tools/qr/`));

    // 填写输入（匹配中英关键词，避免标签细节差异）
    await page.getByLabel(/(Text|URL|文本|链接)/).fill('hello world');

    // 点击“生成”
    await page.getByRole('button', { name: /Generate|生成/ }).click();

    // 预览（软断言，不决定通过与否）
    const preview = page.locator(previewSelector).first();
    await preview.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    if (await preview.count()) {
      await expect.soft(preview).toBeVisible();
    }

    // 等到任一下载按钮（PNG/SVG）变为可点
    const anyEnabledDownload = page.locator(enabledDownloadBtnSelector).first();
    await anyEnabledDownload.waitFor({ state: 'visible', timeout: 15000 });

    // 如果 PNG 可点优先点 PNG；否则回退到 SVG
    const pngBtn = page.locator(
      '#btn-png:not([disabled]), button:has-text("PNG"):not([disabled])'
    ).first();
    const clickTarget = (await pngBtn.count()) ? pngBtn : anyEnabledDownload;

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      clickTarget.click(),
    ]);

    // 确认下载真实落盘
    expect(await download.path()).toBeTruthy();
  });
}
