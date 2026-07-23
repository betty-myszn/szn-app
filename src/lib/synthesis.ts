import type { ChartData } from "@/types/chart";
import { SIGN_TRAITS, SIGN_OVERVIEWS, HOUSE_MEANINGS, ordinalHouse } from "@/lib/interpretations";

export interface SynthesisSection {
  title: string;
  body: string;
  bg?: string;
  light?: boolean;
  href?: string;
}

export interface SynthesisReading {
  slug: string;
  title: string;
  heroLine: string;
  intro: string;
  sections: SynthesisSection[];
}

interface ChartSigns {
  sun: string;
  moon: string;
  rising: string;
  mercury: string;
  venus: string;
  mars: string;
  jupiter: string;
  saturn: string;
  uranus: string;
  neptune: string;
  pluto: string;
  chiron: string;
  northNode: string;
  southNode: string;
  lilith: string;
  fortune: string;
  midheaven: string;
  fortuneHouse: number;
  sunHouse: number;
  venusHouse: number;
  marsHouse: number;
  moonHouse: number;
  chironHouse: number;
  northNodeHouse: number;
  plutoHouse: number;
  lilithHouse: number;
  secondHouseSign: string;
  fifthHouseSign: string;
  seventhHouseSign: string;
  tenthHouseSign: string;
  planetsInSeventh: string[];
  mercuryHouse: number;
  saturnHouse: number;
}

function extractSigns(chart: ChartData): ChartSigns {
  const find = (id: string) => chart.planets.find((p) => p.id === id);
  return {
    sun: find("sun")?.sign || "Leo",
    moon: find("moon")?.sign || "Cancer",
    rising: chart.houses[0]?.sign || "Aries",
    mercury: find("mercury")?.sign || "Gemini",
    venus: find("venus")?.sign || "Libra",
    mars: find("mars")?.sign || "Aries",
    jupiter: find("jupiter")?.sign || "Sagittarius",
    saturn: find("saturn")?.sign || "Capricorn",
    uranus: find("uranus")?.sign || "Aquarius",
    neptune: find("neptune")?.sign || "Pisces",
    pluto: find("pluto")?.sign || "Scorpio",
    chiron: find("chiron")?.sign || "Virgo",
    northNode: find("north_node")?.sign || "Aries",
    southNode: find("south_node")?.sign || "Libra",
    lilith: find("lilith")?.sign || "Scorpio",
    fortune: find("part_of_fortune")?.sign || "Leo",
    midheaven: chart.houses[9]?.sign || "Capricorn",
    fortuneHouse: find("part_of_fortune")?.house || 1,
    sunHouse: find("sun")?.house || 1,
    venusHouse: find("venus")?.house || 1,
    marsHouse: find("mars")?.house || 1,
    moonHouse: find("moon")?.house || 1,
    chironHouse: find("chiron")?.house || 1,
    northNodeHouse: find("north_node")?.house || 1,
    plutoHouse: find("pluto")?.house || 1,
    lilithHouse: find("lilith")?.house || 1,
    secondHouseSign: chart.houses[1]?.sign || "Taurus",
    fifthHouseSign: chart.houses[4]?.sign || "Leo",
    seventhHouseSign: chart.houses[6]?.sign || "Libra",
    tenthHouseSign: chart.houses[9]?.sign || "Capricorn",
    planetsInSeventh: chart.planets.filter((p) => p.house === 7).map((p) => p.name),
    mercuryHouse: find("mercury")?.house || 1,
    saturnHouse: find("saturn")?.house || 1,
  };
}

const t = (sign: string) => SIGN_TRAITS[sign] || SIGN_TRAITS.Leo;
const lower = (s: string) => s.toLowerCase();

// Always name what a house actually means, not just its number, so "3rd house" reads as
// "3rd house of voice & mind, communication, learning..." rather than a bare number nobody
// without a chart reference can place.
const houseLine = (house: number) => `${ordinalHouse(house)} house of ${HOUSE_MEANINGS[house - 1].title}, ${HOUSE_MEANINGS[house - 1].rules}`;

export function buildSynthesis(slug: string, chart: ChartData): SynthesisReading | null {
  const s = extractSigns(chart);
  const name = chart.birthData.name || "babe";

  switch (slug) {
    case "personality":
      return {
        slug,
        title: "personality overview",
        heroLine: "this is who you actually are.",
        intro: `Your whole chart, read as one story, not twelve separate facts. ${name}, this is the version of you your closest people already know.`,
        sections: [
          { title: "who you are", bg: "var(--pink)", light: true, href: "/my-chart/sun", body: `At your core you run on ${t(s.sun).essence} (${lower(s.sun)} sun), while your inner world is wired with ${t(s.moon).essence} (${lower(s.moon)} moon). The public meets your ${lower(s.rising)} rising first, ${t(s.rising).essence}. Together that's a rare combination: the engine, the heart and the entrance are all distinctly yours.` },
          { title: "your emotional world", href: "/my-chart/moon", body: `Your ${lower(s.moon)} moon runs your inner life through ${t(s.moon).essence}, felt most in your ${houseLine(s.moonHouse)}. This is where you actually feel safe, not where you perform safety for other people.` },
          { title: "how you communicate", bg: "var(--lav-light)", href: "/my-chart/mercury", body: `Mercury in ${lower(s.mercury)} means your mind moves through ${t(s.mercury).essence}. In conversation, negotiation and everyday small talk alike, this is the operating system underneath every word you choose.` },
          { title: "your greatest strengths", href: "/my-chart/sun/gifts", body: `${t(s.sun).gift.charAt(0).toUpperCase() + t(s.sun).gift.slice(1)}. Underneath that, your ${lower(s.moon)} moon gives you ${t(s.moon).gift}.` },
          { title: "your shadow side", bg: "var(--dark)", light: true, href: "/my-chart/moon/shadow", body: `Every chart has a cost side. Yours: ${t(s.sun).shadow} And underneath, your moon adds ${t(s.moon).shadow} Neither is a flaw to eliminate, they're the tax on your gifts, worth knowing so it doesn't run you unconsciously.` },
          { title: "what people love about you", bg: "var(--lav-light)", href: "/my-chart/venus", body: `Your ${lower(s.venus)} venus means people experience you as ${t(s.venus).flavour.slice(0, 2).join(" and ")}, and your ${lower(s.rising)} rising makes the first impression ${t(s.rising).flavour[0]}. People remember how you make them feel, and with this chart, that feeling is distinct.` },
          { title: "what makes you different", bg: "var(--dark)", light: true, href: "/my-chart/uranus", body: `Your uranus in ${lower(s.uranus)} and lilith in ${lower(s.lilith)} are your official permission to stop fitting in. The part of you that feels "too much", ${t(s.lilith).flavour[0]}, unfiltered, ${t(s.uranus).flavour[0]}, is exactly the part that makes you impossible to copy.` },
          { title: "your natural gifts", href: "/my-chart/jupiter/gifts", body: `Jupiter in ${lower(s.jupiter)} hands you natural luck through ${t(s.jupiter).flavour[0]} energy, and your part of fortune in ${lower(s.fortune)}, in your ${houseLine(s.fortuneHouse)}, marks where joy and success overlap for you.` },
          { title: "what you're here to learn", bg: "var(--gold)", href: "/my-chart/saturn/growth", body: `Your north node in ${lower(s.northNode)} points at ${t(s.northNode).growth}. And saturn in ${lower(s.saturn)} is building you into an authority the slow way, ${t(s.saturn).growth}.` },
          { title: "your wound and your gift", href: "/my-chart/healing", body: `Chiron in ${lower(s.chiron)}, felt through your ${houseLine(s.chironHouse)}, is the tender place healing and shadow work actually starts. The wound and the gift live in the same spot, that's not a coincidence.` },
          { title: "your soul's purpose", bg: "var(--mint)", href: "/my-chart/purpose", body: `Your north node, in your ${houseLine(s.northNodeHouse)}, and your midheaven in ${lower(s.midheaven)} are the two threads of what you're actually here to do. Purpose isn't a separate topic from personality, it's this chart pointed forward.` },
          { title: "betty's take", bg: "var(--dark)", light: true, body: `Reading this chart, I'd say the biggest thing holding ${name} back isn't any single placement, it's the gap between how magnetic this chart actually is and how much of it she's currently letting the world see. That gap closes the moment she stops editing herself down to a size she thinks is more acceptable. Nothing here needs fixing. It needs volume.` },
        ],
      };

    case "career":
      return {
        slug,
        title: "career",
        heroLine: "you weren't built for a generic career.",
        intro: "Your chart is a professional blueprint, where you lead, how you build, and the work that will actually feel like yours.",
        sections: [
          { title: "career strengths", bg: "var(--pink)", light: true, href: "/my-chart/sun/career", body: `With your ${lower(s.sun)} sun, in your ${houseLine(s.sunHouse)}, ${t(s.sun).career}. That's not a preference, it's your professional operating system.` },
          { title: "leadership style", href: "/my-chart/mars", body: `You lead like your ${lower(s.mars)} mars, in your ${houseLine(s.marsHouse)}: with ${t(s.mars).essence}. Paired with saturn in ${lower(s.saturn)}, your authority is built on ${t(s.saturn).flavour[3] || t(s.saturn).flavour[0]} follow-through people learn to rely on.` },
          { title: "business style", bg: "var(--lav-light)", href: "/my-chart/mars/career", body: `In business, ${t(s.mars).career}. Your mars placement means you move on opportunities with ${t(s.mars).flavour[0]} energy, build your offers and launches around that rhythm instead of fighting it.` },
          { title: "creative gifts", href: "/my-chart/venus", body: `Your venus in ${lower(s.venus)} and neptune in ${lower(s.neptune)} shape your creative signature: ${t(s.venus).flavour[0]} taste with ${t(s.neptune).flavour[0]} imagination. Whatever you make carries that stamp.` },
          { title: "career direction", bg: "var(--dark)", light: true, href: "/my-chart/midheaven", body: `Your midheaven in ${lower(s.midheaven)}, your ${houseLine(10)}, means you're becoming known for ${t(s.midheaven).flavour.slice(0, 2).join(", ")} work. With your north node in ${lower(s.northNode)}, your career keeps pulling you toward ${t(s.northNode).flavour[0]} territory, the stretch is the path.` },
          { title: "ideal work environments", bg: "var(--mint)", href: "/my-chart/moon/career", body: `Your ${lower(s.moon)} moon, in your ${houseLine(s.moonHouse)}, needs to feel right at work, not just look right on paper: ${t(s.moon).career}. Protect that and your output doubles.` },
          { title: "betty's take", bg: "var(--dark)", light: true, body: `The women I've coached with this kind of chart usually stall for the same reason, they keep waiting for external permission before they'll commit fully. Your ${lower(s.midheaven)} midheaven doesn't need permission, it needs a decision. Pick the direction, announce it publicly before you feel fully ready, and let the momentum build the confidence retroactively.` },
        ],
      };

    case "money":
      return {
        slug,
        title: "money",
        heroLine: "your wealth has a blueprint too.",
        intro: "How you earn, receive, price and grow, pulled straight from your chart, translated into money moves.",
        sections: [
          { title: "natural money strengths", bg: "var(--gold)", href: "/my-chart/jupiter/money", body: `Jupiter in ${lower(s.jupiter)}: ${t(s.jupiter).money}. This is your abundance home turf, the more your income strategy leans on it, the luckier you get.` },
          { title: "receiving style", bg: "var(--pink)", light: true, href: "/my-chart/venus/money", body: `Your venus in ${lower(s.venus)} shapes how you receive: ${t(s.venus).money}. Receiving well is a skill, yours works through ${t(s.venus).flavour[0]} energy.` },
          { title: "income opportunities", body: `Your 2nd house of money carries ${lower(s.secondHouseSign)} energy, ${t(s.secondHouseSign).money}. And your part of fortune, in your ${houseLine(s.fortuneHouse)}, says income flows easiest through that same territory.` },
          { title: "business strengths", bg: "var(--lav-light)", href: "/my-chart/mars/money", body: `Your mars in ${lower(s.mars)} closes deals with ${t(s.mars).essence}, while saturn in ${lower(s.saturn)} gives you the long-game structure most people never build. Speed plus stamina is a wealth combination.` },
          { title: "money mindset", bg: "var(--dark)", light: true, href: "/my-chart/saturn/growth", body: `Your growth edge: ${t(s.saturn).shadow}. Catch that pattern around money specifically, it's usually the only thing between you and your next level.` },
          { title: "pricing energy", href: "/my-chart/lilith", body: `Your lilith in ${lower(s.lilith)} is your pricing power, the unapologetic part of you that refuses to shrink. Price from her, not from the version of you that's scared of being "too expensive".` },
          { title: "betty's take", bg: "var(--dark)", light: true, body: "In twenty years I've never met a woman whose money blocks were actually about maths. They're about worth, dressed up as budgeting. Before you touch another spreadsheet, answer this honestly: what would you have to believe about yourself to charge what you're actually worth without the apologetic tone? Start there. The numbers follow the belief, not the other way round." },
        ],
      };

    case "love": {
      const seventh = HOUSE_MEANINGS[6];
      const seventhOverview = SIGN_OVERVIEWS[s.seventhHouseSign];
      const inhabitants = s.planetsInSeventh;
      const inhabitantsLine =
        inhabitants.length === 0
          ? `Your 7th house is empty of planets, which doesn't mean partnership is unimportant to you, it means this house runs almost entirely on its cusp sign, ${lower(s.seventhHouseSign)}, rather than being coloured by a specific planet's agenda. Read the cusp sign below as close to the whole story.`
          : `Sitting inside that house: ${inhabitants.join(", ")}. Whatever ${inhabitants.length > 1 ? "these planets" : "this planet"} usually mean${inhabitants.length > 1 ? "" : "s"} elsewhere in your chart, here ${inhabitants.length > 1 ? "they get" : "it gets"} pulled directly into how you do partnership, they're not background placements in this context, they're actively shaping what you look for and attract in a significant other.`;

      return {
        slug,
        title: "love & relationships",
        heroLine: "how you love, and what you need back.",
        intro: "Not a horoscope-style skim, this is your actual relationship architecture: the house partnership lives in, how you communicate inside it, what you need to feel safe, how attraction and commitment work differently for you, and the growth that makes love easier instead of harder.",
        sections: [
          { title: "what the 7th house actually is", bg: "var(--dark)", light: true, href: "/my-chart/house/7", body: `Before any placement, start with the house itself. ${seventh.deepDive}` },
          { title: "your 7th house, specifically", bg: "var(--gold)", body: `Your 7th house of partnership sits in ${lower(s.seventhHouseSign)}, which means the committed relationships and business partnerships you attract carry a ${lower(s.seventhHouseSign)} flavour whether you planned that or not: ${(seventhOverview ? seventhOverview.archetype : `${t(s.seventhHouseSign).essence}.`).replace(/\.?$/, "")}. ${inhabitantsLine}` },
          { title: "relationship style", bg: "var(--pink)", light: true, href: "/my-chart/venus", body: `With venus in ${lower(s.venus)}, in your ${houseLine(s.venusHouse)}, ${t(s.venus).love}. That's your attraction blueprint, what you're drawn to and how you show love once you're in it, and it colours your 7th house's ${lower(s.seventhHouseSign)} energy rather than replacing it, the two work together, not separately.` },
          { title: "how you communicate in love", href: "/my-chart/mercury", body: `Mercury in ${lower(s.mercury)}, in your ${houseLine(s.mercuryHouse)}, means you connect through ${t(s.mercury).essence}. In conflict and in flirting alike, your words carry ${t(s.mercury).flavour[0]} energy. This is the part most compatibility reads skip, chemistry gets you to the relationship, this placement is what actually gets you through a hard conversation inside it.` },
          { title: "what you need from love", bg: "var(--lav-light)", href: "/my-chart/moon", body: `Your ${lower(s.moon)} moon is the non-negotiable: ${t(s.moon).love}. A partner who meets your moon meets the real you, not the version of you that shows up well on a third date. This is the placement that decides whether a relationship feels like home or just feels good.` },
          { title: "attraction & chemistry", href: "/my-chart/mars", body: `Where venus shows what you're drawn to, mars in ${lower(s.mars)} shows what actually pulls the trigger: ${t(s.mars).essence}. Venus picks the type, mars decides the spark. If a relationship has your venus but not your mars, it tends to read as "nice on paper" instead of magnetic.` },
          { title: "how you handle commitment", bg: "var(--gold)", href: "/my-chart/saturn", body: `Saturn in ${lower(s.saturn)}, in your ${houseLine(s.saturnHouse)}, shapes how seriously and how slowly you build long-term commitment: ${t(s.saturn).growth}. This isn't coldness, it's the part of you that wants a relationship built to actually last rather than one that just feels good this month.` },
          { title: "green flags to look for", bg: "var(--mint)", body: `Someone who celebrates your ${t(s.sun).flavour[0]} side instead of shrinking it, matches your ${lower(s.mars)} mars pace (${t(s.mars).flavour[0]} energy), speaks your ${lower(s.mercury)} mercury language without needing a translation, and makes your nervous system feel like home through your ${lower(s.moon)} moon. Chemistry is nice, safety plus chemistry is the actual standard.` },
          { title: "your relationship strengths", body: `You bring ${t(s.venus).gift}, and your ${lower(s.moon)} moon adds ${t(s.moon).gift}. Your ${lower(s.seventhHouseSign)} 7th house means partnership itself brings out ${t(s.seventhHouseSign).flavour.slice(0, 2).join(" and ")} qualities in you specifically, ones that might not show up anywhere else in your life the way they do inside a real relationship.` },
          { title: "growth areas", bg: "var(--dark)", light: true, href: "/my-chart/chiron", body: `Your chiron in ${lower(s.chiron)} carries old relational tenderness: ${t(s.chiron).shadow}. Naming it with a partner, out loud, turns your most guarded place into your deepest intimacy instead of your most avoided topic.` },
          { title: "the pattern that keeps repeating", body: `Your south node in ${lower(s.southNode)} is the relational comfort zone you default to under stress: ${t(s.southNode).essence}. It's not wrong, it's just fully mastered, which is exactly why it's tempting to stay there even when your north node in ${lower(s.northNode)} is asking for something less familiar and more growth-shaped.` },
          { title: "betty's take", bg: "var(--dark)", light: true, body: `Here's what I tell every client with a chart like yours: the relationship pattern that keeps repeating isn't about who you keep choosing, it's about what you're still willing to tolerate to avoid being alone with your own chiron in ${lower(s.chiron)}. Your 7th house in ${lower(s.seventhHouseSign)} will keep handing you the same lesson in a different outfit until you actually work with it instead of around it. Fix that relationship with yourself first. The external one gets dramatically easier.` },
        ],
      };
    }

    case "healing":
      return {
        slug,
        title: "healing & shadow work",
        heroLine: "the parts of you asking to be met, not fixed.",
        intro: `${name}, this is the work underneath the work, the wound, the pattern and the untamed self your chart is asking you to actually look at, not manage around.`,
        sections: [
          { title: "your core wound", bg: "var(--dark)", light: true, href: "/my-chart/chiron", body: `Chiron in ${lower(s.chiron)}, in your ${houseLine(s.chironHouse)}, is your deepest wound and your deepest medicine, in the same place. It hurts precisely because it's real, not because something is wrong with you.` },
          { title: "where it actually shows up", body: `You'll recognise it less as pain and more as a pattern: over-preparing, over-explaining, or quietly disappearing right where ${HOUSE_MEANINGS[s.chironHouse - 1].lifeAreas[0]} is involved, since that's the exact territory your ${houseLine(s.chironHouse)} governs. That reaction is the wound talking, not the truth of the situation.` },
          { title: "the pattern you keep repeating", bg: "var(--gold)", href: "/my-chart/south_node", body: `Your south node in ${lower(s.southNode)} is the comfort zone you keep defaulting back to under stress, ${t(s.southNode).essence}. It was never wrong, it's just fully mastered. Growth lives on the other side of it, in your ${lower(s.northNode)} north node.` },
          { title: "what you're avoiding", href: "/my-chart/pluto", body: `Pluto in ${lower(s.pluto)}, in your ${houseLine(s.plutoHouse)}, marks the transformation you keep circling instead of entering fully. The avoidance usually sounds reasonable, "not right now", "too much at once", it rarely announces itself as fear.` },
          { title: "your shadow self", bg: "var(--dark)", light: true, href: "/my-chart/moon/shadow", body: `The disowned parts: ${t(s.sun).shadow} And underneath that, your moon adds ${t(s.moon).shadow} Shadow work isn't eliminating these, it's building a relationship with them so they stop running the show unconsciously.` },
          { title: "your untamed self", bg: "var(--lav-light)", href: "/my-chart/lilith", body: `Lilith in ${lower(s.lilith)}, in your ${houseLine(s.lilithHouse)}, is the part of you that got shamed, silenced or called too much, ${t(s.lilith).flavour[0]} and unfiltered. Reclaiming her isn't rebellion for its own sake, it's taking back what was never actually a problem.` },
          {
            title: "what healing actually looks like for you",
            bg: "var(--mint)",
            body: `Not resolution, integration. Four things to actually do, not just read: 1) Name the pattern out loud the next time it fires, in the moment, even just to yourself. 2) Once a week, write the sentence your ${lower(s.chiron)} chiron wound tells you when it's triggered, then write the true sentence underneath it. 3) Do one small, imperfect version of the thing the wound usually stops you from doing, this week. 4) Tell one trusted person "this is a pattern I'm working on" instead of hiding it. You'll know it's working when the old trigger still shows up but costs you minutes instead of days.`,
          },
          { title: "betty's take", bg: "var(--dark)", light: true, body: `Every woman I've coached through real shadow work hits the same wall: she wants the wound gone, not understood. It doesn't go. It integrates. The version of you on the other side of this work isn't wound-free, she's just no longer surprised by it, and that's the whole difference.` },
        ],
      };

    case "purpose":
      return {
        slug,
        title: "soul expression & purpose",
        heroLine: "why you're actually here.",
        intro: `Not your job title, ${name}, your actual direction. This is the thread that runs from your gifts to your growth to the mark you're here to leave.`,
        sections: [
          { title: "your soul's direction", bg: "var(--pink)", light: true, href: "/my-chart/north_node", body: `Your north node in ${lower(s.northNode)}, in your ${houseLine(s.northNodeHouse)}, points at ${t(s.northNode).growth} That pull isn't random, it's the direction your whole chart is quietly built to grow into.` },
          { title: "the gifts you already have", href: "/my-chart/south_node", body: `Your south node in ${lower(s.southNode)} is what you arrived already knowing, ${t(s.southNode).gift}. You're not starting purpose from zero, you're starting it with a head start most people don't get.` },
          { title: "what you're becoming known for", bg: "var(--lav-light)", href: "/my-chart/midheaven", body: `Your midheaven in ${lower(s.midheaven)} shapes your public purpose, work that reads as ${t(s.midheaven).flavour.slice(0, 2).join(", ")}. This is less a career and more a reputation you're building one decision at a time.` },
          { title: "where joy and purpose meet", href: "/my-chart/part_of_fortune", body: `Your part of fortune in ${lower(s.fortune)}, in your ${houseLine(s.fortuneHouse)}, marks where ease and meaning actually overlap for you. If purpose feels like constant effort, you're probably standing outside this house.` },
          { title: "your spiritual signature", bg: "var(--dark)", light: true, href: "/my-chart/neptune", body: `Neptune in ${lower(s.neptune)} is where your imagination, intuition and sense of something bigger actually live, ${t(s.neptune).essence}. Purpose that ignores this side of you will always feel slightly hollow, however successful it looks.` },
          { title: "your core life force", href: "/my-chart/sun", body: `Underneath all of it is your ${lower(s.sun)} sun in your ${houseLine(s.sunHouse)}, the raw vitality purpose is meant to be built on. When you're aligned, this is the part of you that doesn't need convincing to show up.` },
          { title: "what blocks you from purpose", bg: "var(--gold)", href: "/my-chart/saturn/growth", body: `Saturn in ${lower(s.saturn)}: ${t(s.saturn).shadow} It rarely announces itself as fear, it dresses up as being realistic, waiting for the right time, or needing one more qualification first.` },
          { title: "betty's take", bg: "var(--dark)", light: true, body: `Purpose isn't a single answer you're missing, it's a direction you're already walking whether you've named it or not. Your job isn't to find it, it's to stop overriding it every time it asks for something inconvenient. Follow the pull. The clarity comes after you move, not before.` },
        ],
      };

    case "power":
      return {
        slug,
        title: "stepping into your power",
        heroLine: "stop asking permission to be this much.",
        intro: `${name}, this is the part of your chart that isn't about being liked, it's about being undeniable. Pluto, Mars, Lilith and Saturn, read together as one power source instead of four separate placements.`,
        sections: [
          { title: "your untamed self", bg: "var(--dark)", light: true, href: "/my-chart/lilith", body: `Your lilith in ${lower(s.lilith)}, in your ${houseLine(s.lilithHouse)}, is the part of you that's been called too much, too intense, too ${t(s.lilith).flavour[0]}. That reaction from other people was never a correction, it was a reflex to power they weren't expecting. Reclaiming her, unapologetically, in exactly the territory that house governs, is the fastest route into your actual power, not a side quest.` },
          { title: "where your real power lives", href: "/my-chart/pluto", body: `Pluto in ${lower(s.pluto)}, in your ${houseLine(s.plutoHouse)}, marks where you're built to transform completely, more than once, and come back holding real power instead of the performance of it. Most people spend years circling this house instead of walking into it. You don't get to skip the descent, but you do get to stop being surprised by it.` },
          { title: "how you assert it", bg: "var(--lav-light)", href: "/my-chart/mars", body: `Your mars in ${lower(s.mars)} is how power actually leaves your body and becomes action: ${t(s.mars).essence}. Power you can't act on is just a feeling. This placement is the difference between wanting more and actually taking it.` },
          { title: "the authority you're building", href: "/my-chart/saturn", body: `Saturn in ${lower(s.saturn)} is playing a longer game than the other three: ${t(s.saturn).career}. Lilith and Pluto hand you raw power, Saturn is what turns it into authority that doesn't evaporate the first time someone challenges it.` },
          { title: "the fear that's actually in the way", bg: "var(--gold)", href: "/my-chart/pluto/shadow", body: `${t(s.pluto).shadow.charAt(0).toUpperCase() + t(s.pluto).shadow.slice(1)}. Name that pattern specifically, out loud, the next time you catch yourself shrinking a decision, a price or an opinion down to something more "acceptable".` },
          { title: "what people call it instead", bg: "var(--dark)", light: true, body: `You've probably heard your power described as "intense", "a lot", or "intimidating", usually by people who weren't ready to be around it. That's data about them, not a note to act on. The version of you that edits herself down to be more digestible isn't more likeable, she's just smaller.` },
          { title: "the one move this week", bg: "var(--mint)", body: `Pick one place this week you've been diluting yourself, a price, a boundary, an opinion, a "no", and deliver the full-strength version instead of the softened one. Not louder. Not ruder. Just undiluted. Notice what actually happens versus what you were bracing for.` },
          { title: "betty's take", bg: "var(--dark)", light: true, body: `The women I coach who are actually powerful rarely feel powerful day to day, they feel "too much" right up until the exact moment they stop apologising for it. Your chart isn't missing power, ${name}, it's carrying a version of it you've been managing down to a size other people could handle. Stepping into it isn't becoming someone new. It's putting down the smaller version you built for everyone else's comfort.` },
        ],
      };

    case "main-character":
      return {
        slug,
        title: "main character energy",
        heroLine: "you were never meant to be a background character.",
        intro: `This is your magnetism manual, ${name}, how your chart says you're designed to stand out, be seen and be unforgettable.`,
        sections: [
          { title: "how you're naturally magnetic", bg: "var(--pink)", light: true, href: "/my-chart/rising", body: `Your ${lower(s.rising)} rising does the work before you speak, you arrive with ${t(s.rising).essence}. Magnetism for you is not performing more, it's editing less.` },
          { title: "how you're designed to stand out", bg: "var(--dark)", light: true, href: "/my-chart/uranus", body: `Your ${lower(s.sun)} sun stands out through ${t(s.sun).flavour.slice(0, 2).join(" and ")} energy, and your uranus in ${lower(s.uranus)} adds the ${t(s.uranus).flavour[0]} edge nobody can imitate. Blending in was never actually available to you.` },
          { title: "what makes you unforgettable", href: "/my-chart/lilith", body: `People forget polished. They never forget ${t(s.lilith).flavour[0]}. Your lilith in ${lower(s.lilith)} plus venus in ${lower(s.venus)} is the combination that lingers after you leave the room, lean into it deliberately.` },
          { title: "confidence, decoded for you", bg: "var(--lav-light)", href: "/my-chart/sun/confidence", body: `${t(s.sun).confidence.charAt(0).toUpperCase() + t(s.sun).confidence.slice(1)}. On wobbly days, come back to your ${lower(s.mars)} mars: ${t(s.mars).confidence}.` },
          { title: "visibility advice", href: "/my-chart/midheaven", body: `Your midheaven in ${lower(s.midheaven)} wants you publicly known for ${t(s.midheaven).flavour[0]} work, and your sun, in your ${houseLine(s.sunHouse)}, means your light shines brightest through that same territory. Post, pitch and show up there first.` },
          { title: "where you shine most", bg: "var(--gold)", body: `Your ${houseLine(5)} runs on ${lower(s.fifthHouseSign)} energy and your ${houseLine(10)} on ${lower(s.tenthHouseSign)}, creative ${t(s.fifthHouseSign).flavour[0]} joy in private, ${t(s.tenthHouseSign).flavour[0]} authority in public. That's your full range. Use both.` },
          { title: "betty's take", bg: "var(--dark)", light: true, body: `I see this pattern all the time. Women think they need to become more before they become visible. Your chart says the opposite: you're already unforgettable, you're just choosing rooms and moments to dim it. Main character energy isn't a personality upgrade, it's a permission slip you write yourself. Sign it.` },
        ],
      };

    default:
      return null;
  }
}
