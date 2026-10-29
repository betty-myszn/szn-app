// The Baddie Sessions: Betty's five 1:1 coaching sessions. Everything a visitor sees about price,
// length and booking lives here, so changing a price or adding a booking link is a one-line edit.
//
// One standard session for all five themes: 90 minutes, $333 USD (raised from $222 by Betty 27 Oct 2026). Each of the five sessions has its own $333 Stripe Payment Link
// (created 27 Oct 2026); the price card scrolls to them. Sessions for two share one
// $555 link (special, normally $666) with a dropdown for the session. The 3-session package is one
// $888 link (saves $111 on three singles, created 29 Oct 2026); she picks her sessions by email.

export const BADDIE_SESSIONS_CONTACT = "hello@thecosmicco.com";

export interface SessionOption {
  name: string;
  minutes: number;
  priceUsd: number;
  /** Same session booked for two people (a couple, besties, sisters, business partners). */
  priceForTwoUsd: number;
  /** Shown struck through next to priceForTwoUsd while the for-two special is on; null hides it. */
  priceForTwoWasUsd: number | null;
  /** One $555 Payment Link for every session: a dropdown on the checkout says which one. */
  forTwoBookingUrl: string | null;
  forTwoStripePriceId: string | null;
  /** $333 gift checkout: asks for her name, her email and an optional note. */
  giftBookingUrl: string | null;
  giftStripePriceId: string | null;
  blurb: string;
  /** Stripe Payment Link / booking page once approved. null = email Betty. */
  bookingUrl: string | null;
}

export const SESSION_OPTIONS: SessionOption[] = [
  { name: "The Baddie Session", minutes: 90, priceUsd: 333, priceForTwoUsd: 555, priceForTwoWasUsd: 666, forTwoBookingUrl: "https://buy.stripe.com/cNieVe7ArdQb65I8WV7kc0G", forTwoStripePriceId: "price_1UVIq2J6s9fRhiJoa2lZJlrr", giftBookingUrl: "https://buy.stripe.com/00w5kE07Z6nJ1Ps0qp7kc0H", giftStripePriceId: "price_1UVIwpJ6s9fRhiJow8XNHjYe", blurb: "Ninety minutes of private 1:1 coaching with me, plus the two to three hours I spend beforehand obsessing over your astrology and Human Design, with hypnosis, mindset work and energy work thrown in wherever your goals need them. 💅", bookingUrl: "#sessions" },
];

/** Three sessions, mixed and matched from all five; birth details at checkout like a single. */
export const SESSION_PACKAGE = {
  sessions: 3,
  priceUsd: 888,
  /** What three singles would cost, so the page can show the saving. */
  wasUsd: 999,
  bookingUrl: "https://buy.stripe.com/4gM00kbQHdQbdya6ON7kc0I",
  stripePriceId: "price_1UVpcwJ6s9fRhiJoHDV4BCNg",
};

export const isPackagePrice = (priceId: string | null | undefined) =>
  !!priceId && priceId.trim() === SESSION_PACKAGE.stripePriceId;

export interface BaddieSession {
  slug: string;
  number: string;
  emoji: string;
  name: string;
  tagline: string;
  body: string[];
  /** Who she is when she walks out: the card's closing line. */
  after: string;
  /** Client reviews for this session, word for word as Betty supplied them (29 Oct 2026). */
  reviews: { name: string; role: string; quote: string }[];
  focus: string[];
  cta: string;
  /** Card accent, brand palette only. */
  accent: string;
  accentInk: string;
  bookingUrl: string | null;
  /** Live $333 Stripe price behind bookingUrl; the webhook uses it to send the booking email. */
  stripePriceId: string | null;
}

export const BADDIE_SESSIONS: BaddieSession[] = [
  {
    slug: "reset", number: "01", emoji: "💖", name: "The Bad B*tch Reset",
    tagline: "For when you're ready to burn it all down and start again, hotter. 🔥",
    body: [
      "Stuck, lost, numb or one bad day away from shaving your head and moving to Bali, this is your personal reset button, babe.",
      "We dig through your astrology, your identity and the beliefs keeping you small, then we go and find the version of you who's ready to take over the whole operation.",
    ],
    after: "She walks out lighter, louder and back in charge of her own life, with the next chapter already in the diary.",
    reviews: [
      { name: "Sophie M.", role: "Marketing manager", quote: "I honestly didn't realise how much I'd lost myself until this session. I'd spent so long doing what everyone expected of me that I couldn't even tell you what I actually wanted. Betty asked questions that really made me think, and looking at my chart helped me understand some patterns I'd never connected before. I came away feeling excited about my future for the first time in ages." },
      { name: "Rachel T.", role: "Teacher", quote: "Three words. BOOK THE SESSION. I cried, I laughed, I had about seventeen lightbulb moments. Betty is like having a therapist, astrologer and your most brutally honest friend in one Zoom call. I needed someone to give me a loving kick up the bum and she absolutely delivered!" },
      { name: "Olivia K.", role: "Creative director", quote: "What stood out was how practical the session was. We covered my astrology and Human Design, but we also worked through some big decisions I'd been putting off. I left knowing exactly what I needed to prioritise. It was a really valuable 90 minutes." },
    ],
    focus: [
      "Where you are right now and what you ACTUALLY want",
      "The limiting beliefs and self-sabotage you keep putting on repeat",
      "Your astrology and Human Design, decoded",
      "Getting your confidence, identity and desire back",
      "A real plan for your next chapter, with dates on it",
    ],
    cta: "Book your reset", accent: "var(--pink)", accentInk: "#fff", bookingUrl: "https://buy.stripe.com/7sY4gAf2TcM70Lo2yx7kc0B", stripePriceId: "price_1UVGzBJ6s9fRhiJoAWw305a8",
  },
  {
    slug: "rich-btch-energy", number: "02", emoji: "💸", name: "Rich B*tch Energy",
    tagline: "Your money story is getting a full rewrite, babeeee. 💸",
    body: [
      "For the women who are DONE being broke, undercharging and apologising for wanting more, and who are ready for a filthy rich relationship with money.",
      "We go through your money astrology, your subconscious money beliefs and your manifestation patterns, then build the practical moves that get the dollars landing in your account.",
    ],
    after: "The woman who leaves this one names her price without flinching and lets the money in like she was always meant to have it.",
    reviews: [
      { name: "Jessica R.", role: "Freelance designer", quote: "Turns out my pricing wasn't the only issue. I was genuinely uncomfortable with people paying me well. WHO KNEW?! Betty helped me see how much of that came from old beliefs about money and what I thought I deserved. I've changed my rates and I'm finally quoting clients without having a minor breakdown." },
      { name: "Priya S.", role: "Business owner", quote: "I've invested in plenty of business and mindset programmes over the years, but I really appreciated how personal this felt. Betty had clearly spent time studying my chart beforehand, and the insights around self-worth and receiving were particularly relevant. We finished with a few concrete financial goals and a plan I felt confident implementing." },
      { name: "Hannah L.", role: "Photographer", quote: "Okay so I went into this thinking we'd talk about manifesting money and instead we ended up talking about why I feel guilty whenever I make any. Like??? That was unexpected. In the best way. I've been thinking about our conversation pretty much every day since." },
    ],
    focus: [
      "Your money astrology and wealth placements",
      "The money blocks you inherited from everyone else",
      "Shadow work on receiving, success and self-worth",
      "Manifestation that fits who you really are",
      "Real-world moves towards your money goals",
    ],
    cta: "Book your money session", accent: "var(--lav)", accentInk: "var(--dark)", bookingUrl: "https://buy.stripe.com/8x25kE7Ar8vRalY5KJ7kc0C", stripePriceId: "price_1UVGzCJ6s9fRhiJobkoGzRf4",
  },
  {
    slug: "shadow", number: "03", emoji: "🖤", name: "The Shadow Baddie Session",
    tagline: "Time to meet the parts of you that you've been hiding. 🖤",
    body: [
      "Your rage. Your desire. Your jealousy. Your shame. Everything you were trained to swallow so you'd be a good girl.",
      "We're dragging all of it into the light, babe.",
      "With your astrology, shadow work and personalised coaching we get to know your patterns and take back the parts of you that you've been too scared to let out, because those parts are exactly where your power has been hiding.",
    ],
    after: "Afterwards she stops shrinking to keep the peace, because every part of her finally gets a seat at the table.",
    reviews: [
      { name: "Emma W.", role: "Yoga teacher", quote: "I've been doing inner work for years and genuinely thought I understood my patterns. Apparently there were a few more layers! Exploring my Lilith placement with Betty brought up some really interesting things around anger, boundaries and the way I respond to conflict. I felt incredibly supported throughout." },
      { name: "Natalie B.", role: "HR consultant", quote: "This was a LOT, but in the best possible way. I finally understood why I keep putting everyone else's needs before my own, even when I'm exhausted and resentful. There were some uncomfortable moments, but Betty handled them with so much care. I left feeling like I'd been given permission to stop apologising for existing." },
      { name: "Chloe D.", role: "Hairstylist", quote: "Didn't expect to spend my Tuesday afternoon discussing why I can't say no to people, but here we are. 💀 Betty clocked me within about ten minutes. Honestly one of the most eye-opening things I've ever done. Still processing some of it!" },
    ],
    focus: [
      "Black Moon Lilith, Chiron and your 8th house",
      "People-pleasing, shame and good-girl conditioning",
      "Repressed rage, desire and everything you swallowed",
      "Boundaries, self-worth and taking your power back",
      "Living your shadow work out loud in real life",
    ],
    cta: "Book your shadow session", accent: "var(--dark)", accentInk: "var(--pink)", bookingUrl: "https://buy.stripe.com/28E6oI2g7fYjbq26ON7kc0D", stripePriceId: "price_1UVGzEJ6s9fRhiJo42IkpGx9",
  },
  {
    slug: "main-character", number: "04", emoji: "🔥", name: "Main Character Activation",
    tagline: "You're done playing small. Thank GOD. ✨",
    body: [
      "For the woman who's ready to be SEEN, take up all the space, say the thing and stop caring what that girl from school thinks.",
      "Whether you're building a business, changing careers, putting yourself online or finding your voice again, this session is you stepping into your power and staying there.",
    ],
    after: "Hello, main character: the one everyone clocks the second she walks in, posting, speaking and showing up like it was always her stage.",
    reviews: [
      { name: "Lauren P.", role: "Content creator", quote: "I'd been sitting on about 50 videos because I was convinced people would judge me. After our session I actually posted one. Then another. I know that sounds small, but for me it was HUGE. Betty helped me understand why being visible felt so uncomfortable and gave me some really useful ways to work through it." },
      { name: "Danielle C.", role: "Corporate lawyer", quote: "I was looking for support with confidence as I moved into a more senior position at work. The combination of astrology, coaching and practical exercises was different from anything I'd tried previously. Betty challenged some assumptions I'd held about myself for years, particularly around speaking up and taking ownership of my achievements." },
      { name: "Mia F.", role: "Fashion stylist", quote: "Betty, WHAT HAVE YOU DONE TO ME?! I've gone from overthinking every single thing I say to actually putting myself out there and applying for opportunities I would've talked myself out of six months ago. I'm feeling a little bit unstoppable right now and I LOVE IT." },
    ],
    focus: [
      "Confidence, visibility and loud self-expression",
      "Your astrology and Human Design for personal power",
      "Fear of judgement, rejection and being seen",
      "Identity, self-image and embodiment",
      "Practical ways to start showing up like HER",
    ],
    cta: "Book your activation", accent: "var(--pink-light)", accentInk: "var(--dark)", bookingUrl: "https://buy.stripe.com/cNi8wQaMDaDZfGic977kc0E", stripePriceId: "price_1UVGzFJ6s9fRhiJofGW99cFk",
  },
  {
    slug: "business", number: "05", emoji: "💼", name: "The Business Baddie Session",
    tagline: "Your big dream is about to start paying you, babeeee. 💸",
    body: [
      "For the baddies with a BIG dream they're completely obsessed with, who want to make serious dollars doing it their way, full stop.",
      "I've spent twenty years as a business consultant and strategist, so I'm bringing the brains, the receipts and the actual plan, then lining every single move up with your astrology and your Human Design, so you launch, sell and charge in a way that feels like YOU and makes you sooo much money.",
      "We're done with undercharging, playing small and waiting for someone to give you permission. You walk out knowing exactly what to sell, what to charge and when to GO for it.",
    ],
    after: "This baddie leaves as a CEO who knows exactly what she sells, what she charges and the date she's going for it.",
    reviews: [
      { name: "Rebecca J.", role: "Founder, skincare brand", quote: "I was completely overwhelmed with ideas and had no idea which direction to take my business. Betty helped me narrow everything down, rethink my offers and identify where I was wasting time. The astrology was an interesting extra dimension, but the business strategy alone made the session worthwhile. She's incredibly knowledgeable." },
      { name: "Amy S.", role: "Social media consultant", quote: "Can we talk about how I've been charging the same prices for THREE YEARS because I was scared people would say no?! Betty went through my business, my chart and my offers and basically showed me all the ways I'd been making life harder for myself. We worked out new packages and prices during the call. I needed this SO badly." },
      { name: "Francesca V.", role: "Wellness entrepreneur", quote: "I loved that Betty understood both the spiritual and commercial sides of what I'm building. I've worked with coaches who focus exclusively on mindset and others who only care about numbers, so having both perspectives in one session was refreshing. We mapped out my next launch and I walked away with clear priorities, realistic deadlines and a much stronger sense of direction." },
    ],
    focus: [
      "Your money-making astrology: your Midheaven, 10th house, 2nd house and juicy Jupiter",
      "Your Human Design blueprint for how YOU work, sell and make the big calls",
      "Offers and prices that make you feel like a whole baddie when you say them out loud",
      "Getting seen, selling without the ick and charging what you're WORTH",
      "A plan with real dates on it, so the dream finally moves out of your Notes app",
    ],
    cta: "Book your business session", accent: "var(--lav-light)", accentInk: "var(--dark)", bookingUrl: "https://buy.stripe.com/6oU6oI6wn4fBeCe3CB7kc0F", stripePriceId: "price_1UVH2vJ6s9fRhiJo5s9D8Pd7",
  },
];

/** The for-two checkout's "which session" dropdown values (Stripe only allows alphanumerics). */
export const sessionForDropdownValue = (value: string | null | undefined): BaddieSession | null =>
  BADDIE_SESSIONS.find((s) => s.slug.replace(/[^a-z0-9]/gi, "") === (value ?? "").trim()) ?? null;

export const isForTwoPrice = (priceId: string | null | undefined) =>
  !!priceId && SESSION_OPTIONS.some((o) => o.forTwoStripePriceId === priceId.trim());

export const isGiftPrice = (priceId: string | null | undefined) =>
  !!priceId && SESSION_OPTIONS.some((o) => o.giftStripePriceId === priceId.trim());

/** The session a paid Stripe price belongs to, or null if it isn't a Baddie Session. */
export function baddieSessionForPrice(priceId: string | null | undefined): BaddieSession | null {
  return (priceId && BADDIE_SESSIONS.find((s) => s.stripePriceId === priceId.trim())) || null;
}

/** Where a booking button goes: the real booking link once set, otherwise an email to Betty. */
export function bookingHref(url: string | null, subject: string): string {
  return url ?? `mailto:${BADDIE_SESSIONS_CONTACT}?subject=${encodeURIComponent(subject)}`;
}
