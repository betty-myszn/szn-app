// The one place the public origin is written down for build-time consumers (metadata, sitemap,
// robots, JSON-LD). Runtime request handlers use getPublicOrigin in request-origin.ts instead,
// since those can read the actual host off the request.
export const SITE_URL = "https://itsmyszn.com";

export const SITE_NAME = "MY SZN";

// The generated card from src/app/opengraph-image.tsx. It has to be repeated on every page that
// declares its own `openGraph` block, because declaring one replaces the inherited object wholesale
// rather than merging into it, which silently drops the image. Verified in the built HTML: before
// this existed, only /privacy (the one page with no openGraph block of its own) carried an og:image.
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "MY SZN, the astrology-led membership for ambitious women",
};
