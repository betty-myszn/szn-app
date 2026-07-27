"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { useEnrolmentOpen } from "@/lib/enrolment";

const poppins = "var(--font-poppins), Poppins, sans-serif";

function Ticker({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
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
  const router = useRouter();
  const { member, ready } = useMember();
  const season = useSeason();
  const enrolmentOpen = useEnrolmentOpen();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (ready && member) router.replace("/dashboard");
  }, [ready, member, router]);

  if (!ready || member) return null;

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "membership-waitlist" }),
      });
    } catch {
      // mock mode, the confirmation still shows
    }
  };

  return (
    <>
      <Ticker
        items={[
          "the astrology coaching membership",
          "become your future self",
          `it's ${season.sign.toLowerCase()} szn`,
          "your era starts now",
          enrolmentOpen ? "enrolment is open" : "doors open soon",
        ]}
      />

      {/* Hero */}
      <section
        className="px-5 md:px-8 py-20 text-center"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="tag mb-4">
            {enrolmentOpen
              ? "enrolment open now · astrology coaching membership"
              : `astrology coaching membership · ${season.sign.toLowerCase()} szn edition`}
          </div>
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
            your whole life,<br />
            aligned with <span className="pk">your chart.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 32px" }}>
            MY SZN is an astrology coaching membership for women. Your birth chart powers everything: deep personalised chart readings, live coaching workshops, shadow work, style codes, goals and a community of women becoming her. Every szn, the whole portal shifts with the sky.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* While the doors are open the primary CTA goes straight into the payment-first
                flow (pricing, then Stripe Checkout). Once the window closes it reverts to
                collecting leads, no redesign needed. See src/lib/enrolment.ts. */}
            {enrolmentOpen ? (
              <Link href="/membership" className="btn-pink">join my szn</Link>
            ) : (
              <a href="#waitlist" className="btn-pink">join the waitlist</a>
            )}
            <Link href="/login" className="btn-outline btn-outline--white">member login</Link>
          </div>
          {enrolmentOpen && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 16 }}>
              Doors close in 72 hours. Founding member pricing, limited spots.
            </p>
          )}
        </div>
      </section>

      {/* What's inside */}
      <section className="px-5 md:px-8 py-14" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5 text-center" style={{ display: "block" }}>inside your portal</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            {[
              { icon: "☉", title: "your szn, decoded", body: "A living season page that updates with every zodiac szn: your themes, your guidance and the exact work to focus on.", bg: "#fff", border: true },
              { icon: "♀", title: "style codes", body: "How to dress, show up and magnetise based on your venus and rising, styled for the woman you're becoming.", bg: "var(--pink)", light: true, border: true },
              { icon: "☾", title: "shadow work journal", body: "Prompts that move with the astrology, designed to take you from hiding to whole.", bg: "#fff", border: false },
              { icon: "✦", title: "goals with backup", body: "Set what you're calling in and get astro-aligned guidance on making it real.", bg: "var(--lav-light)", border: true },
              { icon: "★", title: "live workshops", body: "Astrology, tapping, embodiment and coaching, live every szn, replays saved forever.", bg: "#fff", border: true },
              { icon: "♡", title: "the community", body: "Wins, questions and support from women on the same becoming-her journey.", bg: "var(--dark)", light: true, border: false },
            ].map((card, i) => (
              <div
                key={card.title}
                className="p-7"
                style={{
                  background: card.bg,
                  borderRight: card.border ? "var(--border)" : undefined,
                  borderBottom: i < 3 ? "var(--border)" : undefined,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10, color: card.light ? "#fff" : "var(--dark)" }}>{card.icon}</div>
                <h3
                  style={{
                    fontFamily: poppins,
                    fontSize: 17,
                    fontWeight: 800,
                    letterSpacing: "-0.4px",
                    marginBottom: 8,
                    color: card.light ? "#fff" : "var(--dark)",
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: card.light ? "rgba(255,255,255,0.7)" : "var(--grey)" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events teaser */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="tag mb-3">your first workshops inside</div>
          <h2 style={{ fontFamily: poppins, fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 12 }}>
            Leo szn is about to <span className="pk">hit different.</span>
          </h2>
          <p style={{ fontSize: 14, color: "#3C2A70", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 24px" }}>
            Two live workshops on confidence, visibility and getting paid to be fully yourself, starting 28 july.
          </p>
          <Link href="/events" className="btn-pink">see the workshops</Link>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="px-5 md:px-8 py-20 text-center" style={{ background: "var(--dark)" }}>
        <div className="max-w-xl mx-auto">
          <div className="tag mb-4">{enrolmentOpen ? "enrolment open · 72 hours only" : "doors open intermittently"}</div>
          <h2
            style={{
              fontFamily: poppins,
              fontSize: "clamp(28px, 4.5vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            your next era isn&apos;t waiting for permission.<br />
            <span className="pk">it&apos;s waiting for you.</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 20 }}>
            {enrolmentOpen
              ? "The doors are open right now. Pick your membership and your personalised portal is built the moment you're in."
              : "Join the waitlist and you'll be first through the doors when they open."}
          </p>
          <p style={{ fontSize: 13, color: "var(--lav)", lineHeight: 1.7, marginBottom: 30, fontWeight: 600 }}>
            When you join, you sign up with your birth date, time and place. That builds your natal chart and personalises everything inside to you.
          </p>
          {enrolmentOpen ? (
            <Link href="/membership" className="btn-pink" style={{ display: "inline-block" }}>
              join my szn
            </Link>
          ) : !joined ? (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto" style={{ border: "1.5px solid #fff" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email address"
                className="flex-1"
                style={{ border: "none", outline: "none", padding: "15px 18px", fontSize: 14, background: "#fff" }}
              />
              <button type="submit" className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
                join the waitlist
              </button>
            </form>
          ) : (
            <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, color: "var(--pink)" }}>
              you&apos;re on the list. watch your inbox, your era is loading. ✦
            </p>
          )}
        </div>
      </section>
    </>
  );
}
