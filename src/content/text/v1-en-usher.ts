// v1 (original voice) copies of the Usher's door-barks and act intros,
// preserved verbatim from the pre-rewrite usher.ts, keyed to match the
// bucket keys `usherDoorBark` now selects by (see content/usher.ts).
import { registerAll } from '../../engine/text/resolver';

registerAll('v1', 'en', {
  'usher.bark.second-run':
    'USHER: Back again? The lever’s where you left it. We don’t rearrange; the rooms find that gauche.',
  'usher.bark.reason-low':
    'USHER: You’re running this place like an audit. Admirable. The rooms have noticed, and are preparing footnotes.',
  'usher.bark.reason-high':
    'USHER: All heart, this one. The corridors are getting warmer around you. That’s not a metaphor; facilities respond.',
  'usher.bark.self-low':
    'USHER: You’ve been keeping yourself whole. Sensible. Do check, occasionally, what the whole is for.',
  'usher.bark.self-high':
    'USHER: Still giving pieces of yourself away, I see. Generous. The paperwork on you is getting thinner.',
  'usher.bark.control-low':
    'USHER: You fight every room. I respect it. The rooms respect it. The rooms are also, I should mention, undefeated.',
  'usher.bark.control-high':
    'USHER: You’ve gone soft in the water, traveler. Floating is a skill. So is knowing where the shore went.',
  'usher.bark.one-heart':
    'USHER: One heart left. I’m contractually forbidden to be worried, so consider this an expression of contractual compliance.',
  'usher.bark.high-lucidity':
    'USHER: You’re unusually lucid for this depth. Keep it. Lucidity is the only currency here the house can’t counterfeit.',
  'usher.bark.generic0': 'USHER: Choose a door. They’re all yours, which is the part nobody believes until much later.',
  'usher.bark.generic1': 'USHER: No pressure. The doors are patient. The fog, slightly less so.',
  'usher.bark.generic2': 'USHER: I’d tell you which one I’d pick, but I picked all of them once, and look at me.',
  'usher.bark.generic3':
    'USHER: The hints above the doors are accurate, by the way. Misleading signage was banned after an incident in the ninth millennium.',
  'usher.bark.generic4': 'USHER: Take your time. Time here is decorative.',
  'act.intro.1':
    'The corridor ahead is lined with apartment doors, each leaking the warm light of homes that were never yours. Ordinary rooms. The ordinary ones go deepest.',
  'act.intro.2':
    'The corridor opens into machinery — gears the size of moons, conveyor belts of small indifferent stars. Here the old thought experiments are staged nightly, with a skeleton crew.',
  'act.intro.3':
    'The floor turns to black mirror. Dioramas of your own memories float in the dark, faces gently blurred. The facility calls this wing archival. It means: yours.',
  'act.intro.4':
    'The fog is thinning. Beyond it, unmistakably: dawn. Three doors remain, and then the Threshold. Everything from here on counts double, which — the Usher would note — everything always did.',
});
