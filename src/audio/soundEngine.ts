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

/** Pentatonic semitone offsets above 880 Hz, one per door index (spec 07
 * §Q5.3) — cycles if there are more doors than offsets. Pure. */
const HOVER_PENTATONIC_SEMITONES = [0, 2, 4, 7, 9];

/** The hover tick's pitch for a given door index — undefined/out-of-range
 * falls back to the base 880 Hz tone. Pure, unit-tested without an
 * AudioContext. All three hover sources (DOM door cards, the raycast hover,
 * and the flow layer's own callback) must resolve the same index for a
 * given door so hovering the same door always plays the same note. */
export function hoverPitch(index?: number): number {
  if (index === undefined || index < 0) return 880;
  const semi = HOVER_PENTATONIC_SEMITONES[index % HOVER_PENTATONIC_SEMITONES.length];
  return 880 * Math.pow(2, semi / 12);
}

/** Door hover feedback (item 7): the filtered-noise "creak" layered under
 * the hover tone's glassy pitch. Deliberately in a low, "wood" register and
 * spread across a gentler interval (2 octaves instead of 1) than
 * `hoverPitch`'s own arpeggio, so the two layers never beat against each
 * other. Pure, unit-tested without an AudioContext — same shape as
 * `hoverPitch` itself. */
export function doorCreakFrequency(index?: number): number {
  if (index === undefined || index < 0) return 220;
  const semi = HOVER_PENTATONIC_SEMITONES[index % HOVER_PENTATONIC_SEMITONES.length];
  return 220 * Math.pow(2, semi / 24);
}

/** Raw impulse-response samples (mono) for the convolution reverb bus (spec
 * 07 §Q5.1) — exponentially-decaying white noise. Pure — no AudioContext/
 * AudioBuffer needed, so it's unit-testable in the node test environment;
 * `ensureCtx()` wraps this into a real stereo AudioBuffer for the browser. */
export function makeImpulseSamples(sampleRate: number, durationSeconds: number, decay: number, rng: () => number = Math.random): Float32Array<ArrayBuffer> {
  const length = Math.max(1, Math.floor(sampleRate * durationSeconds));
  const data = new Float32Array(new ArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT));
  for (let i = 0; i < length; i++) {
    const envelope = Math.pow(1 - i / length, decay);
    data[i] = (rng() * 2 - 1) * envelope;
  }
  return data;
}

export type RoomAccent = 'junction' | 'casino' | 'ship' | null;

/** Picks a mote frequency from an act's scale. Pure — testable without an AudioContext. */
export function pickMote(act: ActKey, rng: () => number = Math.random, scales: Record<ActKey, number[]> = ACT_MOTE_SCALES): number {
  const scale = scales[act];
  return scale[Math.floor(rng() * scale.length) % scale.length];
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private chordGain: GainNode | null = null;
  /** Stable bus all chord-crossfade gain nodes connect through, so the tremolo LFO always applies. */
  private chordBus: GainNode | null = null;
  private chordOscs: OscillatorNode[] = [];
  /** Each chord voice's detune-drift LFO, parallel to `chordOscs` — must be
   * stopped alongside its voice in `crossfadeToChord` (see the fix below) or
   * it keeps running indefinitely, feeding a now-silent oscillator's detune,
   * a slow node leak over a long session (Fable review, M3). */
  private chordLfos: OscillatorNode[] = [];
  private musicEnabled = true;
  private sfxEnabled = true;
  private musicVolume = 0.7;
  private sfxVolume = 0.8;
  private currentAct: ActKey | null = null;
  private progressionIndex = 0;
  /** Act progressions/mote scales in play — default to ANAMNESIS's own
   * (the engine-wide default per spec 08 §3 row 16); `configurePack`
   * overrides them once, at boot, if the active pack supplies its own. */
  private progressions: Record<ActKey, number[][]> = ACT_PROGRESSIONS;
  private moteScales: Record<ActKey, number[]> = ACT_MOTE_SCALES;
  private chordTimer: ReturnType<typeof setTimeout> | null = null;
  private moteTimer: ReturnType<typeof setTimeout> | null = null;
  private resumed = false;
  /** Convolution reverb bus (spec 07 §Q5.1). Every reverb-send gain connects through this bus before the convolver, so a single node's `.gain` can't be found half-wired. */
  private reverbSend: GainNode | null = null;
  /** Per-room ambient accent (spec 07 §Q5.4) — at most one active at a time, cleared by `setRoomAccent(null)`. */
  private roomAccent: RoomAccent = null;
  private accentDrone: { osc: OscillatorNode; gain: GainNode } | null = null;
  private accentCreakTimer: ReturnType<typeof setTimeout> | null = null;
  /** Guards against attaching the `visibilitychange` listener twice — `ensureCtx()` can run its setup block only once, but this is the explicit guard against future refactors. */
  private visibilityHandlerAdded = false;
  /** F2: narration bus — independent of music/sfx so a spoken line survives either being muted. */
  private voiceGain: GainNode | null = null;
  private voiceEnabled = true;
  private voiceVolume = 0.9;
  private voiceConnectedElements = new WeakSet<HTMLMediaElement>();
  /** F3: the generative bed (chords + noise pad) routes through this bus
   * instead of straight into `musicGain`, so a file-based music track can
   * duck it to silence without touching the `musicGain` toggle/volume the
   * player actually controls. Stays at gain 1 forever unless `setMusicFile`
   * is ever called with a real url — which it isn't until a pack's manifest
   * actually has a music file for the active slot. */
  private genDuck: GainNode | null = null;
  private fileMusicGain: GainNode | null = null;
  private fileMusicEl: HTMLAudioElement | null = null;
  private fileMusicConnected = false;

  private musicTarget(): number {
    return this.musicEnabled ? this.musicVolume : 0;
  }
  private sfxTarget(): number {
    return this.sfxEnabled ? this.sfxVolume : 0;
  }
  private voiceTarget(): number {
    return this.voiceEnabled ? this.voiceVolume : 0;
  }

  /** Testable without an AudioContext: the effective (enabled × volume) level each bus would play at. */
  getMusicLevel(): number {
    return this.musicTarget();
  }
  getSfxLevel(): number {
    return this.sfxTarget();
  }
  getVoiceLevel(): number {
    return this.voiceTarget();
  }

  setVoiceEnabled(v: boolean) {
    this.voiceEnabled = v;
    if (this.voiceGain) this.voiceGain.gain.setTargetAtTime(this.voiceTarget(), this.now(), 0.1);
  }

  /** 0–1. Only audible while narration is enabled. */
  setVoiceVolume(v: number) {
    this.voiceVolume = Math.max(0, Math.min(1, v));
    if (this.voiceGain) this.voiceGain.gain.setTargetAtTime(this.voiceTarget(), this.now(), 0.05);
  }

  /** F2: routes an `<audio>` element (owned by `src/audio/voiceover.ts`)
   * into the narration bus. A media element can only ever be wrapped in one
   * `MediaElementAudioSourceNode` for its whole lifetime, so this is a
   * no-op past the first call for a given element. */
  connectVoiceElement(el: HTMLMediaElement) {
    if (this.voiceConnectedElements.has(el)) return;
    this.voiceConnectedElements.add(el);
    const ctx = this.ensureCtx();
    const src = ctx.createMediaElementSource(el);
    src.connect(this.voiceGain!);
  }

  /** F3: crossfades to a file-based music track for the current slot, if
   * `url` is given — ducking the generative bed to silence and looping the
   * file through `musicGain` (so the player's existing music toggle/volume
   * still governs it). Passing `null` (the default — no manifest entry for
   * this slot) crossfades back to the generative bed, exactly today's
   * behavior. */
  setMusicFile(url: string | null) {
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    if (url) {
      if (!this.fileMusicEl) {
        this.fileMusicEl = new Audio();
        this.fileMusicEl.loop = true;
      }
      if (!this.fileMusicConnected) {
        this.fileMusicConnected = true;
        const src = ctx.createMediaElementSource(this.fileMusicEl);
        src.connect(this.fileMusicGain!);
      }
      // See voiceover.ts's matching note: `url` is document-relative, so
      // resolve it the same way the browser resolves `el.src` rather than
      // naively prepending `location.origin`.
      if (this.fileMusicEl.src !== new URL(url, location.href).href) this.fileMusicEl.src = url;
      void this.fileMusicEl.play().catch(() => {});
      this.genDuck!.gain.setTargetAtTime(0, t, 1.5);
      this.fileMusicGain!.gain.setTargetAtTime(1, t, 1.5);
    } else {
      this.fileMusicEl?.pause();
      this.genDuck!.gain.setTargetAtTime(1, t, 1.5);
      this.fileMusicGain!.gain.setTargetAtTime(0, t, 1.5);
    }
  }

  /** Called once at boot with the active pack's audio identity — swaps in
   * its chord progressions/mote scales if it supplies its own, otherwise
   * leaves ANAMNESIS's as the default. Safe to call before `currentAct`
   * is set (pure data swap; takes effect on the next `setAct`). */
  configurePack(audio: { actProgressions?: Record<ActKey, number[][]>; actMoteScales?: Record<ActKey, number[]> }) {
    this.progressions = audio.actProgressions ?? ACT_PROGRESSIONS;
    this.moteScales = audio.actMoteScales ?? ACT_MOTE_SCALES;
  }

  /** Testable without an AudioContext: the progressions/scales currently in
   * effect for `act`, after any `configurePack` call. */
  getActProgressions(act: ActKey): number[][] {
    return this.progressions[act];
  }
  getActMoteScales(act: ActKey): number[] {
    return this.moteScales[act];
  }

  setMusicEnabled(v: boolean) {
    this.musicEnabled = v;
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(this.musicTarget(), this.now(), 0.4);
  }

  setSfxEnabled(v: boolean) {
    this.sfxEnabled = v;
    if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(this.sfxTarget(), this.now(), 0.1);
  }

  /** 0–1. Only audible while music is enabled. */
  setMusicVolume(v: number) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(this.musicTarget(), this.now(), 0.15);
  }

  /** 0–1. Only audible while sfx is enabled. */
  setSfxVolume(v: number) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(this.sfxTarget(), this.now(), 0.05);
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
    // 1.2.3: a light limiter on the master bus — a mote landing mid-crossfade
    // (six chord oscillators + the noise pad + a mote, all summed) can
    // otherwise push momentary peaks toward clipping on modest DACs. Gentle
    // settings (soft threshold, low ratio) so it never audibly "pumps".
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.25;
    master.connect(compressor);
    compressor.connect(ctx.destination);

    // 1.2.1: hidden tabs clamp `setTimeout` while the AudioContext keeps
    // running — queued chord/mote callbacks fire back-to-back on return,
    // stacking motes into an audible "chirp". Suspending on hide (and
    // clearing the pending timers so they don't all fire at once on resume)
    // fixes it, and saves battery besides.
    if (typeof document !== 'undefined' && !this.visibilityHandlerAdded) {
      this.visibilityHandlerAdded = true;
      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return;
        if (document.hidden) {
          this.clearTimers();
          if (this.accentCreakTimer) {
            clearTimeout(this.accentCreakTimer);
            this.accentCreakTimer = null;
          }
          void this.ctx.suspend().catch(() => {});
        } else {
          void this.ctx.resume().catch(() => {});
          if (this.currentAct !== null) {
            this.scheduleNextChord();
            this.scheduleNextMote();
          }
          if (this.roomAccent === 'ship') this.scheduleNextCreak();
        }
      });
    }

    const musicGain = ctx.createGain();
    musicGain.gain.value = this.musicTarget();
    musicGain.connect(master);
    this.musicGain = musicGain;

    const sfxGain = ctx.createGain();
    sfxGain.gain.value = this.sfxTarget();
    sfxGain.connect(master);
    this.sfxGain = sfxGain;

    // F2: narration bus.
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = this.voiceTarget();
    voiceGain.connect(master);
    this.voiceGain = voiceGain;

    // F3: generative-bed duck + file-music bus (see field comments above).
    const genDuck = ctx.createGain();
    genDuck.gain.value = 1;
    genDuck.connect(musicGain);
    this.genDuck = genDuck;
    const fileMusicGain = ctx.createGain();
    fileMusicGain.gain.value = 0;
    fileMusicGain.connect(musicGain);
    this.fileMusicGain = fileMusicGain;

    // Convolution reverb bus (spec 07 §Q5.1): a shared impulse response built
    // once; individual sounds tap into `reverbSend` at their own wet amount
    // (heartLoss 0.5, ending 0.35, noteOpen 0.15 — see those methods) rather
    // than every sound sharing one fixed wetness.
    const convolver = ctx.createConvolver();
    const duration = 1.8;
    const decay = 2.2;
    const impulse = ctx.createBuffer(2, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    impulse.copyToChannel(makeImpulseSamples(ctx.sampleRate, duration, decay), 0);
    impulse.copyToChannel(makeImpulseSamples(ctx.sampleRate, duration, decay), 1);
    convolver.buffer = impulse;
    convolver.connect(master);
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 1;
    reverbSend.connect(convolver);
    this.reverbSend = reverbSend;

    // Chord crossfades replace this.chordGain with a fresh node each time,
    // so the tremolo below modulates a stable bus all of them connect
    // through instead — otherwise it would go silent after the first
    // act change, still connected to a gain node nothing plays through.
    const chordBus = ctx.createGain();
    chordBus.gain.value = 1;
    chordBus.connect(genDuck);
    this.chordBus = chordBus;

    const chordGain = ctx.createGain();
    chordGain.gain.value = 0.16;
    chordGain.connect(chordBus);
    this.chordGain = chordGain;

    // A slow amplitude "breathing" tremolo on the chord bed — just enough
    // movement that the drone reads as alive, well under anything a
    // listener would call rhythm. Proportional (on the bus, not a raw
    // level), so it stays subtle regardless of the chosen music volume.
    const chordTremolo = ctx.createOscillator();
    chordTremolo.frequency.value = 1 / 17; // one full breath every ~17s
    const chordTremoloGain = ctx.createGain();
    chordTremoloGain.gain.value = 0.12;
    chordTremolo.connect(chordTremoloGain).connect(chordBus.gain);
    chordTremolo.start();

    // a faint filtered-noise breath pad, under the chord
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.018;
    noiseGain.connect(genDuck);
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

    // a very slow filter sweep so the noise pad's tone drifts instead of
    // sitting static — a gentle "breathing" quality, not a wobble
    const filterLFO = ctx.createOscillator();
    filterLFO.frequency.value = 1 / 23; // one sweep every ~23s
    const filterLFOGain = ctx.createGain();
    filterLFOGain.gain.value = 110;
    filterLFO.connect(filterLFOGain).connect(filter.frequency);
    filterLFO.start();

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
    // In-run act transitions get a slower, more deliberate crossfade (spec
    // 07 §Q5.2) than the ~2.2s default used for cycling chords *within* an
    // act — the act change is a bigger emotional beat.
    this.crossfadeToChord(this.progressions[act][0], 4.0);
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
    if (act === null || this.progressions[act].length <= 1) return;
    this.chordTimer = setTimeout(() => {
      const progression = this.progressions[act];
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
    // The casino room accent (spec 07 §Q5.4) biases the mote scheduler up an
    // octave while it's the active room, instead of adding its own voice.
    const freq = pickMote(this.currentAct, Math.random, this.moteScales) * (this.roomAccent === 'casino' ? 2 : 1);
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

  private crossfadeToChord(chord: number[], seconds = 2.2) {
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    const oldOscs = this.chordOscs;
    const oldLfos = this.chordLfos;
    const oldGain = this.chordGain!;
    oldGain.gain.cancelScheduledValues(t);
    // 1.2.2: ramp all the way to near-zero before stopping the oscillators —
    // `setTargetAtTime(0, t, 1.4)` alone is still at ~3% level by t+5, so
    // `osc.stop()` cut it off discontinuously (an audible click on every
    // chord cycle and act change). Anchor the ramp at the gain's current
    // value first, since it may itself be mid-ramp from an earlier crossfade.
    oldGain.gain.setValueAtTime(oldGain.gain.value, t);
    oldGain.gain.linearRampToValueAtTime(0.0001, t + 5);
    for (const o of oldOscs) o.stop(t + 5.05);
    // M3: each voice's detune LFO was previously only stopped implicitly
    // (its target oscillator dying) — the LFO itself kept running forever,
    // one extra live node per voice per chord cycle. Stop it at the same
    // instant its voice stops.
    for (const lfo of oldLfos) lfo.stop(t + 5.05);

    const newGain = ctx.createGain();
    newGain.gain.value = 0;
    newGain.connect(this.chordBus!);
    newGain.gain.setTargetAtTime(0.16, t + 0.2, seconds);
    this.chordGain = newGain;

    const newOscs: OscillatorNode[] = [];
    const newLfos: OscillatorNode[] = [];
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
      newLfos.push(lfo);
    });
    this.chordOscs = newOscs;
    this.chordLfos = newLfos;
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

  /** Taps `source`'s signal into the shared convolution reverb bus at `amount` (spec 07 §Q5.1) — a no-op before the AudioContext exists. */
  private sendToReverb(source: AudioNode, amount: number) {
    if (!this.reverbSend || !this.ctx) return;
    const send = this.ctx.createGain();
    send.gain.value = amount;
    source.connect(send).connect(this.reverbSend);
  }

  /** Hovering a door: a soft high glassy tick. Pitch arpeggiates across doors
   * (spec 07 §Q5.3, pentatonic above 880 Hz) when a door `index` is given —
   * every hover source (DOM cards, 3D raycast, the flow-layer callback) must
   * resolve the same index for a door so hovering it always sounds the same. */
  hover(index?: number) {
    this.blip(hoverPitch(index), 0.18, 'sine', 0.05);
    this.doorCreak(index);
  }

  /** Item 7 — door hover feedback: a very short, quiet filtered-noise creak
   * under the hover tone, giving the door a physical quality beyond the
   * pitch tick alone. Reuses the same impulse-noise technique as the ambient
   * room accent's `playCreak`, but far shorter and quieter — a per-hover
   * accent, not a looping ambient event. */
  private doorCreak(index?: number) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    const duration = 0.12;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    buffer.copyToChannel(makeImpulseSamples(ctx.sampleRate, duration, 4.5), 0);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = doorCreakFrequency(index);
    filter.Q.value = 4;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.012, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0006, t + duration);
    noise.connect(filter).connect(gain).connect(this.sfxGain!);
    noise.start(t);
    noise.stop(t + duration + 0.03);
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
    this.sendToReverb(gain, 0.5);
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
      this.sendToReverb(gain, 0.15);
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
      this.sendToReverb(gain, 0.35);
      osc.start(t + i * 0.12);
      osc.stop(t + 4.2);
    });
  }

  /** Sets (or clears, with `null`) the current room's ambient accent (spec
   * 07 §Q5.4) — at most one active at a time; everything it plays routes
   * through `musicGain` so the music toggle governs it. */
  setRoomAccent(kind: RoomAccent) {
    if (kind === this.roomAccent) return;
    this.clearRoomAccent();
    this.roomAccent = kind;
    if (!kind) return;
    const ctx = this.ensureCtx();
    if (kind === 'junction') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 55;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.006, ctx.currentTime, 1.5);
      osc.connect(gain).connect(this.musicGain!);
      osc.start();
      this.accentDrone = { osc, gain };
    } else if (kind === 'ship') {
      this.scheduleNextCreak();
    }
    // 'casino' has no persistent node of its own — it biases playMote()'s
    // frequency choice (an octave up) for as long as it's the active accent.
  }

  private clearRoomAccent() {
    if (this.accentDrone) {
      const { osc, gain } = this.accentDrone;
      const ctx = this.ensureCtx();
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      osc.stop(ctx.currentTime + 1);
      this.accentDrone = null;
    }
    if (this.accentCreakTimer) {
      clearTimeout(this.accentCreakTimer);
      this.accentCreakTimer = null;
    }
    this.roomAccent = null;
  }

  private scheduleNextCreak() {
    this.accentCreakTimer = setTimeout(() => {
      this.playCreak();
      this.scheduleNextCreak();
    }, jitterSeconds(9, 13) * 1000);
  }

  /** Ship room accent: a brief filtered-noise creak burst (spec 07 §Q5.4). */
  private playCreak() {
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * 0.4));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    buffer.copyToChannel(makeImpulseSamples(ctx.sampleRate, 0.4, 3.5), 0);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 380;
    filter.Q.value = 3;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.4);
    noise.connect(filter).connect(gain).connect(this.musicGain!);
    noise.start(t);
    noise.stop(t + 0.45);
  }
}

export const sound = new SoundEngine();
