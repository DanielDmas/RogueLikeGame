// UAT 57 — sanity check that the diorama Y-lift (owner report 2026-07-21,
// fixed alongside script 55/56) doesn't look wrong in ANAMNESIS, since the
// lift is applied in the shared director code, not per-pack.
import { withPage, gotoUat, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
  await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
  await page.waitForSelector('.text-panel', { timeout: 10000 });
  await page.waitForTimeout(800);

  const shot = await page.screenshot();
  writeFileSync(
    '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad/diorama-lift-anamnesis-wallet.png',
    shot,
  );

  const fps = await page.evaluate(() => window.__anamnesisUat.fps());
  assert(fps > 0, `render loop should be healthy, got fps=${fps}`);
  assert(errors.length === 0, `no console errors expected, got: ${errors.join(' | ')}`);

  console.log('UAT 57 (ANAMNESIS diorama lift sanity check): PASS — screenshot saved to scratchpad');
});
