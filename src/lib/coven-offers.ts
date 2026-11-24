// The Bad B*tch Coven's three extra ways in (24 Nov 2026, Betty: "do all"):
//
//   yearly  → $444 a year on the Coven product (two months free vs $44 x 12). Plain subscription,
//             mapped to the "monthly" tier in stripe-tiers, welcomed like a monthly join.
//   gift    → $132 one-off = three months of the Coven for someone else. The buyer names her and
//             picks "now" or "Christmas morning". Access is granted to HER email (parked until she
//             sets up an account), never to the buyer.
//   refer   → a member shares itsmyszn.com/baddie-coven?ref=<her profile id>. When a friend joins
//             through it, the member gets $44 off her next bill as a Stripe customer-balance credit
//             (stacks per friend, works for monthly and yearly alike).
//
// Every send is deduped in transactional_emails by (kind, stripe_session_id), so Stripe retries and
// the nightly job can run as often as they like.

import type Stripe from "stripe";
import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

import {
  COVEN_GIFT_PRICE_ID, COVEN_GIFT_LINK_ID, COVEN_REFERRAL_CREDIT_CENTS, CHRISTMAS_DELIVERY_AT, referrerFromClientRef,
} from "@/lib/coven-offers-shared";
export * from "@/lib/coven-offers-shared";

const SITE = "https://itsmyszn.com";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── email shell ──

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildEmail(opts: { subject: string; preview: string; heading: string; paras: string[]; button?: { label: string; url: string }; after?: string }): string {
  const paras = opts.paras.map((p) => `<p style="margin:0 0 16px;">${esc(p)}</p>`).join("");
  const button = opts.button
    ? `<p style="margin:0 0 22px;"><a href="${opts.button.url}" style="display:inline-block;background:#FF2D87;color:#1a1a1a;text-decoration:none;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:14px;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;border:2px solid #1a1a1a;">${esc(opts.button.label)}</a></p>`
    : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(opts.subject)}</title></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:2px solid #1a1a1a;">
  <tr><td style="background:#FF2D87;padding:28px;font-family:Poppins,Arial,sans-serif;">
    <div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;">🦄 The Bad B*tch Coven</div>
    <div style="font-size:34px;font-weight:800;line-height:1.05;color:#1a1a1a;margin-top:14px;letter-spacing:-1px;">${esc(opts.heading)}</div>
  </td></tr>
  <tr><td style="padding:30px 28px 8px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
    <p style="margin:0 0 16px;font-weight:700;">Hiii my love, 💜</p>
    ${paras}${button}
    ${opts.after ? `<p style="margin:0 0 16px;">${esc(opts.after)}</p>` : ""}
    <p style="margin:0 0 24px;font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:18px;">Betty 💜</p>
  </td></tr>
  <tr><td style="background:#1a1a1a;padding:18px 28px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#ffffff;">my<span style="color:#FF2D87;">szn</span> · The Bad B*tch Coven</td></tr>
</table></td></tr></table></body></html>`;
}

async function alreadySent(admin: SupabaseAdmin, kind: string, key: string): Promise<boolean> {
  const { data } = await admin.from("transactional_emails").select("id").eq("kind", kind).eq("stripe_session_id", key).eq("status", "sent").maybeSingle();
  return !!data;
}

async function sendLogged(admin: SupabaseAdmin, kind: string, key: string, to: string, subject: string, html: string): Promise<boolean> {
  if (await alreadySent(admin, kind, key)) return true;
  const r = await sendBrevoEmail({ to: { email: to }, subject, htmlContent: html, replyTo: { email: "hello@thecosmicco.com" } });
  await admin.from("transactional_emails").insert({
    email: to, kind, stripe_session_id: key, status: r.ok ? "sent" : "failed", provider: "solstral",
    provider_message_id: r.ok ? r.messageId : null, error: r.ok ? null : r.error,
  });
  if (!r.ok) console.error("coven-offers: send failed", { kind, error: r.error });
  return r.ok;
}

async function alertBetty(admin: SupabaseAdmin, key: string, subject: string, lines: string[]): Promise<void> {
  for (const to of adminRecipients()) {
    await sendLogged(admin, `admin_coven_offer`, `${key}:${to}`, to, subject, buildEmail({ subject, preview: lines[0] ?? subject, heading: subject, paras: lines }));
  }
}

// ── gift a baddie ──

type GiftDetails = { sessionId: string; buyerEmail: string; buyerName: string; name: string; email: string; christmas: boolean };

export function giftDetails(session: Stripe.Checkout.Session): GiftDetails {
  const field = (k: string) => session.custom_fields?.find((f) => f.key === k);
  return {
    sessionId: session.id,
    buyerEmail: session.customer_details?.email?.toLowerCase() ?? "",
    buyerName: (session.customer_details?.name ?? "").trim().split(/\s+/)[0] || "your bestie",
    name: (field("recipientname")?.text?.value ?? "").trim().split(/\s+/)[0] || "babe",
    email: (field("recipientemail")?.text?.value ?? "").trim().toLowerCase(),
    christmas: field("delivery")?.dropdown?.value === "christmas",
  };
}

/** Grants three months to her and sends her gift email. Safe to call twice. */
async function deliverGift(admin: SupabaseAdmin, g: GiftDetails): Promise<void> {
  const start = new Date();
  const end = new Date(start);
  end.setMonth(end.getMonth() + 3);
  const facts = {
    membership_level: "monthly",
    stripe_customer_id: null,
    stripe_subscription_id: null,
    stripe_price_id: COVEN_GIFT_PRICE_ID,
    subscription_status: "active",
    subscription_current_period_end: end.toISOString(),
    subscription_cancel_at_period_end: true,
  };

  const { data: profile } = await admin
    .from("profiles")
    .select("id, stripe_subscription_id, subscription_status, membership_level")
    .eq("email", g.email)
    .maybeSingle();

  let hasAccount = false;
  if (profile) {
    hasAccount = true;
    const paying = !!profile.stripe_subscription_id && ["active", "trialing", "past_due"].includes(profile.subscription_status ?? "");
    if (paying) {
      // She already pays: never overwrite a live subscription with a gift. Betty decides (refund,
      // or credit her account) from the alert.
      await alertBetty(admin, `gift-clash:${g.sessionId}`, "Coven gift for someone who already pays", [
        `${g.buyerName} (${g.buyerEmail}) bought a Coven gift for ${g.name} (${g.email}), who already has a paid membership.`,
        "Nothing was changed on her account. Either refund the gift in Stripe or add $132 credit to her customer balance.",
      ]);
      return;
    }
    const nowIso = start.toISOString();
    await admin.from("profiles").update({ ...facts, membership_started_at: nowIso, membership_updated_at: nowIso }).eq("id", profile.id);
  } else {
    await admin.from("pending_memberships").upsert({ email: g.email, ...facts, updated_at: start.toISOString() }, { onConflict: "email" });
  }

  const subject = `${g.buyerName} just gifted you the Bad B*tch Coven 🎁`;
  await sendLogged(admin, "coven_gift_recipient", g.sessionId, g.email, subject, buildEmail({
    subject,
    preview: "three months of magic, money and your new girl gang, paid for with love",
    heading: "YOU'VE BEEN GIFTED THE COVEN. 🎁🔮",
    paras: [
      `${g.buyerName} just gave you three whole months inside the Bad B*tch Coven, babe, which means your personalised season, the live masterclasses with me, every replay, the rituals and a chat full of baddies cheering you on.`,
      hasAccount
        ? "It's already on your account, so just log in and walk straight in."
        : `Tap the button, enter this email (${g.email}) and we'll send you a secure link to set up your account. Takes two minutes.`,
    ],
    button: hasAccount ? { label: "open my coven →", url: `${SITE}/login?redirect=%2Fcoven` } : { label: "claim my gift →", url: `${SITE}/create-account` },
    after: `Your three months run until the ${britishDay(end)}. See you inside, witch. 🦄`,
  }));
}

function britishDay(d: Date): string {
  const day = d.getUTCDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix} of ${d.toLocaleString("en-GB", { month: "long", timeZone: "UTC" })} ${d.getUTCFullYear()}`;
}

/** Webhook entry for a completed gift checkout. */
export async function handleCovenGiftPurchase(admin: SupabaseAdmin, session: Stripe.Checkout.Session): Promise<void> {
  const g = giftDetails(session);

  if (!EMAIL.test(g.email)) {
    await alertBetty(admin, `gift-bad-email:${g.sessionId}`, "Coven gift with an unusable email", [
      `${g.buyerName} (${g.buyerEmail}) bought a Coven gift for ${g.name}, but the email they typed (${g.email || "blank"}) doesn't work.`,
      "Reply to the buyer for her real email, then forward her the gift.",
    ]);
  }

  const scheduled = g.christmas && Date.now() < CHRISTMAS_DELIVERY_AT;
  if (EMAIL.test(g.email) && !scheduled) await deliverGift(admin, g);

  if (g.buyerEmail) {
    const subject = scheduled ? `your gift for ${g.name} lands on Christmas morning 🎄` : `your gift for ${g.name} is on its way 🎁`;
    await sendLogged(admin, "coven_gift_buyer", g.sessionId, g.buyerEmail, subject, buildEmail({
      subject,
      preview: "you just gave a baddie three months of magic",
      heading: "YOU JUST GIFTED A BADDIE. 🎁💜",
      paras: [
        `Thank you for giving ${g.name} three months inside the Bad B*tch Coven, babe. That's her personalised season, live masterclasses, every replay and a whole coven of women cheering her on.`,
        scheduled
          ? `She'll get her gift email on Christmas morning at ${g.email}, with everything she needs to walk straight in.`
          : `Her gift email just went to ${g.email}, with everything she needs to walk straight in.`,
      ],
      after: "If anything about her email looks off, just reply here and I'll sort it.",
    }));
  }

  await alertBetty(admin, `gift:${g.sessionId}`, "New Coven gift 🎁", [
    `${g.buyerName} (${g.buyerEmail}) gifted 3 months to ${g.name} (${g.email}).`,
    scheduled ? "Delivery: Christmas morning (sent by the nightly job)." : "Delivery: sent now.",
  ]);
}

/** Nightly: delivers every "Christmas morning" gift once the day arrives. */
export async function deliverScheduledGifts(admin: SupabaseAdmin, stripe: Stripe, now = Date.now()): Promise<number> {
  if (now < CHRISTMAS_DELIVERY_AT) return 0;
  let delivered = 0;
  for await (const session of stripe.checkout.sessions.list({ payment_link: COVEN_GIFT_LINK_ID, status: "complete", limit: 100 })) {
    const g = giftDetails(session);
    if (!g.christmas || !EMAIL.test(g.email)) continue;
    if (await alreadySent(admin, "coven_gift_recipient", g.sessionId)) continue;
    await deliverGift(admin, g);
    delivered++;
  }
  return delivered;
}

// ── bring a baddie (referrals) ──

/** Webhook: a new Coven subscription that came through a member's referral link. */
export async function rewardReferrer(admin: SupabaseAdmin, stripe: Stripe, session: Stripe.Checkout.Session, newCustomerId: string): Promise<void> {
  const referrerId = referrerFromClientRef(session.client_reference_id);
  if (!referrerId) return;
  const key = `ref:${session.id}`;
  if (await alreadySent(admin, "coven_referral_reward", key)) return;

  const { data: referrer } = await admin
    .from("profiles")
    .select("id, name, email, stripe_customer_id, subscription_status")
    .eq("id", referrerId)
    .maybeSingle();
  const friendEmail = session.customer_details?.email?.toLowerCase() ?? "";
  const friendName = (session.customer_details?.name ?? "").trim().split(/\s+/)[0] || "a new baddie";
  if (!referrer?.email) return;
  if (referrer.email.toLowerCase() === friendEmail || referrer.stripe_customer_id === newCustomerId) return; // self-referral

  const firstName = (referrer.name ?? "").trim().split(/\s+/)[0] || "babe";
  const canCredit = !!referrer.stripe_customer_id && ["active", "trialing", "past_due"].includes(referrer.subscription_status ?? "");

  if (canCredit) {
    try {
      await stripe.customers.createBalanceTransaction(referrer.stripe_customer_id!, {
        amount: -COVEN_REFERRAL_CREDIT_CENTS,
        currency: "usd",
        description: `Free month: you brought ${friendName} into the Coven`,
        metadata: { referral_session: session.id },
      });
    } catch (e) {
      console.error("coven referral: credit failed", { referrerId, error: e instanceof Error ? e.message : e });
      await alertBetty(admin, `ref-fail:${session.id}`, "Coven referral credit failed", [
        `${referrer.name} brought in ${friendName} (${friendEmail}) but the $44 credit didn't apply in Stripe. Add it by hand on her customer.`,
      ]);
      return;
    }
  } else {
    await alertBetty(admin, `ref-comp:${session.id}`, "Coven referral from a comped member", [
      `${referrer.name} (${referrer.email}) brought in ${friendName} (${friendEmail}), but she has no paid subscription to credit. Thank her your way. 💜`,
    ]);
  }

  const subject = `${friendName} just joined the coven because of you 💸`;
  await sendLogged(admin, "coven_referral_reward", key, referrer.email, subject, buildEmail({
    subject,
    preview: "your next month is on me",
    heading: "YOU BROUGHT A BADDIE. 👯‍♀️💸",
    paras: [
      `${friendName} just joined the Bad B*tch Coven through your link, ${firstName}, so your next month is on me. 💜`,
      canCredit
        ? "The $44 credit is already on your account and comes off your next bill automatically. Bring another baddie and you get another month."
        : "I'm sending you a thank you myself.",
    ],
    button: { label: "go say hiii to her →", url: `${SITE}/community/room/general` },
  }));
}
