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

// —— 与当前 preview 脚本一致：127.0.0.1:4173 ——
// （你的 GH Actions 日志明确显示 astro 用的就是这个）
const PREVIEW_HOST = '127.0.0.1';
const PREVIEW_PORT = 4173;

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

// 关键点：
// 1) 明确用与 package.json 一致的 host/port 启动 preview；
// 2) startServerReadyPattern 匹配 “Local  http://127.0.0.1:4173” 这行；
// 3) url 使用绝对 URL（normalizedRoot + 路径），避免 INVALID_URL。
const collect = {
  ...(LIGHTHOUSE_CONFIG.ci?.collect || {}),
  startServerCommand: `npm run preview -- --host ${PREVIEW_HOST} --port ${PREVIEW_PORT}`,
  startServerReadyPattern: `Local\\s+http://${PREVIEW_HOST.replaceAll('.', '\\.')}:${PREVIEW_PORT}`,
  startServerReadyTimeout: 120000,
  url: [
    `${normalizedRoot}zh/index.html`,
    `${normalizedRoot}en/index.html`,
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
