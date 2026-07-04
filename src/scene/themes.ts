import * as THREE from 'three';

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
export function silhouette(color = 0x060608): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.95 });
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
export function usherFigure(): { group: THREE.Group; tick(t: number): void } {
  const group = silhouette(0x050507);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.19, 0.016, 10, 40),
    new THREE.MeshStandardMaterial({
      color: 0xd4b36a, emissive: 0xd4b36a, emissiveIntensity: 2.2, roughness: 0.3,
    }),
  );
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
  return {
    group,
    tick(t) {
      // one horn flickers, like a faulty sign
      hornFlickerMat.emissiveIntensity = Math.random() > 0.94 ? 0.15 : 1.4 + Math.sin(t * 3) * 0.2;
      halo.rotation.z = Math.sin(t * 0.7) * 0.08;
    },
  };
}

/** Act I (and prologue): endless dim corridor, doors leaking warm domestic light. */
function corridorTheme(warmth: number): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x141210, 0.9));

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a1714, roughness: 0.95 });
  const doorGlowMat = new THREE.MeshStandardMaterial({
    color: 0x2a1f10, emissive: warmth, emissiveIntensity: 0.8, roughness: 0.7,
  });
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7, 90), wallMat);
    wall.position.set(side * 7.5, 3.5, -30);
    group.add(wall);
    for (let i = 0; i < 9; i++) {
      const slab = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3), doorGlowMat);
      slab.position.set(side * 7.28, 1.5, -4 - i * 9);
      slab.rotation.y = side * -Math.PI / 2;
      group.add(slab);
      const light = new THREE.PointLight(warmth, 2.4, 9, 1.8);
      light.position.set(side * 6.6, 1.6, -4 - i * 9);
      group.add(light);
    }
  }
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(16, 90), wallMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 6.4, -30);
  group.add(ceiling);
  group.add(new THREE.AmbientLight(0x30281f, 0.7));
  const key = new THREE.PointLight(0xc9a06a, 6, 24, 1.6);
  key.position.set(0, 4.4, -2);
  group.add(key);
  const dust = particles(240, 0xc9a06a, 24, 0.035);
  group.add(dust);
  return {
    group, fogColor: 0x0a0806, fogDensity: 0.055, background: 0x0a0806,
    tick(t) { dust.rotation.y = t * 0.008; },
  };
}

/** Act II: dark celestial factory — gears in fog, conveyor belts of small indifferent stars. */
function machineryTheme(): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x0c0e13, 0.6, 0.35));
  const brass = new THREE.MeshStandardMaterial({ color: 0x6b5a33, roughness: 0.35, metalness: 0.9 });
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
  group.add(new THREE.AmbientLight(0x1a2030, 1.2));
  const beam = new THREE.SpotLight(0xd4b36a, 90, 50, 0.55, 0.7, 1.4);
  beam.position.set(0, 15, -3);
  beam.target.position.set(0, 0, -8);
  group.add(beam, beam.target);
  const cool = new THREE.PointLight(0x4a5f9e, 8, 30, 1.6);
  cool.position.set(-6, 3, -10);
  group.add(cool);
  return {
    group, fogColor: 0x05060a, fogDensity: 0.045, background: 0x05060a,
    tick(t) {
      gears.forEach((g, i) => { g.rotation.z = t * (0.05 + i * 0.02) * (i % 2 ? 1 : -1); });
      stars.position.x = Math.sin(t * 0.05) * 2;
    },
  };
}

/** Act III: black-mirror floor, floating dioramas of blurred memories, cold moonlight. */
function mirrorTheme(): ThemeConfig {
  const group = new THREE.Group();
  group.add(floor(0x07080c, 0.12, 0.85));
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
  group.add(new THREE.AmbientLight(0x14182a, 1.4));
  const moon = new THREE.DirectionalLight(0x9db4e8, 1.6);
  moon.position.set(-6, 12, -4);
  group.add(moon);
  const glow = new THREE.PointLight(0x6a7fc4, 5, 26, 1.7);
  glow.position.set(0, 3, -8);
  group.add(glow);
  const mist = particles(160, 0x9db4e8, 30, 0.03);
  group.add(mist);
  return {
    group, fogColor: 0x05060a, fogDensity: 0.05, background: 0x04050a,
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
