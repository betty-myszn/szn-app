/**
 * Money Blueprint — the section writers.
 *
 * One writer per section id. Each is a pure function of the buyer's facts and its planned inputs,
 * and returns blocks. No model, no network, no randomness beyond a chart-derived seed.
 */

import type { MoneyChartFacts, PlacementFact, HouseFact } from "../facts";
import type { WrittenSection, Block } from "./blocks";
import { p, sub, howlist, steps, table, cards, pull, tool, action, shadowlist, letter, compact } from "./blocks";
import {
  MONEY_SIGN, MONEY_BODY, MONEY_HOUSE, HD_TYPE_MONEY, HD_AUTHORITY_MONEY,
  HD_OPEN_CENTRE_MONEY, HD_DEFINED_CENTRE_MONEY, HD_PROFILE_MONEY, themeContent,
} from "./vocab";
import {
  ord, bodyName, lower, cap, list, pick, placementProse, houseProse, aspectProse,
  openCentreProse, centreName, braid, factorsToBraid, orbWeight,
} from "./phrases";
import { CHIRON_HOUSE, FOURTH_HOUSE_HOME, SATURN_HOUSE_MONEY, INHERITED_BY_PLACEMENT, GENERATIONAL } from "./roots";
import { NODE_BUILD, NODE_HOUSE_BUILD, NODE_MASTERY, PLUTO_HOUSE_POWER, VENUS_RECEIVING } from "./direction";
import { recognitionFor } from "./recognition";

export interface WriterInput {
  facts: MoneyChartFacts;
  seed: number;
  /** Resolved "Read from" labels for this section. */
  readFrom: string[];
  /** For the shadow engine: which theme, and the evidence sources behind it. */
  shadow?: { theme: string; label: string; labels?: string[]; sources: string[]; index: number; total: number };
  /** All shadows, for the opener and the derived protocol sections. */
  shadows?: Array<{ theme: string; label: string; labels?: string[]; sources: string[] }>;
  /** Timing facts, supplied by timing-lite.ts. */
  timing?: import("./timing-lite").TimingFacts;
}

type Writer = (i: WriterInput) => Block[];

// ------------------------------------------------------------------ helpers

/** themeContent throws on an unknown theme; these table helpers prefer to skip the row. */
function THEME_CONTENT_SAFE(theme: string) {
  try { return themeContent(theme); } catch { return null; }
}

const place = (f: MoneyChartFacts, id: string): PlacementFact | undefined => f.placements[id];
const house = (f: MoneyChartFacts, n: number): HouseFact | undefined => f.houses[n];

/** The house carrying the most bodies, which is the chart's loudest single statement. */
function loudestHouse(f: MoneyChartFacts): HouseFact | undefined {
  return Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
}

/** The tightest hard aspect between money bodies, which usually is the report's spine. */
function tightestHard(f: MoneyChartFacts) {
  return f.aspects.filter((a) => a.hard).sort((a, b) => a.orb - b.orb)[0];
}

function signOf(f: MoneyChartFacts, id: string): string | undefined {
  return f.placements[id]?.sign;
}


/**
 * Adds the "so what" layers to a non-shadow section using the theme it sits closest to.
 * Every chapter should carry the chain: what it looks like, how it shapes thinking, how it shapes
 * receiving, how it shapes decisions, and what is different once it moves.
 */
function depthLayers(theme: string, opts: { scenes?: boolean; chain?: boolean; healed?: boolean; practices?: number } = {}): Block[] {
  const rec = recognitionFor(theme);
  if (!rec) return [];
  const out: Block[] = [];
  if (opts.scenes !== false) {
    out.push(sub("You will recognise this"));
    out.push(howlist(rec.scenes.slice(0, 5)));
  }
  if (opts.chain !== false) {
    out.push(sub("How it shapes the way you think about money"));
    out.push(p(rec.thinking));
    out.push(sub("How it shapes your financial decisions"));
    out.push(p(rec.deciding));
  }
  if (opts.healed !== false) {
    out.push(sub("What is different once this moves"));
    out.push(howlist(rec.healed.slice(0, 4)));
  }
  const n = opts.practices ?? 2;
  for (const [name, how] of rec.practices.slice(0, n)) out.push(tool(name, how));
  return out;
}

// ============================================================ PART ONE

const moneyIdentity: Writer = ({ facts, seed }) => {
  const asc = facts.risingSign;
  const ascSign = asc ? MONEY_SIGN[asc] : null;
  const ruler = facts.chartRuler;
  const sun = place(facts, "sun");
  const moon = place(facts, "moon");
  const lilith = place(facts, "lilith");
  const b = facts.balance;

  const out: Array<Block | null> = [];

  if (asc && ascSign) {
    let s = `${asc} rises on your chart, so the first thing anybody meets is ${ascSign.texture[0]}, ${ascSign.texture[1]} energy that earns through ${ascSign.earns}.`;
    if (ruler?.sign && ruler.house) {
      const rh = MONEY_HOUSE[ruler.house];
      s += ` Its ruler ${bodyName(ruler.planet)} sits in ${ruler.sign} in your ${ord(ruler.house)} house of ${rh?.of}, which means the whole way you present is pointed at ${rh?.channel}.`;
    }
    out.push(p(s));
  }

  if (sun) {
    const sh = sun.house ? MONEY_HOUSE[sun.house] : null;
    out.push(p(
      `Your Sun sits in ${sun.sign}${sun.house ? ` in the ${ord(sun.house)} house` : ""}, and this is where your identity actually lives. ${cap(MONEY_SIGN[sun.sign]?.earns ?? "")} is how you become most yourself${sh ? `, and the ${ord(sun.house!)} house puts that squarely in ${sh.of}` : ""}. ${sh ? cap(sh.money) + "." : ""} This is the part of the chart people meet when they meet the real you rather than the professional one.`
    ));
  }

  if (moon) {
    out.push(p(
      `Your Moon in ${moon.sign}${moon.house ? ` in the ${ord(moon.house)} house` : ""} runs your emotional security, which for money means it decides what has to be true before you feel safe enough to act. ${cap(MONEY_SIGN[moon.sign]?.receives ?? "You receive on your own terms")}. When your Moon's conditions are not met, no amount of good financial reasoning will get a decision over the line.`
    ));
  }

  if (lilith) {
    out.push(p(
      `Lilith in ${lilith.sign}${lilith.house ? ` in your ${ord(lilith.house)} house` : ""} is the part of you that refuses to be managed. She is the reason you cannot make yourself palatable for money, and every season you have tried, something in you has undone it.`
    ));
  }

  out.push(p(
    `Your chart runs ${b.dominantElement}-dominant and ${b.dominantModality} by modality${b.lackingElements.length ? `, with no ${list(b.lackingElements)} at all` : ""}, which sets the pace underneath everything else. ${elementPace(b.dominantElement)} ${modalityPace(b.dominantModality)}`
  ));

  out.push(sub("How other people experience you around money"));
  out.push(table(["What they see", "What is actually happening"], identityContrast(facts)));

  out.push(sub("Your money identity in one sentence"));
  out.push(p(
    `${asc ? `You arrive as ${MONEY_SIGN[asc]?.texture[0]}, ${MONEY_SIGN[asc]?.texture[1]}` : "You arrive on your own terms"}${sun ? `, you become most yourself through ${MONEY_SIGN[sun.sign]?.earns}` : ""}${moon ? `, and you will only commit once ${MONEY_SIGN[moon.sign]?.texture[0]} conditions are met` : ""}. Anybody selling you a money strategy that ignores the third clause is going to watch you not do it.`
  ));

  out.push(sub("What this makes easy, and what it makes expensive"));
  out.push(table(["Comes naturally", "Costs you effort"], identityCosts(facts)));

  out.push(action(
    asc === "Aquarius" || asc === "Aries" || asc === "Scorpio"
      ? "Say the direct version of something you have been phrasing diplomatically for a client, and notice the response improves rather than suffers."
      : "Name one way you have been presenting yourself that is a size too small, and drop it for a week."
  ));
  return compact(out);
};

function identityContrast(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const asc = f.risingSign, sun = f.placements.sun, moon = f.placements.moon;
  if (asc) rows.push([`${MONEY_SIGN[asc]?.texture[0]} and ${MONEY_SIGN[asc]?.texture[1]}, which is your rising`, `The rising is the entrance rather than the room. What people meet first is the least private part of you.`]);
  if (sun && moon && sun.sign !== moon.sign) rows.push([`Consistent, because your ${sun.sign} Sun is what shows`, `Your ${moon.sign} Moon is running a different calculation underneath, and it decides more of your money behaviour than the Sun does`]);
  if (f.placements.lilith?.house === 1) rows.push(["Someone who does it her own way", "The unmanaged part is genuinely visible, which is why softening it never quite works"]);
  rows.push(["Decisive", f.humanDesign?.authorityLabel ? `Your ${f.humanDesign.authorityLabel} decides fast internally, and the visible confidence is downstream of that` : "The decision happened before the discussion did"]);
  return rows.slice(0, 4);
}

function identityCosts(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const el = f.balance.dominantElement, mo = f.balance.dominantModality;
  const easy: Record<string, string> = { fire: "Starting, pitching, moving before you feel ready", earth: "Building, holding, delivering what you promised", air: "Seeing the pattern, explaining it, positioning", water: "Reading people, sensing timing, holding depth" };
  const hard: Record<string, string> = { fire: "Finishing, maintaining, letting things compound", earth: "Changing direction, risking, moving fast", air: "Feeling it in the body rather than understanding it", water: "Detaching enough to price without absorbing" };
  rows.push([easy[el] ?? "", hard[el] ?? ""]);
  const easyM: Record<string, string> = { cardinal: "Initiating and setting direction", fixed: "Staying with something long past the point others quit", mutable: "Adapting to what the market actually wants" };
  const hardM: Record<string, string> = { cardinal: "Sustaining what you started", fixed: "Letting go of what has stopped working", mutable: "Committing long enough to compound" };
  rows.push([easyM[mo] ?? "", hardM[mo] ?? ""]);
  if (f.humanDesign) {
    const ty = HD_TYPE_MONEY[f.humanDesign.type];
    if (ty) rows.push([cap(ty.earns), cap(ty.costly)]);
  }
  return rows.filter((r) => r[0] && r[1]);
}

function elementPace(e: string): string {
  return {
    fire: "Fire dominant means you decide on instinct and move before the evidence is complete, which is an advantage as long as somebody is watching the follow-through.",
    earth: "Earth dominant means you want the thing to be real before you commit, and once committed you hold on far longer than most people would.",
    air: "Air dominant means you decide with your mind, and you understand your own patterns intellectually long before your body agrees to change them.",
    water: "Water dominant means you read situations through feeling first, and your body knows about a deal before your reasoning catches up.",
  }[e] ?? "";
}

function modalityPace(m: string): string {
  return {
    cardinal: "Cardinal dominant means you start things, and the risk sits in how many of them you leave half-built.",
    fixed: "Fixed dominant means that once you have chosen a direction you hold it long past the point most people would change course, so choose slowly and trust that you will see it through.",
    mutable: "Mutable dominant means you adapt quickly, and the risk is changing course just before the last direction was about to pay.",
  }[m] ?? "";
}

const loudestHouseWriter: Writer = ({ facts, seed }) => {
  const h = loudestHouse(facts);
  if (!h) return [];
  const meta = MONEY_HOUSE[h.house];
  const out: Array<Block | null> = [];

  out.push(p(houseProse(h, seed)));

  if (h.occupants.length >= 3) {
    out.push(sub("What this means for how you earn"));
    out.push(p(
      `Most people have one or two planets here and it colours a corner of their life. You have ${h.occupants.length}, which changes the reading entirely. Your income was never designed to come from ${offSuit(h.house)}. It was designed to come from ${meta?.channel}, and everything you have built that worked has followed that shape while everything that felt thin almost certainly strayed off it.`
    ));
  }

  const rulerInside = h.rulerHouse === h.house;
  if (rulerInside) {
    out.push(p(
      `Its ruler ${bodyName(h.ruler)} sits inside the house it rules, which locks the configuration in on itself and makes it self-reinforcing. There is no external escape route from this theme in your chart, which is worth knowing before you try to build a business that avoids it.`
    ));
  }

  out.push(sub("What this house asks of you"));
  out.push(p(houseDemand(h.house)));
  out.push(...depthLayers("depth", { chain: true, healed: true, practices: 2 }));
  out.push(pull(`Your wealth was always going to come through ${meta?.channel}.`, meta?.channel));
  return compact(out);
};

function offSuit(h: number): string {
  return h === 8 || h === 12
    ? "selling a simple product to a stranger at a fixed price"
    : "work that keeps you hidden and unaccountable";
}

function houseDemand(h: number): string {
  const map: Record<number, string> = {
    1: "That you stop hiding behind the work and let people buy you rather than only your output.",
    2: "That you name a number and hold it, because this house is where worth becomes literal.",
    3: "That you say the thing regularly and plainly rather than saving it for something more significant.",
    4: "That you build from a secure base rather than performing security you do not feel.",
    5: "That you let the work be enjoyable, because forced output in this house produces nothing worth buying.",
    6: "That you fix the daily mechanics, because this house rewards a workable routine over a brilliant plan.",
    7: "That you choose your partners and clients deliberately, since this house makes them the business.",
    8: "That you stop pretending to be lighter than you are, because any attempt to make the offer breezier cuts you off from your own income source.",
    9: "That you teach what you actually believe rather than what is easiest to defend.",
    10: "That you let yourself be publicly known, because this house pays reputation before it pays effort.",
    11: "That you build the room rather than chase individuals, because the group is the asset here.",
    12: "That you value the unseen work, since this house does the quiet processing everybody else's results depend on.",
  };
  return map[h] ?? "";
}

const incomeMechanism: Writer = ({ facts, seed }) => {
  const second = house(facts, 2);
  const out: Array<Block | null> = [];
  if (!second) return [];

  out.push(p(houseProse(second, seed)));

  const rulerH = second.rulerHouse ? MONEY_HOUSE[second.rulerHouse] : null;
  if (rulerH && second.rulerHouse !== 2) {
    out.push(sub("Where your money actually comes from"));
    out.push(p(
      `Follow the ruler and you have the mechanism. ${bodyName(second.ruler)} carries your income and it has landed in your ${ord(second.rulerHouse!)} house, so the practical instruction is that your money is generated through ${rulerH.channel}. Anything you build that uses that territory will outperform anything that does not, regardless of how good the second thing looks on paper.`
    ));
  }

  const eighth = house(facts, 8);
  const eleventh = house(facts, 11);
  const tenth = house(facts, 10);
  const loaded = [eighth, eleventh, tenth].filter((h): h is HouseFact => !!h && h.occupants.length >= 2);
  if (loaded.length >= 2) {
    out.push(sub("The two houses together"));
    out.push(p(
      `Put your loaded houses side by side and the whole business model appears. ${cap(list(loaded.map((h) => `the ${ord(h.house)} gives you ${MONEY_HOUSE[h.house]?.channel}`)))}. An offer that lives in both at once will outperform anything that lives in only one, and that is the single most useful sentence in this section.`
    ));
  }

  const hd = facts.humanDesign;
  if (hd?.profile) {
    const prof = HD_PROFILE_MONEY[hd.profile];
    if (prof) {
      out.push(sub("Your design agrees"));
      out.push(p(
        `Your Human Design profile is ${hd.profile}, ${prof.line}, which sells ${prof.sells}. When two entirely separate systems say the same thing about a chart, that is the part worth acting on.`
      ));
    }
  }

  out.push(cards([
    { h: "Your mechanism", p: `Income is generated through ${rulerH?.channel ?? "your own direct earning"}, and compounds through ${loaded.map((h) => MONEY_HOUSE[h.house]?.channel).filter(Boolean)[0] ?? "reputation"}.` },
    { h: "What breaks it", p: "Offers that use none of your loaded houses. They will always underperform, however good the funnel around them is." },
  ]));
  out.push(action(`Look at your current offers and find the one that touches ${rulerH?.channel ?? "your strongest house"}. Put your energy there and let the others wait.`));
  return compact(out);
};

const hdMoney: Writer = ({ facts }) => {
  const hd = facts.humanDesign;
  if (!hd) return [];
  const t = HD_TYPE_MONEY[hd.type];
  const out: Array<Block | null> = [];

  if (t) {
    out.push(p(
      `You are a ${hd.type}, and your working rhythm is ${t.rhythm}. Your strategy is to ${t.strategy}, and the reason it matters is practical rather than philosophical: you earn through ${t.earns}, and you lose through ${t.costly}.`
    ));
  }

  const auth = HD_AUTHORITY_MONEY[String(hd.authority).toLowerCase()];
  if (auth) {
    out.push(sub("Your authority, which decides every deal"));
    out.push(p(auth));
  }

  if (hd.openCenters?.includes("sacral")) {
    out.push(sub("The open sacral, which changes everything"));
    out.push(p(
      `Your sacral centre is undefined, and for money this is the most important line on the page. You do not have consistent life-force energy for sustained repetitive work. You have bursts, and between them you need genuine rest. Any model requiring the same intensity daily is fighting your design, and the exhaustion that follows is a wiring mismatch rather than a discipline failure.`
    ));
  }

  const defined = (hd.definedCenters ?? []).filter((c) => HD_DEFINED_CENTRE_MONEY[c]);
  if (defined.length) {
    out.push(sub("What you can rely on"));
    out.push(howlist(defined.map((c) => `${centreName(c)}: ${HD_DEFINED_CENTRE_MONEY[c]}`)));
  }

  if (hd.incarnationCross?.gates?.length) {
    const g = hd.incarnationCross.gates;
    const notable = g.includes(21) ? 21 : g.includes(45) ? 45 : g.includes(54) ? 54 : null;
    if (notable) {
      out.push(sub(`Gate ${notable}, in your incarnation cross`));
      out.push(p(gateNote(notable)));
    }
  }

  if (t) {
    out.push(table(["Works with your design", "Works against it"], [
      [cap(t.strategy), "Acting without informing anybody first"],
      [cap(t.earns), cap(t.costly)],
      ["Rest built in as infrastructure", "Rest taken only after collapse"],
    ]));
  }
  return compact(out);
};

function gateNote(g: number): string {
  const map: Record<number, string> = {
    21: "Gate 21 is the gate of control and material authority, sometimes called the Treasurer. Sitting in your incarnation cross makes it part of your life purpose rather than a passing influence: you are here to have authority over resources, your own and other people's. It also explains why being financially controlled by anybody else produces such a strong reaction in you.",
    45: "Gate 45 is the gate of the gatherer, the one who holds resources on behalf of a group. In your incarnation cross it means your money is bound up with community and with being the one who stewards what belongs to everybody.",
    54: "Gate 54 is the gate of ambition and the drive to rise. In your incarnation cross it means material advancement is genuinely part of your purpose rather than a distraction from it.",
  };
  return map[g] ?? "";
}

const openCentres: Writer = ({ facts }) => {
  const hd = facts.humanDesign;
  if (!hd?.openCenters?.length) return [];
  const out: Array<Block | null> = [];

  out.push(p(
    `Open centres take in the energy around them and amplify it. They are where you are wise, because you have sampled every version of that energy, and they are also where you are most conditioned, because you can mistake what you absorbed for what you are. You have ${hd.openCenters.length} open, which makes you unusually permeable to the rooms you sit in, and understanding this page will explain more of your money behaviour than almost anything else in this report.`
  ));

  out.push(table(
    ["Open centre", "What it absorbs", "How it costs you money"],
    hd.openCenters.filter((c) => HD_OPEN_CENTRE_MONEY[c]).map((c) => {
      const m = HD_OPEN_CENTRE_MONEY[c];
      return [centreName(c), cap(m.absorbs), cap(m.cost)];
    })
  ));

  const priority = ["heart", "solarplexus", "sacral"].filter((c) => hd.openCenters.includes(c));
  if (priority.length) {
    out.push(sub("The ones that matter most for your income"));
    for (const c of priority.slice(0, 2)) out.push(p(openCentreProse(c)));
  }

  out.push(sub("The wisdom in them"));
  out.push(p(
    `Open centres are where you become genuinely wise, because you have felt every version of the thing. ${cap(list(hd.openCenters.filter((c) => HD_OPEN_CENTRE_MONEY[c]).slice(0, 3).map((c) => `your open ${centreName(c)} is why ${HD_OPEN_CENTRE_MONEY[c].wisdom}`)))}. The material that has cost you most is the material you are best qualified to help other people with, which is a fairly precise description of a business.`
  ));
  return compact(out);
};

const moneyGifts: Writer = ({ facts, seed, shadows }) => {
  const out: Array<Block | null> = [];
  out.push(p(
    `This page exists because your chart has a specific problem: the things you are best at feel like nothing to you. What comes without struggle reads as low value, so the list below will probably seem unremarkable. Read it anyway, and consider that other people cannot do these things.`
  ));

  const items: Array<{ h: string; p: string }> = [];
  const loud = loudestHouse(facts);
  if (loud && loud.occupants.length >= 2) {
    items.push({ h: cap(MONEY_HOUSE[loud.house]?.label ?? "your strongest house"), p: `${loud.occupants.length} bodies in your ${ord(loud.house)} house. ${cap(MONEY_HOUSE[loud.house]?.money ?? "")}. Most people never develop this.` });
  }
  const merc = place(facts, "mercury");
  if (merc) items.push({ h: "Your language", p: `Mercury in ${merc.sign}${merc.house ? ` in the ${ord(merc.house)}` : ""}. You put words on things other people can feel and cannot say, which is rare and is your most sellable skill.` });
  const jup = place(facts, "jupiter");
  if (jup) items.push({ h: "Where luck lives", p: `Jupiter in ${jup.sign}${jup.house ? ` in your ${ord(jup.house)} house` : ""}. ${cap(MONEY_HOUSE[jup.house ?? 0]?.channel ?? "This")} expands almost by itself, and it wants to be larger than you plan for.` });
  const hd = facts.humanDesign;
  if (hd?.definedCenters?.includes("throat")) items.push({ h: "Speaking things into being", p: "Defined throat. You are built to announce, and things move when you do. Very few people have this." });
  const pof = place(facts, "part_of_fortune");
  if (pof) items.push({ h: "Where ease lives", p: `Part of Fortune in ${pof.sign}${pof.house ? ` in your ${ord(pof.house)} house` : ""}. This is the territory where things go well with the least force applied.` });
  for (const s of (shadows ?? []).slice(0, 2)) {
    items.push({ h: "Your hard-won one", p: themeContent(s.theme).gift });
  }
  out.push(cards(items.slice(0, 6)));

  out.push(sub("The one to build the business on"));
  out.push(p(
    `If you had to choose a single gift to price at the top of your offers, take the one that felt most ordinary as you read it. Ease is the evidence of mastery in this chart, and the thing you have been giving away is the thing only you can do.`
  ));
  out.push(sub("How to actually sell these"));
  out.push(table(["The gift", "How it gets sold"], sellGifts(facts)));
  out.push(sub("The test"));
  out.push(p(
    `Take any item on this page and ask how long it would take somebody competent to learn it. Anything above five years belongs at the top of your pricing. Most people price by how hard the delivery felt, which systematically rewards their weakest skills and discounts their rarest.`
  ));
  out.push(...depthLayers("depth", { scenes: true, chain: false, healed: false, practices: 3 }));
  out.push(action("Pick the gift here that feels most ordinary to you, and build your next offer around it rather than around the thing you find hardest."));
  return compact(out);
};

function sellGifts(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const loud = Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
  if (loud) rows.push([`Your ${ord(loud.house)} house depth`, `Name the specific outcome rather than the process. People buy the change, not the method.`]);
  if (f.placements.mercury) rows.push(["Your language", "Publish it. Written and spoken material is the only way this one becomes an asset rather than a service."]);
  if (f.humanDesign?.definedCenters?.includes("throat")) rows.push(["Your voice", "Audio, live, in person. Text underuses a defined throat by a wide margin."]);
  if (f.placements.jupiter?.house) rows.push([`Your ${ord(f.placements.jupiter.house)} house luck`, `Put more volume through it. Jupiter rewards throughput rather than optimisation.`]);
  if (f.placements.part_of_fortune?.house) rows.push(["Your ease", `Build the offer where the Part of Fortune sits and stop forcing the territory where it does not.`]);
  return rows.slice(0, 5);
}

// ============================================================ PART TWO: shadows

const shadowWriter: Writer = ({ facts, seed, shadow }) => {
  if (!shadow) return [];
  const c = themeContent(shadow.theme);
  const rec = recognitionFor(shadow.theme);
  const braidInputs = factorsToBraid(facts, shadow.sources, shadow.theme);
  const out: Array<Block | null> = [];

  // 1. the felt experience
  out.push(p(c.felt));

  // 2. recognition before explanation. This is the page that makes somebody put the report down.
  if (rec) {
    out.push(sub("You will recognise this"));
    out.push(howlist(rec.scenes));
  }

  // 3. where it came from, braided
  out.push(sub("Where it came from"));
  out.push(p(braid(braidInputs, c.mechanism, seed + shadow.index)));
  out.push(p(`This was laid down in ${c.origin}. A child drew a reasonable conclusion from incomplete information, and the conclusion outlived the situation that produced it, which makes it a setting rather than a flaw in your character.`));
  out.push(pull(c.pullQuote));

  // 4. the so-what chain: thinking, receiving, deciding
  if (rec) {
    out.push(sub("How it shapes the way you think about money"));
    out.push(p(rec.thinking));
    out.push(sub("How it shapes what you can receive"));
    out.push(p(rec.receiving));
    out.push(sub("How it shapes your financial decisions"));
    out.push(p(rec.deciding));
  }

  // 5. behaviour
  out.push(sub("What it looks like in your work"));
  out.push(howlist(c.showsUp));
  out.push(p(c.bodyNote));

  // 6. the cost, and what changes
  out.push(sub("The two versions of the next decade"));
  out.push(table(["If this stays unexamined", "If you work with it"], c.cost.map(([a, b]) => [a, b])));
  if (rec) {
    out.push(sub("How you will know it has shifted"));
    out.push(howlist(rec.healed));
  }

  // 7. the way through
  out.push(sub("The reframe"));
  out.push(p(c.reframe));
  out.push(steps(c.steps));

  // 8. the coaching, plural rather than one exercise
  if (rec) {
    out.push(sub("Ways to work with this"));
    for (const [name, how] of rec.practices) out.push(tool(name, how));
  }
  out.push(tool("Journal", ...c.journal));
  out.push(action(c.challenge, "Your seven-day challenge"));
  return compact(out);
};

// ============================================================ PART THREE: roots


function chironWound(sign: string): string {
  const map: Record<string, string> = {
    Aries: "Chiron in Aries describes a child who learned that wanting things loudly was unwelcome, so the appetite went underground and now surfaces as either over-drive or paralysis.",
    Taurus: "Chiron in Taurus describes a child who learned that security could vanish, so having enough never quite feels settled regardless of the balance.",
    Gemini: "Chiron in Gemini is the wound of the voice: a child whose thinking and speaking were somehow not properly received, and who became exact in the hope that exactness would finally land.",
    Cancer: "Chiron in Cancer describes a home where emotional safety was inconsistent, and a child who learned to read the room before asking for anything.",
    Leo: "Chiron in Leo describes a child whose shine was met with something other than delight, so being seen still carries a charge that has nothing to do with competence.",
    Virgo: "Chiron in Virgo describes a child who learned that being useful and correct was the price of approval, so good enough never quite arrives.",
    Libra: "Chiron in Libra describes a child who learned to keep the peace at her own expense, so fairness now runs in only one direction.",
    Scorpio: "Chiron in Scorpio describes an early experience of powerlessness or betrayal, after which control became the way safety was achieved.",
    Sagittarius: "Chiron in Sagittarius describes a child whose beliefs or optimism were dismissed, so conviction now needs defending before it is offered.",
    Capricorn: "Chiron in Capricorn describes a child who had to be the responsible one, so rest and asking for help still register as failures of character.",
    Aquarius: "Chiron in Aquarius describes a child who felt outside the group, so belonging became something to earn rather than assume.",
    Pisces: "Chiron in Pisces describes a child who absorbed everybody else's feelings, so the boundary between generosity and self-erasure was never drawn.",
  };
  return map[sign] ?? "";
}

function moonHome(sign: string): string {
  const map: Record<string, string> = {
    Aries: "You met it with immediacy and independence, learning to handle your own feelings fast rather than waiting for somebody to help.",
    Taurus: "You met it by seeking steadiness and physical comfort, which is still where you go when things become uncertain.",
    Gemini: "You met it by understanding and narrating it, turning feeling into explanation early.",
    Cancer: "You met it by attuning to everybody else's needs, often ahead of your own.",
    Leo: "You met it by being the bright one, and warmth still arrives most easily when you are performing it.",
    Virgo: "You met it by being useful and getting things right, which is still how you soothe yourself.",
    Libra: "You met it by keeping everybody comfortable, and conflict still costs you more than it costs other people.",
    Scorpio: "You met it by going private and watching closely, and trust is still something earned slowly.",
    Sagittarius: "You met it by looking toward the bigger picture rather than staying in the difficulty.",
    Capricorn: "You met it by growing up early and becoming competent, and competence is still where you feel safest.",
    Aquarius: "You met it by detaching and observing, processing feeling through understanding rather than immersion, which is why your own feelings can arrive late and all at once.",
    Pisces: "You met it by merging with the room's mood, which made you perceptive and left the edges undefined.",
  };
  return map[sign] ?? "";
}

const childhood: Writer = ({ facts, seed }) => {
  const chiron = place(facts, "chiron");
  const moon = place(facts, "moon");
  const sat = place(facts, "saturn");
  const fourth = house(facts, 4);
  const hd = facts.humanDesign;
  const out: Array<Block | null> = [];

  out.push(p(
    `Nothing in this section claims to know what happened in your house. What a chart shows is the emotional climate you adapted to and the conclusions a child would reasonably have drawn from it, which is a different and more useful thing. Read it as a description of the adaptation rather than of the events.`
  ));

  out.push(sub("The emotional environment you adapted to"));
  if (fourth && FOURTH_HOUSE_HOME[fourth.sign]) {
    out.push(p(`Your fourth house of home sits in ${fourth.sign}, which describes ${FOURTH_HOUSE_HOME[fourth.sign]}`));
  }
  if (moon) {
    out.push(p(
      `Your Moon in ${moon.sign}${moon.house ? ` in the ${ord(moon.house)} house` : ""} describes how you met that climate. ${moonHome(moon.sign)} That adaptation is still running, and in money it decides what has to be true before you will let yourself act.`
    ));
  }

  out.push(sub("The money rules you absorbed"));
  out.push(howlist(childhoodRules(facts)));

  out.push(sub("How those rules show up now"));
  out.push(table(["The rule", "How it operates today"], childhoodRuleEffects(facts)));

  out.push(sub("How you respond under stress"));
  out.push(p(
    `${moon ? `Under pressure you return to your ${moon.sign} Moon, which means ${stressResponse(moon.sign)}` : "Under pressure you return to your earliest adaptation."} ${hd?.openCenters?.includes("solarplexus") ? "With an open Solar Plexus you also take on the emotional pressure in the room and experience it as your own, so a tense negotiation costs you more than it costs the person across the table." : ""} This matters commercially because most money decisions get made under exactly this kind of low-grade pressure.`
  ));

  out.push(sub("What you learned about asking, receiving, safety and being seen"));
  out.push(table(["Area", "What you learned", "What it costs now"], childhoodLearning(facts)));

  out.push(sub("What belongs to you, and what was handed to you"));
  out.push(p(
    `The distinction matters because you can only change one of them. What belongs to you is your temperament: ${facts.balance.dominantElement}-dominant, ${facts.balance.dominantModality} by modality, with ${facts.risingSign ?? "your"} rising. That is the equipment you arrived with, and it stays. What was handed to you are the rules above, which were somebody else's conclusions about a situation you did not choose. Those are the ones available for renegotiation.`
  ));

  if (hd) {
    out.push(sub("How your design reinforces the conditioning"));
    const open = (hd.openCenters ?? []).filter((c) => HD_OPEN_CENTRE_MONEY[c]);
    out.push(p(
      open.length
        ? `Human Design calls this conditioning, and your open centres are where you absorbed most of it. ${list(open.slice(0, 3).map((c) => `your open ${centreName(c)} took in ${HD_OPEN_CENTRE_MONEY[c].absorbs}`))}. A child with these centres open does not merely observe the household's beliefs about worth and safety, she amplifies them and files them as her own. This is why the rules above feel like your personality rather than like something installed.`
        : `Your centres are largely defined, which means you took on less of the household's conditioning than most people would. Your money rules are more genuinely your own, which makes them harder to spot and easier to defend.`
    ));
  }

  out.push(sub("What you can begin changing now"));
  out.push(steps([
    ["Name the rule out loud", "Pick one rule from the list above and say it in a sentence, attributing it to whoever you learned it from. Naming the source is most of the work."],
    ["Test it once, small", "Do the opposite of the rule in a low-stakes situation this week and record what actually happened rather than what you feared."],
    ["Separate temperament from training", "When something feels non-negotiable, ask whether it is your wiring or a conclusion. Wiring stays. Conclusions can go."],
    ["Update the evidence", "Write down three facts about your current finances that would have been unimaginable to the child who drew these conclusions."],
  ]));
  out.push(...depthLayers("belonging", { scenes: true, chain: false, healed: true, practices: 2 }));
  out.push(action("Pick one money rule from this page, name who you learned it from, and break it once in a small way before Sunday."));
  return compact(out);
};

function childhoodRules(f: MoneyChartFacts): string[] {
  const out: string[] = [];
  const sat = f.placements.saturn;
  const chiron = f.placements.chiron;
  const moon = f.placements.moon;
  if (sat?.house && SATURN_HOUSE_MONEY[sat.house]) out.push(`That effort is the price of entry, specifically around ${SATURN_HOUSE_MONEY[sat.house]}`);
  if (chiron?.house && CHIRON_HOUSE[chiron.house]) out.push(`That ${lower(CHIRON_HOUSE[chiron.house].adult.split(",")[0])}`);
  if ((f.houses[2]?.occupants.length ?? 0) === 0) out.push("That worth is something you work out later, once there is enough evidence to justify it");
  if (moon?.sign) out.push(`That safety looks like ${MONEY_SIGN[moon.sign]?.texture[0]} conditions being met before you are allowed to relax`);
  if (f.humanDesign?.openCenters?.includes("heart")) out.push("That you have to prove your value rather than assume it, and that the proving is never quite finished");
  if (f.humanDesign?.openCenters?.includes("sacral")) out.push("That rest has to be justified and that stopping means something has gone wrong");
  out.push("That wanting more than you currently have needs an explanation");
  return out.slice(0, 6);
}

function childhoodRuleEffects(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const sat = f.placements.saturn;
  if (sat?.house) rows.push([`Effort buys permission`, `You over-deliver before invoicing, and the extra work is invisible on the invoice`]);
  if ((f.houses[2]?.occupants.length ?? 0) === 0) rows.push([`Worth is provisional`, `Your quote moves depending on the week you have had`]);
  if (f.humanDesign?.openCenters?.includes("heart")) rows.push([`Value must be proven`, `Achievements produce relief rather than pride, and the relief is short`]);
  if (f.humanDesign?.openCenters?.includes("solarplexus")) rows.push([`Keep the room comfortable`, `You discount in response to a pause rather than an objection`]);
  if (f.placements.chiron?.house) rows.push([`Do not need too much`, `You ask for less than you meant to, specifically in the area your Chiron occupies`]);
  rows.push([`Wanting needs justifying`, `You explain your prices more than they need explaining`]);
  return rows.slice(0, 5);
}

function stressResponse(sign: string): string {
  const map: Record<string, string> = {
    Aries: "you act fast to discharge the tension, and the speed is what costs you rather than the decision itself.",
    Taurus: "you dig in and refuse to move, which protects you and also freezes the situation.",
    Gemini: "you talk, research and gather more information, often past the point where more information helps.",
    Cancer: "you withdraw and look after everybody else, which postpones your own decision indefinitely.",
    Leo: "you perform competence, which means nobody realises you needed help.",
    Virgo: "you become meticulous and find something to fix, usually in yourself.",
    Libra: "you seek agreement and smooth the surface, at the cost of saying what you actually want.",
    Scorpio: "you go private and watch, revealing nothing until you have decided alone.",
    Sagittarius: "you look to the bigger picture, which reframes the difficulty and sometimes avoids it.",
    Capricorn: "you take on more responsibility and work harder, which is admired and expensive.",
    Aquarius: "you detach and analyse it as though it were happening to somebody else, which delays the feeling rather than removing it.",
    Pisces: "you merge with the room's mood and lose track of what you wanted before you walked in.",
  };
  return map[sign] ?? "";
}

function childhoodLearning(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const chiron = f.placements.chiron;
  const moon = f.placements.moon;
  const sat = f.placements.saturn;
  rows.push(["Asking", chiron?.house ? `Risky in the area of ${MONEY_HOUSE[chiron.house]?.of}` : "Something to do sparingly and with justification", "You under-ask in negotiation and call it being reasonable"]);
  rows.push(["Receiving", f.placements.venus ? `Conditional, in the ${MONEY_SIGN[f.placements.venus.sign]?.texture[0]} way your Venus receives` : "Something to be balanced immediately", "Your income is capped at what you can bear to be given"]);
  rows.push(["Safety", moon ? `${cap(MONEY_SIGN[moon.sign]?.texture[0] ?? "specific")} conditions had to be met first` : "Conditional and worth protecting", "You defer expansion until conditions are met that never quite arrive"]);
  rows.push(["Being seen", sat?.house === 1 || sat?.house === 10 || f.placements.lilith?.house === 1 ? "Carried a cost, so visibility became something to manage" : "Available on the right terms", "You cap your visibility just below genuine exposure"]);
  return rows;
}

const chironMoney: Writer = ({ facts, seed }) => {
  const chiron = place(facts, "chiron");
  if (!chiron) return [];
  const h = chiron.house ? CHIRON_HOUSE[chiron.house] : null;
  const sign = MONEY_SIGN[chiron.sign];
  const aspects = facts.aspects.filter((a) => a.a === "chiron" || a.b === "chiron").sort((a, b) => a.orb - b.orb);
  const hd = facts.humanDesign;
  const out: Array<Block | null> = [];

  // the placement itself
  out.push(p(
    `Chiron is the part of a chart that never fully closes and becomes your medicine for other people instead. Yours sits in ${chiron.sign}${chiron.house ? ` in the ${ord(chiron.house)} house` : ""}${chiron.retrograde ? ", retrograde" : ""}, and it carries ${aspects.length} aspect${aspects.length === 1 ? "" : "s"} to the rest of your chart, which decides how loudly it operates. ${aspects.length >= 3 ? "That many connections means it is wired through the whole system rather than sitting in a corner, so its influence turns up in sections of this report that appear to be about something else entirely." : aspects.length ? "That is a moderate wiring, so it colours specific areas rather than the whole chart." : "With no major aspects it works quietly in the background of one area rather than across the chart."}`
  ));

  out.push(sub("How the wound formed"));
  out.push(p(
    `${cap(chironWound(chiron.sign))} ${h ? `The ${ord(chiron.house!)} house places it ${h.scene}` : ""}`
  ));
  if (chiron.retrograde) {
    out.push(p(
      `It is retrograde, and that detail changes the whole shape of it. A retrograde Chiron turns the injury inward rather than outward, so instead of protesting or asking for what was missing, you drew a private conclusion and got on with it. You almost certainly did not make a scene about this as a child and may not remember it as significant at all. The self-sufficiency it built is genuinely load-bearing in your business today, and it arrived attached to a quiet doubt that has been setting your prices ever since.`
    ));
  }

  out.push(sub("The aspects that shape it"));
  if (aspects.length) {
    out.push(howlist(aspects.slice(0, 4).map((a) => {
      const other = a.a === "chiron" ? a.b : a.a;
      const B = MONEY_BODY[other];
      return `${bodyName(other)} ${a.type} at ${a.orb.toFixed(1)}°: ${a.hard
        ? `friction between the wound and ${B?.governs}. You will feel this as the two pulling against each other whenever ${B?.role} is called for.`
        : `an easy channel between the wound and ${B?.governs}, which is why that capacity feels effortless and therefore invisible to you.`}`;
    })));
    const tight = aspects[0];
    const other = tight.a === "chiron" ? tight.b : tight.a;
    out.push(p(
      `The tightest of them is ${bodyName(other)} at ${tight.orb.toFixed(1)} degrees, which makes it the defining one. ${bodyName(other)} governs ${MONEY_BODY[other]?.governs}, so in practice your wound and that faculty are the same equipment. ${tight.hard ? "The friction never fully resolves, and it is also the reason your work in this area is good: you had to become exact where other people were allowed to stay approximate." : "It flows so smoothly that you have probably never counted it as a skill, which is precisely why you have been giving it away."}`
    ));
  } else {
    out.push(p("Your Chiron stands relatively unaspected, which means it operates as a discrete area rather than colouring the whole chart. The work is more contained and more specific than it is for most people."));
  }

  out.push(sub("How it affects your relationship with money"));
  out.push(p(h ? h.moneyCost : "It sets a ceiling on what you will ask for in the area it occupies."));
  out.push(p(
    `Underneath the specific behaviour is a general rule: you charge confidently for the things you had to learn and hesitantly for the things you simply are. Chiron sits on the second category, which is why the most valuable thing you do is the thing you have been treating as too obvious to invoice for.`
  ));

  out.push(sub("How it affects receiving, speaking and being seen"));
  out.push(howlist([
    `Receiving: ${h ? h.adult : "You accept help in the areas you feel competent and refuse it exactly where you need it most."}`,
    `Speaking: ${chiron.sign === "Gemini" || chiron.house === 3 ? "Directly affected. You over-prepare and over-explain, and being spoken over lands harder than it should." : "You will speak fluently about most things and go carefully around this one, often adding qualifiers you do not need."}`,
    `Visibility: ${chiron.house === 1 || chiron.house === 10 ? "Directly affected. Being seen carries a charge that has nothing to do with your competence." : "You are willing to be visible until the subject touches this wound, at which point you become notably more formal."}`,
    `Trust: ${chiron.house === 7 || chiron.house === 8 ? "Directly affected. Close working relationships reactivate the original conditions." : "You extend trust reasonably until somebody touches this area, where you become watchful and slower to commit."}`,
  ]));

  out.push(sub("The gift that develops through it"));
  out.push(p(
    `${h ? cap(h.medicine) : "You developed genuine capacity in the exact area that was denied to you."} This is the part worth building the business on, because a wound that has been worked with produces a practitioner who cannot be faked by somebody who read it in a book. ${sign ? `Chiron in ${chiron.sign} specifically gives you ${sign.texture[0]}, ${sign.texture[1]} handling of the material, which is what your clients feel in the room.` : ""}`
  ));

  out.push(sub("What repeats while it stays unconscious"));
  out.push(howlist([
    "You attract clients and situations that reproduce the original dynamic, and read it as bad luck",
    h ? h.moneyCost : "You undercharge in this exact area",
    "You over-function to prevent the wound being touched, which is expensive and invisible",
    "You feel a disproportionate reaction to a small slight in this territory and cannot explain why",
  ]));

  out.push(sub("What changes when it is integrated"));
  out.push(p(
    `The wound stops setting your prices and starts informing your work. ${h ? `You charge properly for ${lower(h.chargeFor)}` : "You charge properly for the thing you had been giving away"}, you stop over-functioning to avoid the tender spot, and the reaction that used to arrive as a flinch arrives instead as information about a client. Chiron is never fully healed, which is exactly why you can work this material for decades without exhausting it. The open place is what keeps you credible.`
  ));

  if (hd) {
    out.push(sub("How your design reinforces or complicates it"));
    const relevant = (hd.openCenters ?? []).filter((c) => ["heart", "ajna", "throat", "g", "solarplexus"].includes(c));
    out.push(p(
      relevant.length
        ? `Your open ${list(relevant.map(centreName))} centre${relevant.length > 1 ? "s" : ""} compound${relevant.length > 1 ? "" : "s"} this. ${relevant.map((c) => HD_OPEN_CENTRE_MONEY[c]?.cost).filter(Boolean).join(" And ")}. Where astrology gives you the wound, your design gives you the amplifier, which is why this pattern has been so hard to think your way out of.`
        : `Your defined centres give you a steady base underneath this, which means the wound colours your pricing without destabilising your whole sense of self. That is a genuine advantage and it makes the integration work faster than it is for most people.`
    ));
  }

  out.push(sub("How this may have shown up in real life"));
  out.push(howlist([
    h ? `A piece of work where you did the ${lower(h.medicine.split(",")[0])} and somebody else was credited for the outcome.` : "A piece of work where the real contribution went uncredited.",
    "A client who paid you for the deliverable and told you afterwards that the actual value was something you never invoiced for.",
    "A moment where somebody praised you in exactly this area and you found you could not take it in.",
    "A recurring negotiation where you accepted less than you meant to, in this specific territory rather than across the board.",
  ]));

  out.push(tool("Journal",
    `What did you conclude about yourself in the area of ${h ? lower(h.scene.split(".")[0]) : "this wound"}, and how old were you when you concluded it?`,
    "What do people consistently thank you for that you have never charged for?",
    "Where do you over-prepare, and what would happen if you turned up with half the preparation?"
  ));
  out.push(tool("A practical healing exercise",
    "Write down the thing you are best at that costs you least effort. Underneath it, write the sentence you would have to believe in order to charge triple for it. Notice the resistance, and name whose voice it is in.",
    "Then take that one skill and make it the headline of your next offer rather than a bullet point inside it. Chiron integrates through being used deliberately, rather than through being understood."
  ));
  out.push(action(`Name the thing your work actually heals, in one sentence, and put it at the top of your offer rather than at the bottom.`));
  return compact(out);
};

const inheritedBeliefs: Writer = ({ facts, seed }) => {
  const out: Array<Block | null> = [];
  const sat = place(facts, "saturn");
  const plu = place(facts, "pluto");
  const rules = matchedInheritedRules(facts);

  out.push(p(
    `Money beliefs travel down a family line the way an accent does: absorbed rather than taught, and invisible to the person carrying them because everybody around them sounded the same. Your chart shows which rules were most likely in the air, and the eighth and fourth houses are where the transmission happens, because those are the houses of what is inherited and what is unspoken.`
  ));

  if (plu?.sign && GENERATIONAL[plu.sign]) {
    out.push(sub("The generational layer"));
    out.push(p(GENERATIONAL[plu.sign]));
    out.push(p(
      `That is the collective backdrop rather than your personal story, and it matters because the rules below did not originate with your parents either. They were passing on something they also absorbed.`
    ));
  }

  out.push(sub("The rules your chart suggests were in the air"));
  if (rules.length) {
    for (const r of rules.slice(0, 4)) {
      out.push(tool(r.title, `The rule: ${r.rule.rule}`, `Where it came from: ${r.rule.from}`, `What is actually true: ${r.rule.truth}`));
    }
  }

  out.push(sub("The specific territories"));
  out.push(table(["Territory", "The inherited position", "How it shows up in your work now"], inheritedTerritories(facts)));

  out.push(sub("Out-earning the people who raised you"));
  out.push(p(
    `This is the part almost nobody says out loud. ${(facts.houses[8]?.occupants.length ?? 0) >= 2 || sat?.house === 2 || sat?.house === 8
      ? "Your chart carries a loaded inheritance axis, which means earning significantly more than the people who raised you produces a specific and predictable discomfort. It arrives as guilt, as an urge to downplay, as giving money away faster than you earn it, or as a ceiling you cannot explain."
      : "Your chart carries this more lightly than most, so out-earning your family is likely to feel odd rather than forbidden. The discomfort shows up as understatement rather than as sabotage."} The loyalty is real: some part of you understood early that doing much better than the people you came from might be experienced by them as a comment. Naming that is most of the work, because loyalty that stays unconscious gets acted out through your pricing.`
  ));

  out.push(sub("Separating the three"));
  out.push(table(["What you inherited", "How it shows up now", "What your chart is asking you to build"], inheritedVsChart(facts)));

  out.push(tool("Journal",
    "Which of the rules on this page would the person who raised you agree with, and which would they deny holding?",
    "What would change in your business if you earned three times what your family expects of you, and who would you tell first?",
    "What did money mean in your house: safety, status, conflict, silence, or something else entirely?"
  ));
  out.push(action("Say one true sentence about money out loud to somebody in your family this week, or write down the rule you inherited and name who you learned it from."));
  return compact(out);
};

function matchedInheritedRules(f: MoneyChartFacts): Array<{ title: string; rule: typeof INHERITED_BY_PLACEMENT[string] }> {
  const out: Array<{ title: string; rule: typeof INHERITED_BY_PLACEMENT[string] }> = [];
  const add = (k: string, title: string) => { const r = INHERITED_BY_PLACEMENT[k]; if (r && !out.find((x) => x.rule === r)) out.push({ title, rule: r }); };
  const sat = f.placements.saturn, plu = f.placements.pluto, moon = f.placements.moon, nep = f.placements.neptune, chi = f.placements.chiron;
  if (sat?.house === 2) add("saturn-2", "From Saturn in your 2nd house");
  if (sat?.house === 8) add("saturn-8", "From Saturn in your 8th house");
  if (plu?.house === 2) add("pluto-2", "From Pluto in your 2nd house");
  if (plu?.house === 8) add("pluto-8", "From Pluto in your 8th house");
  if (moon?.house === 2) add("moon-2", "From your Moon in the 2nd house");
  if (nep?.house === 2) add("neptune-2", "From Neptune in your 2nd house");
  if (chi?.house === 4) add("chiron-4", "From Chiron in your 4th house");
  if (f.aspects.some((a) => (a.a === "venus" && a.b === "saturn") || (a.a === "saturn" && a.b === "venus"))) add("venus-saturn", "From Venus meeting Saturn");
  if ((f.houses[2]?.occupants.length ?? 0) === 0) add("empty-2", "From your empty 2nd house");
  return out;
}

function inheritedTerritories(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const eighthLoaded = (f.houses[8]?.occupants.length ?? 0) >= 2;
  const sat = f.placements.saturn;
  const hd = f.humanDesign;
  rows.push(["Secrecy", eighthLoaded ? "Money was private and figures were not discussed" : "Money was discussed practically rather than emotionally",
    eighthLoaded ? "You keep your real numbers to yourself, including from people who could help" : "You are matter-of-fact about money and may underestimate its emotional weight for others"]);
  rows.push(["Scarcity", sat?.house === 2 || sat?.house === 8 ? "There is never quite enough, so it must be defended" : "Enough was assumed rather than anxiously guarded",
    sat?.house === 2 || sat?.house === 8 ? "You under-invest in your own business and call it prudence" : "You spend more comfortably than you save"]);
  rows.push(["Control", f.placements.pluto?.house === 8 || f.placements.pluto?.house === 2 ? "Whoever holds the money holds the power" : "Money was administrative rather than political",
    f.placements.pluto?.house === 8 || f.placements.pluto?.house === 2 ? "You would rather hold all of it than share any of it" : "You delegate financial matters readily, sometimes too readily"]);
  rows.push(["Dependence", "Needing help was a position to avoid", "You refuse support that would obviously speed things up"]);
  rows.push(["Debt", eighthLoaded ? "Something was owed, and it was not discussed" : "Borrowing was practical rather than shameful",
    eighthLoaded ? "You avoid leverage entirely, including the kind that would grow the business" : "You are comfortable with sensible leverage"]);
  rows.push(["Work and rest", hd?.openCenters?.includes("sacral") ? "Working hard was the proof of a good character" : "Work was work, and it stopped",
    hd?.openCenters?.includes("sacral") ? "Rest requires justification, so you take it only after collapse" : "You pace yourself reasonably well"]);
  rows.push(["Wanting more", "Ambition needed downplaying", "You understate your goals, including to yourself"]);
  rows.push(["Receiving support", f.placements.venus ? `Given ${MONEY_SIGN[f.placements.venus.sign]?.receives}` : "Balanced immediately", "You reciprocate before the gift has landed"]);
  return rows.slice(0, 7);
}

function inheritedVsChart(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const second = f.houses[2];
  const loud = Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
  rows.push(["Money is private", "You keep your numbers to yourself", loud ? `Your ${ord(loud.house)} house needs you visible about what you do and what it costs` : "A practice of naming figures out loud"]);
  rows.push(["Security means holding on", "You store rather than deploy", "Money in your chart grows through movement rather than storage"]);
  rows.push(["Wanting more needs justifying", "You understate your goals", "A stated number, said once, without an explanation attached"]);
  if (second?.rulerHouse) rows.push(["Earn it the respectable way", "You default to the obvious model", `Your income ruler points at ${MONEY_HOUSE[second.rulerHouse]?.channel}, which may look nothing like what you were shown`]);
  rows.push(["Do not outgrow the room", "You cap just below genuine exposure", "A ceiling you set deliberately rather than inherit"]);
  return rows;
}

const receiving: Writer = ({ facts, seed }) => {
  const ven = place(facts, "venus");
  const hd = facts.humanDesign;
  const out: Array<Block | null> = [];
  const vr = ven ? VENUS_RECEIVING[ven.sign] : null;

  out.push(p(
    `An income is a receiving mechanism and nothing else. Money arriving is money received, which means whatever governs how you accept a compliment also governs the ceiling on what you can earn. Most people never connect the two, and it is the most expensive disconnection in this report.`
  ));

  if (ven && vr) {
    out.push(sub("What receiving feels like in your body"));
    out.push(p(
      `Venus governs receiving and yours is in ${ven.sign}${ven.house ? ` in the ${ord(ven.house)} house` : ""}. In the body that registers as ${vr.body}. ${ven.house ? `Sitting in the ${ord(ven.house)} house, the whole capacity is bound up with ${MONEY_HOUSE[ven.house]?.of}, so that is the territory where receiving is hardest and most consequential.` : ""}`
    ));
    out.push(sub("What happens when somebody gives to you"));
    out.push(p(`${cap(vr.whenGiven)}. Watch the two seconds after the offer rather than your eventual response, because the reflex fires long before the reasoning.`));
  }

  const venHard = facts.aspects.filter((a) => (a.a === "venus" || a.b === "venus") && a.hard).sort((a, b) => a.orb - b.orb)[0];
  if (venHard) {
    const other = venHard.a === "venus" ? venHard.b : venHard.a;
    out.push(p(
      `${bodyName(other)} makes ${orbWeight(venHard.orb)} ${venHard.type} to your Venus at ${venHard.orb.toFixed(1)} degrees, so everything arriving passes through ${MONEY_BODY[other]?.governs} on the way in. In practice that means ${MONEY_BODY[other]?.strain}, and it is charged as a toll on every single thing you receive.`
    ));
  }

  out.push(sub("Your specific receiving behaviours"));
  out.push(table(["The moment", "What you do", "What it costs"], receivingBehaviours(facts)));

  out.push(sub("Does support feel like debt or like exposure"));
  out.push(p(
    `${ven?.sign === "Scorpio" || ven?.house === 8 || ven?.house === 12
      ? "For you it registers as exposure. Being given to creates intimacy, and intimacy means somebody can see you needing something, which is the actual thing being avoided. This is why you can accept a payment easily and a favour with difficulty."
      : ven?.sign === "Capricorn" || ven?.sign === "Virgo" || facts.placements.saturn?.house === 2
      ? "For you it registers as debt. Unearned things go straight onto an internal ledger and sit there generating a low-level obligation until you have discharged them, usually with more work than the original gift was worth."
      : "For you it sits between the two: manageable when the exchange is clear and uncomfortable when it is simply a gift."} ${hd?.openCenters?.includes("heart") ? "Your open Heart centre compounds it, because that centre has no fixed sense of worth to measure the gift against, so the arithmetic never settles." : ""}`
  ));

  out.push(sub("Does money arriving make you work harder"));
  out.push(p(
    `${hd?.openCenters?.includes("sacral") || facts.placements.saturn?.house === 2 || facts.placements.saturn?.house === 6
      ? "Yes, and reliably. A payment landing produces a small surge of pressure to justify it rather than a settling. You will notice yourself adding something to the delivery in the days after an invoice clears, unasked and unpaid."
      : "Less than most. Payment tends to settle you rather than activate you, which is a real advantage and means your leak is elsewhere."}`
  ));

  out.push(sub("The mechanism, in full"));
  const drivers: string[] = [];
  if (venHard) drivers.push(`${bodyName(venHard.a)} ${venHard.type} ${bodyName(venHard.b)} taxes everything on the way in`);
  if (ven) drivers.push(`Venus in ${ven.sign} means you receive ${vr?.body.split(",")[0]}`);
  if (hd?.openCenters?.includes("heart")) drivers.push("an open Heart centre gives you no fixed worth to weigh the gift against");
  if (hd?.openCenters?.includes("solarplexus")) drivers.push("an open Solar Plexus means you feel the giver's feelings as well as your own");
  if ((facts.houses[2]?.occupants.length ?? 0) === 0) drivers.push("an empty second house leaves worth without a fixed home");
  out.push(p(drivers.length >= 2
    ? `${cap(list(drivers))}. Those compound into one loop: something arrives, the flinch fires, the discomfort gets resolved by giving back, and the exchange returns to a balance where you are owed nothing and therefore safe.`
    : `The mechanism is relatively simple in your chart, which means it responds quickly to deliberate practice.`));

  out.push(sub("What healthy receiving looks like for your chart specifically"));
  out.push(p(vr ? cap(vr.healthy) + "." : "Letting one good thing arrive and stay without being repaid."));
  out.push(steps([
    ["Receive without reciprocating", "Accept something and give nothing back for a full day. This is the core exercise and it will feel disproportionate to how small it is."],
    ["Let the invoice be enough", "Send it without an extra deliverable attached and sit through the discomfort rather than resolving it with more work."],
    ["Be witnessed", "Accept praise publicly, once, without deflecting, and let the sentence finish."],
    [ven?.sign === "Scorpio" || ven?.house === 8 ? "Receive from one trusted person" : "Ask for one thing directly", ven?.sign === "Scorpio" || ven?.house === 8 ? "Without investigating their motive. Exposure is the fear, so a safe witness is the correct starting point." : "Without justifying the ask or offering anything in exchange."],
    ["Separate earning from deserving", "Write down what you delivered and what you were paid, and notice the exchange was already fair before you added anything."],
  ]));
  out.push(tool("Journal",
    "When somebody gives you something, what happens in the first two seconds, and what do you usually do about it?",
    "What is the largest sum you could receive without feeling you had to do something about it?",
    "Who in your life gives to you without keeping score, and how does that land differently?"
  ));
  out.push(...depthLayers("receiving", { scenes: true, chain: false, healed: true, practices: 4 }));
  out.push(action("Accept one thing fully this week, say only thank you, and give nothing in return for twenty-four hours."));
  return compact(out);
};

function receivingBehaviours(f: MoneyChartFacts): string[][] {
  const rows: string[][] = [];
  const hd = f.humanDesign;
  rows.push(["Somebody compliments your work", f.placements.venus?.sign === "Gemini" || f.placements.venus?.sign === "Virgo" ? "You deflect or correct it" : "You accept it and change the subject quickly", "People learn to stop offering, which confirms the belief"]);
  rows.push(["A payment lands", hd?.openCenters?.includes("sacral") ? "You look for something extra to add" : "You move straight to the next deliverable", "The margin you earned gets spent back in unbilled work"]);
  rows.push(["Somebody offers help", "You say you are fine, then do it alone at night", "Everything stays the size one person can carry"]);
  rows.push(["A client pauses at your price", hd?.openCenters?.includes("solarplexus") ? "You feel their hesitation as your own and fill it" : "You explain the price again", "You discount against an objection that was never made"]);
  rows.push(["A gift arrives unprompted", "You reciprocate within the week", "Nothing is ever simply kept"]);
  return rows;
}

const nervousSystem: Writer = ({ facts }) => {
  const hd = facts.humanDesign;
  const out: Array<Block | null> = [];
  out.push(p(
    `Your chart runs ${facts.balance.dominantElement}-dominant, which makes you good at understanding your own patterns${facts.balance.dominantElement === "air" ? " intellectually, long before your body agrees to change them" : ""}. ${hd ? `Your authority is ${hd.authorityLabel}, and your money blocks live in the body rather than in the thinking, which is why insight has arrived easily and changed very little.` : ""} Understanding was never the mechanism.`
  ));
  if (hd?.definedCenters?.length) {
    out.push(sub("What your body is reliable about"));
    out.push(howlist(hd.definedCenters.filter((c) => HD_DEFINED_CENTRE_MONEY[c]).map((c) => `${centreName(c)}: ${HD_DEFINED_CENTRE_MONEY[c]}`)));
  }
  out.push(sub("What happens in your body at the moment of money"));
  out.push(table(["Moment", "What happens", "What to do"], [
    ["Naming a price", "The correcting voice arrives and the softening sentence forms", "Exhale longer than you inhale, say the number, stop"],
    ["The client pauses", hd?.openCenters?.includes("solarplexus") ? "Your open solar plexus absorbs the pause and amplifies it" : "You read the pause as a verdict", "Name it silently as theirs and hold the silence"],
    ["Being paid well", "The urge to over-deliver arrives to make it feel earned", "Do nothing extra for twenty-four hours"],
    ["A quiet week", hd?.definedCenters?.includes("root") ? "Your defined root generates pressure with nowhere to put it" : "Anxiety arrives out of proportion to the runway", "Move physically, then rest deliberately"],
  ]));
  out.push(sub("The practice that matters most for you"));
  out.push(p("Somatic work will outperform analysis every time in this area, which is genuinely annoying for a chart this good at thinking. Breath before quoting, movement to discharge pressure, and a gap between the room and the decision will do more for your income than another framework. The frameworks you already have."));
  out.push(...depthLayers("overgiving", { scenes: true, chain: false, healed: true, practices: 3 }));
  out.push(action("Before every money conversation this week, take three breaths with a longer exhale than inhale, and notice what changes about the number you say."));
  return compact(out);
};

// ============================================================ PART FOUR: purpose


function nodeActions(sign: string, house?: number | null): string[] {
  const bySign: Record<string, string[]> = {
    Aries: ["Deciding alone rather than consulting three people first", "Backing your own judgement before the evidence is complete", "Taking the direct route rather than the diplomatic one"],
    Taurus: ["Saying the same true, plain thing regularly rather than finding a new profound one each time", "Building assets that accumulate rather than events that peak", "Charging steady, held rates rather than bespoke intensity pricing", "Letting something be reliable and leaving it alone for years"],
    Gemini: ["Saying it publicly, often, in short pieces rather than saving it for the definitive work", "Following curiosity rather than obligation", "Letting the everyday conversation be the product"],
    Cancer: ["Building a base you actually live in rather than one you defend", "Letting people close enough to support you", "Working from safety rather than toward it"],
    Leo: ["Putting your name on it", "Letting the work be visibly yours rather than anonymously excellent", "Doing it because it delights you"],
    Virgo: ["Making the daily practice reliable rather than the vision perfect", "Serving something concrete", "Refining what exists instead of imagining what could"],
    Libra: ["Building it with somebody rather than alone", "Letting the relationship be the asset", "Choosing a fairness that includes you"],
    Scorpio: ["Going all the way in rather than staying at a manageable depth", "Sharing resources rather than holding them", "Letting the intensity be the offer"],
    Sagittarius: ["Teaching what you believe rather than what is easiest to defend", "Taking the wider view in public", "Letting conviction lead"],
    Capricorn: ["Building the structure and staying with it for a decade", "Taking authority rather than waiting to be granted it", "Letting the reputation compound"],
    Aquarius: ["Building for the group rather than only for yourself", "Letting the strange idea be the business", "Trusting the long view over the current market"],
    Pisces: ["Letting the work be felt rather than only understood", "Trusting what you sense before it is provable", "Making room for the unmeasurable"],
  };
  const base = [...(bySign[sign] ?? [])];
  if (house) base.push(`Doing all of it ${NODE_HOUSE_BUILD[house]}`);
  return base;
}

const purpose: Writer = ({ facts, seed }) => {
  const nn = place(facts, "north_node");
  const sn = place(facts, "south_node");
  if (!nn) return [];
  const build = NODE_BUILD[nn.sign];
  const mastery = sn ? NODE_MASTERY[sn.sign] : null;
  const hd = facts.humanDesign;
  const out: Array<Block | null> = [];

  out.push(p(
    `The nodal axis is the one part of a chart that is explicitly about direction rather than description. The south node is the equipment you arrived holding, already competent, requiring no further practice. The north node is the thing you came to build, and it never feels natural at the start, which is the single most reliable way to identify it.`
  ));

  out.push(sub("What you are here to build"));
  out.push(p(
    `Your north node in ${nn.sign}${nn.house ? ` in the ${ord(nn.house)} house` : ""} asks you to build ${build?.build}${nn.house ? `, and to build it ${NODE_HOUSE_BUILD[nn.house]}` : ""}. In daily terms that means ${build?.practice}. ${nn.retrograde ? "It is retrograde, which marks this as a returning lesson rather than a new one. You have circled it before, possibly several times, and something has pulled you off each time." : ""}`
  ));
  out.push(p(
    `Here is the part that catches people. Living your north node ${build?.feels}. It is supposed to. If the growth direction felt exciting you would already have taken it, and the discomfort is not a signal that you have chosen wrong.`
  ));

  if (sn && mastery) {
    out.push(sub("What you have already mastered"));
    out.push(p(
      `Your south node in ${sn.sign}${sn.house ? ` in the ${ord(sn.house)} house` : ""} means you arrived holding ${mastery.holds}, and you are genuinely excellent at it. Nobody is asking you to give that up. What the axis is asking is that you stop using it as the place you retreat to, because ${mastery.retreat}, and the cost of that is specific: ${mastery.cost}.`
    ));
  }

  out.push(sub("How money participates in the lesson"));
  out.push(p(`${cap(build?.money ?? "")}. ${nn.house ? `The ${ord(nn.house)} house tells you where: ${MONEY_HOUSE[nn.house]?.channel}. Income built there compounds; income built in your south node territory pays well and plateaus.` : ""}`));

  const nodeAspects = facts.aspects.filter((a) => a.a.includes("node") || a.b.includes("node"));
  if (nodeAspects.length) {
    out.push(sub("What keeps pulling you off it"));
    out.push(howlist(nodeAspects.slice(0, 3).map((a) => {
      const other = a.a.includes("node") ? a.b : a.a;
      return `${bodyName(other)} ${a.type} the nodal axis at ${a.orb.toFixed(1)}°: ${a.hard
        ? `${MONEY_BODY[other]?.governs} actively resists the new direction, which is why you keep leaving just before it pays.`
        : `${MONEY_BODY[other]?.governs} supports the move, so lean on it deliberately when the direction feels flat.`}`;
    })));
  }

  if (hd) {
    out.push(sub("How your design supports the direction"));
    out.push(p(
      `Your ${hd.type} strategy is to ${HD_TYPE_MONEY[hd.type]?.strategy}, and your ${hd.authorityLabel} decides. Those two together are the mechanism for actually moving toward the node rather than admiring it: the node says where, and your design says how you get there without forcing it. ${hd.profile && HD_PROFILE_MONEY[hd.profile] ? `Your ${hd.profile} profile means the route runs through ${HD_PROFILE_MONEY[hd.profile].sells}.` : ""}`
    ));
  }

  out.push(sub("What living it looks like, concretely"));
  out.push(howlist(nodeActions(nn.sign, nn.house)));

  out.push(sub("Where this goes if you commit"));
  out.push(p(`${cap(build?.matured ?? "")}. That is a ten-year picture rather than a twelve-month one, which is the correct timescale for a nodal lesson.`));

  out.push(tool("Journal",
    `What have you been treating as beneath you that your north node is actually asking for?`,
    `What did you do the last three times the steady direction got boring, and what did it cost?`,
    `If you committed to ${build?.build} for five years, what would you have to stop doing?`
  ));
  out.push(...depthLayers("expansion", { scenes: true, chain: false, healed: true, practices: 3 }));
  out.push(action(`Take the most profound thing you know and do it the ${nn.sign} way once this week: ${build?.practice}.`));
  return compact(out);
};

const moneyKarma: Writer = ({ facts, seed }) => {
  const sn = place(facts, "south_node");
  const nn = place(facts, "north_node");
  if (!sn) return [];
  const mastery = NODE_MASTERY[sn.sign];
  const out: Array<Block | null> = [];

  out.push(p(
    `Karma in a money report means the lesson that keeps returning in different clothes until it is learned, rather than anything cosmic about punishment. It shows up as a pattern you have been through more than twice with different people, different businesses and the same ending.`
  ));

  out.push(sub("The competence you arrived with"));
  out.push(p(
    `Your south node in ${sn.sign}${sn.house ? ` in the ${ord(sn.house)} house` : ""} gave you ${mastery?.holds} without requiring you to develop it. ${sn.house ? `Placed in the ${ord(sn.house)} house, it means ${MONEY_HOUSE[sn.house]?.of} is territory you can operate in without effort.` : ""} People spend decades trying to acquire this. You had it at twenty.`
  ));

  out.push(sub("The lesson that keeps repeating"));
  out.push(p(
    `${cap(mastery?.retreat ?? "You retreat to what you already know")}. Because you are genuinely excellent there, the retreat looks like good judgement from the inside, which is precisely what makes it repeat. ${mastery?.cost ? cap(mastery.cost) + "." : ""}`
  ));
  out.push(howlist([
    "You build something, it starts working, and you replace it with something more interesting",
    "You reach the point where the current thing would compound, and something more urgent appears",
    "You take the familiar option in a moment of pressure and justify it convincingly afterwards",
    "The same conversation about your rates happens every eighteen months and resolves the same way",
  ]));

  out.push(sub("Why it repeats rather than resolving"));
  const moonNode = facts.aspects.find((a) => (a.a === "moon" && a.b.includes("node")) || (a.b === "moon" && a.a.includes("node")));
  out.push(p(
    moonNode
      ? `Your Moon makes a ${moonNode.type} to the nodal axis at ${moonNode.orb.toFixed(1)} degrees, which is the mechanism. Your emotional nature actively resists the resolution, so the correct direction feels flat and the retreat feels like relief. Every repetition was a moment where you trusted the feeling over the direction, which is a reasonable thing to do and is why this is a lifelong lesson rather than a task.`
      : `It repeats because competence is comfortable and the growth direction is not, and under any real pressure the nervous system reaches for what it knows works.`
  ));

  out.push(sub("What the lesson is actually asking for"));
  out.push(p(
    `That you let something be finished. Take one piece of work you have already done well, keep offering it unchanged, and let it accumulate reputation and revenue while you rest. ${nn ? `Your north node in ${nn.sign} is asking for ${NODE_BUILD[nn.sign]?.build}, and the first requirement of that is staying still long enough for it to exist.` : ""}`
  ));
  out.push(table(["The repeating move", "What it costs", "The alternative"], [
    ["Rebuilding what already worked", "The compounding never starts", "Run the existing version unchanged for twelve months"],
    ["Going deeper when asked to go steadier", "Income tracks your energy instead of accumulating", "Harvest before you build again"],
    ["Retreating to mastery under pressure", "The growth edge never gets past week three", "Name the retreat as it happens and stay one more week"],
  ]));
  out.push(pull("Let one thing be finished, and let it pay you for years."));
  out.push(tool("Journal",
    "What are you rebuilding that you could simply repeat?",
    "What would compound if you left it entirely alone for three years?",
    "What does boredom mean to you, and has it ever been reliable?"
  ));
  out.push(...depthLayers("expansion", { scenes: false, chain: true, healed: false, practices: 3 }));
  out.push(action("Identify the piece of work you keep rebuilding, and commit to offering the existing version unchanged for the next twelve months."));
  return compact(out);
};

const power: Writer = ({ facts, seed }) => {
  const plu = place(facts, "pluto");
  if (!plu) return [];
  const ph = plu.house ? PLUTO_HOUSE_POWER[plu.house] : null;
  const dignified = plu.sign === "Scorpio";
  const hd = facts.humanDesign;
  const out: Array<Block | null> = [];

  out.push(p(
    `Power is the most avoided subject in money work, and the most decisive. It decides whether you can hold a price under pressure, whether you can be the authority in a room without apologising for it, and whether resources move toward you or away. Your chart has a specific answer.`
  ));

  out.push(sub("Where your power actually lives"));
  out.push(p(
    `Pluto sits in ${plu.sign}${plu.house ? ` in your ${ord(plu.house)} house` : ""}${dignified ? ", the sign it rules, which means it operates at full strength with nothing diluting it" : ""}. ${ph ? `Your arena is ${ph.arena}.` : ""} This is where you have genuine force available, and it is also the area where you have most likely experienced powerlessness at some point, because Pluto marks both.`
  ));

  const pluAspects = facts.aspects.filter((a) => a.a === "pluto" || a.b === "pluto").sort((a, b) => a.orb - b.orb);
  if (pluAspects.length) {
    out.push(sub("How it connects to the rest of you"));
    out.push(howlist(pluAspects.slice(0, 4).map((a) => {
      const other = a.a === "pluto" ? a.b : a.a;
      return `${bodyName(other)} ${a.type} at ${a.orb.toFixed(1)}°: ${a.hard
        ? `your power and ${MONEY_BODY[other]?.governs} fight for the same ground, which produces the intensity people notice in you.`
        : `your power has easy access to ${MONEY_BODY[other]?.governs}, so when you decide to move on something you can move with unusual force.`}`;
    })));
  }

  out.push(sub("What it looks like immature"));
  out.push(p(ph ? `${cap(ph.immature)}. This is the version that costs money, because it keeps everything at the size one guarded person can hold.` : ""));
  out.push(howlist([
    "You keep the real numbers to yourself, including from people who could help",
    "You would rather do it all than delegate and lose oversight",
    "Your reaction to being financially directed is out of proportion and feels entirely justified in the moment",
    "You rebuild alone rather than ask, and privately count that as a virtue",
  ]));

  out.push(sub("What it looks like mature"));
  out.push(p(ph ? `${cap(ph.mature)}. That is the version that gets paid, because visible authority is purchasable and hidden authority is not.` : ""));
  out.push(p(
    `The distinction is not how much power you hold. It is whether you hold it in the open. Pluto grows through circulation and stagnates when hoarded, which means the grip that feels like protection is the same grip capping the growth. ${dignified ? "With Pluto in its own sign you have more of this to work with than most people, so the difference between the two versions is correspondingly larger." : ""}`
  ));

  if (hd?.incarnationCross?.gates?.length) {
    const g = hd.incarnationCross.gates;
    const money = g.find((x) => [21, 45, 54, 26, 44].includes(x));
    if (money) {
      out.push(sub("Your design agrees"));
      out.push(p(`${gateNote(money)} When astrology and Human Design point at the same territory independently, that is the part of the chart worth organising a business around.`));
    }
  }

  out.push(sub("Your regeneration capacity"));
  out.push(p(
    `Pluto also gives you the ability to lose things and rebuild, and you have probably already done it at least once. That capacity is worth naming because it changes what risk means for you: your floor is genuinely higher than most people's, so bets that would be reckless for somebody else are merely uncomfortable for you. Most people with your placement under-use this and stay far more cautious than their actual resilience warrants.`
  ));

  out.push(table(["Situation", "The immature move", "The mature move"], [
    ["A client tries to renegotiate late", "Concede or go cold", "Restate the terms once, calmly, and hold"],
    ["Somebody offers investment or partnership", "Refuse to avoid shared control", "Take it with authority clearly defined in writing"],
    ["You are asked about your income", "Deflect", "Answer plainly to the people who have earned it"],
    ["A financial setback lands", "Handle it entirely alone", "Use the regeneration, and let one person see the numbers"],
  ]));
  out.push(tool("Journal",
    "Who held the power over money when you were young, and what did you decide about it?",
    "What are you holding privately that would grow faster if it were visible?",
    "Where does your authority tip over into secrecy?"
  ));
  out.push(...depthLayers("power", { scenes: true, chain: true, healed: true, practices: 3 }));
  out.push(...depthLayers("control", { scenes: false, chain: false, healed: false, practices: 2 }));
  out.push(action("Take one financial matter you have handled entirely alone and bring one other person into it this week, without giving up your authority over it."));
  return compact(out);
};

// ============================================================ PART FIVE: how you earn

const earningDesign: Writer = ({ facts }) => {
  const hd = facts.humanDesign;
  const second = house(facts, 2);
  const out: Array<Block | null> = [];
  if (hd) {
    const t = HD_TYPE_MONEY[hd.type];
    if (t) {
      out.push(p(
        `Your earning rhythm is ${t.rhythm}, and it is the most misunderstood thing about you, including by you. You earn through ${t.earns}. You lose through ${t.costly}.`
      ));
      out.push(sub("The step you will be tempted to skip"));
      out.push(p(`Your strategy is to ${t.strategy}. ${strategyWhy(hd.type)}`));
    }
  }
  if (second?.rulerHouse) {
    out.push(sub("Your money mechanism, in one line"));
    out.push(p(
      `Your income is generated through ${MONEY_HOUSE[second.rulerHouse]?.channel}, because that is where the ruler of your second house actually sits. Everything else in this part is a variation on that sentence.`
    ));
  }
  const t = hd ? HD_TYPE_MONEY[hd.type] : null;
  if (t) {
    out.push(table(["Works with your design", "Works against it"], [
      [cap(t.rhythm), "The same output every day at even intensity"],
      [cap(t.strategy), "Moving without telling anybody first"],
      [second?.rulerHouse ? `Selling into ${MONEY_HOUSE[second.rulerHouse]?.channel}` : "Selling where your chart is loaded", "Cold reach into territory your chart does not occupy"],
      ["Real rest between bursts", "Treating rest as something to be earned"],
    ]));
  }
  if (hd) {
    out.push(sub("What your working week should actually look like"));
    out.push(p(weekShape(hd)));
    out.push(sub("What your working year should look like"));
    out.push(p(yearShape(hd)));
  }
  out.push(sub("The three things to stop doing"));
  out.push(howlist(stopDoing(facts)));
  out.push(...depthLayers("sustainability", { scenes: true, chain: true, healed: true, practices: 3 }));
  out.push(action("Tell your people about something you are planning before it is ready, and notice how differently it lands when they were informed first."));
  return compact(out);
};

function weekShape(hd: NonNullable<MoneyChartFacts["humanDesign"]>): string {
  const map: Record<string, string> = {
    Manifestor: "Two or three genuinely productive working days, with the rest given to rest, thinking and informing. Trying to fill five days at the same intensity is what produces the crash, and the crash costs you more than the extra days earned.",
    Generator: "Full working days are available to you provided the work is satisfying. The signal to watch is frustration, which means you are doing something you were never actually asked for.",
    "Manifesting Generator": "Fast, multi-track days with abrupt switches, and permission to abandon what has gone dead. Forcing linear completion is what exhausts you.",
    Projector: "Three to four hours of genuinely focused work, and the rest given to study, rest and being visible so invitations can find you. A full day of output is a Generator's shape and it will make you bitter.",
    Reflector: "Your capacity changes across the month, so the week is the wrong unit. Plan in lunar cycles and expect roughly one strong week in four.",
  };
  return map[hd.type] ?? "";
}

function yearShape(hd: NonNullable<MoneyChartFacts["humanDesign"]>): string {
  const map: Record<string, string> = {
    Manifestor: "Two or three significant initiations a year, each announced well in advance, with real fallow periods between them. Your income arrives in steps rather than a slope, and building for a slope is what breaks the model.",
    Generator: "A steady year with one or two larger builds, responding to what comes rather than forcing a calendar.",
    "Manifesting Generator": "Several launches, some abandoned mid-flight, which is correct rather than a failure. Budget for the ones you drop.",
    Projector: "One or two well-recognised engagements a year rather than a full book. Your rate has to carry the gaps, which means it has to be high.",
    Reflector: "An annual rhythm rather than a quarterly one. Judge the year at its end, never in the middle.",
  };
  return map[hd.type] ?? "";
}

function stopDoing(f: MoneyChartFacts): string[] {
  const out: string[] = [];
  const hd = f.humanDesign;
  if (hd?.openCenters?.includes("sacral")) out.push("Measuring your week by hours worked. Your energy is not the kind that produces a consistent number, and the measurement itself creates the guilt.");
  if (hd?.type === "Manifestor") out.push("Launching without telling anybody first. The resistance you keep meeting is a missing sentence rather than a wrong idea.");
  if (hd?.openCenters?.includes("heart")) out.push("Making willpower promises to yourself about money. They break, and you read the breakage as a character flaw rather than a design mismatch.");
  const second = f.houses[2];
  if (second?.rulerHouse && ![1, 2].includes(second.rulerHouse)) out.push(`Trying to earn directly and alone. Your income ruler sits in the ${ord(second.rulerHouse)}, which means the money comes through ${MONEY_HOUSE[second.rulerHouse]?.channel} rather than through your own unaided effort.`);
  out.push("Building offers in houses your chart does not occupy, however sensible they look on somebody else's business plan.");
  return out.slice(0, 4);
}

function strategyWhy(type: string): string {
  const map: Record<string, string> = {
    Manifestor: "Informing matters because your energy is closed and impactful, so people who are not told feel steamrolled and resist. Told in advance, they move out of the way and often help. The resistance you have met was almost always a missing sentence rather than a wrong direction.",
    Generator: "Waiting to respond matters because your gut only answers to something real. Initiating from the mind puts you into work nobody actually asked for, and that is where the frustration comes from.",
    "Manifesting Generator": "You respond first and inform second, and skipping the informing is what creates the friction you keep running into after you have already changed direction.",
    Projector: "The invitation matters because your gift is seeing other people clearly, and unrecognised guidance is experienced as interference no matter how correct it is.",
    Reflector: "The lunar cycle matters because your clarity genuinely changes across the month, and a decision made on the wrong day is somebody else's decision wearing your voice.",
  };
  return map[type] ?? "";
}

const businessModels: Writer = ({ facts }) => {
  const out: Array<Block | null> = [];
  const items: Array<{ h: string; p: string }> = [];
  const hd = facts.humanDesign;

  const loaded = Object.values(facts.houses).filter((h) => h.occupants.length >= 2).sort((a, b) => b.occupants.length - a.occupants.length);
  for (const h of loaded.slice(0, 3)) {
    items.push({ h: modelForHouse(h.house).title, p: `${modelForHouse(h.house).why} Your ${ord(h.house)} house carries ${h.occupants.length} bodies, which is where your chart is actually loaded.` });
  }
  const second = house(facts, 2);
  if (second?.rulerHouse) {
    const m = modelForHouse(second.rulerHouse);
    items.push({ h: m.title, p: `${m.why} This is where the ruler of your income house landed, which makes it the mechanism rather than a preference.` });
  }
  if (hd?.openCenters?.includes("sacral")) {
    items.push({ h: "Recurring revenue", p: "With an undefined sacral you need income that pays you between bursts rather than only during them. This is the structural fix for your energy rather than a growth tactic." });
  }
  if (hd?.definedCenters?.includes("throat")) {
    items.push({ h: "Speaking and audio", p: "A defined throat is built to speak things into existence. Any model that keeps you silent behind the scenes underuses the most defined thing about you." });
  }
  out.push(cards(items.slice(0, 6)));

  out.push(sub("The model to avoid"));
  out.push(p(
    `Anything that requires consistent daily output at even intensity, sold to a cold audience, in territory your chart does not occupy. It asks your energy to behave in a way it was not built for and it sells where you have no planets. It is also, unfortunately, the model most business advice recommends.`
  ));
  out.push(sub("The combination that is strongest for you"));
  out.push(p(
    `${loaded.length >= 2 ? `Something that uses your ${ord(loaded[0].house)} and ${ord(loaded[1].house)} houses at the same time` : "Something built directly on your loaded house"}, sold into ${second?.rulerHouse ? MONEY_HOUSE[second.rulerHouse]?.channel : "your strongest channel"}, at a rhythm your energy can actually sustain. That structure uses every strong part of your chart at once, and it is the only shape that does.`
  ));
  out.push(action("Take your current offers and mark which houses each one uses. Anything using none of your loaded houses is a candidate for retirement."));
  return compact(out);
};

function modelForHouse(h: number): { title: string; why: string } {
  const map: Record<number, { title: string; why: string }> = {
    1: { title: "Personal brand", why: "Money arrives through you being the visible face of it." },
    2: { title: "Direct product sales", why: "You earn most simply, by making something and selling it yourself." },
    3: { title: "Writing, teaching and content", why: "Your money is made through words, in volume, regularly." },
    4: { title: "Property, home or family business", why: "Money is tied to foundations and to what you build to last." },
    5: { title: "Creative work and calculated risk", why: "You are paid for what you make for the joy of making it." },
    6: { title: "Service and craft", why: "You are paid for reliable, skilled, daily delivery." },
    7: { title: "One-to-one and partnership", why: "Money arrives through named individuals and formal agreements." },
    8: { title: "High-ticket transformational work", why: "You are paid out of other people's resources for going where they cannot go alone." },
    9: { title: "Teaching, publishing and programmes", why: "You are paid to carry people toward a bigger picture." },
    10: { title: "Reputation-led consulting", why: "Money follows your public standing, usually in that order." },
    11: { title: "Community, membership and audience", why: "The group is the asset, and income arrives through the room you built." },
    12: { title: "Behind-the-scenes or retreat work", why: "You are paid for the quiet, unseen processing others depend on." },
  };
  return map[h] ?? { title: "Direct earning", why: "" };
}

const incomeStreams: Writer = ({ facts }) => {
  const out: Array<Block | null> = [];
  const rows: string[][] = [];
  const loaded = Object.values(facts.houses).filter((h) => h.occupants.length >= 1).sort((a, b) => b.occupants.length - a.occupants.length);
  for (const h of loaded.slice(0, 5)) {
    const m = modelForHouse(h.house);
    rows.push([m.title, `${h.occupants.length} ${h.occupants.length > 1 ? "bodies" : "body"} in your ${ord(h.house)} house`, h.occupants.length >= 3 ? "Strongest" : h.occupants.length === 2 ? "Very strong" : "Strong"]);
  }
  const pof = place(facts, "part_of_fortune");
  if (pof?.house) rows.push([modelForHouse(pof.house).title, `Part of Fortune in your ${ord(pof.house)} house, where ease and fortune meet`, "Underused"]);
  rows.push(["Low-ticket, high-volume digital", "Uses none of your loaded houses and needs cold traffic", "Weakest"]);

  out.push(p("Ranked by what your chart actually supports rather than by what is fashionable."));
  out.push(table(["Stream", "Why your chart supports it", "Strength"], rows));

  if (pof?.house) {
    out.push(sub("The stream you are almost certainly underselling"));
    out.push(p(
      `Your Part of Fortune sits in ${pof.sign} in your ${ord(pof.house)} house, which marks where ease and fortune meet. ${cap(MONEY_HOUSE[pof.house]?.money ?? "")}. Whatever turns that territory into something that keeps paying, rather than into free material supporting the paid thing, is your chart's most obvious unexploited instruction.`
    ));
  }
  out.push(sub("The one to build next"));
  out.push(p(
    `Add the stream that pays you while you rest. Anything that only pays while you are actively producing will eventually be capped by your energy rather than by demand, and that ceiling arrives sooner than people expect.`
  ));
  out.push(action("Choose one thing you have already given away and turn it into something that can be sold or that renews."));
  return compact(out);
};

const pricing: Writer = ({ facts, seed, shadows }) => {
  const out: Array<Block | null> = [];
  const hd = facts.humanDesign;
  const drivers: string[] = [];
  const ven = place(facts, "venus");
  const venHard = facts.aspects.find((a) => (a.a === "venus" || a.b === "venus") && a.hard);
  if (venHard) drivers.push(`${bodyName(venHard.a)} ${venHard.type} ${bodyName(venHard.b)} lowers the number as it leaves your mouth`);
  if (hd?.openCenters?.includes("heart")) drivers.push("your open Heart centre means the worth you would price from keeps moving");
  if (hd?.openCenters?.includes("solarplexus")) drivers.push("your open Solar Plexus means you feel the client's reaction as though it were your own");
  if ((facts.houses[2]?.occupants.length ?? 0) === 0) drivers.push("your empty second house gives your self-worth no fixed home of its own");

  out.push(p(
    drivers.length
      ? `Everything in this report converges here, because pricing is the exact point where several parts of your chart meet at once. ${cap(list(drivers))}. All of them fire within about four seconds of you saying a figure.`
      : `Pricing is where your chart's relationship with worth becomes literal and measurable.`
  ));

  out.push(sub("Your pricing rules, derived from your design"));
  out.push(steps([
    ["Decide prices in writing, alone, in advance", "Your worth has no fixed home in either system, so the document is your ballast. Never generate a number live."],
    ["Say the number and stop", "The softening sentence after the number is where the money leaks. Silence belongs to the client."],
    ["Never decide terms in the room", hd?.openCenters?.includes("solarplexus") ? "Your open Solar Plexus makes in-room decisions unreliable. A night's gap is a structural requirement." : "A gap between the conversation and the commitment protects the number."],
    ["Price the transformation", "Set the figure against what changes for the client rather than against the hours it happened to take."],
    ["Charge most for what feels easiest", "Ease is the evidence of mastery in your chart, and it is systematically underpriced."],
  ]));

  out.push(sub("Your pricing profile"));
  out.push(p(pricingProfile(facts)));
  out.push(pull("The number your chart supports is higher than the number you feel."));
  out.push(action("Write your rate card properly, once, and hold it through three conversations without adjusting a single figure."));
  return compact(out);
};

function pricingProfile(f: MoneyChartFacts): string {
  const sun = f.placements.sun?.sign;
  const venHard = f.aspects.some((a) => (a.a === "venus" || a.b === "venus") && a.hard);
  const openHeart = f.humanDesign?.openCenters?.includes("heart");
  if (venHard && openHeart) return "You are a fairness pricer with a depth discount. You set the number so the exchange feels balanced to the other person, then discount whatever came naturally to you, which is precisely your most valuable work. The result is rates that are fair to the client, generous in practice, and consistently below what the market would bear.";
  if (venHard) return "You price carefully and then correct downward. The correcting voice sounds like fairness and behaves like a discount, and it fires after the number rather than before it, which is why writing prices down in advance works so much better than deciding them live.";
  if (openHeart) return "You price from a sense of worth that moves with the room, so the same work gets quoted differently depending on who you spoke to last. Structure fixes this completely, and nothing else does.";
  return "You price from a reasonably stable sense of value, and the risk in your chart is less about the number and more about what you agree to include after the number has been agreed.";
}

const visibility: Writer = ({ facts }) => {
  const out: Array<Block | null> = [];
  const ruler = facts.chartRuler;
  const tenth = house(facts, 10);
  const lil = place(facts, "lilith");

  if (ruler?.house) {
    out.push(p(
      `Your chart ruler ${bodyName(ruler.planet)} sits in your ${ord(ruler.house)} house, which is where your identity is routed. ${ruler.house === 10 ? "Placed in the house of public reputation, that is about as clear an instruction to be visibly yourself as astrology offers." : `That means being seen in the territory of ${MONEY_HOUSE[ruler.house]?.of} is where your presence does the most work.`}`
    ));
  }
  if (tenth) {
    out.push(p(
      `Your tenth house of career sits in ${tenth.sign}, so your public reputation is built through ${MONEY_SIGN[tenth.sign]?.earns}${tenth.rulerHouse ? `, and its ruler in your ${ord(tenth.rulerHouse)} house means the reputation actually converts through ${MONEY_HOUSE[tenth.rulerHouse]?.channel}` : ""}.`
    ));
  }
  if (lil) {
    const lilHard = facts.aspects.filter((a) => (a.a === "lilith" || a.b === "lilith") && a.hard);
    out.push(sub("The block"));
    out.push(p(
      `Lilith in ${lil.sign}${lil.house ? ` in your ${ord(lil.house)} house` : ""}${lilHard.length ? ` carries ${lilHard.length} hard aspect${lilHard.length > 1 ? "s" : ""}` : ""}, which means expansion triggers the old shame about being too much. Visibility grows, the shame activates, and you soften or withdraw${lilHard.some((a) => a.a === "mercury" || a.b === "mercury") ? ", usually at the level of language, where the raw sentence gets replaced by the diplomatic one on the way out" : ""}.`
    ));
  }
  out.push(sub("What actually works for your chart"));
  out.push(howlist([
    "Publishing the direct version rather than the diplomatic one, consistently",
    tenth ? `Being known for a position rather than a service, because ${tenth.sign} in the tenth does badly when it hedges` : "Being known for a position rather than a service",
    facts.humanDesign?.definedCenters?.includes("throat") ? "Using your voice rather than only text, because your throat is defined" : "Choosing one channel and staying in it long enough to compound",
    "Announcing before you launch, which doubles as marketing",
    "Staying visible through the fortnight after growth, when the withdrawal urge arrives",
  ]));
  out.push(...depthLayers("visibility", { scenes: true, chain: true, healed: true, practices: 3 }));
  out.push(action("Publish the version you would normally soften, and leave it up through the discomfort that follows."));
  return compact(out);
};

const salesStyle: Writer = ({ facts }) => {
  const hd = facts.humanDesign;
  const out: Array<Block | null> = [];
  if (hd) {
    const t = HD_TYPE_MONEY[hd.type];
    out.push(p(`Your selling method is written into your design and it is unusually simple: ${t?.strategy}. ${strategyWhy(hd.type)}`));
    if (hd.profile && HD_PROFILE_MONEY[hd.profile]) {
      out.push(p(`Your ${hd.profile} profile sells ${HD_PROFILE_MONEY[hd.profile].sells}. That is the channel, and working against it is why cold approaches have always felt like pushing a door that opens the other way.`));
    }
  }
  const merc = place(facts, "mercury");
  if (merc) {
    out.push(sub("Your actual sales gift"));
    out.push(p(
      `Mercury in ${merc.sign}${merc.house ? ` in your ${ord(merc.house)} house` : ""} means you can name somebody's real problem, the one underneath the one they described, in language that lands. That is the whole skill of high-value selling, and it means your selling does not need persuasion. It needs you to say the true thing about their situation and then say your price.`
    ));
  }
  out.push(sub("What to watch"));
  out.push(howlist([
    hd?.openCenters?.includes("solarplexus") ? "Your open Solar Plexus absorbs their hesitation, so decide nothing during the call" : "Decide nothing during the call",
    "Write your terms before warmth arrives, because warmth is when they get renegotiated",
    hd?.authority ? `Your ${hd.authorityLabel} already knows within seconds whether this is your client` : "Your body knows quickly whether this is your client",
  ]));
  out.push(...depthLayers("legitimacy", { scenes: true, chain: false, healed: true, practices: 2 }));
  out.push(action("Announce something you are planning at least two weeks before you sell it, and let the informing do the work."));
  return compact(out);
};

const moneyManagement: Writer = ({ facts }) => {
  const ven = place(facts, "venus");
  const second = house(facts, 2);
  const out: Array<Block | null> = [];
  out.push(cards([
    { h: "How you spend", p: ven ? `Venus in ${ven.sign} spends ${spendStyle(ven.sign)}` : "You spend according to what feels defensible rather than what you want." },
    { h: "How you save", p: second?.rulerSign ? `Your income ruler in ${second.rulerSign} saves ${saveStyle(second.rulerSign)}` : "Saving follows your mood more than your plan." },
    { h: "How you invest", p: (facts.houses[8]?.occupants.length ?? 0) >= 2 ? "Your loaded eighth house gives you real capacity here, and it is almost certainly underused because caution has been louder than appetite." : "Investment works best for you when it is boring, automated and out of sight." },
    { h: "Your blind spot", p: blindSpot(facts) },
  ]));
  out.push(sub("The pattern worth naming"));
  out.push(p(
    `${facts.balance.dominantModality === "fixed" ? "Your chart is built to accumulate and to hold." : "Your chart is built to move money rather than store it."} ${facts.balance.dominantModality === "fixed" ? "Which means your constraint has never been discipline. Your constraint is that not enough comes in, and that traces back to pricing rather than to spending." : "Which means the discipline has to be structural rather than willed: automate it before it reaches your hands."}`
  ));
  out.push(sub("Your financial plan, in one line"));
  out.push(p(
    `${facts.balance.dominantModality === "fixed" || facts.placements.saturn?.house === 2
      ? "Raise what comes in, because the holding side is already handled. Your chart accumulates well and your constraint has never been discipline."
      : "Automate the holding side, because your chart is better at generating than at retaining. What reaches your current account gets spent, so it should not all reach it."}`
  ));
  out.push(sub("What to automate and what to decide"));
  out.push(table(["Automate", "Decide deliberately"], [
    ["A fixed percentage moved on the day money lands", "Anything above your normal rate, which needs a night before you agree"],
    ["Tax set aside at source", "Investments, which should be boring and infrequent"],
    ["Recurring costs reviewed once a quarter", "New commitments, which your chart tends to accept too fast"],
  ]));
  out.push(sub("Your relationship with debt and leverage"));
  out.push(p(
    `${(facts.houses[8]?.occupants.length ?? 0) >= 2
      ? "Your eighth house is loaded, which means other people's money is genuinely your territory. That cuts both ways: you can handle leverage more capably than most, and you also carry inherited caution about it that is worth examining rather than obeying."
      : "Your chart handles borrowing practically rather than emotionally, so the risk is under-thinking leverage rather than fearing it."}`
  ));
  out.push(sub("The one habit worth building"));
  out.push(p(
    `${facts.humanDesign?.openCenters?.includes("solarplexus")
      ? "A twenty-four hour rule on every financial decision. With an open Solar Plexus you cannot reliably separate your feelings from the room's while you are still in it, and this single habit will protect more money than any budgeting system."
      : "A monthly hour with your actual numbers, out loud, with one other person. Money loses its charge when it stops being private."}`
  ));
  out.push(...depthLayers("safety", { scenes: true, chain: true, healed: true, practices: 3 }));
  out.push(action("Spend money on one thing this week that is purely for your own pleasure, at a level that feels slightly extravagant, and do not justify it."));
  return compact(out);
};

function spendStyle(sign: string): string {
  const map: Record<string, string> = {
    Aries: "fast and decisively, and regrets it rarely enough to keep doing it.", Taurus: "rarely and deeply, on quality that holds its value.",
    Gemini: "in many small amounts that are hard to track afterwards.", Cancer: "on home, security and the people you love before yourself.",
    Leo: "generously and visibly, particularly on other people.", Virgo: "carefully, with research, and then feels guilty anyway.",
    Libra: "on beauty and on other people, and struggles to choose between two good options.", Scorpio: "rarely, deeply, and privately.",
    Sagittarius: "expansively, on experience rather than objects.", Capricorn: "reluctantly, on things that will still be useful in ten years.",
    Aquarius: "unpredictably, on the unusual rather than the expected.", Pisces: "impulsively and compassionately, often on other people.",
  };
  return map[sign] ?? "according to what feels right at the time.";
}

function saveStyle(sign: string): string {
  const map: Record<string, string> = {
    Aries: "in bursts, when motivated.", Taurus: "steadily and instinctively, which is a genuine advantage.",
    Gemini: "in several places at once.", Cancer: "protectively, with a cushion larger than you need.",
    Leo: "when there is something worth saving for.", Virgo: "systematically, with spreadsheets.",
    Libra: "when a plan has been agreed with somebody.", Scorpio: "privately, and more than anybody knows.",
    Sagittarius: "sporadically, because the future feels abundant.", Capricorn: "with real long-range discipline, better than almost anybody.",
    Aquarius: "unconventionally, often outside standard products.", Pisces: "with difficulty, unless it is automated out of sight.",
  };
  return map[sign] ?? "when it is made automatic.";
}

function blindSpot(f: MoneyChartFacts): string {
  const nepAspect = f.aspects.find((a) => (a.a === "neptune" || a.b === "neptune") && a.orb < 3);
  if (nepAspect) {
    const other = nepAspect.a === "neptune" ? nepAspect.b : nepAspect.a;
    return `Neptune sits close to your ${bodyName(other)} at ${nepAspect.orb.toFixed(1)} degrees, which blurs the edges exactly where ${MONEY_BODY[other]?.governs} needs them firm. The leak is generosity rather than extravagance.`;
  }
  if (f.humanDesign?.openCenters?.includes("solarplexus")) return "Your open Solar Plexus means money decisions made in an emotional room rarely survive the next morning.";
  return "The leak is in what you agree to include after the price has been agreed.";
}

// ============================================================ PART SIX: timing

const currentSeason: Writer = ({ facts, timing }) => {
  const out: Array<Block | null> = [];
  const prof = timing?.profection as { house: number; sign?: string; ruler?: string; rulerSign?: string; rulerHouse?: number; age?: number } | undefined;
  const transits = timing?.transits as Array<{ planet: string; sign: string; house: number; note: string }> | undefined;

  if (prof) {
    const h = MONEY_HOUSE[prof.house];
    out.push(p(
      `You are in a ${ord(prof.house)} house profection year${prof.age !== undefined ? `, which began at ${prof.age}` : ""}, so the year's theme is ${h?.of}. ${prof.ruler ? `Its ruler ${bodyName(prof.ruler)}${prof.rulerSign ? ` in ${prof.rulerSign}` : ""}${prof.rulerHouse ? ` in your ${ord(prof.rulerHouse)} house` : ""} is the time lord for the year, which means that planet's condition colours everything financial for these twelve months.` : ""}`
    ));
  }

  if (transits?.length) {
    for (const t of transits.slice(0, 3)) {
      out.push(sub(`${bodyName(t.planet)} through your ${ord(t.house)} house`));
      out.push(p(t.note));
    }
  } else {
    out.push(p("Your slow-planet transits are computed at generation time from your natal houses, and the report names only what is genuinely crossing your chart in this window."));
  }

  if (prof) {
    out.push(sub("What a profection year actually changes"));
    out.push(p(
      `A profection year moves the emphasis of your chart for twelve months without altering anything natally. The house it lands on becomes the year's subject, and that house's ruler becomes the year's decision-maker. In practice this means the planet named above is worth watching: where it sits natally, what it aspects, and what it is doing by transit will describe the texture of your money year more accurately than any general forecast.`
    ));
    out.push(table(["This year", "The practical instruction"], [
      [`${ord(prof.house)} house emphasis`, `Put your attention on ${MONEY_HOUSE[prof.house]?.of}. Progress here compounds; progress elsewhere is harder work than usual.`],
      [prof.ruler ? `Year ruler: ${bodyName(prof.ruler)}` : "Year ruler", prof.rulerHouse ? `Its condition colours the year, and it operates from your ${ord(prof.rulerHouse)} house of ${MONEY_HOUSE[prof.rulerHouse]?.of}.` : "Its natal condition colours the whole year."],
      ["Next birthday", "The emphasis moves one house forward, so anything you want to establish in this territory should be set up before then."],
    ]));
  }
  out.push(action("Set your rates and structures properly now, in writing, while the current transit is making decisions stick.", "This season's instruction"));
  return compact(out);
};

const yearsAhead: Writer = ({ facts, timing }) => {
  const out: Array<Block | null> = [];
  const returns = timing?.returns as Array<{ label: string; when: string; meaning: string }> | undefined;
  out.push(p(
    "These cycles are fixed by your birth chart and therefore knowable in advance, which makes them the ones worth planning around. Precise dated transits sit outside this section because they move; these do not."
  ));
  if (returns?.length) {
    out.push(table(["Cycle", "Roughly when", "What it asks of your money"], returns.map((r) => [r.label, r.when, r.meaning])));
  }
  out.push(sub("The shape of it"));
  out.push(p(shapeOfYears(facts)));
  out.push(sub("How to use a cycle rather than wait for it"));
  out.push(table(["Cycle type", "What it is good for", "What it is bad for"], [
    ["Saturn contact", "Restructuring, pricing, contracts, anything you want permanent", "Launching something that needs momentum and optimism"],
    ["Jupiter contact", "Launching, expanding, raising rates, saying yes", "Consolidating, or assuming the window stays open"],
    ["Uranus contact", "Changing the model, going independent, doing it your way", "Anything requiring stability or a five-year forecast"],
    ["Pluto contact", "Rebuilding from the foundations, ending what is finished", "Rushing. This one takes years and cannot be hurried"],
  ]));
  out.push(sub("Planning against your own cycles"));
  out.push(p(
    `The practical use of this page is negative rather than positive: it tells you when not to expect a particular kind of result. A consolidation year judged as a failed expansion year produces a decision to abandon something that was working. Most of the financial damage people do to themselves comes from measuring one phase by the standards of another.`
  ));
  out.push(action("Choose one thing you will still be building in ten years, and put the first real hour into it."));
  return compact(out);
};

function shapeOfYears(f: MoneyChartFacts): string {
  const satHard = f.aspects.some((a) => (a.a === "saturn" || a.b === "saturn") && a.hard);
  return satHard
    ? "Your chart has a clear long arc, and it favours the second half. Saturn placements ripen in reverse, which means the area that has cost you most so far becomes your steadiest authority later, and the work you do now compounds into exactly that. The honest instruction is patience, because your biggest money years are structurally located ahead of you rather than behind."
    : "Your chart builds in cycles rather than in one long climb, so the instruction is to notice which phase you are in and stop treating a consolidation year as a failed expansion year.";
}

const risks: Writer = ({ facts, shadows }) => {
  const out: Array<Block | null> = [];
  const rows: string[][] = [];
  for (const s of (shadows ?? []).slice(0, 4)) {
    const c = themeContent(s.theme);
    rows.push([c.shadow, s.label, c.steps[0][1]]);
  }
  const nep = facts.aspects.find((a) => (a.a === "neptune" || a.b === "neptune") && a.orb < 3);
  if (nep) rows.push(["Boundary blur", `Neptune close to ${bodyName(nep.a === "neptune" ? nep.b : nep.a)} at ${nep.orb.toFixed(1)}°`, "Written terms with the people closest to you, decided before warmth arrives"]);
  if (facts.humanDesign?.openCenters?.includes("sacral")) rows.push(["Burnout that looks like failure", "Undefined sacral", "Rest scheduled as infrastructure rather than earned as reward"]);

  out.push(p("The specific ways this chart loses money, with the guard for each."));
  out.push(table(["Risk", "Where it comes from", "The guard"], rows));
  out.push(sub("The one to watch hardest"));
  out.push(p(rows.length ? `${rows[0][0]}. It sits closest to the part of your chart that is meant to generate income, which means it costs you at the source rather than at the margins.` : ""));
  out.push(sub("Early warning signs"));
  out.push(howlist([
    "You have started explaining your prices again, in more detail than last quarter",
    "There are unbilled hours you have stopped counting",
    "A client relationship has become warm enough that the terms have gone unspoken",
    "You are busy and the income has not moved, which means volume has replaced rate",
    "You are waiting to feel ready before raising something",
  ]));
  out.push(sub("The quarterly check"));
  out.push(p(
    `Once a quarter, sit with three numbers: what you charged, what you actually delivered, and what you gave away unbilled. The third number is the one your chart tends to hide from you, and it is usually large enough to change how you feel about the other two.`
  ));
  out.push(action("Write down your terms for the people closest to you, the ones you would give a stranger, and hold them once this week."));
  return compact(out);
};

// ============================================================ PART SEVEN: the work

const highestTimeline: Writer = ({ facts, seed, shadows }) => {
  const out: Array<Block | null> = [];
  const hd = facts.humanDesign;
  const second = house(facts, 2);
  const loud = loudestHouse(facts);

  out.push(p(
    `${hd ? `She works in ${HD_TYPE_MONEY[hd.type]?.rhythm ?? "her own rhythm"} and she has stopped apologising for it. That is the first thing you would notice, because the version of you reading this still carries a faint guilt about the quiet weeks, and she has none.` : "She has stopped apologising for how she works."}`
  ));
  out.push(p(
    `Her most expensive offer is the thing that costs her the least effort. She spent years pricing the difficult parts highly and giving away the effortless part, until she understood that the effortless part was the rare one.`
  ));
  if (second?.rulerHouse) {
    out.push(p(
      `Her money arrives through ${MONEY_HOUSE[second.rulerHouse]?.channel}, which is what her chart was always pointing at, and it compounds because she stopped trying to earn in territory she has no planets in.`
    ));
  }
  if (loud) {
    out.push(p(
      `She is known for ${MONEY_HOUSE[loud.house]?.of}, publicly and without hedging, and the strange parts she used to soften turn out to be exactly what people were paying for.`
    ));
  }
  out.push(p("She rests without an alarm going off. Her diary has genuine gaps in it, and the gaps are simply the shape of her year rather than recovery from overwork."));
  for (const s of (shadows ?? []).slice(0, 1)) {
    const c = themeContent(s.theme);
    out.push(p(`The most striking thing about her is what she no longer does. ${c.felt.split(",")[0]} stopped being the arrangement some years ago, and the placement that produced it is still exactly where it was in her chart. It simply changed jobs.`));
  }
  out.push(sub("What is different, specifically"));
  out.push(table(["Now", "Her"], timelineContrast(facts, shadows ?? [])));
  out.push(sub("What she kept"));
  out.push(p(
    `None of your placements changed. She has the same chart, the same aspects and the same open centres. What changed is which job each one is doing: the planet that used to edit her prices now guards them, and the sensitivity that used to cost her money now tells her which client to take.`
  ));
  out.push(action("Choose the single behaviour of hers that feels most impossible, and do a small version of it before Sunday."));
  return compact(out);
};

function timelineContrast(f: MoneyChartFacts, shadows: Array<{ theme: string }>): string[][] {
  const rows: string[][] = [];
  for (const s of shadows.slice(0, 3)) {
    const c = THEME_CONTENT_SAFE(s.theme);
    if (c?.cost?.length) rows.push([c.cost[0][0], c.cost[0][1]]);
  }
  rows.push(["Rates decided in the room", "Rates decided once, in writing, and read out"]);
  rows.push(["Rest taken after collapse", "Rest scheduled before the work"]);
  return rows.slice(0, 5);
}

const futureSelfLetter: Writer = ({ facts, shadows }) => {
  const name = facts.name;
  const s0 = shadows?.[0] ? themeContent(shadows[0].theme) : null;
  const second = house(facts, 2);
  const paras = [
    `${name},`,
    `I want to tell you about the invoice. It was one of the first you sent after you finally wrote the rate card, and your hand did that thing it does, and you nearly added the sentence about being flexible. You did not add it. That is genuinely the whole story of how I got here, and I know how small it sounds from where you are sitting.`,
    s0 ? `Here is what I wish you had believed sooner. ${s0.reframe}` : `Here is what I wish you had believed sooner: the work that costs you nothing is the work worth the most.`,
    second?.rulerHouse ? `The money came through ${MONEY_HOUSE[second.rulerHouse]?.channel}, exactly where your chart said it would, and it arrived faster once you stopped trying to make it come from somewhere more respectable.` : `The money came from precisely where your chart said it would, and faster once you stopped arguing with it.`,
    `You let one thing be finished. That was the hard one and it took longer than it needed to, because the simple steady thing felt flat and you were right, it did feel flat. It also compounded. The offer you found boring in your forties paid for most of my fifties.`,
    `You rested. Not immediately and not gracefully, but eventually you stopped treating the quiet weeks as evidence of something wrong. Your body held up because of that, and that decision bought me the years I am writing to you from.`,
    `Say the number. Then stop talking. That is the whole of it.`,
  ];
  return [letter(paras, name)];
};

const theThread: Writer = ({ facts, seed, shadows }) => {
  const out: Array<Block | null> = [];
  const loud = loudestHouse(facts);
  const tight = tightestHard(facts);
  out.push(p(
    `If you take one thing from this report, take this. ${loud ? `Your ${ord(loud.house)} house carries more weight than anywhere else in your chart, which means ${MONEY_HOUSE[loud.house]?.money}.` : ""} ${tight ? `And the tightest hard aspect you carry, ${bodyName(tight.a)} ${tight.type} ${bodyName(tight.b)} at ${tight.orb.toFixed(1)} degrees, sits directly on top of it.` : ""}`
  ));
  out.push(p(
    `Those two facts are the same story told twice. The place your money is meant to come from is the place your oldest protective pattern is standing guard over, which is why the work and the block have always been in the same room, and why clearing the block does more for your income than any new strategy could.`
  ));
  if (shadows?.length) {
    out.push(p(
      `Every shadow in this report is a version of that one sentence. ${list(shadows.slice(0, 3).map((s) => themeContent(s.theme).shadow))} are not four separate problems, they are four angles on one mechanism, and they move together once you start with any of them.`
    ));
  }
  out.push(sub("Reading the whole report as one sentence"));
  out.push(table(["The chapter", "The same thread, said differently"], threadRows(facts, shadows ?? [])));
  out.push(sub("What to do with that"));
  out.push(p(
    `Work the thread rather than the chapters. Any one of the shadows moves the others, because they share a mechanism, and progress in the area your chart is loudest about will show up in sections that appear unrelated. This is why a single change in how you price tends to alter your visibility, your energy and your relationship with rest within about a quarter.`
  ));
  out.push(pull("The block and the gift live in the same house."));
  return compact(out);
};

function threadRows(f: MoneyChartFacts, shadows: Array<{ theme: string }>): string[][] {
  const rows: string[][] = [];
  const loud = Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
  if (loud) rows.push(["Your loudest house", `Your money is meant to come from ${MONEY_HOUSE[loud.house]?.channel}`]);
  for (const s of shadows.slice(0, 3)) {
    const c = THEME_CONTENT_SAFE(s.theme);
    if (c) rows.push([c.shadow, `The same territory, defended rather than occupied`]);
  }
  rows.push(["Receiving", "Whether you can let the thing your chart wants to give you actually arrive"]);
  rows.push(["Purpose", "The direction that resolves the tension rather than managing it"]);
  return rows.slice(0, 6);
}

// derived protocol sections
const journalWriter: Writer = ({ shadows }) => {
  const out: Array<Block | null> = [];
  out.push(p("Grouped by the placement that generated them, so you can go straight to whatever is live this week."));
  for (const s of shadows ?? []) {
    const c = themeContent(s.theme);
    out.push(sub(`On ${s.theme}, from ${s.label}`));
    out.push(howlist(c.journal));
  }
  return compact(out);
};

const UNUSED_eftWriter: Writer = ({ shadows }) => {
  const out: Array<Block | null> = [];
  out.push(p("Tap the side of the hand for each setup line, repeating it three times, then move through the points: eyebrow, side of eye, under eye, under nose, chin, collarbone, under arm, top of head."));
  for (const s of shadows ?? []) {
    const c = themeContent(s.theme);
    out.push(tool(c.shadow, `Setup: ${c.eftSetup}`, `Points: ${c.eftPoints}.`));
  }
  return compact(out);
};

const UNUSED_hypnosisWriter: Writer = ({ shadows, facts }) => {
  const out: Array<Block | null> = [];
  out.push(p(
    `Read each slowly to yourself, or record it in your own voice and play it back${facts.humanDesign?.definedCenters?.includes("throat") ? ", because your throat is defined and your own voice will work better on you than anybody else's" : ""}. Settle first, let the breath slow until it takes care of itself, and let each suggestion repeat three times.`
  ));
  for (const s of shadows ?? []) {
    const c = themeContent(s.theme);
    out.push(tool(`For ${s.theme}`, c.hypnosis));
  }
  return compact(out);
};

const affirmationsWriter: Writer = ({ shadows }) => {
  const out: Array<Block | null> = [];
  out.push(p("Written for your chart rather than for anybody's chart. Say them in your own voice."));
  for (const s of shadows ?? []) {
    const c = themeContent(s.theme);
    out.push(sub(c.shadow));
    out.push(howlist(c.affirmations));
  }
  return compact(out);
};

const ritualsWriter: Writer = ({ facts, shadows }) => {
  const out: Array<Block | null> = [];
  const items: Array<{ h: string; p: string }> = [];
  for (const s of (shadows ?? []).slice(0, 4)) {
    const c = themeContent(s.theme);
    items.push({ h: c.shadow, p: c.somatic });
  }
  items.push({ h: "The overnight rule", p: "No money decision made in the room, ever. The gap is what lets you tell your own feelings from the room's." });
  items.push({ h: "The monthly numbers, out loud", p: "Say your real figures to one other person monthly. Money loses its charge when it stops being secret." });
  out.push(cards(items.slice(0, 6)));
  const moon = place(facts, "moon");
  if (moon) {
    out.push(sub("Your new moon practice"));
    out.push(p(`Your Moon is in ${moon.sign}, so your reset works best ${moonPractice(moon.sign)}`));
    out.push(sub("Your full moon practice"));
    out.push(p("Full moons are for release. Write down what you are still proving and to whom, read it once, and get rid of the paper. Leave the space empty for a day rather than filling it with a new thing to prove."));
  }
  return compact(out);
};

function moonPractice(sign: string): string {
  const map: Record<string, string> = {
    Aquarius: "through detachment and perspective rather than immersion. On the new moon, write the month's money intention as a plain observation in the third person, as though describing somebody else's plan.",
    Taurus: "through the body and the senses. Write the intention, then do something physical and pleasurable to seal it.",
    Scorpio: "in private and in depth. Write it, then keep it entirely to yourself for the cycle.",
    Cancer: "at home, somewhere you feel safe, with something warm to drink and no audience.",
    Leo: "out loud and with some ceremony, because a private ritual will not hold your attention.",
    Virgo: "as a list, specific and actionable, because vagueness will make you dismiss the whole practice.",
    Libra: "with somebody else, or written as a letter to a person, because you process best in relationship.",
    Aries: "quickly and physically, in one sitting, before the enthusiasm passes.",
    Gemini: "in writing, in several short bursts across the day rather than one long session.",
    Sagittarius: "outdoors if possible, and framed as a bigger question rather than a narrow goal.",
    Capricorn: "as a plan with a timeline, because an intention without structure will not survive the month.",
    Pisces: "through imagery rather than words. Draw it, or picture it, and let the language come later.",
  };
  return map[sign] ?? "in whatever form you will actually repeat.";
}

const challengeWriter: Writer = ({ shadows }) => {
  const out: Array<Block | null> = [];
  const list4 = (shadows ?? []).slice(0, 4);
  out.push(p("A week per shadow, in the order your chart makes them easiest to move. Each week has one structural task and one daily practice."));
  list4.forEach((s, i) => {
    const c = themeContent(s.theme);
    out.push(tool(`Week ${i + 1} · ${c.shadow}`, `Task: ${c.challenge}`, `Daily: ${c.somatic}`));
  });
  out.push(sub("On day thirty"));
  out.push(p("Write down what you actually earned this month and compare it with the month before. Then write down which week was hardest, because that is the shadow with the most grip on your income, and it is the one to work with next."));
  out.push(action("Add nothing free to any piece of paid work for the whole thirty days. Not one extra call, not one bonus, not one hour.", "The rule for all thirty days"));
  return compact(out);
};

const bettyLetter: Writer = ({ facts, shadows }) => {
  const loud = loudestHouse(facts);
  const tight = tightestHard(facts);
  const paras = [
    `So here is what I most want you to carry out of all of this. Your chart reads to a great many women like a verdict handed down over them, and I want you to hold yours differently, as something much closer to a set of instructions that happened to be written in a language nobody ever sat you down and taught you to read. The whole point of these pages is that you can read it now.`,
    `The money patterns laid out across this report are the exact places where your own particular kind of power got tangled up with your own particular kind of fear, rather than flaws that need correcting out of you. ${loud ? `${cap(MONEY_HOUSE[loud.house]?.money ?? "")} was always going to be your territory.` : ""} ${tight ? `${bodyName(tight.a)} sitting that close to ${bodyName(tight.b)} was always going to make it hard to charge for.` : ""} Both of those are the same chart, and the second one is what makes you good at the first.`,
    `The slow work of teasing those apart is genuinely the work of a lifetime, which means you are under no obligation to do all of it at once. You are, though, invited to begin, and you begin not by opening a spreadsheet, because we have established between us that a spreadsheet has never once fixed the thing you are actually dealing with. You begin with the one true number you have been avoiding, or the single price you keep apologising your way around, or the one good thing you have been refusing to let yourself keep.`,
    `Pick one.`,
    `The woman standing on the far side of this report, the one who reads her own worth straight off her own chart and holds your gaze while she does it, is already walking toward you. All that is being asked of you now is that you walk far enough to meet her.`,
  ];
  return [letter(paras, "Betty")];
};

// ============================================================ registry

export const WRITERS: Record<string, Writer> = {
  "money-identity": moneyIdentity,
  "loudest-house": loudestHouseWriter,
  "income-mechanism": incomeMechanism,
  "hd-money": hdMoney,
  "open-centres": openCentres,
  "money-gifts": moneyGifts,
  shadow: shadowWriter,
  "childhood-programming": childhood,
  "chiron-money": chironMoney,
  "inherited-beliefs": inheritedBeliefs,
  receiving,
  "nervous-system": nervousSystem,
  purpose,
  "money-karma": moneyKarma,
  power,
  "earning-design": earningDesign,
  "business-models": businessModels,
  "income-streams": incomeStreams,
  pricing,
  visibility,
  "sales-style": salesStyle,
  "money-management": moneyManagement,
  "current-season": currentSeason,
  "years-ahead": yearsAhead,
  risks,
  "highest-timeline": highestTimeline,
  "future-self-letter": futureSelfLetter,
  "the-thread": theThread,
  journal: journalWriter,
  affirmations: affirmationsWriter,
  rituals: ritualsWriter,
  challenge: challengeWriter,
  "betty-letter": bettyLetter,
};

export function hasWriter(id: string): boolean {
  return Boolean(WRITERS[id]);
}
