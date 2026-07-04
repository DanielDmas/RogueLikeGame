import { describe, expect, it } from 'vitest';
import type { RunState } from '../content/schema';
import { newRun } from '../engine/gameState';
import { axisTriptych, evaluateEnding, punchlineUnlocked, PUNCHLINE_LUCIDITY } from '../engine/endings';
import { endings, getEnding } from '../content/endings';

function finalChoice(s: RunState, choiceId: string): RunState {
  s.transcript.push({ roomId: 'door-that-asks', stageIndex: 1, choiceId, choiceText: '' });
  return s;
}

describe('endings evaluator', () => {
  it('all six endings exist as content', () => {
    for (const id of ['return', 'open-hand', 'fortress', 'dissolved', 'gardener', 'punchline']) {
      expect(getEnding(id).beats.length).toBeGreaterThan(3);
    }
    expect(endings).toHaveLength(6);
  });

  it('zero hearts always dissolves, regardless of anything else', () => {
    const s = finalChoice(newRun(), 'laughing-door');
    s.hearts = 0;
    s.lucidity = 999;
    s.flags = ['usher-respect'];
    expect(evaluateEnding(s)).toBe('dissolved');
  });

  it('lying down at the threshold dissolves willingly', () => {
    expect(evaluateEnding(finalChoice(newRun(), 'lie-down'))).toBe('dissolved');
  });

  it('staying makes the gardener', () => {
    expect(evaluateEnding(finalChoice(newRun(), 'stay'))).toBe('gardener');
  });

  it('the laughing door yields the punchline', () => {
    expect(evaluateEnding(finalChoice(newRun(), 'laughing-door'))).toBe('punchline');
  });

  it('walking through with balanced axes returns', () => {
    expect(evaluateEnding(finalChoice(newRun(), 'walk-through'))).toBe('return');
  });

  it('others+acceptance extremes give the open hand', () => {
    const s = finalChoice(newRun(), 'walk-through');
    s.axes.selfOthers = 60;
    s.axes.controlAcceptance = 50;
    expect(evaluateEnding(s)).toBe('open-hand');
  });

  it('self+control extremes give the fortress', () => {
    const s = finalChoice(newRun(), 'walk-through');
    s.axes.selfOthers = -60;
    s.axes.controlAcceptance = -50;
    expect(evaluateEnding(s)).toBe('fortress');
  });

  it('mixed extremes still return (no accidental extreme ending)', () => {
    const s = finalChoice(newRun(), 'walk-through');
    s.axes.selfOthers = 60;
    s.axes.controlAcceptance = -50;
    expect(evaluateEnding(s)).toBe('return');
  });

  it('punchline unlock requires both the respect flag and high lucidity', () => {
    const s = newRun();
    expect(punchlineUnlocked(s)).toBe(false);
    s.flags = ['usher-respect'];
    expect(punchlineUnlocked(s)).toBe(false);
    s.lucidity = PUNCHLINE_LUCIDITY;
    expect(punchlineUnlocked(s)).toBe(true);
    s.flags = [];
    expect(punchlineUnlocked(s)).toBe(false);
  });

  it('axis triptych always renders three lines', () => {
    const s = newRun();
    s.axes = { reasonFeeling: -80, selfOthers: 0, controlAcceptance: 80 };
    const lines = axisTriptych(s);
    expect(lines).toHaveLength(3);
    for (const l of lines) expect(l.length).toBeGreaterThan(10);
  });
});
