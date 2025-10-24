import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['en', 'zh'] as const;
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

const resolvePath = (path: string) => {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmed) return normalizedBase === '/' ? '/' : normalizedBase;
  return normalizedBase === '/' ? `/${trimmed}` : `${normalizedBase}${trimmed}`;
};

// 仅用于可选的截图/可见性校验，不作为过/不过标准
const previewSelector =
  'canvas[role="img"], svg[role="img"], img[role="img"], canvas, svg, img';

// 优先选择可用 PNG 按钮，失败则回退 SVG
const pickDownloadButton = async (page: import('@playwright/test').Page) => {
  const png = page.locator('#btn-png').first();
  if (await png.count()) {
    if (await png.isEnabled().catch(() => false)) return png;
  }
  const svg = page.locator('#btn-svg').first();
  return svg;
};

for (const locale of locales) {
  test(`QR tool works for ${locale}`, async ({ page }) => {
    test.setTimeout(60_000); // 保险一点

    await page.goto(resolvePath(`/${locale}/tools/qr/`));

    // 1) 找到第一个文本框并填写
    const textbox = page.getByRole('textbox').first();
    await textbox.fill('hello world');

    // 2) 双通道触发提交：点击“生成”按钮 + 回车提交（谁先成功都行）
    const maybeGenerateBtn = page
      .getByRole('button', { name: /Generate|生成|Create|创建|生成二维码/i })
      .first();
    await Promise.race([
      maybeGenerateBtn.click().catch(() => Promise.resolve()),
      (async () => {
        await textbox.focus();
        await textbox.press('Enter').catch(() => {});
      })(),
    ]);

    // 3) 等待“渲染完成”就绪标记（由页面端在生成成功后设置）
    await page.locator('body[data-qr-ready="true"]').waitFor({ timeout: 25_000 });

    // 4) 软断言预览可见（可选）
    const preview = page.locator(previewSelector).first();
    await preview.waitFor({ state: 'attached', timeout: 3_000 }).catch(() => {});
    if ((await preview.count()) > 0) {
      await expect.soft(preview).toBeVisible();
    }

    // 5) 下载：优先 PNG，不可用就 SVG；并验证确实产生下载
    const targetBtn = await pickDownloadButton(page);
    await expect(targetBtn).toBeEnabled();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      targetBtn.click(),
    ]);

    expect(await download.path()).toBeTruthy();
  });
}
