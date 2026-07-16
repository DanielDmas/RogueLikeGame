// UAT 42 — the Vestibule/landing page's own Settings gear (top-right),
// added because the landing page previously had zero settings access at
// all — the literal gap the owner's request named ("even from the
// vestibule"). Verifies: the panel opens, a toggle click writes
// 'vestibule:sharedDisplaySettings' (the same key/shape
// sharedDisplaySettings.ts reads at each pack's boot — UAT 40/41 cover that
// side), and a pre-existing shared record is read back and displayed
// correctly on open. Served statically (this page isn't part of the Vite
// build) via LANDING_BASE_URL. Budget: well under 3 minutes.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const LANDING_URL = process.env.LANDING_BASE_URL ?? 'http://localhost:8765';
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

  await page.goto(LANDING_URL);

  // Nothing shared yet: panel should open showing the built-in defaults.
  await page.locator('#settings-toggle').click();
  await page.locator('#settings-overlay.open').waitFor({ state: 'visible', timeout: 5000 });
  const qualityBefore = await page.locator('#set-quality').textContent();
  assert(qualityBefore?.trim() === 'off', `quality should default to off (low), got "${qualityBefore}"`);

  // Cycle render resolution and toggle quality — both should write through.
  await page.locator('#set-quality').click();
  await page.locator('#set-scale').click();
  await page.locator('#settings-done').click();
  await page.locator('#settings-overlay.open').waitFor({ state: 'hidden', timeout: 5000 });

  const written = await page.evaluate(() => {
    const raw = localStorage.getItem('vestibule:sharedDisplaySettings');
    return raw ? JSON.parse(raw) : null;
  });
  assert(written != null, 'closing the panel should have left a shared record behind');
  assert(written.quality === 'high', `quality toggle should have written "high", got ${written.quality}`);
  assert(written.renderScale === 'standard', `one click should cycle renderScale performance -> standard, got ${written.renderScale}`);

  // Reload and pre-seed a different record — the panel must display it
  // correctly on open, not just write it.
  await page.evaluate(() => {
    localStorage.setItem(
      'vestibule:sharedDisplaySettings',
      JSON.stringify({ quality: 'low', renderScale: 'sharp', uiZoom: 1.1, fpsCap: 60 }),
    );
  });
  await page.reload();
  await page.locator('#settings-toggle').click();
  await page.locator('#settings-overlay.open').waitFor({ state: 'visible', timeout: 5000 });
  const scaleLabel = await page.locator('#set-scale').textContent();
  const fpsLabel = await page.locator('#set-fps').textContent();
  const zoomValue = await page.locator('#set-zoom').inputValue();
  assert(scaleLabel?.trim() === 'Sharp', `should display the pre-seeded "Sharp" scale, got "${scaleLabel}"`);
  assert(fpsLabel?.trim() === '60fps', `should display the pre-seeded 60fps cap, got "${fpsLabel}"`);
  assert(zoomValue === '110', `should display the pre-seeded 110% zoom, got "${zoomValue}"`);

  console.log('UAT 42 (landing page settings gear): PASS');
} finally {
  await browser.close();
}
