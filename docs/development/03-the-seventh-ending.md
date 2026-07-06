# Specification 03 — The Seventh Ending: "Anamnesis" (Phase M)

## 1. Purpose & player experience

A deeply hidden seventh ending that makes the game's title literal: not
returning to the world, not staying in the facility — *waking while
remembering everything*. It rewards obsessive, cross-run engagement. Owner's
constraints: **deeply hidden** (no visible lock, no counter change until
found), gated by **multiple cross-run discoveries and specific choices**,
hinted **only in field-note margins**, and **independent of the Usher's
persona** (no rapport, no Usher-related conditions).

## 2. Scope & non-goals

- **In scope:** unlock predicate, the hidden fifth option in the final room,
  ending content, evaluation wiring, margin hints, endings-count display rule.
- **Non-goals:** no achievements popup, no hint system beyond the three margin
  lines, no Usher involvement beyond his ordinary presence in the final room.

## 3. Current state of the code

- Ending evaluation — `src/engine/endings.ts`, `evaluateEnding(s)` priority:
  ```
  hearts<=0 → dissolved
  choseIn('door-that-asks','lie-down') → dissolved
  choseIn('door-that-asks','laughing-door') → punchline
  choseIn('door-that-asks','stay') → gardener
  axis extremes → open-hand / fortress ; else → return
  ```
  `EndingId` union lives here; `punchlineUnlocked` shows the existing pattern
  for a conditioned final-door option (`hasFlag('usher-respect') && lucidity >= 220`).
- Final room — `door-that-asks` (`src/content/rooms/act4.ts`): a gate room
  with 2 stages; its final stage's choices carry `available?` predicates (the
  laughing door already uses one). Choices with `available` are filtered in
  `flow.ts` via `stage.choices.filter((c) => !c.available || c.available(this.state))`.
- Endings content — `src/content/endings.ts` (`Ending { id, title, epitaph,
  beats, fieldNote }`), icons in `endingIcons`, codex integration via
  `showCodex` (`ending:` prefix), count displays: title screen
  ("endings witnessed") and end screen — locate via `uiKey('endingsWitnessed')`
  usages in `src/ui/overlays.ts`.
- `profile.keepsakeChoicesTaken` — provided by spec 04.
- `prior` mirror + codex — `profile.codexUnlocked: string[]` holds room ids
  plus `ending:<id>` entries.
- Relevant flag: `erased-memory` (set by the editor room's erase choice;
  currently never read — this spec gives it its reader).

## 4. Data model changes

```ts
// schema.ts — RunState gains:
/** Recomputed by flow before entering door-that-asks; serialized so resume keeps it. */
anamnesisEligible?: boolean;
```

No Profile changes beyond what specs 02/04 add. `EndingId` union gains
`'anamnesis'`.

## 5. Behavior specification

### The unlock predicate

Computed in `flow.ts` at the top of `enterRoom` when `room.id === 'door-that-asks'`
(the only place profile data is in scope):

```ts
const baseRooms = registry.all().filter((r) => !UNDERSTORY_SEQUENCE.includes(r.id)).map((r) => r.id);
const codexComplete = baseRooms.every((id) => this.profile.codexUnlocked.includes(id));
const keepsakesProven = (this.profile.keepsakeChoicesTaken ?? []).length >= 2;
this.state = { ...this.state, anamnesisEligible: codexComplete && keepsakesProven };
```

- "Base rooms" = all rooms **except** the understory trio (the understory is
  optional color, not required homework) — but **including** all secrets
  (omelas, introduction, the-cave): total recall means all of it. This makes
  the ending require ≥ several runs by construction.
- Recompute happens *at the final room*, not at run start — a codex completed
  mid-run (final room of the set witnessed this run) counts immediately.

### The fifth option

Added to the final stage of `door-that-asks`:

```ts
{
  id: 'remember-everything',
  text: '“I remember all of it.”',            // direction; final copy per room's voice
  hint: 'Every room, every choice, at once.',
  effects: { lucidity: +20 },
  outcome: [ /* 2 beats — the doors all open at once, and none are needed */ ],
  available: (s) =>
    Boolean(s.anamnesisEligible) &&
    s.lucidity >= 140 &&
    !hasFlag(s, 'erased-memory'),
}
```

- **Lucidity threshold 140** — demanding but below punchline's 220; tunable,
  keep as a named constant `ANAMNESIS_LUCIDITY` in `endings.ts` beside
  `PUNCHLINE_LUCIDITY`.
- **`erased-memory` exclusion:** you cannot remember everything in a run
  where you chose to erase — thematically exact, and it finally reads a dead
  flag. (Erasure blocks *this run only*; the profile-level conditions persist.)
- Option renders last in the list, with no special styling — hidden means
  hidden; discovery is the reward.

### Evaluation

In `evaluateEnding`, insert **above** the other explicit final-door checks:

```ts
if (choseIn(s, 'door-that-asks', 'remember-everything')) return 'anamnesis';
```

(hearts<=0 stays first — dissolution still trumps everything.)

### The margin hints (exactly three, italic, one line each)

Appended to existing field-note bodies as a final italic sentence — the only
hint surface, per the owner:

1. `waiting-room` note ("Anamnesis" — the natural home): *"A marginal note,
   in an older hand: the ones who remember all of it do not use the door at all."*
2. `editor` note: *"Margin: what is erased is not merely gone — it is owed."*
3. `casino-pascal` note: *"Margin: the house pays out, once, for a completed
   collection. Ask no one."*

Update the three note bodies + their cs/fa translations; the hints are part of
the body string (no new mechanism).

### Display rule (endings count)

Everywhere an endings denominator renders (title screen, end screen, codex):
`const total = profile.endingsSeen.includes('anamnesis') ? 7 : 6;` — extract
as `endingsTotal(profile)` helper in `overlays.ts` (or `endings.ts`) and use
at every site. The codex's anamnesis ending card is **not rendered at all**
until seen (not shown locked) — filter it from the card loop when unseen.

## 6. Ending content brief

- **Title:** "Anamnesis" · **epitaph** direction: *they did not go back; they
  woke, and the waking contained the rooms.*
- **Beats (5–7):** every door in the facility opens at once; the corridor
  lights come on — ordinary, fluorescent, kind; the Usher present but silent
  except one line, his shortest in the game (he says only: *"Ah."* — enigmatic,
  no lore); the recollection lands as the Meno's geometry did: it was already
  there. Final beat mirrors the prologue's first beat, inverted (wakes
  remembering the name it lost there — use `{name}` token **once** if persona
  name set; falls back to "traveller" naturally via existing tokens()).
- **Field note:** "Total Recollection", thinkers "Plato · Henri Bergson";
  body: anamnesis completed; memory not as storage but as the self's shape;
  what changes when nothing is missing.
- **Icon:** the waiting-room door motif from the prologue icon, but open, with
  rays.

## 7. i18n

`ending.anamnesis.*` full family (title, epitaph, beats, note) + the three
amended note bodies, EN+CS+FA in the same commit. `i18n.test.ts` iterates
`endings`, so coverage auto-extends once the ending is in the array.

## 8. Test plan (`anamnesis.test.ts`)

- **Reachability positive:** construct a profile with full codex + 2 keepsake
  choices; simulate a run reaching `door-that-asks` with lucidity ≥ 140 and no
  `erased-memory`; assert the fifth option passes `available` and
  `evaluateEnding` returns `anamnesis` after choosing it.
- **Reachability negative (each condition independently):** fresh profile →
  ineligible; codex missing one room → ineligible; keepsake count 1 →
  ineligible; lucidity 139 → option hidden; `erased-memory` set → hidden even
  when otherwise eligible.
- **Priority:** anamnesis choice + 0 hearts → `dissolved` (hearts first);
  anamnesis + extreme axes → still `anamnesis`.
- **Display:** `endingsTotal` returns 6/7 per `endingsSeen`.
- **Hints:** the three note bodies contain their margin lines in en+cs+fa
  (string containment on the resolved `t(...)`).

## 9. Acceptance criteria

- [ ] Impossible on a first run by construction; discoverable without any
      out-of-game knowledge via the three margins + codex completionism.
- [ ] Zero UI change for players who haven't found it.
- [ ] `erased-memory` and the keepsake system both become load-bearing.

## 10. Dependencies

Requires spec 04 (keepsake counters) and benefits from spec 01 (larger codex
to complete — conditions reference "all rooms in the registry", so this spec
works regardless of when 01 lands, but ship after 01 to avoid retuning).
