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
  return {
    group,
    tick(t) {
      matB.emissiveIntensity = 0.35 + Math.sin(t * 1.8) * 0.2;
    },
    dispose: trackDispose(group),
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

type DioramaBuilder = (quality: Quality) => Diorama;

const REGISTRY: Record<string, DioramaBuilder> = {
  'the-read-receipt': readReceiptDiorama,
  'just-friends': justFriendsDiorama,
  'the-therapist': theTherapistDiorama,
  'the-kitchen-table': theKitchenTableDiorama,
  'the-second-account': theSecondAccountDiorama,
  'the-colleague': theColleagueDiorama,
};

export function limerenceDioramaFor(roomId: string, quality: Quality): Diorama | null {
  const builder = REGISTRY[roomId];
  return builder ? builder(quality) : null;
}
