// LIMERENCE's shared UI-chrome translations — see cs-ui.ts's header for the
// full explanation. Only the 7 genuinely pack-scoped strings are registered
// here (item 21 backfill, 2026-07-15; deduplication, 2026-07-15 code review)
// — every other UI-chrome key is pack-neutral and falls through to
// ANAMNESIS's own registration under the same unscoped uiKey(...).
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

registerAll('v2', 'de', {
  [oneDoorButtonKey('limerence')]: 'Eine Tür',
  [understoryNameKey('limerence')]: 'Die Registratur',
  [heartsTooltipKey('limerence')]:
    'Ihr Vertrauen — Ihre Fähigkeit, es noch zu geben. Ein paar besonders kostspielige Entscheidungen kosten unmittelbar eines, ebenso wie eine völlig erschöpfte Klarheit. Alle drei zu verlieren ist ein Ende, kein Scheitern.',
  [heartsAriaLabelKey('limerence')]: 'Vertrauen',
  [lucidityTooltipKey('limerence')]: 'Klarheit — wie ehrlich Sie bereit sind, sich selbst zu sehen.',
  [personaAboutLabelKey('limerence')]: 'Über Sie (optional — niemandem gezeigt, nur vom Portier gespürt)',
  [personaSubKey('limerence')]:
    'Rein zum Nutzen des Portiers — das ändert nichts an den Zimmern, nur daran, wie sie zu Ihnen sprechen.',
});
