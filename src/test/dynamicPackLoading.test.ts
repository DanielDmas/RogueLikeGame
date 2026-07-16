import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// Fable review, M4: main.ts used to statically `import { anamnesisPack } ...`
// and `import { limerencePack } ...` at the top level, so both packs' full
// module graphs (rooms, endings, every language's translations, dioramas,
// guide barks — all registered as import-time side effects) shipped in
// every production build regardless of which pack `__PACK__` selected,
// despite packs/types.ts's own header comment claiming otherwise. Verified
// live by building the ANAMNESIS bundle and finding LIMERENCE's own Czech
// guide-word ("Vrátný") and room ids inside it.
//
// The real fix (dynamic `import()` gated on the compile-time `__PACK__`
// constant, so Rollup tree-shakes the unused pack's import out entirely)
// needs an actual `vite build` to verify at the byte level — done manually
// this session (before: 3,543.84 kB/1,253.77 kB gzip single chunk with the
// leak; after: 2,211.52 kB/785.76 kB gzip split across two chunks, leak
// strings confirmed absent via grep) rather than as part of this fast test
// suite, which has no build step. What belongs here, and is fast/reliable
// to keep as a permanent regression guard, is the *source shape* the fix
// depends on: no top-level static import of either pack's module, and the
// dynamic import() calls gated on `__PACK__` are actually present.
describe("main.ts loads exactly one pack via dynamic import(), not two static imports (Fable review M4)", () => {
  const src = readFileSync(new URL('../main.ts', import.meta.url), 'utf8');

  it('does not statically import anamnesisPack or limerencePack at module top level', () => {
    expect(src).not.toMatch(/^import\s*\{[^}]*\banamnesisPack\b[^}]*\}\s*from/m);
    expect(src).not.toMatch(/^import\s*\{[^}]*\blimerencePack\b[^}]*\}\s*from/m);
  });

  it('loads both packs only via dynamic import(), gated on __PACK__ or the dev-only ?pack= override', () => {
    expect(src).toMatch(/await import\(['"]\.\/packs\/anamnesis['"]\)/);
    expect(src).toMatch(/await import\(['"]\.\/packs\/limerence['"]\)/);
    expect(src).toContain('__PACK__');
  });
});
