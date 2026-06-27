import BirthDataForm from "@/components/BirthDataForm";

export const metadata = {
  title: "Free Birth Chart — MY SZN",
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
    </>
  );
}
