import { describe, expect, it } from 'vitest';
import { migrateSettings } from '../engine/localSave';
import { defaultProfile, shouldGrandfatherHasSeenAbout } from '../engine/saveStore';
import { newRun } from '../engine/gameState';

describe('settings migration — old single "sound" toggle splits into music + sfx', () => {
  const base = defaultProfile().settings;

  it('a legacy save with sound:true yields both music and sfx enabled', () => {
    const migrated = migrateSettings({ sound: true } as never, base);
    expect(migrated.music).toBe(true);
    expect(migrated.sfx).toBe(true);
  });

  it('a legacy save with sound:false yields both music and sfx disabled', () => {
    const migrated = migrateSettings({ sound: false } as never, base);
    expect(migrated.music).toBe(false);
    expect(migrated.sfx).toBe(false);
  });

  it('a fresh save with no settings at all falls back to defaults', () => {
    const migrated = migrateSettings(undefined, base);
    expect(migrated).toEqual(base);
  });

  it('a save that already has the new music/sfx fields is left alone (no legacy field present)', () => {
    const migrated = migrateSettings({ music: false, sfx: true }, base);
    expect(migrated.music).toBe(false);
    expect(migrated.sfx).toBe(true);
  });

  it('other settings fields survive the migration untouched', () => {
    const migrated = migrateSettings({ sound: true, highContrast: true } as never, base);
    expect(migrated.highContrast).toBe(true);
    expect(migrated.typewriter).toBe(base.typewriter);
  });

  it('the migrated settings object never carries a stray "sound" key', () => {
    const migrated = migrateSettings({ sound: true } as never, base);
    expect('sound' in migrated).toBe(false);
  });
});

describe('default profile — new fields have sensible defaults', () => {
  it('music, sfx default on; textVersion defaults to v2; language defaults to English', () => {
    const s = defaultProfile().settings;
    expect(s.music).toBe(true);
    expect(s.sfx).toBe(true);
    expect(s.textVersion).toBe('v2');
    expect(s.language).toBe('en');
  });

  it('musicVolume/sfxVolume default to a sensible non-zero level, and dynamicScenery defaults off', () => {
    const s = defaultProfile().settings;
    expect(s.musicVolume).toBeGreaterThan(0);
    expect(s.musicVolume).toBeLessThanOrEqual(1);
    expect(s.sfxVolume).toBeGreaterThan(0);
    expect(s.sfxVolume).toBeLessThanOrEqual(1);
    expect(s.dynamicScenery).toBe(false);
  });
});

describe('settings migration — old saves missing volume/dynamicScenery fields backfill from defaults', () => {
  const base = defaultProfile().settings;

  it('a save from before volume sliders existed gets default volumes, not undefined', () => {
    const legacy = { music: true, sfx: false, textVersion: 'v2', language: 'en' } as never;
    const migrated = migrateSettings(legacy, base);
    expect(migrated.musicVolume).toBe(base.musicVolume);
    expect(migrated.sfxVolume).toBe(base.sfxVolume);
    expect(migrated.dynamicScenery).toBe(base.dynamicScenery);
    // and the fields it did carry are preserved
    expect(migrated.music).toBe(true);
    expect(migrated.sfx).toBe(false);
  });
});

describe('hasSeenHeartLoss — first-heart-loss one-time moment (Phase G3)', () => {
  it('defaults to false for a fresh profile', () => {
    expect(defaultProfile().hasSeenHeartLoss).toBe(false);
  });

  it('a legacy save (field never existed) backfills to false via plain object-spread merge', () => {
    // mirrors LocalSaveStore.load's `{ ...base, ...parsed }` merge, using a
    // profile-shaped object with no hasSeenHeartLoss key at all
    const legacyParsed = { runsCompleted: 3 };
    const merged = { ...defaultProfile(), ...legacyParsed };
    expect(merged.hasSeenHeartLoss).toBe(false);
  });

  it('an already-true value survives the same merge (never re-shown after the first time)', () => {
    const parsed = { hasSeenHeartLoss: true };
    const merged = { ...defaultProfile(), ...parsed };
    expect(merged.hasSeenHeartLoss).toBe(true);
  });
});

describe('render scale + UI zoom — defaults and migration (Milestone 4)', () => {
  const base = defaultProfile().settings;

  it('renderScale defaults to standard, uiZoom defaults to 1 (100%)', () => {
    expect(base.renderScale).toBe('standard');
    expect(base.uiZoom).toBe(1);
  });

  it('a save from before renderScale/uiZoom existed backfills both from defaults', () => {
    const legacy = { music: true, sfx: true } as never;
    const migrated = migrateSettings(legacy, base);
    expect(migrated.renderScale).toBe('standard');
    expect(migrated.uiZoom).toBe(1);
  });

  it('an existing renderScale/uiZoom choice survives migration untouched', () => {
    const saved = { renderScale: 'sharp', uiZoom: 1.2 } as never;
    const migrated = migrateSettings(saved, base);
    expect(migrated.renderScale).toBe('sharp');
    expect(migrated.uiZoom).toBe(1.2);
  });
});

describe('shouldGrandfatherHasSeenAbout — the auto-shown "Before you begin" explainer never ambushes a returning player', () => {
  it('a genuinely fresh profile (no history at all) is NOT grandfathered — the auto-show fires', () => {
    expect(shouldGrandfatherHasSeenAbout({})).toBe(false);
  });

  it('a save that already stamped hasSeenAbout is left alone, whatever its value', () => {
    expect(shouldGrandfatherHasSeenAbout({ hasSeenAbout: false })).toBe(false);
    expect(shouldGrandfatherHasSeenAbout({ hasSeenAbout: true })).toBe(false);
  });

  it('a legacy save with an in-progress run is grandfathered (they have clearly already begun)', () => {
    expect(shouldGrandfatherHasSeenAbout({ run: newRun() })).toBe(true);
  });

  it('a legacy save with at least one completed run is grandfathered', () => {
    expect(shouldGrandfatherHasSeenAbout({ runsCompleted: 1 })).toBe(true);
  });

  it('a legacy save with any unlocked field note is grandfathered', () => {
    expect(shouldGrandfatherHasSeenAbout({ codexUnlocked: ['wallet'] })).toBe(true);
  });

  it('a legacy save with a chosen persona name is grandfathered', () => {
    expect(shouldGrandfatherHasSeenAbout({ persona: { name: 'Traveler' } })).toBe(true);
  });

  it('a legacy save with zero signs of play (runsCompleted: 0, empty codex, no persona, no run) is NOT grandfathered', () => {
    expect(
      shouldGrandfatherHasSeenAbout({ runsCompleted: 0, codexUnlocked: [], persona: { name: '' }, run: null }),
    ).toBe(false);
  });
});
