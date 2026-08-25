import type { MetadataRoute } from "next";

// The web app manifest, which is what makes MY SZN installable to a phone home screen and lets it
// run full-screen like a native app. Next links this automatically from app/manifest.ts, served at
// /manifest.webmanifest. Icons live in /public; the maskable one has extra padding so Android's
// icon mask doesn't crop the disco planet.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MY SZN, Astrology & Human Design",
    short_name: "MY SZN",
    description:
      "Your birth chart and your Human Design, read together as one thing. Personalised astrology, live coaching and a community of women becoming her, every season.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a1a1a",
    theme_color: "#1a1a1a",
    categories: ["lifestyle", "education", "health"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
