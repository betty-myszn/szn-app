import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureTodaysLeapPost } from "@/lib/quantum-leap-posts";
import { hasAccessFromRow } from "@/lib/membership-gate";
import { QL_LIVE_AT, QL_DAYS, type LeapAllPayload, type LeapDayPayload } from "@/lib/quantum-leap";
import { DAYS, WEEKS, getDay, weekFor, JUPITER_SIGN } from "@/lib/quantum-leap-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The only door to the thirty days of the Quantum Leap Experiment. Decided on the server, from her
// own profile row and the server clock: members get it once the Sun enters Sagittarius
// (QL_LIVE_AT), admins get it early to preview, and everyone else gets a plain 404, so before
// Sagittarius SZN the challenge does not exist anywhere a browser can reach.
//   ?day=N  one day   ·   ?all=1  the light list of all thirty for the season page
//   ?ping=1  nothing back, just makes sure Betty's post for today is in the coven chat (the chat
//            room calls this). Every call made once the experiment is live does the same check.
export async function GET(request: NextRequest) {
  const noStore = { "Cache-Control": "private, no-store" };
  const nothing = () => new NextResponse(null, { status: 404, headers: noStore });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return nothing();

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at, blocked, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = !!profile?.is_admin;
  if (!isAdmin && (!hasAccessFromRow(profile) || Date.now() < QL_LIVE_AT)) return nothing();

  // Betty's daily chat post goes out on the first member visit after 8am UK (posted once, by id).
  if (Date.now() >= QL_LIVE_AT) await ensureTodaysLeapPost(createAdminClient());

  const params = request.nextUrl.searchParams;
  if (params.get("ping") === "1") return new NextResponse(null, { status: 204, headers: noStore });
  if (params.get("all") === "1") {
    const body: LeapAllPayload = { weeks: WEEKS, days: DAYS.map(({ n, title, move, emoji }) => ({ n, title, move, emoji })) };
    return NextResponse.json(body, { headers: noStore });
  }

  const n = Number(params.get("day"));
  const day = Number.isInteger(n) && n >= 1 && n <= QL_DAYS ? getDay(n) : null;
  if (!day) return nothing();
  const body: LeapDayPayload = { day, week: weekFor(n), ...(day.personal === "jupiter-natal" ? { jupiterSign: JUPITER_SIGN } : {}) };
  return NextResponse.json(body, { headers: noStore });
}
