"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess } from "@/lib/membership-access";
import { getRsvp, type RsvpRecord } from "@/lib/rsvp";
import {
  upcomingWorkshops,
  workshopStatus,
  countdownTo,
  formatWorkshopWhen,
  type Workshop,
} from "@/lib/workshops";

const poppins = "var(--font-poppins), Poppins, sans-serif";

function CountdownUnit({ value, label, dark }: { value: number; label: string; dark: boolean }) {
  return (
    <div
      className="text-center"
      style={{
        border: dark ? "1.5px solid rgba(255,255,255,0.25)" : "var(--border)",
        background: dark ? "rgba(255,255,255,0.06)" : "#fff",
        padding: "10px 0",
        minWidth: 62,
      }}
    >
      <div
        style={{
          fontFamily: poppins,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-1px",
          lineHeight: 1,
          color: dark ? "#fff" : "var(--dark)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginTop: 5,
          color: dark ? "rgba(255,255,255,0.6)" : "var(--grey-light)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/**
 * The next live workshops with a ticking countdown, surfaced on the dashboard so a class she's
 * already paid for never gets buried behind the account menu. Reads the same WORKSHOPS list the
 * full /events page renders, and links back there for RSVP, replays and reminder settings.
 */
export default function UpcomingEvents() {
  const { member } = useMember();
  // Null until mounted: the server has no idea what time it is in her browser, so the countdown
  // only starts rendering client-side, otherwise the first paint would hydrate mismatched.
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [rsvps, setRsvps] = useState<Record<string, RsvpRecord | null>>({});

  useEffect(() => {
    setNowMs(Date.now());
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!member) return;
    (async () => {
      const entries = await Promise.all(
        upcomingWorkshops(Date.now()).map(async (w) => [w.id, await getRsvp(w.id)] as const)
      );
      setRsvps(Object.fromEntries(entries));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.name]);

  if (nowMs === null) return null;

  const workshops = upcomingWorkshops(nowMs);
  if (workshops.length === 0) return null;

  const canJoin = member ? hasActiveAccess(member) : false;

  return (
    <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
          <div className="tag" style={{ marginBottom: 0 }}>
            your live events this szn
          </div>
          <Link
            href="/events"
            className="no-underline"
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--pink)",
            }}
          >
            all events →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          {workshops.map((workshop: Workshop, i) => {
            const status = workshopStatus(workshop, nowMs);
            const dark = workshop.dark;
            const rsvp = rsvps[workshop.id];
            const isGoing = rsvp?.status === "going";
            const dimColor = dark ? "rgba(255,255,255,0.65)" : "var(--grey)";

            return (
              <div
                key={workshop.id}
                className="p-7 flex flex-col"
                style={{
                  background: dark ? "var(--dark)" : "var(--lav-light)",
                  borderRight: i === 0 && workshops.length > 1 ? "var(--border)" : undefined,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: dark ? "var(--lav)" : "#3C2A70",
                    marginBottom: 6,
                  }}
                >
                  {workshop.label}
                </div>
                <h3
                  style={{
                    fontFamily: poppins,
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                    color: dark ? "#fff" : "var(--dark)",
                    marginBottom: 10,
                  }}
                >
                  {workshop.title}
                </h3>
                <p style={{ fontSize: 12, color: dimColor, marginBottom: 18 }}>
                  {workshop.startIso ? formatWorkshopWhen(workshop.startIso) : workshop.meta}
                  {workshop.startIso ? " · your time" : ""}
                </p>

                {status === "upcoming" && workshop.startIso && (
                  <>
                    <div className="flex gap-2 mb-5">
                      {(() => {
                        const c = countdownTo(workshop.startIso, nowMs);
                        return (
                          <>
                            <CountdownUnit value={c.days} label="days" dark={dark} />
                            <CountdownUnit value={c.hours} label="hrs" dark={dark} />
                            <CountdownUnit value={c.minutes} label="mins" dark={dark} />
                            <CountdownUnit value={c.seconds} label="secs" dark={dark} />
                          </>
                        );
                      })()}
                    </div>
                    {isGoing ? (
                      <div className="flex items-center gap-3 flex-wrap mt-auto">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "#0F6E56",
                            background: "rgba(15,110,86,0.15)",
                            padding: "6px 12px",
                          }}
                        >
                          ✓ you&apos;re going
                        </span>
                        <Link
                          href="/events"
                          className="no-underline"
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: dimColor,
                            textDecoration: "underline",
                          }}
                        >
                          event details
                        </Link>
                      </div>
                    ) : (
                      <Link href="/events" className="btn-pink mt-auto" style={{ alignSelf: "flex-start" }}>
                        rsvp now
                      </Link>
                    )}
                  </>
                )}

                {status === "live" && (
                  <div className="mt-auto">
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--pink)",
                        marginBottom: 12,
                      }}
                    >
                      ● happening right now
                    </div>
                    {workshop.zoomUrl && canJoin ? (
                      <a
                        href={workshop.zoomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pink"
                        style={{ display: "inline-block" }}
                      >
                        join zoom now
                      </a>
                    ) : (
                      <Link href="/events" className="btn-pink" style={{ display: "inline-block" }}>
                        event details
                      </Link>
                    )}
                  </div>
                )}

                {status === "tbc" && (
                  <div className="mt-auto">
                    <p style={{ fontSize: 12, color: dimColor, lineHeight: 1.7, marginBottom: 14 }}>
                      Date lands soon. Get on the list and we&apos;ll email you the moment it&apos;s confirmed.
                    </p>
                    <Link href="/events" className="btn-pink" style={{ display: "inline-block" }}>
                      get notified
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
