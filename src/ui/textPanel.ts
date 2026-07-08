import type { Beat, RunState } from '../engine/schema';
import { clear, el } from './dom';
import { sound } from '../audio/soundEngine';
import { t, applyTokens } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';
import { showExplanation } from './explanation';

const SPEAKER_PREFIXES = ['Usher:', 'The Room:', 'The Door:', 'USHER:', 'THE ROOM:', 'THE DOOR:'];

/**
 * Resolves a beat to display text. `key`, if given, looks up a translated/
 * alternate-version variant; the *speaker* styling is always decided from
 * the English source (`raw`), never from the (possibly translated) display
 * text, so voice styling survives language/version switches.
 */
function resolveBeat(b: Beat, s: RunState, key?: string, tokens?: Record<string, string>) {
  const raw = typeof b === 'function' ? b(s) : b;
  const isSpoken = SPEAKER_PREFIXES.some((p) => raw.startsWith(p));
  const display = key ? t(key, raw, s) : raw;
  return { text: tokens ? applyTokens(display, tokens) : display, isSpoken };
}

export class TextPanel {
  private stage: HTMLElement;
  private ui: HTMLElement;
  private panel: HTMLElement | null = null;
  private typewriter = true;
  private remembered = false;
  private skipTyping: (() => void) | null = null;

  constructor(stageBottom: HTMLElement, ui: HTMLElement) {
    this.stage = stageBottom;
    this.ui = ui;
  }

  setTypewriter(v: boolean) {
    this.typewriter = v;
  }

  setRemembered(v: boolean) {
    this.remembered = v;
  }

  /** Plays beats one at a time; click/space/enter advances. Resolves when all are read. */
  async playBeats(
    beats: Beat[],
    state: RunState,
    header?: { title: string; type?: string; icon?: string },
    opts?: {
      keyOf?: (beatIndex: number) => string;
      tokens?: Record<string, string>;
      /** Renders a "?" button beside the title that opens a plain-language
       * explanation of this stage's situation and question (spec: room
       * explanations). Omit to show no button at all — used only for the
       * stage's own question beats, never for outcome/bark playbacks. */
      explain?: { title: string; body: string; icon?: string };
    },
  ): Promise<void> {
    const resolved = beats
      .map((b, i) => resolveBeat(b, state, opts?.keyOf?.(i), opts?.tokens))
      .filter((r) => r.text.length > 0);
    if (resolved.length === 0) return;
    const texts = resolved.map((r) => r.text);
    const spoken = resolved.map((r) => r.isSpoken);

    const panel = el('div', `text-panel fade-in${this.remembered ? ' remembered' : ''}`);
    if (header) {
      if (header.icon) {
        const iconWrap = el('div', 'room-icon');
        iconWrap.innerHTML = header.icon;
        panel.appendChild(iconWrap);
      }
      const h = el('div', 'room-title');
      h.append(el('span', undefined, header.title));
      const right = el('span', 'room-title-right');
      if (header.type) right.append(el('span', 'room-type', header.type));
      if (this.remembered) right.append(el('span', 'room-remembered-tag', t(uiKey('rememberedTag'), 'remembered')));
      if (opts?.explain) {
        const { title: explainTitle, body: explainBody, icon: explainIcon } = opts.explain;
        const btn = el('button', 'explain-btn', '?');
        btn.type = 'button';
        const label = t(uiKey('explainButton'), 'Explain this simply');
        btn.setAttribute('aria-label', label);
        btn.title = label;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          void showExplanation(this.ui, explainTitle, explainBody, explainIcon);
        });
        right.append(btn);
      }
      h.append(right);
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
    const hint = el('div', 'advance-hint', t(uiKey('advanceHintClick'), 'click · space'));
    panel.append(beatEl, dots, hint);

    this.replacePanel(panel);

    for (let i = 0; i < texts.length; i++) {
      dotEls.forEach((d, j) => d.classList.toggle('done', j <= i));
      await this.showBeat(beatEl, texts[i], spoken[i]);
      if (i === texts.length - 1) hint.textContent = t(uiKey('advanceHintContinue'), 'continue');
      await this.waitAdvance(panel);
    }
  }

  private async showBeat(beatEl: HTMLElement, text: string, isSpoken: boolean): Promise<void> {
    beatEl.classList.toggle('usher', isSpoken);
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
        sound.advance();
        finish();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
          // A pause menu / codex / settings / field note is open on top —
          // don't silently advance the room hidden underneath it.
          if (document.querySelector('.overlay, .field-note')) return;
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

  /** small one-liner (the Usher's door barks) — already fully resolved by the caller */
  showBark(text: string, tokens?: Record<string, string>) {
    const panel = el('div', 'text-panel fade-in');
    const p = el('p', 'beat usher', tokens ? applyTokens(text, tokens) : text);
    panel.appendChild(p);
    this.replacePanel(panel);
  }
}

export function clearStage(stage: HTMLElement) {
  clear(stage);
}
