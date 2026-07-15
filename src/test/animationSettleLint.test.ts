import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * General regression guard for the whole bug *class* behind the live
 * choice-card-invisible incident (2026-07-15): any element that starts an
 * entrance animation from `opacity: 0` with a `forwards`-fill animation,
 * and is later "settled" by a more-specific rule that sets `animation:
 * none`, must have that settled rule restate `opacity: 1` — otherwise the
 * cascade falls back to the base rule's pre-animation `opacity: 0` the
 * moment the animation is cleared, and the element goes invisible while
 * remaining fully interactive (opacity doesn't affect hit-testing, so no
 * click-driven test ever notices).
 *
 * Unlike `staleThemePaint.test.ts` (which pins the one known instance,
 * `.choice-card.settled`), this scans the whole stylesheet mechanically so
 * the same mistake on any *other* element — present or future — fails a
 * fast, token-free test instead of shipping invisible, silently.
 */

// Comments stripped first: a selector immediately preceded by a `/* ... */`
// block (common in this file) would otherwise have the comment text glued
// onto its "selector" slice, silently breaking every startsWith() match
// below (caught live while authoring this lint — the P3 comment right
// above `.choice-card.settled` did exactly this).
const css = readFileSync(resolve(__dirname, '../styles.css'), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');

// Every top-level rule as { selector, body }. Doesn't attempt to parse
// nested @media/@keyframes bodies as rules of their own (fine: neither
// pattern we're hunting for lives inside one).
function topLevelRules(source: string): Array<{ selector: string; body: string }> {
  const rules: Array<{ selector: string; body: string }> = [];
  let depth = 0;
  let selectorStart = 0;
  let inAtBlock = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') {
      if (depth === 0) {
        const selector = source.slice(selectorStart, i).trim();
        if (selector.startsWith('@keyframes') || selector.startsWith('@media') || selector.startsWith('@font-face')) {
          inAtBlock = true;
        } else if (!inAtBlock && selector && !selector.startsWith('@')) {
          const closeIdx = findMatchingBrace(source, i);
          rules.push({ selector, body: source.slice(i + 1, closeIdx) });
        }
      }
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        inAtBlock = false;
        selectorStart = i + 1;
      }
    }
  }
  return rules;
}

function findMatchingBrace(source: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return source.length;
}

describe('animation-settle lint — every forwards-fill entrance animation stays visible once "settled"', () => {
  const rules = topLevelRules(css);

  // An "entrance" rule: starts hidden (opacity: 0) and drives itself
  // visible via a forwards-fill animation.
  const entranceRules = rules.filter(
    (r) => /opacity:\s*0\b/.test(r.body) && /animation:\s*\S+.*\bforwards\b/.test(r.body),
  );

  it('sanity: at least one known entrance rule is detected (fixture check, not a game assertion)', () => {
    // Guards the lint itself against silently matching nothing after a
    // future styles.css rewrite (a lint that can't fail is worse than none).
    expect(entranceRules.some((r) => r.selector === '.choice-card')).toBe(true);
  });

  for (const entrance of entranceRules) {
    // The simple selector this rule targets, e.g. ".choice-card" out of
    // ".choice-card" or ".foo, .choice-card" — only single, simple class
    // selectors are handled; anything more exotic is skipped rather than
    // guessed at.
    if (!/^\.[a-zA-Z0-9_-]+$/.test(entrance.selector)) continue;

    const settledRules = rules.filter(
      (r) => r.selector.startsWith(entrance.selector + '.') && /animation:\s*none\b/.test(r.body),
    );

    for (const settled of settledRules) {
      it(`"${settled.selector}" restates opacity after clearing the animation from "${entrance.selector}"`, () => {
        expect(
          /opacity:\s*1\b/.test(settled.body),
          `"${settled.selector}" sets "animation: none" (freezing "${entrance.selector}"'s forwards-fill animation) ` +
            `without restating "opacity: 1" — it will fall back to "${entrance.selector}"'s own opacity: 0 base state ` +
            `and go invisible while remaining clickable. Rule body: ${settled.body.trim()}`,
        ).toBe(true);
      });
    }
  }
});
