import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasAccessFromRow } from "@/lib/membership-gate";
import { replayFor } from "@/lib/workshop-replays";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hands a replay's video id to members only, decided on the server from her own profile row with
// the same hasAccessFromRow the proxy uses. Active trial or paid gets it; free, expired, blocked or
// logged out does not, whatever the browser claims.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const noStore = { "Cache-Control": "private, no-store" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 401, headers: noStore });

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at, blocked, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!hasAccessFromRow(profile)) return new NextResponse(null, { status: 403, headers: noStore });

  const youtubeId = replayFor(id);
  if (!youtubeId) return new NextResponse(null, { status: 404, headers: noStore });
  return NextResponse.json({ youtubeId }, { headers: noStore });
}
