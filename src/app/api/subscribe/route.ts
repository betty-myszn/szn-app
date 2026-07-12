import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BREVO_API = "https://api.brevo.com/v3";
const LIST_WAITLIST = "MY SZN Signups";
const LIST_CHART = "Free Birth Chart Generator";
const N8N_WEBHOOK = "https://n8n-production-999ab.up.railway.app/webhook/myszn-waitlist";

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

async function getOrCreateList(listName: string): Promise<number> {
  const res = await brevo("/contacts/lists?limit=50&offset=0");
  if (!res.ok) throw new Error("Failed to fetch Brevo lists");
  const data = await res.json();
  const existing = data.lists?.find((l: { name: string }) => l.name === listName);
  if (existing) return existing.id;

  const createRes = await brevo("/contacts/lists", {
    method: "POST",
    body: JSON.stringify({ name: listName, folderId: 1 }),
  });
  if (!createRes.ok) throw new Error("Failed to create Brevo list");
  const created = await createRes.json();
  return created.id;
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
    if (process.env.BREVO_API_KEY) {
      try {
        const listName = source === "free-chart" ? LIST_CHART : LIST_WAITLIST;
        const listId = await getOrCreateList(listName);

        const attributes: Record<string, string> = {};
        if (name) attributes.FIRSTNAME = name.split(" ")[0];
        if (name && name.includes(" ")) attributes.LASTNAME = name.split(" ").slice(1).join(" ");
        if (source) attributes.SOURCE = source;
        if (instagram) attributes.INSTAGRAM = instagram;
        if (why) attributes.WHY = why;
        if (dateOfBirth) attributes.DATE_OF_BIRTH = dateOfBirth;
        if (placeOfBirth) attributes.PLACE_OF_BIRTH = placeOfBirth;
        if (sunSign) attributes.SUN_SIGN = sunSign;
        if (moonSign) attributes.MOON_SIGN = moonSign;
        if (risingSign) attributes.RISING_SIGN = risingSign;

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
          else console.error("Brevo error:", err);
        }
      } catch (err) {
        console.error("Brevo error:", err);
      }
    }

    await n8nPromise;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Subscription failed" },
      { status: 500 }
    );
  }
}
