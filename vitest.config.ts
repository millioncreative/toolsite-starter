import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts']

    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    passWithNoTests: true
  }
});
