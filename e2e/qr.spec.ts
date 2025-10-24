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

// 在页面上下文里判断“是否有任一下载按钮可用”
const waitForAnyDownloadEnabled = async (page: import('@playwright/test').Page, timeoutMs = 20000) => {
  await page.waitForFunction(
    () => {
      const pick = () => {
        const cands: (HTMLButtonElement | null)[] = [
          document.querySelector<HTMLButtonElement>('#btn-png'),
          document.querySelector<HTMLButtonElement>('#btn-svg'),
          [...document.querySelectorAll<HTMLButtonElement>('button')].find(
            (b) => /png/i.test(b.textContent ?? '')
          ) ?? null,
          [...document.querySelectorAll<HTMLButtonElement>('button')].find(
            (b) => /svg/i.test(b.textContent ?? '')
          ) ?? null,
        ].filter(Boolean) as HTMLButtonElement[];
        // 任一个存在并且未 disabled 即认为可用
        return cands.some((b) => !b.disabled && !b.hasAttribute('disabled'));
      };
      return pick();
    },
    { timeout: timeoutMs }
  );
};

// 返回优先 PNG 的“已可点”的按钮 locator；若没有则返回 SVG
const pickEnabledDownloadButton = async (page: import('@playwright/test').Page) => {
  const png = page.locator(
    '#btn-png:not([disabled]), button:has-text("PNG"):not([disabled])'
  ).first();
  if (await png.count()) {
    const enabled = await png.isEnabled().catch(() => false);
    if (enabled) return png;
  }
  const svg = page
    .locator('#btn-svg:not([disabled]), button:has-text("SVG"):not([disabled])')
    .first();
  return svg;
};

for (const locale of locales) {
  test(`QR tool works for ${locale}`, async ({ page }) => {
    await page.goto(resolvePath(`/${locale}/tools/qr/`));

    // 1) 填写文本；尽量用第一个文本框，避免翻译变化导致的 label 匹配失败
    const textbox = page.getByRole('textbox').first();
    await textbox.fill('hello world');

    // 2) 同时触发两种“生成”提交流：点按钮 + Enter 提交（谁先成功都行）
    //    不依赖按钮文案，Enter 能兜底触发 <form> onsubmit
    const maybeGenerateBtn = page
      .getByRole('button', { name: /Generate|生成|生成二维码|Create|Create QR/i })
      .first();

    await Promise.race([
      maybeGenerateBtn.click().catch(() => Promise.resolve()),
      (async () => {
        // 确保焦点在输入框上再回车
        await textbox.focus();
        await textbox.press('Enter').catch(() => {});
      })(),
    ]);

    // 3) 软断言：如果预览节点出现，则验证其可见
    const preview = page.locator(previewSelector).first();
    await preview.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    if ((await preview.count()) > 0) {
      await expect.soft(preview).toBeVisible();
    }

    // 4) 等待“任一个下载按钮”真正变为可用（原生轮询更稳）
    await waitForAnyDownloadEnabled(page, 20000);

    // 5) 优先 PNG，不行就点 SVG，并验证确实触发了下载
    const targetBtn = await pickEnabledDownloadButton(page);
    await expect(targetBtn).toBeEnabled({ timeout: 5000 });

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      targetBtn.click(),
    ]);

    expect(await download.path()).toBeTruthy();
  });
}
