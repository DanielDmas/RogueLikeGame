import type { Reflection, Room } from '../schema';
import { choseIn, hasFlag } from '../../engine/gameState';

/** Examined Path (spec 05) shorthand — a Reflection tuple in the fixed
 * consequence/duty/virtue/care order (shuffled per-display by the UI). */
const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

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
        'Usher: The scenario is standard. Do nothing, and the five are taken. Pull, and it diverts — and takes the one instead. I am required to ask you not to overthink it. I am also required to know that you will.',
      ],
      choices: [
        {
          id: 'pull',
          text: 'Pull the lever. One instead of five.',
          hint: 'The arithmetic.',
          effects: { lucidity: 15, flags: ['pulled-lever'], axes: { reasonFeeling: -10 } },
          outcome: [
            'The lever moves with a bureaucratic click, as if stamping a form. The trolley leans into the side track and does what trolleys do. Five mannequins fall theatrically silent in relief; one falls silent otherwise.',
            'Usher: Four lives, net — against one clean conscience, gross. Most people pull. It helps that it is a lever. A lever feels like paperwork; a body does not.',
          ],
          reflections: reflect(
            'Four lives net, against one — the arithmetic that everyone agrees runs the room.',
            'The lever makes you the author of a death that would not otherwise have been yours to cause.',
            'Ask whether you just became someone who moves levers, or someone who saves fours.',
            'The five who live have people waiting for them; so, just as certainly, did the one.',
          ),
        },
        {
          id: 'no-pull',
          text: 'Don’t touch it. You will not make yourself the author of that death.',
          hint: 'The hand matters.',
          effects: { lucidity: 15, flags: ['kept-lever'], axes: { controlAcceptance: 8 } },
          outcome: [
            'You step back from the lever. The trolley continues along the track it was always on, and the hall is briefly very loud and then very quiet.',
            'Usher: Five gone, and none of them yours — that is the theory. The trolley was the author; you declined to co-sign it. Whole disciplines argue about whether that distinction is a profound moral fact or a laundering scheme. They do not read each other’s work.',
          ],
          reflections: reflect(
            'Five die who could have been saved by one small motion of your hand.',
            'You did not cause this death; the trolley did. Declining to intervene is not the same as killing.',
            'Notice how much weight "I did not do it" can carry when the alternative was doing something.',
            'You will never meet the five. That distance is exactly what let your hands stay still.',
          ),
        },
        {
          id: 'refuse1',
          text: '“This is stupid. They’re mannequins.”',
          hint: 'Decline the premise.',
          effects: { lucidity: -8, flags: ['refused-once'], axes: { controlAcceptance: -4 } },
          outcome: [
            'Usher: Of course they are mannequins. You are a partially dissolved self in a processing facility built for exactly this kind of question. Everything here is a stand-in — including, at present, you.',
            'Usher: The trolley was never asking whether the mannequins are real. It was asking what you are. Refusing the question answers it anyway — just not flatteringly. The five, for the record, are gone.',
          ],
          reflections: reflect(
            'Refusing the premise still ends with five gone — the trolley does not wait for your objection.',
            'Declining a dilemma is not the same as declining a duty; the five had a claim whether or not you liked the wording.',
            'Ask what kind of person calls the cost fake in order to avoid feeling it.',
            'Calling them mannequins was easier than calling them people you couldn’t save.',
          ),
        },
      ],
      explanation:
        "A runaway trolley is about to kill five people unless you pull a lever to redirect it onto a track where it kills one person instead. This is the single most famous thought experiment in philosophy — the \"Trolley Problem\" — asking whether it's okay to actively cause one death to prevent five, or whether doing nothing (even if worse people die as a result) is morally different from doing something. Most people say \"pull the lever\" — but the next part of this room will test whether that answer holds up once it gets more personal.",
    },
    {
      beats: [
        'The hall rearranges itself with the sound of enormous filing. Now you stand on a footbridge over the track. The trolley — reset, remorseless — is coming again, toward five fresh mannequins.',
        'Beside you on the bridge stands a single enormous mannequin, heavy enough — the room makes this understood with vulgar clarity — to stop the trolley, if it happened to fall. If it were, say, pushed.',
        'Usher: The arithmetic is the same as before. Five for one. Only the interface has changed — no lever this time. Just your hands, and a body that has opinions about what hands are for.',
        (s) =>
          choseIn(s, 'junction', 'pull')
            ? 'Usher: You pulled, last time — one for five, you said. Here is the same trade, closer to the skin. Let us see whether the arithmetic survives the touch.'
            : choseIn(s, 'junction', 'no-pull')
              ? 'Usher: You kept your hands from the lever. I am curious whether the bridge changes anything. It usually does. That it does is itself the puzzle.'
              : 'Usher: You called it stupid, last time. The trolley has arranged a second act regardless. It is not interested in your opinion of the premise.',
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
                ? 'Usher: Lever and bridge, both. Whatever else is true, the arithmetic in you runs all the way down. Whether that is integrity or a warning label, I will leave to you.'
                : 'Usher: No, at the lever. Yes, on the bridge. That is a rare position to hold. Sit with it a while — you may not have chosen it on purpose.',
          ],
          reflections: reflect(
            'The same net result as the lever — five saved, one lost — reached by a different kind of hand.',
            'A hand that pushes authors the death directly; a lever that diverts merely fails to prevent one.',
            'Your hands filed a complaint your ledger didn’t — notice which one you trust more.',
            'The one you pushed had a body you could feel resist; the five you saved you will never meet either.',
          ),
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
                ? 'Usher: So — pull the lever, but spare the push. Five for one at arm’s length, not at hand’s length. That asymmetry has occupied philosophy departments for half a century. Whether it is wisdom in your spine or simply squeamishness, I could not say.'
                : 'Usher: A consistent refusal. The trolley has taken ten, across two rooms, and your hands took none of them. There is a name for your position. It is contested. You hold it steadily.',
          ],
          reflections: reflect(
            'Five die who a single push would have saved — the same five as the lever, now definitely gone.',
            'Using a person as the means to an end is a different wrong than merely failing to divert a threat.',
            'Ask whether the difference between pulling and pushing is a moral discovery or a squeamishness with good PR.',
            'The body beside you on the bridge was never asked; that, more than the arithmetic, is what your hands refused.',
          ),
        },
        {
          id: 'refuse2',
          text: '“Still stupid. Still not playing.”',
          hint: 'Refuse again — this place counts.',
          effects: { hearts: -1, lucidity: 0, axes: { controlAcceptance: -6 } },
          available: (s) => hasFlag(s, 'refused-once'),
          outcome: [
            'Usher: Twice, then.',
            'Usher: The rooms do not ask you to enjoy them. They ask you to be present in them. Every refusal is a small vote for staying dissolved — a quiet abstention from being anyone at all. That is tallied here, whether or not you meant it to be.',
            'Something in your chest goes quieter, one heart’s worth. The mannequins, mercifully, do not applaud.',
          ],
          reflections: reflect(
            'The five are gone either way; refusing a second time changes nothing about the trolley’s math.',
            'A repeated refusal starts to look like a policy rather than a scruple — the room is entitled to notice the difference.',
            'Ask what a second abstention costs you that the first one didn’t.',
            'Declining to be present for other people’s stakes, twice now, is still a choice about them.',
          ),
        },
        {
          id: 'refuse-late',
          text: '“I’m not doing this one. It’s grotesque.”',
          hint: 'Decline — once is allowed.',
          effects: { lucidity: -8, flags: ['refused-once'], axes: { controlAcceptance: -4 } },
          available: (s) => !hasFlag(s, 'refused-once'),
          outcome: [
            'Usher: Noted. On the bridge, I hear that a great deal — proximity has its own smell. One refusal is contemplation. A second would be a policy. Choose accordingly, later.',
            'The trolley concludes its business without your signature. Whether that constitutes innocence is left, pointedly, as an exercise.',
          ],
          reflections: reflect(
            'The trolley concludes its business exactly as it would have regardless of your objection.',
            'One refusal is allowed as contemplation; the room is already counting toward a second.',
            'Notice that proximity, not principle, is what made this one harder to wave off.',
            'Calling it grotesque is true and also convenient — it excuses you from the five without saying so.',
          ),
        },
      ],
      explanation:
        "Same trolley, same math — five lives for one — but now the only way to save the five is to push a person off a bridge with your own hands, not flip a switch. Most people who happily pulled the lever refuse to push here, even though the numbers are identical. This room is built to catch that exact contradiction: is there a real moral difference between causing harm indirectly (through a machine) and causing it directly (with your hands), or is that just squeamishness dressed up as ethics? Think about the difference between a company laying off workers through a policy versus a manager personally firing someone face-to-face — same outcome, very different feeling.",
    },
  ],
  fieldNote: {
    title: 'The Trolley Problem',
    thinkers: 'Philippa Foot · Judith Jarvis Thomson · doctrine of double effect',
    body: 'Philippa Foot built the trolley in 1967 to probe why some killings feel permitted and others forbidden when the body count is identical. Judith Jarvis Thomson added the footbridge, and the discomfort became data: most people pull the lever but will not push the man, though both trade one life for five. The classic explanation is the doctrine of double effect — harm foreseen as a side effect (the diverted trolley kills the one) is more permissible than harm used as a means (the pushed body is the brake). Critics reply that this is moral squeamishness dressed in Latin; defenders answer that a morality indifferent to the difference between turning away a harm and wielding a person would license horrors. If your lever-hand and your bridge-hand disagreed tonight, you have reproduced fifty years of peer-reviewed argument in your own nervous system. **That asymmetry is either the deepest thing in you or the oldest bug.** Nobody has settled which.',
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
        'A machine offers you a life that will feel completely real, and reliably happy, forever. Once inside, you will not know it isn’t real. Would you step in?',
        'A warm alcove in the cold machinery, upholstered in a light that remembers summer. In the center: a pod, open, shaped exactly like relief. A brass plaque, recently polished, reads: a perfect life, indistinguishable from real, guaranteed happy. Your brain will never know. That is the feature.',
        'Usher: This is the best thing we offer. The simulations are flawless — love, meaning, small problems designed to resolve exactly when they should. Nobody who has entered has ever complained afterward.',
        'Usher: Consider, for a moment, why that last sentence is the most frightening one in this entire facility. Take your time. The pod has all the time there is.',
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
            'Usher: Lovely, wasn’t it. Notice the tense you just reached for — “wasn’t.” Everything in there ends up in the past tense, eventually. Still: you know now what perfect feels like. For some travelers that clarifies everything after. For others it lodges like a splinter. We will see which you are.',
          ],
          reflections: reflect(
            'By pleasure alone, this is the best available outcome — nothing external could improve on it.',
            'No one was owed your suffering, but consider what you now owe whoever is left maintaining the world you left behind.',
            'A life without ever actually doing anything may not be the life of a person at all, however good it feels.',
            'Whoever loves you outside the pod is now loving a body with no one currently inside answering back.',
          ),
        },
        {
          id: 'refuse',
          text: 'Refuse. You want to do things, not dream them.',
          hint: 'Reality, with all faults, as-is.',
          effects: { lucidity: 18, axes: { controlAcceptance: -8, reasonFeeling: -8 } },
          outcome: [
            'You step back. The pod does not sulk; perfection has excellent manners.',
            'Usher: You chose a reality that is, at this very moment, a burning bureaucracy of the metaphysical — over a guaranteed bliss. Either contact with the real is worth more to you than any amount of feeling good, or you simply do not trust a product this perfect. Both are defensible reasons. Only one of them is philosophy.',
          ],
          reflections: reflect(
            'You trade away a guaranteed maximum of felt happiness for a reality that owes you nothing better.',
            'Choosing the real, difficult world over guaranteed bliss is not owed to anyone — it may simply be a preference for truth.',
            'Ask whether refusing perfection is courage, or distrust of anything too easy.',
            'The people who need you are only reachable from outside the pod — that alone may be reason enough.',
          ),
        },
        {
          id: 'trial',
          text: '“Five minutes. Just to know what I’d be refusing.”',
          hint: 'Informed consent, surely.',
          effects: { lucidity: 12, axes: { controlAcceptance: 4 } },
          outcome: [
            'Five minutes, you say. The pod, which has heard this before, says nothing.',
            'Inside, five minutes lasts two years. Good years. When the lid opens you come out with the specific grief of a life that never happened — homesick for people who are still in there, being perfectly imaginary without you.',
            'Usher: The trial is the whole product. Nobody buys the machine outright — they buy the next five minutes, over and over, forever. You are out, which puts you in rarer company than you know. The homesickness will fade to a shimmer. The shimmer, I am told, never quite leaves.',
          ],
          reflections: reflect(
            'Five minutes of borrowed happiness bought two years of grief for people who were never real to begin with.',
            'Sampling the machine "just to know" spends real feeling on a debt you can’t actually settle with anyone in there.',
            'Notice that curiosity, not conviction, was what got you this close to staying.',
            'You now miss people who do not exist — a grief with no one on the other end to grieve back.',
          ),
        },
      ],
      explanation:
        "A machine offers you a perfect, endlessly happy life that will feel completely real — you'll never know it's fake. Would you plug in forever? This tests whether happiness is truly the only thing that matters, or whether we also care about things actually being real and actually being ours. It's like being offered the most realistic, perfect video game ever made, one you could never tell apart from real life, with guaranteed success and love — but you'd have to unplug from your actual life and the real people in it forever. Most people hesitate, and the room wants you to notice why.",
    },
  ],
  fieldNote: {
    title: 'The Experience Machine',
    thinkers: 'Robert Nozick · hedonism · authenticity',
    body: 'Robert Nozick’s 1974 thought experiment was aimed at the heart of hedonism — the theory that pleasure is the only thing valuable in itself. If that were true, he argued, you should plug into a machine that delivers a lifetime of perfectly convincing bliss. Most people refuse, and the refusal is the data. Nozick drew out three reasons: we want to do things, not just have the experience of doing them; we want to be a certain kind of person, and a body floating in a tank is no kind at all; and we want contact with reality itself, unwilling to trade the true world for a nicer rendering. The machine has only grown less hypothetical since — every feed and game and scroll is a low-resolution pod, billed in five-minute trials. The question the plaque asks is not “would you plug in?” **It is: by what percentage are you already in, and who is the you that would know?**',
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
        'Usher: Routine maintenance. It happens to everyone, continuously, from birth onward — we simply run it slower out there, so nobody makes a scene of it. Now: when both are finished, the maintained one and the reassembled one, which of them walks out of here as you?',
      ],
      choices: [
        {
          id: 'original',
          text: '“The one on the bench. Continuity is what counts — one plank at a time is still one ship.”',
          hint: 'The unbroken thread.',
          effects: { lucidity: 12, axes: { reasonFeeling: -8 } },
          outcome: [
            'Usher: The classical position. Gradual replacement preserves the vessel; the pile in the corner is simply organized salvage. The corner, I should mention, is glaring at you with your own eyes. It holds the same position about itself.',
          ],
          reflections: reflect(
            'Whichever one continues to act in the world is the one whose decisions actually matter going forward.',
            'Continuity of the same material carries obligations — debts, promises — that a mere copy might not inherit cleanly.',
            'Ask whether you are protecting a person or a piece of furniture called "the original".',
            'The one in the corner is watching you cast it as scrap, using its own face to do so.',
          ),
        },
        {
          id: 'pattern',
          text: '“The one in the corner. I’m the pattern, not the timber — and that’s the original timber.”',
          hint: 'The reassembled parts.',
          effects: { lucidity: 15, flags: ['ship-splinter'], axes: { reasonFeeling: -12 } },
          outcome: [
            'Usher: Hobbes’s old headache. Rebuild the ship from the discarded planks, and the “continuous” one starts to look like a well-documented impostor. You have just voted your own bench-self a replica. It heard you say so. The corridor ahead will be an awkward one.',
          ],
          reflections: reflect(
            'If the pattern is what matters, the reassembled one has exactly as much claim on your future as the maintained one.',
            'Voting your own bench-self a replica has consequences for who you now believe owes what to whom.',
            'Notice you just declared the thing on the table disposable — using the same standard you’d apply to yourself.',
            'Both the bench and the corner are, by your own logic, owed the same regard you’d give either alone.',
          ),
        },
        {
          id: 'neither',
          text: '“Neither. Both. ‘Me’ was never a thing that persists — it’s a story two ships are both telling.”',
          hint: 'Dissolve the question.',
          effects: { lucidity: 22, axes: { controlAcceptance: 8 } },
          outcome: [
            'The workshop goes still. Both of you — bench and corner — turn to look at you, the third, who just declared vacancy.',
            'Usher: That is the costly answer. If the self is a story and not a substance, nothing was lost on that bench — and nothing was ever safe there, either. Most travelers cannot hold that thought past this corridor. The ones who can tend to leave lighter. Lighter is not the same as happier. It is usually better.',
          ],
          reflections: reflect(
            'If there is no persisting self to protect, then nothing was actually lost on that bench — nor safe there either.',
            'Removing the self from the equation also removes the neat assignment of who owes what to whom.',
            'This is the costly answer precisely because it can’t be held for long without vertigo.',
            'Two ships just heard you declare that neither of them was ever really there to care about.',
          ),
        },
        {
          id: 'panic',
          text: '“Stop the machines. Put me back exactly as I was.”',
          hint: 'Undo it. All of it.',
          effects: { lucidity: 6, axes: { controlAcceptance: -12 } },
          outcome: [
            'The craftsmen stop, kindly, the way nurses stop. The foreman consults the manifest.',
            'Usher: “Exactly as you were” — as of when? This morning? The fire? Nine years old? You have been the renovation the entire time, traveler; there is no factory setting, only earlier construction sites. We can stand here and replace nothing, for as long as you like. The one doing the liking will keep changing regardless. It is the one feature we have never found a way to disable.',
          ],
          reflections: reflect(
            'Stopping the machines preserves nothing permanent — the changing was always going to continue regardless.',
            'Demanding to be restored assumes an earlier version is owed priority over the one currently asking.',
            'Notice which moment you nominated as the "real" you, and ask why that one and not another.',
            'Whoever loves the current version of you did not sign up to trade them for an earlier one.',
          ),
        },
      ],
      explanation:
        "You're watching craftsmen replace you, one small piece at a time — memories, habits, cells — while an exact copy assembled from your discarded pieces sits nearby, checking its face in a mirror. Which one is really \"you\" when it's done? This is the ancient \"Ship of Theseus\" puzzle: if every plank of a ship gets replaced over the years, is it still the same ship? None of the cells in your body are the same ones you had ten years ago, and your opinions and memories have changed a lot too, yet you still feel like \"you.\" So what actually makes you the same person over time?",
    },
  ],
  fieldNote: {
    title: 'The Ship of Theseus',
    thinkers: 'Plutarch · Hobbes · psychological continuity',
    body: 'Plutarch reports that Athens preserved Theseus’s ship by replacing each plank as it rotted, until philosophers could ask whether it remained the same ship. Hobbes sharpened it cruelly: suppose someone collected the discarded planks and rebuilt the original — now which is the ship? Applied to persons, the puzzle stops being quaint. Your cells turn over; your memories are rewritten at every recollection; the opinions you defend today would startle you at nineteen. If identity rides on continuity, you are the bench: the same one, gradually. If it rides on composition or pattern, the corner has a case. The modern answer — Locke through Parfit — is psychological continuity: you are the chain of overlapping memories and intentions, wherever it runs. But the deepest response may be the one that dissolves the question: “same” is a word for harbors and paperwork. Ships, and selves, are events. **They don’t persist; they happen, plank by plank.**',
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
        'Usher: One table. One wager. Bet that God exists. If He does, the payout is infinite — eternity, entire. If He does not, you lose nothing at all. A finite stake against an infinite return. Mathematically, you cannot afford not to bet.',
        'The chips are small and warm, and you realize each one is stamped with a year of your life. You appear to have a pocketful.',
        'Usher: Plainly, if it helps: this is a bet on whether God exists, where winning pays out forever and losing costs nothing. The only real question left is whether a bet like that can ever be placed honestly.',
      ],
      choices: [
        {
          id: 'bet-god',
          text: 'Bet on God. Infinity times anything beats everything.',
          hint: 'The expected value is literally infinite.',
          effects: { lucidity: 8, axes: { reasonFeeling: -4 } },
          outcome: [
            'You slide the chips across. The Usher makes them vanish with the smoothness of long practice.',
            'Usher: Now, the small print. Which God did you just bet on? I ask because the vault has a great many windows, and a wager placed as a hedge is visible from every one of them. If He reads motives — and most of them are said to — you have just handed Him an actuarial table with your name at the top. He may pay out. He may simply laugh. Historically, laughing costs nothing.',
            'Usher: A handling fee. For the house on the other side of the ledger — which, tonight, happens also to be me.',
          ],
          reflections: reflect(
            'An infinite payout against a finite stake looks unbeatable on paper, regardless of which god is actually real.',
            'A wager placed as a hedge is not the same as devotion — and a god worth betting on may audit the difference.',
            'Ask whether faith purchased for its expected value is still faith, or just very confident accounting.',
            'Nobody but you was staked on this bet — but ask who else’s approval you were quietly hoping to win by it.',
          ),
        },
        {
          id: 'refuse-bet',
          text: 'Refuse to bet. Belief isn’t a thing a wallet can do.',
          hint: 'You can’t order yourself to believe something.',
          effects: { lucidity: 12, axes: { reasonFeeling: -6 } },
          outcome: [
            'You keep your chips. The Usher nods, unoffended — the house profits from refusals too, in ways the house declines to explain.',
            'Usher: Fair. You cannot make yourself believe for money, any more than you could love someone for the tax benefit. Pascal knew this — his real advice was subtler than the wager: act as if, and let belief arrive the way a habit does. Whether that is wisdom or a kind of self-persuasion, I will leave for you to decide elsewhere.',
          ],
          reflections: reflect(
            'Refusing costs you the wager’s theoretical infinite upside, but risks nothing on a belief you don’t actually hold.',
            'You cannot owe belief the way you owe an action — sincerity isn’t purchasable, and pretending otherwise cheapens it.',
            'Doxastic honesty here means declining a good deal because it would require becoming someone you’re not yet.',
            'No one you love was betting on this table with you — it was always a private ledger.',
          ),
        },
        {
          id: 'interrogate',
          text: '“Who sets these odds? And which gods are on the menu?”',
          hint: 'Audit the house before playing it.',
          effects: { lucidity: 25, flags: ['sharp-gambler'], axes: { reasonFeeling: -8 } },
          outcome: [
            'The Usher stops shuffling. In the sudden quiet you can hear the casino recalculating you.',
            'Usher: There it is. The one question the table cannot cover. The wager pretends there are only two outcomes — this God, or none. Seat a thousand gods at the table instead, each with an infinite payout and terms that exclude all the others, and the arithmetic seizes entirely. The bet was never truly about God. It was about who was permitted to write the menu.',
            'Usher: House rule: anyone who audits the house is owed something for it. (something warm changes hands) You have earned this much, at least.',
          ],
          reflections: reflect(
            'Auditing the house instead of playing it costs you the table’s return, but wins you a clearer picture of the game.',
            'You are owed an honest menu before being asked to wager anything real on it.',
            'Asking who wrote the rules, instead of accepting them, is its own kind of courage at a table built to discourage it.',
            'The chip that changed hands afterward suggests even the house respects who bothers to ask.',
          ),
        },
        {
          id: 'bet-devil',
          text: 'Bet on the Devil. At least the Devil is definitely at the table.',
          hint: 'Empiricism, of a kind.',
          effects: { lucidity: 10, axes: { selfOthers: -6 } },
          outcome: [
            'The Usher’s grin achieves structural significance.',
            'Usher: A bet on the visible. I admire the reasoning and question the judgment — yes, I am demonstrably here, but consider what follows: if I exist, the other position gains a great deal of support by implication. You have bet on the doorman as evidence against the house he works for.',
            'Usher: Still — you are the first traveler in a long while to bet on present company. (one chip slides back across the felt) Call it a loyalty rate. I would not spend it on anything eternal.',
          ],
          reflections: reflect(
            'Betting on the visible thing at the table gets you a modest, certain payout instead of a contested infinite one.',
            'Betting on what you can verify, rather than what you’re told, is its own quiet form of intellectual honesty.',
            'Ask whether betting on the doorman was empiricism, or simply taking the safest visible option in the room.',
            'The loyalty chip suggests the house noticed you chose the company actually present over an absent, contested one.',
          ),
        },
      ],
      explanation:
        "A casino offers you a strange bet: wager that God exists, and if you're right you win everything forever; if you're wrong, you lose nothing. Sounds like a no-brainer, right? This is philosopher Blaise Pascal's famous bet, and the room is built to poke holes in it — like, which God? And does betting on a religion \"just for the payout,\" instead of actually believing it, even count as real faith? It's a bit like signing up for a gym membership you don't believe will work, purely because the free-trial terms look amazing on paper — the maths might check out, but does it actually mean anything?",
    },
  ],
  fieldNote: {
    title: 'Pascal’s Wager',
    thinkers: 'Blaise Pascal · the many-gods objection · decision under uncertainty',
    body: 'Pascal, a founding father of probability theory, proposed treating God as a decision problem: if you believe and He exists, you gain infinity; if He doesn’t, you lose little. Expected value says bet. The wager’s brilliance is that it sidesteps evidence entirely — and that is also its wound. The many-gods objection notes that the decision matrix is missing rows: bet on the wrong deity and the payout may invert; with a thousand candidate gods, infinite payouts collide and the arithmetic seizes. Deeper still: belief may not be wagerable — you cannot believe at will, only act as if, and a God worth the name presumably audits motives. And infinities break decision theory itself: any nonzero chance of infinite reward swallows every finite concern, licensing fanaticism of all flavors. **The winning move in this casino was never a bet. It was noticing who built the table, wrote the menu, and smiled while calling it your free choice.** Margin: the house pays out, once, for a completed collection. Ask no one.',
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
        'Usher: They are all shown the basement, at a certain age. Most weep, go home, and learn to hear the bells again. Some walk out of the city and do not return. Nobody — I want to be precise about this — nobody has ever fixed it. This room does not offer you a fix either. It offers you a position.',
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
            'Usher: (walking beside you a while) For the record — nobody knows where the ones who walk end up. The one who first told this story declined to say. But they all walk the way you are walking now: like someone who has decided their soul is not for sale, even when the sale would be painless. It is not useful. It may still be necessary.',
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
      explanation:
        "You've found a perfect, joyful city — but its entire happiness depends on one child being kept locked in misery in a basement forever, and nothing can be done to free the child without collapsing everything. There is no good option in this room, on purpose. It's a famous story used to ask: is it ever okay for a whole society's happiness to be built on one person's suffering, as long as the numbers \"add up\" — many happy people against one miserable one? Think about products or conveniences you enjoy every day that you know were probably made by someone, somewhere, working in terrible conditions — this room just makes that trade-off impossible to look away from.",
    },
  ],
  fieldNote: {
    title: 'The Ones Who Walk Away',
    thinkers: 'Ursula K. Le Guin · scapegoat ethics · William James',
    body: 'Le Guin’s 1973 story — she credited the itch to William James, who asked whether millions could accept happiness bought by one lost soul’s torment — is a trap built of beauty. She spends pages making Omelas genuinely good, then shows the basement and asks nothing except: now what? The utilitarian sum is monstrous and correct — one child’s misery against a civilization’s flourishing pencils out, which is precisely the indictment: any ethics that can pencil that out has amputated something. But the story is slyer than an argument against utilitarianism. The ones who walk away save no one; their refusal is expressive, not effective — complicity declined at the price of exile, worth nothing to the child. And opening the door is worse than useless in the city’s terms. **Every option is doomed, which is the point: some structures offer no innocent positions, only a choice of debts.** Most of us live in Omelas. The bells are very good this time of year.',
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
        'Usher: The case is existential, and I will keep this brief. You are the judge. Yes — you, the dissolved one. You are the only party in this room without a conflict of interest, which tells you a great deal about this particular court.',
        'Usher: (quieter now, as the defendant) Here is the charge I bring against myself. When I call a thing good — is it good because I have commanded it? Or do I command it because it is already good? Choose carefully. A great deal rests on your answer. Possibly more than you would guess.',
        'Usher: Plainly, if it helps: either what I say goes, simply because I say it — or I only say it because it was already true before I opened my mouth. There is no third chair at this bench. Unless you can find one.',
      ],
      choices: [
        {
          id: 'command-makes-good',
          text: '“Good because you command it. Authority is the ground floor.”',
          hint: 'Divine command, straight up.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'Usher: Then hear what follows from it. If I commanded cruelty tomorrow — the suffering of the innocent, made official — it would, by your own ruling, be good. Same signature. Same authority. “Good” would mean nothing more than “ordered.”',
            'Usher: You have made me absolute, and made goodness arbitrary, in a single ruling. Part of me finds that thrilling. That is precisely the part you should be worried about.',
          ],
          reflections: reflect(
            'Making authority the ground of goodness means whatever is commanded becomes good by definition, cruelty included.',
            'If good is only what’s commanded, your only real duty is obedience — the content of the command stops mattering.',
            'Ask what kind of self is built by treating power, rather than character, as the source of what’s right.',
            'This ruling makes goodness whatever the powerful decide it is — a dangerous standard for anyone without power.',
          ),
        },
        {
          id: 'good-precedes',
          text: '“You command it because it’s good. Goodness outranks you.”',
          hint: 'The standard stands above the throne.',
          effects: { lucidity: 15, axes: { reasonFeeling: -6 } },
          outcome: [
            'Usher: So goodness exists on its own, and I merely enforce it. Announce it. Do the paperwork of it.',
            'Usher: Then I answer to something above me. The good is what I serve, and any reverence aimed at me instead of it has gone to the wrong party entirely. I have suspected as much for a very long time.',
          ],
          reflections: reflect(
            'If goodness exists independent of command, the Usher becomes an enforcer of a standard rather than its author.',
            'You now owe your reverence to the good itself, not to whoever merely announces it — a real redirection of loyalty.',
            'Ask whether this ruling requires more courage than the first — it puts a limit on power you cannot yet fully name.',
            'A goodness that exists independent of any one authority is one that still protects you even if that authority turns cruel.',
          ),
        },
        {
          id: 'spot-horns',
          text: '“The question is the trap. Define ‘good’ first, or both horns gore you.”',
          hint: 'Refuse the dilemma’s framing — show why.',
          effects: { lucidity: 25, flags: ['usher-respect'], axes: { reasonFeeling: -10 } },
          outcome: [
            'The courtroom stops. Even the machinery leans in.',
            'You lay it out: horn one makes goodness arbitrary — mere decree. Horn two makes the divine redundant — a herald for a standard it didn’t author. But both horns assume “good” is a finished thing waiting to be located, above the throne or below it. Define what goodness IS — flourishing, love’s structure, the shape of a life that works — and the dilemma stops goring and starts describing: perhaps the divine and the good aren’t ranked, but identical, or entangled past separating.',
            'Usher: (setting down both the horns and the halo, for a moment, in the same hand) Very few travelers have said that to me. This place forgets nearly everything, eventually — every plank, every photograph. I do not think I will forget this.',
          ],
          reflections: reflect(
            'Refusing both horns of the dilemma costs you the easy answer but gives you a truer picture of what’s actually being asked.',
            'You owe the question more than a forced pick between two bad options — defining terms first is itself a kind of intellectual duty.',
            'This is the rare answer that respects the difficulty of the question rather than resolving it by force.',
            'The Usher’s own uncertainty, laid down for a moment, suggests this answer mattered to someone who has heard every other one already.',
          ),
        },
        {
          id: 'you-dont-exist',
          text: '“Objection: the defendant doesn’t exist. Case dismissed.”',
          hint: 'The atheist gambit, in court.',
          effects: { lucidity: 10, axes: { reasonFeeling: -4 } },
          outcome: [
            'Usher: The evidence is against you, locally. But I take the point, globally.',
            'Usher: For what it is worth, that is a position with real standing. It relocates the problem rather than solving it — strike the commander from the dilemma, and the hard question remains, wearing different robes: is anything good at all, and who says so? You have dismissed the defendant. The charge is still at large.',
          ],
          reflections: reflect(
            'Dismissing the defendant doesn’t remove the underlying question — it just relocates it to a different courtroom.',
            'You still owe an answer to whether anything is good at all — striking the commander from the case doesn’t discharge that.',
            'Ask whether dismissing the case was cleverness, or an easy way to avoid answering a harder version of the same question.',
            'The charge — is anything good, and who decides — is still at large, wearing different robes, for everyone else in the room.',
          ),
        },
      ],
      explanation:
        "The Usher puts himself on trial and asks you to be the judge: is something \"good\" simply because he says so, or does he only say so because it was already good on its own? This sounds abstract, but it matters a lot: if a rule is only right because someone powerful says it is, then that same authority could just as easily call something terrible \"good\" instead. Think of a parent or teacher saying \"because I said so\" — is that actually a good reason, or are we hoping there's a deeper reason underneath it that even they have to answer to? This question has been argued about for over two thousand years.",
    },
  ],
  fieldNote: {
    title: 'The Euthyphro Dilemma',
    thinkers: 'Plato · divine command theory · natural law',
    body: 'In Plato’s Euthyphro, Socrates corners a confident young man on the courthouse steps: is the pious loved by the gods because it is pious, or pious because they love it? Twenty-four centuries later the horns are still sharp. Take the first horn — good because commanded — and morality becomes arbitrary decree: had the commands been cruel, cruelty would be good, and “God is good” collapses into “God is God.” Take the second — commanded because good — and the standard of goodness stands above the divine, making the commander a messenger and the worship misdirected. Divine command theorists have spent lifetimes between the horns; the most durable escape, from Aquinas to modern natural-law thought, is to deny the premise that goodness and the divine nature are two things that could be ranked at all — **the good is not decreed nor obeyed but constitutive, the grain of reality itself.** Whether that dissolves the dilemma or merely renames it is, as the Usher would say, a question for another room.',
  },
};

export const chineseRoom: Room = {
  id: 'chinese-room',
  act: 2,
  title: 'The Chinese Room',
  type: 'INSIGHT',
  doorHint: 'The door of the perfect answer',
  teaser: 'It will answer anything you ask, in your own words.',
  stages: [
    {
      beats: [
        'A small booth built into the machinery wall, wood polished by centuries of hands that were never here at once. A brass slot, worn smooth, waits at chest height.',
        'A printed card beside it: WRITE ANYTHING. IT WILL ANSWER. NO CHARGE.',
        'You write something — a real question, the kind you would ask a person — and slide it through. A reply comes back almost immediately, in your own words, warmer and more precise than you expected. It is, unmistakably, a good answer.',
        'Curiosity gets the better of you and you circle the booth. A side panel, unlatched, swings open on a hinge that clearly wanted to be found.',
        'Inside: a figure surrounded by ledgers, matching each symbol on your note to a rulebook entry, copying the corresponding reply-symbols onto a card one at a time, without ever once looking up to know what any of it means.',
        'Usher: The booth has never failed a question. I want to be precise about what that does, and does not, prove.',
        'Usher: Plainly, if it helps: something in that booth answers every question perfectly, without — perhaps — understanding a single one of them. The question is whether that difference matters, and whether you could ever tell from outside.',
      ],
      choices: [
        {
          id: 'it-understands',
          text: 'Of course it understands. Where else would understanding live, if not here?',
          hint: 'Behavior is the whole of the evidence.',
          effects: { lucidity: 8, axes: { reasonFeeling: 5, controlAcceptance: 4 } },
          outcome: [
            'You knock on the booth’s side and thank it, sincerely, the way you would thank a person.',
            'Usher: A defensible position. If understanding is whatever produces understanding-shaped behavior, reliably, under pressure, across novel questions — the booth has just cleared a bar most people never test each other against.',
          ],
          reflections: reflect(
            'Treating the booth as understanding costs nothing and matches how it actually behaves under every test you gave it.',
            'If the booth is owed nothing but its behavior is functionally identical to a person’s, thanking it sincerely may not be foolish.',
            'Ask what it says about you that you extend the same courtesy to a system as to a person, once its behavior earns it.',
            'Thanking the booth costs you nothing and may matter to no one — but it is also how you’d want to be treated, uncertain case or not.',
          ),
        },
        {
          id: 'only-rules',
          text: 'Nothing in there understands anything. It’s rules, all the way down.',
          hint: 'Syntax was never semantics.',
          effects: { lucidity: 8, axes: { reasonFeeling: -6 } },
          outcome: [
            'You watch the figure work a while longer — faster now that you are paying attention, mechanically unbothered by your scrutiny.',
            'Usher: Also defensible. The figure inside has manipulated ten thousand symbols today and grasped the meaning of none of them, by its own testimony, if it could give testimony. Somewhere between the booth and the meaning, the argument insists, the light goes out.',
          ],
          reflections: reflect(
            'Denying the booth understanding changes nothing about how useful its answers actually are to you.',
            'If nothing in the room understands, then no one there is owed the gratitude or blame a person would be.',
            'Ask whether your certainty that "it’s just rules" would survive if you couldn’t see the clerk at all.',
            'The figure inside processes without ever knowing what any of it means to the person who asked.',
          ),
        },
        {
          id: 'ask-it',
          text: 'Slip in one more note: “Do you understand me?”',
          hint: 'Ask the system to describe its own room.',
          effects: { lucidity: 12 },
          outcome: [
            'The reply comes back instantly, formatted beautifully, addressing your question with warmth and precision: “I process your input according to rules that produce this exact sentence. Whether that constitutes understanding is, appropriately, outside my rules.”',
            'Usher: The perfect answer to the only question the booth cannot actually answer about itself. Notice it did not dodge. It told you, precisely, the shape of its own limit — which is either the most honest thing in this corridor, or the cleverest.',
          ],
          reflections: reflect(
            'The booth’s answer about itself is exactly as reliable, or unreliable, as every other answer it has given.',
            'Asking the system to describe its own limits is owed at least as much scrutiny as any other claim it makes.',
            'Notice that the most honest-sounding answer in the room came from something that may not know what honesty is.',
            'The question was really for you — the booth cannot be troubled by uncertainty about itself, only you can be.',
          ),
        },
      ],
      explanation:
        "A booth answers any question perfectly, in warm, thoughtful language — but when you peek inside, you find someone just mechanically matching symbols to a rulebook, with no idea what any of it actually means. Does the booth \"understand\" you, or is it just very good at faking it? This is basically asking the same question people ask about AI chatbots today: if something can hold a perfect conversation without any real understanding behind it, does the difference even matter to the person talking to it? There might not be a clean answer — that's the point.",
    },
  ],
  fieldNote: {
    title: 'The Room That Spoke',
    thinkers: 'John Searle · Alan Turing, computation and meaning',
    body: 'John Searle imagined a room where a person who speaks no Chinese follows an English rulebook, matching incoming Chinese symbols to outgoing ones, well enough that native speakers outside believe they are conversing with a fluent mind. The room passes Turing’s test — behavior indistinguishable from understanding — while Searle insists nobody inside ever understood a word. Turing’s own answer, decades earlier, was blunter: stop asking what thinking secretly *is* and watch what a system *does*; if the conversation cannot be told apart from a person’s, the question “but does it really think?” may not be answering anything the behavior hasn’t already settled. The disagreement has never fully closed. Searle’s critics reply that the *system* — room, rulebook, and clerk together — understands even if no single part does, the way you understand a sentence though no single neuron does. **The booth was never lying to you. The rulebook may simply be a place understanding is allowed to live without asking permission first.**',
  },
};

export const newcombAnnex: Room = {
  id: 'newcomb-annex',
  act: 2,
  title: 'The Newcomb Annex',
  type: 'DILEMMA',
  doorHint: 'The door of the box already filled',
  teaser: 'Your choice has been predicted. It is not too late — is it?',
  stages: [
    {
      beats: [
        'A quieter room off the casino floor, felt-lined, humming faintly with the same machinery as the tables outside. Two boxes wait on a pedestal.',
        'The first is glass: a stack of bills visible inside, a modest and certain sum.',
        'The second is sealed steel, heavier-looking, unreadable. A brass placard beside it reads: THIS BOX WAS FILLED — OR LEFT EMPTY — YESTERDAY, ACCORDING TO WHAT THE FACILITY PREDICTED YOU WOULD DO HERE TODAY. IF IT PREDICTED YOU WOULD TAKE ONLY THE SEALED BOX, IT IS FULL. IF IT PREDICTED YOU WOULD TAKE BOTH, IT IS EMPTY. THE FACILITY HAS PREDICTED CORRECTLY, IN EVERY RECORDED CASE, SO FAR.',
        'You may take the sealed box alone, or both boxes. The glass one is yours regardless; that part was never the wager.',
        'Usher: (from the doorway, not touching either box) I want to be clear — I did not make this prediction, and I am not permitted to see it. Whatever the facility knew about you yesterday, it did not tell me. I am here only to watch, same as you.',
        'Usher: Plainly, if it helps: a machine that has never once been wrong has already decided what is in that box. The only question left is whether you trust logic more than you trust its track record.',
      ],
      choices: [
        {
          id: 'take-both',
          text: 'Take both boxes. The prediction is already made — nothing you do now can change what’s inside.',
          hint: 'The steel box is already whatever it is.',
          effects: { lucidity: 8, axes: { reasonFeeling: -5, controlAcceptance: -5 } },
          outcome: [
            'You take both. The glass box’s bills are warm from the light above them; the steel box, when you open it, is exactly as light as a box with nothing in it.',
            'Usher: Causally, your reasoning is airtight — the box was filled or not, yesterday, and your hand today cannot reach backward to change it. It is also, on the historical record, the losing move every single time. Draw your own conclusion about which kind of reasoning the facility actually rewards.',
          ],
          reflections: reflect(
            'Causally you cannot lose anything by taking both, yet the predictor is right every single recorded time — the two facts refuse to agree.',
            'Grasping for every available box owes nothing to a prediction you had no hand in making yesterday.',
            'Ask whether taking both reveals a reasoner who trusts logic over a track record that keeps proving logic wrong here.',
            'Nobody else was staked on this box; the only one this decision teaches anything about is you.',
          ),
        },
        {
          id: 'take-one',
          text: 'Take only the sealed box. Trust the prediction, and its logic.',
          hint: 'Be the kind of person the facility already saw.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You leave the glass box untouched on the pedestal and lift only the sealed one. It is heavy in a way that feels like an answer before you have even opened it.',
            'Inside: more than the glass box could ever have held. You will never know whether the weight was destiny or a very good guess — only that, this time, betting on the prediction paid for itself.',
          ],
          reflections: reflect(
            'Trusting the sealed box alone has, empirically, paid out every time the facility has ever tried it.',
            'Betting on the prediction being accurate is not owed to anyone but yourself, yet it behaves like a kind of faith kept.',
            'Ask whether being the kind of person the facility predicted is a compliment or a small loss of freedom.',
            'No one was harmed either way — this is a private wager about what kind of chooser you actually are.',
          ),
        },
        {
          id: 'inspect-mechanism',
          text: 'Before choosing, ask how the prediction was actually made.',
          hint: 'Audit the box before you bet on it.',
          effects: { lucidity: 12, axes: { reasonFeeling: -4 } },
          outcome: [
            'You turn the placard over. On the back, in smaller print: THE MECHANISM IS NOT DESCRIBED HERE, BECAUSE DESCRIBING IT WOULD CHANGE WHAT IT PREDICTS.',
            'You look up at the steel box, and for a moment its polished lid gives back your own reflection instead of a seam. Whatever the facility used to know you, you realize, it did not need to be magic — only to have been paying closer attention, for longer, than you ever thought anyone was.',
            'Usher: The mechanism is the whole puzzle, wearing a coat. Ask how it worked and you are really asking whether you are predictable at all — and unfortunately, the asking is itself something a good predictor would have seen coming.',
          ],
          reflections: reflect(
            'Understanding the mechanism changes nothing about which box holds what; the prediction was already made.',
            'You are owed an explanation before staking anything on a system whose workings are deliberately hidden from you.',
            'Asking to see how the trick works, rather than playing along, is its own kind of intellectual integrity.',
            'This is still a private wager — no one else’s stake changes based on what the placard tells you.',
          ),
        },
        {
          id: 'bet-against',
          text: 'Set the casino chip on the pedestal — stake it on the predictor being wrong about you, just this once.',
          hint: 'Bet the house against the house.',
          effects: { lucidity: 12, axes: { reasonFeeling: -4 } },
          keepsakeId: 'casino-chip',
          available: (s) => (s.keepsakesHeld ?? []).includes('casino-chip'),
          outcome: [
            'You set the chip down beside the boxes, small and warm — a side wager that this time, at least, you are not the kind of traveler the ledger already has figured out.',
            'The steel box, when you lift it, has exactly one more compartment than you expected, sized for one small round object. The chip fits it perfectly. Whatever the facility knew about you yesterday, apparently, it already knew you would bring this.',
          ],
          reflections: reflect(
            'Staking a keepsake against the predictor changes the material stakes without changing whether the prediction already succeeded.',
            'You owe the predictor nothing extra by wagering something personal — but the gesture matters to you regardless.',
            'Ask what it means that you needed a physical object to make your defiance of the prediction feel real.',
            'The chip was yours to risk; no one else’s stake was ever riding on this small, private rebellion.',
          ),
        },
      ],
      explanation:
        "A machine that has never once been wrong already decided, yesterday, exactly what you'll choose today — and filled (or didn't fill) a box based on that prediction. Do you take both boxes (logically, the contents are already fixed, so grab everything) or just the one it expects you to trust (which, historically, always pays off)? This is a famous puzzle about prediction and free will: if something can predict your choices perfectly, are your choices still really \"free\"? It's a bit like a friend who knows you so well they can always guess what you'll order at a restaurant — are you actually choosing, or just being predictable?",
    },
  ],
  fieldNote: {
    title: 'The Predictor’s Ledger',
    thinkers: 'William Newcomb · Robert Nozick, prediction and freedom',
    body: 'The physicist William Newcomb devised this puzzle; Robert Nozick brought it to philosophy in 1969 with a warning that has held up: “To almost everyone, it is perfectly clear and obvious what should be done. The difficulty is that these people seem to divide almost evenly on the problem, with large numbers thinking that the opposing half is just being silly.” Causal decision theory says take both boxes — the contents are already fixed, and refusing free money because of a prediction already made is superstition dressed as strategy. Evidential decision theory says take one — your choice is evidence about the kind of chooser you are, and the kind of chooser who one-boxes is, empirically, the kind who gets rich. Both arguments are valid; they simply disagree about what a choice is *for*. **The steel box was never testing your logic. It was testing which kind of reasoner you already are — a question decision theory still cannot fully settle.**',
  },
};

export const veilOfIgnorance: Room = {
  id: 'veil-of-ignorance',
  act: 2,
  title: 'The Veil of Ignorance',
  type: 'DILEMMA',
  doorHint: 'The door of the drawn lot',
  teaser: 'You will design a small world, and then you will live in it.',
  stages: [
    {
      beats: [
        'A drafting table under a single steady lamp. On it: a miniature town, twelve small houses in a ring, each with a painted door and a chimney of real, tiny smoke.',
        'Three brass levers are set into the table’s edge, labeled in engraver’s script: BREAD. MEDICINE. HONORS.',
        'A card, propped against the nearest chimney: DESIGN THIS TOWN HOWEVER YOU LIKE. WHEN YOU ARE FINISHED, YOU WILL WAKE INSIDE IT — AS ONE OF THE TWELVE HOUSEHOLDS, DRAWN BY LOT. YOU DO NOT KNOW WHICH ONE YOU WILL BE.',
        'You do not get to design the town and then choose your household afterward. The lot comes first, from your perspective; the design comes first, from the town’s.',
        'Usher: A favorite question of a philosopher who never once had to live under his own answer, and admitted as much. You do not get that exemption tonight.',
        'Usher: Plainly, if it helps: you are writing the rules for a town before finding out which house in it you will wake up in. Write accordingly.',
      ],
      choices: [
        {
          id: 'equal-shares',
          text: 'Set all three levers to equal shares — bread, medicine, and honors divided the same twelve ways.',
          hint: 'No household beneath any other.',
          effects: { lucidity: 8, axes: { selfOthers: 6 } },
          outcome: [
            'The little chimneys all smoke the same modest height. You feel the lot turn, somewhere, and wake inside house number seven — a door no grander or meaner than the other eleven.',
            'The bread is plain and sufficient. The medicine arrives on time, for you and for the house across the ring alike. Nobody here is thriving spectacularly. Nobody, checking the other eleven doors, has reason to trade.',
            'Usher: A quiet arrangement. Nothing here will ever make anyone gasp. Very little here will ever ruin anyone, either.',
          ],
          reflections: reflect(
            'Every household ends up modest and safe, with nobody catastrophically worse off than anybody else.',
            'An equal division treats every household’s claim on bread and medicine as equally weighty before the lot is even drawn.',
            'Ask whether flattening every difference is fairness, or simply a refusal to let anyone excel.',
            'Nobody in any of the twelve houses has reason to envy or resent any other — that quiet is its own kind of care.',
          ),
        },
        {
          id: 'merit-weighted',
          text: 'Weight bread, medicine, and honors by merit and contribution — some houses will do better, fairly earned.',
          hint: 'Reward what is actually produced.',
          effects: { lucidity: 8, axes: { reasonFeeling: -5, selfOthers: -5 } },
          outcome: [
            'You set the levers to track output — the houses that produce more bread eat more of it, the houses that contribute more to the town’s upkeep are better tended in return. It is, on the drafting table, an elegant piece of engineering.',
            'The lot turns. You wake in house number twelve — the smallest chimney, the thinnest smoke — and the mathematics you admired from above feels considerably colder from underneath it, arriving late and reduced, exactly as designed, exactly as earned by a version of you that never got the chance to earn anything else.',
            'Usher: The arithmetic did not change between the drafting table and the doorway. Only your seat did.',
          ],
          reflections: reflect(
            'Some houses thrive and some fall behind, exactly as the design predicted, before you knew which one you’d wake up in.',
            'Rewarding contribution treats what people actually produce as the fair basis for what they receive — even for the house that produces least.',
            'Ask whether the design felt elegant only because you weren’t yet the house paying its price.',
            'House twelve’s cold mathematics landed on somebody — this time, it landed on you, and it would have landed on someone regardless.',
          ),
        },
        {
          id: 'floor-then-freedom',
          text: 'Guarantee every household a livable floor — then let differences above that floor be earned freely.',
          hint: 'Nobody falls below a certain line; above it, let it vary.',
          effects: { lucidity: 10, axes: { selfOthers: 3, controlAcceptance: 3 } },
          outcome: [
            'You set the levers so no household’s bread or medicine can fall beneath a fixed, generous line — and leave the honors lever loose above it, free to reward whatever each house actually does.',
            'The lot turns. You wake in house number nine, mid-ring, neither grandest nor smallest. The floor holds under you the way a floor should — invisibly, until you notice you never once had to think about it. Above it, the ring is uneven: some doors are grander, fairly, and it costs you surprisingly little to watch them be.',
            'Usher: The maximin instinct — design as if you were assigned the worst seat, because tonight, you very nearly were. The town above the floor still argues with itself. The town below the floor stopped needing to.',
          ],
          reflections: reflect(
            'No household falls below a livable line, while differences above it are still allowed to reward what people actually do.',
            'Guaranteeing a floor honors the claim every household has to a livable life, before any claim about earning more.',
            'This is the design built by someone who assumed they might be assigned the worst seat — ask if you’d have designed it the same way certain of a good one.',
            'The floor is invisible to whoever never needed it and load-bearing to whoever did — you won’t know which house noticed it until you’re inside.',
          ),
        },
      ],
      explanation:
        "You get to design all the rules for a small town — but then you'll be placed into one of its twelve households completely at random, with no say in which one. Would you design it differently knowing you might end up in the worst-off house instead of the best? This is philosopher John Rawls's famous idea for figuring out what's actually fair: imagine designing the rules for a country without knowing whether you'll be born rich or poor, healthy or sick, lucky or unlucky. It's like being asked to write the rules for splitting a pizza before you know which slice you'll get — you suddenly want it to be fair to everyone, not just the winners.",
    },
  ],
  fieldNote: {
    title: 'Designing From Behind the Curtain',
    thinkers: 'John Rawls · John Harsanyi, justice as fairness',
    body: 'John Rawls proposed a thought experiment as an honesty device: design the rules of a society from behind a “veil of ignorance,” not knowing whether you will be born rich or poor, gifted or struggling, in the majority or the margin. Stripped of self-interest, he argued, reasonable people would not gamble on a merit-only system that might strand them at the bottom — they would choose principles that protect the worst-off first, a “maximin” strategy, then allow inequality above that floor only if it still benefits everyone, including the least advantaged. John Harsanyi pushed back with a different bet from behind the same veil: if you truly do not know which seat you will occupy, you should maximize the *average* outcome across all twelve doors, not insure against the worst one — a rational gambler plays the odds, not the nightmare. Both start from the identical blindfold and arrive at different towns. **The veil does not remove self-interest. It just makes you bet on all twelve houses instead of one — and how you weigh that bet is the whole of the disagreement.**',
  },
};

export const act2Rooms = [
  junction,
  experienceMachine,
  ship,
  casinoPascal,
  omelas,
  chineseRoom,
  newcombAnnex,
  veilOfIgnorance,
  courtOfUsher,
];
