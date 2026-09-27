import * as Sentry from "@sentry/nextjs";
import { scrubEvent, scrubBreadcrumb, IGNORE_ERRORS, DENY_URLS, DATA_COLLECTION } from "@/lib/sentry-scrub";

// Browser error reporting. Off unless NEXT_PUBLIC_SENTRY_DSN is set, and never in local development,
// so nothing is sent until the DSN is added to Railway. Errors only: no session replay and no
// performance tracing, which keeps member data and the free plan's allowance to a minimum.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn,
    environment: "production",
    dataCollection: DATA_COLLECTION,
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
    ignoreErrors: IGNORE_ERRORS,
    denyUrls: DENY_URLS,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
