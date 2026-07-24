# Stripe setup for MY SZN

What Betty needs to do manually in the Stripe and Railway dashboards. None of this can be done
from code, it's account-level configuration.

## 1. Get your API keys

Stripe Dashboard → Developers → API keys.

**Test mode and live mode have completely separate keys and completely separate data.**
A test-mode subscription will never show up in live mode, and vice versa. Do all testing in test
mode first (the toggle is top-right of the Stripe dashboard). Test keys start `sk_test_...`,
live keys start `sk_live_...`, don't mix them.

Copy the **Secret key** → `STRIPE_SECRET_KEY`.

## 2. Get the three Price IDs

Dashboard → Product catalog. For each of the three MY SZN plans (Monthly $111/mo, 3-months
upfront $333, VIP $555/mo), open the product and copy the **Price ID** (starts `price_...`, not
the Product ID which starts `prod_...`).

```
STRIPE_PRICE_MONTHLY=price_...              (the $111/mo plan)
STRIPE_PRICE_MONTHLY_3MO_UPFRONT=price_...  (the $333 pay-upfront plan, same membership tier as monthly)
STRIPE_PRICE_VIP=price_...                  (the $555/mo VIP plan)
```

These map to membership tiers in `src/lib/stripe-tiers.ts`, not by name or amount, by Price ID
only. If a price is ever recreated in Stripe (not edited, recreated), it gets a new Price ID and
this env var needs updating too.

## 3. Configure the Customer Portal (one-time, or the "manage membership" button will error)

Dashboard → Settings → Billing → Customer portal. Stripe requires this to be configured at least
once before `billingPortal.sessions.create()` will work at all, it's a blank page otherwise.
Turn on:
- Update payment method
- View billing history / invoices
- Cancel subscription

"Switch plan" only if you want members swapping between Monthly and VIP themselves through the
portal, otherwise leave it off and handle upgrades manually.

## 4. Point the checkout links at the success/cancel pages

Dashboard → Payment Links → open each of the three live links → edit → "After payment".

Set the confirmation page to a custom URL:

```
https://itsmyszn.com/checkout/success?session_id={CHECKOUT_SESSION_ID}
```

Stripe fills in `{CHECKOUT_SESSION_ID}` automatically, leave it exactly like that. The
`session_id` is now important, not optional: the flow is **payment-first**, so most buyers pay
before they have an account. The success page uses that `session_id` to verify the payment
server-side and send the activation magic link automatically. Without it the page still works, it
just falls back to asking her to type the email she paid with. Set it on all three links.

Payment Links don't have a separate "cancel" redirect the way a dynamically-created Checkout
Session does (there's no cancel step, she just closes the tab or hits back), `/checkout/cancel`
exists as a general "changed my mind, here's the way back to pricing" page you can link to from
anywhere, it's not wired into the Payment Link flow automatically.

**The flow, end to end:** she picks a plan → pays on Stripe (no login required first) → the
webhook parks her membership in `pending_memberships` keyed by the email she paid with → the
success page sends her an activation magic link → she clicks it → `/auth/callback` claims that
parked membership onto her new account (matched by her verified email) and deletes the pending
row → she's forced through onboarding → then the portal opens. An existing, already-logged-in
member skips all that: her checkout carries `client_reference_id`, so the webhook writes straight
to her profile and she's never re-charged or asked to re-activate.

## 5. Add the webhook endpoint

Dashboard → Developers → Webhooks → **Add endpoint**.

**Endpoint URL:**
```
https://itsmyszn.com/api/stripe/webhook
```

**Events to send**, select exactly these six:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

After creating it, click into the endpoint and copy the **Signing secret** (starts `whsec_...`)
→ `STRIPE_WEBHOOK_SECRET`.

Do this once for test mode and once for live mode when you're ready to go live, they're separate
endpoints with separate signing secrets.

## 6. Add every env var to Railway

Railway project → Variables:

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_MONTHLY_3MO_UPFRONT=
STRIPE_PRICE_VIP=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://itsmyszn.com
```

`SUPABASE_SERVICE_ROLE_KEY` is in Supabase → Project Settings → API → **service_role** (the
secret one below the public anon key). Never put this behind `NEXT_PUBLIC_`, it has full
database access with no restrictions.

Redeploy after adding these, env var changes don't apply to an already-running deploy.

## 7. Run the schema migration

Supabase Dashboard → SQL Editor → New query → paste all of `supabase/schema.sql` → Run. Safe to
re-run any time, every statement is guarded. **Re-run it after this update:** it adds the new
`pending_memberships` table that the payment-first flow depends on. Skip this and a logged-out
buyer's payment has nowhere to be parked, so activation can't grant her access.

## 8. Send a test event

Dashboard → Developers → Webhooks → your endpoint → **Send test webhook**, pick
`checkout.session.completed`. You're checking that Stripe gets a `200` back and the response
tab shows `{"received":true}`, not that a real profile updates (a test event has fake ids that
won't match any real customer).

## 9. Run one real test-mode checkout end to end

In test mode, use one of Stripe's test cards (`4242 4242 4242 4242`, any future expiry, any CVC)
to actually go through a checkout link while logged in as a test member. Then check:

- Stripe Dashboard → Payments shows the test payment
- Stripe Dashboard → Webhooks → your endpoint → recent deliveries shows `checkout.session.completed`
  with a `200` response
- Supabase → Table editor → `profiles` → that member's row now has `membership_level`,
  `stripe_customer_id`, `stripe_subscription_id`, `subscription_status = active`, and
  `subscription_current_period_end` set
- The app itself shows her as a member (dashboard unlocks, `/settings` shows "MY SZN Member")

If the profile didn't update, check the webhook's response tab in the Stripe dashboard first,
it shows the exact error the route returned.
