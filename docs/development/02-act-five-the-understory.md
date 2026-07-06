# Specification 02 — Act V: The Understory (Phase L)

## 1. Purpose & player experience

On any run after the first ending, the facility quietly gains a basement. At
the threshold of Act IV, beside the expected door, stands one more: a
staircase down. It is optional, clearly stranger, never forced, and never
mentioned by any menu — honoring the owner's decision that there are **no
separate modes**. Below are rooms that *remember the player's previous run*
and say so to their face. Descending lengthens the run from 15 to ~18 rooms
and recolors the walk to the final door.

## 2. Scope & non-goals

- **In scope:** the descent-door offering rule, three understory rooms, the
  prior-run snapshot infrastructure, rejoining Act IV, persistence markers.
- **Non-goals:** no menu entry, no difficulty change, no new characters (the
  rooms speak as rooms; the Usher's existing second-run bark seeds the hint —
  one added bark variant only), no changes to endings (the understory colors
  the journey, not the destination — except data it feeds to the Ledger).

## 3. Current state of the code

- Door offering — `src/engine/storyEngine.ts`, `offeredDoors`:
  Act 4 branch is currently:
  ```ts
  if (state.act === 4) {
    const next = ACT4_SEQUENCE.find((id) => !state.visited.includes(id));
    return next ? [registry.get(next)] : [];
  }
  ```
  `ACT4_SEQUENCE = ['boulder', 'last-message', 'door-that-asks']`
  (`src/content/graph.ts`).
- `completeRoom` increments `actOptionalDone` only for acts 1–3 and advances
  acts only on `gate` rooms — so **non-gate act-4 rooms flow through it with
  no side effects**. This is the property the understory exploits: its rooms
  are plain `act: 4`, `gate: undefined` rooms, and the engine needs no new
  state machine.
- `RunState.transcript` resets every run (`newRun()`), so "your previous run"
  requires a profile-level snapshot (§4).
- The Usher's door barks: `usherDoorBark(state, runsCompleted, doorCount)` in
  `src/content/usher.ts` — already receives `runsCompleted` and has a
  `second-run` bucket; extend rather than replace.

## 4. Data model changes (shared infrastructure — also used by specs 01 & 03)

```ts
// saveStore.ts — Profile gains:
/** Snapshot of the most recently FINISHED run, for rooms that remember. */
lastRunTranscript?: TranscriptEntry[];
lastRunEndingId?: string | null;

// schema.ts — RunState gains (stamped at run start, read-only during the run):
prior?: { runs: number; endingId: string | null; transcript: TranscriptEntry[] };

// schema.ts — RunState gains (understory bookkeeping):
/** ids of understory rooms remain in `visited` like any room; this marks intent */
descended?: boolean;
```

- Snapshot write point: in `Game.playEnding` (`src/engine/flow.ts`),
  immediately where `runsCompleted` is incremented and the ending is recorded:
  `profile.lastRunTranscript = this.state.transcript; profile.lastRunEndingId = endingId;`
  **before** the profile is persisted.
- `prior` stamping: `newRun(prior?)` per spec 01 §4. Never mutate `prior`
  mid-run; it is serialized with the save, so quit/resume keeps it intact.
- Legacy profiles: both fields optional; rooms must degrade (see §6 fallbacks).

## 5. Behavior specification

### Offering the staircase

Replace the act-4 branch of `offeredDoors` with:

```ts
if (state.act === 4) {
  const next = ACT4_SEQUENCE.find((id) => !state.visited.includes(id));
  if (!next) return [];
  const eligible =
    next === 'boulder' &&                      // only at the threshold, before Act IV begins
    (state.prior?.runs ?? 0) >= 1 &&           // returning travelers only
    !UNDERSTORY_SEQUENCE.some((id) => state.visited.includes(id));
  if (eligible) return [registry.get(UNDERSTORY_SEQUENCE[0]), registry.get(next)];
  const pendingUnder = state.descended
    ? UNDERSTORY_SEQUENCE.find((id) => !state.visited.includes(id))
    : undefined;
  return [registry.get(pendingUnder ?? next)];
}
```

with `UNDERSTORY_SEQUENCE = ['the-archive', 'the-unchosen', 'the-echo']`
exported from `graph.ts`. Entering `the-archive` sets `descended: true` (via
its first choice's `flags` — no: via flow when the room id matches; simplest:
`flow.ts` sets `this.state = {...this.state, descended: true}` when entering
`the-archive`). After `the-echo` completes, the sequence is exhausted and the
next `offeredDoors` call returns `boulder` — the run rejoins Act IV with zero
additional logic.

- The staircase door is visually the "stranger" one: reuse the secret-door
  styling channel (`DoorSpec.secret`-equivalent flag on the spec passed to
  `director.showDoors` / `choices.pickDoor`) so it renders with the violet
  accent — but do **not** mark the rooms `secret` in content (they must not
  enter act-pool logic).
- Quit/resume anywhere in the understory: already safe — `currentRoom` /
  `currentStage` persistence covers it; `descended` is part of `RunState`.
- Skipping the staircase: choosing `boulder` at the fork forfeits the descent
  for this run (`eligible` requires `next === 'boulder'` and the fork is only
  offered once — after boulder is visited, `next` advances).

### Usher hint

One new bark id `understory-hint`, shown by `usherDoorBark` **only at the
fork** (doorCount 2 at act 4): direction — *"That second door is not on my
map. It was, once. Take it or don't; it will not offer twice."* Wire into the
existing bark-selection logic + `USHER_BARK_IDS` i18n test list.

## 6. The three rooms — creative briefs

All `act: 4`, no gates, no heart costs (the understory confronts, it does not
punish — owner's forgiving-game stance). Type mix below; 5–7 beats; 3 choices
each; full field notes.

### `the-archive` — type NO-SOLUTION

- **Premise:** a records room; one long shelf holds the player's previous run,
  boxed and labeled. A reading table has one box already open — the room picks
  the *most heart- or lucidity-significant* choice from `prior.transcript`
  (selection rule: first entry whose choice cost a heart; else the entry with
  the largest lucidity swing; else the final entry) and stages it as an
  exhibit with a small printed card.
- **Dynamic beats:** quote `choiceText` verbatim on the card; one beat may
  incorporate the persona blurb *once, softly* (the "just a little" persona
  use — e.g. the intake form stapled to the box carries their own words back
  to them). If `prior.transcript` is empty (legacy profile), the box is
  water-damaged and unreadable — three fallback beats, same choices.
- **Choices:** `stand-by-it` (own it; `selfOthers: -3, lucidity: +10`) ·
  `disown-it` (that was someone else; `controlAcceptance: -5, lucidity: +6`) ·
  `refile-it` (neither defend nor deny; put it back gently; `controlAcceptance:
  +6, lucidity: +8`).
- **Field note:** "On Keeping Records", thinkers "Paul Ricœur"; memory as
  narrative identity; the archive that every self quietly is.

### `the-unchosen` — type DILEMMA

- **Premise:** a corridor of doors that were offered to the player in the
  previous run **and not taken** (computable: previous run's acts' pools minus
  `prior.transcript` room ids; pick 3, deterministic salted hash like
  `doorsForAct`). They stand slightly open. One of them — the same hash picks
  it — swings wide and offers itself *now*, out of context.
- **Behavior:** taking it does **not** play that room; it plays a condensed
  3-beat "what you find is smaller than what you imagined" vignette (the room
  as furniture, the dilemma long since resolved without them). This avoids
  re-entering pool logic and makes the philosophical point.
- **Choices:** `enter-it` (curiosity honored; `reasonFeeling: +4, lucidity: +8`)
  · `close-it` (respect its pastness; `controlAcceptance: +6, lucidity: +8`) ·
  `read-the-hinges` (ask why it was offered again; `reasonFeeling: -5,
  lucidity: +10`).
- **Fallback:** legacy profile with no snapshot → the corridor's doors are
  blank and the beats acknowledge that some records did not survive.
- **Field note:** "The Road Not Taken, Audited", thinkers "Søren Kierkegaard ·
  Robert Frost (as caution)"; regret, possibility, and the flattering lie
  inside "what if".

### `the-echo` — type INSIGHT

- **Premise:** a bare room with two chairs. In the other chair: not a person —
  a *voice* assembled from the player's previous run (the room states this
  plainly; no new character, honoring the owner's constraint). It speaks 2–3
  of their own `choiceText` lines back, in order, as dynamic beats. It also
  knows the previous ending (`prior.endingId`) and names it once, flatly.
- **Dead-flag consumers:** if `prior.transcript` shows junction's `pushed` or
  `kept-bridge`, the echo references it in one line each — retiring two of the
  five never-read flags (see spec 08 §R6 audit table).
- **Choices:** `answer-it` (speak to who you were; `selfOthers: +4, lucidity: +10`)
  · `sit-in-silence` (`controlAcceptance: +6, lucidity: +8`) · `take-both-chairs`
  (there was never anyone else here; `lucidity: +12`).
- **Field note:** "Conversations With a Previous Tenant", thinkers "David Hume
  (bundle self) · Galen Strawson"; the self as series; whether the person who
  chose is still in the building.

## 7. UI/UX

- The fork renders as an ordinary 2-door screen (existing framing handles 2
  doors); the staircase card carries the violet secret styling + its own icon
  (stair steps descending into a doorway).
- Understory rooms get moods per type as usual; spec 07 gives them a shared
  diorama family (bare bulbs, shelving) — not required for this spec to ship.
- Act label while below: keep "Act IV — The Threshold" in the HUD but the
  room-title chip carries a small "· below" suffix via `roomTitleKey` content —
  no HUD code change.

## 8. i18n

Standard room key families for the three rooms + `usher.bark.understory-hint`
+ icon entries. EN+CS+FA same commit; add the bark to `USHER_BARK_IDS`.

## 9. Test plan (`understory.test.ts`)

- Offering: fresh profile (prior.runs 0) never sees the staircase across 50
  seeded runs; prior.runs ≥ 1 sees the fork exactly once, at the boulder
  threshold, and never again after skipping or completing.
- Sequencing: descending yields visits `the-archive → the-unchosen → the-echo
  → boulder → last-message → door-that-asks`; run completes; length 18.
- Skipping: choosing boulder at the fork → normal 15-room run; understory ids
  never appear.
- Snapshot: `playEnding` writes `lastRunTranscript`/`lastRunEndingId`;
  `newRun(prior)` stamps them; quit/resume mid-understory preserves position.
- Exhibit selection rule: unit-test the pick (heart-cost entry wins; else max
  lucidity swing; else last).
- Fallbacks: empty `prior.transcript` renders non-empty beats in all three
  rooms (call each dynamic beat with a bare state).

## 10. Acceptance criteria

- [ ] Optional, once-per-run, returning-players-only descent; zero menu surface.
- [ ] All three rooms quote real previous-run data when available and degrade
      gracefully when not.
- [ ] Run always completes with or without descending; no gate/act corruption.
- [ ] `pushed`/`kept-bridge` flags gain their first real readers.

## 11. Dependencies

Provides the `prior` mirror + profile snapshot consumed by `01` (the-cave) and
`03` (eligibility recompute). Ledger counters (`understoryDescents`) are
specified in `06-ledger-and-epiphanies.md`.
