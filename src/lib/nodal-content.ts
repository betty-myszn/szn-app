// The nodal axis engine. A nodal ingress is the rarest event on the cosmic calendar (roughly one
// every eighteen months) and most members have never heard of the nodes, so this reading gets its
// own composer rather than sharing the generic lunation template. It has to do three jobs at once:
// teach the axis from scratch, read both ends of it in the member's own chart, and coach them
// through it. Voice rules as per interpretations.ts: cosmic coach, not textbook. British spellings.

import { ZODIAC_SIGNS, type ChartData } from "@/types/chart";
import { HOUSE_MEANINGS, ordinalHouse, houseForSign } from "@/lib/interpretations";
import type { CalendarEventInput, LunationReading, ReadingSection } from "@/lib/moon-content";

// What each house asks for when the NORTH node sits in it: the growth direction, plus concrete,
// recognisable examples of what "growing here" actually looks like in a real life. The examples
// are the point, "focus on identity" means nothing to someone who has never done this before.
interface NorthHouseNote {
  growingToward: string;
  moves: string[];
}

// What each house looks like when the SOUTH node sits in it: the familiar default, the genuine
// strengths built there (never framed as something to abandon) and the pattern likely to be outgrown.
interface SouthHouseNote {
  comfort: string;
  gift: string;
  outgrow: string;
}

// Short noun phrases for each house that survive being written after "your". HOUSE_MEANINGS
// lifeAreas are single words chosen for lists ("love", "identity"), which read badly in possessive
// prose, and the titles carry ampersands. These are written for sentences.
const HOUSE_AREA = [
  "sense of self",
  "money and self-worth",
  "voice and everyday learning",
  "home and inner foundations",
  "creative self-expression",
  "daily routines and health",
  "partnerships",
  "depth and shared resources",
  "beliefs and horizons",
  "public life and career",
  "community and future",
  "inner world and rest",
];

const NORTH_HOUSE: NorthHouseNote[] = [
  {
    growingToward:
      "an identity you author yourself, built from the inside out rather than assembled from other people's reactions to you",
    moves: [
      "introducing yourself as who you are now rather than who you used to be",
      "making a decision before you have anyone's blessing",
      "becoming more visible in your work, your voice and the way you show up in a room",
      "letting your look, your name or your brand catch up with the person you have actually become",
      "backing your own read on a situation when someone confident disagrees",
    ],
  },
  {
    growingToward:
      "a life you can fund and hold on your own terms, and a sense of worth that stops being up for negotiation",
    moves: [
      "raising your rates, or asking out loud for the number you actually want",
      "building income you control rather than income you are granted",
      "untangling your money from an arrangement that costs you more than it pays you",
      "spending on what genuinely steadies you and cutting what only looks like security",
      "letting yourself want something plainly, without building a justification for it first",
    ],
  },
  {
    growingToward:
      "your own voice, used often and in public, and the ordinary daily learning that quietly turns into real expertise",
    moves: [
      "starting the newsletter, the podcast or the account before it is polished",
      "saying the thing in the room instead of drafting it perfectly afterwards",
      "learning something practical and immediately useful rather than one more grand theory",
      "publishing consistently rather than waiting for the masterpiece",
      "reconnecting with the people close to hand, siblings, neighbours, your actual local world",
    ],
  },
  {
    growingToward:
      "a foundation that is genuinely yours, an emotional and physical home that holds you when the achievements pause",
    moves: [
      "making where you live feel like somewhere you want to be, not just somewhere you sleep",
      "moving, or finally admitting out loud that you want to",
      "reducing the hours until there is a life underneath the work",
      "doing the family or inner work you have been outrunning",
      "letting your job stop being the first thing you say about yourself",
    ],
  },
  {
    growingToward:
      "expression that is unmistakably yours, made for the pleasure of it rather than for approval or usefulness",
    moves: [
      "making something with your name on it and letting people see it",
      "dating, flirting or enjoying romance without a five-year plan attached to it",
      "taking up something you have no intention of monetising",
      "stepping out from behind the group project and taking the credit",
      "choosing what genuinely delights you over what reliably performs",
    ],
  },
  {
    growingToward:
      "a daily life that actually works, built out of routine, health and craft rather than inspiration",
    moves: [
      "building one routine you can genuinely keep, small enough to survive a bad week",
      "booking the health appointment you have been postponing",
      "learning a skill properly instead of dabbling in five",
      "fixing the boring logistics that have been quietly draining you",
      "choosing work that fits your daily life, not only your ambitions",
    ],
  },
  {
    growingToward:
      "real partnership, the kind that asks you to stay in the conversation instead of handling everything alone",
    moves: [
      "committing properly to one person, one collaborator or one thing",
      "letting someone help without immediately repaying it",
      "asking for what you need in plain words rather than hoping it is noticed",
      "staying in the negotiation instead of walking out of it",
      "building something with someone rather than beside them",
    ],
  },
  {
    growingToward:
      "depth, real intimacy and a willingness to merge with something and be changed by it",
    moves: [
      "letting someone all the way in, past the presentable version of you",
      "sorting the shared money honestly, the joint account, the equity, the debt, the inheritance",
      "doing the deeper therapeutic work rather than the maintenance version of it",
      "ending something that is technically fine and quietly already over",
      "investing in something you cannot fully control",
    ],
  },
  {
    growingToward:
      "a bigger life and a belief system you have actually chosen, built through study, distance and perspective",
    moves: [
      "booking the trip, or making the move abroad you keep almost making",
      "enrolling in the thing properly instead of reading around it for another year",
      "teaching, publishing or putting your view on the record",
      "working out what you actually believe rather than what you absorbed",
      "saying yes to the opportunity that is geographically or intellectually inconvenient",
    ],
  },
  {
    growingToward:
      "a public role, being known for something specific, and carrying responsibility in front of people",
    moves: [
      "going for the promotion, the title or the platform",
      "letting the work be seen with your name attached to it",
      "changing career direction towards what you actually want to be known for",
      "leading something outright rather than reliably supporting it",
      "saying out loud what you are building, before it is finished",
    ],
  },
  {
    growingToward:
      "community, contribution and a future you build with other people rather than in front of them",
    moves: [
      "finding the rooms and the people who reflect who you are becoming",
      "joining or building a community rather than collecting an audience",
      "collaborating on something bigger than your own name",
      "sharing the platform instead of holding it",
      "committing to a longer-term vision that outlasts this year's goals",
    ],
  },
  {
    growingToward:
      "an inner life, real rest, and trust in the things you cannot schedule or measure",
    moves: [
      "resting before you have earned it, which is the whole exercise",
      "starting or restarting therapy, or a spiritual practice you take seriously",
      "working quietly on something that is not ready to be shown",
      "letting go of a routine that has quietly become a cage",
      "protecting solitude the way you would protect a meeting",
    ],
  },
];

const SOUTH_HOUSE: SouthHouseNote[] = [
  {
    comfort: "doing it all yourself, deciding fast, and moving before anyone can complicate the plan",
    gift: "courage, decisiveness and a strong instinct for who you are, you have never needed a committee in order to act",
    outgrow: "independence worn as armour, the self-sufficiency that quietly keeps everyone at arm's length",
  },
  {
    comfort: "staying where things are familiar and materially safe, and measuring a good life by how little has had to change",
    gift: "steadiness, resourcefulness and a nervous system that is genuinely hard to panic, you can build something solid and keep it",
    outgrow: "comfort used as the reason not to move, and stability quietly mistaken for safety",
  },
  {
    comfort: "collecting information, staying busy in your head, and keeping every conversation moving so none of it has to land",
    gift: "a quick mind, real adaptability and the ability to talk to almost anyone about almost anything",
    outgrow: "scrolling, skimming and commentary standing in for an actual decision",
  },
  {
    comfort: "staying close to the familiar, the family script, the room whose rules you already know",
    gift: "emotional intelligence, loyalty, and a real understanding of what makes people feel safe",
    outgrow: "privacy used as hiding, and the comfort of home quietly setting the ceiling on your life",
  },
  {
    comfort: "the spotlight, the applause, and the thing you already know you are admired for",
    gift: "warmth, charisma and genuine creative confidence, you are not frightened of being seen",
    outgrow: "needing the reaction before the thing feels real to you",
  },
  {
    comfort: "over-functioning, staying useful, and keeping the small things immaculate",
    gift: "discipline, precision and a real gift for service, you can fix things most people cannot even diagnose",
    outgrow: "control exercised through routine, and busyness used as a way not to feel",
  },
  {
    comfort: "defining yourself through whoever you are with, and letting the relationship make the call",
    gift: "you read people beautifully, you are fair, and you know how to make someone feel genuinely considered",
    outgrow: "looking outside yourself for validation, certainty or direction",
  },
  {
    comfort: "intensity, crisis and depth, the familiar pull of situations that feel significant because they are hard",
    gift: "you are close to unshockable, you handle other people's darkness well and you understand how power actually moves",
    outgrow: "drama treated as proof that something matters",
  },
  {
    comfort: "the theory, the plan and the philosophy, staying at the level of the idea where nothing can go wrong yet",
    gift: "perspective, optimism and an ability to see the shape of something long before other people can",
    outgrow: "certainty that has stopped being curious, and preaching where a conversation would do",
  },
  {
    comfort: "achievement, competence, and the reliable public version of you that everyone already trusts",
    gift: "you deliver, you are credible, and you know how to build a reputation that lasts",
    outgrow: "an identity collapsed into a job title, and the belief that rest has to be earned first",
  },
  {
    comfort: "the group, the network, the causes, the safety of being one of many",
    gift: "you are a genuine connector with a real feel for where things are heading next",
    outgrow: "hiding inside the collective, and letting the group's approval decide your next move",
  },
  {
    comfort: "retreat, escape, and the private world where nothing is required of you",
    gift: "deep intuition, imagination and compassion, you understand people without being told anything",
    outgrow: "avoidance dressed up as surrender, and disappearing at exactly the moment things get real",
  },
];

// What the collective is being pulled towards for the next eighteen months, keyed by the sign the
// NORTH node moves into. Each one covers the cultural conversation, business, technology and
// relationships, then names what is being released and what wisdom is worth carrying forward.
interface CollectiveShift {
  pull: string; // short label for the growth direction, reused in composition
  release: string; // short label for the south node habit the culture is loosening
  collective: string;
}

const COLLECTIVE: Record<string, CollectiveShift> = {
  Aries: {
    pull: "self-determination",
    release: "keeping the peace at the cost of the truth",
    collective:
      "For the next eighteen months the collective pull is towards self-determination. Expect the culture to reward people who move first and decide alone, solo founders over committees, direct speech over careful diplomacy, conviction over consensus. Business gets faster and more willing to break something. Technology leans towards tools that let one person do what used to take a team. Relationships get an honesty audit, and the polite arrangements that were quietly costing somebody their identity tend not to survive this axis. What the collective is loosening is the Libra habit of smoothing everything over. The wisdom worth carrying forward is Libra's fairness, because independence without it is just selfishness with better branding.",
  },
  Taurus: {
    pull: "what is real, slow and touchable",
    release: "crisis treated as significance",
    collective:
      "For the next eighteen months the collective pull is towards what is real, slow and touchable. Expect conversations about ownership, land, food, craft, the body and money you can actually see. Business starts favouring steady margins over leveraged bets. Technology gets judged on whether it improves material life rather than on how clever it sounds. Relationships get quieter and more practical, built on consistency rather than intensity. What the collective is loosening is Scorpio's appetite for crisis, leverage and other people's money, the belief that if it is not dramatic it cannot be meaningful. The wisdom worth carrying forward is Scorpio's honesty about power, because comfort without it curdles into complacency.",
  },
  Gemini: {
    pull: "curiosity and the ordinary conversation",
    release: "certainty that stopped asking questions",
    collective:
      "For the next eighteen months the collective pull is towards curiosity, questions and many small conversations rather than one big answer. Expect the culture to get more sceptical of gurus and grand narratives, and more interested in peer knowledge, local voices, media literacy and the plain skill of talking to each other. Business rewards communication, teaching in public and being genuinely useful in short form. The technology conversation centres on information itself, who writes it, who verifies it, who owns it. Relationships move towards friendship, dialogue and the feeling of being properly listened to. What the collective is loosening is Sagittarius's certainty. The wisdom worth carrying forward is its search for meaning, because curiosity with no direction just becomes noise.",
  },
  Cancer: {
    pull: "care, home and emotional safety",
    release: "status mistaken for safety",
    collective:
      "For the next eighteen months the collective pull is towards care, home and emotional safety. Expect the big conversations to be about housing, family, belonging, mental health, who looks after whom, and the real cost of a life spent proving yourself. Business comes under pressure to treat people like people. Technology gets judged on whether it protects private life or mines it. Relationships move towards emotional honesty rather than presentable arrangements. What the collective is loosening is the Capricorn grind, the belief that status and safety are the same thing. The wisdom worth carrying forward is Capricorn's discipline, because care without structure collapses into good intentions.",
  },
  Leo: {
    pull: "the authored and the visibly human",
    release: "the safety of the crowd",
    collective:
      "For the next eighteen months the collective pull is towards the individual, the authored and the visibly human. Expect a cultural appetite for personality, craft with a name attached, live and unrepeatable things, and taste over metrics. Business favours founders and creators who are actually willing to be seen. Technology faces a reckoning about anonymous mass output and whether a person meant to make this. Relationships get warmer, more romantic, more willing to be embarrassing in public. What the collective is loosening is Aquarius's detachment, the safety of the crowd, the idea that the network matters more than the person. The wisdom worth carrying forward is Aquarius's fairness and systems thinking, because self-expression without it is only ego with a following.",
  },
  Virgo: {
    pull: "discernment and doing the work properly",
    release: "escapism and the unkept promise",
    collective:
      "For the next eighteen months the collective pull is towards discernment, repair and doing the work properly. Expect conversations about health, evidence, craftsmanship, quality control and cleaning up the mess left by the last cycle. Business rewards operational competence over storytelling. Technology gets measured on accuracy and on whether it genuinely helps a real workflow. Relationships turn practical, built on consistency, effort and showing up on an ordinary Tuesday. What the collective is loosening is Pisces's blur, the escapism, the promises nobody ever operationalised. The wisdom worth carrying forward is Pisces's compassion, because precision without it is cruelty with a checklist.",
  },
  Libra: {
    pull: "partnership and fairness",
    release: "the me-first reflex",
    collective:
      "For the next eighteen months the collective pull is towards partnership, fairness and the art of doing things with other people. Expect conversations about negotiation, mediation, contracts, design and beauty, and who gets a seat at the table. Business favours alliances, joint ventures and reputations built on how you treat people. Technology gets pushed towards collaboration and shared standards. Relationships move to the centre of the cultural story, both the making of them and the honest ending of the ones that were never balanced. What the collective is loosening is Aries's me-first reflex, the belief that speed and force settle things. The wisdom worth carrying forward is Aries's courage, because diplomacy without it turns into avoidance.",
  },
  Scorpio: {
    pull: "depth and the truth underneath",
    release: "comfort that has stopped asking questions",
    collective:
      "For the next eighteen months the collective pull is towards depth, truth and whatever is happening underneath the surface. Expect conversations about power, money that is not yours alone, debt, inheritance, privacy, and the things institutions would rather not disclose. Business gets restructured rather than redecorated. The technology conversation turns to security, surveillance and who controls the data. Relationships go deeper and get much less tolerant of a pleasant surface. What the collective is loosening is Taurus's attachment to comfort, the assumption that if nothing is moving then nothing is wrong. The wisdom worth carrying forward is Taurus's steadiness, because transformation with no stable base underneath it is just chaos.",
  },
  Sagittarius: {
    pull: "meaning and the bigger picture",
    release: "scatter and the hot take",
    collective:
      "For the next eighteen months the collective pull is towards meaning, scale and the bigger picture. Expect conversations about belief, education, travel, cross-border everything, and what all the information we have collected is actually for. Business looks outward and thinks in longer arcs. Technology gets discussed philosophically, what it is for rather than what it can do. Relationships want shared values and room to grow rather than constant contact. What the collective is loosening is Gemini's scatter, the endless commentary, the hot take economy. The wisdom worth carrying forward is Gemini's curiosity, because conviction with no questions in it hardens fast.",
  },
  Capricorn: {
    pull: "structure and accountability",
    release: "retreat into the familiar",
    collective:
      "For the next eighteen months the collective pull is towards structure, accountability and building things designed to outlast the people who built them. Expect conversations about institutions, regulation, leadership, long-term responsibility and who is genuinely in charge. Business matures into governance, standards and a longer game. Technology meets rules. Relationships get more explicit about commitment and what each person is actually signing up for. What the collective is loosening is Cancer's protective nostalgia, the pull to retreat into the familiar and call it safety. The wisdom worth carrying forward is Cancer's care, because structure without it just goes cold.",
  },
  Aquarius: {
    pull: "the collective and the future",
    release: "the spotlight economy",
    collective:
      "For the next eighteen months the collective pull is towards the collective itself, the systemic and the future. Expect conversations about community, reform, access, and technology's effect on everyone rather than on anyone in particular. Business reorganises around networks, open collaboration and audiences that participate rather than watch. Technology accelerates and gets political. Relationships lean towards chosen family and away from the traditional template. What the collective is loosening is Leo's spotlight economy, the assumption that a personal brand is the same thing as a contribution. The wisdom worth carrying forward is Leo's heart, because a movement with no warmth in it does not hold people for long.",
  },
  Pisces: {
    pull: "imagination and compassion",
    release: "perfectionism and over-optimisation",
    collective:
      "For the next eighteen months the collective pull is towards imagination, compassion and the parts of life that refuse to be measured. Expect conversations about art, spirituality, mental health, forgiveness, rest and the limits of optimisation. Business softens towards meaning, ethics and the human cost of efficiency. Technology gets discussed in terms of what it does to inner life. Relationships want tenderness rather than performance. What the collective is loosening is Virgo's perfectionism, the belief that the right system fixes everything. The wisdom worth carrying forward is Virgo's discipline, because compassion with no follow-through is only a feeling.",
  },
};

function oppositeSign(sign: string): string {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  if (idx < 0) return sign;
  return ZODIAC_SIGNS[(idx + 6) % 12];
}

// Quadrant house systems place cusps in exact opposition, so the south node house is always the
// north node house plus six. Deriving it rather than recalculating guarantees the axis reads as
// an axis, which is the entire point of this page.
function oppositeHouse(house: number): number {
  return ((house + 5) % 12) + 1;
}

function primerSections(northSign: string, southSign: string, shift: CollectiveShift): ReadingSection[] {
  const north = northSign.toLowerCase();
  const south = southSign.toLowerCase();
  return [
    {
      heading: "the nodes are one axis, not two placements",
      body: "The north node and the south node are not planets. They are mathematical points, the two places where the moon's orbit crosses the path the sun appears to travel. Because they are opposite ends of the same line, they always sit exactly across the chart from each other and they always move together. You cannot read one without the other, which is why astrologers talk about the nodal axis rather than about the north node on its own. They also move backwards through the zodiac, and they change signs roughly every eighteen months.",
    },
    {
      heading: "the south node: everything you already know how to do",
      body: "The south node represents what you have already developed. The qualities, the habits, the identities, the coping mechanisms, the version of you that has been getting the job done for years. It is familiar, it is comfortable, and it is where you go automatically when life gets uncertain. The south node is not the bad one. It holds genuine wisdom, hard-won experience and real strengths, and none of that is being taken away from you. The only difficulty with the south node is that it is comfortable, so it is very easy to stay there long after it has stopped growing you.",
    },
    {
      heading: "the north node: the direction you are evolving in",
      body: "The north node is the growth end of the axis. It describes what you are expanding towards, the qualities you have not practised yet and the experiences you have not collected yet. It rarely feels natural, and it is not supposed to. A north node direction feels unfamiliar in exactly the way a new language feels unfamiliar, unpractised rather than wrong. The discomfort is not a warning sign, it is the sensation of doing something for the first time.",
    },
    {
      heading: "the goal is never to reject the south node",
      body: "This is the part most people get wrong. The work is not to abandon your south node and start again as someone else. Everything you built there is the material you grow with. The invitation is to carry the wisdom of the south node forward, consciously, while deliberately choosing the north node direction when the two of them pull in opposite ways. Keep the skills, drop the reflex. That is the whole practice.",
    },
    {
      heading: "why a nodal shift matters for everyone at once",
      body: `Your birth chart holds your own personal nodal axis, fixed from the moment you were born. What is happening now is the collective version: the nodes in the sky have changed signs, moving into ${north} and ${south}, which resets the direction the whole culture is being asked to grow in. ${shift.collective}`,
    },
    {
      heading: "your chart still comes first",
      body: "None of this overrides you. Your own chart is personal and it always takes priority, and your own natal nodes describe a growth direction that stays the same for life. The collective shift is the backdrop, not the script. Think of it as the weather everyone is living in for the next eighteen months, useful for understanding why the people around you are suddenly circling the same questions, and useful for knowing which way the wind is blowing while you get on with your own actual work.",
    },
  ];
}

export function composeNodeIngress(event: CalendarEventInput, chart: ChartData): LunationReading {
  const northSign = event.sign;
  const southSign = oppositeSign(northSign);
  const north = northSign.toLowerCase();
  const south = southSign.toLowerCase();

  const cusps = chart.houses.map((h) => h.longitude);
  const northHouse = houseForSign(northSign, cusps);
  const southHouse = oppositeHouse(northHouse);
  const nh = HOUSE_MEANINGS[northHouse - 1];
  const sh = HOUSE_MEANINGS[southHouse - 1];
  const northNote = NORTH_HOUSE[northHouse - 1];
  const southNote = SOUTH_HOUSE[southHouse - 1];
  const northArea = HOUSE_AREA[northHouse - 1];
  const southArea = HOUSE_AREA[southHouse - 1];

  const shift = COLLECTIVE[northSign] ?? COLLECTIVE.Aries;

  const date = new Date(`${event.date}T12:00:00Z`);
  const dateLabel = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const chartParagraphs = [
    `The north node moves into your ${ordinalHouse(northHouse)} house of ${nh.title}, ${nh.rules}. That makes this the part of your life the sky spends the next eighteen months pushing you to grow into, and specifically it is asking for ${northNote.growingToward}. ${nh.coach}`,
    `At the same time, the south node activates the house directly opposite, your ${ordinalHouse(southHouse)} house of ${sh.title}, ${sh.rules}. This is the end of the axis you already know how to work. When things get uncertain, your reflex is ${southNote.comfort}, because it has worked before and it costs you nothing to reach for.`,
    `The two houses are one story, not two. Every time something is at stake and you fall back on your ${southArea}, you are choosing the familiar end of the axis. Every time you put your attention and your risk into your ${northArea} instead, you are choosing the growth end. Nothing here turns on a single dramatic decision, it happens in the small choices where you could genuinely go either way.`,
    `What you are gently releasing is ${southNote.outgrow}. Not the whole house, just the reflex. What you keep, and what the north node genuinely needs from you, is the strength you built over there: ${southNote.gift}. Carry that into your ${ordinalHouse(northHouse)} house work and it stops being a leap into the unknown, it becomes an experienced person trying something new.`,
  ];

  const degreeNote: ReadingSection | undefined =
    event.degree >= 29
      ? {
          heading: "why 29 degrees matters here",
          body: "Every sign runs from 0 to 29 degrees, and the 29th is the last one, known as the anaretic or critical degree. Traditionally it is read as the degree of completion and mastery. The sign has run its full course by that point, there is nothing left to learn there, and the only thing left to do is finish. Astrologers watch it closely because things sitting at 29 degrees rarely sit still. It is the degree of endings that come immediately before a new cycle begins, so transits landing there tend to arrive as decisions rather than as moods. This is why people so often describe feeling pushed when something important hits 29 degrees, the conversation that finally happens, the job or the relationship that resolves itself without much warning, the breakthrough that turns up after months of nothing. The pressure is not a punishment, it is a chapter closing that had already finished being useful. One detail worth knowing here: because the nodes travel backwards through the zodiac, a nodal shift always enters a sign at its very last degree and works its way back towards 0. This entire eighteen month cycle opens on the degree of completion, which is a fairly on the nose way for a new growth direction to start.",
        }
      : undefined;

  const bettysTake = `Here is what this actually looks like in an ordinary week, because a nodal shift is not a dramatic event, it is a slow change in what gets rewarded. You will catch yourself reaching for your ${southArea} the moment anything gets uncertain, and that reflex is not a character flaw, it is years of evidence that it works. All the shift asks is that you notice the reach and, some of the time, choose the other way. Not every time. Some of the time. The people who get the most out of an eighteen month cycle like this are never the ones who blow their life up in week one. They are the ones who make one slightly uncomfortable choice towards their ${northArea} every week and look unrecognisable a year later. Expect the awkward version first: the sentence that comes out clumsy, the decision you second-guess for a fortnight, the thing you do badly because you have never done it before. That is not evidence you got the direction wrong, it is what unpractised looks like. Meanwhile the culture around you is pulling towards ${shift.pull} and away from ${shift.release}, so the conversations, the opportunities and the general pressure will lean that way too. Your own chart still matters most. This is just the tide you are swimming in while you get on with it.`;

  const theMove = `Growing into your ${ordinalHouse(northHouse)} house is not a mindset, it is a set of choices, and one real move beats a year of understanding the theory. Pick one of these and actually do it this month.`;

  const moveQuestions = [
    `What version of yourself have you outgrown, the one built around your ${southArea}, that you are still describing as the real you.`,
    `Where are you still introducing yourself as an older version of yourself, at work, in your relationships or in your own head.`,
    `What familiar pattern are you ready to release, knowing it is the reflex going and not the strength underneath it.`,
    `What are you keeping from your ${ordinalHouse(southHouse)} house, and where could it genuinely help you in your ${ordinalHouse(northHouse)} house.`,
    `What are you choosing instead, in one plain sentence, specific enough that you would notice yourself living it.`,
  ];

  return {
    title: `the nodes shift into ${north} and ${south}`,
    dateLabel,
    emoji: "\u{260A}",
    whatThisIs: `Roughly every eighteen months the lunar nodes change signs, and the growth direction for the entire collective changes with them. On this date the north node moves into ${north} and the south node into ${south}, which resets what the culture is being pulled towards for the next year and a half. Most people have never heard of the nodes, so here is what they actually are, what this shift means for everyone, and what it means in your chart specifically.`,
    primerTitle: "the nodes, explained",
    primer: primerSections(northSign, southSign, shift),
    inYourChart: chartParagraphs.join(" "),
    chartParagraphs,
    degreeNote,
    bettysTake,
    theMove,
    moveOptions: northNote.moves,
    moveQuestions,
    journalPrompt: `When things feel uncertain I reach for my ${southArea}. What would I do differently if I trusted my ${northArea} to hold me.`,
    affirmation: `I bring the wisdom of my ${southArea} with me, and I keep choosing my ${northArea} anyway.`,
  };
}
