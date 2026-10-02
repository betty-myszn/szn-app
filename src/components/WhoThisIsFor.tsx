import DoorButton from "@/components/DoorButton";

// "This is for you if…": seven traits she should recognise herself in, then the door button.
const pp = "var(--font-poppins), Poppins, sans-serif";

const TRAITS = [
  "You know you want MORE (more money, more love, more freedom, more visibility) and you're done pretending you don't.",
  "You're tired of waiting until January, your birthday or next Monday to start changing your life.",
  "You've read the books, saved the posts and listened to the podcasts, and you're ready to actually DO the thing.",
  "You love astrology and you want it to change your real life, way beyond knowing your Big 3.",
  "You're ready to go into the shadow: the people-pleasing, the money wounds and the fear of being too much.",
  "You want a room of women who celebrate your wins and cheer you on louder than anyone.",
  "You want the magic and the fun too: rituals, spellwork, manifestation and a whole lot of pink.",
];

export default function WhoThisIsFor() {
  return (
    <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-3xl mx-auto">
        <div className="tag mb-5">who this is for</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
          this is for you <span className="pk">if…</span>
        </h2>
        <div style={{ marginTop: 32, border: "var(--border)", borderRadius: 18, overflow: "hidden" }}>
          {TRAITS.map((t, i) => (
            <div key={t} className="flex items-start gap-4" style={{ padding: "18px 22px", borderTop: i ? "var(--border)" : "none", background: i % 2 ? "var(--pink-light)" : "#fff" }}>
              <span aria-hidden="true" style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, color: "var(--pink)", lineHeight: 1.4 }}>✓</span>
              <span style={{ fontSize: 16, lineHeight: 1.6, color: "var(--dark)", fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </div>
        <DoorButton variant={3} />
      </div>
    </section>
  );
}
