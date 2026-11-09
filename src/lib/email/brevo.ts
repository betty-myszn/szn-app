// Server-only. Sends every transactional email through Solstral; Brevo is retired and nothing here
// may call it. The Brevo names on this file and its exports are historical (15 callers use them).
// Resend stays wired to Supabase for auth emails only. These functions NEVER throw: they return a
// result object so a caller (a Stripe webhook) can log a failure without breaking activation.

import { renderTemplate } from "./render-template";

export type BrevoSendResult =
  | { ok: true; messageId: string | null }
  | { ok: false; error: string };

export interface BrevoTemplateEmail {
  to: { email: string; name?: string };
  /** Key of a template in brevo-templates.json, rendered locally. */
  templateId: number;
  /** Values injected into the template, e.g. {{ params.activation_url }}, {{ params.first_name }}. */
  params: Record<string, string>;
  sender?: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
}

// Replies go to the support inbox so a member can just hit reply.
const DEFAULT_SENDER = {
  email: process.env.BREVO_SENDER_EMAIL || "hello@thecosmicco.com",
  name: process.env.BREVO_SENDER_NAME || "Betty from MY SZN",
};

/** A self-contained email whose subject and HTML live in code rather than in a template. */
export interface BrevoRawEmail {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  sender?: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
}

async function postSolstralEmail(msg: {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
}): Promise<BrevoSendResult> {
  const key = process.env.SOLSTRAL_API_KEY;
  if (!key) return { ok: false, error: "SOLSTRAL_API_KEY not set" };
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
  if (!rendered) return { ok: false, error: `email template ${msg.templateId} not found` };
  return postSolstralEmail({ to: msg.to, subject: rendered.subject, html: rendered.html, replyTo: msg.replyTo });
}

export async function sendBrevoEmail(msg: BrevoRawEmail): Promise<BrevoSendResult> {
  return postSolstralEmail({ to: msg.to, subject: msg.subject, html: msg.htmlContent, replyTo: msg.replyTo });
}
