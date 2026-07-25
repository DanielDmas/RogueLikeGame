// Room dioramas (spec 07 §Q1) — small, generated backdrop vignettes so each
// bespoke room reads as *somewhere* rather than just "the current act theme
// again". No textures/models: flat-color/emissive MeshStandardMaterial
// silhouettes plus at most 2 lights, same generated-geometry look as
// themes.ts and doors.ts. Placed behind the door row (z ≈ -7.5, still
// clearly behind DOOR_Z = -5.6 with margin) so they never intersect the
// door row or the Usher's walk path (x ∈ [-7, 7], z ∈ [-1, 4]) — moved
// closer than the original -10 (owner: dioramas should read bigger/closer/
// more of the screen), paired with the uniform group-scale boost in
// director.ts's setDiorama so every existing diorama gains presence without
// any of their individual object layouts needing to be touched.
import * as THREE from 'three';

export interface Diorama {
  group: THREE.Group;
  /** subtle idle motion; caller skips calling this under reducedMotion */
  tick(t: number): void;
  /** disposes every geometry/material owned by this diorama (lights need no disposal) */
  dispose(): void;
  /** optional per-room accent toggle — currently only `marys-room` uses this
   * (spec 07 §Q1 motif table), lighting its one saturated cube once the
   * `open-drawer` choice outcome has played. */
  setAccent?(on: boolean): void;
}

export const DIORAMA_Z = -7.5;

export function mat(color: number, emissive = 0x000000, emissiveIntensity = 0, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity, roughness: 0.85, ...opts });
}

export function box(w: number, h: number, d: number, material: THREE.MeshStandardMaterial): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}

export function trackDispose(group: THREE.Group): () => void {
  return () => {
    group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material.dispose();
      }
    });
  };
}

// ---------- junction: converging rails, a lever stand ----------
function junctionDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const light = new THREE.PointLight(0xdfe6ff, 1.1, 6, quality === 'high' ? 2 : 1.4);
  const railMat = mat(0x1a1a1e, 0x9db4e8, 0.15);
  const rails: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const rail = box(0.06, 0.06, 6, railMat);
    rail.position.set(side * 1.4, 0.03, 0);
    rail.rotation.y = side * 0.12;
    rails.push(rail);
    group.add(rail);
  }
  const leverPost = box(0.08, 1.1, 0.08, mat(0x241d14));
  leverPost.position.set(1.8, 0.55, 1.6);
  const leverArm = box(0.06, 0.6, 0.06, mat(0x3a2f1e));
  leverArm.position.set(1.8, 1.15, 1.6);
  leverArm.rotation.z = 0.5;
  group.add(leverPost, leverArm);
  light.position.set(0, 1.2, 1);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- experience-machine: reclined cradle + cable arcs ----------
function experienceMachineDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const cradle = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.3, 6, 10), mat(0x14171c, 0x2fb8c9, 0.35));
  cradle.rotation.z = Math.PI / 2;
  cradle.position.set(0, 0.6, 0);
  group.add(cradle);
  const cables: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const cable = new THREE.Mesh(new THREE.TorusGeometry(0.9 + i * 0.15, 0.02, 6, 20, Math.PI), mat(0x101418, 0x2fb8c9, 0.25));
    cable.position.set(0, 0.6, 0);
    cable.rotation.y = Math.PI / 2;
    cables.push(cable);
    group.add(cable);
  }
  const glow = new THREE.PointLight(0x2fb8c9, 0.9, 5, quality === 'high' ? 2 : 1.4);
  glow.position.set(0, 0.6, 0.4);
  group.add(glow);
  return {
    group,
    tick(t) {
      glow.intensity = 0.7 + Math.sin(t * 0.6) * 0.2;
    },
    dispose: trackDispose(group),
  };
}

// ---------- ship: mast + boom + rigging lines, slow sway ----------
function shipDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const woodMat = mat(0x241d14);
  const mast = box(0.1, 3, 0.1, woodMat);
  mast.position.set(0, 1.5, 0);
  const boom = box(1.6, 0.08, 0.08, woodMat);
  boom.position.set(0.7, 2.1, 0);
  group.add(mast, boom);
  const riggingMat = mat(0x14110c);
  const rigging: THREE.Mesh[] = [];
  for (const dx of [-0.9, 0, 0.9]) {
    const line = box(0.02, 2.6, 0.02, riggingMat);
    line.position.set(dx, 1.4, 0.1);
    line.rotation.z = dx * -0.12;
    rigging.push(line);
    group.add(line);
  }
  const light = new THREE.PointLight(0xc9a06a, 0.7, 5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 2, 1);
  group.add(light);
  return {
    group,
    tick(t) {
      group.rotation.z = Math.sin(t * 0.25) * ((0.5 * Math.PI) / 180);
    },
    dispose: trackDispose(group),
  };
}

// ---------- casino-pascal: neon arch, flicker ----------
function casinoPascalDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 1.2, DIORAMA_Z);
  const neonMat = mat(0x140a04, 0xd4306a, 1.4);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.05, 8, quality === 'high' ? 24 : 14, Math.PI), neonMat);
  group.add(arch);
  const glow = new THREE.PointLight(0xd4306a, 1.2, 6, 2);
  glow.position.set(0, 0, 0.6);
  group.add(glow);
  return {
    group,
    tick() {
      const flicker = Math.random() > 0.96 ? 0.3 : 1.4;
      neonMat.emissiveIntensity = flicker;
      glow.intensity = flicker * 0.8;
    },
    dispose: trackDispose(group),
  };
}

// ---------- omelas: strung lanterns over one tiny door ----------
function omelasDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const doorMat = mat(0x1c1710, 0x8a6a3a, 0.25);
  const tinyDoor = box(0.5, 0.9, 0.05, doorMat);
  tinyDoor.position.set(0, 0.45, 0);
  group.add(tinyDoor);
  const lanternCount = 5;
  const lanternMat = mat(0x2a2010, 0xf0c060, 1.1);
  const lanterns: THREE.Mesh[] = [];
  for (let i = 0; i < lanternCount; i++) {
    const x = (i / (lanternCount - 1) - 0.5) * 2.4;
    const sag = Math.sin((i / (lanternCount - 1)) * Math.PI) * 0.4;
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.08, quality === 'high' ? 8 : 5, quality === 'high' ? 6 : 4), lanternMat);
    lantern.position.set(x, 1.9 - sag, 0.2);
    lanterns.push(lantern);
    group.add(lantern);
  }
  const light = new THREE.PointLight(0xf0c060, 0.9, 5, 2);
  light.position.set(0, 1.7, 0.3);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- teleporter: two circular pads, one faintly lit ----------
function teleporterDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.02, DIORAMA_Z);
  const padSegments = quality === 'high' ? 24 : 14;
  const padA = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.05, padSegments), mat(0x14171c, 0x9db4e8, 0.3));
  padA.position.set(-1, 0, 0);
  const padB = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.05, padSegments), mat(0x14171c, 0x9db4e8, 0.08));
  padB.position.set(1, 0, -0.6);
  group.add(padA, padB);
  const light = new THREE.PointLight(0x9db4e8, 0.9, 5, 2);
  light.position.set(-1, 0.6, 0.4);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- editor: wall of drawer-fronts, one ajar and lit ----------
function editorDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.6, DIORAMA_Z);
  const rows = 3;
  const cols = quality === 'high' ? 4 : 3;
  const drawerMat = mat(0x241d14);
  const litDrawerMat = mat(0x2e2416, 0xd4b36a, 0.5);
  let litIndex = Math.floor((rows * cols) / 2);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const drawer = box(0.5, 0.28, 0.05, i === litIndex ? litDrawerMat : drawerMat);
      drawer.position.set((c - (cols - 1) / 2) * 0.55, (r - (rows - 1) / 2) * 0.34, i === litIndex ? 0.08 : 0);
      group.add(drawer);
      i++;
    }
  }
  const light = new THREE.PointLight(0xd4b36a, 0.7, 4, 2);
  light.position.set(0, 0, 0.5);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- debt-of-dead: bedside chair + IV pole, warm low lamp ----------
function debtOfDeadDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const chairMat = mat(0x1c1710);
  const seat = box(0.5, 0.08, 0.5, chairMat);
  seat.position.set(0, 0.42, 0);
  const back = box(0.5, 0.6, 0.06, chairMat);
  back.position.set(0, 0.72, -0.22);
  group.add(seat, back);
  const poleSegments = quality === 'high' ? 8 : 5;
  const poleMat = mat(0x22262c, 0x9db4e8, 0.1);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6, poleSegments), poleMat);
  pole.position.set(0.8, 0.8, 0);
  const bag = new THREE.Mesh(new THREE.SphereGeometry(0.08, poleSegments, 6), mat(0x2a3038, 0x9db4e8, 0.2));
  bag.position.set(0.8, 1.5, 0);
  group.add(pole, bag);
  const lamp = new THREE.PointLight(0xe8b06a, 0.6, 4, 2.2);
  lamp.position.set(-0.6, 0.9, 0.3);
  group.add(lamp);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- boulder: slope diagonal + a great sphere at rest ----------
function boulderDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const slope = box(4, 0.15, 2, mat(0x1a1610));
  slope.position.set(0, 0.3, 0);
  slope.rotation.z = 0.28;
  group.add(slope);
  const boulder = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, quality === 'high' ? 1 : 0), mat(0x161310, 0x8a6a3a, 0.1));
  boulder.position.set(-0.6, 0.95, 0.1);
  group.add(boulder);
  const light = new THREE.PointLight(0xe8a05a, 0.7, 5, 2);
  light.position.set(0.5, 1.2, 0.6);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- marys-room: grey shelving; one saturated red cube ----------
function marysRoomDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.5, DIORAMA_Z);
  const shelfMat = mat(0x2a2a2a);
  for (let i = 0; i < 3; i++) {
    const shelf = box(1.8, 0.05, 0.4, shelfMat);
    shelf.position.set(0, i * 0.5 - 0.5, 0);
    group.add(shelf);
  }
  const cubeMat = mat(0x2a2a2a, 0x000000, 0);
  const cube = box(0.22, 0.22, 0.22, cubeMat);
  cube.position.set(0.2, -0.35, 0.15);
  group.add(cube);
  const light = new THREE.PointLight(0xcfcfcf, 0.6, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.2, 0.6);
  group.add(light);
  let accentOn = false;
  return {
    group,
    tick() {},
    dispose: trackDispose(group),
    setAccent(on: boolean) {
      if (on === accentOn) return;
      accentOn = on;
      cubeMat.color.setHex(on ? 0xb31d1d : 0x2a2a2a);
      cubeMat.emissive.setHex(on ? 0xd4306a : 0x000000);
      cubeMat.emissiveIntensity = on ? 0.9 : 0;
    },
  };
}

// ---------- chinese-room: a booth box with a glowing paper slot ----------
function chineseRoomDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.6, DIORAMA_Z);
  const booth = box(1.0, 1.4, 0.9, mat(0x201a12));
  group.add(booth);
  const slot = box(0.5, 0.08, 0.02, mat(0x2e2416, 0xd4b36a, 1.1));
  slot.position.set(0, 0.1, 0.46);
  group.add(slot);
  const light = new THREE.PointLight(0xd4b36a, 0.6, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.1, 0.8);
  group.add(light);
  return {
    group,
    tick(t) {
      (slot.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9 + Math.sin(t * 1.3) * 0.2;
    },
    dispose: trackDispose(group),
  };
}

// ---------- newcomb-annex: two boxes on a plinth, one wireframe ----------
function newcombAnnexDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const plinth = box(1.6, 0.15, 0.7, mat(0x201a12));
  plinth.position.set(0, 0.35, 0);
  group.add(plinth);
  const glass = box(0.4, 0.4, 0.4, mat(0x111111, 0x9db4e8, 0.3, { wireframe: true }));
  glass.position.set(-0.45, 0.62, 0);
  const steel = box(0.4, 0.4, 0.4, mat(0x2a2a2a));
  steel.position.set(0.45, 0.62, 0);
  group.add(glass, steel);
  const light = new THREE.PointLight(0x9db4e8, 0.6, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 1, 0.5);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- veil-of-ignorance: twelve tiny house gables, one lit ----------
function veilOfIgnoranceDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.15, DIORAMA_Z);
  const houseCount = quality === 'high' ? 12 : 8;
  const litIndex = Math.min(7, houseCount - 1);
  const houseMat = mat(0x1c1710);
  const litHouseMat = mat(0x2e2416, 0xf0c060, 0.9);
  for (let i = 0; i < houseCount; i++) {
    const x = (i / (houseCount - 1) - 0.5) * 3.2;
    const gable = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.16, 4), i === litIndex ? litHouseMat : houseMat);
    gable.position.set(x, 0.08, 0);
    gable.rotation.y = Math.PI / 4;
    group.add(gable);
  }
  const light = new THREE.PointLight(0xf0c060, 0.5, 3, 2);
  light.position.set((litIndex / (houseCount - 1) - 0.5) * 3.2, 0.3, 0.3);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- buridans-queue: two identical doorframes + a hanging clock ----------
// Re-detailed 2026-07-21 (player-perspective pass) alongside waiting-room:
// two real bugs found together. (1) The room's own beats say the clock has
// "hands, unlike anywhere else in this place" — an explicit callback to the
// prologue's handless clock — but this diorama drew the same bare glowing
// disc as that one, contradicting its own text. Gave it two hands (still no
// ticks/numerals, matching this diorama's plainer style). (2) The torus
// "doorframes" had only 10-16 tubular segments — visibly octagonal at this
// scale instead of the ring shape the room's text implies — raised to
// match the clock rim's segment count from the waiting-room fix. Also
// dropped the whole motif's vertical placement (frames 0.9->0.6, clock
// 1.6->1.15): at the old heights, DIORAMA_Y_LIFT (added since this diorama
// was authored) pushed the clock to the very top edge of frame, visible
// only as a sliver — confirmed live via a screenshot before this fix.
function buridansQueueDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const frameMat = mat(0x201a12);
  const ringSegments = quality === 'high' ? 32 : 22;
  for (const side of [-1, 1]) {
    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 8, ringSegments), frameMat);
    frame.position.set(side * 0.9, 0.6, 0);
    group.add(frame);
  }
  const clockPos = new THREE.Vector3(0, 0.98, 0);
  const clockMat = mat(0x14110c, 0xd4b36a, 0.4);
  const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, ringSegments), clockMat);
  clock.position.copy(clockPos);
  clock.rotation.x = Math.PI / 2;
  group.add(clock);
  const handMat = mat(0x0c0a06, 0x0c0a06, 0);
  const hourHand = box(0.02, 0.1, 0.012, handMat);
  hourHand.position.set(clockPos.x - 0.03, clockPos.y + 0.03, clockPos.z + 0.03);
  hourHand.rotation.z = -0.5;
  const minuteHand = box(0.016, 0.15, 0.012, handMat);
  minuteHand.position.set(clockPos.x + 0.02, clockPos.y + 0.05, clockPos.z + 0.03);
  minuteHand.rotation.z = 1.9;
  group.add(hourHand, minuteHand);
  const light = new THREE.PointLight(0xd4b36a, 0.6, 4, 2);
  light.position.set(0, 0.95, 0.5);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- the-reference: a desk + anglepoise lamp cone ----------
function theReferenceDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const desk = box(1.2, 0.06, 0.6, mat(0x241d14));
  desk.position.set(0, 0.55, 0);
  group.add(desk);
  const lampArm = box(0.03, 0.5, 0.03, mat(0x14110c));
  lampArm.position.set(0.4, 0.85, 0);
  lampArm.rotation.z = 0.35;
  const lampCone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, quality === 'high' ? 12 : 7, 1, true), mat(0x1c1712, 0xf0d9a0, 1.2));
  lampCone.position.set(0.55, 1.05, 0);
  lampCone.rotation.z = Math.PI;
  group.add(lampArm, lampCone);
  const light = new THREE.PointLight(0xf0d9a0, 0.8, 4, 2);
  light.position.set(0.55, 0.95, 0.15);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- butterfly-dream: paper wall panels, backlit; suspended wings ----------
function butterflyDreamDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.6, DIORAMA_Z);
  const panelMat = mat(0x2c2418, 0xf0d9a0, 0.22);
  for (let i = 0; i < 3; i++) {
    const panel = box(0.9, 1.3, 0.03, panelMat);
    panel.position.set((i - 1) * 0.95, 0, -0.1);
    group.add(panel);
  }
  const wingMat = mat(0x1c1a24, 0x9db4e8, 0.5);
  const wingL = new THREE.Mesh(new THREE.CircleGeometry(0.14, quality === 'high' ? 10 : 6, 0, Math.PI), wingMat);
  wingL.position.set(-0.1, 0.1, 0.3);
  wingL.rotation.z = 0.3;
  const wingR = wingL.clone();
  wingR.position.x = 0.1;
  wingR.rotation.z = Math.PI - 0.3;
  group.add(wingL, wingR);
  const light = new THREE.PointLight(0xf0d9a0, 0.6, 4, 2);
  light.position.set(0, 0.4, 0.6);
  group.add(light);
  return {
    group,
    tick(t) {
      const flap = Math.sin(t * 2.2) * 0.15;
      wingL.rotation.z = 0.3 + flap;
      wingR.rotation.z = Math.PI - 0.3 - flap;
    },
    dispose: trackDispose(group),
  };
}

// ---------- swampman: two chairs facing, a reflecting puddle ----------
function swampmanDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const chairMat = mat(0x1c1710);
  for (const side of [-1, 1]) {
    const seat = box(0.35, 0.06, 0.35, chairMat);
    seat.position.set(side * 0.6, 0.3, 0);
    const back = box(0.35, 0.4, 0.05, chairMat);
    back.position.set(side * 0.6, 0.5, side * -0.16);
    group.add(seat, back);
  }
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.5, quality === 'high' ? 20 : 12), mat(0x0c1418, 0x2a3a4a, 0.35));
  puddle.rotation.x = -Math.PI / 2;
  puddle.position.set(0, 0.02, 0);
  group.add(puddle);
  const light = new THREE.PointLight(0x9db4e8, 0.5, 4, 2);
  light.position.set(0, 0.6, 0.4);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- the-cave: fire light + 3 flat shadow figures on a wall ----------
function theCaveDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.8, DIORAMA_Z);
  const wall = box(2.4, 1.6, 0.05, mat(0x18140f));
  wall.position.set(0, 0, -0.3);
  group.add(wall);
  const shadowMat = mat(0x0a0806);
  const figures: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const figure = box(0.14, 0.6, 0.02, shadowMat);
    figure.position.set((i - 1) * 0.6, -0.2, -0.27);
    figures.push(figure);
    group.add(figure);
  }
  const fire = new THREE.PointLight(0xe8752e, 1.2, 5, quality === 'high' ? 2 : 1.4);
  fire.position.set(0, -0.4, 0.6);
  group.add(fire);
  return {
    group,
    tick(t) {
      fire.intensity = 1.0 + Math.sin(t * 4) * 0.15 + (Math.random() > 0.9 ? 0.2 : 0);
      figures.forEach((f, i) => {
        f.scale.y = 1 + Math.sin(t * 3 + i) * 0.03;
      });
    },
    dispose: trackDispose(group),
  };
}

// ---------- Understory trio: shared family — bare hanging bulbs + shelving depths ----------
function understoryDiorama(accentColor: number, quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.4, DIORAMA_Z);
  const shelfMat = mat(0x18140f);
  for (let i = 0; i < 4; i++) {
    const shelf = box(2.2, 0.04, 0.5, shelfMat);
    shelf.position.set(0, i * 0.4 - 0.6, -i * 0.3);
    group.add(shelf);
  }
  const bulbMat = mat(0x2c2010, accentColor, 0.8);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, quality === 'high' ? 8 : 5, quality === 'high' ? 6 : 4), bulbMat);
  bulb.position.set(0, 0.9, 0.2);
  group.add(bulb);
  const light = new THREE.PointLight(accentColor, 0.7, 4, 2);
  light.position.set(0, 0.8, 0.3);
  group.add(light);
  return {
    group,
    tick(t) {
      light.intensity = 0.6 + Math.sin(t * 0.9) * 0.1;
    },
    dispose: trackDispose(group),
  };
}

// ---------- waiting-room (prologue): a bench, a handless clock, a recursive window ----------
// Re-detailed 2026-07-21 after a player-perspective pass: this is the first
// diorama every player ever sees, and it was authored back when dioramas sat
// at z = -10 with no scale multiplier — small and distant. At today's
// DIORAMA_SCALE/DIORAMA_Z (plus the director's lift clearing the text panel)
// its primitives are seen roughly 5x larger, where a solid bench slab read as
// an untextured grey block and a pale emissive disc read as a white blob
// rather than a clock. Same vocabulary as every other diorama here (flat
// colour/emissive primitives, one light) — just given the silhouette detail
// the larger on-screen size now demands, rather than being shrunk back down.
function waitingRoomDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.4, DIORAMA_Z);

  // Bench: slatted, not a solid slab — the gaps are what make it read as
  // waiting-room furniture at this size. Same overall footprint as before.
  const benchMat = mat(0x22262b);
  const benchX = -0.4;
  for (let i = 0; i < 4; i++) {
    const slat = box(1.3, 0.045, 0.06, benchMat);
    slat.position.set(benchX, 0, -0.135 + i * 0.09);
    group.add(slat);
  }
  for (let i = 0; i < 3; i++) {
    const slat = box(1.3, 0.075, 0.035, benchMat);
    slat.position.set(benchX, 0.13 + i * 0.12, -0.16);
    group.add(slat);
  }
  for (const side of [-1, 1]) {
    const leg = box(0.055, 0.34, 0.28, benchMat);
    leg.position.set(benchX + side * 0.6, -0.19, -0.02);
    group.add(leg);
  }

  // The handless clock: a real dial — dark rim, dim face, tick marks, and
  // deliberately no hands. Read small it was just "a clock"; read large the
  // missing hands become the point (the room has no time in it), so the
  // detail earns the scale instead of fighting it. Emissive dialled well
  // down from the original 0.35 — a lit dial, not a light source.
  // Hung on the back wall above the bench, not over the window — at this
  // scale the two overlapped into one cluttered shape. Bench below, clock
  // above it, window off to the right reads as an actual room.
  const clockPos = new THREE.Vector3(-0.35, 0.74, -0.3);
  // Segment counts stay generous even on `quality: 'low'` (which is the
  // default for new profiles, so it is what most players actually see): a
  // 12-sided cylinder read as a visible polygon at this size, and a couple
  // of dozen segments on two small cylinders is a negligible cost next to
  // the per-theme particle fields.
  const rimSegments = quality === 'high' ? 28 : 20;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.04, rimSegments), mat(0x171a1e));
  rim.position.copy(clockPos);
  rim.rotation.x = Math.PI / 2;
  const face = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.02, rimSegments),
    mat(0x1c1f24, 0xd8dde3, 0.16),
  );
  face.position.set(clockPos.x, clockPos.y, clockPos.z + 0.02);
  face.rotation.x = Math.PI / 2;
  group.add(rim, face);
  const tickMat = mat(0x2a2e33, 0xd8dde3, 0.3);
  const tickCount = 12;
  for (let i = 0; i < tickCount; i++) {
    const a = (i / tickCount) * Math.PI * 2;
    const tick = box(0.014, 0.03, 0.012, tickMat);
    tick.position.set(clockPos.x + Math.cos(a) * 0.122, clockPos.y + Math.sin(a) * 0.122, clockPos.z + 0.03);
    tick.rotation.z = a;
    group.add(tick);
  }

  // A window behind which is more window — two overlapping pale panes at
  // different depths, the second slightly smaller (the recursion never
  // quite resolves, the way the room's own prose describes it). Framed and
  // mullioned so it reads as a window rather than a glowing rectangle, with
  // the emissive cut hard (0.35/0.5 -> 0.12/0.18) for the same reason.
  const paneA = box(0.5, 0.7, 0.02, mat(0x2a2e33, 0xc7d6e8, 0.12));
  paneA.position.set(0.75, 0.55, -0.5);
  const paneB = box(0.38, 0.55, 0.02, mat(0x2a2e33, 0xc7d6e8, 0.18));
  paneB.position.set(0.75, 0.55, -0.65);
  group.add(paneA, paneB);
  const frameMat = mat(0x191c20);
  for (const [w, h, dx, dy] of [
    [0.56, 0.03, 0, 0.365],
    [0.56, 0.03, 0, -0.365],
    [0.03, 0.73, -0.265, 0],
    [0.03, 0.73, 0.265, 0],
  ] as const) {
    const bar = box(w, h, 0.035, frameMat);
    bar.position.set(0.75 + dx, 0.55 + dy, -0.49);
    group.add(bar);
  }
  const mullionV = box(0.018, 0.7, 0.03, frameMat);
  mullionV.position.set(0.75, 0.55, -0.485);
  const mullionH = box(0.5, 0.018, 0.03, frameMat);
  mullionH.position.set(0.75, 0.55, -0.485);
  group.add(mullionV, mullionH);

  // One light, softened (0.55 -> 0.38): the shared front-fill light that
  // `setDiorama` now adds for every diorama does most of the work, so the
  // original value double-lit these surfaces into flat pale grey.
  const light = new THREE.PointLight(0xc7d6e8, 0.38, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0.7, 0.8, 0);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- wallet: an open wallet on a floor mat, warm light spilling under a door ----------
function walletDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.02, DIORAMA_Z);
  const mat_ = box(0.9, 0.01, 0.5, mat(0x14110c));
  group.add(mat_);
  const leatherMat = mat(0x3a2c1e);
  const leafA = box(0.24, 0.015, 0.17, leatherMat);
  leafA.position.set(-0.06, 0.01, 0);
  leafA.rotation.z = -0.12;
  const leafB = box(0.24, 0.015, 0.17, leatherMat);
  leafB.position.set(0.1, 0.01, 0.02);
  leafB.rotation.z = 0.18;
  group.add(leafA, leafB);
  const cashMat = mat(0x2e2a1c, 0xd4c69a, 0.35);
  for (let i = 0; i < 3; i++) {
    const bill = box(0.16, 0.005, 0.08, cashMat);
    bill.position.set(0.08 + i * 0.01, 0.02 + i * 0.008, 0.03 - i * 0.01);
    bill.rotation.y = i * 0.15;
    group.add(bill);
  }
  // Warm light spilling from under a door at the back of the corridor.
  const doorGlow = box(0.7, 0.015, 0.04, mat(0x2e2416, 0xf0c060, 0.9));
  doorGlow.position.set(0, 0.005, -0.4);
  group.add(doorGlow);
  const light = new THREE.PointLight(0xd4b36a, 0.55, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.4, -0.3);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- promotion: a desk, a screen glowing aquarium-blue with an error ----------
function promotionDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const desk = box(1.1, 0.06, 0.55, mat(0x201a12));
  desk.position.set(0, 0.5, 0);
  group.add(desk);
  const screenMat = mat(0x0c0e10, 0x9db4e8, 0.85);
  const screen = box(0.48, 0.32, 0.03, screenMat);
  screen.position.set(0, 0.78, -0.15);
  const stand = box(0.05, 0.14, 0.05, mat(0x14110c));
  stand.position.set(0, 0.6, -0.15);
  group.add(screen, stand);
  // A single highlighted line on the screen — the decimal's worth of catastrophe.
  const errorLine = box(0.3, 0.02, 0.005, mat(0x0c0e10, 0xd4603a, 1.1));
  errorLine.position.set(0, 0.72, -0.13);
  group.add(errorLine);
  const light = new THREE.PointLight(0x9db4e8, 0.65, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.9, 0.2);
  group.add(light);
  return {
    group,
    tick(t) {
      screenMat.emissiveIntensity = 0.8 + Math.sin(t * 1.7) * 0.08;
    },
    dispose: trackDispose(group),
  };
}

// ---------- beggars-math: a rain-shelter, a folded figure, a phone's cool glow ----------
function beggarsMathDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const shelterMat = mat(0x14171c, 0x1c232c, 0.15);
  const roof = box(1.1, 0.04, 0.6, shelterMat);
  roof.position.set(0, 1.1, 0);
  const backWall = box(1.1, 1.1, 0.03, shelterMat);
  backWall.position.set(0, 0.55, -0.28);
  const sidePanel = box(0.03, 1.1, 0.6, shelterMat);
  sidePanel.position.set(-0.53, 0.55, 0);
  group.add(roof, backWall, sidePanel);
  const figureMat = mat(0x0e0f11);
  const figure = new THREE.Mesh(new THREE.SphereGeometry(0.22, quality === 'high' ? 12 : 7, quality === 'high' ? 8 : 5), figureMat);
  figure.position.set(-0.25, 0.24, 0.1);
  figure.scale.set(1, 0.85, 1);
  group.add(figure);
  const phoneMat = mat(0x1c1f24, 0x9db4e8, 1.0);
  const phone = box(0.05, 0.09, 0.005, phoneMat);
  phone.position.set(-0.1, 0.32, 0.22);
  phone.rotation.y = -0.4;
  group.add(phone);
  const light = new THREE.PointLight(0x9db4e8, 0.4, 3, quality === 'high' ? 2 : 1.4);
  light.position.set(-0.1, 0.35, 0.3);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- quiet-alarm: a wall, a hand on a doorknob, sound rippling through ----------
function quietAlarmDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.4, DIORAMA_Z);
  const doorMat = mat(0x1c1712);
  const door = box(0.5, 1.3, 0.05, doorMat);
  door.position.set(0, 0.2, 0);
  group.add(door);
  const knobMat = mat(0x3a3226, 0xd4b36a, 0.3);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, quality === 'high' ? 10 : 6, quality === 'high' ? 8 : 5), knobMat);
  knob.position.set(0.18, 0.2, 0.06);
  group.add(knob);
  const ringSegments = quality === 'high' ? 20 : 12;
  const rings = [0.32, 0.5].map((r) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 4, ringSegments), mat(0x2a2e33, 0x9db4e8, 0.4));
    ring.position.set(0, 0.2, -0.4);
    group.add(ring);
    return ring;
  });
  const light = new THREE.PointLight(0x9db4e8, 0.4, 3, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.5, 0.3);
  group.add(light);
  return {
    group,
    tick(t) {
      rings.forEach((r, i) => {
        const s = 1 + ((t * 0.4 + i * 0.5) % 1) * 0.4;
        r.scale.set(s, s, 1);
        (r.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 1 - ((t * 0.4 + i * 0.5) % 1));
      });
    },
    dispose: trackDispose(group),
  };
}

// ---------- dinner-table: a small table, two cups of tea gone cold ----------
function dinnerTableDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const tableMat = mat(0x241d14);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04, quality === 'high' ? 20 : 12), tableMat);
  top.position.set(0, 0.5, 0);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, quality === 'high' ? 10 : 6), tableMat);
  leg.position.set(0, 0.25, 0);
  group.add(top, leg);
  const cupMat = mat(0x2c261c, 0xe8d9b8, 0.15);
  const cupA = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.06, quality === 'high' ? 12 : 7), cupMat);
  cupA.position.set(-0.15, 0.55, 0.1);
  const cupB = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.06, quality === 'high' ? 12 : 7), cupMat);
  cupB.position.set(0.16, 0.55, -0.08);
  group.add(cupA, cupB);
  const chairMat = mat(0x1c1710);
  const seat = box(0.32, 0.04, 0.32, chairMat);
  seat.position.set(0, 0.32, 0.55);
  const back = box(0.32, 0.36, 0.04, chairMat);
  back.position.set(0, 0.52, 0.7);
  group.add(seat, back);
  const light = new THREE.PointLight(0xe8b06a, 0.65, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.9, 0.2);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- photograph: two doors in fire, one framing a single small photo ----------
function photographDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.55, DIORAMA_Z);
  const doorMat = mat(0x1c1310);
  const doorL = box(0.42, 1.1, 0.05, doorMat);
  doorL.position.set(-0.55, 0, 0);
  const doorR = box(0.42, 1.1, 0.05, doorMat);
  doorR.position.set(0.55, 0, 0);
  group.add(doorL, doorR);
  const tableMat = mat(0x241d14);
  const table = box(0.2, 0.02, 0.14, tableMat);
  table.position.set(0.55, -0.35, 0.1);
  const photoMat = mat(0x2c2618, 0xf0ead6, 0.5);
  const photo = box(0.1, 0.005, 0.08, photoMat);
  photo.position.set(0.55, -0.33, 0.1);
  group.add(table, photo);
  const fire = new THREE.PointLight(0xe8752e, 1.1, 5, quality === 'high' ? 2 : 1.4);
  fire.position.set(-0.55, 0.1, 0.4);
  group.add(fire);
  const glowMat = mat(0x140a06, 0xd4603a, 0.7);
  const smokeGlow = box(1.3, 0.06, 0.02, glowMat);
  smokeGlow.position.set(0, 0.6, -0.1);
  group.add(smokeGlow);
  return {
    group,
    tick(t) {
      fire.intensity = 0.95 + Math.sin(t * 5) * 0.2 + (Math.random() > 0.92 ? 0.25 : 0);
    },
    dispose: trackDispose(group),
  };
}

// ---------- court-of-usher: an altar-bench, a confessional witness stand ----------
function courtOfUsherDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.1, DIORAMA_Z);
  const benchMat = mat(0x201a12);
  const bench = box(0.9, 0.6, 0.4, benchMat);
  bench.position.set(-0.35, 0.3, 0);
  const trim = box(0.9, 0.03, 0.41, mat(0x2e2416, 0xd4b36a, 0.5));
  trim.position.set(-0.35, 0.6, 0);
  group.add(bench, trim);
  const boothMat = mat(0x1c1710);
  const booth = box(0.35, 0.9, 0.35, boothMat);
  booth.position.set(0.55, 0.45, 0);
  const grille = box(0.18, 0.1, 0.02, mat(0x2e2416, 0xd4b36a, 0.6));
  grille.position.set(0.55, 0.55, 0.19);
  group.add(booth, grille);
  const light = new THREE.PointLight(0xd4b36a, 0.7, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0.1, 0.8, 0.4);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- introduction (secret): the room's own emptiness — one exact, glowing threshold ----------
function introductionDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.5, DIORAMA_Z);
  // Deliberately almost nothing — the room's own prose insists on "no
  // furniture, no mirror-floor, no machinery," just exact proportions. A
  // thin frame outline, floating alone, is the whole diorama.
  const frameMat = mat(0x1c1712, 0xf0ead6, 0.55);
  const top = box(0.6, 0.02, 0.02, frameMat);
  top.position.set(0, 0.4, 0);
  const bottom = box(0.6, 0.02, 0.02, frameMat);
  bottom.position.set(0, -0.4, 0);
  const left = box(0.02, 0.8, 0.02, frameMat);
  left.position.set(-0.3, 0, 0);
  const right = box(0.02, 0.8, 0.02, frameMat);
  right.position.set(0.3, 0, 0);
  group.add(top, bottom, left, right);
  const light = new THREE.PointLight(0xf0ead6, 0.35, 3, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0, 0.5);
  group.add(light);
  return {
    group,
    tick(t) {
      light.intensity = 0.3 + Math.sin(t * 0.6) * 0.06;
    },
    dispose: trackDispose(group),
  };
}

// ---------- free-will: a wall panel of large buttons that saw you coming ----------
function freeWillDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.4, DIORAMA_Z);
  const panel = box(1.3, 0.5, 0.06, mat(0x201a12));
  group.add(panel);
  const colors: [number, number][] = [
    [0x9db4e8, 0.6],
    [0xd4603a, 0.6],
    [0x7ec98a, 0.6],
    [0x3a3a3a, 0.15],
  ];
  const buttonSegments = quality === 'high' ? 16 : 10;
  colors.forEach(([color, intensity], i) => {
    const button = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.04, buttonSegments),
      mat(0x14110c, color, intensity),
    );
    button.position.set((i - 1.5) * 0.28, 0, 0.06);
    button.rotation.x = Math.PI / 2;
    group.add(button);
  });
  const light = new THREE.PointLight(0xd4d4d4, 0.5, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.4, 0.5);
  group.add(light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- last-message: a small post-office counter, a warm pen, dawn light ----------
// Re-detailed 2026-07-21 (player-perspective pass): this is Room 19's
// diorama — the hook room the S1 last-message translation fix cared about
// — and it was a single plain box standing in for "a counter worn smooth
// by however many elbows" (the room's own field note). At today's scale it
// read as one oversized dark rectangle with a barely-visible pen/slot
// pinned near its top edge. Added a lighter, warmer countertop slab (the
// "worn smooth" surface, distinct from the body) and a front trim lip, and
// scaled the pen/slot up proportionally so they're legible against the
// now-much-bigger counter rather than lost on it.
function lastMessageDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const counter = box(1.0, 0.46, 0.4, mat(0x201a12));
  counter.position.set(0, 0.48, 0);
  group.add(counter);
  const counterTop = box(1.04, 0.05, 0.44, mat(0x3a2e1c));
  counterTop.position.set(0, 0.735, 0);
  group.add(counterTop);
  const trim = box(1.04, 0.025, 0.44, mat(0x14110c));
  trim.position.set(0, 0.245, 0);
  group.add(trim);
  const penMat = mat(0x2e2416, 0xd4b36a, 0.7);
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, quality === 'high' ? 12 : 8), penMat);
  pen.position.set(0.18, 0.81, 0.05);
  pen.rotation.z = Math.PI / 2.3;
  group.add(pen);
  const slotMat = mat(0x1c1712, 0xf0c9a0, 0.5);
  const slot = box(0.42, 0.045, 0.03, slotMat);
  slot.position.set(-0.2, 0.98, -0.19);
  group.add(slot);
  const light = new THREE.PointLight(0xf0c9a0, 0.7, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 1.1, 0.3);
  group.add(light);
  return {
    group,
    tick(t) {
      (penMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(t * 1.1) * 0.1;
    },
    dispose: trackDispose(group),
  };
}

// ---------- door-that-asks: the last door, a brass grille reading your file ----------
function doorThatAsksDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.5, DIORAMA_Z);
  const doorMat = mat(0x1c1712);
  const door = box(0.75, 1.5, 0.07, doorMat);
  group.add(door);
  const grilleMat = mat(0x2e2416, 0xd4b36a, 0.7);
  const grilleBars = quality === 'high' ? 5 : 3;
  const bars: THREE.Mesh[] = [];
  for (let i = 0; i < grilleBars; i++) {
    const bar = box(0.24, 0.012, 0.02, grilleMat);
    bar.position.set(0, 0.15 + (i - (grilleBars - 1) / 2) * 0.03, 0.045);
    bars.push(bar);
    group.add(bar);
  }
  const light = new THREE.PointLight(0xd4b36a, 0.65, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.15, 0.35);
  group.add(light);
  return {
    group,
    tick(t) {
      light.intensity = 0.55 + Math.sin(t * 0.8) * 0.15;
    },
    dispose: trackDispose(group),
  };
}

type DioramaBuilder = (quality: 'low' | 'high') => Diorama;

const REGISTRY: Record<string, DioramaBuilder> = {
  junction: junctionDiorama,
  'experience-machine': experienceMachineDiorama,
  ship: shipDiorama,
  'casino-pascal': casinoPascalDiorama,
  omelas: omelasDiorama,
  teleporter: teleporterDiorama,
  editor: editorDiorama,
  'debt-of-dead': debtOfDeadDiorama,
  boulder: boulderDiorama,
  'marys-room': marysRoomDiorama,
  'chinese-room': chineseRoomDiorama,
  'newcomb-annex': newcombAnnexDiorama,
  'veil-of-ignorance': veilOfIgnoranceDiorama,
  'buridans-queue': buridansQueueDiorama,
  'the-reference': theReferenceDiorama,
  'butterfly-dream': butterflyDreamDiorama,
  swampman: swampmanDiorama,
  'the-cave': theCaveDiorama,
  'the-archive': (q) => understoryDiorama(0xd4b36a, q),
  'the-unchosen': (q) => understoryDiorama(0x9db4e8, q),
  'the-echo': (q) => understoryDiorama(0x8a6fd4, q),
  'waiting-room': waitingRoomDiorama,
  wallet: walletDiorama,
  promotion: promotionDiorama,
  'beggars-math': beggarsMathDiorama,
  'quiet-alarm': quietAlarmDiorama,
  'dinner-table': dinnerTableDiorama,
  photograph: photographDiorama,
  'court-of-usher': courtOfUsherDiorama,
  introduction: introductionDiorama,
  'free-will': freeWillDiorama,
  'last-message': lastMessageDiorama,
  'door-that-asks': doorThatAsksDiorama,
};

/** Every room id with a bespoke diorama — exported for registry-completeness tests. */
export const DIORAMA_ROOM_IDS: string[] = Object.keys(REGISTRY);

/** Returns null for rooms without a bespoke diorama — act theme alone then (spec 07 §Q1). */
export function dioramaFor(roomId: string, quality: 'low' | 'high'): Diorama | null {
  const builder = REGISTRY[roomId];
  return builder ? builder(quality) : null;
}
