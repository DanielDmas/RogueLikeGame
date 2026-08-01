import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Resolution of the four owner-decision items flagged in
// `18-extended-code-review-2026-08-01.md` (U-4, E-3, E-6, R3-1) — see that
// doc's "Resolution" section for the full rationale behind each call. E-6
// (R4 comment carve-out) and R3-1 (the-armored balance) are documentation/
// comment-only changes with no new runtime behavior to assert here; the
// hydrateProfile coercion for `personaOffered` is covered behaviorally in
// hostileSaves.test.ts. This file covers the two real behavior changes that
// live in DOM-dependent code (flow.ts), using this repo's established
// source-shape convention (fixBatch20260721, extendedReviewBatch3) since
// vitest runs with no DOM.

const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');
const saveStoreSrc = readFileSync(new URL('../engine/saveStore.ts', import.meta.url), 'utf8');

describe('U-4 — persona Skip is sticky: the editor gates on personaOffered, not on whether a name was entered', () => {
  it("start()'s 'new' branch checks !this.profile.personaOffered, not !this.profile.persona.name", () => {
    const idx = flowSrc.indexOf("if (action === 'new' && !this.profile.personaOffered)");
    expect(idx, 'personaOffered gate not found').toBeGreaterThan(-1);
    // The old, non-sticky gate must be gone from this call site.
    expect(flowSrc).not.toContain("if (action === 'new' && !this.profile.persona.name)");
  });

  it('the gate sets personaOffered = true after showing the editor, regardless of Skip vs a chosen name', () => {
    const idx = flowSrc.indexOf("if (action === 'new' && !this.profile.personaOffered)");
    const body = flowSrc.slice(idx, flowSrc.indexOf('\n        }', idx));
    expect(body).toContain('this.profile.persona = await showPersona(');
    expect(body).toContain('this.profile.personaOffered = true;');
  });

  it('Profile.personaOffered is declared and defaultProfile() initializes it false', () => {
    expect(saveStoreSrc).toContain('personaOffered: boolean;');
    expect(saveStoreSrc).toContain('personaOffered: false,');
  });
});

describe('E-3 — One Door mode carries the player\'s actually-held keepsakes into its throwaway RunState', () => {
  it('playOneDoor threads keepsakesFromProfile() into newRun(), not an empty/undefined keepsakesHeld', () => {
    const startIdx = flowSrc.indexOf('private async playOneDoor(');
    expect(startIdx, 'playOneDoor not found').toBeGreaterThan(-1);
    const endIdx = flowSrc.indexOf('\n  }', startIdx);
    const body = flowSrc.slice(startIdx, endIdx);
    expect(body).toContain('this.state = { ...newRun(undefined, undefined, this.keepsakesFromProfile()), act: room.act };');
  });
});
