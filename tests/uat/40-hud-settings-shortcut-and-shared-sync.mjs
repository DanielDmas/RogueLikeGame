// UAT 40 — the HUD's new persistent Settings gear (top-right, beside Menu)
// opens Settings in one click during a run, and saving Settings mirrors the
// four shared display fields (quality/renderScale/uiZoom/fpsCap) into
// 'vestibule:sharedDisplaySettings' — see src/engine/sharedDisplaySettings.ts.
// Budget: well under 3 minutes (one jump, one click, one toggle, one read).
import { withPage, gotoUat, jump, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await jump(page, 'wallet');

  // The gear button must be visible and clickable mid-run without going
  // through Menu first.
  const gear = page.locator('.settings-btn');
  await gear.waitFor({ state: 'visible', timeout: 8000 });
  await gear.click();

  const panel = page.locator('.settings-panel');
  await panel.waitFor({ state: 'visible', timeout: 5000 });

  // Flip "High visual quality" on — the toggle button's own label reads
  // on/off, matching showSettings' toggleRow implementation.
  const qualityRow = page.locator('.setting-row', { hasText: 'High visual quality' });
  const qualityBtn = qualityRow.locator('button.toggle');
  const beforeLabel = (await qualityBtn.textContent())?.trim();
  await qualityBtn.click();
  const afterLabel = (await qualityBtn.textContent())?.trim();
  assert(beforeLabel !== afterLabel, `clicking the quality toggle should flip its label, stayed "${beforeLabel}"`);

  // Close via Done.
  await page.getByText('Done', { exact: true }).click();
  await panel.waitFor({ state: 'hidden', timeout: 5000 });

  // The shared key must now hold the new quality value.
  const shared = await page.evaluate(() => {
    const raw = localStorage.getItem('vestibule:sharedDisplaySettings');
    return raw ? JSON.parse(raw) : null;
  });
  assert(shared != null, 'vestibule:sharedDisplaySettings should exist after closing Settings');
  assert(
    shared.quality === (afterLabel === 'on' ? 'high' : 'low'),
    `shared quality should match the toggle's new state (${afterLabel}), got ${shared?.quality}`,
  );
  assert('renderScale' in shared && 'uiZoom' in shared && 'fpsCap' in shared, 'shared record should carry all four fields');

  // The run itself must be untouched — this shortcut must not have reloaded
  // or reset anything (still on the same room).
  const state = await page.evaluate(() => window.__anamnesisUat.state());
  assert(state.currentRoom === 'wallet', `should still be in the jumped-to room, got ${state.currentRoom}`);

  console.log('UAT 40 (HUD settings shortcut + shared sync write): PASS');
});
