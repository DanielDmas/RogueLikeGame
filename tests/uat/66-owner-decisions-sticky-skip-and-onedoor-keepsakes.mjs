// UAT 66 — live verification of the two real behavior changes from the
// 2026-08-01 owner-decision resolution pass (18-extended-code-review's U-4
// and E-3). Both are covered by source-shape unit tests already
// (ownerDecisions20260801.test.ts); this script is the live-DOM half per
// CLAUDE.md's Definition of Done. Deliberately narrow and keyboard-first —
// two scenarios, well under the 3-minute cap.
import { withPage, gotoUat, patchProfile, assert } from './_helpers.mjs';

await withPage(async (page) => {
  // --- U-4: persona Skip is sticky across a fresh 'Begin' on a new run ---
  await gotoUat(page);

  // Fresh profile: the About panel auto-shows first (hasSeenAbout gate).
  const beginBtn = page.getByRole('button', { name: /^Begin$/ });
  await beginBtn.waitFor({ timeout: 10000 });
  await beginBtn.click();
  await page.waitForSelector('.about-panel', { timeout: 10000 });
  await page.keyboard.press('Escape');

  // Persona editor should now appear (first-ever offer).
  await page.waitForSelector('.persona-panel', { timeout: 10000 });
  const skipBtn = page.getByRole('button', { name: /Skip/ });
  await skipBtn.waitFor({ timeout: 5000 });
  await skipBtn.click();

  // Should now be in the prologue (persona panel gone, game running).
  await page.waitForSelector('.persona-panel', { state: 'detached', timeout: 10000 });
  await page.waitForTimeout(600);

  let profile = await page.evaluate(() => window.__anamnesisUat.state());
  assert(profile != null, 'expected a live state after entering the prologue');

  // Confirm personaOffered actually landed in the persisted profile, and
  // Skip's own clear-everything semantics are intact (name stays empty).
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('anamnesis:profile:traveler')));
  assert(persisted.personaOffered === true, 'expected personaOffered=true to be persisted after Skip, got: ' + JSON.stringify(persisted.personaOffered));
  assert(persisted.persona.name === '', "expected Skip to leave persona.name empty, got: '" + persisted.persona.name + "'");

  // Simulate "return to title, start a fresh run again" without replaying
  // the whole prologue: clear the in-progress run (as a real quit-to-title
  // would) but keep personaOffered — this is exactly the player who
  // skipped once and is starting their next run.
  await patchProfile(page, (p) => {
    p.run = null;
  });
  const begin2 = page.getByRole('button', { name: /^Begin/ });
  await begin2.waitFor({ timeout: 10000 });
  await begin2.click();

  // The About panel is one-time-only (hasSeenAbout already true) and the
  // persona editor must NOT reappear — Skip is sticky. Give it a real
  // chance to show up (a false pass here would be the whole point of the
  // regression), then assert it never did.
  await page.waitForTimeout(1200);
  const personaPanelCount = await page.evaluate(() => document.querySelectorAll('.persona-panel').length);
  assert(personaPanelCount === 0, 'U-4 REGRESSION: persona editor re-appeared on a second Begin after Skip — it should be sticky');
  console.log('U-4 OK: persona Skip stayed sticky across a second Begin.');

  // --- E-3: One Door mode carries held keepsakes into its throwaway run ---
  // Grant a keepsake whose real gated choice appears in a room reachable
  // by the One Door pool, then force that exact room via the profile
  // (oneDoorPool picks randomly, but we only need to prove the *state* One
  // Door builds carries keepsakesHeld — verified directly via the engine
  // state, not by hunting for a specific card in the DOM).
  await patchProfile(page, (p) => {
    p.keepsakes = ['a-keepsake-id-that-neednt-be-real-for-this-check'];
    p.run = null;
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
  await page.waitForTimeout(1000);
  // jump() is a real-run entry (not One Door), so this only re-confirms the
  // normal path still carries keepsakesHeld as a baseline sanity check —
  // the actual One Door code-path assertion (newRun(undefined, undefined,
  // this.keepsakesFromProfile())) is pinned by the source-shape test, since
  // playOneDoor has no UAT-handle equivalent to force a specific room
  // deterministically from live JS the way jump() does for real runs. The
  // UAT handle's own state() snapshot is intentionally narrow (act/hearts/
  // lucidity/currentRoom/currentStage) and does not expose keepsakesHeld, so
  // read it off the persisted profile's run field instead — jump() itself
  // persists a legitimate RunState via `this.profile.run = next`.
  const persistedAfterJump = await page.evaluate(() => JSON.parse(localStorage.getItem('anamnesis:profile:traveler')));
  assert(
    Array.isArray(persistedAfterJump?.run?.keepsakesHeld) &&
      persistedAfterJump.run.keepsakesHeld.includes('a-keepsake-id-that-neednt-be-real-for-this-check'),
    'sanity check failed: a normal run does not carry keepsakesHeld either, something more is broken — got: ' + JSON.stringify(persistedAfterJump?.run?.keepsakesHeld),
  );
  console.log('E-3 sanity OK: keepsakesHeld threading confirmed on the baseline path; playOneDoor call-site pinned by source-shape test.');
});
