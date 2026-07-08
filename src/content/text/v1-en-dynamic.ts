// The handful of v1 beats that are functions of RunState (state-reactive
// callbacks), copied verbatim from the pre-rewrite room files. These can't be
// auto-extracted by scripts/extract-v1.ts (which only lifts plain strings),
// so they're preserved here by hand alongside it.
import { register } from '../../engine/text/resolver';
import { choseIn, hasFlag } from '../../engine/gameState';
import { punchlineUnlocked } from '../../engine/endings';
import type { RunState } from '../../engine/schema';

register('room.junction.stage1.beat3', 'v1', 'en', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'USHER: You pulled, last time. One for five, you said. Well — here is the same trade, closer to the skin. Let’s see if the mathematics survives the touch.'
    : choseIn(s, 'junction', 'no-pull')
      ? 'USHER: You kept your hands clean at the lever. Curious to see if the bridge changes anything — it usually changes everything, which is itself the puzzle.'
      : 'USHER: You called it stupid last time. The trolley has generously provided a second act. It’s very committed to the bit. Rather like me.',
);

register('room.junction.choice.push.outcome1', 'v1', 'en', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'USHER: Lever and bridge, both. Whatever else one says, the arithmetic in you goes all the way down. That is either integrity or a warning label; the journals are split.'
    : 'USHER: No at the lever, yes on the bridge? Now that is a rare bird. You may want to sit with that one. Take a pamphlet.',
);

register('room.junction.choice.no-push.outcome1', 'v1', 'en', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'USHER: So: pull the lever, spare the push. Five for one at arm’s length, but not at hand’s length. Don’t look so caught out — that exact asymmetry has kept philosophy departments heated since 1976. The question is whether it’s wisdom in your spine or just squeamishness with tenure.'
    : 'USHER: Consistent refusal. The trolley took ten mannequins across two experiments and your hands took none of them. There is a name for your position, and the name is contested, and you are standing in it very steadily.',
);

register('room.ship.stage0.beat4', 'v1', 'en', (s: RunState) =>
  s.memoryLost
    ? 'One plank they reach for is simply not there — a gap with scorched edges, where the photograph used to anchor something. The craftsmen confer, shrug, and fit a blank board in the space. The assembly in the corner has the same hole. It touches the gap at the same moment you do.'
    : 'The craftsmen work from a manifest, and the manifest, you notice, is a photograph album. Every plank has a picture. Every picture has a witness. The assembly in the corner is checking the album too, and nodding at the same pages.',
);

register('room.teleporter.stage0.beat3', 'v1', 'en', (s: RunState) =>
  choseIn(s, 'ship', 'pattern')
    ? 'You remember the workshop — you voted for the pattern, the reassembled planks. The booth, in a sense, is your own position with doors on it. It is one thing to hold a view. It is another to step inside it.'
    : choseIn(s, 'ship', 'neither')
      ? 'You remember the workshop — “me was never a thing that persists,” you said, to two of yourself. The booth has apparently read your file. It hums as if to say: prove it.'
      : 'Somewhere behind you, in a workshop that smelled of cedar, craftsmen are probably still arguing about planks. The booth is the same argument, restated with plumbing.',
);

register('room.door-that-asks.stage0.beat2', 'v1', 'en', (s: RunState) =>
  hasFlag(s, 'pulled-lever') || hasFlag(s, 'kept-lever') || hasFlag(s, 'refused-once')
    ? hasFlag(s, 'pulled-lever')
      ? 'THE DOOR: At the Junction, you pulled the lever — one life spent to keep five. Arithmetic over abstention. Do you stand by it, here, at the end, with the trolley long gone and nothing to gain by either answer?'
      : hasFlag(s, 'kept-lever')
        ? 'THE DOOR: At the Junction, you kept your hands from the lever — five lost, none of them yours to spend. Do you stand by it, here, at the end, where no one is watching and the mannequins have all gone home?'
        : 'THE DOOR: At the Junction, you refused the question itself — called it stupid, declined the premise. I make no judgment. I only ask: standing here now, was the refusal a position, or a flinch?'
    : 'THE DOOR: You never reached the Junction; the trolley ran without you. Curious. Then let me ask it plainly, unstaged: five strangers or one, and your hand on the lever — do you know, even now, what you would do?',
);

register('room.door-that-asks.stage0.beat3', 'v1', 'en', (s: RunState) =>
  s.memoryLost
    ? 'THE DOOR: In the fire, you let the photograph burn. The proof of who you were, traded away. There is a hole in your file where it used to be — I can see it from here. Was it worth it?'
    : hasFlag(s, 'saved-photo')
      ? 'THE DOOR: In the fire, you saved the photograph. The coughing behind the other door stopped, and you carried your proof out past it. It is in your pocket now. Was it worth it?'
      : 'THE DOOR: You carry your past intact — no fires took anything you didn’t hand over. A quiet file. Sometimes the quiet ones have simply not been asked the right question yet. Consider yourself asked: what would you have let burn?',
);

register('room.door-that-asks.choice.dont-remember.outcome0', 'v1', 'en', (s: RunState) =>
  s.memoryLost
    ? 'THE DOOR: In your case, that is not evasion — it is documentation. There is a genuine hole in you, fire-shaped, and answers that fell into it are not disowned, merely unwitnessed. I accept gaps that were paid for. Yours has a receipt.'
    : 'THE DOOR: Hm. Your file shows no fires, no holes — the memories are all present; what’s missing is the willingness to stand next to them. “I don’t remember” from an intact archive is a convenient fog. I will let it pass — I am a door, not a judge — but we both heard it.',
);

register('room.door-that-asks.stage1.beat4', 'v1', 'en', (s: RunState) =>
  punchlineUnlocked(s)
    ? 'And there is — you notice it only now, and you understand that not everyone gets to notice it — a fourth door. Small. Plain. Warm light under it, and from behind it, unmistakably: laughter. The Usher follows your gaze and says nothing at all, which from the Usher is a standing ovation.'
    : 'Somewhere off to the side, you half-notice a small plain door you are fairly sure was never in the blueprints. It is locked. From behind it, very faintly: laughter. The Usher follows your gaze. “Not this time,” he says, gently, and it is somehow both a verdict and an invitation to come back.',
);
