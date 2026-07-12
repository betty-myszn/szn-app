"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { BirthLocation } from "@/types/chart";

interface PlacesAutocompleteProps {
  onSelect: (location: BirthLocation) => void;
  value?: string;
}

interface GeoNameResult {
  geonameId: number;
  name: string;
  countryName: string;
  adminName1: string;
  lat: string;
  lng: string;
  timezone?: { timeZoneId: string };
}

export default function PlacesAutocomplete({ onSelect, value }: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [results, setResults] = useState<GeoNameResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [configured, setConfigured] = useState(true);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/geonames?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setConfigured(false);
        setResults([]);
      } else {
        setConfigured(true);
        setResults(data.geonames || []);
        setShowDropdown(true);
      }
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  const handleInput = (val: string) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (result: GeoNameResult) => {
    const placeName = [result.name, result.adminName1, result.countryName].filter(Boolean).join(", ");
    const location: BirthLocation = {
      placeName,
      city: result.name,
      country: result.countryName,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lng),
      timezone: result.timezone?.timeZoneId || "UTC",
    };
    setInputValue(placeName);
    setShowDropdown(false);
    setResults([]);
    onSelect(location);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        name="birthplace-lookup"
        placeholder="City, Country"
        style={inputStyle}
        autoComplete="new-password"
        data-form-type="other"
        data-lpignore="true"
        className="focus:!border-[var(--pink)]"
      />
      {loading && (
        <div className="absolute right-3 top-3.5">
          <div className="h-4 w-4 animate-spin rounded-full" style={{ border: "2px solid var(--pink)", borderTopColor: "transparent" }} />
        </div>
      )}
      {showDropdown && results.length > 0 && (
        <ul className="geo-dropdown absolute z-50 mt-0.5 w-full" style={{ border: "var(--border)", background: "#fff", maxHeight: 240, overflow: "auto" }}>
          {results.map((r) => (
            <li key={r.geonameId}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full px-3.5 py-3 text-left text-sm hover:bg-[#fafafa] transition-colors"
                style={{ border: "none", borderBottom: "1px solid #eee", background: "transparent", cursor: "pointer", color: "var(--dark)" }}
              >
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                {r.adminName1 && <span style={{ color: "var(--grey)" }}>, {r.adminName1}</span>}
                <span style={{ color: "var(--grey-light)" }}> — {r.countryName}</span>
                {r.timezone && (
                  <span style={{ marginLeft: 8, fontSize: 10, color: "var(--grey-light)" }}>
                    {r.timezone.timeZoneId}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
