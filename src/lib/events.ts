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
  kind: EventKind;
  status: EventStatus;
  /** Shown everywhere until startsAt is set. */
  dateLabel: string;
  /** ISO with offset, only once the time is confirmed. */
  startsAt: string | null;
  timezoneLabel?: string;
  /** Whole dollars; 0 = free. Always USD. */
  price: number;
  format: string;
  /** Public path under /public. Missing file falls back to the drawn artwork. */
  image?: string;
  imageAlt?: string;
  shortDescription: string;
  cta: string;
  /** Stripe Payment Link for paid events. */
  checkoutUrl?: string;
  /** Asks for birth details before payment (personalised report events). */
  collectsBirth: boolean;
  joinUrl?: string;
  replayUrl?: string;
}

export const EVENTS: CosmicEvent[] = [
  {
    slug: "bad-bitches-moonifest",
    title: "BAD B*TCHES MOONIFEST",
    subtitle: "Money, Magic & Manifestation",
    edition: "Taurus Full Moon Edition",
    kind: "full-moon",
    status: "published",
    // The Full Moon is exact at 2°45' Taurus on 26 Oct 2026, 04:11 UTC (Sun 25 Oct 9:11pm PT,
    // 00:11 ET on the 26th), checked against swisseph. The workshop runs the weekend before.
    dateLabel: "Weekend of October 24-25, 2026 · exact time TBC",
    startsAt: null,
    price: 44,
    format: "Live online workshop + personalised astrology report + replay",
    image: "/events/taurus-full-moon-workshop.jpg",
    imageAlt: "Taurus full moon workshop artwork: a silver-haired woman with Taurus horns, pink dollar signs and gold stars on lilac",
    shortDescription:
      "Money, self-worth, pleasure and abundance under the Taurus Full Moon, with your own 7-10 page astrology report written for your birth chart before we go live.",
    cta: "I'M READY TO MOONIFEST 💸",
    checkoutUrl: "https://buy.stripe.com/dRm00kdYPeUf79Mgpn7kc0z",
    collectsBirth: true,
  },
];

export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug && e.status !== "draft");
export const upcomingEvents = () => EVENTS.filter((e) => e.status === "published");
export const pastEvents = () => EVENTS.filter((e) => e.status === "past");
export const priceLabel = (e: CosmicEvent) => (e.price === 0 ? "FREE" : `$${e.price} USD`);
