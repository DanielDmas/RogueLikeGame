// LIMERENCE room set — L1 skeleton only. Placeholder content proving the
// ContentPack seam boots a second pack; real rooms land at L2+ per
// docs/design-limerence/02-rooms-act1.md onward. Ids are pre-chosen to match
// the design docs where a room is named there, so nothing here gets renamed
// out from under a later content pass.
import type { Room } from '../../engine/schema';

export const limerenceRooms: Room[] = [
  {
    id: 'the-front-desk',
    act: 0,
    title: 'The Front Desk',
    type: 'NO-SOLUTION',
    doorHint: 'a bell on a counter, no one behind it yet',
    teaser: 'a 3 a.m. check-in at a hotel that is not on any map',
    stages: [
      {
        beats: [
          'Porter: You wake at the front desk of a hotel with no checkout times on its board.',
          'Porter: Every room on every floor holds a relationship at its breaking point, paused mid-crisis. You will wake up inside them, as one of the people in them.',
        ],
        choices: [
          {
            id: 'ask-what-is-this-place',
            text: '"What is this place?"',
            hint: 'a question about the hotel itself',
            effects: {},
            outcome: ['Porter: A place between one heartbeat and the next. That is all a hotel is.'],
          },
          {
            id: 'ask-whose-side',
            text: '"Whose side are you on?"',
            hint: 'a question about the Porter',
            effects: {},
            outcome: ['Porter: The rooms’, mostly. They remember what people do in them.'],
          },
          {
            id: 'just-go-home',
            text: '"I just want to go home."',
            hint: 'refuse the frame outright',
            effects: {},
            outcome: ['Porter: You will. Everyone does, eventually. The floors are simply on the way.'],
          },
        ],
      },
    ],
  },
  {
    id: 'placeholder-room-1',
    act: 1,
    title: '[Act I placeholder room]',
    type: 'DILEMMA',
    doorHint: 'placeholder — see docs/design-limerence/02-rooms-act1.md',
    teaser: 'a Ground Floor room not yet written',
    stages: [
      {
        beats: ['The Room: This door leads somewhere real, eventually. Not tonight.'],
        choices: [
          { id: 'placeholder-a', text: 'Placeholder choice A', hint: 'placeholder hint A', effects: {}, outcome: ['The outcome is not yet written.'] },
          { id: 'placeholder-b', text: 'Placeholder choice B', hint: 'placeholder hint B', effects: {}, outcome: ['The outcome is not yet written.'] },
        ],
      },
    ],
  },
  {
    id: 'the-rumor',
    act: 1,
    title: 'The Rumor',
    type: 'DOOMED',
    gate: true,
    doorHint: 'the door everyone else already opened',
    teaser: 'what the whole school is already saying',
    stages: [
      {
        beats: ['Porter: The Ground Floor ends here, at a door everyone else has already walked through.'],
        choices: [
          { id: 'trust-without-asking', text: 'Trust her without asking', effects: {}, outcome: ['You keep the benefit of the doubt, and never know.'] },
          { id: 'interrogate', text: 'Interrogate', effects: { hearts: -1 }, outcome: ['The questions themselves are damage.'] },
        ],
      },
    ],
  },
  {
    id: 'placeholder-room-2',
    act: 2,
    title: '[Act II placeholder room]',
    type: 'DILEMMA',
    doorHint: 'placeholder — see docs/design-limerence/03-rooms-act2.md',
    teaser: 'a Second Floor room not yet written',
    stages: [
      {
        beats: ['The Room: This door leads somewhere real, eventually. Not tonight.'],
        choices: [
          { id: 'placeholder-a', text: 'Placeholder choice A', hint: 'placeholder hint A', effects: {}, outcome: ['The outcome is not yet written.'] },
          { id: 'placeholder-b', text: 'Placeholder choice B', hint: 'placeholder hint B', effects: {}, outcome: ['The outcome is not yet written.'] },
        ],
      },
    ],
  },
  {
    id: 'the-scoreboard',
    act: 2,
    title: 'The Scoreboard',
    type: 'DOOMED',
    gate: true,
    doorHint: 'the door that counts',
    teaser: 'a number, and what it does to you at night',
    stages: [
      {
        beats: ['Porter: The Second Floor ends here, at a door that keeps score.'],
        choices: [
          { id: 'prosecute', text: 'Prosecute the past', effects: { hearts: -1 }, outcome: ['Each question costs something.'] },
          { id: 'dismiss', text: 'Dismiss the case, and mean it', effects: {}, outcome: ['You let it go. It takes a while to believe you.'] },
        ],
      },
    ],
  },
  {
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
  },
  {
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
          { id: 'take-different-room', text: 'Take a different room, defiantly', effects: {}, outcome: ['The ledger expected that too.'] },
          { id: 'take-usual-room', text: 'Take the usual room, knowingly', effects: {}, outcome: ['It was always going to be this room. And you chose it.', 'A pattern named out loud starts to loosen.'] },
        ],
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
          { id: 'stand-by-it', text: 'Stand by all of it', effects: {}, outcome: ['You do. Every choice, named and claimed.'] },
          { id: 'name-what-changed', text: 'Name what changed you, with receipts', effects: { lucidity: 10 }, outcome: ['You lay it all out, plainly.'] },
          { id: 'lie-down', text: 'Stop carrying it; lie down', effects: { hearts: -3 }, outcome: ['The Porter sits with you. Nothing is asked of you now.'] },
        ],
      },
    ],
  },
];
