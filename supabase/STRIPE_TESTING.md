# Manual test checklist: Stripe membership system

All of this is manual, there's no automated test suite in this project. Do everything in Stripe
**test mode** with test cards (`4242 4242 4242 4242`, any future expiry/CVC, `4000 0000 0000 9995`
for a card that will decline). The Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`)
is the fastest way to run most of this locally without waiting on real webhook delivery.

## Checkout (payment-first, the main path)

- [ ] **Brand-new member, Monthly, logged out**: while logged out, go to `/membership`, click join
      on the Monthly plan → goes straight to Stripe (no login wall), URL has **no**
      `client_reference_id` → complete test checkout → redirected to `/checkout/success` →
      "payment received, now activate your account" with the email you paid with → a
      `pending_memberships` row now exists for that email with `membership_level = monthly`
- [ ] **Activation**: click the magic link in that email → lands on `/onboarding` (not the
      dashboard, not a blank login) → the `pending_memberships` row is now gone and your `profiles`
      row has the membership → finish onboarding → `/dashboard` unlocks
- [ ] **Activation email fallback**: on `/checkout/success`, if no `session_id` is in the URL, the
      page asks for your email instead → enter the email you paid with → link sends. Enter an email
      that never paid → "we couldn't find a purchase for that email" (no link sent, no account probe)
- [ ] **VIP, logged out**: same as Monthly but the VIP plan → after activation `/settings` shows
      "VIP Member"
- [ ] **3-month-upfront price**: one-time payment, not a subscription, a different code path
      (`session.mode === "payment"`, no `session.subscription`). After activation: `membership_level`
      is `monthly` → `stripe_subscription_id` is `null` → `subscription_current_period_end` is ~3
      months out → `subscription_cancel_at_period_end` is `true` → `/settings` shows "ends on [date]"
  - **Auto-expiry**: there's still no Stripe webhook when the 3 months elapse, but the access gate
    (`hasAccessFromRow`) now enforces the paid-through date itself: once
    `subscription_current_period_end` passes on a non-renewing plan, access is denied on the next
    request even without a cron. A `pg_cron` sweep to also flip `membership_level` to `none` for
    tidiness is still worth adding, but access no longer over-runs the paid period.
- [ ] **Existing logged-in member checkout**: while logged in, buy a plan → Stripe URL **does**
      carry `client_reference_id` → webhook writes straight to your profile (no `pending_memberships`
      row created) → `/checkout/success` shows "you're in" → not asked to re-activate, not re-charged

## Route gating (server-side, via proxy.ts)

- [ ] **Logged out → member area**: visit `/dashboard` (or `/my-chart`, `/community`, `/goals`)
      logged out → redirected to `/login?redirect=/dashboard`
- [ ] **Logged in, no membership → member area**: log in as an account with no active membership,
      visit `/dashboard` → redirected to `/membership?reason=none`, and the pricing page shows the
      "you'll need an active membership" banner
- [ ] **Access but not onboarded → member area**: an account with active membership that hasn't
      finished onboarding → any member-area URL bounces to `/onboarding`
- [ ] **Onboarding guardrails**: `/onboarding` with no access → `/membership?reason=none`;
      `/onboarding` when already onboarded → `/dashboard` (can't re-run it)
- [ ] **Settings stays reachable when lapsed**: a logged-in member with no/expired access can still
      open `/settings` to manage or renew billing (login-only, not access-gated)

## Webhook correctness

- [ ] **Missing `client_reference_id`**: manually hit the webhook (Stripe CLI `stripe trigger
      checkout.session.completed` with the reference stripped, or check server logs after a
      checkout that somehow skipped CheckoutButton) → falls back to email match → check server
      logs for the "used email fallback" warning
- [ ] **Duplicate delivery**: use the Stripe CLI to resend the same event id twice (or just click
      "Resend" on a past webhook delivery in the dashboard) → second delivery returns
      `{"received":true,"duplicate":true}`, profile isn't double-updated, no error
- [ ] **Invalid signature**: `curl -X POST localhost:3000/api/stripe/webhook -d '{}'` with no/wrong
      `stripe-signature` header → `400`, profile untouched
- [ ] **Unrecognised price id**: temporarily point a checkout at a price not in `stripe-tiers.ts`
      → webhook logs the "unrecognised price" error and does not grant any tier

## Subscription lifecycle

- [ ] **Upgrade (Monthly → VIP)**: as an existing Monthly member, use the Customer Portal (or
      Stripe dashboard directly) to change the subscription's price to the VIP price →
      `customer.subscription.updated` fires → profile's `membership_level` flips to `vip`
- [ ] **Downgrade (VIP → Monthly)**: reverse of the above → `membership_level` flips back to
      `monthly`
- [ ] **Scheduled cancellation**: cancel "at period end" (Customer Portal → Cancel plan, or
      Stripe dashboard) → `cancel_at_period_end = true`, `status` stays `active` → `/settings`
      shows "your membership ends on [date]" but the dashboard **stays unlocked**
- [ ] **Final cancellation**: let a scheduled cancellation actually reach its period end (or in
      test mode, cancel immediately instead of at-period-end) → `customer.subscription.deleted`
      fires → `membership_level = 'none'`, `subscription_status = 'canceled'`,
      `stripe_customer_id` / `stripe_subscription_id` are **still populated**, not wiped →
      dashboard now shows the "join to unlock" gate

## Billing

- [ ] **Successful renewal**: trigger `invoice.paid` (Stripe CLI: `stripe trigger invoice.paid`,
      or wait for a real test-mode renewal) → `membership_updated_at` and
      `subscription_current_period_end` both move forward, access stays on, no duplicate profile
      rows (there's only ever one row per user, this is really checking the update didn't error)
- [ ] **Failed renewal**: use a card that fails on renewal, or `stripe trigger
      invoice.payment_failed` → `subscription_status` becomes `past_due` → dashboard **stays
      unlocked** → `/settings` shows the red "payment issue" pill and an "update payment method"
      link → confirm access is NOT removed after a single failure
- [ ] **Billing recovery**: update the payment method via the Customer Portal and let the retry
      succeed → `invoice.paid` fires → `subscription_status` back to `active`, payment-issue
      banner disappears

## Access gating

Note: `/dashboard`, `/community`, and the other member-area routes are now gated **server-side**
by `proxy.ts` (see "Route gating" above), so a non-member is redirected to `/membership?reason=none`
before the page renders at all, they never reach the client-side "your portal's waiting" prompt on
those routes now. That prompt remains as defence-in-depth. `/events` is deliberately public (it's
the marketing/"see what's waiting" page linked from login), so it keeps its own client-side gate.

- [ ] **Non-member on `/dashboard`**: with `membership_level = 'none'`, visiting `/dashboard`
      redirects to `/membership?reason=none` (server-side) rather than rendering the dashboard
- [ ] **Non-member on `/community` and `/community/room/[id]`**: same server-side redirect, both the
      index and a direct link straight to a room
- [ ] **Workshop Zoom link hidden pre-membership**: on `/events`, RSVP going as a non-member (if
      RSVP itself isn't gated) → the Zoom join button does not render, a "join to get in" prompt
      does instead
- [ ] **Active member sees Zoom link**: same page, as an active member → real join button and
      meeting id/passcode show
- [ ] **VIP-only content, if/when it exists**: `isVip()` should gate it, `isMember()` alone
      should not be enough. (No VIP-exclusive page exists in the app yet as of this build, this
      is here so the check isn't forgotten when one is added.)

## Customer Portal

- [ ] **Manage membership button**: from `/settings`, click "manage membership" → lands on
      Stripe's real portal for the logged-in member's own customer id
- [ ] **Return link**: leave the portal → lands back on `/settings`, not `/dashboard` or the
      homepage
- [ ] **Never-subscribed member hitting `/api/stripe/portal` directly**: redirects to
      `/membership` instead of erroring
