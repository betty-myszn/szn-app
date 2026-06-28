"use client";

import { useState } from "react";
import Link from "next/link";

const pp = "var(--font-poppins), Poppins, sans-serif";
const dm = "var(--font-dm-sans), 'DM Sans', sans-serif";

function WaitlistForm({ dark = false, id = "" }: { dark?: boolean; id?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "waitlist" }),
      });
    } catch {}
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>&#10024;</div>
        <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, marginBottom: 8, color: dark ? "#fff" : "var(--dark)" }}>
          You&apos;re on the list.
        </div>
        <p style={{ fontSize: 14, color: dark ? "rgba(255,255,255,0.6)" : "var(--grey)", lineHeight: 1.6 }}>
          We&apos;ll be in touch soon with early access details. Your season is coming.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg" id={id}>
      <input
        type="text"
        placeholder="your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          flex: 0.7, padding: "16px 20px", fontSize: 14, fontFamily: dm,
          border: dark ? "1.5px solid var(--pink)" : "var(--border)",
          background: dark ? "rgba(255,255,255,0.05)" : "#fff",
          color: dark ? "#fff" : "var(--dark)", outline: "none",
        }}
      />
      <input
        type="email"
        required
        placeholder="your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: 1, padding: "16px 20px", fontSize: 14, fontFamily: dm,
          border: dark ? "1.5px solid var(--pink)" : "var(--border)",
          background: dark ? "rgba(255,255,255,0.05)" : "#fff",
          color: dark ? "#fff" : "var(--dark)", outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          background: "var(--pink)", color: "#fff", fontFamily: dm,
          fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "16px 32px", border: "none",
          cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        {submitting ? "joining..." : "join the waitlist"}
      </button>
    </form>
  );
}

export default function WaitlistPage() {
  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="px-8 py-20 md:py-28 text-center"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-4">coming soon</div>

          <h1 style={{
            fontFamily: pp, fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24,
          }}>
            Every season is<br />your <span style={{ color: "var(--pink)" }}>season.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.8, color: "#fff",
            maxWidth: 520, margin: "0 auto 12px",
          }}>
            Astrology tells you who you are.<br />
            <span style={{ fontWeight: 500 }}>MY SZN helps you become her.</span>
          </p>

          <p style={{
            fontSize: 14, lineHeight: 1.8, color: "#fff",
            maxWidth: 540, margin: "0 auto 36px",
          }}>
            A personalised personal growth platform combining astrology, Human Design, subconscious rewiring, coaching and community to help you create more confidence, love, money, purpose and self-trust.
          </p>

          <div className="flex flex-col items-center gap-4">
            <WaitlistForm dark id="hero-form" />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>
              Limited founding member spaces available.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY MY SZN ═══════════════ */}
      <section className="px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">the story</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Why <span className="pk">MY SZN?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            {/* Left: The Gemini story */}
            <div className="p-8 md:p-12" style={{ borderRight: "var(--border)" }}>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--dark)", marginBottom: 24 }}>
                Every year Gemini szn rolls around and something wild happens. Gemini women become completely, unapologetically unstoppable.
              </p>

              <div className="space-y-2 mb-8">
                {[
                  "They're booking the flights.",
                  "Launching the business.",
                  "Wearing the outfit.",
                  "Taking up space.",
                ].map((line) => (
                  <p key={line} style={{ fontSize: 15, color: "var(--dark)", paddingLeft: 16, borderLeft: "2px solid var(--lav)" }}>
                    {line}
                  </p>
                ))}
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--dark)", paddingLeft: 16, borderLeft: "2px solid var(--pink)" }}>
                  Living like the main character.
                </p>
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)" }}>
                I watched this happen year after year. And it made me realise something I couldn&apos;t unsee.
              </p>
            </div>

            {/* Right: The realisation */}
            <div className="p-8 md:p-12" style={{ background: "var(--pink-light)" }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginBottom: 20 }}>
                We only give ourselves permission to feel that powerful once a year.
              </p>

              <div className="space-y-1 mb-8">
                {[
                  "We wait until Monday.",
                  "Until January.",
                  "Until our birthday.",
                  "Until we finally lose the weight.",
                  "Until we feel ready. Which never comes.",
                ].map((line) => (
                  <p key={line} style={{ fontSize: 14, color: "var(--dark)" }}>
                    {line}
                  </p>
                ))}
              </div>

              <p style={{
                fontFamily: pp, fontSize: 18, fontWeight: 800, color: "var(--dark)",
                lineHeight: 1.4,
              }}>
                Every season can be your season. That&apos;s the entire philosophy behind MY SZN.
              </p>
              <p style={{ fontSize: 14, color: "var(--dark)", marginTop: 12 }}>
                Not another astrology app. A place that helps you actually <em>live</em> your astrology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <div className="px-8 py-16 md:py-20 text-center" style={{ background: "var(--lav-light)", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <h2 style={{
          fontFamily: pp, fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800,
          lineHeight: 1.2, letterSpacing: "-1px", color: "#3C2A70",
          maxWidth: 600, margin: "0 auto",
        }}>
          &ldquo;This is my time. My era. My <span style={{ color: "var(--pink)" }}>season.</span>&rdquo;
        </h2>
      </div>

      {/* ═══════════════ BETTY'S STORY ═══════════════ */}
      <section className="px-8 py-20 md:py-28">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          {/* Photo */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }}>
            <img
              src="/betty-founder.png"
              alt="Betty Andrews, founder of MY SZN"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
            <div style={{
              position: "absolute", bottom: 20, left: 20,
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}>
              Betty Andrews / Founder
            </div>
          </div>

          {/* Story */}
          <div className="p-8 md:p-12">
            <div className="tag mb-6">my story</div>
            <h2 style={{
              fontFamily: pp, fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800,
              letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 24,
            }}>
              The biggest project I&apos;ve ever worked on wasn&apos;t my business. It was <span className="pk">me.</span>
            </h2>

            <div style={{ fontSize: 14, lineHeight: 1.9, color: "var(--dark)" }}>
              <p style={{ marginBottom: 16 }}>
                I spent years rebuilding my self-worth from the ground up. Learning to love myself.
                Building confidence. Creating a business. Healing things I didn&apos;t even know were broken.
              </p>

              <div className="p-5 mb-5" style={{ background: "var(--pink-light)", borderLeft: "3px solid var(--pink)" }}>
                <p style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: "var(--dark)", lineHeight: 1.4, margin: 0 }}>
                  You can&apos;t hate yourself into a version of yourself that you love.
                </p>
              </div>

              <p style={{ marginBottom: 16 }}>
                The world profits from women believing they&apos;re never enough. Not pretty enough.
                Not thin enough. Not successful enough. Not healed enough.
              </p>
              <p style={{ marginBottom: 16 }}>
                MY SZN was born from wanting to create the platform I wished existed while rebuilding my own life. Becoming isn&apos;t about fixing yourself. It&apos;s about <strong>remembering</strong> yourself.
              </p>
              <p style={{ fontStyle: "italic", color: "var(--dark)", fontWeight: 500 }}>
                This is the platform I wish I&apos;d had. So I built it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ASTROLOGY STOPS AT AWARENESS ═══════════════ */}
      <section className="px-8 py-20 md:py-28" style={{ background: "#fafafa", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">the gap</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Astrology stops at <span className="pk">awareness.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { placement: "Your Venus", truth: "Doesn't suddenly make you confident in love.", bg: "var(--pink-light)" },
              { placement: "Your Jupiter", truth: "Doesn't magically change your bank account.", bg: "var(--lav-light)" },
              { placement: "Your Chiron", truth: "Doesn't heal your childhood.", bg: "var(--mint)" },
              { placement: "Your North Node", truth: "Doesn't hand you your purpose on a plate.", bg: "var(--cream)" },
            ].map((item) => (
              <div key={item.placement} className="p-6" style={{ background: item.bg, border: "var(--border)" }}>
                <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.3px" }}>
                  Knowing {item.placement}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>
                  {item.truth}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p style={{ fontSize: 16, color: "var(--dark)", marginBottom: 8 }}>
              Everyone knows their Sun sign. Millions of women can tell you their Big 3 faster than their blood type. They screenshot their Co-Star every morning. But then what.
            </p>
            <p style={{
              fontFamily: pp, fontSize: 22, fontWeight: 800, color: "var(--dark)",
              lineHeight: 1.3, marginTop: 24,
            }}>
              Awareness is beautiful.<br />
              <span className="pk">Embodiment</span> changes your life.
            </p>
            <p style={{ fontSize: 14, color: "var(--dark)", marginTop: 12 }}>
              MY SZN bridges that gap.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ A PLATFORM THAT GROWS WITH YOU ═══════════════ */}
      <section className="px-8 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">the platform</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5.5vw, 48px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            A platform that grows with <span className="pk">you.</span>
          </h2>

          {/* The problem with PD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-12" style={{ border: "var(--border)" }}>
            <div className="p-8 md:p-10" style={{ borderRight: "var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)", marginBottom: 16 }}>
                the problem with personal development
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginBottom: 16 }}>
                One person tells you to wake up at 5am. Another says sleep in. One coach tells you to hustle. Another says surrender. One says launch now. Another says wait.
              </p>
              <p style={{ fontSize: 14, color: "var(--dark)" }}>
                They&apos;re probably all right. For somebody. But that somebody might not be you. And definitely not right now.
              </p>
            </div>
            <div className="p-8 md:p-10" style={{ background: "var(--pink-light)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 16 }}>
                the my szn approach
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginBottom: 16 }}>
                Your growth shouldn&apos;t look like mine, your best friend&apos;s, or the woman you&apos;re following on Instagram. It should look like <strong>yours</strong>.
              </p>
              <p style={{ fontSize: 14, color: "var(--dark)" }}>
                That&apos;s exactly why I&apos;ve spent years building MY SZN.
              </p>
            </div>
          </div>

          {/* Core USP banner */}
          <div className="p-8 md:p-12 text-center mb-12" style={{ background: "var(--dark)" }}>
            <p style={{
              fontFamily: pp, fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#fff",
              lineHeight: 1.3, margin: 0,
            }}>
              MY SZN doesn&apos;t just tell you who you are.<br />
              It evolves with who you&apos;re <span style={{ color: "var(--pink)" }}>becoming.</span>
            </p>
          </div>

          {/* How it works */}
          <div className="max-w-2xl mx-auto mb-12">
            <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--dark)", marginBottom: 20 }}>
              When you join MY SZN, your entire experience is built around your birth chart, your Human Design, and the season you&apos;re moving through right now. As the seasons change, your platform changes too. New lessons. New guidance. New invitations. All aligned with the cosmic weather and the version of yourself that&apos;s ready to emerge.
            </p>
          </div>

          {/* Seasonal examples */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              { szn: "Taurus szn", examples: ["Heal your relationship with money", "Stop undercharging and start receiving what you deserve", "Learn to receive instead of overworking yourself into the ground", "Finally believe you are worthy of the abundance that keeps trying to reach you"], bg: "var(--mint)" },
              { szn: "Leo szn", examples: ["Step into full visibility and stop hiding", "Show up unapologetically in every room you walk into", "Own the stage, the spotlight, the entire room", "Stop dimming your light for people who can't handle the glow"], bg: "var(--gold)" },
              { szn: "Scorpio szn", examples: ["Go deep on shadow work and financial intimacy", "Face the things you've been avoiding since forever", "Transform every ounce of pain into unstoppable power", "Go deep or go home, there is no in-between"], bg: "var(--lav-light)" },
              { szn: "Capricorn szn", examples: ["Build the business plan that actually matches your ambition", "Set goals that scare you and then crush every single one", "Get ruthlessly strategic about your next level", "Become the CEO of your own life, no permission needed"], bg: "var(--cream)" },
            ].map((card) => (
              <div key={card.szn} className="p-6 md:p-8" style={{ background: card.bg, border: "var(--border)" }}>
                <div style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 12, color: "var(--dark)" }}>
                  {card.szn}
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {card.examples.map((ex) => (
                    <li key={ex} style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", marginBottom: 4 }}>{ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", marginBottom: 20 }}>
              Someone else opens the platform the same day and receives something completely different. Because she&apos;s here to learn different lessons. Her chart has a different story. Her season is asking her to grow in a different direction.
            </p>
          </div>

          {/* Closing statement */}
          <div className="p-6 md:p-8 text-center" style={{ background: "var(--pink-light)", border: "var(--border)" }}>
            <p style={{
              fontFamily: pp, fontSize: 18, fontWeight: 800, color: "var(--dark)",
              lineHeight: 1.4, margin: 0,
            }}>
              This isn&apos;t content. It&apos;s a living, breathing, evolving experience built entirely around <span className="pk">you.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ THE SEASONAL MASTERMIND ═══════════════ */}
      <section className="px-8 py-20 md:py-28" style={{ background: "var(--dark)", borderTop: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--lav)", marginBottom: 24, opacity: 0.7, textAlign: "center",
          }}>
            inside the platform
          </div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.15, color: "#fff", marginBottom: 16,
            textAlign: "center",
          }}>
            The Seasonal <span style={{ color: "var(--pink)" }}>Mastermind.</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#fff", textAlign: "center", maxWidth: 520, margin: "0 auto 40px" }}>
            Every month follows the rhythm of the zodiac. Because every zodiac season has something to teach us.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-12">
            {[
              { slug: "aries", szn: "Aries szn", lesson: "Courage", desc: "Take the leap. Back yourself. Stop waiting for permission." },
              { slug: "taurus", szn: "Taurus szn", lesson: "Receiving", desc: "Wealth, pleasure, self-worth. Learn to let good things in." },
              { slug: "gemini", szn: "Gemini szn", lesson: "Expression", desc: "Use your voice. Say the thing. Become magnetic." },
              { slug: "cancer", szn: "Cancer szn", lesson: "Nurturing", desc: "Heal the inner child. Protect your energy. Come home to yourself." },
              { slug: "leo", szn: "Leo szn", lesson: "Visibility", desc: "Main character energy. Own the room. Stop playing small." },
              { slug: "virgo", szn: "Virgo szn", lesson: "Standards", desc: "Raise the bar. Get your life together. No more settling." },
              { slug: "libra", szn: "Libra szn", lesson: "Balance", desc: "Boundaries, beauty, partnerships. Choose yourself first." },
              { slug: "scorpio", szn: "Scorpio szn", lesson: "Transformation", desc: "Shadow work. Deep healing. Burn it down and rise." },
              { slug: "sagittarius", szn: "Sag szn", lesson: "Expansion", desc: "Dream bigger. Book the flight. Expand beyond the comfort zone." },
              { slug: "capricorn", szn: "Cap szn", lesson: "Ambition", desc: "Build the empire. Set the goals. Execute like a boss." },
              { slug: "aquarius", szn: "Aquarius szn", lesson: "Revolution", desc: "Break the rules. Do it differently. Be unapologetically you." },
              { slug: "pisces", szn: "Pisces szn", lesson: "Surrender", desc: "Trust the process. Tap into intuition. Let the universe lead." },
            ].map((s, i) => (
              <Link key={s.szn} href={`/seasons/${s.slug}`} className="no-underline p-4 block" style={{ background: i % 2 === 0 ? "rgba(255,45,135,0.08)" : "rgba(200,180,248,0.08)", border: "1px solid rgba(255,255,255,0.06)", transition: "opacity 0.15s" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: i % 2 === 0 ? "var(--pink)" : "var(--lav)", marginBottom: 4 }}>
                  {s.szn}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                  {s.lesson}
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: "#fff" }}>
                  {s.desc}
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 md:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>
                Transformational Workshops
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#fff", margin: 0 }}>
                Every month I lead a live workshop based on the current season, blending astrology, coaching, Human Design and subconscious rewiring so members don&apos;t just understand the energy. They embody it.
              </p>
            </div>
            <div className="p-6 md:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>
                Not Astrology Lectures
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#fff", margin: 0 }}>
                In Scorpio szn we go deep on shadow work and financial intimacy. In Leo szn we work on visibility and showing up unapologetically. In Capricorn szn we build the business plan, set the goals, and get ruthlessly strategic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ GUEST EXPERTS + VAULT + COMMUNITY ═══════════════ */}
      <section className="px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">inside the platform</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Everything you need to become <span className="pk">her.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            {/* Guest Experts */}
            <div className="p-8 md:p-10" style={{ background: "var(--lav-light)", borderRight: "var(--border)", borderBottom: "var(--border)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>
                Guest Experts
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>
                Astrologers. Psychologists. Business founders. Therapists. Manifestation teachers. Entrepreneurs. Women who&apos;ve built the life and have the wisdom to prove it. Guests chosen to complement the energy of each season.
              </p>
            </div>

            {/* The Vault */}
            <div className="p-8 md:p-10" style={{ background: "var(--cream)", borderRight: "var(--border)", borderBottom: "var(--border)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>
                The Vault
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", marginBottom: 12 }}>
                Every workshop. Every masterclass. Every meditation. Every hypnosis. Every coaching session. Every replay. All inside your own beautiful library that grows every month.
              </p>
              <p style={{ fontSize: 12, color: "var(--dark)", margin: 0, fontStyle: "italic" }}>
                Not content you binge and forget. A resource you return to whenever life asks you to become someone new.
              </p>
            </div>

            {/* Community */}
            <div className="p-8 md:p-10" style={{ background: "var(--pink-light)", borderBottom: "var(--border)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>
                Community
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", marginBottom: 12 }}>
                Not another Facebook group you mute after a week. A room full of women choosing themselves. Celebrating each other&apos;s wins. Mentioning each other&apos;s names in rooms full of opportunities.
              </p>
              <p style={{ fontSize: 12, color: "var(--dark)", margin: 0, fontStyle: "italic" }}>
                Your people are in here.
              </p>
            </div>
          </div>

          <div className="p-6 text-center" style={{ background: "var(--dark)" }}>
            <p style={{
              fontFamily: pp, fontSize: 16, fontWeight: 800, color: "#fff",
              lineHeight: 1.4, margin: 0,
            }}>
              Life changes when the women around you <span style={{ color: "var(--pink)" }}>change too.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF ═══════════════ */}
      <section className="px-8 py-16" style={{ background: "var(--lav-light)", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-8 text-center">what clients are saying</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8" style={{ background: "#fff", border: "var(--border)" }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", fontStyle: "italic", marginBottom: 16 }}>
                &ldquo;I just signed a $10k client after our business astro coaching session. The shift came from finally understanding my visibility blocks and the way I was undervaluing myself. Literally one of the best investments I&apos;ve made in myself.&rdquo;
              </p>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
                Cosmic Coaching Client
              </div>
            </div>
            <div className="p-8" style={{ background: "#fff", border: "var(--border)" }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", fontStyle: "italic", marginBottom: 16 }}>
                &ldquo;After our session I changed my messaging, raised my standards, showed up completely differently and suddenly people started responding differently too. I finally understand how to work WITH my energy instead of against it.&rdquo;
              </p>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
                Cosmic Coaching Client
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ WAITLIST CTA (FINAL) ═══════════════ */}
      <section className="px-8 py-20 md:py-28 text-center" style={{ background: "var(--pink-light)" }}>
        <div className="max-w-xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--pink)", marginBottom: 24,
          }}>
            founding members
          </div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800,
            letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16,
          }}>
            Become one of the first women inside <span className="pk">MY SZN.</span>
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: "var(--dark)", maxWidth: 440,
            margin: "0 auto 28px",
          }}>
            We&apos;re opening the doors to a limited number of founding members before the public launch.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["Founding member pricing", "First access to beta", "Help shape the platform", "Limited spaces"].map((b) => (
              <span key={b} style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
                color: "var(--dark)", padding: "8px 16px",
                background: "#fff", border: "var(--border)",
              }}>
                {b}
              </span>
            ))}
          </div>

          <div className="flex justify-center">
            <WaitlistForm id="cta-form" />
          </div>
        </div>
      </section>
    </div>
  );
}
