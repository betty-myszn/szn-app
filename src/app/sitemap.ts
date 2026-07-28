import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SEASON_SLUGS } from "@/lib/season-pages";

// Only public, indexable pages belong here. Anything the membership gate redirects, or that is a
// step inside a flow (checkout, auth callbacks, password resets), is deliberately absent: listing a
// URL that redirects or 404s for a crawler is a coverage error in Search Console, not a signal.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/chart`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/membership`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/seasons`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/podcast`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/waitlist`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/community-guidelines`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];

  const seasons: MetadataRoute.Sitemap = SEASON_SLUGS.map((slug) => ({
    url: `${SITE_URL}/seasons/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...core, ...seasons];
}
