import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS and the column-level REVOKE on profiles entirely, this is
// how membership_level/stripe_* columns actually get written. Never import this into anything
// that runs in the browser, SUPABASE_SERVICE_ROLE_KEY has full database access with no row or
// column restrictions, it must stay a server-only secret (no NEXT_PUBLIC_ prefix).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
