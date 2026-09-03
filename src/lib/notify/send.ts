import type { createAdminClient } from "@/lib/supabase/admin";
import { sendResendEmail, resendConfigured } from "@/lib/email/resend";
import { notificationEmail } from "@/lib/notify/email-template";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// The one way MY SZN tells a member something happened.
//
// Every event that should reach a member goes through here: a welcome, a chat mention, a reply, a
// message from Betty. One call creates the in-app notification and, when the event warrants it,
// sends the email, so there is a single place that decides how a member is reached rather than
// welcome logic in one file, mention logic in a database trigger, and a mail provider chosen
// separately in each.
//
// RECIPIENTS ARE USER IDS. Never a name. Names collide (three members called Sarah, one of them
// "Sarah Elizabeth"), and matching on them is what sent a welcome notification to two strangers and
// none to the person it was written for. A name is for display inside the message and nothing else.
//
// EMAIL IS RESEND, WITH NO FALLBACK. A silent switch to another provider makes a broken
// configuration look identical to a working one, so a failure here is logged loudly and reported
// back to the caller instead.

export type NotificationKind = "welcome" | "mention" | "reply" | "admin";

export interface MemberNotification {
  /** Who is being told. The source of truth, always. */
  userId: string;
  kind: NotificationKind;
  /** Bell headline, e.g. "betty welcomed you in the chat". */
  title: string;
  /** Bell body and the quoted block in the email. */
  body?: string | null;
  /** Where tapping it goes, e.g. /community/room/general. */
  link?: string | null;
  /** Display name of whoever caused it. */
  actor?: string | null;
  /** Send the email as well as the bell. */
  email?: boolean;
  /** Subject line, when emailing. Defaults to the title. */
  emailSubject?: string;
  /** Button text in the email. */
  emailCta?: string;
}

export interface NotificationResult {
  userId: string;
  notified: boolean;
  emailed: boolean;
  error?: string;
}

/** Sends one member one notification, and optionally the email that goes with it. Never throws: a
 *  notification problem must not fail the thing that caused it. */
export async function sendMemberNotification(
  admin: SupabaseAdmin,
  n: MemberNotification
): Promise<NotificationResult> {
  const result: NotificationResult = { userId: n.userId, notified: false, emailed: false };

  const { error } = await admin.from("notifications").insert({
    user_id: n.userId,
    type: n.kind,
    title: n.title,
    body: n.body ? n.body.slice(0, 140) : null,
    link: n.link ?? null,
    actor: n.actor ?? null,
  });
  if (error) {
    result.error = `notification: ${error.message}`;
    console.error("notify: could not create in-app notification", n.userId, n.kind, error.message);
  } else {
    result.notified = true;
  }

  if (!n.email) return result;

  // The address is read from the profile by id, so an email can never be sent to whoever happens to
  // share a display name with the intended member.
  const { data: profile } = await admin.from("profiles").select("email, name").eq("id", n.userId).maybeSingle();
  const address = (profile?.email as string | null) ?? null;
  if (!address) {
    result.error = [result.error, "no email on profile"].filter(Boolean).join("; ");
    console.error("notify: no email on profile, cannot send", n.userId, n.kind);
    return result;
  }

  if (!resendConfigured()) {
    result.error = [result.error, "resend not configured"].filter(Boolean).join("; ");
    console.error("notify: RESEND_API_KEY / RESEND_FROM_EMAIL not set, email NOT sent", n.userId, n.kind);
    return result;
  }

  const firstName = ((profile?.name as string | null) ?? "").trim().split(/\s+/)[0] || "babe";
  const sent = await sendResendEmail({
    to: { email: address, name: (profile?.name as string | null) ?? undefined },
    subject: n.emailSubject ?? n.title,
    htmlContent: notificationEmail({
      firstName,
      heading: n.title,
      body: n.body ?? null,
      link: n.link ?? null,
      cta: n.emailCta ?? "OPEN MY SZN",
    }),
  });

  if (sent.ok) {
    result.emailed = true;
  } else {
    result.error = [result.error, sent.error].filter(Boolean).join("; ");
    console.error("notify: resend send FAILED, no fallback attempted", n.userId, n.kind, sent.error);
  }
  return result;
}

/** The same, for a list of members. Sequential, because these are small groups and a burst of
 *  parallel sends is how an API key gets rate limited. */
export async function sendMemberNotifications(
  admin: SupabaseAdmin,
  notifications: readonly MemberNotification[]
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = [];
  for (const n of notifications) results.push(await sendMemberNotification(admin, n));
  return results;
}
