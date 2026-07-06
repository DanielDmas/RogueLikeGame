import type { Choice, Room, RunState } from '../content/schema';
import { allRooms } from '../content/rooms';
import { getEnding } from '../content/endings';
import { actName } from '../content/graph';
import { actIntroText, usherDoorBark } from '../content/usher';
import { applyEffects, newRun } from './gameState';
import { axisTriptych, evaluateEnding } from './endings';
import { completeRoom, makeRegistry, offeredDoors } from './storyEngine';
import { defaultProfile, type Profile, type SaveStore } from './saveStore';
import { SceneDirector } from '../scene/director';
import { Hud } from '../ui/hud';
import { TextPanel } from '../ui/textPanel';
import { ChoicePanel } from '../ui/choices';
import { showFieldNote } from '../ui/fieldNote';
import { showSavedToast } from '../ui/toast';
import {
  showAbout,
  showCodex,
  showEndScreen,
  showPauseMenu,
  showPersona,
  showSettings,
  showTitle,
  type SettingsActions,
} from '../ui/overlays';
import { el } from '../ui/dom';
import { sound } from '../audio/soundEngine';
import { endingIcons, iconFor } from '../content/icons';
import { setLocale, t } from '../content/text';
import {
  roomTitleKey,
  roomDoorHintKey,
  roomTeaserKey,
  roomBeatKey,
  roomChoiceOutcomeKey,
  roomNoteTitleKey,
  roomNoteThinkersKey,
  roomNoteBodyKey,
  endingTitleKey,
  endingEpitaphKey,
  endingBeatKey,
  endingNoteTitleKey,
  endingNoteThinkersKey,
  endingNoteBodyKey,
  uiKey,
  usherBarkKey,
} from '../content/text/keys';
import { applyLocaleToDocument } from '../ui/locale';
import { toggleFullscreen } from '../ui/fullscreen';
import { applyUiZoom } from '../ui/zoom';
import { installUatHandle, isJumpableRoom, speedMultiplierFor, type UatHandle } from './uatMode';

const PROFILE_ID = 'traveler';
const registry = makeRegistry(allRooms);
/** sessionStorage marker: set by jump() right before a reload, so start() knows to
 * skip the title screen and resume `profile.run` directly instead of waiting for a click. */
const UAT_AUTOCONTINUE_KEY = 'anamnesis-uat-autocontinue';

const themeForAct = (act: number): 0 | 1 | 2 | 3 | 4 => (act <= 1 ? (act as 0 | 1) : (act as 2 | 3 | 4));

export class Game {
  private ui: HTMLElement;
  private veil: HTMLElement;
  private stageBottom: HTMLElement;
  private director: SceneDirector;
  private hud: Hud;
  private text: TextPanel;
  private choices: ChoicePanel;
  private state: RunState = newRun();
  private profile: Profile;
  private store: SaveStore;
  private currentTheme = -1;
  private doorClickThrough: ((id: string) => void) | null = null;
  private inGame = false;
  private runStartNotes = 0;
  private uat: boolean;
  private speedMultiplier: number;

  constructor(canvas: HTMLCanvasElement, ui: HTMLElement, profile: Profile, store: SaveStore, uat = false) {
    this.ui = ui;
    this.profile = profile;
    this.store = store;
    this.uat = uat;
    this.speedMultiplier = speedMultiplierFor(uat);

    this.veil = el('div', 'veil');
    ui.appendChild(this.veil);

    const stageBottom = el('div', 'stage-bottom');
    ui.appendChild(stageBottom);
    this.stageBottom = stageBottom;

    this.director = new SceneDirector(
      canvas,
      ui,
      {
        onDoorHover: (id) => {
          if (id) sound.hover();
        },
        onDoorClick: (id) => this.doorClickThrough?.(id),
      },
      profile.settings.quality,
      profile.settings.renderScale,
    );
    this.director.setSpeedMultiplier(this.speedMultiplier);
    this.hud = new Hud(ui, () => this.openPause(), profile.settings.language, (lang) => {
      this.profile.settings = { ...this.profile.settings, language: lang };
      this.applySettings();
      void this.persist();
    });
    this.text = new TextPanel(stageBottom);
    this.choices = new ChoicePanel(stageBottom);

    addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape' && this.inGame && !this.ui.querySelector('.overlay, .field-note')) {
        this.openPause();
      }
      if (e.key === 'f' || e.key === 'F') void toggleFullscreen();
    });
    addEventListener('pointerdown', () => sound.primeOnGesture(), { once: true });

    this.applySettings();

    installUatHandle(window as unknown as { __anamnesisUat?: UatHandle }, this.uat, {
      version: typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '',
      doorRects: () => this.director.getDoorRects(),
      state: () => ({
        act: this.state.act,
        hearts: this.state.hearts,
        lucidity: this.state.lucidity,
        currentRoom: this.state.currentRoom,
        currentStage: this.state.currentStage ?? 0,
      }),
      fps: () => this.director.getFps(),
      jump: (roomId) => this.jump(roomId),
    });
  }

  /** UAT-only: jump straight to a room by id, bypassing normal play, without
   * synthesizing an illegal state — it builds an ordinary RunState (same
   * shape a resumed run has) and lets the normal state → persist → runLoop
   * path pick it up after a reload. Refuses unknown rooms with a console
   * warning rather than throwing. */
  private jump(roomId: string): void {
    if (!this.uat) return;
    if (!isJumpableRoom(roomId, registry)) {
      console.warn(`[anamnesis:uat] jump("${roomId}") refused — unknown room id.`);
      return;
    }
    const room = registry.get(roomId);
    const base = this.inGame && !this.state.finished ? this.state : newRun(undefined, this.priorFromProfile());
    const next: RunState = { ...base, act: room.act, currentRoom: roomId, currentStage: 0, finished: false, endingId: null };
    this.profile.run = next;
    void this.store.save(PROFILE_ID, this.profile).then(() => {
      sessionStorage.setItem(UAT_AUTOCONTINUE_KEY, '1');
      location.reload();
    });
  }

  /** Stamped once at the start of each fresh run — the read-only previous-run
   * snapshot consumed by `RunState.prior` (e.g. `the-cave`'s unlock condition
   * and shadow-play). Absent fields degrade to "no previous run to recall". */
  private priorFromProfile(): RunState['prior'] {
    return {
      runs: this.profile.runsCompleted,
      endingId: this.profile.lastRunEndingId ?? null,
      transcript: this.profile.lastRunTranscript ?? [],
    };
  }

  private applySettings() {
    const s = this.profile.settings;
    document.body.classList.toggle('reduced-motion', s.reducedMotion);
    document.body.classList.toggle('high-contrast', s.highContrast);
    this.text.setTypewriter(this.effectiveTypewriter());
    this.director.setReducedMotion(s.reducedMotion);
    this.director.setDynamicScenery(s.dynamicScenery);
    this.director.setRenderScale(s.renderScale);
    applyUiZoom(s.uiZoom);
    sound.setMusicEnabled(s.music);
    sound.setSfxEnabled(s.sfx);
    sound.setMusicVolume(s.musicVolume);
    sound.setSfxVolume(s.sfxVolume);
    setLocale(s.language, s.textVersion);
    applyLocaleToDocument(s.language);
    this.hud.setLanguage(s.language);
  }

  /** `{name}` (and future tokens) available for interpolation into any displayed text. */
  private tokens(): Record<string, string> {
    const name = this.profile.persona.name.trim();
    return { name: name || t(uiKey('travellerFallback'), 'traveller') };
  }

  /** Typewriter forced off under `?uat=1`, regardless of the stored setting (which still displays as-is in Settings). */
  private effectiveTypewriter(): boolean {
    if (this.uat) return false;
    const s = this.profile.settings;
    return s.typewriter && !s.reducedMotion;
  }

  private async persist(showToast = false) {
    this.profile.run = this.state.finished ? null : this.state;
    await this.store.save(PROFILE_ID, this.profile);
    // Shown only at natural checkpoints (door chosen, room completed, settings
    // saved) — never on the silent per-stage safety-net persist, or it would nag.
    if (showToast) {
      showSavedToast(this.ui, t(uiKey('savedToast'), 'Progress saved'), this.profile.settings.reducedMotion, this.speedMultiplier);
    }
  }

  private fade(on: boolean): Promise<void> {
    this.veil.classList.toggle('on', on);
    const ms = (this.profile.settings.reducedMotion ? 280 : 720) * this.speedMultiplier;
    return new Promise((r) => setTimeout(r, ms));
  }

  /** Abandons the in-progress run only — field notes, endings, settings, and persona survive.
   * Reloads afterward: simplest and safest way to guarantee the game and its
   * on-screen UI (whatever was showing when the run was reset) never disagree. */
  private async resetRun() {
    this.profile.run = null;
    await this.store.save(PROFILE_ID, this.profile);
    location.reload();
  }

  /** Wipes the whole profile back to defaults and starts over from a clean title screen. */
  private async resetProgress() {
    await this.store.save(PROFILE_ID, defaultProfile());
    location.reload();
  }

  private settingsActions(): SettingsActions {
    return {
      hasRun: this.inGame || Boolean(this.profile.run && !this.profile.run.finished),
      onResetRun: () => void this.resetRun(),
      onResetProgress: () => void this.resetProgress(),
    };
  }

  private async openPause() {
    this.director.setPaused(true);
    // The room's text/choice panel stays mounted (and its promise pending)
    // under the pause menu — visually hide it so it can't bleed through the
    // overlay's translucent background, without detaching it and stranding
    // that promise.
    this.stageBottom.classList.add('overlay-hidden');
    const action = await showPauseMenu(this.ui);
    if (action === 'codex') await showCodex(this.ui, this.profile);
    if (action === 'persona') {
      this.profile.persona = await showPersona(this.ui, this.profile.persona);
      await this.persist();
    }
    if (action === 'about') await showAbout(this.ui);
    if (action === 'settings') {
      this.profile.settings = await showSettings(this.ui, this.profile.settings, this.settingsActions());
      this.applySettings();
      await this.persist(true);
    }
    if (action === 'title') {
      await this.persist();
      location.reload();
      return;
    }
    if (action === 'exit') {
      await this.persist();
      window.close();
      return;
    }
    this.stageBottom.classList.remove('overlay-hidden');
    this.director.setPaused(false);
  }

  /** Entry point: title screen loop, then the run. */
  async start() {
    // jump() left a marker + a fully-formed run before reloading — resume it
    // directly instead of making a scripted test click through the title.
    if (this.uat && sessionStorage.getItem(UAT_AUTOCONTINUE_KEY) && this.profile.run) {
      sessionStorage.removeItem(UAT_AUTOCONTINUE_KEY);
      this.director.setTheme(0);
      this.state = this.profile.run;
      this.director.setPaused(false);
      this.inGame = true;
      this.runStartNotes = this.profile.codexUnlocked.length;
      this.hud.show();
      return this.runLoop();
    }
    this.director.setTheme(0);
    sound.setAct(0);
    this.director.setPaused(true);
    for (;;) {
      const action = await showTitle(this.ui, this.profile);
      if (action === 'codex') {
        await showCodex(this.ui, this.profile);
      } else if (action === 'persona') {
        this.profile.persona = await showPersona(this.ui, this.profile.persona);
        await this.persist();
      } else if (action === 'about') {
        await showAbout(this.ui);
      } else if (action === 'settings') {
        this.profile.settings = await showSettings(this.ui, this.profile.settings, this.settingsActions());
        this.applySettings();
        await this.persist();
      } else if (action === 'exit') {
        window.close();
      } else {
        if (action === 'new' && !this.profile.persona.name) {
          this.profile.persona = await showPersona(this.ui, this.profile.persona);
          await this.persist();
        }
        this.state = action === 'continue' && this.profile.run ? this.profile.run : newRun(undefined, this.priorFromProfile());
        break;
      }
    }
    this.director.setPaused(false);
    this.inGame = true;
    this.runStartNotes = this.profile.codexUnlocked.length;
    this.hud.show();
    await this.runLoop();
  }

  private async syncTheme() {
    const theme = themeForAct(this.state.act);
    if (theme !== this.currentTheme) {
      await this.fade(true);
      this.director.setTheme(theme);
      this.currentTheme = theme;
      sound.setAct(theme);
      await this.fade(false);
      const intro = actIntroText(this.state.act);
      if (intro && this.state.act > 0) {
        await this.text.playBeats([intro], this.state, { title: actName(this.state.act) }, { tokens: this.tokens() });
        this.text.hide();
      }
    }
  }

  private async runLoop(): Promise<void> {
    for (;;) {
      if (this.state.hearts <= 0) return this.playEnding('dissolved');

      // resume a run that was saved mid-room
      const pending = this.state.currentRoom;
      if (pending) {
        await this.syncTheme();
        this.hud.setAct(actName(this.state.act));
        this.hud.update(this.state.hearts, this.state.lucidity);
        await this.enterRoom(registry.get(pending));
        continue;
      }

      const doors = offeredDoors(this.state, registry);
      if (doors.length === 0) return this.playEnding(evaluateEnding(this.state));

      await this.syncTheme();
      this.hud.setAct(actName(this.state.act));
      this.hud.update(this.state.hearts, this.state.lucidity);

      const specs = doors.map((r) => ({
        id: r.id,
        hint: t(roomDoorHintKey(r.id), r.doorHint),
        teaser: t(roomTeaserKey(r.id), r.teaser),
        secret: Boolean(r.secret),
        icon: iconFor(r.id),
        unseen: !this.profile.codexUnlocked.includes(r.id),
      }));
      this.director.setMood(null);
      this.director.showDoors(specs);
      this.text.showBark(usherDoorBark(this.state, this.profile.runsCompleted, doors.length), this.tokens());
      const picker = this.choices.pickDoor(specs, (id) => {
        this.director.highlightDoor(id);
        if (id) sound.hover();
      });
      this.doorClickThrough = picker.chooseExternally;
      const roomId = await picker.promise;
      this.doorClickThrough = null;
      sound.choice();
      this.text.hide();

      await this.director.walkThrough(roomId);
      await this.fade(true);
      this.director.hideDoors();
      await this.fade(false);

      this.state = { ...this.state, currentRoom: roomId, currentStage: 0 };
      await this.persist(true);
      await this.enterRoom(registry.get(roomId));
    }
  }

  private async enterRoom(room: Room): Promise<void> {
    const icon = iconFor(room.id);
    const title = t(roomTitleKey(room.id), room.title);
    const tokens = this.tokens();
    this.director.setMood(room.type);
    // A room already witnessed in an earlier run reads back fast on repeat —
    // no typewriter, and the panel carries a quiet "remembered" mark — so
    // replays stay brisk instead of re-reading beats the player already knows.
    const remembered = this.profile.codexUnlocked.includes(room.id);
    if (remembered) {
      this.text.setTypewriter(false);
      this.text.setRemembered(true);
    }
    // Resume mid-room at the saved stage rather than replaying from the top —
    // otherwise quitting mid-room would re-run already-applied effects and
    // duplicate the transcript on the next load. Saves from before this
    // field existed have no currentStage; treat that as stage 0.
    const startStage = this.state.currentStage ?? 0;
    if (remembered && startStage === 0) {
      await this.text.playBeats(
        [t(usherBarkKey('remembered-room'), 'You remember this room.')],
        this.state,
        { title, type: room.type, icon },
        { tokens },
      );
    }
    for (let i = startStage; i < room.stages.length; i++) {
      const stage = room.stages[i];
      await this.text.playBeats(stage.beats, this.state, { title, type: room.type, icon }, {
        keyOf: (bi) => roomBeatKey(room.id, i, bi),
        tokens,
      });
      const available = stage.choices.filter((c) => !c.available || c.available(this.state));
      const choice: Choice = await this.choices.pick(available, this.state, room.id);
      sound.choice();
      const heartsBefore = this.state.hearts;
      this.state = applyEffects(this.state, choice.effects);
      const firstHeartLoss = this.state.hearts < heartsBefore && !this.profile.hasSeenHeartLoss;
      if (this.state.hearts < heartsBefore) sound.heartLoss();
      this.state.transcript.push({
        roomId: room.id,
        stageIndex: i,
        choiceId: choice.id,
        choiceText: choice.text,
      });
      this.hud.update(this.state.hearts, this.state.lucidity);
      if (room.id === 'last-message') {
        this.profile.lastMessage = choice.text.replace(/^“|”$/g, '');
      }
      // Shown once per profile, ever — a brief, calm explanation of what just
      // happened, so the first heart loss reads as a mechanic, not a shock.
      if (firstHeartLoss) {
        this.profile.hasSeenHeartLoss = true;
        await this.persist();
        await this.text.playBeats(
          [t(usherBarkKey('first-heart-loss'), 'Usher: There — a heart, spent. Feel that. It is the facility keeping an honest ledger, nothing more. You have {hearts} left. Not a countdown to failure; simply what that choice cost.')],
          this.state,
          { title, type: room.type, icon },
          { tokens: { ...tokens, hearts: String(this.state.hearts) } },
        );
        this.text.hide();
      }
      // Persist right after the choice's effects land (not after its outcome
      // beats finish) — a quit-and-resume from here re-enters at the next
      // stage instead of re-applying this choice's effects a second time.
      this.state = { ...this.state, currentStage: i + 1 };
      await this.persist();
      await this.text.playBeats(choice.outcome, this.state, { title, type: room.type, icon }, {
        keyOf: (bi) => roomChoiceOutcomeKey(room.id, choice.id, bi),
        tokens,
      });
      if (this.state.hearts <= 0) break;
    }
    this.text.hide();
    if (remembered) {
      this.text.setRemembered(false);
      this.text.setTypewriter(this.effectiveTypewriter());
    }

    if (room.fieldNote) {
      await showFieldNote(
        this.ui,
        {
          title: t(roomNoteTitleKey(room.id), room.fieldNote.title),
          thinkers: t(roomNoteThinkersKey(room.id), room.fieldNote.thinkers),
          body: t(roomNoteBodyKey(room.id), room.fieldNote.body),
        },
        `${t(uiKey('fieldNoteHeader'), 'Field Note')} · ${room.type}`,
        icon,
      );
    }
    if (!this.profile.codexUnlocked.includes(room.id)) {
      this.profile.codexUnlocked.push(room.id);
    }
    this.state = completeRoom(this.state, room.id, registry);
    await this.persist(true);
  }

  private async playEnding(endingId: string): Promise<void> {
    const raw = getEnding(endingId);
    const tokens = this.tokens();
    const ending = {
      ...raw,
      title: t(endingTitleKey(endingId), raw.title),
      epitaph: t(endingEpitaphKey(endingId), raw.epitaph),
    };
    this.director.hideDoors();
    this.choices.clear();
    this.text.hide();
    await this.fade(true);
    this.director.setTheme(5);
    this.currentTheme = 5;
    sound.setAct(5);
    this.hud.hide();
    await this.fade(false);
    sound.ending();

    await this.text.playBeats(
      raw.beats,
      this.state,
      { title: ending.title, type: 'ENDING', icon: endingIcons[endingId] },
      { keyOf: (bi) => endingBeatKey(endingId, bi), tokens },
    );
    this.text.hide();
    if (raw.fieldNote) {
      await showFieldNote(
        this.ui,
        {
          title: t(endingNoteTitleKey(endingId), raw.fieldNote.title),
          thinkers: t(endingNoteThinkersKey(endingId), raw.fieldNote.thinkers),
          body: t(endingNoteBodyKey(endingId), raw.fieldNote.body),
        },
        `${t(uiKey('endingFieldNoteHeader'), 'Ending · Field Note')}`,
        endingIcons[endingId],
      );
    }

    // persist meta-progression
    this.state.finished = true;
    this.state.endingId = endingId;
    const endingCodexKey = `ending:${endingId}`;
    if (!this.profile.codexUnlocked.includes(endingCodexKey)) this.profile.codexUnlocked.push(endingCodexKey);
    if (!this.profile.endingsSeen.includes(endingId)) this.profile.endingsSeen.push(endingId);
    this.profile.lastRunTranscript = this.state.transcript;
    this.profile.lastRunEndingId = endingId;
    this.profile.runsCompleted += 1;
    await this.persist();

    const recap = this.state.visited
      .map((id) => registry.get(id))
      .map((room) => ({
        title: t(roomTitleKey(room.id), room.title),
        thesis:
          room.id === 'last-message' && this.profile.lastMessage
            ? `“${this.profile.lastMessage}”`
            : t(roomNoteTitleKey(room.id), room.fieldNote?.title ?? ''),
      }));

    for (;;) {
      const action = await showEndScreen(this.ui, {
        ending,
        triptych: axisTriptych(this.state),
        recap,
        lucidity: this.state.lucidity,
        hearts: Math.max(0, this.state.hearts),
        newNotes: this.profile.codexUnlocked.length - this.runStartNotes,
      });
      if (action === 'codex') {
        await showCodex(this.ui, this.profile);
        continue;
      }
      if (action === 'again') {
        this.state = newRun(undefined, this.priorFromProfile());
        await this.persist();
        this.currentTheme = -1;
        this.runStartNotes = this.profile.codexUnlocked.length;
        this.hud.show();
        return this.runLoop();
      }
      location.reload();
      return;
    }
  }
}
