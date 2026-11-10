import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  serverExternalPackages: ["swisseph"],
  // The MY SZN ecosystem restructure (13 Oct 2026). Temporary (307) on purpose so they're easy to
  // reverse: the membership is becoming The Baddie Coven, and the Money Blueprint is now Rich B*tch
  // Rising. Both old pages are kept in the codebase untouched.
  async redirects() {
    return [
      { source: "/membership", destination: "/baddie-coven", permanent: false },
      // Back to The Bad B*tch Coven (10 Nov 2026) after a day as "The Bad B*tch Club". Links already
      // sent with the club addresses land on the coven pages. Only these exact pages.
      { source: "/bad-btch-club", destination: "/baddie-coven", permanent: false },
      { source: "/bad-btch-club/welcome", destination: "/baddie-coven/welcome", permanent: false },
      { source: "/bad-btch-club/la", destination: "/baddie-coven/la", permanent: false },
      { source: "/club", destination: "/coven", permanent: false },
      { source: "/club/calendar", destination: "/coven/calendar", permanent: false },
      { source: "/club/diary", destination: "/coven/diary", permanent: false },
      { source: "/money-blueprint", destination: "/reports/rich-btch-rising", permanent: false },
      // The Baddie Style Report moved from the 1:1 sessions to the reports hub (8 Nov 2026).
      { source: "/baddie-sessions/style", destination: "/reports#style-report", permanent: false },
    ];
  },
};

// Sentry's build step. Source maps are uploaded (so stack traces read as real file and line) only
// when SENTRY_AUTH_TOKEN, SENTRY_ORG and SENTRY_PROJECT are set in Railway; without them the build
// carries on and errors still report, just with minified traces. Maps are deleted after upload so
// they are never served to the public. The release is the deployed commit, which is what lets
// Sentry say "this came back in the latest deploy".
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "the-cosmic-co",
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: { name: process.env.RAILWAY_GIT_COMMIT_SHA },
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  widenClientFileUpload: true,
  silent: true,
  telemetry: false,
});
