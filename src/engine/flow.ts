import type { Choice, Room, RunState } from './schema';
import type { ContentPack } from '../packs/types';
import { keepsakesEarnedByFlags } from '../content/keepsakes';
import { applyEffects, newRun } from './gameState';
import { shouldShowReflections, shouldShowSocraticAside } from './reflections';
import { evaluateEpiphanies, isHiddenFromCodex, resolveLastMessage, visibleRoomCount } from './ledger';
import { activePatterns, patternForRun, MIN_RUNS_FOR_PATTERN, type PlayerPatternId } from './patterns';
import { backfillVisitedForJump, completeRoom, hashKey, isResumableRun, makeRegistry, offeredDoors, type RoomRegistry } from './storyEngine';
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
import { showSavedToast, showSaveFailedToast, showKeepsakeSpentToast } from '../ui/toast';
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
  keepsakeKey,
} from './text/keys';
import { applyLocaleToDocument } from '../ui/locale';
import { isFullscreen, rememberFullscreenForReload, shouldOpenPauseOnEscape, toggleFullscreen } from '../ui/fullscreen';
import { writeSharedDisplaySettings, clearSharedDisplaySettings } from './sharedDisplaySettings';
import { applyUiZoom } from '../ui/zoom';
import { installUatHandle, isJumpableRoom, speedMultiplierFor, type UatHandle } from './uatMode';

const PROFILE_ID = 'traveler';

const themeForAct = (act: number): 0 | 1 | 2 | 3 | 4 => (act <= 1 ? (act as 0 | 1) : (act as 2 | 3 | 4));

/** How long the end-of-act floor-name card (the "act headline") holds at
 * full opacity before the veil fades back out.
 *
 * Owner directive (2026-07-21): the act headline must be shown for **at
 * least 4 seconds**. The visible timeline this constant sits in, measured
 * against the real CSS (`styles.css`'s `.interlude` / `.veil`):
 *
 *   `fade(true)` 720ms  → veil opaque; the card is not mounted yet
 *   `setInterlude()`    → card begins its own 300ms opacity transition
 *   this hold           → card at full opacity for HOLD − 300ms
 *   `fade(false)` 720ms → card rides the veil's fade-out, still legible
 *   `clearInterlude()`  → reset for the next floor change
 *
 * So 4300ms buys a full **4000ms at full opacity** (4300 − the 300ms
 * fade-in it overlaps), plus ~720ms more still-readable time on the way
 * out — comfortably clearing the 4s floor under the strictest reading of
 * it, with headroom for longer localized floor names (Czech/German run
 * longer than English; Farsi reads RTL).
 *
 * Never scaled by reducedMotion — a text hold is reading time, not motion,
 * and shortening it there would be backwards (the same principle as R1's
 * toast-hold fix). Only `speedMultiplier` scales it, so `?uat=1` scripted
 * runs don't wait on pacing that exists purely for a human's benefit. */
const INTERLUDE_HOLD_MS = 4300;

export class Game {
  private ui: HTMLElement;
  private veil: HTMLElement;
  private interlude: HTMLElement;
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
  /** Game-experience review (2026-07-19, `15-game-experience-review.md`
   * E1): set true exactly when `this.state` was just loaded from a saved
   * `profile.run` (the 'continue' title action, or the UAT `jump()`
   * autocontinue path — both are a genuine save-then-reload, not a normal
   * in-session room transition). Consumed once by the very first
   * `runLoop()` iteration's `syncTheme()`/`enterRoom()` calls, then reset —
   * every later act transition or room entry in the same session is a
   * fresh, non-resumed one and must not suppress its own intro/aside. */
  private resumedFromSave = false;
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
    // Phase V4a — the end-of-act interlude: a floor-name title card that
    // shows *while the veil is already opaque* for a real act transition,
    // so it costs no extra wait beyond the fade's own existing duration and
    // changes no test-observable timing. A child of the veil, so it fades
    // with it automatically via the veil's own opacity transition.
    this.interlude = el('div', 'interlude');
    this.veil.appendChild(this.interlude);

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
    // Game-experience review H1 (2026-07-20, `16-full-review-2026-07-20.md`
    // §10): a pointerdown-only listener never fires for a keyboard-only
    // player (Tab + Enter/Space through the whole title flow) — the
    // AudioContext's required user-gesture unlock never happened, so they
    // got a silent game with no visible cause. click/keydown/pointerdown
    // all count as gestures; `sound.primeOnGesture()` is itself idempotent
    // (soundEngine.ts's own `resumed` guard), so `{ once: true }` on each
    // listener is enough — no shared armed-flag bookkeeping needed here,
    // unlike `fullscreen.ts`'s `resumeFullscreenAfterReload`, whose
    // `requestFullscreen()` call is not itself safe to invoke twice.
    for (const type of ['click', 'keydown', 'pointerdown'] as const) {
      addEventListener(type, () => sound.primeOnGesture(), { once: true, capture: true });
    }

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
      snapCameraForScreenshot: () => this.director.snapCameraToRoomReading(),
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
    const wantLightTheme = this.pack.visuals.supportsLightTheme && s.theme === 'light';
    document.body.classList.toggle('reduced-motion', s.reducedMotion);
    document.body.classList.toggle('high-contrast', s.highContrast);
    document.body.classList.toggle('theme-light', wantLightTheme);
    this.text.setTypewriter(this.effectiveTypewriter());
    this.director.setReducedMotion(s.reducedMotion);
    this.director.setDynamicScenery(s.dynamicScenery);
    this.director.setRenderScale(s.renderScale);
    this.director.setFpsCap(s.fpsCap);
    // Phase V2 — "the morning read": the 3D scene mode. `setThemeMode` is
    // already a no-op when the mode isn't actually changing, and rebuilds
    // the currently-shown theme when it is (a no-op itself if no theme has
    // been built yet, e.g. this very first call in the constructor, before
    // `start()` ever calls `setSceneTheme`). Restore the current room's
    // diorama afterward — the rebuild clears it, same as any other
    // `setTheme` call, and nothing else re-triggers it mid-run the way the
    // title loop's own re-entry already restores the epitaph wall.
    this.director.setThemeMode(wantLightTheme);
    if (this.inGame && this.state.currentRoom) {
      this.director.setDiorama(this.state.currentRoom);
    }
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

  /** Phase V4a — the end-of-act interlude: a large, centered floor-name
   * title card shown while the veil is already opaque (see the call site in
   * `syncTheme`). Pure decoration on top of the existing fade — costs no
   * extra wait, changes no other pack's behavior (every pack calls this the
   * same way; it just renders one line of text already-translated via
   * `actNameFor`, so there is no new translation surface). */
  private setInterlude(title: string) {
    this.interlude.textContent = title;
    this.interlude.classList.add('show');
  }

  private clearInterlude() {
    this.interlude.classList.remove('show');
    this.interlude.textContent = '';
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
    // Game-experience review R2 (2026-07-20, `16-full-review-2026-07-20.md`
    // §3): the Settings description promises this wipes "everything —
    // field notes, endings, settings, your current run" in all five
    // languages, but the cross-pack sharedDisplaySettings key survived and
    // main.ts's boot-time overlay silently brought quality/renderScale/
    // uiZoom/fpsCap back on the very next load — a wipe that wasn't total.
    clearSharedDisplaySettings();
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
    // S-2 (extended review, 2026-08-01): every other Settings-writing path
    // (title/pause/HUD-gear/end-screen) calls writeSharedDisplaySettings —
    // import was the one that forgot. Without this, main.ts's unconditional
    // boot-time `withSharedDisplaySettings` overlay silently reverted the
    // just-imported quality/renderScale/uiZoom/fpsCap back to whatever was
    // set before the import, directly contradicting the Settings panel's own
    // "Replaces your entire profile" promise.
    writeSharedDisplaySettings(hydrated.settings);
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
      // Game-experience review H3 (2026-07-20, `16-full-review-2026-07-20.md`
      // §10): `this.inGame` stays true up through the end screen, so without
      // the `!this.state.finished` guard, the end screen's own Settings
      // panel offered a "Reset current run" for a run that had already
      // ended — a misleading action on a run there was nothing left to reset.
      hasRun: (this.inGame && !this.state.finished) || Boolean(this.profile.run && !this.profile.run.finished),
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
    if (action === 'ledger') await showLedger(this.ui, this.profile, this.registry, this.pack.graph.understorySequence, this.pack.epiphanies, this.pack.endingRules.endingsTotal, this.pack.keepsakes.length, this.lastMessageLabel(), this.pack.hooks.lastMessageId);
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
      this.setSceneTheme(0);
      this.state = this.profile.run;
      this.resumedFromSave = true;
      this.director.setPaused(false);
      this.inGame = true;
      this.runStartNotes = this.profile.codexUnlocked.length;
      this.hud.show();
      return this.runLoop();
    }
    this.setSceneTheme(0);
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
        await showLedger(this.ui, this.profile, this.registry, this.pack.graph.understorySequence, this.pack.epiphanies, this.pack.endingRules.endingsTotal, this.pack.keepsakes.length, this.lastMessageLabel(), this.pack.hooks.lastMessageId);
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
        // U-6 (extended review, 2026-08-01): the pause menu's and the HUD
        // gear's own settings branches both `persist(true)` — this title-
        // screen path was the one that saved silently, an inconsistent
        // feedback gap for the identical action.
        await this.persist(true);
      } else if (action === 'exit') {
        // U-7 (extended review, 2026-08-01): the pause menu's exit branch
        // persists before closing; this title-screen path window.close()'d
        // immediately. No player-visible loss today (every mutating title
        // action already persists on its own before this point), but the
        // asymmetry invites a future bug the moment any title action ever
        // defers its own persist.
        await this.persist();
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
        // U-4 (extended review, 2026-08-01): gate on personaOffered, not on
        // whether a name was actually entered — Skip is a real, sticky
        // answer, not "still undecided". See personaOffered's own doc
        // comment (saveStore.ts) for the full rationale.
        if (action === 'new' && !this.profile.personaOffered) {
          this.profile.persona = await showPersona(this.ui, this.profile.persona, this.pack.meta.id, this.pack.guide.name);
          this.profile.personaOffered = true;
          await this.persist();
        }
        if (action === 'continue' && this.profile.run && isResumableRun(this.profile.run, this.registry)) {
          this.state = this.profile.run;
          this.resumedFromSave = true;
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
          // Game-experience review E6 (2026-07-20, `15-game-experience-
          // review.md` §8, owner decision): on a genuinely first-ever run
          // (no completed runs yet — About and Persona are also only
          // auto-shown then, which is what made the onboarding stack
          // heavy), the offer is deferred past both of those to the first
          // reflections-bearing choice instead — see enterRoom's own
          // comment for where it actually fires. Every returning player,
          // and a "Walk again" replay (which builds its run the same way
          // this branch always has), still sees the offer here, unchanged.
          if (this.profile.runsCompleted === 0) {
            this.state = newRun(undefined, this.priorFromProfile(), this.keepsakesFromProfile(), false, true);
          } else {
            const examined = await showExaminedPathOffer(this.ui, this.profile.settings.examinedPathDefault);
            this.profile.settings = { ...this.profile.settings, examinedPathDefault: examined };
            await this.persist();
            this.state = newRun(undefined, this.priorFromProfile(), this.keepsakesFromProfile(), examined);
          }
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

  /** The one cross-run observation the guide may voice on this visit, or
   * `null` (master plan Tier 1 item 4). Reads the profile's Ledger-only
   * counters and *never* writes — `engine/patterns.ts` owns the detection
   * rules and the "observe, never score" constraint; this only supplies the
   * active pack's own numbers, since a pack with no Understory must not be
   * told it never found one, and room totals differ per pack.
   *
   * `visibleRoomCount`'s `total` is deliberately reused rather than
   * `pack.rooms.length`: it excludes understory rooms the player hasn't found
   * yet, so "walked most of the rooms" is measured against the place as the
   * player currently knows it, exactly like the Ledger's own "Rooms
   * witnessed" row. */
  private recognizedPattern(): PlayerPatternId | null {
    // Cheap guard before the room-registry scan below: this runs on every door
    // row of every run, and the overwhelming majority of those belong to
    // players with no cross-run history at all, for whom `activePatterns`
    // would return `[]` regardless of what the scan found.
    if (this.profile.runsCompleted < MIN_RUNS_FOR_PATTERN) return null;
    const { total } = visibleRoomCount(this.profile, this.registry, this.pack.graph.understorySequence);
    const active = activePatterns({
      runsCompleted: this.profile.runsCompleted,
      endingsSeen: this.profile.endingsSeen,
      heartsLost: this.profile.heartsLost,
      understoryDescents: this.profile.understoryDescents,
      roomVisits: this.profile.roomVisits,
      keepsakes: this.profile.keepsakes,
      keepsakeChoicesTaken: this.profile.keepsakeChoicesTaken,
      roomsTotal: total,
      hasUnderstory: this.pack.graph.understorySequence.length > 0,
    });
    return patternForRun(active, this.profile.runsCompleted);
  }

  /** Resolves a door id to its on-screen index (spec 07 §Q5.3's per-door
   * hover pitch) against the currently-shown door row; -1 (→ the base 880 Hz
   * tone) if the row has changed since. */
  private doorIndex(id: string): number {
    return this.currentDoorSpecs.findIndex((s) => s.id === id);
  }

  /** Mirrors the active act theme onto `<body data-act>` — a CSS hook so
   * LIMERENCE's light mode can vary its accent per floor (creative bible
   * §8: "act floors get warmer→colder→domestic-dawn progressions"),
   * without touching the 3D scene itself (which stays the hotel's authored
   * dark palette in both themes, by deliberate design — see
   * packs/limerence/theme.ts's header). Harmless for every other
   * combination: ANAMNESIS and LIMERENCE-dark have no `[data-act]`
   * selector at all in styles.css, so this is a pure no-op for them. */
  private setSceneTheme(id: 0 | 1 | 2 | 3 | 4 | 5) {
    this.director.setTheme(id);
    document.body.dataset.act = String(id);
  }

  /** `resuming` (game-experience review E1, 2026-07-19): true only for the
   * single call that follows a genuine mid-room save resume — suppresses
   * the act-intro paragraph and Socratic aside (already heard earlier this
   * same run, before the reload) while keeping the interlude card, which
   * still earns its keep as a quiet "here's where you are" re-establishment. */
  private async syncTheme(resuming = false) {
    const theme = themeForAct(this.state.act);
    if (theme !== this.currentTheme) {
      await this.fade(true);
      // Phase V4a: only for a genuine mid-run floor change (act > 0) — the
      // very first floor of a fresh run has nowhere to "arrive" from yet.
      const showingInterlude = this.state.act > 0;
      if (showingInterlude) this.setInterlude(this.actNameFor(this.state.act));
      this.setSceneTheme(theme);
      this.currentTheme = theme;
      this.setActMusic(theme);
      // Found live (2026-07-16): setInterlude()/clearInterlude() with no
      // await between them never gives the browser a chance to paint — the
      // interlude was set and cleared inside one synchronous stretch,
      // invisible to a real player too, not just to automated timing. A
      // real, awaited pause (scaled by speedMultiplier, same as every other
      // deliberate-pacing wait in this file) is required for it to actually
      // read as a beat rather than nothing.
      if (showingInterlude) await new Promise((r) => setTimeout(r, INTERLUDE_HOLD_MS * this.speedMultiplier));
      // Game-experience review §1 (2026-07-19): clearInterlude() used to run
      // *before* this fade-out, so the card never actually rode the veil's
      // own opacity transition the way the class comment above always
      // claimed — it just vanished on a still-black screen, then the veil
      // faded on nothing. Clearing only after fade(false) resolves lets the
      // (still-`.show`) card's compound opacity fade out together with the
      // veil, as designed, then resets it for the next transition.
      await this.fade(false);
      if (showingInterlude) this.clearInterlude();
      if (resuming) return;
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
        // Game-experience review E1 (2026-07-19): only a genuine mid-room
        // resume (this branch) suppresses the act intro/aside replay — the
        // between-doors resume case just below is a natural moment to hear
        // the act's own re-establishment again, right before picking a new
        // room, so it is deliberately left alone. Consumed once: this
        // branch runs at most once per resumed run (currentRoom is cleared
        // the moment the room completes).
        const resuming = this.resumedFromSave;
        this.resumedFromSave = false;
        await this.syncTheme(resuming);
        this.hud.setAct(this.actNameFor(this.state.act));
        this.hud.update(this.state.hearts, this.state.lucidity);
        await this.enterRoom(this.registry.get(pending), resuming);
        continue;
      }
      this.resumedFromSave = false;

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
      this.text.showBark(
        this.pack.guide.doorBark(
          this.state,
          this.profile.runsCompleted,
          doors.length,
          atUnderstoryFork,
          this.recognizedPattern(),
        ),
        this.tokens(),
      );
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

  /** `resuming` (game-experience review E1, 2026-07-19): true only when
   * this call follows a genuine mid-room save resume — see the recap bark
   * below, `syncTheme`'s matching param, and `resumedFromSave`'s comment. */
  private async enterRoom(room: Room, resuming = false): Promise<void> {
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
    } else if (resuming && startStage > 0) {
      // Game-experience review E1 (2026-07-19): the one case with no other
      // on-screen trace that this is a resume — startStage > 0 means the
      // for-loop below is about to skip straight past every earlier stage
      // of this room without replaying them (correct: re-running their
      // beats would re-apply already-applied effects), so without this the
      // player is otherwise dropped mid-scene with zero acknowledgement
      // they're picking a thread back up rather than freshly arriving.
      await this.text.playBeats(
        [t(usherBarkKey('resumed-mid-room', this.pack.meta.id), this.pack.guide.resumedMidRoomBarkFallback)],
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
        if (choice.keepsakeId) {
          if (!this.profile.keepsakeChoicesTaken.includes(choice.id)) this.profile.keepsakeChoicesTaken.push(choice.id);
          // Game-experience review E5 (2026-07-19): the ✧ mark's hover
          // tooltip was the only in-run signal a keepsake had been spent —
          // and the player has just clicked past the card that showed it,
          // so nothing confirmed what actually happened. A quiet toast,
          // same pattern as the save/restore notices.
          const def = this.pack.keepsakes.find((k) => k.id === choice.keepsakeId);
          if (def) showKeepsakeSpentToast(this.ui, t(keepsakeKey(def.id, 'name'), def.name), this.profile.settings.reducedMotion);
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
        this.profile.lastMessageChoiceId = choice.id;
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
      // Game-experience review E6 (2026-07-20, `15-game-experience-
      // review.md` §8): the deferred Examined Path offer fires here — the
      // first choice with reflections attached, the Examined Path's own
      // definition of "significant" (shouldShowReflections below gates on
      // the same field). Sits before that check so an accepted offer pays
      // off immediately: this exact choice's own reflection card renders
      // right after, the clerk the panel describes appearing the moment
      // the player says yes. Trade-off, accepted: the Act I Socratic
      // aside (which fires at the act 0->1 transition, before this block
      // can ever run) is skipped on this one first-ever run — every later
      // act's aside shows normally once `examined` is set here.
      if (this.state.examinedOfferPending && choice.reflections?.length && !this.oneDoorMode) {
        this.state = { ...this.state, examinedOfferPending: false };
        this.text.hide();
        const examined = await showExaminedPathOffer(this.ui, this.profile.settings.examinedPathDefault);
        this.profile.settings = { ...this.profile.settings, examinedPathDefault: examined };
        this.state = { ...this.state, examined };
        await this.persist();
      }
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
    this.setSceneTheme(theme);
    this.currentTheme = theme;
    this.setActMusic(theme);
    this.director.setPaused(false);
    this.director.setParallax(false);
    this.hud.show();
    this.hud.setAct(this.actNameFor(room.act));
    await this.fade(false);

    // E-3 (extended review, 2026-08-01): thread the player's actually-held
    // keepsakes through, same as every real run's newRun() call — a One
    // Door vignette deliberately carries no `prior` (there is no run
    // history for a single dealt room to reference), but the Codex/Ledger
    // both frame keepsakes as "you carry them always"; silently hiding a
    // keepsake-gated bonus choice here contradicted that. No other
    // permanent, whole-run-scoped side effect changes — this only makes an
    // already-earned choice visible, exactly as it would be in a real run.
    this.state = { ...newRun(undefined, undefined, this.keepsakesFromProfile()), act: room.act };
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
    this.setSceneTheme(5);
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

    // Game-experience review N1 (2026-07-20, `16-full-review-2026-07-20.md`
    // §3): every translated piece of the end screen used to be built once,
    // before the action loop below — E4's new Settings button re-enters
    // that loop, so a player who switched language from the end screen
    // returned to an end screen still showing the *previous* language
    // until the next reload. Rebuilt as a closure, called fresh on every
    // loop iteration (cheap — everything it reads is loop-invariant run
    // state, just re-resolved through whatever `t()` currently resolves to).
    const buildEndScreenData = () => ({
      ending: {
        ...raw,
        title: t(endingTitleKey(endingId), raw.title),
        epitaph: t(endingEpitaphKey(endingId), raw.epitaph),
      },
      triptych: this.pack.endingRules.axisTriptych(this.state),
      recap: this.state.visited
        .map((id) => this.registry.get(id))
        .map((room) => ({
          title: t(roomTitleKey(room.id), room.title),
          thesis:
            room.id === this.pack.hooks.lastMessageId && this.profile.lastMessage
              ? `“${resolveLastMessage(this.profile, this.pack.hooks.lastMessageId)}”`
              : t(roomNoteTitleKey(room.id), room.fieldNote?.title ?? ''),
        })),
      // T4 "Morning Report": the run's pivotal choices, quoted back — the
      // ones that actually moved an axis or cost/spared a heart, in the
      // order taken, capped at 4 so the screen stays a glance, not a
      // transcript dump.
      pivotalChoices: this.state.transcript
        .filter((entry) => (entry.effects?.axes && Object.values(entry.effects.axes).some((v) => v)) || entry.effects?.hearts)
        .slice(0, 4)
        .map((entry) => t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText)),
      // T4: a few named doors this run never opened — teasers only, the
      // same one-line hook shown on an unvisited door card, never a
      // spoiler. Capped at 3 and drawn only from rooms the codex doesn't
      // already hide (spec 06 §5 — the Understory shouldn't advertise
      // itself here either). Game-experience review R4 (2026-07-20,
      // `16-full-review-2026-07-20.md` §3): salted by this run's own
      // `doorSeed` (same pattern `offeredDoors` already uses to shuffle
      // door offers) rather than left in room-declaration order — the
      // unsalted version showed near-identical teasers on almost every
      // run, since the earliest-declared unvisited rooms nearly always won.
      doorsNeverOpened: [...this.pack.rooms]
        .filter((r) => !this.state.visited.includes(r.id) && !isHiddenFromCodex(r.id, this.profile, this.pack.graph.understorySequence))
        .sort((a, b) => hashKey(a.id, this.state.doorSeed ?? 0) - hashKey(b.id, this.state.doorSeed ?? 0))
        .slice(0, 3)
        .map((r) => t(roomTeaserKey(r.id), r.teaser)),
      // Game-experience review E5 (2026-07-19): the keepsakes this run
      // began with (RunState.keepsakesHeld, stamped at newRun() from the
      // profile and never mutated mid-run — see keepsakesFromProfile's
      // own comment).
      keepsakesCarried: (this.state.keepsakesHeld ?? [])
        .map((id) => this.pack.keepsakes.find((k) => k.id === id))
        .filter((def): def is (typeof this.pack.keepsakes)[number] => Boolean(def))
        .map((def) => t(keepsakeKey(def.id, 'name'), def.name)),
    });

    for (;;) {
      const action = await showEndScreen(this.ui, {
        ...buildEndScreenData(),
        lucidity: this.state.lucidity,
        hearts: Math.max(0, this.state.hearts),
        newNotes: this.profile.codexUnlocked.length - this.runStartNotes,
        newEpiphanies,
        epiphanies: this.pack.epiphanies,
      });
      if (action === 'codex') {
        await showCodex(this.ui, this.profile, this.pack);
        continue;
      }
      // Game-experience review E4 (2026-07-19): Settings and Vestibule were
      // both natural post-run desires the end screen used to bounce
      // through Title for — mirrors openPause()'s own settings/vestibule
      // handling.
      if (action === 'settings') {
        this.profile.settings = await showSettings(this.ui, this.profile.settings, this.settingsActions());
        this.applySettings();
        writeSharedDisplaySettings(this.profile.settings);
        await this.persist(true);
        continue;
      }
      if (action === 'vestibule') {
        await this.persist();
        this.navigateToVestibule();
        return;
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
