import { NextResponse } from "next/server";
import { transitActivations } from "@/lib/human-design";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Today's transit gates for every member at once (the sky is the same for everyone), so it is
// public and cached at the edge for half an hour. The Moon moves a gate roughly every 10 hours,
// which is the fastest thing on here.
export async function GET() {
  try {
    return NextResponse.json(
      { at: new Date().toISOString(), activations: transitActivations() },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=1800" } }
    );
  } catch (error) {
    console.error("Human Design transit error:", error);
    return NextResponse.json({ error: "Failed to calculate today's gates" }, { status: 500 });
  }
}
