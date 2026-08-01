import type { Choice, RunState } from '../engine/schema';
import { el } from './dom';
import { t } from '../engine/text/resolver';
import { roomChoiceTextKey, roomChoiceHintKey, uiKey, keepsakeKey } from '../engine/text/keys';
import { KEEPSAKES, type KeepsakeDef } from '../content/keepsakes';

/**
 * 9.5.3 — pure boundary logic for ↑/↓ navigation between door/choice cards.
 * `currentIndex` is -1 when nothing in the group is currently focused (the
 * caller should then land on the first card). Wraps at both ends, mirroring
 * how the existing digit-key picker already treats the group as a single
 * cyclic list. Enter/Space need no special handling: a focused native
 * `<button>` already activates on either key.
 */
export function arrowNavIndex(count: number, currentIndex: number, direction: 'up' | 'down'): number {
  if (count === 0) return -1;
  if (currentIndex === -1) return direction === 'down' ? 0 : count - 1;
  if (direction === 'down') return (currentIndex + 1) % count;
  return (currentIndex - 1 + count) % count;
}

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
  /** F4: while a "reread the scene" replay is playing back on top, number-key
   * picks are suppressed — a player mid-reread who hits 1-3 shouldn't have
   * it silently register as their answer once the replay finally ends. */
  private rereading = false;

  constructor(stageBottom: HTMLElement) {
    this.stage = stageBottom;
  }

  /** Presents a room's choices; resolves with the chosen one. `keepsakes`
   * (the active pack's — spec 08 §3 engine-default/pack-override pattern)
   * resolves the ✧ keepsake-choice tooltip's name; defaults to ANAMNESIS's
   * own list so pre-existing call sites are unaffected, but a second pack
   * (e.g. LIMERENCE) must pass its own or its keepsake choices render with
   * a nameless tooltip. `onReread`, if given, renders a "⟲ reread the scene"
   * button above the choices (F4) — clicking it awaits the caller's replay
   * of this stage's beats (read-only; state never changes mid-stage, so it's
   * always safe) and returns to these exact same, still-pending choices. */
  pick(
    choices: Choice[],
    state: RunState,
    roomId: string,
    keepsakes: KeepsakeDef[] = KEEPSAKES,
    onReread?: () => Promise<void>,
  ): Promise<Choice> {
    void state;
    return new Promise((resolve) => {
      const wrap = el('div', 'choices');
      wrap.setAttribute('role', 'group');
      if (onReread) {
        const rereadBtn = el('button', 'reread-btn', t(uiKey('rereadScene'), '⟲ reread the scene'));
        rereadBtn.type = 'button';
        rereadBtn.addEventListener('click', () => {
          void (async () => {
            rereadBtn.disabled = true;
            this.rereading = true;
            wrap.classList.add('rereading');
            await onReread();
            wrap.classList.remove('rereading');
            this.rereading = false;
            rereadBtn.disabled = false;
          })();
        });
        wrap.appendChild(rereadBtn);
      }
      choices.forEach((c, i) => {
        const card = el('button', 'choice-card');
        if (c.keepsakeId) {
          const def = keepsakes.find((k) => k.id === c.keepsakeId);
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
        // U-8 (extended review, 2026-08-01): a secret door showed only '✦',
        // with no visible numeral — but it's still selected by its ordinary
        // positional digit key (mount()'s keyHandler below doesn't
        // special-case secret doors), and doorHelp's "press its number" text
        // applies to it too. Showing the numeral alongside the star keeps
        // the "this is the stranger door" visual cue while making the
        // actual keyboard shortcut legible.
        card.append(el('span', 'num', d.secret ? `✦${i + 1}` : String(i + 1)));
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
    this.rereading = false;
    this.container = wrap;
    this.stage.appendChild(wrap);
    // P3: once each card's entrance animation actually finishes, drop
    // `animation` entirely (see the `.choice-card.settled` rule) so a later
    // theme toggle's --panel change reliably repaints it instead of risking
    // a stale composited layer.
    for (const card of wrap.querySelectorAll<HTMLElement>('.choice-card')) {
      // Scoped to the card's own entrance animation by name — found in code
      // review (2026-07-15) that an unscoped `{ once: true }` listener also
      // caught LIMERENCE's separate `limerence-scan` hover/focus animation
      // (its `::after` pseudo-element's animationend bubbles to this same
      // element), so hovering/focusing a card mid-entrance could consume
      // the listener early and snap the rise animation short.
      const onAnimationEnd = (e: AnimationEvent) => {
        if (e.animationName !== 'rise') return;
        card.classList.add('settled');
        card.removeEventListener('animationend', onAnimationEnd);
      };
      card.addEventListener('animationend', onAnimationEnd);
    }
    this.keyHandler = (e: KeyboardEvent) => {
      // A pause menu / codex / settings / field note is open on top —
      // don't silently pick a choice hidden underneath it. Same guard while
      // a "reread the scene" replay owns the number keys (F4).
      if (document.querySelector('.overlay, .field-note') || this.rereading) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const cards = Array.from(wrap.querySelectorAll<HTMLButtonElement>('button.choice-card'));
        if (cards.length === 0) return;
        const current = cards.indexOf(document.activeElement as HTMLButtonElement);
        const next = arrowNavIndex(cards.length, current, e.key === 'ArrowDown' ? 'down' : 'up');
        cards[next]?.focus();
        return;
      }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= count) onNum(n - 1);
    };
    addEventListener('keydown', this.keyHandler);
    // U-1 (extended review, 2026-08-01): F4's "reread the scene" button (see
    // `pick()` above) is always the first child of `wrap` when present —
    // `wrap.querySelector('button')` landed initial focus on it instead of
    // the first real choice, so pressing Enter right after the choices
    // appear replayed the beats instead of confirming anything. Door rows
    // (`pickDoor`, no reread button) were never affected.
    (wrap.querySelector('button.choice-card') as HTMLButtonElement | null ?? wrap.querySelector('button'))?.focus();
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
