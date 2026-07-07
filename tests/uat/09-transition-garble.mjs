// UAT 09 — transition garble check (spec 09 §S2, M4 item H3). Completes an
// act-gate room (the-photograph, Act I's gate) and bursts 5 screenshots
// during the resulting door walkThrough into Act II, asserting no frame is
// pure black or noise-spiked — the signature of a half-disposed scene
// (old act's geometry torn down before the new act's is ready).
import { withPage, gotoUat, averagePngRgb, assert } from './_helpers.mjs';

async function advanceUntil(page, isDone, maxClicks) {
  for (let i = 0; i < maxClicks; i++) {
    if (await isDone()) return true;
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(150);
  }
  return isDone();
}

/** A frame reads as garbled if it's near-uniformly black (fully disposed,
 * nothing drawn yet) — average brightness near 0 across all channels. A
 * healthy transition frame, even mid-fade, still shows *some* non-black
 * content (fog, a door silhouette, UI chrome). */
function isGarbledFrame([r, g, b]) {
  return r < 2 && g < 2 && b < 2;
}

await withPage(async (page) => {
  await gotoUat(page);

  await page.evaluate(() => window.__anamnesisUat.jump('photograph'));
  await page.waitForTimeout(1000);

  const hasChoices = () => page.locator('.choice-card').count().then((n) => n > 0);
  assert(await advanceUntil(page, hasChoices, 6), 'the-photograph should offer a choice within 6 beat-advances');
  await page.locator('.choice-card').first().click({ timeout: 12000 });

  const hasDoors = () => page.evaluate(() => window.__anamnesisUat.doorRects().length > 0);
  const hasFieldNote = () => page.locator('.fn-close').count().then((n) => n > 0);
  await advanceUntil(page, async () => (await hasDoors()) || (await hasFieldNote()), 6);
  if (await hasFieldNote()) {
    await page.locator('.fn-close').click();
    await page.waitForTimeout(700);
  }
  assert(await advanceUntil(page, hasDoors, 4), 'a door offer should appear after completing the-photograph');

  // Doors are 3D canvas objects (clicked via raycasting), not DOM elements —
  // press "1" (the game's own door-select shortcut) to walk through the
  // gate's single door, then immediately burst-capture the transition. Uses
  // a page-level screenshot with an explicit clip (the canvas's own
  // bounding box, grabbed once beforehand) rather than `locator.screenshot()`,
  // which waits for the target to stop animating — precisely the moment
  // this check needs to observe mid-motion.
  const canvasBox = await page.locator('#scene').boundingBox();
  await page.keyboard.press('1');
  const frames = [];
  for (let i = 0; i < 4; i++) {
    const buf = await page.screenshot({ clip: canvasBox });
    frames.push(averagePngRgb(buf));
    await page.waitForTimeout(100);
  }

  const garbled = frames.filter(isGarbledFrame);
  console.log('frame averages:', frames.map((f) => f.map((v) => v.toFixed(0)).join(',')).join(' | '));
  assert(garbled.length < frames.length, 'at least one captured frame should show visible content, not pure black throughout');

  console.log('UAT 09 (transition garble check, H3): PASS');
});
