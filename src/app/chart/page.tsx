import Link from "next/link";
import BirthDataForm from "@/components/BirthDataForm";
import { OG_IMAGE } from "@/lib/site";

export const metadata = {
  title: "Free Birth Chart & Human Design Calculator | Sun, Moon, Rising & Type",
  description:
    "Get your free birth chart and your Human Design chart from one set of birth details. Sun, moon, rising, Venus, Mars and every placement, plus your Human Design type, strategy, authority and profile. Swiss Ephemeris precision. No signup required.",
  alternates: { canonical: "/chart" },
  openGraph: {
    title: "Free Birth Chart + Human Design Calculator, MY SZN",
    description: "Calculate your full natal chart and your Human Design bodygraph for free, from one form. Sun, moon, rising, all 12 houses, plus your type, strategy, authority and profile.",
    url: "/chart",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Answers to what people actually type alongside "free birth chart". Rendered on the page as well
// as marked up below, because FAQ schema describing content a visitor cannot see is a violation of
// Google's structured data guidelines and gets the markup ignored at best.
const FAQS = [
  {
    q: "Do I need my exact birth time for a birth chart?",
    a: "For your sun sign, no. For your rising sign and house placements, yes, and it matters more than people expect. The rising sign changes roughly every two hours, so being an hour out can hand you the wrong chart entirely. Your birth time is usually on your birth certificate. If you genuinely cannot find it, enter 12:00 and treat the rising sign and houses as unreliable while the planets stay accurate.",
  },
  {
    q: "Do I get my Human Design chart too?",
    a: "Yes, from the same form. Human Design is calculated from the same date, time and place as your birth chart, so you get both at once: your type, strategy, authority, profile and which of your centres are defined, alongside your full natal chart.",
  },
  {
    q: "Is this birth chart calculator really free?",
    a: "Yes. The full chart, every placement and the written breakdown are free, and there is no signup or card required to see them.",
  },
  {
    q: "What is the difference between my sun, moon and rising sign?",
    a: "Your sun sign is your core identity, the thing you are growing into. Your moon sign is your inner emotional world, how you self-soothe and what you need to feel safe. Your rising sign, or ascendant, is the version of you people meet first. Most people only know their sun sign, which is why astrology often feels like it does not fit.",
  },
  {
    q: "How accurate is this chart?",
    a: "Positions are calculated with the Swiss Ephemeris, the same astronomical data professional astrologers use, and we use the true lunar node rather than the mean node. Accuracy depends on the birth date, time and place you enter being correct.",
  },
  {
    q: "What is a birth chart, exactly?",
    a: "A birth chart, also called a natal chart, is a map of where every planet sat in the sky at the moment and place you were born. It never repeats in the same way twice, which is why it is used as a blueprint for personality, patterns and timing.",
  },
];

const chartJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "MY SZN Birth Chart Calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      url: "https://itsmyszn.com/chart",
      description:
        "Free natal chart calculator returning sun, moon, rising, Venus, Mars, Jupiter, Chiron and all twelve house placements, calculated with the Swiss Ephemeris.",
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

export default function ChartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chartJsonLd) }}
      />

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
            your free birth chart<br />
            <span className="pk">and human design.</span>
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
            One set of birth details, two complete charts. Your Sun, Moon, Rising, Venus, Mars
            and every placement, plus your Human Design type, strategy, authority and profile.
            Your chart says who you are here to become, your design says how you are built to get
            there. Both free. No catch.
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

      {/* FAQ */}
      <section className="px-8 py-14 md:py-20" style={{ borderTop: "var(--border)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{
            fontFamily: poppins, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 32, textAlign: "center",
          }}>
            Birth chart <span className="pk">questions,</span> answered.
          </h2>

          <div style={{ borderTop: "var(--border)" }}>
            {FAQS.map((f) => (
              <details
                key={f.q}
                style={{ borderBottom: "var(--border)", padding: "18px 0" }}
              >
                <summary style={{
                  fontFamily: poppins, fontSize: 16, fontWeight: 700, color: "var(--dark)",
                  cursor: "pointer", listStyle: "none",
                }}>
                  {f.q}
                </summary>
                <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--dark)", marginTop: 12 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", marginTop: 28, textAlign: "center" }}>
            Curious what the current sky is asking of you?{" "}
            <Link href="/seasons" className="pk" style={{ fontWeight: 700 }}>
              Read up on every zodiac season
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Membership CTA */}
      <div className="px-8 py-14 text-center" style={{ background: "var(--pink-light)", borderTop: "var(--border)" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
          go deeper than your chart
        </p>
        <h2 style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
          Try MY SZN free for 7 days.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dark)", maxWidth: 480, margin: "0 auto 8px" }}>
          Your chart is just the beginning. Get a live masterclass and astrotapping every month, subconscious rewiring and community to help you actually live your astrology. Go VIP and you get a 1:1 coaching call with Betty on top.
        </p>
        <p style={{ fontSize: 12, color: "var(--pink)", fontWeight: 700, marginBottom: 20 }}>
          From $88/mo · Cancel anytime · 1:1 coaching on VIP, $555/mo
        </p>
        <a href="/free-trial" style={{
          display: "inline-block", background: "var(--pink)", color: "var(--dark)",
          fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", textDecoration: "none",
        }}>
          start your free 7 days
        </a>
      </div>
    </>
  );
}
