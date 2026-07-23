"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout, isAdminMember } from "@/lib/member";
import { useMember } from "@/lib/use-member";
import { loadBroadcasts, loadReadBroadcastIds, markAllBroadcastsRead, getUnreadCount, type Broadcast } from "@/lib/broadcasts";
import DiscoPlanet from "@/components/DiscoPlanet";

const memberLinks = [
  { href: "/my-chart", label: "my chart" },
  { href: "/community", label: "community" },
  { href: "/journal", label: "journal" },
];

const sznMenu = [
  { href: "/dashboard", label: "my szn" },
  { href: "/challenges", label: "challenges", indent: true },
];

const guestLinks = [
  { href: "/", label: "home" },
  { href: "/events", label: "workshops" },
  { href: "/podcast", label: "podcast" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sznOpen, setSznOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [unread, setUnread] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { member } = useMember();
  const admin = member ? isAdminMember(member) : false;

  const links = member ? memberLinks : guestLinks;
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href + "/"));
  const sznSectionActive = pathname?.startsWith("/dashboard") || pathname?.startsWith("/challenges") || pathname?.startsWith("/your-season");

  useEffect(() => {
    if (!member) return;
    (async () => {
      const list = await loadBroadcasts();
      setBroadcasts(list);
      setUnread(getUnreadCount(list, await loadReadBroadcastIds()));
    })();
  }, [member]);

  const toggleBell = () => {
    setBellOpen((o) => {
      const next = !o;
      if (next && broadcasts.length > 0) {
        markAllBroadcastsRead(broadcasts);
        setUnread(0);
      }
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <nav
      className="sticky top-0 bg-white z-[100]"
      style={{ borderBottom: "var(--border)" }}
    >
      <div className="flex items-center justify-between px-5 md:px-8 py-[14px] md:py-[18px]">
        <Link
          href={member ? "/dashboard" : "/"}
          className="no-underline flex items-center gap-1"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.5px",
            color: "var(--dark)",
          }}
        >
          <DiscoPlanet size={28} interactive={false} />
          my<span style={{ color: "var(--pink)" }}>szn</span>
        </Link>

        {/* Desktop nav */}
        <div
          className="hidden md:flex gap-6 items-center"
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {member && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setSznOpen((o) => !o)}
                className="hover:text-[var(--pink)] transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  color: sznSectionActive ? "var(--pink)" : "var(--dark)",
                  fontWeight: sznSectionActive ? 800 : undefined,
                }}
              >
                szn ▾
              </button>
              {sznOpen && (
                <div
                  className="flex flex-col"
                  style={{
                    position: "absolute",
                    top: 28,
                    left: 0,
                    minWidth: 160,
                    background: "#fff",
                    border: "var(--border)",
                    zIndex: 200,
                  }}
                >
                  {sznMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSznOpen(false)}
                      className="no-underline hover:text-[var(--pink)]"
                      style={{
                        fontSize: 11,
                        fontWeight: isActive(item.href) ? 800 : 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: item.indent ? "10px 14px 10px 26px" : "10px 14px",
                        borderBottom: "1px solid #eee",
                        color: isActive(item.href) ? "var(--pink)" : "var(--dark)",
                        background: isActive(item.href) ? "var(--lav-light)" : undefined,
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline hover:text-[var(--pink)] transition-colors"
              style={{ color: isActive(link.href) ? "var(--pink)" : "var(--dark)", fontWeight: isActive(link.href) ? 800 : undefined }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {member && (
            <div className="hidden md:block" style={{ position: "relative" }}>
              <button
                onClick={toggleBell}
                title="messages"
                style={{
                  position: "relative",
                  width: 34,
                  height: 34,
                  background: "#fff",
                  border: "var(--border)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 15 }}>{"✉️"}</span>
                {unread > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      minWidth: 16,
                      height: 16,
                      padding: "0 3px",
                      borderRadius: 8,
                      background: "var(--pink)",
                      color: "var(--dark)",
                      fontSize: 9,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unread}
                  </span>
                )}
              </button>
              {bellOpen && (
                <div
                  className="flex flex-col"
                  style={{
                    position: "absolute",
                    top: 42,
                    right: 0,
                    width: 300,
                    maxHeight: 360,
                    overflowY: "auto",
                    background: "#fff",
                    border: "var(--border)",
                    zIndex: 200,
                  }}
                >
                  {broadcasts.length === 0 ? (
                    <p style={{ fontSize: 12, color: "var(--grey-light)", padding: "16px 14px" }}>No messages yet.</p>
                  ) : (
                    broadcasts.slice(0, 8).map((b) => (
                      <div key={b.id} className="p-4" style={{ borderBottom: "1px solid #eee" }}>
                        <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                          {b.title}
                        </div>
                        <p style={{ fontSize: 11, color: "var(--grey)", lineHeight: 1.6 }}>{b.body}</p>
                      </div>
                    ))
                  )}
                  <Link
                    href="/settings#messages"
                    onClick={() => setBellOpen(false)}
                    className="no-underline text-[var(--pink)]"
                    style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 14px", textAlign: "center" }}
                  >
                    see all messages
                  </Link>
                </div>
              )}
            </div>
          )}
          {member ? (
            <div className="hidden md:block" style={{ position: "relative" }}>
              <button
                onClick={() => setAccountOpen((o) => !o)}
                title="account"
                style={{
                  width: 34,
                  height: 34,
                  background: "var(--lav-light)",
                  border: "var(--border)",
                  fontFamily: "var(--font-poppins), Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "var(--dark)",
                  cursor: "pointer",
                }}
              >
                {member.name.charAt(0).toLowerCase()}
              </button>
              {accountOpen && (
                <div
                  className="flex flex-col"
                  style={{
                    position: "absolute",
                    top: 42,
                    right: 0,
                    minWidth: 160,
                    background: "#fff",
                    border: "var(--border)",
                    zIndex: 200,
                  }}
                >
                  {[
                    { href: "/goals", label: "my goals" },
                    { href: "/events", label: "workshops" },
                    { href: "/settings", label: "settings" },
                    ...(admin ? [{ href: "/admin", label: "admin" }] : []),
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAccountOpen(false)}
                      className="no-underline text-[var(--dark)] hover:text-[var(--pink)]"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "10px 14px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setAccountOpen(false);
                      handleLogout();
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "10px 14px",
                      color: "var(--pink)",
                      cursor: "pointer",
                    }}
                  >
                    log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="no-underline hidden md:block"
                style={{
                  border: "var(--border)",
                  color: "var(--dark)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "8px 14px",
                  whiteSpace: "nowrap",
                }}
              >
                member login
              </Link>
              <Link
                href="/chart"
                className="no-underline"
                style={{
                  background: "var(--pink)",
                  color: "var(--dark)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "8px 14px",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                free chart
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, lineHeight: 0 }}
            aria-label="Menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              {open ? (
                <>
                  <line x1="2" y1="2" x2="20" y2="14" stroke="var(--dark)" strokeWidth="2" />
                  <line x1="2" y1="14" x2="20" y2="2" stroke="var(--dark)" strokeWidth="2" />
                </>
              ) : (
                <>
                  <rect y="0" width="22" height="2" fill="var(--dark)" />
                  <rect y="7" width="22" height="2" fill="var(--dark)" />
                  <rect y="14" width="22" height="2" fill="var(--dark)" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden flex flex-col gap-4 px-5 pb-5"
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            borderTop: "1px solid #eee",
            paddingTop: 16,
          }}
        >
          {member &&
            sznMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="no-underline hover:text-[var(--pink)]"
                style={{
                  paddingLeft: item.indent ? 16 : undefined,
                  color: isActive(item.href) ? "var(--pink)" : "var(--dark)",
                }}
              >
                {item.label}
              </Link>
            ))}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="no-underline hover:text-[var(--pink)]"
              style={{ color: isActive(link.href) ? "var(--pink)" : "var(--dark)" }}
            >
              {link.label}
            </Link>
          ))}
          {member ? (
            <>
              <Link
                href="/settings#messages"
                onClick={() => {
                  setOpen(false);
                  if (broadcasts.length > 0) {
                    markAllBroadcastsRead(broadcasts);
                    setUnread(0);
                  }
                }}
                className="no-underline text-[var(--dark)] hover:text-[var(--pink)]"
              >
                messages{unread > 0 ? ` (${unread})` : ""}
              </Link>
              <Link href="/events" onClick={() => setOpen(false)} className="no-underline text-[var(--dark)] hover:text-[var(--pink)]">
                events
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="no-underline text-[var(--dark)] hover:text-[var(--pink)]">
                settings
              </Link>
              {admin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="no-underline text-[var(--dark)] hover:text-[var(--pink)]">
                  admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--pink)",
                  cursor: "pointer",
                }}
              >
                log out
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="no-underline text-[var(--pink)]">
              member login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
