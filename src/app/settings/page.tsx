"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/member";
import { useMember } from "@/lib/use-member";
import { getSymbol } from "@/lib/style-data";
import { loadBroadcasts, markAllBroadcastsRead, type Broadcast } from "@/lib/broadcasts";
import { getEarnedRewardStickers } from "@/lib/stickers";
import { REWARD_STICKERS, LEO_STICKERS, type RewardStickerId } from "@/components/Stickers";
import { EMAIL_PREF_FIELDS, loadEmailPrefs, saveEmailPrefs, type EmailPrefs } from "@/lib/email-preferences";
import { updateSavedName, getSavedBirthData } from "@/lib/url-params";
import { syncBirthDataToSupabase } from "@/lib/chart-sync";
import { getMyReferralCode, getReferralCount } from "@/lib/referral";
import { isVip, hasActiveAccess, hasBillingIssue, isCancellationScheduled } from "@/lib/membership-access";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--grey-light)",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  border: "var(--border)",
  padding: "13px 16px",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

export default function SettingsPage() {
  const router = useRouter();
  const { member, ready } = useMember();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [earnedStickers, setEarnedStickers] = useState<Set<RewardStickerId>>(new Set());
  const [emailPrefs, setEmailPrefs] = useState<EmailPrefs | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!member) return;
    (async () => {
      const list = await loadBroadcasts();
      setBroadcasts(list);
      if (list.length > 0) markAllBroadcastsRead(list);
      setEarnedStickers(await getEarnedRewardStickers(member.name));
      setReferralCode(await getMyReferralCode());
      setReferralCount(await getReferralCount());
    })();
    setEmailPrefs(loadEmailPrefs());
    setNameDraft(member.name);
  }, [member]);

  const referralLink = referralCode && typeof window !== "undefined" ? `${window.location.origin}/login?ref=${referralCode}` : "";

  const handleCopyReferralLink = () => {
    if (!referralLink) return;
    navigator.clipboard?.writeText(referralLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    }).catch(() => {});
  };

  const handleSaveEmailPrefs = () => {
    if (!emailPrefs) return;
    saveEmailPrefs(emailPrefs);
    if (nameDraft.trim() && nameDraft.trim() !== member?.name) {
      updateSavedName(nameDraft.trim());
      const updated = getSavedBirthData();
      if (updated) syncBirthDataToSupabase(updated);
      window.dispatchEvent(new Event("myszn-auth-change"));
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            log in to manage your account.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  const placements = [
    { label: "sun", sign: member.placements.sun },
    { label: "moon", sign: member.placements.moon },
    { label: "rising", sign: member.placements.rising },
    { label: "venus", sign: member.placements.venus },
    { label: "mars", sign: member.placements.mars },
    { label: "jupiter", sign: member.placements.jupiter },
  ];

  return (
    <>
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-3">settings</div>
          <h1 style={{ fontFamily: poppins, fontSize: 34, fontWeight: 800, letterSpacing: "-1px" }}>
            your account.
          </h1>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {/* Membership */}
          <div style={{ border: "var(--border)" }}>
            <div className="p-6" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px" }}>membership</h2>
            </div>
            <div className="p-6">
              {member.membershipLevel === "none" ? (
                <>
                  <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 16 }}>
                    You&apos;re not a member yet, join to unlock live workshops, your full chart portal and the community.
                  </p>
                  <Link href="/membership" className="btn-pink" style={{ display: "inline-block" }}>
                    see membership options
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800 }}>
                      {isVip(member) ? "VIP Member" : "MY SZN Member"}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        background: hasBillingIssue(member) ? "#FCEBEB" : hasActiveAccess(member) ? "var(--mint)" : "#f0f0f0",
                        color: hasBillingIssue(member) ? "#A32D2D" : hasActiveAccess(member) ? "#0F6E56" : "var(--grey-light)",
                      }}
                    >
                      {hasBillingIssue(member) ? "payment issue" : hasActiveAccess(member) ? "active" : member.subscriptionStatus || "inactive"}
                    </span>
                  </div>

                  {hasBillingIssue(member) && (
                    <div className="p-4 mb-4" style={{ background: "#FCEBEB", border: "1px solid #F09595" }}>
                      <p style={{ fontSize: 13, color: "#A32D2D", lineHeight: 1.6, fontWeight: 600, marginBottom: 10 }}>
                        Payment issue. Please update your payment method to keep your access.
                      </p>
                      <a
                        href="/api/stripe/portal"
                        className="no-underline"
                        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A32D2D", textDecoration: "underline" }}
                      >
                        update payment method →
                      </a>
                    </div>
                  )}

                  {member.subscriptionCurrentPeriodEnd && (
                    <p style={{ fontSize: 13, color: "var(--grey)", marginBottom: isCancellationScheduled(member) ? 6 : 20 }}>
                      {isCancellationScheduled(member) ? "Your membership ends on " : "Renews on "}
                      <strong style={{ color: "var(--dark)" }}>
                        {new Date(member.subscriptionCurrentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </strong>
                    </p>
                  )}

                  {isCancellationScheduled(member) && (
                    <p style={{ fontSize: 12, color: "var(--grey-light)", marginBottom: 20 }}>
                      Cancellation scheduled, you&apos;ll keep full access until then.
                    </p>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    <a href="/api/stripe/portal" className="btn-pink" style={{ display: "inline-block" }}>
                      manage membership
                    </a>
                    {!isVip(member) && (
                      <Link
                        href="/membership"
                        className="no-underline"
                        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}
                      >
                        upgrade to VIP for 1:1 coaching with Betty
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <div id="messages" style={{ border: "var(--border)" }}>
            <div className="p-6" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px" }}>messages</h2>
            </div>
            {broadcasts.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--grey-light)", padding: "24px" }}>Nothing from us yet, you&apos;ll see it here the moment we send something.</p>
            ) : (
              <div className="flex flex-col">
                {broadcasts.map((b, i) => (
                  <div key={b.id} className="p-6" style={{ borderBottom: i < broadcasts.length - 1 ? "1px solid #eee" : undefined }}>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800 }}>{b.title}</span>
                      <span style={{ fontSize: 11, color: "var(--grey-light)" }}>{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.75 }}>{b.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stickers */}
          <div id="stickers" style={{ border: "var(--border)" }}>
            <div className="p-6" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 4 }}>my stickers</h2>
              <p style={{ fontSize: 12, color: "var(--grey-light)" }}>
                {earnedStickers.size} / {Object.keys(REWARD_STICKERS).length} unlocked · earned through the milestones you actually hit
              </p>
            </div>
            <div className="p-6 grid grid-cols-3 md:grid-cols-6 gap-4">
              {(Object.entries(REWARD_STICKERS) as [RewardStickerId, (typeof REWARD_STICKERS)[RewardStickerId]][]).map(([id, { label, Icon }]) => {
                const earned = earnedStickers.has(id);
                return (
                  <div key={id} className="flex flex-col items-center text-center gap-2">
                    <Icon size={48} locked={!earned} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: earned ? "var(--dark)" : "var(--grey-light)", lineHeight: 1.4 }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="px-6 pb-6">
              <div className="tag mb-3" style={{ marginTop: 4 }}>leo szn collection</div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {Object.entries(LEO_STICKERS).map(([id, { label, Icon }]) => (
                  <div key={id} className="flex flex-col items-center text-center gap-2">
                    <Icon size={40} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: "var(--grey-light)", lineHeight: 1.4 }}>{label}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 12, lineHeight: 1.6 }}>
                Every szn gets its own sticker collection, this szn&apos;s set is unlocked to browse now, more seasons roll out as the year turns.
              </p>
            </div>
          </div>

          {/* Profile */}
          <div style={{ border: "var(--border)" }}>
            <div className="p-6" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px" }}>profile</h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="settings-name" style={labelStyle}>name</label>
                <input id="settings-name" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="settings-email" style={labelStyle}>email</label>
                <input id="settings-email" value={member.email} disabled style={{ ...inputStyle, background: "#f5f5f5", color: "var(--grey-light)", cursor: "not-allowed" }} />
                <p style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 6 }}>
                  email changes need account verification, not available until real accounts are connected.
                </p>
              </div>
            </div>
          </div>

          {/* Birth data / placements */}
          <div style={{ border: "var(--border)" }}>
            <div className="p-6 flex items-center justify-between gap-4 flex-wrap" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
              <div>
                <h2 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 4 }}>your chart</h2>
                <p style={{ fontSize: 12, color: "var(--grey-light)" }}>chart looking wrong? fix your birth details and we recalculate everything.</p>
              </div>
              <Link
                href="/onboarding"
                className="no-underline"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--pink)",
                  whiteSpace: "nowrap",
                }}
              >
                edit / resubmit chart
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3">
              {placements.map((p, i) => (
                <div
                  key={p.label}
                  className="p-5"
                  style={{
                    borderRight: (i + 1) % 3 !== 0 ? "1px solid #eee" : undefined,
                    borderBottom: i < 3 ? "1px solid #eee" : undefined,
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 4 }}>
                    {p.label}
                  </div>
                  <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700 }}>
                    {getSymbol(p.sign)} {p.sign.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite */}
          <div style={{ border: "var(--border)" }}>
            <div className="p-6" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 4 }}>invite your friends</h2>
              <p style={{ fontSize: 12, color: "var(--grey-light)" }}>
                {referralCount > 0
                  ? `${referralCount} friend${referralCount === 1 ? "" : "s"} joined through your link so far.`
                  : "share your link, see who joins here."}
              </p>
            </div>
            <div className="p-6 flex items-center gap-3 flex-wrap">
              <input
                readOnly
                value={referralLink || "generating your link..."}
                onFocus={(e) => e.target.select()}
                style={{ ...inputStyle, flex: 1, minWidth: 220, color: referralLink ? "var(--dark)" : "var(--grey-light)" }}
              />
              <button
                onClick={handleCopyReferralLink}
                disabled={!referralLink}
                className="btn-pink disabled:opacity-50"
                style={{ cursor: referralLink ? "pointer" : "not-allowed", border: "none", whiteSpace: "nowrap" }}
              >
                {linkCopied ? "copied ✓" : "copy link"}
              </button>
            </div>
          </div>

          {/* Email prefs */}
          <div style={{ border: "var(--border)" }}>
            <div className="p-6" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
              <h2 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px" }}>emails</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {EMAIL_PREF_FIELDS.map((field) => (
                <label key={field.id} className="flex items-start gap-3" style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={emailPrefs?.[field.id] ?? false}
                    onChange={(e) => setEmailPrefs((prev) => (prev ? { ...prev, [field.id]: e.target.checked } : prev))}
                    style={{ marginTop: 3, accentColor: "var(--pink)" }}
                  />
                  <span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>{field.label}</span>
                    <span style={{ fontSize: 12, color: "var(--grey-light)" }}>{field.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSaveEmailPrefs} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
              save changes
            </button>
            {justSaved && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)" }}>saved.</span>
            )}
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              style={{
                background: "none",
                border: "var(--border)",
                padding: "12px 24px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                color: "var(--dark)",
              }}
            >
              log out
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
