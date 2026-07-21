// UAT 56 — same owner report as UAT 55, but via a REAL door click and
// walkThrough (not jump()), since jump()'s reload path resumes mid-room
// without ever animating the camera in — it stays at the wide corridor
// framing, not the close "parked" position a real player actually reads
// beats from. Screenshots the very first real walkThrough (the prologue's
// own door), immediately on arrival, to catch that close framing before
// any further clicks could land on an unrelated overlay (field note, etc).
import { withPage, gotoUat, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');
  await page.getByText('Begin', { exact: true }).click();
  await page.waitForTimeout(600);
  await page.locator('.about-panel').waitFor({ state: 'visible', timeout: 8000 });
  await page.getByText('Back', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByText('Skip', { exact: false }).click();
  await page.waitForTimeout(400);

  await page.locator('.choice-card').first().waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('.choice-card').first().click();
  await page.waitForFunction(() => window.__anamnesisUat.state().currentRoom != null, { timeout: 8000 });
  // The real walkThrough dolly + fade takes a moment; wait for it to settle,
  // then screenshot before any further click could advance past this beat.
  await page.waitForTimeout(1500);

  const roomId = await page.evaluate(() => window.__anamnesisUat.state().currentRoom);
  const shot = await page.screenshot();
  writeFileSync(
    '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad/diorama-real-walkthrough.png',
    shot,
  );

  const fps = await page.evaluate(() => window.__anamnesisUat.fps());
  assert(fps > 0, `render loop should be healthy, got fps=${fps}`);
  assert(errors.length === 0, `no console errors expected, got: ${errors.join(' | ')}`);

  console.log(`UAT 56 (real walkThrough diorama framing, room "${roomId}"): PASS — screenshot saved to scratchpad`);
});
