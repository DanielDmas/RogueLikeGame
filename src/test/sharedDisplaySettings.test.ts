import { describe, expect, it, beforeEach } from 'vitest';
import { defaultProfile } from '../engine/saveStore';
import { readSharedDisplaySettings, writeSharedDisplaySettings, withSharedDisplaySettings } from '../engine/sharedDisplaySettings';

/** Minimal in-memory localStorage — this suite runs under vitest's `node`
 * environment (no DOM), mirroring the pattern in saveRoundTrip.test.ts. */
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

describe('sharedDisplaySettings — the four fields ANAMNESIS and LIMERENCE mirror between each other', () => {
  it('reads null when nothing has ever been written', () => {
    expect(readSharedDisplaySettings()).toBeNull();
  });

  it('round-trips exactly what was written', () => {
    const settings = defaultProfile().settings;
    writeSharedDisplaySettings({ ...settings, quality: 'high', renderScale: 'sharp', uiZoom: 1.15, fpsCap: 60 });
    expect(readSharedDisplaySettings()).toEqual({ quality: 'high', renderScale: 'sharp', uiZoom: 1.15, fpsCap: 60 });
  });

  it('writing only stores the four shared fields, not the rest of Settings', () => {
    const settings = { ...defaultProfile().settings, language: 'cs' as const, music: false };
    writeSharedDisplaySettings(settings);
    const raw = localStorage.getItem('vestibule:sharedDisplaySettings');
    const parsed = JSON.parse(raw!);
    expect(Object.keys(parsed).sort()).toEqual(['fpsCap', 'quality', 'renderScale', 'uiZoom']);
  });

  it('withSharedDisplaySettings overlays the shared subset onto a full Settings object', () => {
    writeSharedDisplaySettings({ ...defaultProfile().settings, quality: 'high', renderScale: 'sharp', uiZoom: 1.2, fpsCap: 60 });
    const packOwnSettings = { ...defaultProfile().settings, language: 'fa' as const };
    const merged = withSharedDisplaySettings(packOwnSettings);
    expect(merged.quality).toBe('high');
    expect(merged.renderScale).toBe('sharp');
    expect(merged.uiZoom).toBe(1.2);
    expect(merged.fpsCap).toBe(60);
    // Everything outside the shared four is left exactly as the pack's own profile had it.
    expect(merged.language).toBe('fa');
  });

  it('withSharedDisplaySettings is a no-op (returns an equivalent object) when nothing has been shared yet', () => {
    const packOwnSettings = defaultProfile().settings;
    expect(withSharedDisplaySettings(packOwnSettings)).toEqual(packOwnSettings);
  });

  it('a corrupted or hand-edited shared value is ignored, not spread onto real settings', () => {
    localStorage.setItem('vestibule:sharedDisplaySettings', JSON.stringify({ quality: 'ultra', renderScale: 'sharp', uiZoom: 1, fpsCap: 60 }));
    expect(readSharedDisplaySettings()).toBeNull();
    const packOwnSettings = defaultProfile().settings;
    expect(withSharedDisplaySettings(packOwnSettings)).toEqual(packOwnSettings);
  });

  it('non-JSON garbage in the key never throws', () => {
    localStorage.setItem('vestibule:sharedDisplaySettings', '{not json');
    expect(() => readSharedDisplaySettings()).not.toThrow();
    expect(readSharedDisplaySettings()).toBeNull();
  });

  it('a second write overwrites the first (last Settings save anywhere wins)', () => {
    writeSharedDisplaySettings({ ...defaultProfile().settings, quality: 'low', fpsCap: 30 });
    writeSharedDisplaySettings({ ...defaultProfile().settings, quality: 'high', fpsCap: 60 });
    const shared = readSharedDisplaySettings();
    expect(shared?.quality).toBe('high');
    expect(shared?.fpsCap).toBe(60);
  });
});
