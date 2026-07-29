import type { ChartData } from "@/types/chart";
import {
  SIGN_TRAITS,
  SIGN_OVERVIEWS,
  HOUSE_MEANINGS,
  ordinalHouse,
  houseForSign,
  degreeMeaning,
} from "@/lib/interpretations";
import { composeNodeIngress } from "@/lib/nodal-content";

export type LunationType =
  | "new_moon"
  | "full_moon"
  | "solar_eclipse"
  | "lunar_eclipse"
  | "retrograde_start"
  | "retrograde_end"
  | "node_ingress";

export interface CalendarEventInput {
  type: LunationType;
  date: string;
  sign: string;
  degree: number;
  planet?: string;
}

interface EventTypeMeta {
  label: string;
  emoji: string;
  whatThisIs: string;
  bettysTakeGeneric: string;
  actionFraming: string;
  promptFraming: string;
  affirmationFrame: (houseArea: string) => string;
}

// A nodal ingress is the one event on the calendar that needs to teach the astrology from scratch
// and read both ends of an axis, so it gets its own composer in nodal-content.ts rather than a row
// in this table.
const EVENT_TYPE_META: Record<Exclude<LunationType, "node_ingress">, EventTypeMeta> = {
  new_moon: {
    label: "new moon",
    emoji: "\u{1F311}",
    whatThisIs: "A new moon is the reset point in the lunar cycle, the sun and moon align, the sky goes dark, and the next twenty-nine days effectively start from zero. This is a seeding moment, not a harvest one. Whatever you plant now with intention has the whole cycle ahead of it to grow.",
    bettysTakeGeneric: "Most people treat new moons as a vague vibe instead of a deadline. I coach mine to write the actual intention down, in one sentence, specific enough that they'd know if it came true. Vague wishes get vague results. Precise intentions get precise ones.",
    actionFraming: "set one specific, written intention today",
    promptFraming: "What am I actually ready to call in here, specifically enough that I'd know if it arrived?",
    affirmationFrame: (area) => `I plant this intention around my ${area} and trust the cycle to grow it.`,
  },
  full_moon: {
    label: "full moon",
    emoji: "\u{1F315}",
    whatThisIs: "A full moon is the culmination point, the moon sits opposite the sun and the sky goes fully bright. Whatever's been building quietly for the last two weeks tends to come to a head here, emotionally, practically, or both. This is a moment for release and clarity, not for starting something new.",
    bettysTakeGeneric: "Full moons get a reputation for chaos, and some of that reputation is earned. But the chaos is usually just something that was already unstable finally becoming visible. I tell clients not to fight what a full moon reveals, the information showing up now was always true, you just couldn't see it in the dark two weeks ago.",
    actionFraming: "name one thing this illuminated that you can no longer pretend not to see",
    promptFraming: "What has this brought to light that I've been quietly avoiding looking at directly?",
    affirmationFrame: (area) => `I release what no longer serves my ${area}, and I trust what this has shown me.`,
  },
  solar_eclipse: {
    label: "solar eclipse",
    emoji: "\u{1F311}\u{2600}",
    whatThisIs: "A solar eclipse is a new moon with extra force behind it, the moon doesn't just align with the sun, it actually blocks it, for a few minutes the sky goes properly dark in the middle of the day. Astrologically it works like a new moon on fast-forward: the seed planted here doesn't unfold over the usual 29-day cycle, it can unfold in weeks, and it tends to arrive as an event, not a slow build. Eclipses cluster in pairs or trios roughly every six months, this window (an eclipse season) is genuinely one of the more consequential stretches on the calendar, not a vibe to shrug off.",
    bettysTakeGeneric: "I tell clients to treat eclipse season differently to a normal moon cycle, less \"set an intention\", more \"expect a door to open or close on its own timeline, not yours\". The instinct is to force a decision to match the eclipse's intensity. Don't. Eclipses reveal the decision that was already being made underneath the surface, your job is to notice it, not manufacture one to match the drama.",
    actionFraming: "notice what's shifting on its own right now rather than trying to force a decision to match the intensity",
    promptFraming: "What door is actually opening or closing here, on its own, whether or not I was ready for it?",
    affirmationFrame: (area) => `I don't force this, I notice what's already shifting in my ${area} and I let it move at its own pace.`,
  },
  lunar_eclipse: {
    label: "lunar eclipse",
    emoji: "\u{1F315}\u{2600}",
    whatThisIs: "A lunar eclipse is a full moon with the earth's shadow passing directly over it, the culmination point gets amplified into something closer to a hard deadline. Where an ordinary full moon illuminates what's been building, a lunar eclipse tends to force it, an ending arrives whether or not you feel ready, a truth becomes undeniable, a chapter closes on a timeline that isn't yours to negotiate. These land roughly twice a year and are considered some of the most fated-feeling moments on the calendar.",
    bettysTakeGeneric: "Lunar eclipses are the one lunation I tell clients not to fight. Something usually ends here that you'd been quietly trying to keep alive past its actual expiry date. The ending isn't a punishment, it's the eclipse doing the thing you'd been avoiding doing yourself. Grieve it if you need to, but don't mistake the ending for a mistake.",
    actionFraming: "let the ending complete instead of trying to extend something past its natural close",
    promptFraming: "What's actually ending here, and what have I been doing to try to keep it alive past its time?",
    affirmationFrame: (area) => `I let what's ending in my ${area} actually end, the closure is the point, not the problem.`,
  },
  retrograde_start: {
    label: "retrograde begins",
    emoji: "℘",
    whatThisIs: "A retrograde is a station, the planet appears to slow down and move backward from Earth's vantage point. Nothing has actually reversed, but the energy of that planet's domain gets turned inward: review instead of launch, revisit instead of begin. Fighting this window usually costs more than working with it.",
    bettysTakeGeneric: "I don't tell clients to panic during a retrograde, I tell them to stop signing things they haven't reread and start finishing things they abandoned. This window is for going back, not going nowhere. Use it on purpose instead of white-knuckling through it hoping nothing breaks.",
    actionFraming: "revisit, reread or reconnect with something instead of launching something new",
    promptFraming: "What's asking to be revisited right now instead of pushed forward?",
    affirmationFrame: (area) => `I use this window to review and refine my ${area}, not to force it forward.`,
  },
  retrograde_end: {
    label: "retrograde ends",
    emoji: "✓",
    whatThisIs: "When a retrograde ends, the planet stations direct again and its domain gets the green light. This is usually when the delays, miscommunications or false starts from the retrograde window finally clear, and forward motion becomes reliable again.",
    bettysTakeGeneric: "This is the day I tell clients to send the thing they've been sitting on since the retrograde began. The review period is over. Waiting any longer past this point isn't caution anymore, it's avoidance wearing a very convincing disguise.",
    actionFraming: "send, launch or sign the thing you paused during the retrograde",
    promptFraming: "What did I pause during this retrograde that's actually ready to move now?",
    affirmationFrame: (area) => `I'm clear to move forward on my ${area} now, the review period did its job.`,
  },
};

// A headed block of explainer copy. Used by readings that need to teach something before they can
// interpret it, rather than assuming the member already knows the mechanics.
export interface ReadingSection {
  heading: string;
  body: string;
}

export interface LunationReading {
  title: string;
  dateLabel: string;
  emoji: string;
  whatThisIs: string;
  /** Optional teaching section, rendered between the hero and the chart reading. */
  primerTitle?: string;
  primer?: ReadingSection[];
  inYourChart: string;
  /** Richer multi-paragraph version of inYourChart, preferred by the page when present. */
  chartParagraphs?: string[];
  /** Optional explainer for a notable degree, e.g. the anaretic 29th. */
  degreeNote?: ReadingSection;
  bettysTake: string;
  theMove: string;
  /** Optional concrete actions to pick from, rendered as a list under the move. */
  moveOptions?: string[];
  /** Optional reflective questions rendered underneath the move. */
  moveQuestions?: string[];
  journalPrompt: string;
  affirmation: string;
}

function capitaliseFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function composeLunation(event: CalendarEventInput, chart: ChartData): LunationReading {
  if (event.type === "node_ingress") return composeNodeIngress(event, chart);

  const meta = EVENT_TYPE_META[event.type];
  const cusps = chart.houses.map((h) => h.longitude);
  const house = houseForSign(event.sign, cusps);
  const houseMeaning = HOUSE_MEANINGS[house - 1];
  const traits = SIGN_TRAITS[event.sign] || SIGN_TRAITS.Leo;
  const bodyLabel = event.planet ? event.planet.toLowerCase() : "moon";
  const houseArea = houseMeaning.lifeAreas[0];

  const date = new Date(`${event.date}T12:00:00Z`);
  const dateLabel = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  // The chart section used to be a single paragraph, which made every transit page read like the
  // same template with two words swapped. These paragraphs pull on the parts of her actual chart
  // that genuinely change the reading: the house axis this activates (a full moon always lights
  // both ends), any natal planets sitting in the house being hit, and where the ruler of this sign
  // lives in her chart, which is where the follow-through has to happen.
  const oppositeHouse = ((house + 5) % 12) + 1;
  const oppMeaning = HOUSE_MEANINGS[oppositeHouse - 1];
  const overview = SIGN_OVERVIEWS[event.sign];
  const isOppositionEvent = event.type === "full_moon" || event.type === "lunar_eclipse";

  // Natal planets standing in the house this lunation lands in. If she has any, this transit is
  // not abstract, it is landing directly on something she already carries.
  const natalHere = chart.planets.filter((p) => p.house === house);
  const natalNames = natalHere.map((p) => p.name.toLowerCase());
  const natalList =
    natalNames.length === 1
      ? natalNames[0]
      : natalNames.length === 2
        ? `${natalNames[0]} and ${natalNames[1]}`
        : `${natalNames.slice(0, -1).join(", ")} and ${natalNames[natalNames.length - 1]}`;

  // Where the ruler of this sign sits natally. The transit happens in one house, but the planet
  // that governs the sign is where the work actually gets done.
  // SIGN_OVERVIEWS.ruler is written for display ("Uranus (traditionally Saturn)", "the Moon"), so
  // strip the article and any parenthetical before trying to match it against a natal planet name.
  const rulerName = (overview?.ruler || "")
    .replace(/^the /i, "")
    .split(/\s*\(/)[0]
    .trim();
  const rulerPlanet = chart.planets.find((p) => p.name.toLowerCase() === rulerName.toLowerCase());

  const chartParagraphs: string[] = [
    `This ${bodyLabel} in ${event.sign.toLowerCase()} lands in your ${ordinalHouse(house)} house of ${houseMeaning.title}, ${houseMeaning.rules}. That means this event isn't a generic sky update, for you specifically it's activating ${houseArea}. It's landing at ${degreeMeaning(event.degree)} ${houseMeaning.coach}`,

    isOppositionEvent
      ? `A full moon is always an axis rather than a single point, because the sun sits directly opposite the moon. So while your ${ordinalHouse(house)} house is the one being lit, your ${ordinalHouse(oppositeHouse)} house of ${oppMeaning.title} is holding the other end, ${oppMeaning.rules}. That is usually where the pressure is coming from. What surfaces in your ${houseArea} this week is very often the cost of something you have been carrying in your ${oppMeaning.lifeAreas[0]}, and the resolution is rarely picking one, it is finding the version where both get to exist.`
      : `Even though this one concentrates in a single house, the opposite end of the axis quietly sets the terms. Your ${ordinalHouse(oppositeHouse)} house of ${oppMeaning.title} governs ${oppMeaning.rules}, and it tends to be the thing that has to give a little for the new start in your ${houseArea} to have anywhere to go. Worth noticing what you are protecting over there before you commit to anything here.`,

    natalHere.length > 0
      ? `This is not landing on empty space in your chart. You have ${natalList} sitting in that same ${ordinalHouse(house)} house, which means this transit is switching on something you already carry rather than introducing a new theme. Whatever ${natalNames.length === 1 ? "that placement" : "those placements"} normally ${natalNames.length === 1 ? "does" : "do"} in your life is the part that gets loud right now, amplified rather than altered. If this area of life has a familiar pattern for you, expect the familiar pattern, at volume.`
      : `You have no natal planets sitting in that house, which is genuinely useful to know rather than a disappointment. It means this area of life is not somewhere you have a fixed, built-in pattern running, so a transit here tends to be felt through circumstances and other people rather than as an old personal reflex. There is less to unlearn, and more room for whatever this lunation brings to actually be new.`,

    rulerPlanet
      ? `One more layer, and it is the one most horoscopes skip. ${capitaliseFirst(event.sign.toLowerCase())} is ruled by ${overview?.ruler}, and your natal ${rulerPlanet.name.toLowerCase()} sits in ${rulerPlanet.sign.toLowerCase()} in your ${ordinalHouse(rulerPlanet.house)} house. That makes your ${ordinalHouse(rulerPlanet.house)} house the place this actually gets handled. The event shows up in your ${houseArea}, but the follow-through, the practical resolution, happens through ${HOUSE_MEANINGS[rulerPlanet.house - 1].lifeAreas[0]}. If you want one place to direct effort this week, that is it.`
      : `${capitaliseFirst(event.sign.toLowerCase())} is ruled by ${overview?.ruler || "its traditional ruler"}, which is the planet setting the tone for how this lunation behaves in your chart, and it is worth watching what that planet is doing over the next fortnight as the story plays out.`,

    `In practice, expect this to arrive wearing ${event.sign.toLowerCase()}'s particular flavour: ${traits.essence}. At its best that shows up as ${traits.gift}. Under pressure the same energy tips into ${traits.shadow}, and a lunation is exactly the sort of moment that reveals which of the two you have been running. Watching which version turns up in your ${houseArea} is the most honest piece of information this whole transit gives you.`,
  ];

  const inYourChart = chartParagraphs.join(" ");

  const bettysTake = `${meta.bettysTakeGeneric} With this one landing in your ${event.sign.toLowerCase()} ${ordinalHouse(house)} house, that plays out through ${houseArea}: expect this to move through ${traits.essence}, not through anyone else's version of it.`;

  const theMove = `${meta.actionFraming.charAt(0).toUpperCase() + meta.actionFraming.slice(1)}, specifically around your ${houseArea}. ${houseMeaning.coach}`;

  return {
    title: `${meta.label} in ${event.sign.toLowerCase()}`,
    dateLabel,
    emoji: meta.emoji,
    whatThisIs: meta.whatThisIs,
    inYourChart,
    chartParagraphs,
    bettysTake,
    theMove,
    journalPrompt: `${meta.promptFraming} (Think specifically about your ${houseArea}.)`,
    affirmation: meta.affirmationFrame(houseArea),
  };
}
