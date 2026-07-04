import type { Choice, Room, RunState } from '../content/schema';
import { allRooms } from '../content/rooms';
import { getEnding } from '../content/endings';
import { ACT_NAMES } from '../content/graph';
import { actIntros, usherDoorBark } from '../content/usher';
import { applyEffects, newRun } from './gameState';
import { axisTriptych, evaluateEnding } from './endings';
import { completeRoom, makeRegistry, offeredDoors } from './storyEngine';
import type { Profile, SaveStore } from './saveStore';
import { SceneDirector } from '../scene/director';
import { Hud } from '../ui/hud';
import { TextPanel } from '../ui/textPanel';
import { ChoicePanel } from '../ui/choices';
import { showFieldNote } from '../ui/fieldNote';
import {
  showCodex,
  showEndScreen,
  showPauseMenu,
  showSettings,
  showTitle,
} from '../ui/overlays';
import { el } from '../ui/dom';

const PROFILE_ID = 'traveler';
const registry = makeRegistry(allRooms);

const themeForAct = (act: number): 0 | 1 | 2 | 3 | 4 => (act <= 1 ? (act as 0 | 1) : (act as 2 | 3 | 4));

export class Game {
  private ui: HTMLElement;
  private veil: HTMLElement;
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

  constructor(canvas: HTMLCanvasElement, ui: HTMLElement, profile: Profile, store: SaveStore) {
    this.ui = ui;
    this.profile = profile;
    this.store = store;

    this.veil = el('div', 'veil');
    ui.appendChild(this.veil);

    const stageBottom = el('div', 'stage-bottom');
    ui.appendChild(stageBottom);

    this.director = new SceneDirector(
      canvas,
      ui,
      {
        onDoorHover: () => {},
        onDoorClick: (id) => this.doorClickThrough?.(id),
      },
      profile.settings.quality,
    );
    this.hud = new Hud(ui, () => this.openPause());
    this.text = new TextPanel(stageBottom);
    this.choices = new ChoicePanel(stageBottom);

    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.inGame && !this.ui.querySelector('.overlay, .field-note')) {
        this.openPause();
      }
    });

    this.applySettings();
  }

  private applySettings() {
    const s = this.profile.settings;
    document.body.classList.toggle('reduced-motion', s.reducedMotion);
    document.body.classList.toggle('high-contrast', s.highContrast);
    this.text.setTypewriter(s.typewriter && !s.reducedMotion);
    this.director.setReducedMotion(s.reducedMotion);
  }

  private async persist() {
    this.profile.run = this.state.finished ? null : this.state;
    await this.store.save(PROFILE_ID, this.profile);
  }

  private fade(on: boolean): Promise<void> {
    this.veil.classList.toggle('on', on);
    const ms = this.profile.settings.reducedMotion ? 280 : 720;
    return new Promise((r) => setTimeout(r, ms));
  }

  private async openPause() {
    const action = await showPauseMenu(this.ui);
    if (action === 'codex') await showCodex(this.ui, this.profile);
    if (action === 'settings') {
      this.profile.settings = await showSettings(this.ui, this.profile.settings);
      this.applySettings();
      await this.persist();
    }
    if (action === 'title') {
      await this.persist();
      location.reload();
    }
  }

  /** Entry point: title screen loop, then the run. */
  async start() {
    this.director.setTheme(0);
    for (;;) {
      const action = await showTitle(this.ui, this.profile);
      if (action === 'codex') {
        await showCodex(this.ui, this.profile);
      } else if (action === 'settings') {
        this.profile.settings = await showSettings(this.ui, this.profile.settings);
        this.applySettings();
        await this.persist();
      } else {
        this.state = action === 'continue' && this.profile.run ? this.profile.run : newRun();
        break;
      }
    }
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
      await this.fade(false);
      const intro = actIntros[this.state.act];
      if (intro && this.state.act > 0) {
        await this.text.playBeats([intro], this.state, { title: ACT_NAMES[this.state.act] });
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
        this.hud.setAct(ACT_NAMES[this.state.act]);
        this.hud.update(this.state.hearts, this.state.lucidity);
        await this.enterRoom(registry.get(pending));
        continue;
      }

      const doors = offeredDoors(this.state, registry);
      if (doors.length === 0) return this.playEnding(evaluateEnding(this.state));

      await this.syncTheme();
      this.hud.setAct(ACT_NAMES[this.state.act]);
      this.hud.update(this.state.hearts, this.state.lucidity);

      const specs = doors.map((r) => ({ id: r.id, hint: r.doorHint, secret: Boolean(r.secret) }));
      this.director.showDoors(specs);
      this.text.showBark(usherDoorBark(this.state, this.profile.runsCompleted), this.state);
      const picker = this.choices.pickDoor(specs, (id) => this.director.highlightDoor(id));
      this.doorClickThrough = picker.chooseExternally;
      const roomId = await picker.promise;
      this.doorClickThrough = null;
      this.text.hide();

      await this.director.walkThrough(roomId);
      await this.fade(true);
      this.director.hideDoors();
      await this.fade(false);

      this.state = { ...this.state, currentRoom: roomId };
      await this.persist();
      await this.enterRoom(registry.get(roomId));
    }
  }

  private async enterRoom(room: Room): Promise<void> {
    for (let i = 0; i < room.stages.length; i++) {
      const stage = room.stages[i];
      await this.text.playBeats(stage.beats, this.state, { title: room.title, type: room.type });
      const available = stage.choices.filter((c) => !c.available || c.available(this.state));
      const choice: Choice = await this.choices.pick(available, this.state);
      this.state = applyEffects(this.state, choice.effects);
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
      await this.text.playBeats(choice.outcome, this.state, { title: room.title, type: room.type });
      if (this.state.hearts <= 0) break;
    }
    this.text.hide();

    if (room.fieldNote) {
      await showFieldNote(this.ui, room.fieldNote, `Field Note · ${room.type}`);
    }
    if (!this.profile.codexUnlocked.includes(room.id)) {
      this.profile.codexUnlocked.push(room.id);
    }
    this.state = completeRoom(this.state, room.id, registry);
    await this.persist();
  }

  private async playEnding(endingId: string): Promise<void> {
    const ending = getEnding(endingId);
    this.director.hideDoors();
    this.choices.clear();
    this.text.hide();
    await this.fade(true);
    this.director.setTheme(5);
    this.currentTheme = 5;
    this.hud.hide();
    await this.fade(false);

    await this.text.playBeats(ending.beats, this.state, { title: ending.title, type: 'ENDING' });
    this.text.hide();
    if (ending.fieldNote) {
      await showFieldNote(this.ui, ending.fieldNote, 'Ending · Field Note');
    }

    // persist meta-progression
    this.state.finished = true;
    this.state.endingId = endingId;
    const endingKey = `ending:${endingId}`;
    if (!this.profile.codexUnlocked.includes(endingKey)) this.profile.codexUnlocked.push(endingKey);
    if (!this.profile.endingsSeen.includes(endingId)) this.profile.endingsSeen.push(endingId);
    this.profile.runsCompleted += 1;
    await this.persist();

    const recap = this.state.visited
      .map((id) => registry.get(id))
      .map((room) => ({
        title: room.title,
        thesis:
          room.id === 'last-message' && this.profile.lastMessage
            ? `“${this.profile.lastMessage}”`
            : room.fieldNote?.title ?? '',
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
        this.state = newRun();
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
