// Generative WebAudio engine — no external asset files. A slowly evolving
// ambient bed per act (chord progression + sparse melodic motes + a faint
// noise pad), plus short procedural ticks for hover/choice/advance/heart-loss/
// notes/ending. Music and sound effects run on independent buses so either
// can be muted without touching the other.

export type ActKey = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Two to four chords per act (Hz), quietly cycled instead of one static held
 * chord — this is what replaces the old "one tone always" drone.
 */
export const ACT_PROGRESSIONS: Record<ActKey, number[][]> = {
  0: [
    [98, 146.83, 220], // G2 D3 A3
    [110, 164.81, 220], // A2 E3 A3
  ],
  1: [
    [110, 164.81, 220], // A2 E3 A3 — domestic corridor
    [98, 146.83, 220], // G2 D3 A3
    [123.47, 185, 246.94], // B2 F#3 B3
  ],
  2: [
    [82.41, 123.47, 196], // E2 B2 G3 — cold machinery
    [87.31, 130.81, 207.65], // F2 C3 G#3
    [77.78, 116.54, 174.61], // D#2 A#2 F3
  ],
  3: [
    [87.31, 130.81, 174.61], // F2 C3 F3 — mirror hall
    [82.41, 123.47, 196], // E2 B2 G3
  ],
  4: [
    [130.81, 196, 261.63], // C3 G3 C4 — dawn
    [146.83, 220, 293.66], // D3 A3 D4
  ],
  5: [
    [174.61, 261.63, 349.23], // F3 C4 F4 — ending, brighter, held
  ],
};

/** Scale (Hz) for the sparse melodic motes, roughly matching each act's key. */
export const ACT_MOTE_SCALES: Record<ActKey, number[]> = {
  0: [220, 246.94, 293.66, 329.63, 369.99],
  1: [220, 246.94, 261.63, 329.63, 392],
  2: [196, 220, 246.94, 293.66, 349.23],
  3: [174.61, 196, 220, 261.63, 293.66],
  4: [261.63, 293.66, 329.63, 392, 440],
  5: [349.23, 392, 440, 523.25],
};

/** A jittered duration in seconds within [min, max]. Pure — testable without an AudioContext. */
export function jitterSeconds(min: number, max: number, rng: () => number = Math.random): number {
  return min + rng() * (max - min);
}

/** Picks a mote frequency from an act's scale. Pure — testable without an AudioContext. */
export function pickMote(act: ActKey, rng: () => number = Math.random): number {
  const scale = ACT_MOTE_SCALES[act];
  return scale[Math.floor(rng() * scale.length) % scale.length];
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private chordGain: GainNode | null = null;
  private chordOscs: OscillatorNode[] = [];
  private musicEnabled = true;
  private sfxEnabled = true;
  private currentAct: ActKey | null = null;
  private progressionIndex = 0;
  private chordTimer: ReturnType<typeof setTimeout> | null = null;
  private moteTimer: ReturnType<typeof setTimeout> | null = null;
  private resumed = false;

  setMusicEnabled(v: boolean) {
    this.musicEnabled = v;
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(v ? 1 : 0, this.now(), 0.4);
  }

  setSfxEnabled(v: boolean) {
    this.sfxEnabled = v;
    if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(v ? 1 : 0, this.now(), 0.1);
  }

  /** Must be called from within a user gesture handler (autoplay policy). */
  primeOnGesture() {
    if (this.resumed) return;
    this.resumed = true;
    const ctx = this.ensureCtx();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  private ensureCtx(): AudioContext {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);

    const musicGain = ctx.createGain();
    musicGain.gain.value = this.musicEnabled ? 1 : 0;
    musicGain.connect(master);
    this.musicGain = musicGain;

    const sfxGain = ctx.createGain();
    sfxGain.gain.value = this.sfxEnabled ? 1 : 0;
    sfxGain.connect(master);
    this.sfxGain = sfxGain;

    const chordGain = ctx.createGain();
    chordGain.gain.value = 0.16;
    chordGain.connect(musicGain);
    this.chordGain = chordGain;

    // a faint filtered-noise breath pad, under the chord
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.018;
    noiseGain.connect(musicGain);
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 340;
    noise.connect(filter).connect(noiseGain);
    noise.start();

    return ctx;
  }

  private now() {
    return this.ensureCtx().currentTime;
  }

  /** Switches the ambient bed to the given act: a fresh chord progression + mote scale. */
  setAct(act: ActKey) {
    if (act === this.currentAct) return;
    this.currentAct = act;
    this.progressionIndex = 0;
    this.clearTimers();
    this.ensureCtx();
    this.crossfadeToChord(ACT_PROGRESSIONS[act][0]);
    this.scheduleNextChord();
    this.scheduleNextMote();
  }

  private clearTimers() {
    if (this.chordTimer) clearTimeout(this.chordTimer);
    if (this.moteTimer) clearTimeout(this.moteTimer);
    this.chordTimer = null;
    this.moteTimer = null;
  }

  private scheduleNextChord() {
    const act = this.currentAct;
    if (act === null || ACT_PROGRESSIONS[act].length <= 1) return;
    this.chordTimer = setTimeout(() => {
      const progression = ACT_PROGRESSIONS[act];
      this.progressionIndex = (this.progressionIndex + 1) % progression.length;
      this.crossfadeToChord(progression[this.progressionIndex]);
      this.scheduleNextChord();
    }, jitterSeconds(20, 40) * 1000);
  }

  private scheduleNextMote() {
    this.moteTimer = setTimeout(() => {
      this.playMote();
      this.scheduleNextMote();
    }, jitterSeconds(9, 22) * 1000);
  }

  private playMote() {
    if (this.currentAct === null) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    const freq = pickMote(this.currentAct);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.045, t + 1.4);
    gain.gain.exponentialRampToValueAtTime(0.0006, t + 5.5);
    osc.connect(gain).connect(this.musicGain!);
    osc.start(t);
    osc.stop(t + 5.7);
  }

  private crossfadeToChord(chord: number[]) {
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    const oldOscs = this.chordOscs;
    const oldGain = this.chordGain!;
    oldGain.gain.cancelScheduledValues(t);
    oldGain.gain.setTargetAtTime(0, t, 1.4);
    for (const o of oldOscs) o.stop(t + 5);

    const newGain = ctx.createGain();
    newGain.gain.value = 0;
    newGain.connect(this.musicGain!);
    newGain.gain.setTargetAtTime(0.16, t + 0.2, 2.2);
    this.chordGain = newGain;

    const newOscs: OscillatorNode[] = [];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      // gentle detune drift so the drone breathes
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.03 + i * 0.01;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain).connect(osc.detune);
      lfo.start(t);
      const voiceGain = ctx.createGain();
      voiceGain.gain.value = i === 0 ? 0.5 : 0.28;
      osc.connect(voiceGain).connect(newGain);
      osc.start(t);
      newOscs.push(osc);
    });
    this.chordOscs = newOscs;
  }

  private blip(freq: number, duration: number, type: OscillatorType, gainPeak: number, delay = 0) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(gainPeak, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + duration);
    osc.connect(gain).connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  /** Hovering a door: a soft high glassy tick. */
  hover() {
    this.blip(880, 0.18, 'sine', 0.05);
  }

  /** Committing a choice: a warmer, lower thud. */
  choice() {
    this.blip(220, 0.32, 'triangle', 0.09);
    this.blip(110, 0.4, 'sine', 0.06, 0.02);
  }

  /** Advancing a beat of text: the faintest tick. */
  advance() {
    this.blip(660, 0.08, 'sine', 0.02);
  }

  /** Losing a heart: a descending, mournful glide. */
  heartLoss() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(392, t);
    osc.frequency.exponentialRampToValueAtTime(130, t + 1.1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0006, t + 1.3);
    osc.connect(gain).connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 1.4);
  }

  /** A field note opening: a soft ascending swell. */
  noteOpen() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    [261.63, 329.63, 392].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.3 + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 1.6 + i * 0.08);
      osc.connect(gain).connect(this.sfxGain!);
      osc.start(t + i * 0.06);
      osc.stop(t + 1.8);
    });
  }

  /** Ending reached: a resolving major-ish chord bloom. */
  ending() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    [130.81, 164.81, 196, 261.63].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.6 + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 4 + i * 0.15);
      osc.connect(gain).connect(this.sfxGain!);
      osc.start(t + i * 0.12);
      osc.stop(t + 4.2);
    });
  }
}

export const sound = new SoundEngine();
