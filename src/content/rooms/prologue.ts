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
        'A shadow sits behind the reception desk, wearing a halo and a small pair of horns. One of the horns flickers, faintly, like a sign that has almost given out.',
        'Usher: You are awake. That is either very good news, or the worst kind. I have stopped guessing which.',
        'Usher: This is processing. You have been dissolved — it happens, eventually, to nearly everyone, and today it happened to you. What is left of you is kept in the rooms ahead. Walk through enough of them honestly, and you may come back together. Or you may not. I am required to say so.',
      ],
      choices: [
        {
          id: 'where',
          text: '“Where am I?”',
          hint: 'Orientation first.',
          effects: { lucidity: 10, axes: { reasonFeeling: -4 } },
          outcome: [
            'Usher: Between. Behind. Beneath. The words for where this is are mostly prepositions — nothing so solid as a noun.',
            'Usher: What matters is the direction: forward, through the rooms. Each one holds a situation; you choose your way through it, and the choosing is what puts you back together — or finishes taking you apart. We keep a rough account, in hearts, and in how clearly you see. Lose your grip completely and there are worse endings than that. There are better ones, too.',
          ],
        },
        {
          id: 'who',
          text: '“Are you God or the Devil?”',
          hint: 'Know your bureaucrat.',
          effects: { lucidity: 10, axes: { reasonFeeling: 4 } },
          outcome: [
            'Usher: God, on the odd days. The Devil, on the even ones. I won’t tell you which today is — after enough centuries in this post, even I have stopped being certain which role is which.',
            'Usher: You will want the rules, so: rooms hold situations, situations hold choices, and choices hold you. Hearts are your grip on what is real — you have three. Lucidity is how honestly you are willing to look. I keep watch on both. That is, officially, my only real duty here.',
          ],
        },
        {
          id: 'back',
          text: '“I want to go back. Now.”',
          hint: 'Straight to the point.',
          effects: { lucidity: 10, axes: { controlAcceptance: -6 } },
          outcome: [
            'Usher: Everyone wants that. Here is the good news: back exists. Here is the rest of it — the road runs through every piece of you we hold on file. The kind decisions. The cowardly ones. The ones you never once let yourself finish thinking.',
            'Usher: There is no shortcut through them. People have tried. Nobody has yet found one.',
          ],
        },
      ],
      explanation:
        'You just woke up not remembering who you are — and everyone here calls that being "dissolved." The Usher is your guide, not quite good, not quite evil, just doing a strange job. The three questions here don\'t have a right answer; they\'re just your first chance to get your bearings. Think of it like waking up in a hospital after a bad accident, disoriented, with someone kind-but-odd trying to explain where you are before you\'re ready to hear it. Whatever you ask, you\'re not being tested — you\'re just choosing how you want to start finding yourself again.',
    },
  ],
  fieldNote: {
    title: 'Anamnesis',
    thinkers: 'Plato · Meno, Phaedo',
    body: 'Plato proposed something strange: that learning is not acquiring the new but remembering the forgotten — anamnesis, the soul’s recollection of what it knew before birth scattered it into a body. In the Meno, Socrates draws geometry out of an untaught boy to argue the knowledge was already there, waiting to be walked back to. You do not need to buy the metaphysics to feel the truth in the shape of it: the moments that most change us rarely feel like additions. **They feel like recognition — “I knew this, and had arranged not to.”** This game takes Plato literally, once. Your self has been filed into rooms, and the way back is not invention but recollection: choosing, and watching what the choice reminds you of. The clock has no hands because recollection does not happen in time. It happens in rooms. A marginal note, in an older hand: the ones who remember all of it do not use the door at all.',
  },
};
