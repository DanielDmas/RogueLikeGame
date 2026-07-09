// Spec docs/design-limerence/02-rooms-act1.md — Prologue: the-front-desk.
import type { Room } from '../../../engine/schema';

export const theFrontDesk: Room = {
  id: 'the-front-desk',
  act: 0,
  title: 'The Front Desk',
  type: 'NO-SOLUTION',
  doorHint: 'a bell on a counter, no one behind it yet',
  teaser: 'wherever it happened, tonight is the night between',
  stages: [
    {
      beats: [
        'You wake mid-step in a lobby that smells of carpet cleaner, cold coffee, and someone’s perfume half-faded. You do not remember arriving. You rarely do, here.',
        'A departures board ticks over the desk, listing every guest currently checked in. No times. No gates. Just names, yours somewhere among them.',
        'The guest book is open to today’s page. Your signature is already on it, in your own handwriting, dated tomorrow.',
        'Porter: You are between one heartbeat and the next. Most guests are, the first time they notice.',
        'Porter: The rules, such as they are — floors, doors, rooms that remember what happens in them. You will walk some of them as yourself. Others, as whoever is inside when the door opens.',
        'As he turns to file the book away, you catch it — a wedding band on his right hand, and on his left, a pale, untanned stripe where one used to sit. He does not explain it. You do not ask, not yet.',
      ],
      choices: [
        {
          id: 'what-is-this',
          text: '"What is this place?"',
          hint: 'Ask about the hotel itself',
          effects: { lucidity: 10, axes: { reasonFeeling: -4 } },
          outcome: [
            'Porter: The rooms hold the nights people don’t tell anyone about. You will walk them as the people inside them. That is the whole architecture.',
          ],
        },
        {
          id: 'whose-side',
          text: '"Whose side are you on?"',
          hint: 'Ask about the Porter',
          effects: { lucidity: 10, axes: { reasonFeeling: 4 } },
          outcome: [
            'Porter: The desk is neutral, which every guest mistakes for cruelty. You will be everyone before morning. Then "side" will stop meaning very much.',
          ],
        },
        {
          id: 'let-me-out',
          text: '"I just want to go home."',
          hint: 'Refuse the frame outright',
          effects: { lucidity: 10, axes: { controlAcceptance: -6 } },
          outcome: [
            'Porter: Home is where the conversation you are avoiding lives. The way back runs through every room where someone is avoiding one. No shortcut has ever been found. People check, nightly.',
          ],
        },
      ],
      explanation:
        'Limerence is a real, named psychological state — an involuntary, obsessive infatuation, distinct from love and from choice. This hotel is named for it because most of what happens on its floors starts there. The game that follows isn’t about judging the people in these rooms; it’s about walking a hard relationship moment from inside it, once, safely, before life ever asks you to walk it for real.',
    },
  ],
  fieldNote: {
    title: 'Limerence',
    thinkers: 'Dorothy Tennov · Love and Limerence (1979)',
    body: 'Tennov coined the term to name something everyone experiences and almost no one has a word for: the involuntary state of obsessive infatuation — intrusive thinking about one person, a compulsive reading of their every signal, an ache that answers to no argument. It is not love, and it is not a decision; it has an onset, a peak, and (untended) a decay, usually within two years. **The hotel is named for it because nearly every door on these floors was opened by someone in its grip — the feeling was never the choice; what happened next always was.** Naming the state doesn’t cure it. It does, reliably, make the next decision a little more yours.',
  },
};
