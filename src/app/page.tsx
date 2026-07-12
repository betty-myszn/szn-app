import Link from "next/link";
import LaunchCountdown from "@/components/LaunchCountdown";

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
          "launches 23 july",
          "main character energy activated",
          "doors open 3 days only",
          "embody your astrology",
          "your era starts now",
        ]}
      />

      {/* Hero */}
      <section
        className="px-8 py-20 text-center"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="tag mb-4">launches 23 july · doors open 3 days only</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              color: "#fff",
              marginBottom: 24,
            }}
          >
            It&apos;s time to stop playing small.<br />
            Your szn starts <span className="pk">now.</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "#fff",
              marginBottom: 36,
              maxWidth: 580,
              margin: "0 auto 36px",
            }}
          >
            MY SZN is where ambitious women stop overthinking, stop hiding and start becoming the main character of their own damn lives. Every month we&apos;ll work with the current astrology, powerful coaching tools and your personalised portal to help you be seen, make more money, own your gifts and finally start showing up like the woman your future self already knows you are.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/mastermind" className="btn-pink">
              join the waitlist
            </Link>
            <Link href="/chart" className="btn-outline btn-outline--white">
              generate my chart
            </Link>
          </div>
          <div style={{ marginTop: 28, marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
              countdown to launch
            </div>
            <LaunchCountdown variant="dark" />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 12, letterSpacing: "0.04em" }}>
            Doors open 21 July. Close 23 July. 3-month mastermind commitment.
          </p>
        </div>
      </section>

      {/* Launch banner */}
      <section className="px-8 py-10 text-center" style={{ background: "var(--pink)", borderBottom: "var(--border)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
          mark your calendar
        </div>
        <h2 style={{ fontFamily: poppins, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>
          MY SZN launches 23 July.
        </h2>
        <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 6px" }}>
          Doors open for enrolment on 21 July and close on 23 July. That&apos;s 3 days. Limited founding member spots. Once they&apos;re gone, they&apos;re gone.
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          First live class: 23 July at 7pm LA time.
        </p>
        <div style={{ marginBottom: 20 }}>
          <LaunchCountdown variant="pink" />
        </div>
        <Link href="/mastermind" className="no-underline" style={{
          display: "inline-block", background: "#fff", color: "var(--pink)",
          fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "14px 32px",
        }}>
          join the waitlist
        </Link>
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
            { icon: "♀", title: "Embody your Venus energy", body: "Venus rules how you love, what you desire, and how you show up looking like THAT. Stop settling for less than your Venus demands. This placement is your self-worth superpower.", variant: "" },
            { icon: "↑", title: "Step into your Rising sign", body: "Your rising sign is the energy you walk into every room with. The frequency you broadcast before you open your mouth. Learn to own it and watch the world rearrange itself around you.", variant: "pink" },
            { icon: "⚷", title: "Heal your Chiron wounds", body: "Your deepest wound is sitting on top of your greatest gift. Guided healing and rituals built for your specific Chiron placement. Turn that pain into power.", variant: "" },
            { icon: "♃", title: "Manifest with your Jupiter sign", body: "Jupiter is your personal abundance code. Stop manifesting with methods that weren't built for your energy. This decodes exactly how you're wired to receive.", variant: "lav" },
            { icon: "☾", title: "Live your astrology season", body: "Each season activates different parts of your chart. Rituals, playlists, style edits, and energy guidance for the current cosmic weather. Every season is YOUR season.", variant: "dark" },
            { icon: "☆", title: "Level up your confidence", body: "Your chart shows exactly where your power lives. Confidence tools, identity upgrades, and affirmations aligned to your unique placements. No more shrinking.", variant: "" },
            { icon: "◊", title: "Build your dream life on purpose", body: "Your cosmic blueprint has the whole plan. Future self identity work, vision building, and lifestyle design aligned to your North Node and Midheaven. You were literally born for this.", variant: "" },
            { icon: "☉", title: "Understand your full chart", body: "Go beyond your sun sign. See every placement, every house, every transit and what they actually mean for your life right now. Knowledge is power and this is yours.", variant: "pink" },
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
          "3-month mastermind commitment",
          "launches 23 july · doors open 3 days",
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
              Your date, time, and place of birth is all it takes. The more precise your birth time, the more accurate your rising sign and house placements. Every placement unlocked. Every insight personalised. This is YOUR blueprint.
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
            the placements that <span className="pk">run your life</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-7" style={{ borderTop: "var(--border)" }}>
          {[
            { icon: "☉", badge: "identity", badgeClass: "pp-tag--identity", title: "Sun Sign", sign: "your core self", body: "Your sun sign is your main character energy. The version of you that shows up when you stop performing for everyone else. Your purpose, your fire, your creative force.", variant: "" },
            { icon: "♀", badge: "embody", badgeClass: "pp-tag--style", title: "Venus Sign", sign: "your love and self-worth", body: "Venus rules how you love, what you find beautiful, and how you express your identity through style, beauty, and aesthetics. This is your self-worth placement. Stop playing small with it.", variant: "dark" },
            { icon: "↑", badge: "manifest", badgeClass: "pp-tag--manifest", title: "Rising Sign", sign: "how you magnetise", body: "Your rising sign is the energy you walk into every room with. The frequency you broadcast before you open your mouth. It's how you attract opportunities, people, and abundance without even trying.", variant: "" },
            { icon: "☽", badge: "heal", badgeClass: "pp-tag--heal", title: "Moon Sign", sign: "your emotional blueprint", body: "Your moon sign reveals your emotional needs, subconscious patterns, and what makes you feel truly nourished. The starting point for all inner healing work. Go here first.", variant: "lav" },
            { icon: "♃", badge: "money", badgeClass: "pp-tag--money", title: "Jupiter Sign", sign: "your abundance code", body: "Jupiter shows you exactly how expansion and luck flow into your life. Understanding your Jupiter placement transforms how you approach money, growth, and manifestation. This is your receipt.", variant: "" },
            { icon: "⚷", badge: "heal", badgeClass: "pp-tag--heal", title: "Chiron", sign: "your deepest wound and gift", body: "Chiron reveals the core wound you came here to heal, and the extraordinary gift sitting on the other side of that healing. Your biggest flex is hiding inside your biggest block.", variant: "" },
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

      <Ticker items={["manifest with your jupiter sign", "new moon intentions", "lunar cycle living", "subconscious rewiring", "your era starts now"]} />

      {/* Lunar cycle + how mastermind works */}
      <section id="mastermind-preview">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "var(--border)" }}>
          <div className="px-8 py-14" style={{ borderRight: "var(--border)" }}>
            <div className="tag">cancer szn · jun 21 - jul 22</div>
            <h1 style={{ fontFamily: poppins, fontSize: 44, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-1.2px", marginBottom: 20 }}>
              every season<br />is your<br /><span className="pk">season.</span>
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dark)", marginBottom: 32, maxWidth: 360 }}>
              The mastermind follows the current zodiac season every single month. Your lunar cycle, your rituals, your workshops, your growth. All synced with the cosmic weather so you&apos;re always moving in the energy that&apos;s already working for you.
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
            <p style={{ fontSize: 14, color: "var(--dark)", marginTop: 8 }}>
              This is a mastermind, not a membership. A 3-month minimum commitment to actually becoming her.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ borderTop: "var(--border)" }}>
            {[
              { num: "01 / your chart", icon: "✦", title: "Your Birth Chart Becomes Your Roadmap", body: "Everything starts with your chart. Your placements tell us how you're wired to grow, heal, earn, love, and show up. No generic advice. No one-size-fits-all nonsense. Every single recommendation is built around YOU.", variant: "" },
              { num: "02 / the season", icon: "☽", title: "Monthly Live Workshops by Season", body: "Every month I lead a live workshop based on the current zodiac season. Astrology, coaching, Human Design, and subconscious rewiring blended together so you don't just understand the energy. You become it.", variant: "pink" },
              { num: "03 / rewire", icon: "○", title: "Subconscious Rewiring Sessions", body: "Guided hypnosis, EFT tapping, and reprogramming sessions designed for the blocks your chart reveals. Your 12th house and Saturn placements show exactly where your subconscious has been running the show. Time to take it back.", variant: "" },
              { num: "04 / experts", icon: "▲", title: "Guest Experts Every Month", body: "Astrologers. Therapists. Business coaches. Manifestation teachers. Women who have built the life and have the receipts to prove it. Each guest is chosen to match the energy of the current season.", variant: "lav" },
              { num: "05 / community", icon: "✧", title: "A Community of Women Who Get It", body: "Not another group you mute after a week. A room full of women who are choosing themselves. Celebrating each other's wins. Mentioning each other's names in rooms full of opportunities. Your people are in here.", variant: "" },
              { num: "06 / the vault", icon: "◈", title: "Every Session Saved Forever", body: "Every workshop, masterclass, meditation, hypnosis, and coaching session lives in The Vault. Your personal library that grows every single month. Return to it whenever you're ready to level up again.", variant: "" },
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

      {/* Upcoming Workshops */}
      <section className="px-8 py-20 md:py-28" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">your first workshops inside the mastermind</div>
          <h2 style={{ fontFamily: poppins, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 48 }}>
            Leo szn is about to <span className="pk">hit different.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            {/* Workshop 1 */}
            <div className="p-8 md:p-12" style={{ background: "var(--dark)", borderRight: "var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lav)", marginBottom: 8 }}>
                leo szn workshop 1
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 20 }}>
                23 july · 7pm la time · first live class
              </div>
              <h3 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 16 }}>
                Leo Season: Enter Your Main Character Era
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>
                Leo season is your cosmic reminder that you didn&apos;t come here to watch everyone else live the life you want.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
                If you&apos;ve been overthinking every move, watering yourself down, waiting until you feel &ldquo;ready&rdquo;, or hiding the parts of you that were always meant to be seen... this is your invitation to leave that version of yourself behind.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
                We&apos;ll dive into the astrology of confidence, visibility and self-expression, exploring the placements that reveal where you&apos;re designed to shine, what&apos;s been keeping you playing smaller than your potential, and how to work with this Leo season to become the woman who walks into every room knowing she belongs there.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", marginBottom: 24 }}>
                Powerful prompts, astrology, tapping and embodiment exercises to help you release the fear of being seen, reconnect with your natural magnetism and start showing up like the main character of your own damn life.
              </p>
              <div className="p-4 mb-6" style={{ background: "rgba(255,45,135,0.1)", border: "1px solid rgba(255,45,135,0.25)" }}>
                <p style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.4, margin: 0 }}>
                  Because your next era isn&apos;t waiting for permission. It&apos;s waiting for <span style={{ color: "var(--pink)" }}>you.</span>
                </p>
              </div>
              <Link href="/mastermind" className="btn-pink block text-center no-underline" style={{ padding: "16px 32px" }}>
                join the waitlist
              </Link>
            </div>

            {/* Workshop 2 */}
            <div className="p-8 md:p-12" style={{ background: "var(--lav-light)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B68AE", marginBottom: 8 }}>
                leo szn workshop 2
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 20 }}>
                date tbc · inside the mastermind
              </div>
              <h3 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, color: "var(--dark)", lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 16 }}>
                Visible AF: How to Show Up &amp; Get Paid
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--dark)", marginBottom: 16 }}>
                You weren&apos;t born to be the internet&apos;s best kept secret.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--dark)", marginBottom: 16 }}>
                If you&apos;ve been sitting on ideas, rewriting captions seventeen times, waiting until you feel more confident, or watching everyone else take up space while you quietly cheer them on from the sidelines... we&apos;re changing that.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--dark)", marginBottom: 16 }}>
                We&apos;re diving into the astrology behind visibility, personal branding and becoming known for what you do. The placements that reveal how you&apos;re designed to communicate, market yourself, attract opportunities and build a brand that people actually remember. Plus the fears that keep you hiding, people-pleasing, overthinking and making yourself smaller than your vision.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--dark)", marginBottom: 24 }}>
                Create content that feels magnetic, talk about your offers without feeling awkward, own your expertise, and build the kind of visibility that creates real momentum in your business. Wrapping up with powerful tapping and embodiment work to help you release the fear of being seen, back yourself unapologetically, and start showing up like the woman who&apos;s already decided she&apos;s getting paid.
              </p>
              <Link href="/mastermind" className="btn-pink block text-center no-underline" style={{ padding: "16px 32px" }}>
                join the waitlist
              </Link>
            </div>
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
            Astrology, confidence, money, manifestation, and becoming the version of yourself your chart has been pointing toward. The weekly pep talk your future self would give you if she could. New episodes dropping regularly.
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

      {/* Pricing */}
      <section className="px-8 py-20 md:py-28" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">you&apos;re invited</div>
          <h2 style={{ fontFamily: poppins, fontSize: "clamp(30px, 5.5vw, 48px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 16 }}>
            This is the party you&apos;ve been <span className="pk">waiting for.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--dark)", textAlign: "center", maxWidth: 560, margin: "0 auto 12px" }}>
            The room where women stop playing small, start embodying their astrology, and actually change their lives. Founding member pricing is live right now. Two ways in.
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--pink)", textAlign: "center", marginBottom: 48 }}>
            Doors open 21 July. Close 23 July. 3 days only. This is a mastermind, not a membership. 3-month minimum commitment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            {/* Tier 1 */}
            <div className="p-8 md:p-12" style={{ background: "var(--lav-light)", borderRight: "var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B68AE", marginBottom: 20 }}>
                the mastermind
              </div>
              <div style={{ fontFamily: poppins, fontSize: 48, fontWeight: 800, color: "var(--dark)", letterSpacing: "-2px", lineHeight: 1 }}>
                $111
              </div>
              <div style={{ fontSize: 13, color: "var(--dark)", marginTop: 4, marginBottom: 28 }}>
                per month · 3-month minimum commitment
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Full access to the MY SZN mastermind",
                  "2 live group coaching classes every month",
                  "Monthly seasonal workshops with Betty",
                  "Guest expert sessions every month",
                  "Full community access",
                  "The Vault: every session recorded forever",
                  "Subconscious rewiring sessions",
                  "Personalised to your birth chart",
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <span style={{ color: "var(--pink)", fontSize: 14, marginTop: 2, flexShrink: 0 }}>&#10038;</span>
                    <span style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/mastermind" className="btn-pink block text-center no-underline" style={{ padding: "16px 32px" }}>
                join the waitlist
              </Link>
            </div>

            {/* Tier 2 */}
            <div className="p-8 md:p-12" style={{ background: "var(--dark)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>
                  the inner circle
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#fff", background: "var(--pink)", padding: "4px 10px",
                }}>
                  only 7 spots
                </span>
              </div>
              <div style={{ fontFamily: poppins, fontSize: 48, fontWeight: 800, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>
                $333
              </div>
              <div style={{ fontSize: 13, color: "#fff", marginTop: 4, marginBottom: 28 }}>
                per month · 3-month minimum commitment
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Everything in The Mastermind",
                  "1 hour private 1:1 coaching with Betty every month",
                  "Personalised to your astrology, goals, and vision",
                  "Deep-dive into your chart, blocks, and next moves",
                  "Direct access to Betty between sessions",
                  "Priority for guest expert Q&A",
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <span style={{ color: "var(--pink)", fontSize: 14, marginTop: 2, flexShrink: 0 }}>&#10038;</span>
                    <span style={{ fontSize: 14, color: "#fff", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 mb-8" style={{ background: "rgba(255,45,135,0.1)", border: "1px solid rgba(255,45,135,0.3)" }}>
                <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.6, margin: 0 }}>
                  7 women. 3-month commitment. That&apos;s it. If you want the version of this where I&apos;m in your corner every single month, this is it.
                </p>
              </div>

              <Link href="/mastermind" className="block text-center no-underline" style={{
                background: "var(--pink)", color: "#fff",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", padding: "16px 32px", border: "none",
              }}>
                join the waitlist
              </Link>
            </div>
          </div>

          <div className="p-6 text-center" style={{ background: "var(--pink)" }}>
            <p style={{
              fontFamily: poppins, fontSize: 16, fontWeight: 800, color: "#fff",
              lineHeight: 1.4, margin: 0,
            }}>
              This is how you stop reading about astrology and start <span style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}>living</span> it. Launches 23 July.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-8 py-20" style={{ background: "var(--pink-light)", borderBottom: "var(--border)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 18 }}>
          doors open 21 july · close 23 july
        </div>
        <h2 style={{ fontFamily: poppins, fontSize: 40, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.05, marginBottom: 18 }}>
          stop reading your horoscope.<br />start becoming <span className="pk">her.</span>
        </h2>
        <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
          Join the mastermind waitlist for founding member pricing and a seat at the table before the doors close. 3-month commitment. Limited spots. Your future self is already inside.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/mastermind" className="btn-pink">join the waitlist</Link>
          <Link href="/chart" className="btn-outline">generate my chart</Link>
        </div>
      </section>
    </>
  );
}
