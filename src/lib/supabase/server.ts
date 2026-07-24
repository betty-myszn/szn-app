import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ~60 days, so the session cookie persists well past the "at least 30 days" bar. Matches the
// browser client and proxy so every place that writes the auth cookie agrees on its lifetime.
const SESSION_MAX_AGE = 60 * 60 * 24 * 60;

// Server-side Supabase client for Server Components, Server Actions and Route Handlers.
// Cookie writes silently no-op when called from a Server Component render (where Next.js
// doesn't allow setting cookies), the session refresh in src/proxy.ts covers that case.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { maxAge: SESSION_MAX_AGE },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component, proxy.ts handles refreshing the session instead.
          }
        },
      },
    }
  );
}
