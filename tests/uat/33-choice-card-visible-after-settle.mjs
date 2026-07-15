// UAT 33 — regression guard for a real, live-reported bug: `.choice-card`
// starts its entrance animation at `opacity: 0`, and `.choice-card.settled`
// (added once that animation ends, to fix P3's stale-theme-paint issue)
// used to clear `animation: none` without restating the animation's final
// opacity/transform — so every settled card silently reverted to invisible
// a few hundred ms after rendering. Still fully clickable throughout (opacity
// doesn't affect hit-testing), which is exactly why every earlier
// click-driven UAT script in this suite kept passing while a real player
// saw a blank choice screen (reported live on LIMERENCE's the-front-desk).
// This script is the one that actually reads computed `opacity`, not just
// DOM presence or successful clicks, in both packs.
import { withPage, gotoUat, assert } from './_helpers.mjs';

async function checkSettledCardsVisible(page, packQuery, roomId, label) {
  await gotoUat(page, packQuery);
  await page.evaluate((id) => window.__anamnesisUat.jump(id), roomId);
  await page.waitForTimeout(1200);
  for (let i = 0; i < 10; i++) {
    const count = await page.locator('.choice-card').count();
    if (count > 0) break;
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
  }
  // Wait past the entrance animation (450ms + up to 350ms stagger) so every
  // card has had time to pick up the "settled" class.
  await page.waitForTimeout(1200);

  const cardCount = await page.locator('.choice-card').count();
  assert(cardCount > 0, `${label}: expected at least one choice/door card to be offered at ${roomId}`);

  const opacities = await page.$$eval('.choice-card', (cards) =>
    cards.map((c) => ({ settled: c.classList.contains('settled'), opacity: getComputedStyle(c).opacity })),
  );
  for (const { settled, opacity } of opacities) {
    assert(settled, `${label}: card should have settled (entrance animation finished) by now`);
    assert(Number(opacity) > 0.5, `${label}: settled card should be visible (opacity > 0.5), got ${opacity}`);
  }
  console.log(`  ${label}: ${cardCount} settled card(s), all visible (opacity ${opacities.map((o) => o.opacity).join(', ')})`);
}

// One room per act (0-4) plus the Understory, both packs — the same
// per-act sample already used and validated by scripts 17/18, reused here
// so this script needs no fresh room-id discovery. Since the underlying
// fix is a single shared CSS rule (`.choice-card.settled`) rather than
// per-room code, this breadth exists to give real, empirical confidence
// (not just the structural guarantee `animationSettleLint.test.ts`
// already locks in) without the cost of sweeping every room in the game.
const ANAMNESIS_ROOMS = ['waiting-room', 'wallet', 'editor', 'boulder', 'the-archive'];
const LIMERENCE_ROOMS = ['the-front-desk', 'the-read-receipt', 'the-distance', 'the-colleague', 'the-kitchen-table'];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  for (const roomId of ANAMNESIS_ROOMS) {
    await checkSettledCardsVisible(page, 'uat=1', roomId, `ANAMNESIS/${roomId}`);
  }
  for (const roomId of LIMERENCE_ROOMS) {
    await checkSettledCardsVisible(page, 'pack=limerence&uat=1', roomId, `LIMERENCE/${roomId}`);
  }

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log(`UAT 33 (choice-card visible after settle, ${ANAMNESIS_ROOMS.length + LIMERENCE_ROOMS.length} rooms across both packs): PASS`);
});
