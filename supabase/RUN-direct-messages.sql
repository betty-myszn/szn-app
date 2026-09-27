-- PASTE THIS WHOLE FILE INTO SUPABASE > SQL EDITOR > NEW QUERY, THEN PRESS RUN.
-- Safe to run more than once. Sets up direct messages between members and Betty.
-- Same content as migrations/2026-09-27-direct-messages.sql.

-- Direct messages between a member and Betty.
--
-- One thread per member, keyed by member_id. Every row is either the member writing to Betty or
-- Betty writing back; sender_id says which. read_at is set when the other side opens the thread.
--
-- A member can read her own thread and nothing else. There are no insert, update or delete policies
-- on purpose: every write goes through /api/messages on the server, which decides who may send what,
-- so a member can never write into another member's thread or mark Betty's messages read.

create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists direct_messages_member_created_idx
  on public.direct_messages (member_id, created_at);

alter table public.direct_messages enable row level security;

drop policy if exists "direct_messages_member_reads_own_thread" on public.direct_messages;
create policy "direct_messages_member_reads_own_thread"
  on public.direct_messages for select
  using (auth.uid() = member_id);
