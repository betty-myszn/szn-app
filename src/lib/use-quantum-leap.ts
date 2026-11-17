"use client";

import { useEffect, useState } from "react";

// Fetches from /api/quantum-leap, the only place the thirty days come from. Pass null to skip.
// `done` flips once the answer is in, so a page can tell "still loading" from "not for you".
export function useQuantumLeap<T>(query: string | null): { data: T | null; done: boolean } {
  const [state, setState] = useState<{ data: T | null; done: boolean }>({ data: null, done: false });
  useEffect(() => {
    if (!query) return;
    let live = true;
    fetch(`/api/quantum-leap?${query}`, { credentials: "same-origin", cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<T>) : null))
      .catch(() => null)
      .then((data) => live && setState({ data, done: true }));
    return () => {
      live = false;
    };
  }, [query]);
  return state;
}
