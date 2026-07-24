import type { NextRequest } from "next/server";

// Behind a reverse proxy (Railway, or any other host), request.url reflects the app's own
// internal address (e.g. http://localhost:8080), not the public URL the request actually came
// in on, that's only available via the standard X-Forwarded-* headers the proxy sets. Falls back
// to request.url's own origin when those headers are absent, which is exactly the case for local
// dev with no proxy in front of it.
export function getPublicOrigin(request: NextRequest | Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return new URL(request.url).origin;
}
