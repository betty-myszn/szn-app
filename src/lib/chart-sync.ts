import { createClient } from "@/lib/supabase/client";
import { saveBirthData, savePlacements, type SavedPlacements } from "@/lib/url-params";
import type { BirthData, ChartData } from "@/types/chart";

const SESSION_CHART_KEY = "myszn_chart_cache";

function mapRowToBirthData(row: {
  name: string;
  date_of_birth: string;
  birth_time: string;
  birth_time_approximate: boolean;
  place_name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}): BirthData {
  return {
    name: row.name,
    dateOfBirth: row.date_of_birth,
    birthTime: row.birth_time,
    birthTimeApproximate: row.birth_time_approximate,
    location: {
      placeName: row.place_name,
      city: row.city,
      country: row.country,
      latitude: row.latitude,
      longitude: row.longitude,
      timezone: row.timezone,
    },
  };
}

// Fire-and-forget: called wherever birth data is already saved locally (results, onboarding),
// so it costs nothing when nobody's logged in yet (getUser resolves null and this no-ops).
export async function syncBirthDataToSupabase(data: BirthData): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("birth_data").upsert({
    user_id: user.id,
    name: data.name,
    date_of_birth: data.dateOfBirth,
    birth_time: data.birthTime,
    birth_time_approximate: data.birthTimeApproximate,
    place_name: data.location.placeName,
    city: data.location.city,
    country: data.location.country,
    latitude: data.location.latitude,
    longitude: data.location.longitude,
    timezone: data.location.timezone,
    updated_at: new Date().toISOString(),
  });
  // profiles.name starts empty (the signup trigger only ever sets email), birth data is the
  // first place a real display name shows up, so keep it in sync here too.
  await supabase.from("profiles").update({ name: data.name }).eq("id", user.id);
}

// Called once onboarding's goal step completes, the actual "portal unlocked" moment.
export async function markOnboarded(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
}

export async function syncChartToSupabase(chart: ChartData, placements: SavedPlacements): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("chart_cache").upsert({
    user_id: user.id,
    chart_data: chart,
    placements,
    calculated_at: new Date().toISOString(),
  });
}

// Pulls birth data + the cached chart down from Supabase into this browser's localStorage and
// sessionStorage. Without this, a member logging in on a new device would see the demo
// placeholder chart until she happened to revisit a page that recalculates one from scratch.
export async function hydrateMemberDataFromSupabase(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: birthRow } = await supabase.from("birth_data").select("*").eq("user_id", user.id).maybeSingle();
  if (!birthRow) return false;

  saveBirthData(mapRowToBirthData(birthRow));

  const { data: chartRow } = await supabase.from("chart_cache").select("*").eq("user_id", user.id).maybeSingle();
  if (chartRow) {
    savePlacements(chartRow.placements as SavedPlacements);
    try {
      sessionStorage.setItem(SESSION_CHART_KEY, JSON.stringify(chartRow.chart_data));
    } catch {
      // sessionStorage full or unavailable, useChart will just recalculate instead
    }
  }

  return true;
}

// Checks Supabase for a chart matching this exact birth data before falling back to a fresh
// Swiss Ephemeris calculation, the cross-device equivalent of the sessionStorage check already
// in use-chart.ts.
export async function fetchMatchingChartFromSupabase(birthData: BirthData): Promise<ChartData | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase.from("chart_cache").select("chart_data").eq("user_id", user.id).maybeSingle();
  if (!row) return null;

  const chart = row.chart_data as ChartData;
  const sameLocation =
    chart.birthData?.location?.latitude === birthData.location?.latitude &&
    chart.birthData?.location?.longitude === birthData.location?.longitude &&
    chart.birthData?.location?.timezone === birthData.location?.timezone;
  if (chart.birthData?.dateOfBirth === birthData.dateOfBirth && chart.birthData?.birthTime === birthData.birthTime && sameLocation) {
    return chart;
  }
  return null;
}
