import { sendBrevoEmail, type BrevoSendResult } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";
import { SITE_URL } from "@/lib/site";
import type { CosmicEvent } from "@/lib/events";

// The "you're booked" email for a paid event, sent by the Stripe webhook. The workshop time is
// only printed once startsAt is set in events.ts; until then it promises the details by email.

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function eventBookingHtml(event: CosmicEvent, firstName: string): { subject: string; html: string } {
  const url = `${SITE_URL}/events/${event.slug}`;
  const greeting = firstName ? `Hiii ${esc(firstName)}, my love` : "Hiii my love";
  const when = event.startsAt
    ? `${new Date(event.startsAt).toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles", timeZoneName: "short" })} (${new Date(event.startsAt).toLocaleString("en-GB", { hour: "numeric", minute: "2-digit", timeZone: "Europe/London", timeZoneName: "short" })} UK)`
    : `${event.dateLabel}. The exact time and your joining link land in this inbox the moment they're locked in.`;
  const body = [
    `You're IN for ${event.title}, ${event.subtitle}${event.edition ? `, ${event.edition}` : ""}, and I am SOOOO excited to make money magic with you.`,
    "Your personalised astrology report is being written from your birth chart right now, and it lands in your inbox before the workshop so you can sit with it, highlight it and come in already knowing what this Full Moon is lighting up for you.",
    `When: ${when}`,
    event.joinUrl ? `Join here: ${event.joinUrl}` : "",
    "Can't make it live? The full replay comes to you after the workshop, so you can do the whole experience in your own time.",
  ].filter(Boolean);
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:2px solid #1a1a1a;">
<tr><td style="background:#FF2D87;padding:32px 28px;font-family:Poppins,Arial,sans-serif;">
<div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ffffff;">${esc(event.title)}</div>
<div style="font-size:34px;font-weight:800;line-height:1.05;color:#1a1a1a;margin-top:14px;letter-spacing:-1px;">you're booked, baddie 🌕💸</div>
</td></tr>
<tr><td style="padding:30px 28px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
<p style="margin:0 0 16px;font-weight:700;">${greeting} 💜</p>
${body.map((p) => `<p style="margin:0 0 16px;">${esc(p)}</p>`).join("\n")}
<p style="margin:24px 0 0;"><a href="${url}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:16px 28px;">see the event</a></p>
<p style="margin:28px 0 0;">Love,<br><strong>Betty</strong> 🪩</p>
</td></tr>
<tr><td style="background:#1a1a1a;padding:18px 28px;font-family:Arial,sans-serif;font-size:12px;color:#ffffff;">my<span style="color:#FF2D87;">szn</span> · You're getting this because you booked an event at itsmyszn.com.</td></tr>
</table></td></tr></table></body></html>`;
  return { subject: `You're booked for ${event.title} 🌕💸`, html };
}

export async function sendEventBookingConfirmation(event: CosmicEvent, email: string, name: string): Promise<BrevoSendResult> {
  const { subject, html } = eventBookingHtml(event, name.split(" ")[0] ?? "");
  return sendBrevoEmail({ to: { email, name: name || undefined }, subject, htmlContent: html });
}

export async function sendEventBookingAdminAlert(event: CosmicEvent, b: { email: string; name: string; birthPlace: string | null; hasBirth: boolean }) {
  const htmlContent = `<p>New booking for <strong>${esc(event.title)}</strong>: ${esc(b.name)} (${esc(b.email)}).</p><p>Birth details ${b.hasBirth ? `saved${b.birthPlace ? ` (${esc(b.birthPlace)})` : ""}` : "<strong>missing</strong>, she paid the link directly, so email her for them"}. Full details are in the event_bookings table.</p>`;
  for (const to of adminRecipients()) {
    const r = await sendBrevoEmail({ to: { email: to }, subject: `🌕 New ${event.title} booking: ${b.name || b.email}`, htmlContent, replyTo: { email: b.email } });
    if (!r.ok) console.error("event booking admin alert failed", { to, error: r.error });
  }
}

/** Files a paid booker on the event's Brevo list (creating or updating the contact). */
export async function addEventBookerToBrevo(event: CosmicEvent, email: string, name: string): Promise<void> {
  if (!event.brevoListId || !process.env.BREVO_API_KEY) return;
  const attributes: Record<string, string> = {};
  if (name) {
    attributes.FIRSTNAME = name.split(" ")[0];
    if (name.includes(" ")) attributes.LASTNAME = name.split(" ").slice(1).join(" ");
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({ email, attributes, listIds: [event.brevoListId], updateEnabled: true }),
    });
    if (!res.ok) console.error("event booking: Brevo list add failed", res.status, (await res.text().catch(() => "")).slice(0, 300));
  } catch (e) {
    console.error("event booking: Brevo list add threw", e instanceof Error ? e.message : e);
  }
}
