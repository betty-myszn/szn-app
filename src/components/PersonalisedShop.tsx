"use client";

import { useEffect, useState } from "react";
import { getSavedPlacements, getSavedBirthData, savePlacements, type SavedPlacements } from "@/lib/url-params";
import {
  ZODIAC_SIGNS,
  ZODIAC_SYMBOLS,
} from "@/types/chart";

const poppins = "var(--font-poppins), Poppins, sans-serif";

function getSymbol(sign: string): string {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  return idx >= 0 ? ZODIAC_SYMBOLS[idx] : "";
}

// Rising sign style vibes for the featured strip
const RISING_VIBES: Record<string, { desc: string; energy: string }> = {
  Aries: { desc: "bold, fierce, and unapologetically first", energy: "fierce, magnetic, ahead of everyone else in the room" },
  Taurus: { desc: "luxe, sensual, and effortlessly expensive-looking", energy: "luxurious, grounded, radiating wealth energy" },
  Gemini: { desc: "playful, trend-setting, and never boring", energy: "versatile, witty, the most interesting person in every room" },
  Cancer: { desc: "soft, romantic, and quietly powerful", energy: "nurturing, intuitive, giving main character-in-a-romcom vibes" },
  Leo: { desc: "dramatic, golden, and impossible to ignore", energy: "magnetic, regal, born to be looked at" },
  Virgo: { desc: "minimal, curated, and devastatingly chic", energy: "polished, intentional, giving 'she has her life together' energy" },
  Libra: { desc: "balanced, beautiful, and gallery-opening gorgeous", energy: "charming, stylish, the aesthetic benchmark for everyone around you" },
  Scorpio: { desc: "magnetic, mysterious, and darkly glamorous", energy: "intense, alluring, giving 'don't mess with me but also please do' energy" },
  Sagittarius: { desc: "adventurous, eclectic, and cosmopolitan cool", energy: "free-spirited, worldly, the one with the best stories" },
  Capricorn: { desc: "powerful, timeless, and effortlessly authoritative", energy: "ambitious, sleek, giving CEO-on-holiday realness" },
  Aquarius: { desc: "electric, original, and ahead of everyone", energy: "innovative, cool, giving 'is she from the future?' energy" },
  Pisces: { desc: "dreamy, ethereal, and hauntingly beautiful", energy: "mystical, artistic, mermaid-off-duty glamour" },
};

// Venus sign product vibes
const VENUS_PRODUCTS: Record<string, { scent: string; style: string }> = {
  Aries: { scent: "Fire & Musk", style: "Red Statement Pieces" },
  Taurus: { scent: "Rose & Sandalwood", style: "Cashmere Essentials" },
  Gemini: { scent: "Citrus & Verbena", style: "Mix-Match Accessories" },
  Cancer: { scent: "Moonflower & Vanilla", style: "Silk & Linen Layers" },
  Leo: { scent: "Gold & Amber", style: "Bold Prints & Jewels" },
  Virgo: { scent: "Lavender & Cedar", style: "Tailored Minimals" },
  Libra: { scent: "Peony & Champagne", style: "Romantic Coordinates" },
  Scorpio: { scent: "Oud & Black Orchid", style: "Dark Femme Edit" },
  Sagittarius: { scent: "Saffron & Leather", style: "Wanderlust Wardrobe" },
  Capricorn: { scent: "Vetiver & Suede", style: "Power Dressing Edit" },
  Aquarius: { scent: "Electric Ozone & Iris", style: "Avant-Garde Capsule" },
  Pisces: { scent: "Sea Salt & Jasmine", style: "Ethereal Layers" },
};

// Current zodiac season
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
      // Birth data exists but placements were never saved. Fetch chart to get them.
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

  // If no saved data at all, show generic version
  if (!placements) {
    return <GenericShop szn={szn} />;
  }

  const venusProduct = VENUS_PRODUCTS[placements.venus] || VENUS_PRODUCTS["Leo"];
  const risingVibe = RISING_VIBES[placements.rising] || RISING_VIBES["Aquarius"];

  const products = [
    {
      icon: "♀",
      bg: "var(--pink-light)",
      placement: `venus in ${placements.venus.toLowerCase()}`,
      badge: "for you",
      cat: "fashion",
      name: `${placements.venus} Venus ${venusProduct.style}`,
      price: "$186",
    },
    {
      icon: "↑",
      bg: "#E0F5EE",
      placement: `${placements.rising.toLowerCase()} rising`,
      badge: "szn pick",
      cat: "fashion",
      name: `${placements.rising} Rising Edit`,
      price: "$220",
    },
    {
      icon: "☽",
      bg: "var(--lav-light)",
      placement: `moon in ${placements.moon.toLowerCase()}`,
      badge: "",
      cat: "rituals",
      name: `${placements.moon} Moon Ceremony Kit`,
      price: "$64",
    },
    {
      icon: "♃",
      bg: "var(--dark)",
      placement: `jupiter in ${placements.jupiter.toLowerCase()}`,
      badge: "bestseller",
      cat: "money mindset",
      name: `Jupiter in ${placements.jupiter} Abundance Journal`,
      price: "$38",
      iconColor: "var(--lav)",
    },
    {
      icon: "⚷",
      bg: "var(--cream)",
      placement: `chiron in ${placements.chiron.toLowerCase()}`,
      badge: "",
      cat: "wellness",
      name: `Chiron in ${placements.chiron} Healing Course`,
      price: "$97",
    },
    {
      icon: "♀",
      bg: "var(--gold)",
      placement: `venus in ${placements.venus.toLowerCase()}`,
      badge: "new",
      cat: "beauty",
      name: `Venus in ${placements.venus} ${venusProduct.scent} Collection`,
      price: "$78",
    },
  ];

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
        {products.map((prod, i) => (
          <div key={i} className="cursor-pointer transition-colors" style={{ border: "var(--border)" }}>
            <div className="h-40 flex items-center justify-center text-[40px] relative" style={{ background: prod.bg, color: (prod as { iconColor?: string }).iconColor }}>
              {prod.icon}
              <div className="absolute top-2.5 left-2.5" style={{ background: "var(--pink)", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px" }}>
                {prod.placement}
              </div>
              {prod.badge && (
                <div className="absolute top-2.5 right-2.5" style={{ background: "var(--lav)", color: "#3C2A70", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px" }}>
                  {prod.badge}
                </div>
              )}
            </div>
            <div className="p-3.5" style={{ borderTop: "var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 5 }}>{prod.cat}</div>
              <div style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>{prod.name}</div>
              <div className="flex items-center justify-between">
                <div style={{ fontSize: 14, fontWeight: 700 }}>{prod.price}</div>
                <button style={{ background: "var(--dark)", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px", border: "none", cursor: "pointer" }}>
                  add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured strip */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
        <div className="p-12" style={{ background: "var(--lav)", borderRight: "var(--border)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 16 }}>your rising sign edit</div>
          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 16 }}>
            Dress like your future self. Start with your {placements.rising} Rising. {getSymbol(placements.rising)}
          </h2>
          <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7, marginBottom: 24 }}>
            Your rising sign is how you show up in the world before you say a word. Your {placements.rising} rising energy is {risingVibe.desc}. These picks are curated to match that frequency so you walk into every room {risingVibe.energy}.
          </p>
          <button className="btn-pink">shop {firstName ? `${firstName}'s` : "your"} rising edit</button>
        </div>
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

// Generic version for users without saved data
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
        <div className="flex gap-2.5 mt-5 md:mt-0 flex-wrap">
          {["venus", "rising", "moon", "jupiter", "chiron"].map((p, i) => (
            <div
              key={p}
              className="cursor-pointer transition-all"
              style={{
                background: i === 0 ? "var(--pink)" : "var(--lav)",
                color: i === 0 ? "#fff" : "#3C2A70",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 14px",
                border: "1.5px solid transparent",
              }}
            >
              {p}
            </div>
          ))}
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

      {/* Featured strip */}
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
