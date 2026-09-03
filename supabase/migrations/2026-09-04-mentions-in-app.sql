-- Retires the @mention notification trigger.
--
-- Mentions are now resolved in the app (src/app/api/chat/send/route.ts), which turns "@name" into
-- user ids ONCE and then addresses the notification and the email by id. The trigger could only
-- ever match text against profiles.name, which missed "Sarah Elizabeth" whenever she was tagged as
-- "@Sarah" (a mention cannot contain a space) and notified two unrelated members called Sarah
-- instead.
--
-- Dropping it is what stops those two systems both firing and double-notifying.

drop trigger if exists trg_notify_on_chat_mention on chat_messages;
drop function if exists notify_on_chat_mention();
