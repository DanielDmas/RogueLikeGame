import { el, HEART_SVG } from './dom';
import { MAX_HEARTS } from '../engine/gameState';

export class Hud {
  private root: HTMLElement;
  private heartEls: HTMLElement[] = [];
  private lucidityEl: HTMLElement;
  private actEl: HTMLElement;

  constructor(ui: HTMLElement, onMenu: () => void) {
    this.root = el('div', 'hud');
    const hearts = el('div', 'hearts');
    hearts.setAttribute('role', 'status');
    hearts.setAttribute('aria-label', 'grip on reality');
    for (let i = 0; i < MAX_HEARTS; i++) {
      const h = el('div', 'heart');
      h.innerHTML = HEART_SVG;
      hearts.appendChild(h);
      this.heartEls.push(h);
    }
    const right = el('div', 'hud-right');
    this.lucidityEl = el('div', 'lucidity');
    this.lucidityEl.title = 'Lucidity';
    const menuBtn = el('button', 'menu-btn', 'Menu');
    menuBtn.addEventListener('click', onMenu);
    right.append(this.lucidityEl, menuBtn);
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

  show() {
    this.root.style.display = 'flex';
    this.actEl.style.display = 'block';
  }
  hide() {
    this.root.style.display = 'none';
    this.actEl.style.display = 'none';
  }
}
