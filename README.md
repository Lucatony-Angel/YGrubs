# YGrubs

YGrubs is a pickup-focused web app that helps Yale students find food options near their residential college that fit a target budget.

Users select a college and budget, then receive ranked restaurant results with a suggested meal combo under budget, plus distance and estimated walking time.

## Why This Project

College students often need a quick answer to:

> "What can I pick up nearby right now that I can afford?"

I built YGrubs to solve that in one search flow with transparent ranking logic and a mobile-friendly UI.

## Highlights

- Built an end-to-end React + TypeScript product from problem definition through deployment-ready build.
- Modeled and normalized local data for `10` restaurants, `14` Yale colleges, and `170` menu items.
- Implemented a deterministic recommendation algorithm with clear ranking and tie-break behavior.
- Added user-facing validation and empty/error states for invalid budgets and no-match scenarios.
- Verified recommendation outputs across multiple budget tiers and college inputs (`app/QA_NOTES.md`).

## My Role

Solo developer responsible for:

- Product scope and UX flow definition.
- Data modeling for colleges, restaurant distances, and menu items.
- Recommendation algorithm design and implementation.
- Frontend implementation with React + TypeScript.
- QA pass documentation and deployment readiness.

## Features

- College-based search origin (all Yale residential colleges included).
- Budget-aware combo generation with four templates:
  - `main`
  - `main+side`
  - `main+drink`
  - `main+side+drink`
- Filters results to a `1.3` mile pickup radius.
- Ranks by:
  1. Distance (ascending)
  2. Value score (descending tie-break)
- Shows per-result:
  - Suggested combo
  - Total combo price
  - Walking distance
  - Estimated walk time
  - Value score tier

## Tech Stack

- Frontend: React 19, TypeScript, Vite
- Styling: CSS
- Tooling: ESLint, TypeScript compiler
- Analytics: `@vercel/speed-insights`

## Recommendation Logic (High Level)

1. Split each restaurant's menu into `main`, `side`, and `drink` categories.
2. Generate all valid combo candidates under the user's budget for the supported templates.
3. Score each combo using:
   - Template weight
   - Budget fit (closer to budget is better)
   - Average item rating (when available)
4. Select each restaurant's best combo.
5. Sort all restaurants by distance first, then score.

Core implementation:

- `app/src/Lib/reccomend.ts`
- `app/src/data/restaurants.ts`
- `app/src/App.tsx`

## Engineering Decisions

- Curated dataset over live API integration:
  - Chosen to deliver a reliable MVP quickly with deterministic outputs and no external API dependency risk.
- Distance-first ranking, value-score tiebreak:
  - Prioritizes practical pickup convenience while still rewarding better budget-fit meal options.
- Deterministic scoring instead of personalized ranking:
  - Makes behavior predictable, easier to test, and simpler to explain during code review.

## Project Structure

```text
app/
  src/
    App.tsx                  # Search flow + results rendering
    Lib/reccomend.ts         # Combo generation and scoring
    data/restaurants.ts      # Colleges, restaurants, menu data, distances
    main.tsx                 # App bootstrap + Speed Insights
  QA_NOTES.md                # Manual QA snapshots and result matrix
```

## Run Locally

Requirements:

- Node.js `20.19+` (Vite 7 requirement)
- npm

Commands:

```bash
cd app
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Available Scripts

From `app/`:

- `npm run dev` - Start local dev server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Quality and Validation

- Manual QA documented in `app/QA_NOTES.md` across multiple colleges and budgets.
- Build passes with production output generation via `npm run build`.

## Product Constraints

- Pickup-only recommendations (no delivery or checkout flow).
- Uses curated menu data (no live delivery API integration).
- Focused on Yale/New Haven geography for v1.

## Known Limitations

- Menu prices and item availability are static and may drift from real-world changes.
- No authentication, saved preferences, or recommendation history.
- Ranking is rules-based and not yet adapted to individual user behavior.
- No automated unit/integration test suite yet for recommendation logic.

## Links

- Live Demo: https://y-grubs.vercel.app/
- LinkedIn: https://www.linkedin.com/in/lucatony-angel-valencia-024877243/ (project is listed under the Projects section)
