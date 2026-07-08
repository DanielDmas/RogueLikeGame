import type { Reflection, Room } from '../../engine/schema';
import { hasFlag } from '../../engine/gameState';
import { anamnesisAvailable, punchlineUnlocked } from '../../engine/endings';

/** Examined Path (spec 05) shorthand — a Reflection tuple in the fixed
 * consequence/duty/virtue/care order (shuffled per-display by the UI). */
const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

export const boulder: Room = {
  id: 'boulder',
  act: 4,
  title: 'The Boulder',
  type: 'NO-SOLUTION',
  doorHint: 'The door at the bottom of the hill',
  teaser: 'A task that undoes itself. The question is how you carry it.',
  stages: [
    {
      beats: [
        'The fog is thinning. Through it, for the first time, something like dawn — a horizon with an actual color. And between you and the horizon: a hill, and a task.',
        'Stones. A neat sign: STACK THE STONES TO PROCEED. You stack them. On the placement of the final stone, the stack unstacks itself — not violently, almost apologetically, the stones rolling back to their exact starting positions like employees returning from a break.',
        'You try again. Same result. The room, to its credit, is honest: a second sign, smaller, lower down, reads: THE TASK CANNOT BE COMPLETED. THE TASK IS ALSO MANDATORY. WE ARE AWARE OF THE TENSION.',
        'A man is sitting on one of the stones. He looks ancient in a way that has nothing to do with his face — the look of someone who has simply been here far longer than there are words for. He nods at you, not unkindly, and gestures at the hill with the weariness of a colleague.',
        'Usher: (arriving with a thermos) You have met our longest-serving resident. He has tried everything — engineering, prayer, argument. The stones always come down. The only thing anyone has ever managed to change is the carrying of them.',
      ],
      choices: [
        {
          id: 'rage',
          text: 'Rage at it. Stack faster, harder — make the hill regret this.',
          hint: 'Fight the stone.',
          effects: { lucidity: 10, axes: { controlAcceptance: -10 } },
          outcome: [
            'You attack the task. You develop techniques, footholds, a genuinely impressive throwing method. The stones come down. You go again. The stones come down. There is a purity in the fury, for a while — the hill becomes the enemy, and an enemy is at least a companion.',
            'You stop, eventually, lungs burning, and notice the man watching you with deep recognition. “Year one,” he says softly. “Good year, actually.” The rage was real and the rage was fuel and the rage changed nothing but you — which, a small voice notes, is the only thing anything changes here.',
          ],
        },
        {
          id: 'irony',
          text: 'Laugh at it. Stack the stones badly, on purpose, with commentary.',
          hint: 'If it’s absurd, be absurd back.',
          effects: { lucidity: 15, axes: { reasonFeeling: 6 } },
          outcome: [
            'You begin narrating the task like a nature documentary. You stack the stones into insulting shapes. You give each stone a name and a backstory and fire one of them for insubordination.',
            'The man laughs — a sound like something unrusting — and the Usher applauds from the thermos. The stones still come down. But the hill, you notice, has stopped being heavy in one specific way: it cannot humiliate someone who refuses to hold it sacred. Irony is not the deepest answer, the man tells you, wiping his eyes. “But it got me through the fourth century, and I won’t hear a word against it.”',
          ],
        },
        {
          id: 'refuse-carry',
          text: 'Refuse. Sit down. You will not perform meaninglessness for anyone.',
          hint: 'The strike. It will cost you.',
          effects: { hearts: -1, lucidity: 5, axes: { controlAcceptance: -6 } },
          outcome: [
            'You sit down among the stones and fold the whole task away from you. It is not laziness — it is a position: some assignments deserve refusal, and mandatory futility is surely one.',
            'The room does not punish you with thunder. It does something quieter: nothing. The dawn stays exactly where it is, unearned, and the hours pass through you, and you feel — precisely, physically — a heart’s worth of grip loosen. Not because refusal is wrong. Because refusal, here, is a vote to stop moving, and stillness in this place has a current, and the current pulls one way.',
            'Usher: (draping a coat over your shoulders) The strike is noted. Respected, even. But the hill is the only road there is. Even he pushes. Not because it means something. Because he has decided the pushing is his. Come. Up.',
          ],
        },
        {
          id: 'carry-well',
          text: 'Begin again — without hope and without despair. Make the carrying yours.',
          hint: 'The stone is the road.',
          effects: { lucidity: 25, axes: { controlAcceptance: 15 } },
          outcome: [
            'You stack the stones. You do it neither fast nor slow, neither expecting success nor performing defeat — you do it the way one does a thing that is simply one’s thing to do. And something shifts, not in the hill but in the grammar: the task stops being an obstacle between you and the dawn, and becomes the place where you happen to be alive right now.',
            'The stones come down. You notice you are not waiting for them not to. You begin again, and the beginning-again is not failure repeating — it is a rhythm, and rhythms belong to the drummer.',
            'The man stands, dusts off his hands, and does something the Usher later says he has never once seen before: he helps. Two stackers, one impossible task, dawn coming up like a held note. “You see it,” he says. It is not a question. For one full stack — before it falls, and it does fall — the hill is, unmistakably, happy.',
          ],
        },
      ],
      explanation:
        "You're given a task that can never actually be finished — no matter how well you stack the stones, they always fall back down, forever. This room is built on the ancient myth of Sisyphus, a man condemned to push a boulder uphill forever, watching it roll back down every single time. The question isn't \"how do I win\" — you can't — it's about how you'd choose to spend your energy on something that will never be \"done\": with rage, with jokes, by refusing to try, or by simply making the doing itself feel like it's yours, even knowing it never ends.",
    },
  ],
  fieldNote: {
    title: 'Sisyphus, Happy',
    thinkers: 'Albert Camus · The Myth of Sisyphus · the absurd',
    body: 'Camus called it the only serious philosophical problem: if life has no given meaning, why continue it? His answer begins with Sisyphus, condemned by the gods to roll a boulder uphill forever, watching it fall each time. Camus refuses both exits — suicide (yielding to meaninglessness) and what he called philosophical suicide (leaping into consoling systems that promise the meaning back). The absurd, for him, is not the world’s property; it is the collision between our demand for meaning and the universe’s silence — and it must be kept alive, not resolved. The scandalous last line — “one must imagine Sisyphus happy” — is not optimism. It is the claim that in the walk back down, lucid, unconsoled, and continuing anyway, Sisyphus becomes superior to his punishment: the boulder is his boulder, the rhythm his own. This room could not be won because the point was never the stack. **It was the walk down: the moment the task stopped happening to you and began, precisely, to be yours.**',
  },
};

export const lastMessage: Room = {
  id: 'last-message',
  act: 4,
  title: 'The Last Message',
  type: 'DILEMMA',
  doorHint: 'The door with the letter slot',
  teaser: 'One sentence back to the waking world. Who gets it?',
  stages: [
    {
      beats: [
        'A small post office at the edge of the fog, dawn now definite through its one window. The counter is worn smooth by however many elbows, and behind it, the Usher wears a postal cap with visible pride.',
        'Usher: Final services before the Threshold. One message may be sent back — to the waking world, to anyone. One sentence. It goes through, that I can guarantee; how it arrives is not mine to say. A dream, a hunch, a song they can’t place, a sudden need to call someone. The medium improvises. The message holds.',
        'Usher: (sliding a pen across; the pen is warm) One sentence, traveler. The pieces of you that walked these rooms have been drafting it all along, whether you noticed or not. What do you send?',
      ],
      choices: [
        {
          id: 'wait-for-me',
          text: '“Wait for me. I’m on my way back.”',
          hint: 'A promise, thrown across the gap.',
          effects: { lucidity: 15, axes: { controlAcceptance: -4 } },
          outcome: [
            'You write it, and the sentence does what promises do: it binds the sender. Somewhere in the waking world, someone will pause mid-afternoon at a feeling like a hand on the shoulder, and not know why they suddenly put the kettle on and glanced at the door.',
            'Usher: (stamping it with great ceremony) A promise. The oldest genre. It routes fastest, for what it’s worth — hope has excellent postage.',
          ],
          reflections: reflect(
            'The promise reaches them however it arrives — as a hunch, a feeling, a sudden need to put the kettle on — and does what promises do: it binds the sender too.',
            'A promise made across a fog you cannot cross back through is a debt you knowingly can never collect on.',
            'Ask whether spending your one sentence on hope was courage, or simply the sentence that was easiest to write.',
            'Somewhere, someone pauses mid-afternoon at a feeling they can’t name — a small, real weight of care, delivered without a return address.',
          ),
        },
        {
          id: 'not-a-burden',
          text: '“You were never a burden. Tell everyone. That’s the whole message.”',
          hint: 'Spend your one sentence on someone else’s wound.',
          effects: { lucidity: 20, axes: { selfOthers: 8 } },
          available: (s) => s.axes.selfOthers >= 10,
          outcome: [
            'You had one sentence, and you gave it away — addressed it to the person you know keeps the opposite belief filed where they think no one can see it.',
            'It will arrive as a dream they wake from already crying, unembarrassed for once, lighter in a way they will not examine because examining might break it. They will make breakfast differently. Small things. It compounds.',
            'Usher: (quietly, stamping it twice, which is not procedure) Most travelers send for themselves. The ones who don’t — their letters, I’ve noticed, are the only ones the fog doesn’t touch on the way out.',
          ],
          reflections: reflect(
            'One sentence, spent entirely on unweighting someone else’s private ledger, arrives calibrated precisely to loosen exactly that.',
            'You owed them nothing more with your one sentence, and yet gave it entirely to a debt that was never technically yours to settle.',
            'Ask what it costs to spend your only outgoing word on someone else’s wound instead of your own goodbye.',
            'It arrives as a dream they wake from crying, unembarrassed for once — a message addressed entirely to someone else’s need.',
          ),
        },
        {
          id: 'keep-the-notes',
          text: '“It all almost makes sense. Keep the notes — I can prove most of it now.”',
          hint: 'Send the finding, not the feeling.',
          effects: { lucidity: 18, axes: { reasonFeeling: -4 } },
          available: (s) => s.axes.reasonFeeling <= -10,
          outcome: [
            'A dispatch from the far side of the argument — because that is what you have been running these rooms as: an investigation. And investigations file reports.',
            'It will arrive as a 4 a.m. thought that makes someone sit up and reach for paper — one of those ideas that feels received rather than had. They will spend years on it. It will be good work. It was yours, and now it is theirs, which is how every idea has ever traveled.',
            'Usher: A citation across the void. (stamping it, moved despite himself) It routes slow, but it routes deep. Some sentences take decades to arrive, and land like depth charges when they do.',
          ],
          reflections: reflect(
            'The finding outlives the feeling — a thought arriving at four in the morning gets decades of someone else’s life spent proving it true.',
            'You owed the argument you were building an ending, and this sentence is the only ending available — a report finally filed.',
            'Ask whether sending the finding instead of the feeling was honesty about what mattered to you, or an old habit of hiding behind an argument.',
            'Whoever receives this spends years on work that was never truly theirs, and becomes exactly the kind of person who does good with borrowed things.',
          ),
        },
        {
          id: 'remember-yours',
          text: '“I don’t remember my face anymore. But I remember yours.”',
          hint: 'Send the truth of what the fire cost, and what it didn’t.',
          effects: { lucidity: 25, axes: { reasonFeeling: 8 } },
          available: (s) => s.memoryLost,
          outcome: [
            'The sentence goes out with the hole in it showing — the fire took the photograph, the proof, the anchor, and left you this one discovery: that the memory of being someone matters less than the memory of loving someone. The second survived the fire without singeing.',
            'It will arrive as a moment in front of a mirror where someone touches their own face and thinks, unaccountably, of you — and feels witnessed, which is the thing photographs were always trying to do.',
            'Usher: (holding the letter a moment before stamping) You lost the picture and kept the seeing. (stamp) For the record, that’s the correct order to lose them in. Most manage it the other way.',
          ],
          reflections: reflect(
            'The sentence arrives as recognition rather than information — a moment at a mirror that changes nothing measurable and everything felt.',
            'You owe no one an accounting of what the fire took — but naming what survived it is a debt you pay to both of you at once.',
            'Ask whether losing the photograph but keeping the seeing is the correct order to lose things in, or just the order you happened to be handed.',
            'Someone touches their own face and thinks of you, unaccountably, and feels witnessed — which is the whole thing photographs were ever trying to do.',
          ),
        },
        {
          id: 'dont-wait',
          text: '“Don’t wait. Live. I’ll find you where you are.”',
          hint: 'Release them, whatever it costs the hoping part of you.',
          effects: { lucidity: 20, axes: { controlAcceptance: 8 } },
          available: (s) => s.axes.controlAcceptance >= 10,
          outcome: [
            'The generous sentence — the one that spends its postage freeing the recipient instead of holding them. You write it and feel the letting-go happen in your own hands first, which is where letting go always happens.',
            'It will arrive as permission: a morning where the grief loosens its parking brake and someone does the thing they had been guiltily postponing — moves the furniture, takes the trip, laughs at something all the way through. They will feel briefly disloyal, then unaccountably accompanied. Both feelings will be correct.',
            'Usher: (softly) That one costs the sender the most and the recipient the least. Premium rate, paid in full. It’s the sentence I’d send, if anyone were — (a pause, a small recalibration of the face) — off you go, letter. Mind the fog.',
          ],
          reflections: reflect(
            'Releasing them costs you the one sentence that could have asked them to wait, in exchange for one that frees them to actually live.',
            'You owe them their own life more than you owe yourself their waiting — this sentence pays that debt in full, at your own expense.',
            'Ask whether letting go this generously is love, or the last way left to control how they grieve you.',
            'It arrives as permission — a morning the grief loosens its grip and they finally do the thing they’d been guiltily postponing.',
          ),
        },
        {
          id: 'silence',
          text: 'Send a blank page. Some things don’t fit in sentences.',
          hint: 'The unwritten letter.',
          effects: { lucidity: 12, axes: { controlAcceptance: 4 } },
          outcome: [
            'You slide the blank page across. The Usher looks at it, then at you, then — professional to the last — stamps it anyway.',
            'It will arrive as a silence with presence in it: an afternoon where someone stops in a doorway for no reason and feels, for four or five seconds, completely accompanied. They will tell no one, having nothing tellable. It will be one of the better moments of their year.',
            'Usher: The blank ones are the heaviest, you know. Everything unsaid still weighs something — it is the only cargo with negative dimensions and positive mass. (filing it tenderly) I will see that it arrives gently.',
          ],
          reflections: reflect(
            'A blank page still arrives as something — a silence with presence in it, weightless cargo that somehow still lands.',
            'You owe no one a sentence you don’t have — sending nothing honest may discharge the debt better than sending something false.',
            'Ask whether choosing silence over speech here was restraint, or simply the only version of honesty available to you tonight.',
            'It arrives as an afternoon someone stops in a doorway and feels, for a few seconds, completely accompanied — for reasons they can never name.',
          ),
        },
      ],
      explanation:
        "You get to send exactly one sentence back to someone in the waking world — no more, no follow-up, just one message that will somehow reach them as a dream, a feeling, or a sudden thought. This isn't really a puzzle to solve; it's a chance to notice what you'd actually choose to say if you only had one shot and had to make it count, to whoever matters most to you. Think about it like a single text message you could send to someone, guaranteed to arrive and be truly heard, with nothing else you get to add or explain afterward — what would you actually write?",
    },
  ],
  // Room 19 writes its own field note: the message you sent becomes the codex entry.
};

export const doorThatAsks: Room = {
  id: 'door-that-asks',
  act: 4,
  title: 'The Door That Asks',
  type: 'INSIGHT',
  gate: true,
  doorHint: 'The last door, which is reading your file',
  teaser: 'It has read your whole file. Now it wants to know if you stand by it.',
  stages: [
    {
      beats: [
        'One door remains. It is not large or ornate — it is exact, the way the small room was exact — and set into it at eye height is a brass grille, like an old elevator, or a confessional.',
        'THE DOOR: Good morning. Before I open, I conduct a short interview. Not a test — an audit. You have spent this journey answering rooms. I ask about the answers.',
        (s) =>
          hasFlag(s, 'pulled-lever') || hasFlag(s, 'kept-lever') || hasFlag(s, 'refused-once')
            ? hasFlag(s, 'pulled-lever')
              ? 'THE DOOR: At the Junction, you pulled the lever — one life spent to keep five. Arithmetic over abstention. Do you stand by it, here, at the end, with the trolley long gone and nothing to gain by either answer?'
              : hasFlag(s, 'kept-lever')
                ? 'THE DOOR: At the Junction, you kept your hands from the lever — five lost, none of them yours to spend. Do you stand by it, here, at the end, where no one is watching and the mannequins have all gone home?'
                : 'THE DOOR: At the Junction, you refused the question itself — called it stupid, declined the premise. I make no judgment. I only ask: standing here now, was the refusal a position, or a flinch?'
            : 'THE DOOR: You never reached the Junction; the trolley ran without you. Curious. Then let me ask it plainly, unstaged: five strangers or one, and your hand on the lever — do you know, even now, what you would do?',
        (s) =>
          s.memoryLost
            ? 'THE DOOR: In the fire, you let the photograph burn. The proof of who you were, traded away. There is a hole in your file where it used to be — I can see it from here. Was it worth it?'
            : hasFlag(s, 'saved-photo')
              ? 'THE DOOR: In the fire, you saved the photograph. The coughing behind the other door stopped, and you carried your proof out past it. It is in your pocket now. Was it worth it?'
              : 'THE DOOR: You carry your past intact — no fires took anything you didn’t hand over. A quiet file. Sometimes the quiet ones have simply not been asked the right question yet. Consider yourself asked: what would you have let burn?',
        'THE DOOR: Take your time with the last one. It is the only question I actually need answered, and it is about all of them at once. Everything you chose in these rooms — do you stand by it?',
      ],
      choices: [
        {
          id: 'stand-by-it',
          text: '“Yes. All of it. I chose what I chose, and I’d sign it again.”',
          hint: 'Consistency, owned.',
          effects: { lucidity: 15, axes: { controlAcceptance: -4 } },
          outcome: [
            'THE DOOR: Steadiness. It is rarer than it advertises. Most travelers disown at least one room the moment a door asks — you kept the whole ledger, including the entries that cost you.',
            'THE DOOR: I note, without cruelty, that a ledger fully signed can be integrity or armor; from this side of the grille they are identical. You will know which it was later, at some unscheduled hour. They always find out at unscheduled hours.',
          ],
          reflections: reflect(
            'Standing by every choice changes nothing about what already happened — it only changes what you’re now willing to say about it.',
            'You owe your own record an honest signature, whatever it cost — and you just signed all of it, including the entries that cost you the most.',
            'Ask whether a fully signed ledger is integrity, or armor worn so long it stopped feeling like a choice.',
            'The door notes this without cruelty — whoever it was for, the signing was yours to give or withhold, and you gave it whole.',
          ),
        },
        {
          id: 'changed-mind',
          text: '“No — not all of it. Some answers I’d change, and I can tell you exactly what changed me.”',
          hint: 'Growth, named and owned.',
          effects: { lucidity: 25, axes: { reasonFeeling: 4 } },
          outcome: [
            'You name the room. The specific one. And you name what changed — not a mood, a reason: something a later room taught the earlier one.',
            'THE DOOR: (a sound like a lock deciding to be a hinge) That is the answer I am for. Consistency is respectable; revision with receipts is rarer and better. A self that cannot change its mind is not steady — it is finished, and finished is the one thing you have spent this whole journey declining to be.',
            'THE DOOR: For the record: the traveler who leaves is not the one who arrived, and you are the rare kind who knows it in writing.',
          ],
          reflections: reflect(
            'Naming what changed you doesn’t undo the earlier choice — it just adds an honest second entry next to the first.',
            'You owe the door, and yourself, the receipt as much as the revision — naming the room that changed you is the harder half of the honesty.',
            'Ask whether revising the record here is growth, or a comfortable way to disown the version of you that chose worse.',
            'The door treats a self that can change its mind as more alive than one that can’t — a kindness extended to whoever you were before you knew better.',
          ),
        },
        {
          id: 'dont-remember',
          text: '“Some of it I don’t even remember choosing. I was dissolving at the time.”',
          hint: 'The honest gap.',
          effects: { lucidity: 12 },
          outcome: [
            (s) =>
              s.memoryLost
                ? 'THE DOOR: In your case, that is not evasion — it is documentation. There is a genuine hole in you, fire-shaped, and answers that fell into it are not disowned, merely unwitnessed. I accept gaps that were paid for. Yours has a receipt.'
                : 'THE DOOR: Hm. Your file shows no fires, no holes — the memories are all present; what’s missing is the willingness to stand next to them. “I don’t remember” from an intact archive is a convenient fog. I will let it pass — I am a door, not a judge — but we both heard it.',
            'THE DOOR: Very well. The interview concludes. What remains is not a question but a threshold.',
          ],
          reflections: reflect(
            'Admitting the gap doesn’t fill it — the choices made while dissolving stay exactly as unwitnessed as they were before you said so.',
            'You owe the door an honest account of your own record, including its holes — admitting the gap discharges that debt more than pretending otherwise would.',
            'Ask whether the door’s skepticism toward an intact archive claiming amnesia is fair, or whether some gaps are real even without a fire to blame.',
            'Whatever the door thinks of the excuse, it lets it pass — its own small mercy, extended to a traveler who was, for part of this, genuinely not all there.',
          ),
        },
      ],
      explanation:
        "Before the final door will open, it interviews you about the choices you made throughout this entire journey and asks whether you still stand by them — not to grade you, but to see if you're being honest about your own story. This room is really asking: is it more admirable to stay perfectly consistent with everything you've ever chosen, or to be able to say \"I was wrong, and here's exactly what changed my mind\"? Think about opinions you held strongly as a kid that you've since changed — is that growth, or does it mean your younger self was simply wrong?",
    },
    {
      beats: [
        'The grille slides shut, and the door — the last door — swings open onto light that is not fog.',
        'It is morning out there. An actual one: traffic somewhere, a kettle somewhere, the world at its enormous ordinary business. The way back, present tense, three steps away.',
        'Usher: (beside you, suddenly, hat in hand) End of the line. Or the start of one, depending which direction you read it. The threshold takes you back — to the noise, the faces, the unfinished arguments, all of it. Most travelers take it. It is a good door. I keep it well.',
        'Usher: But it is not the only door open to you, and I am required to say so. You may stay — the rooms always need a keeper, and I have been at this a very long time. Or you may lie down here at the threshold and let the last of the dissolving finish. Some travelers, at the end, choose the quiet. It is not my place to call that losing.',
        (s) =>
          punchlineUnlocked(s)
            ? 'And there is — you notice it only now, and you understand that not everyone gets to notice it — a fourth door. Small. Plain. Warm light under it, and from behind it, unmistakably: laughter. The Usher follows your gaze and says nothing at all, which from the Usher is a standing ovation.'
            : 'Somewhere off to the side, you half-notice a small plain door you are fairly sure was never in the blueprints. It is locked. From behind it, very faintly: laughter. The Usher follows your gaze. “Not this time,” he says, gently, and it is somehow both a verdict and an invitation to come back.',
      ],
      choices: [
        {
          id: 'walk-through',
          text: 'Walk through. Back to the morning, the noise, the world.',
          hint: 'The return.',
          effects: { lucidity: 15 },
          outcome: [
            'You step toward the light. The threshold has the temperature of a doorway in summer — that half-degree change that means outside.',
            'Usher: (calling after you) Traveler. Whatever you find out there — it will be exactly the same world. That was never the promise. You were the renovation. Mind the gap.',
          ],
          reflections: reflect(
            'Stepping through returns you to a world that was never promised to be different — only you were the one being renovated.',
            'You owe the ordinary world nothing extra for having left it — walking back is simply returning to a claim that was always still open.',
            'Ask whether walking through this time feels different from any other threshold you’ve crossed, or whether the choosing was the only thing that changed.',
            'Whoever waits on the other side of the fog gets you back exactly as promised — the same world, and someone who is not quite the same person who left it.',
          ),
        },
        {
          id: 'stay',
          text: 'Stay. Take the clipboard. Tend the rooms for whoever comes next.',
          hint: 'The keeper’s bargain.',
          effects: { lucidity: 15, axes: { selfOthers: 6 } },
          outcome: [
            'You turn from the morning — actually turn from it, which the threshold registers with something like a bow — and hold out your hand for the clipboard.',
            'Usher: (not taking it out yet) Be sure. The hours are eternal, the pay is nothing, the travelers are — well, you’ve been one. You’ll watch every one of them face the fire and the lever and the folder, and you may never tell them the answers, chiefly because there aren’t any.',
            'Usher: (handing it over, and the clipboard is warm, and has your name on it — your real one, suddenly legible) ...Welcome aboard. First lesson: the halo and the horns are the same size. It’s on purpose. Everything here is.',
          ],
          reflections: reflect(
            'Staying keeps the rooms running for whoever comes next — a cost paid entirely by you, for travelers you will never get to meet.',
            'No one required this of you — the clipboard was offered, not owed, which is what makes taking it up a gift rather than an obligation.',
            'Ask whether the keeper’s bargain is generosity, or simply not being ready to find out what the ordinary world does with what you’ve learned.',
            'Every traveler who comes after inherits a keeper who has personally walked the lever, the folder, and the fire — care they’ll never know to thank you for.',
          ),
        },
        {
          id: 'lie-down',
          text: 'Lie down at the threshold. Let the dissolving finish, gently, on your own terms.',
          hint: 'The quiet.',
          effects: { lucidity: 10, axes: { controlAcceptance: 12 } },
          outcome: [
            'You lie down at the threshold with the morning three steps away, and it is not defeat — the room can tell, the Usher can tell, even the fog can tell. It is a choice, made with open eyes, by someone who walked every room to earn the right to make it.',
            'Usher: (sitting down beside you, setting his hat aside for good) Then I will stay until it is done. Nobody dissolves alone on my shift. (a pause) It is not an ending, you know. It is a tide. Everything the rooms filed away goes back to the sea, and the sea — (his voice already sounding like water) — has never once lost a single thing that mattered.',
          ],
          reflections: reflect(
            'Lying down here ends nothing that wasn’t always going to end — it only changes the manner and the company you end it in.',
            'No one is owed your continuing — letting the dissolving finish is a choice made with open eyes, by someone who earned the right to make it honestly.',
            'Ask whether choosing the quiet is surrender, or the same clear-eyed acceptance the boulder room asked of you, extended to its largest form.',
            'The Usher stays until it’s done rather than let you go alone — a small, specific mercy, offered to no one else in quite this way.',
          ),
        },
        {
          id: 'laughing-door',
          text: 'The small door. The laughter. Open it.',
          hint: 'You earned the noticing.',
          effects: { lucidity: 25 },
          available: (s) => punchlineUnlocked(s),
          outcome: [
            'You cross to the small plain door, and the handle turns before you have quite gripped it, the way a friend opens from the other side.',
            'Usher: (behind you, and for once his voice has neither halo nor horns in it) Very few travelers ever notice this door is here. Fewer still open it. Go on, then. I will get the lights.',
          ],
          reflections: reflect(
            'Opening the door you earned the noticing of changes nothing about the two ordinary doors beside it — it just adds a possibility very few ever see.',
            'No one owed you this door — it had to be earned across an entire journey of choices, which makes opening it a claim on something genuinely yours.',
            'Ask what it means that the rarest door in this whole facility is the one behind which someone is, simply, laughing.',
            'The Usher gets the lights and says nothing else — the clearest sign yet that whatever is behind this door was never his to explain, only to make room for.',
          ),
        },
        {
          id: 'remember-everything',
          text: '“I remember all of it.”',
          hint: 'Every room, every choice, at once.',
          effects: { lucidity: 20 },
          available: (s) => anamnesisAvailable(s),
          outcome: [
            'You do not step toward any of the doors. You say it instead, the way you would say a fact rather than a wish, and the saying is already most of what happens.',
            'The Usher goes very still, hat halfway to his chest, and does not finish taking it off.',
          ],
          reflections: reflect(
            'Saying it changes nothing about the world beyond this room and everything about how this conversation ends — the doors stop mattering the moment it’s said.',
            'You owe no one this admission — remembering everything at once is a private completion, not a debt anyone was waiting to collect.',
            'Ask what it means that the deepest answer in this whole facility isn’t a choice between doors at all, but the refusal to need one.',
            'The Usher goes still and doesn’t finish the gesture — for once, the one figure who answers every traveler’s question has nothing further to say.',
          ),
        },
      ],
      explanation:
        "The last door is open, and you finally have to choose how this journey actually ends: walk back into your ordinary life, stay here to help the next lost traveler, or let yourself rest completely. There's no \"correct\" ending among these — each one is simply a different, equally honest way of answering what you actually want right now, after everything you've been through. It's a bit like finally finishing a long, hard project and having to decide: do you dive straight into the next thing, take a well-earned rest, or use what you learned to help someone else through the same thing?",
    },
  ],
  fieldNote: {
    title: 'The Examined Life, Audited',
    thinkers: 'Socrates · Kierkegaard · narrative identity — MacIntyre, Ricoeur',
    body: 'Socrates said the unexamined life is not worth living, and was put to death by a jury that preferred not to be examined. This door is the sentence run in reverse: the examination, at last, of the examiner. Narrative identity theorists — MacIntyre, Ricoeur — hold that a self is not a substance but a story under continuous revision, and that the moral question is whether you can stand behind your story as both author and character. Note what the door rewarded: not consistency, which can calcify into armor, but revision with receipts — the ability to say “I changed my mind, and here is what changed it.” Kierkegaard: life is lived forward and understood backward; the door is where the two directions finally meet and compare notes. Every philosophy this journey staged — the trolley, the machine, the planks, the wager, the basement, the folder — **was always one question wearing costumes: when your own file is read back to you, is the signature yours?**',
  },
};

export const act4Rooms = [boulder, lastMessage, doorThatAsks];
