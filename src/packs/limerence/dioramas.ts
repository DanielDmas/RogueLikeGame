// LIMERENCE's own bespoke room dioramas (L5 polish spec: "two phones
// glowing on one bed, the migrating wall/window, four doors in a
// therapist's office, a kitchen table under one hanging bulb"). Same
// generated-geometry, no-textures register as ANAMNESIS's
// scene/dioramas.ts (reuses its mat/box/trackDispose/DIORAMA_Z helpers),
// covering LIMERENCE's handful of most iconic rooms — mirrors ANAMNESIS's
// own scope, which gives bespoke dioramas to its signature rooms only
// (junction, experience-machine, ship, …) and lets every other room read
// as its floor's theme. Previously `dioramaFor: () => null` for every room.
import * as THREE from 'three';
import type { Diorama } from '../../scene/dioramas';
import { mat, box, trackDispose, DIORAMA_Z } from '../../scene/dioramas';
import type { Quality } from '../types';

// ---------- the-read-receipt: a phone face-up on a bed, "seen" glowing ----------
function readReceiptDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const bed = box(2.4, 0.2, 1.4, mat(0x1c1611));
  bed.position.set(0, 0.1, 0);
  const phoneMat = mat(0x0a0a0c, 0xd89055, 0.5);
  const phone = box(0.34, 0.02, 0.62, phoneMat);
  phone.position.set(0.3, 0.22, 0.1);
  phone.rotation.y = 0.15;
  const glow = new THREE.PointLight(0xd89055, 0.8, 4, quality === 'high' ? 2 : 1.4);
  glow.position.set(0.3, 0.4, 0.1);
  group.add(bed, phone, glow);
  return {
    group,
    tick(t) {
      const pulse = 0.6 + Math.sin(t * 1.4) * 0.25;
      phoneMat.emissiveIntensity = pulse;
      glow.intensity = pulse;
    },
    dispose: trackDispose(group),
  };
}

// ---------- just-friends: the migrating wall/window (Glass motif) ----------
function justFriendsDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const wallMat = mat(0x241d20, 0x000000, 0);
  const wall = box(2.6, 1.7, 0.12, wallMat);
  wall.position.set(0, 0.9, 0);
  const windowMat = mat(0x0a0a0c, 0x5aa8a8, 0.7);
  const window_ = box(0.7, 0.9, 0.1, windowMat);
  window_.position.set(0, 0.95, 0.01);
  const light = new THREE.PointLight(0x5aa8a8, 0.9, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.95, 0.6);
  group.add(wall, window_, light);
  return {
    group,
    tick(t) {
      // the window drifts slowly along the wall — "migrates" per the design
      // note — never settling on one side.
      window_.position.x = Math.sin(t * 0.18) * 0.9;
      light.position.x = window_.position.x;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-therapist: four doors, two chairs facing ----------
function theTherapistDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const doorMat = mat(0x1a1610, 0xd89055, 0.14);
  for (let i = 0; i < 4; i++) {
    const d = box(0.34, 1.0, 0.06, doorMat);
    d.position.set(-1.2 + i * 0.8, 0.7, -0.6);
    group.add(d);
  }
  const chairMat = mat(0x241d14);
  const chairA = box(0.3, 0.4, 0.3, chairMat);
  chairA.position.set(-0.35, 0.2, 0.4);
  const chairB = box(0.3, 0.4, 0.3, chairMat);
  chairB.position.set(0.35, 0.2, 0.4);
  chairB.rotation.y = Math.PI;
  const light = new THREE.PointLight(0xd89055, 0.7, 5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 1.3, 0.6);
  group.add(chairA, chairB, light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- the-kitchen-table: a table under one hanging bulb ----------
function theKitchenTableDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const table = box(1.6, 0.08, 1.0, mat(0x1e1710));
  table.position.set(0, 0.55, 0);
  const leg = (dx: number, dz: number) => {
    const l = box(0.06, 0.55, 0.06, mat(0x14100c));
    l.position.set(dx, 0.275, dz);
    return l;
  };
  const bulbMat = mat(0x0a0a0a, 0xe8b878, 1.2);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), bulbMat);
  bulb.position.set(0, 1.5, 0);
  const cord = box(0.015, 0.75, 0.015, mat(0x0c0c0c));
  cord.position.set(0, 1.12, 0);
  const light = new THREE.PointLight(0xe8b878, 1.1, 4.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 1.48, 0);
  group.add(table, leg(0.7, 0.4), leg(-0.7, 0.4), leg(0.7, -0.4), leg(-0.7, -0.4), bulb, cord, light);
  return {
    group,
    tick(t) {
      const sway = Math.sin(t * 0.5) * 0.03;
      bulb.position.x = sway;
      cord.rotation.z = sway * 0.4;
      light.position.x = sway;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-second-account: two overlapping phone silhouettes ----------
function theSecondAccountDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.9, DIORAMA_Z);
  const matA = mat(0x0e0e10, 0xd4b36a, 0.4);
  const matB = mat(0x0a0a0c, 0x5aa8a8, 0.5);
  const phoneA = box(0.4, 0.72, 0.03, matA);
  phoneA.position.set(-0.14, 0, 0);
  const phoneB = box(0.4, 0.72, 0.03, matB);
  phoneB.position.set(0.14, 0, 0.06);
  const light = new THREE.PointLight(0x5aa8a8, 0.7, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0.1, 0, 0.6);
  group.add(phoneA, phoneB, light);
  let accentOn = false;
  return {
    group,
    tick(t) {
      if (!accentOn) matB.emissiveIntensity = 0.35 + Math.sin(t * 1.8) * 0.2;
    },
    dispose: trackDispose(group),
    // F5 Tier 2: the second account, deleted — its phone goes dark and
    // stops pulsing, matching the diorama's own idle phoneA (the one
    // account left).
    setAccent(on: boolean) {
      if (on === accentOn) return;
      accentOn = on;
      matB.emissiveIntensity = on ? 0 : 0.35;
      matB.emissive.setHex(on ? 0x000000 : 0x5aa8a8);
    },
  };
}

// ---------- the-colleague: two adjacent hotel doors, one warm keycard glow ----------
function theColleagueDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const doorMat = mat(0x15171a, 0xd89055, 0.1);
  const doorA = box(0.5, 1.4, 0.08, doorMat);
  doorA.position.set(-0.5, 0.8, 0);
  const doorB = box(0.5, 1.4, 0.08, doorMat);
  doorB.position.set(0.5, 0.8, 0);
  const cardMat = mat(0x0a0a0c, 0xd89055, 0.9);
  const card = box(0.14, 0.02, 0.22, cardMat);
  card.position.set(0, 0.15, 0.3);
  card.rotation.x = -0.3;
  const light = new THREE.PointLight(0xd89055, 0.5, 3.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.4, 0.4);
  group.add(doorA, doorB, card, light);
  return {
    group,
    tick(t) {
      const pulse = 0.6 + Math.sin(t * 1.1) * 0.3;
      cardMat.emissiveIntensity = pulse;
      light.intensity = pulse * 0.5;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-front-desk: counter + bell + departures board ----------
function theFrontDeskDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const counter = box(2.2, 0.5, 0.7, mat(0x1c1611));
  counter.position.set(0, 0.25, 0);
  const bellMat = mat(0x2a2114, 0xd4b36a, 0.5, { metalness: 0.6, roughness: 0.3 });
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.1, 12), bellMat);
  bell.position.set(0.6, 0.56, 0);
  const boardMat = mat(0x0a0a0c, 0xd89055, 0.35);
  const board = box(1.0, 0.5, 0.05, boardMat);
  board.position.set(-0.4, 1.1, -0.5);
  const light = new THREE.PointLight(0xd89055, 0.5, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(-0.4, 1.1, -0.1);
  group.add(counter, bell, board, light);
  return {
    group,
    tick(t) {
      // The board flickers as though rows are turning over, arrivals and departures both.
      boardMat.emissiveIntensity = 0.25 + Math.abs(Math.sin(t * 3.1)) * 0.25;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-password: a phone between two padlocks ----------
function thePasswordDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.85, DIORAMA_Z);
  const phoneMat = mat(0x0a0a0c, 0xd4b36a, 0.55);
  const phone = box(0.36, 0.66, 0.03, phoneMat);
  const lockMat = mat(0x201a12, 0x000000, 0, { metalness: 0.7, roughness: 0.35 });
  const lock = (dx: number) => {
    const g = new THREE.Group();
    const body = box(0.16, 0.14, 0.05, lockMat);
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.014, 8, 16, Math.PI), lockMat);
    shackle.position.set(0, 0.09, 0);
    g.add(body, shackle);
    g.position.set(dx, 0, 0.08);
    return g;
  };
  const light = new THREE.PointLight(0xd4b36a, 0.7, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0, 0.5);
  const lockLeft = lock(-0.42);
  group.add(phone, lockLeft, lock(0.42), light);
  const lockMatOpen = mat(0x8a6a2a, 0xd4b36a, 0.7, { metalness: 0.7, roughness: 0.35 });
  let accentOn = false;
  return {
    group,
    tick(t) {
      phoneMat.emissiveIntensity = 0.4 + Math.sin(t * 1.6) * 0.2;
    },
    dispose: trackDispose(group),
    // F5 Tier 2: the password given away — one lock (the one held out toward
    // the viewer) turns from dull iron to lit brass, unlocked.
    setAccent(on: boolean) {
      if (on === accentOn) return;
      accentOn = on;
      lockLeft.children.forEach((child) => {
        if (child instanceof THREE.Mesh) child.material = on ? lockMatOpen : lockMat;
      });
    },
  };
}

// ---------- the-party: a bottle amid a ring of phone-lights ----------
function thePartyDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.4, 10), mat(0x0e2a1e, 0x2a5a3e, 0.15));
  bottle.position.set(0, 0.2, 0);
  const glows: { mat: THREE.MeshStandardMaterial; phase: number }[] = [];
  const ringCount = quality === 'high' ? 8 : 5;
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2;
    const m = mat(0x0a0a0c, 0x5aa8a8, 0.5);
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), m);
    light.position.set(Math.cos(angle) * 0.9, 0.05, Math.sin(angle) * 0.5);
    glows.push({ mat: m, phase: i * 0.7 });
    group.add(light);
  }
  const pointLight = new THREE.PointLight(0x5aa8a8, 0.7, 4.5, quality === 'high' ? 2 : 1.4);
  pointLight.position.set(0, 0.4, 0.3);
  group.add(bottle, pointLight);
  return {
    group,
    tick(t) {
      for (const g of glows) g.mat.emissiveIntensity = 0.3 + Math.sin(t * 2.2 + g.phase) * 0.3;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-forward: a grid of glowing rectangles, one red ----------
function theForwardDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.85, DIORAMA_Z);
  const cols = 4;
  const rows = quality === 'high' ? 3 : 2;
  let flagged: THREE.MeshStandardMaterial | null = null;
  const flagIndex = Math.floor((rows * cols) / 2);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isFlagged = i === flagIndex;
      const m = mat(0x0a0a0c, isFlagged ? 0xb84a3c : 0x5a6a72, isFlagged ? 0.6 : 0.2);
      const tile = box(0.32, 0.22, 0.02, m);
      tile.position.set((c - (cols - 1) / 2) * 0.42, (r - (rows - 1) / 2) * 0.32, 0);
      if (isFlagged) flagged = m;
      group.add(tile);
      i++;
    }
  }
  const light = new THREE.PointLight(0xb84a3c, 0.5, 3.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0, 0.6);
  group.add(light);
  return {
    group,
    tick(t) {
      if (flagged) flagged.emissiveIntensity = 0.45 + Math.sin(t * 2.6) * 0.25;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-rumor: one huge unanswered message bubble ----------
function theRumorDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.9, DIORAMA_Z);
  const bubbleMat = mat(0x1a1418, 0xb84a3c, 0.3);
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.55, quality === 'high' ? 20 : 12, quality === 'high' ? 16 : 10), bubbleMat);
  const tailMat = mat(0x1a1418, 0xb84a3c, 0.3);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 3), tailMat);
  tail.position.set(-0.4, -0.55, 0);
  tail.rotation.z = 0.6;
  const light = new THREE.PointLight(0xb84a3c, 0.4, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0, 0.8);
  group.add(bubble, tail, light);
  return {
    group,
    tick(t) {
      // A slow, anxious pulse — never resolving, never answered.
      const pulse = 0.22 + Math.sin(t * 0.9) * 0.1;
      bubbleMat.emissiveIntensity = pulse;
      tailMat.emissiveIntensity = pulse;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-distance: two phones face-up on one bed ----------
function theDistanceDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const bed = box(2.6, 0.18, 1.5, mat(0x1c1611));
  bed.position.set(0, 0.09, 0);
  const matA = mat(0x0a0a0c, 0xd4b36a, 0.55);
  const matB = mat(0x0a0a0c, 0x5aa8a8, 0.55);
  const phoneA = box(0.3, 0.02, 0.56, matA);
  phoneA.position.set(-0.55, 0.19, 0);
  const phoneB = box(0.3, 0.02, 0.56, matB);
  phoneB.position.set(0.55, 0.19, 0);
  const light = new THREE.PointLight(0xd4b36a, 0.6, 4.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.5, 0.2);
  group.add(bed, phoneA, phoneB, light);
  return {
    group,
    tick(t) {
      // The two screens never brighten in sync — each waits on the other.
      matA.emissiveIntensity = 0.4 + Math.sin(t * 1.3) * 0.2;
      matB.emissiveIntensity = 0.4 + Math.sin(t * 1.3 + Math.PI) * 0.2;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-ex: a phone glowing 23:51 in the dark ----------
function theExDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.85, DIORAMA_Z);
  const phoneMat = mat(0x050505, 0x5aa8a8, 0.55);
  const phone = box(0.42, 0.78, 0.03, phoneMat);
  const light = new THREE.PointLight(0x5aa8a8, 0.9, 3.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0, 0.4);
  group.add(phone, light);
  return {
    group,
    tick(t) {
      const pulse = 0.5 + Math.sin(t * 1.1) * 0.25;
      phoneMat.emissiveIntensity = pulse;
      light.intensity = pulse * 0.9;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-confession: an arrivals board + one suitcase ----------
function theConfessionDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const boardMat = mat(0x0a0a0c, 0xd89055, 0.35);
  const board = box(1.3, 0.7, 0.06, boardMat);
  board.position.set(0, 1.1, -0.5);
  const caseMat = mat(0x241d14);
  const suitcase = box(0.5, 0.34, 0.16, caseMat);
  suitcase.position.set(0.3, 0.17, 0.4);
  const handle = box(0.16, 0.05, 0.02, mat(0x14100c));
  handle.position.set(0.3, 0.36, 0.4);
  const light = new THREE.PointLight(0xd89055, 0.5, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 1.1, -0.1);
  group.add(board, suitcase, handle, light);
  let accentOn = false;
  return {
    group,
    tick(t) {
      boardMat.emissiveIntensity = 0.25 + Math.abs(Math.sin(t * 2.4)) * 0.25;
    },
    dispose: trackDispose(group),
    // F5 Tier 2: the whole confession made — the stone set down, rendered
    // as the suitcase catching a warm glow, no longer just dead-black.
    setAccent(on: boolean) {
      if (on === accentOn) return;
      accentOn = on;
      caseMat.emissive.setHex(on ? 0xd89055 : 0x000000);
      caseMat.emissiveIntensity = on ? 0.35 : 0;
    },
  };
}

// ---------- the-discovery: a face-down phone under a cone of kitchen light ----------
function theDiscoveryDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const table = box(1.4, 0.06, 0.9, mat(0x1e1710));
  table.position.set(0, 0.5, 0);
  const phoneMat = mat(0x0a0a0c, 0x000000, 0);
  const phone = box(0.32, 0.02, 0.6, phoneMat);
  phone.position.set(0, 0.54, 0);
  const spot = new THREE.SpotLight(0xd4b36a, quality === 'high' ? 1.4 : 1.0, 3, Math.PI / 6, 0.4);
  spot.position.set(0, 1.6, 0);
  spot.target.position.set(0, 0.5, 0);
  group.add(table, phone, spot, spot.target);
  let accentOn = false;
  return {
    group,
    tick(t) {
      // The light itself is steady; only the phone's silence, face-down, moves the scene.
      spot.intensity = (quality === 'high' ? 1.4 : 1.0) + Math.sin(t * 0.4) * 0.08;
    },
    dispose: trackDispose(group),
    // F5 Tier 2: confronted now, in the kitchen — the phone lights up, no
    // longer just a dark silhouette under the spot.
    setAccent(on: boolean) {
      if (on === accentOn) return;
      accentOn = on;
      phoneMat.emissive.setHex(on ? 0xd4b36a : 0x000000);
      phoneMat.emissiveIntensity = on ? 0.8 : 0;
    },
  };
}

// ---------- the-wedding-eve: a dress form + one waiting chair ----------
function theWeddingEveDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const formMat = mat(0x2a2430, 0xffffff, 0.08);
  const stand = box(0.04, 0.7, 0.04, mat(0x14100c));
  stand.position.set(-0.4, 0.35, 0);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.35, 6, quality === 'high' ? 12 : 8), formMat);
  torso.position.set(-0.4, 0.95, 0);
  const chairMat = mat(0x1a1414);
  const chair = box(0.32, 0.42, 0.32, chairMat);
  chair.position.set(0.5, 0.21, 0.2);
  const light = new THREE.PointLight(0xffffff, 0.35, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(-0.4, 1.3, 0.4);
  group.add(stand, torso, chair, light);
  return { group, tick() {}, dispose: trackDispose(group) };
}

// ---------- the-unsent: a writing desk + brass letter scale ----------
function theUnsentDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const desk = box(1.5, 0.06, 0.8, mat(0x1e1710));
  desk.position.set(0, 0.6, 0);
  const paper = box(0.4, 0.01, 0.5, mat(0xe8dcc4, 0x000000, 0));
  paper.position.set(-0.3, 0.64, 0);
  const scaleMat = mat(0x8a6a2a, 0xd4b36a, 0.25, { metalness: 0.75, roughness: 0.3 });
  const base = box(0.14, 0.03, 0.14, scaleMat);
  base.position.set(0.4, 0.64, 0);
  const arm = box(0.24, 0.015, 0.015, scaleMat);
  arm.position.set(0.4, 0.75, 0);
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.008, 12), scaleMat);
  pan.position.set(0.5, 0.71, 0);
  const light = new THREE.PointLight(0xd4b36a, 0.5, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 1.0, 0.3);
  group.add(desk, paper, base, arm, pan, light);
  let accentOn = false;
  const restRotation = 0.03; // matches tick()'s idle sway amplitude below
  return {
    group,
    tick(t) {
      if (!accentOn) arm.rotation.z = Math.sin(t * 0.6) * restRotation;
    },
    dispose: trackDispose(group),
    // F5 Tier 2: whichever letter is actually chosen, the scale tips —
    // "the desk guarantees delivery." Every choice in this room sends
    // something (even the blank page), so all of them share this hook.
    setAccent(on: boolean) {
      if (on === accentOn) return;
      accentOn = on;
      arm.rotation.z = on ? -0.12 : restRotation;
    },
  };
}

// ---------- the-morning-desk: an open ledger on the counter, dawn light ----------
function theMorningDeskDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const counter = box(2.0, 0.5, 0.7, mat(0x1c1611));
  counter.position.set(0, 0.25, 0);
  const ledgerMat = mat(0xe8dcc4, 0xd4b36a, 0.1);
  const ledger = box(0.5, 0.03, 0.36, ledgerMat);
  ledger.position.set(0, 0.53, 0);
  const dawn = new THREE.HemisphereLight(0xf0c890, 0x1a1410, 0.5);
  const light = new THREE.PointLight(0xf0c890, 0.6, 4.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 1.0, 0.3);
  group.add(counter, ledger, dawn, light);
  return {
    group,
    tick(t) {
      // Dawn brightening, slow and one-directional — the run is ending.
      const rise = 0.4 + Math.min(0.3, Math.max(0, (t % 40) / 40) * 0.3);
      light.intensity = rise;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-screenshot: a phone under a fan of arriving screenshots ----------
function theScreenshotDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0.85, DIORAMA_Z);
  const phoneMat = mat(0x0a0a0c, 0xd4b36a, 0.4);
  const phone = box(0.36, 0.66, 0.03, phoneMat);
  const panelCount = quality === 'high' ? 3 : 2;
  const panels: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; phase: number; dx: number }[] = [];
  for (let i = 0; i < panelCount; i++) {
    const m = mat(0xe8dcc4, 0xb84a3c, 0.35);
    const panel = box(0.24, 0.4, 0.01, m);
    const dx = (i - (panelCount - 1) / 2) * 0.32;
    panel.position.set(dx, 0.55, 0.08 + i * 0.02);
    panel.rotation.z = (i - (panelCount - 1) / 2) * 0.08;
    panels.push({ mesh: panel, mat: m, phase: i * 1.1, dx });
    group.add(panel);
  }
  const light = new THREE.PointLight(0xb84a3c, 0.5, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.4, 0.5);
  group.add(phone, light);
  return {
    group,
    tick(t) {
      // Screenshots arrive on a loop, mid-air/airdropped, never quite landing.
      for (const p of panels) {
        const cycle = (t * 0.5 + p.phase) % 4;
        p.mesh.position.y = 0.9 - Math.min(1, cycle / 2) * 0.35;
        p.mat.emissiveIntensity = cycle < 2 ? 0.5 - cycle * 0.15 : 0;
      }
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-scoreboard: a lobby rearranged into a hearing — chairs in rows, a lamp held as a gavel ----------
function theScoreboardDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const bench = box(1.3, 0.4, 0.4, mat(0x1c1611));
  bench.position.set(0, 0.2, -0.3);
  const chairMat = mat(0x241d14);
  const rowCount = quality === 'high' ? 4 : 3;
  for (let i = 0; i < rowCount; i++) {
    const chair = box(0.24, 0.32, 0.24, chairMat);
    chair.position.set((i - (rowCount - 1) / 2) * 0.36, 0.16, 0.35);
    group.add(chair);
  }
  const lampMat = mat(0x2a2114, 0xd89055, 0.6, { metalness: 0.5, roughness: 0.4 });
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.32, 8), lampMat);
  lampBase.position.set(0, 0.55, -0.3);
  lampBase.rotation.z = 0.5;
  const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 10), lampMat);
  lampHead.position.set(0.13, 0.68, -0.3);
  lampHead.rotation.z = 0.5;
  const light = new THREE.PointLight(0xd89055, 0.6, 3.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0.15, 0.7, -0.1);
  group.add(bench, lampBase, lampHead, light);
  let strikePhase = 0;
  return {
    group,
    tick(t) {
      // A slow, rhythmic tilt — the gavel that was never actually a gavel, striking anyway.
      strikePhase = (t * 0.7) % (Math.PI * 2);
      const strike = Math.max(0, Math.sin(strikePhase)) ** 6;
      lampBase.rotation.z = 0.5 - strike * 0.35;
      lampHead.rotation.z = 0.5 - strike * 0.35;
      light.intensity = 0.5 + strike * 0.6;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-veto: a drawer of emergency keys, one singled out ----------
function theVetoDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const desk = box(1.4, 0.5, 0.7, mat(0x1e1710));
  desk.position.set(0, 0.25, 0);
  const drawerMat = mat(0x14100c);
  const drawer = box(0.9, 0.18, 0.55, drawerMat);
  drawer.position.set(0, 0.44, 0.32);
  const keyMat = mat(0x3a3020, 0x000000, 0, { metalness: 0.75, roughness: 0.3 });
  const vetoKeyMat = mat(0x8a6a2a, 0xb84a3c, 0.5, { metalness: 0.75, roughness: 0.3 });
  const keyCount = quality === 'high' ? 5 : 3;
  let vetoKey: THREE.Mesh | null = null;
  for (let i = 0; i < keyCount; i++) {
    const isVeto = i === Math.floor(keyCount / 2);
    const key = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 6), isVeto ? vetoKeyMat : keyMat);
    key.rotation.z = Math.PI / 2;
    key.position.set((i - (keyCount - 1) / 2) * 0.16, 0.5, 0.55);
    if (isVeto) vetoKey = key;
    group.add(key);
  }
  const light = new THREE.PointLight(0xb84a3c, 0.5, 3.5, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.7, 0.5);
  group.add(desk, drawer, light);
  return {
    group,
    tick(t) {
      // The invoked key catches the light; the others stay dull — "an emergency to somebody, given time."
      if (vetoKey && vetoKey.material instanceof THREE.MeshStandardMaterial) {
        vetoKey.material.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.25;
      }
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-drift: two mugs on a low table, comfortable and still ----------
function theDriftDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const table = box(1.2, 0.05, 0.7, mat(0x1e1710));
  table.position.set(0, 0.42, 0);
  const mugMatA = mat(0x241d14, 0xd4b36a, 0.18);
  const mugMatB = mat(0x1a1a1c, 0xd4b36a, 0.18);
  const mugA = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.12, 10), mugMatA);
  mugA.position.set(-0.28, 0.51, 0.1);
  const mugB = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.12, 10), mugMatB);
  mugB.position.set(0.28, 0.51, -0.1);
  const light = new THREE.PointLight(0xd4b36a, 0.3, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0, 0.9, 0.3);
  group.add(table, mugA, mugB, light);
  return {
    group,
    // Deliberately near-static: "nothing is wrong" is the whole point — the
    // faintest possible warmth, not a pulse, so this room never reads as
    // tense the way most of the wing's dioramas do.
    tick(t) {
      const still = 0.16 + Math.sin(t * 0.15) * 0.02;
      mugMatA.emissiveIntensity = still;
      mugMatB.emissiveIntensity = still;
    },
    dispose: trackDispose(group),
  };
}

// ---------- the-registry: shelves of identical grey files, one glowing ----------
function theRegistryDiorama(quality: Quality): Diorama {
  const group = new THREE.Group();
  group.position.set(0, 0, DIORAMA_Z);
  const shelfMat = mat(0x18140f);
  const fileMat = mat(0x5a564c, 0x000000, 0);
  const ownFileMat = mat(0xe8dcc4, 0xd4b36a, 0.5);
  const rows = quality === 'high' ? 3 : 2;
  const cols = 6;
  for (let r = 0; r < rows; r++) {
    const shelf = box(2.0, 0.03, 0.35, shelfMat);
    shelf.position.set(0, 0.3 + r * 0.4, -0.2 - r * 0.15);
    group.add(shelf);
    for (let c = 0; c < cols; c++) {
      const isOwn = r === rows - 1 && c === cols - 1;
      const file = box(0.14, 0.22, 0.28, isOwn ? ownFileMat : fileMat);
      file.position.set((c - (cols - 1) / 2) * 0.3, 0.42 + r * 0.4, -0.2 - r * 0.15);
      group.add(file);
    }
  }
  const light = new THREE.PointLight(0xd4b36a, 0.4, 4, quality === 'high' ? 2 : 1.4);
  light.position.set(0.75, 0.9, 0.4);
  group.add(light);
  return {
    group,
    tick(t) {
      ownFileMat.emissiveIntensity = 0.35 + Math.sin(t * 0.8) * 0.15;
    },
    dispose: trackDispose(group),
  };
}

type DioramaBuilder = (quality: Quality) => Diorama;

const REGISTRY: Record<string, DioramaBuilder> = {
  'the-read-receipt': readReceiptDiorama,
  'just-friends': justFriendsDiorama,
  'the-therapist': theTherapistDiorama,
  'the-kitchen-table': theKitchenTableDiorama,
  'the-second-account': theSecondAccountDiorama,
  'the-colleague': theColleagueDiorama,
  'the-front-desk': theFrontDeskDiorama,
  'the-password': thePasswordDiorama,
  'the-party': thePartyDiorama,
  'the-forward': theForwardDiorama,
  'the-rumor': theRumorDiorama,
  'the-distance': theDistanceDiorama,
  'the-ex': theExDiorama,
  'the-confession': theConfessionDiorama,
  'the-discovery': theDiscoveryDiorama,
  'the-wedding-eve': theWeddingEveDiorama,
  'the-unsent': theUnsentDiorama,
  'the-morning-desk': theMorningDeskDiorama,
  'the-screenshot': theScreenshotDiorama,
  'the-scoreboard': theScoreboardDiorama,
  'the-veto': theVetoDiorama,
  'the-drift': theDriftDiorama,
  'the-registry': theRegistryDiorama,
};

export function limerenceDioramaFor(roomId: string, quality: Quality): Diorama | null {
  const builder = REGISTRY[roomId];
  return builder ? builder(quality) : null;
}
