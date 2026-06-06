import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

function Ticker({ variant, items }: { variant?: "lav"; items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className={`ticker${variant === "lav" ? " ticker--lav" : ""}`}>
      <div className="ticker-inner">
        {doubled.map((text, i) => (
          <span key={i}>
            {i > 0 && <span className="dot">&#10022;</span>}
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Ticker */}
      <Ticker
        items={[
          "shop your sign",
          "become your future self",
          "heal your patterns",
          "dress like your next era",
          "your cosmic blueprint",
        ]}
      />

      {/* Hero */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-8 py-16"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div>
          <div className="tag mb-4">your era starts here</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: 48,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-1.2px",
              color: "#fff",
              marginBottom: 20,
            }}
          >
            shop your sign.
            <br />
            become your
            <br />
            <span className="pk">future self.</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.55)",
              marginBottom: 32,
              maxWidth: 420,
            }}
          >
            MY SZN turns your birth chart into personalised guidance for style,
            confidence, money, healing, manifestation, and self-evolution.
          </p>
          <div className="flex gap-3">
            <Link href="/chart" className="btn-pink">
              generate my chart
            </Link>
            <a href="#chart" className="btn-outline btn-outline--white">
              explore the platform
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: 280, height: 280 }}>
            <div
              className="absolute rounded-full"
              style={{
                width: 280, height: 280, top: 0, left: 0,
                border: "1.5px solid rgba(255,255,255,0.12)", background: "#222",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 200, height: 200, top: 40, left: 40,
                border: "1.5px solid rgba(200,180,248,0.3)", background: "var(--dark)",
              }}
            />
            <div
              className="absolute rounded-full flex items-center justify-center flex-col"
              style={{
                width: 130, height: 130, top: 75, left: 75,
                border: "1.5px solid rgba(255,45,135,0.4)", background: "#111",
              }}
            >
              <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                sun sign
              </div>
              <div style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, color: "var(--pink)", marginTop: 4 }}>
                &#9811; aquarius
              </div>
            </div>
            {[
              { glyph: "☉", bg: "#FFF4D6", bc: "#EF9F27", style: { top: 10, left: 116 } },
              { glyph: "☽", bg: "var(--lav-light)", bc: "var(--lav)", style: { top: 52, right: 14 } },
              { glyph: "♀", bg: "var(--pink-light)", bc: "var(--pink)", style: { bottom: 52, right: 10 } },
              { glyph: "♂", bg: "#FCEBEB", bc: "#E24B4A", style: { bottom: 14, left: 100 } },
              { glyph: "♃", bg: "var(--mint)", bc: "#5DCAA5", style: { top: 64, left: 10 } },
              { glyph: "♄", bg: "#F1EFE8", bc: "#888780", style: { bottom: 64, left: 6 } },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm hover:scale-110 transition-transform"
                style={{ background: p.bg, border: `1.5px solid ${p.bc}`, ...p.style }}
              >
                {p.glyph}
              </div>
            ))}
            {[
              { label: "I", style: { top: 4, left: "50%", transform: "translateX(-50%)" } },
              { label: "IV", style: { bottom: 4, left: "50%", transform: "translateX(-50%)" } },
              { label: "VII", style: { top: "50%", right: 2, transform: "translateY(-50%)" } },
              { label: "X", style: { top: "50%", left: 2, transform: "translateY(-50%)" } },
            ].map((h, i) => (
              <div
                key={i}
                className="absolute"
                style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", ...h.style }}
              >
                {h.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evolve */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-14 px-8 py-[72px] items-start"
        style={{ borderBottom: "var(--border)" }}
      >
        <div>
          <div className="tag">the platform</div>
          <h2 style={{ fontFamily: poppins, fontSize: 36, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.08 }}>
            how you evolve <span className="pk">matters.</span>
          </h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--grey)", maxWidth: 480 }}>
          MY SZN doesn&apos;t just tell you who you are. It helps you become the version of yourself your chart has been pointing toward all along &mdash; through subconscious rewiring, astrology guidance, personalised rituals, and lifestyle recommendations designed for your energy.
        </p>
      </section>

      {/* Feature cards */}
      <section style={{ borderBottom: "var(--border)" }}>
        <div className="px-8 pt-10">
          <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>
            what you can do with <span className="pk">your chart</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-7" style={{ borderTop: "var(--border)" }}>
          {[
            { icon: "♀", title: "Shop your Venus sign", body: "Personalised style, beauty, and lifestyle picks curated to how you love, what you find beautiful, and how you express your identity.", variant: "" },
            { icon: "↑", title: "Dress like your future self", body: "Your rising sign is your energetic first impression. These picks match the frequency you broadcast before you say a word.", variant: "pink" },
            { icon: "⚷", title: "Heal your Chiron wounds", body: "Your deepest wound holds your greatest gift. Guided healing courses and rituals curated to your specific Chiron placement.", variant: "" },
            { icon: "♃", title: "Manifest with your Jupiter sign", body: "Jupiter is your personal abundance code. Stop manifesting the wrong things, the wrong way. This decodes how you're wired to receive.", variant: "lav" },
            { icon: "☾", title: "Romanticise your astrology season", body: "Each season activates different parts of your chart. Rituals, playlists, style edits, and energy guidance for the current cosmic weather.", variant: "dark" },
            { icon: "☆", title: "Upgrade your confidence through your chart", body: "Your chart reveals where your power lives. Confidence tools, affirmations, and identity upgrades aligned to your unique placements.", variant: "" },
            { icon: "◊", title: "Build your dream life in alignment", body: "Your cosmic blueprint shows you the path. Future self identity building, vision work, and lifestyle design aligned to your North Node and Midheaven.", variant: "" },
            { icon: "☉", title: "Understand your full chart", body: "Go beyond your sun sign. See every placement, every house, every transit — and what they actually mean for your life right now.", variant: "pink" },
          ].map((card, i) => {
            const bgMap: Record<string, string> = { pink: "var(--pink)", lav: "var(--lav)", dark: "var(--dark)" };
            const bg = bgMap[card.variant] || "transparent";
            const titleColor = card.variant === "pink" || card.variant === "dark" ? "#fff" : "var(--dark)";
            const bodyColor = card.variant === "pink" ? "rgba(255,255,255,0.7)" : card.variant === "dark" ? "rgba(255,255,255,0.55)" : card.variant === "lav" ? "#3C2A70" : "#777";
            return (
              <div key={i} className="p-7 transition-colors" style={{ background: bg, borderRight: "var(--border)" }}>
                <div className="text-[28px] mb-3.5">{card.icon}</div>
                <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: titleColor, lineHeight: 1.2, marginBottom: 10 }}>
                  {card.title}
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: bodyColor }}>{card.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ticker lav */}
      <Ticker
        variant="lav"
        items={[
          "venus sign · rising sign · moon sign",
          "jupiter · chiron · midheaven",
          "fashion · beauty · wellness · rituals",
          "journals · travel · home · confidence",
        ]}
      />

      {/* Chart entry section */}
      <section id="chart" className="px-8 py-14" style={{ borderBottom: "var(--border)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="tag">generate your chart</div>
            <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 14 }}>
              enter your birth details.
              <br />
              unlock <span className="pk">everything.</span>
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--grey)", marginBottom: 24 }}>
              Your date, time, and place of birth is all it takes. The more precise your birth time, the more accurate your rising sign and house placements will be.
            </p>
            <Link href="/chart" className="btn-pink">
              generate my chart
            </Link>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 16 }}>
              sample chart placements
            </div>
            <div style={{ border: "var(--border)" }}>
              {[
                { glyph: "☉", planet: "Sun in Aquarius", placement: "1st house · your core identity", tag: "identity", tagClass: "pp-tag--identity" },
                { glyph: "☽", planet: "Moon in Pisces", placement: "2nd house · emotional needs", tag: "heal", tagClass: "pp-tag--heal" },
                { glyph: "♀", planet: "Venus in Scorpio", placement: "10th house · love and style", tag: "style", tagClass: "pp-tag--style" },
                { glyph: "♃", planet: "Jupiter in Gemini", placement: "5th house · abundance path", tag: "money", tagClass: "pp-tag--money" },
                { glyph: "♂", planet: "Mars in Leo", placement: "7th house · drive and action", tag: "drive", tagClass: "pp-tag--drive" },
                { glyph: "↑", planet: "Aquarius Rising", placement: "ascendant · how you magnetise", tag: "manifest", tagClass: "pp-tag--manifest" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-[#fafafa] transition-colors" style={{ borderBottom: i < 5 ? "1px solid #eee" : "none" }}>
                  <div className="text-xl min-w-7 text-center">{row.glyph}</div>
                  <div className="flex-1">
                    <div style={{ fontFamily: poppins, fontSize: 12, fontWeight: 800 }}>{row.planet}</div>
                    <div style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 2 }}>{row.placement}</div>
                  </div>
                  <div className={`pp-tag ${row.tagClass}`}>{row.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Placement breakdown */}
      <section id="heal" style={{ borderBottom: "var(--border)" }}>
        <div className="px-8 pt-10 flex items-baseline justify-between">
          <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>
            the placements that <span className="pk">actually matter</span>
          </h2>
          <a href="#" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)", textDecoration: "none", borderBottom: "1.5px solid var(--dark)", paddingBottom: 2 }}>
            full placement guide
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-7" style={{ borderTop: "var(--border)" }}>
          {[
            { icon: "☉", badge: "identity", badgeClass: "pp-tag--identity", title: "Sun Sign", sign: "your core self", body: "Your sun sign is your conscious identity, the version of you that the world sees when you're fully yourself. It's your purpose, your vitality, and your creative force.", variant: "" },
            { icon: "♀", badge: "style", badgeClass: "pp-tag--style", title: "Venus Sign", sign: "your style and love language", body: "Venus rules how you love, what you find beautiful, and how you express your identity through style, beauty, and aesthetics. This is your shopping placement.", variant: "dark" },
            { icon: "↑", badge: "manifest", badgeClass: "pp-tag--manifest", title: "Rising Sign", sign: "how you magnetise", body: "Your rising sign is your energetic first impression, the frequency you broadcast before you say a word. It's how you attract opportunities, people, and abundance.", variant: "" },
            { icon: "☽", badge: "heal", badgeClass: "pp-tag--heal", title: "Moon Sign", sign: "your emotional blueprint", body: "Your moon sign reveals your emotional needs, subconscious patterns, and what makes you feel truly nourished. The starting point for all inner healing work.", variant: "lav" },
            { icon: "♃", badge: "money", badgeClass: "pp-tag--money", title: "Jupiter Sign", sign: "your abundance code", body: "Jupiter shows you exactly how expansion and luck flow into your life. Understanding your Jupiter placement transforms how you approach money, growth, and manifestation.", variant: "" },
            { icon: "⚷", badge: "heal", badgeClass: "pp-tag--heal", title: "Chiron", sign: "your deepest wound and gift", body: "Chiron reveals the core wound you came here to heal, and the extraordinary gift that lives on the other side of that healing. This is your transformation placement.", variant: "" },
          ].map((card, i) => {
            const bgMap: Record<string, string> = { dark: "var(--dark)", lav: "var(--lav)" };
            const bg = bgMap[card.variant] || "transparent";
            const titleColor = card.variant === "dark" ? "#fff" : "var(--dark)";
            const bodyColor = card.variant === "dark" ? "rgba(255,255,255,0.55)" : card.variant === "lav" ? "#3C2A70" : "#777";
            const signColor = card.variant === "lav" ? "var(--dark)" : "var(--pink)";
            return (
              <div key={i} className="p-7" style={{ background: bg, borderRight: "var(--border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl" style={card.variant === "dark" ? { color: "var(--lav)" } : undefined}>{card.icon}</div>
                  <div className={`pp-tag ${card.badgeClass}`}>{card.badge}</div>
                </div>
                <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: titleColor, marginBottom: 6 }}>{card.title}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: signColor, marginBottom: 10 }}>{card.sign}</div>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: bodyColor }}>{card.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop section */}
      <section id="shop">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
          <div>
            <div className="tag">personalised for your placements</div>
            <h1 style={{ fontFamily: poppins, fontSize: 44, fontWeight: 800, letterSpacing: "-1.2px", color: "#fff", lineHeight: 1.0 }}>
              shop your <span className="pk">sign.</span>
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 14, maxWidth: 380, lineHeight: 1.65 }}>
              Every pick is curated to your birth chart. Fashion, beauty, wellness, rituals, and lifestyle upgrades for the version of you that&apos;s already becoming.
            </p>
          </div>
          <div className="flex gap-2.5 mt-5 md:mt-0 flex-wrap">
            {["venus", "rising", "moon", "jupiter", "chiron"].map((p, i) => (
              <div
                key={p}
                className="cursor-pointer transition-all"
                style={{
                  background: i === 0 ? "var(--pink)" : "var(--lav)",
                  color: i === 0 ? "#fff" : "#3C2A70",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 14px",
                  border: "1.5px solid transparent",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6" style={{ borderBottom: "var(--border)" }}>
          {[
            { icon: "✦", bg: "var(--lav-light)", placement: "venus sign", badge: "new", cat: "fashion", name: "Obsidian Power Blazer", price: "$186" },
            { icon: "☽", bg: "var(--pink-light)", placement: "moon sign", badge: "", cat: "rituals", name: "Pisces Moon Ceremony Kit", price: "$64" },
            { icon: "♃", bg: "var(--dark)", placement: "jupiter sign", badge: "bestseller", cat: "money mindset", name: "Abundance by Design Journal", price: "$38", iconColor: "var(--lav)" },
            { icon: "○", bg: "var(--cream)", placement: "chiron", badge: "", cat: "wellness", name: "Chiron Wound Healing Course", price: "$97" },
            { icon: "↑", bg: "#E0F5EE", placement: "rising sign", badge: "", cat: "fashion", name: "Aquarius Rising Edit — 5 Pieces", price: "$220" },
            { icon: "♀", bg: "var(--gold)", placement: "venus sign", badge: "szn pick", cat: "beauty", name: "Venus in Scorpio Scent Collection", price: "$78" },
          ].map((prod, i) => (
            <div key={i} className="cursor-pointer transition-colors" style={{ border: "var(--border)" }}>
              <div className="h-40 flex items-center justify-center text-[40px] relative" style={{ background: prod.bg, color: prod.iconColor }}>
                {prod.icon}
                <div className="absolute top-2.5 left-2.5" style={{ background: "var(--pink)", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px" }}>
                  {prod.placement}
                </div>
                {prod.badge && (
                  <div className="absolute top-2.5 right-2.5" style={{ background: "var(--lav)", color: "#3C2A70", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px" }}>
                    {prod.badge}
                  </div>
                )}
              </div>
              <div className="p-3.5" style={{ borderTop: "var(--border)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 5 }}>{prod.cat}</div>
                <div style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>{prod.name}</div>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{prod.price}</div>
                  <button style={{ background: "var(--dark)", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px", border: "none", cursor: "pointer" }}>
                    add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured strip */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
          <div className="p-12" style={{ background: "var(--lav)", borderRight: "var(--border)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 16 }}>featured drop</div>
            <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 16 }}>Dress like your future self. Start with your rising sign.</h2>
            <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7, marginBottom: 24 }}>Your rising sign is how you show up in the world before you say a word. These picks are curated to your Aquarius rising energy — electric, original, ahead of everyone else in the room.</p>
            <button className="btn-pink">shop rising sign edit</button>
          </div>
          <div className="p-12" style={{ background: "var(--pink)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>this szn&apos;s ritual</div>
            <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 16 }}>Aquarius szn manifestation stack.</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 24 }}>Aquarius season is for rewiring, visioning, and doing things your way. This ritual stack gives you everything you need to set intentions that actually stick this time.</p>
            <button style={{ background: "#fff", color: "var(--pink)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", border: "none", cursor: "pointer" }}>shop the ritual stack</button>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <Ticker items={["manifest with your jupiter sign", "new moon intentions", "lunar cycle living", "subconscious rewiring", "your era is now"]} />

      {/* Manifest section */}
      <section id="manifest">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
          <div className="px-8 py-14" style={{ borderRight: "var(--border)" }}>
            <div className="tag">manifestation by birth chart</div>
            <h1 style={{ fontFamily: poppins, fontSize: 44, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-1.2px", marginBottom: 20 }}>
              manifest in<br />alignment<br />with your <span className="pk">chart.</span>
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--grey)", marginBottom: 32, maxWidth: 360 }}>
              Your Jupiter sign tells you how abundance flows to you. Your moon sign tells you what you actually need. MY SZN combines both so you stop manifesting the wrong things, the wrong way.
            </p>
            <div className="flex gap-3">
              <button className="btn-pink">start manifesting</button>
              <button className="btn-outline">explore the tools</button>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 px-9 py-12" style={{ background: "var(--dark)" }}>
            {[
              { icon: "●", name: "New Moon in Capricorn", desc: "Jan 3 · intention setting complete", badge: "done", badgeClass: "moon-badge--done", opacity: 0.5 },
              { icon: "◑", name: "First Quarter in Aries", desc: "Jan 10 · action phase complete", badge: "done", badgeClass: "moon-badge--done", opacity: 0.5 },
              { icon: "○", name: "Full Moon in Cancer", desc: "Jan 13 · release + receive", badge: "now", badgeClass: "moon-badge--now", opacity: 1, active: true },
              { icon: "◐", name: "Last Quarter in Libra", desc: "Jan 21 · surrender phase", badge: "up next", badgeClass: "moon-badge--up", opacity: 1 },
              { icon: "●", name: "New Moon in Aquarius", desc: "Jan 29 · your szn begins", badge: "up next", badgeClass: "moon-badge--up", opacity: 1 },
            ].map((moon, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 p-4"
                style={{
                  opacity: moon.opacity,
                  border: moon.active ? "1px solid var(--pink)" : "1px solid rgba(255,255,255,0.1)",
                  background: moon.active ? "rgba(255,45,135,0.08)" : "transparent",
                }}
              >
                <div className="text-[22px] min-w-8 text-center" style={moon.active ? { color: "var(--pink)" } : { color: "#fff" }}>{moon.icon}</div>
                <div className="flex-1">
                  <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{moon.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{moon.desc}</div>
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px",
                  background: moon.badge === "now" ? "var(--pink)" : moon.badge === "up next" ? "rgba(200,180,248,0.2)" : "rgba(255,255,255,0.06)",
                  color: moon.badge === "now" ? "#fff" : moon.badge === "up next" ? "var(--lav)" : "rgba(255,255,255,0.3)",
                }}>
                  {moon.badge}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manifest toolkit */}
        <div style={{ borderBottom: "var(--border)" }}>
          <div className="px-8 pt-10 pb-7 flex items-baseline justify-between">
            <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>
              your manifest <span className="pk">toolkit</span>
            </h2>
            <a href="#" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)", textDecoration: "none", borderBottom: "1.5px solid var(--dark)", paddingBottom: 2 }}>
              view all tools
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ borderTop: "var(--border)" }}>
            {[
              { num: "01 / intentions", icon: "✦", title: "Jupiter Sign Manifestation Method", body: "Your Jupiter placement is your personal abundance code. This tool decodes it and gives you a custom manifestation method that matches how you're wired to receive.", variant: "" },
              { num: "02 / ritual", icon: "☽", title: "Lunar Cycle Manifestation Planner", body: "Stop manifesting randomly. This planner maps your intentions, actions, releases, and gratitude across the full lunar cycle so you work with the moon, not against it.", variant: "pink" },
              { num: "03 / rewire", icon: "○", title: "Subconscious Rewiring by Chart", body: "Your 12th house and Saturn placements show you exactly where your subconscious blocks live. Guided audio and EFT sequences curated to your specific chart.", variant: "" },
              { num: "04 / vision", icon: "▲", title: "Future Self Identity Builder", body: "Who is she. What does she wear, earn, feel, and embody. This guided builder creates your future self identity using your North Node and Midheaven placements.", variant: "lav" },
              { num: "05 / scripting", icon: "✧", title: "Cosmic Scripting Templates", body: "Scripting works when it's specific. These templates are pre-loaded with your chart data and the current astrology season so every word lands with precision.", variant: "" },
              { num: "06 / track", icon: "◈", title: "Manifestation Evidence Journal", body: "The fastest way to manifest more is to notice what's already arrived. This running journal tracks your wins, synchronicities, and signs by lunar cycle and season.", variant: "" },
            ].map((tool, i) => {
              const bgMap: Record<string, string> = { pink: "var(--pink)", lav: "var(--lav)" };
              const bg = bgMap[tool.variant] || "transparent";
              const numColor = tool.variant === "pink" ? "rgba(255,255,255,0.55)" : tool.variant === "lav" ? "#3C2A70" : "var(--pink)";
              const titleColor = tool.variant === "pink" ? "#fff" : "var(--dark)";
              const bodyColor = tool.variant === "pink" ? "rgba(255,255,255,0.7)" : tool.variant === "lav" ? "#3C2A70" : "#777";
              return (
                <div key={i} className="p-7" style={{ background: bg, borderRight: "var(--border)" }}>
                  <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: numColor, marginBottom: 16 }}>{tool.num}</div>
                  <div className="text-[28px] mb-3.5">{tool.icon}</div>
                  <div style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, color: titleColor, lineHeight: 1.15, marginBottom: 10 }}>{tool.title}</div>
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: bodyColor }}>{tool.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-8 py-20" style={{ background: "var(--lav)", borderBottom: "var(--border)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 18 }}>
          your full chart is waiting
        </div>
        <h2 style={{ fontFamily: poppins, fontSize: 40, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.05, marginBottom: 18 }}>
          stop guessing.<br />start living in <span className="pk">alignment.</span>
        </h2>
        <p style={{ fontSize: 14, color: "#3C2A70", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 32px" }}>
          Enter your birth details and get your full chart breakdown with personalised insights for style, healing, money, and manifestation. Built around you, updated every season.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/chart" className="btn-pink">generate my chart</Link>
          <a href="#chart" className="btn-outline">see how it works</a>
        </div>
      </section>
    </>
  );
}
