import type { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

export type EventLogStatus = "ok" | "partial" | "failed";

// Coarse record of what a webhook event actually did. Phase 1 populates this minimally (the
// existing handlers aren't refactored yet); later phases set each flag as those steps move behind
// the pipeline.
export interface EventActions {
  membership_updated?: boolean;
  brevo_synced?: boolean;
  email_sent?: boolean;
  commitment_incremented?: boolean;
}

// Fail-soft structured audit of a single Stripe webhook event, written to stripe_event_log. This
// NEVER throws and NEVER changes the webhook's result: a logging failure, INCLUDING the table not
// existing yet (before the Phase 1 migration is applied to prod), is caught and printed. That
// decoupling is deliberate, it means this code can ship before or after the migration with no
// ordering risk, and a marketing/audit concern can never fail a real payment.
//
// The row is intentionally NOT foreign-keyed to stripe_webhook_events: that ledger row is rolled
// back on handler failure, and the audit of a failed attempt must survive that rollback.
export async function logStripeEvent(
  admin: SupabaseAdmin,
  event: Stripe.Event,
  outcome: { status: EventLogStatus; error?: string | null; actions?: EventActions; profileId?: string | null }
): Promise<void> {
  try {
    const obj = event.data.object as { customer?: unknown };
    const customerId = typeof obj?.customer === "string" ? obj.customer : null;

    const { error } = await admin.from("stripe_event_log").insert({
      event_id: event.id,
      type: event.type,
      stripe_customer_id: customerId,
      profile_id: outcome.profileId ?? null,
      actions: outcome.actions ?? {},
      status: outcome.status,
      error: outcome.error ?? null,
    });
    if (error) {
      console.error("stripe_event_log insert failed (webhook unaffected)", error.message);
    }
  } catch (e) {
    console.error("stripe_event_log threw (webhook unaffected)", e instanceof Error ? e.message : e);
  }
}
