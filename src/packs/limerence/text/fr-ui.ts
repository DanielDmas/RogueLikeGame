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

registerAll('v2', 'fr', {
  [oneDoorButtonKey('limerence')]: 'Une porte',
  [understoryNameKey('limerence')]: 'Le Registre',
  [heartsTooltipKey('limerence')]:
    'Votre confiance — votre capacité à encore l’accorder. Quelques choix particulièrement coûteux en coûtent une directement, tout comme une lucidité entièrement épuisée. Perdre les trois est une fin, pas un échec.',
  [heartsAriaLabelKey('limerence')]: 'Confiance',
  [lucidityTooltipKey('limerence')]: 'Lucidité — l’honnêteté avec laquelle vous acceptez de vous regarder.',
  [personaAboutLabelKey('limerence')]: 'À propos de vous (facultatif — montré à personne, seulement ressenti par le Portier)',
  [personaSubKey('limerence')]:
    'Uniquement à l’usage du Portier — cela ne change rien aux chambres, seulement la façon dont elles vous parlent.',
});
