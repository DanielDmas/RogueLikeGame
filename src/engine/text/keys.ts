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
export const roomExplanationKey = (id: string, stage: number) => `room.${id}.stage${stage}.explanation`;
export const roomNoteTitleKey = (id: string) => `room.${id}.note.title`;
export const roomNoteThinkersKey = (id: string) => `room.${id}.note.thinkers`;
export const roomNoteBodyKey = (id: string) => `room.${id}.note.body`;

export const endingTitleKey = (id: string) => `ending.${id}.title`;
export const endingEpitaphKey = (id: string) => `ending.${id}.epitaph`;
export const endingBeatKey = (id: string, beat: number) => `ending.${id}.beat${beat}`;
export const endingNoteTitleKey = (id: string) => `ending.${id}.note.title`;
export const endingNoteThinkersKey = (id: string) => `ending.${id}.note.thinkers`;
export const endingNoteBodyKey = (id: string) => `ending.${id}.note.body`;

// `packId` scopes a key to a specific pack (`pack.meta.id`) — needed only for
// vocabulary genuinely shared *by name* across packs (act numbers, guide-bark
// category ids like "reason-low"). Omitted, or 'anamnesis' itself, resolves
// to the original unscoped key, so ANAMNESIS's existing translations never
// need re-registering; any other pack id gets its own namespace. Without
// this, a second pack reusing the same act-intro/bark id vocabulary (as
// LIMERENCE's guide.ts deliberately does, to mirror ANAMNESIS's structure)
// would silently resolve to ANAMNESIS's own registered translations, since
// both packs' modules are bundled together and register into one shared
// key→text map (see spec 08 — one engine, many packs, one text catalog).
const scoped = (base: string, packId?: string) => (packId && packId !== 'anamnesis' ? `${base}.${packId}` : base);

export const actNameKey = (act: number, packId?: string) => scoped(`act.name.${act}`, packId);
export const actIntroKey = (act: number, packId?: string) => scoped(`act.intro.${act}`, packId);

export const usherBarkKey = (id: string, packId?: string) => scoped(`usher.bark.${id}`, packId);

export const uiKey = (id: string) => `ui.${id}`;

/** P5: the Ledger's last-message row label is pack-specific text (each
 * pack's own `hooks.lastMessageLabel`) sharing the chrome-UI key namespace —
 * scoped the same way act names/intros/barks are, so a second pack's own
 * translation doesn't collide with (or get silently overridden by)
 * ANAMNESIS's registered one. */
export const ledgerLastMessageKey = (packId?: string) => scoped(uiKey('ledgerLastMessage'), packId);

export const keepsakeKey = (id: string, field: 'name' | 'origin') => `keepsake.${id}.${field}`;

/** Spec 05 — The Examined Path. `tradition` is one of Reflection's four
 * literal values ('consequence' | 'duty' | 'virtue' | 'care'). */
export const reflectionKey = (roomId: string, choiceId: string, tradition: string) =>
  `reflection.${roomId}.${choiceId}.${tradition}`;
export const traditionLabelKey = (tradition: string) => `ui.tradition.${tradition}`;

/** Spec 06 — The Traveler's Ledger & Epiphanies. */
export const epiphanyKey = (id: string) => `epiphany.${id}`;

/** T8 — Guest stamps. Generic and identical for both packs (pure counter
 * reads, no pack-specific content), so — unlike epiphanies — these are
 * registered once, unscoped, shared by both packs' bundled text modules. */
export const stampKey = (id: string) => `stamp.${id}`;
