# Specification 07 — Visual & Audio Overhaul (Phase Q)

## 1. Purpose & player experience

The owner chose the full option: room dioramas AND doorway light-spill AND
title polish. Every room should *look like somewhere*, choosing a door should
feel like walking toward light from elsewhere, and the title screen should
promise the game's quality before the first click. Audio deepens to match:
real reverb, transitions that breathe.

## 2. Scope & non-goals

- **In scope:** Q1 dioramas, Q2 light-spill, Q3 title polish (version, fog
  parallax, epitaph wall), Q4 door hover pulse, Q5 audio deepening, Q6 Usher
  lantern.
- **Non-goals:** no textures/models/assets (everything stays generated
  silhouette geometry + light, the established look), no shader authoring
  beyond what three.js materials provide, no changes to room *content*.

## 3. Current state of the code

- Scene — `src/scene/director.ts`: `SceneDirector` owns camera
  (`CAM_VFOV_DEG = 58`, `CAM_HOME z 7.6`), render loop (60fps cap +
  `setPaused`), `setTheme(id)` (disposes previous theme group),
  `setMood(type)` (fog/background tint via `applyMood`), `showDoors/hideDoors`
  (+`frameDoors()` aspect-aware framing), `walkThrough(id)` (fixed-duration
  eased tweens: `USHER_WALK_SECONDS 2.5`, `CAMERA_DOLLY_SECONDS 2.0`,
  `easeInOutCubic`), hover raycasting + `highlightDoor`, tooltip.
- Themes — `src/scene/themes.ts`: `buildTheme(id): ThemeConfig { group,
  fogColor, fogDensity, background, tick(t) }`; `usherFigure(): { group,
  tick(t), setPresence(v) }` — the silhouette-plus-lights construction
  pattern (incl. its SpotLight added in M4); `MOOD_TINTS` per room type;
  `silhouette()` helper.
- Doors — `src/scene/doors.ts`: door meshes with emissive glow planes,
  `lintel(id)` anchor, `DOOR_Z`, spacing 3.4; hover intensity already lerps.
- Audio — `src/audio/soundEngine.ts`: graph `destination ← master(0.55) ←
  {musicGain, sfxGain, noiseGain}`; `musicGain ← chordBus ← chordGain(0.16)`;
  `setAct(act)` crossfades chord progressions (`crossfadeToChord`,
  `scheduleNextChord`, `scheduleNextMote`); sfx = procedural `blip()`s;
  **no ConvolverNode anywhere**.
- Title — `showTitle` (`src/ui/overlays.ts`); the 3D behind it is theme 0;
  `document.hidden`/pause logic already throttles it.
- Version — `package.json` `version` field; no build-time injection exists.
- Perf guards from M4 to respect: `renderScale`/`pixelRatioFor`, quality
  low/high (bloom only on high), `reducedMotion`, disposal patterns +
  `renderer.info` soak test (`scene.test.ts` has the pattern).

## 4. Q1 — Room dioramas

### Contract

New module `src/scene/dioramas.ts`:

```ts
export interface Diorama {
  group: THREE.Group;
  /** subtle idle motion; no-op under reducedMotion (director passes a flag) */
  tick(t: number): void;
  dispose(): void;   // geometries, materials, lights removed
}
/** Returns null for rooms without a bespoke diorama — act theme alone then. */
export function dioramaFor(roomId: string, quality: 'low' | 'high'): Diorama | null;
```

- Placement: group centered around `z ≈ -10` (behind DOOR_Z, inside the fog),
  scaled to read as a backdrop vignette; must never intersect the door row or
  the Usher's walk path (x ∈ [-7, 7], z ∈ [-1, 4]).
- Construction rules: `silhouette()`-style dark meshes + at most 2 lights
  (quality low: 1 light, no more than ~40 meshes); materials
  `MeshStandardMaterial` flat colors/emissive only; every diorama's `dispose`
  is mandatory and tested.
- Director integration: `director.setDiorama(roomId | null)` — called by
  `flow.ts` in `enterRoom` (after `setMood`) and cleared at `completeRoom` /
  door screens. Disposal on replace; `setTheme` also clears it. Tick wired
  into the render loop beside the theme tick.

### Motif table (bespoke; all others return null → act theme)

| Room | Vignette (silhouette + light) |
|---|---|
| `junction` | converging rails, a lever stand; cold white point light low |
| `experience-machine` | a reclined cradle + cable arcs; soft cyan glow inside |
| `ship` | mast + boom + three rigging lines; slow 0.5° sway tick |
| `casino-pascal` | a neon arch (emissive tube torus segments); flicker tick |
| `omelas` | strung lanterns (small emissive spheres on a catenary) over one tiny door |
| `teleporter` | two circular pads, one faintly lit |
| `editor` | a wall of drawer-fronts, one drawer ajar and lit |
| `debt-of-dead` | a bedside chair + IV pole silhouette, warm low lamp |
| `boulder` | the slope diagonal + one great sphere at rest |
| `marys-room` | grey shelving; ONE saturated red cube, lit only when its drawer-choice outcome plays — expose `Diorama.setAccent?(on: boolean)` optional hook, called by flow on that room's `open-drawer` outcome |
| `chinese-room` | a booth box with a glowing paper slot |
| `newcomb-annex` | two boxes on a plinth, one glass-edged (wireframe) |
| `veil-of-ignorance` | twelve tiny house gables in a row, one lit |
| `buridans-queue` | two identical doorframes + a hanging clock circle |
| `the-reference` | a desk + anglepoise lamp cone |
| `butterfly-dream` | paper wall panels, backlit; a small wing pair suspended |
| `swampman` | two chairs facing, a puddle disc reflecting (emissive ellipse) |
| `the-cave` | fire point-light + 3 flat shadow figures on a wall plane (tick: flicker) |
| understory trio | shared family: bare hanging bulbs + shelving depths, per-room accent |

### Tests

Registry completeness (`dioramas.test.ts`): every registry room id returns a
Diorama or null without throwing; each Diorama's group has ≤ mesh budget;
dispose leaves `renderer.info` counts unchanged across a 10-room soak
(reuse the M4 soak pattern in `scene.test.ts`).

## 5. Q2 — Doorway light-spill

- On `walkThrough(id)`: spawn one `THREE.PointLight` just behind the chosen
  door (`z = DOOR_Z - 0.6`, door's x), color = `MOOD_TINTS[roomType].tint`
  (fallback: next act theme's `fogColor` when tint is black/none), intensity
  animated 0 → ~2.5 over the dolly's first half, held, killed at fade-out.
  Also raise that door's glow-plane emissive in sync.
- Plumbing: `walkThrough(id)` needs the destination's type/act —
  extend signature to `walkThrough(id, spill?: { color: number })` and let
  `flow.ts` compute the color (it knows the room).
- `reducedMotion`: light appears at full intensity instantly (no pulse).
- Test: pure helper `spillColorFor(roomType, nextActTheme)` unit-tested;
  disposal asserted (light removed from scene after fade).

## 6. Q3 — Title polish

1. **Version number:** inject via Vite —
   `vite.config.ts: define: { __APP_VERSION__: JSON.stringify(pkg.version) }`
   + `src/vite-env.d.ts` declaration. Render bottom-right of the title
   overlay, `.title-version`, dim mono 10px. (Also unlocks Ledger/About reuse.)
2. **Fog parallax:** title screen only — pointer-move shifts the theme-0 fog
   planes' group by ±0.15 units (lerped, `easeInOutCubic`ish smoothing in the
   existing loop; skip entirely under `reducedMotion`). Implement as
   `director.setParallax(enabled)` toggled by flow around the title loop —
   pointer data already exists (`this.pointer`).
3. **Epitaph wall:** when `profile.endingsSeen.length >= 2`, the title scene
   gains a large plane at z ≈ -14 with a `CanvasTexture`: the witnessed
   endings' epitaphs (`t(endingEpitaphKey(id), …)`) typeset in the serif at
   ~0.06 opacity, rotated ±1°, like carvings behind fog. Rebuild texture on
   locale change (title re-entry is sufficient — build in `showTitle`'s flow
   call, not reactively). Dispose with theme.

**Testability of Q3 (all three are unit-testable without DOM/GL):** extract
pure helpers — `parallaxOffset(pointer: {x,y}, max = 0.15): {x,y}` (clamped,
zero at center); `epitaphLines(profile): string[]` (empty under 2 endings,
translated epitaphs of exactly the seen endings, anamnesis included only when
seen); version string equals `package.json`'s (assert `__APP_VERSION__`
define wiring via a vitest that imports the built constant or reads
`vite.config.ts`). The `?uat=1` handle also exposes `version` for the UAT
title check (spec 09).

## 7. Q4 — Door hover pulse

- In the render loop's hover section: hovered door's glow plane emissive
  intensity gets `base + 0.15 * sin(t * 2.2)` (subtle); non-hovered doors
  decay to base (lerp both ways — extend the existing hover intensity lerp).
- On selection (`walkThrough` start): chosen door snaps to `base + 0.35`
  before the spill takes over.
- `reducedMotion`: static `base + 0.15`, no sine.
- **Test:** pure `hoverPulseIntensity(t, base, reducedMotion)` helper —
  bounds `[base, base + 0.15]`, constant under reducedMotion.

## 8. Q5 — Audio deepening

1. **Reverb bus:** in `ensureCtx()`, build once:
   `const convolver = ctx.createConvolver(); convolver.buffer = makeImpulse(ctx, 1.8, 2.2);`
   (`makeImpulse`: stereo buffer of exponentially-decaying white noise —
   duration 1.8s, decay power 2.2; pure function, exported for tests) —
   routed `reverbSend(gain 0) → convolver → master`. Per-sound sends: default
   sfx dry; `heartLoss` sends at 0.5, `ending` chord at 0.35, `noteOpen` at
   0.15. Music remains dry (the chord bed already self-blurs).
2. **Act crossfades:** `crossfadeToChord` currently uses its own ramp — add a
   `seconds` parameter; `setAct` passes 4.0 (in-run act transitions), default
   stays as-is for the internal progression cycling.
3. **Hover pitch per door:** `hover(index?: number)` — pitch = pentatonic
   offsets `[0, 2, 4, 7, 9]` semitones above 880 by door index
   (`880 * 2^(semi/12)`); callers pass the door's index. **All three hover
   sources must agree:** the card hover in `choices.pickDoor`, `flow.ts`'s
   runLoop hover callback, AND the 3D raycast hover in `director.ts` (which
   calls `events` → the same flow callback — verify it carries the index or
   resolve index from the door id at the flow layer, once).
4. **Diorama accents (3 only, quality high only):** junction — low 55 Hz sine
   drone at gain 0.006 while in-room; casino — mote scheduler biased +1 octave
   while in-room; ship — filtered-noise creak burst every ~11 s at gain 0.01.
   API: `sound.setRoomAccent(kind: 'junction' | 'casino' | 'ship' | null)`,
   called by flow beside `setDiorama`. All connect through `musicGain`
   (respect the music toggle).

Tests (`audio.test.ts` extension): `makeImpulse` length/decay monotonicity;
hover pitch table; accent set/clear idempotent; reverb sends exist for the
three named sfx (assert wiring via exported test hooks, matching how existing
audio tests inspect the engine).

## 9. Q6 — Usher lantern

- `usherFigure()` gains a small lantern: a 0.1-radius emissive sphere +
  `PointLight` (warm, intensity 0, distance 4) at hand height, parented to
  the group.
- API: extend the figure's return with `setLanternTarget(x: number | null)` —
  hover on door d (director already knows) raises intensity to 0.9 and leans
  the lantern-arm rotation ±0.2 rad toward the door's x; null decays to 0.
  Driven from `highlightDoor` and the render loop's decay lerp.
- During `walkThrough`, lantern stays lit toward the chosen door until the
  fade.
- Tests (`usherMotion.test.ts` extension): lantern exists, intensity clamps
  [0, 0.9], target null decays, x-lean sign matches target side.

## 10. Order & integration notes

Build Q3.1 (version define) first — trivial and other screens reuse it. Then
Q4 → Q2 → Q1 (dioramas are the bulk; ship per-act batches: existing rooms
first, spec-01 rooms as they land) → Q6 → Q5. Everything must pass the
existing perf guards: 60fps cap intact, `renderScale` respected, bloom still
high-quality-only, `document.hidden`/`setPaused` still zero-render.

## 11. Acceptance criteria

- [ ] Every bespoke room reads as *somewhere* within 1s of entry; no diorama
      leaks (soak test), no door-row intersection at any aspect ratio
      (`cameraZForDoors` framing unaffected — dioramas live behind DOOR_Z).
- [ ] Choosing a door produces colored spill + brightened door + lantern
      lean, and the walk still takes its calm 2.0–2.5s.
- [ ] Title shows version; fog drifts under the pointer; epitaphs appear
      after 2 endings; all suppressed under reducedMotion where specified.
- [ ] Heart loss audibly *rings* now; act changes crossfade over ~4s; hover
      arpeggiates across doors.
