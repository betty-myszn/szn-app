import * as Sentry from "@sentry/nextjs";
import { scrubEvent, scrubBreadcrumb, DATA_COLLECTION } from "@/lib/sentry-scrub";

// Server error reporting: page and API crashes arrive through onRequestError in instrumentation.ts.
// console.error is captured too, because most API routes catch their own failures and log them
// ("notify: resend send FAILED", "chat/send: insert failed") rather than throwing, and those are
// exactly the breakages worth hearing about.
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn,
    environment: "production",
    dataCollection: DATA_COLLECTION,
    tracesSampleRate: 0,
    // Bot noise: scanners POST to / and /login then drop the connection ("aborted"), or probe for
    // server actions that don't exist. Neither is a member hitting a bug.
    ignoreErrors: [/^(Error: )?aborted$/, /Expected RSC response/, /Failed to find Server Action/],
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
    integrations: [Sentry.captureConsoleIntegration({ levels: ["error"] })],
  });
}
