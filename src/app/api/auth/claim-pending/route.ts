import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { postAuthDestination } from "@/lib/membership-gate";
import { linkPendingMembership } from "@/lib/claim-membership";

export const runtime = "nodejs";

// Called by the client right after a successful password login. Magic-link / email-confirm logins
// already run this claim inside /auth/callback, but a password login (signInWithPassword) never
// passes through that server callback, so an existing account that had a fresh membership parked
// against its email (e.g. a repeat purchase made while logged out) would otherwise not pick it up.
// Requires a real logged-in session, the merge only ever uses the authenticated user's own
// verified email, so this can't be used to claim someone else's parked membership.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const membership = await linkPendingMembership(user.id, user.email ?? null);
  return NextResponse.json({ destination: postAuthDestination(membership) });
}
