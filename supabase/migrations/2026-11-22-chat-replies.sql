-- Replies in the chat rooms (Betty, 22 Nov 2026). A message can point at the one it answers, so the
-- room shows the quoted original above the reply. Null for an ordinary message. "on delete set null"
-- keeps a reply standing when its original is removed; the room then says the original was deleted.
alter table chat_messages
  add column if not exists reply_to text references chat_messages(id) on delete set null;

create index if not exists chat_messages_reply_to_idx on chat_messages(reply_to);
