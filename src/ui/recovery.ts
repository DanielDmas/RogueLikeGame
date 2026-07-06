import { el } from './dom';
import { t } from '../content/text/resolver';
import { uiKey } from '../content/text/keys';
import { shouldTriggerRecovery } from '../engine/recovery';

/** One calm, in-fiction panel shown on an otherwise-unrecoverable failure.
 * The profile is always persisted at the last checkpoint (the whole point
 * of the persist-cadence design), so a reload loses nothing. */
function showRecoveryOverlay(ui: HTMLElement): void {
  const o = el('div', 'overlay fade-in');
  const panel = el('div', 'codex-panel about-panel');
  panel.append(el('h2', undefined, t(uiKey('recoveryTitle'), 'The facility flickers')));
  const body = el('div', 'about-body');
  body.innerHTML = `<p>${t(uiKey('recoveryBody'), 'Something in the machinery lost its footing. Your file is safe — nothing you have done here has been forgotten.')}</p>`;
  panel.append(body);
  const back = el('button', 'title-btn', t(uiKey('recoveryReturn'), 'Return to the title'));
  back.style.marginTop = '26px';
  back.addEventListener('click', () => location.reload());
  panel.append(back);
  o.appendChild(panel);
  ui.appendChild(o);
}

/** Installs the global safety net (spec 09 §S6): an uncaught exception, a
 * rejected promise nobody awaited, or a lost WebGL context all land here
 * instead of a silent black screen. Call once, at boot, before the game
 * itself starts running. */
export function installRecoveryHandlers(ui: HTMLElement, canvas: HTMLCanvasElement): void {
  let shown = false;
  const trigger = () => {
    if (!shouldTriggerRecovery(shown)) return;
    shown = true;
    showRecoveryOverlay(ui);
  };
  window.addEventListener('error', trigger);
  window.addEventListener('unhandledrejection', trigger);
  canvas.addEventListener('webglcontextlost', trigger);
}
