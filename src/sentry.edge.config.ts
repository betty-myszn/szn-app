import * as Sentry from "@sentry/nextjs";
import { scrubEvent, scrubBreadcrumb, DATA_COLLECTION } from "@/lib/sentry-scrub";

// Edge runtime (the request proxy). Same rules as the server config.
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn,
    environment: "production",
    dataCollection: DATA_COLLECTION,
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  });
}
