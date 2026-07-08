import { describe, expect, it, beforeEach } from 'vitest';
import { newRun } from '../engine/gameState';
import { defaultProfile, type Profile, type SaveStore } from '../engine/saveStore';
import { LocalSaveStore } from '../engine/localSave';
import type { RunState } from '../engine/schema';

const PROFILE_ID = 'traveler';

/** Minimal in-memory localStorage — this suite runs under vitest's `node`
 * environment (no DOM), so the real `LocalSaveStore` has nothing to read/write
 * against unless we supply one. Swapped in fresh before each test. */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear(): void {
    this.map.clear();
  }
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = new MemoryStorage();
});

/** A run "sitting" mid-room in a specific act/room, the shape every part of
 * the game persists in — used to build one representative RunState per
 * region of the game (prologue, each act, a secret room, the understory,
 * the final gate), so the round-trip is checked from everywhere a player can
 * actually be when they save. */
function runAt(overrides: Partial<RunState>): RunState {
  return { ...newRun(1), currentStage: 0, ...overrides };
}

const REPRESENTATIVE_RUNS: [string, RunState][] = [
  ['prologue', runAt({ act: 0, currentRoom: 'waiting-room' })],
  ['act I, mid-room', runAt({ act: 1, currentRoom: 'wallet', currentStage: 1, hearts: 3, lucidity: 12 })],
  [
    'act II, with a keepsake held and a heart already spent',
    runAt({ act: 2, currentRoom: 'casino-pascal', currentStage: 0, hearts: 2, lucidity: 40, keepsakesHeld: ['casino-chip'] }),
  ],
  ['act III, mid-room', runAt({ act: 3, currentRoom: 'editor', currentStage: 0, lucidity: 55, flags: ['saved-photo'] })],
  ['act III, a secret room', runAt({ act: 3, currentRoom: 'introduction', currentStage: 0, lucidity: 110 })],
  ['the understory (Act V descent)', runAt({ act: 4, currentRoom: 'the-archive', currentStage: 0, descended: true })],
  [
    'act IV, the final gate, eligible for the hidden ending',
    runAt({ act: 4, currentRoom: 'door-that-asks', currentStage: 1, lucidity: 150, anamnesisEligible: true }),
  ],
  ['between rooms (doors being offered, no currentRoom)', runAt({ act: 2, currentRoom: null, currentStage: 0 })],
];

describe('LocalSaveStore round-trip — every part of the game (regression for the mid-run-lost-on-continue report)', () => {
  it.each(REPRESENTATIVE_RUNS)('a run saved from %s resumes with an identical RunState', async (_label, run) => {
    const store: SaveStore = new LocalSaveStore();
    const profile: Profile = { ...defaultProfile(), run };
    await store.save(PROFILE_ID, profile);
    const loaded = await store.load(PROFILE_ID);
    expect(loaded.run).toEqual(run);
  });

  it('a finished run is still round-tripped verbatim by the store itself (Game.persist is what nulls it, not the store)', async () => {
    const store: SaveStore = new LocalSaveStore();
    const finished = runAt({ act: 4, currentRoom: null, finished: true, endingId: 'return' });
    const profile: Profile = { ...defaultProfile(), run: finished };
    await store.save(PROFILE_ID, profile);
    const loaded = await store.load(PROFILE_ID);
    expect(loaded.run).toEqual(finished);
  });

  it('a profile with no run at all loads back with run: null (fresh title screen)', async () => {
    const store: SaveStore = new LocalSaveStore();
    await store.save(PROFILE_ID, defaultProfile());
    const loaded = await store.load(PROFILE_ID);
    expect(loaded.run).toBeNull();
  });
});

describe('the exact reported scenario — HUD language switch mid-run, then "Save & exit to title" (Milestone 5 regression)', () => {
  it('switching language via the HUD (settings only) does not touch the in-progress run', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 3, currentRoom: 'editor', currentStage: 0, lucidity: 30 });
    let profile: Profile = { ...defaultProfile(), run };

    // 1) HUD language switch mid-game: only `settings.language` changes, `run` is untouched.
    profile = { ...profile, settings: { ...profile.settings, language: 'cs' } };
    await store.save(PROFILE_ID, profile);

    // 2) "Save & exit to title" from the pause menu: same run, re-saved.
    await store.save(PROFILE_ID, profile);

    // 3) reload — a fresh store instance loads whatever was last written.
    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(run);
    expect(reloaded.settings.language).toBe('cs');
  });

  it('the title screen "Continue the journey" resolution never substitutes a fresh run when profile.run is a live, unfinished run', () => {
    const run = runAt({ act: 3, currentRoom: 'editor', currentStage: 2, lucidity: 30 });
    const profile: Profile = { ...defaultProfile(), run };
    // mirrors flow.ts's start(): `action === 'continue' && this.profile.run ? this.profile.run : newRun(...)`
    const resolvedOnContinue = profile.run ? profile.run : newRun();
    expect(resolvedOnContinue).toBe(run);
    expect(resolvedOnContinue.act).toBe(3);
    expect(resolvedOnContinue.currentRoom).toBe('editor');
  });

  it('the "Continue the journey" button itself is only offered while profile.run is unfinished', () => {
    const unfinished = runAt({ act: 3, currentRoom: 'editor' });
    const finished = runAt({ act: 4, currentRoom: null, finished: true, endingId: 'return' });
    // mirrors overlays.ts's showTitle: `profile.run && !profile.run.finished`
    const offersContinue = (run: RunState | null) => Boolean(run && !run.finished);
    expect(offersContinue(unfinished)).toBe(true);
    expect(offersContinue(finished)).toBe(false);
    expect(offersContinue(null)).toBe(false);
  });
});

describe('persist() write ordering — the fix for a fire-and-forget save racing an awaited one', () => {
  /** A store whose writes can be artificially delayed, standing in for a
   * hypothetically slower-than-localStorage backend (the SaveStore interface
   * is explicitly written to allow one — see saveStore.ts). Records the order
   * writes actually land in. */
  class DelayableStore implements SaveStore {
    written: string[] = [];
    nextDelayMs = 0;
    async load(): Promise<Profile> {
      throw new Error('unused in this suite');
    }
    async save(_profileId: string, profile: Profile): Promise<void> {
      const delay = this.nextDelayMs;
      this.nextDelayMs = 0;
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      written.call(this, profile);
    }
  }
  function written(this: DelayableStore, profile: Profile) {
    this.written.push(profile.run?.currentRoom ?? 'null');
  }

  /** Mirrors Game's `persistChain` field/pattern in flow.ts — every persist()
   * call chains its write onto the previous one, so calls always land in the
   * store in call order regardless of how slow any individual write is, and
   * regardless of whether the caller awaits the call it fired. */
  function makeChainedPersist(store: SaveStore) {
    let chain: Promise<void> = Promise.resolve();
    return (profile: Profile) => {
      chain = chain.then(() => store.save(PROFILE_ID, profile));
      return chain;
    };
  }

  it('without chaining, an unawaited slow write can land after a later fast one (the bug this pattern prevents)', async () => {
    const store = new DelayableStore();
    const languageSwitchProfile: Profile = { ...defaultProfile(), run: runAt({ act: 3, currentRoom: 'editor' }) };
    const saveAndExitProfile: Profile = { ...defaultProfile(), run: runAt({ act: 3, currentRoom: 'introduction' }) };

    store.nextDelayMs = 50;
    const firstWrite = store.save(PROFILE_ID, languageSwitchProfile); // fired but NOT awaited, like the HUD callback
    await store.save(PROFILE_ID, saveAndExitProfile); // awaited immediately after, like "Save & exit to title"
    await firstWrite; // let the slow one finish so both are recorded before asserting

    // the slow (first-fired) write lands LAST — the store now disagrees with call
    // order, and a subsequent load() would return the stale "editor" run.
    expect(store.written).toEqual(['introduction', 'editor']);
  });

  it('with the persistChain pattern, writes always land in call order even when the first is slower', async () => {
    const store = new DelayableStore();
    const persist = makeChainedPersist(store);
    const langSwitch: Profile = { ...defaultProfile(), run: runAt({ act: 3, currentRoom: 'editor', lucidity: 1 }) };
    const saveAndExit: Profile = { ...defaultProfile(), run: runAt({ act: 3, currentRoom: 'introduction', lucidity: 2 }) };

    store.nextDelayMs = 50;
    const firstCall = persist(langSwitch); // fired without awaiting, mirroring the HUD path
    const secondCall = persist(saveAndExit); // fired immediately after, mirroring "Save & exit to title"
    await secondCall;
    await firstCall;

    expect(store.written).toEqual(['editor', 'introduction']);
  });
});
