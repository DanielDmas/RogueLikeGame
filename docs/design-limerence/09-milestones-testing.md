# Spec 09 — Milestones, Testing, and Acceptance

## 1. Milestones

Implementation starts only on an explicit owner command, milestone by
milestone. Each milestone ends with the ANAMNESIS Definition of Done
applied to this pack: spec conformance → `tsc` clean → `vitest` green →
live `?uat=1` verification with screenshots read → honest UPGRADE_PLAN
entry → commit → push.

- **L0 — this commit.** `docs/design-limerence/` + UPGRADE_PLAN pointer.
  Docs only.
- **L1 — engine/pack split** (spec 08). ANAMNESIS behavior-neutral; both
  packs boot; tests parameterized. *Largest engineering risk; do first,
  alone, with nothing else in the same commits.*
- **L2 — LIMERENCE playable skeleton (EN).** Frame + prologue + Act I
  (7 rooms + gate, spec 02) + endings `the-morning-after` and `the-ghost`
  + the advisory layer (spec 10) + hearts→Trust skin. A complete, short,
  honest game.
- **L3 — Acts II–III** (specs 03–04): 16 rooms, both gates, the secret
  suite, dynamic-beat continuity flags across acts.
- **L4 — Act IV + Records Office + full meta** (specs 05–06): all 7
  endings, keepsakes, epiphanies, Examined Path re-skin, persona
  whispers, hidden-ending eligibility plumbing.
- **L5 — the skin.** Hotel visual identity (palette: sodium-lamp amber,
  corridor teal, neon bleed; floor-by-floor theme builders; the diorama
  set — two phones on one bed, the migrating wall/window, four therapy
  doors, kitchen table under one bulb, basement shelving), Porter figure
  (desk-lamp lantern), audio identity (act progressions in minor-leaning
  keys; room accents: `the-colleague` corridor hum, `the-discovery`
  heartbeat-adjacent low pulse — *subtle*, charter applies), door-bark
  dread pass, README/CHANGELOG, UAT pack matrix.
- **L6 — Czech.** Full content translation per CLAUDE.md's context-first
  rule (the rule applies to every string, UI included). DE/FR/FA only on
  explicit later request.
- **Release:** separate build path (`dist/limerence/`), Pages subpath,
  itch page optional; ANAMNESIS's URL unchanged. Release itself remains
  owner-gated as always.

## 2. Test plan

**Engine (L1):** everything in spec 08 §6, plus: a `packConformance.test.ts`
that validates any `ContentPack` structurally (ids unique, pools ⊂ rooms,
gates exist, optionalPerAct < pool size, endings referenced by
`endingRules.evaluate` exist, keepsake triggers point at real flags, every
`dioramaAccentHooks` entry names a real room+choice) — run against *both*
packs; this is the "third pack someday" insurance.

**Content (L2–L4), per pack via `describe.each`:**
- `contentPipeline` (existing invariants: ≥2 choices, non-empty outcomes,
  hints on non-gate choices, legal reflection traditions).
- `graph` (every run finishes; gates in order; run length; pool
  reachability across seeds; secret rooms appear when unlocked).
- `flagAudit` (every written flag read via `choseIn`/`hasFlag`/keepsake
  trigger/allowlist — LIMERENCE gets its own allowlist entries with
  documented alternate readers).
- `panelLifecycle`, `dioramas`, `audio` (engine-level; unchanged).
- New `povRotation.test.ts` (LIMERENCE-only): per act, assert the roster
  metadata (a `povTag` added to room briefs' implementation) contains ≥2
  rooms where the player is the transgressor — the creative-bible §4 rule
  as CI.
- New `registerRules.test.ts` (LIMERENCE-only): Act I rooms' beats/choices/
  outcomes contain none of a maintained lexicon of explicit terms — a
  coarse but real guard on the charter's hard line (list maintained in the
  test, reviewed by a human each content milestone).
- `endingRules`: unlock predicates unit-tested exactly like
  `anamnesis.test.ts` (eligibility × clarity × exclusion flags matrix).
- Epiphany predicates: one test per epiphany, both firing and non-firing
  profiles.
- `translationCoverage`: wired for LIMERENCE at L6 (same
  extend-when-complete discipline as R4 — never before the content lands).

**UAT (L2+, committed suite):** pack-parameterized via `UAT_PACK`; new
scripts: `14-limerence-smoke` (title → prologue → first room, Trust HUD
renders open-hand icon), `15-advisory-layer` (advisory appears once,
persists dismissed), `16-panel-stacking` equivalents run against the
LIMERENCE pack (regression class already guarded engine-side). Each script
single-`withPage`, <3 min (CLAUDE.md).

## 3. Content-authoring acceptance checklist (every room, L2–L4)

- [ ] Matches its spec brief (or the spec is updated in the same commit —
      specs track reality).
- [ ] POV tag implemented; culpability-rotation rule per act holds.
- [ ] Every choice genuinely tempting from inside (charter: no strawmen);
      hint present; effects within calibration bands.
- [ ] `explanation` present per stage, jargon-free, one everyday analogy.
- [ ] Field note passes spec 07 rules (contested→critique, soft numbers,
      no diagnosis of the player).
- [ ] Act I register check (non-explicit lexicon test green + human read).
- [ ] Dynamic beats' branch logic mirrored in any future translation files
      (the cs-dynamic.ts lesson, pre-learned).
- [ ] Reflections authored for significant DILEMMA choices; gaps
      deliberate and noted.

## 4. Open questions for the owner (before L1 starts)

1. Root URL: keep serving ANAMNESIS at the current Pages root with
   LIMERENCE at `/limerence/`, or move both under subpaths?
2. LIMERENCE title-screen age note wording: "16+" vs. "mature themes"
   phrasing (charter default drafted in spec 10; owner may tune).
3. Whether L2 ships publicly as an early demo or stays branch-only until
   L4 completeness.
