import { Band } from "@/components/Offer";

// What every in-person Baddie Brunch is for, shared by every city's coven page (Betty, 18 Nov 2026):
// making real friends AND manifesting together around a theme from that astrology season.
// The season themes are examples of the next few brunches; update the list as the seasons roll on.

const pp = "var(--font-poppins), Poppins, sans-serif";

const SEASONS = [
  ["♐", "Sagittarius season", "Going BIG on our dreams, our life and our money."],
  ["♑", "Capricorn season", "Ambition, money and building something that lasts."],
  ["♒", "Aquarius season", "Your future self, your people and your wildest ideas."],
  ["♓", "Pisces season", "Dreams, intuition and the magic you've been ignoring."],
];

const card = { border: "2px solid var(--dark)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;

export default function BrunchMagicBand({ city }: { city: string }) {
  return (
    <Band tone="pinkLight" wide tag="every baddie brunch" title="new friends AND" accent="manifesting together.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 26 }}>
        <div className="holo-edge" style={card}>
          <div style={{ fontSize: 28 }}>💞</div>
          <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.2, margin: "10px 0 6px" }}>Real friends in {city}</div>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6 }}>You meet ambitious, witchy women who get your dreams, hype your wins and actually text you back, the kind of friends you keep seeing long after brunch.</p>
        </div>
        <div className="holo-edge" style={card}>
          <div style={{ fontSize: 28 }}>🔮</div>
          <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.2, margin: "10px 0 6px" }}>A manifesting theme every season</div>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6 }}>Every brunch takes its theme from that astrology season, and we journal, set intentions and manifest around it together, with your own printed guide to what the season means for YOUR chart.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginTop: 16 }}>
        {SEASONS.map(([glyph, season, theme]) => (
          <div key={season} style={{ ...card, padding: "16px 16px 18px", background: "#fff" }}>
            <div style={{ fontFamily: pp, fontSize: 26, fontWeight: 800, color: "var(--pink)", lineHeight: 1 }}>{glyph}</div>
            <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, marginTop: 8 }}>{season}</div>
            <p style={{ margin: "4px 0 0", fontSize: 14.5, lineHeight: 1.5 }}>{theme}</p>
          </div>
        ))}
      </div>
    </Band>
  );
}
