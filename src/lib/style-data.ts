import { ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "@/types/chart";

export function getSymbol(sign: string): string {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  return idx >= 0 ? ZODIAC_SYMBOLS[idx] : "";
}

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

export const VENUS_STYLE: Record<string, { scent: string; style: string }> = {
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

export const VENUS_STYLE_NOTES: Record<
  string,
  { wear: string; why: string; colours: string[]; signature: string; avoid: string; texture: string }
> = {
  Aries: {
    wear: "Bold statement pieces, sharp tailoring, and red, always red. You dress to arrive, not to blend.",
    why: "Your Venus in Aries is attracted to bold, confident pieces that radiate fire energy. You don't do subtle.",
    colours: ["red", "black", "white", "gold"],
    signature: "a single sharp accessory that reads as a decision, not an accident, a bold shoe, a strong shoulder, a red lip.",
    avoid: "anything overly fussy or delicate, if a piece needs careful handling to look good, it's not for you.",
    texture: "crisp, structured fabrics that hold their shape when you move fast, because you always move fast.",
  },
  Taurus: {
    wear: "Cashmere, silk, and anything that feels expensive against your skin. Quality over quantity, texture over trend.",
    why: "Your Venus in Taurus craves luxury you can feel. You invest in pieces that last and get better with time.",
    colours: ["cream", "sage green", "chocolate", "blush"],
    signature: "one investment piece worn on repeat until it becomes unmistakably yours, a coat, a bag, a signature scent.",
    avoid: "fast-fashion fabrics that pill or fade after three wears, cheap texture is the one thing you can't override with styling.",
    texture: "heavy, tactile natural fibres, cashmere, silk, suede, anything your hand wants to touch before your eyes decide.",
  },
  Gemini: {
    wear: "Playful prints, layered accessories, and looks you can remix endlessly. Your wardrobe is a conversation.",
    why: "Your Venus in Gemini gets bored by basics. You need variety, wit, and pieces with personality.",
    colours: ["yellow", "lilac", "silver", "bright white"],
    signature: "a rotating cast of statement accessories, scarves, layered jewellery, mismatched earrings, that keep the same outfit feeling new.",
    avoid: "a rigid, uniform-style capsule wardrobe, sameness reads as boredom on you faster than on any other sign.",
    texture: "mixed textures within one look, smooth against nubby, matte against shine, contrast is the whole point.",
  },
  Cancer: {
    wear: "Soft layers, romantic silhouettes, and pieces that feel like a hug. Silk, linen, and moonlit tones.",
    why: "Your Venus in Cancer dresses for how things feel, not just how they look. Comfort is your luxury.",
    colours: ["pearl", "silver", "soft blue", "ivory"],
    signature: "a sentimental piece worn close to the body, a locket, an heirloom ring, something with a story attached.",
    avoid: "stiff, structured fabrics that keep you at a physical distance from your own clothes.",
    texture: "soft, fluid layers you can wrap and unwrap depending on how safe the room feels.",
  },
  Leo: {
    wear: "Gold, drama, and pieces that catch the light. You were born to be looked at, dress accordingly.",
    why: "Your Venus in Leo needs to shine, literally. Statement pieces are not optional, they're your birthright.",
    colours: ["gold", "amber", "leopard", "hot pink"],
    signature: "one piece per outfit engineered to catch light or attention first, gold hardware, a bold print, a dramatic sleeve.",
    avoid: "anything designed to be overlooked, muted-to-invisible neutrals with zero point of focus waste your Venus completely.",
    texture: "anything with shine or sheen, satin, metallics, a good highlighter, light was made to catch on you.",
  },
  Virgo: {
    wear: "Impeccable tailoring, clean lines, and a curated capsule. One perfect piece beats ten trendy ones.",
    why: "Your Venus in Virgo finds beauty in precision and understated perfection. Minimal, intentional, chic.",
    colours: ["oat", "navy", "crisp white", "forest green"],
    signature: "immaculate fit over quantity, one perfectly tailored blazer does more for you than an entire trend-driven wardrobe.",
    avoid: "anything ill-fitting or wrinkled, on you a bad hem reads louder than it does on anyone else.",
    texture: "clean, structured fabrics that hold a crisp line, poplin, fine wool, anything that looks pressed on its own.",
  },
  Libra: {
    wear: "Matching sets, romantic coordinates, and perfectly balanced looks. If it photographs beautifully, it's yours.",
    why: "Your Venus is in its home sign, your aesthetic instincts are world-class. Trust them completely.",
    colours: ["blush", "powder blue", "champagne", "rose gold"],
    signature: "a fully coordinated look, matching sets, considered colour stories, nothing left to chance or last-minute grabbing.",
    avoid: "second-guessing your own taste, your instincts here are the most reliable thing about you, defer to them.",
    texture: "soft, symmetrical silhouettes that balance the body, nothing too asymmetric or jarring.",
  },
  Scorpio: {
    wear: "Black leather, dark femme silhouettes, and pieces with an edge. Magnetic beats pretty, every time.",
    why: "Your Venus in Scorpio is drawn to power and intensity. You dress to be unforgettable, not agreeable.",
    colours: ["black", "oxblood", "deep plum", "gunmetal"],
    signature: "one piece with real edge, leather, a sharp neckline, dark lace, something that reads as intentional intensity, not accident.",
    avoid: "diluting your look to be more approachable, agreeable was never the assignment, unforgettable was.",
    texture: "second-skin fits and dark, rich materials, leather, silk in black, anything that moves like it means it.",
  },
  Sagittarius: {
    wear: "Eclectic layers, worldly pieces, and boots that have stories. Your style has a passport.",
    why: "Your Venus in Sagittarius craves freedom and character. You want cool, collected-not-curated energy.",
    colours: ["terracotta", "turquoise", "tan", "burnt orange"],
    signature: "one well-travelled piece per outfit, a vintage find, a market piece, something with an actual story behind it.",
    avoid: "overly formal, restrictive fits that limit how far or fast you can move.",
    texture: "worn-in, well-loved fabrics, broken-in leather, washed denim, nothing that still looks like it's in its packaging.",
  },
  Capricorn: {
    wear: "Power tailoring, timeless investment pieces, and quiet luxury. You dress like the CEO you're becoming.",
    why: "Your Venus in Capricorn values legacy and authority. You don't follow trends, you invest in icons.",
    colours: ["charcoal", "camel", "black", "pinstripe"],
    signature: "a small edit of true investment pieces bought once and worn for a decade, not a wardrobe that turns over every season.",
    avoid: "trend-chasing pieces that will read as dated within a year, your Venus is playing a longer game than that.",
    texture: "structured, substantial fabrics, wool, tailored cotton, anything with enough weight to hold authority in a room.",
  },
  Aquarius: {
    wear: "Avant-garde silhouettes, unexpected combinations, and pieces from the future. Weird is a compliment.",
    why: "Your Venus in Aquarius sets trends three years early. You dress for a reality that hasn't arrived yet.",
    colours: ["electric blue", "silver", "acid green", "iridescent"],
    signature: "one deliberately unexpected element per outfit, an odd silhouette, an unusual pairing, something nobody else would think to try.",
    avoid: "editing yourself down to look more conventional, the instinct people call strange is usually the one worth trusting.",
    texture: "unconventional or technical materials, metallics, mesh, anything that doesn't quite behave like normal fabric.",
  },
  Pisces: {
    wear: "Flowing fabrics, ethereal layers, and watercolour everything. You dress like you're in a painting.",
    why: "Your Venus in Pisces is drawn to the dreamy and romantic. Your beauty feels almost otherworldly.",
    colours: ["seafoam", "lavender", "opal", "misty blue"],
    signature: "one soft, dreamlike detail per outfit, a sheer layer, an iridescent finish, something that photographs like light.",
    avoid: "harsh, rigid tailoring that fights your natural fluidity instead of moving with it.",
    texture: "sheer, flowing, light-catching fabrics, chiffon, tulle, anything that moves before you do.",
  },
};
