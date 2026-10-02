// The 3-month commitment, worked out from what a member bought and when.
//
// Joining MY SZN is a three-season commitment: either $250 once (it simply ends after 3 months), or
// the 3 x $88 plan, where the first three monthly payments are committed and after that it carries
// on monthly until she switches it off. Only the plan has anything to enforce: while she is inside
// her first 3 months the billing portal opens without a cancel button (see
// src/app/api/stripe/portal/route.ts) and the account page says when the commitment ends.

import { PLAN_PRICE_ID, isUpfrontPrice } from "@/lib/stripe-tiers";

export const COMMITMENT_MONTHS = 3;

export function isPlanPrice(priceId: string | null | undefined): boolean {
  return !!PLAN_PRICE_ID && !!priceId && priceId.trim() === PLAN_PRICE_ID;
}

/** When a plan member's commitment ends: 3 months after the membership started. */
export function commitmentEndsAt(
  priceId: string | null | undefined,
  startedAtIso: string | null | undefined,
  planPriceId: string | null = PLAN_PRICE_ID
): Date | null {
  if (!planPriceId || !priceId || priceId.trim() !== planPriceId || !startedAtIso) return null;
  const start = new Date(startedAtIso);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + COMMITMENT_MONTHS);
  return end;
}

/** True while a plan member is still inside her 3 committed months. */
export function isInCommitment(
  priceId: string | null | undefined,
  startedAtIso: string | null | undefined,
  nowMs: number,
  planPriceId: string | null = PLAN_PRICE_ID
): boolean {
  const end = commitmentEndsAt(priceId, startedAtIso, planPriceId);
  return !!end && nowMs < end.getTime();
}

export { isUpfrontPrice };
