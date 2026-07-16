// LIMERENCE's own 3D scene palette — "The Interval": a hotel at 3 a.m.
// shading toward dawn. Reuses the engine's corridor-of-doors geometry
// (`corridorTheme`, the exact shape ANAMNESIS's Acts 0/1 already use — a
// hotel floor genuinely *is* a corridor of doors) recolored per floor via
// `CorridorPalette`, plus two small bespoke builders for the Top Floor and
// the ending space. Full bespoke dioramas (two phones on one bed, the
// migrating wall/window, etc. — spec `docs/design-limerence/01-creative-bible.md`)
// are real L5 work; this is the L2-era palette that makes the hotel's five
// floors read as distinct places today.
import * as THREE from 'three';
import {
  floor,
  particles,
  corridorTheme,
  type ThemeConfig,
  type ThemeId,
  type MoodType,
  type MoodTint,
  type CorridorPalette,
} from '../../scene/themes';

/** Floor 0 — The Front Desk (prologue): dim, sleepy sodium amber. You've
 * just woken up; nothing is bright yet. accentColor: a cool TV-glow blue,
 * as though a set is still on behind one door down the hall. */
const FRONT_DESK: [number, CorridorPalette] = [
  0x9a6a38,
  { fog: 0x1a140f, ambient: 0x3a2c1c, keyLight: 0xd4923f, dustColor: 0xd4923f, wallColor: 0x241f18, floorColor: 0x18140f, doorBase: 0x1c1811, accentColor: 0x4a5a72 },
];

/** Floor 1 — The Ground Floor (Act I): warmer, more lived-in amber —
 * school-hallway-at-night energy. accentColor: a teal foreshadowing the
 * Second Floor one flight up. */
const GROUND_FLOOR: [number, CorridorPalette] = [
  0xb3762f,
  { fog: 0x241a10, ambient: 0x453422, keyLight: 0xe0995a, dustColor: 0xe0995a, wallColor: 0x2c2318, floorColor: 0x1e170f, doorBase: 0x221b12, accentColor: 0x3a6a6a },
];

/** Floor 2 — The Second Floor (Act II): corridor teal — city-apartment cool,
 * the creative bible's "corridor teal" made literal. accentColor: one warm
 * ember breaking through the cool register — a door that hasn't gone cold. */
const SECOND_FLOOR: [number, CorridorPalette] = [
  0x4a8a8a,
  { fog: 0x122023, ambient: 0x1f3a3a, keyLight: 0x5aa8a8, dustColor: 0x7ac2c2, wallColor: 0x1c2b2b, floorColor: 0x121c1c, doorBase: 0x162424, accentColor: 0xb3762f },
];

/** Floor 3 — The Long-Stay Wing (Act III): a deeper indigo-amber blend —
 * settled-in, both warm and shadowed at once. accentColor: a cold
 * violet-blue, the "long middle"'s undertow beneath the warmth. */
const LONG_STAY_WING: [number, CorridorPalette] = [
  0x8a5a6a,
  { fog: 0x1c1420, ambient: 0x362438, keyLight: 0xa8708a, dustColor: 0xa8708a, wallColor: 0x261d2a, floorColor: 0x18121c, doorBase: 0x1e1622, accentColor: 0x5a4a8a },
];

/** "The migrating wall/window" (creative bible §8's named signature image):
 * a pane hanging at the corridor's far end — window, or maybe a mirror; the
 * hotel isn't telling — that never sits quite still, drifting a little
 * side to side and breathing in brightness, as though the room behind it
 * keeps almost-arriving. The one genuinely bespoke structural fixture that
 * makes a LIMERENCE floor read as itself rather than ANAMNESIS's corridor
 * recolored — everything else in `corridorTheme` is shared geometry by
 * design (a hotel floor and a facility corridor really are the same shape),
 * but this fixture exists in no ANAMNESIS theme. Cheap: one mesh, no new
 * real-time light (self-lit emissive, reads via bloom like the neon seam). */
function migratingWindowFixture(accentColor: number, quality: 'low' | 'high'): { group: THREE.Group; tick(t: number): void } {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c, emissive: accentColor, emissiveIntensity: 0.5, roughness: 0.25, metalness: 0.15,
    transparent: true, opacity: 0.82,
  });
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.6), mat);
  pane.position.set(0, 3.3, -46);
  group.add(pane);
  // A thin frame so it reads as a fixture (window/mirror), not a stray glowing card.
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x18140f, roughness: 0.7 });
  const frameGeoV = new THREE.BoxGeometry(0.12, 3.85, 0.1);
  const frameGeoH = new THREE.BoxGeometry(2.85, 0.12, 0.1);
  const left = new THREE.Mesh(frameGeoV, frameMat);
  left.position.set(-1.36, 3.3, -46);
  const right = left.clone();
  right.position.x = 1.36;
  const top = new THREE.Mesh(frameGeoH, frameMat);
  top.position.set(0, 5.2, -46);
  const bottom = top.clone();
  bottom.position.y = 1.4;
  group.add(left, right, top, bottom);
  const glow = quality === 'high' ? new THREE.PointLight(accentColor, 1.6, 14, 1.8) : null;
  if (glow) {
    glow.position.set(0, 3.3, -44);
    group.add(glow);
  }
  return {
    group,
    tick(t) {
      // "Migrating": a slow, small drift side to side, plus a gentle
      // brightness breathe — deliberately subtler than the door pulse so it
      // reads as environmental unease, not another interactive thing.
      pane.position.x = Math.sin(t * 0.09) * 0.55;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 0.31) * 0.14;
      if (glow) glow.intensity = 1.6 + Math.sin(t * 0.31) * 0.4;
    },
  };
}

/** Wraps `corridorTheme` with LIMERENCE's own structural set-dressing (the
 * migrating window) — reuses the shared corridor shape (a hotel floor and a
 * facility corridor are legitimately the same geometry) while adding a
 * fixture that exists in no ANAMNESIS theme, so a floor reads as somewhere
 * specific rather than a recolor. fogColor/background/fogDensity pass
 * through unchanged from `corridorTheme` — `LIMERENCE_FOG_COLOR_BY_THEME`
 * stays in sync exactly as it already was. */
function limerenceCorridorTheme(warmth: number, palette: CorridorPalette, quality: 'low' | 'high'): ThemeConfig {
  const base = corridorTheme(warmth, palette, quality);
  const accent = palette.accentColor ?? palette.keyLight ?? warmth;
  const window_ = migratingWindowFixture(accent, quality);
  base.group.add(window_.group);
  return {
    ...base,
    tick(t) {
      base.tick(t);
      window_.tick(t);
    },
  };
}

/** Floor 4 — The Top Floor: fog thinning toward morning, no custom shader
 * (kept simple/low-risk) — warm directional light standing in for a
 * sunrise, amber dust settling. */
function topFloorTheme(quality: 'low' | 'high' = 'high'): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x201a14, 0.85));
  group.add(new THREE.AmbientLight(0x4a3626, 1.8));
  const sun = new THREE.DirectionalLight(0xe8a862, 2.4);
  sun.position.set(0, 7, -20);
  group.add(sun);
  const motes = particles(quality === 'high' ? 260 : 140, 0xe8b878, 30, 0.04);
  group.add(motes);
  return {
    group, fogColor: 0x281c14, fogDensity: 0.03, background: 0x281c14,
    tick(t) { motes.rotation.y = t * 0.01; },
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

export function limerenceBuildTheme(id: ThemeId, quality: 'low' | 'high' = 'high'): ThemeConfig {
  switch (id) {
    case 0: return limerenceCorridorTheme(...FRONT_DESK, quality);
    case 1: return limerenceCorridorTheme(...GROUND_FLOOR, quality);
    case 2: return limerenceCorridorTheme(...SECOND_FLOOR, quality);
    case 3: return limerenceCorridorTheme(...LONG_STAY_WING, quality);
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
