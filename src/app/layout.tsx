import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  // Without metadataBase, every relative URL below (canonicals, og:url, og:image) is a build error
  // or resolves against the deploy preview host instead of the real domain.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MY SZN, Astrology Membership for Women | Birth Chart, Coaching & Community",
    template: "%s | MY SZN",
  },
  description:
    "The astrology-led membership for ambitious women. Free birth chart calculator, live coaching, subconscious rewiring, and a community that helps you become her. Launches July 2026.",
  // Default canonical for the home page. Every other route overrides it with its own, which is what
  // stops query-string and trailing-slash variants being indexed as separate pages.
  alternates: { canonical: "/" },
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: "MY SZN, Astrology Membership for Women",
    description: "Stop guessing. Start becoming her. The astrology-led membership with free birth charts, live coaching, and a community of women who are done playing small.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MY SZN, Astrology Membership for Women",
    description: "Stop guessing. Start becoming her. Free birth chart calculator and astrology-led membership launching July 2026.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Identity for the whole site, emitted once. The Organization block is what lets Google associate
// the brand with a logo and social profiles; the WebSite block declares the site name it should
// print in the SERP instead of guessing from the domain.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      legalName: "The Cosmic Co.",
      url: SITE_URL,
      description:
        "An astrology-led membership for ambitious women, combining birth chart work, live coaching and subconscious rewiring.",
      sameAs: ["https://instagram.com/itsmyszn"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />

        <Analytics />

        {/* Nav */}
        <NavBar />

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer
          className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-9 text-center md:text-left"
          style={{ background: "var(--dark)" }}
        >
          <div
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            my<span style={{ color: "var(--pink)" }}>szn</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.04em",
            }}
          >
            &copy; 2026 The Cosmic Co. All rights reserved.
          </div>
          <div className="flex gap-6">
            {[
              { label: "privacy", href: "/privacy" },
              { label: "terms", href: "/terms" },
              { label: "instagram", href: "https://instagram.com/itsmyszn" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}
                className="hover:!text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <CookieSettingsLink />
          </div>
        </footer>

        <CookieConsent />
      </body>
    </html>
  );
}
