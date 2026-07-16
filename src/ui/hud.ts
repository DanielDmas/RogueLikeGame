import { el } from './dom';
import { MAX_HEARTS } from '../engine/gameState';
import { nextLang, t } from '../engine/text/resolver';
import { uiKey, heartsTooltipKey, heartsAriaLabelKey, lucidityTooltipKey } from '../engine/text/keys';
import type { Lang } from '../engine/text/resolver';

/** ANAMNESIS's own wording — the engine-default half of the spec 08 §3
 * pattern; `Hud`'s constructor falls back to these whenever a pack's
 * `skin` doesn't override them, so ANAMNESIS itself never has to. */
const DEFAULT_HEARTS_ARIA_LABEL = 'grip on reality';
const DEFAULT_HEARTS_TOOLTIP =
  'Your grip on reality. A few costly choices spend one outright — the Usher always warns first — and so does lucidity running out completely. Losing all three hearts is an ending, not a failure.';
const DEFAULT_LUCIDITY_TOOLTIP = 'Lucidity — how honestly you have been looking.';

const LANG_SHORT: Record<Lang, string> = { en: 'EN', cs: 'CS', fa: 'FA', de: 'DE', fr: 'FR' };

export class Hud {
  private root: HTMLElement;
  private heartsEl!: HTMLElement;
  private heartEls: HTMLElement[] = [];
  private lucidityEl: HTMLElement;
  private actEl: HTMLElement;
  private langBtn: HTMLButtonElement;
  private menuBtn!: HTMLButtonElement;
  private settingsBtn!: HTMLButtonElement;
  private skin: { heartsSvg: string; heartsAriaLabel?: string; heartsTooltip?: string; lucidityTooltip?: string };
  private packId?: string;

  /**
   * `onLanguageChange` fires immediately on click — no pause menu required.
   * It takes effect from the next beat/room/door screen onward; whatever
   * text is already on screen at the moment of clicking is left as-is
   * (safely swapping already-rendered choice text mid-read isn't free —
   * see the risk noted in the language-switch task).
   */
  constructor(
    ui: HTMLElement,
    onMenu: () => void,
    onSettings: () => void,
    initialLang: Lang,
    onLanguageChange: (lang: Lang) => void,
    skin: { heartsSvg: string; heartsAriaLabel?: string; heartsTooltip?: string; lucidityTooltip?: string },
    packId?: string,
  ) {
    this.skin = skin;
    this.packId = packId;
    this.root = el('div', 'hud');
    const hearts = el('div', 'hearts');
    this.heartsEl = hearts;
    hearts.setAttribute('role', 'status');
    hearts.setAttribute('aria-label', t(heartsAriaLabelKey(packId), skin.heartsAriaLabel ?? DEFAULT_HEARTS_ARIA_LABEL));
    hearts.title = t(heartsTooltipKey(packId), skin.heartsTooltip ?? DEFAULT_HEARTS_TOOLTIP);
    for (let i = 0; i < MAX_HEARTS; i++) {
      const h = el('div', 'heart');
      h.innerHTML = skin.heartsSvg;
      hearts.appendChild(h);
      this.heartEls.push(h);
    }
    const right = el('div', 'hud-right');
    this.lucidityEl = el('div', 'lucidity');
    this.lucidityEl.title = t(lucidityTooltipKey(packId), skin.lucidityTooltip ?? DEFAULT_LUCIDITY_TOOLTIP);
    let currentLang = initialLang;
    this.langBtn = el('button', 'menu-btn lang-btn', LANG_SHORT[currentLang]);
    this.langBtn.title = t(uiKey('hudLanguageTooltip'), 'Change language (applies from the next beat onward)');
    this.langBtn.addEventListener('click', () => {
      currentLang = nextLang(currentLang);
      this.langBtn.textContent = LANG_SHORT[currentLang];
      onLanguageChange(currentLang);
    });
    // Owner request: Settings reachable "from any place" without the
    // pause-menu detour — a small, quiet gear icon beside Menu, one click
    // straight to Settings (openSettingsDirect in flow.ts mirrors the pause
    // menu's own 'settings' branch exactly, so behavior never diverges).
    // Reuses the already-translated `settings` string rather than adding a
    // new one — same label the pause/title menus already use for it.
    this.settingsBtn = el('button', 'menu-btn settings-btn', '⚙');
    const settingsLabel = t(uiKey('settings'), 'Settings');
    this.settingsBtn.title = settingsLabel;
    this.settingsBtn.setAttribute('aria-label', settingsLabel);
    this.settingsBtn.addEventListener('click', onSettings);
    this.menuBtn = el('button', 'menu-btn', t(uiKey('menu'), 'Menu'));
    this.menuBtn.addEventListener('click', onMenu);
    right.append(this.lucidityEl, this.langBtn, this.settingsBtn, this.menuBtn);
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

  /** Keeps the HUD's language abbreviation — and every tooltip/aria-label
   * that was resolved once at construction time (6.4.4) — in sync when the
   * language changes, whether from the HUD's own button or from Settings. */
  setLanguage(lang: Lang) {
    this.langBtn.textContent = LANG_SHORT[lang];
    this.heartsEl.setAttribute('aria-label', t(heartsAriaLabelKey(this.packId), this.skin.heartsAriaLabel ?? DEFAULT_HEARTS_ARIA_LABEL));
    this.heartsEl.title = t(heartsTooltipKey(this.packId), this.skin.heartsTooltip ?? DEFAULT_HEARTS_TOOLTIP);
    this.lucidityEl.title = t(lucidityTooltipKey(this.packId), this.skin.lucidityTooltip ?? DEFAULT_LUCIDITY_TOOLTIP);
    this.langBtn.title = t(uiKey('hudLanguageTooltip'), 'Change language (applies from the next beat onward)');
    this.menuBtn.textContent = t(uiKey('menu'), 'Menu');
    const settingsLabel = t(uiKey('settings'), 'Settings');
    this.settingsBtn.title = settingsLabel;
    this.settingsBtn.setAttribute('aria-label', settingsLabel);
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
