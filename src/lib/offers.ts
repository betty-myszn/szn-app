// The MY SZN ecosystem: every offer, its name, its page and its waitlist, typed ONCE. Product names
// are only ever written here so the censored spelling ("b*tch", always with the asterisk) can never
// drift between the nav, page titles, SEO, buttons, forms and emails. A test fails the build if the
// uncensored word appears anywhere in src/.
//
// Prices are Betty's confirmed numbers only. Nothing here invents dates, locations or availability:
// every upcoming offer is waitlist-only until she says it's launching.

export type OfferSlug = "mastermind" | "rich-btch-rising" | "bad-btch-report" | "baddie-coven" | "retreat" | "book";

export interface Offer {
  slug: OfferSlug;
  emoji: string;
  name: string;
  href: string;
  /** One line for cards and the ticker. */
  line: string;
  /** Confirmed price only, or null. */
  price: string | null;
  /** Brevo list id env var, overriding the canonical id below if the list is ever replaced. */
  brevoEnv: string;
  /** The Brevo list this waitlist files onto (created 13-15 Oct 2026). */
  brevoList: number;
  cta: string;
}

export const OFFERS: Record<OfferSlug, Offer> = {
  "rich-btch-rising": {
    slug: "rich-btch-rising",
    emoji: "💸",
    name: "Rich B*tch Rising",
    href: "/reports/rich-btch-rising",
    line: "your personalised money report: what your chart says about wealth, worth and getting PAID",
    price: "$88",
    brevoEnv: "BREVO_LIST_RICH_BTCH_RISING",
    brevoList: 25,
    cta: "join the waitlist",
  },
  "bad-btch-report": {
    slug: "bad-btch-report",
    emoji: "💜",
    name: "The Bad B*tch Report",
    href: "/reports/bad-btch-report",
    line: "your personalised confidence report: your power, your visibility, your most unapologetic self",
    price: null,
    brevoEnv: "BREVO_LIST_BAD_BTCH_REPORT",
    brevoList: 22,
    cta: "join the waitlist",
  },
  "baddie-coven": {
    slug: "baddie-coven",
    emoji: "🦄",
    name: "The Baddie Coven",
    href: "/baddie-coven",
    line: "our creative, cosmic clubhouse: monthly classes, rituals, witchcraft and your girls",
    price: null,
    brevoEnv: "BREVO_LIST_BADDIE_COVEN",
    brevoList: 23,
    cta: "join the waitlist",
  },
  mastermind: {
    slug: "mastermind",
    emoji: "🪐",
    name: "The MY SZN Mastermind",
    href: "/mastermind",
    line: "90 days of becoming HER, with private coaching from Betty every month",
    price: "$1,500 for 90 days ($500 a month)",
    brevoEnv: "BREVO_LIST_MASTERMIND",
    brevoList: 26,
    cta: "join the waitlist",
  },
  retreat: {
    slug: "retreat",
    emoji: "🌴",
    name: "The Bad B*tch Retreat",
    href: "/retreat",
    line: "in real life, all of you: body, sensuality, shadow, power, sisterhood",
    price: null,
    brevoEnv: "BREVO_LIST_RETREAT",
    brevoList: 24,
    cta: "join the waitlist",
  },
  book: {
    slug: "book",
    emoji: "📚",
    name: "The MY SZN Book by Betty Andrews",
    href: "/book",
    line: "becoming your future self, out now in paperback + ebook",
    price: null,
    brevoEnv: "BREVO_LIST_BOOK",
    brevoList: 27,
    cta: "get the paperback",
  },
};

export const OFFER_SLUGS = Object.keys(OFFERS) as OfferSlug[];

export function isOfferSlug(v: unknown): v is OfferSlug {
  return typeof v === "string" && (OFFER_SLUGS as string[]).includes(v);
}

/** The Brevo list a waitlist signup lands on: the env override if set, else the canonical list. */
export function waitlistListId(slug: OfferSlug): number {
  const v = process.env[OFFERS[slug].brevoEnv]?.trim();
  return v && /^\d+$/.test(v) ? parseInt(v, 10) : OFFERS[slug].brevoList;
}

// The MY SZN book on Amazon. The book page sells it directly: no waitlist.
export const BOOK_PAPERBACK_URL = "https://www.amazon.com/dp/B0FQBMQNKM";
export const BOOK_EBOOK_URL = "https://www.amazon.com/dp/B0FQ5DR8HR";

export const PODCAST = { emoji: "🎙️", name: "The MY SZN Podcast", href: "/podcast" };
