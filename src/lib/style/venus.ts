// Venus = the aesthetic layer. Colour, materials, print, detail, jewellery and beauty direction.
// Venus never decides silhouette, that belongs to the rising, which is what stops the two layers
// fighting each other.
//
// Colour is tiered rather than a flat list of five, because real shopping inventory will not
// cooperate with five words. Hero colours are the strongest recommendation, supporting colours
// carry a whole outfit, accents are for detail and jewellery, and experimental colours exist so the
// edit stops repeating itself by week three. Hex values are carried so a product's colour metadata
// can be matched numerically rather than by name.

import type { ColourSystem, Sign } from "./types";

export interface VenusAesthetic {
  /** The emotional vibe of the clothes, one line. */
  vibe: string;
  colour: ColourSystem;
  materials: string[];
  prints: string[];
  details: string[];
  jewellery: string;
  beauty: string;
  /** The piece she actually loves and should always be allowed. */
  signature: string;
  /** Machine-readable attributes to downrank. */
  downrank: string[];
  avoid: string;
  scent: string;
}

const c = (name: string, hex: string) => ({ name, hex });

export const VENUS_AESTHETIC: Record<Sign, VenusAesthetic> = {
  Aries: {
    vibe: "bold, sporty and commanding, dressed to arrive rather than to blend",
    colour: {
      hero: [c("true red", "#C8102E"), c("scarlet", "#E63946"), c("black", "#000000")],
      supporting: [c("optic white", "#FFFFFF"), c("charcoal", "#2B2B2B")],
      accent: [c("chrome", "#C0C0C0"), c("hot orange", "#FF5A1F")],
      experimental: [c("cobalt", "#0047AB"), c("bright coral", "#FF6F61")],
      avoid: ["pastel_pink", "mint", "dusty_neutral", "muted_beige"],
    },
    materials: ["leather", "denim", "technical jersey", "metal hardware"],
    prints: ["solid blocks", "bold stripe", "minimal graphic"],
    details: ["visible hardware", "sporty trims", "sharp zips", "clean seams"],
    jewellery: "few pieces, hard metal, nothing that dangles",
    beauty: "a strong lip or a strong brow, one focal point and done",
    signature: "a single sharp accessory that reads as a decision",
    downrank: ["ruffle", "lace", "pastel", "delicate_trim"],
    avoid: "anything overly fussy or delicate that needs careful handling to look good",
    scent: "Fire & Musk",
  },
  Taurus: {
    vibe: "luxe, sensual and timeless, quality you can feel before you can see",
    colour: {
      hero: [c("cream", "#F1E7D6"), c("chocolate", "#4B342A"), c("olive", "#6B7048")],
      supporting: [c("camel", "#C19A6B"), c("blush", "#E8C7C0")],
      accent: [c("warm gold", "#D4AF37"), c("bronze", "#CD7F32")],
      experimental: [c("deep forest", "#2F4739"), c("dusty rose", "#C9A9A6")],
      avoid: ["neon", "acid_bright", "synthetic_shine"],
    },
    materials: ["silk", "cashmere", "suede", "linen", "fine leather"],
    prints: ["plain", "subtle tonal", "fine natural texture"],
    details: ["quiet luxury finishes", "hand-feel over hardware", "considered buttons"],
    jewellery: "solid gold, worn daily, nothing flimsy",
    beauty: "skin-first, warm and glowing, minimal colour",
    signature: "one investment piece worn until it becomes unmistakably yours",
    downrank: ["synthetic", "stiff_fabric", "novelty", "fast_fashion"],
    avoid: "fabrics that pill or fade after three wears, cheap texture cannot be styled around",
    scent: "Rose & Sandalwood",
  },
  Gemini: {
    vibe: "eclectic, youthful and changeable, a wardrobe that keeps talking",
    colour: {
      hero: [c("sunshine yellow", "#FFD93D"), c("sky blue", "#7EC8E3"), c("lime", "#C2E812")],
      supporting: [c("bright white", "#FFFFFF"), c("mid denim", "#4A6FA5")],
      accent: [c("silver", "#C0C0C0"), c("lilac", "#C8B4F8")],
      experimental: [c("tangerine", "#F28500"), c("mint", "#A8E6CF")],
      avoid: ["heavy_dark_neutral", "muted_earth", "single_tone_uniform"],
    },
    materials: ["cotton", "denim", "mesh", "light jersey"],
    prints: ["stripe", "mixed print", "graphic", "spot"],
    details: ["playful accessories", "contrast trims", "clashing on purpose"],
    jewellery: "layered, mismatched, changed constantly",
    beauty: "playful, experimental, a different look most weeks",
    signature: "a rotating cast of statement accessories",
    downrank: ["uniform", "monotone", "heavy_formal"],
    avoid: "a rigid capsule wardrobe, sameness reads as boredom on you faster than on anyone else",
    scent: "Citrus & Verbena",
  },
  Cancer: {
    vibe: "romantic, nostalgic and feminine, clothes that feel like being held",
    colour: {
      hero: [c("pearl", "#F2EDE4"), c("pale blue", "#C5D8E8"), c("soft pink", "#EFD3D7")],
      supporting: [c("white", "#FFFFFF"), c("moon grey", "#C9CBD0")],
      accent: [c("antique silver", "#B8B8B8"), c("pearl white", "#FBF7F0")],
      experimental: [c("sea grey", "#8FA6B2"), c("faded lilac", "#D8CCE6")],
      avoid: ["acid_bright", "aggressive_neon", "harsh_hardware"],
    },
    materials: ["satin", "brushed cotton", "lace", "soft knit"],
    prints: ["ditsy floral", "faded vintage print", "soft check"],
    details: ["pearls", "vintage detailing", "delicate trims", "covered buttons"],
    jewellery: "delicate, sentimental, often inherited",
    beauty: "soft-focus, dewy, blush-led",
    signature: "a sentimental piece worn close to the body",
    downrank: ["hard_hardware", "stiff_construction", "neon"],
    avoid: "anything armoured or rigid that fights how approachable you actually are",
    scent: "Moonflower & Vanilla",
  },
  Leo: {
    vibe: "glamorous, noticeable and polished, dressed like the room is yours",
    colour: {
      hero: [c("gold", "#D4AF37"), c("burnt orange", "#E8701A"), c("ruby", "#9B111E")],
      supporting: [c("black", "#000000"), c("warm cream", "#F5E9D0")],
      accent: [c("emerald", "#046307"), c("bronze", "#B5651D")],
      experimental: [c("magenta", "#C2185B"), c("sapphire", "#0F52BA")],
      avoid: ["washed_pastel", "muddy_neutral", "quiet_beige"],
    },
    materials: ["velvet", "silk", "metallics", "satin"],
    prints: ["animal", "bold floral", "baroque"],
    details: ["embellishment", "statement sleeves", "gold hardware", "corsetry"],
    jewellery: "big, warm, gold, seen from across the room",
    beauty: "full glam, luminous skin, hair as the accessory",
    signature: "one piece that catches the light and holds it",
    downrank: ["understated", "beige", "shapeless"],
    avoid: "quiet minimalism that hides you, which reads as shrinking rather than taste",
    scent: "Gold & Amber",
  },
  Virgo: {
    vibe: "refined, minimal and considered, every choice deliberate",
    colour: {
      hero: [c("cream", "#EFE9DD"), c("navy", "#1F2A44"), c("taupe", "#B3A394")],
      supporting: [c("charcoal", "#36393B"), c("sage", "#9CAF88")],
      accent: [c("fine silver", "#C0C0C0"), c("crisp white", "#FFFFFF")],
      experimental: [c("soft clay", "#C7A99A"), c("slate blue", "#6E7F8D")],
      avoid: ["neon", "clashing_print", "visible_logo"],
    },
    materials: ["linen", "cotton poplin", "fine wool", "smooth leather"],
    prints: ["plain", "fine stripe", "micro check"],
    details: ["immaculate finishing", "precise stitching", "nothing surplus"],
    jewellery: "minimal, fine, one piece at a time",
    beauty: "clean, groomed, skin that looks looked-after",
    signature: "a fit so exact it looks made for you",
    downrank: ["unfinished", "loud_print", "cluttered", "creasing_fabric"],
    avoid: "anything approximate or unfinished, which you notice long before anyone else does",
    scent: "Lavender & Cedar",
  },
  Libra: {
    vibe: "polished, feminine and chic, composed without looking effortful",
    colour: {
      hero: [c("soft pink", "#F4C2C2"), c("powder blue", "#B6D0E2"), c("cream", "#F3EDE3")],
      supporting: [c("lavender", "#C8B4F8"), c("dove grey", "#BFC3C7")],
      accent: [c("rose gold", "#B76E79"), c("champagne", "#F0E2CE")],
      experimental: [c("sage mint", "#BFD8CA"), c("cornflower", "#8DA9DB")],
      avoid: ["harsh_neon", "muddy_dark", "clashing_print"],
    },
    materials: ["silk", "satin", "chiffon", "fine crepe"],
    prints: ["soft floral", "delicate stripe", "tonal"],
    details: ["bows", "elegant fastenings", "romantic trims", "matched sets"],
    jewellery: "elegant, balanced, often paired",
    beauty: "soft glam, symmetrical, a polished finish",
    signature: "a colour pairing that looks composed rather than accidental",
    downrank: ["asymmetric_extreme", "harsh_hardware", "clash"],
    avoid: "off-balance combinations, which unsettle you all day even when nobody comments",
    scent: "Peony & Champagne",
  },
  Scorpio: {
    vibe: "magnetic, dark and sensual, memorable rather than agreeable",
    colour: {
      hero: [c("black", "#000000"), c("burgundy", "#4A0D21"), c("oxblood", "#5B1A1A")],
      supporting: [c("deep purple", "#301934"), c("soft black", "#1C1C1C")],
      accent: [c("crimson", "#8C1C3A"), c("silver", "#C0C0C0")],
      experimental: [c("deep teal", "#033D3D"), c("aubergine", "#4B2E4A")],
      avoid: ["pastel_yellow", "baby_blue", "washed_pastel", "cute_detail"],
    },
    materials: ["leather", "lace", "velvet", "sheer fabric"],
    prints: ["solid", "tonal lace", "subtle dark texture"],
    details: ["corsetry", "sheer panels", "dark hardware", "selective exposure"],
    jewellery: "silver or dark gold, one strong piece",
    beauty: "defined eyes, matte intensity, nothing sweet",
    signature: "one piece with real edge worn like a decision",
    downrank: ["pastel", "busy_print", "cute", "over_accessorised"],
    avoid: "diluting your look to be more approachable, agreeable was never the assignment",
    scent: "Oud & Black Orchid",
  },
  Sagittarius: {
    vibe: "adventurous, effortless and eclectic, a wardrobe with a passport",
    colour: {
      hero: [c("cobalt", "#0047AB"), c("purple", "#6A0DAD"), c("turquoise", "#40E0D0")],
      supporting: [c("warm tan", "#B87333"), c("sand", "#E4D5B7")],
      accent: [c("bronze", "#CD7F32"), c("saffron", "#F4C430")],
      experimental: [c("terracotta", "#C36A4B"), c("deep magenta", "#A0257A")],
      avoid: ["corporate_grey", "muted_beige", "restrictive_formal"],
    },
    materials: ["denim", "suede", "natural cotton", "worn leather"],
    prints: ["global print", "paisley", "bold folk pattern"],
    details: ["layered jewellery", "fringing", "well-travelled wear"],
    jewellery: "layered, collected, each piece from somewhere",
    beauty: "sun-warmed, low maintenance, undone",
    signature: "one well-travelled piece per outfit",
    downrank: ["stiff_formal", "restrictive", "delicate_dryclean"],
    avoid: "restrictive formality that limits how far or fast you can move",
    scent: "Saffron & Leather",
  },
  Capricorn: {
    vibe: "expensive-looking, classic and powerful, authority without volume",
    colour: {
      hero: [c("black", "#000000"), c("camel", "#C19A6B"), c("charcoal", "#4A4A4A")],
      supporting: [c("navy", "#1B2A41"), c("chocolate", "#3D2B1F")],
      accent: [c("steel", "#B0B7BC"), c("ivory", "#F5F0E6")],
      experimental: [c("deep forest", "#29483A"), c("wine", "#5E2129")],
      avoid: ["neon", "novelty_print", "visible_logo", "flimsy_trend"],
    },
    materials: ["wool", "leather", "cashmere", "heavy cotton"],
    prints: ["plain", "pinstripe", "houndstooth"],
    details: ["structured bags", "classic watch", "clean tailoring"],
    jewellery: "a good watch and one classic piece, nothing more",
    beauty: "groomed, timeless, deliberately understated",
    signature: "one piece of obvious quality worn without comment",
    downrank: ["novelty", "flimsy", "logo_heavy", "trend_led"],
    avoid: "flimsy trend pieces, which undercut the authority the whole look is built on",
    scent: "Vetiver & Suede",
  },
  Aquarius: {
    vibe: "experimental, futuristic and individual, dressed slightly ahead of the room",
    colour: {
      hero: [c("electric blue", "#0047FF"), c("silver", "#C0C0C0"), c("icy blue", "#D6ECF3")],
      supporting: [c("black", "#000000"), c("optic white", "#FFFFFF")],
      accent: [c("neon lime", "#39FF14"), c("chrome", "#CFD4D9")],
      experimental: [c("iridescent lilac", "#C8B4F8"), c("acid orange", "#FF6A00")],
      avoid: ["traditional_floral", "muted_earth", "predictable_neutral"],
    },
    materials: ["metallics", "technical fabric", "mesh", "coated denim"],
    prints: ["abstract", "digital", "unexpected colour block"],
    details: ["futuristic hardware", "asymmetric fastenings", "unusual combinations"],
    jewellery: "sculptural, unexpected, nothing traditional",
    beauty: "graphic, experimental, one strange brilliant detail",
    signature: "one thing nobody else is wearing, chosen on purpose",
    downrank: ["traditional", "predictable", "safe_neutral"],
    avoid: "looking like everyone else, which is the only real failure state for your taste",
    scent: "Electric Ozone & Iris",
  },
  Pisces: {
    vibe: "dreamy, artistic and ethereal, clothes that move after you stop",
    colour: {
      hero: [c("seafoam", "#93E9BE"), c("lavender", "#C8B4F8"), c("aqua", "#7FDBDA")],
      supporting: [c("pearl", "#F2EDE4"), c("mist grey", "#CBD3D8")],
      accent: [c("opal shimmer", "#E0F0F5"), c("silver", "#C0C0C0")],
      experimental: [c("dusty rose", "#C9A9A6"), c("deep sea", "#2C5364")],
      avoid: ["hard_neon", "corporate_grey", "rigid_structure"],
    },
    materials: ["chiffon", "satin", "sheer fabric", "washed silk"],
    prints: ["watercolour", "abstract wash", "soft tie-dye"],
    details: ["crystals", "shimmer", "draping", "delicate layering"],
    jewellery: "delicate, iridescent, moonstone and silver",
    beauty: "ethereal, luminous, soft-focus everything",
    signature: "a piece with shift in it, iridescence or a moving layer",
    downrank: ["rigid", "hard_tailoring", "corporate"],
    avoid: "hard corporate cuts, which fight the impression you naturally make",
    scent: "Sea Salt & Jasmine",
  },
};
