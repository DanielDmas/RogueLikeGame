# The Vestibule v2 — Overhaul Work Plan

**Branch:** `claude/vestibule-v2-overhaul`
**Base:** `v1.0.0-rc.2-final` (commit `14d07f7`, tagged, on
`claude/philosophical-roguelike-game-zslw5n` — that branch is the stable
release and must not be modified further)

**Date:** 2026-08-01
**Current state:** `tsc` clean, 1262/1262 tests green, both packs
content-complete in en/cs/fa/de/fr, all troll testing complete, all
release blockers resolved, deployed to GitHub Pages.

---

## Purpose of this branch

The stable branch (`claude/philosophical-roguelike-game-zslw5n`) is the
final v1.0.0-rc.2 release candidate. This branch carries everything the
project planned but deliberately deferred — polish, new features, and
deeper rework that would have been inappropriate to squeeze into a
release-candidate stabilization cycle. Nothing here is a bug fix; every
item is an enhancement or a new capability.

---

## PHASE 0 — Extended-review fix batches (added 2026-08-01) — ✅ COMPLETE

**Status: all four batches implemented and verified, all four owner-decision
items ruled on and coded** (same-day continuation, 2026-08-01). See
`13-master-development-plan.md`'s "Extended review fix batches 1-4 +
owner-decision resolution" entry and `18-extended-code-review-2026-08-01.md`'s
"Resolution" section for full detail. `tsc` clean, 1307/1307 tests green,
production build + `verify:isolation` clean, both real behavior changes
(sticky persona Skip, One Door keepsakes) live-verified. Committed
(`efcadfb`) and pushed to `claude/vestibule-v2-overhaul`.

The extended code review (`18-extended-code-review-2026-08-01.md`, two
passes same day) found 4 confirmed hostile-save crash gaps (H-1..H-4), an
unvalidated Settings boundary (S-1), an import-correctness gap (S-2 —
imported profiles silently lose their display settings to the stale
cross-pack shared key), 5 audio findings (A-1..A-4, R2-1 — two of which
are activation blockers for Phase 3's voice/music work), and a set of
UX/boot nits (U-1..U-10, B-1, B-2). The second pass also *cleared* the
content layer by executing both packs' rooms end-to-end: no soft-lock is
possible (every stage keeps ≥1 unconditional choice), no beat/outcome/
available/secret function throws, both evaluators are total, and both
graphs are referentially intact. **These batches now come before
everything below**:

- **Batch 1 (do first):** save/import-boundary hardening round 4 —
  H-1..H-4 + S-1 + S-2, with the review doc's Part-7 tests. Closes the
  entire known hostile-save surface the three prior troll passes were
  chartered to close, plus the import display-settings gap.
- **Batch 2:** audio fixes A-1 (discovery-pulse timer, 2 lines now), A-4,
  and R2-1 (manifest shape guard); A-2/A-3 fold into Phase 3 as
  pre-activation blockers.
- **Batch 3:** U-1 (reread-button steals focus) and B-1 (recovery net
  installs too late) first; U-10 (inert Text-version row in LIMERENCE)
  small and visible; remaining nits opportunistically. U-4 (persona Skip
  re-prompt), E-3 (One Door keepsakes), and E-6 (R4 comment carve-out)
  need owner decisions before code.
- **Batch 4:** promote the round-2 content-invariant sweep (soft-lock +
  beat totality) AND the round-3 runtime checks (Monte Carlo playthrough
  invariants, ending-reachability bound, bundle-isolation grep) into the
  permanent test suite.

**Round 3 (runtime angle, same day)** simulated 9,000 complete
playthroughs through the real engine — zero invariant violations
(termination, no re-offers, act monotonicity, fork discipline, evaluator
totality, downstream Ledger/epiphany/pattern helpers) — proved all 13
endings reachable, audited all 3,257 registered text keys for token
integrity (clean), and ran the full production build with bundle
forensics (cross-pack isolation verified in both directions on the real
minified output). One owner decision surfaced: **R3-1** — LIMERENCE's
`the-armored` ending is far harder than its three axis-extreme siblings
(~22% success under even a perfect strategy vs 87-100%); rebalance or
document intent.

See the review doc for full detail, repro, and fix shapes per finding.

## PHASE 1 — Small remaining polish batch (no new content, no translations) — ✅ COMPLETE except 1.6

These are the leftover items from the review docs that were individually
too small to justify their own session during the rc.2 stabilization, but
collectively represent real polish. Each is independently shippable.

**Status (2026-08-01, same-day continuation):** 1.1-1.5 all done (1.2 and
1.4 were already complete on branch creation; 1.1 and 1.3(c) turned out to
be verification-only — no bug found, no code needed; 1.3(a)/(b) and 1.5
were real small fixes). `tsc` clean, 1309/1309 tests green, production
build + isolation check clean, all four live-browser checks pass. 1.6
deliberately NOT started — it needs new translated content (10 strings ×
5 languages), which this plan's own item explicitly flags as needing its
own pass rather than a drive-by addition to a polish batch, consistent
with CLAUDE.md's standing translation-context rule.

### 1.1 P3 heavy-toggle live re-run
**Status:** ✅ COMPLETE (2026-08-01, same-day continuation) — no bug
found. `tests/uat/67-p3-heavy-toggle-live-rerun.mjs` toggles Light mode
while a LIMERENCE door row's entrance animation is still in flight, then
again as a rapid back-to-back double-toggle, driving the real full-scene
`setThemeMode()` rebuild path under contention; asserts every card
settles visible, the render loop stays alive (`fps()` sane), zero
console/page errors, and doors remain genuinely clickable afterward. All
pass — the P3 fix (`.choice-card.settled`) holds under the heavier
rebuild cost with no new failure mode.

### 1.2 R7 persona-whisper test pack-parameterization
**Status:** ✅ ALREADY COMPLETE — verified on branch creation. The R7
suite in `src/test/i18n.test.ts` (lines 110-187) is already fully
pack-parameterized: both packs × all 5 languages (en/cs/fa/de/fr) × all
4 `{name}` touches + the `{blurb}` echo (`the-archive` for ANAMNESIS,
`the-registry` for LIMERENCE). No work needed.

### 1.3 S5 minor nits — ✅ COMPLETE (2026-08-01, same-day continuation)
**(a)** Softened the language row's description rather than re-rendering
the whole Settings panel live (a much larger change for a one-line nit)
— it now says the panel itself catches up to the new language the next
time it's opened, honest about the real (if minor) felt inconsistency.
Translated into cs/de/fa/fr with the usual context-first pass, live-
verified in both English and Czech with zero console errors.
**(b)** New `SoundEngine.isVoiceEnabled()` getter; `Voiceover.play()`
now checks it before touching `voiceUrl`/the audio element at all —
narration-off now genuinely skips the work instead of relying on the
muted bus to hide it. Covered by a behavioral test (`isVoiceEnabled`
tracks `setVoiceEnabled`) and a source-shape test (the gate runs before
any URL work).
**(c)** Investigated and found already handled: `.overlay` has
`overflow-y: auto` (styles.css), so the whole title screen scrolls as
one unit — no code change needed. Locked in as a permanent regression
check, `tests/uat/68-s5c-title-menu-small-viewport.mjs`, live-verified
at 360×560 (9 buttons today; the last one starts below the fold and
becomes fully visible and clickable after scrolling the overlay).
**Files:** `src/ui/overlays.ts`, `src/audio/soundEngine.ts`,
`src/audio/voiceover.ts`, `src/content/text/{cs,de,fa,fr}.ts`.

### 1.4 S6 deliberate-behavior comment records
**Status:** ✅ COMPLETE — the three-layer overlay Escape priority was
already documented in `overlays.ts` and `fieldNote.ts`. Added the two
missing comments: Escape-saves-in-Settings (overlays.ts:539) and
Skip-clears-persona (overlays.ts:651). No further work needed.

### 1.5 Sconce legibility (B7) — ✅ COMPLETE (2026-08-01, same-day continuation)
Raised `sconceFixture`'s bulb/light height (2.4→2.7), the glow material's
`emissiveIntensity` (1.4→2.0), and the `PointLight`'s intensity/falloff
radius (1.3/5→1.9/6.5) — positions and fixture count unchanged. Live-
verified via screenshot on LIMERENCE's `the-colleague` (Act III, the Long-
Stay Wing): the nearest sconce now reads as a clear warm point of light
against the door frame, versus barely perceptible before. Unit tests
(`phaseVFixtureKit.test.ts`) unaffected — they assert light presence/
quality-gating, not the tuned numeric values.
**Files:** `src/scene/themes.ts`.

### 1.6 Richer interlude (B7, optional)
The act-headline card currently shows only the floor name. The original
I3 sketch imagined a Porter/Usher line and a palette bleed toward the
next floor. Needs new translated content (1 line × 2 packs × 5 langs =
10 strings).
**Files:** `src/engine/flow.ts`, translation files.
**Est.:** medium (because of translations).

---

## PHASE 2 — Third content pack groundwork

### 2.1 `flow.ts` module split
Currently 1,116 lines. The architecture note says "split if a third pack
lands." The fixture kit already made a third pack cheaper; do the split
*before* the pack, not after. Natural seams:
- `flow-title.ts` — title loop, menu rendering, overlay orchestration
- `flow-run.ts` — the in-game run loop, room entry, door offering,
  ending evaluation
- `flow-persist.ts` — persist chain, profile mutation, save/restore
- `flow.ts` — the `Game` class shell, wiring the three together

**Detailed seam analysis (2026-08-01, verified against 1343-line file):**
- Lines 1-68: imports (stay in flow.ts, re-exported as needed)
- Lines 70-97: constants (`PROFILE_ID`, `themeForAct`,
  `INTERLUDE_HOLD_MS`) — stay with the `Game` class
- Lines 99-264: `Game` class declaration, fields, constructor — stays
- Lines 266-294: `jump()` (UAT) — flow-run or flow.ts
- Lines 296-365: helpers (priorFromProfile, keepsakesFromProfile,
  applySettings, tokens, effectiveTypewriter) — stays
- Lines 367-407: persist chain (chainSave, setActMusic, persist) → flow-persist
- Lines 409-500: navigation/utility (reloadPage, navigateToVestibule,
  fade, interlude, resetRun, resetProgress, export/import, lastMessageLabel,
  settingsActions, oneDoorButtonKey) → flow-persist
- Lines 502-579: pause menu + settings-direct → flow-title
- Lines 582-745: `start()` title loop → flow-title
- Lines 747-795: `syncTheme()` (act transition + interlude) → flow-run
- Lines 797-879: `runLoop()` → flow-run
- Lines 884-1131: `enterRoom()` → flow-run
- Lines 1132-1175: `playOneDoor()` → flow-title
- Lines 1177-1343: `playEnding()` → flow-run

The `Game` class is the single hardest part — it's one class with
private fields shared across all methods. The cleanest approach:
keep `Game` as one class in `flow.ts` but extract the bodies of
`start()`, `runLoop()`/`enterRoom()`/`playEnding()`, and the persist
chain into standalone functions that accept a `GameContext` interface,
called from the class methods — this breaks the file into 3-4 files
without splitting the class itself, which would force every private
field to become package-visible.

**Files:** `src/engine/flow.ts` → split.
**Tests:** existing suite must pass unchanged (pure refactor).
**Est.:** medium.

### 2.2 ContentPack type audit for third-pack readiness
Verify every `ContentPack` field has a clear, documented contract. Audit
`packs/types.ts` for any field that's implicitly ANAMNESIS- or
LIMERENCE-shaped. Ensure a hypothetical pack with a different guide name,
different act count, different visual vocabulary, and no light-mode
support could be plugged in without engine changes.

**Preliminary audit notes (2026-08-01, reading `packs/types.ts`):**
- `graph.actPools` is typed `Record<Exclude<ActId, 0 | 4>, string[]>` —
  hardcodes the 3-act-pool structure (acts 1-3 with random pools, act 4
  as a fixed sequence). A pack with 5 acts or 2 acts would need a type
  change.
- `graph.optionalPerAct` is typed `Record<1 | 2 | 3, number>` — same
  3-act assumption.
- `guide.examinedActBarkFallback` is typed `Record<1 | 2 | 3 | 4, ...>`
  — assumes exactly 4 acts.
- `endingRules.axisTriptych` returns exactly 3 axes — but all packs
  have 3 axes, so this is structural.
- Engine-default/pack-override pattern (§3 row 16) on `skin`, `audio`,
  `visuals.doorStyle`: well-documented; all optional fields with
  ANAMNESIS defaults. Clean.
- `advisory?: { ... }` — optional, clean for packs that don't need it.
- `articles`, `keepsakes`, `epiphanies` — all typed as arrays/records,
  no hardcoded ids. Clean.
- `hooks.finalGateId`, `hooks.lastMessageId` — pack-supplied, clean.

**Conclusion:** the fixed 4-act structure is the one genuine rigidity.
It's also the biggest: `storyEngine.ts`'s `offeredDoors()`,
`flow.ts`'s `syncTheme()`/`runLoop()`, `schema.ts`'s `ActId` type, and
the `graph` shape all assume exactly acts 0-4 + understory. For a third
pack that matches this structure (likely — the game's pacing is an
authored constant), no changes needed. For a structurally different
pack, `ActId` becomes `number` and several engine functions generalize.
**Recommendation:** leave as-is until a third pack's structure is known.

**Files:** `src/packs/types.ts`, possibly type-only changes.
**Est.:** small (if same structure) / medium (if different act count).

### 2.3 Third-pack skeleton (if the owner picks a topic)
Create `packs/<pack-id>/` with the same skeleton structure as LIMERENCE.
The four candidate topics are already documented in the master plan
(§Tier 3 item 17): universal life-and-death decisions, modern business
dilemmas, high-stakes CEO/diplomat decisions, criminal/desperation
decisions. **Blocked on the owner choosing a topic.**
**Est.:** large (content authoring).

---

## PHASE 3 — Voice & music activation (T1)

### 3.1 Current state
The architecture is fully shipped and dormant:
- `src/audio/voiceover.ts` — manifest-driven, per-beat playback
- `src/audio/soundEngine.ts` — `musicGain` bus, streaming layer, act-slot
  crossfade over generative fallback
- `scripts/build-voice-manifest.mjs` — scans `public/voice/` and
  `public/music/` → `public/av-manifest.json`
- Settings rows auto-appear when the manifest is non-empty
- Landing page music toggle (wired, `assemble-web-dist.mjs` copies files)
- H3 bug fixed: URLs are document-relative, work on GH Pages and Electron

### 3.2 What's needed
**Only audio files.** Drop into:
```
public/voice/<packId>/<lang>/<key>.mp3
public/music/<packId>/<slot>.mp3
public/music/landing/vestibule.mp3
```
Run `node scripts/build-voice-manifest.mjs`. Done.

### 3.3 Preparation work (can do now, without files)
- ✅ Manifest script verified working (2026-08-01): `node scripts/
  build-voice-manifest.mjs` produces a clean empty manifest with 0/0
  files, correct output path.
- ✅ `public/voice/README.md` and `public/music/README.md` already exist
  with complete naming-convention documentation.
- TODO: Write a smoke test that the voice/music Settings rows appear
  when the manifest has entries and don't appear when it's empty.
- **TODO (2026-08-01 review, activation blockers):** fix A-2 (generative
  motes bypass the `genDuck` bus — they will chime over any file-based
  track) and A-3 (the boot slot's `play()` autoplay rejection is never
  retried on first gesture — title/act-0 file music stays silent until the
  first act change). Both are invisible while no files exist, and both
  break the feature the day files land. See
  `18-extended-code-review-2026-08-01.md` Part 2.

**Blocked on:** owner supplying/recording audio files. The two A-findings
above are the remaining code work; fix them before (or with) file delivery.

---

## PHASE 4 — EN/CS/FA full-playthrough Playwright matrix (item 19)

### 4.1 What it is
The one verification-debt item that's been deferred since the original
review: a real end-to-end playthrough in each of the 3 core languages
(en, cs, fa), confirming that every room renders, every choice resolves,
every field note displays, and every ending fires, with no English
fallback leaking through.

### 4.2 Why it's been deferred
Long Playwright runs conflict with the 3-minute UAT cap. Needs a
re-scoped, split-script approach: one script per act per language (3
langs × ~5 acts = ~15 scripts), each ≤3 minutes.

### 4.3 Design
Each script:
1. Sets locale via profile seeding
2. `jump()`s to each room in the act in sequence
3. Asserts the text panel's content is not English (a simple
   `!englishFallbackDetected()` check against the room's known English
   source text)
4. Advances through all beats, clicks a choice, reads the field note
5. Zero console errors

**Files:** `tests/uat/` (new scripts).
**Est.:** medium-large (many scripts, but each is mechanical).

---

## PHASE 5 — LIMERENCE visual-language rework remainder (Tier 1 item 3)

### 5.1 Already shipped
- Per-floor corridor fixtures (departures board, locker walls, window,
  sconces) via the shared fixture kit
- The migrating window (the creative bible's signature image)
- Per-floor CSS accents in both light and dark modes
- Theme-mode-aware 3D scenes (the "morning read" — V2)
- Door frame hover glow
- All three ambient corridor sub-effects

### 5.2 What remains
**(a) Brighter 3D scene in light mode (the deeper rework).** The V2
"morning read" (fog lift + warmer key) shipped. The owner hasn't asked
for the full "inverted door/environment palette" idea. D1 (the 3D scene
stays dark in both themes) is a reasoned, documented decision. **Do not
build unless the owner explicitly asks.**

**(b) Per-floor dark-mode `--panel-edge` variation.** Currently flat teal
on every floor in dark mode. The `[data-act]` hook exists. Needs its own
WCAG derivation against `#0d1116`. Small.

**(c) Post-processing tuning.** Bloom/vignette/grain currently well-tuned.
Only touch with a specific visual complaint, not speculatively.

**(d) Door-creak sound (item 17 remainder).** Audio, not graphics.
`soundEngine.ts` already has the `doorCreak` infrastructure. Need a
per-pack tuning pass to ensure the creak reads as "hotel" not "dungeon"
in LIMERENCE. Small.

**Est.:** 5.2b is small; 5.2a/c/d are conditional on owner direction.

---

## PHASE 6 — New authored content

### 6.1 T5 — Porter/Usher pattern-barks expansion
**Already shipped:** 6 patterns, fully translated, both packs. The
system is designed for expansion — adding a new `PlayerPatternId` to
`engine/patterns.ts`, writing the detection predicate, and authoring the
prose in both guides is the whole cost.

Candidates for additional patterns (not yet scoped):
- `always-reads-field-notes` — a player who never skips
- `speedrunner` — consistently short transcript length
- `explorer-no-secret` — visited many rooms but never found the secret
- `keepsake-collector` — earned every keepsake across runs

**Blocked on:** owner deciding whether to expand.

### 6.2 Richer field-note articles
**Already shipped:** 2 per pack (4 total). The `articles` infrastructure
and `showRoomArticle` overlay are fully working. Extending coverage is
pure content authoring × translation.

### 6.3 Third content pack (see Phase 2)

---

## PHASE 7 — Mobile investment (Tier 3 item 16)

Decided out of scope for Milestone 5, unrevisited since. Would need:
- Touch controls (tap-to-advance, swipe for doors, pinch-to-zoom)
- Responsive layout for `<768px` viewports (text panel, choice cards,
  overlays, HUD)
- Performance pass for mobile GPUs (the `quality: 'low'` + fpsCap: 30
  defaults help, but mobile thermals are different)
- iOS Safari WebGL quirks audit
- PWA manifest for add-to-home-screen

**Blocked on:** owner deciding to pursue mobile.

---

## PHASE 8 — Commercial-store certification (Tier 3 item 15)

- PEGI/ESRB submission (the in-game age advisory already self-declares
  it's not an official rating)
- Windows code signing for the Electron `.exe`
- macOS notarization if a Mac build is added
- Steam integration (if pursuing that store)

**Blocked on:** a paid release being pursued.

---

## STANDING RULES (carried forward, binding on all work in this branch)

R1-R7 from the master plan (context-first translation, UAT conventions,
agent dispatch discipline, guide-word isolation, Definition of Done,
architecture rules, Experience Charter supremacy) all apply unchanged.

---

## RECOMMENDED WORK ORDER

```
Phase 1 (polish batch)          ← can start immediately, no dependencies
Phase 2.1 (flow.ts split)       ← can start immediately, pure refactor
Phase 2.2 (ContentPack audit)   ← after 2.1
Phase 3.3 (voice/music prep)    ← can start immediately
Phase 4 (Playwright matrix)     ← can start immediately
Phase 5.2b (dark panel-edge)    ← can start immediately, small
```

Everything else is blocked on owner decisions or external input (audio
files, third-pack topic choice, mobile go/no-go, commercial release
decision).

---

## VERIFICATION GATE (before any release from this branch)

1. `tsc --noEmit` clean
2. Full `vitest run` green
3. Full `tests/uat/run-all.mjs` batch pass (all scripts)
4. Production build smoke test (`47-dist-web-deploy-smoke.mjs`)
5. CHANGELOG updated
6. Version bumped appropriately
