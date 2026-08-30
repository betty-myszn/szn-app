-- Blocking a member from the platform.
--
-- Run once in the Supabase SQL editor. Idempotent, safe to re-run.
--
-- There was no ban/block concept at all before this. A blocked account keeps its row and its data
-- (so nothing is destroyed and a block is fully reversible), but every gate in the app treats it as
-- having no access to anything: not the platform, not the community rooms, not the free home.
--
-- Service-role only, exactly like membership_level: a member's own session can read her row but must
-- never be able to clear her own block from the browser.

alter table profiles add column if not exists blocked boolean not null default false;
alter table profiles add column if not exists blocked_at timestamptz;
alter table profiles add column if not exists blocked_reason text;

revoke update (blocked, blocked_at, blocked_reason) on profiles from authenticated;

-- Blocking is also enforced at the Supabase auth layer (the user is banned in auth.users so no new
-- session can be issued). This column is the app-side half, which additionally kills any session
-- that was already live at the moment of the block, on that session's very next request.
create index if not exists profiles_blocked_idx on profiles (blocked) where blocked;

-- ============================================================================
-- SIGNUP BLOCKLIST
-- Blocking one account only stops that account. This stops the same person coming back with a fresh
-- email, which is the actual failure mode. Checked by BOTH free signup routes before anything is
-- created, so a blocked person simply cannot make a new account.
--
-- Matching is on a NORMALISED email (lowercased, +tags stripped, and for gmail/googlemail the dots
-- removed too, since gmail ignores them) so "c.osmic.x.chemist+new@gmail.com" is recognised as the
-- same address. IP is a separate, optional entry: it is deliberately NOT auto-populated, because
-- households, offices and mobile carriers share IPs and a careless IP ban blocks innocent people.
-- Service-role only: RLS on with zero policies.
-- ============================================================================

create table if not exists blocked_signups (
  id uuid primary key default gen_random_uuid(),
  email_normalised text,
  ip text,
  reason text,
  created_at timestamptz not null default now(),
  check (email_normalised is not null or ip is not null)
);

create unique index if not exists blocked_signups_email_idx on blocked_signups (email_normalised) where email_normalised is not null;
create index if not exists blocked_signups_ip_idx on blocked_signups (ip) where ip is not null;
alter table blocked_signups enable row level security;
