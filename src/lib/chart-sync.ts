import { createClient } from "@/lib/supabase/client";
import { saveBirthData, getSavedBirthData, savePlacements, type SavedPlacements } from "@/lib/url-params";
import type { BirthData, ChartData } from "@/types/chart";

const SESSION_CHART_KEY = "myszn_chart_cache";

// Postgres `time` columns come back with seconds ("16:30:00"), but everything downstream expects
// bare HH:mm: <input type="time"> and /api/calculate's ^\d{2}:\d{2}$ check both do. Feeding the
// raw value straight through made "save & recalculate" fail with "Invalid time format. Use HH:mm"
// on an edit where the member had changed nothing, because the saved time itself was the thing
// being rejected. Trims to HH:mm and leaves an already-clean value untouched.
export function normalizeBirthTime(raw: string): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(raw.trim());
  if (!match) return raw;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

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
    birthTime: normalizeBirthTime(row.birth_time),
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

// Returns whether the birth data is now definitely persisted for this member. Callers that need
// confirmed persistence (onboarding) await and check this before navigating; callers that don't
// (results, settings) can ignore it and it behaves like the old fire-and-forget. No logged-in
// user is a no-op that reports false (nothing was saved), never an error. The upsert is keyed on
// user_id (the table's primary key), so retrying only ever updates the one row, never duplicates.
export async function syncBirthDataToSupabase(data: BirthData): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("birth_data").upsert({
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
  if (error) {
    console.error("birth_data upsert failed", error);
    return false;
  }
  // profiles.name starts empty (the signup trigger only ever sets email), birth data is the
  // first place a real display name shows up, so keep it in sync here too. Non-critical: a
  // failure here shouldn't fail the whole save, the birth data (what actually matters) is stored.
  // Logged rather than swallowed: a persistent failure here often means the same RLS/permission
  // issue that would also block markOnboarded, so it's worth seeing in the console.
  const { error: nameError } = await supabase.from("profiles").update({ name: data.name }).eq("id", user.id);
  if (nameError) console.error("profiles.name sync failed (non-critical, birth data saved)", nameError);
  return true;
}

// Marks the member onboarded, the actual "portal unlocked" moment. Returns whether the flag is
// now definitely set, so callers can avoid navigating into a gated route that would just bounce
// them back. supabase-js does NOT throw on an RLS-denied or failed update, it returns { error },
// so a silent failure here previously left the flag false while the caller thought it succeeded.
// This updates (the row already exists for anyone past the access gate), reads the flag back
// under the member's own session, and reports the real result instead of swallowing it.
export async function markOnboarded(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
  if (error) {
    console.error("markOnboarded update failed", error);
    return false;
  }
  const { data } = await supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle();
  return data?.onboarded === true;
}

// Returns whether the computed chart is now definitely persisted. Same contract as
// syncBirthDataToSupabase: awaited/checked by onboarding, ignored by fire-and-forget callers,
// no-op-false when logged out, retry-safe via the user_id primary key (no duplicate rows).
export async function syncChartToSupabase(chart: ChartData, placements: SavedPlacements): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("chart_cache").upsert({
    user_id: user.id,
    chart_data: chart,
    placements,
    calculated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("chart_cache upsert failed", error);
    return false;
  }
  return true;
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

// The single source of truth for "what birth data should this visitor's free chart pages use",
// shared by /chart (BirthDataForm) and /human-design (useHumanDesign) so the two never disagree.
//
// Precedence, deliberately Supabase-first for a logged-in member: her stored row is the real
// cross-device record, so hydrate runs first and, when a row exists, refreshes local storage from
// it and that value is returned. Local storage is used only as a fallback, for a logged-out
// visitor or a member who has not saved a row yet. It never overwrites a real DB row with empty
// local values: hydrate only writes to local when a row is actually found.
export async function loadBirthDataPreferringSupabase(): Promise<BirthData | null> {
  await hydrateMemberDataFromSupabase();
  return getSavedBirthData();
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
