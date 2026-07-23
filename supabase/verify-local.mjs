// Local-only verification script. Run this yourself, it reads SUPABASE_SERVICE_ROLE_KEY from
// your own .env.local, never pastes it anywhere, never gets seen by anyone else. Report back
// what it prints, not the key itself.
//
// Usage (from the app/ directory):
//   node --env-file=.env.local supabase/verify-local.mjs
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to already be set in .env.local.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const REQUIRED_TABLES = [
  "profiles", "stripe_webhook_events", "birth_data", "chart_cache", "goals", "goal_progress",
  "journal_entries", "challenge_completions", "signals", "broadcasts", "broadcast_reads",
  "polls", "poll_responses", "rsvps", "notify_me", "chat_messages", "chat_reactions",
  "room_seen", "community_posts", "community_likes", "community_comments",
];

const MEMBERSHIP_COLUMNS = [
  "membership_level", "stripe_customer_id", "stripe_subscription_id", "stripe_price_id",
  "subscription_status", "subscription_current_period_end", "subscription_cancel_at_period_end",
  "membership_started_at", "membership_updated_at",
];

let failures = 0;

console.log(`Checking ${url} ...\n`);

for (const table of REQUIRED_TABLES) {
  const { error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`✗ ${table}: ${error.message}`);
    failures++;
  } else {
    console.log(`✓ ${table}`);
  }
}

console.log("\nChecking membership columns on profiles ...");
const { error: colError } = await supabase.from("profiles").select(MEMBERSHIP_COLUMNS.join(", ")).limit(1);
if (colError) {
  console.log(`✗ membership columns: ${colError.message}`);
  failures++;
} else {
  console.log(`✓ all ${MEMBERSHIP_COLUMNS.length} membership columns present`);
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed, see above.`);
process.exit(failures === 0 ? 0 : 1);
