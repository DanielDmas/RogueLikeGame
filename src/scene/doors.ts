import * as THREE from 'three';

export interface DoorSpec {
  id: string;
  hint: string;
  secret?: boolean;
}

export interface DoorSet {
  group: THREE.Group;
  meshes: THREE.Mesh[];
  setHover(id: string | null): void;
  /** world position of a door's lintel, for the DOM tooltip */
  lintel(id: string): THREE.Vector3;
  dispose(): void;
}

const FRAME_MAT = new THREE.MeshStandardMaterial({ color: 0x241d14, roughness: 0.75 });

export function createDoors(specs: DoorSpec[]): DoorSet {
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const slabs = new Map<string, THREE.MeshStandardMaterial>();
  const lintels = new Map<string, THREE.Vector3>();

  const n = specs.length;
  const spacing = 3.4;
  specs.forEach((spec, i) => {
    const x = (i - (n - 1) / 2) * spacing;
    const z = -5 - Math.abs(i - (n - 1) / 2) * 0.6;
    const door = new THREE.Group();
    door.position.set(x, 0, z);
    door.lookAt(0, 0, 8);

    const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.1, 0.3), FRAME_MAT);
    jambL.position.set(-0.85, 1.55, 0);
    const jambR = jambL.clone();
    jambR.position.x = 0.85;
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.18, 0.3), FRAME_MAT);
    lintel.position.set(0, 3.15, 0);

    const slabMat = new THREE.MeshStandardMaterial({
      color: spec.secret ? 0x241d33 : 0x2a2014,
      emissive: spec.secret ? 0x8a6fd4 : 0xd4b36a,
      emissiveIntensity: 0.35,
      roughness: 0.55,
    });
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 3.0), slabMat);
    slab.position.set(0, 1.55, 0.02);
    slab.userData.doorId = spec.id;
    slabs.set(spec.id, slabMat);
    meshes.push(slab);

    const glow = new THREE.PointLight(spec.secret ? 0x8a6fd4 : 0xd4b36a, 3, 6, 1.8);
    glow.position.set(0, 1.6, 0.7);

    door.add(jambL, jambR, lintel, slab, glow);
    group.add(door);

    const lp = new THREE.Vector3(0, 3.5, 0);
    door.localToWorld(lp);
    lintels.set(spec.id, lp);
  });

  return {
    group,
    meshes,
    setHover(id) {
      for (const [doorId, mat] of slabs) {
        mat.emissiveIntensity = doorId === id ? 1.1 : 0.35;
      }
    },
    lintel(id) {
      return lintels.get(id) ?? new THREE.Vector3();
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
