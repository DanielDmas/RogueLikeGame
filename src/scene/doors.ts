import * as THREE from 'three';

export interface DoorSpec {
  id: string;
  hint: string;
  teaser?: string;
  secret?: boolean;
}

export interface DoorSet {
  group: THREE.Group;
  meshes: THREE.Mesh[];
  setHover(id: string | null): void;
  /** world position of a door's lintel, for the DOM tooltip */
  lintel(id: string): THREE.Vector3;
  /** the 4 world-space corners of the door's frame (outer jamb edges, floor to lintel top) — for UAT screen-bounds checks */
  frameCorners(id: string): THREE.Vector3[] | null;
  /** per-frame idle pulse so real, clickable doors read as alive against the dim decorative corridor doors */
  tick(t: number, reducedMotion?: boolean): void;
  /** Snaps a chosen door's glow up immediately on selection, ahead of the doorway light-spill (spec 07 §Q2). */
  snapSelected(id: string): void;
  /** T7 — ambient corridor life: a rare, brief glow dip on one random
   * non-hovered door, as though something settled somewhere down the
   * corridor. No-op if every door is currently hovered (nothing left to
   * pick) or there are no doors. `t` is the same clock the caller's own
   * tick() already uses, so the flicker's envelope stays frame-accurate. */
  triggerAmbientFlicker(t: number): void;
  dispose(): void;
}

/** Matches SceneDirector's camera home position — doors face the viewer, not a point behind them. */
const CAMERA_HOME = new THREE.Vector3(0, 1.6, 7.6);
export const DOOR_Z = -5.6;

const BASE_INTENSITY = 0.42;
const PULSE_AMPLITUDE = 0.08;
/** Base intensities for a door's point light and floor pool — item 7's
 * hover light-spill breathes these up by a fraction (`hoverLightSpill`),
 * so a hovered door's whole light rig (slab + point light + floor pool)
 * pulses together instead of only the slab brightening. */
const BASE_GLOW_LIGHT = 1.5;
const BASE_POOL_LIGHT = 0.8;
/** How far a door snaps up on selection, before the doorway light-spill (spec 07 §Q2) takes over. */
export const SELECT_SNAP_BOOST = 0.35;

/** A hovered door's glow, subtly breathing rather than pinned flat (spec 07
 * §Q4) — bounded to `[base, base + 0.15]`; constant under reduced motion. */
export function hoverPulseIntensity(t: number, base: number, reducedMotion: boolean): number {
  if (reducedMotion) return base + 0.15;
  return base + 0.15 * ((Math.sin(t * 2.2) + 1) / 2);
}

/** Item 7 — door hover feedback: a hovered door's point-light and floor-pool
 * spill breathing in lockstep with its slab glow (same `t * 2.2` envelope as
 * `hoverPulseIntensity`, just scaled to each light's own base intensity so
 * the whole doorway — slab, light, and floor pool — reads as one coherent
 * pulse instead of only the slab brightening). Bounded to
 * `[base, base * (1 + boost)]`; holds at the peak under reduced motion, same
 * guarantee `hoverPulseIntensity` gives. */
export function hoverLightSpill(base: number, t: number, reducedMotion: boolean, boost = 0.4): number {
  const envelope = reducedMotion ? 1 : (Math.sin(t * 2.2) + 1) / 2;
  return base * (1 + boost * envelope);
}

/** T7 — pure envelope for the ambient-flicker dip: 1 outside `[0, duration]`,
 * smoothly leaving and returning to 1, bottoming at `1 - dip` at the
 * midpoint. A single soft dip, never a strobe (matches the door's own
 * "never a strobe" guarantee on its idle pulse). */
export function flickerEnvelope(elapsed: number, duration = 2.2, dip = 0.28): number {
  if (elapsed <= 0 || elapsed >= duration) return 1;
  const p = elapsed / duration;
  return 1 - dip * Math.sin(Math.PI * p);
}

export interface DoorStyle {
  frameColor?: number;
  /** jamb/lintel thickness (ANAMNESIS's carved-wood frame is thick; a
   * sleeker pack can go thin). */
  frameWidth?: number;
  slabColor?: number;
  slabColorSecret?: number;
  glowColor?: number;
  glowColorSecret?: number;
  /** Extra per-door rotation jitter, radians, seeded per door index — 0
   * (ANAMNESIS's default) keeps every door perfectly plumb; a small value
   * reads as "not quite plumb," an intentionally unsettling asymmetry. */
  skewJitter?: number;
  /** Adds a second, slower/odd-frequency sine layered on the idle pulse —
   * 0 (ANAMNESIS's default) is the original single-wave breathing; a small
   * value reads as a faintly unsteady, "faulty fluorescent" quality.
   * Always disabled under reducedMotion, same as the base pulse. */
  unsteadyPulse?: number;
}

/** Deterministic pseudo-random in [-1, 1] from an integer seed — no Math.random
 * so a door's skew is stable across re-renders of the same door row. */
function seededSigned(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/** Item 17 — richer door hover feedback: the frame's own emissive lift on
 * hover, bounded to `[0, peak]`; 0 (unhovered) leaves the frame exactly as
 * dark/inert as it always was. Separate from `hoverPulseIntensity` (the
 * slab) because a real, tested peak that never varies over time reads as
 * "lit," not "breathing" — the frame should feel like it caught the slab's
 * own light, not like a second independent pulse competing for attention. */
export function frameHoverGlow(hovered: boolean, peak = 0.22): number {
  return hovered ? peak : 0;
}

export function createDoors(specs: DoorSpec[], style: DoorStyle = {}): DoorSet {
  const frameColor = style.frameColor ?? 0x241d14;
  const frameWidth = style.frameWidth ?? 0.18;
  const slabColor = style.slabColor ?? 0x2a2014;
  const slabColorSecret = style.slabColorSecret ?? 0x241d33;
  const glowColor = style.glowColor ?? 0xd4b36a;
  const glowColorSecret = style.glowColorSecret ?? 0x8a6fd4;
  const skewJitter = style.skewJitter ?? 0;
  const unsteadyPulse = style.unsteadyPulse ?? 0;
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const slabs = new Map<string, THREE.MeshStandardMaterial>();
  const glows = new Map<string, THREE.PointLight>();
  const pools = new Map<string, THREE.PointLight>();
  const lintels = new Map<string, THREE.Vector3>();
  const phases = new Map<string, number>();
  // Item 17: each door gets its own frame material (previously one FRAME_MAT
  // shared by every door in the row) so only the hovered door's frame can
  // catch a glow — a shared material would light every frame at once.
  const frameMats = new Map<string, THREE.MeshStandardMaterial>();
  let hoveredId: string | null = null;
  let flicker: { doorId: string; startT: number } | null = null;
  const FLICKER_DURATION = 2.2;

  const doorGroups = new Map<string, THREE.Group>();

  const n = specs.length;
  const spacing = 3.4;
  specs.forEach((spec, i) => {
    const x = (i - (n - 1) / 2) * spacing;
    const door = new THREE.Group();
    door.position.set(x, 0, DOOR_Z);
    door.lookAt(CAMERA_HOME);
    if (skewJitter) door.rotation.z += seededSigned(i * 7.31) * skewJitter;

    const doorGlow = spec.secret ? glowColorSecret : glowColor;
    const frameMat = new THREE.MeshStandardMaterial({
      color: frameColor, roughness: 0.75, emissive: doorGlow, emissiveIntensity: 0,
    });
    frameMats.set(spec.id, frameMat);
    const jambL = new THREE.Mesh(new THREE.BoxGeometry(frameWidth, 3.1, 0.3), frameMat);
    jambL.position.set(-0.85, 1.55, 0);
    const jambR = jambL.clone();
    jambR.position.x = 0.85;
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.9, frameWidth, 0.3), frameMat);
    lintel.position.set(0, 3.15, 0);

    const slabMat = new THREE.MeshStandardMaterial({
      color: spec.secret ? slabColorSecret : slabColor,
      emissive: doorGlow,
      emissiveIntensity: BASE_INTENSITY,
      roughness: 0.55,
    });
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 3.0), slabMat);
    slab.position.set(0, 1.55, 0.02);
    slab.userData.doorId = spec.id;
    slabs.set(spec.id, slabMat);
    phases.set(spec.id, i * 1.7);
    meshes.push(slab);

    const glow = new THREE.PointLight(doorGlow, BASE_GLOW_LIGHT, 6, 1.9);
    glow.position.set(0, 1.6, 0.7);
    glow.userData.doorId = spec.id;

    // a soft pool of light on the floor beneath the door — unmistakably an interactive threshold
    const pool = new THREE.PointLight(doorGlow, BASE_POOL_LIGHT, 4.5, 2.1);
    pool.position.set(0, 0.05, 0.9);
    pool.userData.doorId = spec.id;
    glows.set(spec.id, glow);
    pools.set(spec.id, pool);

    door.add(jambL, jambR, lintel, slab, glow, pool);
    group.add(door);

    const lp = new THREE.Vector3(0, 3.5, 0);
    door.localToWorld(lp);
    lintels.set(spec.id, lp);
    doorGroups.set(spec.id, door);
  });

  // Outer jamb edge (half-width) and lintel-top height, matching the frame
  // geometry above (jamb centers at ±0.85, lintel at y 3.15) plus half the
  // (possibly overridden) frame thickness.
  const FRAME_HALF_WIDTH = 0.85 + frameWidth / 2;
  const FRAME_TOP_Y = 3.15 + frameWidth / 2;

  return {
    group,
    meshes,
    setHover(id) {
      hoveredId = id;
    },
    lintel(id) {
      return lintels.get(id) ?? new THREE.Vector3();
    },
    frameCorners(id) {
      const door = doorGroups.get(id);
      if (!door) return null;
      const local = [
        new THREE.Vector3(-FRAME_HALF_WIDTH, 0, 0),
        new THREE.Vector3(-FRAME_HALF_WIDTH, FRAME_TOP_Y, 0),
        new THREE.Vector3(FRAME_HALF_WIDTH, 0, 0),
        new THREE.Vector3(FRAME_HALF_WIDTH, FRAME_TOP_Y, 0),
      ];
      return local.map((v) => door.localToWorld(v.clone()));
    },
    tick(t, reducedMotion = false) {
      if (flicker && t - flicker.startT >= FLICKER_DURATION) flicker = null;
      for (const [doorId, frameMat] of frameMats) {
        frameMat.emissiveIntensity = frameHoverGlow(doorId === hoveredId);
      }
      for (const [doorId, mat] of slabs) {
        if (doorId === hoveredId) {
          mat.emissiveIntensity = hoverPulseIntensity(t, BASE_INTENSITY, reducedMotion);
          const glow = glows.get(doorId);
          if (glow) glow.intensity = hoverLightSpill(BASE_GLOW_LIGHT, t, reducedMotion);
          const pool = pools.get(doorId);
          if (pool) pool.intensity = hoverLightSpill(BASE_POOL_LIGHT, t, reducedMotion);
        } else {
          // T7 ambient flicker: found in code review (2026-07-15) that this
          // factor only ever multiplied the slab's own emissive intensity
          // (below) — the door's point-light and floor-pool stayed pinned
          // to their base intensity every frame, so the light spill never
          // dimmed in sync with the visibly flickering door. Computed once
          // here and applied to all three so they read as one effect.
          const flickerFactor =
            flicker && flicker.doorId === doorId ? flickerEnvelope(t - flicker.startT, FLICKER_DURATION) : 1;
          const glow = glows.get(doorId);
          if (glow) glow.intensity = BASE_GLOW_LIGHT * flickerFactor;
          const pool = pools.get(doorId);
          if (pool) pool.intensity = BASE_POOL_LIGHT * flickerFactor;
          const phase = phases.get(doorId) ?? 0;
          let intensity = BASE_INTENSITY + Math.sin(t * 1.4 + phase) * PULSE_AMPLITUDE;
          // A second, slower, odd-frequency wave layered on top — a small,
          // continuous unsteadiness, never a strobe. Disabled under
          // reducedMotion, same guarantee the base pulse already gives.
          if (unsteadyPulse && !reducedMotion) {
            intensity += Math.sin(t * 0.37 + phase * 2.3) * unsteadyPulse;
          }
          mat.emissiveIntensity = intensity * flickerFactor;
        }
      }
    },
    snapSelected(id) {
      const mat = slabs.get(id);
      if (mat) mat.emissiveIntensity = BASE_INTENSITY + SELECT_SNAP_BOOST;
    },
    triggerAmbientFlicker(t) {
      const candidates = [...slabs.keys()].filter((id) => id !== hoveredId);
      if (candidates.length === 0) return;
      const doorId = candidates[Math.floor(Math.random() * candidates.length)];
      flicker = { doorId, startT: t };
    },
    dispose() {
      group.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          if (o.material instanceof THREE.Material) o.material.dispose();
        }
      });
    },
  };
}
