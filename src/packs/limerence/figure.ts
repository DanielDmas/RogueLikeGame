// The Night Porter's own figure rig (L5 polish) — previously LIMERENCE
// reused ANAMNESIS's `usherFigure()` verbatim (halo + demonic horns), which
// reads as the Usher's own iconography, not the Porter's. Built from the
// same `silhouette()`/`GuideFigure` primitives as themes.ts's usherFigure
// so it drops into the same door-walkthrough/lantern-lean machinery, but
// re-skinned around the creative bible's one visual tell: "a wedding band
// on his right hand, and a pale untanned stripe on his left ring finger —
// never explained until the hidden the-mirror ending." No halo, no horns —
// a peaked porter's cap and a warm desk-lamp glow instead.
import * as THREE from 'three';
import { silhouette, lanternLeanAngle, type GuideFigure } from '../../scene/themes';

export function porterFigure(): GuideFigure {
  const group = silhouette(0x0a0c10, 0x3a2a18, 0.4);
  group.scale.setScalar(1.1);
  const bodyMat = (group.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
  const head = group.children[2] as THREE.Mesh;
  const BASE_RIM = 0.4;

  // A flat peaked cap, standing in for the Usher's halo — a hotel porter's
  // silhouette, not an afterlife one.
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.05, 12),
    new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.7 }),
  );
  cap.position.y = 1.66;
  const capBrim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.02, 12),
    new THREE.MeshStandardMaterial({ color: 0x120e0a, roughness: 0.6 }),
  );
  capBrim.position.y = 1.635;
  group.add(cap, capBrim);

  // The right-hand ring — the one visual tell, easy to miss, exactly as the
  // design calls for. A small warm band at hand height on the figure's
  // right side; the matching left hand carries no mesh at all (the "pale
  // untanned stripe" is an absence, not an object — nothing to draw).
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xd89055, emissive: 0xd89055, emissiveIntensity: 1.1, roughness: 0.3,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 8, 16), ringMat);
  ring.position.set(-0.2, 0.78, 0.05);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // A soft amber work-light from above, matching LIMERENCE's door-glow
  // color (theme.ts's doorStyle.glowColor) rather than the Usher's cooler
  // gold spot — the Porter reads as "hotel fixture," not "stage lighting."
  const BASE_SPOT = 1.7;
  const spot = new THREE.SpotLight(0xd89055, BASE_SPOT, 9, 0.55, 0.65, 1.6);
  spot.position.set(0, 3.0, 0.35);
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0, 0.7, 0);
  group.add(spotTarget);
  spot.target = spotTarget;
  group.add(spot);

  // The Porter's own hand-lantern — same lean-toward-hovered-door mechanic
  // as the Usher's, re-colored to the hotel's amber rather than his gold.
  const lanternArm = new THREE.Group();
  lanternArm.position.set(0.24, 0.92, 0.16);
  const lanternGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xd89055, emissive: 0xd89055, emissiveIntensity: 0, roughness: 0.4 }),
  );
  const lanternLight = new THREE.PointLight(0xd89055, 0, 4, 1.8);
  lanternArm.add(lanternGlow, lanternLight);
  group.add(lanternArm);
  const LANTERN_TARGET_INTENSITY = 0.9;
  let lanternTargetX: number | null = null;
  let lanternIntensity = 0;
  let lastLanternT = 0;

  let presence = 1;
  return {
    group,
    tick(t) {
      // no flicker (that was the Usher's faulty-sign horn) — the Porter's
      // light stays steady; only a slow, tired sway.
      bodyMat.emissiveIntensity = BASE_RIM * presence;
      spot.intensity = BASE_SPOT * presence;
      ringMat.emissiveIntensity = 1.1 * presence;
      head.rotation.y = Math.sin((t * 2 * Math.PI) / 24) * 0.14;
      group.rotation.z = Math.sin(t * 0.35) * 0.012;

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
