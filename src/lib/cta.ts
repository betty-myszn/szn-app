/**
 * The front-door CTA, in one place.
 *
 * The 7-day free trial is the single front door for anyone who isn't a member yet: full access, no
 * card. There is deliberately NO waitlist branch anywhere in here. The site used to fall back to
 * "join the waitlist" whenever enrolment was closed, and several pages hard-coded that fallback
 * without even reading the enrolment flag, so strangers were being asked to leave an email address
 * on pages where they could have been inside the product a minute later. A visitor who can't buy
 * yet should be starting her free week, not queueing.
 *
 * Every non-member CTA on the site reads from here. __tests__/cta-front-door.test.ts fails the
 * build if a waitlist link or label reappears in the app, so this can't quietly come back.
 */

export interface Cta {
  href: string;
  label: string;
}

/** The free trial: the default ask for anyone who isn't a member. */
export const FREE_TRIAL_CTA: Cta = {
  href: "/free-trial",
  label: "start your free 7 days",
};

/**
 * The join CTA for a page that also sells the paid membership. While the doors are open the paid
 * join stays the ask, because someone reading the pricing page is already further down than a
 * stranger. When the doors are closed it falls back to the free trial rather than a waitlist.
 *
 * `paidHref` is where "join" should point on this particular page, e.g. the in-page pricing anchor
 * on /membership, or /membership itself from anywhere else.
 */
export function joinCta(enrolmentOpen: boolean, paidHref = "/membership"): Cta {
  return enrolmentOpen ? { href: paidHref, label: "join my szn" } : FREE_TRIAL_CTA;
}
