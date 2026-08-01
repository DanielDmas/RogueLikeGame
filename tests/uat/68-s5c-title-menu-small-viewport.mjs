// UAT 68 — Phase 1.3(c) of the v2 overhaul plan (17-v2-overhaul-plan.md):
// verifies the title menu's growing button count (9 today, having grown
// twice already per overlays.ts's own comment on the Settings button) is
// actually reachable on a small viewport, not just visually cramped.
// Investigation found this is ALREADY handled — `.overlay` has
// `overflow-y: auto` (styles.css), so the whole title screen (word, tagline,
// how-to-play, menu) scrolls as one unit. No code change was needed; this
// script locks the finding in as a permanent regression check rather than
// leaving it as a one-off manual verification.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await page.setViewportSize({ width: 360, height: 560 });
  await gotoUat(page);

  const before = await page.evaluate(() => {
    const overlay = document.querySelector('.overlay');
    const buttons = [...document.querySelectorAll('.title-btn')];
    const last = buttons[buttons.length - 1]?.getBoundingClientRect();
    return {
      overflowY: overlay ? getComputedStyle(overlay).overflowY : null,
      scrollable: overlay ? overlay.scrollHeight > overlay.clientHeight : false,
      buttonCount: buttons.length,
      lastButtonBottom: last?.bottom,
      viewportHeight: window.innerHeight,
    };
  });

  assert(before.overflowY === 'auto', `expected .overlay to have overflow-y: auto, got "${before.overflowY}"`);
  assert(before.buttonCount >= 6, `expected the title menu to have grown past its original small count, got ${before.buttonCount}`);
  assert(before.scrollable, 'expected the overlay to actually need scrolling at a 360x560 viewport (if this now fails, the menu got shorter — fine, just means this check is no longer load-bearing)');
  assert(
    before.lastButtonBottom > before.viewportHeight,
    `expected the last button to start out below the fold at this viewport (bottom=${before.lastButtonBottom}, viewport=${before.viewportHeight}) — if it's not, the overflow scenario this test protects isn't actually being exercised`,
  );

  // Scroll the overlay itself (not the page — .overlay is the scrolling
  // element, not <body>) to the bottom and confirm the last button becomes
  // fully visible and clickable.
  await page.evaluate(() => {
    document.querySelector('.overlay').scrollTop = document.querySelector('.overlay').scrollHeight;
  });
  await page.waitForTimeout(150);

  const after = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('.title-btn')];
    const last = buttons[buttons.length - 1];
    const rect = last.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight, text: last.textContent };
  });
  assert(
    after.top >= 0 && after.bottom <= after.viewportHeight,
    `expected the last title-menu button to be fully within the viewport after scrolling the overlay, got top=${after.top} bottom=${after.bottom} viewport=${after.viewportHeight}`,
  );

  // And genuinely clickable, not just geometrically on-screen.
  const buttons = page.locator('.title-btn');
  const lastBtn = buttons.last();
  await lastBtn.click();
  await page.waitForTimeout(400);
  // Whatever it opens (Exit is Electron-gated so may be absent; whichever
  // last button exists — About/Settings/Exit — resolves to *some* overlay
  // transition), the click must not have silently no-op'd.
  const stillOnTitleMenu = await page.evaluate(() => document.querySelectorAll('.title-menu .title-btn').length > 0 && !document.querySelector('.about-panel, .settings-panel'));
  assert(!stillOnTitleMenu, 'expected clicking the scrolled-to last button to actually do something (open a panel or navigate away)');

  console.log('S5(c) OK: title menu overflow already handled by .overlay { overflow-y: auto }; verified scrollable and clickable at 360x560.');
});
