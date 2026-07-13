# The Vestibule — Final-Release Review, Standardization & Development Plan

## Context

The owner asked for a diligent pre-release review of the whole package (both games, engine, docs, packaging), plans to make the games more *entertaining* (not only philosophically demanding), and concrete designs for nine requested features. **No code in this pass** — this document is the deliverable; implementation starts only on explicit approval. Everything below was verified directly against the code (all file:line references checked this session). The previous plan in this file (choice-completeness audit) was fully implemented and released; this replaces it.

Current verified state: 757/757 tests green, tsc clean, all 4 languages complete for BOTH packs (including the 5 choice-audit additions), LICENSE + THIRD_PARTY_NOTICES + credits + age advisory shipped, v0.2.4-beta.

---

## Part 1 — Code & architecture review findings

### 1.1 CRITICAL — heart-death crashes LIMERENCE (release blocker)

`src/engine/flow.ts:502`: `if (this.state.hearts <= 0) return this.playEnding('dissolved');` — **hardcodes ANAMNESIS's ending id**. LIMERENCE has no `dissolved` ending, so `getEnding()` (flow.ts:727-730) throws `Unknown ending: dissolved` the moment a LIMERENCE run reaches 0 hearts. LIMERENCE has 20 `hearts: -1` choices plus the lucidity-drain heart loss (`gameState.ts:78-82`), so any normal player who spends three hearts hits this crash. LIMERENCE's own evaluator maps hearts≤0 correctly (`packs/limerence/index.ts:149` → `the-ghost`) but is only consulted when doors run out (flow.ts:515), which the hearts check short-circuits.

**Fix:** replace the literal with `this.playEnding(this.pack.endingRules.evaluate(this.state))` — both packs' evaluators check `hearts <= 0` first (engine/endings.ts:58; limerence/index.ts:149). One line.

**Test to add:** pack-parameterized runtime test — a run at 1 heart in each pack, apply a heart-costing choice, assert ANAMNESIS plays `dissolved` and LIMERENCE plays `the-ghost`, no throw. This is exactly the cross-pack-leak class the L1.4 parameterization was built to catch, and the one place it wasn't applied.

### 1.2 Audio chirps/skips — diagnosed root causes (`src/audio/soundEngine.ts`)

The engine is well-structured (independent buses, shared convolver, pure/testable helpers). The glitches trace to four specific mechanics:

1. **Background-tab burst.** Chord/mote/creak scheduling uses `setTimeout` (lines 301-317, 517-522). Hidden tabs clamp timers while the AudioContext keeps running; on return, queued callbacks fire back-to-back → stacked motes = the "chirp." **Fix:** on `visibilitychange` hidden → `clearTimers()` + `ctx.suspend()`; visible → `ctx.resume()` + reschedule. Also saves battery.
2. **Crossfade truncation click.** `crossfadeToChord` (lines 338-345) stops old oscillators at `t+5` while the old gain decays via `setTargetAtTime(0, t, 1.4)` — at t+5 the level is still ~3%, and `osc.stop()` cuts it discontinuously → a click on act changes and on every 20-40s chord cycle. **Fix:** `linearRampToValueAtTime(0.0001, t+5)` before stop (or stop at t+8).
3. **Summing/clipping headroom.** A mote landing mid-crossfade (6 oscillators + noise pad + mote) can push the 0.55 master toward clipping — audible crackle on modest DACs. **Fix:** one `DynamicsCompressorNode` on the master bus (2-3 lines) removes the whole class.
4. **Main-thread contention** delays `osc.start(t)` past its intended `t` during GC/render stalls. Mostly masked by ramps; the two fixes above make the remainder inaudible. No AudioWorklet re-architecture needed at this scope.

### 1.3 GPU load — why 70% of a 780M, and the fix (`src/scene/`)

Verified pipeline: rAF capped at 60fps (`shouldRenderFrame`, director.ts:48-50) → full `EffectComposer` with **UnrealBloomPass + film-grain/vignette ShaderPass** whenever `quality: 'high'` (post.ts:62-68) — and **`quality: 'high'` is the first-boot default** (`saveStore.ts:117`), pixelRatio up to 1.5× ('standard'). UnrealBloom is ~6 fullscreen passes; at high resolution on an iGPU that *is* the 70%. Particle counts (260-500/theme) are not the problem; bloom + resolution + always-60fps is. The loop already fully pauses under DOM overlays and hidden tabs (director.ts:509).

**Plan — "safe default, opt into cinematic":**
1. **New-profile defaults become the floor tier:** `quality: 'low'` (plain `renderer.render`, no composer, no AA), `renderScale: 'performance'` (0.75× DPR). Existing saved profiles keep their values; only `defaultSettings()` changes.
2. **FPS cap setting** `fpsCap: 30 | 60` (default 30 for new profiles). `shouldRenderFrame` already takes `targetFps` — thread it through `SceneDirector` + one settings row. Halves GPU time; visually fine for a fog-and-text game.
3. **One-time first-run visuals card:** "Calm — recommended, runs everywhere" vs. "Cinematic — bloom, 60fps, stronger GPU", writing the two presets. Honest and simple; no GPU auto-detection heuristics to maintain.
4. **Idle downshift:** while a text panel is up and no tween/diorama accent is active, render at 30fps even in Cinematic.
5. Thread `quality` into the few theme/diorama builders that ignore it (mechanical; most already halve particles on low).

### 1.4 Architecture verdict

The pack abstraction (`packs/types.ts`) is genuinely clean — content, visuals, audio identity, ending rules, and text all thread through `ContentPack`; the test suite is pack-parameterized; saves are versioned with backup-restore; the id-based text keying survived 4 languages × 2 packs intact. Non-blocking debts: `flow.ts` (~900 lines) owns too many concerns — split only if a third pack lands; `styles.css` is one 700-line file — acceptable; the `'dissolved'` literal (1.1) was the only true cross-pack leak found this pass.

---

## Part 2 — Docs standardization (verified stale-claims inventory)

Going forward: README = player-facing truth, CHANGELOG = history, UPGRADE_PLAN = append-only dev log; `docs/design-limerence/` and `docs/development/` get a one-line "historical design docs" banner in their READMEs rather than rewriting history.

| Where | Stale claim | Reality |
|---|---|---|
| README (LIMERENCE) | "Status: content-complete beta" | Complete: all rooms, 7 endings, keepsakes, epiphanies, 4 languages |
| README | "still-open gap: LIMERENCE's Ledger shows generic epiphany lines" | Closed — `limerence/index.ts:266` wires its own 12 |
| README | "Fully localized … ANAMNESIS only; LIMERENCE is English-only so far (Czech is L6)" | Both packs en/cs/fa/de/fr, coverage-tested (32 LIMERENCE checks) |
| UPGRADE_PLAN | "L6. Czech translation (in progress)" | Done for cs/fa/de/fr — mark complete with date |
| package.json | `"name": "anamnesis"`, `0.2.4-beta` | Rename `vestibule`; bump to `1.0.0-rc.1` at the release commit + CHANGELOG entry |
| CLAUDE.md | cs/fa literal-translation re-review TODO | Still genuinely open — keep (honest backlog), schedule as its own pass |

Also: commit this review into the repo as `docs/development/12-final-release-review.md`.

---

## Part 3 — Owner-requested features (concrete designs)

### F1. "Exit to The Vestibule" from both games' menus
- New `TitleAction` `'vestibule'` (`ui/overlays.ts:30`) + button ("The Vestibule — choose a game") after Credits in the title menu, and in the pause menu under "Save & exit to title" (pause path first returns to title flow, then navigates).
- Handler: `location.href = '../index.html'` — correct in GH Pages (`/anamnesis/` → root rozcestník) *and* the Electron build (same dist-web layout; in-window navigation already supported). Hidden in `import.meta.env.DEV` (no rozcestník on the dev server).
- One `uiKey('vestibuleButton')` string × 5 languages × both packs' UI text files.

### F2. Voice narration — step 1 (architecture only; owner has no files yet)
Text keys already uniquely, filesystem-safely address every beat (`room.the-read-receipt.stage0.beat2`, `ending.the-ghost.beat0`, …) — they are the naming scheme.
- **Folder convention:** `public/voice/<packId>/<lang>/<key>.mp3` (also .ogg/.wav). Owner drops files in; nothing else to configure.
- **Build step:** `scripts/build-voice-manifest.mjs` scans the folder → `voice-manifest.json` (keys that have audio); wired into the `build:*` scripts and dev server.
- **Engine:** new `src/audio/voiceover.ts`: `init(manifest, packId, lang)`, `has(key)`, `play(key)`, `stop()`; one `HTMLAudioElement` routed via `MediaElementAudioSourceNode` into a new `voiceGain` bus in SoundEngine. `TextPanel.showBeat` plays the beat's key if available; advancing stops it.
- **Settings:** "Narration" toggle + volume slider, rendered only when the manifest is non-empty — the feature is invisible until files exist.
- Out of scope for step 1: recording, TTS, timing sync.

### F3. File-based music — same manifest pattern
- **Folders:** `public/music/<packId>/<slot>.mp3`, slots `title`, `act0`…`act5`; plus `landing/vestibule.mp3` for the rozcestník (plain `<audio loop>` behind a click-to-start, per autoplay policy).
- **Engine:** SoundEngine gains a streaming layer: if the manifest has the current slot's track, `setAct()`/title-entry crossfades an `HTMLAudioElement`(loop) through `musicGain` and mutes the generative bed; otherwise generative music plays exactly as today — it stays the permanent fallback, so partial folders (e.g. only a title track) work. Files in `public/` live in the repo — no special GitHub mechanism needed.

### F4. Back/reread inside a room (`ui/textPanel.ts`)
- `playBeats` keeps its rendered `texts[]`; replace the forward-only loop with an index cursor. Affordances: a `‹` back arrow beside the beat dots, `ArrowLeft`/`Backspace`, clickable beat dots; stepping back re-displays instantly (no typewriter), forward through seen beats is instant.
- **On the choice screen:** a small "⟲ reread the scene" button above the choices — replays the stage beats read-only, then returns to the same choices. Safe: state doesn't change mid-stage, so RunState-function beats resolve identically.
- Outcome beats get the same in-sequence back navigation. No cross-stage/cross-choice rewind — decisions stay permanent (roguelike honesty).
- Update UAT scripts 12/13 if they pin advance-only behavior.

### F5. LIMERENCE diorama completion (rooms missing their artifact)
Today 6 bespoke of 34 (`the-read-receipt`, `just-friends`, `the-therapist`, `the-kitchen-table`, `the-second-account`, `the-colleague`); ANAMNESIS benchmark ~22.
- **Tier 1 — 12 new bespoke dioramas** from the existing parametric vocabulary: the-front-desk (counter + bell + departures board), the-password (phone + two padlocks), the-party (bottle + ring of phone-lights), the-forward (grid of glowing rectangles, one red), the-rumor (one huge unanswered message bubble), the-distance (two phones face-up on one bed — the creative bible's signature image), the-ex (phone glowing 23:51 in the dark), the-confession (arrivals board + one suitcase), the-discovery (face-down phone under a cone of kitchen light), the-wedding-eve (dress form + chair), the-unsent (writing desk + brass letter scale), the-morning-desk (open ledger on the counter, dawn light).
- **Tier 2 — accent hooks:** extend `dioramaAccentHooks` (the `marys-room` pattern) to ~6 LIMERENCE rooms where the chosen door visibly changes the object.
- Remaining rooms keep their floor theme — acceptable once every act reads distinctly.

### F6. Hearts-fail verification (LIMERENCE)
Covered by 1.1's fix + the pack-parameterized ending test, plus a content assertion pinning that each pack keeps ≥N reachable heart-costing choices per run (LIMERENCE verified today: 20 across Acts I-IV, plus lucidity-drain).

---

## Part 4 — Making the games more entertaining & captivating

Ranked; none dilutes the games' seriousness. Recommend T1-T4 before release, T5-T7 after.

- **T1. Voice + music files (F2/F3).** The single biggest atmosphere multiplier; a narrator turns reading into being told a story at 3 a.m.
- **T2. The Hotel Register / Facility Map** — a collection screen drawing each act as a floor of doors: visited lit, unvisited dark showing only their teaser, secrets as outlines once found. Turns replay into completing a *place*. Data already exists (`codexUnlocked`, `visited`, graph).
- **T3. Epiphany toasts.** Epiphanies currently surface only in the Ledger; also show the line as a quiet toast the moment it's earned ("You have never once asked before accusing."). Zero new content, large felt-reactivity gain.
- **T4. End-of-run "Morning Report."** One composed screen after the ending: the run's 3-4 pivotal choices quoted back (transcript exists), the axes triptych, hearts kept/spent, doors never opened as named teasers. The screenshotable artifact + replay hook in one.
- **T5. Porter/Usher pattern-barks** keyed on cross-run patterns the profile already tracks (third run that never opens an Act II door; always verify-first) — the guide visibly *knows you*.
- **T6. Choice aftermath flashes.** A few hand-authored beats per act that reference an earlier room's choice two rooms later (the rumor reaching you) — consequence made felt, not tracked.
- **T7. Ambient corridor life.** Rare one-shot scene events (a far door closing, a phone lighting in the distance, the Porter passing) on 60-120s jittered timers; disabled under reduced-motion.
- **T8. Guest stamps.** Diegetic, spoiler-free milestones rendered as rubber stamps in the Ledger ("Walked every floor", "Never set a trap", "Checked out with all three hearts") — achievement pull without an achievement system's tone; purely reads existing profile counters.
- **T9. "One door" session mode.** A title-menu option that deals a single random unvisited room as a 3-minute vignette (no run state carried, no ending) — a daily-ritual-shaped way in for players intimidated by a 25-minute run, and it advertises rooms they haven't met.

---

## Part 5 — Release order & verification *(superseded by Part 7 after the second-pass deep review below — Part 7 folds in the new blockers)*

1. **Fix 1.1** (hearts crash) + pack-parameterized test — first, before anything.
2. Audio fixes (1.2): visibility suspend, ramp-before-stop, master compressor.
3. Performance defaults + FPS cap + first-run visuals card (1.3).
4. F1 Vestibule button · F4 back/reread · F6 hearts content assertion.
5. F2/F3 voice + music architecture (dormant until files arrive).
6. F5 dioramas Tier 1 (may trail the RC; Tier 2 after).
7. Part 2 docs standardization + `docs/development/12-final-release-review.md` + version `1.0.0-rc.1` + CHANGELOG.
8. Entertainment T2-T4; T5-T7 post-RC.
9. Explicitly deferred, tracked: CLAUDE.md's cs/fa literal-translation re-review pass; ANAMNESIS light theme (deliberately none — single authored tone); commercial-store items beyond what's shipped (rating certification, code signing).

**Verification for the implementation pass:**
- Unit: heart-death test (both packs, correct ending, no throw); fpsCap pure-function tests; manifest loader tests; TextPanel cursor tests.
- UAT (each ≤3 min, `?uat=1`, per CLAUDE.md): LIMERENCE heart-death via `jump()` + heart-costing choices → the-ghost plays; back/reread flow; Vestibule button lands on the rozcestník; first-boot low default renders without the composer (probe `fps()`).
- Manual: act-change listen test for clicks; tab-hide/return burst test; GPU load spot-check on the new default (expect a large drop vs. today's high+bloom default).

---

# SECOND PASS — Deep code review (full-file reads of the engine core)

Files read end-to-end this pass: `engine/flow.ts` (843 lines), `engine/gameState.ts`, `engine/storyEngine.ts`, `engine/localSave.ts`, `engine/text/resolver.ts`, `ui/textPanel.ts`, `ui/choices.ts`, `audio/soundEngine.ts`, `scene/director.ts`, `scene/post.ts`, `scene/doors.ts` (dispose paths), `electron/main.cjs`, both GitHub workflows; plus targeted reads of `saveStore.ts`, `packs/limerence/index.ts` hooks/graph, and the test suite's coverage of each finding.

## Part 6 — Additional findings

### 6.1 CRITICAL — LIMERENCE's Understory (Records Office) is unreachable in normal play

`src/engine/storyEngine.ts:74`: the understory fork eligibility is
`next === 'boulder' && (prior.runs ≥ 1) && !understory visited` — **`'boulder'` is a hardcoded ANAMNESIS room id inside the shared engine**. LIMERENCE's `act4Sequence` starts with `the-kitchen-table` (`packs/limerence/index.ts:141`), so the condition is never true and the fork door (`the-registry`) is **never offered**. All three Records Office rooms — fully authored, tested at content level, and translated into 4 languages — are dead content outside a UAT `jump()`. Confirmed no test drives `offeredDoors` with LIMERENCE's graph at act 4 (`limerenceAct4.test.ts` checks room *content* only; `graph.test.ts` uses the ANAMNESIS default graph).

**Fix:** `next === graph.act4Sequence[0]` (pure, one token). **Test:** pack-parameterized `offeredDoors` test — a second-run state entering act 4 with nothing visited must offer `[understorySequence[0], act4Sequence[0]]` in *both* packs. Same family as finding 1.1; these two are the complete set — every other engine reference to ANAMNESIS content ids was audited this pass (see 6.5) and is a documented default-parameter pattern, not a live bug.

### 6.2 MEDIUM — one failed save permanently poisons the persist chain

`flow.ts:99/284`: every save chains as `persistChain = persistChain.then(() => store.save(...))`. `LocalSaveStore.save` (`localSave.ts:51-53`) calls `localStorage.setItem`, which **throws `QuotaExceededError`** when storage is full (private-browsing modes, tiny quotas). One rejection makes `persistChain` a rejected promise forever: every later `persist()`'s `.then(...)` callback is skipped (no further saves are even attempted), and each `await this.persistChain` re-throws — breaking the pause menu, settings save, and end-of-run persistence with an unhandled rejection cascade.

**Fix:** chain as `.then(save).catch(err => { report once via toast; })` so the chain always settles fulfilled, plus a try/catch inside `LocalSaveStore.save` that surfaces a "save failed — storage full" toast rather than throwing. **Test:** unit test with a store whose `save` rejects once — subsequent `persist()` calls must still reach the store.

### 6.3 LOW — GPU memory leak on act changes (materials never disposed)

`director.ts:337-341` (`setTheme`) disposes traversed geometries but **not materials**; every act transition leaks the previous theme's `MeshStandardMaterial`/`PointsMaterial` GPU programs/uniforms. `doors.ts:180-187` and `dioramas.ts` dispose both — `setTheme` is the odd one out. Slow leak (~5 act changes/run), invisible in a session, but sloppy for an Electron app left open. **Fix:** mirror doors.ts's dispose block (geometry + material) in `setTheme`; also dispose `PointsMaterial` textures if any appear later.

### 6.4 LOW — minor correctness/UX nits (each a one-liner, none blocking)

1. `flow.ts:379-382` `'exit'` → `window.close()` is a silent no-op in a normal browser tab (only works in Electron / script-opened windows). Verify the Exit button is Electron-gated (overlays.ts:106 shows it inside a conditional — confirm the condition is an Electron check, not something weaker).
2. `flow.ts:659` strips only *curly* quotes from the saved last-message text (`/^“|”$/`). ANAMNESIS choice texts use curly quotes (fine); LIMERENCE's `the-unsent` hook (`hooks.lastMessageId`, limerence/index.ts:303) has plain unquoted choice texts, so the regex is a harmless no-op there today — but any future quoted LIMERENCE choice text using straight quotes won't be stripped. Make the regex quote-agnostic (`/^[“"']|[”"']$/g`) when touched.
3. `textPanel.ts` `waitAdvance`/`ChoicePanel.mount` add window-level `keydown` listeners that are only removed on resolve. Every current exit path resolves or reloads, so no live leak — but F4's back/reread rework must keep that invariant (remove listeners on every new navigation path it adds).
4. `hud.ts` heart tooltips/aria (`heartsTooltip`) resolve `t()` once in the constructor — a mid-session language switch leaves stale-language tooltips until reload. Cosmetic; fix opportunistically in F1's menu pass by re-resolving on `setLanguage`.

### 6.5 Audited and CLEAN (explicitly verified, no action)

- **Engine→content default-parameter couplings** (`gameState.ts:2`, `storyEngine.ts:23-31`, `ledger.ts:8`, `ui/choices.ts:5`, `engine/endings.ts:3`): all take the pack's data as an explicit parameter at every live call site and use ANAMNESIS only as the documented default for legacy tests. The `'boulder'` literal (6.1) was the single violation.
- **Persist ordering** (`persistChain` design), mid-room resume (`currentStage` persistence at flow.ts:677 before outcome beats — no double-apply on quit/resume), keepsake earn-once semantics, first-heart-loss one-time bark, remembered-room fast-read path: all correct as documented in-line.
- **`resolver.ts` fallback ladder** (v2→same-language v1→English-v1, never silently v1-for-v2 in English): correct, and `registeredKeys` exists solely for the tests, as claimed.
- **`localSave.ts` backup semantics** (good payload becomes the restore point on every load; restore flag drives the one-time toast): correct.
- **Electron `main.cjs`:** `contextIsolation: true`, `nodeIntegration: false`, single-instance lock, off-screen window-state guard — good security posture; `loadFile(dist-web/index.html)` confirms F1's `../index.html` navigation works under `file://` too.
- **Workflows:** Pages deploy and Windows release both run `npm ci` + full test suite before packaging; release uploads the exe as an artifact even when not publishing. Sound.
- **Escape/overlay guards:** all three input layers (TextPanel, ChoicePanel, ReflectionPanel) consistently check `.overlay, .field-note` before consuming keys — no key-through bugs found.

## Part 7 — Updated release order (supersedes Part 5's list; 9.x folded in)

1. **Blockers first:** fix 1.1 (hearts→`evaluate`) **and 6.1** (understory fork→`act4Sequence[0]`) + their pack-parameterized tests. These two make LIMERENCE actually finishable/complete as designed.
1b. **9.1** (Ledger endingsTotal + keepsake count via pack) and **9.2** (`translateFieldNoteForCodex` ← `pack.hooks.lastMessageId`) + pack-parameterized ledger/codex tests — same cross-pack family, same PR as step 1.
2. 6.2 persist-chain resilience (+ failing-store test) and 6.3 material disposal; 6.4 + 9.5 nits opportunistically alongside.
3. Audio fixes (1.2). 4. Performance defaults + fps cap + first-run card (1.3).
5. F1 Vestibule button · F4 back/reread · F6 hearts content assertion.
6. F2/F3 voice + music architecture. 7. F5 dioramas Tier 1 (may trail RC).
8. Part 2 docs standardization + commit review as `docs/development/12-final-release-review.md` + `1.0.0-rc.1` + CHANGELOG.
9. Entertainment T2-T4 pre-RC if time allows; T5-T7 post-RC.
10. Full regression + UAT sweep (now including: understory-fork-offered test for LIMERENCE via a 2nd-run profile; heart-death ending in both packs).

# FOURTH PASS — Player-perspective sweep (content/pack layer + played sequences)

Read this pass: `packs/limerence/index.ts` (full — graph, endingRules, skin, advisory, keepsakes), `packs/limerence/guide.ts` (full), LIMERENCE endings/icons id coverage, act3's secret-room predicate, ANAMNESIS's `engine/endings.ts` evaluator + `content/graph.ts` pool sizes, and traced the exact sequences a player walks (first run onboarding → acts → gates → final door → each of the 5 scripted ending choices; second-run secret/understory paths; light-mode toggle mid-screen; language switch mid-run).

## Part 11 — Player-perspective findings

### P1. HIGH (player-visible everywhere in LIMERENCE) — the Porter never gets his voice styling inside rooms

`packs/types.ts:73` defines `guide.speakerPrefixes` and both packs set it (`limerence/index.ts:181` — `['Porter:', 'THE ROOM:']`), but **nothing consumes it**: `ui/textPanel.ts:8-18` styles spoken lines using only its own hardcoded `SPEAKER_PREFIXES` list, which contains `Usher:`/`The Room:`/`The Door:` variants — **not `Porter:`**. Result: every in-room Porter line (beats like "Porter: Every guest on this floor is certain the silence is about them.", outcome lines, first-heart-loss, act asides) renders as plain narration instead of the guide's gold-italic voice. Door-row barks escape only because `showBark` (textPanel.ts:181) hardcodes the styling class. ANAMNESIS is unaffected — which makes the two games *feel* inconsistently produced to anyone who plays both.
**Fix:** thread the active pack's `guide.speakerPrefixes` into `TextPanel` (constructor arg or setter from `flow.ts`), use it in `resolveBeat` (keep the decide-from-English-raw rule). Delete the dead pack field OR make it the single source. **Test:** pack-parameterized — a `Porter:` beat resolves `isSpoken=true` under LIMERENCE, `false` under ANAMNESIS's list.

### P2. HIGH (escalates blocker 1.1 to a scripted path, plus a tonal break)

LIMERENCE's quiet ending choice `stop-carrying-it` (`rooms/act4.ts:371`) carries `hearts: -3` — unlike ANAMNESIS's exact counterpart `lie-down` (`content/rooms/act4.ts:348`, **no** hearts effect). Two consequences:
1. It drives hearts to 0, so **the authored quiet-ending path itself hits crash 1.1** (`playEnding('dissolved')` → `Unknown ending`) — a player deliberately choosing the game's gentlest ending gets the recovery screen. Not just attrition — a guaranteed scripted repro.
2. Even after 1.1 is fixed: `flow.ts:663-673` plays the *first-heart-loss tutorial bark* ("There — a measure of Trust, spent… You have {hearts} left") **before** the choice's outcome beats — so a careful player whose first-ever heart loss is this triple loss hears a mechanics explainer stamped over the Porter's "No guest dissolves alone on my shift."
**Fix (content, one line):** remove `hearts: -3` from `stop-carrying-it` — the `choseIn(s,'the-morning-desk','stop-carrying-it') → 'the-ghost'` mapping (limerence/index.ts:150) is already authoritative, exactly how ANAMNESIS's `lie-down → dissolved` works. (Keeps the Ledger's lifetime hearts stat honest too — a chosen ending isn't three "lost hearts".)

### P3. MEDIUM (observed once — needs a scripted repro) — door cards stayed dark after toggling Light mode mid-screen

In this session's UAT screenshots, toggling LIMERENCE's Light mode while a door row was mounted left the two door cards dark while the adjacent bark panel went cream (shots 6b/7); the same screen freshly rendered later showed correct light cards (shots 9/10). CSS variables should cascade live, so the suspect is stale paint with `backdrop-filter` + the `rise` animation's `forwards` fill on `.choice-card`. **Action:** add a UAT step — toggle theme with cards mounted, assert card background luminance — and fix whatever it reveals (likely forcing a reflow or keying the cards' background off a class rather than a frozen composite).

### P4-P6. LOW / content & docs nits

- **P4:** LIMERENCE's act-4 intro says "Three doors remain on this floor, and then the desk" — the sequence is 3 rooms *including* the desk, and once 6.1 (understory fork) is fixed a descending player walks up to 6 rooms on this floor. Reword when 6.1 lands (all 5 languages).
- **P5:** LIMERENCE's Ledger "Your last message" row stores the-unsent's *choice label* ("Send the blank page.") via `hooks.lastMessageId` — reads as an address label, not a message. Either relabel the row per-pack (skin string, e.g. "The envelope you chose") or store a per-choice display line.
- **P6:** `limerence/index.ts:306-311` `registerText` comment still says "(currently: the Czech prologue + Act I)" — all four languages are complete; stale comment.

### P7. Player-paths verified CLEAN this pass (no action)

- All five final-gate ending mappings (`stop-carrying-it`/`i-know-every-room`/`laughing-door`/`take-the-desk` + axes fallthrough) present and ordered correctly in both packs' evaluators; `walk-out` falling to the axes triptych is deliberate and mirrored.
- All 7 LIMERENCE endings have ids, epitaphs, field notes, and ending icons (`icons.ts` covers all seven, including `the-pattern`).
- Keepsake loop: 4 triggers ↔ 4 earn flags ↔ 4 spend choices, gated by `keepsakesHeld` (profile-stamped at run start) — `the-registry`'s keycard bonus choice availability verified both ways.
- Graph consistency: LIMERENCE pools 7/8/9(with secret), gates per act, `optionalPerAct {3,3,2}` → run length matches README's claims; ANAMNESIS `OPTIONAL_PER_ACT {3,3,2}` → "15 of 30+3" checks out.
- Second-run gating: `the-usual-suite` secret (`prior.runs >= 1`, act3.ts:894) and the understory fork's `prior.runs >= 1` (post-6.1) are consistent — a first-run player is never shown either, as designed.
- Door-bark priority ladder (understory-hint > single-door > first-choice explainer > second-run > axis lines > generic pool), `{name}` token flow through `showBark`, one-heart and high-clarity barks, per-act intros with Trust-cost warnings that match rooms that actually cost hearts in those acts.
- Onboarding order (auto-About once → persona → Examined Path offer → prologue), advisory badge on title (`.title-age-advisory` styled), Trust/Clarity HUD skin wording, RTL/Farsi font application, hidden-ending codex suppression (`hiddenUntilWitnessed`).

*Part 7's step 1b now also carries P1 + P2 (same first PR as the blockers); P3's repro joins the UAT sweep in step 10; P4-P6 fold into the docs/content pass (step 8).*

# THIRD PASS — Final in-depth review (every remaining file read end-to-end)

Read this pass: `ui/overlays.ts` (all 994 lines), `engine/ledger.ts`, `engine/saveStore.ts` (hydrate/migrate/grandfather), `engine/schema.ts`, `engine/endings.ts`, `engine/reflections.ts`, `engine/text/keys.ts`, `scene/themes.ts` (corridor/machinery/mirror builders), `scene/doors.ts`, `ui/fieldNote.ts`, `ui/dom.ts`, `ui/recovery.ts`, `ui/fullscreen.ts`, `ui/locale.ts`, `ui/toast.ts`, `ui/zoom.ts`, `vite.config.ts`, plus a full XSS/injection audit of every `innerHTML` site and every user-input path.

## Part 9 — Third-pass findings

### 9.1 MEDIUM — LIMERENCE's Ledger uses ANAMNESIS's endings denominator ("7 of 6" possible)

`engine/ledger.ts:10` imports `endingsTotal` from `engine/endings.ts` (ANAMNESIS's module — returns 7 only if `endingsSeen.includes('anamnesis')`) and `ledgerStats` (ledger.ts:84) uses it directly. LIMERENCE's hidden ending id is `the-pattern` (`limerence/index.ts:164`), which this never matches — so LIMERENCE's Ledger always shows "N **of 6**", and after witnessing the-pattern shows "**7 of 6**". The title screen does this correctly via `pack.endingRules.endingsTotal` (overlays.ts:115); the Ledger is the only bypass. Same fix family: `ledgerStats`/`showLedger` must accept the pack's `endingsTotal` (thread from flow.ts's two `showLedger` call sites). Fold in the adjacent nit: ledger.ts:103 hardcodes keepsakes "of **4**" — pass `pack.keepsakes.length`.

### 9.2 MEDIUM — LIMERENCE's "your last message" codex note is clobbered in non-English locales

`overlays.ts:727-741` `translateFieldNoteForCodex` early-returns the synthetic player-sentence note only for the hardcoded id `'last-message'` (ANAMNESIS's hook room). LIMERENCE's hook room is `the-unsent` (`hooks.lastMessageId`, limerence/index.ts:303), which **also has a real field note with registered cs/fa/de/fr translations** — so in any non-English locale, opening the-unsent's codex card resolves `roomNoteTitleKey('the-unsent')` etc. and silently replaces the synthetic "sender: you / your own sentence" note with the room's ordinary translated field note. English is unaffected (v2/en is never registered). **Fix:** pass `pack.hooks.lastMessageId` into `translateFieldNoteForCodex` (or compare against it in `showCodex`) instead of the literal. **Test:** pack-parameterized codex test under `setLocale('cs')`.

### 9.3 Security & injection audit — PASS (one hardening nit)

- `el()` (`ui/dom.ts`) uses `textContent` — every user-controlled string (persona name/blurb, imported profile fields, `{name}` tokens into beats) renders through it or through `applyTokens`→`textContent`. **No XSS path found.**
- `renderEmphasis` (`fieldNote.ts:8-11`) HTML-escapes before adding `<strong>` — safe for field-note/explanation bodies.
- All other `innerHTML` sites (how-to, About, credits, end-screen stats, icons, heart SVG, recovery panel) inject only authored/translated catalog strings, never user input. *Hardening nit:* `director.ts:473` builds the door tooltip with `innerHTML` from hint/teaser strings — authored-only today, but a translated string containing `<` would break rendering; escape when touched.
- Profile import: `JSON.parse` + spread-merge over defaults (`hydrateProfile`) — malformed JSON safely rejected; imported strings render via `textContent`. Prototype-pollution risk from `...parsed` is bounded (own enumerable props onto a fresh object literal, never into prototypes) — acceptable.
- Electron: `contextIsolation: true`, `nodeIntegration: false`, no `remote`, no custom protocol handlers — solid.

### 9.4 Audited and CLEAN this pass (no action)

- `saveStore.ts` hydrate/migrate/grandfather logic (legacy `sound` toggle split, `hasSeenAbout` grandfathering, always-restamped schema version) — correct and unit-testable as claimed.
- `showPauseMenu`/`showSettings`/`showPersona`/`showCodex` overlay flows: every listener added is removed on every resolve path (`fullscreenListeners` on Done; pause's Escape handler on both button and key paths); `confirmButton`'s 4s arm/disarm is sound.
- Codex hidden-endings rule (`hiddenUntilWitnessed` → not rendered at all, not shown-locked) and understory codex-hiding both correctly pack-parameterized (the previously-fixed leaks #66-67 hold).
- `shouldOpenPauseOnEscape` fullscreen-Escape policy; recovery handlers (error/unhandledrejection/webglcontextlost, once); RTL/locale application; UI zoom; toast lifecycle; `doors.ts` (materials disposed; shared `FRAME_MAT` double-dispose is harmless); theme builders' object counts (largest: machinery at ~500 particles + 5 gears — trivial geometry, confirming bloom not scene complexity as the GPU cost).
- `vite.config.ts` — `base: './'` (relative, correct for subfolder deploys), `__APP_VERSION__`/`__PACK__` defines, es2022 target. Sound.

### 9.5 Suggested polish (reviewer's own, beyond owner requests — optional, post-blockers)

1. **Focus containment in overlays:** Tab can walk focus out of an open overlay into the hidden game UI beneath (no focus trap / `inert` on background). Add `inert` to `#ui`'s siblings-behind-overlay or a small focus-trap util — the single biggest remaining a11y gap.
2. **Escape should close Settings/Codex/Ledger/About** (they currently close only via their Done/Back buttons; Escape is inconsistent with the pause menu, which does handle it).
3. **Arrow-key navigation on door/choice cards** (1-9 and click exist; ↑/↓ + Enter would complete keyboard play).
4. **Honor `prefers-color-scheme: light`** as LIMERENCE's initial theme default on first boot (it already honors `prefers-reduced-motion` — same pattern, one line in `defaultSettings()`).
5. **HUD tooltips re-resolve on language switch** (6.4.4) — fold into any menu pass.
6. **`showEndScreen` stats row** builds via `innerHTML` with numeric interpolations — fine, but converting to `el()` spans would make the file uniformly injection-free by construction.

## Part 10 — Owner's requests & desires — consolidated ledger (nothing forgotten)

Standing rules (from CLAUDE.md + session instructions, all already honored and to keep honoring):
R1. Every translated string, including UI chrome, gets the context-aware treatment; cs/fa literal-translation re-review remains a scheduled dedicated pass (do not do opportunistically).
R2. UAT scripts: ≤3 min wall-clock each, `?uat=1` always, keyboard-advance not click-loops, ask before re-running on a switch-model prompt; **at most two attempts per UAT approach, then do it differently or skip** (owner, this session).
R3. Translation/background agents: keep dispatches small (per-act), multiple runs rather than one long one; file writes survive agent death — check disk before redoing work.
R4. Never leak one pack's guide-word vocabulary into the other (Uvaděč/Vrátný, نگهبان/دربان, Platzanweiser/Portier, Le Placeur/Le Portier) — includes header comments.

Product decisions made this session (implemented):
D1. LIMERENCE light mode = readable-layer light over an intentionally dark 3D hotel; HUD gets pale shadow-backed chrome + scrim (shipped; the deeper "brighter scene" rework remains optional post-1.0, per UPGRADE_PLAN's deferral).
D2. Choice-card hover uses per-theme `--panel-hover`, never a hardcoded dark (shipped).
D3. Explain "?" button: 34px, bold, upright (not italic — owner: glyph must sit centered, not skewed right), pulsing, high-contrast (shipped).
D4. Annex files card sized like the field note — full width/padding/16.5px type (shipped).
D5. Landing page LIMERENCE card: "Complete · 4 languages · 7 endings · mature themes (16+)" (shipped).

Feature requests (planned in Part 3, unbuilt — the owner's nine, plus review outcomes):
F1 Vestibule exit button from both games' menus · F2 narrator/voice-file architecture (folder-drop, beat-key naming, step 1 only) · F3 mp3/wav music slots (vestibule menu, per-pack title, per-act) with generative fallback · F4 in-room back/reread navigation incl. at the choice screen · F5 LIMERENCE per-room artifacts/dioramas (12 Tier-1 + accent hooks) · F6 hearts-fail verification (now blockers 1.1/6.1 + tests) · GPU: "stale low-GPU default" chosen — low tier + 30fps default, Cinematic opt-in via one-time card (1.3) · audio chirp/skip engine fixes (1.2) · docs/plans standardized + this review committed as `docs/development/12-final-release-review.md` (Part 2).
Entertainment mandate ("not just philosophically demanding; sky is the limit"): T1-T9 in Part 4, T2-T4 recommended pre-RC.

## Part 8 — "Review all we set up to do" (task-ledger audit)

All 99 tracked tasks verified complete against the code this pass. The only standing, deliberately-open items across every plan document: (a) CLAUDE.md's cs/fa literal-translation quality re-review (its own future pass, unchanged); (b) UPGRADE_PLAN's two "plan, don't build" deferrals — LIMERENCE visual-language rework and per-choice visual cues — which Parts 3-4 of this plan now absorb (F5 covers the second; the first remains optional post-1.0 polish, given light mode was fixed this session); (c) commercial-store certification items (PEGI/signing) if a paid release is ever pursued. Nothing else from any prior plan, spec, or task list is unimplemented or unaccounted for.
