import { afterEach, describe, expect, it } from 'vitest';
import '../content/text'; // registers ANAMNESIS's cs/fa/de/fr
import '../packs/limerence/text'; // registers LIMERENCE's cs/fa/de/fr
import { setLocale, t } from '../engine/text/resolver';
import { understoryNameKey } from '../engine/text/keys';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';

// Regression test for the "Records Office" bug (item 21): the Register
// overlay used to hardcode ANAMNESIS's own "The Understory" label for both
// packs (`t(uiKey('registerUnderstoryFloor'), 'The Understory')`). This
// suite is deliberately DOM-free — vitest runs without jsdom in this repo
// (see panelLifecycle.test.ts's header) — and verifies the same
// resolver-level call the overlay makes: `t(understoryNameKey(pack.meta.id),
// pack.graph.understoryNameEn)`.
describe('Understory-floor label — pack-scoped, no longer hardcoded to ANAMNESIS (item 21 finding)', () => {
  afterEach(() => setLocale('en', 'v2'));

  it('each pack has its own English in-fiction name for the section', () => {
    expect(anamnesisPack.graph.understoryNameEn).toBe('The Understory');
    expect(limerencePack.graph.understoryNameEn).toBe('The Records Office');
  });

  it('English fallback resolves per pack via the same call the overlay makes', () => {
    setLocale('en', 'v2');
    expect(t(understoryNameKey(anamnesisPack.meta.id), anamnesisPack.graph.understoryNameEn)).toBe('The Understory');
    expect(t(understoryNameKey(limerencePack.meta.id), limerencePack.graph.understoryNameEn)).toBe(
      'The Records Office',
    );
  });

  it('LIMERENCE\'s label is translated in cs/fa/de/fr, distinct from ANAMNESIS\'s own translations', () => {
    const cases: [string, string][] = [
      ['cs', 'Archiv'],
      ['fa', 'بایگانی'],
      ['de', 'Die Registratur'],
      ['fr', 'Le Registre'],
    ];
    for (const [lang, expected] of cases) {
      setLocale(lang as 'cs' | 'fa' | 'de' | 'fr', 'v2');
      expect(
        t(understoryNameKey(limerencePack.meta.id), limerencePack.graph.understoryNameEn),
        `locale ${lang}`,
      ).toBe(expected);
      // ANAMNESIS's own translation for the same locale must never leak through.
      expect(t(understoryNameKey(anamnesisPack.meta.id), anamnesisPack.graph.understoryNameEn)).not.toBe(expected);
    }
  });
});

describe('Item 21 — scoped HUD/persona strings never leak the other pack\'s guide word', () => {
  it('heartsTooltipKey/personaAboutLabelKey/personaSubKey resolve to different Czech text per pack', async () => {
    const { heartsTooltipKey, personaAboutLabelKey, personaSubKey } = await import('../engine/text/keys');
    const { t } = await import('../engine/text/resolver');
    setLocale('cs', 'v2');
    const anamnesisTooltip = t(heartsTooltipKey('anamnesis'), '');
    const limerenceTooltip = t(heartsTooltipKey('limerence'), '');
    expect(anamnesisTooltip).not.toBe(limerenceTooltip);
    expect(limerenceTooltip).not.toContain('Uvaděč');
    expect(t(personaAboutLabelKey('limerence'), '')).toContain('Vrátný');
    expect(t(personaAboutLabelKey('limerence'), '')).not.toContain('Uvaděč');
    expect(t(personaSubKey('limerence'), '')).toContain('Vrátné');
    setLocale('en', 'v2');
  });
});
