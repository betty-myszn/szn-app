import type { SeasonInfo } from "@/lib/seasons";
import type { Goal, GoalCategory } from "@/lib/goals-store";

export type ChallengeCategory = GoalCategory | "general";

export interface ChallengeTemplate {
  id: string;
  text: string;
  category: ChallengeCategory;
  xp: number;
  hidden?: boolean; // stays a mystery card until the member unlocks it this szn
}

export interface SeasonChallengeSet {
  sign: string;
  challenges: ChallengeTemplate[];
}

// Each season's pool is tuned to that sign's vibe (see seasons.ts taglines/focus for the copy
// framing), tagged by goal category so the pool can be reordered around whatever the member is
// actually calling in, rather than showing everyone the identical list.
export const SEASON_CHALLENGES: Record<string, SeasonChallengeSet> = {
  Aries: {
    sign: "Aries",
    challenges: [
      { id: "start-before-ready", text: "start the thing before you feel ready.", category: "general", xp: 25 },
      { id: "launch-offer", text: "launch the offer you've been sitting on.", category: "business", xp: 35 },
      { id: "send-application", text: "apply for the opportunity that scares you a little.", category: "career", xp: 30 },
      { id: "make-the-ask", text: "ask them out, no overthinking the wording.", category: "love", xp: 25 },
      { id: "raise-the-price", text: "raise the price, and hold the line.", category: "money", xp: 30 },
      { id: "no-explaining", text: "say no without explaining yourself.", category: "confidence", xp: 20 },
      { id: "book-fast-decision", text: "make the decision you've been circling, today.", category: "purpose", xp: 20 },
      { id: "move-your-body", text: "move your body hard enough to feel it tomorrow.", category: "wellbeing", xp: 15 },
      { id: "claim-first", text: "be the first to speak up in the room.", category: "confidence", xp: 20 },
      { id: "hidden-aries", text: "do the thing you've told nobody you're scared of, today, with zero warm-up.", category: "general", xp: 50, hidden: true },
    ],
  },
  Taurus: {
    sign: "Taurus",
    challenges: [
      { id: "check-the-numbers", text: "check every account balance, no flinching.", category: "money", xp: 20 },
      { id: "ask-for-raise", text: "ask for the raise, rate or deal you actually want.", category: "money", xp: 30 },
      { id: "open-savings", text: "open the savings or investment account you keep putting off.", category: "money", xp: 25 },
      { id: "spend-on-pleasure", text: "spend on something expensive and good, on purpose.", category: "wellbeing", xp: 20 },
      { id: "slow-no", text: "say no to the rush, do it at your own pace instead.", category: "confidence", xp: 15 },
      { id: "finish-the-build", text: "finish the ninety-percent-done project.", category: "business", xp: 30 },
      { id: "claim-worth", text: "quote your price without an apologetic tone.", category: "business", xp: 25 },
      { id: "rest-on-purpose", text: "rest for a full day without justifying it to anyone.", category: "wellbeing", xp: 20 },
      { id: "commit-to-one", text: "commit to the one relationship, project or plan, fully.", category: "purpose", xp: 25 },
      { id: "hidden-taurus", text: "name the actual number you want to earn this year, out loud, to someone real.", category: "general", xp: 50, hidden: true },
    ],
  },
  Gemini: {
    sign: "Gemini",
    challenges: [
      { id: "post-the-video", text: "post the video.", category: "confidence", xp: 25 },
      { id: "introduce-yourself", text: "introduce yourself, first, before they do.", category: "general", xp: 15 },
      { id: "pitch-out-loud", text: "say the pitch out loud to a real person, today.", category: "business", xp: 25 },
      { id: "share-the-idea", text: "share the idea you've been sitting on, publicly.", category: "purpose", xp: 20 },
      { id: "message-first", text: "message the person you've been avoiding, first.", category: "love", xp: 20 },
      { id: "finish-one-thread", text: "finish the one conversation instead of starting three new ones.", category: "confidence", xp: 20 },
      { id: "ask-the-question", text: "ask the question you've been too self-conscious to ask.", category: "career", xp: 15 },
      { id: "tell-someone-plan", text: "tell someone what you're actually building, out loud.", category: "business", xp: 20 },
      { id: "commit-to-one-voice", text: "pick the one platform or voice and go all in on it this week.", category: "general", xp: 25 },
      { id: "hidden-gemini", text: "record yourself saying the thing you're scared to say, then send it, unedited.", category: "general", xp: 50, hidden: true },
    ],
  },
  Cancer: {
    sign: "Cancer",
    challenges: [
      { id: "name-the-need", text: "name what you need, directly, no hinting.", category: "love", xp: 20 },
      { id: "protect-energy", text: "cancel or renegotiate one thing quietly draining you.", category: "wellbeing", xp: 20 },
      { id: "say-no-peace", text: "say the true thing instead of keeping the peace.", category: "love", xp: 25 },
      { id: "rearrange-space", text: "rearrange one corner of your home to match who you're becoming.", category: "wellbeing", xp: 15 },
      { id: "choose-yourself", text: "choose yourself over the guilt, once, on purpose.", category: "confidence", xp: 25 },
      { id: "ask-for-help", text: "ask for the help you've been quietly doing without.", category: "general", xp: 15 },
      { id: "price-your-care", text: "charge for the emotional labour you've been giving away free.", category: "money", xp: 30 },
      { id: "undistracted-time", text: "spend real, phone-free time with someone who feels like home.", category: "love", xp: 15 },
      { id: "protect-the-vision", text: "protect one hour today from anyone else's agenda.", category: "purpose", xp: 20 },
      { id: "hidden-cancer", text: "tell someone the thing you've been protecting them from hearing.", category: "general", xp: 50, hidden: true },
    ],
  },
  Leo: {
    sign: "Leo",
    challenges: [
      { id: "post-the-video-leo", text: "post the video.", category: "confidence", xp: 25 },
      { id: "wear-the-outfit", text: "wear the outfit you've been saving for a day that never comes.", category: "confidence", xp: 20 },
      { id: "raise-the-price-leo", text: "raise the price, and hold the line without over-explaining it.", category: "money", xp: 30 },
      { id: "start-the-business", text: "start the businessssss.", category: "business", xp: 40 },
      { id: "ask-them-out-leo", text: "ask them out.", category: "love", xp: 25 },
      { id: "introduce-yourself-leo", text: "introduce yourself before they introduce themselves to you.", category: "general", xp: 15 },
      { id: "launch-the-offer-leo", text: "launch the offer.", category: "business", xp: 35 },
      { id: "book-the-trip", text: "book the trip.", category: "wellbeing", xp: 25 },
      { id: "say-no-leo", text: "say no without explaining yourself.", category: "confidence", xp: 20 },
      { id: "take-up-space", text: "take up space, physically, in the room, on purpose.", category: "confidence", xp: 15 },
      { id: "be-seen-first", text: "be seen before you feel ready.", category: "general", xp: 30 },
      { id: "claim-the-title", text: "publicly claim the reputation you actually want.", category: "purpose", xp: 25 },
      { id: "hidden-leo", text: "do the biggest version of the thing you've been shrinking down, today, no dress rehearsal.", category: "general", xp: 50, hidden: true },
    ],
  },
  Virgo: {
    sign: "Virgo",
    challenges: [
      { id: "ship-the-eighty", text: "ship the eighty percent version instead of waiting for perfect.", category: "business", xp: 30 },
      { id: "fix-the-system", text: "fix the one process that's been quietly costing you hours.", category: "career", xp: 20 },
      { id: "book-the-appointment", text: "book the appointment you've been putting off.", category: "wellbeing", xp: 15 },
      { id: "one-habit-upgrade", text: "upgrade one daily habit and actually do it today.", category: "wellbeing", xp: 15 },
      { id: "audit-and-cut", text: "cut one recurring cost that no longer earns its place.", category: "money", xp: 20 },
      { id: "finish-the-detail", text: "finish the detail you've been avoiding because it's boring, not hard.", category: "career", xp: 20 },
      { id: "raise-the-standard", text: "raise your own standard on one thing, quietly, starting today.", category: "confidence", xp: 20 },
      { id: "share-the-imperfect", text: "share the unfinished thing instead of hiding it until it's flawless.", category: "purpose", xp: 30 },
      { id: "clean-slate", text: "clear the one messy corner that's been draining your focus.", category: "general", xp: 15 },
      { id: "say-the-specific-thing", text: "tell them the specific thing you need instead of hoping they work it out.", category: "love", xp: 25 },
      { id: "hidden-virgo", text: "send the thing you've been quietly perfecting for weeks, exactly as it is right now.", category: "general", xp: 50, hidden: true },
    ],
  },
  Libra: {
    sign: "Libra",
    challenges: [
      { id: "state-preference-first", text: "state your actual opinion first, before you ask what everyone else thinks.", category: "confidence", xp: 20 },
      { id: "ask-them-out-libra", text: "ask them out.", category: "love", xp: 25 },
      { id: "raise-the-standard-libra", text: "raise the standard on what you'll accept in a relationship.", category: "love", xp: 25 },
      { id: "wear-the-outfit-libra", text: "wear the outfit that makes you feel expensive.", category: "confidence", xp: 15 },
      { id: "negotiate-the-deal", text: "negotiate instead of accepting the first offer.", category: "money", xp: 25 },
      { id: "make-the-fast-call", text: "make the decision quickly, trust your own taste.", category: "general", xp: 15 },
      { id: "say-the-hard-thing", text: "say the slightly uncomfortable true thing to someone close to you.", category: "love", xp: 25 },
      { id: "upgrade-your-space", text: "make one aesthetic upgrade to a space you spend real time in.", category: "wellbeing", xp: 15 },
      { id: "end-the-imbalance", text: "renegotiate or end the arrangement that's been quietly one-sided.", category: "love", xp: 30 },
      { id: "hidden-libra", text: "tell someone your actual, unfiltered opinion, the one you'd normally soften first.", category: "general", xp: 50, hidden: true },
    ],
  },
  Scorpio: {
    sign: "Scorpio",
    challenges: [
      { id: "let-them-see", text: "let someone see the unfinished, unhealed part of you.", category: "love", xp: 30 },
      { id: "name-the-fear", text: "name the fear you've been managing instead of facing.", category: "confidence", xp: 20 },
      { id: "release-control", text: "let go of control over one outcome this week, on purpose.", category: "general", xp: 25 },
      { id: "reclaim-power", text: "reclaim something you gave away in a past situation.", category: "purpose", xp: 30 },
      { id: "ask-the-real-question", text: "ask the question you actually want the answer to.", category: "love", xp: 20 },
      { id: "invest-in-depth", text: "put money toward the thing that actually transforms you, not the quick fix.", category: "money", xp: 25 },
      { id: "shadow-work-entry", text: "write the honest, unsent message, then decide who it's really for.", category: "confidence", xp: 15 },
      { id: "own-the-intensity", text: "stop diluting how you actually feel to make it easier for someone else.", category: "love", xp: 25 },
      { id: "sit-with-silence", text: "spend ten minutes today in total, phone-free silence.", category: "wellbeing", xp: 15 },
      { id: "hidden-scorpio", text: "tell one person the true reason behind the thing you usually explain away.", category: "general", xp: 50, hidden: true },
    ],
  },
  Sagittarius: {
    sign: "Sagittarius",
    challenges: [
      { id: "book-the-trip-sag", text: "book the trip.", category: "wellbeing", xp: 30 },
      { id: "think-bigger", text: "rewrite the goal at a size that scares the old you.", category: "purpose", xp: 25 },
      { id: "pitch-the-big-vision", text: "pitch the version of the plan you've been shrinking down.", category: "business", xp: 30 },
      { id: "finish-the-chase", text: "finish the thing instead of chasing the next exciting idea.", category: "career", xp: 25 },
      { id: "bet-on-yourself-public", text: "publicly commit to the goal you'd normally keep quiet.", category: "confidence", xp: 25 },
      { id: "say-yes-to-the-unknown", text: "say yes to the plan you don't have fully figured out yet.", category: "general", xp: 20 },
      { id: "expand-the-ask", text: "ask for more than feels comfortable, once.", category: "money", xp: 25 },
      { id: "learn-the-new-thing", text: "start the course, class or skill you've been meaning to.", category: "purpose", xp: 20 },
      { id: "widen-the-circle", text: "reach out to someone outside your usual circle.", category: "love", xp: 15 },
      { id: "hidden-sagittarius", text: "commit publicly to the big, unreasonable version of the goal, no hedging.", category: "general", xp: 50, hidden: true },
    ],
  },
  Capricorn: {
    sign: "Capricorn",
    challenges: [
      { id: "build-the-empire", text: "start the businessssss.", category: "business", xp: 40 },
      { id: "raise-the-price-cap", text: "raise the price, and hold the line without over-explaining it.", category: "money", xp: 30 },
      { id: "claim-authority", text: "claim the title or role you've earned but haven't said out loud.", category: "career", xp: 25 },
      { id: "structure-the-plan", text: "build the actual plan for the goal you've only been thinking about.", category: "purpose", xp: 20 },
      { id: "rest-without-earning", text: "rest on purpose, without justifying it with output first.", category: "wellbeing", xp: 20 },
      { id: "ask-for-the-deal", text: "ask for the raise, rate or partnership you actually want.", category: "money", xp: 30 },
      { id: "long-game-move", text: "make one move today that only pays off in six months.", category: "career", xp: 25 },
      { id: "own-the-win", text: "actually enjoy a success instead of moving straight to the next task.", category: "confidence", xp: 15 },
      { id: "delegate-one-thing", text: "hand off one thing you've been carrying alone.", category: "business", xp: 20 },
      { id: "hidden-capricorn", text: "take the whole day off, fully, with zero output, and don't apologise for it.", category: "general", xp: 50, hidden: true },
    ],
  },
  Aquarius: {
    sign: "Aquarius",
    challenges: [
      { id: "say-the-weird-idea", text: "say the unconventional idea out loud instead of pre-editing it.", category: "confidence", xp: 20 },
      { id: "post-the-different-thing", text: "post the thing that doesn't look like everyone else's.", category: "confidence", xp: 25 },
      { id: "launch-the-different-offer", text: "launch the offer nobody else in your space is doing.", category: "business", xp: 35 },
      { id: "join-the-room", text: "introduce yourself to a community or room outside your usual one.", category: "general", xp: 15 },
      { id: "stop-editing", text: "send the message exactly as you first wrote it, unedited.", category: "love", xp: 20 },
      { id: "back-the-vision", text: "put money or time behind the idea people don't get yet.", category: "purpose", xp: 25 },
      { id: "stand-alone", text: "make the unpopular decision because it's right, not because it's liked.", category: "confidence", xp: 25 },
      { id: "future-self-move", text: "do the thing your future self is already doing, today.", category: "purpose", xp: 20 },
      { id: "no-explaining-aqua", text: "say no without explaining yourself.", category: "confidence", xp: 20 },
      { id: "hidden-aquarius", text: "do the thing everyone said was too strange, publicly, without a disclaimer.", category: "general", xp: 50, hidden: true },
    ],
  },
  Pisces: {
    sign: "Pisces",
    challenges: [
      { id: "trust-the-nudge", text: "act on the intuitive hit before the logical mind talks you out of it.", category: "purpose", xp: 25 },
      { id: "share-the-vision", text: "share the intuitive hit you've been sitting on with someone who'll actually hear it.", category: "love", xp: 20 },
      { id: "make-something", text: "try the creative thing you've been too self-conscious to start.", category: "confidence", xp: 20 },
      { id: "move-without-proof", text: "commit to the decision before you have full certainty.", category: "general", xp: 25 },
      { id: "protect-the-dream", text: "tell one person the actual dream, not the safe, smaller version.", category: "purpose", xp: 25 },
      { id: "soft-boundary", text: "say no gently but fully, no over-explaining.", category: "confidence", xp: 15 },
      { id: "creative-launch", text: "publish or share the creative work you've been sitting on.", category: "business", xp: 30 },
      { id: "rest-as-devotion", text: "treat rest as sacred today, not a reward you have to earn.", category: "wellbeing", xp: 15 },
      { id: "receive-openly", text: "let someone help, compliment or give to you without deflecting it.", category: "love", xp: 15 },
      { id: "hidden-pisces", text: "act on the vision fully, today, before you talk yourself back into waiting for proof.", category: "general", xp: 50, hidden: true },
    ],
  },
};

// Hidden challenges only reveal themselves once the member has proven momentum this szn.
export const HIDDEN_UNLOCK_THRESHOLD = 5;

// Prioritises whatever matches the member's active goal category, so two people in the same
// zodiac season see the same pool but in a different order, personalised to what they're
// actually calling in. Falls back to the full pool, unordered, when there's no goal yet.
export function getPersonalisedChallenges(season: SeasonInfo, goal?: Goal | null): ChallengeTemplate[] {
  const set = SEASON_CHALLENGES[season.sign] || SEASON_CHALLENGES.Leo;
  if (!goal) return set.challenges;

  const scored = set.challenges.map((c, i) => ({
    c,
    i,
    score: c.category === goal.category ? 2 : c.category === "general" ? 1 : 0,
  }));
  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  return scored.map((s) => s.c);
}

// --- Levels ------------------------------------------------------------------------

export interface LevelInfo {
  title: string;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

const LEVEL_TITLES: { minXp: number; title: string }[] = [
  { minXp: 0, title: "just getting started" },
  { minXp: 100, title: "showing up" },
  { minXp: 250, title: "building momentum" },
  { minXp: 500, title: "unbothered" },
  { minXp: 900, title: "certified iconic" },
  { minXp: 1500, title: "she who cannot be stopped" },
  { minXp: 2500, title: "main character, permanently" },
];

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 0;
  for (let i = 0; i < LEVEL_TITLES.length; i++) {
    if (totalXp >= LEVEL_TITLES[i].minXp) level = i;
  }
  const current = LEVEL_TITLES[level];
  const next = LEVEL_TITLES[level + 1];
  return {
    title: current.title,
    level: level + 1,
    xpIntoLevel: totalXp - current.minXp,
    xpForNextLevel: next ? next.minXp - current.minXp : 0,
  };
}

// --- Category labels for challenge chips --------------------------------------------

export const CATEGORY_CHIP_LABEL: Record<ChallengeCategory, string> = {
  career: "career",
  business: "business",
  purpose: "purpose",
  money: "money",
  love: "love",
  confidence: "confidence",
  wellbeing: "wellbeing",
  general: "for everyone",
};

export type { GoalCategory };

// --- Surprise affirmations ------------------------------------------------------------

// A small dopamine hit shown alongside the XP burst on every completion, distinct from the
// season's own affirmation (seasons.ts), these are reactions to the act of doing the thing.
const SURPRISE_AFFIRMATIONS: string[] = [
  "that's evidence, not luck.",
  "she really just did that.",
  "certified iconic behaviour.",
  "the woman you're becoming just got louder.",
  "proof, not potential.",
  "look at you, doing the actual thing.",
  "future you says thank you.",
  "that fear didn't stand a chance today.",
  "receipts collected.",
  "main character move, noted.",
  "this is what becoming her actually looks like.",
  "small action, real momentum.",
];

export function pickSurpriseAffirmation(): string {
  return SURPRISE_AFFIRMATIONS[Math.floor(Math.random() * SURPRISE_AFFIRMATIONS.length)];
}
