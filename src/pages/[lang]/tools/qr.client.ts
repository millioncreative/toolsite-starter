// src/pages/[lang]/tools/qr.client.ts
import qrcode from '../../../vendor/qrcode.ts';
import { renderQRCodeCanvas } from '../../../components/tools/qr/QRCodeCanvas.tsx';
import { downloadDataUrl, blobDownload } from '../../../utils/download.ts';

const $ = (id: string) => document.getElementById(id)!;
const preview = document.getElementById('qr-preview') as HTMLElement | null;
const errorBox = document.getElementById('qr-error') as HTMLElement | null;
const pngButton = document.getElementById('btn-png') as HTMLButtonElement | null;
const svgButton = document.getElementById('btn-svg') as HTMLButtonElement | null;
const ariaTemplate =
  (preview?.dataset?.ariaTemplate as string | undefined) || 'QR code for {text}';
const tooLongMessage = (errorBox?.dataset?.tooLong as string | undefined) || '';

const setFlag = (name: string, value = '') => document.body.setAttribute(name, String(value));
const clearFlag = (name: string) => document.body.removeAttribute(name);

type Level = 'L' | 'M' | 'Q' | 'H';
const state: {
  text: string;
  size: number;
  margin: number;
  level: Level;
  fgColor: string;
  bgColor: string;
} = {
  text: '',
  size: 256,
  margin: 2,
  level: 'M',
  fgColor: '#111111',
  bgColor: '#ffffff',
};

const parseIntValue = (value: string, fallback: number) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const getAriaLabel = (text: string) =>
  ariaTemplate.replace('{text}', text).replace('%s', text);

const escapeAttr = (value: string) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const disableDownloads = () => {
  pngButton?.setAttribute('disabled', '');
  svgButton?.setAttribute('disabled', '');
};
const enableDownloads = () => {
  pngButton?.removeAttribute('disabled');
  svgButton?.removeAttribute('disabled');
};

const readStateFromInputs = () => {
  const textInput = $('qr-text') as HTMLInputElement;
  const sizeInput = $('qr-size') as HTMLInputElement;
  const marginInput = $('qr-margin') as HTMLInputElement;
  const levelSelect = $('qr-level') as HTMLSelectElement;
  const fgInput = $('qr-fg') as HTMLInputElement;
  const bgInput = $('qr-bg') as HTMLInputElement;

  state.text = (textInput?.value || '').trim();
  state.size = parseIntValue(sizeInput?.value || '256', 256);
  state.margin = parseIntValue(marginInput?.value || '2', 2);
  state.level = ((levelSelect?.value || 'M').toUpperCase() as Level);
  state.fgColor = fgInput?.value || '#111111';
  state.bgColor = bgInput?.value || '#ffffff';
};

const clearPreview = () => {
  if (preview) preview.innerHTML = '';
};

const showError = (message: string) => {
  if (errorBox) errorBox.textContent = message;
  setFlag('data-qr-error', message || 'unknown');
  clearFlag('data-qr-ready');
};

const resetError = () => {
  if (errorBox) errorBox.textContent = '';
  clearFlag('data-qr-error');
};

const renderQR = async () => {
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
    preview?.appendChild(canvas);
    enableDownloads();
    setFlag('data-qr-ready', 'true'); // E2E 等这个或按钮可点击
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    const msg = raw.includes('Input too long') && tooLongMessage ? tooLongMessage : raw;
    showError(msg);
    console.error('[qr] render error:', msg);
  }
};

// 事件绑定
document.getElementById('btn-generate')?.addEventListener('click', () => {
  setFlag('data-qr-clicked', '1'); // 供测试校验点击已发生
  renderQR();
});

pngButton?.addEventListener('click', () => {
  const canvas = preview?.querySelector('canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const dataUrl = canvas.toDataURL('image/png');
  downloadDataUrl(dataUrl, 'qr.png');
});

svgButton?.addEventListener('click', async () => {
  const text = state.text;
  if (!text) return;
  try {
    const svg = await qrcode.toString(text, {
      margin: state.margin,
      errorCorrectionLevel: state.level,
      color: { dark: state.fgColor, light: state.bgColor },
    });
    const ariaLabel = getAriaLabel(text);
    const accessibleSvg = svg.includes('aria-label=')
      ? svg
      : svg.replace('<svg', `<svg role="img" aria-label="${escapeAttr(ariaLabel)}"`);
    const blob = new Blob([accessibleSvg], { type: 'image/svg+xml' });
    blobDownload(blob, 'qr.svg');
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    const msg = raw.includes('Input too long') && tooLongMessage ? tooLongMessage : raw;
    showError(msg);
    console.error('[qr] svg error:', msg);
  }
});
