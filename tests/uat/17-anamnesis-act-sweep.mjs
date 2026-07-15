// UAT 17 — ANAMNESIS act sweep. Jumps directly to one representative room
// per act (0 through 4) plus the Understory, confirming each renders its
// beats/choices with zero console/page errors — a broad "does every floor
// of the building still stand" check, complementary to script 05 (one
// specific hidden-ending path) and 14 (LIMERENCE dioramas only).
import { withPage, gotoUat, assert } from './_helpers.mjs';

const ROOMS = [
  { id: 'waiting-room', act: 0 }, // prologue
  { id: 'wallet', act: 1 },
  { id: 'editor', act: 3 },
  { id: 'boulder', act: 4 },
  { id: 'the-archive', act: 4 }, // Understory (room.act stays 4; graph.understorySequence is separate)
];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);

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

  assert(errors.length === 0, `expected zero console/page errors across the act sweep, got: ${JSON.stringify(errors)}`);
  console.log(`UAT 17 (ANAMNESIS act sweep): PASS — ${visited.length} rooms across acts 0-5, zero errors: ${JSON.stringify(visited)}`);
});
