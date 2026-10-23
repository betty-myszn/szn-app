import type Stripe from "stripe";
import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail, sendBrevoTemplateEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// The Bad B*tch Report is a one-off $88 Payment Link (no membership). Birth details are collected
// as custom fields on the Stripe checkout page. When it's paid, the Stripe webhook hands the session
// here, which:
//   1. files the buyer on the Brevo "💜 Baddie Report PAID" list with her birth details as attributes,
//   2. sends her the "she's on her way, within 48 hours" transactional (Brevo template, editable in Brevo),
//   3. emails the team the order with the birth details, since reports are made by hand for now.
// Every step is best-effort and never throws, and the two emails are exactly-once per checkout via
// the transactional_emails (stripe_session_id, kind) unique index, so a Stripe retry can't resend.

// Hardcoded like the welcome-email prices so a missing env var can't silently drop an order;
// env still overrides.
const PRICE_ID = process.env.STRIPE_PRICE_BAD_BTCH_REPORT?.trim() || "price_1UTmY8J6s9fRhiJoUy8SWs7w";
const LIST_ID = Number(process.env.BREVO_LIST_BAD_BTCH_REPORT_PAID?.trim() || 30);
const TEMPLATE_ID = Number(process.env.BREVO_TEMPLATE_BAD_BTCH_REPORT_PAID?.trim() || 77);
const BUYER_KIND = "bad_btch_report_paid";
const ADMIN_KIND = "admin_bad_btch_report_order";

export const isBadBtchReportPrice = (priceId: string | null | undefined) => !!priceId && priceId.trim() === PRICE_ID;

interface Birth { date: string; time: string; place: string }

function birthFrom(session: Stripe.Checkout.Session): Birth {
  const field = (key: string) => session.custom_fields?.find((f) => f.key === key)?.text?.value?.trim() ?? "";
  return { date: field("birthdate"), time: field("birthtime"), place: field("birthplace") };
}

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
  if (error && error.code !== "23505") console.error("transactional_emails: bad b*tch report log insert failed", error.message);
}

async function addToPaidList(email: string, name: string, birth: Birth): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return;
  const brevo = (path: string, body: unknown) => fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST", headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" }, body: JSON.stringify(body),
  });
  // Brevo only stores attributes that already exist; 400 = already exists.
  for (const a of ["BIRTH_DATE", "BIRTH_TIME", "BIRTH_PLACE"]) await brevo(`/contacts/attributes/normal/${a}`, { type: "text" }).catch(() => null);
  const res = await brevo("/contacts", {
    email, updateEnabled: true, listIds: [LIST_ID],
    attributes: { FIRSTNAME: name.split(/\s+/)[0] ?? "", BIRTH_DATE: birth.date, BIRTH_TIME: birth.time, BIRTH_PLACE: birth.place },
  });
  if (!res.ok) console.error("bad b*tch report: Brevo contact upsert failed", res.status, (await res.text().catch(() => "")).slice(0, 200));
}

export async function handleBadBtchReportPurchase(admin: SupabaseAdmin, session: Stripe.Checkout.Session): Promise<void> {
  const email = session.customer_details?.email?.toLowerCase() ?? "";
  const name = session.customer_details?.name?.trim() ?? "";
  const birth = birthFrom(session);
  if (!email) {
    console.error("bad b*tch report: paid with no email on the session", { sessionId: session.id });
    return;
  }

  try {
    await addToPaidList(email, name, birth);
  } catch (e) {
    console.error("bad b*tch report: Brevo list add threw", e instanceof Error ? e.message : e);
  }

  try {
    if (!(await alreadySent(admin, session.id, BUYER_KIND))) {
      const r = await sendBrevoTemplateEmail({
        to: { email, name: name || undefined },
        templateId: TEMPLATE_ID,
        params: {
          first_name: name.split(/\s+/)[0] ?? "",
          birth_date: birth.date || "not given",
          birth_time: birth.time || "not given",
          birth_place: birth.place || "not given",
        },
      });
      await logSend(admin, { email, kind: BUYER_KIND, sessionId: session.id, ok: r.ok, messageId: r.ok ? r.messageId : null, error: r.ok ? null : r.error });
      if (!r.ok) console.error("bad b*tch report: buyer email FAILED", { sessionId: session.id, error: r.error });
    }
  } catch (e) {
    console.error("bad b*tch report: buyer email threw", e instanceof Error ? e.message : e);
  }

  try {
    if (!(await alreadySent(admin, session.id, ADMIN_KIND))) {
      const amount = session.amount_total != null ? `$${(session.amount_total / 100).toFixed(2)}` : "";
      const rows = [["Name", name], ["Email", email], ["Date of birth", birth.date], ["Time of birth", birth.time], ["Place of birth", birth.place], ["Paid", amount], ["Stripe session", session.id]];
      const htmlContent = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;"><p><strong>New Bad B*tch Report order 💜</strong> Her report is promised within 48 hours.</p><table cellpadding="6" style="border-collapse:collapse;">${rows.map(([k, v]) => `<tr><td style="border:1px solid #1a1a1a;font-weight:700;">${k}</td><td style="border:1px solid #1a1a1a;">${esc(v || "(not given)")}</td></tr>`).join("")}</table></div>`;
      let ok = false, lastError = "", messageId: string | null = null;
      for (const to of adminRecipients()) {
        const r = await sendBrevoEmail({ to: { email: to }, subject: `New Bad B*tch Report order: ${name || email}`, htmlContent });
        if (r.ok) { ok = true; messageId = messageId ?? r.messageId; } else lastError = r.error;
      }
      await logSend(admin, { email: adminRecipients().join(","), kind: ADMIN_KIND, sessionId: session.id, ok, messageId, error: ok ? null : lastError });
    }
  } catch (e) {
    console.error("bad b*tch report: admin alert threw", e instanceof Error ? e.message : e);
  }
}
