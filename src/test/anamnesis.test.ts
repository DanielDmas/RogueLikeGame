import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';
import { UNDERSTORY_SEQUENCE } from '../content/graph';
import { getEnding } from '../content/endings';
import { newRun } from '../engine/gameState';
import {
  ANAMNESIS_LUCIDITY,
  anamnesisAvailable,
  computeAnamnesisEligible,
  endingsTotal,
  evaluateEnding,
} from '../engine/endings';
import { setLocale, t } from '../content/text/resolver';
import '../content/text';
import { roomNoteBodyKey } from '../content/text/keys';
import { doorThatAsks } from '../content/rooms/act4';

const ALL_ROOM_IDS = allRooms.map((r) => r.id);
// A profile that has walked every base room (i.e. everything except the
// optional understory trio) — the "full codex" precondition.
const FULL_CODEX = ALL_ROOM_IDS.filter((id) => !UNDERSTORY_SEQUENCE.includes(id));

describe('computeAnamnesisEligible — the profile-level gate (Milestone 5, Phase M)', () => {
  it('a fresh profile (no codex, no keepsakes) is ineligible', () => {
    expect(computeAnamnesisEligible(ALL_ROOM_IDS, UNDERSTORY_SEQUENCE, [], [])).toBe(false);
  });

  it('full codex + 2 keepsake choices is eligible', () => {
    expect(computeAnamnesisEligible(ALL_ROOM_IDS, UNDERSTORY_SEQUENCE, FULL_CODEX, ['a', 'b'])).toBe(true);
  });

  it('codex missing exactly one base room is ineligible, even with keepsakes proven', () => {
    const almost = FULL_CODEX.slice(0, -1);
    expect(computeAnamnesisEligible(ALL_ROOM_IDS, UNDERSTORY_SEQUENCE, almost, ['a', 'b'])).toBe(false);
  });

  it('a keepsake count of exactly 1 is ineligible, even with full codex', () => {
    expect(computeAnamnesisEligible(ALL_ROOM_IDS, UNDERSTORY_SEQUENCE, FULL_CODEX, ['a'])).toBe(false);
  });

  it('the understory trio is not required for codex completeness', () => {
    // FULL_CODEX already excludes the-archive/the-unchosen/the-echo; eligibility
    // still holds, proving the understory is optional color, not homework.
    expect(computeAnamnesisEligible(ALL_ROOM_IDS, UNDERSTORY_SEQUENCE, FULL_CODEX, ['a', 'b'])).toBe(true);
    expect(FULL_CODEX.some((id) => UNDERSTORY_SEQUENCE.includes(id))).toBe(false);
  });
});

describe('anamnesisAvailable — the per-run gate (Milestone 5, Phase M)', () => {
  it('requires anamnesisEligible, sufficient lucidity, and no erasure — all three', () => {
    const s = { ...newRun(), anamnesisEligible: true, lucidity: ANAMNESIS_LUCIDITY };
    expect(anamnesisAvailable(s)).toBe(true);
  });

  it('is hidden when profile-level eligibility was never computed true', () => {
    const s = { ...newRun(), anamnesisEligible: false, lucidity: 999 };
    expect(anamnesisAvailable(s)).toBe(false);
  });

  it('is hidden one lucidity point below the threshold', () => {
    const s = { ...newRun(), anamnesisEligible: true, lucidity: ANAMNESIS_LUCIDITY - 1 };
    expect(anamnesisAvailable(s)).toBe(false);
  });

  it('is hidden when erased-memory was set this run, even when otherwise eligible', () => {
    const s = { ...newRun(), anamnesisEligible: true, lucidity: 200, flags: ['erased-memory'] };
    expect(anamnesisAvailable(s)).toBe(false);
  });
});

describe('the fifth option on door-that-asks (Milestone 5, Phase M)', () => {
  it('is gated by anamnesisAvailable and present last among the final-stage choices', () => {
    const finalStage = doorThatAsks.stages[1];
    const ids = finalStage.choices.map((c) => c.id);
    expect(ids[ids.length - 1]).toBe('remember-everything');
    const choice = finalStage.choices.find((c) => c.id === 'remember-everything')!;
    expect(choice.available).toBeDefined();
    const eligible = { ...newRun(), anamnesisEligible: true, lucidity: ANAMNESIS_LUCIDITY };
    const ineligible = { ...newRun(), anamnesisEligible: false, lucidity: 999 };
    expect(choice.available!(eligible)).toBe(true);
    expect(choice.available!(ineligible)).toBe(false);
  });

  it('costs no hearts', () => {
    const choice = doorThatAsks.stages[1].choices.find((c) => c.id === 'remember-everything')!;
    expect(choice.effects.hearts).toBeUndefined();
  });
});

function finalChoice(s: ReturnType<typeof newRun>, choiceId: string) {
  s.transcript.push({ roomId: 'door-that-asks', stageIndex: 1, choiceId, choiceText: '' });
  return s;
}

describe('evaluateEnding priority for anamnesis (Milestone 5, Phase M)', () => {
  it('the remember-everything choice yields the anamnesis ending', () => {
    expect(evaluateEnding(finalChoice(newRun(), 'remember-everything'))).toBe('anamnesis');
  });

  it('zero hearts still dissolves, even after choosing remember-everything', () => {
    const s = finalChoice(newRun(), 'remember-everything');
    s.hearts = 0;
    expect(evaluateEnding(s)).toBe('dissolved');
  });

  it('extreme axes do not override an anamnesis choice', () => {
    const s = finalChoice(newRun(), 'remember-everything');
    s.axes.selfOthers = 60;
    s.axes.controlAcceptance = 50;
    expect(evaluateEnding(s)).toBe('anamnesis');
  });
});

describe('endingsTotal — the display rule (Milestone 5, Phase M)', () => {
  it('is 6 until anamnesis has been witnessed', () => {
    expect(endingsTotal([])).toBe(6);
    expect(endingsTotal(['return', 'punchline'])).toBe(6);
  });

  it('is 7 once anamnesis is in endingsSeen', () => {
    expect(endingsTotal(['return', 'anamnesis'])).toBe(7);
  });
});

describe('the three margin hints and ending content (Milestone 5, Phase M)', () => {
  it('the anamnesis ending has real content', () => {
    const ending = getEnding('anamnesis');
    expect(ending.beats.length).toBeGreaterThanOrEqual(5);
    expect(ending.fieldNote?.title).toBeTruthy();
  });

  it('the three margin-hint rooms carry their hint in en/cs/fa', () => {
    const sites: [string, string][] = [
      ['waiting-room', 'do not use the door at all'],
      ['editor', 'is owed'],
      ['casino-pascal', 'Ask no one'],
    ];
    for (const [roomId, needle] of sites) {
      const room = allRooms.find((r) => r.id === roomId)!;
      expect(room.fieldNote?.body, roomId).toContain(needle);
    }
    for (const lang of ['cs', 'fa'] as const) {
      setLocale(lang, 'v2');
      for (const roomId of ['waiting-room', 'editor', 'casino-pascal']) {
        const room = allRooms.find((r) => r.id === roomId)!;
        const body = t(roomNoteBodyKey(roomId), room.fieldNote!.body);
        expect(body, `${roomId} in ${lang}`).not.toBe(room.fieldNote!.body);
      }
      setLocale('en', 'v2');
    }
  });
});
