# Document 11 — Production Review: Spec-Completeness & Release-Readiness Audit

**Date:** 2026-07-06 · **Reviewer:** senior production review pass (no code
changed) · **Audited at:** commit `4daa92b` (M5 phases S1, K, L, M, N shipped;
O partial; P, Q, R, S2–S5 open; 371 tests green, `tsc` clean)

**Purpose.** Verify that ANAMNESIS's specification set (README, CLAUDE.md,
UPGRADE_PLAN.md, docs/development 01–10) is complete enough for continued
AI-assisted development through production release of `v0.2.0-beta`, and to
name — concretely — everything missing, ambiguous, risky, or underspecified.
This is a review document: findings and decisions, **not** implementation.
Action items extracted from it live as checkboxes in `UPGRADE_PLAN.md`
(items **R8–R11**, **S6–S7**, and the Phase O release gate).

A deliberate note on scope: the classic "is the concept buildable?" questions
are largely moot — the game **is built** and has shipped two public betas.
This review therefore reads each question as "is this *documented and
enforced* well enough that a fresh developer agent cannot silently break it,
and is it *hardened* well enough to ship v0.2.0?" Where the honest answer is
"the code is right but the rule lives nowhere," that is recorded as a gap:
in an AI-assisted project, **an unwritten rule is an un-rule** — the next
session doesn't inherit good behavior, only written constraints and tests.

---

## Part A — Area-by-area audit

### A1. Product definition — **SOLID, three gaps**

**What the game is** is well-defined and consistently stated: a 2.5D
philosophical roguelike; the player's dissolved self is filed into rooms;
each room stages a real philosophical situation; choices re-collect or
dissolve; the way back is through (README logline, charter, prologue's own
field note). **Player fantasy:** walking real dilemmas without being graded;
being *witnessed* rather than scored. **Emotional promise:** hushed,
contemplative, "the loudest thing in the game is a heart breaking" (charter
§1.2). **Mechanical promise:** state-accumulation choices, replay-driven
discovery (pools, secrets, prior-run mirrors, a hidden ending).

**Scope for v0.2.0-beta** is explicit: phases K–S per the specs. **Explicitly
out of scope** (owner decisions on record): mobile, replay/daily modes,
multiplayer, monetization, cloud saves; DE/FR may slip to M6. **MVP:** moot —
already shipped as `v0.1.5-v2-beta`.

**What would make it feel unfinished (concrete, current):**

1. **The Examined Path half-authored.** Acts II–IV have no reflections. An
   opted-in player gets commentary in Act I and then silence — which reads as
   *broken*, not minimal, because the opt-in panel promises commentary "after
   each significant choice." → **Release gate:** v0.2.0 does not ship until
   Acts II–IV DILEMMA/INSIGHT reflections are authored (or, strictly worse,
   the offer copy is weakened — not recommended; finish the authoring).
2. **Stale public README.** Root `README.md` says *20 rooms*, *six endings*,
   "a run visits ~15 of the 20 rooms," omits Act V/the new rooms entirely,
   and instructs releasing by pushing a tag — which the plan records as
   failing with 403 in this environment (the proven path is
   `workflow_dispatch` with a `tag_name` input). First thing a new player or
   contributor reads is wrong on four counts. → R11.
3. **No stated target session length or content note.** Nothing anywhere
   says how long a run should take (needed as the pacing yardstick for the
   troll test and Q's animation budget) or acknowledges the game's heavy
   themes (a dying grandmother, choosing to "lie down and let the dissolving
   finish") for the eventual Pages/store listing. Neither is code; both are
   one paragraph each. → fold into R11 (README refresh) and S4 (feel-pass
   criteria).

### A2. Core loop & gameplay structure — **SOLID, one gap**

Fully implemented and test-enforced. For the record, the canonical loop:
title → (first-run auto "Before you begin" → persona → Examined Path offer)
→ prologue → per act I–III: pool rooms (3/3/2 of 7/8/8) + gate → act IV fixed
sequence (+ optional understory descent for returning travelers) → ending
evaluation → end screen → codex / walk again. One room: beats → choice →
effects applied + persisted → outcome beats → (reflection card) → field note
→ codex unlock → `completeRoom`. Between rooms: door offer =
pool − visited, shuffled by `doorSeed` hash. Persists across rooms:
`RunState`. Across runs: `Profile` (codex, endings, keepsakes + counters,
prior-run mirror, lastMessage, persona, settings). A run ends at
`door-that-asks` or at 0 hearts — and **dissolution is an ending, not a fail
screen** (a design invariant the difficulty guardrail tests enforce; graph
tests prove every run terminates at exactly 15 rooms).

**Gap:** the lucidity economy has no single tuning table. Thresholds are
named constants but scattered (`introduction` secret gate ≥100, `the-cave`
conditions, `ANAMNESIS_LUCIDITY` 140, `PUNCHLINE_LUCIDITY` 220), and per-room
awards were tuned by feel. Fine today; the moment Phase Q/R rebalances
anything, a one-page "lucidity economy" table (source amounts per room type,
all consuming thresholds) should be written *first*. → noted as a Phase R
engine-health sub-task, not a new phase.

### A3. Game state & data model — **STRONG, three real gaps**

Single sources of truth are clean and documented in-code: `RunState` (the
run), `Profile` (meta-progression), `Settings` (prefs), content files
(static). Every mirror is deliberate and commented (`prior`, `keepsakesHeld`,
`examined` stamped once at `newRun`; `anamnesisEligible` recomputed at the
final door). Static content never carries runtime state. Save = one
localStorage key behind the async `SaveStore` interface. Legacy-save
migration = spread-merge over `defaultProfile()` plus bespoke migrations
(`migrateSettings`, `shouldGrandfatherHasSeenAbout`) — all tested.

**Gaps (all three are save-integrity, all three are cheap):**

1. **No `schemaVersion` on the Profile.** Spread-merge handles *added*
   fields; it cannot handle a *renamed* or *semantically changed* field —
   there is no version number to branch a migration on. One integer field +
   a written rule ("bump when meaning changes, write a migration, add a
   fixture test") closes this forever. → R8.
2. **Corruption = silent total wipe.** `LocalSaveStore.load()`'s `catch`
   returns `defaultProfile()` — a player with 30 field notes and 6 endings
   whose JSON gets truncated loses everything *without even being told*.
   Fix shape (spec'd in R8): keep the previous good payload under a
   `:backup` key on every successful load; on parse failure, restore from
   backup; only if both fail, default — and say so, once, quietly, on the
   title screen.
3. **No player-side export/import.** No way to back up progress, move it
   between the web and Electron builds, or attach it to a bug report. The
   unreproduced save report from this milestone (mid-review item 8) would
   likely have been solved in minutes with the player's actual profile JSON.
   Two buttons in Settings → Data. → R9.

Also noted, accepted as-is: **multi-tab last-write-wins** (two open tabs each
hold an in-memory Profile; the loser's writes vanish). Real but rare and
self-inflicted; documenting it as an accepted risk beats engineering a tab
lock. Recorded here as the official decision.

### A4. Narrative & branching structure — **SOLID, two gaps**

The branching model is the project's quiet masterstroke and should be named
in the docs as a binding rule, because it is *why* 33 rooms with hidden
state remain manageable: **choices are state accumulation, never tree
forks.** Rooms are self-contained scenes; consequences travel only through
axes/flags/lucidity/hearts; cross-room references read state *defensively*
(dynamic beats with tested empty-prior fallbacks). Endings are mutually
exclusive by an explicit, test-pinned priority order. Hidden variables (the
axes) are deliberate and disclosed in category, not number. Philosophical
meaning is expressed mechanically on three layers: lucidity rewards honest
engagement (not any morality — charter), field notes teach after the fact,
reflections (Phase O) argue in plural without a verdict.

**Gaps:**

1. **No canonical flag registry.** Flags are string literals scattered
   across room files. The planned dead-flag audit (R6) should not be a
   one-off: extend it into a *generated* registry test — collect every
   `effects.flags` entry and every `hasFlag`/`choseIn` reader, assert the
   sets match (allowlist for intentional one-way flags). Then the registry
   *is* the test and can't rot. → absorbed into R6's wording (plan updated).
2. **Citation accuracy was never audited.** Field notes and ending notes
   make dozens of factual attributions ("Weil died at 34…", Rilke's dragons
   line presented quotation-adjacent, "Pascal, inventor of probability
   theory"). For a game whose entire trust proposition is *teaching real
   philosophy honestly*, one misattributed quote is a disproportionate
   credibility wound — and philosophical paraphrase-as-quote is precisely
   the kind of error AI authoring makes fluently. A dedicated pass:
   verify every named claim; soften anything unverifiable into honest
   paraphrase ("Rilke's image of…"). → **R10, new.**

### A5. Room system / content pipeline — **SOLID; one boundary to write down**

The room schema is complete and battle-tested (9 rooms added in Phase K with
zero engine changes — the pipeline's proof). Authoring a room = 1 content
file + pool entry + icon + i18n; the TypeScript compiler is the content
linter and the completeness tests (translation coverage, icon coverage,
reachability) are the CI. **Deliberate anti-recommendation:** do **not**
build a no-code/JSON/CMS room pipeline. At ≤50 rooms, TS-files-as-content
with `tsc` as validator is strictly better than a bespoke loader + schema
validator that would itself need tests. The real scalability bound is the
**translation fan-out** (~5 files touched per room); acceptable at current
scale, and the R3 quality-audit pass will measure whether that judgment
holds. What *should* be written down (docs/development/README conventions):
"content files may import **pure predicates only** from the engine
(`hasFlag`, `choseIn`, unlock functions) — never anything with side effects,
never ui/scene" — currently true everywhere, enforced nowhere.

### A6. The Usher — **SOLID; document the invariant**

The Usher is narrative flavor *plus* a small, rule-governed system: door
barks selected by state (axis extremes, one heart, high lucidity, run count,
understory fork, one-time explainers), persona whispers via `{name}`/
`{blurb}` tokens, and exactly one mechanical touchpoint (`usher-respect`
gating the punchline ending). His tone is governed by the charter (voice
rules) and the owner's standing constraint (enigmatic; no backstory; halo
and horns the same size on purpose). What's intentionally inconsistent —
God on odd days, Devil on even — is itself consistent.

**Gap (small):** the invariant that keeps him from silently becoming a
mechanic is unwritten: **"the Usher reads state; he never changes it."**
(Everything he says is informational; he never alters odds, effects, or
availability — `usher-respect` is set by a *player* choice, merely named
after him.) One sentence in the charter prevents a future feature from
breaking this by accident. → added to the plan note under R6/engine health.

### A7. UI / UX / presentation — **SOLID under the charter; accessibility ambition undefined**

The presentation contract is unusually well specified for an indie project:
WebGL diorama scene + DOM overlay for all text (crisp, zoomable, RTL-capable),
charter-pinned pacing (2.5 s Usher walk, skippable >800 ms animations),
comfort settings that every new panel must obey (reducedMotion, typewriter,
highContrast, uiZoom to 130 % at 1280×720, RTL, quality low), "doors are the
game" attention rule, one-interaction dismissal. Feedback loops exist for
every state change that matters (hearts animate + one-time explainer,
autosave toast at checkpoints only, remembered-room fast-read mode).

**Gaps:**

1. **Error/warning surfaces don't exist at all** — there is no error state
   in the entire UI. That's not minimalism; it's a softlock generator (see
   A13). → S6.
2. **Accessibility ambition is undecided, not merely unimplemented.**
   Keyboard play is ~complete de facto (1–9, Space/Enter, Esc, F) but tab
   order/focus states were never audited; screen-reader support is a few
   aria labels. The honest move is to *decide and write down* the target:
   recommended — "fully keyboard playable (audited); SR: correct roles/labels
   on interactive elements, full narration out of scope." The colorblind/
   readability audit (M4 leftover I9) should be scheduled into Q's visual
   pass or explicitly re-deferred to M6 — currently it dangles unscheduled,
   which is the one state the plan's own rules disallow. → folded into Q
   checklist note + R11 README statement.
3. **1280×720 @ 130 % zoom is the implicit floor** (charter layout sweep).
   Make it the *explicit* supported minimum in README. → R11.

### A8. Technical architecture — **GOOD; name the god-object rule**

Layering is clean and the dependency direction is right: `content` (data +
schema + pure predicates) ← `engine` (logic, persistence interface) ←
`ui`/`scene`/`audio` (presentation), tests in `src/test`, Electron shell
isolated in `electron/`. The `SaveStore` interface genuinely isolates
persistence (a server could drop in). Data-driven where it should be (rooms,
endings, barks, translations, icons); code where data would be worse
(predicates, dynamic beats).

**The one structural debt: `Game` (flow.ts, 705 lines) is the accretion
point.** Six features in a row landed logic there (keepsake earning,
anamnesis eligibility, examined offers/asides/cards, persist chaining, uat
handle, auto-About). The mitigation pattern is already proven — every piece
of *logic* got extracted into a pure, tested helper, and `Game` keeps only
orchestration — but the rule is unwritten. Write it (docs README
conventions): **"No new subsystem logic inline in `Game`. Pure helper module
+ tests first; `Game` calls it. If `enterRoom` must grow again, extract a
RoomController first."** Also record the known import knot as accepted:
rooms importing engine predicates is fine *because* they're pure; the
`content ⇄ engine` type cycle (schema lives in content) is tolerated by the
bundler and not worth a restructuring milestone.

### A9. Production workflow — **PROVEN in practice, undocumented on paper**

The de-facto per-feature Definition of Done has been applied six phases
running and has caught real bugs every single time:

> spec conformance → `tsc` clean → full vitest green → live `?uat=1` browser
> verification (screenshots, read them) → honest UPGRADE_PLAN entry
> (checkbox + what actually shipped + any deviation) → one-phase commit →
> push.

And the de-facto release DoD is spec 09 S2–S5. **Neither is written as a
rule.** Codify both in `docs/development/README.md` (§ conventions) so a
fresh agent inherits them. Also fix that README's status line — it still
says *"Nothing here is implemented"* while 6 of 10 specs are shipped; a
zero-context agent reading it would re-plan work that's done. Milestone
gating already exists and works (S-phases; "no new phase while the previous
entry is dishonest"). → R11 + docs README edit.

### A10. Testing & validation — **STRONG unit layer; the UAT layer is ephemeral**

371 tests across 31 files, with the right shapes: simulation (every run
terminates, gates in order), invariant pinning (ending priority, difficulty
guardrails), hard-guarantee/no-op proofs (keepsakes' bit-identical baseline;
examined path's provable silence when declined — **this pattern is the
project's best AI-risk control and must be required for Phase P**: the
Ledger must ship with a proof it is read-only over existing state),
migration fixtures, i18n completeness, and now exhaustive save scenarios.

**The gap, and it's the biggest process gap in the project: every Playwright
UAT script ever written lives in the session scratchpad and is destroyed
when the container recycles.** Spec 09 S2 plans committed scripts; none are
committed. Consequence today: all "live-verified ✓" claims in the plan are
true but **non-reproducible** — the next agent must rewrite verification
from scratch, and *will* re-hit solved problems (the persona-panel
interception, the jump() act-IV backfill, the reload-before-jump profile
staleness — each was rediscovered at least once this milestone). → **S7,
new:** commit a `tests/uat/` set (title/onboarding+auto-About,
save/reload/continue, examined path, keepsakes+shelf, anamnesis) with a
README (run instructions, 3-minute budget each per CLAUDE.md) and fix the
`jump()` Act-IV `visited` backfill (mid-review item 7) as part of it.
Per-release test bill (S5): full vitest + tsc + committed UAT set + charter
feel-pass + one Electron boot smoke + one real-v0.1.5-profile migration
fixture.

### A11. Save/load & persistence — **works; hardening spec'd (see A3)**

Format: JSON, one key, spread-merge migrations — adequate *with* R8's
version int + backup. Serialization hygiene is already right: `RunState` is
JSON-pure (no DOM/Three/function refs; dynamic beats resolve at render, the
transcript snapshots effects data). Resume correctness is covered from every
region of the game (saveScenarios). The remaining written rule to add:
**"never rename or re-type a Profile/RunState field without bumping
schemaVersion and adding a fixture test with a captured pre-change payload"**
— and capture a real `v0.1.5-v2-beta` profile blob as the first committed
fixture *now*, while one is easy to produce. → R8.

### A12. Debugging & developer tools — **good foundation; two additions, one explicit refusal**

`?uat=1` (state/jump/doorRects/fps, gated handle, 4× speed) has proven
itself as the backbone of every verification this milestone. Additions
worth their cost: the `jump()` backfill fix (S7) and profile export/import
(R9 — it is simultaneously the player backup tool, the bug-repro tool, and
the support channel: "send me your profile"). Logging stays `console` —
right-sized. **Telemetry and crash reporting: none, ever, as an explicit
decision** — the game is offline, private, and makes zero network calls;
that is a feature (and simplifies the Pages CSP). Recording the decision
here so the absence reads as chosen, not forgotten.

### A13. Performance / stability / release readiness — **two real softlock classes, both unhandled**

Performance posture is healthy: 60 fps cap + render pause, quality tier,
render-scale tiers, parametric-only assets, Q7's planned `renderer.info`
soak test for the diorama swaps. The genuine stability gaps (verified: no
handler exists for either):

1. **Any uncaught exception during the run loop softlocks the game
   silently.** One throwing dynamic beat on a weird resumed state = frozen
   screen, no message, player force-quits. The architecture makes recovery
   *cheap and safe*: the profile is always persisted at the last checkpoint
   (that's the persist cadence's whole design), so a global
   `error`/`unhandledrejection` handler can show one in-fiction recovery
   overlay — *"The facility flickers. Your file is safe."* — with a
   return-to-title action, and lose nothing. → **S6, new.**
2. **WebGL context loss** (GPU reset, driver update, laptop dock/undock) =
   permanent black canvas with a live DOM on top. Same recovery overlay,
   triggered from `webglcontextlost`. → S6.

Packaging: Electron portable exe is proven via `workflow_dispatch`; Pages
deploy is specified (R1) and should carry the "no external requests" CSP
statement. Release-blocker checklist consolidated under S5 (plan updated):
S6/S7 done, R8 backup live, README refreshed, CHANGELOG started, migration
fixture green, feel-pass signed.

### A14. AI-assisted development risks — **the project's controls are real; keep them, write the last two down**

This project has unusually concrete evidence about AI failure modes,
because it hit — and caught — four of them this milestone: literal
context-free translation (→ binding CLAUDE.md rule), a wrong persistence
assumption (phantom run — caught by an audit the owner requested), a
near-destructive `git stash` (caught immediately), and silent spec deviation
(non-italic margin hints — caught by a review pass). The controls that
demonstrably work, now to be treated as process, not habit:

- **Task size:** one phase per session; specs written to zero-context depth.
- **Owner constraints encoded as tests**, not prose (keepsakes' bit-identical
  guarantee, examined path's no-op proof) — constraints then survive every
  future context loss.
- **Separate review passes** at a different effort level (the mid-milestone
  review found 9 items the implementing sessions missed).
- **Honest-plan discipline:** checkboxes only with evidence; deviations
  amended inline.
- **Tightly-specified zones** (touch only with the spec open):
  `evaluateEnding` order, `persist`/`persistChain`, migrations and profile
  keys, translation packs, graph pool math, anything under `engine/save*`.
- **Never unattended:** destructive git, release publishing, save-key
  changes, plan-checkbox flipping.
- **Two hallucination surfaces specific to this game:** philosophy
  citations (→ R10 audit) and tests that assert the mock rather than the
  behavior — spot-check new suites by mentally reverting the feature and
  confirming the test would fail.

### A15. Completion & shipping — **mapped to v0.2.0**

- **Alpha (internal):** O finished (Acts II–IV reflections) + P + S6/S7
  hardening. Everything below this line is content-complete.
- **Beta:** + Q (visual/audio) + R1–R3 (Pages, Electron polish, cs/fa
  audit) + R8–R11 + committed UAT set green.
- **RC:** S2–S4 (verification debt, traceability matrix, regression +
  owner feel-pass), zero known softlocks, real-v0.1.5-profile migration
  fixture green, README/CHANGELOG current.
- **Launch:** S5 — exe + first Pages deploy + release notes.
- **Post-launch:** profile-import as the support/repro channel; the
  unreproduced-save-report capture instructions (mid-review item 8) stay in
  the plan; changelog discipline per release. Documentation set of record:
  README (player+dev), CLAUDE.md (agent rules), UPGRADE_PLAN (living
  tracker), docs/development 01–11, CHANGELOG.md (new — backfill one line
  per released version from git history).

---

## Part B — Required summary sections

### B1. Missing or unclear items

1. Examined Path content: Acts II–IV reflections unauthored while the
   opt-in panel promises full coverage — **release-gating**.
2. No `schemaVersion` on the save format; migrations un-branchable on
   renames/semantic changes.
3. Save corruption silently wipes all progress; no backup copy, no notice.
4. No profile export/import (player backup, cross-build transfer, bug repro).
5. No global error boundary; any uncaught exception softlocks silently.
6. No WebGL context-loss handling; black-canvas softlock.
7. UAT/Playwright scripts exist only in the ephemeral scratchpad — all
   live-verification is non-reproducible; spec 09 S2's committed set absent.
8. `jump()` into Act IV doesn't backfill `visited` (blocks clean UAT
   scripting; mid-review item 7, still open).
9. Root README stale: 20 rooms/six endings/missing Act V/broken release
   instructions (tag push 403s; real path is workflow_dispatch).
10. docs/development/README status line falsely says nothing is implemented.
11. No CHANGELOG.md / release-notes process.
12. Field-note/ending citation accuracy never verified (misquote risk in a
    game whose value proposition is honest philosophy).
13. Definition of Done (feature and release) practiced but written nowhere.
14. Flag registry: dead-flag audit (R6) is one-off, not self-enforcing.
15. Accessibility ambition undecided (keyboard audit, SR scope, colorblind
    audit I9 dangling unscheduled); minimum resolution floor implicit.
16. No target session-length statement; no content-sensitivity note for
    listings.
17. Lucidity economy has no single tuning table (needed before any
    rebalance, not before).
18. Usher invariant ("reads state, never changes it") unwritten.
19. "Content may import pure predicates only" boundary unwritten.
20. `Game` god-object growth rule unwritten (extraction pattern is proven
    but optional in practice).

### B2. Assumptions currently being made (now explicit)

1. One profile per install (`traveler`); no profile switching — accepted.
2. localStorage is a sufficient store for web + Electron; no cloud, no
   server — accepted (SaveStore interface keeps the door open).
3. Multi-tab web play is rare; last-write-wins clobber accepted (documented
   here as the decision).
4. English is the source of truth; cs/fa derive from it; v1 English is a
   frozen voice except mechanically load-bearing content.
5. Desktop web + Windows Electron only; 1280×720 @ ≤130 % zoom floor.
6. No telemetry/analytics/crash reporting, ever — privacy as a feature.
7. Content scale stays ≤ ~50 rooms; TS-as-content remains the right
   pipeline at that bound.
8. The player is an adult or mature reader; themes (death, dissolution,
   suicide-adjacent imagery handled gently) are in-bounds without a rating
   system, but deserve one sentence of honesty in listings.
9. Electron shell stays a thin wrapper (no native modules, no auto-update).
10. AI agents implement one phase per session under the written specs; the
    owner reviews via the plan and periodic review passes.
11. All randomness that matters is seeded/deterministic (`doorSeed`,
    hash-picks); the only unseeded randomness is cosmetic (reflection row
    shuffle) — keep it that way.
12. `dist/` in the repo is build output, never hand-edited (worth
    confirming it's gitignored — flagged for R11's housekeeping).

### B3. Risks / failure points, by severity

**HIGH**
- Silent save wipe on corruption (total progress loss, no recourse) — R8.
- Uncaught-exception softlock with no recovery UI — S6.
- Shipping v0.2.0 with the Examined Path half-authored — Phase O gate.
- Non-reproducible verification (scratchpad UAT) — S7; this is also the
  main *process* risk for AI-assisted regression.

**MEDIUM**
- WebGL context loss softlock (rarer than exceptions, same blast radius) — S6.
- No schemaVersion → a future rename bricks or silently corrupts old saves — R8.
- Citation inaccuracies in field notes (credibility, not stability) — R10.
- Stale README/docs status misleading players and zero-context agents — R11.
- cs/fa retranslation audit (R3) is large (~every registered string);
  underestimating it compresses Q/S at the end of the milestone.
- `Game` class accretion — mitigated by the extraction pattern; becomes
  high only if the written rule (B4.9) is ignored.

**LOW**
- Multi-tab clobber (accepted); `endingsTotal` hardcode (noted in
  mid-review item 4); About-screen "six endings" post-discovery (item 3);
  italic-hint spec deviation (item 2); "twenty rooms" Punchline nit (R5);
  keyboard/SR audit depth; missing CHANGELOG (process, quickly repaid);
  lucidity tuning table (only matters when rebalancing).

### B4. Recommended spec additions (each weighed; rejected ones listed below)

1. **[R8] Save integrity:** `Profile.schemaVersion` int + `:backup` key
   (previous good payload kept on each successful load; restore on parse
   failure; quiet one-time title notice if restored) + committed real
   v0.1.5 profile fixture + the "never rename without version bump +
   fixture" rule.
2. **[R9] Profile export/import** in Settings → Data (JSON download /
   paste-import with confirm; doubles as support/repro channel).
3. **[R10] Citation-accuracy audit** of all field notes + ending notes:
   verify every named attribution; soften unverifiable items to honest
   paraphrase. EN first, then propagate to cs/fa within the R3 pass.
4. **[R11] Documentation refresh:** root README (30+3 rooms, endings
   display rule honored — say "six endings, and rumors", fix release
   procedure, Act V, session-length + content note, min-spec line,
   `dist/` gitignore check) + docs/development README status line +
   **CHANGELOG.md** backfilled per release.
5. **[S6] Recovery overlay:** global `error`/`unhandledrejection` +
   `webglcontextlost` handler → in-fiction "the facility flickers" panel →
   return to title (safe by persist-cadence design). Charter-compliant
   (calm, one interaction).
6. **[S7] Committed UAT suite** under `tests/uat/` (five stable scripts +
   README, 3-min budgets) + `jump()` Act-IV `visited` backfill.
7. **[Phase O gate]** v0.2.0 requires Acts II–IV reflections authored
   (EN+CS+FA), enforced by extending the partial-authoring test from
   "no mixed room" to "every DILEMMA/INSIGHT room authored" *at release*
   (keep it as a skipped/marked test until then, so the gate is visible).
8. **[docs README] Definition of Done** (feature + release), verbatim from
   A9, as binding convention.
9. **[docs README] Architecture rules:** content imports pure predicates
   only; no new subsystem logic inline in `Game` (pure helper + tests
   first); the Usher reads state, never changes it; persistence only via
   `SaveStore`; cosmetic-only unseeded randomness.
10. **[R6 wording] Flag registry as a generated test** (writers set ==
    readers set, with an explicit allowlist), not a one-off audit.
11. **[Q checklist] Fold I9** (colorblind/readability) into Q's visual pass
    or re-defer it explicitly to M6 — no dangling state.

**Considered and rejected (do not add):** a no-code/CMS content pipeline
(tsc *is* the linter; YAGNI ≤50 rooms); telemetry/crash reporting (privacy
is a feature); cloud saves/accounts (SaveStore keeps the option open at zero
cost); save encryption (localStorage is user-owned data, obfuscation adds
support pain for nothing); a Game-class refactor milestone (rule + pattern
suffice); tab-locking for multi-tab (accepted risk); DE/FR before M6
(owner-ranked lowest); achievements/popups of any kind (charter forbids);
difficulty settings (dissolution-as-ending *is* the difficulty design).

### B5. Recommended build order (from commit `4daa92b`)

1. **Finish Phase O** — author Acts II–IV reflections (EN+CS+FA), flip the
   release-gate test on.
2. **Hardening batch** — S6 (recovery overlay), S7 (committed UAT +
   jump backfill), R8 (version+backup+fixture), R9 (export/import). Small,
   independent, and everything after ships on top of them.
3. **Phase P** — Ledger & Epiphanies, with a keepsakes-style read-only
   hard-guarantee test as a requirement, not an option.
4. **Phase Q** — visual/audio overhaul (+ I9 resolution, soak test).
5. **Phase R** — R1 Pages, R2 Electron polish, R3 cs/fa context audit
   (large — schedule honestly), R5–R7, R10 citations, R11 docs/CHANGELOG.
6. **Phase S** — S2–S5 verification debt, traceability, feel-pass, release
   `v0.2.0-beta` (exe + first Pages deploy).

### B6. Questions for the developer (only the ones that change work)

1. **Save safety:** confirm R8+R9 as spec'd (backup key + export/import) —
   or is silent reset genuinely acceptable to you? (Strong recommendation:
   confirm.)
2. **Citations:** may R10 soften unverifiable quotes into paraphrase, or do
   you want flagged items returned to you for case-by-case decisions?
3. **Session length:** what should a first run take? (Working assumption
   for pacing/troll-test criteria: 30–45 min first run, 15–25 min replays.
   Confirm or correct.)
4. **v0.2.0 gate:** is Q (visual/audio overhaul) a hard requirement for the
   release, or may v0.2.0 ship after P+R+S with Q as v0.2.1? (Plan currently
   implies hard; confirming enables honest scheduling.)
5. **Telemetry:** confirm "none, ever" as the recorded decision.
6. **Accessibility scope:** approve the recommended target ("fully keyboard
   playable, audited; SR labels correct; full narration out of scope") or
   set a different bar.

### B7. Final verdict

**Ready with gaps.** The concept is coherent, the architecture is sound, the
core loop is complete, test discipline is genuinely strong, and — unusually —
the owner's experiential constraints are encoded as executable tests rather
than wishes. Nothing found here questions the design. The gaps are of two
kinds, both closable without redesign: **resilience** (save integrity,
error recovery, context loss — items a solo playtest never surfaces and a
public release always does) and **process durability** (unwritten rules,
ephemeral verification, stale public docs — the specific failure modes of
AI-assisted development, where anything not written down or tested is
re-derived, differently, next session). Close R8/R9/S6/S7, finish Phase O's
authoring, keep the plan honest, and this ships.
