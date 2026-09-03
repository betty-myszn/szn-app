import type { NextRequest } from "next/server";

// The public origin used by every server-side redirect and emailed link (auth callback, Stripe
// portal, account recovery). Order of preference:
//
//   1. A configured canonical origin (NEXT_PUBLIC_SITE_URL, then NEXT_PUBLIC_APP_URL). When set,
//      e.g. https://itsmyszn.com, it wins over everything so redirects always land on the real
//      public domain, even for a request that arrived on the raw Railway host. This is what makes
//      setting that env var actually change where the app sends people, without it the value below
//      is ignored entirely.
//   2. X-Forwarded-Host / -Proto: the public host the request actually came in on, set by the
//      reverse proxy (Railway or any host). request.url alone can't be trusted here because behind
//      a proxy it reflects the app's internal address (e.g. http://localhost:8080).
//   3. request.url's own origin: local dev with no proxy and nothing configured.
//
// Note: NEXT_PUBLIC_* values are inlined at build time, so the canonical origin must be present in
// the Railway build env and picked up by a fresh deploy, not just set at runtime.
export function getPublicOrigin(request: NextRequest | Request): string {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "").trim().replace(/\/+$/, "");
  if (configured) return configured;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return new URL(request.url).origin;
}
