import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasAccessFromRow } from "@/lib/membership-gate";

// This project's Next.js version renamed middleware.ts to proxy.ts (the export is named
// `proxy`, not `middleware`), see node_modules/next/dist/docs for details. It does two jobs:
// refresh the Supabase auth session cookie on every request, and enforce membership access on
// the member-only routes server-side, so a URL typed straight into the bar is gated the same as
// a hidden button. All access logic lives in one place (membership-gate.ts) shared with the auth
// callback, so the two can never disagree about who gets in.

// Full portal: requires a logged-in member with active access who has finished onboarding.
const MEMBER_AREA = [
  "/dashboard",
  "/my-chart",
  "/your-season",
  "/community",
  "/goals",
  "/journal",
  "/challenges",
  "/affirmations",
  "/style",
];

// Requires access already granted but onboarding NOT yet finished, this is the one place she's
// sent before the portal opens. Its own gate below stops it being reached without access, or
// re-run once already complete.
const ONBOARDING = "/onboarding";

// A session is enough (no active-membership requirement): billing and account management must
// stay reachable even for a lapsed member trying to fix or renew. Admin authorization is enforced
// inside that page itself; here we only require being logged in. /set-password is the optional
// "add a password" step a logged-in legacy member is routed to after a magic-link login.
const LOGIN_ONLY = ["/settings", "/admin", "/set-password"];

function pathMatches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Supabase stores the session in `sb-<project-ref>-auth-token`, split across `.0`/`.1` suffixes
// when it outgrows one cookie. No such cookie means there is no session to refresh and no
// membership to check, so there is nothing for a round trip to Supabase to discover.
function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Fast path for anonymous traffic on public pages: skip the auth round trip entirely. This was
  // costing every visitor, and every crawler hit on the home page, /chart and /seasons/*, a full
  // network call to Supabase before the page could start rendering. A gated route still falls
  // through to the real check below, where a missing session is what redirects to /login anyway.
  if (!hasSessionCookie(request)) {
    const { pathname: anonPath } = request.nextUrl;
    const needsAuth =
      pathMatches(anonPath, MEMBER_AREA) ||
      anonPath === ONBOARDING ||
      anonPath.startsWith(ONBOARDING + "/") ||
      pathMatches(anonPath, LOGIN_ONLY);
    if (!needsAuth) return response;
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(anonPath)}`, request.url)
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // ~60 days: keeps members logged in well past 30 days unless they explicitly sign out. Must
      // match the browser and server clients so the refreshed cookie written here on every request
      // carries the same long lifetime.
      cookieOptions: { maxAge: 60 * 60 * 24 * 60 },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Touches the session so Supabase can refresh an expiring token before it reaches a page.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const inMemberArea = pathMatches(pathname, MEMBER_AREA);
  const inOnboarding = pathname === ONBOARDING || pathname.startsWith(ONBOARDING + "/");
  const inLoginOnly = pathMatches(pathname, LOGIN_ONLY);

  // Public route: nothing to gate, just carry the refreshed session forward.
  if (!inMemberArea && !inOnboarding && !inLoginOnly) return response;

  // Any gated route requires a session first.
  if (!user) {
    return redirectPreservingSession(request, response, `/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Logged in is all these need.
  if (inLoginOnly) return response;

  // Member area and onboarding both hinge on the real membership row, read under her own session
  // so RLS only ever exposes her own.
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, onboarded")
    .eq("id", user.id)
    .maybeSingle();

  const access = hasAccessFromRow(profile);

  if (inOnboarding) {
    if (!access) return redirectPreservingSession(request, response, "/membership?reason=none");
    // Deliberately NOT bounced when already onboarded: /onboarding is also the birth-details
    // edit form ("chart looks wrong? edit it", and the same link in settings). It detects
    // existing birth data, pre-fills, and returns to /my-chart on save. Redirecting an onboarded
    // member to /dashboard here made it impossible to correct a wrong birth time or place, which
    // silently poisons every chart-derived reading. Mandatory onboarding is still enforced by the
    // member-area rule below (not onboarded -> /onboarding), which is what actually guarantees it.
    return response;
  }

  // Member area.
  if (!access) return redirectPreservingSession(request, response, "/membership?reason=none");
  if (!profile?.onboarded) return redirectPreservingSession(request, response, "/onboarding");
  return response;
}

// A bare NextResponse.redirect would drop the Set-Cookie headers Supabase may have just written
// to rotate the session, logging her out on the very hop we're redirecting through. Copy them
// onto the redirect so the refreshed session survives.
function redirectPreservingSession(request: NextRequest, sessionResponse: NextResponse, to: string): NextResponse {
  const url = request.nextUrl.clone();
  const [pathname, search = ""] = to.split("?");
  url.pathname = pathname;
  url.search = search ? `?${search}` : "";
  const redirect = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
