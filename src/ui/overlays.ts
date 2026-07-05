import type { Profile, Settings } from '../engine/saveStore';
import type { Ending, Room } from '../content/schema';
import { allRooms } from '../content/rooms';
import { endings } from '../content/endings';
import { ACT_NAMES } from '../content/graph';
import { clear, el } from './dom';
import { showFieldNote } from './fieldNote';

export type TitleAction = 'new' | 'continue' | 'codex' | 'settings';

function overlay(ui: HTMLElement): HTMLElement {
  const o = el('div', 'overlay fade-in');
  ui.appendChild(o);
  return o;
}

export function showTitle(ui: HTMLElement, profile: Profile): Promise<TitleAction> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    o.append(el('div', 'title-word', 'ANAMNESIS'));
    o.append(
      el(
        'div',
        'title-sub',
        'a journey of twenty rooms · every door is a question · the way back is through',
      ),
    );
    const how = el('div', 'how-to-play');
    how.innerHTML = `
      <span><b>Click</b> a door, or press <b>1–3</b>, to choose your path</span>
      <span><b>Click</b> the text, or press <b>Space</b>, to continue</span>
      <span><b>Esc</b> to pause · hover a door to read its hint</span>
    `;
    o.append(how);
    const menu = el('div', 'title-menu');
    const done = (a: TitleAction) => {
      o.remove();
      resolve(a);
    };
    if (profile.run && !profile.run.finished) {
      const cont = el('button', 'title-btn', 'Continue the journey');
      cont.addEventListener('click', () => done('continue'));
      menu.appendChild(cont);
    }
    const nb = el('button', 'title-btn', profile.runsCompleted > 0 ? 'Begin again' : 'Begin');
    nb.addEventListener('click', () => done('new'));
    menu.appendChild(nb);
    const cx = el('button', 'title-btn small', `Field Notes · ${profile.codexUnlocked.length} collected`);
    cx.addEventListener('click', () => done('codex'));
    const st = el('button', 'title-btn small', 'Settings');
    st.addEventListener('click', () => done('settings'));
    menu.append(cx, st);
    if (profile.endingsSeen.length > 0) {
      menu.append(
        el('div', 'title-sub', `endings witnessed: ${profile.endingsSeen.length} of ${endings.length}`),
      );
    }
    o.appendChild(menu);
  });
}

export function showSettings(ui: HTMLElement, settings: Settings): Promise<Settings> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    o.append(el('h2', undefined, 'Settings'));
    const list = el('div', 'settings-list');
    const current = { ...settings };
    const rows: [keyof Settings, string][] = [
      ['music', 'Background music'],
      ['sfx', 'Sound effects'],
      ['typewriter', 'Typewriter text'],
      ['reducedMotion', 'Reduced motion'],
      ['highContrast', 'High-contrast text'],
      ['quality', 'High visual quality'],
    ];
    for (const [key, label] of rows) {
      const row = el('div', 'setting-row');
      row.append(el('span', 'lbl', label));
      const isOn = () => (key === 'quality' ? current.quality === 'high' : Boolean(current[key]));
      const btn = el('button', 'toggle', isOn() ? 'on' : 'off');
      btn.classList.toggle('on', isOn());
      btn.addEventListener('click', () => {
        if (key === 'quality') current.quality = current.quality === 'high' ? 'low' : 'high';
        else (current[key] as boolean) = !current[key];
        btn.textContent = isOn() ? 'on' : 'off';
        btn.classList.toggle('on', isOn());
      });
      row.append(btn);
      list.append(row);
    }
    list.append(el('div', 'title-sub', 'quality changes apply on next load'));
    const back = el('button', 'title-btn', 'Done');
    back.style.marginTop = '26px';
    back.addEventListener('click', () => {
      o.remove();
      resolve(current);
    });
    o.append(list, back);
  });
}

export function showCodex(ui: HTMLElement, profile: Profile): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel');
    panel.append(el('h2', undefined, 'Field Notes'));
    panel.append(el('div', 'sub', 'what you have walked through — it stays walked'));
    const grid = el('div', 'codex-grid');

    const addCard = (id: string, actLabel: string, title: string, thinkers: string, note: Room['fieldNote'], isEnding = false) => {
      const unlocked = profile.codexUnlocked.includes(id);
      const card = el('button', `codex-card${unlocked ? '' : ' locked'}${isEnding ? ' ending-card' : ''}`);
      card.append(el('div', 'cx-act', actLabel));
      card.append(el('div', 'cx-title', unlocked ? title : '· · ·'));
      card.append(el('div', 'cx-thinkers', unlocked ? thinkers : 'not yet walked'));
      if (unlocked && note) {
        card.addEventListener('click', () => showFieldNote(ui, note, isEnding ? 'Ending' : 'Field Note'));
      }
      grid.appendChild(card);
    };

    for (const room of allRooms) {
      if (room.id === 'last-message') {
        // Room 19's codex entry is the sentence you sent
        const unlocked = profile.codexUnlocked.includes(room.id);
        addCard(
          room.id,
          ACT_NAMES[room.act],
          'The Last Message',
          unlocked && profile.lastMessage ? `“${profile.lastMessage}”` : '',
          unlocked && profile.lastMessage
            ? { title: 'The Last Message', thinkers: 'sender: you', body: `You had one sentence, and this was it: ${profile.lastMessage}` }
            : undefined,
        );
        continue;
      }
      addCard(room.id, ACT_NAMES[room.act], room.fieldNote?.title ?? room.title, room.fieldNote?.thinkers ?? '', room.fieldNote);
    }
    for (const ending of endings) {
      addCard(`ending:${ending.id}`, 'Ending', ending.title, ending.epitaph, ending.fieldNote, true);
    }

    const back = el('button', 'title-btn', 'Back');
    back.style.marginTop = '30px';
    back.addEventListener('click', () => {
      o.remove();
      resolve();
    });
    panel.append(grid, back);
    o.appendChild(panel);
  });
}

export function showPauseMenu(ui: HTMLElement): Promise<'resume' | 'codex' | 'settings' | 'title'> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    o.append(el('h2', undefined, 'Paused'));
    o.append(el('div', 'sub', 'the rooms will wait — time here is decorative'));
    const menu = el('div', 'title-menu');
    const mk = (label: string, action: 'resume' | 'codex' | 'settings' | 'title', small = false) => {
      const b = el('button', `title-btn${small ? ' small' : ''}`, label);
      b.addEventListener('click', () => {
        removeEventListener('keydown', onKey);
        o.remove();
        resolve(action);
      });
      menu.appendChild(b);
    };
    mk('Resume', 'resume');
    mk('Field Notes', 'codex', true);
    mk('Settings', 'settings', true);
    mk('Abandon to title', 'title', true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        removeEventListener('keydown', onKey);
        o.remove();
        resolve('resume');
      }
    };
    addEventListener('keydown', onKey);
    o.appendChild(menu);
  });
}

export interface EndScreenData {
  ending: Ending;
  triptych: [string, string, string];
  recap: { title: string; thesis: string }[];
  lucidity: number;
  hearts: number;
  newNotes: number;
}

export function showEndScreen(ui: HTMLElement, data: EndScreenData): Promise<'again' | 'codex' | 'title'> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const inner = el('div', 'codex-panel');
    inner.style.textAlign = 'center';
    inner.append(el('div', 'ending-title', data.ending.title));
    inner.append(el('div', 'ending-epitaph', data.ending.epitaph));
    const trip = el('div', 'triptych');
    for (const line of data.triptych) trip.append(el('div', 'line', line));
    inner.append(trip);

    const recap = el('div', 'recap');
    recap.append(el('h4', undefined, 'What you walked through'));
    for (const r of data.recap) {
      const item = el('div', 'recap-item');
      item.append(el('span', 'r-title', r.title));
      item.append(el('span', 'r-thesis', r.thesis));
      recap.append(item);
    }
    inner.append(recap);

    const stats = el('div', 'run-stats');
    stats.innerHTML = `<span>lucidity <b>${data.lucidity}</b></span><span>hearts kept <b>${data.hearts}</b></span><span>new field notes <b>${data.newNotes}</b></span>`;
    inner.append(stats);

    const menu = el('div', 'title-menu');
    const mk = (label: string, action: 'again' | 'codex' | 'title', small = false) => {
      const b = el('button', `title-btn${small ? ' small' : ''}`, label);
      b.addEventListener('click', () => {
        o.remove();
        resolve(action);
      });
      menu.appendChild(b);
    };
    mk('Walk again — the rooms rearrange for no one, but you have changed', 'again');
    mk('Field Notes', 'codex', true);
    mk('Title', 'title', true);
    inner.append(menu);
    o.appendChild(inner);
  });
}

export function clearOverlays(ui: HTMLElement) {
  for (const node of [...ui.querySelectorAll('.overlay')]) node.remove();
  void clear;
}
