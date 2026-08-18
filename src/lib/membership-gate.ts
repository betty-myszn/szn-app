import { ACCESS_GRANTING_STATUSES } from "@/lib/stripe-tiers";

// Server-safe (no browser or next/navigation imports) so it can run inside proxy.ts and route
// handlers. The single source of truth for "does this row currently unlock paid content" and
// "where should a just-authenticated member land", shared by the proxy gate and the auth callback
// so the two can never disagree about who gets in.

export type MembershipRow = {
  membership_level: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  subscription_cancel_at_period_end?: boolean | null;
  onboarded?: boolean | null;
  // Free 7-day trial. When membership_level is 'trial', access is gated purely on this timestamp
  // (see hasAccessFromRow), never on any Stripe status, since a trial has no subscription.
  trial_expires_at?: string | null;
};

// True when this row is a free-trial member whose 7 days have NOT yet run out. This is the whole of
// the trial access rule: a dedicated 'trial' level plus an expiry checked at request time, so the
// trial ends exactly when trial_expires_at passes with no cron and no Stripe. A trial with a null or
// past expiry returns false here (and reads as an expired trial via isExpiredTrialRow).
export function isActiveTrialRow(row: MembershipRow | null | undefined): boolean {
  if (!row || (row.membership_level ?? "none") !== "trial") return false;
  return !!row.trial_expires_at && new Date(row.trial_expires_at).getTime() > Date.now();
}

// True when this row was a free trial that has now ended: still carries the 'trial' level (nothing
// flips it, by design, so we can tell an expired trial apart from a lapsed paid member and show her
// the dedicated "your free week is over" page) but trial_expires_at has passed.
export function isExpiredTrialRow(row: MembershipRow | null | undefined): boolean {
  if (!row || (row.membership_level ?? "none") !== "trial") return false;
  return !row.trial_expires_at || new Date(row.trial_expires_at).getTime() <= Date.now();
}

// True when this row may enter the live chat ROOMS: the free front-door tier plus every paying
// tier (social, monthly, vip). This is the lowest gate in the funnel. 'free' is unlocked by simply
// being a real free member row, it has no Stripe subscription so none of the status/expiry logic
// applies to it; every paying tier reaches the rooms too, so it defers to hasAccessFromRow for
// those. The rituals (book club, moon audios, seasonal updates) sit ABOVE this, on hasAccessFromRow.
export function hasRoomAccessFromRow(row: MembershipRow | null | undefined): boolean {
  if (!row) return false;
  if ((row.membership_level ?? "none") === "free") return true;
  // An expired trial keeps the chat rooms (rooms-and-chart-only, the same shape as the free tier);
  // everything premium is gone. An ACTIVE trial is handled by hasAccessFromRow below (full access).
  if (isExpiredTrialRow(row)) return true;
  return hasAccessFromRow(row);
}

// True when this row has ANY currently-active PAID tier (social, monthly or vip). This gates the
// rituals (book club, moon audios, seasonal updates) and, historically, the whole community.
// 'free' is deliberately NOT enough here: a free member reaches the rooms via hasRoomAccessFromRow
// and upgrades for the rituals.
//
// The $33 social tier is RETIRED FROM SALE, not deleted: no new checkout can produce it, so for
// everyone signing up now this check effectively means $88/$555, and the rituals belong to those
// tiers. Members already paying $33 keep passing here, which is the point, they keep the book club
// and moon audios they're still being charged for until they cancel or upgrade. That's why the
// ritual gate did NOT move up to hasFullAccessFromRow when the rituals moved into $88: doing so
// would have revoked a live paying customer's access. Two independent checks: an
// access-granting Stripe status on a real paid tier, plus a paid-through safety net. The
// full-platform distinction lives one level up in hasFullAccessFromRow.
export function hasAccessFromRow(row: MembershipRow | null | undefined): boolean {
  if (!row) return false;

  // Free trial: access is the trial window and nothing else. No Stripe status applies (a trial has
  // no subscription), and once trial_expires_at passes this returns false on the very next request,
  // which is the whole of the "trial can't accidentally retain access" guarantee.
  if ((row.membership_level ?? "none") === "trial") return isActiveTrialRow(row);

  const status = row.subscription_status ?? "";
  const grantsByStatus = ACCESS_GRANTING_STATUSES.has(status) && (row.membership_level ?? "none") !== "none";
  if (!grantsByStatus) return false;

  // Paid-through safety net, applied only to non-renewing access: the one-time "3 months upfront"
  // plan (no subscription, so no Stripe expiry event ever comes) and any subscription the member
  // has set to cancel at period end. Once that paid-through date passes, revoke here rather than
  // wait for an event that won't arrive. Renewing subscriptions (cancel_at_period_end false) are
  // left to their status alone, so a past_due sub still keeps its grace period instead of being
  // cut the moment its lapsed period end slips into the past.
  if (row.subscription_cancel_at_period_end && row.subscription_current_period_end) {
    if (new Date(row.subscription_current_period_end).getTime() <= Date.now()) return false;
  }
  return true;
}

// True only for the tiers that unlock the FULL personalised platform, monthly and vip. The $33
// social tier deliberately fails this: she has active paid access (hasAccessFromRow is true, so
// she gets the community) but must upgrade for the chart-powered platform. Built on top of
// hasAccessFromRow so the status/expiry safety nets are never duplicated or allowed to drift.
export function hasFullAccessFromRow(row: MembershipRow | null | undefined): boolean {
  if (!hasAccessFromRow(row)) return false;
  const level = row?.membership_level ?? "none";
  // 'trial' unlocks the full personalised platform for its 7 days, deliberately: the whole point of
  // the trial is to put her properly inside, not in a stripped-back preview. hasAccessFromRow above
  // has already confirmed the trial window is still open, so an expired trial never reaches here.
  return level === "monthly" || level === "vip" || level === "trial";
}

// Where a freshly-authenticated member should land, decided purely from membership state.
// - Free front-door tier: her own home at /home, which is a different page from the paid dashboard
//   rather than a dimmed copy of it. The rooms are one click from there.
// - No access at all (not even free): the payment-first funnel sends her to pricing.
// - Social only: she never does the chart onboarding (it powers the platform she hasn't bought),
//   so she goes straight to the community, the thing she paid for.
// - Full access but not onboarded: the chart onboarding is mandatory before the portal opens.
// - Full access and onboarded: the real portal.
export function postAuthDestination(row: MembershipRow | null | undefined): string {
  // Free tier AND expired trials: rooms-and-chart-only home. Both have room access but no paid
  // access, so both land on /home, where an expired trial additionally sees a "your free week
  // ended" banner and the premium doors sit walled.
  if (hasRoomAccessFromRow(row) && !hasAccessFromRow(row)) return "/home";
  if (!hasAccessFromRow(row)) return "/membership?reason=none";
  if (!hasFullAccessFromRow(row)) return "/community";
  if (!row?.onboarded) return "/onboarding";
  return "/dashboard";
}
