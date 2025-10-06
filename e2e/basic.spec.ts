import { test, expect } from '@playwright/test';

test.describe('Toolsite Starter pages', () => {
  test('homepage renders hero and cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '欢迎来到 Toolsite Starter' })).toBeVisible();
    await expect(page.getByText('示例工具 A')).toBeVisible();
    await expect(page.getByText('All tools run locally in your browser; files are not uploaded.')).toBeVisible();
  });

  test('tools page lists modules', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.getByRole('heading', { name: '工具目录' })).toBeVisible();
    await expect(page.getByText('示例工具 C')).toBeVisible();
  });
});
