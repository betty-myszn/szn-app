-- One row per person per Stripe payment link, written the moment she gives her email on the way to
-- checkout (CheckoutEmailGate), BEFORE Stripe opens. Stripe only keeps an email for an unfinished
-- checkout if she typed it on Stripe's own page, which almost nobody who leaves has done, so this is
-- the only record of who nearly bought. The Stripe webhook stamps paid_at when the same email
-- completes the same payment link; rows with paid_at still null are the drop-offs shown in
-- /admin/checkout-dropoffs.
-- Unique on (email, checkout_url): coming back for another go bumps attempts, it never duplicates.

create table if not exists checkout_leads (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  checkout_url       text not null,
  offer              text,
  page               text,
  attempts           integer not null default 1,
  created_at         timestamptz not null default now(),
  last_started_at    timestamptz not null default now(),
  paid_at            timestamptz,
  stripe_session_id  text,
  unique (email, checkout_url)
);

create index if not exists checkout_leads_recent_idx on checkout_leads (last_started_at desc);

-- Service role only (the API route, the webhook and the admin page). No public read or write.
alter table checkout_leads enable row level security;
