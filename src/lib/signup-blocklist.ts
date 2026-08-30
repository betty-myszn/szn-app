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
