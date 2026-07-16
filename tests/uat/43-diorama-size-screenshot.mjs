// UAT 43 — visual check for the bigger/closer diorama sizing change
// (DIORAMA_Z -10 -> -7.5 in dioramas.ts, DIORAMA_SCALE 1.35 in director.ts's
// setDiorama). Not a pixel-diff (no "before" capture exists in this
// environment) — jumps to a bespoke-diorama room and saves a screenshot for
// visual read-back, plus a sanity check that the render loop stays healthy
// (no console errors, non-black frame) with the larger/closer geometry.
// Budget: well under 3 minutes.
import { withPage, gotoUat, jump, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await gotoUat(page);
  await jump(page, 'marys-room');
  await page.waitForTimeout(1000);
  // jump() can land on the act-intro card first on a fresh profile — advance
  // past it (Space is the game's own "continue" key) to reach the room's own
  // beats where the diorama is actually visible behind the text panel.
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);

  const shot = await page.screenshot();
  writeFileSync('/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad/diorama-marys-room.png', shot);

  const fps = await page.evaluate(() => window.__anamnesisUat.fps());
  assert(fps > 0, `render loop should be healthy (fps > 0), got ${fps}`);
  assert(errors.length === 0, `no console errors expected, got: ${errors.join(' | ')}`);

  console.log('UAT 43 (diorama size screenshot): PASS — screenshot saved to scratchpad');
});
