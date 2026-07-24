import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/request-origin";
import { hasAccessFromRow, postAuthDestination } from "@/lib/membership-gate";
import { linkPendingMembership } from "@/lib/claim-membership";

// Only ever redirect back into our own app, an open redirect here would let a crafted
// ?next=https://evil.example link send someone off-site right after they authenticate. Returns
// "" (not a default) so the caller can tell "no next given" apart from "go to /dashboard".
function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "";
  return raw;
}

// Where a clicked magic link OR a new account's email-confirmation link lands. Exchanges the
// emailed code for a real session, claims any membership paid for before signup (shared with the
// password-login claim route), then routes by membership + onboarding state so a member can never
// slip past onboarding or into the portal without access.
export async function GET(request: NextRequest) {
  const origin = getPublicOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (!code) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?error=link_expired`);

  const membership = await linkPendingMembership(user.id, user.email ?? null);
  const destination = postAuthDestination(membership);

  // A specific member area she was heading to wins only if she's a fully-set-up member (has
  // access and has onboarded). Otherwise membership state decides, so onboarding and the pricing
  // gate can't be skipped with a ?next.
  const isFullMember = hasAccessFromRow(membership) && !!membership?.onboarded;
  const finalPath = next && isFullMember ? next : destination;

  // Legacy magic-link-only members (no password) are NOT interrupted here. Straight into the
  // portal; a dismissible banner inside the portal invites them to add a password when they want
  // to, so nothing stands between a paid member and the product she's logging in to see.
  return NextResponse.redirect(`${origin}${finalPath}`);
}
