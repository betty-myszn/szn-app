const poppins = "var(--font-poppins), Poppins, sans-serif";

export const metadata = {
  title: "Community Guidelines | MY SZN",
  description: "How we keep the MY SZN community a safe, honest space for women becoming her.",
};

const headingStyle: React.CSSProperties = {
  fontFamily: poppins,
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: "-0.3px",
  marginBottom: 12,
};
const bodyStyle: React.CSSProperties = { fontSize: 14, lineHeight: 1.85, color: "var(--grey)" };

const RULES = [
  {
    title: "be a real person, honestly",
    body: "Post as yourself. No impersonation, no fake accounts, no pretending to be someone you're not.",
  },
  {
    title: "no harassment, no hate",
    body: "Disagreement is fine, cruelty isn't. No harassment, hate speech, or targeting anyone for who they are.",
  },
  {
    title: "protect each other's privacy",
    body: "What's shared in the community stays in the community. Don't screenshot or share someone else's post, chart or journal reflection outside the platform without asking first.",
  },
  {
    title: "no spam, no selling",
    body: "This is a members' space, not a marketing channel. Don't post unsolicited promotions, affiliate links or spam.",
  },
  {
    title: "keep advice, not diagnoses",
    body: "Share what worked for you. Don't present astrology, coaching or wellness opinions as medical, legal or financial fact for someone else's situation.",
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <>
      <section className="px-5 md:px-8 py-16" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-3">legal</div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 800, letterSpacing: "-1px", color: "#fff", marginBottom: 12 }}>
            community guidelines.
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 540 }}>
            The community only works if it feels safe. These are the rules that keep it that way.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-8 mb-10">
            {RULES.map((rule) => (
              <div key={rule.title}>
                <h2 style={headingStyle}>{rule.title}</h2>
                <p style={bodyStyle}>{rule.body}</p>
              </div>
            ))}
          </div>
          <div className="p-5" style={{ background: "var(--lav-light)", border: "var(--border)" }}>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#3C2A70" }}>
              Breaking these guidelines can result in content being removed or, for repeat or serious
              breaches, account suspension. If something feels off, tell us, email{" "}
              <a href="mailto:hello@thecosmicco.com" style={{ color: "var(--pink)", fontWeight: 700 }}>hello@thecosmicco.com</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
