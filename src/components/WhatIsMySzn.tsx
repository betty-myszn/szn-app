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
          MY SZN is basically the <span className="pk">astro girls support group</span> for the baddies.
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
          Your personalised astrology and Human Design, live coaching, workshops, meditations,
          manifestation, shadow work, and a community of women who actually wanna talk about this
          sh*t with you.
        </p>
      </div>
    </section>
  );
}
