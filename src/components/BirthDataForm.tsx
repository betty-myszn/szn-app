"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import BirthDetailsFields from "./BirthDetailsFields";
import type { BirthData, BirthLocation } from "@/types/chart";
import { encodeBirthData, saveBirthData, getSavedBirthData } from "@/lib/url-params";
import { loadBirthDataPreferringSupabase, syncBirthDataToSupabase } from "@/lib/chart-sync";
import { track, EVENTS } from "@/lib/analytics";

interface BirthDataFormProps {
  initialData?: Partial<BirthData>;
  /** Where to send her once the details are saved. Defaults to the astrology results page. The
   *  human design generator points this at /human-design instead. */
  destination?: string;
  /** Lead source tag for the email capture, so free-chart and free-human-design leads are
   *  distinguishable in the list. */
  leadSource?: string;
  /** When false, skip the astrology /api/calculate call and just save the details and redirect.
   *  Human Design is computed on its own page from the same saved birth data, so it doesn't need
   *  the natal calculation here. Defaults to true, keeping the astrology flow unchanged. */
  computeAstrology?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
}

export default function BirthDataForm({
  initialData,
  destination = "/results",
  leadSource = "free-chart",
  computeAstrology = true,
  submitLabel = "get my free chart",
  loadingLabel = "calculating your chart...",
}: BirthDataFormProps) {
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

  // A logged-in member already gave her birth details (at signup, or a previous visit), so she
  // must never be asked to type them again here. On mount we load through the shared, Supabase-first
  // resolver: her stored row wins over local storage (which is only a cache/fallback), and it
  // refreshes local from the DB in passing so the two stay consistent. Fields are filled only when
  // still empty, so this never clobbers a value she's in the middle of typing, and the form stays
  // fully editable.
  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await loadBirthDataPreferringSupabase();
      if (!active || !saved) return;
      setName((v) => v || saved.name || "");
      setDateOfBirth((v) => v || saved.dateOfBirth || "");
      setBirthTime((v) => v || saved.birthTime || "");
      setBirthTimeApproximate((v) => v || saved.birthTimeApproximate || false);
      setLocation((v) => v || saved.location || null);
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // The manual location fallback now lives in BirthDetailsFields, which reports a location once
    // all of it has been typed, so there is nothing left to assemble here.
    const finalLocation = location;

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

    // Fired here rather than on first keystroke: this is the moment she's committed to the form,
    // and it's the denominator for every completion rate below it. Nothing identifying goes in,
    // only whether she gave an exact birth time and whether she opted in to email.
    track(EVENTS.CHART_STARTED, {
      birth_time_approximate: birthTimeApproximate,
      email_provided: Boolean(email),
    });

    try {
      // Human design mode: no natal calculation needed here, the /human-design page computes the
      // design chart from these same saved details. Save, capture the lead, redirect.
      if (!computeAstrology) {
        saveBirthData(birthData);
        void syncBirthDataToSupabase(birthData);
        if (email) {
          fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              name,
              source: leadSource,
              dateOfBirth,
              birthTime,
              birthTimeApproximate,
              placeOfBirth: finalLocation.placeName,
            }),
          }).catch(() => {});
          track(EVENTS.LEAD, { source: leadSource });
        }
        router.push(destination);
        return;
      }

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
      // Keep the two stores in step for a logged-in member: local is updated above, and her edits
      // are pushed back to Supabase (the cross-device source of truth) so the next visit, on any
      // device, hydrates the corrected details rather than the old ones. No-ops for a logged-out
      // visitor (syncBirthDataToSupabase returns early with no user), and fire-and-forget so it
      // never blocks her seeing the chart.
      void syncBirthDataToSupabase(birthData);

      const chartData = await res.json();

      const sunSign = chartData.planets?.find((p: { id: string }) => p.id === "sun")?.sign || "";
      const moonSign = chartData.planets?.find((p: { id: string }) => p.id === "moon")?.sign || "";
      const risingSign = chartData.ascendant?.sign || "";

      // The big three go in as event params so GA4 can segment audiences by placement later
      // (which signs convert, which signs churn). Signs are not personal data on their own.
      track(EVENTS.CHART_COMPLETED, {
        sun_sign: sunSign,
        moon_sign: moonSign,
        rising_sign: risingSign,
      });

      if (email) {
        fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            source: "free-chart",
            dateOfBirth,
            birthTime,
            birthTimeApproximate,
            placeOfBirth: finalLocation.placeName,
            sunSign,
            moonSign,
            risingSign,
          }),
        }).catch(() => {});

        track(EVENTS.LEAD, { source: "free-chart" });
      }

      const params = encodeBirthData(birthData);
      router.push(`/results?${params}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      // Distinguishing a failed calculation from an abandoned one matters: a drop between
      // chart_started and chart_completed is a copy problem, a spike here is a bug.
      track(EVENTS.CHART_FAILED, { reason: message });
      setError(message);
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

      <BirthDetailsFields
        value={{ dateOfBirth, birthTime, birthTimeApproximate, location }}
        onChange={(p) => {
          if (p.dateOfBirth !== undefined) setDateOfBirth(p.dateOfBirth);
          if (p.birthTime !== undefined) setBirthTime(p.birthTime);
          if (p.birthTimeApproximate !== undefined) setBirthTimeApproximate(p.birthTimeApproximate);
          if ("location" in p) setLocation(p.location ?? null);
        }}
        labelStyle={labelStyle}
        inputStyle={inputStyle}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer disabled:opacity-50"
        style={{
          background: "var(--pink)",
          color: "var(--dark)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "14px 32px",
          border: "none",
          marginTop: 8,
        }}
      >
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
