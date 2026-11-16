-- Schedules the daily member nudges (/api/cron/member-nudge).
--
--   claim   → paid for the Coven, never set up an account: one email at 3 days, one more at 10 days
--   missing → active member who hasn't logged in for 7+ days: at most once every 21 days
--
-- Sends by default (approved by Betty 16 Nov 2026). To pause it, set MEMBER_NUDGE_SEND=off in Railway.
--
-- Before running: replace PASTE_YOUR_CRON_SECRET_HERE with the value of CRON_SECRET from Railway.
-- Run once in the Supabase SQL editor. Re-running is safe: it clears the old job first.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('member-nudge') where exists (
  select 1 from cron.job where jobname = 'member-nudge'
);

select cron.schedule(
  'member-nudge',
  '0 10 * * *',   -- 10:00 UTC every day (10am UK in winter, 11am in summer)
  $$
  select net.http_post(
    url     := 'https://itsmyszn.com/api/cron/member-nudge',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', 'PASTE_YOUR_CRON_SECRET_HERE'
    ),
    body    := '{}'::jsonb,
    timeout_milliseconds := 25000
  );
  $$
);
