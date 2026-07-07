const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const ICON_PATH = path.join(__dirname, '..', 'build', 'icon.ico');
const STATE_PATH = path.join(app.getPath('userData'), 'window-state.json');

const DEFAULT_BOUNDS = { width: 1280, height: 800 };

/** Reads the last-saved window bounds, but only if they'd land on a display
 * that's still actually connected — otherwise a since-removed monitor could
 * strand the window off-screen forever. Falls back to the built-in default
 * on any missing/corrupt/off-screen state. */
function loadWindowState() {
  try {
    const raw = fs.readFileSync(STATE_PATH, 'utf-8');
    const state = JSON.parse(raw);
    const { bounds } = state;
    if (!bounds || typeof bounds.x !== 'number' || typeof bounds.y !== 'number') return null;
    const onScreen = screen.getAllDisplays().some((d) => {
      const a = d.workArea;
      return bounds.x >= a.x && bounds.y >= a.y && bounds.x < a.x + a.width && bounds.y < a.y + a.height;
    });
    return onScreen ? state : null;
  } catch {
    return null;
  }
}

function saveWindowState(win) {
  try {
    const bounds = win.getBounds();
    const isMaximized = win.isMaximized();
    fs.writeFileSync(STATE_PATH, JSON.stringify({ bounds, isMaximized }), 'utf-8');
  } catch {
    // Best-effort — a failed save just means the next launch uses defaults.
  }
}

function createWindow() {
  const saved = loadWindowState();

  const win = new BrowserWindow({
    ...DEFAULT_BOUNDS,
    ...(saved?.bounds ?? {}),
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#0a0a0d',
    autoHideMenuBar: true,
    title: 'ANAMNESIS',
    icon: ICON_PATH,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (saved?.isMaximized) win.maximize();

  win.on('close', () => saveWindowState(win));

  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  return win;
}

// Single-instance lock: a second launch attempt focuses the existing window
// instead of opening a duplicate one.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
