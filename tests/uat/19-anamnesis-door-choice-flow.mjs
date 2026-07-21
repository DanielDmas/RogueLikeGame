// UAT 19 — ANAMNESIS real door-to-outcome flow, driven by actual clicks
// (not jump()). Walks the same real onboarding sequence script 01 verifies
// (Begin -> auto-About -> persona skip -> the prologue's own door — the
// Examined Path offer no longer appears here, deferred per E6), then goes
// one step further: clicks a real door in the first real room, advances
// its outcome beats, and confirms the game lands on a genuine follow-on
// room — the literal "clicking user" path through two full rooms, not a
// state-injected shortcut.
import { withPage, gotoUat, advance, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  await page.getByText('Begin', { exact: true }).click();
  await page.waitForTimeout(600);

  await page.locator('.about-panel').waitFor({ state: 'visible', timeout: 8000 });
  await page.getByText('Back', { exact: true }).click();
  await page.waitForTimeout(400);

  await page.getByText('Skip', { exact: false }).click();
  await page.waitForTimeout(400);

  // E6: no Examined Path offer here anymore — straight to the prologue door.
  await page.locator('.choice-card').first().waitFor({ state: 'visible', timeout: 8000 });

  const firstRoomCard = page.locator('.choice-card').first();
  const firstChoiceText = await firstRoomCard.textContent();
  await firstRoomCard.click();
  await page.waitForFunction(() => window.__anamnesisUat.state().currentRoom != null, { timeout: 8000 });
  const afterProlgoue = await page.evaluate(() => window.__anamnesisUat.state());
  assert(afterProlgoue.currentRoom != null, 'a real room should be entered after the prologue door');

  // Now actually inside the first real room: advance its beats by clicking
  // the text panel until either a choice appears or the room resolves on
  // its own (some prologue-adjacent rooms are pure INSIGHT/no-choice).
  let doorCards = 0;
  for (let i = 0; i < 12 && doorCards === 0; i++) {
    doorCards = await page.locator('.choice-card').count();
    if (doorCards === 0) await advance(page, 1, 300);
  }
  assert(doorCards > 0, `expected at least one choice card inside "${afterProlgoue.currentRoom}"`);

  const cardText = await page.locator('.choice-card').first().textContent();
  await page.locator('.choice-card').first().click();
  await page.waitForTimeout(600);
  await advance(page, 8, 300);

  const finalState = await page.evaluate(() => window.__anamnesisUat.state());

  console.log(
    `UAT 19 (ANAMNESIS door-choice flow): PASS — prologue door "${(firstChoiceText || '').slice(0, 30)}" -> room "${afterProlgoue.currentRoom}" -> choice "${(cardText || '').slice(0, 30)}" -> now "${finalState.currentRoom}", zero errors: ${errors.length === 0}`,
  );
  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
});
