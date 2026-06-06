import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ geonames: [] });
  }

  const username = process.env.GEONAMES_USERNAME || process.env.NEXT_PUBLIC_GEONAMES_USERNAME;
  if (!username) {
    return NextResponse.json(
      { error: "GeoNames username not configured", geonames: [] },
      { status: 200 }
    );
  }

  try {
    const url = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(q)}&maxRows=8&featureClass=P&style=FULL&username=${encodeURIComponent(username)}`;
    const res = await fetch(url);
    const data = await res.json();

    const results = (data.geonames || []).map((g: Record<string, unknown>) => ({
      geonameId: g.geonameId,
      name: g.name,
      countryName: g.countryName,
      adminName1: g.adminName1,
      lat: g.lat,
      lng: g.lng,
      timezone: g.timezone,
    }));

    return NextResponse.json({ geonames: results });
  } catch {
    return NextResponse.json({ geonames: [] }, { status: 500 });
  }
}
