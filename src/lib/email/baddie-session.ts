import type Stripe from "stripe";
import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail, sendBrevoTemplateEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";
import type { BaddieSession } from "@/lib/baddie-sessions";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// The Baddie Sessions are one-off $333 Payment Links (one per session, birth details as custom fields)
// plus one $555 for-two link (a dropdown picks the session, a text field names her person); see
// lib/baddie-sessions.ts. When one is paid, the Stripe webhook hands the session here, which:
//   1. sends the "you're booked in, reply with your time zone and times" transactional (Brevo template
//      83 solo, 84 for two, 85 for the 3-session package, editable in Brevo; replies go to betty@thecosmicco.com),
//   2. emails the team that a session was booked, since the time is arranged by hand for now.
// Both steps are best-effort and never throw, and exactly-once per checkout via the
// transactional_emails (stripe_session_id, kind) unique index, so a Stripe retry can't resend.

const TEMPLATE_ID = Number(process.env.BREVO_TEMPLATE_BADDIE_SESSION_BOOKED?.trim() || 83);
const FOR_TWO_TEMPLATE_ID = Number(process.env.BREVO_TEMPLATE_BADDIE_SESSION_FOR_TWO_BOOKED?.trim() || 84);
const PACKAGE_TEMPLATE_ID = Number(process.env.BREVO_TEMPLATE_BADDIE_SESSION_PACKAGE_BOOKED?.trim() || 85);
const BUYER_KIND = "baddie_session_booked";
const ADMIN_KIND = "admin_baddie_session_booked";
const ADMIN_GIFT_KIND = "admin_baddie_session_gifted";

const field = (session: Stripe.Checkout.Session, key: string) => {
  const f = session.custom_fields?.find((c) => c.key === key);
  return (f?.text?.value ?? f?.dropdown?.value ?? "").trim();
};

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

// A gifted session: Betty emails the recipient herself, so this only alerts the team with who it's for.
export async function handleBaddieGiftPurchase(admin: SupabaseAdmin, session: Stripe.Checkout.Session): Promise<void> {
  try {
    if (await alreadySent(admin, session.id, ADMIN_GIFT_KIND)) return;
    const buyer = session.customer_details?.name?.trim() ?? "";
    const buyerEmail = session.customer_details?.email?.toLowerCase() ?? "";
    const giftName = field(session, "giftname");
    const amount = session.amount_total != null ? `$${(session.amount_total / 100).toFixed(2)}` : "";
    const rows = [["For", giftName], ["Her email", field(session, "giftemail")], ["Note / when to tell her", field(session, "giftnote")], ["Gifted by", buyer], ["Buyer email", buyerEmail], ["Paid", amount], ["Stripe session", session.id]];
    const htmlContent = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;"><p><strong>Someone's gifted a Baddie Session 🎁</strong> Email her to tell her (check the note for timing), then grab her birth details, time zone and goals and book her in.</p><table cellpadding="6" style="border-collapse:collapse;">${rows.map(([k, v]) => `<tr><td style="border:1px solid #1a1a1a;font-weight:700;">${k}</td><td style="border:1px solid #1a1a1a;">${esc(v || "(not given)")}</td></tr>`).join("")}</table></div>`;
    let ok = false, lastError = "", messageId: string | null = null;
    for (const to of adminRecipients()) {
      const r = await sendBrevoEmail({ to: { email: to }, subject: `Baddie Session gifted: for ${giftName || "(no name)"} from ${buyer || buyerEmail}`, htmlContent });
      if (r.ok) { ok = true; messageId = messageId ?? r.messageId; } else lastError = r.error;
    }
    await logSend(admin, { email: adminRecipients().join(","), kind: ADMIN_GIFT_KIND, sessionId: session.id, ok, messageId, error: ok ? null : lastError });
  } catch (e) {
    console.error("baddie session: gift alert threw", e instanceof Error ? e.message : e);
  }
}

/** baddie is the session she picked (from the price, or the for-two dropdown); null if the dropdown was unreadable or it's the package. */
export async function handleBaddieSessionPurchase(admin: SupabaseAdmin, session: Stripe.Checkout.Session, baddie: BaddieSession | null, forTwo: boolean, isPackage = false): Promise<void> {
  const email = session.customer_details?.email?.toLowerCase() ?? "";
  const name = session.customer_details?.name?.trim() ?? "";
  const sessionName = isPackage ? "3-session package" : baddie?.name ?? "";
  const partner = field(session, "partnername");
  const birth = { date: field(session, "birthdate"), time: field(session, "birthtime"), place: field(session, "birthplace") };
  if (!email) {
    console.error("baddie session: paid with no email on the session", { sessionId: session.id });
    return;
  }

  try {
    if (!(await alreadySent(admin, session.id, BUYER_KIND))) {
      const r = await sendBrevoTemplateEmail({
        to: { email, name: name || undefined },
        templateId: isPackage ? PACKAGE_TEMPLATE_ID : forTwo ? FOR_TWO_TEMPLATE_ID : TEMPLATE_ID,
        params: forTwo
          ? { first_name: name.split(/\s+/)[0] ?? "", session_name: sessionName, partner_name: partner }
          : {
              first_name: name.split(/\s+/)[0] ?? "", session_name: sessionName,
              birth_date: birth.date || "not given", birth_time: birth.time || "not given", birth_place: birth.place || "not given",
            },
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
      const rows = forTwo
        ? [["Session", `${sessionName || "(not picked)"} for two`], ["Name", name], ["Bringing", partner], ["Email", email], ["Paid", amount], ["Stripe session", session.id]]
        : [["Session", sessionName], ["Name", name], ["Email", email], ["Date of birth", birth.date], ["Time of birth", birth.time], ["Place of birth", birth.place], ["Paid", amount], ["Stripe session", session.id]];
      const asked = forTwo ? "both of their birth details, their time zones, a few times that suit and their goals" : isPackage ? "her time zone, a few times that suit, which session she wants first and her goals" : "her time zone, a few times that suit and her goals";
      const htmlContent = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;"><p><strong>New Baddie Session${forTwo ? " for two" : ""} booked 💖</strong> She's been emailed to reply with ${asked}, so watch for her reply and send the Zoom link.</p><table cellpadding="6" style="border-collapse:collapse;">${rows.map(([k, v]) => `<tr><td style="border:1px solid #1a1a1a;font-weight:700;">${k}</td><td style="border:1px solid #1a1a1a;">${esc(v || "(not given)")}</td></tr>`).join("")}</table></div>`;
      let ok = false, lastError = "", messageId: string | null = null;
      for (const to of adminRecipients()) {
        const r = await sendBrevoEmail({ to: { email: to }, subject: `New Baddie Session${forTwo ? " for two" : ""} booked: ${sessionName || "session not picked"} for ${name || email}`, htmlContent });
        if (r.ok) { ok = true; messageId = messageId ?? r.messageId; } else lastError = r.error;
      }
      await logSend(admin, { email: adminRecipients().join(","), kind: ADMIN_KIND, sessionId: session.id, ok, messageId, error: ok ? null : lastError });
    }
  } catch (e) {
    console.error("baddie session: admin alert threw", e instanceof Error ? e.message : e);
  }
}
