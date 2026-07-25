import { describe, expect, it } from 'vitest';
import { defaultProfile, hydrateProfile, type Profile } from '../engine/saveStore';
import { isStructurallyValidRun, type RunState } from '../engine/schema';
import { isResumableRun, makeRegistry } from '../engine/storyEngine';
import { allRooms } from '../content/rooms';

/**
 * Adversarial-save hardening (troll pass, 2026-07-26).
 *
 * `localStorage` is editable by anyone with devtools and profiles are
 * importable as files, so the save payload is the one genuinely untrusted
 * input the engine has. Malformed *JSON* was already handled (localSave falls
 * back to its backup); **valid JSON carrying hostile values was not** —
 * `hydrateProfile` was a bare `{...base, ...parsed}` spread that trusted every
 * field. A live probe of 29 hand-built payloads crashed the running game in 10
 * distinct ways; each is pinned below at the pure-function level so the whole
 * class stays closed.
 *
 * The two payload classes are treated differently *on purpose*:
 *   - a broken **run** is discarded (a corrupt run is unplayable, and
 *     repairing it means inventing a state the player never played);
 *   - a broken **profile field** is coerced to its default (the player always
 *     needs a profile, and losing a Ledger tally is far cheaper than refusing
 *     to load their whole history).
 */

const registry = makeRegistry(allRooms);

/** A structurally sound run — every case below varies exactly one field. */
function okRun(): RunState {
  return {
    act: 1, hearts: 3, lucidity: 100,
    axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 },
    flags: [], transcript: [], visited: [], currentRoom: null, currentStage: 0,
    actOptionalDone: 0, memoryLost: false, finished: false, endingId: null,
  };
}

/** Hydrate an arbitrary hostile payload the way a real load would. */
const hydrate = (patch: Record<string, unknown>): Profile =>
  hydrateProfile(patch as Parameters<typeof hydrateProfile>[0]);

describe('isStructurallyValidRun — shape-only run validation', () => {
  it('accepts a sound run', () => {
    expect(isStructurallyValidRun(okRun())).toBe(true);
  });

  it('rejects non-objects, including the array and string forms a hand-edited save can produce', () => {
    for (const bad of [null, undefined, 0, 1, 'x', [], [1, 2], true]) {
      expect(isStructurallyValidRun(bad), `${JSON.stringify(bad)} should be rejected`).toBe(false);
    }
  });

  it('rejects an out-of-range act — the field that crashed doorsForAct via graph.actPools[act].map', () => {
    for (const act of [99, -1, 5, 1.5, null, 'two', NaN, undefined]) {
      expect(isStructurallyValidRun({ ...okRun(), act }), `act=${String(act)}`).toBe(false);
    }
    // every legitimate ActId still passes
    for (const act of [0, 1, 2, 3, 4]) {
      expect(isStructurallyValidRun({ ...okRun(), act }), `act=${act}`).toBe(true);
    }
  });

  it('rejects non-finite numerics rather than letting NaN propagate into the HUD', () => {
    for (const field of ['hearts', 'lucidity', 'actOptionalDone'] as const) {
      for (const bad of [null, undefined, NaN, Infinity, 'x', {}]) {
        expect(isStructurallyValidRun({ ...okRun(), [field]: bad }), `${field}=${String(bad)}`).toBe(false);
      }
    }
  });

  it('rejects non-array visited/flags/transcript — the shape that crashed isResumableRun\'s .every', () => {
    for (const field of ['visited', 'flags', 'transcript'] as const) {
      for (const bad of [null, undefined, 'x', 5, {}]) {
        expect(isStructurallyValidRun({ ...okRun(), [field]: bad }), `${field}=${String(bad)}`).toBe(false);
      }
    }
    // arrays holding the wrong element type are rejected too, for the two
    // that are read as string ids.
    expect(isStructurallyValidRun({ ...okRun(), visited: [1, 2] })).toBe(false);
    expect(isStructurallyValidRun({ ...okRun(), flags: [{}] })).toBe(false);
  });

  it('rejects a missing or malformed axes record', () => {
    for (const bad of [null, undefined, [], 'x', {}, { reasonFeeling: 0 }, { reasonFeeling: 0, selfOthers: 0 }]) {
      expect(isStructurallyValidRun({ ...okRun(), axes: bad }), `axes=${JSON.stringify(bad)}`).toBe(false);
    }
    expect(
      isStructurallyValidRun({ ...okRun(), axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: NaN } }),
    ).toBe(false);
  });

  it('rejects a non-string currentRoom/endingId and a non-boolean finished', () => {
    expect(isStructurallyValidRun({ ...okRun(), currentRoom: 42 })).toBe(false);
    expect(isStructurallyValidRun({ ...okRun(), endingId: 42 })).toBe(false);
    expect(isStructurallyValidRun({ ...okRun(), finished: 'yes' })).toBe(false);
    // null is legitimate for both id fields
    expect(isStructurallyValidRun({ ...okRun(), currentRoom: null, endingId: null })).toBe(true);
  });

  it('tolerates every genuinely optional field being absent — a legacy save must still load', () => {
    // Rejecting a real old save would be a far worse bug than tolerating a
    // missing optional field, so these are deliberately not required.
    const legacy = okRun() as unknown as Record<string, unknown>;
    for (const optional of ['currentStage', 'doorSeed', 'prior', 'descended', 'keepsakesHeld', 'examined']) {
      delete legacy[optional];
    }
    expect(isStructurallyValidRun(legacy)).toBe(true);
  });
});

describe('isResumableRun — never throws on the answer being "no"', () => {
  it('returns false instead of throwing for structurally broken runs', () => {
    for (const bad of [null, undefined, [], 'x', { ...okRun(), visited: null }, { ...okRun(), act: 99 }]) {
      expect(() => isResumableRun(bad as RunState, registry)).not.toThrow();
      expect(isResumableRun(bad as RunState, registry)).toBe(false);
    }
  });

  it('still rejects a structurally sound run whose room ids belong to another pack', () => {
    const alien = { ...okRun(), currentRoom: 'the-front-desk' }; // a LIMERENCE id
    expect(isStructurallyValidRun(alien)).toBe(true);
    expect(isResumableRun(alien, registry)).toBe(false);
  });
});

describe('hydrateProfile — hostile profile fields are coerced, never trusted', () => {
  it('discards a structurally invalid run rather than passing it downstream', () => {
    for (const run of [[], 'x', 0, { ...okRun(), act: 99 }, { ...okRun(), visited: null }]) {
      expect(hydrate({ run }).run, `run=${JSON.stringify(run)}`).toBeNull();
    }
  });

  it('keeps a sound run untouched', () => {
    const run = okRun();
    expect(hydrate({ run }).run).toEqual(run);
  });

  it('coerces every id-array field that a null crashed a .map/.length on', () => {
    const base = defaultProfile();
    for (const field of [
      'codexUnlocked', 'endingsSeen', 'keepsakes', 'keepsakeChoicesTaken', 'epiphanies', 'choiceHistory',
    ] as const) {
      for (const bad of [null, undefined, 'x', 5, {}]) {
        expect(hydrate({ [field]: bad })[field], `${field}=${String(bad)}`).toEqual(base[field]);
      }
      // non-string members are dropped rather than poisoning later lookups
      expect(hydrate({ [field]: ['a', 1, null, 'b'] })[field]).toEqual(['a', 'b']);
    }
  });

  it('coerces roomVisits to a real record of finite numbers', () => {
    expect(hydrate({ roomVisits: null }).roomVisits).toEqual({});
    expect(hydrate({ roomVisits: [] }).roomVisits).toEqual({});
    expect(hydrate({ roomVisits: 'x' }).roomVisits).toEqual({});
    expect(hydrate({ roomVisits: { a: 2, b: 'x', c: NaN, d: 3 } }).roomVisits).toEqual({ a: 2, d: 3 });
  });

  it('clamps lifetime counters so the Ledger can never render NaN or a negative', () => {
    for (const field of ['runsCompleted', 'heartsLost', 'understoryDescents', 'examinedRuns'] as const) {
      for (const bad of [null, undefined, NaN, -5, 'x', {}, Infinity]) {
        expect(hydrate({ [field]: bad })[field], `${field}=${String(bad)}`).toBe(0);
      }
      expect(hydrate({ [field]: 7 })[field]).toBe(7);
      expect(hydrate({ [field]: 2.9 })[field]).toBe(2);
    }
  });

  it('replaces a broken persona rather than letting .name crash the title screen', () => {
    const base = defaultProfile();
    for (const bad of [null, undefined, 'x', 5, []]) {
      expect(hydrate({ persona: bad }).persona, `persona=${String(bad)}`).toEqual(base.persona);
    }
    expect(hydrate({ persona: { name: 42, blurb: 'ok' } }).persona).toEqual({
      ...base.persona, name: base.persona.name, blurb: 'ok',
    });
  });

  it('coerces the string-or-null fields', () => {
    for (const field of ['lastMessage', 'lastMessageChoiceId'] as const) {
      expect(hydrate({ [field]: 5 })[field]).toBeNull();
      expect(hydrate({ [field]: {} })[field]).toBeNull();
      expect(hydrate({ [field]: 'a sentence' })[field]).toBe('a sentence');
    }
  });

  it('leaves genuinely optional fields absent rather than materializing them as null', () => {
    // Regression guard: an earlier draft of this hardening always wrote
    // `lastRunEndingId: null`, which changed the profile shape for every
    // first-time player and broke two existing save-round-trip tests.
    const hydrated = hydrate({});
    expect('lastRunEndingId' in hydrated).toBe(false);
    expect('lastRunTranscript' in hydrated).toBe(false);
    expect(hydrated).toEqual(defaultProfile());
  });

  it('still sanitizes those optional fields when they ARE present', () => {
    expect(hydrate({ lastRunEndingId: 42 }).lastRunEndingId).toBeNull();
    expect(hydrate({ lastRunEndingId: 'dissolved' }).lastRunEndingId).toBe('dissolved');
    expect(hydrate({ lastRunTranscript: 'x' }).lastRunTranscript).toBeUndefined();
  });

  it('coerces the booleans', () => {
    expect(hydrate({ hasSeenHeartLoss: 'yes' }).hasSeenHeartLoss).toBe(false);
    expect(hydrate({ hasSeenHeartLoss: true }).hasSeenHeartLoss).toBe(true);
  });

  it('a wholly empty or garbage payload still yields a usable default profile', () => {
    expect(hydrate({})).toEqual(defaultProfile());
    expect(() => hydrate({ everything: 'garbage', run: [], persona: null, roomVisits: 7 })).not.toThrow();
  });

  it('does not pollute Object.prototype from a hostile __proto__ key', () => {
    // Object spread uses CreateDataProperty (define, not set), so `__proto__`
    // lands as an own property instead of invoking the setter. Verified live
    // in the browser probe too; pinned here so a future refactor to
    // Object.assign (which DOES invoke setters) can't silently reopen it.
    hydrate(JSON.parse('{"__proto__":{"polluted":true}}'));
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});
