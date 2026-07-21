import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Game-experience review R1 (2026-07-20, `16-full-review-2026-07-20.md`
 * §3, and originally flagged as a gap in `15-game-experience-review.md`
 * §6): a toast's `holdMs` is reading time, not motion — halving it under
 * reduced motion was backwards, worst on the E3 profile-reset notice
 * (4200ms shown for 2100ms). `ui/toast.ts` needs a real DOM/timer
 * environment to drive live — same convention as this repo's other
 * pacing/source-shape regression tests (`interludeTiming.test.ts`,
 * `usherMotion.test.ts`) — so this asserts both the fix's shape directly
 * against the source, and each named toast's own minimum hold duration.
 */

const src = readFileSync(new URL('../ui/toast.ts', import.meta.url), 'utf8');

describe('toast holds are never shortened under reduced motion', () => {
  it('the internal showToast() hold is holdMs * speedMultiplier only — no reducedMotion multiplier', () => {
    const startIdx = src.indexOf('function showToast(');
    expect(startIdx, 'showToast() not found').toBeGreaterThan(-1);
    const endIdx = src.indexOf('\n}', startIdx);
    const body = src.slice(startIdx, endIdx);
    expect(body).toContain('const hold = holdMs * speedMultiplier;');
    expect(body).not.toMatch(/const hold = \(reducedMotion \? holdMs/);
  });

  it('the show/fade delays are still genuinely motion-scoped and remain shortened under reduced motion', () => {
    const startIdx = src.indexOf('function showToast(');
    const endIdx = src.indexOf('\n}', startIdx);
    const body = src.slice(startIdx, endIdx);
    expect(body).toContain('const showDelay = (reducedMotion ? 0 : 20) * speedMultiplier;');
    expect(body).toContain('const fadeMs = (reducedMotion ? 120 : 420) * speedMultiplier;');
  });
});

describe('each named toast holds at least its intended minimum (§6\'s originally-proposed guard, never written until now)', () => {
  const minimums: [name: string, callSnippet: string, minMs: number][] = [
    ['showSavedToast', "showToast(ui, `✓ ${label}`, reducedMotion, speedMultiplier, 1700);", 1500],
    ['showRestoredFromBackupToast', "showToast(ui, text, reducedMotion, speedMultiplier, 3200);", 3200],
    ['showProfileResetToast', "showToast(ui, text, reducedMotion, speedMultiplier, 4200);", 4200],
    ['showKeepsakeSpentToast', "showToast(ui, text, reducedMotion, speedMultiplier, 2200);", 2200],
    ['showSaveFailedToast', "showToast(ui, text, reducedMotion, speedMultiplier, 3200);", 3200],
  ];

  for (const [name, , minMs] of minimums) {
    it(`${name} holds >= ${minMs}ms`, () => {
      const fnIdx = src.indexOf(`export function ${name}(`);
      expect(fnIdx, `${name} not found`).toBeGreaterThan(-1);
      const endIdx = src.indexOf('\n}', fnIdx);
      const body = src.slice(fnIdx, endIdx);
      const match = body.match(/showToast\([^,]+,[^,]+,[^,]+,[^,]+,\s*(\d+)\)/);
      expect(match, `${name} does not call showToast with a numeric holdMs`).not.toBeNull();
      expect(Number(match![1])).toBeGreaterThanOrEqual(minMs);
    });
  }

  it('the toasts are ordered by consequence, each holding at least as long as a less consequential one before it', () => {
    // saved (routine) <= keepsake-spent (nice-to-know) <= restored/save-failed (real trouble) <= profile-reset (progress lost)
    const holdOf = (name: string) => {
      const fnIdx = src.indexOf(`export function ${name}(`);
      const endIdx = src.indexOf('\n}', fnIdx);
      const body = src.slice(fnIdx, endIdx);
      return Number(body.match(/showToast\([^,]+,[^,]+,[^,]+,[^,]+,\s*(\d+)\)/)![1]);
    };
    expect(holdOf('showSavedToast')).toBeLessThanOrEqual(holdOf('showKeepsakeSpentToast'));
    expect(holdOf('showKeepsakeSpentToast')).toBeLessThanOrEqual(holdOf('showRestoredFromBackupToast'));
    expect(holdOf('showRestoredFromBackupToast')).toBeLessThanOrEqual(holdOf('showProfileResetToast'));
  });
});
