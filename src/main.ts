import '@fontsource/spectral/400.css';
import '@fontsource/spectral/400-italic.css';
import '@fontsource/spectral/500.css';
import '@fontsource/spectral/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import './styles.css';

import { LocalSaveStore } from './engine/localSave';
import { Game } from './engine/flow';
import { parseUatFlag } from './engine/uatMode';
import { setLocale } from './engine/text/resolver';
import type { ContentPack } from './packs/types';
import { applyLocaleToDocument } from './ui/locale';
import { installRecoveryHandlers } from './ui/recovery';
import { showRestoredFromBackupToast, showProfileResetToast } from './ui/toast';
import { resumeFullscreenAfterReload } from './ui/fullscreen';
import { withSharedDisplaySettings } from './engine/sharedDisplaySettings';

/** __PACK__ is a build-time define (vite.config.ts, from VITE_PACK) — a
 * string *literal* substituted before Rollup's tree-shaking pass runs, so
 * `__PACK__ === 'limerence'` below is a compile-time-constant comparison in
 * a production build. Dynamic `import()` behind that constant, rather than
 * both packs' static imports, is what actually makes "exactly one pack
 * loads per build" true: Rollup dead-code-eliminates the branch (and its
 * import) that's provably never taken, instead of both packs' full module
 * graphs (rooms, endings, every language's translations, dioramas, guide
 * barks — all registered as import-time side effects, which alone would
 * defeat ordinary tree-shaking) shipping in every build regardless of
 * which pack the player actually chose. Verified live (Fable review, M4,
 * then again confirming the fix): before this, grepping a built ANAMNESIS
 * bundle found LIMERENCE's own Czech guide-word and room ids inside it.
 * The dev-only `?pack=` override stays a genuine runtime branch — Vite's
 * dev server serves modules unbundled/on-demand, so there's no tree-shaking
 * concern there, and both packs need to stay reachable for `npm run dev`
 * to exercise either one. */
async function loadPack(): Promise<ContentPack> {
  if (import.meta.env.DEV) {
    const override = new URLSearchParams(location.search).get('pack');
    if (override === 'limerence') return (await import('./packs/limerence')).limerencePack;
    if (override === 'anamnesis') return (await import('./packs/anamnesis')).anamnesisPack;
  }
  return __PACK__ === 'limerence' ? (await import('./packs/limerence')).limerencePack : (await import('./packs/anamnesis')).anamnesisPack;
}

async function boot() {
  resumeFullscreenAfterReload();
  // B-1 (extended review, 2026-08-01): installRecoveryHandlers used to run
  // only after `loadPack()` resolved — a failed dynamic-chunk load (flaky
  // network on GH Pages, mid-deploy asset skew) rejected before the
  // 'unhandledrejection' handler existed, producing the silent black
  // screen the recovery overlay exists specifically to prevent. `ui`/
  // `canvas` are static HTML present before any script runs, so the net
  // can go up first — before the one genuinely network-dependent await
  // in this whole boot sequence.
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const ui = document.getElementById('ui') as HTMLElement;
  installRecoveryHandlers(ui, canvas);
  const pack = await loadPack();
  pack.registerText();
  const store = new LocalSaveStore(pack.meta.id);
  const profile = await store.load('traveler');
  // Whichever pack (or the landing page's own display panel) the player
  // last touched Settings/resolution/zoom/quality/fps in wins here — see
  // sharedDisplaySettings.ts for why this is safe to overlay unconditionally.
  profile.settings = withSharedDisplaySettings(profile.settings);
  setLocale(profile.settings.language, profile.settings.textVersion);
  applyLocaleToDocument(profile.settings.language);
  if (store.wasRestoredFromBackup()) showRestoredFromBackupToast(ui, profile.settings.reducedMotion);
  else if (store.wasReset()) showProfileResetToast(ui, profile.settings.reducedMotion);
  const uat = parseUatFlag(location.search);
  const game = new Game(canvas, ui, profile, store, pack, uat);
  await game.start();
}

boot();
