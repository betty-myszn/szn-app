/**
 * The 8/8 Lion's Gate money reading, composed per member from their real chart.
 *
 * This is deliberately built on the same interpretation primitives the rest of the app already
 * uses (SIGN_TRAITS.money / .shadow, HOUSE_MEANINGS, SIGN_RULERS), so it inherits the house voice
 * and can never invent a placement: everything here is derived from the calculated ChartData the
 * ephemeris returns. The page (components/EightEightMoney.tsx) only ever renders what this returns.
 *
 * Six placement cards (Venus, Jupiter, the 2nd house + its ruler, the 8th house + its ruler, the
 * Part of Fortune, and the tightest Venus/Jupiter thread), plus the 8/8 overlay (where the ~15 Leo
 * portal Sun lands in their houses), plus two exercises keyed to the elements that actually run
 * their money (Venus for manifestation, the 8th-house sign for shadow work), plus one action.
 */
import type { ChartData } from "@/types/chart";
import {
  SIGN_TRAITS,
  SIGN_OVERVIEWS,
  SIGN_RULERS,
  HOUSE_MEANINGS,
  houseForSign,
  ordinalHouse,
} from "@/lib/interpretations";

export type CardVariant = "lav" | "pink" | "white" | "dark" | "gold";

export interface MoneyCard {
  variant: CardVariant;
  glyph: string;
  kicker: string;
  place: string;
  summary: string;
  deep: string;
  gift: string;
  shadow: string;
}

export interface MoneyExercise {
  kicker: string;
  title: string;
  why: string;
  steps: string[];
}

export interface MoneyAffirmation {
  label: string;
  line: string;
}

export interface EightEightReading {
  name: string;
  heroLine: string;
  intro: string;
  portalPill: string;
  cards: MoneyCard[];
  overlay: { kicker: string; place: string; body: string; hit: string };
  affirmations: MoneyAffirmation[];
  manifestation: MoneyExercise;
  shadowWork: MoneyExercise;
  action: { title: string; body: string };
}

const lower = (s: string) => s.toLowerCase();
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const t = (sign: string) => SIGN_TRAITS[sign] || SIGN_TRAITS.Leo;
const element = (sign: string): "fire" | "earth" | "air" | "water" =>
  (SIGN_OVERVIEWS[sign]?.element as "fire" | "earth" | "air" | "water") || "fire";

/** "5th house of creativity & play" — reuses the house voice, drops the long rules clause. */
const houseLine = (house: number) => `${ordinalHouse(house)} house of ${HOUSE_MEANINGS[house - 1].title}`;

const ASPECT_WORD: Record<string, string> = {
  conjunction: "sitting together",
  trine: "in easy flow",
  sextile: "quietly supporting each other",
  square: "in productive tension",
  opposition: "pulling against each other",
};

/** Find the tightest aspect between two named bodies, if one exists in the chart. */
function aspectBetween(chart: ChartData, a: string, b: string) {
  const wanted = new Set([a.toLowerCase(), b.toLowerCase()]);
  const hits = chart.aspects.filter((asp) => {
    const pair = new Set([asp.planet1.toLowerCase(), asp.planet2.toLowerCase()]);
    return pair.size === 2 && [...wanted].every((w) => pair.has(w));
  });
  if (hits.length === 0) return null;
  return hits.sort((x, y) => x.orb - y.orb)[0];
}

export function buildEightEightMoney(chart: ChartData): EightEightReading | null {
  const find = (id: string) => chart.planets.find((p) => p.id === id);
  const venus = find("venus");
  const jupiter = find("jupiter");
  const saturn = find("saturn");
  const fortune = find("part_of_fortune");
  if (!venus || !jupiter) return null;

  const name = chart.birthData?.name || "babe";
  const cusps = chart.houses.map((h) => h.longitude);

  const venusSign = venus.sign;
  const venusHouse = venus.house;
  const jupiterSign = jupiter.sign;
  const jupiterHouse = jupiter.house;

  const secondSign = chart.houses[1]?.sign || "Taurus";
  const eighthSign = chart.houses[7]?.sign || "Scorpio";
  const secondRuler = SIGN_RULERS[secondSign];
  const eighthRuler = SIGN_RULERS[eighthSign];
  const secondRulerPos = secondRuler ? find(secondRuler.rulerId) : undefined;
  const eighthRulerPos = eighthRuler ? find(eighthRuler.rulerId) : undefined;

  const fortuneSign = fortune?.sign || "Leo";
  const fortuneHouse = fortune?.house || 1;

  const cards: MoneyCard[] = [];

  // ── Venus ──
  cards.push({
    variant: "lav",
    glyph: "♀",
    kicker: "venus · how you attract",
    place: `venus in ${lower(venusSign)}, ${houseLine(venusHouse)}`,
    summary: `${cap(t(venusSign).money)}.`,
    deep: `your venus sits in ${lower(venusSign)}, in your ${houseLine(venusHouse)}, so this is where your sense of worth and your way of receiving actually live: ${t(venusSign).essence}. because it colours your ${houseLine(venusHouse)}, that is the arena where money and value tend to reach you first, and your income grows fastest when you stop treating it as separate from the rest of your life.`,
    gift: `${cap(t(venusSign).money)}, and people can feel it. lean into that instead of apologising for it, because ${t(venusSign).gift}.`,
    shadow: `the money shadow of a ${lower(venusSign)} venus is ${t(venusSign).shadow}. notice where that quietly keeps your rates, and your asking, smaller than they need to be.`,
  });

  // ── Jupiter ──
  cards.push({
    variant: "pink",
    glyph: "♃",
    kicker: "jupiter · where it expands",
    place: `jupiter in ${lower(jupiterSign)}, ${houseLine(jupiterHouse)}`,
    summary: `${cap(t(jupiterSign).money)}.`,
    deep: `jupiter is your growth and abundance planet, and in ${lower(jupiterSign)}, in your ${houseLine(jupiterHouse)}, it expands your money through ${t(jupiterSign).flavour.slice(0, 2).join(" and ")} energy. the more your income strategy leans on that same territory, the luckier you tend to get, because playing small is the one thing this placement genuinely cannot afford.`,
    gift: `${cap(t(jupiterSign).money)}. this is your abundance home turf, so cast wide and let your vision be as big as it actually is.`,
    shadow: `jupiter in ${lower(jupiterSign)} can overreach: ${t(jupiterSign).shadow}. watch the over-promising and the over-giving, because generosity with no boundary drains the very abundance it is trying to create.`,
  });

  // ── 2nd house + ruler ──
  {
    const rulerName = secondRuler?.rulerName || "its ruler";
    const rulerHouse = secondRulerPos?.house;
    const ruledLine = rulerHouse ? `ruled by ${lower(rulerName)} in your ${houseLine(rulerHouse)}` : `ruled by ${lower(rulerName)}`;
    cards.push({
      variant: "white",
      glyph: "2",
      kicker: "2nd house · your income",
      place: `${lower(secondSign)} on the cusp, ${ruledLine}`,
      summary: `your income and self-worth run on ${lower(secondSign)} energy, and the money follows where its ruler lives.`,
      deep: `your 2nd house of income and self-worth carries ${lower(secondSign)} energy, so ${t(secondSign).money}. ${rulerHouse ? `and because ${lower(rulerName)} rules that money from your ${houseLine(rulerHouse)}, your earning is tied to that part of your life: lean into it and the income tends to follow.` : `${lower(rulerName)} rules that money, so its condition sets the tone for how easily you earn.`}`,
      gift: `${cap(t(secondSign).money)}. build from that instead of copying someone whose chart earns a completely different way.`,
      shadow: `the 2nd-house shadow here is ${t(secondSign).shadow}. around money specifically, that is usually what keeps the number lower than your worth.`,
    });
  }

  // ── 8th house + ruler ──
  {
    const rulerName = eighthRuler?.rulerName || "its ruler";
    const rulerHouse = eighthRulerPos?.house;
    const ruledLine = rulerHouse ? `ruled by ${lower(rulerName)} in your ${houseLine(rulerHouse)}` : `ruled by ${lower(rulerName)}`;
    cards.push({
      variant: "dark",
      glyph: "8",
      kicker: "8th house · shared & deep money",
      place: `${lower(eighthSign)} on the cusp, ${ruledLine}`,
      summary: `other people's money, debt, investment and legacy, coloured by ${lower(eighthSign)} and run from where its ruler sits.`,
      deep: `your 8th house governs the deep money, the shared, invested, borrowed and inherited kind, and yours carries ${lower(eighthSign)} energy: ${t(eighthSign).essence}. ${rulerHouse ? `with ${lower(rulerName)} ruling it from your ${houseLine(rulerHouse)}, your real wealth here builds through that part of your life, usually slower and deeper than surface income.` : `${lower(rulerName)} rules it, so how you handle power and trust sets the tone for the deep money.`}`,
      gift: `handled on your terms, this is where lasting wealth is built rather than just earned: ${t(eighthSign).money}. get serious about investing, ownership and the assets that keep paying after the work is done.`,
      shadow: `the 8th-house shadow is control and worthiness: ${t(eighthSign).shadow} around receiving, that often shows up as a quiet belief that support has strings, or that if it was not hard it does not count. this is exactly what the shadow-work exercise below is built to loosen.`,
    });
  }

  // ── Part of Fortune ──
  cards.push({
    variant: "gold",
    glyph: "⊕",
    kicker: "part of fortune · your flow point",
    place: `fortune in ${lower(fortuneSign)}, ${houseLine(fortuneHouse)}`,
    summary: `where things come easily when you are being fully yourself, in ${lower(fortuneSign)}.`,
    deep: `the part of fortune marks where ease and abundance meet when you stop performing and just are yourself, and yours lands in ${lower(fortuneSign)}, in your ${houseLine(fortuneHouse)}. that is the territory to point your energy at on 8/8, because the flow opens the moment you stop hiding behind something smaller.`,
    gift: `follow what feels like ${t(fortuneSign).flavour[0]} ease here rather than grinding elsewhere, because ${t(fortuneSign).money}, and for you that is a flow, not a force.`,
    shadow: `fortune dims when ${t(fortuneSign).shadow} pull you out of your own lane. the work is staying in the ${lower(fortuneSign)} territory that actually pays you, instead of drifting to what looks more impressive.`,
  });

  // ── The tightest Venus/Jupiter thread (or Saturn as the money mindset) ──
  const vj = aspectBetween(chart, "Venus", "Jupiter");
  if (vj) {
    const word = ASPECT_WORD[vj.type] || "in aspect";
    const easy = vj.type === "trine" || vj.type === "sextile" || vj.type === "conjunction";
    cards.push({
      variant: "white",
      glyph: "△",
      kicker: "the tightest thread",
      place: `venus ${vj.type} jupiter`,
      summary: `your two money planets are ${word}, which shapes how value and abundance work together for you.`,
      deep: `venus (worth, receiving) and jupiter (expansion, luck) are ${word} in your chart, within about ${Math.round(vj.orb)}°. ${easy ? "that is one of the kinder money signatures to be born with: pleasure and generosity reinforce each other, so leaning into what you love tends to expand your life rather than cost you." : "that is a growth signature: your desire to enjoy and your desire to expand do not automatically agree, so the wealth comes from consciously getting them on the same side."}`,
      gift: easy
        ? `your luck is real, so use it. doing more of what you love genuinely tends to bring more in than grinding at what you do not.`
        : `once you stop letting these two argue, you get range most people do not: the taste to know what is worth it and the nerve to go big on it.`,
      shadow: easy
        ? `the ease is the trap. this can tip into over-spending, over-giving and skipping the structure because it usually works out. let saturn hold the discipline this thread will happily ignore.`
        : `under stress this splits into feast or famine, spending to feel abundant or shrinking to feel safe. the fix is a plan you keep on the good months and the lean ones alike.`,
    });
  } else if (saturn) {
    cards.push({
      variant: "white",
      glyph: "♄",
      kicker: "saturn · the money mindset",
      place: `saturn in ${lower(saturn.sign)}, ${houseLine(saturn.house)}`,
      summary: `where you are being built into real financial authority, the slow, compounding way.`,
      deep: `saturn in ${lower(saturn.sign)}, in your ${houseLine(saturn.house)}, is your money discipline and your money block in the same spot. it ripens in reverse: the area that taxes you hardest young matures into your steadiest authority later, because you are the one made to do the work.`,
      gift: `you can build what flightier charts cannot, because you take the long, unglamorous road and stay on it. that patience is a genuine wealth asset.`,
      shadow: `saturn's money shadow is ${t(saturn.sign).shadow} it rarely announces itself as fear, it dresses up as being realistic or waiting for the right time. name it and move anyway.`,
    });
  }

  // ── 8/8 overlay: where ~15 Leo lands ──
  const portalHouse = houseForSign("Leo", cusps);
  const leoBodies: string[] = [];
  if (venusSign === "Leo") leoBodies.push("your venus");
  if (jupiterSign === "Leo") leoBodies.push("your jupiter");
  if (fortuneSign === "Leo") leoBodies.push("your part of fortune");
  const hitsHouse = portalHouse === 2 || portalHouse === 8;
  const overlayHits: string[] = [];
  if (portalHouse === 2) overlayHits.push("2nd house of income");
  if (portalHouse === 8) overlayHits.push("8th house of shared money");
  leoBodies.forEach((b) => overlayHits.push(b.replace("your ", "")));

  const overlay = {
    kicker: "portal point · sun ~15° leo",
    place:
      overlayHits.length > 0
        ? `it lands right on your ${overlayHits.join(" and ")}`
        : `it lights up your ${houseLine(portalHouse)}`,
    body:
      leoBodies.length > 0 || hitsHouse
        ? `this is one of the strongest ways 8/8 could land for you. the portal sun pours straight into your ${houseLine(portalHouse)}${leoBodies.length ? `, right on ${leoBodies.join(" and ")}` : ""}, so this is not a subtle year for you: it is a loud invitation to raise the number, put your name on the work, and let yourself be seen doing the thing you are actually good at.`
        : `on 8/8 the portal sun moves through your ${houseLine(portalHouse)}, so that is where the year is asking you to grow your money: pour your energy into that part of your life this week and let the portal amplify it. it is a quieter hit than a direct one on your 2nd or 8th, but it still points cleanly at where to aim.`,
    hit:
      overlayHits.length > 0
        ? `⚡ direct hit: ${overlayHits.join(" · ")}`
        : `→ focus area: your ${houseLine(portalHouse)}`,
  };

  // ── Affirmations: one for the growth direction (north node), one to flip the money shadow ──
  const northNode = find("north_node");
  const affirmations = buildAffirmations(northNode?.sign || "Aries", eighthSign, venusSign);

  // ── Exercises ──
  const manifestation = buildManifestation(venusSign, venusHouse);
  const shadowWork = buildShadowWork(eighthSign, eighthRuler?.rulerName || "its ruler", eighthRulerPos?.house);

  const action = {
    title: "raise one number, out loud, today.",
    body: `with the portal in your ${houseLine(portalHouse)}, the single most aligned thing you can do this week is name a higher price, a bigger ask or a rate you have been rounding down, and say it to one real person without shrinking it. your chart rewards being seen at your full worth, ${name}. so let it be seen.`,
  };

  const heroLine = "the gate is open, and it knows your name.";
  const intro = `every year the sun crosses into the heart of leo and the sky throws its doors wide on money, worth and receiving. this is not the same portal for everyone though, ${name}, because it lands on your chart, in your houses, on the exact places you were built to earn from. here is what 8/8 is lighting up in yours, and the two pieces of work that make it count.`;
  const portalPill =
    overlayHits.length > 0
      ? `◐ sun in leo, lighting your ${overlayHits[0]}`
      : `◐ sun in leo, lighting your ${houseLine(portalHouse)}`;

  return { name, heroLine, intro, portalPill, cards, overlay, affirmations, manifestation, shadowWork, action };
}

/** Two money affirmations, both derived: the north node is the "grow toward this and the money
 *  follows" direction, and the shadow line is a permission flip of the exact block the reading
 *  already names, keyed to the element of the 8th house (and Venus as a backstop). */
function buildAffirmations(northNodeSign: string, eighthSign: string, venusSign: string): MoneyAffirmation[] {
  const nnEl = element(northNodeSign);
  const shEl = element(eighthSign);

  const northByElement: Record<string, string> = {
    fire: `my money grows as i do. i am safe to earn by moving first, backing myself, and taking up the ${lower(northNodeSign)} space i am growing into.`,
    earth: `my money grows as i do. i am safe to build slowly, value what i make, and let my ${lower(northNodeSign)} worth compound without rushing it.`,
    air: `my money grows as i do. i am safe to be paid for the way my mind works, to share my ideas, and to be seen in ${lower(northNodeSign)} rooms.`,
    water: `my money grows as i do. i am safe to trust my intuition about money and to receive through the ${lower(northNodeSign)} depth i used to hide.`,
  };

  const shadowByElement: Record<string, string> = {
    earth: `i do not have to earn the right to receive. money is safe in my hands even when it comes easily.`,
    fire: `i am allowed to receive support without losing my freedom. taking help does not mean i owe anyone my whole self.`,
    air: `i let myself feel my money, not just think about it. i am allowed to want more, and to say so out loud.`,
    water: `wanting more is not greedy. i am safe to receive fully, and to keep what is mine.`,
  };

  // Venus worth line as a third anchor, tied to how they specifically value themselves.
  const worthLine = `i price from my worth, not from my fear. my ${lower(venusSign)} value is allowed to cost what it costs.`;

  return [
    { label: "your growth direction · north node", line: northByElement[nnEl] },
    { label: "your shadow, flipped · permission to receive", line: shadowByElement[shEl] },
    { label: "your worth · venus", line: worthLine },
  ];
}

/** Manifestation ritual keyed to the element of the member's Venus (how they actually receive). */
function buildManifestation(venusSign: string, venusHouse: number): MoneyExercise {
  const el = element(venusSign);
  const base = {
    kicker: "exercise one · open the gate",
    title: `the money manifestation, ${lower(venusSign)} style`,
  };
  const houseNote = `your venus lives in your ${houseLine(venusHouse)}, so do this where that part of your life happens if you can.`;
  if (el === "earth") {
    return {
      ...base,
      why: `your venus is in ${lower(venusSign)}, an earth sign, so manifestation for you is not a vision board or a spoken affirmation, it is the senses. you call money in by making receiving feel real in your body first, because your chart believes what it can touch. ${houseNote}`,
      steps: [
        "choose one number you want to earn this season and write it by hand, slowly, on good paper. no phone, no notes app. the hand makes it real for an earth venus.",
        "next to it, name the exact texture of having it: the fabric, the meal, the room, the thing you would touch. get specific enough that your body relaxes.",
        "spend five real dollars today on one small sensory pleasure and receive it fully, no guilt. you are teaching your nervous system that money in equals good feeling.",
        "say once, out loud: i am safe to receive more than i am used to. then let it go and get on with your day.",
      ],
    };
  }
  if (el === "fire") {
    return {
      ...base,
      why: `your venus is in ${lower(venusSign)}, a fire sign, so manifestation for you runs on desire and momentum, not quiet gratitude lists. you call money in by wanting it out loud and moving toward it before you feel ready. ${houseNote}`,
      steps: [
        "say the number you actually want out loud, right now, on your own. not the safe one. the true one. fire venus needs to hear its own want.",
        "write the boldest version of what you would do with it in one sentence, present tense, as if it is already happening.",
        "take one visible action toward it today, however small, send the message, name the price, hit publish. motion is your manifestation.",
        "burn or delete one old story that says you have to wait your turn. you do not.",
      ],
    };
  }
  if (el === "air") {
    return {
      ...base,
      why: `your venus is in ${lower(venusSign)}, an air sign, so manifestation for you works through words, ideas and being heard. you call money in by naming it clearly and saying it to the right people. ${houseNote}`,
      steps: [
        "write your money intention as one clean, specific sentence. an air venus manifests through precise language, so make the wording exact.",
        "say it to one trusted person today, out loud. speaking it to another mind is how it becomes real for you.",
        "post, pitch or send one thing that puts your value into words where people can see it.",
        "end with the line: i am allowed to be paid well for the way my mind works. then move on.",
      ],
    };
  }
  return {
    ...base,
    why: `your venus is in ${lower(venusSign)}, a water sign, so manifestation for you runs through feeling and imagination, not spreadsheets. you call money in by feeling what receiving it is actually like, in your body, before it arrives. ${houseNote}`,
    steps: [
      "close your eyes and feel the exact relief of the money already being here. a water venus manifests through the felt sense, so stay with the feeling for a full minute.",
      "write down what you would no longer be afraid of once it arrives. that fear is the real thing you are clearing.",
      "do one small kind thing for yourself today that a well-resourced version of you would do without flinching.",
      "say once, softly: i am safe to receive, and i do not have to earn my rest. then let it settle.",
    ],
  };
}

/** Shadow-work keyed to the element of the member's 8th house sign (their money fear pattern). */
function buildShadowWork(eighthSign: string, rulerName: string, rulerHouse?: number): MoneyExercise {
  const el = element(eighthSign);
  const base = {
    kicker: "exercise two · clear the block",
    title: `the shadow work, ${lower(eighthSign)} 8th house`,
  };
  const rulerNote = rulerHouse
    ? `with ${lower(rulerName)} ruling your 8th from your ${houseLine(rulerHouse)}, this block tends to show up there most.`
    : `${lower(rulerName)} rules your 8th, so its themes colour the fear.`;
  const fearByElement: Record<string, string> = {
    earth: "a quiet fear that you have to earn the right to receive, and that if you are not doing it the hard way, it does not count",
    fire: "a fear of being controlled or indebted, so you would rather give it all away or do it alone than owe anyone anything",
    air: "a habit of staying in your head about money to avoid the feeling underneath it, keeping the deep stuff at a safe, analysed distance",
    water: "an old belief that wanting more, or receiving fully, is somehow dangerous or greedy, so you flinch right as it arrives",
  };
  return {
    ...base,
    why: `your 8th house is in ${lower(eighthSign)}, so your money shadow is ${fearByElement[el]}. ${rulerNote} 8/8 is a good day to loosen that grip.`,
    steps: [
      `finish this sentence honestly, no editing: "money will only be safe when i..." whatever your ${lower(eighthSign)} 8th house made you promise, write the real version.`,
      "ask where you learned that receiving has to be earned, controlled or feared. name the person or the moment. you are not blaming them, you are seeing it.",
      "find one place you are currently over-working, over-controlling or over-giving to prove you deserve it. underline it. that is the block, made visible.",
      "write one thing you will let yourself receive this week that you did not grind for: a rest, a gift, a yes. that is the ceiling lifting one inch, which is how these ceilings actually move.",
    ],
  };
}
