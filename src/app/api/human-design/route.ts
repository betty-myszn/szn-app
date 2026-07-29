import { NextRequest, NextResponse } from "next/server";
import { calculateHumanDesign } from "@/lib/human-design";
import type { BirthData } from "@/types/chart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Mirrors /api/calculate: Human Design runs on the same Swiss Ephemeris and the
// same stored birth data, so it needs the same Node runtime and the same shape check.
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
      return NextResponse.json(
        { error: "Missing required birth data fields" },
        { status: 400 }
      );
    }

    const chart = calculateHumanDesign(birthData);
    return NextResponse.json(chart);
  } catch (error) {
    console.error("Human Design calculation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to calculate Human Design chart",
      },
      { status: 500 }
    );
  }
}
