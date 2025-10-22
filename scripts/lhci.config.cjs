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

// 直接用静态目录（CI 已经先跑过 build，dist 里就是最终文件）
const collect = {
  ...(LIGHTHOUSE_CONFIG.ci?.collect || {}),
  // 关键：不再启动 astro preview
  staticDistDir: 'dist',
  // 注意：因为 dist 里保留了 basePath，所以 URL 要带上 basePath
  url: [
    `${basePath}zh/index.html`,
    `${basePath}en/index.html`,
  ],
  numberOfRuns: 1,
  settings: {
    ...(LIGHTHOUSE_CONFIG.ci?.collect?.settings || {}),
    chromeFlags: Array.from(new Set([
      ...((LIGHTHOUSE_CONFIG.ci?.collect?.settings?.chromeFlags) || []),
      '--headless=new',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ])),
  },
};

module.exports = {
  ...LIGHTHOUSE_CONFIG,
  ci: {
    ...(LIGHTHOUSE_CONFIG.ci || {}),
    collect,
  },
};
