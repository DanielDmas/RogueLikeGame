// UAT 59 — cross-run guide recognition ("pattern-barks", master plan Tier 1
// item 4). Proves the feature end to end in a real browser: a profile with a
// *shape* to it (more than one finished run, never a heart spent) makes the
// guide say so at the returning player's first real door row, instead of its
// generic "you have returned" line — and says it in the player's own language.
//
// Why the profile is seeded this precisely: the fixture below is tuned so that
// exactly ONE pattern is active (`never-spent-a-heart`). `patternForRun`
// rotates when several apply, so a looser fixture would make the asserted line
// depend on `runsCompleted` and turn this into a flaky test. Specifically:
// runsCompleted 2 clears the 2-run floor but stays under the 3-run floor
// `same-ending-again` needs; understoryDescents 1 rules out `never-descended`;
// empty keepsakes/roomVisits rule out the remaining three.
//
// The bark fires at the first door row where `visited.length <= 1`, i.e. the
// Act I row immediately after the prologue — so this jumps to the prologue and
// plays forward rather than clicking through the title screen.
import { withPage, gotoUat, patchProfile, jump, assert } from './_helpers.mjs';

/** Advances (Space for beats, "1" for in-room choices) until a door row is on
 * screen. Keyboard-driven with short fixed waits per CLAUDE.md, and bounded so
 * a content change can never hang the script. */
async function advanceToDoorRow(page, label) {
  for (let i = 0; i < 40; i++) {
    const atDoors = await page.evaluate(() => (window.__anamnesisUat?.doorRects() ?? []).length > 0);
    if (atDoors) return true;
    const hasChoices = await page.evaluate(
      () => Array.from(document.querySelectorAll('.choice-card')).some((c) => c.offsetParent !== null),
    );
    await page.keyboard.press(hasChoices ? 'Digit1' : 'Space');
    await page.waitForTimeout(220);
  }
  throw new Error(`UAT 59: never reached a door row for ${label}`);
}

async function barkText(page) {
  return page.evaluate(() => document.querySelector('.beat.usher')?.textContent?.trim() ?? '');
}

/** `patchProfile` reloads but does not wait for the app to boot again, so the
 * UAT handle is briefly absent afterwards — every reload here is followed by
 * this, exactly as `gotoUat` does on the first load. */
async function waitForHandle(page) {
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
}

/** The one pattern this fixture activates, and nothing else. */
const SEED = (p) => {
  p.runsCompleted = 2;
  p.heartsLost = 0;
  p.understoryDescents = 1;
  p.endingsSeen = ['dissolved'];
  p.roomVisits = {};
  p.keepsakes = [];
  p.keepsakeChoicesTaken = [];
  p.hasSeenAbout = true;
  p.run = null;
};

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  // ---- 1. English: the recognition line replaces the generic returning line.
  await gotoUat(page);
  const prologue = await page.evaluate(() => window.__anamnesisUat.state().currentRoom);
  await patchProfile(page, SEED);
  await waitForHandle(page);
  await jump(page, 'waiting-room');
  await advanceToDoorRow(page, 'ANAMNESIS/en');

  const en = await barkText(page);
  assert(en.length > 0, 'expected a guide bark at the door row');
  assert(
    /never once left a heart behind/i.test(en),
    `expected the never-spent-a-heart recognition line, got: "${en}"`,
  );
  assert(
    !/You have returned\./i.test(en),
    `recognition should replace the generic second-run line, got: "${en}"`,
  );

  // ---- 2. A profile with no shape still gets the generic line (the control:
  // proves the assertion above is caused by the seeded pattern, not by the
  // pattern branch having simply replaced that line unconditionally).
  await patchProfile(page, (p) => {
    p.runsCompleted = 2;
    p.heartsLost = 4; // a heart has been spent — the observation is untrue now
    p.understoryDescents = 1;
    p.endingsSeen = ['dissolved', 'anamnesis'];
    p.roomVisits = {};
    p.keepsakes = [];
    p.keepsakeChoicesTaken = [];
    p.hasSeenAbout = true;
    p.run = null;
  });
  await waitForHandle(page);
  await jump(page, 'waiting-room');
  await advanceToDoorRow(page, 'ANAMNESIS/en control');
  const control = await barkText(page);
  assert(
    /You have returned\./i.test(control),
    `a patternless returning player should get the generic line, got: "${control}"`,
  );

  // ---- 3. Czech: the same recognition, genuinely translated (not an English
  // fallback), and spoken by this pack's own guide-word.
  await patchProfile(page, SEED, { reload: false });
  await page.evaluate(() => {
    const key = 'anamnesis:profile:traveler';
    const p = JSON.parse(localStorage.getItem(key));
    p.settings.language = 'cs';
    localStorage.setItem(key, JSON.stringify(p));
  });
  await page.reload();
  await page.waitForTimeout(500);
  await waitForHandle(page);
  await jump(page, 'waiting-room');
  await advanceToDoorRow(page, 'ANAMNESIS/cs');
  const cs = await barkText(page);
  assert(cs.startsWith('Uvaděč:'), `expected the Czech Usher guide-word, got: "${cs}"`);
  assert(
    /nezůstalo srdce/.test(cs),
    `expected the Czech never-spent-a-heart line, got: "${cs}"`,
  );
  assert(!/Vrátný/.test(cs), `ANAMNESIS must not leak LIMERENCE's guide-word, got: "${cs}"`);

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log(
    `UAT 59 (guide pattern-barks): PASS — prologue="${prologue}"; ` +
      `en recognition + patternless control + cs translation all rendered live, zero errors.`,
  );
});
