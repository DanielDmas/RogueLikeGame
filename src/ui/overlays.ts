import type { Persona, Profile, Settings } from '../engine/saveStore';
import type { Ending, Room } from '../content/schema';
import { allRooms } from '../content/rooms';
import { endings } from '../content/endings';
import { actName } from '../content/graph';
import { clear, el } from './dom';
import { showFieldNote } from './fieldNote';
import { t } from '../content/text/resolver';
import {
  uiKey,
  roomTitleKey,
  roomNoteTitleKey,
  roomNoteThinkersKey,
  endingTitleKey,
  endingEpitaphKey,
} from '../content/text/keys';
import { LANGUAGE_LABELS } from './locale';
import type { Lang, TextVersion } from '../content/text/resolver';

export type TitleAction = 'new' | 'continue' | 'codex' | 'settings' | 'persona' | 'about';

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
        t(uiKey('titleTagline'), 'a journey of twenty rooms · every door is a question · the way back is through'),
      ),
    );
    const how = el('div', 'how-to-play');
    how.innerHTML = `
      <span>${t(uiKey('howToClick'), '<b>Click</b> a door, or press <b>1–3</b>, to choose your path')}</span>
      <span>${t(uiKey('howToAdvance'), '<b>Click</b> the text, or press <b>Space</b>, to continue')}</span>
      <span>${t(uiKey('howToPause'), '<b>Esc</b> to pause · hover a door to read its hint')}</span>
    `;
    o.append(how);
    const menu = el('div', 'title-menu');
    const done = (a: TitleAction) => {
      o.remove();
      resolve(a);
    };
    if (profile.run && !profile.run.finished) {
      const cont = el('button', 'title-btn', t(uiKey('continueJourney'), 'Continue the journey'));
      cont.addEventListener('click', () => done('continue'));
      menu.appendChild(cont);
    }
    const nb = el(
      'button',
      'title-btn',
      profile.runsCompleted > 0 ? t(uiKey('beginAgain'), 'Begin again') : t(uiKey('begin'), 'Begin'),
    );
    nb.addEventListener('click', () => done('new'));
    menu.appendChild(nb);
    const cx = el(
      'button',
      'title-btn small',
      `${t(uiKey('fieldNotes'), 'Field Notes')} · ${profile.codexUnlocked.length} ${t(uiKey('collected'), 'collected')}`,
    );
    cx.addEventListener('click', () => done('codex'));
    const pe = el(
      'button',
      'title-btn small',
      profile.persona.name
        ? `${t(uiKey('travelerLabel'), 'Traveler')}: ${profile.persona.name}`
        : t(uiKey('whoAreYou'), 'Who are you?'),
    );
    pe.addEventListener('click', () => done('persona'));
    const st = el('button', 'title-btn small', t(uiKey('settings'), 'Settings'));
    st.addEventListener('click', () => done('settings'));
    const ab = el('button', 'title-btn small', t(uiKey('aboutTitle'), 'Before you begin'));
    ab.addEventListener('click', () => done('about'));
    menu.append(cx, pe, st, ab);
    if (profile.endingsSeen.length > 0) {
      menu.append(
        el(
          'div',
          'title-sub',
          `${t(uiKey('endingsWitnessed'), 'endings witnessed')}: ${profile.endingsSeen.length} ${t(uiKey('of'), 'of')} ${endings.length}`,
        ),
      );
    }
    o.appendChild(menu);
  });
}

export function showSettings(ui: HTMLElement, settings: Settings): Promise<Settings> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    o.append(el('h2', undefined, t(uiKey('settings'), 'Settings')));
    const list = el('div', 'settings-list');
    const current = { ...settings };
    const onLabel = t(uiKey('on'), 'on');
    const offLabel = t(uiKey('off'), 'off');
    const rows: [keyof Settings, string][] = [
      ['music', t(uiKey('settingMusic'), 'Background music')],
      ['sfx', t(uiKey('settingSfx'), 'Sound effects')],
      ['typewriter', t(uiKey('settingTypewriter'), 'Typewriter text')],
      ['reducedMotion', t(uiKey('settingReducedMotion'), 'Reduced motion')],
      ['highContrast', t(uiKey('settingHighContrast'), 'High-contrast text')],
      ['quality', t(uiKey('settingQuality'), 'High visual quality')],
    ];
    for (const [key, label] of rows) {
      const row = el('div', 'setting-row');
      row.append(el('span', 'lbl', label));
      const isOn = () => (key === 'quality' ? current.quality === 'high' : Boolean(current[key]));
      const btn = el('button', 'toggle', isOn() ? onLabel : offLabel);
      btn.classList.toggle('on', isOn());
      btn.addEventListener('click', () => {
        if (key === 'quality') current.quality = current.quality === 'high' ? 'low' : 'high';
        else (current[key] as boolean) = !current[key];
        btn.textContent = isOn() ? onLabel : offLabel;
        btn.classList.toggle('on', isOn());
      });
      row.append(btn);
      list.append(row);
    }

    const versionLabel = (v: TextVersion) =>
      v === 'v2' ? t(uiKey('versionV2'), 'Voice: v2 (new)') : t(uiKey('versionV1'), 'Voice: v1 (original)');
    const versionOrder: TextVersion[] = ['v2', 'v1'];
    const versionRow = el('div', 'setting-row');
    versionRow.append(el('span', 'lbl', t(uiKey('settingTextVersion'), 'Text version')));
    const versionBtn = el('button', 'toggle cycle', versionLabel(current.textVersion));
    versionBtn.addEventListener('click', () => {
      const i = versionOrder.indexOf(current.textVersion);
      current.textVersion = versionOrder[(i + 1) % versionOrder.length];
      versionBtn.textContent = versionLabel(current.textVersion);
    });
    versionRow.append(versionBtn);
    list.append(versionRow);

    const langOrder: Lang[] = ['en', 'cs', 'fa'];
    const langRow = el('div', 'setting-row');
    langRow.append(el('span', 'lbl', t(uiKey('settingLanguage'), 'Language')));
    const langBtn = el('button', 'toggle cycle', LANGUAGE_LABELS[current.language]);
    langBtn.addEventListener('click', () => {
      const i = langOrder.indexOf(current.language);
      current.language = langOrder[(i + 1) % langOrder.length];
      langBtn.textContent = LANGUAGE_LABELS[current.language];
    });
    langRow.append(langBtn);
    list.append(langRow);

    list.append(
      el(
        'div',
        'title-sub',
        t(uiKey('settingsFooter'), 'quality changes apply on next load · language and voice apply immediately'),
      ),
    );
    const back = el('button', 'title-btn', t(uiKey('done'), 'Done'));
    back.style.marginTop = '26px';
    back.addEventListener('click', () => {
      o.remove();
      resolve(current);
    });
    o.append(list, back);
  });
}

interface PersonaPreset {
  id: string;
  name: string;
  blurb: string;
}

const PERSONA_PRESETS: PersonaPreset[] = [
  { id: 'mira', name: 'Mira', blurb: uiKey('persona.mira') },
  { id: 'sara', name: 'Sara', blurb: uiKey('persona.sara') },
  { id: 'daniel', name: 'Daniel', blurb: uiKey('persona.daniel') },
  { id: 'tomas', name: 'Tomas', blurb: uiKey('persona.tomas') },
];

const PERSONA_BLURB_FALLBACK: Record<string, string> = {
  [uiKey('persona.mira')]: 'You noticed things before anyone asked you to.',
  [uiKey('persona.sara')]: 'You stay until the end of things. You always have.',
  [uiKey('persona.daniel')]: 'You measure twice. You still cut wrong, sometimes.',
  [uiKey('persona.tomas')]: 'You forgive slowly, and completely, once you do.',
};

const ABOUT_BLURB_KEYS = ['persona.about1', 'persona.about2', 'persona.about3'];
const ABOUT_BLURB_FALLBACK: Record<string, string> = {
  'persona.about1': 'Careful with other people. Less careful with yourself.',
  'persona.about2': 'Quick to laugh, slow to say what actually happened.',
  'persona.about3': 'Still here. That is most of the answer, most days.',
};

/** Cosmetic-only persona picker: a preset name/blurb, or a custom one. No mechanical effect. */
export function showPersona(ui: HTMLElement, persona: Persona): Promise<Persona> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel persona-panel');
    panel.append(el('h2', undefined, t(uiKey('personaTitle'), 'Who are you, tonight?')));
    panel.append(
      el(
        'div',
        'sub',
        t(
          uiKey('personaSub'),
          'Purely for the Usher’s benefit — this changes nothing about the rooms, only how they speak to you.',
        ),
      ),
    );

    const presetGrid = el('div', 'persona-presets');
    let selectedId = persona.preset || PERSONA_PRESETS[0].id;
    const nameInput = el('input', 'persona-name-input') as HTMLInputElement;
    nameInput.type = 'text';
    nameInput.maxLength = 24;
    nameInput.placeholder = t(uiKey('personaNamePlaceholder'), 'Your name (or what you go by here)');
    nameInput.value = persona.name || PERSONA_PRESETS.find((p) => p.id === selectedId)?.name || '';

    const presetCards = PERSONA_PRESETS.map((preset) => {
      const card = el('button', 'persona-card');
      card.append(el('span', 'persona-card-name', preset.name));
      card.append(el('span', 'persona-card-blurb', t(preset.blurb, PERSONA_BLURB_FALLBACK[preset.blurb])));
      card.classList.toggle('selected', preset.id === selectedId);
      card.addEventListener('click', () => {
        selectedId = preset.id;
        nameInput.value = preset.name;
        for (const c of presetCards) c.classList.remove('selected');
        card.classList.add('selected');
      });
      presetGrid.appendChild(card);
      return card;
    });

    const nameRow = el('div', 'persona-name-row');
    nameRow.append(el('span', 'lbl', t(uiKey('personaNameLabel'), 'Name')), nameInput);

    const aboutWrap = el('div', 'persona-about');
    aboutWrap.append(
      el('div', 'lbl', t(uiKey('personaAboutLabel'), 'About you (optional — shown to no one, felt by the Usher)')),
    );
    const aboutTexts = ABOUT_BLURB_KEYS.map((k) => t(uiKey(k), ABOUT_BLURB_FALLBACK[k]));
    let selectedBlurb = persona.blurb || '';
    const blurbBtns = aboutTexts.map((b) => {
      const btn = el('button', 'persona-blurb-btn', b);
      btn.classList.toggle('selected', selectedBlurb === b);
      btn.addEventListener('click', () => {
        selectedBlurb = selectedBlurb === b ? '' : b;
        freeText.value = '';
        blurbBtns.forEach((x) => x.classList.toggle('selected', x === btn && selectedBlurb === b));
      });
      aboutWrap.appendChild(btn);
      return btn;
    });
    const freeText = el('textarea', 'persona-free-text') as HTMLTextAreaElement;
    freeText.maxLength = 140;
    freeText.placeholder = t(uiKey('personaFreeTextPlaceholder'), 'Or write your own, briefly…');
    freeText.value = aboutTexts.includes(persona.blurb) ? '' : persona.blurb || '';
    freeText.addEventListener('input', () => {
      if (freeText.value) {
        selectedBlurb = '';
        blurbBtns.forEach((x) => x.classList.remove('selected'));
      }
    });
    aboutWrap.append(freeText);

    const menu = el('div', 'title-menu');
    const skip = el('button', 'title-btn small', t(uiKey('personaSkip'), 'Skip — call me traveler'));
    skip.addEventListener('click', () => {
      o.remove();
      resolve({ preset: '', name: '', blurb: '' });
    });
    const done = el('button', 'title-btn', t(uiKey('continue'), 'Continue'));
    done.addEventListener('click', () => {
      o.remove();
      resolve({
        preset: selectedId,
        name: nameInput.value.trim(),
        blurb: (freeText.value.trim() || selectedBlurb).trim(),
      });
    });
    menu.append(done, skip);

    panel.append(presetGrid, nameRow, aboutWrap, menu);
    o.appendChild(panel);
  });
}

export function showAbout(ui: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel about-panel');
    panel.append(el('h2', undefined, t(uiKey('aboutTitle'), 'Before you begin')));
    const body = el('div', 'about-body');
    const p1 = t(
      uiKey('aboutWhy'),
      '<b>Why play.</b> Nothing here is graded right or wrong. Each choice quietly shifts three hidden inclinations — reason against feeling, self against others, control against acceptance — and those, not a scoreboard, shape which doors open, how the facility looks and sounds, and which of six endings you eventually reach. Honest engagement is the only thing rewarded.',
    );
    const p2 = t(
      uiKey('aboutHearts'),
      '<b>Hearts.</b> Three hearts are your grip on reality. You lose one by refusing rooms repeatedly, by badly failing certain INSIGHT rooms, by the principled-but-costly path in a few DOOMED rooms, or when your lucidity runs out entirely. Losing all three is not a failure screen — it is a real ending, and it is written as one.',
    );
    const p3 = t(
      uiKey('aboutDoors'),
      '<b>Doors.</b> Each door behind the corridor is a different situation, and you cannot walk through all of them in a single run. Choosing a door is choosing what you will face — and what you will skip — this time. A replay will show you the rest.',
    );
    body.innerHTML = `<p>${p1}</p><p>${p2}</p><p>${p3}</p>`;
    panel.append(body);
    const back = el('button', 'title-btn', t(uiKey('back'), 'Back'));
    back.style.marginTop = '26px';
    back.addEventListener('click', () => {
      o.remove();
      resolve();
    });
    panel.append(back);
    o.appendChild(panel);
  });
}

export function showCodex(ui: HTMLElement, profile: Profile): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel');
    panel.append(el('h2', undefined, t(uiKey('fieldNotes'), 'Field Notes')));
    panel.append(el('div', 'sub', t(uiKey('codexSub'), 'what you have walked through — it stays walked')));
    const grid = el('div', 'codex-grid');
    const notYetWalked = t(uiKey('notYetWalked'), 'not yet walked');
    const endingLabel = t(uiKey('ending'), 'Ending');
    const fieldNoteLabel = t(uiKey('fieldNoteHeader'), 'Field Note');

    const addCard = (id: string, actLabel: string, title: string, thinkers: string, note: Room['fieldNote'], isEnding = false) => {
      const unlocked = profile.codexUnlocked.includes(id);
      const card = el('button', `codex-card${unlocked ? '' : ' locked'}${isEnding ? ' ending-card' : ''}`);
      card.append(el('div', 'cx-act', actLabel));
      card.append(el('div', 'cx-title', unlocked ? title : '· · ·'));
      card.append(el('div', 'cx-thinkers', unlocked ? thinkers : notYetWalked));
      if (unlocked && note) {
        card.addEventListener('click', () => showFieldNote(ui, note, isEnding ? endingLabel : fieldNoteLabel));
      }
      grid.appendChild(card);
    };

    for (const room of allRooms) {
      if (room.id === 'last-message') {
        // Room 19's codex entry is the sentence you sent
        const unlocked = profile.codexUnlocked.includes(room.id);
        const lastMessageTitle = t(roomTitleKey(room.id), room.title);
        addCard(
          room.id,
          actName(room.act),
          lastMessageTitle,
          unlocked && profile.lastMessage ? `“${profile.lastMessage}”` : '',
          unlocked && profile.lastMessage
            ? {
                title: lastMessageTitle,
                thinkers: t(uiKey('senderYou'), 'sender: you'),
                body: `${t(uiKey('lastMessageBody'), 'You had one sentence, and this was it:')} ${profile.lastMessage}`,
              }
            : undefined,
        );
        continue;
      }
      addCard(
        room.id,
        actName(room.act),
        t(roomNoteTitleKey(room.id), room.fieldNote?.title ?? room.title),
        t(roomNoteThinkersKey(room.id), room.fieldNote?.thinkers ?? ''),
        room.fieldNote,
      );
    }
    const endingLabelAct = t(uiKey('ending'), 'Ending');
    for (const ending of endings) {
      addCard(
        `ending:${ending.id}`,
        endingLabelAct,
        t(endingTitleKey(ending.id), ending.title),
        t(endingEpitaphKey(ending.id), ending.epitaph),
        ending.fieldNote,
        true,
      );
    }

    const back = el('button', 'title-btn', t(uiKey('back'), 'Back'));
    back.style.marginTop = '30px';
    back.addEventListener('click', () => {
      o.remove();
      resolve();
    });
    panel.append(grid, back);
    o.appendChild(panel);
  });
}

export function showPauseMenu(
  ui: HTMLElement,
): Promise<'resume' | 'codex' | 'settings' | 'persona' | 'about' | 'title'> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    o.append(el('h2', undefined, t(uiKey('paused'), 'Paused')));
    o.append(el('div', 'sub', t(uiKey('pausedSub'), 'the rooms will wait — time here is decorative')));
    const menu = el('div', 'title-menu');
    const mk = (
      label: string,
      action: 'resume' | 'codex' | 'settings' | 'persona' | 'about' | 'title',
      small = false,
    ) => {
      const b = el('button', `title-btn${small ? ' small' : ''}`, label);
      b.addEventListener('click', () => {
        removeEventListener('keydown', onKey);
        o.remove();
        resolve(action);
      });
      menu.appendChild(b);
    };
    mk(t(uiKey('resume'), 'Resume'), 'resume');
    mk(t(uiKey('fieldNotes'), 'Field Notes'), 'codex', true);
    mk(t(uiKey('whoAreYou'), 'Who are you?'), 'persona', true);
    mk(t(uiKey('settings'), 'Settings'), 'settings', true);
    mk(t(uiKey('aboutTitle'), 'Before you begin'), 'about', true);
    mk(t(uiKey('abandonToTitle'), 'Abandon to title'), 'title', true);
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
    recap.append(el('h4', undefined, t(uiKey('recapHeader'), 'What you walked through')));
    for (const r of data.recap) {
      const item = el('div', 'recap-item');
      item.append(el('span', 'r-title', r.title));
      item.append(el('span', 'r-thesis', r.thesis));
      recap.append(item);
    }
    inner.append(recap);

    const stats = el('div', 'run-stats');
    stats.innerHTML = `<span>${t(uiKey('statLucidity'), 'lucidity')} <b>${data.lucidity}</b></span><span>${t(uiKey('statHearts'), 'hearts kept')} <b>${data.hearts}</b></span><span>${t(uiKey('statNewNotes'), 'new field notes')} <b>${data.newNotes}</b></span>`;
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
    mk(t(uiKey('walkAgain'), 'Walk again — the rooms rearrange for no one, but you have changed'), 'again');
    mk(t(uiKey('fieldNotes'), 'Field Notes'), 'codex', true);
    mk(t(uiKey('title'), 'Title'), 'title', true);
    inner.append(menu);
    o.appendChild(inner);
  });
}

export function clearOverlays(ui: HTMLElement) {
  for (const node of [...ui.querySelectorAll('.overlay')]) node.remove();
  void clear;
}
