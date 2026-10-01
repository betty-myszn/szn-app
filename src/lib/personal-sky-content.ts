import type { ChartData } from "@/types/chart";
import { ZODIAC_SIGNS } from "@/types/chart";
import { HOUSE_MEANINGS, houseForLongitude, houseForSign, houseSpanNote, longitudeForSignDegree, ordinalHouse } from "@/lib/interpretations";
import { guideFor } from "@/lib/transit-guides";

// The fast-moving sky read for one member: Mercury, Venus and Mars changing sign, stationing and
// leaning on the slow planets. Built in the shape of a thread, the way Betty writes these up: the
// hook, what the planet rules, what the sign wants, where it lands in HER chart, how it meets her own
// natal placement, and her move. The first three are the collective layer; the rest is hers alone.
//
// Placement rule: a planet's whole stay in a sign is placed by the sign (houseForSign), a dated
// moment (a station, an aspect) by its real degree (houseForLongitude).

export type SkyPlanet = "Mercury" | "Venus" | "Mars";
export type SkyEventType = "now" | "ingress" | "retrograde_start" | "retrograde_end" | "aspect";
export type SkyAspect = "conjunction" | "square" | "opposition";

export interface SkyInput {
  planet: SkyPlanet;
  type: SkyEventType;
  sign: string;
  degree?: number;
  date?: string;
  retrograde?: boolean;
  otherPlanet?: string;
  otherSign?: string;
  otherDegree?: number;
  aspectType?: SkyAspect;
}

export interface SkyTimeline {
  since: string | null;
  until: string | null;
  stations: { type: "retrograde_start" | "retrograde_end"; date: string; degree: number }[];
}

export interface SkyReading {
  title: string;
  hook: string;
  house: number;
  parts: { heading: string; paragraphs: string[] }[];
  move: string;
  prompt: string;
  affirmation: string;
}

export const PLANET_RULES: Record<SkyPlanet, string> = {
  Mercury:
    "Mercury rules communication, thoughts, conversations and the stories running through your mind. How you think, how you talk, how you learn, every text, email, contract and 2am spiral. Wherever Mercury goes, that is where the conversation in your life gets loud.",
  Venus:
    "Venus rules love, beauty, pleasure, money and what you value, yourself included. Who you're attracted to, what you spend on, what you'll accept and how much you let yourself receive. Wherever Venus goes, that is where your heart and your bank balance start paying attention.",
  Mars:
    "Mars rules drive, desire, ambition, anger and action. How you go after what you want, how you fight, how you move your body and what actually gets you out of bed. Wherever Mars goes, that is where the fire in your life is burning.",
};

const DOMAIN: Record<SkyPlanet, string> = {
  Mercury: "the way you think and talk",
  Venus: "the way you love and what you value",
  Mars: "the way you go after what you want",
};

export const SIGN_WANTS: Record<string, string> = {
  Aries: "Aries wants action, courage and to go first. It's impatient, honest and completely done waiting for permission.",
  Taurus: "Taurus wants comfort, pleasure, money in the bank and things that last. It moves slowly and refuses to be rushed.",
  Gemini: "Gemini wants information, variety and conversation. It's curious about everything and bored by anything that repeats.",
  Cancer: "Cancer wants safety, home, family and to feel held. Everything runs through the heart first.",
  Leo: "Leo wants to be seen, celebrated and adored. Creativity, pride, play and a whole lot of heart.",
  Virgo: "Virgo wants things to work properly. Systems, health, service and the deep satisfaction of getting the details right.",
  Libra: "Libra wants harmony, beauty, fairness and partnership. It weighs every side before it moves.",
  Scorpio: "Scorpio wants depth, truth, intimacy, power, secrets and everything hiding underneath the pretty version of events.",
  Sagittarius: "Sagittarius wants freedom, meaning, adventure and the truth, even when the truth is inconvenient.",
  Capricorn: "Capricorn wants structure, results, respect and a legacy. It plays the long game and expects you to as well.",
  Aquarius: "Aquarius wants freedom, originality and community. It questions every rule and thinks about the future first.",
  Pisces: "Pisces wants connection, imagination, spirituality and softness. It dissolves boundaries and feels absolutely everything.",
};

export const HOOKS: Record<SkyPlanet, Record<string, string>> = {
  Mercury: {
    Aries: "Mercury in Aries and everyone's typing in CAPS 🔥 Fast mouths, faster decisions, zero patience for the long version.",
    Taurus: "Mercury in Taurus slows the chatter right down. Fewer words, more meaning, and nobody's changing their mind in a hurry.",
    Gemini: "Mercury is HOME in Gemini, so the group chats are chaos, the ideas are flying and your brain has 47 tabs open ✨",
    Cancer: "Mercury in Cancer and every conversation comes with feelings attached. Soft words land, careless ones sting for days.",
    Leo: "Mercury in Leo turns everybody into a storyteller. Say it with your chest, babe, and make it a moment.",
    Virgo: "Mercury is in its element in Virgo 📝 Lists, edits, fixes and a very sharp eye for what doesn't add up.",
    Libra: "Mercury in Libra wants the nicest possible way to say the thing, which is gorgeous right up until it turns into never saying it.",
    Scorpio: "Mercury in Scorpio and suddenly everybody wants to SAY THE THING 👀🔥 Your internal bullshit detector is turned allllll the way up.",
    Sagittarius: "Mercury in Sagittarius and the truth comes out with zero filter. Big ideas, blunt takes, and plans that get bigger every time you talk about them.",
    Capricorn: "Mercury in Capricorn means business 💼 Every conversation wants a point, a plan and a deadline.",
    Aquarius: "Mercury in Aquarius turns your brain into a lightning rod. Weird ideas, brilliant ideas, and a lot of \"wait, what if we did it completely differently.\"",
    Pisces: "Mercury in Pisces blurs the edges 🌊 Intuition gets loud, facts get slippery, and your dreams have notes for you.",
  },
  Venus: {
    Aries: "Venus in Aries wants it NOW 💋 Chemistry first, spreadsheets later, and you're allowed to make the first move.",
    Taurus: "Venus is HOME in Taurus. Soft sheets, good food, slow money and love you can actually feel in your body.",
    Gemini: "Venus in Gemini falls for the conversation first. Flirty texts, curious crushes and a craving for variety.",
    Cancer: "Venus in Cancer wants to be held. Love feels like safety and money feels like security.",
    Leo: "Venus in Leo wants to be ADORED 👑 Publicly, generously and with a little bit of drama. Let yourself be the main event.",
    Virgo: "Venus in Virgo shows love in the details. The remembered coffee order, the fixed thing, the quietly paid bill.",
    Libra: "Venus is HOME in Libra, so beauty, harmony and a very high standard for how you get treated 💅",
    Scorpio: "Venus in Scorpio wants ALL of you or nothing 🖤 Deep intimacy, total honesty and zero tolerance for half-in energy.",
    Sagittarius: "Venus in Sagittarius loves freedom. Adventure dates, generous spending and a hard no to anything that feels like a cage.",
    Capricorn: "Venus in Capricorn wants love and money that LAST. Commitment, quality and building something that holds.",
    Aquarius: "Venus in Aquarius loves on its own terms. Friends first, space to breathe, and relationships that don't follow a script.",
    Pisces: "Venus in Pisces is pure romance 🌸 Soulmate feelings, fairytale spending and a heart wide open, maybe a little too open.",
  },
  Mars: {
    Aries: "Mars is HOME in Aries 🔥 Pure fire, pure go, and a very short fuse. Start the thing TODAY.",
    Taurus: "Mars in Taurus is slow and unstoppable. Steady effort, stubborn focus, and a body that moves at its own pace.",
    Gemini: "Mars in Gemini scatters the energy across ten projects at once. Fast talk, quick wins and a very restless brain.",
    Cancer: "Mars in Cancer fights for its people. Protective, emotional, and very likely to go passive-aggressive if it doesn't speak up.",
    Leo: "Mars in Leo wants the SPOTLIGHT 👑🔥 Proud, dramatic, competitive action and a big push to claim what's yours.",
    Virgo: "Mars in Virgo gets to work. Precise effort, small daily wins and a very low tolerance for sloppy.",
    Libra: "Mars in Libra fights fair, or tries to. Action through partnership, and a real struggle to pick a side.",
    Scorpio: "Mars in Scorpio is laser focus with a long memory 🖤 Strategic, intense and absolutely not playing small.",
    Sagittarius: "Mars in Sagittarius wants room to roam. Big bold moves, risks that pay off and zero patience for small thinking.",
    Capricorn: "Mars in Capricorn is the boss level. Disciplined ambition, long-game moves and results you can count.",
    Aquarius: "Mars in Aquarius rebels with a cause. Collective action, unconventional moves and a total refusal to do it the old way.",
    Pisces: "Mars in Pisces moves by feel 🌊 Creative flow over force, and energy that rises and falls with your intuition.",
  },
};

// Where the planet lands in her chart: what gets loud there, and the move. Indexed by house - 1.
export const HOUSE_READS: Record<SkyPlanet, { read: string; move: string }[]> = {
  Mercury: [
    { read: "YOU are the conversation. People notice what you say and how you say it, and your own self-talk is loud.", move: "Say out loud who you're becoming. Update the bio, the intro, the pitch." },
    { read: "your thoughts keep circling back to money, pricing and what you're actually worth.", move: "Have the money conversation. Raise the rate, send the invoice, ask for the number." },
    { read: "you're in Mercury's own natural home: your brain is fast, your phone is busy and every conversation sparks another one.", move: "Write it, post it, pitch it. Your words carry further than usual right now." },
    { read: "the conversations that matter happen behind closed doors, at home and with family.", move: "Have the family chat you've been putting off, or sort the home admin once and for all." },
    { read: "your ideas want to play. Flirty messages, creative projects and plans made purely for fun.", move: "Make something just for the joy of it, and send the flirty text." },
    { read: "your to-do list is talking to you, loudly, and so is your body.", move: "Fix the one system that keeps breaking. One process, properly sorted." },
    { read: "the big conversations happen one on one, with partners, clients, collaborators and exes.", move: "Say the thing to the person directly. Clarify, negotiate, renegotiate." },
    { read: "the conversations go deep: intimacy, shared money, secrets and everything people usually avoid saying.", move: "Ask the question you're scared of the answer to, and read the fine print on any shared money." },
    { read: "your mind wants to go big. Learning, travel, teaching and questioning what you believe.", move: "Sign up for the course, book the trip, or teach what you know to a bigger room." },
    { read: "the conversations that shape your career happen now, and the people above you are listening.", move: "Pitch yourself. Email the person with the power to say yes." },
    { read: "the ideas live in the group chat, your network and your big-picture plans.", move: "Message the people you've been meaning to. One intro can change your year." },
    { read: "your thoughts turn inward, and the truth arrives in dreams, journals and quiet moments.", move: "Journal every morning through this stretch. What comes up when you're alone is the message." },
  ],
  Venus: [
    { read: "you're magnetic. People are drawn to you and it's the moment to treat yourself like the prize.", move: "Upgrade the look, the photos, the energy. Be seen." },
    { read: "money, pleasure and self-worth flow through the same door. This is one of Venus's natural homes.", move: "Raise your prices or ask for more, and spend on quality over soothing." },
    { read: "your words get sweeter and your conversations get flirtier.", move: "Send the loving message. Write the caption you'd usually overthink." },
    { read: "love looks like nesting, softening family dynamics and making your space beautiful.", move: "Make home feel like you. One room, one ritual, one repaired relationship." },
    { read: "it's the most fun place for Venus to be. Dates, creativity, pleasure and play.", move: "Say yes to the date, the dance, the creative project. Joy is the assignment." },
    { read: "love lives in your routines: how you treat your body and the people you work beside.", move: "Make your daily routine something you actually enjoy. Pleasure counts as self-care." },
    { read: "relationships are front and centre, new ones and existing ones. This is Venus's other natural home.", move: "Invest in your main person, or make real room to meet them." },
    { read: "love gets deep and money gets merged. Vulnerability, trust and other people's resources.", move: "Talk honestly about shared money and what you need to feel safe getting close." },
    { read: "you fall for ideas, places and people from far away.", move: "Book the trip, take the class, or date outside your usual type." },
    { read: "your public image glows and the people in power like what they see.", move: "Put yourself forward for the opportunity. Charm opens doors right now." },
    { read: "love flows through your circle and your network brings the good things in.", move: "Host something. Your people are your luck." },
    { read: "love works behind the scenes. Old feelings, secret crushes, healing and quiet self-love.", move: "Love yourself in private first. Rest, reflect and let old heartache close." },
  ],
  Mars: [
    { read: "your energy is HIGH, your confidence is up and your temper sits a little closer to the surface.", move: "Start the thing you've been waiting to start, and move your body every day." },
    { read: "you're fired up to earn and very ready to go after what you're worth.", move: "Chase the money. Pitch, sell and hustle for the income you want." },
    { read: "your words have extra force. Fast talking, quick decisions and sharp replies.", move: "Use it to write, pitch and speak up, and count to ten before you hit send mid-argument." },
    { read: "the energy pours into home projects, and old family tension can flare.", move: "Do the home project, clear the clutter, and pick your battles at the dinner table." },
    { read: "desire is up and the creative fire is burning.", move: "Make the bold creative move and flirt like you mean it." },
    { read: "you've got energy to burn on the daily grind and your body wants to train.", move: "Overhaul the routine and the workouts, and watch for burnout." },
    { read: "relationships heat up, in passion and in conflict, and other people push you to act.", move: "Go after the partnership or contract you want, and fight fair." },
    { read: "desire goes deep and power dynamics come to the surface.", move: "Take charge of the shared money or the debt, and let intimacy be intense." },
    { read: "you're hungry for adventure, learning and fighting for what you believe in.", move: "Take the leap: the course, the trip, the big bold launch." },
    { read: "ambition is ON and you're ready to climb, and people notice you going for it.", move: "Go after the promotion, the client, the big career goal, publicly." },
    { read: "you're energised by groups, causes and your future plans.", move: "Rally your people around a shared goal and lead the group project." },
    { read: "the energy goes underground. Rest, solitude and quiet work behind the scenes, and swallowed anger may surface.", move: "Train in private, rest without guilt, and deal with the anger you've been holding down." },
  ],
};

const RETRO: Record<SkyPlanet, { start: string; end: string }> = {
  Mercury: {
    start:
      "Mercury stations retrograde, so from here it looks like it's moving backward. Nothing is actually reversing, but for about three weeks the conversations, plans and paperwork of the last few weeks come back around for a second look. Reread before you send, back up your files, and expect exes, old ideas and unfinished conversations to reappear for a reason.",
    end: "Mercury stations direct, so the review is over and communication starts moving forward again. Give it a few days to pick up speed, then send, sign and launch the things you paused.",
  },
  Venus: {
    start:
      "Venus stations retrograde, a rare love and money audit that only comes around about every eighteen months. For the next six weeks attraction, spending and self-worth turn inward for review. Old lovers resurface, values get questioned, and it's the worst possible time for a dramatic makeover.",
    end: "Venus stations direct, so the love and money audit is done. What you decided during the retrograde can now move forward, relationships, prices and purchases included.",
  },
  Mars: {
    start:
      "Mars stations retrograde, so drive and ambition turn inward for a couple of months. Energy dips, plans stall and old anger resurfaces. The work is redirecting the fire rather than forcing it.",
    end: "Mars stations direct, so the brakes come off. Projects that stalled start moving and your energy comes back.",
  },
};

const ASPECT_READS: Record<string, string> = {
  "Mars-Jupiter": "Mars and Jupiter together supersize whatever you're going after. Big confidence, big moves, big risks, so aim the energy at something worth it.",
  "Mars-Saturn": "Mars meeting Saturn is the foot on the gas with the handbrake on. Frustration, delays and pressure, and a real chance to build something with discipline.",
  "Mars-Uranus": "Mars meeting Uranus is sudden, electric and unpredictable. Breakthroughs, impulsive moves and very short fuses, so stay flexible.",
  "Mars-Neptune": "Mars meeting Neptune blurs your drive. Energy feels foggy and motives get confusing, so move by intuition and check the facts twice.",
  "Mars-Pluto": "Mars meeting Pluto is raw power. Pent-up anger, power struggles and a huge push to take back control, so pick the battle that actually matters.",
  "Venus-Jupiter": "Venus and Jupiter are the two lucky planets, so this is a sweet, generous, abundant contact for love and money. Watch the overspending.",
  "Venus-Saturn": "Venus meeting Saturn tests love and money for staying power. Commitments get serious and anything flimsy gets found out.",
  "Venus-Uranus": "Venus meeting Uranus brings sudden attraction, surprise endings and a craving for freedom in love.",
  "Venus-Neptune": "Venus meeting Neptune is dreamy, romantic and a little bit delusional. Beautiful for art and love, risky for big purchases.",
  "Venus-Pluto": "Venus meeting Pluto is obsession, jealousy and transformation in love and money. Deep attraction, power dynamics and the truth about what you value.",
};

const ASPECT_TONE: Record<SkyAspect, string> = {
  conjunction: "A conjunction fuses the two energies into one, so it's intense and concentrated.",
  square: "A square is friction, so this one pushes you to act.",
  opposition: "An opposition is a tug of war, and it usually plays out through other people.",
};

const PROMPTS: Record<SkyPlanet, { stay: (a: string) => string; retro: (a: string) => string; affirm: (a: string) => string }> = {
  Mercury: {
    stay: (a) => `What conversation about my ${a} have I been rehearsing in my head instead of having?`,
    retro: (a) => `What unfinished conversation about my ${a} is coming back for a reason?`,
    affirm: (a) => `I say what I mean about my ${a}, clearly and kindly.`,
  },
  Venus: {
    stay: (a) => `What would it look like to let myself receive more in my ${a}?`,
    retro: (a) => `What do I actually value in my ${a} now, compared with what I used to accept?`,
    affirm: (a) => `I'm allowed to receive more in my ${a}, and I let it in.`,
  },
  Mars: {
    stay: (a) => `Where in my ${a} am I ready to stop waiting and go after it?`,
    retro: (a) => `Where in my ${a} have I been forcing it, and what would redirecting look like?`,
    affirm: (a) => `I go after what I want in my ${a} with my whole chest.`,
  },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s: string) => s.toLowerCase();

function dayMonth(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/** Which of her houses this lands in: a whole stay by sign, a dated moment by its degree. */
export function skyHouse(input: SkyInput, cusps: number[]): number {
  const moment = input.type === "retrograde_start" || input.type === "retrograde_end" || input.type === "aspect";
  if (moment && input.degree !== undefined) {
    const lon = longitudeForSignDegree(input.sign, input.degree);
    if (lon !== null) return houseForLongitude(lon, cusps);
  }
  return houseForSign(input.sign, cusps);
}

function otherHouse(input: SkyInput, cusps: number[]): number | null {
  if (!input.otherSign) return null;
  const lon = longitudeForSignDegree(input.otherSign, input.otherDegree ?? 15);
  return lon === null ? null : houseForLongitude(lon, cusps);
}

/** How the transiting sign meets her own natal placement of the same planet. */
export function natalMeeting(planet: SkyPlanet, transitSign: string, natalSign: string): string {
  const t = ZODIAC_SIGNS.indexOf(transitSign as (typeof ZODIAC_SIGNS)[number]);
  const n = ZODIAC_SIGNS.indexOf(natalSign as (typeof ZODIAC_SIGNS)[number]);
  if (t < 0 || n < 0) return "";
  const d = (t - n + 12) % 12;
  const p = planet;
  const ts = lower(transitSign);
  const ns = lower(natalSign);
  const dom = DOMAIN[planet];
  if (d === 0)
    return `Your own ${p} is in ${ns} too, so this is home turf. ${cap(dom)} gets amplified in a way that feels completely natural to you, like someone turned up the volume on something you already know how to do.`;
  if (d === 6)
    return `Your own ${p} is in ${ns}, the sign directly opposite ${ts}, so this stretch shows you the other side of yourself. ${cap(dom)} gets pulled the opposite way from your default, which can feel like friction and is exactly where the growth is.`;
  if (d === 3 || d === 9)
    return `Your own ${p} is in ${ns}, which squares ${ts}, so expect some tension. ${cap(dom)} gets challenged to adapt, uncomfortable and very productive if you lean in.`;
  if (d === 4 || d === 8)
    return `Your own ${p} is in ${ns}, the same element family as ${ts}, so this one flows. ${cap(dom)} gets an easy, supportive boost, so use it.`;
  if (d === 2 || d === 10)
    return `Your own ${p} is in ${ns}, which gets along well with ${ts}, so this stretch hands ${dom} an easy opening if you take it.`;
  if (d === 1 || d === 11)
    return `Your own ${p} is in ${ns}, right next door to ${ts}, so this energy is close to familiar but not quite your style. A small stretch that teaches you something.`;
  return `Your own ${p} is in ${ns}, which has very little in common with ${ts}, so this stretch asks for adjustments. ${cap(dom)} might feel slightly out of sync, and small tweaks fix it.`;
}

/** The short "for you" line on a cosmic weather card. */
export function skyForYou(input: SkyInput, chart: ChartData): string {
  const cusps = chart.houses.map((h) => h.longitude);
  const house = skyHouse(input, cusps);
  const meaning = HOUSE_MEANINGS[house - 1];
  if (input.type === "aspect" && input.otherPlanet) {
    const oh = otherHouse(input, cusps);
    const om = oh ? HOUSE_MEANINGS[oh - 1] : null;
    return oh && om && oh !== house
      ? `Pulls between your ${ordinalHouse(house)} house of ${meaning.title} and your ${ordinalHouse(oh)} house of ${om.title}.`
      : `Lands in your ${ordinalHouse(house)} house of ${meaning.title}, so expect it there first.`;
  }
  const r = HOUSE_READS[input.planet][house - 1];
  if (input.type === "retrograde_start") return `Stations in your ${ordinalHouse(house)} house, so old ${meaning.lifeAreas[0]} business comes back for review.`;
  if (input.type === "retrograde_end") return `Turns forward in your ${ordinalHouse(house)} house, so ${meaning.lifeAreas[0]} gets moving again.`;
  return `Your ${ordinalHouse(house)} house: ${r.move.charAt(0).toLowerCase()}${r.move.slice(1)}`;
}

/** The one or two lines a cosmic weather card shows before "for you". */
export function skyCardBody(input: SkyInput): string {
  if (input.type === "aspect" && input.otherPlanet) {
    const read = ASPECT_READS[`${input.planet}-${input.otherPlanet}`];
    return read ? read.split(". ")[0] + "." : `${input.planet} meets ${input.otherPlanet}.`;
  }
  if (input.type === "retrograde_start")
    return {
      Mercury: "Reread before you send and back up your files. Old conversations and old ideas come back for a second look.",
      Venus: "A rare love and money audit. Old lovers resurface, so hold off on the dramatic makeover.",
      Mars: "Drive turns inward and plans stall. Redirect the fire rather than forcing it.",
    }[input.planet];
  if (input.type === "retrograde_end") return RETRO[input.planet].end;
  return HOOKS[input.planet][input.sign] ?? "";
}

/** Where a card for this event should go: the written guide where there is one, else this reading. */
export function skyHref(input: SkyInput): string {
  if ((input.type === "retrograde_start" || input.type === "retrograde_end") && guideFor(input.type, input.planet, input.sign) && input.date) {
    return `/your-season/transit?type=${input.type}&date=${input.date}&planet=${input.planet}&sign=${input.sign}`;
  }
  const q = new URLSearchParams({ planet: input.planet, type: input.type, sign: input.sign });
  if (input.degree !== undefined) q.set("degree", String(input.degree));
  if (input.date) q.set("date", input.date);
  if (input.retrograde) q.set("rx", "1");
  if (input.otherPlanet) q.set("other", input.otherPlanet);
  if (input.otherSign) q.set("otherSign", input.otherSign);
  if (input.otherDegree !== undefined) q.set("otherDegree", String(input.otherDegree));
  if (input.aspectType) q.set("aspect", input.aspectType);
  return `/your-season/sky?${q.toString()}`;
}

export function composeSky(input: SkyInput, chart: ChartData, timeline?: SkyTimeline | null): SkyReading {
  const cusps = chart.houses.map((h) => h.longitude);
  const house = skyHouse(input, cusps);
  const meaning = HOUSE_MEANINGS[house - 1];
  const area = meaning.lifeAreas[0];
  const p = input.planet;
  const ps = lower(p);
  const ss = lower(input.sign);
  const hr = HOUSE_READS[p][house - 1];
  const natal = chart.planets.find((x) => x.name === p);
  const spanNote = houseSpanNote(input.sign, house, chart.houses[house - 1]?.sign, `${ps} transit`);
  const isRetroEvent = input.type === "retrograde_start" || input.type === "retrograde_end";

  if (input.type === "aspect" && input.otherPlanet && input.aspectType) {
    const os = lower(input.otherPlanet);
    const oh = otherHouse(input, cusps);
    const om = oh ? HOUSE_MEANINGS[oh - 1] : null;
    const read = ASPECT_READS[`${p}-${input.otherPlanet}`] ?? `${p} meets ${input.otherPlanet}, and the two energies have to work something out.`;
    const where =
      oh && om && oh !== house
        ? `For you, ${p} is moving through your ${ordinalHouse(house)} house of ${meaning.title} and ${input.otherPlanet} sits in your ${ordinalHouse(oh)} house of ${om.title}, so the pressure runs between ${meaning.lifeAreas[0]} and ${om.lifeAreas[0]}. Whatever is unresolved between those two parts of your life is what this one stirs up.`
        : `For you, this lands in your ${ordinalHouse(house)} house of ${meaning.title}, so ${area} is where you'll feel it first.`;
    return {
      title: `${ps} ${{ conjunction: "conjunct", square: "square", opposition: "opposite" }[input.aspectType]} ${os}`,
      hook: `${cap(ps)} in ${ss} ${input.aspectType === "conjunction" ? "meets" : input.aspectType === "square" ? "squares" : "opposes"} ${os} in ${lower(input.otherSign ?? "")}${input.date ? ` on ${dayMonth(input.date)}` : ""}.`,
      house,
      parts: [
        { heading: `what ${ps} rules`, paragraphs: [PLANET_RULES[p]] },
        { heading: "what this contact does", paragraphs: [read, ASPECT_TONE[input.aspectType]] },
        { heading: "where it lands for you", paragraphs: [where] },
      ],
      move: `Pick one thing in your ${area} and put the energy there on purpose, before it picks a fight for you.`,
      prompt: PROMPTS[p].stay(area),
      affirmation: PROMPTS[p].affirm(area),
    };
  }

  const title =
    input.type === "ingress"
      ? `${ps} ${input.retrograde ? "backs into" : "moves into"} ${ss}`
      : input.type === "retrograde_start"
        ? `${ps} stations retrograde in ${ss}`
        : input.type === "retrograde_end"
          ? `${ps} stations direct in ${ss}`
          : `${ps} in ${ss}`;

  const hook = HOOKS[p][input.sign] ?? `${cap(ps)} in ${ss}.`;

  const timelineLines: string[] = [];
  if (timeline) {
    const span =
      timeline.since && timeline.until
        ? `${cap(ps)} is in ${ss} from ${dayMonth(timeline.since)} to ${dayMonth(timeline.until)}.`
        : timeline.until
          ? `${cap(ps)} is in ${ss} until ${dayMonth(timeline.until)}.`
          : "";
    if (span) timelineLines.push(span);
    const rx = timeline.stations.find((s) => s.type === "retrograde_start");
    const d = timeline.stations.find((s) => s.type === "retrograde_end");
    if (rx && d)
      timelineLines.push(
        `It turns retrograde on ${dayMonth(rx.date)} and direct again on ${dayMonth(d.date)} without leaving ${ss}, so this chapter runs longer than usual and you get to go over the same ground twice.`,
      );
    else if (rx) timelineLines.push(`It turns retrograde on ${dayMonth(rx.date)} before it leaves, so the second half of this stretch is for review.`);
    else if (d) timelineLines.push(`It turns direct on ${dayMonth(d.date)}, and from then everything you reviewed can move.`);
  }

  const landing = isRetroEvent
    ? `For you, ${p} ${input.type === "retrograde_start" ? "stations" : "turns forward"} in your ${ordinalHouse(house)} house of ${meaning.title}, ${meaning.rules}. ${
        input.type === "retrograde_start"
          ? `Expect old ${meaning.lifeAreas[0]} and ${meaning.lifeAreas[1] ?? meaning.lifeAreas[0]} business to circle back for a second look, on purpose.`
          : `The ${meaning.lifeAreas[0]} things you've been reviewing are ready to move.`
      }`
    : `For you, ${p} is moving through your ${ordinalHouse(house)} house of ${meaning.title}, ${meaning.rules}. So ${hr.read}${spanNote}`;

  const parts: SkyReading["parts"] = [
    { heading: `what ${ps} rules`, paragraphs: [PLANET_RULES[p]] },
    { heading: `what ${ss} wants`, paragraphs: [SIGN_WANTS[input.sign] ?? ""].filter(Boolean) },
  ];
  if (!isRetroEvent && timelineLines.length) parts.push({ heading: "how long this lasts", paragraphs: timelineLines });
  if (isRetroEvent) parts.push({ heading: input.type === "retrograde_start" ? "what the retrograde does" : "what turning direct does", paragraphs: [RETRO[p][input.type === "retrograde_start" ? "start" : "end"]] });
  parts.push({ heading: "where it lands for you", paragraphs: [landing] });
  if (natal?.sign) parts.push({ heading: `your own ${ps}`, paragraphs: [natalMeeting(p, input.sign, natal.sign)] });

  return {
    title,
    hook,
    house,
    parts,
    move:
      input.type === "retrograde_start"
        ? `Go back before you go forward in your ${area}. Reopen the old conversation, reread the paperwork, and hold big new ${area} decisions until ${p} turns direct.`
        : hr.move,
    prompt: isRetroEvent ? PROMPTS[p].retro(area) : PROMPTS[p].stay(area),
    affirmation: PROMPTS[p].affirm(area),
  };
}
