// UAT 63 — Settings data-panel timing chaos. Scripts 60/61 chaos-test HUD/menu
// buttons and room transitions; this targets a surface neither touches: the
// Settings panel's own "Data" section (Reset current run, Reset all progress,
// Export, Import), whose buttons use a two-click arm/confirm pattern
// (`confirmButton`) with a 4s disarm timer — exactly the kind of stateful
// timing logic that's easy to race.
//
// Design: rapidly fire overlapping clicks across all four data actions in
// random order and random timing, including double-confirming two DIFFERENT
// actions in the same window (arm Reset-all-progress, then before its 4s
// timer fires, arm and confirm Export) and pasting into the Import textarea
// mid-sequence. `chainSave`'s own serialization (flow.ts) should make this
// safe regardless of order; the point is proving that empirically rather
// than trusting the implementation.
//
// Beyond "no error thrown", asserts the game is still recoverable afterward
// (a fresh load renders real content), same discipline as scripts 60-62.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const DURATION_MS = 30000;

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await gotoUat(page);
  await page.waitForTimeout(400);

  // Seed a real in-progress run so "Reset current run" has something to act
  // on, then open Settings from the title screen (the panel is reachable
  // from both title and pause menu; title is simpler to reach repeatedly).
  await page.evaluate(() => window.__anamnesisUat?.jump('waiting-room'));
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape'); // pause menu, which also offers Settings
  await page.waitForTimeout(300);

  const openSettings = async () => {
    const fromPause = page.getByText('Settings', { exact: true }).first();
    if (await fromPause.count()) {
      await fromPause.click({ timeout: 2000 }).catch(() => {});
    } else {
      await page.locator('[data-uat="settings-button"]').first().click({ timeout: 2000 }).catch(() => {});
    }
  };
  await openSettings();
  await page.waitForSelector('.import-textarea', { timeout: 5000 }).catch(() => {});

  const validAltProfile = JSON.stringify({ runsCompleted: 2, hasSeenAbout: true, run: null });

  const actions = [
    // Arm/confirm Reset current run.
    async () => page.getByText('Reset current run', { exact: true }).first().click({ timeout: 1500 }).catch(() => {}),
    // Arm/confirm Reset all progress (danger button, same pattern).
    async () => page.getByText('Reset all progress', { exact: true }).first().click({ timeout: 1500 }).catch(() => {}),
    // Export (single-click, no confirm — downloads a blob).
    async () => page.locator('button:has-text("Download")').first().click({ timeout: 1500 }).catch(() => {}),
    // Paste a valid alternate profile into Import without confirming yet.
    async () => page.locator('.import-textarea').first().fill(validAltProfile).catch(() => {}),
    // Arm/confirm Import.
    async () => page.locator('button:has-text("Import")').first().click({ timeout: 1500 }).catch(() => {}),
    // Escape mid-sequence — closes the panel while timers may still be armed.
    async () => page.keyboard.press('Escape').catch(() => {}),
    // Reopen Settings — the armed-button timers from before should not leak
    // into a freshly rendered panel (each render is a new DOM instance).
    openSettings,
  ];

  const start = Date.now();
  let i = 0;
  while (Date.now() - start < DURATION_MS) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    await action();
    // Deliberately short and irregular — the point is overlapping timers,
    // not politely waiting for each click to settle.
    await page.waitForTimeout(40 + Math.floor(Math.random() * 120));
    i++;
  }

  console.log(`settings data-panel chaos: ${i} actions, ${errors.length} errors`);
  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);

  // Recoverability: a fresh load after all this chaos (which legitimately
  // may have reset progress, imported a different profile, or reloaded
  // mid-chaos on its own) must still render real content.
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  const bodyText = await page.evaluate(() => document.body.innerText);
  assert(bodyText.trim().length > 0, 'expected real rendered content after chaos, got a blank page');
  const recovery = await page.locator('.recovery-panel').count();
  assert(recovery === 0, 'should not land on the crash-recovery overlay after chaos');

  console.log('UAT 63 (settings data-panel chaos): PASS');
});
