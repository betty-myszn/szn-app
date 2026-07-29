import { WORKSHOPS, formatWorkshopWhenLA } from "@/lib/workshops";

const w = WORKSHOPS.find((x) => x.id === "leo-szn-workshop-1")!;

it("is Monday 3 August 2026 at 19:00 LA time", () => {
  const d = new Date(w.startIso!);
  const la = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", weekday: "long", day: "numeric",
    month: "long", hour: "numeric", minute: "2-digit",
  }).format(d);
  console.log("  LA     :", la);
  console.log("  UTC    :", d.toISOString());
  console.log("  London :", new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d));
  console.log("  NYC    :", new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(d));
  expect(la).toContain("Monday");
  expect(la).toContain("August 3");
  expect(la).toContain("7:00");
});

it("copy label matches the real instant", () => {
  expect(w.meta).toBe("3 august · 7pm la time · first live class");
});

// The homepage ticker builds its label from this, so it tracks the data instead of restating it.
// That is the bug this file exists to catch: the ticker said "tuesday" for weeks after the class
// moved to a Monday, because the weekday was typed in by hand.
it("the LA marketing label matches the workshop data", () => {
  expect(formatWorkshopWhenLA(w.startIso!)).toBe("mon 3 august · 7pm la time");
});

// Pinned to LA, not the reader. Run it from Betty's own zone (UTC+7), where 7pm LA is already the
// next calendar day, and it must still say Monday the 3rd.
it("stays anchored to LA when read from another timezone", () => {
  const original = process.env.TZ;
  process.env.TZ = "Asia/Ho_Chi_Minh";
  try {
    expect(formatWorkshopWhenLA(w.startIso!)).toBe("mon 3 august · 7pm la time");
  } finally {
    process.env.TZ = original;
  }
});
