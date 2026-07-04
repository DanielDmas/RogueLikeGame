// Generative WebAudio engine — no external asset files. Ambient drones per
// act, plus short procedural ticks for hover/choice/advance/heart-loss/notes.

type ActKey = 0 | 1 | 2 | 3 | 4 | 5;

// One held chord (in Hz) per act — corridor / machinery / mirror / dawn / ending.
const ACT_CHORDS: Record<ActKey, number[]> = {
  0: [98, 146.83, 220], // G2 D3 A3 — waiting room
  1: [110, 164.81, 220], // A2 E3 A3 — domestic corridor
  2: [82.41, 123.47, 196], // E2 B2 G3 — cold machinery
  3: [87.31, 130.81, 174.61], // F2 C3 F3 — mirror hall
  4: [130.81, 196, 261.63], // C3 G3 C4 — dawn
  5: [174.61, 261.63, 349.23], // F3 C4 F4 — ending, brighter
};

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private enabled = true;
  private currentAct: ActKey | null = null;
  private resumed = false;

  setEnabled(v: boolean) {
    this.enabled = v;
    if (this.master) this.master.gain.setTargetAtTime(v ? 0.55 : 0, this.now(), 0.4);
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
    master.gain.value = this.enabled ? 0.55 : 0;
    master.connect(ctx.destination);
    this.master = master;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.16;
    droneGain.connect(master);
    this.droneGain = droneGain;
    return ctx;
  }

  private now() {
    return this.ensureCtx().currentTime;
  }

  /** Crossfades the ambient drone to the given act's chord. */
  setAct(act: ActKey) {
    if (act === this.currentAct) return;
    this.currentAct = act;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    const oldOscs = this.droneOscs;
    const oldGain = this.droneGain!;
    // fade the old drone out on its own gain, then stop it
    oldGain.gain.cancelScheduledValues(t);
    oldGain.gain.setTargetAtTime(0, t, 1.4);
    for (const o of oldOscs) o.stop(t + 5);

    const newGain = ctx.createGain();
    newGain.gain.value = 0;
    newGain.connect(this.master!);
    newGain.gain.setTargetAtTime(0.16, t + 0.2, 2.2);
    this.droneGain = newGain;

    const chord = ACT_CHORDS[act];
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
    this.droneOscs = newOscs;
  }

  private blip(freq: number, duration: number, type: OscillatorType, gainPeak: number, delay = 0) {
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(gainPeak, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + duration);
    osc.connect(gain).connect(this.master!);
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
    if (!this.enabled) return;
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
    osc.connect(gain).connect(this.master!);
    osc.start(t);
    osc.stop(t + 1.4);
  }

  /** A field note opening: a soft ascending swell. */
  noteOpen() {
    if (!this.enabled) return;
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
      osc.connect(gain).connect(this.master!);
      osc.start(t + i * 0.06);
      osc.stop(t + 1.8);
    });
  }

  /** Ending reached: a resolving major-ish chord bloom. */
  ending() {
    if (!this.enabled) return;
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
      osc.connect(gain).connect(this.master!);
      osc.start(t + i * 0.12);
      osc.stop(t + 4.2);
    });
  }
}

export const sound = new SoundEngine();
