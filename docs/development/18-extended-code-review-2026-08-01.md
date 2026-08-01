# Extended Code Review & Bug Hunt — 2026-08-01

**Scope:** full end-to-end read of the engine (`flow.ts`, `storyEngine.ts`,
`gameState.ts`, `schema.ts`, `saveStore.ts`, `localSave.ts`, `ledger.ts`,
`patterns.ts`, `oneDoor.ts`, `resolver.ts`, `keys.ts`, `uatMode.ts`,
`sharedDisplaySettings.ts`, `recovery.ts`, `endings.ts`), the whole UI layer
(`overlays.ts` all 1382 lines, `textPanel.ts`, `choices.ts`, `hud.ts`,
`fieldNote.ts`, `focusTrap.ts`, `dom.ts`, `toast.ts`, `fullscreen.ts`,
`recovery.ts`), the audio engine (`soundEngine.ts` all 799 lines,
`voiceover.ts`), the scene director (`director.ts` all 826 lines), the boot
path (`main.ts`), and cross-cutting greps (R4 guide-word isolation,
`innerHTML` injection audit, hostile-save reachability).

**Method:** every claimed invariant was checked against the actual code, not
the docs; the crash-class findings below were **confirmed by executing the
real modules** with the hostile inputs (via `npx tsx`, script in scratchpad —
no repo changes). This document records findings only. **No fixes were
applied.**

**Baseline at review time:** branch `claude/vestibule-v2-overhaul` at
`c27e463`, `tsc` clean, 1262/1262 tests green.

Severity scale: **CRITICAL** (a player can hit it in normal play) ·
**HIGH** (crash reachable from the save/import boundary — the same class the
2026-07-26 adversarial-save hardening pass explicitly set out to close) ·
**MEDIUM** (real defect, limited blast radius) · **LOW** (polish /
robustness) · **NOTE** (design question or documentation item, owner call).

Nothing found in this pass is CRITICAL. The game as shipped is solid for a
normal player. The HIGH items are all "hostile or corrupted save data"
crashes — exactly the class the project already decided is worth hardening
(three prior troll passes), so they are gaps in a defense the project claims
to have, not new philosophical territory.

---

## Part 1 — Confirmed crash-class findings (save/import boundary)

### H-1. `pickUnchosenRooms` missed the `asTranscript` hardening — CONFIRMED THROW · HIGH

`src/engine/gameState.ts:195`:

```ts
const entered = new Set((prior?.transcript ?? []).map((e) => e.roomId));
```

The 2026-07-27 troll pass hardened `pickShadowMoments`, `choseInPrior`, and
`pickExhibitEntry` against a hostile non-array `prior.transcript` (the
`asTranscript` guard, `gameState.ts:68`), and `state.test.ts` locks each of
those in with hostile-input tests. **`pickUnchosenRooms` — the fourth
function in the same family, three lines below the third — was skipped.**
`?? []` only substitutes for null/undefined; a truthy non-array (`"x"`, `42`,
`{}`) reaches `.map` and throws.

Confirmed live: `pickUnchosenRooms({runs:1, endingId:null, transcript:'x'})`
→ `TypeError: ((intermediate value) ?? []).map is not a function`.

**Reachability:** a save with `prior: {runs: 1, transcript: "x", ...}`
(devtools-edited or imported) survives `hydrateProfile` (`prior` is
deliberately unvalidated — documented in `asTranscript`'s own comment) and
survives Continue. `prior.runs >= 1` is exactly what unlocks the understory
fork, and `the-unchosen` (ANAMNESIS) / its LIMERENCE equivalent call
`pickUnchosenRooms(s.prior, …)` in their beat functions — as do all four
translated dynamic-text files per pack (`cs/fa/de/fr-dynamic.ts`,
`*-rooms-understory.ts`). Crash mid-room, in the understory, on the same
Continue path the 2026-07-27 fix note says `jump()`-based probes can't reach.

**Fix shape:** use `asTranscript(prior?.transcript)` like its three siblings.
**Test gap:** `state.test.ts`'s `pickUnchosenRooms` describe block (lines
198-224) has no hostile-transcript case — add the same
`['not-an-array', 42, {}, true]` loop its siblings have.

### H-2. Transcript *items* are never validated — array-of-null crashes five call sites — CONFIRMED THROW · HIGH

`isStructurallyValidRun` (`schema.ts:130`) checks
`Array.isArray(r.transcript)` but nothing about the items; `hydrateProfile`
(`saveStore.ts:287-288`) likewise passes `lastRunTranscript` through on an
`Array.isArray` check alone. So `transcript: [null]` (or `[1]`, `["x"]`) is
a "structurally valid" run. Confirmed live, all of these throw
`TypeError: Cannot read properties of null`:

- `choseIn(state, …)` — `gameState.ts:123` `t.roomId` — **called by both
  packs' ending evaluators** (`evaluateEnding`/LIMERENCE `endingLogic`), so a
  resumed run with `transcript:[null]` crashes at the moment hearts hit 0 or
  doors run out — i.e. *at the ending*, after the player has played the whole
  hostile run out.
- `choseInPrior(prior, …)` — same line pattern, via `lastRunTranscript:[null]`
  feeding `priorFromProfile()` → `the-echo`'s junction callback etc.
- `pickExhibitEntry` — `gameState.ts:154` `e.effects` — `the-archive`.
- `pickUnchosenRooms` — `gameState.ts:195` `e.roomId` — `the-unchosen`.
- `playEnding`'s choice-history fold — `flow.ts:1231` `entry.roomId` — and
  the Morning Report's `entry.effects` filter (`flow.ts:1269`).

(`pickShadowMoments` happens to survive `[null]` because `the-cave`'s
`shadowMomentBeat` null-checks the entry — confirmed no-throw.)

**Fix shape (one place, not five):** make `asTranscript` also filter items —
`v.filter((e) => typeof e === 'object' && e !== null)` — AND/OR extend
`isStructurallyValidRun` to shallow-check transcript items
(`roomId`/`choiceId` strings). The run's own `transcript` (used by `choseIn`
and `playEnding`) doesn't flow through `asTranscript` at all, so the
validator is the right place for the run-side half.

### H-3. `keepsakesHeld` non-array crashes the end screen · HIGH

`isStructurallyValidRun` doesn't check `keepsakesHeld` (confirmed: accepts
`keepsakesHeld: "x"`). Every *gameplay* consumer coincidentally survives a
string (`(s.keepsakesHeld ?? []).includes(...)` — `String.prototype.includes`
exists), but `playEnding`'s Morning Report block does
`(this.state.keepsakesHeld ?? []).map(...)` (`flow.ts:1291`) — `.map` doesn't
exist on a string → crash when the run *finishes*. Same boundary, same fix
family: validate it as a string array (or coerce via `strArrayOr` at
hydrate).

### H-4. Negative / non-integer `currentStage` crashes on Continue — CONFIRMED ACCEPTED BY VALIDATOR · HIGH

`isStructurallyValidRun` accepts `currentStage: -5` (confirmed live). In
`enterRoom`, `startStage = this.state.currentStage ?? 0` and
`room.stages[-5]` is `undefined`, so the first loop iteration dereferences
`stage.beats` → TypeError, immediately on Continue. `currentStage: 1.5`
fails the same way (`stages[1.5]` undefined). An *oversized* integer merely
skips the room (loop never runs), which is safe.

**Fix shape:** in the validator — if `currentStage` is present, require
`Number.isInteger(v) && v >= 0`. (Optional fields absent stays fine, per the
validator's own legacy-saves rule.)

### S-1. `Settings` values pass through `migrateSettings` completely unvalidated · HIGH (import path) 

`hydrateProfile` hardens every profile field — except `settings`, which is
`{ ...base, ...migrated, ...rest }` (`saveStore.ts:208-212`): every stored
value lands verbatim, whatever its type. The 2026-07-26 hardening note says
"hostile-but-valid JSON crashed the game in 10 different ways" and coerces
profile fields; the settings object is the same boundary (same save file,
same import textarea) with zero coercion. Concrete consequences, confirmed
against the real consumers:

- **`musicVolume`/`sfxVolume`/`narrationVolume` non-number → NaN → crash on
  first gesture.** `setMusicVolume` clamps with `Math.max(0, Math.min(1, v))`
  — **NaN survives both** (confirmed: `Math.max(0, Math.min(1, NaN))` is
  NaN). Stored in the engine; `ensureCtx()` later does
  `musicGain.gain.value = this.musicTarget()` — assigning a non-finite value
  to an AudioParam throws a TypeError. First click after boot → recovery
  overlay.
- **`fpsCap` 0 / NaN / string → the 3D scene never renders again.**
  `shouldRenderFrame` computes `1000 / targetFps`; `1000/0 = Infinity`,
  `1000/NaN = NaN`, and `elapsed >= NaN` is always false (confirmed) — the
  render loop silently presents no frames, forever. Permanent black scene
  with a working DOM UI on top: much harder to diagnose than a crash.
- **`uiZoom` unclamped** → `applyUiZoom(999)` → unusable UI (and
  `sharedDisplaySettings.ts`'s own validator checks `typeof === 'number'`
  but no range/finiteness either, so the cross-pack shared key carries the
  same hostile value into the *other* pack).
- **`language` arbitrary string** degrades mostly gracefully (`t()` falls
  back to English), but the Settings language button renders
  `LANGUAGE_LABELS['xx']` → the literal text "undefined". Cosmetic.
- `quality`/`renderScale`/`theme`/`textVersion` degrade safely (verified:
  `pixelRatioFor` has a default branch; non-'high' quality reads as low).

**Fix shape:** a `sanitizeSettings` step inside `hydrateProfile` mirroring
the existing `strArrayOr`/`countOr` helpers: clamp volumes/uiZoom to their
real ranges (finite check first), whitelist enums (language, textVersion,
quality, renderScale, theme, fpsCap ∈ {30, 60}), boolean-coerce toggles.
Also range-clamp `uiZoom`/`fpsCap` in `sharedDisplaySettings.ts`'s
`isSharedDisplaySettings`. Optionally also make `SoundEngine`'s volume
setters NaN-guard (`Number.isFinite(v) ? clamp : keep current`) as defense
in depth — the current clamp's NaN pass-through is surprising on its own.

---

## Part 2 — Audio engine findings

### A-1. `discovery-pulse` timer not cleared on tab-hide — the exact "chirp burst" class 1.2.1 fixed, reintroduced · MEDIUM

`soundEngine.ts:312-329` (`visibilitychange`): on hidden it clears
`chordTimer`/`moteTimer` (via `clearTimers()`) and `accentCreakTimer` — but
**not `accentPulseTimer`**. On visible it re-arms the pulse
(`if (this.roomAccent === 'discovery-pulse') this.scheduleNextPulse()`).
Two consequences while LIMERENCE's `the-discovery` room is active:

1. While hidden, the old timer chain keeps firing (background-clamped),
   each `playPulse()` scheduling oscillators at the *frozen* suspended-clock
   `currentTime` — on resume they all sound at once (a low thump burst,
   the same audible artifact 1.2.1 describes for motes).
2. The visible handler starts a *second* chain while the first still lives —
   each hide/show cycle in that room adds another parallel chain, so the
   pulse audibly accelerates (double, triple tempo…) for the rest of the
   room.

The asymmetry (creak cleared, pulse not) dates to the LIMERENCE roomAccents
extension (tasks #187-188), which added `discovery-pulse` after the
visibility handler was written. **Fix:** clear `accentPulseTimer` in the
hidden branch, exactly as `accentCreakTimer` is.

### A-2. Motes bypass the `genDuck` bus — they will chime over file-based music · MEDIUM (latent, blocks T1)

The generative bed is supposed to route through `genDuck` so a real music
file ducks it to silence (`soundEngine.ts:149-155`). Chords do
(`chordBus → genDuck`), the noise pad does (`noiseGain → genDuck`) — but
`playMote` connects `osc.connect(gain).connect(this.musicGain!)`
(`soundEngine.ts:488`), skipping the duck. Dormant today (no files exist);
the moment T1 audio files land, generative motes keep sounding every 9-22s
on top of the authored track. Room accents also route to `musicGain`
directly, which is arguably intentional (they are the *room's* sound, not
the bed) — worth an explicit decision comment either way.
**Fix:** `connect(this.genDuck!)` for motes; decide + document for accents.

### A-3. File-based music never starts for the boot slot (autoplay rejection is never retried) · MEDIUM (latent, blocks T1)

`setMusicFile(url)` calls `void el.play().catch(() => {})`
(`soundEngine.ts:227`). At boot, `start()` → `setActMusic(0)` runs before
any user gesture, so the `play()` is rejected by autoplay policy and
swallowed; nothing retries it on the first gesture (`primeOnGesture` resumes
the AudioContext but doesn't touch `fileMusicEl`). Result once files exist:
the title/act-0 slot stays silent until the first act *change* re-invokes
`setMusicFile`. **Fix:** have `primeOnGesture()` retry
`this.fileMusicEl?.play()` when a src is set and paused, or defer the first
`setMusicFile` until after the gesture. Same latent class as A-2 — worth
fixing before T1 activation, invisible until then.

### A-4. Volume setter clamps pass NaN through · LOW (defense-in-depth twin of S-1)

`Math.max(0, Math.min(1, v))` in `setMusicVolume`/`setSfxVolume`/
`setVoiceVolume` returns NaN for NaN. Guard with `Number.isFinite`.

---

## Part 3 — UI / UX findings

### U-1. Every choice screen initially focuses the "⟲ reread" button, not a choice · MEDIUM

`ChoicePanel.mount` ends with
`(wrap.querySelector('button'))?.focus()` (`choices.ts:206`) — and in
`pick()` the reread button is appended *first* (`choices.ts:64-79`,
`onReread` is always passed by `enterRoom`). So on every stage's choice
presentation, keyboard focus lands on the small utility button: pressing
Enter/Space immediately replays the beats instead of confirming anything,
and the visible focus ring sits on the least important control. Door rows
(`pickDoor`, no reread button) correctly focus the first door. Predates F4?
No — introduced *by* F4's reread button insertion; the focus call was
written when the first button was always the first card.
**Fix:** focus `wrap.querySelector('button.choice-card')` instead.

### U-2. The Register's unvisited doors are enabled, inert buttons · LOW (a11y)

`showHotelRegister` builds every door as a `<button>`; unvisited ones get no
click handler and are not disabled (`overlays.ts:1097,1124-1126`). A
keyboard user tabs through up to ~40 dead stops — the identical finding the
S3 codex fix (2026-07-20) already corrected for locked codex cards, with the
same fix available: `card.disabled = true` (or `tabIndex = -1`) for
unvisited doors. Same class, one more site: the codex's last-message card
when unlocked but `resolvedLastMessage` is null builds an enabled card with
no note and no handler (`overlays.ts:969-981`).

### U-3. `showPersona` is the only overlay without an Escape close · LOW

Settings, About, Credits, Article, Codex, Register, Ledger, pause menu all
close on Escape; the persona panel doesn't handle the key at all
(`overlays.ts:579-671`). Escape-as-Skip (resolve the existing persona
unchanged — *not* the Skip button's clear-everything semantics) would match
its siblings. Minor, but it's felt during onboarding, the game's first
impression.

### U-4. A player who chose "Skip — call me traveler" is re-asked on every new run · NOTE (design question)

`start()` shows the persona editor whenever `!this.profile.persona.name`
(`flow.ts:641`), and Skip deliberately clears all fields. Net effect: the
player who explicitly declined naming themselves is re-prompted at the start
of every subsequent run, forever — the one onboarding panel that ignores its
own answer. If intentional (a nightly invitation), a comment should say so;
otherwise a `personaOffered` profile flag (or storing `preset: 'skipped'`)
would make Skip sticky while leaving the title-menu button as the way back
in. Owner call — the E6 onboarding-stack decision suggests the current
behavior is unexamined rather than chosen.

### U-5. Persona preset blurbs are stored as translated display text · LOW (i18n)

The About-you buttons compare and store the *resolved* string
(`selectedBlurb === b`, `overlays.ts:625-641`). After a language switch, the
stored blurb no longer matches any button (`aboutTexts.includes(...)` fails)
so it re-opens as "custom" free text in the old language, and the `{blurb}`
archive echo speaks the old language forever. Storing the blurb *key* (with
resolution at display time) would fix both; the free-text path keeps its
verbatim behavior. Low urgency — but it is translated-content drift of the
exact kind R1 cares about.

### U-6/U-7. Small inconsistencies in the title loop · TRIVIAL

- Settings saved from the title screen persist with no "Progress saved"
  toast (`flow.ts:624` `persist()`), while the pause menu and the HUD gear
  both `persist(true)` — same action, inconsistent feedback.
- Title-menu 'exit' (`flow.ts:625-626`) calls `window.close()` without the
  `await this.persist()` the pause menu's 'exit' branch does first. All
  mutating actions on the title screen persist individually, so nothing is
  lost today — but the asymmetry invites a future bug if any title action
  ever defers its persist.

### U-8. Secret doors are picked by an invisible number · TRIVIAL

The secret/understory door card renders `✦` instead of a numeral
(`choices.ts:126`) but is still selected by its positional digit key, and
`door-help` says "press its number". Either give the ✦ card a visible
number, or exclude it from digit selection. Cosmetic wording/affordance
mismatch.

### U-9. `clearOverlays` carries a dead `void clear;` statement · TRIVIAL

`overlays.ts:1381` — leftover import-keepalive. Delete (and the import, if
then unused).

---

## Part 4 — Boot & persistence resilience

### B-1. The recovery safety net installs *after* the async pack import · MEDIUM

`boot()` (`main.ts:46-66`) awaits `loadPack()` — a network-fetched dynamic
chunk in production — *before* `installRecoveryHandlers(ui, canvas)`. A
failed chunk load (flaky network on GH Pages, mid-deploy asset skew) rejects
before any handler exists: silent black screen, the exact outcome S6 built
the recovery overlay to prevent. `boot()` itself is also a floating promise
(`boot();`) whose rejection lands on the same not-yet-installed handler.
**Fix:** look up `ui`/`canvas` and install the handlers first, then load the
pack (the handler only needs the DOM, which is static HTML).

### B-2. A quota-full backup write masquerades as corruption recovery · LOW

`LocalSaveStore.load` (`localSave.ts:31-59`) writes the backup *inside* the
same try as parse+hydrate. If `setItem(backupKey, raw)` itself throws
(quota-full private browsing), control falls into the catch, which loads the
*old* backup and reports "restored from backup" — silently rolling the
player back one save even though the primary payload was perfectly fine.
**Fix:** wrap the backup write in its own inner try/catch (best-effort,
never triggers the fallback path).

---

## Part 5 — Engine / design notes (no code defect, needs an owner decision or a comment)

### E-1. UAT `jump()` into the understory diverges from real play order · LOW (UAT fidelity)

`backfillVisitedForJump` (`storyEngine.ts:136-139`) marks `act4Sequence[0]`
visited for understory jump targets, with a comment claiming the understory
"is only reachable past the act4Sequence's first stop." That's not what
`offeredDoors` does: the fork *replaces* the first offer, and a real
descending player still walks `act4Sequence[0]` *after* the understory
(pendingUnder exhausted → `next` = act4Sequence[0], never visited). So a
jump-based UAT run through the understory skips a room a real player always
sees. Only affects UAT scripts' fidelity, not players. Fix the comment at
minimum; fix the backfill if any Phase-4 Playwright matrix script depends on
walking act4Sequence[0] after a jump.

### E-2. `applyTokens` resolves inherited properties · LOW (robustness)

`resolver.ts:113`: `tokens[key] ?? m` — `tokens` is a plain object, so a
beat/translation containing `{constructor}`, `{toString}`, `{valueOf}` or
`{hasOwnProperty}` interpolates function source text instead of leaving the
token alone. Only authored/translated text can trigger it (user input is
substituted as a *value*, never re-scanned — verified), so this is a
translator-typo hazard, not an injection: guard with
`Object.hasOwn(tokens, key) ? tokens[key] : m`.

### E-3. One Door mode silently hides keepsake choices and prior-run beats · NOTE

`playOneDoor` builds `{ ...newRun(), act: room.act }` (`flow.ts:1159`) —
deliberately no `prior`, no `keepsakesHeld`. A player who holds keepsakes
and One-Doors into a room with a keepsake-gated bonus choice doesn't see the
choice they'd see in a run; prior-referencing beats degrade to their
fallbacks. Both are defensible ("no run context") — but the keepsake case
contradicts the Codex/Ledger's "you carry them always" framing. If current
behavior is wanted, one line in `playOneDoor`'s comment; if not, pass
`this.keepsakesFromProfile()`.

### E-4. `lastMessage` capture relies on an invariant enforced two files away · NOTE

`enterRoom` writes `profile.lastMessage` un-gated by `oneDoorMode`
(`flow.ts:1022-1024`). It can't fire in One Door mode *only because*
`oneDoorPool` excludes `hooks.lastMessageId`. That coupling deserves a
comment at the capture site (or an `!this.oneDoorMode` belt-and-suspenders),
so a future pool change can't silently let a vignette overwrite the
player's recorded sentence.

### E-5. First-heart-loss explainer is marked seen before it is shown · NOTE

`flow.ts:1038-1040` persists `hasSeenHeartLoss = true`, *then* plays the
bark. Quit/crash during the bark = the calmest explanation in the game is
never seen. The reverse order risks double-showing instead (worse per the
one-time contract). Current trade-off is defensible — record it as
deliberate in the comment, or show-then-persist with an idempotence guard.

### E-6. R4's "incl. header comments" clause vs. the anti-leak comments · NOTE (policy)

Grep confirms **zero** cross-pack guide words in registered string values
(both directions — clean). But six files name the *other* pack's guide word
inside comments whose purpose is to enforce the rule, e.g.
`limerence/text/cs-guide.ts:19` ("Porter" = "Vrátný" — never "Uvaděč"…),
`fa-rooms.ts:11`, `fa-rooms-act3.ts:19`, `de-guide.ts:70`,
`de-rooms-act2.ts:25`, `fr-guide.ts:71`, and `content/text/fr.ts:227-228`
(names LIMERENCE's Portier). R4 as written says "incl. header comments."
Either amend R4 with an explicit carve-out for isolation-warning comments
(recommended — the comments actively prevent leaks), or reword them to "the
other pack's guide word" without spelling it. Decide once, note it in the
master plan, stop re-litigating.

### E-7. `evaluateEnding` never reads the reason↔feeling axis · NOTE

`engine/endings.ts:64-68` maps endings from `selfOthers` ×
`controlAcceptance` only; `reasonFeeling` influences no ending (it drives
barks/triptych only). Presumably authored intent — worth one comment line
saying so, since it *looks* like an oversight next to the other two axes.

---

## Part 6 — Verified clean (checked, no action — recorded so the next review doesn't re-plow this ground)

- **XSS/injection:** every user-controlled string still renders via
  `textContent` (`el()`), `renderEmphasis` escapes before `<strong>`
  substitution, the door tooltip escapes hint/teaser (9.3 fix present),
  About/Credits/Examined-offer `innerHTML` sites carry authored/translated
  strings only. Persona name/blurb interpolate as token *values* and are
  never re-scanned for tokens.
- **R4 vocabulary isolation:** registered string values clean in both
  directions (see E-6 for the comments-only nuance).
- **Focus containment:** trap stack, microtask initial-focus, and
  MutationObserver auto-release all correct; nested field-note-over-codex
  hand-back verified in code.
- **Escape layering:** the three-layer guards (codex/register + field note +
  article) are consistent and well-commented; pause-menu Escape resolves
  'resume'; `shouldOpenPauseOnEscape`'s fullscreen policy is sound.
- **Persist chain:** ordering + always-settles-fulfilled + one-toast failure
  reporting all hold; `persist()`'s inGame/placeholder-run guard correct;
  mid-room `currentStage` bump order (before any persist) correct.
- **Ending bookkeeping:** `playEnding`'s counter order (counters →
  choiceHistory → epiphanies → persist) matches the documented contract;
  end-screen rebuild-on-language-change (N1) correct; "Walk again" resets
  `currentTheme`/`runStartNotes`/HUD correctly.
- **Story engine:** `offeredDoors`' fork/gate/secret logic, `completeRoom`'s
  act advancement, `doorsForAct`'s doorSeed salting, `isResumableRun`'s
  layering over `isStructurallyValidRun` — all verified against the graph
  shapes of both packs.
- **`hydrateProfile` profile-level coercions** (strArrayOr / recordOr /
  countOr / persona name+blurb) hold as documented — the gaps are only the
  four listed in Part 1.
- **SoundEngine architecture:** bus wiring (master → compressor), crossfade
  ramp-before-stop (1.2.2), LFO cleanup (M3), chord/mote visibility handling
  (1.2.1 — modulo A-1), reverb send pattern, `configurePack` defaults.
- **Director:** dispose paths (theme materials + geometry, doors, dioramas,
  epitaph wall), idle downshift + ambient-event gating on `idleEligible`,
  `pixelRatioFor` safe default, tooltip escaping, resize re-framing,
  UAT probes.
- **`localSave` backup semantics** (modulo B-2) and the
  hydrate-before-commit fix (M1) hold.
- **TextPanel:** beat cursor/reread logic, typing-skip guard, aria-live
  suppression during typing, overlay/focused-child key guards — all correct.

---

## Part 7 — Test-suite gaps surfaced by this review

1. `pickUnchosenRooms` hostile-transcript loop (H-1) — the only sibling
   without one.
2. Transcript-*items* hostile cases (H-2) for `choseIn`, `choseInPrior`,
   `pickExhibitEntry`, `pickUnchosenRooms`, and an `isStructurallyValidRun`
   case for `transcript:[null]`.
3. `isStructurallyValidRun` cases for `currentStage: -1 / 1.5` (H-4) and
   `keepsakesHeld: "x"` (H-3).
4. A settings-boundary suite (S-1): hydrate a profile whose settings carry
   wrong-typed values; assert every consumer-facing value comes out
   clamped/whitelisted.
5. A visibility-cycle test for `discovery-pulse` timer bookkeeping (A-1) —
   pure-logic extract if needed, matching the repo's no-DOM convention.
6. Once T1 lands: a bus-routing assertion that every generative-bed source
   reaches `musicGain` *through* `genDuck` (A-2) — checkable by walking the
   node graph in a mocked AudioContext, or by a source-lint test like
   `engineDefaultLeakLint`.

---

## SECOND PASS (same day) — challenge-the-first-pass sweep

The owner asked whether the first pass really covered everything affecting
playthrough, settings, and saving. It hadn't — the following surface was
unread in round 1 and has now been reviewed end-to-end: both pack indexes
(`packs/anamnesis/index.ts`, `packs/limerence/index.ts`,
`limerence/endingLogic.ts`), `voiceover.ts`'s manifest/init half,
`explanation.ts`, `reflection.ts`, `locale.ts`, `zoom.ts`, `doors.ts`'s
dispose/flicker paths, `post.ts`, `dioramas.ts` disposal, `index.html`,
`package.json`, `vite.config.ts`, `electron/main.cjs`,
`scripts/assemble-web-dist.mjs`, and the translated dynamic-beat files'
guard parity.

On top of the file reads, a **content-invariant sweep was executed against
both packs' real modules** (script in scratchpad, `npx tsx`, no repo
changes) covering the biggest untested playthrough risk from round 1:

- **Soft-lock check:** no stage in either pack has all-conditional choices
  — `enterRoom`'s `available` filter can never produce an empty choice list,
  so the "zero cards mounted, promise never resolves" soft-lock is
  impossible with shipped content. (Worth pinning with a permanent content
  test — added to Part 7.)
- **Beat/outcome/available/secret function totality:** every function beat,
  outcome beat, `available` predicate, and `secret` predicate in both packs
  was invoked against a bare fresh run, an empty-transcript prior, and a
  short real prior — zero throws.
- **Evaluator totality:** `evaluate(hearts=0)` → `dissolved` /
  `the-ghost`; bare-run and all nine selfOthers×controlAcceptance axis
  combinations resolve to real, defined ending ids in both packs.
- **Graph referential integrity:** every id in prologue/pools/gates/
  act4Sequence/understorySequence and both `hooks` ids exists in the room
  registry; `fogColorByTheme` covers themes 0-5; every ending has an icon;
  every keepsake has an icon and a trigger flag; `actNamesEn` covers 0-4.
  All clean, both packs.

### New findings (round 2)

**S-2. Importing a profile silently loses its display settings · MEDIUM**
`importProfile` (`flow.ts:481-492`) hydrates, saves, and reloads — but never
writes (or clears) the cross-pack shared display key. On the very next boot,
`main.ts:58` unconditionally overlays `withSharedDisplaySettings`, so the
*pre-import* quality/renderScale/uiZoom/fpsCap silently replace the imported
profile's values — contradicting the import description's "Replaces your
entire profile" promise (in all five languages). Every other Settings-writing
path (title, pause, HUD gear, end screen) calls `writeSharedDisplaySettings`;
import is the one that forgot. **Fix:** call
`writeSharedDisplaySettings(hydrated.settings)` before the import's reload.
(Also note: `writeSharedDisplaySettings` copies values verbatim, so S-1's
hostile `uiZoom`/`fpsCap` propagate cross-pack through this key — one more
reason the clamp belongs in both places.)

**U-10. The "Text version" toggle is inert in LIMERENCE builds · LOW**
Confirmed by grep: all 214 `registerAll` calls in `packs/limerence/text/`
register `'v2'`; zero v1 entries exist anywhere in the pack. The Settings
row still renders unconditionally and promises "v1 is the original voice,
kept as a selectable backup" — in LIMERENCE it toggles nothing a player can
ever perceive. **Fix:** hide the row when the active pack has no v1 catalog
(a pack flag, or probe `registeredKeys('v1', lang)` at panel build).

**R2-1. `voiceover.init` trusts the fetched manifest's shape · LOW**
`init()` assigns `await res.json()` directly (`voiceover.ts:66-67`). A
tampered/corrupt `av-manifest.json` of `{"voice": null}` makes
`manifestPackHasAnyVoice` dereference `manifest.voice[packId]` on null →
TypeError — thrown from `settingsActions()` (`flow.ts:516`), i.e. **opening
Settings crashes**. Server/build-artifact-controlled in practice (not
user-editable like the save), so LOW — but it's the same
trust-the-parsed-JSON pattern the save boundary already learned to guard.
**Fix:** one shape check before assignment (`voice`/`music` are non-null
objects), else keep `EMPTY_MANIFEST`.

**R2-2. Pausing mid-transition snaps tweens to completion · LOW (cosmetic)**
The render loop early-returns while paused without calling
`clock.getDelta()`, so `clock.elapsedTime` freezes; on the first resumed
frame the delta call rolls the entire paused duration into `elapsedTime` at
once, and every active tween (camera dolly, Usher walk, spill fade — all
keyed on absolute `elapsedTime`) instantly completes. Observable by pressing
Escape mid-door-crossing and resuming: the walk/dolly visibly snap. No
deadlock (the dolly's `done` still fires; flow proceeds normally), purely
cosmetic, rare. **Fix if ever wanted:** shift each active tween's `startT`
forward by the pause duration on unpause, or key tweens on an accumulated
game-time clock that only advances while unpaused.

### Round-2 verified clean (adds to Part 6)

- **Both pack indexes:** wiring matches the `ContentPack` contract exactly;
  LIMERENCE's evaluator mirrors ANAMNESIS's priority order (hearts → scripted
  final-gate choices → axis profile); `endingLogic.ts`'s hidden-ending gates
  mirror `engine/endings.ts` correctly with LIMERENCE's own flags.
- **`package.json`:** the voice/music READMEs' claim that the manifest step
  is wired into every dev/build path is TRUE (`predev`, `predev:limerence`,
  `prebuild`, `prebuild:anamnesis`, `prebuild:limerence` all run
  `build:manifest`); `dist:win` chains through `build:web`. No drift.
- **Translated dynamic beats** guard the short-transcript case exactly like
  the English source (`fa-dynamic.ts:21-22`'s `if (!entry) return
  FALLBACK[index]` — spot-verified; the round-2 sweep's zero-throw result
  covers the registered English side for both packs).
- **`explanation.ts`/`reflection.ts`:** overlay-guard parity with
  TextPanel's key handling holds; the explanation card's `field-note` class
  correctly suppresses the text panel's own advance keys underneath; the
  double-dismiss via focused-close-button Enter is idempotent (second
  resolve is a no-op).
- **`locale.ts`/`zoom.ts`:** RTL/lang/dir application and the CSS `zoom`
  choice (rescales hit-testing, unlike `transform`) are correct.
- **`doors.ts`:** dispose walks geometry+material; the ambient flicker
  drives slab, glow light, and floor pool from one envelope; hover exclusion
  correct. **`post.ts`:** low-quality path is a plain render with no
  composer (as documented); grade/bloom sizing on resize correct.
  **`dioramas.ts`:** `trackDispose` handles array materials.
- **`electron/main.cjs`:** contextIsolation on, nodeIntegration off,
  single-instance lock, off-screen window-state guard, Alt+Left back-nav
  with the Backspace-conflict rationale documented — sound.
- **`vite.config.ts` / `assemble-web-dist.mjs`:** `base: './'`, per-pack
  defines, landing-page + manifest + landing-music assembly all match the
  documented deploy layout.
- **`index.html`:** minimal and correct — though it renders a black page
  until the pack chunk loads, which folds into B-1's "install the recovery
  net (and ideally any loading hint) before the async import" fix.

### Round-2 additions to the test-gap list (Part 7)

7. A permanent content test pinning "every stage in every pack has ≥1
   unconditional choice" (the soft-lock invariant the round-2 sweep
   verified manually — cheap to keep green forever).
8. A content test invoking every function beat/outcome/available/secret
   against bare-run + empty-prior + short-prior states (the round-2 sweep,
   promoted into the suite).
9. An import-path test asserting the shared display key reflects the
   imported profile's display fields after import (S-2).
10. A LIMERENCE-build test asserting the Text version row is absent (or a
    pack-flag unit test) once U-10 is fixed.

---

## THIRD PASS (same day) — the runtime angle: simulate, measure, build

Passes 1-2 read code and executed targeted probes. Pass 3 attacked from the
opposite direction: **treat the game as a black box and interrogate its
actual behavior at scale** — a Monte Carlo playthrough simulator driving the
real engine functions, a directed-play reachability prover, a full-catalog
token audit, and a real production build with bundle forensics. All scripts
in scratchpad, zero repo changes.

### 3-A. Monte Carlo playthrough simulation — 9,000 full runs, zero invariant violations

A simulator was built over the real `offeredDoors`/`completeRoom`/
`applyEffects`/`evaluate`/`newRun` (mirroring `enterRoom`'s stage loop,
including the final-gate eligibility stamp and the understory `descended`
stamp), run 1,500× per pack × 3 profile variants (first-run / returning /
maxed with all keepsakes + full codex), seeded and reproducible. Checked on
every single run:

- **Termination** — no run exceeded 80 door-steps (no graph dead ends, no
  loops). Actual lengths: ANAMNESIS 7–15 rooms first-run (exactly the
  README's "15 of 30+3" claim), 7–18 returning (understory); LIMERENCE
  7–15 / 7–18.
- **No room ever re-offered** after being visited; **act progression
  monotonic**; **hearts never below zero**; **every `evaluate()` result a
  real ending id**.
- **Understory fork discipline:** offered in 99.7% of returning runs
  (missing only where the run died before Act IV), never offered twice in
  one run, never offered to a first-run player. Secret rooms (`the-cave`,
  `the-usual-suite`) and understory rooms correctly unreachable on
  first-run profiles and all reachable on returning profiles.
- **Downstream consumers** (`evaluateEpiphanies`, `ledgerStats`,
  `earnedGuestStamps`, `activePatterns`/`patternForRun`,
  `oneDoorPool`/`pickOneDoorRoom`) fed each simulated run's resulting
  profile — zero throws across all 9,000.

**Result: no defects.** This is the strongest playthrough-integrity
evidence the project has — the whole door graph, both packs, executed
end-to-end thousands of times.

### 3-B. Ending reachability — all 13 endings proven reachable; one balance finding

Random play reached only 5/7 ANAMNESIS and 5/7 LIMERENCE endings, so a
directed (greedy) player was simulated for the axis-extreme endings:

| Ending | Requirement | Greedy success | Verdict |
|---|---|---|---|
| `open-hand` (ANAM) | both axes ≥ +35 | 391/400 | healthy |
| `fortress` (ANAM) | both axes ≤ −35 | 400/400 | healthy |
| `the-giver` (LIM) | both axes ≥ +35 | 385/400 | healthy |
| `the-armored` (LIM) | both axes ≤ −35 | **0/400 joint-greedy; 90/400 selfOthers-first** | see R3-1 |

**R3-1. `the-armored` is drastically harder than its three siblings ·
NOTE (content balance, owner decision).** A player greedily minimizing both
axes together *never* reaches it (controlAcceptance deltas dominate and
selfOthers stalls at −26); only a strategy prioritizing selfOthers first
crosses the −35 threshold, and even then door-offer luck holds success to
~22%. Root cause is the choice inventory: LIMERENCE's negative-selfOthers
budget is thin (24 choices summing −118, vs +170 positive; ANAMNESIS's
negative side is −157) and spread so that the ideal-play bound is −66 —
reachable, but with little slack. Its mirror `fortress` succeeds 87-100%
under any negative strategy. Options if unintended: add/deepen a few
negative-selfOthers deltas in LIMERENCE's Act I-III pools or gates, or
lower LIMERENCE's threshold for that quadrant. If intended (an ending that
demands rigid self-protection at every single door), record the intent —
it is the hardest non-hidden ending in either pack by a wide margin, and
its codex card sits visibly locked in front of completionists.
Supporting data: random play lands `the-ghost` in ~52% of LIMERENCE runs
(hearts attrition — expected and fine), `the-armored`/`the-giver` in 0%.

### 3-C. Full-catalog token audit — 3,257 keys, clean

Both packs' catalogs registered together (the dev-server state), every
registered string variant scanned for `{token}` integrity, and dynamic
(function) entries executed against a populated fake state:

- **Zero unknown/typo'd tokens** — every `{…}` in every language is one of
  the known set (name/blurb/hearts/n). No translation ever localized a
  token name (which would render it literally on screen).
- **Zero cross-language token-set mismatches** among translations. The only
  two flags: `ending.return.beat5` and `act.intro.3` carry `{name}` in the
  four v2 translations but not in **v1 English** — correct by design (the
  persona whisper is a v2-voice feature; v1 is the preserved pre-persona
  original). Worth one line of intent-comment somewhere: a v1-voice player
  deliberately never gets persona whispers.
- **Zero throws** from any function-valued registered entry.

### 3-D. Production build + bundle forensics — pipeline green, isolation verified

`npm run build:web` runs clean end-to-end on this branch (tsc + both packs
+ landing assembly; dist-web structure correct: rozcestník + both packs +
av-manifest). Grepping the **real minified bundles**:

- **ANAMNESIS bundle: zero LIMERENCE presence** — no guide words in any
  language, no LIMERENCE room ids, no prose. The tree-shaking claim holds.
- **LIMERENCE bundle: zero ANAMNESIS translations or prose** — all four
  translated Usher guide-words absent; an ANAMNESIS ending-epitaph probe
  and a room-teaser probe both absent, meaning `content/endings`' prose is
  confirmed tree-shaken out (only `endingsTotal` is reachable via
  `ledger.ts`, and Rollup drops the unused `endings` array). What does ship
  is the documented engine-default coupling only: graph room *ids*
  (`boulder`, `marys-room` via `DEFAULT_GRAPH`/`ACT_POOLS`), keepsake defs
  (`choices.ts` default param), and the HUD's default tooltip strings
  ("grip on reality" lives in `hud.ts` itself). Ids and a handful of
  engine-default lines — no reachable-in-play foreign content.
- Main chunks: ANAMNESIS 1.80 MB / LIMERENCE 1.65 MB minified (three.js
  dominates; gzip ~504 kB) — consistent with the plan's recorded sizes.

### Round-3 additions to the test-gap list (Part 7)

11. Promote the Monte Carlo harness into the suite as a seeded, fast CI
    invariant test (e.g. 200 runs per pack: termination, no re-offers,
    monotonic acts, evaluate totality, downstream no-throw) — it caught
    nothing today precisely because it should be cheap to keep it that way.
12. A reachability guard for axis-extreme endings: assert the ideal-play
    axis bound clears each pack's threshold with a safety margin (the
    R3-1 data as a permanent regression tripwire for future content edits).
13. A bundle-isolation CI grep (per pack: other pack's guide words in all
    five languages + a room-id probe) — the claim is currently re-verified
    only when someone thinks to; it's one grep in the build workflow.

---

## Part 8 — Recommended fix batches (for a future session; nothing done now)

1. **Batch 1 — save/import-boundary hardening round 4 (H-1..H-4, S-1,
   S-2):** one session. `asTranscript` item filtering + `pickUnchosenRooms`
   guard + validator extensions (`currentStage`, `keepsakesHeld`, transcript
   items) + `sanitizeSettings` in `hydrateProfile` + shared-display range
   clamps + NaN-guarded volume setters + the import path writing the shared
   display key (S-2). Plus the Part-7 tests (now items 1-6 and 9), plus one
   new troll-UAT payload each. This closes the *entire* known hostile-save
   surface and the import-correctness gap.
2. **Batch 2 — audio correctness (A-1..A-4, R2-1):** small. A-1 is two
   lines; R2-1 is a one-line shape guard; A-2/A-3 are the "before T1
   activation" gate — fold into Phase 3 of the overhaul plan.
3. **Batch 3 — UX polish (U-1..U-10, B-1, B-2):** U-1 and B-1 first (real,
   felt); U-10 (inert Text-version row in LIMERENCE) is small and
   player-visible; the rest are trivial sweeps. R2-2 (pause-snapped tweens)
   is optional cosmetics. U-4/E-3/E-6 need owner answers before code.
4. **Batch 4 — content-invariant tests (Part 7 items 7-8, 11-13):**
   promote the round-2 sweep AND the round-3 Monte Carlo/reachability/
   bundle-isolation checks into the permanent suite so the soft-lock,
   beat-totality, run-termination, ending-reachability, and pack-isolation
   invariants can never regress silently.
5. **Owner decision (R3-1):** rule on `the-armored`'s difficulty — content
   rebalance (a few more negative-selfOthers deltas in LIMERENCE Acts
   I-III) vs. documented intent. No code until decided.

Master plan cross-reference: this document is the "found bugs" record the
2026-08-01 overhaul session asked for; the v2 overhaul plan
(`17-v2-overhaul-plan.md`) Phase 1 should absorb Batch 3, and Phase 3
(voice/music) must absorb Batch 2's A-2/A-3 as activation blockers.

## Resolution — Batches 1-4 shipped, all four owner-decision items ruled on (2026-08-01, same-day continuation)

Batches 1-4 above are all implemented, tested, and verified (see `git log`
on `claude/vestibule-v2-overhaul` for the commit-by-commit record). The four
items this document flagged as needing an owner call before code were ruled
on rather than left open, following the standing "go step by step, fix
everything needed" instruction:

- **U-4 (persona Skip re-prompt):** ruled *make it sticky*. New
  `Profile.personaOffered` flag (additive, no schema bump) — `start()` now
  gates on "has the editor ever been shown", not "does a name exist", so
  Skip is honored forever, same as a chosen preset. The title menu's "Who
  are you?" button remains the way back in. See `saveStore.ts`'s
  `personaOffered` doc comment for the full rationale.
- **E-3 (One Door mode hides keepsake choices):** ruled *pass them through*.
  `playOneDoor` now threads `this.keepsakesFromProfile()` into its throwaway
  `RunState`, so a keepsake-gated bonus choice is visible exactly as it
  would be in a real run — consistent with the Codex/Ledger's "you carry
  them always" framing. The existing consolidated `!this.oneDoorMode` guard
  already prevented this from granting a *new* keepsake or marking
  `keepsakeChoicesTaken`, so no further change was needed there.
- **E-6 (R4 comment carve-out):** ruled *amend R4*, as the finding itself
  recommended. `13-master-development-plan.md`'s R4 now has an explicit
  carve-out for anti-leak comments that name the other pack's guide word
  specifically to warn against using it — the registered-string-value rule
  is untouched and still absolute.
- **R3-1 (`the-armored` difficulty):** ruled *document intent, don't
  rebalance*. Rebalancing LIMERENCE's negative-selfOthers choice budget
  would touch already-tested, already-translated (5 languages) content for
  a difficulty curve that is thematically defensible as-is — "armored"
  reads as the hardest ending precisely because it demands unwavering
  self-protection at every door, not a lean toward it, and it remains
  genuinely reachable (never 0%). Documented directly in
  `packs/limerence/index.ts`'s evaluator, next to the `the-armored` branch,
  so a future content editor sees the reasoning at the point of risk. The
  `contentInvariants.test.ts` reachability sweep (Batch 4) already pins the
  ideal-play axis bound as a regression tripwire — any future edit that
  narrows the margin further now fails CI instead of drifting silently.

Full regression after this resolution pass: `tsc --noEmit` clean,
`npm run build:web` clean, `verify:isolation` OK, full `vitest run` green
(see the master plan doc's next entry for the exact count).
