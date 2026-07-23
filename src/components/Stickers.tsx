"use client";

import { useId } from "react";

// Shared MY SZN sticker visual language: glossy pink/gold gradients, a soft highlight, a subtle
// drop shadow, same premium-not-cartoonish treatment as the disco planet. Each sticker is a
// self-contained SVG so any number of instances can render on one page without id collisions
// (gradient ids are namespaced per-instance via useId).

export interface StickerProps {
  size?: number;
  locked?: boolean; // desaturated + dimmed, for milestones not yet earned
}

function useGradientIds() {
  const base = useId();
  return {
    pink: `${base}-pink`,
    gold: `${base}-gold`,
    silver: `${base}-silver`,
  };
}

function GradientDefs({ ids }: { ids: ReturnType<typeof useGradientIds> }) {
  return (
    <defs>
      <radialGradient id={ids.pink} cx="35%" cy="28%" r="75%">
        <stop offset="0%" stopColor="#ffe9f5" />
        <stop offset="35%" stopColor="#ff8ecb" />
        <stop offset="100%" stopColor="#e01470" />
      </radialGradient>
      <linearGradient id={ids.gold} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#fff3cf" />
        <stop offset="50%" stopColor="#f3c65c" />
        <stop offset="100%" stopColor="#c9922a" />
      </linearGradient>
      <radialGradient id={ids.silver} cx="35%" cy="28%" r="75%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#dfe3f0" />
        <stop offset="100%" stopColor="#a6acc4" />
      </radialGradient>
    </defs>
  );
}

function Wrap({ size = 48, locked, children }: { size?: number; locked?: boolean; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={{
        filter: locked ? "grayscale(0.85) opacity(0.4)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.18))",
        transition: "filter 0.2s",
      }}
    >
      {children}
    </svg>
  );
}

// ── Reward stickers, unlocked by real milestones ──────────────────────────

export function StickerSparklyStar({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path
        d="M32 6 L38 26 L58 32 L38 38 L32 58 L26 38 L6 32 L26 26 Z"
        fill={`url(#${ids.gold})`}
      />
      <circle cx="32" cy="32" r="5" fill="#fff" opacity="0.85" />
      <circle cx="48" cy="16" r="2.5" fill="#fff" opacity="0.9" />
    </Wrap>
  );
}

export function StickerGlossyMoon({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path
        d="M40 8 A24 24 0 1 0 40 56 A19 19 0 0 1 40 8 Z"
        fill={`url(#${ids.silver})`}
      />
      <ellipse cx="24" cy="22" rx="7" ry="4.5" fill="#fff" opacity="0.55" />
    </Wrap>
  );
}

export function StickerCrystalHeart({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path
        d="M32 54 C14 42 8 30 8 21 C8 12 16 8 22 12 C27 15 32 22 32 22 C32 22 37 15 42 12 C48 8 56 12 56 21 C56 30 50 42 32 54 Z"
        fill={`url(#${ids.pink})`}
      />
      <path d="M32 22 L26 30 L32 40 L38 30 Z" fill="#fff" opacity="0.5" />
    </Wrap>
  );
}

export function StickerMiniCrown({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path
        d="M10 46 L10 24 L21 34 L32 18 L43 34 L54 24 L54 46 Z"
        fill={`url(#${ids.gold})`}
      />
      <rect x="10" y="46" width="44" height="8" rx="1.5" fill={`url(#${ids.gold})`} />
      <circle cx="32" cy="18" r="3.5" fill="#fff" opacity="0.9" />
      <circle cx="10" cy="24" r="3" fill="#fff" opacity="0.8" />
      <circle cx="54" cy="24" r="3" fill="#fff" opacity="0.8" />
    </Wrap>
  );
}

export function StickerShootingStar({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path d="M50 14 L14 50" stroke={`url(#${ids.pink})`} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path
        d="M50 14 L54 22 L62 26 L54 30 L50 38 L46 30 L38 26 L46 22 Z"
        fill={`url(#${ids.gold})`}
      />
      <circle cx="18" cy="46" r="2" fill="#fff" opacity="0.8" />
    </Wrap>
  );
}

export function StickerChampagneGlass({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path d="M20 10 L44 10 L34 34 L34 50 L30 50 L30 34 Z" fill={`url(#${ids.silver})`} opacity="0.9" />
      <rect x="26" y="50" width="12" height="4" rx="1" fill={`url(#${ids.silver})`} />
      <circle cx="27" cy="17" r="2" fill={`url(#${ids.gold})`} />
      <circle cx="35" cy="22" r="1.6" fill={`url(#${ids.gold})`} />
      <circle cx="30" cy="26" r="1.3" fill={`url(#${ids.gold})`} />
    </Wrap>
  );
}

// ── Leo season collection (template for the other 11 signs) ──────────────

export function StickerDiscoSun({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => (
        <rect key={deg} x="30.5" y="4" width="3" height="12" rx="1.5" fill={`url(#${ids.gold})`} transform={`rotate(${deg} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="16" fill={`url(#${ids.pink})`} />
      <ellipse cx="27" cy="26" rx="6" ry="4" fill="#fff" opacity="0.45" />
    </Wrap>
  );
}

export function StickerSpotlight({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path d="M24 8 L40 8 L54 56 L10 56 Z" fill={`url(#${ids.gold})`} opacity="0.35" />
      <ellipse cx="32" cy="10" rx="9" ry="4" fill={`url(#${ids.gold})`} />
    </Wrap>
  );
}

export function StickerPinkFlame({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path
        d="M32 6 C40 18 46 24 46 34 C46 46 40 56 32 58 C24 56 18 46 18 34 C18 27 22 24 24 20 C24 28 28 30 30 28 C27 20 28 12 32 6 Z"
        fill={`url(#${ids.pink})`}
      />
      <path d="M32 30 C36 36 38 40 38 45 C38 50 35 54 32 55 C29 54 26 50 26 45 C26 41 29 39 32 30 Z" fill={`url(#${ids.gold})`} opacity="0.85" />
    </Wrap>
  );
}

export function StickerGoldSparkles({ size, locked }: StickerProps) {
  const ids = useGradientIds();
  return (
    <Wrap size={size} locked={locked}>
      <GradientDefs ids={ids} />
      <path d="M18 10 L21 18 L29 21 L21 24 L18 32 L15 24 L7 21 L15 18 Z" fill={`url(#${ids.gold})`} />
      <path d="M46 30 L49 38 L57 41 L49 44 L46 52 L43 44 L35 41 L43 38 Z" fill={`url(#${ids.gold})`} />
      <circle cx="44" cy="14" r="3" fill={`url(#${ids.gold})`} />
    </Wrap>
  );
}

export const REWARD_STICKERS = {
  "finished-workshop": { label: "finished a workshop", Icon: StickerChampagneGlass },
  "completed-shadow-work": { label: "completed shadow work", Icon: StickerGlossyMoon },
  "posted-in-community": { label: "posted in the community", Icon: StickerSparklyStar },
  "finished-challenge": { label: "finished a seasonal challenge", Icon: StickerShootingStar },
  "hit-a-goal": { label: "hit a personal goal", Icon: StickerMiniCrown },
  "attended-live-session": { label: "attended a live session", Icon: StickerCrystalHeart },
} as const;

export type RewardStickerId = keyof typeof REWARD_STICKERS;

export const LEO_STICKERS = {
  "leo-disco-sun": { label: "disco sun", Icon: StickerDiscoSun },
  "leo-crown": { label: "crown", Icon: StickerMiniCrown },
  "leo-spotlight": { label: "spotlight", Icon: StickerSpotlight },
  "leo-flame": { label: "pink flames", Icon: StickerPinkFlame },
  "leo-sparkles": { label: "gold sparkles", Icon: StickerGoldSparkles },
} as const;
