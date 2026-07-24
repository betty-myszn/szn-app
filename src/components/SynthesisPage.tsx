"use client";

import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { buildSynthesis } from "@/lib/synthesis";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function SynthesisPage({ slug }: { slug: string }) {
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            members only, babe.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const reading = chart ? buildSynthesis(slug, chart) : null;

  if (!reading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            add your birth details to unlock this reading.
          </h1>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/my-chart"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← my chart
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>{reading.title} · read from your whole chart</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            <span className="pk">{reading.heroLine}</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 580 }}>
            {reading.intro}
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          {reading.sections.map((section, i) => {
            const content = (
              <>
                <div className="tag mb-3" style={section.light ? { color: "#fff" } : undefined}>
                  {section.title}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.85, color: section.light ? "rgba(255,255,255,0.85)" : "var(--grey)" }}>
                  {section.body}
                </p>
                {section.href && (
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 12, color: section.light ? "#fff" : "var(--pink)" }}>
                    go deeper →
                  </p>
                )}
              </>
            );
            const style: React.CSSProperties = {
              background: section.bg || "#fff",
              borderRight: i % 2 === 0 ? "var(--border)" : undefined,
              borderBottom: i + 2 < reading.sections.length ? "var(--border)" : undefined,
            };
            return section.href ? (
              <Link key={section.title} href={section.href} className="p-8 no-underline block hover:opacity-90 transition-opacity" style={style}>
                {content}
              </Link>
            ) : (
              <div key={section.title} className="p-8" style={style}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 md:px-8 py-10" style={{ background: "var(--lav-light)" }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="tag mb-2">make it real</div>
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
              journal on what landed hardest.
            </h2>
          </div>
          <Link href="/journal" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
            open my journal
          </Link>
        </div>
      </section>
    </>
  );
}
