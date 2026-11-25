"use client";

import { useEffect, useState, type FormEvent } from "react";
import BirthDetailsFields, { type BirthDetails } from "@/components/BirthDetailsFields";
import type { ChartData } from "@/types/chart";

// The girls' trip planner's input: her bestie's birth details. The chart is worked out by the same
// public /api/calculate the free chart uses and is never stored on the server; the details are
// remembered on this device only, so the planner is still filled in next visit.

const KEY = "szn_place_bestie";
type Saved = BirthDetails & { name: string };

const inputStyle = {
  width: "100%", padding: "12px 14px", border: "2px solid #1a1a1a", borderRadius: 14, fontSize: 16,
  fontWeight: 700, background: "#fff", color: "#1a1a1a", outline: "none",
} as const;
const labelStyle = {
  fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a",
  marginBottom: 8, display: "block",
} as const;

export default function BestieForm({ onChart }: { onChart: (chart: ChartData | null, name: string) => void }) {
  const [name, setName] = useState("");
  const [details, setDetails] = useState<BirthDetails>({ dateOfBirth: "", birthTime: "", birthTimeApproximate: false, location: null });
  const [state, setState] = useState<"edit" | "loading" | "done">("edit");
  const [error, setError] = useState<string | null>(null);

  async function run(n: string, d: BirthDetails) {
    if (!d.dateOfBirth || !d.location) { setError("Add her birth date and the place she was born."); return; }
    setError(null); setState("loading");
    try {
      const res = await fetch("/api/calculate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n || "bestie", dateOfBirth: d.dateOfBirth, birthTime: d.birthTime || "12:00", birthTimeApproximate: d.birthTimeApproximate || !d.birthTime, location: d.location }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "That chart didn't calculate");
      const chart: ChartData = await res.json();
      onChart(chart, n || "your bestie");
      try { localStorage.setItem(KEY, JSON.stringify({ ...d, name: n })); } catch {}
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That chart didn't calculate"); setState("edit");
    }
  }

  // Bring back the last bestie on this device.
  useEffect(() => {
    try {
      const s: Saved | null = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && s.dateOfBirth && s.location) {
        setName(s.name || ""); setDetails({ dateOfBirth: s.dateOfBirth, birthTime: s.birthTime, birthTimeApproximate: s.birthTimeApproximate, location: s.location });
        void run(s.name || "", s);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "done") {
    return (
      <div className="bform" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <b style={{ fontFamily: "var(--poppins)", fontWeight: 800, fontSize: 16 }}>planning with {name || "your bestie"} 💞</b>
        <span style={{ display: "flex", gap: 8 }}>
          <button className="region" onClick={() => setState("edit")}>change bestie</button>
          <button className="region" onClick={() => { onChart(null, ""); try { localStorage.removeItem(KEY); } catch {} setName(""); setDetails({ dateOfBirth: "", birthTime: "", birthTimeApproximate: false, location: null }); setState("edit"); }}>clear</button>
        </span>
      </div>
    );
  }

  return (
    <form className="bform" onSubmit={(e: FormEvent) => { e.preventDefault(); void run(name.trim(), details); }}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle} htmlFor="bestie-name">her first name</label>
        <input id="bestie-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chloe" style={inputStyle} autoComplete="off" />
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <BirthDetailsFields value={details} onChange={(p) => setDetails((d) => ({ ...d, ...p }))} labelStyle={labelStyle} inputStyle={inputStyle} noteColor="#1a1a1a" />
      </div>
      {error && <p className="err">{error}</p>}
      <button className="btn" type="submit" style={{ marginTop: 16 }} disabled={state === "loading"}>
        {state === "loading" ? "finding your places…" : "find our places"}
      </button>
    </form>
  );
}
