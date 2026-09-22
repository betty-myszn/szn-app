-- MY SZN IRL host applications: all five setup files in order, for one paste into the Supabase SQL editor.
-- Safe to run more than once.

-- ===== 2026-09-06-irl-host-applications.sql
-- MY SZN IRL host applications.
--
-- Three tables rather than one, because they answer different questions and have different
-- lifespans: what she sent us (never edited), what we think of her (never shown to her), and who
-- ended up hosting.
--
-- Cities live in their own table rather than a CHECK constraint or a hardcoded list, so opening a
-- fourth city is one INSERT rather than a migration plus a deploy.

create table if not exists irl_cities (
  slug        text primary key,
  name        text not null,
  -- false = we are not actively recruiting here, so applications are held as expressions of
  -- interest rather than mixed into live recruitment for the launch cities.
  recruiting  boolean not null default true,
  sort_order  int not null default 100,
  created_at  timestamptz not null default now()
);

insert into irl_cities (slug, name, recruiting, sort_order) values
  ('london',      'London',      true,  1),
  ('new-york',    'New York',    true,  2),
  ('los-angeles', 'Los Angeles', true,  3),
  ('other',       'Other',       false, 99)
on conflict (slug) do nothing;

-- ── the application, exactly as she submitted it ──────────────────────────────
create table if not exists irl_host_applications (
  id              uuid primary key default gen_random_uuid(),
  -- Short human-quotable reference for emails and interviews, e.g. IRL-LDN-0007.
  reference       text unique,
  submitted_at    timestamptz not null default now(),

  full_name       text not null,
  email           text not null,
  phone           text,
  instagram       text,
  tiktok          text,
  linkedin        text,

  city_slug       text not null references irl_cities(slug),
  -- Only filled when city_slug = 'other'. Kept as free text on purpose: the whole point is to find
  -- out which cities people are asking for.
  other_city      text,

  occupation      text not null,
  about_you       text not null,
  why_host        text not null,
  astrology_relationship text not null,
  astrology_level text not null check (astrology_level in
    ('very_confident','know_my_chart','basics','learning','new_but_curious')),
  community_means text not null,
  speaking_comfort int not null check (speaking_comfort between 1 and 5),
  hosting_experience text not null check (hosting_experience in
    ('professionally','casually','a_little','never_but_keen')),
  relevant_experience text,
  scenario_answer text not null,
  local_ideas     text not null,
  frequency_ok    text not null check (frequency_ok in ('yes','usually','discuss')),
  evenings_ok     text not null check (evenings_ok in ('yes','mostly','occasionally')),
  travel_ok       text not null check (travel_ok in ('yes','depends')),
  side_role_ok    text not null check (side_role_ok in ('yes','no')),
  partnerships_interest text not null check (partnerships_interest in ('yes','potentially','hosting_only')),
  girls_night     text not null,

  -- ── internal only. NEVER returned to an applicant. ──
  status          text not null default 'new' check (status in
    ('new','reviewing','shortlisted','interview','second_interview','accepted','rejected','hold','other_city_waitlist')),
  shortlisted     boolean not null default false,
  admin_notes     text,
  red_flags       text,
  things_we_loved text,
  -- 1-5 each, all hidden from the applicant.
  rating_warmth       int check (rating_warmth between 1 and 5),
  rating_communication int check (rating_communication between 1 and 5),
  rating_reliability  int check (rating_reliability between 1 and 5),
  rating_hosting      int check (rating_hosting between 1 and 5),
  rating_local        int check (rating_local between 1 and 5),
  rating_creativity   int check (rating_creativity between 1 and 5),
  rating_brand_fit    int check (rating_brand_fit between 1 and 5),
  rating_partnerships int check (rating_partnerships between 1 and 5),
  -- Average of whichever ratings have been given, maintained by the app so sorting is cheap.
  overall_score   numeric(3,2),

  updated_at      timestamptz not null default now()
);

create index if not exists irl_apps_city on irl_host_applications (city_slug, status);
create index if not exists irl_apps_submitted on irl_host_applications (submitted_at desc);
create index if not exists irl_apps_shortlisted on irl_host_applications (shortlisted) where shortlisted;
-- One live application per email per city. A second attempt updates rather than duplicating, which
-- is also the backstop behind the double-click guard in the form.
-- On the plain column, which the apply route lowercases before saving: the upsert names
-- (email, city_slug) and Postgres only matches it against an index on exactly those columns.
create unique index if not exists irl_apps_one_per_email_city
  on irl_host_applications (email, city_slug);

-- ── interview notes, one row per interview ────────────────────────────────────
create table if not exists irl_interview_notes (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references irl_host_applications(id) on delete cascade,
  interview_date date,
  interviewed_by text,
  notes          text,
  strengths      text,
  concerns       text,
  suggested_city text references irl_cities(slug),
  recommendation text,
  created_at     timestamptz not null default now()
);
create index if not exists irl_interview_app on irl_interview_notes (application_id);

-- ── accepted hosts ────────────────────────────────────────────────────────────
-- Separate from the application because the job outlives the recruitment, and because a host's
-- payment and contract state has no business sitting in a row anyone reviews applications from.
create table if not exists irl_hosts (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid references irl_host_applications(id),
  full_name       text not null,
  email           text not null,
  phone           text,
  instagram       text,
  tiktok          text,
  linkedin        text,
  city_slug       text not null references irl_cities(slug),
  start_date      date,
  host_status     text not null default 'onboarding' check (host_status in ('onboarding','active','paused','ended')),
  training_completed  boolean not null default false,
  contract_completed  boolean not null default false,
  payment_details_received boolean not null default false,
  internal_notes  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists irl_hosts_city on irl_hosts (city_slug, host_status);

-- ── access ────────────────────────────────────────────────────────────────────
-- Everything here is either someone's personal application or our private opinion of her, so the
-- browser gets nothing at all. Reads and writes go through the service role in server routes, which
-- is also where the admin check lives. The one exception is the city list, which the public form
-- needs in order to render its dropdown.
alter table irl_host_applications enable row level security;
alter table irl_interview_notes    enable row level security;
alter table irl_hosts              enable row level security;
alter table irl_cities             enable row level security;
revoke all on irl_host_applications, irl_interview_notes, irl_hosts from anon, authenticated;

drop policy if exists irl_cities_public_read on irl_cities;
create policy irl_cities_public_read on irl_cities for select using (recruiting);

-- ===== 2026-09-11-irl-host-birth-chart.sql
-- MY SZN IRL host applications: birth details, so every applicant's chart and human design reach the
-- dashboard and the team email, and a direct question about her people skills.
--
-- Run after 2026-09-06-irl-host-applications.sql. Additive only, so it is safe whether or not that
-- one has taken applications yet. The columns are nullable because a NOT NULL column cannot be
-- added to a table that already has rows; the apply route is what makes them required.

alter table irl_host_applications
  add column if not exists birth_date             date,
  add column if not exists birth_time             time,
  -- The same "approximate / unknown exact time" tick the free chart form has.
  add column if not exists birth_time_approximate boolean not null default false,
  -- The place she picked from the list, with the coordinates and timezone the chart is worked
  -- out from.
  add column if not exists birth_place            text,
  add column if not exists birth_lat              double precision,
  add column if not exists birth_lng              double precision,
  add column if not exists birth_tz               text,
  add column if not exists people_skills          text,
  -- Big three, personal planets and human design, worked out once when she applies (see
  -- src/lib/irl-chart.ts), so the dashboard can filter on them without running the ephemeris.
  add column if not exists chart_summary          jsonb;

-- ===== 2026-09-14-irl-host-questions.sql
-- MY SZN IRL host applications: the three questions Betty added on 14 Sep 2026, her customer
-- service experience, examples of events she has hosted, and what her availability looks like.
--
-- Run after 2026-09-11-irl-host-birth-chart.sql. Additive and nullable like that one, so it is safe
-- on a table that already has rows; the apply route is what makes them required.

alter table irl_host_applications
  add column if not exists customer_service text,
  -- Only asked when she says she has hosted before, so it stays empty for "never, but I'd love to".
  add column if not exists hosting_examples text,
  add column if not exists availability     text;

-- ===== 2026-09-14-irl-host-shorter-form.sql
-- MY SZN IRL host applications: the shorter form of 14 Sep 2026. Six questions came off the form
-- (about you, astrology level, what community means, hosted before, evenings and weekends, venues
-- and partners), so their columns stop being required, and the new scenario, two women who only
-- talk to each other all night, gets a column of its own.
--
-- Run after 2026-09-14-irl-host-questions.sql. The old answers stay where they are; the check
-- constraints on those columns already allow an empty value.

alter table irl_host_applications
  alter column about_you             drop not null,
  alter column astrology_level       drop not null,
  alter column community_means       drop not null,
  alter column hosting_experience    drop not null,
  alter column evenings_ok           drop not null,
  alter column partnerships_interest drop not null,
  add column if not exists second_scenario text;

-- ===== 2026-09-14-irl-host-shorter-still.sql
-- MY SZN IRL host applications: fourteen answers, 14 Sep 2026. Leading a room 1-5, the three
-- places, travel and freelance pay came off the form, and the separate experience question folded
-- into the work one. The single practical question left is stored in frequency_ok, which stays
-- required. The rest stop being required; their check constraints already allow an empty value.
--
-- Run after 2026-09-14-irl-host-shorter-form.sql.

alter table irl_host_applications
  alter column speaking_comfort drop not null,
  alter column local_ideas      drop not null,
  alter column travel_ok        drop not null,
  alter column side_role_ok     drop not null;

