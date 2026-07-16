import * as THREE from 'three';
import { DOOR_Z, seededSigned } from './doors';

export interface ThemeConfig {
  group: THREE.Group;
  fogColor: number;
  fogDensity: number;
  background: number;
  /** called each frame for ambient animation */
  tick(t: number): void;
}

export type ThemeId = 0 | 1 | 2 | 3 | 4 | 5; // 5 = ending space

export function floor(color: number, roughness = 0.85, metalness = 0): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ color, roughness, metalness }),
  );
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
  return m;
}

export function particles(count: number, color: number, spread: number, size = 0.05): THREE.Points {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = Math.random() * 8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread - 6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.55, depthWrite: false }),
  );
}

/** A backlit human silhouette — faces dissolved, on theme. */
export function silhouette(color = 0x060608, rimEmissive = 0x000000, rimIntensity = 0): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color, roughness: 0.95, emissive: rimEmissive, emissiveIntensity: rimIntensity,
  });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 1.25, 12), mat);
  body.position.y = 0.62;
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), mat);
  shoulders.position.y = 1.28;
  shoulders.scale.set(1.25, 0.7, 0.8);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), mat);
  head.position.y = 1.55;
  g.add(body, shoulders, head);
  return g;
}

/** The lantern's arm-lean angle toward a hovered door's world x (spec 07
 * §Q6) — null (no hover) means no lean. Pure, unit-tested. */
export function lanternLeanAngle(targetX: number | null): number {
  if (targetX === null) return 0;
  return targetX >= 0 ? 0.2 : -0.2;
}

export interface GuideFigure {
  group: THREE.Group;
  tick(t: number): void;
  setPresence(v: number): void;
  setLanternTarget(x: number | null): void;
}

/** The Usher: a silhouette with an emissive halo AND horns; one horn flickers. */
export function usherFigure(): GuideFigure {
  // a warm rim-light lift so the body reads as a figure, not a bare floating
  // halo — raised from the original 0.35 (the figure read as too hidden/dim
  // against the darker act themes).
  const group = silhouette(0x0c0a08, 0x2a1f10, 0.55);
  // scaled up ~18% for the same reason: a silhouette this size, this far
  // from the camera, was easy to miss entirely.
  group.scale.setScalar(1.18);
  const bodyMat = (group.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
  const head = group.children[2] as THREE.Mesh;
  const BASE_RIM = 0.55;
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.19, 0.016, 10, 40),
    new THREE.MeshStandardMaterial({
      color: 0xd4b36a, emissive: 0xd4b36a, emissiveIntensity: 1.5, roughness: 0.3,
    }),
  );
  const BASE_HALO = 1.5;
  halo.position.y = 1.82;
  halo.rotation.x = Math.PI / 2.25;
  const hornMat = new THREE.MeshStandardMaterial({
    color: 0x8a2f1e, emissive: 0xb3543f, emissiveIntensity: 1.4, roughness: 0.4,
  });
  const hornFlickerMat = hornMat.clone();
  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 8), hornMat);
  hornL.position.set(-0.09, 1.66, 0);
  hornL.rotation.z = 0.35;
  const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 8), hornFlickerMat);
  hornR.position.set(0.09, 1.66, 0);
  hornR.rotation.z = -0.35;
  group.add(halo, hornL, hornR);

  // A soft work-light from directly above — thematic and calm (a stagehand's
  // lamp, not a spotlight interrogation) so the figure reads clearly against
  // every act's palette without looking like a horror-movie reveal.
  const BASE_SPOT = 2.0;
  const spot = new THREE.SpotLight(0xf0d9a0, BASE_SPOT, 9, 0.55, 0.65, 1.6);
  spot.position.set(0, 3.1, 0.35);
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0, 0.7, 0);
  group.add(spotTarget);
  spot.target = spotTarget;
  group.add(spot);

  // The lantern (spec 07 §Q6): a small hand-carried light that leans toward
  // whichever door the player is considering — a quiet guidance cue, not a
  // spotlight. Dark and unlit until a door is actually hovered.
  const lanternArm = new THREE.Group();
  lanternArm.position.set(0.24, 0.92, 0.16);
  const lanternGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xf0d9a0, emissive: 0xf0d9a0, emissiveIntensity: 0, roughness: 0.4 }),
  );
  const lanternLight = new THREE.PointLight(0xf0d9a0, 0, 4, 1.8);
  lanternArm.add(lanternGlow, lanternLight);
  group.add(lanternArm);
  const LANTERN_TARGET_INTENSITY = 0.9;
  let lanternTargetX: number | null = null;
  let lanternIntensity = 0;
  let lastLanternT = 0;

  // presence: a multiplier on how visible/lit the Usher reads right now —
  // boosted briefly while walking a player through a chosen door, so the
  // figure registers as thematic guidance rather than idle set-dressing.
  let presence = 1;
  return {
    group,
    tick(t) {
      // one horn flickers, like a faulty sign
      hornFlickerMat.emissiveIntensity = (Math.random() > 0.94 ? 0.15 : 1.4 + Math.sin(t * 3) * 0.2) * presence;
      halo.rotation.z = Math.sin(t * 0.7) * 0.08;
      halo.material.emissiveIntensity = BASE_HALO * presence;
      bodyMat.emissiveIntensity = BASE_RIM * presence;
      spot.intensity = BASE_SPOT * presence;
      // idle life: a slow, gentle glance toward the room every ~20s, rather
      // than standing perfectly still the whole scene
      head.rotation.y = Math.sin((t * 2 * Math.PI) / 20) * 0.16;

      const dt = Math.max(0, Math.min(0.05, t - lastLanternT));
      lastLanternT = t;
      const targetIntensity = lanternTargetX !== null ? LANTERN_TARGET_INTENSITY : 0;
      lanternIntensity += (targetIntensity - lanternIntensity) * Math.min(1, dt * 4);
      lanternGlow.material.emissiveIntensity = lanternIntensity * presence;
      lanternLight.intensity = lanternIntensity * presence;
      const targetLean = lanternLeanAngle(lanternTargetX);
      lanternArm.rotation.y += (targetLean - lanternArm.rotation.y) * Math.min(1, dt * 4);
    },
    setPresence(v: number) {
      presence = v;
    },
    setLanternTarget(x: number | null) {
      lanternTargetX = x;
    },
  };
}

/** Blend a hex color toward neutral grey — used to desaturate the decorative corridor doors. */
export function desaturate(hex: number, amount: number): number {
  const c = new THREE.Color(hex);
  const grey = c.getHSL({ h: 0, s: 0, l: 0 }).l;
  return c.lerp(new THREE.Color(grey, grey, grey), amount).getHex();
}

// ---------- Standardized environmental fixture kit (Phase V, graphics
// rework, 2026-07-16) ----------
// The design brief behind this kit: LIMERENCE's own scoping notes asked for
// "its own scene-builder functions per floor," but this codebase's real
// strength — and the owner's explicit standing preference — is one engine
// whose geometry any future content pack (a third "vestibule," a new topic)
// can configure, not fork. So instead of bespoke per-floor code, every
// fixture below is a single, reusable, colored-and-quality-parameterized
// builder, composed into a floor via *data* (`CorridorPalette.fixtures`).
// LIMERENCE gets real structural distinctiveness by choosing which fixtures
// and colors a floor gets; a hypothetical third pack gets the exact same
// toolkit for free. None of these fixtures spawn new real-time lights at
// `quality: 'low'` (self-lit emissive materials read via bloom without one),
// keeping the "expensive corridor" GPU budget noted in the 1.3-era work
// intact regardless of how many fixtures a floor uses.

export type CorridorFixtureSpec =
  | { kind: 'endWindow'; color: number }
  | { kind: 'bandedWalls'; color: number }
  | { kind: 'infoPanel'; color: number }
  | { kind: 'sconces'; color: number };

interface Fixture {
  group: THREE.Group;
  tick(t: number): void;
}

/** "The migrating wall/window" (creative bible §8's named signature image):
 * a pane at the corridor's far end that never sits quite still — window, or
 * maybe a mirror; the hotel isn't telling — drifting a little side to side
 * and breathing in brightness, as though the room behind it keeps
 * almost-arriving. Self-lit (no PointLight at all — reads via bloom), so it
 * costs nothing beyond 5 meshes regardless of quality tier. */
function endWindowFixture(color: number, quality: 'low' | 'high'): Fixture {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c, emissive: color, emissiveIntensity: 0.5, roughness: 0.25, metalness: 0.15,
    transparent: true, opacity: 0.82,
  });
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.6), mat);
  pane.position.set(0, 3.3, -46);
  group.add(pane);
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
  const glow = quality === 'high' ? new THREE.PointLight(color, 1.6, 14, 1.8) : null;
  if (glow) {
    glow.position.set(0, 3.3, -44);
    group.add(glow);
  }
  return {
    group,
    tick(t) {
      pane.position.x = Math.sin(t * 0.09) * 0.55;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 0.31) * 0.14;
      if (glow) glow.intensity = 1.6 + Math.sin(t * 0.31) * 0.4;
    },
  };
}

/** A repeated band of thin panels along both walls at chest height — school
 * lockers, filing cabinets, cell doors, whatever a floor's own fiction
 * needs; the shape (a structured, repeating wall pattern) and the meaning
 * (recoloring it) are deliberately separable. A few panels sit lit
 * (emissive) at a fixed, deterministic pattern — "some occupied, some not"
 * — the rest dark. No new lights; self-lit emissive only. */
function bandedWallsFixture(color: number, _quality: 'low' | 'high'): Fixture {
  const group = new THREE.Group();
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1712, roughness: 0.7 });
  const litMat = new THREE.MeshStandardMaterial({ color: 0x1a1712, emissive: color, emissiveIntensity: 0.28, roughness: 0.6 });
  const geo = new THREE.BoxGeometry(0.08, 1.3, 0.5);
  const count = 9;
  for (const side of [-1, 1]) {
    for (let i = 0; i < count; i++) {
      const lit = seededSigned(i * 3.7 + side * 11) > 0.15;
      const panel = new THREE.Mesh(geo, lit ? litMat : darkMat);
      panel.position.set(side * 7.32, 1.0, -8 - i * 7);
      group.add(panel);
    }
  }
  return { group, tick() {} };
}

/** A grid of small lit rectangles hanging near the corridor's entrance — a
 * departures board, a notice board, a star chart: whatever "a wall that
 * lists something" a floor's fiction needs. Roughly half the grid glows at
 * any moment, in a fixed pattern (not flickering — a board, not a sign). */
function infoPanelFixture(color: number, _quality: 'low' | 'high'): Fixture {
  const group = new THREE.Group();
  const backing = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x14110d, roughness: 0.8 }),
  );
  backing.position.set(0, 5.0, -4.4);
  group.add(backing);
  const litMat = new THREE.MeshStandardMaterial({ color: 0x14110d, emissive: color, emissiveIntensity: 0.4, roughness: 0.5 });
  const dimMat = new THREE.MeshStandardMaterial({ color: 0x14110d, emissive: color, emissiveIntensity: 0.08, roughness: 0.5 });
  const rows = 4;
  const cols = 8;
  const cellGeo = new THREE.PlaneGeometry(0.3, 0.14);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = seededSigned(r * 13.1 + c * 5.3) > 0.05;
      const cell = new THREE.Mesh(cellGeo, lit ? litMat : dimMat);
      cell.position.set((c - (cols - 1) / 2) * 0.36, 5.5 - r * 0.22, -4.39);
      group.add(cell);
    }
  }
  return { group, tick() {} };
}

/** Small wall-mounted lights at intervals along the corridor — the one
 * fixture in this kit that spends real-time lights, so it's gated to
 * `quality: 'high'` only (mirrors how every other expensive addition in
 * this file — the migrating window's own glow, the decorative doors'
 * per-slab PointLights — already gates on quality). */
function sconceFixture(color: number, quality: 'low' | 'high'): Fixture {
  const group = new THREE.Group();
  if (quality !== 'high') return { group, tick() {} };
  const positions: [number, number][] = [[-1, -15], [1, -35], [-1, -55]];
  const glowMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4, roughness: 0.4 });
  const glowGeo = new THREE.SphereGeometry(0.08, 10, 8);
  for (const [side, z] of positions) {
    const bulb = new THREE.Mesh(glowGeo, glowMat);
    bulb.position.set(side * 7.2, 2.4, z);
    group.add(bulb);
    const light = new THREE.PointLight(color, 1.3, 5, 2.0);
    light.position.set(side * 7.0, 2.4, z);
    group.add(light);
  }
  return { group, tick() {} };
}

function buildFixture(spec: CorridorFixtureSpec, quality: 'low' | 'high'): Fixture {
  switch (spec.kind) {
    case 'endWindow': return endWindowFixture(spec.color, quality);
    case 'bandedWalls': return bandedWallsFixture(spec.color, quality);
    case 'infoPanel': return infoPanelFixture(spec.color, quality);
    case 'sconces': return sconceFixture(spec.color, quality);
  }
}

/** A low silhouette skyline strip — for a dawn/threshold backdrop, standing
 * in front of the gradient as distant buildings. Dark/unlit (reads purely
 * as shape against the gradient's own glow), varying heights, deterministic. */
export function skylineFixture(color: number, count = 11): { group: THREE.Group } {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  for (let i = 0; i < count; i++) {
    const h = 2 + Math.abs(seededSigned(i * 4.3)) * 4.5;
    const w = 1.4 + Math.abs(seededSigned(i * 2.1)) * 1.2;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1), mat);
    box.position.set((i - (count - 1) / 2) * 4.2, h / 2, -50);
    group.add(box);
  }
  return { group };
}

/** Shared dawn-gradient backdrop shader — a vertical low→mid→high color
 * blend with a subtle horizontal shimmer. Originally authored only for
 * ANAMNESIS's Act IV; factored out so any pack's "dawn/threshold" scene
 * reuses the exact same proven shader, recolored, instead of forking a new
 * `ShaderMaterial` per pack (LIMERENCE's Top Floor uses this directly).
 * Colors are `[r,g,b]` in 0..1 (not hex) to keep ANAMNESIS's original,
 * hand-tuned float values exact — no hex-roundtrip precision loss. */
export function dawnGradientPlane(
  low: [number, number, number],
  mid: [number, number, number],
  high: [number, number, number],
  width = 120,
  height = 50,
): { mesh: THREE.Mesh; tick(t: number): void } {
  const v3 = (c: [number, number, number]) => `vec3(${c[0]}, ${c[1]}, ${c[2]})`;
  const mat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float time;
      void main(){
        vec3 low = ${v3(low)};
        vec3 mid = ${v3(mid)};
        vec3 high = ${v3(high)};
        vec3 c = mix(low, mid, smoothstep(0.0, 0.35, vUv.y));
        c = mix(c, high, smoothstep(0.3, 0.8, vUv.y));
        c += 0.02 * sin(time * 0.2 + vUv.x * 10.0);
        gl_FragColor = vec4(c, 1.0);
      }`,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  return { mesh, tick(t) { mat.uniforms.time.value = t; } };
}

/** Graphics Phase V2 — "the morning read": under a pack's light-mode
 * toggle, a corridor floor's colors lift toward one shared warm dawn
 * reference rather than each floor authoring its own re-theme — every
 * floor stays recognizably "the same hotel, earlier," not five different
 * places. Pure; `amount` is the blend fraction toward `target`. */
export const DAWN_LIFT = { fog: 0xe8c9a0, ambient: 0xfff0d8, key: 0xffdca8 };

export function liftColorForLightMode(hex: number, target: number, amount: number): number {
  const c = new THREE.Color(hex);
  const t = new THREE.Color(target);
  return c.lerp(t, amount).getHex();
}

/** Phase V4b — "a phone lighting in the distance": constants + pure helpers
 * for the rare, brief accent-door pulse, extracted so the shape and cadence
 * are independently unit-testable without needing to mock `Math.random`
 * (same dependency-injection pattern as `director.ts`'s own
 * `nextAmbientDelay`/`nextGuidePassDelay`). */
export const ACCENT_PULSE_DURATION = 2.4;
export const ACCENT_PULSE_BOOST = 0.5;
export const ACCENT_PULSE_BASE = 0.34;

/** A single smooth rise-then-fall, 0 outside `[0, duration)`, peaking at 1
 * at the midpoint — the same "never a strobe" discipline as `doors.ts`'s
 * `flickerEnvelope`, just shaped as a bump instead of a dip. */
export function accentPulseEnvelope(elapsedSinceStart: number, duration = ACCENT_PULSE_DURATION): number {
  if (elapsedSinceStart < 0 || elapsedSinceStart >= duration) return 0;
  return Math.sin((Math.PI * elapsedSinceStart) / duration);
}

/** How long to wait before the next pulse, jittered 60-180s. Pure,
 * unit-tested; `rand` defaults to `Math.random`. */
export function nextAccentPulseDelay(rand: () => number = Math.random): number {
  return 60 + rand() * 120;
}

/** Act I (and prologue): endless dim corridor, doors leaking warm domestic light. */
export interface CorridorPalette {
  floorColor?: number;
  wallColor?: number;
  doorBase?: number;
  fog?: number;
  ambient?: number;
  keyLight?: number;
  dustColor?: number;
  /** Graphics-overhaul addition (2026-07-16): an optional second tone for
   * every third decorative door plus a faint unlit ceiling-seam strip —
   * "neon bleed through curtains" (LIMERENCE's creative bible §8), giving a
   * corridor genuine color variety rather than one hue applied uniformly.
   * undefined (ANAMNESIS's own callers never set it) keeps every existing
   * caller byte-identical — this only activates for a pack that opts in. */
  accentColor?: number;
  /** Phase V1 — the standardized fixture kit: which reusable environmental
   * pieces this floor uses, and in what color. Empty/undefined = the plain
   * corridor shape, unchanged (every ANAMNESIS caller). */
  fixtures?: CorridorFixtureSpec[];
}

/** A corridor of decorative background doors + one warm key light + drifting
 * dust — ANAMNESIS's Acts 0/1 shape, reused verbatim by default (every field
 * of `palette` defaults to ANAMNESIS's own tuned values, so
 * `corridorTheme(warmth)` alone is behavior-identical to before this was
 * parameterized). A pack that's also a corridor of doors — LIMERENCE's
 * hotel floors are exactly that — can recolor the whole thing via `palette`
 * without duplicating the geometry. */
export function corridorTheme(
  warmth: number,
  palette: CorridorPalette = {},
  quality: 'low' | 'high' = 'high',
  mode: 'dark' | 'light' = 'dark',
): ThemeConfig {
  const floorColor = palette.floorColor ?? 0x201c16;
  const wallColor = palette.wallColor ?? 0x2b2620;
  const doorBase = palette.doorBase ?? 0x241f18;
  const baseFog = palette.fog ?? 0x322a1d;
  const baseAmbient = palette.ambient ?? 0x4a3c28;
  const baseKeyLight = palette.keyLight ?? 0xc9a06a;
  const dustColor = palette.dustColor ?? 0xc9a06a;
  const accentColor = palette.accentColor;

  // Phase V2 — "the morning read": light mode lifts fog/ambient/key toward
  // one shared dawn reference rather than each floor re-theming itself.
  // `mode` is only ever 'light' for a pack with `supportsLightTheme: true`
  // (ANAMNESIS never passes it), so this is dead code for every existing
  // caller of `corridorTheme` before this feature.
  const isLight = mode === 'light';
  const fog = isLight ? liftColorForLightMode(baseFog, DAWN_LIFT.fog, 0.18) : baseFog;
  const ambient = isLight ? liftColorForLightMode(baseAmbient, DAWN_LIFT.ambient, 0.35) : baseAmbient;
  const keyLight = isLight ? liftColorForLightMode(baseKeyLight, DAWN_LIFT.key, 0.3) : baseKeyLight;
  const fogDensityMul = isLight ? 0.82 : 1;
  const ambientIntensity = isLight ? 2.5 : 2.0;

  const group = new THREE.Group();
  group.add(floor(floorColor, 0.9));

  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.95 });
  // decorative background doors: dim and desaturated, so they read as scenery, not choices
  const decorativeWarmth = desaturate(warmth, 0.55);
  const doorGlowMat = new THREE.MeshStandardMaterial({
    color: doorBase, emissive: decorativeWarmth, emissiveIntensity: 0.32, roughness: 0.8,
  });
  // A second, cooler/contrasting tone for every third decorative door — "not
  // every door behind the same light" (see CorridorPalette.accentColor).
  // No-op (never constructed) when a pack doesn't opt in.
  const decorativeAccent = accentColor !== undefined ? desaturate(accentColor, 0.4) : null;
  const doorGlowMatAccent = decorativeAccent !== null
    ? new THREE.MeshStandardMaterial({ color: doorBase, emissive: decorativeAccent, emissiveIntensity: 0.34, roughness: 0.8 })
    : null;
  // The nearest decorative slab must sit clearly behind the real doors
  // (DOOR_Z) so background scenery never renders larger/closer than an
  // actual choice — that misread is what made the corridor confusing.
  const DECOR_NEAR_Z = DOOR_Z - 3;
  // 1.3 item 5: the per-side decorative slabs each carry their own
  // real-time PointLight — 18 of them at 'high', the single most expensive
  // piece of a corridor theme's own geometry (independent of the
  // composer/bloom cost post.ts already gates on quality). Halved on 'low'.
  const decorCount = quality === 'high' ? 9 : 5;
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7, 90), wallMat);
    wall.position.set(side * 7.5, 3.5, -30);
    group.add(wall);
    for (let i = 0; i < decorCount; i++) {
      const isAccent = doorGlowMatAccent !== null && i % 3 === 2;
      const slab = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.6), isAccent ? doorGlowMatAccent : doorGlowMat);
      slab.position.set(side * 7.28, 1.5, DECOR_NEAR_Z - i * 9);
      slab.rotation.y = side * -Math.PI / 2;
      group.add(slab);
      const light = new THREE.PointLight(isAccent ? decorativeAccent! : decorativeWarmth, 0.85, 7, 2.0);
      light.position.set(side * 6.6, 1.6, DECOR_NEAR_Z - i * 9);
      group.add(light);
    }
  }
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(16, 90), wallMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 6.4, -30);
  group.add(ceiling);
  group.add(new THREE.AmbientLight(ambient, ambientIntensity));
  const key = new THREE.PointLight(keyLight, 9, 26, 1.5);
  key.position.set(0, 4.4, -2);
  group.add(key);
  const dust = particles(quality === 'high' ? 240 : 130, dustColor, 24, 0.035);
  group.add(dust);
  // "Neon bleed through curtains" (creative bible §8): a faint, unlit
  // ceiling-seam strip in the accent tone along each wall — no PointLight
  // (self-lit MeshBasicMaterial), so it costs nothing beyond one extra mesh
  // per side regardless of quality tier.
  if (accentColor !== undefined) {
    const seamMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.09, depthWrite: false });
    for (const side of [-1, 1]) {
      const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 88), seamMat);
      seam.position.set(side * 7.3, 6.35, -30);
      seam.rotation.x = Math.PI / 2;
      group.add(seam);
    }
  }

  // Phase V1 — the standardized fixture kit: compose whatever this floor's
  // palette asked for. Empty/undefined `fixtures` = zero extra geometry,
  // identical to every pre-Phase-V caller.
  const fixtures = (palette.fixtures ?? []).map((spec) => buildFixture(spec, quality));
  for (const f of fixtures) group.add(f.group);

  // Phase V4b — "a phone lighting in the distance": when a floor has an
  // accent-colored decorative door, its shared accent material rarely and
  // briefly brightens on a jittered 60-180s timer — background life down
  // the corridor, not another interactive cue. A single smooth rise/fall
  // (never a strobe), self-contained in this tick so no director wiring is
  // needed. No-op when the floor has no accentColor (doorGlowMatAccent is
  // null in that case).
  let nextPulseAt = doorGlowMatAccent !== null ? nextAccentPulseDelay() : Infinity;
  let pulseStartT: number | null = null;

  return {
    group, fogColor: fog, fogDensity: 0.036 * fogDensityMul, background: fog,
    tick(t) {
      dust.rotation.y = t * 0.008;
      for (const f of fixtures) f.tick(t);
      if (doorGlowMatAccent !== null) {
        if (pulseStartT === null && t >= nextPulseAt) pulseStartT = t;
        let pulse = 0;
        if (pulseStartT !== null) {
          const elapsed = t - pulseStartT;
          pulse = accentPulseEnvelope(elapsed);
          if (elapsed >= ACCENT_PULSE_DURATION) {
            pulseStartT = null;
            nextPulseAt = t + nextAccentPulseDelay();
          }
        }
        doorGlowMatAccent.emissiveIntensity = ACCENT_PULSE_BASE + pulse * ACCENT_PULSE_BOOST;
      }
    },
  };
}

/** Act II: dark celestial factory — gears in fog, conveyor belts of small indifferent stars. */
function machineryTheme(quality: 'low' | 'high' = 'high'): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x161a24, 0.6, 0.35));
  const brass = new THREE.MeshStandardMaterial({ color: 0x8a7442, roughness: 0.35, metalness: 0.9 });
  const gears: THREE.Mesh[] = [];
  const gearGeo = new THREE.TorusGeometry(3.4, 0.5, 10, 28);
  const positions: [number, number, number][] = [
    [-9, 5, -16], [10, 7, -22], [-6, 9, -30], [7, 3.5, -12], [0, 11, -26],
  ];
  for (const [x, y, z] of positions) {
    const gear = new THREE.Mesh(gearGeo, brass);
    gear.position.set(x, y, z);
    gear.rotation.set(Math.random(), Math.random(), 0);
    gears.push(gear);
    group.add(gear);
  }
  const stars = particles(quality === 'high' ? 500 : 260, 0x9db4e8, 46, 0.06);
  group.add(stars);
  group.add(new THREE.AmbientLight(0x33405c, 2.4));
  const beam = new THREE.SpotLight(0xd4b36a, 110, 50, 0.55, 0.7, 1.3);
  beam.position.set(0, 15, -3);
  beam.target.position.set(0, 0, -8);
  group.add(beam, beam.target);
  const cool = new THREE.PointLight(0x4a5f9e, 10, 32, 1.5);
  cool.position.set(-6, 3, -10);
  group.add(cool);
  return {
    group, fogColor: 0x20242f, fogDensity: 0.033, background: 0x20242f,
    tick(t) {
      gears.forEach((g, i) => { g.rotation.z = t * (0.05 + i * 0.02) * (i % 2 ? 1 : -1); });
      stars.position.x = Math.sin(t * 0.05) * 2;
    },
  };
}

/** Act III: black-mirror floor, floating dioramas of blurred memories, cold moonlight. */
function mirrorTheme(quality: 'low' | 'high' = 'high'): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x11141c, 0.12, 0.85));
  const dioramas: THREE.Mesh[] = [];
  const dioMat = new THREE.MeshStandardMaterial({
    color: 0x10131c, emissive: 0x2e3d66, emissiveIntensity: 0.7,
    roughness: 0.5, transparent: true, opacity: 0.85,
  });
  for (let i = 0; i < 8; i++) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.15, 0.1), dioMat);
    const angle = (i / 8) * Math.PI * 2;
    d.position.set(Math.cos(angle) * 9.5, 2.2 + Math.sin(i * 1.7) * 1.4, -12 + Math.sin(angle) * 7);
    d.rotation.y = -angle + Math.PI / 2;
    dioramas.push(d);
    group.add(d);
  }
  group.add(new THREE.AmbientLight(0x28304e, 2.6));
  const moon = new THREE.DirectionalLight(0x9db4e8, 2.0);
  moon.position.set(-6, 12, -4);
  group.add(moon);
  const glow = new THREE.PointLight(0x6a7fc4, 6, 28, 1.6);
  glow.position.set(0, 3, -8);
  group.add(glow);
  const mist = particles(quality === 'high' ? 160 : 90, 0x9db4e8, 30, 0.03);
  group.add(mist);
  return {
    group, fogColor: 0x1c2036, fogDensity: 0.038, background: 0x1c2036,
    tick(t) {
      dioramas.forEach((d, i) => { d.position.y = 2.2 + Math.sin(i * 1.7) * 1.4 + Math.sin(t * 0.4 + i) * 0.18; });
    },
  };
}

/** Act IV: fog burning off into a dawn gradient. */
function thresholdTheme(quality: 'low' | 'high' = 'high'): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x1a1610, 0.85));
  // dawn backdrop — shared shader (Phase V1); same exact values as before this refactor.
  const dawn = dawnGradientPlane([0.55, 0.32, 0.18], [0.28, 0.20, 0.24], [0.05, 0.06, 0.10]);
  dawn.mesh.position.set(0, 12, -55);
  group.add(dawn.mesh);
  group.add(new THREE.AmbientLight(0x4a3a2c, 1.6));
  const sun = new THREE.DirectionalLight(0xe8a05a, 2.2);
  sun.position.set(0, 6, -30);
  group.add(sun);
  const motes = particles(quality === 'high' ? 300 : 160, 0xe8b06a, 34, 0.04);
  group.add(motes);
  return {
    group, fogColor: 0x2a1d14, fogDensity: 0.032, background: 0x2a1d14,
    tick(t) {
      dawn.tick(t);
      motes.rotation.y = t * 0.01;
    },
  };
}

/** Ending space: near-white light, almost nothing. */
function endingTheme(quality: 'low' | 'high' = 'high'): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x3a362e, 0.9));
  group.add(new THREE.AmbientLight(0xfff2dc, 2.4));
  const sun = new THREE.DirectionalLight(0xffe8c4, 3);
  sun.position.set(2, 10, 4);
  group.add(sun);
  const motes = particles(quality === 'high' ? 200 : 110, 0xffffff, 30, 0.05);
  group.add(motes);
  return {
    group, fogColor: 0xcfc4ae, fogDensity: 0.05, background: 0xcfc4ae,
    tick(t) { motes.rotation.y = t * 0.012; },
  };
}

/** Each theme's base fog color, without constructing its (expensive) 3D
 * group — used by the doorway light-spill (spec 07 §Q2) to pick a fallback
 * tint for a mood with no color of its own (DILEMMA), without needing to
 * build a whole scene just to read one number. Keep in sync with `buildTheme`. */
export const FOG_COLOR_BY_THEME: Record<ThemeId, number> = {
  0: 0x322a1d,
  1: 0x322a1d,
  2: 0x20242f,
  3: 0x1c2036,
  4: 0x2a1d14,
  5: 0xcfc4ae,
};

/** The doorway light-spill's color (spec 07 §Q2): the destination room
 * type's mood tint, or the next act's base fog color when the mood has none
 * of its own (DILEMMA rooms — the common case). Pure — no THREE side effects.
 * `moodTints`/`fogColors` default to ANAMNESIS's own (the engine-wide
 * default), overridable per pack. */
export function spillColorFor(
  roomType: MoodType,
  nextActTheme: ThemeId,
  moodTints: Record<MoodType, MoodTint> = MOOD_TINTS,
  fogColors: Record<ThemeId, number> = FOG_COLOR_BY_THEME,
): number {
  const tint = moodTints[roomType].tint;
  return tint !== 0 ? tint : fogColors[nextActTheme];
}

export function buildTheme(id: ThemeId, quality: 'low' | 'high' = 'high'): ThemeConfig {
  switch (id) {
    case 0: return corridorTheme(0x8a6a3a, {}, quality);
    case 1: return corridorTheme(0xb3762f, {}, quality);
    case 2: return machineryTheme(quality);
    case 3: return mirrorTheme(quality);
    case 4: return thresholdTheme(quality);
    case 5: return endingTheme(quality);
  }
}

// ---------- Dynamic scenery mood (optional, settings-gated) ----------
// A subtle per-room-type tint blended over the current act's base fog/
// background colors — the "dynamic scenery" toggle. Kept gentle on purpose:
// this is mood-setting, not a re-theme, so the act's identity always reads
// through. Off by default; static (pure act theme) is the baseline behavior.
export type MoodType = 'DILEMMA' | 'INSIGHT' | 'NO-SOLUTION' | 'DOOMED';

export interface MoodTint {
  /** color blended into the base fog/background */
  tint: number;
  /** 0..1 blend strength toward the tint */
  blend: number;
  /** multiplier on the base fog density */
  densityMul: number;
}

export const MOOD_TINTS: Record<MoodType, MoodTint> = {
  // the common case: no perceptible shift, so most rooms feel exactly as before
  DILEMMA: { tint: 0x000000, blend: 0, densityMul: 1 },
  // a warmer, clearer gold lift — an "aha" room
  INSIGHT: { tint: 0xd4b36a, blend: 0.16, densityMul: 0.85 },
  // cooler and slightly thicker — the walls close in, nothing to solve
  'NO-SOLUTION': { tint: 0x3a4250, blend: 0.16, densityMul: 1.25 },
  // darker and redder — foreboding, without tipping into horror
  DOOMED: { tint: 0x4a1c18, blend: 0.2, densityMul: 1.35 },
};

export interface MoodResult {
  fogColor: number;
  background: number;
  fogDensity: number;
}

/** Blends a base theme's colors toward a room-type mood tint. Pure — no THREE side effects. */
export function applyMood(base: Pick<ThemeConfig, 'fogColor' | 'background' | 'fogDensity'>, type: MoodType | null): MoodResult {
  if (!type) return { fogColor: base.fogColor, background: base.background, fogDensity: base.fogDensity };
  const { tint, blend, densityMul } = MOOD_TINTS[type];
  if (blend <= 0) return { fogColor: base.fogColor, background: base.background, fogDensity: base.fogDensity };
  const baseFog = new THREE.Color(base.fogColor);
  const baseBg = new THREE.Color(base.background);
  const tintColor = new THREE.Color(tint);
  const fog = baseFog.clone().lerp(tintColor, blend);
  const bg = baseBg.clone().lerp(tintColor, blend);
  return { fogColor: fog.getHex(), background: bg.getHex(), fogDensity: base.fogDensity * densityMul };
}
