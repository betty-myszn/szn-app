import type { ChartData } from "@/types/chart";
import { SIGN_TRAITS, HOUSE_MEANINGS, ordinalHouse, houseForSign, degreeMeaning } from "@/lib/interpretations";
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
    bettysTakeGeneric: "Full moons get a reputation for chaos, and honestly, some of that's earned. But the chaos is usually just something that was already unstable finally becoming visible. I tell clients not to fight what a full moon reveals, the information showing up now was always true, you just couldn't see it in the dark two weeks ago.",
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

  const inYourChart = `This ${bodyLabel} in ${event.sign.toLowerCase()} lands in your ${ordinalHouse(house)} house of ${houseMeaning.title}, ${houseMeaning.rules}. That means this event isn't a generic sky update, for you specifically it's activating ${houseArea}. It's landing at ${degreeMeaning(event.degree)} ${houseMeaning.coach}`;

  const bettysTake = `${meta.bettysTakeGeneric} With this one landing in your ${event.sign.toLowerCase()} ${ordinalHouse(house)} house, that plays out through ${houseArea}: expect this to move through ${traits.essence}, not through anyone else's version of it.`;

  const theMove = `${meta.actionFraming.charAt(0).toUpperCase() + meta.actionFraming.slice(1)}, specifically around your ${houseArea}. ${houseMeaning.coach}`;

  return {
    title: `${meta.label} in ${event.sign.toLowerCase()}`,
    dateLabel,
    emoji: meta.emoji,
    whatThisIs: meta.whatThisIs,
    inYourChart,
    bettysTake,
    theMove,
    journalPrompt: `${meta.promptFraming} (Think specifically about your ${houseArea}.)`,
    affirmation: meta.affirmationFrame(houseArea),
  };
}
