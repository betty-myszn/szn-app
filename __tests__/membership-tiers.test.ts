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
