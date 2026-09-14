"use client";

import { useState, type CSSProperties } from "react";
import PlacesAutocomplete from "./PlacesAutocomplete";
import type { BirthLocation } from "@/types/chart";

// The birth details fields on their own, without a form around them, so anywhere that needs a
// birth chart asks for it the same way: the free chart form and the IRL host application both
// render this.

export interface BirthDetails {
  dateOfBirth: string;
  birthTime: string;
  birthTimeApproximate: boolean;
  location: BirthLocation | null;
}

const defaultLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--grey-light)",
  marginBottom: 8,
  display: "block",
};

const defaultInput: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "var(--border)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: "var(--dark)",
  background: "#fff",
  outline: "none",
};

export default function BirthDetailsFields({ value, onChange, labelStyle = defaultLabel, inputStyle = defaultInput }: {
  value: BirthDetails;
  onChange: (patch: Partial<BirthDetails>) => void;
  labelStyle?: CSSProperties;
  inputStyle?: CSSProperties;
}) {
  const { dateOfBirth, birthTime, birthTimeApproximate, location } = value;

  // Manual location fallback, for when place search is not configured. The location is only
  // reported up once all of it is there, and the fields stay on screen while she edits them.
  const [manual, setManual] = useState({ city: "", country: "", lat: "", lng: "", timezone: "" });
  const [usingManual, setUsingManual] = useState(false);
  const setManualField = (k: keyof typeof manual, v: string) => {
    const next = { ...manual, [k]: v };
    setManual(next);
    setUsingManual(true);
    onChange({
      location: next.city && next.lat && next.lng && next.timezone
        ? {
            placeName: `${next.city}, ${next.country}`,
            city: next.city,
            country: next.country,
            latitude: parseFloat(next.lat),
            longitude: parseFloat(next.lng),
            timezone: next.timezone,
          }
        : null,
    });
  };

  return (
    <>
      <div>
        <label htmlFor="dob" style={labelStyle}>date of birth</label>
        <input
          id="dob"
          type="date"
          value={dateOfBirth}
          onChange={(e) => onChange({ dateOfBirth: e.target.value })}
          required
          style={inputStyle}
          className="focus:!border-[var(--pink)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="time" style={labelStyle}>time of birth</label>
          <input
            id="time"
            type="time"
            value={birthTime}
            onChange={(e) => onChange({ birthTime: e.target.value })}
            required
            style={inputStyle}
            className="focus:!border-[var(--pink)]"
          />
        </div>
        <div>
          <label htmlFor="birth-place" style={labelStyle}>place of birth</label>
          <PlacesAutocomplete
            id="birth-place"
            onSelect={(loc) => { setUsingManual(false); onChange({ location: loc }); }}
            value={location?.placeName}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="approximate"
          type="checkbox"
          checked={birthTimeApproximate}
          onChange={(e) => onChange({ birthTimeApproximate: e.target.checked })}
          className="h-4 w-4"
          style={{ accentColor: "var(--pink)" }}
        />
        <label htmlFor="approximate" style={{ fontSize: 12, color: "var(--grey)" }}>
          Birth time is approximate / unknown exact time
        </label>
      </div>

      {location && (
        <div style={{ fontSize: 11, color: "var(--grey-light)", padding: "8px 0" }}>
          <p>📍 {location.placeName}</p>
          <p>Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)} · Timezone: {location.timezone}</p>
        </div>
      )}

      {(!location || usingManual) && !process.env.NEXT_PUBLIC_GEONAMES_USERNAME && (
        <div className="space-y-3 p-4" style={{ border: "1px solid #eee" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)" }}>Manual Location Entry</p>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="City" value={manual.city} onChange={(e) => setManualField("city", e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
            <input type="text" placeholder="Country" value={manual.country} onChange={(e) => setManualField("country", e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="any" placeholder="Latitude" value={manual.lat} onChange={(e) => setManualField("lat", e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
            <input type="number" step="any" placeholder="Longitude" value={manual.lng} onChange={(e) => setManualField("lng", e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
          </div>
          <input type="text" placeholder="IANA Timezone (e.g. Pacific/Honolulu)" value={manual.timezone} onChange={(e) => setManualField("timezone", e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
        </div>
      )}
    </>
  );
}
