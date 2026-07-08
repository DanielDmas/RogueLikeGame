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
import { anamnesisPack } from './packs/anamnesis';
import { limerencePack } from './packs/limerence';
import { applyLocaleToDocument } from './ui/locale';
import { installRecoveryHandlers } from './ui/recovery';
import { showRestoredFromBackupToast } from './ui/toast';

// __PACK__ is a build-time define (vite.config.ts, from VITE_PACK) selecting
// which ContentPack this build boots; a dev-only `?pack=` override is also
// honored so both packs can be exercised from one `npm run dev` server.
const requestedPack = import.meta.env.DEV ? (new URLSearchParams(location.search).get('pack') ?? __PACK__) : __PACK__;
const pack = requestedPack === 'limerence' ? limerencePack : anamnesisPack;

async function boot() {
  pack.registerText();
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const ui = document.getElementById('ui') as HTMLElement;
  installRecoveryHandlers(ui, canvas);
  const store = new LocalSaveStore(pack.meta.id);
  const profile = await store.load('traveler');
  setLocale(profile.settings.language, profile.settings.textVersion);
  applyLocaleToDocument(profile.settings.language);
  if (store.wasRestoredFromBackup()) showRestoredFromBackupToast(ui, profile.settings.reducedMotion);
  const uat = parseUatFlag(location.search);
  const game = new Game(canvas, ui, profile, store, pack, uat);
  await game.start();
}

boot();
