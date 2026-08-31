// The "your free week has ended" email, sent automatically once a trial passes its expiry.
//
// The trial has no scheduled job by design: access expiry is computed at request time, so nothing
// in the app runs at the moment a week is up. That is correct for gating and useless for email,
// because the members most worth reaching are the ones who stopped opening the site. This module
// plus the cron route is the piece that closes that gap.
//
// DESIGN, COPY, SUBJECT AND SENDER LIVE IN BREVO, not here, exactly as the welcome emails do. This
// file decides WHO gets the email and WHETHER they have had it already; Brevo decides what it says.
// Betty can rewrite the copy or the subject line in the Brevo dashboard and it takes effect on the
// next send with no deploy. The trade is that the email body is no longer in version control, which
// is the price of her being able to fix a typo without me.
//
// The rendered HTML that seeded the Brevo template is kept at trial-ended-email.html in the repo
// root for reference. It is NOT what sends, and it will drift the moment the template is edited.

import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoTemplateEmail } from "@/lib/email/brevo";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

export const TRIAL_ENDED_KIND = "trial_ended";

/** Brevo template id, from the environment so the number is not baked into a deploy. Same pattern
 *  as the welcome emails' per-price template ids. */
function templateId(): number | null {
  const raw = process.env.BREVO_TEMPLATE_TRIAL_ENDED?.trim();
  return raw && /^\d+$/.test(raw) ? parseInt(raw, 10) : null;
}

export type TrialEndedOutcome =
  | { status: "sent"; messageId: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

export async function sendTrialEndedEmail(
  admin: SupabaseAdmin,
  member: { userId: string; email: string; name?: string | null }
): Promise<TrialEndedOutcome> {
  const id = templateId();
  if (!id) {
    // Fail loudly rather than silently, matching the welcome path: a missing template id means
    // nobody is being emailed, and that should show up in the run summary rather than looking like
    // a quiet hour with nothing to do.
    return { status: "failed", error: "BREVO_TEMPLATE_TRIAL_ENDED not set" };
  }

  const key = `trial-ended:${member.userId}`;

  // Already sent for this member: stop before touching Brevo.
  const { data: prior, error: priorError } = await admin
    .from("transactional_emails")
    .select("id")
    .eq("stripe_session_id", key)
    .eq("kind", TRIAL_ENDED_KIND)
    .eq("status", "sent")
    .maybeSingle();
  // A failed lookup must NOT be read as "not sent yet": that is how a member gets the same email
  // every hour until someone notices. Skip this run and let the next one decide on real data.
  if (priorError) return { status: "skipped", reason: `lookup failed: ${priorError.message}` };
  if (prior) return { status: "skipped", reason: "already_sent" };

  const firstName = (member.name ?? "").trim().split(/\s+/)[0] || "";
  const result = await sendBrevoTemplateEmail({
    to: { email: member.email, name: member.name ?? undefined },
    templateId: id,
    // Available to the template as {{ params.first_name }} and {{ params.join_url }}. Passed even
    // though the current copy uses neither, so Betty can add a name or change where the button
    // points from inside Brevo without needing a code change to supply the value.
    params: {
      first_name: firstName,
      join_url: "https://itsmyszn.com",
    },
  });

  const { error: logError } = await admin.from("transactional_emails").insert({
    email: member.email,
    kind: TRIAL_ENDED_KIND,
    stripe_session_id: key,
    status: result.ok ? "sent" : "failed",
    provider: "brevo",
    provider_message_id: result.ok ? result.messageId : null,
    error: result.ok ? null : result.error,
  });
  // 23505 means a concurrent run already recorded the 'sent' row, which is the unique index doing
  // its job rather than a fault worth surfacing.
  if (logError && logError.code !== "23505") {
    console.error("transactional_emails: log insert failed", logError.message);
  }

  if (!result.ok) return { status: "failed", error: result.error };
  return { status: "sent", messageId: result.messageId };
}
