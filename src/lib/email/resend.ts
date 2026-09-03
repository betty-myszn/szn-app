// Server-only. Sends a transactional email through Resend's HTTP API.
//
// Until now Resend was reached only through Supabase, which uses it for auth mail (magic links,
// password resets), while everything the app sends itself went through Brevo. This is the app
// talking to Resend directly for the first time, so it is deliberately small and self-contained:
// one function, no SDK, and it NEVER throws, matching the contract of src/lib/email/brevo.ts so
// callers can swap sender without changing how they handle failure.
//
// Needs RESEND_API_KEY and RESEND_FROM_EMAIL. The from address must be on a domain verified in
// Resend or the send is rejected, which is why there is no default: silently falling back to an
// unverified address would look like a delivery bug rather than a missing setting.

const RESEND_API = "https://api.resend.com/emails";

export type ResendSendResult =
  | { ok: true; messageId: string | null }
  | { ok: false; error: string };

export interface ResendEmail {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  replyTo?: string;
}

/** Whether the app can actually send through Resend right now. Callers use this to decide rather
 *  than attempting a send and reading the failure, so a missing setting is never mistaken for a
 *  delivery problem. */
export function resendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY?.trim() && !!process.env.RESEND_FROM_EMAIL?.trim();
}

function fromHeader(): string {
  const email = process.env.RESEND_FROM_EMAIL!.trim();
  const name = process.env.RESEND_FROM_NAME?.trim() || "Betty from MY SZN";
  return `${name} <${email}>`;
}

export async function sendResendEmail(msg: ResendEmail): Promise<ResendSendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  if (!process.env.RESEND_FROM_EMAIL?.trim()) return { ok: false, error: "RESEND_FROM_EMAIL not set" };

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromHeader(),
        to: [msg.to.name ? `${msg.to.name} <${msg.to.email}>` : msg.to.email],
        subject: msg.subject,
        html: msg.htmlContent,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `resend ${res.status}: ${detail.slice(0, 300)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, messageId: data.id ?? null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
