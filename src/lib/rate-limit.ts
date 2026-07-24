import type { createAdminClient } from "@/lib/supabase/admin";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Lightweight DB-backed rate limiter for auth-sensitive endpoints (recovery start, OTP sends).
// Counts recent events in a bucket by email and by IP inside a sliding window and refuses once
// either exceeds its cap. Backed by auth_rate_events (service-role only). Not a substitute for
// Supabase's own email-send limits, a second, app-controlled layer on top.

export async function checkAndRecordRate(
  admin: SupabaseAdmin,
  params: {
    bucket: string;
    email?: string | null;
    ip?: string | null;
    emailLimit: number;
    ipLimit: number;
    windowMinutes: number;
  }
): Promise<{ allowed: boolean }> {
  const since = new Date(Date.now() - params.windowMinutes * 60_000).toISOString();
  const email = params.email?.toLowerCase() ?? null;
  const ip = params.ip ?? null;

  if (email) {
    const { count } = await admin
      .from("auth_rate_events")
      .select("id", { count: "exact", head: true })
      .eq("bucket", params.bucket)
      .eq("email", email)
      .gte("created_at", since);
    if ((count ?? 0) >= params.emailLimit) return { allowed: false };
  }

  if (ip) {
    const { count } = await admin
      .from("auth_rate_events")
      .select("id", { count: "exact", head: true })
      .eq("bucket", params.bucket)
      .eq("ip", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= params.ipLimit) return { allowed: false };
  }

  // Record the attempt only once it's cleared the caps, so a flood of blocked attempts doesn't
  // itself extend the window indefinitely.
  await admin.from("auth_rate_events").insert({ bucket: params.bucket, email, ip });
  return { allowed: true };
}

// Best-effort client IP from the standard proxy headers. Used only for rate limiting, never for
// auth decisions, so a spoofed header can at worst loosen a rate cap for that request.
export function clientIp(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
