// Rising = the architecture of the outfit. Silhouette, construction, proportion, and the key pieces
// per category that the engine assembles a look from. Nothing here decides colour or fabric, that
// is Venus's job, which is what keeps the two layers cleanly separable.

import type { Sign } from "./types";

export type Formality = "formal" | "smart" | "casual";

/** Each category carries a piece per formality tier, so a situation picks the right register
 *  rather than always reaching for the same item. */
export type PieceTiers = Record<Formality, string>;

export interface KeyPieces {
  tops: PieceTiers;
  bottoms: PieceTiers;
  dresses: PieceTiers;
  outerwear: PieceTiers;
  shoes: PieceTiers;
  bags: PieceTiers;
  /** Worn for the gym and anything active, where the rising still sets proportion. */
  active: string;
}

export interface RisingArchitecture {
  /** How the room reads her before she speaks. */
  readAs: string;
  /** Silhouette and construction in one line. */
  silhouette: string;
  /** Where the emphasis of the outfit sits. */
  proportion: string;
  necklines: string[];
  hemlines: string[];
  keyPieces: KeyPieces;
  /** The one move that makes a look unmistakably hers. */
  signatureMove: string;
  /** Attributes to downrank in product matching, machine-readable. */
  downrank: string[];
  /** What flattens this rising, written for a human. */
  breaks: string;
  metals: string;
}

export const RISING_ARCHITECTURE: Record<Sign, RisingArchitecture> = {
  Aries: {
    readAs: "the woman who arrived first and did not wait to be introduced",
    silhouette: "sharp, fitted and abbreviated, built to move fast",
    proportion: "weight at the shoulder, leg left long and unfussy",
    necklines: ["crew", "high neck", "square", "sharp V"],
    hemlines: ["mini", "above the knee", "cropped"],
    keyPieces: {
      tops: { formal: "sharp structured shell top", smart: "fitted knit", casual: "fitted tank" },
      bottoms: { formal: "sharp tailored trouser", smart: "straight-leg denim", casual: "mini skirt" },
      dresses: { formal: "sharp shift dress", smart: "short body-skimming dress", casual: "jersey mini dress" },
      outerwear: { formal: "sharp-shouldered blazer", smart: "leather jacket", casual: "cropped bomber" },
      shoes: { formal: "pointed heel", smart: "statement boot", casual: "clean trainer" },
      bags: { formal: "hard top handle", smart: "compact crossbody", casual: "sporty crossbody" },
      active: "fitted, abbreviated activewear with a strong shoulder line",
    },
    signatureMove: "one hard edge placed where the eye lands first",
    downrank: ["ruffles", "fussy layering", "delicate straps", "maxi volume"],
    breaks: "fussy layering and anything that needs rearranging every time you stand up",
    metals: "polished silver and chrome",
  },
  Taurus: {
    readAs: "expensive, unhurried, and completely at home in your own body",
    silhouette: "body-skimming, substantial and tactile",
    proportion: "a long unbroken line with the throat and waist gently marked",
    necklines: ["scoop", "soft V", "boat"],
    hemlines: ["midi", "ankle-length", "just below the knee"],
    keyPieces: {
      tops: { formal: "silk shell blouse", smart: "fine knit", casual: "ribbed long sleeve" },
      bottoms: { formal: "wide wool trouser", smart: "bias-cut midi skirt", casual: "quality denim" },
      dresses: { formal: "knitted column dress", smart: "bias slip dress", casual: "soft jersey midi" },
      outerwear: { formal: "wool wrap coat", smart: "suede jacket", casual: "cashmere cardigan" },
      shoes: { formal: "low heeled mule", smart: "leather loafer", casual: "soft ankle boot" },
      bags: { formal: "structured leather tote", smart: "soft shoulder bag", casual: "everyday leather crossbody" },
      active: "substantial, body-skimming activewear in heavyweight fabric",
    },
    signatureMove: "one investment piece worn so often it becomes the thing people picture you in",
    downrank: ["synthetic finish", "stiff fabric", "novelty print", "disposable trend"],
    breaks: "thin, scratchy or cheap fabric, which undoes the cut no matter how good it is",
    metals: "warm gold, solid rather than delicate",
  },
  Gemini: {
    readAs: "quick, current, and the most interesting person in the conversation",
    silhouette: "modular, layered and playful, built to be remixed",
    proportion: "emphasis on the arms and hands, where you are always moving",
    necklines: ["collar", "crew", "asymmetric"],
    hemlines: ["mini", "midi", "cropped hem"],
    keyPieces: {
      tops: { formal: "crisp printed shirt", smart: "layered tee and cardigan", casual: "graphic tee" },
      bottoms: { formal: "printed tailored trouser", smart: "wide denim", casual: "mini skirt" },
      dresses: { formal: "printed midi dress", smart: "shirt dress", casual: "short printed dress" },
      outerwear: { formal: "cropped blazer", smart: "light bomber", casual: "denim jacket" },
      shoes: { formal: "loafer", smart: "low boot", casual: "trainer" },
      bags: { formal: "neat top handle", smart: "convertible strap bag", casual: "mini bag" },
      active: "modular, layered activewear you can strip back mid-session",
    },
    signatureMove: "a rotating accessory that changes the look without changing the outfit",
    downrank: ["rigid uniform", "single-note neutral", "heavy formality"],
    breaks: "a rigid one-note uniform, which reads as boredom on you faster than on anyone else",
    metals: "mixed metals worn together on purpose",
  },
  Cancer: {
    readAs: "soft, approachable, and quietly the emotional centre of the room",
    silhouette: "soft, curved and fluid, with give in every seam",
    proportion: "emphasis high and soft across the collarbone, edges left unsharp",
    necklines: ["sweetheart", "soft wrap", "round"],
    hemlines: ["midi", "maxi", "tea-length"],
    keyPieces: {
      tops: { formal: "silk wrap blouse", smart: "soft cardigan", casual: "cotton tee" },
      bottoms: { formal: "soft wide trouser", smart: "flowing midi skirt", casual: "relaxed jean" },
      dresses: { formal: "wrap dress", smart: "flowing midi dress", casual: "cotton day dress" },
      outerwear: { formal: "soft tailored coat", smart: "oversized cardigan", casual: "quilted jacket" },
      shoes: { formal: "soft heeled sandal", smart: "ballet flat", casual: "soft ankle boot" },
      bags: { formal: "structured soft-sided bag", smart: "slouchy shoulder bag", casual: "vintage-style crossbody" },
      active: "soft, forgiving activewear with nothing gripping",
    },
    signatureMove: "something sentimental worn close to the skin",
    downrank: ["hard tailoring", "stiff construction", "aggressive hardware"],
    breaks: "hard tailoring with no give, which makes you look armoured rather than warm",
    metals: "pearl and soft silver",
  },
  Leo: {
    readAs: "golden and impossible to miss, the main character whether or not you planned to be",
    silhouette: "dramatic proportions with the waist marked",
    proportion: "everything framing the face and hair, because that is where people look",
    necklines: ["plunge", "off shoulder", "sweetheart"],
    hemlines: ["midi", "floor-length", "thigh-skimming"],
    keyPieces: {
      tops: { formal: "statement-sleeve blouse", smart: "corset top", casual: "metallic-thread knit" },
      bottoms: { formal: "high-waisted tailored trouser", smart: "full midi skirt", casual: "gold-hardware denim" },
      dresses: { formal: "statement gown", smart: "corseted midi", casual: "thigh-skimming jersey dress" },
      outerwear: { formal: "statement coat", smart: "sharp-shouldered blazer", casual: "faux fur jacket" },
      shoes: { formal: "metallic heel", smart: "heeled boot", casual: "embellished flat" },
      bags: { formal: "embellished clutch", smart: "gold-hardware shoulder bag", casual: "statement tote" },
      active: "waist-marked activewear with drama in the cut",
    },
    signatureMove: "one piece that catches the light and holds it",
    downrank: ["quiet beige", "shapeless volume", "understated minimalism"],
    breaks: "quiet beige minimalism, which on you reads as hiding rather than taste",
    metals: "gold, warm and unapologetic",
  },
  Virgo: {
    readAs: "polished, precise, and visibly on top of your life",
    silhouette: "clean lines and precise fit, nothing surplus",
    proportion: "a marked waist and clean verticals, tidy from every angle",
    necklines: ["collar", "high crew", "clean V"],
    hemlines: ["midi", "exact ankle break", "knee"],
    keyPieces: {
      tops: { formal: "crisp poplin shirt", smart: "fine knit", casual: "clean cotton tee" },
      bottoms: { formal: "tailored trouser", smart: "pencil skirt", casual: "straight dark denim" },
      dresses: { formal: "clean-line midi dress", smart: "shirt dress", casual: "simple jersey dress" },
      outerwear: { formal: "tailored blazer", smart: "trench", casual: "fine wool cardigan" },
      shoes: { formal: "low block heel", smart: "loafer", casual: "clean white trainer" },
      bags: { formal: "structured tote", smart: "neat top handle", casual: "compact crossbody" },
      active: "precisely fitted activewear, nothing surplus",
    },
    signatureMove: "a fit so exact it looks made for you, plus one quiet detail",
    downrank: ["unfinished hem", "crumpling fabric", "clutter", "loud print"],
    breaks: "anything approximate, unfinished or creased",
    metals: "fine silver, small and exact",
  },
  Libra: {
    readAs: "composed, charming, and easy to look at",
    silhouette: "balanced, elegant and symmetrical",
    proportion: "even and harmonious, nothing extreme at either end",
    necklines: ["soft V", "halter", "boat"],
    hemlines: ["midi", "below knee", "floor-length"],
    keyPieces: {
      tops: { formal: "silk blouse", smart: "matching set top", casual: "fine knit tee" },
      bottoms: { formal: "coordinated tailored trouser", smart: "pleated midi skirt", casual: "clean straight jean" },
      dresses: { formal: "elegant column dress", smart: "slip dress", casual: "soft day dress" },
      outerwear: { formal: "soft tailored coat", smart: "matching blazer", casual: "longline cardigan" },
      shoes: { formal: "strappy heel", smart: "elegant flat", casual: "clean loafer" },
      bags: { formal: "small structured bag", smart: "clean shoulder bag", casual: "simple crossbody" },
      active: "balanced, coordinated activewear as a matched set",
    },
    signatureMove: "a colour pairing that looks considered rather than accidental",
    downrank: ["clashing print", "asymmetry for its own sake", "harsh hardware"],
    breaks: "clashing or off-balance combinations, which unsettle you all day",
    metals: "rose gold and warm brass",
  },
  Scorpio: {
    readAs: "magnetic, controlled, and holding something back on purpose",
    silhouette: "fitted and elongated, revealing selectively",
    proportion: "a strong single line with the eyes left as the most exposed thing",
    necklines: ["high neck", "deep narrow V", "halter"],
    hemlines: ["maxi", "midi", "floor-skimming"],
    keyPieces: {
      tops: { formal: "high-neck fitted top", smart: "sheer layered top", casual: "second-skin knit" },
      bottoms: { formal: "long fitted skirt", smart: "leather trouser", casual: "dark fitted jean" },
      dresses: { formal: "long fitted dress", smart: "sheer-panel midi", casual: "fitted jersey dress" },
      outerwear: { formal: "long tailored coat", smart: "leather jacket", casual: "dark bomber" },
      shoes: { formal: "sharp heel", smart: "tall boot", casual: "black ankle boot" },
      bags: { formal: "hard clutch", smart: "sleek shoulder bag", casual: "black crossbody" },
      active: "second-skin activewear in black",
    },
    signatureMove: "one dark deliberate piece worn like a decision",
    downrank: ["pastel", "busy print", "cute detail", "over-accessorising"],
    breaks: "busy, bright, over-explained outfits, which spend the mystery that does your work",
    metals: "gunmetal and black hardware",
  },
  Sagittarius: {
    readAs: "open, warm, and visibly on the way somewhere",
    silhouette: "relaxed, long and movement-friendly",
    proportion: "long lines finished with a real boot, unconstricted through the body",
    necklines: ["crew", "open collar", "scoop"],
    hemlines: ["maxi", "midi", "wide-leg full length"],
    keyPieces: {
      tops: { formal: "relaxed silk shirt", smart: "printed blouse", casual: "easy knit" },
      bottoms: { formal: "wide full-length trouser", smart: "maxi skirt", casual: "worn denim" },
      dresses: { formal: "long printed dress", smart: "maxi dress", casual: "easy jersey maxi" },
      outerwear: { formal: "long duster", smart: "oversized jacket", casual: "shearling" },
      shoes: { formal: "heeled knee boot", smart: "worn ankle boot", casual: "flat sandal" },
      bags: { formal: "structured satchel", smart: "crossbody satchel", casual: "slouchy hobo" },
      active: "loose, movement-first activewear",
    },
    signatureMove: "one well-travelled piece with a story attached",
    downrank: ["stiff formality", "restrictive fit", "delicate fabric"],
    breaks: "stiff formality, which makes you look borrowed rather than yourself",
    metals: "bronze and antique brass",
  },
  Capricorn: {
    readAs: "serious, capable, and the adult in the room before you speak",
    silhouette: "structured, tailored and architectural",
    proportion: "a strong vertical, elongated and controlled",
    necklines: ["clean crew", "notch collar", "high neck"],
    hemlines: ["midi", "full-length trouser", "knee"],
    keyPieces: {
      tops: { formal: "crisp shirt", smart: "fine knit", casual: "clean shell top" },
      bottoms: { formal: "tailored trouser", smart: "pencil skirt", casual: "dark straight denim" },
      dresses: { formal: "column dress", smart: "tailored midi", casual: "simple knit dress" },
      outerwear: { formal: "long wool coat", smart: "sharp blazer", casual: "clean leather jacket" },
      shoes: { formal: "polished block heel", smart: "leather boot", casual: "polished loafer" },
      bags: { formal: "briefcase tote", smart: "structured leather bag", casual: "neat crossbody" },
      active: "architectural activewear, compression and clean lines",
    },
    signatureMove: "one piece of obvious quality worn without comment",
    downrank: ["flimsy trend", "novelty", "visible logo", "cheap finish"],
    breaks: "flimsy trend pieces, which cost you the credibility the whole look runs on",
    metals: "brushed silver and steel",
  },
  Aquarius: {
    readAs: "electric, original, and slightly ahead of whatever everyone else is doing",
    silhouette: "unconventional proportions and unexpected layering",
    proportion: "a deliberate asymmetry or an odd hemline that makes the eye check",
    necklines: ["asymmetric", "high funnel", "cut-out"],
    hemlines: ["irregular", "midi", "wide cropped"],
    keyPieces: {
      tops: { formal: "sculptural shell top", smart: "asymmetric top", casual: "oversized graphic knit" },
      bottoms: { formal: "wide architectural trouser", smart: "unusual denim", casual: "utility trouser" },
      dresses: { formal: "sculptural midi dress", smart: "asymmetric dress", casual: "technical jersey dress" },
      outerwear: { formal: "oversized structured coat", smart: "unusual blazer", casual: "technical jacket" },
      shoes: { formal: "unexpected heel", smart: "chunky boot", casual: "statement trainer" },
      bags: { formal: "sculptural clutch", smart: "metallic crossbody", casual: "utility shoulder bag" },
      active: "unconventional-proportion activewear with unexpected layering",
    },
    signatureMove: "one thing nobody else in the room is wearing",
    downrank: ["mainstream classic", "predictable tailoring", "safe neutral"],
    breaks: "looking like everybody else, which is the only real failure state for this rising",
    metals: "chrome, steel and anything faintly futuristic",
  },
  Pisces: {
    readAs: "dreamy, soft-focus, and slightly not of this world",
    silhouette: "flowing, draped and translucent",
    proportion: "soft edges throughout, nothing cut sharply against the body",
    necklines: ["cowl", "soft V", "off shoulder"],
    hemlines: ["maxi", "floor-length", "handkerchief"],
    keyPieces: {
      tops: { formal: "draped satin blouse", smart: "sheer layered top", casual: "soft jersey top" },
      bottoms: { formal: "fluid wide trouser", smart: "bias maxi skirt", casual: "soft wide-leg jersey trouser" },
      dresses: { formal: "fluid floor-length dress", smart: "satin slip dress", casual: "soft maxi dress" },
      outerwear: { formal: "draped kimono coat", smart: "soft duster", casual: "oversized soft cardigan" },
      shoes: { formal: "delicate heel", smart: "soft boot", casual: "flat sandal" },
      bags: { formal: "beaded clutch", smart: "soft pouch", casual: "slouchy soft bag" },
      active: "fluid, unrestrictive activewear",
    },
    signatureMove: "a piece with shift in it, iridescence or a layer that moves",
    downrank: ["rigid tailoring", "hard corporate cut", "stiff hardware"],
    breaks: "rigid corporate hardness, which fights the impression you make",
    metals: "silver, opal and mother of pearl",
  },
};
