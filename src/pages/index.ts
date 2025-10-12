---
import { defaultLocale } from '../i18n/config';
export const prerender = true;

// 目标地址（例：/zh/）
const to = `/${defaultLocale}/`;

// 构建期重定向（Astro 会写出一个重定向页面，静态托管可用）
return Astro.redirect(to);
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content={`0; url=${to}`} />
    <link rel="canonical" href={to} />
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to <a href={to}>{to}</a>…</p>
  </body>
</html>
