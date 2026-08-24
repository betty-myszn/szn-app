import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SEASON_SLUGS } from "@/lib/season-pages";
import { BLOG_POSTS, populatedCategories } from "@/lib/blog";

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
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/podcast`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
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

  // Category pages sit above individual posts in priority: they target the broader term and they
  // are the parent every post links back up to.
  const blogCategories: MetadataRoute.Sitemap = populatedCategories().map((c) => ({
    url: `${SITE_URL}/blog/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // lastModified comes from the post's own updatedAt rather than the build date, so re-deploying
  // without touching content does not tell Search Console every article changed.
  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(`${p.updatedAt}T12:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...core, ...seasons, ...blogCategories, ...blogPosts];
}
