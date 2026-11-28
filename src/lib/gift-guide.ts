// The Gift Issue: a magazine-cover gift guide per sign, at /gift-guide/[sign].
// Generated from researched products (each price, link and photo taken from the brand's own US store
// on 26 Oct 2026, rechecked against the US stores 27 Nov 2026; book prices are publisher US list prices). Recheck prices before each season.
// Photos are cut out and stored in public/gift-guide/<sign>/. Slot positions are percentages of the
// cover, chosen so every product sits in its own space with no overlaps.

export interface Gift {
  slug: string;
  name: string;
  brand: string;
  store: string;
  /** USD */
  price: number;
  url: string;
  /** Cut-out product photo; empty for our own report, which is drawn. */
  img: string;
  why: string;
  ours?: boolean;
  /** Cover position: left/top/width in percent of the cover, rotation in degrees. */
  pos: { l: number; t: number; w: number; r: number };
}

export interface GiftGuide {
  sign: string;
  ruler: string;
  coverline: string;
  headline: [string, string];
  intro: string;
  gifts: Gift[];
}

export const GIFT_SIGNS = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"] as const;
export type GiftSign = (typeof GIFT_SIGNS)[number];

export const GIFT_GUIDES: Record<GiftSign, GiftGuide> = {
  "aries": {
    "sign": "aries",
    "ruler": "Mars",
    "coverline": "How to gift the girl who wants it yesterday",
    "headline": [
      "Fast, loud, a little bit",
      "dangerous"
    ],
    "intro": "Shopping for an Aries means shopping for the girl who's already halfway out the door, so whatever you get her has to keep up. She's ruled by Mars and runs the 1st house of self, which makes her the first to try it, the first to say it and the first to text back, so the gift that lands is one she can USE immediately: on her face, in her gym bag or in her hand at 6am while she laps everyone.",
    "gifts": [
      {
        "slug": "boy-brow",
        "name": "Boy Brow",
        "brand": "Glossier",
        "store": "Glossier",
        "price": 22,
        "url": "https://www.glossier.com/products/boy-brow",
        "img": "/gift-guide/aries/boy-brow.webp",
        "why": "Aries rules the head and face, and her brows do half the talking. Two swipes of this brushed-up gel and she looks like she's about to win an argument, which she is.",
        "pos": {
          "l": 5.6,
          "t": 21,
          "w": 14.9,
          "r": -6
        }
      },
      {
        "slug": "quencher",
        "name": "The Quencher H2.0 Flowstate Tumbler, 40 oz",
        "brand": "Stanley",
        "store": "Stanley",
        "price": 45,
        "url": "https://www.stanley1913.com/products/adventure-quencher-travel-tumbler-40-oz",
        "img": "/gift-guide/aries/quencher.webp",
        "why": "Forty ounces of water for the girl who forgets she has a body until she's sprinted through her entire to-do list. The handle slots into her car's cup holder, which is where she lives between plans.",
        "pos": {
          "l": 36,
          "t": 23.1,
          "w": 12,
          "r": 12
        }
      },
      {
        "slug": "theragun-mini",
        "name": "Theragun Mini",
        "brand": "Therabody",
        "store": "Therabody",
        "price": 219.99,
        "url": "https://www.therabody.com/products/theragun-mini-gen-3-black",
        "img": "/gift-guide/aries/theragun-mini.webp",
        "why": "She goes so hard at the gym that her muscles file complaints. This palm-sized massager unknots her in minutes and lives in her tote for post-spin emergencies.",
        "pos": {
          "l": 63.4,
          "t": 31,
          "w": 21.2,
          "r": 7
        }
      },
      {
        "slug": "landon-carryall",
        "name": "Landon Carryall in Cherry, Medium",
        "brand": "Dagne Dover",
        "store": "Dagne Dover",
        "price": 210,
        "url": "https://www.dagnedover.com/products/landon-carryall-medium-cherry",
        "img": "/gift-guide/aries/landon-carryall.webp",
        "why": "The gym bag that passes for a designer weekender, with a separate shoe pocket so her sneakers stop touching her laptop. She'll carry it from the 7am class straight into the meeting she's leading.",
        "pos": {
          "l": 5.6,
          "t": 47,
          "w": 17.9,
          "r": -4
        }
      },
      {
        "slug": "gloss-bomb-heat",
        "name": "Gloss Bomb Heat Lip Luminizer + Plumper",
        "brand": "Fenty Beauty",
        "store": "Fenty Beauty",
        "price": 26,
        "url": "https://fentybeauty.com/products/gloss-bomb-heat-universal-lip-luminizer-plumper-fenty-glow-heat",
        "img": "/gift-guide/aries/gloss-bomb-heat.webp",
        "why": "Mars rules her, so of course she wants a gloss that fights back. The Heat formula has a plumping tingle that wakes her lips up, and the shine is loud enough to match her voice in the group chat.",
        "pos": {
          "l": 40.7,
          "t": 48,
          "w": 4.5,
          "r": -6
        }
      },
      {
        "slug": "carnelian-bracelet",
        "name": "Carnelian Bracelet",
        "brand": "Energy Muse",
        "store": "Energy Muse",
        "price": 26.88,
        "url": "https://energymuse.com/products/carnelian-bracelet-2",
        "img": "/gift-guide/aries/carnelian-bracelet.webp",
        "why": "Carnelian is the fire stone, orange as a struck match, and crystal girlies wear it for courage and get-up-and-go. She'll stack it next to her gym watch and swear it's just for the look.",
        "pos": {
          "l": 74.1,
          "t": 54,
          "w": 19.9,
          "r": -8
        }
      },
      {
        "slug": "untamed",
        "name": "Untamed",
        "brand": "Glennon Doyle",
        "store": "Bookshop.org",
        "price": 28,
        "url": "https://bookshop.org/book/9781984801258",
        "img": "/gift-guide/aries/untamed.webp",
        "why": "A whole book about refusing to shrink, written by a woman who blew up her own life to live a truer one. Your Aries will read it in two sittings and quote it at you for a YEAR.",
        "pos": {
          "l": 31.1,
          "t": 62,
          "w": 19.8,
          "r": -7
        }
      },
      {
        "slug": "bala-bangles",
        "name": "Bala Bangles",
        "brand": "Bala",
        "store": "Bala",
        "price": 55,
        "url": "https://shopbala.com/products/bala-bangles",
        "img": "/gift-guide/aries/bala-bangles.webp",
        "why": "Wrist and ankle weights so pretty she'll wear them on the coffee run. Aries treats every walk like a race she's already winning, so give her the extra resistance she secretly wants.",
        "pos": {
          "l": 5.7,
          "t": 66,
          "w": 18.7,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "Her chart, read by hand, telling her exactly what kind of baddie a Mars-ruled girl is built to be and where she's been burning energy on the wrong fight. It lands in her inbox in 48 hours.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "taurus": {
    "sign": "taurus",
    "ruler": "Venus",
    "coverline": "How to gift the girl who can smell a cheap candle from the hallway",
    "headline": [
      "Soft, rich and",
      "worth every dollar"
    ],
    "intro": "Taurus is ruled by Venus and holds the 2nd house of money, pleasure and the things you own, which means she can clock real cashmere from across a room and she will NOT pretend to love a scratchy throw. Buy her one beautiful thing she can touch, taste or smell every single day, because for a Taurus the luxury is in the repeating.",
    "gifts": [
      {
        "slug": "lip-butter-balm",
        "name": "Lip Butter Balm, Vanilla",
        "brand": "Summer Fridays",
        "store": "Summer Fridays",
        "price": 24,
        "url": "https://www.summerfridays.com/products/lip-butter-balm",
        "img": "/gift-guide/taurus/lip-butter-balm.webp",
        "why": "Taurus rules the throat and mouth, and this is the balm every Venus girl ends up rebuying. Vanilla, cushiony and a little glossy, with a slanted tip that makes reapplying at dinner look hot.",
        "pos": {
          "l": 5.8,
          "t": 21,
          "w": 14.3,
          "r": -6
        }
      },
      {
        "slug": "dubai-chocolate",
        "name": "Dubai Pistachio Knafeh Chocolate Bar",
        "brand": "Compartés",
        "store": "Compartés",
        "price": 12,
        "url": "https://www.compartes.com/products/dubai-pistachio-chocolate-bar",
        "img": "/gift-guide/taurus/dubai-chocolate.webp",
        "why": "The pistachio and crunchy kataifi bar the whole internet lost its mind over, from a chocolatier that wraps every bar like it's already a present. Hand it over and watch her eyes close on the first bite.",
        "pos": {
          "l": 36.5,
          "t": 23,
          "w": 11,
          "r": 12
        }
      },
      {
        "slug": "waffle-robe",
        "name": "Dreamweave Waffle Robe",
        "brand": "Brooklinen",
        "store": "Brooklinen",
        "price": 129,
        "url": "https://www.brooklinen.com/products/waffle-robe",
        "img": "/gift-guide/taurus/waffle-robe.webp",
        "why": "Soft waffle knit she'll put on the second she's home and refuse to take off until Monday. A robe this nice turns a night in into her favorite plan.",
        "pos": {
          "l": 64.1,
          "t": 31,
          "w": 19.8,
          "r": 7
        }
      },
      {
        "slug": "pyrite",
        "name": "Pyrite Cube, Medium",
        "brand": "Energy Muse",
        "store": "Energy Muse",
        "price": 34.88,
        "url": "https://energymuse.com/products/pyrite-cube",
        "img": "/gift-guide/taurus/pyrite.webp",
        "why": "Fool's gold, grown by the earth in near-perfect cubes, and the stone crystal girlies keep on the desk to call in money. It looks like a tiny gold building, which is exactly what she's planning to own.",
        "pos": {
          "l": 5,
          "t": 47.6,
          "w": 19,
          "r": -4
        }
      },
      {
        "slug": "always-pan",
        "name": "Always Pan 10.5\"",
        "brand": "Our Place",
        "store": "Our Place",
        "price": 135,
        "url": "https://fromourplace.com/products/always-essential-cooking-pan",
        "img": "/gift-guide/taurus/always-pan.webp",
        "why": "The one pan that does the job of eight, in colors pretty enough to leave out on the stove. Taurus shows love by feeding people, so give her the pan every Sunday dinner gets made in.",
        "pos": {
          "l": 28,
          "t": 50.6,
          "w": 30,
          "r": -6
        }
      },
      {
        "slug": "glossier-you",
        "name": "Glossier You",
        "brand": "Glossier",
        "store": "Glossier",
        "price": 32,
        "url": "https://www.glossier.com/products/glossier-you",
        "img": "/gift-guide/taurus/glossier-you.webp",
        "why": "The skin scent built around ambrette and musk, so it smells a little different on every wearer and a lot like her. Venus girls love a perfume people have to lean in close to catch.",
        "pos": {
          "l": 80,
          "t": 54,
          "w": 8,
          "r": -8
        }
      },
      {
        "slug": "psychology-of-money",
        "name": "The Psychology of Money",
        "brand": "Morgan Housel",
        "store": "Bookshop.org",
        "price": 19.99,
        "url": "https://bookshop.org/book/9780857197689",
        "img": "/gift-guide/taurus/psychology-of-money.webp",
        "why": "She runs the money house of the zodiac, so give her the book on why rich people stay rich. Short chapters, zero lecturing, perfect for the bath with a glass of red.",
        "pos": {
          "l": 31.8,
          "t": 62,
          "w": 18.4,
          "r": -7
        }
      },
      {
        "slug": "bum-bum-jet-set",
        "name": "Bum Bum Jet Set",
        "brand": "Sol de Janeiro",
        "store": "Sol de Janeiro",
        "price": 34,
        "url": "https://soldejaneiro.com/products/bum-bum-jet-set",
        "img": "/gift-guide/taurus/bum-bum-jet-set.webp",
        "why": "The pistachio-caramel cream that made Sol de Janeiro famous, with the wash and mist to match, zipped into a pouch she'll reuse forever. She'll smell like dessert from December to March.",
        "pos": {
          "l": 5.4,
          "t": 66,
          "w": 19.2,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "A hand-made read of her chart that shows her where the money's been hiding and what a Venus-ruled baddie is meant to get paid for. It lands in 48 hours, so it beats every package under the tree.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "gemini": {
    "sign": "gemini",
    "ruler": "Mercury",
    "coverline": "How to gift the girl who changed her mind twice while you read this",
    "headline": [
      "Two of everything,",
      "obviously"
    ],
    "intro": "Gemini is ruled by Mercury and lives in the 3rd house of chats, texts, siblings and quick weekend trips, so she's always mid-conversation and halfway to somewhere else. She gets bored fast, which makes the winning gift something with options, something she can use while talking, or a story juicy enough to keep her off her phone for one whole evening.",
    "gifts": [
      {
        "slug": "lip-case",
        "name": "Lip Case",
        "brand": "rhode",
        "store": "rhode",
        "price": 38,
        "url": "https://www.rhodeskin.com/products/lip-case",
        "img": "/gift-guide/gemini/lip-case.webp",
        "why": "Her phone is basically an organ, so this puffy case keeps a lip tint tucked into the back of it. Gemini rules the hands, and now everything she needs is in one of them.",
        "pos": {
          "l": 5.5,
          "t": 21,
          "w": 15.1,
          "r": -6
        }
      },
      {
        "slug": "lip-cheek-tint",
        "name": "Lip & Cheek Blush Tint",
        "brand": "Kylie Cosmetics",
        "store": "Kylie Cosmetics",
        "price": 26,
        "url": "https://kyliecosmetics.com/products/lip-and-cheek-blush-tint",
        "img": "/gift-guide/gemini/lip-cheek-tint.webp",
        "why": "One tube, two jobs, which is exactly how a Gemini likes it. A pink wash for lips and cheeks she can put on in the back of an Uber while telling three stories at once.",
        "pos": {
          "l": 39.5,
          "t": 23,
          "w": 5,
          "r": 12
        }
      },
      {
        "slug": "mini-notebook",
        "name": "Rough Draft Mini Notebook",
        "brand": "Ban.do",
        "store": "Ban.do",
        "price": 7.99,
        "url": "https://www.bando.com/products/rough-draft-mini-notebook-navy-star-floral",
        "img": "/gift-guide/gemini/mini-notebook.webp",
        "why": "For the four hundred ideas she has an hour and forgets by dinner. Mercury girls think in lists, and this little floral one fits in every bag she owns, which is a LOT of bags.",
        "pos": {
          "l": 63.4,
          "t": 31,
          "w": 21.2,
          "r": 7
        }
      },
      {
        "slug": "mini-weekender",
        "name": "The Mini Weekender",
        "brand": "Béis",
        "store": "Béis",
        "price": 108,
        "url": "https://beistravel.com/products/the-mini-weekender-in-maple",
        "img": "/gift-guide/gemini/mini-weekender.webp",
        "why": "Gemini rules short trips, the spontaneous Friday-to-Sunday kind, and this fits a weekend plus her laptop. The bottom compartment keeps her shoes away from her outfit changes.",
        "pos": {
          "l": 6.9,
          "t": 47,
          "w": 15.2,
          "r": -4
        }
      },
      {
        "slug": "double-huggies",
        "name": "Classic Double Huggies, Sterling Silver",
        "brand": "Missoma",
        "store": "Missoma",
        "price": 122,
        "url": "https://us.missoma.com/products/classic-double-huggies-sterling-silver-cubic-zirconia",
        "img": "/gift-guide/gemini/double-huggies.webp",
        "why": "Two hoops built into one earring, for the sign of the twins. Sterling silver with a little sparkle that catches the light every time she talks with her hands.",
        "pos": {
          "l": 30.8,
          "t": 48,
          "w": 24.3,
          "r": -6
        }
      },
      {
        "slug": "balm-dotcom-trio",
        "name": "Balm Dotcom Trio",
        "brand": "Glossier",
        "store": "Glossier",
        "price": 42,
        "url": "https://www.glossier.com/products/balm-dotcom-trio",
        "img": "/gift-guide/gemini/balm-dotcom-trio.webp",
        "why": "Three flavors of the cult balm, one for every bag she rotates between. She'll pick by mood, which changes hourly.",
        "pos": {
          "l": 75.9,
          "t": 54,
          "w": 16.1,
          "r": -8
        }
      },
      {
        "slug": "evelyn-hugo",
        "name": "The Seven Husbands of Evelyn Hugo",
        "brand": "Taylor Jenkins Reid",
        "store": "Bookshop.org",
        "price": 17.99,
        "url": "https://bookshop.org/book/9781501161933",
        "img": "/gift-guide/gemini/evelyn-hugo.webp",
        "why": "Old Hollywood gossip, seven marriages and one enormous secret, told by the woman who lived it. She'll stay up until 3am reading and then make you discuss every single husband.",
        "pos": {
          "l": 31.4,
          "t": 62,
          "w": 19.3,
          "r": -7
        }
      },
      {
        "slug": "micro-pouch",
        "name": "Micro Pouch",
        "brand": "Stoney Clover Lane",
        "store": "Stoney Clover Lane",
        "price": 48,
        "url": "https://www.stoneyclover.com/products/core-micro-pouch",
        "img": "/gift-guide/gemini/micro-pouch.webp",
        "why": "A tiny nylon pouch for earbuds, lip tint and the receipts she's keeping as evidence. Gemini runs on little errands, and this clips onto everything.",
        "pos": {
          "l": 6.1,
          "t": 66,
          "w": 17.9,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "Her chart, read by hand, so she finally understands why she's built for two careers, three group chats and one huge idea. It lands in 48 hours, faster than she changes her mind.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "cancer": {
    "sign": "cancer",
    "ruler": "Moon",
    "coverline": "How to gift the girl who still has every card you ever wrote her",
    "headline": [
      "Home is the",
      "whole point"
    ],
    "intro": "Cancer is ruled by the Moon and holds the 4th house of home, family and everything that makes you feel safe, so she keeps every ticket stub and still sleeps in the hoodie from that one summer. She takes care of everybody, which means the gift that makes her cry is the one that takes care of HER: at home, under a blanket, with something that smells like comfort.",
    "gifts": [
      {
        "slug": "moonology",
        "name": "Moonology",
        "brand": "Yasmin Boland",
        "store": "Bookshop.org",
        "price": 19.99,
        "url": "https://bookshop.org/book/9781781807422",
        "img": "/gift-guide/cancer/moonology.webp",
        "why": "Her ruling planet IS the Moon, so give her the guide to working with every phase of it. New moon intentions, full moon releases, written so she can start tonight.",
        "pos": {
          "l": 5,
          "t": 22.3,
          "w": 16,
          "r": -6
        }
      },
      {
        "slug": "kimono-pajamas",
        "name": "DreamModal Kimono Pajama Set",
        "brand": "Lake",
        "store": "Lake Pajamas",
        "price": 148,
        "url": "https://lakepajamas.com/products/fog-dreammodal-kimono-pajama-set",
        "img": "/gift-guide/cancer/kimono-pajamas.webp",
        "why": "Buttery modal pajamas with a kimono top for the girl whose favorite place on earth is her own couch. She'll wear them on Christmas morning and every Sunday after.",
        "pos": {
          "l": 36,
          "t": 24.3,
          "w": 12,
          "r": 12
        }
      },
      {
        "slug": "rib-knit-throw",
        "name": "Organic Two Tone Rib Knit Throw, Moss and Evergreen",
        "brand": "Parachute",
        "store": "Parachute",
        "price": 129,
        "url": "https://www.parachutehome.com/products/organic-two-tone-rib-knit-throw-moss-and-evergreen",
        "img": "/gift-guide/cancer/rib-knit-throw.webp",
        "why": "A heavy organic cotton throw to wrap herself in while she rewatches the same comfort show for the eleventh time. Cancer heals at home, so give her something to heal under.",
        "pos": {
          "l": 63,
          "t": 31.2,
          "w": 22,
          "r": 7
        }
      },
      {
        "slug": "selenite-heart",
        "name": "Heart Selenite Charging Bowl, XL",
        "brand": "Energy Muse",
        "store": "Energy Muse",
        "price": 74.88,
        "url": "https://energymuse.com/products/large-selenite-heart-charging-bowl",
        "img": "/gift-guide/cancer/selenite-heart.webp",
        "why": "Selenite is the moon's crystal, milky white and said to cleanse whatever rests on it. She'll drop her rings in it every night and feel like a witch in a period drama.",
        "pos": {
          "l": 5,
          "t": 48.3,
          "w": 19,
          "r": -4
        }
      },
      {
        "slug": "satin-pillowcase",
        "name": "Satin Pillowcase",
        "brand": "Kitsch",
        "store": "Kitsch",
        "price": 23,
        "url": "https://mykitsch.com/products/satin-pillowcase-in-pearlized-cream-coastal-blue-print",
        "img": "/gift-guide/cancer/satin-pillowcase.webp",
        "why": "Satin that's kind to her hair and her skin, so she wakes up softer than she went to sleep. She feels everything all day, so let her bed be the one place that's easy.",
        "pos": {
          "l": 32.1,
          "t": 48,
          "w": 21.8,
          "r": -6
        }
      },
      {
        "slug": "photo-album",
        "name": "Photo Album, Cherry Heart",
        "brand": "Ban.do",
        "store": "Ban.do",
        "price": 22.95,
        "url": "https://www.bando.com/products/photo-album-cherry-heart",
        "img": "/gift-guide/cancer/photo-album.webp",
        "why": "A little album for the printed photos she's kept in a shoebox since 2014. Fill the first page yourself with one of you two and watch her lose it.",
        "pos": {
          "l": 75,
          "t": 54,
          "w": 17.9,
          "r": -8
        }
      },
      {
        "slug": "reserve-tumbler",
        "name": "The Reserve Wine Tumbler, Rose Quartz",
        "brand": "Stanley",
        "store": "Stanley",
        "price": 25,
        "url": "https://www.stanley1913.com/products/the-mesa-rose-reserved-wine-tumbler?variant=53974029304168",
        "img": "/gift-guide/cancer/reserve-tumbler.webp",
        "why": "A blush pink insulated wine tumbler, so her glass stays cold all through the family dinner. Cancer always ends up hosting, so let her look cute doing it.",
        "pos": {
          "l": 31,
          "t": 63.3,
          "w": 20,
          "r": -7
        }
      },
      {
        "slug": "otherland-candle",
        "name": "Daybed Candle",
        "brand": "Otherland",
        "store": "Otherland",
        "price": 20,
        "url": "https://www.otherland.com/products/daybed",
        "img": "/gift-guide/cancer/otherland-candle.webp",
        "why": "A candle in a hand-painted vessel that smells like a lazy afternoon nap, which is basically her love language. Light it and the whole house feels like home.",
        "pos": {
          "l": 5.6,
          "t": 66,
          "w": 18.9,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "A hand-made read of her chart showing why a Moon-ruled baddie feels everything, and how to turn all that feeling into power. It lands in her inbox in 48 hours, ready for the slow days after Christmas.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "leo": {
    "sign": "leo",
    "ruler": "Sun",
    "coverline": "How to gift the girl who IS the party",
    "headline": [
      "More gold, more glow,",
      "more her"
    ],
    "intro": "Leo is ruled by the Sun and runs the 5th house of fun, flirting and making things, so she's the main character in every room whether she planned it or not. She gives the best gifts in the friend group and she NOTICES effort, so go shiny, go golden and get her something that makes her hair, her face or her neckline the first thing people see.",
    "gifts": [
      {
        "slug": "miami-nectar",
        "name": "Miami Nectar Eau de Parfum",
        "brand": "Ellis Brooklyn",
        "store": "Ellis Brooklyn",
        "price": 115,
        "url": "https://ellisbrooklyn.com/products/miami-nectar-eau-de-parfum",
        "img": "/gift-guide/leo/miami-nectar.webp",
        "why": "A sunny, juicy perfume in a turquoise bottle that looks like a vacation. She's ruled by the Sun, and this smells like she brought some home with her.",
        "pos": {
          "l": 5.8,
          "t": 21,
          "w": 14.5,
          "r": -6
        }
      },
      {
        "slug": "cheirosa-62",
        "name": "Cheirosa 62 Perfume Mist",
        "brand": "Sol de Janeiro",
        "store": "Sol de Janeiro",
        "price": 26,
        "url": "https://soldejaneiro.com/products/cheirosa-62-hair-body-fragrance-mist",
        "img": "/gift-guide/leo/cheirosa-62.webp",
        "why": "The pistachio and salted caramel mist that makes strangers stop her in the street to ask what she's wearing. Leo lives for that question.",
        "pos": {
          "l": 37.8,
          "t": 23,
          "w": 8.4,
          "r": 12
        }
      },
      {
        "slug": "matte-lip-kit",
        "name": "Matte Lip Kit",
        "brand": "Kylie Cosmetics",
        "store": "Kylie Cosmetics",
        "price": 35,
        "url": "https://kyliecosmetics.com/products/matte-lip-kit",
        "img": "/gift-guide/leo/matte-lip-kit.webp",
        "why": "Liquid lipstick and matching liner from the woman who made lip kits famous. Leo wants a signature look, and this is the one she'll wear in every photo for the next year.",
        "pos": {
          "l": 63,
          "t": 32.5,
          "w": 22,
          "r": 7
        }
      },
      {
        "slug": "heatless-curler",
        "name": "Satin Heatless Curling Set",
        "brand": "Kitsch",
        "store": "Kitsch",
        "price": 27,
        "url": "https://mykitsch.com/products/satin-heatless-curling-set-bundle",
        "img": "/gift-guide/leo/heatless-curler.webp",
        "why": "Leo rules the hair, the mane, the crowning glory. She wraps it at night, sleeps on satin and wakes up with a blowout that never went near a hot tool.",
        "pos": {
          "l": 5,
          "t": 47.4,
          "w": 19,
          "r": -4
        }
      },
      {
        "slug": "lucea",
        "name": "Lucea 1.5\" Smart Straightener",
        "brand": "T3",
        "store": "T3",
        "price": 199.99,
        "url": "https://www.t3micro.com/products/lucea-1-5-straightening-and-styling-iron",
        "img": "/gift-guide/leo/lucea.webp",
        "why": "A smart flat iron that sets the heat for her hair type, so the mane stays glossy and healthy. The best tool for the sign who treats every day like a red carpet.",
        "pos": {
          "l": 40.7,
          "t": 48,
          "w": 4.7,
          "r": -6
        }
      },
      {
        "slug": "diamond-bomb",
        "name": "Diamond Bomb All-Over Diamond Veil",
        "brand": "Fenty Beauty",
        "store": "Fenty Beauty",
        "price": 43,
        "url": "https://fentybeauty.com/products/diamond-bomb-all-over-diamond-veil-pink-ice",
        "img": "/gift-guide/leo/diamond-bomb.webp",
        "why": "Diamond-dust highlighter from Rihanna's own line, made for glowing from across the bar. One swipe on her collarbones and the room turns around.",
        "pos": {
          "l": 74.2,
          "t": 54,
          "w": 19.6,
          "r": -8
        }
      },
      {
        "slug": "big-magic",
        "name": "Big Magic",
        "brand": "Elizabeth Gilbert",
        "store": "Bookshop.org",
        "price": 18,
        "url": "https://bookshop.org/book/9781594634727",
        "img": "/gift-guide/leo/big-magic.webp",
        "why": "Leo holds the 5th house of creativity, and this is the book that tells her to make the thing anyway. Gilbert writes like a hype friend with a library card.",
        "pos": {
          "l": 31,
          "t": 62,
          "w": 19.9,
          "r": -7
        }
      },
      {
        "slug": "enzo-chain",
        "name": "Enzo Chain Necklace",
        "brand": "Gorjana",
        "store": "Gorjana",
        "price": 70,
        "url": "https://www.gorjana.com/products/enzo-chain-necklace",
        "img": "/gift-guide/leo/enzo-chain.webp",
        "why": "A gold chain made to be stacked, layered and photographed. The Sun rules her, so the more golden she looks, the better she feels.",
        "pos": {
          "l": 5,
          "t": 66.2,
          "w": 20,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "Her chart, read by hand, so she knows exactly what a Sun-ruled baddie is meant to be famous for. It lands in 48 hours, so her glow-up starts before New Year's Eve.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "virgo": {
    "sign": "virgo",
    "ruler": "Mercury",
    "coverline": "How to gift the girl who will absolutely notice the price sticker",
    "headline": [
      "Useful is",
      "so sexy"
    ],
    "intro": "Virgo is ruled by Mercury and holds the 6th house of routines, health and the daily rituals that make life run, so she's the friend with the color-coded calendar and the skincare steps in the right order. She'll spot a lazy gift instantly, which means you win by getting her something beautifully made, properly useful and ready to slot into the routine she already loves.",
    "gifts": [
      {
        "slug": "atomic-habits",
        "name": "Atomic Habits",
        "brand": "James Clear",
        "store": "Bookshop.org",
        "price": 27,
        "url": "https://bookshop.org/book/9780735211292",
        "img": "/gift-guide/virgo/atomic-habits.webp",
        "why": "How tiny daily changes add up to a whole new life, which is Virgo's actual religion. She'll highlight it, annotate it and lend it to you with notes in the margins.",
        "pos": {
          "l": 5,
          "t": 22.8,
          "w": 16,
          "r": -6
        }
      },
      {
        "slug": "sos-spray",
        "name": "SOS Daily Rescue Facial Spray",
        "brand": "Tower 28",
        "store": "Tower 28",
        "price": 12,
        "url": "https://www.tower28beauty.com/products/sos-daily-facial-rescue-spray",
        "img": "/gift-guide/virgo/sos-spray.webp",
        "why": "A hypochlorous facial spray that calms red, angry skin in seconds and is gentle enough for the most sensitive faces. Virgo will read the ingredient list and approve.",
        "pos": {
          "l": 38.8,
          "t": 23,
          "w": 6.3,
          "r": 12
        }
      },
      {
        "slug": "great-skin-duo",
        "name": "The Great Skin Duo",
        "brand": "Merit",
        "store": "Merit",
        "price": 76,
        "url": "https://www.meritbeauty.com/products/the-great-skin-duo",
        "img": "/gift-guide/virgo/great-skin-duo.webp",
        "why": "A minimalist skincare pair from the brand built for five-minute mornings, max. Virgo loves a routine that does more with less.",
        "pos": {
          "l": 63,
          "t": 32.5,
          "w": 22,
          "r": 7
        }
      },
      {
        "slug": "week-on-loop",
        "name": "A Week on LOOP",
        "brand": "LOOPS",
        "store": "LOOPS",
        "price": 44,
        "url": "https://loopsbeauty.com/products/a-week-on-loop",
        "img": "/gift-guide/virgo/week-on-loop.webp",
        "why": "Seven sheet masks for seven nights, which is a self-care schedule in a box. She'll put it in her calendar.",
        "pos": {
          "l": 5,
          "t": 47.5,
          "w": 19,
          "r": -4
        }
      },
      {
        "slug": "sateen-sheets",
        "name": "Luxe Sateen Core Sheet Set",
        "brand": "Brooklinen",
        "store": "Brooklinen",
        "price": 169,
        "url": "https://www.brooklinen.com/products/luxe-core-sheet-set",
        "img": "/gift-guide/virgo/sateen-sheets.webp",
        "why": "Smooth, cool sateen sheets for the hotel-bed feeling every single night. Better sleep counts as a health goal, and Virgo takes her health goals seriously.",
        "pos": {
          "l": 29.1,
          "t": 48,
          "w": 27.9,
          "r": -6
        }
      },
      {
        "slug": "winter-skin-set",
        "name": "The Winter Skin Set",
        "brand": "rhode",
        "store": "rhode",
        "price": 86,
        "url": "https://www.rhodeskin.com/products/the-winter-skin-set",
        "img": "/gift-guide/virgo/winter-skin-set.webp",
        "why": "Five rhode minis for glazed winter skin, packed in one tinsel box with every step in order. Virgo rules health, and she'll love a whole ritual that does what it says.",
        "pos": {
          "l": 74,
          "t": 54.1,
          "w": 20,
          "r": -8
        }
      },
      {
        "slug": "planner",
        "name": "Classic 17-Month Planner",
        "brand": "Ban.do",
        "store": "Ban.do",
        "price": 19.95,
        "url": "https://www.bando.com/products/classic-17-month-academic-planner-bonjour",
        "img": "/gift-guide/virgo/planner.webp",
        "why": "Seventeen months of pages for the girl who plans her week on Sunday night with a cup of tea. The cover says bonjour, the inside says she has her life together.",
        "pos": {
          "l": 31,
          "t": 62.3,
          "w": 20,
          "r": -7
        }
      },
      {
        "slug": "card-case",
        "name": "Accordion Card Case",
        "brand": "Dagne Dover",
        "store": "Dagne Dover",
        "price": 70,
        "url": "https://www.dagnedover.com/products/accordion-card-case-bone-reset",
        "img": "/gift-guide/virgo/card-case.webp",
        "why": "A neat card case with a pocket for every card, receipt and loyalty stamp. Virgo has opinions about messy wallets, and this ends the conversation.",
        "pos": {
          "l": 5,
          "t": 70.8,
          "w": 20,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "A hand-made read of her chart that shows a Mercury-ruled perfectionist where she's been hiding behind being helpful, and what she's actually here to do. It lands in 48 hours, right on schedule, which she'll appreciate.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "libra": {
    "sign": "libra",
    "ruler": "Venus",
    "coverline": "How to gift the girl who has great taste and an opinion on yours",
    "headline": [
      "Pretty is a",
      "personality trait"
    ],
    "intro": "Libra is ruled by Venus and holds the 7th house of love, partnership and the people we choose, so she has a beautiful eye and an opinion on your outfit before you've sat down. She'll love anything that makes her life look like a painting, especially if it's pink, pearly or made for sharing with whoever she's falling for.",
    "gifts": [
      {
        "slug": "sun-fruit",
        "name": "Sun Fruit Eau de Parfum Travel Spray",
        "brand": "Ellis Brooklyn",
        "store": "Ellis Brooklyn",
        "price": 33,
        "url": "https://ellisbrooklyn.com/products/sun-fruit-eau-de-parfum-travel-spray",
        "img": "/gift-guide/libra/sun-fruit.webp",
        "why": "A juicy fruit and florals perfume in a travel size that fits her clutch. She'll reapply in the bathroom mirror and come back smelling like a summer romance.",
        "pos": {
          "l": 10.8,
          "t": 21,
          "w": 4.4,
          "r": -6
        }
      },
      {
        "slug": "ellie-nap-dress",
        "name": "The Ellie Nap Dress",
        "brand": "Hill House Home",
        "store": "Hill House Home",
        "price": 99,
        "url": "https://www.hillhousehome.com/products/the-ellie-nap-dress-blue-trellis",
        "img": "/gift-guide/libra/ellie-nap-dress.webp",
        "why": "The smocked, floaty nap dress that made sleepwear socially acceptable. She'll wear it to brunch with a blazer and someone will ask where it's from.",
        "pos": {
          "l": 36,
          "t": 23.1,
          "w": 12,
          "r": 12
        }
      },
      {
        "slug": "milky-lip-set",
        "name": "Milky Lip Set",
        "brand": "Tower 28",
        "store": "Tower 28",
        "price": 65,
        "url": "https://www.tower28beauty.com/products/shineon-milky-lip-jelly-collection",
        "img": "/gift-guide/libra/milky-lip-set.webp",
        "why": "A row of sheer, milky lip jellies in pinks and berries, so she can match her mouth to every outfit. Libras hate choosing, so give her the whole set.",
        "pos": {
          "l": 63,
          "t": 33.9,
          "w": 22,
          "r": 7
        }
      },
      {
        "slug": "pearl-hoops",
        "name": "Pearl Twisted Small Drop Hoops",
        "brand": "Missoma",
        "store": "Missoma",
        "price": 140,
        "url": "https://us.missoma.com/products/pearl-twisted-small-drop-hoop-earrings-gold-plated-vermeil-pearl",
        "img": "/gift-guide/libra/pearl-hoops.webp",
        "why": "Twisted gold hoops with a freshwater pearl swinging from each one. Pearls are Venus jewelry, and she knows it.",
        "pos": {
          "l": 5,
          "t": 48.6,
          "w": 19,
          "r": -4
        }
      },
      {
        "slug": "jewelry-case",
        "name": "The Jewelry Case in Black",
        "brand": "Béis",
        "store": "Béis",
        "price": 48,
        "url": "https://beistravel.com/products/the-travel-jewelry-case-in-black",
        "img": "/gift-guide/libra/jewelry-case.webp",
        "why": "A sleek travel case with little compartments for her rings, hoops and chains. Everything has a place, which keeps her calm and her necklaces untangled.",
        "pos": {
          "l": 28,
          "t": 49.5,
          "w": 30,
          "r": -6
        }
      },
      {
        "slug": "rose-quartz-bracelet",
        "name": "Rose Quartz Bracelet",
        "brand": "Energy Muse",
        "store": "Energy Muse",
        "price": 26.88,
        "url": "https://energymuse.com/products/rose-quartz-bracelet-3",
        "img": "/gift-guide/libra/rose-quartz-bracelet.webp",
        "why": "Rose quartz is the love stone, soft pink and said to open the heart. Venus girls wear it on dates, in meetings and anywhere they want to feel adored.",
        "pos": {
          "l": 74.3,
          "t": 54,
          "w": 19.4,
          "r": -8
        }
      },
      {
        "slug": "ribbon-tumbler",
        "name": "The Reserve Wine Tumbler, Soft Pink Ribbon",
        "brand": "Stanley",
        "store": "Stanley",
        "price": 30,
        "url": "https://www.stanley1913.com/products/the-reserve-wine-tumbler-11-oz?variant=53974926590312",
        "img": "/gift-guide/libra/ribbon-tumbler.webp",
        "why": "An insulated wine tumbler wrapped in a big pink bow, so her glass stays cold through a three-hour dinner date. Libra is ruled by Venus, so even her drink has to look this pretty.",
        "pos": {
          "l": 31,
          "t": 68.7,
          "w": 20,
          "r": -7
        }
      },
      {
        "slug": "artists-way",
        "name": "The Artist's Way",
        "brand": "Julia Cameron",
        "store": "Bookshop.org",
        "price": 20,
        "url": "https://bookshop.org/book/9780143129257",
        "img": "/gift-guide/libra/artists-way.webp",
        "why": "Libra is the artist of the air signs, and this twelve-week course is how she gets her creative life back. Morning pages every day, an artist date every week, a new her by spring.",
        "pos": {
          "l": 5,
          "t": 66,
          "w": 20,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "Her chart, read by hand, showing a Venus-ruled baddie what she's worth in love AND in money. It lands in her inbox in 48 hours, beautifully laid out, obviously.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "scorpio": {
    "sign": "scorpio",
    "ruler": "Pluto",
    "coverline": "How to gift the girl who already knows what you got her",
    "headline": [
      "Go deep, go dark, go",
      "expensive-smelling"
    ],
    "intro": "Gifting a Scorpio is TERRIFYINGGG because she clocked what you were getting her in your search history back in August. She rules the 8th house of intimacy, secrets and other people's money, so the gift that lands is the one that proves you actually SEE her: something she'd keep by the bed, wear on her skin or use to read the room even harder than she already does.",
    "gifts": [
      {
        "slug": "perfume",
        "name": "Black Orchid Eau de Parfum, 50ml",
        "brand": "Tom Ford",
        "store": "Tom Ford Beauty",
        "price": 165,
        "url": "https://www.tomfordbeauty.com/products/black-orchid-eau-de-parfum",
        "img": "/gift-guide/scorpio/perfume.webp",
        "why": "She wants to walk in and have the whole room wonder what she's wearing and be too scared to ask. Black truffle, dark plum and orchid that clings to your sweater for three days, which is exactly how she likes to leave things.",
        "pos": {
          "l": 6.3,
          "t": 21,
          "w": 13.5,
          "r": -6
        }
      },
      {
        "slug": "lipstick",
        "name": "Retro Matte Lipstick in Ruby Woo",
        "brand": "MAC",
        "store": "MAC",
        "price": 24,
        "url": "https://www.maccosmetics.com/products/retro-matte-lipstick?shade=Ruby_Woo",
        "img": "/gift-guide/scorpio/lipstick.webp",
        "why": "Scorpio is ruled by Mars AND Pluto, so her red has to read like a warning label. Ruby Woo is the blue-red matte that lives in every baddie's bag, and it survives dinner, drinks and the 1am kiss.",
        "pos": {
          "l": 37.2,
          "t": 23,
          "w": 9.5,
          "r": 12
        }
      },
      {
        "slug": "tarot",
        "name": "The Wild Unknown Tarot Deck + Guidebook",
        "brand": "Kim Krans",
        "store": "Bookshop.org",
        "price": 40,
        "url": "https://bookshop.org/book/9780062466594",
        "img": "/gift-guide/scorpio/tarot.webp",
        "why": "She already reads people for a living, so hand her the tools to read everything else. The black and white deck that gets passed down between witchy friends, and she'll be pulling cards on your love life by New Year's Eve.",
        "pos": {
          "l": 65.2,
          "t": 31,
          "w": 17.6,
          "r": 7
        }
      },
      {
        "slug": "book",
        "name": "Women Who Run With the Wolves",
        "brand": "Clarissa Pinkola Estés",
        "store": "Bookshop.org",
        "price": 20,
        "url": "https://bookshop.org/book/9780345409874",
        "img": "/gift-guide/scorpio/book.webp",
        "why": "The book every Scorpio should be handed at 25. Wild women, the underworld and coming back up with your power in your teeth, which is the Pluto story start to finish.",
        "pos": {
          "l": 8.1,
          "t": 47,
          "w": 12.8,
          "r": -4
        }
      },
      {
        "slug": "mask",
        "name": "Pure Silk Sleep Mask in Black",
        "brand": "Slip",
        "store": "Slip",
        "price": 72,
        "url": "https://www.slip.com/products/sleep-mask-black",
        "img": "/gift-guide/scorpio/mask.webp",
        "why": "At 2am her brain is running a full investigation into a text from 2019. Mulberry silk blacks out the world so she can finally switch off, and it saves her lashes and her blowout while she's at it.",
        "pos": {
          "l": 28,
          "t": 49.8,
          "w": 30,
          "r": -6
        }
      },
      {
        "slug": "blush",
        "name": "Powder Mini Blush in Orgasm",
        "brand": "NARS",
        "store": "NARS",
        "price": 18,
        "url": "https://www.narscosmetics.com/USA/powder-mini-blush/999NAC0000193.html",
        "img": "/gift-guide/scorpio/blush.webp",
        "why": "It's called Orgasm and she's a Scorpio, so this one picked itself. The peachy pink with gold shimmer gives her the flush of someone who just got away with something, and the mini lives in her bag for touch-ups between secrets.",
        "pos": {
          "l": 74,
          "t": 54.2,
          "w": 20,
          "r": -8
        }
      },
      {
        "slug": "candle",
        "name": "Baies Candle, 190g",
        "brand": "Diptyque",
        "store": "Diptyque",
        "price": 90,
        "url": "https://us.diptyqueparis.com/en-us/products/classic-candle-baies-berries-b2",
        "img": "/gift-guide/scorpio/candle.webp",
        "why": "Blackcurrant leaves and rose burning on her nightstand while she journals about her ex in forensic detail. Make the bedroom smell like a secret, because to a Scorpio the bedroom IS the main room.",
        "pos": {
          "l": 31,
          "t": 62,
          "w": 20,
          "r": -7
        }
      },
      {
        "slug": "bra",
        "name": "Fits Everybody Lace Scoop Bralette in Onyx",
        "brand": "SKIMS",
        "store": "SKIMS",
        "price": 38,
        "url": "https://skims.com/products/fits-everybody-lace-scoop-bralette-onyx",
        "img": "/gift-guide/scorpio/bra.webp",
        "why": "Strictly for whoever's sharing her bed. Scorpio runs on desire and likes to feel dangerous under a turtleneck, so black lace she'd wear for herself is the move (a gift card if you don't know her size, obviously).",
        "pos": {
          "l": 5.6,
          "t": 66,
          "w": 18.8,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "The gift that's ACTUALLY about her. A report made by hand from her own birth chart: exactly what kind of baddie her Scorpio Sun is, where she's been shrinking and what switches her on. It lands in 48 hours, way before Christmas Eve.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "sagittarius": {
    "sign": "sagittarius",
    "ruler": "Jupiter",
    "coverline": "How to gift the girl who already booked the one-way flight",
    "headline": [
      "Pack light,",
      "go far"
    ],
    "intro": "Sagittarius is ruled by Jupiter, the planet of luck and expansion, and holds the 9th house of long-haul travel, big ideas and the story she'll tell at the next party. She'd rather have a memory than a thing, so the gift that wins is one that comes WITH her, ideally in a carry-on, on her way to somewhere with a passport stamp.",
    "gifts": [
      {
        "slug": "carry-on",
        "name": "The Carry-On Roller",
        "brand": "Béis",
        "store": "Béis",
        "price": 268,
        "url": "https://beistravel.com/products/the-carry-on-roller-in-maple",
        "img": "/gift-guide/sagittarius/carry-on.webp",
        "why": "The carry-on with a cushioned handle, a laundry pocket and wheels that glide through every airport she'll ever sprint across. More stamps in the passport means the luggage has to keep up.",
        "pos": {
          "l": 7.4,
          "t": 21,
          "w": 11.1,
          "r": -6
        }
      },
      {
        "slug": "citrine-necklace",
        "name": "Citrine Phantom Necklace",
        "brand": "Energy Muse",
        "store": "Energy Muse",
        "price": 88.88,
        "url": "https://energymuse.com/products/citrine-phantom-necklace",
        "img": "/gift-guide/sagittarius/citrine-necklace.webp",
        "why": "Citrine is the sunny crystal of luck and abundance, which is Jupiter's entire job description. She'll wear it on every flight she books on a whim.",
        "pos": {
          "l": 36.8,
          "t": 23,
          "w": 10.3,
          "r": 12
        }
      },
      {
        "slug": "packing-cubes",
        "name": "Packing Cubes Set, 5 Pieces",
        "brand": "Calpak",
        "store": "Calpak",
        "price": 68,
        "url": "https://www.calpaktravel.com/products/packing-cubes-5-piece-set",
        "img": "/gift-guide/sagittarius/packing-cubes.webp",
        "why": "Five packing cubes that make her suitcase look like a magazine spread. Sag over-packs for adventure, and these let her fit every bit of it in.",
        "pos": {
          "l": 63,
          "t": 35.8,
          "w": 22,
          "r": 7
        }
      },
      {
        "slug": "variety-loop",
        "name": "Variety Loop",
        "brand": "LOOPS",
        "store": "LOOPS",
        "price": 30,
        "url": "https://loopsbeauty.com/products/variety-loop",
        "img": "/gift-guide/sagittarius/variety-loop.webp",
        "why": "A stack of sheet masks for the long-haul flight, so she lands looking like she slept. The whole cabin will stare and she will not care.",
        "pos": {
          "l": 5,
          "t": 47.8,
          "w": 19,
          "r": -4
        }
      },
      {
        "slug": "fanny-pack",
        "name": "Jax Large Fanny Pack",
        "brand": "Dagne Dover",
        "store": "Dagne Dover",
        "price": 130,
        "url": "https://www.dagnedover.com/products/jax-large-fanny-pack-dune",
        "img": "/gift-guide/sagittarius/fanny-pack.webp",
        "why": "A neoprene belt bag that keeps her passport, phone and balm hands-free while she explores. She'll wear it across her chest through every market in the world.",
        "pos": {
          "l": 28.5,
          "t": 48,
          "w": 28.9,
          "r": -6
        }
      },
      {
        "slug": "carryall-trio",
        "name": "Getaway Carryall Trio",
        "brand": "Ban.do",
        "store": "Ban.do",
        "price": 29.95,
        "url": "https://www.bando.com/products/getaway-carryall-trio-dont-worry-baby",
        "img": "/gift-guide/sagittarius/carryall-trio.webp",
        "why": "Three zip pouches for chargers, liquids and the snacks she's technically not meant to bring. The red one says don't worry baby, which is how Sag lives.",
        "pos": {
          "l": 74,
          "t": 54.7,
          "w": 20,
          "r": -8
        }
      },
      {
        "slug": "wild",
        "name": "Wild",
        "brand": "Cheryl Strayed",
        "store": "Bookshop.org",
        "price": 17,
        "url": "https://bookshop.org/book/9780307476074",
        "img": "/gift-guide/sagittarius/wild.webp",
        "why": "A woman hikes more than a thousand miles of the Pacific Crest Trail alone to put her life back together. Sag will read it on a plane and book a hike before she lands.",
        "pos": {
          "l": 31.3,
          "t": 62,
          "w": 19.4,
          "r": -7
        }
      },
      {
        "slug": "cheirosa-68",
        "name": "Cheirosa 68 Perfume Mist",
        "brand": "Sol de Janeiro",
        "store": "Sol de Janeiro",
        "price": 26,
        "url": "https://soldejaneiro.com/products/cheirosa-68-perfume-mist",
        "img": "/gift-guide/sagittarius/cheirosa-68.webp",
        "why": "A beachy mist in a travel-friendly bottle that smells like Rio, even if she hasn't been yet. Spray, board, flirt with the person in 14C.",
        "pos": {
          "l": 11.1,
          "t": 66,
          "w": 7.9,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "A hand-made read of her chart showing where a Jupiter-ruled baddie gets lucky, and which big leap her chart has been pointing at. It lands in 48 hours, before her next flight.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "capricorn": {
    "sign": "capricorn",
    "ruler": "Saturn",
    "coverline": "How to gift the girl with a five-year plan and a backup plan",
    "headline": [
      "Built like a",
      "CEO"
    ],
    "intro": "Capricorn is ruled by Saturn and holds the 10th house of career, status and legacy, so she's been running her life like a company since she was eleven. She respects quality, hates clutter and secretly loves a little luxury, so give her something polished she'll use every working day, the kind of gift that makes her look even more expensive in the meeting.",
    "gifts": [
      {
        "slug": "millionaires",
        "name": "We Should All Be Millionaires",
        "brand": "Rachel Rodgers",
        "store": "Bookshop.org",
        "price": 18.99,
        "url": "https://bookshop.org/book/9781400221622",
        "img": "/gift-guide/capricorn/millionaires.webp",
        "why": "A money book for women who are done being polite about getting paid. Capricorn will finish it with a business plan and a raise request.",
        "pos": {
          "l": 5,
          "t": 22.2,
          "w": 16,
          "r": -6
        }
      },
      {
        "slug": "ember-travel",
        "name": "Ember Travel Mug 2",
        "brand": "Ember",
        "store": "Ember",
        "price": 199.95,
        "url": "https://ember.com/products/ember-travel-mug-2",
        "img": "/gift-guide/capricorn/ember-travel.webp",
        "why": "A smart travel mug that keeps her coffee at the exact temperature she picked for up to three hours. The CEO accessory for a girl whose meetings always run long.",
        "pos": {
          "l": 37,
          "t": 23,
          "w": 10,
          "r": 12
        }
      },
      {
        "slug": "signature-lipstick",
        "name": "Signature Lipstick",
        "brand": "Merit",
        "store": "Merit",
        "price": 28,
        "url": "https://www.meritbeauty.com/products/signature-lip",
        "img": "/gift-guide/capricorn/signature-lipstick.webp",
        "why": "A comfortable satin lipstick in a gold bullet for the girl who reapplies before the big pitch. Polished without trying, her favorite way to be.",
        "pos": {
          "l": 64.6,
          "t": 31,
          "w": 18.8,
          "r": 7
        }
      },
      {
        "slug": "easy-tote",
        "name": "Classic Easy Tote",
        "brand": "Cuyana",
        "store": "Cuyana",
        "price": 298,
        "url": "https://cuyana.com/products/classic-easy-tote",
        "img": "/gift-guide/capricorn/easy-tote.webp",
        "why": "A leather tote that fits her laptop, her planner and her ambitions, and lasts a decade. Capricorn buys once and buys well.",
        "pos": {
          "l": 5,
          "t": 47,
          "w": 18.9,
          "r": -4
        }
      },
      {
        "slug": "planner",
        "name": "Large 17-Month Planner",
        "brand": "Ban.do",
        "store": "Ban.do",
        "price": 34.95,
        "url": "https://www.bando.com/products/large-17-month-academic-planner-good-things-ahead",
        "img": "/gift-guide/capricorn/planner.webp",
        "why": "Seventeen months to plan the empire, with a cover that promises good things ahead. Capricorn writes her goals down, then hits every one.",
        "pos": {
          "l": 36.3,
          "t": 48,
          "w": 13.5,
          "r": -6
        }
      },
      {
        "slug": "what-the-foundation",
        "name": "What The Foundation",
        "brand": "Jones Road",
        "store": "Jones Road",
        "price": 46,
        "url": "https://www.jonesroadbeauty.com/products/what-the-foundation",
        "img": "/gift-guide/capricorn/what-the-foundation.webp",
        "why": "A skin-tint balm that gives her an even, healthy finish in about thirty seconds. Capricorn rules the skin, and she has no time for a twelve-step face.",
        "pos": {
          "l": 74,
          "t": 54.3,
          "w": 20,
          "r": -8
        }
      },
      {
        "slug": "revealer",
        "name": "Revealer Concealer",
        "brand": "Kosas",
        "store": "Kosas",
        "price": 32,
        "url": "https://kosas.com/products/revealer-concealer",
        "img": "/gift-guide/capricorn/revealer.webp",
        "why": "Skincare-packed concealer that makes her look rested when she's been answering emails since 5am. Never let them see you tired.",
        "pos": {
          "l": 31,
          "t": 62.1,
          "w": 20,
          "r": -7
        }
      },
      {
        "slug": "wine-tumbler",
        "name": "The Textured Reserve Wine Tumbler",
        "brand": "Stanley",
        "store": "Stanley",
        "price": 25,
        "url": "https://www.stanley1913.com/products/the-textured-reserve-wine-tumbler-11-oz",
        "img": "/gift-guide/capricorn/wine-tumbler.webp",
        "why": "An insulated tumbler for the 6pm glass after she closes the deal. Saturn girls work hard, so build the reward in on purpose.",
        "pos": {
          "l": 5.7,
          "t": 66,
          "w": 18.6,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "Her chart, read by hand, showing a Saturn-ruled baddie the career she's built for and the shadow that's been slowing her down. It lands in 48 hours, ahead of schedule.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "aquarius": {
    "sign": "aquarius",
    "ruler": "Uranus",
    "coverline": "How to gift the girl who hates whatever everyone else is buying",
    "headline": [
      "Weird gifts for a",
      "genius"
    ],
    "intro": "Aquarius is ruled by Uranus, the planet of shocks and big ideas, and holds the 11th house of friends, community and the future, so she's three trends ahead of everyone and a tiny bit annoyed you only just caught up. Skip the obvious, go a little odd, and pick something with clever tech or a big idea she can talk about at the next dinner party.",
    "gifts": [
      {
        "slug": "fenty-parfum",
        "name": "Fenty Eau de Parfum",
        "brand": "Fenty Beauty",
        "store": "Fenty Beauty",
        "price": 39,
        "url": "https://fentybeauty.com/products/fenty-eau-de-parfum",
        "img": "/gift-guide/aquarius/fenty-parfum.webp",
        "why": "Rihanna's own perfume, warm, musky and a little unexpected. Aquarius refuses to smell like everyone else at the party.",
        "pos": {
          "l": 5,
          "t": 21.3,
          "w": 16,
          "r": -6
        }
      },
      {
        "slug": "lip-jelly",
        "name": "ShineOn Lip Oil Jelly",
        "brand": "Tower 28",
        "store": "Tower 28",
        "price": 16,
        "url": "https://www.tower28beauty.com/products/shine-on-lip-gloss-jelly",
        "img": "/gift-guide/aquarius/lip-jelly.webp",
        "why": "A glossy lip jelly in a bright tint, made for sensitive skin. Fun, a bit unexpected, exactly her.",
        "pos": {
          "l": 39.4,
          "t": 23,
          "w": 5.2,
          "r": 12
        }
      },
      {
        "slug": "kush-candle",
        "name": "Kush Candle",
        "brand": "Boy Smells",
        "store": "Boy Smells",
        "price": 44,
        "url": "https://boysmells.com/products/kush-candle-standard-9oz",
        "img": "/gift-guide/aquarius/kush-candle.webp",
        "why": "A candle with a cheeky name in a cool matte jar, for the after-party everybody ends up at, which is her place. Very her, very conversation-starter.",
        "pos": {
          "l": 63,
          "t": 31.5,
          "w": 22,
          "r": 7
        }
      },
      {
        "slug": "ember-mug",
        "name": "Ember Mug 2",
        "brand": "Ember",
        "store": "Ember",
        "price": 89.99,
        "url": "https://ember.com/products/ember-mug-2",
        "img": "/gift-guide/aquarius/ember-mug.webp",
        "why": "A smart mug that keeps her tea at her exact temperature, controlled from an app. Uranus rules tech, and this is the gadget she'll use every single day.",
        "pos": {
          "l": 5,
          "t": 47.4,
          "w": 19,
          "r": -4
        }
      },
      {
        "slug": "hydro-stars",
        "name": "Hydro-Stars + Big Pink",
        "brand": "Starface",
        "store": "Starface",
        "price": 14.99,
        "url": "https://starface.world/products/big-pink",
        "img": "/gift-guide/aquarius/hydro-stars.webp",
        "why": "Star-shaped pimple patches that turn a breakout into a look. Aquarius has never tried to blend in, and her skin doesn't have to either.",
        "pos": {
          "l": 33.1,
          "t": 48,
          "w": 19.8,
          "r": -6
        }
      },
      {
        "slug": "wonder-oven",
        "name": "Wonder Oven",
        "brand": "Our Place",
        "store": "Our Place",
        "price": 185,
        "url": "https://fromourplace.com/products/wonder-oven",
        "img": "/gift-guide/aquarius/wonder-oven.webp",
        "why": "An air fryer and countertop oven in one gorgeous box. Aquarius loves a gadget that does a whole kitchen's job.",
        "pos": {
          "l": 76.2,
          "t": 54,
          "w": 15.6,
          "r": -8
        }
      },
      {
        "slug": "pleasure-activism",
        "name": "Pleasure Activism",
        "brand": "adrienne maree brown",
        "store": "Bookshop.org",
        "price": 20,
        "url": "https://bookshop.org/book/9781849353267",
        "img": "/gift-guide/aquarius/pleasure-activism.webp",
        "why": "On making justice and liberation feel GOOD, which is the most Aquarian idea ever put in print. She'll pass it around her friends like a zine.",
        "pos": {
          "l": 31.6,
          "t": 62,
          "w": 18.7,
          "r": -7
        }
      },
      {
        "slug": "clear-case",
        "name": "Tiny Clear Cosmetics Case",
        "brand": "Calpak",
        "store": "Calpak",
        "price": 42,
        "url": "https://www.calpaktravel.com/products/tiny-clear-cosmetics-case",
        "img": "/gift-guide/aquarius/clear-case.webp",
        "why": "A see-through zip case so she can spot everything inside at once. Very future, very airport-security friendly.",
        "pos": {
          "l": 5,
          "t": 67.6,
          "w": 20,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "A hand-made read of her chart that shows a Uranus-ruled baddie which big idea she's here to start and who her people are. It lands in 48 hours, faster than any subscription box.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  },
  "pisces": {
    "sign": "pisces",
    "ruler": "Neptune",
    "coverline": "How to gift the girl who cries at the Christmas ads and means it",
    "headline": [
      "Soft, dreamy and",
      "a little magic"
    ],
    "intro": "Pisces is ruled by Neptune, the planet of dreams, and holds the 12th house of the subconscious, the spiritual and everything that happens after midnight. She feels the whole world at once, so the gift she treasures is one that lets her float: something soft for her feet, something dreamy to smell, something that turns bedtime into a ritual.",
    "gifts": [
      {
        "slug": "jet-lag-mini",
        "name": "Jet Lag Mask, Mini",
        "brand": "Summer Fridays",
        "store": "Summer Fridays",
        "price": 26,
        "url": "https://www.summerfridays.com/products/mini-jet-lag-mask",
        "img": "/gift-guide/pisces/jet-lag-mini.webp",
        "why": "The cult hydrating mask in a travel size, for the girl who looks after everyone's feelings and forgets her own skin. Ten minutes and she looks like she slept for a week.",
        "pos": {
          "l": 6,
          "t": 21,
          "w": 14,
          "r": -6
        }
      },
      {
        "slug": "sunlit-vanilla",
        "name": "Sunlit Vanilla Eau de Parfum",
        "brand": "Summer Fridays",
        "store": "Summer Fridays",
        "price": 82,
        "url": "https://www.summerfridays.com/products/sunlit-vanilla-eau-de-parfum",
        "img": "/gift-guide/pisces/sunlit-vanilla.webp",
        "why": "A warm vanilla perfume that smells like a daydream. She'll spray it on her wrists before bed and see what she dreams about.",
        "pos": {
          "l": 36.1,
          "t": 23,
          "w": 11.7,
          "r": 12
        }
      },
      {
        "slug": "cashmere-sock",
        "name": "Cashmere Mesh Sock, Vintage Pink",
        "brand": "Alo",
        "store": "Alo",
        "price": 68,
        "url": "https://www.aloyoga.com/products/a0930u-cashmere-mesh-sock-vintage-pink",
        "img": "/gift-guide/pisces/cashmere-sock.webp",
        "why": "Pisces rules the feet, so wrap hers in cashmere. Soft enough for padding around the house, cute enough for pilates.",
        "pos": {
          "l": 65.3,
          "t": 31,
          "w": 17.3,
          "r": 7
        }
      },
      {
        "slug": "pima-robe",
        "name": "Pima Robe, Hydrangea",
        "brand": "Lake",
        "store": "Lake Pajamas",
        "price": 134,
        "url": "https://lakepajamas.com/products/hydrangea-robe",
        "img": "/gift-guide/pisces/pima-robe.webp",
        "why": "A soft pima cotton robe in a pale, dreamy blue for her bath-then-tarot evenings. She'll put it on and float.",
        "pos": {
          "l": 7.7,
          "t": 47,
          "w": 13.7,
          "r": -4
        }
      },
      {
        "slug": "balm-dotcom",
        "name": "Balm Dotcom",
        "brand": "Glossier",
        "store": "Glossier",
        "price": 16,
        "url": "https://www.glossier.com/products/balm-dotcom",
        "img": "/gift-guide/pisces/balm-dotcom.webp",
        "why": "The cult salve for lips and dry patches, always in her coat pocket. A tiny comfort for the most tender sign in the zodiac.",
        "pos": {
          "l": 38.3,
          "t": 48,
          "w": 9.3,
          "r": -6
        }
      },
      {
        "slug": "amethyst",
        "name": "Amethyst Generator, Medium",
        "brand": "Energy Muse",
        "store": "Energy Muse",
        "price": 54.88,
        "url": "https://energymuse.com/products/amethyst-generator",
        "img": "/gift-guide/pisces/amethyst.webp",
        "why": "Amethyst is the dream stone, deep purple and kept by the bed for intuition and better sleep. Neptune girls feel it in the room.",
        "pos": {
          "l": 76.1,
          "t": 54,
          "w": 15.8,
          "r": -8
        }
      },
      {
        "slug": "alchemist",
        "name": "The Alchemist",
        "brand": "Paulo Coelho",
        "store": "Bookshop.org",
        "price": 17.99,
        "url": "https://bookshop.org/book/9780062315007",
        "img": "/gift-guide/pisces/alchemist.webp",
        "why": "A short, magical fable about following your dream and reading the signs. Pisces will finish it in one night and decide the universe is talking to her, because it is.",
        "pos": {
          "l": 31.1,
          "t": 62,
          "w": 19.8,
          "r": -7
        }
      },
      {
        "slug": "beija-flor-jet-set",
        "name": "Beija Flor Jet Set",
        "brand": "Sol de Janeiro",
        "store": "Sol de Janeiro",
        "price": 34,
        "url": "https://soldejaneiro.com/products/beija-flor-jet-set",
        "img": "/gift-guide/pisces/beija-flor-jet-set.webp",
        "why": "The cherry and vanilla body wash, cream and mist in a pink travel pouch. She'll smell soft and sweet all winter long.",
        "pos": {
          "l": 5.3,
          "t": 66,
          "w": 19.4,
          "r": 5
        }
      },
      {
        "slug": "bad-btch-report",
        "name": "The Bad B*tch Report",
        "brand": "MY SZN",
        "store": "MY SZN",
        "price": 88,
        "url": "https://itsmyszn.com/reports/bad-btch-report",
        "ours": true,
        "img": "",
        "why": "Her chart, read by hand, showing a Neptune-ruled baddie how to turn all that intuition into money and power. It lands in her inbox in 48 hours, as if by magic.",
        "pos": {
          "l": 59,
          "t": 66,
          "w": 22.9,
          "r": 6
        }
      }
    ]
  }
};

export function isGiftSign(s: string): s is GiftSign {
  return (GIFT_SIGNS as readonly string[]).includes(s);
}
