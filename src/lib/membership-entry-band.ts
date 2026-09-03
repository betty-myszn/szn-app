import type { Member } from "@/lib/member";
import { isTrial, isExpiredTrial, hasPaidCommunityAccess } from "@/lib/membership-access";
import { trialCountdown, TRIAL_DAYS, type TrialCountdown } from "@/lib/trial-countdown";

// What the full-width band above the pricing cards on /membership should say, per reader.
//
// It used to say one thing to everybody: "Free trial, start my free 7 days", sitting above the paid
// cards as the recommended starting point. That was wrong for every logged-in reader, because the
// create-trial route refuses any email that already has an account, so the offer could not be taken
// up by any of them. It was worst for a woman already inside her free week, who was being sold the
// exact thing she was already using at the one moment she was on the page to buy.
//
// Pulled out of the page as a plain function so the branching is testable, since this is a mistake
// that has already shipped once.

export interface EntryBand {
  /** True when the band is about HER account rather than an offer to a stranger, which is what the
   *  page uses to switch it from the lavender entry styling to the pink one. */
  mine: boolean;
  eyebrow: string;
  heading: string;
  sub: string;
  body: string;
  cta: string;
  href: string;
}

/**
 * The band for this reader, or null for no band at all. Null covers two cases: we don't yet know who
 * she is (better a moment of empty space than a moment of the wrong offer), and she's already paying,
 * so there's no entry offer left to make her.
 */
export function entryBandFor(member: Member | null, nowMs: number | null, ready: boolean): EntryBand | null {
  if (!ready || nowMs === null) return null;

  // Not logged in: the free week, exactly as it always was.
  if (!member) {
    return {
      mine: false,
      eyebrow: "start here · free",
      heading: "Free trial",
      sub: "full access for 7 days · no card",
      body:
        "Come inside the whole of MY SZN free for 7 days: the personalised platform, the live monthly masterclass and astrotapping, the meditations and the community rooms. No card needed, and when the week is up the chat rooms and your charts stay yours, free, for whenever you want to come back.",
      cta: "start my free 7 days",
      href: "/free-trial",
    };
  }

  const trial: TrialCountdown | null = isTrial(member) ? trialCountdown(member.trialExpiresAt, nowMs) : null;

  // Already paying, including the retired $33 social tier. An active trial passes
  // hasPaidCommunityAccess too, so it has to be excluded explicitly.
  if (!trial && hasPaidCommunityAccess(member)) return null;

  if (trial) {
    return {
      mine: true,
      eyebrow: "you're inside your free week",
      heading: trial.finalDay ? "Last day inside" : `Day ${trial.dayNumber} of ${TRIAL_DAYS}`,
      sub: `your week ends ${trial.endsLabel}`,
      body:
        "Nothing changes today. When your week ends, the chat rooms and your charts stay yours, and the personalised platform, the workshops, the astrotapping and the meditations close. Becoming a member keeps all of it open on this same account, so you carry on from exactly where you are.",
      cta: "keep my platform · $88/mo",
      href: "#pricing",
    };
  }

  // Has an account, isn't paying, can't start a trial: the free tier, or a week that has run out.
  const expired = isExpiredTrial(member);
  return {
    mine: true,
    eyebrow: expired ? "your free week has ended" : "you're on the free tier",
    heading: expired ? "Your week is up" : "You're in the rooms",
    sub: "the chat rooms and your charts are still yours",
    body:
      "Your personalised platform, your szn guide, the live workshops, the astrotapping and the meditations are the members-only part. Everything you've already written and started stays saved on this account, so joining picks it all back up rather than starting anything again.",
    cta: "become a member · $88/mo",
    href: "#pricing",
  };
}
