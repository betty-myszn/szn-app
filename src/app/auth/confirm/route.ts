import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/request-origin";
import { hasAccessFromRow, postAuthDestination, isBlockedRow } from "@/lib/membership-gate";
import { linkPendingMembership } from "@/lib/claim-membership";

// Same guard as /auth/callback: only ever redirect back into our own app.
function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "";
  return raw;
}

// Where a server-minted one-time login link lands (scripts/login-link.mjs). /auth/callback only
// understands the PKCE `code` from a browser-started magic link, and an admin-generated link has no
// browser verifier to pair with, so this verifies the link's token_hash directly instead. Sign-in
// links only: the other OTP types (recovery, invite, email change) keep their own flows.
export async function GET(request: NextRequest) {
  const origin = getPublicOrigin(request);
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") === "magiclink" ? "magiclink" : "email";
  const next = safeRedirectPath(searchParams.get("next"));

  if (!tokenHash) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  const user = data?.user;
  if (error || !user) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const membership = await linkPendingMembership(user.id, user.email ?? null);
  if (isBlockedRow(membership)) return new NextResponse(null, { status: 404 });

  const destination = postAuthDestination(membership);
  const isFullMember = hasAccessFromRow(membership) && !!membership?.onboarded;
  return NextResponse.redirect(`${origin}${next && isFullMember ? next : destination}`);
}
