// UAT 44 — same diorama-sizing verification as UAT 43, LIMERENCE side (the
// signature "two phones on one bed" diorama), since both packs share the
// same DIORAMA_Z/DIORAMA_SCALE mechanism but have entirely different
// content — worth a spot check given how visually distinct LIMERENCE's
// rooms are. Budget: well under 3 minutes.
//
// Originally hit its own dedicated `dev:limerence` server on a second port
// — that architecture is gone since item 13's single-bundle-both-packs fix
// (2026-07-16); LIMERENCE is reached via `?pack=limerence` on the same
// shared dev server every other script uses, exactly like script 18/14.
// Fixed 2026-07-18 to match.
import { withPage, gotoUat, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');
  await page.evaluate(() => window.__anamnesisUat.jump('the-distance'));
  await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
  await page.waitForSelector('.text-panel', { timeout: 10000 });
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);

  const shot = await page.screenshot();
  writeFileSync(
    '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad/diorama-the-distance.png',
    shot,
  );

  const fps = await page.evaluate(() => window.__anamnesisUat.fps());
  assert(fps > 0, `render loop should be healthy, got fps=${fps}`);
  assert(errors.length === 0, `no console errors expected, got: ${errors.join(' | ')}`);

  console.log('UAT 44 (LIMERENCE diorama size screenshot): PASS — screenshot saved to scratchpad');
});
