// The questions that stop women joining, answered on the home page.
const pp = "var(--font-poppins), Poppins, sans-serif";

const FAQS = [
  { q: "How do the 1:1s with Betty work?", a: "You get one private session a month, three across your three months, on Zoom at a time that works for you. Each one is built around what you're creating in your 90 days, with your chart and Human Design on the table." },
  { q: "What time zone are the lives in?", a: "The group masterminds are scheduled to work across the US and the UK, every date and time is on your dashboard well in advance, and every one is recorded so you can catch the replay in your own time." },
  { q: "How does payment work?", a: "It's $555 a month for three months, three payments in total, at the founding price. The price goes up after the founding cohort." },
  { q: "I always buy things and don't use them. How is this different?", a: "Nothing in here waits for you to find the motivation alone. You start with a cohort on a set date, Betty coaches you privately every month, and the group masterminds and your cohort hold you to it." },
  { q: "Do I need to know astrology?", a: "Not at all. We read your full chart and Human Design for you and show you exactly what each season means for your life. You bring the desire, we bring the map." },
  { q: "Can I get a refund?", a: "Payments aren't refundable, because real transformation requires showing up, even on the days you don't feel like it. That's the whole point." },
];

export default function HomeFaq() {
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-3xl mx-auto">
        <div className="tag mb-5">got questions</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
          everything you <span className="pk">need to know.</span>
        </h2>
        <div style={{ marginTop: 30, border: "var(--border)", borderRadius: 20, overflow: "hidden", background: "#fff" }}>
          {FAQS.map((f, i) => (
            <details key={f.q} className="group" style={{ borderTop: i ? "var(--border)" : "none" }}>
              <summary style={{ padding: "18px 22px", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", gap: 16, fontFamily: pp, fontWeight: 800, fontSize: 16 }}>
                {f.q}
                <span className="group-open:rotate-45" style={{ color: "var(--pink)", fontSize: 20, transition: "transform 0.2s" }}>+</span>
              </summary>
              <div style={{ padding: "0 22px 20px", fontSize: 15, lineHeight: 1.75 }}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
