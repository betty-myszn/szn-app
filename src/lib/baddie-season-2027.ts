// Your Baddie Season: 2027, Betty's 2027 reading + activation (launched 15 Nov 2026).
// Two ways in: the 2027 report on its own ($111), or the report plus a 90-minute 1:1 Zoom activation
// with hypnosis (the bundle below).
// Black Friday price $333 (normally $555), capped at 20 sessions at this price (Betty's brief).
// Paid bookings run through the Baddie Session webhook flow: the offering lives in baddie-sessions.ts
// with standalone: true, so the buyer gets the session booking email and Betty gets the admin alert.

export const BADDIE_SEASON_2027 = {
  href: "/baddie-season-2027",
  buyUrl: "https://buy.stripe.com/4gMcN64of4fB2Twddb7kc0N",
  stripePriceId: "price_1Uc2aYJ6s9fRhiJoXnalsjKo",
  priceUsd: 333,
  wasUsd: 555,
  spots: 20,
  // The report on its own (forecast + manifestation blueprint, no Zoom), added 19 Nov 2026.
  report: {
    buyUrl: "https://buy.stripe.com/bJefZi8Evh2n65I3CB7kc0S",
    stripePriceId: "price_1UdYtDJ6s9fRhiJoI5OHHSrg",
    priceUsd: 111,
  },
  image: "/coven/betty-witch-email.jpg",
};
