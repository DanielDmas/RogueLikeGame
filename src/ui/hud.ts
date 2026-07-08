import { el, HEART_SVG } from './dom';
import { MAX_HEARTS } from '../engine/gameState';
import { nextLang, t } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';
import type { Lang } from '../engine/text/resolver';

const LANG_SHORT: Record<Lang, string> = { en: 'EN', cs: 'CS', fa: 'FA', de: 'DE', fr: 'FR' };

export class Hud {
  private root: HTMLElement;
  private heartEls: HTMLElement[] = [];
  private lucidityEl: HTMLElement;
  private actEl: HTMLElement;
  private langBtn: HTMLButtonElement;

  /**
   * `onLanguageChange` fires immediately on click — no pause menu required.
   * It takes effect from the next beat/room/door screen onward; whatever
   * text is already on screen at the moment of clicking is left as-is
   * (safely swapping already-rendered choice text mid-read isn't free —
   * see the risk noted in the language-switch task).
   */
  constructor(ui: HTMLElement, onMenu: () => void, initialLang: Lang, onLanguageChange: (lang: Lang) => void) {
    this.root = el('div', 'hud');
    const hearts = el('div', 'hearts');
    hearts.setAttribute('role', 'status');
    hearts.setAttribute('aria-label', t(uiKey('heartsAriaLabel'), 'grip on reality'));
    hearts.title = t(
      uiKey('heartsTooltip'),
      'Your grip on reality. A few costly choices spend one outright — the Usher always warns first — and so does lucidity running out completely. Losing all three hearts is an ending, not a failure.',
    );
    for (let i = 0; i < MAX_HEARTS; i++) {
      const h = el('div', 'heart');
      h.innerHTML = HEART_SVG;
      hearts.appendChild(h);
      this.heartEls.push(h);
    }
    const right = el('div', 'hud-right');
    this.lucidityEl = el('div', 'lucidity');
    this.lucidityEl.title = t(uiKey('lucidityTooltip'), 'Lucidity — how honestly you have been looking.');
    let currentLang = initialLang;
    this.langBtn = el('button', 'menu-btn lang-btn', LANG_SHORT[currentLang]);
    this.langBtn.title = t(uiKey('hudLanguageTooltip'), 'Change language (applies from the next beat onward)');
    this.langBtn.addEventListener('click', () => {
      currentLang = nextLang(currentLang);
      this.langBtn.textContent = LANG_SHORT[currentLang];
      onLanguageChange(currentLang);
    });
    const menuBtn = el('button', 'menu-btn', t(uiKey('menu'), 'Menu'));
    menuBtn.addEventListener('click', onMenu);
    right.append(this.lucidityEl, this.langBtn, menuBtn);
    this.root.append(hearts, right);

    this.actEl = el('div', 'act-label');
    ui.append(this.root, this.actEl);
    this.hide();
  }

  update(hearts: number, lucidity: number) {
    this.heartEls.forEach((h, i) => h.classList.toggle('lost', i >= hearts));
    const glow = Math.min(1, 0.2 + lucidity / 260);
    this.lucidityEl.style.opacity = String(glow);
    this.lucidityEl.style.boxShadow = `0 0 ${8 + glow * 26}px rgba(212,179,106,${glow * 0.6})`;
  }

  setAct(label: string) {
    this.actEl.textContent = label;
  }

  /** Keeps the HUD's language abbreviation in sync if language is instead changed via Settings. */
  setLanguage(lang: Lang) {
    this.langBtn.textContent = LANG_SHORT[lang];
  }

  show() {
    this.root.style.display = 'flex';
    this.actEl.style.display = 'block';
  }
  hide() {
    this.root.style.display = 'none';
    this.actEl.style.display = 'none';
  }
}
