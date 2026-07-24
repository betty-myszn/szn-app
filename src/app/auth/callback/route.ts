import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicOrigin } from "@/lib/request-origin";
import { hasAccessFromRow, postAuthDestination, type MembershipRow } from "@/lib/membership-gate";

// Only ever redirect back into our own app, an open redirect here would let a crafted
// ?next=https://evil.example link send someone off-site right after they authenticate. Returns
// "" (not a default) so the caller can tell "no next given" apart from "go to /dashboard".
function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "";
  return raw;
}

const MEMBERSHIP_COLUMNS =
  "membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, onboarded";

// Claims a membership that was paid for before this account existed. The join key is the verified
// email of the just-authenticated user: Supabase only issues this session after the magic link
// sent to that exact address was clicked, so an email match here is proof of ownership. Returns
// the member's true state so the caller can route her correctly.
async function linkPendingMembership(userId: string, email: string | null): Promise<MembershipRow | null> {
  const admin = createAdminClient();

  const { data: profile } = await admin.from("profiles").select(MEMBERSHIP_COLUMNS).eq("id", userId).single();
  let current = (profile as MembershipRow | null) ?? null;

  if (!email) return current;

  const { data: pending } = await admin
    .from("pending_memberships")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (!pending) return current;

  // Never let a parked row clobber an account that already has live access (e.g. an existing
  // member who also happened to pay while logged out). Only merge when there's nothing to lose.
  if (!hasAccessFromRow(current)) {
    const { error } = await admin
      .from("profiles")
      .update({
        membership_level: pending.membership_level,
        stripe_customer_id: pending.stripe_customer_id,
        stripe_subscription_id: pending.stripe_subscription_id,
        stripe_price_id: pending.stripe_price_id,
        subscription_status: pending.subscription_status,
        subscription_current_period_end: pending.subscription_current_period_end,
        subscription_cancel_at_period_end: pending.subscription_cancel_at_period_end,
        membership_started_at: pending.membership_started_at,
        membership_updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (error) {
      console.error("auth callback: failed to merge pending membership onto profile", error.message);
    } else {
      current = {
        membership_level: pending.membership_level,
        subscription_status: pending.subscription_status,
        subscription_current_period_end: pending.subscription_current_period_end,
        subscription_cancel_at_period_end: pending.subscription_cancel_at_period_end,
        onboarded: current?.onboarded ?? false,
      };
    }
  }

  // The parked row has done its job. Delete it so it can never be claimed twice or overwrite
  // newer state on a later login.
  await admin.from("pending_memberships").delete().eq("email", email.toLowerCase());

  return current;
}

// Where a clicked magic link lands. Exchanges the emailed code for a real session, claims any
// membership paid for before signup, then routes by membership + onboarding state so a member
// can never slip past onboarding or into the portal without access.
export async function GET(request: NextRequest) {
  const origin = getPublicOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (!code) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const membership = await linkPendingMembership(user.id, user.email ?? null);
  const destination = postAuthDestination(membership);

  // A specific member area she was heading to wins only if she's a fully-set-up member (has
  // access and has onboarded). Otherwise membership state decides, so onboarding and the pricing
  // gate can't be skipped with a ?next.
  const isFullMember = hasAccessFromRow(membership) && !!membership?.onboarded;
  const finalPath = next && isFullMember ? next : destination;

  return NextResponse.redirect(`${origin}${finalPath}`);
}
