import { el } from './dom';
import { installFocusTrap } from './focusTrap';
import { sound } from '../audio/soundEngine';
import { t } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';
import { renderEmphasis } from './fieldNote';

/** Slides up a plain-language explanation of the current stage's situation
 * and question — visually a sibling of the field note (same slide/close
 * pattern), just without a "thinkers" line. Resolves on dismiss. */
export function showExplanation(ui: HTMLElement, title: string, body: string, icon?: string): Promise<void> {
  return new Promise((resolve) => {
    const card = el('div', 'field-note explain-note');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', title);
    const header = el('div', 'fn-header');
    header.append(el('div', 'fn-label', `⁂ ${t(uiKey('explainLabel'), 'In Plain Words')}`));
    if (icon) {
      const glyph = el('div', 'fn-icon');
      glyph.innerHTML = icon;
      header.append(glyph);
    }
    card.append(header);
    const scroll = el('div', 'fn-scroll');
    scroll.append(el('h3', undefined, title));
    const p = el('p');
    p.innerHTML = renderEmphasis(body);
    scroll.append(p);
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
