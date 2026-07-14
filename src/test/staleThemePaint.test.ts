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
