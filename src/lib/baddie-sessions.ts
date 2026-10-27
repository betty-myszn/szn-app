// The Baddie Sessions: Betty's five 1:1 coaching sessions. Everything a visitor sees about price,
// length and booking lives here, so changing a price or adding a booking link is a one-line edit.
//
// One standard session for all five themes: 90 minutes, $333 USD (raised from $222 by Betty 27 Oct 2026). Each of the five sessions has its own $333 Stripe Payment Link
// (created 27 Oct 2026); the price card scrolls to them. Sessions for two share one
// $555 link (special, normally $666) with a dropdown for the session.

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

export interface BaddieSession {
  slug: string;
  number: string;
  emoji: string;
  name: string;
  tagline: string;
  body: string[];
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
