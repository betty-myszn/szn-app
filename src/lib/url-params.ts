import type { BirthData } from "@/types/chart";

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
