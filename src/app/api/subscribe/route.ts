import { NextRequest, NextResponse } from "next/server";
import { listIdFor, isWaitlistSource } from "@/lib/subscribe-lists";
import { syncContactToSolstral } from "@/lib/solstral";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";

export const runtime = "nodejs";

const BREVO_API = "https://api.brevo.com/v3";
const N8N_WEBHOOK = "https://n8n-production-999ab.up.railway.app/webhook/myszn-waitlist";

// Brevo only stores a custom attribute that already exists on the account, so each one has to be
// ensured before the upsert. Creating an existing attribute returns 400, which is the steady state.
const CHART_ATTRIBUTES: Array<{ name: string; type: "text" | "date" }> = [
  { name: "SIGNUP_SOURCE", type: "text" },
  { name: "SUN_SIGN", type: "text" },
  { name: "MOON_SIGN", type: "text" },
  { name: "RISING_SIGN", type: "text" },
  { name: "DATE_OF_BIRTH", type: "text" },
  { name: "BIRTH_TIME", type: "text" },
  { name: "PLACE_OF_BIRTH", type: "text" },
  // The founding-cohort application (the door alert form on /membership).
  { name: "INSTAGRAM", type: "text" },
  { name: "APPLY_GOAL", type: "text" },
  { name: "APPLY_BLOCK", type: "text" },
];

async function brevo(path: string, opts: RequestInit = {}) {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY not set");
  return fetch(`${BREVO_API}${path}`, {
    ...opts,
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });
}

async function ensureAttribute(name: string, type: string): Promise<void> {
  try {
    const res = await brevo(`/contacts/attributes/normal/${name}`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });
    if (res.ok || res.status === 400) return; // 400 == already exists, the common case
    console.error(`Brevo ensureAttribute ${name} failed`, res.status, (await res.text().catch(() => "")).slice(0, 200));
  } catch (e) {
    console.error(`Brevo ensureAttribute ${name} threw`, e instanceof Error ? e.message : e);
  }
}

// Mirrors listIdFor: the Solstral list for each source, named after its Brevo list so new sign-ups
// join the contacts imported from Brevo. Unknown sources land with the free chart leads, never the waitlist.
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

    let brevoOk = false;
    if (!process.env.BREVO_API_KEY) {
      console.error("subscribe: BREVO_API_KEY not set, contact not filed on any list", { source });
    } else {
      try {
        const listId = listIdFor(source);
        await Promise.all(CHART_ATTRIBUTES.map((a) => ensureAttribute(a.name, a.type)));

        const attributes: Record<string, string> = {};
        if (name) attributes.FIRSTNAME = name.split(" ")[0];
        if (name && name.includes(" ")) attributes.LASTNAME = name.split(" ").slice(1).join(" ");
        if (source) attributes.SIGNUP_SOURCE = source;
        // The chart details the free-chart form already collects. Without these the list is just a
        // pile of email addresses; with them it can be segmented by sign.
        if (sunSign) attributes.SUN_SIGN = sunSign;
        if (moonSign) attributes.MOON_SIGN = moonSign;
        if (risingSign) attributes.RISING_SIGN = risingSign;
        if (dateOfBirth) attributes.DATE_OF_BIRTH = dateOfBirth;
        if (birthTime) attributes.BIRTH_TIME = birthTimeApproximate ? `${birthTime} (approx)` : birthTime;
        if (placeOfBirth) attributes.PLACE_OF_BIRTH = placeOfBirth;
        if (instagram) attributes.INSTAGRAM = String(instagram).slice(0, 200);
        if (why) attributes.APPLY_GOAL = String(why).slice(0, 2000);
        if (block) attributes.APPLY_BLOCK = String(block).slice(0, 2000);

        const res = await brevo("/contacts", {
          method: "POST",
          body: JSON.stringify({
            email,
            attributes,
            listIds: [listId],
            updateEnabled: true,
          }),
        });

        if (res.ok) {
          brevoOk = true;
        } else {
          const err = await res.json().catch(() => ({}));
          if (err.code === "duplicate_parameter") brevoOk = true;
          else console.error("Brevo error:", res.status, JSON.stringify(err).slice(0, 300), { source, listId });
        }
        if (brevoOk) console.log("subscribe: contact filed on Brevo list", { email, source, listId });
      } catch (err) {
        console.error("Brevo error:", err);
      }
    }

    // Same person onto the matching Solstral list, and an alert to Betty for every free birth chart
    // lead (it replaces the Brevo "Notify Admin on List Subscription" automation). Both are
    // fire-and-forget and never throw, so neither can slow down someone seeing her chart.
    const solstralList = solstralListFor(source);
    void syncContactToSolstral({ email, name, list: solstralList }).then((r) => {
      if (!r.ok) console.error("subscribe: solstral sync failed", r.error, { source });
    });
    if (source === "free-chart") void sendChartLeadAlert(email, name, { sunSign, moonSign, risingSign, placeOfBirth });

    if (n8nPromise) await n8nPromise;

    // Still a 200 either way: the free-chart form fires this in the background and must never block
    // someone seeing their chart. brevoOk is returned so a failure is visible rather than silent,
    // which is how the list-name bug went unnoticed for so long.
    return NextResponse.json({ success: true, brevoOk });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Subscription failed" },
      { status: 500 }
    );
  }
}
