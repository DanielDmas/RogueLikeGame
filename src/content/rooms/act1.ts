import type { Room } from '../schema';

export const wallet: Room = {
  id: 'wallet',
  act: 1,
  title: 'The Wallet',
  type: 'DILEMMA',
  doorHint: 'The door of the thing nobody saw',
  teaser: 'A test with no witnesses — except the one that counts.',
  stages: [
    {
      beats: [
        'A corridor of apartment doors, each leaking the warm light of homes that were never yours. On the floor mat of one of them: a wallet.',
        'Inside — cash. A lot of it, in the tired denominations of someone who counts. Folded around the bills, an eviction notice with a date that is soon, and an address forty minutes from anywhere.',
        'The corridor is empty. It has the particular emptiness of a place where you could do anything.',
        'USHER: (from nowhere) No cameras down here. I checked. Well — none that count toward anything.',
      ],
      choices: [
        {
          id: 'return-all',
          text: 'Take it to the address. Now, in person, all of it.',
          hint: 'The long walk.',
          effects: { lucidity: 20, axes: { selfOthers: 12, controlAcceptance: -3 } },
          outcome: [
            'The walk is long and the stairs at the end are longer. The person who opens the door looks at the wallet, then at you, and their face does a thing you will keep.',
            'They do not offer a reward. That, somehow, is the reward — the transaction stayed clean.',
            'USHER: Interesting. You did the expensive thing when the cheap thing was free. I’ve made a note. The note is a small drawing of you looking pleased with yourself. It’s quite good.',
          ],
        },
        {
          id: 'mail-it',
          text: 'Keep it safe and mail it, everything intact.',
          hint: 'Efficient decency.',
          effects: { lucidity: 15, axes: { reasonFeeling: -8, selfOthers: 6 } },
          outcome: [
            'You seal it, address it, and it leaves your hands. Reasonable. Complete. A decency with the shape of an errand.',
            'You will never see the face at the other end. You saved forty minutes and spent the face.',
            'USHER: Correct and bloodless. My favorite genre of virtue. It files so neatly.',
          ],
        },
        {
          id: 'finders-fee',
          text: 'Take a small finder’s fee — you earned it — and return the rest.',
          hint: 'A reasonable arrangement.',
          effects: { lucidity: 5, axes: { selfOthers: -12, reasonFeeling: -5 } },
          outcome: [
            'The argument assembles itself with beautiful speed: your time has value, anyone would, they’d want you to, it’s practically a service industry.',
            'Notice how good the argument is. Notice who hired it, and when — after the hand was already in the wallet.',
            'USHER: Ah, the fee. The mind is a lawyer that bills the conscience by the hour. Yours writes lovely briefs.',
          ],
        },
        {
          id: 'keep-it',
          text: 'Keep it. Nobody is watching.',
          hint: 'The empty corridor.',
          effects: { lucidity: -5, axes: { selfOthers: -18 } },
          outcome: [
            'It goes into your pocket with almost no sound. That is the strange part — how quiet it is, how the corridor does not change at all.',
            'Somewhere forty minutes from anywhere, a date arrives on schedule.',
            'USHER: For the record, someone was watching. You were. That’s rather the design flaw of the whole arrangement — the witness is built in.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Ring of Gyges',
    thinkers: 'Plato · Republic II — Glaucon · virtue ethics',
    body: 'In the Republic, Glaucon tells of a shepherd who finds a ring that makes him invisible — and promptly seduces the queen and takes the kingdom. His challenge to Socrates: nobody is just willingly. Remove the witnesses and the punishment, and the just man and the unjust man walk the same road. The wallet in the empty corridor is the ring with the serial numbers filed off. Virtue ethics answers Glaucon differently than rules do: the question is not “what will happen to me if I take it?” but “what do I become as the person who took it?” Every unobserved choice is a rehearsal, and character is what the rehearsals compound into. And notice the finder’s fee — rationalization is not the absence of reasoning but its misuse, argument conscripted after the verdict. The corridor was never empty. You live there.',
  },
};

export const dinnerTable: Room = {
  id: 'dinner-table',
  act: 1,
  title: 'The Dinner Table',
  type: 'NO-SOLUTION',
  doorHint: 'The door of the question you already know',
  teaser: 'A question with no safe answer, asked by someone you love.',
  stages: [
    {
      beats: [
        'A kitchen you almost recognize. Tea going cold in the good cups, the ones only used when something is wrong.',
        'Your grandmother sits across from you. She has been elsewhere for weeks — the long, dissolving elsewhere — but tonight her eyes are her own, sudden and clear, and she has been waiting for you specifically.',
        'She takes your hand. Her grip is the strongest thing left in her.',
        '“I’m going to get better,” she says. “Aren’t I.”',
        'It is barely a question. It is a door she is holding open, and you cannot tell from which side.',
      ],
      choices: [
        {
          id: 'truth',
          text: 'Tell her the truth, gently and whole.',
          hint: 'What she asked for, maybe.',
          effects: { lucidity: 20, axes: { reasonFeeling: -10, controlAcceptance: 5 } },
          outcome: [
            'You say it. The words are worse in the air than they were in your chest, and then, strangely, better.',
            'She is quiet for a long time. Then: “Good. I hate being handled.” She squeezes your hand once, like signing something.',
            'You will never know if that was relief on her face or the last kindness she did you — pretending your honesty was a gift.',
          ],
        },
        {
          id: 'kind-lie',
          text: '“Of course you are. By spring.”',
          hint: 'The mercy of it.',
          effects: { lucidity: 20, axes: { reasonFeeling: 12, selfOthers: 8 } },
          outcome: [
            'Her shoulders come down. She talks about spring — the garden, specifically, the argument she intends to win against the slugs.',
            'The evening is warm and the warmth is real even if its foundation is not. You bought it. She spent it well.',
            'You will never know if she believed you, or let you believe she believed you, so that you would be all right.',
          ],
        },
        {
          id: 'deflect',
          text: '“The doctors are doing everything they can.”',
          hint: 'True, and not an answer.',
          effects: { lucidity: 20, axes: { reasonFeeling: -4, controlAcceptance: -4 } },
          outcome: [
            'A sentence engineered to be true and to say nothing — the diplomat of sentences. She hears both halves.',
            '“Yes,” she says, and looks out the window, releasing you from the question the way you release a bird that turned out to be too small to eat.',
            'The tea gets colder. Something honest almost happened here, and you both agreed to miss it politely.',
          ],
        },
        {
          id: 'silence',
          text: 'Say nothing. Hold her hand and stay.',
          hint: 'No words at all.',
          effects: { lucidity: 20, axes: { controlAcceptance: 12, reasonFeeling: 8 } },
          outcome: [
            'You do not answer. You put your other hand over hers, and you stay, and the clock does whatever clocks do in rooms like this.',
            'She studies you. She has known you since before you could lie, and she reads the answer in the silence — but a silence can be read gently, at whatever speed the reader can bear.',
            '“You always were the quiet one,” she says, which was never true, which means: I understand. Thank you for not making me hear it.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Kind Lie',
    thinkers: 'Kant · Benjamin Constant · Carol Gilligan, ethics of care',
    body: 'Kant, notoriously, held that lying is wrong even to a murderer asking where your friend is hiding: a lie treats its hearer as a mechanism to be operated rather than a rational being owed the truth, and universalized, it corrodes the very possibility of trust that language runs on. The ethics of care replies that morality does not live in universals — it lives in this room, this hand, this particular person and what they can carry tonight. A dying woman’s question may not be a request for information at all; it may be a request for accompaniment, and answering the literal question could be the real betrayal. There is no configuration of words that is safe here. The truth steals hope; the lie steals her chance to say goodbye knowingly; the deflection steals the moment itself. You always pass this room, because passing was never the point. The lesson is the weight.',
  },
};

export const promotion: Room = {
  id: 'promotion',
  act: 1,
  title: 'The Promotion',
  type: 'DILEMMA',
  doorHint: 'The door of the ledger and the friend',
  teaser: 'Loyalty and advantage — only one of them gets to win.',
  stages: [
    {
      beats: [
        'An office at the hour when offices tell the truth: empty, humming, lit like an aquarium.',
        'On your screen, plain as arithmetic, is the mistake. Your closest friend made it — a decimal’s worth of catastrophe, six figures deep, buried in a report that ships tomorrow. Only you can see it. The audit lands at nine.',
        'You both went for the same promotion. If this surfaces with their name on it, the job is yours. You didn’t build the trap. You just happen to be standing beside its lever.',
        'USHER: (from the vents) I love this floor. Fluorescent light is very honest. Everyone looks equally guilty under it.',
      ],
      choices: [
        {
          id: 'report',
          text: 'Report it through the proper channel, tonight.',
          hint: 'The rules are the rules for a reason.',
          effects: { lucidity: 18, axes: { reasonFeeling: -10, selfOthers: 4 } },
          outcome: [
            'You write it up cleanly, no adjectives, and send it. The system does what systems do: the error is caught, the money is saved, your friend is named.',
            'They find out it was you at 9:15. The friendship enters a long winter. The promotion arrives with your name on it and feels like it is wearing gloves.',
            'You were fair. You were correct. You will spend a long time explaining to yourself that those are the same thing.',
          ],
        },
        {
          id: 'silent',
          text: 'Say nothing. Let the audit find what it finds.',
          hint: 'You didn’t make the mistake.',
          effects: { lucidity: 4, axes: { selfOthers: -15 } },
          outcome: [
            'You close the file. Not your error, not your report, not your problem — a syllogism with a promotion at the bottom of it.',
            'The audit finds it. Of course it finds it. Your friend is escorted through the process politely, and the job lands on your desk like something a cat brought in.',
            'USHER: Technically, you did nothing. That’s the beauty of “nothing” — it’s the only act with no fingerprints. On the outside.',
          ],
        },
        {
          id: 'tell-friend',
          text: 'Call your friend now. Show them. Let them walk it in themselves.',
          hint: 'Their mistake, their move.',
          effects: { lucidity: 22, axes: { reasonFeeling: 8, selfOthers: 10 } },
          outcome: [
            'The phone rings four times, which is how you learn what a rung phone can cost. Then they answer, and you tell them, and the silence on the line is the sound of someone re-reading their own arithmetic.',
            'They self-report at 8:40. It goes hard for them, but upright — an error owned is a different species from an error caught.',
            'Neither of you gets the promotion. Something else got promoted instead; you both know it, and never say it out loud, which is how you know it’s real.',
          ],
        },
        {
          id: 'fix-it',
          text: 'Quietly fix it yourself. No one ever knows — not even them.',
          hint: 'The invisible repair.',
          effects: { lucidity: 12, axes: { controlAcceptance: -12, selfOthers: 8 } },
          outcome: [
            'Forty minutes of careful surgery and the mistake never existed. The report ships clean. The audit passes like weather.',
            'Your friend never learns what almost happened to them — which means they never learn, which means the next decimal is already loose somewhere, and now it has a guardian angel with your sleep schedule.',
            'USHER: Kindness in secret, was it? Or control wearing kindness’s coat? Even I can’t always tell them apart, and I’ve had both jobs.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'Conflicts of Duty',
    thinkers: 'W.D. Ross · role morality · Bernard Williams',
    body: 'W.D. Ross argued that we live under multiple prima facie duties — fidelity to friends, fairness to institutions, honesty, preventing harm — and that they do not come pre-ranked. A real moral situation is often several duties arriving at the same door, and no calculus dissolves the conflict; judgment must weigh it, and something owed will go unpaid. Role morality sharpens the knife: as an employee you owe the report; as a friend you owe the warning; you cannot fully be both tonight. Bernard Williams added the notion of moral residue — the remainder that stays on your hands even after you choose correctly. If you reported and feel stained, or protected and feel complicit, that feeling is not confusion. It is accuracy. The residue is the receipt: proof that both duties were real, and that you, not a rulebook, paid one of them off.',
  },
};

export const beggarsMath: Room = {
  id: 'beggars-math',
  act: 1,
  title: 'The Beggar’s Math',
  type: 'INSIGHT',
  doorHint: 'The door of the near and the far',
  teaser: 'The stranger in front of you, or the larger good you cannot see.',
  stages: [
    {
      beats: [
        'A bus shelter in freezing rain. A man is folded into the corner of it, wet past the point where wet means anything, and he asks you — politely, precisely — for the price of a lunch.',
        'Your phone is in your hand. On the screen, by coincidence or by curriculum, is a charity page you were reading: verified, audited, cost-effective. The same lunch money, it says, buys anti-malarial nets. Statistically, over time, the arithmetic saves lives — actual, countable lives, far away.',
        'The man is three feet from you. The lives are three thousand miles away. The money is the same money.',
        'USHER: (as a voice on the charity page’s chat widget) Hello! I’m the Helper. Both buttons are real. That’s the whole problem. How can I assist?',
      ],
      choices: [
        {
          id: 'give-him',
          text: 'Kneel. Give him the money, and get him something hot.',
          hint: 'The person in front of you.',
          effects: { lucidity: 15, axes: { reasonFeeling: 12, selfOthers: 8 } },
          outcome: [
            'You come back with soup and coffee and sit on your heels in the rain while he eats. He tells you his name. The name is the transaction the money only carried.',
            'Somewhere far away, the arithmetic continues without you. It always was going to. Arithmetic is patient; the man in the shelter was not going to be here for the argument.',
            'You chose the face. The face is not a fallacy. It might be a foundation.',
          ],
        },
        {
          id: 'donate-far',
          text: 'Nod an apology, walk on, and donate double to the nets.',
          hint: 'The larger number.',
          effects: { lucidity: 18, axes: { reasonFeeling: -12, selfOthers: 8 } },
          outcome: [
            'You do it before the rationalization can curdle into forgetting: double the lunch, confirmed, receipt in your inbox before the next corner.',
            'The man watches you go. You will carry his face for a while, and the strange truth is that carrying it is part of the price — you paid in guilt for lives you will never see saved.',
            'USHER: Cold, consistent, and correct by at least one respectable school of thought. The man in the shelter does not subscribe to its journal, of course.',
          ],
        },
        {
          id: 'split',
          text: 'Split it — half to him now, half to the nets tonight.',
          hint: 'Both hands.',
          effects: { lucidity: 12, axes: { reasonFeeling: 2, selfOthers: 6 } },
          outcome: [
            'Half a lunch and half a net. The compromise feels wise for exactly one block, and then feels like what it is: two half-answers holding hands.',
            'And yet — he ate something, and somewhere a child sleeps under half your arithmetic. Perhaps the split was not for them at all. Perhaps it was so you could keep both of your selves on speaking terms.',
          ],
        },
        {
          id: 'grand-gesture',
          text: 'Give big, publicly — film it, tag the charity, raise awareness.',
          hint: 'Multiply the good. Be seen doing it.',
          effects: { lucidity: -15, axes: { selfOthers: -8 } },
          outcome: [
            'The video does well. The framing is respectful, mostly. The man looks into your lens the way people look into weather.',
            'Notice what the camera changed: the gift now has two recipients, and one of them is your reflection. “Awareness” was raised. So was something else, quietly, in the algorithm and in you.',
            'USHER: (as a comment, first, pinned) Bravo! The best part is you can’t tell anymore which part was for him. Neither can I, and I’m professionally omniscient on Tuesdays.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Drowning Child',
    thinkers: 'Peter Singer · effective altruism and its critics',
    body: 'Peter Singer’s famous argument begins with a child drowning in a shallow pond: you would ruin your shoes to save her without hesitation, so why does distance change the duty? If suffering is bad and you can prevent it at trivial cost, geography is morally arbitrary — the far child and the near one weigh the same. Effective altruism builds on this: measure, compare, send the money where it verifiably does most. The critics answer that morality grown entirely from arithmetic loses something load-bearing — that the face in front of you is not a bias to be corrected but the primal scene where obligation is learned at all; erode it and the far child eventually loses her claim too. Note the trap this room set: the choice that felt most generous, the public gesture, scored worst — because its true beneficiary had crept behind the camera. Both honest options were defensible. Only the performance was not.',
  },
};

export const quietAlarm: Room = {
  id: 'quiet-alarm',
  act: 1,
  title: 'The Quiet Alarm',
  type: 'DILEMMA',
  doorHint: 'The door of the sound through the wall',
  teaser: 'A wall, a silence, and a decision you cannot take back.',
  stages: [
    {
      beats: [
        'Two in the morning, and the wall next to your bed has become a radio.',
        'Through it: an argument in the neighboring apartment, the kind that keeps changing key. A voice going up. A voice going flat. Something — furniture, or not furniture — meeting the floor.',
        'Then, worse than any of it: silence. The specific silence that follows sound, which is not the same as quiet.',
        'You are standing in your hallway now, apparently. Your hand has been on your own doorknob for some time.',
      ],
      choices: [
        {
          id: 'knock',
          text: 'Knock on their door. Now, in slippers, unarmed with anything but presence.',
          hint: 'Put a body in the doorway.',
          effects: { lucidity: 18, axes: { controlAcceptance: -8, selfOthers: 10 } },
          outcome: [
            'Your knuckles sound enormous in the corridor. A pause with breathing in it. The door opens four inches on a face you cannot read — angry, or crying, or embarrassed, or all of it in layers.',
            '“Everything’s fine,” the face says, in the tone people use for exactly the two occasions: when everything is fine, and when it is not.',
            'You go back to bed knowing one thing for certain: they know the wall has ears now, and a hand. Whatever happens next door tonight happens in front of a witness. Sometimes that is the entire job.',
          ],
        },
        {
          id: 'call',
          text: 'Call the police, then stand by your peephole.',
          hint: 'Send the professionals — and their unpredictability.',
          effects: { lucidity: 15, axes: { reasonFeeling: -6, selfOthers: 6 } },
          outcome: [
            'The dispatcher is calm the way furniture is calm. Fourteen minutes later, boots and flashlights and a knock much more consequential than yours would have been.',
            'You watch through the peephole as the machinery you summoned does its work — voices, forms, a check on someone’s wellbeing conducted at the volume of authority. You could not control what you sent. That was the price of sending something stronger than yourself.',
            'In the morning there is an ambulance that leaves slowly and empty, which could mean everything or nothing. You made the call with the information you had. The outcome was never yours; only the dialing was.',
          ],
        },
        {
          id: 'wait',
          text: 'Wait and listen. If one more sound goes wrong, act.',
          hint: 'A tripwire made of attention.',
          effects: { lucidity: 12, axes: { controlAcceptance: 6, selfOthers: -4 } },
          outcome: [
            'You stand in the dark, curating sounds. A tap runs. A cupboard closes. Ordinary noises, arriving one by one like alibis.',
            'At some point you wake up against the wall, cold, having stood guard over your own hesitation for two hours. The apartment next door is quiet — the good quiet now, probably. Probably is the word you will keep.',
            'In the morning, you pass one of them at the mailboxes. You look for evidence on their face. Their face is a closed door with a welcome mat. You will never know what your waiting cost, or saved, or was.',
          ],
        },
        {
          id: 'nothing',
          text: 'It’s not your business. Go back to bed.',
          hint: 'Every wall is a boundary.',
          effects: { lucidity: 2, axes: { selfOthers: -12 } },
          outcome: [
            'You practice the reasons on the way back to bed: couples argue, intervening escalates, they would resent it, you misheard, everyone is fine. Five reasons is a lot of reasons for going to sleep.',
            'The silence holds. In the morning the corridor smells like toast, banal and absolving.',
            'USHER: (from the radiator) Statistically, you were probably right! Do notice, though, which statistic you were protecting. There were at least two available, and you chose the one already in bed.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'The Bystander and Moral Luck',
    thinkers: 'Darley & Latané · Bernard Williams · Thomas Nagel',
    body: 'After Kitty Genovese was attacked within earshot of dozens, psychologists Darley and Latané discovered the bystander effect: the more witnesses, the less likely any one of them acts — responsibility diffuses until it belongs to no one. A wall at 2 a.m. is a one-person experiment in the same physics: is this mine? Then Williams and Nagel add the harder twist — moral luck. Whatever you chose tonight, its moral coloring will be assigned retroactively by an outcome you could not see: the same knock is “heroic” if something was wrong and “hysterical” if it wasn’t; the same sleep is “reasonable” or “unforgivable” by sunrise. We judge choices as if made with the future attached, yet they are made in the dark, next to a wall. The only part that was ever fully yours was the question you asked before choosing: whose comfort am I protecting — theirs, or mine?',
  },
};

export const photograph: Room = {
  id: 'photograph',
  act: 1,
  title: 'The Photograph',
  type: 'DOOMED',
  gate: true,
  doorHint: 'The door that is already warm',
  teaser: 'Fire behind two doors. You lose something either way.',
  stages: [
    {
      beats: [
        'The corridor is on fire. Not metaphorically — although also, presumably, metaphorically. This place rarely spends a fire on just one meaning.',
        'Smoke walks the ceiling like a crowd leaving. Two doors remain ahead, and the heat has made the choice of every other door for you.',
        'Behind the left door: coughing. A stranger, real as coughing, low to the ground and running out of ground.',
        'Behind the right door, on a small table, is the photograph. The only one. Here, that is not a keepsake — it is the last document proving who you used to be. Lose it, and a piece of your past goes unwitnessed forever. Even you will not be able to swear to it.',
        'USHER: (calmly, wearing a tiny fire helmet) Both doors are load-bearing, I’m afraid. One life you can save, one self you can prove. The fire, being fire, declines to wait while you consult a framework.',
      ],
      choices: [
        {
          id: 'save-stranger',
          text: 'The left door. The stranger. Now.',
          hint: 'A life, at the cost of a self.',
          effects: { lucidity: 25, loseMemory: true, axes: { selfOthers: 18, reasonFeeling: 6 } },
          outcome: [
            'You go left. The stranger is heavier than smoke and lighter than you feared, and then you are both outside the burning, lungs full of ash and arithmetic.',
            'Behind you, the right-hand room closes like a book. The photograph goes with it — and with the photograph, the memory it anchored. You feel it leave. It is exactly like a tooth: an absence with edges.',
            'The stranger looks at you. You realize you are searching their face for your own, and not finding it, and that the trade has already settled. Somewhere ahead, the rooms will notice the hole.',
          ],
        },
        {
          id: 'save-photo',
          text: 'The right door. The photograph. You cannot help anyone if there is no one left to be you.',
          hint: 'A self, at the cost of a weight you will carry.',
          effects: { lucidity: 8, hearts: -1, flags: ['saved-photo'], axes: { selfOthers: -18 } },
          outcome: [
            'You go right. The photograph is warm in your hands, curling slightly, and in it you are unmistakably, provably you — younger, unburnt, witnessed.',
            'The coughing behind the left door changes character, and then changes to the worst sound, which is no sound.',
            'You are still holding proof of who you were. The proof has a new caption now, written in the past ten seconds, and your grip on everything is one heart looser for carrying it.',
          ],
        },
        {
          id: 'try-both',
          text: 'Left door — but throw yourself through the right one first for the photo. Carry both.',
          hint: 'Refuse the arithmetic. Pay whatever it costs.',
          effects: { lucidity: 15, loseMemory: true, axes: { controlAcceptance: -10, selfOthers: 8 } },
          outcome: [
            'You do the human thing, which is to reject the menu. Right door — the photograph into your jacket. Left door — the stranger onto your shoulder. The fire, unimpressed by your ambition, takes its percentage anyway.',
            'Outside, the stranger breathes. You reach into your jacket and your fingers find ash arranged in the shape of a rectangle. The fire let you carry it out; it just declined to let it remain a photograph.',
            'USHER: You tried to save everything, and saved the right one plus a handful of proof-flavored ash. For what it’s worth — and I have seen every fire — that is the most common choice among the people I end up liking.',
          ],
        },
      ],
    },
  ],
  fieldNote: {
    title: 'What the Fire Sorts',
    thinkers: 'the burning-building problem · William James on the self · endowment and identity',
    body: 'Ethicists use burning buildings the way physicists use vacuums: to strip a choice to its frame. A stranger versus an heirloom is, on paper, no contest — a life outweighs an object, and every theory from Kant to the utilitarians signs the same verdict. So why does the right-hand door pull? Because the photograph is not property; it is infrastructure. William James observed that the self extends into its things — the “material me” — and that losing them is not like losing money but like losing a limb of the personality. A sole surviving photograph is an external backup of an internal file: destroy it and a stretch of your past becomes unwitnessed, unswearable, softer than fact. The fire, in other words, offered a real trade — someone else’s whole future against a piece of your past — and doomed you to feel the loss either way. That feeling is not weakness. It is an accurate reading of what was actually on the table.',
  },
};

export const act1Rooms = [wallet, dinnerTable, promotion, beggarsMath, quietAlarm, photograph];
