import { describe, expect, it, beforeEach } from 'vitest';
import { newRun } from '../engine/gameState';
import { defaultProfile, type Profile, type SaveStore } from '../engine/saveStore';
import { LocalSaveStore } from '../engine/localSave';
import type { RunState } from '../engine/schema';

const PROFILE_ID = 'traveler';

/** Minimal in-memory localStorage — mirrors saveRoundTrip.test.ts's polyfill,
 * duplicated here so this file's scenarios are self-contained. */
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

function runAt(overrides: Partial<RunState>): RunState {
  return { ...newRun(1), currentStage: 0, ...overrides };
}

/** Mirrors Game.persist() (flow.ts): `profile.run = state.finished ? null : state`, then save. */
async function persist(store: SaveStore, profile: Profile, state: RunState): Promise<Profile> {
  const next: Profile = { ...profile, run: state.finished ? null : state };
  await store.save(PROFILE_ID, next);
  return next;
}

/** Mirrors flow.ts's start(): `action === 'continue' && profile.run ? profile.run : newRun(...)`. */
function resolveContinue(profile: Profile): RunState {
  return profile.run ? profile.run : newRun();
}

/** Mirrors overlays.ts's showTitle: only offer Continue for a live, unfinished run. */
function offersContinue(profile: Profile): boolean {
  return Boolean(profile.run && !profile.run.finished);
}

describe('continuing/discontinuing from every meaningful point in the game (Milestone 5 save audit)', () => {
  const SCENARIOS: [string, RunState][] = [
    ['the prologue, before any choice', runAt({ act: 0, currentRoom: 'waiting-room', currentStage: 0 })],
    ['act I, one heart already lost', runAt({ act: 1, currentRoom: 'quiet-alarm', hearts: 2, lucidity: 12 })],
    [
      'act II, several rooms into a real transcript',
      runAt({
        act: 2,
        currentRoom: 'casino-pascal',
        lucidity: 60,
        visited: ['waiting-room', 'wallet', 'photograph', 'junction'],
        transcript: [
          { roomId: 'wallet', stageIndex: 0, choiceId: 'return-all', choiceText: 'x' },
          { roomId: 'junction', stageIndex: 0, choiceId: 'pulled-lever', choiceText: 'y' },
        ],
      }),
    ],
    ['act III, one heart from dissolution', runAt({ act: 3, currentRoom: 'debt-of-dead', hearts: 1, lucidity: 30 })],
    ['act III secret room', runAt({ act: 3, currentRoom: 'introduction', lucidity: 110 })],
    ['the understory (descended mid-Act-IV)', runAt({ act: 4, currentRoom: 'the-unchosen', descended: true })],
    [
      'act IV, final gate, eligible for the hidden ending',
      runAt({ act: 4, currentRoom: 'door-that-asks', currentStage: 1, lucidity: 150, anamnesisEligible: true }),
    ],
    ['between rooms — doors being offered, no currentRoom', runAt({ act: 2, currentRoom: null })],
    [
      'the Examined Path, mid-run, holding two keepsakes',
      runAt({ act: 2, currentRoom: 'newcomb-annex', examined: true, keepsakesHeld: ['casino-chip', 'photo-corner'] }),
    ],
    ['a legacy save with no currentStage/doorSeed/examined fields at all', (() => {
      const s = runAt({ act: 1, currentRoom: 'wallet' }) as Partial<RunState>;
      delete s.currentStage;
      delete s.doorSeed;
      delete s.examined;
      return s as RunState;
    })()],
  ];

  it.each(SCENARIOS)('save from "%s" resumes with an identical RunState via Continue', async (_label, state) => {
    const store: SaveStore = new LocalSaveStore();
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = await persist(store, profile, state);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(offersContinue(reloaded)).toBe(true);
    const resumed = resolveContinue(reloaded);
    expect(resumed).toEqual(state);
  });

  it('a finished run never offers Continue, and resolving it builds a fresh run instead', async () => {
    const store: SaveStore = new LocalSaveStore();
    const finished = runAt({ act: 4, currentRoom: null, finished: true, endingId: 'return' });
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = await persist(store, profile, finished);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toBeNull(); // persist() already nulled it
    expect(offersContinue(reloaded)).toBe(false);
    const resolved = resolveContinue(reloaded);
    expect(resolved.act).toBe(0); // a genuinely fresh run, not the finished one
    expect(resolved.finished).toBe(false);
  });
});

describe('language/settings changes never corrupt or hide an in-progress run (Milestone 5 save audit)', () => {
  it('an in-HUD language switch mid-run, then Save & exit, then Continue: the run is untouched', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 3, currentRoom: 'marys-room', lucidity: 45 });
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = await persist(store, profile, run);

    // HUD language switch: only settings.language changes (flow.ts's onLanguageChange callback)
    profile = { ...profile, settings: { ...profile.settings, language: 'cs' } };
    await store.save(PROFILE_ID, profile);
    // "Save & exit to title": persist() re-derives run from current state (unchanged) and saves again
    profile = await persist(store, profile, run);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(run);
    expect(reloaded.settings.language).toBe('cs');
    expect(offersContinue(reloaded)).toBe(true);
  });

  it('opening Settings and changing several unrelated options mid-run leaves the run untouched', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 2, currentRoom: 'omelas', lucidity: 20 });
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = await persist(store, profile, run);

    // showSettings returns a whole new Settings object; flow.ts assigns it wholesale, run is a separate field
    profile = {
      ...profile,
      settings: {
        ...profile.settings,
        renderScale: 'sharp',
        quality: 'low',
        musicVolume: 0.2,
        highContrast: true,
        examinedPathDefault: true,
      },
    };
    await store.save(PROFILE_ID, profile);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(run);
    expect(reloaded.settings.renderScale).toBe('sharp');
    expect(reloaded.settings.quality).toBe('low');
    expect(reloaded.settings.examinedPathDefault).toBe(true);
  });

  it('opening Settings and changing NOTHING (just clicking Done) is a safe no-op for the run', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 1, currentRoom: 'promotion' });
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = await persist(store, profile, run);
    const before = await new LocalSaveStore().load(PROFILE_ID);

    // Settings panel returns a shallow copy identical in value; flow.ts persists it anyway (toast shown)
    profile = { ...profile, settings: { ...profile.settings } };
    await store.save(PROFILE_ID, profile);

    const after = await new LocalSaveStore().load(PROFILE_ID);
    expect(after.run).toEqual(before.run);
    expect(after.settings).toEqual(before.settings);
  });

  it('a sequence of five interleaved language/settings/save actions still ends with the correct run and settings', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 3, currentRoom: 'swampman', lucidity: 70 });
    let profile: Profile = { ...defaultProfile(), run: null };

    profile = await persist(store, profile, run); // 1. enter the room, autosave
    profile = { ...profile, settings: { ...profile.settings, language: 'fa' } }; // 2. HUD language switch
    await store.save(PROFILE_ID, profile);
    profile = { ...profile, settings: { ...profile.settings, language: 'cs' } }; // 3. switch again, cs this time
    await store.save(PROFILE_ID, profile);
    profile = { ...profile, settings: { ...profile.settings, renderScale: 'performance' } }; // 4. Settings panel edit
    await store.save(PROFILE_ID, profile);
    profile = await persist(store, profile, run); // 5. Save & exit to title

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(run);
    expect(reloaded.settings.language).toBe('cs');
    expect(reloaded.settings.renderScale).toBe('performance');
    expect(offersContinue(reloaded)).toBe(true);
  });
});

describe('"Walk again" after an ending: profile history carries over, the run itself is fresh (Milestone 5 save audit)', () => {
  it('profile-level history (keepsakes, codex, endings, runsCompleted) survives into the next run untouched', async () => {
    const store: SaveStore = new LocalSaveStore();
    const finishedRun = runAt({ act: 4, currentRoom: null, finished: true, endingId: 'gardener', transcript: [
      { roomId: 'wallet', stageIndex: 0, choiceId: 'keep-it', choiceText: 'x' },
    ] });
    let profile: Profile = {
      ...defaultProfile(),
      codexUnlocked: ['wallet', 'ending:gardener'],
      keepsakes: ['casino-chip'],
      keepsakeChoicesTaken: ['bet-against'],
      runsCompleted: 3,
    };
    // playEnding() persists the finished run, then stamps lastRun* fields
    profile = await persist(store, profile, finishedRun);
    profile = { ...profile, lastRunTranscript: finishedRun.transcript, lastRunEndingId: 'gardener', runsCompleted: 4 };
    await store.save(PROFILE_ID, profile);

    // "Walk again": a brand-new run, but priorFromProfile()/keepsakesFromProfile() mirror profile state into it
    const prior = { runs: profile.runsCompleted, endingId: profile.lastRunEndingId ?? null, transcript: profile.lastRunTranscript ?? [] };
    const nextRun = newRun(undefined, prior, [...profile.keepsakes], true);
    profile = await persist(store, profile, nextRun);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.codexUnlocked).toEqual(['wallet', 'ending:gardener']); // untouched by the new run
    expect(reloaded.keepsakes).toEqual(['casino-chip']); // untouched
    expect(reloaded.keepsakeChoicesTaken).toEqual(['bet-against']); // untouched
    expect(reloaded.runsCompleted).toBe(4); // untouched by the new run itself
    expect(reloaded.run?.finished).toBe(false); // the new run is genuinely fresh
    expect(reloaded.run?.hearts).toBe(3);
    expect(reloaded.run?.transcript).toEqual([]);
    expect(reloaded.run?.prior?.runs).toBe(4); // but it correctly remembers the just-finished run
    expect(reloaded.run?.keepsakesHeld).toEqual(['casino-chip']);
    expect(reloaded.run?.examined).toBe(true); // the fresh opt-in choice was stamped
  });
});

describe('Reset run / Reset all progress correctly change what Continue offers (Milestone 5 save audit)', () => {
  it('Reset run: profile.run becomes null, Continue disappears, everything else survives', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 2, currentRoom: 'chinese-room', lucidity: 40 });
    let profile: Profile = { ...defaultProfile(), codexUnlocked: ['wallet'], runsCompleted: 2 };
    profile = await persist(store, profile, run);
    expect(offersContinue(await new LocalSaveStore().load(PROFILE_ID))).toBe(true);

    // mirrors Game.resetRun()
    profile = { ...profile, run: null };
    await store.save(PROFILE_ID, profile);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toBeNull();
    expect(offersContinue(reloaded)).toBe(false);
    expect(reloaded.codexUnlocked).toEqual(['wallet']); // field notes survive a run reset
    expect(reloaded.runsCompleted).toBe(2);
  });

  it('Reset all progress: everything, including the run, goes back to defaults', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 3, currentRoom: 'debt-of-dead' });
    let profile: Profile = {
      ...defaultProfile(),
      codexUnlocked: ['wallet', 'promotion'],
      keepsakes: ['casino-chip'],
      runsCompleted: 5,
      settings: { ...defaultProfile().settings, language: 'fa', renderScale: 'sharp' },
    };
    profile = await persist(store, profile, run);

    // mirrors Game.resetProgress()
    await store.save(PROFILE_ID, defaultProfile());

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded).toEqual(defaultProfile());
    expect(offersContinue(reloaded)).toBe(false);
  });
});

describe('the Save button/action itself always writes correctly, regardless of what changed alongside it', () => {
  const PATCHES: [string, { settings?: Partial<Profile['settings']>; persona?: Profile['persona'] }][] = [
    ['nothing but the run', {}],
    ['a language change', { settings: { language: 'cs' } }],
    ['a persona edit', { persona: { preset: 'daniel', name: 'D.', blurb: 'x' } }],
    ['an examinedPathDefault flip', { settings: { examinedPathDefault: true } }],
  ];

  it.each(PATCHES)('persisting with %s alongside still writes a load-bearing, resumable run', async (_label, patch) => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 1, currentRoom: 'the-reference', lucidity: 15 });
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = {
      ...profile,
      ...(patch.persona ? { persona: patch.persona } : {}),
      settings: patch.settings ? { ...profile.settings, ...patch.settings } : profile.settings,
    };
    profile = await persist(store, profile, run);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(run);
    expect(offersContinue(reloaded)).toBe(true);
  });

  it('calling persist() twice in a row with the same state is idempotent', async () => {
    const store: SaveStore = new LocalSaveStore();
    const run = runAt({ act: 2, currentRoom: 'veil-of-ignorance' });
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = await persist(store, profile, run);
    profile = await persist(store, profile, run);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(run);
  });
});

describe('persist() must never manufacture a phantom run before a run actually starts (regression)', () => {
  // this.state defaults to a placeholder newRun() at Game construction time,
  // long before inGame is ever true — persist() calls made during the title
  // flow (persona pick, Settings edits, the auto-shown "Before you begin")
  // must not stamp that placeholder onto profile.run, or the title screen
  // would wrongly offer "Continue the journey" to someone who never played.
  /** Mirrors Game.persist()'s actual guarded formula (flow.ts). */
  async function persistGuarded(store: SaveStore, profile: Profile, state: RunState, inGame: boolean): Promise<Profile> {
    const next: Profile = inGame ? { ...profile, run: state.finished ? null : state } : profile;
    await store.save(PROFILE_ID, next);
    return next;
  }

  it('persisting a persona edit before any run starts leaves profile.run untouched (null)', async () => {
    const store: SaveStore = new LocalSaveStore();
    let profile: Profile = { ...defaultProfile(), run: null };
    const placeholderState = newRun(); // the class-field default, never actually played
    profile = { ...profile, persona: { preset: 'daniel', name: 'D.', blurb: '' } };
    profile = await persistGuarded(store, profile, placeholderState, false);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toBeNull();
    expect(offersContinue(reloaded)).toBe(false);
  });

  it('persisting the auto-shown "Before you begin" flag before any run starts leaves profile.run untouched', async () => {
    const store: SaveStore = new LocalSaveStore();
    let profile: Profile = { ...defaultProfile(), run: null };
    profile = { ...profile, hasSeenAbout: true };
    profile = await persistGuarded(store, profile, newRun(), false);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toBeNull();
    expect(reloaded.hasSeenAbout).toBe(true); // the actual intended change did land
  });

  it('once the real run begins (inGame true), persist() correctly stamps profile.run', async () => {
    const store: SaveStore = new LocalSaveStore();
    let profile: Profile = { ...defaultProfile(), run: null };
    const realRun = runAt({ act: 1, currentRoom: 'wallet' });
    profile = await persistGuarded(store, profile, realRun, true);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(realRun);
    expect(offersContinue(reloaded)).toBe(true);
  });

  it('settings edits made mid-run (inGame true) still correctly update the resumable run', async () => {
    const store: SaveStore = new LocalSaveStore();
    let profile: Profile = { ...defaultProfile(), run: null };
    const realRun = runAt({ act: 2, currentRoom: 'omelas' });
    profile = await persistGuarded(store, profile, realRun, true);
    profile = { ...profile, settings: { ...profile.settings, quality: 'low' } };
    profile = await persistGuarded(store, profile, realRun, true);

    const reloaded = await new LocalSaveStore().load(PROFILE_ID);
    expect(reloaded.run).toEqual(realRun);
    expect(reloaded.settings.quality).toBe('low');
  });
});
