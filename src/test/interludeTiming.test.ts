import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Game-experience review (2026-07-19, `15-game-experience-review.md` §1 and
 * §6): the end-of-act interlude card was held only 260ms against its own
 * 300ms CSS fade-in — cleared before it ever finished appearing — and no
 * browser-driven test ever caught it, because `?uat=1` scales every
 * deliberate pacing wait (this one included) by 0.25x, making a real bug a
 * 65ms flash indistinguishable from a generous multi-second hold in any
 * screenshot. `syncTheme()` needs a real `AudioContext`-free DOM to run
 * live, so — same convention as this file's other pacing/source-shape
 * regression tests (see `audio.test.ts`'s LFO-leak check) — this asserts
 * against the source text directly: the hold constant itself, and that the
 * interlude is cleared only *after* the veil has fully faded back out
 * (not before), so the card actually rides the fade as designed instead of
 * vanishing on a still-opaque screen.
 */
const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');
const stylesSrc = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

/** The `.interlude` card's own opacity transition, read from the real CSS so
 * this test can't drift from it. The hold overlaps this fade-in, so
 * full-opacity time is `hold − fadeIn`. */
function interludeFadeInMs(): number {
  const startIdx = stylesSrc.indexOf('.interlude {');
  expect(startIdx, '.interlude rule not found in styles.css').toBeGreaterThan(-1);
  const rule = stylesSrc.slice(startIdx, stylesSrc.indexOf('}', startIdx));
  const match = rule.match(/transition:\s*opacity\s+(\d+)ms/);
  expect(match, '.interlude opacity transition duration not found').not.toBeNull();
  return Number(match![1]);
}

function interludeHoldMs(): number {
  const match = flowSrc.match(/const INTERLUDE_HOLD_MS\s*=\s*(\d+);/);
  expect(match, 'INTERLUDE_HOLD_MS constant not found in flow.ts').not.toBeNull();
  return Number(match![1]);
}

describe('the end-of-act interlude holds long enough to read, and fades with the veil', () => {
  it('holds the act headline at full opacity for at least 4 seconds (owner directive, 2026-07-21)', () => {
    // The card mounts (`setInterlude`) and immediately begins its CSS
    // fade-in while the hold is already counting down, so the time it
    // actually spends *fully legible* is the hold minus that fade-in.
    // The owner's floor is 4 seconds of shown headline; assert against the
    // stricter full-opacity reading of it, not the generous total-visible
    // one (which also gets the veil's ~720ms fade-out on top).
    const fullOpacityMs = interludeHoldMs() - interludeFadeInMs();
    expect(fullOpacityMs).toBeGreaterThanOrEqual(4000);
  });

  it('the hold still clears the .interlude CSS fade-in with a wide margin', () => {
    // Regression guard for the original 2026-07-19 bug: a hold shorter than
    // the fade-in cleared the card before it ever finished appearing.
    expect(interludeHoldMs()).toBeGreaterThan(interludeFadeInMs() * 3);
  });

  it('the headline is typeset at title scale, not label scale', () => {
    // The element is specced in its own source comment as "a large, centered
    // floor-name title card", but shipped at 15px — smaller than the 17.5px
    // `.beat` body text, so it read as a caption on an otherwise empty
    // screen. Now that it holds 4s+, assert it is genuinely larger than body
    // text at every viewport size (i.e. the clamp's *floor* clears it).
    const startIdx = stylesSrc.indexOf('.interlude {');
    const rule = stylesSrc.slice(startIdx, stylesSrc.indexOf('}', startIdx));
    const clamp = rule.match(/font-size:\s*clamp\(\s*([\d.]+)px\s*,[^,]+,\s*([\d.]+)px\s*\)/);
    expect(clamp, '.interlude should use a responsive clamp() font-size').not.toBeNull();
    const [minPx, maxPx] = [Number(clamp![1]), Number(clamp![2])];

    const beatIdx = stylesSrc.indexOf('.beat {');
    const beatPx = Number(stylesSrc.slice(beatIdx, stylesSrc.indexOf('}', beatIdx)).match(/font-size:\s*([\d.]+)px/)![1]);

    expect(minPx).toBeGreaterThan(beatPx);
    expect(maxPx).toBeGreaterThan(minPx);
  });

  it('clearInterlude() is called after fade(false) resolves in syncTheme, not before', () => {
    const startIdx = flowSrc.indexOf('private async syncTheme(resuming = false)');
    expect(startIdx, 'syncTheme() not found').toBeGreaterThan(-1);
    const endIdx = flowSrc.indexOf('\n  private async runLoop', startIdx);
    const body = flowSrc.slice(startIdx, endIdx);

    const holdWaitIdx = body.indexOf('INTERLUDE_HOLD_MS');
    const fadeOutIdx = body.indexOf('await this.fade(false)');
    const clearIdx = body.indexOf('this.clearInterlude()');

    expect(holdWaitIdx, 'the INTERLUDE_HOLD_MS wait was not found in syncTheme').toBeGreaterThan(-1);
    expect(fadeOutIdx, 'the fade(false) call was not found in syncTheme').toBeGreaterThan(-1);
    expect(clearIdx, 'the clearInterlude() call was not found in syncTheme').toBeGreaterThan(-1);

    // Ordering must be: hold the card while opaque -> fade the veil back out
    // (the card, still `.show`n, fades with it) -> only then clear it.
    expect(holdWaitIdx).toBeLessThan(fadeOutIdx);
    expect(fadeOutIdx).toBeLessThan(clearIdx);
  });
});
