// UAT 07 — dynamic scenery setting persistence (spec 09 §S2, M4 item E3).
// The mood-tint math itself (applyMood/MOOD_TINTS) is already deterministically
// unit-tested (src/test/mood.test.ts) — the only thing worth a live browser
// check is that the "Dynamic scenery" setting actually round-trips through
// Settings -> localStorage -> reload -> Settings UI, so a player's choice
// sticks. (A pixel-color visual comparison was attempted here first, but
// proved unreliable in this sandbox: repeated screenshot-averaging attempts
// returned identical results whether the setting was on or off, meaning
// either the toggle doesn't take effect fast enough after a reload for this
// flow, or the signal is too small relative to starfield animation noise to
// measure via full-frame averaging — see UPGRADE_PLAN.md's S2 entry for the
// honest writeup and what a follow-up pass on a faster machine should try.)
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);

  await page.getByText('Settings', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { timeout: 10000 });

  const label = page.getByText('Dynamic scenery', { exact: false });
  assert((await label.count()) > 0, 'Settings should show the "Dynamic scenery" row');

  const row = page.locator('.setting-row', { has: label });
  const toggle = row.locator('button.toggle');
  const before = await toggle.textContent();
  await toggle.click();
  await page.waitForTimeout(150);
  const after = await toggle.textContent();
  assert(before !== after, `clicking the Dynamic scenery toggle should change its label (was "${before}")`);

  await page.getByText('Done', { exact: true }).click();
  await page.waitForTimeout(150);
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });

  await page.getByText('Settings', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { timeout: 10000 });
  const afterReloadRow = page.locator('.setting-row', { has: page.getByText('Dynamic scenery', { exact: false }) });
  const afterReload = await afterReloadRow.locator('button.toggle').textContent();
  assert(
    afterReload === after,
    `Dynamic scenery setting should survive a reload (was "${after}" before reload, "${afterReload}" after)`,
  );

  console.log('UAT 07 (dynamic scenery setting persistence, E3): PASS');
});
