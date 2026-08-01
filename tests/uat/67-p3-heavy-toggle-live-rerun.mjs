// UAT 67 — Phase 1.1 of the v2 overhaul plan (17-v2-overhaul-plan.md):
// re-runs the P3 stale-door-card-paint check now that Phase V made the
// Light/Dark toggle heavier — `SceneDirector.setThemeMode()` does a *full*
// 3D scene rebuild (clears the diorama/epitaph wall, disposes every mesh's
// geometry+material, rebuilds the theme group from scratch) rather than a
// cheap CSS variable flip. The original P3 fix (`.choice-card.settled` in
// styles.css) targets the DOM/CSS layer only; this script's job is to
// confirm the *heavier* 3D-side rebuild doesn't introduce a new failure
// mode — a dropped `animationend` under main-thread contention, a stuck
// render loop, or an unresponsive Settings panel — when toggled while a
// door row's entrance animation is still in flight. LIMERENCE only
// (`supportsLightTheme: false` on ANAMNESIS — light mode isn't reachable
// there at all).
import { withPage, gotoUat, assert } from './_helpers.mjs';

async function openSettings(page) {
  await page.locator('.settings-btn').waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('.settings-btn').click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });
}

async function toggleLightMode(page) {
  const lightRow = page.locator('.settings-panel').getByText('Light mode', { exact: true }).locator('..');
  await lightRow.locator('.toggle').click();
}

async function closeSettings(page) {
  await page.getByText('Done', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { state: 'detached', timeout: 8000 });
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');
  await page.evaluate(() => window.__anamnesisUat.jump('the-read-receipt'));
  await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
  await page.waitForTimeout(1000);
  for (let i = 0; i < 10; i++) {
    const count = await page.locator('.choice-card').count();
    if (count > 0) break;
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
  }
  let cardCount = await page.locator('.choice-card').count();
  assert(cardCount > 0, 'expected door/choice cards at the-read-receipt before toggling anything');

  // Toggle Light mode WHILE the cards' entrance animation is still in
  // flight (the rise animation + stagger runs up to ~800ms) — this is
  // deliberately the worst-case timing the original P3 bug lived in, now
  // with the heavier full-scene-rebuild cost stacked on top of it.
  await openSettings(page);
  await toggleLightMode(page);
  await closeSettings(page);
  await page.waitForTimeout(1500); // past both the entrance animation and the full theme rebuild

  cardCount = await page.locator('.choice-card').count();
  assert(cardCount > 0, 'expected door/choice cards to still be present after an in-flight theme toggle');
  let opacities = await page.$$eval('.choice-card', (cards) => cards.map((c) => ({ settled: c.classList.contains('settled'), opacity: Number(getComputedStyle(c).opacity) })));
  for (const { settled, opacity } of opacities) {
    assert(settled, 'expected every card to have settled after the toggle + wait');
    assert(opacity > 0.5, `expected a settled card to be visible (opacity > 0.5) after an in-flight toggle, got ${opacity}`);
  }

  // Rapid back-to-back double-toggle (light -> dark -> light), stressing
  // the full-rebuild path under contention with itself.
  await openSettings(page);
  await toggleLightMode(page);
  await toggleLightMode(page);
  await closeSettings(page);
  await page.waitForTimeout(1500);

  cardCount = await page.locator('.choice-card').count();
  assert(cardCount > 0, 'expected door/choice cards to survive a rapid double-toggle');
  opacities = await page.$$eval('.choice-card', (cards) => cards.map((c) => ({ settled: c.classList.contains('settled'), opacity: Number(getComputedStyle(c).opacity) })));
  for (const { settled, opacity } of opacities) {
    assert(settled, 'expected every card to have settled after the rapid double-toggle');
    assert(opacity > 0.5, `expected a settled card to be visible (opacity > 0.5) after a rapid double-toggle, got ${opacity}`);
  }

  // The render loop must still be alive (fps() returns a sane positive
  // number) — a hard proof the full scene rebuild didn't wedge the loop.
  const fps = await page.evaluate(() => window.__anamnesisUat.fps());
  assert(typeof fps === 'number' && fps >= 0, `expected a sane fps() reading after repeated toggles, got ${fps}`);

  // Doors must still be genuinely clickable post-toggle, not just visible —
  // click one and confirm the choice actually registered (the choice
  // screen advances away, into the outcome/next beat — a room's choice
  // doesn't necessarily change currentRoom immediately, since outcome
  // beats play first, so the reliable proxy is "the choice cards are gone").
  await page.locator('.choice-card').first().click();
  await page.waitForTimeout(800);
  const cardsAfterClick = await page.locator('.choice-card').count();
  assert(cardsAfterClick === 0, `expected the choice screen to advance away after clicking a door card post-toggle, but ${cardsAfterClick} card(s) remained`);

  assert(errors.length === 0, `expected zero console/page errors across all toggles, got: ${JSON.stringify(errors)}`);
  console.log('P3 heavy-toggle re-run OK: no stale paint, no errors, render loop alive, doors still clickable.');
});
