// UAT 55 — owner report (2026-07-21): LIMERENCE dioramas were covered by
// the bottom text/choices panel, and the F4 "back" button was getting
// clipped in LIMERENCE by .text-panel's clip-path. Verifies:
// (a) a floor-anchored LIMERENCE diorama (the-read-receipt, y=0 local
//     anchor) renders with the fix, screenshot saved for visual review;
// (b) the beat-back button, once visible (2nd beat onward), is not
//     positioned outside its panel's clipped box in LIMERENCE.
import { withPage, gotoUat, advance, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');
  await page.evaluate(() => window.__anamnesisUat.jump('the-read-receipt'));
  await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
  await page.waitForSelector('.text-panel', { timeout: 10000 });
  await page.waitForTimeout(800);

  const shot1 = await page.screenshot();
  writeFileSync(
    '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad/diorama-lift-read-receipt-beat0.png',
    shot1,
  );

  // Advance to the 2nd beat so the back button becomes visible, then check
  // its geometry stays inside the (clipped) panel box.
  await advance(page, 1, 500);
  const geom = await page.evaluate(() => {
    const back = document.querySelector('.beat-back');
    const panel = document.querySelector('.text-panel');
    if (!back || !panel) return null;
    const b = back.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    return { backLeft: b.left, backVisible: getComputedStyle(back).display !== 'none', panelLeft: p.left, backWidth: b.width };
  });
  assert(geom, 'expected both .beat-back and .text-panel to exist on the 2nd beat');
  assert(geom.backVisible, 'expected .beat-back to be visible on the 2nd beat');
  assert(
    geom.backLeft >= geom.panelLeft,
    `expected the back button's left edge (${geom.backLeft}) to stay inside the panel's left edge (${geom.panelLeft}) so LIMERENCE's clip-path can't cut it off`,
  );

  const shot2 = await page.screenshot();
  writeFileSync(
    '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad/diorama-lift-read-receipt-beat1-backbtn.png',
    shot2,
  );

  const fps = await page.evaluate(() => window.__anamnesisUat.fps());
  assert(fps > 0, `render loop should be healthy, got fps=${fps}`);
  assert(errors.length === 0, `no console errors expected, got: ${errors.join(' | ')}`);

  console.log('UAT 55 (diorama lift + back-button-inside-panel-box): PASS — screenshots saved to scratchpad');
});
