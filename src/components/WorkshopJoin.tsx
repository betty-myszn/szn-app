"use client";

import { useEffect, useState } from "react";

interface JoinDetails {
  url: string;
  meetingId: string;
  passcode: string;
}

/**
 * The Zoom join button for one workshop. It never knows the link until it asks the server, and it
 * only asks when `enabled` (she is a member), so a public page never so much as fires the request.
 * The server makes the real decision either way.
 */
export default function WorkshopJoin({
  workshopId,
  enabled,
  label = "join zoom meeting",
  showDetails = false,
  detailColor = "var(--grey)",
  fallback = null,
}: {
  workshopId: string;
  enabled: boolean;
  label?: string;
  showDetails?: boolean;
  detailColor?: string;
  fallback?: React.ReactNode;
}) {
  const [details, setDetails] = useState<JoinDetails | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch(`/api/workshops/join?id=${encodeURIComponent(workshopId)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled) setDetails(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [workshopId, enabled]);

  if (!enabled || !details) return <>{fallback}</>;

  return (
    <div>
      <a href={details.url} target="_blank" rel="noopener noreferrer" className="btn-pink" style={{ display: "inline-block", marginBottom: showDetails ? 8 : 0 }}>
        {label}
      </a>
      {showDetails && (
        <p style={{ fontSize: 11, color: detailColor, margin: 0 }}>
          meeting id {details.meetingId} &middot; passcode {details.passcode}
        </p>
      )}
    </div>
  );
}
