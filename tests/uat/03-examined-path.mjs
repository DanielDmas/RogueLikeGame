// UAT 03 — Examined Path (spec 05). Jumps into an Act II DILEMMA room,
// forces `examined: true` on the persisted run (the opt-in is normally
// chosen at run start; patching it here is equivalent and much faster),
// makes a choice, and confirms the reflection card renders with all four
// traditions.
import { withPage, gotoUat, continueJourney, advance, clickChoiceMatching, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await page.evaluate(() => window.__anamnesisUat.jump('junction'));
  await page.waitForTimeout(1200);

  await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    const parsed = JSON.parse(raw);
    if (parsed.run) parsed.run.examined = true;
    localStorage.setItem(key, JSON.stringify(parsed));
  }, 'anamnesis:profile:traveler');
  await page.reload();
  await page.waitForTimeout(800);
  await continueJourney(page);
  await page.waitForTimeout(800);

  // Advance through the act-transition beat and the room's own beats.
  await advance(page, 12, 300);

  const clicked = await clickChoiceMatching(page, /don.t touch it/i);
  assert(clicked != null, 'should be able to click the "no-pull" choice at the Junction');
  await page.waitForTimeout(600);

  // Outcome beats, then the reflection card.
  await advance(page, 4, 400);

  const annexHeader = await page.locator('text=/annex files/i').count();
  assert(annexHeader > 0, 'the reflection card ("The Annex Files") should render after the outcome beats');

  const rows = await page.locator('.reflection-row').count();
  assert(rows === 4, `reflection card should show all 4 traditions, found ${rows}`);

  console.log('UAT 03 (Examined Path reflection card): PASS');
});
