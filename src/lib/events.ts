// Every paid or free MY SZN event (moon workshops, classes, coven nights, IRL gatherings) lives in
// this one list. Adding an event = adding an object here; the /events showcase and the event's own
// page read from it, so nothing needs redesigning. Members' seasonal workshops stay in workshops.ts.
//
// status: "draft" is hidden everywhere, "published" is bookable, "past" moves it to past events
// (with its replay if there is one), "archived" hides it but keeps the URL working.
// startsAt stays null until the time is confirmed: the pages say "time TBC" and never invent one.

export type EventKind = "full-moon" | "new-moon" | "class" | "creative" | "coven" | "irl" | "retreat";
export type EventStatus = "draft" | "published" | "past" | "archived";

export interface CosmicEvent {
  slug: string;
  title: string;
  subtitle: string;
  edition?: string;
  /** What it IS, in a few words, for stickers and headers (e.g. "Taurus Full Moon Workshop"). */
  badge?: string;
  kind: EventKind;
  status: EventStatus;
  /** Shown everywhere until startsAt is set. */
  dateLabel: string;
  /** ISO with offset, only once the time is confirmed. */
  startsAt: string | null;
  timezoneLabel?: string;
  /** The confirmed start written out for her timezone, shown on the page and in the email. */
  localTimes?: string[];
  /** Whole dollars; 0 = free. Always USD. */
  price: number;
  format: string;
  /** Public path under /public. Missing file falls back to the drawn artwork. */
  image?: string;
  imageAlt?: string;
  /** The artwork's own background colour, so the event hero melts into the image. */
  heroBg?: string;
  shortDescription: string;
  cta: string;
  /** Stripe Payment Link for paid events. */
  checkoutUrl?: string;
  /** Asks for birth details before payment (personalised report events). */
  collectsBirth: boolean;
  /** The day the report is promised by, and the cut-off after which a booking is promised it
   * "before we go live" instead (so a late booker is never promised a date already gone). */
  reportBy?: { label: string; bookBefore: string };
  /** Brevo list every paid booker is added to. */
  brevoListId?: number;
  joinUrl?: string;
  replayUrl?: string;
  /** The event's own page when it lives outside /events (e.g. /money-workshop). */
  href?: string;
  /** Replaces the dollar price where the event isn't sold on its own (e.g. "included in the coven"). */
  priceText?: string;
  /** CSS object-position for the listing card crop, when the subject isn't centred. */
  imagePosition?: string;
  /** In-person events only: where we meet. */
  venue?: { name: string; address: string; mapUrl: string };
  /** Members on one of these Stripe prices come free: they claim a seat on the event page instead of
   * paying (checked server-side in /api/events/member-rsvp). */
  freeForPriceIds?: string[];
  /** In-person events: the paragraphs after the date and place in the "you're booked" email. */
  bookingNotes?: string[];
}

// The in-person (LA) Bad B*tch Coven founding price: $88/month for the whole online coven plus a free
// place at one Baddie Brunch every month. The $44 online coven does NOT include the brunch.
export const LA_COVEN_PRICE_ID = "price_1UcsgJJ6s9fRhiJoMLRxqvRu";
export const LA_COVEN_CHECKOUT_URL = "https://buy.stripe.com/5kQbJ26wnh2n51E2yx7kc0Q";

export const EVENTS: CosmicEvent[] = [
  // The first LA Baddie Brunch (set by Betty 17 Nov 2026), hosted by Sublime Luv, LA Head Baddie. Lives on
  // the LA coven page (#brunch). Free for in-person coven members ($88/month, one brunch a month);
  // everyone else, $44 online members included, pays $49.
  // The $49 Payment Link closes itself after 12 sales. Food and drinks are paid at the restaurant.
  {
    slug: "baddie-brunch",
    href: "/baddie-coven/la#brunch",
    title: "The Baddie Brunch",
    subtitle: "The First LA Coven Brunch",
    edition: "Sagittarius SZN",
    badge: "LA Coven Brunch · IRL",
    kind: "irl",
    status: "published",
    dateLabel: "Saturday 5th of December 2026 · 11:30am to 1:30pm LA",
    startsAt: "2026-12-05T11:30:00-08:00",
    timezoneLabel: "Los Angeles",
    price: 49,
    priceText: "$49 · FREE for LA coven members",
    format: "In-person brunch at Bacari Silver Lake, Los Angeles",
    image: "/events/bacari/patio-fire-pit.jpg",
    imageAlt: "The tree-shaded patio at Bacari Silver Lake, with a fire pit, string lights and bistro tables",
    shortDescription:
      "A brunch to help you create your big f*cking life and go after your biggest dreams: two hours on the Bacari Silver Lake patio, hosted by Sublime, Head Baddie of LA, with astrology, manifestation, journaling, new baddie besties and a printed Sagittarius season guide Betty writes from YOUR birth chart.",
    cta: "GRAB MY SEAT 🪩",
    checkoutUrl: "https://buy.stripe.com/5kQ00kdYP13p0Lo5KJ7kc0R",
    collectsBirth: true,
    venue: { name: "Bacari Silver Lake", address: "3626 Sunset Blvd, Los Angeles, CA 90026", mapUrl: "https://maps.google.com/?q=Bacari+Silverlake+3626+Sunset+Blvd+Los+Angeles" },
    freeForPriceIds: [LA_COVEN_PRICE_ID],
    bookingNotes: [
      "Sublime, our Head Baddie of LA, is hosting, and I'm writing your printed Sagittarius season guide from your birth chart right now, with journal prompts, affirmations and manifestation exercises written just for you. It'll be waiting for you at the table.",
      "Food and drinks are ordered and paid for at Bacari, so come hungry and dressed like the woman who already has the big life.",
    ],
  },
  // The coven's first ever event, for coven members (joining is on /baddie-coven, $44/month founding
  // price). 6pm UK = 18:00 GMT on Wed 11 Nov 2026 (moved from 7pm by Betty, 8 Nov).
  {
    slug: "coven-11-11",
    href: "/baddie-coven",
    title: "The 11/11 Manifestation Workshop",
    subtitle: "Our First Ever Coven Event",
    edition: "11/11 Portal",
    badge: "Live 11/11 Coven Workshop",
    kind: "coven",
    status: "published",
    dateLabel: "Wednesday 11 November 2026 · 6pm UK",
    startsAt: "2026-11-11T18:00:00Z",
    localTimes: [
      "🇬🇧 UK: Wed 11 Nov, 6pm",
      "🇺🇸 New York: Wed 11 Nov, 1pm",
      "🇺🇸 Los Angeles: Wed 11 Nov, 10am",
      "🇦🇺 Sydney: Thu 12 Nov, 5am",
    ],
    price: 44,
    priceText: "Included in the coven",
    format: "Live online coven workshop · dress code: your future self",
    image: "/coven/betty-witch-email.jpg",
    imageAlt: "Betty in a pink witch hat, black corset dress and pink feather gloves",
    imagePosition: "50% 28%",
    shortDescription:
      "The most manifest-y date of the whole year, with candles lit and intentions set. Come dressed as your future self, the woman who already has it all, and we call her in together.",
    cta: "JOIN THE COVEN 🪄",
    collectsBirth: false,
  },
  // The free money workshop has its own page and signup at /money-workshop (waitlist offer
  // "money-workshop"); this entry just lists it on /events. 6pm UK = 18:00 GMT on 15 Nov 2026.
  {
    slug: "money-workshop",
    href: "/money-workshop",
    title: "The Free Money Workshop",
    subtitle: "Creating More Money With Astrology",
    edition: "Scorpio SZN",
    badge: "Free Live Money Workshop",
    kind: "class",
    status: "published",
    dateLabel: "Sunday 15 November 2026 · 6pm UK",
    startsAt: "2026-11-15T18:00:00Z",
    localTimes: [
      "🇬🇧 UK: Sun 15 Nov, 6pm",
      "🇺🇸 New York: Sun 15 Nov, 1pm",
      "🇺🇸 Los Angeles: Sun 15 Nov, 10am",
      "🇦🇺 Sydney: Mon 16 Nov, 5am",
    ],
    price: 0,
    format: "Live online workshop + money shadow work exercise",
    image: "/cosmic-money.png",
    imageAlt: "A roll of pink hundred-dollar bills",
    shortDescription:
      "Everything you need to know about creating more money with astrology: your 2nd and 8th houses, Jupiter, Saturn, Chiron and your path to money, then a shadow work exercise built on your own chart.",
    cta: "SAVE MY FREE SPOT 💸",
    collectsBirth: true,
  },
  {
    slug: "bad-bitches-moonifest",
    title: "BAD B*TCHES MOONIFEST",
    subtitle: "Money, Magic & Manifestation",
    edition: "Taurus Full Moon Edition",
    badge: "Live Taurus Full Moon Workshop",
    kind: "full-moon",
    status: "past",
    // The Full Moon is exact at 2°45' Taurus on 26 Oct 2026, 04:11 UTC (Sun 25 Oct 9:11pm PT,
    // 00:11 ET on the 26th), checked against swisseph. The workshop is the evening after, UK time.
    dateLabel: "Monday 26 October 2026 · 6:30pm UK",
    startsAt: "2026-10-26T18:30:00Z",
    localTimes: [
      "🇬🇧 UK: Mon 26 Oct, 6:30pm",
      "🇺🇸 New York: Mon 26 Oct, 2:30pm",
      "🇺🇸 Chicago: Mon 26 Oct, 1:30pm",
      "🇺🇸 Denver: Mon 26 Oct, 12:30pm",
      "🇺🇸 Los Angeles: Mon 26 Oct, 11:30am",
      "🇦🇺 Sydney + Melbourne: Tue 27 Oct, 5:30am",
      "🇦🇺 Brisbane: Tue 27 Oct, 4:30am",
      "🇦🇺 Perth: Tue 27 Oct, 2:30am",
    ],
    price: 44,
    format: "Live online workshop + personalised astrology report + replay",
    image: "/events/taurus-full-moon.jpg",
    heroBg: "#F1C7F9",
    imageAlt: "Taurus full moon artwork: a silver-haired woman with Taurus horns, pink dollar signs and gold stars on lilac",
    shortDescription:
      "Money, self-worth, pleasure and abundance under the Taurus Full Moon, with your own 7-10 page astrology report written for your birth chart before we go live.",
    cta: "I'M READY TO MOONIFEST 💸",
    checkoutUrl: "https://buy.stripe.com/dRm00kdYPeUf79Mgpn7kc0z",
    collectsBirth: true,
    reportBy: { label: "Sunday 25 October", bookBefore: "2026-10-25T09:00:00Z" },
    brevoListId: 28,
  },
];

export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug && e.status !== "draft");
export const upcomingEvents = () => EVENTS.filter((e) => e.status === "published");
export const pastEvents = () => EVENTS.filter((e) => e.status === "past");
export const eventHref = (e: CosmicEvent) => e.href ?? `/events/${e.slug}`;
export const priceLabel = (e: CosmicEvent) => e.priceText ?? (e.price === 0 ? "FREE" : `$${e.price} USD`);
