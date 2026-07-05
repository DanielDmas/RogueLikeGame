import { describe, expect, it } from 'vitest';
import { migrateSettings } from '../engine/localSave';
import { defaultProfile } from '../engine/saveStore';

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
