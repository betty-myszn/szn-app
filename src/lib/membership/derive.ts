// Phase 1 · membership derivation. Pure functions, no I/O, no side effects. This is the single
// place every computed billing value is worked out from the stored LifecycleFacts, so the access
// checks, the billing dashboard and the Brevo sync can never disagree. Nothing in Phase 1 calls
// these yet; they exist, fully unit-tested, ready for Phases 2 to 4 to consume.

import {
  GRACE_PERIOD_DAYS,
  MINIMUM_COMMITMENT_PAYMENTS,
  type LifecycleFacts,
  type MembershipStatus,
} from "./types";

function iso(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// The lifecycle status, matching the MEMBERSHIP_STATUS synced to Brevo. Ordering matters: the
// checks are arranged most-terminal first so an ended membership can never read as active.
export function membershipStatus(facts: LifecycleFacts, now: Date = new Date()): MembershipStatus {
  const t = now.getTime();
  const accessEnds = iso(facts.accessEndsAt);
  const periodEnd = iso(facts.subscriptionCurrentPeriodEnd);

  // Former member: the daily cron has revoked the level. Kept in Brevo for win-back.
  if (facts.membershipLevel === "none") return "inactive";

  // The upfront one-time plan never renews and has no subscription, so cancel_at_period_end is set
  // true by convention and must NOT read as "cancelling". Access simply runs to the period end,
  // then the grace grant (if any), then expiry.
  if (!facts.hasSubscription) {
    if (accessEnds && accessEnds.getTime() <= t) return "expired";
    if (accessEnds && accessEnds.getTime() > t) return "cancelled_with_access";
    if (periodEnd && periodEnd.getTime() <= t) return "expired";
    return "active";
  }

  // A subscription genuinely ended (Stripe canceled/unpaid): the 7-day grant window is running,
  // or has just elapsed and the cron has not yet flipped the level to none.
  if (accessEnds) {
    return accessEnds.getTime() > t ? "cancelled_with_access" : "expired";
  }

  // Cancellation requested but still inside the paid period (no accessEndsAt set until the sub is
  // actually deleted). cancel_at_period_end here is meaningful because a live subscription exists.
  if (facts.subscriptionCancelAtPeriodEnd || facts.cancellationRequestedAt) return "cancelling";

  // A failed charge in Stripe's retry window keeps access but flags the billing issue.
  if (facts.subscriptionStatus === "past_due" || facts.subscriptionStatus === "unpaid") return "past_due";

  return "active";
}

// Whether this member currently has platform access, derived from the same facts. Grace-aware:
// inside the 7-day window access still holds even though Stripe has stopped billing.
export function hasAccess(facts: LifecycleFacts, now: Date = new Date()): boolean {
  const status = membershipStatus(facts, now);
  return status === "active" || status === "past_due" || status === "cancelling" || status === "cancelled_with_access";
}

// $333 upfront meets the commitment by construction. A $111 subscription needs three successful
// invoice.paid payments. A former member (level none) can't cancel anything.
export function eligibleToCancel(facts: LifecycleFacts): boolean {
  if (facts.membershipLevel === "none") return false;
  if (!facts.hasSubscription) return true;
  return facts.successfulPaymentsCount >= MINIMUM_COMMITMENT_PAYMENTS;
}

// Display-only estimate of when the 3-payment minimum is satisfied (commitment start + 3 months).
// Eligibility itself is driven by the payment COUNT, never by this date; this is only for the
// "You can cancel from [date]" line.
export function minimumCommitmentEndDate(facts: LifecycleFacts): Date | null {
  const start = iso(facts.commitmentStartedAt);
  if (!start) return null;
  const d = new Date(start);
  d.setMonth(d.getMonth() + MINIMUM_COMMITMENT_PAYMENTS);
  return d;
}

// The next date Stripe will charge. Null for the upfront plan (no renewal) and for a cancelling
// subscription (no further charge is coming).
export function nextBillingDate(facts: LifecycleFacts): Date | null {
  if (!facts.hasSubscription) return null;
  if (facts.subscriptionCancelAtPeriodEnd) return null;
  return iso(facts.subscriptionCurrentPeriodEnd);
}

// The earliest date the member may cancel, or null if already eligible.
export function earliestCancellationDate(facts: LifecycleFacts): Date | null {
  if (eligibleToCancel(facts)) return null;
  return minimumCommitmentEndDate(facts);
}

// How many of the minimum payments are done, for "You've completed X of 3 minimum payments".
export function commitmentProgress(facts: LifecycleFacts): { completed: number; required: number } {
  return {
    completed: Math.min(facts.successfulPaymentsCount, MINIMUM_COMMITMENT_PAYMENTS),
    required: MINIMUM_COMMITMENT_PAYMENTS,
  };
}

// The hard access cutoff (paid period end + 7-day grant), given the paid-through date. Used in
// Phase 3 when a subscription is deleted; exposed here so the grace maths lives in one place.
export function graceEndFrom(paidPeriodEnd: Date): Date {
  const d = new Date(paidPeriodEnd);
  d.setDate(d.getDate() + GRACE_PERIOD_DAYS);
  return d;
}
