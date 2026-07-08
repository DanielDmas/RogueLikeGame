// Spec docs/design-limerence/05-rooms-act4-understory.md — Act IV: The Top
// Floor (31-35), a fixed corridor of 3. Register: frank/mature, never
// graphic (safety charter, docs/design-limerence/10-safety-education-
// charter.md).
import type { Reflection, Room, RunState } from '../../../engine/schema';
import { choseIn, hasFlag } from '../../../engine/gameState';
import { mirrorUnlocked, patternAvailable } from '../endingLogic';

const reflect = (consequence: string, duty: string, virtue: string, care: string): Reflection[] => [
  { tradition: 'consequence', text: consequence },
  { tradition: 'duty', text: duty },
  { tradition: 'virtue', text: virtue },
  { tradition: 'care', text: care },
];

const YOURS_FLAGS = ['confessed-whole', 'crossed-at-the-conference', 'carried-alone', 'trickle-truth', 'stayed-the-third'];
const THEIRS_FLAGS = ['played-detective', 'chose-not-to-know'];

export const theKitchenTable: Room = {
  id: 'the-kitchen-table',
  act: 4,
  title: 'The Kitchen Table',
  type: 'DILEMMA',
  doorHint: 'the door to the quietest room in the house',
  teaser: 'everything is known now — the coffee is going cold either way',
  stages: [
    {
      beats: [
        'The kitchen at 06:40. A drawing on the fridge, a child’s, held up by a magnet shaped like a strawberry — load-bearing, somehow, in a way nothing else in the room is.',
        (s: RunState) => {
          const yours = YOURS_FLAGS.some((f) => hasFlag(s, f));
          const theirs = THEIRS_FLAGS.some((f) => hasFlag(s, f));
          if (yours && theirs) return 'The night behind you was long, and it belonged to both of you — what you did, and what was done and then found. Neither version cancels the other out this morning.';
          if (yours) return 'The night behind you was long, and it was yours to account for — the thing you did, now fully, finally known.';
          if (theirs) return 'The night behind you was long, and it was theirs to account for — the thing done to you, now fully, finally known.';
          return 'The night behind you was long, and everything that could be said has, by now, been said once.';
        },
        'Two chairs, one table. The phone sits face-up between you now, irrelevant — whatever it once meant, it has finished meaning it.',
        'The first sentence of the rest of it is still unsaid, and neither of you is sure, this morning, whose turn it is to say it.',
        'Four futures, seated at the table like guests who arrived without being asked. Kids asleep upstairs — their weight in the house rendered as acoustics: every word here notes, automatically, what volume it can afford.',
        'Porter (in the hallway mirror only, briefly): "Top-floor mornings are the only part of the hotel I cannot enter. The desk merely confirms: the table is load-bearing. Build on it or clear it. It will hold either."',
      ],
      choices: [
        {
          id: 'stay-for-them',
          text: 'Stay, for the kids. Say so, out loud, to each other.',
          hint: 'a pact, named plainly',
          effects: { lucidity: 12, axes: { selfOthers: 6 }, flags: ['stayed-for-kids'] },
          outcome: [
            (s: RunState) =>
              hasFlag(s, 'already-gone')
                ? 'The pact, rendered honestly: it can be noble scaffolding, or a twenty-year deferral — and the room does not pretend not to have watched you leave in every way but the door already.'
                : 'The pact, rendered honestly: named and revisited, it can hold. Named and shelved, it becomes the quiet catastrophe of a much later morning.',
            'The fork lives inside the choice itself, not outside it. Which one this becomes is decided later, in rooms this morning doesn’t get to see.',
          ],
          reflections: reflect(
            'Staying preserves the household today at a cost that depends entirely on whether the pact gets tended or shelved.',
            'This honors an obligation to the children, though it doesn’t by itself resolve what you owe each other.',
            'This is a choice whose character depends on maintenance — it can be scaffolding or deferral, and only later mornings will say which.',
            'The kids get a stable house this morning — whether it stays one is a separate, ongoing question.',
          ),
        },
        {
          id: 'separate-well',
          text: 'Separate, and spend everything on doing it well.',
          hint: 'grief, done in daylight',
          effects: { lucidity: 20, hearts: -1, axes: { controlAcceptance: 6 } },
          outcome: [
            'The un-dramatic catastrophe: logistics as elegy. One whole beat is simply the calendar of handovers, and it is somehow the hardest part.',
            'What the children carry, research is clear, tracks the conflict — not the category. Grief, done here, in daylight, on purpose.',
          ],
          reflections: reflect(
            'Separating well trades the relationship for a lower-conflict outcome that research suggests actually protects the kids.',
            'This honors what the children are owed — a well-managed separation — over the appearance of an intact family.',
            'This is grief handled with real discipline, chosen over either silent resentment or public conflict.',
            'This is built, deliberately, around what the children will actually carry, rather than around either parent’s comfort.',
          ),
        },
        {
          id: 'attempt-repair',
          text: 'The work. Not the word. The work.',
          hint: 'begin, without a guarantee',
          effects: { lucidity: 25, axes: { reasonFeeling: 6, selfOthers: 8 }, flags: ['chose-repair'] },
          outcome: [
            'No montage, no guarantee — the room renders week one only: an intake form, the first honest inventory, the affair (whosever it was) examined as alarm rather than only as crime.',
            'The final beat is the second appointment, kept. That is the whole victory available by morning, and the room doesn’t pretend it’s more.',
          ],
          reflections: reflect(
            'Attempting repair risks real effort against an uncertain outcome, in exchange for the chance at something better than either staying unchanged or leaving.',
            'This honors the relationship’s original commitment by actually testing whether it can be kept, rather than assuming either way.',
            'This is sustained, unglamorous discipline — showing up to the second appointment, which is the actual test.',
            'This treats whatever happened as alarm worth understanding, not only crime worth punishing — a harder, more useful frame for both of you.',
          ),
        },
        {
          id: 'say-the-unsayable',
          text: 'Say the one thing you’ve each been holding since before any of this.',
          hint: 'the riskiest door at this table',
          effects: { lucidity: 30, hearts: -1 },
          outcome: [
            (s: RunState) =>
              hasFlag(s, 'already-gone')
                ? '"I knew, and I chose not to know" — said first, because it was true first. The room’s riskiest door, opened by the person who’d already, quietly, left.'
                : '"I was lonely years before anyone touched anyone" — said, finally, out loud, at this table, to the person it was always about.',
            'After the sentence, every other choice at this table changes meaning. The room ends here, without resolving anything — because the sentence was the event.',
          ],
          reflections: reflect(
            'Saying the unsayable doesn’t resolve the morning’s practical questions, but it changes what every later answer will actually mean.',
            'Both of you were owed this sentence long before this morning — its lateness doesn’t cancel the debt.',
            'This is the single most exposing honesty available in this room, offered without knowing what it will cost.',
            'This treats the other person as someone owed the deepest truth available, not a managed version of it.',
          ),
        },
        {
          id: 'place-the-unsent-letter',
          text: 'Place the unsent letter on the table, still sealed.',
          hint: 'an amendment to the disclosure, whosever morning it is',
          effects: { lucidity: 10, axes: { selfOthers: 4 } },
          keepsakeId: 'the-unsent-letter',
          available: (s: RunState) => (s.keepsakesHeld ?? []).includes('the-unsent-letter'),
          outcome: [
            'You set it down between the two cups, still sealed, years old now. Whatever it says, it belongs on this table more than it belongs in the drawer it’s lived in.',
            'Neither of you opens it yet. Its being there, finally, visible, is already an amendment to everything else said this morning.',
          ],
        },
      ],
      explanation:
        'What research on children and separation actually shows is specific and counterintuitive: the active ingredient in children’s wellbeing is conflict exposure, not family structure — a well-managed separation reliably outperforms a high-conflict intact household. Esther Perel’s reframe of affairs as alarm rather than only crime is useful and has real limits, stated plainly here: alarm explains why something happened; it does not excuse it, and the person who set it off still owes an account. "Staying for the kids" is a real, defensible choice — provided it comes with an actual maintenance schedule, not just a decision made once at a kitchen table and never revisited.',
    },
  ],
  fieldNote: {
    title: 'The Load-Bearing Table',
    thinkers: 'Amato · Perel',
    body: 'Paul Amato’s decades of research on children and divorce converge on one finding above the others: **conflict exposure, not family structure, is the active ingredient** — children in well-managed separated households consistently do better than children in high-conflict intact ones, and the popular assumption that staying together is automatically the safer choice doesn’t survive the data. Perel’s exit-versus-alarm framing for affairs has drawn fair criticism for how easily it can be misused to excuse harm; used carefully, as intended, it only explains — an alarm tells you something in the house needs attention, it never excuses what got broken pulling it. Repair’s actual predictors, across the literature, are structure, a witness, and time — not a single conversation, however good. The drawing on the fridge survives every version of this morning. Decide which morning it grows up inside.',
  },
};

const ACT1_ROOM_IDS = [
  'the-read-receipt',
  'the-screenshot',
  'the-password',
  'the-party',
  'the-forward',
  'the-best-friends-girl',
  'the-summer-ends',
];

export const theUnsent: Room = {
  id: 'the-unsent',
  act: 4,
  title: 'The Unsent',
  type: 'DILEMMA',
  doorHint: 'the door with a letter slot',
  teaser: 'one message may leave the hotel tonight — the desk guarantees delivery, nothing else',
  stages: [
    {
      beats: [
        'A writing desk at the corridor’s end. One envelope. The Porter, behind it, holding something like a brass letter-scale.',
        'One message leaves tonight. It will not arrive as an email or a call — it will arrive as a dream, an impulse, a song that comes on at the right moment on a car radio.',
        'Porter: "The desk guarantees delivery. It guarantees nothing else — not an answer, not forgiveness, not that it will be understood the way you meant it. One envelope. Choose the address."',
      ],
      choices: [
        {
          id: 'to-the-one-you-hurt',
          text: 'To the one you hurt.',
          hint: 'amends, without asking for absolution',
          effects: { lucidity: 20, axes: { selfOthers: 8 } },
          available: (s: RunState) => YOURS_FLAGS.some((f) => hasFlag(s, f)),
          outcome: [
            'You write it twice. The first draft asks, quietly, to be forgiven. The scale rejects it — not cruelly, just precisely — until the asking is struck out.',
            'The second draft is amends without a request attached. Heavier to write. Lighter, somehow, to send.',
          ],
        },
        {
          id: 'to-the-one-who-hurt-you',
          text: 'To the one who hurt you.',
          hint: 'not forgiveness — release',
          effects: { lucidity: 18, axes: { controlAcceptance: 6 } },
          available: (s: RunState) => THEIRS_FLAGS.some((f) => hasFlag(s, f)),
          outcome: [
            'Not a letter of forgiveness — the room is careful about that distinction, and so, in the end, are you.',
            'A letter that ends the sentence "you still owe me," by tearing up the invoice. Not for their sake. For the sake of the hand that’s been holding it.',
          ],
        },
        {
          id: 'to-the-one-that-got-away',
          text: 'To the one that got away.',
          hint: 'the letter honest people are afraid to write',
          effects: { lucidity: 15, axes: { reasonFeeling: 6 } },
          available: (s: RunState) => hasFlag(s, 'walked-away') || choseIn(s, 'the-summer-ends', 'end-clean'),
          outcome: [
            'The letter honest people are afraid of, mostly because of what it might mean to write it at all.',
            'The room permits exactly one sentence of warmth beyond closure — no more — weighs it, finds it honest, and sends it.',
          ],
        },
        {
          id: 'to-your-16-year-old-self',
          text: 'To your 16-year-old self.',
          hint: 'the room’s kindest door',
          effects: { lucidity: 25 },
          outcome: [
            (s: RunState) => {
              const first = s.transcript.find((t) => ACT1_ROOM_IDS.includes(t.roomId));
              return first
                ? `Down the letter slot, and four floors down to the Ground Floor. It arrives quoting one thing you actually said back then — "${first.choiceText}" — read back with a tenderness sixteen never got to hear.`
                : 'Down the letter slot, and four floors down to the Ground Floor. It arrives as the exact sentence every adult in this hotel needed at sixteen, written by the only person qualified to write it.';
            },
          ],
        },
        {
          id: 'to-your-own-kids-someday',
          text: 'To your own kids, someday.',
          hint: 'the education folded into fiction',
          effects: { lucidity: 20, axes: { selfOthers: 6 } },
          available: (s: RunState) => s.visited.includes('the-kitchen-table'),
          outcome: [
            'Sealed. Dated. "Open when you’re old enough to be in rooms like these."',
            'The whole purpose of tonight, folded into an envelope small enough for a drawer, waiting for a year you can’t yet picture.',
          ],
        },
        {
          id: 'blank-page',
          text: 'Send the blank page.',
          hint: 'everything unsaid still weighs something',
          effects: { lucidity: 12, axes: { controlAcceptance: 4 } },
          outcome: [
            'The heaviest envelope in the desk. Nothing written on it at all.',
            'It arrives as a doorway pause — someone stopping for no reason, feeling accompanied for four unexplainable seconds. That is the whole delivery.',
          ],
        },
      ],
      explanation:
        'Expressive-writing research, in the tradition James Pennebaker began, finds a consistent benefit to writing about difficult experiences even when the writing is never read by anyone else — the measured effect lands on the writer, not the recipient. This room takes that finding at its word: the letter matters for what writing it does to you, and "closure" here is treated honestly as something manufactured through the act of writing, not something found waiting at the end of it.',
    },
  ],
  fieldNote: {
    title: 'The Letter That Arrives Anyway',
    thinkers: 'expressive-writing research (Pennebaker lineage)',
    body: 'Pennebaker’s decades of expressive-writing studies found something the folklore around "closure" usually gets backwards: writing an unsent letter to someone measurably benefits the writer’s wellbeing whether or not the letter is ever read, and often whether or not the recipient is even alive to read it. **Closure, in this research, is manufactured by the writing itself — not discovered by finally getting an answer.** The specific address matters less than the act of writing something true and complete and letting it end. This field note writes itself — the codex entry is whatever message you actually chose to send.',
  },
};

export const theMorningDesk: Room = {
  id: 'the-morning-desk',
  act: 4,
  gate: true,
  title: 'The Morning Desk',
  type: 'INSIGHT',
  doorHint: 'the desk where you check out',
  teaser: 'the Porter has your file open — it’s thicker than you remember writing',
  stages: [
    {
      beats: [
        'The lobby again, dawn behind the doors. The Porter has your file open on the desk. It is thicker than you remember writing.',
        'Porter: "Good morning. Before I can let you out, or keep you in, I conduct a short interview. Not a test. An audit. You have spent this stay answering rooms. I ask, now, about the answers."',
        (s: RunState) => {
          const screenshot = ['tell-nadia', 'confront-tom', 'stay-out', 'verify-first'].find((id) => choseIn(s, 'the-screenshot', id));
          if (screenshot === 'tell-nadia') return 'Porter: "The screenshot. You told Nadia, plainly, and let the fallout land where it landed — on you too, honestly. Do you stand by that, here, with Tom and Nadia both long since out of this building?"';
          if (screenshot === 'confront-tom') return 'Porter: "The screenshot. You gave Tom the choice first, on a deadline. Did you keep the deadline, in the end — and does it matter now whether you did?"';
          if (screenshot === 'stay-out') return 'Porter: "The screenshot. You called it not your business, and deleted it. The secret, I recall, moved in with you instead. Is it still there?"';
          if (screenshot === 'verify-first') return 'Porter: "The screenshot. You verified first, and lost the chance to be first with the truth in the process. A fair trade, or not — you tell me."';
          return 'Porter: "You never opened that particular door — the one with the screenshot in it. Curious. Let me ask it plainly, unstaged: a friend’s partner, caught, in your hand, in a phone that isn’t yours. What do you actually do?"';
        },
        (s: RunState) =>
          hasFlag(s, 'confessed-whole')
            ? 'Porter: "The confession — made, whole, to the person it concerned. That kind of honesty is rarer in this file than guests like to believe. Do you stand by the cost it asked of them?"'
            : hasFlag(s, 'carried-alone')
              ? 'Porter: "The confession — carried, alone, the whole way. A room in you they will live next to and never enter. Was the mercy actually theirs, or only yours?"'
              : hasFlag(s, 'trickle-truth')
                ? 'Porter: "The confession — trickled, a little truer each time it was challenged. The file shows every revision. They will have felt each one."'
                : 'Porter: "No confession appears anywhere in this file. Either none was owed, or one is still, this morning, unfiled."',
        (s: RunState) =>
          s.memoryLost
            ? 'Porter: "The trap, at the Rumor. You learned what she did, and what setting a trap for someone you love makes of the one holding it. There is a hole in your file where the not-knowing used to live. I can see it from here. Was it worth it?"'
            : 'Porter: "No hole in this file — you never traded the not-knowing away for a certainty. Some guests call that trust. Some call it never having been tested hard enough to need to. I make no ruling."',
        'Porter: "Take your time with the last one. Everything you chose in these floors — do you stand by it?"',
      ],
      choices: [
        {
          id: 'stand-by-all',
          text: '"Yes. All of it. I chose what I chose, and I’d sign it again."',
          hint: 'consistency, owned',
          effects: { lucidity: 15, axes: { controlAcceptance: -4 } },
          outcome: [
            'Porter: "Steadiness. Rarer than it advertises — most guests disown at least one room the moment they’re actually asked. You kept the whole ledger, including the entries that cost you."',
            'Porter: "I note, without cruelty, that a ledger fully signed can be integrity or armor. From this side of the desk, they are identical. You will learn which it was, later, at some unscheduled hour. Guests always do."',
          ],
          reflections: reflect(
            'Standing by every choice changes nothing about what already happened — only what you’re now willing to say about it.',
            'You owe your own record an honest signature, whatever it cost — and you just gave one, in full.',
            'Ask whether a fully signed ledger is integrity, or armor worn so long it stopped feeling like a choice.',
            'The Porter notes this without cruelty — whoever it was for, the signing was yours to give or withhold, and you gave it whole.',
          ),
        },
        {
          id: 'name-what-changed-me',
          text: '"No — not all of it. I can tell you exactly what changed me, and where."',
          hint: 'growth, named and owned',
          effects: { lucidity: 25, axes: { reasonFeeling: 4 }, flags: ['noticed-the-hands'] },
          outcome: [
            'You name the room. The specific one. Not a mood — a reason: something a later floor taught the earlier one.',
            'The Porter’s hand, on the ledger, pauses — and for the first time all night you notice the wedding band on his right hand, and the pale, untanned line where a ring sat, once, on his left. "That is the answer I am for," he says, not looking up. "Revision with receipts. Rarer, and better, than consistency."',
          ],
          reflections: reflect(
            'Naming what changed you doesn’t undo the earlier choice — it adds an honest second entry next to the first.',
            'You owe the desk, and yourself, the receipt as much as the revision — naming the room that changed you is the harder half.',
            'Ask whether revising the record here is growth, or a comfortable way to disown who you were before you knew better.',
            'The desk treats a self that can change its mind as more alive than one that can’t — extended, quietly, to whoever you were before.',
          ),
        },
        {
          id: 'some-rooms-i-wasnt-present-in',
          text: '"Some of it I barely remember choosing. I wasn’t fully present for parts of this."',
          hint: 'the honest gap',
          effects: { lucidity: 12 },
          outcome: [
            (s: RunState) =>
              s.memoryLost
                ? 'Porter: "In your case, that is not evasion. It is documentation. There is a genuine hole in you, trap-shaped, and answers that fell into it are not disowned — merely unwitnessed. I accept gaps that were paid for. Yours has a receipt."'
                : 'Porter: "Hm. Your file shows no traps, no holes — the memories are all present; what’s missing is the willingness to stand next to them. \'I wasn’t present\' from an intact file is a convenient fog. I let it pass. I am a desk, not a judge. But we both heard it."',
            'Porter: "Very well. The interview concludes. What remains is not a question. It is a threshold."',
          ],
          reflections: reflect(
            'Admitting the gap doesn’t fill it — the choices made in it stay exactly as unwitnessed as before you said so.',
            'You owe the desk an honest account, including its holes — admitting the gap discharges that more than pretending otherwise would.',
            'Ask whether the desk’s skepticism toward an intact file claiming absence is fair, or whether some gaps are real without a trap to blame.',
            'Whatever the Porter thinks of it, he lets it pass — a small mercy, extended to a guest who was, for part of this, genuinely not all there.',
          ),
        },
      ],
      explanation:
        'Before the threshold opens, the Porter audits the whole stay and asks whether you still stand by it — not to grade you, but to see whether you’re being honest about your own story. The real question underneath it: is it more admirable to stay perfectly consistent with every choice you’ve ever made, or to say plainly, "I was wrong, and here is exactly what changed my mind"? Narrative-identity research treats a self as a story under continuous, honest revision — the point was never to arrive at the desk unchanged.',
    },
    {
      beats: [
        'The grille — or whatever it was, a desk, a mirror, a person — settles, and the lobby doors swing open onto light that is not the hotel’s.',
        'It is morning out there. An actual one: traffic somewhere, a kettle somewhere, someone’s ordinary enormous business, three steps away.',
        'Porter: "End of the line. Or the start of one — depends which direction you read it. The threshold takes you back, to the noise, the faces, the unfinished arguments, all of it. Most guests take it. It is a good door. I keep it well."',
        'Porter: "But it is not the only one open to you, and I am required to say so. You may stay — the rooms always need a keeper, and I have been at this a very long time. Or you may lie down here at the threshold and let the last of tonight finish, gently. Some guests, at the end, choose the quiet. It is not my place to call that losing."',
        (s: RunState) =>
          mirrorUnlocked(s)
            ? 'And there is — you notice it only now, and understand not everyone gets to notice it — a fourth door. Small. Plain. From behind it: two cups being poured, and laughter that sounds, unmistakably, exactly like your own.'
            : 'Somewhere off to the side, you half-notice a small plain door you’re fairly sure wasn’t in the lobby when you checked in. It is locked. From behind it, faintly: laughter. The Porter follows your gaze. "Not this time," he says, gently — both a verdict and an invitation to come back.',
      ],
      choices: [
        {
          id: 'walk-out',
          text: 'Walk out. Back to the morning, the noise, the world.',
          hint: 'the return',
          effects: { lucidity: 15 },
          outcome: [
            'You step toward the light. The threshold has the exact temperature of a doorway in summer — that half-degree shift that means outside.',
            'Porter (calling after you): "Whatever you find out there — it is the same conversation you left. That was never the promise. You were the renovation. Mind the step."',
          ],
        },
        {
          id: 'take-the-desk',
          text: 'Stay. Take the desk. This is the Porter’s job now.',
          hint: 'the keeper’s bargain',
          effects: { lucidity: 15, axes: { selfOthers: 6 } },
          outcome: [
            'You turn from the morning — actually turn, which the lobby registers with something like a held breath — and hold out your hand for the ledger.',
            'Porter (not handing it over yet): "Be sure. The hours are eternal, the pay is nothing, and the guests are — well, you’ve been one. You will watch every one of them face the phone, the corridor, the table, and you may never tell them the answers, chiefly because there aren’t any."',
            'Porter (handing it over — the ledger warm, your name suddenly legible in it): "...Welcome to the desk. First lesson: the ring and the pale stripe are the same size. It’s on purpose. Everything here is."',
          ],
        },
        {
          id: 'stop-carrying-it',
          text: 'Lie down at the threshold. Let it finish, gently, on your own terms.',
          hint: 'the quiet',
          effects: { lucidity: 10, hearts: -3, axes: { controlAcceptance: 12 } },
          outcome: [
            'You lie down with the morning three steps away, and it is not defeat — the Porter can tell, the lobby can tell. It is a choice, made with open eyes, by someone who walked every floor to earn the right to make it.',
            'Porter (sitting down beside you, setting the ledger aside): "Then I will stay until it is done. No guest dissolves alone on my shift. It is not an ending, you know. It is a tide."',
          ],
        },
        {
          id: 'laughing-door',
          text: 'The small door. The laughter. Open it.',
          hint: 'you earned the noticing',
          effects: { lucidity: 25 },
          available: (s: RunState) => mirrorUnlocked(s),
          outcome: [
            'You cross to the small plain door, and the handle turns before you’ve quite gripped it, the way a friend opens from the other side.',
            'Porter (behind you, and for once his voice has neither the ring nor its absence in it): "Very few guests ever notice this door. Fewer still open it. Go on, then. I’ll get the lights."',
          ],
        },
        {
          id: 'i-know-every-room',
          text: '"I know every room."',
          hint: 'not a door — a sentence',
          effects: { lucidity: 20 },
          available: (s: RunState) => patternAvailable(s),
          outcome: [
            'You do not step toward any of the doors. You say it instead, the way you would say a fact rather than a wish — and the saying is already most of what happens.',
            'The Porter goes very still, one hand on the ledger, and does not finish closing it.',
          ],
        },
      ],
      explanation:
        'The threshold is open, and the choice is finally how this stay actually ends: walk back into an ordinary life, stay to help the next guest, or let yourself rest completely. None of these is the correct ending — each is a different, equally honest answer to what you actually want right now, after everything on these floors.',
    },
  ],
  fieldNote: {
    title: 'The File Read Back',
    thinkers: 'narrative-identity research (McAdams lineage) · the hotel’s own ledger',
    body: 'Narrative-identity researchers — Dan McAdams foremost among them — treat a self not as a fixed thing but as a story under continuous, active authorship: who you are is substantially the account you give of how you got here, and that account keeps getting revised as you live further into it. Relationships, on this view, are co-authored narratives, and the skill this whole hotel has been teaching is the audit itself: owning the full file, including the pages you’d rather were lost or rewritten. **Every floor this stay staged — the read receipt, the corridor, the kitchen table — was one question in different rooms: when your file is read back to you, is the signature yours?**',
  },
};

export const act4Rooms = [theKitchenTable, theUnsent, theMorningDesk];
