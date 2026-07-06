# Specification 04 — Keepsakes (Phase N)

## 1. Purpose & player experience

Some rooms leave something in your pocket. The player never manages an
inventory, never makes a "pick up?" decision, and never suffers or gains a
single heart, lucidity point, or axis shift *because a keepsake exists*. But
walk into the right room carrying the right small thing, and one extra choice
is quietly there, marked with a small ✧. Owner's constraint, verbatim: *"only
gently, very lightly, do not alter the main game mechanics for the sake of
these keepsakes. Make it be like a bonus."*

## 2. Scope & non-goals

- **In scope:** 4 keepsakes, auto-earn triggers, 4 unlock sites (one extra
  choice each), the ✧ marker, a codex Shelf strip, persistence, guard tests.
- **Non-goals:** no inventory UI, no carry-slot decisions, no keepsake
  trading/consumption, no effect on door offering, hearts, lucidity floors, or
  endings — **except** feeding the 7th ending's counter (spec 03), which is
  itself pure bonus content.

## 3. Current state of the code

- Choices support `available?: (s: RunState) => boolean` — filtered in
  `flow.ts` (`enterRoom`) before display. This is the entire unlock mechanism;
  no engine change needed for gating.
- Flags: `Effects.flags` appends to `RunState.flags` via `applyEffects`
  (`src/engine/gameState.ts`). Dead flags available as earn-triggers:
  `sharp-gambler` (casino), `saved-photo` (photograph gate — note this one IS
  read already by act4 dynamic text; reuse is fine, reading a flag twice is
  harmless), `entered-machine` (experience machine).
- ChoicePanel rendering — `src/ui/choices.ts`, `pick()`: builds
  `.choice-card` buttons with `num`/`txt`/`hint` spans. The ✧ marker slots in
  here.
- Codex — `showCodex` (`src/ui/overlays.ts`): grid of cards + Back button;
  the Shelf strip mounts between grid and Back.
- Persistence — `Profile` spread-merge pattern (`defaultProfile()` in
  `src/engine/saveStore.ts`).

## 4. Data model changes

```ts
// saveStore.ts — Profile gains:
/** Keepsakes ever earned (ids from KEEPSAKES). Never removed. */
keepsakes: string[];            // default []
/** Ids of keepsake-gated choices the player has actually taken (feeds spec 03). */
keepsakeChoicesTaken: string[]; // default []

// schema.ts — Choice gains:
/** Present on keepsake-gated bonus choices; renders the ✧ marker. */
keepsakeId?: string;

// schema.ts — RunState gains (mirror, stamped at newRun like `prior`):
/** Keepsakes held at run start — available() predicates can only see RunState. */
keepsakesHeld?: string[];
```

`newRun(prior?, keepsakesHeld?)` — or fold into a single options argument;
implementer's choice, keep the zero-arg call working for tests.

**Mid-run earn nuance:** a keepsake earned in room X becomes *held* only from
the **next run** (the mirror is stamped at run start). This is deliberate:
simpler, spoiler-safe (you cannot earn-and-spend in one run), and it
reinforces the cross-run texture. Document in the field-note-free Shelf
tooltip copy ("kept for the next visit").

## 5. The four keepsakes

| id | Name (EN) | Earned by | Detection | Unlocks in | Added choice id |
|---|---|---|---|---|---|
| `casino-chip` | The Unspent Chip | leaving Pascal's casino without playing along (the choice that sets `sharp-gambler`) | flag `sharp-gambler` | `newcomb-annex` | `bet-against` |
| `photo-corner` | A Corner of the Photograph | saving the photo at the Act I gate (`saved-photo`) | flag `saved-photo` | `the-archive` (understory) | `pin-the-corner` |
| `ship-splinter` | A Splinter of the Ship | the ship-room choice asserting the parts carry the voyage — add `flags: ['ship-splinter']` to that existing choice (implementer picks the one whose text best fits; do not change its other effects) | flag `ship-splinter` | `swampman` | `show-the-splinter` |
| `release-form` | The Machine's Release Form | entering the experience machine (`entered-machine`) | flag `entered-machine` | `butterfly-dream` | `compare-dreams` |

**Earn mechanism:** in `flow.ts`, after `applyEffects` in `enterRoom`, diff
newly-added flags against a `KEEPSAKE_TRIGGERS: Record<flag, keepsakeId>` map
(new module `src/content/keepsakes.ts` exporting the table above + names +
icons + origin lines); push unseen ids into `profile.keepsakes` and persist.
No toast, no interruption — the Shelf is where they're discovered (owner:
whisper-quiet).

**Not retroactive — by design.** Flags live in `RunState` and reset every
run, so a choice made in a run *before* keepsakes shipped grants nothing;
the player re-earns it by making the choice again in a new run. Document this
in a code comment and cover it with a test (a profile with `runsCompleted > 0`
and empty `keepsakes` stays empty until a trigger flag is set in a live run).
This keeps the earn logic honest and simple, and replays are the game's
texture anyway.

**Unlock choices** (added to the four rooms — three of them are spec 01
rooms; `the-archive` is spec 02):

- Every added choice: `available: (s) => (s.keepsakesHeld ?? []).includes('<id>')`,
  `keepsakeId: '<id>'`, ordinary effects **in line with its siblings'
  magnitudes** (lucidity +8..+12, axes ±4..7, never hearts), 2 outcome beats
  that acknowledge the object. Copy direction:
  - `bet-against`: stake the chip on the predictor being wrong about you —
    outcome: the predictor predicted the chip, too; lucidity-rich, humbling.
  - `pin-the-corner`: pin the unburnt corner to your previous run's exhibit —
    outcome: the archive accepts the amendment; quiet keeper's note.
  - `show-the-splinter`: planks again — ask which vessel owns the voyage;
    outcome: the copy laughs with you, once; the question dissolves a little.
  - `compare-dreams`: hold the signed-for dream against this unsigned one —
    outcome: only one of them ever asked permission.
- **Taken-tracking:** in `flow.ts`, where the chosen `choice` is applied — if
  `choice.keepsakeId`, push `choice.id` into `profile.keepsakeChoicesTaken`
  (deduped) and persist. This is the counter spec 03 reads.

## 6. UI

- **✧ marker:** in `ChoicePanel.pick()`, when `c.keepsakeId` is set, prepend
  `el('span', 'keepsake-mark', '✧')` inside the card before `num`. CSS: gold,
  `opacity .8`, small — mirror `.door-unseen-badge`'s restraint. Tooltip
  (`title` attr): the keepsake's name via `t(uiKey('keepsakeChoiceTooltip'), …)`
  + name.
- **Codex Shelf:** one horizontal strip under the heading row: label
  ("The Shelf" — `uiKey('shelfTitle')`), then per earned keepsake a small icon
  + name; per unearned keepsake a dim `·` placeholder (count visible, nothing
  spoiled). Each earned item's `title` tooltip: origin line ("kept from the
  casino, unspent"). Icons: 4 new entries in a `keepsakeIcons` record inside
  `src/content/keepsakes.ts` (same `svg()` pattern; motifs: a circle chip, a
  torn triangle, a long thin splinter, a form with a signature line).
- No other surfaces. The pause menu, HUD, and door screens never mention
  keepsakes (owner: nothing that stirs attention from the doors).

## 7. i18n

`uiKey('shelfTitle')`, `uiKey('keepsakeChoiceTooltip')`, plus per-keepsake
`keepsake.<id>.name` / `keepsake.<id>.origin` (new key builder
`keepsakeKey(id, field)` in `keys.ts`), plus the four added choices' standard
room keys. EN+CS+FA same commit; extend `uiKeyCoverage.test.ts`'s scan roots
if `src/content/keepsakes.ts` uses `uiKey` literals (it's under `src/content`,
already scanned).

## 8. Test plan (`keepsakes.test.ts`)

- **The hard guarantee (owner's constraint):** for every room in the registry,
  with `keepsakesHeld: []` the available-choice list is *identical* to the
  list before this feature (snapshot by filtering `available`), and with all
  four held it differs **only** by the four specified additions. No sibling
  choice's effects/text change.
- Earn mapping: applying each trigger flag grants exactly its keepsake, once
  (idempotent across repeat runs).
- Mirror semantics: keepsake earned mid-run is not in `keepsakesHeld` until a
  new run is stamped.
- Taken-tracking: choosing a `keepsakeId` choice records it once.
- No mechanical bleed: assert each added choice's effects contain no `hearts`
  key; `difficultyGuardRail.test.ts` re-run green.

## 9. Acceptance criteria

- [ ] Zero interaction cost for players who never notice keepsakes; the base
      game is bit-identical for a keepsake-less profile.
- [ ] All four earn/unlock pairs work across a two-run sequence.
- [ ] Shelf renders earned + placeholder states; fully translated.

## 10. Dependencies

Unlock sites live in specs 01 (`newcomb-annex`, `butterfly-dream`, `swampman`)
and 02 (`the-archive`) — implement after those rooms exist (or land the
choices in the same PR as the rooms). Spec 03 consumes
`keepsakeChoicesTaken`.
