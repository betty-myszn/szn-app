import { sendBrevoEmail, sendBrevoTemplateEmail, type BrevoSendResult } from "@/lib/email/brevo";
import { resendConfigured, sendResendEmail } from "@/lib/email/resend";

// The nudge that goes out when someone is welcomed in the community chat. The in-app bell only
// works on someone who comes back on her own; this is what reaches a new member who has not opened
// the app since she signed up, which is exactly the person the welcome was written for.
//
// Sender, in order of preference:
//   1. Resend, when RESEND_API_KEY and RESEND_FROM_EMAIL are both set. Betty asked for this one.
//   2. A Brevo template, when BREVO_TEMPLATE_COMMUNITY_WELCOME names one, so the design can change
//      without a deploy.
//   3. The small branded email below, through Brevo, so the feature works with nothing configured.
//
// Falling back rather than failing is the point: the message is already posted in the chat by the
// time this runs, and a missing environment variable must not turn that into a silent dead end.
// Worth knowing that this is the first app-sent mail to go through Resend at all; everything else
// the app sends is Brevo, and Resend was previously reached only by Supabase for auth mail.

const ROOM_URL = "https://itsmyszn.com/community/room/general";

export interface CommunityWelcomeEmail {
  email: string;
  name: string | null;
  /** The chat message she was named in, so the email shows her the actual thing that happened. */
  message: string;
}

function html(firstName: string, message: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F0FF;font-family:'DM Sans',Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0FF;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:2px solid #1a1a1a;">
        <tr><td style="background:#1a1a1a;padding:16px 32px;font-family:Poppins,Arial,sans-serif;font-size:16px;font-weight:800;letter-spacing:2px;color:#ffffff;text-transform:lowercase;">my szn</td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0 0 16px;font-family:Poppins,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
            ${escapeHtml(firstName)}, you got tagged in the chat 💜
          </p>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">
            Betty just welcomed you into the MY SZN community chat, and the girls are waiting to hear your Big 3.
          </p>
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0FF;border:2px solid #1a1a1a;">
            <tr><td style="padding:20px 22px;font-size:15.5px;line-height:1.7;">${escapeHtml(message)}</td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:0 32px 34px;">
          <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
            <td style="background:#FF2D87;border:2px solid #1a1a1a;">
              <a href="${ROOM_URL}" style="display:inline-block;font-family:Poppins,Arial,sans-serif;font-size:15px;font-weight:800;letter-spacing:0.5px;color:#ffffff;text-decoration:none;padding:16px 38px;">GO SAY HI &rarr;</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td align="center" style="background:#1a1a1a;padding:22px 32px;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.5);">
          You&rsquo;re getting this because you were tagged in the MY SZN community chat.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// The message and her name both come from member-entered data and land inside markup, so they are
// escaped rather than trusted. A name containing a tag would otherwise rewrite the email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Never throws: a mail problem must not fail the run that already posted the message. */
/** The provider is reported back so a test send can prove which one actually delivered, rather
 *  than a silent fallback to Brevo looking exactly like a working Resend setup. */
export type CommunityWelcomeSendResult =
  | { ok: true; provider: "resend" | "brevo"; messageId: string | null }
  | { ok: false; provider: "resend" | "brevo" | "none"; error: string };

export async function sendCommunityWelcomeEmail(
  msg: CommunityWelcomeEmail
): Promise<CommunityWelcomeSendResult> {
  const firstName = (msg.name ?? "").trim().split(/\s+/)[0] || "babe";
  try {
    if (resendConfigured()) {
      const sent = await sendResendEmail({
        to: { email: msg.email, name: msg.name ?? undefined },
        subject: `${firstName}, you got tagged in the MY SZN chat 💜`,
        htmlContent: html(firstName, msg.message),
      });
      // A Resend failure falls through to Brevo rather than dropping the email, since the member
      // has already been told in the chat that Betty is talking to her.
      if (sent.ok) return { ok: true, provider: "resend", messageId: sent.messageId };
      console.error("community welcome: resend failed, falling back to brevo", sent.error);
    }

    const templateId = process.env.BREVO_TEMPLATE_COMMUNITY_WELCOME?.trim();
    const viaBrevo: BrevoSendResult =
      templateId && /^\d+$/.test(templateId)
        ? await sendBrevoTemplateEmail({
            to: { email: msg.email, name: msg.name ?? undefined },
            templateId: parseInt(templateId, 10),
            params: { first_name: firstName, chat_message: msg.message, room_url: ROOM_URL },
          })
        : await sendBrevoEmail({
            to: { email: msg.email, name: msg.name ?? undefined },
            subject: `${firstName}, you got tagged in the MY SZN chat 💜`,
            htmlContent: html(firstName, msg.message),
          });
    return viaBrevo.ok
      ? { ok: true, provider: "brevo", messageId: viaBrevo.messageId }
      : { ok: false, provider: "brevo", error: viaBrevo.error };
  } catch (e) {
    return { ok: false, provider: "none", error: e instanceof Error ? e.message : String(e) };
  }
}
