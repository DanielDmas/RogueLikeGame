// UAT 13 — the Examined Path's reflection card fully replaces the outcome
// text panel. Sibling regression to UAT 12: `TextPanel` and
// `ReflectionPanel` share the same `.stage-bottom` container hazard.
// `Game` calling `reflection.show(...)` right after the outcome beats'
// `text.playBeats(...)` resolves, without an intervening `text.hide()`,
// left the stale outcome text mounted while the reflection card was
// prepended *above* it (both call `prepend()`) — so the commentary
// literally rendered above the outcome it was commenting on.
// `src/test/panelLifecycle.test.ts` guards the source-level invariant
// (fast, no browser); this script is the genuine rendered check.
import { withPage, gotoUat, jump, advance, continueJourney, clickChoiceMatching, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await jump(page, 'junction');
  await page.waitForTimeout(500);
  // The Examined Path is normally an opt-in choice at run start; patching
  // the persisted run directly is equivalent and much faster (same
  // approach as 03-examined-path.mjs).
  await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    const parsed = JSON.parse(raw);
    if (parsed.run) parsed.run.examined = true;
    localStorage.setItem(key, JSON.stringify(parsed));
  }, 'anamnesis:profile:traveler');
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  // The plain reload above (unlike jump()'s own reload) lands back on the
  // title screen, not directly in the room — "Continue the journey" is
  // needed to resume the run (same as 03-examined-path.mjs).
  await continueJourney(page);
  await page.waitForTimeout(500);
  await advance(page, 12, 200);

  const clicked = await clickChoiceMatching(page, /don.t touch it/i);
  assert(clicked != null, 'should be able to click the "no-pull" choice at the Junction');
  await page.waitForTimeout(300);
  await advance(page, 4, 250);
  await page.waitForSelector('.reflection-card', { timeout: 10000 });

  const children = await page.evaluate(() => {
    const stageBottom = document.querySelector('.stage-bottom');
    if (!stageBottom) return [];
    return Array.from(stageBottom.children).map((c) => {
      const r = c.getBoundingClientRect();
      return { class: c.className, top: r.top, bottom: r.bottom };
    });
  });

  const staleOutcomePanel = children.find((c) => c.class.includes('text-panel'));
  assert(!staleOutcomePanel, `a stale outcome .text-panel should not remain once the reflection card is shown, found: ${JSON.stringify(staleOutcomePanel)}`);
  const reflectionCard = children.find((c) => c.class.includes('reflection-card'));
  assert(reflectionCard, `.reflection-card should be the panel shown, got children: ${JSON.stringify(children.map((c) => c.class))}`);

  console.log('UAT 13 (reflection panel replaces outcome text): PASS');
});
