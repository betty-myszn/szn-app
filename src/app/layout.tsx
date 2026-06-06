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
        <NavBar />

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
