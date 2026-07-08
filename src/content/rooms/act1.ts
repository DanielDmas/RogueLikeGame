import type { Reflection, Room } from '../../engine/schema';

/** Examined Path (spec 05) shorthand — a Reflection tuple in the fixed
 * consequence/duty/virtue/care order (shuffled per-display by the UI). */
const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

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
        'Usher: No cameras reach this corridor. I checked. None of them count for anything, which is rather the point of a test like this.',
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
            'Usher: You did the costly thing when the free one was available. I have made a note of it. I make very few.',
          ],
          reflections: reflect(
            'One wallet returned changes little; the habit of returning them changes a city.',
            "It was never yours; the arithmetic of outcomes doesn't enter.",
            "Ask what the person you're becoming does with found things.",
            'Someone is retracing their steps tonight; the wallet is heavier for them than for you.',
          ),
        },
        {
          id: 'mail-it',
          text: 'Keep it safe and mail it, everything intact.',
          hint: 'Efficient decency.',
          effects: { lucidity: 15, axes: { reasonFeeling: -8, selfOthers: 6 } },
          outcome: [
            'You seal it, address it, and it leaves your hands. Reasonable. Complete. A decency with the shape of an errand.',
            'You will never see the face at the other end. You saved forty minutes and spent the face.',
            'Usher: Correct, and bloodless. A virtue that files itself away so neatly — I have seen a great many of those.',
          ],
          reflections: reflect(
            'The money and the wallet arrive intact — the outcome matches walking it over in person.',
            'The obligation to return it is discharged; duty asks that it happen, not how.',
            'Notice the character built by convenience rather than by cost.',
            "A stranger's relief lands the same from an envelope — but you will never see it land.",
          ),
        },
        {
          id: 'finders-fee',
          text: 'Take a small finder’s fee — you earned it — and return the rest.',
          hint: 'A reasonable arrangement.',
          effects: { lucidity: 5, axes: { selfOthers: -12, reasonFeeling: -5 } },
          outcome: [
            'The argument assembles itself with beautiful speed: your time has value, anyone would, they’d want you to, it’s practically a service industry.',
            'Notice how good the argument is. Notice who hired it, and when — after the hand was already in the wallet.',
            'Usher: The fee. The mind keeps a lawyer on retainer for exactly this moment, and yours argues well.',
          ],
          reflections: reflect(
            "A small deduction from a stranger's loss nets positive against your own honestly spent time.",
            'The wallet, and everything folded inside it, was never yours to price.',
            'Watch how fluently the justification arrived — after the hand was already moving.',
            'Their rent is due in full; your convenience fee is not their debt to absorb.',
          ),
        },
        {
          id: 'keep-it',
          text: 'Keep it. Nobody is watching.',
          hint: 'The empty corridor.',
          effects: { lucidity: -5, axes: { selfOthers: -18 } },
          outcome: [
            'It goes into your pocket with almost no sound. That is the strange part — how quiet it is, how the corridor does not change at all.',
            'Somewhere forty minutes from anywhere, a date arrives on schedule.',
            'Usher: For the record: someone was watching. You were. That is not a flaw in the arrangement. It was always the point of it.',
          ],
          reflections: reflect(
            'One theft rarely tips a city; the harm concentrates entirely on the one person it was never yours to harm.',
            "The wallet keeps its owner's name on it whether or not you ever meet them.",
            'This is the rehearsal Gyges warned about — the self you become when nothing is watching.',
            'Forty minutes away, a date arrives that this choice just made worse.',
          ),
        },
      ],
      explanation:
        "You found a stranger's wallet full of cash, and nobody is watching. This is one of the oldest questions in philosophy: are you only honest because you're afraid of getting caught? Imagine finding cash on an empty street with no cameras, no witnesses — would you still return it? The philosopher Plato told a story about a magic ring that makes you invisible, to ask exactly this: if nothing bad would ever happen to you for keeping it, would you? There's no trick question here — it's just asking what kind of person you are when nobody's grading you.",
    },
  ],
  fieldNote: {
    title: 'The Ring of Gyges',
    thinkers: 'Plato · Republic II — Glaucon · virtue ethics',
    body: 'In the Republic, Glaucon tells of a shepherd who finds a ring that makes him invisible — and promptly seduces the queen and takes the kingdom. His challenge to Socrates: nobody is just willingly. Remove the witnesses and the punishment, and the just man and the unjust man walk the same road. The wallet in the empty corridor is the ring with the serial numbers filed off. Virtue ethics answers Glaucon differently than rules do: the question is not “what will happen to me if I take it?” but “what do I become as the person who took it?” **Every unobserved choice is a rehearsal, and character is what the rehearsals compound into.** And notice the finder’s fee — rationalization is not the absence of reasoning but its misuse, argument conscripted after the verdict. The corridor was never empty. You live there.',
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
      explanation:
        "Your grandmother, who is dying, asks if she's going to get better — and you don't know what she truly wants to hear. This is the classic \"kind lie\" problem: is it ever right to lie to someone to protect them, or does real love mean always telling the truth, even when it hurts? Think about a friend who asks whether an outfit looks good right before a big interview they can't reschedule — sometimes honesty helps, sometimes it just wounds without changing anything. There's no clean answer; every option here costs you something different.",
    },
  ],
  fieldNote: {
    title: 'The Kind Lie',
    thinkers: 'Kant · Benjamin Constant · Carol Gilligan, ethics of care',
    body: 'Kant, notoriously, held that lying is wrong even to a murderer asking where your friend is hiding: a lie treats its hearer as a mechanism to be operated rather than a rational being owed the truth, and universalized, it corrodes the very possibility of trust that language runs on. The ethics of care replies that morality does not live in universals — it lives in this room, this hand, this particular person and what they can carry tonight. A dying woman’s question may not be a request for information at all; it may be a request for accompaniment, and answering the literal question could be the real betrayal. **There is no configuration of words that is safe here.** The truth steals hope; the lie steals her chance to say goodbye knowingly; the deflection steals the moment itself. You always pass this room, because passing was never the point. The lesson is the weight.',
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
        'Usher: I have always liked this floor, at this hour. Fluorescent light is an honest light — it makes everyone look equally guilty.',
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
          reflections: reflect(
            'The error is caught before it costs the company more than one friendship.',
            'You owed the report the truth its ledger asked for, regardless of who signed the mistake.',
            'Correctness that costs you nothing personal is easy; this cost you something real.',
            'Your friend absorbs a public reckoning for a private arithmetic mistake — weigh what the friendship can carry.',
          ),
        },
        {
          id: 'silent',
          text: 'Say nothing. Let the audit find what it finds.',
          hint: 'You didn’t make the mistake.',
          effects: { lucidity: 4, axes: { selfOthers: -15 } },
          outcome: [
            'You close the file. Not your error, not your report, not your problem — a syllogism with a promotion at the bottom of it.',
            'The audit finds it. Of course it finds it. Your friend is escorted through the process politely, and the job lands on your desk like something a cat brought in.',
            'Usher: Technically, you did nothing at all. Nothing is the one act that leaves no fingerprints — on the outside.',
          ],
          reflections: reflect(
            'Nothing changes except who ends up promoted — the audit finds the error regardless.',
            "Omission is still a choice; the report you didn't write was still owed.",
            "Notice how easily 'not my problem' financed something you already wanted.",
            'Your friend faces the audit exactly as unprotected as if you had never seen the error at all.',
          ),
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
          reflections: reflect(
            'Neither of you gets the job, but the error is caught the way that costs your friend least.',
            'You gave them what was owed first: the chance to own their own mistake.',
            'Loyalty here cost you the promotion outright — the costly version of the trait, not the comfortable one.',
            'Your friend faces the consequence, but accompanied and warned, instead of ambushed.',
          ),
        },
        {
          id: 'fix-it',
          text: 'Quietly fix it yourself. No one ever knows — not even them.',
          hint: 'The invisible repair.',
          effects: { lucidity: 12, axes: { controlAcceptance: -12, selfOthers: 8 } },
          outcome: [
            'Forty minutes of careful surgery and the mistake never existed. The report ships clean. The audit passes like weather.',
            'Your friend never learns what almost happened to them — which means they never learn, which means the next decimal is already loose somewhere, and now it has a guardian angel with your sleep schedule.',
            'Usher: Kindness, in secret. Or control, in kindness’s coat. I confess I cannot always tell them apart myself, and I have held both positions.',
          ],
          reflections: reflect(
            'The mistake never happened; the report ships clean and your friend learns nothing from it.',
            'The report is now technically honest, but a debt of disclosure to your friend goes unpaid.',
            "Ask whether this was kindness in secret, or control wearing kindness's coat.",
            'You protected them from the sting, and also from the chance the sting might have taught them something.',
          ),
        },
      ],
      explanation:
        "Your best friend made a costly mistake at work, only you noticed, and reporting it might get you the promotion you're both competing for. This is about what you owe different people at the same time: your employer wants honesty, your friend wants loyalty, and you can't fully give both. It's like finding out your best friend cheated on a test you both needed to pass to get into the same program — do you tell the teacher, warn your friend privately, or stay quiet? Whatever you choose, something you value doesn't get paid in full.",
    },
  ],
  fieldNote: {
    title: 'Conflicts of Duty',
    thinkers: 'W.D. Ross · role morality · Bernard Williams',
    body: 'W.D. Ross argued that we live under multiple prima facie duties — fidelity to friends, fairness to institutions, honesty, preventing harm — and that they do not come pre-ranked. A real moral situation is often several duties arriving at the same door, and no calculus dissolves the conflict; judgment must weigh it, and something owed will go unpaid. Role morality sharpens the knife: as an employee you owe the report; as a friend you owe the warning; you cannot fully be both tonight. Bernard Williams added the notion of moral residue — the remainder that stays on your hands even after you choose correctly. If you reported and feel stained, or protected and feel complicit, that feeling is not confusion. It is accuracy. **The residue is the receipt: proof that both duties were real, and that you, not a rulebook, paid one of them off.**',
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
        'Usher: (a small voice, from the charity page’s chat window) Both of these are real. That is the whole difficulty tonight. How may I help?',
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
          reflections: reflect(
            'One dinner, one night, against the greater number the same money could have reached elsewhere.',
            "The man in front of you made a direct claim; distance doesn't dissolve a claim already made.",
            'Ask what kind of person kneels in the rain for someone with nothing to offer back.',
            'He has a name now, because you asked — proximity turned arithmetic into a person.',
          ),
        },
        {
          id: 'donate-far',
          text: 'Nod an apology, walk on, and donate double to the nets.',
          hint: 'The larger number.',
          effects: { lucidity: 18, axes: { reasonFeeling: -12, selfOthers: 8 } },
          outcome: [
            'You do it before the rationalization can curdle into forgetting: double the lunch, confirmed, receipt in your inbox before the next corner.',
            'The man watches you go. You will carry his face for a while, and the strange truth is that carrying it is part of the price — you paid in guilt for lives you will never see saved.',
            'Usher: Cold, consistent, and correct by at least one respectable accounting. The man in the shelter does not read that particular journal.',
          ],
          reflections: reflect(
            'The same money, verified, saves more suffering per unit spent than the meal in front of you.',
            'Nothing you owe the man specifically outweighs what the calculation owes the many.',
            'Notice what it costs to walk past a face for a number — that discomfort may be the harder thing done right.',
            'You carry his face, unresolved, as the price of choosing the ones you cannot see.',
          ),
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
          reflections: reflect(
            'Half a solution twice is arguably a worse expected outcome than either option chosen whole.',
            'Splitting discharges neither claim fully — the near one and the far one both go half-answered.',
            'Ask whether the compromise served them, or mainly served your need to feel undivided.',
            'He still ate something tonight — a half-measure is not nothing to the person receiving it.',
          ),
        },
        {
          id: 'grand-gesture',
          text: 'Give big, publicly — film it, tag the charity, raise awareness.',
          hint: 'Multiply the good. Be seen doing it.',
          effects: { lucidity: -15, axes: { selfOthers: -8 } },
          outcome: [
            'The video does well. The framing is respectful, mostly. The man looks into your lens the way people look into weather.',
            'Notice what the camera changed: the gift now has two recipients, and one of them is your reflection. “Awareness” was raised. So was something else, quietly, in the algorithm and in you.',
            'Usher: (a comment, pinned first) Well done. Though notice: you can no longer quite tell which part of this was for him. Neither, for once, can I.',
          ],
          reflections: reflect(
            'The gift and the awareness may do real good — measure whether the video reached new givers.',
            "A gift owed to a stranger's dignity isn't discharged by being staged for an audience.",
            'The choice that felt most generous made you, not him, the visible subject of the frame.',
            'He is asked to perform gratitude for a lens, on top of everything the night already asked of him.',
          ),
        },
      ],
      explanation:
        "A cold, wet stranger asks you for money, and at the same moment you know that the same amount of money could save more lives if sent somewhere far away instead. This is the \"near vs. far\" problem: does someone right in front of you matter more than a stranger you'll never meet, even if helping the stranger technically does more good? It's like choosing between buying lunch for a classmate who's clearly struggling today, or donating that same money to a charity that, on paper, helps more people overall. Both choices are kind. They're just kind in different directions.",
    },
  ],
  fieldNote: {
    title: 'The Drowning Child',
    thinkers: 'Peter Singer · effective altruism and its critics',
    body: 'Peter Singer’s famous argument begins with a child drowning in a shallow pond: you would ruin your shoes to save her without hesitation, so why does distance change the duty? If suffering is bad and you can prevent it at trivial cost, geography is morally arbitrary — the far child and the near one weigh the same. Effective altruism builds on this: measure, compare, send the money where it verifiably does most. The critics answer that morality grown entirely from arithmetic loses something load-bearing — that the face in front of you is not a bias to be corrected but the primal scene where obligation is learned at all; erode it and the far child eventually loses her claim too. Note the trap this room set: the choice that felt most generous, the public gesture, scored worst — because its true beneficiary had crept behind the camera. **Both honest options were defensible. Only the performance was not.**',
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
          reflections: reflect(
            'Whatever is happening next door now happens with a witness at the door — outcomes shift little, if at all.',
            "A neighbor in possible danger creates a claim on you that a locked door doesn't erase.",
            'Ask what kind of person puts an unarmed body between a stranger and an unknown risk.',
            'Presence, even wordless, tells whoever is inside they were not alone in that apartment tonight.',
          ),
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
          reflections: reflect(
            'Professional intervention may resolve more, or escalate more, than your own knock — you cannot fully predict which.',
            'Reporting a possible harm discharges an obligation to safety that inaction does not.',
            'Sending responsibility onward is not cowardice by default — ask if it was the considered choice, or the easy one.',
            'You cannot control what you summoned once it arrived — that unpredictability is the price of asking for more force than yours.',
          ),
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
          reflections: reflect(
            'Nothing changes until you decide something has — the outcome is mostly whatever was already happening.',
            "Vigilance without action discharges no one's claim on you; attention was never the whole obligation.",
            "Notice how long 'not yet' can substitute for a decision before it quietly becomes one.",
            'Whoever is behind that wall does not know you are listening, so the listening comforts only you.',
          ),
        },
        {
          id: 'nothing',
          text: 'It’s not your business. Go back to bed.',
          hint: 'Every wall is a boundary.',
          effects: { lucidity: 2, axes: { selfOthers: -12 } },
          outcome: [
            'You practice the reasons on the way back to bed: couples argue, intervening escalates, they would resent it, you misheard, everyone is fine. Five reasons is a lot of reasons for going to sleep.',
            'The silence holds. In the morning the corridor smells like toast, banal and absolving.',
            'Usher: (from the radiator) Statistically, you were probably right. Notice, though, which statistic you chose to be governed by. There were at least two on offer, and you picked the one already lying in bed.',
          ],
          reflections: reflect(
            'The silence holds either way; your five reasons changed nothing about what happened behind that wall.',
            'A closed door is a real boundary, but a possible cry for help is a real claim — the two do not simply cancel.',
            'Count how many reasons it took to go back to sleep — that number is itself information.',
            'If something was wrong, no one behind that wall was thought of as belonging to you tonight.',
          ),
        },
      ],
      explanation:
        "You hear a scary fight through the wall, then silence — and you don't know if that's a relief or something worse. This is about how far your responsibility for a stranger's safety actually goes: do you get involved, call for help, or mind your own business? Imagine hearing shouting from a neighbor's apartment at 2 a.m. and not knowing if it's a bad argument or something dangerous — every option (knocking, calling the police, waiting, ignoring it) has a real cost, and you'll probably never find out for certain if you did the right thing.",
    },
  ],
  fieldNote: {
    title: 'The Bystander and Moral Luck',
    thinkers: 'Darley & Latané · Bernard Williams · Thomas Nagel',
    body: 'After the widely reported (and, later reporting found, partly exaggerated) case of Kitty Genovese’s murder, psychologists Darley and Latané ran the experiments that named the bystander effect: the more witnesses present, the less likely any one of them acts — responsibility diffuses until it belongs to no one. A wall at 2 a.m. is a one-person experiment in the same physics: is this mine? Then Williams and Nagel add the harder twist — moral luck. Whatever you chose tonight, its moral coloring will be assigned retroactively by an outcome you could not see: the same knock is “heroic” if something was wrong and “hysterical” if it wasn’t; the same sleep is “reasonable” or “unforgivable” by sunrise. We judge choices as if made with the future attached, yet they are made in the dark, next to a wall. **The only part that was ever fully yours was the question you asked before choosing: whose comfort am I protecting — theirs, or mine?**',
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
        'Usher: Both doors are load-bearing, I’m afraid. Behind one, a life you can still save. Behind the other, a self you can still prove. The fire will not wait for you to consult a framework.',
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
            'Usher: You tried to save everything, and saved the person, and a handful of ash where the proof used to be. For what it is worth, that is the choice I see most often from the travelers I come to respect.',
          ],
        },
      ],
      explanation:
        "A building is on fire, and you can save a stranger's life through one door, or the only proof of who you used to be through the other — not both, cleanly. This is a classic \"impossible choice\" used to test what actually matters to us: is a photograph just a thing, or does losing your only memory-anchor mean losing a piece of yourself? Imagine a house fire where you could grab a family photo album (the only copies, nothing backed up online) or help a stranger trapped nearby — both feel like real losses, and this room is built so that whichever you pick, it costs you something real.",
    },
  ],
  fieldNote: {
    title: 'What the Fire Sorts',
    thinkers: 'the burning-building problem · William James on the self · endowment and identity',
    body: 'Ethicists use burning buildings the way physicists use vacuums: to strip a choice to its frame. A stranger versus an heirloom is, on paper, no contest — a life outweighs an object, and every theory from Kant to the utilitarians signs the same verdict. So why does the right-hand door pull? Because the photograph is not property; it is infrastructure. William James observed that the self extends into its things — the “material me” — and that losing them is not like losing money but like losing a limb of the personality. A sole surviving photograph is an external backup of an internal file: destroy it and a stretch of your past becomes unwitnessed, unswearable, softer than fact. **The fire, in other words, offered a real trade — someone else’s whole future against a piece of your past — and doomed you to feel the loss either way.** That feeling is not weakness. It is an accurate reading of what was actually on the table.',
  },
};

export const buridansQueue: Room = {
  id: 'buridans-queue',
  act: 1,
  title: 'The Buridan Annex',
  type: 'NO-SOLUTION',
  doorHint: 'The door of the two doors',
  teaser: 'A choice that is only hard because nothing makes it easy.',
  stages: [
    {
      beats: [
        'An annex you don’t remember the corridor growing. Two doors face you, cut from the same wood, hung by the same hand, lit by the same bulb.',
        'A brass plaque is screwed into the wall exactly between them: BOTH LEAD ONWARD. NEITHER IS WRONG. Someone has polished the plaque considerably more than the doors.',
        'Nothing distinguishes them. You check twice. The second check is the kind you do only when you already know the answer and are stalling for a better one.',
        'Overhead, the corridor’s one working clock — hands, unlike anywhere else in this place — ticks with something that resembles commentary.',
        'Usher: Take your time. I mean that a little unkindly. Most travelers do.',
      ],
      choices: [
        {
          id: 'take-left',
          text: 'Stop deliberating. Pick the left door and go.',
          hint: 'Let your own hand be the coin toss.',
          effects: { lucidity: 10, axes: { controlAcceptance: -6 } },
          outcome: [
            'You stop calculating mid-thought and simply go — left, because left was nearest your hand, which turns out to be a perfectly good reason to end an infinite regress.',
            'The door closes behind you sensibly, uneventfully, the way doors do when nothing was actually riding on which one you chose.',
            'Usher: You traded certainty for speed. I have rarely met a traveler who regretted that particular trade as much as they feared they would, beforehand.',
          ],
        },
        {
          id: 'weigh-it',
          text: 'Reason it out first — there must be some difference.',
          hint: 'Find the tell before you commit.',
          effects: { lucidity: 12, axes: { reasonFeeling: -7 } },
          outcome: [
            'You circle both doors, testing the hinges, the grain, the angle of the light — and somewhere in the third circuit you notice you have stopped gathering evidence. You are stalling with extra steps.',
            'Eventually you pick one anyway, and immediately produce, unbidden, three good reasons you chose it. All three arrived after your hand was already on the handle.',
            'Usher: The reasoning was real. It simply was not first. Notice how rarely it is.',
          ],
        },
        {
          id: 'sit-down',
          text: 'Sit down between the doors and wait.',
          hint: 'Let the room decide, if it wants to.',
          effects: { lucidity: 10, axes: { controlAcceptance: 8 } },
          outcome: [
            'You sit on the cold floor between two identical doors and do the bravest boring thing available to you: nothing, entirely on purpose.',
            'After a while — you stop counting how long — a draft moves through the left one, and it drifts open a few inches, as if whatever waited behind it had simply been patient about the hinge.',
            'Usher: You did not choose. The room chose for you, eventually, the way rooms do when no one else will. Notice that declining did not exempt you from an outcome — it only billed the waiting to someone else. Tonight, to me.',
          ],
        },
      ],
      explanation:
        "Two doors are completely identical in every way, and you have to somehow pick one anyway. This one isn't really a moral dilemma — it's about how we make decisions at all when there's genuinely no good reason to prefer one option over another. There's an old story about a hungry donkey standing exactly between two identical piles of hay, who supposedly starves to death because it can never find a reason to choose one over the other. It's a playful reminder that sometimes \"just picking\" is the only sane move — waiting for a perfect reason that will never come is its own kind of choice.",
    },
  ],
  fieldNote: {
    title: 'The Ass Between Two Bales',
    thinkers: 'Jean Buridan · Jean-Paul Sartre, radical freedom',
    body: 'Medieval logicians described a hungry ass placed exactly between two identical bales of hay: with no reason to prefer either, it starves at precisely the point of perfect rationality — reason alone, the paradox suggests, cannot originate action, only rank alternatives that already differ. Sartre carried the same problem into ethics: we are, he wrote, condemned to be free, and refusing to choose is itself a choice, made in bad faith the moment we pretend otherwise. The two doors here are honest about what most decisions disguise — that beneath the reasons we give, an arbitrary first move has to happen, a spending of will where logic has nothing left to spend. **The doors were never the hard part. The moment before your hand moved was.** Notice, too, how quickly reasons arrived once you had already chosen: the mind keeps excellent counsel for verdicts it did not actually help reach.',
  },
};

export const theReference: Room = {
  id: 'the-reference',
  act: 1,
  title: 'The Reference Letter',
  type: 'DILEMMA',
  doorHint: 'The door of the borrowed pen',
  teaser: 'Someone you love needs a sentence from you that may not be true.',
  stages: [
    {
      beats: [
        'A desk lamp, a blank line waiting for a signature, and a job application with your friend’s name typed neatly across the top of it.',
        'You have known them a decade. They are kind in a way that costs them nothing to be, loyal in a way that has cost them plenty — and, quietly, the way old friends know things without saying them, not very good at this particular job.',
        'The position wants someone precise. They are wonderful. The two facts sit uncomfortably close together on the page.',
        'The reference is due by morning. It only needs one sentence, really. That is what makes it difficult — one sentence is exactly enough room to lie in, or to wound in, or to hide in.',
        'Usher: I am told good references are common courtesies. I have read enough of them to suspect “common” is doing quite a lot of that sentence’s work.',
      ],
      choices: [
        {
          id: 'write-honest',
          text: 'Write the honest reference — measured, fair, and not glowing.',
          hint: 'Let the truth cost what it costs.',
          effects: { lucidity: 16, axes: { reasonFeeling: -6, selfOthers: -5 } },
          outcome: [
            'You write carefully, giving credit exactly where it is earned and no further, and the letter that results is fair the way a scale is fair — accurate, and comfortless.',
            'They do not get the job. They never learn precisely why, though friendships have a way of noticing weather even without a forecast.',
            'Usher: You told the truth to a stranger and let a friend absorb the cost of it. That is not nothing. It is also not free.',
          ],
          reflections: reflect(
            'The stranger reading it gets an accurate signal; your friend loses a chance the letter could have opened.',
            "A reference is a promise to the stranger relying on it — that promise outranks the friendship's comfort.",
            'Fairness that costs you nothing personal is easy; this cost you a friend an opportunity.',
            'Your friend absorbs the letter\'s honesty without ever getting to answer for themselves.',
          ),
        },
        {
          id: 'write-kind',
          text: 'Write the generous version — true enough, warmer than deserved.',
          hint: 'Round every corner up.',
          effects: { lucidity: 12, axes: { reasonFeeling: 7, selfOthers: 7 } },
          outcome: [
            'You reach for superlatives that are technically defensible and stack them until the letter glows a little brighter than the person it describes.',
            'They get an interview. What happens after that interview is no longer your sentence to write — though you notice you are hoping, hard, that the job grows to fit the letter, rather than the other way around.',
            'Usher: Kindness, forward-dated. You have written a check against their future performance. I confess I have written a few myself.',
          ],
          reflections: reflect(
            'The interview happens; what follows is no longer the letter\'s outcome to own.',
            "Inflating a promise made to a stranger spends their trust on your friend's behalf.",
            'Ask what it costs your own credibility to round every corner up, repeatedly, for people you love.',
            "You're hoping the job grows to fit the letter — a kindness that quietly transfers the risk onto your friend.",
          ),
        },
        {
          id: 'decline',
          text: 'Say you cannot write it — return the pen.',
          hint: 'Withhold rather than shade the truth.',
          effects: { lucidity: 14, axes: { selfOthers: -9, controlAcceptance: -4 } },
          outcome: [
            'You hand the form back unsigned, with an explanation that sounds better in your head than it will in theirs.',
            'Silence is not neutral. It is information, and they will read it as exactly what it is — the one reference you could not bring yourself to give.',
            'Usher: You told the truth by omission, which is the cheapest way to tell it. They will still hear it. Silence rarely stays private for long.',
          ],
          reflections: reflect(
            'Silence reads as exactly what it is — the reference withheld — resembling the honest letter minus the specifics.',
            "Declining discharges your duty to the stranger, but not your duty to a friend owed an honest word.",
            'Withholding is the cheapest way to tell a hard truth — ask whether cheap is the same as kind.',
            "Your friend will feel the silence; it rarely stays as private as it seemed when you handed back the pen.",
          ),
        },
      ],
      explanation:
        "A close friend needs a reference letter from you for a job they're not quite right for, and whatever you write will be read by a stranger who's trusting your honesty. This is about who your loyalty is actually owed to: the friend you love, or the stranger relying on your word? It's like being asked to vouch for a friend's babysitting skills for a family you don't know, when you're pretty sure they're not great with kids — every version of the letter (glowing, honest, or refusing to write it) treats someone unfairly.",
    },
  ],
  fieldNote: {
    title: 'The Kind Lie, Notarized',
    thinkers: 'Immanuel Kant · Bernard Williams, the ethics of testimony',
    body: 'Kant held that truthfulness is a duty owed to humanity as such, not calibrated to whoever is asking or whatever they can bear: a reference is a promise, silently made to a stranger who will rely on it, and inflating it treats that stranger as a means to your friend’s end. Bernard Williams complicates the neatness — a reference is also a genre, half-ritual, read by people fluent in its usual inflation, discounted before the paragraph even finishes. So which convention are you actually bound by: the strict one, or the one everyone quietly agrees to fudge? Notice what the letter really risks: not your integrity in the abstract, but a stranger’s real trust, spent on your friend’s behalf without their knowledge or consent. **Loyalty that costs a third party is not loyalty — it is a transfer.** Whatever you signed, you will likely feel its weight the day the reference is tested by an ordinary difficult Tuesday at that job — and so, less fairly, will they.',
  },
};

export const act1Rooms = [wallet, dinnerTable, promotion, beggarsMath, quietAlarm, buridansQueue, theReference, photograph];
