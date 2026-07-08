// Spec docs/design-limerence/02-rooms-act1.md — Act I: The Ground Floor
// (ages 15-18). Register: strictly non-explicit per the safety charter
// (docs/design-limerence/10-safety-education-charter.md) — emotional and
// digital dynamics only.
import type { Reflection, Room, RunState } from '../../../engine/schema';

/** Examined Path (spec 05) shorthand — a Reflection tuple in the fixed
 * consequence/duty/virtue/care order (shuffled per-display by the UI). */
const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

export const theReadReceipt: Room = {
  id: 'the-read-receipt',
  act: 1,
  title: 'The Read Receipt',
  type: 'INSIGHT',
  doorHint: 'the door that checks its phone',
  teaser: 'someone is awake at 1 a.m., reading one word: seen',
  stages: [
    {
      beats: [
        'Your bedroom, 1 a.m. The phone screen is the only light in the room, and it says Sara read your message three hours ago.',
        'seen · 22:04',
        'The typing indicator appears. Three dots, patient. Then it vanishes. It appears again a minute later. Vanishes again. You have watched this four times now, and you could not tell anyone what you are hoping the fifth will bring.',
        'You scroll back through everything you said today, reading each message for crimes. Was that joke too much. Was that silence too long. The evidence keeps changing owners depending on how you hold it.',
        'Porter: Every guest on this floor is certain the silence is about them. The silence is almost never about them.',
      ],
      choices: [
        {
          id: 'double-text',
          text: 'Spiral, and send two more messages.',
          hint: 'chase the silence',
          effects: { lucidity: 5, axes: { controlAcceptance: -8 } },
          outcome: [
            'Relief, for about four minutes.',
            'Then: two unanswered messages instead of one, and an arithmetic of anxiety that adds up exactly the way it always does.',
          ],
          reflections: reflect(
            'Two more messages don’t make an answer arrive sooner — they only make the silence, when it breaks, harder to read.',
            'You owe her patience, not a second summons.',
            'Notice what kind of partner panic turns you into, at 1 a.m., alone.',
            'She is somewhere with a reason of her own tonight — one that has nothing to do with the second message either.',
          ),
        },
        {
          id: 'drawer',
          text: 'Put the phone in a drawer. Sit with the feeling.',
          hint: 'meet the anxiety without feeding it',
          effects: { lucidity: 20, axes: { controlAcceptance: 8 } },
          outcome: [
            'The feeling, met head-on instead of managed, turns out to have a shape and — eventually — a bottom.',
            'Morning arrives. So does: "sorry, fell asleep ❤"',
          ],
          reflections: reflect(
            'The outcome was never in your hands tonight; sitting with that changed nothing about the morning, and everything about the night.',
            'No one was owed a message they hadn’t earned yet.',
            'This is the harder, quieter discipline — tolerating a feeling instead of discharging it onto someone else.',
            'You let her have an ordinary, unwatched evening, which is its own small gift.',
          ),
        },
        {
          id: 'bait',
          text: 'Test her with a bait story, to force a reply.',
          hint: 'engineer proof',
          effects: { lucidity: 8, axes: { controlAcceptance: -10 }, flags: ['first-test'] },
          outcome: [
            'It works. She replies within a minute.',
            'And you learn the only thing a test like this can ever teach you: that it works. Not what it cost.',
          ],
          reflections: reflect(
            'A reply obtained by manufactured urgency isn’t evidence of anything except that urgency gets replies.',
            'A relationship run on tests is one where honesty has quietly left the building.',
            'This is the first small rehearsal of a person who manages people instead of trusting them.',
            'She answered a fear, not a question you actually asked her.',
          ),
        },
        {
          id: 'ask-tomorrow',
          text: 'Ask her directly tomorrow, out loud, face to face.',
          hint: 'wait for daylight and a real answer',
          effects: { lucidity: 15, axes: { reasonFeeling: -6 } },
          outcome: [
            'Daylight makes the question small. Her answer — "my mum took the phone" — makes the whole architecture of last night visible, and slightly embarrassing.',
          ],
          reflections: reflect(
            'One conversation resolved what a dozen dots-watching sessions couldn’t.',
            'A direct question respects both of you more than a decoded silence does.',
            'Waiting for the real answer, instead of manufacturing one, is its own kind of courage.',
            'You let her explain herself in her own words, in daylight, without ambush.',
          ),
        },
      ],
      explanation:
        'Psychologists describe three broad attachment styles, learned early and carried into every later relationship: anxious (craves reassurance, reads silence as danger), avoidant (pulls back under closeness), and secure (trusts without needing constant proof). The read-receipt spiral is the anxious loop rendered in real time — a feeling that is completely real, attached to a story that is often just a first draft. None of the styles are a life sentence; "earned security" — learning a steadier way to read people — is real and is the quiet thesis of this whole hotel.',
    },
  ],
  fieldNote: {
    title: 'The Weather You Bring',
    thinkers: 'Bowlby · Ainsworth · Hazan & Shaver (1987)',
    body: 'Attachment theory began with Bowlby’s observation that infants develop working models of closeness — expectations about whether reaching out gets met — that Ainsworth later sorted into secure, anxious, and avoidant patterns. Hazan and Shaver showed the same patterns predicting adult romantic behavior decades later: the same weather system, indoors now, dressed as a read receipt. **The feeling that arrives at 1 a.m. is real; the story it tells about why she hasn’t answered is a draft, and drafts can be revised.** None of this is destiny — longitudinal work on "earned security" finds people visibly shift toward steadier patterns, usually through exactly the kind of relationship that survives a few honest, un-tested nights. The gate on the top floor will ask what you did with the weather.',
  },
};

export const theScreenshot: Room = {
  id: 'the-screenshot',
  act: 1,
  title: 'The Screenshot',
  type: 'DILEMMA',
  doorHint: 'the door you didn’t ask to open',
  teaser: 'proof arrives airdropped — now it lives in your pocket',
  stages: [
    {
      beats: [
        'An airdrop ping, mid-lesson. Screenshots: Tom — your best friend, Nadia’s boyfriend — running a second, flirt-heavy chat with a girl from another school.',
        'You read it twice. It doesn’t get better the second time.',
        'What the screenshots do and don’t prove, you tell yourself, cataloguing carefully. They prove enough.',
        'Why you? Across the room, the sender is watching your face for a reaction. This was never really about Tom.',
        'The group chat hums on, oblivious, three separate conversations about lunch.',
        'Porter: Evidence is never just information. It is a job offer. Note that you did not apply.',
      ],
      choices: [
        {
          id: 'tell-nadia',
          text: 'Show Nadia everything, today.',
          hint: 'tell the person it happened to',
          effects: { lucidity: 18, axes: { selfOthers: 8 }, flags: ['told-the-wronged'] },
          outcome: [
            'Her face does the thing faces do. Then the friendship-triage begins — who she can stand to see, who she can’t.',
            'Tom knows within the hour who told her. The fallout lands on you too, honestly, and the room does not pretend otherwise.',
          ],
          reflections: reflect(
            'Nadia now has the information she needs to act — whatever damage the truth does was always going to land eventually; you only chose when.',
            'She was owed this, plainly and without a vote.',
            'This is the harder loyalty — to the person being lied to, not the person you’ve known longer.',
            'You centered the person actually being hurt, not the two friendships that will survive worse for it.',
          ),
        },
        {
          id: 'confront-tom',
          text: 'Go to Tom first: "you tell her, or I do."',
          hint: 'give him the choice, on a deadline',
          effects: { lucidity: 15, axes: { reasonFeeling: -5 }, flags: ['ultimatum-given'] },
          outcome: [
            'Tom bargains, minimizes — "it’s just messages" — then begs.',
            'You learn that an ultimatum is a promise you must actually be ready to keep. The room makes you decide, on the spot, whether you do.',
          ],
          reflections: reflect(
            'Giving Tom the choice first changes only who does the telling, not whether Nadia eventually learns.',
            'You gave your friend a chance to make it right himself before you took the decision from him.',
            'An ultimatum only has integrity if you would actually follow through — ask yourself, honestly, if you would.',
            'You tried to protect two relationships at once, and it costs you a harder conversation for the attempt.',
          ),
        },
        {
          id: 'stay-out',
          text: '"Not my relationship." Delete it.',
          hint: 'stay out of it entirely',
          effects: { lucidity: 6, axes: { selfOthers: -8 }, flags: ['held-the-secret'] },
          outcome: [
            'The secret doesn’t delete. It moves in with you.',
            'Every group hangout has a wall in it now, and you built it — around yourself.',
          ],
          reflections: reflect(
            'Staying out doesn’t remove you from the outcome; it just removes you from influencing which outcome happens.',
            'Silence, here, is also a choice with a recipient — Nadia just doesn’t know she made it for her.',
            'Ask what kind of friend "not my business" makes you, to the friend actually being deceived.',
            'You spared yourself a hard conversation at the cost of one someone else deserved to have.',
          ),
        },
        {
          id: 'verify-first',
          text: 'Quietly verify the screenshots are real before anything.',
          hint: 'be certain before you act',
          effects: { lucidity: 12, axes: { reasonFeeling: -8 } },
          outcome: [
            'They’re real. And while you were checking, three more people got the same airdrop.',
            'Thoroughness spent the only currency that mattered here: being first, or being silent.',
          ],
          reflections: reflect(
            'Verifying reduced the risk of acting on something false, at the real cost of acting later than you could have.',
            'Diligence is a virtue, but not one that excuses the delay to the person still in the dark.',
            'Carefulness can be its own kind of avoidance, dressed as responsibility.',
            'The extra hour cost Nadia nothing she didn’t already not-know — but it cost you the choice of controlling how she found out.',
          ),
        },
      ],
      explanation:
        '"Should I tell my friend that their partner is being unfaithful?" is the everyday version of the trolley problem: every option moves the harm somewhere, and doing nothing is itself a choice with a direction. Research on bystander behavior shows responsibility diffusing the moment more than one person could act — "someone else will" is what a room full of people all think at once. Staying out isn’t neutral; it’s a vote, cast quietly, for the status quo.',
    },
  ],
  fieldNote: {
    title: 'Walls, Windows, and Bystanders',
    thinkers: 'Shirley Glass · Darley & Latané',
    body: 'Shirley Glass described intimacy as a matter of architecture — where the windows face, where the walls stand. A secret kept "for someone’s own good" is a wall built inside a friendship, even when the friendship itself looks intact from outside. **Every option in that classroom moves the harm somewhere; "staying out" is a wall too, and you are the one who has to live behind it.** Darley and Latané’s bystander research — first observed watching strangers not-call for help — applies just as cleanly to a group chat: responsibility diffuses the instant more than one person could act, until it belongs to no one at all. Another hotel, another wall, the same two researchers — some findings follow you between buildings.',
  },
};

export const thePassword: Room = {
  id: 'the-password',
  act: 1,
  title: 'The Password',
  type: 'DILEMMA',
  doorHint: 'the door with two locks',
  teaser: 'proof of love, four to six digits',
  stages: [
    {
      beats: [
        'Sara, crying, after a bad week: her last boyfriend cheated, and if you loved her, you’d give her your phone password.',
        'It is framed — sincerely, from inside her fear — as intimacy. Part of you feels the pull of that framing; wanting to give it does not make you foolish.',
        'And part of you registers, underneath the wanting, something that sounds exactly like a lock turning.',
        '"What do you have to hide?" she asks, and the question is built so that any answer sounds like a confession.',
        'Porter: A key given under a deadline opens a different door than a key given freely. Same metal. Different room.',
      ],
      choices: [
        {
          id: 'give-it',
          text: 'Give her the password.',
          hint: 'close the distance she’s asking you to close',
          effects: { lucidity: 5, axes: { selfOthers: 8, controlAcceptance: -6 }, flags: ['gave-the-key'] },
          outcome: [
            'The room rewards it, honestly, short-term: she softens, the week heals.',
            'A month later you catch yourself pre-editing texts to friends before you send them. The surveillance is in your thumbs now, and no one asked you to install it.',
          ],
          reflections: reflect(
            'The immediate outcome — a calmer week — is real; the longer one, a habit of self-censorship, is real too, and the room shows you both.',
            'A key given out of fear rather than freedom was never really consented to by the part of you that hesitated.',
            'Notice who you become when every message is written with a silent reader in mind.',
            'You closed the distance she asked for, but the way you closed it built a different distance in its place.',
          ),
        },
        {
          id: 'refuse-flat',
          text: 'No. Just no.',
          hint: 'hold the line',
          effects: { lucidity: 12, axes: { selfOthers: -8 } },
          outcome: [
            'The fight that follows is real, and it costs a beat of the relationship.',
            'The room does not pretend boundaries are free. It only insists they’re load-bearing.',
          ],
          reflections: reflect(
            'A boundary held costs something now and something worse later avoided — the room prices both honestly.',
            'You owed her care, not access.',
            'This is the harder, less comfortable integrity — the one that risks the relationship to keep the self.',
            'A flat no, offered without contempt, still leaves room for her fear to be addressed some other way.',
          ),
        },
        {
          id: 'transparency-not-surveillance',
          text: '"Ask me anything, any time. The lock stays."',
          hint: 'offer openness without handing over the key',
          effects: { lucidity: 22, axes: { controlAcceptance: 8 } },
          outcome: [
            'The distinction lands slowly, not in the room but over the following weeks.',
            'The best available door, and still not painless — trust gets rebuilt by hand here, not by keys.',
          ],
          reflections: reflect(
            'Answering any question, honestly, produces the same reassurance a password would — without the standing cost.',
            'You offered exactly what was owed: openness. Not exactly what was asked: access.',
            'This is the steadier, less dramatic form of trustworthiness — available, not surveilled.',
            'You met her fear with your presence instead of your privacy.',
          ),
        },
        {
          id: 'demand-hers',
          text: '"Fine — yours too, then."',
          hint: 'match the request instead of resolving it',
          effects: { lucidity: 8, axes: { controlAcceptance: -10 }, flags: ['symmetry-trap'] },
          outcome: [
            'Mutually assured surveillance: two people reading each other’s mail in adjacent rooms.',
            'The room lets the silence of that arrangement speak for itself.',
          ],
          reflections: reflect(
            'Symmetry doesn’t cancel the cost of surveillance; it just distributes it to both of you.',
            'Matching a bad request isn’t the same as refusing one.',
            'Ask what kind of relationship this becomes when both locks come off, at once, out of spite dressed as fairness.',
            'Neither of you is actually reassured by this — you’ve only made the fear mutual.',
          ),
        },
      ],
      explanation:
        'Requests to "prove" love through monitoring escalate for a simple reason: checking someone’s phone relieves anxiety immediately, which teaches the anxious mind to keep asking. This is a well-documented reassurance-seeking loop — relief now, worse fear later, repeat. The useful distinction isn’t about how much you love someone; it’s between transparency, which is offered, and surveillance, which is extracted. One early warning sign of controlling behavior is exactly this: care that arrives with a deadline attached.',
    },
  ],
  fieldNote: {
    title: 'The Key Under Duress',
    thinkers: 'coercive-control research · reassurance-seeking studies',
    body: 'Monitoring soothes the monitor for a few hours and corrodes both people over months — this is the well-replicated shape of a reassurance-seeking loop, and it explains why "proving" trust through access rarely stays a one-time gesture. **Control’s early costume is almost always care; the reliable tell isn’t the request itself but what happens the moment you say no.** Clinical work on coercive control names surveillance as one of its earliest, most easily-excused forms — precisely because it borrows love’s language. None of this means the fear behind the request is fake; it means the fear deserves a better answer than a key. Locks are honest. Deadlines aren’t.',
  },
};

export const theParty: Room = {
  id: 'the-party',
  act: 1,
  title: 'The Party',
  type: 'DILEMMA',
  doorHint: 'the door with music behind it',
  teaser: 'somebody’s parents are away — somebody’s girlfriend is too',
  stages: [
    {
      beats: [
        'Sara is visiting her grandmother this weekend. The party plays a kissing dare, and the bottle — spun in real time, everyone counting the rotations out loud — lands on you, and on Klara, from the parallel class.',
        'The rationalizations arrive one at a time, each perfectly reasonable on its own: it’s just a game. She’d laugh if she saw it framed right. Everyone’s watching, which somehow makes it less real, not more.',
        'It doesn’t count — you can feel that sentence being built, piece by piece, before you’ve decided anything at all.',
        'A room of raised phones. Everything here is recorded; that’s just the physics of a Ground Floor party.',
        'Klara shrugs, kind and entirely unbothered — this means nothing to her either way, which somehow makes the moment feel both smaller and larger at once.',
        'Porter: "It just happened" is assembled in advance, piece by piece. You are watching the assembly line now.',
      ],
      choices: [
        {
          id: 'play-and-bury',
          text: 'Play the dare. Tell no one.',
          hint: 'let it be nothing, quietly',
          effects: { lucidity: 5, flags: ['it-didnt-count'] },
          outcome: [
            'The kiss is nothing. The burying is something.',
            'The phones were up. Somewhere, in someone’s pocket, a screen lights up, unsent — for now.',
          ],
          reflections: reflect(
            'Nothing visible changes tonight, but the odds this stays buried were never fully in your hands.',
            'A secret kept from Sara is still a decision made about her, without her.',
            'Notice the sentence you’re rehearsing right now — "it didn’t count" — and what kind of person finds that sentence convincing.',
            'You protected your own comfort tonight at a cost that, if it surfaces, lands entirely on her.',
          ),
        },
        {
          id: 'play-and-tell',
          text: 'Play it. Tell Sara yourself, tonight.',
          hint: 'let her hear it from you first',
          effects: { lucidity: 18, axes: { reasonFeeling: 6 } },
          outcome: [
            'Her reaction is hers — hurt, then oddly settled by having been told first.',
            'The telling costs less than the finding-out would have. The room shows you the difference, honestly, side by side.',
          ],
          reflections: reflect(
            'Telling her doesn’t undo the kiss, but it changes what she has to process — the act, not the betrayal of secrecy on top of it.',
            'She was owed the truth, and you delivered it before it was extracted from you.',
            'This is costly honesty, chosen while it was still avoidable.',
            'You gave her the dignity of hearing it from you, not from a screenshot weeks later.',
          ),
        },
        {
          id: 'refuse',
          text: 'Refuse the dare. Absorb the mockery.',
          hint: 'sit through thirty seconds of being laughed at',
          effects: { lucidity: 15, axes: { selfOthers: -4 }, flags: ['refused-the-dare'] },
          outcome: [
            'Thirty seconds of jeering that feels, from inside it, like an hour.',
            'Then the party moves on, because parties do. Someone you didn’t notice, noticed.',
          ],
          reflections: reflect(
            'Refusing costs a little social standing tonight and nothing at all tomorrow.',
            'You kept a promise that wasn’t explicitly asked for but was clearly owed.',
            'This is character showing up exactly when it’s least convenient and least witnessed by the person it’s for.',
            'Klara’s comfort was never actually at stake here either way — but Sara’s trust, absent, was.',
          ),
        },
        {
          id: 'leave',
          text: 'Just leave the party.',
          hint: 'remove yourself from the assembly line',
          effects: { lucidity: 10, axes: { controlAcceptance: 4 } },
          outcome: [
            'The cold air outside, as a full, unhurried beat.',
            'Nothing happened — and you learn that "nothing happened" can be a thing you did, rather than a thing you merely avoided.',
          ],
          reflections: reflect(
            'Leaving removes every possible outcome of the dare at once, cleanly, before any of them could occur.',
            'You owed no explanation for declining to be in a room built for this exact test.',
            'Sometimes the more honest move is not to trust yourself with the choice at all.',
            'You spared everyone — Klara, Sara, yourself — a scene that didn’t need to exist.',
          ),
        },
      ],
      explanation:
        'Psychologist Albert Bandura studied how the mind pre-writes its own excuses before an act, not after — a set of "moral disengagement" mechanisms (calling it a game, comparing it to worse things, spreading responsibility across a whole room) that make a choice feel smaller than it is, in advance. Alcohol lowers this further through "myopia": whatever is directly in front of you gets louder, and consequences further off get quieter. Neither of these facts excuses anything — they explain why "it was just a game" works on almost everyone except the person it happened to.',
    },
  ],
  fieldNote: {
    title: 'The Assembly of "It Just Happened"',
    thinkers: 'Bandura · Steele & Josephs',
    body: 'Bandura named the specific mental moves people make to act against their own values without feeling like they have: euphemistic labeling ("it’s just a game"), diffusion of responsibility ("everyone’s doing it"), and advantageous comparison ("it’s not like I—"). None of these happen after the act, as cleanup; **they are assembled beforehand, piece by piece, and "it just happened" is the finished product of a process that had a great many decision points along the way.** Steele and Josephs’ alcohol myopia research adds the dimmer switch: intoxication doesn’t remove judgment so much as narrow its field of view to whatever’s loudest in the room. No one at this hotel ever meant to check in.',
  },
};

export const theForward: Room = {
  id: 'the-forward',
  act: 1,
  title: 'The Forward',
  type: 'DILEMMA',
  doorHint: 'the door that is already open',
  teaser: 'it arrived in the group chat forty seconds ago — forty people',
  stages: [
    {
      beats: [
        'A ping in the class group chat. A photo that was never meant for this chat, forwarded by someone Ema trusted.',
        'The chat is doing what chats do: jokes, screenshots-of-screenshots, three people typing at once. Your thumb hovers over the keyboard, deciding nothing yet.',
        'The laughter scrolls past in real time — a dozen messages in the time it takes you to read three of them.',
        'Ema is in your maths class. She doesn’t know yet. You keep thinking about second period.',
        'Porter: Everyone in that chat is telling themselves they are only an audience. Audiences are how this works.',
      ],
      choices: [
        {
          id: 'delete-only',
          text: 'Delete it. Say nothing.',
          hint: 'remove yourself, quietly',
          effects: { lucidity: 8, axes: { selfOthers: -4 } },
          outcome: [
            'Your hands are clean, and nothing else is.',
            'The chat scrolls on. Somewhere, the room is quietly counting the other thirty-nine audiences who didn’t delete anything.',
          ],
          reflections: reflect(
            'Deleting your own copy changes nothing about the thirty-nine other copies still moving.',
            'Silence discharges your own participation but not your knowledge of what’s still happening to her.',
            'Ask what kind of bystander "at least I didn’t forward it" actually makes you.',
            'Ema still finds out from someone else, without warning, without you having done the one thing that would have helped.',
          ),
        },
        {
          id: 'report',
          text: 'Report it — to the platform, and to an adult at school.',
          hint: 'get someone with authority involved',
          effects: { lucidity: 20, axes: { reasonFeeling: -6 }, flags: ['reported-it'] },
          outcome: [
            'Adults move slower than chats and faster than nothing. Consequences arrive, eventually, for the sender.',
            'The chat calls you a name for a week. The room lets that cost be real, and lets it be worth it anyway.',
          ],
          reflections: reflect(
            'Reporting is the one path with a real chance of stopping further spread, at a real personal cost to you.',
            'This is precisely the kind of action the law and the school both exist to make possible.',
            'This is the unglamorous, unpopular form of courage — the one that gets you called a name for a week.',
            'It is the version of help that actually reaches Ema, not just the version that feels clean to you.',
          ),
        },
        {
          id: 'tell-ema-first',
          text: 'Message Ema first, so she isn’t the last to know.',
          hint: 'give her the warning nobody else will',
          effects: { lucidity: 22, axes: { reasonFeeling: 8, selfOthers: 6 }, flags: ['told-her-first'] },
          outcome: [
            'The hardest message you have ever typed. Her reply is two words.',
            'Years later — a flash-forward the Ground Floor rarely allows itself — she still remembers who told her. The room’s rare, unambiguous kindness. Still not painless.',
          ],
          reflections: reflect(
            'Warning her first changes what she has to face — informed, rather than ambushed by her own hallway.',
            'She was owed the truth before the crowd got a head start on her reaction to it.',
            'This is the choice that costs you the most in the room and asks for nothing in return.',
            'Of everything on offer tonight, this is the version built entirely around what she needs, not what’s easiest for you.',
          ),
        },
        {
          id: 'confront-publicly',
          text: 'Call the sender out, in the chat itself.',
          hint: 'make it visible',
          effects: { lucidity: 12, axes: { controlAcceptance: -4 } },
          outcome: [
            'The chat turns on him. Then on the drama itself. Then — the room is honest here — partly back on Ema.',
            'Public confrontation is a blunt instrument. It hits several people, not always the ones you aimed at.',
          ],
          reflections: reflect(
            'Public confrontation may slow the sharing, but it also multiplies attention on the very thing you’re trying to stop.',
            'Calling out wrongdoing is owed to the situation — but the method matters as much as the intent.',
            'This is righteous anger doing something, which is not automatically the same as doing the right thing.',
            'The most vulnerable person in this story doesn’t get a say in how visibly her situation gets handled.',
          ),
        },
      ],
      explanation:
        'Consent to be photographed, filmed, or recorded doesn’t transfer with the file — every forward is its own new act, not a continuation of someone else’s. In most jurisdictions, sharing intimate images without consent is a serious crime, and that applies to every person who forwards it, not only the first sender. What actually helps the person in the photo is well-documented and unglamorous: being told directly, being believed without question, and adults who act quickly.',
    },
  ],
  fieldNote: {
    title: 'The Fortieth Audience',
    thinkers: 'non-consensual image-sharing research · the legal reality',
    body: 'This is the one field note in the hotel allowed to be blunt about law: in most jurisdictions, forwarding an intimate image without the subject’s consent is a serious criminal act — for every person who forwards it, not only whoever sent it first. Harm research on image-based abuse finds the injury compounds with each additional viewer; **the damage isn’t the original photo, it is the audience, and the audience is still growing every time someone taps forward.** Bystander-to-upstander research is consistent on what actually helps: direct, early warning to the person affected, and adults who intervene quickly rather than quietly. The original sender pressed one button. So did everyone after.',
  },
};

export const theBestFriendsGirl: Room = {
  id: 'the-best-friends-girl',
  act: 1,
  title: 'The Best Friend’s Girl',
  type: 'NO-SOLUTION',
  doorHint: 'the door you keep walking past',
  teaser: 'she laughs at your jokes a half-second too long — you’ve started counting',
  stages: [
    {
      beats: [
        'An ordinary study evening at Tom’s. Nadia is on the floor with her homework, half-listening. This should not be a complicated room.',
        (s: RunState) =>
          s.axes.controlAcceptance < 0
            ? '[the half-second laugh, replayed — you have counted it eleven times now, and the number keeps you awake]'
            : '[the half-second laugh, replayed — you notice you are counting, and notice the noticing]',
        'The loyal inventory arrives next: everything Tom has been to you, every favor, every 2 a.m. phone call, laid out like evidence for a case you didn’t know you were building.',
        '[the bus stop, last Tuesday — her sleeve brushing yours, entirely by accident, replayed anyway, on a loop with no off switch]',
        'The arithmetic of signs: was that a look, or a glance that happened to land on you. The room lets you do the math and then, honestly, marks your work — the math is unreliable, and you are doing it anyway.',
        'Porter: The state you are in has a clinical name, a documented arc, and no steering wheel. Conduct, however, still has one.',
      ],
      choices: [
        {
          id: 'confess-to-her',
          text: 'Tell Nadia.',
          hint: 'say it to the person it’s about',
          effects: { lucidity: 10, axes: { reasonFeeling: 8 }, flags: ['crossed-the-line'] },
          outcome: [
            'Whatever she feels — the room keeps it honestly ambiguous, a half-second is not a contract — the constellation now has a crack through it.',
            'Tom’s next "you okay?" lands like a bell you can’t unhear.',
          ],
          reflections: reflect(
            'Telling her risks a friendship and a relationship for information you didn’t strictly need to have.',
            'She had a right to know what was happening in a room she was sitting in.',
            'This is honesty that serves your own clarity as much as it serves her — worth noticing which one you led with.',
            'Consider what this confession actually costs Nadia, versus what it relieves in you.',
          ),
        },
        {
          id: 'starve-it',
          text: 'Distance. No drama, no explanation.',
          hint: 'let it starve, quietly',
          effects: { lucidity: 18, axes: { controlAcceptance: 6 } },
          outcome: [
            'Limerence starved is limerence loud, for a while — the intrusions get worse before they get better.',
            'Then, over weeks, they fade. The honest cost of the honest option.',
          ],
          reflections: reflect(
            'Distance resolves nothing for anyone else, but it reliably resolves the state in you, eventually.',
            'You owe no one a confession of a feeling you never acted on.',
            'This is quiet self-management — unglamorous, unwitnessed, and it works.',
            'No one else in the room ever has to carry the weight of a feeling that was never theirs to carry.',
          ),
        },
        {
          id: 'tell-tom',
          text: 'Tell Tom the truth of the feeling.',
          hint: 'trust your friend with it',
          effects: { lucidity: 22, axes: { selfOthers: -4 } },
          outcome: [
            'The bravest sentence on this floor. Tom’s silence, then: "okay. thanks for telling me and not her."',
            'The friendship survives, changed — a wall replaced by a window, at the price of some comfort.',
          ],
          reflections: reflect(
            'Telling Tom, rather than acting on it or telling Nadia, contains the harm to the one relationship built to hold it.',
            'This is the loyalty a real friendship is for — the uncomfortable disclosure, offered rather than discovered.',
            'This took more nerve than either silence or confession to Nadia — worth noticing that about yourself.',
            'You protected Nadia from a feeling that was never about anything she did, by routing it to the one person equipped to hear it.',
          ),
        },
        {
          id: 'test-the-evening',
          text: 'Engineer one ambiguous evening to find out.',
          hint: 'manufacture your own answer',
          effects: { lucidity: 8, axes: { controlAcceptance: -8 }, flags: ['ran-the-test'] },
          outcome: [
            'Ambiguity engineered returns ambiguity, compounded.',
            'Now there are two people counting half-seconds. The room declines to say which of you started it.',
          ],
          reflections: reflect(
            'A manufactured test doesn’t produce real information — it produces a new, harder-to-read situation for everyone involved.',
            'This risked Tom and Nadia’s relationship for your own uncertainty, without their knowledge or consent.',
            'This is the version of you that manages people instead of trusting them or leaving them alone.',
            'Nadia becomes an instrument of your curiosity here, which is not a small thing to have done to her.',
          ),
        },
      ],
      explanation:
        'Limerence is an involuntary state — you don’t choose to have it any more than you choose a fever — but what you do next is still entirely a choice. Sign-reading (was that a look, was that a laugh) feels like gathering evidence and is usually closer to writing fiction; the mind in limerence is extremely good at finding confirmation for what it already wants to believe. The useful line to hold onto: the feeling is not yours to be ashamed of. The conduct is yours to answer for.',
    },
  ],
  fieldNote: {
    title: 'The State With No Steering Wheel',
    thinkers: 'Tennov · Schmitt & Buss',
    body: 'Tennov’s original research mapped limerence’s arc precisely: onset, crystallization, and — untended — decay, typically within six months to two years. It is not a metaphor for a crush; it is a documented psychological state with intrusive cognition as a core, measurable symptom. Mate-poaching research (Schmitt & Buss) studied exactly this triangle from all three corners — the one drawn to a partnered person, the partnered person, and the one who doesn’t yet know — and found real costs land on all three, regardless of what happens next. **Feelings, here, are weather; you didn’t choose the front moving through, but you are still the one holding the umbrella, or not.** Every guest who ever burned a friendship down swore the laugh was a signal.',
  },
};

export const theSummerEnds: Room = {
  id: 'the-summer-ends',
  act: 1,
  title: 'The Summer Ends',
  type: 'DILEMMA',
  doorHint: 'the door with a suitcase beside it',
  teaser: 'two cities, one calendar, and everyone has an opinion',
  stages: [
    {
      beats: [
        'University in another city starts in three weeks. The packing happens itemized, almost ceremonial — what goes in the box is the relationship’s museum, curated by hand.',
        'Everyone has an opinion, and everyone offers it unasked: your mother, her sister, the group chat, a stranger at a party who dated someone long-distance in 2003.',
        'Underneath the logistics is the actual question, unasked for three weeks running: what does September mean, exactly, for the two of you.',
        (s: RunState) =>
          s.flags.includes('gave-the-key')
            ? 'You remember the password, the month it took to stop pre-editing texts. Whatever you promise now, you already know what it costs to promise something out of fear instead of certainty.'
            : s.flags.includes('it-didnt-count')
              ? 'You remember the party — the sentence you built and never told her. Whatever you promise now, some of the year’s weight rides along, whether or not she knows it.'
              : 'What you each said you wanted, once, at the very start of the year, feels both closer and further away than three weeks.',
        'Porter: Guests decide this one in the corridor, mostly. The room only makes them say it out loud.',
      ],
      choices: [
        {
          id: 'promise-ldr',
          text: 'Promise the long-distance everyone says will fail.',
          hint: 'commit across the distance',
          effects: { lucidity: 12, axes: { reasonFeeling: 8, selfOthers: 6 }, flags: ['promised-september'] },
          outcome: [
            'The promise is real, and so are base rates. The room refuses to spoil which you’ll turn out to be.',
          ],
        },
        {
          id: 'end-clean',
          text: 'End it now, on the best day rather than the worst.',
          hint: 'choose the ending instead of waiting for one',
          effects: { lucidity: 20, axes: { reasonFeeling: -8 } },
          outcome: [
            'The strange dignity of a chosen ending. Grief without a villain.',
            'The room notes, quietly, that "on time" is a place almost nobody manages to leave from.',
          ],
        },
        {
          id: 'drift',
          text: 'Promise nothing. Let it fade.',
          hint: 'avoid the conversation entirely',
          effects: { lucidity: 4, axes: { controlAcceptance: -4, selfOthers: -4 }, flags: ['let-it-drift'] },
          outcome: [
            'The coward’s route, honestly costed: no scene, no ending.',
            'Eighteen months later, no word for what you were. The unfinished sentence follows you.',
          ],
        },
        {
          id: 'open-until-christmas',
          text: 'Propose an arrangement neither of you understands yet.',
          hint: '"open," undefined',
          effects: { lucidity: 10, axes: { controlAcceptance: 6 }, flags: ['first-open'] },
          outcome: [
            'The word "open" does more work than either of you can lift at eighteen.',
            'The terms go undefined tonight — and get revisited, painfully, before the year is out.',
          ],
        },
      ],
      explanation:
        'Rusbult’s investment model reduces "why do people stay or leave" to three plain ingredients: satisfaction (how good it feels), investment (how much you’ve put in — time, memories, plans), and alternatives (what else, or who else, seems available). Relationships often continue or end for reasons that have very little to do with how much love is present — a well-invested, moderately-satisfying relationship can outlast a blissful, low-investment one. None of the four doors here is "correct"; the model only explains why each one is a real, coherent choice, not a moral failure.',
    },
  ],
  fieldNote: {
    title: 'The Arithmetic of Staying',
    thinkers: 'Caryl Rusbult',
    body: 'Rusbult’s investment model puts a deceptively simple equation under commitment: satisfaction plus investment minus alternatives. It has held up remarkably well across decades of study, and its most uncomfortable implication is this — **people stay in relationships, and leave them, for reasons that often have nothing to do with whether love is present.** A heavily-invested relationship can survive years past its satisfaction; a barely-invested one can end the moment something better appears, regardless of how it felt. This is the model’s first real appearance in the hotel; Act III’s wedding-eve room harvests it fully, once the investment has had a decade to compound. The suitcase was packed either way. Only the label changed.',
  },
};

export const theRumor: Room = {
  id: 'the-rumor',
  act: 1,
  gate: true,
  title: 'The Rumor',
  type: 'DOOMED',
  doorHint: 'the door everyone else already opened',
  teaser: 'the whole school knows something — nobody knows what',
  stages: [
    {
      beats: [
        'The school says Sara cheated at the lake weekend. The evidence: one blurry story, two friends-of-friends, and her odd quietness since Sunday.',
        'You itemize what you actually know, and then — the room insists on this too — what you don’t. Both lists are shorter than the rumor.',
        'What the not-knowing is doing to you, hour by hour, is its own small case study, and you are both the subject and the only witness.',
        'Her text sits unanswered on your screen: "what’s wrong?" You have read it eleven times and answered it zero.',
        'Three shapes present themselves, and none of them is comfortable: ask her plainly, ask around her carefully, or set a snare and see what walks into it.',
        'Porter: There are tests that measure a thing, and tests that create it. The desk has stopped stocking the first kind. Guests never asked for them.',
      ],
      choices: [
        {
          id: 'trust-without-asking',
          text: 'Extend the benefit of the doubt whole. Never ask.',
          hint: 'choose not to know',
          effects: { lucidity: 15, axes: { controlAcceptance: 10 } },
          outcome: [
            'You live with never knowing — permanently. No later room resolves this; none ever will.',
            'Trust, treated as a decision rather than a conclusion, turns out to be heavier than it sounds. The room weighs it honestly, and does not pretend the weight is small.',
          ],
          reflections: reflect(
            'You forgo certainty entirely; whatever actually happened at the lake changes nothing about how you now choose to treat her.',
            'She is owed the presumption of innocence a rumor alone can never overturn.',
            'This is trust as a practiced discipline, not a comfortable feeling — the harder version of the virtue.',
            'You spared her an interrogation she may not have deserved, at the cost of a doubt you now carry alone, indefinitely.',
          ),
        },
        {
          id: 'interrogate',
          text: 'Ask her everything. Dates, names, specifics.',
          hint: 'demand the full account',
          effects: { lucidity: 18, hearts: -1, axes: { controlAcceptance: -8 } },
          outcome: [
            'Answers arrive, and so does the damage — the questions themselves inform her, precisely, what you think she is.',
            'Whatever the truth turns out to be, the relationship now contains the interrogation forever, as a permanent fixture.',
          ],
          reflections: reflect(
            'You gained information at a fixed, real cost to the relationship’s trust — the room prices this exchange plainly.',
            'An interrogation treats the accused as guilty until proven otherwise, which is not what she was owed.',
            'Notice the kind of partner a rumor alone was able to turn you into, for one evening.',
            'The questions land on her as an accusation regardless of your intent, and she has to carry that too.',
          ),
        },
        {
          id: 'set-the-trap',
          text: 'Tell her a fake detail — one only a guilty person would correct.',
          hint: 'set a snare and watch it',
          effects: { lucidity: 20, loseMemory: true, flags: ['set-the-trap'] },
          outcome: [
            'The trap works. The room lets it work.',
            'The knowledge arrives in the same envelope as this: you are now someone who traps people you love. Both facts are permanent. The final gate reads this back to you, verbatim.',
          ],
          reflections: reflect(
            'The trap may produce a true answer, but it does so by manufacturing the very test it then claims to merely observe.',
            'Deception, even in service of a fair question, is not a fair method — you owed her a direct question, not a snare.',
            'This is the room’s sharpest mirror: the trap tells you exactly as much about yourself as about her.',
            'Whatever it reveals about her, it reveals for certain that you were willing to deceive someone you love to get it.',
          ),
        },
        {
          id: 'ask-the-accuser',
          text: 'Go to the source: "what do you get out of this?"',
          hint: 'question the rumor’s engine, not her',
          effects: { lucidity: 25, axes: { reasonFeeling: -6 } },
          outcome: [
            'The rare third door. The rumor’s actual engine gets exposed — a grudge, a bored weekend, a misread photograph.',
            'Not vindication, exactly, but a discovery with a longer half-life: the question "is it true?" had an older sibling all along — "who benefits?"',
          ],
          reflections: reflect(
            'Tracing the rumor to its source resolves the actual claim without costing Sara a single moment of suspicion.',
            'This directs scrutiny at the party actually making the accusation, which is where it was owed from the start.',
            'This is intellectual courage applied where it’s least comfortable — toward the story’s author, not its subject.',
            'Sara never has to know she was under suspicion at all — the doubt gets resolved without ever touching her.',
          ),
        },
      ],
      explanation:
        'Confirmation bias means the mind, once suspicious, gets very good at finding evidence for the suspicion and very bad at noticing evidence against it — psychologist Raymond Nickerson documented this as one of the most robust findings in the field. The "Othello test" describes a related trap: the very act of testing someone for guilt can produce behavior that looks exactly like guilt, whether or not any exists — named for the way Othello’s suspicion manufactures the evidence that destroys him. "Benefit of the doubt" is not free; it costs the certainty you’d get by asking, and buys the relationship the chance to survive not-knowing.',
    },
  ],
  fieldNote: {
    title: 'The Test That Creates Its Result',
    thinkers: 'Nickerson · Othello',
    body: 'Nickerson’s survey of confirmation-bias research is unambiguous: once a belief is in place, the mind recruits evidence for it far more readily than evidence against it — suspicion is self-feeding by default, not by exception. The Othello dynamic sharpens the trap: a test designed to detect guilt can manufacture behavior indistinguishable from it, in one of you or the other, and the test cannot tell you which. **Certainty about a partner, purchased through surveillance or entrapment, is paid for in a currency that debases the very relationship it claims to protect.** Of the guests who set the trap, every single one caught something. Not all of them liked what it turned out to be.',
  },
};
