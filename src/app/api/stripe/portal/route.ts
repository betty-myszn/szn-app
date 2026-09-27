import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/request-origin";
import { STRIPE_PORTAL_URL } from "@/lib/checkout";

export const runtime = "nodejs";

// The id of the portal configuration whose cancel mode is "immediately", found by its metadata tag
// rather than pinned in an env var, so a fresh deploy can never end up quietly handing trials the
// at-period-end screen because a variable was missed. Cached after the first lookup. Returning
// undefined falls back to the default configuration, which still cancels, just on the old terms.
let trialConfigId: string | null | undefined;

async function trialPortalConfigurationId(stripe: Stripe): Promise<string | undefined> {
  if (trialConfigId !== undefined) return trialConfigId ?? undefined;
  if (process.env.STRIPE_PORTAL_CONFIG_TRIAL) {
    trialConfigId = process.env.STRIPE_PORTAL_CONFIG_TRIAL;
    return trialConfigId;
  }
  try {
    const configs = await stripe.billingPortal.configurations.list({ limit: 20 });
    const match = configs.data.find(
      (c) => c.active && (c.metadata?.myszn === "trial_cancel_immediately" || c.features.subscription_cancel?.mode === "immediately")
    );
    trialConfigId = match?.id ?? null;
  } catch (e) {
    console.error("stripe portal: could not look up the trial cancellation configuration", e instanceof Error ? e.message : e);
    trialConfigId = undefined; // left unset so the next request tries again
    return undefined;
  }
  return trialConfigId ?? undefined;
}

// Opens Stripe's own Billing Portal for whoever is actually logged in, the customer id always
// comes from her own profile row (RLS-protected, read via her own session), never from a query
// param or anything the browser could substitute to reach someone else's billing.
export async function GET(request: NextRequest) {
  // Created per-request rather than at module scope: Next's build-time page-data collection
  // imports this module even without STRIPE_SECRET_KEY set (e.g. a fresh checkout before env
  // vars are filled in), and the Stripe constructor throws immediately on a missing key, which
  // would otherwise fail the whole production build rather than just this route at request time.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const origin = getPublicOrigin(request);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?redirect=/settings`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, subscription_status")
    .eq("id", user.id)
    .single();

  // No customer id on the profile. Sending her to the pricing page tells a member who is being
  // charged that she is not a member, and worse, leaves someone mid-trial with no way to cancel
  // before the first $88. Hand her Stripe's own portal login instead, which finds her by email.
  if (!profile?.stripe_customer_id) {
    console.warn("stripe portal: no customer id on profile, using hosted portal login", { userId: user.id });
    return NextResponse.redirect(STRIPE_PORTAL_URL);
  }

  // A member still inside her free 7 days goes to the portal configuration that cancels there and
  // then, so Stripe's own confirmation screen says what actually happens to her access instead of
  // offering her a date she will not get. Everyone past the trial keeps the default configuration,
  // which cancels at the end of the period she has paid for, because that time is hers.
  const configuration = profile.subscription_status === "trialing" ? await trialPortalConfigurationId(stripe) : undefined;

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/settings`,
    ...(configuration ? { configuration } : {}),
  });

  return NextResponse.redirect(session.url);
}
