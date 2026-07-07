// Shared helpers for the committed UAT suite (spec 09 §S7).
// Every script in this directory is a plain Node/Playwright script (not a
// test-runner file) so it can be run directly with `node tests/uat/<name>.mjs`
// against a dev server already running on BASE_URL. See tests/uat/README.md.
import { existsSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { chromium } from 'playwright';

export const BASE_URL = process.env.UAT_BASE_URL ?? 'http://localhost:5173';
export const PROFILE_KEY = 'anamnesis:profile:traveler';

/** Most machines should just let Playwright resolve its own downloaded browser
 * (`npx playwright install chromium`). This fallback exists only for
 * environments — like this project's remote execution sandbox — that
 * pre-stage a browser at a fixed path outside Playwright's normal cache;
 * override with UAT_CHROMIUM_PATH if yours differs. */
const SANDBOX_CHROMIUM_PATH = '/opt/pw-browsers/chromium';

function resolveExecutablePath() {
  if (process.env.UAT_CHROMIUM_PATH) return process.env.UAT_CHROMIUM_PATH;
  if (existsSync(SANDBOX_CHROMIUM_PATH)) return SANDBOX_CHROMIUM_PATH;
  return undefined;
}

export async function withPage(fn) {
  const browser = await chromium.launch({ executablePath: resolveExecutablePath() });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(15000);
  try {
    await fn(page);
  } finally {
    await browser.close();
  }
}

/** Loads the game under `?uat=1` and waits for the debug handle to attach. */
export async function gotoUat(page, query = 'uat=1') {
  await page.goto(`${BASE_URL}/?${query}`);
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
}

/** Reads the persisted profile from localStorage (JSON), or null if absent. */
export async function readProfile(page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, PROFILE_KEY);
}

/** Applies `mutator` to the persisted profile in place, then optionally reloads. */
export async function patchProfile(page, mutator, { reload = true } = {}) {
  await page.evaluate(
    ({ key, mutatorSrc }) => {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      // eslint-disable-next-line no-eval -- trusted, same-process test script
      const fn = eval(`(${mutatorSrc})`);
      fn(parsed);
      localStorage.setItem(key, JSON.stringify(parsed));
    },
    { key: PROFILE_KEY, mutatorSrc: mutator.toString() },
  );
  if (reload) await page.reload();
}

/** Jumps straight to `roomId` via the UAT handle (persists + reloads on its own). */
export async function jump(page, roomId) {
  await page.evaluate((id) => window.__anamnesisUat.jump(id), roomId);
  await page.waitForTimeout(1200);
}

/** Clicks "Continue the journey" on the title screen. */
export async function continueJourney(page) {
  await page.getByText('CONTINUE THE JOURNEY', { exact: false }).click();
  await page.waitForTimeout(600);
}

/** Advances beats by clicking the text panel `n` times, with a short wait after each.
 * The per-click timeout is generous (12s) rather than Playwright's 5s default: some
 * sandboxes' headless Chromium has multi-second click latency, and a timeout that's
 * too tight here fails silently (via the trailing `.catch`) instead of advancing. */
export async function advance(page, n = 1, waitMs = 300) {
  for (let i = 0; i < n; i++) {
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(waitMs);
  }
}

/** Clicks the first choice card whose text matches `pattern`. Returns its text, or null. */
export async function clickChoiceMatching(page, pattern) {
  return page.evaluate((src) => {
    const re = new RegExp(src, 'i');
    const cards = Array.from(document.querySelectorAll('.choice-card'));
    const target = cards.find((c) => c.offsetParent !== null && re.test(c.textContent || ''));
    if (!target) return null;
    target.click();
    return target.textContent;
  }, pattern.source);
}

export function assert(condition, message) {
  if (!condition) throw new Error(`UAT assertion failed: ${message}`);
}

/** Minimal PNG decoder (8-bit, non-interlaced, color type 2/RGB or 6/RGBA
 * only — exactly what a Playwright `.screenshot()` buffer produces) using
 * only Node's built-in zlib, so the committed UAT suite needs no extra
 * image-decoding dependency. Returns { width, height, channels, pixels }.
 * Unfilters each scanline per the PNG spec (filter types 0-4). */
function decodePng(buf) {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error('not a PNG buffer');
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idatChunks = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data.readUInt8(8);
      colorType = data.readUInt8(9);
      if (bitDepth !== 8) throw new Error(`unsupported PNG bit depth ${bitDepth}`);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 8 + len + 4; // length + type + data + crc
  }
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : (() => {
    throw new Error(`unsupported PNG color type ${colorType}`);
  })();
  const raw = inflateSync(Buffer.concat(idatChunks));
  const stride = width * channels;
  const pixels = new Uint8Array(height * stride);
  let prevRow = new Uint8Array(stride);
  let rawOffset = 0;
  for (let y = 0; y < height; y++) {
    const filterType = raw[rawOffset];
    rawOffset += 1;
    const row = new Uint8Array(stride);
    for (let x = 0; x < stride; x++) {
      const rawByte = raw[rawOffset + x];
      const a = x >= channels ? row[x - channels] : 0;
      const b = prevRow[x];
      const c = x >= channels ? prevRow[x - channels] : 0;
      let value;
      switch (filterType) {
        case 0:
          value = rawByte;
          break;
        case 1:
          value = rawByte + a;
          break;
        case 2:
          value = rawByte + b;
          break;
        case 3:
          value = rawByte + Math.floor((a + b) / 2);
          break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          const pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          value = rawByte + pred;
          break;
        }
        default:
          throw new Error(`unsupported PNG filter type ${filterType}`);
      }
      row[x] = value & 0xff;
    }
    pixels.set(row, y * stride);
    prevRow = row;
    rawOffset += stride;
  }
  return { width, height, channels, pixels };
}

/** Average [r, g, b] (0-255 each) over an entire PNG screenshot buffer. */
export function averagePngRgb(buf) {
  const { width, height, channels, pixels } = decodePng(buf);
  let r = 0;
  let g = 0;
  let b = 0;
  const n = width * height;
  for (let i = 0; i < pixels.length; i += channels) {
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
  }
  return [r / n, g / n, b / n];
}
