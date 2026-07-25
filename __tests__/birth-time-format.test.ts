import { normalizeBirthTime } from "@/lib/chart-sync";

// Mirrors the validation in src/app/api/calculate/route.ts so the two can't drift apart.
function apiAccepts(raw: string): string | null {
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(raw.trim());
  if (!m) return null;
  if (Number(m[1]) > 23 || Number(m[2]) > 59) return null;
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}

describe("birth time normalisation", () => {
  it("strips seconds from a Postgres `time` value", () => {
    expect(normalizeBirthTime("16:30:00")).toBe("16:30");
  });
  it("leaves an already-clean HH:mm value untouched", () => {
    expect(normalizeBirthTime("16:30")).toBe("16:30");
  });
  it("pads a single-digit hour", () => {
    expect(normalizeBirthTime("4:30")).toBe("04:30");
  });
  it("handles midnight and end of day", () => {
    expect(normalizeBirthTime("00:00:00")).toBe("00:00");
    expect(normalizeBirthTime("23:59:00")).toBe("23:59");
  });
});

describe("api time validation", () => {
  it("accepts the real stored values that used to be rejected", () => {
    expect(apiAccepts("16:30:00")).toBe("16:30"); // betty
    expect(apiAccepts("12:47:00")).toBe("12:47"); // ian
  });
  it("still accepts plain HH:mm from the time picker", () => {
    expect(apiAccepts("04:30")).toBe("04:30");
  });
  it("rejects genuinely invalid input", () => {
    expect(apiAccepts("")).toBeNull();
    expect(apiAccepts("4:30 PM")).toBeNull();
    expect(apiAccepts("25:00")).toBeNull();
    expect(apiAccepts("12:75")).toBeNull();
    expect(apiAccepts("nonsense")).toBeNull();
  });
});
