import { el } from './dom';

/** A small, unobtrusive "progress saved" confirmation — shown only at natural checkpoints (never after every persist, or it would nag). */
export function showSavedToast(ui: HTMLElement, label: string, reducedMotion = false, speedMultiplier = 1): void {
  const toast = el('div', 'save-toast', `✓ ${label}`);
  ui.appendChild(toast);
  const showDelay = (reducedMotion ? 0 : 20) * speedMultiplier;
  setTimeout(() => toast.classList.add('show'), showDelay);
  const holdMs = (reducedMotion ? 900 : 1700) * speedMultiplier;
  const fadeMs = (reducedMotion ? 120 : 420) * speedMultiplier;
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), fadeMs);
  }, holdMs);
}
