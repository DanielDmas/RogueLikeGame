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
> **The authoritative, exhaustive developer specifications live in
> [`docs/development/`](docs/development/README.md)** — one document per
> phase, plus the binding Experience Charter (`10-experience-charter.md`).
> Implement from the specs; track progress with the checkboxes here.

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

## Phase K — New rooms (spec `01-new-rooms.md`)

- [x] K1. Act I +2: `buridans-queue`, `the-reference` — full content, EN+CS+FA,
      icons, pool-wired. **Uncovered and fixed a real engine bug along the
      way**: `doorsForAct`'s door-offer hash was salted only by `visited`
      history, which is identical for every fresh run's first offer in an
      act — growing a pool could leave a member (here, `dinner-table`)
      structurally unreachable for every player, not just unlucky test
      seeds. Fixed by adding `RunState.doorSeed` (a per-run random salt,
      migration-safe) folded into the hash; added a generic reachability
      regression test (`newRooms.test.ts`) covering all three acts' pools so
      this class of bug is caught immediately as K2/K3 grow them further.
- [x] K2. Act II +3: `chinese-room` (Searle/Turing), `newcomb-annex`
      (Newcomb/Nozick — the predictor is explicitly "the facility," never the
      Usher), `veil-of-ignorance` (Rawls/Harsanyi) — full content, EN+CS+FA,
      icons, pool-wired. Same false-positive translation-coverage pattern as
      K1 recurred (three thinkers fields were pure Western proper nouns with
      no translatable component, so the correct CS/FA rendering was
      byte-identical to English); fixed the same way, by enriching the EN
      source with a translatable descriptor phrase to match the game-wide
      convention, then translating it.
- [ ] K3. Act III +3: `marys-room`, `butterfly-dream`, `swampman`
- [ ] K4. Secret room `the-cave` (Plato; replays your previous run as shadows;
      returning travelers only)
- [x] K5. Rooms shipped so far are complete (beats/choices/notes/icons/moods)
      in EN+CS+FA, same commit — coverage tests auto-extended and pass.
- [x] K6. Pool wiring + graph-test invariants updated for rooms shipped so far
      (25 numbered rooms + prologue after Act I+II growth); the reachability
      regression test from K1 already covered Act II's grown pool with no
      changes needed.

## Phase L — Act V: The Understory (spec `02-act-five-the-understory.md`)

- [ ] L1. `the-archive` (your previous run, exhibited)
- [ ] L2. `the-unchosen` (the doors you never opened)
- [ ] L3. `the-echo` (a conversation with who you were last run)
- [ ] L4. Optional staircase fork at the Act IV threshold, returning-players
      only, once per run; rejoins Act IV; prior-run snapshot infrastructure;
      quoted memories re-translated at display time

## Phase M — The Seventh Ending: "Anamnesis" (spec `03-the-seventh-ending.md`)

- [ ] M1. Unlock predicate: codex complete + ≥2 keepsake choices + lucidity
      threshold + not-erased-this-run
- [ ] M2. Exactly three field-note margin hints; endings count shows 7 only
      after it is witnessed
- [ ] M3. Full ending content (beats/epitaph/note/icon), evaluation wired
- [ ] M4. Dead flags reused where thematic (`erased-memory` blocks it)

## Phase N — Keepsakes (spec `04-keepsakes.md`)

- [ ] N1. Four keepsakes auto-earned via existing choice flags
- [ ] N2. Each unlocks exactly one ✧-marked bonus choice in one linked room
- [ ] N3. Codex "Shelf" strip (earned + dim placeholders)
- [ ] N4. Persistence + the hard no-op guarantee test (base game bit-identical
      without them)

## Phase O — The Examined Path (spec `05-the-examined-path.md`)

- [ ] O1. Opt-in panel at new-run start, full explanation, equal-weight
      buttons; Settings edits the default only
- [ ] O2. Reflection cards: 4 named traditions, one line each, shuffled,
      never a verdict, one click to dismiss
- [ ] O3. One Socratic Usher question per act (rhetorical, unscored)
- [ ] O4. Provable zero behavior change when off; EN+CS+FA authored coverage

## Phase P — Traveler's Ledger & Epiphanies (spec `06-ledger-and-epiphanies.md`)

- [ ] P1. Ledger screen (title + pause): runs, rooms, endings, hearts lost,
      most-walked door, keepsakes, descents, examined runs
- [ ] P2. Twelve quiet epiphanies — Ledger + one soft end-screen line only

## Phase Q — Visual & audio overhaul (spec `07-visual-and-audio-overhaul.md`)

- [ ] Q1. Room dioramas (`dioramaFor` factory; silhouettes + light; disposal
      leak-tested; act-theme fallback)
- [ ] Q2. Doorway light-spill during the walk-through
- [ ] Q3. Title polish: version number, fog parallax, epitaph wall (2+ endings)
- [ ] Q4. Door hover emissive pulse + pre-walk brighten
- [ ] Q5. Audio deepening: convolver reverb bus, heart-loss tail, per-door
      hover pitch, ~4 s act crossfades, three room accents
- [ ] Q6. The Usher's lantern (leans toward the hovered/chosen door)

## Phase R — Platform, language & engine health (spec `08-platform-localization-engine-health.md`)

- [ ] R1. GitHub Pages deploy workflow + play-in-browser link + favicon/tab title
- [ ] R2. Electron polish: icon, window-state memory, single-instance lock
- [ ] R3. Czech quality pass (idiomatic reframing; terminology settled)
- [ ] R4. German + French packs — **lowest priority; may slip to M6**
- [ ] R5. Content-pipeline validation tests + "twenty rooms" continuity fix
- [ ] R6. Dead-flag audit: every set flag gains a reader (CI-enforced)
- [ ] R7. Persona whisper pass: exactly four `{name}`/blurb touches, never on
      door screens

## Phase S — Testing, UAT & release (spec `09-testing-and-release.md`)

- [x] S1. `?uat=1` test mode (typewriter off, fast tweens, gated debug handle
      incl. `jump`/`doorRects`/`fps`) — **built first**. `src/engine/uatMode.ts`
      + wiring in `main.ts`/`flow.ts`/`director.ts`/`doors.ts`/`toast.ts`;
      `__APP_VERSION__` vite define added (also serves Q3.1 later). Verified
      live: handle absent on normal boot, present + correctly shaped under
      `?uat=1`, `jump('junction')` reloads straight into Act II at the right
      stage with zero console/page errors.
- [ ] S2. Milestone 4's deferred verification debt cleared: layout sweep,
      scenery proof, door-visibility sweep, transition-garble check, troll
      test, i18n matrix — all as committed `scripts/uat/` scripts under the
      3-minute rule
- [ ] S3. Feature→test traceability matrix green (~240+ tests expected)
- [ ] S4. Full regression + owner feel-pass (charter checklist)
- [ ] S5. Release v0.2.0-beta EXE + first Pages deploy; checkboxes updated

## Implementation order

**S1 first**, then **K → N → M → L → O → P → Q → R (except R4) → S → R4
(DE/FR last)** — content first, the mechanics that thread through it, then
presentation, then platform. All of it under the Experience Charter
(`docs/development/10-experience-charter.md`).
