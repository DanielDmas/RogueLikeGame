import { describe, expect, it } from 'vitest';
import { arrowNavIndex } from '../ui/choices';

describe('arrowNavIndex — 9.5.3 up/down navigation between door/choice cards', () => {
  it('with nothing focused, ArrowDown lands on the first card', () => {
    expect(arrowNavIndex(3, -1, 'down')).toBe(0);
  });

  it('with nothing focused, ArrowUp lands on the last card', () => {
    expect(arrowNavIndex(3, -1, 'up')).toBe(2);
  });

  it('ArrowDown advances to the next card', () => {
    expect(arrowNavIndex(3, 0, 'down')).toBe(1);
    expect(arrowNavIndex(3, 1, 'down')).toBe(2);
  });

  it('ArrowUp retreats to the previous card', () => {
    expect(arrowNavIndex(3, 2, 'up')).toBe(1);
    expect(arrowNavIndex(3, 1, 'up')).toBe(0);
  });

  it('ArrowDown wraps from the last card to the first', () => {
    expect(arrowNavIndex(3, 2, 'down')).toBe(0);
  });

  it('ArrowUp wraps from the first card to the last', () => {
    expect(arrowNavIndex(3, 0, 'up')).toBe(2);
  });

  it('a single-card group always resolves back to itself', () => {
    expect(arrowNavIndex(1, 0, 'down')).toBe(0);
    expect(arrowNavIndex(1, 0, 'up')).toBe(0);
    expect(arrowNavIndex(1, -1, 'down')).toBe(0);
  });

  it('an empty group returns -1 regardless of direction', () => {
    expect(arrowNavIndex(0, -1, 'down')).toBe(-1);
    expect(arrowNavIndex(0, -1, 'up')).toBe(-1);
  });
});
