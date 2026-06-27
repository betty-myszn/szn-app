const pp = "var(--font-poppins), Poppins, sans-serif";

export const metadata = {
  title: "Podcast — MY SZN",
};

export default function PodcastPage() {
  return (
    <>
      <div
        className="px-8 py-16 md:py-24"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="tag mb-4">the podcast</div>
          <h1
            style={{
              fontFamily: pp,
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            my<span style={{ color: "var(--pink)" }}>szn</span> podcast.
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Astrology, personal development, confidence, money, business, relationships
            and becoming the woman you came here to be. New episodes weekly.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-16 text-center">
        <div style={{ fontSize: 48, marginBottom: 20 }}>🎙️</div>
        <h2
          style={{
            fontFamily: pp,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            marginBottom: 16,
          }}
        >
          Coming <span className="pk">soon.</span>
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: "var(--grey)",
            maxWidth: 420,
            margin: "0 auto 32px",
          }}
        >
          The MY SZN podcast is in production. Conversations about astrology, growth,
          money mindset, confidence, and what it actually takes to become the version
          of yourself you keep dreaming about.
        </p>
        <p
          style={{
            fontSize: 14,
            color: "var(--grey-light)",
            marginBottom: 40,
          }}
        >
          Want to be the first to know when we launch?
        </p>
        <a
          href="/waitlist"
          className="btn-pink"
          style={{ textDecoration: "none" }}
        >
          join the waitlist
        </a>
      </div>

      {/* What to expect */}
      <div style={{ borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="tag mb-6 text-center">what to expect</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {[
              { title: "Astrology Deep Dives", desc: "Beyond your sun sign. Transits, houses, aspects, and how to actually USE your chart.", bg: "var(--lav-light)" },
              { title: "Money & Business", desc: "Abundance blocks, wealth consciousness, and building a business aligned with your chart.", bg: "var(--gold)" },
              { title: "Confidence", desc: "Self-worth, visibility, putting yourself out there, and why you keep playing small.", bg: "var(--pink-light)" },
              { title: "Relationships", desc: "Synastry, attachment styles, boundaries, and what your Venus is actually trying to tell you.", bg: "var(--cream)" },
              { title: "Guest Experts", desc: "Astrologers, coaches, therapists, and women who are living proof that transformation works.", bg: "var(--mint)" },
              { title: "Healing", desc: "Shadow work, inner child, subconscious rewiring, and making peace with the parts of yourself you hid.", bg: "var(--lav-light)" },
            ].map((card) => (
              <div
                key={card.title}
                className="p-8"
                style={{ background: card.bg, border: "var(--border)", marginRight: -1.5, marginBottom: -1.5 }}
              >
                <div style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.3px" }}>
                  {card.title}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)", margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
