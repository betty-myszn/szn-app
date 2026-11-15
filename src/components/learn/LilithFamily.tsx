"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ChartData, LilithId, LilithPoint, AspectType } from "@/types/chart";
import { HOUSE_MEANINGS, ordinalHouse } from "@/lib/interpretations";
import { glossify } from "@/components/AstroTerm";
import { Box, SectionHead } from "@/components/learn/LearnKit";
import { Pill, Stack } from "@/components/learn/DeepDive";
import { LilithBanner, LilithGlyph, LilithMotionStyles } from "@/components/learn/LilithMotif";
import { lilithHouseLine, lilithSignLine } from "@/lib/lilith-placements";

const poppins = "var(--font-poppins), Poppins, sans-serif";

type Tone = "white" | "pink" | "lav" | "dark";

interface LilithCopy {
  role: string;
  tone: Tone;
  /** One line, shown while the card is closed. */
  short: string;
  /** Two sentences, shown once it opens. */
  what: string;
  affirmations: (sign: string, area: string) => string[];
  prompts: (sign: string, area: string) => string[];
}

// Each Lilith is written to stand on its own, so no two cards share a sentence, an opening or a
// structure (the no-boilerplate rule). Sign and house area are woven in so they read as hers.
const LILITHS: Record<LilithId, LilithCopy> = {
  lilith: {
    role: "the main story",
    tone: "dark",
    short: "What you got told was too much, and where you take it back.",
    what:
      "The farthest point of the Moon's orbit, averaged out into one steady position. She's the long-running story of what got exiled, and the exact place where taking it back changes everything.",
    affirmations: (sign, area) => [
      `The ${sign} part of me they called too much is the part that makes me magnetic.`,
      `I take back everything I hid around my ${area}, starting today.`,
    ],
    prompts: (sign, area) => [
      "What was I told was too much about me as a girl, and who said it?",
      `Where around my ${area} am I still playing small to keep people comfortable?`,
    ],
  },
  true_lilith: {
    role: "how she erupts",
    tone: "pink",
    short: "How she reacts in the moment, when someone presses the button.",
    what:
      "The Moon's real farthest point at the minute you were born, wobble and all, so she can sit up to 30 degrees from your Black Moon. She's the snap, the walkout, the thing you say before you've decided to say it.",
    affirmations: (sign) => [
      `My ${sign} energy is safe to come out on purpose, so it never has to explode.`,
      "My reactions are information, and I'm allowed to feel every one of them.",
    ],
    prompts: () => [
      "When did I last snap, and what was I really protecting?",
      "What would I say right now if I weren't scared of the reaction?",
    ],
  },
  asteroid_lilith: {
    role: "where you meet her in others",
    tone: "lav",
    short: "The women who trigger you and the people who bring her out.",
    what:
      "A real asteroid between Mars and Jupiter, the only Lilith you could see through a telescope. She shows up in the women who trigger you and the partners who bring your wild side out.",
    affirmations: () => [
      "The women who trigger me are showing me what I'm ready to claim.",
      "I let other women's wildness give me permission instead of making me jealous.",
    ],
    prompts: (sign, area) => [
      "Who triggers me most right now, and what does she have that I want?",
      `Where around my ${area} do I keep meeting my Lilith in someone else?`,
    ],
  },
  dark_moon_lilith: {
    role: "the deepest layer",
    tone: "lav",
    short: "The layer you hide even from yourself.",
    what:
      "A second moon the astronomer Georg Waldemath reported in 1898, never confirmed, still calculated from his figures. She's the shadow underneath the shadow, so go gently and come back to her last.",
    affirmations: (sign, area) => [
      "I'm safe to see the parts of me I've hidden, even from myself.",
      `I stop pulling back around my ${area} right before the good thing lands.`,
    ],
    prompts: (sign, area) => [
      `Where around my ${area} do I sabotage things right before they work out?`,
      "What am I most scared someone will find out about me, and what would really happen if they did?",
    ],
  },
};

const ASPECT_WORDS: Record<AspectType, string> = {
  conjunction: "sits on",
  opposition: "faces off with",
  square: "clashes with",
  trine: "flows with",
  sextile: "opens a door with",
};

const ORDER: LilithId[] = ["lilith", "true_lilith", "asteroid_lilith", "dark_moon_lilith"];

// Charts cached before the extra Liliths existed don't carry them, so fetch a fresh calculation
// for this one section rather than touching the cached chart everything else reads.
function useLiliths(chart: ChartData): LilithPoint[] | null {
  const [fetched, setFetched] = useState<LilithPoint[] | null>(null);
  const has = Array.isArray(chart.liliths) && chart.liliths.length > 0;
  useEffect(() => {
    if (has) return;
    let cancelled = false;
    fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chart.birthData),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ChartData | null) => {
        if (!cancelled && d?.liliths) setFetched(d.liliths);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [has, chart.birthData]);
  return has ? chart.liliths! : fetched;
}

function compareLine(mean?: LilithPoint, truePt?: LilithPoint): string | null {
  if (!mean || !truePt) return null;
  let gap = Math.abs(mean.longitude - truePt.longitude);
  if (gap > 180) gap = 360 - gap;
  const g = Math.round(gap);
  if (mean.sign === truePt.sign) {
    return `Your Black Moon and True Lilith are both in ${mean.sign}, ${g}° apart, so your Lilith is loud and easy to spot.`;
  }
  return `Your Black Moon is in ${mean.sign} and your True Lilith is in ${truePt.sign}, ${g}° apart: ${mean.sign} for the pattern, ${truePt.sign} for the reaction.`;
}

function MiniLabel({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <div style={{ fontFamily: poppins, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", margin: "16px 0 6px", color: dark ? "var(--pink)" : "var(--dark)" }}>
      {children}
    </div>
  );
}

function LilithCard({ p }: { p: LilithPoint }) {
  const [open, setOpen] = useState(false);
  const info = LILITHS[p.id];
  const dark = info.tone === "dark";
  const hm = HOUSE_MEANINGS[p.house - 1];
  const area = hm ? hm.title : `${ordinalHouse(p.house)} house`;
  const pillTone = dark ? "pink" : "white";
  const signLine = lilithSignLine(p.id, p.sign);
  const houseLine = lilithHouseLine(p.id, p.house);

  return (
    <div className="lil-card" style={{ position: "relative" }}>
    <div className="lil-card-glyph" aria-hidden="true" style={{ position: "absolute", top: 16, right: 18, zIndex: 1 }}>
      <LilithGlyph size={22} color={dark ? "#FF2D87" : "#1a1a1a"} strokeWidth={2} />
    </div>
    <Box tone={info.tone} label={`${p.name.toLowerCase()} · ${info.role}`}>
      <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, lineHeight: 1.2, margin: "0 0 10px" }}>
        {p.sign.toLowerCase()}, {ordinalHouse(p.house)} house
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <Pill tone={pillTone}>{p.formattedDegree}</Pill>
        {hm && <Pill tone={pillTone}>{hm.title}</Pill>}
        {p.id === "true_lilith" && p.retrograde && <Pill tone={pillTone}>moving backwards</Pill>}
      </div>
      <p style={{ fontWeight: 700, margin: 0 }}>{info.short}</p>

      {open && (
        <div>
          <p style={{ marginTop: 12 }}>{glossify(info.what)}</p>

          {signLine && (
            <>
              <MiniLabel dark={dark}>{`what ${p.sign.toLowerCase()} means for her`}</MiniLabel>
              <p style={{ margin: 0 }}>{glossify(signLine)}</p>
            </>
          )}
          {houseLine && (
            <>
              <MiniLabel dark={dark}>{`what your ${ordinalHouse(p.house)} house means for her`}</MiniLabel>
              <p style={{ margin: 0 }}>{glossify(houseLine)}</p>
            </>
          )}

          <MiniLabel dark={dark}>her aspects</MiniLabel>
          {p.aspects.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 2 }}>
              {p.aspects.map((a) => (
                <li key={a.body + a.type}>
                  {ASPECT_WORDS[a.type]} your <strong>{a.body.toLowerCase()}</strong> ({a.type}, {a.orb}°)
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>No tight aspects, so she speaks through her sign and house alone.</p>
          )}

          <MiniLabel dark={dark}>your affirmations</MiniLabel>
          <div style={{ display: "grid", gap: 8 }}>
            {info.affirmations(p.sign, area).map((a) => (
              <p key={a} style={{ fontFamily: poppins, fontWeight: 800, fontSize: 16.5, lineHeight: 1.35, margin: 0 }}>
                &ldquo;{a}&rdquo;
              </p>
            ))}
          </div>

          <MiniLabel dark={dark}>journal prompts</MiniLabel>
          <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            {info.prompts(p.sign, area).map((q) => (
              <li key={q} style={{ fontWeight: 700 }}>{q}</li>
            ))}
          </ol>

          <div style={{ marginTop: 14, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href={`/my-chart/house/${p.house}`} className="no-underline" style={{ fontWeight: 700, color: dark ? "var(--pink)" : "var(--dark)" }}>
              explore your {ordinalHouse(p.house)} house →
            </Link>
            <Link href="/journal" className="no-underline" style={{ fontWeight: 700, color: dark ? "var(--pink)" : "var(--dark)" }}>
              journal on this →
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          marginTop: 14,
          background: dark ? "var(--pink)" : "var(--dark)",
          color: dark ? "var(--dark)" : "#fff",
          border: "none",
          borderRadius: 999,
          padding: "9px 16px",
          fontFamily: poppins,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {open ? "close her up −" : "open her up +"}
      </button>
    </Box>
    </div>
  );
}

export function LilithFamily({ chart }: { chart: ChartData }) {
  const all = useLiliths(chart);
  if (!all) return null;
  const points = ORDER.map((id) => all.find((p) => p.id === id)).filter(Boolean) as LilithPoint[];
  if (points.length < 2) return null;

  const compare = compareLine(
    points.find((p) => p.id === "lilith"),
    points.find((p) => p.id === "true_lilith"),
  );

  return (
    <>
      <SectionHead title="every lilith in your chart" />
      <LilithMotionStyles />
      <LilithBanner />
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", alignItems: "stretch", marginBottom: 14 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 320, borderRadius: 18, overflow: "hidden", border: "1.5px solid var(--dark)" }}>
          <Image src="/lilith/lilith-hero.jpg" alt="Lilith, a woman under a glitter crescent moon with the Black Moon Lilith glyph on her shoulder" fill sizes="(max-width: 600px) 100vw, 360px" style={{ objectFit: "cover" }} />
        </div>
        <Box tone="white" label="why there's more than one">
          <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, lineHeight: 1.35, margin: "0 0 10px" }}>
            The Moon&apos;s orbit wobbles, so astrology tracks four Liliths, and each one answers a different question.
          </p>
          {compare && <p style={{ margin: 0 }}>{glossify(compare)}</p>}
          <p style={{ margin: "10px 0 0", fontWeight: 700 }}>Open each one for her aspects, affirmations and journal prompts.</p>
        </Box>
      </div>
      <Stack cols={280}>
        {points.map((p) => (
          <LilithCard key={p.id} p={p} />
        ))}
      </Stack>
      {chart.approximate && (
        <p style={{ marginTop: 12, fontSize: 14, fontWeight: 700 }}>
          Your birth time is approximate, so the houses can shift. The signs and aspects hold either way.
        </p>
      )}
    </>
  );
}
