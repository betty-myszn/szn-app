"use client";

import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { RISING_VIBES, VENUS_STYLE, VENUS_STYLE_NOTES, getSymbol } from "@/lib/style-data";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function StylePage() {
  const { member, ready } = useMember();
  const season = useSeason();

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            your style codes are members only.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  // Placements can be missing on first paint (useMember marks ready before hydration finishes) and
  // are absent entirely for a member who hasn't added her birth details yet. Send her to onboarding
  // rather than dereferencing an empty sign, which would throw and blank the page.
  const venus = member.placements?.venus;
  const rising = member.placements?.rising;
  if (!venus || !rising) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            your style codes are loading.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            Add your birth details and this page fills in with your Venus style codes and your rising
            vibe, how to dress like the woman you&apos;re becoming.
          </p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }
  const venusNotes = VENUS_STYLE_NOTES[venus];
  const venusStyle = VENUS_STYLE[venus];
  const risingVibe = RISING_VIBES[rising];

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-3">style codes · venus in {venus.toLowerCase()} · {rising.toLowerCase()} rising</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            dress like your <span className="pk">next era.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 560 }}>
            Your chart holds your style blueprint, your venus is what you love, your rising is how you magnetise. Dressed together, they&apos;re how you show up as her.
          </p>
        </div>
      </section>

      {/* Venus + Rising */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>♀ {getSymbol(venus)}</div>
            <div className="tag mb-3">venus in {venus.toLowerCase()} · what you wear</div>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, marginBottom: 14 }}>
              {venusNotes.wear}
            </p>
            <p style={{ fontSize: 13, color: "var(--grey-light)", lineHeight: 1.7, marginBottom: 18 }}>
              {venusNotes.why}
            </p>
            <div className="flex gap-2 flex-wrap">
              {venusNotes.colours.map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: "var(--pink-light)",
                    color: "#993556",
                    padding: "5px 12px",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="p-8" style={{ background: "var(--lav-light)" }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>↑ {getSymbol(rising)}</div>
            <div className="tag mb-3">{rising.toLowerCase()} rising · how you magnetise</div>
            <p style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.4, color: "#3C2A70", marginBottom: 12 }}>
              {risingVibe.desc}.
            </p>
            <p style={{ fontSize: 14, color: "#3C2A70", lineHeight: 1.8 }}>
              Your first impression is {risingVibe.energy}. Lean into it, the world reads your rising before it ever meets your sun.
            </p>
          </div>
        </div>
      </section>

      {/* Signature details */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">the details that make it read as you</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            <div className="p-7" style={{ borderRight: "var(--border)" }}>
              <div className="tag mb-2">your signature move</div>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.8 }}>{venusNotes.signature}</p>
            </div>
            <div className="p-7" style={{ borderRight: "var(--border)" }}>
              <div className="tag mb-2">reach for this texture</div>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.8 }}>{venusNotes.texture}</p>
            </div>
            <div className="p-7">
              <div className="tag mb-2">what to skip</div>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.8 }}>{venusNotes.avoid}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature edit */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">your signature edit</div>
          <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            <div className="p-7" style={{ borderRight: "var(--border)", background: "var(--gold)" }}>
              <div className="tag mb-2">your signature scent profile</div>
              <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#3C2A70" }}>
                {venusStyle.scent.toLowerCase()}
              </p>
            </div>
            <div className="p-7" style={{ background: "var(--pink)" }}>
              <div className="tag mb-2" style={{ color: "#fff" }}>your wardrobe direction</div>
              <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
                {venusStyle.style.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Season overlay */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
          <div className="tag mb-3">{season.sign.toLowerCase()} szn overlay</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 12 }}>
            this szn, turn the volume up.
          </h2>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 640, marginBottom: 20 }}>
            {season.sign} season rewards {season.themes[0]}, so this is the szn to wear the piece you&apos;ve been saving. The gold jewellery, the statement colour, the outfit you always talk yourself out of. Your future self dresses like the invitation already arrived.
          </p>
          <Link href="/your-season" className="btn-pink">see what this szn is serving</Link>
        </div>
      </section>
    </>
  );
}
