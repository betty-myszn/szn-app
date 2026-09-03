import { entryBandFor } from "@/lib/membership-entry-band";
import type { Member, MembershipLevel } from "@/lib/member";

// /membership used to offer the free 7-day trial to everyone who opened it, including the women
// already inside their free week, on a full-width band above the paid cards. Nobody with an account
// can start a trial (create-trial refuses any email that already exists), so the offer was
// undeliverable for every logged-in reader and actively counter-productive for a trial member, who
// was being sold the thing she was already using at the moment she was there to buy.
//
// These lock the branching down so it can't quietly come back.

const DAY = 86_400_000;
const now = Date.parse("2026-09-03T12:00:00.000Z");

function memberAt(level: MembershipLevel, extra: Partial<Member> = {}): Member {
  return {
    id: "u1",
    name: "Test",
    email: "test@example.com",
    placements: {} as Member["placements"],
    memberSince: "2026-09-01",
    isAdmin: false,
    hasRealChart: true,
    membershipLevel: level,
    hasFullAccess: level === "monthly" || level === "vip",
    subscriptionStatus: null,
    subscriptionCurrentPeriodEnd: null,
    subscriptionCancelAtPeriodEnd: false,
    trialExpiresAt: null,
    onboarded: true,
    blocked: false,
    passwordSet: true,
    ...extra,
  };
}

describe("entryBandFor", () => {
  it("offers the free week to a stranger, unchanged", () => {
    const band = entryBandFor(null, now, true);
    expect(band).not.toBeNull();
    expect(band!.href).toBe("/free-trial");
    expect(band!.cta).toBe("start my free 7 days");
    expect(band!.mine).toBe(false);
  });

  it("never offers a trial to someone already on one", () => {
    const trialing = memberAt("trial", { trialExpiresAt: new Date(now + 4 * DAY).toISOString() });
    const band = entryBandFor(trialing, now, true);
    expect(band!.href).toBe("#pricing");
    expect(band!.href).not.toBe("/free-trial");
    expect(band!.cta).toMatch(/\$88/);
    expect(band!.heading).toBe("Day 4 of 7");
    expect(band!.mine).toBe(true);
  });

  it("counts her down to the last day", () => {
    const lastDay = memberAt("trial", { trialExpiresAt: new Date(now + 6 * 3_600_000).toISOString() });
    expect(entryBandFor(lastDay, now, true)!.heading).toBe("Last day inside");
  });

  it("offers the join, not another trial, to a used-up trial", () => {
    const expired = memberAt("trial", { trialExpiresAt: new Date(now - DAY).toISOString() });
    const band = entryBandFor(expired, now, true);
    expect(band!.href).toBe("#pricing");
    expect(band!.eyebrow).toBe("your free week has ended");
  });

  it("offers the join, not a trial, to a free-tier member", () => {
    const band = entryBandFor(memberAt("free"), now, true);
    expect(band!.href).toBe("#pricing");
    expect(band!.eyebrow).toBe("you're on the free tier");
  });

  it("shows no band at all to anyone already paying", () => {
    for (const level of ["monthly", "vip", "social"] as const) {
      const paying = memberAt(level, { subscriptionStatus: "active" });
      expect(entryBandFor(paying, now, true)).toBeNull();
    }
  });

  it("shows nothing until we know who she is, rather than guessing", () => {
    const trialing = memberAt("trial", { trialExpiresAt: new Date(now + 4 * DAY).toISOString() });
    expect(entryBandFor(trialing, now, false)).toBeNull();
    expect(entryBandFor(trialing, null, true)).toBeNull();
  });
});
