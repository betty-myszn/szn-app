import type { ChartData } from "@/types/chart";
import {
  SIGN_TRAITS,
  SIGN_OVERVIEWS,
  getBodyMeaning,
  HOUSE_MEANINGS,
  ordinalHouse,
  houseForSign,
  longitudeForSignDegree,
  houseForLongitude,
  degreeMeaning,
  type SignTraits,
  type HouseMeaning,
} from "@/lib/interpretations";
import { composeNodeIngress } from "@/lib/nodal-content";
import { composeEclipse } from "@/lib/eclipse-content";

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
  /** For eclipses only: which end of the nodal axis it sits on, computed at eclipse time from the
   * true node. Present, it routes the reading to the richer eclipse composer; absent, the eclipse
   * gracefully falls back to the generic lunation reading. */
  nodeEnd?: "north" | "south";
}

// The personalised context each section builder receives, so the per-event copy can pull on her
// actual house area, the sign the event lands in and that sign's traits rather than re-deriving them.
interface SectionCtx {
  area: string;
  sign: string; // lowercased, for prose
  traits: SignTraits;
  houseMeaning: HouseMeaning;
}

// A distinct, do-it-this-week practice built from the reading, not a reused prompt. Each event type
// supplies its own, personalised to the house the event lands in.
export interface Exercise {
  title: string;
  intro: string;
  steps: string[];
}

interface EventTypeMeta {
  label: string;
  emoji: string;
  whatThisIs: string;
  bettysTakeGeneric: string;
  actionFraming: string;
  promptFraming: string;
  affirmationFrame: (houseArea: string) => string;
  // The four sections Betty asked every reading to carry, on top of the chart breakdown: what the
  // event brings up, what to watch for, the shadow it exposes, and the exercise that works it.
  bringsUp: (c: SectionCtx) => string;
  lookOutFor: (c: SectionCtx) => string;
  shadowLine: (c: SectionCtx) => string;
  exercise: (c: SectionCtx) => Exercise;
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
    bringsUp: (c) =>
      `A new moon rarely lands as an event. It tends to show up as a quiet restlessness around your ${c.area}, a fresh idea you cannot quite put down, a sense that a chapter could begin here if you let it. What surfaces now is possibility with nowhere to go yet, so the thing worth watching is whatever you keep almost letting yourself want.`,
    lookOutFor: (c) =>
      `The classic misfire here is treating a new moon as a wish instead of a decision. A woolly intention gives you a woolly result, and nothing you plant tonight shows a harvest by the weekend, so notice the impatience that wants proof immediately. When this energy tips, your ${c.sign} side reaches for ${c.traits.shadow}, and around your ${c.area} that is usually the exact voice that talks you out of beginning.`,
    shadowLine: (c) =>
      `The shadow a new moon tends to expose is ${c.traits.shadow}. It shows up here as the reason not to start: the plan quietly shelved, the intention softened until it asks nothing of you, the fresh page left blank because a blank page cannot fail. Around your ${c.area}, catching that reflex as it happens is most of the work.`,
    exercise: (c) => ({
      title: "the new moon intention",
      intro: `Give the next cycle something specific to grow. Ten quiet minutes, tonight or tomorrow.`,
      steps: [
        `Write one intention for your ${c.area}, in a single sentence specific enough that you would know for certain if it came true.`,
        `Underneath it, name the one first action that would make it real, small enough to actually do this week.`,
        `Write down the excuse most likely to stop you, so you recognise it as a reflex and not a reason when it turns up.`,
      ],
    }),
  },
  full_moon: {
    label: "full moon",
    emoji: "\u{1F315}",
    whatThisIs: "A full moon is the culmination point, the moon sits opposite the sun and the sky goes fully bright. Whatever's been building quietly for the last two weeks tends to come to a head here, emotionally, practically, or both. This is a moment for release and clarity, not for starting something new.",
    bettysTakeGeneric: "Full moons get a reputation for chaos, and some of that reputation is earned. But the chaos is usually just something that was already unstable finally becoming visible. I tell clients not to fight what a full moon reveals, the information showing up now was always true, you just couldn't see it in the dark two weeks ago.",
    actionFraming: "name one thing this illuminated that you can no longer pretend not to see",
    promptFraming: "What has this brought to light that I've been quietly avoiding looking at directly?",
    affirmationFrame: (area) => `I release what no longer serves my ${area}, and I trust what this has shown me.`,
    bringsUp: (c) =>
      `A full moon brings things to a head. Something that has been building quietly for the last fortnight around your ${c.area} tends to become impossible to ignore now, emotionally, practically, or both at once. Feelings run higher and clarity arrives whether or not you asked for it, and what you have been half-avoiding usually chooses this week to make itself plain.`,
    lookOutFor: (c) =>
      `The danger of a full moon is mistaking a strong feeling for a mandate to burn something down. The information surfacing now is real, but the middle of a culmination is the worst possible moment to make an irreversible decision about it. When the pressure peaks your ${c.sign} wiring can tip into ${c.traits.shadow}, and around your ${c.area} that is what turns a moment of clarity into a mess you spend a month clearing up.`,
    shadowLine: (c) =>
      `The shadow a full moon lights up is ${c.traits.shadow}. Under a bright sky it stops being subtle: it is the thing you do around your ${c.area} when you feel exposed and want the discomfort to stop. Seeing it clearly, without acting on it in the same breath, is the whole point of the light.`,
    exercise: (c) => ({
      title: "the full moon release",
      intro: `Work with what this has surfaced instead of reacting to it. Fifteen minutes, ideally once the feeling has peaked rather than during it.`,
      steps: [
        `Write down the one thing this full moon has made impossible to keep pretending you cannot see about your ${c.area}.`,
        `Name what you are ready to put down: a story, a resentment, a habit, a version of this you have outgrown.`,
        `Decide the one reactive move you will not make while the feeling is this loud, and give it seventy-two hours before you touch it.`,
      ],
    }),
  },
  solar_eclipse: {
    label: "solar eclipse",
    emoji: "\u{1F311}\u{2600}",
    whatThisIs: "A solar eclipse only happens when a new moon lands on the lunar nodes, the points where the moon's path crosses the sun's, and that is the whole difference. The nodes are the fated axis of the chart, the line the collective is being moved along, so an eclipse does not behave like a stronger new moon, it behaves like a redirection. The moon blocks the sun completely and the sky goes properly dark in the middle of the day, and what opens here tends to arrive as an event rather than as a seed you plant and tend. They cluster in pairs or trios roughly every six months, and the story one starts usually belongs to the eighteen months the nodes spend on that axis rather than to this month alone.",
    bettysTakeGeneric: "I tell clients to treat eclipse season differently to a normal moon cycle, less \"set an intention\", more \"expect a door to open or close on its own timeline, not yours\". The instinct is to force a decision to match the eclipse's intensity. Don't. Eclipses reveal the decision that was already being made underneath the surface, your job is to notice it, not manufacture one to match the drama.",
    actionFraming: "notice what's shifting on its own right now rather than trying to force a decision to match the intensity",
    promptFraming: "What door is actually opening or closing here, on its own, whether or not I was ready for it?",
    affirmationFrame: (area) => `I don't force this, I notice what's already shifting in my ${area} and I let it move at its own pace.`,
    bringsUp: (c) =>
      `This one sits on the fated axis, so it is a redirection rather than a seed you plant. Expect something around your ${c.area} to actually move: an opening, an offer, a beginning that arrives on its own timeline rather than the one you planned. Eclipses do not wait to be tended, so what would normally take a season can land in a fortnight.`,
    lookOutFor: (c) =>
      `The trap is forcing a decision to match the intensity. Eclipses reveal the choice already being made underneath the surface, so manufacturing a dramatic move to feel in control usually backfires. When the pressure spikes your ${c.sign} wiring can tip into ${c.traits.shadow}, and around your ${c.area} that is what pushes you to grab at something before it is ready.`,
    shadowLine: (c) =>
      `The shadow an eclipse exposes is ${c.traits.shadow}, and an eclipse does not do subtle. Around your ${c.area} it surfaces fast and often in public, which is uncomfortable and also the most honest information this window gives you.`,
    exercise: (c) => ({
      title: "the eclipse watch",
      intro: `Eclipses are for noticing, not forcing. Keep this light and observational across the fortnight after it.`,
      steps: [
        `Write down what is already shifting around your ${c.area} on its own, without your input, the door that seems to be opening or closing by itself.`,
        `Resist making one big decision this week purely to match the intensity. Let the situation show you its hand first.`,
        `Name the opening around your ${c.area} you would take if you trusted it was meant for you, then watch what the next two weeks do with it.`,
      ],
    }),
  },
  lunar_eclipse: {
    label: "lunar eclipse",
    emoji: "\u{1F315}\u{2600}",
    whatThisIs: "A lunar eclipse only happens when a full moon lands on the lunar nodes, with the earth's shadow falling across it. The nodes are the fated axis of the chart, and that is what separates this from an ordinary culmination: a full moon shows you what has been building, an eclipse on the nodes closes it. The timeline is not yours to negotiate, the ending arrives whether or not you feel ready, and it almost always belongs to a longer eighteen-month story rather than to this month on its own. These land roughly twice a year and are some of the most fated-feeling moments on the calendar.",
    bettysTakeGeneric: "Lunar eclipses are the one lunation I tell clients not to fight. Something usually ends here that you'd been quietly trying to keep alive past its actual expiry date. The ending isn't a punishment, it's the eclipse doing the thing you'd been avoiding doing yourself. Grieve it if you need to, but don't mistake the ending for a mistake.",
    actionFraming: "let the ending complete instead of trying to extend something past its natural close",
    promptFraming: "What's actually ending here, and what have I been doing to try to keep it alive past its time?",
    affirmationFrame: (area) => `I let what's ending in my ${area} actually end, the closure is the point, not the problem.`,
    bringsUp: (c) =>
      `This one sits on the fated axis, so it closes rather than merely illuminates. Something around your ${c.area} that has been building is completed for you rather than by you: an ending arrives, a truth becomes undeniable, a chapter shuts on a timeline that is not yours to negotiate.`,
    lookOutFor: (c) =>
      `The trap is trying to keep alive something that is genuinely ending. Eclipses complete things you have been extending past their expiry, and clutching harder now usually just makes the closure louder. If your ${c.sign} side tips into ${c.traits.shadow}, around your ${c.area} it will dress avoidance up as loyalty.`,
    shadowLine: (c) =>
      `The shadow a lunar eclipse reveals is ${c.traits.shadow}, and it tends to be whatever you have been doing to avoid an ending around your ${c.area}. The eclipse takes the choice out of your hands, which is the hard mercy of it.`,
    exercise: (c) => ({
      title: "the eclipse release",
      intro: `Work with the ending instead of against it. Twenty minutes, gently.`,
      steps: [
        `Name the thing around your ${c.area} that is actually ending, the one you have been trying to keep alive past its time.`,
        `Write what it gave you and what it cost you, so you can grieve it honestly rather than pretend it was nothing.`,
        `Choose one way you will let the ending complete this week rather than reopen it, and one kind thing you will do for yourself while it lands.`,
      ],
    }),
  },
  retrograde_start: {
    label: "retrograde begins",
    emoji: "℘",
    whatThisIs: "A retrograde is a station, the planet appears to slow down and move backward from Earth's vantage point. Nothing has actually reversed, but the energy of that planet's domain gets turned inward: review instead of launch, revisit instead of begin. Fighting this window usually costs more than working with it.",
    bettysTakeGeneric: "I don't tell clients to panic during a retrograde, I tell them to stop signing things they haven't reread and start finishing things they abandoned. This window is for going back, not going nowhere. Use it on purpose instead of white-knuckling through it hoping nothing breaks.",
    actionFraming: "revisit, reread or reconnect with something instead of launching something new",
    promptFraming: "What's asking to be revisited right now instead of pushed forward?",
    affirmationFrame: (area) => `I use this window to review and refine my ${area}, not to force it forward.`,
    bringsUp: (c) =>
      `A retrograde turns the volume down on new launches and up on everything left unfinished. Expect the past to come back around your ${c.area}: old messages, old faces, old decisions asking to be looked at again. Things feel slower and slightly tangled, and the work that wants doing now is review rather than launch.`,
    lookOutFor: (c) =>
      `The trap is forcing forward motion through a window built for going back. Signing, launching and committing during a retrograde tends to need redoing once it clears, so read the fine print twice and say less than you want to. When the delays bite, your ${c.sign} side can tip into ${c.traits.shadow}, and around your ${c.area} that impatience is what turns a pause into a genuine mistake.`,
    shadowLine: (c) =>
      `The shadow a retrograde draws out is ${c.traits.shadow}. Slowed down and sent backwards, the reflex you usually outrun has time to catch up with you, and around your ${c.area} it shows up as the frustration that wants to force something rather than let it be revisited properly.`,
    exercise: (c) => ({
      title: "the retrograde review",
      intro: `Use the backward window on purpose instead of white-knuckling through it. Twenty minutes with a notebook.`,
      steps: [
        `List what you abandoned or left half-finished around your ${c.area}, the things you told yourself you would come back to.`,
        `Pick the one genuinely worth reviving, and do the first small piece of it now while the sky is on your side.`,
        `Choose one thing you will not sign, send or decide until the retrograde ends, and diarise the date so the waiting has an end.`,
      ],
    }),
  },
  retrograde_end: {
    label: "retrograde ends",
    emoji: "✓",
    whatThisIs: "When a retrograde ends, the planet stations direct again and its domain gets the green light. This is usually when the delays, miscommunications or false starts from the retrograde window finally clear, and forward motion becomes reliable again.",
    bettysTakeGeneric: "This is the day I tell clients to send the thing they've been sitting on since the retrograde began. The review period is over. Waiting any longer past this point isn't caution anymore, it's avoidance wearing a very convincing disguise.",
    actionFraming: "send, launch or sign the thing you paused during the retrograde",
    promptFraming: "What did I pause during this retrograde that's actually ready to move now?",
    affirmationFrame: (area) => `I'm clear to move forward on my ${area} now, the review period did its job.`,
    bringsUp: (c) =>
      `When a retrograde ends the fog clears and forward motion becomes reliable again around your ${c.area}. The delays, the crossed wires and the false starts from the last few weeks start to resolve, and the thing you paused finally has a clear road in front of it.`,
    lookOutFor: (c) =>
      `The trap now is calling more waiting caution. The review period is over, and past this point holding back is usually avoidance in a convincing disguise. If your ${c.sign} side leans into ${c.traits.shadow}, around your ${c.area} it will keep finding one more reason to delay the thing that is actually ready.`,
    shadowLine: (c) =>
      `The shadow at a station direct is ${c.traits.shadow}, showing up as the hesitation that outlives its usefulness. Around your ${c.area}, the work is noticing when careful has quietly become scared.`,
    exercise: (c) => ({
      title: "the green light",
      intro: `Move the thing you have been sitting on since the retrograde began. Fifteen minutes, today if you can.`,
      steps: [
        `Name the one thing around your ${c.area} you paused during the retrograde that is genuinely ready to move now.`,
        `Do the first concrete step on it today, the send, the booking, the message, before the hesitation reorganises itself.`,
        `Write one line on what the review period actually taught you, so the pause counts for something rather than just costing you time.`,
      ],
    }),
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
  /** What the event surfaces for her, in this house and sign. */
  bringsUp?: string;
  /** The specific trap of this event in this placement. */
  lookOutFor?: string;
  /** Her sign's shadow, in this house area, as this event tends to expose it. */
  shadow?: string;
  bettysTake: string;
  /** The move line. Optional now: lunations render an Exercise instead, node ingress still uses this. */
  theMove?: string;
  /** Optional concrete actions to pick from, rendered as a list under the move. */
  moveOptions?: string[];
  /** Optional reflective questions rendered underneath the move. */
  moveQuestions?: string[];
  /** A distinct, do-it-this-week practice. Preferred by the page over theMove when present. */
  exercise?: Exercise;
  journalPrompt: string;
  affirmation: string;
}

function capitaliseFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function composeLunation(event: CalendarEventInput, chart: ChartData): LunationReading {
  if (event.type === "node_ingress") return composeNodeIngress(event, chart);
  // Eclipses get the far deeper nodal-axis composer, but only when the calendar has told us which
  // end of the axis this one sits on. Without that (e.g. a hand-edited or stale link) they fall back
  // to the generic lunation reading below, which is still complete, just without the nodal layer.
  if ((event.type === "solar_eclipse" || event.type === "lunar_eclipse") && event.nodeEnd) {
    return composeEclipse(event, chart);
  }

  const meta = EVENT_TYPE_META[event.type];
  const cusps = chart.houses.map((h) => h.longitude);
  // The lunation happens at a specific degree, so place it there. A sign can straddle two
  // houses, and the midpoint fallback used to report the wrong one whenever it did.
  const lunationLon = longitudeForSignDegree(event.sign, event.degree);
  const house = lunationLon === null ? houseForSign(event.sign, cusps) : houseForLongitude(lunationLon, cusps);
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
  // Naming a natal planet and then saying "whatever that placement normally does" is the laziest
  // line in astrology writing, and this file has every planet's actual domain sitting right there
  // in BODY_MEANINGS. So each planet found in the house gets interpreted properly: what it governs,
  // what sign it is wearing, and what it therefore means that this lunation is landing on it.
  const natalDetail = natalHere.map((planet) => {
    const meaningOf = getBodyMeaning(planet.id);
    return {
      name: planet.name,
      sign: planet.sign.toLowerCase(),
      domain: meaningOf?.domain ?? meaningOf?.domainShort ?? "this part of you",
      domainShort: meaningOf?.domainShort ?? "this part of you",
    };
  });

  const natalClauses = natalDetail.map(
    (d) => `your ${d.name} in ${d.sign}, which runs ${d.domain}`
  );
  const natalList =
    natalClauses.length === 1
      ? natalClauses[0]
      : natalClauses.length === 2
        ? `${natalClauses[0]}, and ${natalClauses[1]}`
        : `${natalClauses.slice(0, -1).join("; ")}; and ${natalClauses[natalClauses.length - 1]}`;

  // The short domains, used to say plainly which parts of her get loud, without repeating the
  // full clause a second time.
  const natalDomains = natalDetail.map((d) => `your ${d.domainShort}`);
  const natalDomainList =
    natalDomains.length === 1
      ? natalDomains[0]
      : natalDomains.length === 2
        ? `${natalDomains[0]} and ${natalDomains[1]}`
        : `${natalDomains.slice(0, -1).join(", ")} and ${natalDomains[natalDomains.length - 1]}`;

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
      ? `This isn't landing on an empty patch of sky, it's landing directly on ${natalList}. That's what makes this one personal for you rather than general. When a ${meta.label} sets off a placement you were born with, it doesn't hand you a new theme, it turns the volume up on ${natalDomainList}, the part of you that's been running quietly in the background of this area of your life since the day you were born. ${natalDetail.length === 1 ? `Your ${natalDetail[0].name} wears ${natalDetail[0].sign} here, so expect it to come through as ${SIGN_TRAITS[natalHere[0].sign]?.essence ?? "its own flavour"}, at full strength.` : `Both get switched on at once, which is why this one is likely to feel bigger than the date alone suggests.`} You'll probably recognise the feeling when it arrives. It tends to land less like news and more like something you already knew, finally impossible to ignore.`
      : `You have no natal planets sitting in that house, which is genuinely useful to know rather than a disappointment. It means this area of life is not somewhere you have a fixed, built-in pattern running, so a transit here tends to be felt through circumstances and other people rather than as an old personal reflex. There is less to unlearn, and more room for whatever this lunation brings to actually be new.`,

    rulerPlanet
      ? `One more layer, and it is the one most horoscopes skip. ${capitaliseFirst(event.sign.toLowerCase())} is ruled by ${overview?.ruler}, and your natal ${rulerPlanet.name.toLowerCase()} sits in ${rulerPlanet.sign.toLowerCase()} in your ${ordinalHouse(rulerPlanet.house)} house. That makes your ${ordinalHouse(rulerPlanet.house)} house the place this actually gets handled. The event shows up in your ${houseArea}, but the follow-through, the practical resolution, happens through ${HOUSE_MEANINGS[rulerPlanet.house - 1].lifeAreas[0]}. If you want one place to direct effort this week, that is it.`
      : `${capitaliseFirst(event.sign.toLowerCase())} is ruled by ${overview?.ruler || "its traditional ruler"}, which is the planet setting the tone for how this lunation behaves in your chart, and it is worth watching what that planet is doing over the next fortnight as the story plays out.`,

    `In practice, expect this to arrive wearing ${event.sign.toLowerCase()}'s particular flavour: ${traits.essence}. At its best that shows up as ${traits.gift}. Under pressure the same energy tips into ${traits.shadow}, and a lunation is exactly the sort of moment that reveals which of the two you have been running. Watching which version turns up in your ${houseArea} is the most honest piece of information this whole transit gives you.`,
  ];

  const inYourChart = chartParagraphs.join(" ");

  const bettysTake = `${meta.bettysTakeGeneric} With this one landing in your ${event.sign.toLowerCase()} ${ordinalHouse(house)} house, that plays out through ${houseArea}: expect this to move through ${traits.essence}, not through anyone else's version of it.`;

  // The four personalised sections Betty asked every reading to carry, plus the exercise that
  // replaces the old one-line "move". The chart breakdown above is section one (what it lights up).
  const ctx: SectionCtx = { area: houseArea, sign: event.sign.toLowerCase(), traits, houseMeaning };

  return {
    title: `${meta.label} in ${event.sign.toLowerCase()}`,
    dateLabel,
    emoji: meta.emoji,
    whatThisIs: meta.whatThisIs,
    inYourChart,
    chartParagraphs,
    bringsUp: meta.bringsUp(ctx),
    lookOutFor: meta.lookOutFor(ctx),
    shadow: meta.shadowLine(ctx),
    bettysTake,
    exercise: meta.exercise(ctx),
    journalPrompt: `${meta.promptFraming} (Think specifically about your ${houseArea}.)`,
    affirmation: meta.affirmationFrame(houseArea),
  };
}
