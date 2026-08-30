import { createClient } from "@/lib/supabase/client";
import { clearSavedBirthData, getSavedBirthData, getSavedPlacements, type SavedPlacements } from "@/lib/url-params";
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
  /** Set by an admin: this account is blocked from the platform. Fails every client gate. */
  blocked: boolean;
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

// supabase-js reports "no session" as an AuthSessionMissingError rather than a bare null user, so
// a logged-out visitor and a broken auth service arrive here looking similar. Matched on the error
// name with a message fallback, since only the name is part of the public API.
function isMissingSessionError(error: { name?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.name === "AuthSessionMissingError" || /session missing|session_not_found/i.test(error.message ?? "");
}

export async function getCurrentMember(): Promise<Member | null> {
  const supabase = createClient();
  // supabase-js does NOT throw on a network/service failure here: it resolves with user null and an
  // error set. Ignoring that error made a transient blip indistinguishable from "logged out", so a
  // live trial or paying member got "members only, babe, log in" and reasonably concluded her
  // account was gone. Re-throw instead, so useMember can tell her it's our side and offer a retry.
  // A clean "no session" (no error, no user) still returns null, which is a real logged-out member.
  const { data: authData, error: authError } = await supabase.auth.getUser();
  // "Auth session missing" is NOT a failure: it's what supabase-js returns for a plain logged-out
  // visitor, so it must stay a null member (the "members only, log in" state). Only a real fault
  // (network, 5xx, service down) is re-thrown, otherwise every logged-out visitor would be shown
  // the "something went wrong, try again" screen instead of a login prompt.
  if (authError && !isMissingSessionError(authError)) {
    throw new Error(`auth lookup failed: ${authError.message}`);
  }
  const user = authData?.user;
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "name, is_admin, created_at, onboarded, membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at, blocked, password_set"
    )
    .eq("id", user.id)
    // maybeSingle, not single: a genuinely missing profile row must stay a null profile (exactly
    // what the old ignored-error path produced, and what proxy.ts uses), not a thrown error that
    // would trap her on a retry screen forever. Only a real query failure reaches the throw below.
    .maybeSingle();
  // Same reasoning one level down: a failed profile read left membership_level undefined, which
  // reads as "none" and shows an active member the "your portal's waiting, see membership options"
  // upsell, telling someone who is already paying to pay again. Treat it as a failure, not a
  // downgrade.
  if (profileError) throw new Error(`profile lookup failed: ${profileError.message}`);

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
    blocked: !!profile?.blocked,
    onboarded: !!profile?.onboarded,
    passwordSet: !!profile?.password_set,
  };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  // Drop the cached chart on the way out. It's keyed to the browser, not the account, so leaving it
  // behind meant the next person to log in on a shared laptop inherited the previous member's
  // placements: hydration only overwrites them when SHE has a chart of her own, so someone without
  // one would have been shown a stranger's sun, moon and rising as her own reading.
  clearSavedBirthData();
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("myszn_hydrated_session");
    } catch {
      // sessionStorage unavailable, the next login just re-hydrates anyway
    }
    window.dispatchEvent(new Event("myszn-auth-change"));
  }
}

export function isAdminMember(member: Member | null): boolean {
  return !!member && member.isAdmin;
}

export interface MemberBreakdown {
  /** every profiles row: paying, trialing, free and lapsed together */
  total: number;
  /** monthly + vip, the people actually paying right now */
  paying: number;
  /** trials still inside their week */
  trialing: number;
  /** free accounts: the chat-rooms tier, plus anyone whose trial has run out */
  free: number;
}

// What the "total members" number was hiding: it counts every profiles row, so a free chat-rooms
// account and an expired trial both read as "member". Admin only, same RLS reasoning as the counts
// above, and head+count queries so only the totals cross the wire.
export async function getMemberBreakdown(): Promise<MemberBreakdown> {
  const supabase = createClient();
  const nowIso = new Date().toISOString();
  const [total, paying, trialing] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).in("membership_level", ["monthly", "vip"]),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("membership_level", "trial").gt("trial_expires_at", nowIso),
  ]);
  const totalCount = total.count || 0;
  const payingCount = paying.count || 0;
  const trialingCount = trialing.count || 0;
  return {
    total: totalCount,
    paying: payingCount,
    trialing: trialingCount,
    free: Math.max(0, totalCount - payingCount - trialingCount),
  };
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

export interface MemberRow {
  id: string;
  name: string;
  email: string;
  membershipLevel: MembershipLevel;
  joinedAt: string;
  /** ISO expiry for a trial account, null otherwise. Lets the directory show who's mid-trial. */
  trialExpiresAt: string | null;
  onboarded: boolean;
}

// The real member directory behind the "total members" number, admin only. Same RLS reasoning as
// getMemberCount: profiles_admin_read lets an admin session read every row, a member session only
// ever sees her own, and this is rendered behind the admin gate. Newest first, because the question
// this answers is almost always "who just joined?".
export async function listMembers(limit = 500): Promise<MemberRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, name, email, membership_level, created_at, trial_expires_at, onboarded")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    // Someone who signed up but never finished onboarding has no name yet, so the email carries
    // the row instead of an empty cell.
    name: ((row.name as string | null) ?? "").trim(),
    email: (row.email as string) ?? "",
    membershipLevel: ((row.membership_level as MembershipLevel) ?? "none"),
    joinedAt: (row.created_at as string) ?? "",
    trialExpiresAt: (row.trial_expires_at as string | null) ?? null,
    onboarded: !!row.onboarded,
  }));
}
