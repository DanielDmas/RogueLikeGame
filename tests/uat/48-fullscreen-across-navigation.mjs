// UAT 48 — real, non-mocked fullscreen persistence across every navigation
// path in the app, against the actual `npm run build:web` artifact (the
// same thing GH Pages serves). Owner report (2026-07-16): "when I clicked
// anamnesis from the first vestibule, after setting full screen, it
// resetted / changed." Prior UAT scripts (39-41) verified the mechanism
// using a spied/mocked requestFullscreen from *within* one page — this
// script instead drives real cross-document navigation with the real
// Fullscreen API (confirmed working in this sandbox's headless Chromium),
// covering every scenario the owner's report could plausibly describe.
//
// Requires DIST_WEB_BASE_URL pointed at a static server rooted at
// dist-web/ (see tests/uat/47-dist-web-deploy-smoke.mjs for the same
// setup). Budget: kept under 3 minutes by using the fastest possible path
// through each scenario (jump() rather than full onboarding where a
// scenario doesn't specifically need to test onboarding).
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const BASE_URL = process.env.DIST_WEB_BASE_URL ?? 'http://localhost:8767';
const SANDBOX_CHROMIUM_PATH = '/opt/pw-browsers/chromium';

function assert(condition, message) {
  if (!condition) throw new Error(`UAT assertion failed: ${message}`);
}

async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  return { page, errors };
}

const browser = await chromium.launch({
  executablePath: existsSync(SANDBOX_CHROMIUM_PATH) ? SANDBOX_CHROMIUM_PATH : undefined,
});
try {
  // --- Scenario 1: the owner's exact report — landing page, set fullscreen
  // via the gear, click ANAMNESIS, confirm it resumes on the very next click. ---
  {
    const { page, errors } = await newPage(browser);
    await page.goto(BASE_URL);
    await page.locator('#settings-toggle').click();
    await page.locator('#settings-overlay.open').waitFor({ state: 'visible' });
    await page.locator('#set-fullscreen').click();
    await page.waitForTimeout(200);
    assert(await page.evaluate(() => !!document.fullscreenElement), 'scenario 1: fullscreen should be on after the gear toggle');
    await page.locator('#settings-done').click();

    await page.locator('a.door--anamnesis').click();
    await page.waitForURL('**/anamnesis/**', { timeout: 8000 });
    assert(!(await page.evaluate(() => !!document.fullscreenElement)), 'scenario 1: fullscreen is unavoidably exited by the navigation itself (browser constraint)');

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(400);
    assert(await page.evaluate(() => !!document.fullscreenElement), 'scenario 1: fullscreen should resume on the first click after landing in ANAMNESIS');
    assert(errors.length === 0, `scenario 1: no console errors, got ${errors.join(' | ')}`);
    await page.close();
  }

  // --- Scenario 2: same, but LIMERENCE door, and resume via KEYBOARD only
  // (Space), not a click — the specific gap the widened trigger fixes. ---
  {
    const { page, errors } = await newPage(browser);
    await page.goto(BASE_URL);
    await page.locator('#settings-toggle').click();
    await page.locator('#settings-overlay.open').waitFor({ state: 'visible' });
    await page.locator('#set-fullscreen').click();
    await page.locator('#settings-done').click();

    await page.locator('a.door--limerence').click();
    await page.waitForURL('**/limerence/**', { timeout: 8000 });
    assert(!(await page.evaluate(() => !!document.fullscreenElement)), 'scenario 2: exited by navigation, as expected');

    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    assert(await page.evaluate(() => !!document.fullscreenElement), 'scenario 2: fullscreen should resume from a keyboard-only first interaction (Space), not just a click');
    assert(errors.length === 0, `scenario 2: no console errors, got ${errors.join(' | ')}`);
    await page.close();
  }

  // --- Scenario 3: NOT fullscreen on the landing page — clicking a door
  // must never force fullscreen (no dark pattern). ---
  {
    const { page, errors } = await newPage(browser);
    await page.goto(BASE_URL);
    assert(!(await page.evaluate(() => !!document.fullscreenElement)), 'scenario 3: should start non-fullscreen');
    await page.locator('a.door--anamnesis').click();
    await page.waitForURL('**/anamnesis/**', { timeout: 8000 });
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(400);
    assert(!(await page.evaluate(() => !!document.fullscreenElement)), 'scenario 3: a player who was never fullscreen must not be forced into it');
    assert(errors.length === 0, `scenario 3: no console errors, got ${errors.join(' | ')}`);
    await page.close();
  }

  // --- Scenario 4: fullscreen entered INSIDE the game (HUD gear), then the
  // Vestibule button navigates back to the landing page — round-trip the
  // other direction, resuming on the landing page itself. ---
  {
    const { page, errors } = await newPage(browser);
    await page.goto(`${BASE_URL}/anamnesis/?uat=1`);
    await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
    await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
    await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
    await page.locator('.settings-btn').waitFor({ state: 'visible', timeout: 8000 });
    await page.locator('.settings-btn').click();
    await page.locator('.settings-panel').waitFor({ state: 'visible', timeout: 5000 });
    const fsRow = page.locator('.setting-row', { hasText: 'Fullscreen' });
    await fsRow.locator('button.toggle').click();
    await page.waitForTimeout(200);
    assert(await page.evaluate(() => !!document.fullscreenElement), 'scenario 4: in-game fullscreen toggle should work');
    await page.getByText('Done', { exact: true }).click();

    // Menu -> pause -> Vestibule button (cross-document navigation).
    await page.locator('.menu-btn', { hasText: 'Menu' }).click();
    await page.getByText('The Vestibule', { exact: false }).click();
    await page.waitForURL(new RegExp(`${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`), { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);
    assert(!(await page.evaluate(() => !!document.fullscreenElement)), 'scenario 4: exited by the cross-document navigation, as expected');

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(400);
    assert(await page.evaluate(() => !!document.fullscreenElement), 'scenario 4: fullscreen should resume back on the landing page after returning via the Vestibule button');
    assert(errors.length === 0, `scenario 4: no console errors, got ${errors.join(' | ')}`);
    await page.close();
  }

  // --- Scenario 5: an in-game reload path (Reset current run) also
  // preserves fullscreen — covers flow.ts's reloadPage() helper directly,
  // distinct from the cross-document Vestibule navigation above. ---
  {
    const { page, errors } = await newPage(browser);
    await page.goto(`${BASE_URL}/anamnesis/?uat=1`);
    await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
    await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
    await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
    await page.locator('.settings-btn').waitFor({ state: 'visible', timeout: 8000 });
    await page.locator('.settings-btn').click();
    await page.locator('.settings-panel').waitFor({ state: 'visible', timeout: 5000 });
    const fsRow = page.locator('.setting-row', { hasText: 'Fullscreen' });
    await fsRow.locator('button.toggle').click();
    await page.waitForTimeout(200);
    assert(await page.evaluate(() => !!document.fullscreenElement), 'scenario 5: in-game fullscreen toggle should work');

    // "Reset current run" is a confirm-button (click twice) inside the same
    // panel, and triggers location.reload() — same URL, so waitForURL
    // resolves instantly without actually waiting for the reload to
    // happen. Stamp a marker that only a real navigation wipes instead.
    // The row has both a static label ("Reset current run") and the button
    // itself, whose text CHANGES to "Click again to confirm" after the
    // first click — scope to the button element specifically (not
    // getByText, which would match the row's own static label first).
    await page.evaluate(() => { window.__reloadMarker = 'still-here'; });
    const resetBtn = page.locator('.setting-row', { hasText: 'Reset current run' }).locator('button.toggle.danger');
    await resetBtn.click();
    await page.waitForTimeout(150);
    await resetBtn.click();
    await page.waitForFunction(() => window.__reloadMarker === undefined, { timeout: 8000 });
    await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
    await page.waitForTimeout(400);
    assert(!(await page.evaluate(() => !!document.fullscreenElement)), 'scenario 5: exited by the reload, as expected');

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(400);
    assert(await page.evaluate(() => !!document.fullscreenElement), 'scenario 5: fullscreen should resume after a reset-run reload');
    assert(errors.length === 0, `scenario 5: no console errors, got ${errors.join(' | ')}`);
    await page.close();
  }

  console.log('UAT 48 (fullscreen across every navigation scenario): PASS');
} finally {
  await browser.close();
}
