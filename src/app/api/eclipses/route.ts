import { NextResponse, type NextRequest } from "next/server";
import swisseph from "swisseph";
import path from "path";
import { DateTime } from "luxon";
import { ZODIAC_SIGNS } from "@/types/chart";
import { SKY_ZONE } from "@/lib/sky-zone";

const EPHE_PATH = path.join(process.cwd(), "ephe");
swisseph.swe_set_ephe_path(EPHE_PATH);

export const runtime = "nodejs";

// The eclipse SERIES, computed rather than hardcoded. An eclipse only makes sense as one scene in
// an eighteen-month story ("what began at the last eclipse on this axis is what comes back now"),
// so the reading needs the neighbouring eclipses, not just today's. Every date here comes from the
// same Swiss Ephemeris and the same ecliptic-limit classification /api/calendar already uses, so
// this can never drift from the dates shown everywhere else in the app, and there is no table of
// eclipse dates typed in by hand to go stale or be wrong.
//
// Cached for a day: the sky does not change, and this scans several years of lunations.
export const revalidate = 86400;

interface EclipseEvent {
  type: "solar_eclipse" | "lunar_eclipse";
  date: string; // ISO date in SKY_ZONE
  sign: string;
  degree: number;
  nodeEnd: "north" | "south";
}

function calcAt(jd: number, body: number): { longitude: number; speed: number } {
  const r = swisseph.swe_calc_ut(jd, body, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED) as {
    longitude: number;
    longitudeSpeed: number;
  };
  return { longitude: r.longitude, speed: r.longitudeSpeed };
}

// Same conversion as /api/calendar: the ephemeris gives an exact instant, and the published date is
// that instant read in SKY_ZONE (US Eastern), which is what the astrology tables agree with.
function jdToIso(jd: number): string {
  return DateTime.fromMillis((jd - 2440587.5) * 86400000, { zone: SKY_ZONE }).toISODate() ?? "";
}

function signAt(longitude: number): { sign: string; degree: number } {
  const norm = ((longitude % 360) + 360) % 360;
  const idx = Math.floor(norm / 30);
  return { sign: ZODIAC_SIGNS[idx], degree: Math.floor(norm - idx * 30) };
}

function distanceToNode(jd: number, moonLongitude: number): number {
  const node = calcAt(jd, swisseph.SE_TRUE_NODE);
  const diff = Math.abs(((moonLongitude - node.longitude + 540) % 360) - 180);
  return Math.min(diff, 180 - diff);
}

function angDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function nodeEndFor(jd: number, moonLongitude: number): "north" | "south" {
  const node = calcAt(jd, swisseph.SE_TRUE_NODE).longitude;
  return angDist(moonLongitude, node) <= angDist(moonLongitude, node + 180) ? "north" : "south";
}

// How far either side of today to scan, in days. An eclipse family runs about eighteen months and
// the reading wants the whole story around this date, so ~2.5 years each way comfortably covers the
// current series plus the one before and after it.
const SPAN_DAYS = 950;

export async function GET(request: NextRequest) {
  const anchorParam = request.nextUrl.searchParams.get("around");
  const anchor = anchorParam && /^\d{4}-\d{2}-\d{2}$/.test(anchorParam)
    ? DateTime.fromISO(anchorParam, { zone: "utc" })
    : DateTime.utc();
  if (!anchor.isValid) return NextResponse.json({ error: "bad date" }, { status: 400 });

  const centreJd = swisseph.swe_julday(
    anchor.year, anchor.month, anchor.day, 0, swisseph.SE_GREG_CAL
  ) as unknown as number;
  const startJd = centreJd - SPAN_DAYS;

  const phaseAngle = (jd: number) => {
    const sun = calcAt(jd, swisseph.SE_SUN);
    const moon = calcAt(jd, swisseph.SE_MOON);
    return (moon.longitude - sun.longitude + 360) % 360;
  };

  // Bisect the daily crossing down to the exact moment of the lunation, so the published date is
  // never rounded a day late.
  const refine = (lo: number, hi: number, target: number): number => {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const diff = ((phaseAngle(mid) - target + 540) % 360) - 180;
      if (diff < 0) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };

  const eclipses: EclipseEvent[] = [];
  let prevAngle = phaseAngle(startJd);

  for (let d = 1; d <= SPAN_DAYS * 2; d++) {
    const jd = startJd + d;
    const angle = phaseAngle(jd);

    // New moon within the solar ecliptic limit is a solar eclipse.
    if (prevAngle > 300 && angle < 60) {
      const exact = refine(jd - 1, jd, 0);
      const moon = calcAt(exact, swisseph.SE_MOON);
      if (distanceToNode(exact, moon.longitude) <= 17) {
        const { sign, degree } = signAt(moon.longitude);
        eclipses.push({
          type: "solar_eclipse",
          date: jdToIso(exact),
          sign,
          degree,
          nodeEnd: nodeEndFor(exact, moon.longitude),
        });
      }
    }
    // Full moon within the (tighter) lunar ecliptic limit is a lunar eclipse.
    if (prevAngle < 180 && angle >= 180) {
      const exact = refine(jd - 1, jd, 180);
      const moon = calcAt(exact, swisseph.SE_MOON);
      if (distanceToNode(exact, moon.longitude) <= 12) {
        const { sign, degree } = signAt(moon.longitude);
        eclipses.push({
          type: "lunar_eclipse",
          date: jdToIso(exact),
          sign,
          degree,
          nodeEnd: nodeEndFor(exact, moon.longitude),
        });
      }
    }

    prevAngle = angle;
  }

  eclipses.sort((a, b) => a.date.localeCompare(b.date));
  return NextResponse.json({ eclipses });
}
