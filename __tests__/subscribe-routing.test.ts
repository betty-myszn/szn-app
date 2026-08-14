import {
  listIdFor,
  isWaitlistSource,
  CANONICAL_LIST_WAITLIST,
  CANONICAL_LIST_CHART,
  CANONICAL_LIST_MONEY_BLUEPRINT,
} from "@/lib/subscribe-lists";

// The regression this guards: free tool leads (free chart, free human design) and any unknown source
// must never be filed on the waitlist, and only a real waitlist submission may fire the n8n waitlist
// workflow. A free Human Design chart signup (source "free-human-design") once defaulted onto the
// waitlist because it wasn't one of the two special-cased sources.

describe("subscribe list routing", () => {
  it("free tool leads never land on the waitlist", () => {
    expect(listIdFor("free-chart")).toBe(CANONICAL_LIST_CHART);
    expect(listIdFor("free-human-design")).toBe(CANONICAL_LIST_CHART);
    expect(listIdFor("free-human-design")).not.toBe(CANONICAL_LIST_WAITLIST);
  });

  it("money blueprint has its own list", () => {
    expect(listIdFor("money-blueprint")).toBe(CANONICAL_LIST_MONEY_BLUEPRINT);
  });

  it("only genuine waitlist submissions go to the waitlist list", () => {
    expect(listIdFor("waitlist")).toBe(CANONICAL_LIST_WAITLIST);
    expect(listIdFor("membership-waitlist")).toBe(CANONICAL_LIST_WAITLIST);
  });

  it("unknown or missing sources default off the waitlist, not onto it", () => {
    expect(listIdFor("something-new")).not.toBe(CANONICAL_LIST_WAITLIST);
    expect(listIdFor(undefined)).not.toBe(CANONICAL_LIST_WAITLIST);
    expect(listIdFor("")).not.toBe(CANONICAL_LIST_WAITLIST);
  });

  it("the n8n waitlist workflow fires only for genuine waitlist sources", () => {
    expect(isWaitlistSource("waitlist")).toBe(true);
    expect(isWaitlistSource("membership-waitlist")).toBe(true);
    expect(isWaitlistSource("free-chart")).toBe(false);
    expect(isWaitlistSource("free-human-design")).toBe(false);
    expect(isWaitlistSource("money-blueprint")).toBe(false);
    expect(isWaitlistSource(undefined)).toBe(false);
  });
});
