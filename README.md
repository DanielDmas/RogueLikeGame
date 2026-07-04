# ANAMNESIS

*A 2.5D philosophical roguelike about finding your way back to yourself.*

You wake in a liminal waiting room with no name and no memory of what happened — a breakdown, a trip, an accident, a death; the game never says. Your self has been dissolved and filed into **rooms**, and the only way back to reality is through them. Each room stages a situation — a lost wallet, a dying grandmother's question, the trolley problem, the Ship of Theseus, the city of Omelas — and every choice either re-collects you or dissolves you further.

Your guide is **the Usher**: a shadow wearing both a halo and a small pair of horns (one of which flickers), who claims to be God on odd days and the Devil on even days and refuses to say what day it is.

## Playing

```bash
npm install
npm run dev       # play at the printed local URL
```

- **Click** doors in the scene or the cards below; **1–9** pick choices; **Space/Enter** advance text; **Esc** pauses.
- **Hearts** are your grip on reality. Lose all three and the run ends in dissolution — a real ending, not a fail screen.
- **Lucidity** rewards honest engagement, not any particular morality. It unlocks secret doors and the rarest ending.
- After every choice, a **Field Note** reveals the actual philosophy behind the room — thinkers, arguments, the real stakes. Notes persist forever in the codex.
- A run visits ~15 of the 20 authored rooms. Hidden alignment axes (reason↔feeling, self↔others, control↔acceptance), branching doors, and **six endings** reward replay.

## Structure

| | |
|---|---|
| Prologue | The Waiting Room |
| Act I — The Shallows | everyday dilemmas: the wallet, the kind lie, the promotion, the beggar's math, the quiet alarm → *the burning photograph* |
| Act II — The Machinery | the trolley junction, the experience machine, the ship, Pascal's casino, Omelas → *the Euthyphro courtroom* |
| Act III — The Mirror | the teleporter, the memory editor, the small polite room, the deathbed → *the free-will betting parlor* |
| Act IV — The Threshold | the boulder, the last message, the door that asks |

## Development

```bash
npm test          # engine tests: endings, graph reachability, reducers, content lint
npm run build     # type-check + production bundle
npm run preview   # serve the production build
```

- **Stack:** Vite + TypeScript + Three.js. No framework; DOM overlay for all text (crisp and accessible), WebGL for the scene, parametric geometry only — no downloaded assets.
- **Content is pure data** (`src/content/rooms/*`): rooms, beats, choices, effects, field notes. The engine (`src/engine/*`) never hardcodes a room.
- **Saves** are local (`localStorage`) behind an async, server-shaped `SaveStore` interface (`src/engine/saveStore.ts`) so a real backend can drop in later without touching game code.
- Settings include reduced motion, high-contrast text, typewriter toggle, and a low-quality renderer tier.

## Windows executable

A standalone Windows build is published on the [Releases page](../../releases) as a portable `.exe` (no installer needed — just download and run). It's built automatically by GitHub Actions (`.github/workflows/release-windows.yml`) whenever a `v*` tag is pushed, wrapping the production web bundle in Electron.

To trigger a new release build, push a tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

You can also run the workflow manually from the Actions tab (`workflow_dispatch`).
