# Spec 06 — Endings, Keepsakes, Epiphanies, Examined Path re-skin

## 1. Endings (7 — evaluation shape identical to ANAMNESIS)

Evaluation order mirrors `engine/endings.ts`: explicit final-gate choices
first, then Trust=0, then axis extremes (`axisTriptych` analog), then the
default. Pack supplies predicates/priority via `pack.endingRules` (spec 08).

### 1. `the-morning-after` — the return (default walk-through)
Epitaph: *"The conversation was still there. So, finally, were you."*
Beats (6): the lobby doors; morning traffic; a real kitchen; the person
mid-sentence as if you'd only stepped out; nothing solved — the world not
improved, the arguments keeping your seat warm — but you catch yourself
*asking questions you don't know the answers to*; the hotel fading the way
dreams do, leaving a weather. `{name}` token in the final beat (the
ANAMNESIS `return` pattern). Field note: *On Coming Back* — the descent-
that-returns pattern, relationship edition: the danger was never the
Interval; it was returning unchanged.

### 2. `the-giver` — open-hand analog (Ours-extreme)
Epitaph: *"Everyone's safe person. Coin by coin. Mostly gladly."*
Beats: you wake porous; every friend's 2 a.m. crisis finds you; you become
the one others are repaired by — a good life, measured in other people's
better mornings — and the room prints codependency's real invoice without
contempt: the open hand that cannot close cannot hold its own. Field note:
*On Boundless Care* — codependency research + the boundary-as-load-bearing-
wall finding.

### 3. `the-armored` — fortress analog (Grip+Mine extremes)
Epitaph: *"Nothing got in. That was the plan. Nothing got in."*
Beats: competence, promotion, unshakeable; "solid," "together," never
"warm"; years later, a window, and the completed thought: everything out —
the weather, the wolves, and the mail, and the visitors. The Porter files
the card: "Safe." Margin: "Safe from what was never specified." Field note:
*On Armor* — avoidant adaptation honestly costed; a self nothing can wound
is a self nothing can astonish.

### 4. `the-ghost` — dissolved analog (Trust = 0, or chosen at the desk)
Epitaph: *"You kept attending. You stopped arriving."*
Beats: the tide re-skinned as the slow exit nobody names — present at
dinners, absent inside them; the Porter keeps his word ("no guest dissolves
alone on my shift"); the last line kept structurally parallel to
ANAMNESIS's dissolved: what stops being carried by you specifically is not
lost. Written as an ending, never a failure screen (charter). Field note:
*On Going Quiet* — emotional withdrawal/dissociation in relationships,
stated gently; the finding that numbness is a protection with a lease.

### 5. `the-porter` — gardener analog (stay choice)
Epitaph: *"The rooms always need a keeper. The keeper always needed the
rooms."*
Beats: the handover; learning the wing's temperaments (which doors stick,
which floors run cold); the discipline — you may light the corridor, never
name the door; centuries of guests certain their screenshot, their
corridor, their kitchen table is the first of its kind; one day, a guest
turns from the morning with recognition you remember from the inside, and
you say the first lesson: *"the ring and the pale stripe are the same
size. It's on purpose. Everything here is."* Field note: *On Tending* —
the wounded-healer archetype; cultivating the corner of the world that is
a hallway.

### 6. `the-mirror` — punchline analog (hidden door; `noticed-hands` ≥2 + Clarity threshold)
Epitaph: *"Both chairs. Every room. Good joke, isn't it?"*
Beats: the small door; the Porter pouring two cups, no third chair needed;
he removes the right-hand ring — and the pale untanned stripe is on
**your** left hand; every guest in every room had your face if you looked
twice — the tempted and the betrayed, the third and the friend, both
narrators of every fight you ever had; you laugh, and the laugh is the
recognition; you wake laughing, the joke evaporating, leaving its shape:
there was never anyone in the other chair. There were always two of you,
and both were you. Field note: *The Oldest Joke* — perspective-taking's
final form; the two-first-person-narrators finding; tat-tvam-asi cited
once, lightly, as the cross-title echo.

### 7. `the-pattern` — anamnesis analog (hidden 7th)
**Unlock (`pack.endingRules`, mirrors `computeAnamnesisEligible` +
`anamnesisAvailable`):** full codex (all rooms + understory witnessed
across runs) ∧ ≥2 keepsake-choices taken ∧ Clarity ≥ threshold ∧ the
Benefit of the Doubt not burned this run ∧ `chose-not-to-know` not set
this run. Final-gate option: the sentence *"I know every room."*
Epitaph: *"You didn't check out. You woke, and the waking contained every
room."*
Beats (7): every door on every floor opens at once — not thrown, just
open, the way a fact opens; ordinary corridor light, kind, nothing left
to hide from it; the read-receipt, the screenshot, the corridor, the
kitchen table — all simultaneously present the way a life is; the Porter,
hat off, says the shortest thing he says in the whole hotel: *"Ah."*; the
recognition — not learning something new, but seeing the pattern whole,
which is the only thing that has ever changed one; you wake with `{name}`
arriving *with* the waking; the departures board, glimpsed last, showing
every time at once. Field note: *Seeing It Whole* — pattern recognition
and change (insight's necessary-but-not-sufficient role; the earned-
security literature's actual mechanism); margin: *the rooms were never
behind you. They were the shape of you, awake.*

Endings-count display rule carries over: gallery shows 6 until
`the-pattern` is witnessed, then 7.

## 2. Keepsakes (4 — mechanics verbatim from ANAMNESIS spec 04)

Earned silently by trigger flags, once per profile; held from the *next*
run; each unlocks exactly one ✧ additive-only choice. The hard guarantee
and its guard test carry over unchanged.

| Keepsake | Earned (flag) | Where | Unlocks (✧, one later room) |
|---|---|---|---|
| `the-cheap-ring` | `refused-the-dare` | `the-party` (Act I) | `the-wedding-eve`: hold the plastic ring from that party next to tomorrow's real one — "you have refused a dare before; check whether tomorrow is one" (lucidity +10) |
| `the-unsent-letter` | `carried-alone` | `the-confession` (Act II) | `the-kitchen-table`: place the letter on the table unopened — an amendment to the disclosure, whosever morning it is (lucidity +10, Ours +4) |
| `the-keycard` | `walked-away` | `the-colleague` (Act III) | `the-registry` (understory): pin it to your file — proof the corridor happened *and* was walked away from (lucidity +10) |
| `the-sim` | `deleted-the-account` | `the-second-account` (Act III) | `the-other-side` (understory): hand the dead SIM to the voice in the second chair — "here's the person I stopped being in secret" (lucidity +12) |

Codex Shelf strip reused verbatim (names/origins via `keepsakeKey`).

## 3. Epiphanies (12 — Ledger; `evaluateEpiphanies` shape unchanged)

Quiet observations over profile + prior transcripts; never advice.

1. *"You have never once asked before accusing."* — no run contains
   `ask-tomorrow`/`ask-the-accuser`/`raise-it` while any `bait`/
   `set-the-trap`/`played-detective` exists.
2. *"Three rooms heard you say 'fine.' It was never fine."* — ≥3
   suppression-lineage choices (`stay-out`, `bury-it`, `pretend`…)
   across runs.
3. *"You always tell the truth exactly one room too late."* — a
   confession-lineage choice exists in a run *after* a burying-lineage
   flag.
4. *"You have never been the one to leave."* — across ≥2 finished runs,
   no `end-clean`/`end-it`/`walk-tonight`/`separate-well` choices.
5. *"Every trap you set caught you."* — `set-the-trap` or `bait` or
   `ran-the-test` in ≥2 runs.
6. *"You keep choosing people mid-goodbye."* — `the-rebound` +
   `the-ex`-answer lineage co-occur.
7. *"The window and the wall: you have built both. Count which more
   often."* — computed ratio of open/bury lineage choices, surfaced
   only as the sentence.
8. *"You read every door hint twice. You already know which doors you
   avoid."* — ≥N unvisited offers of the same room across runs (the
   `doors never opened` stat).
9. *"You apologize with logistics."* — repair-lineage choices are all
   practical (`separate-well`, `mail-it` analogs), never verbal.
10. *"Nobody in this hotel has ever heard you say the sentence you
    made the room say for you."* — `say-the-unsayable` never chosen
    across ≥2 visits to its rooms.
11. *"You walked away once. It's in the file. Read it when the
    corridor is long."* — `walked-away` exists (the one warm
    epiphany).
12. *"Your handwriting is legible. That is not the same as
    finished."* — awarded on first `take-it-knowingly` (the gate's
    compatibilist door).

## 4. Examined Path re-skin (spec 05 mechanics unchanged)

Tradition keys keep their engine ids; display labels re-skinned per pack:

| Key | ANAMNESIS label | LIMERENCE label | Reading style |
|---|---|---|---|
| `consequence` | Consequence | **Consequence** | who ends up hurt or helped, counted honestly |
| `duty` | Duty | **Honesty & Consent** | what was owed, what was agreed, what was signed under weather |
| `virtue` | Virtue | **Character** | what kind of partner this choice practices you into |
| `care` | Care | **Care** | these specific people, tonight, and what they need |

One Socratic Porter-aside per act (gate logic verbatim):
- Act I: *"When you checked the phone the fourth time — what were you
  hoping it would say that the third time didn't?"*
- Act II: *"'We're just friends.' Notice who you say it to. Notice who
  you never have to."*
- Act III: *"If nothing is wrong, what is the feeling you keep not
  mentioning to anyone?"*
- Act IV: *"The file is thick now. Whose handwriting improves as it
  goes?"*

Reflection-writing bar carries over: ≤160 chars, present tense, a
consideration never a verdict, authored for every significant DILEMMA
choice; deliberate gaps allowed in NO-SOLUTION/DOOMED rooms.
