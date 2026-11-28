import { DM_Serif_Display, Anton, Courier_Prime } from "next/font/google";

// The Gift Issue borrows three magazine faces on top of the site's Poppins + DM Sans: a serif for the
// coverlines, a condensed poster face and a typewriter for the issue details and credits. They're
// only loaded on /gift-guide, so the rest of the site doesn't pay for them.
const serif = DM_Serif_Display({ variable: "--gg-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const poster = Anton({ variable: "--gg-poster", subsets: ["latin"], weight: "400" });
const mono = Courier_Prime({ variable: "--gg-mono", subsets: ["latin"], weight: "700" });

export default function GiftGuideLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${poster.variable} ${mono.variable}`}>{children}</div>;
}
