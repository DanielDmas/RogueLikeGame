import type { FieldNote } from '../engine/schema';
import { el } from './dom';
import { installFocusTrap } from './focusTrap';
import { sound } from '../audio/soundEngine';
import { t } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';

/** Escapes HTML, then turns `**text**` into `<strong>` — the only markup field-note bodies use. */
export function renderEmphasis(raw: string): string {
  const escaped = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Slides the philosophy reveal card up from the bottom; resolves on dismiss.
 * `onReadMore`, when provided, renders a "Read more" button that opens the
 * room's expanded article overlay on top of this card without dismissing
 * it — the field note is still here, unaffected, when the article closes. */
export function showFieldNote(
  ui: HTMLElement,
  note: FieldNote,
  label = 'Field Note',
  icon?: string,
  onReadMore?: () => void,
): Promise<void> {
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
    // The header/title/thinkers stay put and the close button is pinned at
    // the bottom; only the body scrolls (and reads as two columns on a wide
    // screen) — so "Continue" is always reachable, even on a short viewport.
    const scroll = el('div', 'fn-scroll');
    scroll.append(el('h3', undefined, note.title));
    scroll.append(el('div', 'fn-thinkers', note.thinkers));
    const p = el('p');
    p.innerHTML = renderEmphasis(note.body);
    scroll.append(p);
    let readMore: HTMLElement | undefined;
    if (onReadMore) {
      readMore = el('button', 'fn-read-more', t(uiKey('readMore'), 'Read more →'));
      readMore.addEventListener('click', onReadMore);
      scroll.append(readMore);
    }
    card.append(scroll);
    const close = el('button', 'fn-close', t(uiKey('continue'), 'Continue'));
    card.append(close);
    ui.appendChild(card);
    installFocusTrap(card);

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
      // Found in code review (2026-07-15): this listener stays on `window`
      // for the field note's whole lifetime, including while the "Read
      // more" article overlay (z-index above this card, see
      // showRoomArticle's `.above-field-note` class) is open on top of it.
      // Without this guard, Escape or Enter-on-the-article's-own-Back-
      // button would both fall through to here and dismiss the field note
      // *underneath* the still-visible article — the room would complete
      // and doors would render behind it. When that overlay is open, this
      // listener defers entirely; the article manages its own keys.
      if (document.querySelector('.overlay.above-field-note')) return;
      // Found earlier while wiring the "Read more" button: this listener
      // used to intercept every Enter/Space unconditionally, so a keyboard
      // user tabbed onto the read-more button and pressing Enter/Space
      // would dismiss the whole field note instead of activating the
      // button (this preventDefault also suppresses the browser's own
      // button-activation synthesis). Escape still always dismisses,
      // regardless of focus, matching every other overlay in this app.
      if (e.key === 'Escape') {
        e.preventDefault();
        dismiss();
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement !== readMore) {
        e.preventDefault();
        dismiss();
      }
    };
    close.addEventListener('click', dismiss);
    addEventListener('keydown', onKey);
    close.focus();
  });
}
