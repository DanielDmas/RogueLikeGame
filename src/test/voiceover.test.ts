import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { manifestHasVoice, manifestPackHasAnyVoice, voiceUrl, musicUrl, isValidManifest, EMPTY_MANIFEST, type AvManifest } from '../audio/voiceover';

describe('F2/F3 — av-manifest.json query helpers (pure, no fetch/DOM needed)', () => {
  it('EMPTY_MANIFEST (the shipped default — no audio files exist yet) reports no voice/music anywhere', () => {
    expect(manifestHasVoice(EMPTY_MANIFEST, 'anamnesis', 'en', 'room.wallet.stage0.beat0')).toBe(false);
    expect(manifestPackHasAnyVoice(EMPTY_MANIFEST, 'anamnesis')).toBe(false);
    expect(voiceUrl(EMPTY_MANIFEST, 'anamnesis', 'en', 'room.wallet.stage0.beat0')).toBeNull();
    expect(musicUrl(EMPTY_MANIFEST, 'anamnesis', 'act0')).toBeNull();
  });

  const manifest: AvManifest = {
    voice: {
      limerence: {
        en: { 'room.the-cave.stage0.beat0': 'room.the-cave.stage0.beat0.mp3' },
        cs: {},
      },
    },
    music: {
      anamnesis: { act0: 'act0.mp3' },
    },
  };

  it('manifestHasVoice is true only for the exact pack+lang+key the manifest actually lists', () => {
    expect(manifestHasVoice(manifest, 'limerence', 'en', 'room.the-cave.stage0.beat0')).toBe(true);
    expect(manifestHasVoice(manifest, 'limerence', 'en', 'room.the-cave.stage0.beat1')).toBe(false);
    expect(manifestHasVoice(manifest, 'limerence', 'cs', 'room.the-cave.stage0.beat0')).toBe(false);
    expect(manifestHasVoice(manifest, 'anamnesis', 'en', 'room.the-cave.stage0.beat0')).toBe(false);
  });

  it('manifestPackHasAnyVoice is true for limerence (has en files) and false for anamnesis (no voice section at all)', () => {
    expect(manifestPackHasAnyVoice(manifest, 'limerence')).toBe(true);
    expect(manifestPackHasAnyVoice(manifest, 'anamnesis')).toBe(false);
  });

  it('voiceUrl builds a document-relative folder-convention path from the manifest filename, or null if absent', () => {
    // Document-relative (no leading slash), not root-absolute — a
    // root-absolute path breaks under both real deploy targets (GitHub
    // Pages subpath, Electron file://); see the code-review note on
    // voiceUrl itself (2026-07-15).
    expect(voiceUrl(manifest, 'limerence', 'en', 'room.the-cave.stage0.beat0')).toBe('./voice/limerence/en/room.the-cave.stage0.beat0.mp3');
    expect(voiceUrl(manifest, 'limerence', 'en', 'nope')).toBeNull();
  });

  it('musicUrl builds a document-relative folder-convention path for a pack+slot, or null if the slot has no file', () => {
    expect(musicUrl(manifest, 'anamnesis', 'act0')).toBe('./music/anamnesis/act0.mp3');
    expect(musicUrl(manifest, 'anamnesis', 'act1')).toBeNull();
    expect(musicUrl(manifest, 'limerence', 'act0')).toBeNull();
  });
});

// R2-1 (extended review, 2026-08-01): the fetched av-manifest.json used to
// be assigned straight into `this.manifest` with no shape check — a
// corrupt/tampered payload (`{"voice": null}`) made
// `manifestPackHasAnyVoice`'s `manifest.voice[packId]` throw on the very
// first Settings-panel open, since `flow.ts` calls
// `voiceover.packHasAnyVoice()` unconditionally there. Server/build-
// controlled in practice, not player-editable like a save, but the fix is
// the same shape-check-before-trust discipline the save boundary uses.
describe('isValidManifest — the shape guard for the fetched manifest (R2-1)', () => {
  it('accepts the real shape, including the empty default', () => {
    expect(isValidManifest(EMPTY_MANIFEST)).toBe(true);
    expect(isValidManifest({ voice: { anamnesis: { en: {} } }, music: {} })).toBe(true);
  });

  it('rejects a manifest whose voice/music sections are missing or the wrong type', () => {
    for (const bad of [
      null,
      undefined,
      'not an object',
      42,
      [],
      {},
      { voice: null, music: {} },
      { voice: {}, music: null },
      { voice: 'x', music: {} },
      { voice: [], music: {} },
      { voice: {}, music: [] },
    ]) {
      expect(isValidManifest(bad), `manifest=${JSON.stringify(bad)}`).toBe(false);
    }
  });
});

// S5(b) (v2 overhaul plan, Phase 1.3): Voiceover.play() previously set `src`
// and called `.play()` even with narration disabled, relying on the muted
// bus to hide it — a wasted fetch+decode per beat once real voice files
// exist. Voiceover's own play() method touches a real HTMLAudioElement and
// the SoundEngine singleton, so — same source-shape convention as this
// repo's other DOM-dependent regression tests — this locks in the gate
// exists and runs before any URL/element work, rather than driving it live.
describe('S5(b) — Voiceover.play() gates on sound.isVoiceEnabled() before doing any work', () => {
  const src = readFileSync(new URL('../audio/voiceover.ts', import.meta.url), 'utf8');

  it("play(key) checks sound.isVoiceEnabled() and returns before touching voiceUrl/the audio element", () => {
    const idx = src.indexOf('play(key: string) {');
    expect(idx, 'play() not found').toBeGreaterThan(-1);
    const body = src.slice(idx, src.indexOf('\n  }', idx));
    const gateIdx = body.indexOf('if (!sound.isVoiceEnabled()) return;');
    const urlIdx = body.indexOf('voiceUrl(');
    expect(gateIdx, 'isVoiceEnabled gate not found').toBeGreaterThan(-1);
    expect(urlIdx, 'voiceUrl call not found').toBeGreaterThan(-1);
    expect(gateIdx).toBeLessThan(urlIdx);
  });
});
