import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Where a Payment Link's "back" action lands, nothing changed, nothing to confirm, just get her
// back to comparing plans without a dead end.
export default function CheckoutCancelPage() {
  return (
    <section
      className="min-h-[80vh] flex items-center justify-center px-5 py-16"
      style={{ background: "var(--dark)" }}
    >
      <div className="w-full max-w-lg bg-white p-8 md:p-12 text-center" style={{ border: "var(--border)" }}>
        <div className="tag mb-3">checkout cancelled</div>
        <h1
          style={{
            fontFamily: poppins,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          no charge made,<br />
          <span className="pk">nothing&apos;s changed.</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 32 }}>
          You can pick up where you left off whenever you&apos;re ready.
        </p>
        <Link href="/membership" className="btn-pink" style={{ display: "inline-block" }}>
          back to pricing
        </Link>
      </div>
    </section>
  );
}
