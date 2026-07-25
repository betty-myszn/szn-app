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

    // Accepts an optional :ss tail because a birth time round-tripped through Postgres' `time`
    // type comes back as "16:30:00". Rejecting that made editing birth details impossible: the
    // member's own saved, valid time failed validation before she'd changed anything. Seconds are
    // dropped rather than honoured, birth times are only ever minute-precision here.
    const timeMatch = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(birthData.birthTime.trim());
    if (!timeMatch) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:mm" },
        { status: 400 }
      );
    }
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    if (hours > 23 || minutes > 59) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:mm" },
        { status: 400 }
      );
    }
    birthData.birthTime = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;

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
