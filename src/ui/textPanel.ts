import type { Beat, RunState } from '../engine/schema';
import { clear, el } from './dom';
import { sound } from '../audio/soundEngine';
import { voiceover } from '../audio/voiceover';
import { t, applyTokens } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';
import { showExplanation } from './explanation';

export const SPEAKER_PREFIXES = ['Usher:', 'The Room:', 'The Door:', 'USHER:', 'THE ROOM:', 'THE DOOR:'];

/**
 * Resolves a beat to display text. `key`, if given, looks up a translated/
 * alternate-version variant; the *speaker* styling is always decided from
 * the English source (`raw`), never from the (possibly translated) display
 * text, so voice styling survives language/version switches. `prefixes`
 * defaults to ANAMNESIS's own list (`SPEAKER_PREFIXES`) — a pack with its own
 * guide voice (e.g. LIMERENCE's "Porter:") must pass its own
 * `guide.speakerPrefixes`, or its guide's lines never get the spoken/italic
 * styling at all.
 */
export function resolveBeat(b: Beat, s: RunState, key?: string, tokens?: Record<string, string>, prefixes: string[] = SPEAKER_PREFIXES) {
  const raw = typeof b === 'function' ? b(s) : b;
  const isSpoken = prefixes.some((p) => raw.startsWith(p));
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
  /** The active pack's own guide-voice prefixes (e.g. LIMERENCE's "Porter:")
   * — defaults to ANAMNESIS's `SPEAKER_PREFIXES` so every pre-existing call
   * site (and every test) is unaffected until `setSpeakerPrefixes` is called. */
  private speakerPrefixes: string[] = SPEAKER_PREFIXES;

  constructor(stageBottom: HTMLElement, ui: HTMLElement) {
    this.stage = stageBottom;
    this.ui = ui;
  }

  setTypewriter(v: boolean) {
    this.typewriter = v;
  }

  /** Called once at boot with the active pack's `guide.speakerPrefixes`. */
  setSpeakerPrefixes(prefixes: string[]) {
    this.speakerPrefixes = prefixes;
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
      .map((b, i) => ({ ...resolveBeat(b, state, opts?.keyOf?.(i), opts?.tokens, this.speakerPrefixes), key: opts?.keyOf?.(i) }))
      .filter((r) => r.text.length > 0);
    if (resolved.length === 0) return;
    const texts = resolved.map((r) => r.text);
    const spoken = resolved.map((r) => r.isSpoken);
    const keys = resolved.map((r) => r.key);

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
    const back = el('button', 'beat-back', '‹');
    back.type = 'button';
    const backLabel = t(uiKey('rereadBack'), 'Back — reread the previous beat');
    back.setAttribute('aria-label', backLabel);
    back.title = backLabel;
    const dots = el('div', 'beat-progress');
    const dotEls = texts.map((_, i) => {
      const d = el('div', 'beat-dot');
      d.setAttribute('role', 'button');
      // H2: without a tabindex, a `role="button"` <div> is never reachable
      // by Tab at all — the reread-jump affordance existed only for mouse
      // users. Fixed value is fine; `waitAdvance`'s own click-target guard
      // (`j > maxSeen`) already stops a jump to an unread beat regardless
      // of how the dot was activated.
      d.setAttribute('tabindex', '0');
      d.setAttribute('aria-label', t(uiKey('rereadJumpTo'), 'Reread beat {n}').replace('{n}', String(i + 1)));
      dots.appendChild(d);
      return d;
    });
    const hint = el('div', 'advance-hint', t(uiKey('advanceHintClick'), 'click · space'));
    panel.append(beatEl, back, dots, hint);

    this.replacePanel(panel);

    // F4: cursor-based, not a forward-only loop — `‹`/ArrowLeft/Backspace
    // step back to reread an earlier beat in this same stage; clicking an
    // already-visited dot jumps straight to it. Only forward, never-before-
    // shown beats keep the typewriter; every re-visit (backward, or forward
    // back through already-seen ground) renders instantly — F4's whole point
    // is a free reread, not a second wait.
    let i = 0;
    let maxSeen = -1;
    while (i < texts.length) {
      dotEls.forEach((d, j) => {
        d.classList.toggle('done', j <= Math.max(i, maxSeen));
        d.classList.toggle('current', j === i);
        d.classList.toggle('clickable', j <= maxSeen && j !== i);
      });
      back.classList.toggle('visible', i > 0);
      const instant = i <= maxSeen;
      if (i > maxSeen) maxSeen = i;
      await this.showBeat(beatEl, texts[i], spoken[i], instant, keys[i]);
      hint.textContent = i === texts.length - 1 ? t(uiKey('advanceHintContinue'), 'continue') : t(uiKey('advanceHintClick'), 'click · space');
      const nav = await this.waitAdvance(panel, back, dotEls, maxSeen);
      voiceover.stop();
      if (nav.type === 'back') i = Math.max(0, i - 1);
      else if (nav.type === 'jump') i = nav.index;
      else i++;
    }
    back.classList.remove('visible');
    voiceover.stop();
  }

  /** F2: `key`, if given and the manifest has a narration file for it (the
   * active pack/language), plays alongside the beat — a silent no-op
   * otherwise, since the manifest is empty until real recordings exist. */
  private async showBeat(beatEl: HTMLElement, text: string, isSpoken: boolean, instant = false, key?: string): Promise<void> {
    beatEl.classList.toggle('usher', isSpoken);
    if (key) voiceover.play(key);
    if (!this.typewriter || instant) {
      beatEl.textContent = text;
      return;
    }
    // Fable review, M5: `aria-live="polite"` on this element meant every
    // ~11ms partial-text mutation below queued its own screen-reader
    // announcement — dozens of interruptions per beat instead of one.
    // Removing the attribute for the duration of typing suppresses all of
    // those; restoring it right as the final full text is set announces
    // the beat exactly once, when it's actually finished.
    beatEl.removeAttribute('aria-live');
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
    beatEl.setAttribute('aria-live', 'polite');
    this.skipTyping = null;
  }

  private waitAdvance(
    panel: HTMLElement,
    backBtn: HTMLElement,
    dotEls: HTMLElement[],
    maxSeen: number,
  ): Promise<{ type: 'forward' } | { type: 'back' } | { type: 'jump'; index: number }> {
    return new Promise((resolve) => {
      const dotHandlers: { click: (e: Event) => void; key: (e: KeyboardEvent) => void }[] = [];
      const cleanup = () => {
        panel.removeEventListener('click', onForwardClick);
        removeEventListener('keydown', onKey);
        backBtn.removeEventListener('click', onBack);
        dotEls.forEach((d, j) => {
          d.removeEventListener('click', dotHandlers[j].click);
          d.removeEventListener('keydown', dotHandlers[j].key);
        });
      };
      /** Typing-in-progress swallows the first interaction (skip to full text) — same guard for forward, back, and jump. */
      const guarded = (act: () => void) => {
        if (this.skipTyping) {
          this.skipTyping();
          this.skipTyping = null;
          return;
        }
        act();
      };
      const onForwardClick = () => {
        guarded(() => {
          sound.advance();
          cleanup();
          resolve({ type: 'forward' });
        });
      };
      const onBack = (e: Event) => {
        e.stopPropagation();
        guarded(() => {
          cleanup();
          resolve({ type: 'back' });
        });
      };
      const onKey = (e: KeyboardEvent) => {
        // A pause menu / codex / settings / field note is open on top —
        // don't silently advance the room hidden underneath it.
        if (document.querySelector('.overlay, .field-note')) return;
        // Game-experience review H2 (2026-07-20, `16-full-review-2026-07-20.md`
        // §10): a focused interactive child of this panel (the Back button,
        // the Explain "?" button, or a beat-progress dot) must handle its
        // own Enter/Space activation. Without this guard, this window-level
        // listener also fired on the same keypress — e.g. pressing Enter on
        // a focused dot both jumped to that beat *and* advanced forward,
        // same double-activation bug fieldNote.ts's `readMore` guard exists
        // to prevent.
        const active = document.activeElement;
        if (active && active !== document.body && panel.contains(active)) return;
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onForwardClick();
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
          e.preventDefault();
          onBack(e);
        }
      };
      dotEls.forEach((d, j) => {
        const handler = (e: Event) => {
          e.stopPropagation();
          if (j > maxSeen) return; // never lets a player jump ahead to an unread beat
          guarded(() => {
            cleanup();
            resolve({ type: 'jump', index: j });
          });
        };
        // `role="button"` on a <div> — unlike a native <button>, Enter/Space
        // don't auto-synthesize a click, so keyboard activation needs its
        // own explicit handler (H2, same finding as the onKey guard above).
        const keyHandler = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            handler(e);
          }
        };
        dotHandlers[j] = { click: handler, key: keyHandler };
        d.addEventListener('click', handler);
        d.addEventListener('keydown', keyHandler);
      });
      panel.addEventListener('click', onForwardClick);
      addEventListener('keydown', onKey);
      backBtn.addEventListener('click', onBack);
    });
  }

  private replacePanel(panel: HTMLElement) {
    if (this.panel) this.panel.remove();
    this.panel = panel;
    this.stage.prepend(panel);
  }

  hide() {
    voiceover.stop();
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }

  /** small one-liner (the Usher's door barks) — already fully resolved by the caller */
  showBark(text: string, tokens?: Record<string, string>) {
    const panel = el('div', 'text-panel fade-in');
    const p = el('p', 'beat usher', tokens ? applyTokens(text, tokens) : text);
    // Game-experience review R3 (2026-07-20, `16-full-review-2026-07-20.md`
    // §3): every beat played through playBeats announces via aria-live
    // (see the `beatEl` above) — the guide's door-row one-liners, shown
    // through this method instead, had no live region at all, so a
    // screen-reader player never heard the Usher/Porter speak at the door
    // row, the single most character-rich recurring surface in the game.
    p.setAttribute('aria-live', 'polite');
    panel.appendChild(p);
    this.replacePanel(panel);
  }
}

export function clearStage(stage: HTMLElement) {
  clear(stage);
}
