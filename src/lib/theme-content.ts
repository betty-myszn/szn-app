import type { ChartData } from "@/types/chart";
import { SIGN_TRAITS, BODY_MEANINGS, HOUSE_MEANINGS, ordinalHouse, houseForSign, composeSeasonPlacement } from "@/lib/interpretations";

// Each season theme maps to a base meaning + a natal body it's read through.
// The page then personalises it with the member's chart (their sign for that body)
// and the house the current season activates, so every theme reads differently for
// every person and every season.
interface ThemeEntry {
  meaning: string;
  related: string; // body id used to personalise
  coach: string;
}

export const THEME_CONTENT: Record<string, ThemeEntry> = {
  courage: { related: "mars", meaning: "Courage is not the absence of fear, it's moving while the fear is still in the room. This theme is about backing yourself before you feel ready and letting action build the belief.", coach: "The bravest thing you can do this szn is start small and start now. Courage compounds." },
  initiation: { related: "mars", meaning: "Initiation is the art of the first move, the launch, the pitch, the opening line. This theme hands you permission to begin the thing you keep circling.", coach: "You don't need the whole staircase, only the first step. Take it visibly." },
  "self-trust": { related: "sun", meaning: "Self-trust is the quiet certainty that you'll have your own back no matter what. This theme is about keeping the promises you make to yourself until believing in you becomes automatic.", coach: "Every time you follow through on a small promise to yourself, your self-trust grows. Stack the wins." },
  action: { related: "mars", meaning: "Action is where dreaming ends and becoming begins. This theme is about closing the gap between what you think about and what you actually do.", coach: "Momentum beats motivation. One imperfect action this week will teach you more than a month of planning." },
  worth: { related: "venus", meaning: "Worth is the number you secretly believe you deserve, and it quietly sets everything: your prices, your standards, your relationships. This theme raises that number.", coach: "Your self-worth sets your net worth. Decide you're worth more, then act like the woman who already knows it." },
  pleasure: { related: "venus", meaning: "Pleasure is not a reward you earn after the work, it's a source of power. This theme is about letting joy, beauty and sensation back into your everyday life.", coach: "What lights you up is a compass, not a distraction. Follow the pleasure and watch your life get richer." },
  money: { related: "jupiter", meaning: "Money is stored energy and stored choices. This theme is about your relationship with receiving, and clearing whatever caps how much you let in.", coach: "Money follows value and visibility. Name your worth out loud and let the abundance catch up to you." },
  consistency: { related: "saturn", meaning: "Consistency is the advanced version of courage, the willingness to keep showing up long after the excitement fades. This theme is where your quiet discipline becomes your superpower.", coach: "You don't rise to your goals, you fall to your systems. Build the boring routine that carries you." },
  voice: { related: "mercury", meaning: "Your voice is how your inner world reaches the outer one. This theme is about being heard, saying the thing, and letting your words take up space.", coach: "Your ideas are only valuable once they leave your head. Say it, post it, send it." },
  curiosity: { related: "mercury", meaning: "Curiosity is the engine of your growth, the willingness to ask, explore and stay interested. This theme keeps your mind hungry and your life expanding.", coach: "Follow the question that won't leave you alone. Curiosity always leads somewhere worth going." },
  connection: { related: "venus", meaning: "Connection is the art of letting people in and being genuinely met. This theme is about the relationships that make your life feel full.", coach: "The right people can only find you when you're visible as your real self. Reach out first." },
  ideas: { related: "mercury", meaning: "Ideas are your currency, the sparks that could become your whole next chapter. This theme is about capturing them and backing the good ones.", coach: "The idea that keeps returning is not random. Write it down and give it a chance to become real." },
  intuition: { related: "moon", meaning: "Intuition is the knowing that arrives before the logic, your inner compass speaking in feelings, nudges and gut certainty. This theme is about trusting it more than your doubt.", coach: "Your intuition is more accurate than your anxiety. When you feel it clearly, act on it before you talk yourself out of it." },
  home: { related: "moon", meaning: "Home is your emotional base, the place and the feeling you return to for safety. This theme is about tending your inner world and the space you live inside.", coach: "When your foundation feels solid, you can risk more everywhere else. Build the safe place first." },
  "emotional depth": { related: "moon", meaning: "Emotional depth is your capacity to feel fully instead of skimming the surface. This theme is about treating your feelings as information rather than inconvenience.", coach: "Feeling deeply is data, not weakness. What you let yourself feel, you get to heal." },
  "self-care": { related: "moon", meaning: "Self-care is not bubble baths, it's the ongoing practice of treating yourself like someone worth looking after. This theme is about meeting your own needs on purpose.", coach: "You can't pour from an empty cup, and you were never meant to. Protect your energy like the asset it is." },
  visibility: { related: "sun", meaning: "Visibility is the willingness to be seen fully, not the edited version. This theme is your invitation to stop hiding the parts of you that were always meant to be seen.", coach: "You weren't born to be the best kept secret. Let them see you, the real response will surprise you." },
  confidence: { related: "sun", meaning: "Confidence is not something you wait to feel, it's something you build through action. This theme is about becoming the woman who walks into every room knowing she belongs.", coach: "Confidence arrives after the action, never before it. Do the brave thing first and let the feeling follow." },
  "self-expression": { related: "sun", meaning: "Self-expression is you, turned all the way up, in how you create, dress, speak and show up. This theme is about being unapologetically yourself in public.", coach: "The world doesn't need a watered-down you. Express the full version and let it be too much for the wrong people." },
  magnetism: { related: "venus", meaning: "Magnetism is what happens when you stop chasing and start radiating. This theme is about becoming the kind of presence people are drawn to without effort.", coach: "You don't attract what you want, you attract who you are. Become her and watch what comes toward you." },
  routines: { related: "saturn", meaning: "Routines are the small repeated choices that quietly decide your future. This theme is about the daily rituals that build the life you want on autopilot.", coach: "Your habits are votes for the woman you're becoming. Cast them in her favour, one day at a time." },
  wellness: { related: "moon", meaning: "Wellness is the foundation everything else is built on, your body, your energy, your nervous system. This theme is about feeling well enough to want more.", coach: "A sustainable glow-up needs rest built in. Treat your wellbeing as the strategy, not the afterthought." },
  refinement: { related: "mercury", meaning: "Refinement is the glow-up in the details, taking what already exists and making it excellent. This theme is about raising your standards and polishing what matters.", coach: "You don't need a whole new life, you need to refine the one you've got. Perfect one detail at a time." },
  devotion: { related: "venus", meaning: "Devotion is love in action, the daily choice to keep showing up for what and who matters. This theme is about pouring yourself into the things worth it.", coach: "Devotion is a decision you make again every day. Choose what deserves yours and give it fully." },
  relationships: { related: "venus", meaning: "Relationships are the mirrors that show you who you are and who you're becoming. This theme is about the connections that shape your life, and choosing them well.", coach: "You attract at the level you believe you deserve. Raise the standard and let the right people rise to it." },
  beauty: { related: "venus", meaning: "Beauty is not vanity, it's the practice of surrounding yourself with what feels gorgeous to live inside. This theme is about your eye, your aesthetic, your world.", coach: "When your space and your style feel beautiful, your whole nervous system settles. Curate on purpose." },
  balance: { related: "venus", meaning: "Balance is the art of the both/and, holding your ambition and your rest, your softness and your standards. This theme is about the equilibrium that keeps you sustainable.", coach: "Balance is not doing everything equally, it's knowing what needs you most right now. Choose consciously." },
  harmony: { related: "venus", meaning: "Harmony is the felt sense of things being in tune, in your relationships, your spaces, your inner world. This theme is about smoothing what's been jarring.", coach: "You are allowed to choose peace over being right. Protect your harmony like it's precious, because it is." },
  transformation: { related: "pluto", meaning: "Transformation is the szn of shedding a version of yourself you've outgrown. This theme is about the rebirth that only happens when you let the old you go.", coach: "You've survived every transformation so far, that's your proof. Let this one remake you." },
  "shadow work": { related: "pluto", meaning: "Shadow work is the practice of facing the parts of yourself you usually avoid, the fears, the patterns, the reclaimed power. This theme is where the real glow-up lives.", coach: "What you avoid controls you, what you face frees you. The pattern loses power the moment you name it." },
  power: { related: "pluto", meaning: "Power is the energy you've been giving away, and this theme is about reclaiming it. Not power over others, power over your own choices and reactions.", coach: "Take back the power you handed to old fears and other people's opinions. It was always yours to hold." },
  intimacy: { related: "pluto", meaning: "Intimacy is the courage to be fully known, unedited and unhidden. This theme is about letting someone close enough to love the real you.", coach: "Intimacy is built mid-process, not after you've healed. Let yourself be seen before you feel ready." },
  expansion: { related: "jupiter", meaning: "Expansion is your life getting bigger, more possibility, more room, more you. This theme is about thinking past the limits you've been living inside.", coach: "The size of your dream should scare the old you. Let yourself want more than feels reasonable." },
  vision: { related: "jupiter", meaning: "Vision is your ability to see what could be before there's any proof. This theme is about getting clear on the bigger picture and betting on it.", coach: "Your imagination is showing you a preview, not a fantasy. Get specific about the vision and move toward it." },
  freedom: { related: "uranus", meaning: "Freedom is the room to be fully yourself and live on your own terms. This theme is about loosening whatever's been holding you smaller than you want to be.", coach: "Freedom is a practice, not a destination. Reclaim one small piece of it this szn." },
  optimism: { related: "jupiter", meaning: "Optimism is not naive, it's the practical choice to expect good things and act accordingly. This theme is about keeping the faith that expands you.", coach: "You find what you look for. Train your eye on the possibility and the opportunities start appearing." },
  ambition: { related: "saturn", meaning: "Ambition is the honest admission that you want more, and there's nothing wrong with that. This theme is about owning your hunger and building toward it.", coach: "Your ambition is not too much, it's a compass. Let it point you at the life you actually want." },
  discipline: { related: "saturn", meaning: "Discipline is self-love with a plan, the structure that carries you when motivation runs out. This theme is about building the backbone under your dreams.", coach: "Discipline is choosing what you want most over what you want now. Future you is counting on it." },
  legacy: { related: "saturn", meaning: "Legacy is what your name gets attached to, the mark you're here to leave. This theme is about building something that outlasts the moment.", coach: "Play the long game. What you build this szn with patience becomes the thing you're known for." },
  mastery: { related: "saturn", meaning: "Mastery is the deep competence that comes from doing the reps, and this theme is about committing to your craft. Every expert was once a beginner who kept going.", coach: "Mastery is boring on purpose, it's the same practice, done with devotion. Fall in love with the reps." },
  authenticity: { related: "uranus", meaning: "Authenticity is the moment you stop editing your weirdness and become magnetic. This theme is about being unapologetically, originally you.", coach: "Fitting in was never your assignment. The parts of you that don't fit the mould are exactly your genius." },
  innovation: { related: "uranus", meaning: "Innovation is your ability to see what's coming and do it differently. This theme is about trusting the ideas that feel too strange to be right.", coach: "The ideas that seem too far ahead are usually your goldmine. Build the future version early." },
  community: { related: "uranus", meaning: "Community is your people, the ones who get it and grow alongside you. This theme is about finding, building and showing up for your circle.", coach: "Your network genuinely is your net worth. Show up in community like you belong there, because you do." },
  dreams: { related: "neptune", meaning: "Dreams are the visions your imagination keeps handing you, and this theme is about taking them seriously. What you can imagine, you can move toward.", coach: "Your dreams are instructions, not distractions. Trust the vision before there's evidence for it." },
  surrender: { related: "neptune", meaning: "Surrender is not giving up, it's releasing the grip that's been exhausting you. This theme is about trusting the process and letting go of what you can't control.", coach: "Some things open only when you stop forcing them. Loosen your grip and let life meet you halfway." },
  creativity: { related: "neptune", meaning: "Creativity is your channel for making something from nothing, and this theme is about opening it. You are more imaginative than you let yourself be.", coach: "Creativity is a muscle, not a mood. Make something imperfect this szn and let the magic move through you." },
};

export function themeSlug(theme: string): string {
  return theme.toLowerCase().replace(/\s+/g, "-");
}

function signForBody(chart: ChartData, bodyId: string): string {
  if (bodyId === "rising") return chart.houses[0]?.sign || "Aries";
  if (bodyId === "midheaven") return chart.houses[9]?.sign || "Capricorn";
  return chart.planets.find((p) => p.id === bodyId)?.sign || "Leo";
}

export interface ThemeReading {
  title: string;
  meaning: string;
  inYourChart: string;
  yourGift: string;
  yourChallenge: string;
  howToWorkIt: string;
  prompt: string;
  affirmation: string;
  relatedBodyId: string;
  relatedSign: string;
}

export function composeTheme(
  slug: string,
  chart: ChartData,
  seasonSign: string
): ThemeReading | null {
  // The theme link is built from season.themes with spaces turned into hyphens (SeasonExplore.tsx),
  // but a couple of THEME_CONTENT keys are genuine multi-word phrases stored with a real space
  // ("emotional depth", "shadow work"), so a direct hyphen-key lookup misses them, fall back to
  // the space form before giving up.
  const entry = THEME_CONTENT[slug] || THEME_CONTENT[slug.replace(/-/g, " ")];
  if (!entry) return null;

  const sign = signForBody(chart, entry.related);
  const traits = SIGN_TRAITS[sign] || SIGN_TRAITS.Leo;
  const body = BODY_MEANINGS.find((b) => b.id === entry.related);
  const bodyName = body?.name.toLowerCase() || entry.related;
  const bodyTitle = body?.title || "";

  const cusps = chart.houses.map((h) => h.longitude);
  const activatedHouse = houseForSign(seasonSign, cusps);
  const seasonPlacement = composeSeasonPlacement(seasonSign, cusps);
  const houseMeaning = HOUSE_MEANINGS[activatedHouse - 1];
  const titleWord = slug.replace(/-/g, " ");

  return {
    title: titleWord,
    meaning: entry.meaning,
    inYourChart: `This ${seasonSign.toLowerCase()} szn is lighting up your ${ordinalHouse(activatedHouse)} house of ${houseMeaning.title}, so ${titleWord} plays out through ${houseMeaning.lifeAreas.slice(0, 2).join(" and ")} for you specifically.${seasonPlacement.full} And your ${sign.toLowerCase()} ${bodyName} (${bodyTitle}) shapes how you experience it: you meet ${titleWord} with ${traits.essence}.`,
    yourGift: `${entry.coach} Your natural edge with this theme, thanks to your ${sign.toLowerCase()} ${bodyName}: ${traits.gift}.`,
    yourChallenge: `The shadow to watch is ${traits.shadow}. When ${titleWord} energy peaks this szn, that's the exact pattern to catch in real time, and it loses most of its power the moment you name it.`,
    howToWorkIt: `Bring ${titleWord} into your ${houseMeaning.lifeAreas[0]} on purpose this szn. ${houseMeaning.coach} One deliberate move in that arena is worth a hundred good intentions.`,
    prompt: `Where in my ${houseMeaning.lifeAreas[0]} is ${titleWord} asking more of me right now, and what's one move my ${sign.toLowerCase()} ${bodyName} would make?`,
    affirmation: `${titleWord.charAt(0).toUpperCase() + titleWord.slice(1)} is my birthright. I let my ${sign.toLowerCase()} ${bodyName} lead the way.`,
    relatedBodyId: entry.related,
    relatedSign: sign,
  };
}
