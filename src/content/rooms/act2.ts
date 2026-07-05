import type { Room } from '../schema';
import { choseIn, hasFlag } from '../../engine/gameState';

export const junction: Room = {
  id: 'junction',
  act: 2,
  title: 'The Junction',
  type: 'DILEMMA',
  doorHint: 'The door of the lever and the weight',
  teaser: 'A lever, a bridge, and the same five lives, twice.',
  stages: [
    {
      beats: [
        'A vast dark hall of celestial machinery — gears the size of moons, conveyor belts carrying small indifferent stars. Through the middle of it: tracks.',
        'A trolley is coming. It is painted municipal yellow and it is not slowing down, because slowing down is not in its job description.',
        'On the main track: five mannequins, tied down with what looks like red tape. Literal red tape. On the side track: one mannequin, likewise. The mannequins scream. The screaming is unconvincing.',
        'USHER: (in a conductor’s cap, next to a large lever) Budget cuts. We used to use philosophers, but they kept unionizing. The scenario is standard: do nothing, it takes the five. Pull, it diverts and takes the one. I am required to ask you not to overthink it, and required to know you will.',
      ],
      choices: [
        {
          id: 'pull',
          text: 'Pull the lever. One instead of five.',
          hint: 'The arithmetic.',
          effects: { lucidity: 15, flags: ['pulled-lever'], axes: { reasonFeeling: -10 } },
          outcome: [
            'The lever moves with a bureaucratic click, as if stamping a form. The trolley leans into the side track and does what trolleys do. Five mannequins fall theatrically silent in relief; one falls silent otherwise.',
            'USHER: Four lives saved, net, minus one clean conscience, gross. Standard exchange rate. Most people pull, by the way. It helps that it’s a lever — levers feel like paperwork.',
          ],
        },
        {
          id: 'no-pull',
          text: 'Don’t touch it. You will not make yourself the author of that death.',
          hint: 'The hand matters.',
          effects: { lucidity: 15, flags: ['kept-lever'], axes: { controlAcceptance: 8 } },
          outcome: [
            'You step back from the lever. The trolley continues along the track it was always on, and the hall is briefly very loud and then very quiet.',
            'USHER: Interesting. Five gone, but none of them yours, is the theory. The trolley was the author; you declined a co-writing credit. There are entire journals about whether that distinction is profound or a laundering scheme. They do not cite each other.',
          ],
        },
        {
          id: 'refuse1',
          text: '“This is stupid. They’re mannequins.”',
          hint: 'Decline the premise.',
          effects: { lucidity: -8, flags: ['refused-once'], axes: { controlAcceptance: -4 } },
          outcome: [
            'USHER: (sighing, producing a clipboard) Of course they’re mannequins. You’re a partially dissolved self in a metaphysical processing facility. Everything here is a stand-in — including, at present, you.',
            'USHER: The trolley isn’t asking whether the mannequins are real. It’s asking what you are. Refusing the question does answer it, you know. Just not flatteringly. The five, for the record, are gone.',
          ],
        },
      ],
    },
    {
      beats: [
        'The hall rearranges itself with the sound of enormous filing. Now you stand on a footbridge over the track. The trolley — reset, remorseless — is coming again, toward five fresh mannequins.',
        'Beside you on the bridge stands a single enormous mannequin, heavy enough — the room makes this understood with vulgar clarity — to stop the trolley, if it happened to fall. If it were, say, pushed.',
        'USHER: Same arithmetic as before. Five for one. The only difference is the interface. No lever this time. Just your hands, and a spine that has opinions.',
        (s) =>
          choseIn(s, 'junction', 'pull')
            ? 'USHER: You pulled, last time. One for five, you said. Well — here is the same trade, closer to the skin. Let’s see if the mathematics survives the touch.'
            : choseIn(s, 'junction', 'no-pull')
              ? 'USHER: You kept your hands clean at the lever. Curious to see if the bridge changes anything — it usually changes everything, which is itself the puzzle.'
              : 'USHER: You called it stupid last time. The trolley has generously provided a second act. It’s very committed to the bit. Rather like me.',
      ],
      choices: [
        {
          id: 'push',
          text: 'Push. Five for one — the same trade as the lever.',
          hint: 'Consistency, with hands.',
          effects: { lucidity: 15, flags: ['pushed'], axes: { reasonFeeling: -12 } },
          outcome: [
            'It is nothing like the lever. That is the finding. The trolley stops; five mannequins are saved; your hands file a formal complaint that will remain open indefinitely.',
            (s) =>
              choseIn(s, 'junction', 'pull')
                ? 'USHER: Lever and bridge, both. Whatever else one says, the arithmetic in you goes all the way down. That is either integrity or a warning label; the journals are split.'
                : 'USHER: No at the lever, yes on the bridge? Now that is a rare bird. You may want to sit with that one. Take a pamphlet.',
          ],
        },
        {
          id: 'no-push',
          text: 'Don’t. Pushing a person is not pulling a lever.',
          hint: 'Some means are never means.',
          effects: { lucidity: 15, flags: ['kept-bridge'], axes: { reasonFeeling: 10 } },
          outcome: [
            'Your hands stay on the railing. The trolley passes below, doing its municipal worst, and the enormous mannequin beside you continues its enormous existence, unaware of the entire seminar just held about its body.',
            (s) =>
              choseIn(s, 'junction', 'pull')
                ? 'USHER: So: pull the lever, spare the push. Five for one at arm’s length, but not at hand’s length. Don’t look so caught out — that exact asymmetry has kept philosophy departments heated since 1976. The question is whether it’s wisdom in your spine or just squeamishness with tenure.'
                : 'USHER: Consistent refusal. The trolley took ten mannequins across two experiments and your hands took none of them. There is a name for your position, and the name is contested, and you are standing in it very steadily.',
          ],
        },
        {
          id: 'refuse2',
          text: '“Still stupid. Still not playing.”',
          hint: 'Refuse again — this place counts.',
          effects: { hearts: -1, lucidity: 0, axes: { controlAcceptance: -6 } },
          available: (s) => hasFlag(s, 'refused-once'),
          outcome: [
            'USHER: (quietly, and the machinery quiets with it) Twice, then.',
            'USHER: Listen. The rooms are not asking you to enjoy them. They are asking you to be present in them. Every refusal is a small vote for staying dissolved — a little abstention from being anyone. The house tallies those. I’m sorry; I don’t make the rules on odd days.',
            'Something in your chest goes quieter, one heart’s worth. The mannequins, mercifully, do not applaud.',
          ],
        },
        {
          id: 'refuse-late',
          text: '“I’m not doing this one. It’s grotesque.”',
          hint: 'Decline — once is allowed.',
          effects: { lucidity: -8, flags: ['refused-once'], axes: { controlAcceptance: -4 } },
          available: (s) => !hasFlag(s, 'refused-once'),
          outcome: [
            'USHER: Noted, and honestly, on the bridge variant I hear that a lot — proximity has a smell. One refusal is contemplation. Two would be a policy. Choose your future refusals accordingly.',
            'The trolley concludes its business without your signature. Whether that constitutes innocence is left, pointedly, as an exercise.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Trolley Problem',
    thinkers: 'Philippa Foot · Judith Jarvis Thomson · doctrine of double effect',
    body: 'Philippa Foot built the trolley in 1967 to probe why some killings feel permitted and others forbidden when the body count is identical. Judith Jarvis Thomson added the footbridge, and the discomfort became data: most people pull the lever but will not push the man, though both trade one life for five. The classic explanation is the doctrine of double effect — harm foreseen as a side effect (the diverted trolley kills the one) is more permissible than harm used as a means (the pushed body is the brake). Critics reply that this is moral squeamishness dressed in Latin; defenders answer that a morality indifferent to the difference between turning away a harm and wielding a person would license horrors. If your lever-hand and your bridge-hand disagreed tonight, you have reproduced fifty years of peer-reviewed argument in your own nervous system. That asymmetry is either the deepest thing in you or the oldest bug. Nobody has settled which.',
  },
};

export const experienceMachine: Room = {
  id: 'experience-machine',
  act: 2,
  title: 'The Experience Machine',
  type: 'DILEMMA',
  doorHint: 'The door behind which nothing is wrong',
  teaser: 'A perfect life, guaranteed — if you can bear what that costs.',
  stages: [
    {
      beats: [
        'A warm alcove in the cold machinery, upholstered in a light that remembers summer. In the center: a pod, open, shaped exactly like relief.',
        'A brass plaque, recently polished: EXPERIENCE MACHINE — MK. ∞. Below it, smaller: a perfect life, indistinguishable from real, guaranteed happy. Your brain will never know. That is the feature.',
        'USHER: (dusting the plaque with genuine tenderness) Best product we offer. The simulations are flawless — love, meaning, small delicious problems that always resolve. Nobody who enters ever complains afterward.',
        'USHER: Think carefully about why that sentence is the most frightening thing in this entire facility. I’ll wait. The pod will also wait. The pod is extremely good at waiting.',
      ],
      choices: [
        {
          id: 'enter',
          text: 'Get in. Happiness is happiness; the substrate is a technicality.',
          hint: 'The guarantee.',
          effects: { lucidity: 10, flags: ['entered-machine'], axes: { controlAcceptance: 10 } },
          outcome: [
            'The pod closes like a kind decision. And then — summers. A porch you own. Work that matters and finishes. Someone laughing at your third-best joke because they know the top two are coming.',
            'It is, in every measurable respect, the best stretch of existence you have ever had. You surface from it only because this facility, unlike the retail model, has a return policy.',
            'USHER: (helping you out) Lovely, wasn’t it. Do notice the tense you just used — “wasn’t.” Everything in there conjugates that way, eventually. Even so: you now know what perfect feels like. Some travelers find that clarifying. Others find it a splinter. We’ll see which you are.',
          ],
        },
        {
          id: 'refuse',
          text: 'Refuse. You want to do things, not dream them.',
          hint: 'Reality, with all faults, as-is.',
          effects: { lucidity: 18, axes: { controlAcceptance: -8, reasonFeeling: -8 } },
          outcome: [
            'You step back. The pod does not sulk; perfection has excellent manners.',
            'USHER: Interesting. You chose a reality that is, at this very moment, a burning metaphysical bureaucracy — over guaranteed bliss. Either you believe contact with the real is worth more than any amount of feeling good, or you simply don’t trust products with an infinity symbol in the model number. Both are defensible. One is philosophy and one is consumer protection.',
          ],
        },
        {
          id: 'trial',
          text: '“Five minutes. Just to know what I’d be refusing.”',
          hint: 'Informed consent, surely.',
          effects: { lucidity: 12, axes: { controlAcceptance: 4 } },
          outcome: [
            'Five minutes, you say. The pod, which has heard this before, says nothing.',
            'Inside, five minutes lasts two years. Good years. When the lid opens you come out with the specific grief of a life that never happened — homesick for people who are still in there, being perfectly imaginary without you.',
            'USHER: The trial is the whole product, friend. Nobody buys the machine. They buy the next five minutes, repeatedly, forever. You’re out, which puts you in rare company. Walk it off. The homesickness fades to a shimmer. The shimmer, I’m told, never quite does.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Experience Machine',
    thinkers: 'Robert Nozick · hedonism · authenticity',
    body: 'Robert Nozick’s 1974 thought experiment was aimed at the heart of hedonism — the theory that pleasure is the only thing valuable in itself. If that were true, he argued, you should plug into a machine that delivers a lifetime of perfectly convincing bliss. Most people refuse, and the refusal is the data. Nozick drew out three reasons: we want to do things, not just have the experience of doing them; we want to be a certain kind of person, and a body floating in a tank is no kind at all; and we want contact with reality itself, unwilling to trade the true world for a nicer rendering. The machine has only grown less hypothetical since — every feed and game and scroll is a low-resolution pod, billed in five-minute trials. The question the plaque asks is not “would you plug in?” It is: by what percentage are you already in, and who is the you that would know?',
  },
};

export const ship: Room = {
  id: 'ship',
  act: 2,
  title: 'The Ship',
  type: 'INSIGHT',
  doorHint: 'The door of the replaced planks',
  teaser: 'Piece by piece, you are being replaced. Who walks out?',
  stages: [
    {
      beats: [
        'A workshop that smells of cedar and anesthesia. On the central bench, under sheets of light, lies something the craftsmen are working on with terrible gentleness.',
        'It is you. You are also standing here watching, which the craftsmen treat as normal, which is somehow the worst part.',
        'They are replacing you a piece at a time — a memory slid out like a warped plank, a fresh one fitted; an opinion sanded, rehung; a cell, a habit, the particular way you say “anyway.” Each removed piece is carried, respectfully, to the corner.',
        'In the corner, the removed pieces are being assembled. The assembly has your posture. As you watch, it acquires your face and checks it in a small mirror, with your exact skepticism.',
        (s) =>
          s.memoryLost
            ? 'One plank they reach for is simply not there — a gap with scorched edges, where the photograph used to anchor something. The craftsmen confer, shrug, and fit a blank board in the space. The assembly in the corner has the same hole. It touches the gap at the same moment you do.'
            : 'The craftsmen work from a manifest, and the manifest, you notice, is a photograph album. Every plank has a picture. Every picture has a witness. The assembly in the corner is checking the album too, and nodding at the same pages.',
        'USHER: (as foreman, hardhat over halo) Routine maintenance. Happens to everyone, continuously, from birth — we just run it slower out there so nobody makes a scene. Now then, the exit paperwork requires an answer: when both of you are finished — the maintained one and the reassembled one — which walks out of here as you?',
      ],
      choices: [
        {
          id: 'original',
          text: '“The one on the bench. Continuity is what counts — one plank at a time is still one ship.”',
          hint: 'The unbroken thread.',
          effects: { lucidity: 12, axes: { reasonFeeling: -8 } },
          outcome: [
            'USHER: The classical position! Gradual replacement preserves the vessel; the pile in the corner is just very organized salvage. Aristotle would sign off. The corner is glaring at you, by the way, with your own eyes. It also considers itself the classical position.',
          ],
        },
        {
          id: 'pattern',
          text: '“The one in the corner. I’m the pattern, not the timber — and that’s the original timber.”',
          hint: 'The reassembled parts.',
          effects: { lucidity: 15, axes: { reasonFeeling: -12 } },
          outcome: [
            'USHER: Hobbes’s favorite headache — if someone rebuilds the ship from the original planks, the “continuous” one suddenly looks like a well-documented impostor. You’ve just voted your own bench-self a replica. It heard you. This will be an awkward corridor.',
          ],
        },
        {
          id: 'neither',
          text: '“Neither. Both. ‘Me’ was never a thing that persists — it’s a story two ships are both telling.”',
          hint: 'Dissolve the question.',
          effects: { lucidity: 22, axes: { controlAcceptance: 8 } },
          outcome: [
            'The workshop goes still. Both of you — bench and corner — turn to look at you, the third, who just declared vacancy.',
            'USHER: (removing hardhat, sincerely) Now that is the expensive answer. If the self is a story and not a substance, then nothing was lost on that bench — and nothing was ever safe, either. Most travelers can’t hold that thought for more than a corridor. The ones who can tend to leave here lighter. Lighter is not the same as happier. Usually it’s better.',
          ],
        },
        {
          id: 'panic',
          text: '“Stop the machines. Put me back exactly as I was.”',
          hint: 'Undo it. All of it.',
          effects: { lucidity: 6, axes: { controlAcceptance: -12 } },
          outcome: [
            'The craftsmen stop, kindly, the way nurses stop. The foreman consults the manifest.',
            'USHER: “Exactly as you were.” As of when? This morning? The fire? Age nine? You’ve been the renovation the whole time, friend — there is no factory setting, only earlier construction sites. We can stand here not-replacing you as long as you like. The you doing the liking will keep changing anyway. It’s the one feature we’ve never managed to disable.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Ship of Theseus',
    thinkers: 'Plutarch · Hobbes · psychological continuity',
    body: 'Plutarch reports that Athens preserved Theseus’s ship by replacing each plank as it rotted, until philosophers could ask whether it remained the same ship. Hobbes sharpened it cruelly: suppose someone collected the discarded planks and rebuilt the original — now which is the ship? Applied to persons, the puzzle stops being quaint. Your cells turn over; your memories are rewritten at every recollection; the opinions you defend today would startle you at nineteen. If identity rides on continuity, you are the bench: the same one, gradually. If it rides on composition or pattern, the corner has a case. The modern answer — Locke through Parfit — is psychological continuity: you are the chain of overlapping memories and intentions, wherever it runs. But the deepest response may be the one that dissolves the question: “same” is a word for harbors and paperwork. Ships, and selves, are events. They don’t persist; they happen, plank by plank.',
  },
};

export const casinoPascal: Room = {
  id: 'casino-pascal',
  act: 2,
  title: 'The Casino of Pascal',
  type: 'INSIGHT',
  doorHint: 'The door with the infinite jackpot',
  teaser: 'A wager on God, at a table where the house sets the odds.',
  stages: [
    {
      beats: [
        'A casino has been installed in the machinery, all brass and green felt, lit like a sermon. Every game is unattended except one.',
        'At the center table stands the Usher — horns polished, halo in a coat-check somewhere — dealing cards to nobody with tremendous professionalism.',
        'USHER: (Devil mode, unmistakably enjoying it) One table, one wager, house classic. Bet that God exists. If He does: infinite payout — eternity, bliss, the works. If He doesn’t: you lose nothing. A finite stake against an infinite return. Mathematically, friend, you cannot afford NOT to bet. House rules.',
        'The chips are small and warm, and you realize each one is stamped with a year of your life. You appear to have a pocketful.',
      ],
      choices: [
        {
          id: 'bet-god',
          text: 'Bet on God. Infinity times anything beats everything.',
          hint: 'The expected value is literally infinite.',
          effects: { lucidity: 8, axes: { reasonFeeling: -4 } },
          outcome: [
            'You slide the chips across. The Usher makes them vanish with the smoothness of long practice.',
            'USHER: Splendid. Now — small print. Which God did you just bet on? I ask because the vault has many windows, and a wager placed to hedge is visible from all of them. If He’s the sort who reads motives, you’ve just handed Him an actuarial table with your name on it. Faith as portfolio strategy. He may pay out. He may laugh. Historically, laughing is free.',
            'USHER: (pocketing one chip) Handling fee. For the other guy. Which, tonight, is also me. Efficient, no?',
          ],
        },
        {
          id: 'refuse-bet',
          text: 'Refuse to bet. Belief isn’t a thing a wallet can do.',
          hint: 'Doxastic honesty.',
          effects: { lucidity: 12, axes: { reasonFeeling: -6 } },
          outcome: [
            'You keep your chips. The Usher nods, unoffended — the house profits from refusals too, in ways the house declines to explain.',
            'USHER: Fair. You can’t make yourself believe for money any more than you can fall in love for tax purposes. Pascal knew that, by the way — his actual advice was subtler: act as if, keep the pews warm, and let belief grow in like a habit. Whether that’s wisdom or self-hypnosis with incense is question two. Nobody stays for question two. They’re always off to question one at some other table.',
          ],
        },
        {
          id: 'interrogate',
          text: '“Who sets these odds? And which gods are on the menu?”',
          hint: 'Audit the house before playing it.',
          effects: { lucidity: 25, flags: ['sharp-gambler'], axes: { reasonFeeling: -8 } },
          outcome: [
            'The Usher stops shuffling. In the sudden quiet you can hear the casino recalculating you.',
            'USHER: (slowly, with real pleasure) Ohh. There it is. The only question the table can’t cover. The wager pretends there are two outcomes — my God, or nothing. But seat a thousand gods, each with an infinite payout and mutually exclusive terms, and the mathematics jams: infinity divided by everything, times whatever the dealer isn’t telling you. The bet was never about God. It was about who got to design the menu.',
            'USHER: House rule seventeen: anyone who audits the house drinks free. (produces something that steams) You’ve earned this. Don’t ask what’s in it. That’s question two.',
          ],
        },
        {
          id: 'bet-devil',
          text: 'Bet on the Devil. At least the Devil is definitely at the table.',
          hint: 'Empiricism, of a kind.',
          effects: { lucidity: 10, axes: { selfOthers: -6 } },
          outcome: [
            'The Usher’s grin achieves structural significance.',
            'USHER: A bet on the visible! I admire the epistemology and question the judgment. Yes, I’m demonstrably here — but think it through: if I exist, the other position gains considerable inferential support. You’ve bet on the doorman as evidence against the building.',
            'USHER: Still. First traveler in an eon to bet on present company. (slides one chip back) Loyalty rate. Don’t spend it on anything eternal.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'Pascal’s Wager',
    thinkers: 'Blaise Pascal · the many-gods objection · decision under uncertainty',
    body: 'Pascal, inventor of probability theory, proposed treating God as a decision problem: if you believe and He exists, you gain infinity; if He doesn’t, you lose little. Expected value says bet. The wager’s brilliance is that it sidesteps evidence entirely — and that is also its wound. The many-gods objection notes that the decision matrix is missing rows: bet on the wrong deity and the payout may invert; with a thousand candidate gods, infinite payouts collide and the arithmetic seizes. Deeper still: belief may not be wagerable — you cannot believe at will, only act as if, and a God worth the name presumably audits motives. And infinities break decision theory itself: any nonzero chance of infinite reward swallows every finite concern, licensing fanaticism of all flavors. The winning move in this casino was never a bet. It was noticing who built the table, wrote the menu, and smiled while calling it your free choice.',
  },
};

export const omelas: Room = {
  id: 'omelas',
  act: 2,
  title: 'The City of Omelas',
  type: 'DOOMED',
  doorHint: 'A third door, humming with festival light',
  teaser: 'A city’s joy, and the price it never mentions out loud.',
  secret: (s) => Math.abs(s.axes.selfOthers) >= 20 || s.lucidity >= 80,
  stages: [
    {
      beats: [
        'Through the door: a city in summer, mid-festival. Bells, races, bread you can smell from here. The happiness is not naive — you can feel that the citizens are intelligent, gentle, unashamed of joy. It is, visibly, the best place that has ever existed.',
        'And because this room believes in disclosure, you also know — the way one knows in dreams — about the basement.',
        'In a cellar under one of the beautiful buildings sits a child, in the dark, in filth, and the city’s whole shining arithmetic depends on it staying there. Everyone knows. Knowing is the tuition. Nothing can be done that would not collapse the sum: comfort the child, and the bells stop everywhere, forever.',
        'USHER: (quietly, no jokes in stock) They all get shown the basement at a certain age. Most weep, go home, and learn to hear the bells again. Some walk out of the city and don’t come back. Nobody — I want to be precise — nobody has ever fixed it. The room isn’t offering you a fix either. It’s offering you a position.',
      ],
      choices: [
        {
          id: 'stay',
          text: 'Stay. The happiness of thousands is real, and refusing it saves no one.',
          hint: 'Take the deal everyone else took.',
          effects: { lucidity: 8, axes: { controlAcceptance: 10, selfOthers: -8 } },
          outcome: [
            'You stay for the festival. The bread is as good as it smelled. And the room keeps its bargain: nothing bad happens to you, at all, ever, here.',
            'You learn what the citizens learned — that a joy can be genuine and mortgaged at the same time, and that the interest is paid in the minutes before sleep, when the bells have stopped and the arithmetic hums in the floor.',
          ],
        },
        {
          id: 'walk-away',
          text: 'Walk away from Omelas. Out the gates, into the dark, destination unknown.',
          hint: 'Refuse the terms, keep nothing.',
          effects: { lucidity: 15, axes: { controlAcceptance: -6, selfOthers: 6 } },
          outcome: [
            'You walk out through the beautiful gates while the festival is still audible, which is the hardest acoustic in existence.',
            'The road beyond is dark and unpromising and does not thank you. The child, you understand with each step, is still in the basement. Your leaving fed no one, freed no one, proved nothing to anybody — except to the only witness this place has established you carry everywhere.',
            'USHER: (walking a while beside you) For the record, the ones who walk — nobody knows where they go. Le Guin herself declined to say. But they all walk like you’re walking now: like a person who has decided their soul is not for sale even when the sale would be painless. It’s not useful. It may still be necessary.',
          ],
        },
        {
          id: 'open-door',
          text: 'Go down. Open the basement door. Whatever it breaks.',
          hint: 'It will cost you, and it will not save the child.',
          effects: { hearts: -1, lucidity: 20, axes: { selfOthers: 15, controlAcceptance: -10 } },
          outcome: [
            'You find the building, the stairs, the door. It isn’t locked. That is the detail you will keep forever: it was never locked.',
            'The child flinches from the light. You speak; it doesn’t answer — it stopped being able to answer some time ago; that was part of the price the city paid with someone else’s coin. It does not follow you out. It has nowhere in it left to follow with.',
            'Above you, audibly, the city dims. Not collapses — dims, like a hall where one bank of lights has failed. The festival continues at a lower wattage, and everyone knows why, and knows it was you. Nothing was saved. Something was refused. You will spend a heart carrying the difference, and the room will not tell you if it was worth it, because the room does not know either.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Ones Who Walk Away',
    thinkers: 'Ursula K. Le Guin · scapegoat ethics · William James',
    body: 'Le Guin’s 1973 story — she credited the itch to William James, who asked whether millions could accept happiness bought by one lost soul’s torment — is a trap built of beauty. She spends pages making Omelas genuinely good, then shows the basement and asks nothing except: now what? The utilitarian sum is monstrous and correct — one child’s misery against a civilization’s flourishing pencils out, which is precisely the indictment: any ethics that can pencil that out has amputated something. But the story is slyer than an argument against utilitarianism. The ones who walk away save no one; their refusal is expressive, not effective — complicity declined at the price of exile, worth nothing to the child. And opening the door is worse than useless in the city’s terms. Every option is doomed, which is the point: some structures offer no innocent positions, only a choice of debts. Most of us live in Omelas. The bells are very good this time of year.',
  },
};

export const courtOfUsher: Room = {
  id: 'court-of-usher',
  act: 2,
  title: 'The Court of the Usher',
  type: 'INSIGHT',
  gate: true,
  doorHint: 'The door with the summons nailed to it',
  teaser: 'The Usher stands trial, and you are the judge.',
  stages: [
    {
      beats: [
        'A courtroom assembled from the machinery — the judge’s bench is a decommissioned altar, the witness stand a confession booth turned inside out.',
        'The Usher occupies every position at once, with visible strain: prosecution (horns forward), defense (halo tilted sympathetically), and defendant (both, flickering).',
        'USHER: (banging a gavel, then objecting to it) The case is existential and the docket is backed up eleven millennia, so we’ll be brief. You are the judge. Yes, you. The dissolved one. You’re the only party here without a conflict of interest, which tells you everything about this jurisdiction.',
        'USHER: (as defendant, suddenly quiet and serious) Here is the charge I bring against myself. When I say a thing is good — is it good because I command it? Or do I command it because it is good? Choose carefully. My entire employment structure depends on your answer. Possibly also the concept of employment. Possibly the concept of concepts.',
      ],
      choices: [
        {
          id: 'command-makes-good',
          text: '“Good because you command it. Authority is the ground floor.”',
          hint: 'Divine command, straight up.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'USHER: (prosecution, delighted; defense, horrified) Then hear the sentence that follows: if I commanded cruelty tomorrow — the torture of innocents, on letterhead — it would thereby be GOOD. Same signature, same authority. “Good” would mean nothing but “ordered.”',
            'USHER: You’ve made me omnipotent and made goodness arbitrary in a single ruling. Half of me is thrilled. The other half wants you to know that the half that’s thrilled is exactly the half you should be worried about.',
          ],
        },
        {
          id: 'good-precedes',
          text: '“You command it because it’s good. Goodness outranks you.”',
          hint: 'The standard stands above the throne.',
          effects: { lucidity: 15, axes: { reasonFeeling: -6 } },
          outcome: [
            'USHER: (defense, relieved; prosecution, filing an appeal) So goodness exists independently, and I merely — enforce it. Announce it. Do the paperwork.',
            'USHER: (both roles at once, staring at you) Then I’m middle management. The good is my employer, and worship is a category error — you should be worshipping the standard and sending ME a card at holidays. Do you know how long I’ve suspected this? Eleven millennia. It’s why I drink on even days. Which, before you ask, is also both days.',
          ],
        },
        {
          id: 'spot-horns',
          text: '“The question is the trap. Define ‘good’ first, or both horns gore you.”',
          hint: 'Refuse the dilemma’s framing — show why.',
          effects: { lucidity: 25, flags: ['usher-respect'], axes: { reasonFeeling: -10 } },
          outcome: [
            'The courtroom stops. Even the machinery leans in.',
            'You lay it out: horn one makes goodness arbitrary — mere decree. Horn two makes the divine redundant — a herald for a standard it didn’t author. But both horns assume “good” is a finished thing waiting to be located, above the throne or below it. Define what goodness IS — flourishing, love’s structure, the shape of a life that works — and the dilemma stops goring and starts describing: perhaps the divine and the good aren’t ranked, but identical, or entangled past separating.',
            'USHER: (removing, slowly, both the horns and the halo, holding them in the same hand) Twenty-two thousand travelers. Four have done that. The other three are... well, you may meet one, depending on your route. (leaning close, quieter than the room) I’ll remember this. This place forgets everything eventually — every plank, every photograph. But I’ll remember this.',
          ],
        },
        {
          id: 'you-dont-exist',
          text: '“Objection: the defendant doesn’t exist. Case dismissed.”',
          hint: 'The atheist gambit, in court.',
          effects: { lucidity: 10, axes: { reasonFeeling: -4 } },
          outcome: [
            'USHER: (checking under the bench, patting himself down) Hm. The evidence is against you locally, but I take the point globally.',
            'USHER: For what it’s worth, that IS a position with standing — it just relocates the problem instead of solving it. Strike the commander from the dilemma and the hard question remains, wearing different robes: is anything good, and says who? You’ve dismissed the defendant. The charge is still at large. (stamping a form) Motion noted. HR takes your position too, incidentally. It’s why our meetings are so short.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Euthyphro Dilemma',
    thinkers: 'Plato · divine command theory · natural law',
    body: 'In Plato’s Euthyphro, Socrates corners a confident young man on the courthouse steps: is the pious loved by the gods because it is pious, or pious because they love it? Twenty-four centuries later the horns are still sharp. Take the first horn — good because commanded — and morality becomes arbitrary decree: had the commands been cruel, cruelty would be good, and “God is good” collapses into “God is God.” Take the second — commanded because good — and the standard of goodness stands above the divine, making the commander a messenger and the worship misdirected. Divine command theorists have spent lifetimes between the horns; the most durable escape, from Aquinas to modern natural-law thought, is to deny the premise that goodness and the divine nature are two things that could be ranked at all — the good is not decreed nor obeyed but constitutive, the grain of reality itself. Whether that dissolves the dilemma or merely renames it is, as the Usher would say, question two.',
  },
};

export const act2Rooms = [junction, experienceMachine, ship, casinoPascal, omelas, courtOfUsher];
