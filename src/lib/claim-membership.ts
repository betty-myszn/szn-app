import { createAdminClient } from "@/lib/supabase/admin";
import { hasAccessFromRow, type MembershipRow } from "@/lib/membership-gate";

// Shared by the auth callback (magic-link / email-confirm landing) and the claim-pending route
// (called right after a password login). Claims a membership that was paid for before this
// account existed: the Stripe webhook parks it in pending_memberships keyed by the checkout
// email, and here we merge it onto the just-authenticated profile.
//
// The join key is the VERIFIED email of the authenticated user, Supabase only issues a session
// after that exact address was proven (magic link clicked, email confirmed, or password login of
// a confirmed account), so an email match here is proof of ownership. Returns the member's true
// state so the caller can route her correctly.

const MEMBERSHIP_COLUMNS =
  "membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, onboarded";

export async function linkPendingMembership(userId: string, email: string | null): Promise<MembershipRow | null> {
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
      console.error("claim-membership: failed to merge pending membership onto profile", error.message);
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
