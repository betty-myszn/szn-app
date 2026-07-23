import type { BirthData } from "@/types/chart";

const STORAGE_KEY = "myszn_birth_data";
const CHART_CACHE_KEY = "myszn_chart_cache";

export function saveBirthData(data: BirthData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Always invalidate the cached chart on save, a location-only edit (same dob/time,
    // different city) wouldn't otherwise trip the cache's dob/time comparison.
    sessionStorage.removeItem(CHART_CACHE_KEY);
  } catch {
    // localStorage full or unavailable
  }
}

export function getSavedBirthData(): BirthData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    if (data.name && data.dateOfBirth && data.birthTime && data.location) {
      return data as BirthData;
    }
    return null;
  } catch {
    return null;
  }
}

// Patches just the name on the saved birth data, used by settings so changing your display
// name doesn't require redoing the whole birth-details form. Chart cache still invalidates
// (saveBirthData always clears it) but recalculating from identical dob/time/location produces
// an identical chart, so this costs a wasted recompute, not a correctness issue.
export function updateSavedName(name: string): void {
  const existing = getSavedBirthData();
  if (!existing) return;
  saveBirthData({ ...existing, name });
}

export function clearSavedBirthData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PLACEMENTS_KEY);
  } catch {
    // ignore
  }
}

const PLACEMENTS_KEY = "myszn_placements";

export interface SavedPlacements {
  sun: string;
  moon: string;
  rising: string;
  venus: string;
  mars: string;
  jupiter: string;
  saturn: string;
  chiron: string;
  northNode: string;
  midheaven: string;
}

export function savePlacements(placements: SavedPlacements): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  } catch {
    // ignore
  }
}

export function getSavedPlacements(): SavedPlacements | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(PLACEMENTS_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SavedPlacements;
  } catch {
    return null;
  }
}

export function placementsFromChart(data: {
  planets?: { name: string; sign: string }[];
  houses?: { sign: string }[];
}): SavedPlacements {
  const find = (name: string) => data.planets?.find((p) => p.name === name)?.sign || "";
  return {
    sun: find("Sun"),
    moon: find("Moon"),
    rising: data.houses?.[0]?.sign || "",
    venus: find("Venus"),
    mars: find("Mars"),
    jupiter: find("Jupiter"),
    saturn: find("Saturn"),
    chiron: find("Chiron"),
    northNode: find("North Node"),
    midheaven: data.houses?.[9]?.sign || "",
  };
}

export function encodeBirthData(data: BirthData): string {
  const params = new URLSearchParams();
  params.set("name", data.name);
  params.set("dob", data.dateOfBirth);
  params.set("time", data.birthTime);
  params.set("approx", data.birthTimeApproximate ? "1" : "0");
  params.set("place", data.location.placeName);
  params.set("city", data.location.city);
  params.set("country", data.location.country);
  params.set("lat", data.location.latitude.toFixed(6));
  params.set("lng", data.location.longitude.toFixed(6));
  params.set("tz", data.location.timezone);
  return params.toString();
}

export function decodeBirthData(
  params: URLSearchParams
): BirthData | null {
  const name = params.get("name");
  const dob = params.get("dob");
  const time = params.get("time");
  const place = params.get("place");
  const lat = params.get("lat");
  const lng = params.get("lng");
  const tz = params.get("tz");
  const city = params.get("city");
  const country = params.get("country");

  if (!name || !dob || !time || !place || !lat || !lng || !tz || !city || !country) {
    return null;
  }

  return {
    name,
    dateOfBirth: dob,
    birthTime: time,
    birthTimeApproximate: params.get("approx") === "1",
    location: {
      placeName: place,
      city,
      country,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      timezone: tz,
    },
  };
}
