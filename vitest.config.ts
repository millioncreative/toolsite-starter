import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    // 只收集 unit 测试；如果你现在没有单测，也没关系，会 0 test 通过
    include: ['tests/unit/**/*.test.ts'],
    // 一定要排除 e2e
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
});
