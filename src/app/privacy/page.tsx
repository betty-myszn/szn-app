import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export const metadata = {
  title: "Privacy Policy | MY SZN",
  description: "How MY SZN collects, uses and protects your personal data, including birth data, journal entries and goals.",
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

export default function PrivacyPage() {
  return (
    <>
      <section className="px-5 md:px-8 py-16" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-3">legal</div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 800, letterSpacing: "-1px", color: "#fff", marginBottom: 12 }}>
            privacy policy.
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Last updated 22 July 2026.</p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-14">
        <div className="max-w-3xl mx-auto">
          <div style={sectionStyle}>
            <p style={bodyStyle}>
              MY SZN is run by The Cosmic Co. This policy explains what personal data we collect when you use the platform, why we collect it, and what control you have over it. We&apos;ve written it in plain English on purpose, because the data involved here is genuinely personal: your birth details, your journal entries, your goals.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>what we collect</h2>
            <p style={bodyStyle}>
              Account details: your name, email address and membership level. Birth data: your date, time and place of birth, used to calculate your natal chart via the Swiss Ephemeris. Content you create: journal entries, goals, community posts and messages, poll responses, and workshop RSVPs. Usage data: which pages you visit and which features you use, so we can improve the product.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>why we collect it</h2>
            <p style={bodyStyle}>
              Your birth data exists for one reason: to calculate your chart and personalise every reading in the app to you specifically. Your journal and goals exist so the app can reflect your own words and progress back to you, and so features that reference them (like your dashboard or season pages) work correctly. We don&apos;t use any of this to build an advertising profile of you, and we don&apos;t sell it.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>who can see your data</h2>
            <p style={bodyStyle}>
              Your birth data, chart, journal entries and private goals are visible only to you. Content you deliberately post publicly, community posts, comments, chat messages, is visible to other members, exactly as you&apos;d expect from a community space. We don&apos;t share your personal data with third parties for their own marketing purposes.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>how long we keep it</h2>
            <p style={bodyStyle}>
              We keep your data for as long as your account is active. If you delete your account, we delete your personal data (birth details, journal entries, goals) within 30 days, except where we&apos;re required to retain certain records for legal or accounting reasons.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>your rights</h2>
            <p style={bodyStyle}>
              You can access, correct or export your data at any time from{" "}
              <Link href="/settings" style={{ color: "var(--pink)", fontWeight: 700 }}>settings</Link>. You can request full account deletion by emailing us, see contact details below, and we&apos;ll confirm once it&apos;s complete.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>contact</h2>
            <p style={bodyStyle}>
              Questions about this policy, or a data request, email{" "}
              <a href="mailto:hello@thecosmicco.com" style={{ color: "var(--pink)", fontWeight: 700 }}>hello@thecosmicco.com</a>.
            </p>
          </div>

          <div className="p-5" style={{ background: "var(--lav-light)", border: "var(--border)" }}>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#3C2A70" }}>
              This policy is written to be genuinely clear and accurate about current practice, not filler text, but it hasn&apos;t been reviewed by a lawyer yet. Get that review done before taking real payment or storing real member data at scale.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
