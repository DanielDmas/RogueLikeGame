import * as THREE from 'three';
import { buildTheme, usherFigure, type ThemeConfig, type ThemeId } from './themes';
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

    this.usher.group.position.set(6.2, -0.05, -4.6);
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

  setTheme(id: ThemeId) {
    if (this.theme) {
      this.scene.remove(this.theme.group);
      this.theme.group.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    }
    this.theme = buildTheme(id);
    this.scene.add(this.theme.group);
    this.scene.fog = new THREE.FogExp2(this.theme.fogColor, this.theme.fogDensity);
    this.scene.background = new THREE.Color(this.theme.background);
    // the Usher haunts every act except the ending space
    this.usher.group.removeFromParent();
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
    return new Promise((done) => {
      this.dolly = { target, done };
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
