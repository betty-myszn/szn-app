import { buildSznReport, type ReportMember, type ReportRead } from "@/lib/szn-report";

const m = (picks: string[] | null, over: Partial<ReportMember> = {}): ReportMember => ({
  segment: "paying",
  eligible: true,
  picks,
  pickedAt: picks ? "2026-10-01T10:00:00Z" : null,
  pickSeason: picks ? "Libra" : null,
  history: [],
  launchSeen: false,
  ...over,
});

const reads = (area: string, n: number, who = "a"): ReportRead[] => Array.from({ length: n }, (_, i) => ({ memberKey: `${who}${i % 2}`, areaId: area }));

describe("what members want report", () => {
  it("handles launch day, when nobody has picked yet", () => {
    const r = buildSznReport([m(null), m(null), m(null, { eligible: false, segment: "lapsed" })], []);
    expect(r.adoption).toMatchObject({ eligible: 2, picked: 0, notYet: 2, rate: 0 });
    expect(r.findings[0]).toMatch(/Nobody has picked yet/);
    expect(r.nextMoves.length).toBeGreaterThan(0);
  });

  it("ranks areas by how many members picked them, and counts first choices", () => {
    const r = buildSznReport(
      [
        m(["money", "relationships"]),
        m(["money", "career"]),
        m(["relationships", "money"], { segment: "trial" }),
        m([]),
        m(null),
      ],
      [],
    );
    expect(r.areas[0]).toMatchObject({ id: "money", pickers: 3, pickShare: 100, firstChoice: 2, avgRank: 1.3 });
    expect(r.areas[1]).toMatchObject({ id: "relationships", pickers: 2, trialPickers: 1, payingPickers: 1 });
    expect(r.adoption).toMatchObject({ eligible: 5, picked: 3, skipped: 1, notYet: 1, rate: 60 });
    expect(r.combos[0]).toEqual({ label: "love + money", count: 2 });
    expect(r.findings.join(" ")).toMatch(/Money is what members want most: 3 of 3/);
  });

  it("spots an area read far more than it is picked", () => {
    const members = [m(["money"]), m(["money"]), m(["money"]), m(["money", "career"]), m(["money"])];
    const r = buildSznReport(members, [...reads("healing", 8), ...reads("money", 2)]);
    expect(r.findings.join(" ")).toMatch(/Hidden demand: healing/);
  });

  it("tracks picking season by season from history", () => {
    const r = buildSznReport(
      [
        m(["money"], { history: [{ s: "Virgo", p: ["career"], at: "2026-09-01T00:00:00Z" }, { s: "Libra", p: ["money"], at: "2026-10-01T00:00:00Z" }] }),
        m(["relationships"]),
      ],
      [],
    );
    expect(r.bySeason).toEqual(expect.arrayContaining([{ season: "Libra", pickers: 2 }, { season: "Virgo", pickers: 1 }]));
  });

  it("never writes an em dash into a finding", () => {
    const r = buildSznReport([m(["money", "relationships", "career"]), m(["healing"], { segment: "trial" })], reads("mindset", 6));
    for (const line of [...r.findings, ...r.nextMoves]) expect(line).not.toMatch(/—/);
  });
});
