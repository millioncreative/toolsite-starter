/**
 * Minimal QR code generator that supports version 1 symbols with
 * configurable error correction levels (L/M/Q/H). The implementation is
 * intentionally lightweight so the project can work in offline evaluation
 * environments where installing the `qrcode` package from npm is not
 * possible.
 *
 * The API matches the subset of the `qrcode` package that the tool page
 * requires: `toCanvas` and `toString` (for SVG generation).
 */

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

type RenderColors = {
  dark?: string;
  light?: string;
};

type ToCanvasOptions = {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: ErrorLevel;
  color?: RenderColors;
};

type ToStringOptions = ToCanvasOptions & {
  type?: 'svg';
};

const DEFAULT_SIZE = 256;
const DEFAULT_MARGIN = 4;
const MODULE_COUNT = 21; // Version 1 symbol

const LEVEL_INFO: Record<ErrorLevel, { capacity: number; dataCodewords: number; ecCodewords: number }> = {
  L: { capacity: 17, dataCodewords: 19, ecCodewords: 7 },
  M: { capacity: 14, dataCodewords: 16, ecCodewords: 10 },
  Q: { capacity: 11, dataCodewords: 13, ecCodewords: 13 },
  H: { capacity: 7, dataCodewords: 9, ecCodewords: 17 }
};

const FORMAT_LEVEL_BITS: Record<ErrorLevel, number> = {
  L: 0b01,
  M: 0b00,
  Q: 0b11,
  H: 0b10
};

const FORMAT_INFO_COORDS_A: Array<[number, number]> = [
  [8, 0],
  [8, 1],
  [8, 2],
  [8, 3],
  [8, 4],
  [8, 5],
  [8, 7],
  [8, 8],
  [7, 8],
  [5, 8],
  [4, 8],
  [3, 8],
  [2, 8],
  [1, 8],
  [0, 8]
];

const FORMAT_INFO_COORDS_B: Array<[number, number]> = [
  [MODULE_COUNT - 1, 8],
  [MODULE_COUNT - 2, 8],
  [MODULE_COUNT - 3, 8],
  [MODULE_COUNT - 4, 8],
  [MODULE_COUNT - 5, 8],
  [MODULE_COUNT - 6, 8],
  [MODULE_COUNT - 7, 8],
  [8, MODULE_COUNT - 8],
  [8, MODULE_COUNT - 7],
  [8, MODULE_COUNT - 6],
  [8, MODULE_COUNT - 5],
  [8, MODULE_COUNT - 4],
  [8, MODULE_COUNT - 3],
  [8, MODULE_COUNT - 2],
  [8, MODULE_COUNT - 1]
];

type Matrix = boolean[][];
type Reserved = boolean[][];

const EXP_TABLE: number[] = new Array(512);
const LOG_TABLE: number[] = new Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 256; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 256; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 256];
  }
})();

function gexp(n: number): number {
  if (n < 0) {
    while (n < 0) {
      n += 255;
    }
    return EXP_TABLE[n];
  }
  return EXP_TABLE[n % 255];
}

function glog(n: number): number {
  if (n === 0) {
    throw new Error('glog(0)');
  }
  return LOG_TABLE[n];
}

class BitBuffer {
  private readonly data: number[] = [];
  private bitLength = 0;

  put(value: number, length: number) {
    for (let i = length - 1; i >= 0; i--) {
      this.putBit(((value >>> i) & 1) === 1);
    }
  }

  putBit(bit: boolean) {
    const index = Math.floor(this.bitLength / 8);
    if (this.data.length <= index) {
      this.data.push(0);
    }
    if (bit) {
      this.data[index] |= 1 << (7 - (this.bitLength % 8));
    }
    this.bitLength += 1;
  }

  getLength(): number {
    return this.bitLength;
  }

  getBuffer(): number[] {
    return this.data;
  }
}

function buildGeneratorPolynomial(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    poly = multiplyPolynomials(poly, [1, gexp(i)]);
  }
  return poly;
}

function multiplyPolynomials(a: number[], b: number[]): number[] {
  const result = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] === 0 || b[j] === 0) continue;
      result[i + j] ^= gexp(glog(a[i]) + glog(b[j]));
    }
  }
  return result;
}

function calculateRemainder(data: number[], ecCodewords: number): number[] {
  const generator = buildGeneratorPolynomial(ecCodewords);
  const buffer = data.concat(new Array(ecCodewords).fill(0));
  for (let i = 0; i < data.length; i++) {
    const coef = buffer[i];
    if (coef === 0) continue;
    const logCoef = glog(coef);
    for (let j = 0; j < generator.length; j++) {
      buffer[i + j] ^= gexp(logCoef + glog(generator[j]));
    }
  }
  return buffer.slice(buffer.length - ecCodewords);
}

function encodeData(text: string, level: ErrorLevel): number[] {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  if (bytes.length > LEVEL_INFO[level].capacity) {
    throw new Error('Input too long for QR version 1.');
  }

  const info = LEVEL_INFO[level];
  const capacityBits = info.dataCodewords * 8;
  const buffer = new BitBuffer();
  buffer.put(0b0100, 4);
  buffer.put(bytes.length, 8);
  for (const byte of bytes) {
    buffer.put(byte, 8);
  }

  const remaining = capacityBits - buffer.getLength();
  if (remaining > 0) {
    const terminator = Math.min(4, remaining);
    buffer.put(0, terminator);
  }

  while (buffer.getLength() % 8 !== 0) {
    buffer.putBit(false);
  }

  const data = buffer.getBuffer();
  const padBytes = [0xec, 0x11];
  let padIndex = 0;
  while (data.length < info.dataCodewords) {
    data.push(padBytes[padIndex % 2]);
    padIndex += 1;
  }

  const ec = calculateRemainder(data, info.ecCodewords);
  return data.concat(ec);
}

function initialiseMatrix(): { modules: Matrix; reserved: Reserved } {
  const modules: Matrix = Array.from({ length: MODULE_COUNT }, () => Array(MODULE_COUNT).fill(false));
  const reserved: Reserved = Array.from({ length: MODULE_COUNT }, () => Array(MODULE_COUNT).fill(false));

  const setModule = (row: number, col: number, value: boolean, markReserved = true) => {
    if (row < 0 || col < 0 || row >= MODULE_COUNT || col >= MODULE_COUNT) return;
    modules[row][col] = value;
    if (markReserved) {
      reserved[row][col] = true;
    }
  };

  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const isOut = r < 0 || r > 6 || c < 0 || c > 6;
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || rr >= MODULE_COUNT || cc < 0 || cc >= MODULE_COUNT) continue;
        if (isOut) {
          setModule(rr, cc, false);
        } else if (r === 0 || r === 6 || c === 0 || c === 6) {
          setModule(rr, cc, true);
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          setModule(rr, cc, true);
        } else {
          setModule(rr, cc, false);
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, MODULE_COUNT - 7);
  placeFinder(MODULE_COUNT - 7, 0);

  for (let i = 8; i < MODULE_COUNT - 8; i++) {
    const value = i % 2 === 0;
    setModule(6, i, value);
    setModule(i, 6, value);
  }

  setModule(MODULE_COUNT - 8, 8, true);

  for (const [r, c] of FORMAT_INFO_COORDS_A) {
    reserved[r][c] = true;
  }
  for (const [r, c] of FORMAT_INFO_COORDS_B) {
    reserved[r][c] = true;
  }

  return { modules, reserved };
}

function dataBitsFromCodewords(codewords: number[]): number[] {
  const bits: number[] = [];
  for (const cw of codewords) {
    for (let i = 7; i >= 0; i--) {
      bits.push((cw >>> i) & 1);
    }
  }
  return bits;
}

const MASK_FUNCTIONS: Array<(row: number, col: number) => boolean> = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
];

function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => row.slice());
}

function applyMask(matrix: Matrix, reserved: Reserved, maskIndex: number) {
  const fn = MASK_FUNCTIONS[maskIndex];
  for (let r = 0; r < MODULE_COUNT; r++) {
    for (let c = 0; c < MODULE_COUNT; c++) {
      if (reserved[r][c]) continue;
      if (fn(r, c)) {
        matrix[r][c] = !matrix[r][c];
      }
    }
  }
}

function penaltyScore(matrix: Matrix): number {
  let penalty = 0;

  for (let r = 0; r < MODULE_COUNT; r++) {
    let runColor = matrix[r][0];
    let runLength = 1;
    for (let c = 1; c < MODULE_COUNT; c++) {
      if (matrix[r][c] === runColor) {
        runLength += 1;
      } else {
        if (runLength >= 5) {
          penalty += 3 + (runLength - 5);
        }
        runColor = matrix[r][c];
        runLength = 1;
      }
    }
    if (runLength >= 5) {
      penalty += 3 + (runLength - 5);
    }
  }

  for (let c = 0; c < MODULE_COUNT; c++) {
    let runColor = matrix[0][c];
    let runLength = 1;
    for (let r = 1; r < MODULE_COUNT; r++) {
      if (matrix[r][c] === runColor) {
        runLength += 1;
      } else {
        if (runLength >= 5) {
          penalty += 3 + (runLength - 5);
        }
        runColor = matrix[r][c];
        runLength = 1;
      }
    }
    if (runLength >= 5) {
      penalty += 3 + (runLength - 5);
    }
  }

  for (let r = 0; r < MODULE_COUNT - 1; r++) {
    for (let c = 0; c < MODULE_COUNT - 1; c++) {
      const color = matrix[r][c];
      if (
        color === matrix[r][c + 1] &&
        color === matrix[r + 1][c] &&
        color === matrix[r + 1][c + 1]
      ) {
        penalty += 3;
      }
    }
  }

  const pattern1 = '10111010000';
  const pattern2 = '00001011101';

  for (let r = 0; r < MODULE_COUNT; r++) {
    const rowStr = matrix[r].map((cell) => (cell ? '1' : '0')).join('');
    for (let i = 0; i <= rowStr.length - 11; i++) {
      const section = rowStr.slice(i, i + 11);
      if (section === pattern1 || section === pattern2) {
        penalty += 40;
      }
    }
  }

  for (let c = 0; c < MODULE_COUNT; c++) {
    let column = '';
    for (let r = 0; r < MODULE_COUNT; r++) {
      column += matrix[r][c] ? '1' : '0';
    }
    for (let i = 0; i <= column.length - 11; i++) {
      const section = column.slice(i, i + 11);
      if (section === pattern1 || section === pattern2) {
        penalty += 40;
      }
    }
  }

  let darkCount = 0;
  for (let r = 0; r < MODULE_COUNT; r++) {
    for (let c = 0; c < MODULE_COUNT; c++) {
      if (matrix[r][c]) darkCount += 1;
    }
  }
  const totalModules = MODULE_COUNT * MODULE_COUNT;
  const ratio = Math.abs((darkCount * 100) / totalModules - 50) / 5;
  penalty += Math.floor(ratio) * 10;

  return penalty;
}

function chooseBestMask(baseMatrix: Matrix, reserved: Reserved): number {
  let bestMask = 0;
  let lowestPenalty = Number.POSITIVE_INFINITY;
  for (let mask = 0; mask < MASK_FUNCTIONS.length; mask++) {
    const candidate = cloneMatrix(baseMatrix);
    applyMask(candidate, reserved, mask);
    const score = penaltyScore(candidate);
    if (score < lowestPenalty) {
      lowestPenalty = score;
      bestMask = mask;
    }
  }
  return bestMask;
}

function formatInfoBits(level: ErrorLevel, mask: number): number {
  const info = (FORMAT_LEVEL_BITS[level] << 3) | mask;
  let bits = info << 10;
  const generator = 0b10100110111;
  while (getBCHDigit(bits) - getBCHDigit(generator) >= 0) {
    bits ^= generator << (getBCHDigit(bits) - getBCHDigit(generator));
  }
  const combined = (info << 10) | bits;
  return combined ^ 0b101010000010010;
}

function getBCHDigit(value: number): number {
  let digit = 0;
  while (value !== 0) {
    digit += 1;
    value >>>= 1;
  }
  return digit;
}

function placeFormatInfo(matrix: Matrix, level: ErrorLevel, mask: number) {
  const bits = formatInfoBits(level, mask);
  for (let i = 0; i < 15; i++) {
    const bit = ((bits >> i) & 1) === 1;
    const coordA = FORMAT_INFO_COORDS_A[14 - i];
    const coordB = FORMAT_INFO_COORDS_B[14 - i];
    matrix[coordA[0]][coordA[1]] = bit;
    matrix[coordB[0]][coordB[1]] = bit;
  }
}

function buildMatrix(text: string, level: ErrorLevel): { modules: Matrix; mask: number } {
  const { modules, reserved } = initialiseMatrix();
  const dataBits = dataBitsFromCodewords(encodeData(text, level));
  let bitIndex = 0;
  let upwards = true;

  for (let col = MODULE_COUNT - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    for (let rowOffset = 0; rowOffset < MODULE_COUNT; rowOffset++) {
      const row = upwards ? MODULE_COUNT - 1 - rowOffset : rowOffset;
      for (let c = 0; c < 2; c++) {
        const currentCol = col - c;
        if (reserved[row][currentCol]) continue;
        const bit = bitIndex < dataBits.length ? dataBits[bitIndex] === 1 : false;
        modules[row][currentCol] = bit;
        bitIndex += 1;
      }
    }
    upwards = !upwards;
  }

  const bestMask = chooseBestMask(modules, reserved);
  applyMask(modules, reserved, bestMask);
  placeFormatInfo(modules, level, bestMask);
  return { modules, mask: bestMask };
}

function renderToCanvas(matrix: Matrix, canvas: HTMLCanvasElement, options: ToCanvasOptions = {}) {
  const width = typeof options.width === 'number' && options.width > 0 ? options.width : DEFAULT_SIZE;
  const margin = Math.max(0, Math.floor(options.margin ?? DEFAULT_MARGIN));
  const dark = options.color?.dark ?? '#000000';
  const light = options.color?.light ?? '#ffffff';

  const total = MODULE_COUNT + margin * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }
  canvas.width = width;
  canvas.height = width;
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, width, width);

  const scale = width / total;
  ctx.fillStyle = dark;
  for (let r = 0; r < MODULE_COUNT; r++) {
    for (let c = 0; c < MODULE_COUNT; c++) {
      if (!matrix[r][c]) continue;
      const x1 = (c + margin) * scale;
      const y1 = (r + margin) * scale;
      const x2 = (c + 1 + margin) * scale;
      const y2 = (r + 1 + margin) * scale;
      ctx.fillRect(Math.round(x1), Math.round(y1), Math.ceil(x2 - x1), Math.ceil(y2 - y1));
    }
  }
}

function renderToSvg(matrix: Matrix, options: ToStringOptions = {}): string {
  const size = options.width ?? DEFAULT_SIZE;
  const margin = Math.max(0, Math.floor(options.margin ?? DEFAULT_MARGIN));
  const dark = options.color?.dark ?? '#000000';
  const light = options.color?.light ?? '#ffffff';
  const total = MODULE_COUNT + margin * 2;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">`
  );
  parts.push(`<rect width="100%" height="100%" fill="${light}"/>`);
  for (let r = 0; r < MODULE_COUNT; r++) {
    for (let c = 0; c < MODULE_COUNT; c++) {
      if (!matrix[r][c]) continue;
      const x = c + margin;
      const y = r + margin;
      parts.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${dark}"/>`);
    }
  }
  parts.push('</svg>');
  return parts.join('');
}

function resolveLevel(options?: ToCanvasOptions | ToStringOptions): ErrorLevel {
  const level = options?.errorCorrectionLevel ?? 'M';
  return level;
}

export async function toCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options?: ToCanvasOptions
): Promise<void> {
  const level = resolveLevel(options);
  const { modules } = buildMatrix(text, level);
  renderToCanvas(modules, canvas, options);
}

export async function toString(
  text: string,
  options?: ToStringOptions
): Promise<string> {
  const level = resolveLevel(options);
  const { modules } = buildMatrix(text, level);
  return renderToSvg(modules, options);
}

const qrcode = {
  toCanvas,
  toString
};

export default qrcode;
