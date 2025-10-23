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
const ORIGIN = `http://127.0.0.1:4173/`;
const root = new URL(basePath, ORIGIN).href;
const norm = root.endsWith('/') ? root : `${root}/`;

const collect = {
  ...(LIGHTHOUSE_CONFIG.ci?.collect || {}),
  // 用我们自己的静态服务器把 dist 挂到 basePath 下
  startServerCommand: 'node scripts/serve-dist.cjs',
  startServerReadyPattern: 'READY:\\s+http://127\\.0\\.0\\.1:4173',
  url: [
    `${norm}zh/index.html`,
    `${norm}en/index.html`,
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
