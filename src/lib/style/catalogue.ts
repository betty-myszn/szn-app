// The product catalogue for Shop Your Szn.
//
// Real products from ASOS US, curated by hand and tagged into the same 0-100 vector space as the
// signs, so the engine ranks them per member rather than showing everyone the same grid. Each
// product carries the seasons it belongs to, so an edit can be pre-prepared per zodiac season.
//
// THREE THINGS TO KNOW BEFORE THIS GOES LIVE
// 1. These are plain retailer links, so they earn nothing yet. Wrap them through an affiliate
//    network (Awin covers ASOS, Amazon has its own programme) and put the tag in affiliateWrap()
//    below, which is the single place every outbound link passes through.
// 2. Prices and stock go stale. Each product records checkedAt, and the UI should either hide the
//    price or label it as the price when the edit was built. Refresh at the start of each season.
// 3. Images are deliberately not hotlinked from the retailer. An affiliate feed supplies licensed
//    image URLs, which is the correct source for them.

import { vec, type Sign, type StyleVector } from "./types";

export type Category = "tops" | "bottoms" | "dresses" | "outerwear" | "shoes" | "bags";

export interface Product {
  id: string;
  title: string;
  brand: string;
  retailer: "ASOS";
  category: Category;
  /** Price in USD at the time the edit was built. */
  price: number;
  url: string;
  colours: string[];
  /** Zodiac seasons this piece belongs in. */
  seasons: Sign[];
  vector: StyleVector;
  /** Tags the engine can downrank against, matching the rising/venus downrank vocabularies. */
  attributes: string[];
  checkedAt: string;
}

const CHECKED = "2026-08-30";

const p = (
  id: string,
  title: string,
  brand: string,
  category: Category,
  price: number,
  url: string,
  colours: string[],
  seasons: Sign[],
  vector: Partial<StyleVector>,
  attributes: string[] = []
): Product => ({
  id, title, brand, retailer: "ASOS", category, price, url, colours, seasons,
  vector: vec(vector), attributes, checkedAt: CHECKED,
});

export const PRODUCTS: Product[] = [
  // ── bottoms ──────────────────────────────────────────────────────────────────
  p("monki-wide-tailored-gray", "High waist wide leg tailored pants in dark gray melange", "Monki", "bottoms", 51,
    "https://www.asos.com/us/monki/monki-high-waist-wide-leg-tailored-pants-in-dark-gray-melange/prd/207969313",
    ["dark gray"], ["Virgo", "Capricorn", "Aquarius"],
    { structure: 88, minimal: 82, polished: 80, classic: 78, casual: 35, printIntensity: 5, colourIntensity: 20 }),
  p("jdy-wide-chocolate", "Wide leg tailored pants in chocolate brown", "JDY", "bottoms", 51,
    "https://www.asos.com/us/jdy/jdy-wide-leg-tailored-pants-in-chocolate-brown/prd/209448608",
    ["chocolate"], ["Virgo", "Taurus", "Capricorn"],
    { structure: 85, minimal: 75, polished: 78, classic: 82, texture: 60, colourIntensity: 30 }),
  p("princess-polly-flared-black", "Mid rise slim fit button detail flared tailored pants in black", "Princess Polly", "bottoms", 64,
    "https://www.asos.com/us/princess-polly/princess-polly-kinkirk-mid-rise-slim-fit-button-detail-flared-tailored-pants-in-black/prd/208491339",
    ["black"], ["Scorpio", "Capricorn", "Leo"],
    { structure: 80, bodyConscious: 72, polished: 82, sensual: 60, colourIntensity: 15, edge: 55 }),
  p("topshop-sequin-white", "Sequined tailored pants in white", "Topshop", "bottoms", 85,
    "https://www.asos.com/us/topshop/topshop-sequined-tailored-pants-in-white/prd/209319577",
    ["white", "silver"], ["Leo", "Aquarius", "Gemini"],
    { glamour: 90, maximal: 85, futuristic: 70, structure: 65, minimal: 20, texture: 75 }),
  p("asos-mesh-midi-chocolate", "Mesh low rise midi skirt with godets in chocolate", "ASOS DESIGN", "bottoms", 37.99,
    "https://www.asos.com/us/asos-design/asos-design-mesh-low-rise-midi-skirt-with-godets-in-chocolate/prd/210953754",
    ["chocolate"], ["Pisces", "Taurus", "Scorpio"],
    { fluidity: 85, sensual: 75, texture: 70, structure: 25, romantic: 65 }),
  p("asos-linen-slip-skirt-red", "Linen blend 90s slip skirt in red", "ASOS DESIGN", "bottoms", 47.99,
    "https://www.asos.com/us/asos-design/asos-design-linen-blend-90s-slip-skirt-in-red/prd/211004916",
    ["red"], ["Aries", "Leo", "Sagittarius"],
    { colourIntensity: 90, fluidity: 65, sensual: 65, casual: 55, edge: 55 }),
  p("topshop-techy-90s-black", "Techy 90s length skirt in black", "Topshop", "bottoms", 48,
    "https://www.asos.com/us/topshop/topshop-techy-90s-length-skirt-in-black/prd/211358217",
    ["black"], ["Aquarius", "Scorpio", "Capricorn"],
    { futuristic: 80, edge: 70, minimal: 70, structure: 65, colourIntensity: 15 }),
  p("topshop-organza-gray", "Organza 90s length skirt in gray", "Topshop", "bottoms", 50,
    "https://www.asos.com/us/topshop/topshop-organza-90s-length-skirt-in-gray/prd/210941663",
    ["gray"], ["Pisces", "Aquarius", "Libra"],
    { fluidity: 85, texture: 75, romantic: 70, experimental: 60, structure: 30 }),

  // ── tops ─────────────────────────────────────────────────────────────────────
  p("jjxx-poplin-olive", "Jamie oversized striped poplin shirt in olive", "JJXX", "tops", 45,
    "https://www.asos.com/us/jjxx/jjxx-jamie-oversized-striped-poplin-shirt-in-olive/prd/210992027",
    ["olive"], ["Virgo", "Sagittarius", "Taurus"],
    { oversized: 78, casual: 70, printIntensity: 55, classic: 65, structure: 55 }),
  p("other-stories-poplin-blue", "Pure cotton poplin shirt with back tie detail in light blue", "& Other Stories", "tops", 125,
    "https://www.asos.com/us/other-stories/other-stories-pure-cotton-poplin-shirt-with-back-tie-detail-in-light-blue/prd/210373840",
    ["light blue"], ["Virgo", "Cancer", "Libra"],
    { polished: 88, minimal: 78, classic: 80, structure: 70, romantic: 55 }),
  p("jjxx-poplin-pink-green", "Jamie oversized poplin shirt in pink and green stripes", "JJXX", "tops", 45,
    "https://www.asos.com/us/jjxx/jjxx-jamie-oversized-poplin-shirt-in-pink-and-green-stripes/prd/210407063",
    ["pink", "green"], ["Gemini", "Libra", "Aries"],
    { printIntensity: 85, colourIntensity: 75, casual: 72, oversized: 70 }, ["clashing_print"]),
  p("mango-fine-knit-burgundy", "Round neck fine knit sweater in burgundy", "Mango", "tops", 69.99,
    "https://www.asos.com/us/mango/mango-round-neck-fine-knit-sweater-in-burgundy/prd/211550404",
    ["burgundy"], ["Scorpio", "Taurus", "Capricorn"],
    { texture: 80, minimal: 72, classic: 78, sensual: 62, bodyConscious: 62, colourIntensity: 45 }),
  p("gina-fine-knit-brown", "Long sleeve crew neck fine knit sweater in brown melange", "Gina Tricot", "tops", 63,
    "https://www.asos.com/us/gina-tricot/gina-tricot-long-sleeve-crew-neck-fine-knit-sweater-in-brown-melange-part-of-a-set/prd/209524942",
    ["brown"], ["Taurus", "Virgo", "Capricorn"],
    { texture: 82, minimal: 78, classic: 80, casual: 55, colourIntensity: 25 }),
  p("asos-knit-poplin-collar-gray", "Fine knit sweater with contrast poplin collar in gray", "ASOS DESIGN", "tops", 59.99,
    "https://www.asos.com/us/asos-design/asos-design-fine-knit-sweater-with-contrast-poplin-collar-in-gray/prd/210356570",
    ["gray"], ["Virgo", "Capricorn", "Gemini"],
    { polished: 85, classic: 78, minimal: 70, structure: 62 }),
  p("gina-metallic-knit-dark-brown", "Metallic fine knit sweater with wide sleeves in dark brown", "Gina Tricot", "tops", 63,
    "https://www.asos.com/us/gina-tricot/gina-tricot-metallic-fine-knit-sweater-with-wide-sleeves-in-dark-brown/prd/209572449",
    ["dark brown", "metallic"], ["Leo", "Aquarius", "Taurus"],
    { glamour: 78, texture: 80, futuristic: 60, oversized: 62, colourIntensity: 45 }),

  // ── outerwear ────────────────────────────────────────────────────────────────
  p("asos-cinch-mocha", "Cinch waist blazer in mocha", "ASOS DESIGN", "outerwear", 99.99,
    "https://www.asos.com/us/asos-design/asos-design-cinch-waist-blazer-in-mocha/prd/209074015",
    ["mocha"], ["Virgo", "Taurus", "Libra"],
    { structure: 88, polished: 88, classic: 78, bodyConscious: 68, texture: 60 }),
  p("asos-sculpted-plum", "Ultimate sculpted suit blazer in plum", "ASOS DESIGN", "outerwear", 119,
    "https://www.asos.com/us/asos-design/asos-design-ultimate-sculpted-suit-blazer-in-plum/prd/208996593",
    ["plum"], ["Scorpio", "Capricorn", "Leo"],
    { structure: 92, polished: 90, bodyConscious: 72, glamour: 65, colourIntensity: 55 }),
  p("asos-relaxed-black", "Tailored relaxed blazer in black", "ASOS DESIGN", "outerwear", 59.99,
    "https://www.asos.com/us/asos-design/asos-design-tailored-relaxed-blazer-in-black/prd/208898085",
    ["black"], ["Capricorn", "Virgo", "Scorpio", "Aquarius"],
    { structure: 82, minimal: 82, classic: 82, oversized: 62, colourIntensity: 10 }),
  p("asos-nipped-cutaway-black", "Tailored nipped waist blazer with cut away hem in black", "ASOS DESIGN", "outerwear", 94.99,
    "https://www.asos.com/us/asos-design/asos-design-tailored-nipped-waist-blazer-with-cut-away-hem-in-black/prd/208936219",
    ["black"], ["Leo", "Scorpio", "Aquarius"],
    { structure: 85, bodyConscious: 82, experimental: 65, edge: 68, glamour: 70 }),
  p("gina-trench-beige", "Rich cotton high neck trench coat in natural beige", "Gina Tricot", "outerwear", 174,
    "https://www.asos.com/us/gina-tricot/gina-tricot-rich-cotton-high-neck-trench-coat-in-natural-beige/prd/211468528",
    ["beige"], ["Virgo", "Capricorn", "Libra"],
    { structure: 85, classic: 92, polished: 88, minimal: 78, colourIntensity: 20 }),
  p("asos-trench-stone", "Longline water repellent trench coat in stone", "ASOS DESIGN", "outerwear", 86.99,
    "https://www.asos.com/us/asos-design/asos-design-longline-water-repellent-trench-coat-in-stone/prd/209453239",
    ["stone"], ["Virgo", "Capricorn", "Libra"],
    { structure: 82, classic: 90, minimal: 80, polished: 82, colourIntensity: 18 }),
  p("asos-trench-black", "Longline water repellent trench coat in black", "ASOS DESIGN", "outerwear", 86.99,
    "https://www.asos.com/us/asos-design/asos-design-longline-water-repellent-trench-coat-in-black/prd/209453616",
    ["black"], ["Scorpio", "Capricorn", "Aquarius"],
    { structure: 84, classic: 85, minimal: 82, edge: 60, colourIntensity: 10 }),
  p("vero-moda-trench-stone", "Longline belted trench coat in stone", "Vero Moda", "outerwear", 105,
    "https://www.asos.com/us/vero-moda/vero-moda-longline-belted-trench-coat-in-stone/prd/205972635",
    ["stone"], ["Virgo", "Libra", "Taurus"],
    { structure: 80, classic: 88, polished: 82, romantic: 55 }),

  // ── dresses ──────────────────────────────────────────────────────────────────
  p("topshop-satin-slip-mole", "Satin V-neck maxi slip dress with lace inserts in mole", "Topshop", "dresses", 119,
    "https://www.asos.com/us/topshop/topshop-satin-v-neck-maxi-slip-dress-with-lace-inserts-in-mole/prd/209959033",
    ["mole", "taupe"], ["Pisces", "Taurus", "Libra"],
    { fluidity: 88, sensual: 82, texture: 85, romantic: 82, glamour: 70 }),
  p("asos-satin-slip-fringe-black", "Satin midi slip dress with fringe detailing in black", "ASOS DESIGN", "dresses", 69.99,
    "https://www.asos.com/us/asos-design/asos-design-satin-midi-slip-dress-with-fringe-detailing-in-black/prd/211246970",
    ["black"], ["Scorpio", "Leo", "Capricorn"],
    { sensual: 85, glamour: 82, bodyConscious: 78, edge: 65, colourIntensity: 12 }),
  p("asos-corset-maxi-red", "Corset maxi slip dress with lace and side slit in red", "ASOS DESIGN", "dresses", 119,
    "https://www.asos.com/us/asos-design/asos-design-corset-maxi-slip-dress-with-lace-and-side-slit-in-red/prd/209948629",
    ["red"], ["Leo", "Aries", "Scorpio"],
    { glamour: 92, sensual: 90, bodyConscious: 85, colourIntensity: 92, maximal: 80 }),
  p("reclaimed-cami-satin-fig", "Cami satin maxi slip dress with lace trim in fig", "Reclaimed Vintage", "dresses", 54.99,
    "https://www.asos.com/us/reclaimed-vintage/reclaimed-vintage-cami-satin-maxi-slip-dress-with-lace-trim-in-fig/prd/209805827",
    ["fig", "plum"], ["Pisces", "Scorpio", "Cancer"],
    { fluidity: 85, romantic: 85, sensual: 80, vintage: 80, texture: 78 }),

  // ── shoes ────────────────────────────────────────────────────────────────────
  p("topshop-pascal-black", "Pascal real leather ankle boots in black", "Topshop", "shoes", 119,
    "https://www.asos.com/us/topshop/topshop-pascal-real-leather-ankle-boots-in-black/prd/210608773",
    ["black"], ["Scorpio", "Capricorn", "Virgo"],
    { classic: 82, minimal: 78, structure: 75, edge: 60, colourIntensity: 10 }),
  p("vagabond-blanca-black", "Blanca square toe leather ankle boots in black", "Vagabond Shoemakers", "shoes", 210,
    "https://www.asos.com/us/vagabond-shoemaker/vagabond-shoemakers-blanca-square-toe-leather-ankle-boots-in-black/prd/210869062",
    ["black"], ["Aquarius", "Capricorn", "Scorpio"],
    { experimental: 72, structure: 82, minimal: 80, edge: 68, futuristic: 62 }),
  p("ck-chunky-black", "Chunky leather ankle boots with zipper in black", "Calvin Klein", "shoes", 179.9,
    "https://www.asos.com/us/calvin-klein/calvin-klein-chunky-leather-ankle-boots-with-zipper-in-black/prd/209501493",
    ["black"], ["Aquarius", "Aries", "Scorpio"],
    { edge: 85, structure: 80, sporty: 62, futuristic: 65, colourIntensity: 10 }),
  p("other-stories-heeled-offwhite", "Premium leather heeled ankle boots with tan contrast in off white", "& Other Stories", "shoes", 293,
    "https://www.asos.com/us/other-stories/other-stories-premium-leather-heeled-ankle-boots-with-tan-contrast-in-off-white/prd/211193947",
    ["off white", "tan"], ["Libra", "Virgo", "Taurus"],
    { polished: 90, classic: 82, minimal: 75, texture: 72, glamour: 62 }),

  // ── bags ─────────────────────────────────────────────────────────────────────
  p("pasq-structured-brown", "Structured shoulder bag in brown", "PASQ", "bags", 42,
    "https://www.asos.com/us/pasq/pasq-structured-shoulder-bag-in-brown/prd/209008184",
    ["brown"], ["Taurus", "Virgo", "Sagittarius"],
    { structure: 82, classic: 78, minimal: 72, texture: 65 }),
  p("asos-structured-black", "Structured shoulder bag in black", "ASOS DESIGN", "bags", 44.99,
    "https://www.asos.com/us/asos-design/asos-design-structured-shoulder-bag-in-black/prd/209779620",
    ["black"], ["Capricorn", "Scorpio", "Virgo"],
    { structure: 85, minimal: 82, classic: 80, colourIntensity: 10 }),
  p("mango-slouch-black", "Small structured slouch shoulder bag in black", "Mango", "bags", 69.99,
    "https://www.asos.com/us/mango/mango-small-structured-slouch-shoulder-bag-in-black/prd/211045515",
    ["black"], ["Scorpio", "Aquarius", "Pisces"],
    { structure: 65, fluidity: 62, minimal: 75, edge: 58 }),
  p("mango-tote-burgundy", "Structured tote bag in burgundy", "Mango", "bags", 69.99,
    "https://www.asos.com/us/mango/mango-structured-tote-bag-in-burgundy/prd/211407963",
    ["burgundy"], ["Scorpio", "Taurus", "Capricorn"],
    { structure: 85, classic: 80, texture: 68, colourIntensity: 45 }),
];

/**
 * Every outbound link passes through here, so switching on affiliate tracking later is a one-line
 * change rather than an edit to thirty-five URLs. Set NEXT_PUBLIC_AFFILIATE_TAG once the network
 * account exists (Awin for ASOS).
 */
export function affiliateWrap(url: string): string {
  const tag = process.env.NEXT_PUBLIC_AFFILIATE_TAG;
  if (!tag) return url;
  return `${tag}${encodeURIComponent(url)}`;
}

export function productsForSeason(season: Sign): Product[] {
  return PRODUCTS.filter((product) => product.seasons.includes(season));
}
