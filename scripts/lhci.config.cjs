const fs = require('fs');
const path = require('path');

const LIGHTHOUSE_CONFIG = require('../lighthouserc.json');

function loadProjectConfig() {
  const configPath = path.resolve(__dirname, '../project.config.js');
  const contents = fs.readFileSync(configPath, 'utf8');

  const siteMatch = contents.match(/export const site = ['"]([^'\"]+)['"]/);
  const basePathMatch = contents.match(/export const basePath = ['"]([^'\"]+)['"]/);

  if (!siteMatch || !basePathMatch) {
    throw new Error('Unable to read site/basePath from project.config.js');
  }

  return { site: siteMatch[1], basePath: basePathMatch[1] };
}

const { basePath } = loadProjectConfig();
const previewOrigin = process.env.LHCI_PREVIEW_ORIGIN ?? 'http://127.0.0.1:4173/';
const previewRoot = new URL(basePath, previewOrigin).href;
const normalizedRoot = previewRoot.endsWith('/') ? previewRoot : `${previewRoot}/`;

const collect = {
  ...LIGHTHOUSE_CONFIG.ci.collect,
  startServerCommand: 'npm run preview -- --host 127.0.0.1',
  url: [`${normalizedRoot}zh/index.html`, `${normalizedRoot}en/index.html`],
  settings: {
    ...(LIGHTHOUSE_CONFIG.ci.collect?.settings ?? {}),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage']
  }
};

module.exports = {
  ...LIGHTHOUSE_CONFIG,
  ci: {
    ...LIGHTHOUSE_CONFIG.ci,
    collect
  }
};
