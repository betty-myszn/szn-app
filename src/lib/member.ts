import { createClient } from "@/lib/supabase/client";
import { getSavedBirthData, getSavedPlacements, type SavedPlacements } from "@/lib/url-params";
import { hasFullAccessFromRow } from "@/lib/membership-gate";

export type MembershipLevel = "none" | "social" | "monthly" | "vip";

export interface Member {
  id: string;
  name: string;
  email: string;
  placements: SavedPlacements;
  memberSince: string;
  isAdmin: boolean;
  /** true when placements come from a real calculated chart rather than the demo profile */
  hasRealChart: boolean;
  /** Set only by the Stripe webhook, never trust a client-side write to this */
  membershipLevel: MembershipLevel;
  /** True for monthly/vip (the full personalised platform); false for the $33 social tier, which
   *  only unlocks the community. Lets the UI show an upgrade prompt without re-deriving the rule. */
  hasFullAccess: boolean;
  subscriptionStatus: string | null;
  subscriptionCurrentPeriodEnd: string | null;
  subscriptionCancelAtPeriodEnd: boolean;
  /** True once she's finished onboarding, gates entry to the real portal */
  onboarded: boolean;
  /** False for legacy magic-link-only accounts, drives the optional "add a password" banner */
  passwordSet: boolean;
}

// Standing in for a real chart until onboarding has saved one, keeps every page that reads
// member.placements working even for a brand new member mid-onboarding.
const DEMO_PLACEMENTS: SavedPlacements = {
  sun: "Leo",
  moon: "Pisces",
  rising: "Aquarius",
  venus: "Scorpio",
  mars: "Leo",
  jupiter: "Gemini",
  saturn: "Capricorn",
  chiron: "Cancer",
  northNode: "Aries",
  midheaven: "Sagittarius",
};

export async function getCurrentMember(): Promise<Member | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "name, is_admin, created_at, onboarded, membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, password_set"
    )
    .eq("id", user.id)
    .single();

  const placements = getSavedPlacements();
  const birthData = getSavedBirthData();

  return {
    id: user.id,
    name: profile?.name || birthData?.name || "babe",
    email: user.email || "",
    memberSince: profile?.created_at || user.created_at || new Date().toISOString(),
    isAdmin: !!profile?.is_admin,
    hasRealChart: !!placements?.sun,
    placements: placements || DEMO_PLACEMENTS,
    membershipLevel: (profile?.membership_level as MembershipLevel) || "none",
    hasFullAccess: hasFullAccessFromRow(profile),
    subscriptionStatus: profile?.subscription_status ?? null,
    subscriptionCurrentPeriodEnd: profile?.subscription_current_period_end ?? null,
    subscriptionCancelAtPeriodEnd: !!profile?.subscription_cancel_at_period_end,
    onboarded: !!profile?.onboarded,
    passwordSet: !!profile?.password_set,
  };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  if (typeof window !== "undefined") window.dispatchEvent(new Event("myszn-auth-change"));
}

export function isAdminMember(member: Member | null): boolean {
  return !!member && member.isAdmin;
}

// Real platform-wide member count, admin only (RLS only grants reading every profile row to
// an admin, everyone else can only see her own).
export async function getMemberCount(): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  return count || 0;
}
