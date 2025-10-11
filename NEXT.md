# 新增工具模块的五个步骤

1. **创建目录**：在 `src/tools/<tool-name>/` 下建立工具专属文件夹，用于存放组件、样式与测试资源。
2. **注册路由**：在 `src/pages/tools/<tool-name>.astro` 中创建页面，并在工具目录页的列表中加入链接。
3. **编写组件**：在 `src/tools/<tool-name>/` 中实现核心组件，必要时复用 `ToolCard` 与布局组件以保持 UI 一致性。
4. **添加测试**：为关键逻辑编写 Vitest 单元测试（`src/tools/<tool-name>/**/*.test.ts`）并在 `tests/` 中添加 Playwright 场景覆盖主要交互。
5. **更新文档**：在 `src/content/blog/` 中撰写更新日志或使用说明，同时在 README/部署文档中说明新工具的目的与使用方式。

依照以上步骤，可快速扩展工具站点的功能库并保持质量。
