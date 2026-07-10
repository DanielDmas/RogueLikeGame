// Spec docs/design-limerence/04-rooms-act3.md — Act III: The Long-Stay Wing
// (ages 25-30). Register: frank/mature, never graphic (safety charter,
// docs/design-limerence/10-safety-education-charter.md). The "mechanically
// complex" beats the spec describes (flooding's fragmenting sentences, the
// therapist's four-doors-as-diagnosis) are rendered narratively through beat
// prose and, where the spec calls for a literal second stage, a real second
// Stage — not new engine machinery, matching this session's established
// content-authoring scope.
import type { Reflection, Room, RunState } from '../../../engine/schema';
import { pickShadowMoments } from '../../../engine/gameState';

const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

/** A stable, deterministic 50/50 split on the run's own doorSeed (see
 * act2.ts's identical helper) — used for outcomes the spec calls genuinely
 * ambiguous rather than authorial. A second, independently-offset variant
 * so two branch points in the same room don't always land the same way. */
function seedSplit(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 2654435761) % 2 === 0;
}
function seedSplit2(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 40503 + 17) % 2 === 0;
}

export const theColleague: Room = {
  id: 'the-colleague',
  act: 3,
  title: 'The Colleague',
  type: 'DILEMMA',
  doorHint: 'the door at the end of the conference',
  teaser: 'two years of shorthand — one corridor, one bottle from the bar',
  stages: [
    {
      beats: [
        'The lift up. Floor numbers climbing like a countdown nobody announced. Rowan is half a step behind you, still laughing at something from the bar downstairs.',
        'Two years of shorthand, replayed involuntarily in the four seconds the doors take to close: the eye-rolls in meetings, the good coffee place, sentences finished before either of you finishes them.',
        '"One more, my room has the balcony." The bottle, unopened, offered without weight — or with exactly the weight neither of you is naming.',
        'The keycard in your hand. You could describe its temperature. You are describing its temperature, to yourself, right now, which is its own small piece of information.',
        'Dana is asleep two hundred kilometers away. Nothing has happened. The corridor holds one full beat of silence with nothing in it but breathing.',
        'Porter (from a service door, this once): "Nothing has to be wrong at home for a door to be possible. That is the most documented sentence in this building."',
      ],
      choices: [
        {
          id: 'the-balcony',
          text: 'One more drink. Her room.',
          hint: 'Follow the shorthand where it leads',
          effects: { lucidity: 6, axes: { reasonFeeling: 6, controlAcceptance: -4 }, flags: ['crossed-at-the-conference'] },
          outcome: [
            'The threshold, cut, deliberately — the door clicking shut is the last thing rendered.',
            'The lobby breakfast the next morning, instead: two colleagues, performing colleagues, over bad coffee. What got heavier overnight is itemized without a single explicit image, and it is heavier.',
          ],
          reflections: reflect(
            'One night at a conference changes what the shorthand carries forward, regardless of how it’s categorized afterward.',
            'This was a door opened without Dana in the room to consent to what it costs the relationship.',
            'Notice how quickly the rationalizations arrived — appetite dressed as inevitability.',
            'Dana, asleep two hundred kilometers away, had no say in a decision that reshapes what she comes home to.',
          ),
        },
        {
          id: 'walk-away',
          text: '"Goodnight, Rowan." Your own room. Alone.',
          hint: 'Let the anticlimax be the whole event',
          effects: { lucidity: 22, axes: { controlAcceptance: 6 }, flags: ['walked-away'] },
          outcome: [
            'The anticlimax, honored as the achievement it actually is. Your room. The ceiling. An unsent "you up?" typed and deleted.',
            'Dana’s sleeping voicemail, played twice, for no reason you’d be able to explain out loud. Walking away rendered as an event, not an absence.',
          ],
          reflections: reflect(
            'Walking away costs the evening’s warmth and avoids a cost that would otherwise compound for months.',
            'This kept faith with an agreement Dana wasn’t in the room to enforce.',
            'This is integrity practiced when literally no one would ever have known otherwise.',
            'You protected Dana’s trust without her ever having to learn there was something to protect it from.',
          ),
        },
        {
          id: 'name-it-in-the-corridor',
          text: 'Say it out loud, right there: "this is a door, and I’m not opening it."',
          hint: 'Name the thing instead of managing around it',
          effects: { lucidity: 25, axes: { selfOthers: -4 } },
          outcome: [
            'The naming changes the shorthand forever. Some of it dies on the spot, honestly mourned by the room rather than pretended away.',
            'What survives is safe to keep. Rowan’s answer — quiet, then relieved — gives her the same dignity: she was standing at the same door.',
          ],
          reflections: reflect(
            'Naming it costs the friendship its old easy shorthand, in exchange for one that no longer requires managing a live wire.',
            'This was owed to Rowan as much as to Dana — she deserved a named boundary, not a silent retreat.',
            'This took more nerve than either taking the door or quietly avoiding it — saying the true sentence out loud.',
            'You gave Rowan the same clarity and respect you were claiming for yourself.',
          ),
        },
        {
          id: 'postpone',
          text: 'Nothing tonight — but leave the door unlocked in the calendar. "Next month, the Berlin trip…"',
          hint: 'Decide by not deciding',
          effects: { lucidity: 8, axes: { controlAcceptance: -6 }, flags: ['kept-the-door-open'] },
          outcome: [
            'The most honest dishonest choice available tonight: deciding by not deciding.',
            'The calendar entry glows, quietly, the way a phone lights up on a counter in a room three floors from here. Dread, transferred forward, at interest.',
          ],
          reflections: reflect(
            'Postponing avoids tonight’s cost while compounding a decision that was already effectively made.',
            'This leaves an obligation to Dana unaddressed rather than either honoring or breaking it cleanly.',
            'Notice the self-deception required to call this "nothing happening."',
            'Dana is owed a partner who has actually decided, not one keeping a door ajar for later.',
          ),
        },
      ],
      explanation:
        'Research on affairs consistently finds opportunity — travel, autonomy, sustained proximity — among the strongest structural predictors, often mattering more than relationship satisfaction. Esther Perel’s reframe adds a harder truth: affairs are frequently less about the partner at home and more about a version of the self the wanderer misses. "We’re just close" plus a hotel corridor at midnight is a different chemical compound than either ingredient alone, which is exactly why couples who decide what corridors mean in daylight fare better than those who improvise at 00:47.',
    },
  ],
  fieldNote: {
    title: 'The Geometry of Doors',
    thinkers: 'Treas · Giesen (2000) · Esther Perel (2017)',
    body: 'Treas and Giesen’s research on infidelity found opportunity structures — proximity, privacy, travel — predicting affairs about as strongly as relationship dissatisfaction does, sometimes more so; the workplace remains, across decades of data, the single most common place affairs begin, simply because it supplies sustained, private, repeated contact. Perel’s contribution reframes the "why": **affairs are often not about the partner you have, but the self you miss** — a version of yourself that existed before the roles, the routines, the mortgage. Neither finding excuses anything; both explain why couples who decide, in daylight, what a hotel corridor means fare measurably better than couples who leave it to be improvised at midnight. The keycard was warm because you were holding it. Note who was holding it.',
  },
};

export const theMetamour: Room = {
  id: 'the-metamour',
  act: 3,
  title: 'The Metamour',
  type: 'DILEMMA',
  doorHint: 'the door you agreed to',
  teaser: 'the arrangement works — worked — the tense is the whole problem',
  stages: [
    {
      beats: [
        'You and Dana opened up eighteen months ago, negotiated properly — the room says so plainly, this is the good-faith version, not a room built to punish it.',
        'The calendar, color-coded, sits open on the counter: exhibit A. Petra — Dana’s other partner — has begun arriving unannounced, and just rebooked your anniversary week for the second time.',
        'Petra herself, when you see her, is warm and genuinely likable — the room insists on this, because an easy villain would teach you nothing useful here.',
        'The word "hierarchy," which the three of you swore off eighteen months ago, hovers over the calendar without anyone saying it.',
        'Your own jealousy, examined honestly: signal, or noise, or — uncomfortably — both at once.',
        'Porter: "Suite arrangements fail at the seams, not the center. The desk has never once repaired a seam anyone would name."',
      ],
      choices: [
        {
          id: 'enforce-via-dana',
          text: 'Take it to Dana: "your other relationship, your boundary to hold."',
          hint: 'Route it through the person whose relationship it is',
          effects: { lucidity: 15, axes: { reasonFeeling: -4 } },
          outcome: [
            'Structurally correct, and emotionally slow. Dana is caught, visibly, between two people who both have a reasonable case.',
            (s: RunState) =>
              seedSplit(s)
                ? 'The fix holds, this time, because Dana holds it — the room is honest that you delegated the hard conversation, and it happened to land.'
                : 'The fix wobbles — Dana tries, and Petra reads the boundary as coming from you, not from Dana, which is not entirely wrong. The room is honest that delegating a boundary doesn’t guarantee it arrives intact.',
          ],
          reflections: reflect(
            'Routing the boundary through Dana is structurally correct and outcome-uncertain — the room doesn’t pretend delegation is control.',
            'This respects that the relationship with Petra is Dana’s to manage, not yours to police directly.',
            'Notice whether this is patience, or a way to avoid a harder conversation yourself.',
            'Petra experiences the boundary secondhand either way, which shapes how it lands on her.',
          ),
        },
        {
          id: 'talk-to-petra',
          text: 'Coffee with Petra. Just you two. Name it directly.',
          hint: 'Have the conversation almost nobody has',
          effects: { lucidity: 22, axes: { selfOthers: 6, controlAcceptance: 6 } },
          outcome: [
            'The metamour conversation almost nobody actually has: awkward, adult, and — the research backs this up — effective.',
            'A relationship you didn’t expect out of it: not friendship exactly, but something closer to a treaty, negotiated by the two people who actually needed to negotiate it.',
          ],
          reflections: reflect(
            'Direct metamour communication resolves the seam at its actual location, at the cost of a genuinely awkward conversation.',
            'This treats Petra as a party owed direct communication, not a problem to be managed around.',
            'This required real social courage — initiating a conversation with no established script.',
            'This centers the actual relationship between the two people affected, rather than triangulating through Dana.',
          ),
        },
        {
          id: 'name-the-hierarchy',
          text: 'Call the meeting. Make the three of you say the word.',
          hint: 'Say "hierarchy" out loud, on purpose',
          effects: { lucidity: 20, axes: { selfOthers: -4 } },
          outcome: [
            'The taboo, spoken: "descriptive hierarchy exists; pretending otherwise is how it becomes prescriptive and unfair." Some tears, from more than one of you.',
            'A rewritten charter follows, with actual times and actual limits that aren’t called vetoes but function like careful ones — honest, and costly to arrive at.',
          ],
          reflections: reflect(
            'Naming the hierarchy explicitly trades the comfort of pretending it doesn’t exist for a structure everyone can actually navigate.',
            'All three of you were owed an accurate account of the relationship’s real shape, not its idealized one.',
            'This required admitting an uncomfortable truth about your own arrangement rather than defending its official story.',
            'This gives Petra clear terms to actually work with, rather than an unspoken hierarchy she has to guess at.',
          ),
        },
        {
          id: 'audit-the-jealousy',
          text: 'Before anything: is this signal, or noise?',
          hint: 'Examine your own reaction first',
          effects: { lucidity: 25, axes: { reasonFeeling: -6 } },
          outcome: [
            'A room-within-a-room of introspection. The finding, rendered fairly: both. A real boundary really did erode, and your own attachment pattern really is amplifying it.',
            'Two different findings need two different tools, and the room hands you both rather than picking one for you.',
          ],
          reflections: reflect(
            'Auditing the feeling first costs time before acting, and produces a more accurate map of what actually needs fixing.',
            'This owes the truth its full complexity rather than reaching for the simplest available villain.',
            'This is the harder, less satisfying discipline — sitting with ambiguity instead of resolving it prematurely.',
            'This protects both Dana and Petra from a reaction that hasn’t yet been sorted from the actual boundary violation.',
          ),
        },
      ],
      explanation:
        'Research on consensual non-monogamy finds satisfaction and trust comparable to monogamous relationships specifically when arrangements are actively negotiated and maintained — not set once and assumed. The documented failure modes are specific and preventable: drift, unspoken hierarchy, and metamour avoidance, where the people most affected by an arrangement never actually talk to each other. Compersion — finding joy in a partner’s other joy — functions as a learnable skill in the literature, not a personality prerequisite; and jealousy, rather than a verdict, functions as data that still needs interpreting.',
    },
  ],
  fieldNote: {
    title: 'Seams',
    thinkers: 'Moors · Conley · CNM outcome literature',
    body: 'The honest state of the science, in both directions: well-conducted studies find comparable relationship satisfaction and trust between negotiated CNM and monogamy, while also identifying the maintenance behaviors that predict which CNM arrangements actually thrive — scheduled renegotiation, direct metamour contact, and explicit hierarchy conversations rather than assumed ones. **Jealousy’s dual nature is well documented: sometimes it is signal (a real boundary crossed), sometimes noise (attachment weather with nothing external to point at), and often both in the same feeling at once.** Monogamy hides its seams inside tradition, where no one has to name them. Here they are visible by design. Visible tears, unlike hidden ones, can actually be mended.',
  },
};

export const theVeto: Room = {
  id: 'the-veto',
  act: 3,
  title: 'The Veto',
  type: 'DILEMMA',
  doorHint: 'the door someone else can close',
  teaser: 'the rule was for emergencies — apparently this is one',
  stages: [
    {
      beats: [
        'Dana invokes the veto — written in year one, "for emergencies," never once used since. On Sam. The first person you’ve loved, not just dated, in years.',
        'Dana’s reason, given full weight by the room rather than dismissed: "because this one is different, and different scares me." Which is exactly why the veto exists. Which is exactly the problem.',
        'Sam, sketched in three specific, warm details — the room insists you feel what’s actually being vetoed before you decide anything about it.',
        'Dana’s fear, given full interiority too: not tyranny, but terror in a bathrobe at eleven at night.',
        'The question underneath the rule, unavoidable now: was the veto ever compatible with what the two of you said you were building?',
        'Porter: "The desk keeps a drawer of emergency keys. The drawer’s lesson: everything becomes an emergency to somebody, given time."',
      ],
      choices: [
        {
          id: 'comply',
          text: 'Honor the rule as written. End it with Sam.',
          hint: 'Keep the old agreement, whatever it costs now',
          effects: { lucidity: 12, hearts: -1, axes: { selfOthers: 6 }, flags: ['honored-the-veto'] },
          outcome: [
            'The ending scene with Sam — who did nothing wrong — given its full, uncomfortable weight.',
            'The marriage-of-rules preserved. Dana’s relief, real. And inside it, visible only to you: exactly what the rule just bought, and exactly what it cost.',
          ],
          reflections: reflect(
            'Honoring the veto preserves the prior agreement at the direct cost of a relationship with someone who broke no rule of their own.',
            'A rule agreed to in year one still binds you now, whatever it costs to keep it.',
            'This is loyalty to a commitment, tested at its most expensive moment.',
            'Sam absorbs the entire cost of a rule they never had any say in writing.',
          ),
        },
        {
          id: 'fight-the-rule',
          text: 'Refuse the veto, not Dana: "renegotiate the rule, or it’s not the rule that breaks."',
          hint: 'Challenge the mechanism, not the person',
          effects: { lucidity: 20, axes: { selfOthers: -6, controlAcceptance: 6 } },
          outcome: [
            'The constitutional crisis of a two-person state, rendered in painful specifics: what replaces a veto — raised concerns, time-bound slow-downs, but no unilateral kill switch.',
            'Dana’s fear now has to be met with care instead of law, which is harder for both of you, and — the room insists — more honest.',
          ],
          reflections: reflect(
            'Challenging the rule risks the relationship’s stability to test whether the rule itself was ever fair.',
            'You were owed a say in whether a rule that could end your relationship with Sam was still the right rule.',
            'This is the harder integrity — risking a real conflict to test a structure rather than simply submitting to it.',
            'This forces Dana to meet fear with engagement rather than being handed an easy, unilateral exit.',
          ),
        },
        {
          id: 'examine-the-veto',
          text: 'Before deciding anything: what was the veto for, in year one?',
          hint: 'Understand the rule before obeying or breaking it',
          effects: { lucidity: 25, axes: { reasonFeeling: -6 } },
          outcome: [
            'A small excavation: the night the rule was written, both of you afraid, the rule built as a blanket against a fear neither of you had a better answer to yet.',
            'The finding: rules written by fear enforce fear. What you do next is a separate, better-informed choice — the room is careful not to make it for you.',
          ],
          reflections: reflect(
            'Understanding the rule’s origin doesn’t resolve tonight’s decision, but it makes whatever you choose next more honest.',
            'This treats the rule as something owed real scrutiny rather than either blind obedience or blind defiance.',
            'This is intellectual honesty applied to your own relationship’s history, not just to abstract arguments.',
            'This slows down a decision that affects three people, in favor of actually understanding it first.',
          ),
        },
        {
          id: 'counter-veto',
          text: 'Invoke yours right back. On Petra.',
          hint: 'Match the move instead of resolving it',
          effects: { lucidity: 6, axes: { controlAcceptance: -10 }, flags: ['veto-war'] },
          outcome: [
            (s: RunState) =>
              s.flags.includes('symmetry-trap')
                ? 'The symmetry trap, at its adult size now — the room notices you’ve been here before, smaller, with a password instead of a person.'
                : 'The symmetry trap, at its adult size: matching force instead of resolving the actual disagreement underneath it.',
            'Mutually assured destruction of two real loves. The arrangement survives the exchange as a fortress with two prisoners in it.',
          ],
          reflections: reflect(
            'Matching the veto escalates the conflict without resolving whether the original invocation was fair.',
            'Retaliating in kind isn’t the same as addressing the actual disagreement about the rule.',
            'Notice the pattern, if this is a pattern for you — meeting a boundary with an equal and opposite one instead of examining either.',
            'Petra becomes collateral in a dispute that was never actually about her.',
          ),
        },
      ],
      explanation:
        'The veto debate inside non-monogamous communities runs for decades without full resolution, and the strongest arguments on each side deserve to be heard: a veto as reassurance for a frightened partner, versus a veto as a kill switch held over a third party’s actual life and feelings, without their consent to the arrangement. "Different scares me" is usually a request for care, not for compliance — and rules, however well intentioned, are structurally unable to do the work that only genuine reassurance and reattachment can do.',
    },
  ],
  fieldNote: {
    title: 'Emergency Keys',
    thinkers: 'CNM veto literature · autonomy research',
    body: 'The non-monogamous community’s long-running veto debate has real steel-manned positions on both sides — reassurance for the more anxious partner against a kill switch exercised over someone with no vote in the matter. The empirical note worth carrying: veto arrangements correlate with earlier-stage, less-negotiated CNM, and tend over time to be either renegotiated toward something more collaborative or to rupture outright when actually invoked. **The vetoed third is a person, not a variable in someone else’s equation, and the research increasingly insists on saying so plainly.** No rule has ever held a frightened hand. Hands do that.',
  },
};

export const theDrift: Room = {
  id: 'the-drift',
  act: 3,
  title: 'The Drift',
  type: 'NO-SOLUTION',
  doorHint: 'the door where nothing is wrong',
  teaser: 'seven years — you know the sound of every one of their evenings',
  stages: [
    {
      beats: [
        'You and Dana, year seven. Nothing is wrong. Nothing is anything. The room is furnished exactly like your living room, and the horror, quietly, is that it’s comfortable.',
        'You know which floorboard creaks, which mug is whose, which particular sigh means what. The evening replays in loving, forensic detail, and the detail itself is the dread.',
        'The last year, viewed at a distance: indistinguishable weeks, stacked. The last time either of you asked a question you didn’t already know the answer to — the room can date it precisely, which is its own quiet accusation.',
        'Two futures, projected side by side: this, unchanged, for forty more years. Or the unknown, for an unknown number of them.',
        'Porter: "The wing’s longest stays are the quietest rooms. The desk has never decided whether that is peace. Neither have the rooms."',
      ],
      choices: [
        {
          id: 'start-the-work',
          text: 'Stay, and start the terrifying work of wanting again.',
          hint: 'Begin, in something small',
          effects: { lucidity: 22, axes: { reasonFeeling: 6, controlAcceptance: 6 }, flags: ['chose-the-work'] },
          outcome: [
            'Not a montage. One single, concrete act: a question you don’t know the answer to, asked at the sink, out loud.',
            'Its disproportionate wake, rendered honestly — self-expansion begun at kitchen scale. No guarantee issued. The room says so plainly.',
          ],
          reflections: reflect(
            'Starting the work risks real effort for an uncertain return, which is precisely what makes it different from drifting.',
            'This honors a commitment made years ago by actually tending it rather than assuming it tends itself.',
            'This is the harder, unglamorous discipline — choosing effort over the comfort of a settled numbness.',
            'This offers Dana a partner actively choosing the relationship again, rather than one merely occupying it.',
          ),
        },
        {
          id: 'raise-it',
          text: 'Say the unsayable: "are we okay, or are we just quiet?"',
          hint: 'Ask the question out loud',
          effects: { lucidity: 25, hearts: -1, axes: { selfOthers: 6 } },
          outcome: [
            'The conversation itself is the risk, and the room prices it honestly: what opens here can’t be re-closed the way it was.',
            (s: RunState) =>
              seedSplit(s)
                ? 'Dana’s answer arrives as relief — visible, immediate, like a held breath let go: "I’ve been wondering how to ask you the same thing."'
                : 'Dana’s answer arrives shaped like anger at first — fear wearing its least flattering coat — before it softens, later, into something closer to relief.',
            'Both versions end with more life in the room, and less floor under it.',
          ],
          reflections: reflect(
            'Raising the question risks real disruption in exchange for information the relationship needed regardless of the answer.',
            'Both of you were owed an honest accounting rather than a comfortable silence.',
            'This required naming a fear out loud instead of managing around it indefinitely.',
            'This gives Dana the chance to answer honestly instead of continuing to guess what you’re both actually feeling.',
          ),
        },
        {
          id: 'accept-quiet-as-love',
          text: 'Decide this is love, in its year-seven clothes.',
          hint: 'Grant the quiet its own dignity',
          effects: { lucidity: 15, axes: { controlAcceptance: 8 } },
          outcome: [
            'The room grants this reading its full dignity: companionate love is real love, not a lesser tier of it.',
            'One honest condition, appended: it has to be chosen, not defaulted to. The difference is a single beat of active gratitude, said rather than merely felt.',
          ],
          reflections: reflect(
            'Accepting the quiet costs nothing tonight and depends entirely on whether it was actually chosen rather than settled for.',
            'This honors what the relationship has actually become rather than measuring it against an earlier, louder version.',
            'This requires real self-honesty — distinguishing acceptance from resignation, which look identical from outside.',
            'This offers Dana a partner who values what’s actually here, spoken rather than assumed.',
          ),
        },
        {
          id: 'notice-youve-left',
          text: 'Notice you’ve already left in every way but the door.',
          hint: 'Take honest inventory',
          effects: { lucidity: 18, axes: { selfOthers: -4 }, flags: ['already-gone'] },
          outcome: [
            'A quiet catastrophe of an honest inventory. Nothing announced. Nothing packed.',
            'Just the recognition — which changes the weight of every room left in this run, whether or not anyone else in the hotel ever finds out tonight.',
          ],
          reflections: reflect(
            'Naming that you’ve already left doesn’t change anything tonight but makes every future choice more honest.',
            'Dana is owed the truth of where you actually stand, eventually, even if this room doesn’t force it tonight.',
            'This is uncomfortable self-knowledge, arrived at without flinching away from it.',
            'This is a private recognition that nonetheless concerns someone who hasn’t been told yet.',
          ),
        },
      ],
      explanation:
        'John Gottman’s longitudinal research consistently finds emotional disengagement, not conflict frequency, as the strongest predictor of relationships ending — couples who stop reaching for each other are at more risk than couples who fight regularly but keep trying. Arthur Aron’s self-expansion research found something more hopeful: couples doing novel, mildly challenging activities together show measurable increases in relationship satisfaction, as if love partly runs on growth rather than comfort alone. Eli Finkel’s "all-or-nothing marriage" thesis names the trap plainly: modern couples ask one person to be nearly everything, then starve that everything of time and novelty.',
    },
  ],
  fieldNote: {
    title: 'The Quietest Rooms',
    thinkers: 'Gottman · Aron (2000) · Finkel (2017)',
    body: 'Gottman’s data is consistent across decades: disengagement — not the presence of conflict — is the strongest predictor that a relationship is ending, because couples who stop turning toward each other’s small bids for attention have stopped doing the maintenance love actually requires. Aron’s self-expansion experiments found something specific and replicable: couples assigned novel, moderately challenging joint activities showed measurable gains in reported closeness, evidence that growth functions as a real ingredient, not just a romantic metaphor. Finkel’s framing sharpens the trap: modern relationships are asked to supply nearly everything a person needs — while receiving less time and attention than relationships historically got from a whole surrounding community. **Comfort is a feature. Check whether it’s the only one still installed.**',
  },
};

export const theSecondAccount: Room = {
  id: 'the-second-account',
  act: 3,
  title: 'The Second Account',
  type: 'INSIGHT',
  doorHint: 'the door with a mirror on the inside',
  teaser: 'it’s just for attention — that’s the account’s bio, more or less',
  stages: [
    {
      beats: [
        'Your own second account. Started as a joke handle; now it’s where a version of you flirts, harvests attention, keeps three conversations at a simmer that Dana doesn’t know exist.',
        'Nothing physical. Nothing even arranged. The room’s whole mechanic: it replays your own messages back to you in the Porter’s flat, uninflected voice — the exact register that makes flirtation sound like testimony.',
        'Three conversations, excerpted flat: the compliments you fish for, catalogued by species, none of them accidental.',
        'One question, delivered in a single beat: what would you call this if Dana did it?',
        'The dopamine ledger, in honest columns: what the account feeds, what it costs, side by side, neither one hidden from the other.',
        'Porter: "The desk does not classify. The desk merely reads back. Guests classify at the speed of their own wincing."',
      ],
      choices: [
        {
          id: 'delete-it',
          text: 'Delete the account. Tonight. Whole.',
          hint: 'End it cleanly',
          effects: { lucidity: 20, axes: { controlAcceptance: 4 }, flags: ['deleted-the-account'] },
          outcome: [
            'The deletion, rendered as withdrawal actually feels: the itch, the phantom checking, a full week of reaching for a door that’s gone.',
            'What returns in its absence: attention, redirected home — awkward, at first, and genuinely alive.',
          ],
          reflections: reflect(
            'Deleting it removes an ongoing, hidden cost to the relationship at the price of a real, if minor, withdrawal.',
            'Dana was owed a partner not quietly splitting attention into an account she doesn’t know exists.',
            'This is decisive self-correction, chosen before being caught rather than after.',
            'This redirects the attention the account was harvesting back to the person it was quietly being withheld from.',
          ),
        },
        {
          id: 'keep-and-name-it',
          text: 'Keep it. Name honestly what it feeds.',
          hint: 'Stay, but stop pretending',
          effects: { lucidity: 15, axes: { selfOthers: -4, reasonFeeling: -4 } },
          outcome: [
            'The sophisticated rationalization, given its full, fair voice: "everyone needs a self outside the relationship."',
            'One honest test, appended and left installed: a self, or a secret? The account stays, and the question now lives inside it permanently.',
          ],
          reflections: reflect(
            'Keeping it while naming its function preserves the behavior while at least removing the self-deception around it.',
            'This is a partial honesty — honest with yourself, still not honest with Dana, which the room doesn’t let you forget.',
            'This is a smaller, more limited form of self-awareness than the room’s other doors offer.',
            'Dana’s side of this equation remains unaddressed by a choice that only resolves your own conscience.',
          ),
        },
        {
          id: 'show-dana',
          text: 'Hand Dana the phone. Account open.',
          hint: 'Let her read it herself',
          effects: { lucidity: 25, hearts: -1, axes: { selfOthers: 8 } },
          outcome: [
            'The bravest and costliest door. Dana reads in real time — the room replays their face, this time, instead of the messages.',
            'The conversation that follows is about what was actually missing, that the account was quietly feeding — a wall demolished with the building still occupied.',
          ],
          reflections: reflect(
            'Full disclosure gives Dana the true information the relationship is built on, at real, immediate emotional cost.',
            'Dana was owed this directly, from you, rather than discovering it or never learning it at all.',
            'This is honesty at its most exposed and least comfortable, chosen anyway.',
            'This treats Dana as someone capable of handling the truth, rather than someone to be protected from it.',
          ),
        },
        {
          id: 'defend-the-category',
          text: '"It’s not cheating if—"',
          hint: 'Finish the sentence and see if it holds',
          effects: { lucidity: 6, axes: { controlAcceptance: -4 }, flags: ['defended-the-category'] },
          outcome: [
            'The room lets you finish the sentence completely, then reads it back, flat, in the Porter’s own voice, next to the actual survey data.',
            'The sentence does not survive the reading. The account does. Which is its own kind of information about you.',
          ],
          reflections: reflect(
            'Defending the category preserves the behavior by relitigating its definition rather than examining its effects.',
            'This substitutes a semantic argument for the honest accounting Dana is actually owed.',
            'Notice how quickly a clever definition can substitute for genuine self-examination.',
            'This leaves Dana no better informed than before the room started, regardless of how the argument resolves.',
          ),
        },
      ],
      explanation:
        'Surveys on what counts as "micro-cheating" find genuinely little consensus — not just between strangers, but between partners in the same relationship, who frequently disagree with each other about where the line sits. The most reliable diagnostic isn’t any specific act; it’s a simple test — would you show your partner this thread, unprompted, right now? Secrecy, again, turns out to be the load-bearing ingredient, the same finding from Shirley Glass’s walls-and-windows research applied to a phone instead of a person.',
    },
  ],
  fieldNote: {
    title: 'The Definition Gap',
    thinkers: 'digital-infidelity survey literature · Glass (2003) (digital walls)',
    body: 'Surveys asking couples to independently define "cheating" find remarkably little agreement — not between strangers, where disagreement is expected, but between partners in the same relationship, who routinely draw the line in different places without realizing it until tested. Across the disagreement, one criterion holds up consistently: secrecy. **A behavior kept hidden from a partner functions, structurally, the way a hidden behavior always has — regardless of what species of behavior it technically is.** Attention itself behaves like a finite, redirectable resource in this research: what an account harvests, a relationship doesn’t receive, whether or not anything explicit was ever exchanged. The mirror is on the inside of this door for a reason. It’s the one room where the evidence was always going to be yours.',
  },
};

export const theDiscovery: Room = {
  id: 'the-discovery',
  act: 3,
  title: 'The Discovery',
  type: 'DOOMED',
  doorHint: 'the door that was ajar',
  teaser: 'the phone lit up — you saw a name and a heart, you saw enough',
  stages: [
    {
      beats: [
        (s: RunState) =>
          s.flags.includes('waiting-to-be-caught')
            ? 'The counter. The light. This time you see it from the other chair — the one who is caught, watching Dana’s face as the phone lights up with a name Dana doesn’t know and a heart Dana does. You know exactly what this feels like from both sides now.'
            : 'Dana’s phone, face-up on the counter, lighting with a name you don’t know and a heart you do. Four seconds is enough for the body: pulse loud in the ears, hands going suddenly, uselessly cold.',
        'The four futures, all visible at once from this exact kitchen, none of them chosen yet.',
        'The one thing research actually knows about the next hour: whatever gets said flooded tends to stay said, filed permanently, regardless of what turns out to be true.',
        'The phone lights again.',
        'Porter (very quiet): "The desk advises no guest to sign anything with shaking hands. That includes sentences."',
      ],
      choices: [
        {
          id: 'confront-now',
          text: 'Confront now. Flooded. Right here in the kitchen.',
          hint: 'Say it before you’ve steadied',
          effects: { lucidity: 8, hearts: -1, axes: { controlAcceptance: -8 } },
          outcome: [
            'The fight, rendered in short, fractured sentences — accusation outrunning evidence, Dana’s own flood answering yours, two people drowning in the same small kitchen.',
            (s: RunState) =>
              seedSplit2(s)
                ? 'What the heart-emoji actually was arrives later, once both of you have calmed enough to hear it: an affair, real, six weeks old. The flood, it turns out, saw something true.'
                : 'What the heart-emoji actually was arrives later, once both of you have calmed enough to hear it: Dana’s sibling, planning a surprise party, three weeks of increasingly excited messages. The flood indicted an innocent phone.',
            'Either truth stings. One vindicates the flood. One indicts it. The room’s actual point was never the answer — it was the hour.',
          ],
          reflections: reflect(
            'Confronting immediately, before either of you has steadied, produces words that outlast whatever turns out to be true.',
            'Both of you were owed a conversation conducted with enough composure to actually hear each other.',
            'Notice how little of what got said in that kitchen was actually about verified facts.',
            'Whatever the truth turns out to be, the flooded words land on Dana regardless, and stay landed.',
          ),
        },
        {
          id: 'gather-first',
          text: 'Say nothing. Verify. Chattam-forensic, patient, cold.',
          hint: 'Build certainty before speaking',
          effects: { lucidity: 18, hearts: -1, axes: { reasonFeeling: -8 }, flags: ['played-detective'] },
          outcome: [
            'Three days, compressed into four beats: the performance of normalcy at breakfast, while quietly auditing an entire life.',
            (s: RunState) =>
              seedSplit2(s)
                ? 'The certainty arrives, and it is worse than the suspicion: an affair, real. You get the answer, and you become — in the getting of it — someone who watched a person sleep and catalogued their breathing.'
                : 'The certainty arrives, and it dissolves the suspicion entirely: a surprise party, nothing else, three days of your own quiet detective work spent on nothing. You get the answer, and you still become someone who watched a person sleep and catalogued their breathing.',
            'Both deliveries — the answer, and what getting it made of you — arrive together, in the same hand.',
          ],
          reflections: reflect(
            'Verifying first produces more reliable information at the cost of days spent secretly surveilling someone you love.',
            'This gathers evidence before accusing, which is fairer to Dana regardless of what it finds.',
            'Ask what the choice to secretly investigate someone reveals about you, independent of what it finds about them.',
            'Dana is being studied, unknowingly, days before ever being asked a direct question.',
          ),
        },
        {
          id: 'pretend',
          text: 'Decide, actively, not to know.',
          hint: 'Choose unknowing on purpose',
          effects: { lucidity: 6, axes: { controlAcceptance: -6 }, flags: ['chose-not-to-know'] },
          outcome: [
            'Unknowing, it turns out, is a full-time job with no holidays. The room time-lapses its maintenance cost across the following weeks.',
            'Whatever the truth actually was, it goes unlearned tonight — filed instead as a low hum under every subsequent conversation.',
          ],
          reflections: reflect(
            'Choosing not to know avoids a hard confrontation while leaving the actual situation, whatever it is, unaddressed.',
            'This defers a truth Dana may owe you and you may owe yourself, indefinitely.',
            'This is a genuine, if costly, form of self-protection — declining a fight you’re not ready to have.',
            'This leaves the relationship’s actual state unexamined, for better or worse, for both of you.',
          ),
        },
        {
          id: 'walk-tonight',
          text: 'Pack one bag. Leave the question behind with the ring.',
          hint: 'Exit without waiting for the answer',
          effects: { lucidity: 12, hearts: -1, axes: { selfOthers: -8 } },
          outcome: [
            'The exit, rendered without triumph. Leaving on a question means carrying the question — packed flat, under everything else, indefinitely.',
            'Some guests call this strength. Some call it flight. The desk, honestly, files it under both.',
          ],
          reflections: reflect(
            'Leaving resolves the immediate crisis without ever resolving the actual question underneath it.',
            'This forecloses Dana’s chance to answer before judgment is passed, whatever the phone actually meant.',
            'This is a real, costly act of self-preservation, whatever else it also is.',
            'This denies both of you the conversation that might have changed what tonight actually meant.',
          ),
        },
        {
          id: 'steady-then-ask',
          text: 'Put the phone down. Walk the block until your hands are yours again — then ask Dana directly, tonight, with no case built.',
          hint: 'Wait out the flood, not the question',
          effects: { lucidity: 14, hearts: -1, axes: { controlAcceptance: 6 }, flags: ['steadied-first'] },
          outcome: [
            'Twenty minutes, cold air, no phone. Not calm, exactly — just past the point where the body is running the conversation instead of you.',
            (s: RunState) =>
              seedSplit2(s)
                ? 'You come back in and ask, once, directly. Dana tells you: an affair, real, six weeks old. It is exactly as bad as the walk let you fear it might be — but you hear the whole sentence, not just the first flooded half of it.'
                : 'You come back in and ask, once, directly. Dana tells you: a sibling, a surprise party, three weeks of excited planning. Nothing. You believe it, mostly because you asked in a state that could actually recognize an answer.',
            'The desk keeps no separate ledger for what got said flooded and what got said steady — but you do, and this time there is nothing filed under the first column.',
          ],
          reflections: reflect(
            'The delay costs you twenty minutes of not-knowing and buys a conversation neither of you has to walk back later.',
            'Dana was owed a direct question, not a verdict delivered flooded or a case built in secret — this is the plainer duty, kept.',
            'Choosing to steady yourself before a hard conversation is a discipline, not a dodge — it costs real effort to do under pressure.',
            'Whatever the truth turns out to be, Dana gets asked once, plainly, by someone capable of actually hearing the answer.',
          ),
        },
      ],
      explanation:
        'What researchers call flooding — the body’s alarm response overwhelming higher reasoning — explains why the first conversation after a suspected betrayal usually goes worst: elevated heart rate and diffuse physiological arousal genuinely impair the ability to think clearly for roughly twenty minutes, a window most confrontations don’t wait out. What the research on discovery conversations consistently recommends is structural: delay, breathing, even a script, rather than trusting the flooded moment to produce anything reliable. And a humbling base rate worth remembering: hearts on phones have more owners than the worst-case story usually considers.',
    },
  ],
  fieldNote: {
    title: 'Signing With Shaking Hands',
    thinkers: 'Gottman (flooding) · discovery-conversation research',
    body: 'Gottman’s physiological research on "flooding" found something specific and testable: a genuinely elevated heart rate produces diffuse physiological arousal that measurably degrades the ability to listen, reason, or speak carefully — not a metaphor, a documented state lasting roughly twenty minutes past its trigger. Research on how betrayal discoveries are best survived converges on structure: delay before the hard conversation, deliberate breathing, sometimes literally a script, rather than trusting whatever arrives first. **What gets said flooded tends to be filed permanently, in a relationship’s memory, regardless of what later turns out to be true.** Four seconds of light. The rest was supplied by the reader — as it is in every room of this wing.',
  },
};

export const theWeddingEve: Room = {
  id: 'the-wedding-eve',
  act: 3,
  title: 'The Wedding Eve',
  type: 'DILEMMA',
  doorHint: 'the door with tomorrow behind it',
  teaser: 'everyone is asleep — the suit hangs on the wardrobe like a question',
  stages: [
    {
      beats: [
        'The night before your wedding to Dana. 02:10. The suit hangs on the wardrobe like a question nobody asked out loud. The seating chart sits finished on the desk.',
        'The doubt arrives in its work clothes: specific, small, exactly 2-a.m.-sized — not dramatic, which somehow makes it harder to dismiss.',
        (s: RunState) =>
          seedSplit(s)
            ? 'The phone rings. An old flame, unexpected, half-apologetic for the hour.'
            : 'The phone doesn’t ring. Nobody calls. The doubt dials itself instead, and keeps dialing.',
        'The inventory the room insists on: which doubts are actually about Dana, which are about marriage as an institution, which are only about you.',
        'The sunk-cost audit follows — deposits, invitations, four years, your mother’s dress — listed in full, and then explicitly disqualified as evidence by the room itself.',
        'Porter: "The desk gets one call a night from this room. It is always someone asking whether everyone gets this call. The honest answer: most. Not all."',
      ],
      choices: [
        {
          id: 'sit-with-it-til-morning',
          text: 'Hold the doubt without obeying or silencing it.',
          hint: 'Wait it out, honestly, until light',
          effects: { lucidity: 22, axes: { controlAcceptance: 8 } },
          outcome: [
            'Dawn arrives with the doubt still present, but sized now, rather than looming.',
            'The room’s finding: doubts that survive honest examination either shrink or sharpen, and either outcome is real information. You walk to the venue knowing which yours did.',
          ],
          reflections: reflect(
            'Sitting with the doubt costs a sleepless night and produces a clearer read on what the doubt was actually about.',
            'This owes the doubt an honest hearing rather than either suppressing or obeying it reflexively.',
            'This is patience under real pressure — neither panicking nor pretending, at 2 a.m., the night before a wedding.',
            'This lets you arrive at the venue as someone who examined the doubt, which Dana is owed over someone who buried it.',
          ),
        },
        {
          id: 'call-someone-honest',
          text: 'Wake the one person who’ll tell you the truth.',
          hint: 'Get an outside, honest read',
          effects: { lucidity: 20, axes: { selfOthers: 4 } },
          outcome: [
            'The 3 a.m. conversation, rendered whole. One question does in four words what the room spent six beats building toward: "is it the day, or the person?"',
            'Permission, received — for either honest answer.',
          ],
          reflections: reflect(
            'Calling someone honest trades a friend’s sleep for a clarifying outside perspective at a genuinely high-stakes moment.',
            'This respects the magnitude of tomorrow’s commitment enough to seek real counsel rather than deciding entirely alone.',
            'This required admitting doubt out loud to another person, which takes its own kind of nerve.',
            'This treats the decision as one that affects Dana enough to be worth getting right, even at an inconvenient hour.',
          ),
        },
        {
          id: 'answer-the-flame',
          text: 'Take the call. Or make it.',
          hint: 'Reopen the old conversation tonight',
          effects: { lucidity: 8, axes: { reasonFeeling: 6, controlAcceptance: -4 }, flags: ['eve-call'] },
          outcome: [
            (s: RunState) =>
              s.flags.includes('opened-the-archive') || s.flags.includes('answered-the-ex')
                ? 'The conversation is warm, and it is archive warmth — the same curator from years ago, still quietly deleting the worst scenes, still working the night before your wedding.'
                : 'The conversation is warm, and warmer than the hour should allow for.',
            'Nothing happens, except that everything gets compared. You hang up knowing something — the room declines to say what, out loud, tonight.',
          ],
          reflections: reflect(
            'Reopening the conversation risks reintroducing a comparison the wedding was never built to survive.',
            'This wasn’t owed to Dana as part of tonight, and Dana doesn’t know it happened.',
            'Notice what it means that this call felt necessary the night before committing to someone else.',
            'Dana is entering tomorrow without knowing this conversation took place tonight.',
          ),
        },
        {
          id: 'postpone',
          text: 'Wake Dana. Say it: "not tomorrow. Not like this."',
          hint: 'Say the hardest sentence available',
          effects: { lucidity: 25, hearts: -1, axes: { selfOthers: -4 } },
          outcome: [
            'The bravest sentence available on this floor, and its full price: a morning of phone calls, deposits, and faces, all paid in public.',
            (s: RunState) =>
              seedSplit2(s)
                ? 'Under the hurt on Dana’s face, rendered last: one unmistakable grain of relief — Dana had questions of their own, unvoiced until now.'
                : 'Under the hurt on Dana’s face, rendered last: no relief at all, only hurt, clean and total. The room lets both worlds exist; this is the one you got.',
          ],
          reflections: reflect(
            'Postponing costs enormous, public, immediate pain in exchange for not marrying under an unresolved doubt.',
            'This is honest to Dana at the latest possible, most expensive moment, rather than not honest at all.',
            'This is the single bravest sentence available in this room, and it costs exactly what bravery usually costs.',
            'This gives Dana the truth before a vow is made, rather than after, whatever else it costs both of you tonight.',
          ),
        },
        {
          id: 'hold-the-cheap-ring',
          text: 'Hold the cheap plastic ring from that party, once, next to tomorrow’s real one.',
          hint: 'A keepsake you’ve been carrying since the Ground Floor',
          effects: { lucidity: 10 },
          keepsakeId: 'the-cheap-ring',
          available: (s: RunState) => (s.keepsakesHeld ?? []).includes('the-cheap-ring'),
          outcome: [
            'You still have it — thirty seconds of being laughed at, plastic gone slightly cloudy with age, kept for reasons you never fully examined.',
            'You have refused a dare before, on far less at stake than this. Check, honestly, whether tomorrow is one — and the answer, whatever it is, arrives quieter than you expected.',
          ],
        },
      ],
      explanation:
        'Lavner’s longitudinal research on premarital doubts found something specific and uncomfortable: doubts expressed before a wedding — especially the bride’s or lower-status partner’s — do predict later marital distress and divorce, but critically, the risk is concentrated in doubts that go unexamined, not doubts that get honestly explored. "Cold feet" and "real signal" function as a false binary; the more useful question is about content, not temperature. And sunk cost — deposits paid, invitations sent — is a formally defined bias for a reason: none of it is actually evidence about whether marrying this person tomorrow is the right decision.',
    },
  ],
  fieldNote: {
    title: 'The 2 A.M. Audit',
    thinkers: 'Lavner (2012) · sunk-cost literature',
    body: 'Lavner’s studies on premarital doubt are specific enough to be genuinely useful: doubts expressed before a wedding do predict elevated risk of later distress and divorce — the effect sizes are real but modest, and worth stating honestly rather than dramatically. The more important finding sits underneath the headline: **the risk concentrates in doubt that goes unexamined, not doubt that gets honestly explored** — which reframes "cold feet" from a verdict into an instruction. The useful distinction isn’t doubting the person versus not doubting them; it’s doubting the person, doubting the institution of marriage itself, and doubting your own readiness — three separate questions routinely collapsed into one 2 a.m. feeling. The suit fits. That was never the question.',
  },
};

export const theTherapist: Room = {
  id: 'the-therapist',
  act: 3,
  title: 'The Therapist',
  type: 'INSIGHT',
  doorHint: 'the door with two chairs',
  teaser: 'fifty minutes, two chairs, four doors you brought with you',
  stages: [
    {
      beats: [
        'Dr. Weiss’s office, rebuilt inside the hotel down to the tissue box on the low table between two chairs. Mid-session. The fight, verbatim, fragments: something about the dishwasher, which was never actually about the dishwasher.',
        'Dr. Weiss names the pattern without assigning blame, the way only a stranger paid to be fair can manage to.',
        'Four doors rise where the office wall used to be, each with a single word above it: CRITICISM. CONTEMPT. DEFENSIVENESS. STONEWALLING. You are asked to walk through the one you always use.',
        'Each door exhales one line as you pass near it: criticism’s righteousness, contempt’s cold comfort, defensiveness’s shield-weight, stonewalling’s roaring quiet.',
        'Porter (as receptionist, this once): "Guests always ask which door is worst. The research is unsentimental: the sneering one. But you’ll walk your own."',
      ],
      choices: [
        {
          id: 'criticism',
          text: 'Walk through CRITICISM.',
          hint: '"you always" / "you never"',
          effects: { lucidity: 18, flags: ['door-criticism'] },
          outcome: [
            'Behind the door: your own "you always"/"you never" sentences, replayed without editorializing.',
            'The antidote, taught in-fiction and practiced once, right there, on the actual dishwasher: naming a specific behavior instead of indicting a whole person.',
          ],
          reflections: reflect(
            'Recognizing this pattern doesn’t undo past instances of it, but changes the cost of the next one.',
            'Dana is owed complaints about specific behavior, not verdicts about character.',
            'This required watching an unflattering pattern of your own without immediately excusing it.',
            'This is the horseman that most directly wears down the person on the receiving end, session after session.',
          ),
        },
        {
          id: 'contempt',
          text: 'Walk through CONTEMPT.',
          hint: 'The eye-roll',
          effects: { lucidity: 18, hearts: -1, flags: ['door-contempt'] },
          outcome: [
            'The eye-roll door. The research is read to you gently but completely: contempt is the single strongest predictor of a relationship ending, of the four.',
            'The antidote, begun in one deliberate motion: one specific, remembered good thing about Dana, said out loud, right now.',
          ],
          reflections: reflect(
            'Naming this pattern costs a hard admission and opens the only door proven to actually predict repair.',
            'Contempt withholds a basic respect Dana is owed regardless of the argument’s content.',
            'This is the hardest of the four doors to walk through honestly, which is itself worth noticing.',
            'This is the horseman research names as most corrosive to the person receiving it — the one costing Dana the most.',
          ),
        },
        {
          id: 'defensiveness',
          text: 'Walk through DEFENSIVENESS.',
          hint: '"yes, but—"',
          effects: { lucidity: 18, flags: ['door-defensiveness'] },
          outcome: [
            'The counter-attack door. Your own "yes, but—" chorus, replayed in full.',
            'The antidote, executed once: taking a small, genuine slice of responsibility, out loud — and its disproportionate effect on Dana’s shoulders, visibly, immediately.',
          ],
          reflections: reflect(
            'Taking partial responsibility costs pride and produces a disproportionately large de-escalation.',
            'Dana is owed acknowledgment of your part, not a rebuttal to hers.',
            'This required setting down a reflex — the urge to counter instead of receive.',
            'This is the pattern that most directly prevents Dana from ever feeling actually heard.',
          ),
        },
        {
          id: 'stonewalling',
          text: 'Walk through STONEWALLING.',
          hint: 'The roaring quiet',
          effects: { lucidity: 18, flags: ['door-stonewalling'] },
          outcome: [
            (s: RunState) =>
              s.flags.includes('played-detective') || s.flags.includes('chose-not-to-know')
                ? 'The quietest door — inside, the same physiology from the kitchen, the counter, the phone: flooding, cross-referenced by the room without needing to be told twice.'
                : 'The quietest door — inside, the body’s own flooding, named and explained: the shutdown as much a physiological event as an emotional one.',
            'The antidote: the announced pause — "I need twenty minutes; I’m coming back" — and the actual coming back, rendered as the real, teachable skill.',
          ],
          reflections: reflect(
            'Recognizing the shutdown pattern doesn’t stop it happening, but makes the announced pause available as a replacement.',
            'Dana is owed a stated pause, not a silent, unexplained withdrawal.',
            'This required naming a defense mechanism that usually operates beneath conscious notice.',
            'The coming-back matters as much to Dana as the leaving — the room insists on both halves of the skill.',
          ),
        },
      ],
      explanation:
        'John Gottman’s "Four Horsemen" — criticism, contempt, defensiveness, and stonewalling — are documented predictors of relationship breakdown, each with a specific, teachable antidote: complaint instead of criticism, built-up respect instead of contempt, taking responsibility instead of defending, and an announced, honored pause instead of unexplained shutdown. Gottman’s famous claim to predict divorce with striking accuracy has drawn a real methodological critique worth stating alongside it — later analyses questioned the original prediction studies’ statistics — so treat the horsemen as a genuinely useful map of destructive patterns, not a fortune-telling machine.',
    },
    {
      beats: [
        (s: RunState) =>
          s.flags.includes('door-contempt')
            ? 'Dr. Weiss offers one repair attempt — small, and, because it comes from Dana, imperfect on purpose. After the contempt you just walked through, it lands harder than it would have otherwise.'
            : 'Dr. Weiss offers one repair attempt: small, and imperfect, because that’s what real repair attempts actually look like.',
        'A bad joke, at slightly the wrong moment. Dana’s, offered with visible nerve.',
      ],
      explanation:
        'Gottman’s research also names the flip side of the Four Horsemen: a "repair attempt" — a small, often clumsy bid one partner makes mid-argument to de-escalate, like a bad joke, an apology, or just reaching for a hand. What matters most isn’t how smooth the repair attempt is; it’s whether the other person actually catches it. Couples who stay happy long-term aren’t the ones who never fight — research finds they’re the ones who successfully accept each other’s repair attempts, even the awkward ones, instead of letting pride keep the argument going a little longer than it needed to.',
      choices: [
        {
          id: 'accept-the-repair',
          text: 'Accept it. Let the bad joke land.',
          hint: 'Take the offered hand',
          effects: { lucidity: 15, axes: { selfOthers: 6 } },
          outcome: [
            'The room lightens by a genuinely measurable amount. Not resolution — repair. The two are not the same, and the room is careful about the difference.',
          ],
          reflections: reflect(
            'Accepting the repair attempt de-escalates the immediate conflict at essentially no cost.',
            'Dana risked something small and imperfect to reach toward you — accepting it honors that risk.',
            'This is the harder discipline of letting yourself be reached, even mid-argument.',
            'This gives Dana’s effort somewhere to land, rather than letting it fall on principle.',
          ),
        },
        {
          id: 'miss-the-repair',
          text: 'Miss it. Stay with the argument.',
          hint: 'Let the moment pass',
          effects: { lucidity: 8, axes: { controlAcceptance: -4 } },
          outcome: [
            'The room shows, plainly, what missing one costs: not catastrophe, just one fewer bridge, in an argument that could have used one.',
          ],
          reflections: reflect(
            'Missing the repair keeps the conflict’s momentum at the cost of an available de-escalation.',
            'This isn’t owed to Dana specifically, but it does decline something Dana offered in good faith.',
            'Notice what staying inside the argument’s momentum costs you as much as Dana.',
            'Dana’s small, nervous attempt goes unacknowledged, which has its own quiet cost.',
          ),
        },
      ],
    },
  ],
  fieldNote: {
    title: 'Four Doors and a Bad Joke',
    thinkers: 'Gottman (1994) · Christensen (1990)',
    body: 'Gottman’s Four Horsemen — criticism, contempt, defensiveness, stonewalling — remain among the most widely cited findings in relationship research, each paired with a specific, learnable antidote rather than a character verdict. The famous claim of near-perfect divorce prediction from short observed interactions has drawn published statistical critique since — later reanalyses questioned aspects of the original studies’ methodology — and the honest framing keeps both facts in view: a genuinely useful diagnostic map, not an oracle. **Repair attempts, not the absence of conflict, are Gottman’s actual load-bearing finding** — happy couples fight plenty; they simply reach for each other, and get reached for, mid-fight, far more often. Christensen’s demand-withdraw research adds a symmetry worth remembering: the pursuer and the one who goes quiet are usually both frightened, just in opposite directions. The tissue box is real. The doors were always in the room; the office just has better lighting.',
  },
};

export const theUsualSuite: Room = {
  id: 'the-usual-suite',
  act: 3,
  title: 'The Usual Suite',
  type: 'NO-SOLUTION',
  doorHint: 'the low door with your name on the ledger',
  teaser: 'the hotel always gives you the same room — you’ve never asked why',
  secret: (s: RunState) => (s.prior?.runs ?? 0) >= 1,
  stages: [
    {
      beats: [
        'A low door off the Long-Stay Wing’s corridor, easy to miss. Behind it: your suite, unmistakably, though you’ve never actually been here before.',
        'A wall, lit from behind. Silhouettes, waiting.',
        (s: RunState) => {
          const moments = pickShadowMoments(s.prior);
          const first = moments[0];
          return first
            ? `A shape on the wall does exactly what you did once, in a room with a different number on the door: "${first.choiceText}"`
            : 'A shape on the wall moves, patient, waiting for a choice it already knows.';
        },
        (s: RunState) => {
          const moments = pickShadowMoments(s.prior);
          const middle = moments[1];
          return middle
            ? `Another shape, mid-play: "${middle.choiceText}" It is not similar to what you remember doing. It is exactly that.`
            : 'Another shape, mid-play, in a room you don’t quite recognize and somehow already do.';
        },
        (s: RunState) => {
          const moments = pickShadowMoments(s.prior);
          const last = moments[2];
          return last
            ? `The last shape, closest to the light: "${last.choiceText}" You recognize your own posture in silhouette before you recognize the choice.`
            : 'The last shape, closest to the light, holds a posture you recognize before you recognize why.';
        },
        'Porter: "I don’t assign this room. The ledger fills itself in. It only ever appears for guests on their second stay. I’ve stopped asking why. The ledger hasn’t stopped answering: because now they can see it."',
      ],
      choices: [
        {
          id: 'name-them',
          text: '"I recognize you." Say, out loud, whose choices these are.',
          hint: 'Name what you’re watching',
          effects: { lucidity: 14, axes: { selfOthers: -3 } },
          outcome: [
            'You say it — not a stranger’s name for it, the small true one, the one you used on yourself, alone, the first time.',
            'The wall dims afterward, the way a fire settles once it’s been fed exactly what it wanted.',
          ],
        },
        {
          id: 'watch-silent',
          text: 'Watch without speaking. Let the shapes finish.',
          hint: 'Witness without narrating',
          effects: { lucidity: 8, axes: { controlAcceptance: 6 } },
          outcome: [
            'You say nothing. The shapes finish their small, exact performances without your correction, without your permission.',
            'It is easier this way, and you notice the ease, and you notice yourself noticing it.',
          ],
        },
        {
          id: 'ask-who-books-it',
          text: 'Ask the Porter directly: who books this room?',
          hint: 'Ask the desk itself',
          effects: { lucidity: 10 },
          outcome: [
            '"You do," the Porter says. "Every time. It’s the only reservation the desk never has to confirm."',
          ],
        },
      ],
      explanation:
        'This room only appears once you’ve already stayed at the Interval before, and it borrows Plato’s allegory of the cave: shown your own past choices as shadows and simply asked to look, honestly, at the pattern they make. Repetition compulsion — the tendency to unconsciously recreate familiar dynamics, even painful ones — is real, well documented, and, crucially, not a life sentence: research on "earned security" finds the pattern genuinely revisable, and witnessing it plainly, without flinching, is consistently the first step.',
    },
  ],
  fieldNote: {
    title: 'The Standing Reservation',
    thinkers: 'repetition-compulsion literature, handled with care',
    body: 'The concept has a complicated clinical history and a soberer modern reading worth preferring: what looks like fate is usually a learned relational strategy, re-running because it once worked and was never consciously revised. **Witnessing a pattern plainly, without immediately judging or excusing it, is the documented first step of actually changing it** — not a metaphor borrowed from therapy, a finding from it. The wall is thin by design. All the load-bearing ones are.',
  },
};

export const theUsualRoom: Room = {
  id: 'the-usual-room',
  act: 3,
  gate: true,
  title: 'The Usual Room',
  type: 'NO-SOLUTION',
  doorHint: 'the door that saw you coming',
  teaser: 'your room number is already written in tonight’s ledger — it always is',
  stages: [
    {
      beats: [
        'The Porter has written tonight’s room assignment in advance. He has never once been wrong. Same floor, same corner, same view of the air shaft — the room you always take.',
        (s: RunState) =>
          (s.prior?.runs ?? 0) >= 1
            ? 'The history, open on the ledger: every previous stay, every assignment, all correct — you can see your own handwriting in the margin, from before.'
            : 'The history, open on the ledger, waiting for its first entry — tonight will be the first line, and the Porter already seems to know roughly what it will say.',
        'You reach, on instinct, for a different key. The board has a small printed note beside the hook: "will reach for 4B first — to test it."',
        'A full beat of panic at being predictable, before anything else. The room lets it sit.',
        'A distinction, offered rather than insisted on: predictable is not automatically the same as unfree.',
        'Porter: "I don’t predict guests. I read handwriting. Yours is legible. That is not the same as finished."',
      ],
      choices: [
        {
          id: 'defiant-different',
          text: 'Demand a different room. Any different room.',
          hint: 'Refuse the assignment on principle',
          effects: { lucidity: 12, axes: { controlAcceptance: -8 } },
          outcome: [
            'The new room, defiantly slept in. Comfortable enough, unfamiliar enough to feel like a statement.',
            'The board’s next line, unfolded for you anyway: "defiance — the most legible stroke in the hand." Rebellion, it turns out, is the pattern’s favorite disguise.',
          ],
          reflections: reflect(
            'Taking the different room changes tonight’s outcome without necessarily changing the underlying pattern the ledger tracked.',
            'This asserts a right to choose, which is real, whatever the ledger predicted about the choosing.',
            'This is the harder question to sit with — whether defiance here is freedom or just the pattern wearing a disguise.',
            'This doesn’t change what anyone else in your life experiences from this pattern, only tonight’s room.',
          ),
        },
        {
          id: 'refuse-all-rooms',
          text: 'Sleep in the lobby. Opt out of the ledger entirely.',
          hint: 'Decline to participate',
          effects: { lucidity: 12, axes: { controlAcceptance: 4 } },
          outcome: [
            'The board, turned around, has read all along: "will attempt the lobby — estimated duration: one night."',
            'Abstention, it turns out, is also a move. The Porter brings a blanket without comment.',
          ],
          reflections: reflect(
            'Opting out avoids the specific room without avoiding the ledger’s broader prediction about your behavior.',
            'This declines participation entirely, which is itself a legitimate response, however incomplete.',
            'Notice that even refusal was, in its way, anticipated — worth sitting with rather than resolving quickly.',
            'This doesn’t engage the actual question of whether the pattern can be revised, only postpones it.',
          ),
        },
        {
          id: 'take-it-knowingly',
          text: 'Take the usual room — on purpose. "It was always going to be this room, and I choose it."',
          hint: 'Own the pattern instead of fighting it',
          effects: { lucidity: 25, axes: { controlAcceptance: 10 } },
          outcome: [
            'The same key, turned this time by a different hand. "The pattern runs through the choosing," the Porter says, "not around it."',
            'His nearest thing to a smile. The gate opens.',
          ],
          reflections: reflect(
            'Choosing the predicted room knowingly doesn’t change tonight’s outcome, but changes what the choosing means.',
            'This makes the choice genuinely yours rather than either obeying or merely rebelling against a prediction.',
            'This is the harder, quieter integration — accepting a pattern is real while still claiming authorship of tonight’s instance of it.',
            'This is the version of tonight that requires no audience, no defiance performed for anyone but yourself.',
          ),
        },
        {
          id: 'room-with-no-number',
          text: 'Ask for the room with no number.',
          hint: 'Ask for the option that isn’t on the board',
          effects: { lucidity: 15, axes: { reasonFeeling: 4 } },
          outcome: [
            'There is such a room. A linen closet, with a chair in it, entirely unremarkable.',
            '"Guests who ask for the unnumbered room are on the board too," the Porter notes: "will choose mystery over meaning; takes the spare blanket." A menu with "none of the above" on it is, notably, still a menu.',
          ],
          reflections: reflect(
            'Choosing the unnumbered room sidesteps the night’s central test rather than resolving it either way.',
            'This is a genuine third option, even if the ledger anticipated that too.',
            'This is a kind of honest evasion — declining to perform certainty you don’t actually feel.',
            'This doesn’t resolve anything for anyone else, but it costs no one anything either.',
          ),
        },
      ],
      explanation:
        'Attachment research finds real continuity — patterns learned early do persist, measurably, across different relationships and years, which can feel like a life sentence when first encountered. The same literature also documents "earned security": people who move toward steadier patterns, usually through relationships or therapy that survive enough honest testing to actually revise the underlying model. Predictable and free are best read as descriptions operating at two different altitudes rather than opposites — a choice can be both anticipated by the pattern and genuinely, presently yours.',
    },
  ],
  fieldNote: {
    title: 'Legible Handwriting',
    thinkers: 'attachment-continuity studies · earned-security research',
    body: 'Longitudinal attachment research finds real continuity in both directions: early patterns do predict later relational behavior with measurable reliability, and — equally measurable — people shift toward "earned security" through relationships and experiences that survive enough honest testing to actually revise the underlying model. **Predictable and free are not opposites; they are descriptions running at two different altitudes of the same choice.** The compatibilist framing borrowed here, with attribution, from the philosophy wing of another hotel down the corridor: you were always going to read this note. You also just chose to. Both entries, one ledger.',
  },
};
