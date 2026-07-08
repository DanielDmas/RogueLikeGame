# Spec 08 — Engine / Content-Pack Architecture (Milestone L1)

**Goal:** one content-agnostic engine, two content packs (ANAMNESIS,
LIMERENCE), a third pack someday being pure content work. **Hard gate:**
the refactor must be *behavior-neutral for ANAMNESIS* — the full existing
test suite (476 at time of writing) green throughout, with tests that
touch room ids/counts parameterized rather than duplicated.

## 1. Verified premise (grep-audited)

- `src/content/schema.ts` is already content-agnostic ("rooms are pure
  data; the engine never hardcodes a room"). **No schema field is renamed
  by this refactor** — `hearts`, `lucidity`, `memoryLost`,
  `anamnesisEligible` keep their names engine-wide; packs re-label display
  strings only. (Renaming serialized fields would break save migration for
  zero player value.)
- `src/content/graph.ts` is pure pack config already.
- `src/main.ts` is the single boot point.

## 2. The `ContentPack` interface (`src/packs/types.ts`)

```ts
export interface ContentPack {
  meta: {
    id: string;                    // 'anamnesis' | 'limerence' — storage & UAT namespace
    title: string;                 // 'ANAMNESIS' (overlays.ts:45 title word)
    taglineKey: string;            // ui key for the title tagline
    exportPrefix: string;          // profile-export filename prefix
  };
  rooms: Room[];                   // includes prologue, gates, secrets, understory
  endings: Ending[];
  graph: {
    prologue: string;
    actPools: Record<1 | 2 | 3, string[]>;
    gates: Record<1 | 2 | 3 | 4, string>;
    act4Sequence: string[];
    understorySequence: string[];
    optionalPerAct: Record<1 | 2 | 3, number>;
    actNamesEn: Record<ActId, string>;
  };
  endingRules: {
    evaluate(s: RunState): string;             // evaluateEnding body
    hiddenChoiceAvailable(s: RunState): boolean; // anamnesisAvailable analog
    hiddenDoorUnlocked(s: RunState): boolean;    // punchlineUnlocked analog
    computeHiddenEligible(/* profile inputs */): boolean;
    clarityThreshold: number;                    // ANAMNESIS_LUCIDITY analog
    endingsTotal(seen: string[]): number;        // 6-until-witnessed rule
  };
  guide: {
    speakerPrefixes: string[];     // textPanel SPEAKER_PREFIXES
    doorBark(/* usherDoorBark signature */): string;
    examinedAsides: Record<1 | 2 | 3 | 4, string>;
    figure(): GuideFigure;         // usherFigure analog (lantern API kept)
  };
  skin: {
    heartsLabelKey: string; heartsSvg: string;   // hud re-skin
    lucidityLabelKey: string;
    axisLabels: Record<Axis, { negKey: string; posKey: string }>;
    traditionLabels: Record<Reflection['tradition'], string>; // EN fallbacks
  };
  keepsakes: KeepsakeDef[];        // incl. KEEPSAKE_TRIGGERS mapping
  epiphanies: EpiphanyDef[];
  visuals: {
    iconFor(id: string): string;
    endingIcons: Record<string, string>;
    buildTheme(id: ThemeId): ThemeConfig;
    moodTints: Record<MoodType, MoodTint>;
    dioramaFor(roomId: string, quality: Quality): Diorama | null;
    dioramaAccentHooks: { roomId: string; choiceId: string }[]; // marys-room pattern
  };
  audio: {
    actProgressions?: typeof ACT_PROGRESSIONS;  // optional overrides; engine defaults apply
    actMoteScales?: typeof ACT_MOTE_SCALES;
    roomAccents: Partial<Record<string, RoomAccent>>; // flow ROOM_ACCENT_BY_ID
  };
  hooks: {
    finalGateId: string;           // flow's 'door-that-asks' sites
    lastMessageId: string;         // flow's 'last-message' site
  };
  registerText(): void;            // side-effect import of the pack's text/ tree
}
```

Notes:
- The **text resolver stays engine** (`content/text/resolver.ts` +
  `keys.ts` move to `engine/text/`); each pack owns its registration tree
  (`src/packs/<id>/text/`). One pack loads per build → no key collisions.
- `Beat`, `Room`, `RunState` etc. stay in a shared `engine/schema.ts`
  (moved from `content/schema.ts`; import paths updated mechanically).

## 3. Coupling inventory → migration list (grep-verified)

| # | Current coupling | File(s) | Migration |
|---|---|---|---|
| 1 | Room/ending imports | `content/rooms/*`, `content/endings.ts` | move under `packs/anamnesis/`; engine consumes `pack.rooms`/`pack.endings` |
| 2 | Graph constants | `content/graph.ts` | → `pack.graph`; `actName()` reads pack |
| 3 | `'door-that-asks'` eligibility recompute | `engine/flow.ts` enterRoom | → `pack.hooks.finalGateId` + `pack.endingRules.computeHiddenEligible` |
| 4 | `'last-message'` codex-note capture | `engine/flow.ts` | → `pack.hooks.lastMessageId` |
| 5 | `'marys-room'`+`'open-drawer'` accent | `engine/flow.ts` | → `pack.visuals.dioramaAccentHooks` |
| 6 | `UNDERSTORY_SEQUENCE` import + descent styling | `engine/flow.ts`, `engine/storyEngine.ts` | → `pack.graph.understorySequence` |
| 7 | `EXAMINED_ACT_BARK_FALLBACK` | `engine/flow.ts` | → `pack.guide.examinedAsides` |
| 8 | `ROOM_ACCENT_BY_ID` | `engine/flow.ts` | → `pack.audio.roomAccents` |
| 9 | `SPEAKER_PREFIXES` | `ui/textPanel.ts` | → `pack.guide.speakerPrefixes` (injected at Game construction) |
| 10 | `evaluateEnding`/`anamnesisAvailable`/`punchlineUnlocked`/`ANAMNESIS_LUCIDITY`/`endingsTotal` | `engine/endings.ts` | bodies → `packs/anamnesis/endingRules.ts`; engine keeps `epitaphLines`, `axisTriptych` helpers (pack passes axis mapping) |
| 11 | `KEEPSAKE_TRIGGERS` + `KEEPSAKES` | `content/keepsakes.ts` | → `pack.keepsakes` |
| 12 | Epiphany definitions | `engine/ledger.ts` | definitions → pack; `evaluateEpiphanies` machinery stays engine |
| 13 | `iconFor`/`endingIcons` | `content/icons.ts` | → `pack.visuals` |
| 14 | Diorama REGISTRY | `scene/dioramas.ts` | registry → pack; `Diorama` type + budget rules stay engine |
| 15 | `buildTheme`/`MOOD_TINTS`/`FOG_COLOR_BY_THEME`/`usherFigure` | `scene/themes.ts` | theme builders + figure → pack; types + lantern rig stay engine |
| 16 | `ACT_PROGRESSIONS`/`ACT_MOTE_SCALES` | `audio/soundEngine.ts` | become engine *defaults*; pack may override |
| 17 | Storage key `anamnesis:profile:` + `PROFILE_ID` | `engine/localSave.ts`, `flow.ts`, tests, `tests/uat/_helpers.mjs` | key = `${pack.meta.id}:profile:traveler`; UAT helpers read `UAT_PACK` env (default `anamnesis`) |
| 18 | `__anamnesisUat` handle + `anamnesis-uat-autocontinue` | `engine/uatMode.ts`, `flow.ts`, UAT scripts | engine-generic `__gameUat` with `__anamnesisUat` back-compat alias; autocontinue key namespaced by pack id |
| 19 | Title word `'ANAMNESIS'`, export filename | `ui/overlays.ts` (:45, :378) | → `pack.meta.title` / `exportPrefix` |
| 20 | Endings-gallery hide rule (`anamnesis` id) | `ui/overlays.ts` (:719) | → generic: hide ids where `pack.endingRules.endingsTotal` logic says hidden-until-seen |
| 21 | Hearts SVG + hearts-explained copy | `ui/dom.ts` (HEART_SVG), `ui/hud.ts`, `ui/overlays.ts` | → `pack.skin.heartsSvg`; copy via pack ui keys |
| 22 | `index.html` title/lang | root | per-build via Vite plugin/transform from `pack.meta` |
| 23 | Save schema | `engine/saveStore.ts` | **no change** — profiles are pack-namespaced by storage key; `PROFILE_SCHEMA_VERSION` unchanged; both packs share migration machinery |

## 4. Boot & build

- `src/main.ts`: `const pack = await loadPack(__PACK__)` (static import
  map — two entries; Vite tree-shakes the unused pack per build).
- `vite.config.ts`: `define: { __PACK__: JSON.stringify(env.VITE_PACK ?? 'anamnesis') }`.
- Scripts: `dev`/`dev:limerence`, `build` (loops both packs →
  `dist/anamnesis/`, `dist/limerence/`), UAT: `UAT_PACK` env consumed by
  `tests/uat/_helpers.mjs` (`PROFILE_KEY`, `BASE_URL` path).
- Dev-only `?pack=` override permitted behind `import.meta.env.DEV`.
- Pages deploy: both subpaths from one workflow run; ANAMNESIS's existing
  URL must not change (redirect from root if the root previously served
  it).
- Electron (R2 lineage): builds ANAMNESIS only until LIMERENCE ships L5;
  then a `--pack` build matrix.

## 5. Migration order (within L1)

1. Move `schema.ts` + text resolver/keys → `src/engine/` (mechanical;
   import-path commit).
2. Introduce `ContentPack` type + `packs/anamnesis/` assembling the
   existing modules *by re-export* (no content edits).
3. Thread `pack` through `Game` constructor + the 23 coupling sites, one
   PR-sized commit per subsystem (flow hooks → ui skin → visuals/audio →
   namespaces), tests green after each.
4. Parameterize tests: `describe.each(packs)` for `contentPipeline`,
   `graph`, `flagAudit`, `dioramas`, `translationCoverage` (LIMERENCE
   rows land empty-but-wired in L1); `saveIntegrity`/uat helpers read the
   namespace from pack id.
5. Add the `packs/limerence/` skeleton (meta + empty registries) so L2
   starts from a booting shell.

## 6. Acceptance criteria (L1)

- [ ] `npm run dev` serves ANAMNESIS byte-identically (UAT scripts 01–13
      pass unmodified except helper namespace plumbing).
- [ ] `npm run dev:limerence` boots to a title screen reading LIMERENCE
      with placeholder content, proving the seam.
- [ ] Full suite green; no test deleted; count ≥ current.
- [ ] `grep -ri 'anamnesis' src/engine src/scene src/ui src/audio` returns
      only the back-compat UAT alias and comments.
- [ ] A one-page "how to add a third pack" section appended to this doc,
      derived from what L1 actually required.
