import DoorButton from "@/components/DoorButton";

// What you get, with what each piece is worth, adding up to the $1,111-a-month value against the
// $555 founding price. Values are Betty's to edit.
const pp = "var(--font-poppins), Poppins, sans-serif";

const STACK = [
  { what: "A private 1:1 with Betty", detail: "every month, built around your 90 days", worth: 555 },
  { what: "A live group mastermind", detail: "every season, with Astro Tapping and hot seats", worth: 333 },
  { what: "Your personalised astrology + Human Design guide", detail: "for every season, read against your chart", worth: 111 },
  { what: "A SZN hypnosis", detail: "to rewire the old identity, all season long", worth: 77 },
  { what: "Your private cohort", detail: "accountability, wins, questions and Betty in the room", worth: 35 },
];

export default function ValueStack() {
  const total = STACK.reduce((n, s) => n + s.worth, 0);
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-4xl mx-auto">
        <div className="tag mb-5">what you get</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
          everything, <span className="pk">every month.</span>
        </h2>
        <div style={{ marginTop: 30, border: "var(--border)", borderRadius: 20, overflow: "hidden", background: "#fff" }}>
          {STACK.map((s, i) => (
            <div key={s.what} className="flex items-center gap-4 flex-wrap" style={{ padding: "16px 20px", borderTop: i ? "var(--border)" : "none" }}>
              <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800 }}>{s.what}</div>
                <div style={{ fontSize: 14, color: "var(--grey)" }}>{s.detail}</div>
              </div>
              <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>worth ${s.worth.toLocaleString("en-US")}</div>
            </div>
          ))}
          <div className="flex items-center gap-4 flex-wrap" style={{ padding: "18px 20px", borderTop: "var(--border)", background: "var(--dark)", color: "#fff" }}>
            <div style={{ flex: "1 1 260px", fontFamily: pp, fontWeight: 800, fontSize: 17 }}>Every month, all of it</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, textDecoration: "line-through", textDecorationColor: "var(--pink)", opacity: 0.8 }}>${total.toLocaleString("en-US")}</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26, color: "var(--pink)" }}>$555 a month</div>
          </div>
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, marginTop: 18 }}>Founding price for three months, and it&apos;s going up after the founding cohort.</p>
        <DoorButton variant={0} />
      </div>
    </section>
  );
}
