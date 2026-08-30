import { HOUSE_MEANINGS, ordinalHouse } from "@/lib/interpretations";
import type { ActivatedPlacement } from "@/types/chart";

// Turns a computed transit-to-natal contact into a real reading, in the MY SZN voice.
//
// The rule Betty set for the eclipse work applies here too: never define the planet ("Venus rules
// love and money"). Interpret the COMBINATION, so what the transiting planet is DOING lands on what
// the natal placement actually IS, in the house it lives in. Two members with the same transit but
// different natal placements get genuinely different readings.
//
// Everything here is pure text composition. The astrology itself (positions, orbs, applying) is
// computed from the Swiss Ephemeris in transits.ts; nothing in this file decides what is true.

// The same planet does not behave the same way through a square as through a trine. Saturn by hard
// aspect grinds; Saturn by trine steadies and builds. Using one verb for both was astrologically
// wrong, so the harder planets get a supportive variant used for trines and sextiles.
const TRANSIT_ACTION_SUPPORTIVE: Record<string, string> = {
  Mars: "is giving useful energy to",
  Saturn: "is steadying and giving structure to",
  Uranus: "is opening up fresh room in",
  Neptune: "is adding imagination to",
  Pluto: "is quietly deepening",
  Chiron: "is helping you make peace with",
};

// What the TRANSITING planet is doing while it is here. Present tense, active.
const TRANSIT_ACTION: Record<string, string> = {
  Sun: "is shining a light on",
  Mercury: "is putting words and thinking around",
  Venus: "is softening and sweetening",
  Mars: "is lighting a fire under",
  Jupiter: "is expanding",
  Saturn: "is applying real pressure to",
  Uranus: "is disrupting",
  Neptune: "is blurring the edges of",
  Pluto: "is transforming, at the root,",
  Chiron: "is pressing on the tender part of",
  "North Node": "is pulling forward",
};

// What the NATAL placement is in her: the thing being worked on.
const NATAL_SUBJECT: Record<string, string> = {
  Sun: "your sense of who you are",
  Moon: "your emotional wiring and what you need to feel safe",
  Mercury: "how you think, speak and make decisions",
  Venus: "how you love, attract and decide what you are worth",
  Mars: "your drive, your anger and how you go after things",
  Jupiter: "where you expand and what you believe is possible",
  Saturn: "your discipline, your fears and where you are being built into an authority",
  Uranus: "your need for freedom and the part of you that breaks rules",
  Neptune: "your imagination, your intuition and your blind spots",
  Pluto: "your deepest power and the things you would rather not look at",
  Chiron: "your core wound and where you are quietly still healing",
  "North Node": "your growth direction, the way your chart keeps pointing you",
  "South Node": "the familiar pattern you keep returning to",
  Ascendant: "the way you meet the world and how people first read you",
  Midheaven: "your career, your reputation and the direction your life visibly points in",
};

// How the contact behaves. Kept honest: a square is not a disaster and a trine is not a lottery win.
const ASPECT_BEHAVIOUR: Record<string, string> = {
  conjunction: "They are sitting at the same degree, so this is direct and hard to look away from.",
  opposition: "They are facing each other across the chart, so this tends to arrive through other people, or as a pull in two directions that wants balancing rather than winning.",
  square: "This one comes with friction, which is exactly what makes something actually happen instead of staying a thought.",
  trine: "This one flows, which is its own catch: easy support slides past unnoticed unless you reach for it.",
  sextile: "This is an opening rather than a shove. It waits to be taken, so it rewards a deliberate move.",
};

export interface TransitContactReading {
  /** e.g. "Saturn is applying real pressure to your Venus" */
  headline: string;
  /** two or three sentences interpreting the combination in her house */
  body: string;
  /** "exact now" / "building" / "easing off" */
  timing: string;
  orb: number;
}

export function composeTransitContact(
  p: ActivatedPlacement,
  applying: boolean | undefined
): TransitContactReading {
  const harmonious = p.aspectType === "trine" || p.aspectType === "sextile";
  const action =
    (harmonious ? TRANSIT_ACTION_SUPPORTIVE[p.activatedBy] : undefined) ??
    TRANSIT_ACTION[p.activatedBy] ??
    "is activating";
  const subject = NATAL_SUBJECT[p.natalPlanet] ?? "this part of you";
  const behaviour = ASPECT_BEHAVIOUR[p.aspectType] ?? "";
  const house = HOUSE_MEANINGS[Math.min(Math.max(p.natalHouse, 1), 12) - 1];

  const headline = `${p.activatedBy} ${action} your ${p.natalPlanet}`;

  // Exactness is a real signal: inside a degree it is being felt now, wider is background.
  const timing =
    p.orb <= 1
      ? applying === false
        ? "exact now, easing off"
        : "exact now"
      : applying
        ? "building"
        : "easing off";

  // The Ascendant and Midheaven ARE house cusps, so "sits in your 10th house" reads as a mistake to
  // anyone who knows their chart. Angles get their own phrasing.
  const isAngle = p.natalPlanet === "Ascendant" || p.natalPlanet === "Midheaven";
  const placementLine = isAngle
    ? `Your ${p.natalPlanet} is at ${p.natalSign.toLowerCase()}, the cusp of your ${ordinalHouse(p.natalHouse)} house, so this is landing on ${subject}, and it plays out through ${house.lifeAreas.slice(0, 2).join(" and ")}.`
    : `Your ${p.natalPlanet} sits in ${p.natalSign.toLowerCase()} in your ${ordinalHouse(p.natalHouse)} house, so this is landing on ${subject}, and it plays out through ${house.lifeAreas.slice(0, 2).join(" and ")}.`;

  const body = [
    placementLine,
    behaviour,
    p.orb <= 1
      ? `It is within a degree of exact, so this is the one you are most likely to actually be feeling right now.`
      : `It is ${p.orb.toFixed(1)} degrees off exact, so it reads more as the weather behind your week than as a single event.`,
  ]
    .filter(Boolean)
    .join(" ");

  return { headline, body, timing, orb: p.orb };
}
