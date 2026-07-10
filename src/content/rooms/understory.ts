// Act V — The Understory (spec `02-act-five-the-understory.md`, Phase L).
// Mechanically these are plain `act: 4` rooms, sequenced entirely by
// `offeredDoors`'s act-4 branch (see storyEngine.ts) — never by ACT_POOLS.
// They only ever appear for a returning traveler (RunState.prior.runs >= 1)
// who takes the staircase fork instead of `boulder`.
import type { Reflection, Room, RunState } from '../../engine/schema';
import { choseInPrior, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../engine/gameState';
import { act1Rooms } from './act1';
import { act2Rooms } from './act2';
import { act3Rooms } from './act3';
import { endings } from '../endings';

// Exported so the Czech/Farsi dynamic-beat overrides (cs-dynamic.ts,
// fa-dynamic.ts) can re-translate the referenced room/ending titles instead
// of leaking the English ones into a non-English sentence.
export const ROOM_TITLE_BY_ID: Record<string, string> = Object.fromEntries(
  [...act1Rooms, ...act2Rooms, ...act3Rooms].map((r) => [r.id, r.title]),
);
export const ENDING_TITLE_BY_ID: Record<string, string> = Object.fromEntries(endings.map((e) => [e.id, e.title]));

/** Examined Path (spec 05) shorthand — a Reflection tuple in the fixed
 * consequence/duty/virtue/care order (shuffled per-display by the UI). */
const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

const archiveExhibitBeat = (s: RunState): string => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'The card in the open box is blank, water-stained at one corner — whatever this box once held did not survive the trip down. The rest of the shelf, at least, is legible.';
  }
  return `The card reads, in your own hand: “${entry.choiceText}” No further commentary. The facility does not editorialize. It only keeps.`;
};

export const theArchive: Room = {
  id: 'the-archive',
  act: 4,
  title: 'The Archive · below',
  type: 'NO-SOLUTION',
  doorHint: 'The stair that wasn’t on the map',
  teaser: 'Somewhere below, your last run is already filed.',
  stages: [
    {
      beats: [
        'Down a stair that has no business existing here, into a long, low room lined with identical grey boxes — a whole wall of them, each labeled in a hand too neat to be anyone’s but the facility’s own.',
        'One shelf holds a single, newer box: yours. It is labeled with a date you recognize as an ending, and underneath, in smaller print: COMPLETE. FILED. NOT FORGOTTEN.',
        'On the reading table beside it, one box is already open — someone, or something, chose this before you arrived — and inside, a card, typed, quoting a single moment from the walk you already finished.',
        archiveExhibitBeat,
        'Stapled to the box, an intake form still carries the description you once gave of yourself: “{blurb}” The facility filed it without comment, which is either respect or a filing error; the two look identical from here.',
        'Usher: (from the doorway, hat under his arm) I don’t come down here often. It is not forbidden — nothing here is forbidden — it is simply that most travelers only want to visit once, if that. The archive doesn’t mind either way. It has nowhere else to be.',
      ],
      choices: [
        {
          id: 'stand-by-it',
          text: '“That was me. I’ll own it — all of it.” Sign the card yourself, beneath the print.',
          hint: 'Own it — the hardest kind of signature.',
          effects: { lucidity: 10, axes: { selfOthers: -3 } },
          outcome: [
            'You take the pen chained to the shelf and sign beneath the typed line, in your own hand, which the box seems to have been expecting.',
            'Usher: Not every traveler signs. Most read the card, wince, and back away as if the ink might still be wet enough to change. You added your name to a decision that already happened. I don’t know what that costs. I know it isn’t nothing.',
          ],
        },
        {
          id: 'disown-it',
          text: '“That doesn’t sound like me anymore.” Leave the card unsigned, and step back from the box.',
          hint: 'Let the distance be real, not just comfortable.',
          effects: { lucidity: 6, axes: { controlAcceptance: -5 } },
          outcome: [
            'You leave the card exactly as you found it and take one full step back from the shelf, the way you might step back from a stranger who happens to share your coat size.',
            'Usher: The record does not argue with you. It rarely does. It only keeps what happened, filed under the date it happened on — whether or not the hand that did it still answers to your name.',
          ],
        },
        {
          id: 'refile-it',
          text: 'Close the box gently, without comment either way, and slide it back into place on the shelf.',
          hint: 'Neither defend it nor deny it. File it.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You close the lid, carefully, the way you might close a book mid-sentence out of respect for a chapter rather than agreement with it, and return it to its place among all the others.',
            'Usher: That, I think, is the shelf’s actual purpose. Not a verdict either way — a place to put something down without needing to have finished deciding what it was.',
          ],
        },
        {
          id: 'pin-the-corner',
          text: 'Pin the unburnt corner of the photograph to the edge of the open box — an amendment to the record.',
          hint: 'Add to the file, rather than sign or refuse it.',
          effects: { lucidity: 10, axes: { selfOthers: 3 } },
          keepsakeId: 'photo-corner',
          available: (s) => (s.keepsakesHeld ?? []).includes('photo-corner'),
          outcome: [
            'You press the small torn corner against the card with your thumb until it holds, an amendment nobody asked you to make and nobody will ask you to justify.',
            'The archive accepts it exactly the way archives accept everything — without comment, without objection, and, you notice, without ever once needing to.',
          ],
        },
      ],
      explanation:
        "You're shown a filed, dated record of a choice you made on your last journey through this place, read back to you cold, without any of the context that made it feel reasonable at the time. Do you still stand by it, distance yourself from it, or just accept that it happened without fully judging it either way? This is about how we relate to our own past mistakes or decisions once time has passed — like reading an old journal entry or an old text message you sent, and not being totally sure the person who wrote it and the person reading it now are quite the same.",
    },
  ],
  fieldNote: {
    title: 'On Keeping Records',
    thinkers: 'Paul Ricœur (1990), narrative identity',
    body: 'Paul Ricœur argued that a self isn’t a thing you locate by introspection — it is a narrative you keep composing, revising the plot without ever finishing the book. He called this narrative identity: unlike a mere object, whose sameness lies in never changing, a self’s sameness lies in being able to change and still call it the same story. This room stages the confrontation Ricœur’s theory was built to survive: a specific, dated, filed act, read back to you cold, without the surrounding chapters that made it feel inevitable at the time. Owning it, disowning it, and filing it without a verdict are three different relationships to authorship — and Ricœur’s own answer sits closer to the third than either of the first two. **You are not obligated to still endorse every sentence you have written. Only to admit you are the one who is still holding the pen.**',
  },
};

const unchosenListBeat = (s: RunState): string => {
  const { candidates } = pickUnchosenRooms(s.prior);
  if (candidates.length === 0) {
    return 'The corridor is oddly bare tonight — every door you might have missed, you apparently didn’t. Or the record of them simply didn’t survive the trip down. The facility doesn’t say which.';
  }
  const titles = candidates.map((id) => ROOM_TITLE_BY_ID[id] ?? id);
  return `Three catch your eye first: ${titles.join(', ')}. You don’t remember any of them opening. You are fairly sure, now, that at least one of them was offered — and you simply walked past.`;
};

const unchosenOpensBeat = (s: RunState): string => {
  const { opens } = pickUnchosenRooms(s.prior);
  if (!opens) {
    return 'No single door singles itself out tonight. The corridor stays exactly, entirely shut, and somehow that is its own kind of answer.';
  }
  const title = ROOM_TITLE_BY_ID[opens] ?? opens;
  return `One door, near the end of the corridor, swings the rest of the way open on its own — ${title}. Whatever was waiting behind it is, evidently, still waiting.`;
};

const unchosenEnterOutcome0 = (s: RunState): string => {
  const { opens } = pickUnchosenRooms(s.prior);
  const title = opens ? (ROOM_TITLE_BY_ID[opens] ?? opens) : 'the room';
  return `You step through into ${title} — or what’s left of it. No fire, no facility voice waiting, no dilemma mid-sentence. Just a room, furnished, a little dusty, doing nothing in particular.`;
};

export const theUnchosen: Room = {
  id: 'the-unchosen',
  act: 4,
  title: 'The Unchosen · below',
  type: 'DILEMMA',
  doorHint: 'The corridor of doors you didn’t open',
  teaser: 'They stood ajar the whole time. One still does.',
  stages: [
    {
      beats: [
        'A corridor you don’t remember walking, lined with doors that stand slightly open — not invitingly. Just open, the way a door stays open when no one has bothered to close it in a very long time.',
        'These are the doors from your last walk through here that you never went through. The facility kept them exactly as you left them: unentered, undecided, technically still available, the specific way a missed train is still, technically, a train.',
        unchosenListBeat,
        unchosenOpensBeat,
        'Usher: I wouldn’t read too much into which one. Or I would, entirely — I have never once been able to decide which advice is worse.',
      ],
      choices: [
        {
          id: 'enter-it',
          text: 'Push it the rest of the way open. Go in.',
          hint: 'Curiosity, honored late.',
          effects: { lucidity: 8, axes: { reasonFeeling: 4 } },
          outcome: [
            unchosenEnterOutcome0,
            'Whatever was going to happen here already happened, presumably, to someone, or to no one, or the question simply expired the way unopened mail eventually stops being urgent. It is smaller than you built it up to be. Most unlived things are.',
            'Usher: That is the going rate on a door left shut. Not tragedy — just a room, waiting past its own occasion. Some travelers find that a relief.',
          ],
          reflections: reflect(
            'Whatever waited in there already happened, or didn’t, or the question simply expired — walking in now changes nothing about what was possible then.',
            'You owe the old possibility nothing except the honesty of finally looking — entering late discharges a private curiosity, not a debt anyone was owed.',
            'Ask whether entering now, once it can no longer cost you anything, is genuine curiosity honored, or just a safe rehearsal of courage.',
            'No one was ever waiting in this room for you — the only person this late visit is for is the one standing in the doorway.',
          ),
        },
        {
          id: 'close-it',
          text: 'Close it the rest of the way. Some doors are honestly better left as doors.',
          hint: 'Respect its pastness.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You push it shut, gently, the way you’d close a door on a room where someone is finally, actually asleep.',
            'Usher: The correct instinct, arguably. Not every unopened door is a regret in waiting. Some are simply doors you were right to leave alone the first time, whether or not you knew it then.',
          ],
          reflections: reflect(
            'Closing it changes nothing about what was inside — the door simply returns to being exactly what it was before you noticed it.',
            'You owe some doors nothing but the respect of leaving them shut — not every possibility is owed a second look just because it’s finally offered.',
            'Ask whether closing it was wisdom about which doors were never yours, or a quieter kind of avoidance dressed as restraint.',
            'No one behind that door needed you to open it — the room lets you leave it exactly as undisturbed as you found it.',
          ),
        },
        {
          id: 'read-the-hinges',
          text: '“Why did you open again, now, of all times?” Ask the door itself.',
          hint: 'Interrogate the offering, not just the room.',
          effects: { lucidity: 10, axes: { reasonFeeling: -5 } },
          outcome: [
            'You don’t get an answer, exactly — doors, even here, are not naturally forthcoming — but you notice the hinges are recently oiled. Someone, or something, wanted this door easy to move tonight, specifically.',
            'Usher: A fair question, and I don’t have the honest version of the answer. My best guess: the facility offers you the door you’re now ready to survive not opening. It has never once explained its timing to me either.',
          ],
          reflections: reflect(
            'The oiled hinges tell you the door was prepared for tonight specifically — but knowing that changes nothing about whether you walk through it.',
            'You owe the offering itself an honest question before you owe it an answer — asking why now is its own kind of diligence.',
            'Ask whether interrogating the door instead of just using it is rigor, or a way to delay the harder choice of entering or refusing.',
            'The hinges were oiled for you alone — whatever the facility’s timing means, this attention was never meant for anyone else.',
          ),
        },
      ],
      explanation:
        "You're shown the doors you walked past without opening on your last journey here — paths you never took, forever unknown now. One of them creaks open again on its own. This is about the strange pull of \"the road not taken\": do you finally look inside, out of pure curiosity now that it costs you nothing? Or do you leave it closed, deciding that not every unopened door was secretly a missed opportunity? Most people, looking back on their life, wonder about at least one path they didn't take — this room just makes that feeling literal.",
    },
  ],
  fieldNote: {
    title: 'The Road Not Taken, Audited',
    thinkers: 'Søren Kierkegaard (1844) · Robert Frost (1916), the poem misread as caution',
    body: 'Søren Kierkegaard called possibility the most dizzying thing available to a person — more vertiginous than any actual danger, because the actual is at least finite, while the possible multiplies without limit the longer you stand at a fork refusing to choose. Anxiety, for Kierkegaard, is the feeling of freedom looking down. Robert Frost’s “The Road Not Taken” gets misquoted at nearly every graduation as an anthem for bold divergence — “the one less traveled by, / And that has made all the difference” — but the poem itself is far slyer: the two roads are, the speaker admits two stanzas earlier, worn “really about the same,” and the wistful sigh at the end is confessed in advance as something the speaker will tell “with a sigh / Somewhere ages and ages hence” — a story reshaped by hindsight, not a truth reported from the fork. **The doors in this corridor were never secretly better. They were simply, briefly, possible — and possibility, once it closes, keeps none of its receipts, only its rumors.**',
  },
};

const ECHO_EMPTY_FALLBACK =
  'The other chair says nothing. There is, this time, nothing recorded to assemble a voice from — and the room, to its credit, doesn’t pretend otherwise.';

const echoVoiceBeat = (s: RunState): string => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) return ECHO_EMPTY_FALLBACK;
  const lines = moments.map((e) => `“${e.choiceText}”`).join(' Then: ');
  return `It speaks two or three of your own sentences back to you, in your own cadence, in order: ${lines}`;
};

const echoJunctionBeat = (s: RunState): string => {
  if (choseInPrior(s.prior, 'junction', 'push')) {
    return 'It remembers the bridge, too — the version of you that pushed. “Consistency, with hands,” it says, quoting itself back with a kind of rueful pride.';
  }
  if (choseInPrior(s.prior, 'junction', 'no-push')) {
    return 'It remembers the bridge, too — the version of you that wouldn’t push. “Some means are never means,” it says, and for once doesn’t sound like it’s arguing.';
  }
  return 'It doesn’t mention the bridge. Either you never reached it, or it wasn’t the part of you that needed saying out loud tonight.';
};

const echoEndingBeat = (s: RunState): string => {
  const id = s.prior?.endingId;
  if (!id) return 'It doesn’t know how you left, last time. Some things, apparently, the room doesn’t keep either.';
  const title = ENDING_TITLE_BY_ID[id] ?? id;
  return `It knows how you left, too — neither proud of it nor ashamed, which is somehow worse than either. “${title},” it says, once, flatly, and doesn’t repeat itself.`;
};

export const theEcho: Room = {
  id: 'the-echo',
  act: 4,
  title: 'The Echo · below',
  type: 'INSIGHT',
  doorHint: 'The room with the second chair',
  teaser: 'Someone is already sitting there, and it sounds like you.',
  stages: [
    {
      beats: [
        'A bare room. Two chairs, facing each other, close enough that whoever sits in either one is clearly meant to be heard.',
        'The other chair is occupied. Not by a person — the room is careful to be precise about this, precise the way only a place with nothing to gain from lying can be — but by a voice, assembled, patiently, out of what you said and chose the last time you were here.',
        echoVoiceBeat,
        echoJunctionBeat,
        echoEndingBeat,
        'Usher: I don’t sit in on this one. Whatever the two of you are doing in here, it was never mine to referee.',
      ],
      choices: [
        {
          id: 'answer-it',
          text: '“I hear you.” Speak back to who you were.',
          hint: 'Address it, not just witness it.',
          effects: { lucidity: 10, axes: { selfOthers: 4 } },
          outcome: [
            'You say it — not a correction, not an apology, just an acknowledgment, the way you’d greet someone at a door you weren’t sure would still recognize you.',
            'The other chair doesn’t answer back, exactly. But something in the room settles the way a held breath does when it’s finally let go on purpose, by two people instead of one.',
          ],
          reflections: reflect(
            'Speaking back changes nothing about what was already said — it only changes whether it was heard.',
            'You owe your former self an acknowledgment, not a correction — greeting it is a debt of recognition, not agreement.',
            'Ask whether addressing the voice instead of just witnessing it is a kind of courage, or simply an old habit of needing the last word.',
            'The room settles like a held breath let go by two people instead of one — a small mercy extended to whoever you used to be.',
          ),
        },
        {
          id: 'sit-in-silence',
          text: 'Sit across from it and say nothing. Let it finish, this time, uninterrupted.',
          hint: 'Witness without answering.',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You sit. You let it speak, all the way to the end, without correcting a single word — which, you notice, is not a thing you always managed the first time either.',
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
          id: 'take-both-chairs',
          text: '“There was never anyone else in here.” Sit in both chairs, in turn, and mean it.',
          hint: 'The costliest reading: no visitor, only you.',
          effects: { lucidity: 12 },
          outcome: [
            'You sit in the second chair too, briefly, and try the voice on like a coat you used to own — and it fits, exactly, which is either comforting or the whole problem, depending on the hour.',
            'There was never a guest here to entertain. Only a series of you, filed under the same name, taking turns holding the pen.',
          ],
          reflections: reflect(
            'Sitting in both chairs changes nothing about which version of you is speaking now — it only removes the pretense that there were ever two.',
            'You owe no visitor an audience, because admitting there was never one dissolves the very idea of a debt between host and guest.',
            'Ask whether this is the costliest honesty in the room, or a clever way to avoid the harder work of actually answering the voice.',
            'There was never a guest to care for here — only a series of you, filed under the same name, and the care was always, quietly, self-directed.',
          ),
        },
      ],
      explanation:
        "Sitting across from you is a voice built entirely out of things you said and chose the last time you were here — not a ghost, just an echo of a version of yourself from before. Do you talk back to it, sit quietly and really listen for once, or realize that there was never really anyone else in the room at all — just you, at two different times? This is about whether the \"you\" from your past and the \"you\" right now are really the same person, or more like two different chapters of the same book meeting for a moment.",
    },
  ],
  fieldNote: {
    title: 'Conversations With a Previous Tenant',
    thinkers: 'David Hume (1739) · Galen Strawson (1997), the bundle self and its critics',
    body: 'David Hume searched his own mind for a continuous self and reported finding only a bundle of perceptions — no thread running underneath them, just one experience after another, tightly enough packed to feel like a person. Galen Strawson took the bundle seriously as a description of experience itself: many of us, he argued, don’t actually feel continuous with who we were years or even hours ago — the psychological self is often “episodic,” renewing itself in shorter, more local bursts than the narrative-identity model assumes, with no single thread required to make any given burst a genuine self. The voice in the other chair is not a haunting; it is what’s left of one such burst, filed accurately and without malice. Whether you answer it, out-wait it, or admit there was only ever one occupant, the room asks the same question three ways: **is the one listening now the same one who spoke then — or simply the next tenant, reading the previous lease with unusual attention?**',
  },
};

export const understoryRooms = [theArchive, theUnchosen, theEcho];
