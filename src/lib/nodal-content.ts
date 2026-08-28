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
export const HOUSE_AREA = [
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

export const NORTH_HOUSE: NorthHouseNote[] = [
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

export const SOUTH_HOUSE: SouthHouseNote[] = [
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

// The sign layer. The house notes above answer "which part of your life", these answer "what kind
// of energy", and without them a nodal reading names the two signs in the title and then never
// explains what either one actually means. Each entry is written to work at BOTH ends of the axis:
// when the sign holds the north node it supplies the growth ask and the honest note on how that
// growth feels, and when it holds the south node it supplies the genuine strength being kept and
// the reflex being outgrown. Voice as everywhere else: cosmic coach, British spellings, plain.
interface SignNodeNote {
  /** What this sign is actually about, in one sentence someone new to astrology can hold. */
  essence: string;
  /** What growing towards this sign asks of you in practice. */
  northAsk: string;
  /** Honestly, how that growth feels at first. This is what stops people thinking they went wrong. */
  northFeels: string;
  /** The real, hard-won strength this sign built. Never framed as something to abandon. */
  southGift: string;
  /** The reflex, not the strength: the automatic move that has quietly stopped growing you. */
  southReflex: string;
}

export const SIGN_NODE: Record<string, SignNodeNote> = {
  Aries: {
    essence:
      "the raw start of the zodiac, self as a starting point rather than a conclusion, all instinct, courage and appetite for going first",
    northAsk:
      "wanting something openly and moving on it before you have consensus, permission or a guarantee it will work",
    northFeels:
      "selfish, at first. Anyone who has spent years being accommodating tends to read their own straightforward wanting as rudeness, and it usually is not, it is just unfamiliar volume",
    southGift:
      "genuine courage, the ability to start from nothing, and a nervous system that does not need a committee before it acts",
    southReflex:
      "charging at everything alone, treating every situation as something to be won, and mistaking speed for direction",
  },
  Taurus: {
    essence:
      "the steady, embodied end of the zodiac, concerned with what is real and touchable, what lasts, and what is genuinely enough",
    northAsk:
      "slowing down enough to build something that holds, and letting your own comfort, pleasure and worth be legitimate reasons for a decision",
    northFeels:
      "boring, and slightly like you are getting away with something. If your worth has been tied to intensity, steadiness reads as stagnation before it starts reading as peace",
    southGift:
      "real staying power, an instinct for value, and the ability to make anything you touch feel solid and safe",
    southReflex:
      "digging in past the point of usefulness, calling stubbornness loyalty, and staying somewhere comfortable long after it stopped being alive",
  },
  Gemini: {
    essence:
      "the curious, quicksilver end of the zodiac, the part of us that asks, connects, chats, tries things and refuses to pretend it already knows",
    northAsk:
      "asking the question instead of nodding, staying interested in the detail in front of you, and letting yourself be a beginner in public",
    northFeels:
      "scattered and unserious, especially if you are used to having the whole answer. Curiosity looks like a lack of conviction from the inside, right up until it starts opening doors",
    southGift:
      "a genuinely nimble mind, the ability to talk to anyone, and a knack for making complicated things land simply",
    southReflex:
      "collecting information instead of acting on it, and keeping everything light and clever so nothing ever has to get deep enough to matter",
  },
  Cancer: {
    essence:
      "the feeling, belonging end of the zodiac, concerned with care, safety, roots and the people who count as yours",
    northAsk:
      "letting yourself actually need people, tending to your inner life as seriously as your output, and building something that feels like home",
    northFeels:
      "exposing, and inefficient. Softness feels like a liability when you have been rewarded for competence, and asking for care can feel more frightening than doing it all yourself",
    southGift:
      "deep emotional intelligence, real loyalty, and the ability to make people feel held without being asked",
    southReflex:
      "mothering everyone as a way of staying needed, retreating into the familiar when you are hurt, and calling avoidance self-protection",
  },
  Leo: {
    essence:
      "the heart of the zodiac, the part of us that wants to be seen as itself, that creates for the joy of it and needs to be genuinely witnessed",
    northAsk:
      "letting yourself be the one in the room, taking up space as you actually are, and making the thing you would make even if nobody clapped",
    northFeels:
      "arrogant and dangerously visible. Everyone who has spent years being the reliable one behind the scenes feels like a fraud the first few times they step forward",
    southGift:
      "warmth, courage, presence, and the rare ability to make other people feel like the main character when you are with them",
    southReflex:
      "needing the applause to know you are real, performing a version of yourself instead of being one, and going quiet the moment attention moves elsewhere",
  },
  Virgo: {
    essence:
      "the craft and service end of the zodiac, concerned with the useful detail, doing the work properly and getting quietly better at things",
    northAsk:
      "showing up for the unglamorous daily version of your ambition, refining rather than expanding, and being genuinely useful to real people",
    northFeels:
      "small. After years of big-picture thinking, attending to the practical detail can feel like a demotion, right up until the detail is what makes the vision actually work",
    southGift:
      "discernment, real competence, and the ability to see exactly what needs fixing and then fix it",
    southReflex:
      "perfecting as a way of postponing, criticising yourself into paralysis, and being so useful to everyone that nobody thinks to ask what you need",
  },
  Libra: {
    essence:
      "the relational end of the zodiac, concerned with the other person, with fairness, and with what beauty and balance do to a life",
    northAsk:
      "genuinely letting someone else in, choosing partnership over doing it all yourself, and caring how it lands for the other person",
    northFeels:
      "like a loss of control. If independence is your identity, consulting someone can feel like giving away power rather than building something two people are actually in",
    southGift:
      "grace, real fairness, and the ability to make almost anyone feel considered and comfortable",
    southReflex:
      "keeping the peace at the cost of the truth, dissolving into whoever you are with, and mistaking being agreeable for being kind",
  },
  Scorpio: {
    essence:
      "the depth end of the zodiac, concerned with truth under the surface, real intimacy, power and everything people prefer not to say out loud",
    northAsk:
      "going all the way in, saying the true thing, and letting something matter enough that losing it would genuinely cost you",
    northFeels:
      "unsafe. Depth asks you to stop managing the situation, and for anyone used to keeping things pleasant and level, that feels less like growth and more like freefall",
    southGift:
      "emotional honesty, a total absence of naivety about people, and the ability to sit with what most people flinch from",
    southReflex:
      "treating intensity as proof of meaning, controlling through withholding, and creating a crisis when things get calm enough to feel exposed",
  },
  Sagittarius: {
    essence:
      "the meaning-seeking end of the zodiac, concerned with the wider view, with faith, freedom and what all of this is actually for",
    northAsk:
      "trusting your own read of the bigger picture, saying the honest thing without over-qualifying it, and going somewhere you have not been",
    northFeels:
      "reckless and under-researched. If you are used to knowing every detail before you move, acting on conviction alone feels like guessing",
    southGift:
      "genuine perspective, honesty, and a refusal to shrink a big idea down to make other people comfortable",
    southReflex:
      "always looking at the next horizon so you never have to be present in this one, and preaching the philosophy instead of living the specific",
  },
  Capricorn: {
    essence:
      "the structural end of the zodiac, concerned with the long build, real authority, and what you are willing to be responsible for",
    northAsk:
      "committing to something that takes years, being the adult in the room, and building a structure that holds without you having to hold it",
    northFeels:
      "heavy and exposing. Taking responsibility publicly means being visibly accountable if it fails, which is precisely why it grows you",
    southGift:
      "discipline, real credibility, and the ability to keep going long after the initial enthusiasm has worn off",
    southReflex:
      "achieving as a way of earning the right to exist, carrying everything alone, and calling self-abandonment being professional",
  },
  Aquarius: {
    essence:
      "the collective end of the zodiac, the outsider and the systems thinker, concerned with the whole, the future, and what should be different for everyone rather than just for you",
    northAsk:
      "contributing to something bigger than your own name, thinking in systems rather than in personalities, and letting your difference be the point rather than the problem",
    northFeels:
      "cold and a bit lonely at first, especially coming from leo. Mattering without applause is a genuinely different sensation to being adored, and it takes a while before it stops feeling like being ignored",
    southGift:
      "originality, a clear head under pressure, and the ability to see the whole board when everyone else is arguing about one square",
    southReflex:
      "detaching the second something gets emotionally close, hiding behind ideas and principles, and staying the outsider because belonging would mean risking something",
  },
  Pisces: {
    essence:
      "the dissolving end of the zodiac, concerned with compassion, imagination, surrender and everything that cannot be measured",
    northAsk:
      "trusting what you sense before you can prove it, letting go of the need to have it all planned, and making room for rest, art and the unexplainable",
    northFeels:
      "vague and irresponsible. Anyone trained to justify every decision with a reason finds intuition almost impossible to take seriously at first",
    southGift:
      "deep empathy, imagination, and an instinct for what someone is really feeling underneath what they are saying",
    southReflex:
      "escaping instead of deciding, absorbing everyone else's feelings until you cannot locate your own, and calling drift open-mindedness",
  },
};

export function signNode(sign: string): SignNodeNote {
  return SIGN_NODE[sign] ?? SIGN_NODE.Aries;
}

// The collective layer, and the biggest block of writing on the page. A nodal shift is genuinely
// world-level news before it is personal news, so the reading now teaches the whole story first,
// at length, and only then narrows into her chart. Keyed by sign and written to work at either end
// of the axis: whichever sign holds the north node supplies asNorth/asNorthWorld, and its opposite
// supplies asSouth/asSouthRelease. Twelve entries therefore cover all twelve axes.
interface SignCollective {
  /** What this growth direction means for everyone, the meaning of the next eighteen months. */
  asNorth: string;
  /** What that actually looks like out in the world: culture, work, technology, relationships. */
  asNorthWorld: string;
  /** What the collective genuinely built while this sign held the north node, the last cycle. */
  asSouth: string;
  /** What the culture is loosening now, and the part of it worth carrying forward. */
  asSouthRelease: string;
}

const SIGN_COLLECTIVE: Record<string, SignCollective> = {
  Aquarius: {
    asNorth:
      "With the north node in aquarius, the growth direction for everyone alive right now points away from the individual and towards the whole. Aquarius is the sign of the collective, the network, the system and the future, and it is fundamentally uninterested in who gets the credit. For the next eighteen months the question sitting underneath almost every conversation becomes some version of whether a thing works for everybody, or only for the person standing at the front. That is a genuinely different question to the one we have been asking, and it reorganises what gets rewarded. Aquarius is also the sign of the outsider, so this cycle tends to hand influence to the people who were previously considered too strange, too early or too far outside the room, and it asks the rest of us to actually listen to them.",
    asNorthWorld:
      "In practice this looks like a return to the group. Expect community to stop being a marketing word and start being the actual product, audiences that participate rather than watch, and movements that outlive whoever started them. Work reorganises around networks, collaboration and shared ownership, and the lone genius model starts to look dated. Technology accelerates hard and becomes openly political, because aquarius rules both innovation and the ethics of who it is for, so the fights of this cycle are about access, automation, data and who exactly benefits. Reform energy rises: systems that have quietly not worked for most people get named and challenged rather than tolerated. Relationships widen towards chosen family, friendship as a primary bond, and structures that suit the people in them rather than the traditional template. It can feel impersonal and occasionally cold, and that is the trade of this axis being made in public.",
    asSouth:
      "For the last cycle the collective has been living the aquarius end, and it built real things. We got radical individuality, an enormous appetite for the new, technology adopted at speed, and a genuine loosening of the rules about who is allowed to belong to what. Aquarius taught the culture to question the system rather than assume it was correct, to organise across distance, and to treat difference as interesting rather than shameful. Whole communities that could never have found each other did, because aquarius makes the network do the work that geography used to do.",
    asSouthRelease:
      "What is loosening is the aquarius reflex rather than the aquarius gift: detachment dressed up as objectivity, having the correct opinion about everything while remaining at a careful distance from all of it, and belonging to a cause more comfortably than belonging to an actual person. The endless novelty tires too, the sense that the next new thing will fix what the last new thing did not. What is worth carrying forward is aquarius's clear-eyed refusal to accept a broken system just because it is the one we inherited, because warmth without that clarity turns into sentiment that changes nothing.",
  },
  Leo: {
    asNorth:
      "With the north node in leo, the collective growth direction points towards the heart, the individual and the courage to be seen as yourself. Leo is the sign of creative self-expression, play, generosity and genuine presence, and it insists that a person is not a data point. After a stretch of thinking in systems, this cycle asks everyone to remember that everything is made by somebody, and that being witnessed and loved as you actually are is a real human need rather than a vanity. The growth here is permission: to want, to make, to be delighted by something, and to stop hiding the parts of yourself that are not strategically useful.",
    asNorthWorld:
      "Expect the individual voice to come back into focus. Culture rewards personality, craft and things that are obviously made by a human, and there is a visible hunger for warmth, showmanship, colour and joy after a colder period. Creative work matters more than analysis of creative work. Leadership becomes personal again, and people follow people rather than institutions. Romance, performance and celebration return as things worth taking seriously rather than as frivolous. The risk everyone runs in a leo cycle is confusing being seen with being valuable, so the culture will also produce a great deal of noise made purely for attention, and the work is telling the two apart.",
    asSouth:
      "The leo end of the axis is where the collective has been living, and it built genuinely good things. We learned that anyone can make and publish, that visibility is not reserved for the already powerful, and that self-expression is not the same as arrogance. Leo gave the culture heart, courage, colour and a real democratisation of who gets to be looked at, and an enormous number of people found their voice inside that.",
    asSouthRelease:
      "What is loosening is the spotlight economy: the assumption that a personal brand is the same thing as a contribution, that being widely seen proves the work was worth doing, and that the loudest presence in the room is the most valuable one. The exhausting part of this era, performing yourself constantly in order to stay real, is the reflex being outgrown. What is worth carrying forward is leo's heart, because a movement with no warmth in it does not hold people for long, and a system designed by people who forgot how to be delighted tends not to be a system anyone wants to live inside.",
  },
  Aries: {
    asNorth:
      "With the north node in aries, the collective growth direction points towards self-determination, courage and the willingness to move first. Aries is the raw start of the zodiac, and it has no patience for consensus that never resolves into action. For eighteen months the culture rewards deciding, going, and being willing to be wrong in public rather than being carefully undecided in private. The invitation is to stop waiting for everyone to agree before anything is allowed to happen.",
    asNorthWorld:
      "Expect speed. Solo founders over committees, direct speech over careful diplomacy, conviction over consensus, and a general impatience with process for its own sake. Business gets faster and more willing to break something. Technology favours tools that let one person do what used to take a team. Relationships get an honesty audit, and the polite arrangements that were quietly costing somebody their identity tend not to survive it. Conflict rises, because aries would rather have the argument than maintain a peace that is not real.",
    asSouth:
      "The aries end built genuine courage into the culture: a willingness to start from nothing, to back yourself, and to act without a committee's blessing. It taught people that wanting something openly is not shameful and that beginning badly beats not beginning.",
    asSouthRelease:
      "What is loosening is the reflex of charging at everything alone, treating every situation as something to be won, and mistaking speed for direction. What is worth keeping is the courage itself, because collaboration made only of people who cannot act alone is just a slower way of avoiding the decision.",
  },
  Taurus: {
    asNorth:
      "With the north node in taurus, the collective growth direction points towards what is real, slow and touchable. Taurus is the body, the land, the material and the question of what is genuinely enough. After a period of intensity and leverage, this cycle asks everyone to build something that actually holds, and to accept that steady is not the same as stagnant.",
    asNorthWorld:
      "Expect conversations about ownership, land, food, craft, the body and money you can see. Business starts favouring steady margins over leveraged bets. Technology gets judged on whether it improves material life rather than on how clever it sounds. Relationships get quieter and more practical, built on consistency rather than intensity. Slowness itself becomes aspirational, and there is a visible turn towards making things properly and keeping them.",
    asSouth:
      "The taurus end gave the collective an instinct for value, real staying power, and the ability to make things solid. It taught the culture to care about quality, comfort and the difference between price and worth.",
    asSouthRelease:
      "What is loosening is digging in past the point of usefulness, calling stubbornness loyalty, and staying somewhere comfortable long after it stopped being alive. What is worth keeping is the respect for what lasts, because transformation with nothing solid underneath it is just churn.",
  },
  Gemini: {
    asNorth:
      "With the north node in gemini, the collective growth direction points towards curiosity, questions and the willingness to not already know. Gemini is the sign of the nimble mind, the conversation and the local detail, and this cycle asks everyone to get interested again rather than defending a fixed position.",
    asNorthWorld:
      "Expect a return to talking. Conversation formats, local news, neighbourhood-scale connection, writing, teaching and the small exchange become more valuable than the grand pronouncement. Culture rewards people who can explain complicated things simply and who change their mind in public. Information moves fast and gets messier, and media fragments further towards many voices rather than a few authorities.",
    asSouth:
      "The gemini end built genuine agility into the culture: an ability to talk to anyone, to move between worlds, and to make complicated things land simply.",
    asSouthRelease:
      "What is loosening is collecting information instead of acting on it, and keeping everything light and clever so nothing ever has to get deep enough to matter. What is worth keeping is the curiosity, because conviction without it hardens into something nobody can talk to.",
  },
  Cancer: {
    asNorth:
      "With the north node in cancer, the collective growth direction points towards care, belonging and the inner life. Cancer is home, roots, family both given and chosen, and the honest admission that people need each other. After a stretch of achievement and structure, this cycle asks what all the building was actually for.",
    asNorthWorld:
      "Expect home, housing, care work and the domestic to become political and central rather than background. Emotional honesty becomes acceptable in places that previously did not allow it, including work. Business is judged on how it treats people, not only on what it produces. Relationships deepen towards safety and real belonging, and there is a broad turn inward, towards fewer people and more depth.",
    asSouth:
      "The cancer end built deep emotional intelligence and real loyalty into the culture, and it taught people to make each other feel held.",
    asSouthRelease:
      "What is loosening is retreating into the familiar whenever things get hard, and mothering everyone as a way of staying needed. What is worth keeping is the care itself, because ambition with no tenderness in it burns through the people it needs.",
  },
  Virgo: {
    asNorth:
      "With the north node in virgo, the collective growth direction points towards craft, usefulness and the unglamorous daily detail. Virgo is the sign of doing the work properly, and this cycle rewards competence, repair and getting quietly better at things over vision that never touches the ground.",
    asNorthWorld:
      "Expect a turn towards health, routine, food, systems that actually function, and work that is genuinely useful to real people. Craft and expertise regain status. Culture gets impatient with grand promises and interested in whether the thing works. Repair, maintenance and improvement start to matter as much as invention.",
    asSouth:
      "The virgo end built discernment and real competence into the culture, and an eye for exactly what needs fixing.",
    asSouthRelease:
      "What is loosening is perfectionism as postponement and criticism as a personality. What is worth keeping is the standard, because compassion with no rigour behind it does not actually help anybody.",
  },
  Libra: {
    asNorth:
      "With the north node in libra, the collective growth direction points towards the other person: fairness, partnership, and what beauty and balance do to a life. Libra insists that how something lands for someone else is part of whether it was right, and this cycle asks everyone to stop doing it all alone.",
    asNorthWorld:
      "Expect diplomacy, negotiation, alliances and design to matter more. Conversations about fairness, justice and who is at the table get louder. Business leans towards partnership and away from the solo empire. Relationships become a serious subject rather than a soft one, and aesthetics return as something worth caring about.",
    asSouth:
      "The libra end built grace and fairness into the culture, and an ability to make people feel considered.",
    asSouthRelease:
      "What is loosening is keeping the peace at the cost of the truth, and dissolving into whoever is loudest. What is worth keeping is the fairness, because independence without it is just selfishness with better branding.",
  },
  Scorpio: {
    asNorth:
      "With the north node in scorpio, the collective growth direction points towards depth, truth and everything sitting under the surface. Scorpio is intimacy, power and honesty about both, and this cycle asks everyone to stop managing the situation and say the true thing.",
    asNorthWorld:
      "Expect what was hidden to surface: money, power, abuse, ownership and who really controls what. Investigations, exposures and reckonings define the period. Culture loses patience with the pleasant surface and wants the real story. Relationships get more intense and less casual, and shared resources become a central question.",
    asSouth:
      "The scorpio end built emotional honesty into the culture and an absence of naivety about power.",
    asSouthRelease:
      "What is loosening is treating intensity as proof of meaning, and creating crisis when things get calm. What is worth keeping is the refusal to look away, because comfort without honesty about power curdles into complacency.",
  },
  Sagittarius: {
    asNorth:
      "With the north node in sagittarius, the collective growth direction points towards meaning, faith and the wider view. Sagittarius asks what all of this is actually for, and this cycle rewards conviction, honesty and a willingness to go somewhere unfamiliar.",
    asNorthWorld:
      "Expect big questions to return: belief, philosophy, education, travel, and the stories a culture tells about itself. Publishing, teaching and long-form thinking gain ground. There is an appetite for optimism and for people who will say what they actually think without qualifying it into meaninglessness.",
    asSouth:
      "The sagittarius end gave the culture perspective, honesty and a refusal to shrink big ideas down to keep everyone comfortable.",
    asSouthRelease:
      "What is loosening is always looking at the next horizon so nobody has to be present in this one, and preaching the philosophy rather than living the specific. What is worth keeping is the faith, because detail with no meaning behind it is just admin.",
  },
  Capricorn: {
    asNorth:
      "With the north node in capricorn, the collective growth direction points towards structure, responsibility and the long build. Capricorn asks who is actually accountable, and this cycle rewards the people willing to be the adult in the room and to commit to something that takes years.",
    asNorthWorld:
      "Expect institutions, law, governance and infrastructure to dominate. Culture gets serious and more interested in competence than charisma. Business favours durability over hype. Authority itself is the theme, both the demand for it and the argument about who has earned it.",
    asSouth:
      "The capricorn end built discipline and credibility into the culture, and the ability to keep going after the enthusiasm wore off.",
    asSouthRelease:
      "What is loosening is achievement as the price of existing, and carrying everything alone. What is worth keeping is the discipline, because care with no structure behind it cannot hold anyone for long.",
  },
  Pisces: {
    asNorth:
      "With the north node in pisces, the collective growth direction points towards compassion, imagination and everything that cannot be measured. Pisces dissolves the hard edges, and this cycle asks everyone to trust what they sense, make room for rest and art, and accept that not all of it will be provable.",
    asNorthWorld:
      "Expect spirituality, art, music, film and the unexplainable to matter more, alongside a real turn towards collective compassion, care for the vulnerable and the limits of pure logic. Boundaries blur, in both the beautiful and the confusing sense. Rest becomes a legitimate subject rather than a failure.",
    asSouth:
      "The pisces end gave the culture empathy and imagination, and an instinct for what people are really feeling underneath what they say.",
    asSouthRelease:
      "What is loosening is escaping instead of deciding, and drifting while calling it open-mindedness. What is worth keeping is the compassion, because precision with no mercy in it is just cruelty that files its paperwork correctly.",
  },
};

function signCollective(sign: string): SignCollective {
  return SIGN_COLLECTIVE[sign] ?? SIGN_COLLECTIVE.Aries;
}

// Sign names are lowercased throughout this reading to match the brand voice, so they need
// re-capitalising when one has to open a sentence.
function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function oppositeSign(sign: string): string {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  if (idx < 0) return sign;
  return ZODIAC_SIGNS[(idx + 6) % 12];
}

// Transiting true-node axis by date. The north node backs through the zodiac roughly every
// eighteen months, so the sign is a slow date lookup, not a per-chart calculation. These are the
// true-node sign-ingress dates (US Eastern, matching the node_ingress events the calendar route
// derives from SE_TRUE_NODE, and everyone's natal chart which also reads the true node).
//
// This exists because an eclipse can fall in the sign NEXT DOOR to the node it sits on, right at a
// cusp like the 2026 Pisces to Aquarius turn: the 27-28 August 2026 lunar eclipse is at ~5 Pisces,
// but the true node had already backed into Aquarius weeks earlier (before the 12 August Leo
// eclipse). So the node axis must be read from the node itself, never from the eclipse's own sign.
// Extend this list when the node changes sign next.
const NODE_INGRESSES: { from: string; north: string }[] = [
  { from: "2026-07-26", north: "Aquarius" },
  { from: "2025-01-11", north: "Pisces" },
  { from: "2023-07-17", north: "Aries" },
  { from: "2022-01-18", north: "Taurus" },
  { from: "2020-05-05", north: "Gemini" },
  { from: "2018-11-06", north: "Cancer" },
];

/** The sign the transiting north node is in on a given date (ISO). Falls back to the oldest entry
 *  for dates before the table starts. */
export function transitingNorthNodeSign(dateISO: string): string {
  for (const period of NODE_INGRESSES) {
    if (dateISO >= period.from) return period.north;
  }
  return NODE_INGRESSES[NODE_INGRESSES.length - 1].north;
}

// Quadrant house systems place cusps in exact opposition, so the south node house is always the
// north node house plus six. Deriving it rather than recalculating guarantees the axis reads as
// an axis, which is the entire point of this page.
export function oppositeHouse(house: number): number {
  return ((house + 5) % 12) + 1;
}

function primerSections(northSign: string, southSign: string): ReadingSection[] {
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
      heading: `first, what ${north} actually is`,
      body: `Knowing the nodes have moved is not much use until you know what they moved into, so here is ${north} itself. ${capitalise(northSign)} is ${signNode(northSign).essence}. With the north node here, the growth ask for the next eighteen months is ${signNode(northSign).northAsk}. Worth saying plainly, because most people panic at this part: ${signNode(northSign).northFeels}. That is the correct experience of a north node, not a sign you have misread it.`,
    },
    {
      heading: `the ${north} north node: what all of us are growing towards`,
      body: `${signCollective(northSign).asNorth}`,
    },
    {
      heading: `what the ${north} shift looks like out in the world`,
      body: `${signCollective(northSign).asNorthWorld}`,
    },
    {
      heading: `the ${south} south node: what we already built together`,
      body: `Now the other end, because an axis is one story. ${capitalise(southSign)} is ${signNode(southSign).essence}, and it is not the villain here. ${signCollective(southSign).asSouth}`,
    },
    {
      heading: "what the culture is loosening now, and what it keeps",
      body: `${signCollective(southSign).asSouthRelease} This is the distinction that matters for the whole eighteen months, collectively and personally: the reflex goes, the strength stays. Nobody is being asked to stop being ${south}, only to stop reaching for it automatically the moment something is at stake.`,
    },
    {
      heading: "why a nodal shift matters for everyone at once",
      body: `Your birth chart holds your own personal nodal axis, fixed from the moment you were born, and it never changes. What is happening now is the collective version: the nodes in the sky have changed signs, moving into ${north} and ${south}, which resets the direction the whole culture is being asked to grow in for the next year and a half. It is the rarest shift on the calendar, roughly one every eighteen months, which is why it is worth understanding properly rather than noting and moving on. Everything above is the same for everyone alive. What follows is the part that is only yours.`,
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

  const northNodeSign = signNode(northSign);
  const southNodeSign = signNode(southSign);

  const chartParagraphs = [
    `The north node moves into ${north} in your ${ordinalHouse(northHouse)} house of ${nh.title}, ${nh.rules}. Those two things are one instruction, not two: ${north} is the ${northNodeSign.essence.replace(/^the /, "")}, and your ${ordinalHouse(northHouse)} house is where you will be asked to live it. That makes this the part of your life the sky spends the next eighteen months pushing you to grow into, and specifically it is asking for ${northNote.growingToward}. ${nh.coach}`,
    `In practice, ${north} growth here means ${northNodeSign.northAsk}. Be ready for how it lands: ${northNodeSign.northFeels}.`,
    `At the same time, the south node activates ${south} in the house directly opposite, your ${ordinalHouse(southHouse)} house of ${sh.title}, ${sh.rules}. This is the end of the axis you already know how to work. Your ${south} strength is genuine, ${southNodeSign.southGift}, and you are keeping every bit of it. When things get uncertain, though, your reflex is ${southNote.comfort}, because it has worked before and it costs you nothing to reach for. The ${south} habit being outgrown is the narrow one: ${southNodeSign.southReflex}.`,
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
    `What version of yourself have you outgrown, the one built around your ${southArea}, that you are still describing as the real you?`,
    `Where are you still introducing yourself as an older version of yourself, at work, in your relationships or in your own head?`,
    `What familiar pattern are you ready to release, knowing it is the reflex going and not the strength underneath it?`,
    `What are you keeping from your ${ordinalHouse(southHouse)} house, and where could it genuinely help you in your ${ordinalHouse(northHouse)} house?`,
    `What are you choosing instead, in one plain sentence, specific enough that you would notice yourself living it?`,
  ];

  return {
    title: `the nodes shift into ${north} and ${south}`,
    dateLabel,
    emoji: "\u{260A}",
    whatThisIs: `Roughly every eighteen months the lunar nodes change signs, and the growth direction for the entire collective changes with them. On this date the north node moves into ${north} and the south node into ${south}, which resets what the culture is being pulled towards for the next year and a half. Most people have never heard of the nodes, so here is what they actually are, what this shift means for everyone, and what it means in your chart specifically.`,
    primerTitle: "the nodes, explained",
    primer: primerSections(northSign, southSign),
    inYourChart: chartParagraphs.join(" "),
    chartParagraphs,
    degreeNote,
    bettysTake,
    theMove,
    moveOptions: northNote.moves,
    moveQuestions,
    journalPrompt: `When things feel uncertain I reach for my ${southArea}. What would I do differently if I trusted my ${northArea} to hold me?`,
    affirmation: `I bring the wisdom of my ${southArea} with me, and I keep choosing my ${northArea} anyway.`,
  };
}
