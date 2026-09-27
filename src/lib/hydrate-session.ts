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

  // allSettled, not all: these are eight independent pulls, and one failing (a journal or referral
  // query blip) must not reject the whole batch, because the caller only re-reads the member once
  // this settles. Under Promise.all one unrelated failure left her on "setting up your season" with
  // her chart already downloaded. If the chart pull itself failed, clear the flag so the next page
  // in this tab tries again rather than never retrying.
  const [chart] = await Promise.allSettled([
    hydrateMemberDataFromSupabase(),
    hydrateGoalsFromSupabase(),
    hydrateJournalFromSupabase(),
    hydrateChallengeProgressFromSupabase(),
    hydrateSignalsFromSupabase(),
    hydrateDashboardPrefsFromSupabase(),
    hydrateEmailPrefsFromSupabase(),
    claimStoredReferralIfAny(),
  ]);
  if (chart.status === "rejected") {
    try {
      sessionStorage.removeItem(HYDRATED_FLAG);
    } catch {
      // nothing to clear
    }
  }
}
