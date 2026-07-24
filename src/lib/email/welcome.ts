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
  return v && /^\d+$/.test(v) ? parseInt(v, 10) : null;
}

// Live-confirmed mapping (amounts verified against Stripe):
//   STRIPE_PRICE_MONTHLY            price_1TwER7…  $111/month    -> Brevo template #31 (env _MONTHLY)
//   STRIPE_PRICE_MONTHLY_3MO_UPFRONT price_1TwEXM… $333 one-time -> Brevo template #32 (env _3MO)
//   STRIPE_PRICE_VIP               price_1TwEZj…  $555/month    -> Brevo template #33 (env _VIP)
function specForPrice(priceId: string | null | undefined): WelcomeSpec | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_MONTHLY)
    return { kind: "welcome_monthly", templateId: numericEnv(process.env.BREVO_TEMPLATE_WELCOME_MONTHLY), planName: "Monthly Membership" };
  if (priceId === process.env.STRIPE_PRICE_MONTHLY_3MO_UPFRONT)
    return { kind: "welcome_3mo", templateId: numericEnv(process.env.BREVO_TEMPLATE_WELCOME_3MO), planName: "3-Month Membership" };
  if (priceId === process.env.STRIPE_PRICE_VIP)
    return { kind: "welcome_vip", templateId: numericEnv(process.env.BREVO_TEMPLATE_WELCOME_VIP), planName: "VIP Membership" };
  return null;
}

// The public origin the activation link must use. Configurable so it can be switched to the custom
// domain the moment that domain actually serves the app's /create-account route, with no code
// change. Falls back through the app url and finally a known-good default, so the CTA is never a
// relative or broken link. (Today itsmyszn.com is a stale deploy that 404s on /create-account, so
// leave NEXT_PUBLIC_SITE_URL on the Railway app domain until that custom domain is repointed.)
function siteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://szn-app-production.up.railway.app";
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
