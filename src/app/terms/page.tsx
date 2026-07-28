import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The title deliberately omits the brand: the root layout's template already appends " | MY SZN".
export const metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern your use of the MY SZN membership platform.",
  alternates: { canonical: "/terms" },
};

const sectionStyle = { marginBottom: 40 };
const headingStyle: React.CSSProperties = {
  fontFamily: poppins,
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: "-0.3px",
  marginBottom: 12,
};
const bodyStyle: React.CSSProperties = { fontSize: 14, lineHeight: 1.85, color: "var(--grey)" };

export default function TermsPage() {
  return (
    <>
      <section className="px-5 md:px-8 py-16" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-3">legal</div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 800, letterSpacing: "-1px", color: "#fff", marginBottom: 12 }}>
            terms &amp; conditions.
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Last updated 23 July 2026.</p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-14">
        <div className="max-w-3xl mx-auto">
          <div style={sectionStyle}>
            <p style={bodyStyle}>
              These terms govern your use of MY SZN, run by The Cosmic Co. By creating an account you&apos;re agreeing to them. If anything here doesn&apos;t make sense, ask us before you sign up, not after.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>the membership</h2>
            <p style={bodyStyle}>
              MY SZN is a paid membership giving you access to personalised astrology content, workshops, community spaces and coaching tools. Pricing, billing frequency and what&apos;s included at each membership tier are shown at checkout and may be updated from time to time, we&apos;ll always tell you before a change affects an active subscription.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>not professional advice</h2>
            <p style={bodyStyle}>
              MY SZN provides astrology-based content, coaching prompts and community for entertainment, reflection and personal growth. It is not a substitute for professional medical, financial, legal or mental health advice. Please seek a qualified professional for any of those.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>your content</h2>
            <p style={bodyStyle}>
              You own what you post, journal entries, goals, community posts and messages. By posting publicly in the community, you&apos;re allowing other members to see it. We can remove content that breaks our{" "}
              <Link href="/community-guidelines" style={{ color: "var(--pink)", fontWeight: 700 }}>community guidelines</Link>.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>billing and refunds</h2>
            <p style={bodyStyle}>
              There is <strong>no minimum term</strong>. Monthly memberships bill each month until you cancel, and you can cancel at any time. If you choose an upfront plan, you pay once for the period it covers and it doesn&apos;t renew automatically.
            </p>
            <p style={{ ...bodyStyle, marginTop: 12 }}>
              <strong>Payments are non-refundable.</strong> Once a payment is taken, whether it&apos;s a single month or a full upfront term, we don&apos;t refund it, including if you stop using the membership partway through a period you&apos;ve already paid for. You confirm this at checkout before payment is taken.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>cancelling</h2>
            <p style={bodyStyle}>
              You can cancel future billing at any time from{" "}
              <Link href="/settings" style={{ color: "var(--pink)", fontWeight: 700 }}>settings</Link>. You&apos;ll keep access until the end of the period you&apos;ve already paid for, and you won&apos;t be billed again. Cancelling doesn&apos;t refund payments already taken, and it doesn&apos;t automatically delete your data, see our{" "}
              <Link href="/privacy" style={{ color: "var(--pink)", fontWeight: 700 }}>privacy policy</Link> for how to request full deletion.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>contact</h2>
            <p style={bodyStyle}>
              Questions about these terms: email{" "}
              <a href="mailto:hello@thecosmicco.com" style={{ color: "var(--pink)", fontWeight: 700 }}>hello@thecosmicco.com</a>.
            </p>
          </div>

          <div className="p-5" style={{ background: "var(--lav-light)", border: "var(--border)" }}>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#3C2A70" }}>
              Written to be genuinely accurate about how the platform actually works today, not filler text, but it hasn&apos;t been reviewed by a lawyer yet. Get that review done before taking real payment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
