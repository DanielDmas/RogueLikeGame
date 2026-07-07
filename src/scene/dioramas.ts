// Room dioramas (spec 07 §Q1) — small, generated backdrop vignettes so each
// bespoke room reads as *somewhere* rather than just "the current act theme
// again". No textures/models: flat-color/emissive MeshStandardMaterial
// silhouettes plus at most 2 lights, same generated-geometry look as
// themes.ts and doors.ts. Placed behind the door row (z ≈ -10, well behind
// DOOR_Z = -5.6) so they never intersect the door row or the Usher's walk
// path (x ∈ [-7, 7], z ∈ [-1, 4]).
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

const DIORAMA_Z = -10;

function mat(color: number, emissive = 0x000000, emissiveIntensity = 0, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity, roughness: 0.85, ...opts });
}

function box(w: number, h: number, d: number, material: THREE.MeshStandardMaterial): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}

function trackDispose(group: THREE.Group): () => void {
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
function buridansQueueDiorama(quality: 'low' | 'high'): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const frameMat = mat(0x201a12);
  for (const side of [-1, 1]) {
    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 6, quality === 'high' ? 16 : 10), frameMat);
    frame.position.set(side * 0.9, 0.9, 0);
    group.add(frame);
  }
  const clockMat = mat(0x14110c, 0xd4b36a, 0.4);
  const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20), clockMat);
  clock.position.set(0, 1.6, 0);
  clock.rotation.x = Math.PI / 2;
  group.add(clock);
  const light = new THREE.PointLight(0xd4b36a, 0.6, 4, 2);
  light.position.set(0, 1.4, 0.5);
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
};

/** Every room id with a bespoke diorama — exported for registry-completeness tests. */
export const DIORAMA_ROOM_IDS: string[] = Object.keys(REGISTRY);

/** Returns null for rooms without a bespoke diorama — act theme alone then (spec 07 §Q1). */
export function dioramaFor(roomId: string, quality: 'low' | 'high'): Diorama | null {
  const builder = REGISTRY[roomId];
  return builder ? builder(quality) : null;
}
