# Spec 01 — Creative Bible

## 1. Title

**LIMERENCE** — Dorothy Tennov's clinical term (1979) for involuntary,
obsessive infatuation: intrusive thinking, ache, the reading of signs. Same
branding grammar as ANAMNESIS: one obscure, precise clinical word that *is*
the game's thesis. Title screen renders the word alone, lowercase tagline
beneath (see §8).

## 2. Frame: the Hotel, at the Interval

You wake at 3 a.m. at the front desk of a hotel that is not on any map. This
is **the Interval** — the night between *when it happened* and *when everyone
finds out*. Every room on every floor holds a relationship at its breaking
point, paused mid-crisis like held breath.

You do not watch the rooms. **You wake up inside them, as one of the people
in them** — the tempted, the betrayed, the betrayer, the third, the friend
who knows. The engine's second-person voice is preserved; "you" simply
belongs to a different person behind each door.

Fixtures (analog map from ANAMNESIS):
- Clock with no hands → **the departures board**: every guest listed, no
  checkout times.
- The facility's fog → **the corridor hush**: carpet that eats footsteps,
  doors breathing light at the seams.
- The rooms "hold situations" → the rooms **remember what people do in
  them.** Porter, prologue: *"That is all a hotel is."*

## 3. The guide: the Night Porter

The Usher's successor. Courteous, unhurried, professionally unshockable —
tired in a centuries-deep way. Never judges; occasionally, devastatingly,
*notices*.

- **Visual tell** (halo/horns analog): a wedding band on his **right** hand,
  and a pale untanned stripe on his **left** ring finger. Never mentioned by
  him, never explained — until the hidden `the-mirror` ending. Two or three
  rooms let the player *notice* it (a flag: `noticed-hands`), which feeds
  that ending's unlock.
- **Speaker prefixes** (pack-provided, see spec 08): `Porter:` — plus
  `THE ROOM:` and `THE DESK:` where spaces speak.
- **Voice:** dry, precise, hospitality-formal with hairline cracks.
  Chattam-dread door barks between choices: *"Room 204 has been quiet for an
  hour now. Quiet is not the same as peaceful."* / *"The couple in 311
  ordered two breakfasts. One of them meant it."*
- **Figure** (usherFigure analog): dark silhouette at a lectern-desk, brass
  desk lamp instead of halo — the lamp leans toward hovered doors (reuses
  the lantern rig). The ring glints on the wrong hand if you look.

## 4. POV rotation — the GRRM engine

Across one 15-room run you will be, in different rooms: the tempted, the
betrayed, the betrayer, the third person, the friend who knows, the one who
suspected wrongly, the one who was right. **Culpability rotates by design**;
each room brief tags its POV. Rules:

1. No act may cast the player only as the wronged party. At least two rooms
   per act put the knife in *your* hand.
2. The rotation is the education: the Understory's `the-other-side` closes
   the loop by replaying your own recorded lines as the person opposite
   heard them.
3. Cheating choices must be written **genuinely tempting** — rationalization
   from the inside, at full strength. A trap you can see over is not a trap.

## 5. Constellation continuity

Each act is one social constellation with a small recurring cast; rooms
cross-reference through the existing dynamic-beat mechanism (`choseIn` /
flags — the shipped `junction`/`ship` pattern). Casts:

- **Act I — the school circle:** Sara (first love), Tom (best friend), Nadia
  (Tom's girlfriend), the class group chat as a character.
- **Act II — the city:** Jules (the LDR partner), Erik & Maja (the
  established couple), Alena (the classmate), Viktor (the married one).
- **Act III — the long middle:** Dana (partner of years), Rowan (colleague),
  Petra (metamour), Dr. Weiss (therapist).
- **Act IV — the household:** you, the spouse, two kids asleep upstairs, a
  phone face-down on the kitchen table.

Mixed cast throughout: men, women; at least a quarter of couples same-sex —
as texture, never as topic. The player stays "you" (persona `{name}` whisper
sites preserved, 4 calibrated uses).

## 6. Stat re-skin (labels only — schema untouched)

| Engine field | LIMERENCE label | Meaning |
|---|---|---|
| `hearts` (3) | **Trust** | Your capacity to extend it. Costly betrayals/self-betrayals spend one; Trust = 0 is the `the-ghost` ending. HUD icon: an open hand (SVG replaces the heart). |
| `lucidity` | **Clarity** | How honestly you're willing to see yourself. |
| `reasonFeeling` | **Head ↔ Heart** | unchanged polarity |
| `selfOthers` | **Mine ↔ Ours** | self-protection ↔ merging |
| `controlAcceptance` | **Grip ↔ Open** | anxious grip ↔ secure openness — the attachment axis |
| `memoryLost` | **the Benefit of the Doubt, burned** | Set only by Act I's gate trap choice; read downstream exactly like `memoryLost` (dynamic beats, final gate read-back, hidden-ending exclusion). |

Room types unchanged: DILEMMA / INSIGHT / NO-SOLUTION / DOOMED (DOOMED = the
discovery rooms, where every path costs Trust and the room says so going in).

## 7. Acts = floors

| Act | Floor | Ages | Pool/gate | Register |
|---|---|---|---|---|
| 0 | Prologue — The Front Desk | — | 1 | frame |
| 1 | The Ground Floor | 15–18 | 7 + gate | **strictly non-explicit** |
| 2 | The Second Floor | 18–24 | 8 + gate | frank/mature |
| 3 | The Long-Stay Wing | 25–30 | 8 + secret + gate | frank/mature |
| 4 | The Top Floor | 31–35 | fixed corridor of 3 | frank/mature |
| — | The Records Office (basement) | — | sequence of 3, returning guests | reflective |

Run shape identical to ANAMNESIS: `OPTIONAL_PER_ACT = {1:3, 2:3, 3:2}`,
gates in order, fixed Act IV, ~15 rooms/run. Replay = different rooms *and
different POVs*.

## 8. Tone & style rules

- **Martin:** no plot armor — sympathetic characters do ugly things and the
  narration does not flinch or excuse; consequences ripple across acts via
  flags; power (social, emotional, economic) is always in frame.
- **Chattam:** dread through precision — timestamps, small objects (a
  keycard, a second SIM, a coffee going cold), rooms written almost in real
  time; the horror is never supernatural, it is what people do.
- **Psychology:** the field-note apparatus carries the science; beats carry
  the experience. Never let a beat lecture. The "?" button is where plain
  explanation lives.
- **Language:** contemporary, textingsafe (messages rendered as beats),
  profanity allowed sparingly in adult acts where real speech demands it.
- Title-screen tagline: *"a hotel of half-lit rooms · every door is someone
  you could be · check-out is optional"*.
- Palette (L5): sodium-lamp amber, corridor teal, neon bleed through
  curtains; act floors get warmer→colder→domestic-dawn progressions
  (spec'd fully in `09-…` §L5).
