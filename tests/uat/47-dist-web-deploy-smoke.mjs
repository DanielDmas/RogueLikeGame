// UAT 47 — real deploy-artifact smoke test. Builds are dev-server-relative
// paths; this instead drives the actual `npm run build:web` output
// (dist-web/, the exact thing GH Pages serves) via a plain static file
// server, clicking through the real landing page into each game the way a
// player would — the strongest possible verification that item 13's
// dynamic-import change doesn't break the real production artifact (base:
// './' relative asset paths, the vestibule's own door links, etc.).
// Requires DIST_WEB_BASE_URL pointed at a static server rooted at dist-web/.
// Budget: well under 3 minutes.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const BASE_URL = process.env.DIST_WEB_BASE_URL ?? 'http://localhost:8766';
const SANDBOX_CHROMIUM_PATH = '/opt/pw-browsers/chromium';

function assert(condition, message) {
  if (!condition) throw new Error(`UAT assertion failed: ${message}`);
}

const browser = await chromium.launch({
  executablePath: existsSync(SANDBOX_CHROMIUM_PATH) ? SANDBOX_CHROMIUM_PATH : undefined,
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  // Land on the real rozcestník, click the ANAMNESIS door — exactly what a
  // player does. (?uat=1 can't be pre-set here since the door link itself
  // controls the target URL; append it after landing via direct nav instead
  // — still exercises the same dist-web/anamnesis/index.html asset paths.)
  await page.goto(BASE_URL);
  await page.locator('a.door--anamnesis').waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('a.door--anamnesis').click();
  await page.waitForURL('**/anamnesis/**', { timeout: 8000 });

  // Re-navigate with ?uat=1 so the UAT handle attaches (the door link itself
  // doesn't carry it) — same real dist-web/anamnesis/index.html + assets.
  const anamnesisUrl = new URL(page.url());
  anamnesisUrl.search = 'uat=1';
  await page.goto(anamnesisUrl.toString());
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForFunction(() => window.__anamnesisUat.state().currentRoom === 'wallet', { timeout: 10000 });
  const anamnesisBody = await page.evaluate(() => document.body.className);
  assert(anamnesisBody.includes('pack-anamnesis'), `expected pack-anamnesis on the real dist-web build, got "${anamnesisBody}"`);

  // Same for LIMERENCE, via the landing page's other door.
  await page.goto(BASE_URL);
  await page.locator('a.door--limerence').waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('a.door--limerence').click();
  await page.waitForURL('**/limerence/**', { timeout: 8000 });
  const limerenceUrl = new URL(page.url());
  limerenceUrl.search = 'uat=1';
  await page.goto(limerenceUrl.toString());
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.evaluate(() => window.__anamnesisUat.jump('the-front-desk'));
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForFunction(() => window.__anamnesisUat.state().currentRoom === 'the-front-desk', { timeout: 10000 });
  const limerenceBody = await page.evaluate(() => document.body.className);
  assert(limerenceBody.includes('pack-limerence'), `expected pack-limerence on the real dist-web build, got "${limerenceBody}"`);

  assert(errors.length === 0, `no console errors expected in the real deploy artifact, got: ${errors.join(' | ')}`);

  console.log('UAT 47 (dist-web deploy artifact smoke test): PASS');
} finally {
  await browser.close();
}
