import { NextRequest, NextResponse } from "next/server";
import { buildSeasonDesignReading } from "@/lib/season-design";
import type { BirthData } from "@/types/chart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Combines the member's natal Human Design with the current astrology season.
// Same Node runtime as the other Swiss Ephemeris routes. Optional ?sign= previews
// a specific season (e.g. leo) out of season.
export async function POST(request: NextRequest) {
  try {
    const birthData: BirthData = await request.json();

    if (
      !birthData.name ||
      !birthData.dateOfBirth ||
      !birthData.birthTime ||
      !birthData.location?.latitude ||
      !birthData.location?.longitude ||
      !birthData.location?.timezone
    ) {
      return NextResponse.json({ error: "Missing required birth data fields" }, { status: 400 });
    }

    const sign = request.nextUrl.searchParams.get("sign") ?? undefined;
    const reading = buildSeasonDesignReading(birthData, new Date(), sign);

    if (!reading) {
      return NextResponse.json(
        { error: "This season's Human Design reading is not available yet." },
        { status: 404 }
      );
    }

    return NextResponse.json(reading);
  } catch (error) {
    console.error("Season design calculation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to build season reading" },
      { status: 500 }
    );
  }
}
