import type { Breadcrumb, ErrorEvent } from "@sentry/nextjs";
import type * as SentryNext from "@sentry/nextjs";

/**
 * SDK v11 collects cookies, headers, request and response bodies, query strings and user details
 * by default. None of that goes: request bodies here carry birth details and messages, and cookies
 * carry the login session. The member is set by hand instead (id and first name, use-member.ts).
 */
export const DATA_COLLECTION: NonNullable<Parameters<typeof SentryNext.init>[0]>["dataCollection"] = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
};

// What leaves the app for Sentry, trimmed. Query strings go from every URL, because some carry a
// member's birth details (the shareable /results and /chart links encode them there), and cookies
// and headers never go at all. A member is named by id and first name only (see use-member.ts).

function stripQuery(url: unknown): unknown {
  if (typeof url !== "string") return url;
  const i = url.search(/[?#]/);
  return i === -1 ? url : url.slice(0, i);
}

export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    event.request.url = stripQuery(event.request.url) as string | undefined;
    delete event.request.query_string;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.data;
  }
  if (event.transaction) event.transaction = stripQuery(event.transaction) as string;
  return event;
}

export function scrubBreadcrumb(crumb: Breadcrumb): Breadcrumb {
  if (crumb.data) {
    for (const key of ["url", "to", "from"]) {
      if (key in crumb.data) crumb.data[key] = stripQuery(crumb.data[key]);
    }
  }
  return crumb;
}

/** Noise that is not a bug in the app: browser extensions, a known harmless browser warning. */
export const IGNORE_ERRORS: (string | RegExp)[] = [
  /ResizeObserver loop/i,
  "Non-Error promise rejection captured",
];
export const DENY_URLS: RegExp[] = [/^chrome-extension:\/\//i, /^moz-extension:\/\//i, /^safari-(web-)?extension:\/\//i];
