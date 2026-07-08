// The ContentPack seam (spec `docs/design-limerence/08-engine-pack-architecture.md`).
// One content-agnostic engine, N content packs. A pack is pure data plus a
// small number of pure functions; the engine (flow/scene/ui/audio) never
// hardcodes a room id, ending id, or piece of copy — every such reference
// goes through the active pack. Exactly one pack loads per build
// (`__PACK__`), so there is never a key-collision or cross-pack leak to
// guard against at runtime.
import type { ActId, Ending, Room, RunState, Axis, Reflection } from '../engine/schema';
import type { Diorama } from '../scene/dioramas';
import type { ThemeConfig, ThemeId, MoodType, MoodTint, GuideFigure } from '../scene/themes';
import type { DoorStyle } from '../scene/doors';
import type { ActKey, RoomAccent } from '../audio/soundEngine';
import type { KeepsakeDef } from '../content/keepsakes';

export type Quality = 'low' | 'high';

export interface EpiphanyDef {
  id: string;
  /** English fallback line, resolved via t(epiphanyKey(id), fallback). */
  fallback: string;
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
    speakerPrefixes: string[];
    doorBark(s: RunState, runsCompleted: number, doorCount?: number, atUnderstoryFork?: boolean): string;
    actIntroText(act: number): string | undefined;
    examinedActBarkFallback: Record<1 | 2 | 3 | 4, string>;
    figure(): GuideFigure;
  };

  skin: {
    heartsSvg: string;
    axisLabels?: Partial<Record<Axis, { negKey: string; posKey: string }>>;
    traditionLabels?: Partial<Record<Reflection['tradition'], string>>;
  };

  keepsakes: KeepsakeDef[];
  keepsakeTriggers: Record<string, string>;
  keepsakeIcons: Record<string, string>;

  epiphanies: EpiphanyDef[];

  visuals: {
    iconFor(roomId: string): string | undefined;
    endingIcons: Record<string, string>;
    buildTheme(id: ThemeId): ThemeConfig;
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
  };

  /** Side-effect import that registers every translation/version entry for
   * this pack's text catalog before the app renders anything. */
  registerText(): void;
}
