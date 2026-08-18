import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasRoomAccessFromRow, hasAccessFromRow, hasFullAccessFromRow, isExpiredTrialRow } from "@/lib/membership-gate";

// This project's Next.js version renamed middleware.ts to proxy.ts (the export is named
// `proxy`, not `middleware`), see node_modules/next/dist/docs for details. It does two jobs:
// refresh the Supabase auth session cookie on every request, and enforce membership access on
// the member-only routes server-side, so a URL typed straight into the bar is gated the same as
// a hidden button. All access logic lives in one place (membership-gate.ts) shared with the auth
// callback, so the two can never disagree about who gets in.

// Full personalised platform: requires monthly or vip (hasFullAccessFromRow) plus finished
// onboarding. The $33 social tier does NOT reach these, it's redirected to upgrade.
const FULL_PLATFORM = [
  "/dashboard",
  "/my-chart",
  "/your-season",
  "/goals",
  "/journal",
  "/challenges",
  "/affirmations",
  "/style",
];

// Community: the live chat rooms are the front door, open to the free tier and every paying tier,
// so the /community route is gated on hasRoomAccessFromRow (free+). The rituals inside the hub
// (book club, moon audios, seasonal updates) are gated per-feature IN the page on hasAccessFromRow
// (social+), not by route, since they live on the same /community path as the free rooms.
const COMMUNITY_AREA = ["/community"];

// The free tier's home. Same room-access gate as the community (free+), so it needs a session but
// no payment. Paid members aren't blocked here by the proxy, the page itself forwards them to their
// own home, keeping "one home per tier" in one place rather than split across a redirect table.
const FREE_HOME = ["/home"];

// Everything a logged-in member with SOME paid access can be on, used only for the anonymous
// fast-path below to decide whether a no-session request even needs a Supabase round trip.
const GATED_MEMBER_AREA = [...FULL_PLATFORM, ...COMMUNITY_AREA, ...FREE_HOME];

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
      pathMatches(anonPath, GATED_MEMBER_AREA) ||
      anonPath === ONBOARDING ||
      anonPath.startsWith(ONBOARDING + "/") ||
      pathMatches(anonPath, LOGIN_ONLY);
    if (!needsAuth) return response;
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(anonPath)}`, request.url)
    );
  }

  // Route type first, from the pathname alone (cheap string matching), BEFORE any Supabase call, so
  // a logged-in member browsing PUBLIC pages doesn't pay an auth round-trip on every one of them.
  // Before this, every home / seasons / blog / chart / membership hit by a signed-in member made a
  // full network call to Supabase auth to refresh the token before the page could render, which is
  // a big chunk of the per-page latency. The session still refreshes on any gated route she reaches
  // (below) and on the client (the browser client auto-refreshes), so skipping the refresh on
  // public pages costs nothing and removes that call from the common case.
  const { pathname } = request.nextUrl;
  const inFullPlatform = pathMatches(pathname, FULL_PLATFORM);
  const inCommunity = pathMatches(pathname, COMMUNITY_AREA);
  const inFreeHome = pathMatches(pathname, FREE_HOME);
  const inOnboarding = pathname === ONBOARDING || pathname.startsWith(ONBOARDING + "/");
  const inLoginOnly = pathMatches(pathname, LOGIN_ONLY);
  if (!inFullPlatform && !inCommunity && !inOnboarding && !inLoginOnly && !inFreeHome) return response;

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

  // Touches the session so Supabase can refresh an expiring token before it reaches a gated page.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Any gated route requires a session first.
  if (!user) {
    return redirectPreservingSession(request, response, `/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Logged in is all these need.
  if (inLoginOnly) return response;

  // The rest hinge on the real membership row, read under her own session so RLS only ever
  // exposes her own.
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at, onboarded")
    .eq("id", user.id)
    .maybeSingle();

  const roomAccess = hasRoomAccessFromRow(profile); // free tier + expired trials + any paid tier
  const access = hasAccessFromRow(profile); // any active paid tier, incl. social
  const fullAccess = hasFullAccessFromRow(profile); // monthly or vip only

  // Community rooms: the free front-door tier and every paying member get in. Someone with no
  // access at all (not even free) hasn't got an account reason to be here, so she goes to pricing.
  if (inCommunity || inFreeHome) {
    if (!roomAccess) return redirectPreservingSession(request, response, "/membership?reason=none");
    return response;
  }

  // Onboarding (the chart-building step, and the birth-details edit form) belongs to the full
  // platform. A social member has no chart onboarding to do, so she's steered to upgrade rather
  // than dropped into a flow that builds a portal she hasn't bought.
  if (inOnboarding) {
    if (!access) return redirectPreservingSession(request, response, "/membership?reason=none");
    if (!fullAccess) return redirectPreservingSession(request, response, "/membership?reason=upgrade");
    // Deliberately NOT bounced when already onboarded: /onboarding is also the birth-details
    // edit form ("chart looks wrong? edit it", and the same link in settings). Redirecting an
    // onboarded member away here made it impossible to correct a wrong birth time or place, which
    // silently poisons every chart-derived reading. Mandatory onboarding is still enforced by the
    // full-platform rule below (not onboarded -> /onboarding).
    return response;
  }

  // Full platform. A social member has active access but not full access, so she lands on the
  // upgrade prompt rather than the pricing-from-scratch page.
  if (!access) {
    // An expired trial hitting a premium door (personalised platform, workshops, meditations) gets
    // her designed "your free week is over" win-back page instead of the generic pricing bounce.
    // She keeps the chat rooms and her chart via /home and /community, which pass the gate above.
    if (isExpiredTrialRow(profile)) return redirectPreservingSession(request, response, "/free-trial/ended");
    return redirectPreservingSession(request, response, "/membership?reason=none");
  }
  if (!fullAccess) return redirectPreservingSession(request, response, "/membership?reason=upgrade");
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
