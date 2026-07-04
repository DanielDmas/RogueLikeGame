import type { RunState } from './schema';

/** One-line Usher commentary shown at the door-choosing moment. */
export function usherDoorBark(s: RunState, runsCompleted: number): string {
  // Second-run winks take priority once per act
  if (runsCompleted > 0 && s.visited.length <= 1) {
    return 'USHER: Back again? The lever’s where you left it. We don’t rearrange; the rooms find that gauche.';
  }

  // Axis-reactive lines
  const { reasonFeeling, selfOthers, controlAcceptance } = s.axes;
  const candidates: string[] = [];

  if (reasonFeeling <= -30)
    candidates.push('USHER: You’re running this place like an audit. Admirable. The rooms have noticed, and are preparing footnotes.');
  if (reasonFeeling >= 30)
    candidates.push('USHER: All heart, this one. The corridors are getting warmer around you. That’s not a metaphor; facilities respond.');
  if (selfOthers <= -30)
    candidates.push('USHER: You’ve been keeping yourself whole. Sensible. Do check, occasionally, what the whole is for.');
  if (selfOthers >= 30)
    candidates.push('USHER: Still giving pieces of yourself away, I see. Generous. The paperwork on you is getting thinner.');
  if (controlAcceptance <= -30)
    candidates.push('USHER: You fight every room. I respect it. The rooms respect it. The rooms are also, I should mention, undefeated.');
  if (controlAcceptance >= 30)
    candidates.push('USHER: You’ve gone soft in the water, traveler. Floating is a skill. So is knowing where the shore went.');

  if (s.hearts === 1)
    candidates.push('USHER: One heart left. I’m contractually forbidden to be worried, so consider this an expression of contractual compliance.');
  if (s.lucidity >= 150)
    candidates.push('USHER: You’re unusually lucid for this depth. Keep it. Lucidity is the only currency here the house can’t counterfeit.');

  if (candidates.length > 0) return candidates[s.visited.length % candidates.length];

  const generic = [
    'USHER: Choose a door. They’re all yours, which is the part nobody believes until much later.',
    'USHER: No pressure. The doors are patient. The fog, slightly less so.',
    'USHER: I’d tell you which one I’d pick, but I picked all of them once, and look at me.',
    'USHER: The hints above the doors are accurate, by the way. Misleading signage was banned after an incident in the ninth millennium.',
    'USHER: Take your time. Time here is decorative.',
  ];
  return generic[s.visited.length % generic.length];
}

/** Act transition announcements. */
export const actIntros: Record<number, string> = {
  1: 'The corridor ahead is lined with apartment doors, each leaking the warm light of homes that were never yours. Ordinary rooms. The ordinary ones go deepest.',
  2: 'The corridor opens into machinery — gears the size of moons, conveyor belts of small indifferent stars. Here the old thought experiments are staged nightly, with a skeleton crew.',
  3: 'The floor turns to black mirror. Dioramas of your own memories float in the dark, faces gently blurred. The facility calls this wing archival. It means: yours.',
  4: 'The fog is thinning. Beyond it, unmistakably: dawn. Three doors remain, and then the Threshold. Everything from here on counts double, which — the Usher would note — everything always did.',
};
