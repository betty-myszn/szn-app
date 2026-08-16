// The eclipse engine. An eclipse is not just a bigger moon: it is a lunation landing on the lunar
// nodes, the chart's fated axis, so it gets its own composer rather than sharing the generic moon
// template in moon-content.ts. It reads the eclipse in her chart, works out which end of her nodal
// axis it sits on, and coaches the fated-versus-yours distinction that ordinary moons never need.
// It reuses the house and sign node primitives already written in nodal-content.ts so the depth is
// composed from existing, high-quality content rather than invented twice. Voice as everywhere:
// cosmic coach, British spellings, no jargon left unexplained.

import type { ChartData } from "@/types/chart";
import {
  SIGN_TRAITS,
  HOUSE_MEANINGS,
  getBodyMeaning,
  ordinalHouse,
  houseForSign,
  longitudeForSignDegree,
  houseForLongitude,
  degreeMeaning,
} from "@/lib/interpretations";
import type { CalendarEventInput, LunationReading, ReadingSection, Exercise } from "@/lib/moon-content";
import {
  HOUSE_AREA,
  NORTH_HOUSE,
  signNode,
  oppositeSign,
  oppositeHouse,
} from "@/lib/nodal-content";

function listClauses(clauses: string[]): string {
  if (clauses.length === 0) return "";
  if (clauses.length === 1) return clauses[0];
  return `${clauses.slice(0, -1).join("; ")}; and ${clauses[clauses.length - 1]}`;
}

// Assumes composeLunation only calls this for solar_eclipse / lunar_eclipse with event.nodeEnd set;
// it still guards nodeEnd so a missing value reads as a south-node eclipse rather than crashing.
export function composeEclipse(event: CalendarEventInput, chart: ChartData): LunationReading {
  const isLunar = event.type === "lunar_eclipse";
  const label = isLunar ? "lunar eclipse" : "solar eclipse";
  const emoji = isLunar ? "\u{1F315}\u{2600}" : "\u{1F311}\u{2600}";

  const eclipseSign = event.sign;
  const onNorth = event.nodeEnd === "north"; // the eclipse itself sits on the north-node end
  const northSign = onNorth ? eclipseSign : oppositeSign(eclipseSign);
  const southSign = oppositeSign(northSign);
  const north = northSign.toLowerCase();
  const south = southSign.toLowerCase();
  const eSign = eclipseSign.toLowerCase();

  const cusps = chart.houses.map((h) => h.longitude);
  // Both ends of the axis sit at the same degree, opposite signs, so derive them from the
  // eclipse's real degree rather than from the midpoint of each sign.
  const eclipseLon = longitudeForSignDegree(eclipseSign, event.degree);
  const northLon = longitudeForSignDegree(northSign, event.degree);
  const eclipseHouse = eclipseLon === null ? houseForSign(eclipseSign, cusps) : houseForLongitude(eclipseLon, cusps);
  const northHouse = northLon === null ? houseForSign(northSign, cusps) : houseForLongitude(northLon, cusps);
  const southHouse = oppositeHouse(northHouse);
  const eh = HOUSE_MEANINGS[eclipseHouse - 1];
  const northArea = HOUSE_AREA[northHouse - 1];
  const eclipseArea = eh.lifeAreas[0];
  const northNote = NORTH_HOUSE[northHouse - 1];
  const nNode = signNode(northSign);
  const sNode = signNode(southSign);
  const traits = SIGN_TRAITS[eclipseSign] ?? SIGN_TRAITS.Leo;
  // The far end of the axis from the eclipse: the end holding the pressure while this one is lit.
  const farHouse = onNorth ? southHouse : northHouse;
  const fh = HOUSE_MEANINGS[farHouse - 1];

  const date = new Date(`${event.date}T12:00:00Z`);
  const dateLabel = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const whatThisIs = isLunar
    ? `A lunar eclipse is a full moon with the earth's shadow across it, and it sits on the lunar nodes, the fated axis of the chart. That is what turns it from a bright night into something with force behind it: it forces a culmination rather than simply lighting one. This one falls in ${eSign}, on the ${onNorth ? "north node, the growth end" : "south node, the release end"} of the axis the whole collective is moving along, so it tends to land as an ending or a reckoning that arrives on its own timeline, not yours.`
    : `A solar eclipse is a new moon with the moon blocking out the sun, and it sits on the lunar nodes, the fated axis of the chart. That is what turns it from a strong reset into something with real weight: it forces a beginning rather than gently seeding one. This one falls in ${eSign}, on the ${onNorth ? "north node, the growth end" : "south node, the release end"} of the axis the whole collective is moving along, so it tends to arrive as an event, a door opening or closing, on a timeline that is not yours to set.`;

  const primer: ReadingSection[] = [
    {
      heading: "what makes an eclipse an eclipse",
      body: `A new moon and a full moon come around every month. An eclipse is rarer than that: it only happens when the moon lines up almost exactly with the lunar nodes, the two points where the moon's path crosses the sun's. That alignment is where the force comes from. An eclipse is a lunation landing on the chart's fated axis, the line that describes where you are growing and what you are leaving behind, so it moves things that an ordinary moon would only light up.`,
    },
    {
      heading: "the axis this one sits on",
      body: `The nodes are always one axis, not two separate points. Right now the north node, the growth end, is in ${north}, and the south node, the familiar end you are being asked to release, is in ${south}. This eclipse falls in ${eSign}, which puts it on the ${onNorth ? `${north} north node, so it pushes on growth and beginnings` : `${south} south node, so it pushes on release and endings`}. Whatever it stirs is a scene in that eighteen-month story, not a one-off mood.`,
    },
    {
      heading: "it comes in a family, not alone",
      body: `Eclipses arrive in pairs and trios roughly every six months, and they keep landing on the same axis for around eighteen months at a time. So this is not an isolated date. What began or ended around the last eclipse on this axis is very often what comes back now, one step further on. It helps to think in chapters: this eclipse is the next scene in a story your life has been telling since the nodes moved onto this axis.`,
    },
    {
      heading: "what is fated, and what is yours",
      body: `The uncomfortable and freeing truth of an eclipse is that some of it is genuinely out of your hands. Doors open and close on their own schedule, and trying to force a decision to match the drama usually backfires. Your job is not to manufacture a dramatic move. It is to notice what is already shifting, respond to it honestly, and let the timing be what it is. The eclipse does the forcing. You do the responding.`,
    },
  ];

  const natalHere = chart.planets.filter((p) => p.house === eclipseHouse);
  const natalList = listClauses(
    natalHere.map((p) => {
      const m = getBodyMeaning(p.id);
      return `your ${p.name} in ${p.sign.toLowerCase()}, which runs ${m?.domain ?? m?.domainShort ?? "this part of you"}`;
    })
  );

  // The sign sitting on the eclipse house's cusp. When it differs from the eclipse sign, the
  // eclipse sign is intercepted (or simply later) inside this house, so a member who knows her
  // rising sees an eclipse in one sign land in a house she thinks of as another, e.g. an Aquarius
  // rising with a Pisces eclipse in her 1st because Pisces is intercepted there. Naming it stops
  // that reading as a mistake.
  const cuspSign = chart.houses[eclipseHouse - 1]?.sign;
  // Always explain it when the eclipse sign is not the sign on the cusp. A member who knows her
  // rising will otherwise read "Pisces eclipse in your 1st house" as an error, because she thinks
  // "my 1st house is Aquarius". Both are true: the cusp is Aquarius and Pisces is swallowed inside
  // the same house. Naming both signs and teaching that a house can hold more than one sign is the
  // difference between this landing as smart and landing as broken.
  const interceptedNote =
    cuspSign && cuspSign.toLowerCase() !== eSign
      ? ` Quick thing so this does not look wrong, because it is the part everyone second-guesses: a house and a sign are not the same thing. Your ${ordinalHouse(eclipseHouse)} house opens in ${cuspSign.toLowerCase()}, which is the sign you will see on your ${ordinalHouse(eclipseHouse)} house everywhere else, but the house is wide enough to take in ${eSign} as well, so the whole of ${eSign} sits inside it too. A single house often holds more than one sign like this. That is exactly why a ${eSign} eclipse lands in the house you think of as your ${cuspSign.toLowerCase()} house, and both things are true at once.`
      : "";

  const chartParagraphs: string[] = [
    `This ${label} in ${eSign} lands in your ${ordinalHouse(eclipseHouse)} house of ${eh.title}, ${eh.rules}.${interceptedNote} For you specifically it is putting real pressure on ${eclipseArea}, landing at ${degreeMeaning(event.degree)} ${eh.coach}`,

    onNorth
      ? `It sits on the north node, currently in ${north}, the growth end of the axis the whole collective is moving along, and right now that growth end runs through this house of yours. What this house is asking of you over the next eighteen months is ${northNote.growingToward}, and an eclipse here tends to shove you a chapter further into it whether or not you felt ready. Growth this direct rarely feels comfortable: ${nNode.northFeels}. That discomfort is the sensation of doing something for the first time, not a sign you got it wrong.`
      : `It sits on the south node, currently in ${south}, the familiar end of the collective axis being asked to release, and right now that release end runs through this house of yours. Your strength here is genuine and you keep every bit of it, ${sNode.southGift}, but the reflex being retired is ${sNode.southReflex}. An eclipse on the south node tends to close something here so the growth end of the axis finally has room to move.`,

    `An eclipse is always an axis, so the other end is holding the pressure too. Your ${ordinalHouse(farHouse)} house of ${fh.title} sets the terms underneath this, ${fh.rules}. ${onNorth ? `That south-node end is the comfort you will be most tempted to retreat into exactly as the growth end asks more of you.` : `That north-node end is where the space this ending clears is actually meant to go, so notice what wants to grow there once you stop holding the old thing open.`}`,

    natalHere.length > 0
      ? `This is not landing on an empty patch of sky. It falls directly on ${natalList}, which is what makes this eclipse personal to you rather than general. When an eclipse sets off a placement you were born with, it turns the volume all the way up on it, and you tend to recognise the feeling the moment it arrives, less like news and more like something you already knew becoming impossible to ignore.`
      : `You have no natal planets sitting in this house, which is genuinely useful to know. It means this area runs less on a fixed, built-in pattern and more through circumstances and other people, so what the eclipse brings here has room to actually be new rather than an old reflex firing again.`,
  ];

  const inYourChart = chartParagraphs.join(" ");

  const degreeNote: ReadingSection | undefined =
    event.degree >= 29
      ? {
          heading: "why 29 degrees matters here",
          body: `This eclipse lands at the 29th degree, the anaretic or critical degree, the very last one of the sign. It is traditionally read as the degree of completion: the sign has run its full course, and things sitting here rarely sit still. An eclipse at 29 degrees behaves like a chapter closing right before a new one opens, which is why it can feel so pushed. Expect it to arrive as a decision or an event rather than a mood.`,
        }
      : undefined;

  const bringsUp = isLunar
    ? `Expect something around your ${eclipseArea} to come to a head and be forced rather than merely felt: an ending, a truth you can no longer file away, a chapter that closes on its own schedule. ${onNorth ? "Even on the growth end, a lunar eclipse tends to clear the ground with an ending before the new thing can root." : "On the south node this often lands as the final release of something you have already half outgrown."}`
    : `Expect movement around your ${eclipseArea} rather than a gentle nudge: an opening, an offer, a beginning that arrives faster than you planned. ${onNorth ? "On the north node this is the growth edge lurching forward, often through an opportunity you did not fully feel ready for." : "Even on the release end, a solar eclipse can start something, usually the fresh thing that only becomes possible once you let the old one go."}`;

  const lookOutFor = `The eclipse trap is forcing a decision to match the intensity. What is genuinely shifting is already in motion, and manufacturing drama to feel in control tends to make it worse. When the pressure spikes, your ${eSign} wiring can tip into ${traits.shadow}, and around your ${eclipseArea} that is exactly the reflex that will push you to grab, cling or blow something up before the picture is clear.`;

  const shadow = `The shadow this eclipse exposes is ${traits.shadow}, and an eclipse does not do subtle. Around your ${eclipseArea} it surfaces fast and often in front of other people, which stings and is also the most honest information this whole window hands you. Seeing it without acting on it in the same breath is the work.`;

  const exercise: Exercise = isLunar
    ? {
        title: "let the eclipse complete",
        intro: `A lunar eclipse is for release, not repair. Twenty minutes, gently, ideally after the peak rather than during it.`,
        steps: [
          `Name what is actually ending around your ${eclipseArea}, including the part of it you have been quietly trying to keep alive past its time.`,
          `Write what it gave you and what it cost you, so the ending is grieved honestly instead of argued with.`,
          `Choose one way you will let it finish this week rather than reopen it, and protect the space it clears for your ${northArea} instead of rushing to fill it.`,
        ],
      }
    : {
        title: "the eclipse watch",
        intro: `A solar eclipse is for noticing and responding, not forcing. Keep this observational across the fortnight after the eclipse.`,
        steps: [
          `Write down what is already moving around your ${eclipseArea} on its own, the door that seems to be opening without you pushing it.`,
          `Hold off on one big decision this week made purely to match the intensity. Let the situation reveal its hand before you commit.`,
          `Name the ${onNorth ? `${northArea} opening` : "fresh start"} you would say yes to if you trusted it was meant for you, then watch what the next fortnight does with it.`,
        ],
      };

  const bettysTake = `I tell my girls to treat eclipse season differently to a normal moon. Less setting a neat intention, more expecting a door to open or close on its own timeline. This one is landing in your ${eSign} ${ordinalHouse(eclipseHouse)} house, so it plays out through your ${eclipseArea}, and it will move through ${traits.essence}, not through anyone else's version of it. Don't force a decision to prove you are in control. Notice what is already shifting, respond to it like an adult, and let the eclipse do the part that was never yours to do.`;

  return {
    title: `${label} in ${eSign}`,
    dateLabel,
    emoji,
    whatThisIs,
    primerTitle: "the eclipse, explained",
    primer,
    inYourChart,
    chartParagraphs,
    degreeNote,
    bringsUp,
    lookOutFor,
    shadow,
    bettysTake,
    exercise,
    journalPrompt: `What is actually shifting around my ${eclipseArea} on its own right now, and what would change if I stopped trying to force it and simply responded to it honestly?`,
    affirmation: onNorth
      ? `I let this eclipse move me forward in my ${eclipseArea}, and I trust what is opening even before I feel ready.`
      : `I let what is ending in my ${eclipseArea} actually end, and I trust the space it clears.`,
  };
}
