# 部署到 Cloudflare Pages

Toolsite Starter 可直接部署至 Cloudflare Pages。请按照以下步骤配置：

1. **项目设置**：在 Cloudflare Pages 中创建新项目并关联该仓库。
2. **构建命令**：设置为 `npm run build`。
3. **生产目录**：保持为 Astro 默认输出目录 `dist/`。
4. **环境变量**：无需额外环境变量；若后续引入 API，可在此处配置。
5. **预览部署**：启用预览部署以验证功能与 Lighthouse 报告。

完成后，Cloudflare Pages 会在每次推送时自动执行构建并更新站点。
