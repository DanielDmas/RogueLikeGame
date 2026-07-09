import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { allRooms } from '../content/rooms';
import { makeRegistry } from '../engine/storyEngine';
import { newRun } from '../engine/gameState';
import { defaultProfile, type Profile } from '../engine/saveStore';
import {
  epiphanyLine,
  evaluateEpiphanies,
  isHiddenFromCodex,
  ledgerStats,
  mostWalkedRoomId,
  visibleRoomCount,
} from '../engine/ledger';
import { anamnesisPack } from '../packs/anamnesis';
import '../content/text';

const registry = makeRegistry(allRooms);
const epiphanies = anamnesisPack.epiphanies;
const EPIPHANY_IDS = epiphanies.map((e) => e.id);
const evalEpiphanies = (profile: Profile, run: ReturnType<typeof newRun>) =>
  evaluateEpiphanies(profile, run, registry, epiphanies);

function profileWith(overrides: Partial<Profile>): Profile {
  return { ...defaultProfile(), ...overrides };
}

function rowValue(profile: Profile, id: string): string | undefined {
  return ledgerStats(profile, registry).find((r) => r.id === id)?.value;
}

describe('ledgerStats (Milestone 5, Phase P)', () => {
  it('a fresh profile shows zeros/dashes and hides the descents/examined/last-message rows', () => {
    const rows = ledgerStats(defaultProfile(), registry);
    const ids = rows.map((r) => r.id);
    expect(ids).not.toContain('descents');
    expect(ids).not.toContain('examined');
    expect(ids).not.toContain('last-message');
    expect(rowValue(defaultProfile(), 'runs')).toBe('0');
    expect(rowValue(defaultProfile(), 'hearts')).toBe('0');
    expect(rowValue(defaultProfile(), 'most-walked')).toBe('—');
    expect(rowValue(defaultProfile(), 'keepsakes')).toBe('0 of 4');
    expect(rowValue(defaultProfile(), 'endings')).toBe('0 of 6');
  });

  it('rooms witnessed counts against the codex-visible denominator, not the full registry', () => {
    const { seen, total } = visibleRoomCount(defaultProfile(), registry);
    expect(seen).toBe(0);
    // total excludes the understory trio until walked
    expect(total).toBe(registry.all().length - 3);
    const withOne = profileWith({ codexUnlocked: ['wallet'] });
    expect(rowValue(withOne, 'rooms')).toBe(`1 of ${total}`);
  });

  it('walking an understory room grows the denominator by exactly one', () => {
    const before = visibleRoomCount(defaultProfile(), registry).total;
    const after = visibleRoomCount(profileWith({ codexUnlocked: ['the-archive'] }), registry).total;
    expect(after).toBe(before + 1);
  });

  it('descents/examined rows appear only once their counter reaches 1', () => {
    expect(rowValue(profileWith({ understoryDescents: 1 }), 'descents')).toBe('1');
    expect(rowValue(profileWith({ examinedRuns: 1 }), 'examined')).toBe('1');
  });

  it('the last-message row appears only once a message has been sent, quoted', () => {
    expect(rowValue(profileWith({ lastMessage: 'Wait for me.' }), 'last-message')).toBe('“Wait for me.”');
  });

  it('the most-walked door resolves to a translated title, not the raw id', () => {
    const p = profileWith({ roomVisits: { wallet: 3, promotion: 1 } });
    const value = rowValue(p, 'most-walked');
    expect(value).not.toBe('wallet');
    expect(value).toMatch(/wallet/i);
  });

  it('a tie in roomVisits resolves to whichever key was inserted first', () => {
    expect(mostWalkedRoomId({ wallet: 2, promotion: 2 })).toBe('wallet');
    expect(mostWalkedRoomId({ promotion: 2, wallet: 2 })).toBe('promotion');
  });

  it('mostWalkedRoomId returns null for an empty record', () => {
    expect(mostWalkedRoomId({})).toBeNull();
  });
});

describe('isHiddenFromCodex (Milestone 5, Phase L/P — shared with the codex)', () => {
  it('hides understory rooms until walked, and never hides ordinary secret rooms', () => {
    const profile = defaultProfile();
    expect(isHiddenFromCodex('the-archive', profile)).toBe(true);
    expect(isHiddenFromCodex('the-unchosen', profile)).toBe(true);
    expect(isHiddenFromCodex('introduction', profile)).toBe(false);
  });
});

describe('evaluateEpiphanies (Milestone 5, Phase P)', () => {
  it('every epiphany has both a positive and a negative case', () => {
    const emptyProfile = defaultProfile();
    const emptyRun = newRun();

    expect(evalEpiphanies(emptyProfile, emptyRun)).toEqual([]);

    const cases: [string, Profile, ReturnType<typeof newRun>][] = [
      ['first-return', profileWith({ runsCompleted: 2 }), emptyRun],
      ['kept-every-heart', emptyProfile, { ...emptyRun, finished: true, hearts: 3 }],
      ['spent-every-heart', profileWith({ endingsSeen: ['dissolved'] }), emptyRun],
      [
        'refused-machine-twice',
        profileWith({ roomVisits: { 'experience-machine': 2 }, keepsakes: [] }),
        emptyRun,
      ],
      ['three-endings', profileWith({ endingsSeen: ['return', 'gardener', 'fortress'] }), emptyRun],
      ['descended', profileWith({ understoryDescents: 1 }), emptyRun],
      ['examined-run', profileWith({ examinedRuns: 1 }), emptyRun],
      ['first-keepsake', profileWith({ keepsakes: ['casino-chip'] }), emptyRun],
      ['high-lucidity', emptyProfile, { ...emptyRun, finished: true, lucidity: 200 }],
      ['last-word-kept', profileWith({ lastMessage: 'hi', runsCompleted: 2 }), emptyRun],
    ];
    for (const [id, profile, run] of cases) {
      expect(evalEpiphanies(profile, run), id).toContain(id);
    }
  });

  it('refused-machine-twice does NOT fire if the release-form keepsake was ever held (spec 06 §6)', () => {
    const profile = profileWith({ roomVisits: { 'experience-machine': 2 }, keepsakes: ['release-form'] });
    expect(evalEpiphanies(profile, newRun())).not.toContain('refused-machine-twice');
  });

  it('codex-complete requires every base room, excluding the understory trio', () => {
    const baseRoomIds = registry
      .all()
      .map((r) => r.id)
      .filter((id) => !['the-archive', 'the-unchosen', 'the-echo'].includes(id));
    const almostAll = profileWith({ codexUnlocked: baseRoomIds.slice(0, -1) });
    const all = profileWith({ codexUnlocked: baseRoomIds });
    expect(evalEpiphanies(almostAll, newRun())).not.toContain('codex-complete');
    expect(evalEpiphanies(all, newRun())).toContain('codex-complete');
  });

  it('all-doors-one-act fires once any single act (I, II, or III) is fully unlocked', () => {
    const act1Ids = registry.all().filter((r) => r.act === 1).map((r) => r.id);
    const profile = profileWith({ codexUnlocked: act1Ids });
    expect(evalEpiphanies(profile, newRun())).toContain('all-doors-one-act');
  });

  it('excludes already-held epiphanies from "newly earned"', () => {
    const profile = profileWith({ runsCompleted: 3, epiphanies: ['first-return'] });
    expect(evalEpiphanies(profile, newRun())).not.toContain('first-return');
  });

  it('is idempotent: re-evaluating an unchanged profile/run returns nothing new', () => {
    const profile = profileWith({ runsCompleted: 2 });
    const run = newRun();
    const first = evalEpiphanies(profile, run);
    const applied = profileWith({ runsCompleted: 2, epiphanies: first });
    expect(evalEpiphanies(applied, run)).toEqual([]);
  });

  it('every epiphany id has a translated line distinct from its raw slug', () => {
    for (const id of EPIPHANY_IDS) {
      expect(epiphanyLine(id, epiphanies)).not.toBe(id);
    }
  });
});

describe('Profile migration — new Ledger fields backfill on a legacy profile (Milestone 5, Phase P)', () => {
  it('defaultProfile() initializes every Ledger field to its documented default', () => {
    const p = defaultProfile();
    expect(p.heartsLost).toBe(0);
    expect(p.roomVisits).toEqual({});
    expect(p.understoryDescents).toBe(0);
    expect(p.examinedRuns).toBe(0);
    expect(p.epiphanies).toEqual([]);
    expect(p.choiceHistory).toEqual([]);
  });
});

describe('Ledger hard guarantee — read-only, never mechanical (production review, Phase P)', () => {
  /** Statically scans every content room file for any reference to a Ledger-only
   * Profile field. Room predicates (`available`/`secret`) only ever receive a
   * `RunState`, which structurally has none of these fields, so this is a
   * belt-and-suspenders proof rather than something the type system could
   * silently regress on its own. */
  function findTsFiles(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) findTsFiles(full, out);
      else if (entry.name.endsWith('.ts')) out.push(full);
    }
    return out;
  }

  const LEDGER_ONLY_FIELDS = ['heartsLost', 'roomVisits', 'understoryDescents', 'examinedRuns', 'epiphanies', 'choiceHistory'];

  it('no room content file references any Ledger-only Profile field', () => {
    const roomsDir = resolve(__dirname, '../content/rooms');
    for (const file of findTsFiles(roomsDir)) {
      const src = readFileSync(file, 'utf-8');
      for (const field of LEDGER_ONLY_FIELDS) {
        expect(src.includes(field), `${file} references Ledger-only field "${field}"`).toBe(false);
      }
    }
  });

  it('no gameplay predicate module (storyEngine, gameState, endings) references a Ledger-only field', () => {
    const files = ['../engine/storyEngine.ts', '../engine/gameState.ts', '../engine/endings.ts'].map((p) =>
      resolve(__dirname, p),
    );
    for (const file of files) {
      const src = readFileSync(file, 'utf-8');
      for (const field of LEDGER_ONLY_FIELDS) {
        expect(src.includes(field), `${file} references Ledger-only field "${field}"`).toBe(false);
      }
    }
  });
});
