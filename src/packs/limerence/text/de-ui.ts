// LIMERENCE's shared UI-chrome translations — see cs-ui.ts's header for why
// this category exists and why it's scoped via oneDoorButtonKey('limerence').
import { registerAll } from '../../../engine/text/resolver';
import { oneDoorButtonKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  [oneDoorButtonKey('limerence')]: 'Eine Tür',
});
