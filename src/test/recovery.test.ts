import { describe, expect, it } from 'vitest';
import { shouldTriggerRecovery } from '../engine/recovery';

describe('recovery overlay guard (Milestone 5, Phase S §S6)', () => {
  it('triggers on the first failure', () => {
    expect(shouldTriggerRecovery(false)).toBe(true);
  });

  it('does not trigger again once already shown', () => {
    expect(shouldTriggerRecovery(true)).toBe(false);
  });
});
