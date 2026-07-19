import * as THREE from 'three';
import { applyMood, type GuideFigure, type MoodType, type ThemeConfig, type ThemeId } from './themes';
import { createDoors, DOOR_Z, type DoorSet, type DoorSpec } from './doors';
import { createPost, type Post } from './post';
import { DIORAMA_Z, type Diorama } from './dioramas';
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

/** Uniform scale applied to every room diorama (dioramas.ts's DIORAMA_Z
 * moving closer handles the "closer" half of the owner's request; this
 * handles "bigger" — a single tunable multiplier rather than rescaling
 * dozens of individual object-position constants across two packs' diorama
 * builder files). */
const DIORAMA_SCALE = 1.6;

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

/** T7 — ambient corridor life: how long to wait before the next rare,
 * one-shot flicker event, jittered 60-120s per the design brief. Pure,
 * unit-tested; `rand` defaults to `Math.random`. */
export function nextAmbientDelay(rand: () => number = Math.random): number {
  return 60 + rand() * 60;
}

/** T7 continuation — the guide passing through the background while idle:
 * a rarer, bigger event than the door flicker (90-180s vs 60-120s), since a
 * full walk across the corridor draws more attention than one door
 * dimming. Independent timer, not competing with the flicker's own — the
 * two can coincide or not, same as any other pair of ambient events would.
 * Pure, unit-tested; `rand` defaults to `Math.random`. */
export function nextGuidePassDelay(rand: () => number = Math.random): number {
  return 90 + rand() * 90;
}

/** 1.3 idle downshift: while a text/choice panel is up and nothing is
 * actively tweening (camera dolly, light-spill fade, Usher walk), the scene
 * is visually static — no reason to keep rendering at the profile's full
 * fps cap, even under Cinematic quality. Never raises the fps above the
 * caller's own cap (a low-quality profile's 30fps cap stays 30, not
 * "upgraded" to the idle target). Pure, unit-tested; the DOM/tween-state
 * read that feeds `idleEligible` lives in the loop itself. */
export function effectiveFps(fpsCap: number, idleEligible: boolean, idleFps = 30): number {
  if (!idleEligible) return fpsCap;
  return Math.min(fpsCap, idleFps);
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

/** How long the Usher takes to walk to a chosen door (and back) — a deliberate, readable pace, not a teleport.
 * Game-experience review A2 (2026-07-19, `15-game-experience-review.md`): kept comfortably under
 * `CAMERA_DOLLY_SECONDS` — the approach walk used to run 2.5s against a 2.0s dolly, so the dolly's
 * `done` callback fired mid-stride and overwrote the tween with a walk-home target, visibly reversing
 * the Usher's direction for most of a second before the veil went opaque. Finishing the approach with
 * a beat to spare lets it actually complete before the walk-home tween ever starts. */
const USHER_WALK_SECONDS = 1.8;
/** How long the camera dolly takes to cross a chosen threshold. */
const CAMERA_DOLLY_SECONDS = 2.0;
/** Amplitude of the Usher's walking bob, in scene units. */
const USHER_BOB_AMPLITUDE = 0.03;
/** T7 continuation — how far the guide's ambient background pass moves in
 * from its home spot (toward the door row's center), before walking back. */
const USHER_PASS_DISTANCE = 3.2;

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
  private usherWalk: {
    from: THREE.Vector3;
    to: THREE.Vector3;
    startT: number;
    duration: number;
    /** T7 continuation — the ambient guide-pass's walk-back leg is scheduled
     * from here once the walk-out completes, rather than needing a second
     * piece of state to track "is this an ambient pass, and which leg." */
    onComplete?: () => void;
  } | null = null;
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
  /** T7 — ambient corridor life: the clock time (elapsedTime) of the next
   * rare flicker event. Reset on every showDoors() so a freshly-shown door
   * row always gets a full 60-120s of quiet before its first event, rather
   * than firing immediately from a timer that had been running since the
   * last room. */
  private nextAmbientEventAt = Infinity;
  /** T7 continuation — the guide's own ambient background pass; independent
   * timer from the door flicker's (see `nextGuidePassDelay`). */
  private nextGuidePassAt = Infinity;
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
  /** Every bespoke diorama authors its own single dim accent light tuned to
   * one glowing detail — plenty for that detail, not enough to read the
   * diorama's dark, unlit structural geometry (the counter, the wall, the
   * chairs) as a recognizable shape against the corridor's own darkness.
   * One shared, neutral front-fill light — independent of any per-diorama
   * lighting — keeps every diorama's silhouette legible without retuning
   * each of the 34+ individual scenes. */
  private dioramaFillLight: THREE.PointLight | null = null;
  private quality: 'low' | 'high';
  /** 1.3.2: caps the render loop's frame rate independently of `quality`
   * (AA/bloom) — a fog-and-text game reads fine at 30fps, and halving the
   * frame rate roughly halves render-thread GPU time on the same settings. */
  private fpsCap: number = TARGET_FPS;
  /** 1.3 idle downshift: whether a `.text-panel`/`.choices` panel is
   * currently mounted under `#ui`. Found in code review (2026-07-15) that
   * the original implementation re-ran `document.querySelector` on every
   * single render-loop tick (~60Hz for the scene's whole lifetime) to
   * answer this — replaced with a MutationObserver that updates this cached
   * flag only when the DOM actually changes (a handful of times per room),
   * undercutting the very "reduce render-loop cost" goal this feature has. */
  private idlePanelPresent = false;
  /** Phase V2 — "the morning read": the active light/dark 3D scene mode,
   * independent of `quality`. `setTheme(id)` reads this when building the
   * theme; `setThemeMode` updates it and, if a theme is already showing,
   * rebuilds just that theme (see `setThemeMode`'s own doc for why a full
   * rebuild is safe here). */
  private themeMode: 'dark' | 'light' = 'dark';
  /** The most recently built theme id, so `setThemeMode` can rebuild the
   * current floor in the new mode without the caller needing to remember
   * and re-pass the id itself. */
  private currentThemeId: ThemeId | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    ui: HTMLElement,
    events: DirectorEvents,
    quality: 'low' | 'high',
    visuals: ContentPack['visuals'],
    guideFigure: () => GuideFigure,
    renderScale: RenderScale = 'standard',
    fpsCap: number = TARGET_FPS,
  ) {
    this.events = events;
    this.renderScale = renderScale;
    this.quality = quality;
    this.fpsCap = fpsCap;
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

    this.idlePanelPresent = ui.querySelector('.text-panel, .choices') !== null;
    new MutationObserver(() => {
      this.idlePanelPresent = ui.querySelector('.text-panel, .choices') !== null;
    }).observe(ui, { childList: true, subtree: true });

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

  /** Applies a new fps cap live (no reload needed). */
  setFpsCap(v: number) {
    this.fpsCap = v;
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
    // Owner: dioramas should read bigger, closer, covering more of the
    // display, while staying "illustratively beautiful" — a uniform scale
    // around each diorama's own local origin (every builder in dioramas.ts
    // positions its objects relative to (0,0,DIORAMA_Z)) grows every existing
    // vignette in proportion without touching each one's individual layout,
    // paired with DIORAMA_Z itself moving closer to camera (dioramas.ts).
    d.group.scale.setScalar(DIORAMA_SCALE);
    this.scene.add(d.group);
    this.dioramaFillLight = new THREE.PointLight(0xfff2dc, 4.5, 9, 1.6);
    this.dioramaFillLight.position.set(0, 0.75, DIORAMA_Z + 1.1);
    this.scene.add(this.dioramaFillLight);
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
    if (this.dioramaFillLight) {
      this.scene.remove(this.dioramaFillLight);
      this.dioramaFillLight = null;
    }
    this.dioramaRoomId = null;
  }

  /** Phase V2 — "the morning read": applies a new light/dark 3D scene mode.
   * A no-op if the mode isn't actually changing. When it does change and a
   * theme is currently showing, rebuilds that theme via the normal
   * `setTheme(id)` path — deliberately the *full* rebuild (it also clears
   * any diorama/epitaph wall), because both of those are already restored
   * by their own existing call sites: the title loop rebuilds the epitaph
   * wall fresh on every re-entry (including right after Settings closes),
   * and `flow.ts`'s `applySettings` re-calls `setDiorama` for the current
   * room when this fires mid-run. This keeps the mode switch a single,
   * well-tested code path instead of a second bespoke "rebuild but keep
   * everything" variant. */
  setThemeMode(light: boolean) {
    const mode: 'dark' | 'light' = light ? 'light' : 'dark';
    if (mode === this.themeMode) return;
    this.themeMode = mode;
    if (this.currentThemeId !== null) this.setTheme(this.currentThemeId);
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
        if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Line) {
          o.geometry.dispose();
          if (o.material instanceof THREE.Material) o.material.dispose();
          else if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        }
      });
    }
    this.currentThemeId = id;
    this.theme = this.visuals.buildTheme(id, this.quality, this.themeMode);
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
    this.nextAmbientEventAt = this.clock.elapsedTime + nextAmbientDelay();
    this.nextGuidePassAt = this.clock.elapsedTime + nextGuidePassDelay();
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

  /** T7 continuation — the guide passing through the background while the
   * player is idle reading a door row: walks a short distance in from its
   * usual spot and back, unrelated to any door (no lantern retarget, no
   * presence boost) — a background life event, not a prompt to act. Reuses
   * the exact same walk/bob rig `walkThrough` already drives. */
  private triggerAmbientPass(t: number) {
    const home = this.usherHome.clone();
    const passTo = new THREE.Vector3(home.x - USHER_PASS_DISTANCE, home.y, home.z);
    const duration = USHER_WALK_SECONDS * this.speedMultiplier;
    this.usherWalk = {
      from: home,
      to: passTo,
      startT: t,
      duration,
      onComplete: () => {
        this.usherWalk = {
          from: passTo,
          to: home,
          startT: this.clock.elapsedTime,
          duration,
        };
      },
    };
  }

  private setTooltip(id: string | null) {
    if (!id || !this.doors) {
      this.tooltip.classList.remove('on');
      return;
    }
    const spec = this.doorSpecs.get(id);
    if (!spec) return;
    // 9.3: authored/translated strings only today, but escape before
    // interpolating into innerHTML anyway — a translated hint/teaser
    // containing a stray `<` would otherwise break rendering.
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    this.tooltip.innerHTML = spec.teaser
      ? `<span class="tip-hint">${esc(spec.hint)}</span><span class="tip-teaser">${esc(spec.teaser)}</span>`
      : esc(spec.hint);
    const p = this.doors.lintel(id).clone().project(this.camera);
    // Clear the door's own glow/bloom, which extends well above its lintel —
    // the tooltip box is bottom-anchored here (CSS `translate(-50%, -100%)`),
    // so this offset is the gap between the door and the *closest* edge of
    // the text, not its top. A one-line hint only needs modest clearance;
    // the two-line teaser variant is visually taller and denser right at
    // that boundary, so it earns extra room rather than reusing the same
    // fixed number and reading as if it were touching the door.
    const offset = spec.teaser ? 52 : 34;
    this.tooltip.style.left = `${((p.x + 1) / 2) * innerWidth}px`;
    this.tooltip.style.top = `${((1 - p.y) / 2) * innerHeight - offset}px`;
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
    // 1.3 idle downshift: a text/choice panel showing with no active tween
    // (dolly, light-spill, Usher walk) means the scene itself is static —
    // safe to render less often regardless of the profile's own fps cap.
    const hasActiveTween = !!(this.dollyTween || this.spillTween || this.usherWalk);
    const idleEligible = !hasActiveTween && this.idlePanelPresent;
    const targetFps = effectiveFps(this.fpsCap, idleEligible);
    if (!shouldRenderFrame(now, this.lastFrameTime, targetFps)) return;
    this.lastFrameTime = now;
    this.frameTimestamps.push(now);
    while (this.frameTimestamps.length > 0 && now - this.frameTimestamps[0] > 2000) this.frameTimestamps.shift();

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // T7 — ambient corridor life: a rare, one-shot flicker on some other
    // door while the player is idle reading the current one, as though
    // something settled elsewhere down the corridor. Reuses idleEligible
    // (a door row showing, no active tween) so it never fires mid-transition;
    // disabled under reduced motion, same guarantee every other ambient
    // motion in this file already gives.
    if (this.doors && idleEligible && !this.reducedMotion && t >= this.nextAmbientEventAt) {
      this.doors.triggerAmbientFlicker(t);
      this.nextAmbientEventAt = t + nextAmbientDelay();
    }

    // T7 continuation — the guide passing through the background: a rarer,
    // bigger ambient event than the door flicker. Independent timer;
    // `!this.usherWalk` keeps it from ever interrupting a real door-walk
    // (a player choosing a door mid-pass simply overwrites usherWalk with
    // the real one, same as it always could).
    if (this.doors && idleEligible && !this.reducedMotion && !this.usherWalk && t >= this.nextGuidePassAt) {
      this.triggerAmbientPass(t);
      this.nextGuidePassAt = t + nextGuidePassDelay();
    }

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
      if (elapsed >= this.usherWalk.duration) {
        const onComplete = this.usherWalk.onComplete;
        this.usherWalk = null;
        onComplete?.();
      }
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
