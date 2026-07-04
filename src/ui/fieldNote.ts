import type { FieldNote } from '../content/schema';
import { el } from './dom';

/** Slides the philosophy reveal card up from the bottom; resolves on dismiss. */
export function showFieldNote(ui: HTMLElement, note: FieldNote, label = 'Field Note'): Promise<void> {
  return new Promise((resolve) => {
    const card = el('div', 'field-note');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', note.title);
    card.append(el('div', 'fn-label', `⁂ ${label}`));
    card.append(el('h3', undefined, note.title));
    card.append(el('div', 'fn-thinkers', note.thinkers));
    const p = el('p');
    p.textContent = note.body;
    card.append(p);
    const close = el('button', 'fn-close', 'Continue');
    card.append(close);
    ui.appendChild(card);

    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('open')));

    const dismiss = () => {
      removeEventListener('keydown', onKey);
      card.classList.remove('open');
      setTimeout(() => {
        card.remove();
        resolve();
      }, 720);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        dismiss();
      }
    };
    close.addEventListener('click', dismiss);
    addEventListener('keydown', onKey);
    close.focus();
  });
}
