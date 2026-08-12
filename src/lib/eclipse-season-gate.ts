/**
 * Eclipse season is a timed banner, the same pattern as the 8/8 Lion's Gate drop: it goes live for
 * the season and takes itself down on its own so nobody has to remember to unpublish it.
 *
 * The window is anchored to Los Angeles time, not the viewer's zone, so every visitor sees it appear
 * and disappear on the same wall-clock dates. This eclipse season runs the Leo solar eclipse (12 Aug
 * 2026) through the Pisces lunar eclipse (28 Aug 2026), with a few days either side. Both the home
 * page acquisition banner and the dashboard member banner read from isEclipseSeasonLive(), so the
 * takedown is one source of truth.
 */
export const ECLIPSE_SEASON_ZONE = "America/Los_Angeles";

/** First LA date the eclipse-season banner is visible (the run-up to the 12 Aug Leo solar eclipse). */
export const ECLIPSE_SEASON_START = "2026-08-11";
/** Last LA date it is visible; hidden from 00:00 LA the next day. */
export const ECLIPSE_SEASON_END = "2026-08-31";

/** Today's date in LA as YYYY-MM-DD (en-CA formats that way). */
function todayInLa(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ECLIPSE_SEASON_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** True while the eclipse-season banner should be live: LA date within [START, END] inclusive. */
export function isEclipseSeasonLive(now: Date = new Date()): boolean {
  const today = todayInLa(now);
  return today >= ECLIPSE_SEASON_START && today <= ECLIPSE_SEASON_END;
}
