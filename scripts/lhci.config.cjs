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

// ---- Preview server settings (keep in sync with package.json "preview") ----
const PREVIEW_HOST = '127.0.0.1';
const PREVIEW_PORT = 4173;

// If CI provides an origin, prefer it; otherwise use fixed localhost:4173
const previewOrigin =
  process.env.LHCI_PREVIEW_ORIGIN ?? `http://${PREVIEW_HOST}:${PREVIEW_PORT}/`;

// Compose the base-aware root URL (e.g. http://127.0.0.1:4173/toolsite-starter/)
const previewRoot = new URL(basePath, previewOrigin).href;
const normalizedRoot = previewRoot.endsWith('/') ? previewRoot : `${previewRoot}/`;

// Merge chrome flags: keep any from lighthouserc.json and add CI-stable defaults
const mergedChromeFlags = Array.from(
  new Set([
    ...((LIGHTHOUSE_CONFIG.ci?.collect?.settings?.chromeFlags) || []),
    '--headless=new',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
  ])
);

// Build the collect block we want to export
const collect = {
  ...(LIGHTHOUSE_CONFIG.ci?.collect || {}),
  // Start preview on a fixed host/port so LHCI waits for the right server.
  startServerCommand: `npm run preview -- --host ${PREVIEW_HOST} --port ${PREVIEW_PORT}`,
  // Wait until Astro prints the “Local: http://127.0.0.1:4173” line before auditing.
  startServerReadyPattern: `Local.*${PREVIEW_HOST.replace(/\./g, '\\.')}:${PREVIEW_PORT}`,
  // Give CI plenty of time to boot the preview server.
  startServerReadyTimeout: 120000, // ms
  // Be explicit about the audited URLs (base-aware, include index.html).
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

// Export the final config, preserving other sections from lighthouserc.json
module.exports = {
  ...LIGHTHOUSE_CONFIG,
  ci: {
    ...(LIGHTHOUSE_CONFIG.ci || {}),
    collect,
    // keep whatever upload/report settings you already have in lighthouserc.json
  },
};
