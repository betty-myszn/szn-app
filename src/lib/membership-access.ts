import type { Member, MembershipLevel } from "@/lib/member";

// Statuses where paid content should stay unlocked. 'past_due' is deliberate: one failed
// renewal shouldn't cut access mid-retry, Stripe keeps attempting the charge for days before a
// subscription goes truly terminal (canceled/unpaid/incomplete_expired), and the webhook already
// resets membership_level to 'none' the moment Stripe reports one of those terminal states, so
// by the time a member's row would fail this check, she's already been fully logged out of paid
// status server-side, not just hidden from it here.
const ACCESS_GRANTING_STATUSES = new Set(["active", "trialing", "past_due"]);

// The one place every page/component asks "can she see this", so a member/VIP check never has
// to be re-derived ad hoc from membershipLevel + subscriptionStatus scattered across the app.
export function isMember(member: Member | null): boolean {
  return !!member && (member.membershipLevel === "monthly" || member.membershipLevel === "vip");
}

export function isVip(member: Member | null): boolean {
  return !!member && member.membershipLevel === "vip";
}

export function hasActiveAccess(member: Member | null): boolean {
  if (!member || !isMember(member)) return false;
  return !!member.subscriptionStatus && ACCESS_GRANTING_STATUSES.has(member.subscriptionStatus);
}

// True specifically for the "still has access but Stripe is struggling to charge her" state,
// distinct from isMember/hasActiveAccess so the UI can show a billing warning without implying
// she's lost anything yet.
export function hasBillingIssue(member: Member | null): boolean {
  return !!member && member.subscriptionStatus === "past_due";
}

export function isCancellationScheduled(member: Member | null): boolean {
  return hasActiveAccess(member) && !!member?.subscriptionCancelAtPeriodEnd;
}

export function requiresLevel(member: Member | null, level: Exclude<MembershipLevel, "none">): boolean {
  if (!hasActiveAccess(member)) return false;
  if (level === "vip") return isVip(member);
  return true; // 'monthly' tier content: any active membership, monthly or vip, qualifies
}
