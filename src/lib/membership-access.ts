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
// True for the free 7-day trial while it's still running. During its window a trial is a full member
// (dashboard, workshops, community all open), but it carries no Stripe subscription, so it's its own
// predicate rather than folded into the paid checks that read subscription state. Mirrors
// isActiveTrialRow in membership-gate.ts, the server view of the exact same rule.
export function isTrial(member: Member | null): boolean {
  if (!member || member.membershipLevel !== "trial") return false;
  return !!member.trialExpiresAt && new Date(member.trialExpiresAt).getTime() > Date.now();
}

// A trial whose 7 days have run out. Nothing flips the level off 'trial' by design, so an expired
// trial is simply "level is trial, window has passed". She's routed to her own win-back page.
export function isExpiredTrial(member: Member | null): boolean {
  return !!member && member.membershipLevel === "trial" && !isTrial(member);
}

// Full-platform tiers for "where is her home" routing: the paid monthly/vip tiers plus an active
// trial. Not used for content gating (that goes through hasActiveAccess), only for the home routing
// in memberHomeHref below.
export function isMember(member: Member | null): boolean {
  return !!member && (member.membershipLevel === "monthly" || member.membershipLevel === "vip" || isTrial(member));
}

export function isVip(member: Member | null): boolean {
  return !!member && member.membershipLevel === "vip";
}

export function hasActiveAccess(member: Member | null): boolean {
  if (!member || member.blocked) return false;
  // An active trial has full access; an expired trial has none. Handled first because a trial has no
  // subscriptionStatus for the paid check below to read.
  if (member.membershipLevel === "trial") return isTrial(member);
  if (member.membershipLevel !== "monthly" && member.membershipLevel !== "vip") return false;
  return !!member.subscriptionStatus && ACCESS_GRANTING_STATUSES.has(member.subscriptionStatus);
}

// Client mirror of hasAccessFromRow: any active PAID tier, including $33 social. This is the gate
// for the rituals inside the community (book club, moon audios, seasonal updates), the things a
// paying member gets that a free member does not. Distinct from hasActiveAccess, which is the
// stricter monthly/vip full-platform gate, social passes here but not there.
export function hasPaidCommunityAccess(member: Member | null): boolean {
  if (!member || member.blocked) return false;
  // An active trial is a full member for its 7 days, so it gets the rituals too (and, via
  // hasRoomAccess below, the rooms). Handled first because a trial carries no subscriptionStatus for
  // the paid check to read. Mirrors hasAccessFromRow, which already unlocks the trial server-side.
  if (member.membershipLevel === "trial") return isTrial(member);
  const level = member.membershipLevel;
  if (level !== "social" && level !== "monthly" && level !== "vip") return false;
  return !!member.subscriptionStatus && ACCESS_GRANTING_STATUSES.has(member.subscriptionStatus);
}

// Client mirror of hasRoomAccessFromRow: the lowest gate, the live chat rooms. The free front-door
// tier gets in, and so does every paying tier. Rituals sit above this on hasPaidCommunityAccess.
export function hasRoomAccess(member: Member | null): boolean {
  if (!member || member.blocked) return false;
  if (member.membershipLevel === "free") return true;
  // An expired trial keeps the chat rooms (and her chart via the public chart pages); everything
  // premium is gone. Same rooms-only shape as the free tier. An ACTIVE trial passes through
  // hasPaidCommunityAccess below (full access).
  if (isExpiredTrial(member)) return true;
  return hasPaidCommunityAccess(member);
}

// True for anyone on the FREE-TIER experience: the free front-door tier, and an expired trial that
// has dropped back to rooms-and-chart-only. The nav and the member home fork on this, because
// neither should be shown the paid platform's doors, every one of those would just bounce her to
// the upgrade page, which reads as being locked out rather than being given something. An expired
// trial is additionally greeted with a "your free week ended" banner on /home (see isExpiredTrial).
export function isFreeMember(member: Member | null): boolean {
  return !!member && (member.membershipLevel === "free" || isExpiredTrial(member));
}

// Client mirror of postAuthDestination: where "home" points for this member. Three platforms, so
// three homes. Kept next to the gates so the nav logo, the home button and the server-side redirect
// can never drift into disagreeing about where a given tier belongs.
export function memberHomeHref(member: Member | null): string {
  if (!member) return "/";
  if (isFreeMember(member)) return "/home"; // free tier, and expired trials (rooms + chart)
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
