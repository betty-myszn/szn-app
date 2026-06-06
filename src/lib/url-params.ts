import type { BirthData } from "@/types/chart";

const STORAGE_KEY = "myszn_birth_data";

export function saveBirthData(data: BirthData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
