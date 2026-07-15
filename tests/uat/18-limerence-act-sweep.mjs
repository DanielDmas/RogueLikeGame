// UAT 18 — LIMERENCE act sweep. Mirrors script 17 but for LIMERENCE: one
// representative room per act (0-4) plus the Understory, confirming each
// renders with zero console/page errors. Complementary to script 14
// (which only covers the 6 original bespoke-diorama rooms) — this sweeps
// across every act of the pack instead.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const ROOMS = [
  { id: 'the-front-desk', act: 0 },
  { id: 'the-read-receipt', act: 1 },
  { id: 'the-distance', act: 2 },
  { id: 'the-colleague', act: 3 },
  { id: 'the-kitchen-table', act: 4 },
  { id: 'the-registry', act: 4 }, // Understory
];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');

  const heartsLabel = await page.locator('.hearts').first().getAttribute('aria-label');
  assert(heartsLabel === 'Trust', `LIMERENCE HUD hearts aria-label should be "Trust", got "${heartsLabel}"`);

  const visited = [];
  for (const { id, act } of ROOMS) {
    await page.evaluate((roomId) => window.__anamnesisUat.jump(roomId), id);
    await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
    await page.waitForTimeout(700);
    const state = await page.evaluate(() => window.__anamnesisUat.state());
    assert(state.currentRoom === id, `jump(${id}) should land on ${id}, got ${state.currentRoom}`);
    const hasTextPanel = await page.locator('.text-panel').count();
    assert(hasTextPanel > 0, `${id} should render a text panel`);
    visited.push({ id, act, gotAct: state.act });
  }

  assert(errors.length === 0, `expected zero console/page errors across the LIMERENCE act sweep, got: ${JSON.stringify(errors)}`);
  console.log(`UAT 18 (LIMERENCE act sweep): PASS — ${visited.length} rooms across acts 0-4 + Understory, zero errors: ${JSON.stringify(visited)}`);
});
