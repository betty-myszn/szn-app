// Presentation math for the free 7-day trial: how far through her week she is, when it ends, and
// whether it's time to press. Deliberately separate from membership-access.ts, which decides what
// she can SEE; this only decides what we SAY about it. The top bar and the dashboard panel both
// read it, so the two can never disagree about which day she's on.
//
// Everything here is derived from trial_expires_at alone, because that single timestamp is the only
// trial field the client is given (see Member in member.ts) and it's the same one the gates read.

export const TRIAL_DAYS = 7;

export interface TrialCountdown {
  /** Whole days still to run: 7 on the first day, down to 1 on the last. Floored at 1 while the
   *  trial is still live, since "0 days left" reads as already over to someone who still has full
   *  access, and the hours are carried by finalDay instead. */
  daysLeft: number;
  /** Which day of her week she's on, 1 through 7. The mirror of daysLeft. */
  dayNumber: number;
  /** Her own local "tue 8 september at 10:42pm". The expiry is a real timestamp, so she's told the
   *  moment it lands in her day rather than in LA's. */
  endsLabel: string;
  /** Same moment, day only, for the places where the time of day is noise. */
  endsDayLabel: string;
  /** The last two days, where the bar and the panel both switch to what she's about to lose. */
  urgent: boolean;
  /** Under 24 hours left, where hours matter more than days. */
  finalDay: boolean;
}

function label(endMs: number, withTime: boolean): string {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    ...(withTime ? { hour: "numeric" as const, minute: "2-digit" as const, hour12: true } : {}),
  })
    .format(new Date(endMs))
    .toLowerCase();
  // "10:42 pm" reads as "10:42pm" everywhere else on the site.
  return formatted.replace(/(\d)\s(am|pm)/, "$1$2");
}

/**
 * Where she is in her free week, or null when there's nothing to count down: no trial timestamp at
 * all, an unparseable one, or a week that has already run out. An expired trial deliberately returns
 * null rather than a zeroed countdown, because at that point she's no longer on a countdown, she's
 * on the win-back page.
 */
export function trialCountdown(trialExpiresAt: string | null, nowMs: number): TrialCountdown | null {
  if (!trialExpiresAt) return null;
  const endMs = new Date(trialExpiresAt).getTime();
  if (!Number.isFinite(endMs) || endMs <= nowMs) return null;

  const msLeft = endMs - nowMs;
  const daysLeft = Math.min(TRIAL_DAYS, Math.max(1, Math.ceil(msLeft / 86_400_000)));

  return {
    daysLeft,
    dayNumber: TRIAL_DAYS + 1 - daysLeft,
    endsLabel: label(endMs, true),
    endsDayLabel: label(endMs, false),
    urgent: daysLeft <= 2,
    finalDay: msLeft <= 86_400_000,
  };
}
