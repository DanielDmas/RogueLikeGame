// Structural placeholders for the acts not yet written — Act III
// (docs/design-limerence/04-rooms-act3.md) and Act IV
// (05-rooms-act4-understory.md). Act II (03-rooms-act2.md) shipped real
// content in act2.ts. Real Act III/IV content lands at L3/L4 per the
// milestone plan; these exist only so the graph is complete and every gate
// is reachable. Each choice still carries a hint so contentPipeline.test.ts
// holds this to the same structural bar as real content.
import type { Room } from '../../../engine/schema';

export const placeholderRoom3: Room = {
  id: 'placeholder-room-3',
  act: 3,
  title: '[Act III placeholder room]',
  type: 'DILEMMA',
  doorHint: 'placeholder — see docs/design-limerence/04-rooms-act3.md',
  teaser: 'a Long-Stay Wing room not yet written',
  stages: [
    {
      beats: ['The Room: This door leads somewhere real, eventually. Not tonight.'],
      choices: [
        { id: 'placeholder-a', text: 'Placeholder choice A', hint: 'placeholder hint A', effects: {}, outcome: ['The outcome is not yet written.'] },
        { id: 'placeholder-b', text: 'Placeholder choice B', hint: 'placeholder hint B', effects: {}, outcome: ['The outcome is not yet written.'] },
      ],
    },
  ],
};

export const theUsualRoom: Room = {
  id: 'the-usual-room',
  act: 3,
  title: 'The Usual Room',
  type: 'NO-SOLUTION',
  gate: true,
  doorHint: 'the door that saw you coming',
  teaser: 'the room the hotel always gives you',
  stages: [
    {
      beats: ['Porter: The Long-Stay Wing ends here. The ledger already has tonight’s room number written in.'],
      choices: [
        { id: 'take-different-room', text: 'Take a different room, defiantly', hint: 'refuse the room you were given', effects: {}, outcome: ['The ledger expected that too.'] },
        { id: 'take-usual-room', text: 'Take the usual room, knowingly', hint: 'accept the pattern, out loud', effects: {}, outcome: ['It was always going to be this room. And you chose it.', 'A pattern named out loud starts to loosen.'] },
      ],
    },
  ],
};

export const theKitchenTable: Room = {
  id: 'the-kitchen-table',
  act: 4,
  title: 'The Kitchen Table',
  type: 'DILEMMA',
  doorHint: 'the quietest room in the house',
  teaser: 'the morning after everything is known',
  stages: [
    {
      beats: ['Porter: The Top Floor is a fixed corridor. Coffee going cold. Kids asleep upstairs.'],
      choices: [
        { id: 'stay-for-them', text: 'Stay, for them', hint: 'commit to the hard, unglamorous work', effects: {}, outcome: ['You stay. The work starts tomorrow.'] },
        { id: 'separate-well', text: 'Separate well', hint: 'end it with as much grace as the night allows', effects: {}, outcome: ['You leave with as much grace as the night allows.'] },
      ],
    },
  ],
};

export const theUnsent: Room = {
  id: 'the-unsent',
  act: 4,
  title: 'The Unsent',
  type: 'INSIGHT',
  doorHint: 'the door with a letter slot',
  teaser: 'one message may leave the hotel tonight',
  stages: [
    {
      beats: ['Porter: One message may leave the hotel tonight. Who is it for?'],
      choices: [
        { id: 'write-it', text: 'Write it', hint: 'send the one message the hotel allows', effects: {}, outcome: ['You write one true sentence, and let it go.'] },
        { id: 'leave-it-blank', text: 'Leave the page blank', hint: 'say it by never sending it', effects: {}, outcome: ['Some things are said by never being sent.'] },
      ],
    },
  ],
};

export const theMorningDesk: Room = {
  id: 'the-morning-desk',
  act: 4,
  title: 'The Morning Desk',
  type: 'INSIGHT',
  gate: true,
  doorHint: 'the desk where you check out',
  teaser: 'the Porter reads your file back to you',
  stages: [
    {
      beats: ['Porter: Everything you did on these floors — do you stand by it?'],
      choices: [
        { id: 'stand-by-it', text: 'Stand by all of it', hint: 'own every choice, unedited', effects: {}, outcome: ['You do. Every choice, named and claimed.'] },
        { id: 'name-what-changed', text: 'Name what changed you, with receipts', hint: 'account for it out loud', effects: { lucidity: 10 }, outcome: ['You lay it all out, plainly.'] },
        { id: 'lie-down', text: 'Stop carrying it; lie down', hint: 'set it down, at last', effects: { hearts: -3 }, outcome: ['The Porter sits with you. Nothing is asked of you now.'] },
      ],
    },
  ],
};
