// F2/F3: scans public/voice/ and public/music/ for audio files dropped in
// by the owner and writes public/av-manifest.json — the single source of
// truth the game's runtime reads to decide which narration lines and
// music slots actually have a file. Run via `npm run build:manifest`
// (also wired into `dev`/`build:*` as a pre-step) so the manifest can
// never silently drift out of sync with what's actually on disk.
//
// An empty public/voice/ and public/music/ (the shipped default — no audio
// files exist yet) produces `{"voice":{},"music":{}}`, which keeps the
// whole feature invisible: no Settings row, no playback attempt.
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, basename } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const AUDIO_EXT = ['.mp3', '.ogg', '.wav'];
const PACKS = ['anamnesis', 'limerence'];
const LANGS = ['en', 'cs', 'fa', 'de', 'fr'];

/** Maps each key (bare filename, no extension) to its actual filename, so
 * the runtime never has to guess an extension — preferring .mp3, then
 * .ogg, then .wav if more than one is present for the same key. */
function listAudioFiles(dir) {
  if (!existsSync(dir)) return {};
  const byKey = {};
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const ext = extname(entry).toLowerCase();
    if (!statSync(full).isFile() || !AUDIO_EXT.includes(ext)) continue;
    const key = basename(entry, extname(entry));
    const existing = byKey[key];
    if (!existing || AUDIO_EXT.indexOf(ext) < AUDIO_EXT.indexOf(extname(existing).toLowerCase())) {
      byKey[key] = entry;
    }
  }
  return byKey;
}

function buildVoiceManifest() {
  const voice = {};
  for (const pack of PACKS) {
    const perLang = {};
    for (const lang of LANGS) {
      const files = listAudioFiles(join(root, 'public', 'voice', pack, lang));
      if (Object.keys(files).length > 0) perLang[lang] = files;
    }
    if (Object.keys(perLang).length > 0) voice[pack] = perLang;
  }
  return voice;
}

function buildMusicManifest() {
  const music = {};
  for (const pack of [...PACKS, 'landing']) {
    const files = listAudioFiles(join(root, 'public', 'music', pack));
    if (Object.keys(files).length > 0) music[pack] = files;
  }
  return music;
}

const manifest = { voice: buildVoiceManifest(), music: buildMusicManifest() };
const outPath = join(root, 'public', 'av-manifest.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');

const voiceCount = Object.values(manifest.voice).reduce(
  (n, byLang) => n + Object.values(byLang).reduce((m, files) => m + Object.keys(files).length, 0),
  0,
);
const musicCount = Object.values(manifest.music).reduce((n, files) => n + Object.keys(files).length, 0);
console.log(`build-voice-manifest: wrote ${outPath} (${voiceCount} narration file(s), ${musicCount} music file(s)).`);
