"use client";

// The plain-English, in-Betty's-voice answer to "what even is this?", shared by the homepage and
// the membership page so the one-liner reads the same in both places. Sits right under the hero:
// the hero sells the feeling, this says what it actually is in the words a member would use to a
// friend. Deliberately light (lav band) between two heavier sections so it lands as a breath, not
// another wall of copy.

export default function WhatIsMySzn() {
  return (
    <section
      className="px-5 md:px-8"
      style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 64 }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <div className="tag mb-5" style={{ color: "#3C2A70" }}>in plain english</div>
        <h2 className="display" style={{ fontSize: "clamp(28px, 5vw, 60px)", color: "#3C2A70", lineHeight: 1.08 }}>
          {"You lock in for three months "}
          <span className="pk">with a room full of women</span>
          {" doing it right alongside you."}
        </h2>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: "#3C2A70",
            maxWidth: 700,
            margin: "22px auto 0",
            fontWeight: 500,
          }}
        >
          {"Every season the doors open for three days and a new intake starts together. For three zodiac seasons you go after the life you actually want with your own astrology and Human Design, a live Transformation Workshop and Community Circle every season, shadow work, hypnosis and manifestation, next to women who are locking in at exactly the same time as you, cheering your wins and holding you to it."}
        </p>
      </div>
    </section>
  );
}
