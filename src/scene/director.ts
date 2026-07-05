import * as THREE from 'three';
import { applyMood, buildTheme, usherFigure, type MoodType, type ThemeConfig, type ThemeId } from './themes';
import { createDoors, type DoorSet, type DoorSpec } from './doors';
import { createPost, type Post } from './post';

export interface DirectorEvents {
  onDoorHover(id: string | null): void;
  onDoorClick(id: string): void;
}

const CAM_HOME = new THREE.Vector3(0, 1.6, 7);

export class SceneDirector {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private post: Post;
  private theme: ThemeConfig | null = null;
  private usher = usherFigure();
  private doors: DoorSet | null = null;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(-10, -10);
  private hovered: string | null = null;
  private clock = new THREE.Clock();
  private dolly: { target: THREE.Vector3; done: () => void } | null = null;
  private tooltip: HTMLDivElement;
  private events: DirectorEvents;
  private reducedMotion = false;
  private usherHome = new THREE.Vector3(6.2, -0.05, -4.6);
  private usherMoveTarget = this.usherHome.clone();
  private usherPresence = 1;
  private usherPresenceTarget = 1;
  private dynamicScenery = false;
  private mood: MoodType | null = null;

  constructor(canvas: HTMLCanvasElement, ui: HTMLElement, events: DirectorEvents, quality: 'low' | 'high') {
    this.events = events;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === 'high' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 2 : 1));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.55;
    this.camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 200);
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
    if (this.theme) {
      this.scene.remove(this.theme.group);
      this.theme.group.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    }
    this.theme = buildTheme(id);
    this.mood = null;
    this.scene.add(this.theme.group);
    this.applyFogAndBackground();
    // the Usher haunts every act except the ending space
    this.usher.group.removeFromParent();
    this.usher.group.position.copy(this.usherHome);
    this.usherMoveTarget.copy(this.usherHome);
    this.usherPresence = 1;
    this.usherPresenceTarget = 1;
    if (id !== 5) this.theme.group.add(this.usher.group);
    this.camera.position.copy(CAM_HOME);
    this.camera.lookAt(0, 1.4, -6);
  }

  showDoors(specs: DoorSpec[]) {
    this.hideDoors();
    this.doors = createDoors(specs);
    this.scene.add(this.doors.group);
    this.doorSpecs = new Map(specs.map((s) => [s.id, s]));
  }
  private doorSpecs = new Map<string, DoorSpec>();

  hideDoors() {
    if (this.doors) {
      this.scene.remove(this.doors.group);
      this.doors.dispose();
      this.doors = null;
    }
    this.setTooltip(null);
    this.hovered = null;
  }

  /** external hover (from DOM door cards) */
  highlightDoor(id: string | null) {
    this.doors?.setHover(id);
    this.setTooltip(id);
  }

  /** dolly toward a door; resolves when arrived (or instantly under reduced motion) */
  walkThrough(id: string): Promise<void> {
    if (!this.doors || this.reducedMotion) return Promise.resolve();
    const target = this.doors.lintel(id).clone();
    target.y = 1.6;
    target.z += 1.2;

    // The Usher steps in beside the chosen door for the crossing — a brief,
    // thematic presence (not a jump-scare) rather than staying parked at
    // the room's edge the whole time. It eases back to its usual spot once
    // the walk-through completes.
    const doorPos = this.doors.lintel(id).clone();
    const side = doorPos.x >= 0 ? -1 : 1;
    this.usherMoveTarget.set(doorPos.x + side * 1.3, -0.05, doorPos.z + 0.6);
    this.usherPresenceTarget = 1.7;

    return new Promise((done) => {
      this.dolly = {
        target,
        done: () => {
          this.usherMoveTarget.copy(this.usherHome);
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
    this.tooltip.style.left = `${((p.x + 1) / 2) * innerWidth}px`;
    this.tooltip.style.top = `${((1 - p.y) / 2) * innerHeight - 8}px`;
    this.tooltip.classList.add('on');
  }

  private resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.post.resize(innerWidth, innerHeight);
  }

  private loop = () => {
    requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    this.theme?.tick(t);
    this.usher.tick(t);
    this.doors?.tick(t);

    if (!this.usher.group.position.equals(this.usherMoveTarget)) {
      this.usher.group.position.lerp(this.usherMoveTarget, 1 - Math.pow(0.001, dt));
    }
    this.usherPresence += (this.usherPresenceTarget - this.usherPresence) * Math.min(1, dt * 2.5);
    this.usher.setPresence(this.usherPresence);

    if (this.dolly) {
      this.camera.position.lerp(this.dolly.target, 1 - Math.pow(0.0018, dt));
      if (this.camera.position.distanceTo(this.dolly.target) < 0.35) {
        const { done } = this.dolly;
        this.dolly = null;
        done();
      }
    } else if (!this.reducedMotion) {
      // idle breathing sway
      this.camera.position.x = CAM_HOME.x + Math.sin(t * 0.32) * 0.06;
      this.camera.position.y = CAM_HOME.y + Math.sin(t * 0.55) * 0.035;
    }

    // door raycast hover
    if (this.doors && !this.dolly) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.doors.meshes, false);
      const id = hits.length > 0 ? (hits[0].object.userData.doorId as string) : null;
      if (id !== this.hovered) {
        this.hovered = id;
        this.doors.setHover(id);
        this.setTooltip(id);
        this.events.onDoorHover(id);
        document.body.style.cursor = id ? 'pointer' : '';
      }
    }

    this.post.render(dt);
  };
}
