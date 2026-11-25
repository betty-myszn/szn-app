import BirthDataForm from "@/components/BirthDataForm";
import { OG_IMAGE } from "@/lib/site";
import "../your-season/places/places.css";

export const metadata = {
  title: "Free Astrocartography Chart | Where in the World You Glow",
  description:
    "Your free astrocartography map from your exact birth details: the cities where you find love, make money and glow up, on an interactive map you can share.",
  alternates: { canonical: "/power-places" },
  openGraph: {
    title: "Free Astrocartography Chart, MY SZN",
    description: "Where in the world you glow: your love, money and glow-up cities from your birth chart.",
    url: "/power-places",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

const FAQS = [
  {
    q: "What is astrocartography?",
    a: "The minute you were born, every planet was rising, setting, overhead or underneath somewhere on earth. Astrocartography draws those spots as lines across the world map, and living, travelling or holidaying near a line switches that planet on in your life: Venus lines for love, Jupiter lines for luck and money, Sun lines for being seen.",
  },
  {
    q: "Do I need my exact birth time?",
    a: "Yes, as close as you can get it. Four minutes of birth time shifts every line by about 1°, roughly 70 to 110km, so your birth certificate time gives you the most accurate map.",
  },
  {
    q: "What do I get for free?",
    a: "Your top three cities to live, to travel, for love, for money and for a glow up, your full map of planet lines, and a story-sized card to share. Members of The Bad B*tch Coven get every goal, any town on earth, their chart redrawn for anywhere they live, when their lines light up this year and a girls' trip planner.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function PowerPlacesFreePage() {
  return (
    <div className="acg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <div className="wrap">
          <div className="tag">free astrocartography</div>
          <h1><span className="holo-text">where in the world you glow.</span></h1>
          <p>Your birth chart drawn across the world map. Pop in your birth details and see the cities where you fall in love, make serious money and glow up, plus a card to share with your besties.</p>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="mapcard" style={{ padding: "22px 18px", marginTop: 28 }}>
            <BirthDataForm
              destination="/power-places/you"
              leadSource="free-power-places"
              computeAstrology={false}
              submitLabel="show me my places"
              loadingLabel="drawing your map..."
            />
          </div>
          <div className="block">
            <div className="tag">good to know</div>
            <h2 className="h2" style={{ marginTop: 8 }}>your lines, explained.</h2>
          </div>
          <div className="timing" style={{ paddingBottom: 56 }}>
            {FAQS.map((f) => (
              <div className="tcard" key={f.q}>
                <h4 style={{ marginTop: 0 }}>{f.q}</h4>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
