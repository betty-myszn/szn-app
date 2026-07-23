-- MY SZN: Supabase schema + RLS
-- Run this once in the Supabase dashboard: Project > SQL Editor > New query > paste > Run.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.

-- ============================================================================
-- PROFILES
-- One row per auth.users row, created automatically on signup by the trigger below.
-- ============================================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  onboarded boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Auto-creates a profile row the moment someone signs up via magic link.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Used inside RLS policies below. security definer so it can read profiles.is_admin without
-- recursing through the profiles table's own RLS (which only allows reading your own row).
create or replace function is_admin()
returns boolean as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$ language sql security definer stable set search_path = public;

-- To make yourself an admin, run this once with your own user id (Authentication > Users
-- in the dashboard has the id), or by email:
-- update profiles set is_admin = true where email = 'hello@thecosmicco.com';

-- Lets admins see the real member list (default profiles policy above only allows reading your
-- own row), needed for any admin-facing member count or directory.
drop policy if exists "profiles_admin_read" on profiles;
create policy "profiles_admin_read" on profiles for select using (is_admin());

-- Small per-member settings blobs, one row already exists per member via the signup trigger,
-- simpler than two more one-row-per-user tables for two tiny key/value preference sets.
alter table profiles add column if not exists dashboard_prefs jsonb;
alter table profiles add column if not exists email_prefs jsonb;

-- ============================================================================
-- MEMBERSHIP / STRIPE
-- Written only by the Stripe webhook (service role, bypasses RLS and the REVOKE below), a
-- member's own session can read her own row but never write these columns directly, membership
-- status is only ever true because Stripe said so. The two real MY SZN tiers are 'monthly'
-- (covers both the $111/mo and the $333-for-3-months-upfront checkout, same underlying
-- membership, just paid on a different schedule) and 'vip' ($555/mo), plus 'none' pre-purchase.
-- ============================================================================

alter table profiles add column if not exists membership_level text not null default 'none';
alter table profiles add column if not exists stripe_customer_id text;
alter table profiles add column if not exists stripe_subscription_id text;
alter table profiles add column if not exists stripe_price_id text;
alter table profiles add column if not exists subscription_status text;
alter table profiles add column if not exists subscription_current_period_end timestamptz;
alter table profiles add column if not exists subscription_cancel_at_period_end boolean not null default false;
alter table profiles add column if not exists membership_started_at timestamptz;
alter table profiles add column if not exists membership_updated_at timestamptz;

alter table profiles drop constraint if exists profiles_membership_level_check;
alter table profiles add constraint profiles_membership_level_check
  check (membership_level in ('none', 'monthly', 'vip'));

create unique index if not exists profiles_stripe_customer_id_idx on profiles (stripe_customer_id) where stripe_customer_id is not null;
create index if not exists profiles_stripe_subscription_id_idx on profiles (stripe_subscription_id) where stripe_subscription_id is not null;
create index if not exists profiles_subscription_status_idx on profiles (subscription_status) where subscription_status is not null;

-- RLS alone isn't enough here: "profiles_update_own" lets a member update her own row, but RLS
-- has no concept of "this column but not that one", without this REVOKE she could set her own
-- membership_level to 'vip' from the browser console. Column-level grants are a Postgres feature,
-- separate from RLS. The webhook writes through the service role key, which bypasses grants and
-- RLS entirely, so it's unaffected by this.
revoke update (
  membership_level, stripe_customer_id, stripe_subscription_id, stripe_price_id,
  subscription_status, subscription_current_period_end, subscription_cancel_at_period_end,
  membership_started_at, membership_updated_at
) on profiles from authenticated;

-- Stripe retries webhook deliveries on anything short of a fast 2xx, and can also send the same
-- event more than once in the ordinary course of things, this is what makes the webhook handler
-- idempotent: it inserts the event id before doing any work and bails out if that insert hits
-- the primary key conflict, meaning this exact event already ran. service-role only, a member
-- has no reason to ever read this table.
create table if not exists stripe_webhook_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table stripe_webhook_events enable row level security;

-- ============================================================================
-- REFERRALS
-- Every member gets a stable short code the moment her profile is created. Sharing her invite
-- link (?ref=CODE) and a new member claiming it are two separate steps, since the code has to
-- exist before anyone can share it, and claiming only makes sense once the new member is
-- actually logged in for the first time.
-- ============================================================================

alter table profiles add column if not exists referral_code text unique;
alter table profiles add column if not exists referred_by uuid references profiles(id);

create or replace function generate_referral_code()
returns text as $$
  select lower(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
$$ language sql volatile;

-- Replaces the earlier version of this trigger (only set id/email) so every new profile also
-- gets a referral code the moment it's created, safe to re-run since create or replace.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (new.id, new.email, generate_referral_code())
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Backfills a referral code for any profile created before this feature existed.
update profiles set referral_code = generate_referral_code() where referral_code is null;

-- Called by a new member once, right after her first login, with whatever code (if any) was in
-- the invite link she signed up from. security definer so she can look up the referrer's id by
-- code without needing broad read access to every profile.
create or replace function claim_referral(p_code text)
returns void as $$
declare
  referrer_id uuid;
begin
  select id into referrer_id from profiles where referral_code = p_code;
  if referrer_id is not null and referrer_id != auth.uid() then
    update profiles set referred_by = referrer_id where id = auth.uid() and referred_by is null;
  end if;
end;
$$ language plpgsql security definer set search_path = public;

-- How many people a member has referred, security definer for the same reason as above, she
-- can't otherwise see rows belonging to the people she referred.
create or replace function get_referral_count()
returns integer as $$
  select count(*)::integer from profiles where referred_by = auth.uid();
$$ language sql security definer stable set search_path = public;

-- ============================================================================
-- BIRTH DATA + CHART CACHE
-- One row per member, replaces the myszn_birth_data / myszn_chart_cache localStorage keys.
-- ============================================================================

create table if not exists birth_data (
  user_id uuid primary key references profiles(id) on delete cascade,
  name text not null,
  date_of_birth date not null,
  birth_time time not null,
  birth_time_approximate boolean not null default false,
  place_name text not null,
  city text not null,
  country text not null,
  latitude double precision not null,
  longitude double precision not null,
  timezone text not null,
  updated_at timestamptz not null default now()
);

alter table birth_data enable row level security;

drop policy if exists "birth_data_owner" on birth_data;
create policy "birth_data_owner" on birth_data for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists chart_cache (
  user_id uuid primary key references profiles(id) on delete cascade,
  chart_data jsonb not null,
  placements jsonb not null,
  calculated_at timestamptz not null default now()
);

alter table chart_cache enable row level security;

drop policy if exists "chart_cache_owner" on chart_cache;
create policy "chart_cache_owner" on chart_cache for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- GOALS
-- ============================================================================

-- ids below are text, not uuid: the app generates its own string ids client-side (Date.now()
-- based) for goals, journal entries, chat messages, posts, polls and broadcasts, and Supabase
-- just stores whatever id the app already assigned rather than minting a second, different one.
create table if not exists goals (
  id text primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  category text not null,
  status text not null default 'active',
  progress int not null default 0,
  created_at timestamptz not null default now()
);

alter table goals enable row level security;

drop policy if exists "goals_owner" on goals;
create policy "goals_owner" on goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists goal_progress (
  id text primary key,
  goal_id text not null references goals(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  note text not null default '',
  progress int not null,
  created_at timestamptz not null default now()
);

alter table goal_progress enable row level security;

drop policy if exists "goal_progress_owner" on goal_progress;
create policy "goal_progress_owner" on goal_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- JOURNAL
-- ============================================================================

create table if not exists journal_entries (
  id text primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  prompt text,
  content text not null,
  season text not null,
  created_at timestamptz not null default now()
);

alter table journal_entries enable row level security;

drop policy if exists "journal_owner" on journal_entries;
create policy "journal_owner" on journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- SEASONAL CHALLENGES
-- ============================================================================

create table if not exists challenge_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  season text not null,
  challenge_id text not null,
  category text not null,
  xp int not null default 0,
  hidden boolean not null default false,
  completed_at timestamptz not null default now(),
  unique (user_id, season, challenge_id)
);

alter table challenge_completions enable row level security;

drop policy if exists "challenges_owner" on challenge_completions;
create policy "challenges_owner" on challenge_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- SIGNALS
-- Every meaningful action a member takes (goal set, goal progress, challenge completed, journal
-- entry), used to detect when she's gone quiet on a goal. See src/lib/signals.ts.
-- ============================================================================

create table if not exists signals (
  id text primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,
  category text not null,
  season text not null,
  ref_id text,
  created_at timestamptz not null default now()
);

alter table signals enable row level security;

drop policy if exists "signals_owner" on signals;
create policy "signals_owner" on signals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- ADMIN BROADCASTS
-- Read for every member, write restricted to admins.
-- ============================================================================

create table if not exists broadcasts (
  id text primary key,
  title text not null,
  body text not null,
  author_email text not null,
  created_at timestamptz not null default now()
);

alter table broadcasts enable row level security;

drop policy if exists "broadcasts_select_all" on broadcasts;
create policy "broadcasts_select_all" on broadcasts for select using (auth.role() = 'authenticated');

drop policy if exists "broadcasts_admin_write" on broadcasts;
create policy "broadcasts_admin_write" on broadcasts for all using (is_admin()) with check (is_admin());

create table if not exists broadcast_reads (
  user_id uuid not null references profiles(id) on delete cascade,
  broadcast_id text not null references broadcasts(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, broadcast_id)
);

alter table broadcast_reads enable row level security;

drop policy if exists "broadcast_reads_owner" on broadcast_reads;
create policy "broadcast_reads_owner" on broadcast_reads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- POLLS
-- Everyone can read polls + aggregate responses, each member can only write their own response.
-- ============================================================================

create table if not exists polls (
  id text primary key,
  question text not null,
  type text not null,
  options text[] not null default '{}',
  active boolean not null default true,
  author_email text not null,
  season text not null,
  created_at timestamptz not null default now()
);

alter table polls enable row level security;

drop policy if exists "polls_select_all" on polls;
create policy "polls_select_all" on polls for select using (auth.role() = 'authenticated');

drop policy if exists "polls_admin_write" on polls;
create policy "polls_admin_write" on polls for all using (is_admin()) with check (is_admin());

create table if not exists poll_responses (
  id text primary key,
  poll_id text not null references polls(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  respondent text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

alter table poll_responses enable row level security;

drop policy if exists "poll_responses_select_all" on poll_responses;
create policy "poll_responses_select_all" on poll_responses for select using (auth.role() = 'authenticated');

drop policy if exists "poll_responses_insert_own" on poll_responses;
create policy "poll_responses_insert_own" on poll_responses for insert with check (auth.uid() = user_id);

-- ============================================================================
-- EVENTS: RSVP + NOTIFY ME
-- ============================================================================

create table if not exists rsvps (
  user_id uuid not null references profiles(id) on delete cascade,
  event_id text not null,
  status text not null,
  responded_at timestamptz not null default now(),
  reminder_email boolean not null default true,
  reminder_push boolean not null default true,
  primary key (user_id, event_id)
);

alter table rsvps enable row level security;

drop policy if exists "rsvps_owner" on rsvps;
create policy "rsvps_owner" on rsvps for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists notify_me (
  user_id uuid not null references profiles(id) on delete cascade,
  event_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

alter table notify_me enable row level security;

drop policy if exists "notify_me_owner" on notify_me;
create policy "notify_me_owner" on notify_me for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- CHAT ROOMS (per space/sign)
-- ============================================================================

create table if not exists chat_messages (
  id text primary key,
  space_id text not null,
  user_id uuid not null references profiles(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table chat_messages enable row level security;

drop policy if exists "chat_messages_select_all" on chat_messages;
create policy "chat_messages_select_all" on chat_messages for select using (auth.role() = 'authenticated');

drop policy if exists "chat_messages_insert_own" on chat_messages;
create policy "chat_messages_insert_own" on chat_messages for insert with check (auth.uid() = user_id);

drop policy if exists "chat_messages_delete_own_or_admin" on chat_messages;
create policy "chat_messages_delete_own_or_admin" on chat_messages for delete using (auth.uid() = user_id or is_admin());

create table if not exists chat_reactions (
  message_id text not null references chat_messages(id) on delete cascade,
  emoji text not null,
  user_id uuid not null references profiles(id) on delete cascade,
  -- Stored directly rather than joined from profiles at read time: RLS only lets a member read
  -- her own profile row, so a display name for someone else's reaction has to live here instead.
  author text not null,
  primary key (message_id, emoji, user_id)
);

alter table chat_reactions enable row level security;

drop policy if exists "chat_reactions_select_all" on chat_reactions;
create policy "chat_reactions_select_all" on chat_reactions for select using (auth.role() = 'authenticated');

drop policy if exists "chat_reactions_owner" on chat_reactions;
create policy "chat_reactions_owner" on chat_reactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists room_seen (
  user_id uuid not null references profiles(id) on delete cascade,
  space_id text not null,
  seen_at timestamptz not null default now(),
  primary key (user_id, space_id)
);

alter table room_seen enable row level security;

drop policy if exists "room_seen_owner" on room_seen;
create policy "room_seen_owner" on room_seen for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- COMMUNITY FEED (posts, likes, comments)
-- ============================================================================

create table if not exists community_posts (
  id text primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  author text not null,
  sign text not null,
  space text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table community_posts enable row level security;

drop policy if exists "community_posts_select_all" on community_posts;
create policy "community_posts_select_all" on community_posts for select using (auth.role() = 'authenticated');

drop policy if exists "community_posts_insert_own" on community_posts;
create policy "community_posts_insert_own" on community_posts for insert with check (auth.uid() = user_id);

drop policy if exists "community_posts_delete_own_or_admin" on community_posts;
create policy "community_posts_delete_own_or_admin" on community_posts for delete using (auth.uid() = user_id or is_admin());

create table if not exists community_likes (
  post_id text not null references community_posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

alter table community_likes enable row level security;

drop policy if exists "community_likes_select_all" on community_likes;
create policy "community_likes_select_all" on community_likes for select using (auth.role() = 'authenticated');

drop policy if exists "community_likes_owner" on community_likes;
create policy "community_likes_owner" on community_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists community_comments (
  id text primary key,
  post_id text not null references community_posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table community_comments enable row level security;

drop policy if exists "community_comments_select_all" on community_comments;
create policy "community_comments_select_all" on community_comments for select using (auth.role() = 'authenticated');

drop policy if exists "community_comments_insert_own" on community_comments;
create policy "community_comments_insert_own" on community_comments for insert with check (auth.uid() = user_id);

drop policy if exists "community_comments_delete_own_or_admin" on community_comments;
create policy "community_comments_delete_own_or_admin" on community_comments for delete using (auth.uid() = user_id or is_admin());

-- ============================================================================
-- SAFETY VERIFICATION
-- Every table above already has its own `enable row level security` line right next to its
-- `create table`, this block re-asserts it one more time for all of them, in one place, at the
-- very end. `enable row level security` is idempotent, running it again on a table that's
-- already RLS-enabled is a no-op, it can't break anything or change any data. This exists purely
-- so RLS status is never ambiguous, no table in this schema can end up without it.
-- ============================================================================

alter table profiles enable row level security;
alter table stripe_webhook_events enable row level security;
alter table birth_data enable row level security;
alter table chart_cache enable row level security;
alter table goals enable row level security;
alter table goal_progress enable row level security;
alter table journal_entries enable row level security;
alter table challenge_completions enable row level security;
alter table signals enable row level security;
alter table broadcasts enable row level security;
alter table broadcast_reads enable row level security;
alter table polls enable row level security;
alter table poll_responses enable row level security;
alter table rsvps enable row level security;
alter table notify_me enable row level security;
alter table chat_messages enable row level security;
alter table chat_reactions enable row level security;
alter table room_seen enable row level security;
alter table community_posts enable row level security;
alter table community_likes enable row level security;
alter table community_comments enable row level security;
