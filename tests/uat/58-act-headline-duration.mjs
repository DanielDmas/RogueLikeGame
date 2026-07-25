// UAT 58 — owner directive (2026-07-21): the act headline (the end-of-act
// floor-name interlude card) must be shown for at least 4 seconds.
//
// Measures the real on-screen lifetime of `.interlude.show` with a
// MutationObserver installed via addInitScript, i.e. armed *before* any app
// code runs — necessary because `jump()` reloads the page, which would
// destroy an observer installed after load.
//
// `?uat=1` scales every deliberate pacing wait by `speedMultiplierFor` (0.25),
// so the observed duration is compared against the scaled expectation and
// then divided back out to report the real player-facing number. The scale
// factor is itself a tested constant (`uatMode.test.ts`), so this is a real
// measurement of the mechanism, not an assumption about it.
import { withPage, gotoUat, patchProfile, assert } from './_helpers.mjs';

const UAT_SPEED = 0.25;
const REQUIRED_FULL_OPACITY_MS = 4000;
// Read from the source of truth rather than duplicated here: flow.ts's hold
// constant and styles.css's .interlude fade-in.
import { readFileSync } from 'node:fs';
const flowSrc = readFileSync(new URL('../../src/engine/flow.ts', import.meta.url), 'utf8');
const stylesSrc = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');
const HOLD_MS = Number(flowSrc.match(/const INTERLUDE_HOLD_MS\s*=\s*(\d+);/)[1]);
const FADE_IN_MS = Number(
  stylesSrc.slice(stylesSrc.indexOf('.interlude {')).match(/transition:\s*opacity\s+(\d+)ms/)[1],
);

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  // Armed before app code on every load, including jump()'s reload.
  await page.addInitScript(() => {
    window.__interludeLog = [];
    const observe = () => {
      const el = document.querySelector('.interlude');
      if (!el) return false;
      new MutationObserver(() => {
        window.__interludeLog.push({ shown: el.classList.contains('show'), t: performance.now() });
      }).observe(el, { attributes: true, attributeFilter: ['class'] });
      return true;
    };
    if (!observe()) {
      // .interlude is created by the app; poll briefly until it exists.
      const iv = setInterval(() => {
        if (observe()) clearInterval(iv);
      }, 10);
      setTimeout(() => clearInterval(iv), 8000);
    }
  });

  await gotoUat(page);
  // Put the profile mid-run on an Act II floor, then jump so the resume path
  // runs syncTheme() with a genuine theme change and shows the headline.
  await patchProfile(page, (p) => {
    if (p.run) p.run.act = 2;
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.evaluate(() => window.__anamnesisUat.jump('junction'));

  // Wait for a complete show -> hide cycle to be recorded.
  await page.waitForFunction(
    () => {
      const log = window.__interludeLog || [];
      return log.some((e) => e.shown) && log.some((e, i) => !e.shown && log.slice(0, i).some((p) => p.shown));
    },
    { timeout: 20000 },
  );

  const log = await page.evaluate(() => window.__interludeLog);
  const shownAt = log.find((e) => e.shown);
  const hiddenAt = log.find((e, i) => !e.shown && log.slice(0, i).some((p) => p.shown));
  assert(shownAt && hiddenAt, `expected a show->hide cycle in the interlude log, got ${JSON.stringify(log)}`);

  const observedMs = hiddenAt.t - shownAt.t;
  const observedRealMs = observedMs / UAT_SPEED;
  // `.show` is added before the hold and removed only after the veil's
  // fade-out resolves, so the observed window covers hold + veil fade-out.
  // The card is only *fully* opaque for `hold − its own fade-in`; the
  // fade-out tail is still readable but is deliberately not counted toward
  // the owner's floor, so the number asserted is the strict one.
  const strictFullOpacityMs = HOLD_MS - FADE_IN_MS;

  assert(
    observedRealMs >= HOLD_MS * 0.9,
    `observed .interlude.show window ${observedRealMs.toFixed(0)}ms (real speed) is shorter than the ${HOLD_MS}ms hold — the card is being cleared early`,
  );
  assert(
    strictFullOpacityMs >= REQUIRED_FULL_OPACITY_MS,
    `act headline is only fully opaque for ${strictFullOpacityMs}ms; the owner's floor is ${REQUIRED_FULL_OPACITY_MS}ms`,
  );
  assert(errors.length === 0, `no console errors expected, got: ${errors.join(' | ')}`);

  console.log(
    `UAT 58 (act headline duration): PASS — observed ${observedMs.toFixed(0)}ms at ${UAT_SPEED}x ` +
      `=> ~${observedRealMs.toFixed(0)}ms on screen at real speed ` +
      `(${HOLD_MS}ms hold + veil fade-out), of which ${strictFullOpacityMs}ms at full opacity ` +
      `(floor: ${REQUIRED_FULL_OPACITY_MS}ms)`,
  );
});
