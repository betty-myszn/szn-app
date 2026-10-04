// Meet Betty: in a mastermind people are buying the coach, so she gets her own section.
const pp = "var(--font-poppins), Poppins, sans-serif";

export default function MeetBetty() {
  return (
    <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/betty-founder.png" alt="Betty Andrews, founder of MY SZN" style={{ width: "100%", borderRadius: 24, border: "var(--border)", objectFit: "cover", aspectRatio: "4 / 5" }} />
        <div>
          <div className="tag mb-5">meet your coach</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 70px)", color: "var(--dark)", lineHeight: 1 }}>
            hi, i&apos;m <span className="pk">betty.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "var(--dark)", marginTop: 22, fontWeight: 500 }}>
            The biggest project I&apos;ve ever worked on wasn&apos;t my business. It was me. I spent years rebuilding my self-worth from the ground up, learning to love myself, building confidence, creating a business and healing things I didn&apos;t even know were broken.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "var(--dark)", marginTop: 14 }}>
            Now I coach women to do the same with their astrology, their Human Design and a whole lot of magic, and in MY SZN I coach you privately, every single month.
          </p>
          <p style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.3, marginTop: 20, color: "var(--dark)" }}>
            You can&apos;t hate yourself into a version of yourself that you love.
          </p>
          <div className="flex flex-wrap gap-2" style={{ marginTop: 22 }}>
            {["libra sun", "aquarius moon", "aquarius rising", "manifestor 4/6"].map((c) => (
              <span key={c} style={{ fontFamily: pp, fontWeight: 800, fontSize: 13, border: "var(--border)", borderRadius: 999, padding: "7px 14px", background: "var(--lav-light)" }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
