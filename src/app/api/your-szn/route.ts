import { NextRequest, NextResponse } from "next/server";
import { calculateChart } from "@/lib/astrology";
import { generateYourSzn } from "@/lib/transits";
import type { BirthData } from "@/types/chart";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const birthData: BirthData = await request.json();

    if (!birthData.name || !birthData.dateOfBirth || !birthData.birthTime || !birthData.location) {
      return NextResponse.json({ error: "Missing required birth data fields" }, { status: 400 });
    }

    // Calculate natal chart first
    const natalChart = calculateChart(birthData);

    // Generate YOUR SZN data with current transits
    const yourSznData = generateYourSzn(natalChart);

    return NextResponse.json(yourSznData);
  } catch (error) {
    console.error("YOUR SZN calculation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Calculation failed" },
      { status: 500 }
    );
  }
}
