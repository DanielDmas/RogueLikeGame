// Engine content schema (spec `docs/design-limerence/08-engine-pack-architecture.md`)
// — rooms are pure data; the engine never hardcodes a room. Field names are
// not pack-specific (e.g. `anamnesisEligible`) and are never renamed by a
// pack: they're the serialized save shape, shared by every pack.

export type Axis = 'reasonFeeling' | 'selfOthers' | 'controlAcceptance';
// Convention: negative = first pole (REASON / SELF / CONTROL),
//             positive = second pole (FEELING / OTHERS / ACCEPTANCE).

export type RoomType = 'DILEMMA' | 'INSIGHT' | 'NO-SOLUTION' | 'DOOMED';

export type ActId = 0 | 1 | 2 | 3 | 4;

export interface TranscriptEntry {
  roomId: string;
  stageIndex: number;
  choiceId: string;
  choiceText: string;
  /** The choice's mechanical effects — lets meta-progression features
   * characterize a past choice (e.g. `the-archive`'s exhibit-selection rule)
   * without re-deriving it from room content. Optional: absent on transcript
   * entries recorded before this field existed. */
  effects?: Effects;
}

export interface RunState {
  hearts: number;
  lucidity: number;
  axes: Record<Axis, number>;
  flags: string[];
  visited: string[];
  transcript: TranscriptEntry[];
  currentRoom: string | null;
  /** stage index within currentRoom to resume at; undefined on saves from before this field existed (treat as 0) */
  currentStage?: number;
  /** Per-run salt for door-offer shuffling (storyEngine.ts) — without it, every fresh
   * run's very first offer in a given act would be identical (visited history alone
   * is the same for everyone at that point), which can leave pool members structurally
   * unreachable once a pool grows. Undefined on saves from before this field existed (treat as 0). */
  doorSeed?: number;
  /** Snapshot of the most recently FINISHED run, stamped once by `newRun()` and
   * never mutated mid-run — lets rooms (e.g. `the-cave`) reference "your
   * previous run" without relying on `transcript`, which resets every run.
   * Undefined on a player's first-ever run, or a save from before this field
   * existed; readers must treat both cases as "no previous run to recall". */
  prior?: { runs: number; endingId: string | null; transcript: TranscriptEntry[] };
  /** True once the player has entered the Act IV understory this run (the
   * optional the-archive/the-unchosen/the-echo sequence). Drives which
   * understory room, if any, is offered next — see `offeredDoors`'s act-4
   * branch. Undefined/false means "not descended" (the common case). */
  descended?: boolean;
  /** Keepsakes held at run start — a mirror of `Profile.keepsakes`, stamped
   * once by `newRun()` like `prior`. A keepsake earned mid-run only becomes
   * "held" from the *next* run (spoiler-safe: you cannot earn-and-spend in
   * one run). Undefined/absent means "holding nothing" — the common case. */
  keepsakesHeld?: string[];
  /** Recomputed by flow.ts at the top of `enterRoom` for `door-that-asks` only
   * (the sole place profile-level codex/keepsake data is in scope) — whether
   * the hidden seventh ending is reachable this run. Serialized so a
   * quit-and-resume at the final door keeps the same eligibility. Undefined
   * means "not yet computed", equivalent to false. */
  anamnesisEligible?: boolean;
  /** This run walks the Examined Path (spec 05) — immutable once the run
   * starts (the opt-in panel is only ever offered on a fresh 'new' run, never
   * mid-run). Undefined/false is the common case: no behavior, no reflection
   * cards, no Socratic asides — a player who never opts in sees nothing
   * different, ever. */
  examined?: boolean;
  /** Game-experience review E6 (2026-07-20, `15-game-experience-review.md`
   * §8): on a genuinely first-ever run (`profile.runsCompleted === 0`), the
   * Examined Path offer is deferred past About+Persona to the first
   * reflections-bearing choice, rather than stacking as a third modal
   * before the player's first beat. True only for the single window
   * between run start and that first offer; `enterRoom` clears it the
   * moment the offer is shown (accepted or not). Undefined/false is the
   * common case — every returning-player run, and any run replayed via
   * "Walk again", still offers the panel at the very start, unchanged. */
  examinedOfferPending?: boolean;
  act: ActId;
  /** optional (non-gate) rooms completed in the current act */
  actOptionalDone: number;
  memoryLost: boolean;
  finished: boolean;
  endingId: string | null;
}

export interface Effects {
  lucidity?: number;
  /** negative to lose hearts */
  hearts?: number;
  axes?: Partial<Record<Axis, number>>;
  flags?: string[];
  /** Room 6: permanently lose the memory fragment */
  loseMemory?: boolean;
}

/** A beat of narration. Strings prefixed "USHER: " render as the Usher speaking. */
export type Beat = string | ((s: RunState) => string);

export interface Choice {
  id: string;
  text: string;
  /** a hint of the stakes, never a grade */
  hint?: string;
  effects: Effects;
  outcome: Beat[];
  available?: (s: RunState) => boolean;
  /** Present only on keepsake-gated bonus choices (spec 04) — renders the ✧
   * marker and records into `Profile.keepsakeChoicesTaken` when chosen. */
  keepsakeId?: string;
  /** Plural ethical readings of this choice (spec 05), shown only on the
   * Examined Path, only after the outcome beats finish. Never a verdict —
   * see `Reflection`. Absent on choices the writer judged unsuited to
   * framework readings (chiefly in NO-SOLUTION/DOOMED rooms); a gap here is
   * a deliberate authorial choice, not a bug. */
  reflections?: Reflection[];
}

/** One tradition's reading of a choice — English source text, ≤160 chars,
 * present tense, naming a consideration rather than a verdict ("A
 * consequentialist weighs…", never "You should have…"). Translated via
 * `reflectionKey(roomId, choiceId, tradition)`. */
export interface Reflection {
  tradition: 'consequence' | 'duty' | 'virtue' | 'care';
  text: string;
}

export interface Stage {
  beats: Beat[];
  choices: Choice[];
  /** A plain-language explanation of this stage's situation and question —
   * shown when the player clicks the "?" button beside the text panel.
   * Written for a reader with no philosophy background: what's actually
   * being asked, why it's hard, and a concrete everyday example. Never
   * required reading — the room must stand on its own without it. */
  explanation?: string;
}

export interface FieldNote {
  title: string;
  thinkers: string;
  body: string;
}

export interface Room {
  id: string;
  act: ActId;
  title: string;
  type: RoomType;
  /** carved above the door */
  doorHint: string;
  /** a short, spoiler-free line about the mood/kind of situation behind the door */
  teaser: string;
  stages: Stage[];
  /** Room 19 composes its own note; everything else has one */
  fieldNote?: FieldNote;
  gate?: boolean;
  /** if defined, this door only appears when true (secret doors) */
  secret?: (s: RunState) => boolean;
}

export interface Ending {
  id: string;
  title: string;
  epitaph: string;
  beats: Beat[];
  fieldNote?: FieldNote;
}
