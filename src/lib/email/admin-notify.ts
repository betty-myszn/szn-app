import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { planNameForPrice } from "@/lib/email/welcome";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// One row per checkout in transactional_emails, same table and the same partial unique index on
// (stripe_session_id, kind) that makes the welcome email exactly-once. Reusing it means a Stripe
// webhook retry can't send a second "new member" alert, with no new schema.
const ADMIN_ALERT_KIND = "admin_new_member";
// Free trial and free-tier signups, which never touch Stripe. Kept as its own kind so paid joins and
// free joins can be told apart in the send log.
const SIGNUP_ALERT_KIND = "admin_new_signup";

/**
 * Where new-member alerts go. Defaults to the Brevo sender identity (the support inbox) so this
 * works without any new configuration; set ADMIN_NOTIFY_EMAIL to send somewhere else. Comma
 * separated addresses are allowed, each gets its own send so one bad address can't drop the rest.
 */
function adminRecipients(): string[] {
  const raw =
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.BREVO_SENDER_EMAIL ||
    "hello@thecosmicco.com";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Buyer-supplied values (name, email) go into an HTML body, so they get escaped. A member can set
// their Stripe name to anything, and this email is read in an inbox that renders HTML.
function esc(v: string | null | undefined): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The buyer types their own name into Stripe Checkout, and it ends up in an email subject line.
// Escaping covers the HTML body, but a subject is plain text: strip control characters (which can
// confuse mail headers), collapse whitespace, and cap the length so one long name can't push the
// plan out of a truncated inbox preview.
function cleanName(name: string | null | undefined): string {
  // eslint-disable-next-line no-control-regex
  const flat = String(name ?? "").replace(/[\x00-\x1F\x7F]+/g, " ").replace(/\s+/g, " ").trim();
  return flat.length > 60 ? `${flat.slice(0, 60)}…` : flat;
}

function formatAmount(amountTotal: number | null | undefined, currency: string | null | undefined): string {
  if (amountTotal == null) return "not reported";
  // Stripe reports minor units for every currency this store sells in.
  const major = amountTotal / 100;
  const code = (currency || "usd").toUpperCase();
  return `${major.toFixed(2)} ${code}`;
}

export interface NewMemberAlertArgs {
  sessionId: string;
  email: string | null | undefined;
  name?: string | null;
  priceId: string | null | undefined;
  /** 'monthly' | 'vip', already resolved from the price by the webhook. */
  tier: string;
  amountTotal?: number | null;
  currency?: string | null;
  stripeCustomerId?: string | null;
  /**
   * False when the buyer paid before creating an account, so the membership is parked against
   * their email until they claim it. Worth calling out: those are the ones who go quiet.
   */
  accountClaimed: boolean;
}

/**
 * Builds the subject and HTML body for the alert. Separate from the send so the copy can be
 * rendered and eyeballed without putting anything in anyone's inbox.
 */
export function buildNewMemberAlert(args: NewMemberAlertArgs): { subject: string; htmlContent: string } {
  const planName = planNameForPrice(args.priceId) ?? `${args.tier} membership`;
  const displayName = cleanName(args.name) || "(no name given)";
  const accountClaimed = args.accountClaimed;

  const rows: [string, string][] = [
    ["Name", displayName],
    ["Email", args.email || "(none on the checkout session)"],
    ["Plan", planName],
    ["Tier", args.tier],
    ["Paid", formatAmount(args.amountTotal, args.currency)],
    ["Account", accountClaimed ? "Created, membership is live" : "Not created yet, membership parked until they claim it"],
    ["Stripe customer", args.stripeCustomerId || "not reported"],
    ["Checkout session", args.sessionId],
    ["When", new Date().toISOString()],
  ];

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a1a;line-height:1.6">
      <p style="font-size:17px;font-weight:700;margin:0 0 4px">New MY SZN member 🎉</p>
      <p style="margin:0 0 18px;color:#666">${esc(displayName)} just joined on ${esc(planName)}.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:520px">
        ${rows
          .map(
            ([label, value]) => `
        <tr>
          <td style="padding:8px 12px 8px 0;border-bottom:1px solid #eee;color:#888;white-space:nowrap;vertical-align:top">${esc(label)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;word-break:break-word">${esc(value)}</td>
        </tr>`
          )
          .join("")}
      </table>
      ${
        accountClaimed
          ? ""
          : `<p style="margin:18px 0 0;padding:12px;background:#F3EEFE;border:1px solid #C8B4F8;color:#3C2A70">
               They paid before creating an account. The welcome email has their activation link, so
               no action is needed unless they never turn up.
             </p>`
      }
    </div>`;

  return { subject: `New member: ${displayName} · ${planName}`, htmlContent };
}

export interface SignupAlertArgs {
  /** The new member's Supabase user id, used only to make the alert exactly-once. */
  userId: string;
  email: string;
  name?: string | null;
  /** Which front door she came through. */
  signupKind: "trial" | "free";
  /** ISO expiry, trial signups only. */
  trialEndsAt?: string | null;
}

/**
 * Tells the team someone joined WITHOUT paying: the free 7-day trial, or the free tier. These never
 * touch Stripe, so the webhook alert above never fires for them, which is why they were silent.
 *
 * Idempotency reuses the same transactional_emails table and its partial unique index on
 * (stripe_session_id, kind). There is no Stripe session here, so the id column carries a synthetic
 * "signup:<userId>" key instead: one alert per account, permanently, with no new schema. The column
 * name is Stripe-flavoured for historical reasons; treat it as the send's idempotency key.
 */
export async function sendNewSignupAdminAlert(
  admin: SupabaseAdmin,
  args: SignupAlertArgs
): Promise<AdminAlertOutcome> {
  const recipients = adminRecipients();
  if (recipients.length === 0) return { status: "skipped", reason: "no_admin_recipient" };

  const idempotencyKey = `signup:${args.userId}`;
  const { data: prior } = await admin
    .from("transactional_emails")
    .select("id")
    .eq("stripe_session_id", idempotencyKey)
    .eq("kind", SIGNUP_ALERT_KIND)
    .eq("status", "sent")
    .maybeSingle();
  if (prior) return { status: "skipped", reason: "already_sent" };

  const isTrial = args.signupKind === "trial";
  const displayName = cleanName(args.name) || "(no name given)";
  const label = isTrial ? "Free 7-day trial" : "Free account";

  const rows: [string, string][] = [
    ["Name", displayName],
    ["Email", args.email],
    ["Joined on", label],
    ...(isTrial && args.trialEndsAt
      ? ([["Trial ends", new Date(args.trialEndsAt).toUTCString()]] as [string, string][])
      : []),
    ["When", new Date().toISOString()],
  ];

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a1a;line-height:1.6">
      <p style="font-size:17px;font-weight:700;margin:0 0 4px">${isTrial ? "New free trial ✦" : "New free member ✦"}</p>
      <p style="margin:0 0 18px;color:#666">${esc(displayName)} just joined on the ${esc(label.toLowerCase())}.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:520px">
        ${rows
          .map(
            ([l, v]) => `
        <tr>
          <td style="padding:8px 12px 8px 0;border-bottom:1px solid #eee;color:#888;white-space:nowrap;vertical-align:top">${esc(l)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;word-break:break-word">${esc(v)}</td>
        </tr>`
          )
          .join("")}
      </table>
      ${
        isTrial
          ? `<p style="margin:18px 0 0;padding:12px;background:#FFF0F7;border:1px solid #FFC2DE;color:#8A1F52">
               She has full access for 7 days, with no card on file. Nothing will be charged, and her
               access closes on its own.
             </p>`
          : ""
      }
    </div>`;

  const subject = isTrial
    ? `New free trial: ${displayName}`
    : `New free member: ${displayName}`;

  let messageId: string | null = null;
  let lastError = "";
  let anyOk = false;
  for (const to of recipients) {
    const result = await sendBrevoEmail({ to: { email: to }, subject, htmlContent });
    if (result.ok) {
      anyOk = true;
      messageId = messageId ?? result.messageId;
    } else {
      lastError = result.error;
      console.error("admin signup alert failed for a recipient", { to, error: result.error });
    }
  }

  const { error: logError } = await admin.from("transactional_emails").insert({
    email: recipients.join(","),
    kind: SIGNUP_ALERT_KIND,
    stripe_session_id: idempotencyKey,
    status: anyOk ? "sent" : "failed",
    provider: "brevo",
    provider_message_id: messageId,
    error: anyOk ? null : lastError,
  });
  if (logError && logError.code !== "23505") {
    console.error("transactional_emails: signup alert log insert failed", logError.message);
  }

  if (anyOk) {
    console.log("admin signup alert sent", { signupKind: args.signupKind, recipients });
    return { status: "sent", messageId };
  }
  console.error("admin signup alert FAILED (account unaffected)", { email: args.email, error: lastError });
  return { status: "failed", error: lastError };
}

export type AdminAlertOutcome =
  | { status: "sent"; messageId: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

/**
 * Tells the team a new paid member just joined. Best-effort and idempotent per checkout session,
 * called from the Stripe webhook after the membership is stored. NEVER throws: an alerting problem
 * must not fail the webhook, because a failed webhook makes Stripe retry and reads as a payment
 * problem to the buyer.
 */
export async function sendNewMemberAdminAlert(
  admin: SupabaseAdmin,
  args: NewMemberAlertArgs
): Promise<AdminAlertOutcome> {
  const { sessionId, email, priceId, tier, accountClaimed } = args;

  const recipients = adminRecipients();
  if (recipients.length === 0) return { status: "skipped", reason: "no_admin_recipient" };

  // Avoids a duplicate alert on the common retry path; the unique index is the hard backstop.
  const { data: prior } = await admin
    .from("transactional_emails")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .eq("kind", ADMIN_ALERT_KIND)
    .eq("status", "sent")
    .maybeSingle();
  if (prior) return { status: "skipped", reason: "already_sent" };

  const { subject, htmlContent } = buildNewMemberAlert(args);

  // One send per recipient so a single bad address can't take the others down with it. The alert
  // counts as sent if any recipient got it.
  let messageId: string | null = null;
  let lastError = "";
  let anyOk = false;
  for (const to of recipients) {
    const result = await sendBrevoEmail({
      to: { email: to },
      subject,
      htmlContent,
    });
    if (result.ok) {
      anyOk = true;
      messageId = messageId ?? result.messageId;
    } else {
      lastError = result.error;
      console.error("admin new-member alert failed for a recipient", { to, error: result.error });
    }
  }

  const { error: logError } = await admin.from("transactional_emails").insert({
    email: recipients.join(","),
    kind: ADMIN_ALERT_KIND,
    stripe_session_id: sessionId,
    status: anyOk ? "sent" : "failed",
    provider: "brevo",
    provider_message_id: messageId,
    error: anyOk ? null : lastError,
  });
  // 23505 means a concurrent webhook delivery already recorded the 'sent' row, the index working.
  if (logError && logError.code !== "23505") {
    console.error("transactional_emails: admin alert log insert failed", logError.message);
  }

  if (anyOk) {
    console.log("admin new-member alert sent", { sessionId, tier, recipients });
    return { status: "sent", messageId };
  }
  console.error("admin new-member alert FAILED (membership unaffected)", { sessionId, error: lastError });
  return { status: "failed", error: lastError };
}

/**
 * Someone was refused a free trial because her birth details already claimed one.
 *
 * This exists because the guard can be wrong. Date, minute and city is a very specific combination,
 * but it is not unique: twins collide, and so can two strangers who were both born in London and
 * both typed 12:00 because nobody knows their real birth time. A refusal that only ever appeared in
 * a server log would cost a real signup silently, so every one of them comes to the inbox instead,
 * with enough detail to release it by hand.
 *
 * Fire-and-forget, like the other alerts: never allowed to slow down or fail the request.
 */
export async function sendRepeatTrialAlert(args: {
  email: string;
  firstName: string;
  fingerprint: string;
}): Promise<void> {
  const recipients = adminRecipients();
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111;">
      <h2 style="margin: 0 0 12px;">Trial refused: birth details already used</h2>
      <p style="margin: 0 0 16px;">
        <strong>${esc(args.firstName)}</strong> (${esc(args.email)}) tried to start a free trial with
        birth details that have already had one. She was shown the "you already have an account"
        message and pointed at login.
      </p>
      <p style="margin: 0 0 16px;">
        This is usually a second trial on a new email address. It can also be a genuine coincidence:
        two people born on the same date, at the same minute, in the same city. If this one is real,
        delete the matching row and she can sign up straight away:
      </p>
      <pre style="background:#f5f3ff;padding:12px;border-radius:8px;font-size:12px;overflow-x:auto;">delete from trial_fingerprints
where fingerprint = '${esc(args.fingerprint)}';</pre>
    </div>`;

  for (const to of recipients) {
    const result = await sendBrevoEmail({
      to: { email: to },
      subject: `Trial refused (repeat birth details): ${args.email}`,
      htmlContent,
    });
    if (!result.ok) console.error("repeat trial alert failed", { to, error: result.error });
  }
}

