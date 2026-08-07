/**
 * The 8/8 Lion's Gate money portal is a timed drop: it goes live for the portal and comes down on
 * its own so nobody has to remember to unpublish it.
 *
 * The window is anchored to Los Angeles time, not the viewer's zone, so every member sees it appear
 * and disappear on the same wall-clock dates the launch was planned around. It is visible from
 * START_LA through the end of END_LA (inclusive), and hidden from 00:00 the following day in LA.
 *
 * Both the /your-season/8-8-money page and the season-page banner read from isEightEightLive(), so
 * the takedown is one source of truth: past END_LA the page redirects home and the banner vanishes.
 */
export const EIGHT_EIGHT_ZONE = "America/Los_Angeles";

/** First LA date the portal is visible. */
export const EIGHT_EIGHT_START = "2026-08-07";
/** Last LA date the portal is visible; hidden from 00:00 LA the next day (end of the 11th). */
export const EIGHT_EIGHT_END = "2026-08-11";

/** Today's date in LA as YYYY-MM-DD (en-CA formats that way). */
function todayInLa(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: EIGHT_EIGHT_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** True while the portal should be live: LA date within [START, END] inclusive. */
export function isEightEightLive(now: Date = new Date()): boolean {
  const today = todayInLa(now);
  return today >= EIGHT_EIGHT_START && today <= EIGHT_EIGHT_END;
}
