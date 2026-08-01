# The Vestibule — Complete Game Description & Current State

> **Baseline document 1 of 5.** This is the definitive, self-contained
> description of *what the game is* as it stands today — every title, every
> act, every room, every ending, every system, in enough detail that a
> person or an AI who has never seen this repository can understand the whole
> product without reading the source. Its four companions are:
>
> - **02 — Technical Architecture & Repository State** (how it is built)
> - **03 — Possible Future Updates** (what could come next)
> - **04 — Total Gameplay Experience** (what it feels like to play, minute by minute)
> - **05 — Development History, Chaptered** (how it got here, and every decision made)
>
> Where this document and the live source ever disagree, the source wins —
> but everything below was checked against the code on the date in the
> footer, not remembered. When you change the game, update this file in the
> same commit, exactly as the codebase map (`docs/development/14-codebase-map.md`)
> asks you to keep *it* updated.

---

## 0. The one-paragraph version

**The Vestibule** is a collection of two 2.5D narrative roguelikes that
share a single, content-agnostic engine. **ANAMNESIS** is a philosophical
roguelike about a dissolved self trying to re-collect itself by walking
through rooms that each stage a classic thought experiment (the trolley
problem, the Ship of Theseus, Omelas, Mary's Room). **LIMERENCE** is a
roguelike about relationships at their breaking points, in which the player
wakes up *inside* a different relationship crisis in every room, rotating
through every role — the tempted, the betrayed, the betrayer, the third
person, the friend who knew. Both are played through a stark near-black 3D
corridor of doors with a DOM text overlay; both are guided by an enigmatic
figure (ANAMNESIS's **Usher**, LIMERENCE's **Night Porter**); both use the
same underlying mechanics (three hearts, three hidden alignment axes,
branching doors, persistent field notes, keepsakes, a cross-run Ledger,
multiple endings); and both are fully localized into English, Czech, Farsi
(right-to-left), German, and French. A run takes roughly 20–30 minutes and
is designed to be finished, replayed, and abandoned mid-corridor without
penalty. Nothing grades the player. Every ending is a trade, never a verdict.

---

## 1. Product identity and status

| | |
|---|---|
| **Collection name** | The Vestibule |
| **Titles** | ANAMNESIS · LIMERENCE (one engine, two content packs) |
| **Current version** | `1.0.0-rc.2` (release candidate; see below on why not `1.0.0`) |
| **Development branch (live)** | `claude/vestibule-v2-overhaul` |
| **State** | Both titles content-complete, fully playable start-to-finish including their endings, fully localized in 5 languages, cross-pack-leak-free, GPU-safe by default. |
| **Test suite** | 1,311 unit/integration tests across 89 files, all green; plus 72 live Playwright UAT scripts. |
| **Platforms** | Web (GitHub Pages, a chooser page linking to both titles) and Windows (a single portable Electron `.exe` containing both titles). |
| **Live URL** | `https://danieldmas.github.io/RogueLikeGame/` (a *rozcestník* / chooser page → `/anamnesis/` and `/limerence/`). |

**Why "rc.2" and not "1.0.0":** the label is a deliberate honesty choice,
not a signal of instability. Several sessions of feature work accumulated
after rc.1 without an intervening owner playtest of the *combined* result,
so the maintainers kept the "candidate, ready to be played" label rather
than declaring "final." The code is release-quality; the version number is
waiting on a human feel-pass, not on bug fixes.

---

## 2. ANAMNESIS — complete description

### 2.1 Premise

You wake in a liminal waiting room with no name and no memory of *what
happened* — a breakdown, a trip, an accident, a death; the game never says,
deliberately and permanently. Your self has been dissolved and filed into
**rooms**, and the only way back to reality is *through* them. Each room
stages a situation — a lost wallet, a dying grandmother's question, the
trolley problem, the Ship of Theseus, the city of Omelas — and every choice
either re-collects you (moves you back toward being a coherent self) or
dissolves you further.

The title is the Greek word *anamnesis* (ἀνάμνησις): "recollection," Plato's
idea that learning is really *remembering* something the soul already knew.
The whole game is a literalization of that metaphor.

### 2.2 The guide: the Usher

Your guide is **the Usher**: a shadow wearing both a halo and a small pair
of horns (one of which flickers), who claims to be God on odd days and the
Devil on even days and refuses to say what day it is. He is courteous,
oblique, and never scolds. He speaks in the text panel prefixed `Usher:`,
which the UI renders in his own gold-italic voice. The Usher is deliberately
kept enigmatic — the owner's standing decision is that he receives no
backstory and no additional characters. He is rendered in the 3D scene as a
parametric silhouette (`usherFigure`) who occasionally walks the corridor.

### 2.3 Structure (acts, rooms, gates)

A single run visits **15 of the 30+3 authored rooms**. The "+3" is the
optional, hidden Act V (the Understory), reachable only by returning
players. Each act has a **pool** of optional rooms (you complete a fixed
number of them, chosen by which doors you open), then a **gate** room that
is always visited and always ends the act.

| Act | Name | Pool rooms (you play a subset) | Gate (always) |
|---|---|---|---|
| Prologue | The Waiting Room | `waiting-room` (the fixed opening room) | — |
| I | The Shallows | `wallet` The Wallet · `dinner-table` The Dinner Table · `promotion` The Promotion · `beggars-math` The Beggar's Math · `quiet-alarm` The Quiet Alarm · `buridans-queue` The Buridan Annex · `the-reference` The Reference Letter | `photograph` The Photograph |
| II | The Machinery | `junction` The Junction (trolley) · `experience-machine` The Experience Machine · `ship` The Ship (of Theseus) · `casino-pascal` The Casino of Pascal · `omelas` The City of Omelas · `chinese-room` The Chinese Room · `newcomb-annex` The Newcomb Annex · `veil-of-ignorance` The Veil of Ignorance | `court-of-usher` The Court of the Usher (Euthyphro) |
| III | The Mirror | `teleporter` The Teleporter · `editor` The Editor · `introduction` The Introduction · `debt-of-dead` The Debt of the Dead · `marys-room` Mary's Room · `butterfly-dream` The Butterfly's Dream · `swampman` Swampman · `the-cave` The Cave *(secret; predicate-gated)* | `free-will` The Free Will Waiting Room |
| IV | The Threshold | fixed sequence: `boulder` The Boulder → `last-message` The Last Message → `door-that-asks` The Door That Asks | `door-that-asks` doubles as the final gate |
| V | The Understory *(optional, returning players only)* | `the-archive` → `the-unchosen` → `the-echo`, offered *instead of* `boulder` only when the player's previous-run count ≥ 1 and they haven't descended this run | — |

**Rooms-per-act quotas:** Act I completes 3 of its 7 pool rooms; Act II 3
of 8; Act III 2 of 8 (plus the possible secret). The quotas are always kept
strictly below pool size, so **choosing a door always means skipping a room
this run** — that scarcity is the engine of replay.

Precise counts: ANAMNESIS has **1 prologue + 23 pool rooms + 3 mid-act gates
+ 3 fixed Act IV rooms (`door-that-asks` being the 4th gate) + 3 Understory
= 33 real rooms**, and **7 endings**.

### 2.4 The seven endings

Endings are computed by ANAMNESIS's own evaluator from the run's final
alignment-axis values and its scripted final-door choice. They are never
framed as win/lose; each is a coherent trade, written as one.

| Ending id | Title | How it's reached |
|---|---|---|
| `return` | The Return | The "default"/balanced resolution. |
| `open-hand` | The Open Hand | Both relevant axes strongly positive (≥ +35). |
| `fortress` | The Fortress | Both relevant axes strongly negative (≤ −35). |
| `dissolved` | The Dissolved | Hearts reach 0 — a real, authored ending, *not* a failure screen. |
| `gardener` | The Gardener | A scripted final-choice / axis combination. |
| `punchline` | The Punchline | **Hidden.** Never shown locked in the codex; only appears once witnessed. |
| `anamnesis` | Anamnesis | **Hidden, Understory-only.** The "seventh ending" — reachable only from the Act V descent plus its other quiet completionist conditions. When it fires, the facility gets *brighter and plainer*, not grander, and the Usher says "Ah." and nothing else. |

### 2.5 Field notes and articles

After every choice, a **Field Note** reveals the real philosophy behind the
room: the thinkers, the argument, the actual stakes, with real citations
(every note went through a citation-accuracy pass). Notes persist forever in
the **Codex**. Two rooms (`wallet` — "What 17,000 Lost Wallets Taught Us
About Honesty"; `beggars-math` — "The Child You Can See, and the Ones You
Can't") additionally carry a long-form **"Read more" article** for players
who want to follow the citation trail deeper.

---

## 3. LIMERENCE — complete description

### 3.1 Premise

You check in, at 3 a.m., to a hotel that isn't on any map — **the
Interval**, the night between when *it* happened and when everyone finds
out. Every room on every floor holds a relationship mid-crisis, and you
don't watch it happen — you wake up *inside* it, as one of the people living
it. Across a run you'll be, in different rooms, the tempted, the betrayed,
the betrayer, the third person, and the friend who knew and said nothing.
Culpability rotates *by design*: perspective-taking is the one intervention
research shows reliably softens how people handle conflict, and the game is
built to make you occupy every side.

*Limerence* is the psychologist Dorothy Tennov's coined term for the
involuntary, intrusive, all-consuming state of infatuation — the feeling the
game is named for and repeatedly anatomizes.

### 3.2 The guide: the Night Porter

Your guide is **the Night Porter**: courteous, unshockable, tired in a
centuries-deep way. His one visual tell — a wedding band on the wrong hand —
goes unexplained until a hidden ending. He speaks prefixed `Porter:` (and
occasionally `THE ROOM:` for the room's own voice), rendered in his own
styling, and has his own parametric figure rig (`porterFigure`). Where
ANAMNESIS's Usher is playful and metaphysical, the Porter is grave and
human.

### 3.3 Structure (floors, rooms, gates)

LIMERENCE reframes the same act structure as **floors of a hotel**. A run
visits 15 of its rooms; returning players can descend to the optional
**Records Office** (its Act V). Same pool/gate logic as ANAMNESIS.

| Floor | Name | Pool rooms (you play a subset) | Gate (always) |
|---|---|---|---|
| Prologue | The Front Desk | `the-front-desk` | — |
| I | The Ground Floor | `the-read-receipt` · `the-screenshot` · `the-password` · `the-party` · `the-forward` · `the-best-friends-girl` · `the-summer-ends` | `the-rumor` The Rumor |
| II | The Second Floor | `the-distance` · `the-hall-pass` · `the-rebound` · `the-unicorn` · `just-friends` · `the-ex` · `the-confession` · `the-other-side-of-the-door` | `the-scoreboard` The Scoreboard |
| III | The Long-Stay Wing | `the-colleague` · `the-metamour` · `the-veto` · `the-drift` · `the-second-account` · `the-discovery` · `the-wedding-eve` · `the-therapist` · `the-usual-suite` *(secret)* | `the-usual-room` The Usual Room |
| IV | The Top Floor | fixed sequence: `the-kitchen-table` → `the-unsent` → `the-morning-desk` | `the-morning-desk` doubles as the final gate |
| V | The Records Office *(optional, returning players only)* | `the-registry` → `the-doors-not-opened` → `the-other-side`, offered *instead of* `the-kitchen-table` when previous-run count ≥ 1 | — |

Precise counts: LIMERENCE has **1 prologue + 24 pool rooms + 3 mid-act gates
+ 3 fixed Act IV rooms (`the-morning-desk` being the 4th gate) + 3 Records
Office = 34 real rooms** (one more than ANAMNESIS, because its Act III pool
has 9 rooms including the secret `the-usual-suite`), and **7 endings**.

### 3.4 The seven endings

| Ending id | Title | How it's reached |
|---|---|---|
| `the-morning-after` | The Morning After | The default resolution. |
| `the-giver` | The Giver | Both relevant axes strongly positive (≥ +35). |
| `the-armored` | The Armored | Both relevant axes strongly negative (≤ −35). **Deliberately the hardest non-hidden ending in either game** — a 9,000-run simulation confirmed it demands near-total, unwavering self-protection at every door. Reachable, but with little slack; a permanent test pins that it stays reachable. |
| `the-ghost` | The Ghost | Hearts reach 0 (or the scripted "stop carrying it" quiet ending) — a real ending, not a fail screen. |
| `the-porter` | The Porter | Scripted final-choice ("take the desk"). |
| `the-mirror` | The Mirror | **Hidden.** Scripted final-choice ("laughing door"). |
| `the-pattern` | The Pattern | **Hidden, Records-Office-only.** LIMERENCE's equivalent of ANAMNESIS's seventh ending. |

### 3.5 Content-warning / advisory layer

Because of its subject matter, LIMERENCE (unlike ANAMNESIS) carries a formal
**advisory** shown automatically once on first run and re-viewable from the
title menu's "Before you begin" button. It states the purpose, the mechanics
in honest terms, the themes (*infidelity, jealousy, coercive control,
non-consensual image sharing — never depicted, relationship breakdown,
consensual non-monogamy*), a minors note (**Act I characters are 15–18 and
their storylines contain no sexual content**), a self-declared age advisory
(**16+ · Mature Themes**, shown as a persistent badge on the title screen —
explicitly *not* an official rating), a "this is fiction, not therapy"
register statement, a jurisdiction-generic help line, and a no-telemetry
restatement. Adult scenes (Acts II–IV) are frank about attraction, sex, and
consequences in the register of a prestige drama, but **never graphic —
every scene cuts at the threshold**.

### 3.6 Field notes and articles

Same system as ANAMNESIS, but every field note cites real *psychology*
research rather than philosophy. Two rooms carry long-form articles:
`the-read-receipt` ("Why the Same Silence Means Different Things to
Different People") and `the-best-friends-girl` ("The Scientist Who Named the
Thing You're Feeling," about Dorothy Tennov and limerence itself).

---

## 4. Shared systems (both titles)

Everything in this section is engine-level and behaves identically in both
titles; only the *wording* is re-skinned per pack.

### 4.1 Hearts

Three hearts. In ANAMNESIS they are your **grip on reality**; in LIMERENCE
they are your **Trust**. A handful of especially costly choices spend one
outright, and letting your Lucidity/Clarity run out completely also costs
one. **Losing all three is an ending, not a failure screen** — ANAMNESIS's
`dissolved`, LIMERENCE's `the-ghost`, each authored and written as a real
resolution. The first time a player ever loses a heart, the guide delivers a
calm one-time explanation (a *first-heart-loss bark*) so it reads as a
mechanic, not a shock.

### 4.2 Lucidity / Clarity

A second resource. In ANAMNESIS it is **Lucidity**; in LIMERENCE, **Clarity
— how honestly you are willing to see yourself.** It rewards honest
engagement, *not* any particular morality. It unlocks secret doors and the
rarest endings. If it drains completely, it costs a heart.

### 4.3 The three hidden alignment axes

Every choice quietly shifts three hidden inclinations, never shown as a
number during play:

- **reason ↔ feeling** (`reasonFeeling`)
- **self ↔ others** (`selfOthers`)
- **control ↔ acceptance** (`controlAcceptance`)

Convention: negative = the first pole (reason/self/control), positive = the
second (feeling/others/acceptance). These axes — not a visible score — shape
which doors open, how the scene looks and sounds (via the dynamic-scenery
mood system), and which ending is reached. At the end screen they are shown
as an *axis triptych*: three plain-language sentences summarizing where the
run landed on each axis (e.g. "You led with your head, every time." / "…head
and heart, arguing it out." / "…your heart, every time."). Note: only two of
the three axes (`selfOthers` × `controlAcceptance`) actually select an
ending; `reasonFeeling` colors the barks and triptych but is deliberately
not an ending selector.

### 4.4 Doors

Each door is a different room; you cannot walk through all of them in one
run. Doors carry a **hint** carved above them and a spoiler-free **teaser**
of the mood behind them. Hovering a door pulses its glow, plays a per-door
pitched tone, catches a frame-glow, and shows its tooltip. Secret/Understory
doors render a `✦` and are violet-tinted. LIMERENCE's doors are visually
distinct: a thinner steel-dark frame, amber/teal glow instead of gold/violet,
and two subtle "artistically unsettling" touches — every door sits a fraction
of a degree off-plumb, and its idle glow carries a slow second wave under the
normal breathing pulse (both disabled under reduced motion).

### 4.5 Codex (persistent field notes)

Every field note earned is filed permanently in the **Codex**, browsable
from the title or pause menu. Locked entries show as disabled cards; the
hidden endings' entries do not appear at all until witnessed.

### 4.6 Keepsakes

Small, optional mementos that a handful of choices leave you carrying into
*future* runs (a keepsake earned mid-run becomes "held" only from the next
run — you can never earn-and-spend one in a single run, which is
spoiler-safe). They are never mandatory and never a mechanical advantage —
just a quiet thread between lives, marked in the world by a single `✧`. A
player who never notices them loses nothing and is never told they're
missing anything. Each pack has 4 keepsakes, each with an earn room and a
spend room:

- **ANAMNESIS:** `casino-chip`, `photo-corner`, `ship-splinter`, `release-form`.
- **LIMERENCE:** `the-cheap-ring` (won at a party for being laughed at),
  `the-unsent-letter` (a confession never sent), `the-keycard` (a hotel room
  you didn't open), `the-sim` (a second account, deleted).

### 4.7 The Ledger / Hotel Register

A cross-run history screen (ANAMNESIS: the **Traveler's Ledger**; LIMERENCE:
the **Hotel Register**) tracking your whole history: hearts spent and kept,
endings witnessed out of the total, keepsakes held, doors never opened
(shown as named teasers), your most-walked door, and more — all phrased in
the game's own voice ("The door most walked"), never dashboard-speak. The
Register also renders the facility as a *map of floors and doors*: visited
rooms lit, unvisited dark showing only their teaser, secrets as outlines
once found. It carries diegetic **guest stamps** — spoiler-free milestones
rendered as rubber stamps ("Walked every floor," "Never set a trap,"
"Checked out with all three hearts").

### 4.8 Epiphanies

As Ledger milestones are reached, short **epiphany** lines unlock —
past-tense observations, never badges ("You have never once asked before
accusing."). Each pack has **12**, each computed from that pack's own rules
against the player's lifetime choice history. They change nothing but a line
of text.

### 4.9 The Examined Path

An **opt-in mode**, offered when you start a run (and, on a first-ever run,
deferred to the first reflection-bearing choice so it doesn't stack three
modals before the player's first beat). When active, after significant
choices it shows brief **plural ethical readings** from four traditions
(consequence, duty, virtue, care) — each naming a *consideration*, never a
verdict, and deliberately written to *disagree with each other* so no
tradition reads as the house view. A player who never opts in sees nothing
different, ever.

### 4.10 The Morning Report (end-of-run recap)

After an ending, one composed screen quotes back the run's 3–4 pivotal
choices (from the transcript), shows the axis triptych, hearts kept/spent,
and the doors you never opened as named teasers. It is the screenshotable
artifact and the replay hook in one.

### 4.11 Cross-run recognition (pattern barks)

The guide visibly *remembers you* across runs. An engine (`patterns.ts`)
detects cross-run patterns from the profile (e.g. a returning player who
never opens an Act II door; a player who always verifies before acting) and
the guide remarks on it at a door — in place of a generic returning-player
wink. Both packs author these barks in all five languages.

### 4.12 Persona

An optional, cosmetic self-naming: the player can give themselves a name and
a short "about you" blurb, which is then woven into select lines (the
`{name}`/`{blurb}` tokens in the v2 voice). Purely flavor; no mechanical
effect. Skipping it is now a sticky choice (you are not re-asked every run).

### 4.13 One Door mode

A title-menu option that deals a **single random room** as a standalone
3-minute vignette — no run state carried, no ending, a low-commitment
on-ramp and a way to meet a room you haven't opened. It counts toward the
Ledger's honest visit tally and unlocks the room's Codex entry, but grants
no keepsakes and stamps no resumable run. (It now also surfaces
keepsake-gated bonus choices you'd hold, consistent with the "you carry them
always" framing.)

---

## 5. Localization

Both titles are fully localized into **English, Czech, Farsi (right-to-left,
fully mirrored UI with its own font), German, and French**, coverage-tested
per pack. Additionally, **ANAMNESIS ships two English text voices** — an
original **v1** and a rewritten **v2** (the persona-aware, current voice) —
selectable in Settings; **LIMERENCE ships v2 only** (its single,
later-designed voice). The translation system resolves every displayed
string through a key → `t(key, fallback)` catalog; the English fallback
always lives at the call site, translations in per-language files. A standing
project rule (in `CLAUDE.md`) requires every string — narrative *and* UI
chrome — to be translated *in context*, never word-for-word; a dedicated
Czech/Farsi native-register quality re-review was completed across both packs.

---

## 6. Settings and accessibility

All in the in-game Settings panel (reachable from the title, the pause menu,
the in-game HUD gear, and the landing page): typewriter toggle, reduced
motion, high contrast, renderer quality (low/high), music & SFX independent
toggles with volume sliders, text version (v1/v2, ANAMNESIS), language,
dynamic scenery, render scale, UI zoom (80–130%), light/dark theme
(LIMERENCE only), FPS cap (30/60), and — appearing only once real audio
files exist — narration on/off and volume. New profiles default to the
**GPU-safe floor tier** (low quality, 0.75× render scale, 30 fps); "Cinematic"
(bloom, 60 fps) is an explicit opt-in. Display settings (quality/zoom/scale)
are shared between the two titles. The layout is supported down to 1280×720
at up to 130% zoom.

---

## 7. What is complete vs. dormant

**Complete and shipping:** both titles' full content (all acts, gates,
secret rooms, Understory/Records Office, all endings), all keepsakes,
epiphanies, the Examined Path, the Ledger/Register with guest stamps, the
Morning Report, One Door mode, cross-run pattern barks, personas, full 5-language
localization, the dual-pack web deploy with a chooser page, and the Windows
Electron build.

**Built but dormant (waiting only on assets):** the **voice narration and
file-based music system**. The entire architecture ships — a folder
convention (`public/voice/<packId>/<lang>/<key>.mp3`,
`public/music/<packId>/<slot>.mp3`), a manifest build script, engine
playback hooks, and Settings rows that appear automatically once files
exist. It is invisible until the owner drops in real audio files and runs
the manifest script. Zero code work remains for it.

**Deliberately not built (on record, by decision):** a light theme for
ANAMNESIS (its single dark tone is authored, not a gap); separate
replay/museum/daily/NG+ menu modes (everything integrates into the one game
organically; One Door is the single sanctioned exception); loud achievement
popups; Usher backstory or additional characters; commercial-store rating
certification (PEGI/ESRB) and mobile touch support (both out of scope unless
a paid/mobile release is pursued). See document 03 for the full future-work
inventory and document 05 for the reasoning behind each of these decisions.

---

*Baseline document 1 of 5 · verified against the source on branch
`claude/vestibule-v2-overhaul` at version `1.0.0-rc.2`. Companion documents:
02 (technical), 03 (future), 04 (experience), 05 (history).*
