import { tierForPriceId } from "@/lib/stripe-tiers";
import { hasAccessFromRow, hasFullAccessFromRow, postAuthDestination, type MembershipRow } from "@/lib/membership-gate";

const active = (level: string): MembershipRow => ({
  membership_level: level,
  subscription_status: "active",
  subscription_current_period_end: new Date(Date.now() + 30 * 864e5).toISOString(),
  subscription_cancel_at_period_end: false,
  onboarded: true,
});

describe("membership tier access gates", () => {
  it("social has community access but NOT full-platform access", () => {
    const row = active("social");
    expect(hasAccessFromRow(row)).toBe(true);
    expect(hasFullAccessFromRow(row)).toBe(false);
  });

  it("monthly has both community and full-platform access", () => {
    const row = active("monthly");
    expect(hasAccessFromRow(row)).toBe(true);
    expect(hasFullAccessFromRow(row)).toBe(true);
  });

  it("vip has both community and full-platform access", () => {
    const row = active("vip");
    expect(hasAccessFromRow(row)).toBe(true);
    expect(hasFullAccessFromRow(row)).toBe(true);
  });

  it("no tier has neither", () => {
    const row = active("none");
    expect(hasAccessFromRow(row)).toBe(false);
    expect(hasFullAccessFromRow(row)).toBe(false);
  });

  it("an inactive/cancelled social row grants nothing", () => {
    const row: MembershipRow = { ...active("social"), subscription_status: "canceled" };
    expect(hasAccessFromRow(row)).toBe(false);
    expect(hasFullAccessFromRow(row)).toBe(false);
  });

  it("a lapsed paid-through social row (cancel_at_period_end, date passed) grants nothing", () => {
    const row: MembershipRow = {
      ...active("social"),
      subscription_cancel_at_period_end: true,
      subscription_current_period_end: new Date(Date.now() - 864e5).toISOString(),
    };
    expect(hasAccessFromRow(row)).toBe(false);
  });

  describe("post-auth routing per tier", () => {
    it("no access -> pricing", () => {
      expect(postAuthDestination(active("none"))).toBe("/membership?reason=none");
    });
    it("social -> community, never the chart onboarding", () => {
      expect(postAuthDestination(active("social"))).toBe("/community");
    });
    it("full access but not onboarded -> onboarding", () => {
      expect(postAuthDestination({ ...active("monthly"), onboarded: false })).toBe("/onboarding");
    });
    it("full access and onboarded -> dashboard", () => {
      expect(postAuthDestination(active("vip"))).toBe("/dashboard");
    });
  });
});

// The gates above decide what a tier unlocks. This decides which tier a payment IS, and it's the
// step that fails silently: an unmapped price returns "none", the webhook grants nothing, and a
// paying customer is dropped with only a log line. That has happened on this account before, which
// is why the live IDs are hardcoded rather than left to env vars.
describe("live Stripe price IDs map to the right tier", () => {
  it("maps every live membership price", () => {
    expect(tierForPriceId("price_1TzVeaJ6s9fRhiJojBgk1aTJ")).toBe("social"); // $33 / month
    expect(tierForPriceId("price_1TwER7J6s9fRhiJooQRyfcwQ")).toBe("monthly"); // $111 / month
    expect(tierForPriceId("price_1TwEXMJ6s9fRhiJoRzDMbrQZ")).toBe("monthly"); // $333 upfront
    expect(tierForPriceId("price_1TwEZjJ6s9fRhiJoJ0EAROdR")).toBe("vip"); // $555 / month
  });

  it("returns none for an unknown price rather than guessing a tier", () => {
    expect(tierForPriceId("price_not_a_real_id")).toBe("none");
    expect(tierForPriceId(null)).toBe("none");
    expect(tierForPriceId(undefined)).toBe("none");
  });

  // Guards the exact incident the hardcoded map exists to prevent: env vars are allowed to add
  // new prices, but must never be able to override or erase a known live one.
  it("keeps the hardcoded mapping even if an env var contradicts it", () => {
    const prev = process.env.STRIPE_PRICE_VIP;
    process.env.STRIPE_PRICE_VIP = "price_1TzVeaJ6s9fRhiJojBgk1aTJ";
    try {
      jest.isolateModules(() => {
        const { tierForPriceId: fresh } = require("@/lib/stripe-tiers");
        expect(fresh("price_1TzVeaJ6s9fRhiJojBgk1aTJ")).toBe("social");
      });
    } finally {
      if (prev === undefined) delete process.env.STRIPE_PRICE_VIP;
      else process.env.STRIPE_PRICE_VIP = prev;
    }
  });
});
