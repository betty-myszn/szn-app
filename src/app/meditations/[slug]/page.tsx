import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeasonMeditation from "@/components/SeasonMeditation";
import { MEDITATIONS, meditationBySlug } from "@/lib/meditations";

export function generateStaticParams() {
  return MEDITATIONS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = meditationBySlug(slug);
  return { title: m ? m.title : "Meditations", robots: { index: false } };
}

export default async function MeditationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meditation = meditationBySlug(slug);
  if (!meditation) notFound();

  return (
    <>
      <div className="px-5 md:px-8" style={{ background: "var(--dark)", paddingTop: 24 }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/meditations"
            className="no-underline"
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}
          >
            ← all meditations
          </Link>
        </div>
      </div>
      <SeasonMeditation slug={meditation.slug} tag={`${meditation.theme} meditation`} />
    </>
  );
}
