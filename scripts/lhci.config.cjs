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

const { site, basePath } = loadProjectConfig();
const siteRoot = new URL(basePath, site);
const previewOrigin = process.env.LHCI_PREVIEW_ORIGIN ?? 'http://127.0.0.1:4173/';
const root = new URL(siteRoot.pathname, previewOrigin).href;
const normalizedRoot = root.endsWith('/') ? root : `${root}/`;

const collect = {
  ...LIGHTHOUSE_CONFIG.ci.collect,
  startServerCommand: 'npm run preview -- --host 0.0.0.0',
  url: [`${normalizedRoot}zh/`, `${normalizedRoot}zh/tools/`]
};

module.exports = {
  ...LIGHTHOUSE_CONFIG,
  ci: {
    ...LIGHTHOUSE_CONFIG.ci,
    collect
  }
};
