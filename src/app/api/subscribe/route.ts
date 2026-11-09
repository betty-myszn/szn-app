import { NextRequest, NextResponse } from "next/server";
import { isWaitlistSource } from "@/lib/subscribe-lists";
import { syncContactToSolstral } from "@/lib/solstral";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";

export const runtime = "nodejs";

const N8N_WEBHOOK = "https://n8n-production-999ab.up.railway.app/webhook/myszn-waitlist";

// The Solstral list for each source, named so new sign-ups join the contacts imported earlier. Unknown sources land with the free chart leads, never the waitlist.
function solstralListFor(source: string | undefined): string {
  if (source === "money-blueprint") return "Money Blueprint";
  if (isWaitlistSource(source)) return "MY SZN waitlist";
  return "Free birthchart generator";
}

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendChartLeadAlert(
  email: string,
  name: string | undefined,
  chart: { sunSign?: string; moonSign?: string; risingSign?: string; placeOfBirth?: string }
) {
  const big3 = [chart.sunSign && `${chart.sunSign} Sun`, chart.moonSign && `${chart.moonSign} Moon`, chart.risingSign && `${chart.risingSign} Rising`]
    .filter(Boolean)
    .join(", ");
  const htmlContent = `<p>Someone new just made their free birth chart 🪐</p>
<p><strong>Name:</strong> ${esc(name || "(not given)")}<br><strong>Email:</strong> ${esc(email)}${big3 ? `<br><strong>Chart:</strong> ${esc(big3)}` : ""}${chart.placeOfBirth ? `<br><strong>Born in:</strong> ${esc(chart.placeOfBirth)}` : ""}</p>`;
  for (const to of adminRecipients()) {
    const r = await sendBrevoEmail({ to: { email: to }, subject: `🪐 New free birth chart: ${name || email}`, htmlContent, replyTo: { email, name: name || undefined } });
    if (!r.ok) console.error("subscribe: chart lead alert failed", { to, error: r.error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source, instagram, why, block, dateOfBirth, birthTime, birthTimeApproximate, placeOfBirth, sunSign, moonSign, risingSign } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const payload = JSON.stringify({
      email, name, source, instagram, why,
      dateOfBirth, birthTime, birthTimeApproximate, placeOfBirth,
      sunSign, moonSign, risingSign,
    });
    // The n8n workflow behind this URL is the waitlist one: it files EVERYONE it receives onto the
    // waitlist regardless of the payload's source. So it must fire ONLY for a genuine waitlist
    // submission, never for a free tool lead. It previously fired for every source except two, which
    // (together with the list default) is how free-chart and free Human Design leads landed on the
    // waitlist. Gated on the same allowlist as the list choice so the two can never disagree.
    const n8nPromise = isWaitlistSource(source)
      ? fetch(N8N_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        }).catch((err) => console.error("n8n webhook error:", err))
      : null;

    // Same person onto the matching Solstral list, and an alert to Betty for every free birth chart
    // lead. Both are
    // fire-and-forget and never throw, so neither can slow down someone seeing her chart.
    const solstralList = solstralListFor(source);
    void syncContactToSolstral({ email, name, list: solstralList }).then((r) => {
      if (!r.ok) console.error("subscribe: solstral sync failed", r.error, { source });
    });
    if (source === "free-chart") void sendChartLeadAlert(email, name, { sunSign, moonSign, risingSign, placeOfBirth });

    if (n8nPromise) await n8nPromise;

    // Always a 200: the free-chart form fires this in the background and must never block someone
    // seeing their chart.
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Subscription failed" },
      { status: 500 }
    );
  }
}
