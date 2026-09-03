import { trialCountdown, TRIAL_DAYS } from "@/lib/trial-countdown";

// The trial bar and the dashboard keep-panel both tell a member which day of her free week she's on,
// and they derive it from one timestamp. Getting the boundaries wrong is the kind of bug nobody
// reports and everybody notices: a woman told she has "0 days left" while she still has full access,
// or told it's day 8 of 7. These lock the edges down.

const DAY = 86_400_000;
const start = Date.parse("2026-09-01T15:42:00.000Z");
const expires = new Date(start + TRIAL_DAYS * DAY).toISOString();

describe("trialCountdown", () => {
  it("opens on day 1 with the full week to run", () => {
    const c = trialCountdown(expires, start);
    expect(c).not.toBeNull();
    expect(c!.dayNumber).toBe(1);
    expect(c!.daysLeft).toBe(TRIAL_DAYS);
    expect(c!.urgent).toBe(false);
    expect(c!.finalDay).toBe(false);
  });

  it("counts the day up and the days left down in step", () => {
    for (let elapsed = 0; elapsed < TRIAL_DAYS; elapsed++) {
      const c = trialCountdown(expires, start + elapsed * DAY);
      expect(c!.dayNumber + c!.daysLeft).toBe(TRIAL_DAYS + 1);
    }
  });

  it("turns urgent for the last two days and marks the final day inside 24 hours", () => {
    const twoDaysOut = trialCountdown(expires, start + 5 * DAY);
    expect(twoDaysOut!.daysLeft).toBe(2);
    expect(twoDaysOut!.urgent).toBe(true);
    expect(twoDaysOut!.finalDay).toBe(false);

    const lastDay = trialCountdown(expires, start + 6 * DAY + 1000);
    expect(lastDay!.daysLeft).toBe(1);
    expect(lastDay!.dayNumber).toBe(TRIAL_DAYS);
    expect(lastDay!.finalDay).toBe(true);
  });

  it("never counts below one day while she still has access", () => {
    // A minute before expiry she is still a full member, so "0 days left" would be a lie.
    const c = trialCountdown(expires, start + TRIAL_DAYS * DAY - 60_000);
    expect(c!.daysLeft).toBe(1);
    expect(c!.dayNumber).toBe(TRIAL_DAYS);
  });

  it("returns null once the week is over, so nothing counts down on an expired trial", () => {
    expect(trialCountdown(expires, start + TRIAL_DAYS * DAY)).toBeNull();
    expect(trialCountdown(expires, start + 30 * DAY)).toBeNull();
  });

  it("returns null for anyone who isn't on a trial at all", () => {
    expect(trialCountdown(null, start)).toBeNull();
    expect(trialCountdown("not a date", start)).toBeNull();
  });

  it("labels the end in the reader's own local time", () => {
    const c = trialCountdown(expires, start);
    // Format, not timezone: the label is built in whatever zone the reader's browser is in.
    expect(c!.endsLabel).toMatch(/^[a-z]{3} \d{1,2} [a-z]+ at \d{1,2}:\d{2}(am|pm)$/);
    expect(c!.endsDayLabel).toMatch(/^[a-z]{3} \d{1,2} [a-z]+$/);
  });
});
