// The Records Office — spec docs/design-limerence/05-rooms-act4-understory.md
// §"The Records Office". Mechanically plain `act: 4` rooms, sequenced
// entirely by `offeredDoors`'s act-4 branch (see storyEngine.ts) — never by
// actPools. They only ever appear for a returning guest
// (RunState.prior.runs >= 1) who takes the stairs fork beside
// the-kitchen-table instead of entering it directly.
import type { Reflection, Room, RunState } from '../../../engine/schema';
import { choseInPrior, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../../engine/gameState';
import { theFrontDesk } from './prologue';
import {
  theReadReceipt,
  theScreenshot,
  thePassword,
  theParty,
  theForward,
  theBestFriendsGirl,
  theSummerEnds,
  theRumor,
} from './act1';
import {
  theDistance,
  theHallPass,
  theRebound,
  theUnicorn,
  justFriends,
  theEx,
  theConfession,
  theOtherSideOfTheDoor,
  theScoreboard,
} from './act2';
import {
  theColleague,
  theMetamour,
  theVeto,
  theDrift,
  theSecondAccount,
  theDiscovery,
  theWeddingEve,
  theTherapist,
  theUsualSuite,
  theUsualRoom,
} from './act3';
import { limerenceEndings } from '../endings';

// Exported so a future translation pass can re-translate the referenced
// room/ending titles instead of leaking the English ones into a
// non-English sentence (matches ANAMNESIS's understory.ts convention).
export const ROOM_TITLE_BY_ID: Record<string, string> = Object.fromEntries(
  [
    theFrontDesk,
    theReadReceipt,
    theScreenshot,
    thePassword,
    theParty,
    theForward,
    theBestFriendsGirl,
    theSummerEnds,
    theRumor,
    theDistance,
    theHallPass,
    theRebound,
    theUnicorn,
    justFriends,
    theEx,
    theConfession,
    theOtherSideOfTheDoor,
    theScoreboard,
    theColleague,
    theMetamour,
    theVeto,
    theDrift,
    theSecondAccount,
    theDiscovery,
    theWeddingEve,
    theTherapist,
    theUsualSuite,
    theUsualRoom,
  ].map((r) => [r.id, r.title]),
);
export const ENDING_TITLE_BY_ID: Record<string, string> = Object.fromEntries(limerenceEndings.map((e) => [e.id, e.title]));

const LIMERENCE_ACT_POOLS: Record<1 | 2 | 3, string[]> = {
  1: ['the-read-receipt', 'the-screenshot', 'the-password', 'the-party', 'the-forward', 'the-best-friends-girl', 'the-summer-ends'],
  2: ['the-distance', 'the-hall-pass', 'the-rebound', 'the-unicorn', 'just-friends', 'the-ex', 'the-confession', 'the-other-side-of-the-door'],
  3: ['the-colleague', 'the-metamour', 'the-veto', 'the-drift', 'the-second-account', 'the-discovery', 'the-wedding-eve', 'the-therapist', 'the-usual-suite'],
};

const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

const registryExhibitBeat = (s: RunState): string => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'The card in the open file is blank, its corner water-stained — whatever this file once held didn’t survive the trip down. The rest of the shelf, at least, is legible.';
  }
  return `The card reads, in your own hand: "${entry.choiceText}" No further commentary. The Records Office doesn’t editorialize. It only keeps.`;
};

export const theRegistry: Room = {
  id: 'the-registry',
  act: 4,
  title: 'The Registry',
  type: 'NO-SOLUTION',
  doorHint: 'the stairs behind the desk',
  teaser: 'your last stay is already filed — filing is all the basement does',
  stages: [
    {
      beats: [
        'Stairs behind the front desk that were, you would have sworn, not there at check-in. Below: a long, low room, shelves of identical grey files stretching further than the ceiling should allow.',
        'One shelf holds a single newer file: yours. Stamped, underneath a date you recognize as an ending: COMPLETE. FILED. NOT FORGOTTEN.',
        registryExhibitBeat,
        'Stapled to the intake form, the description you once gave of yourself, verbatim: "{blurb}" Filed without comment — either respect, or a filing error. The two look identical from down here.',
        'Porter (in the doorway, hat under his arm): "I don’t come down here often. Nothing here is forbidden. Most guests only want to visit once, if that. The registry doesn’t mind either way. It has nowhere else to be."',
      ],
      choices: [
        {
          id: 'sign-it',
          text: '"That was me. I’ll own it — all of it." Sign the card yourself.',
          hint: 'own it, the hardest kind of signature',
          effects: { lucidity: 10, axes: { selfOthers: -3 } },
          outcome: [
            'You take the pen chained to the shelf and sign beneath the typed line, in your own hand, which the file seems to have been expecting.',
            'Porter: "Not every guest signs. You added your name to a night that already happened. I don’t know what that costs. I know it isn’t nothing."',
          ],
        },
        {
          id: 'disown-it',
          text: '"That doesn’t sound like me anymore." Leave the card unsigned.',
          hint: 'let the distance be real, not just comfortable',
          effects: { lucidity: 6, axes: { controlAcceptance: -5 } },
          outcome: [
            'You leave the card exactly as you found it and step back from the shelf, the way you might step back from a stranger who happens to share your coat.',
            'Porter: "The file does not argue. It only keeps what happened — whether or not the hand that did it still answers to your name."',
          ],
        },
        {
          id: 'refile-unjudged',
          text: 'Close the lid gently, mid-sentence, without comment either way.',
          hint: 'neither defend it nor deny it — file it',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You close the file the way you might close a book mid-chapter, out of respect rather than agreement, and return it to the shelf.',
            'Porter: "That, I think, is the shelf’s actual purpose. Not a verdict — a place to put something down without needing to have finished deciding what it was."',
          ],
        },
        {
          id: 'pin-the-keycard',
          text: 'Pin the old keycard to the edge of the open file — an amendment to the record.',
          hint: 'proof the corridor happened, and was walked away from',
          effects: { lucidity: 10 },
          keepsakeId: 'the-keycard',
          available: (s: RunState) => (s.keepsakesHeld ?? []).includes('the-keycard'),
          outcome: [
            'You press the deactivated keycard against the file until it holds — proof both that the corridor happened, and that you walked away from it.',
            'The registry accepts it exactly the way registries accept everything: without comment, without objection, and, you notice, without ever once needing to.',
          ],
        },
      ],
      explanation:
        'You’re shown a filed, dated record of a choice from your last stay here, read back cold, without any of the context that made it feel reasonable at the time. Do you still stand by it, distance yourself from it, or accept it happened without fully judging it either way? This is about how we relate to our own past choices once time has passed — like rereading an old message and not being entirely sure the person who sent it and the person reading it now are quite the same.',
    },
  ],
  fieldNote: {
    title: 'On Keeping Files',
    thinkers: 'narrative identity (Ricœur echo, cross-title)',
    body: 'Paul Ricœur argued that a self is not a thing located by introspection but a narrative kept continuously in revision — its sameness lying not in never changing but in being able to change and still call it the same story. This room stages the confrontation his theory was built to survive: a specific, dated, filed act, read back cold, without the surrounding chapters that made it feel inevitable at the time. Owning it, disowning it, and filing it unjudged are three different relationships to authorship, and Ricœur’s own answer sits closer to the third than either of the first two. **You are not obliged to endorse every night in the file. Only to admit whose handwriting it is.**',
  },
};

const doorsNotOpenedListBeat = (s: RunState): string => {
  const { candidates } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (candidates.length === 0) {
    return 'The corridor is oddly bare tonight — every door you might have missed, you apparently didn’t. Or the record of them simply didn’t survive the trip down.';
  }
  const titles = candidates.map((id) => ROOM_TITLE_BY_ID[id] ?? id);
  return `Three catch your eye first: ${titles.join(', ')}. You don’t remember any of them opening. You’re fairly sure, now, that at least one was offered — and you walked past it.`;
};

const doorsNotOpenedOpensBeat = (s: RunState): string => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (!opens) {
    return 'No single door singles itself out tonight. The corridor stays entirely shut, and somehow that is its own kind of answer.';
  }
  const title = ROOM_TITLE_BY_ID[opens] ?? opens;
  return `One door, near the end, swings the rest of the way open on its own — ${title}. Whatever was waiting behind it is, evidently, still waiting.`;
};

const doorsNotOpenedEnterOutcome = (s: RunState): string => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  const title = opens ? (ROOM_TITLE_BY_ID[opens] ?? opens) : 'the room';
  return `You step through into ${title} — or what’s left of it. No crisis mid-sentence, no one waiting. Just a room, furnished, a little dusty, doing nothing in particular.`;
};

export const theDoorsNotOpened: Room = {
  id: 'the-doors-not-opened',
  act: 4,
  title: 'The Doors Not Opened',
  type: 'DILEMMA',
  doorHint: 'the corridor kept at temperature',
  teaser: 'every door you walked past, still ajar — one is opening',
  stages: [
    {
      beats: [
        'A corridor kept at temperature, lined with doors standing slightly open — not invitingly. Just open, the way a door stays open when no one has bothered to close it in a very long time.',
        'These are the doors from your last stay you never went through. Unentered, undecided, technically still available — the specific way a missed train is still, technically, a train.',
        doorsNotOpenedListBeat,
        doorsNotOpenedOpensBeat,
        'Porter: "I wouldn’t read too much into which one. Or I would, entirely — I have never once decided which advice is worse. And I’ll say the honest thing this floor doesn’t always say aloud: the affair you didn’t have is sometimes a door you were never offered. Unopened is not automatically virtue."',
      ],
      choices: [
        {
          id: 'enter-late',
          text: 'Push it the rest of the way open. Go in.',
          hint: 'curiosity, honored late',
          effects: { lucidity: 8, axes: { reasonFeeling: 4 } },
          outcome: [
            doorsNotOpenedEnterOutcome,
            'Whatever was going to happen here already happened, or didn’t, or the question simply expired the way unopened mail eventually stops being urgent. It is smaller than you built it. Most unlived things are.',
          ],
          reflections: reflect(
            'Whatever waited in there already happened, or didn’t — walking in now changes nothing about what was possible then.',
            'You owe the old possibility nothing except the honesty of finally looking — entering late discharges a private curiosity, not a debt anyone was owed.',
            'Ask whether entering now, once it can no longer cost you anything, is genuine curiosity honored, or a safe rehearsal of courage.',
            'No one was ever waiting in this room for you — the only person this late visit is for is the one standing in the doorway.',
          ),
        },
        {
          id: 'close-it',
          text: 'Close it the rest of the way. Some doors are honestly better left as doors.',
          hint: 'respect its pastness',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You push it shut, gently, the way you’d close a door on a room where someone is finally, actually asleep.',
            'The correct instinct, arguably. Not every unopened door was a regret in waiting.',
          ],
          reflections: reflect(
            'Closing it changes nothing about what was inside — the door simply returns to being exactly what it was before you noticed it.',
            'You owe some doors nothing but the respect of leaving them shut — not every possibility is owed a second look just because it’s finally offered.',
            'Ask whether closing it was wisdom about which doors were never yours, or a quieter avoidance dressed as restraint.',
            'No one behind that door needed you to open it — you leave it exactly as undisturbed as you found it.',
          ),
        },
        {
          id: 'ask-why-now',
          text: '"Why did you open again, now, of all times?" Ask the door itself.',
          hint: 'interrogate the offering, not just the room',
          effects: { lucidity: 10, axes: { reasonFeeling: -5 } },
          outcome: [
            'No answer, exactly — doors, even here, are not naturally forthcoming — but the hinges are recently oiled. Someone wanted this door easy to move tonight, specifically.',
            'Porter: "My best guess: the basement offers the door you are now ready to survive not opening. It has never once explained its timing to me either."',
          ],
          reflections: reflect(
            'The oiled hinges tell you the door was prepared for tonight specifically — but knowing that changes nothing about whether you walk through it.',
            'You owe the offering itself an honest question before you owe it an answer — asking why now is its own kind of diligence.',
            'Ask whether interrogating the door instead of just using it is rigor, or a way to delay the harder choice.',
            'The hinges were oiled for you alone — whatever the timing means, this attention was never meant for anyone else.',
          ),
        },
      ],
      explanation:
        'You’re shown the doors you walked past without opening on your last stay — paths never taken, forever unknown now. One creaks open again on its own. This is the pull of "the road not taken": do you finally look, now that it costs nothing? This game adds one honest correction to the folklore version: the affair you didn’t have is sometimes a door you were never offered, not a virtue you earned — unopened and untempted are not the same achievement.',
    },
  ],
  fieldNote: {
    title: 'The Road Not Taken, Audited',
    thinkers: 'Kierkegaard’s vertigo of the possible · Frost misread, corrected',
    body: 'Kierkegaard called possibility the most dizzying thing available to a person — more vertiginous than any actual danger, because the actual is finite while the possible multiplies without limit the longer you stand at a fork refusing to choose. Frost’s "The Road Not Taken" gets misquoted at nearly every graduation as an anthem for bold divergence, but the poem itself is slyer: the two roads are, the speaker admits two stanzas earlier, worn "really about the same" — the wistful sigh at the end is confessed in advance as a story reshaped by hindsight, not a truth reported from the fork. **Re-aimed at relationships: the person you didn’t choose is a rumor, not a receipt.** The doors in this corridor were never secretly better. They were simply, briefly, possible — and possibility, once it closes, keeps none of its receipts, only its rumors.',
  },
};

const ECHO_EMPTY_FALLBACK = 'The other chair says nothing. There is, this time, nothing recorded to assemble a voice from — and the room, to its credit, doesn’t pretend otherwise.';

const otherSideVoiceBeat = (s: RunState): string => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) return ECHO_EMPTY_FALLBACK;
  const lines = moments.map((e) => `"${e.choiceText}"`).join(' Then: ');
  return `It speaks two or three of your own sentences back to you — a half-tone flatter than you remember saying them, the way defensiveness sounds from the receiving chair: ${lines}`;
};

const otherSideGateBeat = (s: RunState): string => {
  if (choseInPrior(s.prior, 'the-rumor', 'set-the-trap')) {
    return 'It remembers the trap, too — the version of you that set one for someone it loved. "It worked," it says, quoting itself back with a kind of rueful honesty. "That was never the part in question."';
  }
  if (choseInPrior(s.prior, 'the-rumor', 'trust-without-asking')) {
    return 'It remembers the lake, too — the version of you that chose never to know. "Trust, practiced instead of felt," it says, and for once doesn’t sound like it’s arguing.';
  }
  return 'It doesn’t mention the Rumor. Either you never reached it, or it wasn’t the part of you that needed saying out loud tonight.';
};

const otherSideEndingBeat = (s: RunState): string => {
  const id = s.prior?.endingId;
  if (!id) return 'It doesn’t know how you left, last time. Some things, apparently, the room doesn’t keep either.';
  const title = ENDING_TITLE_BY_ID[id] ?? id;
  return `It knows how you left, too — neither proud of it nor ashamed, which is somehow worse than either. "${title}," it says, once, flatly, and doesn’t repeat itself.`;
};

export const theOtherSide: Room = {
  id: 'the-other-side',
  act: 4,
  title: 'The Other Side',
  type: 'INSIGHT',
  doorHint: 'the room with the second chair',
  teaser: 'someone in there talks exactly like you — that’s the problem',
  stages: [
    {
      beats: [
        'A bare room. Two chairs, facing each other, close enough that whoever sits in either one is clearly meant to be heard.',
        'The other chair is occupied. Not by a person — the room is precise about this, precise the way only a place with nothing to gain from lying can be — but by a voice, assembled out of what you said and chose the last time you stayed here.',
        otherSideVoiceBeat,
        otherSideGateBeat,
        otherSideEndingBeat,
        'Porter: "I don’t sit in on this one. Whatever the two of you are doing in here, it was never mine to referee."',
      ],
      choices: [
        {
          id: 'answer-yourself',
          text: '"I hear you." Speak back to who you were.',
          hint: 'acknowledgment, not correction',
          effects: { lucidity: 10, axes: { selfOthers: 4 } },
          outcome: [
            'You say it — not a correction, not an apology, just an acknowledgment, the way you’d greet someone at a door you weren’t sure would still recognize you.',
            'The other chair doesn’t answer back, exactly. But something in the room settles, the way a held breath does when it’s finally let go on purpose, by two people instead of one.',
          ],
          reflections: reflect(
            'Speaking back changes nothing about what was already said — it only changes whether it was heard.',
            'You owe your former self an acknowledgment, not a correction — greeting it is a debt of recognition, not agreement.',
            'Ask whether addressing the voice instead of just witnessing it is courage, or an old habit of needing the last word.',
            'The room settles like a held breath let go by two people instead of one — a small mercy extended to whoever you used to be.',
          ),
        },
        {
          id: 'let-yourself-finish',
          text: 'Sit across from it and say nothing. Let it finish, this time, uninterrupted.',
          hint: 'the uninterrupted hearing you may never have given anyone',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You let it speak, all the way to the end, without correcting a single word — which, you notice, is not a thing you always managed the first time either.',
            'The silence is not empty. It is, if anything, the most complete thing said in the room.',
          ],
          reflections: reflect(
            'Letting it finish uninterrupted changes nothing about what it says — only whether, this time, it gets to say all of it.',
            'You owe your former self the hearing you may not have given it the first time — silence here pays a debt of attention, not agreement.',
            'Ask whether staying silent is patience, or simply easier than finding out what you’d say back.',
            'The silence is the most complete thing said in the room — a form of care that asks nothing of the voice except to finish.',
          ),
        },
        {
          id: 'sit-in-both-chairs',
          text: '"There was never anyone else in here." Sit in both chairs, in turn, and mean it.',
          hint: 'the costliest reading: there was only ever you',
          effects: { lucidity: 12 },
          outcome: [
            'You sit in the second chair too, briefly, and try the voice on like a coat you used to own — and it fits, exactly, which is either comforting or the whole problem, depending on the hour.',
            'There was never a guest here to entertain. Only a series of you, taking turns holding the sentence.',
          ],
          reflections: reflect(
            'Sitting in both chairs changes nothing about which version of you is speaking now — it only removes the pretense that there were ever two.',
            'You owe no visitor an audience, because admitting there was never one dissolves the very idea of a debt between host and guest.',
            'Ask whether this is the costliest honesty in the room, or a clever way to avoid actually answering the voice.',
            'There was never a guest to care for here — only a series of you, and the care was always, quietly, self-directed.',
          ),
        },
        {
          id: 'hand-the-sim',
          text: 'Hand the dead SIM card to the voice in the second chair.',
          hint: 'the person you stopped being in secret',
          effects: { lucidity: 12, axes: { selfOthers: 4 } },
          keepsakeId: 'the-sim',
          available: (s: RunState) => (s.keepsakesHeld ?? []).includes('the-sim'),
          outcome: [
            '"Here," you say, holding it out — a small dead chip, deactivated, no signal left in it at all. "Here’s the person I stopped being in secret."',
            'The other chair takes it without a word. It is, somehow, the most honest exchange either version of you has ever managed.',
          ],
        },
      ],
      explanation:
        'Sitting across from you is a voice built entirely out of things you said and chose the last time you stayed here — not a ghost, an echo of a version of yourself from before. Perspective-taking research is unambiguous: reliably, briefly practiced, it measurably softens destructive conflict more than almost any other intervention studied — this room turns the whole hotel’s syllabus into one exercise.',
    },
  ],
  fieldNote: {
    title: 'The Second Chair',
    thinkers: 'perspective-taking research',
    body: 'Perspective-taking interventions — deliberately imagining and articulating a conflict from the other side — measurably reduce destructive conflict behavior in controlled studies, and the effect survives even brief, single-session exercises. **It is a skill, not a trait: it decays without practice, and must be practiced, which is the entire premise of this room.** Every fight in this hotel had two first-person narrators. The basement keeps both recordings.',
  },
};

export const understoryRooms = [theRegistry, theDoorsNotOpened, theOtherSide];
