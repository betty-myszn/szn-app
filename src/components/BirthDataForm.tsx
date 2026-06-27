"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PlacesAutocomplete from "./PlacesAutocomplete";
import type { BirthData, BirthLocation } from "@/types/chart";
import { encodeBirthData, saveBirthData, getSavedBirthData } from "@/lib/url-params";

interface BirthDataFormProps {
  initialData?: Partial<BirthData>;
}

export default function BirthDataForm({ initialData }: BirthDataFormProps) {
  const router = useRouter();

  // Try to pre-fill from localStorage if no initialData
  const saved = typeof window !== "undefined" ? getSavedBirthData() : null;
  const defaults = initialData || saved;

  const [email, setEmail] = useState("");
  const [name, setName] = useState(defaults?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(defaults?.dateOfBirth || "");
  const [birthTime, setBirthTime] = useState(defaults?.birthTime || "");
  const [birthTimeApproximate, setBirthTimeApproximate] = useState(
    defaults?.birthTimeApproximate || false
  );
  const [location, setLocation] = useState<BirthLocation | null>(
    defaults?.location || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual location fields (fallback)
  const [manualCity, setManualCity] = useState("");
  const [manualCountry, setManualCountry] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualTimezone, setManualTimezone] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    let finalLocation = location;

    if (!finalLocation && manualCity && manualLat && manualLng && manualTimezone) {
      finalLocation = {
        placeName: `${manualCity}, ${manualCountry}`,
        city: manualCity,
        country: manualCountry,
        latitude: parseFloat(manualLat),
        longitude: parseFloat(manualLng),
        timezone: manualTimezone,
      };
    }

    if (!name || !dateOfBirth || !birthTime || !finalLocation) {
      setError("Please fill in all required fields.");
      return;
    }

    const birthData: BirthData = {
      name,
      dateOfBirth,
      birthTime,
      birthTimeApproximate,
      location: finalLocation,
    };

    setLoading(true);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Calculation failed");
      }

      saveBirthData(birthData);
      const params = encodeBirthData(birthData);
      router.push(`/results?${params}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--grey-light)",
    marginBottom: 8,
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "var(--border)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "var(--dark)",
    background: "#fff",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div style={{ background: "var(--pink-light)", color: "#993556", padding: "12px 16px", fontSize: 13, border: "1.5px solid var(--pink)" }}>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" style={labelStyle}>email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
          placeholder="you@email.com"
          className="focus:!border-[var(--pink)]"
        />
        <p style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 6 }}>
          We&apos;ll send your chart results here too. No spam, ever.
        </p>
      </div>

      <div>
        <label htmlFor="name" style={labelStyle}>your name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
          placeholder="Enter your name"
          className="focus:!border-[var(--pink)]"
        />
      </div>

      <div>
        <label htmlFor="dob" style={labelStyle}>date of birth</label>
        <input
          id="dob"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
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
            onChange={(e) => setBirthTime(e.target.value)}
            required
            style={inputStyle}
            className="focus:!border-[var(--pink)]"
          />
        </div>
        <div>
          <label style={labelStyle}>place of birth</label>
          <PlacesAutocomplete onSelect={setLocation} value={location?.placeName} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="approximate"
          type="checkbox"
          checked={birthTimeApproximate}
          onChange={(e) => setBirthTimeApproximate(e.target.checked)}
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

      {!location && !process.env.NEXT_PUBLIC_GEONAMES_USERNAME && (
        <div className="space-y-3 p-4" style={{ border: "1px solid #eee" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)" }}>Manual Location Entry</p>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="City" value={manualCity} onChange={(e) => setManualCity(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
            <input type="text" placeholder="Country" value={manualCountry} onChange={(e) => setManualCountry(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="any" placeholder="Latitude" value={manualLat} onChange={(e) => setManualLat(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
            <input type="number" step="any" placeholder="Longitude" value={manualLng} onChange={(e) => setManualLng(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
          </div>
          <input type="text" placeholder="IANA Timezone (e.g. Pacific/Honolulu)" value={manualTimezone} onChange={(e) => setManualTimezone(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer disabled:opacity-50"
        style={{
          background: "var(--pink)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "14px 32px",
          border: "none",
          marginTop: 8,
        }}
      >
        {loading ? "calculating your chart..." : "get my free chart"}
      </button>
    </form>
  );
}
