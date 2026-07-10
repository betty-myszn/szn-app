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
      <Ticker
        items={[
          "every season is your season",
          "become your future self",
          "heal your patterns",
          "live your astrology",
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
            how you evolve
            <br />
            <span className="pk">matters.</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "#fff",
              marginBottom: 32,
              maxWidth: 460,
            }}
          >
            MY SZN doesn&apos;t just tell you who you are. It helps you become the version of yourself your chart has been pointing toward all along. Through subconscious rewiring, astrology guidance, personalised rituals, and lifestyle recommendations designed for your energy.
          </p>
          <div className="flex gap-3">
            <Link href="/mastermind" className="btn-pink">
              join the waitlist
            </Link>
            <Link href="/chart" className="btn-outline btn-outline--white">
              generate my chart
            </Link>
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

      {/* Feature cards */}
      <section style={{ borderBottom: "var(--border)" }}>
        <div className="px-8 pt-10">
          <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>
            what you can do with <span className="pk">your chart</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-7" style={{ borderTop: "var(--border)" }}>
          {[
            { icon: "♀", title: "Embody your Venus energy", body: "Venus rules how you love, what you find beautiful, and how you express yourself. Stop settling for less than your Venus energy demands. This is your self-worth placement.", variant: "" },
            { icon: "↑", title: "Step into your Rising sign", body: "Your rising sign is your energetic first impression. The frequency you broadcast before you say a word. Learn to embody it fully and watch how differently the world responds.", variant: "pink" },
            { icon: "⚷", title: "Heal your Chiron wounds", body: "Your deepest wound holds your greatest gift. Guided healing courses and rituals curated to your specific Chiron placement.", variant: "" },
            { icon: "♃", title: "Manifest with your Jupiter sign", body: "Jupiter is your personal abundance code. Stop manifesting the wrong things, the wrong way. This decodes how you're wired to receive.", variant: "lav" },
            { icon: "☾", title: "Romanticise your astrology season", body: "Each season activates different parts of your chart. Rituals, playlists, style edits, and energy guidance for the current cosmic weather.", variant: "dark" },
            { icon: "☆", title: "Upgrade your confidence through your chart", body: "Your chart reveals where your power lives. Confidence tools, affirmations, and identity upgrades aligned to your unique placements.", variant: "" },
            { icon: "◊", title: "Build your dream life in alignment", body: "Your cosmic blueprint shows you the path. Future self identity building, vision work, and lifestyle design aligned to your North Node and Midheaven.", variant: "" },
            { icon: "☉", title: "Understand your full chart", body: "Go beyond your sun sign. See every placement, every house, every transit and what they actually mean for your life right now.", variant: "pink" },
          ].map((card, i) => {
            const bgMap: Record<string, string> = { pink: "var(--pink)", lav: "var(--lav)", dark: "var(--dark)" };
            const bg = bgMap[card.variant] || "transparent";
            const titleColor = card.variant === "pink" || card.variant === "dark" ? "#fff" : "var(--dark)";
            const bodyColor = card.variant === "pink" ? "rgba(255,255,255,0.7)" : card.variant === "dark" ? "rgba(255,255,255,0.55)" : card.variant === "lav" ? "#3C2A70" : "var(--dark)";
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

      <Ticker
        variant="lav"
        items={[
          "venus sign · rising sign · moon sign",
          "jupiter · chiron · midheaven",
          "confidence · healing · rituals",
          "journals · travel · home · manifestation",
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
            <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--dark)", marginBottom: 24 }}>
              Your date, time, and place of birth is all it takes. The more precise your birth time, the more accurate your rising sign and house placements will be.
            </p>
            <Link href="/chart" className="btn-pink">
              generate my chart
            </Link>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)", marginBottom: 16 }}>
              sample chart placements
            </div>
            <div style={{ border: "var(--border)" }}>
              {[
                { glyph: "☉", planet: "Sun in Aquarius", placement: "1st house · your core identity", tag: "identity", tagClass: "pp-tag--identity" },
                { glyph: "☽", planet: "Moon in Pisces", placement: "2nd house · emotional needs", tag: "heal", tagClass: "pp-tag--heal" },
                { glyph: "♀", planet: "Venus in Scorpio", placement: "10th house · love and self-worth", tag: "embody", tagClass: "pp-tag--style" },
                { glyph: "♃", planet: "Jupiter in Gemini", placement: "5th house · abundance path", tag: "money", tagClass: "pp-tag--money" },
                { glyph: "♂", planet: "Mars in Leo", placement: "7th house · drive and action", tag: "drive", tagClass: "pp-tag--drive" },
                { glyph: "↑", planet: "Aquarius Rising", placement: "ascendant · how you magnetise", tag: "manifest", tagClass: "pp-tag--manifest" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-[#fafafa] transition-colors" style={{ borderBottom: i < 5 ? "1px solid #eee" : "none" }}>
                  <div className="text-xl min-w-7 text-center">{row.glyph}</div>
                  <div className="flex-1">
                    <div style={{ fontFamily: poppins, fontSize: 12, fontWeight: 800 }}>{row.planet}</div>
                    <div style={{ fontSize: 11, color: "var(--dark)", marginTop: 2 }}>{row.placement}</div>
                  </div>
                  <div className={`pp-tag ${row.tagClass}`}>{row.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Placement breakdown */}
      <section style={{ borderBottom: "var(--border)" }}>
        <div className="px-8 pt-10 flex items-baseline justify-between">
          <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>
            the placements that <span className="pk">actually matter</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-7" style={{ borderTop: "var(--border)" }}>
          {[
            { icon: "☉", badge: "identity", badgeClass: "pp-tag--identity", title: "Sun Sign", sign: "your core self", body: "Your sun sign is your conscious identity, the version of you that the world sees when you're fully yourself. It's your purpose, your vitality, and your creative force.", variant: "" },
            { icon: "♀", badge: "embody", badgeClass: "pp-tag--style", title: "Venus Sign", sign: "your love and self-worth", body: "Venus rules how you love, what you find beautiful, and how you express your identity through style, beauty, and aesthetics. This is your self-worth placement.", variant: "dark" },
            { icon: "↑", badge: "manifest", badgeClass: "pp-tag--manifest", title: "Rising Sign", sign: "how you magnetise", body: "Your rising sign is your energetic first impression, the frequency you broadcast before you say a word. It's how you attract opportunities, people, and abundance.", variant: "" },
            { icon: "☽", badge: "heal", badgeClass: "pp-tag--heal", title: "Moon Sign", sign: "your emotional blueprint", body: "Your moon sign reveals your emotional needs, subconscious patterns, and what makes you feel truly nourished. The starting point for all inner healing work.", variant: "lav" },
            { icon: "♃", badge: "money", badgeClass: "pp-tag--money", title: "Jupiter Sign", sign: "your abundance code", body: "Jupiter shows you exactly how expansion and luck flow into your life. Understanding your Jupiter placement transforms how you approach money, growth, and manifestation.", variant: "" },
            { icon: "⚷", badge: "heal", badgeClass: "pp-tag--heal", title: "Chiron", sign: "your deepest wound and gift", body: "Chiron reveals the core wound you came here to heal, and the extraordinary gift that lives on the other side of that healing. This is your transformation placement.", variant: "" },
          ].map((card, i) => {
            const bgMap: Record<string, string> = { dark: "var(--dark)", lav: "var(--lav)" };
            const bg = bgMap[card.variant] || "transparent";
            const titleColor = card.variant === "dark" ? "#fff" : "var(--dark)";
            const bodyColor = card.variant === "dark" ? "rgba(255,255,255,0.55)" : card.variant === "lav" ? "#3C2A70" : "var(--dark)";
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

      <Ticker items={["manifest with your jupiter sign", "new moon intentions", "lunar cycle living", "subconscious rewiring", "your era is now"]} />

      {/* Lunar cycle + how mastermind works */}
      <section id="mastermind-preview">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
          <div className="px-8 py-14" style={{ borderRight: "var(--border)" }}>
            <div className="tag">cancer szn · jun 21 - jul 22</div>
            <h1 style={{ fontFamily: poppins, fontSize: 44, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-1.2px", marginBottom: 20 }}>
              live by the<br />rhythm of<br />the <span className="pk">seasons.</span>
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dark)", marginBottom: 32, maxWidth: 360 }}>
              Every month the mastermind follows the current zodiac season. Your lunar cycle, your rituals, your workshops, your growth. All moving in alignment with the cosmic weather happening right now.
            </p>
            <div className="flex gap-3">
              <Link href="/mastermind" className="btn-pink">join the mastermind</Link>
              <Link href="/seasons/cancer" className="btn-outline">explore cancer szn</Link>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 px-9 py-12" style={{ background: "var(--dark)" }}>
            {[
              { icon: "○", name: "Full Moon in Capricorn", desc: "Jun 25 · release + receive", badge: "done", opacity: 0.5 },
              { icon: "◐", name: "Last Quarter in Aries", desc: "Jul 2 · surrender phase", badge: "now", opacity: 1, active: true },
              { icon: "●", name: "New Moon in Cancer", desc: "Jul 10 · intention setting", badge: "up next", opacity: 1 },
              { icon: "◑", name: "First Quarter in Libra", desc: "Jul 18 · action phase", badge: "up next", opacity: 1 },
              { icon: "○", name: "Full Moon in Aquarius", desc: "Jul 25 · release + receive", badge: "up next", opacity: 1 },
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

        {/* How the mastermind works */}
        <div style={{ borderBottom: "var(--border)" }}>
          <div className="px-8 pt-10 pb-7">
            <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>
              how the mastermind <span className="pk">works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ borderTop: "var(--border)" }}>
            {[
              { num: "01 / your chart", icon: "✦", title: "Your Birth Chart Becomes Your Roadmap", body: "Everything starts with your chart. Your placements tell us how you're wired to grow, heal, earn, love, and show up. No generic advice. Every recommendation is built around you.", variant: "" },
              { num: "02 / the season", icon: "☽", title: "Monthly Live Workshops by Season", body: "Every month I lead a live workshop based on the current zodiac season. Astrology, coaching, Human Design, and subconscious rewiring blended together so you don't just understand the energy. You embody it.", variant: "pink" },
              { num: "03 / rewire", icon: "○", title: "Subconscious Rewiring Sessions", body: "Guided hypnosis, EFT tapping, and reprogramming sessions designed for the blocks your chart reveals. Your 12th house and Saturn placements show exactly where your subconscious is holding you back.", variant: "" },
              { num: "04 / experts", icon: "▲", title: "Guest Experts Every Month", body: "Astrologers. Therapists. Business coaches. Manifestation teachers. Women who have built the life and have the results to prove it. Each guest is chosen to complement the energy of the current season.", variant: "lav" },
              { num: "05 / community", icon: "✧", title: "A Community That Actually Gets It", body: "Not another Facebook group you mute after a week. A room full of women choosing themselves. Celebrating each other's wins. Mentioning each other's names in rooms full of opportunities.", variant: "" },
              { num: "06 / the vault", icon: "◈", title: "Every Session Saved Forever", body: "Every workshop, masterclass, meditation, hypnosis, and coaching session lives in The Vault. Your personal library that grows every single month. Return to it whenever life asks you to level up.", variant: "" },
            ].map((tool, i) => {
              const bgMap: Record<string, string> = { pink: "var(--pink)", lav: "var(--lav)" };
              const bg = bgMap[tool.variant] || "transparent";
              const numColor = tool.variant === "pink" ? "rgba(255,255,255,0.55)" : tool.variant === "lav" ? "#3C2A70" : "var(--pink)";
              const titleColor = tool.variant === "pink" ? "#fff" : "var(--dark)";
              const bodyColor = tool.variant === "pink" ? "rgba(255,255,255,0.7)" : tool.variant === "lav" ? "#3C2A70" : "var(--dark)";
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

      {/* Podcast callout */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
        <div className="flex items-center justify-center p-8 md:p-12" style={{ background: "var(--lav-light)" }}>
          <img
            src="/myszn-podcast.png"
            alt="MY SZN Podcast"
            style={{ width: "100%", maxWidth: 320, height: "auto" }}
          />
        </div>
        <div className="px-8 py-14 md:px-12 flex flex-col justify-center" style={{ borderLeft: "var(--border)" }}>
          <div className="tag mb-4">the podcast</div>
          <h2 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 14 }}>
            MY SZN <span className="pk">Podcast.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", marginBottom: 28, maxWidth: 400 }}>
            Astrology, personal growth, confidence, money, manifestation, and becoming the version of yourself your chart has been pointing toward. New episodes dropping regularly.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://open.spotify.com/show/7Hi3IXajGlE1LuZD5sf08a?si=445720c35a884330"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#1DB954", color: "#fff", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "12px 20px", border: "none",
              }}
            >
              &#9679; listen on spotify
            </a>
            <a
              href="https://podcasts.apple.com/gb/podcast/my-szn/id1870482009"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #9B59B6, #8E44AD)", color: "#fff",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", padding: "12px 20px", border: "none",
              }}
            >
              &#9679; apple podcasts
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-8 py-20" style={{ background: "var(--pink-light)", borderBottom: "var(--border)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 18 }}>
          founding members
        </div>
        <h2 style={{ fontFamily: poppins, fontSize: 40, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.05, marginBottom: 18 }}>
          stop guessing.<br />start living in <span className="pk">alignment.</span>
        </h2>
        <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 32px" }}>
          Join the mastermind waitlist for founding member pricing, early access, and a seat at the table before the doors open to everyone else.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/mastermind" className="btn-pink">join the waitlist</Link>
          <Link href="/chart" className="btn-outline">generate my chart</Link>
        </div>
      </section>
    </>
  );
}
