import swisseph from "swisseph";
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
  let angle = ((moonLong - sunLong + 360) % 360);
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
  const personalPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars"];

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

  for (const transit of currentPositions) {
    for (const natal of natalChart.planets) {
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
            applying: diff < config.angle,
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
  1: { area: "Self", theme: "identity and personal power" },
  2: { area: "Money", theme: "finances, values and self-worth" },
  3: { area: "Communication", theme: "learning, speaking and connections" },
  4: { area: "Home", theme: "family, roots and inner security" },
  5: { area: "Love", theme: "romance, creativity and joy" },
  6: { area: "Health", theme: "daily routines, wellness and service" },
  7: { area: "Relationships", theme: "partnerships and one-on-one bonds" },
  8: { area: "Transformation", theme: "intimacy, shared resources and rebirth" },
  9: { area: "Growth", theme: "travel, philosophy and expansion" },
  10: { area: "Career", theme: "public life, reputation and ambition" },
  11: { area: "Community", theme: "friendships, networks and dreams" },
  12: { area: "Healing", theme: "spirituality, rest and the unconscious" },
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
    "identity awakening": "Stepping Into Your Power",
    "love activation": "Opening Your Heart",
    "deep transformation": "Shedding What No Longer Serves You",
    "expansion & luck": "Expanding Into Abundance",
    "healing activation": "Healing at the Root",
    "maturity call": "Building Something Real",
    "sudden awakening": "Embracing the Unexpected",
    "spiritual awakening": "Trusting Your Intuition",
    "destiny calling": "Aligning With Your Purpose",
    "emotional reset": "Coming Home to Yourself",
    "energy surge": "Taking Bold Action",
    "mental clarity": "Speaking Your Truth",
  };

  const title = titleOptions[themes[0]] || "A Month of Growth & Alignment";

  return {
    title,
    description: `This month, the cosmos is activating your ${houseTheme.area.toLowerCase()} sector — the part of your chart connected to ${houseTheme.theme}. With ${topActivated.length} key placements being lit up, this is a powerful time for ${themes.slice(0, 2).join(" and ")}.`,
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
        "Your love sector is receiving attention. Be open to deeper intimacy and honest expression.",
        "Relationships are evolving. What feels aligned will deepen; what doesn't may shift.",
        "A quieter period for romance — focus on self-love and what you truly desire.",
      ],
      Money: [
        "Financial energy is building. Trust your instincts around money decisions.",
        "Your value is being redefined. It's time to ask for what you're worth.",
        "Steady progress in your financial world. Focus on long-term security.",
      ],
      Career: [
        "Career momentum is growing. Opportunities may appear through unexpected channels.",
        "Your public presence is shifting. Step into visibility with confidence.",
        "A time for strategic planning rather than big moves. Lay the groundwork.",
      ],
      Friendships: [
        "Community connections are highlighted. Quality over quantity matters now.",
        "Your social world is evolving. New aligned connections are incoming.",
        "Deepening existing bonds matters more than expanding your circle right now.",
      ],
      Healing: [
        "Deep healing is available to you. Old patterns are ready to release.",
        "Your body and mind are asking for attention. Honour what you need.",
        "Spiritual growth is accelerating. Trust the process of transformation.",
      ],
      "Self-Worth": [
        "You're being called to know your own value. Step into self-trust.",
        "Identity is being refined. Let go of who you were to become who you're becoming.",
        "Self-worth is your superpower right now. Everything flows from that foundation.",
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
    Sun: ["What does it mean to truly be myself right now?", "Where am I dimming my light to make others comfortable?", "What would I do if I knew I couldn't fail?"],
    Moon: ["What emotions am I avoiding, and what are they trying to tell me?", "What does safety and comfort look like for me right now?", "How can I better nurture myself this month?"],
    Mercury: ["What truth have I been holding back from speaking?", "What am I ready to learn or understand differently?", "How do I communicate my needs without apologising for them?"],
    Venus: ["What do I truly desire in love and connection?", "Where can I let myself receive more?", "What does beauty and pleasure look like in my life right now?"],
    Mars: ["What am I ready to fight for?", "Where do I need to take more decisive action?", "What boundary needs to be set and held?"],
    Jupiter: ["Where is life asking me to expand and trust more?", "What belief about myself is ready to be upgraded?", "How can I welcome more abundance into my life?"],
    Saturn: ["What responsibility am I avoiding?", "What structure do I need to build for my future self?", "Where do I need to be more disciplined or committed?"],
    Chiron: ["What wound keeps showing up in different forms?", "How can I transform my pain into wisdom?", "What would healing actually look like for me?"],
    Pluto: ["What am I holding onto that needs to die so something new can be born?", "Where am I giving away my power?", "What truth am I afraid to face?"],
    Neptune: ["What does my intuition keep whispering to me?", "Where do I need more faith and less control?", "What dream am I ready to commit to fully?"],
    Uranus: ["Where in my life am I craving freedom?", "What would I change if nobody was watching?", "What outdated version of myself am I ready to release?"],
    "North Node": ["What is my soul purpose asking of me right now?", "What fear is standing between me and my destiny?", "If I trusted the direction I'm being pulled, where would I go?"],
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
      prompt: "What am I grateful for that I haven't acknowledged?",
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
      "identity awakening": { mission: "Step into a bolder version of yourself this month", action: "Do one thing this week that scares you in a good way" },
      "love activation": { mission: "Open yourself to receiving love in all its forms", action: "Write a love letter to yourself and read it every morning" },
      "deep transformation": { mission: "Release one thing that no longer serves your evolution", action: "Identify your biggest energy drain and remove or transform it" },
      "expansion & luck": { mission: "Say yes to something bigger than your comfort zone", action: "Make one bold ask or apply for one dream opportunity" },
      "healing activation": { mission: "Commit to one healing practice daily this month", action: "Start a 10-minute daily ritual that nurtures your wound" },
      "maturity call": { mission: "Build one new structure that supports your goals", action: "Create a plan for the next 90 days and commit to step one" },
      "sudden awakening": { mission: "Embrace change and let go of what you can't control", action: "Try something completely new that excites you" },
      "destiny calling": { mission: "Take one step toward your soul purpose", action: "Identify what lights you up and spend more time doing it" },
    };

    const m = missions[topActivation.theme] || { mission: `Focus on ${houseTheme.theme}`, action: "Journal on what this area of life needs from you" };

    return {
      mission: m.mission,
      basedOn: `${topActivation.activatedBy} ${topActivation.aspectType} your ${topActivation.natalPlanet} in ${topActivation.natalSign}`,
      actionStep: m.action,
    };
  }

  return {
    mission: `Expand into your ${houseTheme.area.toLowerCase()} sector — Jupiter is supporting ${houseTheme.theme}`,
    basedOn: `Jupiter transiting your ${jupiterHouse}${jupiterHouse === 1 ? "st" : jupiterHouse === 2 ? "nd" : jupiterHouse === 3 ? "rd" : "th"} house`,
    actionStep: "Spend 10 minutes journaling on what expansion looks like for you right now",
  };
}

function generateForecast(transits: TransitData, natalChart: ChartData): CosmicForecast {
  const majorTransits = transits.transitAspects.filter((a) => a.significance === "major");
  const trines = majorTransits.filter((a) => a.aspectType === "trine" || a.aspectType === "sextile");
  const squares = majorTransits.filter((a) => a.aspectType === "square" || a.aspectType === "opposition");

  const jupiterHouse = transits.currentPositions.find((p) => p.name === "Jupiter")?.natalHouse || 1;
  const saturnHouse = transits.currentPositions.find((p) => p.name === "Saturn")?.natalHouse || 1;

  const opportunity = trines.length > 0
    ? `${trines[0].transitPlanet} is supporting your ${trines[0].natalPlanet} — lean into ${PLANET_THEMES[trines[0].natalPlanet]?.[trines[0].aspectType] || "this energy"}`
    : `Jupiter in your ${HOUSE_THEMES[jupiterHouse].area.toLowerCase()} sector brings expansion to ${HOUSE_THEMES[jupiterHouse].theme}`;

  const challenge = squares.length > 0
    ? `${squares[0].transitPlanet} is creating tension with your ${squares[0].natalPlanet} — work through ${PLANET_THEMES[squares[0].natalPlanet]?.[squares[0].aspectType] || "this challenge"} consciously`
    : `Saturn in your ${HOUSE_THEMES[saturnHouse].area.toLowerCase()} sector asks for patience with ${HOUSE_THEMES[saturnHouse].theme}`;

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
      ? `opportunities related to ${HOUSE_THEMES[transits.currentPositions.find((p) => p.name === trines[0].transitPlanet)?.natalHouse || 1].theme}`
      : "new connections and unexpected invitations",
    avoid: squares.length > 0
      ? "rushing major decisions — give yourself space to process"
      : "overcommitting and people-pleasing at the expense of your own needs",
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
      title: "Boundaries & Building",
      description: `Saturn is activating your ${saturnActive.natalPlanet}. Time to build real structure around ${HOUSE_THEMES[saturnActive.natalHouse].theme}.`,
      basedOn: `Saturn ${saturnActive.aspectType} ${saturnActive.natalPlanet}`,
      emoji: "🏗️",
    });
    recs.push({
      type: "tapping",
      title: "Releasing Resistance to Growth",
      description: "EFT tapping session for when Saturn transits feel heavy and you need to soften into the lesson.",
      basedOn: `Saturn transit in House ${saturnActive.natalHouse}`,
      emoji: "🤲",
    });
  }

  // Venus/Moon activations → love/self-worth content
  const venusActive = activated.find((a) => a.natalPlanet === "Venus" || a.activatedBy === "Venus");
  if (venusActive) {
    recs.push({
      type: "hypnosis",
      title: "Magnetic Self-Worth Activation",
      description: "A guided hypnosis to reconnect with your inherent value and become magnetic to what you desire.",
      basedOn: `Venus activation in ${venusActive.natalSign}`,
      emoji: "🌹",
    });
    recs.push({
      type: "article",
      title: `Your Venus in ${venusActive.natalSign} Love Guide`,
      description: `Deep dive into how your Venus placement shapes what you desire, how you love, and what makes you feel valued.`,
      basedOn: `Venus in ${venusActive.natalSign}`,
      emoji: "💕",
    });
  }

  // Chiron activations → healing content
  const chironActive = activated.find((a) => a.natalPlanet === "Chiron" || a.activatedBy === "Chiron");
  if (chironActive) {
    recs.push({
      type: "tapping",
      title: "Healing Your Core Wound",
      description: `Your Chiron in ${chironActive.natalSign} is being activated — this EFT session targets the wound beneath the wound.`,
      basedOn: `Chiron in ${chironActive.natalSign}`,
      emoji: "💚",
    });
    recs.push({
      type: "article",
      title: `Your Chiron in ${chironActive.natalSign} Healing Guide`,
      description: "Understanding your deepest wound and how it becomes your greatest gift.",
      basedOn: `Chiron activation`,
      emoji: "🌿",
    });
  }

  // Pluto/Scorpio → shadow work
  const plutoActive = activated.find((a) => a.activatedBy === "Pluto" || a.natalPlanet === "Pluto");
  if (plutoActive) {
    recs.push({
      type: "workshop",
      title: "Shadow Work Intensive",
      description: "Pluto is asking you to go deep. This workshop guides you through confronting and integrating your shadow.",
      basedOn: `Pluto ${plutoActive.aspectType} ${plutoActive.natalPlanet}`,
      emoji: "🔮",
    });
  }

  // Jupiter → expansion/money content
  const jupiterActive = activated.find((a) => a.activatedBy === "Jupiter");
  if (jupiterActive) {
    recs.push({
      type: "podcast",
      title: "Expanding Into Your Next Level",
      description: `Jupiter is activating your ${jupiterActive.natalPlanet} — listen to how to ride this wave of expansion.`,
      basedOn: `Jupiter ${jupiterActive.aspectType} ${jupiterActive.natalPlanet}`,
      emoji: "🎧",
    });
  }

  // North Node → purpose content
  const nnActive = activated.find((a) => a.natalPlanet === "North Node" || a.activatedBy === "North Node");
  if (nnActive) {
    recs.push({
      type: "reading",
      title: "Your Purpose & Direction Reading",
      description: "Your North Node is being activated. Get clarity on your soul's direction with a personalised reading.",
      basedOn: `North Node activation`,
      emoji: "🧭",
    });
  }

  // Always include a placement guide for the most activated natal planet
  if (activated.length > 0) {
    const top = activated[0];
    recs.push({
      type: "placement",
      title: `Your ${top.natalPlanet} in ${top.natalSign} Guide`,
      description: `This placement is being strongly activated right now. Understanding it deeply will help you navigate this month's energy.`,
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
      message: "Your chart is in a steady phase. Use this time to integrate recent growth and plan your next move.",
      cta: "Explore Your Full Chart",
      link: "/results",
    };
  }

  const messages: Record<string, { message: string; cta: string }> = {
    "healing activation": {
      message: `Your chart is calling for deeper healing around ${HOUSE_THEMES[top.natalHouse].theme}. Explore your ${top.natalPlanet} in ${top.natalSign} guide.`,
      cta: `Explore Your ${top.natalPlanet} Guide`,
    },
    "love activation": {
      message: `Venus is activating your ${HOUSE_THEMES[top.natalHouse].area.toLowerCase()} sector. Open yourself to receiving.`,
      cta: "Start the Self-Worth Activation",
    },
    "deep transformation": {
      message: `Pluto is transforming your ${top.natalPlanet}. Something old is dying so something new can be born.`,
      cta: "Begin Shadow Work",
    },
    "expansion & luck": {
      message: `Jupiter is expanding your ${HOUSE_THEMES[top.natalHouse].area.toLowerCase()} sector. Say yes to bigger things.`,
      cta: "Explore Your Expansion",
    },
    "destiny calling": {
      message: `Your North Node is highlighted this month. Your purpose is calling louder than ever.`,
      cta: "Read Your Purpose Guide",
    },
    "maturity call": {
      message: `Saturn is building something real in your ${HOUSE_THEMES[top.natalHouse].area.toLowerCase()} sector. Commit to the work.`,
      cta: "Start the Boundaries Workshop",
    },
  };

  const m = messages[top.theme] || {
    message: `Your ${top.natalPlanet} in ${top.natalSign} is being activated by ${top.activatedBy}. This is a powerful time for ${top.theme}.`,
    cta: `Explore Your ${top.natalPlanet} Guide`,
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

  return {
    birthData: natalChart.birthData,
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
