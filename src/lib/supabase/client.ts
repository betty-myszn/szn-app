import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client, safe to use in "use client" components. Reads the public
// URL and anon key, which are meant to be exposed to the browser (row-level security in
// Supabase is what actually protects the data, not keeping these values secret).
// ~60 days: comfortably past the "stay logged in at least 30 days" bar. The browser keeps the
// auth cookie this long; the access token inside is refreshed automatically well before it lapses
// (proxy.ts touches the session on every request), so a member only ever logs in again if she
// explicitly signs out or is away for two months straight.
const SESSION_MAX_AGE = 60 * 60 * 24 * 60;

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: { maxAge: SESSION_MAX_AGE } }
  );
}
