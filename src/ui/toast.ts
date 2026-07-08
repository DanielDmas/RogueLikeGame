import { el } from './dom';
import { t } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';

function showToast(ui: HTMLElement, text: string, reducedMotion: boolean, speedMultiplier: number, holdMs: number): void {
  const toast = el('div', 'save-toast', text);
  ui.appendChild(toast);
  const showDelay = (reducedMotion ? 0 : 20) * speedMultiplier;
  setTimeout(() => toast.classList.add('show'), showDelay);
  const hold = (reducedMotion ? holdMs * 0.5 : holdMs) * speedMultiplier;
  const fadeMs = (reducedMotion ? 120 : 420) * speedMultiplier;
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), fadeMs);
  }, hold);
}

/** A small, unobtrusive "progress saved" confirmation — shown only at natural checkpoints (never after every persist, or it would nag). */
export function showSavedToast(ui: HTMLElement, label: string, reducedMotion = false, speedMultiplier = 1): void {
  showToast(ui, `✓ ${label}`, reducedMotion, speedMultiplier, 1700);
}

/** R8 (save integrity): shown once, quietly, on boot — only when `load()` had
 * to fall back to the `:backup` key because the primary payload failed to
 * parse. Held longer than the save toast since it's more important to
 * actually read. */
export function showRestoredFromBackupToast(ui: HTMLElement, reducedMotion = false, speedMultiplier = 1): void {
  const text = t(
    uiKey('restoredFromBackup'),
    'Your last save had trouble loading — restored from the previous one. Nothing should be missing.',
  );
  showToast(ui, text, reducedMotion, speedMultiplier, 3200);
}
