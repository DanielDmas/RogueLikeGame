// UAT 44 — same diorama-sizing verification as UAT 43, LIMERENCE side (the
// signature "two phones on one bed" diorama), since both packs share the
// same DIORAMA_Z/DIORAMA_SCALE mechanism but have entirely different
// content — worth a spot check given how visually distinct LIMERENCE's
// rooms are. Budget: well under 3 minutes.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { writeFileSync } from 'node:fs';

const BASE_URL = process.env.LIMERENCE_BASE_URL ?? 'http://localhost:5174';
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

  await page.goto(`${BASE_URL}/?uat=1`);
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.evaluate(() => window.__anamnesisUat.jump('the-distance'));
  await page.waitForTimeout(1200);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);

  const shot = await page.screenshot();
  writeFileSync(
    '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad/diorama-the-distance.png',
    shot,
  );

  const fps = await page.evaluate(() => window.__anamnesisUat.fps());
  assert(fps > 0, `render loop should be healthy, got fps=${fps}`);
  assert(errors.length === 0, `no console errors expected, got: ${errors.join(' | ')}`);

  console.log('UAT 44 (LIMERENCE diorama size screenshot): PASS — screenshot saved to scratchpad');
} finally {
  await browser.close();
}
