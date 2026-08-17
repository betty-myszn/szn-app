import { isApplying } from "@/lib/astrology";

// Applying = the orb is closing. Determined by relative motion, not by whether the current
// separation is under the exact angle (the bug this replaced).
describe("isApplying", () => {
  it("is applying when a faster body is closing the orb toward exact", () => {
    // Moon at 10 (13 deg/day) trailing Sun at 75 (1 deg/day). Separation 65, shrinking toward the
    // 60 sextile. That is applying.
    expect(isApplying(10, 13, 75, 1, 60)).toBe(true);
  });

  it("is separating when the bodies have moved past exact", () => {
    // Same pair but separation 58, already under 60 and still shrinking toward conjunction, so it
    // is moving away from the sextile. The old `diff < angle` heuristic wrongly called this
    // applying; it is separating.
    expect(isApplying(10, 13, 68, 1, 60)).toBe(false);
  });

  it("handles an opposition closing as applying", () => {
    // Bodies 178 apart, still spreading toward the 180 opposition (the slower body ahead is being
    // caught from behind, widening the gap toward exact).
    expect(isApplying(0, 0.5, 178, 1, 180)).toBe(true);
  });

  it("reports separating when a speed is unknown (a derived point)", () => {
    expect(isApplying(10, undefined, 75, 1, 60)).toBe(false);
    expect(isApplying(10, 13, 75, undefined, 60)).toBe(false);
  });
});
