import type { Room } from '../schema';

export const prologue: Room = {
  id: 'waiting-room',
  act: 0,
  title: 'The Waiting Room',
  type: 'NO-SOLUTION',
  doorHint: 'The door you are already through',
  teaser: 'Wherever you are, it starts here.',
  stages: [
    {
      beats: [
        'You wake in a waiting room. It smells like a hospital, a childhood hallway, and rain.',
        'There are chairs. There is a clock with no hands. There is a window, and behind the window there is more window.',
        'You do not remember your name. You reach for it the way a tongue reaches for a missing tooth.',
        'Something happened. A breakdown, a trip, an accident, a death — the word keeps sliding off. Whatever it was, it took the rest of you with it, and filed the pieces away somewhere.',
        'A shadow is sitting behind the reception desk, wearing a halo and a small pair of horns. One of them flickers, like a faulty sign.',
        'USHER: Ah. You’re awake. Wonderful. Terrible. One of those.',
        'USHER: Welcome to processing. You’ve been dissolved — happens to the best of you, and statistically speaking, to you. The pieces of whoever you were are stored in the rooms ahead. Walk through enough of them and you may cohere again. Or not. I’m legally required to say “or not.”',
      ],
      choices: [
        {
          id: 'where',
          text: '“Where am I?”',
          hint: 'Orientation first.',
          effects: { lucidity: 10, axes: { reasonFeeling: -4 } },
          outcome: [
            'USHER: Between. Behind. Under. Prepositions, mostly. The signage budget was cut in the fourth millennium.',
            'USHER: What matters is the direction: forward, through the rooms. Each holds a situation. You choose. The choosing is what re-collects you — or finishes the dissolving. We keep score with hearts and with lucidity. Lose your grip entirely and, well. There are worse endings. There are also better ones.',
          ],
        },
        {
          id: 'who',
          text: '“Are you God or the Devil?”',
          hint: 'Know your bureaucrat.',
          effects: { lucidity: 10, axes: { reasonFeeling: 4 } },
          outcome: [
            'USHER: God on odd days, the Devil on even ones. I will not be telling you what day it is. Frankly, after this many shifts, neither role remembers which is which. The pay is identical: nothing, eternally.',
            'USHER: You’ll want the rules. Rooms hold situations; situations hold choices; choices hold you. Hearts are your grip on reality — you have three. Lucidity is how honestly you look at things. Both are being watched. By me. Officially.',
          ],
        },
        {
          id: 'back',
          text: '“I want to go back. Now.”',
          hint: 'Straight to the point.',
          effects: { lucidity: 10, axes: { controlAcceptance: -6 } },
          outcome: [
            'USHER: Everyone does. That’s the good news: “back” exists. The bad news is the route. It runs through every piece of you we have on file — the kind decisions, the cowardly ones, the ones you never let yourself finish thinking.',
            'USHER: You can’t skip them. Believe me, people have tried. There’s a man in Room 18 who’s been trying since the Bronze Age.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'Anamnesis',
    thinkers: 'Plato · Meno, Phaedo',
    body: 'Plato proposed something strange: that learning is not acquiring the new but remembering the forgotten — anamnesis, the soul’s recollection of what it knew before birth scattered it into a body. In the Meno, Socrates draws geometry out of an untaught boy to argue the knowledge was already there, waiting to be walked back to. You do not need to buy the metaphysics to feel the truth in the shape of it: the moments that most change us rarely feel like additions. They feel like recognition — “I knew this, and had arranged not to.” This game takes Plato literally, once. Your self has been filed into rooms, and the way back is not invention but recollection: choosing, and watching what the choice reminds you of. The clock has no hands because recollection does not happen in time. It happens in rooms.',
  },
};
