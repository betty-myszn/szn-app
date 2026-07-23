import type { ChartData } from "@/types/chart";
import {
  SIGN_OVERVIEWS,
  HOUSE_MEANINGS,
  getBodyMeaning,
  interpretAspect,
  houseForSign,
  ordinalHouse,
} from "@/lib/interpretations";

export type MajorTransitType = "ingress" | "retrograde_start" | "retrograde_end" | "aspect";
export type MajorAspectType = "conjunction" | "sextile" | "square" | "trine" | "opposition";

export interface MajorTransitInput {
  type: MajorTransitType;
  date: string;
  planet: string;
  sign?: string;
  otherPlanet?: string;
  aspectType?: MajorAspectType;
}

export interface MajorTransitReading {
  title: string;
  dateLabel: string;
  emoji: string;
  whatThisIs: string;
  inYourChart: string;
  bettysTake: string;
  theMove: string;
  journalPrompt: string;
  affirmation: string;
}

const toId = (name: string) =>
  name === "North Node" ? "north_node" : name === "South Node" ? "south_node" : name.toLowerCase();

// A planet's own natal house, from the member's chart, this is what makes a slow outer-planet
// transit feel personal rather than a generic "this is happening in the sky" headline.
function natalHouseOf(planet: string, chart: ChartData): number | null {
  const found = chart.planets.find((p) => p.name === planet);
  return found ? found.house : null;
}

function dateLabelFor(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function composeMajorTransit(event: MajorTransitInput, chart: ChartData): MajorTransitReading {
  const dateLabel = dateLabelFor(event.date);
  const body = getBodyMeaning(toId(event.planet));
  const bodyLabel = body?.name ?? event.planet;
  const bodyDomain = body?.domain ?? "this part of life";

  if (event.type === "ingress" && event.sign) {
    const overview = SIGN_OVERVIEWS[event.sign];
    const cusps = chart.houses.map((h) => h.longitude);
    const house = houseForSign(event.sign, cusps);
    const houseMeaning = HOUSE_MEANINGS[house - 1];
    const houseArea = houseMeaning.lifeAreas[0];

    return {
      title: `${bodyLabel} moves into ${event.sign.toLowerCase()}`,
      dateLabel,
      emoji: "\u{1F30C}",
      whatThisIs: `${bodyLabel} changes sign rarely, this is a slow, generational planet, so when it moves into a new sign it's not a today thing, it's a whole-era thing. ${body?.deepDive ?? ""} ${overview ? overview.archetype : ""}`,
      inYourChart: `This lands in your ${ordinalHouse(house)} house of ${houseMeaning.title}, ${houseMeaning.rules}. For you specifically, that means ${bodyLabel.toLowerCase()}'s themes, ${bodyDomain}, start playing out through ${houseArea} for the years this transit lasts. ${houseMeaning.coach}`,
      bettysTake: `Most people clock the big planetary ingresses as world news, not personal news. It's both. With this one landing in your ${ordinalHouse(house)} house, the collective shift has a very specific address in your life: ${houseArea}. Watch that area for slow, structural change over the coming months, not overnight drama.`,
      theMove: `Start paying attention to ${houseArea} now, before this transit is in full swing. ${houseMeaning.coach}`,
      journalPrompt: `Where has ${houseArea} already been quietly asking for a different approach, one this transit is about to force anyway?`,
      affirmation: `I'm ready for the shift ${bodyLabel.toLowerCase()} in ${event.sign.toLowerCase()} brings to my ${houseArea}, I'd rather grow with it than get dragged by it.`,
    };
  }

  if (event.type === "retrograde_start" || event.type === "retrograde_end") {
    const house = natalHouseOf(event.planet, chart);
    const houseMeaning = house ? HOUSE_MEANINGS[house - 1] : null;
    const houseArea = houseMeaning?.lifeAreas[0] ?? "this area of your life";
    const isStart = event.type === "retrograde_start";
    const signLine = event.sign ? ` in ${event.sign.toLowerCase()}` : "";

    return {
      title: `${bodyLabel} stations ${isStart ? "retrograde" : "direct"}${signLine}`,
      dateLabel,
      emoji: isStart ? "\u{2118}" : "\u{2713}",
      whatThisIs: isStart
        ? `${bodyLabel} appears to slow down and move backward from Earth's vantage point. Nothing has actually reversed, but ${bodyLabel.toLowerCase()}'s domain turns inward for the next few months, review instead of launch. ${body?.deepDive ?? ""}`
        : `${bodyLabel} stations direct again${signLine}, its domain gets the green light after weeks of turned-inward review. ${body?.deepDive ?? ""}`,
      inYourChart: houseMeaning
        ? `In your chart, ${bodyLabel.toLowerCase()} natally sits in your ${ordinalHouse(house!)} house of ${houseMeaning.title}, ${houseMeaning.rules}. This retrograde window ${isStart ? "turns the spotlight onto" : "clears the backlog in"} ${houseArea} specifically, not a generic slowdown, yours.`
        : `${bodyLabel} isn't a placement in your own chart, so this transit plays out more collectively, but its themes, ${bodyDomain}, are still worth tracking over the coming weeks.`,
      bettysTake: isStart
        ? `I don't tell clients to panic during an outer-planet retrograde, I tell them to expect ${houseArea} specifically to feel stuck, delayed or in need of a rework. That's the retrograde doing its job, not a sign something's broken.`
        : `This is the day I tell clients to actually move on whatever ${houseArea} thing they've been sitting on. The review period is over, waiting past this point isn't caution anymore.`,
      theMove: isStart
        ? `Revisit or rework something in ${houseArea} instead of starting something new there.`
        : `Send, launch or commit to the ${houseArea} thing you paused during this retrograde.`,
      journalPrompt: isStart
        ? `What in my ${houseArea} is actually asking to be revisited right now, not abandoned, revisited?`
        : `What did I pause in my ${houseArea} during this retrograde that's genuinely ready to move now?`,
      affirmation: isStart
        ? `I use this window to review my ${houseArea}, not to force it forward before it's ready.`
        : `I'm clear to move forward in my ${houseArea} now, the review period did its job.`,
    };
  }

  // aspect
  const otherPlanet = event.otherPlanet ?? "";
  const otherBody = getBodyMeaning(toId(otherPlanet));
  const aspectCopy = interpretAspect(event.planet, otherPlanet, event.aspectType ?? "conjunction");
  const houseA = natalHouseOf(event.planet, chart);
  const houseB = natalHouseOf(otherPlanet, chart);
  const houseMeaningA = houseA ? HOUSE_MEANINGS[houseA - 1] : null;
  const houseMeaningB = houseB ? HOUSE_MEANINGS[houseB - 1] : null;

  const chartLine =
    houseMeaningA && houseMeaningB
      ? `In your chart, ${bodyLabel.toLowerCase()} rules your ${ordinalHouse(houseA!)} house of ${houseMeaningA.title} and ${(otherBody?.name ?? otherPlanet).toLowerCase()} rules your ${ordinalHouse(houseB!)} house of ${houseMeaningB.title}. This transit ties those two areas together directly, watch for movement in both at once.`
      : `This is a slow, collective-level transit between two outer planets, it won't map onto a single house the way a personal transit would, but its themes, ${bodyDomain} meeting ${otherBody?.domain ?? "this part of life"}, are still worth tracking in your own life over the coming weeks.`;

  return {
    title: `${bodyLabel} ${event.aspectType} ${otherBody?.name ?? otherPlanet}`,
    dateLabel,
    emoji: "\u{2728}",
    whatThisIs: `${bodyLabel} and ${otherBody?.name ?? otherPlanet} are both slow-moving planets, when they form a ${event.aspectType} to each other, it's a rare, whole-season signature that colours everyone's chart at once, not just yours. ${aspectCopy ?? ""}`,
    inYourChart: chartLine,
    bettysTake: `Big planet-to-planet aspects like this one are the backdrop the whole collective is working against right now. Your job isn't to force a reaction to match the scale of it, it's to notice where in your own life ${bodyDomain} and ${otherBody?.domain ?? "this theme"} are already colliding, and work with that, not around it.`,
    theMove: `Notice where ${bodyDomain} and ${otherBody?.domain ?? "this theme"} are already showing up together in your life, and let this transit be the nudge to actually deal with it.`,
    journalPrompt: `Where in my life are ${bodyDomain} and ${otherBody?.domain ?? "this theme"} already tangled up together, and what would untangling them actually take?`,
    affirmation: `I work with what's colliding right now instead of bracing against it, this is timing, not sabotage.`,
  };
}
