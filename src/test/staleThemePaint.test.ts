import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * P3 — regression coverage for the stale-door-card-paint bug: toggling
 * Light/Dark mode while door cards are still mounted (and possibly still
 * mid-entrance-animation) could leave `.choice-card`'s `background: var(
 * --panel)` un-repainted, because a `forwards`-fill `animation` combined
 * with `backdrop-filter` can pin the element to a stale composited layer.
 * Reproduced live via Playwright (toggling `body.theme-light` on a LIMERENCE
 * door row within the rise animation's 450ms window, confirmed the fix
 * repaints correctly in both directions) — this file locks the two source
 * facts that fix depends on, since vitest itself runs with no DOM
 * (`vite.config.ts`'s `environment: 'node'`).
 */

const css = readFileSync(resolve(__dirname, '../styles.css'), 'utf-8');
const choicesSrc = readFileSync(resolve(__dirname, '../ui/choices.ts'), 'utf-8');

describe('P3 — stale theme-toggle paint on door/choice cards', () => {
  it('styles.css defines a .choice-card.settled rule that clears the animation property', () => {
    const match = css.match(/\.choice-card\.settled\s*\{([^}]*)\}/);
    expect(match, '.choice-card.settled rule should exist').toBeTruthy();
    expect(match![1]).toMatch(/animation:\s*none/);
  });

  it('.choice-card.settled restates the entrance animation\'s final opacity/transform', () => {
    // `.choice-card`'s base rule starts the rise animation from `opacity: 0;
    // transform: translateY(10px)` (see the rule just above `.choice-card`
    // in styles.css); the `rise` keyframes' only declared frame is `to`, so
    // that base rule *is* the animation's 0% frame. Once `.settled` sets
    // `animation: none` without restating the animation's own final state,
    // the cascade falls straight back to that 0%-frame base rule instead of
    // holding the `forwards` fill — every settled choice/door card silently
    // reverts to invisible (opacity 0) a few hundred ms after it renders,
    // remaining clickable throughout since opacity doesn't affect hit-testing,
    // so no click-driven UAT script ever notices. A live player just sees a
    // blank choice screen. (Regression: reported live on LIMERENCE's
    // the-front-desk, 2026-07-15 — the front desk diorama's own visibility
    // was fixed in the same pass.)
    const match = css.match(/\.choice-card\.settled\s*\{([^}]*)\}/);
    expect(match![1]).toMatch(/opacity:\s*1/);
    expect(match![1]).toMatch(/transform:\s*translateY\(0\)/);
  });

  it('choices.ts adds the "settled" class once each card\'s entrance animation actually ends', () => {
    expect(choicesSrc).toMatch(/addEventListener\(\s*['"]animationend['"]/);
    expect(choicesSrc).toContain("card.classList.add('settled')");
  });

  it('the settled-class wiring uses { once: true } so it never re-fires or leaks a listener per re-mount', () => {
    const idx = choicesSrc.indexOf("classList.add('settled')");
    const nearby = choicesSrc.slice(Math.max(0, idx - 200), idx + 50);
    expect(nearby).toContain('{ once: true }');
  });
});
