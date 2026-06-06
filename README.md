# My Szn — Birth Chart Generator

Western Tropical astrology birth chart generator using the Placidus house system, powered by the Swiss Ephemeris.

## Features

- **13 celestial bodies**: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, North Node, South Node
- **Full chart data**: sign, degree, house, and retrograde status for each placement
- **12 house cusps** (Placidus system)
- **Major aspects**: conjunction, sextile, square, trine, opposition with orbs
- **Planetary rulerships** (traditional and modern)
- **SVG chart wheel** with element-colored signs, aspect lines, and planet glyphs
- **Timezone handling**: IANA timezone identifiers via Luxon with full DST/historical support
- **Shareable URLs** with birth data encoded in query params
- **JSON export** for future interpretation layers
- **Print-friendly** layout

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Swiss Ephemeris (`swisseph` npm package) — runs as Node.js API route
- Luxon for timezone/datetime handling
- Google Places API for location autocomplete (optional)

## Setup

```bash
cd app
npm install
```

### Environment Variables (optional)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set your Google API key if you want Places autocomplete:

```
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key
GOOGLE_TIMEZONE_API_KEY=your_key
```

The app works without Google API keys — it falls back to manual location entry (city, latitude, longitude, IANA timezone).

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
npx jest
```

Tests verify chart calculation accuracy against Astro.com reference data for a known birth chart (Aug 4, 1961, 7:24 PM, Honolulu, Hawaii).

### Build

```bash
npm run build
npm start
```

## Pages

- `/` — Homepage
- `/chart` — Birth data entry form
- `/results` — Chart results (shareable via URL)

## Project Structure

```
app/
├── ephe/                    # Swiss Ephemeris data files
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── calculate/   # Chart calculation endpoint
│   │   │   └── timezone/    # Google Timezone API proxy
│   │   ├── chart/           # Birth data form page
│   │   └── results/         # Chart results page
│   ├── components/
│   │   ├── BirthDataForm.tsx
│   │   ├── ChartResults.tsx
│   │   ├── ChartWheel.tsx   # SVG chart wheel
│   │   └── PlacesAutocomplete.tsx
│   ├── lib/
│   │   ├── astrology.ts     # Chart calculation engine
│   │   └── url-params.ts    # URL encoding/decoding
│   └── types/
│       └── chart.ts         # TypeScript types and constants
└── __tests__/
    └── astrology.test.ts    # Calculation accuracy tests
```

## Sample Chart

The test suite generates a chart for someone born **August 4, 1961 at 7:24 PM in Honolulu, Hawaii** and verifies:

- Sun in Leo (12°32')
- Moon in Gemini (3°21')
- Ascendant in Aquarius (~18°)
- Jupiter Rx in Aquarius
- Saturn Rx in Capricorn
- Correct UTC conversion (HST to UTC: Aug 5, 05:24)

## Adding Interpretation Content

The chart engine outputs a complete `ChartData` JSON object. To add interpretations:

1. Create interpretation data in `src/lib/interpretations/`
2. Map planet sign/house combinations to text
3. Add an interpretation component that reads from `ChartData`
