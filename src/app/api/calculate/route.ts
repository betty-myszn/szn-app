import { NextRequest, NextResponse } from "next/server";
import { calculateChart } from "@/lib/astrology";
import type { BirthData } from "@/types/chart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthData.dateOfBirth)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(birthData.birthTime)) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:mm" },
        { status: 400 }
      );
    }

    const chart = calculateChart(birthData);
    return NextResponse.json(chart);
  } catch (error) {
    console.error("Chart calculation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to calculate chart",
      },
      { status: 500 }
    );
  }
}
