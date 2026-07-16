import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * I9 — colorblind/readability audit (2026-07-14): a WCAG 2.1 AA contrast
 * check for every real reading-text color token against its own theme's
 * background, across all three palettes this game ships (ANAMNESIS's
 * single dark tone, LIMERENCE's dark default, LIMERENCE's light variant).
 * Catches the exact class of bug found this pass: --ink-faint and --danger
 * both measured well under 4.5:1 everywhere, and LIMERENCE light's --gold
 * measured only 3.14:1 while still being used, unmodified, for real body
 * text (every Porter-voiced line, door choice text, field-note emphasis).
 *
 * This isn't a colorblind-simulation check (deuteranopia/protanopia don't
 * change relative luminance, which is what contrast ratio measures) — it's
 * the general-readability half of "colorblind/readability audit", which
 * matters just as much for colorblind players: low contrast is low
 * contrast regardless of hue perception, and gold-on-cream is exactly the
 * kind of low-saturation-difference pairing that's hardest for red-green
 * colorblind readers even where the raw luminance contrast looks passable
 * to a non-colorblind reviewer.
 */

const css = readFileSync(resolve(__dirname, '../styles.css'), 'utf-8');

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [f(r), f(g), f(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** WCAG 2.1 contrast ratio (1 to 21) between two hex colors. */
export function contrastRatio(hex1: string, hex2: string): number {
  const L1 = relativeLuminance(hexToRgb(hex1));
  const L2 = relativeLuminance(hexToRgb(hex2));
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

const AA_NORMAL_TEXT = 4.5;

/** Pulls `--name: #hex;` out of a specific `{ ... }` rule block's raw CSS text. */
function extractVar(block: string, name: string): string {
  const match = block.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,6})`));
  if (!match) throw new Error(`--${name} not found in block`);
  return match[1];
}

function extractBlock(selector: string): string {
  // Escapes every regex metacharacter, not just `.`/`#` — needed once
  // attribute selectors like `[data-act="1"]` (graphics overhaul,
  // 2026-07-16) joined the plain class selectors this originally covered.
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Handles multi-selector blocks (":root {") by matching from the selector
  // to its first closing brace, non-greedy.
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`selector not found: ${selector}`);
  return match[1];
}

const rootBlock = extractBlock(':root');
const limerenceDarkBlock = extractBlock('body.pack-limerence');
const limerenceLightBlock = extractBlock('body.pack-limerence.theme-light');

const PALETTES = {
  ANAMNESIS: { block: rootBlock, bg: extractVar(rootBlock, 'bg') },
  'LIMERENCE dark': { block: limerenceDarkBlock, bg: extractVar(limerenceDarkBlock, 'bg') },
  'LIMERENCE light': { block: limerenceLightBlock, bg: extractVar(limerenceLightBlock, 'bg') },
};

describe('I9 — WCAG AA contrast for every genuine reading-text color token', () => {
  for (const [name, { block, bg }] of Object.entries(PALETTES)) {
    describe(name, () => {
      it('--ink clears AA-normal against --bg', () => {
        expect(contrastRatio(extractVar(block, 'ink'), bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });

      it('--ink-dim clears AA-normal against --bg', () => {
        expect(contrastRatio(extractVar(block, 'ink-dim'), bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });

      it('--ink-faint clears AA-normal against --bg (small meta/label text throughout the UI)', () => {
        expect(contrastRatio(extractVar(block, 'ink-faint'), bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });

      it('--danger clears AA-normal against --bg (the reset-progress confirm button)', () => {
        expect(contrastRatio(extractVar(block, 'danger'), bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });

      it('--gold-text clears AA-normal against --bg (Usher/Porter lines, door choice text, field-note emphasis)', () => {
        // --gold-text is `var(--gold)` in :root and LIMERENCE dark (no separate
        // hex literal to extract there); resolve to --gold's own value in that case.
        const raw = block.match(/--gold-text:\s*(#[0-9a-fA-F]{3,6}|var\(--gold\))/);
        expect(raw, '--gold-text not found').toBeTruthy();
        const hex = raw![1].startsWith('#') ? raw![1] : extractVar(block, 'gold');
        expect(contrastRatio(hex, bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });
    });
  }

  it('LIMERENCE light\'s plain --gold (decorative-only now) still clears the 3:1 non-text/large-text floor', () => {
    // --gold itself is intentionally allowed to stay below 4.5:1 in this one
    // palette, since every genuine-text use was moved to --gold-text — but
    // it still backs real UI components (focus outlines, borders) that WCAG
    // 1.4.11 holds to a 3:1 floor, and .ending-title's large (30-52px) text.
    expect(contrastRatio(extractVar(limerenceLightBlock, 'gold'), extractVar(limerenceLightBlock, 'bg'))).toBeGreaterThanOrEqual(3);
  });

  describe('LIMERENCE light — per-floor accent overrides (graphics overhaul, 2026-07-16)', () => {
    const bg = PALETTES['LIMERENCE light'].bg;
    for (const act of [1, 2, 3]) {
      it(`data-act="${act}"'s --gold-text clears AA-normal against the (unchanged) --bg`, () => {
        const block = extractBlock(`body.pack-limerence.theme-light[data-act="${act}"]`);
        expect(contrastRatio(extractVar(block, 'gold-text'), bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });

      it(`data-act="${act}"'s plain --gold clears the 3:1 non-text/large-text floor`, () => {
        const block = extractBlock(`body.pack-limerence.theme-light[data-act="${act}"]`);
        expect(contrastRatio(extractVar(block, 'gold'), bg)).toBeGreaterThanOrEqual(3);
      });
    }

    it('each act override uses a genuinely different hue from the base light palette and from each other (the point of the feature)', () => {
      const base = extractVar(limerenceLightBlock, 'gold-text');
      const perAct = [1, 2, 3].map((act) => extractVar(extractBlock(`body.pack-limerence.theme-light[data-act="${act}"]`), 'gold-text'));
      const all = [base, ...perAct];
      expect(new Set(all).size).toBe(all.length);
    });
  });

  describe('LIMERENCE dark — per-floor accent overrides (Phase V3, 2026-07-16)', () => {
    const bg = PALETTES['LIMERENCE dark'].bg;
    // act1 deliberately has no --gold override (it already equals the
    // Ground Floor's own keyLight) — only act2/act3 override --gold here.
    for (const act of [2, 3]) {
      it(`data-act="${act}"'s --gold clears AA-normal against the (unchanged) dark --bg (dark mode's --gold-text is \`var(--gold)\`, so this IS the real-text color)`, () => {
        const block = extractBlock(`body.pack-limerence[data-act="${act}"]:not(.theme-light)`);
        expect(contrastRatio(extractVar(block, 'gold'), bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });
    }

    it('act2 and act3 use genuinely different hues from the base dark palette and from each other', () => {
      const base = extractVar(limerenceDarkBlock, 'gold');
      const act2 = extractVar(extractBlock('body.pack-limerence[data-act="2"]:not(.theme-light)'), 'gold');
      const act3 = extractVar(extractBlock('body.pack-limerence[data-act="3"]:not(.theme-light)'), 'gold');
      expect(new Set([base, act2, act3]).size).toBe(3);
    });
  });

  it('every genuinely text-bearing selector that used to read --gold now reads --gold-text', () => {
    // Regression guard for the exact bug this audit fixed: a future edit
    // reintroducing `color: var(--gold)` on one of these selectors would
    // silently drop LIMERENCE light mode back below AA for that text.
    const textSelectors = [
      '.room-title {',
      '.beat.usher {',
      '.choice-card.door .txt {',
      '.field-note strong {',
      '.how-to-play b {',
      '.codex-card.ending-card .cx-title {',
      '.persona-card-name {',
      '.about-body b {',
      '.recap-item .r-title {',
      '.run-stats b {',
      '.ledger-value {',
      '.choice-card .num {',
      '.choice-card .keepsake-mark {',
    ];
    for (const selector of textSelectors) {
      const idx = css.indexOf(selector);
      expect(idx, `selector not found: ${selector}`).toBeGreaterThanOrEqual(0);
      const block = css.slice(idx, css.indexOf('}', idx));
      expect(block, `${selector} should use --gold-text, not the bare --gold`).toContain('var(--gold-text)');
    }
  });
});
