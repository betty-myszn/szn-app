import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  serverExternalPackages: ["swisseph"],
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
