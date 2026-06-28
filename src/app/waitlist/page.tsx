"use client";

import { useState } from "react";

const pp = "var(--font-poppins), Poppins, sans-serif";
const dm = "var(--font-dm-sans), 'DM Sans', sans-serif";

function WaitlistForm({ dark = false, id = "" }: { dark?: boolean; id?: string }) {
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email, source: "waitlist" }),
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
        type="email"
        required
        placeholder="your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: 1,
          padding: "16px 20px",
          fontSize: 14,
          fontFamily: dm,
          border: dark ? "1.5px solid rgba(255,255,255,0.2)" : "var(--border)",
          background: dark ? "rgba(255,255,255,0.05)" : "#fff",
          color: dark ? "#fff" : "var(--dark)",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          background: "var(--pink)",
          color: "#fff",
          fontFamily: dm,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "16px 32px",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "opacity 0.15s",
        }}
      >
        {submitting ? "joining..." : "join the waitlist"}
      </button>
    </form>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, background: "#eee", margin: "0" }} />;
}

export default function WaitlistPage() {
  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0d0b1a 0%, #1a1333 40%, #2a1f4e 70%, #1a1333 100%)",
          overflow: "hidden",
        }}
      >
        {/* Subtle stars */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 50% 60%, rgba(255,255,255,0.15), transparent), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 70% 70%, rgba(255,255,255,0.25), transparent), radial-gradient(1px 1px at 40% 10%, rgba(255,255,255,0.15), transparent), radial-gradient(1px 1px at 90% 50%, rgba(255,255,255,0.2), transparent), radial-gradient(1.5px 1.5px at 30% 45%, rgba(200,180,248,0.3), transparent), radial-gradient(1.5px 1.5px at 60% 85%, rgba(255,45,135,0.2), transparent)",
        }} />

        {/* Soft glow */}
        <div className="absolute" style={{
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,180,248,0.08) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--lav)", marginBottom: 32, opacity: 0.8,
          }}>
            coming soon
          </div>

          <h1 style={{
            fontFamily: pp, fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 28,
          }}>
            Every season is<br />your <span style={{ color: "var(--pink)" }}>season.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.55)",
            maxWidth: 520, margin: "0 auto 16px",
          }}>
            Astrology tells you who you are.<br />
            <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>MY SZN helps you become her.</span>
          </p>

          <p style={{
            fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.4)",
            maxWidth: 540, margin: "0 auto 40px",
          }}>
            The world&apos;s first personalised astrology-powered growth platform combining
            astrology, Human Design, psychology, coaching and subconscious rewiring to help you
            create more confidence, love, money, purpose and self-trust.
          </p>

          <div className="flex flex-col items-center gap-4">
            <WaitlistForm dark id="hero-form" />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
              Limited founding members will receive early beta access.
            </p>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{
          background: "linear-gradient(transparent, #fff)",
        }} />
      </section>

      {/* ═══════════════ THE STORY ═══════════════ */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-2xl mx-auto">
          <div className="tag mb-6" style={{ textAlign: "center" }}>the story</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Why <span className="pk">MY SZN?</span>
          </h2>

          <div style={{ fontSize: 17, lineHeight: 2.0, color: "var(--grey)" }}>
            <p style={{ marginBottom: 28 }}>
              Every year Gemini season rolls around and suddenly Gemini women become completely unstoppable.
            </p>

            <div style={{ paddingLeft: 24, borderLeft: "2px solid var(--lav)", marginBottom: 32 }}>
              <p style={{ marginBottom: 6 }}>They&apos;re booking the trip.</p>
              <p style={{ marginBottom: 6 }}>Wearing the outfit.</p>
              <p style={{ marginBottom: 6 }}>Posting the photo.</p>
              <p style={{ marginBottom: 6 }}>Launching the business.</p>
              <p style={{ fontWeight: 500, color: "var(--dark)" }}>Owning the room.</p>
            </div>

            <p style={{ marginBottom: 28 }}>
              It made me wonder...
            </p>
            <p style={{ marginBottom: 8 }}>
              Why do we only give ourselves permission to become more of ourselves once a year?
            </p>
            <p style={{ marginBottom: 8, color: "var(--grey-light)" }}>
              Why are we waiting until Monday?
            </p>
            <p style={{ marginBottom: 8, color: "var(--grey-light)" }}>
              January?
            </p>
            <p style={{ marginBottom: 8, color: "var(--grey-light)" }}>
              Next month?
            </p>
            <p style={{ marginBottom: 8, color: "var(--grey-light)" }}>
              When we lose weight?
            </p>
            <p style={{ marginBottom: 32, color: "var(--grey-light)" }}>
              When we&apos;re finally confident?
            </p>
            <p style={{ fontSize: 18, fontWeight: 500, color: "var(--dark)", marginBottom: 8 }}>
              What if every season became an invitation to become a new version of yourself?
            </p>
            <p style={{ marginBottom: 0 }}>
              MY SZN exists so every season becomes <strong>your</strong> season.
            </p>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-6 py-20 md:py-28 text-center" style={{ background: "var(--lav-light)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 800,
            lineHeight: 1.2, letterSpacing: "-1px", color: "#3C2A70",
          }}>
            &ldquo;This is my time.<br />
            My era.<br />
            My <span style={{ color: "var(--pink)" }}>season.</span>&rdquo;
          </h2>
        </div>
      </section>

      {/* ═══════════════ MY STORY ═══════════════ */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div
            className="aspect-[3/4] w-full"
            style={{
              position: "relative", overflow: "hidden",
            }}
          >
            <img
              src="/betty-founder.png"
              alt="Betty Andrews, founder of MY SZN"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top",
              }}
            />
            <div style={{
              position: "absolute", bottom: 24, left: 24,
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}>
              Betty Andrews / Founder
            </div>
          </div>

          {/* Copy */}
          <div>
            <div className="tag mb-6">my story</div>
            <h2 style={{
              fontFamily: pp, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800,
              letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 28,
            }}>
              The biggest project I&apos;ve ever worked on was <span className="pk">me.</span>
            </h2>

            <div style={{ fontSize: 15, lineHeight: 1.9, color: "var(--grey)" }}>
              <p style={{ marginBottom: 20 }}>
                I spent years rebuilding my self-worth from the ground up. Learning to love myself.
                Building confidence. Creating a business. Healing things I didn&apos;t even know were broken.
              </p>
              <p style={{ marginBottom: 20 }}>
                And somewhere along the way I realised something that changed everything:
              </p>
              <p style={{
                fontFamily: pp, fontSize: 19, fontWeight: 800, color: "var(--dark)",
                lineHeight: 1.4, marginBottom: 24, paddingLeft: 20,
                borderLeft: "3px solid var(--pink)",
              }}>
                You can&apos;t hate yourself into a version of yourself that you love.
              </p>
              <p style={{ marginBottom: 20 }}>
                The world profits from women believing they&apos;re never enough. Not pretty enough.
                Not thin enough. Not successful enough. Not healed enough. Not ready enough.
              </p>
              <p style={{ marginBottom: 20 }}>
                MY SZN was created because becoming isn&apos;t about fixing yourself.
                It&apos;s about <strong>remembering</strong> yourself.
              </p>
              <p style={{ fontStyle: "italic", color: "var(--dark)", fontWeight: 500 }}>
                This is the platform I wish I&apos;d had.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════ THE PROBLEM ═══════════════ */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-6 text-center">the gap</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 56,
          }}>
            Astrology stops at <span className="pk">awareness.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            {/* Left: Other apps */}
            <div className="p-10 md:p-12" style={{ borderRight: "var(--border)", borderBottom: "var(--border)" }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--grey-light)", marginBottom: 20,
              }}>
                most astrology apps
              </div>
              <div className="space-y-4">
                {[
                  "Generic daily horoscopes",
                  "Tell you who you are",
                  "Information overload",
                  "Little practical guidance",
                  "Easy to forget",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3" style={{ fontSize: 15, color: "var(--grey)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--grey-light)", fontSize: 12, marginTop: 3 }}>&#x2715;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: MY SZN */}
            <div className="p-10 md:p-12" style={{ background: "var(--pink-light)", borderBottom: "var(--border)" }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--pink)", marginBottom: 20,
              }}>
                my szn
              </div>
              <div className="space-y-4">
                {[
                  "Personalised daily guidance",
                  "Helps you become who you're here to be",
                  "Action over information",
                  "Practical tools for real transformation",
                  "Evolves with your life",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3" style={{ fontSize: 15, color: "var(--dark)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--pink)", fontSize: 12, marginTop: 3 }}>&#10003;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p style={{
            fontFamily: pp, fontSize: 22, fontWeight: 800, textAlign: "center",
            marginTop: 48, letterSpacing: "-0.5px",
          }}>
            Insight changes nothing without <span className="pk">action.</span>
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════ INTRODUCING MY SZN ═══════════════ */}
      <section className="px-6 py-24 md:py-32" style={{ background: "#fafafa" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="tag mb-6">introducing</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, marginBottom: 20,
          }}>
            Personal development, built around <span className="pk">YOU.</span>
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.8, color: "var(--grey)", maxWidth: 480,
            margin: "0 auto 48px",
          }}>
            Instead of endless content... you see exactly what YOU need.
          </p>

          {/* App mockup cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-12">
            {[
              { label: "Today's astrology", icon: "&#9733;", bg: "var(--lav-light)", color: "#3C2A70" },
              { label: "Today's lesson", icon: "&#9889;", bg: "var(--pink-light)", color: "var(--pink)" },
              { label: "Today's challenge", icon: "&#127942;", bg: "var(--gold)", color: "#854F0B" },
              { label: "Today's journal prompt", icon: "&#9997;", bg: "var(--mint)", color: "#0F6E56" },
              { label: "Today's subconscious work", icon: "&#127756;", bg: "var(--cream)", color: "#854F0B" },
              { label: "Today's reminder", icon: "&#128156;", bg: "var(--pink-light)", color: "var(--pink)" },
            ].map((card) => (
              <div
                key={card.label}
                className="p-5 text-center"
                style={{ background: card.bg, border: "var(--border)" }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: card.icon }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: card.color, lineHeight: 1.3 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 15, color: "var(--grey)", fontStyle: "italic" }}>
            Everything personalised. Everything actionable. Everything for you.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════ WHAT'S INSIDE ═══════════════ */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">what&apos;s inside</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 56,
          }}>
            What you&apos;ll find <span className="pk">inside.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {[
              {
                title: "Personal Dashboard",
                desc: "Daily personalised guidance built around your birth chart, your current transits, and your growth goals.",
                icon: "&#9672;",
                bg: "var(--pink-light)",
              },
              {
                title: "Growth Pathways",
                desc: "Confidence. Money. Business. Love. Purpose. Healing. Visibility. Choose your focus and go deep.",
                icon: "&#10148;",
                bg: "var(--lav-light)",
              },
              {
                title: "Workshop Vault",
                desc: "Every live workshop saved forever. Money. Manifestation. Business. Confidence. Relationships. Astrology. Healing.",
                icon: "&#9654;",
                bg: "var(--gold)",
              },
              {
                title: "Live Mastermind",
                desc: "Monthly workshops. Guest experts. Q&As. Coaching. Community. Real conversations with women doing the work.",
                icon: "&#9734;",
                bg: "var(--mint)",
              },
              {
                title: "Personalised AI Coach",
                desc: "Guidance based on your birth chart and Human Design. Like having a coach who knows your cosmic blueprint.",
                icon: "&#10024;",
                bg: "var(--cream)",
              },
              {
                title: "Community",
                desc: "Meet women who love astrology, growth and becoming their highest selves. Your people are in here.",
                icon: "&#9829;",
                bg: "var(--pink-light)",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="p-8 md:p-10"
                style={{
                  background: card.bg,
                  borderRight: (i % 3 !== 2) ? "var(--border)" : "none",
                  borderBottom: i < 3 ? "var(--border)" : "none",
                  border: "var(--border)",
                  marginRight: -1.5,
                  marginBottom: -1.5,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: card.icon }} />
                <div style={{
                  fontFamily: pp, fontSize: 17, fontWeight: 800, marginBottom: 10,
                  letterSpacing: "-0.3px",
                }}>
                  {card.title}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)", margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ IT GROWS WITH YOU ═══════════════ */}
      <section
        className="px-6 py-24 md:py-32 text-center"
        style={{ background: "var(--dark)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--lav)", marginBottom: 28, opacity: 0.7,
          }}>
            built to evolve
          </div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.15, color: "#fff", marginBottom: 28,
          }}>
            It grows with <span style={{ color: "var(--pink)" }}>you.</span>
          </h2>
          <p style={{
            fontSize: 17, lineHeight: 1.9, color: "rgba(255,255,255,0.5)",
            maxWidth: 480, margin: "0 auto 24px",
          }}>
            MY SZN doesn&apos;t just reflect who you are. It evolves with who you&apos;re becoming.
          </p>
          <p style={{
            fontSize: 15, lineHeight: 1.9, color: "rgba(255,255,255,0.35)",
            maxWidth: 440, margin: "0 auto 40px",
          }}>
            Unlike a course you finish once, MY SZN changes every day. The astrology changes.
            The lessons change. The recommendations change. You change.
            The platform changes with you.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            {["the astrology changes", "the lessons change", "you change", "the platform follows"].map((t) => (
              <span key={t} style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--lav)", padding: "8px 16px", border: "1px solid rgba(200,180,248,0.2)",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ IMAGINE ═══════════════ */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-2xl mx-auto">
          <div className="tag mb-8 text-center">close your eyes</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(34px, 5.5vw, 52px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 56,
          }}>
            Imagine...
          </h2>

          <div style={{ fontSize: 18, lineHeight: 2.2, color: "var(--grey)" }}>
            {[
              "Opening your phone each morning knowing exactly what to focus on.",
              "Feeling deeply confident.",
              "Understanding your patterns.",
              "Trusting yourself.",
              "Making more aligned decisions.",
              "Feeling supported.",
              "Being surrounded by women growing alongside you.",
              "Working with the Universe instead of against it.",
            ].map((line, i) => (
              <p key={i} style={{
                marginBottom: 12,
                opacity: 0.5 + (i < 4 ? i * 0.12 : (7 - i) * 0.12),
                transition: "opacity 0.3s",
              }}>
                {line}
              </p>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p style={{
              fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px",
              lineHeight: 1.5, color: "var(--dark)",
            }}>
              This isn&apos;t about becoming someone else.<br />
              It&apos;s about becoming more of <span className="pk">yourself.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ WAITLIST CTA ═══════════════ */}
      <section
        className="px-6 py-24 md:py-32 text-center"
        style={{ background: "var(--pink-light)", borderTop: "var(--border)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--pink)", marginBottom: 24,
          }}>
            founding members
          </div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800,
            letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 20,
          }}>
            Become one of the first women inside <span className="pk">MY SZN.</span>
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: "var(--grey)", maxWidth: 440,
            margin: "0 auto 32px",
          }}>
            We&apos;re opening the doors to a limited number of founding members before the public launch.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "First access to beta",
              "Founding member pricing",
              "Early feature access",
              "Help shape the platform",
            ].map((b) => (
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

      {/* ═══════════════ FOOTER QUOTE ═══════════════ */}
      <section
        className="px-6 py-24 md:py-32 text-center"
        style={{ background: "var(--dark)" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 6vw, 56px)", fontWeight: 800,
            lineHeight: 1.2, letterSpacing: "-1.5px", color: "#fff",
            marginBottom: 28,
          }}>
            This is your time.<br />
            Your era.<br />
            Your <span style={{ color: "var(--pink)" }}>season.</span>
          </h2>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em",
          }}>
            Welcome to MY SZN.
          </p>
          <div style={{ fontSize: 24, marginTop: 20, opacity: 0.6 }}>&#128156;</div>
        </div>
      </section>
    </div>
  );
}
