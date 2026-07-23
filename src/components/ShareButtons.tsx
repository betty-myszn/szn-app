"use client";

import { useState } from "react";

interface ShareButtonsProps {
  text: string;
}

const btnStyle: React.CSSProperties = {
  background: "none",
  border: "1.5px solid #eee",
  padding: "6px 12px",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--dark)",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

// Realistic scope for social sharing without a backend: native share sheet where the browser
// supports it (covers Instagram Stories, Messages, etc. on mobile), direct share intents for
// X and WhatsApp (no auth needed), and a copy fallback for everywhere else, Instagram captions
// included, since there's no public API to post there directly.
export default function ShareButtons({ text }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "https://myszn.app";
  const shareText = `${text} ${url}`;

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = () => {
    navigator.share({ text, url }).catch(() => {});
  };

  const flashCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // The execCommand fallback needs to run synchronously inside the click handler to keep the
  // user-gesture context it relies on, chaining it off an async Clipboard API rejection loses
  // that context and silently fails, so branch on support up front instead of cascading.
  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText).then(flashCopied).catch(() => {});
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = shareText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    if (document.execCommand("copy")) flashCopied();
    document.body.removeChild(textarea);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {hasNativeShare && (
        <button onClick={handleNativeShare} style={btnStyle}>
          share
        </button>
      )}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
        style={btnStyle}
      >
        x / twitter
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
        style={btnStyle}
      >
        whatsapp
      </a>
      <button onClick={handleCopy} style={btnStyle}>
        {copied ? "copied ✓" : "copy for instagram"}
      </button>
    </div>
  );
}
