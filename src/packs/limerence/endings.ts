// LIMERENCE — all 7 endings (spec docs/design-limerence/06-endings-
// keepsakes-epiphanies.md §1). Evaluation shape mirrors ANAMNESIS exactly
// (engine/endings.ts's pattern) via packs/limerence/index.ts's endingRules,
// which reference endingLogic.ts's mirrorUnlocked/patternAvailable/
// computePatternEligible.
import type { Ending } from '../../engine/schema';

export const limerenceEndings: Ending[] = [
  {
    id: 'the-morning-after',
    title: 'The Morning After',
    epitaph: 'The conversation was still there. So, finally, were you.',
    beats: [
      'You step through the lobby doors, and the threshold does the one thing no room upstairs could: it ends.',
      'Morning traffic, ordinary and enormous. A real kitchen, somewhere. The person you left mid-sentence, still mid-sentence, as if you had only stepped out for the door and not for a night at all.',
      'Nothing is solved. The world has not improved on your behalf. The arguments kept your seat warm, patiently, the way arguments do.',
      'But you catch yourself, in the weeks after, asking questions you don’t already know the answers to — out loud, to the person across the table, instead of running them silently first.',
      'You will lose almost all of it: the corridors, the Porter’s exact patience, the particular weight of every unopened door. It fades the way dreams do, leaving a weather rather than a memory.',
      'The way back, it turns out, was never a road, {name}. The relationship was never the promise. You were the renovation.',
    ],
    fieldNote: {
      title: 'On Coming Back',
      thinkers: 'the descent-that-returns pattern, relationship edition',
      body: 'Every wisdom tradition has a version of the same shape: the descent that matters only as much as the ascent that follows it, carrying something the surface alone could never have produced. Applied to a relationship instead of a soul, the pattern holds with unsettling precision — a crisis survived changes nothing on its own; what matters is whether the people who come back from it are actually different, or simply returned to their old seats at the old table. **The danger in this hotel was never the Interval itself. It was checking out unchanged.** To come back ordinary, but rearranged: that was always the whole assignment.',
    },
  },
  {
    id: 'the-giver',
    title: 'The Giver',
    epitaph: 'Everyone’s safe person. Coin by coin. Mostly gladly.',
    beats: [
      'You step through, and the world receives you the way water receives — no seam, no splash.',
      'You wake porous. That is the only word for it. Every friend’s 2 a.m. crisis finds you first, now, the way water finds the lowest point in a room.',
      'You become the one others are repaired by. It is a good life, genuinely, measured in other people’s better mornings — the ledger of it kept in a currency you stopped counting somewhere around Act II.',
      'You give freely, and mostly gladly, and the giving is not a performance; the room is careful about that. It costs you real things and you pay them without resentment, most days.',
      'Only sometimes — late, in the honest hours — do you notice what an open hand cannot do, which is close. Whether that was the price or the prize is a question you leave, deliberately, unanswered on the table each night.',
      'The Porter, if he could see you — and on some nights, who knows — would say: we returned that one lighter. We may have removed slightly more packaging than the desk strictly advises.',
    ],
    fieldNote: {
      title: 'On Boundless Care',
      thinkers: 'codependency research · the boundary-as-load-bearing-wall finding',
      body: 'Clinical research on codependency has moved past its early, moralizing framing toward something more precise: a real, costly pattern in which one person’s wellbeing becomes structurally dependent on being needed by others, and boundaries — far from being selfish — function as the load-bearing wall that keeps the whole structure from eventually collapsing under its own generosity. **An open hand that cannot close cannot hold its own weight, let alone anyone else’s, indefinitely.** The rooms rewarded your openness. The world will too, without malice, and it will also, eventually, bill it.',
    },
  },
  {
    id: 'the-armored',
    title: 'The Armored',
    epitaph: 'Nothing got in. That was the plan. Nothing got in.',
    beats: [
      'You step through into a life that runs, from the outside, exactly the way it is supposed to.',
      'Competence. A promotion, eventually, then another. People describe you as "solid," as "together" — never, quite, as "warm," though it takes you years to notice the pattern in the word choice.',
      'The walls that went up somewhere on the Long-Stay Wing hold. They hold very well. Nothing gets in, which was, after all, the plan.',
      'Years later, a window, unremarkably, on an unremarkable evening — and the thought completes itself before you can stop it: everything stays out. The weather, the wolves, and the mail, and the visitors.',
      'The Porter, in the file that gets sent back with your name on it eventually, writes one word: "Safe."',
      'In the margin, underneath, in handwriting that might be his and might, by now, be yours: safe from what was never specified.',
    ],
    fieldNote: {
      title: 'On Armor',
      thinkers: 'avoidant adaptation, honestly costed',
      body: 'Avoidant attachment strategies are adaptive — they work, reliably, at the specific job they were built for: reducing the pain of needing someone who might not show up. The honest cost, documented across the literature, is not weakness but narrowing: a self organized around not being hurt reliably also organizes itself out of being reached, astonished, or surprised by anyone else’s presence. **A self nothing can wound is a self nothing can astonish.** This ending is not written as a failure — competence and safety are real goods — only as an honest accounting of what the armor costs to wear indefinitely.',
    },
  },
  {
    id: 'the-ghost',
    title: 'The Ghost',
    epitaph: 'You kept attending. You stopped arriving.',
    beats: [
      'There is no dramatic exit rendered here, because there wasn’t one. You simply stop carrying it, at some point too gradual to date precisely.',
      'You keep attending — dinners, birthdays, the ordinary furniture of being present — for a while after you have, in every way that matters, already gone.',
      'The Porter keeps his word: no guest dissolves alone on his shift. He sits with you, this once, without saying much, which turns out to be exactly the right amount.',
      'What stops being carried by you specifically is not lost. Someone else picks it up, eventually, the way things left on a table always eventually get picked up by whoever is still standing there.',
      'This is not a failure screen. The hotel is careful about that, and so, in its own way, is this ending: some things end the slow way, and the slow way is still an ending, not a crime.',
      'The tide comes in regardless of whether you were ever counted among the shells it took back out with it.',
    ],
    fieldNote: {
      title: 'On Going Quiet',
      thinkers: 'emotional withdrawal and dissociation in relationships',
      body: 'Emotional withdrawal — the slow exit that never announces itself as an exit — is a well-documented protective response, not a moral failing: a nervous system that has learned closeness carries risk will, quietly and reasonably, begin closing the distance to that risk instead of the distance to the person. **Numbness is a protection with a lease, not a permanent address, though it can feel permanent from inside it.** Written here as an ending, deliberately, never as a verdict on the person who arrived at it — the tide is not a punishment. It is simply what water does, given enough time and enough weight to carry.',
    },
  },
  {
    id: 'the-porter',
    title: 'The Porter',
    epitaph: 'The rooms always need a keeper. The keeper always needed the rooms.',
    beats: [
      'The handover happens quietly, over what feels like one long night and turns out to have been considerably longer.',
      'You learn the wing’s temperaments — which doors stick in the cold, which floors run colder than the thermostat admits, which guests need silence and which need the desk lamp left on.',
      'The discipline, once you understand it, is simple to state and hard to practice: you may light the corridor. You may never name the door. Every guest has to find their own way to what’s behind it.',
      'Centuries of them pass through, or what feels like centuries — each one certain their screenshot, their corridor, their kitchen table is the first of its kind. None of them are wrong to feel that. None of them are right either.',
      'One day, a guest turns from the morning light with a particular look on their face — recognition, the kind you remember from the inside, from a night that now feels impossibly long ago.',
      'You say the first lesson, the one that was said to you: "The ring and the pale stripe are the same size. It’s on purpose. Everything here is."',
    ],
    fieldNote: {
      title: 'On Tending',
      thinkers: 'the wounded-healer archetype',
      body: 'The wounded-healer archetype — Chiron in myth, and a real, documented pattern in helping professions since — holds that the capacity to guide someone through a crisis is frequently forged by having survived a comparable one, not despite the wound but through the particular attention it teaches. Clinical research on peer-support and lived-experience roles finds real, measurable value in this specific kind of care — one that pure training alone doesn’t reliably produce. **Cultivating the corner of the world that is a hallway is not a lesser calling than any of the rooms off it.** The keeper needed the rooms exactly as much as the rooms ever needed a keeper.',
    },
  },
  {
    id: 'the-mirror',
    title: 'The Mirror',
    epitaph: 'Both chairs. Every room. Good joke, isn’t it?',
    beats: [
      'The small door opens onto a private sitting room, two cups already poured, no third chair anywhere in it.',
      'The Porter pours. He does not sit across from you so much as beside you, which you notice only after he’s already done it.',
      'He removes the ring from his right hand, unhurried, and there — on his left, where you somehow already expected it — is the same pale, untanned stripe you noticed on him the first night. Except it is not his hand. It is yours.',
      'Every guest in every room you ever walked through, it turns out, had your own face, if you had looked at it twice: the tempted and the betrayed, the third person and the friend who knew and said nothing — both narrators of every fight you were ever actually in.',
      'You laugh. The laugh is the recognition — there was no punchline delivered from outside, only the joke finally landing on the person who’d been telling it the whole time, to himself, in every room, without noticing.',
      'You wake laughing, and the joke evaporates the way jokes do on waking, leaving only its shape: there was never anyone in the other chair. There were always two of you, and both of them were you.',
    ],
    fieldNote: {
      title: 'The Oldest Joke',
      thinkers: 'perspective-taking’s final form',
      body: 'Perspective-taking research finds its most complete form here, past the point where it’s a skill you practice and into something closer to a recognition: every conflict this hotel staged had exactly two first-person narrators, and you were, provably, both of them — not metaphorically, structurally. The Sanskrit phrase *tat tvam asi* — "that thou art" — names an old, cross-cultural intuition about the porousness of the boundary between self and other; this room borrows it once, lightly, as a single quiet echo rather than a doctrine. **Both chairs. Every room. Good joke, isn’t it — the kind that only lands once you notice you were laughing at yourself the whole time.**',
    },
  },
  {
    id: 'the-pattern',
    title: 'The Pattern',
    epitaph: 'You didn’t check out. You woke, and the waking contained every room.',
    beats: [
      'Every door on every floor opens at once — not thrown, not dramatic, just open, the way a fact opens rather than the way an event does.',
      'The light in the corridor is ordinary, kind, and there is, for the first time all night, nothing left in it to hide from.',
      'The read receipt, the screenshot, the corridor at the conference, the kitchen table at 06:40 — all of it, all at once, present the way an entire life is present to the person actually living it, rather than the way a story is present to someone reading it back.',
      'The Porter, hat finally off, says the shortest thing he says anywhere in this whole hotel. "Ah."',
      'The recognition is not learning something new. It is seeing the pattern whole — which turns out to be the only thing that has ever, in the entire history of this building, actually changed one.',
      'You wake with {name} arriving with the waking itself, not a half-second after it. The departures board, glimpsed last on your way out, shows every time at once.',
    ],
    fieldNote: {
      title: 'Seeing It Whole',
      thinkers: 'pattern recognition and change · the earned-security literature’s actual mechanism',
      body: 'Insight alone rarely changes behavior — the clinical literature is consistent that knowing a pattern exists is necessary but never sufficient. What the earned-security research actually identifies as the mechanism of change is closer to what this room stages directly: not a new fact learned, but the whole pattern seen at once, held long enough and clearly enough that it stops being able to operate invisibly. **The rooms were never behind you. They were the shape of you, awake.** This is the hotel’s rarest door for a reason: it asks not for one more good choice, but for the willingness to look at the entire file at once and recognize the handwriting throughout as your own.',
    },
  },
];
