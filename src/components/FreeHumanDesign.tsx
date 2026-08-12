"use client";

import Link from "next/link";
import { useHumanDesign } from "@/lib/use-human-design";
import { TYPE_CONTENT, AUTHORITY_CONTENT, PROFILE_CONTENT } from "@/lib/human-design-content";
import { CENTER_LABELS } from "@/lib/human-design-constants";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The free chart form already collects everything Human Design needs: date, exact time and place.
// So the same submission that produces the birth chart can produce the Human Design chart, and
// asking someone to type the same details into a second form to get it would be daft.
//
// This is the summary, not the full reading. It gives the four things people actually look up
// (type, strategy, authority, profile) plus which centres are defined, then hands off to the full
// free chart for the rest.
export default function FreeHumanDesign() {
  const { hd, loading } = useHumanDesign();

  if (loading) {
    return (
      <section className="px-5 md:px-8 py-12" style={{ borderTop: "var(--border)", background: "var(--lav-light)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-3" style={{ color: "#3C2A70" }}>and your human design</div>
          <p style={{ fontSize: 14, color: "#3C2A70", lineHeight: 1.7 }}>
            Working out your bodygraph from the same birth details...
          </p>
        </div>
      </section>
    );
  }

  // No birth time, or the calculation could not run. Silent rather than an error, because the
  // astrology chart above is still perfectly valid on its own.
  if (!hd) return null;

  const type = TYPE_CONTENT[hd.type];
  const authority = AUTHORITY_CONTENT[hd.authority];
  const profile = PROFILE_CONTENT[hd.profile];

  const facts = [
    { label: "type", value: hd.type, body: type?.meaning },
    { label: "strategy", value: hd.strategy, body: type?.apply },
    { label: "authority", value: hd.authorityLabel, body: authority?.meaning },
    { label: "profile", value: hd.profile, body: profile?.meaning },
  ];

  return (
    <section className="px-5 md:px-8 py-14" style={{ borderTop: "var(--border)", background: "var(--lav-light)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="tag mb-3" style={{ color: "#3C2A70" }}>and your human design</div>

        <h2
          style={{
            fontFamily: poppins,
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.12,
            color: "var(--dark)",
            marginBottom: 12,
          }}
        >
          you&apos;re a <span className="pk">{hd.type.toLowerCase()}</span>.
        </h2>

        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#3C2A70", maxWidth: 620, marginBottom: 28 }}>
          Same birth details, a completely different map. Your birth chart says who you&apos;re here
          to become. Your Human Design says how you&apos;re actually built to get there, and it is
          usually the more practical of the two.
        </p>

        <div style={{ border: "var(--border)", background: "#fff" }}>
          {facts.map((fact, i) => (
            <div key={fact.label} className="p-6" style={{ borderTop: i === 0 ? undefined : "var(--border)" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--pink)",
                  marginBottom: 4,
                }}
              >
                your {fact.label}
              </div>
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "-0.3px",
                  color: "var(--dark)",
                  marginBottom: 6,
                }}
              >
                {fact.value}
              </div>
              {fact.body && (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey)" }}>{fact.body}</p>
              )}
            </div>
          ))}
        </div>

        {/* Centres, the visual most people recognise from a bodygraph */}
        {hd.definedCenters.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div className="tag mb-3" style={{ color: "#3C2A70" }}>your defined centres</div>
            <div className="flex gap-2 flex-wrap">
              {hd.definedCenters.map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "7px 14px",
                    background: "var(--dark)",
                    color: "#fff",
                  }}
                >
                  {CENTER_LABELS[c]}
                </span>
              ))}
              {hd.openCenters.map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "7px 14px",
                    border: "1.5px solid var(--dark)",
                    color: "var(--dark)",
                  }}
                >
                  {CENTER_LABELS[c]}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#3C2A70", marginTop: 10 }}>
              Filled is defined, which means consistent and reliably yours. Outlined is open, where
              you take in and amplify everyone else, and where most conditioning gets in.
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 26 }}>
          <Link href="/human-design" className="btn-pink">
            read my full human design
          </Link>
        </div>
      </div>
    </section>
  );
}
