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
      body: `This eclipse lands in ${eSign}, and that is the flavour of everything it stirs, so ${eSign} is what to read it through: ${traits.essence}. It arrives at the closing stretch of the eclipse family that has been running on this sign for the better part of two years, which is why it can feel less like a fresh shock and more like the final act of something you have been living through for a while. What it moves will look like ${eh.lifeAreas.slice(0, 2).join(" and ")} in your own life, and it will move in a ${eSign} way rather than a tidy one.`,
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
      : `This one belongs to the eclipse family that has been working on ${eSign} for close to two years, so what it touches in this house of yours is almost certainly not new. It is the same theme you have been quietly living with, arriving at the point where it wants a conclusion rather than more patience. ${eh.coach} Expect it to read less like a bolt from nowhere and more like the moment the thing you already suspected becomes impossible to keep filing away.`,

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

        `The days either side can feel physically strange: disrupted sleep, unusually vivid dreams, an emotional tide that seems out of proportion to what is actually happening, and a body that wants considerably more rest than your calendar has allowed for. None of that is you being dramatic. It is a nervous system processing something bigger than a normal week, and treating it as a signal to slow down rather than a fault to push through will serve you far better than powering on.`,

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

    `Shadow here does not mean a flaw to be ashamed of. It means the part of the pattern that runs automatically, usually because it protected you at some point and was never consciously retired. Under eclipse pressure it fires before you can choose, which is precisely why an eclipse is such an efficient way to see it. You are watching your own default in real time rather than in hindsight.`,

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
    bettysTake,
    exercise,
    journalPrompt: `What is actually shifting around my ${eclipseArea} on its own right now, and what would change if I stopped trying to force it and simply responded to it honestly?`,
    journalPrompts: eclipsePrompts(eclipseArea, eSign),
    affirmation: onNorth
      ? `I let this eclipse move me forward in my ${eclipseArea}, and I trust what is opening even before I feel ready.`
      : `I let what is ending in my ${eclipseArea} actually end, and I trust the space it clears.`,
  };
}
