import { MASTERMIND, MASTERMIND_APPLY_BY, MASTERMIND_ENDS, MASTERMIND_PLAN, MASTERMIND_PRICE, MASTERMIND_STARTS } from "@/lib/mastermind";

// The questions that stop women applying, answered on the Mastermind page (only used there).
// Rewritten for the January 2027 cohort on 18 Nov 2026; the last four keep Betty's approved answers.
const pp = "var(--font-poppins), Poppins, sans-serif";

const FAQS = [
  { q: "How is this different from the Bad B*tch Coven?", a: `The coven is where you learn the magic and find your people, with one live circle a month for the whole coven. The Mastermind is me coaching YOU: your 1:1 audit, two private sessions, Telegram access to me between calls and hot seat coaching every two weeks, with only ${MASTERMIND.spots} women in the room, and the whole coven is included too.` },
  { q: "When does it start?", a: `${MASTERMIND_STARTS}, and we go for 90 days, all the way to ${MASTERMIND_ENDS}. Applications close on ${MASTERMIND_APPLY_BY}, so you know if you're in before Christmas.` },
  { q: "How do the private sessions work?", a: "Your 1:1 audit comes first, in your first week, where we go through your whole life against your chart and Human Design and build your Dream Life Blueprint. Then you get two more private sessions with me in months two and three, all on Zoom at a time that works for you." },
  { q: "How does the Telegram access work?", a: `You get a private Telegram chat with me and your cohort, and I'm in there ${MASTERMIND.telegramDays} coaching you between calls, so the wins, the wobbles and the scary decisions never have to wait for the next session.` },
  { q: "How does payment work?", a: `It's ${MASTERMIND_PRICE} for the full 90 days, or ${MASTERMIND_PLAN}. Once your application is accepted and we've had our little chat, I'll send you your payment link.` },
  { q: "What time zone are the lives in?", a: "The group calls are scheduled to work across the US and the UK, every date and time is on your dashboard well in advance, and every one is recorded so you can catch the replay in your own time." },
  { q: "I always buy things and don't use them. How is this different?", a: "Nothing in here waits for you to find the motivation alone. You start with a cohort on a set date, Betty coaches you privately every month, and the group calls and your cohort hold you to it." },
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
