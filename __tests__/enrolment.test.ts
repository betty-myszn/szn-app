// Guards the launch switch: the homepage CTA must send new visitors into the payment flow while
// the doors are open, and must revert to lead capture once the window closes, without a code
// change. Isolated modules per case because the flag is read once at module load (build time).

const OPEN = new Date("2026-07-24T12:00:00-07:00"); // inside the 72h window
const AFTER = new Date("2026-07-27T12:00:00-07:00"); // after ENROLMENT_CLOSES

function loadWithFlag(flag: string | undefined) {
  let mod!: typeof import("@/lib/enrolment");
  jest.isolateModules(() => {
    const prev = process.env.NEXT_PUBLIC_ENROLMENT_OPEN;
    if (flag === undefined) delete process.env.NEXT_PUBLIC_ENROLMENT_OPEN;
    else process.env.NEXT_PUBLIC_ENROLMENT_OPEN = flag;
    mod = require("@/lib/enrolment");
    if (prev === undefined) delete process.env.NEXT_PUBLIC_ENROLMENT_OPEN;
    else process.env.NEXT_PUBLIC_ENROLMENT_OPEN = prev;
  });
  return mod;
}

describe("enrolment switch", () => {
  it("is CLOSED by default, so the site can never accidentally sell a closed intake", () => {
    expect(loadWithFlag(undefined).isEnrolmentOpen(OPEN)).toBe(false);
  });

  it("is CLOSED for any value other than the exact string 'true'", () => {
    expect(loadWithFlag("false").isEnrolmentOpen(OPEN)).toBe(false);
    expect(loadWithFlag("TRUE").isEnrolmentOpen(OPEN)).toBe(false);
    expect(loadWithFlag("1").isEnrolmentOpen(OPEN)).toBe(false);
    expect(loadWithFlag("").isEnrolmentOpen(OPEN)).toBe(false);
  });

  it("OPENS when the flag is on and we're inside the window", () => {
    expect(loadWithFlag("true").isEnrolmentOpen(OPEN)).toBe(true);
  });

  it("auto-reverts to closed after the window, even if the flag is left on", () => {
    expect(loadWithFlag("true").isEnrolmentOpen(AFTER)).toBe(false);
  });

  it("the close date can only close, never open: flag off inside the window stays closed", () => {
    expect(loadWithFlag(undefined).isEnrolmentOpen(OPEN)).toBe(false);
  });

  it("closes exactly at ENROLMENT_CLOSES, not a moment later", () => {
    const mod = loadWithFlag("true");
    const justBefore = new Date(mod.ENROLMENT_CLOSES.getTime() - 1000);
    expect(mod.isEnrolmentOpen(justBefore)).toBe(true);
    expect(mod.isEnrolmentOpen(mod.ENROLMENT_CLOSES)).toBe(false);
  });

  it("the window is 72 hours", () => {
    const mod = loadWithFlag("true");
    const hours = (mod.ENROLMENT_CLOSES.getTime() - mod.ENROLMENT_OPENS.getTime()) / 3_600_000;
    expect(hours).toBe(72);
  });
});
