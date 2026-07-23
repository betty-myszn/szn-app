import type { SeasonInfo } from "@/lib/seasons";
import { SIGN_TRAITS } from "@/lib/interpretations";

// --- The Pattern You're Breaking -------------------------------------------------

export interface PatternBreaking {
  pattern: string;
  replacingWith: string;
}

const PATTERNS_BY_SIGN: Record<string, PatternBreaking> = {
  Aries: { pattern: "waiting for the perfect moment to start", replacingWith: "a woman who starts before she's ready, because starting is what makes her ready" },
  Taurus: { pattern: "staying in situations that are comfortable but complete, long after they've stopped growing you", replacingWith: "a woman who lets go of what's finished, even when it's cosy, to make room for what's next" },
  Gemini: { pattern: "scattering your energy across ten interests so none of them ever get finished, or judged", replacingWith: "a woman who commits to one thing long enough to actually see what she's capable of" },
  Cancer: { pattern: "abandoning your own needs and calling it being low-maintenance", replacingWith: "a woman who names what she needs early, clearly, and without a three-paragraph apology" },
  Leo: { pattern: "shrinking your visibility to keep other people comfortable", replacingWith: "a woman who takes up the space she was always going to take up eventually, just sooner" },
  Virgo: { pattern: "perfectionism dressed up as high standards, quietly keeping everything unfinished and unseen", replacingWith: "a woman who ships the good-enough version and improves it in public, in real time" },
  Libra: { pattern: "people pleasing, abandoning your own preference the second there's a hint of friction", replacingWith: "a woman whose \"no\" is as fast and clean as her \"yes\"" },
  Scorpio: { pattern: "controlling every outcome so tightly that nothing is ever allowed to be easy", replacingWith: "a woman who can let something be simple without needing to earn it the hard way first" },
  Sagittarius: { pattern: "staying so busy chasing the next thing that you never have to sit with whether the current thing worked", replacingWith: "a woman who finishes what she starts before she chases the next horizon" },
  Capricorn: { pattern: "overworking to prove a worth that was never actually in question", replacingWith: "a woman whose worth is settled before the achievement, not dependent on it" },
  Aquarius: { pattern: "hiding the parts of yourself that feel too different, to avoid standing out in the wrong way", replacingWith: "a woman who lets her difference be the whole point instead of the thing she edits out" },
  Pisces: { pattern: "waiting for permission, certainty or the perfect sign before you commit to a decision", replacingWith: "a woman who trusts the nudge and moves before the proof arrives" },
};

export function getPatternBreaking(sign: string): PatternBreaking {
  return PATTERNS_BY_SIGN[sign] || PATTERNS_BY_SIGN.Leo;
}

export function whyPatternFormed(sign: string, name: string): string {
  const traits = SIGN_TRAITS[sign] || SIGN_TRAITS.Leo;
  return `This pattern isn't a character flaw, ${name}, it's a strategy your chart built early to keep you safe. Your ${sign.toLowerCase()} energy runs on ${traits.essence}, and the shadow side of that same gift is ${traits.shadow}. That strategy worked once. It's costing you more than it's protecting now.`;
}

// Three concrete, sign-specific steps to actually practice breaking the pattern this week,
// tailored to that sign's exact pattern text rather than a generic template.
const PATTERN_BREAK_STEPS: Record<string, string[]> = {
  Aries: [
    "Pick the thing you've been waiting to feel ready for and do the first ugly version of it today, no more circling.",
    "Notice the exact moment you start stalling this week, name it out loud, then move anyway.",
    "Tell one person what you started, publicly, before it's polished, so there's no quiet retreat.",
  ],
  Taurus: [
    "Name one thing that's comfortable but finished, out loud, even if nothing changes yet.",
    "Take one small step this week toward letting it go, a conversation, a date, a decision you've been avoiding.",
    "Notice what you're afraid the empty space will feel like, then sit in it for five minutes on purpose.",
  ],
  Gemini: [
    "Pick the one interest you keep dropping and give it your full attention for the next seven days, nothing else.",
    "Finish one small thing you started weeks ago, all the way, even if it's imperfect.",
    "Say no to one shiny new idea this week purely to protect the one you're finishing.",
  ],
  Cancer: [
    "Name one need out loud to someone this week, in one sentence, no apology attached.",
    "Notice the moment you're about to say 'I'm fine' when you're not, and correct it in real time.",
    "Ask for the thing you actually want instead of hoping someone notices you need it.",
  ],
  Leo: [
    "Take up the space you've been shrinking, once, visibly, this week, no disclaimer.",
    "Post, say or wear the thing you've been dimming down for other people's comfort.",
    "Notice who gets uncomfortable when you stop shrinking, and let that be information, not a reason to stop.",
  ],
  Virgo: [
    "Ship the good-enough version of something today instead of waiting for it to be perfect.",
    "Let one person see the unfinished, mid-process version of your work this week.",
    "Notice the exact standard you're holding yourself to, and ask who actually set it.",
  ],
  Libra: [
    "Say your honest preference once this week before you default to 'whatever works for you'.",
    "Notice the moment you're about to smooth over friction, and let it sit instead, just once.",
    "Practise a fast, clean no on something small, no extended justification attached.",
  ],
  Scorpio: [
    "Let one thing be easy this week, don't add difficulty to make it feel earned.",
    "Loosen your grip on one outcome you've been controlling tightly, and notice what actually happens.",
    "Ask for help with one thing instead of handling it alone to stay in control.",
  ],
  Sagittarius: [
    "Finish the thing you started before you let yourself chase the next idea this week.",
    "Sit with whether your last project actually worked, honestly, before moving on from it.",
    "Say no to one new, exciting distraction purely to protect your follow-through.",
  ],
  Capricorn: [
    "Rest once this week without earning it first, and notice the discomfort without acting on it.",
    "Name one achievement you've never let yourself actually feel proud of, out loud.",
    "Turn down one task that exists only to prove a worth that was never in question.",
  ],
  Aquarius: [
    "Say the unconventional opinion out loud this week instead of editing it down to fit in.",
    "Let one person see the version of you that feels 'too different', on purpose.",
    "Notice where you're diluting your originality to be more palatable, and stop once.",
  ],
  Pisces: [
    "Make one decision this week before you feel fully certain, and act on the nudge anyway.",
    "Notice the moment you're waiting for a sign, and treat the nudge you already had as the sign.",
    "Commit to one thing out loud before you've gathered every possible reassurance first.",
  ],
};

export function getPatternBreakSteps(sign: string): string[] {
  return PATTERN_BREAK_STEPS[sign] || PATTERN_BREAK_STEPS.Leo;
}

// --- The Woman You're Becoming ----------------------------------------------------

const FUTURE_SELF_TRAITS: Record<string, { thinks: string; behaves: string; decides: string; treats: string; experienced: string }> = {
  Aries: {
    thinks: "she trusts her first instinct instead of interrogating it into silence",
    behaves: "she moves the second she decides, no lengthy warm-up required",
    decides: "fast, and she lets the decision be wrong sometimes rather than never make one",
    treats: "she stops apologising for her pace and lets everyone else catch up",
    experienced: "as someone who makes things happen, the one people call when they need momentum",
  },
  Taurus: {
    thinks: "she knows her worth was never up for negotiation, so she stopped negotiating it",
    behaves: "she invests in quality over quantity, in everything, including her own time",
    decides: "slowly and completely, and once she's decided, nothing moves her off it",
    treats: "her body and her pleasure like they matter, not like rewards she has to earn",
    experienced: "as grounded, unshakeable, the person whose calm changes the temperature of a room",
  },
  Gemini: {
    thinks: "she trusts that depth in one thing beats breadth across ten",
    behaves: "she finishes what she starts, and lets that become her reputation",
    decides: "by talking it through once, out loud, then committing instead of circling",
    treats: "her own ideas as worth finishing, not just worth having",
    experienced: "as sharp, magnetic, someone whose words actually land and stick",
  },
  Cancer: {
    thinks: "her needs are valid data, not inconvenient weakness",
    behaves: "she asks for what she needs directly, the first time, without testing people first",
    decides: "from a place of emotional safety she built herself, not one she waits for someone else to provide",
    treats: "herself like someone worth protecting, out loud, in front of other people",
    experienced: "as deeply safe to be around, and quietly, unmistakably powerful",
  },
  Leo: {
    thinks: "her light was never supposed to be rationed",
    behaves: "she shows up fully, even when the applause isn't guaranteed",
    decides: "based on what lights her up, not on what keeps her small enough to be liked by everyone",
    treats: "her own visibility as a responsibility to use, not a risk to manage",
    experienced: "as the person people remember from the room, effortlessly, without trying too hard",
  },
  Virgo: {
    thinks: "done and imperfect beats perfect and hidden, every single time",
    behaves: "she ships the thing at eighty percent and improves it live",
    decides: "based on good enough evidence, not the impossible standard of complete certainty",
    treats: "her own effort as sufficient, without the constant internal audit",
    experienced: "as brilliant and refreshingly human, not intimidatingly unreachable",
  },
  Libra: {
    thinks: "her preference matters as much as everyone else's comfort",
    behaves: "she states her actual opinion first, then negotiates from there if needed",
    decides: "quickly, trusting her own taste instead of polling the room first",
    treats: "conflict as information, not a threat to the relationship",
    experienced: "as someone with real, clear taste, not just someone who's easy to be around",
  },
  Scorpio: {
    thinks: "ease is not something she has to earn through struggle first",
    behaves: "she lets people see her before she's fully healed, not just after",
    decides: "by feeling the fear and choosing trust anyway, deliberately",
    treats: "vulnerability as strength on display, not weakness to hide",
    experienced: "as magnetic and real, someone whose depth feels like an invitation, not a wall",
  },
  Sagittarius: {
    thinks: "finishing what she started is more expansive than starting the next thing",
    behaves: "she commits to the follow-through, not just the exciting opening chapter",
    decides: "with a clear horizon in mind, not just an escape from the current one",
    treats: "her own promises to herself as seriously as her promises to other people",
    experienced: "as someone whose big talk is now matched by bigger, finished, follow-through",
  },
  Capricorn: {
    thinks: "her worth was decided before the achievement, not earned by it",
    behaves: "she rests on purpose, without needing to justify it with output first",
    decides: "based on what she actually wants, not just what looks impressive on paper",
    treats: "success as something she gets to enjoy, not just something she has to prove",
    experienced: "as powerful and warm, not just powerful and unreachable",
  },
  Aquarius: {
    thinks: "her difference is the entire point, not a flaw to file down",
    behaves: "she says the unconventional thing out loud instead of pre-editing it into acceptable",
    decides: "from her own original read on things, not the group consensus",
    treats: "her strangeness as genius in progress, not something to apologise for",
    experienced: "as ahead of the curve, magnetic precisely because she never tried to blend in",
  },
  Pisces: {
    thinks: "the nudge is enough evidence, she doesn't need certainty to move",
    behaves: "she acts on the intuitive hit before the logical mind talks her out of it",
    decides: "quickly, trusting the feeling, and course-corrects later if she needs to",
    treats: "her sensitivity as a superpower for reading rooms, not a liability to manage",
    experienced: "as intuitive and calm, someone whose presence makes things feel less chaotic",
  },
};

export function getFutureSelfPortrait(sign: string) {
  return FUTURE_SELF_TRAITS[sign] || FUTURE_SELF_TRAITS.Leo;
}

// --- Future Self Letters -----------------------------------------------------------

const FUTURE_SELF_LETTERS: Record<string, string> = {
  Aries: "It's me. Six months from where you are right now. I need you to know the leap you're scared to take actually works out, but only because you stopped waiting for the fear to leave first. You just went, shaking, and it turns out shaking and capable can happen at the exact same time. Stop researching the jump. Take it.",
  Taurus: "It's me, further down the road than you are today. I need you to know that letting go of the thing you outgrew didn't ruin your stability, it built a better one. You kept treating comfort like proof of safety. It wasn't. Real safety came from trusting yourself enough to change. Let go sooner than you think you need to.",
  Gemini: "It's me, six months ahead. The thing you're scared to commit to fully, the one project, the one voice, actually became the thing people know you for. Every other idea you were juggling would have watered this one down. Depth was always going to serve you more than range. Pick the one thing. Finish it.",
  Cancer: "It's me, from the version of you who finally started saying what she needed instead of hoping someone would guess. It changed everything, not because people suddenly became mind readers, but because you stopped making yourself small enough to not need anything. You are allowed to need things loudly. Practise saying it today.",
  Leo: "It's me, six months from now, finally as visible as I was always supposed to be. I need you to know the applause was never actually the point, showing up fully was. The version of you who dimmed herself for smaller rooms is gone. I'm proud of the woman who decided to stop asking permission to shine. Keep going.",
  Virgo: "It's me, from the future where the project you kept polishing finally got seen, unfinished edges and all. Nobody noticed the flaws you were so worried about. They noticed that it existed. Perfectionism cost you months you're not getting back. Ship the eighty percent version. I promise you, it's already good enough.",
  Libra: "It's me, six months ahead, finally saying what I actually think before I ask what everyone else thinks first. The relationships that mattered didn't leave when I stopped people pleasing, they got realer. The ones that couldn't handle my actual opinion were never as solid as they looked. Trust your own taste. It's better than you think.",
  Scorpio: "It's me, from the other side of finally letting someone see the unfinished, unhealed parts of me before I felt ready. It didn't destroy the connection, it deepened it faster than years of careful control ever could. You don't have to earn ease through more struggle. Let it be easy sometimes. You've done enough hard already.",
  Sagittarius: "It's me, six months from now, having actually finished the thing instead of chasing the next exciting horizon. Turns out completion feels better than I expected, and it's the reason people finally trust the big talk. The next adventure will still be there. Finish this one first. You'll thank yourself.",
  Capricorn: "It's me, from six months ahead, having finally rested without earning it first. The empire didn't collapse. If anything, it grew faster once I stopped white-knuckling every decision. Your worth was never actually tied to your output, that was a story you built to survive something once. You can put it down now.",
  Aquarius: "It's me, six months from now, finally saying the strange, original thing out loud instead of pre-editing it into something safer. The people who mattered leaned in closer, not away. Your difference was never the liability you thought it was, it was the entire reason anyone remembers you at all. Stop filing yourself down.",
  Pisces: "It's me, from the version of you who finally acted on the nudge instead of waiting for certainty that was never going to arrive. It worked out, not because I had proof, but because I trusted the feeling enough to move anyway. Your intuition has been right more often than your doubt. Start believing that sooner.",
};

export function getFutureSelfLetter(sign: string, name: string): string {
  const letter = FUTURE_SELF_LETTERS[sign] || FUTURE_SELF_LETTERS.Leo;
  return letter.replace(/^It's me/, `${name}, it's me`);
}

// --- Signs You're On The Right Path -------------------------------------------------

export const SIGNS_ON_THE_RIGHT_PATH: string[] = [
  "you stop apologising before you say what you actually mean",
  "you make decisions faster, with less second-guessing and fewer people polled first",
  "you stop refreshing the analytics, the inbox, the notifications, every five minutes",
  "money starts feeling less emotionally charged, checking your balance stops being a dread event",
  "you trust your own read on a situation before you go asking everyone else what they think",
  "the trigger still shows up, but your reaction time to it gets shorter every time",
  "compliments start landing as simple fact instead of something to deflect",
  "rest stops feeling like something you have to earn first",
];

// --- Experiments ---------------------------------------------------------------------

export interface Experiment {
  id: string;
  label: string;
  emoji: string;
  tags: string[];
  intro: string;
  action: string;
  reflectionPrompts: string[];
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "visibility",
    label: "the visibility experiment",
    emoji: "\u{1F441}",
    tags: ["visibility", "confidence", "self-expression", "magnetism"],
    intro: "Test whether being seen is actually as risky as it feels, or whether that's an old story you've been running unchecked.",
    action: "Post, say or show the thing you'd normally edit down or hide. One unfiltered, visible act, once, this week.",
    reflectionPrompts: [
      "What did you expect to happen, and what actually happened?",
      "What's the worst thing that occurred, and could you survive it if it happened again?",
      "What would you do differently if you ran this experiment again next week?",
    ],
  },
  {
    id: "money",
    label: "the money experiment",
    emoji: "\u{1F4B0}",
    tags: ["worth", "money", "ambition"],
    intro: "Test whether asking for more actually costs you what you fear it will.",
    action: "Ask for more once this week, a higher rate, a raise, a better deal, or simply state your price without softening it.",
    reflectionPrompts: [
      "What story did you tell yourself right before you asked?",
      "What actually happened when you asked, versus what you predicted?",
      "How did your body feel in the seconds after, and what does that tell you?",
    ],
  },
  {
    id: "dating",
    label: "the dating & relationships experiment",
    emoji: "❤",
    tags: ["relationships", "intimacy", "connection", "harmony"],
    intro: "Test whether honesty actually damages closeness, or whether it's the thing that's been missing.",
    action: "Say one true, slightly uncomfortable thing to someone this week instead of the polished, safe version.",
    reflectionPrompts: [
      "What did you expect them to do, and what did they actually do?",
      "Did the relationship get weaker or stronger after the honesty?",
      "What would it cost you to keep doing this regularly?",
    ],
  },
  {
    id: "boundaries",
    label: "the boundaries experiment",
    emoji: "\u{1F6D1}",
    tags: ["balance", "self-care", "power", "harmony"],
    intro: "Test whether the people around you actually leave when you say no, or whether that's a fear with no evidence behind it.",
    action: "Say no to one request or obligation this week, clearly, without the extended justification.",
    reflectionPrompts: [
      "What did you brace yourself for, and did it happen?",
      "How did the other person actually respond?",
      "What did you get back, in time or energy, by saying no?",
    ],
  },
  {
    id: "confidence",
    label: "the confidence experiment",
    emoji: "✨",
    tags: ["confidence", "courage", "self-trust", "action"],
    intro: "Test whether confidence really has to arrive before the action, or whether it shows up afterward, as evidence.",
    action: "Do the thing you've been waiting to feel ready for, this week, while the doubt is still present.",
    reflectionPrompts: [
      "Did the fear leave before you acted, during, or after?",
      "What evidence did this give you that you didn't have before?",
      "What's the next slightly bigger version of this you could try?",
    ],
  },
];

export function pickRecommendedExperiment(season: SeasonInfo): Experiment {
  const scored = EXPERIMENTS.map((e, i) => ({
    e,
    i,
    score: e.tags.filter((tag) => season.themes.includes(tag)).length,
  }));
  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  return scored[0].e;
}
