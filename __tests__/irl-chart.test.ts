import { summariseApplicantChart } from "@/lib/irl-chart";
import { buildIrlApplicationAlert, type IrlApplicationAlertArgs } from "@/lib/email/admin-notify";
import { safeCell, sheetRow } from "@/lib/irl-sheet";

// The same reference birth the astrology tests use: 4 Aug 1961, 7:24 PM, Honolulu.
const birth = {
  name: "Test", birthDate: "1961-08-04", birthTime: "19:24", approximate: false,
  place: "Honolulu, Hawaii, United States", lat: 21.3069, lng: -157.8583, tz: "Pacific/Honolulu",
};

describe("summariseApplicantChart", () => {
  it("gives the big three, personal planets and human design", () => {
    const c = summariseApplicantChart(birth)!;
    expect(c.sun).toBe("Leo");
    expect(c.moon).toBe("Gemini");
    expect(c.rising).toBe("Aquarius");
    expect(c.hd_type).toBeTruthy();
    expect(c.hd_profile).toMatch(/^\d\/\d$/);
    expect(c.time_approximate).toBe(false);
  });

  it("accepts a time read back from Postgres with seconds, and carries the approximate flag", () => {
    const c = summariseApplicantChart({ ...birth, birthTime: "19:24:00", approximate: true })!;
    expect(c.rising).toBe("Aquarius");
    expect(c.time_approximate).toBe(true);
  });
});

describe("buildIrlApplicationAlert", () => {
  const app: IrlApplicationAlertArgs = {
    reference: "IRL-LDN-0001", city: "London", status: "new",
    full_name: "Jess <b>Test</b>", email: "jess@example.com", phone: null,
    instagram: "@jess", tiktok: null, linkedin: null, occupation: "Florist",
    birth_date: "1961-08-04", birth_time: "19:24", birth_time_approximate: false,
    birth_place: "Honolulu, Hawaii, United States",
    chart_summary: summariseApplicantChart(birth),
    why_host: "Why", astrology_relationship: "Astro", relevant_experience: "Ten years in salons",
    speaking_comfort: 4, scenario_answer: "Scenario", second_scenario: "Pull up a chair between them",
    local_ideas: "Ideas", frequency_ok: "usually", travel_ok: "depends", side_role_ok: "yes",
    girls_night: "A candlelit rooftop",
  };

  it("puts the chart and every answer in the email, escaped", () => {
    const { subject, htmlContent } = buildIrlApplicationAlert({ ...app, id: "abc-123" });
    expect(subject).toContain("London");
    expect(subject).toContain("Leo sun");
    expect(htmlContent).toContain("Aquarius");
    expect(htmlContent).toContain(app.chart_summary!.hd_type!);
    expect(htmlContent).toContain("Ten years in salons");
    expect(htmlContent).toContain("Pull up a chair between them");
    expect(htmlContent).toContain("A candlelit rooftop");
    expect(htmlContent).toContain("Usually");
    expect(htmlContent).toContain("Depends on location");
    expect(htmlContent).toContain("/admin/irl-hosts?id=abc-123");
    expect(htmlContent).not.toContain("<b>Test</b>");
  });
});

describe("sheetRow", () => {
  const app = {
    id: "abc-123", submitted_at: "2026-09-14T09:00:00.000Z", reference: "IRL-LDN-0001", city: "London",
    full_name: "Jess Test", email: "jess@example.com", phone: "+44 7700 900123",
    instagram: "@jess", tiktok: "jess", linkedin: "linkedin.com/in/jess", occupation: "Florist",
    birth_date: "1961-08-04", birth_time: "19:24:00", birth_time_approximate: true,
    birth_place: "Honolulu, Hawaii, United States", chart_summary: summariseApplicantChart(birth),
    why_host: "=IMPORTXML(\"https://example.com\", \"//a\")", astrology_relationship: "Astro",
    relevant_experience: "Salons", speaking_comfort: 4, scenario_answer: "Scenario",
    second_scenario: "Second", local_ideas: "Ideas", frequency_ok: "yes", travel_ok: "yes",
    side_role_ok: "yes", girls_night: "Night",
  };

  it("turns every answer into a column, with links and the chart", () => {
    const row = sheetRow(app);
    expect(row["Instagram"]).toBe("https://instagram.com/jess");
    expect(row["TikTok"]).toBe("https://tiktok.com/@jess");
    expect(row["LinkedIn"]).toBe("https://linkedin.com/in/jess");
    expect(row["Sun"]).toBe("Leo");
    expect(row["Rising"]).toBe("Aquarius (approx.)");
    expect(row["Born"]).toBe("4 Aug 1961, 19:24 (approximate), Honolulu, Hawaii, United States");
    expect(row["The two women who only talk to each other"]).toBe("Second");
    expect(row["Leading a room (1-5)"]).toBe(4);
    expect(String(row["Dashboard"])).toMatch(/\/admin\/irl-hosts\?id=abc-123$/);
  });

  it("never lets an answer run as a formula", () => {
    const row = sheetRow(app);
    expect(row["Why they want to host"]).toBe("'=IMPORTXML(\"https://example.com\", \"//a\")");
    expect(row["Phone"]).toBe("'+44 7700 900123");
    expect(safeCell("@handle")).toBe("'@handle");
    expect(safeCell("-5")).toBe("'-5");
    expect(safeCell("Hello")).toBe("Hello");
  });
});
