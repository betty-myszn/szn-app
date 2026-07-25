// Scrolling marquee band, same look as the homepage/waitlist ticker. Items are doubled so the
// translateX(-50%) keyframe loops seamlessly (see .ticker rules in globals.css). Pure presentational,
// no hooks, so it can render anywhere.
export default function Ticker({ items, variant = "pink" }: { items: string[]; variant?: "pink" | "lav" }) {
  const doubled = [...items, ...items];
  return (
    <div className={variant === "lav" ? "ticker ticker--lav" : "ticker"}>
      <div className="ticker-inner">
        {doubled.map((text, i) => (
          <span key={i}>
            {i > 0 && <span className="dot">&#10022;</span>}
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
