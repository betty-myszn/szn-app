// Phase 1 · membership lifecycle types. Pure types + constants, no runtime dependencies.
//
// MembershipStatus values are the exact strings synced to Brevo's MEMBERSHIP_STATUS attribute and
// used as the single lifecycle state across the app (derived in ./derive.ts). They intentionally
// match the state machine in the architecture brief; there is no "prospect" here because a
// not-yet-paid contact simply has no membership status.

export type MembershipStatus =
  | "active"
  | "past_due"
  | "cancelling"
  | "cancelled_with_access"
  | "expired"
  | "inactive";

// The extra platform-access grant (in days) after a subscription genuinely ends. Kept here so
// every layer reads one source.
//
// There is deliberately no MINIMUM_COMMITMENT_PAYMENTS constant: membership is cancel-anytime.
// The 3-payment minimum that used to live here was removed as a product decision, along with the
// matching clauses in the terms page and the checkout agreement.
export const GRACE_PERIOD_DAYS = 7;

// Stripe subscription statuses that keep paid content unlocked. Mirrors the existing
// ACCESS_GRANTING_STATUSES in stripe-tiers.ts; duplicated as a plain set here so the pure
// derivation layer has no import into Stripe/tier code.
export const ACCESS_GRANTING_STRIPE_STATUSES: ReadonlySet<string> = new Set([
  "active",
  "trialing",
  "past_due",
]);

// The raw, stored facts the derivation layer reads. Every field is a fact written from Stripe
// truth (the pre-existing membership columns plus the Phase 1 additions); nothing here is itself
// derived. `hasSubscription` is false for the one-time $333 upfront plan, which has no Stripe
// subscription and therefore no recurring cancellation to gate.
export interface LifecycleFacts {
  membershipLevel: string; // 'none' | 'monthly' | 'vip'
  subscriptionStatus: string | null; // raw Stripe status
  subscriptionCurrentPeriodEnd: string | null; // ISO
  subscriptionCancelAtPeriodEnd: boolean;
  commitmentStartedAt: string | null; // ISO, first successful payment
  successfulPaymentsCount: number;
  cancellationRequestedAt: string | null; // ISO
  accessEndsAt: string | null; // ISO, paid period end + grace; set only when a sub genuinely ends
  hasSubscription: boolean; // false for the upfront one-time plan
}
