import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BREVO_API = "https://api.brevo.com/v3";
const N8N_WEBHOOK = "https://n8n-production-999ab.up.railway.app/webhook/myszn-waitlist";

// Brevo list IDs, not names. This used to look the list up by an exact name match and create it if
// nothing matched, which silently sent every free-chart signup nowhere: the code asked for
// "Free Birth Chart Generator" while the real list is called "Free birthchart generator", so the
// match never hit, and whatever happened to the create attempt, list 10 sat on zero contacts while
// the form happily reported success. Ids can't drift on a rename or a capital letter. Same
// canonical-with-env-override shape as the Stripe price map in stripe-tiers.ts, for the same reason.
const CANONICAL_LIST_WAITLIST = 9; // "MY SZN waitlist"
const CANONICAL_LIST_CHART = 10; // "Free birthchart generator"

function listIdFromEnv(v: string | undefined): number | null {
  const t = v?.trim();
  return t && /^\d+$/.test(t) ? parseInt(t, 10) : null;
}

function listIdFor(source: string | undefined): number {
  return source === "free-chart"
    ? listIdFromEnv(process.env.BREVO_LIST_FREE_CHART) ?? CANONICAL_LIST_CHART
    : listIdFromEnv(process.env.BREVO_LIST_WAITLIST) ?? CANONICAL_LIST_WAITLIST;
}

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source, instagram, why, dateOfBirth, birthTime, birthTimeApproximate, placeOfBirth, sunSign, moonSign, risingSign } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const payload = JSON.stringify({
      email, name, source, instagram, why,
      dateOfBirth, birthTime, birthTimeApproximate, placeOfBirth,
      sunSign, moonSign, risingSign,
    });
    const n8nPromise = fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }).catch((err) => console.error("n8n webhook error:", err));

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

    await n8nPromise;

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
