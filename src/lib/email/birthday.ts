import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail } from "@/lib/email/brevo";
import type { BirthdayReading } from "@/lib/birthday-reading";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// The birthday email: sent by /api/cron/member-nudge on her birthday (UK date), with the theme of her
// year and three highlights from her reading, linking to the full page at /your-season/birthday.

/** Shown to Betty as a preview first; flip to true once she has approved it and it starts sending. */
export const BIRTHDAY_SEND_APPROVED = true;

const SITE = "https://itsmyszn.com";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const ord = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

export function buildBirthdayEmail(firstName: string | null, r: BirthdayReading): { subject: string; html: string } {
  const name = firstName?.trim() || null;
  const subject = name ? `happy birthday, ${name.toLowerCase()} 🎂 your year ahead is here` : "happy birthday, babe 🎂 your year ahead is here";
  const preview = `your ${r.year.title}: everything your chart says about the year ahead`;
  const url = `${SITE}/login?redirect=%2Fyour-season%2Fbirthday`;

  const cards = [
    { kicker: "who's running your year", title: r.lord.title, line: r.lord.body },
    { kicker: "where life gets bigger", title: `Jupiter in your ${ord(r.jupiter.house)} house`, line: r.jupiter.body },
    { kicker: "where you build", title: `Saturn in your ${ord(r.saturn.house)} house`, line: r.saturn.body },
  ]
    .map(
      (c) => `
    <tr><td style="padding:0 0 10px;">
      <a href="${url}" style="display:block;text-decoration:none;background:#ffffff;border:2px solid #1a1a1a;padding:14px 16px;color:#1a1a1a;font-family:Arial,sans-serif;">
        <div style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FF2D87;">${esc(c.kicker)}</div>
        <div style="font-family:Poppins,Arial,sans-serif;font-size:16px;font-weight:800;margin-top:4px;">${esc(c.title)}</div>
        <div style="font-size:14px;line-height:1.55;margin-top:4px;">${esc(c.line)}</div>
      </a>
    </td></tr>`,
    )
    .join("");

  const moves = r.year.moves.map((m) => `<li style="margin:0 0 4px;">${esc(m)}</li>`).join("");
  const button = `<a href="${url}" style="display:inline-block;background:#FF2D87;color:#1a1a1a;text-decoration:none;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:14px;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;border:2px solid #1a1a1a;">read my full birthday reading →</a>`;
  const heading = name ? `HAPPY BIRTHDAY, ${name.toUpperCase()}! 🎂💗` : "HAPPY BIRTHDAY, BABE! 🎂💗";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(subject)}</title>
<style>@media (max-width: 600px) { .pad { padding-left: 20px !important; padding-right: 20px !important; } .h1 { font-size: 30px !important; } }</style></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preview)}&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:2px solid #1a1a1a;">
  <tr><td class="pad" style="background:#FF2D87;padding:28px 28px 26px;font-family:Poppins,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#FFE0F0" background="${SITE}/brand/holographic.jpg" style="background:#FFE0F0 url('${SITE}/brand/holographic.jpg') center / cover;border:2px solid #1a1a1a;border-radius:999px;padding:6px 14px;font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;">🎂 your birthday reading</td></tr></table>
    <div class="h1" style="font-size:36px;font-weight:800;line-height:1.02;color:#1a1a1a;margin-top:16px;letter-spacing:-1px;">${esc(heading)}</div>
  </td></tr>
  <tr><td style="font-size:0;line-height:0;border-top:2px solid #1a1a1a;border-bottom:2px solid #1a1a1a;"><img src="${SITE}/coven/foil-strip.jpg" width="556" height="12" alt="" style="display:block;width:100%;max-width:556px;height:12px;"></td></tr>
  <tr><td class="pad" style="padding:30px 28px 8px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
    <p style="margin:0 0 16px;font-weight:700;">Hiii my love, 💜</p>
    <p style="margin:0 0 16px;">Today the Sun came back to the exact spot it was in the moment you were born, so your brand new year officially starts NOW. 🥂</p>
    <p style="margin:0 0 20px;">I've read your chart for the whole year ahead, from today right up to your next birthday, and babe, there is SO much in here for you.</p>
    <div style="background:#1a1a1a;border:2px solid #1a1a1a;padding:20px 20px 16px;margin:0 0 20px;color:#ffffff;">
      <div style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FF2D87;">the theme of your year</div>
      <div style="font-family:Poppins,Arial,sans-serif;font-size:24px;font-weight:800;line-height:1.15;margin:6px 0 4px;">${esc(r.year.title)}.</div>
      <div style="font-family:Poppins,Arial,sans-serif;font-size:13px;font-weight:700;margin:0 0 12px;">${esc(r.year.area)}</div>
      <div style="font-size:15px;line-height:1.65;margin:0 0 12px;">${esc(r.year.body)}</div>
      <div style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FF2D87;margin:0 0 6px;">your moves this year</div>
      <ul style="margin:0;padding-left:18px;font-size:15px;line-height:1.6;">${moves}</ul>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${cards}</table>
    <p style="margin:0 0 22px;">${button}</p>
    <p style="margin:0 0 16px;">Your full reading has even more: how you show up this year and what you need to feel held. Have the most delicious day, you deserve ALL of it. 🦄</p>
    <p style="margin:0 0 24px;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:18px;">Betty 💜</p>
  </td></tr>
  <tr><td style="font-size:0;line-height:0;border-top:2px solid #1a1a1a;"><img src="${SITE}/coven/foil-band.jpg" width="556" height="24" alt="" style="display:block;width:100%;max-width:556px;height:24px;"></td></tr>
  <tr><td style="background:#1a1a1a;padding:18px 28px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#ffffff;">my<span style="color:#FF2D87;">szn</span> · You&apos;re getting this because you&apos;re a member of the Bad B*tch Coven.</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, html };
}

export type BirthdayOutcome = { status: "sent" } | { status: "skipped"; reason: string } | { status: "failed"; error: string } | { status: "dry_run" };

/** Sends her birthday email once per birthday (the transactional_emails log is the dedupe). */
export async function sendBirthdayEmail(
  admin: SupabaseAdmin,
  email: string,
  key: string,
  firstName: string | null,
  reading: BirthdayReading,
  dryRun: boolean,
): Promise<BirthdayOutcome> {
  const kind = "birthday-reading";
  const { data: prior, error: priorError } = await admin.from("transactional_emails").select("id").eq("stripe_session_id", key).eq("kind", kind).eq("status", "sent").maybeSingle();
  if (priorError) return { status: "skipped", reason: `lookup failed: ${priorError.message}` };
  if (prior) return { status: "skipped", reason: "already_sent" };
  if (dryRun) return { status: "dry_run" };

  const { subject, html } = buildBirthdayEmail(firstName, reading);
  const result = await sendBrevoEmail({ to: { email }, subject, htmlContent: html, replyTo: { email: "hello@thecosmicco.com" } });
  const { error: logError } = await admin.from("transactional_emails").insert({
    email,
    kind,
    stripe_session_id: key,
    status: result.ok ? "sent" : "failed",
    provider: "solstral",
    provider_message_id: result.ok ? result.messageId : null,
    error: result.ok ? null : result.error,
  });
  if (logError && logError.code !== "23505") console.error("birthday email: log insert failed", logError.message);
  return result.ok ? { status: "sent" } : { status: "failed", error: result.error };
}
