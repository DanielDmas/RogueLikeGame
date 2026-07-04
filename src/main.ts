import '@fontsource/spectral/400.css';
import '@fontsource/spectral/400-italic.css';
import '@fontsource/spectral/500.css';
import '@fontsource/spectral/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import './styles.css';

import { LocalSaveStore } from './engine/localSave';
import { Game } from './engine/flow';

async function boot() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const ui = document.getElementById('ui') as HTMLElement;
  const store = new LocalSaveStore();
  const profile = await store.load('traveler');
  const game = new Game(canvas, ui, profile, store);
  await game.start();
}

boot();
