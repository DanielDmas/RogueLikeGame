import { describe, expect, it } from 'vitest';
import { defaultProfile, hydrateProfile, sanitizeSettings, type Profile, type Settings } from '../engine/saveStore';
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

  // H-2 (extended review, 2026-08-01): `Array.isArray(transcript)` alone let
  // `transcript: [null]` through — a real, array-shaped save that still
  // crashed `choseIn` (both packs' ending evaluators) and `playEnding`'s
  // choice-history fold / Morning Report, every one of which dereferences
  // `.roomId`/`.effects` on each entry with no null-check of its own.
  it('rejects a transcript whose items are not real entries', () => {
    for (const bad of [null, 42, 'x', {}, { roomId: 'a' }, { choiceId: 'b' }]) {
      expect(isStructurallyValidRun({ ...okRun(), transcript: [bad] }), `item=${JSON.stringify(bad)}`).toBe(false);
    }
    // a genuinely well-formed entry still passes
    expect(
      isStructurallyValidRun({ ...okRun(), transcript: [{ roomId: 'a', stageIndex: 0, choiceId: 'b', choiceText: 'x' }] }),
    ).toBe(true);
  });

  // H-4: `currentStage`, when present, indexes `room.stages[]` directly in
  // `enterRoom`'s very first loop iteration on Continue — confirmed live
  // that a negative or fractional value dereferences `undefined` and
  // crashes immediately, before this fix the validator accepted it.
  it('rejects a present-but-hostile currentStage while still tolerating it absent', () => {
    for (const bad of [-1, -5, 1.5, NaN, 'x', {}, [], null]) {
      expect(isStructurallyValidRun({ ...okRun(), currentStage: bad }), `currentStage=${JSON.stringify(bad)}`).toBe(false);
    }
    expect(isStructurallyValidRun({ ...okRun(), currentStage: 0 })).toBe(true);
    expect(isStructurallyValidRun({ ...okRun(), currentStage: 3 })).toBe(true);
    const noStage = okRun() as unknown as Record<string, unknown>;
    delete noStage.currentStage;
    expect(isStructurallyValidRun(noStage)).toBe(true);
  });

  // H-3: `keepsakesHeld`, when present, is `.map`'d unconditionally by
  // `playEnding`'s Morning Report block — confirmed live that a string (which
  // every *gameplay* `.includes()` read on it coincidentally survives)
  // crashes only when the run actually finishes, the hardest case to notice.
  it('rejects a present-but-hostile keepsakesHeld while still tolerating it absent', () => {
    for (const bad of ['x', 5, {}, [1, 2], [null], [{}]]) {
      expect(isStructurallyValidRun({ ...okRun(), keepsakesHeld: bad }), `keepsakesHeld=${JSON.stringify(bad)}`).toBe(false);
    }
    expect(isStructurallyValidRun({ ...okRun(), keepsakesHeld: [] })).toBe(true);
    expect(isStructurallyValidRun({ ...okRun(), keepsakesHeld: ['a', 'b'] })).toBe(true);
    const noKeepsakes = okRun() as unknown as Record<string, unknown>;
    delete noKeepsakes.keepsakesHeld;
    expect(isStructurallyValidRun(noKeepsakes)).toBe(true);
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

  // U-4 (extended review, 2026-08-01, resolved): `personaOffered` is a plain
  // additive boolean, same coercion contract as `hasSeenHeartLoss` above —
  // absent/malformed on a legacy save must default false (so a returning
  // player who already skipped sees the editor exactly once more, then it
  // goes quiet forever), never throw, never silently become truthy from junk.
  it('coerces personaOffered, defaulting false on a legacy/hostile save', () => {
    expect(hydrate({}).personaOffered).toBe(false);
    expect(hydrate({ personaOffered: 'yes' }).personaOffered).toBe(false);
    expect(hydrate({ personaOffered: 1 }).personaOffered).toBe(false);
    expect(hydrate({ personaOffered: true }).personaOffered).toBe(true);
    expect(hydrate({ personaOffered: false }).personaOffered).toBe(false);
  });

  it('a wholly empty or garbage payload still yields a usable default profile', () => {
    expect(hydrate({})).toEqual(defaultProfile());
    expect(() => hydrate({ everything: 'garbage', run: [], persona: null, roomVisits: 7 })).not.toThrow();
  });

  // S-1 (extended review, 2026-08-01): unlike every other Profile field,
  // `settings` reached the engine via a bare spread merge — a hostile
  // musicVolume/fpsCap/etc. survived hydrateProfile unclamped. Confirmed
  // live: `Math.max(0, Math.min(1, NaN))` is NaN (the volume clamp's own
  // Math.min/max doesn't filter it), which crashes on the first
  // AudioParam assignment; a non-30/60 fpsCap makes `shouldRenderFrame`'s
  // `1000/targetFps` comparison permanently false, freezing the render
  // loop with no error at all.
  it('sanitizes every hostile settings field to its whitelisted domain', () => {
    const base = defaultProfile().settings;
    for (const field of ['musicVolume', 'sfxVolume', 'narrationVolume'] as const) {
      for (const bad of [NaN, Infinity, -Infinity, 'loud', null, {}, [], -5, 99]) {
        const hydrated = hydrate({ settings: { [field]: bad } }).settings[field];
        expect(Number.isFinite(hydrated), `${field}=${String(bad)}`).toBe(true);
        expect(hydrated).toBeGreaterThanOrEqual(0);
        expect(hydrated).toBeLessThanOrEqual(1);
      }
      // legitimate in-range values pass through untouched
      expect(hydrate({ settings: { [field]: 0.42 } }).settings[field]).toBe(0.42);
    }
    for (const bad of [0, NaN, -1, 15, 'fast', null, {}]) {
      expect(hydrate({ settings: { fpsCap: bad } }).settings.fpsCap, `fpsCap=${String(bad)}`).toBe(base.fpsCap);
    }
    expect(hydrate({ settings: { fpsCap: 60 } }).settings.fpsCap).toBe(60);
    for (const bad of [NaN, Infinity, 'huge', null, {}, 0.1, 5]) {
      const zoom = hydrate({ settings: { uiZoom: bad } }).settings.uiZoom;
      expect(Number.isFinite(zoom), `uiZoom=${String(bad)}`).toBe(true);
      expect(zoom).toBeGreaterThanOrEqual(0.8);
      expect(zoom).toBeLessThanOrEqual(1.3);
    }
    expect(hydrate({ settings: { quality: 'ultra' } }).settings.quality).toBe(base.quality);
    expect(hydrate({ settings: { renderScale: 'blurry' } }).settings.renderScale).toBe(base.renderScale);
    expect(hydrate({ settings: { theme: 'purple' } }).settings.theme).toBe(base.theme);
    expect(hydrate({ settings: { textVersion: 'v3' } }).settings.textVersion).toBe(base.textVersion);
    expect(hydrate({ settings: { language: 'xx' } }).settings.language).toBe(base.language);
    expect(hydrate({ settings: { language: 'de' } }).settings.language).toBe('de');
    expect(hydrate({ settings: { music: 'yes' } }).settings.music).toBe(base.music);
  });

  it('sanitizeSettings is pure and independently testable without a full profile round-trip', () => {
    const base = defaultProfile().settings;
    const hostile = { ...base, musicVolume: NaN, fpsCap: 999 as unknown as Settings['fpsCap'] };
    const clean = sanitizeSettings(hostile, base);
    expect(clean.musicVolume).toBe(base.musicVolume);
    expect(clean.fpsCap).toBe(base.fpsCap);
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
