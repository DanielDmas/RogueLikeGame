import type { Beat, RunState } from '../content/schema';
import { clear, el } from './dom';

const resolveBeat = (b: Beat, s: RunState) => (typeof b === 'function' ? b(s) : b);

export class TextPanel {
  private stage: HTMLElement;
  private panel: HTMLElement | null = null;
  private typewriter = true;
  private skipTyping: (() => void) | null = null;

  constructor(stageBottom: HTMLElement) {
    this.stage = stageBottom;
  }

  setTypewriter(v: boolean) {
    this.typewriter = v;
  }

  /** Plays beats one at a time; click/space/enter advances. Resolves when all are read. */
  async playBeats(
    beats: Beat[],
    state: RunState,
    header?: { title: string; type?: string },
  ): Promise<void> {
    const texts = beats.map((b) => resolveBeat(b, state)).filter((t) => t.length > 0);
    if (texts.length === 0) return;

    const panel = el('div', 'text-panel fade-in');
    if (header) {
      const h = el('div', 'room-title');
      h.append(el('span', undefined, header.title));
      if (header.type) h.append(el('span', 'room-type', header.type));
      panel.appendChild(h);
    }
    const beatEl = el('p', 'beat');
    beatEl.setAttribute('aria-live', 'polite');
    const dots = el('div', 'beat-progress');
    const dotEls = texts.map(() => {
      const d = el('div', 'beat-dot');
      dots.appendChild(d);
      return d;
    });
    const hint = el('div', 'advance-hint', 'click · space');
    panel.append(beatEl, dots, hint);

    this.replacePanel(panel);

    for (let i = 0; i < texts.length; i++) {
      dotEls.forEach((d, j) => d.classList.toggle('done', j <= i));
      await this.showBeat(beatEl, texts[i]);
      if (i === texts.length - 1) hint.textContent = 'continue';
      await this.waitAdvance(panel);
    }
  }

  private async showBeat(beatEl: HTMLElement, text: string): Promise<void> {
    const isUsher = text.startsWith('USHER:') || text.startsWith('THE ROOM:') || text.startsWith('THE DOOR:');
    beatEl.classList.toggle('usher', isUsher);
    if (!this.typewriter) {
      beatEl.textContent = text;
      return;
    }
    beatEl.textContent = '';
    let skipped = false;
    this.skipTyping = () => {
      skipped = true;
    };
    for (let i = 0; i < text.length; i += 2) {
      if (skipped) break;
      beatEl.textContent = text.slice(0, i + 2);
      await new Promise((r) => setTimeout(r, 11));
    }
    beatEl.textContent = text;
    this.skipTyping = null;
  }

  private waitAdvance(panel: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const finish = () => {
        panel.removeEventListener('click', onClick);
        removeEventListener('keydown', onKey);
        resolve();
      };
      const onClick = () => {
        if (this.skipTyping) {
          this.skipTyping();
          this.skipTyping = null;
          return;
        }
        finish();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onClick();
        }
      };
      panel.addEventListener('click', onClick);
      addEventListener('keydown', onKey);
    });
  }

  private replacePanel(panel: HTMLElement) {
    if (this.panel) this.panel.remove();
    this.panel = panel;
    this.stage.prepend(panel);
  }

  hide() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }

  /** small one-liner (the Usher's door barks) */
  showBark(text: string, state: RunState) {
    const panel = el('div', 'text-panel fade-in');
    const p = el('p', 'beat usher', resolveBeat(text, state));
    panel.appendChild(p);
    this.replacePanel(panel);
  }
}

export function clearStage(stage: HTMLElement) {
  clear(stage);
}
