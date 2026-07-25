// The Night Porter's voice (L5 polish: the "door-bark dread pass"). Mirrors
// content/usher.ts's structure exactly (same priority order: understory
// fork > single-door gate > first-choice explainer > second-run wink >
// axis-reactive lines cycling by visited.length > generic pool), re-skinned
// into the Porter's own register — Chattam-flavored dread, hotel-at-3-a.m.
// diction, Trust/Clarity/Head-Heart/Mine-Ours/Grip-Open instead of
// ANAMNESIS's own stat names. Was previously a single static string.
//
// Every bark/act-intro id below is deliberately the SAME id ANAMNESIS's own
// content/usher.ts uses (mirroring its category structure on purpose) — so
// every call here passes 'limerence' as the key's packId. Without it, these
// keys would collide with ANAMNESIS's own registered translations (both
// packs' modules are bundled together; see engine/text/keys.ts's `scoped`
// helper), and a LIMERENCE player in Czech/Farsi/German/French would see the
// Usher's lines instead of the Porter's.
import type { RunState } from '../../engine/schema';
import type { PlayerPatternId } from '../../engine/patterns';
import { t } from '../../engine/text/resolver';
import { usherBarkKey, actIntroKey } from '../../engine/text/keys';

const PACK_ID = 'limerence';
const bark = (id: string) => usherBarkKey(id, PACK_ID);

/** Cross-run recognition lines (master plan Tier 1 item 4) — the Porter's own
 * answer to `content/usher.ts`'s `usherPatternBark`. Same six facts,
 * deliberately not the same sentences: the Usher is a functionary of an
 * archive and notices things about the *place*; the Porter works a night desk
 * and notices things about the *guest*. He is warmer than the Usher and more
 * fatalistic, and his vocabulary is the hotel's — checking in, the ledger,
 * room numbers, the small hours — never ANAMNESIS's corridors and travelers.
 *
 * Like the Usher's, these observe and never score: a returning guest is never
 * praised or warned, only recognised. `keepsakes` are Trust-costing mementos
 * in this pack's fiction too, so the unspent-keepsake line reads them as
 * things carried between nights rather than inventory. */
function limerencePatternBark(pattern: PlayerPatternId): string {
  switch (pattern) {
    case 'same-ending-again':
      return t(
        bark('pattern-same-ending-again'),
        'Porter: You’ve stayed with us a few times now, and checked out the same way every time. I don’t read anything into it. I only notice that the other exits are still there, and none of them are in a hurry.',
      );
    case 'never-spent-a-heart':
      return t(
        bark('pattern-never-spent-a-heart'),
        'Porter: More than one night here, and not one measure of Trust gone from your ledger. Most guests can’t say that. I won’t tell you whether it means you were careful or only quiet.',
      );
    case 'holds-unspent-keepsakes':
      return t(
        bark('pattern-holds-unspent-keepsakes'),
        'Porter: You’re still carrying something from an earlier stay. No one will ask you to put it down. But a thing kept is a thing not spent, and one or two doors here only open for a guest willing to spend it.',
      );
    case 'never-descended':
      return t(
        bark('pattern-never-descended'),
        'Porter: There’s a way down from behind the desk that you’ve never taken. It isn’t locked. It’s just easy to walk past, once you can already see the morning.',
      );
    case 'walked-most-rooms':
      return t(
        bark('pattern-walked-most-rooms'),
        'Porter: You’ve been in nearly every room this hotel keeps. You read the hints the way staff read them now. What’s left is the handful you keep deciding against.',
      );
    case 'returns-to-one-room':
      return t(
        bark('pattern-returns-to-one-room'),
        'Porter: There’s one room you keep asking for. I haven’t asked why and I won’t. But it’s started leaving the light on, and rooms that expect a guest don’t behave like empty ones.',
      );
  }
}

export const LIMERENCE_PATTERN_BARK_IDS = [
  'pattern-same-ending-again',
  'pattern-never-spent-a-heart',
  'pattern-holds-unspent-keepsakes',
  'pattern-never-descended',
  'pattern-walked-most-rooms',
  'pattern-returns-to-one-room',
] as const;

export function limerenceDoorBark(
  s: RunState,
  runsCompleted: number,
  doorCount = 2,
  atUnderstoryFork = false,
  /** See `content/usher.ts`'s own note — the pattern selected for this visit,
   * or `null` when the guest has no history worth remarking on yet. */
  pattern: PlayerPatternId | null = null,
): string {
  if (atUnderstoryFork) {
    return t(
      bark('understory-hint'),
      'Porter: There is a door behind the desk that is not on the floor plan. It was, once. Take it or don’t — it will not ask twice.',
    );
  }

  // Game-experience review (2026-07-19, `15-game-experience-review.md` E2):
  // mirrors ANAMNESIS's content/usher.ts fix — the prologue's threshold is
  // also doorCount 1, but nothing has been skipped to reach it.
  if (doorCount === 1 && s.visited.length === 0) {
    return t(
      bark('first-door'),
      'Porter: Only one door tonight, to start. Nothing’s been skipped — you’ve only just checked in.',
    );
  }

  if (doorCount === 1 && s.visited.length > 0) {
    return t(
      bark('gate-single-door'),
      'Porter: Only one door remains on this stretch of corridor. The others are behind you now — closed, or walked past, which is its own kind of closing. This is simply the one still open.',
    );
  }

  if (runsCompleted === 0 && s.act === 1 && s.visited.length === 1) {
    return t(
      bark('first-choice-explainer'),
      'Porter: Several doors, and only some are yours tonight. Each holds a different night going wrong, not a different score. Choose the one whose question you can actually sit inside.',
    );
  }

  // Mirrors ANAMNESIS's own placement exactly (see content/usher.ts): a
  // returning guest whose history has a shape gets that noticed instead of the
  // generic "you've checked in again", and only here — one recognition per
  // returning night, at the desk, before any door is chosen.
  if (runsCompleted > 0 && s.visited.length <= 1) {
    if (pattern) return limerencePatternBark(pattern);
    return t(
      bark('second-run'),
      'Porter: You’ve checked in again. The desk remembers the room number, even on nights you’d rather it didn’t.',
    );
  }

  const { reasonFeeling, selfOthers, controlAcceptance } = s.axes;
  const candidates: string[] = [];

  if (reasonFeeling <= -30)
    candidates.push(t(bark('reason-low'), 'Porter: You weigh every room before you enter it. The rooms have started weighing you back.'));
  if (reasonFeeling >= 30)
    candidates.push(t(bark('reason-high'), 'Porter: You feel every room here at full volume. The corridor runs warmer for guests like you. That is not a compliment. It is not a warning either.'));
  if (selfOthers <= -30)
    candidates.push(t(bark('self-low'), 'Porter: You keep what’s yours behind a door of its own. Sensible. Ask, some quiet night, what the guarding costs.'));
  if (selfOthers >= 30)
    candidates.push(t(bark('self-high'), 'Porter: You keep handing yourself to whoever’s in the room. Generous of you. There is less of you in the room every time.'));
  if (controlAcceptance <= -30)
    candidates.push(t(bark('control-low'), 'Porter: You fight every room you walk into. I respect it. The rooms have never once noticed.'));
  if (controlAcceptance >= 30)
    candidates.push(t(bark('control-high'), 'Porter: You’ve stopped bracing at the door. That isn’t surrender, whatever it feels like at 3 a.m. It’s a different kind of steady.'));

  if (s.hearts === 1)
    candidates.push(t(bark('one-heart'), 'Porter: One measure of Trust left in your ledger. I’m not permitted to worry aloud. This is the nearest I come.'));
  if (s.lucidity >= 150)
    candidates.push(t(bark('high-lucidity'), 'Porter: You’re seeing this floor clearly now. Clarity is the one thing in this hotel that can’t be faked at the desk.'));

  if (candidates.length > 0) return candidates[s.visited.length % candidates.length];

  const generic = [
    t(bark('generic0'), 'Porter: Choose a door. Every room on this floor is occupied. None of them know that yet.'),
    t(bark('generic1'), 'Porter: Take your time. The Interval doesn’t bill by the hour.'),
    t(bark('generic2'), 'Porter: I could tell you which door I’d take. I’ve taken all of them, some nights more than once.'),
    t(bark('generic3'), 'Porter: The hints above each door are honest. This hotel does not deal in false signs.'),
    t(bark('generic4'), 'Porter: There is no checkout time here. That isn’t meant as a comfort. Take it as one anyway, if it helps.'),
    t(bark('generic5'), 'Porter: Whichever door you skip stays locked, not gone. A different night, perhaps.'),
    t(bark('generic6'), 'Porter: Read the hint before you knock. It’s the only honest warning this floor gives.'),
    t(bark('generic7'), 'Porter: Every guest on this floor believes their door is the only one. The hallway disagrees, {name}.'),
  ];
  return generic[s.visited.length % generic.length];
}

/** Per-floor announcements (L5 polish) — LIMERENCE previously returned
 * `undefined` for every act, so a floor change carried no Porter narration
 * at all beyond the palette shift. Same shape/cadence as ANAMNESIS's
 * `actIntroText`, one line per act, spoken as the elevator doors open. */
export function limerenceActIntroText(act: number): string | undefined {
  const fallback: Record<number, string> = {
    1: 'Ahead: a school hallway at night, lockers standing in for doors, each leaking the particular light of being fifteen and certain it’s forever. A caution, traveler: some of these doors are only feelings — and a few of them cost a measure of Trust anyway.',
    2: 'The corridor cools into something like a city apartment building — thin walls, someone else’s music through the ceiling, every door left slightly ajar on purpose. The room service worth exploring up here comes with a real reservation, and it can cost a measure of Trust.',
    3: 'The carpet thickens. These are the rooms guests keep for years without quite meaning to — a whole life furnished around one unopened question. Some of what waits behind these doors has a price you will feel, {name}, not merely read about.',
    4: 'The fog thins toward something almost like morning. What remains of this floor, and then the desk. What happens here counts twice over, whatever the Porter tells you about the Interval keeping no ledger. Even this close to checkout, a careless door can still cost a measure of Trust.',
  };
  const text = fallback[act];
  if (!text) return undefined;
  return t(actIntroKey(act, PACK_ID), text);
}

export const LIMERENCE_FIRST_HEART_LOSS_BARK_FALLBACK =
  'Porter: There — a measure of Trust, spent. Feel that. The desk keeps an honest ledger, nothing more. You have {hearts} left. Not a countdown to checkout; simply what that door cost.';

export const LIMERENCE_REMEMBERED_ROOM_BARK_FALLBACK = 'Porter: This room remembers you too.';

export const LIMERENCE_RESUMED_MID_ROOM_BARK_FALLBACK =
  "Porter: You stepped away mid-conversation. It's still waiting on you.";
