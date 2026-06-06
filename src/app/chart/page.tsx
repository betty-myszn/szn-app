import BirthDataForm from "@/components/BirthDataForm";

export const metadata = {
  title: "Generate Your Chart — MY SZN",
};

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function ChartPage() {
  return (
    <>
      <div
        className="px-8 py-12"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="tag mb-3">generate your chart</div>
        <h1
          style={{
            fontFamily: poppins,
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.8px",
            color: "#fff",
            lineHeight: 1.05,
            marginBottom: 12,
          }}
        >
          enter your birth details.
          <br />
          unlock <span className="pk">everything.</span>
        </h1>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 480,
          }}
        >
          Your date, time, and place of birth is all it takes. The more precise
          your birth time, the more accurate your rising sign and house
          placements will be. If you don&apos;t know your exact time, mark it as
          approximate.
        </p>
      </div>
      <div className="px-8 py-12 max-w-xl mx-auto">
        <BirthDataForm />
      </div>
    </>
  );
}
