-- Birth details for paid reports and Baddie Sessions, collected AFTER payment instead of as required
-- boxes on the Stripe page (where they were costing sales). One row per paid checkout that still
-- needs them, created by the Stripe webhook (or by the details page itself if she lands there before
-- the webhook does). She fills them in on /order/details, straight after paying or from the link in
-- her confirmation email; submitted_at null = still waiting, shown in /admin/order-details and
-- chased by the hourly reminder job at 24 and 72 hours.

create table if not exists order_birth_details (
  id                  uuid primary key default gen_random_uuid(),
  stripe_session_id   text not null unique,
  email               text not null,
  name                text,
  offer               text not null,
  promises_48h        boolean not null default false,
  birth_date          date,
  birth_time          text,
  birth_time_unknown  boolean not null default false,
  birth_place         text,
  birth_location      jsonb,
  paid_at             timestamptz not null default now(),
  submitted_at        timestamptz,
  reminders_sent      integer not null default 0,
  last_reminder_at    timestamptz
);

create index if not exists order_birth_details_waiting_idx on order_birth_details (paid_at desc) where submitted_at is null;

-- Service role only (webhook, API routes, cron, admin page). No public read or write.
alter table order_birth_details enable row level security;
