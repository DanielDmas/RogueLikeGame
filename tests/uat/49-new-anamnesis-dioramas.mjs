// UAT 49 — live verification of the 12 ANAMNESIS dioramas added to close
// the diorama-coverage gap (task #165, 2026-07-16): ANAMNESIS was at 21/33
// rooms covered vs. LIMERENCE's genuine 34/34 full parity. Jumps to each of
// the 12 newly-covered rooms, confirms the render loop stays healthy (no
// console errors, fps > 0) and saves a screenshot for visual read-back.
// Budget: well under 3 minutes (12 quick jumps, no typewriter waits needed
// since ?uat=1 turns the typewriter off).
import { withPage, gotoUat, jump, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

const SCRATCH = '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad';

const ROOMS = [
  'waiting-room',
  'wallet',
  'promotion',
  'beggars-math',
  'quiet-alarm',
  'dinner-table',
  'photograph',
  'court-of-usher',
  'introduction',
  'free-will',
  'last-message',
  'door-that-asks',
];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await gotoUat(page);

  for (const roomId of ROOMS) {
    await jump(page, roomId);
    await page.waitForTimeout(600);
    // jump() can land on an act-intro card first — advance past it.
    await page.keyboard.press('Space');
    await page.waitForTimeout(600);
    await page.keyboard.press('Space');
    await page.waitForTimeout(600);

    const shot = await page.screenshot();
    writeFileSync(`${SCRATCH}/diorama-${roomId}.png`, shot);

    const fps = await page.evaluate(() => window.__anamnesisUat.fps());
    assert(fps > 0, `${roomId}: render loop should be healthy (fps > 0), got ${fps}`);
  }

  assert(errors.length === 0, `no console errors expected across all 12 rooms, got: ${errors.join(' | ')}`);
  console.log('UAT 49 (12 new ANAMNESIS dioramas): PASS — screenshots saved to scratchpad');
});
