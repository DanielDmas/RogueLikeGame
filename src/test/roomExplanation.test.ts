import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';

describe('every room stage has a plain-language explanation (the "?" button, spec: room explanations)', () => {
  it('every stage of every room defines a non-empty explanation', () => {
    const missing: string[] = [];
    for (const room of allRooms) {
      room.stages.forEach((stage, si) => {
        if (!stage.explanation || stage.explanation.trim().length === 0) {
          missing.push(`${room.id}.stage${si}`);
        }
      });
    }
    expect(missing, `missing explanation for:\n${missing.join('\n')}`).toEqual([]);
  });

  it('explanations are substantial (a real paragraph, not a stub) and never just repeat the door teaser verbatim', () => {
    const bad: string[] = [];
    for (const room of allRooms) {
      room.stages.forEach((stage, si) => {
        if (!stage.explanation) return;
        if (stage.explanation.length < 120) bad.push(`${room.id}.stage${si} (too short)`);
        if (stage.explanation.trim() === room.teaser.trim()) bad.push(`${room.id}.stage${si} (same as teaser)`);
      });
    }
    expect(bad, `explanations needing attention:\n${bad.join('\n')}`).toEqual([]);
  });
});
