import QRCode from 'qrcode';

export type QRProps = {
  text: string;
  size: number;
  margin: number;
  level: 'L' | 'M' | 'Q' | 'H';
  fgColor: string;
  bgColor: string;
  ariaLabel?: string;
};

export async function renderQRCodeCanvas(props: QRProps, existing?: HTMLCanvasElement): Promise<HTMLCanvasElement> {
  const canvas = existing ?? document.createElement('canvas');
  const { text, size, margin, level, fgColor, bgColor, ariaLabel } = props;

  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin,
    errorCorrectionLevel: level,
    color: { dark: fgColor, light: bgColor }
  });

  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', ariaLabel || `QR code for ${text}`);
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  return canvas;
}
