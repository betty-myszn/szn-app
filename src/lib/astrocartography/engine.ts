// Astrocartography engine. Pure maths, no dependencies.
export interface AcgLine { planet: string; angle: "MC" | "IC" | "ASC" | "DSC"; kind: "meridian" | "horizon"; lon?: number; segs?: [number, number][][] }
// Input: julianDay (UT) and ecliptic longitude/latitude per planet. Output: MC/IC/ASC/DSC lines.
const R = Math.PI / 180;
const norm = (x: number) => ((x % 360) + 360) % 360;
const wrap = (x: number) => { const v = norm(x); return v > 180 ? v - 360 : v; };

export const PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
export const ANGLES = ["MC", "IC", "ASC", "DSC"];

function equatorial(lonDeg: number, latDeg: number, eps: number) {
  const l = lonDeg * R, b = latDeg * R;
  const dec = Math.asin(Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l));
  const ra = norm(Math.atan2(Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps), Math.cos(l)) / R);
  return { ra, dec: dec / R };
}

export function computeLines(jd: number, planets: { name: string; longitude: number; latitude: number }[]): AcgLine[] {
  const T = (jd - 2451545) / 36525;
  const eps = (23.439291 - 0.0130042 * T) * R;
  const gmst = norm(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T);
  const lines: AcgLine[] = [];
  for (const p of planets) {
    if (!PLANETS.includes(p.name)) continue;
    const { ra, dec } = equatorial(p.longitude, p.latitude, eps);
    const mc = wrap(ra - gmst);
    lines.push({ planet: p.name, angle: "MC", kind: "meridian", lon: mc });
    lines.push({ planet: p.name, angle: "IC", kind: "meridian", lon: wrap(mc + 180) });
    // Horizon curves, parametrised by the semi-diurnal arc H0 so the curve stays smooth where
    // rising and setting meet at the circumpolar latitude.
    const td = Math.tan(dec * R);
    for (const angle of ["ASC", "DSC"]) {
      const segs: [number, number][][] = []; let seg: [number, number][] = []; let prev: number | null = null;
      for (let h = 0.25; h < 180; h += 0.25) {
        const lat = Math.atan(-Math.cos(h * R) / td) / R;
        const lon = wrap(angle === "ASC" ? ra - h - gmst : ra + h - gmst);
        if (lat < -62 || lat > 80) { if (seg.length > 1) segs.push(seg); seg = []; prev = null; continue; }
        if (prev !== null && Math.abs(lon - prev) > 180) { if (seg.length > 1) segs.push(seg); seg = []; }
        const last = seg[seg.length - 1];
        if (last) {
          const gap = Math.max(Math.abs(lon - last[0]), Math.abs(lat - last[1]));
          const n = Math.ceil(gap / 0.3);
          for (let k = 1; k < n; k++) seg.push([last[0] + ((lon - last[0]) * k) / n, last[1] + ((lat - last[1]) * k) / n]);
        }
        seg.push([lon, lat]); prev = lon;
      }
      if (seg.length > 1) segs.push(seg);
      lines.push({ planet: p.name, angle: angle as AcgLine["angle"], kind: "horizon", segs });
    }
  }
  return lines;
}

// Distance in km from a place to a line.
export function distanceKm(line: AcgLine, lat: number, lon: number): number {
  if (line.kind === "meridian") {
    const dl = Math.abs(wrap(lon - (line.lon as number))) * R;
    const x = Math.cos(lat * R) * Math.sin(Math.min(dl, Math.PI / 2));
    return Math.asin(Math.min(1, x)) * 6371 * (dl > Math.PI / 2 ? 99 : 1);
  }
  let best = Infinity;
  const la1 = lat * R;
  for (const seg of line.segs ?? []) for (const [plon, plat] of seg) {
    const la2 = plat * R, dla = la2 - la1, dlo = (plon - lon) * R;
    const a = Math.sin(dla / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dlo / 2) ** 2;
    const d = 2 * 6371 * Math.asin(Math.sqrt(a));
    if (d < best) best = d;
  }
  return best;
}
