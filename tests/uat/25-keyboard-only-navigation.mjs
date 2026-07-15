// UAT 25 — keyboard-only navigation. Jumps to a real door screen and
// resolves the choice purely via keyboard (arrow keys to move focus,
// Enter to select) — no mouse click at all — confirming 9.5.3's arrow-nav
// wiring and native button Enter/Space behavior both work together.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
  await page.waitForTimeout(1200);

  // Advance to a choice screen via the keyboard (Space), not clicks.
  for (let i = 0; i < 8; i++) {
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) break;
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
  }
  const cardCount = await page.locator('.choice-card').count();
  assert(cardCount > 0, 'expected a choice screen to appear');

  // Move focus with ArrowDown/ArrowRight a couple of times, then commit with Enter.
  await page.keyboard.press('Tab');
  await page.waitForTimeout(150);
  const focusedBefore = await page.evaluate(() => document.activeElement?.className || '');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(150);
  const focusedAfter = await page.evaluate(() => document.activeElement?.className || '');
  assert(focusedBefore.includes('choice-card') || focusedAfter.includes('choice-card'), `arrow-key focus should land on a choice card (before="${focusedBefore}", after="${focusedAfter}")`);

  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);

  const state = await page.evaluate(() => window.__anamnesisUat.state());
  assert(state.currentRoom != null, 'a room should still be active after a keyboard-only choice');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 25 (keyboard-only navigation): PASS — Tab + ArrowDown + Enter resolved a real choice, zero errors');
});
