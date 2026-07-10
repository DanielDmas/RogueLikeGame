import { describe, expect, it } from 'vitest';
import { makeRegistry } from '../engine/storyEngine';
import { isHiddenFromCodex, visibleRoomCount } from '../engine/ledger';
import { defaultProfile } from '../engine/saveStore';
import { newRun } from '../engine/gameState';
import { setLocale, getLocale } from '../engine/text/resolver';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';

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
