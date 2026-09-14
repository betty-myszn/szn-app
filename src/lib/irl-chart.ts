import { calculateChart } from "@/lib/astrology";
import { calculateHumanDesign } from "@/lib/human-design";
import type { BirthData } from "@/types/chart";
import type { ChartSummary } from "@/lib/irl";

// A host applicant's chart, reduced to what you need to compare applicants side by side. Server
// only: it runs the Swiss Ephemeris, which is why it lives apart from irl.ts, which the public form
// imports. The same calculateChart and calculateHumanDesign the rest of the app uses.

export function summariseApplicantChart(a: {
  name: string; birthDate: string; birthTime: string; approximate: boolean;
  place: string; lat: number; lng: number; tz: string;
}): ChartSummary | null {
  const birthData: BirthData = {
    name: a.name,
    dateOfBirth: a.birthDate,
    // A time read back from Postgres carries seconds; the calculators want HH:mm.
    birthTime: a.birthTime.slice(0, 5),
    birthTimeApproximate: a.approximate,
    location: { placeName: a.place, city: a.place, country: "", latitude: a.lat, longitude: a.lng, timezone: a.tz },
  };

  try {
    const chart = calculateChart(birthData);
    const hd = calculateHumanDesign(birthData);
    const sign = (id: string) => chart.planets.find((p) => p.id === id)!.sign;
    return {
      sun: sign("sun"), moon: sign("moon"), mercury: sign("mercury"), venus: sign("venus"), mars: sign("mars"),
      rising: chart.houses[0]?.sign ?? null,
      hd_type: hd.type, hd_strategy: hd.strategy, hd_authority: hd.authorityLabel,
      hd_profile: hd.profile, hd_definition: hd.definition,
      time_approximate: a.approximate,
    };
  } catch (err) {
    // The application matters more than the chart: a failed calculation saves her answers without
    // one rather than rejecting her.
    console.error("irl-chart: calculation failed", err instanceof Error ? err.message : err);
    return null;
  }
}
