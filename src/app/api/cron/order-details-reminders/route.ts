import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { reminderEmail } from "@/lib/order-details";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Chases paid orders that still have no birth details: one nudge 24 hours after payment, a second
// at 72 hours, then it stops (she stays on /admin/order-details for a personal follow-up). Called
// hourly from Supabase pg_cron (see supabase/RUN-order-birth-details.sql).
//
// Idempotency is order_birth_details.reminders_sent: the counter is bumped BEFORE the email goes,
// with the old value in the where-clause, so two overlapping runs can never send the same nudge
// twice. A nudge stops the moment submitted_at is set.
//
// AUTH: shared secret in a header, compared in constant time, same as the other cron routes.

function authorised(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const provided = request.headers.get("x-cron-secret") ?? "";
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

const HOUR = 3_600_000;

export async function POST(request: NextRequest) {
  if (!authorised(request)) return new NextResponse(null, { status: 404 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("order_birth_details")
    .select("id, stripe_session_id, email, name, offer, promises_48h, paid_at, reminders_sent")
    .is("submitted_at", null)
    .lt("reminders_sent", 2)
    .lt("paid_at", new Date(Date.now() - 24 * HOUR).toISOString())
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const row of data ?? []) {
    const age = Date.now() - new Date(row.paid_at).getTime();
    const due: 1 | 2 | null = row.reminders_sent === 0 ? 1 : age >= 72 * HOUR ? 2 : null;
    if (!due || !row.email) continue;

    const { data: claimed } = await admin.from("order_birth_details")
      .update({ reminders_sent: due, last_reminder_at: new Date().toISOString() })
      .eq("id", row.id).eq("reminders_sent", row.reminders_sent).is("submitted_at", null)
      .select("id").maybeSingle();
    if (!claimed) continue;

    const mail = reminderEmail(due, row);
    const r = await sendBrevoEmail({ to: { email: row.email, name: row.name ?? undefined }, subject: mail.subject, htmlContent: mail.html });
    if (r.ok) sent++;
    else console.error("order details reminder FAILED", { id: row.id, due, error: r.error });
  }
  return NextResponse.json({ checked: data?.length ?? 0, sent });
}
