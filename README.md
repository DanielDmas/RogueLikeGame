# ANAMNESIS

*Part of* ***The Vestibule*** *— a collection of 2.5D roguelikes about the
rooms behind hard doors, sharing one engine. This repo also contains
[**LIMERENCE**](#limerence), a second title about relationships at their
breaking points — jump to its section below. The live site's root URL is
a small rozcestník (chooser page) linking to both titles — see "Play in
the browser" just below.*

*A 2.5D philosophical roguelike about finding your way back to yourself.*

You wake in a liminal waiting room with no name and no memory of what happened — a breakdown, a trip, an accident, a death; the game never says. Your self has been dissolved and filed into **rooms**, and the only way back to reality is through them. Each room stages a situation — a lost wallet, a dying grandmother's question, the trolley problem, the Ship of Theseus, the city of Omelas — and every choice either re-collects you or dissolves you further.

Your guide is **the Usher**: a shadow wearing both a halo and a small pair of horns (one of which flickers), who claims to be God on odd days and the Devil on even days and refuses to say what day it is.

**Content note:** the game stages heavy material in the abstract — mortality, memory loss, coercion, moral injury — but never depicts graphic violence; nothing here is jump-scare horror, and every room can be read or skipped at your own pace.

## Playing

**Play in the browser:** https://danieldmas.github.io/RogueLikeGame/ is a
rozcestník (chooser page) linking to both titles — ANAMNESIS directly at
`.../anamnesis/`, LIMERENCE at `.../limerence/`.

Or run it locally:

```bash
npm install
npm run dev       # play at the printed local URL
```

- **Click** doors in the scene or the cards below; **1–9** pick choices; **Space/Enter** advance text; **Esc** pauses.
- **Hearts** are your grip on reality. Lose all three and the run ends in dissolution — a real ending, not a fail screen.
- **Lucidity** rewards honest engagement, not any particular morality. It unlocks secret doors and the rarest endings.
- After every choice, a **Field Note** reveals the actual philosophy behind the room — thinkers, arguments, the real stakes. Notes persist forever in the **Codex**.
- A run visits 15 of the 30+3 authored rooms (the "+3" is an optional, hidden Act V — descend once you're offered the stairs, and you won't be nudged back). Hidden alignment axes (reason↔feeling, self↔others, control↔acceptance), branching doors, and six endings — and rumors of a seventh — reward replay.
- **Keepsakes** are small, optional mementos a handful of choices leave you carrying into future runs — never mandatory, never a mechanical advantage, just a quiet thread between lives.
- The **Ledger** (from the title or pause menu) tracks your history across every run — hearts spent and kept, endings witnessed, doors never opened — and unlocks short epiphany lines as milestones are reached.
- The **Examined Path** is an opt-in mode (offered when you start a run) that adds brief plural ethical readings after significant choices, for players who want the philosophy made explicit rather than left implicit.
- **Typical session length:** a full run takes about 20–30 minutes; ANAMNESIS is designed to be finished, replayed, and abandoned mid-corridor without penalty — quitting and resuming is always safe.
- **Accessibility:** reduced motion, high-contrast text, a typewriter toggle, and a low-quality renderer tier are all in Settings. The layout is supported down to 1280×720 at up to 130% browser zoom, and the interface is fully mirrored for Farsi (RTL).

## Structure

| | |
|---|---|
| Prologue | The Waiting Room |
| Act I — The Shallows | the wallet, the dinner table, the promotion, the beggar's math, the quiet alarm, Buridan's queue, the reference letter → *the burning photograph* |
| Act II — The Machinery | the trolley junction, the experience machine, the ship, Pascal's casino, Omelas, the Chinese Room, Newcomb's annex, the veil of ignorance → *the Euthyphro courtroom* |
| Act III — The Mirror | the teleporter, the memory editor, the small polite room, the deathbed, Mary's room, the butterfly's dream, the swampman (and a secret door, for those who look) → *the free-will betting parlor* |
| Act IV — The Threshold | the boulder, the last message, the door that asks |
| Act V — The Understory *(optional, hidden)* | the archive, the unchosen, the echo — a detour beneath Act IV for runs that have earned it |

---

# LIMERENCE

*Also part of* ***The Vestibule*** *— see [ANAMNESIS](#anamnesis) above for
the collection's shared engine.*

*A roguelike about relationships at their breaking points.*

You check in, at 3 a.m., to a hotel that isn't on any map — **the
Interval**, the night between when it happened and when everyone finds
out. Every room on every floor holds a relationship mid-crisis, and you
don't watch it happen — you wake up inside it, as one of the people
living it. Across a run you'll be, in different rooms, the tempted, the
betrayed, the betrayer, the third person, and the friend who knew and said
nothing: culpability rotates by design, because perspective-taking is the
one thing research shows reliably softens how people handle conflict.

Your guide is **the Night Porter**: courteous, unshockable, tired in a
centuries-deep way — his one visual tell (a wedding band on the wrong
hand) goes unexplained until a hidden ending.

**Content note:** ages 15–35 are staged across the floors. Minors' scenes
(Act I) are strictly non-explicit — emotional and digital dynamics only.
Adult scenes (Acts II–IV) are frank about attraction, sex, and their
consequences, in the register of a prestige drama, but never graphic —
every scene cuts at the threshold. As with ANAMNESIS, nothing here is a
substitute for real support: if any of this is your actual life right now,
a game is not the tool. This same note (plus the themes list and a purpose
statement) shows automatically in-game the first time you begin a run, and
is re-viewable any time from the title menu's "Before you begin" button.

**Status: complete.** The Prologue, all four acts (Act I: 7 rooms + gate ·
Act II: 8 rooms + gate · Act III: 8 rooms + a secret room + gate · Act IV:
3 rooms including the final gate), the Records Office (3 optional rooms for
returning players), and all 7 endings are real, authored content — a full
run is fully playable start to finish, including its ending, today. All 4
keepsakes have both an earn room and a spend room. Its own 12 epiphanies,
Ledger denominators, and codex notes are computed from LIMERENCE's own
rules throughout — the pack-parameterization pass is done.

```bash
npm run dev:limerence   # play LIMERENCE at the printed local URL
```

LIMERENCE has its own visual and audio identity, not a reskinned
ANAMNESIS: a sodium-amber/corridor-teal hotel palette with an optional
light/dark theme toggle (Settings → Display), minor-leaning generative
music resolving to a held major chord at the ending, and its own door and
panel geometry — a thinner, cooler steel-dark door frame and sans-serif,
asymmetrically-cut panels meant to read as 21st-century and quietly
unsettling rather than gothic.

## Development

```bash
npm test               # engine + content tests: endings, graph reachability, reducers, i18n coverage, content lint
npm run build           # type-check + production bundle (ANAMNESIS only, dist/) — dev convenience, not what any release uses
npm run build:anamnesis # type-check + production bundle → dist-web/anamnesis/
npm run build:limerence # type-check + production bundle → dist-web/limerence/
npm run build:web       # both of the above, plus the rozcestník → dist-web/index.html — what GitHub Pages AND the Windows build use
npm run preview         # serve the production build
```

- **Stack:** Vite + TypeScript + Three.js. No framework; DOM overlay for all text (crisp and accessible), WebGL for the scene, parametric geometry only — no downloaded assets.
- **Content is pure data** (`src/content/rooms/*`): rooms, beats, choices, effects, field notes. The engine (`src/engine/*`) never hardcodes a room.
- **Saves** are local (`localStorage`) behind an async, server-shaped `SaveStore` interface (`src/engine/saveStore.ts`) so a real backend can drop in later without touching game code. Profiles can also be exported/imported as JSON from Settings → Data.
- Fully localized into English, Czech, Farsi (RTL), German, and French for both ANAMNESIS and LIMERENCE, coverage-tested per pack — ANAMNESIS additionally ships two text voices (an original v1 and a rewritten v2); LIMERENCE ships v2 only (its single, later-designed voice).
- `dist/`, `dist-web/`, and `release/` are build output and are gitignored — nothing built is committed.

## Windows executable

A standalone Windows build — **The Vestibule**, both ANAMNESIS and LIMERENCE in one portable `.exe` (no installer needed — just download and run) — is published on the [Releases page](../../releases). It's built by GitHub Actions (`.github/workflows/release-windows.yml`), wrapping `npm run build:web`'s output (both packs + the rozcestník) in Electron: the app opens on the same door-choice screen as the browser version, and picking a door navigates the one window into that game (Alt+Left returns to the choice).

The reliable way to trigger a release build is manually, from the Actions tab: open the "Build and release Windows EXE" workflow, click **Run workflow**, and optionally supply a `tag_name` (it defaults to `nightly-<run number>` if left blank). Pushing a `v*` tag also triggers the same workflow, but tag pushes aren't available in every environment this project is developed from, so `workflow_dispatch` is the path actually exercised and kept working.

## Also playable in the browser

A GitHub Pages build deploys automatically on every published release (`.github/workflows/deploy-pages.yml`, running `npm run build:web`) — see the browser link at the top of this README. The deployed site's root is the rozcestník (`landing/index.html`); `/anamnesis/` and `/limerence/` are each pack's own independent build, assembled by `scripts/assemble-web-dist.mjs`.
