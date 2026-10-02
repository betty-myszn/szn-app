// "Three months from now": what changes in each month of the chapter, from Betty's SZN framework
// (SZN-THEMES-Q4-2026.md, the destination of each SZN). Shared by the home and membership pages.
const pp = "var(--font-poppins), Poppins, sans-serif";

const MONTHS = [
  {
    when: "month 1 · libra",
    name: "💗 Self-Love SZN",
    body: "You understand yourself, your desires and your standards so much more deeply. You know what you actually want once the conditioning is out of the way, you've stopped accepting some of what you used to tolerate, and you're letting yourself receive money, love, praise and support without immediately questioning whether you deserve it.",
  },
  {
    when: "month 2 · scorpio",
    name: "🦂 Bad B*tch SZN",
    body: "You've confronted what could sabotage your next chapter. You're clearer on your boundaries, you've reclaimed the parts of yourself you used to hide or apologise for, you're saying no without the 700-word apology, and you're becoming more powerful, more visible and a whole lot harder to control.",
  },
  {
    when: "month 3 · sagittarius",
    name: "🏹 Big Dream SZN",
    body: "You've stopped editing your dreams down to whatever feels realistic. You know how big you actually want your life to be, you've turned enormous desires into real decisions, you've started making the moves, and you walk into 2027 ALREADY MOVING.",
  },
];

export default function ThreeMonthsFromNow() {
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-5xl mx-auto">
        <div className="tag mb-5">three months from now</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 66px)", color: "var(--dark)", lineHeight: 1 }}>
          your life could look <span className="pk">like this.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 34 }}>
          {MONTHS.map((m) => (
            <div key={m.when} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>{m.when}</div>
              <div style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 12 }}>{m.name}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--dark)", margin: 0 }}>{m.body}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: pp, fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.5px", marginTop: 40, marginBottom: 0 }}>
          2027: <span className="pk">we&apos;re not starting. We&apos;re continuing.</span>
        </p>
      </div>
    </section>
  );
}
