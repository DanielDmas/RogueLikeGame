import * as THREE from 'three';
import { applyMood, type GuideFigure, type MoodType, type ThemeConfig, type ThemeId } from './themes';
import { createDoors, DOOR_Z, type DoorSet, type DoorSpec } from './doors';
import { createPost, type Post } from './post';
import type { Diorama } from './dioramas';
import type { ContentPack } from '../packs/types';

export interface DirectorEvents {
  onDoorHover(id: string | null): void;
  onDoorClick(id: string): void;
}

const CAM_VFOV_DEG = 58;
// A small default unzoom from the original 7 — gives every door screen a
// little more breathing room even before the aspect-ratio compensation below.
const CAM_HOME = new THREE.Vector3(0, 1.6, 7.6);
const TARGET_FPS = 60;

/**
 * How far back the camera needs to sit so every door (with a safety margin)
 * stays inside the horizontal field of view, given the door count and the
 * viewport's aspect ratio — narrow/portrait aspects need more distance than
 * the base framing provides. Never returns less than the base distance, so
 * this only ever pulls the camera back, never zooms in tighter than normal.
 * Pure, unit-tested.
 */
export function cameraZForDoors(
  doorCount: number,
  aspect: number,
  opts: { spacing?: number; doorHalfWidth?: number; vFovDeg?: number; margin?: number; baseZ?: number; doorZ?: number } = {},
): number {
  const spacing = opts.spacing ?? 3.4;
  const doorHalfWidth = opts.doorHalfWidth ?? 1.0;
  const vFovDeg = opts.vFovDeg ?? CAM_VFOV_DEG;
  const margin = opts.margin ?? 1.15;
  const baseZ = opts.baseZ ?? CAM_HOME.z;
  const doorZ = opts.doorZ ?? DOOR_Z;
  const n = Math.max(1, doorCount);
  const halfWidthNeeded = ((n - 1) / 2) * spacing + doorHalfWidth;
  const vFovRad = (vFovDeg * Math.PI) / 180;
  const hFovHalfTan = Math.tan(vFovRad / 2) * Math.max(aspect, 0.001);
  const neededDistance = (halfWidthNeeded * margin) / hFovHalfTan;
  const requiredZ = doorZ + neededDistance;
  return Math.max(baseZ, requiredZ);
}

/** True once at least 1/targetFps has elapsed since the last presented frame. Pure, unit-tested. */
export function shouldRenderFrame(nowMs: number, lastFrameMs: number, targetFps = TARGET_FPS): boolean {
  return nowMs - lastFrameMs >= 1000 / targetFps;
}

/** Title-screen fog parallax (spec 07 §Q3.2): how far the theme group should
 * shift toward the pointer, clamped to `±max` on each axis. Pure, unit-tested. */
export function parallaxOffset(pointer: { x: number; y: number }, max = 0.15): { x: number; y: number } {
  const clamp = (v: number) => Math.max(-1, Math.min(1, v)) * max;
  return { x: clamp(pointer.x), y: clamp(pointer.y) };
}

/** Smoothstep-style ease-in-out on [0,1] — slow start, fast middle, slow finish. Pure, unit-tested. */
export function easeInOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/** How long the Usher takes to walk to a chosen door (and back) — a deliberate, readable pace, not a teleport. */
const USHER_WALK_SECONDS = 2.5;
/** How long the camera dolly takes to cross a chosen threshold. */
const CAMERA_DOLLY_SECONDS = 2.0;
/** Amplitude of the Usher's walking bob, in scene units. */
const USHER_BOB_AMPLITUDE = 0.03;

export type RenderScale = 'performance' | 'standard' | 'sharp';

/** Effective device-pixel-ratio cap for each render-scale setting — independent of `quality` (AA/bloom only). Pure, unit-tested. */
export function pixelRatioFor(scale: RenderScale, devicePixelRatio: number): number {
  const dpr = devicePixelRatio || 1;
  switch (scale) {
    case 'performance':
      return Math.min(dpr, 1) * 0.75;
    case 'sharp':
      return Math.min(dpr, 2);
    case 'standard':
    default:
      return Math.min(dpr, 1.5);
  }
}

export class SceneDirector {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private post: Post;
  private theme: ThemeConfig | null = null;
  private usher: GuideFigure;
  private visuals: ContentPack['visuals'];
  private doors: DoorSet | null = null;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(-10, -10);
  private hovered: string | null = null;
  private clock = new THREE.Clock();
  private dollyTween: { from: THREE.Vector3; to: THREE.Vector3; startT: number; duration: number; done: () => void } | null = null;
  /** Doorway light-spill (spec 07 §Q2) — spawned in `walkThrough`, killed in `hideDoors`. */
  private spillLight: THREE.PointLight | null = null;
  private spillTween: { startT: number; duration: number; target: number } | null = null;
  private usherWalk: { from: THREE.Vector3; to: THREE.Vector3; startT: number; duration: number } | null = null;
  private tooltip: HTMLDivElement;
  private events: DirectorEvents;
  private reducedMotion = false;
  private usherHome = new THREE.Vector3(6.2, -0.05, -4.6);
  private usherPresence = 1;
  private usherPresenceTarget = 1;
  private dynamicScenery = false;
  private mood: MoodType | null = null;
  private renderScale: RenderScale = 'standard';
  /** Paused while a full-screen DOM overlay (settings/codex/pause/etc.) covers the scene — no reason to keep rendering underneath it. */
  private paused = false;
  private lastFrameTime = 0;
  /** Scales tween durations (Usher walk, camera dolly) — 1 normally, 0.25 under `?uat=1`. */
  private speedMultiplier = 1;
  /** Timestamps (ms) of recently-presented frames, for the UAT fps() probe — trimmed to the last ~2s. */
  private frameTimestamps: number[] = [];
  /** Title-screen-only fog parallax (spec 07 §Q3.2) — off everywhere else. */
  private parallaxEnabled = false;
  private parallaxCurrent = { x: 0, y: 0 };
  /** Title screen's epitaph wall (spec 07 §Q3.3) — a faint CanvasTexture
   * plane, present only once ≥2 endings are witnessed. */
  private epitaphMesh: THREE.Mesh | null = null;
  /** Room diorama (spec 07 §Q1) — a small backdrop vignette behind the door
   * row, keyed by room id; null for rooms without a bespoke motif. */
  private diorama: Diorama | null = null;
  private dioramaRoomId: string | null = null;
  private quality: 'low' | 'high';

  constructor(
    canvas: HTMLCanvasElement,
    ui: HTMLElement,
    events: DirectorEvents,
    quality: 'low' | 'high',
    visuals: ContentPack['visuals'],
    guideFigure: () => GuideFigure,
    renderScale: RenderScale = 'standard',
  ) {
    this.events = events;
    this.renderScale = renderScale;
    this.quality = quality;
    this.visuals = visuals;
    this.usher = guideFigure();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === 'high' });
    this.renderer.setPixelRatio(pixelRatioFor(renderScale, devicePixelRatio));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.55;
    this.camera = new THREE.PerspectiveCamera(CAM_VFOV_DEG, innerWidth / innerHeight, 0.1, 200);
    this.camera.position.copy(CAM_HOME);
    this.camera.lookAt(0, 1.4, -6);
    this.post = createPost(this.renderer, this.scene, this.camera, quality);

    this.usher.group.position.copy(this.usherHome);
    this.usher.group.rotation.y = -0.5;

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'door-tip';
    ui.appendChild(this.tooltip);

    addEventListener('resize', () => this.resize());
    canvas.addEventListener('pointermove', (e) => {
      this.pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    });
    canvas.addEventListener('click', () => {
      if (this.hovered) this.events.onDoorClick(this.hovered);
    });

    this.loop();
  }

  setReducedMotion(v: boolean) {
    this.reducedMotion = v;
  }

  /** Suspends the render loop entirely (a DOM overlay is covering the whole scene) — the single biggest idle GPU/battery saving available. */
  setPaused(v: boolean) {
    this.paused = v;
  }

  /** Scales all future tween durations (Usher walk, camera dolly) by `m` — used by `?uat=1` to run at 4x pace. */
  setSpeedMultiplier(m: number) {
    this.speedMultiplier = m;
  }

  /** Rolling average frames-per-second over the last ~2s of actually-presented frames (0 if too few samples yet). UAT-only probe. */
  getFps(): number {
    const samples = this.frameTimestamps;
    if (samples.length < 2) return 0;
    const spanMs = samples[samples.length - 1] - samples[0];
    if (spanMs <= 0) return 0;
    return ((samples.length - 1) * 1000) / spanMs;
  }

  /** Projects every current door's frame to screen pixels — UAT probe for "is this door fully visible?" sweeps. */
  getDoorRects(): { id: string; rect: { left: number; top: number; right: number; bottom: number; width: number; height: number }; onScreen: boolean }[] {
    if (!this.doors) return [];
    const out: ReturnType<SceneDirector['getDoorRects']> = [];
    for (const id of this.doorSpecs.keys()) {
      const corners = this.doors.frameCorners(id);
      if (!corners) continue;
      let left = Infinity;
      let right = -Infinity;
      let top = Infinity;
      let bottom = -Infinity;
      let behindCamera = false;
      for (const corner of corners) {
        const p = corner.clone().project(this.camera);
        if (p.z > 1) behindCamera = true;
        const x = ((p.x + 1) / 2) * innerWidth;
        const y = ((1 - p.y) / 2) * innerHeight;
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
      const rect = { left, top, right, bottom, width: right - left, height: bottom - top };
      const onScreen = !behindCamera && left >= 0 && top >= 0 && right <= innerWidth && bottom <= innerHeight;
      out.push({ id, rect, onScreen });
    }
    return out;
  }

  /** Applies a new render-resolution scale live (no reload needed, unlike `quality`'s AA/bloom). */
  setRenderScale(scale: RenderScale) {
    if (scale === this.renderScale) return;
    this.renderScale = scale;
    this.renderer.setPixelRatio(pixelRatioFor(scale, devicePixelRatio));
    this.post.resize(innerWidth, innerHeight);
  }

  /** Title-screen-only fog parallax (spec 07 §Q3.2) — pointer-driven drift of
   * the current theme group. Disabling snaps the offset back to zero so
   * leaving the title screen never leaves the scene subtly shifted. */
  setParallax(v: boolean) {
    this.parallaxEnabled = v;
    if (!v) {
      this.parallaxCurrent = { x: 0, y: 0 };
      this.theme?.group.position.set(0, 0, 0);
    }
  }

  /** Rebuilds (or clears, if `lines` is empty) the title screen's epitaph
   * wall — a large, near-transparent plane of witnessed endings' epitaphs,
   * like carvings behind fog. Called fresh on every title-loop entry (title
   * re-entry after a locale change is sufficient — no reactive rebuild). */
  setEpitaphWall(lines: string[]) {
    this.clearEpitaphWall();
    if (lines.length === 0 || !this.theme) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '28px Georgia, serif';
    const lineHeight = 46;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, startY + i * lineHeight, canvas.width - 80));
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.06, depthWrite: false });
    const geometry = new THREE.PlaneGeometry(30, 15);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 4, -14);
    mesh.rotation.z = ((Math.random() - 0.5) * 2 * Math.PI) / 180;
    this.epitaphMesh = mesh;
    this.theme.group.add(mesh);
  }

  private clearEpitaphWall() {
    if (!this.epitaphMesh) return;
    this.epitaphMesh.geometry.dispose();
    const mat = this.epitaphMesh.material as THREE.MeshBasicMaterial;
    mat.map?.dispose();
    mat.dispose();
    this.epitaphMesh.removeFromParent();
    this.epitaphMesh = null;
  }

  /** Room diorama (spec 07 §Q1) — swaps to `roomId`'s bespoke backdrop
   * vignette, or clears it for rooms with no motif of their own (null falls
   * back to the plain act theme). No-op if already showing that room. */
  setDiorama(roomId: string | null) {
    if (roomId === this.dioramaRoomId) return;
    this.clearDiorama();
    this.dioramaRoomId = roomId;
    if (!roomId) return;
    const d = this.visuals.dioramaFor(roomId, this.quality);
    if (!d) return;
    this.diorama = d;
    this.scene.add(d.group);
  }

  /** Forwards to the current diorama's optional accent toggle (spec 07 §Q1 —
   * `marys-room`'s lit cube); a no-op for dioramas without one, or none active. */
  setDioramaAccent(on: boolean) {
    this.diorama?.setAccent?.(on);
  }

  private clearDiorama() {
    if (this.diorama) {
      this.scene.remove(this.diorama.group);
      this.diorama.dispose();
      this.diorama = null;
    }
    this.dioramaRoomId = null;
  }

  /** Toggles the optional "dynamic scenery" mood system; off = pure static act theme (the original, default behavior). */
  setDynamicScenery(v: boolean) {
    this.dynamicScenery = v;
    this.applyFogAndBackground();
  }

  /** Tints the current act theme toward a room-type mood (no-op unless dynamic scenery is enabled). Pass null to return to the plain act theme (e.g. while the corridor/door picker is up). */
  setMood(type: MoodType | null) {
    this.mood = type;
    this.applyFogAndBackground();
  }

  private applyFogAndBackground() {
    if (!this.theme) return;
    const { fogColor, background, fogDensity } = applyMood(this.theme, this.dynamicScenery ? this.mood : null);
    this.scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    this.scene.background = new THREE.Color(background);
  }

  setTheme(id: ThemeId) {
    this.clearEpitaphWall();
    this.clearDiorama();
    if (this.theme) {
      this.scene.remove(this.theme.group);
      this.theme.group.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    }
    this.theme = this.visuals.buildTheme(id);
    this.mood = null;
    this.scene.add(this.theme.group);
    this.applyFogAndBackground();
    // the Usher haunts every act except the ending space
    this.usher.group.removeFromParent();
    this.usher.group.position.copy(this.usherHome);
    this.usherWalk = null;
    this.usherPresence = 1;
    this.usherPresenceTarget = 1;
    if (id !== 5) this.theme.group.add(this.usher.group);
    this.camera.position.copy(CAM_HOME);
    this.camera.lookAt(0, 1.4, -6);
  }

  showDoors(specs: DoorSpec[]) {
    this.hideDoors();
    this.doors = createDoors(specs, this.visuals.doorStyle);
    this.scene.add(this.doors.group);
    this.doorSpecs = new Map(specs.map((s) => [s.id, s]));
    // Always frame from a consistent, correctly-centered position — not
    // wherever the previous room's walk-through dolly happened to leave the
    // camera — and pull back if the aspect ratio needs more room to fit
    // every door on screen.
    this.frameDoors();
  }
  private doorSpecs = new Map<string, DoorSpec>();

  private frameDoors() {
    const z = cameraZForDoors(this.doorSpecs.size, innerWidth / innerHeight);
    this.camera.position.set(CAM_HOME.x, CAM_HOME.y, z);
    this.camera.lookAt(0, 1.4, -6);
  }

  hideDoors() {
    if (this.doors) {
      this.scene.remove(this.doors.group);
      this.doors.dispose();
      this.doors = null;
    }
    this.setTooltip(null);
    this.hovered = null;
    this.usher.setLanternTarget(null);
    this.clearSpillLight();
  }

  private spawnSpillLight(id: string, color: number) {
    if (!this.doors) return;
    this.clearSpillLight();
    const doorPos = this.doors.lintel(id).clone();
    const light = new THREE.PointLight(color, 0, 8, 1.8);
    light.position.set(doorPos.x, 1.6, DOOR_Z - 0.6);
    this.scene.add(light);
    this.spillLight = light;
  }

  private clearSpillLight() {
    if (this.spillLight) {
      this.scene.remove(this.spillLight);
      this.spillLight = null;
    }
    this.spillTween = null;
  }

  /** external hover (from DOM door cards) */
  highlightDoor(id: string | null) {
    this.doors?.setHover(id);
    this.setTooltip(id);
    this.usher.setLanternTarget(id ? this.doors?.lintel(id).x ?? null : null);
  }

  /** dolly toward a door on a fixed, eased tween; resolves when arrived (or instantly under reduced motion).
   * `spill` (spec 07 §Q2), when given, spawns a colored point light just
   * behind the chosen door — brightened over the dolly's first half (or
   * instantly, under reduced motion), killed by the next `hideDoors()`. */
  walkThrough(id: string, spill?: { color: number }): Promise<void> {
    if (!this.doors) return Promise.resolve();
    this.doors.snapSelected(id);
    this.usher.setLanternTarget(this.doors.lintel(id).x);
    if (spill) this.spawnSpillLight(id, spill.color);
    if (this.reducedMotion) {
      if (this.spillLight) this.spillLight.intensity = 2.5;
      return Promise.resolve();
    }
    const target = this.doors.lintel(id).clone();
    target.y = 1.6;
    target.z += 1.2;
    const now = this.clock.elapsedTime;

    // The Usher walks in beside the chosen door for the crossing — a
    // deliberate, unhurried approach (not a jump-scare, not a teleport)
    // rather than staying parked at the room's edge the whole time. It
    // walks back to its usual spot once the walk-through completes.
    const doorPos = this.doors.lintel(id).clone();
    const side = doorPos.x >= 0 ? -1 : 1;
    const usherTarget = new THREE.Vector3(doorPos.x + side * 1.3, -0.05, doorPos.z + 0.6);
    this.usherWalk = { from: this.usher.group.position.clone(), to: usherTarget, startT: now, duration: USHER_WALK_SECONDS * this.speedMultiplier };
    this.usherPresenceTarget = 1.7;

    if (this.spillLight) {
      this.spillTween = { startT: now, duration: (CAMERA_DOLLY_SECONDS / 2) * this.speedMultiplier, target: 2.5 };
    }

    return new Promise((done) => {
      this.dollyTween = {
        from: this.camera.position.clone(),
        to: target,
        startT: now,
        duration: CAMERA_DOLLY_SECONDS * this.speedMultiplier,
        done: () => {
          this.usherWalk = {
            from: this.usher.group.position.clone(),
            to: this.usherHome.clone(),
            startT: this.clock.elapsedTime,
            duration: USHER_WALK_SECONDS * this.speedMultiplier,
          };
          this.usherPresenceTarget = 1;
          done();
        },
      };
    });
  }

  private setTooltip(id: string | null) {
    if (!id || !this.doors) {
      this.tooltip.classList.remove('on');
      return;
    }
    const spec = this.doorSpecs.get(id);
    if (!spec) return;
    this.tooltip.innerHTML = spec.teaser
      ? `<span class="tip-hint">${spec.hint}</span><span class="tip-teaser">${spec.teaser}</span>`
      : spec.hint;
    const p = this.doors.lintel(id).clone().project(this.camera);
    // Clear the door's own glow/bloom, which extends above its lintel —
    // a small gap here reads as "unreadable" once the teaser's second line
    // (and any UI zoom) pushes it back down into that glow.
    this.tooltip.style.left = `${((p.x + 1) / 2) * innerWidth}px`;
    this.tooltip.style.top = `${((1 - p.y) / 2) * innerHeight - 34}px`;
    this.tooltip.classList.add('on');
  }

  private resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.post.resize(innerWidth, innerHeight);
    // re-frame so a mid-choice window resize (or device rotation) can't push
    // a door outside the new aspect ratio
    if (this.doors && !this.dollyTween) this.frameDoors();
  }

  private loop = () => {
    requestAnimationFrame(this.loop);
    // A full DOM overlay or a backgrounded tab means nothing on screen needs
    // a new frame; skip the whole render+tick (rAF keeps running so we wake
    // up cleanly the instant either condition clears). The title screen is
    // the one paused overlay that still needs a live frame underneath it —
    // fog parallax and the epitaph wall (spec 07 §Q3) only read as "alive"
    // if the loop keeps ticking, so `parallaxEnabled` (title-only) opts out
    // of the suspend.
    if ((this.paused && !this.parallaxEnabled) || document.hidden) return;
    const now = performance.now();
    if (!shouldRenderFrame(now, this.lastFrameTime)) return;
    this.lastFrameTime = now;
    this.frameTimestamps.push(now);
    while (this.frameTimestamps.length > 0 && now - this.frameTimestamps[0] > 2000) this.frameTimestamps.shift();

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    this.theme?.tick(t);
    this.usher.tick(t);
    this.doors?.tick(t, this.reducedMotion);
    if (!this.reducedMotion) this.diorama?.tick(t);

    if (this.parallaxEnabled && this.theme && !this.reducedMotion) {
      const target = parallaxOffset({ x: this.pointer.x, y: this.pointer.y });
      this.parallaxCurrent.x += (target.x - this.parallaxCurrent.x) * Math.min(1, dt * 2);
      this.parallaxCurrent.y += (target.y - this.parallaxCurrent.y) * Math.min(1, dt * 2);
      this.theme.group.position.x = this.parallaxCurrent.x;
      this.theme.group.position.y = this.parallaxCurrent.y;
    }

    if (this.usherWalk) {
      const elapsed = t - this.usherWalk.startT;
      const p = easeInOutCubic(elapsed / this.usherWalk.duration);
      this.usher.group.position.lerpVectors(this.usherWalk.from, this.usherWalk.to, p);
      // a small walking bob while actually in motion, so the approach reads
      // as a walk rather than a smoothly sliding prop
      if (p < 1) this.usher.group.position.y += Math.abs(Math.sin(elapsed * 6)) * USHER_BOB_AMPLITUDE;
      if (elapsed >= this.usherWalk.duration) this.usherWalk = null;
    }
    this.usherPresence += (this.usherPresenceTarget - this.usherPresence) * Math.min(1, dt * 2.5);
    this.usher.setPresence(this.usherPresence);

    if (this.spillTween && this.spillLight) {
      const elapsed = t - this.spillTween.startT;
      const p = easeInOutCubic(elapsed / this.spillTween.duration);
      this.spillLight.intensity = this.spillTween.target * p;
      if (elapsed >= this.spillTween.duration) {
        this.spillLight.intensity = this.spillTween.target;
        this.spillTween = null;
      }
    }

    if (this.dollyTween) {
      const elapsed = t - this.dollyTween.startT;
      const p = easeInOutCubic(elapsed / this.dollyTween.duration);
      this.camera.position.lerpVectors(this.dollyTween.from, this.dollyTween.to, p);
      if (elapsed >= this.dollyTween.duration) {
        const { done } = this.dollyTween;
        this.dollyTween = null;
        done();
      }
    } else if (!this.reducedMotion) {
      // idle breathing sway
      this.camera.position.x = CAM_HOME.x + Math.sin(t * 0.32) * 0.06;
      this.camera.position.y = CAM_HOME.y + Math.sin(t * 0.55) * 0.035;
    }

    // door raycast hover
    if (this.doors && !this.dollyTween) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.doors.meshes, false);
      const id = hits.length > 0 ? (hits[0].object.userData.doorId as string) : null;
      if (id !== this.hovered) {
        this.hovered = id;
        this.doors.setHover(id);
        this.setTooltip(id);
        this.usher.setLanternTarget(id ? this.doors.lintel(id).x : null);
        this.events.onDoorHover(id);
        document.body.style.cursor = id ? 'pointer' : '';
      }
    }

    this.post.render(dt);
  };
}
