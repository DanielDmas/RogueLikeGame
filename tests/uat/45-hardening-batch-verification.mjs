// UAT 45 — live verification of the small hardening batch (Fable review
// items M1/M3/M5): documentElement.lang actually gets set per locale,
// aria-live is genuinely absent during typewriter typing and restored once
// finished (with the correct final text), and a corrupted/cross-pack "run"
// no longer crashes Continue — it falls through to a fresh run instead.
// Budget: well under 3 minutes.
import { withPage, gotoUat, jump, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await gotoUat(page);

  // --- M5a: documentElement.lang ---
  const langEn = await page.evaluate(() => document.documentElement.lang);
  assert(langEn === 'en', `documentElement.lang should start as "en", got "${langEn}"`);

  // Switch language via the HUD's own language button — requires being
  // in-game, so jump straight into a room first.
  await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
  await page.waitForTimeout(1200);
  const langBtn = page.locator('.lang-btn');
  await langBtn.waitFor({ state: 'visible', timeout: 8000 });
  await langBtn.click(); // en -> cs
  await page.waitForTimeout(300);
  const langCs = await page.evaluate(() => document.documentElement.lang);
  assert(langCs === 'cs', `documentElement.lang should follow the HUD language switch to "cs", got "${langCs}"`);
  await langBtn.click(); // cs -> fa
  await page.waitForTimeout(300);
  const langFa = await page.evaluate(() => document.documentElement.lang);
  assert(langFa === 'fa', `documentElement.lang should follow the HUD language switch to "fa", got "${langFa}"`);
  const dirFa = await page.evaluate(() => document.documentElement.dir);
  assert(dirFa === 'rtl', 'Farsi must still flip dir to rtl (unchanged behavior, sanity check)');

  // Back to English for the rest of this script.
  await langBtn.click(); // fa -> de
  await langBtn.click(); // de -> fr
  await langBtn.click(); // fr -> en
  await page.waitForTimeout(300);

  // --- M5b: aria-live suppressed during typing, restored on completion ---
  // Under ?uat=1 the typewriter is forced off (instant text) per uatMode.ts,
  // so the mid-typing-suppressed state isn't observable here — that half is
  // covered by the source-level test (accessibilityFixes.test.ts), which
  // pins the actual code shape (remove before the loop, restore after).
  // What's checkable live is the always-true postcondition: after a beat
  // has rendered, aria-live is present with the real, non-empty final text.
  await jump(page, 'wallet');
  await page.locator('.beat').waitFor({ state: 'visible', timeout: 8000 });
  const settled = await page.evaluate(() => {
    const el = document.querySelector('.beat');
    return { ariaLive: el?.getAttribute('aria-live'), text: el?.textContent };
  });
  assert(settled.ariaLive === 'polite', `settled beat should have aria-live="polite" restored, got "${settled.ariaLive}"`);
  assert((settled.text?.length ?? 0) > 0, 'settled beat should have real text, not be left empty');

  // --- M1: a corrupted/cross-pack run no longer crashes Continue ---
  await page.evaluate(() => {
    const key = 'anamnesis:profile:traveler';
    const raw = localStorage.getItem(key);
    const profile = raw ? JSON.parse(raw) : {};
    profile.run = {
      act: 1,
      hearts: 3,
      lucidity: 50,
      axes: {},
      flags: [],
      visited: [],
      transcript: [],
      currentRoom: 'a-room-that-does-not-exist-in-this-pack',
      currentStage: 0,
      finished: false,
      endingId: null,
      keepsakesHeld: [],
      descended: false,
    };
    localStorage.setItem(key, JSON.stringify(profile));
  });
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });

  const hasContinue = await page.getByText('CONTINUE THE JOURNEY', { exact: false }).count();
  assert(hasContinue > 0, 'title screen should still offer Continue for the corrupted run (the guard only fires on click, not on the title screen)');
  await page.getByText('CONTINUE THE JOURNEY', { exact: false }).click();
  await page.waitForTimeout(800);

  // Must NOT crash into the recovery overlay — it reuses .about-panel's own
  // class (see recovery.ts), so it's distinguished by its actual text, not
  // a dedicated class.
  const recoveryVisible = await page.getByText('The facility flickers', { exact: false }).count();
  assert(recoveryVisible === 0, 'a corrupted run must not crash into the recovery overlay');
  assert(errors.length === 0, `no uncaught page errors expected, got: ${errors.join(' | ')}`);

  // Must have landed in a genuinely playable state (a fresh run — some
  // onboarding step or the actual prologue door/beat, not a blank screen).
  const hasPlayableSurface = await page.locator('.choice-card, .about-panel, .persona-panel, .examined-path-offer').count();
  assert(hasPlayableSurface > 0, 'should land on a normal fresh-run surface (About/persona/Examined-Path offer/choice card), not a blank or crashed screen');

  const profileAfter = await page.evaluate(() => {
    const raw = localStorage.getItem('anamnesis:profile:traveler');
    return raw ? JSON.parse(raw) : null;
  });
  assert(
    profileAfter?.run == null || profileAfter.run.currentRoom !== 'a-room-that-does-not-exist-in-this-pack',
    'the corrupted run must have been discarded, not silently kept',
  );

  console.log('UAT 45 (hardening batch: lang, aria-live, resumable-run guard): PASS');
});
