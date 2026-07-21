import { el } from './dom';
import { t } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';

function showToast(ui: HTMLElement, text: string, reducedMotion: boolean, speedMultiplier: number, holdMs: number): void {
  const toast = el('div', 'save-toast', text);
  ui.appendChild(toast);
  const showDelay = (reducedMotion ? 0 : 20) * speedMultiplier;
  setTimeout(() => toast.classList.add('show'), showDelay);
  // Game-experience review R1 (2026-07-20, `16-full-review-2026-07-20.md`
  // §3): `holdMs` is reading time, not motion — halving it under reduced
  // motion was the exact backwards logic the §1 interlude-timing fix
  // called out ("shortening reading time under reduced motion would be
  // backwards"), just sitting unnoticed in this neighboring file. Worst
  // case before this fix: the E3 profile-reset toast (the single most
  // consequential notice in the game) showed for 2100ms instead of its
  // intended 4200ms to exactly the players who asked for a calmer pace.
  // Only the fade/show delays are genuine motion and stay shortened.
  const hold = holdMs * speedMultiplier;
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

/** Game-experience review (2026-07-19, `15-game-experience-review.md` E3):
 * shown once, on boot, when a save genuinely existed but neither it nor its
 * `:backup` could be recovered — the profile had to be reset to defaults.
 * Distinct from `showRestoredFromBackupToast` (which means recovery
 * *worked*): this is the one path that actually loses the player's
 * progress, so returning to a blank "Begin" title with no explanation at
 * all would read as a silent, mysterious wipe. Held longest of the three
 * save-related toasts since it's the most consequential to actually read. */
export function showProfileResetToast(ui: HTMLElement, reducedMotion = false, speedMultiplier = 1): void {
  const text = t(
    uiKey('profileReset'),
    'Your save could not be read, even from its backup, and had to be reset. This is a fresh start — nothing could be recovered.',
  );
  showToast(ui, text, reducedMotion, speedMultiplier, 4200);
}

/** Game-experience review (2026-07-19, `15-game-experience-review.md` E5):
 * shown once, right after a keepsake-spending choice resolves — the only
 * other in-run trace was the ✧ mark's hover tooltip on the choice card
 * itself, which the player has just clicked past and can no longer see, so
 * nothing ever confirmed what spending it actually did. `name` is the
 * keepsake's already-resolved, already-translated display name. */
export function showKeepsakeSpentToast(ui: HTMLElement, name: string, reducedMotion = false, speedMultiplier = 1): void {
  const text = `✧ ${t(uiKey('keepsakeSpentToast'), 'Spent')}: ${name}`;
  showToast(ui, text, reducedMotion, speedMultiplier, 2200);
}

/** 6.2: shown when a save write itself fails (e.g. `QuotaExceededError` in a
 * full/private-browsing storage quota) — so the failure is visible instead of
 * silently poisoning the persist chain. Held as long as the restore notice
 * since it's likewise something the player should actually read. */
export function showSaveFailedToast(ui: HTMLElement, reducedMotion = false, speedMultiplier = 1): void {
  const text = t(uiKey('saveFailed'), 'Your progress could not be saved — storage may be full.');
  showToast(ui, text, reducedMotion, speedMultiplier, 3200);
}
