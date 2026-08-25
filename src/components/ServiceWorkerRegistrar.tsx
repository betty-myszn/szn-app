"use client";

import { useEffect } from "react";

// Registers the service worker once, after load, so it never competes with the first paint. Scope
// "/" so it controls the whole app; updateViaCache "none" so a new sw.js is always fetched fresh
// rather than served from the HTTP cache, which is how updates actually reach installed users.
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {});
    };
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);
  return null;
}
