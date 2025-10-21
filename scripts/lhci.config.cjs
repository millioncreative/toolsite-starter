// scripts/lhci.config.cjs
const fs = require('fs');
const path = require('path');

const LIGHTHOUSE_CONFIG = require('../lighthouserc.json');

function loadProjectConfig() {
  const configPath = path.resolve(__dirname, '../project.config.js');
  const contents = fs.readFileSync(configPath, 'utf8');

  const siteMatch = contents.match(/export const site = ['"]([^'"]+)['"]/);
  const basePathMatch = contents.match(/export const basePath = ['"]([^'"]+)['"]/);

  if (!siteMatch || !basePathMatch) {
    throw new Error('Unable to read site/basePath from project.config.js');
  }

  return { site: siteMatch[1], basePath: basePathMatch[1] };
}

const { basePath } = loadProjectConfig();

// —— 与 astro preview 的实际输出保持一致 ——
// 日志显示它使用了 localhost:4321
const PREVIEW_HOST = 'localhost';
const PREVIEW_PORT = 4321;

const previewOrigin = `http://${PREVIEW_HOST}:${PREVIEW_PORT}/`;
const previewRoot = new URL(basePath, previewOrigin).href;
const normalizedRoot = previewRoot.endsWith('/') ? previewRoot : `${previewRoot}/`;

const mergedChromeFlags = Array.from(
  new Set([
    ...((LIGHTHOUSE_CONFIG.ci?.collect?.settings?.chromeFlags) || []),
    '--headless=new',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
  ])
);

// 注意：不再强塞 host/port，直接跑 package.json 里的 preview，
// 让它按自身默认行为启动（你现在的输出就是 localhost:4321）。
const collect = {
  ...(LIGHTHOUSE_CONFIG.ci?.collect || {}),
  startServerCommand: `npm run preview`,
  // 等待 astro 打印出 “Local  http://localhost:4321” 这一行
  // 替换 startServerReadyPattern 为：
  startServerReadyPattern: `Local\\s+http://localhost:\\d+`,
  
  // 同时把 PREVIEW_PORT/previewOrigin 的拼接替换为读取环境端口的方案：
  // 这种写法最简单：直接用日志里固定到 /toolsite-starter/ 路径，而不拼端口：
  // （LH 会在已启动的同一浏览器上下文里解析到正确 origin）
  url: [
    `${basePath}zh/index.html`,
    `${basePath}en/index.html`,
  ],

  numberOfRuns: 1,
  settings: {
    ...(LIGHTHOUSE_CONFIG.ci?.collect?.settings || {}),
    chromeFlags: mergedChromeFlags,
  },
};

module.exports = {
  ...LIGHTHOUSE_CONFIG,
  ci: {
    ...(LIGHTHOUSE_CONFIG.ci || {}),
    collect,
  },
};
