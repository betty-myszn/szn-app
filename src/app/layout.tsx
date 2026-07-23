import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import Link from "next/link";
import NavBar from "@/components/NavBar";
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
  title: {
    default: "MY SZN, Astrology Membership for Women | Birth Chart, Coaching & Community",
    template: "%s | MY SZN",
  },
  description:
    "The astrology-led membership for ambitious women. Free birth chart calculator, live coaching, subconscious rewiring, and a community that helps you become her. Launches July 2026.",
  keywords: [
    "astrology membership", "birth chart calculator", "free birth chart",
    "astrology for women", "zodiac coaching", "manifestation",
    "astrology community", "sun moon rising", "natal chart",
    "astrology course", "women's coaching", "self development for women",
    "human design", "subconscious reprogramming", "astrology 2026",
    "zodiac season", "venus sign", "chiron healing", "jupiter abundance",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://itsmyszn.com",
    siteName: "MY SZN",
    title: "MY SZN, Astrology Membership for Women",
    description: "Stop guessing. Start becoming her. The astrology-led membership with free birth charts, live coaching, and a community of women who are done playing small.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MY SZN, Astrology Membership for Women",
    description: "Stop guessing. Start becoming her. Free birth chart calculator + astrology-led membership launching July 2026.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
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
          </div>
        </footer>
      </body>
    </html>
  );
}
