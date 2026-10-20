import { NextResponse } from "next/server";
import { skyNow } from "@/lib/transits";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// The five fast movers right now. The same for everyone, so it is public and cached at the edge for
// half an hour (the Moon moves about a quarter of a degree in that time).
export async function GET() {
  try {
    return NextResponse.json(
      { at: new Date().toISOString(), positions: skyNow() },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=1800" } }
    );
  } catch (error) {
    console.error("Sky now error:", error);
    return NextResponse.json({ error: "Failed to read the sky" }, { status: 500 });
  }
}
