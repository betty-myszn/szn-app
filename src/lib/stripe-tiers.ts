// Server-only: the single source of truth for "which Stripe Price ID means which MY SZN
// membership tier". Never derived from checkout URL text, product names or the charged amount,
// Stripe Price IDs are the one thing that can't drift or be spoofed. The membership page sells
// three prices but only two real tiers, "3 months upfront" is the same 'monthly' membership as
// the $111/mo plan, just paid on a different schedule, both map to the same tier here.
// 'social' is the $33 community-only tier: it unlocks the chat rooms, book club and moon audios
// but NOT the full personalised platform (see hasFullAccessFromRow in membership-gate.ts). 'monthly'
// and 'vip' both unlock the full platform. 'free' is the no-charge front-door tier: it unlocks the
// live chat rooms ONLY, never the rituals (book club / moon audios) or the platform. It is created
// exclusively by the free-signup route, never by a Stripe checkout, so it is deliberately absent
// from CANONICAL_PRICE_TO_TIER below and can never be resolved from a price id.
export type MembershipLevel = "none" | "free" | "social" | "monthly" | "vip";
// A tier that a Stripe price can map to. 'free' is excluded on purpose: no price ever grants it.
type PaidTier = Exclude<MembershipLevel, "none" | "free">;

// The real, live Price IDs, hardcoded as the canonical mapping. These were previously read only
// from env vars, but a live incident proved that fragile: when the deployed STRIPE_PRICE_* values
// drift, go missing, or carry a stray space/newline, tierForPriceId returned "none" and a paying
// customer's checkout was silently dropped (the webhook logged "unrecognised price" and granted
// nothing). Price IDs aren't secrets and these three don't change, so they belong in code as the
// backstop. Env vars still work and take precedence for anything NEW (see below), they just can't
// break these known ones any more.
const CANONICAL_PRICE_TO_TIER: Record<string, PaidTier> = {
  price_1TwER7J6s9fRhiJooQRyfcwQ: "monthly", // $111 / month
  price_1TwEXMJ6s9fRhiJoRzDMbrQZ: "monthly", // $333 once, 3 months upfront (same tier)
  price_1TwEZjJ6s9fRhiJoJ0EAROdR: "vip", // $555 / month
  price_1TzVeaJ6s9fRhiJojBgk1aTJ: "social", // $33 / month, Stripe product "MY SZN social"
};

// Trim so a trailing space or newline pasted into a Railway variable can't silently break the
// exact-string match (the exact failure mode that dropped a live checkout).
function cleanEnvPriceId(v: string | undefined): string | null {
  const t = v?.trim();
  return t ? t : null;
}

function buildPriceMap(): Record<string, PaidTier> {
  const map: Record<string, PaidTier> = {};
  // Env first so it can register additional / future prices...
  const envMonthly = cleanEnvPriceId(process.env.STRIPE_PRICE_MONTHLY);
  const env3mo = cleanEnvPriceId(process.env.STRIPE_PRICE_MONTHLY_3MO_UPFRONT);
  const envVip = cleanEnvPriceId(process.env.STRIPE_PRICE_VIP);
  const envSocial = cleanEnvPriceId(process.env.STRIPE_PRICE_SOCIAL);
  if (envMonthly) map[envMonthly] = "monthly";
  if (env3mo) map[env3mo] = "monthly";
  if (envVip) map[envVip] = "vip";
  if (envSocial) map[envSocial] = "social";
  // ...but the canonical mapping is applied last so the known live IDs always win, no matter what
  // the deployed env happens to hold.
  return { ...map, ...CANONICAL_PRICE_TO_TIER };
}

export const PRICE_TO_TIER: Record<string, PaidTier> = buildPriceMap();

export function tierForPriceId(priceId: string | null | undefined): MembershipLevel {
  const id = priceId?.trim();
  if (!id) return "none";
  return PRICE_TO_TIER[id] ?? "none";
}

// Stripe subscription statuses that should keep paid content unlocked. 'active' and 'trialing'
// are the obvious ones, 'past_due' is deliberately included: a single failed renewal shouldn't
// cut anyone off mid-grace-period, Stripe keeps retrying and access should hold until it either
// recovers or the subscription reaches a genuinely terminal status.
export const ACCESS_GRANTING_STATUSES = new Set(["active", "trialing", "past_due"]);
