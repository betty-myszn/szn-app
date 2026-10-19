-- One row per booking attempt for a paid MY SZN event (BAD B*TCHES MOONIFEST first). The row is
-- written from the booking form BEFORE Stripe, so her birth details are saved even if the webhook
-- is slow; the Stripe webhook flips it to paid. Birth details are for her report only: service role
-- access only, never readable from the browser.

create table if not exists event_bookings (
  id                      uuid primary key default gen_random_uuid(),
  event_slug              text not null,
  email                   text not null,
  name                    text,
  birth_date              date,
  birth_time              text,
  birth_time_unknown      boolean not null default false,
  birth_place             text,
  birth_location          jsonb,
  status                  text not null default 'pending' check (status in ('pending','paid','refunded')),
  stripe_session_id       text unique,
  amount_total            integer,
  currency                text,
  paid_at                 timestamptz,
  confirmation_sent_at    timestamptz,
  created_at              timestamptz not null default now()
);

create index if not exists event_bookings_event_idx on event_bookings (event_slug, status, created_at desc);

alter table event_bookings enable row level security;
