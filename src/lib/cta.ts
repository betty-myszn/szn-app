/**
 * The front-door CTA, in one place.
 *
 * Joining is the single front door for anyone who isn't a member yet: the paid membership at
 * /membership, $88 a month from day one. The 7-day free trial was retired on 1 Oct 2026 (most trials
 * cancelled on day 0 or 1 without ever using the platform), and the waitlist was retired before it.
 * There is deliberately no fallback to either. A visitor who isn't a member is asked to join.
 *
 * Every non-member CTA on the site reads from here. __tests__/cta-front-door.test.ts fails the
 * build if a waitlist or free-trial link or label reappears in the app, so neither can quietly
 * come back.
 */

export interface Cta {
  href: string;
  label: string;
}

/** The join: the default ask for anyone who isn't a member. */
export const JOIN_CTA: Cta = {
  href: "/membership",
  label: "apply for my szn",
};

/**
 * The join CTA for a page that also sells the paid membership, pointed at that page's own pricing.
 * `paidHref` is where "join" should point on this particular page, e.g. the in-page pricing anchor
 * on /membership, or /membership itself from anywhere else. Enrolment closed no longer changes the
 * destination: there is no free trial or waitlist left to fall back to, and the pricing section is
 * what explains the doors.
 */
export function joinCta(_enrolmentOpen: boolean, paidHref = "/membership"): Cta {
  return { href: paidHref, label: JOIN_CTA.label };
}
