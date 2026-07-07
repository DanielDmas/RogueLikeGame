// UAT 12 — the in-room choice cards fully replace the beat text panel.
// Regression for a real bug found live: `TextPanel` and `ChoicePanel` are
// separate class instances that both mount into the same `.stage-bottom`
// flex column, each only tracking/removing its *own* element. `Game`
// (engine/flow.ts) calling `choices.pick(...)` right after a
// `text.playBeats(...)` resolves, without an intervening `text.hide()`,
// left the stale beat text (with its "continue" hint) mounted while the
// choice cards were prepended next to it — the exact "text/descriptions
// are not in the right positions" symptom a player would see.
// `src/test/panelLifecycle.test.ts` guards the source-level invariant
// (fast, no browser); this script is the genuine rendered check.
import { withPage, gotoUat, jump, advance, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await jump(page, 'wallet');
  await page.waitForTimeout(500);
  await advance(page, 10, 200);
  await page.waitForSelector('.choice-card', { timeout: 10000 });

  const children = await page.evaluate(() => {
    const stageBottom = document.querySelector('.stage-bottom');
    if (!stageBottom) return [];
    return Array.from(stageBottom.children).map((c) => {
      const r = c.getBoundingClientRect();
      return { class: c.className, top: r.top, bottom: r.bottom };
    });
  });

  const staleTextPanel = children.find((c) => c.class.includes('text-panel'));
  assert(!staleTextPanel, `a stale .text-panel should not remain once choice cards are shown, found: ${JSON.stringify(staleTextPanel)}`);
  const choicesWrap = children.find((c) => c.class === 'choices' || c.class.startsWith('choices '));
  assert(choicesWrap, `.choices should be the panel shown, got children: ${JSON.stringify(children.map((c) => c.class))}`);

  console.log('UAT 12 (choice panel replaces beat text): PASS');
});
