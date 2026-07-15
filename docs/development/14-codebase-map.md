# Codebase map (for the coding assistant, not the player)

Read this before doing broad `Glob`/`Grep`/`Explore` passes — it exists so
future sessions can jump straight to the right file instead of
re-discovering the architecture (and the game's actual content) from
scratch every time. **Actually use it**: when a task needs "which room
references X", "what's the current test count", or "where do I add a
translation for room Y", check the tables below before grepping blind.
Keep it updated when files are added/moved/renamed, or when content is
added (a new room, ending, keepsake, article, UAT script); a stale map
costs more tokens than none (wrong guesses still need verifying). Update
it in the same commit as whatever structural/content change makes an
entry stale — this file drifted noticeably between 2026-07-15 sessions
(room/ending tables didn't exist at all; several file line counts were
20-30% low) before this rewrite, which is exactly the failure mode to
avoid going forward.

## The one-sentence architecture

One shared **engine** (`src/engine/`, `src/ui/`, `src/scene/`, `src/audio/`)
runs **N content packs** (`src/packs/anamnesis/`, `src/packs/limerence/`,
plus the shared room/text data each pulls from `src/content/`) — the
`ContentPack` interface (`src/packs/types.ts`) is the seam. If you're
fixing a bug, ask first: *is this an engine bug (affects both packs) or a
content/pack bug (affects one)?* — it tells you which half of the tree to
even open.

## `src/engine/` — pack-agnostic game logic, no rendering

| File | Lines | What it owns |
|---|---|---|
| `flow.ts` | ~995 | The main game loop / state machine: title → onboarding → room loop → doors → ending. Largest engine file; most cross-cutting bugs trace back here. Owns the pause-menu dispatch, room-entry (`enterRoom`), field-note + article wiring, persist chain. |
| `ledger.ts` | 226 | The Traveler's Ledger / Hotel Register stats aggregation. |
| `saveStore.ts` | 226 | Profile hydrate/migrate/backup-restore orchestration. |
| `gameState.ts` | 166 | `RunState` shape + `applyEffects` (hearts/lucidity/axes/flags math) + `choseIn`/`choseInPrior`/`hasFlag` (the helpers every cross-room echo and dynamic beat uses) + `pickShadowMoments`/`pickUnchosenRooms`/`pickExhibitEntry` (Understory prior-run mirror logic). |
| `storyEngine.ts` | 161 | Door-offering logic (`offeredDoors`), act-gate/understory-fork eligibility, `backfillVisitedForJump`. |
| `schema.ts` | 158 | Core types: `Room`, `Choice`, `Beat` (`string \| ((s: RunState) => string)` — the dynamic-beat type), `RunState`, `ContentPack`-adjacent shapes. |
| `endings.ts` | 117 | ANAMNESIS's own ending evaluator (the *default* used by legacy call sites — each pack overrides via `ContentPack.endingRules`). |
| `text/resolver.ts` | 119 | `t(key, fallback, state?)` + `register`/`registerAll` + `setLocale`/`nextLang`. `fallback` and any registered override can each independently be a plain string OR a `(state) => string` function — this is how dynamic (RunState-conditional) beats get translated per-language; see the "Dynamic beat translations" gotcha below. |
| `text/keys.ts` | 110 | The `roomBeatKey`/`roomChoiceTextKey`/`roomArticleTitleKey`/`uiKey`/etc. key-naming functions every translated string goes through. |
| `saveStore.ts`/`localSave.ts` | 226/54 | Profile persistence: hydrate/migrate/backup-restore, `localStorage` keying (`${packId}:profile:traveler`). |
| `reflections.ts` | 31 | Examined Path reflection-card logic. |
| `oneDoor.ts` | 34 | T9 "One Door" vignette room-picking pool logic. |
| `recovery.ts` | 6 | Global error/unhandledrejection/webglcontextlost handlers. |
| `uatMode.ts` | 61 | `?uat=1` flag: typewriter-off, 4x speed multiplier, exposes `window.__anamnesisUat` (`jump`, `state`, `doorRects`, `fps`, `version`). |

## `src/ui/` — DOM rendering, no game logic

| File | Lines | What it owns |
|---|---|---|
| `overlays.ts` | ~1311 | Largest UI file: title screen (`showTitle`), Settings, Codex/Ledger/Register/About/Credits panels, persona picker, end screen, `showRoomArticle` (the "Read more" long-form overlay). Title-menu button order lives here (`menu.append(...)` in `showTitle`) — grows almost every session; tests must never hardcode positions (`data-uat="settings-button"` pattern exists for exactly this reason). |
| `textPanel.ts` | 274 | Beat-by-beat text rendering, typewriter, back/reread (F4), speaker-prefix styling (reads `pack.guide.speakerPrefixes`), `resolveBeat()` (resolves a `Beat` — string or function — against `RunState`, then through `t()`). |
| `choices.ts` | 219 | Choice/door card rendering (`ChoicePanel.pick`/`pickDoor`), arrow-key nav, the `rise` entrance animation + `.settled` class (see `animationSettleLint.test.ts` for the invisible-card bug class this produced once already). |
| `hud.ts` | 109 | In-game top bar: hearts, act name, language cycle button (`.lang-btn`), menu button (`.menu-btn`). |
| `focusTrap.ts` | 100 | Overlay Tab-containment (stack-based, nested dialogs hand control back correctly). |
| `fieldNote.ts` | 91 | The field-note modal (`.field-note`, closed via `.fn-close`). `showFieldNote(ui, note, label, icon, onReadMore?)` — the optional 5th arg renders a `.fn-read-more` button without dismissing the note underneath. `renderEmphasis()` (HTML-escape + `**bold**` → `<strong>`) also lives here, reused by `showRoomArticle`. |
| `reflection.ts` | 87 | Examined Path reflection-card rendering. |
| `explanation.ts` | 56 | The "?" stage-explanation popover. |
| `toast.ts` | 42 | Quiet toast notifications. |
| `recovery.ts` | 40 | UI-layer error recovery panel. |
| `fullscreen.ts` | 36 | Fullscreen toggle + `shouldOpenPauseOnEscape` (the inGame/no-blocking-overlay/not-fullscreen gate). |
| `locale.ts` | 20 | `applyLocaleToDocument` — only touches `dir`/`.rtl`/`.lang-fa`, never `document.documentElement.lang` (stays `"en"` always; don't assert on it). |
| `dom.ts` | 20 | `el()` helper — always `textContent`, never `innerHTML`, for user-facing strings (the injection-safety invariant every other file relies on). |
| `zoom.ts` | 10 | UI zoom scaling. |

**Overlay z-index stacking** (found the hard way, 2026-07-15): `.overlay`
is `z-index: 50`; `.field-note` is deliberately `z-index: 55` ("the codex
screen opens field notes on top of itself"). Any *new* overlay meant to
render on top of an already-open field note (like `showRoomArticle`) needs
its own higher z-index class (`.overlay.above-field-note { z-index: 56; }`)
— reusing the plain `overlay()` helper silently paints underneath the
field note, which still captures pointer events even though it looks like
the new overlay is on top in a screenshot taken without moving the mouse.

## `src/scene/` — three.js rendering

| File | Lines | What it owns |
|---|---|---|
| `director.ts` | 741 | `SceneDirector` — the big render-loop class: camera, renderer, door mounting, diorama mounting (`setDiorama`/`clearDiorama`, plus the shared diorama fill light), theme/mood application, Usher/Porter figure walks (incl. the idle "guide passing" ambient event), title parallax, idle-fps downshift. Needs a real WebGL context — **not unit-testable directly** (no jsdom in this project); test the pure helper functions it calls instead, or lock invariants at the source-text level (see `dioramaFillLight.test.ts` for the pattern). |
| `dioramas.ts` | 530 | ANAMNESIS's per-room bespoke diorama registry (`DIORAMA_ROOM_IDS`, `dioramaFor`) + shared helpers (`mat`, `box`, `DIORAMA_Z`) that LIMERENCE's own `packs/limerence/dioramas.ts` also imports, plus `dioramaAccentHooks` (per-choice object mutation, e.g. `marys-room`). |
| `themes.ts` | 459 | Per-act base scene geometry (`corridorTheme`, `machineryTheme`, etc.) + the guide-figure rig + mood tinting + ambient door-flicker. LIMERENCE reuses these wholesale today (open item: a bespoke visual-language rework, see master plan Tier 1 item 3). |
| `doors.ts` | 254 | Door mesh creation, hover glow/pool lights (incl. light-spill sync with the flicker), creak sound trigger. |
| `post.ts` | 81 | Post-processing composer (bloom/grain/vignette), gated by `quality: 'high'`. |

## `src/audio/`

`soundEngine.ts` (724 lines — buses, generative chord/mote music, door
hover tones, compressor, visibility-based suspend/resume) + `voiceover.ts`
(115 lines — F2 dormant voice-file playback, gated on a manifest that's
empty until real audio files are supplied).

## `src/content/` — ANAMNESIS's own room/text data (shared engine defaults)

`rooms/{prologue,act1..4,understory}.ts` are ANAMNESIS's real room
content; `graph.ts` is the act-sequence/gate/door-pool graph engine
functions default to; `articles.ts` holds the 2 "Read more" long-form
pieces (`wallet`, `beggars-math`); `text/` holds **every** English v1/v2 +
cs/fa/de/fr string, one file per language×content-type (huge — don't
`Read` these wholesale, `Grep` for the specific key or room id you need).
Dynamic (RunState-conditional) beat translations live in
`text/{cs,de,fa,fr}-dynamic.ts` specifically, registered via individual
`register(key, 'v2', lang, (s) => ...)` calls — NOT inline in the
`*-rooms*.ts` object-literal files (two entries, `butterfly-dream`'s
memory-loss beat in cs/fa, deviated from this and went inline instead;
harmless since `registerAll`'s object-literal values can also be
functions, but it's the outlier, not the pattern to copy).

## `src/packs/` — the pack seam

`types.ts` defines `ContentPack` (graph, endingRules, guide, visuals,
audio identity, keepsakes, hooks, meta, `articles`). `packs/anamnesis/
index.ts` is thin (mostly re-exports `src/content/`'s defaults).
`packs/limerence/` is a full parallel content tree: its own `rooms/`,
`text/`, `dioramas.ts` (34/34 parity with ANAMNESIS), `articles.ts` (2
pieces: `the-read-receipt`, `the-best-friends-girl`), `endings.ts`/
`endingLogic.ts`, `guide.ts` (Porter voice/barks), `figure.ts` (Porter
rig), `icons.ts`, `theme.ts` (light/dark palettes).

## Game content — ANAMNESIS

Prologue room: `waiting-room`. Optional-per-act: Act I 3-of-8, Act II
3-of-9, Act III 2-of-9 (`OPTIONAL_PER_ACT`/`ACT_POOLS` in
`src/content/graph.ts`) — a player never sees every pool room in one run.

| Act | Pool rooms (id — title) | Gate (always visited) |
|---|---|---|
| I — The Shallows | `wallet` The Wallet · `dinner-table` The Dinner Table · `promotion` The Promotion · `beggars-math` The Beggar's Math · `quiet-alarm` The Quiet Alarm · `buridans-queue` The Buridan Annex · `the-reference` The Reference Letter | `photograph` The Photograph |
| II — The Machinery | `junction` The Junction · `experience-machine` The Experience Machine · `ship` The Ship · `casino-pascal` The Casino of Pascal · `omelas` The City of Omelas · `chinese-room` The Chinese Room · `newcomb-annex` The Newcomb Annex · `veil-of-ignorance` The Veil of Ignorance | `court-of-usher` The Court of the Usher |
| III — The Mirror | `teleporter` The Teleporter · `editor` The Editor · `introduction` The Introduction · `debt-of-dead` The Debt of the Dead · `marys-room` Mary's Room · `butterfly-dream` The Butterfly's Dream · `swampman` Swampman · `the-cave` The Cave (secret, `secret:` predicate-gated) | `free-will` The Free Will Waiting Room |
| IV — The Threshold | fixed sequence: `boulder` → `last-message` → `door-that-asks` (`ACT4_SEQUENCE`) | `door-that-asks` doubles as the final gate |
| V — The Understory (optional, second-run+) | `the-archive` → `the-unchosen` → `the-echo` (`UNDERSTORY_SEQUENCE`), offered instead of `boulder` only when `prior.runs >= 1` and not yet descended this run | — |

**Endings** (`src/content/endings.ts`, evaluated by `src/engine/
endings.ts`): `return` The Return · `open-hand` The Open Hand · `fortress`
The Fortress · `dissolved` The Dissolved (hearts ≤ 0) · `gardener` The
Gardener · `punchline` The Punchline (hidden, `hiddenUntilWitnessed`) ·
`anamnesis` Anamnesis (Understory-only, hidden).

**Keepsakes** (`src/content/keepsakes.ts`): `casino-chip`, `photo-corner`,
`ship-splinter`, `release-form`.

**Articles** ("Read more" long-form pieces, `src/content/articles.ts`):
`wallet` ("What 17,000 Lost Wallets Taught Us About Honesty"),
`beggars-math` ("The Child You Can See, and the Ones You Can't").

## Game content — LIMERENCE

Prologue room: `the-front-desk`. Optional-per-act: Act I 3-of-7, Act II
3-of-8, Act III 2-of-9 (`optionalPerAct`/`actPools` in
`src/packs/limerence/index.ts`).

| Act | Pool rooms (id — title) | Gate (always visited) |
|---|---|---|
| I | `the-read-receipt` The Read Receipt · `the-screenshot` The Screenshot · `the-password` The Password · `the-party` The Party · `the-forward` The Forward · `the-best-friends-girl` The Best Friend's Girl · `the-summer-ends` The Summer Ends | `the-rumor` The Rumor |
| II | `the-distance` The Distance · `the-hall-pass` The Hall Pass · `the-rebound` The Rebound · `the-unicorn` The Unicorn · `just-friends` Just Friends · `the-ex` The Ex · `the-confession` The Confession · `the-other-side-of-the-door` The Other Side of the Door | `the-scoreboard` The Scoreboard |
| III | `the-colleague` The Colleague · `the-metamour` The Metamour · `the-veto` The Veto · `the-drift` The Drift · `the-second-account` The Second Account · `the-discovery` The Discovery · `the-wedding-eve` The Wedding Eve · `the-therapist` The Therapist · `the-usual-suite` The Usual Suite (secret) | `the-usual-room` The Usual Room |
| IV | fixed sequence: `the-kitchen-table` → `the-unsent` → `the-morning-desk` (`act4Sequence`) | `the-morning-desk` doubles as the final gate |
| V — The Records Office (optional, second-run+) | `the-registry` → `the-doors-not-opened` → `the-other-side` (`understorySequence`), offered instead of `the-kitchen-table` only when `prior.runs >= 1` | — |

**Endings** (`src/packs/limerence/endings.ts`): `the-morning-after` The
Morning After · `the-giver` The Giver · `the-armored` The Armored ·
`the-ghost` The Ghost (hearts ≤ 0) · `the-porter` The Porter · `the-mirror`
The Mirror (hidden) · `the-pattern` The Pattern (Records-Office-only,
hidden).

**Keepsakes** (`src/packs/limerence/index.ts`): `the-cheap-ring`,
`the-unsent-letter`, `the-keycard`, `the-sim`.

**Articles**: `the-read-receipt` ("Why the Same Silence Means Different
Things to Different People"), `the-best-friends-girl` ("The Scientist Who
Named the Thing You're Feeling").

**Cross-room choice-aftermath echoes** (a mid-journey `choseIn()`-based
callback, distinct from the Act IV `door-that-asks`/`the-morning-desk`
whole-run recap): LIMERENCE has ~12 already (e.g. `the-ex` naming "that
Sara, the one you trapped" if `the-rumor`'s `set-the-trap` flag was set;
`the-scoreboard` recognizing a repeat `tested-almost`/`ran-the-test`).
ANAMNESIS has 2, added 2026-07-15: `wallet`→`photograph`,
`omelas`→`court-of-usher` (both via `choseIn()`, registered as dynamic
beats in the `*-dynamic.ts` files). If adding more, prefer targeting a
**gate room** (always visited) referencing an **earlier pool room's**
specific choice via `choseIn()` — pool→pool pairs can't guarantee the
earlier room was even visited this run.

## `src/test/` — vitest, `environment: 'node'` (no DOM/jsdom), 66 files, 952 tests

One file per concern, mostly pack-parameterized (`describe.each`-style
loops over `[anamnesisPack, limerencePack]`). Notable non-obvious ones:
- `staleThemePaint.test.ts` / `animationSettleLint.test.ts` /
  `dioramaFillLight.test.ts` — CSS/source-text regression guards for bugs
  that only manifest visually (opacity, paint) and are invisible to
  normal logic tests.
- `dynamicBeats.test.ts` — exercises every RunState-conditional beat
  (11 as of 2026-07-15) across all 4 non-English languages, asserting
  every branch resolves to distinct, non-English-fallback text. **The
  canonical place to add a test when you add a new `choseIn()`/`hasFlag()`
  dynamic beat** — follow its `withTranscript`/`withFlag` helper pattern.
- `translationKeyValidity.test.ts` — the *inverse* of coverage: catches
  registered-but-dangling/mistyped translation keys (a typo'd room id
  that `t()` will just silently never look up).
- `roomArticles.test.ts` — content-completeness + translation checks for
  the "Read more" articles feature.

Three.js `Scene`/`Group`/`Mesh` objects *are* constructible without a
browser (no canvas needed for the object graph), so `scene.test.ts`/
`dioramas.test.ts` test those directly — but anything needing an actual
`WebGLRenderer` (i.e. `SceneDirector` itself) cannot be unit-tested and
needs either a source-text lock (see above) or a live Playwright check.

## `tests/uat/` — live Playwright scripts, run via a real dev server (36 scripts)

Plain Node scripts (not vitest), one per concern, governed by
`tests/uat/README.md` (has the full script index — check there before
writing a new one, you may not need to). `_helpers.mjs` has the shared
`withPage`/`gotoUat`/`jump`/`patchProfile`/`continueJourney`/`advance`/
`clickChoiceMatching`/`assert` toolkit. `run-all.mjs` batch-runs the
whole suite into timestamped `results/` (committed, for diffing over
time). Every script must load with `?uat=1`.

**UAT gotchas discovered/re-confirmed 2026-07-15 (read before writing a
new script — these cost real debugging time each time they're
rediscovered):**
- **`jump(roomId)`'s reload behavior depends on whether a run is already
  in progress.** If called on a fresh title-screen page, it persists a
  new run and reloads — the reload's `sessionStorage` autocontinue flag
  lands you *directly in the room*, no `continueJourney()` needed. If
  called while already in-game (`this.inGame === true`), it reuses
  `this.state` (preserving the transcript!) and *also* auto-continues —
  still no `continueJourney()` needed. The only place `continueJourney()`
  is required is after a **plain `patchProfile()`** call (which does a
  bare `page.reload()` with no autocontinue flag) or a manual
  `page.reload()`. Calling `continueJourney()` right after a `jump()` will
  time out waiting for a title screen that never appears.
- **Jumping straight to a gate room shows that act's intro bark first**,
  not the gate's own opening beat — `photograph`/`court-of-usher`/etc.
  need a few `advanceUntil(...)`-style text-panel clicks (poll for the
  target pattern, don't assume beat index 0) before the room's actual
  content is on screen. UAT 09's `advanceUntil` helper is the reference
  pattern.
- **`patchProfile(page, mutator)`'s mutator is serialized via
  `.toString()` and `eval`'d inside the page** — it cannot close over any
  outer-scope variable. Bake values in as literals (e.g.
  `new Function('p', ...)` with the literal JSON spliced into the body),
  never `(p) => { p.run.x = someOuterVar }`.
- **`continueJourney()` matches the English button label.** If a script
  needs to test a non-English language AND needs `continueJourney()`
  along the way, do the language switch *after* the last
  `continueJourney()` call, not before — the button text won't match once
  the language has changed.
- **Language cycle order is `en → cs → fa → de → fr → en`** (`LANGS` in
  `src/engine/text/resolver.ts`) — 3 clicks from EN reaches DE, not 2.
- **`.lang-btn`/`.menu-btn` (HUD)** only exist in-game, not on the title
  screen — jump into any room before trying to click them.

## `docs/` — project documentation

`docs/development/` (numbered, chronological, append-only history):
`01`–`10` are feature-specific design specs from Milestone 5 (Understory,
Seventh Ending, keepsakes, Examined Path, Ledger/epiphanies, visual/audio
overhaul, platform/i18n/engine-health, testing/release, Experience
Charter — the last is **binding**, see master plan R7). `11`
production-review and `12` final-release-review are historical audit
snapshots (their findings have all been triaged into `13`). **`13-
master-development-plan.md` is the live, current plan — always check it
before assuming something is done or undone; it supersedes 11/12's open-
items lists.** `14` is this file. `docs/design-limerence/` holds
LIMERENCE's own historical design docs (banner-marked as historical, not
actively maintained). `docs/development/translation-backups/` holds
point-in-time translation snapshots (not auto-generated, don't assume
current).

## Build, deploy, and tooling

- **`package.json` scripts**: `dev`/`dev:limerence` (per-pack dev
  servers, `predev` runs `build:manifest` first), `build`/
  `build:anamnesis`/`build:limerence`/`build:web` (the `build:web` one
  runs `scripts/assemble-web-dist.mjs` to combine both pack builds +
  the rozcestník landing page into one `dist-web/`), `test`/`test:watch`
  (vitest), `electron`/`dist:win` (Electron dev run / Windows installer
  build via `predist:win`).
- **`scripts/build-voice-manifest.mjs`**: scans `public/voice/`,
  `public/music/` and writes `public/av-manifest.json` — drives F2/F3's
  "don't show the Settings row until real files exist" gating. Runs
  automatically before every dev/build via the `predev`/`prebuild` npm
  hooks.
- **`scripts/assemble-web-dist.mjs`**: builds the combined GitHub Pages
  deploy — both packs' Vite output plus the static `landing/` rozcestník
  page, copying `av-manifest.json` into the final tree too (this exact
  step was the source of a real bug in an earlier session: the landing
  page's music-toggle silently couldn't work because this copy step
  didn't exist yet).
- **`.github/workflows/`**: `deploy-pages.yml` (GitHub Pages, runs the
  full test suite before publishing), `release-windows.yml` (Electron
  Windows installer, also gated on tests passing).
- **`electron/main.cjs`**: `contextIsolation: true`, `nodeIntegration:
  false`, single-instance lock — the desktop wrapper. `location.href =
  '../index.html'` (the Vestibule exit button) works identically here and
  under GH Pages because both serve the same relative `dist-web/`
  layout.

## Fast-lookup cheatsheet (avoid re-discovering these)

- **"Where does room X's content live?"** — ANAMNESIS: `src/content/rooms/actN.ts` (grep the room id; see the Game content tables above for which act). LIMERENCE: `src/packs/limerence/rooms/actN.ts`.
- **"Where does string key X get translated?"** — `src/content/text/<lang>-*.ts` (ANAMNESIS) or `src/packs/limerence/text/<lang>-*.ts` (LIMERENCE); the *English fallback* is always the second arg to `t(key, fallback)` at the call site, not in a text file. Dynamic (conditional) beats specifically: `<lang>-dynamic.ts` — see the "Dynamic beat translations" note under `src/content/`.
- **"What's the current title-menu button order?"** — `src/ui/overlays.ts`'s `showTitle` function, `menu.append(...)` call — don't assume, it changes often.
- **"Does this need a live Playwright check or does a unit test suffice?"** — if it's pure logic/data, unit test. If it's real rendered CSS/opacity/paint/WebGL/z-index-stacking, a unit test *cannot* see it (no DOM/GL in vitest here) — needs either a source-text lock (cheap, see the three examples above) or a live UAT script (expensive, budget accordingly, ≤3 min per script per CLAUDE.md).
- **"How many rooms/endings does each pack have?"** — ANAMNESIS: 1 prologue + 23 pool + 3 gates + 3 fixed Act IV (`door-that-asks` doubles as the 4th gate) + 3 Understory = 33 real rooms, 7 endings. LIMERENCE: 1 prologue + 24 pool + 3 gates + 3 fixed Act IV (`the-morning-desk` doubles as the 4th gate) + 3 Records Office = 34 real rooms (one more than ANAMNESIS — its Act III pool has 9 rooms incl. the secret `the-usual-suite`, vs ANAMNESIS's 8), 7 endings. (Exact ids/titles: see the Game content tables above.)
- **"Is there already a cross-room choice echo involving room X?"** — `grep -rn "choseIn(s, 'X'" src/` (ANAMNESIS-style) or `grep -rn "flags.includes('" src/packs/limerence/rooms/` (LIMERENCE's preferred idiom for the same thing) before assuming you need to build one from scratch.
- **Version/plan doc:** `docs/development/13-master-development-plan.md` is the live, current plan — check it before assuming something is undone.
