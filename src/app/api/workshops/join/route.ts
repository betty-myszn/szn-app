import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasAccessFromRow } from "@/lib/membership-gate";
import { zoomFor } from "@/lib/workshop-zoom";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hands out a workshop's Zoom details to members only. Membership is decided HERE, on the server,
// from her own profile row read under her own session, with the same hasAccessFromRow the proxy
// uses to gate the platform. So an active trial or paid member gets the link; an expired trial, a
// free account, a blocked account or a logged-out visitor does not, whatever the browser claims.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const noStore = { "Cache-Control": "private, no-store" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 401, headers: noStore });

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at, blocked")
    .eq("id", user.id)
    .maybeSingle();
  if (!hasAccessFromRow(profile)) return new NextResponse(null, { status: 403, headers: noStore });

  const details = zoomFor(id);
  if (!details) return new NextResponse(null, { status: 404, headers: noStore });

  // private, no-store: a cache between her and us must never keep one member's response and serve
  // it to the next person who asks.
  return NextResponse.json(details, { headers: noStore });
}
