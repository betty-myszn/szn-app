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

// Client mirror of hasAccessFromRow: any active PAID tier, including $33 social. This is the gate
// for the rituals inside the community (book club, moon audios, seasonal updates), the things a
// paying member gets that a free member does not. Distinct from hasActiveAccess, which is the
// stricter monthly/vip full-platform gate, social passes here but not there.
export function hasPaidCommunityAccess(member: Member | null): boolean {
  if (!member) return false;
  const level = member.membershipLevel;
  if (level !== "social" && level !== "monthly" && level !== "vip") return false;
  return !!member.subscriptionStatus && ACCESS_GRANTING_STATUSES.has(member.subscriptionStatus);
}

// Client mirror of hasRoomAccessFromRow: the lowest gate, the live chat rooms. The free front-door
// tier gets in, and so does every paying tier. Rituals sit above this on hasPaidCommunityAccess.
export function hasRoomAccess(member: Member | null): boolean {
  if (!member) return false;
  if (member.membershipLevel === "free") return true;
  return hasPaidCommunityAccess(member);
}

// True only for the free front-door tier. The nav and the member home fork on this, because a free
// member must never be shown the paid platform's doors: every one of them would just bounce her to
// the upgrade page, which reads as being locked out rather than being given something.
export function isFreeMember(member: Member | null): boolean {
  return !!member && member.membershipLevel === "free";
}

// Client mirror of postAuthDestination: where "home" points for this member. Three platforms, so
// three homes. Kept next to the gates so the nav logo, the home button and the server-side redirect
// can never drift into disagreeing about where a given tier belongs.
export function memberHomeHref(member: Member | null): string {
  if (!member) return "/";
  if (isFreeMember(member)) return "/home";
  if (!isMember(member)) return "/community"; // $33 social: the rooms and rituals she paid for
  return "/dashboard";
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
