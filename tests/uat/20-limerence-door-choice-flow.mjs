// UAT 20 — LIMERENCE real door-to-outcome flow, driven by actual clicks
// (not jump()). Mirrors script 19's exact onboarding path (Begin -> auto-
// About -> persona skip -> Examined Path offer -> the prologue's own
// door) under `?pack=limerence`, then clicks into the first real room and
// its first choice — confirms the "clicking user" path works end to end
// in LIMERENCE too, not just ANAMNESIS.
import { withPage, gotoUat, advance, assert } from './_helpers.mjs';

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

  await page.getByText('Walk plainly', { exact: false }).click();
  await page.locator('.choice-card').first().waitFor({ state: 'visible', timeout: 8000 });

  const firstRoomCard = page.locator('.choice-card').first();
  const firstChoiceText = await firstRoomCard.textContent();
  await firstRoomCard.click();
  await page.waitForFunction(() => window.__anamnesisUat.state().currentRoom != null, { timeout: 8000 });
  const afterProlgoue = await page.evaluate(() => window.__anamnesisUat.state());
  assert(afterProlgoue.currentRoom != null, 'a real room should be entered after the prologue door');

  let doorCards = 0;
  for (let i = 0; i < 12 && doorCards === 0; i++) {
    doorCards = await page.locator('.choice-card').count();
    if (doorCards === 0) await advance(page, 1, 300);
  }
  assert(doorCards > 0, `expected at least one choice card inside "${afterProlgoue.currentRoom}"`);

  const cardText = await page.locator('.choice-card').first().textContent();
  await page.locator('.choice-card').first().click();
  await page.waitForTimeout(600);
  await advance(page, 6, 300);

  const finalState = await page.evaluate(() => window.__anamnesisUat.state());

  console.log(
    `UAT 20 (LIMERENCE door-choice flow): PASS — prologue door "${(firstChoiceText || '').slice(0, 30)}" -> room "${afterProlgoue.currentRoom}" -> choice "${(cardText || '').slice(0, 30)}" -> now "${finalState.currentRoom}", zero errors: ${errors.length === 0}`,
  );
  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
});
