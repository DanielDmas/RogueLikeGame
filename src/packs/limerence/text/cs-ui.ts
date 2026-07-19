// LIMERENCE's shared UI-chrome translations: the 7 genuinely pack-scoped
// strings whose English fallback names the pack's own guide or differs from
// ANAMNESIS's wording (oneDoorButton, understoryName, heartsTooltip,
// heartsAriaLabel, lucidityTooltip, personaAboutLabel, personaSub — see
// keys.ts's header comment on heartsTooltipKey for why each is scoped).
//
// Everything else in the ~161-key UI-chrome surface (item 21's original
// backfill, 2026-07-15) is deliberately *not* re-registered here: those
// keys are genuinely pack-neutral (same English source, no narrative voice)
// and `uiKey(...)` is unscoped by design, so ANAMNESIS's own registration
// already serves LIMERENCE for them. The original backfill duplicated all
// ~155 of them anyway (byte-for-byte identical values) — code review
// (2026-07-15) found this was actively how the heartsAriaLabel/
// lucidityTooltip leaks below went unnoticed (a wrong copy read as "already
// translated") and removed the dead duplication; nothing behavioral
// changed; only the 7 keys below that must differ per pack are registered.
import { registerAll } from '../../../engine/text/resolver';
import {
  oneDoorButtonKey,
  understoryNameKey,
  heartsTooltipKey,
  heartsAriaLabelKey,
  lucidityTooltipKey,
  personaAboutLabelKey,
  personaSubKey,
} from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  [oneDoorButtonKey('limerence')]: 'Jedny dveře',
  [understoryNameKey('limerence')]: 'Archiv',
  [heartsTooltipKey('limerence')]:
    'Vaše Důvěra — vaše schopnost ji ještě někomu dát. Několik obzvlášť nákladných voleb ji stojí přímo jednu, stejně jako když vaše Jasnost zcela dojde. Ztráta všech tří není obrazovka prohry — je to konec.',
  [heartsAriaLabelKey('limerence')]: 'Důvěra',
  [lucidityTooltipKey('limerence')]: 'Jasnost — jak upřímně jste ochotni se dívat sami na sebe.',
  [personaAboutLabelKey('limerence')]: 'O vás (nepovinné — nikomu se to neukáže, jen to procítí Vrátný)',
  [personaSubKey('limerence')]:
    'Čistě pro potřeby Vrátného — nic to nemění na pokojích, jen na tom, jak k vám promlouvají.',
});
