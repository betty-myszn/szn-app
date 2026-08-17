-- Free 7-day trial: a no-card, no-Stripe, full-access pass.
--
-- Run this ONCE against the live database (Supabase dashboard -> SQL editor) BEFORE the /free-trial
-- route goes live. Until it runs, any trial signup fails: the admin client's write of
-- membership_level='trial' is rejected by the old check constraint and the account is left in a
-- broken half-created state. Idempotent, safe to re-run.
--
-- Modeled as a dedicated membership_level = 'trial' plus three trial columns, deliberately NOT as a
-- fake Stripe 'trialing' subscription (which would give trial members a broken "manage membership"
-- button pointing at /api/stripe/portal, and muddy paid-vs-trial in admin/Brevo). A trial grants the
-- FULL platform (see hasAccessFromRow / hasFullAccessFromRow in src/lib/membership-gate.ts), but
-- access is gated purely on trial_expires_at, evaluated at request time in proxy.ts, so it expires
-- exactly 7 days after signup with no cron job and no Stripe involvement. Every Stripe column stays
-- null for a trial member, so paid-member logic is completely untouched.

alter table profiles add column if not exists trial_started_at timestamptz;
alter table profiles add column if not exists trial_expires_at timestamptz;
-- Set true the moment a trial is created and never cleared automatically, so one email can only ever
-- get one free trial. The signup route also refuses any email that already has ANY account, so this
-- is a second, durable guard specifically for the "already trialled" case. Reset it by hand from the
-- dashboard to re-grant a trial.
alter table profiles add column if not exists trial_used boolean not null default false;

-- Widen the level constraint to accept 'trial'. The old constraint name is Postgres-generated, so
-- drop every check constraint on profiles that mentions membership_level, then add ours back under a
-- known name. Same pattern as 2026-08-04-free-tier.sql.
do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where rel.relname = 'profiles'
      and nsp.nspname = 'public'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%membership_level%'
  loop
    execute format('alter table public.profiles drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.profiles add constraint profiles_membership_level_check
  check (membership_level in ('none', 'free', 'trial', 'social', 'monthly', 'vip'));

-- Trial state is service-role-only, exactly like the membership columns above it: a member's own
-- session can read her row but must never write her own trial window or flip her used flag from the
-- browser. The trial signup route writes these through the admin (service role) key, which bypasses
-- this REVOKE.
revoke update (trial_started_at, trial_expires_at, trial_used) on profiles from authenticated;

-- Supports the admin trial counts (active vs expired) and any request-time expiry lookups.
create index if not exists profiles_trial_expires_at_idx
  on profiles (trial_expires_at)
  where membership_level = 'trial';
