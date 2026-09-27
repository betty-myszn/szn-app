-- PASTE THIS WHOLE FILE INTO SUPABASE > SQL EDITOR > NEW QUERY, THEN PRESS RUN.
-- Safe to run more than once. Sets up the member activity log.
-- Same content as migrations/2026-09-27-member-activity.sql.

-- Which pages each member opens, so we can see what the members who stay actually use.
--
-- The rest of the database only notices things a member writes (a chat, a goal, an RSVP). Reading
-- her season, watching a replay or coming back to the app left no trace, so "last active" undercounted
-- everyone. One row per page visit, written by src/components/ActivityLogger.tsx.
--
-- Path only, never the query string. A member can insert rows for herself and nothing else, and can
-- never read the table back; only admins can read it (and the service role, which bypasses RLS).

create table if not exists public.member_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  path text not null check (char_length(path) between 1 and 300),
  created_at timestamptz not null default now()
);

create index if not exists member_activity_user_created_idx
  on public.member_activity (user_id, created_at desc);
create index if not exists member_activity_created_idx
  on public.member_activity (created_at desc);

alter table public.member_activity enable row level security;

drop policy if exists "member_activity_insert_own" on public.member_activity;
create policy "member_activity_insert_own"
  on public.member_activity for insert
  with check (auth.uid() = user_id);

drop policy if exists "member_activity_admin_read" on public.member_activity;
create policy "member_activity_admin_read"
  on public.member_activity for select
  using (is_admin());
