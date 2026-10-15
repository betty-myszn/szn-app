-- One row per person per offer waitlist (Rich B*tch Rising, The Bad B*tch Report, The Baddie Coven,
-- the Mastermind, the Retreat, the Book). Our own record, independent of Brevo, so the lists can be
-- viewed, segmented and exported from /admin/waitlists even if Brevo is down or a list id isn't set.
-- Unique on (email, offer): signing up twice for the same thing is a no-op, not a duplicate.

create table if not exists waitlist_signups (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  name        text,
  offer       text not null check (offer in ('mastermind','rich-btch-rising','bad-btch-report','baddie-coven','retreat','book')),
  answer      text,
  -- The report waitlists collect birth details so her report can be generated the moment it opens.
  birth_date              date,
  birth_time              text,
  birth_time_approximate  boolean,
  birth_place             text,
  birth_location          jsonb,
  brevo_ok    boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (email, offer)
);

create index if not exists waitlist_signups_offer_idx on waitlist_signups (offer, created_at desc);

-- Service role only (the API route and the admin dashboard). No public read or write.
alter table waitlist_signups enable row level security;
