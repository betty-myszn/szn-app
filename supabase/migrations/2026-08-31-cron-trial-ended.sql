-- Schedules the trial-ended email.
--
-- The app has no scheduler of its own: trial expiry is computed at request time, so nothing runs at
-- the moment a week is up. This is the clock. pg_cron calls the app's cron route hourly, and the
-- route decides who (if anyone) still needs the email.
--
-- Hourly rather than daily because trials expire at the exact minute they started, spread across the
-- clock, so a daily job would leave someone waiting up to 23 hours after losing access. Running it
-- hourly costs two queries an hour when there is nobody to email.
--
-- Before running: replace PASTE_YOUR_CRON_SECRET_HERE with the value of CRON_SECRET from Railway.
-- The secret is deliberately NOT committed here, since anything in git is a secret you no longer have.
--
-- Run once in the Supabase SQL editor. Re-running is safe: the unschedule call clears any previous
-- version of the job before adding it back.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Drop any earlier version of this job so re-running does not leave two schedules firing.
select cron.unschedule('trial-ended-email') where exists (
  select 1 from cron.job where jobname = 'trial-ended-email'
);

select cron.schedule(
  'trial-ended-email',
  '7 * * * *',   -- seven minutes past every hour, off the hour so it isn't competing with everything else
  $$
  select net.http_post(
    url     := 'https://itsmyszn.com/api/cron/trial-ended',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', 'PASTE_YOUR_CRON_SECRET_HERE'
    ),
    body    := '{}'::jsonb,
    timeout_milliseconds := 25000
  );
  $$
);

-- Check it registered:
--   select jobname, schedule, active from cron.job where jobname = 'trial-ended-email';
--
-- See the last few runs (pg_cron records whether the CALL succeeded, not what the app returned):
--   select start_time, status, return_message from cron.job_run_details
--   where jobid = (select jobid from cron.job where jobname = 'trial-ended-email')
--   order by start_time desc limit 10;
--
-- What the app actually did is in Railway's logs ("cron/trial-ended" lines) and, durably, in
-- transactional_emails where kind = 'trial_ended'.
