// Server-only. Sends a transactional email through Brevo's /smtp/email API, reusing the same
// BREVO_API_KEY the waitlist contacts sync in /api/subscribe already uses. In this app Brevo is the
// transactional + marketing sender; Resend stays wired to Supabase for auth emails (magic links,
// password) only. This function NEVER throws: it returns a result object so its caller (a Stripe
// webhook) can log a failure without ever breaking membership activation.

import { renderTemplate } from "./render-template";

const BREVO_API = "https://api.brevo.com/v3";

export type BrevoSendResult =
  | { ok: true; messageId: string | null }
  | { ok: false; error: string };

export interface BrevoTemplateEmail {
  to: { email: string; name?: string };
  /** Numeric id of a Brevo-hosted, branded template. Design/copy live in Brevo, not in code. */
  templateId: number;
  /** Values injected into the template, e.g. {{ params.activation_url }}, {{ params.first_name }}. */
  params: Record<string, string>;
  sender?: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
}

// Sender + reply-to default to the support inbox so a member can just hit reply. Both are
// overridable by env in case the verified Brevo sender differs. The sender domain/address must be
// an authenticated sender in Brevo or the send is rejected.
const DEFAULT_SENDER = {
  email: process.env.BREVO_SENDER_EMAIL || "hello@thecosmicco.com",
  name: process.env.BREVO_SENDER_NAME || "Betty from MY SZN",
};

/**
 * A self-contained email whose subject and HTML live in code rather than in a Brevo template.
 * Used for internal alerts to the team, where the copy is functional, changes with the code that
 * produces it, and nobody needs a designer in Brevo to edit it. Member-facing mail should keep
 * using sendBrevoTemplateEmail so its design stays editable without a deploy.
 */
export interface BrevoRawEmail {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  sender?: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
}

async function postBrevoEmail(key: string, payload: Record<string, unknown>): Promise<BrevoSendResult> {
  try {
    const res = await fetch(`${BREVO_API}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `brevo ${res.status}: ${detail.slice(0, 300)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { messageId?: string };
    return { ok: true, messageId: data.messageId ?? null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// Solstral is the sender now (Brevo ran out of credits, Nov 2026). Every send tries Solstral first and
// only falls back to Brevo if Solstral refuses it, so a Solstral outage or an unverified domain never
// loses an email. Brevo templates are rendered locally from brevo-templates.json for the Solstral path.
// SOLSTRAL_EMAIL=off sends everything through Brevo again without a code change.
async function postSolstralEmail(msg: {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
}): Promise<BrevoSendResult> {
  const key = process.env.SOLSTRAL_API_KEY;
  if (!key || process.env.SOLSTRAL_EMAIL === "off") return { ok: false, error: "solstral email off" };
  try {
    const res = await fetch("https://app.solstral.com/api/v1/transactional/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        to: msg.to.email,
        subject: msg.subject,
        html: msg.html,
        replyTo: (msg.replyTo ?? DEFAULT_SENDER).email,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; messageId?: string; ok?: boolean };
    if (!res.ok || data.ok === false) {
      return { ok: false, error: `solstral ${res.status}: ${JSON.stringify(data).slice(0, 300)}` };
    }
    return { ok: true, messageId: data.messageId ?? data.id ?? null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function sendBrevoTemplateEmail(msg: BrevoTemplateEmail): Promise<BrevoSendResult> {
  const rendered = renderTemplate(msg.templateId, msg.params);
  if (rendered) {
    const viaSolstral = await postSolstralEmail({
      to: msg.to,
      subject: rendered.subject,
      html: rendered.html,
      replyTo: msg.replyTo,
    });
    if (viaSolstral.ok) return viaSolstral;
    console.error("email: Solstral send failed, falling back to Brevo", viaSolstral.error, { templateId: msg.templateId });
  }

  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: false, error: "BREVO_API_KEY not set" };

  return postBrevoEmail(key, {
    sender: msg.sender ?? DEFAULT_SENDER,
    replyTo: msg.replyTo ?? DEFAULT_SENDER,
    to: [msg.to],
    templateId: msg.templateId,
    params: msg.params,
  });
}

export async function sendBrevoEmail(msg: BrevoRawEmail): Promise<BrevoSendResult> {
  const viaSolstral = await postSolstralEmail({
    to: msg.to,
    subject: msg.subject,
    html: msg.htmlContent,
    replyTo: msg.replyTo,
  });
  if (viaSolstral.ok) return viaSolstral;
  console.error("email: Solstral send failed, falling back to Brevo", viaSolstral.error, { subject: msg.subject });

  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: false, error: "BREVO_API_KEY not set" };

  return postBrevoEmail(key, {
    sender: msg.sender ?? DEFAULT_SENDER,
    replyTo: msg.replyTo ?? DEFAULT_SENDER,
    to: [msg.to],
    subject: msg.subject,
    htmlContent: msg.htmlContent,
  });
}
