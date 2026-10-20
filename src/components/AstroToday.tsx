"use client";

import { useEffect, useState } from "react";
import AstroTerm from "@/components/AstroTerm";
import { HOUSE_MEANINGS, getBodyMeaning, houseForLongitude, ordinalHouse } from "@/lib/interpretations";
import type { ChartData } from "@/types/chart";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Today's sky laid over her natal chart: which of her houses the Moon is lighting up, the tightest
// contacts the fast planets are making to her personal placements, and any fast planet retrograde.
// The positions come from /api/sky/now (the same for everyone, cached at the edge); the maths
// against her chart happens here.

interface SkyPos {
  id: string;
  name: string;
  longitude: number;
  sign: string;
  degree: number;
  retrograde: boolean;
}

const ASPECTS = [
  { type: "conjunction", angle: 0, verb: "is sitting on" },
  { type: "sextile", angle: 60, verb: "is sextile" },
  { type: "square", angle: 90, verb: "is squaring" },
  { type: "trine", angle: 120, verb: "is trining" },
  { type: "opposition", angle: 180, verb: "is opposing" },
] as const;

// What each contact asks of her, short and specific to the transiting planet and the angle.
const DEMAND: Record<string, Record<string, string>> = {
  Sun: { conjunction: "a spotlight moment, be SEEN", sextile: "an easy opening, say yes to it", square: "pressure to grow, lean in", trine: "flow, use the momentum", opposition: "a mirror, notice who shows you yourself" },
  Moon: { conjunction: "big feelings, let them move", sextile: "a soft moment, nurture yourself", square: "an emotional itch, name it", trine: "emotional ease, enjoy it", opposition: "a feelings tug of war, rest" },
  Mercury: { conjunction: "a download, write it down", sextile: "a good convo, send the message", square: "crossed wires, slow your words", trine: "clear thinking, make the plan", opposition: "another view, listen first" },
  Venus: { conjunction: "a glow-up, receive it", sextile: "a sweet opening, flirt with it", square: "a values check, choose you", trine: "pleasure and ease, treat yourself", opposition: "a relationship mirror, ask for what you want" },
  Mars: { conjunction: "a power surge, move", sextile: "a green light, take the step", square: "friction, channel it into a workout or a hard convo", trine: "motivated energy, get it done", opposition: "a push from someone else, hold your ground" },
};

const TARGETS = ["sun", "moon", "mercury", "venus", "mars"];

export default function AstroToday({ chart }: { chart: ChartData }) {
  const [sky, setSky] = useState<SkyPos[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let off = false;
    fetch("/api/sky/now")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !off && setSky(d.positions))
      .catch(() => !off && setFailed(true));
    return () => {
      off = true;
    };
  }, []);

  if (failed) return null;

  const cusps = chart.houses.map((h) => h.longitude);
  const rows: { key: string; label: string; text: React.ReactNode; tone: "pink" | "lav" | "dark" }[] = [];

  if (sky) {
    const moon = sky.find((p) => p.id === "moon");
    if (moon) {
      const h = houseForLongitude(moon.longitude, cusps);
      const m = HOUSE_MEANINGS[h - 1];
      rows.push({
        key: "moon",
        label: `Moon in ${moon.sign} · your ${ordinalHouse(h)} house`,
        text: (
          <>
            <strong>Your {m.title} is in the spotlight today.</strong> The Moon is moving through the part of your chart about{" "}
            {m.rules}, so that&apos;s where your feelings will be loudest.
          </>
        ),
        tone: "lav",
      });
    }

    // natal points she cares about, plus her rising
    const natal = [
      ...chart.planets.filter((p) => TARGETS.includes(p.id)).map((p) => ({ id: p.id, name: p.name, longitude: p.longitude })),
      { id: "rising", name: "Ascendant", longitude: chart.ascendant },
    ];
    const contacts: { key: string; orb: number; t: SkyPos; n: (typeof natal)[number]; a: (typeof ASPECTS)[number] }[] = [];
    for (const t of sky) {
      for (const n of natal) {
        // angular separation, 0-180
        const sep = Math.abs((((t.longitude - n.longitude) % 360) + 540) % 360 - 180);
        for (const a of ASPECTS) {
          const orb = Math.abs(sep - a.angle);
          if (orb <= (t.id === "moon" ? 3 : 2)) contacts.push({ key: `${t.id}-${n.id}-${a.type}`, orb, t, n, a });
        }
      }
    }
    contacts.sort((x, y) => x.orb - y.orb);
    // three different sentence shapes, so no two cards on screen read alike
    contacts.slice(0, 3).forEach((c, i) => {
      const natalName = c.n.id === "rising" ? "rising" : c.n.name;
      const domain = getBodyMeaning(c.n.id)?.domainShort ?? "presence";
      const demand = DEMAND[c.t.name][c.a.type];
      const verb = <AstroTerm k={c.a.type}>{c.a.verb}</AstroTerm>;
      const text =
        i === 0 ? (
          <>
            <strong>
              {c.t.name} {verb} your natal {natalName}.
            </strong>{" "}
            {demand.charAt(0).toUpperCase() + demand.slice(1)}, and it lands on your {domain}.
          </>
        ) : i === 1 ? (
          <>
            <strong>{demand.charAt(0).toUpperCase() + demand.slice(1)}.</strong> {c.t.name} {verb} your {natalName}, which stirs up your{" "}
            {domain}.
          </>
        ) : (
          <>
            <strong>Your {domain} gets a nudge.</strong> {c.t.name} {verb} your natal {natalName}, so think {demand}.
          </>
        );
      rows.push({ key: c.key, label: `${c.t.name} ${c.a.type} your ${natalName}`, text, tone: "pink" });
    });

    for (const p of sky.filter((x) => x.retrograde && x.id !== "sun" && x.id !== "moon")) {
      const h = houseForLongitude(p.longitude, cusps);
      rows.push({
        key: `rx-${p.id}`,
        label: `${p.name} retrograde in ${p.sign}`,
        text: (
          <>
            <strong>Review, redo, reconnect.</strong> <AstroTerm k="retrograde">Retrograde</AstroTerm> {p.name} is walking back through your{" "}
            {ordinalHouse(h)} house of {HOUSE_MEANINGS[h - 1].title}, so that&apos;s the area to revisit before you push anything new.
          </>
        ),
        tone: "dark",
      });
    }
  }

  const tone = {
    pink: { background: "var(--pink-light)", color: "var(--dark)" },
    lav: { background: "var(--lav-light)", color: "var(--dark)" },
    dark: { background: "var(--dark)", color: "#fff" },
  };
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section className="holo-edge" style={{ background: "#fff", borderRadius: 22, padding: "20px 18px", margin: "8px 0 28px", color: "var(--dark)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <h2 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 700, margin: 0 }}>today in your chart</h2>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>{today}</span>
      </div>
      {!sky ? (
        <p style={{ margin: 0, fontSize: 14 }}>reading today&apos;s sky...</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {rows.map((r) => (
            <div key={r.key} style={{ ...tone[r.tone], borderRadius: 16, padding: "14px 16px", fontSize: 14.5, lineHeight: 1.55 }}>
              <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 4, color: r.tone === "dark" ? "var(--pink)" : "var(--dark)" }}>
                {r.label}
              </div>
              {r.text}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
