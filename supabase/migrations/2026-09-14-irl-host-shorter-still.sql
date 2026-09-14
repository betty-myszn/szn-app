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
