// The online vs in-person coven comparison, Betty's structure (17 Nov 2026). Shown on the LA coven
// page and beside the brunch booking forms so the $44 vs $88 difference reads the same everywhere:
// the $44 online coven does NOT include the monthly Baddie Brunch.

const pp = "var(--font-poppins), Poppins, sans-serif";

const ROWS: [string, string, string][] = [
  ["Monthly membership", "$44", "$88"],
  ["Online workshops and activations", "Included", "Included"],
  ["Community and friendship matching", "Included", "Included"],
  ["One Baddie Brunch every month", "$49 ticket", "FREE"],
  ["Personalised seasonal astrology guide", "With your brunch ticket", "Included at brunch"],
  ["Extra dinners, circles and special events", "Paid", "Paid, with possible member discounts"],
];

export default function CovenPriceTable({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const ink = dark ? "#fff" : "var(--dark)";
  const line = dark ? "#fff" : "var(--dark)";
  const cols = "1.35fr 1fr 1fr";
  const star = dark ? "var(--pink)" : "var(--pink-light)";
  return (
    <div style={{ color: ink }}>
      <div style={{ border: `2px solid ${line}`, borderRadius: 18, overflow: "hidden", background: dark ? "transparent" : "#fff" }}>
        <div className="grid" style={{ gridTemplateColumns: cols, borderBottom: `2px solid ${line}` }}>
          <span />
          <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 14, lineHeight: 1.25, padding: "12px 10px" }}>💻 Online coven</span>
          <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 14, lineHeight: 1.25, padding: "12px 10px", background: star }}>🌴 In-person coven (LA)</span>
        </div>
        {ROWS.map(([label, online, irl], i) => (
          <div key={label} className="grid" style={{ gridTemplateColumns: cols, borderTop: i ? `1px solid ${line}` : undefined, fontSize: 14.5, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 800, padding: "11px 12px" }}>{label}</span>
            <span style={{ fontWeight: 600, padding: "11px 10px" }}>{online}</span>
            <span style={{ fontWeight: 800, padding: "11px 10px", background: star }}>{irl}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: "10px 2px 0", fontSize: 14.5, fontWeight: 700, color: ink }}>🪩 Not a member? Baddie Brunch tickets are $49.</p>
    </div>
  );
}
