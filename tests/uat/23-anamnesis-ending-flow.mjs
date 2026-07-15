// UAT 23 — ANAMNESIS ending flow. Jumps to a heart-costing room, patches
// the run to 1 heart, clicks the heart-costing choice, and confirms the
// end screen actually renders (epitaph, triptych, recap, stats) rather
// than crashing — the live-browser companion to 1.1's regression test
// (flow.ts's hearts<=0 -> pack.endingRules.evaluate fix), and a check that
// profile.runsCompleted/endingsSeen update afterward.
import { withPage, gotoUat, patchProfile, readProfile, continueJourney, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  await page.evaluate(() => window.__anamnesisUat.jump('photograph'));
  await page.waitForTimeout(1000);

  await patchProfile(page, (p) => {
    if (p.run) p.run.hearts = 1;
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  const runsBefore = (await readProfile(page))?.runsCompleted ?? 0;

  // patchProfile's reload lands back on the title screen; resume the run.
  await continueJourney(page);
  await page.waitForTimeout(600);

  // Advance to the choice screen, then take the heart-costing option.
  for (let i = 0; i < 8; i++) {
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) break;
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  const target = page.locator('.choice-card', { hasText: /The photograph/i });
  assert((await target.count()) > 0, 'expected the heart-costing "the photograph" choice to be offered');
  await target.first().click();
  await page.waitForTimeout(800);

  // hearts<=0 stops the outcome-beat loop, then: this room's own field
  // note -> the ending's beats (played through TextPanel like any room) ->
  // the ending's own field note -> finally the static epitaph screen.
  // Two different modal kinds appear along the way (.fn-close field notes,
  // .text-panel beats) in an order that varies by ending — poll for
  // whichever is present and dismiss/advance it, capped generously.
  for (let i = 0; i < 20; i++) {
    if ((await page.locator('.ending-epitaph').count()) > 0) break;
    if ((await page.locator('.fn-close').count()) > 0) {
      await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 3000 }).catch(() => {});
    }
    await page.waitForTimeout(500);
  }

  const endVisible = await page.locator('.ending-epitaph').count();
  assert(endVisible > 0, 'end screen (.ending-epitaph) should render once hearts reach 0');

  const statsText = await page.locator('.run-stats').innerText();
  assert(statsText.length > 5, 'end screen should show run stats');

  const after = await readProfile(page);
  assert((after?.runsCompleted ?? 0) === runsBefore + 1, `runsCompleted should increment (was ${runsBefore}, now ${after?.runsCompleted})`);
  assert((after?.endingsSeen?.length ?? 0) > 0, 'endingsSeen should record at least one ending');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log(`UAT 23 (ANAMNESIS ending flow): PASS — hearts-death ending rendered cleanly, runsCompleted ${runsBefore} -> ${after.runsCompleted}, zero errors`);
});
