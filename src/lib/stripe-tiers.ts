// Server-only: the single source of truth for "which Stripe Price ID means which MY SZN
// membership tier". Never derived from checkout URL text, product names or the charged amount,
// Stripe Price IDs are the one thing that can't drift or be spoofed. The membership page sells
// three prices but only two real tiers, "3 months upfront" is the same 'monthly' membership as
// the $111/mo plan, just paid on a different schedule, both map to the same tier here.
export type MembershipLevel = "none" | "monthly" | "vip";

export const PRICE_TO_TIER: Record<string, Exclude<MembershipLevel, "none">> = {
  [process.env.STRIPE_PRICE_MONTHLY || "__unset_monthly__"]: "monthly",
  [process.env.STRIPE_PRICE_MONTHLY_3MO_UPFRONT || "__unset_3mo__"]: "monthly",
  [process.env.STRIPE_PRICE_VIP || "__unset_vip__"]: "vip",
};

export function tierForPriceId(priceId: string | null | undefined): MembershipLevel {
  if (!priceId) return "none";
  return PRICE_TO_TIER[priceId] ?? "none";
}

// Stripe subscription statuses that should keep paid content unlocked. 'active' and 'trialing'
// are the obvious ones, 'past_due' is deliberately included: a single failed renewal shouldn't
// cut anyone off mid-grace-period, Stripe keeps retrying and access should hold until it either
// recovers or the subscription reaches a genuinely terminal status.
export const ACCESS_GRANTING_STATUSES = new Set(["active", "trialing", "past_due"]);
