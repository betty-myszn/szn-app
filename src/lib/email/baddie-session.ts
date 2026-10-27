import type Stripe from "stripe";
import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail, sendBrevoTemplateEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";
import type { BaddieSession } from "@/lib/baddie-sessions";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// The Baddie Sessions are one-off $333 Payment Links (one per session, see lib/baddie-sessions.ts).
// When one is paid, the Stripe webhook hands the session here, which:
//   1. sends her the "you're booked in, reply with your time zone, times and birth details" transactional
//      (Brevo template, editable in Brevo; replies go to betty@thecosmicco.com),
//   2. emails the team that a session was booked, since the time is arranged by hand for now.
// Both steps are best-effort and never throw, and exactly-once per checkout via the
// transactional_emails (stripe_session_id, kind) unique index, so a Stripe retry can't resend.

const TEMPLATE_ID = Number(process.env.BREVO_TEMPLATE_BADDIE_SESSION_BOOKED?.trim() || 82);
const BUYER_KIND = "baddie_session_booked";
const ADMIN_KIND = "admin_baddie_session_booked";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function alreadySent(admin: SupabaseAdmin, sessionId: string, kind: string): Promise<boolean> {
  const { data } = await admin.from("transactional_emails").select("id").eq("stripe_session_id", sessionId).eq("kind", kind).eq("status", "sent").maybeSingle();
  return !!data;
}

async function logSend(admin: SupabaseAdmin, row: { email: string; kind: string; sessionId: string; ok: boolean; messageId: string | null; error: string | null }) {
  const { error } = await admin.from("transactional_emails").insert({
    email: row.email, kind: row.kind, stripe_session_id: row.sessionId, status: row.ok ? "sent" : "failed",
    provider: "brevo", provider_message_id: row.messageId, error: row.error,
  });
  if (error && error.code !== "23505") console.error("transactional_emails: baddie session log insert failed", error.message);
}

export async function handleBaddieSessionPurchase(admin: SupabaseAdmin, session: Stripe.Checkout.Session, baddie: BaddieSession): Promise<void> {
  const email = session.customer_details?.email?.toLowerCase() ?? "";
  const name = session.customer_details?.name?.trim() ?? "";
  if (!email) {
    console.error("baddie session: paid with no email on the session", { sessionId: session.id });
    return;
  }

  try {
    if (!(await alreadySent(admin, session.id, BUYER_KIND))) {
      const r = await sendBrevoTemplateEmail({
        to: { email, name: name || undefined },
        templateId: TEMPLATE_ID,
        params: { first_name: name.split(/\s+/)[0] ?? "", session_name: baddie.name },
      });
      await logSend(admin, { email, kind: BUYER_KIND, sessionId: session.id, ok: r.ok, messageId: r.ok ? r.messageId : null, error: r.ok ? null : r.error });
      if (!r.ok) console.error("baddie session: buyer email FAILED", { sessionId: session.id, error: r.error });
    }
  } catch (e) {
    console.error("baddie session: buyer email threw", e instanceof Error ? e.message : e);
  }

  try {
    if (!(await alreadySent(admin, session.id, ADMIN_KIND))) {
      const amount = session.amount_total != null ? `$${(session.amount_total / 100).toFixed(2)}` : "";
      const rows = [["Session", baddie.name], ["Name", name], ["Email", email], ["Paid", amount], ["Stripe session", session.id]];
      const htmlContent = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;"><p><strong>New Baddie Session booked 💖</strong> She's been emailed to reply with her time zone, a few times that suit, her birth details and her goals, so watch for her reply and send the Zoom link.</p><table cellpadding="6" style="border-collapse:collapse;">${rows.map(([k, v]) => `<tr><td style="border:1px solid #1a1a1a;font-weight:700;">${k}</td><td style="border:1px solid #1a1a1a;">${esc(v || "(not given)")}</td></tr>`).join("")}</table></div>`;
      let ok = false, lastError = "", messageId: string | null = null;
      for (const to of adminRecipients()) {
        const r = await sendBrevoEmail({ to: { email: to }, subject: `New Baddie Session booked: ${baddie.name} for ${name || email}`, htmlContent });
        if (r.ok) { ok = true; messageId = messageId ?? r.messageId; } else lastError = r.error;
      }
      await logSend(admin, { email: adminRecipients().join(","), kind: ADMIN_KIND, sessionId: session.id, ok, messageId, error: ok ? null : lastError });
    }
  } catch (e) {
    console.error("baddie session: admin alert threw", e instanceof Error ? e.message : e);
  }
}
