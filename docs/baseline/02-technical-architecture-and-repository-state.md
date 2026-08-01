# The Vestibule — Technical Architecture & Repository State

> **Baseline document 2 of 5.** This is the complete technical reference:
> how the codebase is organized, what the engine/pack seam is and why, how
> content flows to the screen, how the build and deploy pipelines work, how
> testing is structured, and the state of the repository today. It is written
> for an engineer (human or AI) who will extend or maintain the game. It
> complements — and does not duplicate — `docs/development/14-codebase-map.md`,
> which is the terse "which file owns what" lookup table; read that too. This
> document explains the *why* and the *shape*; the codebase map is the index.
>
> Companions: 01 (what the game is), 03 (future work), 04 (player experience),
> 05 (development history).

---

## 1. Stack and top-level facts

| | |
|---|---|
| **Language** | TypeScript (strict mode, `noUnusedLocals`/`noUnusedParameters` on, `noEmit` — `tsc` is a type-checker only, Vite does the transpile) |
| **Build tool** | Vite 5 (`base: './'` for subfolder deploys, target `es2022`) |
| **3D** | Three.js 0.170 (parametric geometry only — *no downloaded 3D assets*) |
| **UI** | Plain DOM overlay (no framework, no React/Vue) — text is DOM for crispness and accessibility; the 3D scene is WebGL behind it |
| **Audio** | WebAudio, fully generative (procedural chords/motes/tones — no audio files ship; a dormant file-based layer waits for assets) |
| **Fonts** | `@fontsource` Inter (Latin/Cyrillic), Spectral (serif), Vazirmatn (Farsi/Arabic) — bundled, not fetched |
| **Tests** | Vitest (`environment: 'node'`, **no jsdom/DOM**) — 1,311 tests / 89 files; plus 72 Playwright UAT scripts |
| **Desktop** | Electron 33 (`contextIsolation: true`, `nodeIntegration: false`, single-instance lock) |
| **Packaging** | electron-builder (Windows portable `.exe`) |
| **Persistence** | `localStorage` behind an async, server-shaped `SaveStore` interface (a real backend can drop in without touching game code) |
| **Networking** | None. No telemetry, no accounts, no external calls at runtime. Saves live only in the browser. |

The whole product is **static**: it builds to plain files that any static
host can serve. There is no server component.

---

## 2. The core architectural idea: one engine, N content packs

This is the single most important thing to understand before changing
anything.

> **One content-agnostic engine runs N content packs.** The engine
> (`src/engine/`, `src/ui/`, `src/scene/`, `src/audio/`) never hardcodes a
> room id, an ending id, or a piece of copy. Every such reference goes
> through the *active pack*. The `ContentPack` interface
> (`src/packs/types.ts`) is the seam.

When you hit a bug, the *first* question is always: **is this an engine bug
(affects both titles) or a content/pack bug (affects one)?** That single
question tells you which half of the tree to even open.

### 2.1 The `ContentPack` interface (`src/packs/types.ts`)

A pack is **pure data plus a small number of pure functions**. The full
shape (abbreviated — read the file for exact types):

- `meta` — id (storage/UAT namespace), title (title-screen word), export prefix.
- `rooms: Room[]`, `endings: Ending[]` — the content itself.
- `graph` — prologue id, `actPools` (per-act optional-room pools), `gates`,
  `act4Sequence`, `understorySequence`, `optionalPerAct`, `actNamesEn`,
  `understoryNameEn`.
- `endingRules` — `evaluate(state) → endingId` (the pack owns its own ending
  logic), plus hidden-ending predicates, the clarity threshold, `endingsTotal`,
  `epitaphLines`, `axisTriptych`, and `hiddenUntilWitnessed`.
- `guide` — the guide's `name`, speaker prefixes, `doorBark(...)` (which
  receives an optional cross-run `pattern`), act-intro text, the
  examined-path act barks, the figure rig, and the three one-time barks
  (first-heart-loss, remembered-room, resumed-mid-room).
- `skin` — hearts SVG, and *optional* overrides for the hearts/lucidity
  aria-labels/tooltips and axis/tradition labels. Omitting an optional field
  inherits the engine's ANAMNESIS-authored default (the
  **engine-default/pack-override pattern**, used throughout).
- `advisory?` — the optional onboarding content-warning layer (LIMERENCE
  supplies it; ANAMNESIS omits it and falls back to its plain mechanics
  explainer).
- `keepsakes`, `keepsakeTriggers`, `keepsakeIcons`, `articles`, `epiphanies`.
- `visuals` — `iconFor`, `endingIcons`, `buildTheme(id, quality, mode?)`,
  mood tints, fog colors, `dioramaFor`, `dioramaAccentHooks`,
  `supportsLightTheme`, optional `doorStyle`.
- `audio` — `roomAccents`, and optional per-act chord progressions / mote scales.
- `hooks` — `finalGateId`, `lastMessageId`, `lastMessageLabel`.
- `registerText()` — a side-effect that registers the pack's whole
  translation catalog.

### 2.2 How exactly-one-pack-ships works (tree-shaking guarantee)

`main.ts`'s `loadPack()` **dynamically imports** the pack chosen by a
build-time constant `__PACK__` (a Vite `define`, set from the `VITE_PACK`
env / `--mode`). Because the import is conditional on a build-time constant,
Rollup **tree-shakes the other pack's entire module graph out** of the
production bundle. This is *verified*, not assumed: `scripts/verify-pack-isolation.mjs`
greps the real minified bundles for the *other* pack's guide vocabulary and
prose and fails the deploy if any leaks. That script is wired into the Pages
deploy workflow.

Two important nuances the seam comment in `types.ts` spells out:

1. The tree-shaking guarantee is about **what ships to a player**. It is
   *not* a claim about the dev server (which serves both packs unbundled,
   switchable at runtime via `?pack=limerence`).
2. It is *not* a licence for engine code to hardcode either pack's
   ids/vocabulary. **Unscoped defaults and shared UI-chrome keys are still a
   real leak class** independent of bundling — which is why translation keys
   use a *scoped* pattern (`scoped(uiKey('x'), packId)`) whenever a string
   genuinely differs per pack. There is a lint test
   (`engineDefaultLeakLint.test.ts`) and a cross-pack-leak test
   (`crossPackLeaks.test.ts`) guarding this.

The one *accepted* coupling: shared engine code carries a handful of unused
ANAMNESIS-default parameter values (e.g. `DEFAULT_GRAPH` room ids) that
appear as dead strings in the LIMERENCE bundle but are never player-reachable.
This "engine-default leak" is documented and deliberately accepted; the
isolation script deliberately probes *prose*, not room ids, to avoid
re-flagging it.

---

## 3. Directory-by-directory tour

Full file inventory is in the codebase map; this is the conceptual layout.

```
src/
  main.ts                 boot: pick pack (loadPack), install recovery net, start
  engine/                 pack-agnostic game logic — NO rendering
  ui/                     DOM rendering — NO game logic
  scene/                  three.js rendering
  audio/                  WebAudio generative sound + dormant voice layer
  content/                ANAMNESIS's own room/text data (also the engine's shared defaults)
  packs/
    types.ts              the ContentPack seam
    anamnesis/index.ts    thin — mostly re-exports src/content/
    limerence/            a full parallel content tree (its own rooms/, text/, theme, etc.)
```

### 3.1 `src/engine/` — the pack-agnostic core

The state machine and rules, no DOM, no WebGL.

- **`flow.ts` (~1,340 lines)** — the main game loop / state machine: title →
  onboarding → room loop → doors → ending. It owns the `Game` class (one
  class, many private fields shared across methods), the pause-menu dispatch,
  `enterRoom`, field-note/article wiring, and the persist chain. Most
  cross-cutting bugs trace here. It is the single largest file and the one
  candidate for a future module split (see doc 03).
- **`schema.ts`** — the core types (`Room`, `Stage`, `Choice`, `Beat`,
  `Effects`, `RunState`, `Ending`, `Reflection`, `TranscriptEntry`) *and*
  `isStructurallyValidRun` (the shape-only save-boundary guard; it has zero
  imports so it can live beside `RunState` and be called from
  `hydrateProfile` without a cycle). `Beat` is the key type:
  `string | ((s: RunState) => string)` — a beat can be a plain string or a
  function of run state, which is how dynamic/conditional narration works.
- **`gameState.ts`** — `newRun()`, `applyEffects` (the hearts/lucidity/axes/
  flags reducer), and the `choseIn`/`choseInPrior`/`hasFlag` helpers every
  cross-room echo and dynamic beat uses, plus the Understory prior-run mirror
  logic (`pickShadowMoments`/`pickUnchosenRooms`/`pickExhibitEntry`) and
  `asTranscript` (the guard for hostile `prior.transcript` data).
- **`storyEngine.ts`** — `offeredDoors` (the door-offering logic), act-gate
  and Understory-fork eligibility, `isResumableRun` (registry-level "do these
  room ids exist in this pack?" validation), `backfillVisitedForJump`.
- **`endings.ts`** — ANAMNESIS's own ending evaluator (the *default* legacy
  call sites use; each pack overrides via `ContentPack.endingRules`).
- **`ledger.ts`** — Ledger/Register stats aggregation.
- **`saveStore.ts` / `localSave.ts`** — profile persistence: the `Profile`
  and `Settings` shapes, `hydrateProfile` (coerce-not-reject for profile
  fields, discard-not-repair for a broken `RunState`), `sanitizeSettings`,
  migration, backup-on-corruption, `localStorage` keying
  (`${packId}:profile:traveler`).
- **`sharedDisplaySettings.ts`** — the cross-pack display-settings bridge.
- **`patterns.ts`** — cross-run pattern detection for the recognition barks.
- **`oneDoor.ts`** — the One Door vignette room-pool logic.
- **`reflections.ts`** — Examined Path reflection-card selection.
- **`recovery.ts`** — global error/unhandledrejection/webglcontextlost handlers.
- **`uatMode.ts`** — the `?uat=1` test mode: typewriter off, 4× speed, and
  the `window.__anamnesisUat` handle (`version`, `state()`, `doorRects()`,
  `fps()`, `jump(roomId)`).
- **`text/resolver.ts`** — `t(key, fallback, state?)`, `register`/`registerAll`,
  `setLocale`/`nextLang`. Both a `fallback` and any registered override can
  each independently be a string *or* a `(state) => string` function — this
  is how dynamic beats translate per-language. Languages: `en → cs → fa → de
  → fr` (cycling order matters for UAT scripts).
- **`text/keys.ts`** — the key-naming functions (`roomBeatKey`,
  `roomChoiceTextKey`, `uiKey`, `scoped`, `actNameKey`, etc.) every
  translated string routes through.

### 3.2 `src/ui/` — DOM rendering, no game logic

- **`overlays.ts` (~1,340 lines)** — the largest UI file: title screen,
  Settings, Codex/Ledger/Register/About/Credits panels, persona picker, end
  screen, and `showRoomArticle`. The title-menu button order lives here and
  grows almost every session — tests must never hardcode positions
  (`data-uat="settings-button"` exists for exactly this).
- **`textPanel.ts`** — beat-by-beat rendering, typewriter, back/reread
  navigation, speaker-prefix styling (reads `pack.guide.speakerPrefixes`),
  `resolveBeat()`.
- **`choices.ts`** — choice/door card rendering, arrow-key nav, the `rise`
  entrance animation and the `.settled` class (source of a real
  invisible-card bug once; guarded by `animationSettleLint.test.ts`).
- **`hud.ts`, `focusTrap.ts`, `fieldNote.ts`, `reflection.ts`,
  `explanation.ts`, `toast.ts`, `recovery.ts`, `fullscreen.ts`, `locale.ts`,
  `dom.ts`, `zoom.ts`** — the smaller pieces. **`dom.ts`'s `el()` uses
  `textContent`, never `innerHTML`, for user-facing strings — this is the
  injection-safety invariant every other file relies on.** Overlay z-index
  stacking is load-bearing: `.overlay` is `z-index: 50`, `.field-note` is
  `55`, and anything meant to render on top of an open field note needs its
  own higher class (`.overlay.above-field-note { z-index: 56 }`).

### 3.3 `src/scene/` — three.js

- **`director.ts` (~740 lines)** — `SceneDirector`, the render-loop class:
  camera, renderer, door mounting, diorama mounting, theme/mood application,
  guide-figure walks, title parallax, idle-fps downshift, the *full* scene
  rebuild on light/dark toggle. **Needs a real WebGL context — not
  unit-testable directly** (no jsdom); test its pure helpers or lock
  invariants at source-text level.
- **`themes.ts`** — per-act base scene geometry + the reusable Phase V
  "fixture kit" (migrating end window, departures board, banded/locker walls,
  wall sconces, skyline) configured per floor as data + the guide-figure rig
  + mood tinting + ambient door-flicker.
- **`dioramas.ts`** — ANAMNESIS's per-room bespoke diorama registry + shared
  helpers (`mat`, `box`, `DIORAMA_Z`) that LIMERENCE's own dioramas import +
  the per-choice `dioramaAccentHooks`.
- **`doors.ts`** — door mesh creation, hover glow/pool lights, light-spill
  sync, creak sound.
- **`post.ts`** — the post-processing composer (bloom/grain/vignette), gated
  by `quality: 'high'` (this bloom pass is the dominant GPU cost, which is
  why low quality skips the composer entirely).

Three.js `Scene`/`Group`/`Mesh` objects *are* constructible without a
browser, so `scene.test.ts`/`dioramas.test.ts` test the object graph
directly — but anything needing an actual `WebGLRenderer` cannot be
unit-tested.

### 3.4 `src/audio/`

- **`soundEngine.ts` (~730 lines)** — the WebAudio graph: independent buses
  (`musicGain`, `sfxGain`, `voiceGain`, plus `genDuck`, the generative-bed
  duck bus a file track can silence, and `chordBus`), generative chord/mote
  music per act, door hover tones, a master compressor, and
  visibility-based suspend/resume.
- **`voiceover.ts`** — the dormant F2 voice-file playback layer, manifest-
  driven, a no-op while the manifest is empty (which it is until real audio
  files are supplied).

### 3.5 `src/content/` and `src/packs/limerence/`

`src/content/` is ANAMNESIS's own content **and** the engine's shared
defaults: `rooms/{prologue,act1..4,understory}.ts`, `graph.ts`,
`endings.ts`, `keepsakes.ts`, `articles.ts`, `icons.ts`, `usher.ts`, and the
enormous `text/` tree (one file per language × content-type — never `Read`
these wholesale; `Grep` for the specific key). `src/packs/limerence/` is a
*full parallel content tree*: its own `rooms/`, `text/`, `dioramas.ts`,
`articles.ts`, `endings.ts`/`endingLogic.ts`, `guide.ts`, `figure.ts`,
`icons.ts`, `theme.ts`.

**Dynamic (conditional) beat translations** live specifically in
`text/{cs,de,fa,fr}-dynamic.ts`, registered via individual `register(key,
'v2', lang, (s) => ...)` calls — *not* inline in the object-literal room
files (with two harmless historical outliers).

---

## 4. Data flow: from a room definition to the screen

1. A **`Room`** is pure data (`schema.ts`'s shape): `stages[]`, each with
   `beats[]` (strings or functions), `choices[]`, an optional `explanation`.
2. `flow.ts`'s `enterRoom` renders the current stage's beats through
   `textPanel.ts`, resolving each `Beat`: if it's a function, call it with
   the live `RunState`; then run the result through `t(key, resolvedString,
   state)` so it's translated.
3. The player picks a choice; `applyEffects` (`gameState.ts`) folds its
   `Effects` (hearts/lucidity/axes/flags/loseMemory) into `RunState`, appends
   a `TranscriptEntry`, and the outcome beats play.
4. On a gate, `offeredDoors` (`storyEngine.ts`) computes the next set of
   door options from the graph + visited history + the per-run `doorSeed`.
5. At the final gate, `pack.endingRules.evaluate(state)` returns an ending
   id; `playEnding` runs its beats, updates lifetime counters, evaluates
   epiphanies, composes the Morning Report, and persists.
6. Every displayed string — beats, choices, field notes, UI chrome — is
   keyed and translated through the resolver; the English text at the call
   site is the fallback.

---

## 5. Persistence and the save boundary

Profiles persist to `localStorage` under `${packId}:profile:traveler`, with a
`:backup` sibling key written only after a load's hydrate succeeds. `Profile`
holds: the in-progress `run` (a `RunState | null`), the persistent
`codexUnlocked`/`endingsSeen`, `lastMessage`(+`lastMessageChoiceId`),
lifetime counters, `settings`, `persona`(+`personaOffered`), keepsakes,
`choiceHistory`, the last-run transcript snapshot, and more.

**The save file is the one genuinely untrusted input.** `localStorage` is
editable by anyone with devtools, and profiles are exportable/importable as
JSON files. The boundary is hardened in layers:

- `JSON.parse` failure → fall back to `:backup`; if that's corrupt too →
  reset to defaults and flag it (a one-time notice).
- **Valid JSON carrying hostile values** is a separate surface, hardened
  after an adversarial-save troll pass found 10 real crashes. `hydrateProfile`
  **coerces** every profile field to a safe value (arrays, counts, booleans,
  `sanitizeSettings` whitelisting every Settings field to its valid domain),
  and **discards** (never repairs) a structurally broken `RunState` via
  `isStructurallyValidRun` (shape only) plus `isResumableRun` (registry-level).
  Discarding rather than repairing is deliberate: a plausible-but-invented
  substitute state is worse for the player than a clean fresh run.
- Hostile `prior.transcript` data is guarded by `asTranscript`, which filters
  non-object/malformed items rather than trusting `Array.isArray` alone.

There is a large body of tests for this (`hostileSaves.test.ts`,
`saveIntegrity.test.ts`, `saveScenarios.test.ts`, `saveRoundTrip.test.ts`,
`state.test.ts`) and permanent adversarial-save UAT scripts.

---

## 6. Build, deploy, and tooling

### 6.1 npm scripts (`package.json`)

- `dev` / `dev:limerence` — per-pack dev servers (`predev` runs the manifest
  build first).
- `build` — type-check + single-pack bundle (dev convenience only; no release
  uses it).
- `build:anamnesis` / `build:limerence` — `tsc --noEmit && vite build` into
  `dist-web/<pack>/`.
- **`build:web`** — both packs **plus** `scripts/assemble-web-dist.mjs`,
  which combines them with the static `landing/` chooser page (rozcestník)
  and copies `av-manifest.json` into the tree. **This is what both GitHub
  Pages and the Windows build use.**
- `verify:isolation` — `node scripts/verify-pack-isolation.mjs` (the bundle
  cross-pack-leak grep; wired into the deploy workflow after `build:web`).
- `test` / `test:watch` — Vitest.
- `electron` / `dist:win` — Electron dev run / Windows portable `.exe`
  (`predist:win` runs `build:web`).
- `build:manifest` — `scripts/build-voice-manifest.mjs`, scans
  `public/voice/` and `public/music/` → `public/av-manifest.json`. Runs
  automatically before every dev/build via `predev`/`prebuild` hooks. Drives
  the "don't show the narration Settings row until real files exist" gating.

### 6.2 CI workflows (`.github/workflows/`)

- **`deploy-pages.yml`** — on published release (or manual dispatch): `npm
  ci` → `npm run build:web` → **`npm run verify:isolation`** → deploy the
  `dist-web/` tree to GitHub Pages. The isolation check fails the deploy on a
  cross-pack leak, not just a future audit.
- **`release-windows.yml`** — builds the Electron Windows portable `.exe`,
  gated on the test suite passing. Triggerable by `workflow_dispatch` (the
  path actually exercised) or a `v*` tag push.

### 6.3 Electron wrapper (`electron/main.cjs`)

`contextIsolation: true`, `nodeIntegration: false`, no remote, single-instance
lock, off-screen window-state guard. `loadFile(dist-web/index.html)` serves
the same relative layout as GH Pages, so the "Exit to The Vestibule" button
(`location.href = '../index.html'`) works identically in both.

### 6.4 The `dist-web/` on disk

A built `dist-web/` currently exists on disk (gitignored). Its structure:
`index.html` (rozcestník) + `anamnesis/` + `limerence/`, each pack a full
independent Vite build with its own `assets/`, `av-manifest.json`, and empty
`voice/`/`music/` folders. `dist/`, `dist-web/`, and `release/` are **all
gitignored — nothing built is committed.**

---

## 7. Testing strategy

Two tiers, because of one hard constraint: **Vitest runs with `environment:
'node'` — there is no DOM and no WebGL in unit tests.**

### 7.1 Unit/integration (Vitest, `src/test/`, 89 files, 1,311 tests)

One file per concern, mostly **pack-parameterized** (`describe.each` over
`[anamnesisPack, limerencePack]`). Because there's no DOM, UI-layer code is
tested by two techniques:

1. **Pure-logic tests** — the reducers, graph, ending evaluators, save
   hydration, translation resolution, etc. are all pure and directly tested.
2. **Source-shape tests** — for DOM/WebGL/CSS behavior that a node test
   *cannot* observe (opacity, paint, z-index, focus, a listener ordering),
   the test reads the source file as text and asserts the structural pattern
   exists at the right location (e.g. `staleThemePaint.test.ts`,
   `animationSettleLint.test.ts`, `dioramaFillLight.test.ts`,
   `fixBatch20260721.test.ts`, `extendedReviewBatch3.test.ts`,
   `ownerDecisions20260801.test.ts`). This is a deliberate, repo-wide
   convention, not a smell — it locks in invariants a logic test structurally
   can't see.

Notable suites: `contentInvariants.test.ts` (a scaled-down seeded Monte Carlo
playthrough harness — 120 runs/variant × 3 profile shapes × 2 packs, checking
termination, no re-offers, act monotonicity, evaluator totality, downstream
no-throw — plus an ending-reachability axis-bound tripwire);
`dynamicBeats.test.ts` (every conditional beat × 4 non-English languages);
`translationCoverage.test.ts` / `limerenceTranslationCoverage.test.ts` /
`translationKeyValidity.test.ts` (coverage *and* the inverse — dangling keys);
`colorContrast.test.ts` (real WCAG math against the live CSS);
`crossPackLeaks.test.ts` / `engineDefaultLeakLint.test.ts` (the isolation
invariants at source level).

### 7.2 Live UAT (Playwright, `tests/uat/`, 72 scripts)

Plain Node scripts (not a test-runner), each run against a real dev server,
governed by `tests/uat/README.md` and sharing `_helpers.mjs`
(`withPage`/`gotoUat`/`jump`/`patchProfile`/`assert`). Every script loads
with `?uat=1`. `run-all.mjs` batch-runs the suite into timestamped,
*committed* `results/` for diffing over time. **Standing rule (CLAUDE.md):
each UAT script must finish in under 3 minutes wall-clock**, advance beats by
keyboard with short fixed waits (not click-loops), and use `jump(roomId)` to
land directly on a room rather than playing there by hand. Ask before
re-running (browser automation is token-expensive).

The `?uat=1` handle (`window.__anamnesisUat`) exposes `version`, `state()`,
`doorRects()`, `fps()`, and `jump(roomId)` — the last persists a legitimate
`RunState` and reloads, so it can never produce an illegal game state; it
refuses unknown ids with a console warning.

### 7.3 `verify-pack-isolation.mjs`

A separate Node script (not Vitest, because it needs a real production build)
that reads the minified `dist-web/{anamnesis,limerence}/assets/*.js` and
asserts neither bundle contains the other pack's guide vocabulary (in all 5
languages) or verbatim prose. Run via `npm run verify:isolation` after
`npm run build:web`.

---

## 8. Repository state (as of this document)

- **Live branch:** `claude/vestibule-v2-overhaul` (the current working branch).
- **Prior branch:** `claude/philosophical-roguelike-game-zslw5n` (where the
  bulk of Milestones 1–5 and the LIMERENCE build landed; also still present).
- **Version:** `1.0.0-rc.2`.
- **Health:** `tsc --noEmit` clean, 1,311/1,311 tests green, `npm run
  build:web` clean, `npm run verify:isolation` OK, on every recent commit.
- **Source size:** ~43,800 lines of non-test TypeScript, ~12,300 lines of
  test TypeScript (a very high test-to-source ratio, by design).
- **Documentation:** `docs/development/` holds a numbered, append-only
  chronological dev log (`01`–`18`) whose live index is
  `13-master-development-plan.md`; `docs/design-limerence/` holds LIMERENCE's
  historical design specs (banner-marked historical); `14-codebase-map.md` is
  the file-lookup index; `17-v2-overhaul-plan.md` is the current forward plan;
  `18-extended-code-review-2026-08-01.md` is the most recent full code review
  (all its findings resolved). This `docs/baseline/` directory is the
  five-document expansion baseline.

---

## 9. Conventions and invariants a new contributor must not break

1. **No engine code hardcodes a pack's room ids, ending ids, guide words, or
   copy.** Route through the active pack. Pack-differing strings use scoped
   translation keys.
2. **`el()`/`textContent` for user-facing strings — never `innerHTML`** with
   user-controlled data. `renderEmphasis` HTML-escapes before `**bold**`
   substitution. Authored/translated catalog strings are the only thing any
   `innerHTML` site injects.
3. **Guide-vocabulary isolation (R4):** never let one pack's guide word leak
   into the other's bundle — Uvaděč/Vrátný, نگهبان/دربان, Platzanweiser/Portier,
   Le Placeur/Le Portier. (Carve-out: a *comment* naming the other pack's word
   specifically to warn against using it is allowed; registered string values
   never are.)
4. **Context-first translation for every string, UI chrome included** — never
   a word-for-word calque; read the surrounding situation first.
5. **Schema changes to a persisted field need a version bump + a migration +
   a fixture test.** Additive optional fields survive spread-merge for free
   and don't need a bump.
6. **The guide reads state, never writes it.** Persistence goes through
   `SaveStore` only. Unseeded randomness is for cosmetics only (gameplay
   randomness uses the per-run `doorSeed`).
7. **The Experience Charter (`docs/development/10-experience-charter.md`) is
   binding and wins conflicts:** quiet UI, no grades, no dark patterns,
   endings are trades not verdicts, the doors are the game, nothing competes
   with the door screen.
8. **Keep the codebase map and this baseline updated in the same commit** as
   any structural or content change that makes an entry stale.

---

*Baseline document 2 of 5 · verified against the source on branch
`claude/vestibule-v2-overhaul` at version `1.0.0-rc.2`. Companion documents:
01 (game), 03 (future), 04 (experience), 05 (history).*
