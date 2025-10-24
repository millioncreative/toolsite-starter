import { test, expect } from '@playwright/test';
import { basePath } from '../project.config.js';

const locales = ['en', 'zh'] as const;
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

const resolvePath = (path: string) => {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmed) return normalizedBase === '/' ? '/' : normalizedBase;
  return normalizedBase === '/' ? `/${trimmed}` : `${normalizedBase}${trimmed}`;
};

// 预览选择器仅用于软断言，不作为硬性通过标准
const previewSelector =
  'canvas[role="img"], svg[role="img"], img[role="img"], canvas, svg, img';

// 在页面里读取就绪/报错/按钮状态
async function pollStatus(page: import('@playwright/test').Page) {
  return await page.evaluate(() => {
    const b = document.body;
    const ready = b.getAttribute('data-qr-ready') === 'true';
    const clicked = b.getAttribute('data-qr-clicked') != null;
    const error = b.getAttribute('data-qr-error') || '';
    const pngBtn = document.querySelector<HTMLButtonElement>('#btn-png');
    const svgBtn = document.querySelector<HTMLButtonElement>('#btn-svg');
    const pngEnabled = !!pngBtn && !pngBtn.disabled;
    const svgEnabled = !!svgBtn && !svgBtn.disabled;
    return { ready, clicked, error, pngEnabled, svgEnabled };
  });
}

for (const locale of locales) {
  test(`QR tool works for ${locale}`, async ({ page }) => {
    // 把浏览器端日志带出来，便于 CI 里诊断
    page.on('console', (msg) => {
      // 抑制过长日志，保留类型与文本
      console.log(`[browser:${msg.type()}] ${msg.text()}`);
    });
    page.on('pageerror', (err) => {
      console.log(`[pageerror] ${err?.message || String(err)}`);
    });

    await page.goto(resolvePath(`/${locale}/tools/qr/`));
    await page.waitForLoadState('domcontentloaded');

    // 直接用 ID，避免 label/i18n 的差异
    const input = page.locator('#qr-text');
    await input.fill('hello world');

    // 点击生成
    await page.locator('#btn-generate').click();

    // 等待“点击”标记，确保事件已触发
    await page.waitForFunction(
      () => document.body.hasAttribute('data-qr-clicked'),
      { timeout: 10_000 }
    );

    // 在 25s 内等待状态进入三种之一：ready / error / 按钮可点
    const deadline = Date.now() + 25_000;
    let last: Awaited<ReturnType<typeof pollStatus>> | null = null;

    // 轮询，避免某个单一标记导致脆弱
    // 100~200ms 一次足够
    while (Date.now() < deadline) {
      last = await pollStatus(page);
      if (last.error) break; // 有 error 直接退出
      if (last.ready) break; // 成功
      if (last.pngEnabled || last.svgEnabled) break; // 可下载即可
      await page.waitForTimeout(150);
    }

    // 如果页面报告了错误，直接失败并携带错误信息
    if (last?.error) {
      test.fail(true, `QR page error: ${last.error}`);
    }

    // 软断言预览是否出现（不决定成败）
    const preview = page.locator(previewSelector).first();
    await preview.waitFor({ state: 'attached', timeout: 5_000 }).catch(() => {});
    if (await preview.count()) {
      await expect.soft(preview).toBeVisible();
    }

    // 若 PNG 或 SVG 任一可用，就下载校验；否则给出状态详情后失败
    if (last?.pngEnabled || last?.svgEnabled) {
      const target = last.pngEnabled ? '#btn-png' : '#btn-svg';
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 20_000 }),
        page.click(target),
      ]);
      expect(await download.path()).toBeTruthy();
    } else {
      const s = last
        ? JSON.stringify(last)
        : '(no status captured)';
      test.fail(
        true,
        `Neither ready nor error nor buttons enabled within timeout. Status=${s}`
      );
    }
  });
}
