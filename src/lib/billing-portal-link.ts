import { createHmac, timingSafeEqual } from "crypto";
import { getConfiguredOrigin } from "@/lib/request-origin";

// A per-customer link that is safe to put in an EMAIL and drops her straight into Stripe's billing
// portal, with none of the "type your email, wait for a code" step the hosted portal login makes
// her do.
//
// What this is NOT: a real Stripe billing-portal session URL. Those are short-lived and Stripe
// explicitly says not to email them, so a link minted the day a trial starts would be dead by the
// time she opens the day-six email. Instead the email carries a signed token naming the customer,
// and /manage-billing mints a FRESH portal session at the moment she clicks it.
//
// The token is stateless (an HMAC over "<customer id>:<expiry>"), so there is no table to migrate
// and no database read on the click path. It is deliberately re-usable rather than single-use,
// because inbox link scanners (Outlook Safe Links and friends) fetch links before the human ever
// does, and a one-shot token would already be burnt by the time she taps it.
//
// Treat the link as a bearer credential: whoever holds it can see her billing and cancel her
// membership, the same way a password-reset link works. That is why it expires, and it is why the
// portal itself only ever shows the last four digits of a card.

// Long enough to cover the whole trial email sequence and the first renewal window from a single
// mint at checkout, short enough that a link sitting in an old inbox stops working. Every
// successful invoice re-mints it (see the Stripe webhook), so an active member always holds a
// fresh one, and an expired token still lands somewhere useful rather than on an error.
const DEFAULT_TTL_DAYS = 45;

// The signing key. BILLING_LINK_SECRET if it is set (which is what makes rotation possible: change
// it and every link already in an inbox stops working). Otherwise derived from the Stripe secret
// key, so this works with no new Railway env var. Derived, never used raw: a separate key for a
// separate job, useless as a Stripe credential if it ever leaked out of a signature.
function signingKey(): Buffer | null {
  const explicit = process.env.BILLING_LINK_SECRET?.trim();
  if (explicit) return Buffer.from(explicit, "utf8");
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey) return null;
  return createHmac("sha256", stripeKey).update("myszn:billing-link:v1").digest();
}

function sign(payload: string, key: Buffer): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/**
 * Mints a signed token naming this Stripe customer. Returns null when there is no signing key
 * available, so callers can fall back to the hosted portal instead of emailing a broken link.
 */
export function signBillingToken(customerId: string, ttlDays: number = DEFAULT_TTL_DAYS): string | null {
  const key = signingKey();
  if (!key || !customerId) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + ttlDays * 86_400;
  const payload = `${customerId}:${expiresAt}`;
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${sign(payload, key)}`;
}

/**
 * Returns the Stripe customer id a token names, or null if the token is malformed, tampered with,
 * signed with a different key, or past its expiry. Nothing here trusts the payload before the
 * signature has been checked.
 */
export function verifyBillingToken(token: string | null | undefined): string | null {
  const key = signingKey();
  if (!key || !token) return null;

  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const payloadPart = token.slice(0, dot);
  const signaturePart = token.slice(dot + 1);

  let payload: string;
  try {
    payload = Buffer.from(payloadPart, "base64url").toString("utf8");
  } catch {
    return null;
  }

  // Constant-time compare, and only when the lengths already match: timingSafeEqual throws on a
  // length mismatch rather than returning false.
  const expected = Buffer.from(sign(payload, key), "utf8");
  const given = Buffer.from(signaturePart, "utf8");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  // Split on the LAST colon: the expiry is always the final field, and this keeps working if a
  // Stripe id ever contains one.
  const split = payload.lastIndexOf(":");
  if (split < 1) return null;
  const customerId = payload.slice(0, split);
  const expiresAt = Number(payload.slice(split + 1));
  if (!customerId || !Number.isFinite(expiresAt)) return null;
  if (expiresAt <= Math.floor(Date.now() / 1000)) return null;

  return customerId;
}

/**
 * The full URL to put in an email or on a Brevo contact. Null when no token could be signed, which
 * is the caller's cue to use STRIPE_PORTAL_URL (Stripe's own hosted login) instead.
 */
export function billingPortalLink(customerId: string | null | undefined, ttlDays?: number): string | null {
  if (!customerId) return null;
  const token = signBillingToken(customerId, ttlDays);
  if (!token) return null;
  return `${getConfiguredOrigin()}/manage-billing?t=${encodeURIComponent(token)}`;
}
