"use client";

import Image from "next/image";
import { Box, SectionHead } from "@/components/learn/LearnKit";
import { LilithGlyph } from "@/components/learn/LilithMotif";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Who Lilith is, before any astrology. Kept to three short cards (no text walls). The story follows
// the sources the LILITH course cites: older Mesopotamian demon lore, the medieval Alphabet of Ben
// Sira where she leaves Eden rather than lie beneath Adam, and modern feminist reclamation. Black
// Moon Lilith itself is a modern astrological point, which the last card says plainly.
const CARDS: { label: string; tone: "white" | "pink" | "lav" | "dark"; body: string }[] = [
  {
    label: "who she is",
    tone: "pink",
    body: "In Jewish folklore Lilith is Adam's first wife, made from the same earth as him rather than from his rib, so she was his equal from day one, and she knew it.",
  },
  {
    label: "why she left",
    tone: "lav",
    body: "In a medieval story she refuses to lie beneath Adam, speaks the secret name of God and flies out of Eden rather than submit. For that she got rewritten as a demon and a seductress, a warning to any woman who wanted too much.",
  },
  {
    label: "why she's back",
    tone: "dark",
    body: "Feminists reclaimed her as the first woman to say no, and modern astrology gave her a point in your chart. Your Lilith shows where you were taught to shrink, and where your power has been waiting the whole time.",
  },
];

export function LilithIntro() {
  return (
    <>
      <SectionHead title="meet lilith" />
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", alignItems: "stretch" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 340, borderRadius: 18, overflow: "hidden", border: "1.5px solid var(--dark)" }}>
          <Image
            src="/lilith/lilith-hero.jpg"
            alt="Lilith, a woman under a glitter crescent moon with the Black Moon Lilith glyph on her shoulder"
            fill
            priority
            sizes="(max-width: 600px) 100vw, 360px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {CARDS.map((c) => (
            <Box key={c.label} tone={c.tone} label={c.label}>
              <p style={{ margin: 0 }}>{c.body}</p>
            </Box>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 0" }}>
        <LilithGlyph size={18} color="#FF2D87" strokeWidth={2.2} />
        <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, lineHeight: 1.3, margin: 0 }}>
          Meet her in your body first, then in <span className="pk">your</span> chart.
        </p>
      </div>
    </>
  );
}
