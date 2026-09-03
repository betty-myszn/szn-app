// Server-only. Upserts the buyer as a Brevo CONTACT when a payment succeeds, then files them on the
// paid-members list with their paid membership attributes and subscription status.
//
// This is deliberately separate from sendBrevoTemplateEmail (src/lib/email/brevo.ts): a
// transactional /smtp/email send does NOT create or update a contact. Without this step a paying
// member has either no Brevo contact at all (if they never joined the waitlist) or a stale waitlist
// contact carrying none of their paid state.
//
// The app tells Brevo EXPLICITLY that the person has paid (PAID=true + SUBSCRIPTION_STATUS +
// MEMBERSHIP_LEVEL), set from the Stripe truth in the webhook, rather than leaving a Brevo
// automation to infer payment from an email open or a tag. NEVER throws: a contact-sync failure must
// never fail the Stripe webhook or block the membership/welcome email, so callers get a result
// object. Mirrors the /contacts conventions already used by src/app/api/subscribe/route.ts.

import { billingPortalLink } from "@/lib/billing-portal-link";

const BREVO_API = "https://api.brevo.com/v3";
const LIST_PAID_MEMBERS = "MY SZN Members";

// Free-tier joiners go on their own list ("my szn free members", id 15) so they can be emailed and
// segmented apart from paid members, the waitlist and free-chart contacts. An explicit id, not a
// name lookup: the subscribe route learned the hard way that matching a list by name silently files
// everyone nowhere on the smallest rename or capital letter (see src/app/api/subscribe/route.ts).
// Override with BREVO_LIST_FREE_MEMBERS if the id ever changes.
const CANONICAL_LIST_FREE_MEMBERS = 15;

function freeMembersListId(): number {
  const v = process.env.BREVO_LIST_FREE_MEMBERS?.trim();
  return v && /^\d+$/.test(v) ? parseInt(v, 10) : CANONICAL_LIST_FREE_MEMBERS;
}

// Free-trial joiners go on their own list ("free trial my szn", id 18) so trial signups can be
// emailed and segmented apart from free members (15), paid members and the waitlist. Explicit id,
// never a name lookup, same reasoning as the free-members list above. When a trial member later
// converts, the Stripe webhook adds her to the paid list and sets PAID=true while she stays on
// list 18, which is exactly what makes "how many trials, and how many converted" readable in Brevo.
// Override with BREVO_LIST_FREE_TRIAL if the id ever changes.
const CANONICAL_LIST_FREE_TRIAL = 18;

function freeTrialListId(): number {
  const v = process.env.BREVO_LIST_FREE_TRIAL?.trim();
  return v && /^\d+$/.test(v) ? parseInt(v, 10) : CANONICAL_LIST_FREE_TRIAL;
}

export type BrevoContactResult =
  | { ok: true; listId: number }
  | { ok: false; error: string };

async function brevo(path: string, opts: RequestInit = {}) {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY not set");
  return fetch(`${BREVO_API}${path}`, {
    ...opts,
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
      accept: "application/json",
      ...opts.headers,
    },
  });
}

// Same get-or-create-by-name pattern as the waitlist route, so re-runs never spawn duplicate lists.
async function getOrCreateList(listName: string): Promise<number> {
  const res = await brevo("/contacts/lists?limit=50&offset=0");
  if (!res.ok) throw new Error(`Brevo list fetch failed: ${res.status}`);
  const data = await res.json();
  const existing = data.lists?.find((l: { name: string; id: number }) => l.name === listName);
  if (existing) return existing.id;

  const createRes = await brevo("/contacts/lists", {
    method: "POST",
    body: JSON.stringify({ name: listName, folderId: 1 }),
  });
  if (!createRes.ok) throw new Error(`Brevo list create failed: ${createRes.status}`);
  const created = await createRes.json();
  return created.id;
}

// Brevo stores a custom attribute on a contact only if that attribute is already defined on the
// account, so every non-default attribute we set has to be ensured first. Creating one that already
// exists comes back 400 (duplicate), which is the expected steady state and is swallowed. The
// default FIRSTNAME/LASTNAME attributes always exist and are not ensured here.
const CUSTOM_ATTRIBUTES: Array<{ name: string; type: "text" | "boolean" | "date" }> = [
  { name: "MEMBERSHIP_LEVEL", type: "text" },
  { name: "SUBSCRIPTION_STATUS", type: "text" },
  { name: "PLAN_NAME", type: "text" },
  { name: "STRIPE_CUSTOMER_ID", type: "text" },
  { name: "PAID", type: "boolean" },
  { name: "PAID_AT", type: "date" },
  { name: "BILLING_LINK", type: "text" },
];

async function ensureAttribute(name: string, type: string): Promise<void> {
  try {
    const res = await brevo(`/contacts/attributes/normal/${name}`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });
    if (res.ok || res.status === 400) return; // 400 == already exists, the common case
    const detail = await res.text().catch(() => "");
    console.error(`Brevo ensureAttribute ${name} failed`, res.status, detail.slice(0, 200));
  } catch (e) {
    console.error(`Brevo ensureAttribute ${name} threw`, e instanceof Error ? e.message : e);
  }
}

export interface FreeMemberContact {
  email: string;
  name?: string | null;
}

// Upserts a free-tier joiner as a Brevo contact and files them on the free-members list (id 15).
// Mirrors syncPaidMemberToBrevo but carries no paid attributes. Called from the free signup route
// after the Supabase profile is promoted to 'free'. updateEnabled makes it an upsert, so a contact
// who was already on the waitlist or free-chart list is updated in place and ADDED to the free list
// (Brevo's listIds adds, it never removes them from the others). NEVER throws: a contact-sync
// failure must never fail or block the signup, so the caller gets a result object.
export async function syncFreeMemberToBrevo(contact: FreeMemberContact): Promise<BrevoContactResult> {
  if (!process.env.BREVO_API_KEY) return { ok: false, error: "BREVO_API_KEY not set" };
  if (!contact.email) return { ok: false, error: "no_email" };

  try {
    // Only the two attributes this path sets need ensuring; both already exist in steady state.
    await Promise.all([ensureAttribute("MEMBERSHIP_LEVEL", "text"), ensureAttribute("SIGNUP_SOURCE", "text")]);
    const listId = freeMembersListId();

    const attributes: Record<string, string> = {
      MEMBERSHIP_LEVEL: "free",
      SIGNUP_SOURCE: "free-membership",
    };
    const parts = (contact.name ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts[0]) attributes.FIRSTNAME = parts[0];
    if (parts.length > 1) attributes.LASTNAME = parts.slice(1).join(" ");

    const res = await brevo("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email: contact.email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (res.ok) {
      console.log("brevo free member synced", { email: contact.email, listId });
      return { ok: true, listId };
    }
    const err = await res.json().catch(() => ({}));
    if (err?.code === "duplicate_parameter") return { ok: true, listId };
    return { ok: false, error: `brevo ${res.status}: ${JSON.stringify(err).slice(0, 200)}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// Upserts a free-trial joiner as a Brevo contact and files them on the free-trial list (id 18).
// Mirrors syncFreeMemberToBrevo exactly (no paid attributes), just a different list and source tag.
// Called from the trial signup route after the Supabase profile is set to 'trial'. NEVER throws: a
// contact-sync failure must never fail or block the signup, so the caller gets a result object.
export async function syncTrialMemberToBrevo(contact: FreeMemberContact): Promise<BrevoContactResult> {
  if (!process.env.BREVO_API_KEY) return { ok: false, error: "BREVO_API_KEY not set" };
  if (!contact.email) return { ok: false, error: "no_email" };

  try {
    await Promise.all([ensureAttribute("MEMBERSHIP_LEVEL", "text"), ensureAttribute("SIGNUP_SOURCE", "text")]);
    const listId = freeTrialListId();

    const attributes: Record<string, string> = {
      MEMBERSHIP_LEVEL: "trial",
      SIGNUP_SOURCE: "free-trial",
    };
    const parts = (contact.name ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts[0]) attributes.FIRSTNAME = parts[0];
    if (parts.length > 1) attributes.LASTNAME = parts.slice(1).join(" ");

    const res = await brevo("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email: contact.email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (res.ok) {
      console.log("brevo trial member synced", { email: contact.email, listId });
      return { ok: true, listId };
    }
    const err = await res.json().catch(() => ({}));
    if (err?.code === "duplicate_parameter") return { ok: true, listId };
    return { ok: false, error: `brevo ${res.status}: ${JSON.stringify(err).slice(0, 200)}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export interface PaidMemberContact {
  email: string;
  name?: string | null;
  membershipLevel: string; // 'monthly' | 'vip'
  planName: string; // human-readable, kept in step with the welcome email's plan_name
  subscriptionStatus: string; // the Stripe subscription status, e.g. 'active' / 'trialing'
  stripeCustomerId?: string | null;
  paidAt?: Date;
}

// Creates or updates (updateEnabled: true) the buyer's Brevo contact by email, sets the paid
// attributes + subscription status, and adds them to the paid-members list. Called from the Stripe
// webhook right after the Supabase membership is stored and before the welcome email.
export async function syncPaidMemberToBrevo(contact: PaidMemberContact): Promise<BrevoContactResult> {
  if (!process.env.BREVO_API_KEY) return { ok: false, error: "BREVO_API_KEY not set" };
  if (!contact.email) return { ok: false, error: "no_email" };

  try {
    // Ensure the custom attributes exist and the paid list exists before the upsert. Attribute
    // ensures run in parallel; each already-exists is swallowed inside ensureAttribute.
    await Promise.all(CUSTOM_ATTRIBUTES.map((a) => ensureAttribute(a.name, a.type)));
    const listId = await getOrCreateList(LIST_PAID_MEMBERS);

    const paidAt = contact.paidAt ?? new Date();
    const attributes: Record<string, string | boolean> = {
      MEMBERSHIP_LEVEL: contact.membershipLevel,
      SUBSCRIPTION_STATUS: contact.subscriptionStatus,
      PLAN_NAME: contact.planName,
      PAID: true,
      PAID_AT: paidAt.toISOString().slice(0, 10), // Brevo date attribute expects YYYY-MM-DD
    };
    if (contact.stripeCustomerId) {
      attributes.STRIPE_CUSTOMER_ID = contact.stripeCustomerId;
      // Her own one-click door into Stripe's billing portal, for {{ contact.BILLING_LINK }} in any
      // Brevo campaign or automation (the trial-ending email uses it for "manage or cancel"). Null
      // when no signing key is available, in which case the template's default fallback carries her
      // to Stripe's hosted portal login instead.
      const billingLink = billingPortalLink(contact.stripeCustomerId);
      if (billingLink) attributes.BILLING_LINK = billingLink;
    }

    const parts = (contact.name ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts[0]) attributes.FIRSTNAME = parts[0];
    if (parts.length > 1) attributes.LASTNAME = parts.slice(1).join(" ");

    // updateEnabled makes this an upsert: a brand-new buyer is created, an existing waitlist contact
    // is updated in place (never duplicated) and moved onto the paid list.
    const res = await brevo("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email: contact.email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    // 201 = created, 204 = updated. Both are res.ok. Some Brevo responses report an already-present
    // contact as duplicate_parameter, which for an upsert is still success.
    if (res.ok) {
      console.log("brevo paid contact synced", {
        email: contact.email,
        level: contact.membershipLevel,
        status: contact.subscriptionStatus,
        listId,
      });
      return { ok: true, listId };
    }
    const err = await res.json().catch(() => ({}));
    if (err?.code === "duplicate_parameter") return { ok: true, listId };
    return { ok: false, error: `brevo ${res.status}: ${JSON.stringify(err).slice(0, 200)}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// Re-mints the one-click billing link on an existing contact and writes nothing else: no lists, no
// plan lookup, no PAID flags. Called on every successful invoice so an active member is always
// holding a link that still works, rather than one that quietly expired months after checkout and
// dropped her back to typing her email into Stripe's hosted login. NEVER throws, same contract as
// the syncs above: a Brevo problem must not fail the Stripe webhook.
export async function refreshBrevoBillingLink(
  email: string | null | undefined,
  stripeCustomerId: string | null | undefined
): Promise<BrevoContactResult> {
  if (!process.env.BREVO_API_KEY) return { ok: false, error: "BREVO_API_KEY not set" };
  if (!email) return { ok: false, error: "no_email" };
  const billingLink = billingPortalLink(stripeCustomerId);
  if (!billingLink) return { ok: false, error: "no_billing_link" };

  try {
    await ensureAttribute("BILLING_LINK", "text");
    // PUT /contacts/{identifier} updates in place and, unlike the POST upsert, never creates a
    // contact. A person with no Brevo contact yet has had no email to put the link in anyway, so a
    // 404 here is a no-op rather than a failure worth shouting about.
    const res = await brevo(`/contacts/${encodeURIComponent(email)}`, {
      method: "PUT",
      body: JSON.stringify({ attributes: { BILLING_LINK: billingLink } }),
    });
    if (res.ok) return { ok: true, listId: 0 };
    if (res.status === 404) return { ok: false, error: "contact_not_found" };
    const detail = await res.text().catch(() => "");
    return { ok: false, error: `brevo ${res.status}: ${detail.slice(0, 200)}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
