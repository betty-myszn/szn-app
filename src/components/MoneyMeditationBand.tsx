import Image from "next/image";
import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Points her at the Venus Money meditation from the places she already goes for money: near the top
// of my szn (the dashboard) and on the money life-area read. A full feature block with the video's
// cover, because a slim text band read as page furniture and got scrolled straight past.
export default function MoneyMeditationBand() {
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 48, paddingBottom: 48 }}>
      <Link
        href="/meditations/venus-money"
        className="no-underline max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 items-center"
        style={{ color: "#fff" }}
      >
        <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 14, overflow: "hidden", border: "2px solid var(--pink)" }}>
          <Image
            src="/meditations/venus-money.jpg"
            alt="Venus money meditation"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--pink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              paddingLeft: 4,
              boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
            }}
          >
            ▶
          </span>
        </div>

        <div>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#fff",
              background: "var(--pink)",
              borderRadius: 40,
              padding: "6px 14px",
              marginBottom: 18,
            }}
          >
            new meditation 💸
          </span>
          <h2
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 4.5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            venus money<span className="pk">.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.8)", maxWidth: 480, marginBottom: 24 }}>
            For receiving more, holding more and asking for more, with a physical anchor you can use before you sell, price, post or get paid.
          </p>
          <span className="btn-pink" style={{ display: "inline-block" }}>
            listen now →
          </span>
        </div>
      </Link>
    </section>
  );
}
