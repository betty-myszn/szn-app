import type Stripe from "stripe";
import type { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/site";
import { paidReportForPrice } from "@/lib/email/bad-btch-report";
import { baddieSessionForPrice, isPackagePrice } from "@/lib/baddie-sessions";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Birth details collected AFTER payment. The reports and Baddie Sessions used to ask for date, time
// and place of birth as three required boxes on the Stripe page; those are coming off, and she gives
// them on /order/details instead (straight after paying, or from the link in her confirmation
// email). See supabase/migrations/2026-11-13-order-birth-details.sql.
//
// Everything here is backwards compatible: a checkout that still carries birth details from Stripe
// is handled exactly as before and never gets a row.

export interface DetailsOffer { name: string; promises48h: boolean }

/** The offers that need her birth chart, by Stripe price. Null for everything else. */
export function offerNeedingDetails(priceId: string | null | undefined): DetailsOffer | null {
  const report = paidReportForPrice(priceId);
  if (report) return { name: report.name, promises48h: true };
  const baddie = baddieSessionForPrice(priceId);
  if (baddie) return { name: baddie.report ? "Baddie Style Report" : `Baddie Session: ${baddie.name}`, promises48h: false };
  if (isPackagePrice(priceId)) return { name: "Baddie Session Package", promises48h: false };
  return null;
}

/** True when Stripe collected her birth details on the payment page (the old flow). */
export function sessionHasBirth(session: Stripe.Checkout.Session): boolean {
  return (session.custom_fields ?? []).some((f) => f.key.startsWith("birth") && !!f.text?.value?.trim());
}

/** Her personal link to the details form. The checkout session id is long, random and hers alone. */
export const detailsUrl = (sessionId: string) => `${SITE_URL}/order/details?session_id=${encodeURIComponent(sessionId)}`;

/** Creates the waiting row for a paid checkout. Safe to call twice: the second call is a no-op. */
export async function ensurePendingOrder(admin: SupabaseAdmin, session: Stripe.Checkout.Session, offer: DetailsOffer): Promise<void> {
  try {
    const { error } = await admin.from("order_birth_details").insert({
      stripe_session_id: session.id,
      email: (session.customer_details?.email ?? session.customer_email ?? "").toLowerCase(),
      name: session.customer_details?.name?.trim() || null,
      offer: offer.name,
      promises_48h: offer.promises48h,
    });
    if (error && error.code !== "23505") console.error("order details: could not create waiting row", error.message);
  } catch (e) {
    console.error("order details: create waiting row threw", e instanceof Error ? e.message : e);
  }
}

// The shell every order-details email shares, matching the confirmation templates: black header,
// white body, black text, pink footer.
export function orderEmailHtml(opts: { eyebrow: string; headline: string; bodyHtml: string; footer: string }): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:2px solid #1a1a1a;">
<tr><td style="background:#1a1a1a;padding:34px 28px;font-family:Poppins,Arial,sans-serif;">
<div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#FF2D87;">${opts.eyebrow}</div>
<div style="font-size:32px;font-weight:800;line-height:1.05;color:#ffffff;margin-top:14px;letter-spacing:-1px;">${opts.headline}</div>
</td></tr>
<tr><td style="padding:30px 28px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
${opts.bodyHtml}
<p style="margin:28px 0 0;">Love,<br><strong>Betty</strong> ✨</p>
</td></tr>
<tr><td style="background:#FF2D87;padding:18px 28px;font-family:Arial,sans-serif;font-size:12px;color:#1a1a1a;">${opts.footer}</td></tr>
</table></td></tr></table></body></html>`;
}

export const detailsButtonHtml = (url: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;"><tr><td style="background:#1a1a1a;"><a href="${url}" style="display:inline-block;padding:16px 26px;font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">send my birth details</a></td></tr></table>`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The two automatic nudges for a paid order still missing birth details: n = 1 (24h) or 2 (72h). */
export function reminderEmail(n: 1 | 2, row: { name: string | null; offer: string; promises_48h: boolean; stripe_session_id: string }): { subject: string; html: string } {
  const first = esc((row.name ?? "").trim().split(/\s+/)[0] ?? "");
  const offer = esc(row.offer);
  const hi = `<p style="margin:0 0 16px;font-weight:700;">Hiii ${first ? `${first}, ` : ""}my love 💜</p>`;
  const button = detailsButtonHtml(detailsUrl(row.stripe_session_id));
  const footer = `my szn · You&apos;re getting this because you bought ${offer} at itsmyszn.com.`;
  if (n === 1) {
    return {
      subject: `Your ${row.offer} is waiting on one thing from you 💜`,
      html: orderEmailHtml({
        eyebrow: "💜 one thing left", headline: `I&apos;m ready to start <span style="color:#FF2D87;">yours.</span>`, footer,
        bodyHtml: `${hi}
<p style="margin:0 0 16px;">Your <strong>${offer}</strong> is paid for and I am SO ready to get going, but I can&apos;t start without your <strong>date, time and place of birth</strong>, because all of it is built from your chart. It takes about a minute:</p>
${button}
<p style="margin:0 0 16px;">If you don&apos;t know your birth time, there&apos;s a box to tick for that.${row.promises_48h ? " Your 48 hours start the moment your details land." : ""}</p>`,
      }),
    };
  }
  return {
    subject: `Still need your birth details for your ${row.offer} 💜`,
    html: orderEmailHtml({
      eyebrow: "💜 still waiting on you", headline: `she&apos;s got your <span style="color:#FF2D87;">name on her.</span>`, footer,
      bodyHtml: `${hi}
<p style="margin:0 0 16px;">Your <strong>${offer}</strong> is still sitting here with your name on it, and the only thing between you and it is your birth details. One minute, three boxes:</p>
${button}
<p style="margin:0 0 16px;">If the link gives you any trouble, hit reply with your date, time and place of birth and I&apos;ll pop them in for you.</p>`,
    }),
  };
}
