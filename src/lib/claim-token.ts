import { createHash, randomBytes } from "crypto";
import type { createAdminClient } from "@/lib/supabase/admin";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Single-use, short-lived tokens that authorise creating an account for a specific paid email.
// The raw token is handed to the buyer (returned to the create-account page, or embedded in a
// recovery link); only its SHA-256 hash is ever stored, so a database read can't reveal a usable
// token. Consuming is atomic, so a token can be redeemed exactly once, closing replay.

const STRIPE_TOKEN_TTL_MIN = 15;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export type ClaimPurpose = "stripe" | "recovery";

// Mints a token, stores only its hash, returns the raw token to hand to the client.
export async function mintClaimToken(
  admin: SupabaseAdmin,
  params: { email: string; purpose: ClaimPurpose; stripeSessionId?: string | null; ttlMinutes?: number }
): Promise<string> {
  const raw = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + (params.ttlMinutes ?? STRIPE_TOKEN_TTL_MIN) * 60_000).toISOString();
  const { error } = await admin.from("account_claim_tokens").insert({
    token_hash: hashToken(raw),
    email: params.email.toLowerCase(),
    purpose: params.purpose,
    stripe_session_id: params.stripeSessionId ?? null,
    expires_at: expiresAt,
  });
  if (error) throw new Error(`mintClaimToken: ${error.message}`);
  return raw;
}

// Atomically redeems a token: marks it used only if it exists, is unexpired, hasn't been used, and
// matches the expected purpose. A null return means invalid / expired / already used. The
// `used_at is null` predicate in the update is the single-use guarantee, two racing requests can't
// both flip the same row.
export async function consumeClaimToken(
  admin: SupabaseAdmin,
  rawToken: string,
  purpose: ClaimPurpose
): Promise<{ email: string; stripeSessionId: string | null } | null> {
  const tokenHash = hashToken(rawToken);
  const { data, error } = await admin
    .from("account_claim_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .eq("purpose", purpose)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("email, stripe_session_id")
    .maybeSingle();

  if (error) {
    console.error("consumeClaimToken: update failed", error.message);
    return null;
  }
  if (!data) return null;
  return { email: data.email, stripeSessionId: data.stripe_session_id };
}
