# 04 — Engine, data contracts and deterministic branching

## 1. Architecture decision

Create a **separate, small TypeScript decision engine** under src/verdict/ (exact naming can follow current conventions). Do NOT force the new game into existing ContentPack, RunState, Game.runLoop, heart/lucidity, gate system or Three.js SceneDirector. The existing engine is optimized for multi-act roguelikes, whereas THE VERDICT is a direct-link, mobile-first decision microgame.

Reuse existing libraries/patterns only when objectively helpful: Vite/TypeScript/Vitest, pure state transitions, isolated persistence, responsive DOM, semantic buttons, optional procedural audio. Do not add React or a larger framework just to render six screens unless a documented trade-off convincingly outweighs the added complexity. Vanilla TS is a valid default and matches the repository.

## 2. Phase-machine model

Ripple states:

    OPEN -> FIRST_CHOICE -> REACTION -> REVEAL -> SECOND_CHOICE
         -> OUTCOME -> PREDICTION_OR_SKIP -> COMPARISON_OR_SKIP -> COMPLETE

Quick states:

    OPEN -> FIRST_CHOICE -> OUTCOME
         -> PREDICTION_OR_SKIP -> COMPARISON_OR_SKIP -> COMPLETE

Pure reducer actions:

    START_EPISODE(episodeId, contentVersion)
    COMMIT_FIRST(choiceId)
    ACK_REACTION
    REVEAL_NEW_FACT
    COMMIT_SECOND(choiceId)
    SHOW_OUTCOME
    SAVE_PREDICTION(choiceId) | SKIP_PREDICTION
    VIEW_COMPARISON | SKIP_COMPARISON
    FINISH
    REPLAY(newLocalRunId)

Reject invalid transitions, repeated commits and unknown IDs. Input is untrusted, including localStorage and URL data. Render phase state derived from a single immutable state object, not a collection of independently controlled booleans.

## 3. Suggested data types (conceptual, refine in TypeScript)

    type ApproachId = "A" | "B" | "C";
    type Format = "quick" | "ripple";
    type TextBlock = { heading?: string; body: string };
    type Option = { id: ApproachId; label: string; support?: string };
    type Immediate = { event: string; effects: Record<string, number | string | boolean> };
    type Resolution = {
      headline: string;
      immediateEcho: string;
      outcome: string;
      tradeoff: string;
      facts: Record<string, number | string>;
    };

    type SharedEpisode = {
      id: string;                 // stable public id, e.g. "cabin-200"
      slug: string;               // stable public URL slug
      contentVersion: number;     // changes when scenario meaning changes
      title: string;
      hook: string;               // share meta description
      topic: string[];
      durationSeconds: number;
      setup: TextBlock[];
      initialOptions: [Option, Option, Option];
      firstReactions: Record<ApproachId, Immediate>;
      endings: Record<ApproachId, Resolution>;  // base outcome by final stance
      firstChoiceEchoes: Record<ApproachId, string>;
      pathOverrides?: Partial<Record<ApproachId, Partial<Record<ApproachId, Partial<Resolution>>>>>;
    };

    type RippleEpisode = SharedEpisode & {
      format: "ripple";
      twist: TextBlock[];
      secondOptions: Record<ApproachId, [Option, Option, Option]>;
    };

    type QuickEpisode = SharedEpisode & {
      format: "quick";
      twist?: never;
      secondOptions?: never;
    };

    type Episode = RippleEpisode | QuickEpisode;

This is a contract **proposal**, not a demand to paste directly. For Quick, one choice is the final stance. For Ripple, the final stance is selected in the second round; first-choice echoes and pair overrides carry committed consequences. Adapt structure to make all nine routes meaningful **without** copy-pasting 9 full narratives. When a route needs a genuinely unique outcome, a per-pair override is appropriate.

**Important:** The three first and second approaches must share a comparable semantic ID *within a scenario*. This makes changed-approach rate = firstId !== secondId meaningful. Do not compare arbitrary first/second actions merely because each round has three options.

## 4. Domain state and invariants

Suggested runtime state fields:

    episodeId, contentVersion, localRunId,
    phase, firstChoiceId?, secondChoiceId?, predictionId?,
    committedEffects, stepHistory, startedAt?, completedAt?,
    localVoteStatus: "not-consented" | "pending" | "submitted" | "declined",
    revealSeen, outcomeSeen

- Content is immutable for a published version; old versions must not silently change meaning after votes are recorded.
- Apply first effects **once** when COMMIT_FIRST succeeds; persist atomically before any animation. Reload must re-render, not reapply.
- Final outcome = outcomeResolver(episode, firstChoiceId, secondChoiceId). It is a deterministic, pure function.
- For Quick, initial choice doubles as final choice and no artificial second step is inserted.
- Scenario-specific numeric invariants (such as €800 in cabin) are expressed as pure validated functions or tables; don't rely on prose alone.
- The original first choice can be *revisited as history*, not reset within the same run.
- A “try other path” creates a new local run. Only the first eligible completed vote per episode per browser may be submitted (server remains authoritative).

## 5. Suggested code-level file layout

    src/verdict/
      main.ts
      engine/
        types.ts
        reducer.ts
        outcomeResolver.ts
        validateScenario.ts
        save.ts
      content/
        index.ts
        cabin200.ts
        unfairPromotion.ts
        aiShortcut.ts
      ui/
        App.ts
        ScenarioView.ts
        ChoiceCard.ts
        ReactionView.ts
        RevealView.ts
        OutcomeView.ts
        ComparisonView.ts
      styles/
        tokens.css
        verdict.css
      social/
        resultsClient.ts
        votingTypes.ts
      utils/
        share.ts
        routes.ts
    verdict/
      index.html
      episodes/cabin-200/index.html
      episodes/unfair-promotion/index.html
      episodes/ai-shortcut/index.html
    scripts/
      (build additions; preserve existing pack output)
    src/test/
      verdict*.test.ts

Keep modules small; avoid a giant Game class for a two-minute narrative. UI components may be plain functions managing DOM elements; adding a UI framework is an explicit design decision, not a default.

## 6. Scenario validation at build/test time

- Stable unique id and slug; positive integer contentVersion.
- Quick requires exactly 2–4 initial choices (if type supports variable counts); Ripple launch episodes require exactly 3 initial and 3 follow-up approaches.
- Every first option has a committed reaction/effect; every second option exists for every initial choice.
- Every possible path resolves to a nonempty, noncontradictory outcome.
- No unknown choice IDs or missing translation keys in future locales.
- Sanitize scenario-derived HTML or, preferably, render content as text with safe structured formatting; no unsanitized innerHTML.
- Numeric checks: the cabin ledger balances to €800 for paid/owed states, without double-counting reimbursements.
- Repeat reducer events do not alter state.
- Old persisted state with incompatible schema/episode version fails closed to a gentle “New version available, restart” action.

## 7. Local persistence and versioning

Use a new namespaced localStorage key (for example, **the-verdict:v1:progress**) and optionally a separate settings key; do not import old pack profiles or alter existing save migrations.

Save only what the client needs: episode, version, committed choices, phase and completion. Avoid storing full personal explanations, contact information or IP-derived identifiers. Export/import can wait. Corrupt data should be rejected safely without crashing. The local vote receipt can prevent casual accidental double submission; never claim that browser-only uniqueness is proof of one human.

## 8. Server boundary

No backend in Phase 1. Design a narrow async interface:

    getPublicResults(episodeId, version): Promise<Results | Unavailable>
    optInSubmitVote(episodeId, version, first, final, consent): Promise<SubmissionResult>

No web access or runtime model is necessary for the story. The backend never determines endings or controls whether an episode can finish. If the API is unavailable, play/replay/share all work.

## 9. Determinism and test fixtures

For each of three episodes, generate all 3x3 permutations. Snapshot the **structured outcome fields**, not pixels. Assert that results contain both first-choice impact and final strategy. For Quick tests assert no twist/second choice is shown. Add state-machine transition table tests, invalid input tests and save/reload tests.

A small development-only scenario explorer (choose episode, stage, first/final IDs; inspect state/outcome) is a worthwhile early investment. It lets the owner author and QA stories without rebuilding the whole application for each route.

## 10. Anti-complexity rule

Before introducing a library, state abstraction or backend feature, ask whether one episode can be built with 3–5 small pure modules and a few DOM views. If yes, keep it simple. No generic “visual narrative scripting platform” in v1.
