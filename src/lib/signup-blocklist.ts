import type { createAdminClient } from "@/lib/supabase/admin";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

/**
 * Normalises an email so alias tricks resolve to one identity: lowercased, any "+tag" dropped, and
 * for gmail/googlemail the dots removed as well, because gmail treats "c.osmic.x@gmail.com" and
 * "cosmicx@gmail.com" as the same inbox. Without this, blocking one address stops nothing: the same
 * person signs straight back up with a dot moved.
 */
export function normaliseEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at === -1) return email;
  let local = email.slice(0, at);
  const domain = email.slice(at + 1);
  local = local.split("+")[0];
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${local.replace(/\./g, "")}@gmail.com`;
  }
  return `${local}@${domain}`;
}

// Blocked in CODE as well as in the database.
//
// The blocked_signups table needs a migration that has not been run yet, and a block that only
// exists in a table nobody has created blocks nothing. These entries work the moment this deploys,
// with no database change, and they keep working afterwards as a belt-and-braces layer.
//
// Emails here must be written in NORMALISED form (lowercased, no +tag, and no dots for gmail), which
// is what normaliseEmail below produces, so alias variants are caught automatically.
const BLOCKED_EMAILS: ReadonlySet<string> = new Set([
  "cosmicxchemist@gmail.com",
  "alinaxrae@gmail.com",
]);

// IPs are a blunt instrument: households, offices and mobile carriers share them, so an IP here can
// catch someone innocent. This one is deliberate and evidenced: both blocked accounts signed up from
// it on the same day, and no other member has ever been seen on it. Review it periodically, because
// addresses get reassigned, and a VPN defeats it in seconds anyway. The email matching above is what
// does the durable work.
const BLOCKED_IPS: ReadonlySet<string> = new Set([
  "138.19.47.80",
]);

/**
 * True when this signup attempt is blocked, by normalised email or by IP.
 *
 * Fails OPEN on a database error: a blocklist lookup that cannot run must never take the signup
 * route down for everyone. The account-level block and the auth ban are the real enforcement; this
 * is the layer that stops a blocked person re-registering.
 */
export async function isSignupBlocked(
  admin: SupabaseAdmin,
  { email, ip }: { email: string; ip?: string | null }
): Promise<boolean> {
  const normalised = normaliseEmail(email);

  // The in-code list first: it needs no database and cannot be defeated by a missing migration.
  if (BLOCKED_EMAILS.has(normalised)) return true;
  if (ip && BLOCKED_IPS.has(ip)) return true;

  try {
    const { data, error } = await admin
      .from("blocked_signups")
      .select("id")
      .or(ip ? `email_normalised.eq.${normalised},ip.eq.${ip}` : `email_normalised.eq.${normalised}`)
      .limit(1);
    if (error) {
      console.error("signup blocklist lookup failed (allowing signup)", error.message);
      return false;
    }
    return !!data && data.length > 0;
  } catch (e) {
    console.error("signup blocklist threw (allowing signup)", e instanceof Error ? e.message : e);
    return false;
  }
}
