import { shouldWelcome } from "@/components/WelcomeOverlay";

// The welcome only ever fires for genuinely new accounts. The failure that matters is the loose one:
// ship it with a slack check and every member who has been here for months opens her dashboard to a
// popup welcoming her to a platform she already lives in.

const DAY = 86_400_000;
const now = Date.parse("2026-09-03T12:00:00.000Z");
const daysAgo = (n: number) => new Date(now - n * DAY).toISOString();

describe("shouldWelcome", () => {
  it("welcomes an account made minutes ago", () => {
    expect(shouldWelcome(new Date(now - 60_000).toISOString(), now, false)).toBe(true);
  });

  it("keeps welcoming through the first two weeks", () => {
    for (const age of [1, 5, 13]) {
      expect(shouldWelcome(daysAgo(age), now, false)).toBe(true);
    }
  });

  it("never welcomes an established member", () => {
    for (const age of [15, 40, 400]) {
      expect(shouldWelcome(daysAgo(age), now, false)).toBe(false);
    }
  });

  it("holds the boundary at fourteen days", () => {
    expect(shouldWelcome(daysAgo(14), now, false)).toBe(true);
    expect(shouldWelcome(new Date(now - 14 * DAY - 1000).toISOString(), now, false)).toBe(false);
  });

  it("never welcomes twice", () => {
    expect(shouldWelcome(daysAgo(1), now, true)).toBe(false);
  });

  it("treats a device clock running behind the server as brand new, not as an error", () => {
    expect(shouldWelcome(new Date(now + 5 * 60_000).toISOString(), now, false)).toBe(true);
  });

  it("stays quiet on a missing or unparseable join date", () => {
    expect(shouldWelcome(null, now, false)).toBe(false);
    expect(shouldWelcome(undefined, now, false)).toBe(false);
    expect(shouldWelcome("", now, false)).toBe(false);
    expect(shouldWelcome("not a date", now, false)).toBe(false);
  });
});
