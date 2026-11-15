import swisseph from "swisseph";
import path from "path";
import { DateTime } from "luxon";
import {
  type PlanetPosition,
  type HouseCusp,
  type Aspect,
  type AspectType,
  type PlanetaryRulership,
  type ChartData,
  type BirthData,
  type LilithPoint,
  type LilithAspect,
  type LilithId,
  ZODIAC_SIGNS,
  ASPECT_CONFIG,
} from "@/types/chart";

const EPHE_PATH = path.join(process.cwd(), "ephe");
swisseph.swe_set_ephe_path(EPHE_PATH);

const PLANETS = [
  { id: "sun", name: "Sun", swissId: swisseph.SE_SUN },
  { id: "moon", name: "Moon", swissId: swisseph.SE_MOON },
  { id: "mercury", name: "Mercury", swissId: swisseph.SE_MERCURY },
  { id: "venus", name: "Venus", swissId: swisseph.SE_VENUS },
  { id: "mars", name: "Mars", swissId: swisseph.SE_MARS },
  { id: "jupiter", name: "Jupiter", swissId: swisseph.SE_JUPITER },
  { id: "saturn", name: "Saturn", swissId: swisseph.SE_SATURN },
  { id: "uranus", name: "Uranus", swissId: swisseph.SE_URANUS },
  { id: "neptune", name: "Neptune", swissId: swisseph.SE_NEPTUNE },
  { id: "pluto", name: "Pluto", swissId: swisseph.SE_PLUTO },
  { id: "chiron", name: "Chiron", swissId: swisseph.SE_CHIRON },
  { id: "north_node", name: "North Node", swissId: swisseph.SE_TRUE_NODE },
  { id: "lilith", name: "Lilith", swissId: swisseph.SE_MEAN_APOG },
];

// The four Liliths. Mean Black Moon is also in PLANETS (it drives the rest of the app); the others
// only live in chart.liliths so they never change the wheel, aspects grid or synthesis.
// Asteroid 1181 needs ephe/ast1/se01181s.se1; without that file it is skipped, never faked.
// Dark Moon is Waldemath's hypothetical second moon, from the elements in ephe/seorbel.txt.
const LILITH_POINTS: { id: LilithId; name: string; swissId: number }[] = [
  { id: "lilith", name: "Black Moon Lilith", swissId: swisseph.SE_MEAN_APOG },
  { id: "true_lilith", name: "True Lilith", swissId: swisseph.SE_OSCU_APOG },
  { id: "asteroid_lilith", name: "Asteroid Lilith", swissId: swisseph.SE_AST_OFFSET + 1181 },
  { id: "dark_moon_lilith", name: "Dark Moon Lilith", swissId: swisseph.SE_WALDEMATH },
];

// Lilith is a sensitive point, not a planet, so her aspects get tighter orbs than planet-to-planet.
const LILITH_ORBS: Record<string, number> = {
  conjunction: 5,
  opposition: 5,
  square: 4,
  trine: 4,
  sextile: 3,
};
const LILITH_ASPECT_TARGETS = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn",
  "uranus", "neptune", "pluto", "chiron", "north_node",
];

function lilithAspects(
  lng: number,
  planets: PlanetPosition[],
  angles: { name: string; longitude: number }[],
): LilithAspect[] {
  const targets = [
    ...planets
      .filter((p) => LILITH_ASPECT_TARGETS.includes(p.id))
      .map((p) => ({ name: p.name, longitude: p.longitude })),
    ...angles,
  ];
  const out: LilithAspect[] = [];
  for (const t of targets) {
    let diff = Math.abs(lng - t.longitude);
    if (diff > 180) diff = 360 - diff;
    for (const [type, config] of Object.entries(ASPECT_CONFIG) as [AspectType, { angle: number }][]) {
      const orb = Math.abs(diff - config.angle);
      if (orb <= LILITH_ORBS[type]) {
        out.push({ body: t.name, type, orb: Math.round(orb * 10) / 10 });
        break;
      }
    }
  }
  return out.sort((a, b) => a.orb - b.orb);
}

const RULERSHIPS: PlanetaryRulership[] = [
  { sign: "Aries", traditionalRuler: "Mars", modernRuler: "Mars" },
  { sign: "Taurus", traditionalRuler: "Venus", modernRuler: "Venus" },
  { sign: "Gemini", traditionalRuler: "Mercury", modernRuler: "Mercury" },
  { sign: "Cancer", traditionalRuler: "Moon", modernRuler: "Moon" },
  { sign: "Leo", traditionalRuler: "Sun", modernRuler: "Sun" },
  { sign: "Virgo", traditionalRuler: "Mercury", modernRuler: "Mercury" },
  { sign: "Libra", traditionalRuler: "Venus", modernRuler: "Venus" },
  { sign: "Scorpio", traditionalRuler: "Mars", modernRuler: "Pluto" },
  { sign: "Sagittarius", traditionalRuler: "Jupiter", modernRuler: "Jupiter" },
  { sign: "Capricorn", traditionalRuler: "Saturn", modernRuler: "Saturn" },
  { sign: "Aquarius", traditionalRuler: "Saturn", modernRuler: "Uranus" },
  { sign: "Pisces", traditionalRuler: "Jupiter", modernRuler: "Neptune" },
];

function longitudeToSign(longitude: number): {
  sign: string;
  signIndex: number;
  degree: number;
  minute: number;
  second: number;
  formattedDegree: string;
} {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized - signIndex * 30;
  const degree = Math.floor(signDegree);
  const minuteFloat = (signDegree - degree) * 60;
  const minute = Math.floor(minuteFloat);
  const second = Math.floor((minuteFloat - minute) * 60);
  const sign = ZODIAC_SIGNS[signIndex];
  const formattedDegree = `${degree}°${sign.substring(0, 3)} ${minute}'${second}"`;

  return { sign, signIndex, degree, minute, second, formattedDegree };
}

function findHouse(longitude: number, cusps: number[]): number {
  const normalized = ((longitude % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const nextI = (i + 1) % 12;
    const cuspStart = cusps[i];
    const cuspEnd = cusps[nextI];

    if (cuspEnd < cuspStart) {
      if (normalized >= cuspStart || normalized < cuspEnd) {
        return i + 1;
      }
    } else {
      if (normalized >= cuspStart && normalized < cuspEnd) {
        return i + 1;
      }
    }
  }
  return 1;
}

function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const aspectTypes = Object.entries(ASPECT_CONFIG) as [
    AspectType,
    (typeof ASPECT_CONFIG)[AspectType],
  ][];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const [type, config] of aspectTypes) {
        const orb = Math.abs(diff - config.angle);
        if (orb <= config.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type,
            angle: config.angle,
            orb: Math.round(orb * 100) / 100,
            applying: isApplying(p1.longitude, p1.longitudeSpeed, p2.longitude, p2.longitudeSpeed, config.angle),
          });
          break;
        }
      }
    }
  }

  return aspects;
}

// An aspect is applying when its orb is closing, which depends on the two bodies' relative motion,
// not on whether the current separation happens to be under the exact angle. Needs both speeds; if
// either is unknown (a derived point like Part of Fortune) we can't tell, so report separating.
// For a transit to a natal point, pass 0 as the natal speed since natal positions are fixed.
export function isApplying(
  lon1: number,
  spd1: number | undefined,
  lon2: number,
  spd2: number | undefined,
  angle: number,
): boolean {
  if (spd1 === undefined || spd2 === undefined) return false;
  // Signed separation in (-180, 180].
  const delta = (((lon1 - lon2 + 540) % 360) - 180);
  // Rate of change of the absolute separation.
  const dAbs = Math.sign(delta) * (spd1 - spd2);
  // Signed distance of the current separation from exact.
  const g = Math.abs(delta) - angle;
  // Orb is closing when g and its rate of change pull toward zero, i.e. have opposite signs.
  return g * dAbs < 0;
}

export function birthDataToUtc(birthData: BirthData): {
  utcDateTime: DateTime;
  localDateTime: DateTime;
} {
  const { dateOfBirth, birthTime, location } = birthData;
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);

  const localDateTime = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone: location.timezone }
  );

  if (!localDateTime.isValid) {
    throw new Error(
      `Invalid date/time for timezone ${location.timezone}: ${localDateTime.invalidExplanation}`
    );
  }

  const utcDateTime = localDateTime.toUTC();

  return { utcDateTime, localDateTime };
}

export function calculateChart(birthData: BirthData): ChartData {
  const { utcDateTime, localDateTime } = birthDataToUtc(birthData);

  const year = utcDateTime.year;
  const month = utcDateTime.month;
  const day = utcDateTime.day;
  const hour =
    utcDateTime.hour +
    utcDateTime.minute / 60 +
    utcDateTime.second / 3600;

  const julianDay = swisseph.swe_julday(
    year,
    month,
    day,
    hour,
    swisseph.SE_GREG_CAL
  ) as unknown as number;

  const houseResult = swisseph.swe_houses(
    julianDay,
    birthData.location.latitude,
    birthData.location.longitude,
    "P" // Placidus
  ) as { house: number[]; ascendant: number; mc: number };

  const cusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    cusps.push(houseResult.house[i]);
  }

  const ascendant = houseResult.ascendant;
  const midheaven = houseResult.mc;

  const planets: PlanetPosition[] = [];
  const flags =
    swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;

  for (const planet of PLANETS) {
    const result = swisseph.swe_calc_ut(julianDay, planet.swissId, flags) as {
      longitude: number;
      latitude: number;
      longitudeSpeed: number;
    };

    const lng = result.longitude;
    const lat = result.latitude;
    const speedLng = result.longitudeSpeed;
    const retrograde = speedLng < 0;

    const signData = longitudeToSign(lng);
    const house = findHouse(lng, cusps);

    planets.push({
      id: planet.id,
      name: planet.name,
      longitude: lng,
      latitude: lat,
      ...signData,
      house,
      retrograde,
      longitudeSpeed: speedLng,
    });
  }

  // South Node is opposite North Node
  const northNode = planets.find((p) => p.id === "north_node")!;
  const southNodeLng = (northNode.longitude + 180) % 360;
  const southSignData = longitudeToSign(southNodeLng);
  const southHouse = findHouse(southNodeLng, cusps);

  planets.push({
    id: "south_node",
    name: "South Node",
    longitude: southNodeLng,
    latitude: 0,
    ...southSignData,
    house: southHouse,
    retrograde: northNode.retrograde,
    longitudeSpeed: northNode.longitudeSpeed === undefined ? undefined : -northNode.longitudeSpeed,
  });

  // Part of Fortune: sect-aware (day chart Asc + Moon − Sun; night chart Asc + Sun − Moon).
  // Day chart = Sun above the horizon (houses 7–12).
  const sun = planets.find((p) => p.id === "sun")!;
  const moon = planets.find((p) => p.id === "moon")!;
  const isDayChart = sun.house >= 7;
  const fortuneLng =
    ((isDayChart
      ? ascendant + moon.longitude - sun.longitude
      : ascendant + sun.longitude - moon.longitude) %
      360 +
      360) %
    360;
  const fortuneSignData = longitudeToSign(fortuneLng);

  planets.push({
    id: "part_of_fortune",
    name: "Part of Fortune",
    longitude: fortuneLng,
    latitude: 0,
    ...fortuneSignData,
    house: findHouse(fortuneLng, cusps),
    retrograde: false,
  });

  const houses: HouseCusp[] = cusps.map((cusp, i) => {
    const signData = longitudeToSign(cusp);
    return {
      house: i + 1,
      longitude: cusp,
      sign: signData.sign,
      degree: signData.degree,
      minute: signData.minute,
      formattedDegree: signData.formattedDegree,
    };
  });

  const aspects = calculateAspects(planets);

  // Angles only count when the birth time is trusted; an approximate time moves them too far.
  const angles = birthData.birthTimeApproximate
    ? []
    : [
        { name: "Ascendant", longitude: ascendant },
        { name: "Midheaven", longitude: midheaven },
      ];
  const liliths: LilithPoint[] = [];
  for (const point of LILITH_POINTS) {
    const result = swisseph.swe_calc_ut(julianDay, point.swissId, flags) as {
      longitude?: number;
      latitude?: number;
      longitudeSpeed?: number;
      error?: string;
    };
    if (typeof result.longitude !== "number") continue; // e.g. asteroid file not installed
    const lng = result.longitude;
    liliths.push({
      id: point.id,
      name: point.name,
      longitude: lng,
      latitude: result.latitude ?? 0,
      ...longitudeToSign(lng),
      house: findHouse(lng, cusps),
      retrograde: (result.longitudeSpeed ?? 0) < 0,
      longitudeSpeed: result.longitudeSpeed,
      aspects: lilithAspects(lng, planets, angles),
    });
  }

  const localFormatted = localDateTime.toFormat("yyyy-MM-dd HH:mm:ss ZZZZ");
  const utcFormatted = utcDateTime.toFormat("yyyy-MM-dd HH:mm:ss 'UTC'");

  return {
    birthData,
    localBirthTime: localFormatted,
    utcBirthTime: utcFormatted,
    julianDay,
    planets,
    houses,
    ascendant,
    midheaven,
    aspects,
    rulerships: RULERSHIPS,
    calculatedAt: new Date().toISOString(),
    approximate: birthData.birthTimeApproximate,
    liliths,
  };
}
