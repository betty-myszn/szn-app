-- The chat rooms are for paying members and the owner only (Betty, 9 Nov 2026).
-- The site and /api/chat/send already enforce this; these policies close the database itself.

create or replace function public.has_paid_chat_access()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and not coalesce(p.blocked, false)
      and (
        p.is_admin
        or (p.membership_level in ('social', 'monthly', 'vip')
            and p.subscription_status in ('active', 'trialing', 'past_due')
            and not (coalesce(p.subscription_cancel_at_period_end, false)
                     and p.subscription_current_period_end <= now()))
      )
  );
$$;

drop policy if exists "chat_messages_select_all" on chat_messages;
create policy "chat_messages_select_all" on chat_messages
  for select using (public.has_paid_chat_access());

drop policy if exists "chat_messages_insert_own" on chat_messages;
create policy "chat_messages_insert_own" on chat_messages
  for insert with check (auth.uid() = user_id and public.has_paid_chat_access());
