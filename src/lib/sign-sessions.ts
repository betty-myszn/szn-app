import type { BaddieSession } from "@/lib/baddie-sessions";

// The sign Baddie Sessions (Betty, 22 Nov 2026): one 90-minute $333 1:1 per Sun sign, each with its own
// page at /baddie-sessions/<sign> and its own Stripe product, price and Payment Link (all created
// 22 Nov 2026, metadata source=sign-sessions, redirecting to /order/details like the themed sessions).
// /baddie-sessions shows them as ONE card with a sign picker, so the page doesn't turn into 17 cards.
// They're added to the offerings list in lib/baddie-sessions.ts as standalone entries, which is what
// makes the webhook send the booking email and the details form recognise the price.

export interface SignSession {
  slug: string;
  sign: string;
  /** What she'd call herself: "Sag", "Cap", otherwise the sign. */
  nick: string;
  glyph: string;
  emoji: string;
  /** Planets read first, named as they appear in the copy. */
  ruler: string;
  element: "fire" | "earth" | "air" | "water";
  dates: string;
  tagline: string;
  body: string[];
  focus: string[];
  after: string;
  accent: string;
  accentInk: string;
  bookingUrl: string;
  stripePriceId: string;
}

// Text-presentation glyphs (U+FE0E), so phones draw a black symbol and not a purple emoji tile.
const g = (c: string) => `${c}︎`;

export const SIGN_SESSIONS: SignSession[] = [
  {
    slug: "aries", sign: "Aries", nick: "Aries", glyph: g("♈"), emoji: "🔥", ruler: "Mars", element: "fire", dates: "21st of March to 19th of April",
    tagline: "Your fire is the whole point, babeeee. 🔥",
    body: [
      "Aries baddies were built to go first, and somewhere along the way somebody told you to calm down, wait your turn and be a little less MUCH. We're unlearning all of that.",
      "I read your Mars (your drive and your temper), where Aries sits in your chart and your Human Design, then we work out where all that fire wants to go, so you stop starting things you drop in week three and start finishing the ones that get you seen.",
    ],
    focus: [
      "Your Mars: how you chase, fight and win",
      "The projects worth your fire, and the ones draining it",
      "Anger as information, so it stops leaking out sideways",
      "Your Human Design timing for when to charge in and when to wait",
    ],
    after: "She leaves knowing exactly which fight is hers, then goes first without asking anyone's permission.",
    accent: "var(--pink)", accentInk: "#fff",
    bookingUrl: "https://buy.stripe.com/5kQeVeaMD13p8dQ3CB7kc0T", stripePriceId: "price_1UeX7qJ6s9fRhiJoQF2pNMVW",
  },
  {
    slug: "taurus", sign: "Taurus", nick: "Taurus", glyph: g("♉"), emoji: "🌹", ruler: "Venus", element: "earth", dates: "20th of April to 20th of May",
    tagline: "Soft life, serious money, zero apologies. 🌹",
    body: [
      "Taurus, you were made for pleasure, beauty and a bank balance that lets you breathe out, yet sooo many of you are white-knuckling a life that feels safe and deeply boring.",
      "We go into your Venus, your 2nd house and your Human Design to find what you value and what you're worth, then shift the stubborn bits keeping you in the job, the flat or the relationship long after you've outgrown it, so your soft life gets built on purpose.",
    ],
    focus: [
      "Your Venus: what you love, what you attract and how you receive",
      "Your 2nd house and your real money story",
      "Making the big move without three years of overthinking first",
      "A life that feels as good as it looks",
    ],
    after: "This Taurus walks out choosing comfort AND ambition, with a plan to get paid for her taste.",
    accent: "var(--lav)", accentInk: "var(--dark)",
    bookingUrl: "https://buy.stripe.com/28E7sMbQHcM72Tw4GF7kc0U", stripePriceId: "price_1UeX7rJ6s9fRhiJo0Ni9fSQJ",
  },
  {
    slug: "gemini", sign: "Gemini", nick: "Gemini", glyph: g("♊"), emoji: "💬", ruler: "Mercury", element: "air", dates: "21st of May to 20th of June",
    tagline: "Every idea in your head deserves a stage. 💬",
    body: [
      "Gemini baddies, you've got forty tabs open, three side hustles in your Notes app and a brain that moves faster than anyone in the room can keep up with.",
      "I read your Mercury, where Gemini lands in your chart and your Human Design, then we pick the ideas that are yours to run with, give your voice somewhere to go (posting, writing, speaking, selling) and build a rhythm that lets your curiosity make you money.",
    ],
    focus: [
      "Your Mercury: how you think, talk, write and sell",
      "Choosing your ideas while keeping your curiosity alive",
      "Your voice: where to use it and who's listening",
      "Your Human Design energy, so you stop burning out on everyone else's pace",
    ],
    after: "She leaves with her best idea picked, a voice she's proud of and a plan she'll stick to.",
    accent: "var(--pink-light)", accentInk: "var(--dark)",
    bookingUrl: "https://buy.stripe.com/28EcN6f2T13p79Mflj7kc0V", stripePriceId: "price_1UeX7sJ6s9fRhiJov736xDQe",
  },
  {
    slug: "cancer", sign: "Cancer", nick: "Cancer", glyph: g("♋"), emoji: "🌙", ruler: "the Moon", element: "water", dates: "21st of June to 22nd of July",
    tagline: "Your feelings are your superpower, babe. 🌙",
    body: [
      "Cancer, you hold EVERYONE: the group chat, your family, your partner's career crisis, your bestie's breakup. Somebody needs to hold you for once, and for ninety minutes that's me.",
      "We read your Moon (what you need to feel safe), your 4th house and your Human Design, then work on the mothering you give away for free, the boundaries you keep meaning to set and the big, tender dream you put on hold while you looked after everybody else.",
    ],
    focus: [
      "Your Moon: what you need, what you crave and what you hide",
      "Family patterns and the roles you never agreed to",
      "Boundaries that protect you and keep your heart open",
      "Turning your care into your career, if you want it to be",
    ],
    after: "This Cancer walks out at the top of her own to-do list, and she LOVES it there.",
    accent: "var(--lav-light)", accentInk: "var(--dark)",
    bookingUrl: "https://buy.stripe.com/dRm7sM8EvdQb2Twgpn7kc0W", stripePriceId: "price_1UeX7tJ6s9fRhiJohTQ1GLVK",
  },
  {
    slug: "leo", sign: "Leo", nick: "Leo", glyph: g("♌"), emoji: "👑", ruler: "the Sun", element: "fire", dates: "23rd of July to 22nd of August",
    tagline: "The spotlight's been waiting for you, babeeee. 👑",
    body: [
      "Leo, you were born to be SEEN, and it kills me how many of you turn yourselves down so nobody calls you too much.",
      "I read your Sun, where Leo sits in your chart and your Human Design, then we go after whatever's stopping you taking up the room you were made for: the fear of being judged, the cringe, the old story that wanting attention is shameful. You leave with a plan to be visible, adored and very well paid for it.",
    ],
    focus: [
      "Your Sun: your purpose and what lights you up",
      "Visibility: posting, performing and owning the room",
      "Being admired without needing anyone's approval",
      "Your creative gifts and how to make them pay",
    ],
    after: "She leaves as the main event in her own life, done shrinking for anyone.",
    accent: "var(--dark)", accentInk: "var(--pink)",
    bookingUrl: "https://buy.stripe.com/eVq5kE4of8vRalY3CB7kc0X", stripePriceId: "price_1UeX7uJ6s9fRhiJoEpjsodJc",
  },
  {
    slug: "virgo", sign: "Virgo", nick: "Virgo", glyph: g("♍"), emoji: "🌿", ruler: "Mercury", element: "earth", dates: "23rd of August to 22nd of September",
    tagline: "Your standards are high, so let's make them pay. 🌿",
    body: [
      "Virgo, you're the one who fixes everything, notices everything and redoes everything at 11pm because nobody else did it right. Iconic, and exhausting.",
      "We go through your Mercury, your 6th house and your Human Design, then untangle the perfectionism that keeps you editing when you could be launching, build routines that hold you up and turn all that skill into something people pay you very well for.",
    ],
    focus: [
      "Your Mercury: how your brilliant brain works best",
      "Perfectionism, control and the fear of getting it wrong",
      "Daily rhythms that suit your body and your Human Design",
      "Packaging your skills so you get paid properly for them",
    ],
    after: "This Virgo walks out ready to hit publish on the thing she's been perfecting for a year.",
    accent: "var(--pink)", accentInk: "#fff",
    bookingUrl: "https://buy.stripe.com/bJe00k4of8vRbq2c977kc0Y", stripePriceId: "price_1UeX7vJ6s9fRhiJo8OmWOmMW",
  },
  {
    slug: "libra", sign: "Libra", nick: "Libra", glyph: g("♎"), emoji: "💖", ruler: "Venus", element: "air", dates: "23rd of September to 22nd of October",
    tagline: "Your pretty life, on your terms this time. 💖",
    body: [
      "Libra, you can read a room in two seconds and keep everyone happy for hours, and the person who usually loses out is you.",
      "I read your Venus, your 7th house and your Human Design, then we work on the people-pleasing, the decisions you keep handing to everyone else and the relationships that take more than they give, so you start choosing what YOU want and building a life as beautiful as your taste.",
    ],
    focus: [
      "Your Venus: love, beauty, money and what you attract",
      "Your 7th house: the partners and clients you pull in",
      "Making decisions fast and backing yourself",
      "Saying no with grace and zero guilt",
    ],
    after: "She leaves picking herself first, in love, in work and in every room she walks into.",
    accent: "var(--lav)", accentInk: "var(--dark)",
    bookingUrl: "https://buy.stripe.com/fZu8wQ7AreUfcu63CB7kc0Z", stripePriceId: "price_1UeX7wJ6s9fRhiJojNRsERwR",
  },
  {
    slug: "scorpio", sign: "Scorpio", nick: "Scorpio", glyph: g("♏"), emoji: "🖤", ruler: "Pluto and Mars", element: "water", dates: "23rd of October to 21st of November",
    tagline: "Your power is coming back to you, babeeee. 🖤",
    body: [
      "Scorpio, you've been through things that would flatten most people and you came back sharper every single time. You feel EVERYTHING, you trust almost nobody, and that armour has done its job.",
      "We go deep (obviously) into your Pluto, your Mars, your 8th house and your Human Design: the control, the trust stuff, the jealousy you'd rather not admit to and the magnetic power underneath all of it. Then we point that intensity at money, intimacy and the life you're done keeping secret.",
    ],
    focus: [
      "Your Pluto and Mars: your power, desire and drive",
      "Your 8th house: intimacy, shared money and transformation",
      "Trust, control and letting the right people in",
      "Using your intensity on purpose",
    ],
    after: "This Scorpio walks out owning her power out loud, with nothing left to hide.",
    accent: "var(--dark)", accentInk: "var(--pink)",
    bookingUrl: "https://buy.stripe.com/6oU6oIbQH7rNdyaa0Z7kc10", stripePriceId: "price_1UeX7xJ6s9fRhiJoZTt4Hq6W",
  },
  {
    slug: "sagittarius", sign: "Sagittarius", nick: "Sag", glyph: g("♐"), emoji: "🏹", ruler: "Jupiter", element: "fire", dates: "22nd of November to 21st of December",
    tagline: "Your big life is calling, Sag, so let's answer it. 🏹",
    body: [
      "Sag baddies want the WHOLE world: the travel, the freedom, the wild idea, the life that looks like nobody else's. Then the commitments pile up and that big free spirit ends up stuck in a routine she never chose.",
      "I read your Jupiter (your luck and your growth), where Sagittarius lands in your chart and your Human Design, then we map the adventure you're here for, sort the restlessness from the real calling and build a plan that gives you freedom AND money.",
    ],
    focus: [
      "Your Jupiter: where luck, growth and abundance find you",
      "Freedom: what it means for you and how to fund it",
      "Your 9th house: travel, teaching, publishing and big beliefs",
      "Following through, so the big idea leaves the group chat",
    ],
    after: "She leaves with her next big adventure in the diary and the money plan to pay for it.",
    accent: "var(--pink)", accentInk: "#fff",
    bookingUrl: "https://buy.stripe.com/28E3cwbQH5jF9hU2yx7kc11", stripePriceId: "price_1UeX7yJ6s9fRhiJoPAF89d8J",
  },
  {
    slug: "capricorn", sign: "Capricorn", nick: "Cap", glyph: g("♑"), emoji: "🏔️", ruler: "Saturn", element: "earth", dates: "22nd of December to 19th of January",
    tagline: "You built the life, now let's make it feel good. 🏔️",
    body: [
      "Capricorn, you've been the responsible one since you were about nine. You get it done, carry it all and never ask for help, which is wildly impressive and very lonely.",
      "We go through your Saturn, your 10th house and your Human Design, then look at the pressure you put on yourself, the success that somehow still doesn't feel like enough and the rest you won't let yourself have. You keep every bit of the ambition and lose the grind that's wearing you down.",
    ],
    focus: [
      "Your Saturn: your discipline, your fears and your reward",
      "Your 10th house and Midheaven: career, status and legacy",
      "Success you can enjoy while you're in it",
      "Asking for help and letting people in",
    ],
    after: "This Cap leaves still building big, with joy and rest written into the plan.",
    accent: "var(--lav-light)", accentInk: "var(--dark)",
    bookingUrl: "https://buy.stripe.com/7sY6oI8Ev3bxalY3CB7kc12", stripePriceId: "price_1UeX7yJ6s9fRhiJoRwQ8zP74",
  },
  {
    slug: "aquarius", sign: "Aquarius", nick: "Aquarius", glyph: g("♒"), emoji: "⚡", ruler: "Uranus and Saturn", element: "air", dates: "20th of January to 18th of February",
    tagline: "The weird, wonderful you is the point. ⚡",
    body: [
      "Aquarius, you see the future before everyone else, you've never fit the mould and you've spent half your life feeling like the alien at the party.",
      "I read your Uranus and Saturn, your 11th house and your Human Design, then we work on letting people close while you keep your independence, finding your people and turning the ideas everyone said were too much into work that changes things and pays you for it.",
    ],
    focus: [
      "Your Uranus and Saturn: your rebellion and your structure",
      "Your 11th house: community, friendships and your audience",
      "Feeling close to people without feeling trapped",
      "Bringing your future-thinking ideas to life",
    ],
    after: "She leaves knowing exactly who her people are, with her biggest idea finally out in the world.",
    accent: "var(--pink-light)", accentInk: "var(--dark)",
    bookingUrl: "https://buy.stripe.com/fZu00k7ArbI38dQgpn7kc13", stripePriceId: "price_1UeX7zJ6s9fRhiJomfUdW5QW",
  },
  {
    slug: "pisces", sign: "Pisces", nick: "Pisces", glyph: g("♓"), emoji: "🫧", ruler: "Neptune and Jupiter", element: "water", dates: "19th of February to 20th of March",
    tagline: "Your dreams are real, babe, so let's make them solid. 🫧",
    body: [
      "Pisces, you feel everything, you dream in full colour and you can pick up someone's mood from across the room. Magical gifts, and they drain you dry when there are no boundaries around them.",
      "We go into your Neptune and Jupiter, your 12th house and your Human Design, then protect your energy, ground your intuition into real decisions and turn the dream you keep floating around into something with dates, prices and a launch.",
    ],
    focus: [
      "Your Neptune and Jupiter: your intuition, imagination and faith",
      "Your 12th house: your inner world and what you keep hidden",
      "Energy boundaries for a sensitive baddie",
      "Turning the dream into a plan you can follow",
    ],
    after: "This Pisces leaves trusting her intuition and backing it with a real plan, dates and all.",
    accent: "var(--lav)", accentInk: "var(--dark)",
    bookingUrl: "https://buy.stripe.com/bJeaEYg6X7rNbq2flj7kc14", stripePriceId: "price_1UeX80J6s9fRhiJokNdI6gDV",
  },
];

export const signSessionBySlug = (slug: string) => SIGN_SESSIONS.find((s) => s.slug === slug) ?? null;

export const signSessionName = (s: SignSession) => `The ${s.sign} Baddie Session`;

/** The same sessions in the shape the webhook, booking email and details form already understand. */
export const SIGN_SESSION_OFFERINGS: BaddieSession[] = SIGN_SESSIONS.map((s) => ({
  slug: s.slug, number: "06", emoji: s.emoji, name: signSessionName(s),
  tagline: s.tagline, body: s.body, after: s.after, reviews: [], focus: s.focus,
  cta: `Book your ${s.nick} session`, standalone: true,
  image: "/betty-founder.png", imagePosition: "center 20%",
  accent: s.accent, accentInk: s.accentInk, bookingUrl: s.bookingUrl, stripePriceId: s.stripePriceId,
}));
