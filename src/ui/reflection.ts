import type { Reflection } from '../engine/schema';
import { el } from './dom';
import { sound } from '../audio/soundEngine';
import { shuffledReflections } from '../engine/reflections';
import { t } from '../engine/text/resolver';
import { reflectionKey, traditionLabelKey, uiKey } from '../engine/text/keys';

const TRADITION_FALLBACK: Record<Reflection['tradition'], string> = {
  consequence: 'Consequence',
  duty: 'Duty',
  virtue: 'Virtue',
  care: 'Care',
};

/**
 * The Examination Annex's commentary card (spec 05) — shown only on the
 * Examined Path, only after a choice's outcome beats finish. Deliberately a
 * separate, visually quieter component from `TextPanel`: several readings
 * are shown at once (never one beat at a time), and none of them is ever
 * scored or ranked, which the shuffled row order exists to make visible.
 */
export class ReflectionPanel {
  private stage: HTMLElement;
  private panel: HTMLElement | null = null;

  constructor(stageBottom: HTMLElement) {
    this.stage = stageBottom;
  }

  /** Resolves once the whole card is dismissed (click, Space, or Enter). */
  show(roomId: string, choiceId: string, reflections: Reflection[], reducedMotion: boolean): Promise<void> {
    return new Promise((resolve) => {
      const panel = el('div', `reflection-card${reducedMotion ? '' : ' fade-in'}`);
      panel.setAttribute('role', 'note');
      panel.append(el('div', 'reflection-header', t(uiKey('annexHeader'), 'The Annex files:')));

      const rows = el('div', 'reflection-rows');
      for (const r of shuffledReflections(reflections)) {
        const row = el('div', 'reflection-row');
        row.append(
          el('span', 'reflection-tradition', t(traditionLabelKey(r.tradition), TRADITION_FALLBACK[r.tradition])),
          el('span', 'reflection-text', t(reflectionKey(roomId, choiceId, r.tradition), r.text)),
        );
        rows.appendChild(row);
      }
      panel.append(rows);
      panel.append(el('div', 'advance-hint', t(uiKey('advanceHintClick'), 'click · space')));

      this.replacePanel(panel);

      const finish = () => {
        panel.removeEventListener('click', onClick);
        removeEventListener('keydown', onKey);
        this.hide();
        resolve();
      };
      const onClick = () => {
        sound.advance();
        finish();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
          // Same overlay-guard as TextPanel.waitAdvance: a pause menu / codex /
          // settings / field note on top must not let this dismiss underneath it.
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
}
