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

## Part 8 — Recommended fix batches (for a future session; nothing done now)

1. **Batch 1 — save-boundary hardening round 4 (H-1..H-4, S-1):** one
   session. `asTranscript` item filtering + `pickUnchosenRooms` guard +
   validator extensions (`currentStage`, `keepsakesHeld`, transcript items)
   + `sanitizeSettings` in `hydrateProfile` + shared-display range clamps +
   NaN-guarded volume setters. Plus the Part-7 tests, plus one new troll-UAT
   payload each. This closes the *entire* known hostile-save surface.
2. **Batch 2 — audio correctness (A-1..A-4):** small. A-1 is two lines;
   A-2/A-3 are the "before T1 activation" gate — fold into Phase 3 of the
   overhaul plan.
3. **Batch 3 — UX polish (U-1..U-9, B-1, B-2):** U-1 and B-1 first (real,
   felt); the rest are trivial sweeps. U-4/E-3/E-6 need owner answers before
   code.

Master plan cross-reference: this document is the "found bugs" record the
2026-08-01 overhaul session asked for; the v2 overhaul plan
(`17-v2-overhaul-plan.md`) Phase 1 should absorb Batch 3, and Phase 3
(voice/music) must absorb Batch 2's A-2/A-3 as activation blockers.
