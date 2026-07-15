# Codebase map (for the coding assistant, not the player)

Read this before doing broad `Glob`/`Grep`/`Explore` passes — it exists so
future sessions can jump straight to the right file instead of
re-discovering the architecture from scratch every time. Keep it updated
when files are added/moved/renamed; a stale map costs more tokens than none
(wrong guesses still need verifying). Update it in the same commit as
whatever structural change makes an entry stale.

## The one-sentence architecture

One shared **engine** (`src/engine/`, `src/ui/`, `src/scene/`, `src/audio/`)
runs **N content packs** (`src/packs/anamnesis/`, `src/packs/limerence/`,
plus the shared room/text data each pulls from `src/content/`) — the
`ContentPack` interface (`src/packs/types.ts`) is the seam. If you're
fixing a bug, ask first: *is this an engine bug (affects both packs) or a
content/pack bug (affects one)?* — it tells you which half of the tree to
even open.

## `src/engine/` — pack-agnostic game logic, no rendering

| File | What it owns |
|---|---|
| `flow.ts` | The main game loop / state machine: title → onboarding → room loop → doors → ending. Largest file (~900 lines); most cross-cutting bugs trace back here. |
| `gameState.ts` | `RunState` shape + `applyEffects` (hearts/lucidity/axes/flags math). |
| `storyEngine.ts` | Door-offering logic (`offeredDoors`), act-gate/understory-fork eligibility, `backfillVisitedForJump`. |
| `schema.ts` | Core types: `Room`, `Choice`, `RunState`, `ContentPack`-adjacent shapes. |
| `endings.ts` | ANAMNESIS's own ending evaluator (the *default* used by legacy call sites — each pack overrides via `ContentPack.endingRules`). |
| `saveStore.ts` / `localSave.ts` | Profile persistence: hydrate/migrate/backup-restore, `localStorage` keying (`${packId}:profile:traveler`). |
| `ledger.ts` | The Traveler's Ledger / Hotel Register stats aggregation. |
| `reflections.ts` | Examined Path reflection-card logic. |
| `oneDoor.ts` | T9 "One Door" vignette room-picking pool logic. |
| `recovery.ts` | Global error/unhandledrejection/webglcontextlost handlers. |
| `uatMode.ts` | `?uat=1` flag: typewriter-off, 4x speed multiplier, exposes `window.__anamnesisUat`. |
| `text/resolver.ts`, `text/keys.ts` | `t(key, fallback)` + the `roomBeatKey`/`uiKey`/etc. key-naming functions every translated string goes through. |

## `src/ui/` — DOM rendering, no game logic

| File | What it owns |
|---|---|
| `overlays.ts` | Largest UI file (~1000+ lines): title screen, Settings, Codex/Ledger/Register/About/Credits panels, persona picker, end screen. Title-menu button order lives here (`showTitle`) — grows almost every session, so tests must never hardcode its button positions (see `data-uat="settings-button"` pattern). |
| `textPanel.ts` | Beat-by-beat text rendering, typewriter, back/reread (F4), speaker-prefix styling (reads `pack.guide.speakerPrefixes`). |
| `choices.ts` | Choice/door card rendering (`ChoicePanel.pick`/`pickDoor`), arrow-key nav, the `rise` entrance animation + `.settled` class (see `animationSettleLint.test.ts` for the bug class this produced). |
| `hud.ts` | In-game top bar: hearts, act name, language cycle button, menu button. |
| `fieldNote.ts` | The field-note modal (`.fn-close`). |
| `focusTrap.ts` | Overlay Tab-containment (9.5.1). |
| `locale.ts` | `applyLocaleToDocument` — only touches `dir`/`.rtl`/`.lang-fa`, never `document.documentElement.lang` (stays `"en"` always; don't assert on it). |
| `dom.ts` | `el()` helper — always `textContent`, never `innerHTML`, for user-facing strings (the injection-safety invariant). |

## `src/scene/` — three.js rendering

| File | What it owns |
|---|---|
| `director.ts` | `SceneDirector` — the big render-loop class: camera, renderer, door mounting, diorama mounting (`setDiorama`/`clearDiorama`, plus the diorama fill light), theme/mood application, Usher figure walks, title parallax. Needs a real WebGL context — **not unit-testable directly** (no jsdom in this project); test the pure helper functions it calls instead, or lock invariants at the source-text level (see `dioramaFillLight.test.ts` for the pattern). |
| `doors.ts` | Door mesh creation, hover glow/pool lights, creak sound trigger, ambient ("ally guide passing") ping. |
| `dioramas.ts` | ANAMNESIS's per-room bespoke diorama registry (`DIORAMA_ROOM_IDS`, `dioramaFor`) + shared helpers (`mat`, `box`, `DIORAMA_Z`) that LIMERENCE's own `packs/limerence/dioramas.ts` also imports. |
| `themes.ts` | Per-act base scene geometry (`corridorTheme`, `machineryTheme`, etc.) + the Usher figure rig + mood tinting. LIMERENCE reuses these wholesale today (item 3 in the master plan: a bespoke rework is still open). |
| `post.ts` | Post-processing composer (bloom/grain/vignette), gated by `quality: 'high'`. |

## `src/audio/`

`soundEngine.ts` (buses, generative chord/mote music, door hover tones,
compressor) + `voiceover.ts` (F2 dormant voice-file playback, gated on a
manifest that's empty until the owner supplies audio files).

## `src/content/` — ANAMNESIS's own room/text data (shared defaults)

`rooms/{prologue,act1..4,understory}.ts` are ANAMNESIS's real room content;
`graph.ts` is the act-sequence/gate/door-pool graph engine functions
default to; `text/` holds **every** English v1/v2 + cs/fa/de/fr string,
one file per language×content-type (huge — don't `Read` these wholesale,
`Grep` for the specific key or room id you need).

## `src/packs/` — the pack seam

`types.ts` defines `ContentPack` (graph, endingRules, guide, visuals,
audio identity, keepsakes, hooks, meta). `packs/anamnesis/index.ts` is
thin (mostly re-exports `src/content/`'s defaults). `packs/limerence/`
is a full parallel content tree: its own `rooms/`, `text/`, `dioramas.ts`
(34/34 parity with ANAMNESIS), `endings.ts`/`endingLogic.ts`, `guide.ts`
(Porter voice/barks), `figure.ts` (Porter rig), `icons.ts`, `theme.ts`
(light/dark palettes).

## `src/test/` — vitest, `environment: 'node'` (no DOM/jsdom)

One file per concern, mostly pack-parameterized (`describe.each`-style
loops over `[anamnesisPack, limerencePack]`). Notable non-obvious ones:
`staleThemePaint.test.ts` / `animationSettleLint.test.ts` /
`dioramaFillLight.test.ts` — CSS/source-text regression guards for bugs
that only manifest visually (opacity, paint) and are invisible to normal
logic tests. Three.js `Scene`/`Group`/`Mesh` objects *are* constructible
without a browser (no canvas needed for the object graph), so
`scene.test.ts`/`dioramas.test.ts` test those directly — but anything
needing an actual `WebGLRenderer` (i.e. `SceneDirector` itself) cannot be
unit-tested and needs either a source-text lock (see above) or a live
Playwright check.

## `tests/uat/` — live Playwright scripts, run via a real dev server

Plain Node scripts (not vitest), one per concern, governed by
`tests/uat/README.md` (has the full script index — check there before
writing a new one, you may not need to). `_helpers.mjs` has the shared
`withPage`/`gotoUat`/`jump`/`advance`/`assert` toolkit. `run-all.mjs`
batch-runs the whole suite into timestamped `results/` (committed, for
diffing over time). **Known gotcha:** never select title-menu or
Settings-panel buttons by DOM position/index — both lists have grown
repeatedly and will again; use the `data-uat="..."` attributes on the
buttons that have them, or add one rather than hardcoding an index.

## Fast-lookup cheatsheet (avoid re-discovering these)

- **"Where does room X's content live?"** — ANAMNESIS: `src/content/rooms/actN.ts` (grep the room id). LIMERENCE: `src/packs/limerence/rooms/actN.ts`.
- **"Where does string key X get translated?"** — `src/content/text/<lang>-*.ts` (ANAMNESIS) or `src/packs/limerence/text/<lang>-*.ts` (LIMERENCE); the *English fallback* is always the second arg to `t(key, fallback)` at the call site, not in a text file.
- **"What's the current title-menu button order?"** — `src/ui/overlays.ts`'s `showTitle` function, `menu.append(...)` call — don't assume, it changes often.
- **"Does this need a live Playwright check or does a unit test suffice?"** — if it's pure logic/data, unit test. If it's real rendered CSS/opacity/paint/WebGL, a unit test *cannot* see it (no DOM/GL in vitest here) — needs either a source-text lock (cheap, see the three examples above) or a live UAT script (expensive, budget accordingly).
- **Version/plan doc:** `docs/development/13-master-development-plan.md` is the live, current plan — check it before assuming something is undone.
