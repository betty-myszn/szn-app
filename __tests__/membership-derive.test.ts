import {
  membershipStatus,
  hasAccess,
  eligibleToCancel,
  nextBillingDate,
  graceEndFrom,
} from "@/lib/membership/derive";
import type { LifecycleFacts } from "@/lib/membership/types";

const NOW = new Date("2026-07-25T12:00:00.000Z");
const future = (days: number) => new Date(NOW.getTime() + days * 86400000).toISOString();
const past = (days: number) => new Date(NOW.getTime() - days * 86400000).toISOString();

// A live, healthy $111 monthly member; individual tests override only what they exercise.
function facts(overrides: Partial<LifecycleFacts> = {}): LifecycleFacts {
  return {
    membershipLevel: "monthly",
    subscriptionStatus: "active",
    subscriptionCurrentPeriodEnd: future(20),
    subscriptionCancelAtPeriodEnd: false,
    commitmentStartedAt: past(40),
    successfulPaymentsCount: 2,
    cancellationRequestedAt: null,
    accessEndsAt: null,
    hasSubscription: true,
    ...overrides,
  };
}

describe("membershipStatus", () => {
  it("active for a healthy subscription", () => {
    expect(membershipStatus(facts(), NOW)).toBe("active");
  });

  it("past_due when Stripe is retrying a failed charge", () => {
    expect(membershipStatus(facts({ subscriptionStatus: "past_due" }), NOW)).toBe("past_due");
  });

  it("cancelling when cancel_at_period_end is set on a live subscription", () => {
    expect(
      membershipStatus(facts({ subscriptionCancelAtPeriodEnd: true, cancellationRequestedAt: past(1) }), NOW)
    ).toBe("cancelling");
  });

  it("cancelled_with_access while inside the 7-day grant", () => {
    expect(
      membershipStatus(facts({ subscriptionStatus: "canceled", accessEndsAt: future(3) }), NOW)
    ).toBe("cancelled_with_access");
  });

  it("expired once the grant has elapsed but the cron hasn't revoked the level yet", () => {
    expect(
      membershipStatus(facts({ subscriptionStatus: "canceled", accessEndsAt: past(1) }), NOW)
    ).toBe("expired");
  });

  it("inactive once the level has been revoked to none", () => {
    expect(membershipStatus(facts({ membershipLevel: "none" }), NOW)).toBe("inactive");
  });

  describe("upfront $333 plan (no subscription)", () => {
    const upfront = (o: Partial<LifecycleFacts> = {}) =>
      facts({ hasSubscription: false, subscriptionCancelAtPeriodEnd: true, ...o });

    it("reads active despite cancel_at_period_end, until the period ends", () => {
      expect(membershipStatus(upfront({ subscriptionCurrentPeriodEnd: future(30) }), NOW)).toBe("active");
    });

    it("reads expired once its paid period has passed", () => {
      expect(membershipStatus(upfront({ subscriptionCurrentPeriodEnd: past(1) }), NOW)).toBe("expired");
    });
  });
});

describe("hasAccess", () => {
  it("grants for active, past_due, cancelling and cancelled_with_access", () => {
    expect(hasAccess(facts(), NOW)).toBe(true);
    expect(hasAccess(facts({ subscriptionStatus: "past_due" }), NOW)).toBe(true);
    expect(hasAccess(facts({ subscriptionCancelAtPeriodEnd: true }), NOW)).toBe(true);
    expect(hasAccess(facts({ subscriptionStatus: "canceled", accessEndsAt: future(2) }), NOW)).toBe(true);
  });

  it("denies once expired or inactive", () => {
    expect(hasAccess(facts({ subscriptionStatus: "canceled", accessEndsAt: past(1) }), NOW)).toBe(false);
    expect(hasAccess(facts({ membershipLevel: "none" }), NOW)).toBe(false);
  });
});

describe("eligibleToCancel", () => {
  // Membership is cancel-anytime. These cases exist specifically to catch a minimum term being
  // reintroduced by accident: every payment count, including the very first, must be cancellable.
  it("allows a monthly member at any payment count, including zero", () => {
    expect(eligibleToCancel(facts({ successfulPaymentsCount: 0 }))).toBe(true);
    expect(eligibleToCancel(facts({ successfulPaymentsCount: 1 }))).toBe(true);
    expect(eligibleToCancel(facts({ successfulPaymentsCount: 2 }))).toBe(true);
    expect(eligibleToCancel(facts({ successfulPaymentsCount: 5 }))).toBe(true);
  });

  it("allows the upfront plan immediately", () => {
    expect(eligibleToCancel(facts({ hasSubscription: false, successfulPaymentsCount: 0 }))).toBe(true);
  });

  it("allows a VIP member", () => {
    expect(eligibleToCancel(facts({ membershipLevel: "vip", successfulPaymentsCount: 0 }))).toBe(true);
  });

  it("denies a former member", () => {
    expect(eligibleToCancel(facts({ membershipLevel: "none" }))).toBe(false);
  });
});

describe("billing dates", () => {
  it("nextBillingDate is the period end for a renewing subscription", () => {
    const end = future(20);
    expect(nextBillingDate(facts({ subscriptionCurrentPeriodEnd: end }))?.toISOString()).toBe(end);
  });

  it("nextBillingDate is null when cancelling or upfront", () => {
    expect(nextBillingDate(facts({ subscriptionCancelAtPeriodEnd: true }))).toBeNull();
    expect(nextBillingDate(facts({ hasSubscription: false }))).toBeNull();
  });

  it("graceEndFrom adds exactly 7 days", () => {
    expect(graceEndFrom(new Date("2026-08-01T00:00:00.000Z")).toISOString()).toBe("2026-08-08T00:00:00.000Z");
  });
});
