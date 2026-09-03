import { NextResponse } from "next/server";
import Stripe from "stripe";
import { refreshBrevoBillingLink } from "@/lib/email/brevo-contact";
import { billingPortalLink } from "@/lib/billing-portal-link";

export const runtime = "nodejs";
export const maxDuration = 300;

// Owner-only backfill of the emailed one-click billing link (BILLING_LINK) onto existing Brevo
// contacts. From here on the Stripe webhook sets it at checkout and re-mints it on every paid
// invoice, so this is for the people who signed up BEFORE that shipped, which on the day it ships
// is everybody currently mid-trial and about to be sent the trial-ending email.
//
// Customers come from Stripe rather than from profiles: Stripe is the truth about who has a card on
// file, and it still covers anyone whose Supabase account was never activated. Runs against live
// prod env, so the link is signed with the same key /manage-billing verifies with.
//
// Safety:
//  - Shared-secret header (ADMIN_TASK_SECRET), same guard as the other admin routes.
//  - Dry run by default. Nothing is written to Brevo unless "apply": true.
//  - Only ever writes the one attribute; it cannot create a contact, change a list or touch
//    membership state.
//
// Example (check first, then apply):
//   curl -X POST https://itsmyszn.com/api/admin/backfill-billing-links \
//     -H "x-admin-secret: $ADMIN_TASK_SECRET" -H "Content-Type: application/json" \
//     -d '{"status":"trialing"}'
//   curl -X POST https://itsmyszn.com/api/admin/backfill-billing-links \
//     -H "x-admin-secret: $ADMIN_TASK_SECRET" -H "Content-Type: application/json" \
//     -d '{"status":"trialing","apply":true}'
const ALLOWED_STATUSES = new Set(["trialing", "active", "past_due", "all"]);
const MAX_CUSTOMERS = 2000;

export async function POST(request: Request) {
  const secret = process.env.ADMIN_TASK_SECRET;
  if (!secret || request.headers.get("x-admin-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { status?: string; apply?: boolean };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const status = (body.status ?? "trialing").trim();
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "bad_status", allowed: [...ALLOWED_STATUSES] }, { status: 400 });
  }
  const apply = body.apply === true;

  if (!billingPortalLink("cus_probe")) {
    // No signing key: every link this would write would be null. Fail loudly here rather than
    // reporting a successful backfill that wrote nothing.
    return NextResponse.json({ error: "no_signing_key" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const seen = new Set<string>();
  const results = { scanned: 0, updated: 0, skipped_no_email: 0, not_in_brevo: 0, failed: 0 };
  const failures: string[] = [];

  try {
    const params: Stripe.SubscriptionListParams = {
      status: status as Stripe.SubscriptionListParams.Status,
      limit: 100,
      expand: ["data.customer"],
    };
    for await (const subscription of stripe.subscriptions.list(params)) {
      if (results.scanned >= MAX_CUSTOMERS) break;
      const customer = subscription.customer;
      if (typeof customer === "string" || customer.deleted) continue;
      // One subscription per person is the norm, but a re-subscribe leaves two rows on the same
      // customer and there is no point writing the same attribute twice.
      if (seen.has(customer.id)) continue;
      seen.add(customer.id);
      results.scanned += 1;

      if (!customer.email) {
        results.skipped_no_email += 1;
        continue;
      }
      if (!apply) continue;

      const result = await refreshBrevoBillingLink(customer.email, customer.id);
      if (result.ok) {
        results.updated += 1;
      } else if (result.error === "contact_not_found") {
        results.not_in_brevo += 1;
      } else {
        results.failed += 1;
        if (failures.length < 20) failures.push(`${customer.email}: ${result.error}`);
      }
    }
  } catch (e) {
    return NextResponse.json(
      { error: "stripe_walk_failed", detail: e instanceof Error ? e.message : String(e), results },
      { status: 502 }
    );
  }

  console.log("backfill-billing-links", { status, apply, ...results });
  return NextResponse.json({ ok: true, status, apply, ...results, failures });
}
