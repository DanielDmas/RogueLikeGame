# The Vestibule — Development History, Chaptered

> **Baseline document 5 of 5.** This is the narrative history of how the game
> was built — the whole arc of development, sorted into chapters, recording
> *what was decided, when, and why*. It is reconstructed from the version
> history (`CHANGELOG.md`), the git commit log, the numbered development docs
> (`docs/development/01`–`18`), the task ledger, and the working sessions'
> own notes. It exists so that a future maintainer inherits not just the
> code but the *reasoning* — every non-obvious decision here was made for a
> reason that is easy to lose and expensive to rediscover.
>
> Dates are the ones recorded in the repository. The project moved fast:
> the bulk of the arc below spans roughly **2026-07-04 to 2026-08-01**.
> Companions: 01 (game), 02 (technical), 03 (future), 04 (experience).

---

## The standing brief (the through-line of every chapter)

One owner instruction governs the entire project, restated across every
milestone and eventually codified as the binding **Experience Charter**
(`docs/development/10-experience-charter.md`):

> *"The game has to be beautiful and enjoyable. Perfect. Simply make sure
> people enjoy the game. View it from the position of the player. The playing
> flow must be natural, it must keep the interest of the player. It cannot be
> boring."*

Everything below is downstream of that sentence. Where any spec conflicted
with the charter, the charter won, and the conflict was reported to the
owner. Two other standing rules recur throughout: **translate every string
in context, never literally** (the CLAUDE.md rule), and **the doors are the
game — nothing may compete with the door screen.**

---

## Chapter 1 — The core game (v0.1.0, 2026-07-04)

The first release established ANAMNESIS's foundation and, crucially, its
architecture: **content is pure data, the engine never hardcodes a room.**
That single decision — made at the very start — is what made everything
afterward possible, including a second title.

Shipped in v0.1.0: the prologue plus 20 authored rooms across four acts, six
endings, the three hidden alignment axes, field notes with a persistent
Codex, generative procedural audio (no audio files — parametric only), an SVG
icon system, and Electron packaging with an automated Windows EXE release
workflow. The stack was set here and never changed: Vite + TypeScript +
Three.js, DOM overlay for text, WebGL for scene, no framework, no downloaded
assets.

---

## Chapter 2 — Internationalization, persona, and hardening (Milestone 4, v0.1.5-v2-beta, 2026-07-05)

Milestone 4 turned a single-language game into a genuinely localized one and
hardened the save system. Decisions made here that still shape the game:

- **Two English text voices.** ANAMNESIS gained an original **v1** voice and
  a rewritten **v2** voice, selectable in Settings — a decision that later
  informed the pack seam (LIMERENCE, designed later, ships v2 only). This is
  why the translation system carries a `version` dimension alongside
  `language`.
- **Full Czech and Farsi translations** (both voices), with Farsi's
  right-to-left mirroring and its own font — establishing the RTL discipline
  every later panel had to honor.
- **The persona system** — an optional player name/blurb woven into select
  lines via `{name}`/`{blurb}` tokens. Deliberately cosmetic, no mechanical
  effect.
- **Dynamic scenery moods** per act; the **Settings expansion** (reduced
  motion, high contrast, typewriter, renderer quality tier); **save-integrity
  hardening** (backup-on-corruption, profile export/import). The "your save is
  yours, lives only in the browser, exportable as JSON" stance was set here.

---

## Chapter 3 — The great expansion (Milestone 5, ANAMNESIS, 2026-07-05 → 07-09)

Milestone 5 was the largest single body of ANAMNESIS work, executed
phase-by-phase (the git log reads `Phase K`, `Phase L`, `Phase M`…). It added
almost every "deep" system the game now has. Each was designed first as a
numbered spec (`docs/development/01`–`10`) and then built. Key additions and
the decisions behind them:

- **New rooms and a hidden Act V** (spec 01, 02): Buridan's queue, the
  reference letter, the Chinese Room, Newcomb's annex, the veil of ignorance,
  Mary's Room, the butterfly's dream, the swampman, a **secret room**, and the
  optional **Understory** (the archive, the unchosen, the echo). Design rule
  set here: *the Understory staircase must feel found, not offered* — violet
  styling, no explanation, one oblique Usher line, and skipping it must cost
  nothing visible.
- **The seventh ending** ("Anamnesis," spec 03): hidden, discoverable from
  inside the game alone via three margin-notes plus completionism. Decision:
  when it fires, *restraint* — the facility gets brighter and plainer, not
  grander; the Usher says "Ah." and nothing else.
- **Keepsakes** (spec 04): small optional mementos carried between runs.
  Decision: *a player who never notices them loses nothing and is never told
  they're missing something* — the `✧` is the entire advertisement.
  Spoiler-safe rule: you can never earn-and-spend a keepsake in one run.
- **The Examined Path** (spec 05): an opt-in mode adding plural ethical
  readings. Decision: *the reflections must disagree with each other* often
  enough that no tradition reads as the house view — an editorial acceptance
  criterion checked by reading, not code.
- **The Ledger and Epiphanies** (spec 06): cross-run history + quiet earned
  observations. Decision: *stats phrased in the game's voice, epiphanies are
  past-tense observations not badges — earning one changes nothing but a line
  of text.*
- **Room dioramas + audio deepening** (spec 07): backdrops, not sets;
  *if a diorama is noticeable while reading a beat, it is too loud.*
- **Platform & engine health** (spec 08): the GitHub Pages deploy, Electron
  window-state memory + single-instance lock, a generated dead-flag audit
  test, a content-pipeline validation test, a **citation-accuracy pass over
  every field note** (a real editorial commitment: the cited philosophy must
  be *correct*), and the **`?uat=1` test mode** with its `window.__anamnesisUat`
  handle.
- **The Experience Charter** (spec 10) was written here and declared
  **binding** — the single most consequential documentation decision in the
  project. It is what every later review measures against.

The mid-milestone review also fixed a class of subtle bugs (Escape/fullscreen
guards, first-playthrough onboarding order, a phantom-run fix) and, notably,
**wrote down the translation-context rule** for the first time — the rule that
Czech and Farsi must "read as written, not translated," which every later
translation pass was held to.

---

## Chapter 4 — The birth of The Vestibule: one engine, two titles (2026-07-09, v0.2.4-beta)

This is the architectural climax of the project. The engine was split into a
**content-agnostic core plus per-title content packs** — the `ContentPack`
interface (`src/packs/types.ts`). The migration was executed in careful,
behavior-neutral steps (git: `L1.1`…`L1.6`): move the schema and text
resolver into `src/engine/`, introduce the `ContentPack` type, assemble
`packs/anamnesis/` from the existing content, thread the pack through the
`Game` constructor / flow / scene / UI / storage-namespacing, parameterize
the tests over both packs, and prove the two-pack seam boots. **ANAMNESIS was
kept unchanged and behavior-neutral throughout** — a hard constraint, so the
refactor could never be blamed for a regression.

Then **LIMERENCE was built on top of the seam**: a full second title about
relationships at their breaking points, guided by the Night Porter, designed
first as its own ten-document spec set (`docs/design-limerence/`, drawing on
Gottman, Glass, Perel, attachment theory, and CNM research, cited honestly).
It shipped content-complete — all four floors, the secret room, the Records
Office, all 7 endings, all 4 keepsakes with earn+spend rooms — with its own
visual identity (sodium-amber/corridor-teal hotel palette, an optional
light/dark toggle, thinner steel-dark modern doors, asymmetric panels), its
own minor-leaning generative score resolving to a held major chord, and its
own onboarding **advisory** (the content-warning layer, spec 10 §2).

Two collection-level decisions landed here: the name **"The Vestibule"** for
the two-game bundle, and a **rozcestník (chooser page)** at the site root
linking to both titles, each buildable as its own independent production
bundle.

Also decided here: **LIMERENCE's Czech scope** — it too would reach full
translation parity, not remain English-only. (At v0.2.4 its own 12 epiphanies
were still generic ANAMNESIS lines — a known open gap, closed shortly after.)

---

## Chapter 5 — The final-release review and the cross-pack blockers (v1.0.0-rc.1, 2026-07-13)

A diligent pre-release review of the whole package
(`docs/development/12-final-release-review.md`) found the class of bug the
pack seam is most prone to: **cross-pack leaks**, where shared engine code
silently used ANAMNESIS's rules for LIMERENCE. Two were **release-blocking
crashes**:

- LIMERENCE's hearts-death ending was hardcoded to ANAMNESIS's `dissolved`
  id, throwing the moment any LIMERENCE run reached 0 hearts. Fixed by routing
  through `pack.endingRules.evaluate`.
- LIMERENCE's Records Office was **unreachable** because its fork was gated on
  ANAMNESIS's `'boulder'` room id. Fixed by using `graph.act4Sequence[0]`.

Four more leaks were fixed (the Porter's voice styling never being consumed;
a scripted quiet-ending path that guaranteed the hearts crash; the Ledger's
endings/keepsake denominators; the codex's synthetic last-message note). This
review permanently shaped the project's discipline: **every cross-pack-family
fix now ships with a pack-parameterized test**, and the isolation invariant is
guarded at multiple levels.

Also in rc.1: engine hardening (the persist chain no longer permanently
poisoned by one failed write; scene materials disposed on every act change;
Escape closes every overlay), three audio glitch fixes (tab-hidden suspend,
crossfade-click ramp, master compressor), and the **GPU-safe defaults
decision** — new profiles start at low quality / performance scale / 30 fps,
with "Cinematic" as an explicit opt-in rather than the unconfigurable start.
The dormant **voice/music architecture** (F2/F3) shipped here too, along with
the "Exit to The Vestibule" button and in-room back/reread navigation.

---

## Chapter 6 — The visual overhaul: Phase V and diorama parity (v1.0.0-rc.2, 2026-07-14 → 07-16)

The visual-quality pass. **Full diorama parity**: every room in both games got
its own bespoke diorama (ANAMNESIS closed a 12-room gap to 33/33; LIMERENCE
was already 34/34), and dioramas were made bigger and closer. The **Phase V
LIMERENCE visual rework** introduced a standardized, reusable environmental
**fixture kit** in the shared engine (migrating end window, departures board,
locker-band walls, wall sconces, city skyline), configured per hotel floor as
data — so a *future* pack inherits the same toolkit. The Top Floor adopted
ANAMNESIS's proven dawn-gradient shader; light mode learned to lift the whole
3D scene toward a "morning after" read; per-floor accent colors landed in both
themes (WCAG-verified); an end-of-act interlude card and ambient effects (a
distant phone light, door frame-glow on hover) shipped.

Also: **fullscreen stability** across every navigation (a real live-reported
bug, fixed and covered by real-browser tests against the production
artifact); **persistent Settings access** from the landing page and HUD;
**shared display settings** between the two titles; and a batch of engine
hardening (single-bundle pack loading, save-import validation, a WebAudio LFO
leak fix, `documentElement.lang`/aria-live fixes).

The version was deliberately held at **rc.2, not 1.0.0** — an honesty
decision: too much had accumulated since rc.1 without an owner playtest of the
combined result to honestly call it "final."

---

## Chapter 7 — Game-experience reviews and the Czech/Farsi quality re-review (2026-07-19 → 07-20 and after)

Two full game-experience reviews (`docs/development/15-game-experience-review.md`,
`16-full-review-2026-07-20.md`) examined the game from the player's chair and
produced batches of experience fixes: the mid-room resume experience (the
guide now acknowledges when you left a room mid-thought), end-screen options
and keepsake visibility, onboarding-stack ordering (the Examined-Path-offer
deferral on a first-ever run, so three modals never stack before the first
beat), and numerous small correctness/a11y items.

Then the long-deferred **Czech/Farsi literal-translation quality re-review**
was finally done as its own dedicated multi-session pass (the CLAUDE.md rule
had always forbidden doing it opportunistically) — both packs, every act,
reflections, endings, epiphanies, and UI chrome re-read against native
register and corrected. This closed the single most substantial
genuinely-open engineering-adjacent item from the whole project to that point.

Around here also: **read-more long-form articles** (2 per pack), the
**cross-room choice-aftermath echoes** work (LIMERENCE had ~12; ANAMNESIS got
2 added, with the design rule that echoes should target gate rooms referencing
earlier pool-room choices), and an **expanded codebase map**
(`docs/development/14-codebase-map.md`) capturing the game's actual content
and the hard-won UAT gotchas.

---

## Chapter 8 — Cross-run recognition: the guide remembers you (pattern barks, 2026-07)

A new engine (`src/engine/patterns.ts`) was built to detect cross-run patterns
from the profile, and both packs authored **recognition barks** (in all five
languages) so the Usher/Porter visibly *knows you* across runs — remarking at
a door on the shape of how you keep playing, in place of a generic
returning-player wink. Threaded through the `ContentPack.guide.doorBark`
signature (which gained an optional `pattern` parameter, deliberately optional
so a future pack can opt out rather than author six more lines).

---

## Chapter 9 — The troll-test hardening rounds (adversarial saves, 2026-07-26 →)

A deliberate adversarial pass: *what happens if a player edits their save?*
`localStorage` is devtools-editable and profiles import as files, so the save
boundary is the one genuinely untrusted input. A "troll test" pass probed
hostile-but-valid-JSON payloads and **found 10 real crashes** (e.g.
`{"act": 99}` reaching an undefined door pool; `{"visited": null}` reaching a
`.every`). The response established the layered save-boundary defense now in
place: `isStructurallyValidRun` (shape-only, zero-import, discard-not-repair),
`hydrateProfile`'s coerce-not-reject for profile fields, `sanitizeSettings`
whitelisting every Settings field, and `asTranscript` guarding hostile
`prior.transcript` data. A separate live probe found that a hostile
`prior.transcript` could crash via the real **Continue** button (not via the
UAT `jump()`, which re-derives `prior` fresh) — a methodology lesson recorded
in the plan. Permanent adversarial-save UAT scripts were committed so the
whole class can never silently regress. Three rounds of this ran (in-game
troll, hostile-saves, import-path, Unicode-persona).

---

## Chapter 10 — The extended code review (three rounds, 2026-07-26 → 2026-08-01)

A rigorous, multi-angle review under the owner's instruction to "make it
ultimate… it needs to be a perfect game to be then released. Challenge your
assumptions. Verify all." Three escalating passes, recorded in
`docs/development/18-extended-code-review-2026-08-01.md`:

- **Round 1** — an extended code review found 4 confirmed hostile-save crash
  gaps (H-1…H-4), an unvalidated Settings boundary (S-1), an import-correctness
  gap (S-2), 5 audio findings (A-1…A-4, R2-1), and a set of UX/boot nits
  (U-1…U-10, B-1, B-2).
- **Round 2** — *cleared the content layer by execution*: both packs' rooms
  run end-to-end, no soft-lock is possible (every stage keeps ≥1 unconditional
  choice), no beat/outcome function throws, both evaluators are total, both
  graphs referentially intact. 4 new findings surfaced.
- **Round 3** — a *runtime interrogation*: a **9,000-run Monte Carlo
  simulation** through the real engine (zero invariant violations —
  termination, no re-offers, act monotonicity, fork discipline, evaluator
  totality, downstream helpers), an ending-reachability proof for all 13
  endings, a full 3,257-key token audit (clean), and **bundle forensics** on
  the real minified output (cross-pack isolation verified both directions).
  The one balance finding: **`the-armored` (LIMERENCE) is far harder to reach
  than its three sibling axis-extreme endings** (~22% success under even a
  perfect strategy vs 87–100%) — surfaced as an owner decision (R3-1).

---

## Chapter 11 — The v2 overhaul, Phase 0: implementation of the review (2026-08-01)

The owner said: *"build now, code and fix everything needed. go step by step.
don't rush, it can take multiple sessions. retest all."* A new branch,
`claude/vestibule-v2-overhaul`, was created, and the review findings were
implemented in four batches:

- **Batch 1 — save/import-boundary hardening** (H-1…H-4, S-1, S-2): the
  `asTranscript` item-filter, the validator extensions (transcript items,
  `currentStage`, `keepsakesHeld`), `sanitizeSettings` in `hydrateProfile`,
  shared-display range clamps, NaN-guarded volume setters, and the import path
  writing the shared display key. This closed the *entire* known hostile-save
  surface.
- **Batch 2 — audio correctness** (A-1…A-4, R2-1): the hidden-tab timer
  cleanup, mote routing through the `genDuck` bus (so file music can silence
  the generative bed), the gesture-retry for paused file music, NaN-guarded
  volume setters, and a validated voice-manifest shape guard.
- **Batch 3 — UX/boot fixes** (U-1, U-2, U-3, U-6, U-7, U-8, U-9, B-1, B-2):
  correct choice-screen focus, disabled no-op Register/Codex cards, Escape on
  the persona panel, consistent title-loop persist behavior, the crash
  recovery net installed *before* the async pack import, and an isolated
  backup-write try/catch. (U-5, the persona-blurb i18n drift, was deliberately
  deferred as needing a schema decision.)
- **Batch 4 — permanent regression tests**: the review's exploratory sweeps
  were *promoted into CI* — `contentInvariants.test.ts` (soft-lock + beat
  totality + a scaled-down Monte Carlo harness + an ending-reachability
  tripwire) and `scripts/verify-pack-isolation.mjs` (the bundle cross-pack-leak
  grep), the latter wired into the Pages deploy after `build:web`.

Then all **four owner-decision items were resolved and coded** (rather than
left open, following the "fix everything needed" instruction):

- **U-4 (persona Skip re-prompt):** ruled *make it sticky.* A new additive
  `Profile.personaOffered` flag; the editor now gates on "has it ever been
  shown," not "is a name present." Skip is honored forever.
- **E-3 (One Door hides keepsake choices):** ruled *pass them through.*
  `playOneDoor` now threads the player's held keepsakes, consistent with the
  "you carry them always" framing.
- **E-6 (R4 comment carve-out):** ruled *amend R4.* The guide-vocabulary rule
  now explicitly permits a comment that names the other pack's word
  specifically to warn against using it (the registered-string rule stays
  absolute).
- **R3-1 (`the-armored` difficulty):** ruled *document intent, don't
  rebalance.* It is meant to be the hardest non-hidden ending; the reasoning
  is now in the evaluator itself, backed by the Batch 4 reachability tripwire.

Result: `tsc` clean, **1,307/1,307 tests green**, build + isolation clean,
both behavior changes live-verified in a real browser. Committed and pushed.

---

## Chapter 12 — The v2 overhaul, Phase 1 & 3.3: polish and close-out (2026-08-01)

On "continue, commit after testing," the small, safe, unblocked remainder of
the v2 overhaul plan was worked:

- **Phase 1.1 (P3 heavy-toggle re-verify):** since Phase V made the light/dark
  toggle a *full scene rebuild*, the old stale-paint check was re-run under
  the heavier path (toggling mid-animation, rapid double-toggle). **No bug
  found**; locked in as a permanent UAT script.
- **Phase 1.3 (S5 nits):** the Settings language-row description softened to
  honestly say the panel updates on next open (translated in 4 languages,
  live-verified); `Voiceover.play()` now gates on a new
  `SoundEngine.isVoiceEnabled()` before doing any work; the "buttons stack
  tall on small viewports" concern was investigated and found *already
  handled* by `.overlay`'s `overflow-y: auto` — no code, just a new regression
  test.
- **Phase 1.5 (sconce legibility):** the Long-Stay Wing's wall sconces raised
  in height and intensity so the nearest reads clearly at the door-viewing
  framing; live-verified via screenshot.
- **Phase 3.3 (voice/music prep close-out):** the two "activation blocker"
  TODOs turned out to be *already fixed* in Batch 2 (a stale doc reference);
  the one genuine remaining item — a smoke test that the narration Settings
  rows stay gated until the manifest has files — was written. T1 (voice/music)
  is now blocked *only* on the owner supplying audio files, zero code left.

Result: `tsc` clean, **1,311/1,311 tests green**, build + isolation clean,
four live-browser UAT checks pass. Phase 0, Phase 1, and Phase 3.3 all
committed and pushed. The remaining plan is either large creative work
(LIMERENCE visual rework, authored barks/echoes, a third pack), owner-blocked
(audio files, a pack topic), or a risky refactor best deferred until a third
pack lands (`flow.ts` split) — so work paused here for an owner steer.

---

## Chapter 13 — This documentation baseline (2026-08-01)

The owner asked for five exhaustive documents to serve as an expanded baseline
for a future AI or human who will extend the game: (01) the complete game
description and current state, (02) the technical architecture and repository
state, (03) the possible future updates, (04) the total gameplay experience,
and (05) this development history. They live in `docs/baseline/`, cross-linked,
each verified against the live source rather than remembered.

---

## Appendix A — Version & milestone timeline

| Version | Date | What it was |
|---|---|---|
| v0.1.0 | 2026-07-04 | Initial release: core ANAMNESIS, 20 rooms, 6 endings, Codex, Electron. |
| v0.1.5-v2-beta | 2026-07-05 | Milestone 4: cs/fa translations, v1/v2 voices, persona, save hardening. |
| v0.2.4-beta | 2026-07-09 | Milestone 5 complete + the engine/pack split + LIMERENCE joins → **The Vestibule**. |
| v1.0.0-rc.1 | 2026-07-13 | Final-release review: cross-pack blockers fixed, GPU-safe defaults, dormant voice/music. |
| v1.0.0-rc.2 | 2026-07-16 | Diorama parity, Phase V visual rework, fullscreen stability, shared settings. |
| *(rc.2, ongoing)* | 2026-07-19 → 08-01 | Experience reviews, cs/fa quality pass, pattern barks, troll-test hardening, the extended code review, and the v2 overhaul (Phase 0/1/3.3). |

## Appendix B — The recurring decisions, in one place

The decisions a future maintainer is most likely to want to *understand
rather than relitigate*:

- **The guides stay enigmatic.** No Usher/Porter backstory, no additional
  characters. The Porter's wedding-band tell is resolved only by a hidden
  ending, and that is the ceiling.
- **No gamification.** No achievement popups, confetti, or red dots. Guest
  stamps (quiet, in the Ledger) are the sanctioned alternative.
- **Endings are trades, not verdicts.** Hearts-to-zero is an *authored
  ending*, never a fail screen.
- **The doors are the game.** Nothing competes with the door screen for
  attention.
- **Silent GPU-safe default over a first-run choice card.** Two Settings
  clicks reach Cinematic; a modal before the first beat violates the quiet-UI
  rule.
- **No ANAMNESIS light theme.** The single dark tone is authored, not a gap.
- **Everything integrates into the one game** — no separate replay/museum/NG+
  modes; One Door is the single sanctioned exception, and it is minimal.
- **Discard, never repair, a broken save-run.** A plausible-but-invented state
  is worse for the player than a clean fresh run.
- **`the-armored` is the hardest non-hidden ending by design** — reachable but
  demanding, documented in the evaluator and pinned by a reachability test.
- **Translate in context, always, as its own pass** — never a literal calque,
  never opportunistically mid-feature.

---

*Baseline document 5 of 5 · reconstructed from `CHANGELOG.md`, the git log,
`docs/development/01`–`18`, and the task ledger, on branch
`claude/vestibule-v2-overhaul` at version `1.0.0-rc.2`. Companion documents:
01 (game), 02 (technical), 03 (future), 04 (experience).*
