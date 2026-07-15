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

/** Expanded field-note articles (2026-07-15) — the "Read more" long-form
 * piece for a room whose field note cites a real source. Only rooms
 * present in `ContentPack.articles` register text under this key. */
export const roomArticleTitleKey = (id: string) => `room.${id}.article.title`;
export const roomArticleBodyKey = (id: string) => `room.${id}.article.body`;

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

/** The Hotel Register's Understory-floor label — same engine-default/
 * pack-override pattern as actNameKey (a graph section's own display
 * name, not generic UI chrome): ANAMNESIS's own findings apparatus calls
 * this "The Understory"; LIMERENCE's in-fiction name for the identical
 * structural section (graph.understorySequence) is "The Records Office"
 * (see packs/limerence/rooms/understory.ts's own header). Found as a
 * real bug (2026-07-15) — the Register overlay had this hardcoded to
 * ANAMNESIS's name for both packs. */
export const understoryNameKey = (packId?: string) => scoped('graph.understoryName', packId);

export const usherBarkKey = (id: string, packId?: string) => scoped(`usher.bark.${id}`, packId);

export const uiKey = (id: string) => `ui.${id}`;

/** P5: the Ledger's last-message row label is pack-specific text (each
 * pack's own `hooks.lastMessageLabel`) sharing the chrome-UI key namespace —
 * scoped the same way act names/intros/barks are, so a second pack's own
 * translation doesn't collide with (or get silently overridden by)
 * ANAMNESIS's registered one. */
export const ledgerLastMessageKey = (packId?: string) => scoped(uiKey('ledgerLastMessage'), packId);

/** T9: the "One Door" title-menu button — both packs show it and share the
 * same English fallback (the door-choosing mechanic is identical vocabulary
 * in both games), but each still needs its own registered translation, so
 * this is scoped the same way ledgerLastMessageKey is. */
export const oneDoorButtonKey = (packId?: string) => scoped(uiKey('oneDoorButton'), packId);

/** Found as a real bug alongside the item-21 UI-chrome audit (2026-07-15):
 * these three HUD/persona strings each have per-pack English fallback text
 * (`pack.skin.heartsTooltip`, and the persona-editor copy) that names the
 * pack's own guide — "the Usher" for ANAMNESIS, "the Porter" for LIMERENCE —
 * but were registered under a single unscoped `uiKey(...)`, so a second
 * pack's translation would silently collide with (or lose to) ANAMNESIS's
 * own registered one wherever both packs' modules are loaded together, and
 * copying ANAMNESIS's translated text as-is would leak "Usher" vocabulary
 * into a LIMERENCE build. Scoped the same way ledgerLastMessageKey/
 * oneDoorButtonKey are. */
export const heartsTooltipKey = (packId?: string) => scoped(uiKey('heartsTooltip'), packId);
export const personaAboutLabelKey = (packId?: string) => scoped(uiKey('personaAboutLabel'), packId);
export const personaSubKey = (packId?: string) => scoped(uiKey('personaSub'), packId);

/** Found as a real bug in code review (2026-07-15): these two were left
 * unscoped when their siblings above were fixed, so LIMERENCE's translated
 * builds (cs/de/fa/fr) fell through to ANAMNESIS's registered "grip on
 * reality"/lucidity text instead of a translation of LIMERENCE's own
 * "Trust"/"Clarity" English fallback (`pack.skin.heartsAriaLabel`/
 * `pack.skin.lucidityTooltip`). Scoped the same way. */
export const heartsAriaLabelKey = (packId?: string) => scoped(uiKey('heartsAriaLabel'), packId);
export const lucidityTooltipKey = (packId?: string) => scoped(uiKey('lucidityTooltip'), packId);

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
