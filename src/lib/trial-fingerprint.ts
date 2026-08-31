import { createHash } from "crypto";
import type { createAdminClient } from "@/lib/supabase/admin";
import { normaliseEmail } from "@/lib/signup-blocklist";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

/**
 * Repeat-trial prevention on the one detail a repeat trialler cannot change.
 *
 * The existing guard is "this email already has an account", which stops nothing: a new address and
 * a dropped VPN and you have a second free week. That is exactly what happened, and what gave it
 * away was not the email or the IP, it was two accounts submitting byte-identical birth details.
 *
 * Birth data is the one field someone farming trials cannot vary, because varying it destroys the
 * only thing they came for. Change the date or the time and every reading is somebody else's chart.
 *
 * What is stored is a HASH, never the details themselves, so this table cannot be read back into
 * anyone's birth data. It answers one question and no others: has this exact chart already had its
 * free week?
 */

/** Coordinates quantised to roughly 11km (1dp).
 *
 *  The geocoder returns the same numbers for the same city, so exact matching would usually work.
 *  It fails at a rounding boundary: 54.57623 and 54.5771 are 100 metres apart but at 2dp they land
 *  either side of a bucket edge and hash differently, which lets a repeat trial through by picking
 *  a neighbouring suggestion. A coarser grid absorbs that.
 *
 *  The trade is deliberate. Location is not what makes this specific, the exact MINUTE is; location
 *  only stops two strangers born the same minute in different parts of the world colliding, and an
 *  11km grid does that just as well as a 1km one. */
const round = (n: number) => (Math.round(n * 10) / 10).toFixed(1);

/** "19:20:00" and "19:20" are the same minute and must hash the same. */
const toMinutes = (time: string) => time.trim().slice(0, 5);

export function birthFingerprint(input: {
  dateOfBirth: string;
  birthTime: string;
  latitude: number;
  longitude: number;
}): string {
  const parts = [
    input.dateOfBirth.trim().slice(0, 10),
    toMinutes(input.birthTime),
    round(input.latitude),
    round(input.longitude),
  ];
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

// Betty's own addresses. She needs to be able to spin up a fresh trial with her own birth details
// to test the flow, and no repeat-trial guard should stand between her and her own product. Written
// in normalised form (lowercased, no +tag, gmail dots stripped) so alias variants are covered too.
const EXEMPT_EMAILS: ReadonlySet<string> = new Set([
  "sarahbettyandrews@gmail.com",
  "hello@thecosmicco.com",
  "woo@joinwoowoo.com",
]);

/** True when this address is never subject to the repeat-trial check. */
export function isExemptFromTrialGuard(email: string): boolean {
  return EXEMPT_EMAILS.has(normaliseEmail(email));
}

/**
 * True when this exact chart has already been given a free trial.
 *
 * FAILS OPEN. If the table is missing (the migration has not run yet) or the query errors, this
 * returns false and the signup proceeds. A guard that turns a database hiccup into "nobody can
 * start a trial" is worse than the thing it is guarding against, and deploying a check against a
 * table that does not exist yet has already cost us a working site once.
 */
export async function hasUsedTrial(
  admin: SupabaseAdmin,
  fingerprint: string
): Promise<boolean> {
  try {
    const { data, error } = await admin
      .from("trial_fingerprints")
      .select("fingerprint")
      .eq("fingerprint", fingerprint)
      .maybeSingle();
    if (error) {
      console.error("trial-fingerprint: lookup failed, allowing signup", error.message);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error("trial-fingerprint: lookup threw, allowing signup", error);
    return false;
  }
}

/**
 * Claim this chart's free week. Best-effort and never throws: a trial that was already granted must
 * not be undone because the bookkeeping row failed to write. A duplicate key here is not an error,
 * it means a concurrent signup won the race, which the unique constraint is there to settle.
 */
export async function claimTrial(
  admin: SupabaseAdmin,
  fingerprint: string,
  userId: string
): Promise<void> {
  try {
    const { error } = await admin
      .from("trial_fingerprints")
      .insert({ fingerprint, user_id: userId });
    if (error && !/duplicate|unique/i.test(error.message)) {
      console.error("trial-fingerprint: claim failed", error.message);
    }
  } catch (error) {
    console.error("trial-fingerprint: claim threw", error);
  }
}
