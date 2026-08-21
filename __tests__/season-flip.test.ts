import { SEASONS, getCurrentSeason } from "@/lib/seasons";
import { SEASON_CHALLENGES } from "@/lib/challenges";
import { getSeasonDesign } from "@/lib/season-design-content";
import { workshopCardRow, shortWorkshopMeta, WORKSHOPS } from "@/lib/workshops";

// The season surfaces read the date and swap themselves over, so the thing worth guarding is that
// every season the clock can land on actually has content behind it.

const at = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("the season the app thinks it is", () => {
  it("hands over from Leo to Virgo on 23 August", () => {
    expect(getCurrentSeason(at("2026-08-22")).sign).toBe("Leo");
    expect(getCurrentSeason(at("2026-08-23")).sign).toBe("Virgo");
    expect(getCurrentSeason(at("2026-09-22")).sign).toBe("Virgo");
    expect(getCurrentSeason(at("2026-09-23")).sign).toBe("Libra");
  });

  it("covers every day of the year with exactly one season", () => {
    for (let d = new Date("2026-01-01T12:00:00Z"); d.getUTCFullYear() === 2026; d.setUTCDate(d.getUTCDate() + 1)) {
      expect(getCurrentSeason(new Date(d)).sign).toBeTruthy();
    }
  });
});

describe("season content", () => {
  it("has a challenge set for every season, so none of them falls back to another sign's", () => {
    for (const season of SEASONS) {
      const set = SEASON_CHALLENGES[season.sign];
      expect(set).toBeDefined();
      expect(set.sign).toBe(season.sign);
      expect(set.challenges.length).toBeGreaterThanOrEqual(10);
    }
  });

  it("gives every season its own ticker lines, so none of them wears another sign's", () => {
    const seen = new Map<string, string>();
    for (const season of SEASONS) {
      expect(season.tickerLines).toHaveLength(5);
      for (const line of season.tickerLines) {
        expect(seen.get(line) ?? season.sign).toBe(season.sign);
        seen.set(line, season.sign);
      }
    }
  });

  it("has a Human Design reading for the current and next season", () => {
    expect(getSeasonDesign("leo")?.sign).toBe("Leo");
    expect(getSeasonDesign("virgo")?.sign).toBe("Virgo");
  });

  it("never puts Leo's words inside another season's Human Design reading", () => {
    const virgo = JSON.stringify(getSeasonDesign("virgo"));
    expect(virgo).not.toMatch(/Leo/i);
  });
});

describe("the workshop card row", () => {
  it("leads with what is still to come and fills the row out with replays", () => {
    const row = workshopCardRow(at("2026-08-23").getTime(), 4);
    expect(row).toHaveLength(4);
    expect(row.slice(0, 2).map((w) => w.id)).toEqual(["virgo-szn-workshop-1", "virgo-szn-workshop-2"]);
    expect(shortWorkshopMeta(row[0], at("2026-08-23").getTime())).toBe("26 aug · working session");
    expect(shortWorkshopMeta(row[2], at("2026-08-23").getTime())).toMatch(/· replay$/);
  });

  it("gives every workshop the fields the cards render", () => {
    for (const w of WORKSHOPS) {
      expect(w.blurb.length).toBeGreaterThan(0);
      expect(w.kind).toBeTruthy();
    }
  });
});
