// UAT 42 — mid-room resume recap (game-experience review E1, 2026-07-19).
// Quitting mid-room used to replay the whole act-intro paragraph on resume
// (already heard earlier the same run) and then drop the player straight
// into the saved stage with zero acknowledgement they were picking up a
// thread rather than freshly arriving. This scripts a real repro: jump
// into an Act I room, click through its beats to a real choice, click the
// choice (which persists currentStage past 0 while the room is still
// mid-flow), reload the page exactly like a real quit, then confirm on
// resume: (a) the Act I intro paragraph is NOT replayed, and (b) the new
// "resumed-mid-room" recap bark IS shown.
import { withPage, gotoUat, jump, advance, clickChoiceMatching, readProfile, continueJourney, assert } from './_helpers.mjs';

const ACT1_INTRO_SNIPPET = 'corridor of apartment doors';
const RESUME_BARK_SNIPPET = 'mid-thought';

await withPage(async (page) => {
  await gotoUat(page);
  await jump(page, 'wallet');

  const landed = await page.evaluate(() => window.__anamnesisUat.state());
  assert(landed.currentRoom === 'wallet', 'jump() should land directly on the wallet room');
  assert(landed.act === 1, 'the wallet room is an Act I room');

  // Click through the room's 4 beats to reach the choice cards.
  await advance(page, 4);
  const clicked = await clickChoiceMatching(page, /mail it/i);
  assert(clicked, 'expected to find and click the "mail it" choice card');
  // The choice's effects+persist land synchronously before the outcome
  // beats finish playing — reload right away to simulate a real quit
  // mid-outcome, the exact window E1 was about.
  await page.waitForTimeout(200);

  const beforeReload = await readProfile(page);
  assert(beforeReload?.run?.currentRoom === 'wallet', 'the persisted run should still be mid-room in wallet');
  assert((beforeReload?.run?.currentStage ?? 0) > 0, `expected currentStage > 0 after the choice, got ${beforeReload?.run?.currentStage}`);

  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  const hasContinue = await page.getByText('Continue the journey', { exact: false }).count();
  assert(hasContinue > 0, '"Continue the journey" should be offered after reload with a mid-room run');
  await continueJourney(page);

  // Poll (no clicks yet) through the interlude/syncTheme/recap-bark chain —
  // the recap bark requires a click to dismiss, same as any other beat, so
  // it must sit on screen until we click past it. If it never appears
  // before the field note does, that is the real bug this script guards.
  let sawResumeBark = false;
  let sawActIntro = false;
  let sawFieldNoteBeforeBark = false;
  for (let i = 0; i < 20; i++) {
    const text = await page.evaluate(() => document.body.innerText || '');
    if (text.includes(ACT1_INTRO_SNIPPET)) sawActIntro = true;
    if (text.includes(RESUME_BARK_SNIPPET)) {
      sawResumeBark = true;
      break;
    }
    if (text.includes('FIELD NOTE')) {
      sawFieldNoteBeforeBark = true;
      break;
    }
    await page.waitForTimeout(150);
  }

  assert(!sawFieldNoteBeforeBark, 'the room reached its field note without ever showing the resumed-mid-room recap bark');
  assert(sawResumeBark, `expected the resumed-mid-room bark ("${RESUME_BARK_SNIPPET}") to appear during resume`);
  assert(!sawActIntro, `the Act I intro paragraph ("${ACT1_INTRO_SNIPPET}") must not be replayed on a mid-room resume`);

  console.log('UAT 42 (mid-room resume recap): PASS');
});
