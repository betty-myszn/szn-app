// The one email shell every member notification uses. Kept deliberately plain: it exists to carry
// a headline, what was said, and a way back into the app, so a new kind of notification never needs
// a new template built before it can email anyone.

export interface NotificationEmailParts {
  firstName: string;
  heading: string;
  body: string | null;
  link: string | null;
  cta: string;
}

const SITE = "https://itsmyszn.com";

// Everything interpolated here comes from member-entered text (names, chat messages), so it is
// escaped rather than trusted. A name containing a tag would otherwise rewrite the email.
function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function notificationEmail(parts: NotificationEmailParts): string {
  const url = parts.link ? (parts.link.startsWith("http") ? parts.link : `${SITE}${parts.link}`) : SITE;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F0FF;font-family:'DM Sans',Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0FF;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:2px solid #1a1a1a;">
        <tr><td style="background:#1a1a1a;padding:16px 32px;font-family:Poppins,Arial,sans-serif;font-size:16px;font-weight:800;letter-spacing:2px;color:#ffffff;text-transform:lowercase;">my szn</td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0 0 14px;font-family:Poppins,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
            ${esc(parts.heading)}
          </p>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">Hey ${esc(parts.firstName)} 💜</p>
        </td></tr>
        ${
          parts.body
            ? `<tr><td style="padding:0 32px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0FF;border:2px solid #1a1a1a;">
            <tr><td style="padding:20px 22px;font-size:15.5px;line-height:1.7;">${esc(parts.body)}</td></tr>
          </table>
        </td></tr>`
            : ""
        }
        <tr><td align="center" style="padding:0 32px 34px;">
          <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
            <td style="background:#FF2D87;border:2px solid #1a1a1a;">
              <a href="${url}" style="display:inline-block;font-family:Poppins,Arial,sans-serif;font-size:15px;font-weight:800;letter-spacing:0.5px;color:#ffffff;text-decoration:none;padding:16px 38px;">${esc(parts.cta)} &rarr;</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td align="center" style="background:#1a1a1a;padding:22px 32px;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.5);">
          You&rsquo;re getting this because of activity in your MY SZN membership.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
