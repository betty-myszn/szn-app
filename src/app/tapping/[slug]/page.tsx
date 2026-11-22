import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TappingPlayer from "@/components/TappingPlayer";
import { TAPPING, tappingBySlug } from "@/lib/tapping";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The standard EFT points, in the usual order: the setup on the karate chop, then the round.
const POINTS = [
  "karate chop (side of the hand), for the setup",
  "eyebrow",
  "side of the eye",
  "under the eye",
  "under the nose",
  "chin",
  "collarbone",
  "under the arm",
  "top of the head",
];

export function generateStaticParams() {
  return TAPPING.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = tappingBySlug(slug);
  return { title: t ? t.title : "Tapping", robots: { index: false } };
}

export default async function TappingSessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = tappingBySlug(slug);
  if (!session) notFound();
  const next = session.next ? tappingBySlug(session.next) : undefined;

  return (
    <>
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", paddingTop: 24, paddingBottom: 40, borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/tapping" className="no-underline" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff" }}>
            ← all tapping
          </Link>
          <div className="tag mt-6 mb-3" style={{ color: "var(--pink)" }}>
            {session.theme} · {session.minutes} min
          </div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#fff", marginBottom: 12 }}>
            {session.title.toLowerCase()}<span className="pk">.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#fff", maxWidth: 640, marginBottom: 24 }}>{session.purpose}</p>
          <TappingPlayer slug={session.slug} title={session.title} poster={session.cover} />
          <p style={{ fontSize: 12, color: "#fff", marginTop: 10 }}>From the workshop {session.from}.</p>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 40, paddingBottom: 56 }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={{ background: "#fff", border: "2px solid #000", borderRadius: 14, padding: 24, color: "#000" }}>
            <div className="tag mb-3" style={{ color: "var(--pink)" }}>
              inside this one
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7 }}>
              {session.inside.map((line) => (
                <li key={line} style={{ marginBottom: 6 }}>{line}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: "#fff", border: "2px solid #000", borderRadius: 14, padding: 24, color: "#000" }}>
            <div className="tag mb-3" style={{ color: "var(--pink)" }}>
              how to tap along
            </div>
            <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.7 }}>
              Rate how loud the feeling is out of 10 before you start. Then copy Betty&apos;s hands, tap each point with two fingers and repeat every line out loud after her.
            </p>
            <ol style={{ margin: "0 0 10px", paddingLeft: 18, fontSize: 14, lineHeight: 1.7 }}>
              {POINTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>
              Rate it again at the end and go round until it drops. Yawning or sighing mid-round is the energy moving, so let it.
            </p>
          </div>
        </div>

        {next && (
          <div className="max-w-4xl mx-auto mt-4">
            <Link
              href={`/tapping/${next.slug}`}
              className="no-underline flex items-center justify-between"
              style={{ background: "#000", color: "#fff", borderRadius: 14, padding: "18px 24px", gap: 16 }}
            >
              <span style={{ fontSize: 14, lineHeight: 1.6 }}>
                This one runs straight into <strong>{next.title.toLowerCase()}</strong>, the final round, {next.minutes} min.
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)", whiteSpace: "nowrap" }}>
                keep going →
              </span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
