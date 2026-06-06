"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSavedPlacements, getSavedBirthData, savePlacements, type SavedPlacements } from "@/lib/url-params";
import { generateProducts, getSymbol, PRODUCT_IMAGES, RISING_VIBES, VENUS_PRODUCTS, type Product } from "@/lib/products";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const FILTER_CONFIG: Record<string, { label: string; planet: string; emoji: string; getSign: (p: SavedPlacements) => string; getDesc: (p: SavedPlacements) => string }> = {
  venus: {
    label: "Venus",
    planet: "♀",
    emoji: "💕",
    getSign: (p) => p.venus,
    getDesc: (p) => {
      const vp = VENUS_PRODUCTS[p.venus] || VENUS_PRODUCTS["Leo"];
      return `Your Venus is in ${p.venus}, which means you're drawn to ${vp.style.toLowerCase()} and scents like ${vp.scent.toLowerCase()}. Everything here is curated to how you love, what you find beautiful, and how you express your identity through style and aesthetics.`;
    },
  },
  rising: {
    label: "Rising",
    planet: "↑",
    emoji: "✨",
    getSign: (p) => p.rising,
    getDesc: (p) => {
      const rv = RISING_VIBES[p.rising] || RISING_VIBES["Aquarius"];
      return `Your ${p.rising} Rising means your vibe is ${rv.desc}. Your rising sign is your energetic first impression and these picks are curated to match the frequency you broadcast before you say a word.`;
    },
  },
  moon: {
    label: "Moon",
    planet: "☽",
    emoji: "🌙",
    getSign: (p) => p.moon,
    getDesc: (p) => `Your Moon is in ${p.moon}, which governs your emotional world, what makes you feel safe, and what nourishes your soul. These rituals and tools are designed for exactly how your inner world works.`,
  },
  jupiter: {
    label: "Jupiter",
    planet: "♃",
    emoji: "💰",
    getSign: (p) => p.jupiter,
    getDesc: (p) => `Jupiter in ${p.jupiter} is your personal abundance code. It reveals how luck, expansion, and prosperity flow into your life. These tools are designed for how YOU are wired to receive.`,
  },
  chiron: {
    label: "Chiron",
    planet: "⚷",
    emoji: "🌿",
    getSign: (p) => p.chiron,
    getDesc: (p) => `Your Chiron in ${p.chiron} reveals your deepest wound and the extraordinary gift that lives on the other side of healing it. These courses and tools go straight to the root of YOUR pattern.`,
  },
};

function ShopContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || null;
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
              sun: find("Sun"), moon: find("Moon"), rising: chart.houses?.[0]?.sign || "",
              venus: find("Venus"), mars: find("Mars"), jupiter: find("Jupiter"),
              saturn: find("Saturn"), chiron: find("Chiron"), northNode: find("North Node"),
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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--grey)", letterSpacing: "0.04em" }}>loading your shop...</p>
        </div>
      </div>
    );
  }

  if (!placements) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 py-32">
        <div className="text-center" style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
            we need your chart first!
          </div>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>
            Every product in the shop is personalised to YOUR birth chart. Generate your chart and we&apos;ll curate the perfect picks for you.
          </p>
          <a href="/chart" className="inline-block mt-6" style={{ background: "var(--pink)", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 28px", border: "none", textDecoration: "none" }}>
            generate my chart
          </a>
        </div>
      </div>
    );
  }

  const allProducts = generateProducts(placements);
  const filterConfig = filter ? FILTER_CONFIG[filter] : null;

  // Filter products by placement
  const filteredProducts = filterConfig
    ? allProducts.filter((p) => p.placement.includes(filter!))
    : allProducts;

  const sign = filterConfig ? filterConfig.getSign(placements) : null;

  return (
    <div>
      {/* Hero */}
      <div className="px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="mx-auto max-w-5xl">
          {filterConfig && sign ? (
            <>
              <div className="tag mb-3">{firstName ? `${firstName}'s` : "your"} {filterConfig.label.toLowerCase()} sign picks</div>
              <h1 style={{ fontFamily: poppins, fontSize: 40, fontWeight: 800, letterSpacing: "-1px", color: "#fff", lineHeight: 1.05, marginBottom: 14 }}>
                shop {firstName ? <>{firstName}&apos;s </> : "your "}
                <span className="pk">{filterConfig.label} in {sign}. {getSymbol(sign)}</span>
              </h1>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: 520 }}>
                {filterConfig.getDesc(placements)}
              </p>
            </>
          ) : (
            <>
              <div className="tag mb-3">{firstName ? `curated for ${firstName}'s chart` : "personalised for your placements"}</div>
              <h1 style={{ fontFamily: poppins, fontSize: 40, fontWeight: 800, letterSpacing: "-1px", color: "#fff", lineHeight: 1.05, marginBottom: 14 }}>
                shop {firstName ? <><span className="pk">{firstName}&apos;s</span> chart.</> : <>your <span className="pk">sign.</span></>}
              </h1>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: 520 }}>
                Every single pick below is curated to YOUR birth chart. Your {placements.venus} Venus picks your style. Your {placements.rising} Rising sets the vibe. Your {placements.moon} Moon chooses your rituals.
              </p>
            </>
          )}

          {/* Filter pills */}
          <div className="flex gap-2.5 mt-6 flex-wrap">
            <a
              href="/shop"
              style={{
                background: !filter ? "var(--pink)" : "rgba(255,255,255,0.1)",
                color: !filter ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "8px 14px", border: "1.5px solid transparent", textDecoration: "none",
              }}
            >
              all
            </a>
            {Object.entries(FILTER_CONFIG).map(([key, config]) => {
              const isActive = filter === key;
              const s = config.getSign(placements);
              return (
                <a
                  key={key}
                  href={`/shop?filter=${key}`}
                  style={{
                    background: isActive ? "var(--pink)" : "rgba(255,255,255,0.1)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "8px 14px", border: "1.5px solid transparent", textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  {key} {getSymbol(s)}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontSize: 14, color: "var(--grey)" }}>No products found for this filter. Try another placement!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((prod, i) => {
              const img = PRODUCT_IMAGES[prod.cat] || PRODUCT_IMAGES["fashion"];
              return (
                <a
                  key={i}
                  href={`/shop/${prod.slug}`}
                  className="block transition-all hover:shadow-lg"
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
                      {prod.desc.slice(0, 90)}...
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
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
