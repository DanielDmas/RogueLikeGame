import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { buildTheme, corridorTheme, spillColorFor, MOOD_TINTS, FOG_COLOR_BY_THEME, type ThemeId } from '../scene/themes';
import { limerenceBuildTheme, LIMERENCE_FOG_COLOR_BY_THEME, LIMERENCE_MOOD_TINTS } from '../packs/limerence/theme';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';

const ALL_THEME_IDS: ThemeId[] = [0, 1, 2, 3, 4, 5];

function disposeGroup(group: THREE.Group) {
  group.traverse((o) => {
    if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
      o.geometry?.dispose();
      const mat = o.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    }
  });
}

describe('corridorTheme — parameterization is behavior-neutral for its existing callers', () => {
  it('corridorTheme(warmth) with no palette override matches the original hardcoded values exactly', () => {
    const theme = corridorTheme(0x8a6a3a);
    expect(theme.fogColor).toBe(0x322a1d);
    expect(theme.background).toBe(0x322a1d);
    expect(theme.fogDensity).toBe(0.036);
    disposeGroup(theme.group);
  });

  it('buildTheme(0) and buildTheme(1) (ANAMNESIS acts 0/1, both corridorTheme calls) are unchanged', () => {
    const t0 = buildTheme(0);
    const t1 = buildTheme(1);
    expect(t0.fogColor).toBe(0x322a1d);
    expect(t1.fogColor).toBe(0x322a1d);
    disposeGroup(t0.group);
    disposeGroup(t1.group);
  });

  it('a full palette override actually changes fog/background/floor colors', () => {
    const custom = corridorTheme(0x111111, { fog: 0xabcdef, floorColor: 0x123456, wallColor: 0x654321 });
    expect(custom.fogColor).toBe(0xabcdef);
    expect(custom.background).toBe(0xabcdef);
    disposeGroup(custom.group);
  });

  it('a partial palette override only changes the given fields, defaults hold for the rest', () => {
    const custom = corridorTheme(0x111111, { fog: 0xabcdef });
    // fogColor overridden...
    expect(custom.fogColor).toBe(0xabcdef);
    // ...but the group still contains the default wall color somewhere (floor untouched)
    let foundDefaultFloor = false;
    custom.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.material.color.getHex() === 0x201c16) {
        foundDefaultFloor = true;
      }
    });
    expect(foundDefaultFloor).toBe(true);
    disposeGroup(custom.group);
  });
});

describe('spillColorFor — pack-parameterized, defaults to ANAMNESIS', () => {
  it('a DILEMMA room (no tint of its own) falls back to the next act’s fog color, using ANAMNESIS defaults when no args given', () => {
    expect(spillColorFor('DILEMMA', 1)).toBe(FOG_COLOR_BY_THEME[1]);
  });

  it('an INSIGHT room uses its own mood tint regardless of act, with default mood tints', () => {
    expect(spillColorFor('INSIGHT', 2)).toBe(MOOD_TINTS.INSIGHT.tint);
  });

  it('passing LIMERENCE’s own moodTints/fogColors changes the result', () => {
    const anamnesisResult = spillColorFor('DILEMMA', 1);
    const limerenceResult = spillColorFor('DILEMMA', 1, LIMERENCE_MOOD_TINTS, LIMERENCE_FOG_COLOR_BY_THEME);
    expect(limerenceResult).not.toBe(anamnesisResult);
    expect(limerenceResult).toBe(LIMERENCE_FOG_COLOR_BY_THEME[1]);
  });
});

describe('LIMERENCE theme — distinct from ANAMNESIS, internally consistent', () => {
  it('every theme id 0-5 builds without throwing and disposes cleanly', () => {
    for (const id of ALL_THEME_IDS) {
      const theme = limerenceBuildTheme(id);
      expect(theme.group).toBeInstanceOf(THREE.Group);
      expect(typeof theme.tick).toBe('function');
      expect(() => theme.tick(1.23)).not.toThrow();
      disposeGroup(theme.group);
    }
  });

  it('fogColorByTheme matches what buildTheme actually returns, for every theme id', () => {
    for (const id of ALL_THEME_IDS) {
      const theme = limerenceBuildTheme(id);
      expect(LIMERENCE_FOG_COLOR_BY_THEME[id], `theme ${id} fogColorByTheme out of sync with buildTheme`).toBe(theme.fogColor);
      disposeGroup(theme.group);
    }
  });

  it('every LIMERENCE floor (0-3) uses a genuinely different fog color from every ANAMNESIS floor', () => {
    for (const id of [0, 1, 2, 3] as const) {
      const limerenceColor = LIMERENCE_FOG_COLOR_BY_THEME[id];
      const anamnesisColor = FOG_COLOR_BY_THEME[id];
      expect(limerenceColor, `theme ${id} collides with ANAMNESIS's fog color`).not.toBe(anamnesisColor);
    }
  });

  it('LIMERENCE mood tints are defined for every MoodType and differ from ANAMNESIS’s where non-neutral', () => {
    expect(LIMERENCE_MOOD_TINTS.DILEMMA.tint).toBe(0); // the neutral case stays neutral in both
    expect(LIMERENCE_MOOD_TINTS.INSIGHT.tint).not.toBe(MOOD_TINTS.INSIGHT.tint);
    expect(LIMERENCE_MOOD_TINTS.DOOMED.tint).not.toBe(MOOD_TINTS.DOOMED.tint);
  });
});

describe.each([
  { name: 'anamnesis', pack: anamnesisPack as ContentPack },
  { name: 'limerence', pack: limerencePack as ContentPack },
])('pack.visuals — structural consistency ($name)', ({ pack }) => {
  it('buildTheme(id).fogColor matches fogColorByTheme[id] for every theme id', () => {
    for (const id of ALL_THEME_IDS) {
      const theme = pack.visuals.buildTheme(id, 'high');
      expect(pack.visuals.fogColorByTheme[id]).toBe(theme.fogColor);
      disposeGroup(theme.group);
    }
  });

  it('every MoodType has a moodTints entry', () => {
    for (const type of ['DILEMMA', 'INSIGHT', 'NO-SOLUTION', 'DOOMED'] as const) {
      expect(pack.visuals.moodTints[type]).toBeDefined();
    }
  });
});
