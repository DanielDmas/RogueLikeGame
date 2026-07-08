// LIMERENCE endings — L1 skeleton only (2 of the 7 designed in
// docs/design-limerence/06-endings-keepsakes-epiphanies.md). The remaining 5
// land at L4 alongside keepsakes, epiphanies, and the hidden endings.
import type { Ending } from '../../engine/schema';

export const limerenceEndings: Ending[] = [
  {
    id: 'the-morning-after',
    title: 'The Morning After',
    epitaph: 'You go home to the conversation, not from it.',
    beats: [
      'You step out of the hotel into a morning that is unmistakably real.',
      'The relationship was never the promise. You were the renovation.',
    ],
  },
  {
    id: 'the-ghost',
    title: 'The Ghost',
    epitaph: 'You keep attending your relationships without arriving in them.',
    beats: [
      'You stop carrying it. The Porter sits with you a while.',
      'Nothing here is a failure screen. It is just the slow exit nobody names.',
    ],
  },
];
