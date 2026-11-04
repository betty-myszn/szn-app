// Server-only. Mirrors MY SZN people into the Solstral CRM (app.solstral.com) alongside Brevo:
// every free signup, trial signup and Stripe checkout becomes one Solstral contact (matched by
// email, never duplicated), filed on a list per kind, and every purchase lands on her timeline as
// an "Order Completed" event.
//
// Upsert is done by hand because Solstral has none: records.find_by_email, then PATCH the match or
// POST a new contact. The per-workspace inbound webhook (whk_...) is deliberately NOT used, it
// creates a fresh contact on every call, so a repeat buyer would be duplicated.
//
// NEVER throws: a CRM hiccup must never fail a signup or the Stripe webhook, so callers get a
// result object. No-ops when SOLSTRAL_API_KEY is not set (local dev, previews).

const SOLSTRAL_API = "https://app.solstral.com/api/v1";

export const SOLSTRAL_LISTS = {
  free: "MY SZN Free members",
  trial: "MY SZN Free trial",
  buyers: "MY SZN Buyers",
} as const;
type SolstralListKey = keyof typeof SOLSTRAL_LISTS;
// A key above, or any list's exact name (waitlists and the free chart reuse the names the Brevo
// import created, so new sign-ups land on the same lists as the imported contacts).
export type SolstralList = SolstralListKey | (string & {});

// Each waitlist offer's Solstral list, named after its Brevo list so imported and new sign-ups share one.
export const SOLSTRAL_WAITLIST_LISTS: Record<string, string> = {
  mastermind: "🪐 MY SZN Mastermind waitlist",
  "rich-btch-rising": "💸 Rich B*tch Rising report",
  "bad-btch-report": "baddie report",
  "baddie-coven": "coven waitlist",
  "baddie-coven-la": "LA coven (IRL) waitlist",
  retreat: "🌴 The Bad B*tch Retreat",
  book: "MY SZN Book waitlist",
};

export type SolstralResult = { ok: true; recordId: string } | { ok: false; error: string };

async function solstral(path: string, body?: unknown, method = "POST") {
  const key = process.env.SOLSTRAL_API_KEY;
  if (!key) throw new Error("SOLSTRAL_API_KEY not set");
  const res = await fetch(`${SOLSTRAL_API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) {
    throw new Error(`solstral ${method} ${path} ${res.status}: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data;
}

// List ids are looked up by name once per process and cached; a missing list is created, so a
// rename in Solstral just means a new list appears rather than everyone being filed nowhere.
const listIds = new Map<string, Promise<string>>();

function listId(list: SolstralList): Promise<string> {
  const name = SOLSTRAL_LISTS[list as SolstralListKey] ?? list;
  let pending = listIds.get(name);
  if (!pending) {
    pending = (async () => {
      const found = await solstral("/actions/lists.list", {});
      // Solstral treats list names case-insensitively, so the match has to as well.
      const existing = found.data?.lists?.find(
        (l: { name: string; id: string }) => l.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) return existing.id as string;
      const created = await solstral("/actions/lists.create", {
        name,
        kind: "STATIC",
        objectSlug: "contact",
        emailField: "email",
      });
      return (created.data?.id ?? created.data?.list?.id) as string;
    })();
    pending.catch(() => listIds.delete(name)); // retry the lookup next time rather than cache a failure
    listIds.set(name, pending);
  }
  return pending;
}

async function upsertContact(email: string, name?: string | null): Promise<string> {
  const values: Record<string, string> = { email };
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts[0]) values.firstName = parts[0];
  if (parts.length > 1) values.lastName = parts.slice(1).join(" ");

  const found = await solstral("/actions/records.find_by_email", { email });
  const match = found.data?.records?.find((r: { object: string }) => r.object === "contact");
  if (match) {
    await solstral(`/objects/contact/${match.id}`, { values }, "PATCH");
    return match.id as string;
  }
  const created = await solstral("/objects/contact", { values });
  return created.id as string;
}

export interface SolstralContact {
  email: string | null | undefined;
  name?: string | null;
  list: SolstralList;
}

// Creates or updates the contact by email and adds her to the list for how she joined. Buyers are
// filed as soft opt-in (she bought, she didn't tick a box); free and trial signups as opt-in.
export async function syncContactToSolstral(contact: SolstralContact): Promise<SolstralResult> {
  if (!process.env.SOLSTRAL_API_KEY) return { ok: false, error: "SOLSTRAL_API_KEY not set" };
  const email = contact.email?.trim().toLowerCase();
  if (!email) return { ok: false, error: "no_email" };

  try {
    const recordId = await upsertContact(email, contact.name);
    await solstral("/actions/lists.add_members", {
      listId: await listId(contact.list),
      recordIds: [recordId],
      consentBasis: contact.list === "buyers" ? "soft_opt_in" : "opt_in",
    });
    console.log("solstral contact synced", { email, list: contact.list, recordId });
    return { ok: true, recordId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export interface SolstralOrder {
  email: string | null | undefined;
  name?: string | null;
  checkoutSessionId: string; // the event's messageId, so a Stripe retry never logs the order twice
  product: string | null;
  amount: number | null; // in the currency's major unit, e.g. 88 for $88
  currency: string | null;
}

// Upserts the buyer onto the Buyers list, then logs the purchase on her Solstral timeline. The
// contact must exist first: Solstral never creates a contact from an event.
export async function trackOrderInSolstral(order: SolstralOrder): Promise<SolstralResult> {
  const synced = await syncContactToSolstral({ email: order.email, name: order.name, list: "buyers" });
  if (!synced.ok) return synced;

  try {
    await solstral("/events", {
      type: "track",
      event: "Order Completed",
      messageId: `stripe_${order.checkoutSessionId}`,
      context: { traits: { email: order.email!.trim().toLowerCase() } },
      properties: {
        product: order.product,
        revenue: order.amount,
        currency: order.currency,
        stripeCheckoutSessionId: order.checkoutSessionId,
      },
    });
    return synced;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
