// LIMERENCE's own 3D scene palette — "The Interval": a hotel at 3 a.m.
// shading toward dawn. Floors 0-3 are `corridorTheme()` calls — the exact
// shared shape ANAMNESIS's Acts 0/1 already use (a hotel floor genuinely
// *is* a corridor of doors) — recolored via `CorridorPalette` and given
// real structural distinctiveness via the engine's standardized fixture
// kit (Phase V1, 2026-07-16): each floor picks fixtures + colors from the
// same reusable toolkit any future content pack gets too, rather than
// forking bespoke per-floor scene-builder code. Floor 4 (Top Floor) reuses
// the shared dawn-gradient shader ANAMNESIS's Act IV already proved out.
// The ending space (5) stays its own small bespoke builder — a single
// near-static beat, not worth generalizing.
import * as THREE from 'three';
import {
  floor,
  particles,
  corridorTheme,
  dawnGradientPlane,
  skylineFixture,
  type ThemeConfig,
  type ThemeId,
  type MoodType,
  type MoodTint,
  type CorridorPalette,
} from '../../scene/themes';

/** Floor 0 — The Front Desk (prologue): dim, sleepy sodium amber. You've
 * just woken up; nothing is bright yet. accentColor: a cool TV-glow blue,
 * as though a set is still on behind one door down the hall. Fixtures: the
 * migrating window, plus the departures board from the creative bible §2
 * ("every guest listed, no checkout times") near the entrance. */
const FRONT_DESK: [number, CorridorPalette] = [
  0x9a6a38,
  {
    fog: 0x1a140f, ambient: 0x3a2c1c, keyLight: 0xd4923f, dustColor: 0xd4923f,
    wallColor: 0x241f18, floorColor: 0x18140f, doorBase: 0x1c1811, accentColor: 0x4a5a72,
    fixtures: [
      { kind: 'endWindow', color: 0x4a5a72 },
      { kind: 'infoPanel', color: 0xd4923f },
    ],
  },
];

/** Floor 1 — The Ground Floor (Act I): warmer, more lived-in amber —
 * school-hallway-at-night energy. accentColor: a teal foreshadowing the
 * Second Floor one flight up. Fixtures: the migrating window, plus a
 * locker-band wall (the school register, made literal). */
const GROUND_FLOOR: [number, CorridorPalette] = [
  0xb3762f,
  {
    fog: 0x241a10, ambient: 0x453422, keyLight: 0xe0995a, dustColor: 0xe0995a,
    wallColor: 0x2c2318, floorColor: 0x1e170f, doorBase: 0x221b12, accentColor: 0x3a6a6a,
    fixtures: [
      { kind: 'endWindow', color: 0x3a6a6a },
      { kind: 'bandedWalls', color: 0xb3762f },
    ],
  },
];

/** Floor 2 — The Second Floor (Act II): corridor teal — city-apartment cool,
 * the creative bible's "corridor teal" made literal. accentColor: one warm
 * ember breaking through the cool register — a door that hasn't gone cold.
 * Fixture: the migrating window only — the floor's own teal-vs-ember accent
 * variety (already in its decorative doors) carries this floor's identity
 * without needing a second structural piece. */
const SECOND_FLOOR: [number, CorridorPalette] = [
  0x4a8a8a,
  {
    fog: 0x122023, ambient: 0x1f3a3a, keyLight: 0x5aa8a8, dustColor: 0x7ac2c2,
    wallColor: 0x1c2b2b, floorColor: 0x121c1c, doorBase: 0x162424, accentColor: 0xb3762f,
    fixtures: [{ kind: 'endWindow', color: 0xb3762f }],
  },
];

/** Floor 3 — The Long-Stay Wing (Act III): a deeper indigo-amber blend —
 * settled-in, both warm and shadowed at once. accentColor: a cold
 * violet-blue, the "long middle"'s undertow beneath the warmth. Fixtures:
 * the migrating window, plus wall sconces — the settled-in floor is the one
 * that's lived a while, so it's the one that earns actual light fixtures. */
const LONG_STAY_WING: [number, CorridorPalette] = [
  0x8a5a6a,
  {
    fog: 0x1c1420, ambient: 0x362438, keyLight: 0xa8708a, dustColor: 0xa8708a,
    wallColor: 0x261d2a, floorColor: 0x18121c, doorBase: 0x1e1622, accentColor: 0x5a4a8a,
    fixtures: [
      { kind: 'endWindow', color: 0x5a4a8a },
      { kind: 'sconces', color: 0xa8708a },
    ],
  },
];

/** Floor 4 — The Top Floor: fog thinning toward morning. Reuses the shared
 * dawn-gradient shader ANAMNESIS's Act IV already proved out (Phase V1),
 * recolored slightly pinker/warmer for "curtain-filtered" hotel dawn rather
 * than ANAMNESIS's open-sky dawn, plus a low skyline silhouette standing in
 * for the city outside. */
function topFloorTheme(quality: 'low' | 'high' = 'high'): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x201a14, 0.85));
  const dawn = dawnGradientPlane([0.62, 0.38, 0.24], [0.32, 0.22, 0.22], [0.06, 0.05, 0.09]);
  dawn.mesh.position.set(0, 12, -55);
  group.add(dawn.mesh);
  const skyline = skylineFixture(0x140f0c);
  skyline.group.position.set(0, 0, 0);
  group.add(skyline.group);
  group.add(new THREE.AmbientLight(0x4a3626, 1.8));
  const sun = new THREE.DirectionalLight(0xe8a862, 2.4);
  sun.position.set(0, 7, -20);
  group.add(sun);
  const motes = particles(quality === 'high' ? 260 : 140, 0xe8b878, 30, 0.04);
  group.add(motes);
  return {
    group, fogColor: 0x281c14, fogDensity: 0.03, background: 0x281c14,
    tick(t) {
      dawn.tick(t);
      motes.rotation.y = t * 0.01;
    },
  };
}

/** Floor 5 — the ending space: the morning after, literally — soft cream
 * light through a hotel curtain, warmer and softer than ANAMNESIS's
 * near-white ending. */
function morningAfterTheme(quality: 'low' | 'high' = 'high'): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x3e372c, 0.9));
  group.add(new THREE.AmbientLight(0xfff0d8, 2.2));
  const sun = new THREE.DirectionalLight(0xffdca8, 2.6);
  sun.position.set(2, 9, 4);
  group.add(sun);
  const motes = particles(quality === 'high' ? 180 : 100, 0xfff2dc, 28, 0.045);
  group.add(motes);
  return {
    group, fogColor: 0xe4d2ae, fogDensity: 0.045, background: 0xe4d2ae,
    tick(t) { motes.rotation.y = t * 0.012; },
  };
}

export function limerenceBuildTheme(id: ThemeId, quality: 'low' | 'high' = 'high', mode: 'dark' | 'light' = 'dark'): ThemeConfig {
  switch (id) {
    case 0: return corridorTheme(...FRONT_DESK, quality, mode);
    case 1: return corridorTheme(...GROUND_FLOOR, quality, mode);
    case 2: return corridorTheme(...SECOND_FLOOR, quality, mode);
    case 3: return corridorTheme(...LONG_STAY_WING, quality, mode);
    case 4: return topFloorTheme(quality);
    case 5: return morningAfterTheme(quality);
  }
}

export const LIMERENCE_FOG_COLOR_BY_THEME: Record<ThemeId, number> = {
  0: FRONT_DESK[1].fog!,
  1: GROUND_FLOOR[1].fog!,
  2: SECOND_FLOOR[1].fog!,
  3: LONG_STAY_WING[1].fog!,
  4: 0x281c14,
  5: 0xe4d2ae,
};

/** Same shape as the engine's own MOOD_TINTS, recolored toward the hotel's
 * amber/teal register — an INSIGHT room warms toward sodium-amber rather
 * than ANAMNESIS's gold; a DOOMED room curdles toward a bruised plum
 * instead of ANAMNESIS's red-black. */
export const LIMERENCE_MOOD_TINTS: Record<MoodType, MoodTint> = {
  DILEMMA: { tint: 0x000000, blend: 0, densityMul: 1 },
  INSIGHT: { tint: 0xe0995a, blend: 0.16, densityMul: 0.85 },
  'NO-SOLUTION': { tint: 0x2f4a4a, blend: 0.16, densityMul: 1.25 },
  DOOMED: { tint: 0x4a1c38, blend: 0.2, densityMul: 1.35 },
};
