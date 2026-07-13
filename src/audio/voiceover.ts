// F2: voice narration — architecture only (spec: step 1, no audio shipped
// yet). Reads public/av-manifest.json (built by scripts/build-voice-manifest.mjs
// from whatever files the owner has actually dropped into public/voice/) and
// plays a line through a dedicated bus in SoundEngine when one exists for the
// active pack, language, and text key. Every query degrades to "no line" —
// nothing here ever throws or blocks play when the manifest is empty, which
// it is until real recordings exist.
import { sound } from './soundEngine';

export interface AvManifest {
  /** packId -> lang -> textKey -> filename (e.g. "room.the-cave.stage0.beat1.mp3"). */
  voice: Record<string, Record<string, Record<string, string>>>;
  /** packId -> slot (e.g. "act0") -> filename. */
  music: Record<string, Record<string, string>>;
}

export const EMPTY_MANIFEST: AvManifest = { voice: {}, music: {} };

/** True only when this exact pack+lang+key has a narration file. Pure — testable without fetch/DOM. */
export function manifestHasVoice(manifest: AvManifest, packId: string, lang: string, key: string): boolean {
  return Boolean(manifest.voice[packId]?.[lang]?.[key]);
}

/** Whether `packId` has ANY narration files at all, in any language — gates
 * the Settings row's visibility (it must stay invisible until files exist,
 * not merely silent). Pure. */
export function manifestPackHasAnyVoice(manifest: AvManifest, packId: string): boolean {
  const byLang = manifest.voice[packId];
  if (!byLang) return false;
  return Object.values(byLang).some((keys) => Object.keys(keys).length > 0);
}

/** The playable URL for a narration line, or null if none exists. Pure. */
export function voiceUrl(manifest: AvManifest, packId: string, lang: string, key: string): string | null {
  const filename = manifest.voice[packId]?.[lang]?.[key];
  return filename ? `/voice/${packId}/${lang}/${filename}` : null;
}

/** The playable URL for a pack's music slot (e.g. "act0"), or null. Pure. */
export function musicUrl(manifest: AvManifest, packId: string, slot: string): string | null {
  const filename = manifest.music[packId]?.[slot];
  return filename ? `/music/${packId}/${filename}` : null;
}

class Voiceover {
  private manifest: AvManifest = EMPTY_MANIFEST;
  private packId = 'anamnesis';
  private lang = 'en';
  private audioEl: HTMLAudioElement | null = null;
  private connected = false;

  /** Fetches the build-time manifest once, at boot. Never throws — a
   * missing/unreachable manifest just leaves narration dormant, same as an
   * empty one. */
  async init(packId: string, lang: string): Promise<void> {
    this.packId = packId;
    this.lang = lang;
    try {
      const res = await fetch('/av-manifest.json');
      if (res.ok) this.manifest = await res.json();
    } catch {
      // offline dev server, manifest not built yet, etc. — stays dormant.
    }
  }

  setLanguage(lang: string) {
    this.lang = lang;
  }

  /** True only when the active pack+language has this exact key's line. */
  has(key: string): boolean {
    return manifestHasVoice(this.manifest, this.packId, this.lang, key);
  }

  /** Whether the active pack has narration at all — Settings row visibility. */
  packHasAnyVoice(): boolean {
    return manifestPackHasAnyVoice(this.manifest, this.packId);
  }

  /** The playable URL for the active pack's music `slot` (e.g. "act0"), or
   * null if the manifest has no file for it — the caller's cue to leave the
   * generative bed playing exactly as it always has. */
  musicUrlFor(slot: string): string | null {
    return musicUrl(this.manifest, this.packId, slot);
  }

  private ensureElement(): HTMLAudioElement {
    if (!this.audioEl) {
      this.audioEl = new Audio();
      this.audioEl.preload = 'auto';
    }
    if (!this.connected) {
      this.connected = true;
      sound.connectVoiceElement(this.audioEl);
    }
    return this.audioEl;
  }

  /** Plays the line for `key`, if one exists; otherwise a silent no-op —
   * callers never need to check `has()` first. */
  play(key: string) {
    const url = voiceUrl(this.manifest, this.packId, this.lang, key);
    if (!url) return;
    const el = this.ensureElement();
    if (el.src !== location.origin + url) el.src = url;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }

  stop() {
    this.audioEl?.pause();
  }
}

export const voiceover = new Voiceover();
