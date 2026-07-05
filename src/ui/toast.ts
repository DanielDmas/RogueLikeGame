import { el } from './dom';

/** A small, unobtrusive "progress saved" confirmation — shown only at natural checkpoints (never after every persist, or it would nag). */
export function showSavedToast(ui: HTMLElement, label: string, reducedMotion = false): void {
  const toast = el('div', 'save-toast', `✓ ${label}`);
  ui.appendChild(toast);
  const showDelay = reducedMotion ? 0 : 20;
  setTimeout(() => toast.classList.add('show'), showDelay);
  const holdMs = reducedMotion ? 900 : 1700;
  const fadeMs = reducedMotion ? 120 : 420;
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), fadeMs);
  }, holdMs);
}
