"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { SIGN_TRAITS } from "@/lib/interpretations";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function AffirmationsPage() {
  const { member, ready } = useMember();
  const season = useSeason();
  const [index, setIndex] = useState(0);

  // Deck is tuned to the season's own affirmation set plus lines drawn from the
  // member's sun sign traits, so the words change with both the szn and the woman.
  const deck = useMemo(() => {
    const sunSign = member?.placements.sun;
    const traits = sunSign ? SIGN_TRAITS[sunSign] : undefined;
    const sunLines = traits
      ? [
          `My ${sunSign!.toLowerCase()} sun runs on ${traits.essence}, and I stop apologising for it.`,
          `I am ${traits.flavour.slice(0, 2).join(" and ")}, and that is exactly my power.`,
          `${traits.gift.charAt(0).toUpperCase()}${traits.gift.slice(1)}.`,
        ]
      : [];
    return [...season.affirmations, ...sunLines];
  }, [season, member]);

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            your affirmations live inside.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="min-h-[70vh] flex items-center justify-center px-5 py-16"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="tag mb-6">
            {season.sign.toLowerCase()} szn affirmations · {index + 1} of {deck.length}
          </div>
          <p
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.15,
              color: "#fff",
              marginBottom: 40,
              minHeight: 120,
            }}
          >
            &ldquo;{deck[index]}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIndex((i) => (i - 1 + deck.length) % deck.length)}
              style={{
                background: "none",
                border: "1.5px solid rgba(255,255,255,0.4)",
                color: "#fff",
                padding: "12px 24px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              back
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % deck.length)}
              className="btn-pink"
              style={{ cursor: "pointer" }}
            >
              next affirmation
            </button>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 28, lineHeight: 1.6 }}>
            Say it out loud. Say it like you mean it. Repetition rewires.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-3">why these words</div>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8 }}>
              These affirmations are tuned to {season.sign.toLowerCase()} szn{member.placements?.sun ? ` and your ${member.placements.sun.toLowerCase()} sun` : ""}, themes of {season.themes.slice(0, 2).join(" and ")}. They change with every szn, so the words always match the work.
            </p>
          </div>
          <div className="p-8" style={{ background: "var(--pink-light)" }}>
            <div className="tag mb-3">make it stick</div>
            <p style={{ fontSize: 14, color: "#993556", lineHeight: 1.8 }}>
              Pick one affirmation and anchor it to a daily habit, first coffee, red lip, walk to work. Same words, same moment, every day this szn.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
