# Manual test checklist: Stripe membership system

All of this is manual, there's no automated test suite in this project. Do everything in Stripe
**test mode** with test cards (`4242 4242 4242 4242`, any future expiry/CVC, `4000 0000 0000 9995`
for a card that will decline). The Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`)
is the fastest way to run most of this locally without waiting on real webhook delivery.

## Checkout

- [ ] **New member, Monthly**: log in, go to `/membership`, click join on the Monthly plan → lands
      on Stripe with `client_reference_id` already set (check the URL) → complete test checkout →
      redirected to `/checkout/success` → page polls and shows "you're in" with Monthly copy →
      `/dashboard` is unlocked
- [ ] **New member, VIP**: same, but the VIP plan → success page shows VIP copy, not Monthly →
      `/settings` shows "VIP Member"
- [ ] **3-month-upfront price**: this one is a one-time payment, not a subscription, a genuinely
      different code path (`session.mode === "payment"`, no `session.subscription` at all).
      Complete checkout → profile's `membership_level` is `monthly` (same tier as the recurring
      plan) → `stripe_subscription_id` is `null` → `subscription_current_period_end` is ~3
      calendar months out → `subscription_cancel_at_period_end` is `true` → `/settings` shows
      "your membership ends on [date]", not "renews on"
  - **Known gap**: because there's no subscription object, nothing in Stripe fires a webhook
    when those 3 months actually elapse, access won't automatically revoke itself the way a real
    subscription's cancellation would. Until a scheduled job exists to sweep expired one-time
    memberships (e.g. Supabase `pg_cron` running a periodic `update profiles set
    membership_level='none' where stripe_subscription_id is null and
    subscription_current_period_end < now() and membership_level != 'none'`), this needs a
    manual check, or that cron job needs building before this plan is relied on long-term.
- [ ] **Unauthenticated checkout blocked**: log out, go to `/membership`, click join → sent to
      `/login?redirect=/membership`, not straight to Stripe
- [ ] **Login round-trip**: from the blocked state above, log in via magic link → lands back on
      `/membership`, not `/dashboard`

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

- [ ] **Non-member on `/dashboard`**: log in with a profile that has `membership_level = 'none'`
      → sees the "your portal's waiting" upgrade prompt, not the real dashboard content
- [ ] **Non-member on `/community` and `/community/room/[id]`**: same gate, both the index and a
      direct link straight to a room
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
