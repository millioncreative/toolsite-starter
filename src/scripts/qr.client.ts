// src/scripts/qr.client.ts
import QRCode from 'qrcode'; // 走 tsconfig paths: "qrcode": ["src/vendor/qrcode"]
import { renderQRCodeCanvas } from '../components/tools/qr/QRCodeCanvas';
import { downloadDataUrl, blobDownload } from '../utils/download';

// DOM 快捷
const $ = (id: string) => document.getElementById(id)!;

const preview = $('qr-preview');
const errorBox = $('qr-error');
const pngButton = $('btn-png') as HTMLButtonElement;
const svgButton = $('btn-svg') as HTMLButtonElement;

const ariaTemplate = preview?.dataset?.ariaTemplate || 'QR code for {text}';
const tooLongMessage = errorBox?.dataset?.tooLong || '';

const state = {
  text: '',
  size: 256,
  margin: 2,
  level: 'M' as 'L' | 'M' | 'Q' | 'H',
  fgColor: '#111111',
  bgColor: '#ffffff',
};

const parseIntValue = (value: string, fallback: number) => {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
};

const getAriaLabel = (text: string) =>
  ariaTemplate.replace('{text}', text).replace('%s', text);

const escapeAttr = (v: string) =>
  String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const disableDownloads = () => {
  pngButton.setAttribute('disabled', '');
  svgButton.setAttribute('disabled', '');
  document.body.removeAttribute('data-qr-ready');
};

const enableDownloads = () => {
  pngButton.removeAttribute('disabled');
  svgButton.removeAttribute('disabled');
  document.body.setAttribute('data-qr-ready', 'true');
};

const readStateFromInputs = () => {
  const textInput = $('qr-text') as HTMLInputElement;
  const sizeInput = $('qr-size') as HTMLInputElement;
  const marginInput = $('qr-margin') as HTMLInputElement;
  const levelSelect = $('qr-level') as HTMLSelectElement;
  const fgInput = $('qr-fg') as HTMLInputElement;
  const bgInput = $('qr-bg') as HTMLInputElement;

  state.text = (textInput.value || '').trim();
  state.size = parseIntValue(sizeInput.value || '256', 256);
  state.margin = parseIntValue(marginInput.value || '2', 2);
  state.level = (levelSelect.value || 'M').toUpperCase() as any;
  state.fgColor = fgInput.value || '#111111';
  state.bgColor = bgInput.value || '#ffffff';
};

const clearPreview = () => (preview.innerHTML = '');
const showError = (msg: string) => (errorBox.textContent = msg);
const resetError = () => (errorBox.textContent = '');

async function renderQR() {
  readStateFromInputs();
  clearPreview();
  resetError();
  disableDownloads();

  if (!state.text) return;

  try {
    const canvas = await renderQRCodeCanvas({
      ...state,
      ariaLabel: getAriaLabel(state.text),
    });
    preview.appendChild(canvas);
    enableDownloads();
  } catch (err: any) {
    const raw = err?.message ?? String(err);
    const msg = raw.includes('Input too long') && tooLongMessage ? tooLongMessage : raw;
    showError(msg);
  }
}

// 生成
$('btn-generate')?.addEventListener('click', () => {
  document.body.setAttribute('data-qr-clicked', 'true'); // 供 E2E 断言
  renderQR();
});

// 下载 PNG
pngButton?.addEventListener('click', () => {
  const canvas = preview.querySelector('canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const dataUrl = canvas.toDataURL('image/png');
  downloadDataUrl(dataUrl, 'qr.png');
});

// 下载 SVG
svgButton?.addEventListener('click', async () => {
  const t = state.text;
  if (!t) return;
  try {
    const svg = await QRCode.toString(t, {
      margin: state.margin,
      errorCorrectionLevel: state.level,
      color: { dark: state.fgColor, light: state.bgColor },
    });
    const aria = getAriaLabel(t);
    const accessible = svg.includes('aria-label=')
      ? svg
      : svg.replace('<svg', `<svg role="img" aria-label="${escapeAttr(aria)}"`);
    const blob = new Blob([accessible], { type: 'image/svg+xml' });
    blobDownload(blob, 'qr.svg');
  } catch (err: any) {
    const raw = err?.message ?? String(err);
    const msg = raw.includes('Input too long') && tooLongMessage ? tooLongMessage : raw;
    showError(msg);
  }
});
