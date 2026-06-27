"use client";

import { useState } from "react";

const pp = "var(--font-poppins), Poppins, sans-serif";
const dm = "var(--font-dm-sans), 'DM Sans', sans-serif";

export default function MastermindPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [why, setWhy] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "mastermind", instagram, why }),
      });
    } catch {}
    setSubmitted(true);
    setSubmitting(false);
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--grey-light)",
    marginBottom: 8,
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "var(--border)",
    fontFamily: dm,
    fontSize: 14,
    color: "var(--dark)",
    background: "#fff",
    outline: "none",
  };

  return (
    <>
      {/* Hero */}
      <div
        className="px-8 py-16 md:py-24"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="tag mb-4">monthly live mastermind</div>
          <h1
            style={{
              fontFamily: pp,
              fontSize: "clamp(34px, 6vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            Become her. <span style={{ color: "var(--pink)" }}>Together.</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            A monthly live mastermind for women who are done waiting and ready to become.
            Coaching, astrology, guest experts, and a community of women who actually get it.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: What's inside */}
          <div>
            <div className="tag mb-6">what you get</div>
            <h2
              style={{
                fontFamily: pp,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
                marginBottom: 32,
              }}
            >
              This is not another course you&apos;ll never finish.
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: "Monthly Live Workshops",
                  desc: "Deep-dive sessions on money, confidence, business, relationships, astrology, and healing. Taught live. Recorded forever.",
                  bg: "var(--lav-light)",
                },
                {
                  title: "Guest Experts",
                  desc: "Astrologers, therapists, business coaches, manifestation teachers, and women who've done the work and have the results to prove it.",
                  bg: "var(--pink-light)",
                },
                {
                  title: "Live Coaching & Q&A",
                  desc: "Bring your questions. Bring your blocks. Get coached in real time on whatever is standing between you and the version of yourself you keep dreaming about.",
                  bg: "var(--gold)",
                },
                {
                  title: "Community",
                  desc: "Women who love astrology, personal development, and becoming. Your people are in here. The group chat you've been looking for.",
                  bg: "var(--mint)",
                },
                {
                  title: "Workshop Vault",
                  desc: "Every single live session saved and searchable. Money. Manifestation. Business. Confidence. Healing. Astrology. All yours, forever.",
                  bg: "var(--cream)",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6"
                  style={{ background: item.bg, border: "var(--border)" }}
                >
                  <div style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.3px" }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Emotional close */}
            <div className="mt-10 p-6" style={{ background: "var(--dark)" }}>
              <p style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.4, margin: 0 }}>
                &ldquo;Surround yourself with women who would mention your name in a room full of
                opportunities.&rdquo;
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12, margin: "12px 0 0" }}>
                That&apos;s this room.
              </p>
            </div>
          </div>

          {/* Right: Waitlist Form */}
          <div>
            <div
              className="sticky top-24 p-8 md:p-10"
              style={{ border: "var(--border)", background: "#fff" }}
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div style={{ fontSize: 32, marginBottom: 16 }}>&#10024;</div>
                  <h3 style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                    You&apos;re on the list.
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>
                    We&apos;ll be in touch with details on founding member access,
                    pricing, and launch dates. Your season is about to begin.
                  </p>
                </div>
              ) : (
                <>
                  <div className="tag mb-3">founding members</div>
                  <h3 style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8 }}>
                    Join the <span className="pk">waitlist.</span>
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
                    We&apos;re opening the doors to a limited number of founding members.
                    Early access. Founding pricing. First in.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label style={labelStyle}>your name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="First name"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>email address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>instagram (optional)</label>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@yourhandle"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>why do you want in? (optional)</label>
                      <textarea
                        value={why}
                        onChange={(e) => setWhy(e.target.value)}
                        placeholder="Tell us what you're working on becoming..."
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" as const }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full cursor-pointer"
                      style={{
                        background: "var(--pink)",
                        color: "#fff",
                        fontFamily: dm,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "16px 32px",
                        border: "none",
                        marginTop: 8,
                      }}
                    >
                      {submitting ? "joining..." : "join the mastermind waitlist"}
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {["Founding pricing", "First access", "Shape the platform"].map((b) => (
                      <span key={b} style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                        color: "var(--grey)", padding: "6px 12px",
                        background: "var(--pink-light)",
                      }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
