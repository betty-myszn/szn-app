"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ZODIAC, type Dimension, type Sign, type StyleVector } from "@/lib/style/types";
import { composeStyleProfile, scoreProduct } from "@/lib/style/engine";
import { PRODUCTS, productImage, type Product } from "@/lib/style/catalogue";

// SHOP YOUR SIGN, the waitlist landing page.
//
// Positioning comes from Betty's Threads post and it leads with the customer's actual problem
// ("what do I wear to this thing") rather than with how the matching works. The engine is the
// answer, never the pitch.
//
// The demo is the real engine on the real 191-piece catalogue, so she can change her chart, her
// occasion and how she wants to feel and watch the clothes rebuild. She can play with it forever
// without giving us anything; the email capture sits underneath, after she has had the experience.

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Where you're going. Written the way she'd say it out loud, not as engine ids.
const OCCASIONS: { id: string; label: string }[] = [
  { id: "first-date", label: "a first date" },
  { id: "big-meeting", label: "a big meeting" },
  { id: "interview", label: "a job interview" },
  { id: "wedding-guest", label: "a wedding" },
  { id: "night-out", label: "a night out" },
  { id: "party", label: "a party" },
  { id: "holiday", label: "a holiday" },
  { id: "festival", label: "a festival" },
  { id: "everyday", label: "a random Tuesday" },
];

// How you want to FEEL, which is the half nobody else asks for. Each one is a real set of nudges on
// the same 0-100 dimensions the signs and situations already speak, applied on top of her chart, so
// the feeling genuinely moves the clothes rather than decorating the form.
const FEELINGS: { id: string; label: string; nudges: Partial<Record<Dimension, number>> }[] = [
  {
    id: "hot",
    label: "hot, confident + slightly intimidating",
    nudges: { sensual: 28, bodyConscious: 22, edge: 20, glamour: 12, casual: -20 },
  },
  {
    id: "expensive",
    label: "expensive + powerful",
    nudges: { polished: 28, structure: 25, texture: 18, classic: 12, casual: -25 },
  },
  {
    id: "asked",
    label: "like everyone asks where it's from",
    nudges: { maximal: 26, colourIntensity: 22, experimental: 18, glamour: 15, minimal: -22 },
  },
  {
    id: "soft",
    label: "soft, romantic + a little dreamy",
    nudges: { romantic: 28, fluidity: 22, feminine: 18, texture: 12, edge: -20 },
  },
  {
    id: "effortless",
    label: "cool, like you didn't try",
    nudges: { casual: 25, minimal: 20, oversized: 14, glamour: -18, printIntensity: -10 },
  },
  {
    id: "comfy",
    label: "comfortable but still hot",
    nudges: { casual: 20, fluidity: 18, sensual: 15, structure: -14 },
  },
];

// What you're looking for. "everything" builds a whole outfit across categories.
const LOOKING_FOR: { id: string; label: string }[] = [
  { id: "all", label: "the whole outfit" },
  { id: "dresses", label: "a dress" },
  { id: "tops", label: "a top" },
  { id: "bottoms", label: "trousers or a skirt" },
  { id: "outerwear", label: "a jacket or coat" },
  { id: "shoes", label: "shoes" },
];

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export default function ShopYourSignPage() {
  const [rising, setRising] = useState<Sign>("Leo");
  const [venus, setVenus] = useState<Sign>("Scorpio");
  const [occasion, setOccasion] = useState("first-date");
  const [feeling, setFeeling] = useState("hot");
  const [lookingFor, setLookingFor] = useState("all");

  const profile = useMemo(
    () => composeStyleProfile({ rising, venus }, { situationId: occasion }),
    [rising, venus, occasion]
  );

  const edit = useMemo(() => {
    if (!profile) return [];
    // Her chart and her occasion give the base. How she wants to FEEL is applied on top, which is
    // what makes "a first date where I want to feel hot" a different edit from "a first date where
    // I want to feel soft".
    const nudges = FEELINGS.find((f) => f.id === feeling)?.nudges ?? {};
    const vector = { ...profile.vector } as StyleVector;
    for (const [dim, delta] of Object.entries(nudges)) {
      vector[dim as Dimension] = clamp(vector[dim as Dimension] + (delta as number));
    }
    const tuned = { ...profile, vector };

    const pool = lookingFor === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === lookingFor);
    const scored = pool
      .map((product) => ({ product, match: scoreProduct(tuned, product) }))
      .sort((a, b) => b.match - a.match);
    if (scored.length === 0) return [];

    // Raw cosine on all-positive vectors sits in a narrow band, so printing it directly gives every
    // piece the same number. Spread across the pool instead, so the score means "how far up these
    // for you" and actually moves when she changes something.
    const top = scored[0].match;
    const bottom = scored[scored.length - 1].match;
    const range = top - bottom;
    const vibeFor = (m: number) => (range < 1e-6 ? 96 : Math.round(72 + ((m - bottom) / range) * 27));

    if (lookingFor !== "all") {
      return scored.slice(0, 4).map((s) => ({ product: s.product, vibe: vibeFor(s.match) }));
    }
    // A whole outfit means one piece per category rather than four versions of the same dress.
    const seen = new Set<string>();
    const picks: { product: Product; vibe: number }[] = [];
    for (const s of scored) {
      if (seen.has(s.product.category)) continue;
      seen.add(s.product.category);
      picks.push({ product: s.product, vibe: vibeFor(s.match) });
      if (picks.length === 4) break;
    }
    return picks;
  }, [profile, feeling, lookingFor]);

  const occasionLabel = OCCASIONS.find((o) => o.id === occasion)?.label ?? "";
  const feelingLabel = FEELINGS.find((f) => f.id === feeling)?.label ?? "";

  return (
    <main>
      {/* ── hero: the positioning line, then what it does ─────────────────── */}
      <section className="bg-glitter" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5 py-16 md:py-24 text-center">
          <p style={eyebrowLight}>coming to my szn</p>
          <h1
            style={{
              fontFamily: poppins,
              fontWeight: 800,
              fontSize: "clamp(40px, 8vw, 84px)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              color: "#fff",
              textTransform: "lowercase",
              margin: "0 0 22px",
            }}
          >
            shop your sign.
          </h1>
          <p
            style={{
              fontFamily: poppins,
              fontWeight: 800,
              fontSize: "clamp(19px, 3.1vw, 30px)",
              lineHeight: 1.25,
              color: "var(--pink)",
              maxWidth: 700,
              margin: "0 auto 22px",
            }}
          >
            Imagine ASOS, except the entire shopping experience is personalised to your astrology.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.86)",
              maxWidth: 620,
              margin: "0 auto 30px",
            }}
          >
            Tell us where you&rsquo;re going, how you want to feel and what you&rsquo;re looking for.
            Shop Your Sign uses your birth chart and your personal style to find clothes you can
            actually buy.
          </p>
          <a href="#waitlist" className="no-underline inline-block" style={ctaStyle}>
            Join the waitlist
          </a>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>
            Or scroll down and have a go. It&rsquo;s already working.
          </p>
        </div>
      </section>

      {/* ── the examples, straight away ───────────────────────────────────── */}
      <section style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5 py-14 md:py-18">
          <div className="grid gap-4 md:grid-cols-2">
            <Ask>First date and you want to feel <em>hot, confident + slightly intimidating</em>?</Ask>
            <Ask>Big meeting and you want to look <em>expensive + powerful</em>?</Ask>
            <Ask>Wedding and you want <em>everyone asking where your dress is from</em>?</Ask>
            <Ask>Holiday and you need <em>your entire fucking wardrobe sorted</em>?</Ask>
          </div>
          <p
            style={{
              fontFamily: poppins,
              fontWeight: 800,
              fontSize: "clamp(18px, 2.6vw, 24px)",
              textAlign: "center",
              lineHeight: 1.4,
              maxWidth: 700,
              margin: "34px auto 0",
            }}
          >
            Tell it the occasion and the vibe, get recommendations built on your chart, then actually
            shop the pieces.
          </p>
        </div>
      </section>

      {/* ── the demo ──────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
          <h2 style={h2Style}>so try it.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 640, margin: "0 0 28px" }}>
            This is the real thing running on real clothes. Change anything and watch it rebuild.
          </p>

          <p style={sectionLabel}>your chart</p>
          <div className="grid gap-4 md:grid-cols-2" style={{ marginBottom: 22 }}>
            <Picker label="rising" hint="decides the shapes" value={rising} onChange={setRising} />
            <Picker label="venus" hint="decides the colours" value={venus} onChange={setVenus} />
          </div>

          <p style={sectionLabel}>what you need</p>
          <div className="grid gap-4 md:grid-cols-3" style={{ marginBottom: 28 }}>
            <Select label="where you're going" value={occasion} onChange={setOccasion} options={OCCASIONS} />
            <Select label="how you want to feel" value={feeling} onChange={setFeeling} options={FEELINGS} />
            <Select label="what you're looking for" value={lookingFor} onChange={setLookingFor} options={LOOKING_FOR} />
          </div>

          {profile && edit.length > 0 && (
            <div style={{ background: "#fff", border: "var(--border)", padding: "26px 24px" }}>
              <p style={{ ...eyebrowPink, margin: "0 0 12px" }}>
                {rising} rising &middot; {venus} venus &middot; {occasionLabel} &middot; {feelingLabel}
              </p>

              <div className="grid gap-5 md:grid-cols-2" style={{ marginBottom: 22 }}>
                <Detail title="your shapes" body={profile.architecture.silhouette} />
                <Detail title="the move that makes it yours" body={profile.architecture.signatureMove} />
              </div>

              <p style={{ ...eyebrowDark, margin: "0 0 10px" }}>your colours</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                {[...profile.aesthetic.colour.hero, ...profile.aesthetic.colour.supporting]
                  .slice(0, 6)
                  .map((swatch) => (
                    <div key={swatch.name} style={{ textAlign: "center", width: 56 }}>
                      <div style={{ width: 46, height: 46, background: swatch.hex, border: "1.5px solid var(--dark)" }} />
                      <span style={{ fontSize: 10, display: "block", marginTop: 4 }}>{swatch.name}</span>
                    </div>
                  ))}
              </div>

              <p
                style={{
                  ...eyebrowDark,
                  margin: "0 0 14px",
                  paddingTop: 18,
                  borderTop: "1.5px solid var(--dark)",
                }}
              >
                and here&rsquo;s what to actually buy
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {edit.map(({ product, vibe }) => (
                  <ProductCard key={product.id} product={product} vibe={vibe} rising={rising} venus={venus} />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#666", marginTop: 14 }}>
                Real pieces from real shops. Prices in dollars, correct when this edit was built.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── how it knows ──────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto px-5 py-14 md:py-20 text-center">
          <h2 style={{ ...h2Style, textAlign: "center" }}>how it learns you.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, margin: "0 auto" }}>
            You put in your birth details once, and Shop Your Sign learns your personal style from your
            chart. Your <strong>Rising</strong> runs the shapes, the proportions and the pieces that
            carry a whole outfit. Your <strong>Venus</strong> runs the colours, the fabrics and the
            details that decide whether something feels like you or like a costume. Then where
            you&rsquo;re going and how you want to feel move it again, so the same chart dresses
            differently for a Tuesday and for a wedding.
          </p>
        </div>
      </section>

      {/* ── the bigger thing ──────────────────────────────────────────────── */}
      <section style={{ background: "var(--pink-bg)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto px-5 py-16 md:py-20 text-center">
          <p
            style={{
              fontFamily: poppins,
              fontWeight: 800,
              fontSize: "clamp(22px, 3.6vw, 34px)",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              margin: "0 0 18px",
            }}
          >
            Your astrology shouldn&rsquo;t just be something you read about. It should be something you
            actually USE.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.8, margin: "0 0 18px" }}>
            Your goals. Your money. Your relationships. Your routines. Your style.
          </p>
          <p
            style={{
              fontFamily: poppins,
              fontWeight: 800,
              fontSize: "clamp(20px, 3.2vw, 30px)",
              color: "var(--pink)",
              margin: 0,
            }}
          >
            And soon, your fucking CLOSETTTTT &#128717;&#65039;&#10024;
          </p>
        </div>
      </section>

      {/* ── waitlist ──────────────────────────────────────────────────────── */}
      <section id="waitlist" style={{ background: "var(--dark)" }}>
        <div className="max-w-2xl mx-auto px-5 py-16 md:py-24 text-center">
          <h2
            style={{
              fontFamily: poppins,
              fontWeight: 800,
              fontSize: "clamp(26px, 4.2vw, 42px)",
              textTransform: "lowercase",
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: "0 0 12px",
            }}
          >
            shop your sign, coming to my szn.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: "0 0 26px" }}>
            The waitlist gets in first, and gets their first edit built the day it opens.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}

// ── styles ──────────────────────────────────────────────────────────────────

const eyebrowLight: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--pink)",
  marginBottom: 18,
};

const eyebrowPink: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--pink)",
};

const eyebrowDark: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: poppins,
  fontWeight: 800,
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  margin: "0 0 10px",
};

const h2Style: React.CSSProperties = {
  fontFamily: poppins,
  fontWeight: 800,
  fontSize: "clamp(26px, 4vw, 40px)",
  textTransform: "lowercase",
  letterSpacing: "-0.02em",
  margin: "0 0 10px",
};

const ctaStyle: React.CSSProperties = {
  background: "var(--pink)",
  color: "#fff",
  fontFamily: poppins,
  fontWeight: 800,
  fontSize: 15,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  padding: "16px 34px",
  border: "2px solid #fff",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: 7,
};

const hintStyle: React.CSSProperties = {
  fontWeight: 500,
  letterSpacing: "0.04em",
  textTransform: "none",
  color: "#6b6b6b",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  border: "var(--border)",
  background: "#fff",
  fontSize: 15,
  fontFamily: "inherit",
};

// ── small pieces ────────────────────────────────────────────────────────────

function Ask({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "var(--border)", background: "#fff", padding: "22px 22px 24px" }}>
      <p style={{ fontSize: 17, lineHeight: 1.55, margin: 0 }}>{children}</p>
    </div>
  );
}

function Picker({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: Sign;
  onChange: (s: Sign) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label} <span style={hintStyle}>{hint}</span>
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value as Sign)} style={selectStyle}>
        {ZODIAC.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Detail({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p style={{ ...eyebrowPink, fontSize: 10.5, margin: "0 0 5px" }}>{title}</p>
      <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{body}</p>
    </div>
  );
}

function ProductCard({
  product,
  vibe,
  rising,
  venus,
}: {
  product: Product;
  /** Where this sits across the pool for her, 72 to 99. A relative fit, not an absolute claim. */
  vibe: number;
  rising: Sign;
  venus: Sign;
}) {
  const img = productImage(product, 320);
  const reason =
    product.vector.structure >= 78
      ? `the shape your ${rising} rising wants`
      : product.vector.sensual >= 75 || product.vector.texture >= 78
        ? `for your ${venus} Venus`
        : `fits your ${rising} rising`;

  return (
    <div style={{ border: "var(--border)", background: "#fff" }}>
      <div style={{ position: "relative", aspectRatio: "3 / 4", background: "var(--lav-light)" }}>
        {img && (
          <Image
            src={img}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 45vw, 200px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        )}
        <span
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "var(--pink)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.06em",
            padding: "4px 7px",
            fontFamily: poppins,
          }}
        >
          {vibe}% you
        </span>
      </div>
      <div style={{ padding: "11px 12px 13px" }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
          {product.brand}
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.4, margin: "0 0 6px" }}>{product.title}</p>
        <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 14, margin: "0 0 6px" }}>${product.price}</p>
        <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "var(--pink)", margin: 0 }}>{reason}</p>
      </div>
    </div>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "shop-your-sign" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 20, color: "var(--pink)", margin: 0 }}>
        You&rsquo;re on the list. See you in there.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 justify-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your email"
        aria-label="Your email address"
        style={{
          flex: 1,
          maxWidth: 340,
          padding: "15px 16px",
          border: "2px solid #fff",
          background: "transparent",
          color: "#fff",
          fontSize: 15,
          fontFamily: "inherit",
        }}
      />
      <button type="submit" disabled={state === "sending"} style={{ ...ctaStyle, border: "2px solid var(--pink)", cursor: state === "sending" ? "wait" : "pointer" }}>
        {state === "sending" ? "adding you..." : "Join the waitlist"}
      </button>
      {state === "error" && (
        <p style={{ color: "#fff", fontSize: 13, margin: 0 }}>That didn&rsquo;t save. Try again in a moment.</p>
      )}
    </form>
  );
}
