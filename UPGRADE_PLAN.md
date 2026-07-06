# ANAMNESIS — Upgrade Plan & Development Roadmap

> **This is the living tracking file for all further development of ANAMNESIS.**
> Each work item has a checkbox. As features land, boxes get checked and remarks
> are added inline. New milestones append new phases at the bottom. Shipped
> milestones are condensed to short summaries to keep the file readable — full
> detail lives in git history — but **open items are never deleted**.

**Current milestone: 5 — THE DEEPER FACILITY (planned, see bottom of file).**
Milestone 4 is mostly shipped — Phases A–I implemented (see checkboxes below
for the handful of items amended or deferred); its remaining Playwright
verification debt is folded into Milestone 5's Phase S2. Previous milestones
(1–3, all shipped): core game + 20 rooms + 6 endings · generative audio,
icons, Electron/EXE releases · full CS/FA translations, v1/v2 text voices,
dynamic scenery, field-note markup.
Latest release: [`v0.1.5-v2-beta`](../../releases/tag/v0.1.5-v2-beta).

---

## Phase A — Display, Performance & Fullscreen — **shipped (v0.1.5-v2-beta)**

60 FPS frame limiter + render pause under overlays/`document.hidden`; render
resolution setting; UI zoom (80–130 %); fullscreen toggle + `F` hotkey; GPU
diet audit. Key files: `src/scene/director.ts`, `src/ui/fullscreen.ts`,
`src/ui/zoom.ts`, `src/engine/saveStore.ts`. (Electron window-state memory
moved to Milestone 5, spec 08.)

---

## Phase B — Saving, Reset & Data Safety — **shipped (v0.1.5-v2-beta)**

Mid-room resume fixed via `RunState.currentStage` (persist after every stage
choice); Save & Exit button; "✓ saved" autosave toast; Reset run / Reset all
progress with two-step confirm in Settings → Data. Key files:
`src/engine/flow.ts`, `src/content/schema.ts`, `src/ui/toast.ts`.

---

## Phase C — Layout: Settings & Field Notes on every screen
*(two-pager / side-by-side · bottom options not visible on smaller screens)*

- [x] **C1. Settings — bounded, sectioned, two-column.** Wrap `showSettings`
  content in a panel with `max-height: 84vh; overflow-y: auto` (reuse the
  `.codex-panel` pattern, `src/styles.css:282`). On viewports ≥900 px wide,
  a **two-column grid** grouped under headed sections: **Display**
  (fullscreen, resolution, UI zoom, quality, dynamic scenery, reduced motion)
  · **Audio** (music+volume, sfx+volume) · **Text & Language** (language,
  text version, typewriter, high-contrast) · **Data** (save & exit, reset run,
  reset progress). Done button in a sticky footer — always visible.
- [x] **C2. Field notes — side-by-side pages.** On wide screens render the
  note body in **two text columns** (`column-count: 2`) so long notes read
  like a book spread instead of a deep scroll; single column + internal
  scroll under 900 px. Continue button sticky at the card's bottom. Header
  (label + pictogram + title + thinkers) spans both columns.
- [x] **C3. Small-screen audit — partial.** Verified the Settings panel's
  sticky Done button and Data section at 1024×700 via Playwright. The full
  sweep (1366×768, 1280×720, 800×1280 portrait; field note/codex/pause/about
  as well as Settings) was not run — see Phase J.

**Tests:** C3 sweep · CSS regression tests in `styles.test.ts` (bounded
settings panel, field-note column rule).

---

## Phase D — i18n completion + the Czech codex bug — **shipped (v0.1.5-v2-beta)**

The reported Czech codex bug fixed (`translateFieldNoteForCodex` in
`src/ui/overlays.ts`); last hardcoded strings ("Continue", "click · space",
aria-labels) translated; the self-updating `uiKeyCoverage.test.ts` guard now
fails CI whenever a used `ui.*` key lacks a cs/fa entry — it caught four
pre-existing gaps on its first run.

---

## Phase E — Menus, Exit & Settings clarity
*(exit/quit button · explain every setting understandably · verify dynamic scenery works)*

- [x] **E1. Exit game button** on the title screen and pause menu. In Electron
  (detected via user agent): `window.close()` → `app.quit()`. In the browser
  the title button hides (tabs can't close themselves) and the pause-menu one
  reads "Save & quit to title".
- [x] **E2. Every setting explained.** Each row gets a one-line translated
  description under its label, written for a non-technical player:
  *Render resolution — "Lower = smoother on weak graphics cards, slightly
  softer image."* · *Dynamic scenery — "Rooms subtly tint the light to match
  their mood."* · *Typewriter text — "Text appears letter by letter, like
  being told a story."* · *High visual quality — "Glow and smoothing effects;
  needs a stronger graphics card."* — and so on for all rows.
- [ ] **E3. Prove dynamic scenery works — deferred.** The Playwright
  screenshot-delta automation kept timing out in this session's headless
  environment; per the user's call, further browser-automation debugging was
  stopped in favor of shipping on the (green) vitest suite. `mood.test.ts`
  already covers the underlying blend logic at the unit level, but the visual
  screenshot proof itself is still outstanding — pick this up first next
  session.
- [x] **E4. Pause menu tidy-up** — order: Resume · Save & Exit · Field Notes ·
  Settings · Who are you? · Before you begin · Exit game. Escape still
  resumes.

**Tests:** Playwright screenshot deltas (E3) · Electron quit-path smoke test.

---

## Phase F — The Usher: visibility & motion — **shipped (v0.1.5-v2-beta)**

The "flying" fixed: exponential lerps replaced with fixed-duration eased
walks (~2.5 s) + a slowed ~2 s camera dolly; silhouette scaled up with a
stagehand spotlight and idle head-turns. Key files: `src/scene/director.ts`,
`src/scene/themes.ts`.

---

## Phase G — Hearts: explanation & honest mechanics — **shipped (v0.1.5-v2-beta)**

Per-act heart cautions in every act intro; first-heart-loss one-time
explanation; About/tooltip copy corrected to the *actual* mechanics.
**Amendment kept for the record:** the drafted global "second refusal costs a
heart" rule was intentionally NOT built — the junction room already has a
bespoke refusal-escalation design a global rule would double-charge; text was
fixed instead, validated by `difficultyGuardRail.test.ts` (a sincere player
never reaches 0 hearts across 200 seeds).

---

## Phase H — Door visibility & framing verification
*(verify doors always visible, never garbled or off-screen · maybe unzoom a little)*

- [x] **H1. Aspect-aware framing** — compute the horizontal width needed for
  the outermost door (`(n−1)/2 × spacing + door half-width`, spacing 3.4 in
  `src/scene/doors.ts`) against the camera frustum (FOV 58, z = 7); when it
  doesn't fit, pull the camera back and/or compress spacing until every door
  plus tooltip fits with margin. Plus a small default unzoom (camera z 7 →
  ~7.6) per the user's instinct.
- [ ] **H2. Playthrough sweep — deferred**, same reason as E3: Playwright runs
  were unreliable in this session's headless environment and browser-automation
  debugging was intentionally stopped in favor of shipping. `doorFraming.test.ts`
  covers the projection math at the unit level; the live multi-viewport
  screenshot sweep is still outstanding.
- [ ] **H3. Transition garble check — deferred**, same reason as H2. Also
  found live (see below): opening the pause menu / codex while a beat/choice
  is on-screen let it visually bleed through the overlay and still respond to
  keyboard input — fixed (`.stage-bottom.overlay-hidden` + keydown guards in
  `textPanel.ts`/`choices.ts`), but the *scripted* transition-garble sweep
  itself wasn't run.

**Tests:** H2 is the test — projection assertions with archived screenshots.

---

## Phase I — Developer's own upgrades (creative freedom)
*Chosen strictly from the player's chair: rhythm, feedback, and reasons to replay.*

**Must (high impact, low risk):**
- [x] **I1. Replay fast-forward.** Rooms already completed in a previous run
  open with a "You remember this room" line, skip the typewriter (beats show
  instantly), and carry a subtle "remembered" panel style. Outcome-beat
  condensing was not implemented. (Tracks via existing `profile.codexUnlocked`.)
- [x] **I2. Unseen-door markers.** A small ✦ glint on door cards for rooms
  never visited across all runs — collectors instantly see where new content
  lives.
- [ ] **I3. End-of-act interlude** — not built this session; scoped out for
  time. Still worth doing.
- [x] **I4a. Endings-found counter** ("N of 6 endings witnessed") on the title
  screen. — **I4b/I4c not built:** version number display and fog parallax
  drift are still outstanding.
- [ ] **I5. Door hover feedback** — not built this session. Doors already had
  a pre-existing hover brighten/dim (`doors.ts` `BASE_INTENSITY`/
  `HOVER_INTENSITY`, from an earlier milestone); the *new* emissive-pulse +
  pre-walk brighten described here wasn't added.

**Superseded by Milestone 5** (each item now lives, expanded, in a Milestone 5
phase — tracked there, not here): I5 door-hover feedback → **Q4** · I6
traveler's ledger → **Phase P** · I7 light spill → **Q2** · I8 audio easing →
**Q5** · I11 epitaph wall → **Q3** · I12 secret room → **K4 (the-cave)**.
I10 "Daily door" was dropped entirely — the owner rejected separate replay
modes in the Milestone 5 review.

**Still open, unscheduled (not part of Milestone 5 — keep in mind for M6):**
- [ ] **I3. End-of-act interlude** — one quiet screen between acts: act name,
  a one-line Usher observation on the run's dominant axis, hearts/lucidity.
- [ ] **I9. Colorblind & readability audit** — gold-on-dark contrast ≥ WCAG AA
  at all UI zoom levels; heart state not conveyed by color alone.

---

## Phase J — Verification & release (every milestone ends here)

- [x] `npx tsc --noEmit` + full `vitest` suite green — 125 → 183 tests, zero
  failures.
- [x] Partial Playwright pass: title/persona/onboarding flow, a full prologue
  playthrough into the first door, Czech language switch, pause menu → codex
  → field note (confirmed real Czech text, not the English fallback), and a
  save-at-door-selection + mid-room quit/reload cycle. This is how the
  `.stage-bottom.overlay-hidden` bleed-through bug (see H3) was actually
  found and fixed.
- [ ] Full Playwright matrix — **deferred**: EN/CS/FA playthrough at 3
  viewports, the C3 layout sweep, H2 door-visibility sweep, E3
  dynamic-scenery proof, and a troll test all still need a Playwright run.
  Browser-automation runs in this session's headless environment were slow
  and one repair attempt didn't fully fix it, so — per the user's explicit
  call — this was stopped short rather than iterated on further. Pick this up
  first next session; consider giving each a longer per-script timeout budget
  and/or investigating why beat-advance clicks are slow to land headless.
- [ ] Manual feel-pass on the Usher walk and camera dolly — not done (no
  visual/interactive access to confirm "feel" beyond the automated checks
  above).
- [x] Update this file's checkboxes, commit, push, trigger
  `release-windows.yml` → `v0.1.5-v2-beta` EXE.

---
---

# Milestone 5 — THE DEEPER FACILITY (target: v0.2.0-beta)

> Planned 2026-07-05, shaped by 12 preference questions answered by the user.
> Phases continue Milestone 4's lettering (A–J used there): **K–S**.
> **Detailed developer specifications for each phase live in
> [`docs/development/`](docs/development/README.md)** — implement from those,
> track progress here.

**The user's decisions that shaped this milestone:**
content = new rooms AND a new act · the Usher stays enigmatic (no backstory,
no new characters) · a deeply hidden 7th ending, independent of the Usher ·
persona hints expanded only "a little" · keepsakes as a gentle bonus layer
that never alters core mechanics · no separate replay modes (everything
integrates organically) · an opt-in reflective mode that presents morality
*objectively* (plural views, never one "correct" answer) · Ledger + quiet
Epiphanies · GitHub Pages web release · no mobile investment · perfect
EN/CS/FA (Czech quality pass) with German+French at lowest priority · full
visual overhaul (dioramas + light-spill + title polish).

**Codebase facts this plan builds on (verified 2026-07-05):**
21 rooms; act pools 5/5/4 + fixed 3-room Act IV; a run = 15 rooms. The
`{name}` token plumbing exists but no content string uses it; the persona
blurb is collected and never used. Five flags are set but never read
(`pushed`, `kept-bridge`, `entered-machine`, `sharp-gambler`,
`erased-memory`) — ready-made hooks. Audio is generative WebAudio with no
reverb bus yet. Electron has no icon/fullscreenable/window-state memory.
Continuity nit: the Punchline ending says "twenty rooms"; a run is 15.

---

## Phase K — New rooms: widen every act's pool (~9 rooms, 21 → ~30)

Two runs currently share most of their rooms; this is the direct attack on
replay sameness.

- [ ] **K1. Act I (+2):** `buridans-queue` — two identical doors that mock
  indecision (Buridan's Ass as everyday paralysis; the room reacts to how
  long you hover) · `the-reference` — write an honest or a kind reference
  for a mediocre friend (loyalty vs truth; distinct from wallet/promotion).
- [ ] **K2. Act II (+3):** `chinese-room` — a booth answers perfectly in your
  language; does it understand? (Searle) · `newcomb-annex` — the predictor's
  two boxes, next door to Pascal's casino · `veil-of-ignorance` — design a
  small society, then wake in it as its least member (Rawls).
- [ ] **K3. Act III (+3):** `marys-room` — the color scientist; the first red
  in a monochrome wing (qualia; huge diorama potential) · `butterfly-dream`
  — Zhuangzi's dream-within-dream, branches on `memoryLost` ·
  `swampman` — an exact copy walks out of the marsh wearing your coat
  (Davidson; pairs with the teleporter from a different angle).
- [ ] **K4. New secret room:** `the-cave` (Plato), act II or III — unlocked
  only when `runsCompleted >= 1`; you watch shadow-plays of *your own
  previous run's transcript* on the wall. The data already lives in the
  profile; meta, cheap, unforgettable.
- [ ] **K5.** Every room ships complete in one commit: doorHint / teaser /
  beats / choices+hints / outcomes / field note+thinkers / icon / mood +
  **EN+CS+FA together** (the coverage tests enforce this automatically).
- [ ] **K6.** Update `graph.ts` pools (+`OPTIONAL_PER_ACT` if needed) and the
  graph tests' room-count invariants.

**Tests:** graph invariants (every run still finishes; pool sizes) · i18n
coverage auto-extends · new-room schema validation.

---

## Phase L — Act V: "The Understory" (organic descent, not a mode)

After the Act III gate, **on runs where `runsCompleted >= 1`**, one extra
staircase door appears beside the Act IV corridor entrance — optional,
clearly stranger, never forced. Taking it descends into rooms that
*remember*; afterwards you rejoin Act IV (run length 15 → ~18).

- [ ] **L1.** `the-archive` — your previous run's transcript staged as a
  museum exhibit; confronts one specific past choice. Echo one persona blurb
  here (the "just a little" persona use).
- [ ] **L2.** `the-unchosen` — the doors you never opened, waiting, slightly
  resentful; one of them is offered now, out of context.
- [ ] **L3.** `the-echo` — a conversation with the traveler you were last
  run; their lines are built from your old choices.
- [ ] **L4.** The Usher's existing second-run bark seeds the hint; persist an
  `understoryDone` marker for the Ledger/Epiphanies.

**Tests:** descent offered only when eligible · run always completes with or
without descending · transcript-echo logic unit-tested.

---

## Phase M — The Seventh Ending: "Anamnesis" (deeply hidden)

The title made literal — not returning, not staying: *waking while
remembering everything*.

- [ ] **M1. Conditions** (cross-run, Usher-independent, all silent):
  (a) codex complete for the base rooms across any number of runs ·
  (b) at least 2 keepsake-unlocked hidden choices taken (Phase N) ·
  (c) in `door-that-asks`, a fifth option — "Remember everything" — appears
  only when (a)+(b) hold and lucidity ≥ a threshold.
- [ ] **M2. Hints:** exactly three field notes gain one italic marginal line
  (e.g. the prologue's Anamnesis note: *"the ones who remember all of it do
  not use the door at all"*). No UI counter changes until found; after first
  witnessing, the endings count shows 7.
- [ ] **M3.** Full ending content: beats, epitaph, field note, icon,
  EN+CS+FA; wired into `endings.ts` evaluation ahead of the axis-profile
  endings.
- [ ] **M4.** Reuse dead flags where thematically apt — e.g. `erased-memory`
  blocks condition (c) for that run: you cannot remember everything in a run
  where you chose to erase.

**Tests:** reachability simulation (a scripted profile CAN reach it; a fresh
profile CANNOT) · evaluation-priority unit tests.

---

## Phase N — Keepsakes: a whisper-quiet bonus layer

Hard constraint: **zero impact on hearts/lucidity/axes; no inventory
management**. Auto-collected, invisible until they matter.

- [ ] **N1.** 4 keepsakes, each auto-earned by an existing choice (several
  via the currently-dead flags): the casino's chip (`sharp-gambler`) · the
  unburnt photo corner (`saved-photo`) · a splinter of the ship · the
  machine's release form (`entered-machine`).
- [ ] **N2.** Each unlocks exactly one extra choice or beat variant in one
  thematically linked room (chip → `newcomb-annex` "bet against the
  predictor" · photo corner → `the-archive` · splinter → `swampman` · form
  → `butterfly-dream`), marked subtly with a small ✧ before the choice text.
- [ ] **N3.** The codex gains a one-row "Shelf" strip: found keepsakes as
  icons with a one-line origin.
- [ ] **N4.** Persist `profile.keepsakes: string[]` (spread-migration safe).
  Feeds 7th-ending condition (b).

**Tests:** unlock logic pure-function tests · a guard test proving keepsake
presence never changes hearts/lucidity/axes.

---

## Phase O — The Examined Path (opt-in reflective mode)

Difficulty as *confronting counterarguments* — never punishment, never a
single truth.

- [ ] **O1.** Opt-in panel when starting a new run (default OFF; also a
  Settings row usable between runs, never mid-run). Plain-language
  explanation before enabling: what it adds, that nothing is graded, that no
  view is "correct". In-fiction frame: the facility's *Examination Annex*
  stamps your file.
- [ ] **O2.** When ON: after each significant choice, a collapsible
  **Reflection** card shows 3–4 one-line readings of that choice from named
  traditions (consequentialist / deontological / virtue / care) — always
  plural, never a verdict, skippable with one click. Content lives in an
  optional `reflections` field on `Choice` (`schema.ts`), authored for all
  rooms.
- [ ] **O3.** Once per act, the Usher asks one Socratic follow-up ("Would you
  have chosen the same if no one could ever know?") — rhetorical; a single
  "sit with it" acknowledgement, no scoring.
- [ ] **O4.** Mode OFF = provably zero behavior change (guard test). All
  reflection text ships EN+CS+FA.

**Tests:** disabled-mode no-op guard · reflections schema/length validation ·
i18n coverage auto-extends.

---

## Phase P — Traveler's Ledger & Epiphanies

- [ ] **P1. Ledger** screen (title + pause menus): runs completed, rooms
  witnessed X/~30, endings Y (shown "of 6" until Anamnesis is found, then
  "of 7"), hearts lost lifetime, most-walked door, keepsakes found,
  Understory descents, Examined Path runs. Computed from existing profile +
  transcript; tiny new counters are spread-migration safe.
- [ ] **P2. Epiphanies:** ~12 quiet one-line milestones in the game's hushed
  voice ("You refused the machine twice." · "You kept every heart, once.").
  No mid-game popups — they appear inside the Ledger, plus one soft line on
  the end screen when newly earned. EN+CS+FA.

**Tests:** epiphany trigger unit tests · ledger computation pure-function
tests.

---

## Phase Q — Full visual & audio overhaul

- [ ] **Q1. Room dioramas:** while inside a room, a distinct silhouette
  vignette occupies the scene — junction rails + lever, the machine's
  cradle, ship mast + rigging, casino neon, omelas lanterns over one small
  door, teleporter twin pads, the boulder's slope... Implementation: a
  `dioramaFor(roomId)` factory in `src/scene/` (cheap silhouette geometry +
  1–2 colored lights, the `usherFigure()` technique); disposed on room exit;
  respects quality/renderScale/reducedMotion; rooms without a bespoke
  diorama fall back to the act theme.
- [ ] **Q2. Doorway light-spill** (deferred I7): the chosen door leaks the
  next act's colored light during walkThrough.
- [ ] **Q3. Title polish** (deferred I4b/c + I11): version number from
  `package.json`, fog parallax drift, and — after 2+ endings — collected
  epitaphs faintly carved into the title fog.
- [ ] **Q4. Door hover pulse** (deferred I5): emissive pulse on hover; the
  chosen door brightens before the walk begins.
- [ ] **Q5. Audio deepening** (deferred I8+): a generated-impulse convolver
  reverb bus (none exists today) · reverb tail on heart-loss · hover chime
  pitch per door index · ~4s act-transition chord crossfades · subtle
  per-diorama ambient accents (rail hum, casino shimmer).
- [ ] **Q6. Usher lantern:** a small lamp the Usher raises when you hover a
  door — its light leans toward the chosen one.

**Tests:** diorama registry completeness (every room id → diorama or
fallback) · disposal leak test via the `renderer.info` pattern · audio bus
unit tests.

---

## Phase R — Platform, language & engine health

- [ ] **R1. GitHub Pages deploy:** new workflow — on release (and manual
  dispatch) build + deploy `dist/` to Pages (`base: './'` is already
  compatible); README gets the play-in-browser link.
- [ ] **R2. Electron polish:** app icon · `fullscreenable: true` · remember
  window bounds between sessions · single-instance lock.
- [ ] **R3. Czech quality pass:** review `cs.ts` for naturalness — room
  titles/hints/teasers, settings descriptions, about text; prefer idiomatic
  reframing over literal translation.
- [ ] **R4. German + French packs** — full `registerAll('v2','de'|'fr',...)`
  packs + `nextLang` cycle + font check. **Explicitly lowest priority; may
  slip to Milestone 6.**
- [ ] **R5. Content pipeline:** schema-validation tests for the new fields
  (`reflections`, keepsakes) · fix the "twenty rooms" continuity nit in the
  Punchline ending (say "every room" instead of a number).
- [ ] **R6. Dead-flag audit:** `pushed`, `kept-bridge`, `entered-machine`,
  `sharp-gambler`, `erased-memory` all become read (via Phases L/M/N) or are
  consciously removed.
- [ ] **R7. Persona whisper pass** ("just a little"): 3–4 total uses of the
  existing-but-unused `{name}` token (one act-intro variant, one Usher bark
  variant, one ending epitaph line) + one blurb echo inside `the-archive`.
  Nothing on the door screens.

**Tests:** Pages workflow dry-run · translation coverage for any new
language · a flag-audit test (every set flag is read somewhere).

---

## Phase S — Testing, UAT & release (per CLAUDE.md rules)

- [ ] **S1. `?uat=1` test mode:** URL param that disables the typewriter and
  shortens tweens, making Playwright scripts fast and deterministic (the
  root cause of M4's UAT timeouts was fighting the typewriter). Build this
  EARLY; document in CLAUDE.md.
- [ ] **S2. Clear M4's deferred verification debt first**, under the new
  rules (scripts < 3 min, split by concern, one repair attempt max): E3
  dynamic-scenery screenshot proof · H2 multi-viewport door sweep · H3
  transition garble check · full C3 layout sweep · troll test.
- [ ] **S3.** Unit/simulation tests for every new M5 capability (listed per
  phase); suite grows from 183 to an expected ~240+.
- [ ] **S4.** Full regression (`tsc` + vitest) + UAT scripts + manual
  feel-pass notes.
- [ ] **S5.** Update this file's checkboxes honestly · release
  **v0.2.0-beta** EXE via `release-windows.yml` (tag_name input) · first
  GitHub Pages deploy.

---

## Milestone 5 implementation order (multi-session)

**K (rooms) → N (keepsakes; hooks into K's rooms) → M (7th ending; needs N)
→ L (Understory) → O (Examined Path) → P (Ledger/Epiphanies) → Q
(visual/audio overhaul) → R1–R3, R5–R7 (platform + Czech pass) → R4 (DE/FR,
last) → S (verification + release).**

Rationale: content first (replay variety is the stated fear), then the
mechanics that thread through it, then presentation, then platform — with
S1's `?uat=1` built early enough to test everything that follows it.
