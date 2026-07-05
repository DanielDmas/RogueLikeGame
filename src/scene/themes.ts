import * as THREE from 'three';
import { DOOR_Z } from './doors';

export interface ThemeConfig {
  group: THREE.Group;
  fogColor: number;
  fogDensity: number;
  background: number;
  /** called each frame for ambient animation */
  tick(t: number): void;
}

export type ThemeId = 0 | 1 | 2 | 3 | 4 | 5; // 5 = ending space

function floor(color: number, roughness = 0.85, metalness = 0): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ color, roughness, metalness }),
  );
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
  return m;
}

function particles(count: number, color: number, spread: number, size = 0.05): THREE.Points {
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

/** The Usher: a silhouette with an emissive halo AND horns; one horn flickers. */
export function usherFigure(): { group: THREE.Group; tick(t: number): void; setPresence(v: number): void } {
  // a faint warm rim-light lift so the body reads as a figure, not a bare floating halo
  const group = silhouette(0x0c0a08, 0x2a1f10, 0.35);
  const bodyMat = (group.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
  const BASE_RIM = 0.35;
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
    },
    setPresence(v: number) {
      presence = v;
    },
  };
}

/** Blend a hex color toward neutral grey — used to desaturate the decorative corridor doors. */
function desaturate(hex: number, amount: number): number {
  const c = new THREE.Color(hex);
  const grey = c.getHSL({ h: 0, s: 0, l: 0 }).l;
  return c.lerp(new THREE.Color(grey, grey, grey), amount).getHex();
}

/** Act I (and prologue): endless dim corridor, doors leaking warm domestic light. */
function corridorTheme(warmth: number): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x201c16, 0.9));

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x2b2620, roughness: 0.95 });
  // decorative background doors: dim and desaturated, so they read as scenery, not choices
  const decorativeWarmth = desaturate(warmth, 0.55);
  const doorGlowMat = new THREE.MeshStandardMaterial({
    color: 0x241f18, emissive: decorativeWarmth, emissiveIntensity: 0.32, roughness: 0.8,
  });
  // The nearest decorative slab must sit clearly behind the real doors
  // (DOOR_Z) so background scenery never renders larger/closer than an
  // actual choice — that misread is what made the corridor confusing.
  const DECOR_NEAR_Z = DOOR_Z - 3;
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7, 90), wallMat);
    wall.position.set(side * 7.5, 3.5, -30);
    group.add(wall);
    for (let i = 0; i < 9; i++) {
      const slab = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.6), doorGlowMat);
      slab.position.set(side * 7.28, 1.5, DECOR_NEAR_Z - i * 9);
      slab.rotation.y = side * -Math.PI / 2;
      group.add(slab);
      const light = new THREE.PointLight(decorativeWarmth, 0.85, 7, 2.0);
      light.position.set(side * 6.6, 1.6, DECOR_NEAR_Z - i * 9);
      group.add(light);
    }
  }
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(16, 90), wallMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 6.4, -30);
  group.add(ceiling);
  group.add(new THREE.AmbientLight(0x4a3c28, 2.0));
  const key = new THREE.PointLight(0xc9a06a, 9, 26, 1.5);
  key.position.set(0, 4.4, -2);
  group.add(key);
  const dust = particles(240, 0xc9a06a, 24, 0.035);
  group.add(dust);
  return {
    group, fogColor: 0x322a1d, fogDensity: 0.036, background: 0x322a1d,
    tick(t) { dust.rotation.y = t * 0.008; },
  };
}

/** Act II: dark celestial factory — gears in fog, conveyor belts of small indifferent stars. */
function machineryTheme(): ThemeConfig {
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
  const stars = particles(500, 0x9db4e8, 46, 0.06);
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
function mirrorTheme(): ThemeConfig {
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
  const mist = particles(160, 0x9db4e8, 30, 0.03);
  group.add(mist);
  return {
    group, fogColor: 0x1c2036, fogDensity: 0.038, background: 0x1c2036,
    tick(t) {
      dioramas.forEach((d, i) => { d.position.y = 2.2 + Math.sin(i * 1.7) * 1.4 + Math.sin(t * 0.4 + i) * 0.18; });
    },
  };
}

/** Act IV: fog burning off into a dawn gradient. */
function thresholdTheme(): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x1a1610, 0.85));
  // dawn backdrop
  const dawnGeo = new THREE.PlaneGeometry(120, 50);
  const dawnMat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float time;
      void main(){
        vec3 low = vec3(0.55, 0.32, 0.18);
        vec3 mid = vec3(0.28, 0.20, 0.24);
        vec3 high = vec3(0.05, 0.06, 0.10);
        vec3 c = mix(low, mid, smoothstep(0.0, 0.35, vUv.y));
        c = mix(c, high, smoothstep(0.3, 0.8, vUv.y));
        c += 0.02 * sin(time * 0.2 + vUv.x * 10.0);
        gl_FragColor = vec4(c, 1.0);
      }`,
    depthWrite: false,
  });
  const dawn = new THREE.Mesh(dawnGeo, dawnMat);
  dawn.position.set(0, 12, -55);
  group.add(dawn);
  group.add(new THREE.AmbientLight(0x4a3a2c, 1.6));
  const sun = new THREE.DirectionalLight(0xe8a05a, 2.2);
  sun.position.set(0, 6, -30);
  group.add(sun);
  const motes = particles(300, 0xe8b06a, 34, 0.04);
  group.add(motes);
  return {
    group, fogColor: 0x2a1d14, fogDensity: 0.032, background: 0x2a1d14,
    tick(t) {
      dawnMat.uniforms.time.value = t;
      motes.rotation.y = t * 0.01;
    },
  };
}

/** Ending space: near-white light, almost nothing. */
function endingTheme(): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x3a362e, 0.9));
  group.add(new THREE.AmbientLight(0xfff2dc, 2.4));
  const sun = new THREE.DirectionalLight(0xffe8c4, 3);
  sun.position.set(2, 10, 4);
  group.add(sun);
  const motes = particles(200, 0xffffff, 30, 0.05);
  group.add(motes);
  return {
    group, fogColor: 0xcfc4ae, fogDensity: 0.05, background: 0xcfc4ae,
    tick(t) { motes.rotation.y = t * 0.012; },
  };
}

export function buildTheme(id: ThemeId): ThemeConfig {
  switch (id) {
    case 0: return corridorTheme(0x8a6a3a);
    case 1: return corridorTheme(0xb3762f);
    case 2: return machineryTheme();
    case 3: return mirrorTheme();
    case 4: return thresholdTheme();
    case 5: return endingTheme();
  }
}

// ---------- Dynamic scenery mood (optional, settings-gated) ----------
// A subtle per-room-type tint blended over the current act's base fog/
// background colors — the "dynamic scenery" toggle. Kept gentle on purpose:
// this is mood-setting, not a re-theme, so the act's identity always reads
// through. Off by default; static (pure act theme) is the baseline behavior.
export type MoodType = 'DILEMMA' | 'INSIGHT' | 'NO-SOLUTION' | 'DOOMED';

interface MoodTint {
  /** color blended into the base fog/background */
  tint: number;
  /** 0..1 blend strength toward the tint */
  blend: number;
  /** multiplier on the base fog density */
  densityMul: number;
}

const MOOD_TINTS: Record<MoodType, MoodTint> = {
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
