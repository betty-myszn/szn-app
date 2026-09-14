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
