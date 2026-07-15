// UAT 16 — full Settings sweep (LIMERENCE). Mirrors script 15 exactly but
// under `?pack=limerence`, using LIMERENCE's own localStorage profile key
// (`limerence:profile:traveler` — packs are storage-namespaced, see
// L1.3d) — confirms the Settings round-trip isn't an ANAMNESIS-only path.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');
  await page.getByText('Settings', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });

  const rowCount = await page.locator('.settings-panel .toggle').count();
  assert(rowCount >= 6, `expected several toggle rows in LIMERENCE Settings, found ${rowCount}`);

  const reducedMotionRow = page.locator('.settings-panel').getByText('Reduced motion', { exact: true }).locator('..');
  const reducedMotionBtn = reducedMotionRow.locator('.toggle');
  const rmBefore = await reducedMotionBtn.textContent();
  await reducedMotionBtn.click();
  const rmAfter = await reducedMotionBtn.textContent();
  assert(rmBefore !== rmAfter, `reducedMotion toggle should change label on click, stayed "${rmBefore}"`);

  // LIMERENCE-specific: Light mode toggle should be present (supportsLightTheme: true).
  const lightModeCount = await page.locator('.settings-panel').getByText('Light mode', { exact: true }).count();
  assert(lightModeCount > 0, 'LIMERENCE Settings should offer a Light mode toggle (ANAMNESIS deliberately has none)');

  await page.getByText('Done', { exact: true }).click();
  await page.waitForTimeout(400);

  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  const profile = await page.evaluate(() => {
    const raw = localStorage.getItem('limerence:profile:traveler');
    return raw ? JSON.parse(raw) : null;
  });
  assert(profile?.settings, 'LIMERENCE profile.settings should exist after reload');
  assert(profile.settings.reducedMotion === true, `reducedMotion should have persisted as true, got ${profile.settings.reducedMotion}`);

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 16 (settings sweep, LIMERENCE): PASS — reducedMotion round-trip through reload + Light mode toggle present, zero errors');
});
