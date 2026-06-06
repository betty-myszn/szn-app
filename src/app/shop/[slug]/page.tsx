"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSavedPlacements, getSavedBirthData, savePlacements, type SavedPlacements } from "@/lib/url-params";
import { generateProducts, getSymbol, PRODUCT_IMAGES, type Product } from "@/lib/products";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getSavedPlacements();
    const data = getSavedBirthData();
    if (data) setFirstName(data.name.split(" ")[0]);

    if (existing) {
      const products = generateProducts(existing);
      setAllProducts(products);
      setProduct(products.find((p) => p.slug === slug) || null);
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
            const products = generateProducts(p);
            setAllProducts(products);
            setProduct(products.find((pr) => pr.slug === slug) || null);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--grey)", letterSpacing: "0.04em" }}>loading your product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 py-32">
        <div className="text-center" style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
            product not found
          </div>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>
            We couldn&apos;t find this product. It might be personalised to a different chart. Generate your chart to see products curated just for you!
          </p>
          <a href="/chart" className="inline-block mt-6" style={{ background: "var(--pink)", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 28px", border: "none", textDecoration: "none" }}>
            generate my chart
          </a>
        </div>
      </div>
    );
  }

  const img = PRODUCT_IMAGES[product.cat] || PRODUCT_IMAGES["fashion"];
  const otherProducts = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="px-8 py-3" style={{ borderBottom: "var(--border)" }}>
        <div className="flex gap-2 items-center" style={{ fontSize: 11, color: "var(--grey-light)" }}>
          <a href="/shop" style={{ color: "var(--grey-light)", textDecoration: "none" }}>shop</a>
          <span>/</span>
          <a href="/shop" style={{ color: "var(--grey-light)", textDecoration: "none" }}>{product.cat}</a>
          <span>/</span>
          <span style={{ color: "var(--dark)" }}>{product.name}</span>
        </div>
      </div>

      {/* Product Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
        {/* Image */}
        <div
          className="flex items-center justify-center relative min-h-[400px] md:min-h-[500px]"
          style={{ background: img.gradient, borderRight: "var(--border)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <span style={{ fontSize: 80, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}>{img.overlay}</span>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{product.cat}</span>
          </div>
          {/* Placement badge */}
          <div className="absolute top-4 left-4" style={{ background: "var(--pink)", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 12px" }}>
            {product.placement}
          </div>
          {product.badge && (
            <div className="absolute top-4 right-4" style={{ background: "var(--lav)", color: "#3C2A70", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 12px" }}>
              {product.badge}
            </div>
          )}
          {/* Watermark */}
          <div className="absolute bottom-6 right-6" style={{ fontSize: 100, opacity: 0.06, color: "#fff" }}>
            {product.icon}
          </div>
        </div>

        {/* Details */}
        <div className="px-8 py-10 flex flex-col justify-center">
          {/* Brand + Retailer */}
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--dark)" }}>
              {product.brand}
            </span>
            <span style={{ fontSize: 10, color: "var(--grey-light)" }}>via</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--grey)" }}>
              {product.retailer}
            </span>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>
            {product.cat} {product.badge ? ` / ${product.badge}` : ""}
          </div>
          <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 12 }}>
            {product.name}
          </h1>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--dark)", marginBottom: 20 }}>
            {product.price}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--grey)", marginBottom: 24 }}>
            {product.desc}
          </p>

          {/* Why this is for you */}
          <div className="p-5 mb-6" style={{ background: "var(--pink-light)", border: "1.5px solid var(--pink)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 8 }}>
              why this is for {firstName || "you"}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>
              {product.whyYou}
            </p>
          </div>

          {/* Product details */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 12 }}>
              details
            </div>
            <div className="space-y-2">
              {product.details.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5" style={{ fontSize: 13, color: "var(--dark)" }}>
                  <span style={{ color: "var(--pink)", fontSize: 10 }}>&#10003;</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* CTA - Affiliate link-out */}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", textAlign: "center", textDecoration: "none",
              background: "var(--pink)", color: "#fff", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 32px",
              border: "none", cursor: "pointer", width: "100%", boxSizing: "border-box",
            }}
          >
            shop at {product.retailer} &rarr;
          </a>
          <p style={{ fontSize: 10, color: "var(--grey-light)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
            this is an affiliate link. we may earn a small commission at no extra cost to you.
          </p>
        </div>
      </div>

      {/* You might also love */}
      {otherProducts.length > 0 && (
        <div style={{ borderBottom: "var(--border)" }}>
          <div className="px-8 pt-10 pb-6">
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.3px" }}>
              also in <span className="pk">{firstName ? `${firstName}'s` : "your"} chart</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-8">
            {otherProducts.map((prod, i) => {
              const prodImg = PRODUCT_IMAGES[prod.cat] || PRODUCT_IMAGES["fashion"];
              return (
                <a
                  key={i}
                  href={`/shop/${prod.slug}`}
                  className="block transition-all hover:shadow-lg"
                  style={{ border: "var(--border)", textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="h-40 flex items-center justify-center relative overflow-hidden"
                    style={{ background: prodImg.gradient }}
                  >
                    <span style={{ fontSize: 36, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>{prodImg.overlay}</span>
                    <div className="absolute top-2 left-2" style={{ background: "var(--pink)", color: "#fff", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 7px" }}>
                      {prod.placement}
                    </div>
                  </div>
                  <div className="p-3.5" style={{ borderTop: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)" }}>{prod.brand}</span>
                      <span style={{ fontSize: 9, color: "var(--grey-light)" }}>via {prod.retailer}</span>
                    </div>
                    <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>{prod.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{prod.price}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
