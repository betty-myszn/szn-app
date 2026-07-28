// Guards the launch switch: the homepage CTA must send new visitors into the payment flow, and
// must only fall back to lead capture when someone deliberately closes the doors. Isolated modules
// per case because the flag is read once at module load (build time).
//
// These assertions are deliberately the inverse of what they used to be. The old switch defaulted
// to closed and auto-closed after a 72-hour window; that expired and silently turned the whole
// site into a waitlist. Open is now the default and closing is explicit.

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
  it("is OPEN by default, with no env var set", () => {
    expect(loadWithFlag(undefined).isEnrolmentOpen()).toBe(true);
  });

  it("closes only for the exact string 'false'", () => {
    expect(loadWithFlag("false").isEnrolmentOpen()).toBe(false);
  });

  it("fails OPEN for any other value, so a typo can't take the doors down", () => {
    expect(loadWithFlag("FALSE").isEnrolmentOpen()).toBe(true);
    expect(loadWithFlag("0").isEnrolmentOpen()).toBe(true);
    expect(loadWithFlag("").isEnrolmentOpen()).toBe(true);
    expect(loadWithFlag("no").isEnrolmentOpen()).toBe(true);
  });

  it("stays open for the legacy 'true' value, so an existing Railway variable is harmless", () => {
    expect(loadWithFlag("true").isEnrolmentOpen()).toBe(true);
  });

  it("never closes on its own: no date can flip it back", () => {
    // The regression this guards: a hard-coded close date meant the doors shut with no deploy and
    // no way to reopen them from the dashboard. Enrolment state must depend on the flag alone.
    const mod = loadWithFlag(undefined);
    expect(mod.isEnrolmentOpen()).toBe(true);
    expect(mod).not.toHaveProperty("ENROLMENT_CLOSES");
  });
});
