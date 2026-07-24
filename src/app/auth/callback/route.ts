import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/request-origin";

// Only ever redirect back into our own app, an open redirect here would let a crafted
// ?next=https://evil.example link send someone off-site right after they authenticate.
function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

// Where a clicked magic link lands. Exchanges the emailed code for a real session cookie, then
// sends her wherever she was headed before she had to log in, the membership checkout flow
// depends on this landing back on /membership rather than always resetting to /dashboard.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = getPublicOrigin(request);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=link_expired`);
}
