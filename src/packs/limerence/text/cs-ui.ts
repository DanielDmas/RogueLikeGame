// LIMERENCE's shared UI-chrome translations. New category, deliberately
// started small: the pack's existing text/ files are organized by content
// type (rooms/endings/keepsakes/epiphanies/reflections/guide), and none of
// them is a natural home for a title-menu button label. Registers under
// oneDoorButtonKey('limerence') — the plain, unscoped uiKey('oneDoorButton')
// is ANAMNESIS's own registration; without scoping, whichever pack's module
// happened to import last would silently overwrite the other's translation
// wherever both packs are loaded together (as in this test suite).
import { registerAll } from '../../../engine/text/resolver';
import { oneDoorButtonKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  [oneDoorButtonKey('limerence')]: 'Jedny dveře',
});
