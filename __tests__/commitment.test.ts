import { commitmentEndsAt, isInCommitment } from "@/lib/commitment";
import { isUpfrontPrice } from "@/lib/stripe-tiers";

const PLAN = "price_plan_test";
const start = "2026-10-08T10:00:00.000Z";

describe("the 3-month commitment", () => {
  it("ends 3 months after a plan membership starts", () => {
    expect(commitmentEndsAt(PLAN, start, PLAN)?.toISOString()).toBe("2027-01-08T10:00:00.000Z");
  });

  it("holds until that moment and not after", () => {
    expect(isInCommitment(PLAN, start, Date.parse("2026-12-31T00:00:00Z"), PLAN)).toBe(true);
    expect(isInCommitment(PLAN, start, Date.parse("2027-01-08T10:00:00Z"), PLAN)).toBe(false);
  });

  it("never applies to other prices, a missing start, or before the plan exists", () => {
    expect(commitmentEndsAt("price_1U3FDpJ6s9fRhiJor7ofzAzT", start, PLAN)).toBeNull();
    expect(commitmentEndsAt(PLAN, null, PLAN)).toBeNull();
    expect(commitmentEndsAt(PLAN, start, null)).toBeNull();
  });

  it("recognises the one-time 3-month prices", () => {
    expect(isUpfrontPrice("price_1UM5myJ6s9fRhiJodOXnycqj")).toBe(true);
    expect(isUpfrontPrice("price_1TwEXMJ6s9fRhiJoRzDMbrQZ")).toBe(true);
    expect(isUpfrontPrice("price_1U3FDpJ6s9fRhiJor7ofzAzT")).toBe(false);
  });
});
