"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Ticker from "@/components/Ticker";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess } from "@/lib/membership-access";
import { pastWorkshops, formatWorkshopWhenLA } from "@/lib/workshops";
import { FREE_TRIAL_CTA } from "@/lib/cta";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The replay vault, its own page rather than a strip on /events, so a finished class gets a
// real destination that can be linked to from the season home and shared around.
export default function ReplayVaultPage() {
  const { member, ready } = useMember();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  if (!ready || now === null) return null;

  const past = pastWorkshops(now);

  return (
    <>
      <Ticker
        variant="lav"
        items={["class dismissed, replay saved", "watch in your own time", "rewatch as many times as you like", "every szn, kept forever"]}
      />

      {/* Header */}
      <section className="px-5 md:px-8 py-14 text-center" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-3">the replay vault</div>
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
            Every class, <span className="pk">saved for you.</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 540, margin: "16px auto 0" }}>
            The workshops you missed or want to sit with again, all in one place. Watch in your own time, as many times as you like.
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

      {/* Cards, one per finished workshop */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {!member ? (
            <div className="p-8 text-center" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#2E1C63", marginBottom: 10 }}>
                the replay vault is inside the membership.
              </h2>
              <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 460, margin: "0 auto 20px" }}>
                Join to watch every workshop back, whenever you like.
              </p>
              <Link href={FREE_TRIAL_CTA.href} className="btn-pink">{FREE_TRIAL_CTA.label}</Link>
            </div>
          ) : past.length === 0 ? (
            <div className="p-8 text-center" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#2E1C63", marginBottom: 10 }}>
                nothing in the vault just yet.
              </h2>
              <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 460, margin: "0 auto" }}>
                Replays land here within 24 hours of each live class. The vault starts filling this szn.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {past.map((workshop) => (
                <div key={workshop.id} className="p-6 md:p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
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
                    {workshop.label}
                  </div>
                  {workshop.startIso && (
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 14 }}>
                      {formatWorkshopWhenLA(workshop.startIso)}
                    </div>
                  )}
                  <h2
                    style={{
                      fontFamily: poppins,
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.6px",
                      lineHeight: 1.2,
                      color: "#2E1C63",
                      marginBottom: 4,
                    }}
                  >
                    {workshop.title}
                  </h2>

                  {workshop.replayYoutubeId ? (
                    hasActiveAccess(member) ? (
                      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", marginTop: 18, background: "#000" }}>
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${workshop.replayYoutubeId}?rel=0`}
                          title={workshop.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                        />
                      </div>
                    ) : (
                      <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.8, marginTop: 12 }}>
                        The replay unlocks with an active membership.{" "}
                        <a href="/membership" style={{ color: "var(--pink)", fontWeight: 700 }}>
                          join to watch
                        </a>
                      </p>
                    )
                  ) : (
                    <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.8, marginTop: 12 }}>
                      The replay is being edited and lands here within 24 hours of the class. ✦
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
