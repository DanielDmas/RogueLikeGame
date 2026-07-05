import type { FieldNote } from '../content/schema';
import { el } from './dom';
import { sound } from '../audio/soundEngine';

/** Escapes HTML, then turns `**text**` into `<strong>` — the only markup field-note bodies use. */
export function renderEmphasis(raw: string): string {
  const escaped = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Slides the philosophy reveal card up from the bottom; resolves on dismiss. */
export function showFieldNote(ui: HTMLElement, note: FieldNote, label = 'Field Note', icon?: string): Promise<void> {
  return new Promise((resolve) => {
    const card = el('div', 'field-note');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', note.title);
    const header = el('div', 'fn-header');
    header.append(el('div', 'fn-label', `⁂ ${label}`));
    if (icon) {
      const glyph = el('div', 'fn-icon');
      glyph.innerHTML = icon;
      header.append(glyph);
    }
    card.append(header);
    card.append(el('h3', undefined, note.title));
    card.append(el('div', 'fn-thinkers', note.thinkers));
    const p = el('p');
    p.innerHTML = renderEmphasis(note.body);
    card.append(p);
    const close = el('button', 'fn-close', 'Continue');
    card.append(close);
    ui.appendChild(card);

    sound.noteOpen();
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
