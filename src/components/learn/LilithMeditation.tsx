"use client";

import { useState } from "react";
import Image from "next/image";
import type { ChartData } from "@/types/chart";
import Link from "next/link";
import { LILITH_ACTIVATION_EXTRAS, LILITH_MEDITATION, canvaEmbedSrc, lilithMeditationReady } from "@/lib/meditations";
import { HOUSE_MEANINGS, ordinalHouse } from "@/lib/interpretations";
import { glossify } from "@/components/AstroTerm";
import { Box, SectionHead } from "@/components/learn/LearnKit";
import { Stack } from "@/components/learn/DeepDive";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Short on purpose: which part of her life to hold in mind, from her own Liliths.
function prepLine(chart: ChartData): string | null {
  const mean = chart.liliths?.find((l) => l.id === "lilith") ?? chart.planets.find((p) => p.id === "lilith");
  if (!mean) return null;
  const house = HOUSE_MEANINGS[mean.house - 1];
  let text = `Hold your ${ordinalHouse(mean.house)} house${house ? ` of ${house.title}` : ""} in mind as you go in, because that's where your ${mean.sign} Lilith got buried.`;
  const truePt = chart.liliths?.find((l) => l.id === "true_lilith");
  if (truePt && truePt.sign !== mean.sign) text += ` Notice anything ${truePt.sign} flavoured that rises up, that's your True Lilith.`;
  return text;
}

function Player() {
  const m = LILITH_MEDITATION;
  if (m.canvaUrl) {
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden" }}>
        <iframe src={canvaEmbedSrc(m.canvaUrl)} title={m.title} loading="lazy" allow="fullscreen; autoplay" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
      </div>
    );
  }
  if (m.youtubeId) {
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden" }}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${m.youtubeId}?rel=0&modestbranding=1`} title={m.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
      </div>
    );
  }
  if (m.src) return <audio controls preload="metadata" src={m.src} style={{ width: "100%" }} />;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden" }}>
      <Image src="/meditations/lilith-activation.png" alt="Lilith Activation, a guided meditation" fill sizes="(max-width: 900px) 100vw, 680px" style={{ objectFit: "cover" }} />
    </div>
  );
}

type Panel = "for" | "inside" | "after" | "affirm";

const PANELS: { id: Panel; label: string }[] = [
  { id: "for", label: "is this for you" },
  { id: "inside", label: "what you'll experience" },
  { id: "after", label: "after: shadow work" },
  { id: "affirm", label: "affirmations" },
];

const mini = { fontFamily: poppins, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" as const, margin: "0 0 8px", color: "var(--pink)" };

export function LilithMeditation({ chart, isAdmin }: { chart: ChartData; isAdmin: boolean }) {
  const [open, setOpen] = useState<Panel | null>(null);
  const ready = lilithMeditationReady();
  // Members only see a finished meditation; Betty (admin) sees it with a placeholder before then.
  if (!ready && !isAdmin) return null;
  const prep = prepLine(chart);
  const m = LILITH_MEDITATION;
  const x = LILITH_ACTIVATION_EXTRAS;

  return (
    <>
      <SectionHead title="your lilith activation" />
      <Stack>
        <Box tone="pink" label="before you press play">
          {prep && <strong style={{ display: "block", marginBottom: 6 }}>{glossify(prep)}</strong>}
          Open your affirmations below, choose the one that hits, and decide which belief you&apos;re ready to release.
        </Box>
        <Box tone="dark" label={ready ? "🖤 money & power activation" : "admin preview · recording not added yet"}>
          <p style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, lineHeight: 1.1, margin: "0 0 8px" }}>
            lilith: money &amp; <span style={{ color: "var(--pink)" }}>power activation.</span>
          </p>
          <p style={{ margin: "0 0 14px", fontWeight: 700 }}>{m.purpose}</p>
          <Player />
          <p style={{ margin: "12px 0 0", fontSize: 14 }}>{m.howTo[0]} {m.howTo[2]}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            {PANELS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpen((o) => (o === p.id ? null : p.id))}
                aria-expanded={open === p.id}
                style={{
                  background: open === p.id ? "var(--pink)" : "transparent",
                  color: open === p.id ? "var(--dark)" : "#fff",
                  border: "1.5px solid var(--pink)",
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontFamily: poppins,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {p.label} {open === p.id ? "−" : "+"}
              </button>
            ))}
          </div>

          {open === "for" && (
            <div style={{ marginTop: 16 }}>
              <div style={mini}>💸 this activation is for you if</div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                {x.forYouIf.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
          )}
          {open === "inside" && (
            <div style={{ marginTop: 16 }}>
              <div style={mini}>🌑 what you&apos;ll experience</div>
              <div style={{ display: "grid", gap: 8 }}>
                {m.workingWith?.map((l) => <p key={l} style={{ margin: 0 }}>{l}</p>)}
              </div>
            </div>
          )}
          {open === "after" && (
            <div style={{ marginTop: 16 }}>
              <div style={mini}>✍️ after your activation: the shadow work</div>
              <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 10 }}>
                {x.shadowWork.map((s, i) => (
                  <li key={s.label}>
                    <span style={{ fontFamily: poppins, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "var(--pink)" }}>0{i + 1}. {s.label}</span>
                    <br />
                    <strong>{s.q}</strong>
                  </li>
                ))}
              </ol>
              <Link href="/journal" className="no-underline" style={{ display: "inline-block", marginTop: 12, fontWeight: 700, color: "var(--pink)" }}>journal on this →</Link>
            </div>
          )}
          {open === "affirm" && (
            <div style={{ marginTop: 16 }}>
              <div style={mini}>🖤 your lilith affirmations</div>
              <div style={{ display: "grid", gap: 8 }}>
                {x.affirmations.map((a) => (
                  <p key={a} style={{ fontFamily: poppins, fontWeight: 800, fontSize: 17, lineHeight: 1.35, margin: 0 }}>&ldquo;{a}&rdquo;</p>
                ))}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 14 }}>Your placement-specific affirmations are in each Lilith card above.</p>
            </div>
          )}

          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <strong>💜 Tell us what came up for you, baddie.</strong>{" "}Share the beliefs you&apos;re releasing and the money moves you&apos;re ready to make.
            <div>
              <Link href={x.communityHref} className="no-underline" style={{ display: "inline-block", marginTop: 8, fontWeight: 700, color: "var(--pink)" }}>share in the community chat →</Link>
            </div>
          </div>
          {!ready && <p style={{ marginTop: 12, fontSize: 14 }}>Members can&apos;t see this yet. It switches on once the recording is added.</p>}
        </Box>
      </Stack>
    </>
  );
}
