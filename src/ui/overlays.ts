import type { Persona, Profile, Settings } from '../engine/saveStore';
import type { Ending, FieldNote, Room } from '../engine/schema';
import type { ContentPack } from '../packs/types';
import { epiphanyLine, epiphanyLines, isHiddenFromCodex, ledgerStats } from '../engine/ledger';
import type { RoomRegistry } from '../engine/storyEngine';
import { clear, el, HEART_SVG } from './dom';
import { showFieldNote } from './fieldNote';
import { t } from '../engine/text/resolver';
import {
  uiKey,
  roomTitleKey,
  roomNoteTitleKey,
  roomNoteThinkersKey,
  roomNoteBodyKey,
  endingTitleKey,
  endingEpitaphKey,
  endingNoteTitleKey,
  endingNoteThinkersKey,
  endingNoteBodyKey,
  keepsakeKey,
  actNameKey,
} from '../engine/text/keys';
import { LANGUAGE_LABELS } from './locale';
import { nextLang } from '../engine/text/resolver';
import type { TextVersion } from '../engine/text/resolver';
import { sound } from '../audio/soundEngine';
import { isElectron, isFullscreen, toggleFullscreen } from './fullscreen';
import { applyUiZoom } from './zoom';

export type TitleAction = 'new' | 'continue' | 'codex' | 'ledger' | 'settings' | 'persona' | 'about' | 'exit';

function overlay(ui: HTMLElement): HTMLElement {
  const o = el('div', 'overlay fade-in');
  ui.appendChild(o);
  return o;
}

export function showTitle(ui: HTMLElement, profile: Profile, pack: ContentPack): Promise<TitleAction> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    o.append(el('div', 'title-word', pack.meta.title));
    o.append(
      el(
        'div',
        'title-sub',
        t(uiKey('titleTagline'), 'a journey through the rooms · every door is a question · the way back is through'),
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
    const lg = el('button', 'title-btn small', t(uiKey('ledger'), "Traveler's Ledger"));
    lg.addEventListener('click', () => done('ledger'));
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
    menu.append(cx, lg, pe, st, ab);
    // Only the Electron build can actually close its own window — a browser
    // tab can't quit itself, so the button only appears there.
    if (isElectron()) {
      const ex = el('button', 'title-btn small', t(uiKey('exitGame'), 'Exit game'));
      ex.addEventListener('click', () => done('exit'));
      menu.append(ex);
    }
    if (profile.endingsSeen.length > 0) {
      menu.append(
        el(
          'div',
          'title-sub',
          `${t(uiKey('endingsWitnessed'), 'endings witnessed')}: ${profile.endingsSeen.length} ${t(uiKey('of'), 'of')} ${pack.endingRules.endingsTotal(profile.endingsSeen)}`,
        ),
      );
    }
    o.appendChild(menu);
    if (typeof __APP_VERSION__ === 'string' && __APP_VERSION__) {
      o.append(el('div', 'title-version', `v${__APP_VERSION__}`));
    }
  });
}

export interface SettingsActions {
  /** Whether a run is currently in progress (title screen with no save has none). */
  hasRun: boolean;
  /** Abandons the in-progress run only; codex/endings/settings/persona are untouched. */
  onResetRun: () => void;
  /** Wipes the entire profile back to defaults and reloads. */
  onResetProgress: () => void;
  /** R9: returns the current profile serialized as JSON, for a client-side download. */
  onExportProfile: () => string;
  /** R9: attempts to replace the profile with `raw` (pasted JSON). Returns
   * false without changing anything if `raw` isn't valid JSON; on success it
   * persists and reloads, so the caller never needs to handle that half. */
  onImportProfile: (raw: string) => boolean;
  /** Download filename prefix for the exported profile (pack.meta.exportPrefix). */
  exportPrefix: string;
  /** Whether to offer the light/dark toggle (pack.visuals.supportsLightTheme). */
  themeSelectable: boolean;
}

/** A row: label + control on one line, a short explanatory line underneath. */
function settingRow(label: string, desc: string, control: HTMLElement): HTMLElement {
  const row = el('div', 'setting-row');
  const top = el('div', 'setting-row-top');
  top.append(el('span', 'lbl', label), control);
  row.append(top);
  if (desc) row.append(el('div', 'setting-desc', desc));
  return row;
}

function sectionEl(title: string): { section: HTMLElement; body: HTMLElement } {
  const section = el('div', 'settings-section');
  section.append(el('h3', undefined, title));
  const body = el('div', 'settings-section-body');
  section.append(body);
  return { section, body };
}

/** A destructive action needs one extra click within a few seconds to fire — no separate confirm dialog needed. */
function confirmButton(label: string, confirmLabel: string, onConfirm: () => void): HTMLButtonElement {
  const btn = el('button', 'toggle danger', label);
  let armed = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const disarm = () => {
    armed = false;
    btn.textContent = label;
    btn.classList.remove('armed');
  };
  btn.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      btn.textContent = confirmLabel;
      btn.classList.add('armed');
      timer = setTimeout(disarm, 4000);
      return;
    }
    if (timer) clearTimeout(timer);
    onConfirm();
  });
  return btn;
}

export function showSettings(ui: HTMLElement, settings: Settings, actions: SettingsActions): Promise<Settings> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'settings-panel');
    panel.append(el('h2', undefined, t(uiKey('settings'), 'Settings')));
    const scroll = el('div', 'settings-scroll');
    const sections = el('div', 'settings-sections');
    const current = { ...settings };
    const onLabel = t(uiKey('on'), 'on');
    const offLabel = t(uiKey('off'), 'off');
    const fullscreenListeners: (() => void)[] = [];

    const toggleRow = (
      body: HTMLElement,
      key:
        | 'music'
        | 'sfx'
        | 'typewriter'
        | 'reducedMotion'
        | 'highContrast'
        | 'quality'
        | 'dynamicScenery'
        | 'examinedPathDefault'
        | 'theme',
      label: string,
      desc: string,
    ) => {
      const isOn = () =>
        key === 'quality' ? current.quality === 'high' : key === 'theme' ? current.theme === 'light' : Boolean(current[key]);
      const btn = el('button', 'toggle', isOn() ? onLabel : offLabel);
      btn.classList.toggle('on', isOn());
      btn.addEventListener('click', () => {
        if (key === 'quality') current.quality = current.quality === 'high' ? 'low' : 'high';
        else if (key === 'theme') {
          current.theme = current.theme === 'light' ? 'dark' : 'light';
          document.body.classList.toggle('theme-light', current.theme === 'light');
        } else (current[key] as boolean) = !current[key];
        btn.textContent = isOn() ? onLabel : offLabel;
        btn.classList.toggle('on', isOn());
      });
      body.append(settingRow(label, desc, btn));
      return btn;
    };

    // ---------- Display ----------
    const { section: displaySection, body: displayBody } = sectionEl(t(uiKey('settingsSectionDisplay'), 'Display'));

    const fsBtn = el('button', 'toggle', isFullscreen() ? onLabel : offLabel);
    fsBtn.classList.toggle('on', isFullscreen());
    fsBtn.addEventListener('click', () => void toggleFullscreen());
    const onFsChange = () => {
      fsBtn.textContent = isFullscreen() ? onLabel : offLabel;
      fsBtn.classList.toggle('on', isFullscreen());
    };
    document.addEventListener('fullscreenchange', onFsChange);
    fullscreenListeners.push(() => document.removeEventListener('fullscreenchange', onFsChange));
    displayBody.append(
      settingRow(
        t(uiKey('settingFullscreen'), 'Fullscreen'),
        t(uiKey('settingFullscreenDesc'), 'Fill the whole screen — also toggled with the F key.'),
        fsBtn,
      ),
    );

    const scaleOrder: Settings['renderScale'][] = ['performance', 'standard', 'sharp'];
    const scaleLabel = (v: Settings['renderScale']) =>
      ({
        performance: t(uiKey('renderScalePerformance'), 'Render resolution: Performance'),
        standard: t(uiKey('renderScaleStandard'), 'Render resolution: Standard'),
        sharp: t(uiKey('renderScaleSharp'), 'Render resolution: Sharp'),
      })[v];
    const scaleBtn = el('button', 'toggle cycle', scaleLabel(current.renderScale));
    scaleBtn.addEventListener('click', () => {
      const i = scaleOrder.indexOf(current.renderScale);
      current.renderScale = scaleOrder[(i + 1) % scaleOrder.length];
      scaleBtn.textContent = scaleLabel(current.renderScale);
    });
    displayBody.append(
      settingRow(
        t(uiKey('settingRenderScale'), 'Render resolution'),
        t(uiKey('settingRenderScaleDesc'), 'Lower = smoother on weaker graphics cards, a touch softer image. Sharp uses your full screen resolution.'),
        scaleBtn,
      ),
    );

    const zoomRow = el('div', 'setting-row');
    const zoomTop = el('div', 'setting-row-top');
    zoomTop.append(el('span', 'lbl', t(uiKey('settingUiZoom'), 'Interface size')));
    const zoomSlider = el('input', 'volume-slider') as HTMLInputElement;
    zoomSlider.type = 'range';
    zoomSlider.min = '80';
    zoomSlider.max = '130';
    zoomSlider.step = '5';
    zoomSlider.value = String(Math.round(current.uiZoom * 100));
    const zoomValue = el('span', 'zoom-value', `${Math.round(current.uiZoom * 100)}%`);
    zoomSlider.addEventListener('input', () => {
      current.uiZoom = Number(zoomSlider.value) / 100;
      zoomValue.textContent = `${zoomSlider.value}%`;
      applyUiZoom(current.uiZoom);
    });
    zoomTop.append(zoomSlider, zoomValue);
    zoomRow.append(zoomTop, el('div', 'setting-desc', t(uiKey('settingUiZoomDesc'), 'Scales menus and text to your liking — the 3D scene stays sharp.')));
    displayBody.append(zoomRow);

    toggleRow(displayBody, 'quality', t(uiKey('settingQuality'), 'High visual quality'), t(uiKey('settingQualityDesc'), 'Glow and smoothing effects; needs a stronger graphics card. Applies on next load.'));
    if (actions.themeSelectable) {
      toggleRow(displayBody, 'theme', t(uiKey('settingLightMode'), 'Light mode'), t(uiKey('settingLightModeDesc'), 'The morning-after read of the same hotel — same rooms, softer light.'));
    }
    toggleRow(displayBody, 'dynamicScenery', t(uiKey('settingDynamicScenery'), 'Dynamic scenery (experimental)'), t(uiKey('settingDynamicSceneryDesc'), 'Rooms subtly tint the light and fog to match their mood.'));
    toggleRow(displayBody, 'reducedMotion', t(uiKey('settingReducedMotion'), 'Reduced motion'), t(uiKey('settingReducedMotionDesc'), 'Cuts camera drift and easing to near-instant — kinder to motion sensitivity.'));

    // ---------- Audio ----------
    const { section: audioSection, body: audioBody } = sectionEl(t(uiKey('settingsSectionAudio'), 'Audio'));
    toggleRow(audioBody, 'music', t(uiKey('settingMusic'), 'Background music'), t(uiKey('settingMusicDesc'), 'A quiet, evolving ambience that shifts with each act.'));
    const musicVolRow = el('div', 'setting-row slider-row');
    const musicVolTop = el('div', 'setting-row-top');
    musicVolTop.append(el('span', 'lbl', t(uiKey('settingMusicVolume'), 'Music volume')));
    const musicSlider = el('input', 'volume-slider') as HTMLInputElement;
    musicSlider.type = 'range';
    musicSlider.min = '0';
    musicSlider.max = '100';
    musicSlider.step = '5';
    musicSlider.value = String(Math.round(current.musicVolume * 100));
    musicSlider.addEventListener('input', () => {
      const v = Number(musicSlider.value) / 100;
      current.musicVolume = v;
      sound.setMusicVolume(v);
    });
    musicVolTop.append(musicSlider);
    musicVolRow.append(musicVolTop);
    audioBody.append(musicVolRow);

    toggleRow(audioBody, 'sfx', t(uiKey('settingSfx'), 'Sound effects'), t(uiKey('settingSfxDesc'), 'Door chimes, page turns, and the small sounds of choosing.'));
    const sfxVolRow = el('div', 'setting-row slider-row');
    const sfxVolTop = el('div', 'setting-row-top');
    sfxVolTop.append(el('span', 'lbl', t(uiKey('settingSfxVolume'), 'Effects volume')));
    const sfxSlider = el('input', 'volume-slider') as HTMLInputElement;
    sfxSlider.type = 'range';
    sfxSlider.min = '0';
    sfxSlider.max = '100';
    sfxSlider.step = '5';
    sfxSlider.value = String(Math.round(current.sfxVolume * 100));
    sfxSlider.addEventListener('input', () => {
      const v = Number(sfxSlider.value) / 100;
      current.sfxVolume = v;
      sound.setSfxVolume(v);
    });
    sfxVolTop.append(sfxSlider);
    sfxVolRow.append(sfxVolTop);
    audioBody.append(sfxVolRow);

    // ---------- Text & Language ----------
    const { section: textSection, body: textBody } = sectionEl(t(uiKey('settingsSectionText'), 'Text & Language'));
    const langBtn = el('button', 'toggle cycle', LANGUAGE_LABELS[current.language]);
    langBtn.addEventListener('click', () => {
      current.language = nextLang(current.language);
      langBtn.textContent = LANGUAGE_LABELS[current.language];
    });
    textBody.append(settingRow(t(uiKey('settingLanguage'), 'Language'), t(uiKey('settingLanguageDesc'), 'Applies immediately, everywhere in the game.'), langBtn));

    const versionLabel = (v: TextVersion) =>
      v === 'v2' ? t(uiKey('versionV2'), 'Voice: v2 (new)') : t(uiKey('versionV1'), 'Voice: v1 (original)');
    const versionOrder: TextVersion[] = ['v2', 'v1'];
    const versionBtn = el('button', 'toggle cycle', versionLabel(current.textVersion));
    versionBtn.addEventListener('click', () => {
      const i = versionOrder.indexOf(current.textVersion);
      current.textVersion = versionOrder[(i + 1) % versionOrder.length];
      versionBtn.textContent = versionLabel(current.textVersion);
    });
    textBody.append(settingRow(t(uiKey('settingTextVersion'), 'Text version'), t(uiKey('settingTextVersionDesc'), 'v1 is the original voice, kept as a selectable backup; v2 is the current rewrite.'), versionBtn));

    toggleRow(textBody, 'typewriter', t(uiKey('settingTypewriter'), 'Typewriter text'), t(uiKey('settingTypewriterDesc'), 'Text appears letter by letter, like being told a story.'));
    toggleRow(textBody, 'highContrast', t(uiKey('settingHighContrast'), 'High-contrast text'), t(uiKey('settingHighContrastDesc'), 'Brighter text color for easier reading.'));
    toggleRow(
      textBody,
      'examinedPathDefault',
      t(uiKey('settingExaminedPath'), 'Examined Path — offered at the start of each new run'),
      t(uiKey('settingExaminedPathDesc'), 'Only changes what is pre-selected when a new run begins — you are always asked, and this run’s choice is unaffected.'),
    );

    // ---------- Data ----------
    const { section: dataSection, body: dataBody } = sectionEl(t(uiKey('settingsSectionData'), 'Data'));
    if (actions.hasRun) {
      const resetRunBtn = confirmButton(
        t(uiKey('resetRun'), 'Reset current run'),
        t(uiKey('confirmAgain'), 'Click again to confirm'),
        () => {
          actions.onResetRun();
          resetRunBtn.textContent = t(uiKey('resetRunDone'), 'Run reset');
          resetRunBtn.disabled = true;
        },
      );
      dataBody.append(settingRow(t(uiKey('resetRun'), 'Reset current run'), t(uiKey('resetRunDesc'), 'Abandons your in-progress journey. Field notes, endings, and settings are kept.'), resetRunBtn));
    }
    const resetProgressBtn = confirmButton(
      t(uiKey('resetProgress'), 'Reset all progress'),
      t(uiKey('confirmAgain'), 'Click again to confirm'),
      () => actions.onResetProgress(),
    );
    dataBody.append(settingRow(t(uiKey('resetProgress'), 'Reset all progress'), t(uiKey('resetProgressDesc'), 'Wipes everything — field notes, endings, settings, your current run — back to the very start.'), resetProgressBtn));

    const exportBtn = el('button', 'toggle', t(uiKey('exportProfileButton'), 'Download'));
    exportBtn.addEventListener('click', () => {
      const json = actions.onExportProfile();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = el('a') as HTMLAnchorElement;
      a.href = url;
      a.download = `${actions.exportPrefix}-profile-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
    dataBody.append(
      settingRow(
        t(uiKey('exportProfile'), 'Export profile'),
        t(uiKey('exportProfileDesc'), 'Downloads your whole profile as a file — a personal backup, or something to send if you ever need help.'),
        exportBtn,
      ),
    );

    const importWrap = el('div', 'setting-row');
    const importTop = el('div', 'setting-row-top');
    importTop.append(el('span', 'lbl', t(uiKey('importProfile'), 'Import profile')));
    const importArea = el('textarea', 'import-textarea') as HTMLTextAreaElement;
    importArea.placeholder = t(uiKey('importProfilePlaceholder'), 'Paste an exported profile file’s contents here');
    const importStatus = el('div', 'setting-desc', '');
    const importBtn = confirmButton(
      t(uiKey('importProfileButton'), 'Import'),
      t(uiKey('confirmAgain'), 'Click again to confirm'),
      () => {
        const ok = actions.onImportProfile(importArea.value);
        importStatus.textContent = ok
          ? t(uiKey('importProfileSuccess'), 'Imported — reloading…')
          : t(uiKey('importProfileError'), 'That doesn’t look like a valid profile file — nothing was changed.');
      },
    );
    importTop.append(importBtn);
    importWrap.append(
      importTop,
      el('div', 'setting-desc', t(uiKey('importProfileDesc'), 'Replaces your entire profile with the pasted file. Your current progress is overwritten — export it first if you want to keep it.')),
      importArea,
      importStatus,
    );
    dataBody.append(importWrap);

    sections.append(displaySection, audioSection, textSection, dataSection);
    scroll.append(sections);
    panel.append(scroll);

    const footer = el('div', 'settings-footer');
    footer.append(
      el('div', 'title-sub', t(uiKey('settingsFooter'), 'quality changes apply on next load · everything else applies immediately')),
    );
    const back = el('button', 'title-btn', t(uiKey('done'), 'Done'));
    back.addEventListener('click', () => {
      for (const off of fullscreenListeners) off();
      o.remove();
      resolve(current);
    });
    footer.append(back);
    panel.append(footer);
    o.appendChild(panel);
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

/**
 * The About/"Before you begin" panel's body content, computed as pure HTML
 * (no DOM mutation) so it's unit-testable without a browser environment.
 * ANAMNESIS (`pack.advisory` undefined) gets its original, unchanged
 * why-play/hearts/doors explainer. A pack that defines `advisory` (spec
 * `10-safety-education-charter.md` §2) gets its own mechanics note plus the
 * mandatory safety/education layer: purpose statement, themes list, the
 * minors'-content note, the fiction-not-therapy note, the help line, and a
 * no-telemetry restatement — shown automatically once via the existing
 * `Profile.hasSeenAbout` mechanism and re-viewable from the title menu.
 */
export function aboutBodyHtml(pack: ContentPack): string {
  const heartGlyph = `<span class="about-heart-glyph">${HEART_SVG}</span>`;
  if (!pack.advisory) {
    const p1 = t(
      uiKey('aboutWhy'),
      '<b>Why play.</b> Nothing here is graded right or wrong. Each choice quietly shifts three hidden inclinations — reason against feeling, self against others, control against acceptance — and those, not a scoreboard, shape which doors open, how the facility looks and sounds, and which of six endings you eventually reach. Honest engagement is the only thing rewarded.',
    );
    const p2 = t(
      uiKey('aboutHearts'),
      '<b>Hearts.</b> Three hearts are your grip on reality. A handful of especially costly choices — always sign-posted by the Usher first — spend one outright, and so does letting your lucidity run out completely. Losing all three is not a failure screen — it is a real ending, and it is written as one.',
    );
    const p3 = t(
      uiKey('aboutDoors'),
      '<b>Doors.</b> Each door behind the corridor is a different situation, and you cannot walk through all of them in a single run. Choosing a door is choosing what you will face — and what you will skip — this time. A replay will show you the rest.',
    );
    return `<p>${p1}</p><p>${heartGlyph}${p2}</p><p>${p3}</p>`;
  }
  const a = pack.advisory;
  const purpose = t(uiKey('aboutPurpose'), `<b>Why this exists.</b> ${a.purposeStatement}`);
  const mechanics = t(uiKey('aboutMechanics'), `<b>How it works.</b> ${a.mechanicsNote}`);
  const themes = t(uiKey('aboutThemes'), `<b>Themes.</b> ${a.themes}`);
  const minors = t(uiKey('aboutMinorsNote'), a.minorsNote);
  const fiction = t(uiKey('aboutFictionNote'), a.fictionNote);
  const help = t(uiKey('aboutHelpLine'), `<b>If this is your life right now.</b> ${a.helpLine}`);
  const telemetry = t(uiKey('aboutNoTelemetry'), a.noTelemetry);
  return `<p>${purpose}</p><p>${heartGlyph}${mechanics}</p><p>${themes}</p><p><i>${minors} ${fiction}</i></p><p>${help}</p><p>${telemetry}</p>`;
}

export function showAbout(ui: HTMLElement, pack: ContentPack): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel about-panel');
    panel.append(el('h2', undefined, t(uiKey('aboutTitle'), 'Before you begin')));
    const body = el('div', 'about-body');
    body.innerHTML = aboutBodyHtml(pack);
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

/**
 * The Examined Path's opt-in panel (spec 05) — shown once, only on a fresh
 * `'new'` run (never `'continue'`, never mid-run: the mode is immutable once
 * a run starts). Two equal-weight buttons, neither preselected or marked
 * "recommended" — the owner's requirement that this be a genuine, informed
 * opt-in, not a nudge. Resolves `true` for the Examined Path, `false` for
 * walking plainly.
 */
export function showExaminedPathOffer(ui: HTMLElement, defaultOn: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel about-panel');
    panel.append(el('h2', undefined, t(uiKey('examinedOfferTitle'), 'The Examination Annex')));
    const body = el('div', 'about-body');
    const p1 = t(
      uiKey('examinedOfferIntro'),
      'The Annex files commentary. It has no opinion — it has four.',
    );
    const p2 = t(
      uiKey('examinedOfferBody'),
      'An optional stamp on your intake file: after each significant choice, a quiet clerk holds up how a few named ethical traditions might read what you just did — side by side, disagreeing with each other on purpose. Nothing here is graded or scored, and no reading is ever the "right" one. The rooms, the hearts, and the endings you can reach are completely unchanged either way. Every card dismisses with a single click. You can change the default for next time later, in Settings.',
    );
    body.innerHTML = `<p><i>${p1}</i></p><p>${p2}</p>`;
    panel.append(body);

    const menu = el('div', 'title-menu');
    const done = (choice: boolean) => {
      o.remove();
      resolve(choice);
    };
    const plain = el('button', 'title-btn', t(uiKey('walkPlainly'), 'Walk plainly'));
    plain.addEventListener('click', () => done(false));
    const examined = el('button', 'title-btn', t(uiKey('takeExaminedPath'), 'Take the Examined Path'));
    examined.addEventListener('click', () => done(true));
    // Equal visual weight, neither preselected — order mirrors the default
    // only so a returning player's habitual choice reads first, never as
    // an endorsement of it.
    if (defaultOn) menu.append(examined, plain);
    else menu.append(plain, examined);
    panel.append(menu);
    o.appendChild(panel);
  });
}

/**
 * Translates a room/ending field note before it's shown from the codex.
 * Pulled out as a pure function (no DOM) so this can be regression-tested:
 * the codex cards were already rendering translated title/thinkers via
 * roomNoteTitleKey/roomNoteThinkersKey, but the *opened* note was passed the
 * raw English `note` object straight through — cards read translated, the
 * note itself fell back to English. Room 19 (last-message) is the one
 * exception: its note is a synthetic, already-translated object built from
 * the player's own sent sentence, so it passes through unchanged.
 */
export function translateFieldNoteForCodex(id: string, note: FieldNote, isEnding: boolean): FieldNote {
  if (id === 'last-message') return note;
  const bareId = isEnding ? id.replace(/^ending:/, '') : id;
  return isEnding
    ? {
        title: t(endingNoteTitleKey(bareId), note.title),
        thinkers: t(endingNoteThinkersKey(bareId), note.thinkers),
        body: t(endingNoteBodyKey(bareId), note.body),
      }
    : {
        title: t(roomNoteTitleKey(bareId), note.title),
        thinkers: t(roomNoteThinkersKey(bareId), note.thinkers),
        body: t(roomNoteBodyKey(bareId), note.body),
      };
}

export function showCodex(ui: HTMLElement, profile: Profile, pack: ContentPack): Promise<void> {
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
        const icon = isEnding ? pack.visuals.endingIcons[id.replace(/^ending:/, '')] : pack.visuals.iconFor(id);
        const translated = translateFieldNoteForCodex(id, note, isEnding);
        card.addEventListener('click', () => showFieldNote(ui, translated, isEnding ? endingLabel : fieldNoteLabel, icon));
      }
      grid.appendChild(card);
    };

    const actNameFor = (act: Room['act']) => t(actNameKey(act), pack.graph.actNamesEn[act]);

    for (const room of pack.rooms) {
      if (isHiddenFromCodex(room.id, profile, pack.graph.understorySequence)) continue;
      if (room.id === pack.hooks.lastMessageId) {
        // Room 19's codex entry is the sentence you sent
        const unlocked = profile.codexUnlocked.includes(room.id);
        const lastMessageTitle = t(roomTitleKey(room.id), room.title);
        addCard(
          room.id,
          actNameFor(room.act),
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
        actNameFor(room.act),
        t(roomNoteTitleKey(room.id), room.fieldNote?.title ?? room.title),
        t(roomNoteThinkersKey(room.id), room.fieldNote?.thinkers ?? ''),
        room.fieldNote,
      );
    }
    const endingLabelAct = t(uiKey('ending'), 'Ending');
    for (const ending of pack.endings) {
      // Hidden endings (e.g. ANAMNESIS's 7th) aren't shown locked like the
      // rest — they aren't shown at all until witnessed, per spec 03: no
      // visible lock, no hint via the codex that they exist.
      if (pack.endingRules.hiddenUntilWitnessed.includes(ending.id) && !profile.endingsSeen.includes(ending.id)) continue;
      addCard(
        `ending:${ending.id}`,
        endingLabelAct,
        t(endingTitleKey(ending.id), ending.title),
        t(endingEpitaphKey(ending.id), ending.epitaph),
        ending.fieldNote,
        true,
      );
    }

    const shelf = el('div', 'codex-shelf');
    shelf.append(el('div', 'shelf-title', t(uiKey('shelfTitle'), 'The Shelf')));
    const shelfItems = el('div', 'shelf-items');
    for (const def of pack.keepsakes) {
      const earned = profile.keepsakes.includes(def.id);
      const item = el('div', `shelf-item${earned ? '' : ' unearned'}`);
      if (earned) {
        const icon = el('span', 'shelf-icon');
        icon.innerHTML = pack.keepsakeIcons[def.id] ?? '';
        const name = t(keepsakeKey(def.id, 'name'), def.name);
        item.title = t(keepsakeKey(def.id, 'origin'), def.origin);
        item.append(icon, el('span', 'shelf-name', name));
      } else {
        item.append(el('span', 'shelf-icon shelf-placeholder', '·'));
      }
      shelfItems.appendChild(item);
    }
    shelf.append(shelfItems);

    const back = el('button', 'title-btn', t(uiKey('back'), 'Back'));
    back.style.marginTop = '30px';
    back.addEventListener('click', () => {
      o.remove();
      resolve();
    });
    panel.append(grid, shelf, back);
    o.appendChild(panel);
  });
}

/**
 * The Traveler's Ledger (spec 06): a single quiet screen of stats, plus
 * whichever epiphanies have been earned so far, in earn order. No locked
 * slots, no counts for unearned epiphanies — quiet means quiet.
 */
export function showLedger(
  ui: HTMLElement,
  profile: Profile,
  registry: RoomRegistry,
  understorySequence: readonly string[],
): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel');
    panel.append(el('h2', undefined, t(uiKey('ledger'), "Traveler's Ledger")));

    const stats = el('div', 'ledger-stats');
    for (const row of ledgerStats(profile, registry, understorySequence)) {
      const r = el('div', 'ledger-row');
      r.append(el('span', 'ledger-label', row.label), el('span', 'ledger-value', row.value));
      stats.appendChild(r);
    }
    panel.append(stats);

    const lines = epiphanyLines(profile);
    if (lines.length > 0) {
      panel.append(el('h2', 'ledger-epiphanies-title', t(uiKey('epiphaniesTitle'), 'Epiphanies')));
      const epiphanies = el('div', 'ledger-epiphanies');
      for (const line of lines) epiphanies.append(el('div', 'ledger-epiphany-line', line));
      panel.append(epiphanies);
    }

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

export type PauseAction = 'resume' | 'codex' | 'ledger' | 'settings' | 'persona' | 'about' | 'title' | 'exit';

export function showPauseMenu(ui: HTMLElement): Promise<PauseAction> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    o.append(el('h2', undefined, t(uiKey('paused'), 'Paused')));
    o.append(el('div', 'sub', t(uiKey('pausedSub'), 'the rooms will wait — time here is decorative')));
    const menu = el('div', 'title-menu');
    const mk = (label: string, action: PauseAction, small = false) => {
      const b = el('button', `title-btn${small ? ' small' : ''}`, label);
      b.addEventListener('click', () => {
        removeEventListener('keydown', onKey);
        o.remove();
        resolve(action);
      });
      menu.appendChild(b);
    };
    mk(t(uiKey('resume'), 'Resume'), 'resume');
    mk(t(uiKey('saveAndExit'), 'Save & exit to title'), 'title', true);
    mk(t(uiKey('fieldNotes'), 'Field Notes'), 'codex', true);
    mk(t(uiKey('ledger'), "Traveler's Ledger"), 'ledger', true);
    mk(t(uiKey('settings'), 'Settings'), 'settings', true);
    mk(t(uiKey('whoAreYou'), 'Who are you?'), 'persona', true);
    mk(t(uiKey('aboutTitle'), 'Before you begin'), 'about', true);
    if (isElectron()) mk(t(uiKey('exitGame'), 'Exit game'), 'exit', true);
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
  /** Epiphany ids newly earned by this run (spec 06), already translated at
   * render time below — empty/absent renders nothing extra. */
  newEpiphanies?: string[];
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

    if (data.newEpiphanies && data.newEpiphanies.length > 0) {
      const block = el('div', 'epiphany-block');
      block.append(el('h4', undefined, t(uiKey('epiphanyEarned'), 'filed tonight')));
      for (const id of data.newEpiphanies) block.append(el('div', 'epiphany-line', epiphanyLine(id)));
      inner.append(block);
    }

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
