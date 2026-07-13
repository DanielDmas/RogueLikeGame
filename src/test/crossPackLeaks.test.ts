import { afterEach, describe, expect, it } from 'vitest';
import { makeRegistry, offeredDoors } from '../engine/storyEngine';
import { isHiddenFromCodex, visibleRoomCount, ledgerStats } from '../engine/ledger';
import { defaultProfile } from '../engine/saveStore';
import { newRun } from '../engine/gameState';
import { setLocale, getLocale } from '../engine/text/resolver';
import { resolveBeat, SPEAKER_PREFIXES } from '../ui/textPanel';
import { translateFieldNoteForCodex } from '../ui/overlays';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';
import type { RunState } from '../engine/schema';

/**
 * Regression tests for two cross-pack leaks found in the 2026-07-09 review:
 * engine/ui helpers that hardcoded ANAMNESIS-specific data (the understory
 * sequence in ledger.ts, the keepsake list in choices.ts) and so behaved
 * wrongly for a second pack. Both now take the pack-specific data as an
 * optional parameter defaulting to ANAMNESIS's own (spec 08 §3 pattern);
 * these lock that in for every pack.
 */

const packs: { name: string; pack: ContentPack }[] = [
  { name: 'anamnesis', pack: anamnesisPack },
  { name: 'limerence', pack: limerencePack },
];

describe('ledger.ts understory-hiding uses the ACTIVE pack’s understory sequence, not ANAMNESIS’s', () => {
  for (const { name, pack } of packs) {
    it(`${name}: its own understory rooms are hidden from the codex until walked, and no others are`, () => {
      const profile = defaultProfile();
      const understory = pack.graph.understorySequence;
      // Every one of this pack's own understory rooms is hidden when unwalked...
      for (const id of understory) {
        expect(isHiddenFromCodex(id, profile, understory), `${name}/${id} should be hidden when unwalked`).toBe(true);
      }
      // ...and becomes visible once walked (in codexUnlocked).
      const walkedProfile = { ...profile, codexUnlocked: [...understory] };
      for (const id of understory) {
        expect(isHiddenFromCodex(id, walkedProfile, understory), `${name}/${id} should be visible once walked`).toBe(false);
      }
      // No *non*-understory room in this pack is ever hidden by this rule.
      const nonUnderstory = pack.rooms.map((r) => r.id).filter((id) => !understory.includes(id));
      for (const id of nonUnderstory) {
        expect(isHiddenFromCodex(id, profile, understory), `${name}/${id} (not understory) must not be hidden`).toBe(false);
      }
    });
  }

  it('LIMERENCE’s Records Office rooms would have leaked into the codex under the OLD (ANAMNESIS-defaulted) call — the regression this fixes', () => {
    const profile = defaultProfile();
    // The bug: calling with the default (ANAMNESIS) sequence never hides
    // LIMERENCE's understory rooms, so they'd render as locked codex cards
    // from the start, revealing they exist.
    for (const id of limerencePack.graph.understorySequence) {
      expect(isHiddenFromCodex(id, profile), 'ANAMNESIS-defaulted call does NOT hide LIMERENCE understory (documents the old bug)').toBe(false);
      expect(isHiddenFromCodex(id, profile, limerencePack.graph.understorySequence), 'pack-aware call correctly hides it').toBe(true);
    }
  });

  it('visibleRoomCount excludes each pack’s own unwalked understory from the "rooms witnessed" total', () => {
    for (const { name, pack } of packs) {
      const registry = makeRegistry(pack.rooms);
      const understory = pack.graph.understorySequence;
      const { total } = visibleRoomCount(defaultProfile(), registry, understory);
      const expected = pack.rooms.length - understory.length;
      expect(total, `${name}: total should exclude ${understory.length} unwalked understory room(s)`).toBe(expected);
    }
  });
});

describe('choices.ts ✧ keepsake tooltip: every keepsake-gated choice’s id resolves to a def in the ACTIVE pack’s keepsake list', () => {
  for (const { name, pack } of packs) {
    it(`${name}: every choice.keepsakeId has a matching pack.keepsakes entry (so the tooltip name is never blank)`, () => {
      const known = new Set(pack.keepsakes.map((k) => k.id));
      const referenced: string[] = [];
      for (const room of pack.rooms) {
        for (const stage of room.stages) {
          for (const choice of stage.choices) {
            if (choice.keepsakeId) referenced.push(choice.keepsakeId);
          }
        }
      }
      expect(referenced.length, `${name} should have at least one keepsake-gated choice`).toBeGreaterThan(0);
      for (const id of referenced) {
        expect(known.has(id), `${name}: choice keepsakeId "${id}" is not in pack.keepsakes → tooltip would render nameless`).toBe(true);
      }
    });
  }
});

describe('guide bark/act-intro text keys are pack-scoped — LIMERENCE deliberately reuses ANAMNESIS’s own bark/act-intro id vocabulary (understory-hint, reason-low, generic0…, act numbers 1-4) to mirror its structure; both packs’ modules are bundled together, so an unscoped key would let ANAMNESIS’s registered translations silently override LIMERENCE’s (or vice versa)', () => {
  it('a door-bark that mirrors an ANAMNESIS bark id (e.g. "reason-low") never renders ANAMNESIS’s Usher-voiced text for LIMERENCE, in any locale both packs might register translations for', () => {
    const savedLocale = getLocale();
    try {
      for (const lang of ['en', 'cs', 'fa', 'de', 'fr'] as const) {
        setLocale(lang, 'v2');
        const run = { ...newRun(), axes: { reasonFeeling: -40, selfOthers: 0, controlAcceptance: 0 }, visited: ['a', 'b'] };
        const limerenceBark = limerencePack.guide.doorBark(run, 0, 2, false);
        expect(limerenceBark, `LIMERENCE's doorBark in ${lang} must never read "Usher:" (ANAMNESIS's persona)`).not.toContain('Usher:');
      }
    } finally {
      setLocale(savedLocale.lang, savedLocale.version);
    }
  });

  it('guide.firstHeartLossBarkFallback / rememberedRoomBarkFallback are pack-specific, not the hardcoded ANAMNESIS strings that used to live directly in engine/flow.ts', () => {
    expect(limerencePack.guide.firstHeartLossBarkFallback).not.toEqual(anamnesisPack.guide.firstHeartLossBarkFallback);
    expect(limerencePack.guide.firstHeartLossBarkFallback).not.toContain('the facility');
    expect(limerencePack.guide.rememberedRoomBarkFallback).toContain('Porter');
  });
});

/**
 * Regression tests for the six release-blocking / cross-pack fixes from the
 * 2026-07-13 final review (docs/development/12-final-release-review.md,
 * findings 1.1, 6.1, P1, P2, 9.1, 9.2). Each pins the fix's pack-parameterized
 * behavior so a future change can't silently reintroduce an ANAMNESIS-only
 * literal into the shared engine/UI layer.
 */

describe('1.1 — hearts-death resolves through the ACTIVE pack’s own endingRules.evaluate(), never a hardcoded ANAMNESIS literal', () => {
  for (const { name, pack } of packs) {
    it(`${name}: a zero-hearts RunState evaluates to an ending id that actually exists in this pack's own endings`, () => {
      const state: RunState = { ...newRun(), hearts: 0, act: 2 };
      const endingId = pack.endingRules.evaluate(state);
      const known = new Set(pack.endings.map((e) => e.id));
      expect(known.has(endingId), `${name}: hearts<=0 must resolve to one of this pack's own ending ids, got "${endingId}"`).toBe(true);
    });
  }

  it('LIMERENCE’s zero-hearts ending is NOT ANAMNESIS’s "dissolved" — the old hardcoded literal would have thrown "Unknown ending"', () => {
    const state: RunState = { ...newRun(), hearts: 0, act: 2 };
    const limerenceEnding = limerencePack.endingRules.evaluate(state);
    expect(limerenceEnding).not.toBe('dissolved');
    expect(limerencePack.endings.some((e) => e.id === limerenceEnding)).toBe(true);
  });
});

describe('6.1 — the understory fork is offered using the ACTIVE pack’s own act4Sequence[0], not the hardcoded ANAMNESIS room id "boulder"', () => {
  for (const { name, pack } of packs) {
    it(`${name}: a returning traveler entering Act IV with nothing visited is offered both the understory fork and this pack's own first Act-IV room`, () => {
      const registry = makeRegistry(pack.rooms);
      const state: RunState = { ...newRun(undefined, { runs: 1, endingId: null, transcript: [] }), act: 4 };
      const doors = offeredDoors(state, registry, pack.graph);
      const ids = doors.map((d) => d.id);
      expect(ids, `${name}: understory fork door`).toContain(pack.graph.understorySequence[0]);
      expect(ids, `${name}: this pack's own first Act-IV room`).toContain(pack.graph.act4Sequence[0]);
    });
  }
});

describe('P1 — TextPanel styles spoken lines using the ACTIVE pack’s own guide.speakerPrefixes, not a hardcoded ANAMNESIS-only list', () => {
  it('a "Porter:"-prefixed beat resolves isSpoken=true under LIMERENCE’s prefixes but false under the bare default (ANAMNESIS’s list)', () => {
    const state = newRun();
    const beat = 'Porter: Every guest on this floor is certain the silence is about them.';
    expect(resolveBeat(beat, state, undefined, undefined, limerencePack.guide.speakerPrefixes).isSpoken).toBe(true);
    expect(resolveBeat(beat, state, undefined, undefined, SPEAKER_PREFIXES).isSpoken).toBe(false);
  });

  it('an "Usher:"-prefixed beat still resolves isSpoken=true under ANAMNESIS’s own prefixes (regression guard: the fix must not break the original pack)', () => {
    const state = newRun();
    const beat = 'Usher: You are still here.';
    expect(resolveBeat(beat, state, undefined, undefined, anamnesisPack.guide.speakerPrefixes).isSpoken).toBe(true);
  });
});

describe('P2 — LIMERENCE’s "stop-carrying-it" quiet ending no longer costs hearts (was hearts:-3, driving a guaranteed scripted path straight into the hearts-death crash)', () => {
  it('the choice exists in the-morning-desk and carries no hearts effect', () => {
    const room = limerencePack.rooms.find((r) => r.id === 'the-morning-desk');
    expect(room).toBeTruthy();
    const choice = room!.stages.flatMap((s) => s.choices).find((c) => c.id === 'stop-carrying-it');
    expect(choice).toBeTruthy();
    expect(choice!.effects?.hearts ?? 0).toBe(0);
  });
});

describe('9.1 — ledgerStats() uses the ACTIVE pack’s own endingsTotal/keepsake count, not ANAMNESIS’s hardcoded defaults', () => {
  it('a profile that has witnessed LIMERENCE’s hidden ending ("the-pattern") shows a correct denominator under LIMERENCE’s own endingsTotal, not "7 of 6"', () => {
    const registry = makeRegistry(limerencePack.rooms);
    const profile = { ...defaultProfile(), endingsSeen: ['the-ghost', 'the-pattern'] };
    const rows = ledgerStats(profile, registry, limerencePack.graph.understorySequence, limerencePack.endingRules.endingsTotal, limerencePack.keepsakes.length);
    const endingsRow = rows.find((r) => r.id === 'endings');
    expect(endingsRow!.value).not.toBe('2 of 6');
    expect(endingsRow!.value).toBe(`2 of ${limerencePack.endingRules.endingsTotal(profile.endingsSeen)}`);

    const keepsakesRow = rows.find((r) => r.id === 'keepsakes');
    expect(keepsakesRow!.value.endsWith(`of ${limerencePack.keepsakes.length}`)).toBe(true);
  });

  it('documents the old bug: calling ledgerStats with the bare (ANAMNESIS-defaulted) endingsTotal shows "2 of 6" for the same LIMERENCE profile', () => {
    const registry = makeRegistry(limerencePack.rooms);
    const profile = { ...defaultProfile(), endingsSeen: ['the-ghost', 'the-pattern'] };
    const rows = ledgerStats(profile, registry, limerencePack.graph.understorySequence);
    const endingsRow = rows.find((r) => r.id === 'endings');
    expect(endingsRow!.value).toBe('2 of 6');
  });
});

describe('9.2 — the codex’s synthetic last-message note is preserved using the ACTIVE pack’s own hooks.lastMessageId, not the hardcoded ANAMNESIS room id "last-message"', () => {
  afterEach(() => setLocale('en', 'v2'));

  it('LIMERENCE: translateFieldNoteForCodex leaves the-unsent’s note untouched when passed the pack’s own lastMessageId, in a non-English locale', () => {
    setLocale('cs', 'v2');
    const note = { title: 'sender: you', thinkers: '', body: 'the sentence you actually sent' };
    const result = translateFieldNoteForCodex('the-unsent', note, false, limerencePack.hooks.lastMessageId);
    expect(result).toEqual(note);
  });

  it('documents the old bug: without the pack’s lastMessageId, the-unsent’s note gets silently translated (clobbered) in a non-English locale', () => {
    setLocale('cs', 'v2');
    const note = { title: 'sender: you', thinkers: '', body: 'the sentence you actually sent' };
    const result = translateFieldNoteForCodex('the-unsent', note, false);
    expect(result).not.toEqual(note);
  });
});
