import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BADDIE_SESSIONS } from "@/lib/baddie-sessions";
import BaddieSessionsPage from "../page";

// One shareable link per session (for Threads, Instagram, WhatsApp): the full Baddie Sessions page,
// landing with that session's pop-up open, and its own designed share card from
// public/baddie-sessions/og-<slug>.jpg.

export function generateStaticParams() {
  return BADDIE_SESSIONS.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = BADDIE_SESSIONS.find((b) => b.slug === slug);
  if (!s) return {};
  // The style report has no designed share card yet, so it shares its card photo.
  const image = s.report ? s.image : `/baddie-sessions/og-${s.slug}.jpg`;
  const title = `${s.name} ${s.emoji} | 1:1 with Betty | MY SZN`;
  return {
    title: { absolute: title },
    description: `${s.tagline} ${s.report?.share ?? "A private 90-minute session with Betty, built from your astrology and Human Design."}`,
    alternates: { canonical: `/baddie-sessions/${s.slug}` },
    openGraph: {
      title: `${s.name} ${s.emoji}`,
      description: s.tagline,
      url: `/baddie-sessions/${s.slug}`,
      type: "website",
      images: [{ url: image, ...(s.report ? {} : { width: 1200, height: 630 }), alt: `${s.name}: ${s.report ? "a personal style report" : "a private 90-minute session"} with Betty, $333` }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function BaddieSessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!BADDIE_SESSIONS.some((b) => b.slug === slug)) notFound();
  return <BaddieSessionsPage />;
}
