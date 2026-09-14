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
    about_you: "About", why_host: "Why", astrology_relationship: "Astro", astrology_level: "basics",
    community_means: "Community", people_skills: "People", customer_service: "Ten years in salons",
    speaking_comfort: 4, hosting_experience: "casually", hosting_examples: "Monthly book club",
    relevant_experience: null, scenario_answer: "Scenario", local_ideas: "Ideas",
    availability: "Thursday evenings and most Sundays", frequency_ok: "yes", evenings_ok: "mostly",
    travel_ok: "yes", side_role_ok: "yes", partnerships_interest: "potentially", girls_night: "Night",
  };

  it("puts the chart and every answer in the email, escaped", () => {
    const { subject, htmlContent } = buildIrlApplicationAlert({ ...app, id: "abc-123" });
    expect(subject).toContain("London");
    expect(subject).toContain("Leo sun");
    expect(htmlContent).toContain("Aquarius");
    expect(htmlContent).toContain(app.chart_summary!.hd_type!);
    expect(htmlContent).toContain("People");
    expect(htmlContent).toContain("Mostly");
    expect(htmlContent).toContain("Ten years in salons");
    expect(htmlContent).toContain("Monthly book club");
    expect(htmlContent).toContain("Thursday evenings and most Sundays");
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
    about_you: "=IMPORTXML(\"https://example.com\", \"//a\")", why_host: "Why", astrology_relationship: "Astro",
    astrology_level: "basics", community_means: "Community", people_skills: "People",
    customer_service: "Salons", speaking_comfort: 4, hosting_experience: "never_but_keen",
    hosting_examples: null, relevant_experience: null, scenario_answer: "Scenario", local_ideas: "Ideas",
    availability: "Weekends", frequency_ok: "yes", evenings_ok: "mostly", travel_ok: "yes",
    side_role_ok: "yes", partnerships_interest: "potentially", girls_night: "Night",
  };

  it("turns every answer into a column, with links and the chart", () => {
    const row = sheetRow(app);
    expect(row["Instagram"]).toBe("https://instagram.com/jess");
    expect(row["TikTok"]).toBe("https://tiktok.com/@jess");
    expect(row["LinkedIn"]).toBe("https://linkedin.com/in/jess");
    expect(row["Sun"]).toBe("Leo");
    expect(row["Rising"]).toBe("Aquarius (approx.)");
    expect(row["Born"]).toBe("4 Aug 1961, 19:24 (approximate), Honolulu, Hawaii, United States");
    expect(row["Events they've hosted"]).toBe("");
    expect(row["Speaking to a group (1-5)"]).toBe(4);
    expect(String(row["Dashboard"])).toMatch(/\/admin\/irl-hosts\?id=abc-123$/);
  });

  it("never lets an answer run as a formula", () => {
    const row = sheetRow(app);
    expect(row["About them"]).toBe("'=IMPORTXML(\"https://example.com\", \"//a\")");
    expect(row["Phone"]).toBe("'+44 7700 900123");
    expect(safeCell("@handle")).toBe("'@handle");
    expect(safeCell("-5")).toBe("'-5");
    expect(safeCell("Hello")).toBe("Hello");
  });
});
