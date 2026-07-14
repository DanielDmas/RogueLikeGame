import { describe, expect, it } from 'vitest';
import { focusTrapTarget } from '../ui/focusTrap';

describe('focusTrapTarget — 9.5.1 overlay focus containment', () => {
  it('does nothing when the container has no focusable elements', () => {
    expect(focusTrapTarget(0, -1, false)).toBeNull();
    expect(focusTrapTarget(0, -1, true)).toBeNull();
  });

  it('pulls focus back in (to the first item) if it escaped the trap on a forward Tab', () => {
    expect(focusTrapTarget(3, -1, false)).toBe(0);
  });

  it('pulls focus back in (to the last item) if it escaped the trap on a Shift+Tab', () => {
    expect(focusTrapTarget(3, -1, true)).toBe(2);
  });

  it('wraps forward Tab from the last item to the first', () => {
    expect(focusTrapTarget(3, 2, false)).toBe(0);
  });

  it('wraps Shift+Tab from the first item to the last', () => {
    expect(focusTrapTarget(3, 0, true)).toBe(2);
  });

  it('leaves ordinary in-between tabbing to the browser default (returns null)', () => {
    expect(focusTrapTarget(5, 1, false)).toBeNull();
    expect(focusTrapTarget(5, 1, true)).toBeNull();
    expect(focusTrapTarget(5, 3, false)).toBeNull();
    expect(focusTrapTarget(5, 3, true)).toBeNull();
  });

  it('a single-item trap always redirects back to itself (index 0) at the boundary', () => {
    expect(focusTrapTarget(1, 0, false)).toBe(0);
    expect(focusTrapTarget(1, 0, true)).toBe(0);
  });

  it('treats an out-of-range active index (stale DOM reference) the same as "escaped"', () => {
    expect(focusTrapTarget(3, 7, false)).toBe(0);
    expect(focusTrapTarget(3, 7, true)).toBe(2);
  });
});
