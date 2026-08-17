import swisseph from "swisseph";
import { isApplying } from "@/lib/astrology";
import path from "path";
import { DateTime } from "luxon";
import {
  type ChartData,
  type TransitData,
  type TransitPosition,
  type TransitAspect,
  type ActivatedPlacement,
  type MoonPhase,
  type AspectType,
  type YourSznData,
  type FocusArea,
  type MonthlyTheme,
  type JournalPrompt,
  type ManifestationMission,
  type CosmicForecast,
  type NextBestStep,
  type Recommendation,
  ZODIAC_SIGNS,
  ASPECT_CONFIG,
} from "@/types/chart";

const EPHE_PATH = path.join(process.cwd(), "ephe");
swisseph.swe_set_ephe_path(EPHE_PATH);

const TRANSIT_PLANETS = [
  { id: "sun", name: "Sun", swissId: swisseph.SE_SUN },
  { id: "moon", name: "Moon", swissId: swisseph.SE_MOON },
  { id: "mercury", name: "Mercury", swissId: swisseph.SE_MERCURY },
  { id: "venus", name: "Venus", swissId: swisseph.SE_VENUS },
  { id: "mars", name: "Mars", swissId: swisseph.SE_MARS },
  { id: "jupiter", name: "Jupiter", swissId: swisseph.SE_JUPITER },
  { id: "saturn", name: "Saturn", swissId: swisseph.SE_SATURN },
  { id: "uranus", name: "Uranus", swissId: swisseph.SE_URANUS },
  { id: "neptune", name: "Neptune", swissId: swisseph.SE_NEPTUNE },
  { id: "pluto", name: "Pluto", swissId: swisseph.SE_PLUTO },
  { id: "chiron", name: "Chiron", swissId: swisseph.SE_CHIRON },
  { id: "north_node", name: "North Node", swissId: swisseph.SE_TRUE_NODE },
];

function longitudeToSign(longitude: number) {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized - signIndex * 30;
  const degree = Math.floor(signDegree);
  const minuteFloat = (signDegree - degree) * 60;
  const minute = Math.floor(minuteFloat);
  return { sign: ZODIAC_SIGNS[signIndex], degree, minute };
}

function findNatalHouse(longitude: number, natalCusps: number[]): number {
  const normalized = ((longitude % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const nextI = (i + 1) % 12;
    const cuspStart = natalCusps[i];
    const cuspEnd = natalCusps[nextI];
    if (cuspEnd < cuspStart) {
      if (normalized >= cuspStart || normalized < cuspEnd) return i + 1;
    } else {
      if (normalized >= cuspStart && normalized < cuspEnd) return i + 1;
    }
  }
  return 1;
}

function getMoonPhase(sunLong: number, moonLong: number): MoonPhase {
  const angle = ((moonLong - sunLong + 360) % 360);
  const illumination = Math.round((1 - Math.cos((angle * Math.PI) / 180)) / 2 * 100);

  if (angle < 11.25) return { phase: "New Moon", illumination, emoji: "🌑" };
  if (angle < 78.75) return { phase: "Waxing Crescent", illumination, emoji: "🌒" };
  if (angle < 101.25) return { phase: "First Quarter", illumination, emoji: "🌓" };
  if (angle < 168.75) return { phase: "Waxing Gibbous", illumination, emoji: "🌔" };
  if (angle < 191.25) return { phase: "Full Moon", illumination, emoji: "🌕" };
  if (angle < 258.75) return { phase: "Waning Gibbous", illumination, emoji: "🌖" };
  if (angle < 281.25) return { phase: "Last Quarter", illumination, emoji: "🌗" };
  if (angle < 348.75) return { phase: "Waning Crescent", illumination, emoji: "🌘" };
  return { phase: "New Moon", illumination, emoji: "🌑" };
}

// Significance based on which planets are involved
function getSignificance(transitPlanet: string, natalPlanet: string): "major" | "moderate" | "minor" {
  const outerPlanets = ["Saturn", "Uranus", "Neptune", "Pluto", "Chiron"];
  const personalPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Ascendant"];

  if (outerPlanets.includes(transitPlanet) && personalPlanets.includes(natalPlanet)) return "major";
  if (outerPlanets.includes(transitPlanet) && outerPlanets.includes(natalPlanet)) return "moderate";
  if (transitPlanet === "Jupiter" && personalPlanets.includes(natalPlanet)) return "major";
  if (personalPlanets.includes(transitPlanet) && personalPlanets.includes(natalPlanet)) return "moderate";
  return "minor";
}

// Theme mapping for activated placements
const PLANET_THEMES: Record<string, Record<string, string>> = {
  Sun: { conjunction: "identity awakening", opposition: "self vs other", square: "growth through tension", trine: "creative flow", sextile: "new opportunities" },
  Moon: { conjunction: "emotional reset", opposition: "emotional balance", square: "emotional growth", trine: "emotional ease", sextile: "nurturing connections" },
  Mercury: { conjunction: "mental clarity", opposition: "perspective shift", square: "communication challenge", trine: "intellectual flow", sextile: "learning opportunity" },
  Venus: { conjunction: "love activation", opposition: "relationship mirror", square: "values challenge", trine: "pleasure & abundance", sextile: "creative opening" },
  Mars: { conjunction: "energy surge", opposition: "assertiveness check", square: "drive under pressure", trine: "motivated action", sextile: "strategic moves" },
  Jupiter: { conjunction: "expansion & luck", opposition: "growth through others", square: "overextension risk", trine: "easy abundance", sextile: "opportunity knocks" },
  Saturn: { conjunction: "maturity call", opposition: "responsibility balance", square: "structural challenge", trine: "disciplined progress", sextile: "steady building" },
  Uranus: { conjunction: "sudden awakening", opposition: "freedom vs stability", square: "radical change", trine: "innovative breakthroughs", sextile: "exciting shifts" },
  Neptune: { conjunction: "spiritual awakening", opposition: "illusion vs reality", square: "confusion clearing", trine: "divine inspiration", sextile: "intuitive downloads" },
  Pluto: { conjunction: "deep transformation", opposition: "power dynamics", square: "intense rebirth", trine: "empowered evolution", sextile: "subtle power shift" },
  Chiron: { conjunction: "healing activation", opposition: "wound awareness", square: "healing challenge", trine: "wisdom integration", sextile: "healing opportunity" },
  "North Node": { conjunction: "destiny calling", opposition: "karmic release", square: "purpose tension", trine: "aligned growth", sextile: "soul path opening" },
  Ascendant: { conjunction: "glow-up activation", opposition: "relationship mirror", square: "identity shake-up", trine: "effortless magnetism", sextile: "fresh energy incoming" },
};

export function calculateTransits(natalChart: ChartData): TransitData {
  const now = DateTime.utc();
  const hour = now.hour + now.minute / 60 + now.second / 3600;

  const julianDay = swisseph.swe_julday(
    now.year, now.month, now.day, hour, swisseph.SE_GREG_CAL
  ) as unknown as number;

  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
  const natalCusps = natalChart.houses.map((h) => h.longitude);

  const currentPositions: TransitPosition[] = [];

  for (const planet of TRANSIT_PLANETS) {
    const result = swisseph.swe_calc_ut(julianDay, planet.swissId, flags) as {
      longitude: number; latitude: number; longitudeSpeed: number;
    };
    const signData = longitudeToSign(result.longitude);
    const natalHouse = findNatalHouse(result.longitude, natalCusps);

    currentPositions.push({
      id: planet.id,
      name: planet.name,
      longitude: result.longitude,
      sign: signData.sign,
      degree: signData.degree,
      minute: signData.minute,
      retrograde: result.longitudeSpeed < 0,
      longitudeSpeed: result.longitudeSpeed,
      natalHouse,
    });
  }

  // Calculate transit-to-natal aspects
  const transitAspects: TransitAspect[] = [];
  const aspectTypes = Object.entries(ASPECT_CONFIG) as [AspectType, (typeof ASPECT_CONFIG)[AspectType]][];

  // Use tighter orbs for transits
  const transitOrbs: Record<string, number> = {
    Sun: 2, Moon: 2, Mercury: 2, Venus: 2, Mars: 3,
    Jupiter: 3, Saturn: 3, Uranus: 2, Neptune: 2, Pluto: 2,
    Chiron: 2, "North Node": 2,
  };

  // Include the Ascendant (Rising) as a natal sensitive point
  const ascendantLong = natalChart.ascendant;
  const ascSignData = longitudeToSign(ascendantLong);
  const natalPointsToCheck = [
    ...natalChart.planets,
    { id: "ascendant", name: "Ascendant", longitude: ascendantLong, sign: ascSignData.sign, degree: ascSignData.degree, minute: ascSignData.minute, house: 1, retrograde: false },
  ];

  for (const transit of currentPositions) {
    for (const natal of natalPointsToCheck) {
      let diff = Math.abs(transit.longitude - natal.longitude);
      if (diff > 180) diff = 360 - diff;

      const maxOrb = transitOrbs[transit.name] || 2;

      for (const [type, config] of aspectTypes) {
        const orb = Math.abs(diff - config.angle);
        if (orb <= maxOrb) {
          transitAspects.push({
            transitPlanet: transit.name,
            transitSign: transit.sign,
            transitDegree: transit.degree,
            natalPlanet: natal.name,
            natalSign: natal.sign,
            natalDegree: natal.degree,
            aspectType: type,
            orb: Math.round(orb * 100) / 100,
            applying: isApplying(transit.longitude, transit.longitudeSpeed, natal.longitude, 0, config.angle),
            significance: getSignificance(transit.name, natal.name),
          });
          break;
        }
      }
    }
  }

  // Sort by significance then orb
  const sigOrder = { major: 0, moderate: 1, minor: 2 };
  transitAspects.sort((a, b) => sigOrder[a.significance] - sigOrder[b.significance] || a.orb - b.orb);

  // Activated placements
  const activatedPlacements: ActivatedPlacement[] = transitAspects
    .filter((a) => a.significance !== "minor")
    .slice(0, 8)
    .map((a) => {
      const natalP = natalChart.planets.find((p) => p.name === a.natalPlanet);
      const themes = PLANET_THEMES[a.natalPlanet] || PLANET_THEMES["Sun"];
      return {
        natalPlanet: a.natalPlanet,
        natalSign: a.natalSign,
        natalHouse: natalP?.house || 1,
        activatedBy: a.transitPlanet,
        aspectType: a.aspectType,
        orb: a.orb,
        theme: themes[a.aspectType] || "activation",
      };
    });

  // Moon phase
  const sunPos = currentPositions.find((p) => p.name === "Sun")!;
  const moonPos = currentPositions.find((p) => p.name === "Moon")!;
  const moonPhase = getMoonPhase(sunPos.longitude, moonPos.longitude);

  return {
    currentPositions,
    transitAspects,
    activatedPlacements,
    moonPhase,
    calculatedAt: new Date().toISOString(),
  };
}

// --- Content Generation (rule-based, ready for AI layer) ---

const HOUSE_THEMES: Record<number, { area: string; theme: string }> = {
  1: { area: "Self", theme: "who you are and how you show up in the world" },
  2: { area: "Money", theme: "your bank account, your values and knowing your worth" },
  3: { area: "Communication", theme: "your voice, your mind and your social butterfly energy" },
  4: { area: "Home", theme: "your roots, your safe space and your inner world" },
  5: { area: "Love", theme: "romance, creativity, pleasure and main character energy" },
  6: { area: "Health", theme: "your routines, your body and your daily magic" },
  7: { area: "Relationships", theme: "partnerships, collabs and your ride-or-die connections" },
  8: { area: "Transformation", theme: "the deep stuff: intimacy, power and total rebirth" },
  9: { area: "Growth", theme: "travel, big ideas and levelling the heck up" },
  10: { area: "Career", theme: "your reputation, your legacy and being the boss" },
  11: { area: "Community", theme: "your squad, your vision and your wildest dreams" },
  12: { area: "Healing", theme: "your spiritual side, rest and behind-the-scenes magic" },
};

const FOCUS_AREA_MAP: Record<string, { areas: string[]; emoji: string }> = {
  Love: { areas: ["Love", "Relationships"], emoji: "💕" },
  Money: { areas: ["Money", "Career"], emoji: "💰" },
  Career: { areas: ["Career", "Growth"], emoji: "🚀" },
  Friendships: { areas: ["Community", "Communication"], emoji: "🤝" },
  Healing: { areas: ["Healing", "Transformation", "Health"], emoji: "🌿" },
  "Self-Worth": { areas: ["Self", "Money"], emoji: "✨" },
};

function generateTheme(transits: TransitData, natalChart: ChartData): MonthlyTheme {
  const majorTransits = transits.transitAspects.filter((a) => a.significance === "major");
  const topActivated = transits.activatedPlacements.slice(0, 3);

  // Find the most activated house
  const houseCounts: Record<number, number> = {};
  for (const a of transits.activatedPlacements) {
    houseCounts[a.natalHouse] = (houseCounts[a.natalHouse] || 0) + 1;
  }
  const topHouse = Object.entries(houseCounts).sort(([, a], [, b]) => b - a)[0];
  const houseNum = topHouse ? parseInt(topHouse[0]) : 1;
  const houseTheme = HOUSE_THEMES[houseNum];

  // Generate theme based on what's most activated
  const themes = topActivated.map((a) => a.theme);
  const keyTransitDescs = majorTransits.slice(0, 3).map((t) =>
    `${t.transitPlanet} in ${t.transitSign} ${t.aspectType} your natal ${t.natalPlanet}`
  );

  const titleOptions: Record<string, string> = {
    "identity awakening": "Main Character Energy Activated",
    "love activation": "Your Heart is WIDE Open, Babe",
    "deep transformation": "Burning It Down to Build It Better",
    "expansion & luck": "Everything is Expanding (Yes, Including Your Bank Account)",
    "healing activation": "Healing Season is Here and You're So Ready",
    "maturity call": "Boss Era: Building Something That Lasts",
    "sudden awakening": "Plot Twist! And You're Going to Love It",
    "spiritual awakening": "Your Intuition is Screaming. Listen!",
    "destiny calling": "Your Purpose is Calling. Pick Up!",
    "emotional reset": "Coming Home to the Real You",
    "energy surge": "Big Bold Moves Only",
    "mental clarity": "Say It Louder for the People in the Back",
    "glow-up activation": "Your Rising Sign is Being Activated. GLOW UP INCOMING!",
    "effortless magnetism": "Main Character Magnetism is OFF THE CHARTS",
    "identity shake-up": "New Look, New Vibe, New You",
    "fresh energy incoming": "Fresh Energy Coming In Hot For Your Rising",
  };

  const title = titleOptions[themes[0]] || "Growth, Glow-Ups & Cosmic Alignment";

  return {
    title,
    description: `OK so the universe is literally lighting up your ${houseTheme.area.toLowerCase()} sector right now, which is all about ${houseTheme.theme}. With ${topActivated.length} key placements getting activated, this is a seriously powerful time for ${themes.slice(0, 2).join(" and ")}. Don't sleep on this energy!`,
    keyTransits: keyTransitDescs,
  };
}

function generateFocusAreas(transits: TransitData, natalChart: ChartData): FocusArea[] {
  const areas: FocusArea[] = [];

  for (const [areaName, config] of Object.entries(FOCUS_AREA_MAP)) {
    const activePlanets: string[] = [];
    let relevance = 0;

    for (const placement of transits.activatedPlacements) {
      const houseTheme = HOUSE_THEMES[placement.natalHouse];
      if (houseTheme && config.areas.includes(houseTheme.area)) {
        activePlanets.push(`${placement.activatedBy} → ${placement.natalPlanet}`);
        relevance++;
      }
    }

    // Also check which houses transit planets are passing through
    for (const pos of transits.currentPositions) {
      const houseTheme = HOUSE_THEMES[pos.natalHouse];
      if (houseTheme && config.areas.includes(houseTheme.area) && !["Moon"].includes(pos.name)) {
        if (!activePlanets.includes(pos.name)) {
          activePlanets.push(`${pos.name} transiting House ${pos.natalHouse}`);
          relevance += 0.5;
        }
      }
    }

    const summaries: Record<string, string[]> = {
      Love: [
        "Your love sector is getting cosmic attention right now. Stay open, stay honest, and let it get deep!",
        "Relationships are shifting. What's aligned gets better. What's not? It's giving you the clarity to move on.",
        "Romance is playing it cool right now, but self-love? That's where the real magic is happening, gorgeous.",
      ],
      Money: [
        "Money energy is building and your instincts around cash are spot on. Trust yourself!",
        "Your value is being totally redefined. Stop undercharging, stop over-giving, and start asking for what you're actually worth.",
        "Slow and steady wins the financial game right now. You're building something real here.",
      ],
      Career: [
        "Career momentum is picking up and opportunities are coming from the most unexpected places. Stay ready!",
        "Your public presence is shifting in a big way. Time to step into the spotlight with zero apologies.",
        "It's strategy season, not sprint season. Lay the groundwork now so future you can absolutely crush it.",
      ],
      Friendships: [
        "Your social world is buzzing! Quality over quantity though. Protect your energy and pour into the people who pour back.",
        "New soul-aligned connections are incoming. Your vibe is literally attracting your tribe right now.",
        "Go deep with the ones who matter instead of spreading yourself thin. Real friendships are the ultimate luxury.",
      ],
      Healing: [
        "Deep healing is SO available to you right now. Old patterns are ready to go. Let them!",
        "Your body and soul are asking for attention. Give yourself what you need without guilt. You deserve it!",
        "Spiritual growth is on turbo mode. Trust the process even when it feels messy. That's where the gold is.",
      ],
      "Self-Worth": [
        "This is your 'know your worth and then add tax' moment. Seriously. Step all the way into it.",
        "You're outgrowing old versions of yourself and it's beautiful. Let go of who you were. She served her purpose!",
        "Self-worth is your literal superpower right now. Everything in your life flows from how much you back yourself.",
      ],
    };

    const summaryIdx = Math.min(
      Math.floor(relevance),
      (summaries[areaName]?.length || 1) - 1
    );

    areas.push({
      area: areaName,
      emoji: config.emoji,
      summary: summaries[areaName]?.[summaryIdx] || "Energy is building in this area of your life.",
      activePlanets: activePlanets.slice(0, 3),
    });
  }

  // Sort by most active areas first
  return areas.sort((a, b) => b.activePlanets.length - a.activePlanets.length);
}

function generateJournalPrompts(transits: TransitData, natalChart: ChartData): JournalPrompt[] {
  const prompts: JournalPrompt[] = [];
  const activated = transits.activatedPlacements.slice(0, 5);

  const planetPrompts: Record<string, string[]> = {
    Sun: ["If I stopped performing and just EXISTED, who would I actually be?", "Where am I dimming my sparkle to make other people comfortable? (Stop that immediately.)", "What would I do RIGHT NOW if failure literally wasn't a thing?"],
    Moon: ["What feelings am I stuffing down, and what are they really trying to tell me?", "What does feeling truly safe and held look like for me? Am I giving myself that?", "How can I mother myself better this month? Like, actually prioritise MY comfort?"],
    Mercury: ["What truth have I been swallowing instead of speaking? Time to spit it out, babe.", "What old story am I telling myself that's way past its expiry date?", "How do I ask for what I need without adding 'sorry' or 'if that's OK' to the end?"],
    Venus: ["What do I ACTUALLY desire in love? Not what I've settled for. What I really, truly want.", "Where am I blocking myself from receiving? Money, love, compliments, all of it!", "What makes me feel gorgeous and alive? Am I doing enough of that?"],
    Mars: ["What am I ready to go to WAR for? What matters enough to get fierce about?", "Where do I need to stop overthinking and just DO the thing already?", "What boundary needs to be set TODAY? No more being nice about it."],
    Jupiter: ["Where is the universe literally begging me to dream bigger?", "What limiting belief am I ready to toss in the bin forever?", "How can I let abundance in without feeling guilty about it? (Spoiler: you deserve it.)"],
    Saturn: ["What am I avoiding that I know would change everything if I just committed?", "What does future me need present me to build RIGHT NOW?", "Where do I need to stop winging it and actually get disciplined?"],
    Chiron: ["What wound keeps wearing different costumes but it's the same thing every time?", "What if my biggest pain was actually my biggest superpower in disguise?", "What would it look like if I actually, fully, completely healed this?"],
    Pluto: ["What am I clinging to that needs to be released so I can become who I'm meant to be?", "Where am I leaking my power to people who haven't earned it?", "What truth am I terrified to look at? (That's exactly where the magic is.)"],
    Neptune: ["What is my intuition SCREAMING at me that I keep ignoring?", "Where do I need to surrender control and just trust the process?", "What dream have I been keeping small that's ready to be the full, ridiculous, gorgeous vision?"],
    Uranus: ["Where in my life am I bored, restless and craving total freedom?", "What would I change about my life tomorrow if literally nobody had an opinion?", "What version of me has expired? She was great, but she's done. Who's next?"],
    "North Node": ["What is my soul screaming at me to do that my ego keeps vetoing?", "What fear is standing between me and my actual destiny? Name it!", "If I followed the pull instead of the plan, where would I end up?"],
    Ascendant: ["How do I want the world to see me? Is that matching who I actually am right now?", "What would change if I dressed, spoke and moved like the most confident version of myself?", "What first impression am I giving vs. what I actually want to be radiating? Time to close the gap!"],
  };

  for (const a of activated) {
    const options = planetPrompts[a.natalPlanet] || planetPrompts["Sun"];
    const idx = Math.floor(Math.abs(a.orb * 10)) % options.length;
    prompts.push({
      prompt: options[idx],
      relatedPlacement: `${a.activatedBy} ${a.aspectType} ${a.natalPlanet} in ${a.natalSign}`,
    });
  }

  // Ensure at least 3 prompts
  while (prompts.length < 3) {
    const moonSign = natalChart.planets.find((p) => p.name === "Moon")?.sign || "Cancer";
    prompts.push({
      prompt: "What amazing things have happened lately that I haven't even celebrated yet? Time to acknowledge my own magic!",
      relatedPlacement: `Moon in ${moonSign}`,
    });
  }

  return prompts.slice(0, 5);
}

function generateManifestationMission(transits: TransitData, natalChart: ChartData): ManifestationMission {
  const topActivation = transits.activatedPlacements[0];
  const jupiterPos = transits.currentPositions.find((p) => p.name === "Jupiter");
  const jupiterHouse = jupiterPos?.natalHouse || 1;
  const houseTheme = HOUSE_THEMES[jupiterHouse];

  if (topActivation) {
    const missions: Record<string, { mission: string; action: string }> = {
      "identity awakening": { mission: "Be so unapologetically YOU that people can't look away", action: "Do one thing this week that makes you feel electric. The scarier, the better." },
      "love activation": { mission: "Become a total magnet for love by loving yourself outrageously first", action: "Write yourself the most extra love letter and read it every morning. No cringe allowed!" },
      "deep transformation": { mission: "Torch the things that are keeping you small. You've outgrown them!", action: "Name your biggest energy vampire. Then cut the cord. Today." },
      "expansion & luck": { mission: "Say yes to something that makes your comfort zone QUAKE", action: "Send one audacious DM, make one wild ask, or apply for the thing you think you're not ready for. (You are.)" },
      "healing activation": { mission: "Make healing your most luxurious daily ritual", action: "Give yourself 10 sacred minutes a day. Meditation, tapping, journaling, whatever feels like medicine." },
      "maturity call": { mission: "Build something so solid that future you sends a thank you card", action: "Map out the next 90 days. Pick step one. Commit like your dream life depends on it (because it does)." },
      "sudden awakening": { mission: "Let the universe surprise you and ENJOY the plot twist", action: "Try something wildly new. Shock yourself. That's where the breakthroughs live." },
      "destiny calling": { mission: "Stop playing small and take one bold step toward your actual purpose", action: "Whatever lights you up and makes time disappear? Do more of THAT. Like, starting now." },
      "glow-up activation": { mission: "Your rising sign is ON. Time to become the most magnetic version of yourself", action: "Update your look, your energy, your vibe. Book the hair appointment, curate the wardrobe, walk into rooms like you own them." },
      "effortless magnetism": { mission: "You are literally radiating right now. Use this energy to attract everything you want", action: "Show up. Be visible. Post the thing, wear the outfit, take up space. People can't look away and that's the point." },
      "identity shake-up": { mission: "Who you've been is evolving. Let the new version of you breathe!", action: "Clear out anything that feels like the old you: clothes, habits, energy. Make room for who's coming next." },
      "fresh energy incoming": { mission: "Fresh cosmic energy is hitting your rising sign. New chapter unlocked!", action: "Try a completely new style, a new routine, or show up somewhere totally unexpected. Reinvention is your superpower right now." },
    };

    const m = missions[topActivation.theme] || { mission: `Pour your energy into ${houseTheme.theme}. The cosmos is backing you!`, action: "Journal on what this area of your life is asking for. Then give it that!" };

    return {
      mission: m.mission,
      basedOn: `${topActivation.activatedBy} ${topActivation.aspectType} your ${topActivation.natalPlanet} in ${topActivation.natalSign}`,
      actionStep: m.action,
    };
  }

  return {
    mission: `Go ALL IN on your ${houseTheme.area.toLowerCase()} sector because Jupiter is handing you a cosmic permission slip for ${houseTheme.theme}!`,
    basedOn: `Jupiter transiting your ${jupiterHouse}${jupiterHouse === 1 ? "st" : jupiterHouse === 2 ? "nd" : jupiterHouse === 3 ? "rd" : "th"} house`,
    actionStep: "Grab your journal and spend 10 minutes writing about what expansion ACTUALLY looks like for you. Get specific. Get excited!",
  };
}

function generateForecast(transits: TransitData, natalChart: ChartData): CosmicForecast {
  const majorTransits = transits.transitAspects.filter((a) => a.significance === "major");
  const trines = majorTransits.filter((a) => a.aspectType === "trine" || a.aspectType === "sextile");
  const squares = majorTransits.filter((a) => a.aspectType === "square" || a.aspectType === "opposition");

  const jupiterHouse = transits.currentPositions.find((p) => p.name === "Jupiter")?.natalHouse || 1;
  const saturnHouse = transits.currentPositions.find((p) => p.name === "Saturn")?.natalHouse || 1;

  const opportunity = trines.length > 0
    ? `${trines[0].transitPlanet} is literally cheering on your ${trines[0].natalPlanet} right now. Lean ALL the way into ${PLANET_THEMES[trines[0].natalPlanet]?.[trines[0].aspectType] || "this energy"}!`
    : `Jupiter in your ${HOUSE_THEMES[jupiterHouse].area.toLowerCase()} sector is giving you the green light for ${HOUSE_THEMES[jupiterHouse].theme}. Go big!`;

  const challenge = squares.length > 0
    ? `${squares[0].transitPlanet} is poking your ${squares[0].natalPlanet}, which can feel spicy. Work through ${PLANET_THEMES[squares[0].natalPlanet]?.[squares[0].aspectType] || "this challenge"} instead of pushing against it.`
    : `Saturn in your ${HOUSE_THEMES[saturnHouse].area.toLowerCase()} sector is testing your patience around ${HOUSE_THEMES[saturnHouse].theme}. Breathe. You've got this.`;

  // Generate some lucky days based on moon transits to natal Jupiter/Venus
  const now = DateTime.utc();
  const luckyDays: string[] = [];
  const manifestDates: string[] = [];

  // Simple approach: highlight days based on current moon phase cycle
  for (let i = 1; i <= 30; i++) {
    const day = now.plus({ days: i });
    if (i % 7 === 3) luckyDays.push(day.toFormat("MMMM d"));
    if (i % 14 === 0) manifestDates.push(day.toFormat("MMMM d"));
  }

  return {
    biggestOpportunity: opportunity,
    biggestChallenge: challenge,
    sayYesTo: trines.length > 0
      ? `anything that feels expansive around ${HOUSE_THEMES[transits.currentPositions.find((p) => p.name === trines[0].transitPlanet)?.natalHouse || 1].theme}. Your cosmic green light is ON!`
      : "new connections, unexpected invitations and anything that makes you feel alive!",
    avoid: squares.length > 0
      ? "rushing big decisions just because you feel pressure. Give yourself room to breathe and process first."
      : "overcommitting, people-pleasing and saying yes when your whole body is screaming no.",
    luckyDays: luckyDays.slice(0, 4),
    manifestationDates: manifestDates.slice(0, 2),
  };
}

function generateRecommendations(transits: TransitData, natalChart: ChartData): Recommendation[] {
  const recs: Recommendation[] = [];
  const activated = transits.activatedPlacements;

  // Saturn transits → structure/boundaries content
  const saturnActive = activated.find((a) => a.activatedBy === "Saturn");
  if (saturnActive) {
    recs.push({
      type: "workshop",
      title: "Boundaries are Hot",
      description: `Saturn is coming for your ${saturnActive.natalPlanet}, and you are ready for it. Build real structure around ${HOUSE_THEMES[saturnActive.natalHouse].theme}. Boss moves only.`,
      basedOn: `Saturn ${saturnActive.aspectType} ${saturnActive.natalPlanet}`,
      emoji: "🏗️",
    });
    recs.push({
      type: "tapping",
      title: "Tap Through the Saturn Feels",
      description: "Saturn transits can feel heavy, we know. This EFT session helps you soften into the lesson instead of fighting it.",
      basedOn: `Saturn transit in House ${saturnActive.natalHouse}`,
      emoji: "🤲",
    });
  }

  // Venus/Moon activations → love/self-worth content
  const venusActive = activated.find((a) => a.natalPlanet === "Venus" || a.activatedBy === "Venus");
  if (venusActive) {
    recs.push({
      type: "hypnosis",
      title: "Become Absolutely Magnetic",
      description: "A guided hypnosis that reconnects you with your inherent worth so you become a total magnet for everything you desire. Yes, everything.",
      basedOn: `Venus activation in ${venusActive.natalSign}`,
      emoji: "🌹",
    });
    recs.push({
      type: "article",
      title: `Venus in ${venusActive.natalSign}: Your Love Language Decoded`,
      description: `How your Venus placement shapes what you crave, how you flirt, and what makes you feel like a million bucks. Essential reading!`,
      basedOn: `Venus in ${venusActive.natalSign}`,
      emoji: "💕",
    });
  }

  // Chiron activations → healing content
  const chironActive = activated.find((a) => a.natalPlanet === "Chiron" || a.activatedBy === "Chiron");
  if (chironActive) {
    recs.push({
      type: "tapping",
      title: "Heal the Wound Beneath the Wound",
      description: `Your Chiron in ${chironActive.natalSign} is getting activated. This EFT session goes DEEP to the root of the pattern. Tissues optional but recommended.`,
      basedOn: `Chiron in ${chironActive.natalSign}`,
      emoji: "💚",
    });
    recs.push({
      type: "article",
      title: `Chiron in ${chironActive.natalSign}: Your Superpower Origin Story`,
      description: "Your deepest wound is literally the source of your greatest gift. Sounds dramatic because it IS. Let's unpack it.",
      basedOn: `Chiron activation`,
      emoji: "🌿",
    });
  }

  // Pluto/Scorpio → shadow work
  const plutoActive = activated.find((a) => a.activatedBy === "Pluto" || a.natalPlanet === "Pluto");
  if (plutoActive) {
    recs.push({
      type: "workshop",
      title: "Shadow Work (But Make It Chic)",
      description: "Pluto is asking you to go deep. This workshop walks you through confronting your shadow self, and she has so much to teach you.",
      basedOn: `Pluto ${plutoActive.aspectType} ${plutoActive.natalPlanet}`,
      emoji: "🔮",
    });
  }

  // Jupiter → expansion/money content
  const jupiterActive = activated.find((a) => a.activatedBy === "Jupiter");
  if (jupiterActive) {
    recs.push({
      type: "podcast",
      title: "Next Level Loading...",
      description: `Jupiter is activating your ${jupiterActive.natalPlanet} which means EXPANSION is the vibe. Listen to learn how to ride this wave like a pro.`,
      basedOn: `Jupiter ${jupiterActive.aspectType} ${jupiterActive.natalPlanet}`,
      emoji: "🎧",
    });
  }

  // North Node → purpose content
  const nnActive = activated.find((a) => a.natalPlanet === "North Node" || a.activatedBy === "North Node");
  if (nnActive) {
    recs.push({
      type: "reading",
      title: "Your Soul Has a GPS. Let's Use It.",
      description: "Your North Node is lit up right now which means destiny is calling LOUD. Get crystal clear on where your soul wants to go.",
      basedOn: `North Node activation`,
      emoji: "🧭",
    });
  }

  // Rising sign / Ascendant activations → style, fashion, identity content
  const risingActive = activated.find((a) => a.natalPlanet === "Ascendant");
  const risingSign = natalChart.houses[0]?.sign || "Aries";

  const risingStyleGuides: Record<string, { vibe: string; colours: string; pieces: string }> = {
    Aries: { vibe: "bold, sporty-chic, red-hot main character", colours: "red, black, metallics", pieces: "structured blazers, statement earrings, anything with edge" },
    Taurus: { vibe: "luxe, sensual, 'I woke up like this' elegance", colours: "emerald, cream, rose gold", pieces: "cashmere everything, silk scarves, quality over quantity always" },
    Gemini: { vibe: "playful, trend-forward, never the same outfit twice", colours: "yellow, pastels, colour-blocking", pieces: "layered accessories, mix-and-match sets, conversation-starting prints" },
    Cancer: { vibe: "soft, romantic, cosy-but-make-it-fashion", colours: "silver, white, soft blue, pearl", pieces: "linen dresses, moonstone jewellery, anything that feels like a hug" },
    Leo: { vibe: "dramatic, golden, 'all eyes on me' energy", colours: "gold, orange, royal purple", pieces: "statement sunglasses, bold prints, anything with a bit of sparkle" },
    Virgo: { vibe: "minimal, curated, effortlessly put-together", colours: "sage, navy, cream, earth tones", pieces: "tailored trousers, delicate jewellery, the perfect white shirt" },
    Libra: { vibe: "balanced, romantic, gallery-opening gorgeous", colours: "pink, baby blue, champagne", pieces: "matching sets, ballet flats, anything symmetrical and pretty" },
    Scorpio: { vibe: "magnetic, dark-femme, mysteriously chic", colours: "black, burgundy, deep plum", pieces: "leather jackets, dark florals, sunglasses indoors (yes really)" },
    Sagittarius: { vibe: "adventurous, eclectic, boho-meets-cosmopolitan", colours: "purple, turquoise, burnt orange", pieces: "oversized bags, travel-inspired jewellery, boots that go anywhere" },
    Capricorn: { vibe: "power-dressing, timeless, 'she means business' chic", colours: "black, charcoal, camel, deep green", pieces: "blazers, pointed-toe shoes, investment accessories" },
    Aquarius: { vibe: "avant-garde, techy, 'is she from the future?' cool", colours: "electric blue, silver, neon accents", pieces: "unique silhouettes, vintage finds, platform shoes" },
    Pisces: { vibe: "dreamy, ethereal, mermaid-off-duty glamour", colours: "seafoam, lavender, iridescent", pieces: "flowing fabrics, crystal jewellery, anything that catches the light" },
  };

  const styleGuide = risingStyleGuides[risingSign] || risingStyleGuides["Aries"];

  // Always include rising sign style guide (it's fashion, it's always relevant!)
  recs.push({
    type: "article",
    title: `${risingSign} Rising Style Guide: Dress Your Chart`,
    description: `Your rising sign is how the world sees you, so dress like it! Your vibe is ${styleGuide.vibe}. Think ${styleGuide.colours} and ${styleGuide.pieces}.`,
    basedOn: `${risingSign} Ascendant`,
    emoji: "👗",
  });

  if (risingActive) {
    recs.push({
      type: "workshop",
      title: `Your ${risingSign} Rising Glow-Up`,
      description: `Your Ascendant is literally being activated right now, which means your whole look, energy and first impression is evolving. This is your cosmic makeover moment. Let's go!`,
      basedOn: `${risingActive.activatedBy} ${risingActive.aspectType} Ascendant`,
      emoji: "✨",
    });
  }

  // Always include a placement guide for the most activated natal planet
  if (activated.length > 0) {
    const top = activated[0];
    recs.push({
      type: "placement",
      title: `Your ${top.natalPlanet} in ${top.natalSign} Deep Dive`,
      description: `This placement is ACTIVATED right now. Understanding it is basically a cheat code for navigating this entire season. You're welcome.`,
      basedOn: `Most activated placement`,
      emoji: "📖",
    });
  }

  return recs.slice(0, 8);
}

function generateNextBestStep(transits: TransitData, natalChart: ChartData, recs: Recommendation[]): NextBestStep {
  const top = transits.activatedPlacements[0];
  if (!top) {
    return {
      message: "Your chart is in integration mode right now. Use this calm before the storm to rest, reflect and get ready for what's next. (It's going to be good.)",
      cta: "Explore Your Full Chart",
      link: "/results",
    };
  }

  const messages: Record<string, { message: string; cta: string }> = {
    "healing activation": {
      message: `Your chart is begging you to heal around ${HOUSE_THEMES[top.natalHouse].theme}. This is your moment. Dive into your ${top.natalPlanet} in ${top.natalSign} guide and let it change everything.`,
      cta: `Read Your ${top.natalPlanet} Guide`,
    },
    "love activation": {
      message: `Venus is lighting up your ${HOUSE_THEMES[top.natalHouse].area.toLowerCase()} sector and the universe wants you to RECEIVE. Stop blocking your own blessings, gorgeous!`,
      cta: "Start the Self-Worth Activation",
    },
    "deep transformation": {
      message: `Pluto is doing its thing with your ${top.natalPlanet}. Something old needs to go so something incredible can take its place. Trust the process!`,
      cta: "Begin Shadow Work",
    },
    "expansion & luck": {
      message: `Jupiter is throwing open the doors in your ${HOUSE_THEMES[top.natalHouse].area.toLowerCase()} sector. Say yes to the big, wild, slightly terrifying thing. You're ready!`,
      cta: "Explore Your Expansion",
    },
    "destiny calling": {
      message: `Your North Node is absolutely ON FIRE right now. Your purpose isn't whispering anymore, it's yelling! Time to listen.`,
      cta: "Read Your Purpose Guide",
    },
    "maturity call": {
      message: `Saturn is building something serious in your ${HOUSE_THEMES[top.natalHouse].area.toLowerCase()} sector. This isn't a detour, it's the foundation of everything you want. Do the work!`,
      cta: "Start the Boundaries Workshop",
    },
    "glow-up activation": {
      message: `Your ${natalChart.houses[0]?.sign || ""} Rising is getting a cosmic glow-up right now. How you present yourself, your style, your whole VIBE is shifting. Lean into it and become magnetic!`,
      cta: `Shop Your ${natalChart.houses[0]?.sign || ""} Rising Edit`,
    },
    "effortless magnetism": {
      message: `Your ${natalChart.houses[0]?.sign || ""} Rising is absolutely radiating. People are drawn to you right now. Use this energy to show up, be seen, and attract what you want!`,
      cta: `Style Your ${natalChart.houses[0]?.sign || ""} Rising`,
    },
    "identity shake-up": {
      message: `Your ${natalChart.houses[0]?.sign || ""} Rising is going through a reinvention. New style, new energy, new first impression. Let the transformation happen!`,
      cta: `Explore Your Rising Sign Style`,
    },
    "fresh energy incoming": {
      message: `Fresh energy is hitting your ${natalChart.houses[0]?.sign || ""} Rising. This is your cosmic permission to reinvent yourself from the outside in. New look, new vibe, new era!`,
      cta: `Discover Your Rising Sign Edit`,
    },
  };

  const m = messages[top.theme] || {
    message: `Your ${top.natalPlanet} in ${top.natalSign} is being activated by ${top.activatedBy} and it's a powerful time for ${top.theme}. Don't waste this cosmic window!`,
    cta: `Read Your ${top.natalPlanet} Guide`,
  };

  return { message: m.message, cta: m.cta, link: "#" };
}

export function generateYourSzn(natalChart: ChartData): YourSznData {
  const transits = calculateTransits(natalChart);
  const theme = generateTheme(transits, natalChart);
  const focusAreas = generateFocusAreas(transits, natalChart);
  const journalPrompts = generateJournalPrompts(transits, natalChart);
  const manifestationMission = generateManifestationMission(transits, natalChart);
  const forecast = generateForecast(transits, natalChart);
  const recommendations = generateRecommendations(transits, natalChart);
  const nextBestStep = generateNextBestStep(transits, natalChart, recommendations);

  const risingSign = natalChart.houses[0]?.sign || "Aries";
  const sunSign = natalChart.planets.find((p) => p.name === "Sun")?.sign || "Aries";
  const moonSign = natalChart.planets.find((p) => p.name === "Moon")?.sign || "Aries";

  return {
    birthData: natalChart.birthData,
    risingSign,
    sunSign,
    moonSign,
    transits,
    theme,
    focusAreas,
    manifestationMission,
    journalPrompts,
    forecast,
    nextBestStep,
    recommendations,
  };
}
