"use client";

import Link from "next/link";
import Ticker from "@/components/Ticker";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess } from "@/lib/membership-access";
import ReplayPlayer from "@/components/ReplayPlayer";
import { ASTROLOGY_CLASSES } from "@/lib/astrology-classes";
import { FREE_TRIAL_CTA } from "@/lib/cta";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The general astrology shelf under workshops. Built like the replay vault (same player, same
// server-side membership check on the video id) but with no dates, since these never go live.
export default function AstrologyClassesPage() {
  const { member, ready } = useMember();
  if (!ready) return null;

  return (
    <>
      <Ticker
        variant="lav"
        items={["the big astrology, explained", "watch in your own time", "rewatch as many times as you like", "the cosmic stuff that touches everyone"]}
      />

      {/* Header */}
      <section className="px-5 md:px-8 py-14 text-center" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-3">general astrology</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(34px, 5.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.05,
              color: "#2E1C63",
            }}
          >
            The big astrology, <span className="pk">explained.</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 540, margin: "16px auto 0" }}>
            The classes on the bigger cosmic stuff that touches all of us, from your Saturn return to the generational shift Pluto is driving right nowww, so you understand exactly what&apos;s moving in your life and whyyy.
          </p>
          <div className="mt-6">
            <Link
              href="/events"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}
            >
              ← back to live events
            </Link>
          </div>
        </div>
      </section>

      {/* Cards, one per class */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {!member ? (
            <div className="p-8 text-center" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#2E1C63", marginBottom: 10 }}>
                the astrology classes are inside the membership.
              </h2>
              <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 460, margin: "0 auto 20px" }}>
                Join to watch every class, whenever you like.
              </p>
              <Link href={FREE_TRIAL_CTA.href} className="btn-pink">{FREE_TRIAL_CTA.label}</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {ASTROLOGY_CLASSES.map((c) => (
                <div
                  key={c.id}
                  id={c.id}
                  className="p-6 md:p-8"
                  style={{ border: "var(--border)", background: "var(--lav-light)", scrollMarginTop: 96 }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#3C2A70",
                      marginBottom: 6,
                    }}
                  >
                    {c.label}
                  </div>
                  <h2
                    style={{
                      fontFamily: poppins,
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.6px",
                      lineHeight: 1.2,
                      color: "#2E1C63",
                      marginBottom: 8,
                    }}
                  >
                    {c.title}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, margin: 0 }}>{c.blurb}</p>

                  {hasActiveAccess(member) ? (
                    <ReplayPlayer workshopId={c.id} title={c.title} />
                  ) : (
                    <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.8, marginTop: 12 }}>
                      This class unlocks with an active membership.{" "}
                      <a href="/membership" style={{ color: "var(--pink)", fontWeight: 700 }}>
                        join to watch
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
