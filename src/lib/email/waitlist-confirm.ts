import { sendBrevoEmail, type BrevoSendResult } from "@/lib/email/brevo";
import { OFFERS, type OfferSlug } from "@/lib/offers";
import { SITE_URL } from "@/lib/site";

// The "you're on the list" email, sent the moment someone joins a waitlist for the first time
// (never on a repeat signup). Copy lives here, in code, so every list gets its confirmation without
// anyone building six automations in Brevo first. Voice rules: "Hiii my love", b*tch always
// censored, no em dashes, no rhetorical questions, no invented dates or prices.

const COPY: Record<OfferSlug, { subject: string; heading: string; body: string[] }> = {
  "rich-btch-rising": {
    subject: "You're on the Rich B*tch Rising list 💸",
    heading: "your rich b*tch era is officially loading",
    body: [
      "You just put your name down for Rich B*tch Rising, your personalised money report, and I am SOOOO excited for you, because the women who get curious about their money are the women who end up with LOTS of it.",
      "Your report is written from your exact birth chart: where the money is written for you, the work that pays you best, the old good-girl rules that keep you undercharging and the self-worth that decides what lands in your bank account.",
      "You'll be the very first to know the moment it opens, so keep an eye on this inbox (and maybe start picturing what you'll do with the extra $$$).",
    ],
  },
  "bad-btch-report": {
    subject: "You're on The Bad B*tch Report list 💜",
    heading: "OMGGGG you're in",
    body: [
      "You just joined the waitlist for The Bad B*tch Report, your personalised confidence report, which honestly counts as your first act of taking up MORE space.",
      "Every woman has her own flavour of baddie written into her chart, so your report reads yours: your power, your visibility, your boundaries and the exact moments you shrink to keep everyone else comfortable.",
      "The moment it opens you'll hear it from me first, before anybody else gets a look in.",
    ],
  },
  "baddie-coven": {
    subject: "Welcome to the coven, witch 🦄",
    heading: "your name is in the book",
    body: [
      "You're on the waitlist for The Baddie Coven, our creative, cosmic clubhouse, and I'm OBSESSED that you're here.",
      "Monthly creative classes, astrology, manifestation, rituals, a little witchcraft and a whole community of women bringing more magic into their everyday lives, all in one place.",
      "The doors, the dates and every magical detail come to this list before anyone else hears a whisper.",
    ],
  },
  "baddie-coven-la": {
    subject: "You're on the LA Baddie Coven list 🌴",
    heading: "see you in LA, witch",
    body: [
      "You just joined the waitlist for the LA Baddie Coven, our in-person coven in Los Angeles, and I am SOOO excited to meet you in real life.",
      "The online coven is for witchy women everywhere, and the LA coven brings it into the room with candles, rituals, creative magic and your girls, face to face. They're priced separately, and you can join one or both.",
      "The dates, the location and the price come to this list first, before anybody else hears a whisper.",
    ],
  },
  mastermind: {
    subject: "You're on the MY SZN Mastermind list 🪐",
    heading: "future you just did a little happy dance",
    body: [
      "You're on the waitlist for the MY SZN Mastermind, our 90-day transformation experience with a private 1:1 with me every month, group coaching every season and a small cohort of women who hold you to it.",
      "It's $1,500 for the 90 days, which is $500 a month for three months.",
      "The next cohort's dates come to this list first, so you'll get first pick of a seat before it goes anywhere else.",
    ],
  },
  retreat: {
    subject: "You're on The Bad B*tch Retreat list 🌴",
    heading: "YESSSS, see you in real life",
    body: [
      "You just put your name down for The Bad B*tch Retreat, an immersive in-person experience where we explore every single part of ourselves: body, sensuality, creativity, confidence, sexuality, shadow, power and self-love.",
      "Where we're going, when we're going and every juicy detail goes to this list first, the second I can tell you.",
    ],
  },
  book: {
    subject: "You're on the list for the MY SZN book 📚",
    heading: "SOOOO happy you're here",
    body: [
      "You've registered your interest in the MY SZN book, all about becoming your future self through astrology, manifestation, self-concept, confidence, healing, money and creating your dream life.",
      "You'll be the first to know the moment there's a cover to swoon over, a date to circle and a way to get your hands on a copy.",
    ],
  },
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function waitlistConfirmHtml(offer: OfferSlug, firstName: string): { subject: string; html: string } {
  const c = COPY[offer];
  const o = OFFERS[offer];
  const url = `${SITE_URL}${o.href}`;
  const greeting = firstName ? `Hiii ${esc(firstName)}, my love` : "Hiii my love";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:2px solid #1a1a1a;">
<tr><td style="background:#FF2D87;padding:32px 28px;font-family:Poppins,Arial,sans-serif;">
<div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ffffff;">${esc(o.name)}</div>
<div style="font-size:34px;font-weight:800;line-height:1.05;color:#1a1a1a;margin-top:14px;letter-spacing:-1px;">${esc(c.heading)}</div>
</td></tr>
<tr><td style="padding:30px 28px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
<p style="margin:0 0 16px;font-weight:700;">${greeting} 💜</p>
${c.body.map((p) => `<p style="margin:0 0 16px;">${esc(p)}</p>`).join("\n")}
<p style="margin:24px 0 0;"><a href="${url}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:16px 28px;">see ${esc(o.name)}</a></p>
<p style="margin:28px 0 0;">Love,<br><strong>Betty</strong> 🪩</p>
</td></tr>
<tr><td style="background:#1a1a1a;padding:18px 28px;font-family:Arial,sans-serif;font-size:12px;color:#ffffff;">my<span style="color:#FF2D87;">szn</span> · You're getting this because you joined a waitlist at itsmyszn.com.</td></tr>
</table></td></tr></table></body></html>`;
  return { subject: c.subject, html };
}

export async function sendWaitlistConfirmation(offer: OfferSlug, email: string, firstName: string): Promise<BrevoSendResult> {
  const { subject, html } = waitlistConfirmHtml(offer, firstName);
  return sendBrevoEmail({ to: { email, name: firstName || undefined }, subject, htmlContent: html });
}
