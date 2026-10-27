// The Baddie Sessions: Betty's four 1:1 coaching sessions. Everything a visitor sees about price,
// length and booking lives here, so changing a price or adding a booking link is a one-line edit.
//
// One standard session for all four themes: 90 minutes, $333 USD (raised from $222 by Betty 27 Oct 2026). No booking or payment system is connected yet:
// while bookingUrl is null every button opens an email to Betty with the session in the subject.

export const BADDIE_SESSIONS_CONTACT = "hello@thecosmicco.com";

export interface SessionOption {
  name: string;
  minutes: number;
  priceUsd: number;
  /** Same session booked for two people (a couple, besties, sisters, business partners). */
  priceForTwoUsd: number;
  blurb: string;
  /** Stripe Payment Link / booking page once approved. null = email Betty. */
  bookingUrl: string | null;
}

export const SESSION_OPTIONS: SessionOption[] = [
  { name: "The Baddie Session", minutes: 90, priceUsd: 333, priceForTwoUsd: 666, blurb: "Ninety minutes of private 1:1 coaching, strategised around your astrology and Human Design, with hypnosis, mindset work and energy work woven in wherever your goals need it.", bookingUrl: null },
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
}

export const BADDIE_SESSIONS: BaddieSession[] = [
  {
    slug: "reset", number: "01", emoji: "💖", name: "The Bad B*tch Reset",
    tagline: "For when you're ready to get your sh*t together and start again.",
    body: [
      "Feeling stuck, lost, disconnected or ready for a major life change? This is your personal reset button.",
      "We'll explore your astrology, identity, limiting beliefs and the version of you who's ready to take over.",
    ],
    focus: [
      "Understanding where you are and what you actually want",
      "Identifying limiting beliefs and self-sabotaging patterns",
      "Exploring your astrology and Human Design",
      "Reconnecting with your confidence, identity and desires",
      "Creating an actionable plan for your next chapter",
    ],
    cta: "Book your reset", accent: "var(--pink)", accentInk: "#fff", bookingUrl: null,
  },
  {
    slug: "rich-btch-energy", number: "02", emoji: "💸", name: "Rich B*tch Energy",
    tagline: "Your money story is getting a rewrite, babe.",
    body: [
      "For women who are ready to make more money, stop getting in their own way and build a healthier, more powerful relationship with wealth.",
      "We'll explore your money astrology, subconscious beliefs, manifestation patterns and practical ways to build financial confidence.",
    ],
    focus: [
      "Your personal money astrology and wealth placements",
      "Identifying money blocks and inherited beliefs",
      "Shadow work around receiving, success and self-worth",
      "Manifestation practices that work with your identity",
      "Practical actions to support your financial goals",
    ],
    cta: "Book your money session", accent: "var(--lav)", accentInk: "var(--dark)", bookingUrl: null,
  },
  {
    slug: "shadow", number: "03", emoji: "🖤", name: "The Shadow Baddie Session",
    tagline: "Time to meet the parts of yourself you've been hiding.",
    body: [
      "Your anger. Your desires. Your jealousy. Your shame. The things you've been taught to suppress to be a good girl.",
      "We're bringing them into the light.",
      "Through astrology, shadow work and personalised coaching, we'll explore your patterns and help you reclaim the parts of yourself you've been afraid to express.",
    ],
    focus: [
      "Black Moon Lilith, Chiron and 8th house themes",
      "People-pleasing, shame and limiting beliefs",
      "Repressed emotions, anger and desire",
      "Boundaries, self-worth and personal power",
      "Integrating shadow work into everyday life",
    ],
    cta: "Book your shadow session", accent: "var(--dark)", accentInk: "var(--pink)", bookingUrl: null,
  },
  {
    slug: "main-character", number: "04", emoji: "🔥", name: "Main Character Activation",
    tagline: "You're done playing small. Good.",
    body: [
      "For the woman who's ready to be SEEN, take up space, express herself and stop worrying about what everybody else thinks.",
      "Whether you're building a business, changing careers, putting yourself online or simply finding your voice again, this session is about stepping into your power.",
    ],
    focus: [
      "Confidence, visibility and self-expression",
      "Your astrology and Human Design for personal power",
      "Fear of judgement, rejection and being seen",
      "Identity, self-image and embodiment",
      "Practical steps to start showing up differently",
    ],
    cta: "Book your activation", accent: "var(--pink-light)", accentInk: "var(--dark)", bookingUrl: null,
  },
];

/** Where a booking button goes: the real booking link once set, otherwise an email to Betty. */
export function bookingHref(url: string | null, subject: string): string {
  return url ?? `mailto:${BADDIE_SESSIONS_CONTACT}?subject=${encodeURIComponent(subject)}`;
}
