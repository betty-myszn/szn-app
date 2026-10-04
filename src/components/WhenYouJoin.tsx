// "What happens when you join": the first hour and first week, step by step, so a new member knows
// exactly what to do the second she's paid. Every step is something the platform already does.
const pp = "var(--font-poppins), Poppins, sans-serif";

const STEPS = [
  { h: "the second you're in", b: "Create your account and your personalised platform builds itself from your birth chart and your Human Design." },
  { h: "set your intention", b: "Tell us who you're becoming over the next three months, so everything you read and do points straight at her." },
  { h: "meet your intake", b: "Introduce yourself in the room (we pre-write it for you, one tap) and meet the women starting at the same time as you." },
  { h: "book your first 1:1", b: "Pick the time for your first private session with Betty, and get the date of this season's group mastermind." },
  { h: "press play", b: "Your first hypnosis and audio guides are waiting in the app for a walk, a bath or a quiet ten minutes." },
  { h: "we start together", b: "When the doors close, your intake begins together. There's no falling behind in here: use what you need, ignore what you don't." },
];

export default function WhenYouJoin() {
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-5xl mx-auto">
        <div className="tag mb-5">what happens when you join</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
          your first week, <span className="pk">step by step.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" style={{ marginTop: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s.h} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
              <div style={{ fontFamily: pp, fontSize: 30, fontWeight: 800, color: "var(--pink)", lineHeight: 1, marginBottom: 10 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 8 }}>{s.h}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
