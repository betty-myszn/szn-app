// The doors replace the old always-open enrolment flag. MY SZN now opens for a few days at the start
// of each season and closes at a real sky moment, so "closed" is a normal state, but it must always
// be a closed state with a next door to point at, and the moments must match the ephemeris.

import { DOORS, doorState, applyOverride, currentChapter, doorDay, doorTime, sznList } from "@/lib/doors";
import { sznTheme } from "@/lib/szn-themes";
import { SKY_BANK } from "@/lib/sky-bank";

const at = (iso: string) => Date.parse(iso);
const founding = DOORS[0];

describe("doorState", () => {
  it("is closed before the founding door, pointing at it", () => {
    const s = doorState(at("2026-10-02T12:00:00Z"));
    expect(s.open).toBeNull();
    expect(s.next?.id).toBe("founding-2026");
  });

  it("is open from the opening instant until the exact close", () => {
    expect(doorState(at(founding.opensAt)).open?.id).toBe("founding-2026");
    expect(doorState(at(founding.closesAt) - 1000).open?.id).toBe("founding-2026");
    expect(doorState(at(founding.closesAt)).open).toBeNull();
  });

  it("points at the Scorpio door once the founding door has closed", () => {
    const s = doorState(at("2026-10-15T12:00:00Z"));
    expect(s.open).toBeNull();
    expect(s.next?.id).toBe("scorpio-2026");
  });

  it("has nothing to offer after the last door, which is the cue to schedule the next chapter", () => {
    const s = doorState(at("2027-01-05T12:00:00Z"));
    expect(s).toEqual({ open: null, next: null });
  });
});

describe("the schedule", () => {
  it("is in order, never overlaps, and every door is open for two to four days", () => {
    for (let i = 0; i < DOORS.length; i++) {
      const d = DOORS[i];
      const days = (at(d.closesAt) - at(d.opensAt)) / 86_400_000;
      expect(days).toBeGreaterThanOrEqual(2);
      expect(days).toBeLessThanOrEqual(4);
      if (i > 0) expect(at(d.opensAt)).toBeGreaterThanOrEqual(at(DOORS[i - 1].closesAt));
    }
  });

  it("closes the founding door at the exact Libra new moon", () => {
    const nm = SKY_BANK.find((e) => e.type === "new_moon" && e.sign === "Libra" && e.utc.startsWith("2026-10"));
    expect(nm).toBeDefined();
    expect(at(founding.closesAt)).toBe(at(nm!.utc));
  });

  it("commits each intake to three consecutive seasons starting with its own", () => {
    expect(founding.szns).toEqual(["Libra", "Scorpio", "Sagittarius"]);
    expect(DOORS.find((d) => d.id === "scorpio-2026")!.szns).toEqual(["Scorpio", "Sagittarius", "Capricorn"]);
    expect(sznList(founding)).toBe("Libra, Scorpio and Sagittarius");
  });

  it("formats door moments in LA and New York", () => {
    expect(doorDay(founding.opensAt)).toBe("wednesday 7 october");
    expect(doorTime(founding.opensAt)).toBe("6am la · 9am new york");
    expect(doorTime(founding.closesAt)).toBe("8:50am la · 11:50am new york");
  });
});

describe("applyOverride", () => {
  const closed = doorState(at("2026-10-02T12:00:00Z"));
  it("holds the doors open with 'true' and shut with 'false'", () => {
    expect(applyOverride(closed, "true").open?.id).toBe("founding-2026");
    expect(applyOverride(doorState(at(founding.opensAt)), "false").open).toBeNull();
  });
  it("leaves the schedule in charge for anything else", () => {
    for (const f of [undefined, "", "TRUE", "no", "0"]) expect(applyOverride(closed, f)).toEqual(closed);
  });
});

describe("chapter + themes", () => {
  it("runs Become Her Before 2027 until the solstice", () => {
    expect(currentChapter(at("2026-11-01T00:00:00Z"))?.title).toBe("Become Her Before 2027");
    expect(currentChapter(at("2026-12-22T00:00:00Z"))).toBeNull();
  });
  it("names the three stages and falls back for undesigned seasons", () => {
    expect(founding.szns.map((s) => sznTheme(s).name)).toEqual(["Self-Love SZN", "Bad B*tch SZN", "Big Dream SZN"]);
    expect(sznTheme("Aquarius").name).toBe("Aquarius SZN");
  });
});
