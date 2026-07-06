# Specification 01 — New Rooms (Phase K)

## 1. Purpose & player experience

A run visits 15 rooms drawn from act pools of only 5/5/4, so two runs share
most of their content. Nine new rooms (eight open, one secret) widen the pools
to 7/7/6(+2 secrets) so consecutive runs feel genuinely different. This is the
milestone's direct attack on replay sameness — the owner's stated enemy.

## 2. Scope & non-goals

- **In scope:** 9 fully-written rooms with translations, icons, moods, pool
  wiring, and tests.
- **Out of scope:** Act IV changes (the fixed 3-room corridor stays), any new
  mechanics (keepsake hooks referenced here are *specified* in `04-keepsakes.md`),
  diorama geometry (in `07-visual-and-audio-overhaul.md`).

## 3. Current state of the code

- Room shape — `src/content/schema.ts` (verbatim, current):
  `Room { id, act: ActId, title, type: RoomType, doorHint, teaser, stages: Stage[], fieldNote?, gate?, secret?: (s: RunState) => boolean }`;
  `Stage { beats: Beat[]; choices: Choice[] }`;
  `Choice { id, text, hint?, effects: Effects, outcome: Beat[], available?: (s) => boolean }`;
  `Effects { lucidity?, hearts?, axes?: Partial<Record<Axis, number>>, flags?: string[], loseMemory? }`;
  `Beat = string | ((s: RunState) => string)` — strings starting `"Usher: "` render as the Usher's voice.
- Axis convention: **negative = REASON / SELF / CONTROL, positive = FEELING /
  OTHERS / ACCEPTANCE.** Typical magnitudes in existing content: `lucidity: +8..+12`
  per honest engagement, axes `±4..±8`, hearts costs only on rare marked choices.
- Pools — `src/content/graph.ts`: `ACT_POOLS = { 1: [wallet, dinner-table,
  promotion, beggars-math, quiet-alarm], 2: [junction, experience-machine,
  ship, casino-pascal, omelas], 3: [teleporter, editor, introduction,
  debt-of-dead] }`; `OPTIONAL_PER_ACT = { 1: 3, 2: 3, 3: 2 }`; gates are
  separate (`GATES`). Secret rooms sit inside the pools and are offered as an
  optional third door when their `secret(state)` predicate passes
  (`doorsForAct` in `src/engine/storyEngine.ts` — 2 open doors via salted hash
  sort + up to 1 secret).
- Rooms live one-file-per-act: `src/content/rooms/act1.ts` … `act4.ts`,
  aggregated in `src/content/rooms/index.ts` (`allRooms`).
- Icons: `src/content/icons.ts` — `roomIcons: Record<string, string>` of
  64×64 stroke SVGs built by the local `svg()` helper; look up via `iconFor(id)`.
- Text: every displayed string resolves through `t(key, fallback)`
  (`src/content/text/resolver.ts`); key builders in `src/content/text/keys.ts`
  (`roomTitleKey`, `roomBeatKey(id, stage, beat)`, `roomChoiceTextKey`,
  `roomChoiceOutcomeKey(id, choiceId, beat)`, `roomNote*Key`). Czech/Farsi
  packs: `src/content/text/cs.ts`, `fa.ts` via `registerAll('v2', lang, {...})`.
- Moods: a room's `type` drives scene tinting (`applyMood` + `MOOD_TINTS` in
  `src/scene/themes.ts`) when Dynamic Scenery is on.

## 4. Data model changes

One small engine change is required for the secret room `the-cave`:
`secret` predicates receive only `RunState`, but the cave unlocks on
*profile*-level knowledge (`runsCompleted >= 1`). Add a **prior-run mirror**:

```ts
// schema.ts — RunState gains:
/** Snapshot of profile-level history, stamped at run start (never mutated mid-run). */
prior?: { runs: number; endingId: string | null; transcript: TranscriptEntry[] };
```

- `newRun()` keeps its zero-argument shape for tests; add
  `newRun(prior?: RunState['prior'])` with default `undefined`.
- `Game.start()` / `resetRun()` (`src/engine/flow.ts`) pass
  `{ runs: profile.runsCompleted, endingId: profile.lastRunEndingId ?? null,
  transcript: profile.lastRunTranscript ?? [] }`.
- The `profile.lastRunTranscript` / `lastRunEndingId` snapshot fields are
  specified in `02-act-five-the-understory.md` §4 (shared infrastructure —
  build once, whichever spec lands first).
- Legacy saves: `prior` is optional; all readers use `s.prior?.runs ?? 0`.

No other schema changes. New rooms are pure data.

## 5. The nine rooms — creative briefs

Shared quality bar: beats are 5–7 per stage, written in the game's second-person
hushed voice (match `prologue.ts` / `act2.ts` register); every choice has a
`hint` (stakes, never a grade); outcomes are 2 beats; every room has a field
note with real thinkers and an honest 120–180-word body using the `**bold**`
markup sparingly. All nine are single-stage unless noted.

### K1a. `buridans-queue` — Act I, type NO-SOLUTION

- **Source:** Buridan's Ass; Sartre on choosing not to choose.
- **doorHint:** "The door of the two doors" · **teaser:** direction: *a choice
  that is only hard because nothing makes it easy.*
- **Premise:** an annex with two absolutely identical doors, A and B. A wall
  plaque states both lead where you are going. A hanging clock with hands —
  the facility's only one — ticks louder the longer you wait.
- **Choices:** (1) `take-left` — step through immediately (`controlAcceptance: -5,
  lucidity: +8`; outcome: deciding *was* the content); (2) `take-right-deliberate`
  — reason it out first, then pick (`reasonFeeling: -6, lucidity: +8`; outcome:
  the reasons were invented after the choosing); (3) `sit-down` — refuse; let
  the room decide (`controlAcceptance: +7, lucidity: +6`; outcome: a door
  opens on its own; not choosing was also a choice, and the room says so kindly).
- **Field note:** title "The Ass Between Two Bales", thinkers "Jean Buridan ·
  Jean-Paul Sartre"; body: paralysis of equal reasons; deciding as an act
  prior to reasons; **"the refusal to choose is a choice, and it too has a door."**
- **Icon motif:** two identical door rectangles side by side, one thin clock circle above.

### K1b. `the-reference` — Act I, type DILEMMA

- **Source:** Kant on truthfulness; Bernard Williams on integrity and personal projects.
- **doorHint:** "The door of the borrowed pen" · **teaser:** *someone you love
  needs a sentence from you that may not be true.*
- **Premise:** a desk, a half-written reference letter for a warm, loyal,
  *mediocre* friend applying for a job they want badly and would do poorly.
- **Choices:** (1) `write-honest` (`reasonFeeling: -6, selfOthers: -3, lucidity: +10`);
  (2) `write-kind` (`reasonFeeling: +6, selfOthers: +5, lucidity: +6`);
  (3) `decline` — return the pen, write nothing (`controlAcceptance: -4,
  selfOthers: -5, lucidity: +8`; outcome: silence is also information, and the
  friend will hear it).
- **Field note:** "The Kind Lie, Notarized", thinkers "Immanuel Kant · Bernard
  Williams"; body: the duty of truth vs the claims of loyalty; institutions
  that launder our kindness into others' risk.
- **Icon motif:** an envelope with a pen crossing it diagonally.

### K2a. `chinese-room` — Act II, type INSIGHT

- **Source:** John Searle's Chinese Room; Turing.
- **doorHint:** "The door of the perfect answer" · **teaser:** *it will answer
  anything you ask, in your own words.*
- **Premise:** a booth with a paper slot. Any note pushed in returns a reply
  in flawless, warm prose — in the player's current language (a quiet i18n
  wink; no mechanic). Then a side panel swings open: inside, a figure with
  rulebooks, matching symbols it does not read.
- **Choices:** (1) `it-understands` — the room understood; where else would
  understanding live? (`reasonFeeling: +5, controlAcceptance: +4, lucidity: +8`);
  (2) `only-rules` — nothing here understands anything (`reasonFeeling: -6,
  lucidity: +8`); (3) `ask-it` — slip in one more note: *"do you understand
  me?"* (`lucidity: +12`; outcome: the reply is perfect, and perfectly
  unhelpful — dynamic beat may echo the player's earlier answer style).
- **Field note:** "The Room That Spoke", thinkers "John Searle · Alan Turing";
  body: syntax vs semantics; the systems reply; **"you have been answering
  notes all your life; show the room your rulebook."**
- **Icon motif:** a rectangle (booth) with a paper slot and one small square note.

### K2b. `newcomb-annex` — Act II, type DILEMMA

- **Source:** Newcomb's paradox (Nozick's formulation). The predictor is *the
  facility*, never the Usher (owner's constraint).
- **doorHint:** "The door of the box already filled" · **teaser:** *your choice
  has been predicted. It is not too late — is it?*
- **Premise:** a side-annex of Pascal's casino. Two boxes: one glass (a little
  in it, visible), one opaque. A placard: the facility filled — or emptied —
  the opaque box yesterday, according to what it predicted you would do today.
- **Choices:** (1) `take-both` (`reasonFeeling: -5, controlAcceptance: -5,
  lucidity: +8`; outcome: causal dominance, and the opaque box is light);
  (2) `take-one` (`controlAcceptance: +6, lucidity: +8`; outcome: the box is
  heavy, and you will never know whether it had to be); (3) `inspect-mechanism`
  — look for how the prediction was made (`reasonFeeling: -4, lucidity: +10`;
  outcome: the mechanism is a mirror).
- **Keepsake hook** (see `04-keepsakes.md`): carrying the casino chip adds
  choice (4) `bet-against` — stake the chip on the predictor being wrong.
- **Field note:** "The Predictor's Ledger", thinkers "William Newcomb · Robert
  Nozick"; body: evidential vs causal decision theory, written for a person,
  not a seminar.
- **Icon motif:** two boxes, one drawn open/transparent (an X of glass), one solid.

### K2c. `veil-of-ignorance` — Act II, type DILEMMA

- **Source:** John Rawls; Harsanyi's average-utility variant.
- **doorHint:** "The door of the drawn lot" · **teaser:** *you will design a
  small world, and then you will live in it.*
- **Premise:** a drafting table with a miniature town of twelve households and
  three levers: how its bread, medicine, and honors are shared. A card: *you
  will wake in one of the twelve, drawn by lot.* Stage plays in two movements
  within one stage: design (choice), then a short waking-as-the-least beat
  sequence inside each outcome.
- **Choices:** (1) `equal-shares` (`selfOthers: +6, lucidity: +8`); (2)
  `merit-weighted` (`reasonFeeling: -5, selfOthers: -5, lucidity: +8`;
  outcome: you wake as the twelfth household and the mathematics is colder
  from below); (3) `floor-then-freedom` — a guaranteed floor for the worst-off,
  freedom above it (`selfOthers: +3, controlAcceptance: +3, lucidity: +10`;
  the maximin outcome; the town is imperfect and livable).
- **Field note:** "Designing From Behind the Curtain", thinkers "John Rawls ·
  John Harsanyi"; body: the veil as an honesty device; what you would build if
  you did not know who you would be.
- **Icon motif:** a curtain (three vertical wavy lines) over a small scale.

### K3a. `marys-room` — Act III, type INSIGHT

- **Source:** Frank Jackson's knowledge argument (Mary the color scientist).
- **doorHint:** "The door of the grey study" · **teaser:** *she knows
  everything about the color she has never seen.*
- **Premise:** a monochrome archive cell — the wing's only room rendered
  deliberately grey (diorama note in spec 07: the sealed drawer's contents are
  the game's single saturated prop). Papers describe every physical fact about
  red. A sealed drawer, labeled in a careful hand: *the rest of it.*
- **Choices:** (1) `open-drawer` (`reasonFeeling: +7, lucidity: +12`; outcome:
  two beats, the second just the seeing — the prose goes almost silent);
  (2) `leave-sealed` — the facts suffice (`reasonFeeling: -7, lucidity: +8`;
  outcome: the drawer hums like an unread letter for the rest of the room);
  (3) `give-away` — carry it out unopened, for someone else (`selfOthers: +7,
  lucidity: +8`).
- **Field note:** "What Mary Didn't Know", thinkers "Frank Jackson · Thomas
  Nagel"; body: knowledge vs acquaintance; whether the world's description
  exhausts the world; **"there is a kind of knowing that arrives only as an event."**
- **Icon motif:** an 8-square grid of outlined squares, exactly one filled solid.

### K3b. `butterfly-dream` — Act III, type NO-SOLUTION

- **Source:** Zhuangzi (the butterfly dream).
- **doorHint:** "The door of the papered wall" · **teaser:** *someone here is
  dreaming someone. It is not clear which direction.*
- **Premise:** a paper-walled room with a low bed, still warm. Lying down is
  not optional — the room begins mid-waking. **Dynamic beats:** at least one
  beat branches on `s.memoryLost` (the editor's erasure makes the dream
  seamless; an intact memory snags on a detail — reuse the dynamic-`Beat`
  function pattern from `v1-en-dynamic.ts` / `ship`).
- **Choices:** (1) `wake-as-self` — insist on the direction (`controlAcceptance: -6,
  selfOthers: -3, lucidity: +8`); (2) `stay-butterfly` (`controlAcceptance: +7,
  reasonFeeling: +5, lucidity: +6`); (3) `refuse-distinction` — the question
  assumes an edge the room does not have (`lucidity: +12`; the Zhuangzian answer,
  costliest in comfort).
- **Keepsake hook:** carrying the experience machine's release form adds
  choice (4) `compare-dreams` — you have signed for one artificial dream
  already; hold them side by side.
- **Field note:** "The Butterfly's Question", thinkers "Zhuangzi"; body: the
  transformation of things; why the question's unanswerability is the point.
- **Icon motif:** a butterfly of two triangles, mirrored above/below a horizontal line.

### K3c. `swampman` — Act III, type DILEMMA

- **Source:** Donald Davidson's Swampman; Parfit on what matters in survival.
- **doorHint:** "The door of the second coat" · **teaser:** *someone in there
  is wearing your face, and is very polite about it.*
- **Premise:** after a storm (the wing's lights still flickering), a figure
  sits in the room's one chair — molecule-for-molecule you, wearing your coat,
  holding your memories, mildly embarrassed by the situation.
- **Choices:** (1) `accept-them` — they are you; history is overrated
  (`controlAcceptance: +6, reasonFeeling: +4, lucidity: +8`); (2) `deny-them`
  — no causal thread, no identity (`selfOthers: -6, controlAcceptance: -5,
  lucidity: +8`); (3) `split-the-coat` — divide what's yours between you
  (`selfOthers: +7, lucidity: +8`; the Parfitian shrug: survival was never
  the thing that mattered).
- **Keepsake hook:** carrying the ship's splinter adds choice (4)
  `show-the-splinter` — planks again; ask which vessel owns the voyage.
- **Field note:** "The Man From the Marsh", thinkers "Donald Davidson · Derek
  Parfit"; body: psychological continuity vs causal origin; the teleporter
  room's question wearing muddier boots.
- **Icon motif:** two identical standing silhouettes, the second drawn in dashes.

### K4. `the-cave` — Act III **secret**, type NO-SOLUTION

- **Source:** Plato, *Republic* VII.
- **Unlock:** `secret: (s) => (s.prior?.runs ?? 0) >= 1` — returning travelers
  only. (Offered as the "third, stranger door" by the existing secret-door slot.)
- **doorHint:** "The low door with the firelight" · **teaser:** *shadows you
  will recognize, projected for an audience of one.*
- **Premise:** a fire, a wall, a bench. On the wall, shadow-plays re-enact up
  to three moments from the player's *previous run* — dynamic beats built from
  `s.prior.transcript` (room title + the exact `choiceText` the player picked,
  e.g. *"a shadow lifts a shadow-lever, and the shadow-tram turns"*). If the
  snapshot is empty (legacy profile), fall back to three generic shadow
  vignettes — the room must read wholly without it.
- **Choices:** (1) `name-them` — say aloud whose choices these were
  (`selfOthers: -3, lucidity: +14` — the room rewards the hardest looking in
  the wing); (2) `watch-silent` (`controlAcceptance: +6, lucidity: +8`);
  (3) `turn-to-fire` — look at the projector, not the wall, then leave toward
  the light (`reasonFeeling: -5, controlAcceptance: -4, lucidity: +10`).
- **Field note:** "The Fire and the Wall", thinkers "Plato"; body: the ascent
  from the cave retold for someone who *built* the shadows themselves;
  **"the prisoner's real chains were the certainty that the wall was all there was."**
- **Icon motif:** a flame shape left, three slanted shadow-strokes on a wall right.

## 6. Wiring changes

- `src/content/rooms/act1.ts` gains K1a/K1b; `act2.ts` gains K2a–c; `act3.ts`
  gains K3a–c + K4 (follow each file's existing export-array shape; `index.ts`
  aggregates automatically if it spreads the per-act arrays — verify).
- `src/content/graph.ts`:
  `ACT_POOLS[1] += ['buridans-queue', 'the-reference']` (7 open);
  `ACT_POOLS[2] += ['chinese-room', 'newcomb-annex', 'veil-of-ignorance']`
  (7 incl. secret omelas); `ACT_POOLS[3] += ['marys-room', 'butterfly-dream',
  'swampman', 'the-cave']` (8 incl. 2 secrets).
- `OPTIONAL_PER_ACT` stays `{1: 3, 2: 3, 3: 2}` — run length is unchanged;
  variety comes from the bigger pools. (Act III now offers 2-of-6-open: strong
  variance, intended.)
- `src/content/icons.ts`: 9 new `roomIcons` entries per the motifs above.
- Punchline continuity fix ("twenty rooms" → "every room") is spec 08 §R5 —
  do not duplicate here.

## 7. i18n requirements

For each room: `room.<id>.title/doorHint/teaser`, `room.<id>.stage0.beatN`,
`room.<id>.choice.<cid>.text/hint`, `room.<id>.choice.<cid>.outcomeN`,
`room.<id>.note.title/thinkers/body` — all registered in `cs.ts` and `fa.ts`
in the same commit as the English content. `translationCoverage.test.ts` and
`i18n.test.ts` iterate `allRooms`, so they extend automatically; no test
edits needed for coverage, only for counts (below).

## 8. Test plan

- `graph.test.ts`: update room-count/pool invariants (21 → 30 rooms; run still
  always 15 rooms; every run finishes across seeds — the existing seeded
  full-run test covers this once pools are updated).
- New `newRooms.test.ts`: every new room id resolves in the registry; every
  new room has ≥3 choices, hints on all choices, a field note, an icon; the
  cave's `secret` returns false for `prior` absent/0 and true for runs ≥ 1;
  `butterfly-dream`'s dynamic beat returns different text for
  `memoryLost: true/false`.
- `difficultyGuardRail.test.ts` re-run unchanged — it iterates pools, so the
  sincere-player guarantee must still hold with new rooms (no new room may
  include an unavoidable heart cost; none above do).

## 9. Acceptance criteria

- [ ] 9 rooms live in the pools; a seeded simulation shows two consecutive
      runs can differ in ≥4 of their optional rooms.
- [ ] `tsc` + full vitest green; coverage tests pass in cs+fa.
- [ ] The cave never appears on a first-ever run; appears eventually for a
      profile with `runsCompleted >= 1`.
- [ ] No new room changes run length, heart economy, or gate order.

## 10. Dependencies

- Provides content hooks consumed by `04-keepsakes.md` (choices 4 in
  newcomb/butterfly/swampman) — those choices are **added by spec 04**, not
  here; this spec ships the rooms without them.
- `the-cave` and the `prior` mirror are shared with `02-act-five-the-understory.md`
  — build the mirror once.
