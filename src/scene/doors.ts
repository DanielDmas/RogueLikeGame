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
  tick(t: number): void;
  dispose(): void;
}

const FRAME_MAT = new THREE.MeshStandardMaterial({ color: 0x241d14, roughness: 0.75 });

/** Matches SceneDirector's camera home position — doors face the viewer, not a point behind them. */
const CAMERA_HOME = new THREE.Vector3(0, 1.6, 7.6);
export const DOOR_Z = -5.6;

const BASE_INTENSITY = 0.42;
const HOVER_INTENSITY = 0.85;
const PULSE_AMPLITUDE = 0.08;

export function createDoors(specs: DoorSpec[]): DoorSet {
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const slabs = new Map<string, THREE.MeshStandardMaterial>();
  const lintels = new Map<string, THREE.Vector3>();
  const phases = new Map<string, number>();
  let hoveredId: string | null = null;

  const doorGroups = new Map<string, THREE.Group>();

  const n = specs.length;
  const spacing = 3.4;
  specs.forEach((spec, i) => {
    const x = (i - (n - 1) / 2) * spacing;
    const door = new THREE.Group();
    door.position.set(x, 0, DOOR_Z);
    door.lookAt(CAMERA_HOME);

    const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.1, 0.3), FRAME_MAT);
    jambL.position.set(-0.85, 1.55, 0);
    const jambR = jambL.clone();
    jambR.position.x = 0.85;
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.18, 0.3), FRAME_MAT);
    lintel.position.set(0, 3.15, 0);

    const slabMat = new THREE.MeshStandardMaterial({
      color: spec.secret ? 0x241d33 : 0x2a2014,
      emissive: spec.secret ? 0x8a6fd4 : 0xd4b36a,
      emissiveIntensity: BASE_INTENSITY,
      roughness: 0.55,
    });
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 3.0), slabMat);
    slab.position.set(0, 1.55, 0.02);
    slab.userData.doorId = spec.id;
    slabs.set(spec.id, slabMat);
    phases.set(spec.id, i * 1.7);
    meshes.push(slab);

    const glow = new THREE.PointLight(spec.secret ? 0x8a6fd4 : 0xd4b36a, 1.5, 6, 1.9);
    glow.position.set(0, 1.6, 0.7);

    // a soft pool of light on the floor beneath the door — unmistakably an interactive threshold
    const pool = new THREE.PointLight(spec.secret ? 0x8a6fd4 : 0xd4b36a, 0.8, 4.5, 2.1);
    pool.position.set(0, 0.05, 0.9);

    door.add(jambL, jambR, lintel, slab, glow, pool);
    group.add(door);

    const lp = new THREE.Vector3(0, 3.5, 0);
    door.localToWorld(lp);
    lintels.set(spec.id, lp);
    doorGroups.set(spec.id, door);
  });

  // Outer jamb edge (half-width) and lintel-top height, matching the frame
  // geometry above (jamb centers at ±0.85, width 0.18; lintel at y 3.15, height 0.18).
  const FRAME_HALF_WIDTH = 0.94;
  const FRAME_TOP_Y = 3.24;

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
    tick(t) {
      for (const [doorId, mat] of slabs) {
        if (doorId === hoveredId) {
          mat.emissiveIntensity = HOVER_INTENSITY;
        } else {
          const phase = phases.get(doorId) ?? 0;
          mat.emissiveIntensity = BASE_INTENSITY + Math.sin(t * 1.4 + phase) * PULSE_AMPLITUDE;
        }
      }
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
