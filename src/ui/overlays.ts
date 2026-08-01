import type { Persona, Profile, Settings } from '../engine/saveStore';
import type { Ending, FieldNote, Room } from '../engine/schema';
import type { ContentPack, EpiphanyDef } from '../packs/types';
import { earnedGuestStamps, epiphanyLine, epiphanyLines, isHiddenFromCodex, ledgerStats, resolveLastMessage } from '../engine/ledger';
import type { RoomRegistry } from '../engine/storyEngine';
import { el } from './dom';
import { installFocusTrap } from './focusTrap';
import { showFieldNote, renderEmphasis } from './fieldNote';
import { t } from '../engine/text/resolver';
import {
  uiKey,
  roomTitleKey,
  roomTeaserKey,
  roomNoteTitleKey,
  roomNoteThinkersKey,
  roomNoteBodyKey,
  roomArticleTitleKey,
  roomArticleBodyKey,
  endingTitleKey,
  endingEpitaphKey,
  endingNoteTitleKey,
  endingNoteThinkersKey,
  endingNoteBodyKey,
  keepsakeKey,
  actNameKey,
  stampKey,
  oneDoorButtonKey,
  understoryNameKey,
  personaAboutLabelKey,
  personaSubKey,
} from '../engine/text/keys';
import { LANGUAGE_LABELS } from './locale';
import { nextLang } from '../engine/text/resolver';
import type { TextVersion } from '../engine/text/resolver';
import { sound } from '../audio/soundEngine';
import { isElectron, isFullscreen, toggleFullscreen } from './fullscreen';
import { applyUiZoom } from './zoom';

export type TitleAction = 'new' | 'continue' | 'codex' | 'ledger' | 'register' | 'settings' | 'persona' | 'about' | 'credits' | 'vestibule' | 'oneDoor' | 'exit';

function overlay(ui: HTMLElement): HTMLElement {
  const o = el('div', 'overlay fade-in');
  ui.appendChild(o);
  installFocusTrap(o);
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
    // A persistent, glance-able age advisory — every visit to the title
    // screen, not just a first playthrough's auto-shown About panel — for
    // any pack whose subject matter carries one (self-declared; not an
    // official rating body's classification, since none has been sought).
    if (pack.advisory?.ageAdvisory) {
      o.append(el('div', 'title-age-advisory', t(uiKey('titleAgeAdvisory'), pack.advisory.ageAdvisory)));
    }
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
    const rg = el('button', 'title-btn small', t(uiKey('hotelRegister'), 'The Register'));
    rg.addEventListener('click', () => done('register'));
    // T9: a single random room dealt as a standalone vignette — no run
    // state carried, no ending. A low-commitment on-ramp and a way to meet
    // a room you haven't opened yet without starting a full journey.
    const od = el('button', 'title-btn small', t(oneDoorButtonKey(pack.meta.id), 'One Door'));
    od.addEventListener('click', () => done('oneDoor'));
    const pe = el(
      'button',
      'title-btn small',
      profile.persona.name
        ? `${t(uiKey('travelerLabel'), 'Traveler')}: ${profile.persona.name}`
        : t(uiKey('whoAreYou'), 'Who are you?'),
    );
    pe.addEventListener('click', () => done('persona'));
    const st = el('button', 'title-btn small', t(uiKey('settings'), 'Settings'));
    // Stable, translation- and position-independent hook for automated
    // tests: the title menu's button order/count has already grown twice
    // this session (Register, One Door) and will again, so selecting
    // Settings by a fixed index or by its (localized-after-first-switch)
    // text both silently break. See tests/uat/11-i18n-matrix.mjs.
    st.dataset.uat = 'settings-button';
    st.addEventListener('click', () => done('settings'));
    const ab = el('button', 'title-btn small', t(uiKey('aboutTitle'), 'Before you begin'));
    ab.addEventListener('click', () => done('about'));
    const cr = el('button', 'title-btn small', t(uiKey('creditsTitle'), 'Credits'));
    cr.addEventListener('click', () => done('credits'));
    menu.append(cx, lg, rg, od, pe, st, ab, cr);
    // F1: only shown in a built (rozcestník-served) deploy — the dev server
    // serves this pack directly at its root with no `../index.html` sibling
    // to navigate to.
    if (!import.meta.env.DEV) {
      const vb = el('button', 'title-btn small', t(uiKey('vestibuleButton'), 'The Vestibule — choose a game'));
      vb.addEventListener('click', () => done('vestibule'));
      menu.append(vb);
    }
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
  /** F2: whether the active pack's manifest has ANY narration files, in any
   * language — the Narration row only renders when true, so the feature
   * stays completely invisible until real recordings actually exist. */
  narrationAvailable: boolean;
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

/** A destructive action needs one extra click within a few seconds to fire — no separate confirm dialog needed.
 * `onConfirm` receives `disarm` (S4, game-experience review, 2026-07-20,
 * `16-full-review-2026-07-20.md` §8) — most call sites (reset run/progress)
 * reload or replace the button and never need it, but the Import button's
 * flow can fail without navigating away at all, and without this the button
 * stayed permanently armed ("click again to confirm") after one bad paste. */
function confirmButton(label: string, confirmLabel: string, onConfirm: (disarm: () => void) => void): HTMLButtonElement {
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
    onConfirm(disarm);
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
        | 'narrationEnabled'
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

    const fpsCapOrder: Settings['fpsCap'][] = [30, 60];
    const fpsCapLabel = (v: Settings['fpsCap']) =>
      v === 30 ? t(uiKey('fpsCap30'), 'Frame rate: 30fps (smoother on weaker graphics cards)') : t(uiKey('fpsCap60'), 'Frame rate: 60fps');
    const fpsCapBtn = el('button', 'toggle cycle', fpsCapLabel(current.fpsCap));
    fpsCapBtn.addEventListener('click', () => {
      const i = fpsCapOrder.indexOf(current.fpsCap);
      current.fpsCap = fpsCapOrder[(i + 1) % fpsCapOrder.length];
      fpsCapBtn.textContent = fpsCapLabel(current.fpsCap);
    });
    displayBody.append(
      settingRow(
        t(uiKey('settingFpsCap'), 'Frame rate cap'),
        t(uiKey('settingFpsCapDesc'), 'Lower uses noticeably less graphics power — this is a fog-and-text game, not an action one.'),
        fpsCapBtn,
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

    // F2: only rendered once the active pack's manifest actually has
    // narration files — invisible, not merely silent, until then.
    if (actions.narrationAvailable) {
      toggleRow(audioBody, 'narrationEnabled', t(uiKey('settingNarration'), 'Narration'), t(uiKey('settingNarrationDesc'), 'Spoken lines, where recorded.'));
      const narrationVolRow = el('div', 'setting-row slider-row');
      const narrationVolTop = el('div', 'setting-row-top');
      narrationVolTop.append(el('span', 'lbl', t(uiKey('settingNarrationVolume'), 'Narration volume')));
      const narrationSlider = el('input', 'volume-slider') as HTMLInputElement;
      narrationSlider.type = 'range';
      narrationSlider.min = '0';
      narrationSlider.max = '100';
      narrationSlider.step = '5';
      narrationSlider.value = String(Math.round(current.narrationVolume * 100));
      narrationSlider.addEventListener('input', () => {
        const v = Number(narrationSlider.value) / 100;
        current.narrationVolume = v;
        sound.setVoiceVolume(v);
      });
      narrationVolTop.append(narrationSlider);
      narrationVolRow.append(narrationVolTop);
      audioBody.append(narrationVolRow);
    }

    // ---------- Text & Language ----------
    const { section: textSection, body: textBody } = sectionEl(t(uiKey('settingsSectionText'), 'Text & Language'));
    const langBtn = el('button', 'toggle cycle', LANGUAGE_LABELS[current.language]);
    // Stable hook for automated tests: this section's toggle count/order has
    // already grown (fpsCap, voice version) and will again — position-based
    // selectors silently break. See tests/uat/11-i18n-matrix.mjs.
    langBtn.dataset.uat = 'language-toggle';
    langBtn.addEventListener('click', () => {
      current.language = nextLang(current.language);
      langBtn.textContent = LANGUAGE_LABELS[current.language];
    });
    // S5(a) (v2 overhaul plan, Phase 1.3): the old copy claimed "applies
    // immediately, everywhere" — true for the game itself (a live language
    // switch mid-run has worked since M5), but not for this Settings panel's
    // OWN labels, which are resolved once at panel-build time and don't
    // re-render while it stays open (`current.language` only mutates a
    // local draft; the active resolver locale doesn't change until Done/
    // Escape closes the panel and the caller applies it). A player toggling
    // the language row watched every other label in the very panel under
    // their cursor stay in the old language — a felt, if minor,
    // inconsistency with what the copy promised. Softened the wording to be
    // honest rather than re-rendering the whole panel live (a much larger
    // change for a one-line nit); the game-wide effect itself is unchanged.
    textBody.append(
      settingRow(
        t(uiKey('settingLanguage'), 'Language'),
        t(uiKey('settingLanguageDesc'), 'Applies immediately, everywhere in the game. This panel shows the new language the next time you open it.'),
        langBtn,
      ),
    );

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
      (disarm) => {
        const ok = actions.onImportProfile(importArea.value);
        importStatus.textContent = ok
          ? t(uiKey('importProfileSuccess'), 'Imported — reloading…')
          : t(uiKey('importProfileError'), 'That doesn’t look like a valid profile file — nothing was changed.');
        // A successful import reloads the page immediately (see
        // onImportProfile's caller) — disarm only matters on failure,
        // where the panel stays open and a stuck "click again to confirm"
        // button would otherwise require a fresh page load to reset.
        if (!ok) disarm();
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
    const close = () => {
      for (const off of fullscreenListeners) off();
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve(current);
    };
    // Deliberate: Escape saves (same as Done), not discards — settings are applied live.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    addEventListener('keydown', onEscape);
    back.addEventListener('click', close);
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
export function showPersona(ui: HTMLElement, persona: Persona, packId?: string, guideWord = 'Usher'): Promise<Persona> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel persona-panel');
    panel.append(el('h2', undefined, t(uiKey('personaTitle'), 'Who are you, tonight?')));
    panel.append(
      el(
        'div',
        'sub',
        t(
          personaSubKey(packId),
          `Purely for the ${guideWord}’s benefit — this changes nothing about the rooms, only how they speak to you.`,
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
      el('div', 'lbl', t(personaAboutLabelKey(packId), `About you (optional — shown to no one, felt by the ${guideWord})`)),
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
    // Deliberate: Skip clears all persona fields — the player chose anonymity.
    skip.addEventListener('click', () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve({ preset: '', name: '', blurb: '' });
    });
    const done = el('button', 'title-btn', t(uiKey('continue'), 'Continue'));
    done.addEventListener('click', () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve({
        preset: selectedId,
        name: nameInput.value.trim(),
        blurb: (freeText.value.trim() || selectedBlurb).trim(),
      });
    });
    menu.append(done, skip);

    // U-3 (extended review, 2026-08-01): every sibling overlay in this file
    // closes on Escape (Settings saves the current state; About/Credits/
    // Article/Codex/Ledger/Register all dismiss) — this was the one panel
    // with no Escape handling at all. Resolves with the persona UNCHANGED
    // (not Skip's clear-everything semantics) — Escape here means "leave as
    // it was," the same meaning Settings' own Escape-saves convention gives it.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        removeEventListener('keydown', onEscape);
        o.remove();
        resolve(persona);
      }
    };
    addEventListener('keydown', onEscape);

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
  const heartGlyph = `<span class="about-heart-glyph">${pack.skin.heartsSvg}</span>`;
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
    const close = () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve();
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    addEventListener('keydown', onEscape);
    back.addEventListener('click', close);
    panel.append(back);
    o.appendChild(panel);
  });
}

/**
 * The Credits panel — engine/tooling and font attributions, a pointer to
 * THIRD_PARTY_NOTICES.md for full license texts (three.js is MIT, the
 * bundled fonts are SIL OFL 1.1, both requiring their notices to travel
 * with any distributed copy of the game), and the standing no-telemetry
 * statement. Reachable from the title menu and the pause menu, same as
 * About.
 */
export function showCredits(ui: HTMLElement, pack: ContentPack): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel about-panel');
    panel.append(el('h2', undefined, t(uiKey('creditsTitle'), 'Credits')));
    // Pack title/version are per-build facts, not translatable prose — kept
    // out of the translated strings below (same convention as showTitle's
    // untranslated `.title-version` stamp) so a Czech/Farsi/German/French
    // translation of this panel doesn't need to embed a dynamic value.
    const version = typeof __APP_VERSION__ === 'string' && __APP_VERSION__ ? ` v${__APP_VERSION__}` : '';
    panel.append(el('div', 'title-version', `${pack.meta.title}${version} — The Vestibule`));
    const body = el('div', 'about-body');
    body.innerHTML = `
      <p>${t(uiKey('creditsIntro'), 'Written, designed, and built independently.')}</p>
      <p>${t(uiKey('creditsEngine'), '<b>Rendering & audio.</b> Every visual is generated geometry (Three.js) and every sound is generated at runtime — no purchased or downloaded art or audio assets.')}</p>
      <p>${t(uiKey('creditsTooling'), '<b>Built with.</b> Three.js (MIT License) · TypeScript · Vite · Electron (desktop build) · Vitest & Playwright (testing).')}</p>
      <p>${t(uiKey('creditsFonts'), '<b>Typefaces.</b> Inter, Spectral, and Vazirmatn, via Fontsource — each licensed under the SIL Open Font License 1.1.')}</p>
      <p>${t(uiKey('creditsNotices'), 'Full third-party license texts are in THIRD_PARTY_NOTICES.md, distributed alongside this build.')}</p>
      <p><i>${t(uiKey('creditsTelemetry'), 'Nothing about how you play is tracked, sent anywhere, or tied to an account — your save lives only in this browser or this installation.')}</i></p>
    `;
    panel.append(body);
    const back = el('button', 'title-btn', t(uiKey('back'), 'Back'));
    back.style.marginTop = '26px';
    const close = () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve();
    };
    // Game-experience review S2 (2026-07-20, `16-full-review-2026-07-20.md`
    // §8): every sibling overlay (showAbout, showRoomArticle) closes on
    // Escape; this one only closed on a Back click, inconsistent with the
    // pause menu's own Escape handling one level up.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    addEventListener('keydown', onEscape);
    back.addEventListener('click', close);
    panel.append(back);
    o.appendChild(panel);
  });
}

/**
 * The "Read more" long-form article for a room's field note (owner
 * request, 2026-07-15) — opened from a button inside `showFieldNote`
 * without dismissing it, so returning here lands the player back on the
 * field note they came from. Same `.codex-panel` scroll/Back pattern as
 * `showCredits`; `renderEmphasis` gives the body the same `**bold**`
 * markup field notes already use.
 */
export function showRoomArticle(ui: HTMLElement, roomTitle: string, thinkers: string, title: string, body: string): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    // Opened from a button inside an already-open field note (z-index 55,
    // deliberately above the base .overlay z-index 50 — see styles.css).
    // Without this, the article overlay painted *underneath* the still-open
    // field note: readable, but its Back button was unclickable because the
    // field note's own scroll area sat on top and intercepted the pointer
    // event. Found live via UAT 35.
    o.classList.add('above-field-note');
    const panel = el('div', 'codex-panel article-panel');
    panel.append(el('div', 'sub', `${t(uiKey('articleKicker'), 'Further reading')} — ${roomTitle}`));
    panel.append(el('h2', undefined, title));
    panel.append(el('div', 'fn-thinkers', thinkers));
    const bodyEl = el('div', 'about-body article-body');
    bodyEl.innerHTML = body
      .split('\n\n')
      .map((para) => `<p>${renderEmphasis(para)}</p>`)
      .join('');
    panel.append(bodyEl);
    const back = el('button', 'title-btn', t(uiKey('back'), 'Back'));
    back.style.marginTop = '26px';
    const close = () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve();
    };
    back.addEventListener('click', close);
    // Found in code review (2026-07-15) alongside the fieldNote.ts guard
    // this pairs with: this overlay previously had no Escape handling at
    // all (Back-click only), inconsistent with every sibling overlay
    // (showAbout, showCredits, ...) and relying entirely on the field
    // note's own listener underneath silently doing the wrong thing.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    addEventListener('keydown', onEscape);
    panel.append(back);
    o.appendChild(panel);
    back.focus();
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
 * note itself fell back to English. The pack's own `lastMessageId` hook room
 * (ANAMNESIS's `last-message`, LIMERENCE's `the-unsent`) is the one
 * exception: its note is a synthetic, already-translated object built from
 * the player's own sent sentence, so it passes through unchanged — pass the
 * active pack's `hooks.lastMessageId`, not a hardcoded id, or a second
 * pack's synthetic note gets silently overwritten by that room's ordinary
 * (also-registered) translated field note in any non-English locale.
 */
export function translateFieldNoteForCodex(id: string, note: FieldNote, isEnding: boolean, lastMessageId = 'last-message'): FieldNote {
  if (id === lastMessageId) return note;
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
      // Game-experience review S3 (2026-07-20, `16-full-review-2026-07-20.md`
      // §8): a locked card has no click handler below and nothing to open —
      // leaving it a focusable, enabled <button> meant a keyboard user
      // tabbed through 30+ inert stops to reach the real content.
      //
      // U-2 (extended review, 2026-08-01): S3's guard missed one case — the
      // last-message hook room can be *unlocked* (codexUnlocked includes it)
      // while `note` is still undefined (the player unlocked the room before
      // ever sending a message, or a legacy save predates lastMessageChoiceId)
      // — `!unlocked` alone left that card enabled with no click handler,
      // the same inert-button problem S3 fixed, just reachable a different way.
      if (!unlocked || !note) card.disabled = true;
      card.append(el('div', 'cx-act', actLabel));
      card.append(el('div', 'cx-title', unlocked ? title : '· · ·'));
      card.append(el('div', 'cx-thinkers', unlocked ? thinkers : notYetWalked));
      if (unlocked && note) {
        const icon = isEnding ? pack.visuals.endingIcons[id.replace(/^ending:/, '')] : pack.visuals.iconFor(id);
        const translated = translateFieldNoteForCodex(id, note, isEnding, pack.hooks.lastMessageId);
        const article = !isEnding ? pack.articles[id] : undefined;
        card.addEventListener('click', () =>
          showFieldNote(
            ui,
            translated,
            isEnding ? endingLabel : fieldNoteLabel,
            icon,
            article
              ? () =>
                  showRoomArticle(
                    ui,
                    translated.title,
                    translated.thinkers,
                    t(roomArticleTitleKey(id), article.title),
                    t(roomArticleBodyKey(id), article.body),
                  )
              : undefined,
          ),
        );
      }
      grid.appendChild(card);
    };

    const actNameFor = (act: Room['act']) => t(actNameKey(act, pack.meta.id), pack.graph.actNamesEn[act]);

    for (const room of pack.rooms) {
      if (isHiddenFromCodex(room.id, profile, pack.graph.understorySequence)) continue;
      if (room.id === pack.hooks.lastMessageId) {
        // Room 19's codex entry is the sentence you sent
        const unlocked = profile.codexUnlocked.includes(room.id);
        const lastMessageTitle = t(roomTitleKey(room.id), room.title);
        const resolvedLastMessage = resolveLastMessage(profile, pack.hooks.lastMessageId);
        addCard(
          room.id,
          actNameFor(room.act),
          lastMessageTitle,
          unlocked && resolvedLastMessage ? `“${resolvedLastMessage}”` : '',
          unlocked && resolvedLastMessage
            ? {
                title: lastMessageTitle,
                thinkers: t(uiKey('senderYou'), 'sender: you'),
                body: `${t(uiKey('lastMessageBody'), 'You had one sentence, and this was it:')} ${resolvedLastMessage}`,
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
    const close = () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve();
    };
    // Found in code review (2026-07-15): a codex card's onClick opens a
    // field note *on top of* this overlay (see addCard below). Without this
    // guard, Escape closed both layers at once — the field note's own
    // listener dismissed it, and this listener, unaware, closed the codex
    // underneath in the same keypress, losing the player's place.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('.field-note')) close();
    };
    addEventListener('keydown', onEscape);
    back.addEventListener('click', close);
    panel.append(grid, shelf, back);
    o.appendChild(panel);
  });
}

/**
 * T2 "The Hotel Register" — a facility map, not a knowledge archive (that's
 * the Codex). Draws every floor (Prologue, Act I-IV, and the Understory
 * once first descended) as a row of doors: visited doors are lit and show
 * their title; unvisited doors stay dark but still show their own teaser —
 * unlike the Codex, which deliberately withholds even that until the room
 * is walked. The point is spatial completion ("finish the place"), not
 * earned knowledge, so a taste of what's behind an unopened door is exactly
 * the hook it's meant to be.
 */
export function showHotelRegister(ui: HTMLElement, profile: Profile, pack: ContentPack): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel register-panel');
    panel.append(el('h2', undefined, t(uiKey('hotelRegister'), 'The Register')));
    panel.append(el('div', 'sub', t(uiKey('registerSub'), 'the shape of the place, whether you have walked it yet or not')));

    const visitedIds = new Set(profile.codexUnlocked);
    const floors: { label: string; rooms: Room[] }[] = [];
    const understoryIds = new Set(pack.graph.understorySequence);
    for (const act of [0, 1, 2, 3, 4] as const) {
      const rooms = pack.rooms.filter((r) => r.act === act && !understoryIds.has(r.id));
      if (rooms.length > 0) floors.push({ label: t(actNameKey(act, pack.meta.id), pack.graph.actNamesEn[act]), rooms });
    }
    // The Understory floor itself is only drawn once at least one of its
    // rooms has been walked — same non-spoiler rule as the Codex (spec 06
    // §5): the register shouldn't be the place a player first learns it exists.
    if (pack.graph.understorySequence.some((id) => visitedIds.has(id))) {
      const understoryRooms = pack.rooms.filter((r) => understoryIds.has(r.id));
      if (understoryRooms.length > 0) {
        floors.push({ label: t(understoryNameKey(pack.meta.id), pack.graph.understoryNameEn), rooms: understoryRooms });
      }
    }

    let totalVisible = 0;
    let totalVisited = 0;
    const floorsEl = el('div', 'register-floors');
    for (const floor of floors) {
      const visibleRooms = floor.rooms.filter((r) => !isHiddenFromCodex(r.id, profile, pack.graph.understorySequence));
      if (visibleRooms.length === 0) continue;
      const section = el('div', 'register-floor');
      const visitedHere = visibleRooms.filter((r) => visitedIds.has(r.id)).length;
      totalVisible += visibleRooms.length;
      totalVisited += visitedHere;
      section.append(el('h3', 'register-floor-title', `${floor.label} — ${visitedHere} ${t(uiKey('of'), 'of')} ${visibleRooms.length}`));
      const doors = el('div', 'register-doors');
      for (const room of visibleRooms) {
        const visited = visitedIds.has(room.id);
        const card = el('button', `register-door${visited ? ' visited' : ' unvisited'}`);
        // U-2 (extended review, 2026-08-01): mirrors the codex's own S3 fix
        // (2026-07-20) — a card with no click handler must not be left a
        // focusable, enabled <button>, or a keyboard user tabs through dead
        // stops to reach the real content. Two cases here: an unvisited
        // door (no note to show at all — set below) and a visited room
        // whose `fieldNote` is genuinely absent (the last-message hook
        // room, e.g. `the-unsent`, composes its note only in the Codex's
        // own synthetic-note path — the Register never did, so a visited
        // last-message card built here with no handler at all).
        if (visited) {
          const icon = el('span', 'register-door-icon');
          icon.innerHTML = pack.visuals.iconFor(room.id) ?? '';
          card.append(icon, el('span', 'register-door-title', t(roomTitleKey(room.id), room.title)));
          if (room.fieldNote) {
            const note = translateFieldNoteForCodex(room.id, room.fieldNote, false, pack.hooks.lastMessageId);
            const article = pack.articles[room.id];
            card.addEventListener('click', () =>
              showFieldNote(
                ui,
                note,
                t(uiKey('fieldNoteHeader'), 'Field Note'),
                pack.visuals.iconFor(room.id),
                article
                  ? () =>
                      showRoomArticle(
                        ui,
                        note.title,
                        note.thinkers,
                        t(roomArticleTitleKey(room.id), article.title),
                        t(roomArticleBodyKey(room.id), article.body),
                      )
                  : undefined,
              ),
            );
          } else {
            card.disabled = true;
          }
        } else {
          card.disabled = true;
          card.append(el('span', 'register-door-teaser', t(roomTeaserKey(room.id), room.teaser)));
        }
        doors.append(card);
      }
      section.append(doors);
      floorsEl.append(section);
    }
    panel.append(el('div', 'register-total', `${totalVisited} ${t(uiKey('of'), 'of')} ${totalVisible} ${t(uiKey('registerDoorsWalked'), 'doors walked')}`));
    panel.append(floorsEl);

    const back = el('button', 'title-btn', t(uiKey('back'), 'Back'));
    back.style.marginTop = '26px';
    const close = () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve();
    };
    // Same field-note-on-top guard as showCodex above — the Register's
    // room cards also open a field note on top of this overlay.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('.field-note')) close();
    };
    addEventListener('keydown', onEscape);
    back.addEventListener('click', close);
    panel.append(back);
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
  epiphanies: EpiphanyDef[],
  endingsTotalFn?: (endingsSeen: string[]) => number,
  keepsakeTotal?: number,
  lastMessageLabel?: string,
  /** S1: the active pack's own `hooks.lastMessageId`, threaded down to
   * `ledgerStats` so the "last message" row resolves through the
   * translation path for the right hook room. */
  lastMessageId?: string,
): Promise<void> {
  return new Promise((resolve) => {
    const o = overlay(ui);
    const panel = el('div', 'codex-panel');
    panel.append(el('h2', undefined, t(uiKey('ledger'), "Traveler's Ledger")));

    const stats = el('div', 'ledger-stats');
    for (const row of ledgerStats(profile, registry, understorySequence, endingsTotalFn, keepsakeTotal, lastMessageLabel, lastMessageId)) {
      const r = el('div', 'ledger-row');
      r.append(el('span', 'ledger-label', row.label), el('span', 'ledger-value', row.value));
      stats.appendChild(r);
    }
    panel.append(stats);

    const lines = epiphanyLines(profile, epiphanies);
    if (lines.length > 0) {
      panel.append(el('h2', 'ledger-epiphanies-title', t(uiKey('epiphaniesTitle'), 'Epiphanies')));
      const epiphanies = el('div', 'ledger-epiphanies');
      for (const line of lines) epiphanies.append(el('div', 'ledger-epiphany-line', line));
      panel.append(epiphanies);
    }

    // T8: guest stamps — diegetic, spoiler-free milestones, purely a read of
    // counters already tracked. No locked slots (mirrors the epiphanies
    // block above): an unearned stamp simply isn't shown yet.
    const stamps = earnedGuestStamps(profile, registry, understorySequence);
    if (stamps.length > 0) {
      panel.append(el('h2', 'ledger-epiphanies-title', t(uiKey('guestStampsTitle'), 'Guest stamps')));
      const stampsEl = el('div', 'ledger-stamps');
      for (const stamp of stamps) stampsEl.append(el('div', 'guest-stamp', t(stampKey(stamp.id), stamp.fallback)));
      panel.append(stampsEl);
    }

    const back = el('button', 'title-btn', t(uiKey('back'), 'Back'));
    back.style.marginTop = '26px';
    const close = () => {
      removeEventListener('keydown', onEscape);
      o.remove();
      resolve();
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    addEventListener('keydown', onEscape);
    back.addEventListener('click', close);
    panel.append(back);
    o.appendChild(panel);
  });
}

export type PauseAction = 'resume' | 'codex' | 'ledger' | 'register' | 'settings' | 'persona' | 'about' | 'credits' | 'title' | 'vestibule' | 'exit';

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
    mk(t(uiKey('hotelRegister'), 'The Register'), 'register', true);
    mk(t(uiKey('settings'), 'Settings'), 'settings', true);
    mk(t(uiKey('whoAreYou'), 'Who are you?'), 'persona', true);
    mk(t(uiKey('aboutTitle'), 'Before you begin'), 'about', true);
    mk(t(uiKey('creditsTitle'), 'Credits'), 'credits', true);
    if (!import.meta.env.DEV) mk(t(uiKey('vestibuleButton'), 'The Vestibule — choose a game'), 'vestibule', true);
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
  /** The active pack's own epiphany defs, needed to resolve `newEpiphanies`
   * ids to fallback text — required whenever `newEpiphanies` is non-empty. */
  epiphanies?: EpiphanyDef[];
  /** T4 "Morning Report": this run's pivotal choices (the ones that moved
   * an axis or cost/spared a heart), already translated and in the order
   * taken — empty renders nothing extra. */
  pivotalChoices?: string[];
  /** T4: a few named doors this run never opened, as their one-line
   * teasers — already translated. Empty renders nothing extra. */
  doorsNeverOpened?: string[];
  /** Game-experience review E5 (2026-07-19): the keepsakes this run was
   * carried into with (`RunState.keepsakesHeld` at run start), already
   * resolved to their translated display names — the only place a player
   * is ever told what they walked in holding. Empty renders nothing extra. */
  keepsakesCarried?: string[];
}

export function showEndScreen(ui: HTMLElement, data: EndScreenData): Promise<'again' | 'codex' | 'title' | 'settings' | 'vestibule'> {
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
    const statSpan = (label: string, value: number) => {
      const span = el('span');
      span.append(`${label} `, el('b', undefined, String(value)));
      return span;
    };
    stats.append(
      statSpan(t(uiKey('statLucidity'), 'lucidity'), data.lucidity),
      statSpan(t(uiKey('statHearts'), 'hearts kept'), data.hearts),
      statSpan(t(uiKey('statNewNotes'), 'new field notes'), data.newNotes),
    );
    inner.append(stats);

    if (data.newEpiphanies && data.newEpiphanies.length > 0) {
      const block = el('div', 'epiphany-block');
      block.append(el('h4', undefined, t(uiKey('epiphanyEarned'), 'filed tonight')));
      for (const id of data.newEpiphanies) block.append(el('div', 'epiphany-line', epiphanyLine(id, data.epiphanies ?? [])));
      inner.append(block);
    }

    // T4 "Morning Report": the run's pivotal choices, quoted back.
    if (data.pivotalChoices && data.pivotalChoices.length > 0) {
      const block = el('div', 'morning-report-block');
      block.append(el('h4', undefined, t(uiKey('pivotalChoicesHeader'), 'what you chose')));
      for (const line of data.pivotalChoices) block.append(el('div', 'morning-report-line', `“${line}”`));
      inner.append(block);
    }

    // T4: a few named doors this run never opened.
    if (data.doorsNeverOpened && data.doorsNeverOpened.length > 0) {
      const block = el('div', 'morning-report-block');
      block.append(el('h4', undefined, t(uiKey('doorsNeverOpenedHeader'), 'doors you never opened')));
      for (const line of data.doorsNeverOpened) block.append(el('div', 'morning-report-line', line));
      inner.append(block);
    }

    // Game-experience review E5 (2026-07-19): keepsakes were earned and
    // carried silently by design — quiet is right, but "invisible" was not
    // the same thing. This is the one place a player learns what they
    // walked in holding.
    if (data.keepsakesCarried && data.keepsakesCarried.length > 0) {
      const block = el('div', 'morning-report-block');
      block.append(el('h4', undefined, t(uiKey('keepsakesCarriedHeader'), 'you carried')));
      for (const line of data.keepsakesCarried) block.append(el('div', 'morning-report-line', line));
      inner.append(block);
    }

    const menu = el('div', 'title-menu');
    const mk = (label: string, action: 'again' | 'codex' | 'title' | 'settings' | 'vestibule', small = false) => {
      const b = el('button', `title-btn${small ? ' small' : ''}`, label);
      b.addEventListener('click', () => {
        o.remove();
        resolve(action);
      });
      menu.appendChild(b);
    };
    mk(t(uiKey('walkAgain'), 'Walk again — the rooms rearrange for no one, but you have changed'), 'again');
    mk(t(uiKey('fieldNotes'), 'Field Notes'), 'codex', true);
    // Game-experience review E4 (2026-07-19): Settings and Vestibule were
    // both natural post-run desires (adjust display before the next run;
    // switch games) that the end screen used to bounce through Title for.
    mk(t(uiKey('settings'), 'Settings'), 'settings', true);
    if (!import.meta.env.DEV) mk(t(uiKey('vestibuleButton'), 'The Vestibule — choose a game'), 'vestibule', true);
    mk(t(uiKey('title'), 'Title'), 'title', true);
    inner.append(menu);
    o.appendChild(inner);
  });
}

export function clearOverlays(ui: HTMLElement) {
  for (const node of [...ui.querySelectorAll('.overlay')]) node.remove();
}
