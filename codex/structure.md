# 项目结构

```
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── DEPLOY.md
├── LICENSE
├── NEXT.md
├── astro.config.mjs
├── codex/
│   └── structure.md
├── lighthouserc.json
├── package-lock.json
├── package.json
├── playwright.config.ts
├── postcss.config.cjs
├── public/
│   ├── favicon.svg
│   ├── icons/
│   │   └── icon.svg
│   ├── manifest.webmanifest
│   └── sw.js
├── reports/
│   └── lh/
│       └── .gitkeep
├── src/
│   ├── components/
│   │   ├── AdSensePlaceholder.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── PrivacyNotice.astro
│   │   ├── ToolCard.astro
│   │   └── __tests__/
│   │       └── ToolCard.test.ts
│   ├── content/
│   │   ├── blog/
│   │   │   ├── privacy.md
│   │   │   └── tips.md
│   │   └── config.ts
│   ├── env.d.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── index.astro
│   │   ├── robots.txt.ts
│   │   └── tools.astro
│   └── styles/
│       └── global.css
├── tailwind.config.mjs
├── tests/
│   └── e2e.spec.ts
├── tsconfig.json
├── tsconfig.node.json
└── vitest.config.ts
```

# 建议的后续任务

1. 将示例工具卡片替换为真实工具页面，并补充对应内容与测试。
2. 引入多语言支持（例如英文）并配置语言切换组件。
3. 为博客文章生成 RSS 订阅与社交分享预览图。
4. 集成自动化视觉回归测试，确保 UI 在更新中保持一致。
5. 编写性能优化指南，涵盖资源分割、图片优化与缓存策略调整。
