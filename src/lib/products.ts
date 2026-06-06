import type { SavedPlacements } from "@/lib/url-params";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "@/types/chart";

export function getSymbol(sign: string): string {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  return idx >= 0 ? ZODIAC_SYMBOLS[idx] : "";
}

export const VENUS_PRODUCTS: Record<string, { scent: string; style: string }> = {
  Aries: { scent: "Fire & Musk", style: "Red Statement Pieces" },
  Taurus: { scent: "Rose & Sandalwood", style: "Cashmere Essentials" },
  Gemini: { scent: "Citrus & Verbena", style: "Mix-Match Accessories" },
  Cancer: { scent: "Moonflower & Vanilla", style: "Silk & Linen Layers" },
  Leo: { scent: "Gold & Amber", style: "Bold Prints & Jewels" },
  Virgo: { scent: "Lavender & Cedar", style: "Tailored Minimals" },
  Libra: { scent: "Peony & Champagne", style: "Romantic Coordinates" },
  Scorpio: { scent: "Oud & Black Orchid", style: "Dark Femme Edit" },
  Sagittarius: { scent: "Saffron & Leather", style: "Wanderlust Wardrobe" },
  Capricorn: { scent: "Vetiver & Suede", style: "Power Dressing Edit" },
  Aquarius: { scent: "Electric Ozone & Iris", style: "Avant-Garde Capsule" },
  Pisces: { scent: "Sea Salt & Jasmine", style: "Ethereal Layers" },
};

export const RISING_VIBES: Record<string, { desc: string; energy: string }> = {
  Aries: { desc: "bold, fierce, and unapologetically first", energy: "fierce, magnetic, ahead of everyone else in the room" },
  Taurus: { desc: "luxe, sensual, and effortlessly expensive-looking", energy: "luxurious, grounded, radiating wealth energy" },
  Gemini: { desc: "playful, trend-setting, and never boring", energy: "versatile, witty, the most interesting person in every room" },
  Cancer: { desc: "soft, romantic, and quietly powerful", energy: "nurturing, intuitive, giving main character-in-a-romcom vibes" },
  Leo: { desc: "dramatic, golden, and impossible to ignore", energy: "magnetic, regal, born to be looked at" },
  Virgo: { desc: "minimal, curated, and devastatingly chic", energy: "polished, intentional, giving 'she has her life together' energy" },
  Libra: { desc: "balanced, beautiful, and gallery-opening gorgeous", energy: "charming, stylish, the aesthetic benchmark for everyone around you" },
  Scorpio: { desc: "magnetic, mysterious, and darkly glamorous", energy: "intense, alluring, giving 'don't mess with me but also please do' energy" },
  Sagittarius: { desc: "adventurous, eclectic, and cosmopolitan cool", energy: "free-spirited, worldly, the one with the best stories" },
  Capricorn: { desc: "powerful, timeless, and effortlessly authoritative", energy: "ambitious, sleek, giving CEO-on-holiday realness" },
  Aquarius: { desc: "electric, original, and ahead of everyone", energy: "innovative, cool, giving 'is she from the future?' energy" },
  Pisces: { desc: "dreamy, ethereal, and hauntingly beautiful", energy: "mystical, artistic, mermaid-off-duty glamour" },
};

export const PRODUCT_IMAGES: Record<string, { gradient: string; overlay: string }> = {
  fashion: { gradient: "linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)", overlay: "👗" },
  rituals: { gradient: "linear-gradient(135deg, #2d1b4e 0%, #5b3a8c 50%, #2d1b4e 100%)", overlay: "🕯️" },
  "money mindset": { gradient: "linear-gradient(135deg, #1a3a2a 0%, #2d6b4a 50%, #1a3a2a 100%)", overlay: "✨" },
  wellness: { gradient: "linear-gradient(135deg, #3a2a1a 0%, #6b4a2d 50%, #3a2a1a 100%)", overlay: "🌿" },
  beauty: { gradient: "linear-gradient(135deg, #3a1a2a 0%, #8c3a5b 50%, #3a1a2a 100%)", overlay: "🌹" },
};

export interface Product {
  slug: string;
  icon: string;
  bg: string;
  placement: string;
  badge: string;
  cat: string;
  name: string;
  price: string;
  desc: string;
  whyYou: string;
  includes: string[];
  iconColor?: string;
}

export function generateProducts(placements: SavedPlacements): Product[] {
  const venusProduct = VENUS_PRODUCTS[placements.venus] || VENUS_PRODUCTS["Leo"];
  const risingVibe = RISING_VIBES[placements.rising] || RISING_VIBES["Aquarius"];

  return [
    {
      slug: `${placements.venus.toLowerCase()}-venus-${venusProduct.style.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      icon: "♀",
      bg: "var(--pink-light)",
      placement: `venus in ${placements.venus.toLowerCase()}`,
      badge: "for you",
      cat: "fashion",
      name: `${placements.venus} Venus ${venusProduct.style}`,
      price: "$186",
      desc: `Curated specifically for your Venus in ${placements.venus} energy. These pieces match how you express beauty, attract love, and show up in the world. Every item chosen to amplify your natural magnetism.`,
      whyYou: `Your Venus is in ${placements.venus}, which means you're drawn to ${venusProduct.style.toLowerCase()}. These pieces are designed to make you feel like the most irresistible version of yourself.`,
      includes: ["5 curated fashion pieces", "Styling guide for your Venus sign", "Colour palette card", "Lookbook PDF"],
    },
    {
      slug: `${placements.rising.toLowerCase()}-rising-edit`,
      icon: "↑",
      bg: "#E0F5EE",
      placement: `${placements.rising.toLowerCase()} rising`,
      badge: "szn pick",
      cat: "fashion",
      name: `${placements.rising} Rising Edit`,
      price: "$220",
      desc: `Your rising sign is how the world sees you before you even speak. This capsule is curated to your ${placements.rising} Rising energy: ${risingVibe.desc}. Dress the frequency you broadcast.`,
      whyYou: `With ${placements.rising} Rising, your vibe is ${risingVibe.energy}. These pieces are chosen to amplify that energy and make your first impression unforgettable.`,
      includes: ["5-piece capsule wardrobe edit", "Rising sign style manifesto", "How to dress your Ascendant guide", "Seasonal styling notes"],
    },
    {
      slug: `${placements.moon.toLowerCase()}-moon-ceremony-kit`,
      icon: "☽",
      bg: "var(--lav-light)",
      placement: `moon in ${placements.moon.toLowerCase()}`,
      badge: "",
      cat: "rituals",
      name: `${placements.moon} Moon Ceremony Kit`,
      price: "$64",
      desc: `A ritual kit designed for your ${placements.moon} Moon. Your emotional world craves specific types of nourishment and this kit delivers exactly that through curated crystals, herbs, candles, and guided ceremony instructions.`,
      whyYou: `Your Moon in ${placements.moon} means you process emotions in a very specific way. This kit honours that and gives you the tools to create sacred space that actually feels right for YOU.`,
      includes: ["Curated crystal set", "Herbal blend for your Moon sign", "Soy candle in your Moon's scent", "Guided ceremony card deck", "Moon journal pages"],
    },
    {
      slug: `jupiter-in-${placements.jupiter.toLowerCase()}-abundance-journal`,
      icon: "♃",
      bg: "var(--dark)",
      placement: `jupiter in ${placements.jupiter.toLowerCase()}`,
      badge: "bestseller",
      cat: "money mindset",
      name: `Jupiter in ${placements.jupiter} Abundance Journal`,
      price: "$38",
      iconColor: "var(--lav)",
      desc: `Your Jupiter placement is your personal abundance code. This journal is pre-loaded with prompts, scripting templates, and manifestation methods designed specifically for how Jupiter in ${placements.jupiter} attracts wealth and expansion.`,
      whyYou: `Jupiter in ${placements.jupiter} means abundance flows to you in a very specific way. Generic manifestation advice won't cut it. This journal speaks YOUR cosmic money language.`,
      includes: ["90-day guided journal", "Jupiter sign manifestation method", "Money mindset prompts", "Abundance tracking pages", "Scripting templates"],
    },
    {
      slug: `chiron-in-${placements.chiron.toLowerCase()}-healing-course`,
      icon: "⚷",
      bg: "var(--cream)",
      placement: `chiron in ${placements.chiron.toLowerCase()}`,
      badge: "",
      cat: "wellness",
      name: `Chiron in ${placements.chiron} Healing Course`,
      price: "$97",
      desc: `Your Chiron in ${placements.chiron} reveals the core wound you came here to heal and the extraordinary gift that lives on the other side. This 6-week course takes you deep into understanding, processing, and transforming your Chiron wound into your greatest superpower.`,
      whyYou: `Chiron in ${placements.chiron} carries a very specific wound pattern. This course doesn't do surface-level healing. It goes straight to the root of YOUR pattern and gives you the tools to finally release it.`,
      includes: ["6-week video course", "EFT tapping sequences", "Guided meditations", "Chiron journal workbook", "Community access"],
    },
    {
      slug: `venus-in-${placements.venus.toLowerCase()}-${venusProduct.scent.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      icon: "♀",
      bg: "var(--gold)",
      placement: `venus in ${placements.venus.toLowerCase()}`,
      badge: "new",
      cat: "beauty",
      name: `Venus in ${placements.venus} ${venusProduct.scent} Collection`,
      price: "$78",
      desc: `Scent is one of the most powerful ways to activate your Venus energy. This collection features notes of ${venusProduct.scent.toLowerCase()} chosen specifically for Venus in ${placements.venus}. Because smelling like your chart is the ultimate power move.`,
      whyYou: `Venus in ${placements.venus} is drawn to very specific scent profiles. These aren't random picks. Every note was chosen to resonate with your Venus placement and make you feel absolutely divine.`,
      includes: ["Eau de parfum (30ml)", "Body oil", "Scented candle", "Venus activation ritual card"],
    },
  ];
}
