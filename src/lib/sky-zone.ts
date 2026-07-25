/**
 * The timezone every sky date is published in.
 *
 * The ephemeris computes an exact instant; the calendar date that instant falls on depends on
 * where you stand. Quoting dates in UTC drifted them off the astrology tables these get checked
 * against, because a lot of sky events land in the small hours UTC: the 2026 Aquarius node
 * ingress is 00:46 UTC on 27 July, which is still 26 July across the US.
 *
 * US Eastern is the anchor rather than the viewer's own zone, so every member reads one published
 * date instead of a date that shifts by where she is, and rather than Pacific because Eastern is
 * what the commonly published tables agree with: it keeps the 28 August 2026 lunar eclipse
 * (04:18 UTC) on the 28th, where Pacific would print it as the 27th.
 *
 * Anything rendering a date from /api/calendar must measure "today" in this zone too, otherwise
 * a member in Asia sits up to a day ahead of the dates she's reading and every countdown is out.
 */
export const SKY_ZONE = "America/New_York";

/** Today's date in SKY_ZONE as YYYY-MM-DD, matching the date strings /api/calendar returns. */
export function todayInSkyZone(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SKY_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Whole days from today (in SKY_ZONE) to a YYYY-MM-DD sky date, negative once it's passed. */
export function daysUntilSkyDate(dateIso: string, now: Date = new Date()): number {
  const today = Date.parse(todayInSkyZone(now) + "T00:00:00Z");
  const target = Date.parse(dateIso + "T00:00:00Z");
  return Math.round((target - today) / 86400000);
}
