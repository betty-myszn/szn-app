import { createClient } from "@/lib/supabase/client";
import { getSavedBirthData, getSavedPlacements, type SavedPlacements } from "@/lib/url-params";
import { hasFullAccessFromRow } from "@/lib/membership-gate";

export type MembershipLevel = "none" | "free" | "trial" | "social" | "monthly" | "vip";

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
  /** ISO expiry of the free 7-day trial, null for everyone who isn't a trial member. Access during
   *  the trial is gated purely on this (see isTrial in membership-access.ts). */
  trialExpiresAt: string | null;
  /** True once she's finished onboarding, gates entry to the real portal */
  onboarded: boolean;
  /** False for legacy magic-link-only accounts, drives the optional "add a password" banner */
  passwordSet: boolean;
}

// Standing in for a real chart until onboarding has saved one, keeps every page that reads
// member.placements working even for a brand new member mid-onboarding.
// Drops keys whose value isn't a non-empty string, so a partially-filled stored object can be
// merged over the demo defaults without punching holes in it.
function pruneEmpty(p: SavedPlacements | null): Partial<SavedPlacements> {
  if (!p) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(p)) {
    if (typeof v === "string" && v.trim() !== "") out[k] = v;
  }
  return out as Partial<SavedPlacements>;
}

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
      "name, is_admin, created_at, onboarded, membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at, password_set"
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
    // A stored placements object can be partial: placementsFromChart falls back to "" for anything
    // the ephemeris didn't return, and an older browser may hold a shape written before a field was
    // added. `placements || DEMO_PLACEMENTS` only caught a missing object, so an object with empty
    // or absent signs sailed through and every `.toLowerCase()` on it threw, blanking the page.
    // Filling the gaps from DEMO_PLACEMENTS keeps every key a real string.
    placements: { ...DEMO_PLACEMENTS, ...pruneEmpty(placements) },
    membershipLevel: (profile?.membership_level as MembershipLevel) || "none",
    hasFullAccess: hasFullAccessFromRow(profile),
    subscriptionStatus: profile?.subscription_status ?? null,
    subscriptionCurrentPeriodEnd: profile?.subscription_current_period_end ?? null,
    subscriptionCancelAtPeriodEnd: !!profile?.subscription_cancel_at_period_end,
    trialExpiresAt: profile?.trial_expires_at ?? null,
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

export interface TrialStats {
  /** trials still inside their 7-day window right now */
  active: number;
  /** trials whose window has passed and who have not (yet) become paid members */
  expired: number;
  /** accounts that had a trial (trial_started_at set) and are now on a paid tier: conversions */
  converted: number;
}

// Trial funnel counts for the admin dashboard. Admin only, same RLS reasoning as getMemberCount:
// the profiles_admin_read policy lets an admin session count every row; a non-admin session would
// only ever see her own, and this is only rendered behind the admin gate. Uses head+count queries
// so nothing but the totals crosses the wire.
export async function getTrialStats(): Promise<TrialStats> {
  const supabase = createClient();
  const nowIso = new Date().toISOString();
  const [active, expired, converted] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("membership_level", "trial").gt("trial_expires_at", nowIso),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("membership_level", "trial").lte("trial_expires_at", nowIso),
    supabase.from("profiles").select("id", { count: "exact", head: true }).not("trial_started_at", "is", null).in("membership_level", ["monthly", "vip"]),
  ]);
  return { active: active.count || 0, expired: expired.count || 0, converted: converted.count || 0 };
}
