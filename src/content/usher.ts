import type { RunState } from './schema';
import { t } from './text/resolver';
import { usherBarkKey, actIntroKey } from './text/keys';

/** One-line Usher commentary shown at the door-choosing moment. `atUnderstoryFork`
 * is true exactly once per eligible run — the single moment the Act IV
 * understory staircase is offered alongside `boulder` (see `offeredDoors`'s
 * act-4 branch) — and takes priority over every other bark, since it never
 * recurs. */
export function usherDoorBark(s: RunState, runsCompleted: number, doorCount = 2, atUnderstoryFork = false): string {
  if (atUnderstoryFork) {
    return t(
      usherBarkKey('understory-hint'),
      'Usher: That second door is not on my map. It was, once. Take it or don’t; it will not offer twice.',
    );
  }

  // A single remaining door is a gate, not a choice — explain why, rather
  // than letting it read as an arbitrary shrinking of options. (The very
  // first door of the run — the prologue's threshold — is also doorCount
  // 1, but nothing has been "skipped" yet, so it's excluded here.)
  if (doorCount === 1 && s.visited.length > 0) {
    return t(
      usherBarkKey('gate-single-door'),
      'Usher: Only one door remains for this stretch. The others are already behind you, chosen or skipped — which was its own kind of choosing. This one is simply the only way still open.',
    );
  }

  // First real multi-door choice of a fresh run: make the stakes explicit
  // before any clicking happens, so the choice reads as a choice.
  if (runsCompleted === 0 && s.act === 1 && s.visited.length === 1) {
    return t(
      usherBarkKey('first-choice-explainer'),
      'Usher: Several doors, and only some will be yours this time — the rest stay shut, for now. Each hides a different situation, not a different score. Choose the one whose question you are actually willing to sit with.',
    );
  }

  // Second-run winks take priority once per act
  if (runsCompleted > 0 && s.visited.length <= 1) {
    return t(usherBarkKey('second-run'), 'Usher: You have returned. The lever is where you left it; we rearrange nothing here — permanence is the one luxury the facility affords.');
  }

  // Axis-reactive lines
  const { reasonFeeling, selfOthers, controlAcceptance } = s.axes;
  const candidates: string[] = [];

  if (reasonFeeling <= -30)
    candidates.push(t(usherBarkKey('reason-low'), 'Usher: You weigh each room like a ledger. The rooms have taken note, and adjusted their footnotes accordingly.'));
  if (reasonFeeling >= 30)
    candidates.push(t(usherBarkKey('reason-high'), 'Usher: You feel everything here, plainly. The corridor is warmer for it. That is not a figure of speech.'));
  if (selfOthers <= -30)
    candidates.push(t(usherBarkKey('self-low'), 'Usher: You have kept yourself intact. A reasonable instinct. Ask, now and then, what the keeping is for.'));
  if (selfOthers >= 30)
    candidates.push(t(usherBarkKey('self-high'), 'Usher: You keep giving yourself away. It becomes you — though there will be less of you to give, eventually.'));
  if (controlAcceptance <= -30)
    candidates.push(t(usherBarkKey('control-low'), 'Usher: You resist every room you enter. I admire it. The rooms are unmoved by it.'));
  if (controlAcceptance >= 30)
    candidates.push(t(usherBarkKey('control-high'), 'Usher: You have stopped struggling in the water, traveler. Floating is its own skill. So is knowing where the shore went.'));

  if (s.hearts === 1)
    candidates.push(t(usherBarkKey('one-heart'), 'Usher: One heart remains. I am not permitted to worry. Consider this the nearest I come to it.'));
  if (s.lucidity >= 150)
    candidates.push(t(usherBarkKey('high-lucidity'), 'Usher: You see clearly, this far down. Clarity is the one thing here that cannot be counterfeited.'));

  if (candidates.length > 0) return candidates[s.visited.length % candidates.length];

  const generic = [
    t(usherBarkKey('generic0'), 'Usher: Choose a door. Every one of them is yours — a fact most travelers don’t believe until long after.'),
    t(usherBarkKey('generic1'), 'Usher: Take your time. The doors keep it better than you’d expect.'),
    t(usherBarkKey('generic2'), 'Usher: I would tell you which I’d choose, but I have chosen all of them, once. Draw your own conclusions.'),
    t(usherBarkKey('generic3'), 'Usher: The hints above each door are honest. We do not deal in false signs here.'),
    t(usherBarkKey('generic4'), 'Usher: There is no hurry. Time, in this place, is ornamental.'),
    t(usherBarkKey('generic5'), 'Usher: Whichever you skip stays here, unopened, for a different visit. That is not a loss. It is simply not this story.'),
    t(usherBarkKey('generic6'), 'Usher: Read the hint before you decide. It is not decoration — it is the only honest preview you will get.'),
    t(usherBarkKey('generic7'), 'Usher: The doors already know your name, {name}. It is the rest of you they are curious about.'),
  ];
  return generic[s.visited.length % generic.length];
}

/** Act transition announcements. */
export function actIntroText(act: number): string | undefined {
  const fallback: Record<number, string> = {
    1: 'Ahead: a corridor of apartment doors, each leaking the warm light of homes that were never yours. The ordinary rooms, you will find, go deepest. A caution, traveler: a few of these doors cost more than time — choose against yourself, and a heart may go.',
    2: 'The corridor gives way to machinery — gears the size of moons, and slow belts carrying small, indifferent stars. Here the old thought experiments are staged nightly, for a skeleton crew of one. Some of the old experiments still charge admission. The currency, here, is hearts.',
    3: 'The floor turns to black mirror. Your own memories hang in the dark like dioramas, their faces softened past recognition. The facility calls this wing archival. It means: yours, {name}. Some of what you find here has a price you will feel, not merely see — and yes, that price can be a heart.',
    4: 'The fog thins. Beyond it, unmistakably, morning. Three doors remain, and then the threshold. What happens from here counts twice over — though the Usher would say it always did. Even this close to the end, a careless choice can still cost a heart.',
  };
  const text = fallback[act];
  if (!text) return undefined;
  return t(actIntroKey(act), text);
}
