import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client, safe to use in "use client" components. Reads the public
// URL and anon key, which are meant to be exposed to the browser (row-level security in
// Supabase is what actually protects the data, not keeping these values secret).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
