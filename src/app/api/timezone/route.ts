import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const timestamp = searchParams.get("timestamp");

  if (!lat || !lng || !timestamp) {
    return NextResponse.json(
      { error: "Missing lat, lng, or timestamp" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_TIMEZONE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google API key not configured", timeZoneId: "UTC" },
      { status: 200 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      return NextResponse.json({
        timeZoneId: data.timeZoneId,
        timeZoneName: data.timeZoneName,
        rawOffset: data.rawOffset,
        dstOffset: data.dstOffset,
      });
    }

    return NextResponse.json(
      { error: data.errorMessage || "Timezone lookup failed", timeZoneId: "UTC" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch timezone", timeZoneId: "UTC" },
      { status: 500 }
    );
  }
}
