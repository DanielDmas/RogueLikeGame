import type { Room, RunState } from '../schema';
import { choseIn, pickShadowMoments } from '../../engine/gameState';

export const teleporter: Room = {
  id: 'teleporter',
  act: 3,
  title: 'The Teleporter',
  type: 'DILEMMA',
  doorHint: 'The door that is also a wall',
  teaser: 'A machine destroys you and prints a copy. It insists it walked through.',
  stages: [
    {
      beats: [
        'A room with a black mirror for a floor and no far wall — just a gap, and beyond the gap, the way forward, unreachable by any bridge because there is no bridge.',
        'There is, instead, a booth. Brushed steel, softly lit, doors like a polite guillotine. The instructions are printed in a font chosen to be calming.',
        'STEP IN. YOU WILL BE SCANNED TO THE ATOM, DISASSEMBLED, AND PRINTED — PERFECTLY — ON THE FAR SIDE. THE COPY WILL REMEMBER READING THIS SIGN. THE COPY WILL FEEL LIKE IT WALKED THROUGH. THE COPY WILL BE VERY SURE.',
        (s) =>
          choseIn(s, 'ship', 'pattern')
            ? 'You remember the workshop — you voted for the pattern, the reassembled planks. The booth, in a sense, is your own position with doors on it. It is one thing to hold a view. It is another to step inside it.'
            : choseIn(s, 'ship', 'neither')
              ? 'You remember the workshop — “me was never a thing that persists,” you said, to two of yourself. The booth has apparently read your file. It hums as if to say: prove it.'
              : 'Somewhere behind you, in a workshop that smelled of cedar, craftsmen are probably still arguing about planks. The booth is the same argument, restated with plumbing.',
        'Usher: I take it daily. Or someone does — the one who arrives has my memories and my grievances and files my reports, so nobody here asks anymore. The gap does not care about the metaphysics. The gap only cares that there is no bridge.',
      ],
      choices: [
        {
          id: 'step-through',
          text: 'Step in. Whatever arrives will be sure it’s you, and sureness is all you’ve ever had.',
          hint: 'Trust the pattern.',
          effects: { lucidity: 15, axes: { controlAcceptance: 10 } },
          outcome: [
            'The doors close. There is no pain, no light, no tunnel — there is only the sign on the far side, which reads: THANK YOU. And you remember reading the first sign, and you remember deciding, and you feel exactly like someone who walked through.',
            'Which is, of course, precisely what the sign said the copy would feel. You check your hands. They are very convincing. You are either the same person or the best evidence that “same person” was always a feeling wearing a fact’s clothes.',
            'Usher: (already on the far side — or an Usher is) Painless, you see. Whether anyone survived it is a question with no remaining witness to answer it. Welcome, either way. Both of you.',
          ],
        },
        {
          id: 'refuse-stairs',
          text: 'Refuse. Look for stairs, a ledge, a rope — anything that keeps the thread unbroken.',
          hint: 'There must be another way across.',
          effects: { lucidity: 12, axes: { controlAcceptance: -10 } },
          outcome: [
            'You search. You search properly — the walls, the mirror-floor, the booth’s service hatch. The room watches you with the patience of something that has hosted this exact search many times.',
            'There are no stairs. There were never stairs. The room is honest about its one door, and the door is the booth. You stand at the gap a long while, and then — because forward is the only direction this place sells — you step in anyway, having gained nothing except the certainty that you exhausted the alternatives.',
            'Usher: For what it is worth — the ones who search arrive on the far side identical to the ones who simply trusted. But they arrive having fought for it, and some travelers need exactly that receipt. You kept the thread as long as the thread existed. No one can do more than that. Whether anyone can do even that much is the question this room was built to ask.',
          ],
        },
        {
          id: 'copy-first',
          text: '“Run it in copy mode — print the far one WITHOUT disassembling me. Then let the two of us discuss who crosses.”',
          hint: 'Split the question before answering it.',
          effects: { lucidity: 20, axes: { reasonFeeling: -8 } },
          outcome: [
            'The booth, caught off guard, consults its own manual. Copy mode exists. Of course it exists — destruction was never technically necessary; it was a courtesy, to keep the numbers tidy.',
            'The far-you appears, checks its hands with your exact gesture, and looks across the gap at you. For one long moment you are both silent, because you both know: whatever you feel right now — this vertigo of being the original — the far one feels it too, symmetrically, and calls itself the original. There is no experiment either of you could run to settle it.',
            'Usher: And there is the scalpel, precisely. If the copy is you when you are destroyed, why is it not you when you are not? A philosopher found that fork a great many years ago, and it has never stopped bleeding. (to the far one) You will take the booth now. (to you) And so, in time, will you. There is still no bridge — only, now, the one who will finish your crossing for you. Be kind to him. He has had a strange day too.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'Personal Identity and the Teleporter',
    thinkers: 'Derek Parfit · Reasons and Persons · John Locke',
    body: 'Derek Parfit built the teleporter case to break a very old assumption: that personal identity is a deep further fact — a soul-like thread that either survives or doesn’t. The scanner destroys you and prints a perfect replica; the replica remembers stepping in and feels seamless. Did you die? Parfit’s scandalous answer: the question is empty. Everything that matters — psychological continuity, memory, intention, character — is preserved; the “extra” thing whose survival worries you was never there to begin with. **Identity, he argued, is not what matters; continuity and connectedness are.** His branch-line case (print the copy without destroying the original) exposes the wound: two candidates, symmetrical claims, no possible tiebreaker. Parfit reported that internalizing this made death seem less bad — a change in degree, not the snapping of a metaphysical thread. Whether that consoles you or hollows you out tends to depend on which side of the booth you’re standing on.',
  },
};

export const editor: Room = {
  id: 'editor',
  act: 3,
  title: 'The Editor',
  type: 'DILEMMA',
  doorHint: 'The door of the red pen',
  teaser: 'Strike out your worst memory forever. See what it was holding up.',
  stages: [
    {
      beats: [
        'A study, lamp-lit, the kind of quiet that has furniture in it. On the desk: a single manila folder with your name on it — your real one, the one you currently cannot remember, which the folder tactfully keeps face-down.',
        'Inside the folder is your worst memory. The room does not need to tell you which one. Your body has already told you: the shoulders first, then the stomach, then the weather of the face.',
        'Beside the folder, a red pen. The instructions are engraved on the pen itself, small: ONE STRIKE REMOVES IT. THE EVENT WILL HAVE STILL HAPPENED. YOU WILL SIMPLY NEVER HAVE BEEN THERE.',
        'Usher: No trick, this time. The pen works exactly as described — no hidden clause, no ironic sting. The only cost is the one printed on the tin: you, minus that. Take whatever time you need. The lamp is patient. So, for once, am I.',
      ],
      choices: [
        {
          id: 'strike-it',
          text: 'Strike it out. No one is obligated to carry that.',
          hint: 'The clean amputation.',
          effects: { lucidity: 10, flags: ['erased-memory'], axes: { controlAcceptance: -12 } },
          outcome: [
            'The pen is light. The line is short. The relief is immediate and enormous and real — this room does not cheat, and the weight lifts like a hand taken off your chest after years.',
            'And then, over the following corridors, you notice the edges of the hole. A certain kind of stranger’s grief you used to recognize on sight — now just weather on a face. A patience you had, hard-won from somewhere, now unfunded. The wound is gone. So is what the wound was holding up.',
            'Usher: No judgment. Genuinely. Some weight is load-bearing, and some is simply weight, and even I cannot always tell which from the outside. You made the call from the only seat that had a view of it.',
          ],
        },
        {
          id: 'keep-it',
          text: 'Close the folder. Keep it. It’s yours.',
          hint: 'The whole ship, rot and all.',
          effects: { lucidity: 20, axes: { controlAcceptance: 12 } },
          outcome: [
            'You close the folder and slide it back across the desk, and the room accepts it with something like respect. The weight settles back where it always sat. It is not lighter. That was never the offer.',
            'But something has changed, minutely: you have now chosen it. The memory used to be something that happened to you. As of tonight it is something you carry on purpose — same stone, different grip.',
            'Usher: For the record — that is the difference between a scar and a wound. Same tissue. One of them has stopped being written by someone else.',
          ],
        },
        {
          id: 'read-first',
          text: 'Open the folder. Read it — all of it, properly — before deciding.',
          hint: 'Face it, then choose.',
          effects: { lucidity: 18, axes: { reasonFeeling: 10 } },
          outcome: [
            'You open the folder. Reading it is exactly as bad as you feared and slightly different than you remembered — the memory, it turns out, had been redacting itself for years, sanding the worst edge, sharpening a different one. The document is the uncut version. You read to the end. You did not know you could.',
            'And having read it, the pen looks different. Smaller. The memory is still terrible, but it is now terrible and witnessed — by the one witness whose testimony you can never lose. You leave it in the folder, unstruck. Not because it doesn’t hurt. Because it’s true, and you were there, and someone should have been.',
            'Usher: (quietly) That is the rarest choice. Most travelers choose between carrying it and cutting it out. Almost nobody thinks to finally read the thing. The pen has sat on this desk a very long time. The chair you just sat in was always the real instrument.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Wound and the Ledger',
    thinkers: 'Nietzsche, amor fati · memory reconsolidation · Kierkegaard',
    body: 'Nietzsche’s formula for greatness was amor fati — to love one’s fate, wanting nothing to be different, “not merely bear what is necessary, still less conceal it… but love it.” Not because suffering is good, but because the self that judges the suffering was built by it: strike the worst chapter and the reader changes too. Modern memory science gives the thought experiment teeth — reconsolidation research shows memories are rewritten each time they are recalled, and drugs that blunt a memory’s emotional charge already exist. The question is no longer science fiction: if you could sand down grief, should you? The case for the pen is real; nobody is morally obligated to bleed for character development. The case against is quieter: **pain often turns out to be load-bearing — the source of a specific empathy, a specific patience, a specific refusal to let others suffer unwitnessed.** Kierkegaard said life is lived forward but understood backward. The folder is the backward part. Editors, be careful with it.',
  },
};

export const introduction: Room = {
  id: 'introduction',
  act: 3,
  title: 'The Introduction',
  type: 'NO-SOLUTION',
  doorHint: 'A small plain door, politely ajar',
  teaser: 'A room that only wants to know who you really are.',
  secret: (s) =>
    s.lucidity >= 100 ||
    Math.abs(s.axes.reasonFeeling) >= 40 ||
    Math.abs(s.axes.selfOthers) >= 40 ||
    Math.abs(s.axes.controlAcceptance) >= 40,
  stages: [
    {
      beats: [
        'The smallest room in the facility. No furniture, no mirror-floor, no machinery — just proportions so exact they feel like being listened to.',
        'The room speaks. Its voice is courteous and without location.',
        'THE ROOM: Welcome. This will be brief, or it will be the longest room of your life; that part is yours. One question only. Who are you?',
        'You open your mouth — and notice, with a small vertigo, how many answers are already lined up, and how each of them is wearing a lanyard.',
      ],
      choices: [
        {
          id: 'give-name',
          text: 'Give your name — or reach for it, anyway.',
          hint: 'Start with the label.',
          effects: { lucidity: 8 },
          outcome: [
            'THE ROOM: That is a name. A sound your parents chose before meeting you, attached by paperwork and repetition. If you changed it tomorrow, you would remain — which means it was never you. It is a handle. I asked about the cup.',
            'The room says this without cruelty, the way one returns a coat that isn’t yours.',
          ],
        },
        {
          id: 'give-role',
          text: 'Answer with what you do — your work, your place, your people.',
          hint: 'You are what you spend your days on. Surely.',
          effects: { lucidity: 8 },
          outcome: [
            'THE ROOM: Those are roles. Positions in other people’s systems — employer, family, nation. Each one existed before you filled it and will be refilled after. You have been describing the slots. I asked about what is poured into them.',
            'THE ROOM: (gently) Descriptions are what dissolved, traveler. That is why you are here. Who is wearing them?',
          ],
        },
        {
          id: 'give-story',
          text: 'Tell it your story — what happened to you, what you survived, what you love.',
          hint: 'The narrative self, in full.',
          effects: { lucidity: 8 },
          outcome: [
            'The room listens to all of it. It is a good listener; you find yourself telling it things the corridors never asked about.',
            'THE ROOM: That is a story. A beautiful one, and true, and — notice — told in the past tense, by someone standing outside it. The story requires a teller. The teller is what I asked about. Every sentence you just said was evidence that you are not any sentence.',
          ],
        },
      ],
    },
    {
      beats: [
        'THE ROOM: We have now removed the name, the roles, and the story. This is usually where travelers become either angry or very quiet. Both are progress.',
        'THE ROOM: I will ask once more, and I want you to notice what remains available to answer with. Who are you?',
      ],
      choices: [
        {
          id: 'insist',
          text: '“No — I AM my story. Take the story away and there’s no one left to ask.”',
          hint: 'Defend the narrative self.',
          effects: { lucidity: 10, axes: { reasonFeeling: -6 } },
          outcome: [
            'THE ROOM: A defensible school. The self as its own biography — no pearl at the center, just the necklace. Many careful thinkers have lived and died in that position, and I will not pretend to have defeated it.',
            'THE ROOM: But permit one observation as you go: just now, when I threatened your story, someone flinched. Ask, at your leisure, who that was. The door is behind you. It was never locked. Doors here rarely are; travelers lock themselves.',
          ],
        },
        {
          id: 'admit',
          text: '“I don’t know. Nothing sayable is left. Whoever I am is what’s still here after all of it — and it has no name.”',
          hint: 'Say the unsayable thing.',
          effects: { lucidity: 30, axes: { controlAcceptance: 10 } },
          outcome: [
            'The room is silent for a long moment — not the silence of absence, but of something bowing.',
            'THE ROOM: Correct. Not as an answer — there is no answer — but as an honesty. What remains when every description is removed is not nothing; it is the one doing the removing. It cannot be found by looking, because it is the looking. You will not hold this thought for long; no one does; that is not failure, it is the thought’s nature.',
            'THE ROOM: You came in dissolved and afraid of it. Notice: what dissolved was the packaging. Go gently. You are the least lost traveler to pass through here in some time.',
          ],
        },
        {
          id: 'stay-silent',
          text: 'Say nothing at all. Stand in the question.',
          hint: 'Let the silence answer.',
          effects: { lucidity: 25, axes: { controlAcceptance: 8 } },
          outcome: [
            'You stand in the room and do not answer, and the not-answering is not evasion — the room can tell the difference; it has heard every kind of silence there is.',
            'THE ROOM: (after a while, warmly) Yes. That is also a way to say it — perhaps the only grammar the answer fits in. The question “who are you” was never missing information. It was an invitation to stop reaching for the lanyards. You stopped. Few do.',
            'The door opens by itself, which in this facility is the highest compliment on record.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Unfindable Self',
    thinkers: 'Hume · anattā (Buddhist no-self) · the apophatic tradition',
    body: 'David Hume went looking for his self and filed a famous null result: whenever he introspected, he found only particular perceptions — heat, cold, love, anger — never the perceiver itself. His conclusion: the self is a bundle of experiences, and the “owner” is a habit of grammar. Twenty-two centuries earlier, the Buddha taught anattā: search the body, feelings, perceptions, impulses, and consciousness, and none of them qualifies as the permanent self we assume; the assumption itself is the root of a specific suffering. The apophatic tradition — from the Upanishads’ neti neti (“not this, not this”) to Meister Eckhart — turned the failure into a method: strip every description, and what remains is not nothing but the unnameable witness doing the stripping. This room had no solution because “who are you?” is not a question with missing data. **Every sayable answer is a description, and descriptions are had, not been.** You always pass. The lesson is what’s left.',
  },
};

export const debtOfDead: Room = {
  id: 'debt-of-dead',
  act: 3,
  title: 'The Debt of the Dead',
  type: 'DILEMMA',
  doorHint: 'The door you swore you’d never knock on',
  teaser: 'Someone who wronged you, dying, and asking to be forgiven.',
  stages: [
    {
      beats: [
        'A bedside. The room has arranged it with terrible specificity — the smell of a hospital trying to smell like lavender, a window with evening in it, a chair placed for you as if you had confirmed attendance.',
        'In the bed is the one who wronged you. The room has left the face slightly blurred, because it is not one person — it is whoever your chest just named. The wrong was real. This place does not deal in misunderstandings; what they did, they did, and it shaped the floor plan of your life.',
        'They are dying. Actually, imminently — the machines have moved from urgency to courtesy. And they are awake, and they know you, and they ask, in a voice with almost nothing left in it: “Can you forgive me?”',
        'They mean it. That is the room’s one cruelty: you can see that they mean it, and that meaning it changes nothing about what was done. Both facts, fully lit, at the same bedside.',
      ],
      choices: [
        {
          id: 'forgive',
          text: '“Yes. I forgive you.” Say it, and mean it as far as you can.',
          hint: 'Release the debt — for whoever it frees.',
          effects: { lucidity: 18, axes: { selfOthers: 10, reasonFeeling: 8 } },
          outcome: [
            'You say it. The words cost more than you expected and weigh less once they are out — as if you had been holding a stone against a current and finally opened your hand, and discovered the current had been holding you too.',
            'Their face does what faces do when a life’s last account unexpectedly clears. They do not say thank you. They say your name — correctly, gently — and something in the ledger between you, which was never going to balance, simply closes instead.',
            'Forgiving did not make what they did acceptable. It made it finished. You will spend years learning that those are different words, and tonight was the first lesson.',
          ],
        },
        {
          id: 'refuse',
          text: '“No. I’m here — that’s what I have. Forgiveness isn’t.”',
          hint: 'Honesty over absolution.',
          effects: { lucidity: 15, axes: { selfOthers: -8, reasonFeeling: -4 } },
          outcome: [
            'You say no. You say it without spite — that is the part that costs — and you stay in the chair, which says the thing the no cannot: that they mattered enough for the wound to be real, and the wound is real enough that its owner will not sign it away at a deathbed’s convenience.',
            'They receive it. Somewhere under the machines’ courtesy, you see something almost like respect: they asked an honest question at the end of their life and got an honest answer, which is more than most endings are furnished with.',
            'You held the line, and stayed anyway. Some debts are recorded honestly rather than settled falsely, and the record, too, is a kind of tribute — proof that what happened happened, to someone who was really there.',
          ],
        },
        {
          id: 'forgive-silently',
          text: 'Forgive them — in your chest, fully — and say only: “Rest now.”',
          hint: 'Release the debt without handing them the receipt.',
          effects: { lucidity: 12, axes: { selfOthers: -4, controlAcceptance: 6 } },
          outcome: [
            'Inside, you open the hand. The stone goes. You feel it go — it is real, the release, as real as any spoken version.',
            'Out loud you say only, “Rest now,” and their eyes search your face for the verdict, and find kindness where the verdict would be, which they will spend their last hours reading in both directions.',
            'You kept the forgiveness and withheld the absolution — freed yourself without unlocking their door. Notice, without judgment, that this was the one option where the mercy stayed entirely on your side of the bed. Perhaps that was wisdom. Perhaps it was the last small installment of the debt, paid in their currency after all.',
          ],
        },
        {
          id: 'ask-question',
          text: '“First — why? Tell me the truth of it. Then I’ll answer.”',
          hint: 'The question you never got to ask.',
          effects: { lucidity: 22, axes: { reasonFeeling: 6 } },
          outcome: [
            'You ask the question that has been standing in every doorway of your life, and the dying, who have no remaining use for their defenses, answer it.',
            'The answer is smaller than the wound. It always is. Not malice on a throne — a frightened person, a weak moment metastasized, reasons that would embarrass a schoolchild. You expected an architecture of cruelty and were handed a shrug that broke your life. The disappointment is its own strange medicine: nothing that small deserves the throne it has occupied in you.',
            'What you say after — yes, or no, or rest now — matters less than you thought it would. The question was the visit. They answer it, and you both know the account was audited at last, by the only two people who ever held it.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'Forgiveness and the Ledger',
    thinkers: 'Bishop Butler · Hannah Arendt · Jacques Derrida',
    body: 'Bishop Butler defined forgiveness as the forswearing of resentment — not excusing, not forgetting, not reconciling, but declining to keep paying interest on the wound. Hannah Arendt called forgiveness the only genuine escape from the past’s irreversibility: without it, we remain forever the victim of one deed, and the wrongdoer forever its author; forgiveness releases both parties from a frozen frame. But Derrida saw the paradox at the bedside: forgiveness worth the name forgives the unforgivable — anything less is mere accounting, waiving debts already affordable. And the deathbed sharpens every edge: a sincere apology changes the wrongdoer, not the wrong; your forgiveness is asked for at the exact moment refusing it becomes cruel and granting it can feel coerced. There was no correct answer in that chair. Forgiving, refusing honestly, releasing silently, and asking the unasked question are four different acts of taking the wound seriously — **which was, perhaps, the only debt that was truly yours to pay.**',
  },
};

export const marysRoom: Room = {
  id: 'marys-room',
  act: 3,
  title: "Mary's Room",
  type: 'INSIGHT',
  doorHint: 'The door of the grey study',
  teaser: 'She knows everything about the color she has never seen.',
  stages: [
    {
      beats: [
        'A cell built entirely in greyscale — walls, floor, the single chair, even the water in the glass on the desk, rendered in shades between white and black. It is the only room in the wing built this way on purpose.',
        "On the desk: a lifetime's worth of papers, bound and cross-referenced — every wavelength, every retinal response, every neural pathway that fires when a human being looks at the color red. You have read them. You could recite the physics of a sunset from memory, in the dark, backwards.",
        "You have never seen red. Not once, not by accident, not through a crack in a curtain. The room was built around that absence the way a keyhole is built around the one key it's missing.",
        'In the corner: a drawer, sealed, labeled in a hand you don’t recognize as anyone’s but somehow trust. THE REST OF IT.',
        'Usher: Everything in those papers is true, and complete, by any measure physics is willing to offer. I want to be honest about that before you decide anything. Nothing in the drawer will correct the papers. It will only add to them — or so the theory goes.',
      ],
      choices: [
        {
          id: 'open-drawer',
          text: 'Open the drawer.',
          hint: "Let there be one more fact, if that's all it turns out to be.",
          effects: { lucidity: 12, axes: { reasonFeeling: 7 } },
          outcome: [
            'You open the drawer. Inside: light, arranged at the exact wavelength the papers promised, sitting in a shallow dish like something held mid-breath.',
            'Red.',
          ],
        },
        {
          id: 'leave-sealed',
          text: 'Leave it sealed. The facts already suffice — this is completeness with an unopened box.',
          hint: 'The physics account was supposed to be enough.',
          effects: { lucidity: 8, axes: { reasonFeeling: -7 } },
          outcome: [
            'You close the drawer without opening it, and slide the papers back into their folder, satisfied that a complete physical description has no gaps in it worth this kind of ceremony.',
            "The drawer seems to hum very faintly for the rest of your time in this room — the particular hum of an unread letter, sitting exactly where you left it, patient in a way unread letters generally aren't.",
          ],
        },
        {
          id: 'give-away',
          text: 'Take the drawer, unopened, and carry it to someone who has never read the papers either.',
          hint: 'Let the seeing belong to someone else, for once.',
          effects: { lucidity: 8, axes: { selfOthers: 7 } },
          outcome: [
            'You lift the drawer — light, and unexpectedly warm — and carry it out past the papers, past the grey walls, without once lifting the lid.',
            "Usher: An unusual kindness. Most travelers who reach this room want the seeing for themselves — understandably; it's the one experience this wing can't hand you twice. You are giving away something you don't yet have. I don't know what to call that, except generous.",
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: "What Mary Didn't Know",
    thinkers: 'Frank Jackson · Thomas Nagel, the knowledge argument',
    body: 'Frank Jackson designed Mary to break physicalism\'s confidence outright: raised in a black-and-white room, she learns every physical fact about color vision — wavelengths, cone cells, the visual cortex\'s response curves — without ever seeing a color. Release her, show her a ripe tomato, and something happens no textbook prepared her for. Jackson\'s question: did she learn something new? If a complete physical description leaves out **what red looks like**, physicalism\'s complete list was never complete — some facts, the argument runs, are facts about experience, and no third-person description delivers them, however exhaustive. Thomas Nagel had already sharpened a companion version: you can know everything about a bat\'s echolocation and still not know what it is like to be a bat. Physicalists have replies — Mary gains an ability, not a fact; a new way of representing an old fact, not new information. None fully deflate the intuition in the room with you right now. The drawer was never going to be explained by what came before it. It was going to be met.',
  },
};

export const butterflyDream: Room = {
  id: 'butterfly-dream',
  act: 3,
  title: "The Butterfly's Dream",
  type: 'NO-SOLUTION',
  doorHint: 'The door of the papered wall',
  teaser: 'Someone here is dreaming someone. It is not clear which direction.',
  stages: [
    {
      beats: [
        'A small room papered floor to ceiling in rice-paper panels, softly lit from behind as if the walls themselves were the lamp. A low bed, unmade, still warm.',
        "Lying down was apparently never optional. You are already lying in it, mid-waking, the way you surface from a nap you didn't mean to take — uncertain, for one long second, which room is the real one and which is the one you're leaving.",
        (s) =>
          s.memoryLost
            ? 'The dream you were having — you can feel its edges dissolving already — offered no seam at all: no photograph, no name, nothing to snag on and prove which side of sleep you are actually standing on. It fit you perfectly, the way a room fits a person who has never lived anywhere else.'
            : "The dream you were having is fading, but one detail refuses to go: a face from a photograph you're sure you've seen before, worn at edges you didn't dream but remember. It doesn't prove anything. It just itches, a small snag in otherwise seamless cloth.",
        'You were, in the dream — you’re almost sure — a butterfly. Not symbolically. Wings, weight, the specific unbothered logic of following whatever smelled good. You did not, as the butterfly, dream of being this. You were simply, entirely, a butterfly, the way you are now, entirely, whoever is lying on this bed.',
        'Usher: Zhuangzi told this one about himself, a long time before this facility existed — dreamed he was a butterfly, woke unsure whether he was a man who had dreamed of being a butterfly, or is now a butterfly dreaming he is a man. He never resolved it. I want to be clear this room does not intend to succeed where he declined to.',
      ],
      choices: [
        {
          id: 'wake-as-self',
          text: 'Insist on the waking version. You are the one deciding this, right now, which settles it.',
          hint: 'Break the tie by fiat.',
          effects: { lucidity: 8, axes: { controlAcceptance: -6, selfOthers: -3 } },
          outcome: [
            'You sit up, plant your feet on the floor, and declare — to the room, to the fading wings, to whichever of you is doing the declaring — that this is the true state and the other was the dream.',
            'The room accepts the ruling the way a judge accepts a plea it has no grounds to overturn: without agreement, and without further argument. Somewhere, briefly, something with wings had believed exactly the same thing about itself, just as certainly.',
          ],
        },
        {
          id: 'stay-butterfly',
          text: "Let it stand. Whichever one is dreaming, it isn't obviously your job to correct it.",
          hint: "Don't referee a tie you can't see the whole board of.",
          effects: { lucidity: 6, axes: { controlAcceptance: 7, reasonFeeling: 5 } },
          outcome: [
            "You lie back down and let the question keep both its answers, the way you'd let two colors sit unmixed on the same canvas because separating them was never actually necessary to look at the painting.",
            'Something in your chest that usually insists on knowing which one of you is real goes, for a moment, pleasantly quiet. The papered walls glow the same either way.',
          ],
        },
        {
          id: 'refuse-distinction',
          text: 'Refuse the premise. There is no fact of the matter about which one is dreaming — only two experiences, each complete.',
          hint: 'The costliest answer: no consolation, no verdict, no bed to wake up in.',
          effects: { lucidity: 12 },
          outcome: [
            'You say it plainly: there is no man who dreamed a butterfly, and no butterfly dreaming a man — only transformation, one state becoming another, with no fixed post standing outside both to certify which was the original.',
            "It is the correct answer, if it's an answer at all, and it comes with nothing to hold — no waking triumph, no butterfly's ease, just the papered walls glowing at exactly the warmth they always were, indifferent to which of you is asking.",
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: "The Butterfly's Question",
    thinkers: 'Zhuangzi, the dream of the butterfly',
    body: 'Zhuangzi, the Daoist philosopher, describes dreaming he was a butterfly — flitting and content, unaware of any Zhuangzi at all — and waking with a start, unable to decide whether he was a man who had just dreamed he was a butterfly, or is now a butterfly dreaming he is a man. He calls this the transformation of things, and declines, pointedly, to resolve it: the question assumes a fixed observer standing outside both states, checking which one is real, and no such observer is on offer. Each experience, while it lasts, is total and unquestioned from the inside — the butterfly doesn\'t suspect Zhuangzi, and Zhuangzi, mid-dream, didn\'t suspect the butterfly either. Western epistemology tends to want a verdict: which one is the base reality, which the dream. Zhuangzi\'s answer is closer to a shrug elevated to a doctrine — identity is provisional, states transform into one another, and looking for the one true waker underneath all of them may be the only real mistake available. **The wings were not a metaphor for something. They were, entirely, themselves, for exactly as long as they lasted.**',
  },
};

export const swampman: Room = {
  id: 'swampman',
  act: 3,
  title: 'Swampman',
  type: 'DILEMMA',
  doorHint: 'The door of the second coat',
  teaser: 'Someone in there is wearing your face, and is very polite about it.',
  stages: [
    {
      beats: [
        "The storm outside has knocked half the wing's lights into a flicker, and in the strobing half-dark, the room's one chair is occupied. By you.",
        "Not a copy in the teleporter's clean, mechanical sense — this one arrived by accident, the way a lightning strike arrives: a bog, a body, a bolt, and afterward, standing up from the mud, molecule-for-molecule identical to you, down to the coat you happen to be wearing.",
        'It has never met you. It has also never met anyone — it formed forty seconds ago in a swamp that isn’t in this building, with your memories intact and running, your handwriting ready in its hand, your mother’s face vivid in a mind that has existed for less time than it takes to read this sentence.',
        'It looks up, a little sheepish about the whole thing, and says, in your exact voice: “I know how this sounds. I’d feel the same way, in your position. I think I do, actually — feel the same way. That’s rather the problem, isn’t it.”',
        "Usher: No trick to the physics, this time either. It has your synapses, your scars, your grudges, right down to the one you're currently having about it. The only thing it does not have is a past — no history connects it to the person who grew up with your memories. Whether that disqualifies it from being you is, I'm told, still being litigated. Not by me. By philosophers, mostly at dinner.",
      ],
      choices: [
        {
          id: 'accept-them',
          text: '"You\'re me. History was never the load-bearing part — the mind in that chair is doing everything a self does."',
          hint: 'Identity by pattern, not pedigree.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6, reasonFeeling: 4 } },
          outcome: [
            'You cross the room and shake its hand, which shakes back with your own slight hesitation, and something in the strobing light settles, briefly, into something less like a crime scene and more like a family reunion with unusually short notice.',
            'Usher: A generous ruling, and a coherent one — if what matters is the pattern rather than the provenance, the swamp is just an unusually dramatic delivery method. The two of you will have to work out, on your own time, whose turn it is to use the name.',
          ],
        },
        {
          id: 'deny-them',
          text: '"No causal thread runs from me to you. You are a very convincing stranger."',
          hint: "History is not optional; it's the whole thing being copied.",
          effects: { lucidity: 8, axes: { selfOthers: -6, controlAcceptance: -5 } },
          outcome: [
            'You keep your distance, and it accepts this with a wince you recognize, because it is, after all, your own wince, deployed by someone with no actual history of ever using it before tonight.',
            'Usher: Also coherent — if identity requires an unbroken causal chain to the person who lived the life being remembered, this one has memories but no biography, a diary with nobody\'s hand behind the ink. It will go on believing it is you regardless. Belief, unfortunately, has never required a valid pedigree.',
          ],
        },
        {
          id: 'split-the-coat',
          text: 'Offer to divide what you have — the room, the name, whatever comes next — between the two of you.',
          hint: 'Maybe survival was never the thing worth arguing about.',
          effects: { lucidity: 8, axes: { selfOthers: 7 } },
          outcome: [
            'You take off the coat and hand it over, half seriously, and for a moment you are just two people standing in bad light, working out logistics instead of metaphysics, which turns out to be considerably easier.',
            "Usher: Derek Parfit would have liked this room, I think — he spent a career arguing that survival was never the prize to fight over; what matters is that someone psychologically continuous with you carries what you cared about forward. By that measure, tonight, you both won. Try not to let the coat become a whole new argument.",
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Man From the Marsh',
    thinkers: 'Donald Davidson · Derek Parfit, causal history and what matters',
    body: 'Donald Davidson proposed Swampman as a reductio: lightning strikes a swamp and, by cosmic accident, assembles a being molecule-for-molecule identical to Davidson, memories and all, with no causal history connecting it to the original — no childhood, no learning, no actual relationship to the people it "remembers." Davidson\'s own intuition was that Swampman couldn\'t mean anything by its words, since meaning requires a causal history the swamp-creature never had; representation, on this view, isn\'t just structure, it\'s structure plus a story. Derek Parfit, working the same fork from a different angle, argued the story was never the point: what matters in survival is psychological continuity and connectedness — memory, intention, character carried forward — not an unbroken causal thread to a particular hunk of matter. If Parfit is right, the swamp is a strange delivery mechanism for someone who nonetheless is you, in every sense worth wanting. If Davidson is right, the room is occupied by a stranger who arrived pre-loaded with your entire inner life and none of your history. **Both of them can be right about what they are each measuring — they were never actually arguing about the same question.**',
  },
};

/** Generic vignettes shown when there is no prior-run data to quote (a legacy
 * save from before `RunState.prior` existed, or a degenerate empty transcript
 * — `secret` below already keeps this room unreachable on a player's first-
 * ever run, so this path is a safety net, not the common case). */
const SHADOW_FALLBACK: string[] = [
  'A shadow reaches for a lever it will never quite pull, caught mid-decision, forever almost.',
  'A shadow sits at a bedside that isn’t there anymore, saying something the fire swallows before it reaches the wall.',
  'A shadow stands at a threshold, one hand half-raised — not quite a wave, not quite a refusal — and holds that shape for a very long time.',
];

const shadowMomentBeat =
  (index: 0 | 1 | 2) =>
  (s: RunState): string => {
    const entry = pickShadowMoments(s.prior)[index];
    if (!entry) return SHADOW_FALLBACK[index];
    return `On the wall, a shadow repeats a choice already made, exactly as you made it: “${entry.choiceText}”`;
  };

export const theCave: Room = {
  id: 'the-cave',
  act: 3,
  title: 'The Cave',
  type: 'NO-SOLUTION',
  doorHint: 'The low door with the firelight',
  teaser: 'Shadows you will recognize, projected for an audience of one.',
  secret: (s) => (s.prior?.runs ?? 0) >= 1,
  stages: [
    {
      beats: [
        'A low door, easy to miss, warmer than the corridor around it. Firelight comes under the gap the way it does in old stories — orange, unsteady, patient.',
        'Inside: a fire, a wall, and a bench facing the wall, as if someone built this room around the single purpose of sitting here and watching.',
        shadowMomentBeat(0),
        shadowMomentBeat(1),
        shadowMomentBeat(2),
        'The shapes on the wall are doing exactly what you did. Not similar. Exactly. You recognize your own posture in silhouette before you recognize the choice.',
        'Usher: I did not build this room, and I do not know who did, though I have a guess I keep to myself. It only appears for travelers who have already left once and come back. I am told that detail matters. I have never been able to say why.',
      ],
      choices: [
        {
          id: 'name-them',
          text: '“I recognize you.” Say, out loud, whose choices these are.',
          hint: 'Name what you are watching — the hardest kind of looking.',
          effects: { lucidity: 14, axes: { selfOthers: -3 } },
          outcome: [
            'You say it. Not the name a stranger would use — the small true one, the one you used on yourself in the dark, the one the shadows on the wall would recognize if shadows could listen.',
            'Usher: Most travelers watch. Almost none name what they are watching. I do not know exactly what that costs, but I can see, from here, that it costs something. The wall dims afterward, the way a fire settles once it has been fed precisely what it wanted.',
          ],
        },
        {
          id: 'watch-silent',
          text: 'Watch without speaking. Let the shadows finish their play.',
          hint: 'Witness without narrating.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You say nothing. The shadows finish their small, exact performances without your narration, without your correction, without your permission.',
            'It is easier this way, and you notice the ease, and you notice yourself noticing it, and the fire does not seem to mind either version of you.',
          ],
        },
        {
          id: 'turn-to-fire',
          text: 'Turn from the wall toward the fire itself — the light, not the shapes it throws.',
          hint: 'Look at the projector, not the shadows, and leave toward it.',
          effects: { lucidity: 10, axes: { reasonFeeling: -5, controlAcceptance: -4 } },
          outcome: [
            'You turn from the wall, deliberately, toward the flame doing the actual work — the wall was only ever a screen, and screens, however well lit, were never where the light lived.',
            'Usher: An unusual choice for this particular room. Most travelers study the shapes for as long as the fire allows. You looked instead at the thing that makes shapes possible, and walked toward it before the play was finished. I have no verdict on whether that is wisdom or simply impatience. Possibly a room this old does not get to have an opinion.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Fire and the Wall',
    thinkers: 'Plato, the ascent from the cave',
    body: 'Plato\'s allegory, in the Republic, imagines prisoners chained since childhood in a cave, facing a wall, watching shadows a fire behind them casts — shadows they take, understandably, for the whole of reality, having never had reason to suspect there was more. Freed and dragged into the sunlight, the prisoner is first blinded, then furious, then slowly transformed — and Plato\'s harder question follows immediately: what happens if that prisoner climbs back down to tell the others? They will not thank him. Plato suggests they will try to kill him, because the shadows were working fine and no one enjoys being told their whole world was a wall. This room does something the allegory never quite risked: it hands you your own shadows, cast by your own fire, and asks you to watch yourself from exactly the angle the prisoners never got. **The chains were never the interesting part. The wall was never lying to you on purpose. It simply never mentioned that it was a wall.**',
  },
};

export const freeWill: Room = {
  id: 'free-will',
  act: 3,
  title: 'The Free Will Waiting Room',
  type: 'NO-SOLUTION',
  gate: true,
  doorHint: 'The door that saw you coming',
  teaser: 'The lights come on before you choose. You lose every bet, on purpose.',
  stages: [
    {
      beats: [
        'A waiting room again — bookending the first, but this one has a row of large friendly buttons along the wall: blue, red, green, and one unlabeled.',
        'Above the buttons, a screen. On the screen, a betting board. The Usher stands beside it with a bookmaker’s visor and an expression of unbearable serenity.',
        'Usher: A simple game. Press any button you like, whenever you like, entirely of your own free will. I have already written down, in advance, which one you will press. I have never once lost. I would apologize for that, but you were always going to hear me say so.',
        'You reach — just to test it — and the BLUE button lights up, warmly, a full second before your hand commits. You had not decided yet. You would have sworn you had not decided yet.',
        'Usher: (reading the board) “Blue, first — to test it.” You will now feel briefly rebellious, and consider the red one. Take your time with that. The board already has.',
      ],
      choices: [
        {
          id: 'press-red',
          text: 'Press RED — precisely because it says you won’t. Out-rebel the board.',
          hint: 'Break the prediction by force.',
          effects: { lucidity: 12, axes: { controlAcceptance: -8 } },
          outcome: [
            'You slam red. The bell rings. The board, unfolded one line further, reads: “Red, defiantly, believing this disproves something.”',
            'Usher: The rebellion was in the forecast, traveler — it is the most predictable weather you have. Every determined system seems to run a little defiance of its own; it is what lets it feel like an exception. Don’t be embarrassed. The red button is pressed more than any other in this room. You are in good company.',
          ],
        },
        {
          id: 'dont-press',
          text: 'Press nothing. Fold your arms. Refuse the whole game.',
          hint: 'You can’t predict what never happens.',
          effects: { lucidity: 12, axes: { controlAcceptance: 4 } },
          outcome: [
            'You fold your arms. Minutes pass. The room is very good at minutes.',
            'Usher: (turning the board around; it has read, all along, “will attempt not pressing — estimated duration, four minutes”) Abstention is also a move. The board accounts for the whole option space, including the pride of standing outside it. Four minutes, almost exactly. Most travelers crack at two.',
          ],
        },
        {
          id: 'press-knowing',
          text: 'Press BLUE — the predicted one — slowly, deliberately, on purpose. “It was always going to happen, AND I choose it.”',
          hint: 'Stop fighting the forecast. Own the weather.',
          effects: { lucidity: 25, axes: { controlAcceptance: 10 } },
          outcome: [
            'You press blue — the exact button the board named — not in surrender but with the deliberateness of a signature. The bell rings. It sounds, this once, less like scoring and more like agreement.',
            'Usher: There it is. The way out was never beating the board. It is noticing that “it was determined” and “I chose it” may be two descriptions of the same event — the forecast and the weather, arguing over which one made it rain. Your choosing is part of the machinery. The machinery runs through the choosing, not around it.',
            'Usher: I still won, technically. But you are the first today to make the winning feel beside the point, which is the nearest thing to a defeat I am able to have. The door is open. It was always going to be.',
          ],
        },
        {
          id: 'press-unlabeled',
          text: 'Press the unlabeled one. Whatever it is, it isn’t on the menu.',
          hint: 'The button nobody explains.',
          effects: { lucidity: 15, axes: { reasonFeeling: 4 } },
          outcome: [
            'You press the unlabeled button. Somewhere deep in the facility, a kettle begins to boil.',
            'Usher: That is the tea button. It is written on the board too: “will choose mystery over meaning; takes milk.” The unlabeled option feels freest, doesn’t it. Notice, though, that a menu with “none of the above” printed on it is still a menu. Drink up. You chose it, and it was always coming, and it is quite good tea. All three of those are true at once. That is the whole lesson, and cheaper than a seminar.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'Free Will and the Forecast',
    thinkers: 'Benjamin Libet · determinism · compatibilism — Hume, Frankfurt, Dennett',
    body: 'In the 1980s, Benjamin Libet found that a readiness potential appears in the brain a measurable stretch before subjects report deciding to move — the button lights, it seems, before “you” press it. Headlines buried free will; the fine print was subtler (Libet himself noted a veto window, and later work questions what the readiness potential even measures). But the deeper question predates the electrodes: if every event has causes, your choices included, in what sense are they yours? Hard determinism says: none. Libertarian free will says the causal chain breaks in you — somehow. Compatibilism, the working philosophy of most philosophers today, dissolves the fight: freedom never required exemption from causality; it means acting from your own deliberation, unforced — the machinery running through your choosing rather than around it. **“Could I have done otherwise?” may matter less than “was it I who did it?”** You were always going to read this note. You also just chose to. Both sentences, one cup.',
  },
};

export const act3Rooms = [
  teleporter,
  editor,
  introduction,
  debtOfDead,
  marysRoom,
  butterflyDream,
  swampman,
  theCave,
  freeWill,
];
