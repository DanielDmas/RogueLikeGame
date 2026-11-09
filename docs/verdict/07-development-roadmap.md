# 07 — Implementation roadmap / ordered tickets and Definition of Done

This is a **phased plan**, not a request to write every feature at once. Implement one small, reviewable batch, run tests, then continue. Existing titles are protected regression surfaces throughout.

## Release strategy

**Vertical slice first:** one exceptional episode, one beautiful warm UI, one deterministic engine. Then two more stories and Quick format. Then privacy-respecting social comparison. Then publish / share. Duel is a later expansion.

Estimated effort: Phase 1 may take ~15–30 focused hours, full public release roughly ~40–80+ hours depending on design iteration, authoring and test depth. These are planning ranges, not delivery commitments. A polished title is the target; cut scope before compromising feel.

### P0 — Baseline, architecture spike and creative lock

Tasks:
- [ ] Checkout this branch and read VERDICT_PLAN.md and docs/verdict/00–09, plus root CLAUDE.md.
- [ ] Inspect the actual repository head, scripts and test setup. Record npm ci / npm test / npm run build:web outcomes before any edits.
- [ ] Confirm Verdict build strategy (separate Vite config/entry, or a simpler equivalent); prove two old pack outputs still work.
- [ ] Write final first-episode script and nine pair-specific result notes, consistent with 03-episode-bible.
- [ ] Sketch mobile and desktop opening/outcome screens with palette/tokens from 02.
- [ ] Audit tracked .env without exposing values; record secret remediation if needed.
- [ ] Record implementation decisions/changes to this plan in a short ADR, rather than silently varying from approval.

**DoD:** regression baseline documented, new entry architecture selected, user-level 001 content approved, no existing runtime changes beyond justified build wiring.

### P1 — Beautiful Episode 001 vertical slice (no backend)

Tasks:
- [ ] Create Verdict app entry and scoped CSS design tokens, mobile-first layout.
- [ ] Create minimal TS scenario schema and validation.
- [ ] Implement pure finite-state reducer and outcome composition.
- [ ] Author 001 with three first choices, immediate reaction, common twist, three context-aware final strategies and 9 coherent endings.
- [ ] Add illustrated reservation/receipt that reacts to first-choice and final decision.
- [ ] Add lightweight, pleasant motion (with reduced-motion mode), choice keyboard support and focus management.
- [ ] Persist/resume independently under Verdict namespace; handle corrupt/stale saves safely.
- [ ] Add replay, next scenario placeholder and spoiler-free share link.
- [ ] Add dev-only scenario explorer to inspect all nine outcomes quickly.
- [ ] Test 9 routes, reducer invalid transitions/idempotency, reload, mobile/keyboard.
- [ ] Run old tests + builds and compare legacy output paths.

**DoD:** from a cold direct link a player can complete 001 on a 360px phone in ~2 minutes, see a materially different result for each initial/final combination, and replay without bugs. Attractive enough for a public screenshot. No live results, mock votes, account or runtime LLM.

### P2 — Episode anthology + Quick Dilemma

Tasks:
- [ ] Author 002 The Unfair Promotion (not ANAMNESIS's existing promotion sabotage story) and 003 The AI Shortcut according to 03.
- [ ] Implement unique scene affordances and at least one visually distinctive consequence for each.
- [ ] Implement Quick format through existing components; add one short bonus Quick scenario or a deliberately adapted independent story without corrupting Ripple's original story.
- [ ] Build Verdict hub with three main episode cards and quick mode entry.
- [ ] Implement stable episode IDs, contentVersion and deep links; confirm direct refresh works on GitHub Pages.
- [ ] Add optional “Guess the crowd” UI **only when real results exists**; before API show disabled or explain upcoming feature, no fake majority.
- [ ] Add author credit, collection navigation and compact About.
- [ ] Complete 9x3 matrix test and copy/visual QA; optimize assets and touch behavior.

**DoD:** three author-approved Ripple episodes, at least one meaningful Quick play, all deep links resolve without server fallback, independent states and scoped style; no backend requirement.

### P3 — Consent-based community results

Tasks:
- [ ] Select minimal backend/provider, estimate costs and define privacy notice.
- [ ] Server-side manifest of valid scenario versions/option IDs and POST vote input validation.
- [ ] Idempotency/rate limits and minimal retention/logging policy. No fingerprinting.
- [ ] Aggregate GET endpoint with first/final distributions and transition matrix; honest n.
- [ ] Explicit opt-in submit after completed episode. Nonparticipants can keep playing.
- [ ] “Guess the crowd” before revealing aggregate results; tie and low-sample handling.
- [ ] Integrate offline/error/retry states; no fake vote numbers.
- [ ] Document deletion limitations of strictly anonymous votes.
- [ ] Test abuse, version mismatch, downtime and concurrent requests.

**DoD:** real results only, valid sample counts, consent gate, reliable play when service unavailable, explicit owner privacy approval.

### P4 — Public LinkedIn-ready release

Tasks:
- [ ] Add third tile to Vestibule landing while preserving ANAMNESIS/LIMERENCE routes.
- [ ] Extend build:web and Pages deployment for /verdict and direct static episode URLs; ensure correct Open Graph metadata / share previews.
- [ ] End-to-end mobile and desktop accessibility, performance, contrast, reduced-motion, readability and keyboard QA.
- [ ] Publish tasteful author credit, product description and contact/link.
- [ ] Add spoiler-free sharing: copy-link, native share where supported, end screen invite.
- [ ] Run full existing regression suite, build and smoke tests for all three titles.
- [ ] Get human cold-start tests on real devices, fix actual friction.
- [ ] Prepare 15–25 second screen recording concept and LinkedIn copy; do not assume reach.

**DoD:** public browser release that a stranger can understand, enjoy and share; site appears native and inviting; previous games unchanged and deployment stable.

### P5 — Asynchronous Decision Duel (post-launch)

Tasks:
- [ ] Introduce one-to-one challenge links for matching scenario versions.
- [ ] Complete second player independently; hide first player's selections until recipient completes.
- [ ] Show compare screen and friendly debate prompt; no chat/login/matchmaking.
- [ ] Validate payload/version/URL length/privacy; optional server token only if justified.
- [ ] Test spoilers, link tampering, replay and non-matching versions.

**DoD:** frictionless “I chose X; what did you choose?” game between friends with no presence system.

## Ticket execution protocol

Before coding each phase: identify exact touched files, acceptance tests and anticipated risks. After: list actual files touched, tests run and outcomes, design deviations, remaining blockers. If blocked, report rather than quietly changing requirements.

**Phase boundaries:** P0/P1 are authorized first coding work; do not build the backend without P3 privacy approval, or Duel before core launch. Avoid giant “complete all phases” agent sessions.

## Change hygiene

- New files under src/verdict/ and verdict/ where possible.
- Existing src/engine, src/packs, src/scene, legacy CSS and old saves are off-limits unless justified with targeted tests.
- Changes to package scripts, assembly, landing, CI are narrowly scoped and regression-tested.
- Never silently delete failing tests, weaken accessibility criteria, alter old titles to fit the new one, or modify personal creative copy without review.
- Use small commits with descriptive phase/ticket subjects. Branch from the plan branch for coding, or continue on it with commits; do not merge into default without owner approval.

## Priority when scope gets tight

1. A beautifully playable, satisfying 001.
2. Correct deterministic branching / resilience.
3. Two other genuinely good authored scenarios.
4. Direct-link sharing, clean mobile presentation.
5. Real results with privacy.
6. Quick mode expansion and Duel.

Never compromise (1) to add an optional backend feature.
