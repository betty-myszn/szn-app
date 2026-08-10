/**
 * Money Blueprint — the money vocabulary.
 *
 * Hand-written content tables, keyed by the facts `facts.ts` derives. This is the same pattern the
 * rest of MY SZN uses (`interpretations.ts`, `human-design-content.ts`): the ephemeris decides
 * what is true, these tables decide what it means, and `phrases.ts` composes them into prose.
 *
 * Nothing here asserts that a buyer has a placement. Every entry is a description of what a factor
 * means if present. The entitlement gate in assemble.ts decides what is present.
 */

// ---------------------------------------------------------------------------- signs

export interface MoneySign {
  /** How this sign earns, in a clause that follows "you earn through". */
  earns: string;
  /** The gift, as a noun phrase. */
  gift: string;
  /** The trap, as a clause. */
  trap: string;
  /** Pace word, used when describing rhythm. */
  pace: string;
  /** How this sign receives. */
  receives: string;
  /** Adjective pair for texture. */
  texture: [string, string];
}

export const MONEY_SIGN: Record<string, MoneySign> = {
  Aries: {
    earns: "moving first, backing yourself before the plan is finished and getting to the opportunity while everybody else is still deciding",
    gift: "a genuine instinct for the opening, and the nerve to take it",
    trap: "starting more than you finish, so the income arrives in spikes and the compounding never begins",
    pace: "fast",
    receives: "directly, with very little ceremony, provided nobody makes it awkward",
    texture: ["direct", "fast"],
  },
  Taurus: {
    earns: "patience, quality and holding on, building something solid that keeps its value long after the excitement of building it has gone",
    gift: "an instinct for what lasts, and money that compounds when you leave it alone",
    trap: "growing so attached to the comfort of what you have that the step which would grow it starts to look reckless",
    pace: "slow",
    receives: "easily once trust is established, and almost not at all before then",
    texture: ["steady", "sensual"],
  },
  Gemini: {
    earns: "your voice, your ideas and your ability to say the thing first and say it clearly",
    gift: "range, and the capacity to earn several different ways at once",
    trap: "spreading across so many threads that none of them gets deep enough to compound",
    pace: "quick",
    receives: "lightly, often deflecting with a joke before the compliment has landed",
    texture: ["quick", "articulate"],
  },
  Cancer: {
    earns: "care, safety and the work of holding people, which you do so naturally you forget it is a skill",
    gift: "an instinct for what people need before they say it, and fierce loyalty from those you serve",
    trap: "putting everybody else's security ahead of your own until your own plans are permanently deferred",
    pace: "tidal",
    receives: "warily, because receiving means being seen needing something",
    texture: ["protective", "intuitive"],
  },
  Leo: {
    earns: "presence, warmth and being visibly, unmistakably yourself in front of people",
    gift: "magnetism, and the ability to make an offer feel like an event",
    trap: "tying your worth to the applause, so a quiet season reads as a verdict rather than a season",
    pace: "generous",
    receives: "well in public and less easily in private, where there is no room to give back",
    texture: ["magnetic", "generous"],
  },
  Virgo: {
    earns: "craft, precision and being the one who actually delivers when everybody else approximates",
    gift: "a standard of work most people cannot see, let alone match",
    trap: "pricing the labour rather than the expertise, and refining long past the point anybody is paying for",
    pace: "meticulous",
    receives: "with a correction attached, usually a list of what could have been better",
    texture: ["precise", "useful"],
  },
  Libra: {
    earns: "relationship, taste and the ability to make an exchange feel fair and pleasant to everybody in it",
    gift: "diplomacy that opens doors, and an eye for what is genuinely good",
    trap: "weighting the other person's comfort so heavily that the fairness only ever runs one way",
    pace: "considered",
    receives: "by immediately balancing it, so nothing is ever simply kept",
    texture: ["fair", "gracious"],
  },
  Scorpio: {
    earns: "depth, intensity and the willingness to go where other people will not",
    gift: "the capacity to handle material that would destabilise anybody else, without flinching",
    trap: "keeping money private and controlled until the privacy itself becomes the ceiling",
    pace: "all-or-nothing",
    receives: "rarely and deeply, because receiving creates intimacy and intimacy is exposure",
    texture: ["intense", "private"],
  },
  Sagittarius: {
    earns: "conviction, teaching and the belief that carries other people somewhere new",
    gift: "vision, and the ability to make a bigger future feel genuinely possible",
    trap: "reaching for the next horizon before the last one has finished paying out",
    pace: "expansive",
    receives: "openly and generously, then gives most of it away again",
    texture: ["expansive", "convinced"],
  },
  Capricorn: {
    earns: "structure, endurance and a reputation built one honoured commitment at a time",
    gift: "long-range discipline that produces authority nobody can argue with",
    trap: "deferring the enjoyment to a summit that keeps moving further up the mountain",
    pace: "long-range",
    receives: "only once it has been earned twice over, and preferably documented",
    texture: ["structural", "enduring"],
  },
  Aquarius: {
    earns: "originality, systems thinking and doing it in a way nobody has arranged it before",
    gift: "seeing the flaw in the accepted method years before the market does",
    trap: "being so far outside the norm that the value takes years to become legible to buyers",
    pace: "unpredictable",
    receives: "at a slight distance, having analysed the gesture before feeling it",
    texture: ["original", "detached"],
  },
  Pisces: {
    earns: "imagination, attunement and the capacity to feel what a person or a room actually needs",
    gift: "an almost unfair instinct for the unspoken thing",
    trap: "boundaries dissolving until generosity and self-erasure are indistinguishable",
    pace: "fluid",
    receives: "beautifully, then gives it back in another form",
    texture: ["attuned", "boundless"],
  },
};

// ---------------------------------------------------------------------------- planets

export interface MoneyBody {
  /** Display name. */
  name: string;
  /** What it governs, following "X governs". */
  governs: string;
  /** Its function in one word, for tight clauses. */
  role: string;
  /** What it does when it touches money well. */
  gift: string;
  /** What it does when it is under pressure. */
  strain: string;
  /** A concrete everyday behaviour, so the reading lands as recognition rather than theory. */
  everyday: string;
}

export const MONEY_BODY: Record<string, MoneyBody> = {
  sun: { name: "Sun", governs: "your identity and where you are meant to be visible", role: "identity",
    gift: "a clear sense of who you are in the work, which buyers can feel", strain: "worth becoming conditional on being seen",
    everyday: "You quietly measure whether the work has your name on it, and the projects you resent most are the ones where somebody else took the credit." },
  moon: { name: "Moon", governs: "your emotional safety and what you need in order to feel secure", role: "safety",
    gift: "an instinct for what makes people feel held", strain: "money decisions made to soothe rather than to build",
    everyday: "You will turn down a good financial move on a day you feel unsafe and take a worse one on a day you feel held, and the money was never really the variable." },
  mercury: { name: "Mercury", governs: "your voice, your thinking and how you name a price out loud", role: "voice",
    gift: "language that makes complicated things land", strain: "over-explaining, which reads as uncertainty",
    everyday: "You draft the message, reread it, add a caveat, and send the softened version, and the softened version is the one that underperforms." },
  venus: { name: "Venus", governs: "what you value, what you find beautiful and your whole capacity to receive", role: "receiving",
    gift: "taste, and money that arrives through relationship", strain: "receiving becoming something you must qualify for",
    everyday: "You can spend freely on other people and stall for a week over something that is purely for you." },
  mars: { name: "Mars", governs: "your drive, your appetite and how you go after what you want", role: "drive",
    gift: "the willingness to ask directly and close", strain: "drive turning into either force or paralysis",
    everyday: "You either move on the opportunity before anyone else has finished thinking, or you freeze on it entirely, and there is very little in between." },
  jupiter: { name: "Jupiter", governs: "expansion, luck and how large you let things become", role: "expansion",
    gift: "genuine good fortune wherever it sits", strain: "growth outrunning the structure meant to hold it",
    everyday: "You say yes to more than you can hold because the bigger version is always more interesting than the sensible one." },
  saturn: { name: "Saturn", governs: "restriction, earning, time and the sense that things must be worked for", role: "restriction",
    gift: "authority that compounds and cannot be taken away", strain: "worth treated as a debt still being repaid",
    everyday: "You add the payment plan nobody asked for, and you feel the number physically before you have finished saying it." },
  uranus: { name: "Uranus", governs: "difference, disruption and the part of you that refuses the standard route", role: "difference",
    gift: "originality that becomes the whole brand", strain: "income as unpredictable as the ideas",
    everyday: "You lose interest the moment the work becomes conventional, and the seasons you tried to look like everybody else were your flattest earning years." },
  neptune: { name: "Neptune", governs: "imagination, boundaries and what you cannot quite see clearly", role: "dissolution",
    gift: "vision, and work that touches people somewhere they cannot name", strain: "edges dissolving exactly where terms need to be firm",
    everyday: "You give the friend rate, then the mate's rate, then forget to invoice, and you would struggle to say exactly where the boundary went." },
  pluto: { name: "Pluto", governs: "power, transformation and everything that happens out of sight", role: "power",
    gift: "the ability to rebuild from nothing, more than once", strain: "control tightening until money stops moving",
    everyday: "Nobody, including the people closest to you, knows your actual numbers, and being financially directed by anyone produces a reaction out of all proportion to the situation." },
  chiron: { name: "Chiron", governs: "the wound that does not fully close and becomes your medicine for other people", role: "wound",
    gift: "credibility earned the hard way, which cannot be faked", strain: "giving the healing away because it feels unqualified to charge",
    everyday: "You give away the thing that changes people for free and charge full rate for the part that felt like effort, which is exactly the wrong way round." },
  lilith: { name: "Lilith", governs: "the part of you that was called too much and refuses to be managed", role: "the untamed",
    gift: "the exact quality people remember and pay for", strain: "self-editing that caps every expansion",
    everyday: "You have a version of your offer you believe in and a version you actually sell, and the believed-in one keeps getting filed under one day." },
  north_node: { name: "North Node", governs: "the growth you came here for, which never feels natural at first", role: "direction",
    gift: "a direction that keeps paying once you commit to it", strain: "the pull back toward what is already mastered",
    everyday: "The direction that would genuinely grow you feels flat and slightly beneath you, which is the reliable sign it is the right one." },
  south_node: { name: "South Node", governs: "what you already know so well you could do it asleep", role: "mastery",
    gift: "competence you did not have to earn in this life", strain: "hiding in the mastered thing when growth gets uncomfortable",
    everyday: "You retreat to the thing you are already brilliant at the moment anything gets uncomfortable, and it looks like good judgement from the inside." },
  part_of_fortune: { name: "Part of Fortune", governs: "where ease and fortune meet in your chart", role: "ease",
    gift: "the territory where things go well with least force", strain: "being overlooked precisely because it came easily",
    everyday: "The thing that comes easiest to you is the thing you have priced lowest, because ease never reads as value from the inside." },
};

// ---------------------------------------------------------------------------- houses

export interface MoneyHouse {
  /** Short label. */
  label: string;
  /** What it means for money, following "the Nth house of". */
  of: string;
  /** Full money reading, used when a house is the subject. */
  money: string;
  /** Where income arrives from when this house rules or holds the money. */
  channel: string;
}

export const MONEY_HOUSE: Record<number, MoneyHouse> = {
  1: { label: "self and presence", of: "self, body and how you arrive in a room",
    money: "money that comes through your presence, your name and simply being the person in front of people",
    channel: "your own visibility and personal brand" },
  2: { label: "income and worth", of: "your own income, possessions and self-worth",
    money: "the house of what you personally earn and what you believe you are worth, which are the same question wearing different clothes",
    channel: "your own earning, directly" },
  3: { label: "voice and the everyday", of: "voice, writing, learning and the near-at-hand",
    money: "money made through words, teaching, the daily and the local rather than the epic",
    channel: "writing, speaking and everyday communication" },
  4: { label: "home and roots", of: "home, family, foundations and where you came from",
    money: "money tied to home, property, family patterns and the security you did or did not have early",
    channel: "home, property and family" },
  5: { label: "creativity and play", of: "creativity, pleasure, risk and what you make for the joy of it",
    money: "money through creative work, speculation and the things you would do anyway",
    channel: "creative output and calculated risk" },
  6: { label: "work and service", of: "daily work, service, routine and health",
    money: "the mechanics of how you actually work, day to day, and whether that daily shape is sustainable",
    channel: "service, craft and daily working practice" },
  7: { label: "partnership", of: "partnership, contracts and one-to-one work",
    money: "money through partnership, clients and formal agreements with named people",
    channel: "partnerships and one-to-one clients" },
  8: { label: "shared resources", of: "other people's money, intimacy, transformation and what stays hidden",
    money: "the house of other people's money: client money, investment, debt, inheritance, joint finances, and the psychology sitting underneath how anybody handles any of it",
    channel: "other people's resources and transformational work" },
  9: { label: "meaning and teaching", of: "belief, teaching, publishing and the long view",
    money: "money through teaching, publishing, philosophy and carrying people toward a bigger picture",
    channel: "teaching, publishing and travel" },
  10: { label: "career and reputation", of: "career, public standing and what you are known for",
    money: "money that arrives because your reputation arrived first, usually in that order",
    channel: "public reputation and professional standing" },
  11: { label: "community and network", of: "community, network, audience and the groups you belong to",
    money: "money through the group: audience, membership, referral, the people who already know you",
    channel: "community, audience and network" },
  12: { label: "the hidden", of: "solitude, the unseen, endings and what runs behind the scenes",
    money: "money made, behind the scenes, or in work that touches what people keep hidden",
    channel: "unseen work and solitary practice" },
};

// ---------------------------------------------------------------------------- aspects

export interface AspectVoice {
  /** Verb phrase: "Venus <fuses with> Saturn". */
  verb: string;
  /** How the two behave together. */
  dynamic: string;
  /** Whether this reads as friction. */
  hard: boolean;
}

export const ASPECT_VOICE: Record<string, AspectVoice> = {
  conjunction: { verb: "sits fused to", hard: false,
    dynamic: "they operate as a single mechanism and neither one fires without the other" },
  opposition: { verb: "sits directly opposite", hard: true,
    dynamic: "they pull in opposite directions and you tend to swing between them rather than holding both" },
  square: { verb: "grinds against", hard: true,
    dynamic: "they demand incompatible things at the same moment, which produces friction every time the subject comes up" },
  trine: { verb: "flows easily with", hard: false,
    dynamic: "they cooperate so smoothly that the talent involved is almost invisible to you" },
  sextile: { verb: "opens a channel to", hard: false,
    dynamic: "they support each other whenever you deliberately use them together" },
};

// ---------------------------------------------------------------------------- human design

export const HD_TYPE_MONEY: Record<string, { rhythm: string; strategy: string; earns: string; costly: string }> = {
  Manifestor: {
    rhythm: "bursts of real force with genuine rest between them",
    strategy: "inform the people your action will affect, then move",
    earns: "initiating things nobody asked you to start, and announcing them before they land",
    costly: "any model that asks for the same output every day, which your energy was never built to supply",
  },
  Generator: {
    rhythm: "sustainable daily energy, provided the work is genuinely satisfying",
    strategy: "wait to respond, then trust the gut answer",
    earns: "responding to what comes to you and doing work that lights you up in the body",
    costly: "initiating from the mind into work you were never actually asked for",
  },
  "Manifesting Generator": {
    rhythm: "fast, multi-track bursts with abrupt changes of direction",
    strategy: "respond, then inform before you move",
    earns: "several things at once, skipping steps other people need",
    costly: "being forced into one lane, or finishing things that stopped being alive",
  },
  Projector: {
    rhythm: "short, potent working windows rather than long days",
    strategy: "wait for the invitation, and be visible so invitations can find you",
    earns: "guiding, seeing and directing other people's energy",
    costly: "grinding like a Generator, which produces bitterness and burnout",
  },
  Reflector: {
    rhythm: "a lunar cycle, so clarity arrives roughly monthly",
    strategy: "wait a full lunar cycle before major decisions",
    earns: "reflecting the health of a system back to it, which almost nobody else can do",
    costly: "committing quickly, and working in environments that are wrong for you",
  },
};

export const HD_AUTHORITY_MONEY: Record<string, string> = {
  sacral: "Your gut answers in the body, immediately, as a lift or a flattening. Your best money decisions were made in the first two seconds and the expensive ones were talked into being by your mind afterwards.",
  splenic: "Your spleen speaks once,, in the moment, and it does not repeat itself. Every costly financial decision you have made was almost certainly a quiet no you overrode with good reasoning.",
  emotional: "You have no truth in the moment. Your clarity arrives over a wave, which means any money decision made on the day it is offered is a gamble. Sleep on all of them.",
  ego: "Your authority runs through what you genuinely want and have the willpower to sustain. Money decisions work when you can say plainly that you want it.",
  self: "Your direction comes from your identity rather than your feelings. Talk it out loud and listen to what you hear yourself say.",
  environmental: "You decide correctly by talking it through in the right physical space and with the right people around you. Environment is the deciding variable, more than argument.",
  lunar: "Your clarity needs a full lunar cycle. Any money decision made faster than that is somebody else's decision wearing your voice.",
  mental: "You decide correctly by talking it out in the right environment, with people who have no stake in the answer.",
};

/** Open centres: what they absorb, and the specific way it costs money. */
export const HD_OPEN_CENTRE_MONEY: Record<string, { absorbs: string; cost: string; wisdom: string }> = {
  head: { absorbs: "other people's questions and mental pressure",
    cost: "you take on problems that were never yours to solve, unpaid",
    wisdom: "you can tell which questions are actually worth answering" },
  ajna: { absorbs: "certainty, opinions and other people's frameworks",
    cost: "you doubt conclusions you already reached and over-research before pricing",
    wisdom: "you hold ideas lightly enough to change your mind when the evidence does" },
  heart: { absorbs: "worth, willpower and the drive to prove",
    cost: "you price from a sense of worth that moves with whoever you were last near",
    wisdom: "you see other people's worth with unusual clarity" },
  sacral: { absorbs: "life force and the capacity for sustained work",
    cost: "you overwork in other people's energy and burn out alone afterwards",
    wisdom: "you understand exhaustion and pacing better than people who never run out" },
  solarplexus: { absorbs: "emotions, moods and the atmosphere of a room",
    cost: "you feel a client's hesitation as your own and lower the number to resolve it",
    wisdom: "you read a room faster and more accurately than almost anybody" },
  spleen: { absorbs: "fear, and other people's sense of what is safe",
    cost: "you hold on to arrangements past their usefulness because letting go feels unsafe",
    wisdom: "you know what genuinely constitutes a risk and what is only nerves" },
  g: { absorbs: "identity and direction",
    cost: "you shape your offer around whoever you are with, so the positioning keeps moving",
    wisdom: "you can meet many different kinds of people where they are" },
  throat: { absorbs: "pressure to speak and be heard",
    cost: "you push to be noticed at the wrong moments and go quiet at the right ones",
    wisdom: "you know when speaking will actually land" },
  root: { absorbs: "pressure, urgency and other people's deadlines",
    cost: "you rush money decisions to get the pressure off, and the rush is what costs you",
    wisdom: "you can tell real urgency from manufactured urgency" },
};

/** Defined centres: the reliable output. */
export const HD_DEFINED_CENTRE_MONEY: Record<string, string> = {
  head: "You generate your own questions and inspiration rather than borrowing them, so the ideas are genuinely yours.",
  ajna: "You hold your conclusions steadily, which reads as authority and is worth charging for.",
  heart: "You have consistent willpower and a fixed sense of your own worth, so promises you make about money tend to hold.",
  sacral: "You have reliable life force for sustained work, provided the work genuinely satisfies you.",
  solarplexus: "You generate your own emotional weather and broadcast it, so the room takes its temperature from you.",
  spleen: "You have a reliable, quiet survival instinct that speaks once in the moment and is almost always right.",
  g: "You have a fixed sense of who you are and where you are going, which makes your direction unusually stable.",
  throat: "You are built to speak things into existence, which makes your voice your most monetisable instrument.",
  root: "You generate your own pressure rather than absorbing it, so you can work under stress that flattens other people.",
};

export const HD_PROFILE_MONEY: Record<string, { line: string; sells: string }> = {
  "1/3": { line: "the Investigator Martyr", sells: "depth of research, learned the hard way through trial and error" },
  "1/4": { line: "the Investigator Opportunist", sells: "well-founded expertise, into a network that already trusts you" },
  "2/4": { line: "the Hermit Opportunist", sells: "a natural gift other people spot before you do, through your network" },
  "2/5": { line: "the Hermit Heretic", sells: "a natural talent that other people project solutions onto" },
  "3/5": { line: "the Martyr Heretic", sells: "hard-won practical fixes, to people who need a solution now" },
  "3/6": { line: "the Martyr Role Model", sells: "lessons learned by living them, and later, by having become the example" },
  "4/6": { line: "the Opportunist Role Model", sells: "through your network first, and later through simply being the example" },
  "4/1": { line: "the Opportunist Investigator", sells: "deep foundations, to people who already know and trust you" },
  "5/1": { line: "the Heretic Investigator", sells: "practical solutions backed by real depth, to people in need of rescue" },
  "5/2": { line: "the Heretic Hermit", sells: "solutions people project onto you, delivered from behind a boundary" },
  "6/2": { line: "the Role Model Hermit", sells: "by example, from a natural gift, with real solitude protecting it" },
  "6/3": { line: "the Role Model Martyr", sells: "the authority of somebody who tried everything and can now show the way" },
};

// ---------------------------------------------------------------------------- themes

export interface ThemeContent {
  /** Human-facing name of the shadow this theme produces. */
  shadow: string;
  /** What it feels like from the inside. */
  felt: string;
  /** Standalone pull quote. Never derived by truncating `felt`, which produced stubs. */
  pullQuote: string;
  /** The lived, day-to-day consequence. Distinct from `mechanism` so the two pages do not repeat. */
  bodyNote: string;
  /** Where it typically comes from. */
  origin: string;
  /** The mechanism, in the body. */
  mechanism: string;
  /** Concrete money behaviours. */
  showsUp: string[];
  /** Two-column cost table rows: [unexamined, worked with]. */
  cost: Array<[string, string]>;
  /** The reframe that moves it. */
  reframe: string;
  /** Numbered steps. */
  steps: Array<[string, string]>;
  /** Protocol material. */
  journal: string[];
  eftSetup: string;
  eftPoints: string;
  hypnosis: string;
  somatic: string;
  affirmations: string[];
  challenge: string;
  /** Gift side, used in the strengths section. */
  gift: string;
}

export const THEME_CONTENT: Record<string, ThemeContent> = {
  worth: {
    shadow: "The Not-Enough Loop",
    felt: "You achieve the thing, and the relief lasts about a day before the bar slides upward and sets you back down in the familiar country of not-quite-enough.",
    pullQuote: "Somewhere underneath all of it sits a place where you are finally allowed to rest, and this keeps moving it further away.",
    bodyNote: "Rest is the thing this pattern will not allow, because stopping registers as exposure rather than as recovery. You will notice it most on the quiet days, when there is nothing to produce and the discomfort arrives anyway.",
    origin: "a childhood in which value had to be continuously demonstrated, where being useful, clever or undemanding was the price of a secure place",
    mechanism: "Your nervous system filed contribution under safety rather than under achievement, so producing became something you need rather than something you do, and a quiet week registers in the body as a threat.",
    showsUp: [
      "You over-deliver on every project, then feel guilty invoicing for the version you actually agreed",
      "Wins land for about a day before the bar moves again",
      "You prove your worth in rooms where nobody asked you to prove anything",
      "You look entirely capable from the outside and privately feel it is all on loan",
      "You negotiate hard for other people and barely at all for yourself",
      "You keep a running ledger of what you owe and almost none of what you are owed",
    ],
    cost: [
      ["Slightly underpaid for excellent work, indefinitely", "Your rates track your skill rather than your confidence"],
      ["Quiet resentment toward clients who accepted what you offered", "You give because you chose to, rather than to secure your place"],
      ["Rest stays impossible and burnout arrives on schedule", "You stop working without your body raising an alarm"],
      ["You reach your fifties still auditioning", "The placement matures into steady authority"],
    ],
    reframe: "Worth built on proof is a container with no bottom, so the answer is to take worth out of the pricing decision altogether and move it onto structure, which holds steady regardless of how you feel on a given morning.",
    steps: [
      ["Price from a document", "Set your rates in writing on a good day and quote from the page rather than from the room."],
      ["Let one win stay banked", "After an achievement, give yourself a fixed week in which the bar may not move."],
      ["Contribute nothing, once", "Be in a group and offer nothing useful. Notice that you are still there."],
      ["Name the borrowed confidence", "When you feel small near somebody, say silently that the confidence belongs to them."],
      ["Charge before you feel ready", "Readiness is the one thing this pattern will never grant you."],
    ],
    journal: [
      "Write about the first time you worked out that you had to be useful in order to be included. Where were you, and what did you decide in that moment?",
      "List your last five achievements and how long each satisfied you before the bar moved. What is the average, in days?",
      "If your worth were a fixed number that could not move based on this week's output, what would you charge?",
    ],
    eftSetup: "Even though I learned that I have to be useful in order to be wanted, I deeply and completely accept myself.",
    eftPoints: "this old feeling of never quite enough · the bar keeps moving · I have been auditioning for years · it made sense when I was small · she did what she had to do · she is safe now · I am allowed to be here without earning it · I let this win stay",
    hypnosis: "Picture yourself in a room of people whose regard you want, and notice the pull to offer something useful. Let yourself stay seated. Nothing is required of you here. Repeat: I belong in this room without contributing anything, and I am safe in the silence between us.",
    somatic: "Before you send any invoice, stand, feel the floor take your full weight, and take three slow breaths with a longer exhale than inhale. Then send it without rereading, because the rereading is where the discount gets added.",
    affirmations: [
      "My worth is not on loan, and it is not up for renegotiation this morning.",
      "I am allowed to belong here without being useful first.",
      "I let this win stay exactly where it landed.",
    ],
    challenge: "For one week, price from your written rate card and add nothing free to any project. On day seven, write down what you actually earned compared with what that week would normally have earned you.",
    gift: "an unusually clear eye for other people's worth, and a standard of work built by somebody who never took her own value for granted",
  },

  receiving: {
    shadow: "The Closed Hand",
    felt: "You are practised at giving, and something in you flinches when the exchange runs the other way, so you even the score fast enough that nothing is ever simply kept.",
    pullQuote: "Your income is capped at exactly the level you can bear to be given to.",
    bodyNote: "Watch the two seconds after somebody offers you something. That flinch is the whole pattern, and it fires long before any reasoning about whether you deserve it.",
    origin: "an early arrangement where being the one who provides was safer than being the one who needs, so needing became the thing to hide",
    mechanism: "Receiving creates a debt in your internal ledger, and the discomfort of holding that debt is resolved by discharging it immediately, usually with more work, more giving, or a lower price.",
    showsUp: [
      "You deflect compliments fast enough that people have learned to stop offering them",
      "You match every gift almost immediately, so nothing is ever simply received",
      "You over-deliver as a way of making the payment feel earned",
      "You are more comfortable being paid for a product than for your own presence",
      "You give away the thing you are best at because charging for it feels like too much",
      "You find it easier to give a discount than to accept a compliment about your rates",
    ],
    cost: [
      ["Your income is capped by what you can bear to receive", "Money lands and stays without being repaid in labour"],
      ["Generosity slowly turns into resentment", "You give from surplus rather than from obligation"],
      ["The best work stays underpriced", "Your presence becomes your highest-margin offer"],
      ["You are the person everybody relies on and nobody looks after", "Being given to becomes ordinary"],
    ],
    reframe: "An income is a receiving mechanism and nothing else, so every structure built to make money feel sufficiently earned is also a structure that caps what can come in.",
    steps: [
      ["Receive without reciprocating", "Accept something and give nothing back for a full day."],
      ["Let the invoice be enough", "Send it without an extra deliverable attached and sit through the discomfort."],
      ["Be witnessed receiving", "Accept praise publicly, once, without deflecting it."],
      ["Separate earning from deserving", "Write down what you delivered and what you were paid, and notice it was already fair."],
      ["Ask for one thing", "Directly, without justifying the ask or offering anything in exchange."],
    ],
    journal: [
      "When somebody gives you something, what happens in your body in the first two seconds, and what do you usually do about it?",
      "Who taught you that needing something was dangerous, and how did they show you that?",
      "What would you have to believe about yourself to keep something without earning it back?",
    ],
    eftSetup: "Even though I learned it is safer to give than to receive, I am allowed to let good things land and stay.",
    eftPoints: "this old flinch when somebody gives · the rush to even the score · it kept me safe once · I do not owe for this · I am allowed to keep it · receiving is a pleasure · I let it land · I stay open",
    hypnosis: "Picture somebody handing you something you did not earn. Notice the flinch, and let it be there without acting on it. Nothing is required of you here and nothing needs returning. Repeat: I am allowed to receive in full.",
    somatic: "When something good is offered, place both feet flat, take one slow breath in through the nose, and say only thank you. Let the exhale finish before you speak again.",
    affirmations: [
      "I let money arrive and land and stay, without rushing to earn it back.",
      "Receiving is a pleasure rather than a debt.",
      "I am allowed to keep every good thing.",
    ],
    challenge: "For seven days, accept everything offered to you with only a thank you, and give nothing back within twenty-four hours.",
    gift: "a genuine, uncalculating generosity that people feel immediately and remember for years",
  },

  visibility: {
    shadow: "The Too-Much Woman",
    felt: "Something in you knows the raw version of the sentence and hears yourself say the diplomatic one instead, and every time your work grows, an old warning arrives with it.",
    pullQuote: "Every time you expand, the old shame about being too much wakes up with it.",
    bodyNote: "The withdrawal arrives after good news rather than after failure, which is what makes it so confusing to live with and so easy to mistake for instinct.",
    origin: "a moment, usually early, when being fully yourself cost you something, and the nervous system filed visible expansion under danger",
    mechanism: "Growth triggers the old shame rather than failure doing it, which is why the withdrawal arrives after good news and feels like intuition rather than like a pattern.",
    showsUp: [
      "You soften your positioning to make it palatable, then feel flat about the result",
      "Growth spurts are followed by a withdrawal you cannot fully explain",
      "You publish the diplomatic version and the raw one outperforms it whenever you dare",
      "You have a strong reaction to being managed, advised or constrained",
      "You go quiet at the exact moment momentum was building",
      "You cap your visibility just below the level where you would be genuinely exposed",
    ],
    cost: [
      ["The softened version underperforms, repeatedly", "The direct version travels and brings the right people"],
      ["Every growth spurt is followed by a quiet retreat", "You recognise the retreat and stay visible through it"],
      ["Your ceiling stays just below real exposure", "You become known for what you were told was too much"],
      ["Anger about being managed leaks sideways", "It becomes a clean boundary and a clear rate"],
    ],
    reframe: "The people who found you too much were a specific set of people at a specific time, and you have been running their editorial policy on your public work ever since, while your actual audience is waiting for the unedited version.",
    steps: [
      ["Publish the raw version", "Write the diplomatic one, then the true one, and publish the true one."],
      ["Name the retreat", "After any growth, expect the withdrawal urge within a fortnight and label it."],
      ["Put the anger to work", "Let the reaction to being managed become a boundary and a number."],
      ["Stop softening the offer", "The palatable version attracts negotiators, the direct one attracts believers."],
      ["Exceed one ceiling deliberately", "Find the visibility level you have never passed and pass it on purpose."],
    ],
    journal: [
      "Who first told you that you were too much, and what exactly were you doing at the time?",
      "What is the truest sentence about your work that you have never published?",
      "What happened the last three times something of yours grew? Write the sequence and look for the retreat.",
    ],
    eftSetup: "Even though I learned that being fully myself costs me something, I am allowed to take up all of my space now.",
    eftPoints: "this old shame about being too much · they were wrong about me · my intensity is my value · I stop editing for people who left · I am allowed to be seen fully · growth is safe · I stay when it expands · I am exactly the right amount",
    hypnosis: "Picture the version of your work you have never published, out in the world with your name on it. Notice the old warning arrive, and recognise the voice as somebody else's, from a long time ago. Repeat: I am exactly the right amount.",
    somatic: "Before publishing something that frightens you, stand up, widen your stance, deliberately take up more physical room, and press send from there.",
    affirmations: [
      "I am exactly the right amount.",
      "The strange parts are what they came for.",
      "Expansion is safe and I am staying.",
    ],
    challenge: "Publish the unedited version of the thing you would normally soften, once this week, and leave it up regardless of the first reaction.",
    gift: "a quality people remember, quote and follow, which is the whole of what makes somebody worth paying rather than merely competent",
  },

  scarcity: {
    shadow: "The Braced Position",
    felt: "Some part of you is always waiting for it to go wrong, so the good months are spent bracing rather than enjoying, and the money never quite feels safe no matter what the balance says.",
    pullQuote: "The vigilance was correct once, and it is still running on information decades out of date.",
    bodyNote: "Your body tracks threat rather than balance, so a healthy account does nothing to switch the alarm off. Only repeated experience of expanding without disaster begins to update it.",
    origin: "a period, early or later, when there genuinely was not enough, and the vigilance that got you through it never received the message that it was over",
    mechanism: "Your body tracks threat rather than balance, so evidence of safety does not switch the alarm off. Only repeated, deliberate experiences of spending or expanding without disaster begin to update it.",
    showsUp: [
      "You brace during good months instead of enjoying them",
      "You under-invest in your own business because spending feels dangerous",
      "You price low to guarantee the sale rather than to reflect the value",
      "You hold on to arrangements past their usefulness because change feels unsafe",
      "You keep a cushion far larger than you need and still feel exposed",
      "You take work you do not want because turning anything down feels reckless",
    ],
    cost: [
      ["You stay small in order to stay safe", "Safety becomes the floor rather than the ceiling"],
      ["Opportunities pass while you wait for certainty", "You move on the good ones and survive the imperfect ones"],
      ["Your nervous system never catches up to your bank balance", "Your body learns the danger has passed"],
      ["Fear sets your prices", "Value sets your prices"],
    ],
    reframe: "The vigilance was correct once and it is running on old information now, and the only thing that updates it is the repeated experience of expanding without the disaster arriving.",
    steps: [
      ["Name the actual number", "Write down what you truly have and what enough costs per month. Vagueness feeds the fear."],
      ["Spend once, deliberately", "On something that grows you rather than protects you, and sit with the discomfort."],
      ["Turn one thing down", "Something you do not want, and notice that the work keeps coming."],
      ["Date the fear", "Write down when the scarcity was real. Notice how long ago that was."],
      ["Raise one price", "Before you feel safe enough to, and let the evidence arrive afterwards."],
    ],
    journal: [
      "When was money genuinely frightening in your life, and how old were you?",
      "In what specific ways are your finances safer now than they were five years ago?",
      "What would you do this year if you knew the floor would hold?",
    ],
    eftSetup: "Even though part of me is still braced for it to go wrong, my body is allowed to know that the danger has passed.",
    eftPoints: "this old bracing · it kept me alive once · it is running on old news · I am safer than I was · I am allowed to enjoy this · the floor is holding · I can expand and still be safe · I let it be good",
    hypnosis: "Let yourself picture your current life from slightly above, and notice the things that are genuinely stable now which were not before. Repeat: the danger has passed, and my body is allowed to know it.",
    somatic: "When the bracing arrives, press your feet into the floor and name three things in the room that are true right now. This brings the nervous system back to the present, where the danger is over.",
    affirmations: [
      "The danger has passed and my body is allowed to know it.",
      "I am allowed to build rather than only to defend.",
      "There is enough, and I am allowed to enjoy it.",
    ],
    challenge: "Spend or invest one meaningful sum this week on something that grows you rather than protects you, and write down what actually happened afterwards.",
    gift: "genuine resourcefulness, and the knowledge that you could rebuild from very little because you have already done harder things",
  },

  control: {
    shadow: "The Closed System",
    felt: "You would rather hold it all yourself than hand any of it over, and being financially dependent on anybody produces a reaction in you that is out of proportion to the situation.",
    pullQuote: "The grip that protects it is the same grip that stops it growing.",
    bodyNote: "Notice where money physically tightens you, usually in the jaw or the hands. That is the pattern arriving before any decision has been made.",
    origin: "an early experience of somebody else holding the power over resources, and the decision that this would never happen again",
    mechanism: "Control resolves the fear in the short term and constricts the system in the long term, because money grows through circulation and shrinks when it is held privately and defended.",
    showsUp: [
      "You keep financial matters private, including from people who could help",
      "You would rather do it all yourself than delegate and lose oversight",
      "You react strongly to anybody managing, advising or constraining your money",
      "You struggle to accept investment or partnership that involves shared control",
      "You hold cash rather than deploy it, because deployed money is less controllable",
      "You avoid asking for help even when asking would obviously be faster",
    ],
    cost: [
      ["Everything stays the size one person can hold", "The work grows past what you can carry alone"],
      ["Money stagnates because it never circulates", "Circulation compounds it"],
      ["Secrecy keeps the fear intact", "Naming the numbers takes their charge away"],
      ["Power struggles cost more than any bad investment", "Authority held openly, without a fight"],
    ],
    reframe: "Holding power and holding it secretly are different things, and only the second one costs you, because resources grow through movement and the grip that protects them is the same grip that stops them.",
    steps: [
      ["Say the numbers out loud", "To one other person, monthly. Secrecy is what keeps the charge in."],
      ["Delegate one thing that matters", "Not an unimportant task. Something with real consequence."],
      ["Accept one offer of help", "Without renegotiating the terms so you stay in charge of it."],
      ["Deploy some of the cash", "Into something that moves rather than something that sits."],
      ["Separate authority from control", "Decide what you will genuinely own, and release the rest."],
    ],
    journal: [
      "Who had power over money when you were young, and how did that feel from where you were standing?",
      "What are you holding onto that would grow faster in somebody else's hands as well as yours?",
      "What would you have to trust in order to let one financial thing be shared?",
    ],
    eftSetup: "Even though holding all of it myself has kept me safe, I am allowed to let some of it move.",
    eftPoints: "this old need to hold everything · it protected me once · nobody is taking it now · I can share and still be safe · authority without secrecy · I let it circulate · I am allowed help · I keep my power and open my hands",
    hypnosis: "Picture your money as something with movement in it rather than something held still. Let one part of it flow outward and notice that the rest remains. Repeat: I hold my authority openly, and what moves comes back.",
    somatic: "Notice the physical grip when money is discussed, usually in the jaw, hands or stomach. Consciously release it before you speak, and let the sentence come out of an open hand.",
    affirmations: [
      "I hold my authority openly rather than secretly.",
      "What circulates comes back multiplied.",
      "I can accept help and remain in charge of my own life.",
    ],
    challenge: "Take one financial matter you have handled entirely alone and bring one other person into it this week, without giving up your authority over it.",
    gift: "genuine capacity to handle high-stakes resources without flinching, which is rare and highly monetisable",
  },

  safety: {
    shadow: "The Deferred Life",
    felt: "There is always one more thing to secure before you are allowed to enjoy any of it, and the threshold for enough keeps moving upward.",
    pullQuote: "You have been building the walls for years and calling it unfinished.",
    bodyNote: "The threshold for enough moves upward every time you approach it, which is why the relief you are building toward keeps receding as you get closer.",
    origin: "an early environment where security was uncertain or conditional, so building the walls became more urgent than living inside them",
    mechanism: "Security-seeking is genuinely effective at producing stability and completely ineffective at producing the feeling of being safe, so the building never concludes.",
    showsUp: [
      "You keep raising the amount you need before you can relax",
      "You defer enjoyment to a future that keeps receding",
      "You choose the safe option and resent it afterwards",
      "You save diligently and struggle to spend on yourself",
      "You stay in arrangements past their usefulness because they are known",
      "You measure decisions by what could go wrong rather than what could go right",
    ],
    cost: [
      ["Security becomes the ceiling", "Security becomes the floor you build from"],
      ["The enjoyment is permanently postponed", "You spend and enjoy while still building"],
      ["Safe choices produce a small life", "Calculated risk produces a large one"],
      ["You arrive at sixty having never spent it", "You live in the life you built"],
    ],
    reframe: "You have been building a base for years and treating it as unfinished, and the work now is to start living on top of it rather than adding another layer to the walls.",
    steps: [
      ["Define enough, in figures", "An actual monthly number. Undefined enough can never be reached."],
      ["Spend on pleasure, deliberately", "Something with no productive justification at all."],
      ["Take one calculated risk", "Sized so that failure would be survivable rather than catastrophic."],
      ["Notice the base you built", "Write down what is genuinely secure now that was not before."],
      ["Move the threshold once", "Declare the base sufficient and act as though it is."],
    ],
    journal: [
      "What does enough actually cost per month, in honest figures rather than fantasy ones?",
      "What are you waiting to feel before you let yourself enjoy what you have built?",
      "What did security look like in the house you grew up in?",
    ],
    eftSetup: "Even though I keep moving the line for when I am allowed to relax, I am allowed to enjoy what I have already built.",
    eftPoints: "this old need for one more layer · the line keeps moving · I built something real · I am allowed to live in it · enough is a decision · I can enjoy and still be safe · I stop deferring · I am here now",
    hypnosis: "Picture the base you have already built, and let yourself stand on top of it rather than beside it. Repeat: what I have built is enough to live on, and I am allowed to live on it.",
    somatic: "Once a day, spend sixty seconds noticing something you own or have built that is genuinely stable, and let the body register it rather than moving straight to the next task.",
    affirmations: [
      "What I have built is enough to live on.",
      "I am allowed to enjoy it while I am still building.",
      "Security is my floor rather than my ceiling.",
    ],
    challenge: "Spend money on one thing this week that is purely for your own pleasure, at a level that feels slightly extravagant, and do not justify it to anybody.",
    gift: "the discipline to build something that genuinely lasts, which most people talk about and few actually do",
  },

  overgiving: {
    shadow: "The Absorbed Room",
    felt: "You feel what everybody in the room is feeling and you resolve it before anybody has asked, usually at your own expense and usually within about four seconds.",
    pullQuote: "You are regulating somebody else's discomfort with your own money.",
    bodyNote: "The feeling enters your body, gets misattributed as yours, and then generates entirely convincing reasons for an action that costs you and relieves them.",
    origin: "an early role as the one who managed the atmosphere, where reading the room and fixing it was how you kept things stable",
    mechanism: "Their feeling enters your body, gets misattributed as yours, and generates completely convincing reasons for an action that costs you money and relieves their discomfort.",
    showsUp: [
      "You discount in response to a pause rather than an actual objection",
      "You leave client conversations exhausted in a way the work does not explain",
      "You take on clients you knew were wrong because their need was in the room",
      "Your boundaries are strongest with strangers and weakest with your own people",
      "You give extra time and access nobody asked for",
      "You avoid money conversations because you can feel the reaction before it arrives",
    ],
    cost: [
      ["You regulate their discomfort with your own money", "You hold the number and let the pause belong to them"],
      ["Client work drains you past what the fee justifies", "You price for the absorption and protect recovery"],
      ["Your closest people get your weakest terms", "Warmth and clear terms coexist"],
      ["Decisions get made in the room and regretted after", "Every money decision gets a gap"],
    ],
    reframe: "The feeling arrived with them and you are amplifying it rather than producing it, which means the fastest fix is not managing your generosity but putting a gap between the room and the decision.",
    steps: [
      ["Never decide money in the room", "Say you will confirm within a day, and decide alone."],
      ["Name it as theirs, silently", "When the pause lands in your body, say internally that it arrived with them."],
      ["Price the absorption in", "The work costs you more energetically than it costs others. Charge for the recovery."],
      ["Protect solitude as infrastructure", "Schedule real alone time after client days."],
      ["Write terms for your own people first", "Your weakest edges are with those closest to you."],
    ],
    journal: [
      "Think of the last discount you gave. What was happening in the room in the seconds before you offered it?",
      "Which feelings you had this week actually belonged to somebody else?",
      "Where does your generosity toward your own people shade into self-erasure?",
    ],
    eftSetup: "Even though I feel what everybody in the room is feeling, I can tell the difference between their weather and mine.",
    eftPoints: "this feeling arrived with them · it is not mine to fix · their pause belongs to them · I can be warm and still clear · I hold my number kindly · I decide alone · I give myself the night · I stay whole",
    hypnosis: "Picture the last room where you felt somebody else's discomfort. See the feeling as having a colour that is theirs, and watch it stay with them as you step back. Repeat: I feel it all, and I keep only what is mine.",
    somatic: "After any client contact, shake out your hands for thirty seconds and say aloud, that was theirs, this is mine.",
    affirmations: [
      "I feel it all, and I keep only what is mine.",
      "Their pause belongs to them.",
      "I can be warm and still be clear.",
    ],
    challenge: "Make no money decision in the room for seven days. Every single one gets a night, and notice how many of them change.",
    gift: "an almost unfair ability to read what a person actually needs, which is the entire foundation of high-value work",
  },

  depth: {
    shadow: "The Undervalued Depth",
    felt: "You do the work that genuinely changes people and charge as though it were ordinary, because the depth costs you so little effort that you cannot see it as rare.",
    pullQuote: "The work that costs you nothing is the work worth the most.",
    bodyNote: "Ease reads to you as evidence of low value, so the one thing only you can do is the thing you have priced lowest for years.",
    origin: "learning that the profound thing is a duty rather than a service, or that charging properly for meaningful work somehow cheapens it",
    mechanism: "Ease reads to you as evidence of low value, so the skill only you have is systematically discounted while the parts that felt like hard work get billed in full.",
    showsUp: [
      "You price the delivery rather than the transformation",
      "Work that comes easily gets discounted precisely because it came easily",
      "You are more comfortable charging for a product than for your own presence",
      "You suspect that charging properly for deep work is somehow exploitative",
      "You give the real insight away in the free consultation",
      "You keep building lighter offers to avoid pricing the deep one",
    ],
    cost: [
      ["Your deepest work stays your cheapest offer", "You charge most for the thing only you can do"],
      ["You build products to avoid pricing your presence", "Your presence becomes the premium tier"],
      ["Volume replaces rate and the energy runs out", "Fewer clients, higher rate, sustainable"],
      ["The rare skill goes unrewarded for a decade", "It becomes the whole business"],
    ],
    reframe: "What costs you nothing is precisely what is rare, and the ease you have been treating as evidence of low value is the actual evidence of mastery.",
    steps: [
      ["Price the transformation", "Write down what changes for a client, and set the number against that."],
      ["Charge most for what comes easiest", "List what feels effortless to you and hard for everybody else. That is the premium offer."],
      ["Stop giving it away in the consultation", "Name the problem, then name the price."],
      ["Retire one shallow offer", "The lighter offers exist to avoid the deep one."],
      ["Say the number for the deep work", "Once, without a payment plan attached."],
    ],
    journal: [
      "Which of your skills feels too easy to charge properly for, and what would happen if it became your most expensive offer?",
      "What do people thank you for that you barely noticed doing?",
      "Where did you learn that meaningful work should be cheap?",
    ],
    eftSetup: "Even though what comes easily to me feels like it cannot be worth much, my ease is the evidence of my mastery.",
    eftPoints: "this old discount on my own depth · easy does not mean cheap · nobody else does this · my ease is rare · I charge for the transformation · I am allowed to be paid for depth · I stop apologising for it · this is the work",
    hypnosis: "Picture a client on the other side of your work, changed. Let yourself see the size of the difference you made. Repeat: I am paid for the change, and the change is large.",
    somatic: "Before quoting for deep work, place one hand flat on your sternum, exhale longer than you inhale three times, then say the number without a follow-up sentence.",
    affirmations: [
      "The work that costs me nothing is the work worth the most.",
      "I price the transformation rather than the hours.",
      "My ease is the evidence of my mastery.",
    ],
    challenge: "Take the offer that is easiest for you to deliver, raise its price by a third, and sell it once this week without explaining the increase to anybody.",
    gift: "the capacity to go where other practitioners will not, which is precisely what people pay premium rates to find",
  },

  autonomy: {
    shadow: "The Unmanageable One",
    felt: "The moment somebody tries to direct you, something in you refuses, and the refusal has cost you opportunities that would have been genuinely good.",
    pullQuote: "Independence stopped being a preference and became a condition of safety.",
    bodyNote: "The refusal fires faster than the assessment, which is why you have turned down things that would have been genuinely good for you.",
    origin: "an early period of being controlled, managed or overruled, after which independence stopped being a preference and became a condition of safety",
    mechanism: "Autonomy is defended before it is threatened, so ordinary collaboration reads as constraint and you leave or resist arrangements that would have paid well.",
    showsUp: [
      "You react to advice about your money as though it were an attempt to take it",
      "You turn down partnerships that would have been genuinely good",
      "You would rather earn less and answer to nobody",
      "You resist structures and systems that would actually help you",
      "You leave arrangements at the first sign of being managed",
      "You struggle to be employed, taught or coached without friction",
    ],
    cost: [
      ["You stay solo and therefore small", "You collaborate without losing yourself"],
      ["Good partnerships are refused on reflex", "You assess each one on its actual terms"],
      ["You reject structure that would free you", "Systems carry the load instead of you"],
      ["Independence becomes isolation", "Autonomy with company"],
    ],
    reframe: "Independence was the correct response to being controlled and it has become an automatic reflex, so the work is to tell actual constraint apart from ordinary collaboration before you leave the room.",
    steps: [
      ["Pause before refusing", "When the refusal arrives, wait a day before acting on it."],
      ["Test one collaboration", "Small, bounded, with terms you wrote."],
      ["Take advice from one person", "Chosen by you, which keeps the autonomy intact."],
      ["Use structure you designed", "Systems feel like constraint only when somebody else built them."],
      ["Name the actual threat", "Distinguish being managed from being helped."],
    ],
    journal: [
      "When were you last genuinely controlled, and what did you decide about independence afterwards?",
      "Which opportunity did you refuse that you now suspect was fine?",
      "What kind of support could you accept without feeling managed?",
    ],
    eftSetup: "Even though being managed feels like a threat, I can tell the difference between constraint and support.",
    eftPoints: "this old refusal · nobody is controlling me now · I choose my own terms · support is not constraint · I can collaborate and stay myself · I pause before I refuse · my autonomy is safe · I decide",
    hypnosis: "Picture a collaboration in which you keep full authority over your own part. Notice that nothing is taken. Repeat: I can work with people and remain entirely myself.",
    somatic: "When the refusal reflex fires, notice where it lands in the body, and take three breaths before you speak. The reflex is faster than the assessment.",
    affirmations: [
      "I can collaborate and remain entirely myself.",
      "Support is available without constraint.",
      "I choose my own terms, and I can still say yes.",
    ],
    challenge: "Say yes to one collaboration or piece of support this week that you would normally refuse on reflex, on terms you set yourself.",
    gift: "an unmistakable independence that makes your work genuinely your own rather than an imitation of somebody else's",
  },

  legitimacy: {
    shadow: "The Unqualified Expert",
    felt: "You over-prepare, over-explain and over-credential, because some part of you is still waiting to be told you are allowed to speak on this.",
    pullQuote: "Nobody is coming to tell you that you are allowed to speak on this.",
    bodyNote: "The explaining is meant to establish authority and does the opposite, because over-explanation reads as uncertainty to everybody except you.",
    origin: "a period, usually in childhood, when your thinking or your voice was not properly received, so being taken seriously became something to earn rather than expect",
    mechanism: "Explanation is deployed as proof, and because over-explaining reads as uncertainty, the very behaviour meant to establish authority is the one undermining it.",
    showsUp: [
      "You over-prepare far past the point of usefulness",
      "You explain your prices and your ideas more than they need explaining",
      "You collect qualifications you do not need before you will charge",
      "Being disbelieved or spoken over lands harder than it rationally should",
      "You undercharge for your own voice and charge properly for deliverables",
      "You build extensive free material to prove the idea before selling it",
    ],
    cost: [
      ["You audition indefinitely for a role you already have", "You speak as the authority you are"],
      ["Over-explaining undermines the number", "One clean sentence, then silence"],
      ["You collect credentials instead of clients", "Your work is the credential"],
      ["Your voice stays the cheapest thing you sell", "Speaking becomes the premium offer"],
    ],
    reframe: "Nobody is going to arrive and grant you permission, and the authority you are waiting for is conferred by acting as though you already hold it, which you demonstrably do.",
    steps: [
      ["Say it without the preamble", "One sentence, no throat-clearing, no context-setting."],
      ["Give the price and stop", "One sentence of context at most."],
      ["Stop adding qualifications", "You have enough. Sell with what you have."],
      ["Charge for your voice", "Speaking, teaching and consulting, at the top of your pricing."],
      ["Publish without proving", "Say the thing without the evidence appendix."],
    ],
    journal: [
      "When did you decide it was easier to work things out alone than to be heard?",
      "What do you over-explain, and who taught you that explanation was the price of being taken seriously?",
      "Whose permission are you still waiting for?",
    ],
    eftSetup: "Even though I keep waiting to be told I am allowed to speak on this, I am already the authority I am looking for.",
    eftPoints: "this old need to prove · I have done the work · I am allowed to speak · explanation is not proof · one sentence is enough · I take myself seriously · nobody has to grant this · I already know",
    hypnosis: "Picture yourself saying the true thing without the preamble, and notice the room take it seriously. Repeat: I am the authority, and I speak as one.",
    somatic: "Before speaking with authority, plant both feet, drop the shoulders, and let the first sentence be the point rather than the introduction.",
    affirmations: [
      "I am already the authority I keep waiting to become.",
      "One clean sentence is enough.",
      "I take my own thinking seriously.",
    ],
    challenge: "Say one thing publicly this week without the preamble that usually precedes it, and let it stand on its own.",
    gift: "unusual precision with language, forged by somebody who had to be exact in order to be heard",
  },

  sustainability: {
    shadow: "The Emptied Tank",
    felt: "You work past the point your body was asking you to stop, and the recovery costs more than the extra work ever earned.",
    pullQuote: "The exhaustion is a design mismatch rather than a failure of discipline.",
    bodyNote: "The stop signal arrives well before you act on it, and the gap between the signal and the stopping is where the damage accumulates.",
    origin: "an environment where rest had to be justified and output was the measure of a person, so stopping became something requiring permission",
    mechanism: "You generate or absorb pressure without a matching capacity for sustained output, so the drive keeps going after the fuel has gone and the deficit is paid later with interest.",
    showsUp: [
      "You work in a rhythm that produces collapse rather than pace",
      "Rest happens only after the body forces it",
      "You take on more when you are already at capacity",
      "You measure a week by output rather than by sustainability",
      "Quiet weeks produce guilt rather than recovery",
      "You price by volume, which requires more energy than you actually have",
    ],
    cost: [
      ["Income is capped by your energy rather than by demand", "Income scales past what you personally produce"],
      ["Burnout arrives on a predictable schedule", "The rhythm holds for decades"],
      ["Rest is recovery from damage", "Rest is part of the design"],
      ["You mistake a wiring mismatch for a discipline failure", "You work the way you were built to"],
    ],
    reframe: "The exhaustion is a design mismatch rather than a failure of discipline, and the fix is structural: an income that pays you between the bursts rather than only during them.",
    steps: [
      ["Build income that pays while you rest", "Recurring revenue or an accumulating body of work."],
      ["Put the rest in the diary first", "Before the work, so it is infrastructure rather than a reward."],
      ["Raise rate rather than volume", "Fewer clients at a higher number is the only sustainable direction."],
      ["Notice the stop signal", "It arrives earlier than you act on it. Act on it earlier."],
      ["Stop justifying rest", "It requires no evidence."],
    ],
    journal: [
      "What is your actual working rhythm when nobody is watching, and what does it cost you afterwards?",
      "Who taught you that rest had to be earned?",
      "What would you build if you knew you only had three good working days a week?",
    ],
    eftSetup: "Even though I learned that stopping has to be justified, rest is part of my design.",
    eftPoints: "this old pressure to keep going · my body has been asking · rest is not a reward · I am allowed to stop · pacing is strategy · the work will still be there · I honour the signal · I last",
    hypnosis: "Picture a week with genuine space in it. Notice the pressure that arrives, and locate it in the body without arguing with it. Repeat: rest is part of my design, and I do not have to earn the right to stop.",
    somatic: "When the stop signal arrives, stop within the hour rather than at the end of the task. The gap between signal and stopping is where the damage accumulates.",
    affirmations: [
      "Rest is part of my design.",
      "I build income that pays me while I am not working.",
      "Pacing is a strategy rather than a weakness.",
    ],
    challenge: "Put three genuine rest periods in your diary this week before you schedule any work, and protect all three.",
    gift: "a real understanding of pace and depletion, which makes you unusually good at helping other people avoid it",
  },

  belonging: {
    shadow: "The Earned Place",
    felt: "You contribute in order to stay, and the idea of being in a room without offering something useful feels genuinely uncomfortable.",
    pullQuote: "Your place stopped being conditional a long time ago.",
    bodyNote: "You cannot be in a professional room without offering something useful, and the rooms where your income actually lives are the ones this costs you most in.",
    origin: "an early sense of being slightly outside the circle, where a place had to be secured rather than assumed",
    mechanism: "Contribution buys belonging in your internal arithmetic, so you cannot be present without producing, and the rooms where your income actually lives are the ones this costs you most in.",
    showsUp: [
      "You take unpaid work for people whose regard you want, and call it strategy",
      "You cannot be in a professional room without offering something useful",
      "You give your best thinking away in group settings",
      "You feel most inadequate around peers, and least able to charge there",
      "You over-function in collaborations",
      "You avoid the rooms where your money actually is",
    ],
    cost: [
      ["Peer rooms cost you money instead of making it", "Your network becomes your strongest channel"],
      ["You buy belonging with free labour", "You belong without paying for it"],
      ["The best contacts get the cheapest work", "Warm relationships and full rates coexist"],
      ["You avoid the rooms that matter", "You show up and simply be there"],
    ],
    reframe: "Your place stopped being conditional a long time ago, and the arithmetic that says otherwise was written by a child in a situation she did not choose.",
    steps: [
      ["Be present and contribute nothing", "Once a week, in a group. Notice you are still welcome."],
      ["Charge peers properly", "The people closest to your level should not get your cheapest work."],
      ["Stop paying for the room", "Attend without offering free labour as the entry fee."],
      ["Ask for something", "In a group, rather than only giving."],
      ["Name the arithmetic", "When the urge to contribute arrives, notice what it is buying."],
    ],
    journal: [
      "Where did you first learn that you had to be useful in order to be included?",
      "Which room do you avoid because being in it without producing feels unbearable?",
      "What would it cost you to simply be there?",
    ],
    eftSetup: "Even though I learned that I have to contribute in order to belong, I am allowed to be here without earning it.",
    eftPoints: "this old arithmetic · contribution bought my place once · I am allowed to just be here · nobody is checking · I belong without producing · I can receive from a room · I stay · I am welcome",
    hypnosis: "Picture a room of people you respect, and yourself in it, offering nothing at all. Let yourself stay. Repeat: I belong in this room without contributing anything.",
    somatic: "In a group, when the urge to contribute arrives, take one slow breath and let the moment pass. Notice that nothing happens.",
    affirmations: [
      "I am allowed to belong here without being useful first.",
      "My place is not conditional.",
      "I can be in a room and simply be in it.",
    ],
    challenge: "Attend one professional or peer setting this week and deliberately offer nothing useful. Notice that you remain entirely welcome.",
    gift: "genuine warmth in groups, and an instinct for making other people feel included that builds unusually loyal communities",
  },

  power: {
    shadow: "The Hidden Hand",
    felt: "You would rather hold the power than be subject to it, and money is where that plays out, usually in private.",
    pullQuote: "You are built to hold real authority. Only the secrecy is costing you.",
    bodyNote: "Power held privately feels safer and grows more slowly, because money grows through movement and the protecting grip is what stops it.",
    origin: "an early experience of powerlessness around resources, after which control over money became control over your own safety",
    mechanism: "Power held privately feels safer and grows more slowly, because the same grip that protects it prevents it from moving, and money grows through movement.",
    showsUp: [
      "You keep the real numbers to yourself",
      "You are more comfortable holding power than sharing it",
      "You react strongly to any arrangement where somebody else decides",
      "You take on high-stakes situations others avoid, and handle them well",
      "You rebuild rather than ask for help",
      "You prefer arrangements where you can walk away",
    ],
    cost: [
      ["Power kept secret stays small", "Authority held openly compounds"],
      ["You handle everything alone", "You lead rather than carry"],
      ["Money stagnates in the grip", "Circulation multiplies it"],
      ["The intensity leaks into relationships", "It becomes clean, stated authority"],
    ],
    reframe: "You are built to hold material authority, so the instruction is to hold it openly rather than secretly, because the secrecy is the only part actually costing you.",
    steps: [
      ["Name the numbers out loud", "Monthly, to one person."],
      ["Take visible authority", "Rather than quiet control."],
      ["Let money circulate", "Deploy some of what is being held still."],
      ["Share one decision", "Without surrendering the authority behind it."],
      ["Use the intensity deliberately", "In negotiation, where it is an asset."],
    ],
    journal: [
      "Who had power over resources when you were young, and what did you decide about it?",
      "What are you holding privately that would grow if it were visible?",
      "Where does your authority become secrecy?",
    ],
    eftSetup: "Even though holding it privately has kept me safe, I am allowed to hold my power out in the open.",
    eftPoints: "this old grip · it protected me · nobody is taking it · I can be visible and powerful · secrecy costs me · I let it move · I hold authority openly · I am safe holding this",
    hypnosis: "Picture your authority as something you can hold in an open hand rather than a closed one. Notice it stays. Repeat: I hold my power openly, and it grows.",
    somatic: "Notice the grip in the jaw or hands when money is discussed, and deliberately open the hands before you speak.",
    affirmations: [
      "I hold my authority openly rather than secretly.",
      "I am built to handle real resources.",
      "What moves comes back multiplied.",
    ],
    challenge: "Say your real financial numbers out loud to one trusted person this week, without softening them.",
    gift: "the capacity to handle intensity, high stakes and other people's resources without being destabilised, which very few people have",
  },

  expansion: {
    shadow: "The Unfinished Empire",
    felt: "You reach for the next thing before the last one has finished paying out, so the income tracks your appetite rather than compounding.",
    pullQuote: "Letting something be finished is the harder discipline for you than starting.",
    bodyNote: "Boredom with the steady working thing is the exact feeling that immediately precedes it compounding, which is why you keep leaving just before the payoff.",
    origin: "a temperament that finds meaning in the new, combined with a suspicion that the steady, already-mastered thing is somehow beneath you",
    mechanism: "Expansion is genuinely your gift and it becomes the avoidance, because starting is stimulating and maintaining is not, so nothing is left alone long enough to compound.",
    showsUp: [
      "You launch more than you maintain",
      "The simple, working offer gets replaced rather than repeated",
      "You are drawn to the next depth before this one has paid",
      "Income arrives in peaks with troughs between them",
      "You rebuild things that were already fine",
      "Boredom reads to you as evidence that something is wrong",
    ],
    cost: [
      ["Nothing compounds because nothing is left alone", "One thing runs for years and pays for everything"],
      ["Income tracks your energy", "Income accumulates independently of it"],
      ["You are always building", "You are sometimes simply harvesting"],
      ["The best offer gets replaced", "The best offer gets repeated"],
    ],
    reframe: "Letting something be finished is the harder discipline for you than starting, and the boredom you feel with the simple working thing is the exact feeling that precedes it compounding.",
    steps: [
      ["Let one thing be finished", "Offer the existing version unchanged for twelve months."],
      ["Repeat rather than rebuild", "Say the same true thing again instead of finding a new one."],
      ["Track what boredom costs", "Note what you replaced and what it was earning."],
      ["Build the harvest into the plan", "Schedule maintenance periods as deliberately as launches."],
      ["Delay the next thing", "By one full quarter, and see what the current one does."],
    ],
    journal: [
      "What are you rebuilding that you could simply repeat?",
      "What would compound if you left it alone for three years?",
      "What does boredom actually mean to you, and is it reliable?",
    ],
    eftSetup: "Even though the steady thing feels flat to me, I am allowed to let something finish and compound.",
    eftPoints: "this pull toward the next thing · boredom is not a signal · I let this one finish · repetition compounds · I am allowed to harvest · the simple thing is working · I stay with it · I let it pay me",
    hypnosis: "Picture one offer of yours running unchanged for three years while you rest. Notice what it accumulates. Repeat: I let one thing be finished, and I let it pay me for years.",
    somatic: "When the pull toward a new project arrives, write it down and put it away for a quarter. The urge passes; the note keeps the idea safe.",
    affirmations: [
      "I let one thing be finished, and I let it compound.",
      "Boredom is the sound of something working.",
      "I harvest as deliberately as I build.",
    ],
    challenge: "Identify the offer you keep rebuilding and commit to running the existing version unchanged for the next twelve months.",
    gift: "genuine vision and the ability to make a larger future feel possible, which is what draws people to you in the first place",
  },
};

/** Every theme has content. Used by gates to fail loudly rather than silently render an empty section. */
export function themeContent(theme: string): ThemeContent {
  const c = THEME_CONTENT[theme];
  if (!c) throw new Error(`No THEME_CONTENT for theme "${theme}". Add it to compose/vocab.ts.`);
  return c;
}
