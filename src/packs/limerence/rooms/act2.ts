// Spec docs/design-limerence/03-rooms-act2.md — Act II: The Second Floor
// (ages 18-24). Register: frank/mature, never graphic (safety charter,
// docs/design-limerence/10-safety-education-charter.md) — attraction, sex,
// and their consequences are named directly; scenes cut at the threshold.
import type { Reflection, Room, RunState } from '../../../engine/schema';

const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

/** A stable, deterministic 50/50 split on the run's own doorSeed — used
 * where the spec calls for an outcome that's genuinely ambiguous rather
 * than authorially decided (e.g. how a third party responds). Same run,
 * same result every time; different runs, a real coin flip. */
function seedSplit(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 2654435761) % 2 === 0;
}

export const theDistance: Room = {
  id: 'the-distance',
  act: 2,
  title: 'The Distance',
  type: 'DILEMMA',
  doorHint: 'the door in two cities at once',
  teaser: 'nothing happened — that’s the sentence you keep rehearsing',
  stages: [
    {
      beats: [
        (s: RunState) =>
          s.flags.includes('promised-september')
            ? 'You and Jules kept the promise you made in September. Eight months of two cities, one calendar, and a phone bill neither of you mentions.'
            : s.flags.includes('first-open')
              ? 'You and Jules are still figuring out what "open" meant, eight months in. The word does more work than either of you can quite lift.'
              : 'You and Jules made it to spring. Two cities, one calendar, the relationship running on a satellite delay you’ve both stopped noticing.',
        'Last night, a party. Alena — a friend of a friend, sharp and easy to talk to — was an inch from your mouth for one full second before you stepped back.',
        'Nothing happened. You have rehearsed that sentence eleven times today, testing it for cracks like a tooth with your tongue.',
        'The step back was real. So, underneath it, was the second before the step back — and the room asks you to hold both at once instead of editing one away.',
        'Tonight’s call with Jules is scheduled, ordinary, already open on your screen. You have thirty seconds to decide what you’re bringing into it.',
        'Porter: Guests file "almost" under either confession or inventory. The filing decides what the word becomes.',
      ],
      choices: [
        {
          id: 'confess-the-near-miss',
          text: 'Tell Jules exactly what almost happened.',
          hint: 'Give the whole second, unedited',
          effects: { lucidity: 20, hearts: -1, axes: { selfOthers: 6 }, flags: ['windows-open'] },
          outcome: [
            'A hard call, and a good one. Jules’s hurt is real; so, underneath it, is the relief of being trusted with the truth while it was still nothing.',
            '"Thank you for telling me while it was still nothing," Jules says, eventually. The sentence costs you both something, and buys something too.',
          ],
          reflections: reflect(
            'Telling Jules now, while the cost is still small, heads off a much larger cost later if it ever surfaced on its own.',
            'Jules was owed this — not because anything happened, but because something almost did, and secrecy about almosts compounds.',
            'This is honesty chosen while it was still avoidable, which is the only kind that actually proves anything.',
            'You gave Jules the chance to feel safe in the relationship as it actually is, not a curated version of it.',
          ),
        },
        {
          id: 'bury-it',
          text: 'Nothing happened. Nothing to tell.',
          hint: 'Let the technical truth stand in for the whole one',
          effects: { lucidity: 6, axes: { selfOthers: -4 }, flags: ['buried-the-almost'] },
          outcome: [
            'Technically true. The call goes fine, ordinary, ninety minutes about nothing.',
            'The wall goes up one brick, unnoticed by the person it’s facing.',
          ],
          reflections: reflect(
            'Nothing changes tonight, but you’ve now made a unilateral decision about what Jules gets to know about your evening.',
            'A technically-true omission is still an omission of something Jules would likely want to know.',
            'Notice how easily "nothing happened" became a hiding place rather than a fact.',
            'You protected your own comfort at the cost of Jules’s ability to make an informed choice about this relationship.',
          ),
        },
        {
          id: 'soften-it',
          text: 'Tell a curated version: "someone flirted with me, it was weird."',
          hint: 'Give the shape without the substance',
          effects: { lucidity: 8, flags: ['trickle-truth'] },
          outcome: [
            'It works. Jules laughs, unbothered, and the call moves on.',
            'The softened story works so well that the true one can now never be told without revealing the soft one was curated. The room closes on that arithmetic and lets you feel it land.',
          ],
          reflections: reflect(
            'The curated version manages tonight’s outcome while quietly foreclosing every future chance to tell the true one.',
            'A partial truth offered as the whole truth is still, functionally, a lie of omission.',
            'This is the trickle-truth trap sprung on yourself, by yourself — worth noticing how reasonable each drop felt.',
            'Jules is being reassured by a story built to manage feelings rather than inform them.',
          ),
        },
        {
          id: 'keep-visiting-almost',
          text: 'Decide "almost" is a place you can keep visiting.',
          hint: 'Let deniability be the whole plan',
          effects: { lucidity: 4, axes: { controlAcceptance: -4, reasonFeeling: 4 }, flags: ['visiting-almost'] },
          outcome: [
            'Nothing to confess, nothing to bury — you simply leave the door to "almost" unlocked, on purpose, and don’t examine why.',
            'The room grants the pleasure of that honestly: the fizz of it, the plausible deniability. It also notes, quietly, which door in this hotel you’re now more likely to be offered.',
          ],
          reflections: reflect(
            'Keeping the option open costs nothing tonight and changes the odds of what happens the next time an "almost" arrives.',
            'This treats the boundary as a line to graze rather than a line to hold, which Jules never agreed to.',
            'This is the rationalization examined at full strength — noticing the fizz doesn’t make it harmless.',
            'You’ve prioritized your own ambiguous thrill over the clarity Jules is entitled to about where you stand.',
          ),
        },
      ],
      explanation:
        'Trickle truth — confessing in small, self-protective installments rather than all at once — feels kinder in the moment and is measurably worse for trust than either full disclosure or full silence: research on betrayal consistently finds that betrayed partners rate a drip of revisions as more damaging than the original event, because each new detail reopens the wound and proves the previous version was curated. "Nothing happened" and "nothing to tell" sound identical and are different sentences — one describes an event, the other describes a decision about what someone else gets to know.',
    },
  ],
  fieldNote: {
    title: 'The Curated Confession',
    thinkers: 'Shirley Glass',
    body: 'Glass’s disclosure research is unambiguous on one point: betrayed partners consistently rate the drip of revisions — a story that grows a little truer each time it’s challenged — as worse than the original act itself, because each revision proves the last version was a curation, not an account. **Walls get built one deniable brick at a time; nobody ever decides, on a single day, to build one.** The distinction that matters isn’t how big the secret is — it’s whether the door was left open or quietly, plausibly, ajar. "Almost" is a suburb. People commute.',
  },
};

export const theHallPass: Room = {
  id: 'the-hall-pass',
  act: 2,
  title: 'The Hall Pass',
  type: 'DILEMMA',
  doorHint: 'the door that says it’s a gift',
  teaser: 'it’s presented with a bow on it — your stomach disagrees',
  stages: [
    {
      beats: [
        'Jules proposes it reasonably, generously, over coffee: exceptions while you’re apart. Modern. Secure. Nobody’s property. The framing is careful, and it is meant kindly.',
        'Your stomach answers before your mouth does — a drop, small and unmistakable, that arrives a full two seconds ahead of anything you could call a thought.',
        'The adjectives you’re afraid of arrive next, uninvited: clingy. Jealous. Young. Not modern enough. You catalogue them before you’ve decided anything at all.',
        'What would agreement actually be for, here — peace, image, or the fear of losing Jules over a "no"? The room insists you name it before you answer.',
        'Porter: The desk has processed ten thousand arrangements. The ones signed to avoid a conversation outlast the conversation by about a week, on average.',
      ],
      choices: [
        {
          id: 'agree-to-keep-peace',
          text: 'Say yes, to avoid seeming small about it.',
          hint: 'Perform the ease you don’t feel',
          effects: { lucidity: 6, axes: { selfOthers: 6, controlAcceptance: -6 }, flags: ['consent-performed'] },
          outcome: [
            'The yes buys a genuinely good week. Jules is warm, grateful, relieved.',
            'The arrangement sits in you like swallowed glass. Weeks later, Jules mentions — one line, no details — that the arrangement got used. Your face does something you don’t get to see.',
          ],
          reflections: reflect(
            'Agreeing under pressure produced a short-term calm at the cost of consenting to something you didn’t actually want.',
            'Consent given to avoid conflict isn’t the same as consent given freely — Jules was owed your honest answer, not your managed one.',
            'Notice the gap between the person who said yes out loud and the person who felt the stomach-drop.',
            'You spared Jules an uncomfortable conversation tonight by volunteering to carry the discomfort alone, indefinitely.',
          ),
        },
        {
          id: 'true-no',
          text: 'Say the actual no. Adjectives be damned.',
          hint: 'Let yourself sound exactly as unmodern as necessary',
          effects: { lucidity: 20, axes: { selfOthers: -6, reasonFeeling: 4 } },
          outcome: [
            'Jules is surprised, then — a beat later — visibly relieved to have a real answer instead of a performance.',
            'The conversation the proposal was standing in for finally happens: what "apart" is actually doing to each of you. One honest fight. Better weather after.',
          ],
          reflections: reflect(
            'A clear no closes off the arrangement entirely, at the cost of a harder conversation neither of you was avoiding for free.',
            '"I don’t want this" is a complete sentence, and Jules was owed the true one rather than a polite one.',
            'It took more nerve to sound small than to sound easy — that’s worth noticing about yourself.',
            'You trusted Jules with your actual feeling instead of managing Jules’s reaction to a performed one.',
          ),
        },
        {
          id: 'counter-with-need',
          text: '"Here’s what I actually need while we’re apart."',
          hint: 'Negotiate needs, not permissions',
          effects: { lucidity: 22, axes: { controlAcceptance: 6, selfOthers: 4 } },
          outcome: [
            'The conversation that follows is slower and better than either a yes or a no would have been.',
            'What you build is smaller than the "gift" on offer, and it’s actually yours — needs on the table instead of permissions handed out.',
          ],
          reflections: reflect(
            'Naming needs instead of accepting or refusing a ready-made arrangement produces something both of you can actually keep.',
            'This treats the conversation as a negotiation between equals rather than a gift one of you accepts or declines.',
            'This is the harder, more mature move — replacing a proposal with your own terms instead of grading someone else’s.',
            'You gave Jules the chance to understand what you actually need, not just what you’re willing to tolerate.',
          ),
        },
        {
          id: 'take-it-angrily',
          text: 'Take the pass you didn’t want, and use it to get even in advance.',
          hint: 'Spend the gift out of spite',
          effects: { lucidity: 5, hearts: -1, axes: { controlAcceptance: -8 }, flags: ['pass-used-angry'] },
          outcome: [
            'The night itself the room elides, deliberately — a threshold, cut. What’s left is the morning after, and the arithmetic in it.',
            'You used a stranger and a loophole to punish someone who, that morning, hadn’t actually done anything to you yet.',
          ],
          reflections: reflect(
            'Using the arrangement out of spite doesn’t address the original problem and adds a second, self-inflicted one.',
            'This spends a "gift" as a weapon against someone who offered it in good faith, however clumsily.',
            'Ask what this reveals about the gap between what you said yes to and what you actually did with the yes.',
            'Jules gets punished in advance for a feeling you never actually voiced.',
          ),
        },
      ],
      explanation:
        'Researchers studying consensual non-monogamy consistently find a sharp difference between arrangements that are negotiated — built from stated needs, revisited, genuinely wanted — and those that are conceded to avoid conflict or seeming insecure. Agreements made from fear measure, on wellbeing outcomes, closer to infidelity than to openness, regardless of what was technically agreed to. "I don’t want this" is a complete sentence; at twenty, surrounded by a culture that codes hesitation as immaturity, it rarely feels like one.',
    },
  ],
  fieldNote: {
    title: 'Signed Under Weather',
    thinkers: 'Conley · Moors (CNM research)',
    body: 'Research on consensual non-monogamy is honest in both directions: outcomes for satisfaction and trust are comparable to monogamous relationships *when arrangements are freely negotiated* — genuinely wanted, not merely tolerated. The same research is equally clear that agreements entered from fear of seeming jealous, clingy, or uncool measure like infidelity in their effect on wellbeing, whatever the paperwork says. **Consent that is performed and consent that is felt can look identical from across the table and produce completely different years.** A gift you feel you can’t decline is not a gift. It’s an invoice, arriving later, itemized.',
  },
};

export const theRebound: Room = {
  id: 'the-rebound',
  act: 2,
  title: 'The Rebound',
  type: 'DILEMMA',
  doorHint: 'the door that’s still warm',
  teaser: 'someone kind is falling — you’re just trying to stop the noise',
  stages: [
    {
      beats: [
        (s: RunState) =>
          s.flags.includes('let-it-drift') || s.flags.includes('end-clean')
            ? 'Three weeks since the last of Jules ended, quietly, the way it had been drifting toward for a while. Mira arrived faster than you expected anything could.'
            : 'Three weeks since it ended with Jules — sudden, from your side, cleaner than it felt. Mira arrived faster than you expected anything could.',
        'Mira is kind, funny, entirely unguarded. Tonight, brushing her teeth at your sink like it’s already a habit, she asks: "should I just — leave one here?"',
        'You take inventory of what you actually feel, and the honest answer is: static. Gratitude. A shape where a feeling should be, outlined but unfilled.',
        'Jules intrudes — one beat, involuntary, uninvited — mid-sentence, mid-Mira, gone as fast as it arrived.',
        'Mira says what this is to her, out loud, entirely sincere, entirely undefended. She is not performing anything. That’s what makes it worse.',
        'Porter: Room service reports one guest ordering for two, and one guest eating alone at the same table. It happens more than you’d think.',
      ],
      choices: [
        {
          id: 'tell-her-what-this-is',
          text: 'Say the anesthesia sentence, out loud, tonight.',
          hint: 'Name what she is to you right now',
          effects: { lucidity: 22, hearts: -1, axes: { selfOthers: 4 } },
          outcome: [
            'The kindest cruelty available on this floor. Mira’s face changes in real time as the sentence lands.',
            'What she does next — stay, knowing, or go — the room leaves entirely with her. That was never yours to decide for her; it was only yours to make possible.',
          ],
          reflections: reflect(
            'Telling her the truth now costs the relationship its current comfortable shape, in exchange for her ability to choose with real information.',
            'She was owed an accurate account of what this is to you before she invested further in a story you knew was incomplete.',
            'This required naming an unflattering truth about yourself out loud, to the person it most affects.',
            'You handed Mira back the agency your silence had quietly been withholding from her.',
          ),
        },
        {
          id: 'let-her-believe',
          text: 'Say nothing. Stay warm.',
          hint: 'Let the story write itself',
          effects: { lucidity: 4, axes: { selfOthers: -6 }, flags: ['kept-the-anesthesia'] },
          outcome: [
            'Months pass in a single held breath. Then: her "I love you," arriving mid-ordinary-Tuesday, entirely undefended.',
            'The room freezes on your in-breath and cuts there, deliberately. The debt was always accruing interest; this is just the statement arriving.',
          ],
          reflections: reflect(
            'Staying silent let the relationship deepen on false premises, which makes the eventual reckoning larger, not smaller.',
            'Allowing her to fall further while knowing what you actually feel withholds information she has a right to.',
            'Notice how easy comfort was to choose over a harder honesty, and how much heavier the debt got for the delay.',
            'Her growing attachment is being spent as your anesthesia without her knowledge or consent to that arrangement.',
          ),
        },
        {
          id: 'end-it',
          text: 'End it, before it costs her more.',
          hint: 'Stop it while the cost is still small',
          effects: { lucidity: 18, axes: { controlAcceptance: 4 } },
          outcome: [
            'She cries and thanks you inside the same ten minutes — grief and relief occupying the same breath.',
            'Grief returns to you afterward at full volume, with nowhere left to put it. The noise the anesthesia was masking, finally met.',
          ],
          reflections: reflect(
            'Ending it now caps the harm at its current, smaller size instead of letting it compound.',
            'This prioritizes her long-term wellbeing over your short-term comfort, which is what the situation actually owed her.',
            'This took real nerve — choosing the harder feeling for yourself specifically to spare her the larger one.',
            'You put down the numbing agent and let both of you feel what was actually there, which is its own form of respect.',
          ),
        },
        {
          id: 'try-to-catch-up',
          text: 'Try to make yourself feel what she feels.',
          hint: 'Will the feeling into existence',
          effects: { lucidity: 10, axes: { reasonFeeling: 4, controlAcceptance: -4 } },
          outcome: [
            'Effortful sincerity, honestly rendered.',
            (s: RunState) =>
              seedSplit(s)
                ? 'This time, it actually works. Somewhere in the trying, something real starts growing underneath it — the room keeps this genuinely rare: sometimes wanting to feel something is most of the way to feeling it.'
                : 'This time, it doesn’t take. The trying itself becomes its own small, private grief — the room is honest about the odds: at twenty-one, this sometimes works and sometimes doesn’t, and you don’t get to know in advance which you’re in.',
          ],
          reflections: reflect(
            'Trying to catch up emotionally is a real strategy with real, unpredictable odds — the room doesn’t pretend otherwise.',
            'This at least attempts to meet what she’s offering rather than either exploiting or abruptly ending it.',
            'This is sincere effort under uncertainty, which is a genuinely different thing from either honesty or avoidance.',
            'Mira still doesn’t know the starting gap you’re trying to close, which she’d likely want to know about.',
          ),
        },
      ],
      explanation:
        'Rebound relationships are not uniformly harmful — research finds mixed outcomes, and some genuinely help people recover faster and more completely than isolation would. The documented injury isn’t the rebound itself; it’s the asymmetric information inside it, when one person is regulating a feeling and the other believes they’re building one. "I never promised anything" is true and, on its own, insufficient — informed consent is the line between using someone as anesthesia and simply being two people finding out together what this is.',
    },
  ],
  fieldNote: {
    title: 'Anesthesia With a Pulse',
    thinkers: 'rebound literature · ethics of asymmetry',
    body: 'What the research on rebound relationships actually shows is more mixed than the folklore: recovery can be faster, outcomes can be genuinely good, and the popular wisdom that "you have to be single first" isn’t well supported as a blanket rule. **The dividing line isn’t timing — it’s whether both people have the same information about what this is.** The specific risk of a rebound isn’t that it happened too soon; it’s that one party is using the relationship as regulation while the other believes they’re building something, and only one of them knows which is true. The kind ones are chosen precisely because they’re load-bearing. That’s not a coincidence, and it isn’t automatically a crime — but it is a debt, and debts come due.',
  },
};

export const theUnicorn: Room = {
  id: 'the-unicorn',
  act: 2,
  title: 'The Unicorn',
  type: 'DILEMMA',
  doorHint: 'the door with two names on it',
  teaser: 'they’re glamorous, established, and very sure this will be simple',
  stages: [
    {
      beats: [
        'Erik and Maja — five years together, a beautiful apartment, a warmth so practiced it reads as effortless — invite you to dinner, then invite you in. As their third.',
        'The offer is real, and so is the attraction; the room doesn’t pretend either one is hollow. You watch their choreography as they make it: who touches whom, who checks whose face before speaking.',
        'The rules were written before you existed and are presented, almost laminated: no solo dates. No sleepovers on weekdays. "We come first" — said kindly, and absolutely.',
        'What you get, honestly granted: belonging, heat, two people’s full attention turned on you at once. The room lets this feel as good as it is meant to feel.',
        'The first crack, small: Maja’s face, for exactly one second, when Erik laughs too long at something you said.',
        'Porter: Suite 3 books a rollaway bed every few months. The rollaway never gets to choose the room.',
      ],
      choices: [
        {
          id: 'obey-the-rules',
          text: 'Take the terms exactly as written.',
          hint: 'Sign what’s in front of you',
          effects: { lucidity: 8, axes: { selfOthers: 6 }, flags: ['signed-their-terms'] },
          outcome: [
            'Three good months, compressed into two beats — warm, easy, exactly as advertised.',
            'Then a rule you never saw invoked, retroactively, by the two people who wrote the rulebook. You learn it has an errata sheet only they receive.',
          ],
          reflections: reflect(
            'Accepting the rules as given produced genuine good months at the cost of protections you never actually had.',
            'Rules you had no part in writing were never owed the same deference as ones negotiated with you present.',
            'Notice how comfortable it was to let two more experienced people define the terms of your own participation.',
            'The couple’s comfort was structurally protected throughout in a way yours never was — worth naming plainly.',
          ),
        },
        {
          id: 'renegotiate',
          text: '"Rewrite the rules with me in the room, or I don’t sign."',
          hint: 'Insist on being a party to the terms',
          effects: { lucidity: 22, axes: { selfOthers: -6, controlAcceptance: 6 } },
          outcome: [
            'The real test of whether "equal" was ever meant.',
            (s: RunState) =>
              seedSplit(s)
                ? 'To their credit — genuine, effortful credit — the negotiation happens in front of you, and something like an actual charter emerges. It isn’t perfect. It is, for the first time, actually yours too.'
                : 'The negotiation stalls, politely, in the space between "of course" and any actual change. The offer doesn’t get withdrawn. It just quietly stops being extended — you learn what "equal" meant by watching what happened when you asked for it in writing.',
          ],
          reflections: reflect(
            'Insisting on renegotiation tests the arrangement’s honesty at the cost of the easy version continuing unexamined.',
            'You were owed a say in terms that governed your own participation, and you asked for what you were owed.',
            'This is the harder, less comfortable integrity — risking a good thing to find out if it was ever actually fair.',
            'You gave the relationship, and yourself, the chance to be something other than what it was assumed to be by default.',
          ),
        },
        {
          id: 'discover-we-come-first',
          text: 'Stay until the night Maja cries — and learn what the hierarchy means.',
          hint: 'Let the rule teach itself to you',
          effects: { lucidity: 15, hearts: -1, axes: { selfOthers: 4 } },
          outcome: [
            'The 2 a.m. taxi, rendered in full: you, dressed fast, and behind you a door already closing, already repairing itself around the two of them.',
            '"We come first" stops being a sentence on a laminated page and becomes something you understand in your body, all at once, at 2 a.m., in a taxi.',
          ],
          reflections: reflect(
            'Staying long enough to learn the hierarchy the hard way cost you a night, and gave you information no conversation had.',
            'You were owed a clearer account of the hierarchy before investing in an arrangement that assumed you already knew it.',
            'There is a kind of self-knowledge that only arrives through the cost, not around it — this is that, honestly priced.',
            'Notice that Maja’s tears and your taxi ride were never weighted the same by the room the couple built.',
          ),
        },
        {
          id: 'decline-kindly',
          text: 'Decline. Name why, kindly.',
          hint: 'Take the road not taken, with grace',
          effects: { lucidity: 18, axes: { reasonFeeling: -4 } },
          outcome: [
            'The road not taken, walked with grace instead of drama. Erik and Maja are gracious in return, and a little disappointed, and that’s allowed to be true too.',
            'They recur through the rest of the floor at a distance — still glamorous, still practiced, on what you happen to notice is their fourth rollaway bed.',
          ],
          reflections: reflect(
            'Declining removes every risk of the arrangement at the cost of the belonging and heat it was genuinely offering.',
            'You owed them an honest reason rather than a vanishing act, and gave them one.',
            'This is a considered no, arrived at by reasoning through the structure rather than reacting to the offer.',
            'You spared yourself a position that was, by its own design, never going to be structurally equal.',
          ),
        },
      ],
      explanation:
        'Research on "couple\'s privilege" in non-monogamous arrangements distinguishes structurally between hierarchy that is disclosed upfront and hierarchy that is discovered — the difference between an honest map and a trap door. Thirds carry real, well-documented structural risk in "unicorn" arrangements: rules written before they arrive, enforced unilaterally, revisable by the couple alone. None of this means equal triads are impossible — the research is fair to genuine, negotiated non-monogamy — it means "equal" is a claim that has to survive being tested, not just stated.',
    },
  ],
  fieldNote: {
    title: 'The Rollaway Bed',
    thinkers: 'CNM research on unicorn dynamics (Moors, Conley et al.)',
    body: 'Research on "unicorn hunting" — established couples seeking a shared third partner — documents a consistent pattern: rules written before the third arrives, a hierarchy disclosed as a formality rather than negotiated as a real structure, and an asymmetry of exit costs (the couple stays a couple; the third leaves alone). The useful research distinction is between couples *opening* — genuinely restructuring to include another equal voice — and couples *acquiring* — adding a person to an unchanged structure. **Equality on paper and hierarchy in the kitchen are not contradictions. They are how the pattern usually works.** Genuinely equal triads exist and are documented too; the tell is whether the third gets to help write the rules, or only agree to them.',
  },
};

export const justFriends: Room = {
  id: 'just-friends',
  act: 2,
  title: 'Just Friends',
  type: 'INSIGHT',
  doorHint: 'the door that swears it’s a window',
  teaser: 'nothing has happened — everything has happened',
  stages: [
    {
      beats: [
        'Alena. Study partner, in-jokes, the one you tell things first. Jules gets the summary of your week; Alena gets the draft, unedited, as it happens.',
        'Nothing has happened. The room asks you to itemize "nothing" anyway: the seat you save without thinking, the coffee order you know by heart, the 23:40 good-nights that have become load-bearing.',
        'The comparison the room forces, side by side: what Jules knows about your week right now, and what Alena already knew by lunchtime.',
        'The phone’s evidence, reviewed the way a case file gets reviewed — timestamps as their own quiet form of dread, nothing in them explicit, all of them somehow damning anyway.',
        '"We’re just friends," you say, to no one in particular, and the room asks — quietly, precisely — to whom you were actually saying it.',
        'Porter: The architecture never lies. Ask only: which way do the windows face?',
      ],
      choices: [
        {
          id: 'open-window',
          text: 'Tell Jules about Alena — all of it, ranking included.',
          hint: 'Let the light in, fully',
          effects: { lucidity: 25, axes: { selfOthers: 6 }, flags: ['windows-open'] },
          outcome: [
            'The conversation is awful, and short, and the wall comes down brick by audible brick while you’re both still sitting there.',
            'Alena, told nothing, notices everything within a week. A real friendship right-sizes itself, at a real, named cost.',
          ],
          reflections: reflect(
            'Full disclosure lets Jules make an informed decision about the relationship as it actually is, at the cost of an uncomfortable, immediate conversation.',
            'Jules was owed the ranking, not just the fact of the friendship — the ranking is the part that was actually hidden.',
            'This is the harder honesty — naming a pattern about yourself, not just an event.',
            'You chose Jules’s clarity over Alena’s comfort and your own, which is the actual shape of the loyalty this room is testing.',
          ),
        },
        {
          id: 'nothing-to-tell',
          text: 'Keep her in the "nothing to tell" folder.',
          hint: 'Protect the category, not just the secret',
          effects: { lucidity: 6, axes: { selfOthers: -6 }, flags: ['wall-built'] },
          outcome: [
            'The folder thickens by one evening per beat, each one individually defensible.',
            'The room ends on Glass’s arithmetic made visible: the window now faces Alena. The wall now faces Jules. Nobody chose this on any single day, which is exactly how it gets done.',
          ],
          reflections: reflect(
            'Keeping the folder closed avoids one hard conversation while quietly compounding what a future one would have to cover.',
            'Categorizing a load-bearing friendship as "nothing to tell" is a choice made about Jules, without Jules.',
            'Notice how each individual evening felt too small to mention, and what that adds up to.',
            'Jules is being denied the same information Alena is quietly accumulating — the imbalance is the actual harm.',
          ),
        },
        {
          id: 'test-the-evening',
          text: 'Engineer one evening with Alena that could go either way.',
          hint: 'Keep it deniable, on purpose',
          effects: { lucidity: 8, axes: { controlAcceptance: -6, reasonFeeling: 4 }, flags: ['tested-almost'] },
          outcome: [
            'The evening, real-time, frank — the room doesn’t soften what it is, only where it stops.',
            'The threshold arrives, and the room cuts on your hand at the door handle. What happened is stored, ambiguity intact, for the final gate to read back.',
          ],
          reflections: reflect(
            'Engineering deniability produces exactly the ambiguous outcome you built it to produce — which was itself the point, and the problem.',
            'A deliberately ambiguous test is a way of acting without the accountability of having decided.',
            'This is rationalization at full strength, examined honestly — the plausible deniability was the plan, not a side effect.',
            'Both Jules and Alena are owed more clarity than an evening built specifically to avoid producing any.',
          ),
        },
        {
          id: 'name-it-set-boundary',
          text: 'Name it to Alena, out loud, and set the boundary yourself.',
          hint: 'Say the true sentence to the person it’s about',
          effects: { lucidity: 22, axes: { selfOthers: -4, reasonFeeling: -4 } },
          outcome: [
            'The hardest version: "this is becoming the thing people call nothing" — said to her face, not rehearsed away.',
            'Her answer is honest too, and it costs something. Fewer coffees. Better sleep. One friendship, saved at its correct size.',
          ],
          reflections: reflect(
            'Naming the boundary to Alena directly resolves the ambiguity at its source rather than managing its symptoms with Jules.',
            'Alena was owed honesty about what was happening as much as Jules was — this addresses both debts at once.',
            'This required naming something uncomfortable about yourself to the person it’s hardest to say it to.',
            'You protected the friendship by being honest with the friend, rather than protecting it by staying vague with everyone.',
          ),
        },
      ],
      explanation:
        'The "emotional affair" checklist researchers actually use is less about any single event and more about a pattern: energy redirected, secrecy (however mild), and a private ranking of who gets told what, first. "We never touched" answers a question nobody in the room was actually asking. The windows-and-walls image is worth carrying past this hotel entirely — intimacy is architectural: whichever relationship gets the transparency has the window, and whichever gets the omissions has the wall, regardless of which one you’d call the "real" relationship.',
    },
  ],
  fieldNote: {
    title: 'Walls and Windows',
    thinkers: 'Shirley Glass, Not Just Friends',
    body: 'Glass’s central finding, from decades of clinical work, is that most affairs — emotional and otherwise — begin between people who would have called themselves "just friends" right up until they wouldn’t, without ever consciously planning the transition. **Secrecy is the active ingredient, not attraction; attraction is common and mostly harmless, secrecy is what converts it.** Her architecture image has outlived the specific research it came from because it’s simply accurate: a relationship has a window (what’s shared openly with your partner) and, inevitably, a wall (what isn’t) — and the two other people in your life are always standing on one side or the other, whether you meant to place them there or not. The window and the wall weigh exactly the same. Only the placement differs.',
  },
};

export const theEx: Room = {
  id: 'the-ex',
  act: 2,
  title: 'The Ex',
  type: 'DILEMMA',
  doorHint: 'the door you already closed once',
  teaser: 'three words from a museum: "I made a mistake"',
  stages: [
    {
      beats: [
        (s: RunState) =>
          s.flags.includes('set-the-trap')
            ? 'Sara — that Sara, the one you trapped to get an answer, four years and one lifetime ago — texts at 23:51: "I made a mistake." You still remember exactly what it cost to learn what it did.'
            : 'Sara — the Ground Floor’s Sara, four years gone now — texts at 23:51: "I made a mistake."',
        'You are happy with Jules. Mostly. The word "mostly" arrives on its own, uninvited, and you let it sit there rather than editing it out.',
        'The archive opens involuntarily — every memory of Sara lit gold-hour, edited by a curator who has apparently spent four years quietly deleting the worst scenes.',
        'The room restores the missing scenes, one at a time, the way a Chattam case file gets reopened: the fights, the silences, the reasons it actually ended, exhibited rather than summarized.',
        'Jules is in the next room, laughing at something on TV, entirely unaware this text exists yet.',
        'Porter: The past writes the best copy in the building. It never mentions why it’s vacant.',
      ],
      choices: [
        {
          id: 'reread-everything',
          text: 'Open the whole archive. 2 a.m.',
          hint: 'Let yourself fall all the way in',
          effects: { lucidity: 8, axes: { controlAcceptance: -6 }, flags: ['opened-the-archive'] },
          outcome: [
            'The spiral, honestly rendered: nothing sent, everything stirred, four years of curated golden light replayed at full brightness.',
            'Three days follow of comparing Jules, quietly and unfairly, to someone who — the room has just shown you in detail — never actually existed.',
          ],
          reflections: reflect(
            'Rereading everything cost three days of an unfair comparison for no information you didn’t already, on some level, have.',
            'This is a private act with no direct claim on anyone else, though its aftereffects land on Jules regardless.',
            'Notice how willingly you let a curated memory outcompete the actual, complicated relationship you’re in now.',
            'Jules gets compared, unknowingly, to an edited highlight reel — which isn’t a fair contest for anyone.',
          ),
        },
        {
          id: 'answer-her',
          text: 'Reply. Just to talk.',
          hint: 'Reopen a door you have four years of muscle memory for',
          effects: { lucidity: 10, axes: { selfOthers: 4 }, flags: ['answered-the-ex'] },
          outcome: [
            '"Just talking" with someone you have four years of muscle memory for is not, it turns out, a neutral act.',
            'The room ends the exchange mid-warmth, deliberately, cursor blinking — the conversation not yet a betrayal of anything, and not yet nothing, either.',
          ],
          reflections: reflect(
            'Replying reopens a channel whose risks you already know intimately from experience, at a real if hard-to-quantify cost.',
            'This was done without Jules’s knowledge, which is itself the choice worth examining, regardless of the content.',
            'Ask honestly whether "just to talk" was ever the whole plan, or the first sentence of a longer one.',
            'Jules is currently laughing at the TV, unaware a decision that concerns the relationship is being made in the next room.',
          ),
        },
        {
          id: 'block',
          text: 'Block. Both apps. Tonight.',
          hint: 'Close the door you already closed once',
          effects: { lucidity: 15, axes: { selfOthers: -4, reasonFeeling: -4 } },
          outcome: [
            'Clean, cold, and — the room insists on this — genuinely grieved, not just efficient.',
            'Blocking turns out to be a door you’re closing on a version of yourself too, not only on Sara. The protection and the loss arrive together.',
          ],
          reflections: reflect(
            'Blocking eliminates the risk at the cost of any information — closure, clarity, or otherwise — the exchange might have offered.',
            'This protects the current relationship’s integrity without requiring Jules to manage the situation at all.',
            'This is a decisive, self-protective act, chosen cleanly rather than drifted into.',
            'You made the choice unilaterally rather than involving Jules — a private protection Jules will never know was extended on their behalf.',
          ),
        },
        {
          id: 'tell-jules',
          text: 'Hand Jules the phone: "Sara wrote."',
          hint: 'Let the window face the right way',
          effects: { lucidity: 22, axes: { selfOthers: 8 } },
          outcome: [
            'The window instead of the wall. Jules’s fear, whatever it is, gets handled in the open air instead of alone in your head.',
            'Whatever reply eventually gets sent, if any, gets drafted by two people together — the exact thing four years of archive-curation could never do.',
          ],
          reflections: reflect(
            'Sharing it immediately converts a private risk into a shared decision, at the cost of an uncomfortable moment of exposure.',
            'Jules was owed the information at the moment you had it, not after you’d already decided what to do with it alone.',
            'This is intimacy chosen over instinct — reaching for the harder, more exposing option by default.',
            'You gave Jules a say in something that concerns them directly, instead of managing it on their behalf.',
          ),
        },
      ],
      explanation:
        'Old flames re-contact for a genuine mix of reasons — their own limerence relapsing, loneliness, real change on their part — and all three are true often enough that no single explanation should be assumed. What’s well documented is idealized memory: the brain reliably edits painful specifics out of positive relationship memories faster than it edits out the good ones, a bias sometimes called rosy retrospection. The useful diagnostic question isn’t "do I still feel something" — it’s "am I missing her, specifically, or missing being twenty."',
    },
  ],
  fieldNote: {
    title: 'The Curator',
    thinkers: 'Fisher · memory-bias research',
    body: 'Helen Fisher’s work on love’s neurochemistry found that the reward circuitry activated by an old partner can reactivate on renewed contact, which is a fact about brain chemistry, not a verdict about the relationship. Separately, memory researchers have repeatedly documented rosy retrospection — positive experiences get remembered more favorably over time than they were rated in the moment, while negative specifics fade fastest of all. **The museum is beautiful because someone, without ever deciding to, locked the storage rooms.** What actually predicts a successful reunion with an ex is narrow and specific — real, examined reasons the relationship ended being genuinely different now — which is a much smaller category than "I still think about them."',
  },
};

export const theConfession: Room = {
  id: 'the-confession',
  act: 2,
  title: 'The Confession',
  type: 'DILEMMA',
  doorHint: 'the door with a stone behind it',
  teaser: 'once, drunk, away, meaningless — the adjectives are already lined up',
  stages: [
    {
      beats: [
        'The flight home, itemized the way the room itemizes everything now: the boarding pass, the window seat, the rehearsals of a sentence you haven’t said yet.',
        'The adjectives assemble themselves in order, unbidden: once. Drunk. Away. Meaningless. Each one true, and none of them, together, quite covering what happened at the conference.',
        'Jules at arrivals — unguarded, glad to see you, a whole ordinary joy the room lets land at full weight, on purpose, because it’s about to make what comes next harder.',
        'The stone: where it actually sits (just under the sternum), what it weighs at 3 a.m. specifically (more than it weighs at any other hour).',
        'Both arguments, given at full strength, neither one dismissed: confession as Jules’s right to the truth of their own life, versus confession as your relief, transferred onto someone who didn’t ask for the weight.',
        'Porter: Guests ask which choice is honest. The desk has only ever been able to answer which is heavier, and for whom.',
      ],
      choices: [
        {
          id: 'confess',
          text: 'Tell Jules everything, now, whole.',
          hint: 'Put the whole stone down at once',
          effects: { lucidity: 25, hearts: -1, axes: { selfOthers: 6 }, flags: ['confessed-whole'] },
          outcome: [
            'The conversation, in close-up: flooding, an hour of questions with no good answers, the two of you on the sofa until the sky changes color.',
            'No verdict on the relationship — that’s weather for another floor. The stone moves from your chest to the room between you, which is both better and, tonight, not better at all.',
          ],
          reflections: reflect(
            'Full disclosure gives Jules the true information their own life is built on, at the cost of pain that a kinder-seeming silence would have deferred, not prevented.',
            'Jules has a right to the truth of the relationship they’re actually in — this is that right, honored, however late.',
            'This is honesty chosen at its most expensive, which is usually the only test that means anything.',
            'You transferred your certainty of the fact to Jules, but you stayed and carried the aftermath with them rather than leaving them to process it alone.',
          ),
        },
        {
          id: 'carry-it',
          text: 'Never tell. Carry it alone, forever.',
          hint: 'Take the weight so no one else has to',
          effects: { lucidity: 12, axes: { selfOthers: -6 }, flags: ['carried-alone'] },
          outcome: [
            'The strongest case the game makes for silence: protecting Jules from pain that would serve only your own conscience, not their wellbeing.',
            'Its lifetime cost, honestly rendered: a room inside you Jules will live next to for years and never be let into.',
          ],
          reflections: reflect(
            'Carrying it alone spares Jules a specific pain at the cost of a permanent, unequal weight only you will ever feel.',
            'This can be read as genuine self-sacrifice for Jules’s sake, or as withholding information Jules would want — the room refuses to pick one.',
            'This is real, sustained restraint — choosing the harder private burden over the easier public relief.',
            'Ask honestly whether the silence is protecting Jules, or protecting the relationship as it currently, comfortably, exists for you.',
          ),
        },
        {
          id: 'trickle',
          text: 'Confess a softened version.',
          hint: 'Give Jules part of the truth',
          effects: { lucidity: 6, flags: ['trickle-truth'] },
          outcome: [
            'The drip begins tonight, and the room shows you exactly where it leads: three future revisions, each one costing more than the whole truth would have, all at once, tonight.',
          ],
          reflections: reflect(
            'A softened confession manages tonight’s reaction at the cost of a larger, compounding reckoning later.',
            'A partial confession still withholds the full truth Jules is owed, dressed as honesty.',
            'This is the trickle-truth trap, recognized this time — and chosen anyway, which is its own kind of information about yourself.',
            'Each future revision will cost Jules a fresh, avoidable injury that a single hard conversation tonight would have prevented.',
          ),
        },
        {
          id: 'let-it-surface',
          text: '"It’ll come out naturally" — i.e., never, i.e., when it’s worst.',
          hint: 'Outsource the decision to chance',
          effects: { lucidity: 4, axes: { controlAcceptance: -6 }, flags: ['waiting-to-be-caught'] },
          outcome: [
            'The room names the strategy honestly, out loud: this is outsourcing the decision to chance, so that whatever happens can feel like weather instead of a choice you made.',
            'Somewhere down this floor, a phone that lights up at the wrong moment may turn out to be yours.',
          ],
          reflections: reflect(
            'Waiting for accidental discovery removes your own agency from the outcome without actually reducing the eventual cost.',
            'This defers a debt that is genuinely owed rather than either paying it or consciously choosing to forgive it to yourself.',
            'This is avoidance dressed as fate — worth naming plainly, to yourself, right now.',
            'Whenever it surfaces, Jules will learn it in the worst possible circumstances, which this choice makes more likely, not less.',
          ),
        },
      ],
      explanation:
        'The debate over whether to confess an affair is genuinely unsettled among researchers and clinicians, and the strongest arguments on both sides deserve to be heard at full strength: disclosure as respect for a partner’s right to the truth their life is actually built on, versus confession as guilt transferred onto someone who never asked to carry it. Surveys of betrayed partners lean toward wanting to know, but the finding is soft, self-selected, and shouldn’t be treated as a verdict. What is well established is Esther Perel’s observation that the one who holds the secret holds a kind of power over the relationship that the other person never consented to.',
    },
  ],
  fieldNote: {
    title: 'Whose Relief Is It',
    thinkers: 'the selfish-confession debate · Esther Perel',
    body: 'Both literatures deserve an honest hearing here. One line of research and clinical opinion holds that partners are owed the truth of the life they’re actually living, full stop — that withholding it, however kindly meant, is a decision made about someone without their consent. Another holds that confession can function as guilt-transfer: relief for the confessor, purchased with pain for someone who did nothing to deserve the transaction. Perel’s framing cuts through both: **"the one who holds the secret holds the power" — and that power imbalance exists whether or not the secret is ever spoken aloud.** This game does not resolve the debate, and says so in as many words: the stone is real either way. The only real choice is the pocket.',
  },
};

export const theOtherSideOfTheDoor: Room = {
  id: 'the-other-side-of-the-door',
  act: 2,
  title: 'The Other Side of the Door',
  type: 'NO-SOLUTION',
  doorHint: 'the door that was never yours',
  teaser: 'you made no vows — the sentence gets lighter every time you say it',
  stages: [
    {
      beats: [
        'Viktor is married. You knew by the third coffee, and stayed for the fourth anyway. Eight months now: hotel afternoons, weekday-only, his phone always face-down on the nightstand.',
        'The afternoon itself, frank and warm — the room doesn’t pretend this is hollow or purely transactional. Whatever else it is, it is also real, to both of you, in the room it happens in.',
        'The rules you’ve learned without ever being taught them: never call after six. No perfume that carries past the elevator. A whole unwritten curriculum, absorbed by living it.',
        '"I made no vows," you say, and the room asks you to actually examine the sentence rather than simply repeat it — it is true, and it has never once, on its own, settled anything.',
        'The wall. Her voice, through it — ordering room service, laughing at something on the television. Never seen. Permanently audible. The room holds the beat one breath longer than is comfortable.',
        'Porter: The desk registers three guests for that room. It only ever has keys for two.',
      ],
      choices: [
        {
          id: 'continue',
          text: 'Keep the afternoons. Keep the sentence.',
          hint: 'Let it become part of your life, quietly',
          effects: { lucidity: 6, axes: { reasonFeeling: 4 }, flags: ['stayed-the-third'] },
          outcome: [
            'Time-lapse honesty: seasons pass in four beats, the arrangement calcifying, unnoticed, into the actual architecture of your life.',
            'The room’s last image: your own phone, face-down now too, out of habit, though — you notice, distantly — no one is actually looking.',
          ],
          reflections: reflect(
            'Continuing preserves something genuinely valuable to you at an ongoing, compounding cost to a third person who never consented to any of it.',
            'You made no vows, which is true and does not resolve whether knowingly enabling someone else’s broken ones is itself wrong.',
            'Notice which habits of concealment you’ve picked up without ever consciously deciding to.',
            'The wife behind the wall is never asked, never told, and never stops being real just because she’s never seen.',
          ),
        },
        {
          id: 'end-it',
          text: 'End it, without asking him to choose.',
          hint: 'Leave cleanly, on your own terms',
          effects: { lucidity: 20, axes: { selfOthers: -4, controlAcceptance: 4 } },
          outcome: [
            'An ending nobody witnesses and no one will thank you for — disenfranchised grief, named plainly by the room because there’s no one else around to name it.',
            'The cleanest exit available on this floor. Still, notably, not clean.',
          ],
          reflections: reflect(
            'Ending it removes your own ongoing contribution to the harm, at the cost of a grief you’ll have to carry with no public standing.',
            'This stops your own knowing participation without demanding Viktor make a choice he was never going to make cleanly anyway.',
            'This is a quiet, unwitnessed integrity — choosing the harder exit precisely because no one is watching to reward it.',
            'This doesn’t undo what the wife behind the wall has already lived through, but it stops adding to it.',
          ),
        },
        {
          id: 'tell-her',
          text: 'Tell his wife.',
          hint: 'Give her the choice you’ve been keeping from her',
          effects: { lucidity: 15, hearts: -1, flags: ['told-the-wife'] },
          outcome: [
            'The detonation, rendered honestly ambivalent: she deserved the truth, unambiguously.',
            'The truth also arrives shaped like a weapon, and it has your fingerprints on it. The room refuses to grade your motive for you — only asks you, once, quietly, what it actually was.',
          ],
          reflections: reflect(
            'Telling her gives her the information to make real choices about her own life, at a cost to Viktor and to yourself that you don’t fully control.',
            'She was owed the truth of her own marriage regardless of the messenger’s motives or standing.',
            'This required real courage, whatever mixture of motives produced it — the act and the motive are not the same question.',
            'This is the one choice on this floor that centers her directly rather than managing the situation around her.',
          ),
        },
        {
          id: 'demand-choice',
          text: '"Her or me. By Friday."',
          hint: 'Force the decision that was never yours to force',
          effects: { lucidity: 10, axes: { controlAcceptance: -6 } },
          outcome: [
            (s: RunState) =>
              seedSplit(s)
                ? 'Friday arrives. Viktor chooses you — and the room lets you feel, in real time, exactly what that choice reveals about a man who could file two lives so easily.'
                : 'Friday arrives. Viktor doesn’t choose you — and the room lets you feel, in real time, exactly what that choice reveals about a man who could file two lives so easily.',
            'It teaches you the same lesson either answer would have: what you were to him was always, in the end, up to him alone.',
          ],
          reflections: reflect(
            'An ultimatum forces resolution at the cost of ceding the actual decision entirely to someone who has already shown he can hold two lives at once.',
            'Demanding he choose is fair to ask of him, but does not, on its own, discharge your own responsibility in the situation.',
            'Notice what this choice reveals about wanting resolution more than wanting to be the one who acts.',
            'The ultimatum centers your own certainty, not the wife’s wellbeing, which this choice leaves entirely undecided either way.',
          ),
        },
      ],
      explanation:
        'The honest ethical map here has several distinct lines on it, and the room asks you to hold all of them at once: vows bind the person who made them, not the person who didn’t — but knowingly enabling someone else’s deception is its own line-item, not automatically excused by the first fact. Mate-poaching research studies exactly this triangle and finds real costs land on the third party too — secrecy’s isolation, endings with no public grief, no one to call. Power and information are rarely equal in these arrangements: one person usually risks a marriage; the other usually risks something less visible and, research suggests, no less real.',
    },
  ],
  fieldNote: {
    title: 'The Ledger of the Third',
    thinkers: 'mate-poaching research · disenfranchised grief',
    body: 'Research on mate poaching has increasingly studied the "poacher’s" own experience, not just the couple’s, and the findings complicate any simple villain narrative: real time invested, real secrecy-driven isolation, and endings that carry no public standing to grieve — a pattern researchers call disenfranchised grief, loss nobody is allowed to acknowledge because the relationship itself was never allowed to be acknowledged. **Responsibility here is not all-or-nothing.** Vows bind the one who made them. Knowingly participating in their breaking is a separate, real choice with its own weight. The wall is thin. That was never a secret to anyone on either side of it.',
  },
};

export const theScoreboard: Room = {
  id: 'the-scoreboard',
  act: 2,
  gate: true,
  title: 'The Scoreboard',
  type: 'DOOMED',
  doorHint: 'the door that counts',
  teaser: 'you asked. they answered honestly. that was the mistake — yours, not theirs',
  stages: [
    {
      beats: [
        'You asked Jules the number. Jules told the truth. Now the number lives in your chest and does arithmetic at night: names it doesn’t know, hotel rooms it furnishes on its own, comparisons it stages without being asked.',
        (s: RunState) =>
          s.flags.includes('tested-almost') || s.flags.includes('ran-the-test')
            ? 'The intrusion-beat pattern is familiar to you by now — the room recognizes it too, and says so: this is the same arithmetic that kept you awake once before, wearing a different number.'
            : 'The intrusion arrives on a schedule you never set: a name, a guess, a scene your mind builds unasked and then makes you watch.',
        'The lobby rearranges, chairs into rows, the front desk into a bench — a hearing convened. The Porter takes the desk lamp in hand like a gavel that was never actually a gavel.',
        'The defendant, read into the record: everything Jules did, with anyone, before the two of you had ever met.',
        'Your own number, sworn in as a witness against the defendant, without ever being asked whether it wanted to testify.',
        'Porter: The court notes the defendant predates the plaintiff. The court has noted this in every session it has ever held.',
      ],
      choices: [
        {
          id: 'prosecute',
          text: 'Cross-examine the past: dates, contexts, details.',
          hint: 'Demand the full account, again',
          effects: { lucidity: 10, hearts: -1, axes: { controlAcceptance: -10 } },
          outcome: [
            'Every question gets answered. Every answer costs exactly one night’s sleep.',
            'The verdict, when it arrives, acquits — the past committed no crime — and the prosecution’s costs are, notably, non-refundable. Jules watched you need this, start to finish.',
          ],
          reflections: reflect(
            'The interrogation buys certainty about facts you already technically knew, at a real, ongoing cost to trust and to your own rest.',
            'The past owes you nothing further; it was disclosed once, honestly, and re-litigating it treats that honesty as insufficient.',
            'Notice what kind of partner a number was able to turn you into, across a single hearing.',
            'Jules is made to relive and re-justify a past that predates you, on your schedule, for your relief.',
          ),
        },
        {
          id: 'dismiss-with-prejudice',
          text: 'Dismiss the case. And mean it.',
          hint: 'Let the number stop being evidence',
          effects: { lucidity: 20, axes: { controlAcceptance: 10 } },
          outcome: [
            'Not suppression — dismissal with the reasons read aloud: the person the number belongs to no longer exists; the one who exists chose you.',
            'The intrusions don’t stop on command, and the room is honest that they won’t. They do, gradually, stop being summoned.',
          ],
          reflections: reflect(
            'Dismissing the case doesn’t erase the number but removes its power to keep extracting a cost from the present relationship.',
            'You owe the past no further prosecution — it already answered honestly, once, when asked.',
            'This is acceptance as a practiced discipline, not a feeling you’re waiting to arrive.',
            'You stop making Jules answer for a version of themselves that existed before you, which is what they were actually owed.',
          ),
        },
        {
          id: 'testify-against-yourself',
          text: 'Take the stand on your own double standard.',
          hint: 'Put your own number on the record too',
          effects: { lucidity: 25, axes: { reasonFeeling: -6 } },
          outcome: [
            'The bravest move in the hearing: your number and theirs, read side by side, in the same room, at the same volume.',
            'The asymmetry of feeling — that theirs troubles you more than yours troubles you — gets named for exactly what it is. The court adjourns without a verdict, because the case was never actually about the defendant.',
          ],
          reflections: reflect(
            'Examining your own double standard doesn’t change either number, but it changes what the discrepancy is allowed to cost the relationship.',
            'Fairness requires applying the same standard to yourself that you’re applying to Jules — this choice does that.',
            'This is real, uncomfortable self-scrutiny, applied exactly where it’s least flattering.',
            'This spares Jules the burden of a standard you weren’t willing to hold yourself to.',
          ),
        },
        {
          id: 'ask-what-verdict-frees',
          text: 'Ask the court what verdict would actually free you.',
          hint: 'Ask the harder question',
          effects: { lucidity: 30 },
          outcome: [
            'Silence. Then the Porter, gently: "None. There is no number, in either direction, that has ever acquitted a guest of their own imagination."',
            'Said aloud, it loosens something. The hearing room is a lobby again, chairs back where they belong.',
          ],
          reflections: reflect(
            'Naming that no verdict would actually help reframes the entire hearing as unwinnable by design — which is itself the useful information.',
            'This owes the past nothing further because it correctly identifies that nothing further was ever going to be owed.',
            'This is the rarest form of insight in the hearing — recognizing the trial itself was the malfunction, not its outcome.',
            'You stop making anyone, including yourself, stand trial for a question that was never actually answerable by a number.',
          ),
        },
      ],
      explanation:
        'Retroactive jealousy — distress about a partner’s past rather than their present conduct — is a recognized pattern, and at its most severe presents with features that overlap clinically with obsessive-compulsive disorder: reassurance-seeking, detail-mining, and mental compulsions that relieve anxiety for minutes and restock it by evening. Research on the sexual double standard finds it operating quietly even in people who’d reject it as a stated belief — the same fact registering differently depending on whose past it belongs to. What the treatment literature actually finds helpful is not more information; certainty-seeking is the pattern’s fuel, and acceptance-based approaches outperform reassurance by a wide margin.',
    },
  ],
  fieldNote: {
    title: 'The Court With No Acquittals',
    thinkers: 'retroactive-jealousy research · the sexual double standard',
    body: 'At its most severe, retroactive jealousy presents with features clinicians recognize from obsessive-compulsive presentations more broadly: intrusive images, compulsive reassurance-seeking, and a relief that never quite outlasts the next intrusion. **Certainty-seeking is the pattern’s food, not its cure — every answered question restocks the hunger for the next one.** The sexual double standard shows up in the data even among people who would reject it as a stated value: the same fact, filed differently depending on whose past owns it. What actually helps, per the treatment literature, is acceptance-based work rather than more data — learning to hold the not-knowing rather than trying to interrogate it away. Every guest who enters this hearing room arrives certain their case is the exception. The docket, so far, says otherwise.',
  },
};
