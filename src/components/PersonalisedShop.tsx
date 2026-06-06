"use client";

import { useEffect, useState } from "react";
import { getSavedPlacements, getSavedBirthData, savePlacements, type SavedPlacements } from "@/lib/url-params";
import { getSymbol, RISING_VIBES, PRODUCT_IMAGES, generateProducts } from "@/lib/products";

const poppins = "var(--font-poppins), Poppins, sans-serif";

function getCurrentSzn(): { sign: string; symbol: string } {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const seasons: [number, number, string][] = [
    [1, 20, "Capricorn"], [2, 19, "Aquarius"], [3, 20, "Pisces"],
    [4, 20, "Aries"], [5, 21, "Taurus"], [6, 21, "Gemini"],
    [7, 22, "Cancer"], [8, 23, "Leo"], [9, 23, "Virgo"],
    [10, 23, "Libra"], [11, 22, "Scorpio"], [12, 22, "Sagittarius"],
  ];
  let sign = "Capricorn";
  for (let i = seasons.length - 1; i >= 0; i--) {
    if (m > seasons[i][0] || (m === seasons[i][0] && d >= seasons[i][1])) {
      sign = seasons[i][2];
      break;
    }
  }
  return { sign, symbol: getSymbol(sign) };
}

export default function PersonalisedShop() {
  const [placements, setPlacements] = useState<SavedPlacements | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getSavedPlacements();
    const data = getSavedBirthData();
    if (data) setFirstName(data.name.split(" ")[0]);

    if (existing) {
      setPlacements(existing);
      setLoading(false);
    } else if (data) {
      fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.ok ? res.json() : null)
        .then((chart) => {
          if (chart) {
            const find = (name: string) => chart.planets?.find((p: { name: string; sign: string }) => p.name === name)?.sign || "";
            const p: SavedPlacements = {
              sun: find("Sun"),
              moon: find("Moon"),
              rising: chart.houses?.[0]?.sign || "",
              venus: find("Venus"),
              mars: find("Mars"),
              jupiter: find("Jupiter"),
              saturn: find("Saturn"),
              chiron: find("Chiron"),
              northNode: find("North Node"),
              midheaven: chart.houses?.[9]?.sign || "",
            };
            savePlacements(p);
            setPlacements(p);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const szn = getCurrentSzn();

  if (loading) {
    return (
      <section id="shop">
        <div className="flex items-center justify-center px-8 py-20" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
          <div className="text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full"
              style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }}
            />
            <p style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>
              personalising your shop...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!placements) {
    return <GenericShop szn={szn} />;
  }

  const products = generateProducts(placements);
  const risingVibe = RISING_VIBES[placements.rising] || RISING_VIBES["Aquarius"];

  return (
    <section id="shop">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div>
          <div className="tag">{firstName ? `curated for ${firstName}'s chart` : "personalised for your placements"}</div>
          <h1 style={{ fontFamily: poppins, fontSize: 44, fontWeight: 800, letterSpacing: "-1.2px", color: "#fff", lineHeight: 1.0 }}>
            shop {firstName ? <><span className="pk">{firstName}&apos;s</span> chart.</> : <>your <span className="pk">sign.</span></>}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 14, maxWidth: 420, lineHeight: 1.65 }}>
            Every single pick below is curated to YOUR birth chart. Your {placements.venus} Venus picks your style. Your {placements.rising} Rising sets the vibe. Your {placements.moon} Moon chooses your rituals. This isn&apos;t generic, gorgeous. This is yours.
          </p>
        </div>
        <div className="flex gap-2.5 mt-5 md:mt-0 flex-wrap">
          {[
            { label: "venus", sign: placements.venus },
            { label: "rising", sign: placements.rising },
            { label: "moon", sign: placements.moon },
            { label: "jupiter", sign: placements.jupiter },
            { label: "chiron", sign: placements.chiron },
          ].map((p, i) => (
            <div
              key={p.label}
              className="cursor-pointer transition-all"
              style={{
                background: i === 0 ? "var(--pink)" : "var(--lav)",
                color: i === 0 ? "#fff" : "#3C2A70",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 14px",
                border: "1.5px solid transparent",
              }}
            >
              {p.label} {getSymbol(p.sign)}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6" style={{ borderBottom: "var(--border)" }}>
        {products.map((prod, i) => {
          const img = PRODUCT_IMAGES[prod.cat] || PRODUCT_IMAGES["fashion"];
          return (
            <a
              key={i}
              href={`/shop/${prod.slug}`}
              className="block cursor-pointer transition-all hover:shadow-lg"
              style={{ border: "var(--border)", textDecoration: "none", color: "inherit" }}
            >
              <div
                className="h-52 flex items-center justify-center relative overflow-hidden"
                style={{ background: img.gradient }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span style={{ fontSize: 48, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>{img.overlay}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{prod.cat}</span>
                </div>
                <div className="absolute top-2.5 left-2.5" style={{ background: "var(--pink)", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px" }}>
                  {prod.placement}
                </div>
                {prod.badge && (
                  <div className="absolute top-2.5 right-2.5" style={{ background: "var(--lav)", color: "#3C2A70", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px" }}>
                    {prod.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3" style={{ fontSize: 60, opacity: 0.08, color: "#fff" }}>
                  {prod.icon}
                </div>
              </div>
              <div className="p-4" style={{ borderTop: "var(--border)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 6 }}>{prod.cat}</div>
                <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>{prod.name}</div>
                <div style={{ fontSize: 12, color: "var(--grey)", lineHeight: 1.5, marginBottom: 10 }}>
                  {prod.desc.slice(0, 80)}...
                </div>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{prod.price}</div>
                  <span style={{ background: "var(--dark)", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 14px" }}>
                    view
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Featured strip */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
        <a href={`/shop/${products[1]?.slug || ""}`} className="p-12 block" style={{ background: "var(--lav)", borderRight: "var(--border)", textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 16 }}>your rising sign edit</div>
          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 16 }}>
            Dress like your future self. Start with your {placements.rising} Rising. {getSymbol(placements.rising)}
          </h2>
          <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7, marginBottom: 24 }}>
            Your rising sign is how you show up in the world before you say a word. Your {placements.rising} rising energy is {risingVibe.desc}. These picks are curated to match that frequency so you walk into every room {risingVibe.energy}.
          </p>
          <span className="btn-pink">shop {firstName ? `${firstName}'s` : "your"} rising edit</span>
        </a>
        <div className="p-12" style={{ background: "var(--pink)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>{szn.sign.toLowerCase()} szn ritual</div>
          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 16 }}>
            {szn.sign} szn manifestation stack. {szn.symbol}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 24 }}>
            {szn.sign} season is activating your chart right now. Combined with your {placements.jupiter} Jupiter and {placements.moon} Moon, this ritual stack is designed to help you manifest in alignment with how YOU are wired to receive.
          </p>
          <button style={{ background: "#fff", color: "var(--pink)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", border: "none", cursor: "pointer" }}>shop the ritual stack</button>
        </div>
      </div>
    </section>
  );
}

function GenericShop({ szn }: { szn: { sign: string; symbol: string } }) {
  return (
    <section id="shop">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div>
          <div className="tag">personalised for your placements</div>
          <h1 style={{ fontFamily: poppins, fontSize: 44, fontWeight: 800, letterSpacing: "-1.2px", color: "#fff", lineHeight: 1.0 }}>
            shop your <span className="pk">sign.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 14, maxWidth: 380, lineHeight: 1.65 }}>
            Every pick is curated to your birth chart. Fashion, beauty, wellness, rituals, and lifestyle upgrades for the version of you that&apos;s already becoming.
          </p>
        </div>
      </div>

      <div className="px-8 py-16 text-center" style={{ borderBottom: "var(--border)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
        <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>
          generate your chart to unlock <span className="pk">your shop.</span>
        </h2>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 24px" }}>
          Every product, ritual kit, and style edit is personalised to YOUR placements. We need your chart first so we can curate the perfect picks for your Venus, Rising, Moon, Jupiter, and Chiron.
        </p>
        <a href="/chart" className="btn-pink" style={{ textDecoration: "none" }}>generate my chart</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
        <div className="p-12" style={{ background: "var(--lav)", borderRight: "var(--border)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 16 }}>featured drop</div>
          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 16 }}>Dress like your future self. Start with your rising sign.</h2>
          <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7, marginBottom: 24 }}>Your rising sign is your energetic first impression. Generate your chart and we&apos;ll curate a fashion edit that matches the frequency you broadcast before you say a word.</p>
          <a href="/chart" className="btn-pink" style={{ textDecoration: "none" }}>get my rising sign edit</a>
        </div>
        <div className="p-12" style={{ background: "var(--pink)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>{szn.sign.toLowerCase()} szn ritual</div>
          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 16 }}>{szn.sign} szn manifestation stack. {szn.symbol}</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 24 }}>This season&apos;s ritual stack is designed to work with the current cosmic weather. Generate your chart to get the version personalised to your Jupiter and Moon signs.</p>
          <button style={{ background: "#fff", color: "var(--pink)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", border: "none", cursor: "pointer" }}>shop the ritual stack</button>
        </div>
      </div>
    </section>
  );
}
