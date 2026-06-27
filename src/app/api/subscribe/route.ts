import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BREVO_API = "https://api.brevo.com/v3";
const LIST_NAME = "MY SZN Signups";

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

async function getOrCreateList(): Promise<number> {
  const res = await brevo("/contacts/lists?limit=50&offset=0");
  if (!res.ok) throw new Error("Failed to fetch Brevo lists");
  const data = await res.json();
  const existing = data.lists?.find((l: { name: string }) => l.name === LIST_NAME);
  if (existing) return existing.id;

  const createRes = await brevo("/contacts/lists", {
    method: "POST",
    body: JSON.stringify({ name: LIST_NAME, folderId: 1 }),
  });
  if (!createRes.ok) throw new Error("Failed to create Brevo list");
  const created = await createRes.json();
  return created.id;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source, instagram, why } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const listId = await getOrCreateList();

    const attributes: Record<string, string> = {};
    if (name) attributes.FIRSTNAME = name.split(" ")[0];
    if (name && name.includes(" ")) attributes.LASTNAME = name.split(" ").slice(1).join(" ");
    if (source) attributes.SOURCE = source;
    if (instagram) attributes.INSTAGRAM = instagram;
    if (why) attributes.WHY = why;

    const res = await brevo("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (err.code === "duplicate_parameter") {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      throw new Error(err.message || "Brevo API error");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Subscription failed" },
      { status: 500 }
    );
  }
}
