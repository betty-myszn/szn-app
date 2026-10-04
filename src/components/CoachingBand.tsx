import DoorButton from "@/components/DoorButton";

// The headline of the three-month cohort: private coaching with Betty every month, plus group
// coaching every season. Shared by the home page.
const pp = "var(--font-poppins), Poppins, sans-serif";

export default function CoachingBand() {
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--dark)", color: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 20 }}>
          the big deal
        </div>
        <h2 className="display" style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "#fff", lineHeight: 0.98 }}>
          coached by betty,
          <br />
          <span style={{ color: "var(--pink)" }}>privately, every month.</span>
        </h2>
        <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7, fontWeight: 500, maxWidth: 760, marginTop: 24 }}>
          This is where it stops being something you read and starts being something you live. You get me in your corner one to one, and a room of women doing it with you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 36 }}>
          {[
            {
              tag: "private 1:1 · every month",
              h: "Three private sessions with Betty",
              items: [
                "One a month, built around what you're creating in your 90 days",
                "Your chart and Human Design on the table",
                "Money, visibility, business, relationships, shadow work, whatever is actually coming up",
                "You leave every session with your next moves",
              ],
              bg: "var(--pink)",
            },
            {
              tag: "group mastermind · every season",
              h: "A live room with your cohort",
              items: [
                "Coaching and teaching on the season's transformation",
                "Astro Tapping through the fear and resistance that comes up",
                "Hot seats, so you get coached in front of women who get it",
                "Real-world action, and a little magic to close",
              ],
              bg: "var(--lav)",
            },
          ].map((c) => (
            <div key={c.tag} style={{ background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 22, overflow: "hidden" }}>
              <div style={{ background: c.bg, color: c.bg === "var(--pink)" ? "#fff" : "var(--dark)", fontFamily: pp, fontWeight: 800, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 20px" }}>
                {c.tag}
              </div>
              <div style={{ padding: "22px 22px 24px" }}>
                <div style={{ fontFamily: pp, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 14 }}>{c.h}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  {c.items.map((i) => (
                    <li key={i} style={{ fontSize: 15, lineHeight: 1.55 }}>
                      <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, marginTop: 26 }}>
          Plus a hypnosis every season, your personalised astrology guide and a small private cohort. Worth $1,111 a month, founding price $555 a month for three months.
        </p>
        <DoorButton variant={2} />
      </div>
    </section>
  );
}
