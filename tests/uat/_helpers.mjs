// Shared helpers for the committed UAT suite (spec 09 §S7).
// Every script in this directory is a plain Node/Playwright script (not a
// test-runner file) so it can be run directly with `node tests/uat/<name>.mjs`
// against a dev server already running on BASE_URL. See tests/uat/README.md.
import { existsSync } from 'node:fs';
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

/** Advances beats by clicking the text panel `n` times, with a short wait after each. */
export async function advance(page, n = 1, waitMs = 300) {
  for (let i = 0; i < n; i++) {
    await page.locator('.text-panel').first().click({ timeout: 3000 }).catch(() => {});
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
