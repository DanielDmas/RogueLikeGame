import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Master plan item 18: several shared engine functions fall back to
 * ANAMNESIS's own data/vocabulary as a parameter's *default value* —
 * `storyEngine.ts`'s `DEFAULT_GRAPH`, `ledger.ts`'s `UNDERSTORY_SEQUENCE`,
 * `gameState.ts`'s `ACT_POOLS`, `ui/choices.ts`'s `KEEPSAKES`,
 * `ui/textPanel.ts`'s `SPEAKER_PREFIXES` — so a call site that forgets to
 * pass its own pack's value silently gets ANAMNESIS's instead of failing
 * loudly. This is the exact shape that already caused three real bugs
 * across this project's history (see item 18's own writeup for the list).
 *
 * Investigated whether to close this by making every one of those
 * parameters required (the "real fix" item 18's own text names) — audited
 * every live call site first, in both the shared engine/ui layer and both
 * packs' content, rather than assuming. Result: **every real call site
 * already passes its pack's own value explicitly.** The defaults are only
 * ever reached by call sites that *want* the default — chiefly ANAMNESIS's
 * own content files calling `pickUnchosenRooms(s.prior)` with no second
 * argument, which is correct exactly because that code lives inside
 * ANAMNESIS's own content tree and IS ANAMNESIS's own data. Converting
 * these to required parameters would force updating ~70+ test call sites
 * for zero live-bug benefit today, and would be actively *wrong* for
 * `pickUnchosenRooms`'s ANAMNESIS-content call sites specifically.
 *
 * So the real remaining risk isn't a bug that exists — it's a bug that a
 * *future* edit could introduce silently: new engine/UI code that forgets
 * to thread `pack.graph`/`pack.keepsakes`/`pack.guide.speakerPrefixes`
 * through, or a pack's content file copy-pasted from ANAMNESIS into
 * LIMERENCE without updating which pool/sequence constant it passes. A
 * required parameter would catch that immediately as a compile error; this
 * lint is the mechanical next-best thing, in the same style as
 * `animationSettleLint.test.ts` and `uiKeyCoverage.test.ts` — it scans the
 * actual source for the shape a leak would take and fails fast, without
 * touching a single existing call site.
 */

const flowSrc = readFileSync(resolve(__dirname, '../engine/flow.ts'), 'utf-8');
const overlaysSrc = readFileSync(resolve(__dirname, '../ui/overlays.ts'), 'utf-8');

/** All occurrences of `needle(` in `source`, each with the `window` chars of
 * source that follow it — enough to see the full argument list even if it
 * wraps onto a following line, without needing a real parser. */
function callSites(source: string, needle: string, window = 220): string[] {
  const sites: string[] = [];
  let from = 0;
  for (;;) {
    const at = source.indexOf(`${needle}(`, from);
    if (at === -1) break;
    sites.push(source.slice(at, at + window));
    from = at + needle.length;
  }
  return sites;
}

describe('engine-default-leak lint (item 18) — shared code always overrides the pack-scoped default explicitly', () => {
  it('storyEngine.ts: every flow.ts call passes the active pack\'s graph, never DEFAULT_GRAPH', () => {
    for (const fn of ['offeredDoors', 'backfillVisitedForJump', 'completeRoom']) {
      const sites = callSites(flowSrc, fn);
      expect(sites.length, `expected at least one ${fn}( call in flow.ts`).toBeGreaterThan(0);
      for (const site of sites) {
        expect(site, `${fn}( call should pass this.pack.graph explicitly:\n${site}`).toMatch(
          /this\.pack\.graph/,
        );
      }
    }
  });

  it('ledger.ts: every flow.ts/overlays.ts call passes the active pack\'s understorySequence, never UNDERSTORY_SEQUENCE', () => {
    for (const [source, label] of [
      [flowSrc, 'flow.ts'],
      [overlaysSrc, 'overlays.ts'],
    ] as const) {
      const sites = [
        ...callSites(source, 'isHiddenFromCodex'),
        ...callSites(source, 'visibleRoomCount'),
      ];
      for (const site of sites) {
        expect(
          site,
          `a call in ${label} should pass pack.graph.understorySequence explicitly:\n${site}`,
        ).toMatch(/pack\.graph\.understorySequence|understorySequence\)/);
      }
    }
  });

  it('overlays.ts: showLedger/earnedGuestStamps are only ever called with an explicit understorySequence argument (the param has no default at all — this pins that it stays that way)', () => {
    const sites = [...callSites(overlaysSrc, 'showLedger'), ...callSites(overlaysSrc, 'earnedGuestStamps')];
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      // The function *definition* call sites (inside overlays.ts itself,
      // which both defines and calls showLedger) always thread a real
      // `understorySequence` identifier — never call with too few arguments
      // to reach that parameter.
      expect(site).toMatch(/understorySequence/);
    }
  });

  it('choices.ts: the real pick() call site passes the active pack\'s own keepsakes, never the KEEPSAKES default', () => {
    const sites = callSites(flowSrc, 'this.choices.pick');
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      expect(site, `choices.pick( call should pass this.pack.keepsakes explicitly:\n${site}`).toMatch(
        /this\.pack\.keepsakes/,
      );
    }
  });

  it('textPanel.ts: the TextPanel constructed in flow.ts always has setSpeakerPrefixes called with the active pack\'s own guide voice', () => {
    expect(flowSrc).toMatch(/new TextPanel\(/);
    expect(flowSrc).toMatch(/\.setSpeakerPrefixes\(\s*pack\.guide\.speakerPrefixes\s*\)/);
  });

  it('gameState.ts: every pickUnchosenRooms call inside LIMERENCE content explicitly passes LIMERENCE_ACT_POOLS, never the ANAMNESIS-default', () => {
    // ANAMNESIS's own content/text and content/rooms call sites are
    // deliberately excluded here — pickUnchosenRooms(s.prior) with no second
    // argument is *correct* there (that code lives inside ANAMNESIS's own
    // content tree and wants ANAMNESIS's own pools); this lint's job is only
    // to catch the one direction that would actually leak, which is
    // ANAMNESIS's pools appearing inside LIMERENCE content.
    const limerenceContentFiles = [
      'src/packs/limerence/rooms/understory.ts',
      'src/packs/limerence/text/cs-rooms-understory.ts',
      'src/packs/limerence/text/de-rooms-understory.ts',
      'src/packs/limerence/text/fr-rooms-understory.ts',
      'src/packs/limerence/text/fa-rooms-understory.ts',
    ];
    let totalSites = 0;
    for (const relPath of limerenceContentFiles) {
      const src = readFileSync(resolve(__dirname, '../..', relPath), 'utf-8');
      const sites = callSites(src, 'pickUnchosenRooms');
      totalSites += sites.length;
      for (const site of sites) {
        expect(
          site,
          `${relPath}: pickUnchosenRooms( call must pass LIMERENCE_ACT_POOLS explicitly:\n${site}`,
        ).toMatch(/LIMERENCE_ACT_POOLS/);
      }
    }
    expect(totalSites, 'expected to find real pickUnchosenRooms( call sites in LIMERENCE content').toBeGreaterThan(
      0,
    );
  });
});
