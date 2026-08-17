"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Ticker from "@/components/Ticker";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess } from "@/lib/membership-access";
import {
  getRsvp,
  setRsvpStatus,
  setReminderPrefs,
  getAttendees,
  buildIcs,
  downloadIcs,
  isNotifyMe,
  setNotifyMe,
  type RsvpRecord,
} from "@/lib/rsvp";
import { WORKSHOPS, workshopStatus, pastWorkshops, type Workshop } from "@/lib/workshops";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Angles for the pink star burst that fires when she RSVPs going, reuses the same particle
// animation as the challenge-completion burst, just pink stars instead of emoji confetti.
const STAR_BURST_ANGLES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

export default function EventsPage() {
  const { member, ready } = useMember();
  const [rsvps, setRsvps] = useState<Record<string, RsvpRecord | null>>({});
  const [showAttendees, setShowAttendees] = useState<Record<string, boolean>>({});
  const [burstId, setBurstId] = useState<string | null>(null);
  const [notified, setNotified] = useState<Record<string, boolean>>({});
  // Read the clock once on the client so the upcoming-vs-past split is stable across a render and
  // never runs the impure Date.now() during render or during the server pass.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  useEffect(() => {
    if (!member) return;
    (async () => {
      const map: Record<string, RsvpRecord | null> = {};
      const notifyMap: Record<string, boolean> = {};
      await Promise.all(
        WORKSHOPS.map(async (w) => {
          map[w.id] = await getRsvp(w.id);
          notifyMap[w.id] = await isNotifyMe(w.id);
        })
      );
      setRsvps(map);
      setNotified(notifyMap);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.name]);

  const handleRsvp = async (eventId: string, status: "going" | "not-going") => {
    const updated = await setRsvpStatus(eventId, status);
    setRsvps((prev) => ({ ...prev, [eventId]: updated }));
    if (status === "going") {
      setBurstId(eventId);
      setTimeout(() => setBurstId(null), 900);
    }
  };

  const handleNotifyMe = async (eventId: string) => {
    await setNotifyMe(eventId);
    setNotified((prev) => ({ ...prev, [eventId]: true }));
  };

  const handleReminderToggle = async (eventId: string, key: "reminderEmail" | "reminderPush") => {
    const current = rsvps[eventId];
    if (!current) return;
    const updated = await setReminderPrefs(eventId, { [key]: !current[key] });
    setRsvps((prev) => ({ ...prev, [eventId]: updated }));
  };

  const handleAddToCalendar = (workshop: Workshop) => {
    if (!workshop.startIso) return;
    const ics = buildIcs({
      id: workshop.id,
      title: workshop.title,
      description: workshop.paragraphs[0],
      startIso: workshop.startIso,
      durationMinutes: workshop.durationMinutes,
      location: workshop.location,
    });
    downloadIcs(`${workshop.id}.ics`, ics);
  };

  if (!ready || now === null) return null;

  // Once a class is over it leaves the RSVP grid and moves to the replay vault below, so the same
  // workshop is never both "upcoming, rsvp now" and "past, watch the replay" at the same time.
  const upcoming = WORKSHOPS.filter((w) => workshopStatus(w, now) !== "past");
  const past = pastWorkshops(now);

  return (
    <>
      <Ticker
        variant="lav"
        items={["class is in session", "live and unfiltered", "show up as her", "replays saved forever", "bring your questions"]}
      />
      {/* Header */}
      <section className="px-5 md:px-8 py-14 text-center" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-3">
            {member ? "your live events this szn" : "your first workshops inside the membership"}
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(34px, 5.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.05,
            }}
          >
            Leo szn is about to <span className="pk">hit different.</span>
          </h1>
          {member && (
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 540, margin: "16px auto 0" }}>
              A live masterclass and astro tapping every month, replays and rituals, all included in your membership. Show up live for the full experience, or catch the replay in your own time.
            </p>
          )}
        </div>
      </section>

      {/* Workshop cards */}
      <section style={{ borderBottom: "var(--border)" }}>
        <div className="grid md:grid-cols-2 gap-0">
          {upcoming.map((workshop, i) => (
            <div
              key={workshop.title}
              className="p-8 md:p-12"
              style={{
                background: workshop.dark ? "var(--dark)" : "var(--lav-light)",
                borderRight: i === 0 ? "var(--border)" : undefined,
              }}
            >
              {workshop.coverImage && (
                <div
                  style={{
                    position: "relative",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: workshop.dark ? "1px solid rgba(255,255,255,0.15)" : "var(--border)",
                    marginBottom: 22,
                    aspectRatio: "16 / 9",
                    background: "#000",
                  }}
                >
                  {/* next/image so the cover is resized and served in a modern format instead of
                      shipping the full file. sizes: full width on mobile, half the 2-col grid up. */}
                  <Image
                    src={workshop.coverImage}
                    alt={workshop.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: workshop.dark ? "var(--lav)" : "#3C2A70",
                  marginBottom: 8,
                }}
              >
                {workshop.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--pink)",
                  marginBottom: 18,
                }}
              >
                {workshop.meta}
              </div>
              <h2
                style={{
                  fontFamily: poppins,
                  fontSize: 27,
                  fontWeight: 800,
                  letterSpacing: "-0.7px",
                  lineHeight: 1.15,
                  color: workshop.dark ? "#fff" : "var(--dark)",
                  marginBottom: 18,
                }}
              >
                {workshop.title}
              </h2>
              {workshop.paragraphs.map((p, j) => (
                <p
                  key={j}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.85,
                    color: workshop.dark ? "rgba(255,255,255,0.65)" : "#4a4560",
                    marginBottom: 14,
                  }}
                >
                  {p}
                </p>
              ))}
              {workshop.callout && (
                <div
                  className="p-5 mb-6 mt-2"
                  style={{ background: workshop.dark ? "rgba(255,45,135,0.12)" : "#fff", border: workshop.dark ? "1px solid rgba(255,45,135,0.3)" : "var(--border)" }}
                >
                  <p
                    style={{
                      fontFamily: poppins,
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: "-0.3px",
                      lineHeight: 1.4,
                      color: workshop.dark ? "#fff" : "var(--dark)",
                    }}
                  >
                    {workshop.callout.plain}
                    <span className="pk">{workshop.callout.pink}</span>
                  </p>
                </div>
              )}
              <div style={{ marginTop: workshop.callout ? 0 : 10, position: "relative" }}>
                {burstId === workshop.id && (
                  <div style={{ position: "absolute", top: 10, left: 30, width: 1, height: 1, overflow: "visible", pointerEvents: "none" }}>
                    {STAR_BURST_ANGLES.map((angle, idx) => {
                      const dist = 50 + idx * 7;
                      const x = Math.round(Math.cos(angle) * dist);
                      const y = Math.round(Math.sin(angle) * dist);
                      return (
                        <span
                          key={idx}
                          className="challenge-burst-particle"
                          style={{
                            ["--burst-x" as string]: `${x}px`,
                            ["--burst-y" as string]: `${y}px`,
                            ["--burst-r" as string]: `${idx * 35}deg`,
                            color: "var(--pink)",
                            fontSize: 14 + (idx % 3) * 4,
                          }}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                )}
                {!member ? (
                  <Link href="/#waitlist" className="btn-pink">
                    join the waitlist
                  </Link>
                ) : !workshop.startIso ? (
                  notified[workshop.id] ? (
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)" }}>you&apos;re on the list, we&apos;ll email you the date. ✦</span>
                  ) : (
                    <button
                      onClick={() => handleNotifyMe(workshop.id)}
                      className="btn-pink"
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      get notified
                    </button>
                  )
                ) : (
                  (() => {
                    const rsvp = rsvps[workshop.id];
                    const dimColor = workshop.dark ? "rgba(255,255,255,0.65)" : "var(--grey)";
                    const textColor = workshop.dark ? "#fff" : "var(--dark)";
                    const attendees = getAttendees(workshop.id, member.name, rsvp?.status === "going");

                    if (!rsvp || rsvp.status === "not-going") {
                      return (
                        <div>
                          {rsvp?.status === "not-going" && (
                            <p style={{ fontSize: 12, color: dimColor, marginBottom: 10 }}>you said you can&apos;t make this one.</p>
                          )}
                          <button onClick={() => handleRsvp(workshop.id, "going")} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
                            {rsvp?.status === "not-going" ? "i'm going after all" : "i'm going"}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div>
                        <div className="flex items-center gap-3 flex-wrap mb-4">
                          <span
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                              color: "#0F6E56", background: "rgba(15,110,86,0.15)", padding: "6px 12px",
                            }}
                          >
                            ✓ you&apos;re going
                          </span>
                          <button
                            onClick={() => handleRsvp(workshop.id, "not-going")}
                            style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dimColor, cursor: "pointer", padding: 0, textDecoration: "underline" }}
                          >
                            change my rsvp
                          </button>
                        </div>

                        {workshop.zoomUrl && hasActiveAccess(member) && (
                          <div className="mb-4">
                            <a
                              href={workshop.zoomUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-pink"
                              style={{ display: "inline-block", marginBottom: 8 }}
                            >
                              join zoom meeting
                            </a>
                            {workshop.zoomMeetingId && (
                              <p style={{ fontSize: 11, color: dimColor }}>
                                meeting id {workshop.zoomMeetingId}
                                {workshop.zoomPasscode ? ` · passcode ${workshop.zoomPasscode}` : ""}
                              </p>
                            )}
                          </div>
                        )}
                        {workshop.zoomUrl && !hasActiveAccess(member) && (
                          <p style={{ fontSize: 12, color: dimColor, marginBottom: 4 }}>
                            The Zoom link unlocks with an active membership.{" "}
                            <a href="/membership" style={{ color: "var(--pink)", fontWeight: 700 }}>
                              join to get in
                            </a>
                          </p>
                        )}

                        <div className="flex items-center gap-4 flex-wrap mb-4">
                          <button
                            onClick={() => setShowAttendees((prev) => ({ ...prev, [workshop.id]: !prev[workshop.id] }))}
                            style={{ background: "none", border: workshop.dark ? "1.5px solid rgba(255,255,255,0.4)" : "1.5px solid #ddd", color: textColor, padding: "9px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
                          >
                            {attendees.length} going {showAttendees[workshop.id] ? "▲" : "▼"}
                          </button>
                          <button
                            onClick={() => handleAddToCalendar(workshop)}
                            style={{ background: "none", border: workshop.dark ? "1.5px solid rgba(255,255,255,0.4)" : "1.5px solid #ddd", color: textColor, padding: "9px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
                          >
                            + add to calendar
                          </button>
                        </div>

                        {showAttendees[workshop.id] && attendees.length === 0 && (
                          <p style={{ fontSize: 12, color: dimColor, marginBottom: 16 }}>
                            no one&apos;s RSVP&apos;d yet, be the first.
                          </p>
                        )}
                        {showAttendees[workshop.id] && attendees.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {attendees.map((name) => (
                              <span
                                key={name}
                                style={{
                                  fontSize: 11, fontWeight: 700,
                                  color: name === member.name ? "var(--pink)" : dimColor,
                                  background: workshop.dark ? "rgba(255,255,255,0.08)" : "#fff",
                                  border: workshop.dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #eee",
                                  padding: "4px 10px",
                                }}
                              >
                                {name === member.name ? "you" : name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{ fontSize: 11, color: dimColor, marginBottom: 8 }}>get reminded</div>
                        <div className="flex flex-col gap-2 mb-2">
                          <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: 12, color: textColor }}>
                            <input type="checkbox" checked={rsvp.reminderEmail} onChange={() => handleReminderToggle(workshop.id, "reminderEmail")} style={{ accentColor: "var(--pink)" }} />
                            email me before it starts
                          </label>
                          <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: 12, color: textColor }}>
                            <input type="checkbox" checked={rsvp.reminderPush} onChange={() => handleReminderToggle(workshop.id, "reminderPush")} style={{ accentColor: "var(--pink)" }} />
                            notify me in-app before it starts
                          </label>
                        </div>
                        <p style={{ fontSize: 10, color: dimColor, lineHeight: 1.6, maxWidth: 420 }}>
                          Saved. Actual reminders 10 minutes before doors open need the notifications backend to go live first, this preference will be ready and waiting the moment it is.
                        </p>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {member ? (
        /* Members: a doorway into the replay vault, which lives on its own page */
        <section className="px-5 md:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="tag mb-5">the replay vault</div>
            <Link
              href="/events/replays"
              className="block p-8 md:p-10"
              style={{ border: "var(--border)", background: "var(--lav-light)", textDecoration: "none" }}
            >
              <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", color: "#2E1C63", marginBottom: 10 }}>
                every workshop, saved for you.
              </h2>
              <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, maxWidth: 520, marginBottom: 18 }}>
                {past.length > 0
                  ? "The classes you missed or want to sit with again, all in one place. Watch in your own time, as many times as you like."
                  : "Replays land here within 24 hours of each live class. The vault starts filling this szn."}
              </p>
              <span className="btn-pink" style={{ pointerEvents: "none" }}>
                {past.length > 0 ? "open the replay vault" : "see the vault"}
              </span>
            </Link>
          </div>
        </section>
      ) : (
        /* Guests: what else is inside */
        <section className="px-5 md:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="tag mb-5">and that&apos;s just the events</div>
            <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
              {[
                { title: "your personalised portal", body: "Horoscopes, affirmations and style codes built from your birth chart, not your sun sign alone." },
                { title: "shadow work journal", body: "Prompts that shift with every szn, designed to move you from hiding to whole." },
                { title: "the community", body: "A room full of women becoming her, together. Wins, questions, support, all of it." },
              ].map((item, i) => (
                <div key={item.title} className="p-7" style={{ borderRight: i < 2 ? "var(--border)" : undefined }}>
                  <h3 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>{item.body}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/#waitlist" className="btn-pink">join the waitlist</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
