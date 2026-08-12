import { NextResponse } from "next/server";
import swisseph from "swisseph";
import path from "path";
import { DateTime } from "luxon";
import { ZODIAC_SIGNS } from "@/types/chart";
import { SKY_ZONE } from "@/lib/sky-zone";

const EPHE_PATH = path.join(process.cwd(), "ephe");
swisseph.swe_set_ephe_path(EPHE_PATH);

export const runtime = "nodejs";

interface CalendarEvent {
  type:
    | "new_moon"
    | "full_moon"
    | "solar_eclipse"
    | "lunar_eclipse"
    | "retrograde_start"
    | "retrograde_end"
    | "node_ingress";
  date: string; // ISO date
  sign: string;
  degree: number;
  planet?: string;
  nodeEnd?: "north" | "south"; // eclipses only: which end of the nodal axis the eclipse sits on
}

// The slower, further-out stuff: outer planet sign changes, outer planet retrograde stations,
// and major aspects between outer planets, the "this is a whole year theme, not a today thing"
// tier of transit. Scanned across a year ahead rather than the 60-day window above.
interface MajorTransit {
  type: "ingress" | "retrograde_start" | "retrograde_end" | "aspect";
  date: string;
  planet: string;
  sign?: string; // for ingress, and the sign the planet is standing in for retrograde events
  otherPlanet?: string; // for aspect
  aspectType?: "conjunction" | "sextile" | "square" | "trine" | "opposition";
}

const OUTER_BODIES: { name: string; id: number }[] = [
  { name: "Venus", id: swisseph.SE_VENUS },
  { name: "Mars", id: swisseph.SE_MARS },
  { name: "Jupiter", id: swisseph.SE_JUPITER },
  { name: "Saturn", id: swisseph.SE_SATURN },
  { name: "Uranus", id: swisseph.SE_URANUS },
  { name: "Neptune", id: swisseph.SE_NEPTUNE },
  { name: "Pluto", id: swisseph.SE_PLUTO },
];

// Only the slowest bodies get ingress tracking, Venus/Mars change signs too often to be "a
// whole year's theme", they're already covered by natal-chart-relative content elsewhere.
const INGRESS_BODIES = OUTER_BODIES.filter((b) => !["Venus", "Mars"].includes(b.name)).concat([
  { name: "Chiron", id: swisseph.SE_CHIRON },
]);

const MAJOR_ASPECT_PAIRS: [string, number, string, number][] = [
  ["Jupiter", swisseph.SE_JUPITER, "Saturn", swisseph.SE_SATURN],
  ["Saturn", swisseph.SE_SATURN, "Uranus", swisseph.SE_URANUS],
  ["Saturn", swisseph.SE_SATURN, "Neptune", swisseph.SE_NEPTUNE],
  ["Saturn", swisseph.SE_SATURN, "Pluto", swisseph.SE_PLUTO],
  ["Jupiter", swisseph.SE_JUPITER, "Pluto", swisseph.SE_PLUTO],
  ["Jupiter", swisseph.SE_JUPITER, "Uranus", swisseph.SE_URANUS],
  ["Jupiter", swisseph.SE_JUPITER, "Neptune", swisseph.SE_NEPTUNE],
  ["Uranus", swisseph.SE_URANUS, "North Node", swisseph.SE_TRUE_NODE],
  ["Jupiter", swisseph.SE_JUPITER, "North Node", swisseph.SE_TRUE_NODE],
  ["Saturn", swisseph.SE_SATURN, "North Node", swisseph.SE_TRUE_NODE],
];

const ASPECT_TARGETS: { angle: number; type: MajorTransit["aspectType"] }[] = [
  { angle: 0, type: "conjunction" },
  { angle: 60, type: "sextile" },
  { angle: 90, type: "square" },
  { angle: 120, type: "trine" },
  { angle: 180, type: "opposition" },
];

function calcAt(jd: number, body: number): { longitude: number; speed: number } {
  const r = swisseph.swe_calc_ut(jd, body, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED) as {
    longitude: number;
    longitudeSpeed: number;
  };
  return { longitude: r.longitude, speed: r.longitudeSpeed };
}

function jdToIso(jd: number): string {
  // JD 2440587.5 = 1970-01-01T00:00Z. Dates are published in SKY_ZONE, not UTC, see that module
  // for why, anything rendering these strings has to measure "today" the same way.
  return DateTime.fromMillis((jd - 2440587.5) * 86400000, { zone: SKY_ZONE }).toISODate() ?? "";
}

function signAt(longitude: number): { sign: string; degree: number } {
  const norm = ((longitude % 360) + 360) % 360;
  const idx = Math.floor(norm / 30);
  return { sign: ZODIAC_SIGNS[idx], degree: Math.floor(norm - idx * 30) };
}

// Angular distance from the moon to the nearest lunar node (0–90°), used to classify a
// lunation as an eclipse: new moons within ~17° of a node are solar eclipses, full moons
// within ~12° are lunar eclipses (standard ecliptic-limit approximations).
function distanceToNode(jd: number, moonLongitude: number): number {
  const node = calcAt(jd, swisseph.SE_TRUE_NODE);
  const diff = Math.abs(((moonLongitude - node.longitude + 540) % 360) - 180);
  return Math.min(diff, 180 - diff);
}

// Which end of the nodal axis a lunation sits on: nearer the true (north) node, or nearer the point
// opposite it, the south node. This is what tells the eclipse reading whether it is a north-node
// (growth) or south-node (release) eclipse, computed at eclipse time so it stays correct even in the
// days around a node ingress when "the north node now" would give the wrong sign.
function angDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
function nodeEndFor(jd: number, moonLongitude: number): "north" | "south" {
  const node = calcAt(jd, swisseph.SE_TRUE_NODE).longitude;
  return angDist(moonLongitude, node) <= angDist(moonLongitude, node + 180) ? "north" : "south";
}

// 0–180° separation between two bodies, direction-agnostic, for detecting aspect crossings.
function angularSeparation(jd: number, idA: number, idB: number): number {
  const a = calcAt(jd, idA).longitude;
  const b = calcAt(jd, idB).longitude;
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function refineSeparation(idA: number, idB: number, lo: number, hi: number, target: number): number {
  const f = (jd: number) => angularSeparation(jd, idA, idB) - target;
  const signLo = f(lo) < 0;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if ((f(mid) < 0) === signLo) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Scans a year ahead, coarse 2-day steps since these bodies move slowly, for outer planet sign
// ingresses, outer planet retrograde stations, and major aspects between outer planets, the
// "whole year's theme" tier of transit rather than day-to-day sky weather.
function scanMajorTransits(startJd: number): MajorTransit[] {
  const events: MajorTransit[] = [];
  const step = 2;
  const days = 400;

  const prevIngressSign: Record<string, number> = {};
  for (const body of INGRESS_BODIES) {
    prevIngressSign[body.name] = Math.floor((((calcAt(startJd, body.id).longitude % 360) + 360) % 360) / 30);
  }
  const prevRetroSpeed: Record<string, number> = {};
  for (const body of OUTER_BODIES) {
    prevRetroSpeed[body.name] = calcAt(startJd, body.id).speed;
  }
  const prevSep: Record<string, number> = {};
  for (const [nameA, idA, nameB, idB] of MAJOR_ASPECT_PAIRS) {
    prevSep[`${nameA}-${nameB}`] = angularSeparation(startJd, idA, idB);
  }

  for (let d = step; d <= days; d += step) {
    const jd = startJd + d;

    for (const body of INGRESS_BODIES) {
      const lon = ((calcAt(jd, body.id).longitude % 360) + 360) % 360;
      const signIndex = Math.floor(lon / 30);
      if (signIndex !== prevIngressSign[body.name]) {
        const { sign } = signAt(lon);
        events.push({ type: "ingress", date: jdToIso(jd), planet: body.name, sign });
        prevIngressSign[body.name] = signIndex;
      }
    }

    for (const body of OUTER_BODIES) {
      const point = calcAt(jd, body.id);
      const { sign } = signAt(point.longitude);
      if (prevRetroSpeed[body.name] >= 0 && point.speed < 0) {
        events.push({ type: "retrograde_start", date: jdToIso(jd), planet: body.name, sign });
      }
      if (prevRetroSpeed[body.name] < 0 && point.speed >= 0) {
        events.push({ type: "retrograde_end", date: jdToIso(jd), planet: body.name, sign });
      }
      prevRetroSpeed[body.name] = point.speed;
    }

    for (const [nameA, idA, nameB, idB] of MAJOR_ASPECT_PAIRS) {
      const key = `${nameA}-${nameB}`;
      const sep = angularSeparation(jd, idA, idB);
      for (const { angle, type } of ASPECT_TARGETS) {
        const wasBelow = prevSep[key] < angle;
        const isBelow = sep < angle;
        if (wasBelow !== isBelow) {
          const exact = refineSeparation(idA, idB, jd - step, jd, angle);
          events.push({ type: "aspect", date: jdToIso(exact), planet: nameA, otherPlanet: nameB, aspectType: type });
        }
      }
      prevSep[key] = sep;
    }
  }

  events.sort((a, b) => a.date.localeCompare(b.date));
  return events;
}

// Scan ~60 days from today for lunations (flagging eclipses), Mercury stations and nodal
// axis sign changes, stepping daily and bisecting to refine each crossing to under an hour.
export async function GET() {
  const now = DateTime.utc();
  const startJd = swisseph.swe_julday(
    now.year, now.month, now.day, 0, swisseph.SE_GREG_CAL
  ) as unknown as number;

  const events: CalendarEvent[] = [];
  const phaseAngle = (jd: number) => {
    const sun = calcAt(jd, swisseph.SE_SUN);
    const moon = calcAt(jd, swisseph.SE_MOON);
    return ((moon.longitude - sun.longitude + 360) % 360);
  };

  const refine = (lo: number, hi: number, target: number): number => {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const diff = (phaseAngle(mid) - target + 540) % 360 - 180;
      if (diff < 0) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };

  let prevAngle = phaseAngle(startJd);
  let prevMercurySpeed = calcAt(startJd, swisseph.SE_MERCURY).speed;
  // True node for ingress detection, matching the eclipse classification above and everyone's
  // natal chart, both of which read SE_TRUE_NODE. The mean node is a smoothed average that can
  // sit more than a degree off the real axis and reach a cusp weeks late, e.g. it puts the 2026
  // Aquarius ingress on 19 August, three weeks after the true node crossed and a week after the
  // 12 August eclipse that the new Leo/Aquarius axis is what produced.
  const NODE_BODY = swisseph.SE_TRUE_NODE;
  const nodeSignIndexAt = (jd: number) =>
    Math.floor(((((calcAt(jd, NODE_BODY).longitude % 360) + 360) % 360)) / 30);
  let prevNodeSignIndex = nodeSignIndexAt(startJd);
  // Raw crossings, held back from `events` until the reversal collapse after the loop.
  const nodeIngresses: { fromSignIndex: number; toSignIndex: number; event: CalendarEvent }[] = [];

  // The daily scan only narrows a crossing to "somewhere in the last 24 hours", which rounds the
  // announced date up to a day late. Bisect for the moment the node actually changed sign.
  const refineNodeIngress = (lo: number, hi: number, toSignIndex: number): number => {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (nodeSignIndexAt(mid) === toSignIndex) hi = mid;
      else lo = mid;
    }
    return hi;
  };

  for (let d = 1; d <= 60; d++) {
    const jd = startJd + d;
    const angle = phaseAngle(jd);

    // New moon: angle crosses 0 (wraps 360 → 0). Within node orb it's a solar eclipse.
    if (prevAngle > 300 && angle < 60) {
      const exact = refine(jd - 1, jd, 0);
      const moon = calcAt(exact, swisseph.SE_MOON);
      const { sign, degree } = signAt(moon.longitude);
      const isEclipse = distanceToNode(exact, moon.longitude) <= 17;
      events.push({
        type: isEclipse ? "solar_eclipse" : "new_moon",
        date: jdToIso(exact),
        sign,
        degree,
        ...(isEclipse ? { nodeEnd: nodeEndFor(exact, moon.longitude) } : {}),
      });
    }
    // Full moon: angle crosses 180. Within node orb it's a lunar eclipse.
    if (prevAngle < 180 && angle >= 180) {
      const exact = refine(jd - 1, jd, 180);
      const moon = calcAt(exact, swisseph.SE_MOON);
      const { sign, degree } = signAt(moon.longitude);
      const isEclipse = distanceToNode(exact, moon.longitude) <= 12;
      events.push({
        type: isEclipse ? "lunar_eclipse" : "full_moon",
        date: jdToIso(exact),
        sign,
        degree,
        ...(isEclipse ? { nodeEnd: nodeEndFor(exact, moon.longitude) } : {}),
      });
    }

    // Mercury stations
    const mercury = calcAt(jd, swisseph.SE_MERCURY);
    if (prevMercurySpeed >= 0 && mercury.speed < 0) {
      const { sign, degree } = signAt(mercury.longitude);
      events.push({ type: "retrograde_start", date: jdToIso(jd), sign, degree, planet: "Mercury" });
    }
    if (prevMercurySpeed < 0 && mercury.speed >= 0) {
      const { sign, degree } = signAt(mercury.longitude);
      events.push({ type: "retrograde_end", date: jdToIso(jd), sign, degree, planet: "Mercury" });
    }
    prevMercurySpeed = mercury.speed;

    // Nodal axis ingress: the node backing into a new sign shifts the collective north/south
    // node axis for the next ~18 months, a genuinely big deal.
    const nodeSignIndex = nodeSignIndexAt(jd);
    if (nodeSignIndex !== prevNodeSignIndex) {
      const exact = refineNodeIngress(jd - 1, jd, nodeSignIndex);
      const { sign, degree } = signAt(calcAt(exact, NODE_BODY).longitude);
      nodeIngresses.push({
        fromSignIndex: prevNodeSignIndex,
        toSignIndex: nodeSignIndex,
        event: { type: "node_ingress", date: jdToIso(exact), sign, degree, planet: "North Node" },
      });
      prevNodeSignIndex = nodeSignIndex;
    }

    prevAngle = angle;
  }

  // The true node oscillates rather than moving steadily, so it can in principle nick a cusp and
  // cross straight back. That is wobble, not an axis shift, so drop both halves of any such pair
  // rather than announcing a once-in-18-months event twice. Empirically the true node crosses
  // cleanly every time between 2015 and 2035, so this is a guard, not a routine correction.
  for (let i = 0; i < nodeIngresses.length - 1; ) {
    if (nodeIngresses[i].fromSignIndex === nodeIngresses[i + 1].toSignIndex) {
      nodeIngresses.splice(i, 2);
      if (i > 0) i--;
    } else {
      i++;
    }
  }
  events.push(...nodeIngresses.map((n) => n.event));

  events.sort((a, b) => a.date.localeCompare(b.date));
  const majorTransits = scanMajorTransits(startJd);

  // Shadow period: the forward scan above only ever catches a Mercury retrograde_end that
  // hasn't happened yet, so "just came out of retrograde" is invisible to it. Mercury is still
  // retracing the same degrees for ~2 weeks either side of a station, worth flagging even once
  // it's technically direct again. Only Mercury's stations need looking backward for, so this
  // stays a small dedicated scan rather than re-running the whole 60-day event loop in reverse.
  const SHADOW_WINDOW_DAYS = 14;
  let mercuryShadow: { phase: "pre" | "post"; date: string; sign: string; degree: number } | null = null;
  let prevMercurySpeedBack = calcAt(startJd, swisseph.SE_MERCURY).speed;
  for (let d = -1; d >= -SHADOW_WINDOW_DAYS; d--) {
    const jd = startJd + d;
    const mercury = calcAt(jd, swisseph.SE_MERCURY);
    // Walking backward in time, speed going from direct to retrograde means the station in
    // between (at jd+1) was actually a retrograde_end when read forward in time.
    if (prevMercurySpeedBack >= 0 && mercury.speed < 0) {
      const { sign, degree } = signAt(calcAt(jd + 1, swisseph.SE_MERCURY).longitude);
      mercuryShadow = { phase: "post", date: jdToIso(jd + 1), sign, degree };
      break;
    }
    prevMercurySpeedBack = mercury.speed;
  }
  if (!mercuryShadow) {
    const upcomingStart = events.find((e) => e.type === "retrograde_start" && e.planet === "Mercury");
    if (upcomingStart) {
      const daysAway = Math.round(
        DateTime.fromISO(upcomingStart.date).diff(DateTime.utc().startOf("day"), "days").days
      );
      if (daysAway <= SHADOW_WINDOW_DAYS) {
        mercuryShadow = { phase: "pre", date: upcomingStart.date, sign: upcomingStart.sign, degree: upcomingStart.degree };
      }
    }
  }

  // Note whether Mercury is currently retrograde, and where the nodal axis sits today
  const mercuryNow = calcAt(startJd, swisseph.SE_MERCURY);
  const nodeNow = signAt(((calcAt(startJd, swisseph.SE_TRUE_NODE).longitude % 360) + 360) % 360);

  // Eclipse season = the Sun is within the solar ecliptic limit (~18°) of a lunar node right now,
  // the ~34-day window in which eclipses are actually possible. The old check flagged it whenever
  // any eclipse fell in the next 60 days, so it read "eclipse season right now" up to two months
  // early. 18° of solar motion ≈ 18 days either side of the node, matching the real season length.
  const sunNow = calcAt(startJd, swisseph.SE_SUN);
  const eclipseSeason = distanceToNode(startJd, sunNow.longitude) <= 18;

  return NextResponse.json(
    {
      events,
      majorTransits,
      mercuryRetrogradeNow: mercuryNow.speed < 0,
      mercuryShadow,
      northNodeNow: nodeNow.sign,
      eclipseSeason,
    },
    { headers: { "Cache-Control": "public, max-age=21600" } }
  );
}
