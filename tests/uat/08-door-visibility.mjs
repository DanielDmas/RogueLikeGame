// UAT 08 — door visibility sweep (spec 09 §S2, M4 item H2). Confirms every
// offered door's projected screen rect is fully on-screen (per the
// `doorRects()` UAT handle, which reports the same `onScreen` flag the
// director itself uses to decide whether a door needs re-framing) at the
// narrow portrait floor, the case most likely to clip a door. Reaches a
// real multi-door offer the same way a player would: jump into Act I's
// first room, complete it, and let `offeredDoors` present the rest of the
// pool. Limited to one viewport and to as few clicks as the flow actually
// needs (stops advancing the instant choices/doors appear) — this
// sandbox's headless Chromium has multi-second click latency (see
// _helpers.mjs's `advance`), so a fixed, generous click budget would
// exceed the 90s hard timeout.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const viewport = { name: '800x1280', width: 800, height: 1280 };

/** Clicks the text panel until `isDone` returns true or `maxClicks` is hit. */
async function advanceUntil(page, isDone, maxClicks) {
  for (let i = 0; i < maxClicks; i++) {
    if (await isDone()) return true;
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(150);
  }
  return isDone();
}

await withPage(async (page) => {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await gotoUat(page);

  await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
  await page.waitForTimeout(1000);

  const hasChoices = () => page.locator('.choice-card').count().then((n) => n > 0);
  assert(await advanceUntil(page, hasChoices, 6), 'the-wallet should offer a choice within 6 beat-advances');

  await page.locator('.choice-card').first().click({ timeout: 12000 });

  const hasDoors = () => page.evaluate(() => window.__anamnesisUat.doorRects().length > 0);
  const hasFieldNote = () => page.locator('.fn-close').count().then((n) => n > 0);
  await advanceUntil(page, async () => (await hasDoors()) || (await hasFieldNote()), 6);
  if (await hasFieldNote()) {
    await page.locator('.fn-close').click();
    await page.waitForTimeout(900);
  }
  assert(await advanceUntil(page, hasDoors, 4), 'a door offer should appear after completing the-wallet');

  const rects = await page.evaluate(() => window.__anamnesisUat.doorRects());
  assert(rects.length > 0, `${viewport.name} should have at least one offered door`);
  for (const door of rects) {
    assert(door.onScreen, `${viewport.name} door "${door.id}" should be fully on-screen: ${JSON.stringify(door.rect)}`);
  }
  console.log(`${viewport.name}: ${rects.length} door(s), all onScreen`);

  console.log('UAT 08 (door visibility sweep, H2): PASS');
});
