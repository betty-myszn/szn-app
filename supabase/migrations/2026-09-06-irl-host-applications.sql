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
create unique index if not exists irl_apps_one_per_email_city
  on irl_host_applications (lower(email), city_slug);

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

create policy irl_cities_public_read on irl_cities for select using (recruiting);
