import type { Choice, Room, RunState } from './schema';
import type { ContentPack } from '../packs/types';
import { keepsakesEarnedByFlags } from '../content/keepsakes';
import { applyEffects, newRun } from './gameState';
import { shouldShowReflections, shouldShowSocraticAside } from './reflections';
import { evaluateEpiphanies, isHiddenFromCodex } from './ledger';
import { backfillVisitedForJump, completeRoom, isResumableRun, makeRegistry, offeredDoors, type RoomRegistry } from './storyEngine';
import { oneDoorPool, pickOneDoorRoom } from './oneDoor';
import { defaultProfile, hydrateProfile, type Profile, type SaveStore } from './saveStore';
import { SceneDirector } from '../scene/director';
import type { DoorSpec } from '../scene/doors';
import { spillColorFor } from '../scene/themes';
import { Hud } from '../ui/hud';
import { TextPanel } from '../ui/textPanel';
import { ChoicePanel } from '../ui/choices';
import { ReflectionPanel } from '../ui/reflection';
import { showFieldNote } from '../ui/fieldNote';
import { showSavedToast, showSaveFailedToast } from '../ui/toast';
import {
  showAbout,
  showCredits,
  showCodex,
  showEndScreen,
  showExaminedPathOffer,
  showHotelRegister,
  showLedger,
  showPauseMenu,
  showPersona,
  showRoomArticle,
  showSettings,
  showTitle,
  type SettingsActions,
} from '../ui/overlays';
import { el } from '../ui/dom';
import { sound } from '../audio/soundEngine';
import { voiceover } from '../audio/voiceover';
import { setLocale, t } from './text/resolver';
import {
  roomTitleKey,
  roomDoorHintKey,
  roomTeaserKey,
  roomBeatKey,
  roomExplanationKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomNoteTitleKey,
  roomNoteThinkersKey,
  roomNoteBodyKey,
  roomArticleTitleKey,
  roomArticleBodyKey,
  endingTitleKey,
  endingEpitaphKey,
  endingBeatKey,
  endingNoteTitleKey,
  endingNoteThinkersKey,
  endingNoteBodyKey,
  uiKey,
  usherBarkKey,
  actNameKey,
  ledgerLastMessageKey,
} from './text/keys';
import { applyLocaleToDocument } from '../ui/locale';
import { isFullscreen, rememberFullscreenForReload, shouldOpenPauseOnEscape, toggleFullscreen } from '../ui/fullscreen';
import { writeSharedDisplaySettings } from './sharedDisplaySettings';
import { applyUiZoom } from '../ui/zoom';
import { installUatHandle, isJumpableRoom, speedMultiplierFor, type UatHandle } from './uatMode';

const PROFILE_ID = 'traveler';

const themeForAct = (act: number): 0 | 1 | 2 | 3 | 4 => (act <= 1 ? (act as 0 | 1) : (act as 2 | 3 | 4));

export class Game {
  private ui: HTMLElement;
  private veil: HTMLElement;
  private stageBottom: HTMLElement;
  private director: SceneDirector;
  private hud: Hud;
  private text: TextPanel;
  private choices: ChoicePanel;
  private reflection: ReflectionPanel;
  private state: RunState = newRun();
  private profile: Profile;
  private store: SaveStore;
  private pack: ContentPack;
  private registry: RoomRegistry;
  /** sessionStorage marker: set by jump() right before a reload, so start() knows to
   * skip the title screen and resume `profile.run` directly instead of waiting for a click. */
  private uatAutocontinueKey: string;
  private currentTheme = -1;
  private doorClickThrough: ((id: string) => void) | null = null;
  /** The door specs currently on screen, in door-index order — lets both
   * hover sources (3D raycast and DOM cards) resolve the same pentatonic
   * pitch (spec 07 §Q5.3) for a given door id. */
  private currentDoorSpecs: DoorSpec[] = [];
  private inGame = false;
  /** T9 — "One Door" mode: a single standalone room dealt from the title
   * screen, no run state carried forward. Gates enterRoom's permanent,
   * whole-run-scoped profile side effects (keepsakes, the lifetime
   * hearts-lost stat, the first-heart-loss explainer) while still letting
   * the room count toward the Ledger's honest room-visit tally and unlock
   * its Codex entry — the player genuinely did read it and choose. */
  private oneDoorMode = false;
  private runStartNotes = 0;
  private uat: boolean;
  private speedMultiplier: number;
  /** Chains every persist() onto the previous one, so writes always reach
   * the store in call order — even when a caller fires persist() without
   * awaiting it (the HUD's language switch does, deliberately, so the click
   * doesn't stall on I/O). Without this, a later awaited persist() (e.g. the
   * pause menu's "Save & exit") could theoretically settle before an earlier
   * unawaited one if the store were ever backed by something slower than
   * localStorage (the SaveStore interface is explicitly written to allow a
   * future async backend) — the earlier write would then land last and clobber
   * the newer state. Chaining makes ordering independent of backend latency. */
  private persistChain: Promise<void> = Promise.resolve();

  constructor(
    canvas: HTMLCanvasElement,
    ui: HTMLElement,
    profile: Profile,
    store: SaveStore,
    pack: ContentPack,
    uat = false,
  ) {
    this.ui = ui;
    this.profile = profile;
    this.store = store;
    this.pack = pack;
    this.registry = makeRegistry(pack.rooms);
    this.uatAutocontinueKey = `${pack.meta.id}-uat-autocontinue`;
    this.uat = uat;
    this.speedMultiplier = speedMultiplierFor(uat);
    sound.configurePack(pack.audio);
    document.body.classList.add(`pack-${pack.meta.id}`);

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
          if (id) sound.hover(this.doorIndex(id));
        },
        onDoorClick: (id) => this.doorClickThrough?.(id),
      },
      profile.settings.quality,
      pack.visuals,
      pack.guide.figure,
      profile.settings.renderScale,
      profile.settings.fpsCap,
    );
    this.director.setSpeedMultiplier(this.speedMultiplier);
    this.hud = new Hud(
      ui,
      () => this.openPause(),
      () => void this.openSettingsDirect(),
      profile.settings.language,
      (lang) => {
        this.profile.settings = { ...this.profile.settings, language: lang };
        this.applySettings();
        void this.persist();
      },
      pack.skin,
      pack.meta.id,
    );
    this.text = new TextPanel(stageBottom, ui);
    this.text.setSpeakerPrefixes(pack.guide.speakerPrefixes);
    // F2: fetches public/av-manifest.json once, at boot — best-effort, never
    // blocks startup; narration stays dormant if it's missing or empty.
    void voiceover.init(pack.meta.id, profile.settings.language);
    this.choices = new ChoicePanel(stageBottom);
    this.reflection = new ReflectionPanel(stageBottom);

    addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (
        e.key === 'Escape' &&
        shouldOpenPauseOnEscape(this.inGame, Boolean(this.ui.querySelector('.overlay, .field-note')), isFullscreen())
      ) {
        this.openPause();
      }
      if (e.key === 'f' || e.key === 'F') void toggleFullscreen();
    });
    addEventListener('pointerdown', () => sound.primeOnGesture(), { once: true });

    this.applySettings();

    installUatHandle(window as unknown as { __gameUat?: UatHandle; __anamnesisUat?: UatHandle }, this.uat, {
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
    if (!isJumpableRoom(roomId, this.registry)) {
      console.warn(`[${this.pack.meta.id}:uat] jump("${roomId}") refused — unknown room id.`);
      return;
    }
    const room = this.registry.get(roomId);
    const base = this.inGame && !this.state.finished ? this.state : newRun(undefined, this.priorFromProfile(), this.keepsakesFromProfile());
    const next: RunState = {
      ...base,
      act: room.act,
      currentRoom: roomId,
      currentStage: 0,
      finished: false,
      endingId: null,
      visited: backfillVisitedForJump(base.visited, roomId, this.pack.graph),
      descended: this.pack.graph.understorySequence.includes(roomId) ? true : base.descended,
    };
    this.profile.run = next;
    void this.store.save(PROFILE_ID, this.profile).then(() => {
      sessionStorage.setItem(this.uatAutocontinueKey, '1');
      this.reloadPage();
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

  /** Stamped once at the start of each fresh run — a keepsake earned mid-run
   * only becomes "held" from the *next* run (spoiler-safe: no earn-and-spend
   * in the same run). See `RunState.keepsakesHeld`. */
  private keepsakesFromProfile(): string[] {
    return [...this.profile.keepsakes];
  }

  private applySettings() {
    const s = this.profile.settings;
    document.body.classList.toggle('reduced-motion', s.reducedMotion);
    document.body.classList.toggle('high-contrast', s.highContrast);
    document.body.classList.toggle('theme-light', this.pack.visuals.supportsLightTheme && s.theme === 'light');
    this.text.setTypewriter(this.effectiveTypewriter());
    this.director.setReducedMotion(s.reducedMotion);
    this.director.setDynamicScenery(s.dynamicScenery);
    this.director.setRenderScale(s.renderScale);
    this.director.setFpsCap(s.fpsCap);
    applyUiZoom(s.uiZoom);
    sound.setMusicEnabled(s.music);
    sound.setSfxEnabled(s.sfx);
    sound.setMusicVolume(s.musicVolume);
    sound.setSfxVolume(s.sfxVolume);
    sound.setVoiceEnabled(s.narrationEnabled);
    sound.setVoiceVolume(s.narrationVolume);
    setLocale(s.language, s.textVersion);
    applyLocaleToDocument(s.language);
    this.hud.setLanguage(s.language);
    voiceover.setLanguage(s.language);
  }

  /** `{name}`/`{blurb}` (and future tokens) available for interpolation into any displayed text. */
  private tokens(): Record<string, string> {
    const name = this.profile.persona.name.trim();
    const blurb = this.profile.persona.blurb.trim();
    return {
      name: name || t(uiKey('travellerFallback'), 'traveller'),
      blurb: blurb || t(uiKey('archiveBlurbFallback'), 'no further description on file'),
    };
  }

  /** Typewriter forced off under `?uat=1`, regardless of the stored setting (which still displays as-is in Settings). */
  private effectiveTypewriter(): boolean {
    if (this.uat) return false;
    const s = this.profile.settings;
    return s.typewriter && !s.reducedMotion;
  }

  /** Chains `save(profile)` onto `persistChain`, so writes always reach the
   * store in call order — even when a caller fires persist() without
   * awaiting it. 6.2: the chain always settles *fulfilled* (a failed write
   * is caught here, not left to reject the chain), so one storage-quota
   * failure can't silently poison every persist() from then on — later
   * saves still get attempted, and the player is told once via toast rather
   * than the failure vanishing into an unhandled rejection. */
  private chainSave(profile: Profile): Promise<void> {
    this.persistChain = this.persistChain.then(() => this.store.save(PROFILE_ID, profile)).catch((err) => {
      console.error('save failed', err);
      showSaveFailedToast(this.ui, this.profile.settings.reducedMotion, this.speedMultiplier);
    });
    return this.persistChain;
  }

  /** F3: sets the generative bed's act (as always) and, if the active
   * pack's manifest has a file for this act's music slot, crossfades to it
   * — a no-op past `sound.setAct` while the manifest is empty, which it is
   * until real tracks exist. */
  private setActMusic(act: Parameters<typeof sound.setAct>[0]) {
    sound.setAct(act);
    sound.setMusicFile(voiceover.musicUrlFor(`act${act}`));
  }

  private async persist(showToast = false) {
    // Only stamp profile.run from this.state while an actual run is live.
    // this.state defaults to a placeholder newRun() at construction time —
    // before inGame is ever true (persona pick, Settings edits, the
    // auto-shown "Before you begin" from the title screen), persist() is
    // only ever asked to save persona/settings/profile-flag changes, and
    // must not manufacture a phantom resumable run out of that placeholder
    // (which would make the title screen wrongly offer "Continue the
    // journey" to a player who never actually started playing).
    if (this.inGame) this.profile.run = this.state.finished ? null : this.state;
    await this.chainSave(this.profile);
    // Shown only at natural checkpoints (door chosen, room completed, settings
    // saved) — never on the silent per-stage safety-net persist, or it would nag.
    if (showToast) {
      showSavedToast(this.ui, t(uiKey('savedToast'), 'Progress saved'), this.profile.settings.reducedMotion, this.speedMultiplier);
    }
  }

  /** Every full-page reload this app does (returning to title, saving
   * Settings, resetting a run, jump()'s own reload, ...) would otherwise
   * silently drop fullscreen — see fullscreen.ts's
   * rememberFullscreenForReload for why. Route every `location.reload()`
   * through here instead of calling it directly. */
  private reloadPage(): void {
    rememberFullscreenForReload();
    location.reload();
  }

  /** Same fullscreen-preserving concern as reloadPage, for the one
   * cross-document navigation this app makes (the Vestibule button). */
  private navigateToVestibule(): void {
    rememberFullscreenForReload();
    location.href = '../index.html';
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
    await this.chainSave(this.profile);
    this.reloadPage();
  }

  /** Wipes the whole profile back to defaults and starts over from a clean title screen. */
  private async resetProgress() {
    await this.chainSave(defaultProfile());
    this.reloadPage();
  }

  /** R9: the profile as a downloadable JSON string — a personal backup, a
   * cross-build (web ↔ Electron) transfer, and a bug-repro channel. */
  private exportProfile(): string {
    return JSON.stringify(this.profile, null, 2);
  }

  /** R9: replaces the whole profile with a pasted export, spread-merged over
   * defaults exactly like a normal load (so a file exported from an older
   * version still backfills cleanly). Returns false, changing nothing, if
   * `raw` isn't valid JSON; reloads on success so the game and its on-screen
   * UI can never disagree about which profile is current. */
  private importProfile(raw: string): boolean {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return false;
    }
    if (typeof parsed !== 'object' || parsed === null) return false;
    const hydrated = hydrateProfile(parsed as Partial<Profile>);
    void this.chainSave(hydrated).then(() => this.reloadPage());
    return true;
  }

  /** P5: the Ledger's last-message row label, resolved from the active
   * pack's own `hooks.lastMessageLabel` under its pack-scoped key — never
   * ANAMNESIS's "Your last message" for a pack whose own hook room isn't
   * really a message (LIMERENCE's `the-unsent` is an envelope choice). */
  private lastMessageLabel(): string {
    return t(ledgerLastMessageKey(this.pack.meta.id), this.pack.hooks.lastMessageLabel);
  }

  private settingsActions(): SettingsActions {
    return {
      hasRun: this.inGame || Boolean(this.profile.run && !this.profile.run.finished),
      onResetRun: () => void this.resetRun(),
      onResetProgress: () => void this.resetProgress(),
      onExportProfile: () => this.exportProfile(),
      onImportProfile: (raw) => this.importProfile(raw),
      exportPrefix: this.pack.meta.exportPrefix,
      themeSelectable: this.pack.visuals.supportsLightTheme,
      narrationAvailable: voiceover.packHasAnyVoice(),
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
    if (action === 'codex') await showCodex(this.ui, this.profile, this.pack);
    if (action === 'ledger') await showLedger(this.ui, this.profile, this.registry, this.pack.graph.understorySequence, this.pack.epiphanies, this.pack.endingRules.endingsTotal, this.pack.keepsakes.length, this.lastMessageLabel());
    if (action === 'register') await showHotelRegister(this.ui, this.profile, this.pack);
    if (action === 'persona') {
      this.profile.persona = await showPersona(this.ui, this.profile.persona, this.pack.meta.id, this.pack.guide.name);
      await this.persist();
    }
    if (action === 'about') await showAbout(this.ui, this.pack);
    if (action === 'credits') await showCredits(this.ui, this.pack);
    if (action === 'settings') {
      this.profile.settings = await showSettings(this.ui, this.profile.settings, this.settingsActions());
      this.applySettings();
      writeSharedDisplaySettings(this.profile.settings);
      await this.persist(true);
    }
    if (action === 'title') {
      await this.persist();
      this.reloadPage();
      return;
    }
    if (action === 'exit') {
      await this.persist();
      window.close();
      return;
    }
    if (action === 'vestibule') {
      await this.persist();
      this.navigateToVestibule();
      return;
    }
    this.stageBottom.classList.remove('overlay-hidden');
    this.director.setPaused(false);
  }

  /** The HUD's own persistent Settings shortcut — the same pause/show/apply/
   * persist/unpause sequence as `openPause`'s 'settings' branch, minus the
   * pause-menu screen in between, so a mid-run player reaches Settings in
   * one click instead of two (owner request: settings reachable "from any
   * place," not buried a menu-click deep). Never called from the title
   * screen — the title's own button list already offers Settings directly,
   * and the HUD (and this shortcut) only exist once `this.hud.show()` has
   * run for a live run. */
  private async openSettingsDirect() {
    this.director.setPaused(true);
    this.stageBottom.classList.add('overlay-hidden');
    this.profile.settings = await showSettings(this.ui, this.profile.settings, this.settingsActions());
    this.applySettings();
    writeSharedDisplaySettings(this.profile.settings);
    await this.persist(true);
    this.stageBottom.classList.remove('overlay-hidden');
    this.director.setPaused(false);
  }

  /** Entry point: title screen loop, then the run. */
  async start() {
    // jump() left a marker + a fully-formed run before reloading — resume it
    // directly instead of making a scripted test click through the title.
    if (this.uat && sessionStorage.getItem(this.uatAutocontinueKey) && this.profile.run) {
      sessionStorage.removeItem(this.uatAutocontinueKey);
      this.director.setTheme(0);
      this.state = this.profile.run;
      this.director.setPaused(false);
      this.inGame = true;
      this.runStartNotes = this.profile.codexUnlocked.length;
      this.hud.show();
      return this.runLoop();
    }
    this.director.setTheme(0);
    this.setActMusic(0);
    this.director.setPaused(true);
    this.director.setParallax(true);
    for (;;) {
      // Rebuilt fresh on every loop entry rather than reactively — covers a
      // locale change made mid-title-loop without any extra plumbing.
      this.director.setEpitaphWall(this.pack.endingRules.epitaphLines(this.profile.endingsSeen));
      const action = await showTitle(this.ui, this.profile, this.pack);
      if (action === 'codex') {
        await showCodex(this.ui, this.profile, this.pack);
      } else if (action === 'ledger') {
        await showLedger(this.ui, this.profile, this.registry, this.pack.graph.understorySequence, this.pack.epiphanies, this.pack.endingRules.endingsTotal, this.pack.keepsakes.length, this.lastMessageLabel());
      } else if (action === 'register') {
        await showHotelRegister(this.ui, this.profile, this.pack);
      } else if (action === 'oneDoor') {
        return this.playOneDoor();
      } else if (action === 'persona') {
        this.profile.persona = await showPersona(this.ui, this.profile.persona, this.pack.meta.id, this.pack.guide.name);
        await this.persist();
      } else if (action === 'about') {
        await showAbout(this.ui, this.pack);
      } else if (action === 'credits') {
        await showCredits(this.ui, this.pack);
      } else if (action === 'settings') {
        this.profile.settings = await showSettings(this.ui, this.profile.settings, this.settingsActions());
        this.applySettings();
        writeSharedDisplaySettings(this.profile.settings);
        await this.persist();
      } else if (action === 'exit') {
        window.close();
      } else if (action === 'vestibule') {
        await this.persist();
        this.navigateToVestibule();
      } else {
        // Non-negotiable: a player's very first playthrough, ever, sees the
        // "Before you begin" explainer automatically — no one starts not
        // knowing what this game is or why. Shown exactly once per profile
        // (hasSeenAbout), before persona and before the Examined Path offer;
        // the manual "Before you begin" title button still works afterward.
        if (action === 'new' && !this.profile.hasSeenAbout) {
          await showAbout(this.ui, this.pack);
          this.profile.hasSeenAbout = true;
          await this.persist();
        }
        if (action === 'new' && !this.profile.persona.name) {
          this.profile.persona = await showPersona(this.ui, this.profile.persona, this.pack.meta.id, this.pack.guide.name);
          await this.persist();
        }
        if (action === 'continue' && this.profile.run && isResumableRun(this.profile.run, this.registry)) {
          this.state = this.profile.run;
        } else {
          if (action === 'continue' && this.profile.run) {
            // A saved run whose currentRoom/visited no longer resolve in this
            // pack's registry (cross-pack import, or a future room-id rename)
            // — see isResumableRun's doc comment. Discard rather than crash
            // on the next registry.get() inside runLoop(); the player simply
            // begins a fresh run, same as if Continue had never been offered.
            this.profile.run = null;
            await this.persist();
          }
          // Examined Path (spec 05): offered only on a genuinely fresh run,
          // never on 'continue' — the mode is immutable once a run starts.
          const examined = await showExaminedPathOffer(this.ui, this.profile.settings.examinedPathDefault);
          this.profile.settings = { ...this.profile.settings, examinedPathDefault: examined };
          await this.persist();
          this.state = newRun(undefined, this.priorFromProfile(), this.keepsakesFromProfile(), examined);
        }
        break;
      }
    }
    this.director.setParallax(false);
    this.director.setPaused(false);
    this.inGame = true;
    this.runStartNotes = this.profile.codexUnlocked.length;
    this.hud.show();
    await this.runLoop();
  }

  /** Resolves a door id to its on-screen index (spec 07 §Q5.3's per-door
   * hover pitch) against the currently-shown door row; -1 (→ the base 880 Hz
   * tone) if the row has changed since. */
  private doorIndex(id: string): number {
    return this.currentDoorSpecs.findIndex((s) => s.id === id);
  }

  private async syncTheme() {
    const theme = themeForAct(this.state.act);
    if (theme !== this.currentTheme) {
      await this.fade(true);
      this.director.setTheme(theme);
      this.currentTheme = theme;
      this.setActMusic(theme);
      await this.fade(false);
      const intro = this.pack.guide.actIntroText(this.state.act);
      if (intro && this.state.act > 0) {
        await this.text.playBeats([intro], this.state, { title: this.actNameFor(this.state.act) }, { tokens: this.tokens() });
        this.text.hide();
      }
      // Examined Path (spec 05): one rhetorical, unscored Socratic aside per
      // act — no input, no branching, no record kept. Piggybacks on the act
      // intro since both fire exactly once per act transition.
      if (shouldShowSocraticAside(this.state)) {
        const fallback = this.pack.guide.examinedActBarkFallback[this.state.act as 1 | 2 | 3 | 4];
        await this.text.playBeats(
          [t(usherBarkKey(`examined-act${this.state.act}`, this.pack.meta.id), fallback)],
          this.state,
          { title: this.actNameFor(this.state.act) },
          { tokens: this.tokens() },
        );
        this.text.hide();
      }
    }
  }

  private async runLoop(): Promise<void> {
    for (;;) {
      if (this.state.hearts <= 0) return this.playEnding(this.pack.endingRules.evaluate(this.state));

      // resume a run that was saved mid-room
      const pending = this.state.currentRoom;
      if (pending) {
        await this.syncTheme();
        this.hud.setAct(this.actNameFor(this.state.act));
        this.hud.update(this.state.hearts, this.state.lucidity);
        await this.enterRoom(this.registry.get(pending));
        continue;
      }

      const doors = offeredDoors(this.state, this.registry, this.pack.graph);
      if (doors.length === 0) return this.playEnding(this.pack.endingRules.evaluate(this.state));

      await this.syncTheme();
      this.hud.setAct(this.actNameFor(this.state.act));
      this.hud.update(this.state.hearts, this.state.lucidity);

      const specs = doors.map((r) => ({
        id: r.id,
        hint: t(roomDoorHintKey(r.id), r.doorHint),
        teaser: t(roomTeaserKey(r.id), r.teaser),
        // The understory fork's first door reuses the secret-door styling
        // channel (violet accent) to read as the "stranger" option, without
        // making the room itself `secret` in content — it must never enter
        // act-pool secret-door logic.
        secret: Boolean(r.secret) || r.id === this.pack.graph.understorySequence[0],
        icon: this.pack.visuals.iconFor(r.id),
        unseen: !this.profile.codexUnlocked.includes(r.id),
      }));
      this.currentDoorSpecs = specs;
      this.director.setMood(null);
      this.director.setDiorama(null);
      sound.setRoomAccent(null);
      this.director.showDoors(specs);
      const atUnderstoryFork = doors.some((d) => d.id === this.pack.graph.understorySequence[0]);
      this.text.showBark(this.pack.guide.doorBark(this.state, this.profile.runsCompleted, doors.length, atUnderstoryFork), this.tokens());
      const picker = this.choices.pickDoor(specs, (id) => {
        this.director.highlightDoor(id);
        if (id) sound.hover(this.doorIndex(id));
      });
      this.doorClickThrough = picker.chooseExternally;
      const roomId = await picker.promise;
      this.doorClickThrough = null;
      sound.choice();
      this.text.hide();

      if (roomId === this.pack.graph.understorySequence[0]) this.state = { ...this.state, descended: true };
      const nextRoom = this.registry.get(roomId);
      await this.director.walkThrough(roomId, {
        color: spillColorFor(nextRoom.type, themeForAct(nextRoom.act), this.pack.visuals.moodTints, this.pack.visuals.fogColorByTheme),
      });
      await this.fade(true);
      this.director.hideDoors();
      await this.fade(false);

      this.state = { ...this.state, currentRoom: roomId, currentStage: 0 };
      await this.persist(true);
      await this.enterRoom(this.registry.get(roomId));
    }
  }

  private async enterRoom(room: Room): Promise<void> {
    // The hidden seventh ending's eligibility (spec 03): profile data is only
    // in scope here, so it's recomputed fresh each time the final door is
    // reached — a codex/keepsake milestone hit mid-run counts immediately,
    // rather than requiring a fresh run to notice it.
    if (room.id === this.pack.hooks.finalGateId) {
      const eligible = this.pack.endingRules.computeHiddenEligible(
        this.registry.all().map((r) => r.id),
        this.pack.graph.understorySequence,
        this.profile.codexUnlocked,
        this.profile.keepsakeChoicesTaken,
      );
      this.state = { ...this.state, anamnesisEligible: eligible };
    }
    const icon = this.pack.visuals.iconFor(room.id);
    const title = t(roomTitleKey(room.id), room.title);
    const tokens = this.tokens();
    this.director.setMood(room.type);
    this.director.setDiorama(room.id);
    sound.setRoomAccent((this.pack.audio.roomAccents[room.id] ?? null));
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
        [t(usherBarkKey('remembered-room', this.pack.meta.id), this.pack.guide.rememberedRoomBarkFallback)],
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
        explain: stage.explanation
          ? { title, body: t(roomExplanationKey(room.id, i), stage.explanation), icon }
          : undefined,
      });
      // The stage's beats just finished (the player clicked past the final
      // "continue"); hide that text panel before mounting the choice cards.
      // Without this, the two stack in `.stage-bottom`'s flex column at
      // once — the leftover beat text (with its stale "continue" hint)
      // sits directly above the choices instead of the choices taking the
      // panel's place, silently misplacing everything below it.
      this.text.hide();
      const available = stage.choices.filter((c) => !c.available || c.available(this.state));
      // F4: "reread the scene" replays this exact stage's beats read-only —
      // safe because nothing in `this.state` changes between showing the
      // choices and the player picking one, so a replay always resolves
      // identically — then hides the text panel again so the still-pending
      // choice cards (never re-rendered) take the screen back.
      const onReread = async () => {
        await this.text.playBeats(stage.beats, this.state, { title, type: room.type, icon }, {
          keyOf: (bi) => roomBeatKey(room.id, i, bi),
          tokens,
          explain: stage.explanation
            ? { title, body: t(roomExplanationKey(room.id, i), stage.explanation), icon }
            : undefined,
        });
        this.text.hide();
      };
      const choice: Choice = await this.choices.pick(available, this.state, room.id, this.pack.keepsakes, onReread);
      sound.choice();
      const heartsBefore = this.state.hearts;
      const flagsBefore = this.state.flags;
      this.state = applyEffects(this.state, choice.effects);
      // Mary's Room diorama (spec 07 §Q1): the one saturated red cube lights
      // only once the drawer has actually been opened, matching the room's
      // own beat (opening the drawer reveals red for the first time).
      if (this.pack.visuals.dioramaAccentHooks.some((h) => h.roomId === room.id && h.choiceId === choice.id)) {
        this.director.setDioramaAccent(true);
      }
      const heartsLostThisChoice = this.state.hearts < heartsBefore;
      if (heartsLostThisChoice) sound.heartLoss();
      // T9: none of this run's permanent, whole-run-scoped profile side
      // effects apply to a standalone One Door vignette — there is no real
      // run for a keepsake or a lifetime hearts-lost tick to belong to.
      // Found in code review (2026-07-15) as 3 separate scattered
      // `!this.oneDoorMode` checks (easy for a future addition to land
      // outside all of them by accident) — consolidated into this one gate.
      // Every permanent profile mutation triggered by a choice's effects
      // must live inside this block.
      const firstHeartLoss = heartsLostThisChoice && !this.profile.hasSeenHeartLoss && !this.oneDoorMode;
      if (!this.oneDoorMode) {
        if (heartsLostThisChoice) this.profile.heartsLost += heartsBefore - this.state.hearts;
        // Keepsakes (spec 04): earned silently, once per profile ever, the
        // instant their trigger flag is first set — no toast, no
        // interruption. Not retroactive: a flag set by a run before
        // keepsakes shipped grants nothing, since flags reset every run.
        const newFlags = this.state.flags.filter((f) => !flagsBefore.includes(f));
        for (const keepsakeId of keepsakesEarnedByFlags(newFlags, this.pack.keepsakeTriggers)) {
          if (!this.profile.keepsakes.includes(keepsakeId)) this.profile.keepsakes.push(keepsakeId);
        }
        if (choice.keepsakeId && !this.profile.keepsakeChoicesTaken.includes(choice.id)) {
          this.profile.keepsakeChoicesTaken.push(choice.id);
        }
      }
      this.state.transcript.push({
        roomId: room.id,
        stageIndex: i,
        choiceId: choice.id,
        choiceText: choice.text,
        effects: choice.effects,
      });
      this.hud.update(this.state.hearts, this.state.lucidity);
      if (room.id === this.pack.hooks.lastMessageId) {
        this.profile.lastMessage = choice.text.replace(/^[“"']|[”"']$/g, '');
      }
      // Bump currentStage before any persist below (including the
      // first-heart-loss explainer's own persist right after this) — a
      // quit-and-resume from anywhere past this point must re-enter at the
      // *next* stage, never replay this one and re-apply the choice's
      // effects a second time. Found in code review (2026-07-15): the
      // explainer used to persist while currentStage still pointed at this
      // stage, so quitting during a first-ever heart loss — a moment every
      // player passes through exactly once — could double-charge the heart
      // on resume.
      this.state = { ...this.state, currentStage: i + 1 };
      // Shown once per profile, ever — a brief, calm explanation of what just
      // happened, so the first heart loss reads as a mechanic, not a shock.
      if (firstHeartLoss) {
        this.profile.hasSeenHeartLoss = true;
        await this.persist();
        await this.text.playBeats(
          [t(usherBarkKey('first-heart-loss', this.pack.meta.id), this.pack.guide.firstHeartLossBarkFallback)],
          this.state,
          { title, type: room.type, icon },
          { tokens: { ...tokens, hearts: String(this.state.hearts) } },
        );
        this.text.hide();
      }
      // Persist right after the choice's effects land (not after its outcome
      // beats finish) — a quit-and-resume from here re-enters at the next
      // stage instead of re-applying this choice's effects a second time.
      await this.persist();
      await this.text.playBeats(choice.outcome, this.state, { title, type: room.type, icon }, {
        keyOf: (bi) => roomChoiceOutcomeKey(room.id, choice.id, bi),
        tokens,
      });
      // Examined Path (spec 05): plural, non-judging readings of the choice
      // just made — after the outcome has fully landed, never before. A
      // no-op for every player who hasn't opted in (shouldShowReflections
      // is false whenever state.examined is falsy, which is the default).
      // The outcome beats just finished (its "continue" was clicked); hide
      // that panel first — TextPanel and ReflectionPanel each track and
      // remove only their own element, so without this the reflection card
      // (freshly prepended) lands *above* the now-stale outcome text instead
      // of replacing it, the same misordering bug as the choice-cards case.
      if (shouldShowReflections(this.state, choice)) {
        this.text.hide();
        await this.reflection.show(room.id, choice.id, choice.reflections!, this.profile.settings.reducedMotion);
      }
      if (this.state.hearts <= 0) break;
    }
    this.text.hide();
    if (remembered) {
      this.text.setRemembered(false);
      this.text.setTypewriter(this.effectiveTypewriter());
    }

    if (room.fieldNote) {
      const noteTitle = t(roomNoteTitleKey(room.id), room.fieldNote.title);
      const noteThinkers = t(roomNoteThinkersKey(room.id), room.fieldNote.thinkers);
      const article = this.pack.articles[room.id];
      await showFieldNote(
        this.ui,
        {
          title: noteTitle,
          thinkers: noteThinkers,
          body: t(roomNoteBodyKey(room.id), room.fieldNote.body),
        },
        `${t(uiKey('fieldNoteHeader'), 'Field Note')} · ${room.type}`,
        icon,
        article
          ? () =>
              showRoomArticle(
                this.ui,
                noteTitle,
                noteThinkers,
                t(roomArticleTitleKey(room.id), article.title),
                t(roomArticleBodyKey(room.id), article.body),
              )
          : undefined,
      );
    }
    if (!this.profile.codexUnlocked.includes(room.id)) {
      this.profile.codexUnlocked.push(room.id);
    }
    // Ledger stat only (spec 06) — incremented exactly once per actual room
    // completion, never on a quit-and-resume replay of the same room, since
    // this line only runs after the stage loop above has fully finished.
    this.profile.roomVisits[room.id] = (this.profile.roomVisits[room.id] ?? 0) + 1;
    this.state = completeRoom(this.state, room.id, this.registry, this.pack.graph);
    await this.persist(true);
  }

  /** T9 — "One Door": deals a single random room from the title screen as a
   * standalone vignette. Reuses enterRoom's exact rendering path (same
   * TextPanel/ChoicePanel, same field-note reveal, same real choice
   * consequences within the room) on a throwaway RunState that's never
   * carried forward — no ending plays, and `this.inGame` stays false
   * throughout, so persist() never stamps a resumable run into the profile.
   * Reloads afterward (the same return-to-title path a finished run already
   * takes) rather than threading the title loop's own theme/music/parallax
   * state back by hand — simpler and exactly as tested as the normal path. */
  private async playOneDoor(): Promise<void> {
    const pool = oneDoorPool(this.pack);
    if (pool.length === 0) return; // defensive; every shipped pack has eligible rooms
    const room = pickOneDoorRoom(pool, this.profile.codexUnlocked);

    this.oneDoorMode = true;
    await this.fade(true);
    const theme = themeForAct(room.act);
    this.director.setTheme(theme);
    this.currentTheme = theme;
    this.setActMusic(theme);
    this.director.setPaused(false);
    this.director.setParallax(false);
    this.hud.show();
    this.hud.setAct(this.actNameFor(room.act));
    await this.fade(false);

    this.state = { ...newRun(), act: room.act };
    this.hud.update(this.state.hearts, this.state.lucidity);
    await this.enterRoom(room);

    this.oneDoorMode = false;
    this.reloadPage();
  }

  private getEnding(endingId: string) {
    const ending = this.pack.endings.find((e) => e.id === endingId);
    if (!ending) throw new Error(`Unknown ending: ${endingId}`);
    return ending;
  }

  private actNameFor(act: RunState['act']): string {
    return t(actNameKey(act, this.pack.meta.id), this.pack.graph.actNamesEn[act]);
  }

  private async playEnding(endingId: string): Promise<void> {
    const raw = this.getEnding(endingId);
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
    this.setActMusic(5);
    this.hud.hide();
    await this.fade(false);
    sound.ending();

    await this.text.playBeats(
      raw.beats,
      this.state,
      { title: ending.title, type: 'ENDING', icon: this.pack.visuals.endingIcons[endingId] },
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
        this.pack.visuals.endingIcons[endingId],
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
    if (this.state.descended) this.profile.understoryDescents += 1;
    if (this.state.examined) this.profile.examinedRuns += 1;
    // Every choice this run made, folded into the lifetime record epiphany
    // predicates read across runs (spec 06 §3) — before evaluateEpiphanies,
    // same "this run's contribution already applied" rule as the counters above.
    for (const entry of this.state.transcript) {
      const key = `${entry.roomId}:${entry.choiceId}`;
      if (!this.profile.choiceHistory.includes(key)) this.profile.choiceHistory.push(key);
    }
    // Epiphanies (spec 06): evaluated last, once every other counter above
    // has this run's contribution already applied.
    const newEpiphanies = evaluateEpiphanies(this.profile, this.state, this.registry, this.pack.epiphanies, this.pack.graph.understorySequence);
    this.profile.epiphanies.push(...newEpiphanies);
    await this.persist();

    const recap = this.state.visited
      .map((id) => this.registry.get(id))
      .map((room) => ({
        title: t(roomTitleKey(room.id), room.title),
        thesis:
          room.id === this.pack.hooks.lastMessageId && this.profile.lastMessage
            ? `“${this.profile.lastMessage}”`
            : t(roomNoteTitleKey(room.id), room.fieldNote?.title ?? ''),
      }));

    // T4 "Morning Report": the run's pivotal choices, quoted back — the
    // ones that actually moved an axis or cost/spared a heart, in the order
    // taken, capped at 4 so the screen stays a glance, not a transcript dump.
    const pivotalChoices = this.state.transcript
      .filter((entry) => (entry.effects?.axes && Object.values(entry.effects.axes).some((v) => v)) || entry.effects?.hearts)
      .slice(0, 4)
      .map((entry) => t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText));

    // T4: a few named doors this run never opened — teasers only, the same
    // one-line hook shown on an unvisited door card, never a spoiler. Capped
    // at 3 and drawn only from rooms the codex doesn't already hide (spec 06
    // §5 — the Understory shouldn't advertise itself here either).
    const doorsNeverOpened = this.pack.rooms
      .filter((r) => !this.state.visited.includes(r.id) && !isHiddenFromCodex(r.id, this.profile, this.pack.graph.understorySequence))
      .slice(0, 3)
      .map((r) => t(roomTeaserKey(r.id), r.teaser));

    for (;;) {
      const action = await showEndScreen(this.ui, {
        ending,
        triptych: this.pack.endingRules.axisTriptych(this.state),
        recap,
        lucidity: this.state.lucidity,
        hearts: Math.max(0, this.state.hearts),
        newNotes: this.profile.codexUnlocked.length - this.runStartNotes,
        newEpiphanies,
        epiphanies: this.pack.epiphanies,
        pivotalChoices,
        doorsNeverOpened,
      });
      if (action === 'codex') {
        await showCodex(this.ui, this.profile, this.pack);
        continue;
      }
      if (action === 'again') {
        // "Walk again" is a genuinely fresh run exactly like start()'s 'new'
        // path (new axes/hearts/lucidity/transcript) — the Examined Path
        // opt-in applies here too, for the same reason.
        const examined = await showExaminedPathOffer(this.ui, this.profile.settings.examinedPathDefault);
        this.profile.settings = { ...this.profile.settings, examinedPathDefault: examined };
        this.state = newRun(undefined, this.priorFromProfile(), this.keepsakesFromProfile(), examined);
        await this.persist();
        this.currentTheme = -1;
        this.runStartNotes = this.profile.codexUnlocked.length;
        this.hud.show();
        return this.runLoop();
      }
      this.reloadPage();
      return;
    }
  }
}
