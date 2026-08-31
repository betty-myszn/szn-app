-- Repeat-trial prevention on birth details.
--
-- Two banned accounts (cosmicxchemist, alinaxrae) were proved to be one person not by email and not
-- by IP, but by byte-identical birth data: same date, same minute, same coordinates. Email is free
-- to change and a VPN defeats an IP block in seconds. Birth details are the one thing a repeat
-- trialler cannot vary, because varying them means every reading belongs to somebody else.
--
-- Only a HASH is stored. This table cannot be read back into anyone's birth data, and it answers
-- exactly one question: has this chart already had its free week?
--
-- The backfill of existing trials is deliberately NOT done here. It runs from
-- scripts/backfill-trial-fingerprints.mjs, which calls the same birthFingerprint() the signup route
-- uses, so the stored hashes cannot drift from the ones the check looks for. A backfill written
-- twice, once in SQL and once in TypeScript, is a backfill with two chances to disagree.

create table if not exists trial_fingerprints (
  fingerprint text primary key,
  -- The account that claimed it. Kept so a mistaken block can be traced to a real signup and
  -- released by hand; on delete set null so removing an account never resurrects a free trial.
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Service role only. Nothing in the browser may read this (it would let someone test whether a
-- given birth time is already registered) and nothing in the browser may write it (it would let
-- someone claim fingerprints they do not own, locking real people out of the trial).
alter table trial_fingerprints enable row level security;
revoke all on trial_fingerprints from anon, authenticated;
