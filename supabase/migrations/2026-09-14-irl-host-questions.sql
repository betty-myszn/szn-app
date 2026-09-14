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
