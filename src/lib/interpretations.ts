// The interpretation engine, composes coaching-voice copy from sign, body and house data.
// Voice rules: cosmic coach, not textbook. Everyday life, not jargon. Empowering, practical,
// British spellings, no rhetorical questions.

import { ZODIAC_SIGNS, type ChartData } from "@/types/chart";

// Which natal house a given zodiac sign's midpoint falls in, given the natal house cusps.
// Shared by any content engine that needs to place a transiting sign (season, lunation) into
// the member's own chart rather than a generic sun-sign reading.
/**
 * Which house a specific ecliptic longitude falls in.
 *
 * Use this for anything that happens at a real degree: an eclipse, a lunation, a transit. House
 * cusps rarely sit at 0° of a sign, so a sign can straddle two houses, and placing an event by
 * its sign alone puts it in the wrong one whenever it falls the far side of the cusp.
 */
export function houseForLongitude(longitude: number, cusps: number[]): number {
  if (cusps.length !== 12 || !Number.isFinite(longitude)) return 1;
  const lon = ((longitude % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    const norm = (lon - start + 360) % 360;
    const span = (end - start + 360) % 360;
    if (norm < span) return i + 1;
  }
  return 1;
}

/**
 * The "a house can hold more than one sign" explainer, for any dated event whose sign is not the
 * sign on the house cusp it lands in.
 *
 * Members who know their rising read "Pisces eclipse in your 1st house" as a mistake, because they
 * think "my 1st house is Aquarius". Both are true: the cusp is Aquarius and Pisces is swallowed
 * inside the same house (intercepted, or simply a later sign in a wide house). This names both
 * signs and teaches the concept, so it lands as smart rather than broken. Returns "" when the
 * event sign IS the cusp sign, so it only ever appears when it is actually needed.
 *
 * Shared by every composer that places a dated event: eclipses, lunations, ingresses.
 */
export function houseSpanNote(
  eventSign: string,
  houseNumber: number,
  cuspSign: string | undefined,
  eventNoun: string,
): string {
  if (!cuspSign) return "";
  const es = eventSign.toLowerCase();
  const cs = cuspSign.toLowerCase();
  if (es === cs) return "";
  const h = ordinalHouse(houseNumber);
  return ` Quick thing so this does not look wrong, because it is the part everyone second-guesses: a house and a sign are not the same thing. Your ${h} house opens in ${cs}, which is the sign you will see on your ${h} house everywhere else, but the house is wide enough to take in ${es} as well, so the whole of ${es} sits inside it too. A single house often holds more than one sign like this. That is exactly why a ${eventNoun} in ${es} lands in the house you think of as your ${cs} house, and both things are true at once.`;
}

/** The ecliptic longitude of a given degree of a given sign, e.g. 4° Pisces → 334. */
export function longitudeForSignDegree(sign: string, degree: number): number | null {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  if (idx < 0) return null;
  const d = Number.isFinite(degree) ? Math.max(0, Math.min(29.999, degree)) : 15;
  return idx * 30 + d;
}

/**
 * Which house a whole SIGN falls in, measured from its midpoint.
 *
 * Correct for "where does Leo season land for her", where the thing being placed is a 30° stretch
 * rather than a moment. For a dated event, use houseForLongitude with the real degree instead.
 */
export function houseForSign(sign: string, cusps: number[]): number {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  if (idx < 0 || cusps.length !== 12) return 1;
  return houseForLongitude(idx * 30 + 15, cusps);
}

/** The zodiac sign sitting on a given house cusp, derived straight from the cusp longitude. */
function cuspSignOf(cusps: number[], house: number): string {
  const lon = (((cusps[house - 1] % 360) + 360) % 360);
  return ZODIAC_SIGNS[Math.floor(lon / 30)];
}

export interface SeasonHouseSegment {
  house: number;
  startDeg: number; // degrees into the sign (0-30) where this house segment begins
  endDeg: number; // degrees into the sign where it ends
}

/**
 * Every house a whole SIGN passes through, in the order the sun moves through it (0° to 30° of the
 * sign). A 30° sign frequently straddles a house cusp, so a season starts in one house and crosses
 * into the next partway through, and near an intercepted axis it can pass through three. Placing the
 * sign by its midpoint alone (houseForSign) names only the middle house and silently drops the rest,
 * which is why a season that genuinely spans two houses used to be described as if it sat in one.
 *
 * Crossings within half a degree of the sign's own edges are treated as sitting on the boundary, so
 * a cusp that lands a whisker before the next sign does not spawn a misleading sliver of a house.
 */
export function seasonHouseSegments(sign: string, cusps: number[]): SeasonHouseSegment[] {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  if (idx < 0 || cusps.length !== 12) return [];
  const start = idx * 30;
  const crossings = cusps
    .map((c, i) => ({ off: ((((c % 360) + 360) % 360) - start + 360) % 360, house: i + 1 }))
    .filter((c) => c.off > 0.5 && c.off < 29.5)
    .sort((a, b) => a.off - b.off);
  const segments: SeasonHouseSegment[] = [];
  let cursor = 0;
  let house = houseForLongitude(start, cusps);
  for (const cross of crossings) {
    segments.push({ house, startDeg: cursor, endDeg: cross.off });
    cursor = cross.off;
    house = cross.house;
  }
  segments.push({ house, startDeg: cursor, endDeg: 30 });
  return segments;
}

export interface SeasonPlacement {
  primaryHouse: number; // the midpoint house, which still drives the rest of the season page
  houses: number[]; // every house the sign runs through, in the order the sun reaches them
  short: string; // one concise sentence for tight spaces, "" when the sign sits neatly on its cusp
  full: string; // fuller teaching, "" when the sign sits neatly on its cusp
}

/**
 * How a whole season sign actually sits in a member's chart, ready to drop into copy.
 *
 * Handles the two things the midpoint-only version glossed over:
 *   1. interception, one house holding more than one sign (via houseSpanNote), and
 *   2. a sign spanning more than one house, which the old copy never mentioned at all.
 *
 * Returns "" for both strings when the sign sits inside a single house whose cusp it shares, so the
 * explanation only ever appears when it is genuinely needed.
 */
export function composeSeasonPlacement(sign: string, cusps: number[]): SeasonPlacement {
  const s = sign.toLowerCase();
  const primaryHouse = houseForSign(sign, cusps);
  const segments = seasonHouseSegments(sign, cusps);
  const houses = segments.map((seg) => seg.house);

  // Single house: either the sign shares that house's cusp (nothing to explain) or it is intercepted,
  // one house holding more than one sign, which is the houseSpanNote case.
  if (segments.length <= 1) {
    const only = segments[0]?.house ?? primaryHouse;
    const cuspSign = cuspSignOf(cusps, only);
    const note = houseSpanNote(sign, only, cuspSign, "season");
    const short = note
      ? ` Your ${ordinalHouse(only)} house opens in ${cuspSign.toLowerCase()}, wide enough that the whole of ${s} sits inside it, which is why ${s} szn lands right here.`
      : "";
    return { primaryHouse, houses, short, full: note };
  }

  // Multiple houses: the sign crosses one or more cusps, so name every house in the order the sun
  // reaches it and teach the crossover, so it reads as intentional rather than broken.
  const firstHouse = segments[0].house;
  const lastHouse = segments[segments.length - 1].house;
  const firstTitle = HOUSE_MEANINGS[firstHouse - 1]?.title ?? "that area";
  const lastTitle = HOUSE_MEANINGS[lastHouse - 1]?.title ?? "the next area";
  const cuspSignFirst = cuspSignOf(cusps, firstHouse);
  const firstIntercept =
    cuspSignFirst.toLowerCase() !== s
      ? ` (which opens in ${cuspSignFirst.toLowerCase()}, so ${s} sits inside it rather than on the cusp)`
      : "";
  const laterClauses = segments.slice(1).map((seg) => {
    const title = HOUSE_MEANINGS[seg.house - 1]?.title ?? "the next area";
    return `around ${Math.round(seg.startDeg)}° ${s} crosses into your ${ordinalHouse(seg.house)} house of ${title}`;
  });
  const countWord = segments.length === 2 ? "two" : segments.length === 3 ? "three" : String(segments.length);

  const full = ` Worth knowing, because it is the part that looks wrong until it clicks: ${s} does not sit inside a single house for you, it runs across ${countWord} of them. The sun opens ${s} season in your ${ordinalHouse(firstHouse)} house of ${firstTitle}${firstIntercept}, then ${laterClauses.join(", then ")}, so the early weeks of ${s} season run through your ${ordinalHouse(firstHouse)} house and the later weeks through your ${ordinalHouse(lastHouse)} house. Both are live this szn, so read them together rather than picking one.`;

  const short = ` For you ${s} spans ${countWord} houses: it opens in your ${ordinalHouse(firstHouse)} house of ${firstTitle} and crosses into your ${ordinalHouse(lastHouse)} house of ${lastTitle} partway through the season, so both are lit.`;

  return { primaryHouse, houses, short, full };
}

export interface SignTraits {
  essence: string; // "you lead with..."
  gift: string;
  shadow: string;
  confidence: string;
  career: string;
  money: string;
  love: string;
  growth: string;
  flavour: string[]; // adjectives for composition
}

export const SIGN_TRAITS: Record<string, SignTraits> = {
  Aries: {
    essence: "bold, direct energy that moves first and figures it out on the way",
    gift: "the courage to start before you feel ready, you make things happen while others are still planning",
    shadow: "impatience that burns out momentum, and a habit of abandoning things once the initial spark fades",
    confidence: "you feel most confident in motion, action builds your self-belief faster than any amount of preparation",
    career: "you thrive where there's autonomy, speed and something to win, pioneering roles, launches, anything first-of-its-kind",
    money: "money comes to you through bold moves and quick decisions, you earn best when you back yourself fast",
    love: "you love with intensity and honesty, and you need a partner who can match your fire without trying to tame it",
    growth: "learning that consistency is the advanced version of courage, staying is sometimes braver than starting",
    flavour: ["fearless", "direct", "fiery", "pioneering"],
  },
  Taurus: {
    essence: "steady, sensual energy that builds things designed to last",
    gift: "unshakeable consistency, when you commit, you follow through long after everyone else has given up",
    shadow: "digging into comfort zones so deeply that growth starts to feel like a threat",
    confidence: "your confidence grows from mastery and self-trust, you believe in what you've proven to yourself over time",
    career: "you excel where quality and patience are rewarded, building brands, assets and reputations that compound",
    money: "you have natural wealth-building energy, slow, steady accumulation and an instinct for real value",
    love: "you love through loyalty, presence and physical affection, you need security before you fully open",
    growth: "learning to release what's comfortable but complete, letting go is how you make room for better",
    flavour: ["grounded", "luxurious", "steadfast", "sensual"],
  },
  Gemini: {
    essence: "quick, curious energy that connects ideas and people effortlessly",
    gift: "the ability to communicate anything to anyone, your words open doors that stay closed for others",
    shadow: "scattering your energy across so many interests that none of them get your full genius",
    confidence: "your confidence lives in your voice, the more you speak, write and share, the more magnetic you become",
    career: "you shine in roles built on communication, variety and ideas, content, strategy, teaching, media",
    money: "your income multiplies when you monetise your words and ideas, you can literally talk your way to wealth",
    love: "you fall for minds first, you need conversation, playfulness and a partner who never bores you",
    growth: "learning depth, choosing one thing and going all the way in is your quiet superpower",
    flavour: ["witty", "versatile", "curious", "magnetic"],
  },
  Cancer: {
    essence: "intuitive, protective energy that reads rooms and nurtures what matters",
    gift: "emotional intelligence that lets you understand people before they say a word",
    shadow: "retreating into your shell and calling it protection when it's actually hiding",
    confidence: "your confidence flows when you feel emotionally safe, build your inner home and you can face anything",
    career: "you thrive where care and intuition are assets, leading teams, building communities, creating safe spaces",
    money: "you build wealth through security-first instincts, you sense what people need before markets do",
    love: "you love deeply and protectively, you need emotional safety and a partner who honours your sensitivity",
    growth: "learning that your softness is a strategy, feeling deeply is data, not weakness",
    flavour: ["intuitive", "nurturing", "protective", "deep"],
  },
  Leo: {
    essence: "radiant, generous energy that was designed to be seen",
    gift: "natural magnetism, when you show up fully, people can't help but pay attention",
    shadow: "dimming yourself when applause doesn't come instantly, or performing instead of being real",
    confidence: "your confidence is solar-powered, visibility feeds you, and hiding drains you",
    career: "you're built for the front of the room, leadership, performance, personal brands, anything with your name on it",
    money: "money follows your visibility, the more authentically seen you are, the more abundance flows",
    love: "you love wholeheartedly and want to be adored, you need celebration, loyalty and real romance",
    growth: "learning to shine without needing permission or applause, your light was never up for a vote",
    flavour: ["radiant", "regal", "generous", "unforgettable"],
  },
  Virgo: {
    essence: "precise, devoted energy that makes everything it touches better",
    gift: "seeing exactly what needs refining, your standards create excellence others can't reach",
    shadow: "turning those standards on yourself so hard that nothing you do ever feels enough",
    confidence: "your confidence comes from competence, you feel powerful when you know your craft cold",
    career: "you excel where precision and improvement matter, systems, wellness, editing, operations, mastery-based work",
    money: "you build wealth through skill and optimisation, refining what exists into what excels",
    love: "you love through acts of service and attention to detail, you notice everything, and that's how you care",
    growth: "learning that done and imperfect beats perfect and hidden, your work deserves to be seen mid-polish",
    flavour: ["polished", "devoted", "brilliant", "intentional"],
  },
  Libra: {
    essence: "harmonising, aesthetic energy that elevates every room and relationship",
    gift: "effortless charm and taste, you make people feel seen and spaces feel beautiful",
    shadow: "keeping the peace at your own expense, abandoning your preference to avoid the friction",
    confidence: "your confidence blooms in connection, you're at your best relating, collaborating and charming",
    career: "you thrive in beauty, diplomacy and partnership, design, brand, law, curation, anything requiring taste",
    money: "money flows through your relationships and aesthetic eye, your network and your taste are assets",
    love: "partnership is your art form, you need balance, romance and someone who chooses you as clearly as you choose them",
    growth: "learning that your honest preference is not a conflict, the right people want the real answer",
    flavour: ["charming", "elegant", "balanced", "magnetic"],
  },
  Scorpio: {
    essence: "intense, transformative energy that sees beneath every surface",
    gift: "depth and emotional power, you transform everything you fully commit to, including yourself",
    shadow: "guarding your inner world so fiercely that nobody gets close enough to love the real you",
    confidence: "your confidence is forged in transformation, every rebirth you've survived is proof of your power",
    career: "you excel where depth and intensity are required, psychology, research, strategy, healing, high-stakes work",
    money: "you have powerful wealth-transformation energy, investments, other people's money, and complete reinventions",
    love: "you love with rare intensity, all or nothing, and you need a partner brave enough for all",
    growth: "learning to let yourself be seen before you've fully healed, intimacy is built mid-process, not after",
    flavour: ["magnetic", "intense", "transformative", "unshakeable"],
  },
  Sagittarius: {
    essence: "expansive, optimistic energy that needs a bigger horizon",
    gift: "vision and faith, you see possibilities others can't and you inspire people to reach for them",
    shadow: "chasing the next horizon so fast you never harvest what you've already planted",
    confidence: "your confidence comes from meaning, when you believe in the why, you're unstoppable",
    career: "you thrive with freedom and vision, teaching, travel, publishing, big-picture strategy, mission-driven work",
    money: "money expands when your vision does, you earn through growth, risk and thinking bigger than the room",
    love: "you love with adventure and honesty, you need freedom, laughter and a partner who's also a co-explorer",
    growth: "learning that commitment isn't a cage, roots are what let you grow taller",
    flavour: ["adventurous", "visionary", "free-spirited", "wise"],
  },
  Capricorn: {
    essence: "ambitious, masterful energy that builds legacies brick by brick",
    gift: "discipline and long-game thinking, you achieve what others only talk about",
    shadow: "measuring your worth in output and postponing joy until some finish line that keeps moving",
    confidence: "your confidence is earned through mastery, every mountain climbed becomes unshakeable self-belief",
    career: "you're built for the top, leadership, ownership, institutions, anything requiring authority and endurance",
    money: "you have CEO money energy, strategic, patient wealth-building and a natural grasp of value and power",
    love: "you love through commitment and provision, you show up, you build, you stay",
    growth: "learning that rest is part of the strategy, you're a person, not a performance metric",
    flavour: ["ambitious", "timeless", "powerful", "masterful"],
  },
  Aquarius: {
    essence: "original, future-focused energy that was never meant to fit in",
    gift: "seeing what's coming before everyone else, your difference is literally your genius",
    shadow: "detaching from your own feelings and hiding behind ideas when intimacy gets close",
    confidence: "your confidence comes from authenticity, the moment you stop editing your weirdness, you become magnetic",
    career: "you thrive on the cutting edge, innovation, tech, social change, communities, anything ahead of its time",
    money: "money finds you through originality, the ideas that seem too strange are usually your goldmine",
    love: "you love as a best friend first, you need mental connection, freedom and a partner who celebrates your strange",
    growth: "learning to be in your body and your feelings, not just your brilliant head",
    flavour: ["original", "electric", "visionary", "unconventional"],
  },
  Pisces: {
    essence: "dreamy, boundless energy that feels everything and imagines anything",
    gift: "imagination and empathy that border on magic, you create and connect from somewhere others can't access",
    shadow: "dissolving into other people's needs and emotions until you can't find your own edges",
    confidence: "your confidence flows when you trust your intuition, your inner knowing is more accurate than your doubt",
    career: "you shine in creative and healing fields, art, music, spirituality, therapy, anywhere imagination is currency",
    money: "money flows when you charge for your magic, your creativity and intuition are premium skills, not hobbies",
    love: "you love like poetry, deeply, romantically, spiritually, and you need someone who protects your softness",
    growth: "learning boundaries, your compassion needs a container, or it becomes self-abandonment",
    flavour: ["dreamy", "intuitive", "artistic", "boundless"],
  },
};

export interface SignOverview {
  element: "fire" | "earth" | "air" | "water";
  modality: "cardinal" | "fixed" | "mutable";
  ruler: string;
  archetype: string; // sign-agnostic, planet-agnostic: what this sign's energy is generally, mythology and mechanics
}

// A generic, planet-agnostic explanation of each sign's own energy, used so a placement page can
// explain "what Scorpio actually is" before layering on what a specific planet does with that energy.
export const SIGN_OVERVIEWS: Record<string, SignOverview> = {
  Aries: {
    element: "fire", modality: "cardinal", ruler: "Mars",
    archetype: "Aries opens the zodiac wheel and carries that first-mover energy into everything it touches. As a cardinal fire sign it initiates rather than sustains, ruled by Mars, the planet of action and assertion, its whole nature is built around starting, competing and moving before overthinking gets a vote. Aries energy is direct, quick to anger and quick to forgive, and fundamentally uninterested in waiting for permission.",
  },
  Taurus: {
    element: "earth", modality: "fixed", ruler: "Venus",
    archetype: "Taurus is a fixed earth sign, which is the astrological recipe for staying power, once it commits to a person, a value or a way of living, it does not move quickly or easily. Ruled by Venus, it's oriented around pleasure, beauty and tangible security, but filtered through earth's practicality rather than air's ideas or water's feeling. Taurus energy trusts what it can see, touch and keep, and treats consistency itself as a form of devotion.",
  },
  Gemini: {
    element: "air", modality: "mutable", ruler: "Mercury",
    archetype: "Gemini is a mutable air sign, built for adaptability and the exchange of ideas rather than for staying still. Ruled by Mercury, the planet of communication, its core drive is curiosity, it wants to know a little about everything and talk to everyone about it. Because it's mutable, Gemini energy shape-shifts easily to fit new information or new company, which reads as versatility to some and inconsistency to others, it's really the same trait either way.",
  },
  Cancer: {
    element: "water", modality: "cardinal", ruler: "the Moon",
    archetype: "Cancer is a cardinal water sign, meaning it initiates through feeling rather than force, it starts things by sensing what's needed and moving to protect or nurture it. Ruled by the moon, its whole orientation is emotional, memory, home, family and the instinct to care for what it loves fiercely. Cancer energy builds shells, quite literally in its symbol, the crab, not to hide but to have somewhere safe to retreat to between rounds of genuinely deep feeling.",
  },
  Leo: {
    element: "fire", modality: "fixed", ruler: "the Sun",
    archetype: "Leo is a fixed fire sign, which gives it fire's warmth and drive with the staying power to sustain it over the long term rather than just a first burst. Ruled by the sun itself, Leo's core nature is built around self-expression, being seen, and generosity that flows outward once it feels secure in its own light. Fixed energy means once Leo commits to loving, creating or leading something, it does so with real loyalty, not just a passing burst of enthusiasm.",
  },
  Virgo: {
    element: "earth", modality: "mutable", ruler: "Mercury",
    archetype: "Virgo is a mutable earth sign, practical like Taurus and Capricorn but adaptable rather than fixed, always refining, adjusting and improving the systems around it. Ruled by Mercury, its version of the communicative planet expresses through precision and analysis rather than Gemini's breadth, it wants to understand something completely and then make it better. Virgo energy is devoted, detail-oriented, and most at ease when it has a system, standard or ritual to hold onto.",
  },
  Libra: {
    element: "air", modality: "cardinal", ruler: "Venus",
    archetype: "Libra is a cardinal air sign, it initiates through relationship and ideas about fairness, rather than through force. Ruled by Venus, but expressed through air rather than Taurus's earth, Libra's version of Venusian energy is about balance, aesthetics and partnership rather than security or sensation. Libra energy instinctively weighs both sides of anything, sometimes to the point of indecision, because genuine fairness and beauty both require holding more than one perspective at once.",
  },
  Scorpio: {
    element: "water", modality: "fixed", ruler: "Pluto (traditionally Mars)",
    archetype: "Scorpio is a fixed water sign, all of water's emotional depth with fixed sign's total unwillingness to stay at the surface or let go easily once it commits. Ruled by Pluto in modern astrology, with Mars as its traditional ruler, Scorpio's nature blends transformation with intensity, it doesn't do anything by halves, least of all feeling. Scorpio energy is private by instinct, and its trust, once earned, tends to run as deep as its suspicion did before it was earned.",
  },
  Sagittarius: {
    element: "fire", modality: "mutable", ruler: "Jupiter",
    archetype: "Sagittarius is a mutable fire sign, fire's enthusiasm and drive combined with a restless, adaptable need to keep moving toward the next horizon rather than settle on one. Ruled by Jupiter, the planet of expansion and meaning, its core nature is philosophical and adventurous, it's less interested in any single destination than in the growth the journey itself provides. Sagittarius energy is optimistic almost by default, and allergic to anything that feels like a cage, literal or metaphorical.",
  },
  Capricorn: {
    element: "earth", modality: "cardinal", ruler: "Saturn",
    archetype: "Capricorn is a cardinal earth sign, it initiates through ambition and structure, building toward long-term, tangible results rather than quick wins. Ruled by Saturn, the planet of discipline and mastery, Capricorn's nature is patient, strategic and status-conscious in the sense of wanting to be respected for what it's actually built, not just admired. Capricorn energy plays a genuinely long game, and tends to look back on early struggle less as hardship and more as the foundation the whole structure was poured on.",
  },
  Aquarius: {
    element: "air", modality: "fixed", ruler: "Uranus (traditionally Saturn)",
    archetype: "Aquarius is a fixed air sign, an unusual pairing that gives it air's ideas with fixed sign's total commitment to them once formed, it doesn't just have opinions, it holds them. Ruled by Uranus in modern astrology, with Saturn as its traditional ruler, Aquarius's nature blends rebellion with structure, it wants to build entirely new systems, not just critique the old ones. Aquarius energy values the collective and the future over personal comfort or convention, and genuinely doesn't mind standing alone to get there.",
  },
  Pisces: {
    element: "water", modality: "mutable", ruler: "Neptune (traditionally Jupiter)",
    archetype: "Pisces closes the zodiac wheel as a mutable water sign, meaning it absorbs and adapts to whatever emotional current it's in, having, symbolically, integrated the lessons of all eleven signs before it. Ruled by Neptune in modern astrology, with Jupiter as its traditional ruler, Pisces's nature is dreamy, empathic and boundary-dissolving, it feels other people's feelings as readily as its own. Pisces energy is deeply intuitive and creative, and its central life lesson is usually learning where it ends and someone else begins.",
  },
};

export interface BodyMeaning {
  id: string;
  name: string;
  title: string; // e.g. "your core self"
  domain: string; // long: "your identity, vitality and the way you shine"
  domainShort: string; // for aspect sentences: "sense of who you are"
  intro: string; // coaching framing of what this body means
  deepDive: string; // fuller, sign-agnostic explanation of what this planet/point actually is and does in a chart
}

export const BODY_MEANINGS: BodyMeaning[] = [
  {
    id: "sun", name: "Sun", title: "your core self", domain: "your identity, vitality and the way you shine", domainShort: "sense of who you are",
    intro: "Your sun is the centre of your chart, who you are when nobody's watching and who you're becoming when everyone is. This is your main character energy source.",
    deepDive: "In every chart, the sun is the anchor point, the planets and houses effectively organise themselves around it. Astrologically it represents your core identity, your ego in the healthy sense, your vitality, and your basic life purpose, the through-line you're building a whole life around whether you've named it yet or not. It's the placement most people already know, sun sign astrology, because it genuinely is the headline. Everything else in your chart, moon, rising, the ten other planets, adds nuance and texture, but the sun is the sentence the rest of the paragraph is explaining.",
  },
  {
    id: "moon", name: "Moon", title: "your emotional blueprint", domain: "your inner world, needs and instincts", domainShort: "emotional world",
    intro: "Your moon is how you feel, what you need to feel safe, and the private you that only your closest people meet. Understanding her is understanding your own operating manual.",
    deepDive: "Where the sun is who you're becoming, the moon is who you already are underneath it, your instinctive, unfiltered emotional response before you've had time to manage it for an audience. It governs your subconscious patterns, your relationship to safety and comfort, and the caretaking style you both need and offer. It's also considered the fastest-moving major placement, changing sign roughly every two and a half days, which is part of why it feels so personal, so few people share your exact moon. Your moon sign is often the truest read on what you actually need, as opposed to what you've learned to ask for.",
  },
  {
    id: "rising", name: "Rising", title: "your magnetism", domain: "your first impression and natural presence", domainShort: "presence",
    intro: "Your rising sign is the energy you lead with, the vibe people catch before you've said a word. It's your magnetism setting, and it's working whether you use it consciously or not.",
    deepDive: "Your rising sign, also called your ascendant, is the zodiac sign that was on the eastern horizon at the exact moment and location you were born, which is why it needs a precise birth time to calculate accurately, unlike your sun. It functions as the lens the rest of your chart is filtered through before the world sees it, your default coping style, your instinctive body language, the mask that isn't really a mask because you've worn it since birth. It also sets your entire house system, which is why two people with the same sun sign can have completely different-feeling charts once their rising signs differ.",
  },
  {
    id: "mercury", name: "Mercury", title: "your voice and mind", domain: "how you think, speak and connect", domainShort: "voice and thinking",
    intro: "Mercury is how your mind works and how your words land. It shapes how you learn, pitch, text, post and persuade, your entire communication signature.",
    deepDive: "Mercury is the planet of the mind, named for the messenger god because it genuinely governs the whole communication chain, how information gets in, how you process it, and how it gets back out in words. Astrologically it never strays far from the sun, so its sign is always close to your sun sign, which means its texture usually blends subtly with your core identity rather than standing sharply apart from it. It shows up in how you learn best, how you argue, how you write, and how quickly or carefully you tend to speak your mind.",
  },
  {
    id: "venus", name: "Venus", title: "your love and style codes", domain: "how you love, attract and enjoy", domainShort: "way of loving and attracting",
    intro: "Venus is your attraction blueprint, what you love, how you love, and the aesthetic that makes you unforgettable. She runs your style, your romance and your relationship with pleasure.",
    deepDive: "Venus is the planet of attraction in the broadest sense, not just romance, but beauty, taste, pleasure and what you value enough to spend your time, money and affection on. It governs your love language, your instinctive sense of style, and how you handle giving and receiving affection. Because Venus stays relatively close to the sun in the sky, its sign colours your identity with a specific flavour of magnetism, what people find charming about you often traces straight back here.",
  },
  {
    id: "mars", name: "Mars", title: "your drive", domain: "how you act, pursue and fight", domainShort: "drive and desire",
    intro: "Mars is your engine, how you go after what you want, how you handle conflict, and where your ambition burns hottest. This is your action signature.",
    deepDive: "Mars is the planet of action, desire and assertion, the part of the chart that answers the question 'what do you do when you actually want something.' It governs how you pursue goals, how you handle confrontation, your physical energy and stamina, and, classically, your libido. Where Venus shows what you're drawn to, Mars shows what you do about it, which is why the two are often read together in compatibility work. A well-understood Mars is the difference between drive that burns you out and drive that actually gets you somewhere.",
  },
  {
    id: "jupiter", name: "Jupiter", title: "your abundance code", domain: "where you're naturally lucky and built to expand", domainShort: "luck and expansion",
    intro: "Jupiter is where the universe gave you a head start, your zone of natural luck, growth and abundance. Playing in this energy is how opportunities find you.",
    deepDive: "Jupiter is the largest planet in the solar system and, fittingly, the planet of expansion, luck, meaning and growth in astrology. It takes about twelve years to orbit the sun, spending roughly a year in each zodiac sign, which is why 'Jupiter return' years, once every twelve years, are considered personally significant growth chapters. Wherever Jupiter sits in your chart marks an area life tends to hand you more of, more opportunity, more confidence, more room to take up space, provided you don't overextend past the point it can actually support.",
  },
  {
    id: "saturn", name: "Saturn", title: "your mastery path", domain: "where you're being built into an authority", domainShort: "discipline and mastery",
    intro: "Saturn is your inner coach with the highest standards. Where he sits is where life asks more of you, and where you're capable of building something unshakeable.",
    deepDive: "Saturn is the planet of structure, discipline, limitation and long-term mastery, the taskmaster of the chart, but a fair one. It takes about twenty-nine years to orbit the sun, which is why the 'Saturn return', around ages 29 and 58, is treated as a major astrological rite of passage, a forced audit of what you've actually built versus what you've just been coasting on. Wherever Saturn sits is an area where you'll likely feel restriction or self-doubt earlier in life, and real, earned authority later, but only if you keep showing up for it instead of avoiding it.",
  },
  {
    id: "uranus", name: "Uranus", title: "your rebel genius", domain: "where you break rules and innovate", domainShort: "originality",
    intro: "Uranus is where you were never meant to follow the template. This is your zone of genius-level difference, the part of you that's ahead of its time on purpose.",
    deepDive: "Uranus is the planet of rebellion, innovation and sudden change, it governs the parts of a chart that refuse convention on principle. It moves slowly, roughly seven years per sign, so its sign is shared with your entire generation and mostly describes a collective shift, it's the house placement that makes it personal to you specifically. Wherever Uranus sits by house is where you're built to break from the expected script, and where sudden, disruptive change tends to visit your life whether invited or not.",
  },
  {
    id: "neptune", name: "Neptune", title: "your dream frequency", domain: "your imagination, spirituality and ideals", domainShort: "imagination and intuition",
    intro: "Neptune is where you dream, where you idealise, and where your intuition speaks loudest. Handled consciously, it's your creative and spiritual superpower.",
    deepDive: "Neptune is the planet of dreams, illusion, spirituality and imagination, it dissolves hard edges wherever it touches, which is exactly why it can feel both magical and disorienting. It's another slow-moving, generational planet, roughly fourteen years per sign, so like Uranus, its house placement is what makes the reading personal. Wherever Neptune sits is where your intuition is strongest and your boundaries are weakest, both the gift and the caution live in the same address.",
  },
  {
    id: "pluto", name: "Pluto", title: "your power source", domain: "where you transform and reclaim power", domainShort: "deep power",
    intro: "Pluto is where your deepest power lives, often buried under your deepest fears. The area he touches is where you're built to transform completely, more than once.",
    deepDive: "Pluto is the planet of transformation, power and rebirth, named for the god of the underworld because its territory really is the stuff most people would rather not look at directly. It's the slowest-moving point commonly used in personal astrology, spending up to thirty years in a single sign, so again it's the house placement that personalises the read. Wherever Pluto sits in your chart is where you'll be asked to face something completely, lose an old version of yourself, and come back with real, hard-won power instead of the performance of it.",
  },
  {
    id: "chiron", name: "Chiron", title: "your wound and gift", domain: "your deepest wound and the medicine it makes", domainShort: "healing journey",
    intro: "Chiron is the wound that becomes your wisdom. The place that hurt most is the exact place you're able to help others heal, that's not poetry, it's your chart.",
    deepDive: "Chiron is technically a minor planet, not one of the traditional ten, but it's earned a firm place in modern chart reading as the 'wounded healer.' In mythology Chiron was a healer who could cure anyone except himself, and that paradox is exactly what the placement describes, a core wound you likely can't fully erase but can learn to work with so completely that you become uniquely equipped to help others through the same thing. Wherever Chiron sits marks the tender spot most chart readings skip past, and the one clients usually say hits hardest.",
  },
  {
    id: "north_node", name: "North Node", title: "your destiny direction", domain: "the growth your soul signed up for", domainShort: "growth direction",
    intro: "Your north node is your becoming, the unfamiliar territory your life keeps nudging you toward. It feels like a stretch because it's supposed to.",
    deepDive: "The north node isn't a planet at all, it's a mathematical point, one of two spots where the moon's orbit crosses the sun's apparent path. In astrology it's read as your growth direction, the unfamiliar, sometimes uncomfortable territory your life circumstances keep steering you toward, again and again, whether or not you go willingly. It always sits directly opposite your south node, which is why the two are read as a pair, one describes where you're stretching toward, the other describes what you're stretching away from.",
  },
  {
    id: "south_node", name: "South Node", title: "your comfort zone gifts", domain: "the talents you arrived with and lean on", domainShort: "innate gifts",
    intro: "Your south node is what you already mastered, gifts so natural you barely notice them. They're your foundation, and also the comfort zone your growth asks you to build beyond.",
    deepDive: "The south node is the mathematical opposite point to your north node, and in astrology it's read as your point of origin, the talents, patterns and default responses that already feel completely natural because, symbolically, you've already mastered them. It's not something to fix, it's your foundation and your fallback both. The work isn't abandoning your south node, it's noticing when you're using it to avoid the north node's stretch instead of building from it.",
  },
  {
    id: "lilith", name: "Lilith", title: "your untamed self", domain: "the part of you that refuses to shrink", domainShort: "wild power",
    intro: "Lilith is your unapologetic edge, the part of you that's been shamed, silenced or called too much. Reclaiming her is reclaiming the power people tried to talk you out of.",
    deepDive: "In astrology, Black Moon Lilith is a calculated point, not a physical body, representing the moon's furthest orbital point from Earth. Named for the mythological figure who refused to submit and was cast out for it, the placement is read as the part of you that resists being tamed, edited or made smaller for anyone's comfort. Wherever Lilith sits marks the area of life where you've likely been told you're 'too much,' and where reclaiming exactly that quality, unapologetically, tends to be the actual growth.",
  },
  {
    id: "part_of_fortune", name: "Part of Fortune", title: "your joy jackpot", domain: "where fulfilment and fortune meet", domainShort: "fulfilment zone",
    intro: "Your Part of Fortune marks where joy and success intersect for you specifically, the life area where doing what genuinely lights you up also happens to pay off.",
    deepDive: "The Part of Fortune is one of the oldest calculated points in astrology, predating most of the outer planets in the tradition, derived from the relationship between your sun, moon and rising. It's read as the place in your chart where your inner joy and outer success naturally overlap, the life area where 'follow what feels good' and 'follow what pays off' turn out to be the same advice, not competing ones.",
  },
  {
    id: "midheaven", name: "Midheaven", title: "your public legacy", domain: "your career pinnacle and public reputation", domainShort: "public image",
    intro: "Your midheaven is the top of your chart, what you're becoming known for. It's your reputation, your career direction and the legacy your name gets attached to.",
    deepDive: "The midheaven, or Medium Coeli, marks the highest point in your chart, the sign that was directly overhead at your exact birth location and time. It sits at the cusp of your tenth house and represents your public face, career direction and the reputation you're building whether you're doing it on purpose or not. Like the rising sign, it requires an accurate birth time to calculate, and it's often considered, alongside the sun and rising, one of the three placements that most shape how the world experiences you.",
  },
];

export interface HouseMeaning {
  house: number;
  title: string;
  rules: string;
  lifeAreas: string[];
  coach: string;
  deepDive: string; // fuller, planet-agnostic explanation of what this house governs and why it works that way
  naturalSign: string; // the zodiac sign that naturally rules this house in the classic system, for context
}

export const HOUSE_MEANINGS: HouseMeaning[] = [
  {
    house: 1, title: "identity & presence", rules: "your self-image, first impressions and how you arrive in the world", lifeAreas: ["identity", "appearance", "confidence", "beginnings"],
    coach: "This is your main character house, planets and signs here shape the energy you radiate before you say a word.",
    naturalSign: "Aries",
    deepDive: "The first house begins at your rising sign, the exact point on the horizon at your moment of birth, which makes it the most literal 'entrance' in your chart. It's traditionally linked to Aries and its ruler Mars, the house of beginnings, so anything placed here tends to come with initiating energy, it wants to lead, not follow. Any planet sitting in your first house behaves almost like a second rising sign, its qualities become part of how people read you within seconds of meeting you.",
  },
  {
    house: 2, title: "money & worth", rules: "your income, possessions, self-worth and relationship with security", lifeAreas: ["money", "self-worth", "values", "security"],
    coach: "Your self-worth sets your net worth, this house shows how you earn, what you value and how you build your material foundation.",
    naturalSign: "Taurus",
    deepDive: "The second house is naturally linked to Taurus and Venus, which is why it governs not just money but the whole Taurean question underneath it, what you actually value, and what makes you feel secure enough to relax. It covers earned income and possessions specifically, as opposed to the eighth house, which covers shared or inherited resources, the second is about what you build with your own two hands. Planets here describe your instinctive relationship with earning, spending and self-worth, often before you've consciously worked out what that relationship even is.",
  },
  {
    house: 3, title: "voice & mind", rules: "communication, learning, siblings, your local world and everyday connections", lifeAreas: ["communication", "learning", "writing", "community"],
    coach: "This house runs your voice, how you speak, write, post and connect. Energy here wants to be expressed, not overthought.",
    naturalSign: "Gemini",
    deepDive: "Naturally linked to Gemini and Mercury, the third house governs the everyday mind, communication, short trips, siblings and the immediate, local world you move through daily. It's a more grounded, practical cousin of the ninth house's big-picture belief systems, this is about the actual sentences you say and the emails you send, not your grand philosophy. Planets landing here tend to make someone noticeably talkative, curious or restless in that specific placement's flavour.",
  },
  {
    house: 4, title: "home & roots", rules: "family, home, emotional foundations and where you come from", lifeAreas: ["home", "family", "roots", "inner safety"],
    coach: "Your foundation house, the emotional base everything else is built on. When this feels solid, you can risk more everywhere else.",
    naturalSign: "Cancer",
    deepDive: "Sitting at the very bottom of the chart wheel, the fourth house is naturally linked to Cancer and the moon, and it's considered the psychological floor everything else in the chart is built on. It covers your literal home, your family of origin, and the emotional patterns you learned before you had language for them. It's also the most private house in the chart, what happens here rarely gets performed for an audience, which is exactly why healing that starts here tends to change everything built on top of it.",
  },
  {
    house: 5, title: "creativity & joy", rules: "self-expression, romance, play, creativity and being celebrated", lifeAreas: ["creativity", "romance", "pleasure", "self-expression"],
    coach: "This is your joy house, where you create, flirt, play and shine. Neglecting it dims everything; feeding it lights up your whole chart.",
    naturalSign: "Leo",
    deepDive: "Naturally linked to Leo and the sun, the fifth house governs anything created purely for the joy of it, art, romance, play, and yes, classically, children. It's the house of the ego expressing itself for pleasure rather than survival or duty, which is why it's often the first thing to get cut when life gets busy, and the first thing that needs restoring when someone feels flat. Planets here describe what genuinely delights you, not what you've been told should.",
  },
  {
    house: 6, title: "habits & wellbeing", rules: "daily routines, health, work rituals and acts of devotion", lifeAreas: ["habits", "health", "routines", "service"],
    coach: "Your daily life house, the small repeated choices that quietly decide your future. Glow-ups are built here, not in grand gestures.",
    naturalSign: "Virgo",
    deepDive: "Naturally linked to Virgo and Mercury, the sixth house governs the unglamorous machinery of daily life, health, routines, and the day-to-day experience of work, as distinct from the tenth house's career reputation. It's the house of maintenance and devotion, the small repeated acts that either quietly build a life or quietly erode one. Planets here tend to describe your relationship with discipline, service and your own body's needs.",
  },
  {
    house: 7, title: "partnership", rules: "committed relationships, business partners and one-to-one dynamics", lifeAreas: ["love", "partnership", "collaboration", "commitment"],
    coach: "Your partnership house, what you attract and what you're learning through the mirror of other people.",
    naturalSign: "Libra",
    deepDive: "Sitting directly opposite the first house, naturally linked to Libra and Venus, the seventh house governs committed one-to-one relationships, marriage, business partnerships, and open enemies, the significant others in your life, for better or worse. Because it's the first house's mirror, it's often read as showing what you're drawn to complete in yourself through other people. Planets here describe the qualities you consistently attract into close partnership, not always the qualities you consciously think you want.",
  },
  {
    house: 8, title: "depth & shared power", rules: "intimacy, transformation, shared resources and other people's money", lifeAreas: ["intimacy", "transformation", "investments", "power"],
    coach: "Your depth house, where surface-level anything comes to die. Merging, transforming and receiving at scale all live here.",
    naturalSign: "Scorpio",
    deepDive: "Naturally linked to Scorpio and Pluto (with Mars as traditional co-ruler), the eighth house governs everything that happens when two lives, or two bank accounts, genuinely merge, sex, death, inheritance, shared finances, taxes and debt. It's considered one of the more intense houses precisely because it deals with what you don't fully control alone, other people's money, mortality, and the transformation that comes from real intimacy rather than surface connection. Planets here tend to run deep, private and slow to reveal themselves, which is exactly the point, this house was never built for small talk.",
  },
  {
    house: 9, title: "expansion & belief", rules: "travel, higher learning, publishing, philosophy and your bigger picture", lifeAreas: ["travel", "beliefs", "teaching", "adventure"],
    coach: "Your horizon house, where life gets bigger. Faith, travel, study and sharing what you know all expand you from here.",
    naturalSign: "Sagittarius",
    deepDive: "Naturally linked to Sagittarius and Jupiter, the ninth house governs the big-picture mind, long-distance travel, higher education, publishing, and the belief systems, religious, philosophical or otherwise, that give your life meaning. Where the third house is your everyday local mind, the ninth is your horizon-scanning mind, it wants to know why, not just what. Planets here often describe what you're building your worldview around, and where you're likely to go looking for answers.",
  },
  {
    house: 10, title: "career & legacy", rules: "your public reputation, career pinnacle and what you're known for", lifeAreas: ["career", "reputation", "achievement", "visibility"],
    coach: "Your legacy house, the top of your chart. Energy here shapes what your name becomes attached to. This is where you're meant to be seen succeeding.",
    naturalSign: "Capricorn",
    deepDive: "Sitting at the very top of the chart wheel, opposite the fourth house, the tenth house is naturally linked to Capricorn and Saturn, and it governs your public reputation, career pinnacle and long-term legacy, the version of you that exists in other people's minds before they've met you personally. It's the most public house in the entire chart, the opposite of the fourth house's private foundations. Planets landing here shape what you become known for, often years before you'd have chosen it consciously.",
  },
  {
    house: 11, title: "community & future", rules: "friendships, networks, audiences and your vision for the future", lifeAreas: ["friendships", "networks", "audience", "dreams"],
    coach: "Your people house, communities, audiences and the friendships that shape your future. Your network genuinely is your net worth here.",
    naturalSign: "Aquarius",
    deepDive: "Naturally linked to Aquarius and Uranus (with Saturn as traditional co-ruler), the eleventh house governs friendships, communities, audiences and your hopes for the future, the people and causes you choose rather than the family you were born into. It's a more collective house than the deeply personal seventh, this is about your tribe, not your one-to-one person. Planets here often describe the kind of community that actually energises you, and the vision of the future you're quietly building toward with other people.",
  },
  {
    house: 12, title: "inner world & release", rules: "your subconscious, spirituality, rest and what happens behind the scenes", lifeAreas: ["spirituality", "rest", "subconscious", "healing"],
    coach: "Your inner sanctuary house, rest, intuition and the subconscious patterns running the show. Healing here changes everything above the surface.",
    naturalSign: "Pisces",
    deepDive: "The final house before the cycle begins again at the first, naturally linked to Pisces and Neptune, the twelfth house governs the subconscious, spirituality, rest, and anything that happens behind the scenes rather than in public view, including endings and letting go. It's often called the house of 'hidden things,' not because it's ominous, but because whatever sits here tends to operate below your conscious awareness until you deliberately go looking. Planets here often describe a gift or sensitivity someone spends the first half of life not fully recognising as theirs.",
  },
];

// Which planet rules each sign. Modern rulership is primary (Pluto/Uranus/Neptune for the three
// signs discovered after the classical system), traditional co-rulers included since a lot of
// working astrologers still weigh both, especially for Scorpio/Aquarius/Pisces. Every house's
// story runs through whichever planet rules the sign actually sitting on that house's cusp, not
// just whatever planet happens to be posited inside it, those are two different layers.
export interface SignRuler {
  rulerId: string;
  rulerName: string;
  traditionalRulerId?: string;
  traditionalRulerName?: string;
}

export const SIGN_RULERS: Record<string, SignRuler> = {
  Aries: { rulerId: "mars", rulerName: "Mars" },
  Taurus: { rulerId: "venus", rulerName: "Venus" },
  Gemini: { rulerId: "mercury", rulerName: "Mercury" },
  Cancer: { rulerId: "moon", rulerName: "Moon" },
  Leo: { rulerId: "sun", rulerName: "Sun" },
  Virgo: { rulerId: "mercury", rulerName: "Mercury" },
  Libra: { rulerId: "venus", rulerName: "Venus" },
  Scorpio: { rulerId: "pluto", rulerName: "Pluto", traditionalRulerId: "mars", traditionalRulerName: "Mars" },
  Sagittarius: { rulerId: "jupiter", rulerName: "Jupiter" },
  Capricorn: { rulerId: "saturn", rulerName: "Saturn" },
  Aquarius: { rulerId: "uranus", rulerName: "Uranus", traditionalRulerId: "saturn", traditionalRulerName: "Saturn" },
  Pisces: { rulerId: "neptune", rulerName: "Neptune", traditionalRulerId: "jupiter", traditionalRulerName: "Jupiter" },
};

export interface RulerPlacement {
  rulerId: string;
  rulerName: string;
  rulerSign: string;
  rulerHouse: number;
  rulerRetrograde: boolean;
  synthesis: string;
}

// Finds the planet that actually rules a given cusp sign, then reads where that planet natally
// sits, sign and house, and synthesises what that specifically means for the house it rules.
// This is the layer that was missing: not "you have Jupiter here" (a planet posited in the
// house) but "Sagittarius rules this house, and your Jupiter, its ruler, sits in Capricorn in
// your 6th house" (where the house's actual engine natally lives).
// The Sun and Moon read as "the Sun"/"the Moon" in prose, every other ruler is used bare. One
// helper so every synthesis string gets the article right rather than "Sun rules your...".
export function rulerRef(name: string): string {
  return name === "Sun" || name === "Moon" ? `the ${name}` : name;
}

export function composeRulerPlacement(cuspSign: string, ruledHouse: number, chart: ChartData): RulerPlacement | null {
  const ruler = SIGN_RULERS[cuspSign];
  if (!ruler) return null;

  const rulerPlanet = chart.planets.find((p) => p.id === ruler.rulerId);
  if (!rulerPlanet) return null;

  const rulerTraits = SIGN_TRAITS[rulerPlanet.sign];
  const rulerHouseMeaning = HOUSE_MEANINGS[rulerPlanet.house - 1];
  const ruledHouseMeaning = HOUSE_MEANINGS[ruledHouse - 1];
  const rName = rulerRef(ruler.rulerName);

  const sameHouse = rulerPlanet.house === ruledHouse;
  const synthesis = sameHouse
    ? `${cuspSign} rules your ${ordinalHouse(ruledHouse)} house, and its ruler, ${rName}, sits right there too, in ${rulerPlanet.sign.toLowerCase()}. That's a house running its own engine, ${ruledHouseMeaning?.rules} is powered directly by ${rulerTraits?.essence}, with nothing external pulling it off course.`
    : `${cuspSign} rules your ${ordinalHouse(ruledHouse)} house, but the actual engine behind it, ${rName}, sits somewhere else entirely: in ${rulerPlanet.sign.toLowerCase()}, in your ${ordinalHouse(rulerPlanet.house)} house of ${rulerHouseMeaning?.title}. That means ${ruledHouseMeaning?.rules} runs through ${rulerTraits?.essence}, filtered through ${rulerHouseMeaning?.rules}, not a standalone story, a partnership between the two houses.`;

  return {
    rulerId: ruler.rulerId,
    rulerName: ruler.rulerName,
    rulerSign: rulerPlanet.sign,
    rulerHouse: rulerPlanet.house,
    rulerRetrograde: rulerPlanet.retrograde,
    synthesis,
  };
}

// Reverse rulership: which of the member's own houses this planet rules, read from the sign on
// each house cusp in this specific chart. A planet can rule two houses (e.g. Mercury rules both
// a Gemini-cusp and a Virgo-cusp house). This is what lets a planet layer say "your Mercury also
// rules your 3rd and 12th houses", wiring the life area to those parts of the chart, instead of
// treating the planet as a free-floating influence.
export function planetRulesHouses(planetId: string, chart: ChartData): number[] {
  const out: number[] = [];
  for (let i = 0; i < 12; i++) {
    const sign = chart.houses[i]?.sign;
    if (!sign) continue;
    if (SIGN_RULERS[sign]?.rulerId === planetId) out.push(i + 1);
  }
  return out;
}

// Classical essential dignity, keyed by planet id. Only the seven traditional planets have a
// settled dignity scheme, so the outer planets, Chiron and the nodes are deliberately absent and
// simply return null (no dignity claim made), rather than inventing one.
const DIGNITIES: Record<string, { domicile: string[]; exalt?: string; detriment: string[]; fall?: string }> = {
  sun: { domicile: ["Leo"], exalt: "Aries", detriment: ["Aquarius"], fall: "Libra" },
  moon: { domicile: ["Cancer"], exalt: "Taurus", detriment: ["Capricorn"], fall: "Scorpio" },
  mercury: { domicile: ["Gemini", "Virgo"], exalt: "Virgo", detriment: ["Sagittarius", "Pisces"], fall: "Pisces" },
  venus: { domicile: ["Taurus", "Libra"], exalt: "Pisces", detriment: ["Aries", "Scorpio"], fall: "Virgo" },
  mars: { domicile: ["Aries", "Scorpio"], exalt: "Capricorn", detriment: ["Taurus", "Libra"], fall: "Cancer" },
  jupiter: { domicile: ["Sagittarius", "Pisces"], exalt: "Cancer", detriment: ["Gemini", "Virgo"], fall: "Capricorn" },
  saturn: { domicile: ["Capricorn", "Aquarius"], exalt: "Libra", detriment: ["Cancer", "Leo"], fall: "Aries" },
};

export type Dignity = "domicile" | "exaltation" | "detriment" | "fall";

export function planetDignity(planetId: string, sign: string): Dignity | null {
  const d = DIGNITIES[planetId];
  if (!d) return null;
  if (d.domicile.includes(sign)) return "domicile";
  if (d.exalt === sign) return "exaltation";
  if (d.detriment.includes(sign)) return "detriment";
  if (d.fall === sign) return "fall";
  return null;
}

// A short, plain-English gloss of what a dignity actually means for strength, used so the copy can
// say "especially strong here" or "working uphill here" instead of dumping the technical term raw.
export function dignityGloss(dignity: Dignity): string {
  switch (dignity) {
    case "domicile":
      return "the sign it rules, so it's operating at full strength here, completely at home, doing exactly what it does best with nothing diluting it";
    case "exaltation":
      return "the sign of its exaltation, so it's unusually strong and elevated here, this planet is one of the real power sources in the chart";
    case "detriment":
      return "the sign opposite the one it rules, so it's working slightly uphill here, capable but having to earn its expression rather than getting it for free";
    case "fall":
      return "the sign of its fall, so it's at its most tender and least automatic here, real ability, but it needs conscious support rather than running on instinct";
  }
}

export type Occupancy = "empty" | "single" | "occupied" | "stellium";

// A single house read as a complete unit: its meaning, the sign on its cusp, the full ruler
// chain (via composeRulerPlacement), who lives inside it, and whether it's empty, singly
// tenanted or a stellium. This is the reusable unit every life-area recipe is built from, so a
// tertiary house (the 8th in Business, the 12th in Health) gets exactly the same depth as the
// primary one, per the composition rule that any house included is interpreted completely.
export interface HouseChain {
  house: number;
  title: string;
  rules: string;
  lifeAreas: string[];
  cuspSign: string;
  ruler: RulerPlacement | null;
  occupants: { id: string; name: string; sign: string; house: number }[];
  occupancy: Occupancy;
}

export function composeHouseChain(house: number, chart: ChartData): HouseChain {
  const meaning = HOUSE_MEANINGS[house - 1];
  const cuspSign = chart.houses[house - 1]?.sign || meaning.naturalSign;
  const ruler = composeRulerPlacement(cuspSign, house, chart);
  const occupants = chart.planets
    .filter((p) => p.house === house)
    .map((p) => ({ id: p.id, name: p.name, sign: p.sign, house: p.house }));
  const occupancy: Occupancy =
    occupants.length === 0 ? "empty" : occupants.length === 1 ? "single" : occupants.length >= 3 ? "stellium" : "occupied";
  return {
    house,
    title: meaning.title,
    rules: meaning.rules,
    lifeAreas: meaning.lifeAreas,
    cuspSign,
    ruler,
    occupants,
    occupancy,
  };
}

// A planet read as a complete layer of a life area: where it sits (sign + house), what it
// governs, which of the member's houses it rules, and its dignity. This is what makes "Mercury
// relates to business" into "your Gemini Mercury in the 10th, ruling your 2nd and 5th, runs your
// business communication through visibility and earning". Reused by any recipe that names a planet.
export interface PlanetLayer {
  id: string;
  name: string;
  sign: string;
  house: number;
  retrograde: boolean;
  rulesHouses: number[];
  dignity: Dignity | null;
  synthesis: string;
}

export function composePlanetLayer(planetId: string, chart: ChartData): PlanetLayer | null {
  const planet = chart.planets.find((p) => p.id === planetId);
  if (!planet) return null;
  const body = getBodyMeaning(planetId);
  const traits = SIGN_TRAITS[planet.sign];
  const houseMeaning = HOUSE_MEANINGS[planet.house - 1];
  const rulesHouses = planetRulesHouses(planetId, chart);
  const dignity = planetDignity(planetId, planet.sign);
  const pName = rulerRef(planet.name);

  const rulesClause =
    rulesHouses.length > 0
      ? ` In your chart ${pName} also rules your ${rulesHouses.map((h) => ordinalHouse(h)).join(" and ")} house${rulesHouses.length > 1 ? "s" : ""} of ${rulesHouses.map((h) => HOUSE_MEANINGS[h - 1].title).join(" and ")}, so this placement quietly wires this area to ${rulesHouses.map((h) => HOUSE_MEANINGS[h - 1].lifeAreas[0]).join(" and ")} too.`
      : "";
  const dignityClause = dignity ? ` ${pName} is in ${dignityGloss(dignity)}.` : "";

  const synthesis = `Your ${planet.sign.toLowerCase()} ${planet.name.toLowerCase()}${planet.retrograde ? " (Rx)" : ""} sits in your ${ordinalHouse(planet.house)} house of ${houseMeaning.title}. ${body ? `${pName} governs ${body.domainShort}, and in ${planet.sign.toLowerCase()} that runs through ${traits?.essence || "its own distinct texture"}` : `In ${planet.sign.toLowerCase()} it runs through ${traits?.essence || "its own texture"}`}, playing out most visibly through ${houseMeaning.lifeAreas.slice(0, 2).join(" and ")}.${rulesClause}${dignityClause}`;

  return {
    id: planet.id,
    name: planet.name,
    sign: planet.sign,
    house: planet.house,
    retrograde: planet.retrograde,
    rulesHouses,
    dignity,
    synthesis,
  };
}

// A chart point (North Node, South Node) read completely: sign, house and the growth or release
// theme its placement describes. Points don't rule houses, so this is lighter than a planet layer
// but still refuses to name the node without interpreting its actual sign and house placement.
export interface PointLayer {
  id: string;
  name: string;
  sign: string;
  house: number;
  retrograde: boolean;
  synthesis: string;
}

export function composePointLayer(pointId: string, chart: ChartData): PointLayer | null {
  const point = chart.planets.find((p) => p.id === pointId);
  if (!point) return null;
  const traits = SIGN_TRAITS[point.sign];
  const houseMeaning = HOUSE_MEANINGS[point.house - 1];
  const isNorth = pointId === "north_node";
  const themeVerb = isNorth
    ? `your growth edge points toward ${cleanTrailing(traits?.gift)}, deliberately unfamiliar, and it's asking you to build that specifically through your ${ordinalHouse(point.house)} house of ${houseMeaning.title}, ${houseMeaning.lifeAreas.slice(0, 2).join(" and ")}`
    : `your comfort zone, the pull you already over-rely on, is ${cleanTrailing(traits?.gift)}, and it plays out through your ${ordinalHouse(point.house)} house of ${houseMeaning.title}, the well-worn groove this area keeps defaulting back into`;
  const synthesis = `Your ${point.name.toLowerCase()} in ${point.sign.toLowerCase()} in your ${ordinalHouse(point.house)} house is a direction, not a placement you were born fluent in: ${themeVerb}.`;
  return {
    id: point.id,
    name: point.name,
    sign: point.sign,
    house: point.house,
    retrograde: point.retrograde,
    synthesis,
  };
}

function cleanTrailing(s: string | undefined): string {
  return (s || "").trim().replace(/[.\s]+$/, "");
}

export interface PlacementSections {
  gifts: string;
  shadow: string;
  confidence: string;
  career: string;
  money: string;
  relationships: string;
  growth: string;
  prompts: string[];
  affirmations: string[];
  bettysTake: string;
  blindSpot: string;
  whyItRepeats: string;
  thisWeeksMove: string;
  howYoullKnow: string;
}

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export function ordinalHouse(house: number): string {
  return ORDINALS[house - 1] ?? `${house}th`;
}

// What the exact degree within a sign actually means, standard degree theory: early degrees
// carry the sign's rawest, least-filtered expression, late degrees carry its most refined and
// worldly-wise version, and the 29th degree (anaretic/critical) is the sign's energy under
// pressure to resolve before the shift into the next sign. Real astrology, not filler text.
export function degreeMeaning(degree: number): string {
  if (degree >= 29) {
    return "the anaretic degree, the very last degree of the sign. This placement carries urgency, it's the sign's energy pushed to its final, most concentrated point, right before the shift into what's next. Nothing here is casual.";
  }
  if (degree === 0) {
    return "0 degrees, the freshest point of the sign. This placement runs on raw, unfiltered energy, less refined by experience, more instinctive and immediate than a placement sitting deeper in the sign.";
  }
  if (degree <= 9) {
    return "an early degree. This placement expresses the sign in its most direct, least complicated form, close to the sign's purest instinct, before life experience adds nuance.";
  }
  if (degree <= 19) {
    return "a middle degree. This placement has settled into the sign, its themes are established and consistently expressed rather than still forming.";
  }
  return "a late degree. This placement carries the sign's most developed, worldly-wise expression, matured by the full run through everything that sign has to teach.";
}

export function getBodyMeaning(id: string): BodyMeaning | undefined {
  return BODY_MEANINGS.find((b) => b.id === id);
}

// What a hard aspect to a given planet usually means in practice, used to name a real,
// specific block rather than a generic one. This is what makes a read feel earned, not templated.
export const BLOCK_THEMES: Record<string, string> = {
  Sun: "an identity conflict, part of you wants this badly and another part is scared of who you'll become if you actually get it",
  Moon: "an old emotional undercurrent, a fear about safety or belonging, that shows up disguised as practical hesitation",
  Mercury: "overthinking so thoroughly that the plan never survives contact with your own doubt, you talk yourself out of it before anyone else gets the chance",
  Venus: "a worthiness block, some part of you believes you have to earn ease and pleasure instead of simply choosing them",
  Mars: "impatience or quiet self-sabotage that shows up right when momentum actually starts building",
  Jupiter: "a pattern of overexpanding then collapsing, you go all in, burn out, and have to start again instead of pacing yourself",
  Saturn: "a deep fear of being judged, rejected or found not good enough, so you over-prepare or hold back instead of simply going",
  Uranus: "a fear of losing your freedom or individuality the moment you actually commit to something",
  Neptune: "a habit of avoiding the hard, clear action in favour of dreaming, doubting, numbing or waiting for certainty that never comes",
  Pluto: "an old pattern of controlling everything so tightly that you never let it be easy, easy feels unsafe, so you make it harder than it needs to be",
  Chiron: "a wound around not being enough that quietly runs the whole show unless you name it out loud",
};

// Finds a real hard aspect (square or opposition) touching the given planet, so a "root block"
// read names something the chart actually shows rather than a generic shadow line. Falls back
// to the sign's own shadow trait when no hard aspect exists or the other planet has no mapping.
export function findRootBlock(chart: ChartData, bodyId: string, sign: string): string {
  const planetName = chart.planets.find((p) => p.id === bodyId)?.name;
  if (planetName) {
    const hardAspect = chart.aspects.find(
      (a) =>
        (a.type === "square" || a.type === "opposition") &&
        (a.planet1 === planetName || a.planet2 === planetName)
    );
    if (hardAspect) {
      const other = hardAspect.planet1 === planetName ? hardAspect.planet2 : hardAspect.planet1;
      const theme = BLOCK_THEMES[other];
      if (theme) {
        const verb = hardAspect.type === "square" ? "squares" : "opposes";
        return `${other} ${verb} your ${planetName.toLowerCase()}, and that tension is the real root: ${theme}.`;
      }
    }
  }
  const shadow = SIGN_TRAITS[sign]?.shadow;
  return `the shadow side of your own ${sign.toLowerCase()} energy here: ${shadow}.`;
}

// Betty's opening take on each placement, her honest professional read before the chart specifics get woven in.
const BETTY_OPENERS: Record<string, string> = {
  sun: "I see this pattern constantly in coaching. Women think confidence has to arrive before visibility. It doesn't, evidence comes after action, never before it.",
  moon: "Most women treat their emotional needs as an inconvenience to manage instead of information to use. Your moon is trying to tell you something useful, not something to override.",
  rising: "Nobody thinks about their rising sign until I point out it's the thing everyone else meets first. You've been managing your first impression by accident. Time to do it on purpose.",
  mercury: "The women I coach who struggle to be heard usually aren't short on ideas, they're short on saying them out loud before they've been perfected to death.",
  venus: "Your venus is not a beauty placement, it's a worth placement. What you think is taste is actually a direct readout of what you believe you deserve.",
  mars: "I've coached hundreds of women who call their drive \"too much\" right before they do something remarkable with it. Your mars isn't the problem, the apology attached to it is.",
  jupiter: "This is the placement everyone underuses because it feels too easy to be valuable. If something comes naturally to you here, that's not luck, that's your unfair advantage.",
  saturn: "Saturn gets a bad reputation. In twenty years I've never met a woman with an unshakeable saturn placement who didn't earn it the slow, unglamorous way first.",
  uranus: "The parts of you that feel \"too weird\" for the room are usually the exact parts building the room you're actually meant to be in.",
  neptune: "Your neptune either makes you the most intuitive person in the room or the most avoidant, and the difference is entirely whether you're using it consciously.",
  pluto: "Pluto placements scare people because they think it means darkness. It means depth. You were built to go further than most people are willing to.",
  chiron: "Every woman I've coached with a strong chiron placement eventually realises the wound and the gift are the same address. You just haven't fully moved in yet.",
  north_node: "This is the direction your whole chart is quietly pointing you. Resistance here isn't a sign you're wrong, it's a sign you're close.",
  south_node: "This is your comfort zone talking. Useful in a crisis, expensive as a permanent address.",
  lilith: "Lilith is the part of you that got edited out to make other people comfortable. I'd put it back in.",
  part_of_fortune: "This is the one placement I tell clients to actually trust without overthinking. When something here feels easy and joyful, that's not a red flag, that's the answer.",
  midheaven: "Your midheaven is what you're becoming known for whether you're intentional about it or not. Better to choose the reputation than inherit it by accident.",
};

// What people usually mislabel this placement's shadow as, so we can call out the actual blind spot directly
const PROTECTIVE_LABELS: Record<string, string> = {
  sun: "staying humble",
  moon: "being sensitive",
  rising: "being professional",
  mercury: "thinking it through properly",
  venus: "having standards",
  mars: "staying calm",
  jupiter: "being realistic",
  saturn: "being cautious",
  uranus: "keeping your options open",
  neptune: "trusting the process",
  pluto: "staying in control",
  chiron: "being resilient",
  north_node: "playing to your strengths",
  south_node: "staying comfortable",
  lilith: "being easy to work with",
  part_of_fortune: "being practical",
  midheaven: "staying humble",
};

// One concrete micro-action per placement for "this week's move"
const WEEK_MOVES: Record<string, string> = {
  sun: "do one visible thing you'd normally wait to feel ready for, post it, say it or show up to it before the doubt gets a vote",
  moon: "name one emotional need out loud to someone this week instead of managing it silently on your own",
  rising: "introduce yourself, dress or walk into a room this week exactly as the woman you're becoming, not the safest version",
  mercury: "say the unpolished version of the idea out loud or in writing before you've perfected it",
  venus: "spend or invest in something that reflects your actual taste this week, not the discounted, safer option",
  mars: "take the direct action you've been softening into a maybe, this week, without the disclaimer",
  jupiter: "say yes to the opportunity that feels slightly too big, this week, before you feel fully ready",
  saturn: "do the disciplined, unglamorous version of the task today instead of waiting for motivation to show up",
  uranus: "make the unconventional choice this week instead of the one that keeps you blending in",
  neptune: "turn one intuitive hit into a concrete action this week, instead of just noticing it and moving on",
  pluto: "let go of control over one outcome this week and notice what actually happens when you do",
  chiron: "share the thing that once felt like your wound with someone who could use the wisdom in it",
  north_node: "take one action this week in the unfamiliar direction your chart keeps pointing you toward",
  south_node: "notice when you default to the easy, familiar comfort zone this week, and choose the stretch instead once",
  lilith: "say or do the thing you've edited out to keep the room comfortable, this week, unapologetically",
  part_of_fortune: "follow the thing that feels genuinely easy and joyful this week instead of the thing that looks more impressive",
  midheaven: "publicly claim the reputation you actually want, one post, one bio line, one introduction, this week",
};

export function composePlacement(bodyId: string, sign: string, house?: number): PlacementSections | null {
  const body = getBodyMeaning(bodyId);
  const traits = SIGN_TRAITS[sign];
  if (!body || !traits) return null;

  const houseMeaning = house ? HOUSE_MEANINGS[house - 1] : undefined;
  const houseLine = houseMeaning
    ? ` Because this sits in your ${ordinalHouse(house!)} house of ${houseMeaning.title}, it plays out most strongly through ${houseMeaning.lifeAreas.slice(0, 2).join(" and ")}.`
    : "";
  const houseCareerLine = houseMeaning
    ? ` Because it's anchored in your ${ordinalHouse(house!)} house, this shows up specifically around ${houseMeaning.lifeAreas[0]}, watch for it there first.`
    : "";
  const houseMoneyLine = houseMeaning
    ? ` Your ${ordinalHouse(house!)} house of ${houseMeaning.title} is where this earning pattern actually plays out day to day, not as an abstract trait.`
    : "";
  const houseRelationshipsLine = houseMeaning
    ? ` This lands hardest in the parts of your life your ${ordinalHouse(house!)} house governs, ${houseMeaning.lifeAreas.slice(-2).join(" and ")}, so that's where to look for the pattern in real time.`
    : "";
  const houseGrowthLine = houseMeaning
    ? ` ${houseMeaning.coach}`
    : "";

  const signLower = sign.toLowerCase();
  const flavour = traits.flavour[0];
  const bodyLower = body.name.toLowerCase();

  const repeatLine = houseMeaning
    ? `This shows up on repeat because your ${ordinalHouse(house!)} house of ${houseMeaning.title} keeps putting you in situations that trigger it. Life doesn't stop serving you this lesson because you're tired of it, it stops once you actually address the root instead of managing the symptom.`
    : `This shows up on repeat because it's woven into your ${signLower} ${bodyLower}, not a one-off mood. Life keeps serving you the same lesson in a new outfit until you address the root instead of managing the symptom.`;

  return {
    gifts: `With ${bodyLower} in ${signLower}, ${body.domain} runs on ${traits.essence}. Your gift here: ${traits.gift}.${houseLine}`,
    shadow: `The shadow side of this placement is ${traits.shadow}. Naming it is the win, this pattern loses most of its power the moment you catch it in real time.`,
    confidence: `For you, ${traits.confidence}. Let ${body.title} lead and your confidence follows.`,
    career: `In your career, this placement means ${traits.career}. ${body.title.charAt(0).toUpperCase() + body.title.slice(1)} is a professional asset, build it into how you work, not around it.${houseCareerLine}`,
    money: `Money-wise, ${traits.money}. When ${body.title} is switched on, your earning power follows.${houseMoneyLine}`,
    relationships: `In love and connection, ${traits.love}. This is core to how ${body.title} shows up with the people closest to you.${houseRelationshipsLine}`,
    growth: `Your growth edge here is ${traits.growth}.${houseGrowthLine}`,
    prompts: [
      `Where in my life is my ${signLower} ${bodyLower} energy fully switched on, and where am I dimming it?`,
      `${traits.shadow.charAt(0).toUpperCase() + traits.shadow.slice(1)}, where did I learn this pattern, and what would I do today without it?`,
      `If I let myself be completely ${flavour} this week, what would change first?`,
      `What am I still calling ${PROTECTIVE_LABELS[bodyId] || "wisdom"} when it's actually fear?`,
    ],
    affirmations: [
      `My ${signLower} ${bodyLower} is a gift. I don't tone it down for anyone.`,
      `I am ${traits.flavour.slice(0, 2).join(" and ")}, and that is exactly my power.`,
    ],
    bettysTake: `${BETTY_OPENERS[bodyId] || "This placement matters more than most people give it credit for."} With your ${signLower} ${bodyLower} specifically, that plays out through ${traits.essence}. That's not a coincidence, it's the pattern your whole chart is pointing at.`,
    blindSpot: `You probably call it ${PROTECTIVE_LABELS[bodyId] || "being sensible"}. The chart says it's actually ${traits.shadow}. That gap, between what you call it and what it actually is, is exactly why it's still running the show.`,
    whyItRepeats: repeatLine,
    thisWeeksMove: WEEK_MOVES[bodyId] || `do one small, visible action this week that your ${signLower} ${bodyLower} has been quietly asking for`,
    howYoullKnow: `You'll know it's shifting when the old pattern still shows up, but you catch it faster than before, and you choose the ${flavour} response instead of the automatic one. The trigger doesn't disappear, your reaction time does.`,
  };
}

// --- Aspects in plain English ---

const ASPECT_CONNECTORS: Record<string, { verb: string; coach: string }> = {
  conjunction: {
    verb: "are fused into one force",
    coach: "They amplify each other, when one is switched on, the other fires too. This is a signature energy people recognise you by.",
  },
  trine: {
    verb: "flow together effortlessly",
    coach: "This is natural talent, so natural you probably undervalue it. Lean on it deliberately and it becomes a superpower.",
  },
  sextile: {
    verb: "open doors for each other",
    coach: "This is opportunity energy, it works beautifully when you activate it on purpose rather than waiting for it to fire on its own.",
  },
  square: {
    verb: "push against each other",
    coach: "This friction is a feature, not a flaw, it's the tension that builds your strength. The people with the biggest lives usually have the most squares.",
  },
  opposition: {
    verb: "sit at opposite ends of a see-saw",
    coach: "Your work is balance, not choosing sides, when you honour both ends, this becomes range instead of conflict.",
  },
};

// Optional per-pair context, when the caller has the actual signs and orb from the natal chart
// available, this is what stops every square in the app reading as the same recycled line, two
// different squares involving different signs genuinely mean different things.
export interface AspectContext {
  sign1?: string;
  sign2?: string;
  orb?: number;
}

export function interpretAspect(planet1: string, planet2: string, type: string, context?: AspectContext): string | null {
  const nameToId = (n: string) =>
    n === "Ascendant" ? "rising" : n === "Midheaven" ? "midheaven" : n.toLowerCase().replace(/ /g, "_");
  const b1 = getBodyMeaning(nameToId(planet1));
  const b2 = getBodyMeaning(nameToId(planet2));
  const connector = ASPECT_CONNECTORS[type];
  if (!b1 || !b2 || !connector) return null;

  const base = `Your ${b1.domainShort} and your ${b2.domainShort} ${connector.verb}. ${connector.coach}`;
  if (!context?.sign1 || !context?.sign2) return base;

  const t1 = SIGN_TRAITS[context.sign1];
  const t2 = SIGN_TRAITS[context.sign2];
  if (!t1 || !t2) return base;

  const isHard = type === "square" || type === "opposition";
  const specific = isHard
    ? ` Specifically: your ${context.sign1.toLowerCase()} ${planet1.toLowerCase()} wants ${t1.gift}, while your ${context.sign2.toLowerCase()} ${planet2.toLowerCase()} is pulling toward ${t2.gift}. That's a real, nameable tug-of-war, not a vague vibe.`
    : ` Specifically: your ${context.sign1.toLowerCase()} ${planet1.toLowerCase()}'s ${t1.gift} and your ${context.sign2.toLowerCase()} ${planet2.toLowerCase()}'s ${t2.gift} back each other up directly.`;

  const orbLine =
    context.orb !== undefined
      ? context.orb <= 2
        ? " Under a 2° orb, this is about as exact as this pattern gets, it runs loud, not subtle."
        : context.orb > 5
          ? " With a wider orb, this shows up more as background texture than a constant pull."
          : ""
      : "";

  return `${base}${specific}${orbLine}`;
}
