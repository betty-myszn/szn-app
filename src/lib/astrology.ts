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
            applying: diff < config.angle,
          });
          break;
        }
      }
    }
  }

  return aspects;
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
  };
}
