import { createClient } from "@/lib/supabase/client";
import { sanitizePicks } from "@/lib/szn-picks";

// Her picks live on her auth account (user_metadata), not in a profiles column: they follow her to
// every device, need no migration, and she can only ever write her own. The whole payload is a
// short list of ids, so it costs nothing in the session token.
//
//   szn_picks          ordered area ids, [] if she skipped
//   szn_picks_season   the season sign she last picked for, so a new season can ask her again
//   szn_picks_at       when she last saved
//   szn_prompt_dismissed  an existing member said "not now" to the invitation card
//   szn_launch_seen    she has seen the one-time "new feature" popup
//   szn_picks_history  her picks per season, newest last: [{ s: season, p: picks, at }], read by the
//                      admin report to show how picks move from season to season

export interface SznPicksState {
  /** null = she has never chosen. [] = she chose to skip. */
  picks: string[] | null;
  season: string | null;
  dismissed: boolean;
}

function fromMetadata(meta: Record<string, unknown> | undefined): SznPicksState {
  const raw = meta?.szn_picks;
  return {
    picks: Array.isArray(raw) ? sanitizePicks(raw) : null,
    season: typeof meta?.szn_picks_season === "string" ? meta.szn_picks_season : null,
    dismissed: meta?.szn_prompt_dismissed === true,
  };
}

/** Read from the local session: no network round trip, so the dashboard never waits on it. */
export async function loadSznPicks(): Promise<SznPicksState> {
  try {
    const { data } = await createClient().auth.getSession();
    return fromMetadata(data.session?.user?.user_metadata);
  } catch {
    return { picks: null, season: null, dismissed: false };
  }
}

// One entry per season (a later save in the same season replaces it), a year deep. History rides in
// the session token, so it stays small on purpose.
const HISTORY_CAP = 12;

export async function saveSznPicks(picks: string[], seasonSign: string): Promise<SznPicksState | null> {
  try {
    const supabase = createClient();
    const clean = sanitizePicks(picks);
    const at = new Date().toISOString();
    const { data: current } = await supabase.auth.getSession();
    const prior = current.session?.user?.user_metadata?.szn_picks_history;
    const earlier = (Array.isArray(prior) ? prior : []).filter((h: { s?: unknown }) => h?.s !== seasonSign);
    const history = [...earlier, { s: seasonSign, p: clean, at }].slice(-HISTORY_CAP);
    const { data, error } = await supabase.auth.updateUser({
      data: {
        szn_picks: clean,
        szn_picks_season: seasonSign,
        szn_picks_at: at,
        szn_picks_history: history,
      },
    });
    if (error || !data.user) return null;
    return fromMetadata(data.user.user_metadata);
  } catch {
    return null;
  }
}

/** Whether the one-time "new feature" popup has been shown to her, on any device. */
export async function loadLaunchSeen(): Promise<boolean> {
  try {
    const { data } = await createClient().auth.getSession();
    return data.session?.user?.user_metadata?.szn_launch_seen === true;
  } catch {
    return true; // can't tell, so don't risk showing it twice
  }
}

export async function markLaunchSeen(): Promise<void> {
  try {
    await createClient().auth.updateUser({ data: { szn_launch_seen: true } });
  } catch {
    // Worst case she sees it once more on another visit.
  }
}

export async function dismissSznPrompt(): Promise<void> {
  try {
    await createClient().auth.updateUser({ data: { szn_prompt_dismissed: true } });
  } catch {
    // Worst case the invitation shows again next visit, which is fine.
  }
}
