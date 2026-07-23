"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { composeTheme } from "@/lib/theme-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function ThemePage() {
  const params = useParams<{ theme: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();

  const slug = decodeURIComponent(params.theme);

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

  if (!chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            add your birth details to unlock this.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            Theme guidance is personalised to your exact chart. Add your birth details and every szn theme opens up for you.
          </p>
          <Link href="/onboarding" className="btn-pink">add my birth details</Link>
        </div>
      </section>
    );
  }

  const reading = composeTheme(slug, chart, season.sign);

  if (!reading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t find that theme.
          </h1>
          <Link href="/your-season" className="btn-pink">back to this season</Link>
        </div>
      </section>
    );
  }

  const sections = [
    { title: "what this theme means", body: reading.meaning, bg: "#fff" as string, light: false },
    { title: `${reading.title} in your chart`, body: reading.inYourChart, bg: "var(--lav-light)", light: false },
    { title: "your gift with this theme", body: reading.yourGift, bg: "var(--pink)", light: true },
    { title: "your challenge this szn", body: reading.yourChallenge, bg: "var(--dark)", light: true },
    { title: "how to work it", body: reading.howToWorkIt, bg: "var(--gold)", light: false },
  ];

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/your-season"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            back to {season.sign.toLowerCase()} szn
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>
            {season.sign.toLowerCase()} szn theme · read through your {reading.relatedSign.toLowerCase()} {reading.relatedBodyId.replace("_", " ")}
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(34px, 5.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.05,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            <span className="pk">{reading.title}.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 560 }}>
            One of this szn&apos;s core themes, decoded for your chart specifically, not for everyone born under {season.sign.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          {sections.map((section, i) => (
            <div
              key={section.title}
              className="p-8"
              style={{
                background: section.bg,
                borderRight: i % 2 === 0 ? "var(--border)" : undefined,
                borderBottom: i < sections.length - 1 ? "var(--border)" : undefined,
                gridColumn: i === sections.length - 1 ? "1 / -1" : undefined,
              }}
            >
              <div className="tag mb-3" style={section.light ? { color: "#fff" } : undefined}>
                {section.title}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: section.light ? "rgba(255,255,255,0.9)" : "var(--grey)" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Prompt + affirmation */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-4">journal on it</div>
            <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.5, color: "#3C2A70", marginBottom: 20 }}>
              {reading.prompt}
            </p>
            <Link href="/journal" className="btn-pink">open my journal</Link>
          </div>
          <div className="p-8" style={{ background: "var(--pink)" }}>
            <div className="tag mb-4" style={{ color: "#fff" }}>your affirmation</div>
            <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, color: "#fff" }}>
              &ldquo;{reading.affirmation}&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10" style={{ background: "var(--lav-light)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="tag mb-3">the rest of your szn</div>
          <Link href="/your-season" className="btn-pink">back to your {season.sign.toLowerCase()} szn guide</Link>
        </div>
      </section>
    </>
  );
}
