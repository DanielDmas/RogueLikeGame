# Specification 08 — Platform, Localization & Engine Health (Phase R)

## 1. Purpose

Everything that makes the game reachable, polished as software, and honest
under the hood: a playable web release, a grown-up Electron shell, a Czech
quality pass, groundwork for German/French (explicitly the milestone's lowest
priority), and the small debts: dead flags, the persona whisper, one
continuity nit.

## 2. Current state of the code

- Build: Vite, `base: './'` already set (`vite.config.ts`) — output is
  path-relative and Pages-compatible as-is.
- CI: one workflow, `.github/workflows/release-windows.yml` —
  `workflow_dispatch` with optional `tag_name` input + push on `v*` tags;
  `windows-latest`; `contents: write`. **Note for the implementer: direct tag
  pushes from the remote session get 403 — releases are dispatched with the
  `tag_name` input (proven path for v0.1.5-v2-beta).**
- Electron — `electron/main.cjs`: 1280×800 (min 960×600), `autoHideMenuBar`,
  `contextIsolation: true`, `nodeIntegration: false`, no preload, **no icon,
  no window-state memory, no single-instance lock**; `fullscreenable` unset
  (defaults true — verify F-key fullscreen works in-shell and remove the item
  if so).
- i18n — `src/content/text/resolver.ts`: `Lang = 'en' | 'cs' | 'fa'`,
  `LANGS`, `nextLang` cycle, `registerAll(version, lang, entries)`; packs
  `cs.ts` (~1,500 strings incl. all room prose) and `fa.ts`; RTL handling via
  `applyLocaleToDocument` (`src/ui/locale.ts`); fonts via `@fontsource`
  (Inter, Spectral, Vazirmatn).
- Dead flags (set, never read): `pushed`, `kept-bridge`, `entered-machine`,
  `sharp-gambler`, `erased-memory`.
- Persona: `{name}` token plumbed (`flow.ts tokens()` → `applyTokens` at act
  intros, barks, beats, endings) but **used by zero content strings**;
  `persona.blurb` collected, never read.
- Continuity nit: the Punchline ending's text says "twenty rooms"; a run is
  mechanically 15 (and room count is changing anyway).

## 3. R1 — GitHub Pages deploy

New workflow `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy web build to GitHub Pages
on:
  workflow_dispatch:
  release: { types: [published] }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run build        # runs tsc --noEmit + vite build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```

- One-time repo setting (owner action, document in the PR): Settings → Pages
  → Source: **GitHub Actions**.
- README: add a "Play in the browser" line with the Pages URL
  (`https://danieldmas.github.io/RogueLikeGame/`) once live.
- Verification: saves are `localStorage`-keyed — unaffected by hosting; test
  a full prologue + settings round-trip on the deployed URL (one short UAT
  script, per CLAUDE.md budget).

## 4. R2 — Electron polish

1. **Icon:** add `build/icon.ico` (generate from a 512×512 render of the
   waiting-room door glyph on `#0a0a0d` — any offline ICO packer; commit the
   .ico) and set `package.json` `build.win.icon: "build/icon.ico"`; also
   `icon` on the `BrowserWindow`.
2. **Window-state memory:** on `close`, write `{ bounds, isMaximized }` to
   `path.join(app.getPath('userData'), 'window-state.json')`; on create, read
   + validate (must intersect a current display via `screen.getAllDisplays()`,
   else default). Plain `fs`, no new dependency.
3. **Single-instance lock:** `app.requestSingleInstanceLock()`; on failure
   `app.quit()`; on `second-instance`, focus/restore the existing window.
4. **Fullscreen check:** verify the in-game F key works in the shell
   (`fullscreenable` defaults true); only add explicit config if broken.

## 5. R3 — Czech quality pass (owner: "Czech deserves contextual reframing / better translations")

Scope: `src/content/text/cs.ts` only (v2 lang pack). Method, in order:

1. **Terminology sweep** — settle and apply consistent renderings for the
   game's key terms; current candidates to revisit: *úchop reality* (for
   "grip on reality" — consider *sevření reality* or a reframe like *to, čím
   se držíte skutečnosti*), *lucidita* (fine, but verify every tooltip uses
   the same casing/phrasing), *Uvaděč* (keep — established), *Poznámky* vs
   *Zápisky* for field notes (pick one, apply everywhere incl. buttons).
2. **Idiomatic reframing over literal translation** — every settings
   description, About paragraph, onboarding line, and Usher bark gets a
   read-aloud pass: if it sounds like translated English, rewrite it as a
   Czech sentence with the same *intent* (the owner explicitly prefers
   reframing to fidelity).
3. **Room prose spot-pass** — titles/doorHints/teasers for all rooms (short,
   high-visibility), plus full prose of the 3 most-visited rooms per the
   Ledger data model (waiting-room, junction, door-that-asks) as the deep
   samples.
4. **Diacritics/typography** — proper „uvozovky", ellipsis …, non-breaking
   spaces after one-letter prepositions (k, s, v, z, a, i, o, u) in headings
   at minimum.

Deliverable: one commit, no key additions/removals — values only — so all
coverage tests stay green by construction. Record notable term decisions in a
short comment block at the top of `cs.ts`.

## 6. R4 — German + French packs (LOWEST priority — may slip to Milestone 6)

Gate: start only when every other M5 phase is done and green.

1. Resolver: `Lang = 'en' | 'cs' | 'fa' | 'de' | 'fr'`; extend `LANGS`,
   `nextLang` cycle order `en → cs → fa → de → fr → en`; `applyLocaleToDocument`
   needs no RTL change (both LTR); fonts: Inter/Spectral cover Latin-Extended —
   verify ě/ß/œ render, no new fonts expected.
2. Packs `de.ts`, `fr.ts` mirroring `cs.ts`'s structure and key inventory
   (~1,500 strings each: UI chrome, acts, barks, all room prose, endings,
   notes, plus every M5 addition). Translate from the English v2 source, not
   from Czech.
3. Settings/HUD language cycles pick the new languages up automatically
   (both use `nextLang`); verify the HUD two-letter label renders "DE"/"FR".
4. Tests: the `LANGS`-driven loops in `i18n.test.ts` /
   `translationCoverage.test.ts` / `uiKeyCoverage.test.ts` — extend their
   language lists; everything else is automatic.

## 7. R5 — Content pipeline & continuity

- **Schema-validation test** (`contentPipeline.test.ts`): walk `allRooms` and
  assert structural invariants that currently rely on discipline: every room
  has ≥1 stage, every stage ≥2 choices, every choice has non-empty `text`,
  `outcome.length ≥ 1`, hints present on all choices of non-gate rooms; every
  `keepsakeId` (spec 04) references a defined keepsake; every `reflections`
  entry (spec 05) uses a legal tradition value.
- **"Twenty rooms" fix:** in the Punchline ending's beats
  (`src/content/endings.ts`), replace the numeral claim with "every room"
  phrasing — update `cs.ts`/`fa.ts` translations of that beat in the same
  commit.

## 8. R6 — Dead-flag audit

| Flag | Set by | Consumer after M5 | Action |
|---|---|---|---|
| `sharp-gambler` | casino-pascal | keepsake trigger (spec 04) | keep |
| `entered-machine` | experience-machine | keepsake trigger (spec 04) + epiphany predicate (spec 06) | keep |
| `erased-memory` | editor | anamnesis exclusion (spec 03) | keep |
| `pushed` | junction | the-echo dynamic beat (spec 02) | keep |
| `kept-bridge` | junction | the-echo dynamic beat (spec 02) | keep |

Add a guard test (`flagAudit.test.ts`): scan room content for `flags:` ids
and assert each appears in at least one consumer (a `hasFlag(` call, keepsake
trigger table, or an allowlist with a justification comment). Future dead
flags then fail CI instead of accumulating.

## 9. R7 — Persona whisper pass (owner: "expand the hints a little… nothing that stirs attention from the doors")

Exactly four insertions, all using the **existing** `{name}` token (plumbing
already live) — never on door screens:

1. One act intro variant: Act III's intro gains a single clause addressing
   `{name}` (the archival wing knowing your name is thematically right).
2. One Usher bark variant: a new low-frequency generic bark
   (`generic7`) that uses `{name}` once — add to the generic rotation and
   `USHER_BARK_IDS`.
3. One ending line: the `return` ending's final beat addresses `{name}` once.
4. The blurb echo inside `the-archive` (already specified in 02 §6 — listed
   here for the audit trail; do not implement twice).

All translated EN+CS+FA with the token preserved verbatim (`{name}` must
survive translation — add a test asserting the token appears in each
language's string).

## 10. Test plan rollup

`flagAudit.test.ts`, `contentPipeline.test.ts`, persona-token test, language
list extensions (R4), plus one deployed-Pages UAT smoke script (R1). Electron
items are manual-verify on a Windows machine (document steps in the PR — the
remote session cannot run the shell).

## 11. Acceptance criteria

- [ ] Public browser URL live and playable; EXE release path unchanged.
- [ ] Electron: remembers window bounds, single instance, real icon.
- [ ] Czech reads as written-in-Czech in every menu; term decisions recorded.
- [ ] Zero dead flags (enforced by CI); persona whispers in exactly four
      places; "twenty rooms" gone.
- [ ] DE/FR either fully shipped or cleanly deferred to M6 with the resolver
      groundwork untouched.
