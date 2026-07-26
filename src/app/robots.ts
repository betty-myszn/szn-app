import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Everything behind the membership gate in proxy.ts is disallowed here too. Those routes redirect
// to /login for a crawler anyway, so letting Google spend crawl budget on them just buys a pile of
// duplicate login pages in the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/dashboard",
        "/my-chart",
        "/your-season",
        "/community",
        "/goals",
        "/journal",
        "/challenges",
        "/affirmations",
        "/style",
        "/onboarding",
        "/settings",
        "/checkout",
        "/auth/",
        "/results",
        "/set-password",
        "/reset-password",
        "/forgot-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
