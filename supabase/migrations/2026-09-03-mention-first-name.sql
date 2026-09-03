-- Fixes who an @mention actually notifies.
--
-- A mention has to be written as a first name, "@Sarah", because the mention syntax cannot carry a
-- space. The first version of this trigger compared that token against the WHOLE profiles.name, so:
--   - a member called "Sarah Elizabeth" was never notified when someone tagged her, and
--   - two unrelated members both called "Sarah" were notified instead.
-- Now it compares against the first word of the name, with accents and punctuation stripped the
-- same way the app strips them when it writes a mention, so "@DeJoire" reaches "DeJoiré".
--
-- Automated welcome posts are skipped here: those know exactly which member ids they are about and
-- notify them directly, which cannot reach the wrong person or miss the right one. Without this
-- skip, anyone whose first name matched would get a second, duplicate notification.
--
-- Two people sharing a first name both get notified, which is unavoidable when a name is all a
-- human mention has to go on, and better than the person meant never hearing about it.
--
-- Run once in the Supabase SQL editor. Safe to re-run.

create extension if not exists unaccent;

create or replace function notify_on_chat_mention() returns trigger as $$
declare token text;
begin
  -- Welcome posts do their own, precise notifying. See src/lib/community/welcome-message.ts.
  if NEW.id like 'welcome-%' then
    return NEW;
  end if;

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
     where lower(regexp_replace(unaccent(split_part(trim(p.name), ' ', 1)), '[^A-Za-z0-9_]', '', 'g')) = token
       and p.id <> NEW.user_id;
  end loop;
  return NEW;
end;
$$ language plpgsql security definer set search_path = public, extensions;

drop trigger if exists trg_notify_on_chat_mention on chat_messages;
create trigger trg_notify_on_chat_mention after insert on chat_messages
for each row execute function notify_on_chat_mention();
