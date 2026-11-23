import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { upcomingWorkshops, formatWorkshopWhenLA } from "@/lib/workshops";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Member nudges, sent by /api/cron/member-nudge (Betty asked for this to be automatic, 16 Nov 2026).
//
//   "claim"   → paid for the Coven but never set up an account (an unclaimed pending_memberships row)
//   "missing" → has an account and an active membership but hasn't logged in for a week
//
// The "what you're missing" list comes from NUDGE_HIGHLIGHTS below. Each item has dates, so old
// portals drop off by themselves; add new drops here when they launch.

const SITE = "https://itsmyszn.com";

export interface NudgeHighlight {
  emoji: string;
  title: string;
  line: string;
  path: string;
  /** Shown from this UK date (inclusive), YYYY-MM-DD. */
  from?: string;
  /** Shown until this UK date (inclusive), YYYY-MM-DD. Omit for evergreen items. */
  until?: string;
}

export const NUDGE_HIGHLIGHTS: NudgeHighlight[] = [
  { emoji: "🖤", title: "Lilith: Money & Power Activation", line: "Your guided hypnosis and goddess activation, plus your own Lilith page with your shadow work, your Lilith money era and a money exercise for your placement.", path: "/my-chart/lilith", from: "2026-11-15", until: "2026-12-21" },
  { emoji: "🌕", title: "Full Moon in Gemini, 24th of November", line: "See where it lands in your chart, rewrite the old story and do the twins ritual.", path: "/your-season/gemini-full-moon", from: "2026-11-20", until: "2026-11-28" },
  { emoji: "🔮", title: "The 11/11 portal + workshop replay", line: "Your North and South Node reading, the 17 exercises and the full manifestation workshop replay.", path: "/your-season/11-11", until: "2026-12-11" },
  { emoji: "♀", title: "The Friday the 13th goddess portal", line: "The goddess day ritual and spell from when Venus and Mercury went direct together.", path: "/your-season/friday-13", until: "2026-11-30" },
  { emoji: "💬", title: "The baddie chat", line: "Your coven of baddies, celebrating wins and calling in the big stuff every single day.", path: "/community/room/general" },
];

function ukDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function activeHighlights(now: Date = new Date(), max = 4): NudgeHighlight[] {
  const today = ukDate(now);
  return NUDGE_HIGHLIGHTS.filter((h) => (!h.from || h.from <= today) && (!h.until || h.until >= today)).slice(0, max);
}

export type NudgeKind = "claim" | "missing" | "week1-day1" | "week1-day3" | "week1-day7";

/** The first-week emails (day 1, 3 and 7 after she joins). Shown to Betty as previews first; flip to
 *  true once she has approved the copy and they start sending from the daily cron. */
export const FIRST_WEEK_SEND_APPROVED = true;

/** The next live class as an email card, so every first-week email points at something on the calendar. */
function nextEventCard(now: Date): NudgeHighlight[] {
  const next = upcomingWorkshops(now.getTime()).find((w) => w.startIso);
  if (!next || !next.startIso) return [];
  return [{ emoji: "🔮", title: `Next live: ${next.title}`, line: `${formatWorkshopWhenLA(next.startIso)}. Tap to add it to your calendar, the Zoom link is right on the event.`, path: "/events" }];
}

const COPY: Record<NudgeKind, { subject: string; preview: string; heading: string; intro: (email: string) => string[]; button: string; url: string; after: string; cardsTitle?: string; cards?: (now: Date) => NudgeHighlight[] }> = {
  claim: {
    subject: "your coven is waiting for you, babe 🖤",
    preview: "your membership is paid and ready, you just need to walk in",
    heading: "YOUR COVEN IS WAITING FOR YOU. 🖤🔮",
    intro: (email) => [
      "Your Bad B*tch Coven membership is all paid and ready, but you haven't set up your account yet, so you're missing ALLLL the magic waiting inside. 😱",
      `It takes two minutes: tap the button, enter the email you paid with (${email}) and we'll send you a secure link to finish setting up.`,
    ],
    button: "set up my account →",
    url: `${SITE}/create-account`,
    after: "See you inside, witch. 🦄",
  },
  missing: {
    subject: "babe, you're missing SO much in the coven 👀",
    preview: "here's everything waiting for you since you last popped in",
    heading: "WE MISS YOU IN THE COVEN, BABE. 👀💜",
    intro: () => [
      "It's been a minute since you popped into the coven, and SO much magic has landed since. Here's what's waiting for you right now:",
    ],
    button: "log in to the coven →",
    url: `${SITE}/login?redirect=%2Fcoven`,
    after: "Forgot your password? Tap \"forgot your password\" on the login page and you'll be back in within seconds. 🦄",
  },
  "week1-day1": {
    subject: "welcome to the coven, babe 🖤 start here",
    preview: "three tiny things that make the whole coven click for you",
    heading: "YOU'RE IN, BABE. HERE'S WHERE TO START. 🖤✨",
    intro: () => [
      "Welcome to the Bad B*tch Coven, I am SO happy you're here. 💗",
      "There's a LOT inside, so here's the shortcut. Do these three things this week and everything else falls into place: read your season guide (it's your chart, read for the season we're in right now), say hiii in the baddie chat, and set one goal you want this season.",
    ],
    button: "start here →",
    url: `${SITE}/dashboard`,
    after: "The Start Here box at the top of your season home ticks them off as you go. Stuck on anything at all? Ask me on the help page and I'll answer you myself. 🦄",
    cardsTitle: "✨ your first three moves",
    cards: (now) => [
      { emoji: "📖", title: "Read your season guide", line: "Your own chart, read for this exact season: what it's stirring up for you and how to work with it.", path: "/dashboard" },
      { emoji: "💬", title: "Say hiii in the baddie chat", line: "Drop your Big 3 and one thing you're calling in. The girls ALWAYS answer.", path: "/community/room/general" },
      { emoji: "🎯", title: "Set one goal", line: "One thing you want this season, so everything you do in here has a direction.", path: "/goals" },
      ...nextEventCard(now),
    ],
  },
  "week1-day3": {
    subject: "babe, the good stuff is hiding in here 👀",
    preview: "your chart portal, the replay vault and the app on your phone",
    heading: "THE GOOD STUFF HIDING IN YOUR COVEN. 👀💜",
    intro: () => [
      "Three days in! 💗 You've seen your season home, so now let me show you the parts that go DEEP.",
      "Your whole chart is in there, every placement read for you, plus every masterclass we've ever done, ready to watch whenever you want.",
    ],
    button: "open my chart →",
    url: `${SITE}/my-chart`,
    after: "Pro tip: put MY SZN on your phone's home screen (Safari: Share, then Add to Home Screen) so the coven is one tap away. 🦄",
    cardsTitle: "✨ go deeper",
    cards: () => [
      { emoji: "🌙", title: "Your full chart", line: "Every placement read for you, in plain English, with what to actually DO with it.", path: "/my-chart" },
      { emoji: "🎬", title: "The replay vault", line: "Every masterclass and astrotapping session, rewatch as many times as you like.", path: "/events/replays" },
      { emoji: "💗", title: "Customise your szn", line: "Tell us what you want MORE of (money, love, confidence) and your season leans into it.", path: "/your-season/customise" },
    ],
  },
  "week1-day7": {
    subject: "one week in the coven 🥂 tell me how it's going",
    preview: "your first week, your next live session and a direct line to me",
    heading: "ONE WEEK IN THE COVEN. 🥂💗",
    intro: () => [
      "You've officially been a Bad B*tch Coven member for a whole week! 🥂",
      "I want to hear how it's landing for you. Hit reply and tell me one thing that's shifted, or one thing you want more of, I read every single one. If anything's confusing, tell me that too, so I can fix it.",
    ],
    button: "see what's on →",
    url: `${SITE}/events`,
    after: "Show up live if you can, the energy in the room is EVERYTHING. If you can't, the replay lands in your vault. 🦄",
    cardsTitle: "✨ coming up for you",
    cards: (now) => [
      ...nextEventCard(now),
      { emoji: "💌", title: "Message me privately", line: "Questions about your chart, your season or your life, it comes straight to me.", path: "/messages" },
      { emoji: "🆘", title: "Help, any time", line: "Answers to everything about the coven, or send me your question.", path: "/help" },
    ],
  },
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function buildNudgeEmail(kind: NudgeKind, email: string, now: Date = new Date()): { subject: string; html: string } {
  const c = COPY[kind];
  const items = c.cards ? c.cards(now) : activeHighlights(now);
  const cards = items
    .map(
      (h) => `
    <tr><td style="padding:0 0 10px;">
      <a href="${SITE}${h.path}" style="display:block;text-decoration:none;background:#ffffff;border:2px solid #1a1a1a;padding:14px 16px;color:#1a1a1a;font-family:Arial,sans-serif;">
        <div style="font-family:Poppins,Arial,sans-serif;font-size:16px;font-weight:800;">${h.emoji} ${esc(h.title)}</div>
        <div style="font-size:14px;line-height:1.55;margin-top:4px;">${esc(h.line)}</div>
      </a>
    </td></tr>`,
    )
    .join("");
  const intro = c.intro(email).map((p) => `<p style="margin:0 0 16px;">${esc(p)}</p>`).join("");
  const button = `<a href="${c.url}" style="display:inline-block;background:#FF2D87;color:#1a1a1a;text-decoration:none;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:14px;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;border:2px solid #1a1a1a;">${esc(c.button)}</a>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(c.subject)}</title>
<style>@media (max-width: 600px) { .pad { padding-left: 20px !important; padding-right: 20px !important; } .h1 { font-size: 30px !important; } }</style></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(c.preview)}&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:2px solid #1a1a1a;">
  <tr><td class="pad" style="background:#FF2D87;padding:28px 28px 26px;font-family:Poppins,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#FFE0F0" background="${SITE}/brand/holographic.jpg" style="background:#FFE0F0 url('${SITE}/brand/holographic.jpg') center / cover;border:2px solid #1a1a1a;border-radius:999px;padding:6px 14px;font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;">🦄 Bad B*tch Coven members</td></tr></table>
    <div class="h1" style="font-size:36px;font-weight:800;line-height:1.02;color:#1a1a1a;margin-top:16px;letter-spacing:-1px;">${esc(c.heading)}</div>
  </td></tr>
  <tr><td style="font-size:0;line-height:0;border-top:2px solid #1a1a1a;border-bottom:2px solid #1a1a1a;"><img src="${SITE}/coven/foil-strip.jpg" width="556" height="12" alt="" style="display:block;width:100%;max-width:556px;height:12px;"></td></tr>
  <tr><td class="pad" style="padding:30px 28px 8px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
    <p style="margin:0 0 16px;font-weight:700;">Hiii my love, 💜</p>
    ${intro}
    <p style="margin:0 0 22px;">${button}</p>
    <div style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">${esc(c.cardsTitle ?? "✨ what's waiting for you inside")}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${cards}</table>
    <p style="margin:0 0 16px;">${esc(c.after)}</p>
    <p style="margin:0 0 24px;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:18px;">Betty 💜</p>
  </td></tr>
  <tr><td style="font-size:0;line-height:0;border-top:2px solid #1a1a1a;"><img src="${SITE}/coven/foil-band.jpg" width="556" height="24" alt="" style="display:block;width:100%;max-width:556px;height:24px;"></td></tr>
  <tr><td style="background:#1a1a1a;padding:18px 28px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#ffffff;">my<span style="color:#FF2D87;">szn</span> · You&apos;re getting this because you&apos;re a member of the Bad B*tch Coven.</td></tr>
</table></td></tr></table></body></html>`;
  return { subject: c.subject, html };
}

export type NudgeOutcome = { status: "sent" } | { status: "skipped"; reason: string } | { status: "failed"; error: string } | { status: "dry_run" };

/** Sends one nudge, at most once per key (the transactional_emails log is the dedupe). */
export async function sendNudge(admin: SupabaseAdmin, kind: NudgeKind, email: string, key: string, dryRun: boolean): Promise<NudgeOutcome> {
  const logKind = `member-nudge-${kind}`;
  const { data: prior, error: priorError } = await admin
    .from("transactional_emails")
    .select("id")
    .eq("stripe_session_id", key)
    .eq("kind", logKind)
    .eq("status", "sent")
    .maybeSingle();
  // A failed lookup must never be read as "not sent yet", or someone gets this every day.
  if (priorError) return { status: "skipped", reason: `lookup failed: ${priorError.message}` };
  if (prior) return { status: "skipped", reason: "already_sent" };
  if (dryRun) return { status: "dry_run" };

  const { subject, html } = buildNudgeEmail(kind, email);
  const result = await sendBrevoEmail({ to: { email }, subject, htmlContent: html, replyTo: { email: "hello@thecosmicco.com" } });
  const { error: logError } = await admin.from("transactional_emails").insert({
    email,
    kind: logKind,
    stripe_session_id: key,
    status: result.ok ? "sent" : "failed",
    provider: "solstral",
    provider_message_id: result.ok ? result.messageId : null,
    error: result.ok ? null : result.error,
  });
  if (logError && logError.code !== "23505") console.error("member-nudge: log insert failed", logError.message);
  return result.ok ? { status: "sent" } : { status: "failed", error: result.error };
}
