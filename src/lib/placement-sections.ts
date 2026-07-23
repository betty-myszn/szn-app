import type { ChartData } from "@/types/chart";
import {
  SIGN_TRAITS,
  SIGN_OVERVIEWS,
  HOUSE_MEANINGS,
  BODY_MEANINGS,
  ordinalHouse,
  findRootBlock,
  type SignTraits,
} from "@/lib/interpretations";

export type SectionKey = "gifts" | "shadow" | "confidence" | "career" | "money" | "relationships" | "growth";

// Bare nouns, deliberately, so every template can safely prefix "my " or "your " without
// producing a duplicate possessive ("my your gifts").
export const SECTION_LABELS: Record<SectionKey, { label: string; emoji: string }> = {
  gifts: { label: "gifts", emoji: "\u{1F381}" },
  shadow: { label: "shadow", emoji: "\u{1F311}" },
  confidence: { label: "confidence", emoji: "✨" },
  career: { label: "career", emoji: "\u{1F4BC}" },
  money: { label: "money", emoji: "\u{1F4B0}" },
  relationships: { label: "relationships", emoji: "❤" },
  growth: { label: "personal growth", emoji: "\u{1F331}" },
};

interface SectionContent {
  traitField: keyof SignTraits;
  // Each SIGN_TRAITS field has its own grammatical shape (some are noun phrases, some are
  // full clauses starting with "you..."), so the chart-tie-in sentence needs a matching frame
  // rather than one generic template, or the clause-style fields produce broken grammar.
  chartFrame: (bodyLower: string, signLower: string, traitLine: string) => string;
  bettysTakeGeneric: string;
  protocolTitle: string;
  protocolPool: string[]; // pick 5, seeded
  stretchMoves: string[]; // pick 1, seeded
  proofMarkers: string[]; // pick 3, seeded
  shiftBefore: string;
  shiftAfter: string;
}

const SECTION_CONTENT: Record<SectionKey, SectionContent> = {
  gifts: {
    traitField: "gift",
    chartFrame: (b, s, t) => `Your ${s} ${b} hands you a specific gift here: ${t}.`,
    bettysTakeGeneric: "The gifts section is the one people skim past fastest, because it feels too easy to be valuable. If it comes naturally to you, you assume it must come naturally to everyone. It doesn't. The thing you do without trying is usually the exact thing someone else is paying good money to learn.",
    protocolTitle: "the 5-day gift audit",
    protocolPool: [
      "write down one compliment you've received more than three times in your life, and take it seriously as data instead of brushing it off",
      "do the thing that comes easily to you in front of someone whose opinion matters this week, and notice how little effort it actually took",
      "stop giving away for free something you've been quietly undercharging for, because it doesn't feel like real work",
      "explain how you do this gift to someone else this week, teaching it out loud will make you believe it's real",
      "list three moments this year this gift quietly saved the day, and notice the pattern forming",
      "say 'thank you, I know' the next time someone compliments this in you, instead of deflecting it automatically",
      "put this gift in writing somewhere public this week, a bio line, a post, an introduction",
    ],
    stretchMoves: [
      "build one offer, pitch or project explicitly around this gift instead of around what you think you 'should' be good at",
      "ask to be introduced as the person who does this specific thing",
      "turn this gift into an actual line item on your CV, website or invoice",
    ],
    proofMarkers: [
      "you stop saying 'it's not a big deal' when someone compliments this",
      "you start charging what it's actually worth",
      "you notice yourself using it more often, on purpose, not by accident",
      "someone asks how you do it and you can actually explain it instead of shrugging",
    ],
    shiftBefore: "If it's this easy for me, it can't be that valuable.",
    shiftAfter: "Ease is not the opposite of value, it's often the clearest sign of it.",
  },
  shadow: {
    traitField: "shadow",
    chartFrame: (b, s, t) => `The shadow side of your ${s} ${b} is ${t}.`,
    bettysTakeGeneric: "I never coach clients to eliminate their shadow, that's not how any of this works. You catch it faster, you name it sooner, and eventually it costs you less every time it shows up. That's the whole game. Trying to delete it just drives it underground where you can't see it coming.",
    protocolTitle: "the 5-day shadow tracker",
    protocolPool: [
      "catch this pattern once today, in the moment, and just name it silently to yourself, don't try to stop it yet, only notice it",
      "ask someone close to you if they've noticed this pattern in you, and actually listen to the answer without defending yourself",
      "write down the earliest memory you have of this pattern showing up",
      "notice what specifically triggers it this week, stress, tiredness, a certain person, a certain type of situation",
      "the next time it shows up, pause for three seconds before reacting, that's the entire practice, nothing more",
      "forgive yourself out loud for the last time this pattern cost you something",
      "tell one trusted person 'this is a pattern I'm working on' instead of hiding it",
    ],
    stretchMoves: [
      "do the opposite of this pattern once, deliberately, even if it feels unnatural",
      "apologise to someone this pattern affected, if it's genuinely warranted",
      "set up one small system or boundary that makes this pattern harder to fall into by default",
    ],
    proofMarkers: [
      "you catch it in the moment instead of realising it a week later",
      "you can name it out loud without shame creeping in",
      "someone close to you notices you handling it differently",
      "the pattern still shows up, but it costs you less each time",
    ],
    shiftBefore: "This part of me is a flaw I need to hide or fix.",
    shiftAfter: "This part of me is a pattern I'm learning to catch faster, that's the whole job.",
  },
  confidence: {
    traitField: "confidence",
    chartFrame: (b, s, t) => `For your ${s} ${b}, ${t}.`,
    bettysTakeGeneric: "I see this pattern constantly. Women think they need more confidence before they act. Your chart says the opposite. Confidence is built after the evidence, not before it. Waiting to feel ready is the single most expensive habit I coach out of people.",
    protocolTitle: "the 5-day confidence rep",
    protocolPool: [
      "do one small version of the scary thing today, the email, the ask, the introduction, before you feel ready",
      "stand differently for two minutes before something that makes you nervous, shoulders back, uncrossed arms, your body convinces your brain first",
      "accept a compliment today without deflecting it, just say thank you and let it land",
      "keep a running note titled 'proof' and add one small win to it today",
      "say the true, slightly bold thing out loud instead of the safe, watered-down version",
      "notice one moment you shrink today, and take up the space anyway, just once",
      "do the thing you've rehearsed in your head for weeks, imperfectly, this week",
    ],
    stretchMoves: [
      "walk into the room, meeting or event you've been avoiding, and stay for the whole thing",
      "record yourself talking about your work for 60 seconds and actually watch it back",
      "wear, say or do the thing you've decided is 'too much', on purpose, this week",
    ],
    proofMarkers: [
      "you catch yourself before you shrink, and choose not to",
      "a compliment lands as fact instead of something to argue with",
      "you do the scary thing and the fear shows up smaller than it used to",
      "you stop waiting to feel ready before you start",
    ],
    shiftBefore: "I'll do it once I feel confident enough.",
    shiftAfter: "I build confidence by doing it while the doubt is still in the room.",
  },
  career: {
    traitField: "career",
    chartFrame: (b, s, t) => `Through your ${s} ${b}, ${t}.`,
    bettysTakeGeneric: "Every ambitious woman I've coached hits the same wall eventually, she's outgrown the strategy that got her here but keeps using it anyway, because it's familiar. If your career feels capped right now, it's rarely the market. It's usually a strategy that was right for an earlier version of you.",
    protocolTitle: "the 5-day career alignment",
    protocolPool: [
      "write down the one project that would move your career most if you actually finished it, nothing else this week",
      "spend 90 protected minutes on that project only, phone away, treated like a client meeting",
      "send the pitch, application or proposal you've been sitting on, even an imperfect draft beats a perfect one that never sends",
      "tell one person in your field exactly what you're building, out loud, and ask for one specific piece of help",
      "say no to one task this week that doesn't actually move your career forward",
      "update your bio, CV or profile to reflect who you're becoming, not who you were two years ago",
      "ask for feedback from someone whose opinion you respect, and actually use it",
    ],
    stretchMoves: [
      "apply, pitch or launch the thing you've been 'almost ready' for, on a real date you commit to this week",
      "have the direct conversation about pay, promotion or partnership you've been avoiding",
      "publicly claim the expertise you've been quietly downplaying, one post, one bio line, one introduction",
    ],
    proofMarkers: [
      "you finish the project you named instead of starting three new ones",
      "an ask or pitch goes out that used to sit in drafts for weeks",
      "you notice yourself negotiating instead of accepting the first offer",
      "your work starts attracting the kind of opportunities you actually want",
    ],
    shiftBefore: "I need permission or perfect conditions before I make the move.",
    shiftAfter: "I create the conditions by moving, the permission I'm waiting for is mine to give.",
  },
  money: {
    traitField: "money",
    chartFrame: (b, s, t) => `Money-wise, your ${s} ${b} means ${t}.`,
    bettysTakeGeneric: "In twenty years I've never met a woman whose money blocks were actually about maths. They're about worth, dressed up as budgeting. Before you touch another spreadsheet, answer this honestly: what would you have to believe about yourself to charge what you're actually worth without the apologetic tone attached?",
    protocolTitle: "the 5-day money move",
    protocolPool: [
      "check every account balance today, no avoiding it, write the real total down in one place",
      "name the actual number you want to earn this year, specific, not vague, somewhere you'll see it daily",
      "raise one price, rate or ask by 10% this week and hold the line without over-explaining it",
      "cancel or renegotiate one recurring cost that's been quietly draining you",
      "spend on one thing today that feels expensive and good, on purpose, and notice the guilt without obeying it",
      "name one income stream you could grow or start, and take one concrete step, a pitch, a listing, a rate card",
      "state a price out loud today without softening it with a nervous laugh afterwards",
    ],
    stretchMoves: [
      "ask for the raise, the higher rate or the better deal you've been putting off",
      "set up the savings or investment account you've been meaning to open",
      "have the money conversation you've been avoiding, with a partner, client or family member",
    ],
    proofMarkers: [
      "you check your balance without dread, or check it at all when you used to avoid it",
      "you state a price without an apologetic tone attached",
      "money moves that used to feel impossible start feeling merely uncomfortable",
      "you notice yourself receiving instead of deflecting when money comes in",
    ],
    shiftBefore: "Money is complicated, I'll deal with it when things feel more stable.",
    shiftAfter: "Clarity creates stability, I look at the numbers because avoiding them is what keeps me stuck.",
  },
  relationships: {
    traitField: "love",
    chartFrame: (b, s, t) => `In relationships, your ${s} ${b} means ${t}.`,
    bettysTakeGeneric: "The women I coach with the strongest relationship standards on paper are often the ones who struggle most to actually enforce them in the room. A standard you won't say out loud isn't a standard, it's a private opinion. The work is becoming someone who says the true thing in real time, not someone with better taste in people.",
    protocolTitle: "the 5-day connection practice",
    protocolPool: [
      "notice one moment today where you agree to something you don't actually want, and name it to yourself, even if you don't change it yet",
      "say one true, slightly uncomfortable thing to someone close to you today",
      "ask for something you need directly, no hinting, no over-explaining, just the ask",
      "spend real, undistracted time with someone who feels like home, not a group chat reply, actual presence",
      "say no to one thing that doesn't serve you, and notice the relationship survives it anyway",
      "tell someone what you appreciate about them, specifically, before the moment passes",
      "notice a pattern you keep repeating in relationships, and name it to yourself honestly",
    ],
    stretchMoves: [
      "send the honest message you've been drafting in your head, to the person it's actually for",
      "end or seriously renegotiate the terms of a relationship that's been quietly costing you",
      "tell someone exactly what you need from them, without softening it into a suggestion",
    ],
    proofMarkers: [
      "you say no without the three-paragraph justification that used to follow it",
      "a hard conversation happens and the relationship gets stronger instead of ending",
      "you notice yourself asking for what you want before you've talked yourself out of it",
      "you feel more like yourself in your closest relationships, not less",
    ],
    shiftBefore: "I need to earn love by being easy, agreeable or endlessly available.",
    shiftAfter: "I am allowed to take up space in my relationships, the right people stay for the real me.",
  },
  growth: {
    traitField: "growth",
    chartFrame: (b, s, t) => `Your ${s} ${b} growth edge is ${t}.`,
    bettysTakeGeneric: "Growth edges get treated like homework, something to feel guilty about not doing yet. I coach mine differently. Your growth edge isn't a deficiency, it's the exact direction your whole chart is quietly pointing you. Resistance to it isn't proof you're on the wrong path, it's usually proof you're close.",
    protocolTitle: "the 5-day growth edge",
    protocolPool: [
      "name the exact thing you're avoiding growing into, write it down in one honest sentence",
      "do one small, uncomfortable version of that growth today, however imperfect",
      "ask yourself what you'd do differently this week if you'd already grown past this",
      "notice one moment today you default to the old, comfortable pattern, and choose the stretch instead, once",
      "read, watch or listen to something that challenges how small you've been thinking about this",
      "tell one person what you're actually working on growing, out loud",
      "write down one piece of evidence from this week that you're already becoming this",
    ],
    stretchMoves: [
      "do the thing that requires the growth you've been avoiding, this week, once, imperfectly",
      "ask for feedback specifically on this growth edge from someone who'll be honest with you",
      "make one decision this week the way the grown version of you would make it",
    ],
    proofMarkers: [
      "the resistance is still there, but it's quieter, and you move through it faster",
      "you catch yourself defaulting to the old pattern and correct course sooner",
      "someone notices you handling something differently than you used to",
      "the growth edge starts to feel like an edge you're on, not a wall you're stuck behind",
    ],
    shiftBefore: "I'll grow into this once it feels less uncomfortable.",
    shiftAfter: "The discomfort is the growth happening, not a sign to wait.",
  },
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function pickMany<T>(arr: T[], seed: number, count: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < count && i < arr.length; i++) {
    out.push(arr[(seed + i) % arr.length]);
  }
  return out;
}

function seedFrom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

export interface SectionDeepDive {
  bodyName: string;
  sectionLabel: string;
  emoji: string;
  sign: string;
  house?: number;
  headline: string;
  whatThisIsAbout: string;
  planetMeaning: string;
  signMeaning: string;
  houseMeaning?: { title: string; text: string; naturalSign: string };
  inYourChart: string;
  bettysTake: string;
  rootPattern: string;
  shiftBefore: string;
  shiftAfter: string;
  protocolTitle: string;
  protocolDays: string[];
  stretchMove: string;
  proofMarkers: string[];
  journalPrompt: string;
  affirmation: string;
}

export function composeSectionDeepDive(
  bodyId: string,
  sectionKey: SectionKey,
  sign: string,
  house: number | undefined,
  chart: ChartData
): SectionDeepDive | null {
  const body = BODY_MEANINGS.find((b) => b.id === bodyId);
  const traits = SIGN_TRAITS[sign];
  const overview = SIGN_OVERVIEWS[sign];
  const content = SECTION_CONTENT[sectionKey];
  const meta = SECTION_LABELS[sectionKey];
  if (!body || !traits || !content) return null;

  const bodyLower = body.name.toLowerCase();
  const signLower = sign.toLowerCase();
  const houseMeaning = house ? HOUSE_MEANINGS[house - 1] : undefined;
  const traitText = traits[content.traitField];
  const traitLine = Array.isArray(traitText) ? traitText.join(", ") : traitText;

  const signMeaning = overview
    ? `${overview.archetype} That's ${signLower} on its own, independent of which planet is expressing it here, an element (${overview.element}), a modality (${overview.modality}) and a ruling planet (${overview.ruler}) that together give it this specific texture.`
    : "";

  const seed = seedFrom(`${bodyId}-${sectionKey}-${sign}-${chart.birthData.name || ""}`);
  const protocolDays = pickMany(content.protocolPool, seed, 5);
  const stretchMove = pick(content.stretchMoves, seed + 3);
  const proofMarkers = pickMany(content.proofMarkers, seed + 1, 3);

  const houseLine = houseMeaning
    ? ` It also sits in your ${ordinalHouse(house!)} house of ${houseMeaning.title}, ${houseMeaning.rules}, so this plays out most visibly through ${houseMeaning.lifeAreas.slice(0, 2).join(" and ")}.`
    : "";

  const inYourChart = `${content.chartFrame(bodyLower, signLower, traitLine)}${houseLine} That's not generic sign advice, that's what your chart specifically hands you here.`;

  const bettysTake = `${content.bettysTakeGeneric} With your ${signLower} ${bodyLower}, that plays out through ${traits.essence}, so expect this section of your chart to move at that pace and in that flavour, not anyone else's version of it.`;

  const rootPattern = findRootBlock(chart, bodyId, sign);

  const journalPrompt = `Where in my ${meta.label} am I still living from the old belief, "${content.shiftBefore}"? What's one piece of evidence I could create this week for the new one instead?`;

  const affirmation = `My ${signLower} ${bodyLower} makes me ${traits.flavour.slice(0, 2).join(" and ")}, and that's exactly the energy I bring to my ${meta.label}.`;

  return {
    bodyName: body.name,
    sectionLabel: meta.label,
    emoji: meta.emoji,
    sign,
    house,
    headline: `${meta.label}, decoded through your ${signLower} ${bodyLower}.`,
    whatThisIsAbout: `${body.intro} This page goes deep specifically on ${meta.label}, not a summary, an actual plan.`,
    planetMeaning: body.deepDive,
    signMeaning,
    houseMeaning: houseMeaning
      ? { title: houseMeaning.title, text: houseMeaning.deepDive, naturalSign: houseMeaning.naturalSign }
      : undefined,
    inYourChart,
    bettysTake,
    rootPattern,
    shiftBefore: content.shiftBefore,
    shiftAfter: content.shiftAfter,
    protocolTitle: content.protocolTitle,
    protocolDays,
    stretchMove,
    proofMarkers,
    journalPrompt,
    affirmation,
  };
}
