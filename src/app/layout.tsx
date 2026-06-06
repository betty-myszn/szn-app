import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import Link from "next/link";
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
  title: "MY SZN — Shop your sign. Become your future self.",
  description:
    "MY SZN combines astrology, transformation, and personalised shopping to help you align your inner world and outer identity.",
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
        <nav
          className="flex items-center justify-between px-8 py-[18px] sticky top-0 bg-white z-[100]"
          style={{ borderBottom: "var(--border)" }}
        >
          <Link
            href="/"
            className="no-underline"
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.5px",
              color: "var(--dark)",
            }}
          >
            my<span style={{ color: "var(--pink)" }}>szn</span>
          </Link>
          <div
            className="flex gap-7"
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <Link href="/your-szn" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
              your szn
            </Link>
            <Link href="/chart" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
              chart
            </Link>
            <Link href="/#shop" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
              shop
            </Link>
            <Link href="/#heal" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
              heal
            </Link>
            <Link href="/#manifest" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
              manifest
            </Link>
          </div>
          <Link href="/chart" className="nav-cta no-underline" style={{
            background: "transparent",
            color: "var(--dark)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "10px 20px",
            border: "1.5px solid var(--dark)",
            transition: "all 0.15s",
          }}>
            get your chart
          </Link>
        </nav>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer
          className="flex items-center justify-between px-8 py-9"
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
            {["privacy", "terms", "instagram"].map((link) => (
              <a
                key={link}
                href="#"
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
                {link}
              </a>
            ))}
          </div>
        </footer>
      </body>
    </html>
  );
}
