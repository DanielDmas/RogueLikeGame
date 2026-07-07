// Stable key builders for the text catalog. Keeping construction in one place
// means the room/ending/UI code and the translation packs can't drift apart
// by typo.

export const roomTitleKey = (id: string) => `room.${id}.title`;
export const roomDoorHintKey = (id: string) => `room.${id}.doorHint`;
export const roomTeaserKey = (id: string) => `room.${id}.teaser`;
export const roomBeatKey = (id: string, stage: number, beat: number) => `room.${id}.stage${stage}.beat${beat}`;
export const roomChoiceTextKey = (id: string, choiceId: string) => `room.${id}.choice.${choiceId}.text`;
export const roomChoiceHintKey = (id: string, choiceId: string) => `room.${id}.choice.${choiceId}.hint`;
export const roomChoiceOutcomeKey = (id: string, choiceId: string, beat: number) =>
  `room.${id}.choice.${choiceId}.outcome${beat}`;
export const roomNoteTitleKey = (id: string) => `room.${id}.note.title`;
export const roomNoteThinkersKey = (id: string) => `room.${id}.note.thinkers`;
export const roomNoteBodyKey = (id: string) => `room.${id}.note.body`;

export const endingTitleKey = (id: string) => `ending.${id}.title`;
export const endingEpitaphKey = (id: string) => `ending.${id}.epitaph`;
export const endingBeatKey = (id: string, beat: number) => `ending.${id}.beat${beat}`;
export const endingNoteTitleKey = (id: string) => `ending.${id}.note.title`;
export const endingNoteThinkersKey = (id: string) => `ending.${id}.note.thinkers`;
export const endingNoteBodyKey = (id: string) => `ending.${id}.note.body`;

export const actNameKey = (act: number) => `act.name.${act}`;
export const actIntroKey = (act: number) => `act.intro.${act}`;

export const usherBarkKey = (id: string) => `usher.bark.${id}`;

export const uiKey = (id: string) => `ui.${id}`;

export const keepsakeKey = (id: string, field: 'name' | 'origin') => `keepsake.${id}.${field}`;

/** Spec 05 — The Examined Path. `tradition` is one of Reflection's four
 * literal values ('consequence' | 'duty' | 'virtue' | 'care'). */
export const reflectionKey = (roomId: string, choiceId: string, tradition: string) =>
  `reflection.${roomId}.${choiceId}.${tradition}`;
export const traditionLabelKey = (tradition: string) => `ui.tradition.${tradition}`;

/** Spec 06 — The Traveler's Ledger & Epiphanies. */
export const epiphanyKey = (id: string) => `epiphany.${id}`;
