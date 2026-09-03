// Single source of truth for which Brevo list a /api/subscribe submission lands on, and whether it
// should fire the n8n waitlist workflow. Kept out of the route handler so it can be unit-tested and
// so the list choice and the n8n choice can never drift apart.
//
// Brevo list IDs, not names: a name lookup silently files everyone nowhere on the smallest rename or
// capital letter (that bug once left list 10 on zero contacts). Same canonical-with-env-override
// shape as the Stripe price map in stripe-tiers.ts, for the same reason.
export const CANONICAL_LIST_WAITLIST = 9; // "MY SZN waitlist"
export const CANONICAL_LIST_CHART = 10; // "Free birthchart generator"
export const CANONICAL_LIST_MONEY_BLUEPRINT = 14; // "Money Blueprint"

function listIdFromEnv(v: string | undefined): number | null {
  const t = v?.trim();
  return t && /^\d+$/.test(t) ? parseInt(t, 10) : null;
}

// The ONLY sources that represent an actual "join the waitlist" action. Everything else (free chart,
// free human design, money blueprint, or any future/unknown source) must never be filed on the
// waitlist or pushed through the n8n waitlist workflow. The route used to DEFAULT unknown sources to
// the waitlist, which is how free Human Design chart leads (source "free-human-design") ended up on
// the old waitlist even though no waitlist is running. Inverted to an allowlist so any new source is
// safe by default.
const WAITLIST_SOURCES = new Set(["waitlist", "membership-waitlist"]);

export function isWaitlistSource(source: string | undefined | null): boolean {
  return WAITLIST_SOURCES.has((source ?? "").trim());
}

export function listIdFor(source: string | undefined | null): number {
  const s = (source ?? "").trim();
  if (s === "free-chart") return listIdFromEnv(process.env.BREVO_LIST_FREE_CHART) ?? CANONICAL_LIST_CHART;
  // Free Human Design generator leads: filed on the free-generator list by default, overridable with
  // BREVO_LIST_FREE_HD if they get their own list. Tagged SIGNUP_SOURCE "free-human-design" either
  // way so they can be segmented. Never the waitlist.
  if (s === "free-human-design")
    return (
      listIdFromEnv(process.env.BREVO_LIST_FREE_HD) ??
      listIdFromEnv(process.env.BREVO_LIST_FREE_CHART) ??
      CANONICAL_LIST_CHART
    );
  if (s === "money-blueprint") return listIdFromEnv(process.env.BREVO_LIST_MONEY_BLUEPRINT) ?? CANONICAL_LIST_MONEY_BLUEPRINT;
  // Shop Your SZN waitlist. Deliberately has NO canonical fallback id of its own: pointing it at a
  // list number that does not exist in Brevo yet would fail every submission silently, so until
  // BREVO_LIST_SHOP_YOUR_SIGN is set it files on the free-generator list where the contact is at
  // least saved and tagged SIGNUP_SOURCE=shop-your-sign. It is never the membership waitlist, which
  // is a different queue for a different product.
  if (s === "shop-your-sign")
    return (
      listIdFromEnv(process.env.BREVO_LIST_SHOP_YOUR_SIGN) ??
      listIdFromEnv(process.env.BREVO_LIST_FREE_CHART) ??
      CANONICAL_LIST_CHART
    );
  if (isWaitlistSource(s)) return listIdFromEnv(process.env.BREVO_LIST_WAITLIST) ?? CANONICAL_LIST_WAITLIST;
  // Unknown source: capture the contact on the free-generator list so it is still saved and tagged,
  // never the waitlist.
  return listIdFromEnv(process.env.BREVO_LIST_FREE_CHART) ?? CANONICAL_LIST_CHART;
}
