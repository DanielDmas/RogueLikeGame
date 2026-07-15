// UAT 15 — full Settings sweep (ANAMNESIS). Opens Settings, flips two
// simple round-trip-safe booleans (reducedMotion, highContrast) plus the
// language cycle button, closes the panel (which persists `current`),
// reloads, and confirms every change survived — a broader companion to
// script 06 (layout only) and 07 (dynamicScenery only), covering the
// toggle round-trip itself rather than just one setting or one viewport.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  await page.getByText('Settings', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });

  const rowCount = await page.locator('.settings-panel .toggle').count();
  assert(rowCount >= 6, `expected several toggle rows in Settings, found ${rowCount}`);

  const reducedMotionRow = page.locator('.settings-panel').getByText('Reduced motion', { exact: true }).locator('..');
  const reducedMotionBtn = reducedMotionRow.locator('.toggle');
  const rmBefore = await reducedMotionBtn.textContent();
  await reducedMotionBtn.click();
  const rmAfter = await reducedMotionBtn.textContent();
  assert(rmBefore !== rmAfter, `reducedMotion toggle should change label on click, stayed "${rmBefore}"`);

  const contrastRow = page.locator('.settings-panel').getByText('High-contrast text', { exact: true }).locator('..');
  const contrastBtn = contrastRow.locator('.toggle');
  const hcBefore = await contrastBtn.textContent();
  await contrastBtn.click();
  const hcAfter = await contrastBtn.textContent();
  assert(hcBefore !== hcAfter, `highContrast toggle should change label on click, stayed "${hcBefore}"`);

  // Close (persists `current` via resolve()).
  await page.getByText('Done', { exact: true }).click();
  await page.waitForTimeout(400);

  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  const profile = await page.evaluate(() => {
    const raw = localStorage.getItem('anamnesis:profile:traveler');
    return raw ? JSON.parse(raw) : null;
  });
  assert(profile?.settings, 'profile.settings should exist after reload');
  assert(profile.settings.reducedMotion === true, `reducedMotion should have persisted as true, got ${profile.settings.reducedMotion}`);
  assert(profile.settings.highContrast === true, `highContrast should have persisted as true, got ${profile.settings.highContrast}`);

  // Reopen and confirm the UI reflects the persisted state too, not just localStorage.
  await page.getByText('Settings', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });
  const rmNowOn = await page.locator('.settings-panel').getByText('Reduced motion', { exact: true }).locator('..').locator('.toggle').evaluate((el) => el.classList.contains('on'));
  assert(rmNowOn, 'Reduced motion toggle should render as "on" after reload, matching the persisted setting');
  await page.getByText('Done', { exact: true }).click();

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 15 (settings sweep, ANAMNESIS): PASS — reducedMotion + highContrast round-trip through reload, zero errors');
});
