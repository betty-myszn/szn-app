import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BADDIE_SESSIONS } from "@/lib/baddie-sessions";
import { SIGN_SESSIONS, signSessionBySlug, signSessionName } from "@/lib/sign-sessions";
import { OG_IMAGE } from "@/lib/site";
import BaddieSessionsPage from "../page";
import SignSessionPage from "../SignSessionPage";

// One shareable link per session (for Threads, Instagram, WhatsApp): the full Baddie Sessions page,
// landing with that session's pop-up open, and its own designed share card from
// public/baddie-sessions/og-<slug>.jpg.
// The twelve sign sessions (/baddie-sessions/aries … /pisces, 22 Nov 2026) get a page of their own.

export function generateStaticParams() {
  return [...BADDIE_SESSIONS, ...SIGN_SESSIONS].map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sign = signSessionBySlug(slug);
  if (sign) {
    const title = `${signSessionName(sign)} ${sign.emoji} | 1:1 with Betty | MY SZN`;
    const description = `${sign.tagline} A private 90-minute session with Betty for ${sign.sign} baddies, built from your astrology and Human Design. $333.`;
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: `/baddie-sessions/${sign.slug}` },
      openGraph: { title: `${signSessionName(sign)} ${sign.emoji}`, description: sign.tagline, url: `/baddie-sessions/${sign.slug}`, type: "website", images: [OG_IMAGE] },
      twitter: { card: "summary_large_image" },
    };
  }
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
  const sign = signSessionBySlug(slug);
  if (sign) return <SignSessionPage s={sign} />;
  if (!BADDIE_SESSIONS.some((b) => b.slug === slug)) notFound();
  return <BaddieSessionsPage />;
}
