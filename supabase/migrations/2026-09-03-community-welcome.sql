-- Automated welcome message in the community chat, plus the @mention notification it relies on.
--
-- Two things ship here:
--   1. profiles.community_welcomed_at, so a member is welcomed exactly once, ever.
--   2. notify_on_chat_mention, which turns "@name" in a room message into a real notification.
--      This did NOT exist before: mentions rendered pink and did nothing at all, so the person
--      being talked to only found out if they happened to open the room. The welcome message
--      needs it, and every member-to-member mention gets it too, which is the point.
--
-- Run once in the Supabase SQL editor. Safe to re-run.

alter table profiles add column if not exists community_welcomed_at timestamptz;

-- Only the un-welcomed rows are ever scanned, and there are very few of them, so the index is
-- partial rather than over the whole table.
create index if not exists profiles_awaiting_welcome_idx
  on profiles (created_at)
  where community_welcomed_at is null;

-- ============================================================================
-- @MENTIONS IN ROOM CHAT
-- Someone writes "@sarah" in a room -> Sarah gets a notification, the same shape as a reply or a
-- reaction. Matches on profiles.name because that is the name the chat itself renders and the name
-- the @mention autocomplete offers, so what a member types is what gets matched.
--
-- Two people sharing a first name both get notified. That is deliberate: names in here are not
-- unique, and a Sarah told about a message meant for the other Sarah is a smaller failure than a
-- Sarah never told at all.
--
-- Never notifies the sender about their own message.
-- ============================================================================
create or replace function notify_on_chat_mention() returns trigger as $$
declare token text;
begin
  for token in
    select distinct lower(m[1]) from regexp_matches(NEW.content, '@([A-Za-z0-9_]+)', 'g') as m
  loop
    insert into public.notifications (user_id, type, title, body, link, actor)
    select p.id,
           'mention',
           coalesce(nullif(NEW.author, ''), 'Someone') || ' mentioned you in the chat',
           left(NEW.content, 140),
           '/community/room/' || NEW.space_id,
           NEW.author
      from public.profiles p
     where lower(p.name) = token
       and p.id <> NEW.user_id;
  end loop;
  return NEW;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_notify_on_chat_mention on chat_messages;
create trigger trg_notify_on_chat_mention after insert on chat_messages
for each row execute function notify_on_chat_mention();

-- ============================================================================
-- THE CLOCK
-- Every five minutes, because the welcome is deliberately held back a few minutes after signup: a
-- message that lands the millisecond someone joins reads as an automation running, not as a room
-- with people in it. The route decides who (if anyone) is due.
--
-- Before running: replace PASTE_YOUR_CRON_SECRET_HERE with CRON_SECRET from Railway. The secret is
-- deliberately not committed, since anything in git is a secret you no longer have.
-- ============================================================================
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('community-welcome') where exists (
  select 1 from cron.job where jobname = 'community-welcome'
);

select cron.schedule(
  'community-welcome',
  '*/5 * * * *',
  $$
  select net.http_post(
    url     := 'https://itsmyszn.com/api/cron/community-welcome',
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
--   select jobname, schedule, active from cron.job where jobname = 'community-welcome';
--
-- Who has been welcomed:
--   select name, email, created_at, community_welcomed_at from profiles
--   where community_welcomed_at is not null order by community_welcomed_at desc limit 20;
