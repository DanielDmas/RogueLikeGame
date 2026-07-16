// The ContentPack seam (spec `docs/design-limerence/08-engine-pack-architecture.md`).
// One content-agnostic engine, N content packs. A pack is pure data plus a
// small number of pure functions; the engine (flow/scene/ui/audio) never
// hardcodes a room id, ending id, or piece of copy — every such reference
// goes through the active pack. Exactly one pack loads per production build
// (`main.ts`'s `loadPack()` dynamically imports the pack selected by the
// build-time `__PACK__` constant, so Rollup tree-shakes the other pack's
// entire module graph out — verified by grepping a built bundle for the
// other pack's own strings). That guarantee holds for what ships to a
// player; it is NOT a claim about the dev server (which serves both packs'
// modules unbundled, switchable via `?pack=`) or about this codebase's own
// engine code, which must still never hardcode either pack's ids/vocabulary
// — unscoped defaults and shared UI-chrome keys are still a real leak class
// (see `engine/text/keys.ts`'s scoped-key pattern) independent of bundling.
import type { ActId, Ending, Room, RunState, Axis, Reflection } from '../engine/schema';
import type { Diorama } from '../scene/dioramas';
import type { ThemeConfig, ThemeId, MoodType, MoodTint, GuideFigure } from '../scene/themes';
import type { DoorStyle } from '../scene/doors';
import type { ActKey, RoomAccent } from '../audio/soundEngine';
import type { KeepsakeDef } from '../content/keepsakes';
import type { Profile } from '../engine/saveStore';
import type { RoomRegistry } from '../engine/storyEngine';

export type Quality = 'low' | 'high';

export interface EpiphanyDef {
  id: string;
  /** English fallback line, resolved via t(epiphanyKey(id), fallback). */
  fallback: string;
  /** Evaluated once per finished run (`engine/ledger.ts`'s `evaluateEpiphanies`),
   * against the profile with this run's own counters already applied — same
   * contract as `endingRules.evaluate`: pure, read-only, content owns it. */
  predicate(profile: Profile, run: RunState, registry: RoomRegistry, understorySequence: readonly string[]): boolean;
}

export interface ContentPack {
  meta: {
    /** Storage & UAT namespace, e.g. `${id}:profile:traveler`. */
    id: string;
    /** Title-screen word (ui/overlays.ts title-word slot). */
    title: string;
    /** Export/download filename prefix, e.g. `${exportPrefix}-profile-<date>.json`. */
    exportPrefix: string;
  };

  rooms: Room[];
  endings: Ending[];

  graph: {
    prologue: string;
    actPools: Record<Exclude<ActId, 0 | 4>, string[]>;
    gates: Record<Exclude<ActId, 0>, string>;
    act4Sequence: string[];
    understorySequence: string[];
    optionalPerAct: Record<1 | 2 | 3, number>;
    actNamesEn: Record<ActId, string>;
    /** The Hotel Register's display name for the Understory floor —
     * ANAMNESIS's own findings apparatus calls it "The Understory";
     * translated via engine/text/keys.ts's understoryNameKey (spec 08 §3
     * engine-default/pack-override pattern, same as actNamesEn). */
    understoryNameEn: string;
  };

  endingRules: {
    evaluate(s: RunState): string;
    hiddenChoiceAvailable(s: RunState): boolean;
    hiddenDoorUnlocked(s: RunState): boolean;
    computeHiddenEligible(
      allRoomIds: string[],
      understoryIds: string[],
      codexUnlocked: string[],
      keepsakeChoicesTaken: string[],
    ): boolean;
    clarityThreshold: number;
    endingsTotal(endingsSeen: string[]): number;
    epitaphLines(endingsSeen: string[]): string[];
    axisTriptych(s: RunState): [string, string, string];
    /** Ending ids that never appear locked in the codex — hidden entirely
     * (no card, no hint of existing) until the player has actually witnessed
     * them. ANAMNESIS's 7th ending is the one example today. */
    hiddenUntilWitnessed: string[];
  };

  guide: {
    /** The guide's own display name (ANAMNESIS: "Usher", LIMERENCE:
     * "Porter") — the single source of truth for UI strings that need to
     * name the guide directly (e.g. the persona editor's "felt by the
     * {name}" copy). Found in code review (2026-07-15): overlays.ts had
     * been hardcoding this via `packId === 'limerence' ? 'Porter' :
     * 'Usher'` instead of reading it from here, unlike every other
     * pack-scoped string in that same session's fixes. */
    name: string;
    speakerPrefixes: string[];
    doorBark(s: RunState, runsCompleted: number, doorCount?: number, atUnderstoryFork?: boolean): string;
    actIntroText(act: number): string | undefined;
    examinedActBarkFallback: Record<1 | 2 | 3 | 4, string>;
    figure(): GuideFigure;
    /** Shown once per profile, ever, right after the very first heart/Trust
     * loss — a calm explanation so it reads as a mechanic, not a shock.
     * Template string; `{hearts}` is substituted with the count remaining,
     * same token mechanism as every other beat. */
    firstHeartLossBarkFallback: string;
    /** Shown once, at the top of a room resumed mid-stage after a
     * quit-and-reload (spec: `RunState.currentStage` mid-room). */
    rememberedRoomBarkFallback: string;
  };

  skin: {
    heartsSvg: string;
    /** HUD hearts-row `aria-label`/`title` — omit to inherit ANAMNESIS's own
     * "grip on reality" wording (spec 08 §3 engine-default/pack-override
     * pattern). LIMERENCE overrides both with its own Trust framing. */
    heartsAriaLabel?: string;
    heartsTooltip?: string;
    /** HUD lucidity-glow `title` — omit to inherit ANAMNESIS's own wording. */
    lucidityTooltip?: string;
    axisLabels?: Partial<Record<Axis, { negKey: string; posKey: string }>>;
    traditionLabels?: Partial<Record<Reflection['tradition'], string>>;
  };

  /** The onboarding advisory layer (design spec `10-safety-education-
   * charter.md` §2) — shown automatically once (via the existing
   * `Profile.hasSeenAbout`/"Before you begin" mechanism, engine-generic
   * already) and re-viewable from the title menu's About button. Omit for
   * a pack whose subject matter needs no additional advisory beyond
   * ANAMNESIS's own mechanics explainer (ANAMNESIS leaves this undefined
   * and `showAbout` falls back to its original, unchanged content). */
  advisory?: {
    /** One sentence introducing what the game is for. */
    purposeStatement: string;
    /** A short paragraph explaining the core mechanic (hearts/axes/doors)
     * in this pack's own honest terms — kept separate from ANAMNESIS's own
     * wording rather than reusing hardcoded facts (ending counts, etc.)
     * that don't hold for a different pack. */
    mechanicsNote: string;
    /** The themes list, one sentence, comma-separated. */
    themes: string;
    /** The age/content-register note (e.g. minors' storylines are
     * non-explicit). */
    minorsNote: string;
    /** A short, glance-able self-declared age advisory (e.g. "16+ · Mature
     * Themes") shown as a persistent badge on the title screen itself —
     * not just inside the About panel, and not just on a first playthrough.
     * Explicitly self-declared, not an official rating body's classification
     * (no PEGI/ESRB submission has been made); see UPGRADE_PLAN.md's
     * packaging-readiness notes for what a real submission would require. */
    ageAdvisory: string;
    /** "This is fiction, not therapy or advice." register statement. */
    fictionNote: string;
    /** The static, jurisdiction-generic help line. */
    helpLine: string;
    /** No-telemetry restatement. */
    noTelemetry: string;
  };

  keepsakes: KeepsakeDef[];
  keepsakeTriggers: Record<string, string>;
  keepsakeIcons: Record<string, string>;

  /** Expanded field-note articles (owner request, 2026-07-15): a much
   * longer, further-researched piece for a room whose field note cites a
   * real psychological/philosophical source worth reading deeper into —
   * more real-world examples, more citations, written for a player who
   * wants to actually follow the citation rather than just see it named.
   * Keyed by room id; a room absent from this map simply has no "Read
   * more" affordance on its field note. English fallback text lives here
   * (same pattern as `keepsakeTriggers`); the translated body is resolved
   * via `roomArticleKey(id)`. Starting deliberately small (2 rooms per
   * pack, the richest citation trails) rather than attempting every room
   * at once — CLAUDE.md's context-first translation rule means each
   * language version needs real care, not a mechanical pass across dozens
   * of rooms in one sitting. */
  articles: Record<string, { title: string; body: string }>;

  epiphanies: EpiphanyDef[];

  visuals: {
    iconFor(roomId: string): string | undefined;
    endingIcons: Record<string, string>;
    buildTheme(id: ThemeId, quality: Quality): ThemeConfig;
    moodTints: Record<MoodType, MoodTint>;
    /** Each act theme's base fog/background color, without constructing the
     * (expensive) 3D group — used by the doorway light-spill. Keep in sync
     * with `buildTheme`. */
    fogColorByTheme: Record<ThemeId, number>;
    dioramaFor(roomId: string, quality: Quality): Diorama | null;
    /** The `marys-room`/`open-drawer`-style per-choice diorama-accent hooks. */
    dioramaAccentHooks: { roomId: string; choiceId: string }[];
    /** Whether the Settings panel offers a light/dark UI-chrome toggle for
     * this pack (`Settings.theme`). ANAMNESIS's single dark tone is
     * authored, not a default awaiting a light variant — false for it. */
    supportsLightTheme: boolean;
    /** Door frame/slab styling — omit to inherit ANAMNESIS's own carved-wood
     * defaults (spec 08 §3 row 16 pattern: engine default, pack override). */
    doorStyle?: DoorStyle;
  };

  audio: {
    roomAccents: Partial<Record<string, RoomAccent>>;
    /** Chord progressions/mote scales per act (Hz) — omit to inherit the
     * engine's ANAMNESIS-authored defaults (spec 08 §3 row 16). */
    actProgressions?: Record<ActKey, number[][]>;
    actMoteScales?: Record<ActKey, number[]>;
  };

  hooks: {
    /** The final gate room id (ANAMNESIS: `door-that-asks`). */
    finalGateId: string;
    /** The room id whose outcome captures the profile's last-message codex note. */
    lastMessageId: string;
    /** P5: the Ledger's label for that captured line — ANAMNESIS's "Your
     * last message" reads oddly for LIMERENCE's `the-unsent` (an address,
     * not a message), so each pack supplies its own English fallback;
     * translated under a pack-scoped key (`scoped(uiKey('ledgerLastMessage'), packId)`). */
    lastMessageLabel: string;
  };

  /** Side-effect import that registers every translation/version entry for
   * this pack's text catalog before the app renders anything. */
  registerText(): void;
}
