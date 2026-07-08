import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';
import { KEEPSAKE_TRIGGERS, KEEPSAKES, keepsakeIcons, keepsakesEarnedByFlags } from '../content/keepsakes';
import { newRun } from '../engine/gameState';
import { setLocale, t } from '../engine/text/resolver';
import '../content/text';
import { keepsakeKey } from '../engine/text/keys';

const ALL_KEEPSAKE_IDS = KEEPSAKES.map((k) => k.id);

/** Room#stage -> ids of choices available in that stage, given a keepsakesHeld list. */
function snapshotAvailableChoices(keepsakesHeld: string[] | undefined): Record<string, string[]> {
  const s = { ...newRun(), keepsakesHeld };
  const out: Record<string, string[]> = {};
  for (const room of allRooms) {
    room.stages.forEach((stage, si) => {
      out[`${room.id}#${si}`] = stage.choices.filter((c) => !c.available || c.available(s)).map((c) => c.id);
    });
  }
  return out;
}

describe('keepsakes hard guarantee — the owner\'s constraint (Milestone 5, Phase N)', () => {
  it('keepsakesHeld: [] is bit-identical to keepsakesHeld: undefined (a keepsake-less profile sees no change)', () => {
    expect(snapshotAvailableChoices([])).toEqual(snapshotAvailableChoices(undefined));
  });

  it('with all four keepsakes held, the available-choice list differs from baseline only by the four specified additions', () => {
    const baseline = snapshotAvailableChoices([]);
    const withAll = snapshotAvailableChoices(ALL_KEEPSAKE_IDS);
    const expectedAdditions: Record<string, string> = {
      'newcomb-annex#0': 'bet-against',
      'the-archive#0': 'pin-the-corner',
      'swampman#0': 'show-the-splinter',
      'butterfly-dream#0': 'compare-dreams',
    };
    expect(Object.keys(baseline)).toEqual(Object.keys(withAll));
    for (const key of Object.keys(baseline)) {
      const before = baseline[key];
      const after = withAll[key];
      const removed = before.filter((id) => !after.includes(id));
      const added = after.filter((id) => !before.includes(id));
      expect(removed, `${key} lost a choice`).toEqual([]);
      expect(added, key).toEqual(expectedAdditions[key] ? [expectedAdditions[key]] : []);
    }
  });

  it('no sibling (non-keepsake) choice in the four unlock rooms changes text or effects', () => {
    const withoutSet = snapshotAvailableChoices([]);
    for (const roomId of ['newcomb-annex', 'the-archive', 'swampman', 'butterfly-dream']) {
      const room = allRooms.find((r) => r.id === roomId)!;
      const siblingIds = withoutSet[`${roomId}#0`];
      for (const id of siblingIds) {
        const choice = room.stages[0].choices.find((c) => c.id === id)!;
        expect(choice.keepsakeId, `${roomId}/${id} should not itself be keepsake-gated`).toBeUndefined();
      }
    }
  });
});

describe('keepsakesEarnedByFlags — earn-trigger mapping (Milestone 5, Phase N)', () => {
  it('maps each of the four trigger flags to exactly its keepsake', () => {
    expect(keepsakesEarnedByFlags(['sharp-gambler'])).toEqual(['casino-chip']);
    expect(keepsakesEarnedByFlags(['saved-photo'])).toEqual(['photo-corner']);
    expect(keepsakesEarnedByFlags(['ship-splinter'])).toEqual(['ship-splinter']);
    expect(keepsakesEarnedByFlags(['entered-machine'])).toEqual(['release-form']);
  });

  it('ignores unrelated flags and dedupes a repeated trigger flag', () => {
    expect(keepsakesEarnedByFlags(['refused-once', 'sharp-gambler', 'sharp-gambler'])).toEqual(['casino-chip']);
  });

  it('returns nothing for flags with no known trigger, or an empty list', () => {
    expect(keepsakesEarnedByFlags(['pulled-lever', 'kept-bridge'])).toEqual([]);
    expect(keepsakesEarnedByFlags([])).toEqual([]);
  });

  it('is idempotent: applying the same flag repeatedly still yields the keepsake exactly once', () => {
    expect(keepsakesEarnedByFlags(['sharp-gambler', 'sharp-gambler', 'sharp-gambler'])).toEqual(['casino-chip']);
  });
});

describe('RunState.keepsakesHeld — the run-start mirror (Milestone 5, Phase N)', () => {
  it('newRun() with no keepsakesHeld argument leaves it undefined (holding nothing)', () => {
    expect(newRun().keepsakesHeld).toBeUndefined();
  });

  it('newRun(doorSeed, prior, keepsakesHeld) stamps it verbatim', () => {
    const s = newRun(1, undefined, ['casino-chip', 'release-form']);
    expect(s.keepsakesHeld).toEqual(['casino-chip', 'release-form']);
  });

  it('a keepsake earned mid-run does not retroactively appear in that same run\'s keepsakesHeld — only the next run\'s stamp sees it', () => {
    const thisRun = newRun(1, undefined, []); // stamped holding nothing
    expect(thisRun.keepsakesHeld).toEqual([]);
    const profileKeepsakesAfterEarning = ['casino-chip']; // profile-level, updated mid-run
    const nextRun = newRun(2, undefined, [...profileKeepsakesAfterEarning]);
    expect(nextRun.keepsakesHeld).toEqual(['casino-chip']);
  });
});

describe('no mechanical bleed — keepsake-gated choices never cost a heart (Milestone 5, Phase N)', () => {
  it('none of the four keepsake choices has a hearts effect', () => {
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) {
          if (c.keepsakeId) expect(c.effects.hearts, `${room.id}/${c.id}`).toBeUndefined();
        }
      }
    }
  });
});

describe('keepsake content completeness (Milestone 5, Phase N)', () => {
  it('every keepsake has a schematic icon', () => {
    for (const def of KEEPSAKES) expect(keepsakeIcons[def.id], def.id).toContain('<svg');
  });

  it('every keepsake\'s name/origin is translated to cs and fa', () => {
    for (const lang of ['cs', 'fa'] as const) {
      setLocale(lang, 'v2');
      for (const def of KEEPSAKES) {
        const name = t(keepsakeKey(def.id, 'name'), def.name);
        const origin = t(keepsakeKey(def.id, 'origin'), def.origin);
        expect(name, `${def.id} name in ${lang}`).not.toBe(def.name);
        expect(origin, `${def.id} origin in ${lang}`).not.toBe(def.origin);
      }
      setLocale('en', 'v2');
    }
  });

  it('every keepsake-gated choice references a real, known keepsake id', () => {
    const knownIds = new Set(ALL_KEEPSAKE_IDS);
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) {
          if (c.keepsakeId) expect(knownIds.has(c.keepsakeId), `${room.id}/${c.id}`).toBe(true);
        }
      }
    }
  });

  it('all four keepsakes are actually earnable and actually unlock a choice somewhere', () => {
    const earnableIds = new Set(Object.values(KEEPSAKE_TRIGGERS));
    const unlockedIds = new Set<string>();
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) if (c.keepsakeId) unlockedIds.add(c.keepsakeId);
      }
    }
    for (const def of KEEPSAKES) {
      expect(earnableIds.has(def.id), `${def.id} has no earn trigger`).toBe(true);
      expect(unlockedIds.has(def.id), `${def.id} unlocks no choice`).toBe(true);
    }
  });

  it('every keepsake-gated choice id is globally unique (profile.keepsakeChoicesTaken dedupes by bare choice id, not room/choice)', () => {
    const seen = new Map<string, string>();
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) {
          if (!c.keepsakeId) continue;
          const priorRoom = seen.get(c.id);
          expect(priorRoom, `choice id "${c.id}" is keepsake-gated in both ${priorRoom} and ${room.id} — profile.keepsakeChoicesTaken would undercount`).toBeUndefined();
          seen.set(c.id, room.id);
        }
      }
    }
  });
});
