import type { Settings } from './saveStore';

/** Same origin under a rozcestník deploy (root + /anamnesis/ + /limerence/,
 * or the dev server's own single-pack root) means ANAMNESIS and LIMERENCE
 * already share one `localStorage` — they just never shared a *key* before.
 * This is that key: a pack-agnostic snapshot of the four Settings fields
 * that mean the same thing regardless of which game is running (screen
 * resolution, interface zoom, visual detail level, frame rate cap) — not a
 * second source of truth, just a mirror the *other* pack's boot reads once,
 * so "set it once, it applies everywhere" holds without merging the packs'
 * otherwise-separate profiles. */
const SHARED_KEY = 'vestibule:sharedDisplaySettings';

export type SharedDisplaySettings = Pick<Settings, 'quality' | 'renderScale' | 'uiZoom' | 'fpsCap'>;

function isSharedDisplaySettings(v: unknown): v is SharedDisplaySettings {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    (o.quality === 'low' || o.quality === 'high') &&
    (o.renderScale === 'performance' || o.renderScale === 'standard' || o.renderScale === 'sharp') &&
    typeof o.uiZoom === 'number' &&
    (o.fpsCap === 30 || o.fpsCap === 60)
  );
}

/** Reads the shared record, or `null` if it's absent, unparseable, or
 * doesn't look like the shape above (e.g. a hand-edited value) — never
 * throws, so a corrupted key degrades to "nothing to sync" rather than
 * breaking boot. */
export function readSharedDisplaySettings(): SharedDisplaySettings | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(SHARED_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isSharedDisplaySettings(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Extracts and stores just the four shared fields from a full Settings —
 * called once a Settings panel closes, so the *next* pack booted (or the
 * landing page's own display panel) picks up whatever was just chosen. */
export function writeSharedDisplaySettings(settings: Settings): void {
  if (typeof localStorage === 'undefined') return;
  const shared: SharedDisplaySettings = {
    quality: settings.quality,
    renderScale: settings.renderScale,
    uiZoom: settings.uiZoom,
    fpsCap: settings.fpsCap,
  };
  localStorage.setItem(SHARED_KEY, JSON.stringify(shared));
}

/** Pure: returns `settings` with the shared subset overlaid from storage, or
 * `settings` unchanged if nothing shared exists yet (a pack's own saved
 * values are always the fallback, never overwritten with defaults). Call
 * once at boot, before the values are used to build the scene. */
export function withSharedDisplaySettings(settings: Settings): Settings {
  const shared = readSharedDisplaySettings();
  return shared ? { ...settings, ...shared } : settings;
}
