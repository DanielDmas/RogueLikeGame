import { describe, expect, it } from 'vitest';
import {
  applyEffects,
  choseInPrior,
  LUCIDITY_FLOOR,
  MAX_HEARTS,
  newRun,
  pickExhibitEntry,
  pickShadowMoments,
  pickUnchosenRooms,
} from '../engine/gameState';
import { ACT_POOLS } from '../content/graph';

describe('state reducers', () => {
  it('starts with 3 hearts, 0 lucidity, neutral axes', () => {
    const s = newRun();
    expect(s.hearts).toBe(MAX_HEARTS);
    expect(s.lucidity).toBe(0);
    expect(s.axes).toEqual({ reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 });
  });

  it('applies lucidity and axis deltas immutably', () => {
    const s = newRun();
    const next = applyEffects(s, { lucidity: 15, axes: { selfOthers: 12 } });
    expect(next.lucidity).toBe(15);
    expect(next.axes.selfOthers).toBe(12);
    expect(s.lucidity).toBe(0);
    expect(s.axes.selfOthers).toBe(0);
  });

  it('clamps axes to [-100, 100]', () => {
    let s = newRun();
    for (let i = 0; i < 20; i++) s = applyEffects(s, { axes: { reasonFeeling: -18 } });
    expect(s.axes.reasonFeeling).toBe(-100);
    for (let i = 0; i < 40; i++) s = applyEffects(s, { axes: { reasonFeeling: 18 } });
    expect(s.axes.reasonFeeling).toBe(100);
  });

  it('clamps hearts to [0, MAX]', () => {
    let s = newRun();
    s = applyEffects(s, { hearts: -5 });
    expect(s.hearts).toBe(0);
    s = applyEffects(s, { hearts: +9 });
    expect(s.hearts).toBe(MAX_HEARTS);
  });

  it('drains a heart and resets to the floor when lucidity goes below zero', () => {
    let s = newRun();
    s = applyEffects(s, { lucidity: 10 });
    s = applyEffects(s, { lucidity: -25 });
    expect(s.hearts).toBe(MAX_HEARTS - 1);
    expect(s.lucidity).toBe(LUCIDITY_FLOOR);
  });

  it('deduplicates flags and records memory loss', () => {
    let s = newRun();
    s = applyEffects(s, { flags: ['usher-respect'] });
    s = applyEffects(s, { flags: ['usher-respect'], loseMemory: true });
    expect(s.flags).toEqual(['usher-respect']);
    expect(s.memoryLost).toBe(true);
  });
});

describe('RunState.prior — the previous-run snapshot (Milestone 5, Phase K4)', () => {
  it('newRun() with no prior argument leaves prior undefined (first-ever run / legacy save)', () => {
    expect(newRun().prior).toBeUndefined();
  });

  it('newRun(doorSeed, prior) stamps prior verbatim and leaves it untouched by later effects', () => {
    const prior = { runs: 2, endingId: 'return', transcript: [{ roomId: 'wallet', stageIndex: 0, choiceId: 'take', choiceText: 'Take it.' }] };
    let s = newRun(7, prior);
    expect(s.prior).toEqual(prior);
    s = applyEffects(s, { lucidity: 10, flags: ['x'] });
    expect(s.prior).toEqual(prior); // applyEffects never touches prior
  });
});

describe('pickShadowMoments — the-cave\'s shadow-play selection (Milestone 5, Phase K4)', () => {
  const entry = (roomId: string, choiceId: string) => ({ roomId, stageIndex: 0, choiceId, choiceText: `${roomId}:${choiceId}` });

  it('returns an empty array when prior is undefined', () => {
    expect(pickShadowMoments(undefined)).toEqual([]);
  });

  it('returns an empty array when prior.transcript is empty', () => {
    expect(pickShadowMoments({ runs: 1, endingId: null, transcript: [] })).toEqual([]);
  });

  it('passes a transcript of 3 or fewer entries straight through, unchanged', () => {
    const transcript = [entry('a', '1'), entry('b', '2')];
    expect(pickShadowMoments({ runs: 1, endingId: null, transcript })).toEqual(transcript);
  });

  it('picks first, middle, and last for a longer transcript', () => {
    const transcript = Array.from({ length: 15 }, (_, i) => entry(`room${i}`, 'c'));
    const picked = pickShadowMoments({ runs: 1, endingId: null, transcript });
    expect(picked).toEqual([transcript[0], transcript[7], transcript[14]]);
  });

  // Troll pass, 2026-07-27: `RunState.prior` is deliberately not checked by
  // `isStructurallyValidRun` (it's optional/legacy Ledger-adjacent data), so
  // `prior.transcript` can reach here as anything a corrupted or hand-edited
  // save contains — not just a real array. `?? []` only substitutes for
  // null/undefined, not for "present but wrong type", so this was a real gap
  // until `asTranscript` closed it.
  it('degrades to an empty array rather than crashing when transcript is a non-array truthy value', () => {
    for (const hostile of ['not-an-array', 42, {}, true]) {
      expect(
        pickShadowMoments({ runs: 1, endingId: null, transcript: hostile as never }),
        `transcript=${JSON.stringify(hostile)}`,
      ).toEqual([]);
    }
  });
});

describe('choseInPrior — choseIn against a previous run\'s snapshot (Milestone 5, Phase L)', () => {
  it('is false when prior is undefined', () => {
    expect(choseInPrior(undefined, 'junction', 'push')).toBe(false);
  });

  it('is true only for the exact roomId/choiceId pair recorded in prior.transcript', () => {
    const prior = { runs: 1, endingId: null, transcript: [{ roomId: 'junction', stageIndex: 1, choiceId: 'push', choiceText: 'Push.' }] };
    expect(choseInPrior(prior, 'junction', 'push')).toBe(true);
    expect(choseInPrior(prior, 'junction', 'no-push')).toBe(false);
    expect(choseInPrior(prior, 'ship', 'push')).toBe(false);
  });

  // Troll pass, 2026-07-27: live-reproduced (via the real Continue button,
  // not just seeding state directly) that a non-array prior.transcript
  // crashed with "transcript.find is not a function" — .some() doesn't exist
  // on a string either, and this is the exact call site that threw.
  it('is false, not a throw, when prior.transcript is a non-array truthy value', () => {
    for (const hostile of ['not-an-array', 42, {}, true]) {
      const prior = { runs: 1, endingId: null, transcript: hostile as never };
      expect(() => choseInPrior(prior, 'junction', 'push')).not.toThrow();
      expect(choseInPrior(prior, 'junction', 'push'), `transcript=${JSON.stringify(hostile)}`).toBe(false);
    }
  });
});

describe('pickExhibitEntry — the-archive\'s exhibit-selection rule (Milestone 5, Phase L)', () => {
  it('returns undefined for an empty transcript', () => {
    expect(pickExhibitEntry([])).toBeUndefined();
  });

  // Troll pass, 2026-07-27: THE live-reproduced crash — a save sitting at
  // the-archive with prior.transcript set to a non-array string, loaded via
  // the ordinary Continue button (not jump(), which never carries the saved
  // prior through at all — it re-derives prior fresh from
  // Profile.lastRunTranscript, already sanitized), threw exactly here:
  // "transcript.find is not a function", caught only by the crash-recovery
  // overlay rather than the room rendering. This is the function whose
  // signature this repo's own convention would have you trust
  // (`TranscriptEntry[]`) but that turned out to matter for real, since it
  // sits directly downstream of save-file content.
  it('degrades to undefined rather than crashing when given a non-array truthy value', () => {
    for (const hostile of ['not-an-array', 42, {}, true]) {
      expect(() => pickExhibitEntry(hostile)).not.toThrow();
      expect(pickExhibitEntry(hostile), `transcript=${JSON.stringify(hostile)}`).toBeUndefined();
    }
  });

  it('a heart-costing choice always wins, even over a larger lucidity swing elsewhere', () => {
    const transcript = [
      { roomId: 'a', stageIndex: 0, choiceId: '1', choiceText: 'big lucidity', effects: { lucidity: 40 } },
      { roomId: 'b', stageIndex: 0, choiceId: '2', choiceText: 'heart cost', effects: { hearts: -1, lucidity: 5 } },
      { roomId: 'c', stageIndex: 0, choiceId: '3', choiceText: 'small lucidity', effects: { lucidity: 8 } },
    ];
    expect(pickExhibitEntry(transcript)?.choiceText).toBe('heart cost');
  });

  it('with no heart cost anywhere, the largest |lucidity| swing wins', () => {
    const transcript = [
      { roomId: 'a', stageIndex: 0, choiceId: '1', choiceText: 'small', effects: { lucidity: 8 } },
      { roomId: 'b', stageIndex: 0, choiceId: '2', choiceText: 'biggest', effects: { lucidity: -40 } },
      { roomId: 'c', stageIndex: 0, choiceId: '3', choiceText: 'medium', effects: { lucidity: 20 } },
    ];
    expect(pickExhibitEntry(transcript)?.choiceText).toBe('biggest');
  });

  it('with no heart cost and no lucidity swing anywhere, the final entry wins', () => {
    const transcript = [
      { roomId: 'a', stageIndex: 0, choiceId: '1', choiceText: 'first', effects: {} },
      { roomId: 'b', stageIndex: 0, choiceId: '2', choiceText: 'last', effects: {} },
    ];
    expect(pickExhibitEntry(transcript)?.choiceText).toBe('last');
  });

  it('entries with no recorded effects (legacy transcript) degrade to the final-entry rule', () => {
    const transcript = [
      { roomId: 'a', stageIndex: 0, choiceId: '1', choiceText: 'first' },
      { roomId: 'b', stageIndex: 0, choiceId: '2', choiceText: 'last' },
    ];
    expect(pickExhibitEntry(transcript)?.choiceText).toBe('last');
  });
});

describe('pickUnchosenRooms — the-unchosen\'s door-corridor selection (Milestone 5, Phase L)', () => {
  it('with prior undefined, treats the whole pool as "unchosen" (nothing was entered) and still returns up to 3 candidates', () => {
    const { candidates, opens } = pickUnchosenRooms(undefined);
    expect(candidates.length).toBe(3);
    expect(opens).toBe(candidates[0]);
  });

  it('returns no candidates when every act I-III pool room was visited', () => {
    const allPoolIds = [...ACT_POOLS[1], ...ACT_POOLS[2], ...ACT_POOLS[3]];
    const transcript = allPoolIds.map((roomId) => ({ roomId, stageIndex: 0, choiceId: 'x', choiceText: '' }));
    expect(pickUnchosenRooms({ runs: 1, endingId: null, transcript }).candidates).toEqual([]);
  });

  it('returns up to 3 candidates drawn only from rooms genuinely absent from the transcript', () => {
    const allPoolIds = [...ACT_POOLS[1], ...ACT_POOLS[2], ...ACT_POOLS[3]];
    const visited = new Set(allPoolIds.slice(0, allPoolIds.length - 2)); // leave exactly 2 unchosen
    const transcript = [...visited].map((roomId) => ({ roomId, stageIndex: 0, choiceId: 'x', choiceText: '' }));
    const { candidates, opens } = pickUnchosenRooms({ runs: 1, endingId: null, transcript });
    expect(candidates.length).toBe(2);
    for (const id of candidates) expect(visited.has(id)).toBe(false);
    expect(opens).toBe(candidates[0]);
  });

  it('is deterministic for the same prior.runs value (repeat visits see the same candidates)', () => {
    const prior = { runs: 3, endingId: null, transcript: [] };
    expect(pickUnchosenRooms(prior)).toEqual(pickUnchosenRooms(prior));
  });
});
