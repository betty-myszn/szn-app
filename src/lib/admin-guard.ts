import { createClient } from "@/lib/supabase/server";

/**
 * Session-based admin check for routes a human uses from the browser.
 *
 * The is_admin flag is read from her own profile under her own session, so RLS is doing the work
 * and a forged header gets nowhere. This is deliberately different from ADMIN_TASK_SECRET, which
 * exists for curl and cron and would be the wrong thing to put in a page a browser can reach.
 */
export async function requireAdmin(): Promise<{ ok: true; userId: string } | { ok: false; status: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401 };

  const { data: profile, error } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  // A failed lookup is NOT permission. Fail closed.
  if (error || !profile?.is_admin) return { ok: false, status: 404 };
  return { ok: true, userId: user.id };
}
