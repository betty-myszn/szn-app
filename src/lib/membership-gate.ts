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
};

// True when this row has ANY currently-active paid tier (social, monthly or vip). This is the
// community-level gate: it unlocks the chat rooms and anything else every paying member gets. Two
// independent checks: an access-granting Stripe status on a real tier, plus a paid-through safety
// net. Deliberately tier-agnostic, the full-platform distinction lives in hasFullAccessFromRow.
export function hasAccessFromRow(row: MembershipRow | null | undefined): boolean {
  if (!row) return false;
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
  return level === "monthly" || level === "vip";
}

// Where a freshly-authenticated member should land, decided purely from membership state.
// - No active paid tier at all: the payment-first funnel sends her to pricing.
// - Social only: she never does the chart onboarding (it powers the platform she hasn't bought),
//   so she goes straight to the community, the thing she paid for.
// - Full access but not onboarded: the chart onboarding is mandatory before the portal opens.
// - Full access and onboarded: the real portal.
export function postAuthDestination(row: MembershipRow | null | undefined): string {
  if (!hasAccessFromRow(row)) return "/membership?reason=none";
  if (!hasFullAccessFromRow(row)) return "/community";
  if (!row?.onboarded) return "/onboarding";
  return "/dashboard";
}
