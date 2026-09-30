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

export async function saveSznPicks(picks: string[], seasonSign: string): Promise<SznPicksState | null> {
  try {
    const { data, error } = await createClient().auth.updateUser({
      data: {
        szn_picks: sanitizePicks(picks),
        szn_picks_season: seasonSign,
        szn_picks_at: new Date().toISOString(),
      },
    });
    if (error || !data.user) return null;
    return fromMetadata(data.user.user_metadata);
  } catch {
    return null;
  }
}

export async function dismissSznPrompt(): Promise<void> {
  try {
    await createClient().auth.updateUser({ data: { szn_prompt_dismissed: true } });
  } catch {
    // Worst case the invitation shows again next visit, which is fine.
  }
}
