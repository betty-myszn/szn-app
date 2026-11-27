import { NextRequest, NextResponse } from "next/server";
import swisseph from "swisseph";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

swisseph.swe_set_ephe_path(path.join(process.cwd(), "ephe"));

// Two jobs for the power places page, both pure maths on numbers the browser already has (no
// personal data is stored or looked up here):
//  relocate: her birth moment redrawn for another place, Placidus like her natal chart, so the page
//            can say which house each planet moves into if she lives there.
//  solarReturn: the exact moment of her next birthday (the Sun back on its natal degree) and where every
//            planet is at that moment, so the page can draw her birthday chart's lines and say where on
//            earth to be for it. The moment is the same everywhere; WHERE she is changes the chart's angles.
//  timing:   when the slow planets touch her natal planets over the next year, which is when the
//            lines of that natal planet are switched on everywhere on her map.

const SLOW = [
  { name: "Jupiter", id: swisseph.SE_JUPITER, aspects: [0, 60, 120, 180] },
  { name: "Saturn", id: swisseph.SE_SATURN, aspects: [0, 90, 180] },
  { name: "Uranus", id: swisseph.SE_URANUS, aspects: [0, 90, 120, 180] },
  { name: "Neptune", id: swisseph.SE_NEPTUNE, aspects: [0, 120] },
  { name: "Pluto", id: swisseph.SE_PLUTO, aspects: [0, 90, 180] },
];
const NATAL = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const ORB = 1.5;
const DAY_MS = 86400000;

const sep = (a: number, b: number) => { const d = Math.abs(((a - b) % 360) + 360) % 360; return d > 180 ? 360 - d : d; };
const jdOf = (t: number) => t / DAY_MS + 2440587.5;
const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);

function houseOf(lon: number, cusps: number[]) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    const span = ((b - a) % 360 + 360) % 360, off = ((lon - a) % 360 + 360) % 360;
    if (off < span) return i + 1;
  }
  return 1;
}

type Planet = { name: string; longitude: number; house?: number };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planets: Planet[] = Array.isArray(body.planets) ? body.planets.filter((p: Planet) => NATAL.includes(p.name) && Number.isFinite(p.longitude)) : [];
    if (!planets.length) return NextResponse.json({ error: "planets required" }, { status: 400 });

    if (body.action === "relocate") {
      const { julianDay, lat, lon } = body;
      if (![julianDay, lat, lon].every(Number.isFinite) || Math.abs(lat) > 89 || Math.abs(lon) > 180) {
        return NextResponse.json({ error: "julianDay, lat and lon required" }, { status: 400 });
      }
      const h = swisseph.swe_houses(julianDay, lat, lon, "P") as { house: number[]; ascendant: number; mc: number };
      const cusps = h.house.slice(0, 12);
      return NextResponse.json({
        ascendant: h.ascendant,
        mc: h.mc,
        planets: planets.map((p) => ({ name: p.name, natalHouse: p.house ?? null, house: houseOf(p.longitude, cusps) })),
      });
    }

    if (body.action === "solarReturn") {
      const sun = planets.find((p) => p.name === "Sun");
      if (!sun) return NextResponse.json({ error: "Sun required" }, { status: 400 });
      const flags = swisseph.SEFLG_SWIEPH;
      const sunAt = (jd: number) => (swisseph.swe_calc_ut(jd, swisseph.SE_SUN, flags) as { longitude: number }).longitude;
      // Start from yesterday so a birthday later today still counts, then walk to the moment the Sun
      // is exactly back on her natal degree (Newton steps on the Sun's ~0.9856°/day motion).
      let jd = jdOf(Date.now() - DAY_MS);
      jd += (((sun.longitude - sunAt(jd)) % 360) + 360) % 360 / 0.9856;
      for (let i = 0; i < 8; i++) { let d = sun.longitude - sunAt(jd); d = ((d + 540) % 360) - 180; jd += d / 0.9856; if (Math.abs(d) < 1e-7) break; }
      const BODIES: [string, number][] = [["Sun", swisseph.SE_SUN], ["Moon", swisseph.SE_MOON], ["Mercury", swisseph.SE_MERCURY], ["Venus", swisseph.SE_VENUS], ["Mars", swisseph.SE_MARS], ["Jupiter", swisseph.SE_JUPITER], ["Saturn", swisseph.SE_SATURN], ["Uranus", swisseph.SE_URANUS], ["Neptune", swisseph.SE_NEPTUNE], ["Pluto", swisseph.SE_PLUTO], ["North Node", swisseph.SE_TRUE_NODE], ["Chiron", swisseph.SE_CHIRON], ["Lilith", swisseph.SE_MEAN_APOG]];
      const out = BODIES.map(([name, id]) => { const r = swisseph.swe_calc_ut(jd, id, flags) as { longitude: number; latitude: number }; return { name, longitude: r.longitude, latitude: r.latitude || 0 }; });
      const utc = new Date((jd - 2440587.5) * DAY_MS).toISOString();
      return NextResponse.json({ julianDay: jd, utc, planets: out }, { headers: { "Cache-Control": "private, max-age=3600" } });
    }

    if (body.action === "timing") {
      // Step every 2 days from 60 days ago to a year ahead (the slowest of these moves under a
      // tenth of a degree a day, so 2 days never skips a 1.5° orb), then merge passes of the same
      // contact that sit within 45 days of each other, so a retrograde back-and-forth reads as one window.
      const start = Date.now() - 60 * DAY_MS, end = Date.now() + 365 * DAY_MS, step = 2 * DAY_MS;
      const flags = swisseph.SEFLG_SWIEPH;
      const pos: Record<string, number[]> = {};
      const times: number[] = [];
      for (let t = start; t <= end; t += step) times.push(t);
      for (const s of SLOW) pos[s.name] = times.map((t) => (swisseph.swe_calc_ut(jdOf(t), s.id, flags) as { longitude: number }).longitude);

      const windows: { transit: string; aspect: number; natal: string; start: string; end: string; exact: string }[] = [];
      for (const s of SLOW) for (const p of planets) for (const asp of s.aspects) {
        if (s.name === p.name && asp === 0) continue; // a planet on itself is a return, read elsewhere
        let cur: { a: number; b: number; best: number; bestOrb: number } | null = null;
        const flush = () => {
          if (!cur) return;
          const prev = windows[windows.length - 1];
          if (prev && prev.transit === s.name && prev.natal === p.name && prev.aspect === asp && cur.a - Date.parse(prev.end) < 45 * DAY_MS) {
            prev.end = isoDay(times[cur.b]);
          } else {
            windows.push({ transit: s.name, aspect: asp, natal: p.name, start: isoDay(times[cur.a]), end: isoDay(times[cur.b]), exact: isoDay(times[cur.best]) });
          }
          cur = null;
        };
        pos[s.name].forEach((lon, i) => {
          const orb = Math.abs(sep(lon, p.longitude) - asp);
          if (orb <= ORB) {
            if (!cur) cur = { a: i, b: i, best: i, bestOrb: orb };
            else { cur.b = i; if (orb < cur.bestOrb) { cur.best = i; cur.bestOrb = orb; } }
          } else flush();
        });
        flush();
      }
      const today = isoDay(Date.now());
      const live = windows.filter((w) => w.end >= today).sort((a, b) => a.start.localeCompare(b.start));
      return NextResponse.json({ today, windows: live }, { headers: { "Cache-Control": "private, max-age=3600" } });
    }

    return NextResponse.json({ error: "unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Power places error:", error);
    return NextResponse.json({ error: "Failed to work it out" }, { status: 500 });
  }
}
