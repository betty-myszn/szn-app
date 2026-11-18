import { britishDate } from "@/lib/format-date";

// The Mastermind's facts in one place, so the page, the homepage band, the FAQ and the emails can
// never drift apart. Betty set these on 18 Nov 2026: $3,333 for the 90 days, only 8 spots, the
// January cohort starts Monday 11 January 2027 (her "11th of the 1st"). Renamed from "The MY SZN
// Mastermind" to The Bad B*tch Mastermind the same day; OFFERS.mastermind.name must match `name`.
// No dinners or in-person days are included, on purpose.
export const MASTERMIND = {
  name: "The Bad B*tch Mastermind",
  priceUsd: 3333,
  plan: { payments: 3, eachUsd: 1111 },
  spots: 8,
  startsIso: "2027-01-11",
  endsIso: "2027-04-11",
  applyByIso: "2026-12-20",
  /** The days Betty answers Telegram. */
  telegramDays: "Monday to Thursday",
} as const;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const MASTERMIND_PRICE = usd(MASTERMIND.priceUsd);
export const MASTERMIND_PLAN = `${MASTERMIND.plan.payments} payments of ${usd(MASTERMIND.plan.eachUsd)}`;
export const MASTERMIND_STARTS = `Monday the ${britishDate(MASTERMIND.startsIso)}`;
export const MASTERMIND_ENDS = `the ${britishDate(MASTERMIND.endsIso)}`;
export const MASTERMIND_APPLY_BY = `Sunday the ${britishDate(MASTERMIND.applyByIso)}`;

/**
 * The sky over the January 2027 cohort, checked against the app's swisseph engine on 18 Nov 2026
 * (US Eastern dates, see lib/sky-zone.ts). Each stage of the 90 days gets its own sky.
 */
export const MASTERMIND_SKY = {
  month1: [
    { emoji: "🪐", text: "we begin in Capricorn season", date: "11th Jan" },
    { emoji: "🛸", text: "Aquarius season", date: "20th Jan" },
    { emoji: "🌑", text: "solar eclipse in Aquarius", date: "6th Feb" },
  ],
  month2: [
    { emoji: "✨", text: "Mercury retrograde", date: "9th Feb to 3rd Mar" },
    { emoji: "🦄", text: "Pisces season", date: "18th Feb" },
    { emoji: "🔮", text: "lunar eclipse in Virgo", date: "20th Feb" },
  ],
  month3: [
    { emoji: "💖", text: "Aries season, the astrological new year", date: "20th Mar" },
    { emoji: "🪩", text: "Mars goes direct in Leo", date: "1st Apr" },
    { emoji: "🌑", text: "new moon in Aries", date: "6th Apr" },
  ],
} as const;
