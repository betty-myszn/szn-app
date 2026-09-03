"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { logout, isAdminMember } from "@/lib/member";
import { useMember } from "@/lib/use-member";
import { isFreeMember, memberHomeHref } from "@/lib/membership-access";
import { loadBroadcasts, loadReadBroadcastIds, markAllBroadcastsRead, getUnreadCount, type Broadcast } from "@/lib/broadcasts";
import { loadNotifications, unreadCount as notifUnreadCount, markAllNotificationsRead, notificationTimeAgo, type AppNotification } from "@/lib/notifications";

const memberLinks = [
  { href: "/journal", label: "journal" },
  // The blog is public, so it sits in both nav sets rather than only the guest one. A member who
  // lands on a post from search should still see where she is in the site.
  { href: "/blog", label: "blog" },
];

// Two readings of the same birth data, so they sit together under one "my chart" menu rather than
// Human Design taking its own top-level nav slot. Desktop renders this as the dropdown's contents;
// mobile has no dropdown, so it indents them under a "my chart" heading to show the same nesting.
const chartMenu = [
  { href: "/my-chart", label: "astrology chart" },
  { href: "/human-design", label: "human design chart" },
];

// The live classes and their recordings, one menu. Replays used to be reachable only from inside
// the workshops page or a dashboard banner, so a member who wanted to rewatch a class had no
// obvious door from the nav. Naming the section "workshops" for members too (it read "events"
// here and "workshops" everywhere else) keeps one word for one thing across the whole site.
const workshopsMenu = [
  { href: "/events", label: "workshops" },
  { href: "/events/replays", label: "replays", indent: true },
];

// The free tier is a different platform, not a dimmed version of the paid one, so it gets its own
// nav rather than memberLinks with things greyed out. Three doors only: her home, the blog and the
// chat rooms. Journal, goals, challenges and the chart pages are all absent by
// design, because showing a free member a link that bounces her to /membership reads as being
// locked out. My Season and the workshops are teased ON /home as things to want, so they're
// deliberately not nav items either.
const freeLinks = [
  { href: "/home", label: "home" },
  { href: "/community", label: "community" },
  { href: "/chart", label: "my chart" },
  { href: "/blog", label: "blog" },
];

// The guest menu is four doors, not six. Home and the paid offer stand alone; everything that is
// browsing rather than deciding goes under EXPLORE, so the free trial button is competing with two
// links instead of six. Coaching is a different business (The Cosmic Co) and is marked as leaving
// the site, which is what the arrow is for.
const guestLinks = [
  { href: "/", label: "home" },
  { href: "/membership", label: "join my szn" },
];

const exploreMenu = [
  // The free birth chart is the lowest-friction way in and the biggest single source of signups, so
  // it sits at the top of the menu it now lives in.
  { href: "/chart", label: "free birth chart" },
  { href: "/seasons", label: "seasons" },
  { href: "/events", label: "workshops" },
  { href: "/podcast", label: "podcast" },
  { href: "/blog", label: "blog" },
];

/** Betty's coaching business, a separate site. Opens in a new tab so a visitor reading MY SZN does
 *  not lose her place, and carries rel="noopener" because a target="_blank" link without it hands
 *  the opened page a handle back to this one. */
const COACHING_URL = "https://thecosmicco.com";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [workshopsOpen, setWorkshopsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (exploreCloseTimer.current) clearTimeout(exploreCloseTimer.current);
  }, []);
  const [bellOpen, setBellOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [unread, setUnread] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [notifUnread, setNotifUnread] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { member } = useMember();
  const admin = member ? isAdminMember(member) : false;

  // Three platforms, three navs. `paidMember` is what the paid-platform chrome (the my szn link,
  // the chart dropdown, the community/challenges menu) keys off, so a free member never sees a door
  // she can't open.
  const freeMember = isFreeMember(member);
  const paidMember = !!member && !freeMember;
  const links = member ? (freeMember ? freeLinks : memberLinks) : guestLinks;
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href + "/"));
  const sznActive = pathname?.startsWith("/dashboard") || pathname?.startsWith("/your-season");
  // Highlights EXPLORE while the visitor is on any page inside it, so she can see where she is.
  const exploreActive = exploreMenu.some((item) => isActive(item.href));
  const chartSectionActive = pathname?.startsWith("/my-chart") || pathname?.startsWith("/human-design");
  const workshopsSectionActive = pathname?.startsWith("/events");

  useEffect(() => {
    if (!member) return;
    (async () => {
      const list = await loadBroadcasts();
      setBroadcasts(list);
      setUnread(getUnreadCount(list, await loadReadBroadcastIds()));
    })();
    (async () => {
      const n = await loadNotifications();
      setNotifs(n);
      setNotifUnread(notifUnreadCount(n));
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

  const toggleNotif = () => {
    setNotifOpen((o) => {
      const next = !o;
      if (next && notifUnread > 0) {
        markAllNotificationsRead();
        setNotifUnread(0);
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
          href={memberHomeHref(member)}
          className="no-underline flex items-center gap-1"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.5px",
            color: "var(--dark)",
          }}
        >
          <Image
            src="/disco-planet-logo.png"
            alt=""
            aria-hidden
            width={840}
            height={532}
            priority
            style={{ width: "auto", height: 28 }}
          />
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
          {paidMember && (
            <Link
              href="/dashboard"
              className="no-underline hover:text-[var(--pink)] transition-colors"
              style={{
                color: sznActive ? "var(--pink)" : "var(--dark)",
                fontWeight: sznActive ? 800 : undefined,
              }}
            >
              my szn
            </Link>
          )}
          {paidMember && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setChartOpen((o) => !o)}
                className="hover:text-[var(--pink)] transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  color: chartSectionActive ? "var(--pink)" : "var(--dark)",
                  fontWeight: chartSectionActive ? 800 : undefined,
                }}
              >
                my chart ▾
              </button>
              {chartOpen && (
                <div
                  className="flex flex-col"
                  style={{
                    position: "absolute",
                    top: 28,
                    left: 0,
                    minWidth: 180,
                    background: "#fff",
                    border: "var(--border)",
                    zIndex: 200,
                  }}
                >
                  {chartMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setChartOpen(false)}
                      className="no-underline hover:text-[var(--pink)]"
                      style={{
                        fontSize: 11,
                        fontWeight: isActive(item.href) ? 800 : 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "10px 14px",
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
          {paidMember && (
            <Link
              href="/community"
              className="no-underline hover:text-[var(--pink)] transition-colors"
              style={{
                color: isActive("/community") ? "var(--pink)" : "var(--dark)",
                fontWeight: isActive("/community") ? 800 : undefined,
              }}
            >
              chat rooms
            </Link>
          )}
          {paidMember && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setWorkshopsOpen((o) => !o)}
                className="hover:text-[var(--pink)] transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  color: workshopsSectionActive ? "var(--pink)" : "var(--dark)",
                  fontWeight: workshopsSectionActive ? 800 : undefined,
                }}
              >
                workshops ▾
              </button>
              {workshopsOpen && (
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
                  {workshopsMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setWorkshopsOpen(false)}
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
          {!member && (
            <div
              style={{ position: "relative", paddingBottom: 14, marginBottom: -14 }}
              onMouseEnter={() => {
                if (exploreCloseTimer.current) clearTimeout(exploreCloseTimer.current);
              }}
              onMouseLeave={() => {
                // Grace period rather than an instant close, so a mouse that clips the edge of the
                // menu on its way somewhere else does not make the panel blink.
                if (exploreCloseTimer.current) clearTimeout(exploreCloseTimer.current);
                exploreCloseTimer.current = setTimeout(() => setExploreOpen(false), 180);
              }}
            >
              <button
                type="button"
                onClick={() => setExploreOpen((v) => !v)}
                onMouseEnter={() => setExploreOpen(true)}
                className="hover:text-[var(--pink)] transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  color: exploreActive ? "var(--pink)" : "var(--dark)",
                  fontWeight: exploreActive ? 800 : undefined,
                }}
              >
                explore &#9662;
              </button>
              {exploreOpen && (
                <div
                  className="flex flex-col"
                  style={{
                    position: "absolute",
                    top: 24,
                    left: 0,
                    minWidth: 200,
                    background: "#fff",
                    border: "var(--border)",
                    zIndex: 200,
                  }}
                >
                  {exploreMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setExploreOpen(false)}
                      className="no-underline hover:text-[var(--pink)]"
                      style={{
                        fontSize: 11,
                        fontWeight: isActive(item.href) ? 800 : 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "10px 14px",
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
          {!member && (
            <a
              href={COACHING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:text-[var(--pink)] transition-colors"
              style={{ color: "var(--dark)" }}
            >
              coaching &#8599;
            </a>
          )}
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
          {member && (
            <div className="hidden md:block" style={{ position: "relative" }}>
              <button
                onClick={toggleNotif}
                title="notifications"
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
                <span style={{ fontSize: 15 }}>{"🔔"}</span>
                {notifUnread > 0 && (
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
                    {notifUnread}
                  </span>
                )}
              </button>
              {notifOpen && (
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
                  {notifs.length === 0 ? (
                    <p style={{ fontSize: 12, color: "var(--grey-light)", padding: "16px 14px" }}>No notifications yet.</p>
                  ) : (
                    notifs.slice(0, 8).map((n) => {
                      const inner = (
                        <>
                          <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                            {n.title}
                          </div>
                          {n.body && <p style={{ fontSize: 11, color: "var(--grey)", lineHeight: 1.6 }}>{n.body}</p>}
                          <div style={{ fontSize: 9, color: "var(--grey-light)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {notificationTimeAgo(n.createdAt)}
                          </div>
                        </>
                      );
                      return n.link ? (
                        <Link
                          key={n.id}
                          href={n.link}
                          onClick={() => setNotifOpen(false)}
                          className="no-underline text-[var(--dark)] p-4"
                          style={{ borderBottom: "1px solid #eee", background: n.read ? "#fff" : "var(--pink-bg)" }}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div key={n.id} className="p-4" style={{ borderBottom: "1px solid #eee", background: n.read ? "#fff" : "var(--pink-bg)" }}>
                          {inner}
                        </div>
                      );
                    })
                  )}
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
                  {/* Events used to live here, it's a top-level member link now. */}
                  {[
                    // Goals are part of the paid platform, so the free tier's account menu is just
                    // settings (and admin, for Betty's own account).
                    ...(paidMember ? [{ href: "/goals", label: "my goals" }] : []),
                    ...(paidMember ? [{ href: "/settings#membership", label: "membership & billing" }] : []),
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
                href="/free-trial"
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
                💖 start free trial
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
          {paidMember && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="no-underline hover:text-[var(--pink)]"
              style={{ color: sznActive ? "var(--pink)" : "var(--dark)" }}
            >
              my szn
            </Link>
          )}
          {paidMember && (
            <>
              {/* A real toggle, not a heading. The desktop nav is `hidden md:flex`, so below 768px
                  this panel is the only menu there is, and leaving the two charts permanently
                  expanded here meant "my chart" wasn't a dropdown on exactly the screens most
                  people use. Shares chartOpen with the desktop dropdown deliberately: both are
                  mounted at once (the desktop row is only display:none below md, not unmounted),
                  and one open/closed state across both is the behaviour you want anyway. */}
              <button
                type="button"
                onClick={() => setChartOpen((o) => !o)}
                aria-expanded={chartOpen}
                className="hover:text-[var(--pink)] transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                  color: chartSectionActive ? "var(--pink)" : "var(--dark)",
                  fontWeight: chartSectionActive ? 800 : undefined,
                }}
              >
                my chart {chartOpen ? "▴" : "▾"}
              </button>
              {chartOpen &&
                chartMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setChartOpen(false);
                      setOpen(false);
                    }}
                    className="no-underline hover:text-[var(--pink)]"
                    style={{
                      paddingLeft: 16,
                      color: isActive(item.href) ? "var(--pink)" : "var(--dark)",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
            </>
          )}
          {paidMember && (
            <Link
              href="/community"
              onClick={() => setOpen(false)}
              className="no-underline hover:text-[var(--pink)]"
              style={{ color: isActive("/community") ? "var(--pink)" : "var(--dark)" }}
            >
              chat rooms
            </Link>
          )}
          {paidMember && (
            <>
              {/* Same toggle pattern as "my chart" and "community": below 768px the desktop row is
                  display:none, so this panel is the only nav there is and replays need their own
                  visible door here too. Shares workshopsOpen with the desktop dropdown by design. */}
              <button
                type="button"
                onClick={() => setWorkshopsOpen((o) => !o)}
                aria-expanded={workshopsOpen}
                className="hover:text-[var(--pink)] transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                  color: workshopsSectionActive ? "var(--pink)" : "var(--dark)",
                  fontWeight: workshopsSectionActive ? 800 : undefined,
                }}
              >
                workshops {workshopsOpen ? "▴" : "▾"}
              </button>
              {workshopsOpen &&
                workshopsMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setWorkshopsOpen(false);
                      setOpen(false);
                    }}
                    className="no-underline hover:text-[var(--pink)]"
                    style={{
                      paddingLeft: item.indent ? 16 : undefined,
                      color: isActive(item.href) ? "var(--pink)" : "var(--dark)",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
            </>
          )}
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
          {!member && (
            <>
              {/* No dropdown on mobile, so the nesting is shown by indenting, the same way the
                  member menus already handle their sub-items. */}
              <div style={{ fontWeight: 800, color: exploreActive ? "var(--pink)" : "var(--dark)" }}>explore</div>
              {exploreMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="no-underline hover:text-[var(--pink)]"
                  style={{ paddingLeft: 16, color: isActive(item.href) ? "var(--pink)" : "var(--dark)" }}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={COACHING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="no-underline hover:text-[var(--pink)]"
                style={{ color: "var(--dark)" }}
              >
                coaching &#8599;
              </a>
            </>
          )}
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
              <Link
                href="/community"
                onClick={() => {
                  setOpen(false);
                  if (notifUnread > 0) {
                    markAllNotificationsRead();
                    setNotifUnread(0);
                  }
                }}
                className="no-underline text-[var(--dark)] hover:text-[var(--pink)]"
              >
                notifications{notifUnread > 0 ? ` (${notifUnread})` : ""}
              </Link>
              {/* Events comes through the shared `links` list above now, no separate entry. */}
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
            <>
              <Link
                href="/free-trial"
                onClick={() => setOpen(false)}
                className="no-underline"
                style={{ color: "var(--pink)", fontWeight: 800 }}
              >
                💖 start free trial
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} className="no-underline text-[var(--pink)]">
                member login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
