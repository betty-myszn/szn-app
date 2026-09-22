import Link from "next/link";
import type { SeasonInfo } from "@/lib/seasons";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Where a birthday sits relative to today on a 366-day loop, in days (negative = already been). The
// loop matters for Capricorn szn, which runs across New Year: a 5 January birthday seen on 25 December
// is eleven days away rather than eleven months ago.
function daysToBirthday(dateOfBirth: string, now: Date): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!m) return null;
  const dayOfYear = (month: number, day: number) => Math.round((Date.UTC(2000, month - 1, day) - Date.UTC(2000, 0, 1)) / 86400000);
  let diff = dayOfYear(+m[2], +m[3]) - dayOfYear(now.getMonth() + 1, now.getDate());
  if (diff > 183) diff -= 366;
  if (diff < -183) diff += 366;
  return diff;
}

// The "it's YOUR szn" banner at the top of the season HQ, shown only to a member whose Sun sign is
// the season we are in, so a Libra opening her dashboard in Libra szn is celebrated before anything
// else. It reads the season data and her own chart, so every season gets it with nothing to add.
export default function YourSeasonBanner({
  name,
  sunSign,
  season,
  dateOfBirth,
}: {
  name: string;
  sunSign?: string | null;
  season: SeasonInfo;
  dateOfBirth?: string | null;
}) {
  if (!sunSign || sunSign.toLowerCase() !== season.sign.toLowerCase()) return null;

  const first = name.trim().split(/\s+/)[0]?.toLowerCase() || "bb";
  const sign = season.sign.toLowerCase();
  const toBirthday = dateOfBirth ? daysToBirthday(dateOfBirth, new Date()) : null;
  const isBirthday = toBirthday === 0;
  const birthdayLabel =
    dateOfBirth && toBirthday !== null
      ? new Date(`2000-${dateOfBirth.slice(5, 10)}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" })
      : null;
  const birthdayLine =
    toBirthday === null || isBirthday || !birthdayLabel
      ? ""
      : toBirthday > 0
        ? ` Your birthday is on ${birthdayLabel}, so the countdown is officially ON.`
        : ` Your birthday was on ${birthdayLabel}, and the celebrating lasts ALLLL szn long.`;

  const body = `The Sun is back in ${season.sign}, exactly where it was the day you were born, so this whole month is lit up for YOU, my love.${birthdayLine} Your solar return is the most powerful reset of your entire year, so take up ALL the space and decide who you're becoming next.`;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 22,
        border: "2px solid var(--dark)",
        background: "var(--pink)",
        color: "#fff",
        padding: "clamp(28px, 4.5vw, 52px)",
        marginBottom: 24,
      }}
    >
      {/* The season's glyph as a big white watermark. The variation selector asks for the plain
          text glyph, so it takes the colour here instead of rendering as a purple emoji tile. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "clamp(-40px, -2vw, -10px)",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "clamp(200px, 30vw, 380px)",
          lineHeight: 1,
          opacity: 0.18,
          color: "#fff",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {season.symbol}
        {"︎"}
      </div>

      <div style={{ position: "relative", maxWidth: 760 }}>
        <div style={{ fontFamily: poppins, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
          {isBirthday ? `✦ it's your birthday, ${first} ✦` : `✦ ${first}, the sun is in your sign ✦`}
        </div>
        <h2 className="display" style={{ fontSize: "clamp(46px, 8.4vw, 104px)", lineHeight: 0.92, color: "#fff", margin: 0, textTransform: "none" }}>
          {isBirthday ? (
            <>
              happy birthday, <span style={{ color: "var(--dark)" }}>{first}!!</span>
            </>
          ) : (
            <>
              OMG, it&apos;s <span style={{ color: "var(--dark)" }}>YOUR</span> szn!!
            </>
          )}
        </h2>
        <p style={{ fontFamily: poppins, fontSize: "clamp(15px, 1.7vw, 18px)", fontWeight: 500, lineHeight: 1.65, margin: "20px 0 0", maxWidth: 620 }}>
          {body}
        </p>
        <div style={{ display: "inline-block", marginTop: 20, background: "#fff", color: "var(--dark)", border: "2px solid var(--dark)", borderRadius: 18, padding: "10px 18px", fontFamily: poppins, fontSize: 13.5, fontWeight: 700, lineHeight: 1.4 }}>
          <span style={{ color: "var(--pink)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 11, marginRight: 8 }}>say it with me</span>
          &ldquo;{season.affirmation}&rdquo;
        </div>
        <div style={{ marginTop: 22 }}>
          <Link
            href="#season-guide"
            className="no-underline"
            style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: poppins, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 24px", borderRadius: 40 }}
          >
            read your {sign} szn, bb →
          </Link>
        </div>
      </div>
    </div>
  );
}
