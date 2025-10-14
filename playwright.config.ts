import { defineConfig, devices } from '@playwright/test';
import { basePath } from './project.config.js';

const previewOrigin = 'http://127.0.0.1:4173';
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
const webServerUrl = normalizedBase === '/' ? previewOrigin : `${previewOrigin}${normalizedBase}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: { baseURL: previewOrigin },
  webServer: {
    command: 'npm run preview',
    url: webServerUrl,
    timeout: 120_000,
    reuseExistingServer: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
