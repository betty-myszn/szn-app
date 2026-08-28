// The eclipse engine. An eclipse is a lunation landing on the lunar
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
  houseSpanNote,
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
  transitingNorthNodeSign,
} from "@/lib/nodal-content";
import { daysUntilSkyDate } from "@/lib/sky-zone";

// Betty's collective opening for the 27-28 August 2026 Pisces lunar eclipse, the closing act of the
// Pisces/Virgo cycle. Shown to every member at the top of this eclipse's reading. Verbatim, one
// paragraph per string.
const PISCES_ECLIPSE_OPENING: string[] = [
  "If the energy has felt absolutely WILDDDD lately, with emotions coming out of nowhere, dreams becoming ridiculously vivid, old memories resurfacing at the weirdest times, your intuition getting louder and your body simultaneously requesting approximately fourteen business days of sleep, the Pisces Lunar Eclipse on August 27-28, 2026 is happening right in the middle of all of it.",
  "We're reaching the closing stages of a much bigger Pisces-Virgo eclipse cycle that began back in September 2024, bringing almost two years of changes around dreams, reality, intuition, boundaries, wellbeing, work, spirituality, emotional patterns and the parts of your life that have been slowly shifting while you've been busy living them.",
  "Eclipses make considerably more sense when you follow the entire cycle rather than looking at one date in isolation, because the woman who entered this chapter in September 2024 probably had very different ideas about what she wanted, who mattered, what success looked like, where her energy belonged and what she imagined she'd be doing by now.",
  "Fast-forward almost two years and babyyyyyy, a LOT can change.",
  "Most of that change happens while you're getting on with your life, making decisions, meeting people, losing interest in things, becoming obsessed with new ideas, raising your standards, changing your priorities and discovering that certain situations simply don't fit anymore, so you don't always recognise the scale of what's happened until you deliberately look backwards.",
  "The perspective available now could be HUGE.",
  "And this one is part of a MUCHHH bigger story, because we're deep into the Virgo-Pisces eclipse series that began in September 2024 and runs all the way into February 2027. Whatever is coming up for you right now might have roots stretching back almost two years.",
  "Virgo and Pisces sit opposite each other, so this entire series has been working with control and surrender, routines and intuition, practicality and dreaming, discernment and faith, perfectionism and acceptance: the life you've carefully organised, and the life your soul keeps pulling you towards.",
  "Think about how much has changed since September 2024, because you might now be living inside decisions that started as tiny thoughts back then, watching relationships evolve that were already beginning to shift, finally releasing patterns you've spent YEARS trying to understand, or realising that something you desperately wanted at the beginning of this cycle doesn't even fit the person you've become.",
  "That's why eclipse seasons can feel so strangely familiarrrrr. They bring you back to the same storyline again and again, each time from a different angle, until you finally see what you've been missing, make the decision you've been avoiding, or realise you've already changed far more than you thought.",
  "So go back to September 2024 and ask yourself: what was happening in my life, what was I trying to control, what was I dreaming about, what was beginning to fall away, and what did I know needed to change even if I wasn't ready to change it yet? Then look at where you are NOWWWW.",
  "Because this story still has more to say before the Virgo-Pisces series finishes in February 2027, and this Pisces eclipse could be a pretty major chapter in whatever has been unfolding for you since it began.",
];

// Reflection questions for the eclipse journal block. The first ones are Betty's "go back to
// September 2024" series questions, shown on every Virgo/Pisces-axis eclipse because the whole point
// is placing this date inside the eighteen-month story rather than reading it alone. The last two
// are generated from her own house so the set is never purely collective.
function eclipsePrompts(area: string, sign: string): string[] {
  return [
    "Cast your mind back to September 2024, when this eclipse series began. What was happening in your life then? What were you trying to control, and what were you dreaming about?",
    "What was already beginning to fall away back then, and what did you know needed to change even if you weren't ready to change it yet?",
    "Now look at where you are today. What has genuinely changed since then, including the changes so gradual you never stopped to clock them?",
    `Where in your life are you still choosing control over surrender, or dreaming over doing something about it? What would a truer balance actually look like around your ${area}?`,
    `What is shifting around your ${area} on its own right now, and what would change if you stopped forcing it and simply responded to it honestly?`,
    `Where is your ${sign} energy asking to be trusted rather than managed?`,
  ];
}

// ── NATAL CONTACTS ────────────────────────────────────────────────────────────────────────────
// The single biggest lift in feeling personally seen: whether this eclipse's actual degree touches
// something she was born with. Everything here is measured from real longitudes, never from signs,
// so a contact is only reported when the degrees genuinely are that close.

type AspectName = "conjunction" | "opposition" | "square" | "trine" | "sextile";

// Orbs are deliberately tight. A wide orb would let almost every eclipse "contact" something, which
// would make the section meaningless. Conjunctions and oppositions get slightly more room because
// they are the ones actually felt as an eclipse hitting a placement.
const ECLIPSE_ASPECTS: { name: AspectName; angle: number; orb: number }[] = [
  { name: "conjunction", angle: 0, orb: 6 },
  { name: "opposition", angle: 180, orb: 6 },
  { name: "square", angle: 90, orb: 5 },
  { name: "trine", angle: 120, orb: 5 },
  { name: "sextile", angle: 60, orb: 3 },
];

interface NatalContact {
  bodyId: string;
  bodyName: string;
  sign?: string;
  house?: number;
  aspect: AspectName;
  orb: number;
}

function separation(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// What each contact actually MEANS when an eclipse sets it off, written as the combination rather
// than a definition of the planet. Keyed by body id; anything not listed falls back to its domain.
const CONTACT_MEANING: Record<string, string> = {
  sun: "your sense of who you are is directly in the frame, so this eclipse is far more likely to change something about how you see yourself, not just what you are doing",
  moon: "it is landing on your emotional wiring, which is why this one may feel disproportionately big on the inside even if very little looks dramatic from the outside",
  rising: "it is landing on the face you meet the world with, so this is one of the eclipses that can visibly change how you present, what you are called, or how people read you",
  mercury: "it is landing on how you think and speak, so expect the shift to arrive through a conversation, a message, a piece of information or a decision you finally put into words",
  venus: "it is landing on how you love, attract and value things, so relationships, money, taste or self-worth are the department this eclipse is actually working in",
  mars: "it is landing on your drive and your anger, so this one is likely to force action, confrontation, or the end of something you have been passively tolerating",
  jupiter: "it is landing on where you expand, so this eclipse tends to arrive as an opportunity, an opening, or a genuine widening of what you thought was available to you",
  saturn: "it is landing on your mastery point, which is why this eclipse can feel heavy and consequential: it is asking for a commitment, a structure, or an honest reckoning with responsibility",
  uranus: "it is landing on your rebel wiring, so the change is likely to be sudden, liberating and hard to argue with, the kind that resolves something you had been dragging out",
  neptune: "it is landing on your imagination and your blind spot at once, so this eclipse can be revelatory and disorienting together, and it is worth being slow about what you conclude",
  pluto: "it is landing on your deepest transformation point, which is why this one tends to be the eclipse people talk about years later as the before-and-after line",
  chiron: "it is landing on your core wound, so this eclipse is likely to press exactly where you are most sensitive, and that soreness is the material rather than the problem",
  northnode: "it is landing on your own north node, your growth direction, which makes this eclipse unusually fated: it is pushing you along the exact line your chart already points you down",
  southnode: "it is landing on your own south node, the familiar end you keep returning to, so this eclipse is most likely to close a loop you have circled many times before",
  midheaven: "it is landing on your career and public point, so this eclipse tends to show up as work, status, reputation or the direction your life visibly points in",
};

const ASPECT_FRAME: Record<AspectName, string> = {
  conjunction: "sitting directly on",
  opposition: "sitting exactly opposite",
  square: "at a right angle to",
  trine: "in easy flow with",
  sextile: "in supportive contact with",
};

const ASPECT_TONE: Record<AspectName, string> = {
  conjunction: "A conjunction is the most direct contact there is: the eclipse and this part of you are occupying the same degree, so whatever the eclipse does, it does through this.",
  opposition: "An opposition puts the eclipse and this part of you at opposite ends of the same axis, so this tends to play out through tension, other people, or a pull in two directions that has to be balanced rather than won.",
  square: "A square is friction that produces movement. It is the aspect that makes something actually happen rather than stay theoretical, and it usually costs a bit of comfort to get there.",
  trine: "A trine is the easy one, which is its own risk: it can flow past unnoticed. What it offers is genuine support, but you have to reach for it, because ease rarely announces itself.",
  sextile: "A sextile is an opportunity that waits to be taken. It will not force your hand, so this contact tends to reward a deliberate choice rather than deliver something unprompted.",
};

// Finds every natal placement and angle the eclipse degree genuinely contacts, tightest first.
function findNatalContacts(eclipseLon: number, chart: ChartData): NatalContact[] {
  const targets: { id: string; name: string; lon: number; sign?: string; house?: number }[] = chart.planets.map((p) => ({
    id: p.id,
    name: p.name,
    lon: p.longitude,
    sign: p.sign,
    house: p.house,
  }));
  // The angles are not in the planets list, and an eclipse on the ascendant or midheaven is one of
  // the most strongly felt contacts there is, so they are added explicitly.
  targets.push({ id: "rising", name: "Ascendant", lon: chart.ascendant });
  targets.push({ id: "midheaven", name: "Midheaven", lon: chart.midheaven });

  const found: NatalContact[] = [];
  for (const t of targets) {
    const sep = separation(eclipseLon, t.lon);
    for (const a of ECLIPSE_ASPECTS) {
      const orb = Math.abs(sep - a.angle);
      if (orb <= a.orb) {
        found.push({ bodyId: t.id, bodyName: t.name, sign: t.sign, house: t.house, aspect: a.name, orb });
        break; // one aspect per body, the one it actually makes
      }
    }
  }
  // Tightest first, and conjunctions win ties because they are what she will actually feel.
  return found.sort((a, b) => {
    if (a.aspect === "conjunction" && b.aspect !== "conjunction") return -1;
    if (b.aspect === "conjunction" && a.aspect !== "conjunction") return 1;
    return a.orb - b.orb;
  });
}

// ── WHAT TO WATCH NOW ─────────────────────────────────────────────────────────────────────────
// The page must not read the same three weeks after the eclipse as it does the week before. Phase
// is measured in SKY_ZONE (US Eastern), the same anchor every published date in the app uses, so
// "today" here always agrees with the date printed at the top of the reading.
function watchNowFor(eventDate: string, area: string, isLunar: boolean, now: Date): { label: string; body: string } {
  const days = daysUntilSkyDate(eventDate, now);

  if (days > 14) {
    return {
      label: `${days} days out`,
      body: `The eclipse has not landed yet, so nothing here needs deciding. What is genuinely useful this far out is a baseline: notice where your ${area} stands right now, honestly, before the pressure arrives. Eclipses are much easier to read afterwards if you can remember what you actually thought before one. Write the current state down somewhere you will find it again.`,
    };
  }
  if (days > 1) {
    return {
      label: `${days} days to go`,
      body: `You are inside the run-up. The fortnight before an eclipse is usually where things start quietly moving, so watch for what is already shifting around your ${area} without you pushing it: the conversation that keeps almost happening, the situation that has started wobbling, the thing you have begun thinking about differently. That is the eclipse arriving early. Resist the urge to force any of it into a conclusion this week.`,
    };
  }
  if (days >= -1) {
    return {
      label: "you are inside the window",
      body: `This is the peak. Judgement is at its least reliable right now and feeling is at its most convincing, which is a combination worth knowing about before you act on anything. Notice what surfaces around your ${area}, write it down, and let it stand for a few days before you decide what it means. ${isLunar ? "Lunar eclipses tend to deliver the information through other people and events over these days, so pay attention to what arrives rather than what you conclude." : "Solar eclipses tend to open a door around now, and it rarely comes with enough time to feel ready, so notice what you are being offered before you rule it out."} Rest more than seems necessary.`,
    };
  }
  if (days >= -30) {
    const ago = Math.abs(days);
    return {
      label: `${ago} day${ago === 1 ? "" : "s"} on`,
      body: `The eclipse has passed, so this is the part that actually matters: check the receipts. What has genuinely changed around your ${area} since it landed? Look for the concrete evidence rather than the mood, because the meaning of an eclipse usually settles over the month afterwards rather than on the night. Something that felt catastrophic at the peak often reads very differently from here, and something that seemed minor at the time can turn out to have been the hinge the whole thing turned on.`,
    };
  }
  const ago = Math.abs(days);
  return {
    label: `${ago} days on`,
    body: `You are well past this one now, which makes it good material rather than live weather. Look back at what moved around your ${area} in the weeks after it, because that is the clearest read you will get on what this eclipse was actually doing. Eclipses land on the same axis for around eighteen months, so what began or ended here is very likely to come back at the next one, one step further on. Knowing what this one did is how you recognise the next.`,
  };
}

function listClauses(clauses: string[]): string {
  if (clauses.length === 0) return "";
  if (clauses.length === 1) return clauses[0];
  return `${clauses.slice(0, -1).join("; ")}; and ${clauses[clauses.length - 1]}`;
}

// Assumes composeLunation only calls this for solar_eclipse / lunar_eclipse with event.nodeEnd set;
// it still guards nodeEnd so a missing value reads as a south-node eclipse rather than crashing.
export function composeEclipse(event: CalendarEventInput, chart: ChartData, now?: Date): LunationReading {
  const isLunar = event.type === "lunar_eclipse";
  const label = isLunar ? "lunar eclipse" : "solar eclipse";
  const emoji = isLunar ? "\u{1F315}\u{2600}" : "\u{1F311}\u{2600}";

  const eclipseSign = event.sign;
  const onNorth = event.nodeEnd === "north"; // the eclipse itself sits on the north-node end
  // The node axis is read from the ACTUAL transiting node, never derived from the eclipse's own
  // sign: at an eighteen-month cusp (the 2026 Pisces->Aquarius turn) an eclipse can land in the sign
  // next door to the node it sits on, e.g. a ~5 Pisces eclipse on the north node while that node is
  // already in Aquarius. See transitingNorthNodeSign.
  const northSign = transitingNorthNodeSign(event.date);
  const southSign = oppositeSign(northSign);
  const north = northSign.toLowerCase();
  const south = southSign.toLowerCase();
  const eSign = eclipseSign.toLowerCase();
  // True at a normal eclipse, false only at a node-cusp eclipse where the eclipse sign and the node
  // sign differ (e.g. Pisces eclipse, Aquarius node).
  const eclipseOnNodeSign = eSign === north || eSign === south;

  const cusps = chart.houses.map((h) => h.longitude);
  // The eclipse house comes from the eclipse's own degree. The node houses come from the node
  // SIGN, because the node can be a whole sign away from the eclipse at a cusp, so its degree is
  // not the eclipse's degree.
  const eclipseLon = longitudeForSignDegree(eclipseSign, event.degree);
  const eclipseHouse = eclipseLon === null ? houseForSign(eclipseSign, cusps) : houseForLongitude(eclipseLon, cusps);
  const northHouse = houseForSign(northSign, cusps);
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
    ? `A lunar eclipse happens when the moon lands right on the lunar nodes, the fated axis of the chart, the line the whole collective is being moved along. That is where the weight comes from: sitting on the axis forces a culmination rather than simply lighting one. This one falls in ${eSign}, on the ${onNorth ? "north node, the growth end" : "south node, the release end"}, so it tends to land as an ending or a reckoning that arrives on its own timeline, not yours.`
    : `A solar eclipse happens when the moon lands right on the lunar nodes, the fated axis of the chart, the line the whole collective is being moved along, and blocks out the sun as it does. That is where the weight comes from: sitting on the axis forces a beginning rather than gently seeding one. This one falls in ${eSign}, on the ${onNorth ? "north node, the growth end" : "south node, the release end"}, so it tends to arrive as an event, a door opening or closing, on a timeline that is not yours to set.`;

  const primer: ReadingSection[] = [
    {
      heading: "what makes an eclipse an eclipse",
      body: `A new moon and a full moon come around every month. An eclipse is rarer than that: it only happens when the moon lines up almost exactly with the lunar nodes, the two points where the moon's path crosses the sun's. That alignment is where the force comes from. An eclipse is a lunation landing on the chart's fated axis, the line that describes where you are growing and what you are leaving behind, so it moves things that an ordinary moon would only light up.`,
    },
    // Betty's call: no node-mechanics explainer on the page. The technical "north node is in X,
    // south node is in Y" framing was jargon that added nothing to what she actually feels, so the
    // primer reads the eclipse through its own SIGN instead, for every eclipse. The node end still
    // shapes the interpretation everywhere below (growth versus release), it is just no longer
    // taught as its own lesson here.
    {
      heading: `why this one is so ${eSign}`,
      body: `This eclipse lands in ${eSign}, and that is the flavour of everything it stirs, so ${eSign} is what to read it through: ${traits.essence}. It arrives at the closing stretch of the eclipse family that has been running on this sign for the better part of two years, which is why it can feel like the final act of something you have been living through for a while, rather than a shock arriving from nowhere. What it moves will look like ${eh.lifeAreas.slice(0, 2).join(" and ")} in your own life, and it will move in a ${eSign} way rather than a tidy one.`,
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
  const interceptedNote = houseSpanNote(eclipseSign, eclipseHouse, chart.houses[eclipseHouse - 1]?.sign, label);

  const chartParagraphs: string[] = [
    `This ${label} in ${eSign} lands in your ${ordinalHouse(eclipseHouse)} house of ${eh.title}, ${eh.rules}.${interceptedNote} For you specifically it is putting real pressure on ${eclipseArea}, landing at ${degreeMeaning(event.degree)} ${eh.coach}`,

    // Only frame this through the collective node axis when the eclipse is genuinely in the node's
    // sign. Otherwise the node signs are a technicality with nothing to do with what she is feeling,
    // so this reads the eclipse through its own sign and house instead.
    eclipseOnNodeSign
      ? onNorth
        ? `It sits on the north node, currently in ${north}, the growth end of the axis the whole collective is moving along, and right now that growth end runs through this house of yours. What this house is asking of you over the next eighteen months is ${northNote.growingToward}, and an eclipse here tends to shove you a chapter further into it whether or not you felt ready. Growth this direct rarely feels comfortable: ${nNode.northFeels}. That discomfort is the sensation of doing something for the first time, not a sign you got it wrong.`
        : `It sits on the south node, currently in ${south}, the familiar end of the collective axis being asked to release, and right now that release end runs through this house of yours. Your strength here is genuine and you keep every bit of it, ${sNode.southGift}, but the reflex being retired is ${sNode.southReflex}. An eclipse on the south node tends to close something here so the growth end of the axis finally has room to move.`
      : `This one belongs to the eclipse family that has been working on ${eSign} for close to two years, so what it touches in this house of yours is almost certainly not new. It is the same theme you have been quietly living with, arriving at the point where it wants a conclusion rather than more patience. ${eh.coach} Expect it to read as the moment the thing you already suspected becomes impossible to keep filing away.`,

    `An eclipse is always an axis, so the other end is holding the pressure too. Your ${ordinalHouse(farHouse)} house of ${fh.title} sets the terms underneath this, ${fh.rules}. ${onNorth ? `That south-node end is the comfort you will be most tempted to retreat into exactly as the growth end asks more of you.` : `That north-node end is where the space this ending clears is actually meant to go, so notice what wants to grow there once you stop holding the old thing open.`}`,

    natalHere.length > 0
      ? `This is not landing on an empty patch of sky. It falls directly on ${natalList}, which is what makes this eclipse personal to you rather than general. When an eclipse sets off a placement you were born with, it turns the volume all the way up on it, and you tend to recognise the feeling the moment it arrives, as something you already knew becoming impossible to ignore.`
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

  // Every one of these sections is written as several paragraphs joined by a blank line: the page
  // splits on "\n\n" and renders one <p> per paragraph. Long on purpose, and long for EVERY chart,
  // not just charts with planets in the eclipse house: the house's own life areas, the axis, the
  // sign and the node end give enough real material to say something specific to her the whole way
  // down, which is the difference between a reading and a horoscope.
  const areasLong = eh.lifeAreas.slice(0, 3).join(", ");
  const farAreas = fh.lifeAreas.slice(0, 2).join(" and ");

  const bringsUp = isLunar
    ? [
        `Expect something around your ${eclipseArea} to come to a head and be forced rather than merely felt: an ending, a truth you can no longer file away, a chapter that closes on its own schedule instead of waiting for you to feel ready. Lunar eclipses work by revelation, so the information that surfaces now is rarely brand new. It is usually the thing you already half knew and had found a way to live around, arriving with the volume turned all the way up.`,

        `Because this lands in your ${ordinalHouse(eclipseHouse)} house of ${eh.title}, it will show up through ${areasLong} rather than as a vague mood. Watch for it arriving through other people: a conversation you did not schedule, a decision someone else makes, a situation that resolves itself without asking your permission. That is characteristic of a lunar eclipse. It tends to deliver the news through the outside world rather than through a quiet inner realisation, which is exactly why it can feel like it came out of nowhere when in truth it has been building for months.`,

        `It will move in a ${eSign} way, not a tidy one, because ${traits.essence} is the flavour this eclipse is working through. So the ending, the reveal or the reckoning is likely to carry that signature: the pace of it, the tone of it, the way it asks to be handled. If you have been expecting this area of your life to change politely and gradually, ${eSign} is not the sign that does that.`,

        `The other end of the axis is involved too, even though the spotlight is here. Your ${ordinalHouse(farHouse)} house of ${fh.title} holds the counterweight, so what gets forced around your ${eclipseArea} will almost certainly have consequences for ${farAreas}. Eclipses rebalance a whole axis rather than a single room, and the pressure you feel is usually the two ends being pulled into a truer proportion with each other.`,

        `The days either side can feel physically strange: disrupted sleep, unusually vivid dreams, an emotional tide that seems out of proportion to what is actually happening, and a body that wants considerably more rest than your calendar has allowed for. That is a nervous system doing real work on something bigger than a normal week. Treat it as a signal to slow down, and give yourself materially more rest than the week seems to justify.`,

        onNorth
          ? `Even on the growth end, a lunar eclipse tends to clear the ground with an ending before the new thing has anywhere to root. If something falls away around your ${eclipseArea} now, read it as the clearing rather than the punishment. The growth this axis is pointing you toward genuinely needs the space.`
          : `This often lands as the final release of something you have already half outgrown around your ${eclipseArea}, and the relief usually arrives a little while after the grief does. Both are allowed to be true in the same week. Give the grief its hour without letting it talk you into reopening what has finished.`,
      ].join("\n\n")
    : [
        `Expect movement around your ${eclipseArea} rather than a gentle nudge: an opening, an offer, a beginning that arrives faster than you planned and on a timeline you did not set. Solar eclipses behave like doors rather than seeds. What starts here tends to arrive as an event, a message, an introduction or an opportunity, and it usually asks for a yes before you feel fully prepared to give one.`,

        `Because this lands in your ${ordinalHouse(eclipseHouse)} house of ${eh.title}, it will show up through ${areasLong} specifically. The shift is often visible to other people before it is fully clear to you, so do not be surprised if someone comments on the change while you are still deciding whether anything has actually happened. That lag between the outside world noticing and you catching up is one of the most reliable signatures of a solar eclipse in a house.`,

        `It will arrive in a ${eSign} way, because ${traits.essence} is the register this eclipse is operating in. That shapes what the opening looks like and how it wants to be answered, and it is worth naming, because an opportunity that arrives in a ${eSign} tone can be easy to misread if you were waiting for it to look like something more familiar.`,

        `The far end of the axis carries this too. Your ${ordinalHouse(farHouse)} house of ${fh.title} is the counterweight, so anything beginning around your ${eclipseArea} will ask something of ${farAreas} in return. Time, attention, priority, or a rebalancing you have been putting off. New things are rarely free of consequence elsewhere, and knowing which room pays the cost lets you choose deliberately rather than discover it later.`,

        `The fortnight around it can feel oddly accelerated. Things you had been slowly deliberating suddenly resolve, conversations move quicker than usual, and it is common to feel wired and exhausted at once while your system tries to keep pace with the speed. Build in more recovery than you think you need, because the tiredness that follows an eclipse is often delayed rather than absent.`,

        onNorth
          ? `On the growth end this is the edge of your life lurching forward, usually through something you did not feel qualified for at the moment it was offered. The unreadiness is not a reason to decline. It is the ordinary sensation of doing something for the first time, and this axis has been pointing you here for months.`
          : `Even on the release end a solar eclipse can start something, and it is usually the fresh thing that only became possible once the old one finally ended. If a beginning shows up around your ${eclipseArea} now, check what had to finish first for it to reach you.`,
      ].join("\n\n");

  const lookOutFor = [
    `The eclipse trap is forcing a decision to match the intensity. What is genuinely shifting is already in motion, and manufacturing drama so you feel in control of it tends to make the whole thing louder and messier than it needed to be. The urge to act is not evidence that acting is right. Very often it is just the discomfort of not yet knowing.`,

    `When the pressure spikes, your ${eSign} wiring can tip into ${traits.shadow}, and around your ${eclipseArea} that is exactly the reflex that will push you to grab, cling or blow something up before the picture is clear. Knowing your own tell here is most of the defence. The moment you catch that specific flavour of urgency rising, you can name it as the eclipse rather than as instruction.`,

    `Concretely, watch for the urge to send the message at midnight, to demand a definite answer from someone who has not finished thinking, to quit or confess or commit purely because the tension has become unbearable to sit inside. Watch too for the quieter version: going cold, withdrawing without explanation, or deciding something about ${farAreas} in your head and acting on it before anyone else knows there was a conversation to have.`,

    `Eclipse energy is famously unreliable for judgement in the moment. The feeling is real and the information is real, but the interpretation you reach at peak intensity is often the one you would not choose a fortnight later. The facts usually survive the window. The story you build around them at 2am usually does not.`,

    `It helps to know the window runs wider than the date itself, roughly a week either side, and the meaning of what happens frequently only settles in the month that follows. Anything that looks catastrophic on the night has a habit of reading very differently once the dust drops, and things that seemed minor at the time can turn out to have been the actual hinge.`,

    `So: hold the irreversible decisions, keep the reversible ones small, and let the situation show you its hand before you act on it. If something genuinely needs to end or begin around your ${eclipseArea}, it will still need to in three weeks, and you will be making the call with far better information and a steadier nervous system.`,
  ].join("\n\n");

  const shadow = [
    `The shadow this eclipse exposes is ${traits.shadow}, and an eclipse does not do subtle. Around your ${eclipseArea} it surfaces fast and often in front of other people, which stings and is also the most honest information this whole window hands you.`,

    `Shadow here means the part of the pattern that runs automatically, usually because it protected you at some point and was never consciously retired. Under eclipse pressure it fires before you can choose, which is precisely why an eclipse is such an efficient way to see it. You get to watch your own default in real time, while it is happening.`,

    `In your ${ordinalHouse(eclipseHouse)} house of ${eh.title}, it tends to wear a specific costume: it will look reasonable. It will feel like protecting yourself, being realistic, or finally saying what needed saying. That is the giveaway. The reflex almost always arrives dressed as good judgement, and around ${areasLong} it is unusually persuasive because you have run it so many times before.`,

    `Seeing it without acting on it in the same breath is the work. You do not have to fix it this week, and trying to overhaul a lifelong pattern inside an eclipse window is its own kind of forcing. Noticing it, naming it, and letting it pass through without obeying it is genuinely enough. That gap between the reflex and the action is where the whole eighteen-month change actually gets made.`,
  ].join("\n\n");

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

  // Natal contacts. Only computed when the eclipse degree resolved to a real longitude, because a
  // contact claimed from a sign alone would be a guess, and a wrong "this is sitting on your Venus"
  // is far worse than saying nothing.
  const contacts = eclipseLon === null ? [] : findNatalContacts(eclipseLon, chart).slice(0, 3);
  const natalContact = contacts.length
    ? [
        (() => {
          const c = contacts[0];
          const tight = c.aspect === "conjunction" && c.orb <= 2;
          const where = c.house ? ` in your ${ordinalHouse(c.house)} house` : "";
          const inSign = c.sign ? ` in ${c.sign.toLowerCase()}` : "";
          const meaning = CONTACT_MEANING[c.bodyId] ?? `it is landing on ${getBodyMeaning(c.bodyId)?.domain ?? "this part of you"}`;
          return `${tight ? "Okay, this just got personal." : "This one reaches something you were born with."} The eclipse is ${ASPECT_FRAME[c.aspect]} your natal ${c.bodyName}${inSign}${where}, within ${c.orb.toFixed(1)} degrees. That contact is what makes this eclipse specifically yours: ${meaning}.`;
        })(),

        ASPECT_TONE[contacts[0].aspect],

        `Practically, that means the ${eclipseArea} story this eclipse is telling will run through your ${contacts[0].bodyName.toLowerCase()} specifically. When an eclipse sets off a natal placement, it turns the volume all the way up on something that has always been part of your wiring, so what surfaces will feel recognisable rather than foreign. Most people describe it as something they already knew becoming impossible to keep ignoring.`,

        ...(contacts.length > 1
          ? [
              `It is also ${listClauses(
                contacts.slice(1).map((c) => {
                  const inSign = c.sign ? ` in ${c.sign.toLowerCase()}` : "";
                  const where = c.house ? `, ${ordinalHouse(c.house)} house` : "";
                  return `${ASPECT_FRAME[c.aspect]} your natal ${c.bodyName}${inSign}${where} (${c.orb.toFixed(1)}°)`;
                })
              )}. Secondary contacts colour the main one rather than compete with it, so read them as the texture this eclipse arrives with.`,
            ]
          : []),
      ].join("\n\n")
    : undefined;

  const watchNow = watchNowFor(event.date, eclipseArea, isLunar, now ?? new Date());

  const bettysTake = `I tell my girls to treat eclipse season differently to a normal moon. Less setting a neat intention, more expecting a door to open or close on its own timeline. This one is landing in your ${eSign} ${ordinalHouse(eclipseHouse)} house, so it plays out through your ${eclipseArea}, and it will move through ${traits.essence}, not through anyone else's version of it. Don't force a decision to prove you are in control. Notice what is already shifting, respond to it like an adult, and let the eclipse do the part that was never yours to do.`;

  return {
    title: `${label} in ${eSign}`,
    dateLabel,
    emoji,
    whatThisIs,
    collectiveOpening: isLunar && eclipseSign === "Pisces" ? PISCES_ECLIPSE_OPENING : undefined,
    primerTitle: "the eclipse, explained",
    primer,
    inYourChart,
    chartParagraphs,
    degreeNote,
    bringsUp,
    lookOutFor,
    shadow,
    natalContact,
    watchNow,
    bettysTake,
    exercise,
    journalPrompt: `What is actually shifting around my ${eclipseArea} on its own right now, and what would change if I stopped trying to force it and simply responded to it honestly?`,
    journalPrompts: eclipsePrompts(eclipseArea, eSign),
    affirmation: onNorth
      ? `I let this eclipse move me forward in my ${eclipseArea}, and I trust what is opening even before I feel ready.`
      : `I let what is ending in my ${eclipseArea} actually end, and I trust the space it clears.`,
  };
}
