import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Points her at the Venus Money meditation from the places she already goes for money: near the top
// of my szn (the dashboard) and on the money life-area read. Same slim band as "message betty".
export default function MoneyMeditationBand() {
  return (
    <section className="px-5 md:px-8 py-6" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <Link
          href="/meditations/venus-money"
          className="flex items-center justify-between gap-4 flex-wrap p-5 md:px-7"
          style={{ border: "var(--border)", background: "var(--lav-light)", textDecoration: "none" }}
        >
          <span className="flex items-center gap-3 flex-wrap">
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#fff",
                background: "var(--pink)",
                borderRadius: 40,
                padding: "4px 10px",
              }}
            >
              new
            </span>
            <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.4px", color: "var(--dark)" }}>
              💸 the venus money meditation, for receiving more and holding more
            </span>
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>
            listen now →
          </span>
        </Link>
      </div>
    </section>
  );
}
