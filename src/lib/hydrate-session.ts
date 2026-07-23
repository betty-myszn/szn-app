import { hydrateMemberDataFromSupabase } from "@/lib/chart-sync";
import { hydrateGoalsFromSupabase } from "@/lib/goals-store";
import { hydrateJournalFromSupabase } from "@/lib/journal-store";
import { hydrateChallengeProgressFromSupabase } from "@/lib/challenge-progress";
import { hydrateSignalsFromSupabase } from "@/lib/signals";
import { hydrateDashboardPrefsFromSupabase } from "@/lib/dashboard-preferences";
import { hydrateEmailPrefsFromSupabase } from "@/lib/email-preferences";
import { claimStoredReferralIfAny } from "@/lib/referral";

const HYDRATED_FLAG = "myszn_hydrated_session";

// Pulls every localStorage-backed feature down from Supabase once per tab session, so a member
// logging in on a new browser sees her real chart, goals, journal, challenge progress, activity
// signals and saved preferences straight away instead of the empty state until she happens to
// trigger each one individually.
export async function hydrateSessionOnce(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(HYDRATED_FLAG)) return;
    sessionStorage.setItem(HYDRATED_FLAG, "1");
  } catch {
    // sessionStorage unavailable, just proceed without the once-per-session guard
  }

  await Promise.all([
    hydrateMemberDataFromSupabase(),
    hydrateGoalsFromSupabase(),
    hydrateJournalFromSupabase(),
    hydrateChallengeProgressFromSupabase(),
    hydrateSignalsFromSupabase(),
    hydrateDashboardPrefsFromSupabase(),
    hydrateEmailPrefsFromSupabase(),
    claimStoredReferralIfAny(),
  ]);
}
