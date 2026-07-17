import BirthDataForm from "@/components/BirthDataForm";

export const metadata = {
  title: "Free Birth Chart Calculator | Sun, Moon & Rising Sign",
  description:
    "Get your free birth chart instantly. Discover your sun sign, moon sign, rising sign, Venus, Mars, Jupiter, and every placement in your natal chart. Swiss Ephemeris precision. No signup required.",
  openGraph: {
    title: "Free Birth Chart Calculator — MY SZN",
    description: "Calculate your full natal chart for free. Sun, moon, rising, Venus, Mars, Jupiter, Chiron and all 12 houses. Enter your birth details and discover your cosmic blueprint.",
  },
};

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function ChartPage() {
  return (
    <>
      <div
        className="px-8 py-12"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="tag mb-3">100% free</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            your free <span className="pk">birth chart.</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 460,
              margin: "0 auto",
            }}
          >
            Discover your Sun, Moon, Rising, Venus, Mars and every placement in your chart.
            We&apos;ll show you who you are, what makes you magnetic, and how to work
            with your cosmic blueprint. Completely free. No catch.
          </p>
        </div>
      </div>

      {/* Trust strip */}
      <div
        className="flex flex-wrap items-center justify-center gap-6 px-8 py-4"
        style={{
          background: "var(--pink-light)",
          borderBottom: "var(--border)",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--dark)",
          letterSpacing: "0.06em",
        }}
      >
        <span>&#10003; Free forever</span>
        <span>&#10003; Swiss Ephemeris precision</span>
        <span>&#10003; Full chart breakdown</span>
        <span>&#10003; Personalised insights</span>
      </div>

      <div className="px-8 py-12 max-w-xl mx-auto">
        <BirthDataForm />
      </div>

      {/* Membership CTA */}
      <div className="px-8 py-14 text-center" style={{ background: "var(--pink-light)", borderTop: "var(--border)" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
          want to go deeper than your chart?
        </p>
        <h2 style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
          Join the MY SZN membership.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dark)", maxWidth: 480, margin: "0 auto 8px" }}>
          Your chart is just the beginning. Get live workshops, subconscious rewiring, community, and a 1:1 coaching call with Betty to help you actually live your astrology.
        </p>
        <p style={{ fontSize: 12, color: "var(--pink)", fontWeight: 700, marginBottom: 20 }}>
          From $111/mo · Cancel anytime after 3 months · Launches 23 July
        </p>
        <a href="/membership" style={{
          display: "inline-block", background: "var(--pink)", color: "#fff",
          fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", textDecoration: "none",
        }}>
          join the waitlist
        </a>
      </div>
    </>
  );
}
