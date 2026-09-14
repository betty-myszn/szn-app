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
