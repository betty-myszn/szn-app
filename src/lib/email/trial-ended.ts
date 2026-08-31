// The "your free week has ended" email, sent automatically once a trial passes its expiry.
//
// The trial itself has no scheduled job by design: access expiry is computed at request time, so
// nothing in the app runs at the moment a week is up. That is correct for gating and useless for
// email, because the members most worth reaching are the ones who stopped opening the site. This
// module plus the cron route is the piece that closes that gap.
//
// Idempotency reuses transactional_emails exactly as the welcome email and the admin alerts do,
// with a synthetic key (trial-ended:<userId>) standing in for a Stripe session, so a cron that runs
// twice, or a deploy that overlaps a run, cannot send anyone this email a second time.

import type { createAdminClient } from "@/lib/supabase/admin";
import { sendBrevoEmail } from "@/lib/email/brevo";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

export const TRIAL_ENDED_KIND = "trial_ended";
export const TRIAL_ENDED_SUBJECT = "your MY SZN trial has ended \u{1F49C}";

/** The email body. Static: the copy is Betty's, and nothing in it is personalised, so there is no
 *  merge field to get wrong and no way for a bad name value to land in someone's inbox. */
export const TRIAL_ENDED_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Your MY SZN free trial has ended</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Poppins:wght@700;800&display=swap');
  body{margin:0;padding:0;background:#F4F0FF;-webkit-text-size-adjust:100%;}
  img{border:0;line-height:100%;outline:none;text-decoration:none;display:block;}
  a{text-decoration:none;}
  .disp{font-family:'Poppins',Arial,sans-serif !important;}
  .body-font{font-family:'DM Sans',Arial,sans-serif !important;}
  @media (max-width:620px){
    .container{width:100% !important;}
    .px{padding-left:22px !important;padding-right:22px !important;}
    .h1{font-size:30px !important;line-height:1.1 !important;}
    .perk{font-size:15px !important;}
    .price{font-size:44px !important;}
  }
</style>
</head>
<body class="body-font" style="margin:0;padding:0;background:#F4F0FF;font-family:'DM Sans',Arial,sans-serif;color:#1a1a1a;">

  <!-- preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F4F0FF;font-size:1px;line-height:1px;">
    Your $88 founding price is held until 10 September. After that it goes to $111 a month.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0FF;">
    <tr>
      <td align="center" style="padding:28px 12px;">

        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:2px solid #1a1a1a;">

          <!-- wordmark bar -->
          <tr>
            <td class="px" style="background:#1a1a1a;padding:16px 32px;border-bottom:2px solid #1a1a1a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:16px;font-weight:800;letter-spacing:2px;color:#ffffff;text-transform:lowercase;">my szn</td>
                  <td align="right" style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;color:#C8B4F8;text-transform:uppercase;">virgo szn</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- hero -->
          <tr>
            <td class="px" align="center" style="background:#1a1a1a;padding:38px 32px 42px;border-bottom:2px solid #1a1a1a;">
              <div style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:#FF2D87;text-transform:uppercase;margin-bottom:14px;">your 7 days are up</div>
              <h1 class="disp h1" style="margin:0;font-family:'Poppins',Arial,sans-serif;font-size:38px;line-height:1.1;font-weight:800;letter-spacing:-1px;color:#ffffff;text-transform:lowercase;">
                this is only<br><span style="color:#FF2D87;">the beginning.</span>
              </h1>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td class="px" style="padding:34px 40px 6px;">
              <p class="disp" style="margin:0 0 18px;font-family:'Poppins',Arial,sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.3px;color:#1a1a1a;">
                Hey my love,
              </p>
              <p style="margin:0 0 18px;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                Your 7-day MY SZN free trial has officially come to an end &#128156;
              </p>
              <p style="margin:0 0 18px;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                I hope you&rsquo;ve had a chance to explore your portal, watch the workshops, dive into your astrology and get a feel for what we&rsquo;re building inside MY SZN.
              </p>
              <p class="disp" style="margin:0 0 18px;font-family:'Poppins',Arial,sans-serif;font-size:18px;line-height:1.5;font-weight:800;letter-spacing:-0.3px;color:#FF2D87;">
                Because this is only the beginning.
              </p>
              <p style="margin:0 0 18px;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                Every new astrology season, we focus on a different part of your life, with new workshops, coaching, astro tapping, journal prompts and deeper work designed to help you make more $$$, become more of yourself and create a life you actually LOVE.
              </p>
            </td>
          </tr>

          <!-- virgo szn callout -->
          <tr>
            <td class="px" style="padding:8px 40px 26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0FF;border:2px solid #1a1a1a;">
                <tr>
                  <td style="padding:22px 24px;">
                    <div class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;color:#FF2D87;text-transform:uppercase;margin-bottom:10px;">right now</div>
                    <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                      We&rsquo;re in <strong>Virgo SZN</strong>, working on your habits, standards, goals and actually getting your sh*t together instead of endlessly thinking about everything you want to change &#128514;
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- next workshop -->
          <tr>
            <td class="px" style="padding:0 40px 30px;">
              <div class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;color:#FF2D87;text-transform:uppercase;margin-bottom:12px;">next up inside my szn</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #1a1a1a;">
                <tr>
                  <td style="font-size:0;line-height:0;">
                    <a href="https://itsmyszn.com"><img src="https://itsmyszn.com/virgo-workshop-cover.jpg" width="516" alt="Virgo Season: Get Your Sh*t Together &amp; Become Her" style="width:100%;max-width:516px;height:auto;display:block;"></a>
                  </td>
                </tr>
                <tr>
                  <td style="background:#1a1a1a;padding:22px 24px;">
                    <div class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:19px;line-height:1.25;font-weight:800;letter-spacing:-0.3px;color:#ffffff;margin-bottom:10px;">
                      Virgo Season: Get Your Sh*t Together &amp; Become Her
                    </div>
                    <div style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#C8B4F8;text-transform:uppercase;margin-bottom:12px;">
                      10 september &middot; 7pm la time &middot; live on zoom
                    </div>
                    <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.85);">
                      Close the gap between meaning to, and getting it done. Real astrology, tapping and embodiment work, for the woman who is done waiting to feel ready. Join before this night and your founding price is locked.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- perks -->
          <tr>
            <td class="px" style="padding:0 40px 6px;">
              <p class="disp" style="margin:0 0 18px;font-family:'Poppins',Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.3px;color:#1a1a1a;">
                When you become a member, you get:
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:0 0 13px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" valign="top" style="font-size:17px;line-height:1.5;">&#129689;</td>
                    <td class="perk" style="font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a;">Your personalised MY SZN portal based on your birth chart</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:0 0 13px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" valign="top" style="font-size:17px;line-height:1.5;">&#129680;</td>
                    <td class="perk" style="font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a;">New workshops every astrology season</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:0 0 13px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" valign="top" style="font-size:17px;line-height:1.5;">&#128156;</td>
                    <td class="perk" style="font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a;">Live astro tapping with me</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:0 0 13px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" valign="top" style="font-size:17px;line-height:1.5;">&#10024;</td>
                    <td class="perk" style="font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a;">Journals, prompts + deeper shadow work</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:0 0 13px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" valign="top" style="font-size:17px;line-height:1.5;">&#128133;</td>
                    <td class="perk" style="font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a;">The MY SZN community + chat rooms</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:0 0 22px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" valign="top" style="font-size:17px;line-height:1.5;">&#128184;</td>
                    <td class="perk" style="font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a;">Coaching around your life, money, confidence, visibility + becoming the version of you who actually makes the moves</td>
                  </tr></table>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- founding member price -->
          <tr>
            <td class="px" style="padding:6px 40px 26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FF2D87;border:2px solid #1a1a1a;">
                <tr>
                  <td align="center" style="padding:26px 24px 8px;">
                    <div class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;color:#1a1a1a;text-transform:uppercase;">founding member price</div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 24px 4px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                      <tr>
                        <td valign="bottom" style="padding-right:12px;">
                          <span class="disp price" style="font-family:'Poppins',Arial,sans-serif;font-size:52px;line-height:1;font-weight:800;letter-spacing:-2px;color:#1a1a1a;">$88</span>
                        </td>
                        <td valign="bottom" style="padding-bottom:8px;">
                          <span class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:22px;line-height:1;font-weight:800;color:rgba(26,26,26,0.45);text-decoration:line-through;">$111</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:6px 24px 4px;">
                    <div style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;font-weight:700;color:#1a1a1a;">a month, which is about <strong>$20 a week</strong></div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:14px 26px 26px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="background:#1a1a1a;">
                      <tr><td class="disp" style="padding:9px 18px;font-family:'Poppins',Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:1.5px;color:#ffffff;text-transform:uppercase;">save 21% &middot; held until 10 september</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- price copy -->
          <tr>
            <td class="px" style="padding:0 40px 8px;">
              <p style="margin:0 0 18px;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                Your founding price is held until <strong>10 September</strong>, the night of the Virgo workshop. After that it goes to <strong>$111 USD a month</strong>. If you join at <strong>$88</strong> before then, you stay at $88 for as long as you&rsquo;re a member, even after the price rises for everybody else.
              </p>
              <p style="margin:0 0 18px;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                That is <strong>21% less every single month</strong>, which is $23 a month and <strong>$276 a year</strong> that stays in your pocket, for as long as you stay.
              </p>
              <p style="margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                If you loved your week with us, I&rsquo;d LOOOOOVE to have you stay for the next SZN.
              </p>
            </td>
          </tr>

          <!-- cta -->
          <tr>
            <td class="px" align="center" style="padding:22px 40px 36px;">
              <div class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:15px;font-weight:800;color:#1a1a1a;margin-bottom:16px;">Join MY SZN here:</div>
              <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="background:#FF2D87;border:2px solid #1a1a1a;">
                    <a href="https://itsmyszn.com" class="disp" style="display:inline-block;font-family:'Poppins',Arial,sans-serif;font-size:15px;font-weight:800;letter-spacing:0.5px;color:#ffffff;padding:16px 38px;">Lock in $88 forever</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-family:'DM Sans',Arial,sans-serif;font-size:13px;line-height:1.6;color:#6b6b6b;">
                <a href="https://itsmyszn.com" style="color:#6b6b6b;text-decoration:underline;">itsmyszn.com</a>
              </p>
            </td>
          </tr>

          <!-- signoff -->
          <tr>
            <td class="px" style="padding:0 40px 36px;">
              <p style="margin:0 0 6px;font-family:'DM Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
                See you inside &#128156;
              </p>
              <p class="disp" style="margin:0;font-family:'Poppins',Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.3px;color:#1a1a1a;">
                Betty xx
              </p>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td class="px" align="center" style="background:#1a1a1a;padding:26px 40px;">
              <div class="disp" style="font-family:'Poppins',Arial,sans-serif;font-size:14px;font-weight:800;letter-spacing:2px;color:#ffffff;text-transform:lowercase;margin-bottom:8px;">my szn</div>
              <p style="margin:0 0 10px;font-family:'DM Sans',Arial,sans-serif;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.6);">Astrology &amp; Human Design, made personal.</p>
              <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.45);">
                You&rsquo;re getting this because you started a free trial of MY SZN.
                <a href="mailto:hello@thecosmicco.com?subject=unsubscribe" style="color:#C8B4F8;text-decoration:underline;">unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

export type TrialEndedOutcome =
  | { status: "sent"; messageId: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

export async function sendTrialEndedEmail(
  admin: SupabaseAdmin,
  member: { userId: string; email: string }
): Promise<TrialEndedOutcome> {
  const key = `trial-ended:${member.userId}`;

  // Already sent (or already tried and succeeded) for this member: stop before touching Brevo.
  const { data: prior, error: priorError } = await admin
    .from("transactional_emails")
    .select("id")
    .eq("stripe_session_id", key)
    .eq("kind", TRIAL_ENDED_KIND)
    .eq("status", "sent")
    .maybeSingle();
  // A failed lookup must NOT be treated as "not sent yet": that is how a member gets the same email
  // every hour until someone notices. Skip this run and let the next one decide with real data.
  if (priorError) return { status: "skipped", reason: `lookup failed: ${priorError.message}` };
  if (prior) return { status: "skipped", reason: "already_sent" };

  const result = await sendBrevoEmail({
    to: { email: member.email },
    subject: TRIAL_ENDED_SUBJECT,
    htmlContent: TRIAL_ENDED_HTML,
  });

  const { error: logError } = await admin.from("transactional_emails").insert({
    email: member.email,
    kind: TRIAL_ENDED_KIND,
    stripe_session_id: key,
    status: result.ok ? "sent" : "failed",
    provider: "brevo",
    provider_message_id: result.ok ? result.messageId : null,
  });
  if (logError) console.error("trial-ended: log insert failed", logError.message);

  if (!result.ok) return { status: "failed", error: result.error };
  return { status: "sent", messageId: result.messageId };
}
