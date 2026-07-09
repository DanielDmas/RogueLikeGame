import { describe, expect, it } from 'vitest';
import { aboutBodyHtml } from '../ui/overlays';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';

/**
 * The onboarding advisory layer (design spec 10-safety-education-charter.md
 * §2): a pack that defines `advisory` gets its own mechanics note plus the
 * mandatory safety/education content (purpose statement, themes, minors'
 * note, fiction-not-therapy note, help line, no-telemetry restatement),
 * shown automatically once via the engine-generic `Profile.hasSeenAbout`
 * mechanism (flow.ts) and re-viewable from the title menu's About button.
 * ANAMNESIS defines no `advisory` and must render byte-identical to its
 * original why/hearts/doors content.
 */
describe('Onboarding advisory layer (spec 10 §2)', () => {
  it('ANAMNESIS has no advisory block — the pack-conformance shape a future contributor should not add without reading the charter first', () => {
    expect(anamnesisPack.advisory).toBeUndefined();
  });

  it('ANAMNESIS’s About body is the original why/hearts/doors content, unaffected by the advisory feature existing', () => {
    const html = aboutBodyHtml(anamnesisPack);
    expect(html).toMatch(/Why play/);
    expect(html).toMatch(/Hearts/);
    expect(html).toMatch(/Doors/);
    // None of LIMERENCE's advisory vocabulary leaks into ANAMNESIS's panel.
    expect(html).not.toMatch(/infidelity|coercive control|non-consensual/i);
  });

  it('LIMERENCE defines a full advisory block', () => {
    expect(limerencePack.advisory).toBeDefined();
    const a = limerencePack.advisory!;
    for (const field of ['purposeStatement', 'mechanicsNote', 'themes', 'minorsNote', 'fictionNote', 'helpLine', 'noTelemetry'] as const) {
      expect(a[field].length, `advisory.${field} should be non-empty`).toBeGreaterThan(10);
    }
  });

  it('LIMERENCE’s About body includes every mandatory element of the charter’s advisory layer', () => {
    const html = aboutBodyHtml(limerencePack);
    // Themes list (spec 10 §1's target-rating posture list).
    expect(html).toMatch(/infidelity/i);
    expect(html).toMatch(/jealousy/i);
    expect(html).toMatch(/coercive control/i);
    expect(html).toMatch(/non-consensual/i);
    expect(html).toMatch(/consensual non-monogamy/i);
    // The minors' storylines are non-explicit note.
    expect(html).toMatch(/no sexual content/i);
    // "This is fiction, not therapy or advice."
    expect(html).toMatch(/fiction, not therapy/i);
    // The static help line.
    expect(html).toMatch(/talk to someone real/i);
    // No-telemetry restatement.
    expect(html).toMatch(/is tracked/i);
    // ANAMNESIS's own why/hearts/doors wording does not leak into LIMERENCE's panel.
    expect(html).not.toMatch(/six endings/);
  });

  it('LIMERENCE’s advisory never depicts or characterizes the non-consensual-imagery theme beyond naming it (charter §1: non-negotiable)', () => {
    const html = aboutBodyHtml(limerencePack);
    const forbidden = /naked|nude|explicit image|breast|genital/i;
    expect(forbidden.test(html)).toBe(false);
  });
});
