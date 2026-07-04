// ANAMNESIS content schema — rooms are pure data; the engine never hardcodes a room.

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
}

export interface RunState {
  hearts: number;
  lucidity: number;
  axes: Record<Axis, number>;
  flags: string[];
  visited: string[];
  transcript: TranscriptEntry[];
  currentRoom: string | null;
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
}

export interface Stage {
  beats: Beat[];
  choices: Choice[];
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
