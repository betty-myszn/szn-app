import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoTemplateEmail } from "@/lib/email/brevo";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Each paid Stripe PRICE maps to exactly one welcome email. Selection is by price id, not by
// membership tier, because two different prices ($111/mo and $333 upfront) share the same 'monthly'
// tier but get different emails. The branded template for each is designed and hosted in Brevo and
// referenced here by id via env, so copy and design changes never require a code deploy.
export type WelcomeKind = "welcome_monthly" | "welcome_3mo" | "welcome_vip";

interface WelcomeSpec {
  kind: WelcomeKind;
  templateId: number | null;
  /** Human-readable plan name passed to the template as {{ params.plan_name }}. */
  planName: string;
}

function numericEnv(v: string | undefined): number | null {
  const t = v?.trim();
  return t && /^\d+$/.test(t) ? parseInt(t, 10) : null;
}

// Live-confirmed mapping (amounts verified against Stripe):
//   price_1TwER7…  $111/month    -> welcome_monthly -> Brevo template #31
//   price_1TwEXM…  $333 one-time -> welcome_3mo     -> Brevo template #32
//   price_1TwEZj…  $555/month    -> welcome_vip     -> Brevo template #33
//
// Both the price->kind and the kind->template lookups are hardcoded as the backstop, for the same
// reason as the tier map in stripe-tiers.ts: the earlier version matched the incoming price id
// against raw STRIPE_PRICE_* env vars and read template ids straight from BREVO_TEMPLATE_* env
// vars, so a drifted, missing, or whitespace-corrupted variable silently sent no welcome email at
// all. Env still overrides (trimmed) for anything new; it just can't break the known live plans.
const CANONICAL_PRICE_KIND: Record<string, WelcomeKind> = {
  price_1TwER7J6s9fRhiJooQRyfcwQ: "welcome_monthly",
  price_1TwEXMJ6s9fRhiJoRzDMbrQZ: "welcome_3mo",
  price_1TwEZjJ6s9fRhiJoJ0EAROdR: "welcome_vip",
};

const SPEC_BY_KIND: Record<WelcomeKind, { templateEnv: string | undefined; fallbackTemplate: number; planName: string }> = {
  welcome_monthly: { templateEnv: process.env.BREVO_TEMPLATE_WELCOME_MONTHLY, fallbackTemplate: 31, planName: "Monthly Membership" },
  welcome_3mo: { templateEnv: process.env.BREVO_TEMPLATE_WELCOME_3MO, fallbackTemplate: 32, planName: "3-Month Membership" },
  welcome_vip: { templateEnv: process.env.BREVO_TEMPLATE_WELCOME_VIP, fallbackTemplate: 33, planName: "VIP Membership" },
};

function kindForPrice(priceId: string): WelcomeKind | null {
  const id = priceId.trim();
  if (CANONICAL_PRICE_KIND[id]) return CANONICAL_PRICE_KIND[id];
  // Env-registered prices (trimmed) cover any future additions not yet in the canonical map.
  if (id === process.env.STRIPE_PRICE_MONTHLY?.trim()) return "welcome_monthly";
  if (id === process.env.STRIPE_PRICE_MONTHLY_3MO_UPFRONT?.trim()) return "welcome_3mo";
  if (id === process.env.STRIPE_PRICE_VIP?.trim()) return "welcome_vip";
  return null;
}

function specForPrice(priceId: string | null | undefined): WelcomeSpec | null {
  if (!priceId) return null;
  const kind = kindForPrice(priceId);
  if (!kind) return null;
  const s = SPEC_BY_KIND[kind];
  return { kind, templateId: numericEnv(s.templateEnv) ?? s.fallbackTemplate, planName: s.planName };
}

// The human-readable plan name for a price, exported so the Brevo contact sync (brevo-contact.ts)
// files the same PLAN_NAME the welcome email uses for {{ params.plan_name }}. Returns null for an
// unmapped price so the caller can fall back.
export function planNameForPrice(priceId: string | null | undefined): string | null {
  return specForPrice(priceId)?.planName ?? null;
}

// The public origin the activation link ("Create my account" button in the welcome email) points
// at. Prefers a configured canonical origin (NEXT_PUBLIC_SITE_URL, then NEXT_PUBLIC_APP_URL); when
// neither is present at build it falls back to the live public domain, so the CTA is never a
// relative or Railway-internal link. itsmyszn.com now serves this app, so it is the correct
// default here. (NEXT_PUBLIC_* values are inlined at build time, so changing the env needs a fresh
// deploy to take effect.)
function siteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://itsmyszn.com";
  return raw.replace(/\/+$/, "");
}

// The one per-buyer unique value in the email. It carries the Stripe Checkout session id, NOT a
// claim token: /create-account re-verifies the session with Stripe and mints a fresh single-use,
// short-lived claim token server-side on each visit, so this link stays valid and secure over time
// (until the membership is actually claimed) rather than expiring like a token would.
export function activationUrl(sessionId: string): string {
  return `${siteOrigin()}/create-account?session_id=${encodeURIComponent(sessionId)}`;
}

export type WelcomeSendOutcome =
  | { status: "sent"; kind: WelcomeKind; messageId: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; kind?: WelcomeKind; error: string };

// Sends the correct welcome email for a completed checkout, exactly once. Safe to call from the
// Stripe webhook (best-effort, right after the membership is stored) and from the manual resend
// route. Idempotent: a prior successful send for this (session, kind) short-circuits unless force
// is set, so webhook retries and manual resends can't double-send. NEVER throws.
export async function sendWelcomeEmail(
  admin: SupabaseAdmin,
  args: {
    sessionId: string;
    email: string | null | undefined;
    name?: string | null;
    priceId: string | null | undefined;
    force?: boolean;
  }
): Promise<WelcomeSendOutcome> {
  const { sessionId, email, priceId, force } = args;

  if (!email) return { status: "skipped", reason: "no_email_on_session" };
  const spec = specForPrice(priceId);
  if (!spec) return { status: "skipped", reason: `unmapped_price:${priceId ?? "none"}` };
  if (!spec.templateId) {
    // Fail loudly rather than silently: the price is mapped but nobody has set the Brevo template id.
    return { status: "failed", kind: spec.kind, error: `Brevo template id env not set for ${spec.kind}` };
  }

  // Idempotency guard. The partial unique index on (stripe_session_id, kind) where status='sent'
  // is the hard backstop; this check just avoids an unnecessary Brevo call on the common path.
  if (!force) {
    const { data: prior } = await admin
      .from("transactional_emails")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .eq("kind", spec.kind)
      .eq("status", "sent")
      .maybeSingle();
    if (prior) return { status: "skipped", reason: "already_sent" };
  }

  const firstName = (args.name ?? "").trim().split(/\s+/)[0] || "";
  const result = await sendBrevoTemplateEmail({
    to: { email, name: args.name ?? undefined },
    templateId: spec.templateId,
    params: {
      activation_url: activationUrl(sessionId),
      first_name: firstName,
      plan_name: spec.planName,
    },
  });

  // Log every attempt, success or failure. A 23505 here means a concurrent send already recorded
  // the 'sent' row (the unique index doing its job), which is not an error worth surfacing.
  const { error: logError } = await admin.from("transactional_emails").insert({
    email,
    kind: spec.kind,
    stripe_session_id: sessionId,
    status: result.ok ? "sent" : "failed",
    provider: "brevo",
    provider_message_id: result.ok ? result.messageId : null,
    error: result.ok ? null : result.error,
  });
  if (logError && logError.code !== "23505") {
    console.error("transactional_emails: log insert failed", logError.message);
  }

  if (result.ok) {
    console.log("welcome email sent", { kind: spec.kind, email, sessionId, messageId: result.messageId });
    return { status: "sent", kind: spec.kind, messageId: result.messageId };
  }
  // Failure is logged but deliberately NOT thrown: the paid membership must stand regardless.
  console.error("welcome email FAILED (membership unaffected)", { kind: spec.kind, email, sessionId, error: result.error });
  return { status: "failed", kind: spec.kind, error: result.error };
}
