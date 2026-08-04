-- Free front-door tier: widen the membership_level check constraint to accept 'free'.
--
-- Run this ONCE against the live database (Supabase dashboard -> SQL editor) BEFORE the free
-- signup route goes live. Until it runs, any free signup fails: the admin client's write of
-- membership_level='free' is rejected by the old constraint and the account is left in a broken
-- half-created state. This is idempotent, safe to re-run.
--
-- 'free' unlocks the live chat rooms only, never the rituals (book club / moon audios / seasonal)
-- or the personalised platform. See hasRoomAccessFromRow in src/lib/membership-gate.ts.
--
-- The old constraint was declared inline on the column, so its name is whatever Postgres generated
-- rather than something we chose. Rather than guess it, drop every check constraint on profiles
-- whose definition mentions membership_level, then add ours back under a known name.

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
  check (membership_level in ('none', 'free', 'social', 'monthly', 'vip'));
