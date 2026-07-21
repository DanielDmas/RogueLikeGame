import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveLastMessage } from '../engine/ledger';
import { register, setLocale } from '../engine/text/resolver';
import { roomChoiceTextKey } from '../engine/text/keys';
import { defaultProfile, type Profile } from '../engine/saveStore';

// Game-experience review S1 (2026-07-20, `16-full-review-2026-07-20.md` §8):
// `Profile.lastMessage` used to be rendered raw, forever in English,
// regardless of the player's language. `resolveLastMessage` re-resolves it
// through the translation catalog at display time via `lastMessageChoiceId`.

function profileWith(overrides: Partial<Profile>): Profile {
  return { ...defaultProfile(), ...overrides };
}

describe('resolveLastMessage (game-experience review S1)', () => {
  afterEach(() => setLocale('en', 'v2'));

  it('returns null when no message was ever recorded', () => {
    expect(resolveLastMessage(profileWith({ lastMessage: null }))).toBeNull();
  });

  it('falls back to the raw English string when there is no choice id (legacy save)', () => {
    const profile = profileWith({ lastMessage: 'Wait for me.', lastMessageChoiceId: null });
    setLocale('cs', 'v2');
    expect(resolveLastMessage(profile)).toBe('Wait for me.');
  });

  it('resolves through the translation catalog when a choice id is present and a translation exists', () => {
    register(roomChoiceTextKey('last-message', 'wait-for-me'), 'v2', 'cs', '„Počkej na mě.“');
    const profile = profileWith({ lastMessage: 'Wait for me.', lastMessageChoiceId: 'wait-for-me' });
    setLocale('cs', 'v2');
    expect(resolveLastMessage(profile)).toBe('„Počkej na mě.“');
  });

  it('still resolves to the English fallback when a choice id is present but has no registered translation', () => {
    const profile = profileWith({ lastMessage: 'Wait for me.', lastMessageChoiceId: 'some-untranslated-choice' });
    setLocale('cs', 'v2');
    expect(resolveLastMessage(profile)).toBe('Wait for me.');
  });

  it('honors a non-default lastMessageId (a second pack\'s own hook room)', () => {
    register(roomChoiceTextKey('the-unsent', 'send-it'), 'v2', 'fa', 'ترجمه شده');
    const profile = profileWith({ lastMessage: 'Send it.', lastMessageChoiceId: 'send-it' });
    setLocale('fa', 'v2');
    expect(resolveLastMessage(profile, 'the-unsent')).toBe('ترجمه شده');
  });

  it('English locale returns the raw source text unchanged', () => {
    const profile = profileWith({ lastMessage: 'Wait for me.', lastMessageChoiceId: 'wait-for-me' });
    expect(resolveLastMessage(profile)).toBe('Wait for me.');
  });
});

describe('resolveLastMessage call sites (source shape)', () => {
  it('flow.ts records lastMessageChoiceId alongside lastMessage at the hook room', () => {
    const src = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');
    const idx = src.indexOf("this.profile.lastMessage = choice.text.replace(");
    expect(idx, 'lastMessage write site not found').toBeGreaterThan(-1);
    const nextLines = src.slice(idx, idx + 200);
    expect(nextLines).toContain('this.profile.lastMessageChoiceId = choice.id;');
  });

  it('flow.ts\'s Morning Report thesis line resolves through resolveLastMessage, not raw profile.lastMessage', () => {
    const src = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');
    const idx = src.indexOf('buildEndScreenData');
    expect(idx, 'buildEndScreenData not found').toBeGreaterThan(-1);
    const body = src.slice(idx, idx + 1500);
    expect(body).toContain('resolveLastMessage(this.profile, this.pack.hooks.lastMessageId)');
  });

  it('ledger.ts\'s ledgerStats resolves the last-message row through resolveLastMessage', () => {
    const src = readFileSync(new URL('../engine/ledger.ts', import.meta.url), 'utf8');
    const idx = src.indexOf("id: 'last-message'");
    expect(idx, 'last-message row not found').toBeGreaterThan(-1);
    const line = src.slice(idx, idx + 200);
    expect(line).toContain('resolveLastMessage(profile, lastMessageId)');
  });

  it('overlays.ts\'s showCodex hook-room card resolves through resolveLastMessage', () => {
    const src = readFileSync(new URL('../ui/overlays.ts', import.meta.url), 'utf8');
    const idx = src.indexOf('pack.hooks.lastMessageId) {');
    expect(idx, 'hook-room card block not found').toBeGreaterThan(-1);
    const body = src.slice(idx, idx + 700);
    expect(body).toContain('resolveLastMessage(profile, pack.hooks.lastMessageId)');
    expect(body).not.toContain('profile.lastMessage ?');
  });
});
