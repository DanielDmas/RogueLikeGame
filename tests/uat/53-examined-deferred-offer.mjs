// UAT 53 — the deferred Examined Path offer (game-experience review E6,
// 2026-07-20). On a genuinely first-ever run the offer no longer stacks
// before the prologue (see scripts 01/19/20's inverted assertions) — it
// fires at the first reflections-bearing choice instead. This scripts the
// firing itself: jump into a reflections-bearing Act I room, arm
// `examinedOfferPending` the same way a real first-ever run would (patching
// the persisted run directly, same determinism trick as
// 03-examined-path.mjs), make the choice, confirm the offer appears, accept
// it, and confirm that SAME choice's reflection card renders right after —
// the "pays off immediately" behavior the design specifically calls for.
import { withPage, gotoUat, jump, patchProfile, continueJourney, advance, clickChoiceMatching, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await jump(page, 'wallet');

  await patchProfile(page, (p) => {
    if (p.run) p.run.examinedOfferPending = true;
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  await continueJourney(page);
  await page.waitForTimeout(600);

  // The wallet room has 4 beats before its choice cards.
  await advance(page, 4);
  const clicked = await clickChoiceMatching(page, /mail it/i);
  assert(clicked, 'expected to find and click the "mail it" choice (carries reflections)');

  // Outcome beats play first; poll for the offer rather than fix-waiting.
  let sawOffer = false;
  for (let i = 0; i < 15; i++) {
    const text = await page.evaluate(() => document.body.innerText || '');
    if (/take the examined path/i.test(text)) {
      sawOffer = true;
      break;
    }
    await advance(page, 1, 250);
  }
  assert(sawOffer, 'expected the deferred Examined Path offer to appear after the outcome beats');

  const examinedBtn = page.getByText('Take the Examined Path', { exact: false });
  assert((await examinedBtn.count()) > 0, 'the "Take the Examined Path" button should be present');
  await examinedBtn.click();

  // Accepting must pay off immediately: THIS choice's own reflection card,
  // with all 4 traditions, right after — not on some later choice.
  await page.waitForSelector('.reflection-card', { timeout: 10000 });
  const rows = await page.locator('.reflection-row').count();
  assert(rows === 4, `reflection card should show all 4 traditions immediately, found ${rows}`);

  const state = await page.evaluate(() => window.__anamnesisUat.state());
  assert(state.currentRoom === 'wallet', 'still inside the wallet room when the reflection card renders');

  console.log('UAT 53 (deferred Examined Path offer fires + pays off immediately): PASS');
});
