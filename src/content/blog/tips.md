---
title: "《本站工具小技巧（示例）》"
description: "三步掌握示例工具的使用节奏，快速自定义体验。"
publishDate: 2024-01-12
---

为了帮助团队快速上手，我们整理了三个使用 Toolsite Starter 的小技巧：

## 1. 善用预设组件

工具卡片、隐私提示与页脚等组件已经封装好样式，可以直接在新页面中引用。保持视觉一致性能够提升可信度。

## 2. 结合 Markdown 内容源

博客系统基于 Astro Content Collections，可通过在 `src/content/blog` 下新增 Markdown 文件的方式发布更新。前置字段中的 `publishDate` 会被自动解析为日期，便于排序展示。

## 3. 扩展 PWA 能力

示例的 Service Worker 提供基础缓存策略，您可以在此基础上根据业务需要扩展离线缓存资产，或加入版本更新提示。

> 小贴士：别忘了运行 `npm run test` 与 `npm run e2e`，确保新增工具在单元与端到端测试中表现稳定。

祝你构建顺利！
