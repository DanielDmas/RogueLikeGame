# Specification 06 — The Traveler's Ledger & Epiphanies (Phase P)

## 1. Purpose & player experience

A single quiet screen where the player's whole history with the facility is
visible: how many descents, which doors they favor, what they have witnessed.
Plus **Epiphanies** — understated one-line milestones in the game's own hushed
voice. Owner's choice: "Ledger + quiet 'Epiphanies'"; no loud achievement
popups, no badge psychology.

## 2. Scope & non-goals

- **In scope:** the Ledger overlay, its counters, ~12 epiphany definitions,
  end-screen surfacing of newly earned epiphanies, persistence.
- **Non-goals:** no toasts/popups mid-game, no percentages/completion bars
  except the plain "X of Y" counts, no global/online anything.

## 3. Current state of the code

- Overlay + menu wiring — `src/ui/overlays.ts`: `TitleAction`/`PauseAction`
  unions, `showTitle` (title-menu `title-btn` pattern), `showPauseMenu`
  (`mk(label, action, small)` helper), `overlay(ui)` mount helper, and
  `showCodex` as the model for a data-panel overlay (`.codex-panel`,
  `max-height`, internal scroll, Back button).
- Handling — `flow.ts`: `start()` title loop and `openPause()` both switch on
  the action unions; add a `'ledger'` arm to each (mirror the `'codex'` arms,
  including the `overlay-hidden` stage handling in `openPause`).
- End screen — `EndScreenData` interface + `showEndScreen` (`overlays.ts`);
  `flow.ts` `playEnding` assembles it (recap, triptych, `newNotes`) — the
  natural place to compute newly-earned epiphanies.
- Existing profile data: `runsCompleted`, `codexUnlocked` (rooms +
  `ending:` entries), `endingsSeen`, `lastMessage`, `persona`,
  plus spec 02/04 additions (`lastRunTranscript`, `keepsakes`,
  `keepsakeChoicesTaken`).
- Registry size for denominators: `makeRegistry(allRooms).all()`.

## 4. Data model changes

```ts
// saveStore.ts — Profile gains (all default-initialized, spread-merge safe):
/** lifetime hearts lost (incremented in flow when hearts decrease) */
heartsLost: number;                    // default 0
/** per-room completion counts — most-walked door + several epiphanies */
roomVisits: Record<string, number>;    // default {}
/** completed descents (spec 02) */
understoryDescents: number;            // default 0
/** completed runs taken on the Examined Path (spec 05) */
examinedRuns: number;                  // default 0
/** epiphany ids earned, in earn order */
epiphanies: string[];                  // default []
```

Write points (all in `flow.ts`, beside existing persists):
- `heartsLost`: where `sound.heartLoss()` fires (hearts decreased).
- `roomVisits[room.id]++`: in `enterRoom` at the `completeRoom` persist.
- `understoryDescents++` / `examinedRuns++`: in `playEnding`, when
  `state.descended` / `state.examined`.
- `epiphanies`: in `playEnding` via the evaluator below.

## 5. The Ledger

### Entry points

`TitleAction` and `PauseAction` gain `'ledger'`; buttons labeled
`t(uiKey('ledger'), 'Traveler's Ledger')` — title menu: after "Field Notes";
pause menu: after "Field Notes" (small variant). New
`showLedger(ui: HTMLElement, profile: Profile, registry: RoomRegistry): Promise<void>`
in `overlays.ts`, `.codex-panel`-style with a Back button.

### Stats rows (label → computation)

| Row | Source |
|---|---|
| Runs completed | `profile.runsCompleted` |
| Rooms witnessed | count of `codexUnlocked` ids that are room ids (exclude `ending:` prefix) → "X of {registry.all().length}" |
| Endings witnessed | `endingsSeen.length` of `endingsTotal(profile)` (spec 03's 6/7 rule) |
| Hearts lost, lifetime | `profile.heartsLost` |
| The door most walked | `argmax(profile.roomVisits)` → room title via `t(roomTitleKey(id), …)`; ties → first; empty → em-dash |
| Keepsakes on the shelf | `profile.keepsakes.length` of 4 |
| Descents below | `profile.understoryDescents` (row hidden entirely until ≥1 — don't advertise the understory) |
| Examined runs | `profile.examinedRuns` (row hidden until ≥1) |
| Your last message | `profile.lastMessage` if set (italic, quoted) |

Extract every computation into pure exported helpers (`ledgerStats(profile,
registry): LedgerRow[]` in a new `src/engine/ledger.ts`) so the whole screen
is unit-testable without DOM.

### Epiphanies section

Under the stats: heading `uiKey('epiphaniesTitle')` ("Epiphanies"), then one
italic line per earned id, in earn order — nothing else. Unearned epiphanies
are **completely invisible** (no locked slots, no count): quiet means quiet.

## 6. The twelve epiphanies

Evaluator: pure `evaluateEpiphanies(profile, finishedRun: RunState): string[]`
in `src/engine/ledger.ts`, returning *newly* earned ids; called once in
`playEnding` after counters update; result appended to `profile.epiphanies`
and passed to the end screen.

| id | Line (EN, direction) | Predicate |
|---|---|---|
| `first-return` | "You came back." | `runsCompleted >= 2` |
| `kept-every-heart` | "You kept every heart, once." | finished run with `hearts === 3` |
| `spent-every-heart` | "You learned what the bottom of the ledger looks like." | any run ended `dissolved` (endingsSeen) |
| `refused-machine-twice` | "You refused the machine twice." | `roomVisits['experience-machine'] >= 2` and machine-refusal choice in both `lastRunTranscript` occurrences — simplify: count via a new tiny `profile.choiceCounts` **NO** — keep data honest: predicate = `roomVisits['experience-machine'] >= 2 && !profile.keepsakes.includes('release-form')` (never entered it across all visits) |
| `all-doors-one-act` | "One act holds no more doors you haven't opened." | any act's full pool ⊆ codexUnlocked |
| `codex-complete` | "Every room, witnessed." | all registry room ids ⊆ codexUnlocked |
| `three-endings` | "Three ways out, all of them yours." | `endingsSeen.length >= 3` |
| `descended` | "You took the stairs." | `understoryDescents >= 1` |
| `examined-run` | "You let the Annex file its commentary, start to end." | `examinedRuns >= 1` |
| `first-keepsake` | "Something small came with you." | `keepsakes.length >= 1` |
| `high-lucidity` | "You finished seeing almost everything." | finished run with `lucidity >= 180` |
| `last-word-kept` | "You had one sentence, and you still have it." | `lastMessage` set and `runsCompleted >= 2` |

(Exact copy may be tuned at implementation; predicates are binding. Note
`refused-machine-twice`'s predicate is deliberately derived from existing
data rather than new tracking — document this in code.)

## 7. End-screen surfacing

`EndScreenData` gains `newEpiphanies?: string[]`. `showEndScreen` renders, if
non-empty, one soft block after the recap: small-caps header
`uiKey('epiphanyEarned')` ("filed tonight") + the italic line(s). No sound,
no animation beyond the screen's existing fade.

## 8. i18n

`uiKey('ledger')`, `epiphaniesTitle`, `epiphanyEarned`, per-stat row labels
(`ledgerRuns`, `ledgerRooms`, `ledgerEndings`, `ledgerHearts`,
`ledgerMostWalked`, `ledgerKeepsakes`, `ledgerDescents`, `ledgerExamined`,
`ledgerLastMessage`), and per-epiphany `epiphany.<id>` lines (new builder
`epiphanyKey(id)` in `keys.ts`). EN+CS+FA same commit; ui keys are caught by
`uiKeyCoverage.test.ts` automatically; add an epiphany-lines loop to
`i18n.test.ts`.

## 9. Test plan (`ledger.test.ts`)

- `ledgerStats`: each row against a hand-built profile; empty-profile
  behavior (0s, hidden rows flagged); most-walked tie/empty rules.
- `evaluateEpiphanies`: each of the 12 predicates positive + negative; "newly
  earned" excludes already-held ids; idempotent across repeated calls.
- Counters: heart-loss increments once per loss; roomVisits increments on
  completion, not on resume-replays (guard against the `currentStage` resume
  path double-counting — increment only at the `completeRoom` persist).
- Migration: legacy profile (none of the new fields) loads with defaults via
  spread-merge (mirror `settings.test.ts` patterns).

## 10. Acceptance criteria

- [ ] Ledger reachable from title and pause; fully translated; degrades
      gracefully on a fresh profile.
- [ ] Epiphanies appear only in the Ledger + one soft end-screen block;
      nothing fires mid-play.
- [ ] All computations pure and unit-tested.

## 11. Dependencies

Reads counters from specs 02/04/05 — rows/epiphanies referencing them stay
hidden/unearnable until those specs land, which is acceptable (ship order
K→N→M→L→O→P per the README).
