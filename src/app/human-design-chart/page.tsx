import Link from "next/link";
import BirthDataForm from "@/components/BirthDataForm";
import { OG_IMAGE } from "@/lib/site";

export const metadata = {
  title: "Free Human Design Chart Calculator | Type, Strategy & Authority",
  description:
    "Get your free Human Design chart instantly. Discover your Type, Strategy, Authority, Profile and bodygraph, calculated on the Swiss Ephemeris from your exact birth details. No signup required.",
  alternates: { canonical: "/human-design-chart" },
  openGraph: {
    title: "Free Human Design Chart Calculator, MY SZN",
    description:
      "Calculate your Human Design chart for free. Your Type, Strategy, Authority, Profile, centres and bodygraph, from your birth date, time and place.",
    url: "/human-design-chart",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Answers to what people actually type alongside "free human design chart", rendered on the page as
// well as marked up, so the FAQ schema describes content a visitor can actually see.
const FAQS = [
  {
    q: "What is Human Design?",
    a: "Human Design is a system that maps how your energy is wired from your exact birth moment. Where astrology tells you who you are here to become, Human Design tells you how you are designed to get there: how to make decisions, where your consistent energy is, and where you take the world in. It is calculated from the same birth date, time and place as your astrology chart.",
  },
  {
    q: "Do I need my exact birth time?",
    a: "For your Type it matters less, but for your Authority, Profile and defined centres it matters a lot, more than people expect. A birth time an hour out can change your chart entirely. Your birth time is usually on your birth certificate. If you genuinely cannot find it, you can still generate a chart, but treat the finer detail as approximate.",
  },
  {
    q: "Is this Human Design calculator really free?",
    a: "Yes. Your Type, Strategy, Authority, Profile and bodygraph are free, with no signup or card required to see them. The deeper reading, your centres, channels, every gate and how your design plays out across money, love, business and confidence, lives inside the MY SZN membership.",
  },
  {
    q: "What are the five Human Design Types?",
    a: "Manifestor, Generator, Manifesting Generator, Projector and Reflector. Your Type is the foundation of your chart: it sets your Strategy, the way you are designed to engage with life so things flow rather than force. Most people have never been told they were operating against their own design.",
  },
  {
    q: "How accurate is this chart?",
    a: "Positions are calculated with the Swiss Ephemeris, the same astronomical data used for professional astrology, and the design side is set at the exact moment the Sun was 88 degrees of arc before your birth. Accuracy depends on the birth date, time and place you enter being correct.",
  },
];

const chartJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "MY SZN Human Design Chart Calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      url: "https://itsmyszn.com/human-design-chart",
      description:
        "Free Human Design chart calculator returning Type, Strategy, Authority, Profile, defined and open centres and the bodygraph, calculated with the Swiss Ephemeris.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HumanDesignChartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chartJsonLd) }}
      />

      <div className="px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
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
            your free <span className="pk">human design chart.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>
            Discover your Type, Strategy, Authority and Profile, and see your bodygraph laid out.
            Astrology tells you who you are here to become. Human Design tells you how you are
            designed to get there. Completely free. No catch.
          </p>
        </div>
      </div>

      {/* Trust strip */}
      <div
        className="flex flex-wrap items-center justify-center gap-6 px-8 py-4"
        style={{
          background: "var(--lav-light)",
          borderBottom: "var(--border)",
          fontSize: 11,
          fontWeight: 600,
          color: "#3C2A70",
          letterSpacing: "0.06em",
        }}
      >
        <span>&#10003; Free forever</span>
        <span>&#10003; Swiss Ephemeris precision</span>
        <span>&#10003; Type, Strategy &amp; Authority</span>
        <span>&#10003; Your bodygraph</span>
      </div>

      <div className="px-8 py-12 max-w-xl mx-auto">
        <BirthDataForm
          destination="/human-design"
          leadSource="free-human-design"
          computeAstrology={false}
          submitLabel="get my free human design chart"
          loadingLabel="building your design..."
        />
      </div>

      {/* FAQ */}
      <section className="px-8 py-14 md:py-20" style={{ borderTop: "var(--border)" }}>
        <div className="max-w-2xl mx-auto">
          <h2
            style={{
              fontFamily: poppins,
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 800,
              letterSpacing: "-0.8px",
              lineHeight: 1.15,
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            Human Design <span className="pk">questions,</span> answered.
          </h2>

          <div style={{ borderTop: "var(--border)" }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ borderBottom: "var(--border)", padding: "18px 0" }}>
                <summary
                  style={{
                    fontFamily: poppins,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--dark)",
                    cursor: "pointer",
                    listStyle: "none",
                  }}
                >
                  {f.q}
                </summary>
                <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--dark)", marginTop: 12 }}>{f.a}</p>
              </details>
            ))}
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", marginTop: 28, textAlign: "center" }}>
            Want your astrology too?{" "}
            <Link href="/chart" className="pk" style={{ fontWeight: 700 }}>
              Get your free birth chart
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Membership CTA */}
      <div className="px-8 py-14 text-center" style={{ background: "var(--pink-light)", borderTop: "var(--border)" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
          want to go deeper than your type?
        </p>
        <h2 style={{ fontFamily: poppins, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
          Join the MY SZN membership.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dark)", maxWidth: 500, margin: "0 auto 8px" }}>
          Your Type is the surface. Inside, your Human Design and your astrology are woven together across every part of your life: your centres, channels and every gate, plus how your design actually plays out in money, love, business and confidence, with live coaching and community to help you live it.
        </p>
        <p style={{ fontSize: 12, color: "var(--pink)", fontWeight: 700, marginBottom: 20 }}>
          From $88/mo · Cancel anytime · 1:1 coaching on VIP, $555/mo
        </p>
        <a
          href="/membership"
          style={{
            display: "inline-block",
            background: "var(--pink)",
            color: "var(--dark)",
            fontFamily: poppins,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "14px 32px",
            textDecoration: "none",
          }}
        >
          see the plans
        </a>
      </div>
    </>
  );
}
