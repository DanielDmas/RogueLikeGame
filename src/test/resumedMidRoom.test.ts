import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';

/**
 * Game-experience review E1 (2026-07-19, `15-game-experience-review.md`):
 * a mid-room save resume used to replay the whole act-intro paragraph and
 * Socratic aside (already heard earlier the same run, before the reload),
 * then drop the player mid-scene with zero acknowledgement they were
 * picking up a thread rather than freshly arriving. `flow.ts` needs a real
 * DOM/canvas/AudioContext to construct a `Game`, so — matching this repo's
 * existing convention for such logic (`interludeTiming.test.ts`,
 * `recovery.test.ts`) — these assert the fix's shape directly against the
 * source rather than driving a live Game instance.
 */

const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');

describe('resumedFromSave flag set only on a genuine save resume', () => {
  it('the field exists, defaulting to false', () => {
    expect(flowSrc).toMatch(/private resumedFromSave = false;/);
  });

  it('is set true on the UAT jump() autocontinue resume path', () => {
    const idx = flowSrc.indexOf('this.state = this.profile.run;\n      this.resumedFromSave = true;');
    expect(idx, 'UAT autocontinue path must set resumedFromSave right after loading profile.run').toBeGreaterThan(-1);
  });

  it('is set true on the title screen "continue" resume path', () => {
    const idx = flowSrc.indexOf(
      "action === 'continue' && this.profile.run && isResumableRun(this.profile.run, this.registry)) {\n          this.state = this.profile.run;\n          this.resumedFromSave = true;",
    );
    expect(idx, '"continue" action must set resumedFromSave right after loading profile.run').toBeGreaterThan(-1);
  });
});

describe('runLoop() consumes resumedFromSave only in the mid-room (pending) branch', () => {
  it('runLoop exists and contains the pending-room resume branch', () => {
    const loopIdx = flowSrc.indexOf('private async runLoop(');
    expect(loopIdx).toBeGreaterThan(-1);
    const pendingIdx = flowSrc.indexOf('const pending = this.state.currentRoom;', loopIdx);
    expect(pendingIdx).toBeGreaterThan(loopIdx);
  });

  it('syncTheme(resuming) and enterRoom(..., resuming) are both called inside the pending branch', () => {
    const pendingIdx = flowSrc.indexOf('const pending = this.state.currentRoom;');
    const continueIdx = flowSrc.indexOf('continue;', pendingIdx);
    const branch = flowSrc.slice(pendingIdx, continueIdx);
    expect(branch).toContain('await this.syncTheme(resuming);');
    expect(branch).toContain('await this.enterRoom(this.registry.get(pending), resuming);');
  });

  it('the offeredDoors (between-doors) branch calls syncTheme with no resuming argument', () => {
    const doorsIdx = flowSrc.indexOf('const doors = offeredDoors(');
    const syncIdx = flowSrc.indexOf('await this.syncTheme(', doorsIdx);
    const call = flowSrc.slice(syncIdx, flowSrc.indexOf(';', syncIdx) + 1);
    expect(call).toBe('await this.syncTheme();');
  });
});

describe('syncTheme(resuming) suppresses the act intro + Socratic aside, but not the interlude', () => {
  const startIdx = flowSrc.indexOf('private async syncTheme(');
  const endIdx = flowSrc.indexOf('\n  private async runLoop(');
  const body = flowSrc.slice(startIdx, endIdx > startIdx ? endIdx : flowSrc.length);

  it('accepts a resuming parameter, defaulting to false', () => {
    expect(body).toMatch(/private async syncTheme\(resuming = false\)/);
  });

  it('the interlude hold/clear runs before the resuming short-circuit', () => {
    const clearIdx = body.indexOf('if (showingInterlude) this.clearInterlude();');
    const returnIdx = body.indexOf('if (resuming) return;');
    expect(clearIdx, 'clearInterlude() call not found').toBeGreaterThan(-1);
    expect(returnIdx, 'resuming short-circuit not found').toBeGreaterThan(-1);
    expect(clearIdx).toBeLessThan(returnIdx);
  });

  it('the act-intro playBeats and the Socratic aside both come after the resuming short-circuit', () => {
    const returnIdx = body.indexOf('if (resuming) return;');
    const introIdx = body.indexOf('actIntroText(this.state.act)');
    const asideIdx = body.indexOf('shouldShowSocraticAside(this.state)');
    expect(introIdx).toBeGreaterThan(returnIdx);
    expect(asideIdx).toBeGreaterThan(returnIdx);
  });
});

describe('enterRoom(room, resuming) shows a recap bark only when resuming mid-scene (startStage > 0)', () => {
  const startIdx = flowSrc.indexOf('private async enterRoom(');
  const endIdx = flowSrc.indexOf('\n  private async playOneDoor(', startIdx);
  const body = flowSrc.slice(startIdx, endIdx > startIdx ? endIdx : flowSrc.length);

  it('accepts a resuming parameter, defaulting to false', () => {
    expect(body).toMatch(/private async enterRoom\(room: Room, resuming = false\)/);
  });

  it('the resumed-mid-room bark is gated on resuming && startStage > 0, exclusive with the remembered-room branch', () => {
    expect(body).toContain('} else if (resuming && startStage > 0) {');
    const barkIdx = body.indexOf("usherBarkKey('resumed-mid-room'");
    expect(barkIdx, 'resumed-mid-room bark call not found').toBeGreaterThan(-1);
    expect(body).toContain('this.pack.guide.resumedMidRoomBarkFallback');
  });

  it('the resumed-mid-room branch appears after the remembered-room branch (mutually exclusive else-if)', () => {
    const rememberedIdx = body.indexOf("usherBarkKey('remembered-room'");
    const resumedIdx = body.indexOf("usherBarkKey('resumed-mid-room'");
    expect(rememberedIdx).toBeGreaterThan(-1);
    expect(resumedIdx).toBeGreaterThan(rememberedIdx);
  });
});

describe('guide.resumedMidRoomBarkFallback (pack content)', () => {
  it('ANAMNESIS and LIMERENCE each define a distinct, voice-correct fallback', () => {
    expect(anamnesisPack.guide.resumedMidRoomBarkFallback).toContain('Usher');
    expect(limerencePack.guide.resumedMidRoomBarkFallback).toContain('Porter');
    expect(anamnesisPack.guide.resumedMidRoomBarkFallback).not.toEqual(limerencePack.guide.resumedMidRoomBarkFallback);
  });
});
