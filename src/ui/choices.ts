import type { Choice, RunState } from '../engine/schema';
import { el } from './dom';
import { t } from '../engine/text/resolver';
import { roomChoiceTextKey, roomChoiceHintKey, uiKey, keepsakeKey } from '../engine/text/keys';
import { KEEPSAKES } from '../content/keepsakes';

export interface DoorOption {
  id: string;
  hint: string;
  teaser?: string;
  secret?: boolean;
  icon?: string;
  unseen?: boolean;
}

export class ChoicePanel {
  private stage: HTMLElement;
  private container: HTMLElement | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(stageBottom: HTMLElement) {
    this.stage = stageBottom;
  }

  /** Presents a room's choices; resolves with the chosen one. */
  pick(choices: Choice[], state: RunState, roomId: string): Promise<Choice> {
    void state;
    return new Promise((resolve) => {
      const wrap = el('div', 'choices');
      wrap.setAttribute('role', 'group');
      choices.forEach((c, i) => {
        const card = el('button', 'choice-card');
        if (c.keepsakeId) {
          const def = KEEPSAKES.find((k) => k.id === c.keepsakeId);
          const name = def ? t(keepsakeKey(def.id, 'name'), def.name) : '';
          const mark = el('span', 'keepsake-mark', '✧');
          mark.title = name
            ? `${t(uiKey('keepsakeChoiceTooltip'), 'A keepsake, quietly spent')}: ${name}`
            : t(uiKey('keepsakeChoiceTooltip'), 'A keepsake, quietly spent');
          card.append(mark);
        }
        card.append(el('span', 'num', String(i + 1)));
        card.append(el('span', 'txt', t(roomChoiceTextKey(roomId, c.id), c.text)));
        if (c.hint) card.append(el('span', 'hint', t(roomChoiceHintKey(roomId, c.id), c.hint)));
        card.addEventListener('click', () => {
          this.clear();
          resolve(c);
        });
        wrap.appendChild(card);
      });
      this.mount(wrap, choices.length, (i) => {
        this.clear();
        resolve(choices[i]);
      });
    });
  }

  /** Presents door options (mirrors the in-scene doors). */
  pickDoor(
    doors: DoorOption[],
    onHover: (id: string | null) => void,
  ): { promise: Promise<string>; chooseExternally: (id: string) => void } {
    let externalResolve: (id: string) => void = () => {};
    const promise = new Promise<string>((resolve) => {
      externalResolve = (id) => {
        this.clear();
        resolve(id);
      };
      const wrap = el('div', 'choices');
      doors.forEach((d, i) => {
        const card = el('button', `choice-card door${d.secret ? ' secret' : ''}`);
        if (d.icon) {
          const rune = el('span', 'door-rune');
          rune.innerHTML = d.icon;
          card.append(rune);
        }
        card.append(el('span', 'num', d.secret ? '✦' : String(i + 1)));
        const textCol = el('span', 'door-text-col');
        textCol.append(el('span', 'txt', d.hint));
        if (d.teaser) textCol.append(el('span', 'door-teaser', d.teaser));
        card.append(textCol);
        if (d.unseen) {
          const badge = el('span', 'door-unseen-badge', t(uiKey('doorUnseenBadge'), 'new'));
          badge.title = t(uiKey('doorUnseenBadgeTooltip'), 'You have never walked through this door before');
          card.append(badge);
        }
        card.addEventListener('mouseenter', () => onHover(d.id));
        card.addEventListener('mouseleave', () => onHover(null));
        card.addEventListener('focus', () => onHover(d.id));
        card.addEventListener('blur', () => onHover(null));
        card.addEventListener('click', () => {
          onHover(null);
          this.clear();
          resolve(d.id);
        });
        wrap.appendChild(card);
      });
      wrap.appendChild(
        el(
          'div',
          'door-help',
          doors.length === 1
            ? t(uiKey('doorHelpSingle'), 'this is the only way forward — click the door, or press 1')
            : t(uiKey('doorHelp'), 'choose a path — click a door, or press its number'),
        ),
      );
      this.mount(wrap, doors.length, (i) => {
        onHover(null);
        this.clear();
        resolve(doors[i].id);
      });
    });
    return { promise, chooseExternally: externalResolve };
  }

  private mount(wrap: HTMLElement, count: number, onNum: (index: number) => void) {
    this.clear();
    this.container = wrap;
    this.stage.appendChild(wrap);
    this.keyHandler = (e: KeyboardEvent) => {
      // A pause menu / codex / settings / field note is open on top —
      // don't silently pick a choice hidden underneath it.
      if (document.querySelector('.overlay, .field-note')) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= count) onNum(n - 1);
    };
    addEventListener('keydown', this.keyHandler);
    (wrap.querySelector('button') as HTMLButtonElement | null)?.focus();
  }

  clear() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    if (this.keyHandler) {
      removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }
}
