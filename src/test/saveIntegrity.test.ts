import { describe, expect, it, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LocalSaveStore } from '../engine/localSave';
import { defaultProfile, hydrateProfile, PROFILE_SCHEMA_VERSION } from '../engine/saveStore';

const PROFILE_ID = 'traveler';
const KEY = `anamnesis:profile:${PROFILE_ID}`;
const BACKUP_KEY = `${KEY}:backup`;

/** Minimal in-memory localStorage — mirrors the pattern in saveRoundTrip.test.ts
 * and saveScenarios.test.ts (vitest's `node` environment has no real one). */
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

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  (globalThis as { localStorage?: Storage }).localStorage = storage;
});

describe('Profile.schemaVersion (Milestone 5, Phase R §R8)', () => {
  it('defaultProfile() stamps the current schema version', () => {
    expect(defaultProfile().schemaVersion).toBe(PROFILE_SCHEMA_VERSION);
  });

  it('load() stamps the current schema version onto a legacy save missing the field', async () => {
    storage.setItem(KEY, JSON.stringify({ runsCompleted: 1 }));
    const profile = await new LocalSaveStore().load(PROFILE_ID);
    expect(profile.schemaVersion).toBe(PROFILE_SCHEMA_VERSION);
  });

  it('save() always writes the current schema version, regardless of what was passed in', async () => {
    const store = new LocalSaveStore();
    const profile = { ...defaultProfile(), schemaVersion: 999 };
    await store.save(PROFILE_ID, profile);
    const raw = storage.getItem(KEY)!;
    expect(JSON.parse(raw).schemaVersion).toBe(PROFILE_SCHEMA_VERSION);
  });
});

describe('real-profile migration fixture (Milestone 5, Phase R §R8)', () => {
  it('a captured v0.1.5-v2-beta profile loads cleanly and backfills every field the current schema expects', async () => {
    const fixturePath = resolve(__dirname, 'fixtures/v0.1.5-v2-beta-profile.json');
    const raw = readFileSync(fixturePath, 'utf-8');
    storage.setItem(KEY, raw);

    const profile = await new LocalSaveStore().load(PROFILE_ID);

    // Backfilled additive fields absent from the old payload.
    expect(profile.schemaVersion).toBe(PROFILE_SCHEMA_VERSION);
    expect(profile.keepsakes).toEqual([]);
    expect(profile.keepsakeChoicesTaken).toEqual([]);
    expect(profile.settings.examinedPathDefault).toBe(false);
    // Legacy single `sound` toggle migrates into split music/sfx.
    expect(profile.settings.music).toBe(true);
    expect(profile.settings.sfx).toBe(true);
    // Prior-play evidence (runsCompleted, codexUnlocked, a chosen persona
    // name) grandfathers hasSeenAbout in, so a returning player is never
    // shown the first-playthrough explainer as if they were new.
    expect(profile.hasSeenAbout).toBe(true);
    // Fields the old payload did have survive untouched.
    expect(profile.runsCompleted).toBe(3);
    expect(profile.persona.name).toBe('Marek');
    expect(profile.codexUnlocked).toContain('door-that-asks');
    expect(profile.lastMessage).toBe("Don't wait. Live. I'll find you where you are.");
  });
});

describe('backup + restore-on-corruption (Milestone 5, Phase R §R8)', () => {
  it('writes a :backup key on every successful load', async () => {
    storage.setItem(KEY, JSON.stringify(defaultProfile()));
    expect(storage.getItem(BACKUP_KEY)).toBeNull();
    await new LocalSaveStore().load(PROFILE_ID);
    expect(storage.getItem(BACKUP_KEY)).not.toBeNull();
  });

  it('restores from the backup when the primary payload fails to parse', async () => {
    const good = { ...defaultProfile(), runsCompleted: 7 };
    storage.setItem(KEY, JSON.stringify(good));
    // First load succeeds and seeds the backup.
    await new LocalSaveStore().load(PROFILE_ID);
    // Now corrupt the primary payload (simulating a truncated write).
    storage.setItem(KEY, '{"runsCompleted": 7, "broken truncated json');

    const store = new LocalSaveStore();
    const profile = await store.load(PROFILE_ID);

    expect(profile.runsCompleted).toBe(7);
    expect(store.wasRestoredFromBackup()).toBe(true);
    // Recovery worked — this is not the silent-wipe path (E3).
    expect(store.wasReset()).toBe(false);
  });

  it('falls back to defaults, quietly, when both the primary and the backup are corrupt', async () => {
    storage.setItem(KEY, '{not json at all');
    storage.setItem(BACKUP_KEY, '{also not json');

    const store = new LocalSaveStore();
    const profile = await store.load(PROFILE_ID);

    expect(profile).toEqual(defaultProfile());
    expect(store.wasRestoredFromBackup()).toBe(false);
  });

  it('does not report a restore when the primary payload loads cleanly', async () => {
    storage.setItem(KEY, JSON.stringify(defaultProfile()));
    const store = new LocalSaveStore();
    await store.load(PROFILE_ID);
    expect(store.wasRestoredFromBackup()).toBe(false);
  });

  it('a missing profile (first-ever boot) is not treated as corruption', async () => {
    const store = new LocalSaveStore();
    const profile = await store.load(PROFILE_ID);
    expect(profile).toEqual(defaultProfile());
    expect(store.wasRestoredFromBackup()).toBe(false);
  });
});

describe('double-corruption reset signal (game-experience review E3, 2026-07-19)', () => {
  it('sets wasReset() when both the primary save and its backup are corrupt', async () => {
    storage.setItem(KEY, '{not json at all');
    storage.setItem(BACKUP_KEY, '{also not json');

    const store = new LocalSaveStore();
    await store.load(PROFILE_ID);

    expect(store.wasReset()).toBe(true);
  });

  it('sets wasReset() when the primary save is corrupt and there is no backup at all', async () => {
    storage.setItem(KEY, '{not json at all');

    const store = new LocalSaveStore();
    await store.load(PROFILE_ID);

    expect(store.wasReset()).toBe(true);
  });

  it('does not set wasReset() on a brand-new profile with no save present', async () => {
    const store = new LocalSaveStore();
    await store.load(PROFILE_ID);
    expect(store.wasReset()).toBe(false);
  });

  it('does not set wasReset() when the primary payload loads cleanly', async () => {
    storage.setItem(KEY, JSON.stringify(defaultProfile()));
    const store = new LocalSaveStore();
    await store.load(PROFILE_ID);
    expect(store.wasReset()).toBe(false);
  });

  it('a fresh load() clears a previous wasReset() flag', async () => {
    storage.setItem(KEY, '{not json at all');
    const store = new LocalSaveStore();
    await store.load(PROFILE_ID);
    expect(store.wasReset()).toBe(true);

    storage.setItem(KEY, JSON.stringify(defaultProfile()));
    storage.removeItem(BACKUP_KEY);
    await store.load(PROFILE_ID);
    expect(store.wasReset()).toBe(false);
  });
});

describe('profile export/import (Milestone 5, Phase R §R9)', () => {
  it('a profile exported as JSON and re-hydrated round-trips its data unchanged', () => {
    const original = { ...defaultProfile(), runsCompleted: 5, persona: { preset: 'wanderer', name: 'Iris', blurb: 'looking' } };
    const exported = JSON.stringify(original, null, 2);
    const reimported = hydrateProfile(JSON.parse(exported));
    expect(reimported).toEqual(original);
  });

  it('importing an older exported profile backfills fields it never had', () => {
    const legacyExport = JSON.stringify({ runsCompleted: 2, settings: { sound: true } });
    const reimported = hydrateProfile(JSON.parse(legacyExport));
    expect(reimported.schemaVersion).toBe(PROFILE_SCHEMA_VERSION);
    expect(reimported.keepsakes).toEqual([]);
    expect(reimported.settings.music).toBe(true);
    expect(reimported.settings.sfx).toBe(true);
    expect(reimported.runsCompleted).toBe(2);
  });

  it('garbage input never reaches hydrateProfile — JSON.parse throws first, which callers must guard', () => {
    expect(() => JSON.parse('not valid json at all')).toThrow();
  });
});
