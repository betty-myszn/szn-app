"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { composeMajorTransit, type MajorTransitType, type MajorAspectType } from "@/lib/transit-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const VALID_TYPES: MajorTransitType[] = ["ingress", "retrograde_start", "retrograde_end", "aspect"];

function TransitPageContent() {
  const params = useSearchParams();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();

  const type = params.get("type") as MajorTransitType | null;
  const date = params.get("date");
  const planet = params.get("planet");
  const sign = params.get("sign") || undefined;
  const otherPlanet = params.get("otherPlanet") || undefined;
  const aspectType = (params.get("aspectType") as MajorAspectType | null) || undefined;

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
            Transit readings are personalised to your exact chart. Add your birth details and every date opens up for you.
          </p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  if (!type || !VALID_TYPES.includes(type) || !date || !planet) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t find that transit.
          </h1>
          <Link href="/dashboard" className="btn-pink">back to my szn</Link>
        </div>
      </section>
    );
  }

  const reading = composeMajorTransit({ type, date, planet, sign, otherPlanet, aspectType }, chart);

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            back to {season.sign.toLowerCase()} szn
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>
            {reading.dateLabel} · this season&apos;s bigger picture
          </div>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{reading.emoji}</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5.5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            <span className="pk">{reading.title}.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 560 }}>
            {reading.whatThisIs}
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div className="tag mb-3">what this means in your chart</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70" }}>{reading.inYourChart}</p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>betty&apos;s take</div>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{reading.bettysTake}</p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--gold)" }}>
          <div className="tag mb-3">the move</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: "#854F0B", fontWeight: 600 }}>{reading.theMove}</p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-4">journal on it</div>
            <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.5, color: "#3C2A70", marginBottom: 20 }}>
              {reading.journalPrompt}
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
    </>
  );
}

export default function TransitPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
        </div>
      }
    >
      <TransitPageContent />
    </Suspense>
  );
}
